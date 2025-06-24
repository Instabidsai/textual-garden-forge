import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('updated_at', { ascending: false })
  
  return <DashboardClient initialPages={pages || []} />
}