"use client";

import toast from "react-hot-toast";
import { type FormEvent, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import DangerZone from "@/components/admin/common/DangerZone";
import { ActionButton } from "@/components/ui/ActionButton";
import type {
  AdminPet,
  AdminPetActivityItem,
  AdminPetCase,
} from "@/lib/admin/domain";
import { formatLabel, normalizeValue } from "@/lib/pet-format";
import Header from "@/components/admin/common/Header";
import { PetDetailSidebar } from "@/components/admin/pets/PetDetailSidebar";
import { PetDetailEditForm } from "@/components/admin/pets/PetDetailEditForm";
import { activePetDetailCaseStatuses } from "@/utils/admin/pets/pet-detail-utils";
import {
  deletePetAction,
  unpublishPetAction,
  updatePetAction,
} from "@/actions/admin/pets/pet-actions";

type PetDetailClientProps = {
  pet: AdminPet;
  cases: AdminPetCase[];
  activity: AdminPetActivityItem[];
  speciesValues: string[];
  genderValues: string[];
  statusValues: string[];
  sizeValues: string[];
  ageGroupValues: string[];
};

export default function PetDetailClient({
  pet,
  cases,
  activity,
  speciesValues,
  genderValues,
  statusValues,
  sizeValues,
  ageGroupValues,
}: PetDetailClientProps) {
  const [currentPet, setCurrentPet] = useState(pet);
  const [imageValue, setImageValue] = useState(pet.image);
  const [imageCloudinaryPublicId, setImageCloudinaryPublicId] = useState(
    pet.imageCloudinaryPublicId ?? "",
  );
  const [imageThumbnailUrl, setImageThumbnailUrl] = useState(
    pet.images?.find((image) => image.isPrimary)?.thumbnailUrl ?? "",
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isSaving, startSavingTransition] = useTransition();

  const openCases = cases.filter((item) =>
    activePetDetailCaseStatuses.includes(item.status),
  ).length;
  const totalApplications = cases.length || currentPet.applications || 0;
  const lastActivityDate = activity[0]?.createdAt ?? currentPet.lastUpdated;

  const handleResetNotice = () => {
    setSaveError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleResetNotice();

    const formData = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const publicationAction =
      submitter?.value === "publish" ? "publish" : "keep";

    startSavingTransition(() => {
      void (async () => {
        try {
          const updatedPet = await updatePetAction({
            petId: currentPet.id,
            name: String(formData.get("name") ?? ""),
            species: String(formData.get("species") ?? ""),
            description: String(formData.get("description") ?? ""),
            age: Number(formData.get("age") ?? 0),
            gender: String(formData.get("gender") ?? ""),
            weight: Number(formData.get("weight") ?? 0),
            image: imageValue,
            imageCloudinaryPublicId: imageCloudinaryPublicId || undefined,
            imageThumbnailUrl: imageThumbnailUrl || undefined,
            imageAlt: `${String(formData.get("name") ?? currentPet.name).trim()} the ${String(formData.get("species") ?? currentPet.species)}`,
            status: String(
              formData.get("status") ?? currentPet.status,
            ) as AdminPet["status"],
            size: String(formData.get("size") ?? "") || undefined,
            neutered: formData.get("neutered") === "on",
            goodWithChildren: formData.get("goodWithChildren") === "on",
            goodWithOtherAnimals: formData.get("goodWithOtherAnimals") === "on",
            applications: currentPet.applications ?? 0,
            ageGroup: String(formData.get("ageGroup") ?? "") || undefined,
            daysInShelter: Number(formData.get("daysInShelter") ?? 0),
            lastUpdated: String(formData.get("lastUpdated") ?? "") || undefined,
            publicationAction,
          });

          setCurrentPet(updatedPet);
          setImageValue(updatedPet.image);
          setImageCloudinaryPublicId(updatedPet.imageCloudinaryPublicId ?? "");
          setImageThumbnailUrl(
            updatedPet.images?.find((image) => image.isPrimary)?.thumbnailUrl ??
              "",
          );
          toast.success("Pet profile saved.");
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Pet profile could not be saved.";

          setSaveError(message);
          toast.error(message);
        }
      })();
    });
  };

  const isPubliclyVisible =
    Boolean(currentPet.isPublished) &&
    !["adopted", "hidden", "unavailable"].includes(
      normalizeValue(currentPet.status),
    );
  const publicListingLabel = isPubliclyVisible ? "Visible" : "Hidden";
  const publicStatusLabel = currentPet.isPublished ? "Published" : "Draft";

  const handleUnpublish = () => {
    handleResetNotice();

    startSavingTransition(() => {
      void (async () => {
        try {
          const updatedPet = await unpublishPetAction(currentPet.id);

          setCurrentPet(updatedPet);
          toast.success("Pet unpublished from the public site.");
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Pet could not be unpublished.";

          setSaveError(message);
          toast.error(message);
        }
      })();
    });
  };

  const canDeletePet = deleteConfirmation.trim() === currentPet.name;

  const handleDeletePet = () => {
    handleResetNotice();

    if (!canDeletePet) {
      const message = `Type ${currentPet.name} to confirm permanent deletion.`;

      setSaveError(message);
      toast.error(message);
      return;
    }

    startSavingTransition(() => {
      void (async () => {
        try {
          await deletePetAction(currentPet.id);
          toast.success(`${currentPet.name} was deleted.`);
          window.location.href = "/admin/pets";
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Pet could not be deleted.";

          setSaveError(message);
          toast.error(message);
        }
      })();
    });
  };

  const renderDangerZone = (className?: string) => (
    <DangerZone
      className={className}
      title="Danger zone"
      description="Permanently delete this pet and its primary image records. This action is not reversible."
      confirmationLabel="Type the pet name to confirm"
      confirmationValue={deleteConfirmation}
      onConfirmationChange={(value) => {
        setDeleteConfirmation(value);
        handleResetNotice();
      }}
      confirmationPlaceholder={currentPet.name}
      action={
        <ActionButton
          type="button"
          variant="danger"
          size="compact"
          onClick={handleDeletePet}
          disabled={isSaving || isUploadingImage || !canDeletePet}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete pet
        </ActionButton>
      }
    />
  );

  return (
    <main className="min-h-screen bg-background">
      <Header
        currentHref="/admin/pets"
        title={currentPet.name}
        description={`${formatLabel(currentPet.species)} · ${currentPet.age} years · ${formatLabel(currentPet.gender)}`}
      />

      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <PetDetailEditForm
            currentPet={currentPet}
            speciesValues={speciesValues}
            genderValues={genderValues}
            statusValues={statusValues}
            sizeValues={sizeValues}
            ageGroupValues={ageGroupValues}
            imageValue={imageValue}
            isSaving={isSaving}
            isUploadingImage={isUploadingImage}
            saveError={saveError}
            isPubliclyVisible={isPubliclyVisible}
            publicListingLabel={publicListingLabel}
            publicStatusLabel={publicStatusLabel}
            onSubmit={handleSubmit}
            onResetNotice={handleResetNotice}
            onUnpublish={handleUnpublish}
            onUploadingChange={setIsUploadingImage}
            onImageUploadError={(message) => {
              if (message) {
                setSaveError(message);
              }
            }}
            onImageUploaded={(uploadedImage) => {
              setImageValue(uploadedImage.secureUrl);
              setImageCloudinaryPublicId(uploadedImage.cloudinaryPublicId);
              setImageThumbnailUrl(
                uploadedImage.thumbnailUrl ?? uploadedImage.secureUrl,
              );
              handleResetNotice();
            }}
            onImageUrlChange={(value) => {
              setImageValue(value);
              setImageCloudinaryPublicId("");
              setImageThumbnailUrl("");
              handleResetNotice();
            }}
          />

          {renderDangerZone("hidden xl:block")}
        </div>

        <PetDetailSidebar
          petId={currentPet.id}
          cases={cases}
          activity={activity}
          openCases={openCases}
          totalApplications={totalApplications}
          lastActivityDate={lastActivityDate}
        />

        <div className="xl:hidden">{renderDangerZone()}</div>
      </div>
    </main>
  );
}
