"use client";

import Image from '@/components/ui/LoadingImage';
import type { ChangeEventHandler } from "react";
import {
  CalendarClock,
  FileText,
  HeartHandshake,
  ImagePlus,
  PawPrint,
} from "lucide-react";

import {
  FormField,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/common/FormField";
import PetImageUploadCropper, {
  type UploadedPetImageResponse,
} from "@/components/admin/pets/PetImageUploadCropper";
import type { AdminPet } from "@/lib/admin/domain";
import { formatLabel, normalizeValue } from "@/lib/pet-format";
import { formatPetDetailDateInputValue } from "@/utils/admin/pets/pet-detail-utils";

type BaseSectionProps = {
  currentPet: AdminPet;
  speciesValues: string[];
  genderValues: string[];
  statusValues: string[];
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
};

export const PetEditBasicSection = ({
  currentPet,
  speciesValues,
  genderValues,
  statusValues,
  onChange,
}: BaseSectionProps) => (
  <section>
    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
      <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
      Basic profile
    </h3>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <FormField label="Pet name">
        <input type="text" name="name" defaultValue={currentPet.name} onChange={onChange} className={adminInputClassName} />
      </FormField>

      <FormField label="Species">
        <select name="species" defaultValue={normalizeValue(currentPet.species)} onChange={onChange} className={adminInputClassName}>
          {speciesValues.map((species) => <option key={species} value={species}>{formatLabel(species)}</option>)}
        </select>
      </FormField>

      <FormField label="Gender">
        <select name="gender" defaultValue={normalizeValue(currentPet.gender)} onChange={onChange} className={adminInputClassName}>
          {genderValues.map((gender) => <option key={gender} value={gender}>{formatLabel(gender)}</option>)}
        </select>
      </FormField>

      <FormField label="Adoption status">
        <select name="status" defaultValue={normalizeValue(currentPet.status)} onChange={onChange} className={adminInputClassName}>
          {statusValues.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
        </select>
      </FormField>
    </div>
  </section>
);

type PhysicalSectionProps = {
  currentPet: AdminPet;
  ageGroupValues: string[];
  sizeValues: string[];
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
};

export const PetEditPhysicalSection = ({ currentPet, ageGroupValues, sizeValues, onChange }: PhysicalSectionProps) => (
  <section>
    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
      <PawPrint className="h-4 w-4 text-primary" aria-hidden="true" />
      Physical details
    </h3>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
      <FormField label="Age">
        <input type="number" min="0" name="age" defaultValue={currentPet.age} onChange={onChange} className={adminInputClassName} />
      </FormField>
      <FormField label="Age group">
        <select name="ageGroup" defaultValue={normalizeValue(currentPet.ageGroup)} onChange={onChange} className={adminInputClassName}>
          {ageGroupValues.map((ageGroup) => <option key={ageGroup} value={ageGroup}>{formatLabel(ageGroup)}</option>)}
        </select>
      </FormField>
      <FormField label="Size">
        <select name="size" defaultValue={normalizeValue(currentPet.size)} onChange={onChange} className={adminInputClassName}>
          {sizeValues.map((size) => <option key={size} value={size}>{formatLabel(size)}</option>)}
        </select>
      </FormField>
      <FormField label="Weight">
        <input type="number" min="0" name="weight" defaultValue={currentPet.weight} onChange={onChange} className={adminInputClassName} />
      </FormField>
    </div>
  </section>
);

type CheckboxCardProps = {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const CheckboxCard = ({ name, label, description, defaultChecked, onChange }: CheckboxCardProps) => (
  <label className="flex cursor-pointer gap-3 rounded-lg border border-border bg-white p-4 transition-colors hover:border-primary hover:bg-indigo-50">
    <input type="checkbox" name={name} defaultChecked={defaultChecked} onChange={onChange} className="mt-1 h-5 w-5 cursor-pointer accent-primary" />
    <span>
      <span className="block font-semibold text-foreground">{label}</span>
      <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
    </span>
  </label>
);

type HomeFitSectionProps = {
  currentPet: AdminPet;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const PetEditHomeFitSection = ({ currentPet, onChange }: HomeFitSectionProps) => (
  <section>
    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
      <HeartHandshake className="h-4 w-4 text-primary" aria-hidden="true" />
      Home fit and health
    </h3>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <CheckboxCard name="goodWithChildren" label="Good with children" description="Mark only when staff are confident about child-friendly behavior." defaultChecked={currentPet.goodWithChildren ?? false} onChange={onChange} />
      <CheckboxCard name="goodWithOtherAnimals" label="Good with other animals" description="Used by the public filters and profile compatibility summary." defaultChecked={currentPet.goodWithOtherAnimals ?? false} onChange={onChange} />
      <CheckboxCard name="neutered" label="Neutered" description="Shown as a health badge on the public pet detail page." defaultChecked={currentPet.neutered ?? false} onChange={onChange} />
    </div>
  </section>
);

type JourneySectionProps = {
  currentPet: AdminPet;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const PetEditJourneySection = ({ currentPet, onChange }: JourneySectionProps) => (
  <section>
    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
      <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
      Shelter journey
    </h3>
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <FormField label="Days in shelter">
        <input type="number" min="0" name="daysInShelter" defaultValue={currentPet.daysInShelter ?? 0} onChange={onChange} className={adminInputClassName} />
      </FormField>
      <FormField label="Last updated">
        <input type="date" name="lastUpdated" defaultValue={formatPetDetailDateInputValue(currentPet.lastUpdated)} onChange={onChange} className={adminInputClassName} />
      </FormField>
    </div>
  </section>
);

type StorySectionProps = {
  currentPet: AdminPet;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
};

export const PetEditStorySection = ({ currentPet, onChange }: StorySectionProps) => (
  <section>
    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
      <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
      Public story
    </h3>
    <FormField label="Description">
      <textarea rows={9} name="description" defaultValue={currentPet.description} onChange={onChange} className={`${adminTextareaClassName} min-h-60`} />
    </FormField>
  </section>
);

type MediaSectionProps = {
  currentPet: AdminPet;
  imageValue: string;
  isSaving: boolean;
  onUploadingChange: (isUploading: boolean) => void;
  onImageUploadError: (message: string) => void;
  onImageUploaded: (uploadedImage: UploadedPetImageResponse) => void;
  onImageUrlChange: (value: string) => void;
};

export const PetEditMediaSection = ({ currentPet, imageValue, isSaving, onUploadingChange, onImageUploadError, onImageUploaded, onImageUrlChange }: MediaSectionProps) => (
  <section>
    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
      <ImagePlus className="h-4 w-4 text-primary" aria-hidden="true" />
      Media
    </h3>
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
      <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-input">
        <Image
          src={imageValue}
          alt={currentPet.name}
          fill
          sizes="(min-width: 1024px) 220px, 100vw"
          priority
          className="object-cover"
        />
      </div>
      <div className="space-y-4">
        <PetImageUploadCropper
          disabled={isSaving}
          petId={currentPet.id}
          helperText="Choose a JPG, PNG, or WebP image, crop it to a square, then upload it to Cloudinary."
          onUploadingChange={onUploadingChange}
          onError={(message) => {
            if (message) onImageUploadError(message);
          }}
          onUploaded={onImageUploaded}
        />
        <FormField label="Existing image URL or local path">
          <input type="text" name="image" value={imageValue} onChange={(event) => onImageUrlChange(event.target.value)} className={adminInputClassName} />
        </FormField>
      </div>
    </div>
  </section>
);
