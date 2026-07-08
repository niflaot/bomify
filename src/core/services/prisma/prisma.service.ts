import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../../../../generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

let cachedClient: PrismaClient | undefined

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is required to initialize Prisma')
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString })
  })
}

function isPrismaClientCompatible(client: PrismaClient | undefined): client is PrismaClient {
  return Boolean(
    client &&
      'product' in client &&
      'productCombination' in client &&
      'productCombinationMaterial' in client &&
      'material' in client &&
      'productMaterial' in client &&
      'piece' in client &&
      'pieceMaterialRequirement' in client &&
      'productAddition' in client
  )
}

function getPrismaClient(): PrismaClient {
  if (isPrismaClientCompatible(cachedClient)) {
    return cachedClient
  }

  if (isPrismaClientCompatible(globalForPrisma.prisma)) {
    cachedClient = globalForPrisma.prisma

    return cachedClient
  }

  cachedClient = createPrismaClient()

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = cachedClient
  }

  return cachedClient
}

/**
 * Shared Prisma client instance for server-side data access.
 *
 * Lazily initialized behind a Proxy so importing this module (or anything
 * that transitively imports it) never requires `DATABASE_URL` — only using
 * it does. This matters because `next build` imports every route module to
 * inspect its segment config, which would otherwise crash the build in
 * environments without a database configured (e.g. the Docker image build).
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    const value = Reflect.get(client, prop)

    return typeof value === 'function' ? value.bind(client) : value
  }
})
