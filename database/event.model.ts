import mongoose, { Schema, model, models, Document } from 'mongoose'

// Strongly-typed Event document
export interface EventDocument extends Document {
  title: string
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  date: string // normalized as YYYY-MM-DD
  time: string // normalized as HH:mm (24h)
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// Basic, dependency-free slug generator
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Normalize date strings to YYYY-MM-DD (ISO calendar date)
function normalizeDate(input: string): string {
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) {
    throw new Error('Invalid date format; expected a parseable date (e.g., 2025-03-01)')
  }
  return d.toISOString().slice(0, 10)
}

// Normalize time to 24h HH:mm, tolerant of "h:mm AM/PM", "HH:mm", "HH:mm:ss"
function normalizeTime(input: string): string {
  const raw = input.trim().toLowerCase()

  // Try patterns like "h", "hh", "h:mm", "hh:mm", optionally with am/pm
  const m = raw.match(/^(\d{1,2})(?::(\d{2})(?::\d{2})?)?\s*([ap]m)?$/i)
  if (!m) throw new Error('Invalid time format; use HH:mm or h:mm AM/PM')

  let hours = parseInt(m[1], 10)
  const minutes = m[2] ? parseInt(m[2], 10) : 0
  const ampm = m[3]?.toLowerCase()

  if (minutes < 0 || minutes > 59) throw new Error('Minutes must be between 00 and 59')
  if (hours < 0 || hours > 23) {
    // If 12h with am/pm, adjust after validation below
    if (!ampm) throw new Error('Hours must be between 0 and 23 for 24h time')
  }

  if (ampm) {
    if (hours < 1 || hours > 12) throw new Error('Hours must be 1-12 when using AM/PM')
    if (ampm === 'pm' && hours !== 12) hours += 12
    if (ampm === 'am' && hours === 12) hours = 0
  }

  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  return `${hh}:${mm}`
}

const nonEmpty = (v: unknown): boolean => typeof v === 'string' && v.trim().length > 0
const nonEmptyStrArray = (arr: unknown): boolean =>
  Array.isArray(arr) && arr.length > 0 && arr.every((s) => typeof s === 'string' && s.trim().length > 0)

const EventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true, trim: true, validate: [nonEmpty, 'title is required'] },
    slug: { type: String, required: true, trim: true, unique: true, index: true }, // unique, generated from title
    description: { type: String, required: true, trim: true, validate: [nonEmpty, 'description is required'] },
    overview: { type: String, required: true, trim: true, validate: [nonEmpty, 'overview is required'] },
    image: { type: String, required: true, trim: true, validate: [nonEmpty, 'image is required'] },
    venue: { type: String, required: true, trim: true, validate: [nonEmpty, 'venue is required'] },
    location: { type: String, required: true, trim: true, validate: [nonEmpty, 'location is required'] },
    date: { type: String, required: true, trim: true, validate: [nonEmpty, 'date is required'] },
    time: { type: String, required: true, trim: true, validate: [nonEmpty, 'time is required'] },
    mode: { type: String, required: true, trim: true, validate: [nonEmpty, 'mode is required'] },
    audience: { type: String, required: true, trim: true, validate: [nonEmpty, 'audience is required'] },
    agenda: { type: [String], required: true, validate: [nonEmptyStrArray, 'agenda must be a non-empty string array'] },
    organizer: { type: String, required: true, trim: true, validate: [nonEmpty, 'organizer is required'] },
    tags: { type: [String], required: true, validate: [nonEmptyStrArray, 'tags must be a non-empty string array'] },
  },
  { timestamps: true, versionKey: false }
)

// Ensure unique slug at DB level as well
EventSchema.index({ slug: 1 }, { unique: true })

// Pre-save: generate slug (only if title changed) and normalize date/time
EventSchema.pre('save', function (next) {
  try {
    if (this.isModified('title')) {
      const generated = slugify(this.title)
      if (!generated) return next(new Error('Unable to generate slug from title'))
      this.slug = generated
    }

    if (this.isModified('date')) {
      this.date = normalizeDate(this.date)
    }

    if (this.isModified('time')) {
      this.time = normalizeTime(this.time)
    }

    // Final safety: ensure required trimmed strings are non-empty
    const requiredStrings: Array<keyof EventDocument> = [
      'title',
      'description',
      'overview',
      'image',
      'venue',
      'location',
      'date',
      'time',
      'mode',
      'audience',
      'organizer',
    ]
    for (const key of requiredStrings) {
      const val = String(this.get(key) ?? '').trim()
      if (!val) return next(new Error(`${String(key)} is required`))
    }

    if (!Array.isArray(this.agenda) || this.agenda.length === 0 || this.agenda.some((s) => !nonEmpty(s))) {
      return next(new Error('agenda must be a non-empty array of strings'))
    }
    if (!Array.isArray(this.tags) || this.tags.length === 0 || this.tags.some((s) => !nonEmpty(s))) {
      return next(new Error('tags must be a non-empty array of strings'))
    }

    next()
  } catch (err) {
    next(err as Error)
  }
})

export const Event = (models.Event as mongoose.Model<EventDocument>) || model<EventDocument>('Event', EventSchema)
