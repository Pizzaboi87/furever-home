import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ClipboardList,
} from 'lucide-react'

import MotionReveal from '@/components/ui/MotionReveal'
import StatCard from '@/components/admin/common/StatCard'

type TaskStatsProps = {
  total: number
  overdue: number
  dueToday: number
  upcoming: number
}

const TaskStats = ({ total, overdue, dueToday, upcoming }: TaskStatsProps) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MotionReveal>
        <StatCard label="Total tasks" value={total} icon={ClipboardList} />
      </MotionReveal>

      <MotionReveal delay={0.04}>
        <StatCard label="Overdue" value={overdue} icon={AlertTriangle} />
      </MotionReveal>

      <MotionReveal delay={0.08}>
        <StatCard label="Due today" value={dueToday} icon={Clock3} />
      </MotionReveal>

      <MotionReveal delay={0.12}>
        <StatCard label="Upcoming" value={upcoming} icon={CheckCircle2} />
      </MotionReveal>
    </div>
  )
}

export default TaskStats
