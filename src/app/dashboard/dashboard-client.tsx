'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Page } from '@/types'
import Image from 'next/image'

export default function DashboardClient({ initialPages }: { initialPages: Page[] }) {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [loading, setLoading] = useState(false)
  const [creatingPage, setCreatingPage] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('pages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pages',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPages((current) => [payload.new as Page, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setPages((current) =>
              current.map((page) =>
                page.id === payload.new.id ? (payload.new as Page) : page
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setPages((current) => current.filter((page) => page.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  const createNewPage = async () => {
    setCreatingPage(true)
    const { data, error } = await supabase
      .from('pages')
      .insert({
        title: 'Untitled',
        content: { type: 'text', text: '' },
      })
      .select()
      .single()

    if (!error && data) {
      router.push(`/page/${data.id}`)
    }
    setCreatingPage(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              src="/icon.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Textual Garden Forge
            </h1>
          </div>
          <button
            onClick={createNewPage}
            disabled={creatingPage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingPage ? 'Creating...' : 'New Page'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No pages yet. Create your first page to get started.
            </p>
            <button
              onClick={createNewPage}
              disabled={creatingPage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Page
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/page/${page.id}`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {page.title || 'Untitled'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {new Date(page.updated_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}