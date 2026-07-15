"use client";

import { useRef, useState } from "react";
import { ClipboardList } from "lucide-react";
import {
  FormField,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/common/FormField";
import ModalShell from "@/components/ui/ModalShell";

import { updateCaseStatusAction } from "@/actions/admin/cases/case-actions";
import type { CaseStatus } from "@/lib/admin/domain";
import { formatLabel } from "@/lib/pet-format";

type CaseStatusModalProps = {
  caseId: string;
  currentStatus: CaseStatus;
};

const statusOptions: CaseStatus[] = [
  "new",
  "open",
  "waiting_on_contact",
  "waiting_on_staff",
  "screening",
  "scheduled",
  "approved",
  "declined",
  "completed",
  "closed",
  "cancelled",
];

export default function CaseStatusModal({
  caseId,
  currentStatus,
}: CaseStatusModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAction = async (formData: FormData) => {
    await updateCaseStatusAction(caseId, formData);
    formRef.current?.reset();
    closeModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-input"
      >
        <ClipboardList className="h-4 w-4" aria-hidden="true" />
        Change status
      </button>

      <ModalShell
        isOpen={isOpen}
        onClose={closeModal}
        title="Change case status"
        description="Move this case to a new handling state."
        closeLabel="Close status modal"
        size="sm"
      >
        <form ref={formRef} action={handleAction} className="space-y-4">
          <input type="hidden" name="currentStatus" value={currentStatus} />

          <div className="rounded-xl border border-border bg-input p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Current status
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatLabel(currentStatus)}
            </p>
          </div>

          <FormField label="New status">
            <select
              name="status"
              defaultValue={currentStatus}
              className={adminInputClassName}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Outcome / note">
            <textarea
              name="outcome"
              rows={4}
              placeholder="Required when closing the case; otherwise optional..."
              className={adminTextareaClassName}
            />
          </FormField>

          <div className="flex flex-col gap-3 pt-3 sm:flex-row">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 cursor-pointer rounded-lg border border-border bg-white px-4 py-2.5 font-semibold text-foreground transition-colors hover:bg-input"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-4 py-2.5 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
            >
              Save new status
            </button>
          </div>
        </form>
      </ModalShell>
    </>
  );
}
