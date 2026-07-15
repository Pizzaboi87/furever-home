import type { CreateIncomingCaseInput } from '@/lib/admin/case-create/case-preview-service'
import { executeAdminQuery } from '@/lib/graphql/admin-queries'

export type CaseWriteRevalidationTarget = {
  caseId: string
  personId: string | null
  petId: string | null
}

type CreateCaseGraphQLResult = {
  case: {
    id: string
    petId: string | null
  }
  person: {
    id: string
  }
}

type CreateCaseMutationResult = {
  createCase: {
    case: {
      id: string
      petId: string | null
    }
    applicant: {
      id: string
    }
  }
}

type CaseDetailMutationResult<TKey extends string> = Record<
  TKey,
  {
    case: {
      id: string
      personId: string | null
      petId: string | null
    }
  }
>

const CASE_REVALIDATION_FIELDS = /* GraphQL */ `
  case {
    id
    personId
    petId
  }
`

const readCaseRevalidationTarget = <TKey extends string>(
  data: CaseDetailMutationResult<TKey>,
  key: TKey,
): CaseWriteRevalidationTarget => {
  const shelterCase = data[key].case

  return {
    caseId: shelterCase.id,
    personId: shelterCase.personId,
    petId: shelterCase.petId,
  }
}

const runCaseDetailMutation = async <TKey extends string>({
  key,
  source,
  input,
}: {
  key: TKey
  source: string
  input: Record<string, unknown>
}): Promise<CaseWriteRevalidationTarget> => {
  const data = await executeAdminQuery<CaseDetailMutationResult<TKey>>(source, {
    input,
  })

  return readCaseRevalidationTarget(data, key)
}

export const createCaseWithGraphQL = async (
  input: CreateIncomingCaseInput,
): Promise<CreateCaseGraphQLResult> => {
  const data = await executeAdminQuery<CreateCaseMutationResult>(
    /* GraphQL */ `
      mutation CreateCase($input: CreateCaseInput!) {
        createCase(input: $input) {
          case {
            id
            petId
          }
          applicant {
            id
          }
        }
      }
    `,
    { input },
  )

  return {
    case: {
      id: data.createCase.case.id,
      petId: data.createCase.case.petId,
    },
    person: {
      id: data.createCase.applicant.id,
    },
  }
}

export const addCaseNoteWithGraphQL = (input: {
  caseId: string
  body: string
}) => {
  return runCaseDetailMutation({
    key: 'addCaseNote',
    source: /* GraphQL */ `
      mutation AddCaseNote($input: AddCaseNoteInput!) {
        addCaseNote(input: $input) {
          ${CASE_REVALIDATION_FIELDS}
        }
      }
    `,
    input,
  })
}

export const logCaseInteractionWithGraphQL = (input: {
  caseId: string
  channel: string
  direction: string
  summary: string
  actionTaken?: string | null
  nextStep?: string | null
}) => {
  return runCaseDetailMutation({
    key: 'logCaseInteraction',
    source: /* GraphQL */ `
      mutation LogCaseInteraction($input: LogCaseInteractionInput!) {
        logCaseInteraction(input: $input) {
          ${CASE_REVALIDATION_FIELDS}
        }
      }
    `,
    input,
  })
}

export const updateCaseStatusWithGraphQL = (input: {
  caseId: string
  status: string
  currentStatus?: string | null
  outcome?: string | null
}) => {
  return runCaseDetailMutation({
    key: 'updateCaseStatus',
    source: /* GraphQL */ `
      mutation UpdateCaseStatus($input: UpdateCaseStatusInput!) {
        updateCaseStatus(input: $input) {
          ${CASE_REVALIDATION_FIELDS}
        }
      }
    `,
    input,
  })
}

export const updateCaseManagementWithGraphQL = (input: {
  caseId: string
  assignedStaffId?: string | null
  priority?: string | null
  status?: string | null
  outcome?: string | null
  nextFollowUpAt?: string | null
  nextFollowUpNote?: string | null
}) => {
  return runCaseDetailMutation({
    key: 'updateCaseManagement',
    source: /* GraphQL */ `
      mutation UpdateCaseManagement($input: UpdateCaseManagementInput!) {
        updateCaseManagement(input: $input) {
          ${CASE_REVALIDATION_FIELDS}
        }
      }
    `,
    input,
  })
}

export const updateDonationInquiryWithGraphQL = (input: {
  caseId: string
  donationId?: string | null
  inquiryType?: string | null
  status?: string | null
  amount?: string | null
  currency?: string | null
  frequency?: string | null
  receiptRequested?: boolean | null
  thankYouSent?: boolean | null
}) => {
  return runCaseDetailMutation({
    key: 'updateDonationInquiry',
    source: /* GraphQL */ `
      mutation UpdateDonationInquiry($input: UpdateDonationInquiryInput!) {
        updateDonationInquiry(input: $input) {
          ${CASE_REVALIDATION_FIELDS}
        }
      }
    `,
    input,
  })
}

export const updateVirtualAdoptionWithGraphQL = (input: {
  caseId: string
  status?: string | null
  amount?: string | null
  currency?: string | null
  frequency?: string | null
  sponsorUpdateRequested?: boolean | null
  certificateSent?: boolean | null
}) => {
  return runCaseDetailMutation({
    key: 'updateVirtualAdoption',
    source: /* GraphQL */ `
      mutation UpdateVirtualAdoption($input: UpdateVirtualAdoptionInput!) {
        updateVirtualAdoption(input: $input) {
          ${CASE_REVALIDATION_FIELDS}
        }
      }
    `,
    input,
  })
}

export const updateVolunteerApplicationWithGraphQL = (input: {
  caseId: string
  status?: string | null
  interestAreas?: string[] | null
  availability?: string | null
  experience?: string | null
  backgroundCheckStatus?: string | null
  orientationScheduledAt?: string | null
  orientationCompleted?: boolean | null
  assignedRole?: string | null
  volunteerHoursDate?: string | null
  volunteerHours?: string | null
  volunteerHoursActivity?: string | null
}) => {
  return runCaseDetailMutation({
    key: 'updateVolunteerApplication',
    source: /* GraphQL */ `
      mutation UpdateVolunteerApplication($input: UpdateVolunteerApplicationInput!) {
        updateVolunteerApplication(input: $input) {
          ${CASE_REVALIDATION_FIELDS}
        }
      }
    `,
    input,
  })
}

export const updateAdoptionApplicationWithGraphQL = (input: {
  caseId: string
  status?: string | null
  score?: string | null
  householdType?: string | null
  hasOtherPets?: boolean | null
  hasChildren?: boolean | null
  housingType?: string | null
  landlordApproval?: string | null
  experienceLevel?: string | null
  screeningNote?: string | null
}) => {
  return runCaseDetailMutation({
    key: 'updateAdoptionApplication',
    source: /* GraphQL */ `
      mutation UpdateAdoptionApplication($input: UpdateAdoptionApplicationInput!) {
        updateAdoptionApplication(input: $input) {
          ${CASE_REVALIDATION_FIELDS}
        }
      }
    `,
    input,
  })
}

export const runAdoptionWorkflowWithGraphQL = (input: {
  caseId: string
  action: string
  petId?: string | null
  note?: string | null
}) => {
  return runCaseDetailMutation({
    key: 'runAdoptionWorkflow',
    source: /* GraphQL */ `
      mutation RunAdoptionWorkflow($input: RunAdoptionWorkflowInput!) {
        runAdoptionWorkflow(input: $input) {
          ${CASE_REVALIDATION_FIELDS}
        }
      }
    `,
    input,
  })
}
