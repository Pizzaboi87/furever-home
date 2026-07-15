import type { Prisma } from "@prisma/client";

export type RawPet = {
  id: string;
  name: string;
  species: string;
  description: string;
  age: number;
  gender: string;
  weight: number;
  image: string;
  status: string;
  size?: string;
  neutered?: boolean;
  goodWithChildren?: boolean;
  goodWithOtherAnimals?: boolean;
  ageGroup?: string;
  daysInShelter?: number;
  lastUpdated?: string;
};

export type RawStaff = {
  id: string;
  name: string;
  role: string;
  email: string;
  active?: boolean;
};

export type RawAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
};

export type RawPerson = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | RawAddress | null;
  preferredContactMethod?: string | null;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type PetsFile = {
  pets: RawPet[];
};

export type RawShelterEvent = {
  id: string;
  name: string;
  type: string;
  date: string;
  location?: string | null;
  notes?: string | null;
  createdAt?: string;
};

export type RawShelterCase = {
  id: string;
  caseNumber?: string | null;
  type: string;
  scope: string;
  status: string;
  priority: string;
  source?: string | null;
  personId: string;
  petId?: string | null;
  relatedPetId?: string | null;
  relatedEventId?: string | null;
  relatedDonationId?: string | null;
  subject: string;
  summary?: string | null;
  assignedStaffId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  closedAt?: string | null;
  outcome?: string | null;
  nextFollowUpAt?: string | null;
  nextFollowUpNote?: string | null;
  tags?: string[];
};

export type RawCaseInteraction = {
  id: string;
  caseId: string;
  channel: string;
  direction: string;
  occurredAt?: string;
  loggedAt?: string;
  loggedByStaffId?: string | null;
  contactPersonId?: string | null;
  contactPoint?: string | null;
  externalReference?: {
    system?: string | null;
    type?: string | null;
    reference?: string | null;
  } | null;
  summary: string;
  actionTaken?: string | null;
  nextStep?: string | null;
  visibility?: string | null;
};

export type RawCaseNote = {
  id: string;
  caseId: string;
  staffId?: string | null;
  body: string;
  createdAt?: string;
  tags?: string[];
  visibility?: string | null;
};

export type RawCaseEvent = {
  id: string;
  caseId: string;
  type: string;
  title: string;
  detail?: string | null;
  createdAt?: string;
  actorType?: string | null;
  actorId?: string | null;
  actorName?: string | null;
  actorRole?: string | null;
};

export type RawActivityEvent = {
  id: string;
  type: string;
  title: string;
  detail: string;
  createdAt?: string;
  petId?: string | null;
  caseId?: string | null;
  personId?: string | null;
  actorId?: string | null;
  actorName?: string | null;
  actorRole?: string | null;
};

export type RawAdoptionApplication = {
  id: string;
  caseId: string;
  personId: string;
  petId: string;
  sourceApplicationId?: string | null;
  status: string;
  householdType?: string | null;
  hasOtherPets?: boolean | null;
  hasChildren?: boolean | null;
  housingType?: string | null;
  landlordApproval?: string | null;
  experienceLevel?: string | null;
  score?: number | null;
  screeningNote?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RawVirtualAdoption = {
  id: string;
  caseId: string;
  personId: string;
  petId: string;
  status: string;
  frequency: string;
  amount?: number | null;
  currency?: string | null;
  sponsorUpdateRequested?: boolean | null;
  certificateSent?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RawDonationInquiry = {
  id: string;
  caseId: string;
  personId: string;
  donationId?: string | null;
  inquiryType: string;
  status: string;
  amount?: number | null;
  currency?: string | null;
  frequency?: string | null;
  receiptRequested?: boolean | null;
  thankYouSent?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RawVolunteerApplication = {
  id: string;
  caseId: string;
  personId: string;
  status: string;
  interestAreas?: string[];
  availability?: string | null;
  experience?: string | null;
  backgroundCheckStatus?: string | null;
  orientationScheduledAt?: string | null;
  orientationCompleted?: boolean | null;
  assignedRole?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RawDashboardRecord = Record<
  string,
  Prisma.JsonValue | undefined
>;

export type DashboardCollectionName =
  | "animalIntakes"
  | "adoptions"
  | "applications"
  | "donations"
  | "volunteerHours"
  | "activityEvents"
  | "dailySummaries"
  | "monthlySummaries"
  | "speciesMonthlySummaries"
  | "petStatusEvents"
  | "monthlyPetSnapshots";

export type AdminDashboardFile = {
  metadata?: RawDashboardRecord;
  animalIntakes?: RawDashboardRecord[];
  adoptions?: RawDashboardRecord[];
  applications?: RawDashboardRecord[];
  donations?: RawDashboardRecord[];
  volunteerHours?: RawDashboardRecord[];
  dailySummaries?: RawDashboardRecord[];
  monthlySummaries?: RawDashboardRecord[];
  speciesMonthlySummaries?: RawDashboardRecord[];
  petStatusEvents?: RawDashboardRecord[];
  monthlyPetSnapshots?: RawDashboardRecord[];
  staff?: RawStaff[];
  people?: RawPerson[];
  shelterEvents?: RawShelterEvent[];
  cases?: RawShelterCase[];
  caseInteractions?: RawCaseInteraction[];
  caseNotes?: RawCaseNote[];
  caseEvents?: RawCaseEvent[];
  activityEvents?: RawActivityEvent[];
  adoptionApplications?: RawAdoptionApplication[];
  virtualAdoptions?: RawVirtualAdoption[];
  donationInquiries?: RawDonationInquiry[];
  volunteerApplications?: RawVolunteerApplication[];
};

export type UploadedImage = {
  publicId: string;
  secureUrl: string;
  thumbnailUrl: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};
