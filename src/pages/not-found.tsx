import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
        <div className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          404 Not found
        </div>
        <h1 className="text-balance text-3xl font-semibold md:text-4xl">Looks like you&#39;re off the map</h1>
        <p className="text-muted-foreground">
          The page you&#39;re trying to reach doesn&#39;t exist. Check the URL or head back to the homepage to keep exploring.
        </p>
        <Button onClick={() => navigate("/", { replace: true })} className="rounded-full">
          Return home
        </Button>
      </div>
    </div>
  )
}
