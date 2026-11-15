import { lazy, Suspense, type ComponentProps } from 'react'
const Form = lazy(() => import('./EnquiryForm').then((m) => ({ default: m.EnquiryForm })))
/** Defers zod + react-hook-form until the form is near the viewport. */
export function LazyEnquiryForm(props: ComponentProps<typeof Form>) {
  return <Suspense fallback={<div className="h-[420px] animate-pulse rounded-2xl bg-white/5" />}><Form {...props} /></Suspense>
}
