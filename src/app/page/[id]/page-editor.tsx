'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Save, Trash2 } from 'lucide-react'
import type { Database } from '@/types/database'

type Page = Database['public']['Tables']['pages']['Row']

interface PageEditorProps {
  page: Page
}

export function PageEditor({ page: initialPage }: PageEditorProps) {
  const [page, setPage] = useState(initialPage)
  const [title, setTitle] = useState(page.title)
  const [content, setContent] = useState(page.content?.text || '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Auto-save
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (title !== page.title || content !== page.content?.text) {
        savePage()
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [title, content])

  const savePage = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('pages')
        .update({
          title,
          content: { text: content },
          updated_at: new Date().toISOString()
        })
        .eq('id', page.id)

      if (error) throw error
      
      setPage({ ...page, title, content: { text: content } })
    } catch (error) {
      console.error('Error saving page:', error)
    } finally {
      setSaving(false)
    }
  }

  const deletePage = async () => {
    if (!confirm('Are you sure you want to delete this page?')) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', page.id)

      if (error) throw error
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting page:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <div className="flex items-center space-x-2">
              {saving && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Saving...
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={deletePage}
            disabled={deleting}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full text-4xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 mb-8"
        />
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing..."
          className="w-full min-h-[500px] text-lg bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600"
        />
      </main>
    </div>
  )
}