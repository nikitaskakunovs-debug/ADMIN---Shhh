// admin-help.jsx — in-app User Manual. A left-tree workspace (mirrors Content)
// documenting every section and what each control does, with a Content deep-dive.

// ── Block renderers ──────────────────────────────────────────
function HLead({ children }) {
  return <div style={{ fontFamily: AT.body, fontSize: 15.5, lineHeight: 1.6, color: AT.ink, marginBottom: 22, maxWidth: 760 }}>{children}</div>;
}
function HHead({ children }) {
  return <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 18, letterSpacing: AT.ld, color: AT.ink, margin: '26px 0 12px' }}>{children}</div>;
}
function HP({ children }) {
  return <p style={{ fontFamily: AT.body, fontSize: 13.5, lineHeight: 1.65, color: AT.inkSoft, margin: '0 0 12px', maxWidth: 760 }}>{children}</p>;
}
// Function reference: icon + name + what it does.
function HFuncs({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: AT.rule, border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, overflow: 'hidden', maxWidth: 760, marginBottom: 18 }}>
      {items.map(([icon, name, desc], i) => (
        <div key={i} style={{ display: 'flex', gap: 14, padding: '13px 16px', background: AT.panel, alignItems: 'flex-start' }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}><AIcon name={icon} size={16} color={AT.ink} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink, marginBottom: 2 }}>{name}</div>
            <div style={{ fontFamily: AT.body, fontSize: 13, lineHeight: 1.55, color: AT.inkSoft }}>{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
// Numbered steps.
function HSteps({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18, maxWidth: 760 }}>
      {items.map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ width: 24, height: 24, borderRadius: 999, background: AT.ink, color: '#fff', fontFamily: AT.mono, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
          <div style={{ fontFamily: AT.body, fontSize: 13.5, lineHeight: 1.55, color: AT.ink, paddingTop: 2 }}>{t}</div>
        </div>
      ))}
    </div>
  );
}
// Key/value reference (e.g. fields in a form).
function HFields({ items }) {
  return (
    <div style={{ border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, overflow: 'hidden', maxWidth: 760, marginBottom: 18 }}>
      {items.map(([k, v], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 14, padding: '11px 16px', borderTop: i ? `1px solid ${AT.ruleSoft}` : 'none' }}>
          <div style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 13, color: AT.ink }}>{k}</div>
          <div style={{ fontFamily: AT.body, fontSize: 13, lineHeight: 1.55, color: AT.inkSoft }}>{v}</div>
        </div>
      ))}
    </div>
  );
}
function HNote({ tone = 'tip', children }) {
  const map = {
    tip: { bg: AT.accentSoft, fg: '#21438C', icon: 'bolt', label: 'Tip' },
    warn: { bg: '#FFF4E0', fg: '#7A5200', icon: 'bell', label: 'Note' },
    danger: { bg: '#FDECEC', fg: '#8A1F1F', icon: 'returns', label: 'Careful' },
  }[tone];
  return (
    <div style={{ display: 'flex', gap: 11, padding: '13px 15px', borderRadius: AT.radiusSm, background: map.bg, marginBottom: 18, maxWidth: 760 }}>
      <AIcon name={map.icon} size={17} color={map.fg} />
      <div style={{ flex: 1, fontFamily: AT.body, fontSize: 13, lineHeight: 1.6, color: map.fg }}><strong>{map.label}.</strong> {children}</div>
    </div>
  );
}

// ── Manual content ───────────────────────────────────────────
// Reference sections (don't depend on GUIDES). The full tree is assembled at
// runtime in AHelp so it can fold in the task guides from admin-help-guides.jsx.
const HELP_REF = [
  { group: 'Concepts', items: [
    ['scope', 'Businesses & markets', 'finance'],
    ['filtering', 'Filtering & search', 'search'],
    ['changelog', 'Change log & history', 'list'],
    ['account', 'Account, roles & sign-in', 'user'],
  ] },
  { group: 'Reference · sections', items: [
    ['dashboard', 'Dashboard', 'dashboard'],
    ['orders', 'Orders', 'orders'],
    ['customers', 'Customers', 'users'],
    ['catalog', 'Catalog', 'catalog'],
    ['inventory', 'Inventory', 'inventory'],
    ['marketing', 'Marketing & promos', 'megaphone'],
    ['reports', 'Analytics & finances', 'analytics'],
    ['reviews', 'Reviews & returns', 'reviews'],
    ['brands', 'Brands', 'brands'],
    ['settings', 'Settings', 'settings'],
  ] },
  { group: 'In depth', items: [['content', 'Content (CMS)', 'content']] },
];
// Assemble the navigable tree: Start → Tasks (by area) → Reference.
function buildHelpTree() {
  const G = window.GUIDES || {};
  const areas = window.GUIDE_AREAS || [];
  const taskGroups = areas.map(area => ({
    group: 'Tasks · ' + area,
    items: Object.keys(G).filter(id => G[id].area === area).map(id => [id, G[id].title, G[id].icon]),
  })).filter(g => g.items.length);
  return [{ group: null, items: [['start', 'Getting started', 'dashboard']] }, ...taskGroups, ...HELP_REF];
}

function HelpStart({ go }) {
  const G = window.GUIDES || {};
  const featured = ['fulfil-order', 'find-customer', 'create-discount', 'edit-page'].filter(id => G[id]);
  return (
    <div>
      <HLead>Welcome! This is your back-office console — where the shop is run day to day. The fastest way to learn it is to <strong>do a real task</strong>. Pick one below — each guide shows you exactly where to click, with screenshots and a short animation.</HLead>
      <HHead>Learn by doing</HHead>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(232px, 1fr))', gap: 12, marginBottom: 8, maxWidth: 760 }}>
        {featured.map(id => (
          <button key={id} onClick={() => go(id)} style={{ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 7, padding: '15px 16px', borderRadius: AT.radius, border: `1px solid ${AT.rule}`, background: AT.panel }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = AT.accent; e.currentTarget.style.background = AT.accentSoft; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = AT.rule; e.currentTarget.style.background = AT.panel; }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: AT.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AIcon name={G[id].icon} size={17} color={AT.ink} /></span>
            <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14.5, color: AT.ink }}>{G[id].title}</span>
            <span style={{ fontFamily: AT.body, fontSize: 12.5, lineHeight: 1.5, color: AT.inkSoft }}>{G[id].blurb}</span>
            <span style={{ fontFamily: AT.body, fontSize: 12.5, fontWeight: 700, color: AT.accent, marginTop: 2 }}>Open guide →</span>
          </button>
        ))}
      </div>
      <HNote tone="tip">See the <strong>Tasks</strong> groups in the left sidebar for the full set — Sell, Customers, Marketing and Content. Every screen also has a <strong>“?”</strong> button (top-right) with quick help for wherever you are.</HNote>
      <HHead>How the panel is organised</HHead>
      <HFuncs items={[
        ['dashboard', 'Left sidebar', 'Your map of the shop, grouped into Sell, Customers, Products, Marketing, Reports, Content and Admin. Collapse it with the chevron or the ☰ button to free up space.'],
        ['finance', 'Scope bar (top)', 'Picks which business and which country you are working in. Everything below it obeys that choice.'],
        ['list', 'Change log (bottom)', 'Every screen ends with a “Recent changes” panel so you can see what was edited there, and by whom.'],
        ['user', 'Account menu (top-right)', 'Switch role, jump to notifications, and sign out.'],
      ]} />
      <HNote tone="tip">New to your role? Read the four <strong>Concepts</strong> in the sidebar — they apply on every screen.</HNote>
    </div>
  );
}

function HelpTopic({ topic, go }) {
  const T = HELP_CONTENT[topic];
  if (!T) return null;
  return (
    <div>
      <HLead>{T.lead}</HLead>
      {T.blocks.map((b, i) => {
        if (b.h) return <HHead key={i}>{b.h}</HHead>;
        if (b.p) return <HP key={i}>{b.p}</HP>;
        if (b.funcs) return <HFuncs key={i} items={b.funcs} />;
        if (b.steps) return <HSteps key={i} items={b.steps} />;
        if (b.fields) return <HFields key={i} items={b.fields} />;
        if (b.note) return <HNote key={i} tone={b.tone}>{b.note}</HNote>;
        return null;
      })}
    </div>
  );
}

const HELP_CONTENT = {
  scope: {
    lead: 'One console runs several businesses, each selling into several countries. The scope bar at the top decides which “store” you are looking at — so the same screens work for every market without duplicating anything.',
    blocks: [
      { h: 'The two switchers' },
      { funcs: [
        ['finance', 'Business switcher (sidebar)', 'Pick which brand you are managing (e.g. shhh…, Lumen Care). Orders, customers and reports all narrow to that business.'],
        ['finance', 'Market switcher (top-right)', 'Pick a country (Latvia, Lithuania, Estonia…) or “All markets”. The context bar then shows that market’s currency, VAT rate, language and legal entity.'],
      ] },
      { h: 'All markets vs. one market' },
      { p: 'Choose a single country when you are doing day-to-day operations — fulfilling orders, adjusting stock — so you only see what belongs to that store. Choose “All markets” for reporting: the Dashboard and Analytics then combine every country, normalised to your base currency (EUR).' },
      { note: 'A planned market shows a “SOON” tag and a “Not live yet” badge in the context bar — useful for setting things up before launch.', tone: 'warn' },
      { h: 'Where you see the market' },
      { p: 'Order and customer lists carry a Market column so you always know which country a row belongs to, and you can filter by market. Money is shown in each order’s own currency.' },
    ],
  },
  filtering: {
    lead: 'Every list screen shares the same filtering toolkit, so once you learn it in Orders you know it everywhere.',
    blocks: [
      { funcs: [
        ['search', 'Search box', 'Free-text search across the most useful fields — order ref, customer, email, product name, code, and so on.'],
        ['dashboard', 'Single-select (Status, Type, Sort…)', 'A dropdown where you pick one value. Used for things that are mutually exclusive, like a sort order.'],
        ['plus', 'Multi-select (Courier, Brand, Tags…)', 'A checkbox dropdown for picking several values at once. A number badge shows how many are active; each option shows a count.'],
        ['orders', 'Date range', 'From / to dates to limit a list to a period.'],
        ['x', 'Clear filters', 'Appears only when something is active; resets every filter and search on that screen in one click.'],
      ] },
      { h: 'The result count' },
      { p: 'Each list shows an “X of Y” count — how many rows match versus the total. It updates live as you filter, so you always know how much you are hiding. Filters also stack on top of the global market scope.' },
      { note: 'Filters are per-screen and reset when you leave. Tell me if you’d like “saved views” — named filter presets you can pin as tabs (e.g. “Unfulfilled · DPD”).', tone: 'tip' },
    ],
  },
  changelog: {
    lead: 'The panel keeps a full audit trail of who changed what. You can see it two ways.',
    blocks: [
      { funcs: [
        ['list', 'Recent changes (bottom of every screen)', 'A compact log scoped to that section — e.g. Orders shows order changes, Catalog shows product edits. Collapsible, with a count and a “View full log” link.'],
        ['list', 'Activity log (full)', 'The complete, store-wide history. Reach it from the account menu or any “View full log” link.'],
      ] },
      { h: 'What gets recorded' },
      { p: 'Status changes, edits, stock adjustments, approvals, deletions and more — each with the person, the action, the target and a timestamp. This is your answer to “who changed this, and when?”.' },
      { note: 'Many actions are also undoable in the moment — look for Undo/Redo where edits happen.', tone: 'tip' },
    ],
  },
  account: {
    lead: 'The avatar menu at the top-right is your personal area and the security boundary of the panel.',
    blocks: [
      { funcs: [
        ['user', 'Switch role', 'Preview the panel as Owner, Support, Fulfilment or Content editor. Each role sees only the sections it needs — handy for setting up a teammate.'],
        ['bell', 'Notifications', 'A running list of things needing attention: orders to fulfil, payments, low stock, reviews and returns. Also on the header bell.'],
        ['settings', 'Personalization', 'Jumps to Settings, where store-wide preferences live.'],
        ['logout', 'Sign out', 'Ends the session and returns to the login screen. Sign back in with your email, password and role.'],
      ] },
      { h: 'Roles at a glance' },
      { fields: [
        ['Owner', 'Full access to every section and setting.'],
        ['Support', 'Orders, customers, reviews and returns — the help-desk view.'],
        ['Fulfilment', 'Orders, inventory and catalog — the warehouse view.'],
        ['Content editor', 'Marketing, content, brands, reviews and analytics — the storefront view.'],
      ] },
    ],
  },
  dashboard: {
    lead: 'Your shop at a glance. The Dashboard is fully customisable — every panel is a widget you can show, hide, reorder or drag into the layout that suits you.',
    blocks: [
      { h: 'Customising it' },
      { funcs: [
        ['grip', 'Drag handle', 'Hover a card and grab the grip (top-right) to drag it anywhere. A blue outline shows where it will land.'],
        ['x', 'Remove', 'The × on a card hover takes it off the dashboard.'],
        ['plus', 'Add widget', 'Lists everything you have hidden, with counts, to bring back.'],
        ['refund', 'Reset', 'Restores the default layout. Your arrangement is remembered across reloads.'],
      ] },
      { h: 'The widgets' },
      { fields: [
        ['Key metrics', 'Revenue, orders, average order, awaiting payment.'],
        ['Revenue chart', 'This week vs. last week.'],
        ['Orders & overview', 'Status breakdown plus monthly KPIs.'],
        ['Sales by channel', 'Where sales are attributed.'],
        ['Sales by market', 'Revenue split by country (great in “All markets”).'],
        ['Needs attention', 'Shortcuts to anything outstanding.'],
        ['Top sellers', 'Best-selling products right now.'],
      ] },
    ],
  },
  orders: {
    lead: 'The heart of the shop. Orders is a filterable list; click any row to open a detail drawer that handles fulfilment and money in one place.',
    blocks: [
      { h: 'The list' },
      { p: 'Filter by status, payment, type (shipping/pickup), courier, date and market, and sort by date or total. Each row shows its order ref, the invoice number beneath it, the market, customer, totals and status. Select rows with the checkboxes for bulk actions.' },
      { h: 'The detail drawer — four tabs' },
      { funcs: [
        ['orders', 'Items', 'What was ordered, the customer, and quick status actions (mark paid, fulfil, etc.).'],
        ['finance', 'Payment', 'Everything about the money: the invoice (net/VAT/total, download or send), the payment (gateway, transaction, capture state) and the payout batch those funds settle into. No need to leave the order.'],
        ['inventory', 'Delivery', 'Courier, pickup point or address, and tracking.'],
        ['content', 'Docs', 'Documents attached to the order.'],
      ] },
      { note: 'The Payment tab links straight to the settlement batch in Finances — and Finances links back to the order. The order is the single source of truth.', tone: 'tip' },
    ],
  },
  customers: {
    lead: 'A privacy-first CRM, derived from real order history so it always matches what people actually bought.',
    blocks: [
      { h: 'Finding people' },
      { p: 'Segment pills (VIP, repeat, new, marketing) sit above a filter row for market, tags, marketing-consent and sort (lifetime value, order count, most recent, name). Search covers name, alias, email and city.' },
      { h: 'The profile' },
      { funcs: [
        ['users', 'Order history & value', 'Every order, lifetime value and counts.'],
        ['promos', 'Tags', 'Label customers (VIP, repeat…) to build segments.'],
        ['content', 'Private notes', 'Internal notes that never reach the customer.'],
        ['returns', 'GDPR erase', 'Permanently anonymise a customer on request — the privacy-first angle of the shop.'],
      ] },
      { note: 'Export respects consent — only marketing-opted-in customers are included.', tone: 'warn' },
    ],
  },
  catalog: {
    lead: 'Your product list and per-product editor. Filter, sort and edit pricing and visibility.',
    blocks: [
      { funcs: [
        ['search', 'Filters', 'Category, brand (multi), stock status, and a “Show” filter for visible / hidden / on-sale products; sort by name, price or stock.'],
        ['catalog', 'List & grid views', 'Toggle between a dense table and visual tiles.'],
        ['promos', 'Per-product edit', 'Set price, sale (old) price, and hide/show a product on the storefront.'],
      ] },
      { note: 'Hiding a product keeps it in your catalog but removes it from the shop — better than deleting when something is temporarily unavailable.', tone: 'tip' },
    ],
  },
  inventory: {
    lead: 'A focused stock view across all products, with quick adjustments.',
    blocks: [
      { funcs: [
        ['inventory', 'Stock counters', 'See units per SKU and adjust up or down inline.'],
        ['search', 'Filters', 'Category, brand (multi), status (in / low / out) and sort by stock or name, plus search.'],
        ['bolt', 'Low / out summary', 'Stat cards highlight how many SKUs need reordering.'],
      ] },
      { note: 'Low-stock SKUs also raise the badge on the Inventory nav item and appear in Needs attention.', tone: 'warn' },
    ],
  },
  marketing: {
    lead: 'Growth tooling: discount codes, gift cards and campaigns — all consent-based.',
    blocks: [
      { h: 'Promos & gift cards' },
      { funcs: [
        ['promos', 'Discount codes', 'Create percent, fixed-amount or free-shipping codes; filter by type and status, search by code, and enable/disable.'],
        ['promos', 'Gift cards', 'Issue and track store-credit cards.'],
      ] },
      { h: 'Marketing' },
      { p: 'Plan campaigns and automations that only reach customers who opted in. Pairs with the marketing-consent filter in Customers.' },
    ],
  },
  reports: {
    lead: 'Two reporting screens with a clear division of labour.',
    blocks: [
      { funcs: [
        ['analytics', 'Analytics', 'Exploratory trends and conversion — how the shop is performing over time. Best viewed in “All markets”.'],
        ['finance', 'Finances', 'The money of record: invoices, payouts/settlements and VAT reports per country and legal entity.'],
      ] },
      { note: 'Revenue appears on the Dashboard (glanceable “now”), in Analytics (trends) and in Finances (accounting). Each has a distinct job, so the numbers are presented for a different purpose.', tone: 'tip' },
    ],
  },
  reviews: {
    lead: 'Two moderation queues that protect the storefront.',
    blocks: [
      { h: 'Reviews' },
      { p: 'Customer reviews wait here before publishing. Tabs split pending / approved / rejected; filter by rating, verified-buyer and product, or search the text. Approve to publish, reject to discard.' },
      { h: 'Returns & warranty' },
      { p: 'Claims with order-ownership verification. Filter by status (open/approved/closed), type (return/warranty), date and search; sort by date or refund amount. Approve or close each claim.' },
      { note: 'Pending reviews and open returns raise nav badges and show in Needs attention so nothing slips.', tone: 'warn' },
    ],
  },
  brands: {
    lead: 'The brand directory shown across the storefront.',
    blocks: [
      { funcs: [
        ['brands', 'Brand list', 'Search and sort (A–Z / Z–A); the count shows how many match.'],
        ['bolt', 'Featured toggle', 'Mark brands as featured to surface them on the storefront; filter to featured-only.'],
      ] },
    ],
  },
  settings: {
    lead: 'Store-wide configuration. Set it once; the rest of the panel and storefront follow.',
    blocks: [
      { fields: [
        ['Couriers & shipping', 'Delivery methods, zones and rates.'],
        ['Team', 'People and their roles.'],
        ['Tax', 'VAT handling per market.'],
        ['Discretion', 'The privacy/discreet-delivery options specific to this shop.'],
        ['Account', 'Your personal preferences.'],
      ] },
      { note: 'Settings is Owner-only. Other roles won’t see it in the sidebar.', tone: 'warn' },
    ],
  },
  content: {
    lead: 'The Content workspace (CMS) is where the whole storefront’s words and images live — pages, navigation, home blocks, every UI label, SEO and media — in five languages, with a live preview. It has its own left tree and a ⌘K search. Here is every part.',
    blocks: [
      { h: 'The workspace layout' },
      { funcs: [
        ['search', '⌘K search (top of tree)', 'Search across every page, UI string, product and brand and jump straight to it. Press ⌘K / Ctrl K anywhere in Content.'],
        ['content', 'Left tree', 'Switches between the seven areas below (Overview, Pages, Navigation, Home, Strings, Media, Global SEO).'],
        ['eye', 'Live preview', 'Toggles a side-by-side preview of the real storefront. Switch between Desktop and Mobile, refresh, or go fullscreen — so you see edits in context.'],
      ] },
      { h: '1 · Overview' },
      { p: 'The landing area: counts of total pages, how many you’ve edited, how many are missing a social-share image, and how many are untranslated. Each card is a shortcut. “Recently edited” lists your latest changes; “Quick actions” jumps to common jobs.' },
      { h: '2 · Pages' },
      { p: 'Every storefront page — guides, journal posts, brand pages, legal, trust and support. Filter by group (the pills), search, and sort by name. The table shows each page’s URL, group, which languages have been edited, and whether it’s Published or has CMS Edits. Click a row to open the editor.' },
      { p: 'The page editor has a language switcher (LV is the default; other languages fall back to LV if left blank) and three tabs:' },
      { funcs: [
        ['content', 'Content tab', 'Kicker/category, Title, Subtitle, an Intro paragraph, and repeatable Sections (heading + text) you can add, edit and remove. Some pages also render generated content (FAQ, reviews, tables or a form) noted inline.'],
        ['catalog', 'Media tab', 'The hero image (recommended 1600×900) and a card icon/emoji used in lists and tiles.'],
        ['settings', 'SEO tab', 'Per-page Title, Description, Keywords, Canonical URL, Robots (index / noindex), plus social-share: OG Title, OG Description, OG Image (1200×630) and Twitter card type.'],
      ] },
      { note: 'Per-page SEO overrides the site-wide defaults from Global SEO. Saving publishes instantly to both mobile and desktop storefronts.', tone: 'tip' },
      { h: '3 · Navigation & footer' },
      { p: 'A focused string editor for just the top-nav, mega-menu and footer labels, in all five languages. Edit inline; blue cells are ones you’ve overridden.' },
      { h: '4 · Home & blocks' },
      { p: 'The home page headings and the labels/CTAs for the featured, sale and trust blocks — again per language. For long-form text, use Pages instead.' },
      { h: '5 · All strings (i18n)' },
      { p: 'Every interface string across all five languages (LV, RU, EN, LT, EE) in one table. Search by key or text; edit any cell inline. Overridden cells are highlighted. This drives all the small words the storefront uses.' },
      { note: 'String changes apply to the storefront on reload. The table shows the first 120 matches — refine with search to find a specific key.', tone: 'warn' },
      { h: '6 · Media library' },
      { p: 'Upload images once and reuse them across pages, hero slots and social-share slots. Drag-and-drop or browse to upload; delete removes an image from the library (pages using it will lose it).' },
      { h: '7 · Global SEO & identity' },
      { p: 'Site-wide defaults and the organisation details injected on every page:' },
      { fields: [
        ['Defaults', 'Site name, base URL, default home title/description/keywords and the default social image.'],
        ['Organisation', 'Legal name, VAT number, email, phone and address — the Impressum / schema.org data.'],
      ] },
      { note: 'These are the fallbacks. Anything you set per-page (in Pages → SEO) wins over them.', tone: 'tip' },
      { h: 'A typical Content task' },
      { steps: [
        'Open Content and press ⌘K (or use Pages) to find the page you want.',
        'Pick the language with the switcher — start with LV, the default.',
        'Edit the Content tab, add a hero in Media, and fill the SEO tab.',
        'Turn on Live preview to check it on Desktop and Mobile.',
        'Save & publish — it’s live on both storefronts immediately.',
      ] },
    ],
  },
};

const linkBtn = { all: 'unset', cursor: 'pointer', color: AT.accent, fontWeight: 700 };

// ── Task-guide renderer (scenario: walkthrough + annotated steps) ──
function HelpGuide({ id, nav }) {
  const G = (window.GUIDES || {})[id];
  if (!G) return null;
  const roleNames = { owner: 'Owner', support: 'Support', fulfilment: 'Fulfilment', content: 'Marketing / Content' };
  return (
    <div>
      <HLead>{G.blurb}</HLead>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 24 }}>
        <span style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, alignSelf: 'center' }}>Most useful for:</span>
        {(G.roles || []).map(r => <ABadge key={r} tone="blue">{roleNames[r] || r}</ABadge>)}
      </div>
      {G.walkthrough && <Walkthrough steps={G.walkthrough} />}
      <HHead>Step by step</HHead>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {G.steps.map((s, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: s.img ? 12 : 0 }}>
              <span style={{ width: 26, height: 26, borderRadius: 999, background: AT.ink, color: '#fff', fontFamily: AT.mono, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
              <div style={{ fontFamily: AT.body, fontSize: 14, lineHeight: 1.55, color: AT.ink, paddingTop: 3, maxWidth: 720 }}>{s.do}</div>
            </div>
            {s.img && <div style={{ paddingLeft: 38 }}><Shot src={s.img} pins={s.pins || []} maxW={700} /></div>}
          </div>
        ))}
      </div>
      {(G.tips || []).map((t, i) => <HNote key={i} tone={t.tone}>{t.t}</HNote>)}
    </div>
  );
}

// ── Workspace shell (mirrors Content’s left-tree) ────────────
function AHelp({ ctx, params, nav }) {
  const tree = buildHelpTree();
  const flat = tree.flatMap(g => g.items);
  const initial = (params && params.topic && flat.some(i => i[0] === params.topic)) ? params.topic : 'start';
  const [topic, setTopic] = React.useState(initial);
  React.useEffect(() => { if (params && params.topic) setTopic(params.topic); }, [params && params.topic]);
  const go = (id) => { setTopic(id); try { document.querySelector('main')?.scrollTo(0, 0); } catch (e) {} };
  const idx = flat.findIndex(i => i[0] === topic);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;
  const cur = flat[idx] || flat[0];
  const isGuide = !!(window.GUIDES || {})[topic];

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', margin: -28 }}>
      {/* Left tree */}
      <div style={{ width: 234, flexShrink: 0, borderRight: `1px solid ${AT.rule}`, padding: '20px 14px', background: AT.panel, minHeight: 'calc(100vh - 89px)' }}>
        {tree.map((g, gi) => (
          <div key={gi} style={{ marginTop: gi ? 15 : 0 }}>
            {g.group && <div style={{ fontFamily: AT.body, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: AT.inkSoft, padding: '2px 11px 6px' }}>{g.group}</div>}
            {g.items.map(([id, label, icon]) => {
              const active = topic === id;
              return (
                <button key={id} onClick={() => go(id)} style={{ all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 11px', borderRadius: AT.radiusSm, marginBottom: 2, background: active ? AT.accentSoft : 'transparent', color: active ? AT.accent : AT.ink, fontFamily: AT.body, fontWeight: 600, fontSize: 13 }}>
                  <AIcon name={icon} size={16} color={active ? AT.accent : AT.inkSoft} /> <span style={{ flex: 1 }}>{label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Article */}
      <div style={{ flex: 1, minWidth: 0, padding: '28px 36px', maxWidth: 880 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: AT.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name={cur[2]} size={19} color="#fff" /></span>
          <div>
            <div style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft }}>{isGuide ? 'How-to guide' : 'User manual'}</div>
            <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 26, letterSpacing: AT.ld, color: AT.ink, lineHeight: 1.1 }}>{cur[1]}</div>
          </div>
        </div>

        {topic === 'start' ? <HelpStart go={go} /> : isGuide ? <HelpGuide id={topic} nav={nav} /> : <HelpTopic topic={topic} go={go} />}

        {/* Open the relevant screen for a guide */}
        {isGuide && (window.SCREEN_FOR_GUIDE || {}) && (() => {
          const cl = (window.CHECKLIST || []).find(c => c.topic === topic);
          const scr = cl && cl.screen;
          if (!scr || !nav) return null;
          return <button onClick={() => nav(scr)} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 8, padding: '10px 16px', borderRadius: AT.radiusSm, background: AT.accent, color: '#fff', fontFamily: AT.body, fontWeight: 700, fontSize: 13.5 }}>Try it now — open {scr.charAt(0).toUpperCase() + scr.slice(1)} <AIcon name="arrow" size={15} color="#fff" /></button>;
        })()}

        {/* Prev / next */}
        <div style={{ display: 'flex', gap: 12, marginTop: 36, paddingTop: 20, borderTop: `1px solid ${AT.rule}`, maxWidth: 760 }}>
          {prev && (
            <button onClick={() => go(prev[0])} style={navCard}>
              <span style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>← Previous</span>
              <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink }}>{prev[1]}</span>
            </button>
          )}
          {next && (
            <button onClick={() => go(next[0])} style={{ ...navCard, textAlign: 'right', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft }}>Next →</span>
              <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: AT.ink }}>{next[1]}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const navCard = { all: 'unset', cursor: 'pointer', flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 4, padding: '13px 16px', borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel };

Object.assign(window, { AHelp });
