import { Plus, Trash2 } from 'lucide-react'
import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/product-workspace.types'

/**
 * Editable material requirement row.
 */
export type RequirementRow = {
  readonly key: string
  readonly materialId: string
  readonly quantity: number
}

function formatProductMaterial(productMaterial: ProductWorkspaceProductMaterial): string {
  return `${productMaterial.material.name} (${productMaterial.material.widthCm} cm)`
}

function formatCombinationMaterial(
  assignment: ProductWorkspaceCombination['materialAssignments'][number]
): string {
  return `${assignment.roleId} - ${assignment.productMaterial.material.name}`
}

/**
 * Renders global material requirement rows.
 *
 * @param props - Global panel props.
 * @returns Global requirement panel.
 */
export function GlobalRequirementsPanel(props: {
  readonly active: boolean
  readonly invalid: boolean
  readonly labels: ProductWorkspaceLabels
  readonly onAdd: () => void
  readonly onRemove: (key: string) => void
  readonly onUpdate: (key: string, patch: Partial<RequirementRow>) => void
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
  readonly rows: readonly RequirementRow[]
}): ReactElement {
  const { active, invalid, labels, onAdd, onRemove, onUpdate, productMaterials, rows } = props
  const disabled = productMaterials.length === 0

  return (
    <div className="grid gap-3" hidden={!active} role="tabpanel">
      <ScopeHeader disabled={disabled} labels={labels} onAdd={onAdd} />
      {disabled ? <EmptyScope text={labels.pieceGlobalScopeEmptyDescription} /> : null}
      {rows.map((row, index) => (
        <RequirementRowFields
          idName="globalProductMaterialId"
          invalid={invalid}
          key={row.key}
          labels={labels}
          materialOptions={productMaterials.map(material => ({
            label: formatProductMaterial(material),
            value: material.id
          }))}
          onRemove={() => { onRemove(row.key) }}
          onUpdate={patch => { onUpdate(row.key, patch) }}
          quantityName="globalQuantity"
          row={row}
          rowIndex={index}
        />
      ))}
    </div>
  )
}

/**
 * Renders combination-specific material requirement rows.
 *
 * @param props - Combination panel props.
 * @returns Combination requirement panel.
 */
export function CombinationRequirementsPanel(props: {
  readonly active: boolean
  readonly combination: ProductWorkspaceCombination
  readonly invalid: boolean
  readonly labels: ProductWorkspaceLabels
  readonly onAdd: (combination: ProductWorkspaceCombination) => void
  readonly onRemove: (combinationId: string, key: string) => void
  readonly onUpdate: (
    combinationId: string,
    key: string,
    patch: Partial<RequirementRow>
  ) => void
  readonly rows: readonly RequirementRow[]
}): ReactElement {
  const { active, combination, invalid, labels, onAdd, onRemove, onUpdate, rows } = props
  const disabled = combination.materialAssignments.length === 0

  return (
    <div className="grid gap-3" hidden={!active} role="tabpanel">
      <ScopeHeader
        disabled={disabled}
        labels={labels}
        onAdd={() => { onAdd(combination) }}
      />
      {disabled ? <EmptyScope text={labels.pieceCombinationScopeEmptyDescription} /> : null}
      {rows.map((row, index) => (
        <RequirementRowFields
          idName="combinationMaterialId"
          invalid={invalid}
          key={row.key}
          labels={labels}
          materialOptions={combination.materialAssignments.map(assignment => ({
            label: formatCombinationMaterial(assignment),
            value: assignment.id
          }))}
          onRemove={() => { onRemove(combination.id, row.key) }}
          onUpdate={patch => { onUpdate(combination.id, row.key, patch) }}
          quantityName="combinationQuantity"
          row={row}
          rowIndex={index}
        />
      ))}
    </div>
  )
}

function ScopeHeader(props: {
  readonly disabled: boolean
  readonly labels: ProductWorkspaceLabels
  readonly onAdd: () => void
}): ReactElement {
  const { disabled, labels, onAdd } = props

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {labels.pieceScopeAllLabel}
      </p>
      <Button disabled={disabled} onClick={onAdd} size="xs" type="button" variant="outline">
        <Plus aria-hidden="true" data-icon="inline-start" />
        {labels.pieceAddMaterialRequirement}
      </Button>
    </div>
  )
}

function EmptyScope(props: { readonly text: string }): ReactElement {
  return (
    <p className="border border-dashed bg-muted/30 p-3 text-sm text-muted-foreground">
      {props.text}
    </p>
  )
}

function RequirementRowFields(props: {
  readonly idName: string
  readonly invalid: boolean
  readonly labels: ProductWorkspaceLabels
  readonly materialOptions: ReadonlyArray<{
    readonly label: string
    readonly value: string
  }>
  readonly onRemove: () => void
  readonly onUpdate: (patch: Partial<RequirementRow>) => void
  readonly quantityName: string
  readonly row: RequirementRow
  readonly rowIndex: number
}): ReactElement {
  const {
    idName,
    invalid,
    labels,
    materialOptions,
    onRemove,
    onUpdate,
    quantityName,
    row,
    rowIndex
  } = props

  return (
    <div className="grid gap-2 border p-3" data-invalid={invalid}>
      <div className="grid gap-2 sm:grid-cols-[1fr_5rem_auto]">
        <div className="grid gap-2">
          <Label htmlFor={`${idName}-${row.key}`}>{labels.materialSelectLabel}</Label>
          <Select
            name={idName}
            onValueChange={value => { onUpdate({ materialId: value }) }}
            required
            value={row.materialId}
          >
            <SelectTrigger
              aria-invalid={invalid}
              id={`${idName}-${row.key}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {materialOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${quantityName}-${row.key}`}>{labels.pieceQuantityLabel}</Label>
          <Input
            aria-label={`${labels.pieceQuantityLabel} ${rowIndex + 1}`}
            aria-invalid={invalid}
            id={`${quantityName}-${row.key}`}
            min={1}
            name={quantityName}
            onChange={event => { onUpdate({ quantity: Number(event.target.value) }) }}
            required
            type="number"
            value={row.quantity}
          />
        </div>
        <Button
          aria-label={`${labels.pieceRemoveMaterialRequirement} ${rowIndex + 1}`}
          className="self-end"
          onClick={onRemove}
          size="icon-sm"
          type="button"
          variant="outline"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
