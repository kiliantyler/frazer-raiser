'use client'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { Button } from '@/components/ui/button'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { UploadButton } from '@uploadthing/react'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  RemoveFormatting,
  Underline as UnderlineIcon,
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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
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
    ],
    content: initialContentHtml ?? '<p></p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const newHtml = editor.getHTML()
      setHtml(newHtml)
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
    if (editor && initialContentHtml && editor.getHTML() !== initialContentHtml) {
      editor.commands.setContent(initialContentHtml)
    }
  }, [editor, initialContentHtml])

  const handleImageUpload = (res: Array<{ url?: string }>) => {
    setIsUploadingImage(false)
    if (res?.[0]?.url && editor) {
      editor.chain().focus().setImage({ src: res[0].url }).run()
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

    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
    } else {
      const url = globalThis.window.prompt('Enter URL:')
      if (url) {
        editor.chain().focus().setLink({ href: url }).run()
      }
    }
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
      <div className="rounded-md border border-input bg-background">
        <EditorContent editor={editor} />
      </div>
      <p className="text-xs text-muted-foreground">Rich text editor with formatting options</p>
    </div>
  )
}
