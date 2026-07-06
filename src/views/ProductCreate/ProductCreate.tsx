import type { ReactElement } from 'react'

import { ProductCreateForm } from './partial/ProductCreateForm/ProductCreateForm'
import type { CreateProductFormAction, ProductCreateLabels } from './product-create.types'

type ProductCreateProps = {
  readonly action: CreateProductFormAction
  readonly labels: ProductCreateLabels
}

/**
 * Renders the product creation page.
 *
 * @param props - Product creation view props.
 * @returns Product creation view element.
 */
export function ProductCreate(props: ProductCreateProps): ReactElement {
  const { action, labels } = props

  return (
    <main className="mx-auto grid w-full max-w-3xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="grid gap-3 border-b pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {labels.eyebrow}
        </p>
        <h1 className="text-3xl font-semibold uppercase tracking-widest sm:text-4xl">{labels.title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{labels.subtitle}</p>
      </header>
      <ProductCreateForm action={action} labels={labels} />
    </main>
  )
}
