type ModalSuccessStateProps = {
  title: string
  message: string
  icon?: string
}

export default function ModalSuccessState({
  title,
  message,
  icon = '✓',
}: ModalSuccessStateProps) {
  return (
    <div className="mx-auto flex min-h-56 w-full max-w-sm flex-col items-center justify-center rounded-3xl border border-primary/20 bg-white px-7 py-8 text-center shadow-[0_24px_80px_rgba(25,20,64,0.35)] ring-1 ring-white/70">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#ece9ff] text-2xl font-bold text-primary ring-8 ring-[#f7f5ff]">
        {icon}
      </div>
      <h2 className="mb-3 text-2xl font-bold text-foreground">{title}</h2>
      <p className="text-base leading-relaxed text-foreground/80">{message}</p>
    </div>
  )
}
