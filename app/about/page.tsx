import type { Metadata } from 'next'
import Image from '@/components/ui/LoadingImage'
import Link from 'next/link'

import Footer from '@/components/layout/Footer'
import MotionReveal from '@/components/ui/MotionReveal'
import Navigation from '@/components/layout/Navigation'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'About Our Pet Adoption Mission',
  description:
    'Learn how Furever Home connects shelter animals with responsible adopters, supports second chances, and makes pet adoption more thoughtful, transparent, and personal.',
  path: '/about',
})

const About = () => {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background py-8 md:py-16">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-8">
          <MotionReveal className="rounded-lg border border-border bg-white p-5 shadow-sm md:p-12">
            <h1 className="mb-6 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              About Furever Home
            </h1>

            <div className="space-y-9 text-muted-foreground md:space-y-12">
              <section className="flow-root">
                <MotionReveal className="mb-6 md:mb-8">
                  <Image
                    src="/images/items/about-1.png"
                    alt="Furever Home adoption meeting with a family and volunteer"
                    width={1536}
                    height={864}
                    priority
                    className="w-full h-auto rounded-xl shadow-sm border border-border"
                  />
                </MotionReveal>

                <p className="text-lg mb-4">
                  Welcome to Furever Home, a warm and friendly adoption platform created to help loving families and wonderful animals find each other. Our goal is to make the adoption journey feel simple, personal, and meaningful from the very first moment. Whether someone is searching for a playful dog, a calm senior cat, a gentle rabbit, a cheerful bird, or a small companion like a hamster, Furever Home is designed to make the process easier, clearer, and more human.
                </p>

                <p>
                  We know that adopting a pet is not just a quick decision. It is the beginning of a long-term relationship built on trust, care, patience, and love. That is why Furever Home focuses not only on showing available animals, but also on helping future adopters understand their personalities, needs, habits, and stories. Every animal deserves to be seen as an individual, not just as a profile picture or a short description.
                </p>
              </section>

              <section className="flow-root">
                <MotionReveal className="mb-5 w-full lg:float-left lg:mr-8 lg:mb-4 lg:w-130 xl:w-155 2xl:w-175">
                  <Image
                    src="/images/items/about-2.png"
                    alt="Furever Home volunteers playing with a cat in an adoption room"
                    width={1536}
                    height={864}
                    className="w-full h-auto rounded-xl shadow-sm border border-border"
                  />
                </MotionReveal>

                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Our Mission
                </h2>

                <p className="mb-4">
                  At Furever Home, we believe that every animal deserves safety, kindness, and a place where they can truly belong. Our mission is to support responsible pet adoption by creating a platform where shelters, rescue organizations, volunteers, and future pet owners can connect in a thoughtful and accessible way.
                </p>

                <p className="mb-4">
                  We want to make adoption feel less overwhelming and more approachable. Many people would love to adopt, but they do not always know where to start, what kind of pet would fit their lifestyle, or how to understand the needs of different animals. Furever Home helps bridge that gap by presenting useful information in a clear and friendly way.
                </p>

                <p>
                  Our mission is also to remind people that adoption is not only about bringing an animal home. It is about giving them a second chance. Some pets may have been abandoned, some may have come from difficult circumstances, and others may simply be waiting in shelters because their previous families could no longer care for them. Whatever their story is, they all deserve patience, dignity, and the possibility of a happier future.
                </p>
              </section>

              <section>
                <MotionReveal className="mb-5 md:hidden">
                  <Image
                    src="/images/items/about-3.png"
                    alt="Furever Home adoption platform helping people browse adoptable animals"
                    width={1536}
                    height={864}
                    className="h-auto w-full rounded-xl border border-border shadow-sm"
                  />
                </MotionReveal>

                <h2 className="mb-3 text-2xl font-bold text-foreground">
                  What We Do
                </h2>

                <p className="mb-4">
                  Furever Home provides a comprehensive adoption platform featuring dogs, cats, hamsters, rabbits, and birds from shelters and rescue organizations. Each pet profile is designed to give potential adopters a better understanding of the animal&apos;s personality, background, energy level, and daily needs. This helps families make more informed decisions and increases the chance of a successful, lasting adoption.
                </p>

                <p className="mb-4">
                  Our advanced filtering system makes it easier to find a pet that matches your lifestyle and preferences. You can browse animals based on species, size, age, temperament, activity level, and other important details. For example, some people may be looking for an active dog who enjoys long walks and outdoor adventures, while others may prefer a quiet cat who loves peaceful afternoons and cozy spaces. Some families need a pet that is comfortable around children, while others may already have animals at home and need a good match for a multi-pet household.
                </p>

                <p>
                  Beyond simple browsing, Furever Home aims to create a more caring adoption experience. We want users to slow down, read each animal&apos;s story, and think about what kind of companion would truly fit their home and daily routine. The best adoption is not always about choosing the cutest pet. It is about finding the right connection between an animal&apos;s needs and a person&apos;s ability to care for them.
                </p>
              </section>

              <section className="grid grid-cols-1 items-center gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(520px,700px)] xl:gap-12">
                <div>
                  <MotionReveal className="mb-5 md:hidden">
                    <Image
                      src="/images/items/about-4.png"
                      alt="Furever Home virtual adoption support for shelter animals"
                      width={1536}
                      height={864}
                      className="h-auto w-full rounded-xl border border-border shadow-sm"
                    />
                  </MotionReveal>

                  <h2 className="mb-3 text-2xl font-bold text-foreground">
                    Virtual Adoption Program
                  </h2>

                  <p className="mb-4">
                    Not everyone is able to adopt a pet right now, and that is completely understandable. Some people may live in a small apartment, travel often, already have pets at home, or simply may not be ready for the full responsibility of adoption. That is why Furever Home also offers a virtual adoption program for people who still want to make a positive difference.
                  </p>

                  <p className="mb-4">
                    Through virtual adoption, supporters can help an animal by contributing to their care while they wait for a permanent home. This support may help cover food, basic supplies, veterinary care, toys, bedding, or other everyday needs. In return, virtual adopters can receive regular updates, new photos, and information about the animal&apos;s progress, personality, and well-being.
                  </p>

                  <p className="mb-4">
                    Virtual adoption is a meaningful way to build a connection with an animal even from a distance. It gives people the chance to follow a pet&apos;s journey, celebrate small milestones, and support shelters in a practical way. For the animals, it means more visibility, more care, and a better chance of eventually finding the right family.
                  </p>

                  <p>
                    At Furever Home, we believe that every kind act matters. Whether you adopt, virtually support an animal, share a profile, volunteer your time, or simply help spread the word, you become part of a community that believes in second chances and better lives for animals.
                  </p>
                </div>

                <MotionReveal className="hidden md:block">
                  <Image
                    src="/images/items/about-4.png"
                    alt="Furever Home volunteers spending time with a dog"
                    width={1536}
                    height={864}
                    className="w-full h-auto rounded-xl shadow-sm border border-border"
                  />
                </MotionReveal>
              </section>
            </div>

            <div className="mt-10 border-t border-border pt-6 md:mt-12 md:pt-8">
              <p className="text-muted-foreground mb-6">
                Want to get more involved?
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/volunteer"
                  className="px-6 py-3 bg-linear-to-r from-[#5f57e7] to-primary text-primary-foreground rounded-lg font-semibold hover:scale-105 hover:brightness-105 transition-all ease-in-out duration-300 text-center"
                >
                  Become a Volunteer
                </Link>

                <Link
                  href="/donate"
                  className="px-6 py-3 bg-secondary text-[#1E1B4B] rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition-all ease-in-out duration-300 text-center"
                >
                  Make a Donation
                </Link>
              </div>
            </div>
          </MotionReveal>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default About
