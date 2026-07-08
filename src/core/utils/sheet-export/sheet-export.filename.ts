const diacriticsRegex = /[\u0300-\u036f]/g
const invalidFileNameChars = /[^a-z0-9]+/g

/**
 * Converts free text into a lowercase, hyphen-separated, filesystem-safe
 * token (accents stripped, everything else collapsed to hyphens).
 *
 * @param value - Text to slugify.
 * @returns Slugified token, or `''` if nothing survives.
 */
export function slugify(value: string): string {
  const normalized = value.normalize('NFD').replace(diacriticsRegex, '')

  return normalized
    .toLowerCase()
    .replace(invalidFileNameChars, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Builds a download file name from ordered parts (e.g. product name,
 * material, sheet index), skipping any part that slugifies to nothing.
 *
 * @param parts - Name segments, joined in the given order.
 * @param extension - File extension, without the leading dot.
 * @returns The file name, e.g. `kairos-backpack-lona-produccion.pdf`.
 */
export function buildExportFileName(parts: readonly string[], extension: string): string {
  const slug = parts.map(slugify).filter(part => part.length > 0).join('-')

  return `${slug || 'export'}.${extension}`
}
