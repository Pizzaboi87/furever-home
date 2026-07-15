import Image from '@/components/ui/LoadingImage'
import Link from 'next/link'
import { ExternalLink, PawPrint } from 'lucide-react'
import type { AdminCaseDetail } from '@/lib/admin/domain'
import SectionCard from '@/components/admin/common/SectionCard'
import { formatLabel } from '@/lib/pet-format'
import { CaseDetailCardHeader } from '@/components/admin/cases/CaseDetailCards'

type CaseRelatedPetCardProps = {
  relatedPet: AdminCaseDetail['relatedPet']
}

const CaseRelatedPetCard = ({ relatedPet }: CaseRelatedPetCardProps) => {
  return (
    <SectionCard delay={0.2}>
      <CaseDetailCardHeader
        title="Related pet"
        description="Animal linked to this case."
        icon={PawPrint}
      />

      {relatedPet ? (
        <div className="rounded-xl border border-border bg-input p-3">
          <div className="flex gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
              <Image
                src={relatedPet.image}
                alt={relatedPet.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="font-bold text-foreground">{relatedPet.name}</p>
              <p className="text-sm text-muted-foreground">
                {relatedPet.id} · {formatLabel(relatedPet.species)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatLabel(relatedPet.status)} · {relatedPet.age} years
              </p>
            </div>
          </div>

          <Link
            href={`/admin/pets/${relatedPet.id}`}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-indigo-50"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Open pet detail
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-input p-4 text-sm text-muted-foreground">
          This case is not linked to a specific animal.
        </div>
      )}
    </SectionCard>
  )
}

export default CaseRelatedPetCard
