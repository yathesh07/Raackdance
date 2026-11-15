import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Eye, EyeOff, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { repo, keyOf } from '@/lib/repo'
import type { TableName } from '@/lib/types'
import { Badge, Confirm, Empty, ImageField, Modal, PageTitle, Toast } from './ui'
import { cn } from '@/lib/utils'

export type FieldDef = {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'image' | 'list' | 'json' | 'color'
  options?: { value: string; label: string }[]
  help?: string
  required?: boolean
  readOnlyOnEdit?: boolean
  full?: boolean
}
export type ColumnDef<T> = { label: string; render: (r: T) => ReactNode; className?: string }

export function ResourceManager<T extends Record<string, any>>({
  table, title, sub, fields, columns, defaults, canEdit, canEditRow, rowFilter, searchKeys, extraFilter, publishToggle = true, allowCreate = true, allowDelete = true,
}: {
  table: TableName; title: string; sub?: string; fields: FieldDef[]; columns: ColumnDef<T>[]; defaults: Partial<T>; canEdit: boolean
  canEditRow?: (r: T) => boolean; rowFilter?: (r: T) => boolean; searchKeys: string[]; extraFilter?: { label: string; options: { value: string; label: string }[]; test: (r: T, v: string) => boolean }
  publishToggle?: boolean; allowCreate?: boolean; allowDelete?: boolean
}) {
  const key = keyOf(table)
  const [rows, setRows] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [xf, setXf] = useState('')
  const [edit, setEdit] = useState<Partial<T> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [del, setDel] = useState<T | null>(null)
  const [toast, setToast] = useState<{ text: string; err?: boolean } | null>(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setLoading(true)
    try { setRows((await repo.list(table)) as unknown as T[]) } catch (e: any) { setToast({ text: e.message, err: true }) } finally { setLoading(false) }
  }, [table])
  useEffect(() => { load() }, [load])

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return rows.filter((r) => (!rowFilter || rowFilter(r)) && (!t || searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(t))) && (!xf || !extraFilter || extraFilter.test(r, xf)))
  }, [rows, q, rowFilter, searchKeys, xf, extraFilter])

  const editable = (r: Partial<T>) => canEdit && (!canEditRow || isNew || canEditRow(r as T))

  const save = async () => {
    if (!edit) return
    const errs: Record<string, string> = {}
    fields.forEach((f) => { if (f.required && (edit[f.key] === undefined || edit[f.key] === '' || edit[f.key] === null)) errs[f.key] = 'Required' })
    for (const f of fields.filter((f) => f.type === 'json')) {
      const v = edit[f.key]
      if (typeof v === 'string') { try { (edit as any)[f.key] = v.trim() ? JSON.parse(v) : null } catch { errs[f.key] = 'Invalid JSON' } }
    }
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSaving(true)
    try {
      await repo.upsert(table, edit as any)
      setToast({ text: 'Saved' }); setEdit(null); await load()
    } catch (e: any) { setToast({ text: e.message ?? 'Save failed', err: true }) } finally { setSaving(false) }
  }
  const togglePublish = async (r: T) => {
    try { await repo.upsert(table, { ...r, published: !r.published } as any); await load() } catch (e: any) { setToast({ text: e.message, err: true }) }
  }
  const remove = async () => {
    if (!del) return
    try { await repo.remove(table, del[key]); setToast({ text: 'Deleted' }); setDel(null); await load() } catch (e: any) { setToast({ text: e.message, err: true }); setDel(null) }
  }
  const set = (k: string, v: unknown) => setEdit((e) => ({ ...(e ?? {}), [k]: v }) as Partial<T>)

  return (
    <div>
      <PageTitle title={title} sub={sub ?? `${list.length} of ${rows.length} records`}>
        {canEdit && allowCreate && <button onClick={() => { setIsNew(true); setErrors({}); setEdit({ ...defaults }) }} className="adm-btn bg-ink text-white hover:bg-charcoal"><Plus className="h-4 w-4" />Add new</button>}
      </PageTitle>
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3">
          <Search className="h-4 w-4 text-muted" /><input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-full bg-transparent py-2 text-sm outline-none" />
        </div>
        {extraFilter && <select aria-label={extraFilter.label} className="adm-input !w-auto" value={xf} onChange={(e) => setXf(e.target.value)}><option value="">{extraFilter.label}: all</option>{extraFilter.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>}
      </div>
      {loading ? <div className="h-40 animate-pulse rounded-2xl bg-white" /> : list.length === 0 ? <Empty>No records found.</Empty> : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-pearl/60 text-xs uppercase tracking-wider text-muted">
              <tr>{columns.map((c) => <th key={c.label} className={cn('px-4 py-3 font-semibold', c.className)}>{c.label}</th>)}{publishToggle && <th className="px-4 py-3">Status</th>}<th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r[key]} className="border-b border-line/60 last:border-0 hover:bg-pearl/40">
                  {columns.map((c) => <td key={c.label} className={cn('px-4 py-3 align-middle', c.className)}>{c.render(r)}</td>)}
                  {publishToggle && <td className="px-4 py-3">{r.published !== false ? <Badge tone="bg-emerald-100 text-emerald-800">Published</Badge> : <Badge>Hidden</Badge>}</td>}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {publishToggle && editable(r) && <button onClick={() => togglePublish(r)} className="rounded-lg p-2 text-muted hover:bg-pearl hover:text-ink" title={r.published !== false ? 'Unpublish' : 'Publish'} aria-label={r.published !== false ? 'Unpublish' : 'Publish'}>{r.published !== false ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                    <button onClick={() => { setIsNew(false); setErrors({}); setEdit({ ...r }) }} className="rounded-lg p-2 text-muted hover:bg-pearl hover:text-ink" aria-label={editable(r) ? 'Edit' : 'View'}><Pencil className="h-4 w-4" /></button>
                    {canEdit && allowDelete && editable(r) && <button onClick={() => setDel(r)} className="rounded-lg p-2 text-muted hover:bg-accent-soft hover:text-accent" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title={isNew ? `New ${title.replace(/s$/, '').toLowerCase()}` : editable(edit ?? {}) ? 'Edit' : 'View (read-only)'}>
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); save() }} className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => {
              const v = edit[f.key]
              const dis = !editable(edit) || (!isNew && f.readOnlyOnEdit)
              const id = `fld-${f.key}`
              const full = f.full || ['textarea', 'list', 'json', 'image'].includes(f.type ?? 'text')
              return (
                <div key={f.key} className={full ? 'sm:col-span-2' : ''}>
                  <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-wider text-charcoal">{f.label}{f.required && ' *'}</label>
                  {f.type === 'textarea' ? <textarea id={id} rows={5} className="adm-input" value={v ?? ''} onChange={(e) => set(f.key, e.target.value)} disabled={dis} />
                    : f.type === 'number' ? <input id={id} type="number" step="any" className="adm-input" value={v ?? ''} onChange={(e) => set(f.key, e.target.value === '' ? null : Number(e.target.value))} disabled={dis} />
                    : f.type === 'select' ? <select id={id} className="adm-input" value={v ?? ''} onChange={(e) => set(f.key, e.target.value || null)} disabled={dis}><option value="">—</option>{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                    : f.type === 'boolean' ? <label className="flex items-center gap-2 text-sm"><input id={id} type="checkbox" checked={!!v} onChange={(e) => set(f.key, e.target.checked)} disabled={dis} className="h-4 w-4 accent-[var(--color-accent)]" />Yes</label>
                    : f.type === 'image' ? <ImageField value={v ?? ''} onChange={(x) => set(f.key, x)} disabled={dis} folder={table} />
                    : f.type === 'list' ? <textarea id={id} rows={5} className="adm-input font-mono text-xs" value={Array.isArray(v) ? v.join('\n') : v ?? ''} onChange={(e) => set(f.key, e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))} disabled={dis} />
                    : f.type === 'json' ? <textarea id={id} rows={6} className="adm-input font-mono text-xs" value={typeof v === 'string' ? v : JSON.stringify(v ?? null, null, 2)} onChange={(e) => set(f.key, e.target.value)} disabled={dis} />
                    : f.type === 'color' ? <div className="flex gap-2"><input type="color" value={v ?? '#ec1d25'} onChange={(e) => set(f.key, e.target.value)} disabled={dis} className="h-10 w-12 rounded" /><input id={id} className="adm-input" value={v ?? ''} onChange={(e) => set(f.key, e.target.value)} disabled={dis} /></div>
                    : <input id={id} className="adm-input" value={v ?? ''} onChange={(e) => set(f.key, e.target.value)} disabled={dis} />}
                  {f.help && <p className="mt-1 text-xs text-muted">{f.help}</p>}
                  {errors[f.key] && <p className="mt-1 text-xs text-accent">{errors[f.key]}</p>}
                </div>
              )
            })}
            {editable(edit) && (
              <div className="sticky bottom-0 -mx-6 -mb-6 flex justify-end gap-2 border-t border-line bg-white px-6 py-4 sm:col-span-2">
                <button type="button" onClick={() => setEdit(null)} className="adm-btn border border-line">Cancel</button>
                <button type="submit" disabled={saving} className="adm-btn bg-accent text-white">{saving ? 'Saving…' : 'Save changes'}</button>
              </div>
            )}
          </form>
        )}
      </Modal>
      <Confirm open={!!del} text={`Delete this record permanently? This cannot be undone.`} onYes={remove} onNo={() => setDel(null)} />
      <Toast msg={toast} onDone={() => setToast(null)} />
    </div>
  )
}
