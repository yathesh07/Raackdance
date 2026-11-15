export type Program = {
  slug: string
  name: string
  ageGroup: string
  audience: 'kids' | 'teens' | 'adults' | 'all'
  tagline: string
  description: string
  outcomes: string[]
  videos: string[] // YouTube IDs
  logo: string
  logoMono?: string
  image: string
  accent: string
  aka?: string
  levels?: string[]
  notice?: string
  sort: number
  published: boolean
  legacyUrl: string
}

const yt = (s: string) => s

export const programs: Program[] = [
  {
    slug: 'little-legends',
    name: 'Little Legends',
    ageGroup: '3 – 5.5 years',
    audience: 'kids',
    tagline: "A toddler's journey to sensory exploration",
    description:
      "Unleash your child's inner rhythm and watch them twirl, swirl, and shine with joy. Learning and expression come together through our story-based choreography sessions. Through dance, children develop their five senses, enhancing learning abilities and gaining a deeper understanding of movement's meaning. Give your tiny tots the opportunity to explore the world in a whole new way through dance.",
    outcomes: [],
    videos: [yt('PPVhTnvB-k8'), yt('YmrlaaTzaZY'), yt('xfKMJ4IPTcI')],
    logo: '/media/courses/client-logo-5.webp',
    logoMono: '/media/client-logo-5.webp',
    image: '/media/courses/course-1.webp',
    accent: '#F2A900',
    sort: 1,
    published: true,
    legacyUrl: '/dance-academy-chennai.html',
  },
  {
    slug: 'level-up',
    name: 'Level Up',
    aka: 'Flow Course',
    ageGroup: '5.5 – 7 years',
    audience: 'kids',
    tagline: 'Lay the groundwork for a lifelong love of dance',
    description:
      'Lay the groundwork for a lifelong love of dance, focusing on basic rhythm and movement foundations.',
    outcomes: ['Basic Rhythm Understanding', 'Foundations of Dance', 'Preparing for Next Level', 'Building Agility'],
    videos: [yt('gGKb0l_Hl7k'), yt('mF9Rf936D_I'), yt('uCdrwTvJoOY')],
    logo: '/media/courses/client-logo-7.webp',
    image: '/media/courses/course-7.webp',
    accent: '#2B7DE9',
    sort: 2,
    published: true,
    legacyUrl: '/dance-academy-classes.html',
  },
  {
    slug: 'rdep',
    name: 'RDEP',
    aka: 'Raack Dance Educational Program',
    ageGroup: '7 – 12 years',
    audience: 'kids',
    tagline: 'Building confidence, creating leaders through dance',
    description:
      "The RDEP program is all about self-expression and unlocking your dance potential. With Raack's uniquely curated levels, you'll groove to the rhythm, master body language, and discover the meaning behind every movement. Our copyrighted music and versatile curriculum will take your dancing to the next level. Boost confidence, enhance concentration, and unleash your inner dance superstar with RAACK.",
    outcomes: [],
    levels: ['Level 1', 'Level 2'],
    videos: [yt('it9Zsj5KcyQ'), yt('37nr0wNzar4'), yt('BximtcOaEmY')],
    logo: '/media/courses/client-logo-6.webp',
    logoMono: '/media/client-logo-6.webp',
    image: '/media/courses/course-2.webp',
    accent: '#EC1D25',
    sort: 3,
    published: true,
    legacyUrl: '/dance-classes-for-kids.html',
  },
  {
    slug: 'choreo-lab',
    name: 'Choreo Lab',
    ageGroup: '7 – 12 years · 13 years & above',
    audience: 'teens',
    tagline: "Get inspired, get creative, get groovin'",
    description:
      "Our Choreolab program is designed to unleash your creativity and keep you on your toes. With Dance of the Month, you'll explore street styles, learn a new dance piece every month, and become a dancing chameleon. This is the perfect program for passionate dancers seeking instant gratification. Learn trendy moves from the gurus and start making your own.",
    outcomes: [],
    videos: [yt('_rJB38jz6Rc'), yt('PgkFtdh9UQc'), yt('o87VXsXLpQw')],
    logo: '/media/courses/client-logo-1.webp',
    logoMono: '/media/client-logo-1.webp',
    image: '/media/courses/course-3.webp',
    accent: '#7B3FE4',
    sort: 4,
    published: true,
    legacyUrl: '/dance-classes-for-adults.html',
  },
  {
    slug: 'film-covers',
    name: 'Film Covers',
    ageGroup: '7 – 12 years · 13 years & above',
    audience: 'teens',
    tagline: 'From screen to stage — groove with filmy tunes',
    description:
      "Lights, camera, dance! Step into the world of cinema with the Film Covers program, where you'll groove to the beats of trending film songs. Unleash your inner Bollywood, Kollywood or Dappankuthu star and relive the magic of Indian cinema through high-energy choreography. With dramatic expressions and vibrant moves, you'll experience the flavourful essence of film music. Join us on the dance floor, have a blast, and become the star of your own cinema!",
    outcomes: [
      'Explore the flavour of dramatic expression in cinema',
      'Opportunity to showcase your talent on stage',
      'Wholesome experience of dancing to film songs',
      'High-energy and entertaining choreography sessions',
      'Experienced and passionate instructors',
      'Fun and vibrant learning environment',
    ],
    videos: [yt('jFSDM1wMVWg'), yt('UKAc2SdY-94'), yt('uWW7VA3rgS0')],
    logo: '/media/courses/client-logo-3.webp',
    logoMono: '/media/client-logo-3.webp',
    image: '/media/courses/course-4.webp',
    accent: '#FF5A1F',
    sort: 5,
    published: true,
    legacyUrl: '/dance-schools.html',
  },
  {
    slug: 'dance-fitness',
    name: 'Dance Fitness',
    ageGroup: 'Adults',
    audience: 'adults',
    tagline: 'Dance your way to a healthier and happier you!',
    description:
      'Say goodbye to pain and hello to gains in physical and mental well-being. Our Dance Wellness program offers a unique blend of dance and wellness activities that will uplift your mind, body, and soul. This unique program focuses on the joy of movement and the power of holistic well-being. No forced movements, just pure expression and body awareness. Improve your concentration, keep your mind joyful, look and feel younger by the day.',
    outcomes: [],
    videos: [],
    logo: '/media/courses/client-logo-2.webp',
    logoMono: '/media/client-logo-2.webp',
    image: '/media/courses/course-5.webp',
    accent: '#E3358B',
    sort: 6,
    published: true,
    legacyUrl: '/dance-academy.html',
  },
  {
    slug: 'just-dance',
    name: 'Just Dance',
    aka: 'Open Class',
    ageGroup: '7 – 12 years · 13 years & above',
    audience: 'all',
    tagline: 'One joy-filled hour a week',
    description:
      "Our Open Class program is designed to quench your dance thirst and help you last through the week. With vibrant choreography workshops, you'll learn the art of concentration through movement and boost your confidence on the dance floor. Repair your body and mind while spending just one hour a week with Raack. Join us for joy-filled dance sessions that fit perfectly into your busy schedule!",
    outcomes: [],
    videos: [yt('aQXcVb_yTK8'), yt('UhVetG6Dae4'), yt('usEkcGvD7A8')],
    logo: '/media/courses/client-logo-4.webp',
    logoMono: '/media/client-logo-4.webp',
    image: '/media/courses/course-6.webp',
    accent: '#1BA8A0',
    notice: 'Availability varies by studio — please check with your nearest Raack studio.',
    sort: 7,
    published: true,
    legacyUrl: '/dance-classes.html',
  },
]

export const programBySlug = (slug: string) => programs.find((p) => p.slug === slug)
export const coreProgramSlugs = ['little-legends', 'level-up', 'rdep', 'choreo-lab', 'film-covers', 'dance-fitness']
