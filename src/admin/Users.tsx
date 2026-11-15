import { useEffect, useState } from 'react'
import { UserPlus } from 'lucide-react'
import { repo } from '@/lib/repo'
import { supabase } from '@/lib/supabase'
import { ROLES, type ProfileRow, type Role, type StudioRow } from '@/lib/types'
import { Badge, Modal, PageTitle, Toast } from './ui'
import { fmtDate } from '@/lib/utils'

export default function Users({ p }: { p: ProfileRow }) {
  const [rows, setRows] = useState<ProfileRow[]>([])
  const [studios, setStudios] = useState<StudioRow[]>([])
  const [edit, setEdit] = useState<Partial<ProfileRow> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [toast, setToast] = useState<{ text: string; err?: boolean } | null>(null)
  const load = async () => { try { setRows(await repo.list('profiles')); setStudios(await repo.list('studios')) } catch (e: any) { setToast({ text: e.message, err: true }) } }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!edit?.email || !edit.full_name || !edit.role) return setToast({ text: 'Name, email and role are required', err: true })
    if (edit.id === p.id && (edit.role !== 'super_admin' || !edit.active)) return setToast({ text: "You can't remove your own Super Admin access", err: true })
    try {
      if (supabase) {
        const { error } = await supabase.functions.invoke('admin-users', { body: { action: isNew ? 'invite' : 'update', ...edit } })
        if (error) throw new Error((await (error as any).context?.json?.())?.error ?? error.message)
      } else {
        await repo.upsert('profiles', { ...edit, studio_ids: edit.studio_ids ?? [], active: edit.active ?? true } as ProfileRow)
      }
      setToast({ text: isNew ? (supabase ? 'Invitation email sent' : 'User created (demo password: raack-demo)') : 'User updated' }); setEdit(null); load()
    } catch (e: any) { setToast({ text: e.message, err: true }) }
  }
  const studioName = (id: string) => studios.find((s) => s.id === id)?.name ?? id

  return (
    <div>
      <PageTitle title="Users & roles" sub="Access is enforced in the database with row-level security.">
        <button onClick={() => { setIsNew(true); setEdit({ role: 'counsellor', active: true, studio_ids: [] }) }} className="adm-btn bg-ink text-white"><UserPlus className="h-4 w-4" />Invite user</button>
      </PageTitle>
      <div className="mb-6 grid gap-3 text-xs text-muted md:grid-cols-5">
        {[['Super Admin', 'Everything incl. users, settings, audit log'], ['Content Editor', 'Programs, studios, events, gallery, testimonials, pages'], ['Branch Manager', 'Own studios, schedules & their enquiries'], ['Counsellor', 'Unassigned + own enquiries'], ['Read-only', 'View content & aggregate stats only']].map(([r, d]) => <div key={r} className="rounded-xl border border-line bg-white p-3"><p className="font-semibold text-ink">{r}</p>{d}</div>)}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-pearl/60 text-xs uppercase tracking-wider text-muted"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Studios</th><th className="px-4 py-3">Status</th><th className="hidden px-4 py-3 md:table-cell">Added</th></tr></thead>
          <tbody>{rows.map((u) => (
            <tr key={u.id} onClick={() => { setIsNew(false); setEdit({ ...u }) }} className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-pearl/40">
              <td className="px-4 py-3"><p className="font-semibold">{u.full_name}</p><p className="text-xs text-muted">{u.email}</p></td>
              <td className="px-4 py-3"><Badge>{ROLES.find((r) => r.value === u.role)?.label}</Badge></td>
              <td className="px-4 py-3 text-xs">{u.studio_ids.map(studioName).join(', ') || '—'}</td>
              <td className="px-4 py-3">{u.active ? <Badge tone="bg-emerald-100 text-emerald-800">Active</Badge> : <Badge>Disabled</Badge>}</td>
              <td className="hidden px-4 py-3 text-xs text-muted md:table-cell">{fmtDate(u.created_at)}</td>
            </tr>))}
          </tbody>
        </table>
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={isNew ? 'Invite user' : 'Edit user'}>
        {edit && (
          <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); save() }}>
            <label className="text-sm">Full name<input className="adm-input mt-1" value={edit.full_name ?? ''} onChange={(e) => setEdit({ ...edit, full_name: e.target.value })} /></label>
            <label className="text-sm">Email<input type="email" className="adm-input mt-1" value={edit.email ?? ''} disabled={!isNew} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></label>
            <label className="text-sm">Role<select className="adm-input mt-1" value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value as Role })}>{ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select></label>
            {edit.role === 'branch_manager' && (
              <fieldset className="text-sm"><legend className="mb-1">Studios this manager can access</legend>
                <div className="grid max-h-56 grid-cols-2 gap-1 overflow-y-auto rounded-lg border border-line p-2">
                  {studios.map((s) => <label key={s.id} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={(edit.studio_ids ?? []).includes(s.id)} onChange={(e) => setEdit({ ...edit, studio_ids: e.target.checked ? [...(edit.studio_ids ?? []), s.id] : (edit.studio_ids ?? []).filter((x) => x !== s.id) })} />{s.name}</label>)}
                </div>
              </fieldset>
            )}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.active ?? true} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} />Active</label>
            <div className="flex justify-end gap-2 border-t border-line pt-4"><button type="button" onClick={() => setEdit(null)} className="adm-btn border border-line">Cancel</button><button className="adm-btn bg-accent text-white">{isNew ? 'Send invite' : 'Save'}</button></div>
          </form>
        )}
      </Modal>
      <Toast msg={toast} onDone={() => setToast(null)} />
    </div>
  )
}
