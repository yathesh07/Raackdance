import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useContent } from '@/lib/content'
import { contact } from '@/content/site'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/Section'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { telHref } from '@/lib/utils'

export default function Contact() {
  const { general, socials, studios, testimonials } = useContent()
  const t = testimonials.find((x) => x.name.includes('Elanthirayan'))
  return (
    <>
      <Seo page="contact" />
      <PageHero eyebrow="Contact" title={['Are you ready', <em key="d" className="text-accent">to dance?</em>]} intro={contact.intro} />
      <div className="container-x pt-6"><Breadcrumbs items={[{ label: 'Contact' }]} /></div>
      <section className="section !pt-12">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.3fr]">
          <div className="space-y-4">
            <a href={telHref(general.phone)} className="card card-hover flex items-center gap-5 p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white"><Phone className="h-5 w-5" /></span><span><span className="block text-xs uppercase tracking-wider text-muted">Call us</span><span className="font-display text-2xl">{general.phone}</span></span></a>
            <a href={`mailto:${general.email}`} className="card card-hover flex items-center gap-5 p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white"><Mail className="h-5 w-5" /></span><span><span className="block text-xs uppercase tracking-wider text-muted">Email</span><span className="font-display text-xl">{general.email}</span><span className="block text-sm text-muted">Enquiries: {general.enquiryEmail}</span></span></a>
            <Link to="/studios" className="card card-hover flex items-center gap-5 p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-pearl text-accent"><MapPin className="h-5 w-5" /></span><span><span className="block text-xs uppercase tracking-wider text-muted">{contact.nearYou}</span><span className="font-display text-xl">{studios.length} studio locations</span><span className="block text-sm text-muted">{contact.nearYouBody}</span></span></Link>
            <div className="card p-6"><p className="text-xs uppercase tracking-wider text-muted">Socials</p><div className="mt-3 flex flex-wrap gap-2">{socials.map((s) => <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="chip hover:border-ink/40">{s.label}</a>)}</div></div>
            {t && <figure className="rounded-3xl bg-night p-6 text-ivory"><blockquote className="text-sm text-ivory/80">“{t.quote}”</blockquote><figcaption className="mt-4 font-display">{t.name} <span className="text-sm text-white/50">· {t.designation}</span></figcaption></figure>}
          </div>
          <div className="card p-6 sm:p-10">
            <h2 className="display-md">Enroll now!</h2>
            <p className="mt-2 text-muted">Fill out the form to reach us conveniently and we'll respond to your enquiry as soon as possible.</p>
            <div className="mt-8"><EnquiryForm type="general" /></div>
          </div>
        </div>
      </section>
    </>
  )
}
