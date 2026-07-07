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
import type { ProductCombinationFormState } from '@/core/types/product-combination.types'

import type {
  ProductCombinationFormAction,
  ProductWorkspaceCombination,
  ProductWorkspaceLabels
} from '@/views/ProductWorkspace/product-workspace.types'

type CombinationDeleteDialogProps = {
  readonly action: ProductCombinationFormAction
  readonly combination: ProductWorkspaceCombination
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
}

function DeleteButton(props: { readonly labels: ProductWorkspaceLabels }): ReactElement {
  const { labels } = props
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} type="submit" variant="destructive">
      <Trash2 aria-hidden="true" data-icon="inline-start" />
      {pending ? labels.deleting : labels.deleteCombination}
    </Button>
  )
}

function DeleteForm(props: CombinationDeleteDialogProps & {
  readonly onSuccess: () => void
}): ReactElement {
  const { action, combination, labels, onSuccess, productId } = props
  const [state, formAction] = useActionState<ProductCombinationFormState, FormData>(
    action,
    {}
  )

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
        successMessage={labels.combinationRemovedToast}
      />
      <input name="productId" type="hidden" value={productId} />
      <input name="combinationId" type="hidden" value={combination.id} />

      <div className="flex justify-end gap-3">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {labels.cancel}
          </Button>
        </DialogClose>
        <DeleteButton labels={labels} />
      </div>
    </form>
  )
}

/**
 * Renders a soft-delete confirmation dialog for one combination.
 *
 * @param props - Delete dialog props.
 * @returns Combination delete dialog element.
 */
export function CombinationDeleteDialog(
  props: CombinationDeleteDialogProps
): ReactElement {
  const { combination, labels } = props
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
        <Button aria-label={`${labels.deleteCombination}: ${combination.name}`} size="icon-xs" type="button" variant="destructive">
          <Trash2 aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{labels.combinationDeleteTitle}</DialogTitle>
          <DialogDescription>
            {labels.combinationDeleteDescription}
          </DialogDescription>
        </DialogHeader>
        <p className="border bg-muted/40 p-3 text-sm font-medium">{combination.name}</p>
        <DeleteForm
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
