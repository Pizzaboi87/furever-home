import Link from 'next/link'
import Image from '@/components/ui/LoadingImage'
import { ShieldCheck } from 'lucide-react'

import MotionReveal from '@/components/ui/MotionReveal'
import { getCurrentStaff } from '@/lib/admin/auth'

export default async function AdminLoginPage() {
  const staff = await getCurrentStaff()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f6ff] px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-35 blur-3xl"
        style={{ backgroundImage: "url('/images/items/admin.png')" }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-linear-to-br from-[#f3f2fd]/95 via-white/80 to-[#ebe7ff]/90"
        aria-hidden="true"
      />

      <div
        className="absolute left-48 top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="absolute bottom-40 right-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-screen-2xl items-center justify-center">
        <MotionReveal className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-xl shadow-primary/10 backdrop-blur-xl lg:grid-cols-[1fr_420px]">
          <div
            className="relative hidden overflow-hidden bg-cover bg-center p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between"
            style={{ backgroundImage: "url('/images/items/admin.png')" }}
          >
            <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
            <div className="absolute inset-0 bg-linear-to-br from-black/20 via-transparent to-black/45" aria-hidden="true" />

            <div className="relative z-10">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg border border-white/25 bg-white/20 backdrop-blur-md">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>

              <h1 className="text-4xl font-bold text-white">Furever CRM</h1>

              <p className="mt-4 max-w-md text-white/85">
                Manage shelter operations, adoption work, and supporter communication from one secure staff workspace.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3 text-sm text-white/85">
              <div className="rounded-lg border border-white/25 bg-white/15 p-3 shadow-sm backdrop-blur-md">
                <p className="text-2xl font-bold text-white">30</p>
                <p>Current pets</p>
              </div>

              <div className="rounded-lg border border-white/25 bg-white/15 p-3 shadow-sm backdrop-blur-md">
                <p className="text-2xl font-bold text-white">CRM</p>
                <p>Case tracking</p>
              </div>

              <div className="rounded-lg border border-white/25 bg-white/15 p-3 shadow-sm backdrop-blur-md">
                <p className="text-2xl font-bold text-white">Audit</p>
                <p>Staff actions</p>
              </div>
            </div>
          </div>

          <section className="bg-white/80 p-6 backdrop-blur-xl sm:p-8">
            <Link href="/" className="mb-8 inline-flex text-sm font-medium text-primary hover:underline">
              Back to site
            </Link>

            <div className="mb-8">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Staff workspace
              </p>

              <h2 className="text-3xl font-bold text-foreground">Sign in</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Access is limited to active shelter staff. Sign in with your approved staff account to manage cases, pets, people, and daily tasks.
              </p>
            </div>

            {staff ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <p className="font-semibold">Signed in as {staff.name}</p>
                  <p className="mt-1 text-emerald-700">{staff.email}</p>
                </div>

                <a
                  href="/admin/dashboard"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-6 py-3 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
                >
                  Open Dashboard
                </a>

                <a
                  href="/auth/logout"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-white px-6 py-3 font-semibold text-foreground transition-colors hover:border-primary hover:bg-indigo-50"
                >
                  Log out
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <a
                  href="/auth/login?returnTo=/admin/dashboard"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-6 py-3 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
                >
                  Sign in to Furever CRM
                </a>

                <div className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-muted-foreground mt-4">
                  <p className="font-semibold text-foreground">Having trouble signing in?</p>
                  <p className="mt-2">
                    Contact the IT team if you need help accessing your staff account or updating your admin permissions.
                  </p>
                </div>
              </div>
            )}
          </section>
        </MotionReveal>
      </div>

      <Image
        src="/images/assets/paws.png"
        width={746}
        height={629}
        alt="paws"
        loading="eager"
        className="pointer-events-none absolute bottom-0 right-0 z-0 h-auto w-32 opacity-20 sm:w-44 lg:w-56"
      />
    </main>
  )
}