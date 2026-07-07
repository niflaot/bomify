import type { ReactElement } from 'react'

import type { MaterialIconKey } from '@/core/constants/material-icons.constants'

import { MaterialSwatch } from './MaterialSwatch'

type MaterialPreviewProps = {
  readonly hexColor: string
  readonly iconKey: MaterialIconKey
  readonly name?: string
  readonly widthCm?: string
}

/**
 * Renders a preview of how a material swatch and icon will look.
 *
 * @param props - Material preview props.
 * @returns Material preview element.
 */
export function MaterialPreview(props: MaterialPreviewProps): ReactElement {
  const { hexColor, iconKey, name, widthCm } = props

  return (
    <div className="grid gap-3 border bg-muted/20 p-4">
      <MaterialSwatch
        className="grid aspect-square place-items-center border"
        hexColor={hexColor}
        iconClassName="size-12"
        iconKey={iconKey}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name || hexColor}</p>
        <p className="text-xs text-muted-foreground">
          {widthCm ? `${widthCm} cm` : hexColor}
        </p>
      </div>
    </div>
  )
}
