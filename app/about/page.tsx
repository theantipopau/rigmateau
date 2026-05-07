import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, HeartHandshake, Code2, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'About - RigMate AU',
  description: 'About RigMate AU, the developer, and how to support ongoing development.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-white/10 px-4">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/headerlogo.PNG" alt="RigMate AU" width={200} height={44} className="h-11 w-auto" priority />
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="https://www.tinyurl.com/omencoredonate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 transition-colors hover:bg-emerald-500/20"
            >
              <HeartHandshake className="h-4 w-4" />
              Donate
            </a>
            <Link href="/builder" className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-sm text-white transition-colors hover:bg-orange-500">
              Start Building <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-4 py-2 text-sm text-blue-300">
            <Code2 className="h-4 w-4" />
            About RigMate AU
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Built for AU PC builders</h1>

          <p className="max-w-3xl text-lg leading-relaxed text-gray-300">
            RigMate AU helps you design compatible builds, compare landed pricing across AU channels,
            and share polished build pages with confidence.
          </p>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-gray-500">Developer</p>
              <a
                href="https://matthurley.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-lg font-semibold text-blue-300 hover:text-blue-200"
              >
                matthurley.dev
                <ExternalLink className="h-4 w-4" />
              </a>
              <p className="text-sm text-gray-400">Designed and maintained by Matt Hurley.</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-gray-500">Support The Project</p>
              <a
                href="https://www.tinyurl.com/omencoredonate"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
              >
                <HeartHandshake className="h-4 w-4" />
                Donate
                <ExternalLink className="h-4 w-4" />
              </a>
              <p className="text-sm text-gray-400">Donations help fund updates, catalog growth, and hosting.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
