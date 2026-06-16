// shop-data.jsx — products, categories, trust signals (shared across variations)

const PRODUCTS = [
  {
    id: 'hush-01',
    code: '23108133021',
    colours: ["nude","black"],
    brand: 'Satisfyer',
    stock: 'in',
    image: 'products/hush-01.png',
    name: 'Satisfyer Pro 2',
    ptype: 'Gaisa plūsmas klitora stimulators',
    tagline: 'Ikdienas favorīts ar maigu, bezkontakta stimulāciju.',
    price: 69,
    category: 'solo',
    badge: 'Bestseller',
    blob: 'M62,12 C84,12 96,30 96,52 C96,78 78,92 56,92 C30,92 14,76 14,54 C14,28 36,12 62,12 Z',
    swatches: ['#E2BFA8', '#3A3633', '#C6896F'],
    colourNames: ['Smilšu','Melns','Karamele'], sizes: ['9 cm'],
    material: 'Medical-grade silicone',
    waterproof: true,
    rechargeable: true,
    modes: 8,
    decibels: 32,
    weight: '94 g',
    stock: 7, length: '9 cm', rating: 4.7, reviewCount: 111,
    desc: 'Hush 01 is our most-loved everyday piece — a smooth, palm-sized pebble designed to disappear into a bedside drawer and reappear on slow evenings. Moulded from a single piece of medical-grade silicone, it is non-porous, hypoallergenic and warms quickly to the touch. Eight rhythms run from a barely-there hum to a deep, steady pulse, all controlled with a single intuitive button so you never have to look. The motor is genuinely whisper-quiet at around 32 dB — fine for thin apartment walls and shared homes. Fully waterproof to IPX7, it is happy in the bath or shower and rinses clean in seconds. A single USB-C charge lasts roughly two weeks of regular use. Ships in a plain box with a soft storage pouch, charging cable and a one-page guide. Best paired with a water-based lubricant; avoid silicone-based formulas, which degrade silicone over time.'
  },
  {
    id: 'ripple',
    code: '23108133045',
    colours: ["pink"],
    brand: 'Satisfyer',
    stock: 'in',
    name: 'Satisfyer Wand-er Woman',
    ptype: 'Masāžas nūja-vibrators',
    tagline: 'Jaudīga masāžas nūja ar elastīgu galviņu.',
    price: 129,
    category: 'solo',
    badge: 'New',
    blob: 'M50,8 C66,8 72,22 72,46 C72,76 66,104 50,104 C34,104 28,76 28,46 C28,22 34,8 50,8 Z',
    swatches: ['#7E2E2E', '#2B2520', '#D7B89A'],
    colourNames: ['Sarkans','Melns','Smilšu'], sizes: ['18 cm','21 cm','24 cm'],
    material: 'Soft-touch silicone',
    waterproof: true,
    rechargeable: true,
    modes: 12,
    decibels: 38,
    weight: '186 g',
    stock: 3, length: '21 cm', rating: 4.7, reviewCount: 59,
    desc: 'Ripple reimagines the classic wand in a slimmer, friendlier form. Its elongated, gently articulated head flexes to follow the body rather than press against it, delivering broad, resonant stimulation that feels far stronger than the soft silhouette suggests. Twelve modes step smoothly from a light flutter to deep waves, and a dedicated mode button lets you move through them one-handed. The soft-touch silicone shell is body-safe, non-porous and easy to clean, while the rechargeable motor stays composed at around 38 dB. Waterproof to IPX7 for use in the bath, it charges over USB-C and holds a charge through a week of regular sessions. At 186 g it has reassuring heft without being tiring to hold. Arrives in unmarked packaging with a pouch, cable and quick-start card. Use generously with a water-based lubricant for the smoothest glide, and store dry in the pouch provided.'
  },
  {
    id: 'velvet',
    code: '23108133067',
    colours: ["nude","black"],
    brand: 'We-Vibe',
    stock: 'in',
    name: 'We-Vibe Sync 2',
    ptype: 'Pāru vibrators ar lietotni',
    tagline: 'Valkājams pāru vibrators ar attālinātu vadību.',
    price: 89,
    oldPrice: 119,
    clearance: true,
    category: 'couples',
    blob: 'M20,40 C20,18 44,8 60,18 C76,8 96,22 92,46 C88,72 64,82 56,82 C48,82 12,72 20,40 Z',
    swatches: ['#D2A18A', '#4A3A33', '#EFE1CF'],
    colourNames: ['Persiku','Brūns','Krēms'], sizes: ['12 cm'],
    material: 'Body-safe silicone',
    waterproof: true,
    rechargeable: true,
    modes: 10,
    decibels: 34,
    weight: '120 g',
    stock: 12, length: '12 cm', rating: 4.7, reviewCount: 176,
    desc: 'Velvet is built for two. Two independent stimulation zones share a single wireless remote, so one partner can take the controls while the other simply enjoys — or you can pass it back and forth. The remote reaches up to eight metres, opening the door to playful, unhurried evenings. Ten modes cover everything from a teasing pulse to a steady, building rhythm. The whole piece is wrapped in body-safe silicone that is non-porous, hypoallergenic and quick to warm, and the motor runs quietly at around 34 dB. Waterproof to IPX7 and rechargeable over USB-C, Velvet holds a charge through a full week of regular use. At 120 g it sits comfortably without slipping. Ships in a plain box with a soft pouch, charging cable and a short guide. Water-based lubricant only, please — silicone-based formulas will damage the silicone surface over time.'
  },
  {
    id: 'echo',
    code: '23108133089',
    colours: ["nude"],
    brand: 'Womanizer',
    stock: 'in',
    name: 'Womanizer Starlet 3',
    ptype: 'Klitora stimulators iesācējiem',
    tagline: 'Maigs sākums — viena poga, kluss motors.',
    price: 49,
    category: 'beginners',
    badge: 'Starter',
    isNew: true,
    blob: 'M50,10 C72,10 88,28 88,52 C88,72 72,90 50,90 C28,90 12,72 12,52 C12,28 28,10 50,10 Z',
    swatches: ['#EAC4AA', '#3A3633', '#F0E3D2'],
    colourNames: ['Smilšu','Melns','Krēms'], sizes: ['11 cm'],
    material: 'Soft silicone',
    waterproof: true,
    rechargeable: true,
    modes: 5,
    decibels: 28,
    weight: '64 g',
    stock: 9, length: '11 cm', rating: 4.7, reviewCount: 137,
    desc: 'Echo is the gentlest place to start. Designed for first-timers, it keeps things calm and uncomplicated: five soft rhythms, one button, and nothing intimidating about it. The compact silicone body is medical-grade, non-porous and hypoallergenic, with a soft matte finish that warms quickly and cleans in seconds. At just 28 dB it is one of the quietest pieces we make — genuinely discreet in a shared home or a thin-walled flat. A single USB-C charge lasts around a week of regular use, and the whole thing is waterproof to IPX7 so it is welcome in the bath. Light in the hand at 64 g, it is easy to hold at any angle and never tiring. Ships in an unmarked box with a storage pouch, charging cable and a plain-language guide. Take your time, start on the lowest setting, and reach for a water-based lubricant.'
  },
  {
    id: 'glow',
    code: '23108133102',
    colours: ["purple","black"],
    brand: 'LELO',
    stock: 'in',
    image: 'products/glow.png',
    name: 'LELO Gigi 3',
    ptype: 'G-punkta vibrators (premium)',
    tagline: 'Luksusa izliekums ar sildošu galviņu un lietotnes vadību.',
    price: 189,
    oldPrice: 229,
    category: 'premium',
    blob: 'M30,20 C50,4 88,12 88,40 C88,72 64,96 44,92 C24,88 8,64 14,44 C18,30 22,26 30,20 Z',
    swatches: ['#3A3633', '#C8B6A0', '#E2BFA8'],
    colourNames: ['Melns','Pelēks','Smilšu'], sizes: ['18 cm','20 cm'],
    material: 'Aerospace-grade ABS + silicone',
    waterproof: true,
    rechargeable: true,
    modes: 16,
    decibels: 30,
    weight: '210 g',
    stock: 2, length: '20 cm', rating: 4.7, reviewCount: 46,
    desc: 'Glow is our flagship and the most advanced piece in the range. A warming tip rises to body temperature in about thirty seconds for a more natural feel, while sixteen built-in modes and full app control let you design and save your own rhythms over Bluetooth. The shell pairs aerospace-grade ABS with body-safe silicone for a premium, sculptural finish that looks as considered as it feels. The motor is powerful yet refined, holding around 30 dB even at higher intensities. A generous two-hour battery recharges over USB-C, and the whole piece is waterproof to IPX7. At 210 g it carries real presence in the hand. Backed by a lifetime warranty and shipped in a plain box with a pouch, cable, guide and app instructions. Clean with warm water and mild soap, store dry, and use a water-based lubricant — never silicone-based on a silicone surface.'
  },
  {
    id: 'murmur',
    code: '23108133124',
    colours: ["nude"],
    brand: 'Satisfyer',
    stock: 'low',
    name: 'Satisfyer Ultra Power Bullet',
    ptype: 'Kabatas mini-vibrators',
    tagline: 'Diskrēts kabatas izmērs, klusa darbība.',
    price: 39,
    category: 'solo',
    blob: 'M50,8 C60,8 66,18 66,42 C66,76 60,92 50,92 C40,92 34,76 34,42 C34,18 40,8 50,8 Z',
    swatches: ['#D2A18A', '#4A3A33', '#F5E9D7'],
    colourNames: ['Persiku','Brūns','Krēms'], sizes: ['8 cm'],
    material: 'Silicone-coated ABS',
    waterproof: true,
    rechargeable: false,
    modes: 5,
    decibels: 26,
    weight: '34 g',
    stock: 14, length: '8 cm', rating: 4.7, reviewCount: 202,
    desc: 'Murmur is the friendly little one — a pocket bullet barely larger than a lipstick, made for precise, point-able stimulation wherever you happen to be. Despite the size it offers five distinct modes through a single base button, and the silicone-coated tip is body-safe, non-porous and gentle on skin. Running at a remarkably low 26 dB, it is the most discreet piece we sell; nobody nearby will hear a thing. Rather than a rechargeable cell it takes a single AAA battery that lasts up to three months of regular use, which makes it ideal for travel when charging is awkward. Waterproof to IPX7, it rinses clean in moments. At only 34 g it slips into a coat pocket, a handbag or carry-on without a second thought. Ships in a plain box with a pouch and a battery included. Pair with a water-based lubricant and remove the battery for long-term storage.'
  },
  {
    id: 'drift',
    code: '23108133146',
    colours: ["brown","black"],
    brand: 'Lovense',
    stock: 'low',
    name: 'Lovense Ferri',
    ptype: 'Ceļojumu mini-vibrators ar lietotni',
    tagline: 'TSA-draudzīgs, ar slēdzamu ceļojumu kārbiņu.',
    price: 59,
    category: 'travel',
    blob: 'M40,16 C60,8 84,20 86,42 C88,66 70,84 50,86 C30,88 14,70 14,48 C14,30 22,22 40,16 Z',
    swatches: ['#A88572', '#2B2520', '#EFE1CF'],
    colourNames: ['Brūns','Melns','Krēms'], sizes: ['13 cm'],
    material: 'Silicone + matte ABS',
    waterproof: true,
    rechargeable: true,
    modes: 6,
    decibels: 30,
    weight: '78 g',
    stock: 4, length: '13 cm', rating: 4.7, reviewCount: 72,
    desc: 'Drift is built for the road. It arrives in a lockable, hard-sided travel case that keeps it private in luggage and prevents accidental activation — a dedicated travel lock disables the buttons until you wake it with a three-second hold. TSA-friendly in size and discreet in profile, it is made for hotel rooms and quiet returns home. The body combines matte ABS with body-safe silicone, non-porous and easy to wipe down, and six modes cover a satisfying range from soft to strong at a composed 30 dB. Waterproof to IPX7 and rechargeable over USB-C, it holds a charge across a week or more of use. At 78 g it is light enough to forget you packed it. Ships in a plain outer box with the travel case, charging cable and a short guide. Use a water-based lubricant, dry it fully before locking it away, and travel with the battery around half full.'
  },
  {
    id: 'halo',
    code: '23108133168',
    colours: ["pink","purple"],
    brand: 'We-Vibe',
    stock: 'in',
    image: 'products/halo.png',
    name: 'We-Vibe Pivot',
    ptype: 'Erekcijas gredzens ar vibrāciju',
    tagline: 'Mīksts izstiepjams gredzens stimulācijai abiem.',
    price: 34,
    category: 'couples',
    blob: 'M50,12 C76,12 88,30 88,50 C88,72 70,88 50,88 C30,88 12,72 12,50 C12,30 24,12 50,12 Z M50,32 C40,32 32,40 32,50 C32,60 40,68 50,68 C60,68 68,60 68,50 C68,40 60,32 50,32 Z',
    swatches: ['#7E2E2E', '#3A3633', '#D7B89A'],
    colourNames: ['Sarkans','Melns','Smilšu'], sizes: ['S','M','L'],
    material: 'Stretch silicone',
    waterproof: true,
    rechargeable: true,
    modes: 7,
    decibels: 32,
    weight: '22 g',
    stock: 6, length: '5 cm', rating: 4.7, reviewCount: 98,
    desc: 'Halo is a soft, stretchy couples ring that stays exactly where you put it. The body-safe stretch silicone flexes to fit comfortably and securely, while a small rechargeable motor adds shared stimulation for both partners through seven modes. One relaxed size suits most, and the supple material never feels tight or clinical. The motor is quiet at around 32 dB, and a quick one-hour USB-C charge is enough for several sessions. Waterproof to IPX7, Halo is easy to rinse clean and quick to dry. At just 22 g it is the lightest piece in the range and all but disappears in use. Ships in a plain box with a charging cable, storage pouch and a clear guide. Apply a water-based lubricant before wearing, clean before and after each use, and store it flat and dry in the pouch — never use silicone-based lubricant on the silicone surface.'
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All', count: PRODUCTS.length },
  { id: 'solo', label: 'Solo', count: PRODUCTS.filter(p => p.category === 'solo').length },
  { id: 'couples', label: 'Couples', count: PRODUCTS.filter(p => p.category === 'couples').length },
  { id: 'beginners', label: 'Beginners', count: PRODUCTS.filter(p => p.category === 'beginners').length },
  { id: 'premium', label: 'Premium', count: PRODUCTS.filter(p => p.category === 'premium').length },
  { id: 'travel', label: 'Travel', count: PRODUCTS.filter(p => p.category === 'travel').length },
];

const TRUST_SIGNALS = [
  { id: 'package', icon: 'box', title: 'Plain box', body: 'Unmarked outer carton. No logo, no product name, no hint.' },
  { id: 'billing', icon: 'card', title: 'Anonymous billing', body: 'Charge shows as "NL Trading Co" on your statement.' },
  { id: 'guest', icon: 'ghost', title: 'No account needed', body: 'Check out as a guest. We forget you the moment your box arrives.' },
  { id: 'ship', icon: 'truck', title: 'Next-day shipping', body: 'Order by 4pm. Ships from a city near you.' },
  { id: 'secure', icon: 'lock', title: 'Encrypted checkout', body: 'TLS 1.3 + tokenised cards. We never see your number.' },
  { id: 'material', icon: 'leaf', title: 'Body-safe materials', body: 'Medical-grade silicone. Phthalate-free. Lab tested every batch.' },
  { id: 'return', icon: 'arrow', title: 'Free returns', body: '30 days, no questions asked. We pay the return label.' },
];

// Discretion tone copy variants
const DISCRETION_COPY = {
  playful: {
    tagline: 'Quietly\u00a0loud. 🔥',
    sub: 'Pleasure that arrives in a plain box and leaves no trace on your bank statement. For every body, every orientation, every kind of "us." 💋',
    cta: 'Take me shopping 🛍️',
    confirmTitle: 'It\u2019s on its way. ✨',
    confirmSub: 'You\u2019ll get one email when it ships. Nothing else. Pinky promise. 💘',
  },
  clinical: {
    tagline: 'Sex shop, intīmpreču veikals.',
    sub: 'Body-safe products, plain packaging, anonymous billing. Inclusive by default. Shipping in 24 hours across Latvia.',
    cta: 'Meklēt',
    confirmTitle: 'Order received.',
    confirmSub: 'A single shipping confirmation will be sent. Your data is purged 30 days after delivery.',
  },
  warm: {
    tagline: 'Soft things, sent softly. 🌸',
    sub: 'A small shop for grown-ups of every kind. Plain packaging, a kind return policy, and a team that minds its own business. 💜',
    cta: 'Have a look 👀',
    confirmTitle: 'Thank you. 🌷',
    confirmSub: 'We\u2019ll let you know when it\u2019s on the way. After that, you won\u2019t hear from us \u2014 unless you want to. 💌',
  }
};

// ─────────────────────────────────────────────────────────────
// Free gift threshold
// ─────────────────────────────────────────────────────────────
const GIFT_THRESHOLD = 80;
const GIFT_PRODUCT = {
  id: 'gift',
  name: 'Whisper kit',
  tagline: 'Our gift to you',
  price: 0,
  retailPrice: 24,
  category: 'gift',
  badge: 'Free at €80',
  blob: 'M50,10 C72,10 90,28 90,52 C90,72 72,90 50,90 C28,90 10,72 10,52 C10,28 28,10 50,10 Z',
  swatches: ['#D4C5A9', '#3A3633', '#F2EDE6'],
  material: 'Silk pouch + sample',
  desc: 'A soft silk pouch, a 5ml water-based lubricant sample and a tiny thank-you card. Added automatically when your order reaches €80.',
};

// ─────────────────────────────────────────────────────────────
// "Goes well with" — complementary picks per product
// ─────────────────────────────────────────────────────────────
const PAIRS = {
  'hush-01': ['halo', 'echo', 'drift'],
  'ripple': ['glow', 'velvet'],
  'velvet': ['halo', 'ripple'],
  'echo': ['hush-01', 'murmur', 'halo'],
  'glow': ['ripple', 'velvet', 'drift'],
  'murmur': ['echo', 'drift', 'halo'],
  'drift': ['murmur', 'hush-01'],
  'halo': ['velvet', 'hush-01', 'echo'],
};

// ─────────────────────────────────────────────────────────────
// Couriers (Latvia)
// ─────────────────────────────────────────────────────────────
const COURIERS = [
  {
    id: 'omniva',
    name: 'Omniva',
    type: 'locker',
    sub: 'Parcel locker',
    eta: 'Tomorrow',
    price: 2.5,
    anonymous: true,
    note: 'Pick up with a code from any Omniva locker. Your name only appears on the locker screen.',
    locations: [
      { id: 'omn-riga-1', name: 'Origo, R\u012bga', address: 'Stacijas laukums 2, R\u012bga', distance: '0.4 km' },
      { id: 'omn-riga-2', name: 'Stockmann, R\u012bga', address: '13. janv\u0101ra iela 8, R\u012bga', distance: '0.9 km' },
      { id: 'omn-riga-3', name: 'Maxima XX Centra, R\u012bga', address: 'Audeju iela 16, R\u012bga', distance: '1.2 km' },
      { id: 'omn-jurmala', name: 'Maxima, J\u016brmala', address: 'D\u017ckstes iela 1, J\u016brmala', distance: '24 km' },
      { id: 'omn-jelgava', name: 'Pilsetas pasts, Jelgava', address: 'Pasta iela 47, Jelgava', distance: '42 km' },
    ],
  },
  {
    id: 'pasts',
    name: 'Latvijas Pasts',
    type: 'locker',
    sub: 'Pastomat locker',
    eta: '2 days',
    price: 1.99,
    anonymous: true,
    note: 'State postal lockers across Latvia. Code-based pickup.',
    locations: [
      { id: 'pas-riga-1', name: 'Galvenais pasts, R\u012bga', address: 'Stacijas laukums 1, R\u012bga', distance: '0.5 km' },
      { id: 'pas-mezaparks', name: 'Me\u017eaparks, R\u012bga', address: 'Kokneses prospekts 27, R\u012bga', distance: '5.1 km' },
      { id: 'pas-liepaja', name: 'Liep\u0101ja centr\u0101lais', address: 'Pasta iela 4, Liep\u0101ja', distance: '210 km' },
      { id: 'pas-daugavpils', name: 'Daugavpils, RIMI', address: 'C\u0113su iela 20, Daugavpils', distance: '220 km' },
    ],
  },
  {
    id: 'dpd',
    name: 'DPD',
    type: 'pickup',
    sub: 'Pickup point or door',
    eta: 'Tomorrow',
    price: 3.5,
    anonymous: true,
    note: 'DPD Pickup points or door delivery. SMS tracking, no product info disclosed.',
    locations: [
      { id: 'dpd-riga-1', name: 'Narvesen Vald.', address: 'Brivibas iela 68, R\u012bga', distance: '1.1 km' },
      { id: 'dpd-riga-2', name: 'Statoil Avoti', address: 'A. \u010caka iela 67, R\u012bga', distance: '1.6 km' },
      { id: 'dpd-cesis', name: 'Maxima X C\u0113sis', address: 'Vald. M\u0101zera iela 1, C\u0113sis', distance: '90 km' },
    ],
  },
  {
    id: 'venipak',
    name: 'Venipak',
    type: 'locker',
    sub: 'Parcel locker',
    eta: '1\u20132 days',
    price: 2.0,
    anonymous: true,
    note: 'Baltic logistics network. Lockers + courier.',
    locations: [
      { id: 'ven-riga-1', name: 'Spice, R\u012bga', address: 'Lielirbes iela 29, R\u012bga', distance: '4.1 km' },
      { id: 'ven-riga-2', name: 'Akropole, R\u012bga', address: 'Maskavas iela 257, R\u012bga', distance: '6.2 km' },
      { id: 'ven-valmiera', name: 'Valki Maxima', address: 'Stacijas iela 21, Valmiera', distance: '108 km' },
    ],
  },
  {
    id: 'door',
    name: 'Door delivery',
    type: 'door',
    sub: 'DPD or Omniva courier',
    eta: '1\u20132 days',
    price: 4.5,
    anonymous: false,
    note: 'Courier brings the parcel to your address. Your name will be on the parcel label.',
  },
];

// ─────────────────────────────────────────────────────────────
// Payment methods — Apple Pay, Google Pay, card, banklinks, etc.
// ─────────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: 'apple', name: 'Apple Pay', sub: 'Face ID \u00b7 card never shared', kind: 'express', anonymous: true },
  { id: 'google', name: 'Google Pay', sub: 'Tap to pay', kind: 'express', anonymous: true },
  { id: 'card', name: 'Card', sub: 'Visa \u00b7 Mastercard \u00b7 Amex', kind: 'card', anonymous: false },
  { id: 'citadele', name: 'Citadele banklink', sub: 'Pay from your Citadele account', kind: 'banklink', bank: 'citadele', anonymous: true, color: '#00945E' },
  { id: 'swedbank', name: 'Swedbank banklink', sub: 'Pay from your Swedbank account', kind: 'banklink', bank: 'swedbank', anonymous: true, color: '#F47000' },
  { id: 'seb', name: 'SEB banklink', sub: 'Pay from your SEB account', kind: 'banklink', bank: 'seb', anonymous: true, color: '#418FDE' },
  { id: 'luminor', name: 'Luminor banklink', sub: 'Pay from your Luminor account', kind: 'banklink', bank: 'luminor', anonymous: true, color: '#5C2D91' },
  { id: 'inbank', name: 'Inbank — uz nomaksu', sub: 'Sadali 3\u201336 m\u0113ne\u0161os', kind: 'bnpl', bank: 'inbank', anonymous: false, color: '#1A1A2E' },
  { id: 'klix', name: 'Klix by Citadele', sub: 'Maks\u0101 v\u0113l\u0101k vai pa da\u013c\u0101m', kind: 'bnpl', bank: 'klix', anonymous: false, color: '#00945E' },
  { id: 'transfer', name: 'Bankas p\u0101rskait\u012bjums', sub: 'Apmaks\u0101 p\u0113c r\u0113\u0137ina sa\u0146em\u0161anas', kind: 'transfer', anonymous: false, color: '#3A4A5A' },
];

// ─────────────────────────────────────────────────────────────
// Pseudo-sender labels — optional alternate name on the parcel
// ─────────────────────────────────────────────────────────────
const PSEUDO_SENDERS = [
  { id: 'nl',     name: 'NL Trading Co',  sub: 'Noklusētais · maksimāls diskrētums', logo: 'NL',  color: '#0F0F0E' },
  { id: 'rd',     name: 'Rīga Distribution', sub: 'Neitrāls logistikas uzņēmums', logo: 'RD', color: '#5C2D91' },
  { id: 'baltic', name: 'Baltic Parcel',  sub: 'Neitrāls sūtījumu vārds', logo: 'BP', color: '#0066CC' },
  { id: 'rdlog',  name: 'RD Logistics',   sub: 'Neitrāls logistikas vārds', logo: 'RD', color: '#15803D' },
];

// ─────────────────────────────────────────────────────────────
// Reviews — per product + featured testimonials
// ─────────────────────────────────────────────────────────────
const REVIEWS = {
  'hush-01': [
    { name: 'M. K.', stars: 5, date: '12.04.2026', body: 'Tieši tik kluss, kā solīts. Lieliska pirmā pieredze, viegli lietot.' },
    { name: 'Anna', stars: 5, date: '28.03.2026', body: 'Diskrēta kaste, ātra piegāde uz pakomātu. Produkts izcils.' },
    { name: 'R.', stars: 4, date: '15.03.2026', body: 'Patīkams materiāls, akumulators tur ilgi. Iesaku.' },
  ],
  'ripple': [
    { name: 'Līga', stars: 5, date: '02.04.2026', body: 'Stiprāks nekā gaidīju! 12 režīmi ir vairāk nekā pietiekami.' },
    { name: 'J. B.', stars: 4, date: '20.03.2026', body: 'Ērti rokā, kluss. Vienīgi gribētos vēl vienu krāsu.' },
  ],
  'velvet': [
    { name: 'Pāris no Rīgas', stars: 5, date: '08.04.2026', body: 'Tālvadība darbojas lieliski. Mūsu jaunais favorīts diviem.' },
    { name: 'D.', stars: 5, date: '25.03.2026', body: 'Kvalitatīvs silikons, viegli tīrāms. Vērts naudu.' },
  ],
  'echo': [
    { name: 'Sintija', stars: 5, date: '10.04.2026', body: 'Ideāls iesācējam. Maigs, kluss un nav biedējošs.' },
    { name: 'K. M.', stars: 5, date: '01.04.2026', body: 'Viena uzlāde tiešām tur nedēļu. Ļoti apmierināta.' },
  ],
  'glow': [
    { name: 'Elīna', stars: 5, date: '14.04.2026', body: 'Lietotnes vadība ir nākotne. Sildošā galviņa — wow.' },
    { name: 'A. P.', stars: 5, date: '30.03.2026', body: 'Premium sajūta visā. Mūža garantija pārliecināja.' },
    { name: 'V.', stars: 4, date: '18.03.2026', body: 'Dārgs, bet kvalitāte to attaisno.' },
  ],
  'murmur': [
    { name: 'T.', stars: 5, date: '05.04.2026', body: 'Mazs, kluss, ietilpst kabatā. Ceļojumiem ideāls.' },
  ],
  'drift': [
    { name: 'Kristaps', stars: 5, date: '22.03.2026', body: 'Ceļojumu kārbiņa ar slēdzeni — ģeniāli. Bloķēšana darbojas.' },
  ],
  'halo': [
    { name: 'Pāris', stars: 5, date: '09.04.2026', body: 'Mīksts, izstiepjams, paliek vietā. Abiem patīk.' },
    { name: 'N.', stars: 4, date: '27.03.2026', body: 'Ātri uzlādējas, ērti lietot.' },
  ],
};

function reviewStats(id) {
  const r = REVIEWS[id] || [];
  if (!r.length) return { count: 0, avg: 0 };
  const avg = r.reduce((s, x) => s + x.stars, 0) / r.length;
  return { count: r.length, avg: Math.round(avg * 10) / 10 };
}

const FEATURED_TESTIMONIALS = [
  { name: 'Anna', city: 'Rīga', stars: 5, product: 'Hush 01', body: 'Pasūtīju ar bažām par diskrētumu — pilnīgi velti. Kaste bez nekā, izrakstā "NL Trading Co". Perfekti.' },
  { name: 'Pāris no Liepājas', city: 'Liepāja', stars: 5, product: 'Velvet', body: 'Ātra piegāde, kvalitatīvs produkts, un neviens neko nezina. Tieši tā, kā vajag.' },
  { name: 'Elīna', city: 'Jūrmala', stars: 5, product: 'Glow', body: 'Klientu serviss atbildēja 2 stundu laikā. Produkts pārspēja gaidas.' },
  { name: 'K. M.', city: 'Daugavpils', stars: 5, product: 'Echo', body: 'Pirmā reize iepērkoties šādā veikalā. Viss bija vienkārši un bez neveiklības.' },
  { name: 'Sintija', city: 'Cēsis', stars: 4, product: 'Ripple', body: 'Lieliska izvēle, ātra piegāde uz Omniva. Noteikti pasūtīšu vēl.' },
];

// ─────────────────────────────────────────────────────────────
// Gift cards — demo codes with balances (for checkout redemption)
// ─────────────────────────────────────────────────────────────
const GIFT_CARDS = {
  'SHHH-GIFT-50':  { initial: 50,  balance: 50 },
  'SHHH-GIFT-100': { initial: 100, balance: 72.50 },
  'SHHH-LOVE-25':  { initial: 25,  balance: 25 },
};

Object.assign(window, {
  PRODUCTS, CATEGORIES, TRUST_SIGNALS, DISCRETION_COPY,
  GIFT_THRESHOLD, GIFT_PRODUCT, PAIRS, COURIERS, PAYMENT_METHODS,
  PSEUDO_SENDERS, REVIEWS, FEATURED_TESTIMONIALS, reviewStats, GIFT_CARDS,
});
