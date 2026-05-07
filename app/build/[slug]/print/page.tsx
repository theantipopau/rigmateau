import { notFound } from 'next/navigation'
import AutoPrint from '@/components/build/AutoPrint'
import BuildPrintView from '@/components/build/BuildPrintView'
import { getBuildExportSnapshot } from '@/lib/builds/export'
import { IS_GITHUB_PAGES } from '@/lib/runtime/deploy'
import { getStaticSampleBuildBySlug, STATIC_SAMPLE_BUILDS } from '@/lib/static/builds'

export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BuildPrintPage({ params }: Props) {
  const { slug } = await params
  const staticBuild = getStaticSampleBuildBySlug(slug)

  if (staticBuild) {
    const snapshot = await getBuildExportSnapshot(staticBuild)

    return (
      <>
        <AutoPrint />
        <BuildPrintView build={staticBuild} snapshot={snapshot} />
      </>
    )
  }

  const build = IS_GITHUB_PAGES
    ? null
    : await (async () => {
        const { getDb } = await import('@/lib/db')
        const db = await getDb()
        return db.build.findUnique({ where: { slug } })
      })()

  if (!build || !build.isPublic) {
    notFound()
  }

  const snapshot = await getBuildExportSnapshot(build)

  return (
    <>
      <AutoPrint />
      <BuildPrintView build={build} snapshot={snapshot} />
    </>
  )
}

export async function generateStaticParams() {
  return STATIC_SAMPLE_BUILDS.map((build) => ({ slug: build.slug }))
}
