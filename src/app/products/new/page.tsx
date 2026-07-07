import type { ReactElement } from 'react'
import { getTranslations } from 'next-intl/server'

import { ProductCreate } from '@/views/ProductCreate'
import type { ProductCreateLabels } from '@/views/ProductCreate'

import { createProductAction } from '../../products.actions'

function getProductCreateLabels(t: Awaited<ReturnType<typeof getTranslations>>): ProductCreateLabels {
  return {
    cancel: t('cancel'),
    descriptionLabel: t('descriptionLabel'),
    descriptionPlaceholder: t('descriptionPlaceholder'),
    eyebrow: t('eyebrow'),
    formErrorToast: t('formErrorToast'),
    nameLabel: t('nameLabel'),
    namePlaceholder: t('namePlaceholder'),
    photoHelp: t('photoHelp'),
    photoLabel: t('photoLabel'),
    submit: t('submit'),
    submitting: t('submitting'),
    subtitle: t('subtitle'),
    title: t('title')
  }
}

/**
 * Renders the new product route.
 *
 * @returns Product creation page.
 */
export default async function NewProductPage(): Promise<ReactElement> {
  const t = await getTranslations('productCreate')

  return <ProductCreate action={createProductAction} labels={getProductCreateLabels(t)} />
}
