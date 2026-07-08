import {
  ChevronLeft,
  ChevronRight,
  Focus,
  Gauge,
  RotateCcw,
  Ruler,
  Sheet,
  Trash2,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import type { ProductWorkspaceLabels } from '@/views/ProductWorkspace/types/product-workspace.types'
import type { ProductionCutSummary } from './types/production-cut.types'

type ProductionToolbarProps = {
  readonly defaultZoom: number
  readonly nextDisabled: boolean
  readonly labels: ProductWorkspaceLabels
  readonly onCenterView: () => void
  readonly onNextSheet: () => void
  readonly onPreviousSheet: () => void
  readonly onResetZoom: () => void
  readonly onZoomIn: () => void
  readonly onZoomOut: () => void
  readonly previousDisabled: boolean
  readonly summary: ProductionCutSummary
  readonly zoom: number
}

type ProductionSelectorsProps = {
  readonly activeMaterialId: string
  readonly activeSheetIndex: number
  readonly labels: ProductWorkspaceLabels
  readonly onMaterialChange: (materialId: string) => void
  readonly onSheetChange: (sheetIndex: number) => void
  readonly summaries: readonly ProductionCutSummary[]
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function formatSquareMeters(valueMm2: number): string {
  return `${(valueMm2 / 1_000_000).toFixed(2)} m2`
}

function formatMeters(value: number): string {
  return `${value.toFixed(2)} m`
}

function ToolbarMetric(props: {
  readonly className?: string
  readonly icon: ReactElement
  readonly label: string
  readonly value: string
}): ReactElement {
  const { className = 'flex', icon, label, value } = props

  return (
    <div className={`${className} items-center gap-3 border-r px-3 py-2`}>
      {icon}
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <strong className="text-sm">{value}</strong>
    </div>
  )
}

/**
 * Renders the production canvas bottom metrics and zoom controls.
 *
 * @param props - Toolbar props.
 * @returns Production toolbar.
 */
export function ProductionToolbar(props: ProductionToolbarProps): ReactElement {
  const {
    defaultZoom,
    labels,
    nextDisabled,
    onCenterView,
    onNextSheet,
    onPreviousSheet,
    onResetZoom,
    onZoomIn,
    onZoomOut,
    previousDisabled,
    summary,
    zoom
  } = props

  return (
    <div className="fixed bottom-6 right-6 z-40 flex max-w-[calc(100vw-3rem)] flex-wrap items-center gap-1 border bg-background p-1 shadow-lg">
      <Button
        aria-label={labels.previousSheet}
        disabled={previousDisabled}
        onClick={onPreviousSheet}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <ChevronLeft aria-hidden="true" />
      </Button>
      <Button
        aria-label={labels.nextSheet}
        disabled={nextDisabled}
        onClick={onNextSheet}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <ChevronRight aria-hidden="true" />
      </Button>
      <ToolbarMetric
        icon={<Gauge aria-hidden="true" className="size-4" />}
        label={labels.consumptionEfficiency}
        value={formatPercent(summary.efficiency)}
      />
      <ToolbarMetric
        icon={<Ruler aria-hidden="true" className="size-4" />}
        label={labels.consumptionLength}
        value={formatMeters(summary.lengthMeters)}
      />
      <ToolbarMetric
        className="hidden lg:flex"
        icon={<Trash2 aria-hidden="true" className="size-4" />}
        label={labels.consumptionWaste}
        value={formatSquareMeters(summary.wasteAreaMm2)}
      />
      <Button aria-label={labels.zoomOut} onClick={onZoomOut} size="icon-sm" type="button" variant="ghost">
        <ZoomOut aria-hidden="true" />
      </Button>
      <span className="min-w-14 text-center text-xs font-semibold tracking-widest">
        {Math.round((zoom / defaultZoom) * 100)}%
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
 * Renders material and sheet selectors for production cut.
 *
 * @param props - Selector props.
 * @returns Production selectors.
 */
export function ProductionSelectors(props: ProductionSelectorsProps): ReactElement {
  const {
    activeMaterialId,
    activeSheetIndex,
    labels,
    onMaterialChange,
    onSheetChange,
    summaries
  } = props
  const activeSummary = summaries.find(summary => summary.materialId === activeMaterialId)

  return (
    <div className="absolute right-6 top-6 z-30 flex flex-wrap items-end gap-2 border bg-background p-3 shadow-sm">
      <label className="grid gap-1">
        <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
          {labels.productionMaterialLabel}
        </span>
        <Select
          onValueChange={onMaterialChange}
          value={activeMaterialId}
        >
          <SelectTrigger className="h-9 min-w-44 font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {summaries.map(summary => (
              <SelectItem key={summary.materialId} value={summary.materialId}>
                {summary.materialName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label className="grid gap-1">
        <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
          {labels.productionSheetLabel}
        </span>
        <Select
          onValueChange={value => { onSheetChange(Number(value)) }}
          value={String(activeSheetIndex)}
        >
          <SelectTrigger className="h-9 min-w-28 font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(activeSummary?.sheets ?? []).map(sheet => (
              <SelectItem key={sheet.id} value={String(sheet.index)}>
                {sheet.index + 1} / {activeSummary?.sheets.length ?? 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <div className="flex h-9 items-center gap-2 border px-3 text-sm font-semibold">
        <Sheet aria-hidden="true" className="size-4" />
        {activeSummary?.sheets.length ?? 0}
      </div>
    </div>
  )
}
