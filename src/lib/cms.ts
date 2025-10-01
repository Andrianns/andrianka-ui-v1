export type SectionToggle = { enabled: boolean }

export type HeroSection = SectionToggle & {
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
}

export type AboutSection = SectionToggle & {
  title: string
  description: string
  bullets: string[]
}

export type CardItem = {
  id: string
  title: string
  description: string
  tag?: string
  imageUrl?: string
}

export type CardsSection = SectionToggle & {
  title: string
  subtitle?: string
  items: CardItem[]
  showViewAll?: boolean
  viewAllLabel?: string
}

export type ExperienceItem = {
  id: string
  role: string
  company: string
  period: string
  points: string[]
}

export type ExperienceSection = SectionToggle & {
  title: string
  items: ExperienceItem[]
}

export type ContactSection = SectionToggle & {
  title: string
  blurb: string
}

export type CmsContent = {
  hero: HeroSection
  about: AboutSection
  experience: ExperienceSection
  utilities: CardsSection
  portfolio: CardsSection
  contact: ContactSection
}

export type CmsSettings = {
  apiUrl: string
  cmsUrl: string
  loginUrl: string
  notificationDuration: number
}

export const DEFAULT_CONTENT: CmsContent = {
  hero: {
    enabled: true,
    title: "Andrian Kurnia Aji",
    subtitle: "Software Engineer",
    ctaLabel: "Contact",
    ctaHref: "#contact",
  },
  about: {
    enabled: true,
    title: "About",
    description:
      "Software engineer with 2+ years shipping reliable banking platforms. Focused on dependable delivery and measurable outcomes.",
    bullets: [
      "Design Golang microservices for safe deposit, queueing, and biometric flows.",
      "Automated schedulers, monitoring dashboards, and data workflows.",
      "Delivered low-code field reporting tools.",
    ],
  },
  experience: {
    enabled: true,
    title: "Experience",
    items: [
      {
        id: "bri-backend",
        role: "Backend Developer",
        company: "PT Bank Rakyat Indonesia (BRI)",
        period: "Dec 2023 - Present",
        points: [
          "Delivered Golang microservices for safe deposit box registration, visitor tracking, and rental renewals that interoperate with BRI core banking via gRPC and REST.",
          "Built branch queueing and biometric validation services using Redis, RabbitMQ, and Minio to balance workloads and harden security at scale.",
          "Optimised teller and customer service analytics by parallelising heavy SQL workloads with goroutines and connection pooling.",
          "Migrated millions of SDB records from legacy systems, boosting pipeline throughput from ~100 to ~3000 boxes per batch with automated validation.",
        ],
      },
      {
        id: "bank-raya",
        role: "Backend Engineer",
        company: "PT Bank Raya Indonesia Tbk",
        period: "Apr 2023 - Oct 2023",
        points: [
          "Implemented Google Cloud based auction and monitoring services using Pub/Sub, Scheduler, BigQuery, and PostgreSQL.",
          "Automated renewal reminders with dynamic schedulers so operational teams no longer manage manual jobs.",
          "Provided job dashboards that surface pending, failed, and successful workloads across distributed databases.",
        ],
      },
      {
        id: "phe-fullstack",
        role: "Fullstack Developer",
        company: "PT Pertamina Hulu Energi",
        period: "Sep 2022 - Mar 2023",
        points: [
          "Delivered Promyst, a low-code web app for offshore field staff to capture operational data using Code On Time and .NET.",
          "Collaborated with cross-functional teams to translate field requirements into performant forms backed by SQL Server.",
          "Introduced structured workflows that improved data turnaround for HQ decision makers.",
        ],
      },
      {
        id: "diskominfo-intern",
        role: "Intern Web Developer",
        company: "Diskominfo Tangerang",
        period: "Sep 2021 - Feb 2022",
        points: [
          "Helped civil servants adopt the Simpatik portal by building new modules and training end users.",
          "Collaborated on UX improvements and presented the platform to stakeholders across the Tangerang government.",
        ],
      },
      {
        id: "esri-intern",
        role: "Intern GIS Analyst",
        company: "Esri Indonesia (Binus Collaboration)",
        period: "Feb 2021 - Feb 2022",
        points: [
          "Researched, cleansed, and mapped geospatial datasets in ArcGIS to support campus-industry projects.",
          "Produced thematic maps and documentation that accelerated downstream analysis by partner teams.",
        ],
      },
    ],
  },
  utilities: {
    enabled: true,
    title: "Games & Utilities",
    subtitle: "Hands-on tools and play spaces I tinker with during creative breaks.",
    items: [],
    showViewAll: true,
    viewAllLabel: "Show all 5 tools",
  },
  portfolio: {
    enabled: true,
    title: "Portfolio",
    subtitle: "A few projects I've worked on recently.",
    items: [],
    showViewAll: true,
    viewAllLabel: "Show all 5 projects",
  },
  contact: {
    enabled: true,
    title: "Get in touch",
    blurb: "Ready to collaborate? Send me a message and I'll reply as soon as I can.",
  },
}

export const DEFAULT_SETTINGS: CmsSettings = {
  apiUrl: import.meta.env?.VITE_CMS_API_URL ?? "http://localhost:3000/api",
  cmsUrl: import.meta.env?.VITE_CMS_DASHBOARD_URL ?? "http://localhost:5174/dashboard",
  loginUrl: import.meta.env?.VITE_CMS_LOGIN_URL ?? "http://localhost:5174/login",
  notificationDuration: Number.parseInt(import.meta.env?.VITE_CMS_NOTIFICATION_DURATION ?? "1500", 10) || 1500,
}

const API_BASE = import.meta.env?.VITE_CMS_API_URL ?? "http://localhost:3000/api"
const SETTINGS_EVENT = "cms:settings-updated"

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  const json = await res.json()
  return (json?.data ?? json) as T
}

export type LoadContentResult = {
  content: CmsContent
  error: Error | null
}

export type LoadSettingsResult = {
  settings: CmsSettings
  error: Error | null
}

const cloneDefaultContent = (): CmsContent => JSON.parse(JSON.stringify(DEFAULT_CONTENT))

export async function loadContent(): Promise<LoadContentResult> {
  try {
    const content = await request<CmsContent>("/content")
    return { content, error: null }
  } catch (error) {
    console.error("Failed to load site content", error)
    return {
      content: cloneDefaultContent(),
      error: error instanceof Error ? error : new Error("Failed to load site content"),
    }
  }
}

export async function loadSettings(): Promise<LoadSettingsResult> {
  try {
    const settings = await request<CmsSettings>("/settings")
    return { settings, error: null }
  } catch (error) {
    console.error("Failed to load site settings", error)
    return {
      settings: { ...DEFAULT_SETTINGS },
      error: error instanceof Error ? error : new Error("Failed to load settings"),
    }
  }
}

export function subscribeToCmsContent(callback: (value: CmsContent) => void) {
  if (typeof window === "undefined") return () => {}

  const handleCustomEvent = (event: Event) => {
    const detail = (event as CustomEvent<CmsContent>).detail
    if (detail) callback(detail)
  }

  window.addEventListener("cms:content-updated", handleCustomEvent)

  return () => {
    window.removeEventListener("cms:content-updated", handleCustomEvent)
  }
}

export function subscribeToCmsSettings(callback: (value: CmsSettings) => void) {
  if (typeof window === "undefined") return () => {}

  const handleCustomEvent = (event: Event) => {
    const detail = (event as CustomEvent<CmsSettings>).detail
    if (detail) callback(detail)
  }

  window.addEventListener(SETTINGS_EVENT, handleCustomEvent)

  return () => {
    window.removeEventListener(SETTINGS_EVENT, handleCustomEvent)
  }
}
