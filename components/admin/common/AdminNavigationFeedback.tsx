'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

const isInternalNavigation = (anchor: HTMLAnchorElement) => {
  if (
    anchor.target === '_blank' ||
    anchor.hasAttribute('download') ||
    anchor.getAttribute('aria-disabled') === 'true' ||
    anchor.dataset.adminNavigationFeedback === 'none'
  ) {
    return false
  }

  const href = anchor.getAttribute('href')

  if (!href || href.startsWith('#')) {
    return false
  }

  const destination = new URL(anchor.href, window.location.href)
  const current = new URL(window.location.href)

  return (
    destination.origin === current.origin &&
    `${destination.pathname}${destination.search}` !==
      `${current.pathname}${current.search}`
  )
}

export default function AdminNavigationFeedback() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, setIsPending] = useState(false)
  const pendingElementRef = useRef<HTMLAnchorElement | null>(null)
  const pendingStyleRef = useRef<string | null>(null)
  const routeKey = `${pathname}?${searchParams.toString()}`

  const restorePendingElement = useCallback(() => {
    const pendingElement = pendingElementRef.current

    if (!pendingElement) {
      return
    }

    pendingElement.removeAttribute('data-admin-navigation-pending')
    pendingElement.removeAttribute('aria-busy')

    if (pendingStyleRef.current === null) {
      pendingElement.removeAttribute('style')
    } else {
      pendingElement.setAttribute('style', pendingStyleRef.current)
    }

    pendingElementRef.current = null
    pendingStyleRef.current = null
  }, [])

  useEffect(() => {
    setIsPending(false)
    restorePendingElement()
  }, [restorePendingElement, routeKey])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      const anchor = target.closest('a')

      if (!(anchor instanceof HTMLAnchorElement) || !isInternalNavigation(anchor)) {
        return
      }

      restorePendingElement()

      const bounds = anchor.getBoundingClientRect()
      const spinnerColor = window.getComputedStyle(anchor).color

      pendingStyleRef.current = anchor.getAttribute('style')
      anchor.style.setProperty('--admin-navigation-pending-width', `${bounds.width}px`)
      anchor.style.setProperty('--admin-navigation-pending-height', `${bounds.height}px`)
      anchor.style.setProperty('--admin-navigation-spinner-color', spinnerColor)
      anchor.setAttribute('data-admin-navigation-pending', 'true')
      anchor.setAttribute('aria-busy', 'true')
      pendingElementRef.current = anchor
      setIsPending(true)
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
      restorePendingElement()
    }
  }, [restorePendingElement])

  if (!isPending) {
    return null
  }

  return (
    <div
      aria-live="polite"
      aria-label="Loading the requested page"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-primary/15"
      role="status"
    >
      <div className="admin-navigation-progress h-full w-1/3 rounded-full bg-primary" />
    </div>
  )
}
