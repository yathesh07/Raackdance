// Database row shapes (snake_case) — identical in Supabase and in demo LocalDB.

export type Role = 'super_admin' | 'content_editor' | 'branch_manager' | 'counsellor' | 'read_only'
export type ConsentStatus = 'unknown' | 'obtained' | 'not_required' | 'withdrawn'
export type StudioStatus = 'active' | 'unverified' | 'closed'
export type EnquiryStatus =
  | 'new' | 'contacted' | 'trial_scheduled' | 'trial_completed' | 'enrolled' | 'not_interested' | 'invalid' | 'archived'
export type EnquiryType = 'trial' | 'general' | 'program' | 'studio' | 'online' | 'franchise' | 'careers' | 'event' | 'faculty'

export interface Base { id: string; created_at?: string; updated_at?: string }

export interface ProgramRow extends Base {
  slug: string; name: string; aka: string | null; age_group: string; audience: string; tagline: string; description: string
  outcomes: string[]; levels: string[]; videos: string[]; logo: string | null; logo_mono: string | null; image: string | null
  accent: string; notice: string | null; sort: number; published: boolean
}
export interface StudioRow extends Base {
  slug: string; legacy_slug: string | null; name: string; city: string; address: string; phones: string[]; email: string | null
  lat: number | null; lng: number | null; maps_embed: string | null; hero: string | null; is_head_office: boolean
  status: StudioStatus; schedule_verified: boolean; notes: string | null; published: boolean; sort: number
}
export interface BranchHeadRow extends Base { studio_id: string; name: string; photo: string | null; sort: number }
export interface ClassSessionRow extends Base { studio_id: string; day: number; program_slug: string; label: string; time_text: string; sort: number }
export interface TeamRow extends Base { name: string; role: string; vision: string; body: string; photo: string | null; sort: number; published: boolean }
export interface EventRow extends Base {
  slug: string; name: string; subtitle: string; edition: string; status: 'upcoming' | 'past' | 'announced'; date_text: string; venue: string
  dates_verified: boolean; summary: string; body: string[]; highlights: { title: string; body: string }[]; categories: string[]; judging: string[]
  stat: { value: string; label: string } | null; cover: string | null; poster: string | null; video: string | null; gallery: string[]
  tickets_url: string | null; register: boolean; closing: string | null; sort: number; published: boolean
}
export interface TestimonialRow extends Base {
  kind: 'student' | 'franchise' | 'staff'; name: string; designation: string | null; studio: string | null; program_slug: string | null
  quote: string; photo: string | null; consent_status: ConsentStatus; published: boolean; sort: number
}
export interface MediaRow extends Base {
  url: string; kind: 'image' | 'video'; alt: string; caption: string | null; category: string; event_slug: string | null; studio_slug: string | null
  consent_status: ConsentStatus; published: boolean; sort: number
}
export interface CareerRow extends Base { title: string; type: string; summary: string; requirements: string[]; apply: string | null; published: boolean; sort: number }
export interface SettingRow { key: string; value: any; updated_at?: string }
export interface PageRow { slug: string; title: string; meta_description: string; heading: string | null; intro: string | null; published: boolean; updated_at?: string }

export interface EnquiryRow extends Base {
  type: EnquiryType; status: EnquiryStatus; name: string; email: string | null; country_code: string; phone: string; whatsapp: string | null
  gender: string | null; program_slug: string | null; studio_slug: string | null; position: string | null; country: string | null; state: string | null
  class_type: string | null; preferred_timing: string | null; heard_from: string | null; message: string | null; child_age: string | null
  guardian_consent: boolean; utm: Record<string, string>; referrer: string | null; landing_page: string | null; source_page: string | null
  assigned_to: string | null; follow_up_at: string | null
}
export interface EnquiryNoteRow extends Base { enquiry_id: string; author_id: string | null; author_name: string | null; body: string }
export interface ProfileRow extends Base { email: string; full_name: string; role: Role; active: boolean; studio_ids: string[] }
export interface AuditRow extends Base { actor_id: string | null; actor_email: string | null; action: string; table_name: string; record_id: string | null; diff: any }

export type Tables = {
  programs: ProgramRow; studios: StudioRow; branch_heads: BranchHeadRow; class_sessions: ClassSessionRow; team_members: TeamRow
  events: EventRow; testimonials: TestimonialRow; media: MediaRow; careers: CareerRow; site_settings: SettingRow; pages: PageRow
  enquiries: EnquiryRow; enquiry_notes: EnquiryNoteRow; profiles: ProfileRow; audit_logs: AuditRow
}
export type TableName = keyof Tables

export const ENQUIRY_STATUSES: { value: EnquiryStatus; label: string; tone: string }[] = [
  { value: 'new', label: 'New', tone: 'bg-accent text-white' },
  { value: 'contacted', label: 'Contacted', tone: 'bg-sky-100 text-sky-800' },
  { value: 'trial_scheduled', label: 'Trial Scheduled', tone: 'bg-amber-100 text-amber-800' },
  { value: 'trial_completed', label: 'Trial Completed', tone: 'bg-violet-100 text-violet-800' },
  { value: 'enrolled', label: 'Enrolled', tone: 'bg-emerald-100 text-emerald-800' },
  { value: 'not_interested', label: 'Not Interested', tone: 'bg-stone-200 text-stone-700' },
  { value: 'invalid', label: 'Invalid', tone: 'bg-stone-200 text-stone-500' },
  { value: 'archived', label: 'Archived', tone: 'bg-stone-100 text-stone-500' },
]
export const ENQUIRY_TYPES: { value: EnquiryType; label: string }[] = [
  { value: 'trial', label: 'Free trial' }, { value: 'general', label: 'General' }, { value: 'program', label: 'Program' },
  { value: 'studio', label: 'Studio' }, { value: 'online', label: 'Online academy' }, { value: 'franchise', label: 'Franchise' },
  { value: 'careers', label: 'Careers' }, { value: 'event', label: 'Event' }, { value: 'faculty', label: 'Faculty academy' },
]
export const ROLES: { value: Role; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' }, { value: 'content_editor', label: 'Content Editor' },
  { value: 'branch_manager', label: 'Branch Manager' }, { value: 'counsellor', label: 'Counsellor' }, { value: 'read_only', label: 'Read-only' },
]
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
