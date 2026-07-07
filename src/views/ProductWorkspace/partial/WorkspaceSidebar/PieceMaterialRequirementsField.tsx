'use client'

import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePieceMaterialRequirement,
  ProductWorkspaceProductMaterial
} from '../../product-workspace.types'
import {
  CombinationRequirementsPanel,
  GlobalRequirementsPanel,
  type RequirementRow
} from './PieceRequirementPanels'

type ScopeKey = 'global' | `combination:${string}`

type PieceMaterialRequirementsFieldProps = {
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
  readonly requirements: readonly ProductWorkspacePieceMaterialRequirement[]
}

function createRow(materialId: string, index: number): RequirementRow {
  return {
    key: crypto.randomUUID(),
    materialId,
    quantity: index + 1
  }
}

function getInitialGlobalRows(
  requirements: readonly ProductWorkspacePieceMaterialRequirement[]
): RequirementRow[] {
  return requirements.flatMap(requirement => requirement.productMaterial
    ? [{
        key: requirement.id,
        materialId: requirement.productMaterial.id,
        quantity: requirement.quantity
      }]
    : [])
}

function getInitialCombinationRows(
  combinations: readonly ProductWorkspaceCombination[],
  requirements: readonly ProductWorkspacePieceMaterialRequirement[]
): Record<string, readonly RequirementRow[]> {
  const rows: Record<string, RequirementRow[]> = Object.fromEntries(
    combinations.map(combination => [combination.id, []])
  )

  requirements.forEach(requirement => {
    const assignment = requirement.combinationMaterial

    if (!assignment) {
      return
    }

    const combination = combinations.find(candidate =>
      candidate.materialAssignments.some(item => item.id === assignment.id)
    )

    if (!combination) {
      return
    }

    rows[combination.id].push({
      key: requirement.id,
      materialId: assignment.id,
      quantity: requirement.quantity
    })
  })

  return rows
}

/**
 * Renders scoped material quantity rows for a piece form.
 *
 * @param props - Requirement field props.
 * @returns Scoped material requirement editor.
 */
export function PieceMaterialRequirementsField(
  props: PieceMaterialRequirementsFieldProps
): ReactElement {
  const { combinations, labels, productMaterials, requirements } = props
  const [activeScope, setActiveScope] = useState<ScopeKey>('global')
  const [globalRows, setGlobalRows] = useState<readonly RequirementRow[]>(
    getInitialGlobalRows(requirements)
  )
  const [combinationRows, setCombinationRows] = useState<Record<string, readonly RequirementRow[]>>(
    () => getInitialCombinationRows(combinations, requirements)
  )
  const scopes = useMemo(() => [
    { key: 'global' as const, label: labels.pieceGlobalScopeLabel },
    ...combinations.map(combination => ({
      key: `combination:${combination.id}` as const,
      label: combination.name
    }))
  ], [combinations, labels.pieceGlobalScopeLabel])

  function addGlobalRow(): void {
    const firstMaterial = productMaterials[0]

    if (!firstMaterial) {
      return
    }

    setGlobalRows(currentRows => [
      ...currentRows,
      createRow(firstMaterial.id, currentRows.length)
    ])
  }

  function addCombinationRow(combination: ProductWorkspaceCombination): void {
    const firstAssignment = combination.materialAssignments[0]

    if (!firstAssignment) {
      return
    }

    setCombinationRows(currentRows => {
      const rows = currentRows[combination.id] ?? []

      return {
        ...currentRows,
        [combination.id]: [...rows, createRow(firstAssignment.id, rows.length)]
      }
    })
  }

  function updateGlobalRow(key: string, patch: Partial<RequirementRow>): void {
    setGlobalRows(currentRows =>
      currentRows.map(row => row.key === key ? { ...row, ...patch } : row)
    )
  }

  function updateCombinationRow(
    combinationId: string,
    key: string,
    patch: Partial<RequirementRow>
  ): void {
    setCombinationRows(currentRows => ({
      ...currentRows,
      [combinationId]: (currentRows[combinationId] ?? []).map(row =>
        row.key === key ? { ...row, ...patch } : row
      )
    }))
  }

  function removeGlobalRow(key: string): void {
    setGlobalRows(currentRows => currentRows.filter(row => row.key !== key))
  }

  function removeCombinationRow(combinationId: string, key: string): void {
    setCombinationRows(currentRows => ({
      ...currentRows,
      [combinationId]: (currentRows[combinationId] ?? []).filter(row => row.key !== key)
    }))
  }

  return (
    <div className="grid content-start gap-3 self-start">
      <Label>{labels.pieceMaterialsLabel}</Label>
      <div className="flex flex-wrap gap-2" role="tablist">
        {scopes.map(scope => (
          <Button
            aria-selected={activeScope === scope.key}
            key={scope.key}
            onClick={() => {
              setActiveScope(scope.key)
            }}
            role="tab"
            size="xs"
            type="button"
            variant={activeScope === scope.key ? 'default' : 'outline'}
          >
            {scope.label}
          </Button>
        ))}
      </div>
      <GlobalRequirementsPanel
        active={activeScope === 'global'}
        labels={labels}
        onAdd={addGlobalRow}
        onRemove={removeGlobalRow}
        onUpdate={updateGlobalRow}
        productMaterials={productMaterials}
        rows={globalRows}
      />
      {combinations.map(combination => (
        <CombinationRequirementsPanel
          active={activeScope === `combination:${combination.id}`}
          combination={combination}
          key={combination.id}
          labels={labels}
          onAdd={addCombinationRow}
          onRemove={removeCombinationRow}
          onUpdate={updateCombinationRow}
          rows={combinationRows[combination.id] ?? []}
        />
      ))}
    </div>
  )
}
