/* Shhh — storefront CMS content: pages, banners, FAQ. Managed in admin-cms. */

window.SHOP_CONTENT = {
  pages: [
    { id: 'PG-1', slug: '/',              title: 'Home',                status: 'published', updatedAt: '2026-06-04', author: 'Nikita',
      body: 'Hero: "Quiet luxury, loudly comfortable."\nFeatured: Midnight Lace Set, Silk Slip Dress.\nStrip: free shipping over €80 · 30-day returns · discreet packaging.' },
    { id: 'PG-2', slug: '/about',         title: 'Our Story',           status: 'published', updatedAt: '2026-05-18', author: 'Anna',
      body: 'Shhh started in a Riga attic with one sewing machine and a strong opinion about underwire. We make intimates that whisper, not shout.' },
    { id: 'PG-3', slug: '/size-guide',    title: 'Size Guide',          status: 'published', updatedAt: '2026-04-29', author: 'Anna',
      body: 'Measurement tables for bras, briefs and sleepwear. Includes the "between sizes? size up for sleep, down for lace" rule.' },
    { id: 'PG-4', slug: '/shipping',      title: 'Shipping & Returns',  status: 'published', updatedAt: '2026-06-01', author: 'Nikita',
      body: 'Baltics 1–3 days, EU 3–7 days. Free over €80. Returns within 30 days, hygiene seal intact. Discreet, logo-free outer box.' },
    { id: 'PG-5', slug: '/care',          title: 'Silk Care',           status: 'draft',     updatedAt: '2026-06-08', author: 'Nikita',
      body: 'How to wash silk without crying: cold water, pH-neutral soap, never the dryer. Draft — waiting on photography.' },
    { id: 'PG-6', slug: '/bridal',        title: 'Bridal Capsule',      status: 'scheduled', updatedAt: '2026-06-09', author: 'Anna',
      body: 'Landing page for the July bridal drop. Goes live with BRIDAL25.' },
  ],

  banners: [
    { id: 'BN-1', title: 'Free shipping bar',  message: 'Free shipping on orders over €80 🤫', placement: 'Top bar — all pages', active: true },
    { id: 'BN-2', title: 'June silk promo',    message: 'SILKYJUNE — 15% off all sleepwear',    placement: 'Home hero ribbon',    active: true },
    { id: 'BN-3', title: 'Bridal teaser',      message: 'Something white is coming · 01.07',    placement: 'Collection footer',   active: false },
  ],

  faqs: [
    { id: 'FQ-1', q: 'Is the packaging discreet?',          a: 'Yes — plain outer box, no brand on the label. The shipping line item says "apparel".' },
    { id: 'FQ-2', q: 'Can I return briefs?',                 a: 'Only with the hygiene seal intact, within 30 days.' },
    { id: 'FQ-3', q: 'Do you ship outside the EU?',          a: 'Not yet — Baltics and EU only. UK and CH are on the roadmap.' },
    { id: 'FQ-4', q: 'How do I wash silk pieces?',           a: 'Cold hand wash, pH-neutral soap, air dry flat. Never tumble dry.' },
  ],
};
