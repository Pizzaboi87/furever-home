import { getPrismaClient } from '@/lib/server/prisma'

export const getPrismaCaseContext = async (caseId: string) => {
  return getPrismaClient().shelterCase.findUnique({
    where: { id: caseId },
    include: {
      person: true,
      pet: true,
      adoptionApplication: true,
      donationInquiry: true,
      virtualAdoption: true,
      volunteerApplication: true,
    },
  })
}

export const resolveActiveStaffId = async (staffId: string | null | undefined) => {
  const normalizedStaffId = staffId?.trim()

  if (!normalizedStaffId) {
    return null
  }

  const staff = await getPrismaClient().staffUser.findFirst({
    where: {
      id: normalizedStaffId,
      active: true,
    },
    select: {
      id: true,
    },
  })

  return staff?.id ?? null
}
