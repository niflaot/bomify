'use client'

import { Minus, Plus } from 'lucide-react'
import type { ReactElement } from 'react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useProductWorkspace } from '@/views/ProductWorkspace/context/product-workspace.context'
import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece
} from '@/views/ProductWorkspace/types/product-workspace.types'
import type { ProductionCutSummary } from '@/layout/workspace/WorkspaceCanvas/types/production-cut.types'
import { buildProductionCutSummaries } from '@/layout/workspace/WorkspaceCanvas/utils/production-cut.utils'

import { MaterialSwatch } from '../Materials/MaterialSwatch'

type ConsumptionPanelProps = {
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly pieces: readonly ProductWorkspacePiece[]
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

function UnitsControl(props: {
  readonly labels: ProductWorkspaceLabels
  readonly onChange: (units: number) => void
  readonly units: number
}): ReactElement {
  const { labels, onChange, units } = props

  return (
    <div className="grid gap-2 border p-3">
      <label
        className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        htmlFor="production-units"
      >
        {labels.consumptionUnitsLabel}
      </label>
      <div className="grid grid-cols-[auto_1fr_auto] gap-2">
        <Button
          aria-label={labels.consumptionDecreaseUnits}
          disabled={units <= 1}
          onClick={() => { onChange(units - 1) }}
          size="icon-sm"
          type="button"
          variant="outline"
        >
          <Minus aria-hidden="true" />
        </Button>
        <Input
          id="production-units"
          min={1}
          onChange={event => {
            onChange(Number(event.target.value))
          }}
          type="number"
          value={units}
        />
        <Button
          aria-label={labels.consumptionIncreaseUnits}
          onClick={() => { onChange(units + 1) }}
          size="icon-sm"
          type="button"
          variant="outline"
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

function ConsumptionCard(props: {
  readonly labels: ProductWorkspaceLabels
  readonly summary: ProductionCutSummary
}): ReactElement {
  const { labels, summary } = props

  return (
    <li className="grid gap-3 border p-3">
      <div className="flex items-center gap-2">
        <MaterialSwatch
          className="grid size-9 shrink-0 place-items-center border"
          hexColor={summary.materialColor}
          iconClassName="size-4"
          iconKey={summary.iconKey}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{summary.materialName}</p>
          <p className="text-xs text-muted-foreground">{summary.widthCm} cm</p>
        </div>
      </div>
      <dl className="grid gap-1 text-xs">
        <Metric label={labels.consumptionLength} value={formatMeters(summary.lengthMeters)} />
        <Metric label={labels.consumptionSheets} value={String(summary.sheets.length)} />
        <Metric label={labels.consumptionUsed} value={formatSquareMeters(summary.usedAreaMm2)} />
        <Metric label={labels.consumptionWaste} value={formatSquareMeters(summary.wasteAreaMm2)} />
        <Metric label={labels.consumptionEfficiency} value={formatPercent(summary.efficiency)} />
      </dl>
    </li>
  )
}

function Metric(props: {
  readonly label: string
  readonly value: string
}): ReactElement {
  return (
    <div className="flex items-center justify-between gap-3 border bg-muted/20 px-2 py-1.5">
      <dt className="uppercase tracking-widest text-muted-foreground">{props.label}</dt>
      <dd className="font-semibold">{props.value}</dd>
    </div>
  )
}

/**
 * Renders material consumption for production units and active combination.
 *
 * @param props - Consumption panel props.
 * @returns Consumption panel content.
 */
export function ConsumptionPanel(props: ConsumptionPanelProps): ReactElement {
  const { combinations, labels, pieces } = props
  const {
    activeCombinationId,
    productionUnits,
    setProductionUnits
  } = useProductWorkspace()
  const activeCombination = combinations.find(combination =>
    combination.id === activeCombinationId
  ) ?? null
  const summaries = useMemo(
    () => buildProductionCutSummaries(pieces, activeCombination, productionUnits, labels),
    [activeCombination, labels, pieces, productionUnits]
  )

  return (
    <div className="grid gap-4">
      <UnitsControl
        labels={labels}
        onChange={setProductionUnits}
        units={productionUnits}
      />
      {activeCombination ? (
        <div className="border bg-muted/20 p-3 text-xs">
          <p className="uppercase tracking-widest text-muted-foreground">
            {labels.combinationLabel}
          </p>
          <p className="mt-1 font-semibold">{activeCombination.name}</p>
        </div>
      ) : null}
      {summaries.length > 0 ? (
        <ul className="grid gap-3">
          {summaries.map(summary => (
            <ConsumptionCard
              key={summary.materialId}
              labels={labels}
              summary={summary}
            />
          ))}
        </ul>
      ) : (
        <div className="border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
          {labels.consumptionEmptyDescription}
        </div>
      )}
    </div>
  )
}
