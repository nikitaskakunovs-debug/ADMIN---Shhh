// shop-brands.jsx — brand directory: all brands, per-brand pages, and an
// "all brands" index page with a search bar. Linked from footer "Visi zīmoli".

// Full brand catalogue. ids are slugified from the display name.
const BRAND_NAMES = [
  'Abierta Fina','Adrien Lastic','Alive','All Black','Allure Art','Allure Lingerie','Amoreane','Amour','Andromedical','Aneros','Arcwave','Avant','Axami','BLOWCAST','Bad Kitty',"Ballerina's Secret",'Bathmate','Beasty Cocks','Beau Coeur','Bedroom Fantasies','Beppy','Big Boy','Biird','Bijoux Indiscrets','Black Level','Black Secret','Black Velvets','Blitz Blank','Blush','Bodygliss','Bodywand','Bondage by Cottelli','Boners','Bull Power','Bye Bra','CP','CalExotics','Ceylor','Chilirose','Christine','Cleopatra','Clone-A-Willy','Cloneboy','Cock Miller','CockBlock','Colorful Joy','Colt','Control','Coquette','Coquette Lingerie','Cottelli Lingerie','Couples Choice','Crave','Creamy','Creature Cocks','Crushious','Crystal Clear','Cyber Silicock','Dame Products','Daring Intimates','Darkness','Delta Club','Divatā','Doc Johnson','Dorcel','Doxy','Dreamgirl','Dreamtoys','Durex','ESOTIQ','EXS','EasyToys','Easyglide','Emilija Nagoska.','Epic Cybersilicock','Ero','Eros-Art','Europe Magic Wand','Evolved','Eye Of Love','Fantasy For Her','Fantasy Lingerie','Fantasy by Cottelli','FemmeFunn','Fetish Collection','Fetish Fantasy Series','Fetish Pad','Fever','Fifty Shades of Grey','Fisting Gel','Fleshlight','Flutschi','Forplay','Fröhle','Fuck & Fist','Fun Factory','GLYDE','Gender X','Glam','Guilty Pleasure','HEL Milano','HOT','Hi-Watt','Hidden Desire','HighOnLove','INTOYOU','INYA','Icicles','Intense','Intimichic','Intimina','J-Lube','JO','Jamyjob','Javida','JoyDivision','Joyful Couple','Just Glide','KOKOS','Karmīns (Helmuts Bēķis).','Kheper Games','Kiiroo','Kinky Diva','Kotek','LELO','LIEBE SEELE','Late X','Latvian StuffBook','Le Désir','Le Wand','Leg Avenue',"Let's Play",'Levelz','Liberator','Liquid Silk','Little Genie','LivCo Corsetti','Love Magic','Love Signal','Love to Love','LoveToy','Loveboxxx','Loveline','Lovense','LuxuriA','MANWAN','MIXGLISS','MOB','MY.SIZE','MYLOME','MadWish','Magic Motion','Magoon','Male','Male Edge','Male Power','ManCage','Mapale','Master Series','Masturs','Mister B','Mister Size','Mr. Steel','Mystim','Mythical Mates','Mythology','NEK','NMC','NO:XQSE','NS Novelties','NUEI','Naked Addiction','Nature Skin','Nexus','No-Parts','Noir Handmade','OTOUCH','OV','Obsessive','Ohnut','OpenMity','Orgie','Ormelle','Ouch!','Oxballs','Pasante','Passion','Perfect Fit','Perifit','Phero','PheroStrong','Pillow Talk','Pipedream','Playboy Pleasure','Playhouse','Pleaser','Power Monsters','Pretty Love','Private','Rainbow Pride','Real Fantasy','RealRock','Realistixxx','Rebel','Rene Rofe','Rocks-Off','Romp','Rosy Gold','Ruf Erotic','S&M','S8','SEXYSTYLE','SHAFT','SILEXD','SKYN','SVibe','Satisfyer',"Schag's",'Secret Play','Sensuva','Sextreme','She.E.O.','Shiatsu','Shots Steel','Shots Toys','Shunga','Smile','Sportsheets','Stercup','Strap On Me','Stud','Subblime','Svakom','Svenjoyment','Swan','Swede','Swiss Navy','TOYJOY','Taboo','Taboom','Tantras Love Oil','Tease & Please','Teazers','Temptations','Tenga','Thalia.Hel.fire','Trinity Vibes','ULUV','UNIGLOVES','VARTA','Vegan Fetish','Vibe Therapy','We-Vibe','Wicked','Womanizer','Wooomy','XREAL','Xocoon','YESforLOV','You2Toys','Zado','Zalo','Zero Tolerance','intt','kGOAL','kissable','love. not war.','pjur','überlube',
];

function _brandSlug(name) {
  return name.toLowerCase()
    .replace(/[āàá]/g, 'a').replace(/[ēèé]/g, 'e').replace(/[īìí]/g, 'i')
    .replace(/[ōòó]/g, 'o').replace(/[ūùú]/g, 'u').replace(/[ļ]/g, 'l')
    .replace(/[ņ]/g, 'n').replace(/[šś]/g, 's').replace(/[žź]/g, 'z')
    .replace(/[čć]/g, 'c').replace(/[ģ]/g, 'g').replace(/[ķ]/g, 'k')
    .replace(/&/g, ' un ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const BRANDS = BRAND_NAMES.map(name => ({
  id: _brandSlug(name),
  name,
  origin: '',
  tag: 'Intīmpreces un aksesuāri',
  cats: [],
})).filter((b, i, a) => b.id && a.findIndex(x => x.id === b.id) === i);

// Real knowledge for well-known brands: { cat, origin, note }.
// Used to generate accurate, unique copy. Brands not listed get richer
// generic copy without fabricated specifics.
const BRAND_INFO = {
  'satisfyer':      { cat: 'Gaisa plūsmas stimulatori', origin: 'Vācija', note: 'pasaulslavena ar pieejamiem gaisa plūsmas (Air Pulse) klitora stimulatoriem un lietotnes vadību' },
  'lelo':           { cat: 'Premium vibratori', origin: 'Zviedrija', note: 'luksusa zīmols ar izsmalcinātu dizainu, kvalitatīviem materiāliem un ilgu garantiju' },
  'we-vibe':        { cat: 'Pāru rotaļlietas', origin: 'Kanāda', note: 'pazīstama ar valkājamiem pāru vibratoriem un attālinātu lietotnes vadību' },
  'womanizer':      { cat: 'Klitora stimulatori', origin: 'Vācija', note: 'Pleasure Air tehnoloģijas pionieris bezkontakta klitora stimulācijai' },
  'durex':          { cat: 'Prezervatīvi', origin: 'Lielbritānija', note: 'viens no pasaulē atpazīstamākajiem prezervatīvu un lubrikantu zīmoliem' },
  'tenga':          { cat: 'Masturbatori', origin: 'Japāna', note: 'japāņu dizaina masturbatori un Egg sērija ar minimālistisku estētiku' },
  'fleshlight':     { cat: 'Masturbatori', origin: 'ASV', note: 'pasaulē pazīstamākais vīriešu masturbatoru zīmols ar reālistisku SuperSkin materiālu' },
  'fun-factory':    { cat: 'Vibratori', origin: 'Vācija', note: 'vācu ražojums ar krāsainu dizainu un ķermenim drošu silikonu' },
  'lovense':        { cat: 'Viedās rotaļlietas', origin: 'ASV', note: 'attālināti vadāmas, interneta savienojuma rotaļlietas ilgattiecībām' },
  'dorcel':         { cat: 'Premium rotaļlietas', origin: 'Francija', note: 'franču zīmols ar elegantu dizainu un jaudīgiem motoriem' },
  'pipedream':      { cat: 'Plašs sortiments', origin: 'ASV', note: 'viens no lielākajiem pieaugušo preču ražotājiem ar plašu klāstu' },
  'doc-johnson':    { cat: 'Dildo un masturbatori', origin: 'ASV', note: 'ASV ražojums ar plašu reālistisku produktu klāstu' },
  'we-vibe':        { cat: 'Pāru rotaļlietas', origin: 'Kanāda', note: 'valkājami pāru vibratori ar lietotnes vadību' },
  'svakom':         { cat: 'Viedie vibratori', origin: 'ASV', note: 'inovatīvas rotaļlietas ar kameru un sildīšanas funkcijām' },
  'kiiroo':         { cat: 'Interaktīvās rotaļlietas', origin: 'Nīderlande', note: 'interaktīvas, sinhronizējamas rotaļlietas ilgattiecībām' },
  'zalo':           { cat: 'Luksusa vibratori', origin: 'Ķīna', note: 'rotaslietu iedvesmots luksusa dizains' },
  'nexus':          { cat: 'Prostatas stimulatori', origin: 'Lielbritānija', note: 'specializējas prostatas masāžas ierīcēs' },
  'arcwave':        { cat: 'Vīriešu stimulatori', origin: 'Vācija', note: 'Womanizer Pleasure Air tehnoloģija vīriešiem' },
  'pjur':           { cat: 'Lubrikanti', origin: 'Vācija', note: 'augstas kvalitātes vācu lubrikanti un kopšanas līdzekļi' },
  'shunga':         { cat: 'Erotiskā kosmētika', origin: 'Kanāda', note: 'masāžas eļļas, lubrikanti un erotiskā kosmētika' },
  'bijoux-indiscrets': { cat: 'Erotiskie aksesuāri', origin: 'Spānija', note: 'eleganti erotiskie aksesuāri un kosmētika' },
  'fifty-shades-of-grey': { cat: 'BDSM komplekti', origin: 'Lielbritānija', note: 'oficiālā grāmatu un filmu sērijas kolekcija' },
  'le-wand':        { cat: 'Masāžas nūjas', origin: 'ASV', note: 'premium masāžas nūjas ar spēcīgu motoru' },
  'doxy':           { cat: 'Masāžas nūjas', origin: 'Lielbritānija', note: 'vienas no jaudīgākajām masāžas nūjām tirgū' },
  'intimina':       { cat: 'Sieviešu veselība', origin: 'Zviedrija', note: 'menstruālās kausiņi, Kegela bumbiņas un intīmā veselība' },
  'skyn':           { cat: 'Prezervatīvi', origin: 'ASV', note: 'bezlateksa poliizoprēna prezervatīvi' },
  'exs':            { cat: 'Prezervatīvi', origin: 'Lielbritānija', note: 'plašs prezervatīvu klāsts par pieejamu cenu' },
  'pasante':        { cat: 'Prezervatīvi', origin: 'Lielbritānija', note: 'sertificēti prezervatīvi visām vajadzībām' },
  'my-size':        { cat: 'Prezervatīvi', origin: 'Vācija', note: 'izmēram pielāgoti prezervatīvi labākai komfortam' },
  'mister-size':    { cat: 'Prezervatīvi', origin: 'Vācija', note: 'precīzu izmēru prezervatīvi' },
  'tantras-love-oil':{ cat: 'Masāžas eļļas', origin: 'Eiropa', note: 'tantriskās masāžas eļļas' },
  'magic-motion':   { cat: 'Viedās rotaļlietas', origin: 'Ķīna', note: 'lietotnes vadāmas rotaļlietas' },
  'oxballs':        { cat: 'Vīriešu aksesuāri', origin: 'ASV', note: 'erekcijas gredzeni un fetiša aksesuāri no izturīga materiāla' },
  'sportsheets':    { cat: 'BDSM un sasaiste', origin: 'ASV', note: 'sasaistes sistēmas un BDSM aksesuāri' },
  'strap-on-me':    { cat: 'Strap-on rotaļlietas', origin: 'Francija', note: 'augstas kvalitātes strap-on un dildo' },
  'crave':          { cat: 'Dizaina vibratori', origin: 'ASV', note: 'rotaslietu kvalitātes dizaina vibratori' },
  'dame-products':  { cat: 'Sieviešu vibratori', origin: 'ASV', note: 'sieviešu veidots zīmols ar ergonomisku dizainu' },
  'rocks-off':      { cat: 'Vibratori', origin: 'Lielbritānija', note: 'plašs pieejamu vibratoru klāsts' },
  'blush':          { cat: 'Plašs sortiments', origin: 'ASV', note: 'ķermenim droši produkti visām vajadzībām' },
  'calexotics':     { cat: 'Plašs sortiments', origin: 'ASV', note: 'viens no lielākajiem ASV ražotājiem' },
  'evolved':        { cat: 'Uzlādējami vibratori', origin: 'ASV', note: 'uzlādējamas rotaļlietas ar daudziem režīmiem' },
  'leg-avenue':     { cat: 'Erotiskā veļa', origin: 'ASV', note: 'plašs erotiskās veļas un kostīmu klāsts' },
  'obsessive':      { cat: 'Erotiskā veļa', origin: 'Polija', note: 'eleganta erotiskā veļa' },
  'cottelli-lingerie':{ cat: 'Erotiskā veļa', origin: 'Vācija', note: 'erotiskā veļa un kostīmi' },
  'coquette':       { cat: 'Erotiskā veļa', origin: 'Kanāda', note: 'kvalitatīva erotiskā veļa' },
  'beppy':          { cat: 'Sieviešu higiēna', origin: 'Nīderlande', note: 'mīkstie tamponi intīmiem brīžiem' },
  'bathmate':       { cat: 'Vīriešu sūkņi', origin: 'Lielbritānija', note: 'hidro sūkņi vīriešiem' },
  'aneros':         { cat: 'Prostatas stimulatori', origin: 'ASV', note: 'hands-free prostatas stimulatori' },
  'liberator':      { cat: 'Seksa mēbeles', origin: 'ASV', note: 'pozīciju spilveni un seksa mēbeles' },
  'mystim':         { cat: 'Elektrostimulācija', origin: 'Vācija', note: 'elektrostimulācijas (e-stim) ierīces' },
  'kheper-games':   { cat: 'Erotiskās spēles', origin: 'ASV', note: 'galda un pāru erotiskās spēles' },
  'eye-of-love':    { cat: 'Feromoni', origin: 'Nīderlande', note: 'feromonu smaržas un kosmētika' },
};
function brandSections(b) {
  const info = (typeof BRAND_INFO !== 'undefined' && BRAND_INFO[b.id]) || null;
  if (info) {
    return [
      ['Par zīmolu', `${b.name} ir ${info.origin} izcelsmes zīmols, kas ${info.note}. Kategorija: ${info.cat}. Visi ${b.name} produkti, ko piedāvājam, ir oriģināli, ķermenim droši un atbilst ES drošības standartiem.`],
      ['Kāpēc izvēlēties ' + b.name, `${b.name} produkti izceļas ar uzticamu kvalitāti un izturību. Mēs piedāvājam tikai oriģinālus ${info.cat.toLowerCase()} ar ražotāja garantiju. Katrs produkts pirms nosūtīšanas tiek pārbaudīts.`],
      ['Piegāde un privātums', `Visi ${b.name} pasūtījumi pienāk vienkāršā kastē bez logo, ar anonīmu sūtītāju "NL Trading Co". Piegāde Baltijā 24h, anonīms maksājums (Apple Pay, Google Pay, Citadele, Swedbank, SEB, Luminor), bezmaksas atgriešana 30 dienu laikā.`],
    ];
  }
  return [
    ['Par zīmolu', `${b.name} ir zīmols, kura produkti pieejami mūsu veikalā. Mēs piedāvājam tikai oriģinālus ${b.name} produktus — ķermenim drošus, kvalitatīvus un atbilstošus ES drošības standartiem.`],
    ['Kvalitāte un garantija', `${b.name} produktiem ir ražotāja garantija. Medicīniskas klases materiāli, neporaina virsma, viegli tīrāmi. Mēs nepārdodam viltojumus — tikai autentiskus produktus.`],
    ['Piegāde un privātums', `Visi ${b.name} pasūtījumi pienāk vienkāršā kastē bez logo, ar anonīmu sūtītāju "NL Trading Co". Piegāde Baltijā 24h, anonīms maksājums, bezmaksas atgriešana 30 dienu laikā.`],
  ];
}

// Register every brand as a content page: key = "brand-<id>".
(function registerBrandPages() {
  if (typeof window === 'undefined' || !window.CONTENT_PAGES) return;
  BRANDS.forEach(b => {
    const info = (typeof BRAND_INFO !== 'undefined' && BRAND_INFO[b.id]) || null;
    window.CONTENT_PAGES['brand-' + b.id] = {
      kicker: 'Zīmols', title: b.name,
      sub: info ? `${info.cat} · ${info.origin}` : 'Intīmpreces un aksesuāri',
      sections: brandSections(b),
      brandId: b.id,
      brandCat: info ? info.cat : null,
    };
  });
  // The index page.
  window.CONTENT_PAGES['brands-all'] = {
    kicker: 'Zīmoli', title: 'Visi zīmoli',
    sub: 'Visi mūsu zīmoli vienuviet. Meklē pēc nosaukuma, valsts vai kategorijas.',
    isBrandsIndex: true,
  };
})();

// ─────────────────────────────────────────────────────────────
// BrandsIndexScreen — searchable grid of all brands
// ─────────────────────────────────────────────────────────────
function BrandsIndexScreen({ theme, nav }) {
  const [q, setQ] = React.useState('');
  const query = q.trim().toLowerCase();
  const list = BRANDS.filter(b =>
    !query || b.name.toLowerCase().includes(query)
  ).sort((a, b) => a.name.localeCompare(b.name, 'lv'));

  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 12, color: theme.inkSoft,
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14,
        }}>
          <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>Sākums</button>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: theme.ink, fontWeight: 600 }}>Visi zīmoli</span>
        </div>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.accent, marginBottom: 10,
        }}>Zīmoli</div>
        <h1 style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 38,
          letterSpacing: theme.letterDisplay, lineHeight: 0.95,
          color: theme.ink, margin: '0 0 6px',
        }}>Visi zīmoli</h1>
        <p style={{
          fontFamily: theme.body, fontSize: 14, color: theme.inkSoft,
          lineHeight: 1.5, margin: '0 0 16px',
        }}>{BRANDS.length} zīmoli. Meklē pēc nosaukuma.</p>
      </div>

      {/* Search bar */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          height: 46, borderRadius: theme.radiusPill, background: theme.surfaceAlt,
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
          border: `1px solid ${theme.rule}`,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke={theme.inkSoft} strokeWidth="1.6" />
            <path d="M16.5 16.5L21 21" stroke={theme.inkSoft} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Meklēt zīmolu…"
            style={{
              flex: 1, minWidth: 0, background: 'transparent', border: 'none',
              fontFamily: theme.body, fontSize: 15, color: theme.ink, outline: 'none',
            }} />
          {q && (
            <button onClick={() => setQ('')} aria-label="Notīrīt" style={{
              all: 'unset', cursor: 'pointer', width: 22, height: 22, borderRadius: 999,
              background: theme.ink, color: theme.bg,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11,
            }}>✕</button>
          )}
        </div>
        <div style={{
          fontFamily: theme.mono, fontSize: 11, color: theme.inkSoft,
          marginTop: 8, paddingLeft: 4,
        }}>{list.length} no {BRANDS.length}</div>
      </div>

      {/* Alphabetical list */}
      {list.length === 0 ? (
        <div style={{
          margin: '0 20px', padding: 28, textAlign: 'center',
          borderRadius: theme.radius, border: `1.5px dashed ${theme.rule}`,
          fontFamily: theme.body, fontSize: 14, color: theme.inkSoft,
        }}>
          Nav atrasts neviens zīmols pēc “{q}”.
        </div>
      ) : (
        <div style={{ padding: '0 20px' }}>
          {(() => {
            const groups = {};
            list.forEach(b => {
              const ch = b.name[0].toUpperCase();
              const letter = /[A-ZĀČĒĢĪĶĻŅŠŪŽ]/.test(ch) ? ch : '#';
              (groups[letter] = groups[letter] || []).push(b);
            });
            return Object.keys(groups).sort().map(letter => (
              <div key={letter} style={{ marginBottom: 4 }}>
                <div style={{
                  position: 'sticky', top: 0, zIndex: 1,
                  background: theme.bg, padding: '8px 0 6px',
                  fontFamily: theme.display, fontWeight: 700, fontSize: 16,
                  letterSpacing: theme.letterDisplay, color: theme.accent,
                }}>{letter}</div>
                {groups[letter].map(b => (
                  <button key={b.id} onClick={() => nav('content', { key: 'brand-' + b.id })} style={{
                    all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 4px', borderBottom: `1px solid ${theme.rule}`,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                      background: theme.surfaceAlt,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: theme.display, fontWeight: 800, fontSize: 15,
                      color: theme.ink,
                    }}>{b.name[0].toUpperCase()}</div>
                    <span style={{
                      flex: 1, fontFamily: theme.body, fontSize: 15, fontWeight: 600,
                      color: theme.ink,
                    }}>{b.name}</span>
                    <span style={{ color: theme.inkSoft, fontSize: 16 }}>›</span>
                  </button>
                ))}
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { BRANDS, BrandsIndexScreen, PopularBrandsBlock });

// ─────────────────────────────────────────────────────────────
// PopularBrandsBlock — horizontal-scroll row of popular brand chips
// ─────────────────────────────────────────────────────────────
function PopularBrandsBlock({ theme, nav }) {
  const popularIds = ['satisfyer', 'lelo', 'we-vibe', 'womanizer', 'durex'];
  const pop = popularIds.map(id => BRANDS.find(b => b.id === id)).filter(Boolean);
  if (pop.length === 0) return null;

  // Brand-styled wordmark (colour + weight approximations of each logo).
  const logoFor = (id, name) => {
    const map = {
      'satisfyer': { c: '#E6007E', ls: '-0.5px', w: 800 },
      'lelo':      { c: '#1A1A1A', ls: '2px', w: 800 },
      'we-vibe':   { c: '#00A4B4', ls: '-0.3px', w: 800 },
      'womanizer': { c: '#7A1FA2', ls: '-0.3px', w: 800 },
      'durex':     { c: '#0033A0', ls: '-0.4px', w: 900 },
    };
    const s = map[id] || { c: theme.ink, ls: '0', w: 800 };
    return (
      <span style={{
        fontFamily: theme.display, fontWeight: s.w, fontSize: 19,
        color: s.c, letterSpacing: s.ls, lineHeight: 1, textAlign: 'center',
      }}>{name}</span>
    );
  };

  return (
    <div style={{ padding: '0 20px 8px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
      }}>
        <div style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 26,
          color: theme.ink, letterSpacing: theme.letterDisplay,
        }}>Populārākie zīmoli</div>
      </div>
      <div style={{
        fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, marginBottom: 14,
      }}>270+ zīmoli · oriģinālprodukti ar garantiju</div>

      {/* 2-row grid: 3 on top, 2 + CTA on bottom */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
      }}>
        {pop.map(b => (
          <button key={b.id} onClick={() => nav('content', { key: 'brand-' + b.id })} style={{
            all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
            height: 76, borderRadius: 14, background: theme.surface,
            border: `1px solid ${theme.rule}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px',
          }}>{logoFor(b.id, b.name)}</button>
        ))}
        {/* CTA → search page */}
        <button onClick={() => nav('search')} style={{
          all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
          height: 76, borderRadius: 14, background: theme.ink, color: theme.bg,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <Icon name="search" size={20} color={theme.bg} />
          <span style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700 }}>Meklēt</span>
        </button>
      </div>
    </div>
  );
}
