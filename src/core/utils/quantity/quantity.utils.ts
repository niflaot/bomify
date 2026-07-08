/**
 * Formats a quantity for display, trimming trailing zeros (`1.5` stays
 * `1.5`, `1` doesn't render as `1.00`).
 *
 * @param value - Quantity value.
 * @returns Formatted quantity string.
 */
export function formatQuantity(value: number): string {
  return Number(value.toFixed(2)).toString()
}
