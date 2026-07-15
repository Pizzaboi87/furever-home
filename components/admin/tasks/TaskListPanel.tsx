import Link from 'next/link'
import type { CSSProperties } from 'react'

import AdminListPanel from '@/components/admin/common/AdminListPanel'
import TaskMobileCard from '@/components/admin/tasks/TaskMobileCard'
import type { DashboardRecord } from '@/lib/admin/domain'
import {
  formatDateTimeParts,
  formatTaskLabel,
  getPriorityClassName,
  getTaskOwnerLabel,
  stringValue,
  taskKeyValue,
} from '@/utils/admin/tasks/task-utils'

type TaskListPanelProps = {
  tasks: DashboardRecord[]
  totalTaskCount: number
  bucketPanelHeight: number | null
}

const TaskListPanel = ({ tasks, totalTaskCount, bucketPanelHeight }: TaskListPanelProps) => {
  const emptyMessage = 'No open follow-up tasks match the selected filters.'
  const style = bucketPanelHeight
    ? ({ '--bucket-panel-height': `${bucketPanelHeight}px` } as CSSProperties)
    : undefined

  return (
    <AdminListPanel
      title="All open follow-up tasks"
      description={`Showing ${tasks.length} of ${totalTaskCount} tasks. Sorted by follow-up date, then case subject.`}
      className="flex min-h-0 flex-col xl:h-(--bucket-panel-height)"
      bodyClassName="min-h-0 flex-1 overflow-auto"
      style={style}
    >
      <div className="space-y-3 p-4 lg:hidden">
        {tasks.map((task, index) => (
          <TaskMobileCard key={taskKeyValue(task.id, `task-mobile-${index}`)} task={task} index={index} />
        ))}

        {tasks.length === 0 ? (
          <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : null}
      </div>

      <table className="hidden w-full min-w-230 text-left text-sm lg:table">
        <colgroup>
          <col className="w-[24%]" />
          <col className="w-[15%]" />
          <col className="w-[13%]" />
          <col className="w-[13%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[15%]" />
        </colgroup>

        <thead className="sticky top-0 z-10 bg-input text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-5 py-3">Task</th>
            <th className="px-5 py-3">Contact</th>
            <th className="px-5 py-3">Related pet</th>
            <th className="px-5 py-3">Owner</th>
            <th className="px-5 py-3">Type</th>
            <th className="px-5 py-3">Priority</th>
            <th className="px-5 py-3">Due</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {tasks.map((task, index) => {
            const dueDateTime = formatDateTimeParts(task.nextFollowUpAt)

            return (
              <tr
                key={taskKeyValue(task.id, `task-row-${index}`)}
                className="bg-white transition-colors hover:bg-indigo-50/60"
              >
                <td className="px-5 py-4 align-middle">
                  <Link
                    href={`/admin/cases/${task.caseId}`}
                    className="font-bold text-primary transition-colors hover:text-primary/80 hover:underline"
                  >
                    {stringValue(task.subject) || 'Untitled case'}
                  </Link>

                  {task.nextFollowUpNote ? (
                    <p className="mt-1 line-clamp-1 text-xs leading-5 text-muted-foreground">
                      {stringValue(task.nextFollowUpNote)}
                    </p>
                  ) : null}
                </td>

                <td className="px-5 py-4 align-middle text-muted-foreground">
                  {stringValue(task.applicantName) || 'Unknown contact'}
                </td>

                <td className="px-5 py-4 align-middle text-muted-foreground">
                  {task.petName ? stringValue(task.petName) : 'No related pet'}
                </td>

                <td className="px-5 py-4 align-middle text-muted-foreground">
                  {getTaskOwnerLabel(task)}
                </td>

                <td className="px-5 py-4 align-middle text-muted-foreground">
                  {formatTaskLabel(task.type)}
                </td>

                <td className="px-5 py-4 align-middle">
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getPriorityClassName(task.priority)}`}>
                    {formatTaskLabel(task.priority ?? 'medium')}
                  </span>
                </td>

                <td className="px-5 py-4 align-middle">
                  <div className="flex flex-col items-start gap-1">
                    <span className="whitespace-nowrap text-xs font-semibold text-muted-foreground">
                      {dueDateTime.date}
                    </span>

                    {dueDateTime.time ? (
                      <span className="whitespace-nowrap text-xs font-semibold text-muted-foreground">
                        {dueDateTime.time}
                      </span>
                    ) : null}

                    <span className={`w-fit rounded-full border px-2.5 py-1 text-xs font-bold ${getPriorityClassName(task.priority)}`}>
                      {formatTaskLabel(task.priority ?? 'medium')}
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}

          {tasks.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </AdminListPanel>
  )
}

export default TaskListPanel
