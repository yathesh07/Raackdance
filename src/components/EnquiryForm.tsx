import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useContent } from '@/lib/content'
import { repo } from '@/lib/repo'
import { getAttribution } from '@/lib/utm'
import { env } from '@/lib/env'
import type { EnquiryType } from '@/lib/types'
import { Turnstile } from './Turnstile'
import { cn } from '@/lib/utils'

export const COUNTRY_CODES = ['+91', '+1', '+44', '+61', '+65', '+60', '+971', '+974', '+966', '+968', '+973', '+965', '+94', '+33', '+49', '+41', '+31', '+64', '+27', '+81']
const POSITIONS = ['Instructor', 'Counsellor', 'Branch Manager', 'Designer', 'Video Editor']

const TYPE_LABEL: Record<EnquiryType, string> = {
  trial: 'Book a free trial', program: 'Program enquiry', studio: 'Studio enquiry', general: 'General enquiry', online: 'Online academy',
  franchise: 'Franchise', careers: 'Careers', event: 'Event', faculty: 'Faculty academy',
}
const PUBLIC_TYPES: EnquiryType[] = ['trial', 'program', 'studio', 'general']

const schema = z
  .object({
    type: z.enum(['trial', 'general', 'program', 'studio', 'online', 'franchise', 'careers', 'event', 'faculty']),
    name: z.string().trim().min(2, 'Please enter your name').max(120),
    country_code: z.string().regex(/^\+\d{1,4}$/, 'Invalid code'),
    phone: z.string().trim().regex(/^\d{6,15}$/, 'Enter a valid mobile number (digits only)'),
    email: z.string().trim().email('Enter a valid email').max(200),
    program_slug: z.string().optional(),
    studio_slug: z.string().optional(),
    child_age: z.string().max(40).optional(),
    gender: z.string().optional(),
    whatsapp: z.string().max(20).optional(),
    country: z.string().max(80).optional(),
    state: z.string().max(80).optional(),
    class_type: z.string().optional(),
    preferred_timing: z.string().max(120).optional(),
    heard_from: z.string().optional(),
    position: z.string().optional(),
    message: z.string().max(2000).optional(),
    guardian_consent: z.literal(true, { message: 'Please confirm to continue' }),
    website: z.string().max(0).optional(), // honeypot
  })
  .superRefine((v, ctx) => {
    const need = (k: keyof typeof v, msg: string) => { if (!v[k]) ctx.addIssue({ code: 'custom', path: [k], message: msg }) }
    if (v.type === 'trial') { need('program_slug', 'Choose a program'); need('studio_slug', 'Choose a studio') }
    if (v.type === 'program') need('program_slug', 'Choose a program')
    if (v.type === 'studio') need('studio_slug', 'Choose a studio')
    if (v.type === 'online') { need('state', 'Enter your state/region'); need('class_type', 'Choose a class type'); need('preferred_timing', 'Enter a preferred time') }
    if (v.type === 'careers') need('position', 'Choose a position')
    if (['general', 'franchise', 'faculty', 'event'].includes(v.type)) need('message', 'Tell us a little about your enquiry')
  })
type Values = z.infer<typeof schema>

export function EnquiryForm({
  type = 'trial', lockType = false, defaults = {}, dark = false, title, compact = false,
}: { type?: EnquiryType; lockType?: boolean; defaults?: Partial<Values>; dark?: boolean; title?: string; compact?: boolean }) {
  const { programs, studios } = useContent()
  const [done, setDone] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const onToken = useCallback((t: string) => setToken(t), [])
  const sortedStudios = useMemo(() => [...studios].sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name)), [studios])

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { type, country_code: '+91', ...defaults } as Partial<Values>,
  })
  const t = watch('type')

  const onSubmit = async (v: Values) => {
    setErr(null)
    if (env.turnstileSiteKey && !token) { setErr('Please complete the verification.'); return }
    try {
      const a = getAttribution()
      await repo.submitEnquiry({
        ...v, studio_slug: v.studio_slug || null,
        utm: a.utm ?? {}, referrer: a.referrer, landing_page: a.landing_page, source_page: window.location.pathname, captchaToken: token,
      } as any)
      setDone(v.name.split(' ')[0]); reset({ type, country_code: '+91', ...defaults } as any)
    } catch (e: any) { setErr(e?.message ?? 'Something went wrong.') }
  }

  const field = cn('field', dark && 'border-white/15 bg-white/5 text-ivory placeholder:text-white/40 focus:border-white/40')

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-10 text-center" role="status">
            <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />
            <h3 className={cn('display-md mt-5', dark && 'text-ivory')}>Thank you, {done}!</h3>
            <p className={cn('lead mx-auto mt-3 max-w-md', dark && 'text-ivory/70')}>Our counsellor will reach out to you shortly. Can't wait? Call us on +91 90030 24113.</p>
            <button onClick={() => setDone(null)} className={cn('mt-8', dark ? 'btn-light' : 'btn-ghost')}>Send another enquiry</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-label={title ?? TYPE_LABEL[t]}>
            {!lockType && (
              <div role="radiogroup" aria-label="Enquiry type" className="flex flex-wrap gap-2">
                {PUBLIC_TYPES.map((k) => (
                  <button type="button" key={k} role="radio" aria-checked={t === k} onClick={() => setValue('type', k)}
                    className={cn('rounded-full border px-4 py-2 text-xs font-semibold transition', t === k ? 'border-accent bg-accent text-white' : dark ? 'border-white/20 text-ivory/80 hover:border-white/50' : 'border-line bg-white text-charcoal hover:border-ink/30')}>
                    {TYPE_LABEL[k]}
                  </button>
                ))}
              </div>
            )}
            <input type="hidden" {...register('type')} />
            <div className="absolute -left-[9999px]" aria-hidden><label>Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label></div>

            <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
              <Fld e={errors} d={dark} name="name" label="Full name *"><input id="f-name" autoComplete="name" className={field} placeholder="Your name" {...register('name')} /></Fld>
              <Fld e={errors} d={dark} name="email" label="Email *"><input id="f-email" type="email" autoComplete="email" className={field} placeholder="you@example.com" {...register('email')} /></Fld>
              <Fld e={errors} d={dark} name="phone" label="Mobile number *" className={compact ? '' : 'sm:col-span-2'}>
                <div className="flex gap-2">
                  <select aria-label="Country code" className={cn(field, 'w-28 shrink-0')} {...register('country_code')}>{COUNTRY_CODES.map((c) => <option key={c}>{c}</option>)}</select>
                  <input id="f-phone" inputMode="numeric" autoComplete="tel-national" className={field} placeholder="9003024113" {...register('phone', { setValueAs: (s: string) => (s ?? '').replace(/\D/g, '') })} />
                </div>
              </Fld>

              {(t === 'trial' || t === 'program') && (
                <Fld e={errors} d={dark} name="program_slug" label="Program *">
                  <select id="f-program_slug" className={field} {...register('program_slug')}>
                    <option value="">Select a program</option>
                    {programs.map((p) => <option key={p.slug} value={p.slug}>{p.name} · {p.age_group}</option>)}
                  </select>
                </Fld>
              )}
              {(t === 'trial' || t === 'studio' || t === 'careers') && (
                <Fld e={errors} d={dark} name="studio_slug" label={t === 'careers' ? 'Preferred location' : 'Studio *'}>
                  <select id="f-studio_slug" className={field} {...register('studio_slug')}>
                    <option value="">{t === 'careers' ? 'Any location' : 'Select a studio'}</option>
                    {[...new Set(sortedStudios.map((s) => s.city))].map((c) => (
                      <optgroup key={c} label={c}>{sortedStudios.filter((s) => s.city === c).map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</optgroup>
                    ))}
                  </select>
                </Fld>
              )}
              {t === 'trial' && <Fld e={errors} d={dark} name="child_age" label="Student's age"><input id="f-child_age" className={field} placeholder="e.g. 6 years / Adult" {...register('child_age')} /></Fld>}
              {t === 'careers' && (
                <Fld e={errors} d={dark} name="position" label="Position *"><select id="f-position" className={field} {...register('position')}><option value="">Select a position</option>{POSITIONS.map((p) => <option key={p}>{p}</option>)}</select></Fld>
              )}
              {(t === 'franchise') && <Fld e={errors} d={dark} name="state" label="Preferred city / area"><input id="f-state" className={field} placeholder="Where would you open a studio?" {...register('state')} /></Fld>}
            </div>

            {['general', 'franchise', 'faculty', 'event', 'careers', 'studio', 'program'].includes(t) && (
              <Fld e={errors} d={dark} name="message" label={t === 'careers' ? 'Tell us about yourself (links to videos/portfolio welcome)' : ['general', 'franchise', 'faculty', 'event'].includes(t) ? 'Message *' : 'Message'}>
                <textarea id="f-message" rows={compact ? 3 : 4} className={field} placeholder="How can we help?" {...register('message')} />
              </Fld>
            )}

            <label className={cn('flex items-start gap-3 text-xs leading-relaxed', dark ? 'text-ivory/70' : 'text-muted')}>
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]" {...register('guardian_consent')} />
              <span>I agree to be contacted by Raack about this enquiry. If I'm enquiring for a child, I am their parent or legal guardian. See our <a href="/privacy" className="underline">privacy notice</a>.</span>
            </label>
            {errors.guardian_consent && <p role="alert" className="-mt-2 text-xs font-medium text-accent">{errors.guardian_consent.message}</p>}

            <Turnstile onToken={onToken} />
            {err && <p role="alert" className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent-deep">{err}</p>}
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto sm:justify-self-start">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {t === 'trial' ? 'Book my free trial' : 'Send enquiry'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function Fld({ name, label, children, className, e, d }: { name: string; label: string; children: React.ReactNode; className?: string; e: Record<string, any>; d: boolean }) {
  return (
    <div className={className}>
      <label htmlFor={`f-${name}`} className={cn('label', d && 'text-ivory/70')}>{label}</label>
      {children}
      {e[name] && <p role="alert" className="mt-1.5 text-xs font-medium text-accent">{String(e[name]?.message)}</p>}
    </div>
  )
}
