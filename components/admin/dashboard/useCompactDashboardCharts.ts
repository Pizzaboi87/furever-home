'use client'

import { useEffect, useState } from 'react'

const MOBILE_DASHBOARD_CHART_QUERY = '(max-width: 767px)'

export const useCompactDashboardCharts = () => {
    const [shouldCompact, setShouldCompact] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia(MOBILE_DASHBOARD_CHART_QUERY)

        const updateCompactMode = () => {
            setShouldCompact(mediaQuery.matches)
        }

        updateCompactMode()

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', updateCompactMode)

            return () => {
                mediaQuery.removeEventListener('change', updateCompactMode)
            }
        }

        mediaQuery.addListener(updateCompactMode)

        return () => {
            mediaQuery.removeListener(updateCompactMode)
        }
    }, [])

    return shouldCompact
}
