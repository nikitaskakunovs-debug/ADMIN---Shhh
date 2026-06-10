/* Shhh — storefront source of truth: catalog + categories.
   Loaded first; every other file reads from window.SHOP_DATA. */

window.SHOP_DATA = {
  store: {
    name: 'Shhh',
    tagline: 'Quiet luxury intimates',
    currency: 'EUR',
    locale: 'en',
    domain: 'shhh-store.example',
    supportEmail: 'care@shhh-store.example',
    country: 'LV',
  },

  categories: [
    { id: 'bras',       name: 'Bras' },
    { id: 'briefs',     name: 'Briefs' },
    { id: 'sets',       name: 'Sets' },
    { id: 'sleepwear',  name: 'Sleepwear' },
    { id: 'loungewear', name: 'Loungewear' },
    { id: 'accessories',name: 'Accessories' },
    { id: 'beauty',     name: 'Beauty' },
  ],

  products: [
    { id: 'P-1001', sku: 'SH-BRA-001', name: 'Whisper Wireless Bra',     brand: 'maison-nuit', category: 'bras',       price: 64,  compareAt: 79,   cost: 21, stock: 64,  status: 'active',   color: '#E8C9D8', sizes: ['XS','S','M','L','XL'], rating: 4.8, createdAt: '2025-09-14' },
    { id: 'P-1002', sku: 'SH-BRA-002', name: 'Mesh Balconette',          brand: 'maison-nuit', category: 'bras',       price: 72,  compareAt: null, cost: 24, stock: 31,  status: 'active',   color: '#1C1C1E', sizes: ['S','M','L'],           rating: 4.6, createdAt: '2025-10-02' },
    { id: 'P-1003', sku: 'SH-BRA-003', name: 'Second-Skin Triangle Bra', brand: 'silk-route',  category: 'bras',       price: 58,  compareAt: null, cost: 18, stock: 7,   status: 'active',   color: '#D9C8B4', sizes: ['XS','S','M','L'],      rating: 4.9, createdAt: '2025-11-20' },
    { id: 'P-1004', sku: 'SH-BRF-001', name: 'Cloud High-Rise Brief',    brand: 'maison-nuit', category: 'briefs',     price: 28,  compareAt: 36,   cost: 8,  stock: 142, status: 'active',   color: '#F2E6EE', sizes: ['XS','S','M','L','XL'], rating: 4.7, createdAt: '2025-08-30' },
    { id: 'P-1005', sku: 'SH-BRF-002', name: 'Lace Cheeky',              brand: 'silk-route',  category: 'briefs',     price: 32,  compareAt: null, cost: 9,  stock: 88,  status: 'active',   color: '#7A1F3D', sizes: ['S','M','L'],           rating: 4.5, createdAt: '2025-09-22' },
    { id: 'P-1006', sku: 'SH-BRF-003', name: 'Seamless Thong 3-Pack',    brand: 'shhh-house',  category: 'briefs',     price: 45,  compareAt: 54,   cost: 13, stock: 4,   status: 'active',   color: '#C9CDD6', sizes: ['XS','S','M','L'],      rating: 4.4, createdAt: '2025-10-18' },
    { id: 'P-1007', sku: 'SH-SET-001', name: 'Midnight Lace Set',        brand: 'maison-nuit', category: 'sets',       price: 118, compareAt: 139,  cost: 38, stock: 22,  status: 'active',   color: '#0E1230', sizes: ['S','M','L'],           rating: 4.9, createdAt: '2025-11-05' },
    { id: 'P-1008', sku: 'SH-SET-002', name: 'Blush Satin Set',          brand: 'silk-route',  category: 'sets',       price: 104, compareAt: null, cost: 33, stock: 17,  status: 'active',   color: '#EFB7C4', sizes: ['XS','S','M','L'],      rating: 4.7, createdAt: '2025-12-01' },
    { id: 'P-1009', sku: 'SH-SLP-001', name: 'Silk Slip Dress',          brand: 'silk-route',  category: 'sleepwear',  price: 148, compareAt: null, cost: 52, stock: 26,  status: 'active',   color: '#B9A77E', sizes: ['S','M','L'],           rating: 4.8, createdAt: '2025-07-19' },
    { id: 'P-1010', sku: 'SH-SLP-002', name: 'Cloud Pyjama Set',         brand: 'shhh-house',  category: 'sleepwear',  price: 96,  compareAt: 112,  cost: 30, stock: 49,  status: 'active',   color: '#DCE4EE', sizes: ['XS','S','M','L','XL'], rating: 4.6, createdAt: '2025-09-08' },
    { id: 'P-1011', sku: 'SH-SLP-003', name: 'Short Silk Robe',          brand: 'silk-route',  category: 'sleepwear',  price: 132, compareAt: null, cost: 44, stock: 12,  status: 'active',   color: '#3E5740', sizes: ['S/M','L/XL'],          rating: 4.9, createdAt: '2025-10-27' },
    { id: 'P-1012', sku: 'SH-LNG-001', name: 'Ribbed Lounge Set',        brand: 'shhh-house',  category: 'loungewear', price: 89,  compareAt: null, cost: 27, stock: 73,  status: 'active',   color: '#A8927B', sizes: ['XS','S','M','L'],      rating: 4.5, createdAt: '2025-08-11' },
    { id: 'P-1013', sku: 'SH-LNG-002', name: 'Cashmere Blend Cardigan',  brand: 'shhh-house',  category: 'loungewear', price: 156, compareAt: 180,  cost: 58, stock: 9,   status: 'active',   color: '#CFC4B6', sizes: ['S','M','L'],           rating: 4.7, createdAt: '2025-11-12' },
    { id: 'P-1014', sku: 'SH-ACC-001', name: 'Sleep Mask — Mulberry Silk', brand: 'silk-route', category: 'accessories', price: 34, compareAt: null, cost: 9, stock: 118, status: 'active',  color: '#542A3C', sizes: ['One size'],            rating: 4.8, createdAt: '2025-06-25' },
    { id: 'P-1015', sku: 'SH-ACC-002', name: 'Scrunchie Trio',           brand: 'shhh-house',  category: 'accessories',price: 22,  compareAt: null, cost: 5,  stock: 0,   status: 'active',   color: '#E2D5E8', sizes: ['One size'],            rating: 4.3, createdAt: '2025-09-30' },
    { id: 'P-1016', sku: 'SH-BTY-001', name: 'Pillow Mist — Lavender',   brand: 'atelier-anouk', category: 'beauty',   price: 29,  compareAt: null, cost: 7,  stock: 54,  status: 'active',   color: '#9D8FC0', sizes: ['100 ml'],              rating: 4.6, createdAt: '2025-10-09' },
    { id: 'P-1017', sku: 'SH-BTY-002', name: 'Body Oil — Neroli',        brand: 'atelier-anouk', category: 'beauty',   price: 42,  compareAt: 48,   cost: 12, stock: 37,  status: 'active',   color: '#D9A05B', sizes: ['150 ml'],              rating: 4.7, createdAt: '2025-11-28' },
    { id: 'P-1018', sku: 'SH-SET-003', name: 'Bridal Tulle Set',         brand: 'maison-nuit', category: 'sets',       price: 165, compareAt: null, cost: 55, stock: 11,  status: 'draft',    color: '#F5F1EA', sizes: ['XS','S','M','L'],      rating: 0,   createdAt: '2026-01-15' },
    { id: 'P-1019', sku: 'SH-LNG-003', name: 'Wide-Leg Knit Pant',       brand: 'shhh-house',  category: 'loungewear', price: 78,  compareAt: null, cost: 24, stock: 41,  status: 'draft',    color: '#6E6A63', sizes: ['XS','S','M','L'],      rating: 0,   createdAt: '2026-02-03' },
    { id: 'P-1020', sku: 'SH-BRA-004', name: 'Velvet Longline Bra',      brand: 'maison-nuit', category: 'bras',       price: 84,  compareAt: 98,   cost: 28, stock: 0,   status: 'archived', color: '#2C1A2E', sizes: ['S','M','L'],           rating: 4.2, createdAt: '2025-03-04' },
  ],

  categoryName(id) {
    const c = this.categories.find(c => c.id === id);
    return c ? c.name : id;
  },
  product(id) {
    return this.products.find(p => p.id === id) || null;
  },
};
