import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { db } from '../db/database.js'

const ThemeContext = createContext(null)

const normalizeTheme = (value) => (value === 'dark' ? 'dark' : 'light')

export const applyThemeToDocument = (theme) => {
  const nextTheme = normalizeTheme(theme)
  const root = document.documentElement
  root.classList.toggle('dark', nextTheme === 'dark')
  root.dataset.theme = nextTheme
  root.style.colorScheme = nextTheme
}

const readStoredTheme = () => normalizeTheme(db.setting('theme'))

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(readStoredTheme)

  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  const setTheme = useCallback((next) => {
    setThemeState((current) => {
      const resolved = normalizeTheme(typeof next === 'function' ? next(current) : next)
      db.setting('theme', resolved)
      return resolved
    })
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggleTheme
    }),
    [setTheme, theme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
