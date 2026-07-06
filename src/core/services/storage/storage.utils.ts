/**
 * Normalizes a file name for use inside an object key.
 *
 * @param fileName - Original file name.
 * @returns A storage-safe file name.
 */
export function sanitizeObjectFileName(fileName: string): string {
  const sanitized = fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return sanitized || 'asset'
}

/**
 * Builds a public object URL when a public base URL is configured.
 *
 * @param publicBaseUrl - Base URL exposed by MinIO or a CDN.
 * @param objectKey - Object key stored in the bucket.
 * @returns A public URL or undefined.
 */
export function buildPublicObjectUrl(
  publicBaseUrl: string | undefined,
  objectKey: string
): string | undefined {
  if (!publicBaseUrl) {
    return undefined
  }

  const baseUrl = publicBaseUrl.replace(/\/+$/g, '')
  const encodedKey = objectKey.split('/').map(encodeURIComponent).join('/')

  return `${baseUrl}/${encodedKey}`
}
