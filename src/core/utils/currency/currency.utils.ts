// Intl's `style: 'currency'` inserts a non-breaking space after the "$" for
// es-CO (CLDR default), but the desired format is "$140.000" with no space —
// so the grouping is formatted as a plain number and the "$" prefixed manually.
const copGroupingFormatter = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 0
})

/**
 * Formats a whole Colombian peso amount as `$xxx.xxx`.
 *
 * @param value - Amount in COP, or `null` when unset.
 * @returns Formatted amount, or `'—'` when `value` is `null`.
 */
export function formatCop(value: number | null): string {
  if (value === null) {
    return '—'
  }

  return `$${copGroupingFormatter.format(value)}`
}

/**
 * Parses a COP price input into a whole-peso integer, stripping any
 * currency symbol, thousands separators, or other non-digit characters.
 *
 * @param raw - Raw input value.
 * @returns Parsed non-negative integer, or `null` when empty/invalid.
 */
export function parseCopInput(raw: string): number | null {
  const digitsOnly = raw.replace(/[^0-9]/g, '')

  if (!digitsOnly) {
    return null
  }

  return Number.parseInt(digitsOnly, 10)
}
