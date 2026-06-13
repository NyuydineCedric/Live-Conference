import React from 'react'

export function useEffectAsync(asyncFunction, deps) {
  React.useEffect(() => {
    let isMounted = true

    const execute = async () => {
      try {
        if (isMounted) {
          await asyncFunction()
        }
      } catch (error) {
        console.error('Effect error:', error)
      }
    }

    execute()

    return () => {
      isMounted = false
    }
  }, deps)
}

export function useClickOutside(ref, callback) {
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [callback])
}

export function useWindowSize() {
  const [size, setSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  React.useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

export function useMounted() {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}

export function useThrottle(value, delay = 500) {
  const [throttledValue, setThrottledValue] = React.useState(value)
  const lastRun = React.useRef(Date.now())

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= delay) {
        setThrottledValue(value)
        lastRun.current = Date.now()
      }
    }, delay - (Date.now() - lastRun.current))

    return () => clearTimeout(handler)
  }, [value, delay])

  return throttledValue
}

export function useToggle(initialValue = false) {
  const [value, setValue] = React.useState(initialValue)

  const toggle = React.useCallback(() => {
    setValue((v) => !v)
  }, [])

  return [value, toggle, setValue]
}

export function useCounter(initialValue = 0) {
  const [count, setCount] = React.useState(initialValue)

  const increment = React.useCallback(() => {
    setCount((c) => c + 1)
  }, [])

  const decrement = React.useCallback(() => {
    setCount((c) => c - 1)
  }, [])

  const reset = React.useCallback(() => {
    setCount(initialValue)
  }, [initialValue])

  return { count, increment, decrement, reset, setCount }
}
