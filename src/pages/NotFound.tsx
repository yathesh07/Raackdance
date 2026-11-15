import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { RibbonFallback } from '@/three/Hero3D'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-pearl pt-24">
      <Seo title="Page not found | Raack" noindex />
      <div className="absolute inset-0 opacity-50"><RibbonFallback /></div>
      <div className="container-x relative text-center">
        <p className="font-display text-[clamp(6rem,20vw,14rem)] leading-none text-accent">404</p>
        <h1 className="display-md mt-2">This step isn't in our choreography.</h1>
        <p className="lead mx-auto mt-4 max-w-lg">The page may have moved during our website redesign.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/" className="btn-dark">Go home</Link><Link to="/programs" className="btn-ghost">Programs</Link><Link to="/studios" className="btn-ghost">Find a studio</Link></div>
      </div>
    </section>
  )
}
