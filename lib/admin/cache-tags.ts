export const ADMIN_CACHE_TAGS = {
  cases: 'admin:cases',
  dashboard: 'admin:dashboard',
  people: 'admin:people',
  pets: 'admin:pets',
  staff: 'admin:staff',
  tasks: 'admin:tasks',
} as const

export const ADMIN_CACHE_TAG_LIST = Object.values(ADMIN_CACHE_TAGS)
