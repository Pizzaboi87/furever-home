import { ActionButton } from '@/components/ui/ActionButton'

import type { PublicInquiryActionsProps } from './public-inquiry-types'

export const PublicInquiryActions = ({
  submitLabel,
  cancelLabel,
  onCancel,
  isSubmitting,
}: PublicInquiryActionsProps) => (
  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
    {onCancel && cancelLabel ? (
      <ActionButton
        type="button"
        variant="secondary"
        fullWidth
        onClick={onCancel}
        disabled={isSubmitting}
        className="hover:scale-[1.02]"
      >
        {cancelLabel}
      </ActionButton>
    ) : null}

    <ActionButton
      type="submit"
      disabled={isSubmitting}
      fullWidth={Boolean(onCancel && cancelLabel)}
      className="hover:scale-[1.02]"
    >
      {isSubmitting ? 'Sending...' : submitLabel}
    </ActionButton>
  </div>
)
