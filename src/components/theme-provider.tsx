'use client'

import type { PropsWithChildren } from 'react'

export type ThemeProviderProps = PropsWithChildren<Record<string, unknown>>

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>
}
