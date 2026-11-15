import { MessageCircle } from 'lucide-react'
import { useContent } from '@/lib/content'
import { waHref } from '@/lib/utils'

export function WhatsAppFab() {
  const { general } = useContent()
  if (!general.whatsapp) return null
  return (
    <a href={waHref(general.whatsapp, 'Hi Raack! I would like to know more about your dance classes.')} target="_blank" rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,.7)] transition hover:scale-105"
      aria-label="Chat with Raack on WhatsApp">
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
