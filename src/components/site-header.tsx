import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme, type Theme } from "@/hooks/use-theme"
import type { CmsContent, CmsSettings } from "@/lib/cms"
import { Moon, Sun } from "lucide-react"
import { motion, useMotionValue } from "framer-motion"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#games", label: "Games" },
  { href: "#experience", label: "Experience" },
  { href: "#portfolio", label: "Portfolio" },
]

type SiteHeaderProps = {
  content: CmsContent
  isLoading?: boolean
  settings: CmsSettings
  settingsLoading?: boolean
}

export default function SiteHeader({ content, settings, isLoading = false, settingsLoading = false }: SiteHeaderProps) {
  const { setTheme } = useTheme()
  const [dark, setDark] = useState(true) // default dark

  const headerRef = useRef<HTMLDivElement>(null)
  const sunRef = useRef<HTMLDivElement>(null)
  const moonRef = useRef<HTMLDivElement>(null)

  // motion values for moon position
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const navItemsToRender = useMemo(() => {
    if (isLoading) return navItems

    return navItems.filter((item) => {
      switch (item.href) {
        case "#home":
          return content.hero.enabled
        case "#about":
          return content.about.enabled
        case "#portfolio":
          return content.portfolio.enabled
        case "#games":
          return content.utilities.enabled
        case "#experience":
          return content.experience.enabled
        default:
          return true
      }
    })
  }, [
    isLoading,
    content.about.enabled,
    content.hero.enabled,
    content.portfolio.enabled,
    content.utilities.enabled,
    content.experience.enabled,
  ])

  // helper validator biar aman
  const isTheme = (val: any): val is Theme =>
    val === "dark" || val === "light"

  // Hybrid restore: position + theme
  useEffect(() => {
    const savedPos = localStorage.getItem("moon-pos")
    const savedTheme = localStorage.getItem("theme")

    if (savedPos) {
      const { x: sx, y: sy } = JSON.parse(savedPos)
      x.set(sx)
      y.set(sy)
    } else {
      const randX = Math.floor(Math.random() * 300) - 150
      const randY = Math.floor(Math.random() * 60) - 30
      x.set(randX)
      y.set(randY)
    }

    if (isTheme(savedTheme)) {
      setDark(savedTheme === "dark")
      setTheme(savedTheme)
    } else {
      // default dark mode kalau belum ada
      setDark(true)
      setTheme("dark")
    }
  }, [x, y, setTheme])

  // detect overlap between sun & moon
  const handleDrag = () => {
    if (!sunRef.current || !moonRef.current) return
    const sunRect = sunRef.current.getBoundingClientRect()
    const moonRect = moonRef.current.getBoundingClientRect()

    const overlap =
      moonRect.right > sunRect.left &&
      moonRect.left < sunRect.right &&
      moonRect.bottom > sunRect.top &&
      moonRect.top < sunRect.bottom

    if (overlap) {
      setDark(true)
      setTheme("dark")
      localStorage.setItem("theme", "dark")
    } else {
      setDark(false)
      setTheme("light")
      localStorage.setItem("theme", "light")
    }
  }

  // save last position on drag end
  const handleDragEnd = () => {
    localStorage.setItem("moon-pos", JSON.stringify({ x: x.get(), y: y.get() }))
    handleDrag()
  }

  const openExternal = (url: string) => {
    if (!url || typeof window === "undefined") return
    window.open(url, "_blank", "noreferrer")
  }

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="sticky top-0 z-40 w-full border-b border-border/40 backdrop-blur"
    >
      {/* background overlay */}
      <div
        className={`absolute inset-0 -z-10 transition-colors duration-500 ${
          dark ? "bg-slate-900/95" : "bg-white/85"
        }`}
      />

      <div className="relative mx-auto flex max-w-[110rem] items-center justify-between px-6 py-3 md:px-10">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <span className="sr-only">Andrian Universe</span>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RzarUJvxReRo3tuMn3e8YSsD1d7p3o.png"
            alt="Andrian Universe logo"
            width={80}
            height={80}
            className="h-20 w-20"
          />
        </a>

        {/* Nav */}
        <nav className="hidden items-center gap-3 sm:flex">
          {navItemsToRender.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative rounded-full px-4 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
              <span className="pointer-events-none absolute inset-x-3 -bottom-1 h-[2px] scale-x-0 rounded-full bg-primary transition-transform group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="relative flex items-center gap-6">
          {/* Sun */}
          <div ref={sunRef} className="relative">
            <Sun className="h-10 w-10 text-yellow-500" />
          </div>

          {/* Contact button */}
          {!isLoading && content.contact.enabled ? (
            <Button
              size="sm"
              className="rounded-full bg-accent px-5 text-base font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 hover:bg-accent/90"
              disabled={settingsLoading}
              onClick={() => openExternal(settings.cmsUrl)}
            >
              Dashboard
            </Button>
          ) : null}
        </div>

        {/* Moon draggable */}
        <motion.div
          ref={moonRef}
          drag
          style={{ x, y }}
          dragConstraints={headerRef}
          dragElastic={0.2}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="absolute right-20 top-1/2 z-20 flex -translate-y-1/2 cursor-grab flex-col items-center"
        >
          <motion.div
            aria-hidden
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="pointer-events-none relative flex flex-col items-center"
          >
            <div className="absolute -bottom-2 left-2 h-3 w-3 rounded-full bg-white/95 dark:bg-gray-700/95" />
            <div className="absolute -bottom-1 right-3 h-4 w-4 rounded-full bg-white/90 dark:bg-gray-700/90" />
            <div className="absolute -top-1 left-1 h-5 w-5 rounded-full bg-white/85 dark:bg-gray-700/85" />
            <div className="relative z-10 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200">
              Drag me to the sun
            </div>
          </motion.div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-lg dark:bg-gray-800">
            <Moon className="h-6 w-6 text-indigo-600 dark:text-yellow-400" />
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}
