import { Seo } from '@/components/Seo'
import { useContent } from '@/lib/content'

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pt-36 pb-24 sm:pt-44">
      <div className="container-x max-w-3xl">
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Draft — pending review by Raack management and legal counsel.</p>
        <h1 className="display-lg mt-8">{title}</h1>
        <div className="mt-8 space-y-5 leading-relaxed text-charcoal [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl">{children}</div>
      </div>
    </section>
  )
}

export function Privacy() {
  const { general } = useContent()
  return (
    <>
      <Seo title="Privacy Notice | Raack Academy of Dance" description="How Raack Academy of Dance handles information submitted through this website." noindex />
      <Shell title="Privacy notice">
        <p>This notice explains how Raack Academy of Dance ("Raack") uses information you submit through raackdance.com.</p>
        <h2>What we collect</h2>
        <p>When you send an enquiry we collect the details you enter (such as name, phone number, email, the program or studio you're interested in, and any message), together with basic technical information about how you reached the site (for example campaign tags in the link you followed).</p>
        <h2>How we use it</h2>
        <p>We use it only to respond to your enquiry, schedule trial classes and follow up about Raack programs. Access is limited to authorised Raack staff; branch staff see only enquiries for their studio.</p>
        <h2>Children</h2>
        <p>Enquiries for children must be made by a parent or legal guardian. We do not publish photographs, videos or testimonials of students without appropriate consent.</p>
        <h2>Your choices</h2>
        <p>To access, correct or delete your information, contact us at {general.email} or {general.phone}.</p>
      </Shell>
    </>
  )
}
export function Terms() {
  return (
    <>
      <Seo title="Terms of Use | Raack Academy of Dance" description="Terms of use for raackdance.com." noindex />
      <Shell title="Terms of use">
        <p>By using raackdance.com you agree to use it lawfully and not to misuse forms or attempt to access restricted areas.</p>
        <p>Program, schedule and event information may change; please confirm details with your studio. All Raack names, logos, music, photographs and videos are the property of Raack Academy of Dance or used with permission and may not be reused without written consent.</p>
      </Shell>
    </>
  )
}
