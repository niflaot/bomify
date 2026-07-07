'use client'

import { Plus, Save } from 'lucide-react'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { FormStateToast } from '@/components/FormStateToast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { FormLoadingBar } from '@/components/ui/loading-bar'
import { DEFAULT_MATERIAL_ICON_KEY, type MaterialIconKey } from '@/core/constants/material-icons.constants'
import type { MaterialFormState } from '@/core/types/material.types'

import type {
  MaterialFormAction,
  ProductWorkspaceLabels,
  ProductWorkspaceMaterial
} from '@/views/ProductWorkspace/product-workspace.types'
import { MaterialCombobox } from './MaterialCombobox'
import { MaterialNewFields } from './MaterialNewFields'

type MaterialAddDialogProps = {
  readonly action: MaterialFormAction
  readonly labels: ProductWorkspaceLabels
  readonly materials: readonly ProductWorkspaceMaterial[]
  readonly productId: string
}

function SubmitButton(props: { readonly labels: ProductWorkspaceLabels }): ReactElement {
  const { labels } = props
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} type="submit">
      <Save aria-hidden="true" data-icon="inline-start" />
      {pending ? labels.saving : labels.addMaterial}
    </Button>
  )
}

function MaterialAddForm(props: MaterialAddDialogProps & {
  readonly onSuccess: () => void
}): ReactElement {
  const { action, labels, materials, onSuccess, productId } = props
  const hasCatalog = materials.length > 0
  const [mode, setMode] = useState<'existing' | 'new'>(hasCatalog ? 'existing' : 'new')
  const [hexColor, setHexColor] = useState('#111111')
  const [iconKey, setIconKey] = useState<MaterialIconKey>(DEFAULT_MATERIAL_ICON_KEY)
  const [name, setName] = useState('')
  const [widthCm, setWidthCm] = useState('')
  const [state, formAction] = useActionState<MaterialFormState, FormData>(action, {})
  const activeMode = hasCatalog ? mode : 'new'
  const fieldErrors = state.fieldErrors ?? {}

  useEffect(() => {
    if (state.status === 'success') {
      onSuccess()
    }
  }, [onSuccess, state.status])

  return (
    <form action={formAction} className="grid gap-5">
      <FormLoadingBar />
      <FormStateToast
        errorFallback={labels.formErrorToast}
        state={state}
        successMessage={labels.materialSavedToast}
      />
      <input name="materialMode" type="hidden" value={activeMode} />
      <input name="productId" type="hidden" value={productId} />

      {hasCatalog ? (
        <div className="grid grid-cols-2 border">
          <Button
            aria-pressed={activeMode === 'existing'}
            className="border-0"
            onClick={() => {
              setMode('existing')
            }}
            type="button"
            variant={activeMode === 'existing' ? 'secondary' : 'ghost'}
          >
            {labels.selectExistingMaterial}
          </Button>
          <Button
            aria-pressed={activeMode === 'new'}
            className="border-0"
            onClick={() => {
              setMode('new')
            }}
            type="button"
            variant={activeMode === 'new' ? 'secondary' : 'ghost'}
          >
            {labels.newCatalogMaterial}
          </Button>
        </div>
      ) : null}

      {activeMode === 'existing' ? (
        <MaterialCombobox
          invalid={Boolean(fieldErrors.materialId)}
          inputId="add-material-search"
          labels={labels}
          materials={materials}
        />
      ) : (
        <MaterialNewFields
          fieldErrors={fieldErrors}
          hexColor={hexColor}
          iconKey={iconKey}
          labels={labels}
          name={name}
          onHexColorChange={setHexColor}
          onIconKeyChange={setIconKey}
          onNameChange={setName}
          onWidthCmChange={setWidthCm}
          widthCm={widthCm}
        />
      )}

      <div className="flex justify-end gap-3">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {labels.cancel}
          </Button>
        </DialogClose>
        <SubmitButton labels={labels} />
      </div>
    </form>
  )
}

/**
 * Renders the add product material dialog.
 *
 * @param props - Add material dialog props.
 * @returns Add material dialog element.
 */
export function MaterialAddDialog(props: MaterialAddDialogProps): ReactElement {
  const { labels } = props
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  function handleOpenChange(nextOpen: boolean): void {
    setOpen(nextOpen)

    if (nextOpen) {
      setFormKey(current => current + 1)
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start" type="button" variant="outline">
          <Plus aria-hidden="true" data-icon="inline-start" />
          {labels.addMaterial}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl" closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{labels.addMaterial}</DialogTitle>
          <DialogDescription>{labels.materialsPanelDescription}</DialogDescription>
        </DialogHeader>
        <MaterialAddForm
          {...props}
          key={formKey}
          onSuccess={() => {
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
