import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import AboutSection from "@/components/about-section"
import ExperienceSection from "@/components/experience-section"
import ContactForm from "@/components/contact-form"
import PortfolioSection from "@/components/portfolio-section"
import GamesSection from "@/components/games-section"
import ScrollReveal from "@/components/scroll-reveal"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TypingText } from "@/components/ui/typing-text"
import { useCmsContent } from "@/hooks/use-cms-content"
import { useCmsSettings } from "@/hooks/use-cms-settings"
import { motion } from "framer-motion"

function App() {
  const navigate = useNavigate()
  const { content, isLoading: isContentLoading } = useCmsContent()
  const { settings, isLoading: isSettingsLoading, error: settingsError } = useCmsSettings()
  const isLoading = isContentLoading || isSettingsLoading
  const { hero, about, experience, utilities, portfolio, contact } = content

  useEffect(() => {
    if (!isSettingsLoading && settingsError) {
      navigate("/service-down", { replace: true, state: { reason: settingsError.message } })
    }
  }, [isSettingsLoading, settingsError, navigate])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader
        content={content}
        settings={settings}
        isLoading={isLoading}
        settingsLoading={isSettingsLoading}
      />
      <main>
        {isLoading ? (
          <section className="flex min-h-[60vh] items-center justify-center px-8 py-16">
            <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm font-medium uppercase tracking-wide">Loading content…</p>
            </div>
          </section>
        ) : null}

        {!isLoading && hero.enabled ? (
          <motion.section
            id="home"
            className="hero-animated-bg border-b py-16 md:py-24"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="mx-auto grid max-w-[110rem] grid-cols-1 items-center gap-14 px-8 md:px-16 md:grid-cols-2">
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
                  <a href="/andrian-cv.pdf" download>
                    <Button variant="secondary" className="rounded-full">
                      DOWNLOAD CV
                    </Button>
                  </a>
                </div>
              </div>

              <div className="mx-auto max-w-sm">
                <img
                  src="/andrian-man.png"
                  alt="Friendly illustration of Andrian holding a drink and waving"
                  width={480}
                  height={520}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </motion.section>
        ) : null}

        {!isLoading && about.enabled ? (
          <div className="about-animated-bg">
            <ScrollReveal>
              <AboutSection data={about} heroTitle={hero.title} heroSubtitle={hero.subtitle} />
            </ScrollReveal>
          </div>
        ) : null}

        {!isLoading && utilities.enabled ? (
          <div className="about-animated-bg">
            <ScrollReveal>
              <GamesSection section={utilities} />
            </ScrollReveal>
          </div>
        ) : null}

        {!isLoading && experience.enabled ? (
          <section id="experience" className="about-animated-bg scroll-mt-24 py-16">
            <ScrollReveal>
              <div className="mx-auto max-w-[110rem] px-8 md:px-16">
                <Card className="gap-4 rounded-2xl border-border/60 bg-card/90 shadow-xl">
                  <CardHeader className="px-10 pt-10 pb-4">
                    <CardTitle className="text-3xl font-semibold md:text-4xl">{experience.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-10 sm:px-6">
                    <ExperienceSection section={experience} />
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </section>
        ) : null}

        {!isLoading && portfolio.enabled ? (
          <div className="about-animated-bg">
            <ScrollReveal>
              <PortfolioSection section={portfolio} />
            </ScrollReveal>
          </div>
        ) : null}

        {!isLoading && contact.enabled ? (
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
                    <ContactForm />
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
