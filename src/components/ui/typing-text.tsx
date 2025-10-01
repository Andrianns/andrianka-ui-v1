import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

const prefersReducedMotion = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

type TypingTextProps = {
  text: string
  className?: string
  speed?: number
  startDelay?: number
  cursor?: boolean
  loop?: boolean
  retypeSpeed?: number
  deleteSpeed?: number
  pauseBeforeDelete?: number
  pauseBeforeRetype?: number
  deleteTo?: number
}

export function TypingText({
  text,
  className,
  speed = 70,
  startDelay = 200,
  cursor = true,
  loop = false,
  retypeSpeed,
  deleteSpeed = 55,
  pauseBeforeDelete = 1400,
  pauseBeforeRetype = 900,
  deleteTo,
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState(text)
  const [done, setDone] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") {
      setDisplayed(text)
      setDone(true)
      return () => {}
    }

    if (prefersReducedMotion() || text.length === 0) {
      setDisplayed(text)
      setDone(true)
      return () => {}
    }

    let cancelled = false
    const timeoutIds = new Set<number>()

    const clearAll = () => {
      timeoutIds.forEach((id) => window.clearTimeout(id))
      timeoutIds.clear()
    }

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timeoutIds.delete(id)
          resolve()
        }, ms)
        timeoutIds.add(id)
      })

  const primarySpeed = Math.max(speed, 16)
  const loopRetypeSpeed = retypeSpeed ?? Math.max(Math.floor(primarySpeed * 1.4), primarySpeed + 35)
  const fallbackKeep = Math.min(Math.max(deleteTo ?? text.lastIndexOf(" ") + 1, 0), text.length)
  const firstSpace = text.indexOf(" ")
  const lastSpace = text.lastIndexOf(" ")
  const firstNameKeep = firstSpace >= 0 ? firstSpace + 1 : text.length
  const lastNameKeep = lastSpace >= 0 ? lastSpace : text.length - Math.min(3, text.length)

    setDisplayed(text)
    setDone(true)

    const run = async () => {
      let current = ""
      setDisplayed("")
      setDone(false)

      await wait(startDelay)
      if (cancelled) return

      const typeForward = async (target: string, step: number) => {
        for (let i = current.length; i < target.length; i += 1) {
          if (cancelled) return
          current = target.slice(0, i + 1)
          setDisplayed(current)
          await wait(step)
          if (cancelled) return
        }
      }

      const deleteBackward = async (targetLength: number, step: number) => {
        if (targetLength >= current.length) return
        for (let i = current.length; i > targetLength; i -= 1) {
          if (cancelled) return
          current = current.slice(0, i - 1)
          setDisplayed(current)
          await wait(step)
          if (cancelled) return
        }
      }

      await typeForward(text, primarySpeed)
      if (cancelled) return
      setDone(true)

      if (!loop) return

      const pickTargetLength = () => {
        const dynamicRandom = () => Math.floor(Math.random() * Math.max(text.length - 1, 1))
        const candidates = [fallbackKeep, firstNameKeep, 0, lastNameKeep, dynamicRandom()]
        const unique = Array.from(new Set(candidates.filter((len) => len < text.length))).sort((a, b) => a - b)
        if (unique.length === 0) return Math.max(text.length - 1, 0)
        const choice = unique[Math.floor(Math.random() * unique.length)]
        return Math.min(choice, text.length - 1)
      }

      const vary = (base: number, delta: number, min: number) => {
        const offset = Math.floor((Math.random() * 2 - 1) * delta)
        return Math.max(min, base + offset)
      }

      while (!cancelled) {
        const targetLength = Math.min(pickTargetLength(), current.length > 0 ? current.length - 1 : 0)
        const pauseBeforeDeleteDynamic = vary(pauseBeforeDelete, 380, 420)
        const pauseBeforeRetypeDynamic = vary(pauseBeforeRetype, 320, 420)
        const deleteSpeedDynamic = vary(deleteSpeed, 18, 28)
        const retypeSpeedDynamic = loopRetypeSpeed + Math.floor(Math.random() * 70)

        await wait(pauseBeforeDeleteDynamic)
        if (cancelled) return
        setDone(false)
        await deleteBackward(targetLength, deleteSpeedDynamic)
        if (cancelled) return
        setDone(true)
        await wait(pauseBeforeRetypeDynamic)
        if (cancelled) return
        setDone(false)
        await typeForward(text, retypeSpeedDynamic)
        if (cancelled) return
        setDone(true)
      }
    }

    void run()

    return () => {
      cancelled = true
      clearAll()
    }
  }, [deleteSpeed, deleteTo, loop, pauseBeforeDelete, pauseBeforeRetype, retypeSpeed, speed, startDelay, text])

  const ariaLabel = useMemo(() => text, [text])

  return (
    <span className={cn("inline-flex items-baseline", className)} aria-label={ariaLabel} aria-live="polite">
      <span>{displayed}</span>
      {cursor ? (
        <span
          aria-hidden="true"
          className={cn(
            "ml-1 inline-block w-[0.6ch] animate-typing-caret",
            done ? "opacity-0" : "opacity-100",
          )}
        >
          |
        </span>
      ) : null}
    </span>
  )
}
