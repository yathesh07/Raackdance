import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { env } from '@/lib/env'

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  const all = [{ label: 'Home', to: '/' }, ...items]
  const ld = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: all.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, item: it.to ? env.siteUrl + it.to : undefined })),
  }
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 opacity-50" />}
            {it.to && i < all.length - 1 ? <Link to={it.to} className="hover:text-ink">{it.label}</Link> : <span aria-current="page" className="text-charcoal">{it.label}</span>}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </nav>
  )
}
