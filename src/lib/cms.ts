export type SectionToggle = { enabled: boolean }

export type MediaResource = {
  id: number
  url: string
  fileName: string
  mimeType: string
  size: number
}

export type HeroSection = SectionToggle & {
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  image?: MediaResource | null
}

export type AboutSection = SectionToggle & {
  title: string
  description: string
  bullets: string[]
  image?: MediaResource | null
  cvDocument?: MediaResource | null
}

export type CardItem = {
  id: string
  title: string
  description: string
  tag?: string
  imageUrl?: string
  image?: MediaResource | null
  url?: string
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
    cvDocument: undefined,
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
    items: [
      {
        id: "chess",
        title: "Chess Lab",
        description: "Play a full 8x8 chess match with move validation and a clean modern board.",
        tag: "GAME",
        imageUrl: "/game-chess-lab.jpg",
      },
      {
        id: "calculator",
        title: "Quick Calculator",
        description: "Evaluate complex expressions with percentages, memory, and responsive keypad actions.",
        tag: "UTILITY",
        imageUrl: "/utility-quick-calculator.jpg",
      },
      {
        id: "sudoku",
        title: "Sudoku Studio",
        description: "Fill the grid with digits 1-9 without repeats across rows, columns, or blocks.",
        tag: "GAME",
        imageUrl: "/game-sudoku-studio.jpg",
      },
      {
        id: "pomodoro",
        title: "Pomodoro Timer",
        description: "Stay on track with alternating focus and break intervals plus quick mode toggles.",
        tag: "UTILITY",
        imageUrl: "/utility-pomodoro-timer.jpg",
      },
      {
        id: "sketch",
        title: "Pixel Sketch",
        description: "Doodle on a retro Etch-a-Sketch inspired canvas with erase and fill tools.",
        tag: "UTILITY",
        imageUrl: "/utility-pixel-sketch.jpg",
      },
    ],
    showViewAll: true,
    viewAllLabel: "Show all 5 tools",
  },
  portfolio: {
    enabled: true,
    title: "Portfolio",
    subtitle: "A few projects I've worked on recently.",
    items: [
      {
        id: "calendar-interface",
        title: "Calendar Interface",
        description: "Scheduling dashboard concept featuring analytics and quick actions for distributed teams.",
        tag: "React",
        imageUrl: "/calendar-interface-mockup.jpg",
        url: "https://andrian.dev/projects/calendar-interface",
      },
      {
        id: "recipe-cards",
        title: "Recipe Cards",
        description: "Responsive recipe catalog with playful illustrations, filtering, and chef notes for culinary hobbyists.",
        tag: "Next.js",
        imageUrl: "/recipe-cards-mockup.jpg",
        url: "https://andrian.dev/projects/recipe-cards",
      },
      {
        id: "travel-map",
        title: "Travel Map",
        description: "Interactive travel planner with map overlays, saved journeys, and collaborative itineraries.",
        tag: "Mapbox",
        imageUrl: "/travel-map-mockup.jpg",
        url: "https://andrian.dev/projects/travel-map",
      },
      {
        id: "fitness-dashboard",
        title: "Fitness Dashboard",
        description: "Analytics dashboard visualising workouts, recovery insights, and personalised recommendations.",
        tag: "Vite",
        imageUrl: "/fitness-dashboard-mockup.jpg",
        url: "https://andrian.dev/projects/fitness-dashboard",
      },
      {
        id: "photo-gallery",
        title: "Photo Gallery",
        description: "Minimalist layout highlighting high-resolution imagery with lightbox browsing and metadata callouts.",
        tag: "shadcn/ui",
        imageUrl: "/photo-gallery-mockup.jpg",
        url: "https://andrian.dev/projects/photo-gallery",
      },
    ],
    showViewAll: true,
    viewAllLabel: "Show all 5 projects",
  },
  contact: {
    enabled: true,
    title: "Get in touch",
    blurb: "Ready to collaborate? Send me a message and I'll reply as soon as I can.",
  },
}

const PRODUCTION_FALLBACK_API_URL = "https://andrian-be-services-v1.vercel.app/api" as const

const sanitizeApiBase = (candidate?: string | null): string | null => {
  if (!candidate) return null
  const trimmed = candidate.trim()
  if (!trimmed) return null

  const valueWithProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const url = new URL(valueWithProtocol)
    const normalizedPath = url.pathname.replace(/\/+$/, "")
    const finalPath = normalizedPath && normalizedPath !== "/" ? normalizedPath : ""
    return `${url.origin}${finalPath}`
  } catch (error) {
    console.warn("cms: invalid api url provided", candidate, error)
    return null
  }
}

const resolveConfiguredApiUrl = () => {
  const configured = sanitizeApiBase(import.meta.env?.VITE_CMS_API_URL)
  if (configured) return configured
  if (import.meta.env?.PROD) {
    return PRODUCTION_FALLBACK_API_URL
  }
  return "http://localhost:3000/api"
}

export const DEFAULT_API_URL = sanitizeApiBase(resolveConfiguredApiUrl()) ?? PRODUCTION_FALLBACK_API_URL

let apiBase = DEFAULT_API_URL

const setApiBase = (candidate?: string | null) => {
  const sanitized = sanitizeApiBase(candidate)
  apiBase = sanitized ?? DEFAULT_API_URL
  return apiBase
}

const getApiBase = () => apiBase

export const DEFAULT_SETTINGS: CmsSettings = {
  apiUrl: DEFAULT_API_URL,
  cmsUrl: import.meta.env?.VITE_CMS_DASHBOARD_URL ?? "http://localhost:5174/dashboard",
  loginUrl: import.meta.env?.VITE_CMS_LOGIN_URL ?? "http://localhost:5174/login",
  notificationDuration: Number.parseInt(import.meta.env?.VITE_CMS_NOTIFICATION_DURATION ?? "1500", 10) || 1500,
}

const isAbsoluteUrlString = (value: string) => /^https?:\/\//i.test(value)
const isLikelyLocal = (value: string) => /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:?\d+)?/i.test(value)

const mergeSettings = (partial?: Partial<CmsSettings> | null): CmsSettings => {
  const merged: CmsSettings = {
    ...DEFAULT_SETTINGS,
    ...(partial ?? {}),
  }

  const sanitized = sanitizeApiBase(merged.apiUrl)
  const shouldFallbackToDefault = Boolean(
    import.meta.env?.PROD && sanitized && isLikelyLocal(sanitized),
  )

  const finalApiUrl = shouldFallbackToDefault ? DEFAULT_API_URL : sanitized ?? DEFAULT_API_URL
  merged.apiUrl = finalApiUrl
  setApiBase(finalApiUrl)

  return merged
}

const SETTINGS_EVENT = "cms:settings-updated"

const stripQueryAndHash = (value: string) => value.split(/[?#]/)[0]
const ensureLeadingSlash = (value: string) => (value.startsWith('/') ? value : `/${value}`)
const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value) || value.startsWith('data:')

export function resolveMediaUrl(media?: MediaResource | null, fallback?: string): string | undefined {
  const fallbackUrl = fallback?.trim()

  if (!media?.url) {
    return fallbackUrl
  }

  const mediaUrl = media.url.trim()
  if (!mediaUrl) {
    return fallbackUrl
  }

  if (isAbsoluteUrl(mediaUrl)) {
    return mediaUrl
  }

  const normalizedMediaPath = ensureLeadingSlash(stripQueryAndHash(mediaUrl))
  const trimmedBase = getApiBase().replace(/\/$/, '')
  const shouldStripApi = normalizedMediaPath.startsWith('/api/') && trimmedBase.endsWith('/api')
  const normalizedBase = shouldStripApi ? trimmedBase.slice(0, -4) : trimmedBase

  if (fallbackUrl) {
    if (isAbsoluteUrl(fallbackUrl)) {
      try {
        const fallback = new URL(fallbackUrl)
        const fallbackPath = stripQueryAndHash(fallback.pathname)
        if (fallbackPath === normalizedMediaPath) {
          return `${normalizedBase}${normalizedMediaPath}`
        }
      } catch (error) {
        console.warn("cms: failed to parse fallback media url", fallbackUrl, error)
      }
    } else {
      const normalizedFallbackPath = ensureLeadingSlash(stripQueryAndHash(fallbackUrl))
      if (normalizedFallbackPath === normalizedMediaPath) {
        return `${normalizedBase}${normalizedMediaPath}`
      }
    }
  }

  return `${normalizedBase}${normalizedMediaPath}`
}

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`)
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
    return { settings: mergeSettings(settings), error: null }
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
    if (detail) callback(mergeSettings(detail))
  }

  window.addEventListener(SETTINGS_EVENT, handleCustomEvent)

  return () => {
    window.removeEventListener(SETTINGS_EVENT, handleCustomEvent)
  }
}
