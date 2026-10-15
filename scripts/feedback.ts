import type { SupabaseClient } from '@supabase/supabase-js'
import { VOICES } from '../src/config'
import { getCourse, DEFAULT_LANG } from '../src/content'
import { groupFixes, voiceLabel } from '../src/lib/fixes'
import { lessonTitles, reviewItems } from '../src/lib/reviewItems'
import type { OpenFix } from '../src/types'
import { adminClient, runScript } from './_admin'

interface Row {
  id: string; reviewer_id: string; lesson_id: string; target: string
  correction: string | null; comment: string | null; voice: string | null; created_at: string
}

async function openFixes(db: SupabaseClient): Promise<OpenFix[]> {
  const { data, error } = await db.from('content_reviews').select('*')
    .eq('verdict', 'fix').eq('status', 'open').order('created_at')
  if (error) throw new Error('Could not read reviews. Has supabase/migrations/0002_teachers.sql been applied?')
  const { data: people } = await db.from('profiles').select('id, username')
  const names = new Map((people ?? []).map((p: { id: string; username: string }) => [p.id, p.username]))
  return (data as Row[]).map((r) => ({
    id: r.id, reviewerId: r.reviewer_id, reviewer: names.get(r.reviewer_id) ?? 'unknown', itemKey: '', lessonId: r.lesson_id,
    target: r.target, verdict: 'fix', correction: r.correction, comment: r.comment, voice: r.voice,
    status: 'open', createdAt: r.created_at,
  }))
}

function printFix(f: OpenFix, voices: Map<string, string>): void {
  console.log(`  ${f.id}  ${f.target}${f.correction ? `  ->  ${f.correction}` : ''}`)
  if (f.comment) console.log(`      ${f.comment}`)
  const voice = voiceLabel(f.voice, voices)
  if (voice) console.log(`      voice that sounded wrong: ${voice}`)
  console.log(`      ${f.reviewer}, ${f.createdAt.slice(0, 10)}`)
}

async function resolve(db: SupabaseClient, id: string): Promise<void> {
  const { data, error } = await db.from('content_reviews').update({ status: 'resolved' }).eq('id', id).select('id')
  if (error || !data?.length) throw new Error(`Could not resolve "${id}". Check the id from \`npm run feedback\`.`)
  console.log(`Resolved ${id}.`)
}

runScript(async () => {
  const db = adminClient()
  const args = process.argv.slice(2)
  const at = args.indexOf('--resolve')
  if (at >= 0) return resolve(db, args[at + 1] ?? '')
  const fixes = await openFixes(db)
  if (fixes.length === 0) return console.log('No open fixes.')
  const titles = lessonTitles(reviewItems(getCourse(DEFAULT_LANG)))
  const voices = new Map(VOICES.map((v) => [v.id, v.name]))
  for (const g of groupFixes(fixes, titles, [...titles.keys()])) {
    console.log(`\n${g.lessonTitle} (${g.lessonId})`)
    g.fixes.forEach((f) => printFix(f, voices))
  }
})
