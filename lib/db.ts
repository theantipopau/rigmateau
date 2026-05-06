import { randomUUID } from 'node:crypto'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient, type Prisma } from '@/app/generated/prisma'
import type { Category, PartWithCategory, SavedBuild, SavedBuildPart } from '@/lib/types'

type PartSearchClause = {
  name?: { contains: string }
  brand?: { contains: string }
  model?: { contains: string }
}

type PartWhereInput = {
  id?: { in: string[] }
  category?: { slug?: string }
  OR?: PartSearchClause[]
  socketFilter?: string
  formFactorIn?: string[]
  ramTypeFilter?: string
  maxHeightMm?: number
  maxLengthMm?: number
  psuFormFactorFilter?: string
}

type BuildLookup = {
  id?: string
  slug?: string
}

type BuildPartCreateInput = {
  partId: string
  quantity?: number
}

type BuildCreateInput = {
  slug: string
  name: string
  purpose?: string | null
  isPublic: boolean
  buildParts?: {
    create?: BuildPartCreateInput[]
  }
}

type D1QueryResult<T> = {
  results?: T[]
}

type D1PreparedStatementLike = {
  bind(...values: unknown[]): D1PreparedStatementLike
  all<T>(): Promise<D1QueryResult<T>>
  run(): Promise<unknown>
}

type D1DatabaseLike = {
  prepare(query: string): D1PreparedStatementLike
}

export interface DbClient {
  part: {
    findMany(args?: { where?: PartWhereInput }): Promise<PartWithCategory[]>
    findUnique(args: { where: { id?: string } }): Promise<PartWithCategory | null>
  }
  build: {
    create(args: { data: BuildCreateInput }): Promise<SavedBuild>
    findUnique(args: { where: BuildLookup }): Promise<SavedBuild | null>
  }
}

type D1Row = Record<string, unknown>
type CloudflareContextResult = {
  env?: {
    DB?: D1DatabaseLike
  }
}

type PrismaPartWithCategory = Prisma.PartGetPayload<{
  include: { category: true }
}>

type PrismaBuildWithParts = Prisma.BuildGetPayload<{
  include: {
    buildParts: {
      include: {
        part: {
          include: { category: true }
        }
      }
    }
  }
}>

const globalForPrisma = globalThis as { _devPrisma?: PrismaClient }

function boolFromSql(value: unknown): boolean {
  return value === true || value === 1 || value === '1'
}

function numberOrUndefined(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function toCategory(row: {
  id: string
  slug: string
  name: string
  safeImport: boolean
}): Category {
  return {
    id: row.id,
    slug: row.slug as Category['slug'],
    name: row.name,
    safeImport: row.safeImport,
  }
}

function normalizePrismaPart(part: PrismaPartWithCategory): PartWithCategory {
  return {
    id: part.id,
    categoryId: part.categoryId,
    category: toCategory({
      id: part.category.id,
      slug: part.category.slug,
      name: part.category.name,
      safeImport: part.category.safeImport,
    }),
    name: part.name,
    brand: part.brand,
    model: part.model,
    sku: part.sku ?? undefined,
    imageUrl: part.imageUrl ?? undefined,
    description: part.description ?? undefined,
    socket: part.socket ?? undefined,
    chipset: part.chipset ?? undefined,
    ramType: part.ramType ?? undefined,
    ramSlots: part.ramSlots ?? undefined,
    maxRamGb: part.maxRamGb ?? undefined,
    formFactor: part.formFactor ?? undefined,
    lengthMm: part.lengthMm ?? undefined,
    heightMm: part.heightMm ?? undefined,
    widthMm: part.widthMm ?? undefined,
    tdpWatts: part.tdpWatts ?? undefined,
    psuWatts: part.psuWatts ?? undefined,
    psuFormFactor: part.psuFormFactor ?? undefined,
    benchmarkScore: part.benchmarkScore ?? undefined,
    fps1080p: part.fps1080p ?? undefined,
    fps1440p: part.fps1440p ?? undefined,
    fps4K: part.fps4K ?? undefined,
    cores: part.cores ?? undefined,
    threads: part.threads ?? undefined,
    boostClockMhz: part.boostClockMhz ?? undefined,
    baseCockMhz: part.baseCockMhz ?? undefined,
    cacheMb: part.cacheMb ?? undefined,
    capacityGb: part.capacityGb ?? undefined,
    speedMhz: part.speedMhz ?? undefined,
  }
}

function mapPartRow(row: D1Row): PartWithCategory {
  return {
    id: String(row.id),
    categoryId: String(row.categoryId),
    category: toCategory({
      id: String(row.category_id),
      slug: String(row.category_slug),
      name: String(row.category_name),
      safeImport: boolFromSql(row.category_safeImport),
    }),
    name: String(row.name),
    brand: String(row.brand),
    model: String(row.model),
    sku: stringOrUndefined(row.sku),
    imageUrl: stringOrUndefined(row.imageUrl),
    description: stringOrUndefined(row.description),
    socket: stringOrUndefined(row.socket),
    chipset: stringOrUndefined(row.chipset),
    ramType: stringOrUndefined(row.ramType),
    ramSlots: numberOrUndefined(row.ramSlots),
    maxRamGb: numberOrUndefined(row.maxRamGb),
    formFactor: stringOrUndefined(row.formFactor),
    lengthMm: numberOrUndefined(row.lengthMm),
    heightMm: numberOrUndefined(row.heightMm),
    widthMm: numberOrUndefined(row.widthMm),
    tdpWatts: numberOrUndefined(row.tdpWatts),
    psuWatts: numberOrUndefined(row.psuWatts),
    psuFormFactor: stringOrUndefined(row.psuFormFactor),
    benchmarkScore: numberOrUndefined(row.benchmarkScore),
    fps1080p: numberOrUndefined(row.fps1080p),
    fps1440p: numberOrUndefined(row.fps1440p),
    fps4K: numberOrUndefined(row.fps4K),
    cores: numberOrUndefined(row.cores),
    threads: numberOrUndefined(row.threads),
    boostClockMhz: numberOrUndefined(row.boostClockMhz),
    baseCockMhz: numberOrUndefined(row.baseCockMhz),
    cacheMb: numberOrUndefined(row.cacheMb),
    capacityGb: numberOrUndefined(row.capacityGb),
    speedMhz: numberOrUndefined(row.speedMhz),
  }
}

function toSavedBuildPart(input: {
  id: string
  partId: string
  quantity?: number | null
  part: PartWithCategory
}): SavedBuildPart {
  return {
    id: input.id,
    partId: input.partId,
    quantity: input.quantity ?? 1,
    part: input.part,
  }
}

function normalizePrismaBuild(build: PrismaBuildWithParts): SavedBuild {
  return {
    id: build.id,
    slug: build.slug,
    name: build.name,
    purpose: build.purpose ?? undefined,
    isPublic: build.isPublic,
    userId: build.userId ?? undefined,
    totalPrice: build.totalPrice ?? undefined,
    estimatedWatts: build.estimatedWatts ?? undefined,
    createdAt: build.createdAt,
    updatedAt: build.updatedAt,
    buildParts: build.buildParts.map((buildPart) =>
      toSavedBuildPart({
        id: buildPart.id,
        partId: buildPart.partId,
        quantity: buildPart.quantity,
        part: normalizePrismaPart(buildPart.part),
      })
    ),
  }
}

function createDevPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db'
  return new PrismaClient({ adapter: new PrismaLibSql({ url }) })
}

function getDevPrisma(): PrismaClient {
  if (!globalForPrisma._devPrisma) {
    globalForPrisma._devPrisma = createDevPrisma()
  }
  return globalForPrisma._devPrisma
}

async function getCloudflareD1(): Promise<D1DatabaseLike | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const { env } = getCloudflareContext() as CloudflareContextResult
    return env?.DB ?? null
  } catch {
    return null
  }
}

function createPartQuery(where: PartWhereInput = {}) {
  const binds: unknown[] = []
  const conditions: string[] = []

  if (Array.isArray(where.id?.in) && where.id.in.length > 0) {
    conditions.push(`p.id IN (${where.id.in.map(() => '?').join(', ')})`)
    binds.push(...where.id.in)
  }

  if (where.category?.slug) {
    conditions.push('c.slug = ?')
    binds.push(where.category.slug)
  }

  if (Array.isArray(where.OR) && where.OR.length > 0) {
    const query =
      where.OR.find((clause) => clause.name?.contains)?.name?.contains ??
      where.OR.find((clause) => clause.brand?.contains)?.brand?.contains ??
      where.OR.find((clause) => clause.model?.contains)?.model?.contains

    if (query) {
      conditions.push(
        '(LOWER(p.name) LIKE LOWER(?) OR LOWER(p.brand) LIKE LOWER(?) OR LOWER(p.model) LIKE LOWER(?))'
      )
      const like = `%${query}%`
      binds.push(like, like, like)
    }
  }

  if (where.socketFilter) {
    conditions.push("(',' || COALESCE(p.socket,'') || ',') LIKE ('%,' || ? || ',%')")
    binds.push(where.socketFilter)
  }

  if (Array.isArray(where.formFactorIn) && where.formFactorIn.length > 0) {
    conditions.push(`p.formFactor IN (${where.formFactorIn.map(() => '?').join(', ')})`)
    binds.push(...where.formFactorIn)
  }

  if (where.ramTypeFilter) {
    conditions.push('p.ramType = ?')
    binds.push(where.ramTypeFilter)
  }

  if (typeof where.maxHeightMm === 'number') {
    conditions.push('p.heightMm <= ?')
    binds.push(where.maxHeightMm)
  }

  if (typeof where.maxLengthMm === 'number') {
    conditions.push('p.lengthMm <= ?')
    binds.push(where.maxLengthMm)
  }

  if (where.psuFormFactorFilter) {
    conditions.push('p.psuFormFactor = ?')
    binds.push(where.psuFormFactorFilter)
  }

  return { binds, conditions }
}

function buildPrismaPartWhere(where: PartWhereInput = {}): Prisma.PartWhereInput {
  const prismaWhere: Prisma.PartWhereInput = {}

  if (Array.isArray(where.id?.in) && where.id.in.length > 0) {
    prismaWhere.id = { in: where.id.in }
  }

  if (where.category?.slug) {
    prismaWhere.category = { slug: where.category.slug }
  }

  if (Array.isArray(where.OR) && where.OR.length > 0) {
    prismaWhere.OR = where.OR
  }

  if (where.socketFilter) {
    prismaWhere.socket = { contains: where.socketFilter }
  }

  if (Array.isArray(where.formFactorIn) && where.formFactorIn.length > 0) {
    prismaWhere.formFactor = { in: where.formFactorIn }
  }

  if (where.ramTypeFilter) {
    prismaWhere.ramType = where.ramTypeFilter
  }

  if (typeof where.maxHeightMm === 'number') {
    prismaWhere.heightMm = { lte: where.maxHeightMm }
  }

  if (typeof where.maxLengthMm === 'number') {
    prismaWhere.lengthMm = { lte: where.maxLengthMm }
  }

  if (where.psuFormFactorFilter) {
    prismaWhere.psuFormFactor = where.psuFormFactorFilter
  }

  return prismaWhere
}

function createD1Facade(db: D1DatabaseLike): DbClient {
  async function findPartUnique(where: { id?: string }): Promise<PartWithCategory | null> {
    if (!where.id) return null

    const sql = `
      SELECT
        p.*,
        c.id AS category_id,
        c.slug AS category_slug,
        c.name AS category_name,
        c.safeImport AS category_safeImport
      FROM "Part" p
      JOIN "Category" c ON c.id = p.categoryId
      WHERE p.id = ?
      LIMIT 1
    `

    const result = await db.prepare(sql).bind(where.id).all<D1Row>()
    const row = result.results?.[0]
    return row ? mapPartRow(row) : null
  }

  async function findPartMany(args?: { where?: PartWhereInput }): Promise<PartWithCategory[]> {
    const { binds, conditions } = createPartQuery(args?.where)
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const sql = `
      SELECT
        p.*,
        c.id AS category_id,
        c.slug AS category_slug,
        c.name AS category_name,
        c.safeImport AS category_safeImport
      FROM "Part" p
      JOIN "Category" c ON c.id = p.categoryId
      ${whereClause}
      ORDER BY p.name ASC
    `

    const result = await db.prepare(sql).bind(...binds).all<D1Row>()
    return (result.results ?? []).map(mapPartRow)
  }

  async function fetchBuildWithParts(where: BuildLookup): Promise<SavedBuild | null> {
    if (!where.slug && !where.id) return null

    const buildSql = where.slug
      ? 'SELECT * FROM "Build" WHERE slug = ? LIMIT 1'
      : 'SELECT * FROM "Build" WHERE id = ? LIMIT 1'
    const buildBind = where.slug ?? where.id
    const buildResult = await db.prepare(buildSql).bind(buildBind).all<D1Row>()
    const buildRow = buildResult.results?.[0]

    if (!buildRow) return null

    const partSql = `
      SELECT
        bp.id AS buildPartId,
        bp.partId,
        bp.quantity,
        p.*,
        c.id AS category_id,
        c.slug AS category_slug,
        c.name AS category_name,
        c.safeImport AS category_safeImport
      FROM "BuildPart" bp
      JOIN "Part" p ON p.id = bp.partId
      JOIN "Category" c ON c.id = p.categoryId
      WHERE bp.buildId = ?
      ORDER BY c.slug ASC, p.name ASC
    `

    const partResult = await db.prepare(partSql).bind(String(buildRow.id)).all<D1Row>()
    const buildParts = (partResult.results ?? []).map((row) =>
      toSavedBuildPart({
        id: String(row.buildPartId),
        partId: String(row.partId),
        quantity: numberOrUndefined(row.quantity),
        part: mapPartRow(row),
      })
    )

    return {
      id: String(buildRow.id),
      slug: String(buildRow.slug),
      name: String(buildRow.name),
      purpose: stringOrUndefined(buildRow.purpose),
      isPublic: boolFromSql(buildRow.isPublic),
      userId: stringOrUndefined(buildRow.userId),
      totalPrice: numberOrUndefined(buildRow.totalPrice),
      estimatedWatts: numberOrUndefined(buildRow.estimatedWatts),
      createdAt: String(buildRow.createdAt),
      updatedAt: String(buildRow.updatedAt),
      buildParts,
    }
  }

  return {
    part: {
      findMany: findPartMany,
      findUnique: ({ where }) => findPartUnique(where),
    },
    build: {
      async create({ data }) {
        const id = randomUUID()
        const now = new Date().toISOString()

        await db
          .prepare(
            'INSERT INTO "Build" (id, slug, name, purpose, isPublic, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
          )
          .bind(
            id,
            data.slug,
            data.name,
            data.purpose ?? null,
            data.isPublic ? 1 : 0,
            now,
            now
          )
          .run()

        for (const buildPart of data.buildParts?.create ?? []) {
          await db
            .prepare('INSERT INTO "BuildPart" (id, buildId, partId, quantity) VALUES (?, ?, ?, ?)')
            .bind(randomUUID(), id, buildPart.partId, buildPart.quantity ?? 1)
            .run()
        }

        const build = await fetchBuildWithParts({ id })
        if (!build) {
          throw new Error('Failed to read back newly created build')
        }
        return build
      },
      findUnique: ({ where }) => fetchBuildWithParts(where),
    },
  }
}

function createPrismaFacade(prisma: PrismaClient): DbClient {
  return {
    part: {
      async findMany(args) {
        const parts = await prisma.part.findMany({
          where: buildPrismaPartWhere(args?.where),
          include: { category: true },
          orderBy: { name: 'asc' },
        })
        return parts.map(normalizePrismaPart)
      },
      async findUnique({ where }) {
        if (!where.id) return null
        const part = await prisma.part.findUnique({
          where: { id: where.id },
          include: { category: true },
        })
        return part ? normalizePrismaPart(part) : null
      },
    },
    build: {
      async create({ data }) {
        const build = await prisma.build.create({
          data: {
            slug: data.slug,
            name: data.name,
            purpose: data.purpose ?? undefined,
            isPublic: data.isPublic,
            buildParts: {
              create: (data.buildParts?.create ?? []).map((buildPart) => ({
                partId: buildPart.partId,
                quantity: buildPart.quantity ?? 1,
              })),
            },
          },
          include: {
            buildParts: {
              include: {
                part: {
                  include: { category: true },
                },
              },
            },
          },
        })
        return normalizePrismaBuild(build)
      },
      async findUnique({ where }) {
        if (!where.slug && !where.id) return null

        const build = await prisma.build.findUnique({
          where: where.slug ? { slug: where.slug } : { id: where.id },
          include: {
            buildParts: {
              include: {
                part: {
                  include: { category: true },
                },
              },
            },
          },
        })

        return build ? normalizePrismaBuild(build) : null
      },
    },
  }
}

export async function getDb(): Promise<DbClient> {
  const cloudflareDb = await getCloudflareD1()
  if (cloudflareDb) {
    return createD1Facade(cloudflareDb)
  }
  return createPrismaFacade(getDevPrisma())
}
