import type { Metadata } from 'next'
import Image from '@/components/ui/LoadingImage'
import Link from "next/link"

import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Page Not Found',
  description: 'The page you requested could not be found.',
  path: '/404',
  noIndex: true,
})

const NotFoundPage = () => {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-12 text-foreground">
            <div className="pointer-events-none absolute -right-55 -top-55 h-180 w-180 rounded-full bg-[#e6e1ff] opacity-80 blur-3xl" />
            <div className="pointer-events-none absolute right-10 top-20 h-90 w-90 rounded-full bg-[#f0edff] opacity-90 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-65 -right-40 h-155 w-155 rounded-full bg-[#eeeaff] opacity-70 blur-3xl" />

            <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 xl:gap-36 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="order-2 text-center lg:order-1 lg:text-left">
                    <p className="mb-4 inline-flex rounded-full border border-[#ded9ff] bg-white/80 px-4 py-2 text-sm font-bold text-[#5448e8] shadow-sm backdrop-blur">
                        Error 404
                    </p>

                    <h1 className="text-4xl font-black tracking-tight text-[#202638] sm:text-5xl lg:text-6xl">
                        This page got chewed.
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#667085] lg:mx-0">
                        The page you are looking for is missing, moved, or got tangled up in
                        a suspiciously interesting blue cable.
                    </p>

                    <div className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-4 sm:flex-row lg:mx-0">
                        <Link
                            href="/"
                            className="inline-flex min-h-14 flex-1 items-center justify-center rounded-xl bg-linear-to-r from-[#6257ea] to-[#4f46e5] px-6 text-base font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Back to Home
                        </Link>

                        <Link
                            href="/browse"
                            className="inline-flex min-h-14 flex-1 items-center justify-center rounded-xl bg-[#e8e5ff] px-6 text-base font-bold text-[#25214f] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#dedaff] hover:shadow-md"
                        >
                            Browse Pets
                        </Link>
                    </div>
                </div>

                <div className="order-1 flex justify-center lg:order-2">
                    <div className="relative w-full max-w-155">
                        <div className="absolute inset-x-16 bottom-6 h-14 rounded-full bg-violet-950/10 blur-2xl" />

                        <Image
                            src="/images/assets/404.webp"
                            alt="Orange cat chewing a blue cable inside a fluffy purple 404 sign"
                            width={900}
                            height={900}
                            priority
                            className="relative h-auto w-full drop-shadow-2xl"
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}

export default NotFoundPage