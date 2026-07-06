/**
 * Formats a millimeter value for display.
 *
 * @param value - Numeric value in millimeters.
 * @returns Formatted millimeter label.
 */
export function formatMm(value: number): string {
  return `${value.toFixed(1)} mm`
}
