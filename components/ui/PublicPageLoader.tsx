import Image from 'next/image'

export default function PublicPageLoader() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 grid min-h-dvh w-screen place-items-center bg-background"
      aria-busy="true"
      aria-label="Loading page"
      role="status"
    >
      <div className="public-loader-perspective h-24 w-24 sm:h-28 sm:w-28">
        <div className="public-loader-coin relative h-full w-full">
          <Image
            src="/apple-icon.png"
            alt=""
            fill
            priority
            sizes="112px"
            className="public-loader-face bg-transparent object-contain"
          />
          <Image
            src="/apple-icon.png"
            alt=""
            fill
            priority
            sizes="112px"
            className="public-loader-face public-loader-face-back bg-transparent object-contain"
          />
        </div>
      </div>
      <span className="sr-only">Loading page</span>
    </div>
  )
}
