'use client'

import { Pencil, Save } from 'lucide-react'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

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
import type { MaterialFormState } from '@/core/types/material.types'

import type {
  MaterialFormAction,
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspaceMaterial,
  ProductWorkspaceProductMaterial
} from '../../product-workspace.types'
import { MaterialCombobox } from './MaterialCombobox'
import { MaterialScopeSelect } from './MaterialScopeSelect'

type MaterialEditDialogProps = {
  readonly action: MaterialFormAction
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly materials: readonly ProductWorkspaceMaterial[]
  readonly productId: string
  readonly productMaterial: ProductWorkspaceProductMaterial
}

function SubmitButton(props: { readonly labels: ProductWorkspaceLabels }): ReactElement {
  const { labels } = props
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} type="submit">
      <Save aria-hidden="true" data-icon="inline-start" />
      {pending ? labels.saving : labels.saveMaterial}
    </Button>
  )
}

function MaterialEditForm(props: MaterialEditDialogProps & {
  readonly onSuccess: () => void
}): ReactElement {
  const { action, combinations, labels, materials, onSuccess, productId, productMaterial } = props
  const [state, formAction] = useActionState<MaterialFormState, FormData>(action, {})

  useEffect(() => {
    if (state.status === 'success') {
      onSuccess()
    }
  }, [onSuccess, state.status])

  return (
    <form action={formAction} className="grid gap-5">
      <FormLoadingBar />
      <input name="productId" type="hidden" value={productId} />
      <input name="productMaterialId" type="hidden" value={productMaterial.id} />

      <MaterialCombobox
        defaultMaterialId={productMaterial.material.id}
        inputId={`edit-material-${productMaterial.id}`}
        labels={labels}
        materials={materials}
      />
      <MaterialScopeSelect
        combinations={combinations}
        defaultCombinationId={productMaterial.combinationId}
        inputId={`edit-material-scope-${productMaterial.id}`}
        labels={labels}
      />

      {state.message ? (
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

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
 * Renders the product material edit dialog.
 *
 * @param props - Edit material dialog props.
 * @returns Edit material dialog element.
 */
export function MaterialEditDialog(props: MaterialEditDialogProps): ReactElement {
  const { labels, productMaterial } = props
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
        <Button
          aria-label={`${labels.editMaterial}: ${productMaterial.material.name}`}
          size="icon-xs"
          type="button"
          variant="outline"
        >
          <Pencil aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{labels.editMaterial}</DialogTitle>
          <DialogDescription>{labels.materialsPanelDescription}</DialogDescription>
        </DialogHeader>
        <MaterialEditForm
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
