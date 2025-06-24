import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageEditor from './page-editor'

export default async function PagePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('id', params.id)
    .single()
  
  if (!page) {
    notFound()
  }
  
  return <PageEditor page={page} />
}