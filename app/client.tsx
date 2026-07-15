'use client'

import { useState, useMemo } from 'react'
import Image from '@/components/ui/LoadingImage'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import PetCard from '@/components/pets/PetCard'
import MotionReveal from '@/components/ui/MotionReveal'
import Link from 'next/link'
import type { AdminPet } from '@/lib/admin/domain'
import { formatLabel, normalizeValue } from '@/lib/pet-format'

type HomeClientProps = {
  pets: AdminPet[]
}

export default function HomeClient({ pets }: HomeClientProps) {
  const categories = useMemo(() => {
    return [...new Set(pets.map((pet) => normalizeValue(pet.species)))]
  }, [pets])

  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] ?? 'dog')

  const filteredPets = useMemo(() => {
    return pets
      .filter((pet) => normalizeValue(pet.species) === selectedCategory)
      .slice(0, 4)
  }, [pets, selectedCategory])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/items/hero.png"
              alt="Happy pets looking for adoption"
              fill
              sizes="100vw"
              priority
              className="object-cover object-center"
              style={{ objectPosition: 'center 42%' }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/45 to-black/20" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-background" />
          </div>
          <div className="relative mx-auto flex min-h-130 max-w-screen-2xl items-center px-4 py-16 sm:px-6 lg:px-8 md:min-h-155 md:py-24">
            <div className="max-w-2xl text-left text-white">
              <p className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-sm font-medium tracking-wide text-white/90 backdrop-blur-sm">
                Adoption starts here
              </p>
              <h1 className="text-4xl font-bold text-balance md:text-5xl lg:text-6xl">
                Find Your Furever Friend
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/85 text-balance md:text-xl">
                Discover adorable pets waiting for a loving home. Whether you&apos;re looking to adopt or just want to virtually support an animal, we&apos;re here to help you connect with your perfect match.
              </p>
              <Link
                href="/browse"
                className="mt-8 inline-flex rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-8 py-3 font-semibold text-primary-foreground transition-all ease-in-out duration-300 hover:scale-105 hover:brightness-105"
              >
                Start Browsing
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Pets Section */}
        <section className="relative overflow-hidden py-10 md:py-24">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at top left, rgba(225, 228, 253, 0.9) 0%, rgba(225, 228, 253, 0.35) 18%, rgba(225, 228, 253, 0) 48%), radial-gradient(circle at bottom right, rgba(225, 228, 253, 0.9) 0%, rgba(225, 228, 253, 0.35) 18%, rgba(225, 228, 253, 0) 48%)',
            }}
          />
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-8">
            <div className="relative overflow-visible rounded-3xl border border-border bg-white/90 p-4 shadow-sm sm:p-6 md:p-8">
              <div className="relative">
                <div className="mb-8 md:mb-12">
                  <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                    Featured Pets
                  </h2>
                  <p className="text-muted-foreground">
                    Get to know some of our amazing animals
                  </p>
                </div>

                {/* Category Filter */}
                <div className="mb-8 grid grid-cols-3 gap-3 md:mb-10 md:flex md:flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`flex min-h-24 flex-col items-center justify-center rounded-2xl px-2 py-3 text-base font-semibold transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer md:min-w-32 md:rounded-lg md:px-6 md:py-2 md:pt-3 md:text-lg
                        ${selectedCategory === category
                          ? 'bg-linear-to-r from-[#5f57e7] to-primary text-primary-foreground'
                          : 'border border-border bg-white text-foreground hover:border-primary'
                        }`}
                    >
                      <Image
                        alt={category}
                        src={`/images/assets/${category.toLowerCase()}.png`}
                        width={32}
                        height={32}
                        className={selectedCategory === category ? "pointer-events-none size-9 invert md:size-8" : "pointer-events-none size-9 md:size-8"}
                      />
                      <span className="mt-1 leading-tight">{formatLabel(category)}</span>
                    </button>
                  ))}
                </div>

                {/* Pet Grid */}
                <div className="mb-10 grid grid-cols-1 gap-4 md:mb-12 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredPets.map((pet, index) => (
                    <PetCard
                      key={pet.id}
                      pet={pet}
                      delay={index * 0.12}
                      eager={index < 4}
                    />
                  ))}
                </div>

                {/* CTA Section */}
                <MotionReveal className="bg-white rounded-lg shadow-sm border border-border p-8 md:p-12 text-center relative" delay={0.16}>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Want to Meet More?
                  </h3>
                  <p className="text-foreground mb-8 max-w-md mx-auto">
                    Browse our complete catalog with advanced filtering options to find the perfect pet for your lifestyle.
                  </p>
                  <Link
                    href="/browse"
                    className="w-fit mx-auto bg-linear-to-r from-[#5f57e7] to-primary text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 hover:brightness-105 transition-all ease-in-out duration-300 transform flex items-center justify-center gap-2"
                  >
                    <Image
                      src="/images/assets/paw.png"
                      width={24}
                      height={24}
                      alt="pet"
                    />
                    <p>Browse All Pets</p>
                  </Link>
                  <Image
                    src="/images/assets/cat-shadow.png"
                    width={256}
                    height={256}
                    alt="paws"
                    className='pointer-events-none absolute z-0 right-0 -bottom-33 h-[105%] w-auto hidden lg:block -translate-x-6'
                  />
                </MotionReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-ring py-16 md:py-24 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <MotionReveal className="text-center bg-white p-6 rounded-xl shadow-sm shadow-muted-foreground hover:scale-105 ease-in-out duration-300 transition-all cursor-default">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Find Your Match</h3>
                <p className="text-muted-foreground">
                  Browse our catalog of dogs, cats, hamsters, rabbits, and birds. Each pet is waiting for a loving home.
                </p>
              </MotionReveal>
              <MotionReveal className="text-center bg-white p-6 rounded-xl shadow-sm shadow-muted-foreground hover:scale-105 ease-in-out duration-300 transition-all cursor-default" delay={0.12}>
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Easy Application</h3>
                <p className="text-muted-foreground">
                  Simple adoption process. Fill out an application and let us help match you with your perfect companion.
                </p>
              </MotionReveal>
              <MotionReveal className="text-center bg-white p-6 rounded-xl shadow-sm shadow-muted-foreground hover:scale-105 ease-in-out duration-300 transition-all cursor-default" delay={0.24}>
                <div className="text-5xl mb-4">💝</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Virtual Adoption</h3>
                <p className="text-muted-foreground">
                  Can&apos;t adopt? Virtually adopt and support our animals with updates and photos of your pet!
                </p>
              </MotionReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
