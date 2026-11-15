import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'section' }) {
  const C = motion[as] as typeof motion.div
  return (
    <C
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </C>
  )
}

/** Line-by-line 3D text reveal (each line rotates up from below with perspective). Trigger lives on the parent so clipped lines still animate. */
export function RevealLines({ lines, className, lineClass, delay = 0, as = 'h2' }: { lines: ReactNode[]; className?: string; lineClass?: string; delay?: number; as?: 'h1' | 'h2' | 'h3' }) {
  const Tag = motion[as] as typeof motion.h2
  return (
    <Tag className={className} style={{ perspective: 900 }} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: delay } } }}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn('block origin-bottom', lineClass)}
            variants={{ hidden: { y: '105%', rotateX: -70, opacity: 0 }, show: { y: '0%', rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } } }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 }), sy = useSpring(y, { stiffness: 200, damping: 15 })
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength); y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  return (
    <motion.div className={className ?? 'inline-block'} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
      {children}
    </motion.div>
  )
}

/** Perspective tilt card with moving specular highlight. */
export function Tilt({ children, className, max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const mx = useMotionValue(0.5), my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 150, damping: 18 })
  const glare = useTransform([mx, my] as any, ([a, b]: number[]) => `radial-gradient(circle at ${a * 100}% ${b * 100}%, rgba(255,255,255,.35), transparent 55%)`)
  return (
    <motion.div
      className={cn('relative [transform-style:preserve-3d]', className)}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        if (window.matchMedia('(pointer: coarse)').matches) return
        const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height)
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5) }}
    >
      {children}
      <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glare }} />
    </motion.div>
  )
}

export function Counter({ to, suffix = '', className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref} className={className}>{v.toLocaleString('en-IN')}{suffix}</span>
}

export function Parallax({ children, offset = 60, className }: { children: ReactNode; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current; if (!el) return
        const r = el.getBoundingClientRect(); const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight
        setY(-p * offset)
      })
    }
    on(); addEventListener('scroll', on, { passive: true }); return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [offset])
  return <div ref={ref} className={className}><div style={{ transform: `translate3d(0,${y}px,0)` }} className="h-full w-full will-change-transform">{children}</div></div>
}
