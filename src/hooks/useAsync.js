import { useEffect, useState, useCallback, useRef } from 'react'

export const useAsync = (asyncFn, deps = [], options = {}) => {
  const { immediate = true } = options
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const run = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn(...args)
      if (mountedRef.current) setData(result)
      return result
    } catch (e) {
      if (mountedRef.current) setError(e)
      throw e
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, deps)

  useEffect(() => {
    if (immediate) run().catch(() => {})
  }, deps)

  return { data, error, loading, run, setData }
}
