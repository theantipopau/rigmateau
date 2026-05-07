import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BuildShowcase from '@/components/build/BuildShowcase'
import { IS_GITHUB_PAGES } from '@/lib/runtime/deploy'
import { getStaticSampleBuildBySlug, STATIC_SAMPLE_BUILDS } from '@/lib/static/builds'

export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BuildPage({ params }: Props) {
  const { slug } = await params

  const staticBuild = getStaticSampleBuildBySlug(slug)

  if (IS_GITHUB_PAGES) {
    if (!staticBuild) {
      notFound()
    }
    return <BuildShowcase build={staticBuild} />
  }

  const { getDb } = await import('@/lib/db')
  const db = await getDb()
  const build = await db.build.findUnique({ where: { slug } })

  if (!build || !build.isPublic) {
    if (staticBuild) {
      return <BuildShowcase build={staticBuild} />
    }
    notFound()
  }

  return <BuildShowcase build={build} />
}

export async function generateStaticParams() {
  return STATIC_SAMPLE_BUILDS.map((build) => ({ slug: build.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const staticBuild = getStaticSampleBuildBySlug(slug)

  if (IS_GITHUB_PAGES) {
    if (!staticBuild) {
      return {}
    }
    return {
      title: `${staticBuild.name} - RigMate AU`,
      description: `Check out this ${staticBuild.purpose ?? 'PC build'} on RigMate AU`,
    }
  }

  const { getDb } = await import('@/lib/db')
  const db = await getDb()
  const build = await db.build.findUnique({ where: { slug } })

  if (!build) {
    if (staticBuild) {
      return {
        title: `${staticBuild.name} - RigMate AU`,
        description: `Check out this ${staticBuild.purpose ?? 'PC build'} on RigMate AU`,
      }
    }
    return {}
  }

  return {
    title: `${build.name} - RigMate AU`,
    description: `Check out this ${build.purpose ?? 'PC build'} on RigMate AU`,
  }
}
