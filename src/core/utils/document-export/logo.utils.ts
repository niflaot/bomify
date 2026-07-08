/**
 * A logo rasterized to PNG, ready for `jsPDF#addImage`.
 */
export type RasterizedLogo = {
  readonly dataUrl: string
  readonly width: number
  readonly height: number
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.addEventListener('load', () => { resolve(image) })
    image.addEventListener('error', () => { reject(new Error('Could not load image')) })
    image.src = src
  })
}

/**
 * Rasterizes the app logo (SVG) to a PNG data URL — jsPDF can't embed SVG
 * directly. Returns `null` on any failure so a PDF export can simply skip
 * the logo instead of failing entirely.
 *
 * @param url - Logo asset URL.
 * @param targetWidthPx - Desired raster width; height keeps the aspect ratio.
 * @returns The rasterized logo, or `null` if it could not be loaded.
 */
export async function rasterizeLogo(
  url = '/logo.svg',
  targetWidthPx = 200
): Promise<RasterizedLogo | null> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      return null
    }

    const svgText = await response.text()
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgText)))}`
    const image = await loadImage(svgDataUrl)
    const aspectRatio = image.naturalHeight / image.naturalWidth || 1
    const width = targetWidthPx
    const height = Math.round(width * aspectRatio)
    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')

    if (!context) {
      return null
    }

    context.drawImage(image, 0, 0, width, height)

    return { dataUrl: canvas.toDataURL('image/png'), height, width }
  } catch {
    return null
  }
}
