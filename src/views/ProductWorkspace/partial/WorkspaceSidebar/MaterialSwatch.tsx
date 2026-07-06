import type { ReactElement } from 'react'

import type { MaterialIconKey } from '@/core/constants/material-icons.constants'
import { getReadableForegroundColor } from '@/core/utils/color-contrast.utils'

import { MaterialIcon } from './material-icon.utils'

type MaterialSwatchProps = {
  readonly className?: string
  readonly hexColor: string
  readonly iconClassName?: string
  readonly iconKey: MaterialIconKey
}

/**
 * Renders a material color swatch with a readable Lucide icon.
 *
 * @param props - Material swatch props.
 * @returns Material swatch element.
 */
export function MaterialSwatch(props: MaterialSwatchProps): ReactElement {
  const { className, hexColor, iconClassName = 'size-4', iconKey } = props

  return (
    <span
      className={className}
      style={{ backgroundColor: hexColor }}
    >
      <MaterialIcon
        className={iconClassName}
        iconKey={iconKey}
        style={{ color: getReadableForegroundColor(hexColor) }}
      />
    </span>
  )
}
