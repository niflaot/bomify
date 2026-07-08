'use client'

import { Focus, Gauge, RotateCcw, Ruler, Trash2, ZoomIn, ZoomOut } from 'lucide-react'
import type { ReactElement } from 'react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'

import { useProductWorkspace } from '@/views/ProductWorkspace/context/product-workspace.context'
import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece
} from '@/views/ProductWorkspace/types/product-workspace.types'
import {
  calculateDespieceStats,
  type DespieceStats
} from './utils/despiece-stats.utils'
import { buildDespieceSheets } from './utils/despiece-view.utils'
import { DespieceSheet } from './DespieceSheet'
import { useDespieceZoom } from './hooks/use-despiece-zoom.hook'

type DespieceViewProps = {
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly pieces: readonly ProductWorkspacePiece[]
}

const defaultZoom = 0.78

function formatZoom(value: number): string {
  return `${Math.round((value / defaultZoom) * 100)}%`
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function formatSquareMeters(valueMm2: number): string {
  return `${(valueMm2 / 1_000_000).toFixed(2)} m2`
}

function DespieceToolbar(props: {
  readonly labels: ProductWorkspaceLabels
  readonly onCenterView: () => void
  readonly onResetZoom: () => void
  readonly onZoomIn: () => void
  readonly onZoomOut: () => void
  readonly stats: DespieceStats
  readonly zoom: number
}): ReactElement {
  const { labels, onCenterView, onResetZoom, onZoomIn, onZoomOut, stats, zoom } = props

  return (
    <div className="fixed bottom-6 right-6 z-40 flex max-w-[calc(100vw-3rem)] flex-wrap items-center gap-1 border bg-background p-1 shadow-lg">
      <div className="flex items-center gap-3 border-r px-3 py-2">
        <Gauge aria-hidden="true" className="size-4" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {labels.canvasEfficiency}
        </span>
        <strong className="text-sm">{formatPercent(stats.efficiency)}</strong>
      </div>
      <div className="hidden items-center gap-3 border-r px-3 py-2 lg:flex">
        <Ruler aria-hidden="true" className="size-4" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {labels.canvasUsed}
        </span>
        <strong className="text-sm">{formatSquareMeters(stats.usedAreaMm2)}</strong>
      </div>
      <div className="hidden items-center gap-3 border-r px-3 py-2 lg:flex">
        <Trash2 aria-hidden="true" className="size-4" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {labels.canvasWaste}
        </span>
        <strong className="text-sm">{formatSquareMeters(stats.wasteAreaMm2)}</strong>
      </div>
      <Button aria-label={labels.zoomOut} onClick={onZoomOut} size="icon-sm" type="button" variant="ghost">
        <ZoomOut aria-hidden="true" />
      </Button>
      <span className="min-w-14 text-center text-xs font-semibold tracking-widest">
        {formatZoom(zoom)}
      </span>
      <Button aria-label={labels.zoomIn} onClick={onZoomIn} size="icon-sm" type="button" variant="ghost">
        <ZoomIn aria-hidden="true" />
      </Button>
      <Button aria-label={labels.zoomReset} onClick={onResetZoom} size="icon-sm" type="button" variant="ghost">
        <RotateCcw aria-hidden="true" />
      </Button>
      <Button aria-label={labels.zoomCenter} onClick={onCenterView} size="icon-sm" type="button" variant="ghost">
        <Focus aria-hidden="true" />
      </Button>
    </div>
  )
}

/**
 * Renders the despiece material sheets for the selected combination.
 *
 * @param props - Despiece view props.
 * @returns Despiece workspace canvas.
 */
export function DespieceView(props: DespieceViewProps): ReactElement {
  const { combinations, labels, pieces } = props
  const { activeCombinationId } = useProductWorkspace()
  const {
    decreaseZoom,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
    increaseZoom,
    resetZoom,
    resetZoomAndCenter,
    setViewportElement,
    zoom
  } = useDespieceZoom(defaultZoom)
  const activeCombination = combinations.find(combination =>
    combination.id === activeCombinationId
  ) ?? null
  const sheets = useMemo(
    () => buildDespieceSheets(pieces, activeCombination, labels),
    [activeCombination, labels, pieces]
  )
  const stats = useMemo(() => calculateDespieceStats(sheets), [sheets])

  if (sheets.length === 0) {
    return (
      <div className="grid min-h-full place-items-center">
        <div className="max-w-md border bg-background p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold uppercase tracking-widest">
            {labels.canvasEmptyTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {labels.canvasEmptyDescription}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative h-full min-h-[36rem] overflow-auto bg-muted/40"
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      ref={setViewportElement}
      style={{ touchAction: 'none' }}
    >
      <div className="grid w-max gap-10 p-10 pb-28">
        {sheets.map(sheet => (
          <DespieceSheet
            key={sheet.id}
            labels={labels}
            pixelsPerMm={zoom}
            sheet={sheet}
          />
        ))}
      </div>
      <DespieceToolbar
        labels={labels}
        onCenterView={resetZoomAndCenter}
        onResetZoom={resetZoom}
        onZoomIn={increaseZoom}
        onZoomOut={decreaseZoom}
        stats={stats}
        zoom={zoom}
      />
    </div>
  )
}
