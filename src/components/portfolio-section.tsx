import { ExternalLink, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import ScrollReveal from '@/components/scroll-reveal'
import { Button } from '@/components/ui/button'
import type { CardsSection, CardItem } from '@/lib/cms'
import { resolveMediaUrl } from '@/lib/cms'
import { cn } from '@/lib/utils'

type PortfolioSectionProps = {
  section: CardsSection
}

type Project = {
  id: string
  title: string
  description: string
  image: string
  href?: string
  technologies: string[]
  tag?: string | null
}

const PROJECT_PLACEHOLDER_IMAGE = '/placeholder.svg?height=160&width=280&query=project'

const normalizeUrl = (value?: string | null): string | undefined => {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

const buildProjects = (items: CardItem[]): Project[] =>
  items.map((item, index) => {
    const technologies = item.tag
      ? item.tag
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
      : []

    const fallbackLinkMatch = item.description.match(/https?:\/\/[\S)]+/)
    const href = normalizeUrl(item.url ?? fallbackLinkMatch?.[0])

    return {
      id: item.id ?? `project-${index}`,
      title: item.title,
      description: item.description,
      image:
        resolveMediaUrl(item.image, item.imageUrl ?? PROJECT_PLACEHOLDER_IMAGE) ?? PROJECT_PLACEHOLDER_IMAGE,
      href,
      technologies,
      tag: item.tag ?? null,
    }
  })

type ProjectCardProps = {
  project: Project
  className?: string
  onClick?: () => void
  compact?: boolean
}

function ProjectCard({ project, className, onClick, compact = false }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/90 text-left text-card-foreground shadow-md transition-transform hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={project.image || PROJECT_PLACEHOLDER_IMAGE}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className={cn('p-5', !compact && 'space-y-3')}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground md:text-lg">{project.title}</h3>
          {project.tag ? (
            <span className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {project.tag}
            </span>
          ) : null}
        </div>
        {!compact ? (
          <>
            <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
            {project.technologies.length ? (
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </button>
  )
}

export default function PortfolioSection({ section }: PortfolioSectionProps) {
  const projects = useMemo(() => buildProjects(section.items ?? []), [section.items])
  const marqueeItems = useMemo(() => (projects.length ? [...projects, ...projects] : []), [projects])
  const [showAll, setShowAll] = useState(false)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const heading = section.title ?? 'Portfolio'
  const description = section.subtitle ?? "A few projects I've worked on recently."
  const totalProjects = projects.length
  const ctaLabel = section.viewAllLabel ?? `Show all ${totalProjects} projects`
  const hasProjects = totalProjects > 0

  useEffect(() => {
    if (!activeProject) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveProject(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeProject])

  const closeProjectModal = () => setActiveProject(null)

  const openProjectUrl = () => {
    if (!activeProject?.href) return
    const url = activeProject.href
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="portfolio" className="py-16">
      <ScrollReveal>
        <div className="mx-auto max-w-[110rem] px-8 md:px-16">
          <h2 className="text-balance text-3xl font-semibold text-foreground">{heading}</h2>
          <p className="mt-2 text-foreground/70">{description}</p>
        </div>
      </ScrollReveal>

      <div className="mx-auto mt-8 max-w-[110rem] px-8 md:px-16">
        <AnimatePresence mode="wait" initial={false}>
          {showAll ? (
            <motion.div
              key="portfolio-grid"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {projects.map((project) => (
                <ProjectCard
                  key={`grid-${project.id}`}
                  project={project}
                  className="w-full"
                  onClick={() => setActiveProject(project)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="portfolio-marquee"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <div className="marquee">
                <div className="marquee-track">
                  {marqueeItems.map((project, index) => (
                    <ProjectCard
                      key={`${project.id}-${index}`}
                      project={project}
                      className="w-[320px] shrink-0"
                      compact
                      onClick={() => setActiveProject(project)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {hasProjects ? (
          <div className="mt-8 flex justify-center">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setShowAll((value) => !value)}
            >
              {showAll ? 'Collapse projects' : ctaLabel}
            </Button>
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-muted-foreground">Projects coming soon.</p>
        )}
      </div>

      <AnimatePresence>
        {activeProject ? (
          <motion.div
            key="project-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={closeProjectModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="relative flex w-full max-w-[92vw] sm:max-w-3xl lg:max-w-5xl max-h-[82vh] flex-col overflow-hidden rounded-3xl border border-border/60 bg-card text-card-foreground shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 px-6 py-5 sm:px-8">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Featured project</p>
                  <h3 className="mt-1 text-2xl font-semibold md:text-3xl">{activeProject.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">{activeProject.description}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={closeProjectModal}
                  aria-label="Close project details"
                >
                  <X className="h-4 w-4" />
                </Button>
              </header>

              <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5 sm:px-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-2xl border border-border/60 aspect-[4/3] max-h-[42vh]">
                      <img src={activeProject.image} alt={activeProject.title} className="h-full w-full object-cover" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {activeProject.technologies.length ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Stack</h4>
                          {activeProject.href ? (
                            <Button type="button" variant="outline" className="rounded-full" onClick={openProjectUrl}>
                              Visit project
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeProject.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : activeProject.href ? (
                      <div className="flex justify-end">
                        <Button type="button" variant="outline" className="rounded-full" onClick={openProjectUrl}>
                          Visit project
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Curious about the build? Reach out and I can share deeper insights, code snippets, or lessons learned.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}


