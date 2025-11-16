import Image from '@tiptap/extension-image'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import NextImage from 'next/image'
import * as React from 'react'

function ResizableImageComponent({ node, updateAttributes, selected }: NodeViewProps) {
  const [isResizing, setIsResizing] = React.useState(false)
  const [resizeHandle, setResizeHandle] = React.useState<string | null>(null)
  const [startPos, setStartPos] = React.useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = React.useState({ width: 0, height: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)

  const width = node.attrs.width
  const height = node.attrs.height

  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    setStartPos({ x: e.clientX, y: e.clientY })
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setStartSize({
        width: rect.width,
        height: rect.height,
      })
    }
  }

  React.useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !resizeHandle) return

      const deltaX = e.clientX - startPos.x
      const deltaY = e.clientY - startPos.y

      let newWidth = startSize.width
      let newHeight = startSize.height

      if (resizeHandle.includes('e')) {
        // East (right)
        newWidth = Math.max(50, startSize.width + deltaX)
      }
      if (resizeHandle.includes('w')) {
        // West (left)
        newWidth = Math.max(50, startSize.width - deltaX)
      }
      if (resizeHandle.includes('s')) {
        // South (bottom)
        newHeight = Math.max(50, startSize.height + deltaY)
      }
      if (resizeHandle.includes('n')) {
        // North (top)
        newHeight = Math.max(50, startSize.height - deltaY)
      }

      // Maintain aspect ratio for corner handles
      if (resizeHandle.length === 2) {
        const aspectRatio = startSize.width / startSize.height
        if (resizeHandle.includes('e') || resizeHandle.includes('w')) {
          newHeight = newWidth / aspectRatio
        } else {
          newWidth = newHeight * aspectRatio
        }
      }

      updateAttributes({
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeHandle(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeHandle, startPos, startSize, updateAttributes])

  return (
    <NodeViewWrapper
      className={`inline-block relative ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      style={{
        display: 'inline-block',
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
      }}>
      <div ref={containerRef} className="relative w-full h-full">
        <NextImage
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          width={width || 800}
          height={height || 600}
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
            display: 'block',
            objectFit: 'contain',
          }}
          draggable={false}
          unoptimized={width !== null && height !== null}
        />
      </div>
      {selected && (
        <>
          {/* Corner handles */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-nwse-resize z-10"
            onMouseDown={e => handleMouseDown(e, 'nw')}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-nesw-resize z-10"
            onMouseDown={e => handleMouseDown(e, 'ne')}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-nesw-resize z-10"
            onMouseDown={e => handleMouseDown(e, 'sw')}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-nwse-resize z-10"
            onMouseDown={e => handleMouseDown(e, 'se')}
          />
          {/* Edge handles */}
          <div
            className="absolute top-1/2 -left-1 w-3 h-8 -translate-y-1/2 bg-primary border-2 border-white rounded-full cursor-ew-resize z-10"
            onMouseDown={e => handleMouseDown(e, 'w')}
          />
          <div
            className="absolute top-1/2 -right-1 w-3 h-8 -translate-y-1/2 bg-primary border-2 border-white rounded-full cursor-ew-resize z-10"
            onMouseDown={e => handleMouseDown(e, 'e')}
          />
          <div
            className="absolute -top-1 left-1/2 h-3 w-8 -translate-x-1/2 bg-primary border-2 border-white rounded-full cursor-ns-resize z-10"
            onMouseDown={e => handleMouseDown(e, 'n')}
          />
          <div
            className="absolute -bottom-1 left-1/2 h-3 w-8 -translate-x-1/2 bg-primary border-2 border-white rounded-full cursor-ns-resize z-10"
            onMouseDown={e => handleMouseDown(e, 's')}
          />
        </>
      )}
    </NodeViewWrapper>
  )
}

export const ImageResize = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) {
            return {}
          }
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) {
            return {}
          }
          return {
            height: attributes.height,
          }
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent)
  },
})
