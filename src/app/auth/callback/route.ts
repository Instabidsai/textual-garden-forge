import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PRODUCTION_URL = 'https://hub.instabids.ai'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  console.log('Auth callback received:', { 
    code: code ? 'present' : 'missing', 
    error,
    errorDescription,
    requestUrl: requestUrl.toString()
  })

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${PRODUCTION_URL}/login?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (code) {
    try {
      const supabase = createClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(`${PRODUCTION_URL}/login?error=${encodeURIComponent(exchangeError.message)}`)
      }
      
      // Success - redirect to dashboard
      return NextResponse.redirect(`${PRODUCTION_URL}/dashboard`)
    } catch (err) {
      console.error('Unexpected error:', err)
      return NextResponse.redirect(`${PRODUCTION_URL}/login?error=Authentication%20failed`)
    }
  }

  // No code or error - redirect to login
  return NextResponse.redirect(`${PRODUCTION_URL}/login?error=No%20authorization%20code%20received`)
}