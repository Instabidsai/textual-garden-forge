'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Database } from '@/types/database'

type Page = Database['public']['Tables']['pages']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

interface DashboardClientProps {
  pages: Page[]
  profile: Profile | null
}

export function DashboardClient({ pages: initialPages, profile }: DashboardClientProps) {
  const [pages, setPages] = useState(initialPages)
  const [creating, setCreating] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const createPage = async () => {
    if (!newPageTitle.trim()) return
    
    setCreating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('pages')
        .insert({
          title: newPageTitle,
          user_id: user.id,
          content: { blocks: [] }
        })
        .select()
        .single()

      if (error) throw error
      
      setPages([data, ...pages])
      setNewPageTitle('')
      router.push(`/page/${data.id}`)
    } catch (error) {
      console.error('Error creating page:', error)
    } finally {
      setCreating(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Textual Garden Forge
          </h1>
          <div className="flex items-center space-x-4">
            {profile && (
              <div className="flex items-center space-x-2">
                {profile.avatar_url && (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.display_name || ''} 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {profile.display_name || profile.email}
                </span>
                {profile.role === 'admin' && (
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    Admin
                  </span>
                )}
              </div>
            )}
            <button
              onClick={signOut}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your Pages
          </h2>
          
          <div className="flex space-x-2 mb-6">
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createPage()}
              placeholder="Enter page title..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={createPage}
              disabled={creating || !newPageTitle.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create Page'}
            </button>
          </div>

          {pages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No pages yet. Create your first page to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => router.push(`/page/${page.id}`)}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {page.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created {new Date(page.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}