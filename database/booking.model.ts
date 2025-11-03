import mongoose, { Schema, model, models, Document, Types } from 'mongoose'
import { Event } from './event.model'

// Strongly-typed Booking document
export interface BookingDocument extends Document {
  eventId: Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

const BookingSchema = new Schema<BookingDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true }, // indexed for faster event lookups
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => emailRegex.test(v),
        message: 'email must be a valid email address',
      },
    },
  },
  { timestamps: true, versionKey: false }
)

// Additional index for eventId (explicit, even though field-level index is set)
BookingSchema.index({ eventId: 1 })

// Pre-save: verify that referenced Event exists and email is valid
BookingSchema.pre('save', async function (next) {
  try {
    // Validate referenced event existence only when new or eventId changed
    if (this.isNew || this.isModified('eventId')) {
      const exists = await Event.exists({ _id: this.eventId })
      if (!exists) return next(new Error('Referenced event does not exist'))
    }

    // Redundant safeguard (schema-level validator already handles this)
    if (!emailRegex.test(this.email)) {
      return next(new Error('email must be a valid email address'))
    }

    next()
  } catch (err) {
    next(err as Error)
  }
})

export const Booking = (models.Booking as mongoose.Model<BookingDocument>) || model<BookingDocument>('Booking', BookingSchema)
