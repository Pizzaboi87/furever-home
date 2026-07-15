"use client";

import type { FormEvent } from "react";

import {
  FormField,
  adminInputClassName,
} from "@/components/admin/common/FormField";
import { formatLabel } from "@/lib/pet-format";
import type { ContactChannel, PersonProfileType } from "@/lib/admin/domain";
import {
  contactChannelOptions,
  profileTypeOptions,
} from "@/utils/admin/people/person-detail-utils";

type PersonDetailEditFormProps = {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredContactMethod: ContactChannel;
  profileType: PersonProfileType;
  householdType: string;
  hasOtherPets: boolean;
  interestAreas: string;
  tags: string;
  formError: string | null;
  isPending: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onPreferredContactMethodChange: (value: ContactChannel) => void;
  onProfileTypeChange: (value: PersonProfileType) => void;
  onHouseholdTypeChange: (value: string) => void;
  onHasOtherPetsChange: (value: boolean) => void;
  onInterestAreasChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function PersonDetailEditForm({
  name,
  email,
  phone,
  address,
  preferredContactMethod,
  profileType,
  householdType,
  hasOtherPets,
  interestAreas,
  tags,
  formError,
  isPending,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onAddressChange,
  onPreferredContactMethodChange,
  onProfileTypeChange,
  onHouseholdTypeChange,
  onHasOtherPetsChange,
  onInterestAreasChange,
  onTagsChange,
  onCancel,
  onSubmit,
}: PersonDetailEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Name">
          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            className={adminInputClassName}
            required
          />
        </FormField>

        <FormField label="Type">
          <select
            value={profileType}
            onChange={(event) =>
              onProfileTypeChange(event.target.value as PersonProfileType)
            }
            className={adminInputClassName}
          >
            {profileTypeOptions.map((option) => (
              <option key={option} value={option}>
                {formatLabel(option)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Email">
          <input
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            type="email"
            className={adminInputClassName}
          />
        </FormField>

        <FormField label="Phone">
          <input
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            className={adminInputClassName}
          />
        </FormField>

        <FormField label="Preferred contact">
          <select
            value={preferredContactMethod}
            onChange={(event) =>
              onPreferredContactMethodChange(event.target.value as ContactChannel)
            }
            className={adminInputClassName}
          >
            {contactChannelOptions.map((option) => (
              <option key={option} value={option}>
                {formatLabel(option)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Household">
          <input
            value={householdType}
            onChange={(event) => onHouseholdTypeChange(event.target.value)}
            className={adminInputClassName}
            placeholder="Apartment, family home, rural home..."
          />
        </FormField>

        <FormField label="Address" className="md:col-span-2">
          <input
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            className={adminInputClassName}
          />
        </FormField>

        <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-input px-4 py-3 md:col-span-2">
          <span>
            <span className="block text-sm font-bold text-foreground">
              Other pets in household
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Used as adoption and compatibility context.
            </span>
          </span>
          <input
            type="checkbox"
            checked={hasOtherPets}
            onChange={(event) => onHasOtherPetsChange(event.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>

        <FormField label="Interests" className="md:col-span-2">
          <input
            value={interestAreas}
            onChange={(event) => onInterestAreasChange(event.target.value)}
            className={adminInputClassName}
            placeholder="cats, dogs, senior pets, volunteering"
          />
        </FormField>

        <FormField label="Profile tags" className="md:col-span-2">
          <input
            value={tags}
            onChange={(event) => onTagsChange(event.target.value)}
            className={adminInputClassName}
            placeholder="adopter, donor, follow-up needed"
          />
        </FormField>
      </div>

      {formError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {formError}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 cursor-pointer rounded-lg border border-border bg-white px-4 py-2.5 font-semibold text-foreground transition-colors hover:bg-input"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="flex-1 cursor-pointer rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-4 py-2.5 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
