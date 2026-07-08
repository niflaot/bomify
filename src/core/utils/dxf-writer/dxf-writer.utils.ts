import {
  Colors,
  DxfWriter,
  LineTypes,
  LWPolylineFlags,
  point2d,
  point3d,
  Units
} from '@tarikjabiri/dxf'

import type { DxfEntity } from '@/core/utils/dxf/dxf.types'

import type { DxfLayerGroup } from './dxf-writer.types'

// DXF lineweight (group code 370) is in hundredths of a millimeter and must
// be one of a fixed enumerated set of values — 25 = 0.25mm, a standard thin
// CAD/laser line that importers (e.g. Adobe Illustrator) render as a crisp,
// visible stroke instead of falling back to their own default weight.
const layerLineweightHundredthsMm = 25
const layerLineweightPattern = /(6\n(?:Continuous|ByLayer|ByBlock)\n)370\n0\n/g

function writeEntity(dxf: DxfWriter, layerName: string, entity: DxfEntity): void {
  if (entity.type === 'line') {
    dxf.addLine(point3d(entity.start.x, entity.start.y), point3d(entity.end.x, entity.end.y), { layerName })
    return
  }

  if (entity.type === 'circle') {
    dxf.addCircle(point3d(entity.center.x, entity.center.y), entity.radius, { layerName })
    return
  }

  if (entity.type === 'arc') {
    dxf.addArc(point3d(entity.center.x, entity.center.y), entity.radius, entity.startAngle, entity.endAngle, { layerName })
    return
  }

  dxf.addLWPolyline(
    entity.points.map(point => ({ point: point2d(point.x, point.y) })),
    { flags: entity.closed ? LWPolylineFlags.Closed : LWPolylineFlags.None, layerName }
  )
}

/**
 * Serializes grouped entities into a full ASCII DXF document (HEADER,
 * TABLES with one layer per group, and ENTITIES), built with
 * `@tarikjabiri/dxf` rather than a hand-rolled ENTITIES-only file — some
 * importers (e.g. Adobe Illustrator) reject or misread DXF files missing a
 * proper HEADER/LAYER table instead of falling back gracefully.
 *
 * @param layers - Entities grouped by the DXF layer they belong to.
 * @returns DXF document text.
 */
export function serializeDxfDocument(layers: readonly DxfLayerGroup[]): string {
  const dxf = new DxfWriter()

  dxf.setUnits(Units.Millimeters)

  layers.forEach(group => {
    // Color 7 (white) is AutoCAD's legacy "white on black / black on white"
    // foreground convention — apps outside the AutoCAD family (e.g. Adobe
    // Illustrator) render it as literal white, making cut lines invisible
    // on a white artboard. Red avoids that ambiguity and doubles as the
    // common laser-software convention for cut (vs. engrave) lines.
    dxf.addLayer(group.layer, Colors.Red, LineTypes.Continuous)
    group.entities.forEach(entity => { writeEntity(dxf, group.layer, entity) })
  })

  const lastLayer = layers[layers.length - 1]

  if (lastLayer) {
    // $CLAYER otherwise stays "0" (an empty layer here) — some importers
    // use it as a hint for which layer to show/select first.
    dxf.setCurrentLayerName(lastLayer.layer)
  }

  // The library doesn't expose a lineweight option on addLayer/entities, so
  // the fixed "370\n0\n" it always writes for each layer's default
  // lineweight is patched afterwards.
  return dxf.stringify().replace(
    layerLineweightPattern,
    `$1370\n${layerLineweightHundredthsMm}\n`
  )
}
