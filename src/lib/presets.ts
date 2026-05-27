import { ThemeConfig, FormConfig } from '../types';

export const THEMES: ThemeConfig[] = [
  {
    id: 'midnight-void',
    name: '🌌 Midnight Nebula',
    backgroundClass: 'bg-[#040408] text-zinc-100',
    cardClass: 'bg-[#0a0a12]/85 backdrop-blur-3xl border border-indigo-500/20 shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)]',
    accentClass: 'from-blue-500 via-indigo-500 to-purple-500',
    textClass: 'text-white',
    subtextClass: 'text-indigo-200/60',
    buttonClass: 'bg-white text-zinc-950 hover:bg-zinc-105 active:scale-95 shadow-[0_4px_20px_rgba(99,102,241,0.3)]',
    borderClass: 'border-indigo-500/20',
    glowColor: 'rgba(26, 115, 232, 0.45)',
    nebulaColor: 'rgba(147, 52, 230, 0.35)',
    isLight: false
  },
  {
    id: 'forest-zen',
    name: '🌿 Forest Sanctuary',
    backgroundClass: 'bg-[#040806] text-emerald-100',
    cardClass: 'bg-[#080d0a]/85 backdrop-blur-3xl border border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]',
    accentClass: 'from-emerald-500 via-teal-500 to-cyan-500',
    textClass: 'text-white',
    subtextClass: 'text-emerald-300/50',
    buttonClass: 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-semibold text-white active:scale-95 shadow-[0_4px_20px_rgba(16,185,129,0.3)]',
    borderClass: 'border-emerald-500/20',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    nebulaColor: 'rgba(6, 182, 212, 0.3)',
    isLight: false
  },
  {
    id: 'sunset-amber',
    name: '🔥 Sunset Horizon',
    backgroundClass: 'bg-[#0a0502] text-amber-500',
    cardClass: 'bg-[#110a06]/85 backdrop-blur-3xl border border-orange-500/20 shadow-[0_0_50px_-12px_rgba(249,115,22,0.25)]',
    accentClass: 'from-orange-500 via-amber-500 to-rose-500',
    textClass: 'text-white',
    subtextClass: 'text-amber-300/40',
    buttonClass: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:opacity-95 active:scale-95 shadow-[0_4px_20px_rgba(249,115,22,0.34)]',
    borderClass: 'border-orange-500/20',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    nebulaColor: 'rgba(239, 68, 68, 0.3)',
    isLight: false
  },
  {
    id: 'cyberpunk-neon',
    name: '👾 Cyberpunk Neon',
    backgroundClass: 'bg-[#030006] text-pink-100',
    cardClass: 'bg-[#08020d]/90 backdrop-blur-3xl border-2 border-pink-500/40 shadow-[0_0_35px_rgba(236,72,153,0.3)]',
    accentClass: 'from-pink-500 via-purple-600 to-cyan-400',
    textClass: 'text-white',
    subtextClass: 'text-pink-300/60',
    buttonClass: 'bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-black tracking-wider uppercase active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.5)]',
    borderClass: 'border-pink-500/40',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    nebulaColor: 'rgba(6, 182, 212, 0.35)',
    isLight: false
  },
  {
    id: 'bubblegum-sky',
    name: '🍦 Bubblegum Pastel',
    backgroundClass: 'bg-gradient-to-tr from-slate-50 via-indigo-50 to-pink-50 text-slate-800',
    cardClass: 'bg-white/95 backdrop-blur-2xl border-2 border-indigo-200/50 shadow-[0_15px_40px_rgba(165,180,252,0.45)]',
    accentClass: 'from-pink-400 via-indigo-400 to-sky-400',
    textClass: 'text-slate-900',
    subtextClass: 'text-indigo-650/70',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium active:scale-95 shadow-[0_4px_20px_rgba(79,70,229,0.35)]',
    borderClass: 'border-indigo-100',
    glowColor: 'rgba(165, 180, 252, 0.3)',
    nebulaColor: 'rgba(244, 143, 177, 0.25)',
    isLight: true
  },
  {
    id: 'slate-minimal',
    name: '⚙️ Classic Slate',
    backgroundClass: 'bg-[#09090b] text-zinc-200',
    cardClass: 'bg-[#121214]/90 backdrop-blur-3xl border border-zinc-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)]',
    accentClass: 'from-zinc-400 via-neutral-200 to-zinc-500',
    textClass: 'text-white',
    subtextClass: 'text-zinc-400',
    buttonClass: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold active:scale-95',
    borderClass: 'border-zinc-800',
    glowColor: 'rgba(113, 113, 122, 0.2)',
    nebulaColor: 'rgba(39, 39, 42, 0.3)',
    isLight: false
  }
];

export const INDUSTRY_PRESETS: Record<string, { name: string; icon: string; description: string; config: FormConfig }> = {
  saas: {
    name: 'SaaS & Web Applications',
    icon: '💻',
    description: 'Perfect for software platforms, dashboards, developer APIs, and mobile utility applications.',
    config: {
      themeId: 'midnight-void',
      brandName: 'DirectSync SaaS Engine',
      headerTitle: 'Let\'s supercharge our workspace.',
      headerSubtitle: 'We rely directly on your code reviews, performance logs, and feature requests. Tell us what to build next.',
      successTitle: 'Roadmap Entry Appended!',
      successDescription: 'Your feedback was logged in the roadmap Google Sheet. Our senior engineers review entries twice daily.',
      steps: [
        {
          id: 'step-experience',
          title: 'Product Experience',
          description: 'Help us calibrate our performance and interface quality scales.',
          fieldId: 'rating'
        },
        {
          id: 'step-feature',
          title: 'Classification',
          description: 'Categorize your suggestion so we can route it directly to the responsible team.',
          fieldId: 'category'
        },
        {
          id: 'step-review',
          title: 'Describe Improvement & Specs',
          description: 'Explain the details, and verify your development environment.',
          fieldId: 'message'
        },
        {
          id: 'step-device',
          title: 'Active Context Device',
          description: 'Which terminal was active during this occurrence?',
          fieldId: 'platform'
        },
        {
          id: 'step-loyalty',
          title: 'Recommend Level',
          description: 'Would you suggest us to other engineering teams?',
          fieldId: 'recommend'
        },
        {
          id: 'step-contact',
          title: 'Developer Verification',
          description: 'Claim your early contributor token badge by authenticating below.',
          fieldId: 'contact_info'
        }
      ],
      fields: {
        rating: {
          id: 'rating',
          title: 'System Experience Metric',
          required: true
        },
        category: {
          id: 'category',
          title: 'Engineering Categories',
          options: ['UI/UX Improvement', 'Bug', 'Feature Request', 'Compliment', 'Other'],
          required: true
        },
        message: {
          id: 'message',
          title: 'Engineering suggestions log',
          placeholder: 'Write key findings, errors, suggestions, or specs...',
          required: true
        },
        platform: {
          id: 'platform',
          title: 'Host Operating Machine',
          required: true
        },
        recommend: {
          id: 'recommend',
          title: 'Would you suggest us to others?',
          required: true
        },
        contact_info: {
          id: 'contact_info',
          title: 'Submitter Identity Sync',
          required: true
        }
      }
    }
  },
  ecommerce: {
    name: 'E-Commerce & Digital Retail',
    icon: '🛒',
    description: 'Customized for checkout review, item quality reviews, shipping status, and shopper satisfaction.',
    config: {
      themeId: 'sunset-amber',
      brandName: 'Veridian Goods Checkout',
      headerTitle: 'Rate your shopping experience.',
      headerSubtitle: 'From visual checkout ease to delivery speed, help us refine our retail store service.',
      successTitle: 'Shopper Coupon Activated!',
      successDescription: 'Review saved! A 15% VIP discount coupon has been routed to your registered shopper email.',
      steps: [
        {
          id: 'step-satisfaction',
          title: 'Checkout Happiness',
          description: 'How would you grade your visual checkout and item discovery experience?',
          fieldId: 'rating'
        },
        {
          id: 'step-shopping_mode',
          title: 'Retail Channel',
          description: 'Where did you source and complete this transaction?',
          fieldId: 'platform'
        },
        {
          id: 'step-remarks',
          title: 'Shopper Remarks',
          description: 'Share details about items, delivery care, packaging quality, or sizes.',
          fieldId: 'message'
        },
        {
          id: 'step-loyalty',
          title: 'Recommend',
          description: 'Would you suggest Veridian Goods to close friends and family members?',
          fieldId: 'recommend'
        },
        {
          id: 'step-contact',
          title: 'Shopper Profile Registration',
          description: 'Complete below to fetch your promo discount code sheet.',
          fieldId: 'contact_info'
        }
      ],
      fields: {
        rating: {
          id: 'rating',
          title: 'Service & Discovery Score',
          required: true
        },
        category: {
          id: 'category',
          title: 'Retail Segment Suggestion',
          options: ['UI/UX Improvement', 'Bug', 'Feature Request', 'Compliment', 'Other'],
          required: false
        },
        message: {
          id: 'message',
          title: 'Products and delivery remarks',
          placeholder: 'Add details about packaging, shipping speed, product fit or items...',
          required: true
        },
        platform: {
          id: 'platform',
          title: 'Purchasing Terminal Type',
          required: true
        },
        recommend: {
          id: 'recommend',
          title: 'Would you refer us to friends?',
          required: true
        },
        contact_info: {
          id: 'contact_info',
          title: 'Registered Shopping Account',
          required: true
        }
      }
    }
  },
  hospitality: {
    name: 'Hospitality & Dining (Food)',
    icon: '🍕',
    description: 'Optimized for wait staff kindness, dynamic reservation feedback, and table recipe suggestions.',
    config: {
      themeId: 'forest-zen',
      brandName: 'The Cozy Basil Bistro',
      headerTitle: 'Taste & Service Journal',
      headerSubtitle: 'Every culinary creation is hand-made for your comfort. Please share your recipe critiques.',
      successTitle: 'Table Seat Reservation Upgraded!',
      successDescription: 'Feedback recorded inside the Bistro Google Sheet. Priority table seating unlocked for your next date!',
      steps: [
        {
          id: 'step-taste',
          title: 'Food Taste & Plate Joy',
          description: 'How did you enjoy our recipes, spices, and plate layouts today?',
          fieldId: 'rating'
        },
        {
          id: 'step-order_type',
          title: 'Dining Method',
          description: 'How did you order our kitchen selection on this session?',
          fieldId: 'platform'
        },
        {
          id: 'step-chef_notes',
          title: 'Letter to the Chef',
          description: 'Compliments to the waiters, table cleanliness notes, or ingredient requests.',
          fieldId: 'message'
        },
        {
          id: 'step-loyalty',
          title: 'Recommend Bistro',
          description: 'Are you planning to host family tables or recommend our cozy bistro?',
          fieldId: 'recommend'
        },
        {
          id: 'step-membership',
          title: 'Table Reservations Registry',
          description: 'Receive VIP event invitation notices directly.',
          fieldId: 'contact_info'
        }
      ],
      fields: {
        rating: {
          id: 'rating',
          title: 'Flavor & Dining Rating',
          required: true
        },
        category: {
          id: 'category',
          title: 'Service Category',
          options: ['UI/UX Improvement', 'Bug', 'Feature Request', 'Compliment', 'Other'],
          required: false
        },
        message: {
          id: 'message',
          title: 'Culinary notes & dining observations',
          placeholder: 'Tell us how our table staff did, recipe suggestions, or comfort level...',
          required: true
        },
        platform: {
          id: 'platform',
          title: 'Meal Delivery Medium',
          required: true
        },
        recommend: {
          id: 'recommend',
          title: 'Planning to host buddies here?',
          required: true
        },
        contact_info: {
          id: 'contact_info',
          title: 'Guest Loyalty Information',
          required: true
        }
      }
    }
  },
  education: {
    name: 'Online Academy & Education',
    icon: '🎓',
    description: 'Perfect for student class reviews, mentor satisfaction, lesson quality, and course design ideas.',
    config: {
      themeId: 'bubblegum-sky',
      brandName: 'Beacon Online University',
      headerTitle: 'Course Discovery Evaluation',
      headerSubtitle: 'Help us hone academic lectures and course timelines. Your response guides our future terms.',
      successTitle: 'Study Credit Earned!',
      successDescription: 'Feedback securely synchronized. 10 Academic Resource credits added to your course account file.',
      steps: [
        {
          id: 'step-clarity',
          title: 'Lecture Content Clarity',
          description: 'How do you rate the learning difficulty and pedagogical clarity of the course?',
          fieldId: 'rating'
        },
        {
          id: 'step-study_mode',
          title: 'Student Client Model',
          description: 'Which computer medium do you use to stream classroom lectures?',
          fieldId: 'platform'
        },
        {
          id: 'step-syllabus_feed',
          title: 'Curriculum & Video Remarks',
          description: 'What syllabus topics did you learn best? Any mentoring suggestions?',
          fieldId: 'message'
        },
        {
          id: 'step-recurring',
          title: 'Re-enroll Intent',
          description: 'Are you aiming to continue with core certificates with Beacon Online?',
          fieldId: 'recommend'
        },
        {
          id: 'step-credentials',
          title: 'Student Core Credentials',
          description: 'Enter credentials below for instant study credit attachment.',
          fieldId: 'contact_info'
        }
      ],
      fields: {
        rating: {
          id: 'rating',
          title: 'Academic material rating',
          required: true
        },
        category: {
          id: 'category',
          title: 'E-Learning Category',
          options: ['UI/UX Improvement', 'Bug', 'Feature Request', 'Compliment', 'Other'],
          required: false
        },
        message: {
          id: 'message',
          title: 'Lecture experience suggestions',
          placeholder: 'Share your thoughts on lecture videos, course speed, and topics...',
          required: true
        },
        platform: {
          id: 'platform',
          title: 'Academic Device Terminal',
          required: true
        },
        recommend: {
          id: 'recommend',
          title: 'Would you recommend Beacon Academy?',
          required: true
        },
        contact_info: {
          id: 'contact_info',
          title: 'Academic Student profile ID',
          required: true
        }
      }
    }
  },
  healthcare: {
    name: 'Medical & Clinic Care',
    icon: '🏥',
    description: 'Tailored for physician attention, wait comfort, facility hygiene, and check-in speeds.',
    config: {
      themeId: 'slate-minimal',
      brandName: 'Pacific Wellness Clinic',
      headerTitle: 'Patient Wellness Journal',
      headerSubtitle: 'We strive to maximize check-in comfort and medical accuracy. Please share your diagnostic journey.',
      successTitle: 'Electronic Health Entry Saved',
      successDescription: 'Evaluation submitted. Pacific Care executives read every file to continuous improvement audits.',
      steps: [
        {
          id: 'step-practitioner',
          title: 'Clinician Communication',
          description: 'To what degree did core medical staff communicate with transparency and kindness?',
          fieldId: 'rating'
        },
        {
          id: 'step-logistics',
          title: 'Appointment Booking Ease',
          description: 'What interface mechanism was utilized to secure this health session?',
          fieldId: 'platform'
        },
        {
          id: 'step-care_log',
          title: 'Wellness Facility Review',
          description: 'Share your assessment of wait comfort, medical sanitation, and check-in speed.',
          fieldId: 'message'
        },
        {
          id: 'step-loyalty',
          title: 'Refer Clinic',
          description: 'Would you trust Pacific Wellness with the health of direct family members?',
          fieldId: 'recommend'
        },
        {
          id: 'step-identity',
          title: 'Patient Portal Link',
          description: 'Log in securely or provide a secure email to trace your health record file.',
          fieldId: 'contact_info'
        }
      ],
      fields: {
        rating: {
          id: 'rating',
          title: 'Patient Experience Merit',
          required: true
        },
        category: {
          id: 'category',
          title: 'Hospital Core Department',
          options: ['UI/UX Improvement', 'Bug', 'Feature Request', 'Compliment', 'Other'],
          required: false
        },
        message: {
          id: 'message',
          title: 'Consultation and Care log',
          placeholder: 'Add insights regarding medical personnel, clinic hygiene, wait times...',
          required: true
        },
        platform: {
          id: 'platform',
          title: 'Appointment Scheduler Channel',
          required: true
        },
        recommend: {
          id: 'recommend',
          title: 'Would you suggest Pacific Clinic to family?',
          required: true
        },
        contact_info: {
          id: 'contact_info',
          title: 'Secure Patient Account',
          required: true
        }
      }
    }
  }
};

export const DEFAULT_FORM_CONFIG: FormConfig = {
  themeId: 'midnight-void',
  brandName: 'Gemini Direct Link',
  headerTitle: 'Give us your take.',
  headerSubtitle: 'Help us build the next generation of generative features. Your suggestions are securely recorded in real time.',
  successTitle: 'Feedback Recorded Directly!',
  successDescription: 'Your response was appended in real-time to the secure Google Sheets feedback database.',
  steps: [
    {
      id: 'step-1',
      title: 'Satisfying Rating',
      description: 'Help us calibrate our overall experience and polish rating scores.',
      fieldId: 'rating'
    },
    {
      id: 'step-2',
      title: 'Category',
      description: 'Categorize your suggestions so we can route details to correct design pods.',
      fieldId: 'category'
    },
    {
      id: 'step-3',
      title: 'Experience Details',
      description: 'Explain what went well or what features need improvement.',
      fieldId: 'message'
    },
    {
      id: 'step-4',
      title: 'Active Platform',
      description: 'On what machine layout was this suggest formulated?',
      fieldId: 'platform'
    },
    {
      id: 'step-5',
      title: 'Advocacy Value',
      description: 'Would you suggest our application features to others?',
      fieldId: 'recommend'
    },
    {
      id: 'step-6',
      title: 'Contact Information',
      description: 'Sign your feedback dynamically with Google Auth or input parameters.',
      fieldId: 'contact_info'
    }
  ],
  fields: {
    rating: {
      id: 'rating',
      title: 'Satisfaction Rating',
      required: true
    },
    category: {
      id: 'category',
      title: 'Feedback Type Category',
      options: ['UI/UX Improvement', 'Bug', 'Feature Request', 'Compliment', 'Other'],
      required: true
    },
    message: {
      id: 'message',
      title: 'Write Experience message',
      placeholder: 'What\'s on your mind? What went well or what could be improved?',
      required: true
    },
    platform: {
      id: 'platform',
      title: 'What device type was active?',
      required: true
    },
    recommend: {
      id: 'recommend',
      title: 'Would you recommend this app?',
      required: true
    },
    contact_info: {
      id: 'contact_info',
      title: 'Identify Submitting Account',
      required: true
    }
  }
};
