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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ADDITION_CATEGORIES, ADDITION_CATEGORY_ICONS } from '@/core/constants/addition-category.constants'
import type {
  ProductAdditionCategory,
  ProductAdditionFormState
} from '@/core/types/product-addition.types'

import type {
  ProductAdditionFormAction,
  ProductWorkspaceAddition,
  ProductWorkspaceLabels
} from '@/views/ProductWorkspace/types/product-workspace.types'

type AdditionFormDialogProps = {
  readonly action: ProductAdditionFormAction
  readonly addition?: ProductWorkspaceAddition
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
  readonly trigger: ReactElement
  readonly variant: 'create' | 'update'
}

type AdditionFormProps = Omit<AdditionFormDialogProps, 'trigger'> & {
  readonly onSuccess: () => void
}

function categoryLabel(
  labels: ProductWorkspaceLabels,
  category: ProductAdditionCategory
): string {
  const map: Record<ProductAdditionCategory, string> = {
    herrajes: labels.additionCategoryHerrajes,
    mano_obra: labels.additionCategoryManoDeObra,
    varios: labels.additionCategoryVarios
  }

  return map[category]
}

function SubmitButton(props: {
  readonly labels: ProductWorkspaceLabels
  readonly variant: 'create' | 'update'
}): ReactElement {
  const { labels, variant } = props
  const { pending } = useFormStatus()
  const text = variant === 'create' ? labels.addAddition : labels.saveAddition

  return (
    <Button disabled={pending} type="submit">
      <Save aria-hidden="true" data-icon="inline-start" />
      {pending ? labels.saving : text}
    </Button>
  )
}

function AdditionForm(props: AdditionFormProps): ReactElement {
  const { action, addition, labels, onSuccess, productId, variant } = props
  const [category, setCategory] = useState<ProductAdditionCategory>(
    addition?.category ?? 'herrajes'
  )
  const [name, setName] = useState(addition?.name ?? '')
  const [quantity, setQuantity] = useState(addition ? String(addition.quantity) : '')
  const [unitPriceCop, setUnitPriceCop] = useState(addition ? String(addition.unitPriceCop) : '')
  const [state, formAction] = useActionState<ProductAdditionFormState, FormData>(action, {})
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
        successMessage={labels.additionSavedToast}
      />
      <input name="productId" type="hidden" value={productId} />
      {addition ? <input name="additionId" type="hidden" value={addition.id} /> : null}
      <input name="category" type="hidden" value={category} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${variant}-addition-name`}>{labels.additionNameLabel}</Label>
          <Input
            aria-invalid={Boolean(fieldErrors.name)}
            autoComplete="off"
            id={`${variant}-addition-name`}
            name="name"
            onChange={event => {
              setName(event.target.value)
            }}
            placeholder={labels.additionNamePlaceholder}
            value={name}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${variant}-addition-category`}>{labels.additionCategoryLabel}</Label>
          <Select
            onValueChange={value => {
              setCategory(value as ProductAdditionCategory)
            }}
            value={category}
          >
            <SelectTrigger
              aria-invalid={Boolean(fieldErrors.category)}
              id={`${variant}-addition-category`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ADDITION_CATEGORIES.map(value => {
                const Icon = ADDITION_CATEGORY_ICONS[value]

                return (
                  <SelectItem key={value} value={value}>
                    <span className="flex items-center gap-2">
                      <Icon aria-hidden="true" className="size-3.5" />
                      {categoryLabel(labels, value)}
                    </span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${variant}-addition-quantity`}>{labels.additionQuantityLabel}</Label>
          <Input
            aria-invalid={Boolean(fieldErrors.quantity)}
            id={`${variant}-addition-quantity`}
            min="0.01"
            name="quantity"
            onChange={event => {
              setQuantity(event.target.value)
            }}
            step="0.01"
            type="number"
            value={quantity}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${variant}-addition-price`}>{labels.additionUnitPriceLabel}</Label>
          <Input
            aria-invalid={Boolean(fieldErrors.unitPriceCop)}
            id={`${variant}-addition-price`}
            min="0"
            name="unitPriceCop"
            onChange={event => {
              setUnitPriceCop(event.target.value)
            }}
            step="1"
            type="number"
            value={unitPriceCop}
          />
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
 * Renders the create or edit addition dialog.
 *
 * @param props - Addition dialog props.
 * @returns Addition form dialog element.
 */
export function AdditionFormDialog(props: AdditionFormDialogProps): ReactElement {
  const { action, addition, labels, productId, trigger, variant } = props
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const title = variant === 'create' ? labels.addAddition : labels.editAddition

  function handleOpenChange(nextOpen: boolean): void {
    setOpen(nextOpen)

    if (nextOpen) {
      setFormKey(current => current + 1)
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{labels.additionsPanelDescription}</DialogDescription>
        </DialogHeader>
        <AdditionForm
          action={action}
          addition={addition}
          key={formKey}
          labels={labels}
          onSuccess={() => {
            setOpen(false)
          }}
          productId={productId}
          variant={variant}
        />
      </DialogContent>
    </Dialog>
  )
}
