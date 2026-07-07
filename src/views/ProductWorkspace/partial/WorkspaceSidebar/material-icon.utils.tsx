import { iconNames, type IconName } from 'lucide-react/dynamic'

import {
  getMaterialIconName,
  MaterialIcon
} from '@/components/MaterialIcon'
import type { MaterialIconKey } from '@/core/constants/material-icons.constants'

type MaterialIconOption = {
  readonly key: MaterialIconKey
  readonly label: string
  readonly searchText: string
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

export { getMaterialIconName, MaterialIcon }
