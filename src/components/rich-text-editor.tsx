'use client'

import { useEffect, useRef } from 'react'
import { $getRoot, $getSelection, EditorState, $createParagraphNode } from 'lexical'
import { $createHeadingNode, HeadingNode, QuoteNode, $createQuoteNode } from '@lexical/rich-text'
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ListNode, ListItemNode } from '@lexical/list'
import { LinkNode, AutoLinkNode } from '@lexical/link'
import { CodeNode, CodeHighlightNode } from '@lexical/code'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

interface RichTextEditorProps {
  initialContent?: any
  onChange?: (content: any) => void
}

const theme = {
  paragraph: 'mb-2 text-gray-800 dark:text-gray-200',
  heading: {
    h1: 'text-3xl font-bold mb-4 text-gray-900 dark:text-white',
    h2: 'text-2xl font-bold mb-3 text-gray-900 dark:text-white',
    h3: 'text-xl font-bold mb-2 text-gray-900 dark:text-white',
  },
  list: {
    ul: 'list-disc ml-6 mb-2',
    ol: 'list-decimal ml-6 mb-2',
    listitem: 'mb-1',
  },
  quote: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 italic text-gray-700 dark:text-gray-300',
  code: 'bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm',
  link: 'text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300',
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()

  const formatHeading = (headingSize: 1 | 2 | 3) => {
    editor.update(() => {
      const selection = $getSelection()
      if (selection) {
        const node = $createHeadingNode(`h${headingSize}`)
        selection.insertNodes([node])
      }
    })
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex gap-2">
      <button
        onClick={() => formatHeading(1)}
        className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 font-bold"
        type="button"
      >
        H1
      </button>
      <button
        onClick={() => formatHeading(2)}
        className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 font-bold"
        type="button"
      >
        H2
      </button>
      <button
        onClick={() => formatHeading(3)}
        className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 font-bold"
        type="button"
      >
        H3
      </button>
    </div>
  )
}

export default function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: 'RichTextEditor',
    theme,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
      CodeNode,
      CodeHighlightNode,
    ],
    onError: (error) => {
      console.error('Lexical error:', error)
    },
    editorState: initialContent ? JSON.stringify(initialContent) : undefined,
  }

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot()
      const content = {
        root: {
          children: root.getChildren().map(child => ({
            type: child.getType(),
            // @ts-ignore
            ...(child.exportJSON ? child.exportJSON() : {})
          })),
          direction: root.getDirection(),
          format: root.getFormat(),
          indent: root.getIndent(),
          type: root.getType(),
          version: 1
        }
      }
      onChange?.(content)
    })
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[400px] p-4 outline-none" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 dark:text-gray-600 pointer-events-none">
                Start writing...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
        </div>
      </div>
    </LexicalComposer>
  )
}