"use client";

import toast from "react-hot-toast";
import { useMemo, useState, useTransition } from "react";

import DangerZone from "@/components/admin/common/DangerZone";
import Header from "@/components/admin/common/Header";
import ModalShell from "@/components/ui/ModalShell";
import PersonDetailEditForm from "@/components/admin/people/PersonDetailEditForm";
import PersonDetailMainContent from "@/components/admin/people/PersonDetailMainContent";
import PersonDetailSidebar from "@/components/admin/people/PersonDetailSidebar";
import type {
  ContactChannel,
  Person,
  PersonProfileType,
} from "@/lib/admin/domain";
import type { AdminPersonDetail } from "@/lib/admin/person-service";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  formatAddress,
  getInitialInterestAreas,
  inferProfileType,
} from "@/utils/admin/people/person-detail-utils";
import { formatLabel } from "@/lib/pet-format";

import {
  anonymizePersonAction,
  updatePersonAction,
} from "@/actions/admin/people/person-actions";

type PersonDetailClientProps = {
  detail: AdminPersonDetail;
};

export default function PersonDetailClient({
  detail,
}: PersonDetailClientProps) {
  const { cases, interactions, notes, timeline, relatedPets, stats } = detail;
  const [person, setPerson] = useState(detail.person);
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [anonymizeConfirmation, setAnonymizeConfirmation] = useState("");

  const [name, setName] = useState(person.name);
  const [email, setEmail] = useState(person.email ?? "");
  const [phone, setPhone] = useState(person.phone ?? "");
  const [address, setAddress] = useState(formatAddress(person.address));
  const [preferredContactMethod, setPreferredContactMethod] =
    useState<ContactChannel>(person.preferredContactMethod ?? "email");
  const [profileType, setProfileType] = useState<PersonProfileType>(
    inferProfileType(person, cases),
  );
  const [householdType, setHouseholdType] = useState(
    person.householdType ?? "",
  );
  const [hasOtherPets, setHasOtherPets] = useState(
    Boolean(person.hasOtherPets),
  );
  const [interestAreas, setInterestAreas] = useState(
    getInitialInterestAreas(person),
  );
  const [tags, setTags] = useState((person.tags ?? []).join(", "));

  const normalizedInterestAreas = useMemo(
    () =>
      interestAreas
        .split(",")
        .map((interest) => interest.trim())
        .filter(Boolean),
    [interestAreas],
  );

  const normalizedTags = useMemo(
    () =>
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tags],
  );

  const resetFormFromPerson = (nextPerson: Person) => {
    setName(nextPerson.name);
    setEmail(nextPerson.email ?? "");
    setPhone(nextPerson.phone ?? "");
    setAddress(formatAddress(nextPerson.address));
    setPreferredContactMethod(nextPerson.preferredContactMethod ?? "email");
    setProfileType(inferProfileType(nextPerson, cases));
    setHouseholdType(nextPerson.householdType ?? "");
    setHasOtherPets(Boolean(nextPerson.hasOtherPets));
    setInterestAreas(
      nextPerson.interestAreas?.join(", ") ??
        getInitialInterestAreas(nextPerson),
    );
    setTags((nextPerson.tags ?? []).join(", "));
  };

  const openEditModal = () => {
    resetFormFromPerson(person);
    setFormError(null);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        setFormError(null);
        const updatedPerson = await updatePersonAction({
          personId: person.id,
          name,
          email,
          phone,
          address,
          preferredContactMethod,
          profileType,
          householdType,
          hasOtherPets,
          interestAreas: normalizedInterestAreas,
          tags: normalizedTags,
        });

        setPerson(updatedPerson);
        resetFormFromPerson(updatedPerson);
        setIsEditOpen(false);
        toast.success("Contact profile saved.");
      } catch (error) {
        console.error(error);
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while saving the contact.";

        setFormError(message);
        toast.error(message);
      }
    });
  };

  const canAnonymize = anonymizeConfirmation.trim() === person.name;

  const handleAnonymize = () => {
    startTransition(async () => {
      try {
        setFormError(null);
        const anonymizedPerson = await anonymizePersonAction({
          personId: person.id,
          confirmationName: anonymizeConfirmation,
        });

        setPerson(anonymizedPerson);
        resetFormFromPerson(anonymizedPerson);
        setAnonymizeConfirmation("");
        toast.success("Contact was anonymized.");
      } catch (error) {
        console.error(error);
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while anonymizing the contact.";

        setFormError(message);
        toast.error(message);
      }
    });
  };

  const profileDescription = `${formatLabel(profileType)} · Contact profile`;
  const displayInterestAreas = person.interestAreas?.length
    ? person.interestAreas
    : normalizedInterestAreas.length
      ? normalizedInterestAreas
      : [];
  const displayTags = person.tags ?? [];

  const renderGdprDangerZone = (className?: string) => (
    <DangerZone
      className={className}
      title="GDPR anonymization"
      description={
        <>
          Remove this contact&apos;s personal data while preserving case and
          audit history. This cannot be undone.
        </>
      }
      confirmationLabel="Type current name to confirm"
      confirmationValue={anonymizeConfirmation}
      onConfirmationChange={setAnonymizeConfirmation}
      confirmationPlaceholder={person.name}
      delay={0.08}
      error={
        formError ? (
          <p className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700">
            {formError}
          </p>
        ) : null
      }
      action={
        <ActionButton
          type="button"
          variant="danger"
          size="compact"
          disabled={!canAnonymize || isPending}
          onClick={handleAnonymize}
        >
          {isPending ? "Anonymizing..." : "Anonymize personal data"}
        </ActionButton>
      }
    />
  );

  return (
    <main className="min-h-screen bg-background">
      <Header
        currentHref="/admin/people"
        title={person.name}
        description={profileDescription}
      />

      <ModalShell
        isOpen={isEditOpen}
        onClose={closeEditModal}
        title="Edit contact profile"
        description="Update contact details, household context, and CRM classification."
        closeLabel="Close contact profile modal"
        size="lg"
      >
        <PersonDetailEditForm
          name={name}
          email={email}
          phone={phone}
          address={address}
          preferredContactMethod={preferredContactMethod}
          profileType={profileType}
          householdType={householdType}
          hasOtherPets={hasOtherPets}
          interestAreas={interestAreas}
          tags={tags}
          formError={formError}
          isPending={isPending}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onAddressChange={setAddress}
          onPreferredContactMethodChange={setPreferredContactMethod}
          onProfileTypeChange={setProfileType}
          onHouseholdTypeChange={setHouseholdType}
          onHasOtherPetsChange={setHasOtherPets}
          onInterestAreasChange={setInterestAreas}
          onTagsChange={setTags}
          onCancel={closeEditModal}
          onSubmit={handleSubmit}
        />
      </ModalShell>

      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_390px]">
        <PersonDetailMainContent
          person={person}
          profileType={profileType}
          stats={stats}
          cases={cases}
          notes={notes}
          timeline={timeline}
          desktopDangerZone={renderGdprDangerZone("hidden xl:block")}
          onEditProfile={openEditModal}
        />

        <PersonDetailSidebar
          person={person}
          profileType={profileType}
          relatedPets={relatedPets}
          interactions={interactions}
          displayInterestAreas={displayInterestAreas}
          displayTags={displayTags}
        />

        <div className="xl:hidden">{renderGdprDangerZone()}</div>
      </div>
    </main>
  );
}
