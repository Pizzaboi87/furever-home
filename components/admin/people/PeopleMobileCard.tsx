import Link from 'next/link'
import { ArrowRight, Mail, Phone } from 'lucide-react'

import type { AdminPersonOverview } from '@/lib/admin/person-service'
import {
    formatPersonDate,
    getPersonInitials,
    getPersonTypeLabel,
} from '@/utils/admin/people/people-utils'

export default function PeopleMobileCard({ item }: { item: AdminPersonOverview }) {
    const { person, stats } = item
    const latestActivity = formatPersonDate(stats.lastActivityAt ?? person.updatedAt ?? person.createdAt)

    return (
        <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-primary">
                        {getPersonInitials(person.name)}
                    </div>

                    <div className="min-w-0">
                        <Link
                            href={`/admin/people/${person.id}`}
                            className="block wrap-break-word font-bold text-primary transition-colors hover:text-primary/80 hover:underline"
                        >
                            {person.name}
                        </Link>
                        <p className="mt-1 wrap-break-word text-xs font-semibold text-muted-foreground">
                            {person.id}
                        </p>
                    </div>
                </div>

                <Link
                    href={`/admin/people/${person.id}`}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-indigo-50"
                >
                    Open
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
            </div>

            <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                {person.email ? (
                    <a href={`mailto:${person.email}`} className="flex min-w-0 items-center gap-2 transition-colors hover:text-primary">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                        <span className="truncate">{person.email}</span>
                    </a>
                ) : null}

                {person.phone ? (
                    <a href={`tel:${person.phone}`} className="flex min-w-0 items-center gap-2 transition-colors hover:text-primary">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                        <span className="truncate">{person.phone}</span>
                    </a>
                ) : null}

                {!person.email && !person.phone ? <span>Not captured</span> : null}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div>
                    <p className="font-semibold uppercase tracking-wide text-muted-foreground">Type</p>
                    <p className="mt-1 text-muted-foreground">{getPersonTypeLabel(person.tags)}</p>
                </div>

                <div>
                    <p className="font-semibold uppercase tracking-wide text-muted-foreground">Cases</p>
                    <p className="mt-1 font-bold text-foreground">{stats.totalCases}</p>
                </div>

                <div>
                    <p className="font-semibold uppercase tracking-wide text-muted-foreground">Open</p>
                    <span
                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold ${stats.openCases > 0
                            ? 'border border-amber-200 bg-amber-50 text-amber-700'
                            : 'border border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                    >
                        {stats.openCases}
                    </span>
                </div>

                <div>
                    <p className="font-semibold uppercase tracking-wide text-muted-foreground">Latest</p>
                    <p className="mt-1 text-muted-foreground">{latestActivity}</p>
                </div>
            </div>
        </article>
    )
}
