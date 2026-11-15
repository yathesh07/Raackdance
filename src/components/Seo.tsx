import { useLocation } from 'react-router-dom'
import { env } from '@/lib/env'
import { useContent } from '@/lib/content'

/** React 19 hoists <title>/<meta>/<link> into <head>. Static per-route tags are also prerendered at build (scripts/postbuild.mjs). */
export function Seo({ page, title, description, image, noindex, jsonLd }: { page?: string; title?: string; description?: string; image?: string; noindex?: boolean; jsonLd?: object | object[] }) {
  const { pathname } = useLocation()
  const { pages } = useContent()
  const p = page ? pages[page] : undefined
  const t = title ?? p?.title ?? 'Raack Academy of Dance'
  const d = description ?? p?.meta_description ?? ''
  const url = env.siteUrl + (pathname === '/' ? '' : pathname)
  const img = image ? (image.startsWith('http') ? image : env.siteUrl + image) : env.siteUrl + '/og-image.jpg'
  return (
    <>
      <title>{t}</title>
      <meta name="description" content={d} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      {(noindex || p?.published === false) && <meta name="robots" content="noindex,nofollow" />}
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  )
}
