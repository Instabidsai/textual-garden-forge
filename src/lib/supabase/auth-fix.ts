import { createClient } from '@supabase/supabase-js'

// Create a direct Supabase client to bypass Next.js server-side issues
export const createDirectSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  })
}

// Helper to validate Slack OAuth configuration
export const validateSlackAuth = async () => {
  try {
    const supabase = createDirectSupabaseClient()
    
    // Test basic auth functionality
    const { data: session, error: sessionError } = await supabase.auth.getSession()
    console.log('Session check:', { hasSession: !!session, error: sessionError })
    
    // Get provider list from Supabase
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Auth settings fetch failed: ${response.status}`)
    }
    
    const settings = await response.json()
    console.log('Auth settings:', settings)
    
    // Check for slack_oidc instead of slack
    const slackOidcEnabled = settings.external?.slack_oidc || false
    
    return {
      providers: Object.keys(settings.external || {}).filter(key => settings.external[key]),
      slackEnabled: slackOidcEnabled, // Check slack_oidc instead of slack
      error: null
    }
  } catch (error) {
    console.error('Slack auth validation error:', error)
    return {
      providers: [],
      slackEnabled: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
