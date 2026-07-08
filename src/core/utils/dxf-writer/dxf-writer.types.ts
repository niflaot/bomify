import type { DxfEntity } from '@/core/utils/dxf/dxf.types'

/**
 * One named DXF layer with the entities placed on it.
 */
export type DxfLayerGroup = {
  readonly layer: string
  readonly entities: readonly DxfEntity[]
}
