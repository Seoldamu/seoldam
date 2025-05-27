import { useEffect, useRef, RefObject } from 'react'

const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  callback: () => void
): RefObject<T | null> => {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [callback])

  return ref
}

export default useOutsideClick
