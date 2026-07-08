'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { ReactElement } from 'react'
import { useState } from 'react'

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
  ProductWorkspaceCombinationMaterialAssignment,
  ProductWorkspaceLabels,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'

type AssignmentRow = {
  readonly key: string
  readonly productMaterialId: string
  readonly roleId: string
}

type CombinationMaterialAssignmentsFieldProps = {
  readonly assignments: readonly ProductWorkspaceCombinationMaterialAssignment[]
  readonly invalid?: boolean
  readonly labels: ProductWorkspaceLabels
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
}

function toAssignmentRows(
  assignments: readonly ProductWorkspaceCombinationMaterialAssignment[]
): AssignmentRow[] {
  return assignments.map(assignment => ({
    key: assignment.id,
    productMaterialId: assignment.productMaterial.id,
    roleId: assignment.roleId
  }))
}

function normalizeRoleInput(roleId: string): string {
  return roleId
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_]+/g, '-')
}

/**
 * Renders editable material-role assignments for one combination.
 *
 * @param props - Combination material assignment field props.
 * @returns Assignment field element.
 */
export function CombinationMaterialAssignmentsField(
  props: CombinationMaterialAssignmentsFieldProps
): ReactElement {
  const { assignments, invalid = false, labels, productMaterials } = props
  const [rows, setRows] = useState<readonly AssignmentRow[]>(toAssignmentRows(assignments))
  const canAssignMaterials = productMaterials.length > 0

  function addRow(): void {
    setRows(currentRows => [
      ...currentRows,
      {
        key: crypto.randomUUID(),
        productMaterialId: productMaterials[0]?.id ?? '',
        roleId: `material-${currentRows.length + 1}`
      }
    ])
  }

  function updateRow(key: string, patch: Partial<AssignmentRow>): void {
    setRows(currentRows =>
      currentRows.map(row => (row.key === key ? { ...row, ...patch } : row))
    )
  }

  function removeRow(key: string): void {
    setRows(currentRows => currentRows.filter(row => row.key !== key))
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{labels.combinationMaterialAssignmentsLabel}</Label>
        <Button
          disabled={!canAssignMaterials}
          onClick={addRow}
          size="xs"
          type="button"
          variant="outline"
        >
          <Plus aria-hidden="true" data-icon="inline-start" />
          {labels.addCombinationMaterial}
        </Button>
      </div>

      {canAssignMaterials ? (
        <div className="grid gap-3" data-invalid={invalid}>
          {rows.map((row, index) => (
            <div className="grid gap-2 border p-3" key={row.key}>
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <div className="grid gap-2">
                  <Label htmlFor={`material-role-${row.key}`}>
                    {labels.combinationMaterialRoleLabel}
                  </Label>
                  <Input
                    aria-label={`${labels.combinationMaterialRoleLabel} ${index + 1}`}
                    aria-invalid={invalid}
                    id={`material-role-${row.key}`}
                    name="materialRoleId"
                    onChange={event => {
                      updateRow(row.key, { roleId: normalizeRoleInput(event.target.value) })
                    }}
                    required
                    value={row.roleId}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`material-role-material-${row.key}`}>
                    {labels.combinationMaterialMaterialLabel}
                  </Label>
                  <Select
                    name="materialRoleProductMaterialId"
                    onValueChange={value => {
                      updateRow(row.key, { productMaterialId: value })
                    }}
                    required
                    value={row.productMaterialId}
                  >
                    <SelectTrigger
                      aria-invalid={invalid}
                      id={`material-role-material-${row.key}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {productMaterials.map(productMaterial => (
                        <SelectItem key={productMaterial.id} value={productMaterial.id}>
                          {productMaterial.material.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  aria-label={`${labels.removeCombinationMaterial} ${index + 1}`}
                  className="self-end"
                  onClick={() => {
                    removeRow(row.key)
                  }}
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="border border-dashed bg-muted/30 p-3 text-sm text-muted-foreground">
          {labels.combinationMaterialEmptyDescription}
        </p>
      )}
    </div>
  )
}
