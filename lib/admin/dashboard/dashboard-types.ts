import type {
  AdoptionApplication,
  DashboardRecord,
  DonationInquiry,
  VirtualAdoption,
} from '../domain'

export type DashboardAnalyticsDataset = {
  metadata: DashboardRecord
  animalIntakes: DashboardRecord[]
  adoptions: DashboardRecord[]
  applications: DashboardRecord[]
  donations: DashboardRecord[]
  volunteerHours: DashboardRecord[]
  activityEvents: DashboardRecord[]
  dailySummaries: DashboardRecord[]
  monthlySummaries: DashboardRecord[]
  speciesMonthlySummaries: DashboardRecord[]
  petStatusEvents: DashboardRecord[]
  monthlyPetSnapshots: DashboardRecord[]
}

export type LiveDashboardRecords = {
  adoptionApplications: AdoptionApplication[]
  donationInquiries: DonationInquiry[]
  virtualAdoptions: VirtualAdoption[]
  volunteerHours: DashboardRecord[]
  activityEvents: DashboardRecord[]
  petStatusEvents: DashboardRecord[]
}
