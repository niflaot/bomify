import JSZip from 'jszip'

/**
 * One file to include in a downloadable ZIP bundle.
 */
export type DownloadableFile = {
  readonly name: string
  readonly content: Blob | string
}

/**
 * Triggers a browser download for a blob via a temporary anchor element.
 *
 * @param blob - File contents to download.
 * @param fileName - Name the downloaded file should have.
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/**
 * Bundles several files into one ZIP and triggers its download.
 *
 * @param files - Files to include in the archive.
 * @param zipFileName - Name the downloaded archive should have.
 */
export async function downloadFilesAsZip(
  files: readonly DownloadableFile[],
  zipFileName: string
): Promise<void> {
  const zip = new JSZip()

  files.forEach(file => {
    zip.file(file.name, file.content)
  })

  const blob = await zip.generateAsync({ type: 'blob' })

  downloadBlob(blob, zipFileName)
}
