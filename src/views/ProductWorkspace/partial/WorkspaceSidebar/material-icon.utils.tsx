import type { CSSProperties, ReactElement } from 'react'
import { DynamicIcon, iconNames, type IconName } from 'lucide-react/dynamic'

import { DEFAULT_MATERIAL_ICON_KEY, type MaterialIconKey } from '@/core/constants/material-icons.constants'

type MaterialIconOption = {
  readonly key: MaterialIconKey
  readonly label: string
  readonly searchText: string
}

const legacyIconNameMap: Record<string, IconName> = {
  CircleDot: 'circle-dot',
  Layers3: 'layers-3',
  SwatchBook: 'swatch-book',
  circle: 'circle-dot',
  gem: 'gem',
  layers: 'layers-3',
  package: 'package',
  palette: 'palette',
  shield: 'shield',
  shirt: 'shirt',
  sparkles: 'sparkles',
  swatch: 'swatch-book',
  waves: 'waves'
}

const iconNameSet = new Set<string>(iconNames)

function toKebabIconName(iconKey: string): string {
  return iconKey
    .replace(/Icon$/, '')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

function toIconLabel(iconName: IconName): string {
  return iconName
    .split('-')
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

function normalizeSearchText(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '').toLowerCase()
}

/**
 * Icon options exposed by the material icon picker.
 */
export const materialIconOptions: readonly MaterialIconOption[] = iconNames
  .map(iconName => {
    const label = toIconLabel(iconName)

    return {
      key: iconName,
      label,
      searchText: `${iconName} ${label} ${normalizeSearchText(label)}`
    }
  })
  .sort((left, right) => left.label.localeCompare(right.label))

/**
 * Finds a Lucide dynamic icon name by stored key.
 *
 * @param iconKey - Stored material icon key.
 * @returns Lucide dynamic icon name.
 */
export function getMaterialIconName(iconKey: MaterialIconKey): IconName {
  const trimmedIconKey = iconKey.trim()
  const legacyIconName = legacyIconNameMap[trimmedIconKey]

  if (legacyIconName) {
    return legacyIconName
  }

  const normalizedIconName = toKebabIconName(trimmedIconKey)

  if (iconNameSet.has(normalizedIconName)) {
    return normalizedIconName as IconName
  }

  return DEFAULT_MATERIAL_ICON_KEY as IconName
}

/**
 * Renders a material icon by key.
 *
 * @param props - Material icon props.
 * @returns Material icon element.
 */
export function MaterialIcon(props: {
  readonly className?: string
  readonly iconKey: MaterialIconKey
  readonly style?: CSSProperties
}): ReactElement {
  return (
    <DynamicIcon
      aria-hidden="true"
      className={props.className}
      name={getMaterialIconName(props.iconKey || DEFAULT_MATERIAL_ICON_KEY)}
      style={props.style}
    />
  )
}
