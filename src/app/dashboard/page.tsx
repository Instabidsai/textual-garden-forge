import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './dashboard-client'
import { SignOutButton } from './sign-out-button'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check whitelist
  const { data: whitelistEntry } = await supabase
    .from('whitelist')
    .select('allowed')
    .eq('email', user.email!)
    .single()

  if (!whitelistEntry?.allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your email is not authorized to access this application.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Please contact your administrator.
          </p>
          <SignOutButton />
        </div>
      </div>
    )
  }

  // Get user's pages
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return <DashboardClient pages={pages || []} profile={profile} />
}
