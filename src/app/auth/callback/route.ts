import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  // Always redirect to production URL
  const origin = 'https://hub.instabids.ai'
  
  console.log('Auth callback received:', { 
    code: code ? 'present' : 'missing', 
    error,
    errorDescription,
    requestUrl: requestUrl.toString()
  })

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (code) {
    try {
      const supabase = createClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
      }
      
      // Success - redirect to dashboard
      return NextResponse.redirect(`${origin}/dashboard`)
    } catch (err) {
      console.error('Unexpected error:', err)
      return NextResponse.redirect(`${origin}/login?error=Authentication%20failed`)
    }
  }

  // No code or error - redirect to login
  return NextResponse.redirect(`${origin}/login?error=No%20authorization%20code%20received`)
}
