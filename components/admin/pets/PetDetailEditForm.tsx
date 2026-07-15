"use client";

import type { FormEvent } from "react";

import SectionCard from "@/components/admin/common/SectionCard";
import type { UploadedPetImageResponse } from "@/components/admin/pets/PetImageUploadCropper";
import { PetEditActions } from "@/components/admin/pets/edit/PetEditActions";
import {
  PetEditBasicSection,
  PetEditHomeFitSection,
  PetEditJourneySection,
  PetEditMediaSection,
  PetEditPhysicalSection,
  PetEditStorySection,
} from "@/components/admin/pets/edit/PetEditSections";
import type { AdminPet } from "@/lib/admin/domain";
import {
  badgeBaseClassName,
  getPetStatusBadgeClassName,
} from "@/utils/admin/badge-styles";
import { formatLabel } from "@/lib/pet-format";

type PetDetailEditFormProps = {
  currentPet: AdminPet;
  speciesValues: string[];
  genderValues: string[];
  statusValues: string[];
  sizeValues: string[];
  ageGroupValues: string[];
  imageValue: string;
  isSaving: boolean;
  isUploadingImage: boolean;
  saveError: string;
  isPubliclyVisible: boolean;
  publicListingLabel: string;
  publicStatusLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onResetNotice: () => void;
  onUnpublish: () => void;
  onUploadingChange: (isUploading: boolean) => void;
  onImageUploadError: (message: string) => void;
  onImageUploaded: (uploadedImage: UploadedPetImageResponse) => void;
  onImageUrlChange: (value: string) => void;
};

export function PetDetailEditForm({
  currentPet,
  speciesValues,
  genderValues,
  statusValues,
  sizeValues,
  ageGroupValues,
  imageValue,
  isSaving,
  isUploadingImage,
  saveError,
  isPubliclyVisible,
  publicListingLabel,
  publicStatusLabel,
  onSubmit,
  onResetNotice,
  onUnpublish,
  onUploadingChange,
  onImageUploadError,
  onImageUploaded,
  onImageUrlChange,
}: PetDetailEditFormProps) {
  return (
    <SectionCard padding="md">
      <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Edit pet profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">Update the public profile, adoption fit, shelter journey, and media details.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`${badgeBaseClassName} ${getPetStatusBadgeClassName(currentPet.status)}`}>{formatLabel(currentPet.status)}</span>
          {saveError && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{saveError}</div>}
        </div>
      </div>

      <form
        key={`${currentPet.id}-${currentPet.status}-${currentPet.isPublished}-${currentPet.hiddenAt ?? "visible"}`}
        className="space-y-8"
        onSubmit={onSubmit}
      >
        <PetEditBasicSection currentPet={currentPet} speciesValues={speciesValues} genderValues={genderValues} statusValues={statusValues} onChange={onResetNotice} />
        <PetEditPhysicalSection currentPet={currentPet} ageGroupValues={ageGroupValues} sizeValues={sizeValues} onChange={onResetNotice} />
        <PetEditHomeFitSection currentPet={currentPet} onChange={onResetNotice} />
        <PetEditJourneySection currentPet={currentPet} onChange={onResetNotice} />
        <PetEditStorySection currentPet={currentPet} onChange={onResetNotice} />
        <PetEditMediaSection
          currentPet={currentPet}
          imageValue={imageValue}
          isSaving={isSaving}
          onUploadingChange={onUploadingChange}
          onImageUploadError={onImageUploadError}
          onImageUploaded={onImageUploaded}
          onImageUrlChange={onImageUrlChange}
        />
        <PetEditActions
          isPubliclyVisible={isPubliclyVisible}
          publicListingLabel={publicListingLabel}
          publicStatusLabel={publicStatusLabel}
          isSaving={isSaving}
          isUploadingImage={isUploadingImage}
          onUnpublish={onUnpublish}
        />
      </form>
    </SectionCard>
  );
}
