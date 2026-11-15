import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export type LightboxItem = { url: string; alt: string; caption?: string | null; kind?: 'image' | 'video' }
export function Lightbox({ items, index, onClose, onIndex }: { items: LightboxItem[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  useEffect(() => {
    if (index === null) return
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    document.body.style.overflow = 'hidden'; addEventListener('keydown', on)
    return () => { document.body.style.overflow = ''; removeEventListener('keydown', on) }
  }, [index, items.length, onClose, onIndex])
  const it = index !== null ? items[index] : null
  return (
    <AnimatePresence>
      {it && (
        <motion.div role="dialog" aria-modal aria-label="Image viewer" className="fixed inset-0 z-[100] flex items-center justify-center bg-night/95 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <button className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" onClick={onClose} aria-label="Close"><X /></button>
          <button className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-6" onClick={(e) => { e.stopPropagation(); onIndex((index! - 1 + items.length) % items.length) }} aria-label="Previous"><ChevronLeft /></button>
          <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-6" onClick={(e) => { e.stopPropagation(); onIndex((index! + 1) % items.length) }} aria-label="Next"><ChevronRight /></button>
          <motion.figure key={it.url} className="max-h-full max-w-5xl" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} onClick={(e) => e.stopPropagation()}>
            {it.kind === 'video' ? <video src={it.url} controls autoPlay className="max-h-[80vh] rounded-xl" /> : <img src={it.url} alt={it.alt} className="max-h-[80vh] w-auto rounded-xl object-contain" />}
            <figcaption className="mt-4 flex justify-between gap-4 text-sm text-white/70"><span>{it.caption ?? it.alt}</span><span>{index! + 1} / {items.length}</span></figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
