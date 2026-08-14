export interface AdvertisingSolution {
  id: string;
  slug: string;
  number: string;
  title: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  alt: string;
  heroBgImage?: string;
  specs: {
    label: string;
    value: string;
  }[];
  keyBenefits: string[];
  idealFor: string[];
  dimensions: string;
  illumination: string;
  bgGradient: string;
  badgeTags: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  formatSlug: string;
  image: string;
  alt: string;
  location: string;
  aspectRatio: 'square' | 'portrait' | 'wide' | 'tall';
}

export const ADVERTISING_SOLUTIONS: AdvertisingSolution[] = [
  {
    id: 'digital-led',
    slug: 'digital-led-billboards',
    number: '01',
    title: 'Digital LED Billboards',
    tagline: 'ULTRA-HD DYNAMIC SCREENS',
    shortDescription:
      'Showcase how dynamic LED displays capture attention with bright, high-resolution content that can be updated in real time across high-density corridors.',
    fullDescription:
      'U Channel’s Ultra-HD Digital LED Billboards provide dynamic, high-impact visibility across premier metropolitan traffic corridors. Equipped with high-refresh rate LED modules and automated day/night brightness adjustment, your brand delivers vivid motion graphics and real-time messaging that impossible to ignore.',
    image: '/assets/solutions_digital_led.png',
    alt: 'High-tech 3D ultra-HD curved digital LED billboard display in Manila at dusk',
    heroBgImage: '/assets/solutions_digital_led.png',
    specs: [
      { label: 'Resolution', value: '4K Ultra-HD P8/P10' },
      { label: 'Daily Traffic', value: '380,000+ Vehicles' },
      { label: 'Scheduling', value: 'Real-Time Programmatic' },
      { label: 'Illumination', value: '24/7 Auto-Dimming Smart LED' },
    ],
    keyBenefits: [
      'Real-time content dynamic updates & dayparting options',
      'High-brightness modules visible under direct sunlight',
      'Multi-creative rotation for flexible campaign messaging',
      'Audience analytics and vehicle impression tracking'
    ],
    idealFor: [
      'Product Launches',
      'Automotive & Tech Brands',
      'E-Commerce & Retail Sales Events',
      'Financial & Corporate Awareness'
    ],
    dimensions: '60ft x 40ft (Custom sizes available)',
    illumination: 'High-Density SMD LED Technology',
    bgGradient: 'transparent',
    badgeTags: ['4K Ultra-HD', 'Programmatic', 'High Impact']
  },
  {
    id: 'static-billboards',
    slug: 'static-billboards',
    number: '02',
    title: 'Static Billboards',
    tagline: 'HIGH-IMPACT HIGHWAY PRESENCE',
    shortDescription:
      'Large-format static displays positioned along major transit arteries, delivering continuous, unmissable brand authority day and night.',
    fullDescription:
      'Our massive static billboard structures command undivided attention along EDSA, Roxas Boulevard, and key provincial expressways. Built with heavy-duty weather-resistant vinyl substrate and high-lumen LED floodlighting, static billboards deliver 100% share of voice 24 hours a day.',
    image: '/assets/solutions_static_billboard.png',
    alt: 'Massive luxury static billboard display on modern highway overpass at golden hour',
    heroBgImage: '/assets/solutions_static_billboard.png',
    specs: [
      { label: 'Share of Voice', value: '100% Exclusive Ownership' },
      { label: 'Visibility Range', value: 'Up to 1.5 Kilometers' },
      { label: 'Substrate', value: 'UV-Protected Frontlit Vinyl' },
      { label: 'Lighting', value: 'High-Efficiency LED Floodlights' }
    ],
    keyBenefits: [
      'Uninterrupted 24/7 brand domination without ad sharing',
      'Maximum brand recall among daily highway commuters',
      'Long-term strategic positioning in premium commercial hubs',
      'High structural integrity certified for typhoons and high winds'
    ],
    idealFor: [
      'Top-of-Mind Brand Awareness',
      'Real Estate Developments',
      'Consumer Packaged Goods (CPG)',
      'Telecom & Insurance Leaders'
    ],
    dimensions: '80ft x 50ft (Standard Super-Format)',
    illumination: 'Industrial High-Lumen LED Spotlight Grid',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
    badgeTags: ['100% Share of Voice', 'Highway Arteries', '24/7 Visibility']
  },
  {
    id: 'transit-advertising',
    slug: 'transit-advertising',
    number: '03',
    title: 'Transit Advertising',
    tagline: 'MOBILE AUDIENCE ENGAGEMENT',
    shortDescription:
      'Full-vehicle wraps and high-definition digital screens synced across high-frequency transport routes to move your message everywhere commuters travel.',
    fullDescription:
      'Transform public and commercial transport fleets into moving canvases that infiltrate high-density urban zones. From premium bus wraps along major avenues to interior HD screen networks, transit advertising drives repetitive impressions across diverse demographics.',
    image: '/assets/solutions_transit.png',
    alt: 'Sleek electric transit bus fully wrapped in luxury brand campaign',
    heroBgImage: '/assets/solutions_transit.png',
    specs: [
      { label: 'Fleet Options', value: 'Busses, Shuttles, Light Rail' },
      { label: 'Coverage Area', value: 'Metro Manila & Key Regional Routes' },
      { label: 'Impression Rate', value: '250,000+ Daily Views per Route' },
      { label: 'Material', value: '3M Cast Perforated Window & Body Wrap' }
    ],
    keyBenefits: [
      'Extensive geographic coverage reaching places fixed billboards cannot',
      'High engagement during commuter dwell times in traffic',
      'Eye-level pedestrian and passenger viewability',
      'Integrated GPS fleet tracking and campaign execution reports'
    ],
    idealFor: [
      'Mass Market Consumer Campaigns',
      'Entertainment & Streaming Releases',
      'Food & Beverage Chains',
      'Fintech & Digital Banking Services'
    ],
    dimensions: 'Full Vehicle Exterior Wrap + Side Panels',
    illumination: 'Reflective Graphic Elements + Interior Screens',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
    badgeTags: ['Mobile Reach', 'Fleet Wraps', 'Urban Infiltration']
  },
  {
    id: 'building-wraps',
    slug: 'building-wraps',
    number: '04',
    title: 'Building Wraps',
    tagline: 'SKYLINE-DOMINATING CANVASES',
    shortDescription:
      'Mega-scale building facade graphics that transform landmark urban architecture into colossal, unmissable brand spectacles visible across entire cities.',
    fullDescription:
      'Building Wraps represent the pinnacle of architectural out-of-home advertising. Covering hundreds of square meters of glass and concrete on high-profile skyscrapers, these spectacular installations turn iconic structures into unforgettable monuments for your brand.',
    image: '/assets/solutions_building_wrap.png',
    alt: 'Colossal full-facade building wrap advertisement on a skyscraper at sunset',
    heroBgImage: '/assets/solutions_building_wrap.png',
    specs: [
      { label: 'Scale', value: 'Multi-Story Facade (up to 300ft tall)' },
      { label: 'Substrate', value: 'Micro-Perforated One-Way Vision Mesh' },
      { label: 'Illumination', value: 'Architectural Dynamic Exterior Uplighting' },
      { label: 'Impact', value: 'Iconic Skyline Dominance' }
    ],
    keyBenefits: [
      'Unmatched prestige and skyline dominance',
      'Massive viral social media potential and PR coverage',
      'Breathable architectural mesh allows light inside building windows',
      'Visible from miles away including vantage points and overhead highways'
    ],
    idealFor: [
      'Flagship Global Launches',
      'Luxury & Fashion Houses',
      'Blockbuster Movie Premieres',
      'Major Corporate Milestones'
    ],
    dimensions: 'Up to 30,000 Sq Ft Surface Area',
    illumination: 'Architectural Grade Dynamic Flood Lighting',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
    badgeTags: ['Architectural Scale', 'Skyline Landmark', 'PR Magnet']
  },
  {
    id: 'pole-banners',
    slug: 'pole-banners',
    number: '05',
    title: 'Pole Banners',
    tagline: 'SEQUENTIAL STREET CANOPIES',
    shortDescription:
      'High-density double-sided street-level banner placements lining premier shopping and financial avenues to reinforce brand identity through high repetition.',
    fullDescription:
      'Linings of double-sided street pole banners create an immersive red-carpet canopy for pedestrians and slow-moving traffic. Strategically installed along financial avenues, luxury shopping streets, and festival routes, pole banners provide repetitive frequency that cements campaign messaging.',
    image: '/assets/solutions_pole_banner.png',
    alt: 'Row of elegant double-sided street pole banners on sunlit boulevard',
    heroBgImage: '/assets/solutions_pole_banner.png',
    specs: [
      { label: 'Placement', value: 'Boulevards, Commercial Avenues, Plazas' },
      { label: 'Format', value: 'Double-Sided Heavy Duty Canvas' },
      { label: 'Spacing', value: 'Sequential 15-meter Staggering' },
      { label: 'Height', value: 'Eye-level 12-16ft Above Street Level' }
    ],
    keyBenefits: [
      'Dense sequential repetition reinforces top-of-mind memory',
      'Targeted local pedestrian and vehicular engagement',
      'Elegantly integrates with urban avenue infrastructure',
      'Rapid deployment for time-sensitive promotions and events'
    ],
    idealFor: [
      'Retail Corridor Takeovers',
      'Concerts & Cultural Festivals',
      'Local Store Grand Openings',
      'Municipal & Tourism Campaigns'
    ],
    dimensions: '3ft x 8ft Double-Sided Set',
    illumination: 'Streetlight Ambient + Dedicated LED Arms',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
    badgeTags: ['Sequential', 'Street Level', 'Pedestrian Reach']
  },
  {
    id: 'mall-advertising',
    slug: 'mall-advertising',
    number: '06',
    title: 'Mall Advertising',
    tagline: 'HIGH-INTENT POINT OF PURCHASE',
    shortDescription:
      'Engage shoppers at the exact moment of purchase with sleek atrium screens, digital kiosks, and escalators in premier shopping destinations.',
    fullDescription:
      'Capitalize on high shopper foot traffic and purchasing mindset. U Channel’s Mall Advertising network spans atrium high-definition screens, interactive digital pillars, elevator wraps, and entrance archways across top lifestyle centers nationwide.',
    image: '/assets/solutions_mall_advertising.png',
    alt: 'Ultra luxury high-tech digital screen advertisement inside a high-end mall in Manila',
    heroBgImage: '/assets/solutions_mall_advertising.png',
    specs: [
      { label: 'Foot Traffic', value: '500,000+ Weekend Visitors' },
      { label: 'Screen Tech', value: 'Fine-Pitch Ultra HD Indoor LED' },
      { label: 'Interactivity', value: 'QR Integration & Motion Touch' },
      { label: 'Placement', value: 'Central Atriums & Food Halls' }
    ],
    keyBenefits: [
      'Direct influence on consumers at the point of sale',
      'Environmentally controlled, high-dwell viewing conditions',
      'Targeted demographic reach (families, youth, luxury buyers)',
      'High-resolution indoor displays with vivid color fidelity'
    ],
    idealFor: [
      'Retail & Fashion Retailers',
      'Dining & Quick Service Restaurants',
      'Consumer Electronics & Mobile Devices',
      'Beauty & Cosmetics Brands'
    ],
    dimensions: 'Various (3D Atrium Curved Screens & Kiosks)',
    illumination: 'Ambient Mall Lighting + Ultra-HD LED Backlight',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
    badgeTags: ['Point of Purchase', 'Indoor Ultra-HD', 'High Shopper Intent']
  },
  {
    id: 'custom-solutions',
    slug: 'custom-advertising',
    number: '07',
    title: 'Custom Advertising Solutions',
    tagline: '3D ANAMORPHIC & EXPERIENTIAL ACTIVATIONS',
    shortDescription:
      'Bespoke 3D anamorphic displays, interactive sensory installations, and custom OOH activations engineered to create viral moments and lasting impact.',
    fullDescription:
      'Push the boundaries of conventional media with U Channel’s Custom Engineering team. From corner-curved 3D optical illusion screens that make characters jump out of the wall to interactive projection mapping and kinetic installations, we turn audacious concepts into reality.',
    image: '/assets/solutions_custom_ooh.png',
    alt: 'Mind-bending 3D anamorphic corner LED screen display popping out of structure at night',
    heroBgImage: '/assets/solutions_custom_ooh.png',
    specs: [
      { label: 'Technology', value: '3D Anamorphic LED + Projection Mapping' },
      { label: 'Engineering', value: 'Custom Steel Fabrication & Optics' },
      { label: 'Engagement', value: 'Sensory Motion & QR Interactivity' },
      { label: 'Viral Reach', value: 'Multi-Million Social Media Views' }
    ],
    keyBenefits: [
      'Creates viral social media earned media value',
      'Transforms campaigns into immersive cultural events',
      'Custom fabrication built to your precise creative vision',
      'Integrated sensors and real-time interaction capabilities'
    ],
    idealFor: [
      'Global Product Reveal Events',
      'Gaming & Entertainment Franchises',
      'Disruptive Innovation Campaigns',
      'High-Impact PR & Brand Stunts'
    ],
    dimensions: 'Custom Engineered Specifications',
    illumination: 'Sync Light Systems + Anamorphic 3D LED',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
    badgeTags: ['3D Anamorphic', 'Bespoke Fabrication', 'Viral Impact']
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'EDSA Ortigas Landmark 3D LED',
    category: 'LED Displays',
    formatSlug: 'digital-led-billboards',
    image: '/assets/solutions_digital_led.png',
    alt: 'High-tech 3D ultra-HD curved digital LED billboard display in Manila at dusk',
    location: 'EDSA Junction, Metro Manila',
    aspectRatio: 'wide'
  },
  {
    id: 'gal-2',
    title: 'Roxas Boulevard Super-Format Static',
    category: 'Billboards',
    formatSlug: 'static-billboards',
    image: '/assets/solutions_static_billboard.png',
    alt: 'Massive luxury static billboard display on modern highway overpass at golden hour',
    location: 'Roxas Boulevard Bayfront',
    aspectRatio: 'portrait'
  },
  {
    id: 'gal-3',
    title: 'Metro Rapid Bus Full Fleet Wrap',
    category: 'Transit Ads',
    formatSlug: 'transit-advertising',
    image: '/assets/solutions_transit.png',
    alt: 'Sleek electric transit bus fully wrapped in luxury brand campaign',
    location: 'Ayala Ave - BGC Route',
    aspectRatio: 'wide'
  },
  {
    id: 'gal-4',
    title: 'High Street Skyscraper Mega Facade Wrap',
    category: 'Building Wraps',
    formatSlug: 'building-wraps',
    image: '/assets/solutions_building_wrap.png',
    alt: 'Colossal full-facade building wrap advertisement on a skyscraper at sunset',
    location: 'Bonifacio Global City',
    aspectRatio: 'tall'
  },
  {
    id: 'gal-5',
    title: 'Financial District Double-Sided Banners',
    category: 'Billboards',
    formatSlug: 'pole-banners',
    image: '/assets/solutions_pole_banner.png',
    alt: 'Row of elegant double-sided street pole banners on sunlit boulevard',
    location: 'Makati Avenue Canopy',
    aspectRatio: 'square'
  },
  {
    id: 'gal-6',
    title: 'Luxury Mall Atrium 3D Curved Screen',
    category: 'LED Displays',
    formatSlug: 'mall-advertising',
    image: '/assets/solutions_mall_advertising.png',
    alt: 'Ultra luxury high-tech digital screen advertisement inside a high-end shopping mall',
    location: 'Shangri-La Plaza, Manila',
    aspectRatio: 'square'
  },
  {
    id: 'gal-7',
    title: '3D Anamorphic Corner Illusion Installation',
    category: 'Campaign Installations',
    formatSlug: 'custom-advertising',
    image: '/assets/solutions_custom_ooh.png',
    alt: 'Mind-bending 3D anamorphic corner LED screen display popping out of structure',
    location: 'BGC High Street Corner',
    aspectRatio: 'wide'
  },
  {
    id: 'gal-8',
    title: 'Guadalupe EDSA Prime Highway Facing Screen',
    category: 'LED Displays',
    formatSlug: 'digital-led-billboards',
    image: '/assets/guadalupe.webp',
    alt: 'High-impact EDSA Guadalupe billboard display',
    location: 'EDSA Guadalupe Bridge',
    aspectRatio: 'tall'
  },
  {
    id: 'gal-9',
    title: 'Clark Freeport Zone Highway Billboard',
    category: 'Billboards',
    formatSlug: 'static-billboards',
    image: '/assets/clark.webp',
    alt: 'Clark Freeport highway static billboard display',
    location: 'Subic-Clark Expressway',
    aspectRatio: 'portrait'
  },
  {
    id: 'gal-10',
    title: 'Davao Prime Commercial District Display',
    category: 'Campaign Installations',
    formatSlug: 'custom-advertising',
    image: '/assets/davao.webp',
    alt: 'Davao city commercial district billboard installation',
    location: 'J.P. Laurel Avenue, Davao City',
    aspectRatio: 'square'
  }
];

export interface WhyChooseFeature {
  id: string;
  number: string;
  bgColor: string;
  fallbackColor: string;
  image: string;
  title: string;
  description: string;
}

export const WHY_CHOOSE_FEATURES: WhyChooseFeature[] = [
  {
    id: 'feat-1',
    number: '01',
    bgColor: '#30579C',
    fallbackColor: '#ffffff',
    image: 'https://images.unsplash.com/photo-1541356665065-22676f35dd40?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&q=75',
    title: 'Tailored LED Solutions',
    description: 'Custom ultra-HD displays, 3D anamorphic screens, and flexible specs engineered for your brand.'
  },
  {
    id: 'feat-2',
    number: '02',
    bgColor: '#10213D',
    fallbackColor: '#ffffff',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&q=75',
    title: 'Customer-First Service',
    description: 'Dedicated account management, responsive technical support, and seamless communication at every stage.'
  },
  {
    id: 'feat-3',
    number: '03',
    bgColor: '#FB9B51',
    fallbackColor: '#ffffff',
    image: 'https://images.unsplash.com/photo-1550684848-86a5d8727436?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&q=75',
    title: 'End-to-End Expertise',
    description: 'Full turnkey execution from site survey and design to engineering, installation, and maintenance.'
  },
  {
    id: 'feat-4',
    number: '04',
    bgColor: '#6C97D3',
    fallbackColor: '#ffffff',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&q=75',
    title: 'Trusted Industry Experience',
    description: 'Years of proven excellence delivering high-impact out-of-home advertising campaigns nationwide.'
  }
];


