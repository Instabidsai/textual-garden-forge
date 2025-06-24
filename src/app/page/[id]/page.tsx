import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageEditor } from './page-editor'

export default async function PagePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get the page
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!page) {
    redirect('/dashboard')
  }

  return <PageEditor page={page} />
}