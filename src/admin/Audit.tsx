import { useEffect, useMemo, useState } from 'react'
import { repo } from '@/lib/repo'
import type { AuditRow } from '@/lib/types'
import { Badge, Empty, PageTitle, downloadCsv } from './ui'
import { fmtDate } from '@/lib/utils'

export default function Audit() {
  const [rows, setRows] = useState<AuditRow[]>([])
  const [t, setT] = useState('')
  const [q, setQ] = useState('')
  const [err, setErr] = useState('')
  useEffect(() => { repo.list('audit_logs').then(setRows).catch((e) => setErr(e.message)) }, [])
  const tables = useMemo(() => [...new Set(rows.map((r) => r.table_name))].sort(), [rows])
  const list = rows.filter((r) => (!t || r.table_name === t) && (!q || `${r.actor_email} ${r.record_id} ${r.action}`.toLowerCase().includes(q.toLowerCase()))).slice(0, 500)
  return (
    <div>
      <PageTitle title="Audit log" sub="Every create, update and delete — recorded by database triggers.">
        <button onClick={() => downloadCsv('raack-audit-log.csv', list as any)} className="adm-btn border border-line bg-white">Export CSV</button>
      </PageTitle>
      {err && <p className="mb-3 text-sm text-accent">{err}</p>}
      <div className="mb-4 flex flex-wrap gap-2"><input aria-label="Search audit log" className="adm-input !w-64" placeholder="Search user, record…" value={q} onChange={(e) => setQ(e.target.value)} /><select aria-label="Table" className="adm-input !w-auto" value={t} onChange={(e) => setT(e.target.value)}><option value="">All tables</option>{tables.map((x) => <option key={x}>{x}</option>)}</select></div>
      {!list.length ? <Empty>No activity recorded yet.</Empty> : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-pearl/60 text-xs uppercase tracking-wider text-muted"><tr><th className="px-4 py-3">When</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Table</th><th className="px-4 py-3">Record</th><th className="hidden px-4 py-3 lg:table-cell">Change</th></tr></thead>
            <tbody>{list.map((r) => (
              <tr key={r.id} className="border-b border-line/60 align-top last:border-0">
                <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted">{fmtDate(r.created_at)}</td><td className="px-4 py-2.5 text-xs">{r.actor_email ?? 'system'}</td>
                <td className="px-4 py-2.5"><Badge tone={r.action === 'delete' ? 'bg-accent-soft text-accent-deep' : r.action === 'insert' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}>{r.action}</Badge></td>
                <td className="px-4 py-2.5 font-mono text-xs">{r.table_name}</td><td className="max-w-[160px] truncate px-4 py-2.5 font-mono text-xs">{r.record_id}</td>
                <td className="hidden max-w-md px-4 py-2.5 lg:table-cell"><code className="line-clamp-2 break-all text-[0.7rem] text-muted">{r.diff ? JSON.stringify(r.diff) : '—'}</code></td>
              </tr>))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
