'use client'

import type { ReactElement } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { MaterialIconKey } from '@/core/constants/material-icons.constants'
import type { FormFieldErrors } from '@/core/types/form-state.types'

import type { ProductWorkspaceLabels } from '@/views/ProductWorkspace/types/product-workspace.types'
import { MaterialIconPicker } from './MaterialIconPicker'
import { MaterialPreview } from './MaterialPreview'

type MaterialNewFieldsProps = {
  readonly fieldErrors?: FormFieldErrors
  readonly hexColor: string
  readonly iconKey: MaterialIconKey
  readonly labelName: string
  readonly labels: ProductWorkspaceLabels
  readonly name: string
  readonly onHexColorChange: (hexColor: string) => void
  readonly onIconKeyChange: (iconKey: MaterialIconKey) => void
  readonly onLabelNameChange: (labelName: string) => void
  readonly onNameChange: (name: string) => void
  readonly onPriceCopChange: (priceCop: string) => void
  readonly onWidthCmChange: (widthCm: string) => void
  readonly priceCop: string
  readonly widthCm: string
}

/**
 * Renders controlled inputs for creating a catalog material from a product.
 *
 * @param props - New material field props.
 * @returns New material field element.
 */
export function MaterialNewFields(props: MaterialNewFieldsProps): ReactElement {
  const {
    hexColor,
    fieldErrors = {},
    iconKey,
    labelName,
    labels,
    name,
    onHexColorChange,
    onIconKeyChange,
    onLabelNameChange,
    onNameChange,
    onPriceCopChange,
    onWidthCmChange,
    priceCop,
    widthCm
  } = props

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_14rem]">
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="new-material-name">{labels.materialNameLabel}</Label>
            <Input
              aria-invalid={Boolean(fieldErrors.name)}
              autoComplete="off"
              id="new-material-name"
              name="name"
              onChange={event => {
                onNameChange(event.target.value)
              }}
              placeholder={labels.materialNamePlaceholder}
              value={name}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-material-label-name">{labels.materialLabelNameLabel}</Label>
            <Input
              aria-invalid={Boolean(fieldErrors.labelName)}
              autoComplete="off"
              id="new-material-label-name"
              name="labelName"
              onChange={event => {
                onLabelNameChange(event.target.value)
              }}
              placeholder={labels.materialLabelNamePlaceholder}
              value={labelName}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="new-material-width">{labels.materialWidthLabel}</Label>
            <Input
              aria-invalid={Boolean(fieldErrors.widthCm)}
              id="new-material-width"
              min="0.01"
              name="widthCm"
              onChange={event => {
                onWidthCmChange(event.target.value)
              }}
              placeholder={labels.materialWidthPlaceholder}
              step="0.01"
              type="number"
              value={widthCm}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-material-price">{labels.materialPriceLabel}</Label>
            <Input
              aria-invalid={Boolean(fieldErrors.priceCop)}
              id="new-material-price"
              min="0"
              name="priceCop"
              onChange={event => {
                onPriceCopChange(event.target.value)
              }}
              placeholder={labels.materialPricePlaceholder}
              step="1"
              type="number"
              value={priceCop}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-material-color">{labels.materialColorLabel}</Label>
          <Input
            aria-invalid={Boolean(fieldErrors.hexColor)}
            className="h-11 p-1"
            id="new-material-color"
            name="hexColor"
            onChange={event => {
              onHexColorChange(event.target.value)
            }}
            type="color"
            value={hexColor}
          />
        </div>
      </div>

      <MaterialPreview
        hexColor={hexColor}
        iconKey={iconKey}
        name={name}
        widthCm={widthCm}
      />

      <div className="grid gap-2 lg:col-span-2">
        <Label>{labels.materialIconLabel}</Label>
        <MaterialIconPicker
          labels={labels}
          onChange={onIconKeyChange}
          value={iconKey}
        />
      </div>
    </div>
  )
}
