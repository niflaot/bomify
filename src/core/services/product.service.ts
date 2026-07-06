import { prisma } from './prisma.service'
import { uploadObject } from './storage.service'
import type {
  CreateProductInput,
  ListProductsInput,
  ProductPhotoInput,
  ProductRecord,
  UpdateProductInput
} from '@/core/types/product.types'

function normalizeOptionalText(value: string | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : null
}

function normalizeName(name: string): string {
  const trimmed = name.trim()

  if (!trimmed) {
    throw new Error('Product name is required')
  }

  return trimmed
}

async function uploadProductPhoto(photo: ProductPhotoInput | undefined): Promise<{
  readonly photoBucket?: string
  readonly photoObjectKey?: string
  readonly photoUrl?: string
}> {
  if (!photo) {
    return {}
  }

  const storedPhoto = await uploadObject({
    body: photo.body,
    contentType: photo.contentType,
    fileName: photo.fileName,
    namespace: 'products'
  })

  return {
    photoBucket: storedPhoto.bucket,
    photoObjectKey: storedPhoto.objectKey,
    photoUrl: storedPhoto.publicUrl
  }
}

/**
 * Creates a product and stores its optional photo in S3-compatible storage.
 *
 * @param input - Product creation data.
 * @returns Created product record.
 */
export async function createProduct(input: CreateProductInput): Promise<ProductRecord> {
  const photo = await uploadProductPhoto(input.photo)

  return prisma.product.create({
    data: {
      description: normalizeOptionalText(input.description),
      name: normalizeName(input.name),
      ...photo
    }
  })
}

/**
 * Lists non-deleted products, optionally filtered by search text.
 *
 * @param input - Product list options.
 * @returns Matching product records.
 */
export async function listProducts(input: ListProductsInput = {}): Promise<ProductRecord[]> {
  const search = input.search?.trim()

  return prisma.product.findMany({
    orderBy: { updatedAt: 'desc' },
    where: {
      deletedAt: input.includeDeleted ? undefined : null,
      OR: search
        ? [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        : undefined
    }
  })
}

/**
 * Finds one non-deleted product by id.
 *
 * @param id - Product id.
 * @returns Product record or null when it does not exist.
 */
export async function getProductById(id: string): Promise<ProductRecord | null> {
  return prisma.product.findFirst({
    where: {
      deletedAt: null,
      id
    }
  })
}

/**
 * Updates a product and optionally replaces its photo reference.
 *
 * @param id - Product id.
 * @param input - Product update data.
 * @returns Updated product record.
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<ProductRecord> {
  const photo = await uploadProductPhoto(input.photo)

  return prisma.product.update({
    data: {
      description: normalizeOptionalText(input.description),
      name: input.name === undefined ? undefined : normalizeName(input.name),
      ...photo
    },
    where: { id }
  })
}

/**
 * Soft-deletes a product by setting its deletion timestamp.
 *
 * @param id - Product id.
 * @returns Soft-deleted product record.
 */
export async function softDeleteProduct(id: string): Promise<ProductRecord> {
  return prisma.product.update({
    data: { deletedAt: new Date() },
    where: { id }
  })
}
