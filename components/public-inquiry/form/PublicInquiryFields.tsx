import type { PublicInquiryFieldsProps } from './public-inquiry-types'

const inputClassName =
  'w-full rounded-lg border border-border bg-white px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary'

export const PublicInquiryFields = ({
  formData,
  updateField,
  showPhone,
  showSubject,
  showAvailability,
  messageLabel,
  messagePlaceholder,
  isMessageRequired,
}: PublicInquiryFieldsProps) => (
  <>
    <div className="hidden">
      <label>
        Company
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.honeypot}
          onChange={(event) => updateField('honeypot', event.target.value)}
        />
      </label>
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Your Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(event) => updateField('name', event.target.value)}
          className={inputClassName}
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Email Address</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(event) => updateField('email', event.target.value)}
          className={inputClassName}
          placeholder="john@example.com"
        />
      </div>
    </div>

    {(showPhone || showSubject) && (
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {showPhone && (
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              className={inputClassName}
              placeholder="+30 210 000 0000"
            />
          </div>
        )}

        {showSubject && (
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(event) => updateField('subject', event.target.value)}
              className={inputClassName}
              placeholder="How can we help?"
            />
          </div>
        )}
      </div>
    )}

    {showAvailability && (
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-foreground">
          Availability / Preferred Volunteer Role
        </label>
        <input
          type="text"
          value={formData.availability}
          onChange={(event) => updateField('availability', event.target.value)}
          className={inputClassName}
          placeholder="Weekends, events, fostering, admin support..."
        />
      </div>
    )}

    <div className="mt-4">
      <label className="mb-2 block text-sm font-medium text-foreground">{messageLabel}</label>
      <textarea
        required={isMessageRequired}
        value={formData.message}
        onChange={(event) => updateField('message', event.target.value)}
        className="min-h-28 w-full resize-none rounded-lg border border-border bg-white px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:min-h-32"
        placeholder={messagePlaceholder}
      />
    </div>
  </>
)
