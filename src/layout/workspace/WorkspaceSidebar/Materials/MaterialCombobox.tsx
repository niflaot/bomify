'use client'

import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/core/utils/class-name/class-name.utils'

import type {
  ProductWorkspaceLabels,
  ProductWorkspaceMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { MaterialSwatch } from './MaterialSwatch'

type MaterialComboboxProps = {
  readonly defaultMaterialId?: string
  readonly invalid?: boolean
  readonly inputId: string
  readonly labels: ProductWorkspaceLabels
  readonly materials: readonly ProductWorkspaceMaterial[]
}

function findInitialMaterialId(
  materials: readonly ProductWorkspaceMaterial[],
  defaultMaterialId: string | undefined
): string {
  if (defaultMaterialId && materials.some(material => material.id === defaultMaterialId)) {
    return defaultMaterialId
  }

  return materials[0]?.id ?? ''
}

/**
 * Renders a searchable material combobox backed by a hidden form value.
 *
 * @param props - Material combobox props.
 * @returns Material combobox element.
 */
export function MaterialCombobox(props: MaterialComboboxProps): ReactElement {
  const { defaultMaterialId, inputId, invalid = false, labels, materials } = props
  const [query, setQuery] = useState('')
  const [selectedMaterialId, setSelectedMaterialId] = useState(
    findInitialMaterialId(materials, defaultMaterialId)
  )
  const normalizedQuery = query.trim().toLowerCase()
  const filteredMaterials = useMemo(
    () =>
      materials.filter(material => {
        if (!normalizedQuery) {
          return true
        }

        return material.name.toLowerCase().includes(normalizedQuery)
      }),
    [materials, normalizedQuery]
  )

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId}>{labels.materialSelectLabel}</Label>
      <input name="materialId" type="hidden" value={selectedMaterialId} />
      <Input
        aria-invalid={invalid}
        autoComplete="off"
        id={inputId}
        onChange={event => {
          setQuery(event.target.value)
        }}
        placeholder={labels.materialCatalogSearchPlaceholder}
        type="search"
        value={query}
      />
      <div className="max-h-48 overflow-y-auto border" data-invalid={invalid} role="listbox">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map(material => {
            const selected = material.id === selectedMaterialId

            return (
              <button
                aria-selected={selected}
                className={cn(
                  'grid w-full grid-cols-[auto_1fr] items-center gap-3 border-b p-3 text-left last:border-b-0',
                  selected ? 'bg-muted text-foreground' : 'bg-background text-muted-foreground'
                )}
                key={material.id}
                onClick={() => {
                  setSelectedMaterialId(material.id)
                }}
                role="option"
                type="button"
              >
                <MaterialSwatch
                  className="grid size-9 place-items-center border"
                  hexColor={material.hexColor}
                  iconKey={material.iconKey}
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{material.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {material.widthCm} cm
                  </span>
                </span>
              </button>
            )
          })
        ) : (
          <p className="p-3 text-sm text-muted-foreground">
            {labels.materialCatalogEmptyDescription}
          </p>
        )}
      </div>
    </div>
  )
}
