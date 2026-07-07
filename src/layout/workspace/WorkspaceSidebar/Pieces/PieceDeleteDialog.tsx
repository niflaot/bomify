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
import type { PieceFormState } from '@/core/types/piece.types'

import type {
  PieceFormAction,
  ProductWorkspaceLabels,
  ProductWorkspacePiece
} from '@/views/ProductWorkspace/product-workspace.types'

type PieceDeleteDialogProps = {
  readonly action: PieceFormAction
  readonly labels: ProductWorkspaceLabels
  readonly piece: ProductWorkspacePiece
  readonly productId: string
}

function SubmitButton(props: { readonly labels: ProductWorkspaceLabels }): ReactElement {
  const { labels } = props
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} type="submit" variant="destructive">
      <Trash2 aria-hidden="true" data-icon="inline-start" />
      {pending ? labels.deleting : labels.deletePiece}
    </Button>
  )
}

function PieceDeleteForm(props: PieceDeleteDialogProps & {
  readonly onSuccess: () => void
}): ReactElement {
  const { action, labels, onSuccess, piece, productId } = props
  const [state, formAction] = useActionState<PieceFormState, FormData>(action, {})

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
        successMessage={labels.pieceRemovedToast}
      />
      <input name="productId" type="hidden" value={productId} />
      <input name="pieceId" type="hidden" value={piece.id} />

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
 * Renders a soft-delete confirmation dialog for one piece.
 *
 * @param props - Delete dialog props.
 * @returns Piece delete dialog element.
 */
export function PieceDeleteDialog(props: PieceDeleteDialogProps): ReactElement {
  const { labels, piece } = props
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
          aria-label={`${labels.deletePiece}: ${piece.name}`}
          size="icon-xs"
          type="button"
          variant="destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{labels.pieceDeleteTitle}</DialogTitle>
          <DialogDescription>{labels.pieceDeleteDescription}</DialogDescription>
        </DialogHeader>
        <p className="border bg-muted/40 p-3 text-sm font-medium">{piece.name}</p>
        <PieceDeleteForm
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
