'use client'

import Image from 'next/image'

export default function ImageCard({ fileUrl }: { fileUrl: string }) {
  return (
    <div className="rounded-lg border bg-white p-3 shadow-sm">
      <div className="relative h-48 w-full overflow-hidden rounded">
        <Image src={fileUrl} alt="Generated" fill className="object-cover" />
      </div>
      <div className="mt-2 flex gap-2">
        <a className="btn-secondary w-full text-center" href={fileUrl} download>
          Download
        </a>
        <button className="btn-secondary w-full" onClick={() => navigator.clipboard.writeText(window.location.origin + fileUrl)}>
          Copy link
        </button>
      </div>
    </div>
  )
}
