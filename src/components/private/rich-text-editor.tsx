'use client'

import '@tiptap/extension-blockquote'
import '@tiptap/extension-bold'
import '@tiptap/extension-bullet-list'
import '@tiptap/extension-code'
import '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import '@tiptap/extension-image'
import '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import '@tiptap/extension-ordered-list'
import '@tiptap/extension-strike'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import * as React from 'react'
import { ImageResize } from './image-resize-extension'
import { RichTextEditorImageDialog } from './rich-text-editor-image-dialog'
import { RichTextEditorLinkDialog } from './rich-text-editor-link-dialog'
import { RichTextEditorToolbar } from './rich-text-editor-toolbar'

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
        editor.commands.setContent(initialContentHtml ?? '<p></p>', false)
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

  const handleImageAltSubmit = (altText: string) => {
    if (pendingImageUrl && editor) {
      editor
        .chain()
        .focus()
        .setImage({
          src: pendingImageUrl,
          alt: altText.trim(),
        })
        .run()
      setIsImageAltDialogOpen(false)
      setPendingImageUrl(null)
    }
  }

  const handleImageAltCancel = () => {
    setIsImageAltDialogOpen(false)
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

  const handleLinkSubmit = (url: string) => {
    if (!editor) return

    const trimmedUrl = url.trim()

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
      <RichTextEditorToolbar
        editor={editor}
        onLinkToggle={handleLinkToggle}
        onImageUpload={handleImageUpload}
        onImageUploadError={handleImageUploadError}
        onImageUploadBegin={handleImageUploadBegin}
        isUploadingImage={isUploadingImage}
      />
      <div className="relative w-full h-full px-6 py-4">
        {isEditorEmpty && !isEditorFocused ? (
          <p className="pointer-events-none absolute left-6 top-4 text-lg text-muted-foreground/50">Start writing...</p>
        ) : null}
        <EditorContent editor={editor} />
      </div>

      <RichTextEditorLinkDialog
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        initialUrl={linkUrl}
        onLinkSubmit={handleLinkSubmit}
        onLinkCancel={handleLinkCancel}
      />

      <RichTextEditorImageDialog
        open={isImageAltDialogOpen}
        onOpenChange={setIsImageAltDialogOpen}
        onImageAltSubmit={handleImageAltSubmit}
        onImageAltCancel={handleImageAltCancel}
      />
    </div>
  )
}
