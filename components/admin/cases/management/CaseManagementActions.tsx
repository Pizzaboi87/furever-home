type CaseManagementActionsProps = {
    onCancel: () => void
}

const CaseManagementActions = ({ onCancel }: CaseManagementActionsProps) => (
    <div className="flex flex-col gap-3 pt-3 sm:flex-row">
        <button
            type="button"
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-lg border border-border bg-white px-4 py-2.5 font-semibold text-foreground transition-colors hover:bg-input"
        >
            Cancel
        </button>

        <button
            type="submit"
            className="flex-1 cursor-pointer rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-4 py-2.5 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-105"
        >
            Save case
        </button>
    </div>
)

export default CaseManagementActions
