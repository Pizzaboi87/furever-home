import type { PrismaAdminCaseDetailRow } from '../case-repository'

export type PrismaCaseDetailPerson = PrismaAdminCaseDetailRow['person']
export type PrismaCaseDetailPet = NonNullable<PrismaAdminCaseDetailRow['pet']>
export type PrismaCaseDetailInteraction = PrismaAdminCaseDetailRow['interactions'][number]
export type PrismaCaseDetailNote = PrismaAdminCaseDetailRow['notes'][number]
export type PrismaCaseDetailEvent = PrismaAdminCaseDetailRow['events'][number]
export type PrismaCaseDetailActivityEvent = PrismaAdminCaseDetailRow['activityEvents'][number]
export type PrismaCaseDetailImage = PrismaCaseDetailPet['images'][number]
