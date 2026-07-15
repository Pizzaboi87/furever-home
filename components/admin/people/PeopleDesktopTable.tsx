import Link from 'next/link'
import { ArrowRight, Mail, Phone } from 'lucide-react'

import type { AdminPersonOverview } from '@/lib/admin/person-service'
import {
    formatPersonDate,
    getPersonInitials,
    getPersonTypeLabel,
} from '@/utils/admin/people/people-utils'

type PeopleDesktopTableProps = {
    people: AdminPersonOverview[]
    hasMatches: boolean
}

export default function PeopleDesktopTable({ people, hasMatches }: PeopleDesktopTableProps) {
    return (
        <table className="hidden w-full table-fixed text-left text-sm lg:table">
            <colgroup>
                <col className="w-[28%]" />
                <col className="w-[18%]" />
                <col className="w-[13%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[8%]" />
            </colgroup>

            <thead className="sticky top-0 z-10 bg-input text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Communication</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Cases</th>
                    <th className="px-5 py-3">Open</th>
                    <th className="px-5 py-3">Latest</th>
                    <th className="px-5 py-3">Actions</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-border">
                {people.map(({ person, stats }) => (
                    <tr
                        key={person.id}
                        className="bg-white transition-colors hover:bg-indigo-50/60"
                    >
                        <td className="px-5 py-4 align-middle">
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
                        </td>

                        <td className="px-5 py-4 align-middle">
                            <div className="space-y-1 text-xs text-muted-foreground">
                                {person.email ? (
                                    <a
                                        href={`mailto:${person.email}`}
                                        className="flex min-w-0 items-center gap-2 transition-colors hover:text-primary"
                                    >
                                        <Mail className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                                        <span className="truncate">{person.email}</span>
                                    </a>
                                ) : null}

                                {person.phone ? (
                                    <a
                                        href={`tel:${person.phone}`}
                                        className="flex min-w-0 items-center gap-2 transition-colors hover:text-primary"
                                    >
                                        <Phone className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                                        <span className="truncate">{person.phone}</span>
                                    </a>
                                ) : null}

                                {!person.email && !person.phone ? (
                                    <span>Not captured</span>
                                ) : null}
                            </div>
                        </td>

                        <td className="px-5 py-4 align-middle text-muted-foreground">
                            {getPersonTypeLabel(person.tags)}
                        </td>

                        <td className="px-5 py-4 align-middle font-bold text-foreground">
                            {stats.totalCases}
                        </td>

                        <td className="px-5 py-4 align-middle">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${stats.openCases > 0
                                    ? 'border border-amber-200 bg-amber-50 text-amber-700'
                                    : 'border border-slate-200 bg-slate-50 text-slate-600'
                                    }`}
                            >
                                {stats.openCases}
                            </span>
                        </td>

                        <td className="px-5 py-4 align-middle text-muted-foreground">
                            {formatPersonDate(stats.lastActivityAt ?? person.updatedAt ?? person.createdAt)}
                        </td>

                        <td className="px-5 py-4 align-middle">
                            <Link
                                href={`/admin/people/${person.id}`}
                                className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-indigo-50"
                            >
                                Open
                                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </Link>
                        </td>
                    </tr>
                ))}

                {!hasMatches && (
                    <tr>
                        <td
                            colSpan={7}
                            className="px-5 py-10 text-center text-sm text-muted-foreground"
                        >
                            No people match the selected filters.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}
