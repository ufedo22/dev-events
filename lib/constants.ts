export type Event = {
  id: string;
  title: string;
  image: string; // path under /images (public folder)
  slug: string;
  location: string;
  date: string;
  time: string;
  description: string;
  link: string;
  tags?: string[];
  organizer?: string;
};

export const events: Event[] = [
  {
    id: "nextjs-conf-2026",
    title: "Next.js Conf 2026",
    image: "/images/event-full.png",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA (hybrid)",
    date: "May 12–13, 2026",
    time: "09:00 — 18:00 PT",
    description:
      "Official Next.js conference with talks, workshops, and community sessions focused on React, server-side rendering, and edge-first architectures.",
    link: "https://nextjs.org/conf",
    tags: ["next.js", "react", "ssr"],
    organizer: "Vercel",
  },

  {
    id: "react-summit-2026",
    title: "React Summit 2026",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands",
    date: "June 2–3, 2026",
    time: "09:30 — 17:00 CEST",
    description:
      "One of the largest React gatherings in Europe — workshops, keynotes and community tracks covering React, state management, and ecosystem tooling.",
    link: "https://reactsummit.com",
    tags: ["react", "frontend", "web"],
    organizer: "React Summit Org",
  },

  {
    id: "jsconf-budapest-2026",
    title: "JSConf Budapest",
    image: "/images/event2.png",
    slug: "jsconf-budapest-2026",
    location: "Budapest, Hungary",
    date: "April 22–24, 2026",
    time: "10:00 — 18:00 CEST",
    description:
      "A community-run JavaScript conference focusing on modern JS, tooling, and language evolution with hands-on workshops and lightning talks.",
    link: "https://jsconf.com/budapest",
    tags: ["javascript", "node", "tools"],
    organizer: "JSConf Community",
  },

  {
    id: "github-universe-2025",
    title: "GitHub Universe 2025",
    image: "/images/event3.png",
    slug: "github-universe-2025",
    location: "New York, NY",
    date: "November 18–19, 2025",
    time: "10:00 — 17:30 ET",
    description:
      "Annual GitHub flagship event showcasing the latest in developer tools, platform updates, and open source best practices.",
    link: "https://github.com/universe",
    tags: ["devtools", "open-source", "platform"],
    organizer: "GitHub",
  },

  {
    id: "hackmit-2026",
    title: "HackMIT 2026",
    image: "/images/event4.png",
    slug: "hackmit-2026",
    location: "Cambridge, MA (on-campus)",
    date: "January 17–18, 2026",
    time: "18:00 — 18:00 (24hr hackathon)",
    description:
      "Student-run hackathon bringing students from around the world to build, learn, and network — beginner-friendly with mentors and workshops.",
    link: "https://hackmit.org",
    tags: ["hackathon", "students", "projects"],
    organizer: "HackMIT",
  },

  {
    id: "serverless-days-2026",
    title: "Serverless Days 2026",
    image: "/images/event5.png",
    slug: "serverless-days-2026",
    location: "Online & Berlin, Germany",
    date: "March 11, 2026",
    time: "09:00 — 16:30 CET",
    description:
      "A community conference covering serverless architectures, edge computing, and cloud-native patterns, with hands-on labs and case studies.",
    link: "https://serverlessdays.io",
    tags: ["serverless", "cloud", "edge"],
    organizer: "ServerlessDays Community",
  },

  {
    id: "local-dev-meetup-nyc-2025",
    title: "NYC Dev Meetup — November",
    image: "/images/event6.png",
    slug: "nyc-dev-meetup-nov-2025",
    location: "New York, NY — Meetup Space",
    date: "November 20, 2025",
    time: "18:30 — 21:00 ET",
    description:
      "Monthly developer meetup with lightning talks, networking, and live demos. Great for local engineers and folks new to the city.",
    link: "https://www.meetup.com/nyc-dev",
    tags: ["meetup", "networking", "talks"],
    organizer: "NYC Devs",
  },
];

export default events;
