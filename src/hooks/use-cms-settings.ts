import { useEffect, useRef, useState } from "react"
import { CmsSettings, DEFAULT_SETTINGS, loadSettings, subscribeToCmsSettings } from "@/lib/cms"

export function useCmsSettings() {
  const [settings, setSettings] = useState<CmsSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const lastErrorMessageRef = useRef<string | null>(null)

  useEffect(() => {
    let mounted = true

    setIsLoading(true)

    loadSettings()
      .then(({ settings: data, error: loadError }) => {
        if (!mounted) return
        setSettings(data)
        setError(loadError)
        lastErrorMessageRef.current = loadError?.message ?? null
      })
      .catch((unexpectedError) => {
        if (!mounted) return
        const fallbackError = unexpectedError instanceof Error ? unexpectedError : new Error("Failed to load settings")
        setError(fallbackError)
        lastErrorMessageRef.current = fallbackError.message
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    const unsubscribe = subscribeToCmsSettings((value) => {
      if (!mounted) return
      setSettings(value)
      setError(null)
      lastErrorMessageRef.current = null
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  return { settings, isLoading, error, lastErrorMessage: lastErrorMessageRef.current }
}
