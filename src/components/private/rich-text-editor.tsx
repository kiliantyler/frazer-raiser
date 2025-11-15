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
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
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
      Image.configure({
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
        class:
          'prose prose-invert max-w-none min-h-[300px] px-4 py-3 focus:outline-none prose-headings:font-serif prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1',
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

    editor.on('focus', handleFocus)
    editor.on('blur', handleBlur)

    return () => {
      editor.off('focus', handleFocus)
      editor.off('blur', handleBlur)
    }
  }, [editor])

  React.useEffect(() => {
    if (editor && initialContentHtml && editor.getHTML() !== initialContentHtml) {
      editor.commands.setContent(initialContentHtml)
    }
  }, [editor, initialContentHtml])

  const handleImageUpload = (res: Array<{ url?: string }>) => {
    setIsUploadingImage(false)
    if (res?.[0]?.url && editor) {
      const imageUrl = res[0].url
      const altPrompt = globalThis.window.prompt('Describe the image (alt text):') ?? ''
      const alt = altPrompt.trim()

      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt,
        })
        .run()
    }
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
    const url = globalThis.window.prompt('Enter URL (leave blank to remove the link):', previousHref ?? '')

    if (url === null) {
      return
    }

    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      if (editor.isActive('link')) {
        editor.chain().focus().unsetLink().run()
      }
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmedUrl }).run()
  }

  if (!editor) {
    return null
  }

  return (
    <div className="space-y-2">
      <input type="hidden" id={id} name={name} value={html} />
      <div className="flex flex-wrap gap-1 rounded-md border border-input bg-background p-2">
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
        <div className="relative inline-block">
          <UploadButton<FrazerFileRouter, 'imageUploader'>
            endpoint="imageUploader"
            onClientUploadComplete={handleImageUpload}
            onUploadError={handleImageUploadError}
            onUploadBegin={handleImageUploadBegin}
            appearance={{
              button: isUploadingImage
                ? 'bg-muted text-muted-foreground cursor-not-allowed h-8 w-8 rounded-md text-sm font-medium p-0 border-0 flex items-center justify-center'
                : 'bg-transparent hover:bg-accent h-8 w-8 rounded-md text-sm font-medium p-0 border-0 flex items-center justify-center',
              allowedContent: 'hidden',
            }}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
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
      <div className="relative rounded-md border border-input bg-background">
        {isEditorEmpty && !isEditorFocused ? (
          <p className="pointer-events-none absolute left-4 top-3 text-sm text-muted-foreground/70">
            Write your update...
          </p>
        ) : null}
        <EditorContent editor={editor} />
      </div>
      <p className="text-xs text-muted-foreground">Rich text editor with formatting options</p>
    </div>
  )
}
