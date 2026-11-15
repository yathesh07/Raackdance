import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useContent } from '@/lib/content'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/Section'
import { Lightbox } from '@/components/Lightbox'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { cn } from '@/lib/utils'

const CATS = [
  { k: 'all', l: 'All' }, { k: 'programs', l: 'Programs' }, { k: 'events', l: 'Events' }, { k: 'performances', l: 'Performances' },
  { k: 'studios', l: 'Studios' }, { k: 'workshops', l: 'Workshops' }, { k: 'academy-life', l: 'Academy life' },
]

export default function Gallery() {
  const { media } = useContent()
  const [cat, setCat] = useState('all')
  const [lb, setLb] = useState<number | null>(null)
  const list = useMemo(() => media.filter((m) => cat === 'all' || m.category === cat), [media, cat])
  const cats = CATS.filter((c) => c.k === 'all' || media.some((m) => m.category === c.k))
  return (
    <>
      <Seo page="gallery" />
      <PageHero eyebrow="Gallery" title={['Moments', <em key="m" className="text-accent">in motion.</em>]} intro="Relive the exhilaration of our performances, events, programs and studios." />
      <div className="container-x pt-6"><Breadcrumbs items={[{ label: 'Gallery' }]} /></div>
      <section className="section !pt-10">
        <div className="container-x">
          <div role="tablist" aria-label="Gallery categories" className="sticky top-20 z-10 -mx-2 flex gap-2 overflow-x-auto rounded-full bg-ivory/80 p-2 backdrop-blur">
            {cats.map((c) => (
              <button key={c.k} role="tab" aria-selected={cat === c.k} onClick={() => setCat(c.k)} className={cn('shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition', cat === c.k ? 'border-ink bg-ink text-ivory' : 'border-line bg-white hover:border-ink/30')}>
                {c.l} <span className="opacity-50">{c.k === 'all' ? media.length : media.filter((m) => m.category === c.k).length}</span>
              </button>
            ))}
          </div>
          <motion.div layout className="mt-10 columns-2 gap-4 md:columns-3 xl:columns-4 [&>*]:mb-4">
            <AnimatePresence>
              {list.map((m, i) => (
                <motion.button layout key={m.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                  onClick={() => setLb(i)} className="group relative block w-full overflow-hidden rounded-2xl bg-pearl text-left [break-inside:avoid]" aria-label={`Open: ${m.alt}`}>
                  {m.kind === 'video' ? <video src={m.url} muted className="w-full" /> : <img src={m.url} alt={m.alt} loading="lazy" className="w-full transition duration-700 group-hover:scale-105" />}
                  {m.caption && <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 text-sm text-white transition duration-500 group-hover:translate-y-0">{m.caption}</span>}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      <Lightbox items={list.map((m) => ({ url: m.url, alt: m.alt, caption: m.caption, kind: m.kind }))} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
    </>
  )
}
