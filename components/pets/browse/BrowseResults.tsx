import PetCard from '@/components/pets/PetCard'
import MotionReveal from '@/components/ui/MotionReveal'
import type { AdminPet } from '@/lib/admin/domain'

type BrowseResultsProps = {
  pets: AdminPet[]
}

const BrowseResults = ({ pets }: BrowseResultsProps) => {
  return (
    <div className="lg:col-span-3">
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{pets.length}</span>{' '}
          {pets.length === 1 ? 'pet' : 'pets'}
        </p>
      </div>

      {pets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet, index) => (
            <PetCard
              key={pet.id}
              pet={pet}
              delay={(index % 3) * 0.12}
              viewportMargin="0px 0px 420px 0px"
              eager={index < 3}
            />
          ))}
        </div>
      ) : (
        <MotionReveal className="rounded-lg border border-border bg-white p-12 text-center shadow-sm">
          <div className="mb-4 text-5xl">🔍</div>
          <h3 className="mb-2 text-xl font-bold text-foreground">No Pets Found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
        </MotionReveal>
      )}
    </div>
  )
}

export default BrowseResults
