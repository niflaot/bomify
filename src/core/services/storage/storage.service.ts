import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { getStorageConfig } from '@/core/config/storage.config'

import { buildPublicObjectUrl, sanitizeObjectFileName } from './storage.utils'

/**
 * Binary object upload accepted by the object storage service.
 */
export type StorageUploadInput = {
  readonly body: Uint8Array
  readonly contentType: string
  readonly fileName: string
  readonly namespace: string
}

/**
 * Stored object metadata persisted by domain services.
 */
export type StoredObject = {
  readonly bucket: string
  readonly objectKey: string
  readonly publicUrl?: string
}

let storageClient: S3Client | null = null

function getStorageClient(): S3Client {
  if (storageClient) {
    return storageClient
  }

  const config = getStorageConfig()

  storageClient = new S3Client({
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    },
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle,
    region: config.region
  })

  return storageClient
}

function buildObjectKey(namespace: string, fileName: string): string {
  return `${namespace}/${crypto.randomUUID()}-${sanitizeObjectFileName(fileName)}`
}

/**
 * Uploads one binary object to S3-compatible storage.
 *
 * @param input - Upload payload and metadata.
 * @returns Stored object metadata.
 */
export async function uploadObject(input: StorageUploadInput): Promise<StoredObject> {
  const config = getStorageConfig()
  const objectKey = buildObjectKey(input.namespace, input.fileName)

  await getStorageClient().send(new PutObjectCommand({
    Body: input.body,
    Bucket: config.bucket,
    ContentType: input.contentType,
    Key: objectKey
  }))

  return {
    bucket: config.bucket,
    objectKey,
    publicUrl: buildPublicObjectUrl(config.publicBaseUrl, objectKey)
  }
}
