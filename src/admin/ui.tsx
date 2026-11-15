import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import { repo } from '@/lib/repo'
import { cn } from '@/lib/utils'

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    addEventListener('keydown', on); return () => removeEventListener('keydown', on)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal aria-label={title}>
      <div className={cn('flex h-full w-full flex-col bg-white shadow-2xl', wide ? 'max-w-4xl' : 'max-w-2xl')} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-pearl" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}

export function Badge({ children, tone = 'bg-pearl text-charcoal' }: { children: ReactNode; tone?: string }) {
  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-semibold', tone)}>{children}</span>
}

export function PageTitle({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="font-display text-3xl tracking-tight">{title}</h1>{sub && <p className="mt-1 text-sm text-muted">{sub}</p>}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

export function Toast({ msg, onDone }: { msg: { text: string; err?: boolean } | null; onDone: () => void }) {
  useEffect(() => { if (msg) { const t = setTimeout(onDone, 3500); return () => clearTimeout(t) } }, [msg, onDone])
  if (!msg) return null
  return <div role="status" className={cn('fixed bottom-5 right-5 z-[70] rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl', msg.err ? 'bg-accent-deep' : 'bg-ink')}>{msg.text}</div>
}

export function ImageField({ value, onChange, disabled, folder }: { value: string; onChange: (v: string) => void; disabled?: boolean; folder?: string }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  const pick = async (f?: File) => {
    if (!f) return
    setBusy(true); setErr('')
    try { onChange(await repo.upload(f, folder)) } catch (e: any) { setErr(e.message) } finally { setBusy(false) }
  }
  const isVideo = /\.(mp4|webm)$/i.test(value) || value.startsWith('data:video')
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-pearl">
        {value ? (isVideo ? <video src={value} className="h-full w-full object-cover" muted /> : <img src={value} alt="" className="h-full w-full object-contain" />) : <span className="text-[0.65rem] text-muted">none</span>}
      </div>
      <div className="flex-1 space-y-2">
        <input className="adm-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="/media/… or https://…" disabled={disabled} />
        <div className="flex items-center gap-2">
          <button type="button" disabled={disabled || busy} onClick={() => ref.current?.click()} className="adm-btn border border-line bg-white hover:bg-pearl">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Upload</button>
          <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
          {err && <span className="text-xs text-accent">{err}</span>}
        </div>
      </div>
    </div>
  )
}

export function Confirm({ open, text, onYes, onNo }: { open: boolean; text: string; onYes: () => void; onNo: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/40 p-4" role="alertdialog" aria-modal>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <p className="text-sm">{text}</p>
        <div className="mt-6 flex justify-end gap-2"><button onClick={onNo} className="adm-btn border border-line">Cancel</button><button onClick={onYes} className="adm-btn bg-accent text-white">Delete</button></div>
      </div>
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">{children}</div>
}

export function downloadCsv(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return
  const cols = Object.keys(rows[0])
  const esc = (v: unknown) => { const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = name; a.click()
}
