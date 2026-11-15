import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Magnetic, RevealLines, Reveal } from './Motion'
import { RibbonFallback } from '@/three/Hero3D'

export function BigCTA({ title = ['Unlock your', 'dancing potential now.'], body }: { title?: string[]; body?: string }) {
  return (
    <section className="relative overflow-hidden bg-night py-28 text-ivory sm:py-36">
      <div className="absolute inset-0 opacity-40"><RibbonFallback /></div>
      <div className="absolute inset-0 bg-gradient-to-b from-night via-night/60 to-night" />
      <div className="container-x relative text-center">
        <Reveal><span className="eyebrow justify-center">Free trial class</span></Reveal>
        <RevealLines lines={title} className="display-xl mx-auto mt-6 max-w-5xl" />
        {body && <Reveal delay={0.2}><p className="lead mx-auto mt-6 max-w-2xl text-ivory/70">{body}</p></Reveal>}
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Magnetic><Link to="/book-a-free-trial" className="btn-primary !px-8 !py-4 text-base">Book a Free Trial <ArrowUpRight className="h-5 w-5" /></Link></Magnetic>
            <Link to="/studios" className="btn-light !px-8 !py-4 text-base">Find a Studio</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
