import { ClipboardList, Filter, PawPrint, ShieldCheck } from 'lucide-react'

import MotionReveal from '@/components/ui/MotionReveal'
import StatCard from '@/components/admin/common/StatCard'

type CaseStatsProps = {
  total: number
  open: number
  highPriority: number
  petRelated: number
}

const CaseStats = ({ total, open, highPriority, petRelated }: CaseStatsProps) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MotionReveal>
        <StatCard label="Total cases" value={total} icon={ClipboardList} />
      </MotionReveal>

      <MotionReveal delay={0.04}>
        <StatCard label="Open cases" value={open} icon={Filter} />
      </MotionReveal>

      <MotionReveal delay={0.08}>
        <StatCard label="High priority" value={highPriority} icon={ShieldCheck} />
      </MotionReveal>

      <MotionReveal delay={0.12}>
        <StatCard label="Pet related" value={petRelated} icon={PawPrint} />
      </MotionReveal>
    </div>
  )
}

export default CaseStats
