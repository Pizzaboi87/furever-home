import { createCase } from '@/lib/admin/case-create-service'
import {
  addCaseNote,
  logCaseInteraction,
  runAdoptionWorkflow,
  updateAdoptionApplication,
  updateCaseManagement,
  updateCaseStatus,
  updateDonationInquiry,
  updateVirtualAdoption,
  updateVolunteerApplication,
} from '@/lib/admin/case-write-service'
import type {
  AddCaseNoteMutationArgs,
  CreateCaseMutationArgs,
  GraphQLAdminCaseDetail,
  GraphQLContext,
  LogCaseInteractionMutationArgs,
  RunAdoptionWorkflowMutationArgs,
  UpdateAdoptionApplicationMutationArgs,
  UpdateCaseManagementMutationArgs,
  UpdateCaseStatusMutationArgs,
  UpdateDonationInquiryMutationArgs,
  UpdateVirtualAdoptionMutationArgs,
  UpdateVolunteerApplicationMutationArgs,
} from '@/lib/graphql/schema/admin-schema-types'
import {
  getUpdatedAdminCaseDetail,
  requireGraphQLStaff,
  requireWriteResult,
} from '@/lib/graphql/schema/resolvers/admin-resolver-support'

export const caseMutationResolvers = {
  createCase: async (
    _parent: unknown,
    args: CreateCaseMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCaseDetail> => {
    const currentStaff = await requireGraphQLStaff(context)
    const created = await createCase(args.input, currentStaff)

    return getUpdatedAdminCaseDetail(created.case.id)
  },
  addCaseNote: async (
    _parent: unknown,
    args: AddCaseNoteMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCaseDetail> => {
    const currentStaff = await requireGraphQLStaff(context)
    const result = requireWriteResult(await addCaseNote(args.input, currentStaff))

    return getUpdatedAdminCaseDetail(result.caseId)
  },
  logCaseInteraction: async (
    _parent: unknown,
    args: LogCaseInteractionMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCaseDetail> => {
    const currentStaff = await requireGraphQLStaff(context)
    const result = requireWriteResult(
      await logCaseInteraction(args.input, currentStaff),
    )

    return getUpdatedAdminCaseDetail(result.caseId)
  },
  updateCaseStatus: async (
    _parent: unknown,
    args: UpdateCaseStatusMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCaseDetail> => {
    const currentStaff = await requireGraphQLStaff(context)
    const result = requireWriteResult(
      await updateCaseStatus(args.input, currentStaff),
    )

    return getUpdatedAdminCaseDetail(result.caseId)
  },
  updateCaseManagement: async (
    _parent: unknown,
    args: UpdateCaseManagementMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCaseDetail> => {
    const currentStaff = await requireGraphQLStaff(context)
    const result = requireWriteResult(
      await updateCaseManagement(args.input, currentStaff),
    )

    return getUpdatedAdminCaseDetail(result.caseId)
  },
  updateDonationInquiry: async (
    _parent: unknown,
    args: UpdateDonationInquiryMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCaseDetail> => {
    const currentStaff = await requireGraphQLStaff(context)
    const result = requireWriteResult(
      await updateDonationInquiry(args.input, currentStaff),
    )

    return getUpdatedAdminCaseDetail(result.caseId)
  },
  updateVirtualAdoption: async (
    _parent: unknown,
    args: UpdateVirtualAdoptionMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCaseDetail> => {
    const currentStaff = await requireGraphQLStaff(context)
    const result = requireWriteResult(
      await updateVirtualAdoption(args.input, currentStaff),
    )

    return getUpdatedAdminCaseDetail(result.caseId)
  },
  updateVolunteerApplication: async (
    _parent: unknown,
    args: UpdateVolunteerApplicationMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCaseDetail> => {
    const currentStaff = await requireGraphQLStaff(context)
    const result = requireWriteResult(
      await updateVolunteerApplication(args.input, currentStaff),
    )

    return getUpdatedAdminCaseDetail(result.caseId)
  },
  updateAdoptionApplication: async (
    _parent: unknown,
    args: UpdateAdoptionApplicationMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCaseDetail> => {
    const currentStaff = await requireGraphQLStaff(context)
    const result = requireWriteResult(
      await updateAdoptionApplication(args.input, currentStaff),
    )

    return getUpdatedAdminCaseDetail(result.caseId)
  },
  runAdoptionWorkflow: async (
    _parent: unknown,
    args: RunAdoptionWorkflowMutationArgs,
    context: GraphQLContext,
  ): Promise<GraphQLAdminCaseDetail> => {
    const currentStaff = await requireGraphQLStaff(context)
    const result = requireWriteResult(
      await runAdoptionWorkflow(args.input, currentStaff),
    )

    return getUpdatedAdminCaseDetail(result.caseId)
  },
}
