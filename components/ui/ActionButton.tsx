import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

type ActionButtonVariant = 'primary' | 'primarySolid' | 'secondary' | 'secondaryWarm' | 'danger'
type ActionButtonSize = 'sm' | 'md' | 'compact'

type ActionButtonVisualProps = {
    variant?: ActionButtonVariant
    size?: ActionButtonSize
    fullWidth?: boolean
}

export type ActionButtonProps = ComponentPropsWithoutRef<'button'> & ActionButtonVisualProps
export type ActionLinkProps = ComponentPropsWithoutRef<typeof Link> & ActionButtonVisualProps

const joinClassNames = (...classNames: Array<string | false | null | undefined>) => {
    return classNames.filter(Boolean).join(' ')
}

const baseClassName =
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100'

const variantClassNames: Record<ActionButtonVariant, string> = {
    primary:
        'bg-linear-to-r from-[#5f57e7] to-primary text-primary-foreground hover:brightness-105 disabled:opacity-60',
    primarySolid: 'bg-primary text-primary-foreground hover:bg-opacity-90 disabled:opacity-50',
    secondary:
        'border border-border bg-white text-foreground hover:border-primary hover:bg-indigo-50 disabled:opacity-60',
    secondaryWarm:
        'border border-border bg-secondary text-[#1E1B4B] hover:border-primary hover:bg-indigo-50 hover:bg-opacity-90 disabled:opacity-60',
    danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50',
}

const sizeClassNames: Record<ActionButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3',
    compact: 'px-5 py-1.5',
}

const getActionClassName = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
}: ActionButtonVisualProps & { className?: string }) => {
    return joinClassNames(
        baseClassName,
        variantClassNames[variant],
        sizeClassNames[size],
        fullWidth && 'w-full',
        className,
    )
}

export function ActionButton({
    variant,
    size,
    fullWidth,
    className,
    ...props
}: ActionButtonProps) {
    return (
        <button
            className={getActionClassName({ variant, size, fullWidth, className })}
            {...props}
        />
    )
}

export function ActionLink({
    variant,
    size,
    fullWidth,
    className,
    ...props
}: ActionLinkProps) {
    return (
        <Link
            className={getActionClassName({ variant, size, fullWidth, className })}
            {...props}
        />
    )
}
