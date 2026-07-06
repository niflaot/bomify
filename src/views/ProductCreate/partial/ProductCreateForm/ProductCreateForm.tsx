'use client'

import { ArrowLeft, ImageUp, Save } from 'lucide-react'
import Link from 'next/link'
import type { ReactElement } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormLoadingBar } from '@/components/ui/loading-bar'
import { Textarea } from '@/components/ui/textarea'

import type { CreateProductFormAction, ProductCreateLabels } from '../../product-create.types'

type ProductCreateFormProps = {
  readonly action: CreateProductFormAction
  readonly labels: ProductCreateLabels
}

function SubmitButton(props: { readonly labels: ProductCreateLabels }): ReactElement {
  const { labels } = props
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} type="submit">
      <Save aria-hidden="true" data-icon="inline-start" />
      {pending ? labels.submitting : labels.submit}
    </Button>
  )
}

/**
 * Renders the new product form.
 *
 * @param props - Product create form props.
 * @returns Product create form element.
 */
export function ProductCreateForm(props: ProductCreateFormProps): ReactElement {
  const { action, labels } = props
  const [state, formAction] = useActionState(action, {})

  return (
    <Card>
      <CardContent className="pt-5">
        <form action={formAction} className="grid gap-6">
          <FormLoadingBar />
          <div className="grid gap-2">
            <Label htmlFor="product-name">{labels.nameLabel}</Label>
            <Input
              autoComplete="off"
              id="product-name"
              name="name"
              placeholder={labels.namePlaceholder}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product-description">{labels.descriptionLabel}</Label>
            <Textarea
              id="product-description"
              name="description"
              placeholder={labels.descriptionPlaceholder}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product-photo">{labels.photoLabel}</Label>
            <div className="grid gap-2 border border-dashed border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageUp aria-hidden="true" className="size-4" />
                <span>{labels.photoHelp}</span>
              </div>
              <Input accept="image/*" id="product-photo" name="photo" type="file" />
            </div>
          </div>

          {state.message ? (
            <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft aria-hidden="true" data-icon="inline-start" />
                {labels.cancel}
              </Link>
            </Button>
            <SubmitButton labels={labels} />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
