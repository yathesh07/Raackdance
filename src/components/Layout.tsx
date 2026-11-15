import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Header } from './Header'
import { Footer } from './Footer'
import { legacyTarget } from '@/lib/legacyRedirects'
import { captureAttribution } from '@/lib/utm'
import { WhatsAppFab } from './WhatsAppFab'

export function Layout() {
  const { pathname, hash } = useLocation()
  const nav = useNavigate()
  useEffect(() => { captureAttribution() }, [])
  useEffect(() => {
    const t = legacyTarget(pathname)
    if (t) nav(t, { replace: true })
  }, [pathname, nav])
  useEffect(() => {
    if (hash) { document.getElementById(hash.slice(1))?.scrollIntoView(); return }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return (
    <>
      <Header />
      <motion.main id="main" key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Outlet />
      </motion.main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
