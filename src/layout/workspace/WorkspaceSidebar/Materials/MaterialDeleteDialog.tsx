'use client'

import { Trash2 } from 'lucide-react'
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
import type { MaterialFormState } from '@/core/types/material.types'

import type {
  MaterialFormAction,
  ProductWorkspaceLabels,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/product-workspace.types'

type MaterialDeleteDialogProps = {
  readonly action: MaterialFormAction
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
  readonly productMaterial: ProductWorkspaceProductMaterial
}

function SubmitButton(props: { readonly labels: ProductWorkspaceLabels }): ReactElement {
  const { labels } = props
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} type="submit" variant="destructive">
      <Trash2 aria-hidden="true" data-icon="inline-start" />
      {pending ? labels.deleting : labels.deleteMaterial}
    </Button>
  )
}

function MaterialDeleteForm(props: MaterialDeleteDialogProps & {
  readonly onSuccess: () => void
}): ReactElement {
  const { action, labels, onSuccess, productId, productMaterial } = props
  const [state, formAction] = useActionState<MaterialFormState, FormData>(action, {})

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
        successMessage={labels.materialRemovedToast}
      />
      <input name="productId" type="hidden" value={productId} />
      <input name="productMaterialId" type="hidden" value={productMaterial.id} />

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
 * Renders the product material detach confirmation dialog.
 *
 * @param props - Delete material dialog props.
 * @returns Delete material dialog element.
 */
export function MaterialDeleteDialog(props: MaterialDeleteDialogProps): ReactElement {
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
          aria-label={`${labels.deleteMaterial}: ${productMaterial.material.name}`}
          size="icon-xs"
          type="button"
          variant="destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{labels.materialDeleteTitle}</DialogTitle>
          <DialogDescription>{labels.materialDeleteDescription}</DialogDescription>
        </DialogHeader>
        <p className="border bg-muted/40 p-3 text-sm font-medium">
          {productMaterial.material.name}
        </p>
        <MaterialDeleteForm
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
