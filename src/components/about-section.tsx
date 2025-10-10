import { AboutSection as AboutSectionContent, resolveMediaUrl } from "@/lib/cms"
import { Button } from "@/components/ui/button"

type AboutSectionProps = {
  data: AboutSectionContent
  heroTitle: string
  heroSubtitle: string
}

export default function AboutSection({ data, heroTitle, heroSubtitle }: AboutSectionProps) {
  const bulletItems = data.bullets ?? []

  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-24 py-12">
      <div className="mx-auto max-w-[110rem] px-8 md:px-16">
        <div className="grid gap-6 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-lg lg:grid-cols-[minmax(0,0.48fr)_minmax(0,1.02fr)] lg:items-center lg:gap-10 lg:p-8">
          <div className="pl-30 flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <div className="w-full max-w-[11rem] overflow-hidden rounded-3xl border border-border/60 shadow-md">
              <img
                src={resolveMediaUrl(data.image, "/diverse-profile-avatars2.png")}
                alt={`Portrait of ${heroTitle}`}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">{data.title}</p>
              <h2 id="about-title" className="text-2xl font-semibold text-foreground">
                {heroTitle}
              </h2>
              <p className="text-sm text-muted-foreground">{heroSubtitle}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-left">
            <p className="text-xl font-semibold text-foreground">{data.description}</p>
            {bulletItems.length ? (
              <ul className="space-y-2 text-base text-muted-foreground">
                {bulletItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-5 rounded-full bg-primary/80" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {data.cvDocument ? (
              <div className="pt-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const url = resolveMediaUrl(data.cvDocument)
                    if (!url) return
                    window.open(url, "_blank", "noreferrer")
                  }}
                >
                  Download CV
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
