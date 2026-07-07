'use client'

import { Save } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormLoadingBar } from '@/components/ui/loading-bar'
import type { PieceFormState } from '@/core/types/piece.types'

import type {
  PieceFormAction,
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece,
  ProductWorkspaceProductMaterial
} from '../../product-workspace.types'
import { PieceDxfDropzone } from './PieceDxfDropzone'
import { PieceMaterialRequirementsField } from './PieceMaterialRequirementsField'

type PieceFormDialogProps = {
  readonly action: PieceFormAction
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly piece?: ProductWorkspacePiece
  readonly productId: string
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
  readonly trigger: ReactElement
  readonly variant: 'create' | 'update'
}

type PieceFormProps = Omit<PieceFormDialogProps, 'trigger'> & {
  readonly onSuccess: () => void
}

function formatCm(mm: number): string {
  return Number((mm / 10).toFixed(2)).toString()
}

function SubmitButton(props: {
  readonly labels: ProductWorkspaceLabels
  readonly variant: 'create' | 'update'
}): ReactElement {
  const { labels, variant } = props
  const { pending } = useFormStatus()
  const text = variant === 'create' ? labels.createPiece : labels.pieceSave

  return (
    <Button disabled={pending} type="submit">
      <Save aria-hidden="true" data-icon="inline-start" />
      {pending ? labels.saving : text}
    </Button>
  )
}

function PieceForm(props: PieceFormProps): ReactElement {
  const {
    action,
    combinations,
    labels,
    onSuccess,
    piece,
    productId,
    productMaterials,
    variant
  } = props
  const [state, formAction] = useActionState<PieceFormState, FormData>(action, {})
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
        successMessage={labels.pieceSavedToast}
      />
      <input name="productId" type="hidden" value={productId} />
      {piece ? <input name="pieceId" type="hidden" value={piece.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-[7rem_1fr]">
        <div className="grid gap-2">
          <Label htmlFor={`${variant}-piece-number`}>{labels.pieceNumberLabel}</Label>
          <Input
            aria-invalid={Boolean(fieldErrors.number)}
            defaultValue={piece?.number}
            id={`${variant}-piece-number`}
            min={1}
            name="number"
            required
            type="number"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${variant}-piece-name`}>{labels.pieceNameLabel}</Label>
          <Input
            aria-invalid={Boolean(fieldErrors.name)}
            autoComplete="off"
            defaultValue={piece?.name}
            id={`${variant}-piece-name`}
            name="name"
            placeholder={labels.pieceNamePlaceholder}
            required
          />
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.95fr)]">
        <PieceMaterialRequirementsField
          combinations={combinations}
          invalid={Boolean(fieldErrors.materialRequirements)}
          labels={labels}
          productMaterials={productMaterials}
          requirements={piece?.materialRequirements ?? []}
        />

        <div className="grid content-start gap-4">
          <PieceDxfDropzone
            id={`${variant}-piece-dxf`}
            invalid={Boolean(fieldErrors.dxf)}
            labels={labels}
            piece={piece}
            required={variant === 'create'}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`${variant}-piece-width`}>{labels.pieceWidthLabel}</Label>
              <Input
                aria-invalid={Boolean(fieldErrors.widthCm)}
                defaultValue={piece ? formatCm(piece.widthMm) : undefined}
                id={`${variant}-piece-width`}
                min="0.01"
                name="widthCm"
                step="0.01"
                type="number"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${variant}-piece-height`}>{labels.pieceHeightLabel}</Label>
              <Input
                aria-invalid={Boolean(fieldErrors.heightCm)}
                defaultValue={piece ? formatCm(piece.heightMm) : undefined}
                id={`${variant}-piece-height`}
                min="0.01"
                name="heightCm"
                step="0.01"
                type="number"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {labels.cancel}
          </Button>
        </DialogClose>
        <SubmitButton labels={labels} variant={variant} />
      </div>
    </form>
  )
}

/**
 * Renders the create or edit piece dialog.
 *
 * @param props - Piece dialog props.
 * @returns Piece form dialog element.
 */
export function PieceFormDialog(props: PieceFormDialogProps): ReactElement {
  const { labels, trigger, variant } = props
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const title = variant === 'create' ? labels.addPiece : labels.editPiece

  function handleOpenChange(nextOpen: boolean): void {
    setOpen(nextOpen)

    if (nextOpen) {
      setFormKey(current => current + 1)
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] max-w-5xl overflow-y-auto" closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{labels.piecesPanelDescription}</DialogDescription>
        </DialogHeader>
        <PieceForm
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
