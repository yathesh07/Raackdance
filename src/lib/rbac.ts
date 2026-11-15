import type { EnquiryRow, ProfileRow, Role } from './types'

export type Module =
  | 'overview' | 'pages' | 'programs' | 'studios' | 'schedules' | 'instructors' | 'events' | 'gallery' | 'testimonials'
  | 'enquiries' | 'users' | 'settings' | 'audit' | 'careers'
type Level = 'none' | 'view' | 'edit'

const CONTENT: Module[] = ['pages', 'programs', 'studios', 'schedules', 'instructors', 'events', 'gallery', 'testimonials', 'careers']

const MATRIX: Record<Role, Partial<Record<Module, Level>>> = {
  super_admin: Object.fromEntries(
    (['overview', 'pages', 'programs', 'studios', 'schedules', 'instructors', 'events', 'gallery', 'testimonials', 'enquiries', 'users', 'settings', 'audit', 'careers'] as Module[]).map((m) => [m, 'edit']),
  ),
  content_editor: { overview: 'view', settings: 'view', ...Object.fromEntries(CONTENT.map((m) => [m, 'edit'])) },
  branch_manager: { overview: 'view', studios: 'edit', schedules: 'edit', enquiries: 'edit', programs: 'view', events: 'view' },
  counsellor: { overview: 'view', enquiries: 'edit', programs: 'view', studios: 'view', schedules: 'view', events: 'view' },
  read_only: { overview: 'view', ...Object.fromEntries(CONTENT.map((m) => [m, 'view'])) },
}

export const level = (role: Role | undefined, m: Module): Level => (role ? MATRIX[role][m] ?? 'none' : 'none')
export const canView = (role: Role | undefined, m: Module) => level(role, m) !== 'none'
export const canEdit = (role: Role | undefined, m: Module) => level(role, m) === 'edit'

/** Mirrors the RLS policy on public.enquiries (see supabase/migrations). */
export function canSeeEnquiry(p: ProfileRow, e: EnquiryRow, studioSlugById: Record<string, string>) {
  if (p.role === 'super_admin') return true
  if (p.role === 'branch_manager') return !!e.studio_slug && p.studio_ids.some((id) => studioSlugById[id] === e.studio_slug)
  if (p.role === 'counsellor') return e.assigned_to === p.id || e.assigned_to === null
  return false
}

/** Branch managers may only edit their own studios. */
export const canEditStudio = (p: ProfileRow, studioId: string) =>
  p.role === 'super_admin' || p.role === 'content_editor' || (p.role === 'branch_manager' && p.studio_ids.includes(studioId))
