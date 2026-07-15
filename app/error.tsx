'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-12 text-foreground">
      <div className="pointer-events-none absolute -right-55 -top-55 h-180 w-180 rounded-full bg-[#e6e1ff] opacity-80 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-20 h-90 w-90 rounded-full bg-[#f0edff] opacity-90 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-65 -right-40 h-155 w-155 rounded-full bg-[#eeeaff] opacity-70 blur-3xl" />

      <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] xl:gap-36">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="mb-4 inline-flex rounded-full border border-[#ded9ff] bg-white/80 px-4 py-2 text-sm font-bold text-[#5448e8] shadow-sm backdrop-blur">
            Something went wrong
          </p>

          <h1 className="text-4xl font-black tracking-tight text-[#202638] sm:text-5xl lg:text-6xl">
            Well, that broke.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#667085] lg:mx-0">
            A small technical mishap knocked things over. Try loading the page again, or head
            back home while we put the pieces together.
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-4 sm:flex-row lg:mx-0">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-14 flex-1 cursor-pointer items-center justify-center rounded-xl bg-linear-to-r from-[#6257ea] to-[#4f46e5] px-6 text-base font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Try Again
            </button>

            <Link
              href="/"
              className="inline-flex min-h-14 flex-1 items-center justify-center rounded-xl bg-[#e8e5ff] px-6 text-base font-bold text-[#25214f] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#dedaff] hover:shadow-md"
            >
              Back to Home
            </Link>
          </div>

          {error.digest ? (
            <p className="mt-5 text-xs text-[#98a2b3]">Error reference: {error.digest}</p>
          ) : null}
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative w-full max-w-125">
            <div className="absolute inset-x-16 bottom-5 h-14 rounded-full bg-violet-950/10 blur-2xl" />

            <Image
              src="/images/assets/broken.png"
              alt="Orange cat sitting beside a broken porcelain vase"
              width={628}
              height={741}
              priority
              className="relative h-auto w-full drop-shadow-2xl"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
