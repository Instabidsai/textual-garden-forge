'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Page } from '@/types'
import RichTextEditor from '@/components/rich-text-editor'
import { debounce } from '@/lib/utils'

export default function PageEditor({ page: initialPage }: { page: Page }) {
  const [page, setPage] = useState<Page>(initialPage)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const savePage = useCallback(
    debounce(async (updates: Partial<Page>) => {
      setSaving(true)
      await supabase
        .from('pages')
        .update(updates)
        .eq('id', page.id)
      setSaving(false)
    }, 1000),
    [page.id]
  )

  useEffect(() => {
    return () => {
      savePage.cancel()
    }
  }, [savePage])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setPage(prev => ({ ...prev, title: newTitle }))
    savePage({ title: newTitle })
  }

  const handleContentChange = (content: any) => {
    setPage(prev => ({ ...prev, content }))
    savePage({ content })
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this page?')) {
      await supabase
        .from('pages')
        .delete()
        .eq('id', page.id)
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center space-x-4">
              {saving && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Saving...
                </span>
              )}
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <input
          type="text"
          value={page.title}
          onChange={handleTitleChange}
          className="w-full text-4xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 mb-8"
          placeholder="Untitled"
        />
        <RichTextEditor
          initialContent={page.content}
          onChange={handleContentChange}
        />
      </main>
    </div>
  )
}