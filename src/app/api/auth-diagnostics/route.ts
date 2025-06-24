import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        error: 'Missing Supabase configuration',
        url: supabaseUrl ? 'SET' : 'NOT SET',
        key: supabaseKey ? 'SET' : 'NOT SET'
      }, { status: 500 })
    }
    
    // Test 1: Check auth settings endpoint
    const settingsResponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        'apikey': supabaseKey,
      },
    })
    
    const settings = await settingsResponse.json()
    
    // Test 2: Try to construct OAuth URL directly
    const redirectTo = 'https://hub.instabids.ai/auth/callback'
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=slack&redirect_to=${encodeURIComponent(redirectTo)}`
    
    // Test 3: Check if we can access the OAuth endpoint
    const oauthTestResponse = await fetch(oauthUrl, {
      method: 'HEAD',
      redirect: 'manual'
    })
    
    return NextResponse.json({
      status: 'ok',
      supabaseUrl,
      authSettings: settings,
      providers: settings.external_providers || [],
      slackEnabled: settings.external_providers?.includes('slack') || false,
      oauthUrl,
      oauthTestStatus: oauthTestResponse.status,
      oauthTestHeaders: Object.fromEntries(oauthTestResponse.headers.entries()),
      directAuthUrl: `${supabaseUrl}/auth/v1/authorize?provider=slack`,
      slackClientId: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID || 'NOT SET',
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
}
