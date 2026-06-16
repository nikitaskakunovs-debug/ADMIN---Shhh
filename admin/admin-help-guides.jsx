// admin-help-guides.jsx — task-based onboarding: annotated screenshots,
// animated walkthroughs, getting-started checklist, contextual help map.
// Depends on AT, AIcon, ABadge, ABtn (from admin-ui.jsx, loaded earlier).

// ── Annotated screenshot: image + numbered pins + a legend ───
function Shot({ src, pins = [], caption, maxW = 720 }) {
  return (
    <figure style={{ margin: 0, maxWidth: maxW, marginBottom: 18 }}>
      <div style={{ position: 'relative', borderRadius: AT.radiusSm, overflow: 'hidden', border: `1px solid ${AT.rule}`, background: AT.surfaceAlt, lineHeight: 0 }}>
        <img src={src} alt={caption || ''} style={{ display: 'block', width: '100%' }} />
        {pins.map(p => (
          <span key={p.n} style={{ position: 'absolute', left: p.x + '%', top: p.y + '%', transform: 'translate(-50%,-50%)', width: 26, height: 26, borderRadius: 999, background: AT.accent, color: '#fff', fontFamily: AT.mono, fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 3px rgba(255,255,255,0.9), 0 3px 8px rgba(0,0,0,0.35)' }}>{p.n}</span>
        ))}
      </div>
      {pins.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 11 }}>
          {pins.map(p => (
            <div key={p.n} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
              <span style={{ width: 19, height: 19, borderRadius: 999, background: AT.accent, color: '#fff', fontFamily: AT.mono, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{p.n}</span>
              <span style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, lineHeight: 1.5 }}>{p.t}</span>
            </div>
          ))}
        </div>
      )}
    </figure>
  );
}

// ── Animated walkthrough: auto-advancing step player ─────────
function Walkthrough({ steps }) {
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  React.useEffect(() => {
    if (!playing) return undefined;
    const t = setTimeout(() => setI(p => (p >= steps.length - 1 ? 0 : p + 1)), 3400);
    return () => clearTimeout(t);
  }, [playing, i, steps.length]);
  const s = steps[i];
  return (
    <div style={{ maxWidth: 720, marginBottom: 24, border: `1px solid ${AT.rule}`, borderRadius: AT.radius, overflow: 'hidden', background: AT.panel }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', background: AT.ink }}>
        <span style={{ display: 'inline-flex', width: 22, height: 22 }}><AIcon name="bolt" size={16} color="#fff" /></span>
        <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13, color: '#fff' }}>Watch it done</span>
        <span style={{ fontFamily: AT.mono, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Step {i + 1} / {steps.length}</span>
        <div style={{ flex: 1 }} />
        <button onClick={() => setPlaying(p => !p)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.15)', color: '#fff', fontFamily: AT.body, fontWeight: 600, fontSize: 12 }}>
          {playing ? '❚❚ Pause' : '▶ Play'}
        </button>
      </div>
      <div style={{ position: 'relative', lineHeight: 0, background: AT.surfaceAlt }}>
        <img src={s.img} alt="" style={{ display: 'block', width: '100%' }} />
        {(s.pins || []).map(p => (
          <span key={p.n} style={{ position: 'absolute', left: p.x + '%', top: p.y + '%', transform: 'translate(-50%,-50%)', width: 28, height: 28, borderRadius: 999, background: AT.accent, color: '#fff', fontFamily: AT.mono, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 3px rgba(255,255,255,0.9), 0 3px 10px rgba(0,0,0,0.4)', animation: 'helpPulse 1.4s ease-out infinite' }}>{p.n}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderTop: `1px solid ${AT.rule}` }}>
        <span style={{ width: 24, height: 24, borderRadius: 999, background: AT.ink, color: '#fff', fontFamily: AT.mono, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
        <span style={{ flex: 1, fontFamily: AT.body, fontSize: 13.5, color: AT.ink, lineHeight: 1.5 }}>{s.do}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 14px' }}>
        <button onClick={() => { setPlaying(false); setI(p => Math.max(0, p - 1)); }} style={stepNavBtn}>← Back</button>
        <div style={{ flex: 1, display: 'flex', gap: 6, justifyContent: 'center' }}>
          {steps.map((_, k) => (
            <button key={k} onClick={() => { setPlaying(false); setI(k); }} style={{ all: 'unset', cursor: 'pointer', width: k === i ? 22 : 8, height: 8, borderRadius: 999, background: k === i ? AT.accent : AT.rule, transition: 'all .2s' }} />
          ))}
        </div>
        <button onClick={() => { setPlaying(false); setI(p => Math.min(steps.length - 1, p + 1)); }} style={stepNavBtn}>Next →</button>
      </div>
    </div>
  );
}
const stepNavBtn = { all: 'unset', cursor: 'pointer', padding: '6px 12px', borderRadius: 7, border: `1px solid ${AT.rule}`, background: AT.panel, color: AT.ink, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5 };

// ════════════════════════════════════════════════════════════
// TASK GUIDES — each is a real-world scenario for hired staff.
// roles: who it matters most to. steps: {do, img, pins}. tips: notes.
// ════════════════════════════════════════════════════════════
const A = 'help-assets/';
const GUIDES = {
  // ───── SELL ─────
  'fulfil-order': {
    area: 'Sell', roles: ['fulfilment', 'support'], icon: 'orders',
    title: 'Fulfil an order',
    blurb: 'The core warehouse job: take a new paid order and get it shipped. This is the flow you’ll repeat all day.',
    walkthrough: [
      { do: 'Open Orders from the sidebar. The badge shows how many need action right now.', img: A + 'orders-list.png', pins: [{ n: 1, x: 8, y: 42 }] },
      { do: 'Click “To fulfil” to see only the orders waiting to be packed, then click a row to open it.', img: A + 'orders-list.png', pins: [{ n: 2, x: 33, y: 34 }, { n: 3, x: 45, y: 84 }] },
      { do: 'Check the items and customer in the order drawer. If it’s still awaiting payment, press “Mark as paid”.', img: A + 'order-items.png', pins: [{ n: 4, x: 41, y: 32 }, { n: 5, x: 80, y: 93 }] },
    ],
    steps: [
      { do: 'In the sidebar, open Orders. The blue badge counts orders needing action.', img: A + 'orders-list.png', pins: [{ n: 1, x: 8, y: 42, t: 'Orders — with its action badge.' }, { n: 2, x: 33, y: 34, t: 'Status filters: click “To fulfil” to focus.' }] },
      { do: 'Click the order’s row to open its detail drawer.', img: A + 'order-items.png', pins: [{ n: 1, x: 41, y: 32, t: 'Four tabs: Items, Payment, Delivery, Docs.' }, { n: 2, x: 25, y: 22, t: 'The order’s current status.' }, { n: 3, x: 80, y: 93, t: '“Mark as paid” once payment clears.' }] },
      { do: 'Open the Delivery tab to confirm the courier / pickup point and add the tracking number.' },
      { do: 'Mark the order as fulfilled. Its status updates everywhere — the list, badges and the change log at the bottom of the page.' },
    ],
    tips: [{ tone: 'tip', t: 'Every status change is recorded in the change log at the bottom of the Orders page, so the team can see who shipped what.' }],
  },
  'refund-return': {
    area: 'Sell', roles: ['support'], icon: 'returns',
    title: 'Handle a return or refund',
    blurb: 'When a customer wants to send something back or asks for money back, this is how support resolves it.',
    steps: [
      { do: 'Open Returns & warranty from the sidebar (under Sell). Filter by Open to see active claims, or by type (return vs. warranty).' },
      { do: 'Open the claim and check it against the linked order — the system verifies the customer actually owns that order.' },
      { do: 'Approve or close the claim. Approving a return tells the customer how to send it back.' },
      { do: 'To refund money, open the original order, go to the Payment tab, and issue the refund there — the invoice and payout records update with it.', img: A + 'order-payment.png', pins: [{ n: 1, x: 49, y: 46, t: 'The invoice for this order.' }, { n: 2, x: 45, y: 77, t: 'Download / re-send the invoice.' }] },
    ],
    tips: [{ tone: 'warn', t: 'Open returns raise the badge on the Returns nav item and show in “Needs attention” on the dashboard, so nothing is forgotten.' }],
  },
  // ───── CUSTOMERS ─────
  'find-customer': {
    area: 'Customers', roles: ['support'], icon: 'users',
    title: 'Look up a customer & leave a note',
    blurb: 'When someone contacts support, find them fast, see their history, and leave an internal note for the next person.',
    steps: [
      { do: 'Open Customers. Search by name, email, alias or city — or use the segment pills (VIP, repeat, new).', img: A + 'customers.png', pins: [{ n: 1, x: 8, y: 62, t: 'Customers in the sidebar.' }, { n: 2, x: 70, y: 30, t: 'Segments, market, tags and sort.' }, { n: 3, x: 80, y: 41, t: 'Search box.' }] },
      { do: 'Click a customer to open their profile: every order, lifetime value, tags and notes.' },
      { do: 'Add a private note (e.g. “called about late delivery — promised refund”). Notes are internal and never shown to the customer.' },
      { do: 'Add a tag like VIP or repeat to group them for marketing later.' },
    ],
    tips: [{ tone: 'tip', t: 'The customer list is built from real orders, so it always matches what people actually bought.' }],
  },
  'gdpr-erase': {
    area: 'Customers', roles: ['support'], icon: 'returns',
    title: 'Erase a customer (GDPR)',
    blurb: 'If a customer asks to be forgotten, you can permanently anonymise their personal data — a key part of this shop’s privacy promise.',
    steps: [
      { do: 'Find the customer in Customers and open their profile.', img: A + 'customers.png', pins: [{ n: 1, x: 80, y: 41, t: 'Search for the person first.' }] },
      { do: 'Use “Erase / anonymise”. Their name and contact details are scrubbed; order records stay for accounting but can no longer identify them.' },
      { do: 'Confirm — this cannot be undone. The action is written to the change log so there’s a record that the request was honoured.' },
    ],
    tips: [{ tone: 'danger', t: 'Erasing is permanent. Make sure you’ve verified the request is genuine before confirming.' }],
  },
  // ───── MARKETING ─────
  'create-discount': {
    area: 'Marketing', roles: ['content'], icon: 'promos',
    title: 'Create a discount code',
    blurb: 'Set up a promo code customers type at checkout — percentage off, a fixed amount, or free shipping.',
    walkthrough: [
      { do: 'Open Promos & gift cards (under Marketing). You’ll see every existing code and its status.', img: A + 'promos.png', pins: [{ n: 1, x: 8, y: 42 }] },
      { do: 'Pick the kind of code with the type pills, then press “New code”.', img: A + 'promos.png', pins: [{ n: 2, x: 42, y: 35 }, { n: 3, x: 89, y: 43 }] },
      { do: 'Fill in the code, value and any limits, and save. New codes are Active immediately — use Disable to pause one.', img: A + 'promos.png', pins: [{ n: 4, x: 83, y: 64 }] },
    ],
    steps: [
      { do: 'Open Promos & gift cards from the sidebar (Marketing group).', img: A + 'promos.png', pins: [{ n: 1, x: 42, y: 35, t: 'Type pills: Percent, Fixed €, Free shipping.' }, { n: 2, x: 89, y: 43, t: '“New code” to create one.' }, { n: 3, x: 83, y: 64, t: 'Edit or Disable any existing code.' }] },
      { do: 'Press “New code”, choose the type, and enter the code customers will type (e.g. SUMMER20).' },
      { do: 'Set the value (e.g. 20%), and any limits like minimum spend or expiry. Save.' },
      { do: 'Check it appears as Active in the list. Use the Status filter or search to find codes later.' },
    ],
    tips: [{ tone: 'tip', t: 'Marketing only ever reaches customers who opted in — pair codes with the marketing-consent filter in Customers.' }],
  },
  'gift-card': {
    area: 'Marketing', roles: ['content', 'support'], icon: 'promos',
    title: 'Issue a gift card',
    blurb: 'Create store credit a customer can spend later — useful for goodwill gestures or gift purchases.',
    steps: [
      { do: 'Open Promos & gift cards and scroll to the Gift cards section.', img: A + 'promos.png', pins: [{ n: 1, x: 8, y: 42, t: 'Promos & gift cards in the sidebar.' }] },
      { do: 'Press “Issue card”, set the amount, and save. The card gets a unique code.' },
      { do: 'Track issued cards and their remaining balance in the same section.' },
    ],
  },
  // ───── CONTENT ─────
  'edit-page': {
    area: 'Content', roles: ['content'], icon: 'content',
    title: 'Edit a storefront page',
    blurb: 'Change the words, images and SEO of any page on the shop — in five languages, with a live preview.',
    walkthrough: [
      { do: 'Open Content, then “Pages” in the left tree. Filter or search to find the page.', img: A + 'content-pages.png', pins: [{ n: 1, x: 34, y: 49 }, { n: 2, x: 62, y: 55 }] },
      { do: 'Click a page to open the editor. Pick the language — LV is the default; blank languages fall back to it.', img: A + 'content-editor.png', pins: [{ n: 3, x: 43, y: 23 }, { n: 4, x: 55, y: 23 }] },
      { do: 'Edit across the Content, Media and SEO tabs, then “Save & publish” — it’s live on mobile + desktop instantly.', img: A + 'content-editor.png', pins: [{ n: 5, x: 39, y: 31 }, { n: 6, x: 89, y: 93 }] },
    ],
    steps: [
      { do: 'Open Content from the sidebar. Use the left tree to switch areas; press ⌘K (Ctrl K) to jump to any page fast.', img: A + 'content-overview.png', pins: [{ n: 1, x: 36, y: 33, t: '⌘K search — find any page or string.' }, { n: 2, x: 36, y: 49, t: 'The left tree of content areas.' }] },
      { do: 'Go to Pages. Filter by group (Guides, Journal, Legal…), search, and click the page you want.', img: A + 'content-pages.png', pins: [{ n: 1, x: 34, y: 49, t: 'Pages in the tree.' }, { n: 2, x: 60, y: 33, t: 'Group pills to narrow the list.' }] },
      { do: 'In the editor, choose the language, then edit the three tabs.', img: A + 'content-editor.png', pins: [{ n: 1, x: 50, y: 23, t: 'Language switcher (LV is default).' }, { n: 2, x: 39, y: 31, t: 'Content / Media / SEO tabs.' }, { n: 3, x: 89, y: 93, t: '“Save & publish”.' }] },
      { do: 'Content tab = words (title, intro, sections). Media tab = hero image + card icon. SEO tab = page title, description and social-share image.' },
      { do: 'Turn on Live preview to see your edits on Desktop and Mobile before saving.' },
    ],
    tips: [{ tone: 'tip', t: 'Per-page SEO overrides the site-wide defaults in Global SEO. Saving publishes to both storefronts at once.' }],
  },
  'edit-translation': {
    area: 'Content', roles: ['content'], icon: 'content',
    title: 'Edit a label or translation',
    blurb: 'Change any small interface word — buttons, menus, messages — across all five languages.',
    steps: [
      { do: 'Open Content → “All strings (i18n)” for every interface string, or “Navigation & footer” / “Home & blocks” for those specific areas.', img: A + 'content-overview.png', pins: [{ n: 1, x: 36, y: 51, t: 'Pick the right strings area in the tree.' }] },
      { do: 'Search by key or text to find the string, then edit any language cell inline. Cells you’ve changed are highlighted.' },
      { do: 'Changes apply to the storefront on reload. The table shows the first 120 matches — refine your search to narrow it.' },
    ],
    tips: [{ tone: 'warn', t: 'For long-form text (page bodies), use Pages instead — All strings is for short UI labels.' }],
  },
};
const GUIDE_AREAS = ['Sell', 'Customers', 'Marketing', 'Content'];

// ── Getting-started checklist (role-aware) ───────────────────
// Each item points staff at a first task and the guide that teaches it.
const CHECKLIST = [
  { id: 'scope', label: 'Set your business & market', desc: 'Top of the screen — pick which store you’re working in.', icon: 'finance', roles: 'all', screen: null, topic: 'scope' },
  { id: 'fulfil', label: 'Open & fulfil an order', desc: 'The core day-to-day job.', icon: 'orders', roles: ['fulfilment', 'support'], screen: 'orders', topic: 'fulfil-order' },
  { id: 'customer', label: 'Look up a customer', desc: 'Find someone and leave a note.', icon: 'users', roles: ['support'], screen: 'customers', topic: 'find-customer' },
  { id: 'discount', label: 'Create a discount code', desc: 'Set up your first promo.', icon: 'promos', roles: ['content'], screen: 'promos', topic: 'create-discount' },
  { id: 'page', label: 'Edit a storefront page', desc: 'Change words, images & SEO.', icon: 'content', roles: ['content'], screen: 'content', topic: 'edit-page' },
  { id: 'manual', label: 'Skim the user manual', desc: 'How every section works.', icon: 'list', roles: 'all', screen: 'help', topic: 'start' },
];
const CHECK_KEY = 'shhh_admin_checklist_v1';

function AGettingStarted({ nav, role }) {
  const [done, setDone] = React.useState(() => { try { return JSON.parse(localStorage.getItem(CHECK_KEY) || '{}'); } catch (e) { return {}; } });
  const save = (d) => { setDone(d); try { localStorage.setItem(CHECK_KEY, JSON.stringify(d)); } catch (e) {} };
  const toggle = (id) => save({ ...done, [id]: !done[id] });
  const items = CHECKLIST.filter(c => c.roles === 'all' || (ROLE_NAV[role] || []).includes(c.screen) || c.roles.includes(role));
  const doneCount = items.filter(c => done[c.id]).length;
  const pct = Math.round(doneCount / items.length * 100);
  return (
    <APanel pad={20} style={{ gridColumn: 'span 12' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: AT.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name="bolt" size={19} color="#fff" /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 17, color: AT.ink }}>Getting started</div>
          <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>{doneCount === items.length ? 'All done — you’re set! Remove this card any time.' : `${doneCount} of ${items.length} done · learn the panel by doing`}</div>
        </div>
        <div style={{ width: 120, height: 7, borderRadius: 999, background: AT.surfaceAlt, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: AT.accent, borderRadius: 999, transition: 'width .3s' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {items.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: AT.radiusSm, border: `1px solid ${done[c.id] ? AT.rule : AT.ruleSoft}`, background: done[c.id] ? AT.surfaceAlt : AT.panel }}>
            <button onClick={() => toggle(c.id)} title="Mark done" style={{ all: 'unset', cursor: 'pointer', width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${done[c.id] ? AT.accent : AT.rule}`, background: done[c.id] ? AT.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{done[c.id] && <AIcon name="check" size={13} color="#fff" />}</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13, color: AT.ink, textDecoration: done[c.id] ? 'line-through' : 'none', opacity: done[c.id] ? 0.6 : 1 }}>{c.label}</div>
              <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>{c.desc}</div>
            </div>
            <button onClick={() => { if (c.topic) nav('help', { topic: c.topic }); else if (c.screen) nav(c.screen); }} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 9px', borderRadius: 7, border: `1px solid ${AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 11.5, color: AT.accent, flexShrink: 0 }}>{c.topic && c.topic !== 'start' ? 'Learn' : 'Open'} <AIcon name="arrow" size={12} color={AT.accent} /></button>
          </div>
        ))}
      </div>
    </APanel>
  );
}

// ── Contextual help: short per-screen tips + a deep link ─────
const SCREEN_HELP = {
  dashboard: { title: 'Dashboard', tips: ['Drag, add or remove any card to build your own layout.', 'The “Getting started” card walks you through your first tasks.'], topic: 'dashboard' },
  orders: { title: 'Orders', tips: ['Click a row to open items, payment, delivery & docs in one drawer.', 'Use the status pills (To fulfil, Awaiting payment) to focus.'], topic: 'fulfil-order' },
  returns: { title: 'Returns & warranty', tips: ['Each claim is checked against the customer’s real order.', 'Refund money from the order’s Payment tab.'], topic: 'refund-return' },
  customers: { title: 'Customers', tips: ['Search by name, email or city; filter by market or tags.', 'Notes are internal; use Erase for GDPR requests.'], topic: 'find-customer' },
  reviews: { title: 'Reviews', tips: ['Approve to publish, reject to discard.', 'Filter by rating, verified-buyer or product.'], topic: null },
  catalog: { title: 'Catalog', tips: ['Hide a product to remove it from the shop without deleting.', 'Filter by brand, stock or on-sale.'], topic: null },
  inventory: { title: 'Inventory', tips: ['Adjust stock inline with + / −.', 'Filter to Low / Out to see what needs reordering.'], topic: null },
  promos: { title: 'Promos & gift cards', tips: ['“New code” creates a discount; codes are Active immediately.', 'Issue store credit in the Gift cards section.'], topic: 'create-discount' },
  marketing: { title: 'Marketing', tips: ['Campaigns only reach customers who opted in.'], topic: 'create-discount' },
  content: { title: 'Content', tips: ['Press ⌘K to jump to any page or string.', 'Edit words, images and SEO per language, with live preview.'], topic: 'edit-page' },
  analytics: { title: 'Analytics', tips: ['Best viewed in “All markets” for the full picture.'], topic: null },
  finances: { title: 'Finances', tips: ['Invoices, payouts and VAT per market & legal entity.', 'Every order links to its settlement batch.'], topic: null },
  brands: { title: 'Brands', tips: ['Feature a brand to surface it on the storefront.'], topic: null },
  settings: { title: 'Settings', tips: ['Store-wide config: couriers, team, tax, discretion.'], topic: null },
};

Object.assign(window, { Shot, Walkthrough, GUIDES, GUIDE_AREAS, CHECKLIST, AGettingStarted, SCREEN_HELP });
