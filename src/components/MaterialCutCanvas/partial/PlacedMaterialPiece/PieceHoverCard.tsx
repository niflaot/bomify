import { Hash, Layers3, Scissors } from 'lucide-react'
import type { ReactElement } from 'react'

import { MaterialIcon } from '@/components/MaterialIcon'
import { getReadableForegroundColor } from '@/core/utils/color/color-contrast.utils'

import type { MaterialCutCanvasPieceTooltip } from '../../material-cut-canvas.types'

type PieceHoverCardProps = {
  readonly fallback?: string
  readonly tooltip?: MaterialCutCanvasPieceTooltip
}

function TooltipIcon(props: {
  readonly row: MaterialCutCanvasPieceTooltip['rows'][number]
}): ReactElement {
  if (props.row.iconKey) {
    return <MaterialIcon className="size-3.5" iconKey={props.row.iconKey} />
  }

  if (props.row.icon === 'material') {
    return <Layers3 aria-hidden="true" className="mt-0.5 size-3.5" />
  }

  if (props.row.icon === 'quantity') {
    return <Scissors aria-hidden="true" className="mt-0.5 size-3.5" />
  }

  return <Hash aria-hidden="true" className="mt-0.5 size-3.5" />
}

/**
 * Renders a rich hover card for one placed material piece.
 *
 * @param props - Hover card props.
 * @returns Piece hover card element.
 */
export function PieceHoverCard(props: PieceHoverCardProps): ReactElement | null {
  const { fallback, tooltip } = props

  if (!tooltip && !fallback) {
    return null
  }

  return (
    <div
      className="pointer-events-none absolute left-[calc(100%+0.5rem)] top-0 z-[80] hidden w-72 border bg-background p-3 text-foreground shadow-xl group-hover:grid"
      role="tooltip"
    >
      {tooltip ? (
        <>
          <p className="border-b pb-2 text-sm font-semibold uppercase tracking-widest">
            {tooltip.title}
          </p>
          <div className="mt-3 grid gap-2">
            {tooltip.rows.map(row => (
              <div
                className="grid grid-cols-[2rem_1fr] items-start gap-2"
                key={`${row.label}:${row.value}`}
              >
                <span
                  className="grid size-8 place-items-center border"
                  style={{
                    backgroundColor: row.color ?? 'hsl(var(--muted))',
                    color: row.color
                      ? getReadableForegroundColor(row.color)
                      : 'hsl(var(--foreground))'
                  }}
                >
                  <TooltipIcon row={row} />
                </span>
                <p className="min-w-0 text-xs leading-5">
                  <span className="block uppercase tracking-widest text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="block font-semibold">{row.value}</span>
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="whitespace-pre-line text-xs leading-5">{fallback}</p>
      )}
    </div>
  )
}
