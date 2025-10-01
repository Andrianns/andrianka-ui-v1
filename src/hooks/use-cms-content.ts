import { useEffect, useRef, useState } from "react"
import { CmsContent, DEFAULT_CONTENT, loadContent, subscribeToCmsContent } from "@/lib/cms"
import { toast } from "@/hooks/use-toast"

export function useCmsContent() {
  const [content, setContent] = useState<CmsContent>(DEFAULT_CONTENT)
  const [isLoading, setIsLoading] = useState(true)
  const lastErrorMessageRef = useRef<string | null>(null)

  useEffect(() => {
    let mounted = true

    setIsLoading(true)

    loadContent()
      .then(({ content: data, error }) => {
        if (!mounted) return
        setContent(data)
        if (error) {
          const message = error.message || "Failed to load site content"
          if (lastErrorMessageRef.current !== message) {
            toast({
              title: "Content unavailable",
              description: "Showing cached defaults while the latest content is unreachable.",
              variant: "destructive",
            })
            lastErrorMessageRef.current = message
          }
        } else {
          lastErrorMessageRef.current = null
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    const unsubscribe = subscribeToCmsContent((value) => {
      if (!mounted) return
      setContent(value)
      setIsLoading(false)
      lastErrorMessageRef.current = null
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  return { content, isLoading }
}
