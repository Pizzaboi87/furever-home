import type { ReactNode } from 'react'

type SectionHeadingProps = {
    children: ReactNode
    icon?: ReactNode
    className?: string
}

const joinClassNames = (...classNames: Array<string | false | null | undefined>) => {
    return classNames.filter(Boolean).join(' ')
}

export function SectionHeading({ children, icon, className }: SectionHeadingProps) {
    return (
        <h3
            className={joinClassNames(
                'mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground',
                className,
            )}
        >
            {icon}
            {children}
        </h3>
    )
}
