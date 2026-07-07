'use client'

import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import type { MutationFormState } from '@/core/types/form-state.types'

type FormStateToastProps = {
  readonly errorFallback: string
  readonly state: MutationFormState
  readonly successMessage: string
}

/**
 * Emits toast feedback when a mutation form state changes.
 *
 * @param props - Toast state props.
 * @returns Null because this component only performs side effects.
 */
export function FormStateToast(props: FormStateToastProps): ReactElement | null {
  const { errorFallback, state, successMessage } = props
  const lastState = useRef<MutationFormState | null>(null)

  useEffect(() => {
    if (!state.status || lastState.current === state) {
      return
    }

    lastState.current = state

    if (state.status === 'success') {
      toast.success(successMessage)
      return
    }

    toast.error(state.message ?? errorFallback)
  }, [errorFallback, state, successMessage])

  return null
}
