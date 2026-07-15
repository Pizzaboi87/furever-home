import Link from "next/link";
import {
  Activity,
  ClipboardList,
  FileText,
  MapPin,
  MessageSquare,
  PawPrint,
  PlusCircle,
  Save,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

import MotionReveal from "@/components/ui/MotionReveal";
import SectionCard from "@/components/admin/common/SectionCard";
import StatCard from "@/components/admin/common/StatCard";
import { ActionButton } from "@/components/ui/ActionButton";
import type { Person, PersonProfileType } from "@/lib/admin/domain";
import type { AdminPersonDetail } from "@/lib/admin/person-service";
import { formatLabel } from "@/lib/pet-format";
import {
  CaseRow,
  ContactInfoRow,
  NoteRow,
  TimelineRow,
} from "@/components/admin/people/PersonDetailRows";

type PersonDetailMainContentProps = {
  person: Person;
  profileType: PersonProfileType;
  stats: AdminPersonDetail["stats"];
  cases: AdminPersonDetail["cases"];
  notes: AdminPersonDetail["notes"];
  timeline: AdminPersonDetail["timeline"];
  desktopDangerZone: ReactNode;
  onEditProfile: () => void;
};

export default function PersonDetailMainContent({
  person,
  profileType,
  stats,
  cases,
  notes,
  timeline,
  desktopDangerZone,
  onEditProfile,
}: PersonDetailMainContentProps) {
  return (
    <div className="space-y-5">
      <MotionReveal className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          variant="compact"
          label="total cases"
          value={stats.totalCases}
          icon={ClipboardList}
        />
        <StatCard
          variant="compact"
          label="open cases"
          value={stats.openCases}
          icon={MessageSquare}
        />
        <StatCard
          variant="compact"
          label="interactions"
          value={stats.totalInteractions}
          icon={Activity}
        />
        <StatCard
          variant="compact"
          label="related pets"
          value={stats.relatedPets}
          icon={PawPrint}
        />
      </MotionReveal>

      <SectionCard delay={0.04}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Contact profile
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Contact, household, and CRM classification summary.
            </p>
          </div>

          <ActionButton
            type="button"
            size="sm"
            onClick={onEditProfile}
            className="w-fit"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Edit profile
          </ActionButton>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ContactInfoRow
            icon={UserRound}
            label="Type"
            value={formatLabel(profileType)}
          />
          <ContactInfoRow
            icon={MessageSquare}
            label="Preferred contact"
            value={formatLabel(person.preferredContactMethod ?? "not provided")}
          />
          <ContactInfoRow
            icon={MapPin}
            label="Household"
            value={person.householdType}
          />
          <ContactInfoRow
            icon={PawPrint}
            label="Other pets"
            value={person.hasOtherPets ? "Yes" : "No"}
          />
        </div>
      </SectionCard>

      <SectionCard delay={0.12}>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Related cases</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Case records connected to this contact.
            </p>
          </div>

          <Link
            href={`/admin/cases/new?personId=${person.id}`}
            className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
          >
            <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Create case
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {cases.map((item) => (
            <CaseRow key={item.id} item={item} />
          ))}

          {cases.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-input p-6 text-center text-sm text-muted-foreground lg:col-span-2">
              No related cases found for this contact.
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard delay={0.16}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Internal notes
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Staff-only context across this contact&apos;s cases.
            </p>
          </div>

          <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>

        <div className="max-h-120 space-y-3 overflow-y-auto pr-2">
          {notes.map((item) => (
            <NoteRow key={item.id} item={item} />
          ))}

          {notes.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-input p-6 text-center text-sm text-muted-foreground">
              No internal notes captured yet.
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard delay={0.2}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Activity timeline
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Combined case events, newest first.
            </p>
          </div>

          <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-indigo-50 px-3 text-sm font-bold text-primary">
            {timeline.length}
          </span>
        </div>

        <div className="relative max-h-150 space-y-4 overflow-y-auto pr-2 before:absolute before:bottom-0 before:left-2.5 before:top-1 before:w-px before:bg-border">
          {timeline.map((item) => (
            <TimelineRow key={`${item.caseId}-${item.id}`} item={item} />
          ))}

          {timeline.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-input p-6 text-center text-sm text-muted-foreground">
              No timeline activity found for this contact.
            </div>
          )}
        </div>
      </SectionCard>

      {desktopDangerZone}
    </div>
  );
}
