'use client'

import { RefreshCw, Upload } from 'lucide-react'
import type { DragEvent, ReactElement } from 'react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { PieceRenderer } from '@/components/PieceRenderer'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/core/utils/class-name/class-name.utils'

import type {
  ProductWorkspaceLabels,
  ProductWorkspacePiece
} from '@/views/ProductWorkspace/product-workspace.types'

type PieceDxfDropzoneProps = {
  readonly id: string
  readonly invalid?: boolean
  readonly labels: ProductWorkspaceLabels
  readonly piece?: ProductWorkspacePiece
  readonly required: boolean
}

function hasDxfExtension(file: File): boolean {
  return file.name.toLowerCase().endsWith('.dxf')
}

function createFileList(file: File): FileList {
  const transfer = new DataTransfer()

  transfer.items.add(file)

  return transfer.files
}

/**
 * Renders a DXF dropzone with hidden file input and live preview.
 *
 * @param props - DXF dropzone props.
 * @returns DXF dropzone element.
 */
export function PieceDxfDropzone(props: PieceDxfDropzoneProps): ReactElement {
  const { id, invalid = false, labels, piece, required } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const previewSource = selectedFile ?? piece?.dxfUrl ?? null
  const previewMeasurements = !selectedFile && piece
    ? { heightMm: piece.heightMm, widthMm: piece.widthMm }
    : undefined
  const fileName = selectedFile?.name ?? piece?.dxfFileName
  const hasFile = Boolean(fileName)

  function openPicker(): void {
    inputRef.current?.click()
  }

  function applyFile(file: File): void {
    if (!hasDxfExtension(file)) {
      setError(labels.pieceDxfInvalidFile)
      toast.error(labels.pieceDxfInvalidFile)
      return
    }

    setError(null)
    setSelectedFile(file)

    if (inputRef.current) {
      inputRef.current.files = createFileList(file)
    }
  }

  function handleInputChange(): void {
    const file = inputRef.current?.files?.[0]

    if (!file) {
      setSelectedFile(null)
      return
    }

    applyFile(file)
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault()
    setDragging(true)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault()
    setDragging(false)

    const file = event.dataTransfer.files[0]

    if (file) {
      applyFile(file)
    }
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{required ? labels.pieceDxfLabel : labels.pieceReplaceDxfLabel}</Label>
      <input
        accept=".dxf"
        className="sr-only"
        id={id}
        name="dxf"
        onChange={handleInputChange}
        aria-invalid={invalid || Boolean(error)}
        ref={inputRef}
        required={required}
        type="file"
      />
      <div
        className={cn(
          'grid gap-4 border border-dashed bg-background p-4 transition-colors',
          dragging && 'border-foreground bg-muted/40'
        )}
        data-invalid={invalid || Boolean(error)}
        onDragLeave={() => { setDragging(false) }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previewSource ? (
          <div
            aria-label={labels.pieceDxfPreviewLabel}
            className="grid h-72 w-full place-items-center overflow-hidden border bg-background p-3"
            style={{
              backgroundImage:
                'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
              backgroundSize: '12px 12px'
            }}
          >
            <PieceRenderer
              ariaLabel={labels.pieceDxfPreviewLabel}
              hoverStrokeColor="var(--primary)"
              measurements={previewMeasurements}
              showMeasurements={false}
              source={previewSource}
              sourceType="dxf"
              strokeColor="var(--foreground)"
              strokeWidth={0.75}
              style={{ width: '100%' }}
            />
          </div>
        ) : (
          <div className="grid h-72 w-full place-items-center border bg-muted/20 p-6 text-center">
            <div className="grid justify-items-center gap-3">
              <Upload aria-hidden="true" className="size-8 text-muted-foreground" />
              <p className="max-w-64 text-sm leading-6 text-muted-foreground">
                {labels.pieceDxfDropHint}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            {fileName ? (
              <>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {selectedFile ? labels.pieceDxfSelectedLabel : labels.pieceDxfCurrentLabel}
                </p>
                <p className="truncate text-sm font-medium">{fileName}</p>
              </>
            ) : null}
          </div>
          <Button onClick={openPicker} type="button" variant="outline">
            {hasFile ? <RefreshCw aria-hidden="true" data-icon="inline-start" /> : null}
            {!hasFile ? <Upload aria-hidden="true" data-icon="inline-start" /> : null}
            {hasFile ? labels.pieceReplaceDxfLabel : labels.pieceDxfChooseAction}
          </Button>
        </div>
      </div>
    </div>
  )
}
