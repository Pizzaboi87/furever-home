import Image from '@/components/ui/LoadingImage';
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Activity, ExternalLink } from "lucide-react";

import {
  badgeBaseClassName,
  getCaseStatusBadgeClassName,
} from "@/utils/admin/badge-styles";
import type {
  AdminPet,
  AdminPetCase,
  CaseInteraction,
  CaseNote,
} from "@/lib/admin/domain";
import type { AdminPersonTimelineItem } from "@/lib/admin/person-service";
import { formatLabel } from "@/lib/pet-format";
import { formatDate, formatDateTime } from "@/utils/admin/people/person-detail-utils";

export function CaseRow({ item }: { item: AdminPetCase }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 transition-colors hover:bg-indigo-50/50">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-primary">
          {formatLabel(item.type)}
        </span>

        <span
          className={`${badgeBaseClassName} ${getCaseStatusBadgeClassName(item.status)}`}
        >
          {formatLabel(item.status)}
        </span>
      </div>

      <h3 className="text-sm font-bold text-foreground">{item.subject}</h3>

      <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
        {item.summary || "No summary captured."}
      </p>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{formatDate(item.lastActivityAt)}</span>

        <Link
          href={`/admin/cases/${item.id}`}
          className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
        >
          View case
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export function InteractionRow({ item }: { item: CaseInteraction }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-foreground">
            {formatLabel(item.channel)}
          </p>
          <p className="mt-1 text-xs font-semibold text-primary">
            {formatDateTime(item.loggedAt)}
          </p>
        </div>

        <span className="rounded-full bg-input px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {formatLabel(item.direction)}
        </span>
      </div>

      <p className="text-sm leading-5 text-muted-foreground">{item.summary}</p>

      {item.actionTaken ? (
        <p className="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-primary">
          Action taken: {item.actionTaken}
        </p>
      ) : null}

      {item.nextStep ? (
        <p className="mt-2 rounded-lg bg-input px-3 py-2 text-xs font-semibold text-muted-foreground">
          Next step: {item.nextStep}
        </p>
      ) : null}
    </div>
  );
}

export function NoteRow({ item }: { item: CaseNote }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-foreground">Internal note</p>
        <span className="text-xs font-semibold text-primary">
          {formatDateTime(item.createdAt)}
        </span>
      </div>

      <p className="text-sm leading-5 text-muted-foreground">{item.body}</p>
    </div>
  );
}

export function TimelineRow({ item }: { item: AdminPersonTimelineItem }) {
  return (
    <div className="relative pl-7">
      <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-primary ring-4 ring-white">
        <Activity className="h-3.5 w-3.5" aria-hidden="true" />
      </span>

      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-foreground">{item.title}</p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {item.detail}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-input px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {formatLabel(item.type)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link
            href={`/admin/cases/${item.caseId}`}
            className="font-bold text-primary hover:underline"
          >
            {item.caseSubject}
          </Link>

          <span className="font-medium text-muted-foreground">
            {formatDateTime(item.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function RelatedPetCard({ pet }: { pet: AdminPet }) {
  return (
    <Link
      href={`/admin/pets/${pet.id}`}
      className="group flex gap-3 rounded-xl border border-border bg-white p-3 transition-colors hover:border-primary hover:bg-indigo-50/50"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-input">
        <Image
          src={pet.image}
          alt={pet.name}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0">
        <p className="font-bold text-foreground group-hover:text-primary">
          {pet.name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatLabel(pet.species)} · {formatLabel(pet.status)}
        </p>
      </div>
    </Link>
  );
}

export function ContactInfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-white p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 wrap-break-word text-sm font-semibold text-foreground">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}
