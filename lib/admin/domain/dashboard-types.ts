import type { AdminPet } from './pet-types'

export type DashboardRecordValue = string | number | boolean | null | undefined

export type DashboardRecord = {
  id?: string
  caseId?: string
  petId?: string | number
  personId?: string
  staffId?: string
  sourceApplicationId?: string
  month?: string
  date?: string
  createdAt?: string
  updatedAt?: string
  lastActivityAt?: string
  type?: string
  species?: string
  status?: string
  fromStatus?: string | null
  toStatus?: string
  publicStatus?: string
  ageGroup?: string
  size?: string
  gender?: string
  healthStatus?: string
  channel?: string
  source?: string
  title?: string
  detail?: string
  actorId?: string | null
  actorName?: string | null
  actorRole?: string | null
  subject?: string
  personName?: string
  petName?: string
  assignedStaff?: string
  assignedStaffId?: string | null
  priority?: string
  nextFollowUpAt?: string | null
  nextFollowUpNote?: string | null
  bucket?: string
  caseType?: string
  caseStatus?: string
  inShelter?: boolean
  intakes?: number
  adoptions?: number
  applications?: number
  donations?: number
  volunteerHours?: number
  hours?: number
  amount?: number
  count?: number
  total?: number
  [key: string]: DashboardRecordValue
}

export type AdminDashboardDataset = {
  metadata: DashboardRecord
  pets: AdminPet[]
  intakes: DashboardRecord[]
  adoptions: DashboardRecord[]
  applications: DashboardRecord[]
  donations: DashboardRecord[]
  volunteerHours: DashboardRecord[]
  activityEvents: DashboardRecord[]
  dailySummaries: DashboardRecord[]
  monthlySummaries: DashboardRecord[]
  speciesMonthlySummaries: DashboardRecord[]
  petStatusEvents: DashboardRecord[]
  followUps: DashboardRecord[]
  monthlyPetSnapshots: DashboardRecord[]
}
