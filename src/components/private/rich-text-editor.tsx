'use client'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
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
import * as React from 'react'
import { ImageResize } from './image-resize-extension'

type RichTextEditorProps = {
  id: string
  name: string
  initialContentHtml?: string
  onChange?: (html: string) => void
}

export function RichTextEditor({ id, name, initialContentHtml, onChange }: RichTextEditorProps) {
  const [html, setHtml] = React.useState(initialContentHtml ?? '<p></p>')
  const [isUploadingImage, setIsUploadingImage] = React.useState(false)
  const [isEditorFocused, setIsEditorFocused] = React.useState(false)
  const [isEditorEmpty, setIsEditorEmpty] = React.useState(
    !initialContentHtml || initialContentHtml.trim().length === 0,
  )
  const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false)
  const [linkUrl, setLinkUrl] = React.useState('')
  const [isImageAltDialogOpen, setIsImageAltDialogOpen] = React.useState(false)
  const [imageAltText, setImageAltText] = React.useState('')
  const [pendingImageUrl, setPendingImageUrl] = React.useState<string | null>(null)

  // Use a ref to track if we've initialized the editor to prevent unnecessary updates
  const isInitializedRef = React.useRef(false)
  const initialContentRef = React.useRef(initialContentHtml)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Highlight.configure({
        multicolor: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      ImageResize.configure({
        inline: true,
        allowBase64: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContentHtml ?? '<p></p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const newHtml = editor.getHTML()
      setHtml(newHtml)
      setIsEditorEmpty(editor.getText().trim().length === 0)
      onChange?.(newHtml)
    },
    editorProps: {
      attributes: {
        class: 'prose-editor-content min-h-[600px] focus:outline-none',
      },
    },
  })

  React.useEffect(() => {
    if (!editor) {
      return
    }

    setIsEditorEmpty(editor.getText().trim().length === 0)

    const handleFocus = () => {
      setIsEditorFocused(true)
    }

    const handleBlur = () => {
      setIsEditorFocused(false)
    }

    const handleSelectionUpdate = () => {
      // Toolbar is always visible now
    }

    editor.on('focus', handleFocus)
    editor.on('blur', handleBlur)
    editor.on('selectionUpdate', handleSelectionUpdate)

    return () => {
      editor.off('focus', handleFocus)
      editor.off('blur', handleBlur)
      editor.off('selectionUpdate', handleSelectionUpdate)
    }
  }, [editor])

  // Only update content if initialContentHtml actually changed and editor is initialized
  React.useEffect(() => {
    if (!editor) {
      return
    }

    // On first mount, mark as initialized
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      initialContentRef.current = initialContentHtml
      return
    }

    // Only update if the content actually changed from what we last set
    if (initialContentHtml !== initialContentRef.current) {
      const currentHtml = editor.getHTML()
      // Only update if different to prevent flickering
      if (currentHtml !== initialContentHtml) {
        editor.commands.setContent(initialContentHtml ?? '<p></p>', { emitUpdate: false })
        initialContentRef.current = initialContentHtml
      }
    }
  }, [editor, initialContentHtml])

  const handleImageUpload = (res: Array<{ url?: string }>) => {
    setIsUploadingImage(false)
    if (res?.[0]?.url && editor) {
      const imageUrl = res[0].url
      setPendingImageUrl(imageUrl)
      setIsImageAltDialogOpen(true)
    }
  }

  const handleImageAltSubmit = () => {
    if (pendingImageUrl && editor) {
      editor
        .chain()
        .focus()
        .setImage({
          src: pendingImageUrl,
          alt: imageAltText.trim(),
        })
        .run()
      setIsImageAltDialogOpen(false)
      setImageAltText('')
      setPendingImageUrl(null)
    }
  }

  const handleImageAltCancel = () => {
    setIsImageAltDialogOpen(false)
    setImageAltText('')
    setPendingImageUrl(null)
  }

  const handleImageUploadError = () => {
    setIsUploadingImage(false)
  }

  const handleImageUploadBegin = () => {
    setIsUploadingImage(true)
  }

  const handleLinkToggle = () => {
    if (!editor) return

    const previousHref = editor.getAttributes('link').href as string | undefined
    setLinkUrl(previousHref ?? '')
    setIsLinkDialogOpen(true)
  }

  const handleLinkSubmit = () => {
    if (!editor) return

    const trimmedUrl = linkUrl.trim()

    if (!trimmedUrl) {
      if (editor.isActive('link')) {
        editor.chain().focus().unsetLink().run()
      }
      setIsLinkDialogOpen(false)
      setLinkUrl('')
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmedUrl }).run()
    setIsLinkDialogOpen(false)
    setLinkUrl('')
  }

  const handleLinkCancel = () => {
    setIsLinkDialogOpen(false)
    setLinkUrl('')
  }

  if (!editor) {
    return null
  }

  return (
    <div className="w-full">
      <input type="hidden" id={id} name={name} value={html} />
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
          onClick={handleLinkToggle}
          aria-label="Link">
          <LinkIcon className="size-4" />
        </Button>
        <div className="relative inline-block w-8 h-8 rich-text-editor-upload-wrapper">
          <UploadButton<FrazerFileRouter, 'imageUploader'>
            endpoint="imageUploader"
            onClientUploadComplete={handleImageUpload}
            onUploadError={handleImageUploadError}
            onUploadBegin={handleImageUploadBegin}
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
      <div className="relative w-full h-full px-6 py-4">
        {isEditorEmpty && !isEditorFocused ? (
          <p className="pointer-events-none absolute left-6 top-4 text-lg text-muted-foreground/50">Start writing...</p>
        ) : null}
        <EditorContent editor={editor} />
      </div>

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
            <DialogDescription>Enter the URL for the link. Leave blank to remove an existing link.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleLinkSubmit()
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    handleLinkCancel()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleLinkCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleLinkSubmit}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageAltDialogOpen} onOpenChange={setIsImageAltDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
            <DialogDescription>Describe the image for accessibility (alt text).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                type="text"
                placeholder="A description of the image"
                value={imageAltText}
                onChange={e => setImageAltText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleImageAltSubmit()
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    handleImageAltCancel()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleImageAltCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleImageAltSubmit}>
              Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
