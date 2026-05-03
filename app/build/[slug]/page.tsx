import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import BuildShowcase from '@/components/build/BuildShowcase'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BuildPage({ params }: Props) {
  const { slug } = await params

  const build = await prisma.build.findUnique({
    where: { slug },
    include: {
      buildParts: {
        include: {
          part: { include: { category: true } },
        },
      },
    },
  })

  if (!build || !build.isPublic) notFound()

  return <BuildShowcase build={build as any} />
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const build = await prisma.build.findUnique({ where: { slug } })
  if (!build) return {}
  return {
    title: `${build.name} – RigMate AU`,
    description: `Check out this ${build.purpose ?? 'PC build'} on RigMate AU`,
  }
}
