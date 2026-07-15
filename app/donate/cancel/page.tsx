import type { Metadata } from 'next'
import Image from '@/components/ui/LoadingImage'
import Link from 'next/link'

import Footer from '@/components/layout/Footer'
import Navigation from '@/components/layout/Navigation'
import MotionReveal from '@/components/ui/MotionReveal'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Donation Checkout Cancelled',
  description:
    'No donation was completed. Return to the donation page whenever you are ready or explore other ways to support shelter animals.',
  path: '/donate/cancel',
  noIndex: true,
})

export default function DonationCancelPage() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <MotionReveal className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="relative min-h-100 bg-secondary/50 lg:min-h-full">
                <Image
                  src="/images/items/cancel.png"
                  alt="Furever Home shelter volunteer with rescued animals after a cancelled donation checkout"
                  width={1024}
                  height={1024}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center p-8 text-center md:p-12 lg:text-left">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  Checkout cancelled
                </p>
                <h1 className="mb-4 text-4xl font-bold text-foreground">
                  No donation was completed
                </h1>
                <p className="mb-8 text-lg text-muted-foreground">
                  No worries - you can return to the donation page whenever you are ready, or support the shelter in another meaningful way by volunteering your time and care.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Link
                    href="/donate"
                    className="rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-6 py-3 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
                  >
                    Back to Donations
                  </Link>
                  <Link
                    href="/volunteer"
                    className="rounded-lg bg-secondary px-6 py-3 font-semibold text-[#1E1B4B] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-90"
                  >
                    Be a volunteer
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
