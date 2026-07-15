import {
  HeartHandshake,
  Mail,
  MapPin,
  MessageSquare,
  PawPrint,
  Phone,
  Tag,
  UserRound,
} from "lucide-react";

import SectionCard from "@/components/admin/common/SectionCard";
import type { Person, PersonProfileType } from "@/lib/admin/domain";
import type { AdminPersonDetail } from "@/lib/admin/person-service";
import { formatLabel } from "@/lib/pet-format";
import {
  ContactInfoRow,
  InteractionRow,
  RelatedPetCard,
} from "@/components/admin/people/PersonDetailRows";
import { formatAddress } from "@/utils/admin/people/person-detail-utils";

type PersonDetailSidebarProps = {
  person: Person;
  profileType: PersonProfileType;
  relatedPets: AdminPersonDetail["relatedPets"];
  interactions: AdminPersonDetail["interactions"];
  displayInterestAreas: string[];
  displayTags: string[];
};

export default function PersonDetailSidebar({
  person,
  profileType,
  relatedPets,
  interactions,
  displayInterestAreas,
  displayTags,
}: PersonDetailSidebarProps) {
  return (
    <aside className="space-y-5">
      <SectionCard delay={0.2}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Contact details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Current profile information.
            </p>
          </div>

          <Tag className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <ContactInfoRow icon={Mail} label="Email" value={person.email} />
          <ContactInfoRow icon={Phone} label="Phone" value={person.phone} />
          <ContactInfoRow
            icon={MapPin}
            label="Address"
            value={formatAddress(person.address)}
          />
          <ContactInfoRow
            icon={MessageSquare}
            label="Preferred contact"
            value={formatLabel(person.preferredContactMethod ?? "not provided")}
          />
          <ContactInfoRow
            icon={UserRound}
            label="Type"
            value={formatLabel(profileType)}
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
          <ContactInfoRow
            icon={HeartHandshake}
            label="Interests"
            value={
              displayInterestAreas.length
                ? displayInterestAreas.map(formatLabel).join(", ")
                : undefined
            }
          />
          <ContactInfoRow
            icon={Tag}
            label="Profile tags"
            value={
              displayTags.length
                ? displayTags.map(formatLabel).join(", ")
                : undefined
            }
          />
        </div>
      </SectionCard>

      <SectionCard delay={0.24}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Related pets</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pets connected through cases or applications.
            </p>
          </div>

          <HeartHandshake className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          {relatedPets.map((pet) => (
            <RelatedPetCard key={pet.id} pet={pet} />
          ))}

          {relatedPets.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-input p-6 text-center text-sm text-muted-foreground">
              No related pets found.
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard delay={0.28}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Recent interactions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest calls, emails, and messages.
            </p>
          </div>

          <MessageSquare className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>

        <div className="max-h-120 space-y-3 overflow-y-auto pr-2">
          {interactions.slice(0, 6).map((item) => (
            <InteractionRow key={item.id} item={item} />
          ))}

          {interactions.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-input p-6 text-center text-sm text-muted-foreground">
              No interactions logged yet.
            </div>
          )}
        </div>
      </SectionCard>
    </aside>
  );
}
