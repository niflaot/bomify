import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../../../../generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

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
      'material' in client &&
      'productMaterial' in client
  )
}

/**
 * Shared Prisma client instance for server-side data access.
 */
export const prisma = isPrismaClientCompatible(globalForPrisma.prisma)
  ? globalForPrisma.prisma
  : createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
