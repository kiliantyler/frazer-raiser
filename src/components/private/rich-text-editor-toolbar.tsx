'use client'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Editor } from '@tiptap/react'
import { UploadButton } from '@uploadthing/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react'

interface RichTextEditorToolbarProps {
  editor: Editor | null
  onLinkToggle: () => void
  onImageUpload: (res: Array<{ url?: string }>) => void
  onImageUploadError: () => void
  onImageUploadBegin: () => void
  isUploadingImage: boolean
}

export function RichTextEditorToolbar({
  editor,
  onLinkToggle,
  onImageUpload,
  onImageUploadError,
  onImageUploadBegin,
  isUploadingImage,
}: RichTextEditorToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="sticky top-0 z-20 mb-6 flex flex-wrap gap-1 rounded-lg border-2 border-primary/30 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/90 px-4 py-3 shadow-lg">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().undo().run()}
        aria-label="Undo">
        <Undo2 className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().redo().run()}
        aria-label="Redo">
        <Redo2 className="size-4" />
      </Button>
      <div className="mx-1 h-6 w-px bg-border" />
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        aria-label="Heading 1">
        <Heading1 className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Heading 2">
        <Heading2 className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        aria-label="Heading 3">
        <Heading3 className="size-4" />
      </Button>
      <div className="mx-1 h-6 w-px bg-border" />
      <Button
        type="button"
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold">
        <Bold className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic">
        <Italic className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Underline">
        <UnderlineIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('strike') ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Strikethrough">
        <Strikethrough className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('highlight') ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        aria-label="Highlight">
        <Highlighter className="size-4" />
      </Button>
      <div className="mx-1 h-6 w-px bg-border" />
      <Button
        type="button"
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet list">
        <List className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered list">
        <ListOrdered className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Blockquote">
        <Quote className="size-4" />
      </Button>
      <div className="mx-1 h-6 w-px bg-border" />
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        aria-label="Align left">
        <AlignLeft className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        aria-label="Align center">
        <AlignCenter className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        aria-label="Align right">
        <AlignRight className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        aria-label="Horizontal rule">
        <Minus className="size-4" />
      </Button>
      <div className="mx-1 h-6 w-px bg-border" />
      <Button
        type="button"
        variant={editor.isActive('code') ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        aria-label="Inline code">
        <Code className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-label="Code block">
        <Code className="size-4" />
      </Button>
      <div className="mx-1 h-6 w-px bg-border" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Table options">
            <TableIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Table</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({
                  rows: 3,
                  cols: 3,
                  withHeaderRow: true,
                })
                .run()
            }>
            Insert 3×3 table
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => editor.chain().focus().addRowAfter().run()}
            disabled={!editor.can().addRowAfter()}>
            Add row below
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            disabled={!editor.can().addColumnAfter()}>
            Add column right
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => editor.chain().focus().deleteTable().run()}
            disabled={!editor.can().deleteTable()}>
            Delete table
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="mx-1 h-6 w-px bg-border" />
      <Button
        type="button"
        variant={editor.isActive('link') ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={onLinkToggle}
        aria-label="Link">
        <LinkIcon className="size-4" />
      </Button>
      <div className="relative inline-block w-8 h-8 rich-text-editor-upload-wrapper">
        <UploadButton<FrazerFileRouter, 'imageUploader'>
          endpoint="imageUploader"
          onClientUploadComplete={onImageUpload}
          onUploadError={onImageUploadError}
          onUploadBegin={onImageUploadBegin}
          appearance={{
            button: isUploadingImage
              ? 'bg-muted text-muted-foreground cursor-not-allowed h-8 w-8 rounded-md p-0 border-0 flex items-center justify-center'
              : 'bg-transparent hover:bg-accent h-8 w-8 rounded-md p-0 border-0 flex items-center justify-center',
            allowedContent: 'hidden',
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
          <ImageIcon className="size-4" />
        </div>
      </div>
      <div className="mx-1 h-6 w-px bg-border" />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        aria-label="Clear formatting">
        <RemoveFormatting className="size-4" />
      </Button>
    </div>
  )
}
