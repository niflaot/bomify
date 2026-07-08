'use client'

import { Pencil, Save, TriangleAlert } from 'lucide-react'
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
import type { MaterialIconKey } from '@/core/constants/material-icons.constants'
import type { MaterialFormState } from '@/core/types/material.types'

import type {
  MaterialFormAction,
  ProductWorkspaceLabels,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { MaterialNewFields } from './MaterialNewFields'

type MaterialEditDialogProps = {
  readonly action: MaterialFormAction
  readonly labels: ProductWorkspaceLabels
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
  const { action, labels, onSuccess, productId, productMaterial } = props
  const { material } = productMaterial
  const [hexColor, setHexColor] = useState(material.hexColor)
  const [iconKey, setIconKey] = useState<MaterialIconKey>(material.iconKey)
  const [labelName, setLabelName] = useState(material.labelName ?? '')
  const [name, setName] = useState(material.name)
  const [priceCop, setPriceCop] = useState(material.priceCop === null ? '' : String(material.priceCop))
  const [widthCm, setWidthCm] = useState(String(material.widthCm))
  const [state, formAction] = useActionState<MaterialFormState, FormData>(action, {})
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
      <input name="productId" type="hidden" value={productId} />
      <input name="materialId" type="hidden" value={material.id} />

      <div className="flex gap-3 border border-amber-600/40 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-200">
        <TriangleAlert aria-hidden="true" className="size-4 shrink-0 translate-y-0.5" />
        <p className="leading-6">{labels.materialEditWarning}</p>
      </div>

      <MaterialNewFields
        fieldErrors={fieldErrors}
        hexColor={hexColor}
        iconKey={iconKey}
        labelName={labelName}
        labels={labels}
        name={name}
        onHexColorChange={setHexColor}
        onIconKeyChange={setIconKey}
        onLabelNameChange={setLabelName}
        onNameChange={setName}
        onPriceCopChange={setPriceCop}
        onWidthCmChange={setWidthCm}
        priceCop={priceCop}
        widthCm={widthCm}
      />

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
 * Renders the global material edit dialog, with an explicit warning that
 * the edit applies to the shared catalog entry (every product using this
 * material), not just the current product.
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
      <DialogContent className="max-w-4xl" closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{labels.materialEditTitle}</DialogTitle>
          <DialogDescription>{labels.materialEditDescription}</DialogDescription>
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
