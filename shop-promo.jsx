/* Shhh — promotions & discount codes shared between storefront and admin. */

window.SHOP_PROMO = {
  promos: [
    { id: 'PR-01', code: 'QUIET10',     type: 'percent',  value: 10, status: 'active',    starts: '2026-05-01', ends: '2026-08-31', used: 412, limit: null, appliesTo: 'Entire order',        note: 'Newsletter welcome code' },
    { id: 'PR-02', code: 'SILKYJUNE',   type: 'percent',  value: 15, status: 'active',    starts: '2026-06-01', ends: '2026-06-30', used: 187, limit: 1000, appliesTo: 'Sleepwear',            note: 'June silk campaign' },
    { id: 'PR-03', code: 'FREESHIP',    type: 'shipping', value: 0,  status: 'active',    starts: '2026-01-01', ends: null,         used: 958, limit: null, appliesTo: 'Orders over €80',      note: 'Evergreen free shipping' },
    { id: 'PR-04', code: 'BRIDAL25',    type: 'percent',  value: 25, status: 'scheduled', starts: '2026-07-01', ends: '2026-07-14', used: 0,   limit: 300,  appliesTo: 'Sets',                 note: 'Bridal capsule launch' },
    { id: 'PR-05', code: 'SHHH5',       type: 'fixed',    value: 5,  status: 'active',    starts: '2026-03-15', ends: null,         used: 731, limit: null, appliesTo: 'Entire order',         note: 'Cart-recovery email code' },
    { id: 'PR-06', code: 'VIPNIGHT',    type: 'percent',  value: 20, status: 'expired',   starts: '2026-04-18', ends: '2026-04-20', used: 264, limit: 264,  appliesTo: 'Entire order',         note: 'VIP shopping night' },
    { id: 'PR-07', code: 'BEAUTYDUO',   type: 'fixed',    value: 12, status: 'paused',    starts: '2026-05-10', ends: '2026-09-01', used: 58,  limit: 500,  appliesTo: 'Beauty',               note: 'Buy 2 beauty items' },
  ],

  campaigns: [
    { id: 'CMP-1', name: 'Summer Silk',        channel: 'Email',     status: 'running',  spend: 1240, revenue: 9860,  starts: '2026-06-01' },
    { id: 'CMP-2', name: 'Bridal Capsule',     channel: 'Instagram', status: 'draft',    spend: 0,    revenue: 0,     starts: '2026-07-01' },
    { id: 'CMP-3', name: 'Quiet Hours Retarget', channel: 'Meta Ads', status: 'running', spend: 2310, revenue: 11470, starts: '2026-05-12' },
    { id: 'CMP-4', name: 'Spring Refresh',     channel: 'Email',     status: 'finished', spend: 890,  revenue: 6120,  starts: '2026-03-20' },
  ],

  typeLabel(p) {
    if (p.type === 'percent') return '−' + p.value + '%';
    if (p.type === 'fixed') return '−€' + p.value;
    return 'Free shipping';
  },
};
