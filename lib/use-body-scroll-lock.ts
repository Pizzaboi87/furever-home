'use client'

import { useLayoutEffect } from 'react'

const LOCK_COUNT_ATTRIBUTE = 'bodyScrollLockCount'
const PREVIOUS_OVERFLOW_ATTRIBUTE = 'bodyScrollLockPreviousOverflow'
const PREVIOUS_PADDING_RIGHT_ATTRIBUTE = 'bodyScrollLockPreviousPaddingRight'

const getLockCount = () => {
  const value = document.body.dataset[LOCK_COUNT_ATTRIBUTE]

  if (!value) {
    return 0
  }

  const parsedValue = Number.parseInt(value, 10)

  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const setLockCount = (count: number) => {
  if (count <= 0) {
    delete document.body.dataset[LOCK_COUNT_ATTRIBUTE]
    return
  }

  document.body.dataset[LOCK_COUNT_ATTRIBUTE] = String(count)
}

const lockBodyScroll = () => {
  const currentLockCount = getLockCount()

  if (currentLockCount === 0) {
    document.body.dataset[PREVIOUS_OVERFLOW_ATTRIBUTE] = document.body.style.overflow
    document.body.dataset[PREVIOUS_PADDING_RIGHT_ATTRIBUTE] = document.body.style.paddingRight

    const supportsStableScrollbarGutter = CSS.supports('scrollbar-gutter: stable')
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    if (!supportsStableScrollbarGutter && scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    document.body.style.overflow = 'hidden'
  }

  setLockCount(currentLockCount + 1)
}

const unlockBodyScroll = () => {
  const nextLockCount = Math.max(getLockCount() - 1, 0)

  if (nextLockCount > 0) {
    setLockCount(nextLockCount)
    return
  }

  const previousOverflow = document.body.dataset[PREVIOUS_OVERFLOW_ATTRIBUTE] ?? ''
  const previousPaddingRight = document.body.dataset[PREVIOUS_PADDING_RIGHT_ATTRIBUTE] ?? ''

  document.body.style.overflow = previousOverflow
  document.body.style.paddingRight = previousPaddingRight

  delete document.body.dataset[PREVIOUS_OVERFLOW_ATTRIBUTE]
  delete document.body.dataset[PREVIOUS_PADDING_RIGHT_ATTRIBUTE]
  setLockCount(0)
}

export const useBodyScrollLock = (isLocked: boolean) => {
  useLayoutEffect(() => {
    if (!isLocked) {
      return
    }

    lockBodyScroll()

    return () => {
      unlockBodyScroll()
    }
  }, [isLocked])
}
