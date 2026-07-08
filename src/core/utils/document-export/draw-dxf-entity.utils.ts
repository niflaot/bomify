import type { jsPDF } from 'jspdf'

import { sampleArc } from '@/core/utils/dxf/dxf.curves'
import type { DxfEntity, DxfPoint } from '@/core/utils/dxf/dxf.types'

function drawSegments(doc: jsPDF, points: readonly DxfPoint[], closed: boolean): void {
  for (let index = 0; index < points.length - 1; index += 1) {
    doc.line(points[index].x, points[index].y, points[index + 1].x, points[index + 1].y)
  }

  const first = points[0]
  const last = points[points.length - 1]

  if (closed && first && last) {
    doc.line(last.x, last.y, first.x, first.y)
  }
}

/**
 * Draws one transformed DXF entity onto a jsPDF document using its vector
 * primitives (arcs are sampled into line segments — jsPDF has no native
 * arc primitive).
 *
 * @param doc - Target jsPDF document.
 * @param entity - Entity already transformed into the document's mm space.
 */
export function drawDxfEntity(doc: jsPDF, entity: DxfEntity): void {
  if (entity.type === 'line') {
    doc.line(entity.start.x, entity.start.y, entity.end.x, entity.end.y)
    return
  }

  if (entity.type === 'circle') {
    doc.circle(entity.center.x, entity.center.y, entity.radius)
    return
  }

  if (entity.type === 'arc') {
    drawSegments(doc, sampleArc(entity), false)
    return
  }

  drawSegments(doc, entity.points, entity.closed)
}
