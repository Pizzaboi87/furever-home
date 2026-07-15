import {
  PRISMA_CASE_STATUS,
  type PrismaCaseStatusValue,
} from '@/lib/admin/case-write/case-write-support'

const CLOSED_CASE_STATUSES = new Set<PrismaCaseStatusValue>([
  PRISMA_CASE_STATUS.COMPLETED,
  PRISMA_CASE_STATUS.CLOSED,
  PRISMA_CASE_STATUS.DECLINED,
  PRISMA_CASE_STATUS.CANCELLED,
  PRISMA_CASE_STATUS.REJECTED,
  PRISMA_CASE_STATUS.NO_RESPONSE,
])

export const isClosedPrismaCaseStatus = (status: PrismaCaseStatusValue) => {
  return CLOSED_CASE_STATUSES.has(status)
}

export const assertCaseStatusTransition = ({
  currentStatus,
  nextStatus,
  outcome,
}: {
  currentStatus: PrismaCaseStatusValue
  nextStatus: PrismaCaseStatusValue
  outcome: string | null | undefined
}) => {
  if (currentStatus !== nextStatus && isClosedPrismaCaseStatus(currentStatus)) {
    throw new Error('A closed case cannot be reopened through general case management.')
  }

  if (isClosedPrismaCaseStatus(nextStatus) && !outcome?.trim()) {
    throw new Error('An outcome is required before a case can be closed.')
  }
}

export const assertCaseAllowsStructuredRecordUpdate = (
  status: PrismaCaseStatusValue,
) => {
  if (isClosedPrismaCaseStatus(status)) {
    throw new Error(
      'Structured application details cannot be changed after the case is closed.',
    )
  }
}
