import { calculateBounds } from './dxf.bounds'
import { parseEntityByType } from './dxf.entity-parsers'
import { toDxfPairs } from './dxf.pairs'
import type { DxfEntity, DxfGeometry, DxfPair } from './dxf.types'

export type {
  DxfArcEntity,
  DxfBounds,
  DxfCircleEntity,
  DxfEntity,
  DxfGeometry,
  DxfLineEntity,
  DxfPoint,
  DxfPolylineEntity
} from './dxf.types'

/**
 * Parses common DXF entities into renderable geometry.
 *
 * @param source - DXF text content.
 * @returns Parsed entities and measured bounds in source units.
 */
export function parseDxfGeometry(source: string): DxfGeometry {
  const pairs = toDxfPairs(source)
  const entities: DxfEntity[] = []

  for (let index = 0; index < pairs.length; index += 1) {
    const pair = pairs[index]

    if (pair.code !== 0) {
      continue
    }

    const entity = parseEntity(pair.value.toUpperCase(), pairs, index + 1)

    if (entity) {
      entities.push(entity)
    }
  }

  return {
    entities,
    bounds: calculateBounds(entities)
  }
}

function parseEntity(type: string, pairs: readonly DxfPair[], startIndex: number): DxfEntity | null {
  const entityPairs: DxfPair[] = []
  let cursor = startIndex

  while (cursor < pairs.length && pairs[cursor].code !== 0) {
    entityPairs.push(pairs[cursor])
    cursor += 1
  }

  return parseEntityByType(type, entityPairs)
}
