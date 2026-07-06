import type {
  CreateMaterialInput,
  ListMaterialsInput,
  MaterialRecord,
  UpdateMaterialInput
} from '@/core/types/material.types'

import {
  normalizeMaterialHexColor,
  normalizeMaterialIconKey,
  normalizeMaterialName,
  normalizeMaterialWidthCm,
  toMaterialRecord
} from './material.service.utils'
import { prisma } from '../prisma/prisma.service'

async function ensureActiveMaterial(materialId: string): Promise<MaterialRecord> {
  const material = await prisma.material.findFirst({
    where: {
      deletedAt: null,
      id: materialId
    }
  })

  if (!material) {
    throw new Error('Material was not found')
  }

  return toMaterialRecord(material)
}

/**
 * Creates a global reusable material.
 *
 * @param input - Material creation data.
 * @returns Created material record.
 */
export async function createMaterial(input: CreateMaterialInput): Promise<MaterialRecord> {
  const material = await prisma.material.create({
    data: {
      hexColor: normalizeMaterialHexColor(input.hexColor),
      iconKey: normalizeMaterialIconKey(input.iconKey),
      name: normalizeMaterialName(input.name),
      widthCm: normalizeMaterialWidthCm(input.widthCm)
    }
  })

  return toMaterialRecord(material)
}

/**
 * Lists active global materials, optionally filtered by search text.
 *
 * @param input - Material list options.
 * @returns Matching material records.
 */
export async function listMaterials(input: ListMaterialsInput = {}): Promise<MaterialRecord[]> {
  const search = input.search?.trim()
  const materials = await prisma.material.findMany({
    orderBy: { name: 'asc' },
    where: {
      deletedAt: input.includeDeleted ? undefined : null,
      OR: search
        ? [
            { name: { contains: search, mode: 'insensitive' } },
            { iconKey: { contains: search, mode: 'insensitive' } }
          ]
        : undefined
    }
  })

  return materials.map(toMaterialRecord)
}

/**
 * Updates a global reusable material.
 *
 * @param id - Material id.
 * @param input - Material update data.
 * @returns Updated material record.
 */
export async function updateMaterial(
  id: string,
  input: UpdateMaterialInput
): Promise<MaterialRecord> {
  await ensureActiveMaterial(id)

  const material = await prisma.material.update({
    data: {
      hexColor: input.hexColor === undefined
        ? undefined
        : normalizeMaterialHexColor(input.hexColor),
      iconKey: input.iconKey === undefined
        ? undefined
        : normalizeMaterialIconKey(input.iconKey),
      name: input.name === undefined ? undefined : normalizeMaterialName(input.name),
      widthCm: input.widthCm === undefined
        ? undefined
        : normalizeMaterialWidthCm(input.widthCm)
    },
    where: { id }
  })

  return toMaterialRecord(material)
}

/**
 * Soft-deletes a global material from the catalog.
 *
 * @param id - Material id.
 * @returns Soft-deleted material record.
 */
export async function softDeleteMaterial(id: string): Promise<MaterialRecord> {
  await ensureActiveMaterial(id)

  const material = await prisma.material.update({
    data: { deletedAt: new Date() },
    where: { id }
  })

  return toMaterialRecord(material)
}
