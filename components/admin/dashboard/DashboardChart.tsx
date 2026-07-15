import type { EChartsOption } from 'echarts'
import type { LucideIcon } from 'lucide-react'
import { BarChart3 } from 'lucide-react'

import EChart from '@/components/ui/EChart'
import EmptyState from '@/components/ui/EmptyState'

type DashboardChartProps = {
  option: EChartsOption
  hasData: boolean
  emptyTitle: string
  emptyDescription: string
  className?: string
  emptyClassName?: string
  emptyIcon?: LucideIcon
}

export const DashboardChart = ({
  option,
  hasData,
  emptyTitle,
  emptyDescription,
  className = 'h-72 w-full',
  emptyClassName = 'min-h-72',
  emptyIcon = BarChart3,
}: DashboardChartProps) => {
  if (!hasData) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        className={`${className} ${emptyClassName}`}
      />
    )
  }

  return <EChart option={option} className={className} />
}
