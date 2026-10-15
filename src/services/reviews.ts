// Teacher mode data. Every read tolerates cloud being off or migration 0002 not applied yet
// (empty / 'learner'), so the learner app never breaks; writes throw friendly errors for the UI.

import type { OpenFix, ProfileRow, Review, ReviewInput, Role } from '../types'
import { supabase, requireSupabase } from './supabase'

interface ReviewRow {
  id: string
  reviewer_id: string
  item_key: string
  lesson_id: string
  target: string
  verdict: 'ok' | 'fix'
  correction: string | null
  comment: string | null
  voice: string | null
  status: 'open' | 'resolved'
  created_at: string
}

const ROLES: readonly Role[] = ['learner', 'teacher', 'admin']
const REVIEW_COLUMNS = 'id, reviewer_id, item_key, lesson_id, target, verdict, correction, comment, voice, status, created_at'
const SAVE_FAILED = 'We could not save that. Please try again.'

const asRole = (value: unknown): Role => ROLES.find((r) => r === value) ?? 'learner'

function toReview(r: ReviewRow): Review {
  return {
    id: r.id, reviewerId: r.reviewer_id, itemKey: r.item_key, lessonId: r.lesson_id, target: r.target,
    verdict: r.verdict, correction: r.correction, comment: r.comment, voice: r.voice,
    status: r.status, createdAt: r.created_at,
  }
}

async function currentUserId(): Promise<string> {
  const { data } = await requireSupabase().auth.getSession()
  if (!data.session) throw new Error('Please sign in again.')
  return data.session.user.id
}

export async function fetchMyRole(): Promise<Role> {
  if (!supabase) return 'learner'
  const { data, error } = await supabase.rpc('my_role')
  return error ? 'learner' : asRole(data)
}

export async function fetchMyReviews(): Promise<Review[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('content_reviews').select(REVIEW_COLUMNS)
  return error ? [] : (data as ReviewRow[]).map(toReview)
}

/** One row per teacher and line: saving again replaces the note and reopens it. */
export async function saveReview(input: ReviewInput): Promise<Review> {
  const reviewerId = await currentUserId()
  const row = {
    reviewer_id: reviewerId, item_key: input.itemKey, lesson_id: input.lessonId, target: input.target,
    verdict: input.verdict, correction: input.correction, comment: input.comment, voice: input.voice, status: 'open',
  }
  const { data, error } = await requireSupabase()
    .from('content_reviews').upsert(row, { onConflict: 'reviewer_id,item_key' }).select(REVIEW_COLUMNS).single()
  if (error) throw new Error(SAVE_FAILED)
  return toReview(data as ReviewRow)
}

export async function listProfiles(): Promise<ProfileRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('profiles').select('id, username, role').order('username')
  if (error) return []
  return (data as { id: string; username: string; role: unknown }[]).map((p) => ({ ...p, role: asRole(p.role) }))
}

/** Open fixes from every teacher, newest first (admin only: RLS hides other people's rows otherwise). */
export async function fetchAllOpenFixes(): Promise<OpenFix[]> {
  if (!supabase) return []
  const [{ data, error }, profiles] = await Promise.all([
    supabase.from('content_reviews').select(REVIEW_COLUMNS).eq('verdict', 'fix').eq('status', 'open')
      .order('created_at', { ascending: false }),
    listProfiles(),
  ])
  if (error) return []
  const names = new Map(profiles.map((p) => [p.id, p.username]))
  return (data as ReviewRow[]).map((r) => ({ ...toReview(r), reviewer: names.get(r.reviewer_id) ?? 'A teacher' }))
}

export async function resolveReview(id: string): Promise<void> {
  const { error } = await requireSupabase().from('content_reviews').update({ status: 'resolved' }).eq('id', id)
  if (error) throw new Error(SAVE_FAILED)
}

export async function setRole(username: string, role: Role): Promise<void> {
  const { error } = await requireSupabase().rpc('set_role', { p_username: username, p_role: role })
  if (error) throw new Error(SAVE_FAILED)
}
