export type EventStatus = 'upcoming' | 'past' | 'announced'
export type RaackEvent = {
  slug: string
  name: string
  subtitle: string
  edition: string
  status: EventStatus
  dateText: string
  venue: string
  datesVerified: boolean
  summary: string
  body: string[]
  highlights?: { title: string; body: string }[]
  categories?: string[]
  judging?: string[]
  stat?: { value: string; label: string }
  cover: string
  poster?: string
  video?: string
  gallery: string[]
  ticketsUrl?: string
  register: boolean
  closing?: string
  legacyUrl: string
}

const generic = [
  '/media/gallery/dance-classes-in-chennai.webp',
  '/media/gallery/dance-academy-in-chennai.webp',
  '/media/gallery/dance-classes-for-kids-in-chennai.webp',
  '/media/gallery/dance-classes-for-adults-in-chennai.webp',
]

const heal = [
  'dance-classes-in-chennai', 'dance-academy-in-chennai', 'dance-classes-for-kids-in-chennai', 'dance-classes-for-adults-in-chennai',
  'dance-classes-chennai', 'dance-academy-chennai', 'dance-class-in-chennai', 'dance-class-chennai', 'best-dance-classes-in-chennai',
  'best-dance-academy-in-chennai', 'best-dance-classes-for-kids-in-chennai', 'best-dance-classes-for-adults-in-chennai',
  'best-dance-classes-chennai', 'best-dance-dance-academy-chennai', 'best-dance-class-in-chennai', 'best-dance-class-chennai',
].map((n) => `/media/heal-world-images/${n}.webp`)

const whyAttend = [
  { title: 'Inspiration and Aspiration', body: 'Witnessing the dedication and talent of our dancers will inspire you to pursue your own dreams, whether they lie in dance or any other endeavour.' },
  { title: 'Community and Connection', body: "The Annual Recital is a gathering of like-minded individuals who share a passion for dance. It's a chance to connect and be part of a supportive community." },
  { title: 'Pure Entertainment', body: 'Be prepared to be wowed by the sheer talent and creativity on display. From graceful ballet to energetic hip-hop, there is something for everyone.' },
]

export const eventsIntro = {
  heading: 'Get Ready for a Dazzling Showcase of Talent & Artistry',
  frontRow:
    "Be sure to mark your calendars for these exciting events and join us in witnessing the incredible talent and passion of our students. Experience the joy, energy, and transformation that dance brings to their lives. Stay tuned for updates on dates, timings, and ticket information. Don't miss out on these unforgettable moments that define the vibrant spirit of Raack Dance Academy.",
}

export const events: RaackEvent[] = [
  {
    slug: 'happy-feet',
    name: 'Happy Feet',
    subtitle: 'In-House Dance Contest',
    edition: 'Season 3 · 2026',
    status: 'upcoming',
    dateText: '30 November',
    venue: 'To be announced',
    datesVerified: false,
    summary:
      'An exhilarating in-house dance competition that brings together the vibrant talent from every branch of Raack Academy of Dance — showcasing incredible dance abilities while fostering resilience, sportsmanship, and confidence.',
    body: [
      'We are thrilled to announce "Happy Feet", an exhilarating in-house dance competition that will bring together the vibrant talent from every branch of Raack Academy of Dance.',
      'This spirited event aims not only to showcase the incredible dance abilities of our students but also to foster invaluable qualities such as resilience, sportsmanship, and confidence.',
    ],
    highlights: [
      { title: 'Fostering Resilience', body: 'Through the ups and downs of preparation, students will learn to persist and overcome obstacles, building a strong foundation of resilience that extends beyond the dance floor.' },
      { title: 'Embracing Sportsmanship', body: "Competitions provide an opportunity to celebrate the achievements of all participants. Win or lose, each dancer will learn the importance of camaraderie, mutual respect, and the joy of celebrating one another's successes." },
      { title: 'Cultivating Confidence', body: 'Stepping onto a stage, under the spotlight, is a powerful confidence-building experience. "Happy Feet" encourages every participant to embrace their uniqueness and perform with courage and self-assurance.' },
    ],
    categories: [
      'Little Legends (Ages 3 – 5.5)',
      'RDEP Level 1 (Ages 7 – 12)',
      'RDEP Level 2 (Ages 7 – 12)',
      'Choreo Lab (Ages 7 – 12)',
      'Choreo Lab (Ages 13+)',
      'Film Covers (Ages 7 – 12)',
      'Film Covers (Ages 13+)',
    ],
    judging: ['Technique and Execution', 'Artistic Interpretation', 'Stage Presence and Confidence', 'Originality and Creativity'],
    cover: '/media/events/happy-feet-2025.webp',
    video: '/media/video/happy-feet.mp4',
    poster: '/media/video/happy-feet-poster.webp',
    gallery: generic,
    register: true,
    closing: 'Get ready to unleash your dancing prowess and be part of a day filled with rhythm, passion, and pure dance magic. Let\'s make "Happy Feet" a celebration of talent, growth, and community! See you on the dance floor!',
    legacyUrl: '/dance-schools-chennai.html',
  },
  {
    slug: 'first-step',
    name: 'First Step',
    subtitle: 'The Annual Recital',
    edition: '2027',
    status: 'upcoming',
    dateText: 'February 2027',
    venue: 'To be announced',
    datesVerified: false,
    summary:
      "Our grand Annual Recital — an event that transcends boundaries and unites our dance community in a celebration of talent, passion, and the pure magic of movement.",
    body: [
      "Get ready for a dance extravaganza like never before! We are thrilled to present the first step of Raack's journey, our grand Annual Recital — an event that transcends boundaries and unites our dance community in a celebration of talent, passion, and the pure magic of movement.",
      "This is not just a recital; it's Chennai's grandest dance gala, a stage where talented participants from all corners of Raack's extensive network come together to showcase their artistic brilliance. From the youngest Little Legends to the seasoned Adult Achievers, each performer will express their emotions through dance, weaving stories that will leave you mesmerised.",
    ],
    highlights: whyAttend,
    stat: { value: '4000+', label: 'Participants' },
    cover: '/media/gallery/Velachery-banner-for-first-step-2026.webp',
    video: '/media/video/first-step.mp4',
    poster: '/media/video/first-step-poster.webp',
    gallery: generic,
    ticketsUrl: 'https://raackdance.co.in/',
    register: true,
    closing: "Come, be a part of Raack's journey as we take the first step towards creating memories that will last a lifetime. Let's make this year's Annual Recital an experience that leaves us all spellbound. See you on the dance floor!",
    legacyUrl: '/dance-classes-chennai.html',
  },
  {
    slug: 'camp-raack',
    name: 'Camp Raack',
    subtitle: 'Choreo Camp — Kiddy, Junior & Senior',
    edition: '2027',
    status: 'announced',
    dateText: 'Camp dates coming soon',
    venue: 'To be announced',
    datesVerified: false,
    summary: 'Kiddy Choreo Camp, Junior & Senior Choreo Camp — with a grand dance competition. Competition categories: 7 – 12 years, 13 years & above, and Adults.',
    body: [
      'Kiddy Choreo Camp, Junior & Senior Choreo Camp.',
      'Competition categories: 7 – 12 years | 13 years & above | Adults. Camp dates and the grand dance competition will be announced soon.',
    ],
    categories: ['7 – 12 years', '13 years & above', 'Adults'],
    cover: '/media/gallery/first.webp',
    video: '/media/video/choreo-camp.mp4',
    poster: '/media/video/choreo-camp-poster.webp',
    gallery: generic,
    ticketsUrl: 'https://raackdance.co.in/',
    register: true,
    legacyUrl: '/choreo-camp-chennai.html',
  },
  {
    slug: 'heal-the-world',
    name: 'Heal The World',
    subtitle: 'A Tribute to Michael Jackson',
    edition: 'Season 4',
    status: 'past',
    dateText: '24 & 25 August 2024',
    venue: 'VR Mall, Chennai',
    datesVerified: false,
    summary:
      'Raack Academy celebrates unity and world peace through a mega dance flash mob — a tribute to Michael Jackson.',
    body: [
      "Raack Academy orchestrated an awe-inspiring mega dance flash mob featuring students across its branches. This grand event, held at VR Mall Chennai, was dedicated to the iconic Michael Jackson, with the profound purpose of promoting world peace.",
      'The mega dance flash mob, a testament to Raack Academy\'s commitment to creativity and unity, drew participants from various branches and backgrounds. The theme, "World Peace", resonated strongly with the participants, showcasing that dance and music can transcend barriers and inspire positive change.',
      'The event was graced by the presence of esteemed celebrities and film music directors, who not only added star power to the occasion but also contributed to the atmosphere of artistic celebration. Their involvement highlighted the bridge between art and social causes that Raack Academy passionately advocates.',
    ],
    stat: { value: '1800+', label: 'Kids participants' },
    cover: '/media/events/events.webp',
    video: '/media/video/heal-the-world.mp4',
    poster: '/media/video/heal-the-world-poster.webp',
    gallery: heal,
    register: false,
    legacyUrl: '/dance-studios-chennai.html',
  },
]

export const eventBySlug = (slug: string) => events.find((e) => e.slug === slug)
