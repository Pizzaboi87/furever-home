import 'dotenv/config'

import path from 'node:path'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { getDirectDatabaseEnv } from '../lib/server/env'
import { readJsonFile } from './seed/seed-file-utils'
import {
  parseAdminDashboardFile,
  parsePetsFile,
  validateSeedInvariants,
} from './seed/seed-validation'
import { seedPeople, seedStaffUsers } from './seed/staff-people-seed'
import { configureSeedCloudinary } from './seed/pet-image-seed'
import {
  buildHistoricalPets,
  getCurrentPetIntakeDateByPetId,
  getPetIdSet,
  seedCurrentPets,
  seedHistoricalPets,
} from './seed/pet-seed'
import { seedDashboardAnalytics } from './seed/dashboard-analytics-seed'
import {
  seedCaseEvents,
  seedCaseInteractions,
  seedCaseNotes,
  seedShelterCases,
  seedShelterEvents,
} from './seed/case-core-seed'
import {
  seedAdoptionApplications,
  seedDonationInquiries,
  seedVirtualAdoptions,
  seedVolunteerApplications,
} from './seed/application-seed'
import { seedActivityEvents } from './seed/activity-seed'
import type { RawPerson, RawStaff } from './seed/seed-types'

const databaseUrl = getDirectDatabaseEnv().DIRECT_DATABASE_URL

const getDatabaseUrlWithoutSslMode = (value: string) => {
  const url = new URL(value)
  url.searchParams.delete('sslmode')
  return url.toString()
}

const adapter = new PrismaPg({
  connectionString: getDatabaseUrlWithoutSslMode(databaseUrl),
  ssl: {
    rejectUnauthorized: false,
  },
})

const prisma = new PrismaClient({ adapter })
const projectRoot = process.cwd()
const seedDataRoot = path.join(projectRoot, 'prisma', 'seed-data')
const petsPath = path.join(seedDataRoot, 'pets.json')
const shelterDataPath = path.join(seedDataRoot, 'shelter-data.json')

const staffIdSet = (staff: RawStaff[]) =>
  new Set(staff.map((member) => member.id))

const personIdSet = (people: RawPerson[]) =>
  new Set(people.map((person) => person.id))

const main = async () => {
  const petsFile = parsePetsFile(readJsonFile(petsPath))
  const adminDashboardFile = parseAdminDashboardFile(
    readJsonFile(shelterDataPath),
  )

  validateSeedInvariants(petsFile, adminDashboardFile)
  const shouldUploadToCloudinary = configureSeedCloudinary()

  if (shouldUploadToCloudinary) {
    console.log(
      'Cloudinary config found. Existing Cloudinary pet images will be reused; missing images will be uploaded.',
    )
  } else {
    console.log(
      'Cloudinary config missing. PetImage rows will use existing local image paths as fallback URLs.',
    )
  }

  const staff = adminDashboardFile.staff ?? []
  const people = adminDashboardFile.people ?? []
  const shelterEvents = adminDashboardFile.shelterEvents ?? []
  const cases = adminDashboardFile.cases ?? []
  const caseInteractions = adminDashboardFile.caseInteractions ?? []
  const caseNotes = adminDashboardFile.caseNotes ?? []
  const caseEvents = adminDashboardFile.caseEvents ?? []
  const activityEvents = adminDashboardFile.activityEvents ?? []
  const adoptionApplications = adminDashboardFile.adoptionApplications ?? []
  const virtualAdoptions = adminDashboardFile.virtualAdoptions ?? []
  const donationInquiries = adminDashboardFile.donationInquiries ?? []
  const volunteerApplications = adminDashboardFile.volunteerApplications ?? []

  const historicalPets = buildHistoricalPets(adminDashboardFile, petsFile.pets)
  const allSeededPets = [...historicalPets, ...petsFile.pets]

  const validStaffIds = staffIdSet(staff)
  const validPersonIds = personIdSet(people)
  const validPetIds = getPetIdSet(allSeededPets)
  const currentPetIds = getPetIdSet(petsFile.pets)
  const currentPetIntakeDateByPetId = getCurrentPetIntakeDateByPetId(
    adminDashboardFile.animalIntakes ?? [],
    currentPetIds,
  )
  const validCaseIds = new Set(cases.map((shelterCase) => shelterCase.id))

  await seedDashboardAnalytics(prisma, adminDashboardFile)

  console.log(`Seeding ${staff.length} staff users...`)
  await seedStaffUsers(prisma, staff)

  console.log(`Seeding ${people.length} people...`)
  await seedPeople(prisma, people)

  console.log(
    `Seeding ${historicalPets.length} historical pets without images...`,
  )
  await seedHistoricalPets(prisma, historicalPets)

  console.log(
    `Seeding ${petsFile.pets.length} current pets and primary images...`,
  )
  await seedCurrentPets(
    prisma,
    petsFile.pets,
    shouldUploadToCloudinary,
    currentPetIntakeDateByPetId,
  )

  console.log(`Seeding ${shelterEvents.length} shelter events...`)
  await seedShelterEvents(prisma, shelterEvents)

  console.log(`Seeding ${cases.length} shelter cases...`)
  await seedShelterCases(prisma, cases, validPetIds, currentPetIds)

  console.log(`Seeding ${caseInteractions.length} case interactions...`)
  await seedCaseInteractions(
    prisma,
    caseInteractions,
    validStaffIds,
    validPersonIds,
  )

  console.log(`Seeding ${caseNotes.length} case notes...`)
  await seedCaseNotes(prisma, caseNotes, validStaffIds)

  console.log(`Seeding ${caseEvents.length} case events...`)
  await seedCaseEvents(prisma, caseEvents, validStaffIds, people, staff)

  console.log(
    `Seeding ${adoptionApplications.length} adoption applications...`,
  )
  await seedAdoptionApplications(prisma, adoptionApplications)

  console.log(`Seeding ${virtualAdoptions.length} virtual adoptions...`)
  await seedVirtualAdoptions(prisma, virtualAdoptions)

  console.log(`Seeding ${donationInquiries.length} donation inquiries...`)
  await seedDonationInquiries(prisma, donationInquiries)

  console.log(
    `Seeding ${volunteerApplications.length} volunteer applications...`,
  )
  await seedVolunteerApplications(prisma, volunteerApplications)

  console.log(`Seeding ${activityEvents.length} activity events...`)
  await seedActivityEvents(
    prisma,
    activityEvents,
    validPetIds,
    validCaseIds,
    validPersonIds,
    validStaffIds,
  )

  console.log(
    `Seed complete: ${staff.length} staff users, ${people.length} people, ${allSeededPets.length} pets (${historicalPets.length} historical, ${petsFile.pets.length} current), ${cases.length} cases, ${caseInteractions.length} interactions, ${caseNotes.length} notes, ${caseEvents.length} case events, ${activityEvents.length} activity events.`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
