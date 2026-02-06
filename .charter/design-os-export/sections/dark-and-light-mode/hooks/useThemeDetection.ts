import { useState, useEffect } from 'react'
import type { Theme, UseThemeDetectionResult } from '../types'

const DARK_MQ = '(prefers-color-scheme: dark)'

/**
 * useThemeDetection — Detects and syncs the system color scheme preference.
 *
 * On mount:
 * 1. Reads the current system preference via matchMedia
 * 2. Applies or removes the `.dark` class on <html>
 * 3. Subscribes to the `change` event for live updates
 *
 * On unmount:
 * - Removes the matchMedia listener (no leak)
 *
 * Returns `{ theme }` so components can branch on the active theme if needed.
 */
export function useThemeDetection(): UseThemeDetectionResult {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia(DARK_MQ).matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const mql = window.matchMedia(DARK_MQ)

    const apply = (isDark: boolean) => {
      const root = document.documentElement
      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      setTheme(isDark ? 'dark' : 'light')
    }

    // Apply on mount (in case FOUC script missed or SSR)
    apply(mql.matches)

    const handler = (e: MediaQueryListEvent) => apply(e.matches)
    mql.addEventListener('change', handler)

    return () => mql.removeEventListener('change', handler)
  }, [])

  return { theme }
}
