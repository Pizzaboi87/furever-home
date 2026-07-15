import type { RefObject } from 'react'

import SectionCard from '@/components/admin/common/SectionCard'
import TaskBucketSection from '@/components/admin/tasks/TaskBucketSection'
import type { DashboardRecord } from '@/lib/admin/domain'

type TaskBucketsPanelProps = {
  overdueTasks: DashboardRecord[]
  todayTasks: DashboardRecord[]
  upcomingTasks: DashboardRecord[]
  panelRef: RefObject<HTMLDivElement | null>
}

const TaskBucketsPanel = ({
  overdueTasks,
  todayTasks,
  upcomingTasks,
  panelRef,
}: TaskBucketsPanelProps) => {
  return (
    <div ref={panelRef} className="xl:sticky xl:top-6">
      <SectionCard delay={0.2}>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground">Task buckets</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Top 3 matching tasks in each bucket.
          </p>
        </div>

        <div className="space-y-3">
          <TaskBucketSection
            title="Overdue"
            description="Past-due follow-ups that should be handled first."
            tasks={overdueTasks}
            bucket="overdue"
          />

          <TaskBucketSection
            title="Due today"
            description="Items that should be handled before the day ends."
            tasks={todayTasks}
            bucket="today"
          />

          <TaskBucketSection
            title="Upcoming"
            description="Scheduled follow-ups that are not due yet."
            tasks={upcomingTasks}
            bucket="upcoming"
          />
        </div>
      </SectionCard>
    </div>
  )
}

export default TaskBucketsPanel
