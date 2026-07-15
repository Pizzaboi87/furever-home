import type { Metadata } from 'next'
import Image from '@/components/ui/LoadingImage'
import Link from 'next/link'

import DonationCheckoutForm from '@/components/donate/DonationCheckoutForm'
import Footer from '@/components/layout/Footer'
import Navigation from '@/components/layout/Navigation'
import MotionReveal from '@/components/ui/MotionReveal'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Donate to Support Shelter Animals',
  description:
    'Make a one-time or monthly donation to help provide food, veterinary care, safe shelter, enrichment, and adoption support for animals waiting for loving homes.',
  path: '/donate',
})

export default function Donate() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background py-8 md:py-16">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-8">
          <MotionReveal className="rounded-lg border border-border bg-white p-5 shadow-sm md:p-12">
            <div className="grid grid-cols-1 items-start gap-10 xl:grid-cols-[minmax(420px,560px)_minmax(0,1fr)] xl:items-stretch xl:gap-12">
              <div className="hidden min-h-0 xl:grid xl:h-full xl:grid-rows-[minmax(0,1fr)_auto_auto] xl:gap-6">
                <MotionReveal className="relative min-h-90 overflow-hidden rounded-xl border border-border shadow-sm">
                  <Image
                    src="/images/items/donate-1.png"
                    alt="Furever Home volunteer sitting with an adoptable dog and cat beside a donation sign"
                    width={1012}
                    height={1536}
                    priority
                    className="h-full w-full object-cover"
                  />
                </MotionReveal>

                <MotionReveal className="relative overflow-hidden rounded-xl border border-border shadow-sm">
                  <Image
                    src="/images/items/donate-2.png"
                    alt="Furever Home shelter supplies ready for rescued animals"
                    width={1536}
                    height={864}
                    className="aspect-video h-auto w-full object-cover"
                  />
                </MotionReveal>

                <MotionReveal className="relative overflow-hidden rounded-xl border border-border shadow-sm">
                  <Image
                    src="/images/items/donate-3.png"
                    alt="Furever Home animals and shelter supplies supported by donations"
                    width={1536}
                    height={864}
                    className="aspect-video h-auto w-full object-cover"
                  />
                </MotionReveal>
              </div>

              <div className="xl:flex xl:h-full xl:flex-col">
                <MotionReveal className="xl:hidden mb-8">
                  <Image
                    src="/images/items/donate-1.png"
                    alt="Furever Home volunteer sitting with an adoptable dog and cat beside a donation sign"
                    width={1012}
                    height={1536}
                    priority
                    className="h-auto w-full rounded-xl border border-border shadow-sm"
                  />
                </MotionReveal>

                <h1 className="mb-6 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                  Support Our Mission
                </h1>

                <div className="space-y-8 text-muted-foreground">
                  <p className="text-lg">
                    Your generous donation helps us care for animals, facilitate adoptions, and continue our vital work in rescue and animal welfare. Every contribution, whether small or large, helps provide safety, comfort, medical support, and a better chance at a loving home for animals who need it most.
                  </p>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      How Your Donation Helps
                    </h2>

                    <p className="mb-4">
                      Donations allow Furever Home to support animals through every stage of their journey, from rescue and recovery to adoption and long-term care. Some animals arrive needing medical attention, proper nutrition, grooming, training, or simply a calm place where they can feel safe again.
                    </p>

                    <MotionReveal className="mb-4 xl:hidden">
                      <Image
                        src="/images/items/donate-2.png"
                        alt="Furever Home shelter supplies ready for rescued animals"
                        width={1536}
                        height={864}
                        className="aspect-video h-auto w-full rounded-xl border border-border object-cover shadow-sm"
                      />
                    </MotionReveal>

                    <ul className="space-y-3 list-disc list-inside">
                      <li>Provide veterinary care and nutrition for rescued animals</li>
                      <li>Support adoption and foster programs</li>
                      <li>Maintain our adoption facilities</li>
                      <li>Fund educational programs</li>
                      <li>Help animals in emergency situations</li>
                      <li>Cover staff and operational costs</li>
                    </ul>
                  </section>

                  <DonationCheckoutForm />

                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      Other Ways to Help
                    </h2>

                    <p className="mb-4">
                      Can&apos;t donate today? You can still help by volunteering your time, spreading the word about Furever Home, or participating in our virtual adoption program.
                    </p>

                    <MotionReveal className="mb-4 xl:hidden">
                      <Image
                        src="/images/items/donate-3.png"
                        alt="Furever Home animals and shelter supplies supported by donations"
                        width={1536}
                        height={864}
                        className="aspect-video h-auto w-full rounded-xl border border-border object-cover shadow-sm"
                      />
                    </MotionReveal>

                    <p>
                      Sharing an animal&apos;s profile, telling a friend about adoption, helping at an event, or supporting a foster family can all make a real difference. Animal rescue works best when many people contribute in the way they can.
                    </p>
                  </section>
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                  <p className="text-muted-foreground mb-6">
                    Want to help in another way?
                  </p>

                  <Link
                    href="/volunteer"
                    className="inline-flex px-6 py-3 bg-secondary text-[#1E1B4B] rounded-lg font-semibold hover:bg-opacity-90 hover:scale-105 transition-all ease-in-out duration-300 text-center"
                  >
                    Volunteer Instead
                  </Link>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </main>

      <Footer />
    </>
  )
}
