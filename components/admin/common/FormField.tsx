import type { ReactNode } from 'react'

type FormFieldProps = {
  label: ReactNode
  children: ReactNode
  hint?: ReactNode
  className?: string
}

const joinClassNames = (
  ...classNames: Array<string | false | null | undefined>
) => {
  return classNames.filter(Boolean).join(' ')
}

export const adminInputClassName =
  'mt-2 w-full rounded-xl border border-border bg-input px-3 py-2.5 font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export const adminTextareaClassName =
  'mt-2 w-full resize-none rounded-xl border border-border bg-input px-3 py-2.5 font-normal leading-6 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export function FormField({
  label,
  children,
  hint,
  className,
}: FormFieldProps) {
  return (
    <label
      className={joinClassNames(
        'text-sm font-semibold text-foreground',
        className,
      )}
    >
      {label}
      {children}
      {hint ? (
        <span className="mt-2 block text-xs font-normal text-muted-foreground">
          {hint}
        </span>
      ) : null}
    </label>
  )
}
