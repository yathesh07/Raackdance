// Content migrated from https://raackdance.com (crawled 15 Nov 2026).
// Copy is preserved in meaning; only grammar/spelling has been tidied.
// Anything uncertain is listed in docs/MISSING_INFORMATION.md.

export const site = {
  name: 'Raack Academy of Dance',
  shortName: 'Raack',
  url: 'https://raackdance.com',
  tagline: 'The Amplifiers of Dance As a Way of Life in South India',
  mission: 'Igniting passion, creativity, and the love for movement in every dancer.',
  pillars: ['Rhythm-frenzy', 'Body language', 'Dynamics', 'Creativity', 'Self expression'],
  phone: '+91 90030 24113',
  phoneHref: 'tel:+919003024113',
  email: 'admin@raack.in',
  enquiryEmail: 'enquiry@raack.com',
  registrationNotice: 'Registration for the academic year 2026–2027 is now open!',
  ticketsUrl: 'https://raackdance.co.in/',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/raack_official/' },
    { label: 'Facebook', href: 'https://www.facebook.com/danceatraack/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@raackacademyofdance6792' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/raack-academy-of-dance-1031a9341/' },
    { label: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029VapQ8FPDjiOlXSH9sa32' },
  ],
  stats: [
    { value: 45, suffix: '+', label: 'Dance Studios' },
    { value: 100000, suffix: '+', label: 'Students Trained' },
    { value: 4000, suffix: '+', label: 'Events Performed' },
    { value: 28, suffix: '', label: 'Years of Dance Expertise' },
  ],
}

export const about = {
  intro:
    "Raack is an independent dance academy exclusively for kids and adults wishing to start and go a long way in their dance journey. Raack believes in creating movement-based art and is committed to bringing out every individual's uniqueness through the powerful expression of dance!",
  philosophyTitle: 'Our Philosophy is Simple',
  philosophy:
    'Think of dance as fluid like water, and style as its adaptable vessel. At Raack, we ensure our students grasp the essence of dance, enabling them to seamlessly adapt to various forms, all while celebrating its inherent beauty.',
  philosophyLine: 'The magic is in the Magic behind the Movement',
  promoVideo: '/media/video/about-raack-promo.mp4',
  promoPoster: '/media/video/about-raack-promo-poster.webp',
  philosophyImage: '/media/Our-Philosophy.webp',
  introImage: '/media/682x674.webp',
  joinCopy:
    "Join us at Raack Dance Academy and let the music guide your steps. Get ready to be part of a dynamic, supportive, and electrifying dance family that celebrates the art of movement. Don't wait any longer — take the leap and join us on the dance floor.",
  signUpCopy:
    'Embark on your dance journey with Raack Dance Academy and discover the transformative power of movement-based art. Join us in celebrating the uniqueness of every individual through the powerful expression of dance. Enroll in your desired course today and let your dance story unfold.',
}

export type TeamMember = { name: string; role: string; vision: string; body: string; photo: string }
export const coreTeam: TeamMember[] = [
  {
    name: 'Ramana Balaji',
    role: 'Founder',
    vision:
      "I strongly believe that 'Your thoughts create your reality'. Your thought flows freely every instant, similar to your dance moves. There is no limit in innovating, and hence you have a whole path of creativity to own up your dance style.",
    body: 'Raack is here to act as a bridge connecting you with the element of dance within you.',
    photo: '/media/core-team/team-2.webp',
  },
  {
    name: 'Kavi Chakravarthy',
    role: 'Curriculum Head',
    vision:
      'Our vision is to cultivate a curriculum that nurtures a profound understanding of self-expression and fosters creative performance among our students.',
    body: 'Each program is designed to unlock the innate potential within every dancer, elevating their skills to meet and exceed international standards while honoring and reinforcing our rich cultural roots. We aim to craft an educational journey that encourages innovation, artistic depth, and technical excellence, empowering our students to shine on the global stage while cherishing our heritage.',
    photo: '/media/core-team/Kavi-chakravarthi.webp',
  },
  {
    name: 'Gugan',
    role: 'Instructor Head',
    vision:
      'Our vision is to equip our instructors with versatile teaching methods, expert technique, and tailored creativity for diverse age groups.',
    body: "We empower them as torch bearers of tradition, technique, creativity, and mentorship. Our goal is to enrich the dance community with skilled, passionate, and globally competitive artists while preserving Raack's essence as 'The Place for Self-Expression', blending innovation and excellence in dance education.",
    photo: '/media/core-team/Gugan.webp',
  },
  {
    name: 'Vijay Kumar B',
    role: 'Counsellor Head',
    vision:
      'Our vision is to equip our counsellors with comprehensive knowledge of each course, enabling them to adeptly guide patrons towards courses that best suit their individual needs.',
    body: 'We are committed to maintaining a secure and welcoming environment for parents and students alike. Our goal is to foster confident, well-balanced individuals who excel in their artistic pursuits, championing self-discovery and holistic well-being within our dance community.',
    photo: '/media/core-team/Vijay-Kumar.webp',
  },
  {
    name: 'Vibinesh Vijayan',
    role: 'Event Head',
    vision:
      'Our vision is to curate and execute captivating and culturally enriching events that celebrate the diversity, talent, and artistry within our dance academy.',
    body: 'We aim to create immersive experiences that not only entertain but also educate and inspire our audience. By meticulously planning and orchestrating events that showcase the brilliance of our dancers while fostering a sense of community and cultural pride, we strive to establish our academy as a beacon of creativity and excellence in the world of performing arts.',
    photo: '/media/core-team/Vibinesh.webp',
  },
]

export type Testimonial = { name: string; designation?: string; quote: string; photo: string; program?: string }
export const testimonials: Testimonial[] = [
  {
    name: 'Mudita Mehta',
    designation: 'Chartered Accountant',
    program: 'dance-fitness',
    quote:
      "The dance fitness classes at Raack Academy, taken by Preeti, are engaging and fun! The routines are changed from time to time to keep the classes interesting. It's a great way to burn calories while dancing your heart out, and it's my stress buster. At work, I can feel a lot of happiness and positive change.",
    photo: '/media/testimonial/mudita-mehta.webp',
  },
  {
    name: 'Karthic Sankar Senthippan',
    designation: 'Engineer',
    program: 'film-covers',
    quote:
      "Sitting at a laptop all day used to make me physically inactive. However, after enrolling in the Film Covers class, I've become active throughout the day and can now accomplish much more. The instructor is fantastic, skillfully blending entertainment with the teaching of some impressive moves. I wholeheartedly recommend enrolling in these sessions to enjoy quality time while maintaining your fitness.",
    photo: '/media/testimonial/karthick.webp',
  },
  {
    name: 'Meenakshi',
    quote:
      "The best place to learn dance! The instructor is encouraging and teaches so well that even if you've never danced before, you'll find yourself dancing. The environment is incredibly positive. I always look forward to the weekends for my classes. I'm confident that everyone who comes here will enjoy it and want to continue.",
    photo: '/media/testimonial/meenakshi.webp',
  },
  {
    name: 'Athirai',
    designation: 'Dance Enthusiast',
    quote:
      'Dance has been an integral part of my life. As a classical dancer, I sought out Raack Academy to delve into various styles and explore the intricacies of Western dance. I am now filled with immense happiness and satisfaction, realizing that Raack offers even more for a passionate dancer like myself. The approach to dance at Raack is profoundly unique and blissful, expanding my thought process in ways I never imagined.',
    photo: '/media/testimonial/athirai.webp',
  },
  {
    name: 'Sivaranjini',
    designation: 'Toddler Parent',
    program: 'little-legends',
    quote:
      "I've enrolled my 3-year-old son in the Little Legends program, and he absolutely adores coming to Raack for the customized monthly themes, soundtracks, and props. The instructor is friendly and caters to students of all ages and skill levels. It's truly the best dance studio! I wholeheartedly recommend it to anyone eager to learn dance.",
    photo: '/media/testimonial/sivaranjani.webp',
  },
  {
    name: 'Dr. P. Elanthirayan',
    designation: 'Paediatric Surgeon',
    quote:
      "My journey with Raack has been delightful. Starting with my son's classes in Raack Cuddalore, I soon joined in. It's been a fun and enriching experience. Here, both children and adults learn to be themselves without inhibitions. The instructors are highly professional and connect well with everyone. Mrs. Purni, the proprietor, is always enthusiastic, showcasing our kids' talents and keeping us motivated. At Raack, we're one big family of fun and frolic!",
    photo: '/media/testimonial/elanthirayan.webp',
  },
]

export const facultyAcademy = {
  title: "Raack Academy's Faculties Training Academy",
  eyebrow: 'Become A Coach',
  intro:
    'At Raack Dance Academy, we believe in empowering our staff and faculties to become exceptional coaches and mentors. Our Faculties Training Academy is designed to provide comprehensive training and development programs that equip our team members with the skills, knowledge, and expertise needed to guide and inspire our valued clients.',
  image: '/media/faculties/header.webp',
  benefits: [
    { title: 'Career Roadmap', body: "We believe in continuous learning and growth. Even after completing the training programs, you'll have access to ongoing support and resources to further enhance your coaching skills. We foster a collaborative and supportive community where our faculties can exchange ideas, seek guidance, and stay connected." },
    { title: 'Professional Development', body: 'Our training programs are tailored to enhance the professional development of our faculties. We provide in-depth training sessions led by industry experts, covering a wide range of topics including dance techniques, teaching methodologies, choreography, communication skills, and more.' },
    { title: 'Leadership Opportunities', body: "The Faculties Training Academy opens doors to leadership opportunities within Raack Dance Academy. As a trained coach, you'll have the chance to take on greater responsibilities, lead dance classes, mentor fellow instructors, and contribute to the growth and success of our academy." },
    { title: 'Specialized Coaching Skills', body: "Our training programs focus on equipping you with specialized coaching skills that go beyond dance instruction. You'll learn how to create a positive and inclusive learning environment, effectively communicate with clients of all ages and skill levels, and tailor your teaching approach to meet individual needs." },
    { title: 'Impactful Client Relationships', body: "By becoming a trained coach through our Faculties Training Academy, you'll have the privilege of forming meaningful relationships with our clients. You'll inspire and guide them on their dance journey, witness their progress, and make a positive impact on their lives through the power of dance." },
  ],
  join: 'Join the Faculties Training Academy and unlock your full potential as a dance coach. We are committed to providing you with the necessary tools, knowledge, and support to excel in your role and make a difference in the lives of our clients.',
  signup: 'To learn more about the training programs offered at the Faculties Training Academy and how to enroll, please contact us directly. We look forward to helping you embark on this exciting journey of personal and professional growth at Raack Dance Academy.',
}

export const careers = {
  intro: [
    'Join the Raack Dance Academy team and become part of a dynamic and passionate community dedicated to inspiring individuals through the art of dance.',
    'We are always on the lookout for talented individuals who are enthusiastic about making a positive impact and sharing their love for dance.',
  ],
  teamVoices: [
    { name: 'Abirami', photo: '/media/careers/abirami.webp', quote: 'As a female instructor at Raack Academy of Dance, I have found an incredibly safe and nurturing environment that prioritizes both physical and mental well-being. This empowering space has allowed me to deepen my expertise, fostering an enriching atmosphere where knowledge is cultivated and satisfaction is paramount.' },
    { name: 'Rajvarma', photo: '/media/careers/rajvarma.webp', quote: 'The leadership team at Raack Dance Academy truly cares about the well-being and success of their employees.' },
    { name: 'Joshi', photo: '/media/careers/joshi.webp', quote: 'What drew me to Raack Academy of Dance is the opportunity to make a real difference in the lives of our students.' },
  ],
  positions: [
    { title: 'Instructor', type: 'Full-time', summary: 'Join Raack Dance Academy as a skilled Instructor! Teach, provide feedback, and inspire a love for dance. You play a key role in helping students develop their skills and passion for dance. Send us your dance videos, attend our auditions, get selected — and the rest would be history.', requirements: [
      'Passion for Dance: Enthusiasm for dance and a genuine desire to share your knowledge and skills with others.',
      'Dance Proficiency: Proficient in the specific dance style(s) you will be teaching (e.g. hip-hop, house, contemporary). Demonstrated skill in choreography and dance technique.',
      'Teaching Experience: Prior experience as a dance instructor is preferred but not mandatory for entry-level positions.',
      'Communication Skills: Clear and effective verbal communication to instruct and demonstrate dance moves. Ability to provide constructive feedback to students.',
      'Patience and Adaptability: Ability to work with students of varying ages, skill levels, and learning styles. Flexibility to adapt teaching methods to individual needs.',
      'Safety Awareness: Knowledge of proper warm-up and stretching techniques to prevent injuries. Ability to create a safe and supportive learning environment.',
      'Leadership and Organization: Strong leadership skills to guide and motivate students during classes and rehearsals. Organizational skills to plan and manage class schedules and performances.',
      'Professionalism: Punctuality, reliability, and a professional demeanor when interacting with students, parents, and colleagues.',
      'Continuous Learning: Willingness to stay updated on current trends, techniques, and best practices in dance instruction.',
    ], apply: 'Apply now with your resume, dance videos/showreel, and a brief cover letter sharing your interest in joining Raack Dance Academy.' },
    { title: 'Counsellor', type: 'Full-time', summary: 'Join Raack Dance Academy as a skilled Counsellor! Send us your resume, attend our interview, get selected — and the rest would be history.', requirements: [
      "Education and Certification: Bachelor's degree in any field or a related field.",
      'Experience: Minimum of 2 years of experience in counselling or a related field. Demonstrated experience working with diverse populations and age groups.',
      'Counselling Skills: Strong interpersonal and communication skills; empathy, active listening, and the ability to establish rapport with clients.',
      'Empathy and Compassion: Demonstrated ability to provide emotional support and create a safe, non-judgmental environment for clients.',
      'Adaptability: Ability to explain the custom dance course to meet the unique needs and goals of each client.',
      'Documentation and Record-Keeping: Proficient in maintaining accurate and detailed client records.',
      'Continuous Learning: Commitment to staying updated on the latest professional development opportunities.',
      'Teamwork: Ability to collaborate with and support the team.',
    ] },
    { title: 'Branch Manager', type: 'Full-time', summary: 'A Branch Manager at a dance studio oversees day-to-day operations, manages staff, schedules classes, and ensures customer satisfaction. You are responsible for the smooth functioning of the branch, from financial management to maintaining a safe and welcoming environment for students.', requirements: [
      'Operations Management: Oversee day-to-day operations of the dance studio branch. Ensure smooth functioning of classes, rehearsals, and events.',
      'Staff Supervision: Recruit, train, and manage dance instructors and support staff.',
      'Scheduling and Coordination: Develop and maintain class schedules, ensuring optimal utilization of studio space and resources.',
      'Customer Relations: Interact with parents, students, and clients to address inquiries, concerns, and feedback.',
      'Financial Management: Monitor and manage the branch budget, including revenue, expenses, and profitability.',
      'Marketing and Promotion: Work with the marketing team to attract new students and retain existing ones. Organize and promote events, workshops, and performances.',
      'Facility Maintenance and Safety: Ensure the cleanliness, safety, and maintenance of the studio space. Implement safety protocols and emergency procedures.',
      "Curriculum Development: Collaborate with dance instructors to develop and refine class curriculum aligned with the studio's teaching philosophy.",
      'Administrative Tasks: Handle scheduling, payroll, and record-keeping. Maintain accurate student and staff records.',
      'Reporting and Communication: Provide regular reports to management on branch performance, including financial metrics, enrollment numbers, and customer feedback.',
    ], apply: 'Apply now with your resume and a brief cover letter sharing your interest in joining Raack Dance Academy.' },
    { title: 'Designer', type: 'Full-time', summary: 'Join Raack Dance Academy as a skilled designer! Create captivating and visually stunning graphic design that showcases the artistry of dance. Collaborate with our creative team to produce engaging content, ensuring seamless integration of graphics. Stay updated with industry trends and bring your creative flair to enhance our storytelling.', requirements: [
      'Proven experience in designing.', 'Proficiency in industry-standard design software.', 'Strong understanding of design techniques.', 'Excellent time management and collaboration skills.', 'Passion for dance and artistic storytelling.',
    ], apply: 'Apply now with your resume, portfolio, and a brief cover letter sharing your interest in joining Raack Dance Academy.' },
    { title: 'Video Editor', type: 'Full-time', summary: 'Join Raack Dance Academy as a skilled Video Editor! Create captivating and visually stunning videos that showcase the artistry of dance. Collaborate with our creative team to produce engaging content, ensuring seamless integration of footage, music, and graphics. Stay updated with industry trends and bring your creative flair to enhance our video storytelling.', requirements: [
      'Proven experience in video editing.', 'Proficiency in industry-standard editing software.', 'Strong understanding of video production techniques.', 'Excellent time management and collaboration skills.', 'Passion for dance and artistic storytelling.',
    ], apply: 'Apply now with your resume, portfolio/showreel, and a brief cover letter sharing your interest in joining Raack Dance Academy.' },
  ],
  why: [
    { title: 'Inspiring Environment', body: "As a member of our team, you'll be immersed in an inspiring and supportive environment that fosters creativity, growth, and personal development. We believe in nurturing our employees' talents and providing them with opportunities to thrive." },
    { title: 'Passionate Community', body: 'Join a community of like-minded individuals who are passionate about dance and committed to making a difference. Collaborate with talented instructors, choreographers, and staff members who share the same love for movement-based art.' },
    { title: 'Professional Growth', body: "At Raack Dance Academy, we believe in investing in our employees' professional growth. We provide ongoing training, workshops, and development opportunities to enhance your skills and expand your expertise." },
    { title: 'Impactful Work', body: "As a member of our team, you'll have the privilege of inspiring students of all ages and witnessing their personal growth and transformation. Be a part of creating magical moments and empowering individuals through the power of dance." },
    { title: 'Diverse Roles', body: "We offer a variety of roles across different areas, including dance instruction, administration, marketing, customer service, and more. Whether you're a seasoned dance professional or have skills in other relevant fields, there may be a perfect opportunity for you at Raack Dance Academy." },
  ],
  apply: "To apply or inquire about career opportunities, please submit your resume and a cover letter detailing your qualifications, experience, and why you would be a great fit for our team. We can't wait to hear from you!",
}

export const franchise = {
  title: 'Join the Raack Family Today',
  heading: 'Passionate About Dance & Entrepreneurship?',
  intro: [
    'A once-in-a-lifetime opportunity to set up your own dance studio backed by the most sought-after dance academy of South India! RAACK is now a family of 45+ studios and is looking out for people with creativity in heart and dance in mind to take up franchises of RAACK at your place!',
    'Open your own well-furnished dance studio at a low investment and be at the forefront of dance academies with best-in-class trainers and a top-notch dance syllabus to take dancing to a whole new level for students.',
  ],
  ownersIntro: 'The success of any franchise is determined by the success of its franchise partners. Raack is fortunate to have many such success stories to tell. Learn why our franchisee owners chose Raack Dance Academy.',
  owners: [
    { name: 'Muthu Kumar', studio: 'Pallikaranai', photo: '/media/franchise-head/muthu.webp', quote: "In 2020, we envisioned creating a nurturing art and dance community for kids' mental well-being. Pallikaranai was our chosen location, with a professional team by our side. When it came to dance, 'RAACK' was the clear choice, and it remains my best decision to date. It's a space for self-expression where our ideas are valued. With strong leaders and mentors, we work as a close-knit family. So far, it's been an amazing journey towards becoming the top dance brand, not just in Pallikaranai, but across the country. This is only the beginning." },
    { name: 'Smitha Arun', studio: 'Kolathur', photo: '/media/franchise-head/smitha.webp', quote: "I became a Raack franchisee at the Kolathur centre, driven by my love for children and dance. It's been a fulfilling journey. Seeing the kids' smiles and their dedication to mastering dance steps reaffirms my decision. The genuine joy in parents' eyes is heartwarming. Raack has provided invaluable support, especially since I'm not a dancer. Excited for more years of learning and spreading happiness with parents and children!" },
    { name: 'Aishwarya', studio: 'Old Perungalathur', photo: '/media/franchise-head/aiswarya.webp', quote: "Starting in RAACK during lockdown was a unique challenge, but it's time to redefine the norm! Grateful that dance lets us spread positivity, uplift our staff, and give back to the community. Creative courses ignite our students' imagination, celebrating its beauty while fostering competition and participation. The Founder's vision, the Core Team, and the CEO's genuine care for every Franchise Partner set it apart. Proud to be part of the RAACK FAMILY!" },
    { name: 'Purni Magesh', studio: 'Cuddalore', photo: '/media/franchise-head/purni-magesh.webp', quote: "As a female entrepreneur, I'm proud to be part of Raack, South India's premier dance academy. My mission: thrive with passion, live with compassion, and embrace life's vibrancy, fun, and style. Taking this franchise aligns perfectly with that goal. Dance is my everything and nothing all at once, providing balance in life. Raack is the perfect place for my mission." },
  ],
  why: "As a Raack Dance Academy franchisee, you'll have the opportunity to create a thriving dance community in your own area. Our proven business model, extensive support system, and renowned brand reputation will provide you with a solid foundation for success.",
  benefits: [
    { title: 'Established Brand', body: 'Raack Dance Academy is a well-known name in the dance industry, trusted by students and parents alike. Benefit from our strong brand recognition and reputation, which will give you a competitive edge in the market.' },
    { title: 'Comprehensive Training', body: 'We believe in equipping our franchisees with the knowledge and skills needed to run a successful dance academy. Our comprehensive training program covers operations, marketing, curriculum implementation, and business management.' },
    { title: 'Business Operation Support', body: "We are committed to your success every step of the way. Our experienced team will provide ongoing support and guidance, helping you navigate challenges and maximize growth opportunities. From marketing assistance to curriculum updates, we'll be there to support you." },
    { title: 'Exclusive Territory', body: "As a Raack Dance Academy franchisee, you'll enjoy the benefits of an exclusive territory, ensuring that you have a dedicated market to serve and grow within." },
    { title: 'Inspire Lives', body: "By becoming a Raack Dance Academy franchisee, you'll have the incredible opportunity to make a positive impact on the lives of students in your community. Witness the transformation and joy as you inspire individuals of all ages through the powerful art of dance." },
  ],
  closing: [
    "Join us on this exciting dance adventure and unleash your entrepreneurial spirit with Raack Dance Academy. Let's work together to create a vibrant, thriving dance community that brings happiness, creativity, and self-expression to countless lives.",
    'To learn more about franchise opportunities, investment details, and how to get started, please fill out our franchise enquiry form or contact us directly. We look forward to welcoming you to the Raack Dance Academy family!',
  ],
}

export const contact = {
  heading: 'Are You Ready To Dance?',
  intro: 'Whether you have a question, want to enroll in our dance programs, or simply want to learn more about what we offer, our team is here to assist you.',
  nearYou: "We're Probably Near You",
  nearYouBody: 'Now closer than ever, with studios across Chennai and additional locations in Cuddalore, Puducherry, Chidambaram, Thanjavur, Kumbakonam, Tiruchirappalli and Bengaluru.',
  heroImage: '/media/contact/header.webp',
}

export const cities = [
  { name: 'Chennai', image: '/media/store-locater/chennai.webp' },
  { name: 'Puducherry', image: '/media/store-locater/puducherry.webp' },
  { name: 'Bengaluru', image: '/media/store-locater/bengaluru.webp' },
  { name: 'Thanjavur', image: '/media/store-locater/thanjavur.webp' },
  { name: 'Kumbakonam', image: '/media/store-locater/kumbakonam.webp' },
  { name: 'Chidambaram', image: '/media/store-locater/chidambaram.webp' },
  { name: 'Cuddalore', image: '/media/store-locater/cuddalore.webp' },
]
