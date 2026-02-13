import React, { Suspense, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import AboutSection from "@/components/about-section"
import ExperienceSection from "@/components/experience-section"
import ContactForm from "@/components/contact-form"
import ScrollReveal from "@/components/scroll-reveal"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TypingText } from "@/components/ui/typing-text"
import ProgressiveImage from "@/components/ui/progressive-image"
import { useCmsData } from "@/hooks/use-cms-data"
import { motion } from "framer-motion"
import { resolveMediaUrl } from "@/lib/cms"
import { GamesSectionSkeleton, PortfolioSectionSkeleton } from "@/components/section-skeletons"

const GamesSection = React.lazy(() => import("@/components/games-section"))
const PortfolioSection = React.lazy(() => import("@/components/portfolio-section"))

function App() {
  const navigate = useNavigate()
  const { content, settings, isLoading, settingsError } = useCmsData()
  const { hero, about, experience, utilities, portfolio, contact } = content
  const resolvedCvMediaUrl = resolveMediaUrl(about.cvDocument)
  const cvDownloadUrl = resolvedCvMediaUrl ?? "/andrian-cv.pdf"
  const isDynamicCvAvailable = Boolean(resolvedCvMediaUrl)
  const heroImagePrimarySrc = resolveMediaUrl(hero.image)
  const heroFallbackSrc = "/andrian-man.png"

  useEffect(() => {
    if (!isLoading && settingsError) {
      navigate("/service-down", { replace: true, state: { reason: settingsError.message } })
    }
  }, [isLoading, settingsError, navigate])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader
        content={content}
        settings={settings}
        isLoading={isLoading}
        settingsLoading={isLoading}
      />
      <main>
        {hero.enabled ? (
          <motion.section
            id="home"
            className="hero-animated-bg border-b py-16 md:py-24"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="mx-auto grid max-w-screen-2xl grid-cols-1 md:grid-cols-2 items-center justify-center gap-14 px-8 md:px-16">
              <div>
                <p className="text-sm text-muted-foreground">{"hello, I'm"}</p>
                <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
                  <TypingText
                    text={hero.title}
                    loop
                    speed={60}
                    retypeSpeed={120}
                    deleteSpeed={50}
                    startDelay={180}
                    pauseBeforeDelete={1700}
                    pauseBeforeRetype={950}
                    deleteTo={(() => {
                      const spaceIndex = hero.title.indexOf(" ")
                      if (spaceIndex >= 0) return spaceIndex + 1
                      return Math.max(hero.title.length - 3, 0)
                    })()}
                  />
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">{hero.subtitle}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a href={hero.ctaHref || '#contact'}>
                    <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                      {hero.ctaLabel || 'Contact'}
                    </Button>
                  </a>
                  <a href={cvDownloadUrl} download>
                    <Button variant="secondary" className="rounded-full" title={isDynamicCvAvailable ? undefined : "Using fallback CV copy"}>
                      DOWNLOAD CV
                    </Button>
                  </a>
                  {!isDynamicCvAvailable ? (
                    <span className="text-xs text-muted-foreground/70">Live CV not yet uploaded — serving cached file.</span>
                  ) : null}
                </div>
              </div>

              <div className="mx-auto max-w-sm md:ml-auto md:mr-0 md:justify-self-end">
                <ProgressiveImage
                  primarySrc={heroImagePrimarySrc}
                  fallbackSrc={heroFallbackSrc}
                  alt="Friendly illustration of Andrian holding a drink and waving"
                  width={480}
                  height={520}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </motion.section>
        ) : null}

        {about.enabled ? (
          <div className="about-animated-bg">
            <ScrollReveal>
              <AboutSection data={about} heroTitle={hero.title} heroSubtitle={hero.subtitle} />
            </ScrollReveal>
          </div>
        ) : null}

        {utilities.enabled ? (
          <div className="about-animated-bg">
            <Suspense fallback={<GamesSectionSkeleton />}>
              <ScrollReveal>
                <GamesSection section={utilities} />
              </ScrollReveal>
            </Suspense>
          </div>
        ) : null}

        {experience.enabled ? (
          <section id="experience" className="about-animated-bg scroll-mt-24 py-16">
            <ScrollReveal>
              <div className="mx-auto max-w-[110rem] px-8 md:px-16">
                <Card className="gap-4 rounded-2xl border-border/60 bg-card/90 shadow-xl">
                  <CardHeader className="px-6 pt-10 pb-4 sm:px-12 sm:pb-6 ml-[3rem]">
                    <CardTitle className="text-3xl font-semibold md:text-4xl">
                      {experience.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-10 sm:px-6">
                    <ExperienceSection section={experience} />
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </section>
        ) : null}

        {portfolio.enabled ? (
          <div className="about-animated-bg">
            <Suspense fallback={<PortfolioSectionSkeleton />}>
              <ScrollReveal>
                <PortfolioSection section={portfolio} />
              </ScrollReveal>
            </Suspense>
          </div>
        ) : null}

        {contact.enabled ? (
          <ScrollReveal>
            <section id="contact" aria-labelledby="contact-title" className="about-animated-bg scroll-mt-24 py-16">
              <div className="mx-auto max-w-[110rem] px-8 md:px-16">
                <Card className="gap-4 rounded-2xl border-border/60 bg-card/90 shadow-xl">
                  <CardHeader className="px-10 pt-10 pb-4">
                    <CardTitle id="contact-title" className="text-balance text-3xl font-semibold md:text-4xl">
                      {contact.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 px-10 pb-12">
                    <p className="max-w-prose text-lg text-muted-foreground">{contact.blurb}</p>
                    <ContactForm apiUrl={settings.apiUrl} />
                  </CardContent>
                </Card>
              </div>
            </section>
          </ScrollReveal>
        ) : null}
      </main>
      <SiteFooter />
      <Toaster duration={settings.notificationDuration} />
    </div>
  )
}

export default App
