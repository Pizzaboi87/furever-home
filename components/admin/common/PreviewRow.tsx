type PreviewRowValue = string | number | boolean | null | undefined

type PreviewRowProps = {
    label: string
    value: PreviewRowValue
    emptyLabel?: string
}

const formatPreviewValue = (value: PreviewRowValue, emptyLabel: string) => {
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No'
    }

    return value || emptyLabel
}

export function PreviewRow({ label, value, emptyLabel = 'Not captured' }: PreviewRowProps) {
    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 wrap-break-word text-sm font-semibold text-foreground">
                {formatPreviewValue(value, emptyLabel)}
            </p>
        </div>
    )
}
