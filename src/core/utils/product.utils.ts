import type { ProductDisplayNameSource } from '@/core/types/product.types'

/**
 * Resolves the user-facing product name from datasheets with SKU fallback.
 *
 * @param product - Product-like source containing SKU and optional datasheets.
 * @returns The default datasheet name, first non-empty datasheet name, or SKU.
 */
export function getProductDisplayName(
  product: ProductDisplayNameSource
): string {
  const datasheets = product.datasheets ?? []
  const defaultDatasheetName = datasheets.find(
    datasheet => datasheet.realm === 'default' && Boolean(datasheet.name?.trim())
  )?.name

  if (defaultDatasheetName) {
    return defaultDatasheetName.trim()
  }

  const firstNamedDatasheet = datasheets.find(datasheet =>
    Boolean(datasheet.name?.trim())
  )?.name

  return firstNamedDatasheet?.trim() || product.sku
}
