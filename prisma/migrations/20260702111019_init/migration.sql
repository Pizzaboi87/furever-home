-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'CASE_MANAGER', 'VOLUNTEER_COORDINATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "PetStatus" AS ENUM ('AVAILABLE', 'NEW', 'RESERVED', 'ADOPTION_IN_PROGRESS', 'ADOPTED', 'UNAVAILABLE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "PetPublicStatus" AS ENUM ('PUBLISHED', 'DRAFT', 'HIDDEN', 'RESERVED', 'ADOPTED');

-- CreateEnum
CREATE TYPE "CaseType" AS ENUM ('GENERAL_QUESTION', 'PET_QUESTION', 'ADOPTION_APPLICATION', 'VIRTUAL_ADOPTION', 'DONATION_SUPPORT', 'VOLUNTEER_APPLICATION', 'EVENT_FOLLOWUP', 'SURRENDER_REQUEST', 'LOST_AND_FOUND', 'MEDICAL_UPDATE', 'OTHER');

-- CreateEnum
CREATE TYPE "CaseScope" AS ENUM ('PET_RELATED', 'GENERAL');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('NEW', 'OPEN', 'WAITING_ON_CONTACT', 'WAITING_ON_STAFF', 'SCREENING', 'SCHEDULED', 'APPROVED', 'DECLINED', 'COMPLETED', 'CLOSED', 'CANCELLED', 'REJECTED', 'NO_RESPONSE');

-- CreateEnum
CREATE TYPE "CasePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('WEBSITE_FORM', 'EMAIL', 'PHONE', 'WALK_IN', 'SHELTER_EVENT', 'ADMIN_CREATED', 'INTERNAL');

-- CreateEnum
CREATE TYPE "CaseInteractionDirection" AS ENUM ('INBOUND', 'OUTBOUND', 'INTERNAL');

-- CreateEnum
CREATE TYPE "CaseInteractionReferenceSystem" AS ENUM ('EMAIL_CLIENT', 'CALL_RECORDING', 'WEBSITE', 'MANUAL', 'EVENT_SIGNUP', 'STRIPE', 'SENDER_COM');

-- CreateEnum
CREATE TYPE "CaseInteractionReferenceType" AS ENUM ('EMAIL', 'CALL', 'FORM_SUBMISSION', 'CONVERSATION', 'MANUAL_NOTE', 'PAYMENT', 'SUBSCRIBER_EVENT');

-- CreateEnum
CREATE TYPE "CaseEventActorType" AS ENUM ('SYSTEM', 'STAFF', 'CONTACT', 'APPLICANT', 'VOLUNTEER', 'DONOR');

-- CreateEnum
CREATE TYPE "PersonProfileType" AS ENUM ('ADOPTER', 'FOSTER', 'VOLUNTEER', 'DONOR', 'SUPPORTER', 'GENERAL_CONTACT');

-- CreateEnum
CREATE TYPE "LandlordApprovalStatus" AS ENUM ('NOT_NEEDED', 'PENDING', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('FIRST_TIME', 'SOME_EXPERIENCE', 'EXPERIENCED');

-- CreateEnum
CREATE TYPE "VirtualAdoptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentFrequency" AS ENUM ('ONE_TIME', 'MONTHLY', 'QUARTERLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "DonationInquiryType" AS ENUM ('RECEIPT_REQUEST', 'MONTHLY_DONATION_CHANGE', 'CORPORATE_DONATION', 'REFUND_OR_CORRECTION', 'ALLOCATION_QUESTION', 'EVENT_SPONSORSHIP', 'OTHER');

-- CreateEnum
CREATE TYPE "VolunteerApplicationStatus" AS ENUM ('NEW', 'SCREENING', 'ORIENTATION_SCHEDULED', 'APPROVED', 'DECLINED', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BackgroundCheckStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'CLEARED', 'FAILED');

-- CreateTable
CREATE TABLE "StaffUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "StaffRole" NOT NULL DEFAULT 'CASE_MANAGER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "passwordHash" TEXT,
    "lastSignedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "preferredContactMethod" "ContactChannel",
    "profileType" "PersonProfileType",
    "householdType" TEXT,
    "hasOtherPets" BOOLEAN,
    "interestAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "publicSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "status" "PetStatus" NOT NULL DEFAULT 'AVAILABLE',
    "publicStatus" "PetPublicStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "size" TEXT,
    "neutered" BOOLEAN,
    "goodWithChildren" BOOLEAN,
    "goodWithOtherAnimals" BOOLEAN,
    "ageGroup" TEXT,
    "daysInShelter" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "hiddenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetImage" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "format" TEXT,
    "bytes" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShelterEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShelterEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShelterCase" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT,
    "type" "CaseType" NOT NULL,
    "scope" "CaseScope" NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'NEW',
    "priority" "CasePriority" NOT NULL DEFAULT 'MEDIUM',
    "source" "ContactChannel",
    "personId" TEXT NOT NULL,
    "petId" TEXT,
    "relatedEventId" TEXT,
    "relatedDonationId" TEXT,
    "subject" TEXT NOT NULL,
    "summary" TEXT,
    "assignedStaffId" TEXT,
    "outcome" TEXT,
    "nextFollowUpAt" TIMESTAMP(3),
    "nextFollowUpNote" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "ShelterCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseInteraction" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "channel" "ContactChannel" NOT NULL,
    "direction" "CaseInteractionDirection" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loggedByStaffId" TEXT,
    "contactPersonId" TEXT,
    "contactPoint" TEXT,
    "referenceSystem" "CaseInteractionReferenceSystem",
    "referenceType" "CaseInteractionReferenceType",
    "reference" TEXT,
    "summary" TEXT NOT NULL,
    "actionTaken" TEXT,
    "nextStep" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'internal',

    CONSTRAINT "CaseInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseNote" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "staffId" TEXT,
    "body" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "visibility" TEXT NOT NULL DEFAULT 'internal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseEvent" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorType" "CaseEventActorType",
    "actorId" TEXT,
    "actorName" TEXT,
    "actorRole" TEXT,

    CONSTRAINT "CaseEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdoptionApplication" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "sourceApplicationId" TEXT,
    "status" "CaseStatus" NOT NULL,
    "householdType" TEXT,
    "hasOtherPets" BOOLEAN,
    "hasChildren" BOOLEAN,
    "housingType" TEXT,
    "landlordApproval" "LandlordApprovalStatus",
    "experienceLevel" "ExperienceLevel",
    "score" INTEGER,
    "screeningNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdoptionApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualAdoption" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "status" "VirtualAdoptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "frequency" "PaymentFrequency" NOT NULL,
    "amount" DECIMAL(10,2),
    "currency" TEXT DEFAULT 'USD',
    "sponsorUpdateRequested" BOOLEAN NOT NULL DEFAULT false,
    "certificateSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualAdoption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationInquiry" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "externalDonationId" TEXT,
    "inquiryType" "DonationInquiryType" NOT NULL,
    "status" "CaseStatus" NOT NULL,
    "amount" DECIMAL(10,2),
    "currency" TEXT DEFAULT 'USD',
    "frequency" "PaymentFrequency",
    "receiptRequested" BOOLEAN NOT NULL DEFAULT false,
    "thankYouSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonationInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerApplication" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "status" "VolunteerApplicationStatus" NOT NULL DEFAULT 'NEW',
    "interestAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "availability" TEXT,
    "experience" TEXT,
    "backgroundCheckStatus" "BackgroundCheckStatus",
    "orientationScheduledAt" TIMESTAMP(3),
    "orientationCompleted" BOOLEAN NOT NULL DEFAULT false,
    "assignedRole" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolunteerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerHours" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "volunteerApplicationId" TEXT,
    "caseId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "activity" TEXT NOT NULL,
    "role" TEXT,
    "staffId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VolunteerHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "petId" TEXT,
    "caseId" TEXT,
    "personId" TEXT,
    "actorId" TEXT,
    "actorName" TEXT,
    "actorRole" TEXT,

    CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetStatusEvent" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "fromStatus" "PetStatus",
    "toStatus" "PetStatus" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "caseId" TEXT,
    "staffId" TEXT,

    CONSTRAINT "PetStatusEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffUser_email_key" ON "StaffUser"("email");

-- CreateIndex
CREATE INDEX "StaffUser_active_idx" ON "StaffUser"("active");

-- CreateIndex
CREATE INDEX "StaffUser_role_idx" ON "StaffUser"("role");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Person_name_idx" ON "Person"("name");

-- CreateIndex
CREATE INDEX "Person_email_idx" ON "Person"("email");

-- CreateIndex
CREATE INDEX "Person_phone_idx" ON "Person"("phone");

-- CreateIndex
CREATE INDEX "Person_profileType_idx" ON "Person"("profileType");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_publicSlug_key" ON "Pet"("publicSlug");

-- CreateIndex
CREATE INDEX "Pet_species_idx" ON "Pet"("species");

-- CreateIndex
CREATE INDEX "Pet_status_idx" ON "Pet"("status");

-- CreateIndex
CREATE INDEX "Pet_publicStatus_idx" ON "Pet"("publicStatus");

-- CreateIndex
CREATE INDEX "Pet_isPublished_publicStatus_status_idx" ON "Pet"("isPublished", "publicStatus", "status");

-- CreateIndex
CREATE INDEX "PetImage_petId_isPrimary_idx" ON "PetImage"("petId", "isPrimary");

-- CreateIndex
CREATE INDEX "PetImage_petId_sortOrder_idx" ON "PetImage"("petId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PetImage_petId_cloudinaryPublicId_key" ON "PetImage"("petId", "cloudinaryPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "ShelterCase_caseNumber_key" ON "ShelterCase"("caseNumber");

-- CreateIndex
CREATE INDEX "ShelterCase_status_idx" ON "ShelterCase"("status");

-- CreateIndex
CREATE INDEX "ShelterCase_type_idx" ON "ShelterCase"("type");

-- CreateIndex
CREATE INDEX "ShelterCase_priority_idx" ON "ShelterCase"("priority");

-- CreateIndex
CREATE INDEX "ShelterCase_personId_idx" ON "ShelterCase"("personId");

-- CreateIndex
CREATE INDEX "ShelterCase_petId_idx" ON "ShelterCase"("petId");

-- CreateIndex
CREATE INDEX "ShelterCase_assignedStaffId_idx" ON "ShelterCase"("assignedStaffId");

-- CreateIndex
CREATE INDEX "ShelterCase_nextFollowUpAt_idx" ON "ShelterCase"("nextFollowUpAt");

-- CreateIndex
CREATE INDEX "ShelterCase_createdAt_idx" ON "ShelterCase"("createdAt");

-- CreateIndex
CREATE INDEX "CaseInteraction_caseId_idx" ON "CaseInteraction"("caseId");

-- CreateIndex
CREATE INDEX "CaseInteraction_loggedAt_idx" ON "CaseInteraction"("loggedAt");

-- CreateIndex
CREATE INDEX "CaseInteraction_loggedByStaffId_idx" ON "CaseInteraction"("loggedByStaffId");

-- CreateIndex
CREATE INDEX "CaseInteraction_contactPersonId_idx" ON "CaseInteraction"("contactPersonId");

-- CreateIndex
CREATE INDEX "CaseNote_caseId_idx" ON "CaseNote"("caseId");

-- CreateIndex
CREATE INDEX "CaseNote_staffId_idx" ON "CaseNote"("staffId");

-- CreateIndex
CREATE INDEX "CaseNote_createdAt_idx" ON "CaseNote"("createdAt");

-- CreateIndex
CREATE INDEX "CaseEvent_caseId_idx" ON "CaseEvent"("caseId");

-- CreateIndex
CREATE INDEX "CaseEvent_type_idx" ON "CaseEvent"("type");

-- CreateIndex
CREATE INDEX "CaseEvent_createdAt_idx" ON "CaseEvent"("createdAt");

-- CreateIndex
CREATE INDEX "CaseEvent_actorId_idx" ON "CaseEvent"("actorId");

-- CreateIndex
CREATE UNIQUE INDEX "AdoptionApplication_caseId_key" ON "AdoptionApplication"("caseId");

-- CreateIndex
CREATE INDEX "AdoptionApplication_personId_idx" ON "AdoptionApplication"("personId");

-- CreateIndex
CREATE INDEX "AdoptionApplication_petId_idx" ON "AdoptionApplication"("petId");

-- CreateIndex
CREATE INDEX "AdoptionApplication_status_idx" ON "AdoptionApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualAdoption_caseId_key" ON "VirtualAdoption"("caseId");

-- CreateIndex
CREATE INDEX "VirtualAdoption_personId_idx" ON "VirtualAdoption"("personId");

-- CreateIndex
CREATE INDEX "VirtualAdoption_petId_idx" ON "VirtualAdoption"("petId");

-- CreateIndex
CREATE INDEX "VirtualAdoption_status_idx" ON "VirtualAdoption"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DonationInquiry_caseId_key" ON "DonationInquiry"("caseId");

-- CreateIndex
CREATE INDEX "DonationInquiry_personId_idx" ON "DonationInquiry"("personId");

-- CreateIndex
CREATE INDEX "DonationInquiry_status_idx" ON "DonationInquiry"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerApplication_caseId_key" ON "VolunteerApplication"("caseId");

-- CreateIndex
CREATE INDEX "VolunteerApplication_personId_idx" ON "VolunteerApplication"("personId");

-- CreateIndex
CREATE INDEX "VolunteerApplication_status_idx" ON "VolunteerApplication"("status");

-- CreateIndex
CREATE INDEX "VolunteerHours_personId_idx" ON "VolunteerHours"("personId");

-- CreateIndex
CREATE INDEX "VolunteerHours_volunteerApplicationId_idx" ON "VolunteerHours"("volunteerApplicationId");

-- CreateIndex
CREATE INDEX "VolunteerHours_caseId_idx" ON "VolunteerHours"("caseId");

-- CreateIndex
CREATE INDEX "VolunteerHours_date_idx" ON "VolunteerHours"("date");

-- CreateIndex
CREATE INDEX "ActivityEvent_type_idx" ON "ActivityEvent"("type");

-- CreateIndex
CREATE INDEX "ActivityEvent_createdAt_idx" ON "ActivityEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_petId_idx" ON "ActivityEvent"("petId");

-- CreateIndex
CREATE INDEX "ActivityEvent_caseId_idx" ON "ActivityEvent"("caseId");

-- CreateIndex
CREATE INDEX "ActivityEvent_personId_idx" ON "ActivityEvent"("personId");

-- CreateIndex
CREATE INDEX "ActivityEvent_actorId_idx" ON "ActivityEvent"("actorId");

-- CreateIndex
CREATE INDEX "PetStatusEvent_petId_idx" ON "PetStatusEvent"("petId");

-- CreateIndex
CREATE INDEX "PetStatusEvent_caseId_idx" ON "PetStatusEvent"("caseId");

-- CreateIndex
CREATE INDEX "PetStatusEvent_staffId_idx" ON "PetStatusEvent"("staffId");

-- CreateIndex
CREATE INDEX "PetStatusEvent_createdAt_idx" ON "PetStatusEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "StaffUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "StaffUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetImage" ADD CONSTRAINT "PetImage_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShelterCase" ADD CONSTRAINT "ShelterCase_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShelterCase" ADD CONSTRAINT "ShelterCase_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShelterCase" ADD CONSTRAINT "ShelterCase_relatedEventId_fkey" FOREIGN KEY ("relatedEventId") REFERENCES "ShelterEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShelterCase" ADD CONSTRAINT "ShelterCase_assignedStaffId_fkey" FOREIGN KEY ("assignedStaffId") REFERENCES "StaffUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseInteraction" ADD CONSTRAINT "CaseInteraction_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ShelterCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseInteraction" ADD CONSTRAINT "CaseInteraction_loggedByStaffId_fkey" FOREIGN KEY ("loggedByStaffId") REFERENCES "StaffUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseInteraction" ADD CONSTRAINT "CaseInteraction_contactPersonId_fkey" FOREIGN KEY ("contactPersonId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseNote" ADD CONSTRAINT "CaseNote_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ShelterCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseNote" ADD CONSTRAINT "CaseNote_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseEvent" ADD CONSTRAINT "CaseEvent_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ShelterCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseEvent" ADD CONSTRAINT "CaseEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "StaffUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdoptionApplication" ADD CONSTRAINT "AdoptionApplication_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ShelterCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdoptionApplication" ADD CONSTRAINT "AdoptionApplication_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdoptionApplication" ADD CONSTRAINT "AdoptionApplication_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualAdoption" ADD CONSTRAINT "VirtualAdoption_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ShelterCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualAdoption" ADD CONSTRAINT "VirtualAdoption_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualAdoption" ADD CONSTRAINT "VirtualAdoption_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationInquiry" ADD CONSTRAINT "DonationInquiry_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ShelterCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationInquiry" ADD CONSTRAINT "DonationInquiry_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerApplication" ADD CONSTRAINT "VolunteerApplication_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ShelterCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerApplication" ADD CONSTRAINT "VolunteerApplication_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerHours" ADD CONSTRAINT "VolunteerHours_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerHours" ADD CONSTRAINT "VolunteerHours_volunteerApplicationId_fkey" FOREIGN KEY ("volunteerApplicationId") REFERENCES "VolunteerApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerHours" ADD CONSTRAINT "VolunteerHours_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ShelterCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerHours" ADD CONSTRAINT "VolunteerHours_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ShelterCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "StaffUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetStatusEvent" ADD CONSTRAINT "PetStatusEvent_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetStatusEvent" ADD CONSTRAINT "PetStatusEvent_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ShelterCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetStatusEvent" ADD CONSTRAINT "PetStatusEvent_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
