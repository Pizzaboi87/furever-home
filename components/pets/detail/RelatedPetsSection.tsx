import PetCard from '@/components/pets/PetCard'
import type { AdminPet } from '@/lib/admin/domain'

type RelatedPetsSectionProps = {
  pets: AdminPet[]
}

export default function RelatedPetsSection({ pets }: RelatedPetsSectionProps) {
  if (pets.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold text-foreground">Similar Pets</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet, index) => (
          <PetCard key={pet.id} pet={pet} delay={index * 0.12} />
        ))}
      </div>
    </section>
  )
}
