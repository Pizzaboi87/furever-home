"use client";

import { Eye, EyeOff, Save } from "lucide-react";

import { ActionButton } from "@/components/ui/ActionButton";

type PetEditActionsProps = {
  isPubliclyVisible: boolean;
  publicListingLabel: string;
  publicStatusLabel: string;
  isSaving: boolean;
  isUploadingImage: boolean;
  onUnpublish: () => void;
};

export const PetEditActions = ({
  isPubliclyVisible,
  publicListingLabel,
  publicStatusLabel,
  isSaving,
  isUploadingImage,
  onUnpublish,
}: PetEditActionsProps) => (
  <div className="border-t border-border pt-6">
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-border bg-input p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {isPubliclyVisible ? (
          <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
        ) : (
          <EyeOff className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        )}
        <div>
          <p className="font-bold text-foreground">Public visibility</p>
          <p className="text-muted-foreground">Listing: {publicListingLabel} · Status: {publicStatusLabel}</p>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <ActionButton type="button" variant="secondary" onClick={onUnpublish} disabled={isSaving || isUploadingImage || !isPubliclyVisible}>
        <EyeOff className="h-4 w-4" aria-hidden="true" />
        Unpublish
      </ActionButton>
      <ActionButton type="submit" variant="secondary" name="publicationAction" value="keep" disabled={isSaving || isUploadingImage}>
        <Save className="h-4 w-4" aria-hidden="true" />
        {isSaving ? "Saving..." : "Save changes"}
      </ActionButton>
      <ActionButton type="submit" name="publicationAction" value="publish" disabled={isSaving || isUploadingImage}>
        <Eye className="h-4 w-4" aria-hidden="true" />
        {isSaving ? "Publishing..." : "Save and publish"}
      </ActionButton>
    </div>
  </div>
);
