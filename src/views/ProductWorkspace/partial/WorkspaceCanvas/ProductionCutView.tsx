'use client'

import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { useProductWorkspace } from '../../product-workspace.context'
import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece
} from '../../product-workspace.types'
import { ProductionSelectors, ProductionToolbar } from './ProductionCutControls'
import { ProductionCutSheet } from './ProductionCutSheet'
import { buildProductionCutSummaries } from './production-cut.utils'
import { useDespieceZoom } from './use-despiece-zoom.hook'

type ProductionCutViewProps = {
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly pieces: readonly ProductWorkspacePiece[]
}

const defaultZoom = 0.56

/**
 * Renders production cut sheets grouped by material for the active combination.
 *
 * @param props - Production cut view props.
 * @returns Production cut workspace view.
 */
export function ProductionCutView(props: ProductionCutViewProps): ReactElement {
  const { combinations, labels, pieces } = props
  const { activeCombinationId, productionUnits } = useProductWorkspace()
  const {
    centerView,
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
  const summaries = useMemo(
    () => buildProductionCutSummaries(pieces, activeCombination, productionUnits, labels),
    [activeCombination, labels, pieces, productionUnits]
  )
  const [selectedMaterialId, setSelectedMaterialId] = useState('')
  const [activeSheetIndex, setActiveSheetIndex] = useState(0)
  const activeMaterialId = summaries.some(summary =>
    summary.materialId === selectedMaterialId
  )
    ? selectedMaterialId
    : summaries[0]?.materialId ?? ''
  const activeSummary = summaries.find(summary => summary.materialId === activeMaterialId)
  const activeSheet = activeSummary?.sheets[activeSheetIndex] ?? activeSummary?.sheets[0]
  const currentSheetIndex = activeSheet?.index ?? 0
  const sheetCount = activeSummary?.sheets.length ?? 0

  if (!activeSummary || !activeSheet) {
    return (
      <div className="grid min-h-full place-items-center">
        <div className="max-w-md border bg-background p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold uppercase tracking-widest">
            {labels.productionCutView}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {labels.productionNoMaterialDescription}
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
      <ProductionSelectors
        activeMaterialId={activeSummary.materialId}
        activeSheetIndex={activeSheet.index}
        labels={labels}
        onMaterialChange={materialId => {
          setSelectedMaterialId(materialId)
          setActiveSheetIndex(0)
        }}
        onSheetChange={setActiveSheetIndex}
        summaries={summaries}
      />
      <div className="grid w-max p-10 pb-28 pt-28">
        <ProductionCutSheet
          labels={labels}
          pixelsPerMm={zoom}
          sheet={activeSheet}
        />
      </div>
      <ProductionToolbar
        defaultZoom={defaultZoom}
        labels={labels}
        nextDisabled={currentSheetIndex >= sheetCount - 1}
        onCenterView={resetZoomAndCenter}
        onNextSheet={() => {
          setActiveSheetIndex(index => Math.min(index + 1, sheetCount - 1))
          centerView()
        }}
        onPreviousSheet={() => {
          setActiveSheetIndex(index => Math.max(index - 1, 0))
          centerView()
        }}
        onResetZoom={resetZoom}
        onZoomIn={increaseZoom}
        onZoomOut={decreaseZoom}
        previousDisabled={currentSheetIndex <= 0}
        summary={activeSummary}
        zoom={zoom}
      />
    </div>
  )
}
