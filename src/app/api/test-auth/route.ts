import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Test if we can access Supabase at all
    const { data: testData, error: testError } = await supabase.auth.getSession()
    
    // Try to get the auth configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Make a direct API call to check provider status
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        'apikey': supabaseKey || '',
        'Authorization': `Bearer ${supabaseKey}`,
      },
    })
    
    const settings = await response.json()
    
    return NextResponse.json({
      status: 'ok',
      supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
      supabaseKey: supabaseKey ? 'SET' : 'NOT SET',
      sessionTest: testError ? testError.message : 'OK',
      authSettings: settings,
      providers: settings.external_providers || [],
      slackEnabled: settings.external_providers?.includes('slack') || false,
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
}
