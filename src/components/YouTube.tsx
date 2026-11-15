import { useState } from 'react'
import { Play } from 'lucide-react'
import { ytThumb } from '@/lib/utils'

/** Lite YouTube embed: thumbnail until clicked (privacy-enhanced domain, no third-party JS on load). */
export function YouTube({ id, title, vertical = true }: { id: string; title: string; vertical?: boolean }) {
  const [on, setOn] = useState(false)
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-night ${vertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
      {on ? (
        <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      ) : (
        <button onClick={() => setOn(true)} className="absolute inset-0 h-full w-full" aria-label={`Play video: ${title}`}>
          <img src={ytThumb(id)} alt="" loading="lazy" className="h-full w-full scale-[1.35] object-cover opacity-80 transition duration-700 group-hover:scale-[1.42] group-hover:opacity-100" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-accent shadow-xl transition group-hover:scale-110"><Play className="ml-1 h-6 w-6 fill-current" /></span>
        </button>
      )}
    </div>
  )
}
