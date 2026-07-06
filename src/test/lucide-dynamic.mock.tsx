import type { ReactElement, SVGProps } from 'react'

/**
 * Lucide icon names exposed to Jest tests.
 */
export const iconNames = [
  'box',
  'gem',
  'layers-3',
  'shield',
  'swatch-book',
  'waves'
] as const

/**
 * Test-safe Lucide dynamic icon name.
 */
export type IconName = (typeof iconNames)[number]

/**
 * Placeholder dynamic icon used by Jest instead of Lucide's ESM subpath.
 *
 * @param props - SVG props and icon name.
 * @returns Mock SVG icon element.
 */
export function DynamicIcon(
  props: SVGProps<SVGSVGElement> & { readonly name: IconName }
): ReactElement {
  const { name, ...svgProps } = props

  return (
    <svg
      data-testid={`dynamic-icon-${name}`}
      focusable="false"
      viewBox="0 0 24 24"
      {...svgProps}
    />
  )
}

/**
 * Placeholder export matching Lucide's dynamic module shape.
 */
export const dynamicIconImports = {}
