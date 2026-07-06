function expandHexColor(hexColor: string): string {
  const cleanColor = hexColor.replace('#', '').trim()

  if (cleanColor.length === 3) {
    return cleanColor
      .split('')
      .map(value => `${value}${value}`)
      .join('')
  }

  return cleanColor
}

/**
 * Returns a readable foreground color for a hex background.
 *
 * @param hexColor - Background color.
 * @returns High-contrast foreground color.
 */
export function getReadableForegroundColor(hexColor: string): string {
  const expandedColor = expandHexColor(hexColor)

  if (!/^[0-9a-f]{6}$/i.test(expandedColor)) {
    return '#111111'
  }

  const red = Number.parseInt(expandedColor.slice(0, 2), 16)
  const green = Number.parseInt(expandedColor.slice(2, 4), 16)
  const blue = Number.parseInt(expandedColor.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255

  return luminance > 0.58 ? '#111111' : '#FFFFFF'
}
