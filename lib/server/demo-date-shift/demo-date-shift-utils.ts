export const getUtcDateKey = (date: Date) => date.toISOString().slice(0, 10)

export const shouldShiftMonthLabels = (date: Date) => date.getUTCDate() === 1
