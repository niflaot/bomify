/**
 * Runtime configuration for S3-compatible object storage.
 */
export type StorageConfig = {
  readonly endpoint: string
  readonly region: string
  readonly accessKeyId: string
  readonly secretAccessKey: string
  readonly bucket: string
  readonly publicBaseUrl?: string
  readonly forcePathStyle: boolean
}

function optionalEnv(name: string): string | undefined {
  const value = process.env[name]

  return value && value.trim().length > 0 ? value : undefined
}

function requiredEnv(name: string): string {
  const value = optionalEnv(name)

  if (!value) {
    throw new Error(`${name} is required to initialize object storage`)
  }

  return value
}

/**
 * Reads S3-compatible storage configuration from environment variables.
 *
 * @returns Normalized storage configuration.
 */
export function getStorageConfig(): StorageConfig {
  return {
    accessKeyId: requiredEnv('S3_ACCESS_KEY_ID'),
    bucket: requiredEnv('S3_BUCKET'),
    endpoint: requiredEnv('S3_ENDPOINT'),
    forcePathStyle: optionalEnv('S3_FORCE_PATH_STYLE') !== 'false',
    publicBaseUrl: optionalEnv('S3_PUBLIC_BASE_URL'),
    region: optionalEnv('S3_REGION') ?? 'us-east-1',
    secretAccessKey: requiredEnv('S3_SECRET_ACCESS_KEY')
  }
}
