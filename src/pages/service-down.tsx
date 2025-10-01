import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function ServiceDownPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { reason?: string } }

  const reason = location.state?.reason?.trim()

  const handleRetry = () => {
    navigate("/", { replace: true })
    window.setTimeout(() => {
      window.location.reload()
    }, 50)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
        <div className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          Service unavailable
        </div>
        <h1 className="text-balance text-3xl font-semibold md:text-4xl">We can&#39;t reach the content service</h1>
        <p className="text-muted-foreground">
          {reason || "The CMS API is currently unreachable. Please try again in a few moments."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={handleRetry} className="rounded-full">
            Retry now
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}
