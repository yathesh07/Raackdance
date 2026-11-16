import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Home from '@/pages/Home'

const About = lazy(() => import('@/pages/About'))
const Programs = lazy(() => import('@/pages/Programs'))
const ProgramDetail = lazy(() => import('@/pages/ProgramDetail'))
const Studios = lazy(() => import('@/pages/Studios'))
const StudioDetail = lazy(() => import('@/pages/StudioDetail'))
const Events = lazy(() => import('@/pages/Events'))
const EventDetail = lazy(() => import('@/pages/EventDetail'))
const FacultyAcademy = lazy(() => import('@/pages/FacultyAcademy'))
const Gallery = lazy(() => import('@/pages/Gallery'))
const Careers = lazy(() => import('@/pages/Careers'))
const Franchise = lazy(() => import('@/pages/Franchise'))
const Contact = lazy(() => import('@/pages/Contact'))
const BookTrial = lazy(() => import('@/pages/BookTrial'))
const Privacy = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.Terms })))
const NotFound = lazy(() => import('@/pages/NotFound'))
const AdminApp = lazy(() => import('@/admin/AdminApp'))

const S = (el: React.ReactNode) => <Suspense fallback={<div className="min-h-screen" />}>{el}</Suspense>

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: S(<About />) },
      { path: '/programs', element: S(<Programs />) },
      { path: '/programs/:slug', element: S(<ProgramDetail />) },
      { path: '/studios', element: S(<Studios />) },
      { path: '/studios/:slug', element: S(<StudioDetail />) },
      { path: '/events', element: S(<Events />) },
      { path: '/events/:slug', element: S(<EventDetail />) },
      { path: '/faculty-academy', element: S(<FacultyAcademy />) },
      { path: '/gallery', element: S(<Gallery />) },
      { path: '/careers', element: S(<Careers />) },
      { path: '/franchise', element: S(<Franchise />) },
      { path: '/contact', element: S(<Contact />) },
      { path: '/book-a-free-trial', element: S(<BookTrial />) },
      { path: '/privacy', element: S(<Privacy />) },
      { path: '/terms', element: S(<Terms />) },
      { path: '*', element: S(<NotFound />) },
    ],
  },
  { path: '/admin/*', element: S(<AdminApp />) },
])

export default function App() {
  return <RouterProvider router={router} />
}
