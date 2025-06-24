// Force all OAuth redirects to use production URL
export const OAUTH_REDIRECT_URL = 'https://hub.instabids.ai/auth/callback'

// Production app URL
export const APP_URL = 'https://hub.instabids.ai'

// Ensure we always use the correct URLs
export const getRedirectUrl = () => OAUTH_REDIRECT_URL
export const getAppUrl = () => APP_URL
