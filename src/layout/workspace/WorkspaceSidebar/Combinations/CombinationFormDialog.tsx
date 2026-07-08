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
import type { ProductCombinationFormState } from '@/core/types/product-combination.types'

import type {
  ProductCombinationFormAction,
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { CombinationMaterialAssignmentsField } from './CombinationMaterialAssignmentsField'

type CombinationFormDialogProps = {
  readonly action: ProductCombinationFormAction
  readonly combination?: ProductWorkspaceCombination
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
  readonly trigger: ReactElement
  readonly variant: 'create' | 'update'
}

type CombinationFormProps = Omit<CombinationFormDialogProps, 'trigger'> & {
  readonly onSuccess: () => void
}

function SubmitButton(props: {
  readonly labels: ProductWorkspaceLabels
  readonly variant: 'create' | 'update'
}): ReactElement {
  const { labels, variant } = props
  const { pending } = useFormStatus()
  const text = variant === 'create' ? labels.createCombination : labels.saveCombination

  return (
    <Button disabled={pending} type="submit">
      <Save aria-hidden="true" data-icon="inline-start" />
      {pending ? labels.saving : text}
    </Button>
  )
}

function CombinationForm(props: CombinationFormProps): ReactElement {
  const {
    action,
    combination,
    labels,
    onSuccess,
    productId,
    productMaterials,
    variant
  } = props
  const [state, formAction] = useActionState<ProductCombinationFormState, FormData>(
    action,
    {}
  )
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
        successMessage={labels.combinationSavedToast}
      />
      <input name="productId" type="hidden" value={productId} />
      {combination ? (
        <input name="combinationId" type="hidden" value={combination.id} />
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor={`${variant}-combination-name`}>{labels.combinationNameLabel}</Label>
        <Input
          aria-invalid={Boolean(fieldErrors.name)}
          autoComplete="off"
          defaultValue={combination?.name}
          id={`${variant}-combination-name`}
          name="name"
          placeholder={labels.combinationNamePlaceholder}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${variant}-combination-color`}>
          {labels.combinationColorLabel}
        </Label>
        <Input
          aria-invalid={Boolean(fieldErrors.hexColor)}
          className="h-11 p-1"
          defaultValue={combination?.hexColor ?? '#111111'}
          id={`${variant}-combination-color`}
          name="hexColor"
          required
          type="color"
        />
      </div>

      <CombinationMaterialAssignmentsField
        assignments={combination?.materialAssignments ?? []}
        invalid={Boolean(fieldErrors.materialRoleId)}
        labels={labels}
        productMaterials={productMaterials}
      />

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
 * Renders the create or edit combination dialog.
 *
 * @param props - Combination dialog props.
 * @returns Combination form dialog element.
 */
export function CombinationFormDialog(props: CombinationFormDialogProps): ReactElement {
  const { action, combination, labels, productId, productMaterials, trigger, variant } = props
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const title = variant === 'create' ? labels.combinationCreateTitle : labels.editCombination

  function handleOpenChange(nextOpen: boolean): void {
    setOpen(nextOpen)

    if (nextOpen) {
      setFormKey(current => current + 1)
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl" closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{labels.combinationsPanelDescription}</DialogDescription>
        </DialogHeader>
        <CombinationForm
          action={action}
          combination={combination}
          key={formKey}
          labels={labels}
          onSuccess={() => {
            setOpen(false)
          }}
          productId={productId}
          productMaterials={productMaterials}
          variant={variant}
        />
      </DialogContent>
    </Dialog>
  )
}
