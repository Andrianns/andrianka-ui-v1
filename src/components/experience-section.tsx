import { motion } from 'framer-motion'

import type { ExperienceSection as ExperienceSectionContent } from '@/lib/cms'

type ExperienceSectionProps = {
  section: ExperienceSectionContent
}

export default function ExperienceSection({ section }: ExperienceSectionProps) {
  const items = section.items ?? []

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/70 px-6 py-12 text-center text-muted-foreground">
        Experience entries will appear here once published.
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.18 } },
      }}
      // className="relative pl-6 sm:pl-10"
      className="relative pl-6 sm:pl-8 lg:ml-12 xl:ml-16 2xl:ml-24"

    >
      <div className="absolute left-[14px] top-4 bottom-4 w-px bg-border/70 sm:left-[26px]" aria-hidden />

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <motion.article
            key={item.id ?? `${item.company}-${item.period}`}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            className="group relative mb-12 mr-15 rounded-3xl border border-border/60 bg-card/80 px-6 py-6 shadow-sm backdrop-blur transition-shadow hover:shadow-lg sm:pl-12 sm:pr-10"
          >
            <span
              className="absolute left-[-2.25rem] top-8 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-semibold text-primary shadow-inner sm:left-[-3rem]"
            >
              {index + 1}
            </span>

            {!isLast ? (
              <span className="absolute left-[-1.2rem] top-16 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-primary/50 to-primary/10 sm:left-[-2.25rem] sm:block" aria-hidden />
            ) : null}

            <header className="mb-4 space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">{item.period}</p>
              <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                {item.role} · <span className="text-primary/90">{item.company}</span>
              </h3>
            </header>

            <ul className="space-y-3 text-base leading-relaxed text-muted-foreground">
              {item.points.map((point) => (
                <li key={point} className="relative pl-5">
                  <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </motion.article>
        )
      })}
    </motion.div>
  )
}
