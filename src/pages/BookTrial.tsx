import { useSearchParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Reveal, RevealLines } from '@/components/Motion'
import type { EnquiryType } from '@/lib/types'
import { RibbonFallback } from '@/three/Hero3D'

const VALID: EnquiryType[] = ['trial', 'program', 'studio', 'online', 'general', 'franchise', 'careers', 'event', 'faculty']

export default function BookTrial() {
  const [sp] = useSearchParams()
  const t = sp.get('type') as EnquiryType | null
  const type = t && VALID.includes(t) ? t : 'trial'
  return (
    <>
      <Seo page="book-a-free-trial" />
      <section className="relative min-h-screen overflow-hidden bg-pearl pt-32 pb-20 grain sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[520px] opacity-60"><RibbonFallback /></div>
        <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <Reveal><span className="eyebrow">Free trial class</span></Reveal>
            <RevealLines as="h1" lines={['Take the', 'first step.']} className="display-xl mt-5" />
            <Reveal delay={0.2}><p className="lead mt-6">Tell us a little about the dancer and your nearest studio — a Raack counsellor will call you to schedule a free trial.</p></Reveal>
            <Reveal delay={0.3}>
              <ul className="mt-8 space-y-3">
                {['Programs from 3 years to adults', 'Studios across South India + online worldwide', 'Counsellors guide you to the right course'].map((x) => <li key={x} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-white"><Check className="h-3.5 w-3.5" /></span>{x}</li>)}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.1}><div className="card p-6 shadow-[var(--shadow-float)] sm:p-10"><EnquiryForm type={type} /></div></Reveal>
        </div>
      </section>
    </>
  )
}
