/**
 * Field-level validation messages keyed by submitted field name.
 */
export type FormFieldErrors = Readonly<Record<string, string>>

/**
 * Shared state returned by mutation server actions.
 */
export type MutationFormState = {
  readonly fieldErrors?: FormFieldErrors
  readonly message?: string
  readonly status?: 'error' | 'success'
}
