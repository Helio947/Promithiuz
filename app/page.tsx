import Link from 'next/link'

const steps = [
  'Upload both parents and pick age ranges.',
  'We mix and imagine a playful composite.',
  'Download and share the fun results instantly.',
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="mb-2 text-sm font-semibold text-primary">Entertainment only</p>
        <h1 className="text-4xl font-bold">Imagine your future baby—just for fun</h1>
        <p className="mt-4 text-lg text-gray-600">
          FutureBaby creates playful, AI-generated images showing what your little one could look like at different stages.
          No genetics, just delightful imagination.
        </p>
        <div className="mt-6 flex gap-4">
          <Link className="btn-primary" href="/create">
            Generate our future baby
          </Link>
          <Link className="btn-secondary" href="/dashboard">
            View dashboard
          </Link>
        </div>
        <p className="mt-4 text-sm text-red-600">
          Disclaimer: These images are AI-generated approximations for entertainment only and are not genetically accurate
          predictions.
        </p>
      </section>

      <section className="grid gap-6 rounded-2xl bg-white p-6 shadow md:grid-cols-3">
        {steps.map((step, idx) => (
          <div key={idx} className="rounded-xl border p-4">
            <div className="mb-2 text-sm font-semibold text-primary">Step {idx + 1}</div>
            <p className="text-gray-700">{step}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
