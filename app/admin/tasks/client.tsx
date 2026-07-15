'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import Header from '@/components/admin/common/Header'
import TaskBucketsPanel from '@/components/admin/tasks/TaskBucketsPanel'
import TaskFilters from '@/components/admin/tasks/TaskFilters'
import TaskListPanel from '@/components/admin/tasks/TaskListPanel'
import TaskStats from '@/components/admin/tasks/TaskStats'
import type { DashboardRecord } from '@/lib/admin/domain'
import {
  getSearchableTaskText,
  getTaskGroup,
  getUniqueFilterValues,
  normalizeTaskValue,
  sortTasks,
  stringValue,
} from '@/utils/admin/tasks/task-utils'

export default function TasksClient({ tasks }: { tasks: DashboardRecord[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [bucketFilter, setBucketFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [staffFilter, setStaffFilter] = useState('all')
  const bucketPanelRef = useRef<HTMLDivElement | null>(null)
  const [bucketPanelHeight, setBucketPanelHeight] = useState<number | null>(null)

  const sortedTasks = useMemo(() => sortTasks(tasks), [tasks])
  const typeValues = useMemo(() => getUniqueFilterValues(tasks, 'type'), [tasks])
  const priorityValues = useMemo(() => getUniqueFilterValues(tasks, 'priority'), [tasks])
  const staffValues = useMemo(() => {
    return Array.from(
      new Map(
        tasks
          .map((task) => stringValue(task.assignedStaff).trim())
          .filter(Boolean)
          .map((staff) => [normalizeTaskValue(staff), staff]),
      ).entries(),
    )
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    const search = normalizeTaskValue(searchTerm)

    return sortedTasks.filter((task) => {
      const owner = stringValue(task.assignedStaff).trim()

      return (
        (!search || getSearchableTaskText(task).includes(search)) &&
        (bucketFilter === 'all' || normalizeTaskValue(task.bucket) === bucketFilter) &&
        (typeFilter === 'all' || normalizeTaskValue(task.type) === typeFilter) &&
        (priorityFilter === 'all' || normalizeTaskValue(task.priority) === priorityFilter) &&
        (staffFilter === 'all' ||
          (staffFilter === 'unassigned' && !owner) ||
          normalizeTaskValue(owner) === staffFilter)
      )
    })
  }, [bucketFilter, priorityFilter, searchTerm, sortedTasks, staffFilter, typeFilter])

  const overdueTasks = getTaskGroup(filteredTasks, 'overdue')
  const todayTasks = getTaskGroup(filteredTasks, 'today')
  const upcomingTasks = getTaskGroup(filteredTasks, 'upcoming')
  const allOverdueTasks = getTaskGroup(tasks, 'overdue')
  const allTodayTasks = getTaskGroup(tasks, 'today')
  const allUpcomingTasks = getTaskGroup(tasks, 'upcoming')

  useEffect(() => {
    const bucketPanelElement = bucketPanelRef.current

    if (!bucketPanelElement) {
      return
    }

    const updateBucketPanelHeight = () => {
      setBucketPanelHeight(bucketPanelElement.offsetHeight)
    }

    updateBucketPanelHeight()

    const resizeObserver = new ResizeObserver(updateBucketPanelHeight)
    resizeObserver.observe(bucketPanelElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [filteredTasks.length, overdueTasks.length, todayTasks.length, upcomingTasks.length])

  return (
    <main className="min-h-screen bg-background">
      <Header
        currentHref="/admin/tasks"
        title="Manage Tasks"
        description="Review open follow-ups, overdue case work, and upcoming staff tasks."
      />

      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <TaskStats
          total={tasks.length}
          overdue={allOverdueTasks.length}
          dueToday={allTodayTasks.length}
          upcoming={allUpcomingTasks.length}
        />

        <TaskFilters
          searchTerm={searchTerm}
          bucketFilter={bucketFilter}
          typeFilter={typeFilter}
          priorityFilter={priorityFilter}
          staffFilter={staffFilter}
          typeValues={typeValues}
          priorityValues={priorityValues}
          staffValues={staffValues}
          onSearchTermChange={setSearchTerm}
          onBucketFilterChange={setBucketFilter}
          onTypeFilterChange={setTypeFilter}
          onPriorityFilterChange={setPriorityFilter}
          onStaffFilterChange={setStaffFilter}
        />

        <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
          <TaskListPanel
            tasks={filteredTasks}
            totalTaskCount={tasks.length}
            bucketPanelHeight={bucketPanelHeight}
          />

          <TaskBucketsPanel
            overdueTasks={overdueTasks}
            todayTasks={todayTasks}
            upcomingTasks={upcomingTasks}
            panelRef={bucketPanelRef}
          />
        </section>
      </div>
    </main>
  )
}
