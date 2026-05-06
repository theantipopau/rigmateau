import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import BuildShowcase from '@/components/build/BuildShowcase'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BuildPage({ params }: Props) {
  const { slug } = await params
  const db = await getDb()
  const build = await db.build.findUnique({ where: { slug } })

  if (!build || !build.isPublic) {
    notFound()
  }

  return <BuildShowcase build={build} />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const db = await getDb()
  const build = await db.build.findUnique({ where: { slug } })

  if (!build) {
    return {}
  }

  return {
    title: `${build.name} - RigMate AU`,
    description: `Check out this ${build.purpose ?? 'PC build'} on RigMate AU`,
  }
}
