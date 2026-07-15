import type { ReactNode } from 'react'

export default function AppTemplate({ children }: { children: ReactNode }) {
  return <div className="route-transition">{children}</div>
}
