'use client'

import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { MaterialIconKey } from '@/core/constants/material-icons.constants'
import { cn } from '@/core/utils/class-name/class-name.utils'

import type { ProductWorkspaceLabels } from '@/views/ProductWorkspace/types/product-workspace.types'
import { MaterialIcon, materialIconOptions } from './material-icon.utils'

type MaterialIconPickerProps = {
  readonly labels: ProductWorkspaceLabels
  readonly onChange: (iconKey: MaterialIconKey) => void
  readonly value: MaterialIconKey
}

/**
 * Renders a searchable Lucide icon picker for catalog materials.
 *
 * @param props - Material icon picker props.
 * @returns Material icon picker element.
 */
export function MaterialIconPicker(props: MaterialIconPickerProps): ReactElement {
  const { labels, onChange, value } = props
  const [query, setQuery] = useState('')
  const normalizedQuery = query.replace(/[^a-z0-9]/gi, '').toLowerCase()
  const visibleOptions = useMemo(
    () =>
      materialIconOptions
        .filter(option => option.searchText.includes(normalizedQuery))
        .slice(0, 80),
    [normalizedQuery]
  )

  return (
    <div className="grid gap-2">
      <input name="iconKey" type="hidden" value={value} />
      <Input
        aria-label={labels.materialIconSearchLabel}
        onChange={event => {
          setQuery(event.target.value)
        }}
        placeholder={labels.materialIconSearchPlaceholder}
        type="search"
        value={query}
      />
      <div className="grid max-h-48 grid-cols-6 gap-2 overflow-y-auto border p-2">
        {visibleOptions.map(option => {
          const selected = option.key === value

          return (
            <Button
              aria-label={`${labels.materialIconLabel}: ${option.label}`}
              aria-pressed={selected}
              className={cn(selected && 'border-primary bg-muted text-foreground')}
              key={option.key}
              onClick={() => {
                onChange(option.key)
              }}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <MaterialIcon iconKey={option.key} />
            </Button>
          )
        })}
      </div>
    </div>
  )
}
