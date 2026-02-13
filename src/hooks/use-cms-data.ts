import { useEffect, useRef, useState } from "react"
import {
  CmsContent,
  CmsSettings,
  DEFAULT_CONTENT,
  DEFAULT_SETTINGS,
  loadAll,
  subscribeToCmsContent,
  subscribeToCmsSettings,
} from "@/lib/cms"
import { toast } from "@/hooks/use-toast"

type CmsDataState = {
  content: CmsContent
  settings: CmsSettings
  contentReady: boolean
  settingsReady: boolean
  settingsError: Error | null
}

export function useCmsData() {
  const [state, setState] = useState<CmsDataState>({
    content: DEFAULT_CONTENT,
    settings: DEFAULT_SETTINGS,
    contentReady: false,
    settingsReady: false,
    settingsError: null,
  })
  const lastContentErrorRef = useRef<string | null>(null)

  useEffect(() => {
    let mounted = true

    loadAll().then(({ content: contentResult, settings: settingsResult }) => {
      if (!mounted) return

      if (contentResult.error) {
        const message = contentResult.error.message || "Failed to load site content"
        if (lastContentErrorRef.current !== message) {
          toast({
            title: "Content unavailable",
            description: "Showing cached defaults while the latest content is unreachable.",
            variant: "destructive",
          })
          lastContentErrorRef.current = message
        }
      } else {
        lastContentErrorRef.current = null
      }

      setState({
        content: contentResult.content,
        settings: settingsResult.settings,
        contentReady: true,
        settingsReady: true,
        settingsError: settingsResult.error,
      })
    })

    const unsubContent = subscribeToCmsContent((value) => {
      if (!mounted) return
      setState((prev) => ({ ...prev, content: value, contentReady: true }))
      lastContentErrorRef.current = null
    })

    const unsubSettings = subscribeToCmsSettings((value) => {
      if (!mounted) return
      setState((prev) => ({ ...prev, settings: value, settingsReady: true, settingsError: null }))
    })

    return () => {
      mounted = false
      unsubContent()
      unsubSettings()
    }
  }, [])

  return {
    content: state.content,
    settings: state.settings,
    isLoading: !state.contentReady || !state.settingsReady,
    settingsError: state.settingsError,
  }
}
