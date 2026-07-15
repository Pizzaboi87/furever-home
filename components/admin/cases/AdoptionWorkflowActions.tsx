"use client";

import { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  HeartHandshake,
  XCircle,
} from "lucide-react";

import { runAdoptionWorkflowAction } from "@/actions/admin/cases/case-actions";
import ModalShell from "@/components/ui/ModalShell";
import type { CaseStatus } from "@/lib/admin/domain";

type AdoptionWorkflowActionsProps = {
  caseId: string;
  currentStatus: CaseStatus;
  petId?: string | null;
  petStatus?: string | null;
};

const actions = [
  {
    id: "schedule_meet_and_greet",
    label: "Schedule visit",
    description: "Set the next in-person step.",
    icon: CalendarClock,
  },
  {
    id: "approve_application",
    label: "Approve",
    description: "Approve this application.",
    icon: CheckCircle2,
  },
  {
    id: "decline_application",
    label: "Decline",
    description: "Decline with staff context.",
    icon: XCircle,
  },
  {
    id: "complete_adoption",
    label: "Complete adoption",
    description: "Finalize and mark pet adopted.",
    icon: HeartHandshake,
  },
] as const;

export default function AdoptionWorkflowActions({
  caseId,
  currentStatus,
  petId,
  petStatus,
}: AdoptionWorkflowActionsProps) {
  const [pendingAction, setPendingAction] = useState<
    (typeof actions)[number] | null
  >(null);

  const closeModal = () => {
    setPendingAction(null);
  };

  const handleAction = async (formData: FormData) => {
    await runAdoptionWorkflowAction(caseId, formData);
    closeModal();
  };

  return (
    <>
      <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Adoption workflow actions
      </h3>

      <div className="mt-3 mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 2xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => setPendingAction(action)}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-white p-3 text-left transition-all duration-300 ease-in-out hover:border-primary hover:bg-indigo-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-bold text-foreground">
                  {action.label}
                </span>

                <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                  {action.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <ModalShell
        isOpen={Boolean(pendingAction)}
        onClose={closeModal}
        title={pendingAction?.label ?? "Adoption workflow action"}
        description={pendingAction?.description}
        closeLabel="Close adoption workflow modal"
      >
        {pendingAction ? (
          <form action={handleAction} className="space-y-4">
            <input type="hidden" name="action" value={pendingAction.id} />
            <input type="hidden" name="currentStatus" value={currentStatus} />
            <input type="hidden" name="petId" value={petId ?? ""} />
            <input type="hidden" name="petStatus" value={petStatus ?? ""} />

            <label className="block text-sm font-semibold text-foreground">
              Staff note
              <textarea
                name="note"
                rows={4}
                placeholder="Optional: add context for this workflow decision..."
                className="mt-2 w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-sm font-normal leading-6 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>

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
                Confirm action
              </button>
            </div>
          </form>
        ) : null}
      </ModalShell>
    </>
  );
}
