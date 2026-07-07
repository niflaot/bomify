'use client'

import type { ReactElement } from 'react'
import { Toaster } from 'sonner'

/**
 * Renders the global application toast viewport.
 *
 * @returns Sonner toaster configured for Bomify.
 */
export function AppToaster(): ReactElement {
  return (
    <Toaster
      closeButton
      position="top-center"
      richColors
      toastOptions={{
        classNames: {
          toast: 'rounded-none border shadow-lg',
          title: 'font-semibold'
        }
      }}
    />
  )
}
