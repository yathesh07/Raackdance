import type { ReactNode } from 'react'
import { Reveal, RevealLines } from './Motion'
import { cn } from '@/lib/utils'

export function SectionHeading({ eyebrow, title, intro, align = 'left', dark = false, className }: { eyebrow?: string; title: ReactNode[] | string; intro?: ReactNode; align?: 'left' | 'center'; dark?: boolean; className?: string }) {
  const lines = Array.isArray(title) ? title : [title]
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <Reveal><span className={cn('eyebrow', align === 'center' && 'justify-center')}>{eyebrow}</span></Reveal>}
      <RevealLines lines={lines} className={cn('display-lg mt-4', dark ? 'text-ivory' : 'text-ink')} />
      {intro && <Reveal delay={0.15}><div className={cn('lead mt-6', dark && 'text-ivory/70')}>{intro}</div></Reveal>}
    </div>
  )
}

export function PageHero({ eyebrow, title, intro, children, image, dark = false }: { eyebrow?: string; title: ReactNode[]; intro?: ReactNode; children?: ReactNode; image?: string; dark?: boolean }) {
  return (
    <section className={cn('relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24', dark ? 'bg-night text-ivory' : 'bg-pearl grain')}>
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-accent/10 blur-3xl" />
      <div className="container-x relative grid items-end gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          {eyebrow && <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>}
          <RevealLines as="h1" lines={title} className="display-xl mt-5" />
          {intro && <Reveal delay={0.2}><div className={cn('lead mt-7 max-w-2xl', dark && 'text-ivory/70')}>{intro}</div></Reveal>}
          {children && <Reveal delay={0.3}><div className="mt-9 flex flex-wrap gap-3">{children}</div></Reveal>}
        </div>
        {image && (
          <Reveal delay={0.2} className="relative hidden lg:block">
            <img src={image} alt="" fetchPriority="high" decoding="async" className="ml-auto max-h-[420px] w-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,.18)]" />
          </Reveal>
        )}
      </div>
    </section>
  )
}
