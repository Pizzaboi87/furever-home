import type { DashboardRecord } from '@/lib/admin/domain'
import { getBucketClassName, taskKeyValue } from '@/utils/admin/tasks/task-utils'
import CompactTaskCard from '@/components/admin/tasks/CompactTaskCard'

const MAX_VISIBLE_BUCKET_TASKS = 3

export default function TaskBucketSection({
  title,
  description,
  tasks,
  bucket,
}: {
  title: string
  description: string
  tasks: DashboardRecord[]
  bucket: 'overdue' | 'today' | 'upcoming'
}) {
  const visibleTasks = tasks.slice(0, MAX_VISIBLE_BUCKET_TASKS)

  return (
    <div className="rounded-xl border border-border bg-input p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-foreground">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>

        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getBucketClassName(bucket)}`}>
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {visibleTasks.map((task, index) => (
          <CompactTaskCard key={taskKeyValue(task.id, `bucket-task-${index}`)} task={task} />
        ))}

        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-white px-3 py-4 text-sm text-muted-foreground">
            No tasks in this bucket.
          </div>
        ) : null}

        {tasks.length > visibleTasks.length ? (
          <p className="rounded-lg border border-dashed border-border bg-white p-3 text-center text-xs font-semibold text-muted-foreground">
            Showing top {visibleTasks.length} of {tasks.length} tasks.
          </p>
        ) : null}
      </div>
    </div>
  )
}
