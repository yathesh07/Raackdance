import { facultyAcademy } from '@/content/site'
import { Seo } from '@/components/Seo'
import { PageHero, SectionHeading } from '@/components/Section'
import { Reveal, Parallax } from '@/components/Motion'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useContent } from '@/lib/content'

export default function FacultyAcademy() {
  const { general } = useContent()
  return (
    <>
      <Seo page="faculty-academy" />
      <PageHero eyebrow={facultyAcademy.eyebrow} title={['Faculties', 'Training', <em key="a" className="text-accent">Academy.</em>]} intro={facultyAcademy.intro}><a href="#apply" className="btn-primary">Apply now</a></PageHero>
      <div className="container-x pt-6"><Breadcrumbs items={[{ label: 'Faculty Academy' }]} /></div>
      <section className="section">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <Parallax offset={40} className="lg:sticky lg:top-28"><img src={facultyAcademy.image} alt="A Raack instructor teaching young students" loading="lazy" className="w-full rounded-[2rem] object-cover shadow-[var(--shadow-float)]" /></Parallax>
          <div>
            <SectionHeading eyebrow="Why choose FTA" title={['Become an exceptional', 'coach and mentor.']} />
            <ol className="mt-12 space-y-4">
              {facultyAcademy.benefits.map((b, i) => (
                <Reveal as="li" key={b.title} delay={i * 0.05} className="card flex gap-6 p-6 sm:p-8"><span className="font-display text-4xl text-accent/80">{i + 1}</span><div><h3 className="font-display text-2xl">{b.title}</h3><p className="mt-2 text-muted">{b.body}</p></div></Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="bg-pearl section grain" id="apply">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div><span className="eyebrow">Signup today</span><h2 className="display-lg mt-5">Join our Faculty Training Academy.</h2><p className="lead mt-5">{facultyAcademy.join}</p><p className="mt-5 text-muted">{facultyAcademy.signup}</p><p className="mt-6 font-semibold">{general.phone} · {general.email}</p></div>
          <div className="card p-6 sm:p-10"><EnquiryForm type="faculty" lockType /></div>
        </div>
      </section>
    </>
  )
}
