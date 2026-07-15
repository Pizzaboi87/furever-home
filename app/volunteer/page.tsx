import type { Metadata } from 'next'
import Image from '@/components/ui/LoadingImage'
import Link from 'next/link'

import Footer from '@/components/layout/Footer'
import Navigation from '@/components/layout/Navigation'
import MotionReveal from '@/components/ui/MotionReveal'
import VolunteerInquiryButton from '@/components/volunteer/VolunteerInquiryButton'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Volunteer With Shelter Animals',
  description:
    'Join Furever Home as a volunteer and support pet care, socialization, adoption events, fostering, administration, home visits, or fundraising for shelter animals.',
  path: '/volunteer',
})

export default function Volunteer() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background py-8 md:py-16">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-8">
          <MotionReveal className="rounded-lg border border-border bg-white p-5 shadow-sm md:p-12">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(480px,620px)] gap-10 xl:gap-12 items-start">
              <div>
                <h1 className="mb-6 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                  Volunteer With Us
                </h1>

                <div className="space-y-7 text-muted-foreground md:space-y-8">
                  <p className="text-lg">
                    Make a difference in the lives of animals! Our volunteer program offers various ways to support our mission of finding homes for pets. Whether you have a few hours a month or would like to help regularly, your time, care, and patience can make a real difference for animals waiting for their forever homes.
                  </p>

                  <MotionReveal className="xl:hidden">
                    <Image
                      src="/images/items/volunteer-1.png"
                      alt="Furever Home volunteers helping birds in a shelter room"
                      width={1536}
                      height={864}
                      priority
                      className="h-auto w-full rounded-xl border border-border shadow-sm"
                    />
                  </MotionReveal>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      Volunteer Opportunities
                    </h2>

                    <p className="mb-4">
                      There are many ways to get involved at Furever Home, and not every role requires the same amount of experience. Some volunteers enjoy spending time directly with animals, while others prefer helping behind the scenes with events, communication, organization, or fundraising.
                    </p>

                    <ul className="space-y-3 list-disc list-inside">
                      <li>Help with pet care and socialization</li>
                      <li>Assist with adoption events</li>
                      <li>Support administrative tasks</li>
                      <li>Conduct home visits for adoptions</li>
                      <li>Foster animals in need</li>
                      <li>Help with fundraising efforts</li>
                    </ul>
                  </section>

                  <MotionReveal className="xl:hidden">
                    <Image
                      src="/images/items/volunteer-2.png"
                      alt="Furever Home volunteers spending time with dogs outside the animal shelter"
                      width={1536}
                      height={864}
                      className="h-auto w-full rounded-xl border border-border shadow-sm"
                    />
                  </MotionReveal>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      Why Volunteer?
                    </h2>

                    <p className="mb-4">
                      Volunteering with Furever Home is a rewarding experience. You&apos;ll make a direct impact on the lives of animals, be part of a passionate community, and help create success stories of animals finding their forever homes.
                    </p>

                    <p>
                      For many animals, regular contact with kind and patient people can be an important step toward confidence, trust, and emotional recovery. A walk, a play session, a calm moment of attention, or simply helping an animal feel safe can make their adoption journey much easier.
                    </p>
                  </section>

                  <MotionReveal className="xl:hidden">
                    <Image
                      src="/images/items/volunteer-3.png"
                      alt="Furever Home volunteers caring for cats in a shelter room"
                      width={1536}
                      height={864}
                      className="h-auto w-full rounded-xl border border-border shadow-sm"
                    />
                  </MotionReveal>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      Get Started
                    </h2>

                    <p className="mb-4">
                      Interested in volunteering? Send us the form below and we&apos;ll get back to you with current opportunities, onboarding steps, and the kind of support that would be most useful right now.
                    </p>

                    <p>
                      You do not need to be an expert to get involved. What matters most is reliability, kindness, and a genuine interest in animal welfare. We help new volunteers understand the basics, find a role that suits them, and become part of the Furever Home community at a comfortable pace.
                    </p>
                  </section>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row">
                  <VolunteerInquiryButton />

                  <Link
                    href="/donate"
                    className="rounded-lg bg-secondary px-6 py-3 text-center font-semibold text-[#1E1B4B] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-90"
                  >
                    Make a Donation
                  </Link>
                </div>
              </div>

              <div className="hidden space-y-8 xl:block">
                <MotionReveal>
                  <Image
                    src="/images/items/volunteer-1.png"
                    alt="Furever Home volunteers helping birds in a shelter room"
                    width={1536}
                    height={864}
                    priority
                    className="w-full h-auto rounded-xl shadow-sm border border-border"
                  />
                </MotionReveal>

                <MotionReveal>
                  <Image
                    src="/images/items/volunteer-2.png"
                    alt="Furever Home volunteers spending time with dogs outside the animal shelter"
                    width={1536}
                    height={864}
                    className="w-full h-auto rounded-xl shadow-sm border border-border"
                  />
                </MotionReveal>

                <MotionReveal>
                  <Image
                    src="/images/items/volunteer-3.png"
                    alt="Furever Home volunteers caring for cats in a shelter room"
                    width={1536}
                    height={864}
                    className="w-full h-auto rounded-xl shadow-sm border border-border"
                  />
                </MotionReveal>
              </div>
            </div>
          </MotionReveal>
        </div>
      </main>

      <Footer />
    </>
  )
}
