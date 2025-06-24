'use client'

import { createDirectSupabaseClient, validateSlackAuth } from '@/lib/supabase/auth-fix'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { OAUTH_REDIRECT_URL } from '@/lib/auth-constants'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for error in URL params
    const urlError = searchParams.get('error')
    if (urlError) {
      setError(decodeURIComponent(urlError))
    }
    
    // Validate auth on mount
    validateSlackAuth().then(setAuthStatus)
  }, [searchParams])

  const signInWithSlack = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use direct Supabase client
      const supabase = createDirectSupabaseClient()
      
      console.log('Attempting to sign in with Slack OIDC...')
      console.log('Auth status:', authStatus)
      console.log('Using redirect URL:', OAUTH_REDIRECT_URL)
      
      // Use slack_oidc instead of slack
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'slack_oidc',
        options: {
          redirectTo: OAUTH_REDIRECT_URL,
          skipBrowserRedirect: false,
        },
      })
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to Textual Garden Forge
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Your team&apos;s knowledge base powered by AI
          </p>
          
          {authStatus && (
            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing'}</p>
              <p>Slack Provider: {authStatus.slackEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
              <p>Available Providers: {authStatus.providers?.join(', ') || 'None'}</p>
              <p className="text-orange-500">Redirect URL: {OAUTH_REDIRECT_URL}</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <button
            onClick={signInWithSlack}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4A154B] hover:bg-[#611f69] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A154B] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                </svg>
                Sign in with Slack
              </>
            )}
          </button>
          
          <div className="mt-4 text-center space-y-2">
            <a 
              href="/api/auth-diagnostics" 
              target="_blank"
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View Auth Configuration →
            </a>
            <p className="text-xs text-gray-500">
              Using Slack OIDC provider
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
