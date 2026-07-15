import type { Metadata } from 'next'
import Image from '@/components/ui/LoadingImage'
import Link from 'next/link'

import Footer from '@/components/layout/Footer'
import Navigation from '@/components/layout/Navigation'
import MotionReveal from '@/components/ui/MotionReveal'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Thank You for Supporting Shelter Animals',
  description:
    'Your donation supports food, veterinary care, safe shelter, and adoption services for animals in need.',
  path: '/donate/success',
  noIndex: true,
})

export default function DonationSuccessPage() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <MotionReveal className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="relative min-h-100 bg-secondary/50 lg:min-h-full">
                <Image
                  src="/images/items/success.png"
                  alt="Furever Home volunteer sitting with rescued animals in the shelter donation room"
                  width={1024}
                  height={1024}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center p-8 text-center md:p-12 lg:text-left">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  Donation received
                </p>
                <h1 className="mb-4 text-4xl font-bold text-foreground">
                  Thank you for your support
                </h1>
                <p className="mb-8 text-lg text-muted-foreground">
                  Your donation helps provide food, care, medical support, and adoption services for animals who need a safer place to land. Every gift gives our team more room to say yes when an animal needs help.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Link
                    href="/browse"
                    className="rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-6 py-3 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
                  >
                    Meet the Animals
                  </Link>
                  <Link
                    href="/donate"
                    className="rounded-lg bg-secondary px-6 py-3 font-semibold text-[#1E1B4B] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-90"
                  >
                    Back to Donations
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
