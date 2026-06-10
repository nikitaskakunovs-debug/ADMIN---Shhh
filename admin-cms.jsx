// admin-cms.jsx — Content workspace: left-tree IA, Overview (needs attention),
// ⌘K command search, Pages editor (Content/Media/SEO + language switcher),
// Strings (i18n), Global SEO, and a Media library — with a live preview pane.
// Everything persists to 'shhh_cms_v1' and flows to mobile + desktop.

const CMS_LANGS = [['lv', 'LV'], ['ru', 'RU'], ['en', 'EN'], ['lt', 'LT'], ['et', 'EE']];

function cmsPageGroup(k, p) {
  if (k.startsWith('journal')) return 'Journal';
  if (k.startsWith('guide') || k === 'size-material' || k === 'glossary') return 'Guides';
  if (k.startsWith('brand-')) return 'Brand pages';
  if (['accessibility', 'gdpr', 'terms', 'privacy', 'cookies', 'returns'].includes(k) || (p.kicker || '').toLowerCase().includes('juridisk')) return 'Legal';
  const head = (p.kicker || '').split(' · ')[0];
  if (['Trust', 'Support'].includes(head)) return head;
  return head || 'Other';
}
function cmsPageUrl(k) {
  if (k.startsWith('brand-')) return '/zimoli/' + k.replace('brand-', '');
  if (k.startsWith('journal')) return '/info/zurnals/' + k.replace('journal-', '');
  return '/info/' + k;
}

// Curated UI string keys the storefront references (so they appear even if not
// yet in LANG_STRINGS). Grouped for the Navigation/Home curated views.
const STRING_SEED = {
  'nav.shop': 'Veikals', 'nav.brands': 'Zīmoli', 'nav.match': 'Match', 'nav.howItShips': 'How it ships',
  'nav.search': 'Search the catalogue…', 'home.shopAll': 'Viss katalogs',
  'home.featured': 'Featured 🌶️', 'home.seeAll': 'See all', 'home.trustKicker': 'Discretion, end to end',
  'home.trustTitle': 'How it stays a secret. 🤫', 'browse.title': 'Browse 🍒',
  'cart.title': 'Your bag 🛍️', 'cart.checkout': 'Check out', 'footer.shop': 'Veikals',
  'footer.trust': 'Uzticība', 'footer.support': 'Atbalsts', 'footer.company': 'Company',
};
function stringGroup(k) { return (k.split('.')[0] || 'other'); }

const taStyle = { ...aInputStyle, width: '100%', height: 'auto', minHeight: 80, padding: 12, lineHeight: 1.5, resize: 'vertical' };

// ── Image dropzone (stores a data URL) ───────────────────────
function AImageDrop({ value, onChange, hint, ratio = '16 / 9', mediaPick }) {
  const inputRef = React.useRef(null);
  const [drag, setDrag] = React.useState(false);
  const read = (file) => { if (!file) return; const r = new FileReader(); r.onload = () => onChange(r.result); r.readAsDataURL(file); };
  return (
    <div>
      {value ? (
        <div style={{ position: 'relative', borderRadius: AT.radiusSm, overflow: 'hidden', border: `1px solid ${AT.rule}` }}>
          <img src={value} alt="" style={{ display: 'block', width: '100%', aspectRatio: ratio, objectFit: 'cover', background: AT.surfaceAlt }} />
          <button onClick={() => onChange('')} style={{ all: 'unset', cursor: 'pointer', position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 999, background: 'rgba(10,10,10,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AIcon name="x" size={16} color="#fff" /></button>
        </div>
      ) : (
        <div onClick={() => inputRef.current && inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files[0]); }}
          style={{ cursor: 'pointer', borderRadius: AT.radiusSm, border: `1.5px dashed ${drag ? AT.accent : AT.rule}`, background: drag ? AT.accentSoft : AT.surfaceAlt, padding: '26px 16px', textAlign: 'center', fontFamily: AT.body, fontSize: 13, color: AT.inkSoft }}>
          Ievelciet savu failu vai <span style={{ color: AT.accent, fontWeight: 700 }}>pārlūkojiet šeit</span>
          {mediaPick && <div style={{ marginTop: 8 }}><button onClick={(e) => { e.stopPropagation(); mediaPick(); }} style={{ all: 'unset', cursor: 'pointer', color: AT.accent, fontWeight: 700, fontSize: 12.5 }}>or choose from Media library →</button></div>}
        </div>
      )}
      {hint && <div style={{ fontFamily: AT.body, fontSize: 11.5, color: AT.inkSoft, marginTop: 6 }}>{hint}</div>}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => read(e.target.files[0])} />
    </div>
  );
}

function SeoField({ label, k, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: AT.body, fontSize: 13, fontWeight: 700, color: AT.ink, marginBottom: 7 }}>{label}</div>
      {children}
      <div style={{ fontFamily: AT.mono, fontSize: 11.5, color: AT.accent, marginTop: 6 }}>{k}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// PAGES (list + per-page editor)
// ════════════════════════════════════════════════════════════
function CmsPages({ ctx, openSignal }) {
  const { toast, saveCms, cms } = ctx;
  const pages = window.CONTENT_PAGES || {};
  const journalIdx = window.JOURNAL_INDEX || [];
  const [q, setQ] = React.useState('');
  const [group, setGroup] = React.useState('All');
  const [sortDir, setSortDir] = React.useState('az');
  const [openKey, setOpenKey] = React.useState(null);
  const [lang, setLang] = React.useState('lv');
  const [tab, setTab] = React.useState('content');
  const [data, setData] = React.useState(null);

  React.useEffect(() => { if (openSignal && openSignal.key) openEditor(openSignal.key); }, [openSignal]);

  const allEntries = Object.entries(pages);
  const groupList = ['All', ...Array.from(new Set(allEntries.map(([k, p]) => cmsPageGroup(k, p)))).sort((a, b) => {
    const order = ['Trust', 'Support', 'Guides', 'Journal', 'Legal', 'Brand pages', 'Other'];
    return (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99);
  })];
  let entries = allEntries.filter(([k, p]) => {
    if (group !== 'All' && cmsPageGroup(k, p) !== group) return false;
    if (q) { const s = q.toLowerCase(); return (p.title || '').toLowerCase().includes(s) || k.includes(s) || (p.sub || '').toLowerCase().includes(s); }
    return true;
  });
  entries.sort((a, b) => { const an = (a[1].title || a[0]).toLowerCase(), bn = (b[1].title || b[0]).toLowerCase(); return sortDir === 'az' ? an.localeCompare(bn) : bn.localeCompare(an); });

  function openEditor(k) {
    const cur = cms[k] || {}; const bp = pages[k] || {}; const init = {};
    CMS_LANGS.forEach(([l]) => {
      const o = cur[l] || {}; const isLv = l === 'lv';
      init[l] = {
        kicker: o.kicker !== undefined ? o.kicker : (isLv ? (bp.kicker || '') : ''),
        title: o.title !== undefined ? o.title : (isLv ? (bp.title || '') : ''),
        sub: o.sub !== undefined ? o.sub : (isLv ? (bp.sub || '') : ''),
        intro: o.intro !== undefined ? o.intro : (isLv ? (bp.intro || '') : ''),
        sections: o.sections !== undefined ? o.sections : (isLv ? (bp.sections || []).map(s => Array.isArray(s) ? [s[0], s[1]] : [s.title || '', s.body || '']) : []),
        heroImage: o.heroImage || '', icon: o.icon || '',
        seo: Object.assign({ title: '', description: '', keywords: '', canonical: 'https://shhh.lv' + cmsPageUrl(k), robots: 'index', ogTitle: '', ogDescription: '', ogImage: '', twitterCard: 'summary_large_image' }, isLv ? { title: bp.title || '', description: bp.sub || '' } : {}, o.seo || {}),
      };
    });
    setData(init); setLang('lv'); setTab('content'); setOpenKey(k);
  }
  const d = data && data[lang];
  const setF = (f, v) => setData(prev => ({ ...prev, [lang]: { ...prev[lang], [f]: v } }));
  const setSeo = (f, v) => setData(prev => ({ ...prev, [lang]: { ...prev[lang], seo: { ...prev[lang].seo, [f]: v } } }));
  const editedLang = (dd, l) => { const o = dd && dd[l]; if (!o) return false; return !!(o.title || o.sub || o.intro || (o.sections && o.sections.length) || o.heroImage || o.icon || (o.seo && (o.seo.keywords || o.seo.ogImage || o.seo.ogTitle))); };
  const editedLangs = (k) => CMS_LANGS.map(([l]) => l).filter(l => cms[k] && cms[k][l] && editedLang(cms[k], l));
  const save = () => { saveCms(openKey, data); toast('Saved — live on mobile + desktop'); setOpenKey(null); };

  const p = openKey ? pages[openKey] : null;
  const special = p && (p.isFaq || p.isReviews || p.isUsage || p.isIndex || p.isOrderLookup || p.isBrandsIndex || p.table || p.clothingTable || p.formKind);
  const tabBtn = (id, label) => <button onClick={() => setTab(id)} style={{ all: 'unset', cursor: 'pointer', padding: '10px 4px', marginRight: 22, fontFamily: AT.body, fontWeight: 700, fontSize: 14, color: tab === id ? AT.ink : AT.inkSoft, borderBottom: tab === id ? `2px solid ${AT.ink}` : '2px solid transparent' }}>{label}</button>;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        {groupList.map(g => {
          const active = group === g; const n = g === 'All' ? allEntries.length : allEntries.filter(([k, pp]) => cmsPageGroup(k, pp) === g).length;
          return <button key={g} onClick={() => setGroup(g)} style={{ all: 'unset', cursor: 'pointer', padding: '6px 12px', borderRadius: 999, background: active ? AT.ink : AT.panel, color: active ? '#fff' : AT.ink, border: `1px solid ${active ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12 }}>{g} <span style={{ opacity: 0.6, fontFamily: AT.mono, fontSize: 10.5, marginLeft: 3 }}>{n}</span></button>;
        })}
        <div style={{ flex: 1 }} />
        <ASearch value={q} onChange={setQ} placeholder="Filter pages…" />
      </div>
      <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginBottom: 12 }}>{entries.length} of {allEntries.length} pages · {journalIdx.length} journal posts · sorted by name</div>
      <ATable columns={[
        { label: <button onClick={() => setSortDir(s => s === 'az' ? 'za' : 'az')} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Page name {sortDir === 'az' ? '↓' : '↑'}</button> },
        { label: 'URL' }, { label: 'Group' }, { label: 'Languages' }, { label: 'Status' }, { label: '', align: 'right' }]}>
        {entries.map(([k, pg]) => { const els = editedLangs(k); return (
          <tr key={k} style={{ cursor: 'pointer' }} onClick={() => openEditor(k)}>
            <ATd strong>{pg.title || k}<div style={{ fontWeight: 400, fontSize: 11.5, color: AT.inkSoft }}>{pg.sub || pg.kicker}</div></ATd>
            <ATd mono style={{ color: AT.accent }}>{cmsPageUrl(k)}</ATd>
            <ATd>{cmsPageGroup(k, pg)}</ATd>
            <ATd><span style={{ display: 'inline-flex', gap: 4 }}>{els.length ? els.map(l => <ABadge key={l} tone="blue">{l.toUpperCase()}</ABadge>) : <span style={{ fontFamily: AT.body, fontSize: 12, color: AT.inkSoft }}>LV</span>}</span></ATd>
            <ATd>{els.length ? <ABadge tone="blue">Edited</ABadge> : <ABadge tone="ok">Published</ABadge>}</ATd>
            <ATd align="right"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: AT.accent, fontFamily: AT.body, fontWeight: 700, fontSize: 12.5 }}>Edit <AIcon name="chev" size={15} color={AT.accent} /></span></ATd>
          </tr>
        ); })}
      </ATable>
      {entries.length === 0 && <div style={{ marginTop: 16 }}><AEmpty title="No pages match" sub="Try another group or search." /></div>}

      <ADrawer open={!!openKey && !!data} onClose={() => setOpenKey(null)} width={680}
        title={p ? (p.title || openKey) : ''} sub={openKey ? cmsPageUrl(openKey) : ''}
        footer={openKey && (<><ABtn kind="ghost" onClick={() => setOpenKey(null)}>Cancel</ABtn><ABtn kind="primary" onClick={save}><AIcon name="check" size={15} /> Save & publish</ABtn></>)}>
        {openKey && d && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase' }}>Language</span>
              {CMS_LANGS.map(([l, lbl]) => { const active = lang === l; const has = editedLang(data, l); return (
                <button key={l} onClick={() => setLang(l)} style={{ all: 'unset', cursor: 'pointer', padding: '6px 12px', borderRadius: 999, background: active ? AT.accent : AT.panel, color: active ? '#fff' : AT.ink, border: `1px solid ${active ? AT.accent : AT.rule}`, fontFamily: AT.body, fontWeight: 700, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5 }}>{lbl}{has && <span style={{ width: 5, height: 5, borderRadius: 999, background: active ? '#fff' : AT.accent }} />}{l === 'lv' && ' ·default'}</button>
              ); })}
            </div>
            <div style={{ display: 'flex', borderBottom: `1px solid ${AT.rule}`, marginBottom: 18 }}>{tabBtn('content', 'Content')}{tabBtn('media', 'Media')}{tabBtn('seo', 'SEO')}</div>

            {tab === 'content' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: 12, borderRadius: AT.radiusSm, background: AT.accentSoft, fontFamily: AT.body, fontSize: 12.5, color: '#21438C', lineHeight: 1.5 }}>Editing <strong>{CMS_LANGS.find(l => l[0] === lang)[1]}</strong>. {lang !== 'lv' && 'Leave blank to fall back to LV.'} Saves to mobile + desktop.</div>
                <AField label="Kicker / category"><AInput value={d.kicker} onChange={e => setF('kicker', e.target.value)} /></AField>
                <AField label="Title"><AInput value={d.title} onChange={e => setF('title', e.target.value)} /></AField>
                <AField label="Subtitle"><AInput value={d.sub} onChange={e => setF('sub', e.target.value)} /></AField>
                <AField label="Intro paragraph"><textarea value={d.intro} onChange={e => setF('intro', e.target.value)} style={taStyle} /></AField>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontFamily: AT.body, fontSize: 11.5, fontWeight: 700, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase' }}>Sections ({d.sections.length})</div>
                    <ABtn kind="soft" size="sm" onClick={() => setF('sections', [...d.sections, ['', '']])}><AIcon name="plus" size={14} /> Add section</ABtn>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {d.sections.map((s, i) => (
                      <div key={i} style={{ padding: 12, borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.surfaceAlt }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                          <AInput value={s[0]} placeholder="Section heading" onChange={e => { const ns = d.sections.slice(); ns[i] = [e.target.value, ns[i][1]]; setF('sections', ns); }} style={{ background: AT.panel }} />
                          <button onClick={() => setF('sections', d.sections.filter((_, j) => j !== i))} style={{ all: 'unset', cursor: 'pointer', width: 38, height: 38, borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, color: AT.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon name="x" size={16} color={AT.danger} /></button>
                        </div>
                        <textarea value={s[1]} placeholder="Section text" onChange={e => { const ns = d.sections.slice(); ns[i] = [ns[i][0], e.target.value]; setF('sections', ns); }} style={{ ...taStyle, minHeight: 64, background: AT.panel }} />
                      </div>
                    ))}
                    {d.sections.length === 0 && <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>No text sections{special ? ' — this page also renders generated content (FAQ, reviews, tables or a form).' : '. Add one above.'}</div>}
                  </div>
                </div>
              </div>
            )}
            {tab === 'media' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <AField label="Hero image" hint="Shown at the top of the page on mobile + desktop. Recommended 1600×900px."><AImageDrop value={d.heroImage} onChange={v => setF('heroImage', v)} /></AField>
                <AField label="Card icon / emoji" hint="Short emoji or symbol used in lists & tiles."><AInput value={d.icon} onChange={e => setF('icon', e.target.value)} placeholder="🍑 or ✨" style={{ maxWidth: 140, fontSize: 20 }} /></AField>
                <div style={{ padding: 12, borderRadius: AT.radiusSm, background: AT.surfaceAlt, fontFamily: AT.body, fontSize: 12, color: AT.inkSoft, lineHeight: 1.5 }}>Use the <strong>SEO tab</strong> for the social-share (OG) image.</div>
              </div>
            )}
            {tab === 'seo' && (
              <div>
                <SeoField label="Title" k="seo.title"><AInput value={d.seo.title} onChange={e => setSeo('title', e.target.value)} /></SeoField>
                <SeoField label="Description" k="seo.description"><textarea value={d.seo.description} onChange={e => setSeo('description', e.target.value)} style={taStyle} /></SeoField>
                <SeoField label="Keywords" k="seo.keywords"><textarea value={d.seo.keywords} onChange={e => setSeo('keywords', e.target.value)} style={{ ...taStyle, minHeight: 64 }} placeholder="vibratori, lubrikanti, diskrēta piegāde" /></SeoField>
                <SeoField label="Canonical URL" k="seo.canonical"><AInput value={d.seo.canonical} onChange={e => setSeo('canonical', e.target.value)} style={{ fontFamily: AT.mono, fontSize: 12.5 }} /></SeoField>
                <SeoField label="Robots" k="seo.robots"><div style={{ display: 'flex', gap: 8 }}>{[['index', 'Index, follow'], ['noindex', 'Noindex, follow']].map(([v, l]) => <button key={v} onClick={() => setSeo('robots', v)} style={{ all: 'unset', cursor: 'pointer', padding: '9px 14px', borderRadius: AT.radiusSm, background: d.seo.robots === v ? AT.ink : AT.panel, color: d.seo.robots === v ? '#fff' : AT.ink, border: `1px solid ${d.seo.robots === v ? AT.ink : AT.rule}`, fontFamily: AT.body, fontWeight: 600, fontSize: 12.5 }}>{l}</button>)}</div></SeoField>
                <div style={{ height: 1, background: AT.rule, margin: '8px 0 18px' }} />
                <SeoField label="Og Title" k="seo.og_title"><AInput value={d.seo.ogTitle} onChange={e => setSeo('ogTitle', e.target.value)} placeholder={d.seo.title || 'Defaults to Title'} /></SeoField>
                <SeoField label="Og Description" k="seo.og_description"><textarea value={d.seo.ogDescription} onChange={e => setSeo('ogDescription', e.target.value)} style={taStyle} placeholder={d.seo.description || 'Defaults to Description'} /></SeoField>
                <SeoField label="Og Image" k="seo.og_image | Recommended size: 1200×630px (Social Share Image). Max size: 2MB. Formats: JPG, PNG, WEBP."><AImageDrop value={d.seo.ogImage} onChange={v => setSeo('ogImage', v)} ratio="1200 / 630" /></SeoField>
                <SeoField label="Twitter card" k="seo.twitter_card"><select value={d.seo.twitterCard} onChange={e => setSeo('twitterCard', e.target.value)} style={{ ...aInputStyle, cursor: 'pointer' }}><option value="summary_large_image">summary_large_image</option><option value="summary">summary</option></select></SeoField>
              </div>
            )}
          </div>
        )}
      </ADrawer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STRINGS (i18n) — drives nav, footer, home labels & all UI text
// ════════════════════════════════════════════════════════════
function CmsStrings({ ctx, only, heading, intro }) {
  const { cms, saveCms, toast } = ctx;
  const overrides = cms.__strings || {};
  const base = window.LANG_STRINGS || {};
  const allKeys = Array.from(new Set([...Object.keys(base), ...Object.keys(STRING_SEED), ...Object.keys(overrides)])).sort();
  const [q, setQ] = React.useState('');
  const [draft, setDraft] = React.useState(overrides);
  const dirty = JSON.stringify(draft) !== JSON.stringify(overrides);

  let keys = allKeys;
  if (only) keys = keys.filter(k => only.some(pfx => k.startsWith(pfx)));
  if (q) keys = keys.filter(k => k.toLowerCase().includes(q.toLowerCase()) || CMS_LANGS.some(([l]) => ((draft[k] && draft[k][l]) || (base[k] && base[k][l]) || (STRING_SEED[k] && l === 'lv' ? STRING_SEED[k] : '') || '').toLowerCase().includes(q.toLowerCase())));

  const val = (k, l) => (draft[k] && draft[k][l] !== undefined) ? draft[k][l] : ((base[k] && base[k][l]) || (l === 'lv' ? (STRING_SEED[k] || '') : '') || '');
  const setVal = (k, l, v) => setDraft(prev => ({ ...prev, [k]: { ...(prev[k] || {}), [l]: v } }));
  const save = () => { saveCms('__strings', draft); toast('Strings saved — reload storefront to see them'); };

  return (
    <div>
      {heading && <ASectionTitle right={dirty ? <ABtn kind="primary" onClick={save}><AIcon name="check" size={15} /> Save strings</ABtn> : <ABadge tone="ok">Saved</ABadge>}>{heading}</ASectionTitle>}
      {intro && <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft, marginBottom: 14, lineHeight: 1.5 }}>{intro}</div>}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <ASearch value={q} onChange={setQ} placeholder="Search keys or text…" />
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>{keys.length} keys · {CMS_LANGS.length} languages</div>
        {!heading && (dirty ? <ABtn kind="primary" onClick={save}><AIcon name="check" size={15} /> Save strings</ABtn> : <ABadge tone="ok">Saved</ABadge>)}
      </div>
      <ATable columns={[{ label: 'Key' }, ...CMS_LANGS.map(([, l]) => ({ label: l }))]}>
        {keys.slice(0, 120).map(k => (
          <tr key={k}>
            <ATd mono strong style={{ verticalAlign: 'top', width: 200 }}>{k}{overrides[k] && <div><ABadge tone="blue">edited</ABadge></div>}</ATd>
            {CMS_LANGS.map(([l]) => (
              <ATd key={l} style={{ padding: 8 }}>
                <textarea value={val(k, l)} onChange={e => setVal(k, l, e.target.value)} rows={1} style={{ ...aInputStyle, height: 'auto', minHeight: 34, padding: '7px 9px', fontSize: 12.5, lineHeight: 1.4, resize: 'vertical', background: (draft[k] && draft[k][l] !== undefined) ? AT.accentSoft : AT.panel }} />
              </ATd>
            ))}
          </tr>
        ))}
      </ATable>
      {keys.length > 120 && <div style={{ marginTop: 12, fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, textAlign: 'center' }}>Showing first 120 — refine with search.</div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// GLOBAL SEO
// ════════════════════════════════════════════════════════════
function CmsGlobalSeo({ ctx }) {
  const { cms, saveCms, toast } = ctx;
  const cur = cms.__global || {};
  const [d, setD] = React.useState({ siteName: 'Shhh', baseUrl: 'https://shhh.lv', defaultTitle: '', defaultDesc: '', defaultKeywords: '', defaultOgImage: '', orgName: 'NL Trading Co SIA', vat: 'LV40203456789', address: 'Brīvības iela 68 – 14, Rīga, LV-1011', email: 'support@shhh.lv', phone: '+371 6700 0000', ...cur });
  const set = (f, v) => setD({ ...d, [f]: v });
  const save = () => { saveCms('__global', d); toast('Global SEO saved — reload storefront'); };
  return (
    <div style={{ maxWidth: 760 }}>
      <ASectionTitle right={<ABtn kind="primary" onClick={save}><AIcon name="check" size={15} /> Save global SEO</ABtn>}>Global SEO & site identity</ASectionTitle>
      <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft, marginBottom: 18, lineHeight: 1.5 }}>Site-wide defaults and the organisation schema (JSON-LD) injected on every page. Per-page SEO (in Pages) overrides these.</div>
      <APanel pad={20} style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 15, marginBottom: 14 }}>Defaults</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <SeoField label="Site name" k="site.name"><AInput value={d.siteName} onChange={e => set('siteName', e.target.value)} /></SeoField>
          <SeoField label="Base URL" k="site.baseUrl"><AInput value={d.baseUrl} onChange={e => set('baseUrl', e.target.value)} style={{ fontFamily: AT.mono, fontSize: 12.5 }} /></SeoField>
        </div>
        <SeoField label="Default home title" k="seo.home.title"><AInput value={d.defaultTitle} onChange={e => set('defaultTitle', e.target.value)} /></SeoField>
        <SeoField label="Default home description" k="seo.home.description"><textarea value={d.defaultDesc} onChange={e => set('defaultDesc', e.target.value)} style={taStyle} /></SeoField>
        <SeoField label="Default keywords" k="seo.keywords"><textarea value={d.defaultKeywords} onChange={e => set('defaultKeywords', e.target.value)} style={{ ...taStyle, minHeight: 60 }} /></SeoField>
        <SeoField label="Default social image (OG)" k="seo.og_image | 1200×630px"><AImageDrop value={d.defaultOgImage} onChange={v => set('defaultOgImage', v)} ratio="1200 / 630" /></SeoField>
      </APanel>
      <APanel pad={20}>
        <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 15, marginBottom: 14 }}>Organisation (schema.org / Impressum)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <SeoField label="Legal name" k="org.legalName"><AInput value={d.orgName} onChange={e => set('orgName', e.target.value)} /></SeoField>
          <SeoField label="VAT" k="org.vatID"><AInput value={d.vat} onChange={e => set('vat', e.target.value)} /></SeoField>
          <SeoField label="Email" k="org.email"><AInput value={d.email} onChange={e => set('email', e.target.value)} /></SeoField>
          <SeoField label="Phone" k="org.phone"><AInput value={d.phone} onChange={e => set('phone', e.target.value)} /></SeoField>
        </div>
        <SeoField label="Address" k="org.address"><AInput value={d.address} onChange={e => set('address', e.target.value)} /></SeoField>
      </APanel>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MEDIA LIBRARY
// ════════════════════════════════════════════════════════════
function CmsMedia({ ctx }) {
  const { cms, saveCms, toast, confirm } = ctx;
  const media = cms.__media || [];
  const inputRef = React.useRef(null);
  const add = (file) => { if (!file) return; const r = new FileReader(); r.onload = () => { saveCms('__media', [{ id: 'm' + Date.now(), name: file.name, dataUrl: r.result }, ...media]); toast('Image added to library'); }; r.readAsDataURL(file); };
  const remove = (id) => { const m = media.find(x => x.id === id); confirm({ title: 'Delete this image?', body: `“${(m && m.name) || 'This image'}” will be removed from the media library. Pages still using it will lose it. This cannot be undone.`, confirmLabel: 'Yes, delete image', icon: 'trash', tone: 'danger', onConfirm: () => { saveCms('__media', media.filter(x => x.id !== id)); toast('Removed from library'); } }); };
  return (
    <div>
      <ASectionTitle right={<ABtn kind="primary" onClick={() => inputRef.current && inputRef.current.click()}><AIcon name="plus" size={15} /> Upload image</ABtn>}>Media library</ASectionTitle>
      <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft, marginBottom: 18 }}>{media.length} images · reusable across pages, hero & social-share slots.</div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => add(e.target.files[0])} />
      {media.length === 0 ? <AEmpty title="No images yet" sub="Upload images to reuse them across pages." /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {media.map(m => (
            <APanel key={m.id} style={{ overflow: 'hidden' }}>
              <img src={m.dataUrl} alt={m.name} style={{ display: 'block', width: '100%', aspectRatio: '4/3', objectFit: 'cover', background: AT.surfaceAlt }} />
              <div style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontFamily: AT.body, fontSize: 12, color: AT.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                <button onClick={() => remove(m.id)} style={{ all: 'unset', cursor: 'pointer', color: AT.danger }}><AIcon name="x" size={15} color={AT.danger} /></button>
              </div>
            </APanel>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// OVERVIEW — needs attention
// ════════════════════════════════════════════════════════════
function CmsOverview({ ctx, go, openPage }) {
  const { cms } = ctx;
  const pages = window.CONTENT_PAGES || {};
  const keys = Object.keys(pages);
  const missingSeo = keys.filter(k => { const o = cms[k]; const seo = o && o.lv && o.lv.seo; return !(seo && (seo.keywords || seo.ogImage)); });
  const editedKeys = keys.filter(k => cms[k]);
  const langs = ['ru', 'en', 'lt', 'et'];
  const untranslated = keys.filter(k => { const o = cms[k]; return langs.some(l => !(o && o[l])); }).length;
  const noOg = keys.filter(k => { const o = cms[k]; return !(o && o.lv && o.lv.seo && o.lv.seo.ogImage); }).length;

  const card = (label, value, sub, tone, onClick) => (
    <button onClick={onClick} style={{ all: 'unset', cursor: 'pointer' }}>
      <APanel pad={18} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: AT.inkSoft, letterSpacing: AT.lc, textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 30, letterSpacing: AT.ld, color: AT.ink, lineHeight: 1 }}>{value}</span>
        <span style={{ fontFamily: AT.body, fontSize: 12, fontWeight: 600, color: tone === 'warn' ? AT.warn : tone === 'danger' ? AT.danger : AT.ok }}>{sub}</span>
      </APanel>
    </button>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {card('Pages', keys.length, 'Across the storefront', 'ok', () => go('pages'))}
        {card('Edited', editedKeys.length, 'Have CMS overrides', 'ok', () => go('pages'))}
        {card('Missing OG image', noOg, noOg ? 'Add social images' : 'All set', noOg ? 'warn' : 'ok', () => go('pages'))}
        {card('Untranslated', untranslated, untranslated ? 'Pages missing a language' : 'Fully localised', untranslated ? 'warn' : 'ok', () => go('pages'))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'flex-start' }}>
        <APanel pad={18}>
          <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, marginBottom: 12 }}>Recently edited</div>
          {editedKeys.length === 0 ? <div style={{ fontFamily: AT.body, fontSize: 13, color: AT.inkSoft }}>No CMS edits yet. Open any page to start.</div> :
            editedKeys.slice(0, 6).map(k => (
              <button key={k} onClick={() => openPage(k)} style={{ all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${AT.ruleSoft}` }}>
                <span style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink }}>{pages[k].title || k}</span>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><ABadge tone="blue">edited</ABadge><AIcon name="chev" size={15} color={AT.inkSoft} /></span>
              </button>
            ))}
        </APanel>
        <APanel pad={18}>
          <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 16, marginBottom: 12 }}>Quick actions</div>
          {[['Edit navigation & footer labels', () => go('nav')], ['Edit home page blocks', () => go('home')], ['Manage all UI strings', () => go('strings')], ['Global SEO & identity', () => go('global')], ['Media library', () => go('media')]].map(([l, fn]) => (
            <button key={l} onClick={fn} style={{ all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${AT.ruleSoft}` }}>
              <span style={{ fontFamily: AT.body, fontSize: 13.5, color: AT.ink }}>{l}</span><AIcon name="chev" size={15} color={AT.inkSoft} />
            </button>
          ))}
          <div style={{ marginTop: 14, padding: 12, borderRadius: AT.radiusSm, background: AT.accentSoft, fontFamily: AT.body, fontSize: 12.5, color: '#21438C' }}>Tip: press <strong>⌘K</strong> (or Ctrl K) to search every page, string and product.</div>
        </APanel>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ⌘K COMMAND PALETTE
// ════════════════════════════════════════════════════════════
function CmsPalette({ onClose, go, openPage, nav }) {
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);
  React.useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);
  const pages = window.CONTENT_PAGES || {};
  const products = window.PRODUCTS || [];
  const brands = window.BRANDS || [];
  const s = q.trim().toLowerCase();

  const results = [];
  if (s) {
    Object.entries(pages).forEach(([k, p]) => {
      const hay = (k + ' ' + (p.title || '') + ' ' + (p.sub || '') + ' ' + (p.intro || '') + ' ' + (p.sections || []).map(x => Array.isArray(x) ? x.join(' ') : '').join(' ')).toLowerCase();
      if (hay.includes(s)) results.push({ type: 'Page', label: p.title || k, sub: cmsPageUrl(k), go: () => { openPage(k); onClose(); } });
    });
    products.forEach(p => { if ((p.name + ' ' + p.brand).toLowerCase().includes(s)) results.push({ type: 'Product', label: p.name, sub: p.brand + ' · ' + (nav ? 'open in Catalog' : ''), go: () => { nav && nav('catalog', { id: p.id }); onClose(); } }); });
    brands.forEach(b => { if (b.name.toLowerCase().includes(s)) results.push({ type: 'Brand', label: b.name, sub: 'open in Brands', go: () => { nav && nav('brands'); onClose(); } }); });
  }
  const sections = [['Overview', 'overview'], ['Pages', 'pages'], ['Navigation & footer', 'nav'], ['Home & blocks', 'home'], ['All strings', 'strings'], ['Media library', 'media'], ['Global SEO', 'global']];
  sections.forEach(([l, id]) => { if (!s || l.toLowerCase().includes(s)) results.push({ type: 'Go to', label: l, sub: 'CMS section', go: () => { go(id); onClose(); } }); });

  const top = results.slice(0, 40);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(10,10,10,0.45)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 620, maxWidth: '92vw', background: AT.panel, borderRadius: 14, boxShadow: '0 30px 70px rgba(0,0,0,0.35)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: `1px solid ${AT.rule}` }}>
          <AIcon name="search" size={18} color={AT.inkSoft} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') onClose(); if (e.key === 'Enter' && top[0]) top[0].go(); }} placeholder="Search pages, strings, products, brands…" style={{ flex: 1, border: 'none', outline: 'none', fontFamily: AT.body, fontSize: 16, color: AT.ink }} />
          <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft, border: `1px solid ${AT.rule}`, borderRadius: 5, padding: '2px 6px' }}>ESC</span>
        </div>
        <div style={{ maxHeight: '52vh', overflowY: 'auto' }}>
          {top.length === 0 ? <div style={{ padding: 28, textAlign: 'center', fontFamily: AT.body, fontSize: 13, color: AT.inkSoft }}>{s ? 'No matches' : 'Type to search across the whole storefront'}</div> :
            top.map((r, i) => (
              <button key={i} onClick={r.go} style={{ all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: `1px solid ${AT.ruleSoft}` }}>
                <span style={{ fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, color: AT.accent, textTransform: 'uppercase', letterSpacing: AT.lc, width: 64, flexShrink: 0 }}>{r.type}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: AT.body, fontWeight: 600, fontSize: 14, color: AT.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</span>
                  <span style={{ display: 'block', fontFamily: AT.mono, fontSize: 11.5, color: AT.inkSoft }}>{r.sub}</span>
                </span>
                <AIcon name="chev" size={15} color={AT.inkSoft} />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SITEMAP — auto-generated from the live pages; preview + download
// ════════════════════════════════════════════════════════════
function CmsSitemap({ ctx }) {
  const { cms, toast } = ctx;
  const pages = window.CONTENT_PAGES || {};
  const base = ((cms.__global && cms.__global.baseUrl) || 'https://shhh.lv').replace(/\/$/, '');
  const today = (window.nowStamp ? nowStamp() : new Date().toISOString()).slice(0, 10);
  const titleOf = (k) => (cms[k] && cms[k].lv && cms[k].lv.title) || (pages[k] && pages[k].title) || k;

  // Build entries from every live page (so the sitemap auto-reflects changes).
  const entries = [{ key: '__home', url: base + '/', title: 'Home', group: 'Main', priority: '1.0' }];
  Object.keys(pages).forEach(k => {
    const g = cmsPageGroup(k, pages[k]);
    entries.push({ key: k, url: base + cmsPageUrl(k), title: titleOf(k), group: g, priority: g === 'Legal' ? '0.3' : (g === 'Journal' || g === 'Brand pages') ? '0.6' : '0.7' });
  });
  const groups = {};
  entries.forEach(e => { (groups[e.group] = groups[e.group] || []).push(e); });
  const groupOrder = ['Main', 'Trust', 'Support', 'Guides', 'Journal', 'Brand pages', 'Legal', 'Other'];
  const orderedGroups = Object.keys(groups).sort((a, b) => (groupOrder.indexOf(a) + 1 || 99) - (groupOrder.indexOf(b) + 1 || 99));

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + entries.map(e => `  <url>\n    <loc>${e.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`).join('\n')
    + '\n</urlset>\n';
  const htmlDoc = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>Sitemap · shhh...</title>\n'
    + '<style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:760px;margin:40px auto;padding:0 20px;color:#1A1A19}h1{font-size:24px}h2{font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:#6b6b66;margin:28px 0 8px}a{color:#2D4BFF;text-decoration:none}li{margin:5px 0}small{color:#9a9a96}</style></head><body>\n'
    + `<h1>Sitemap</h1><p><small>${entries.length} URLs · generated ${today} · ${base}</small></p>\n`
    + orderedGroups.map(g => `<h2>${g}</h2>\n<ul>\n` + groups[g].map(e => `  <li><a href="${e.url}">${e.title}</a> — <small>${e.url}</small></li>`).join('\n') + '\n</ul>').join('\n')
    + '\n</body></html>\n';

  const download = (name, content, mime) => {
    try {
      const blob = new Blob([content], { type: mime });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      toast('Downloaded ' + name);
    } catch (e) { toast('Download failed'); }
  };

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 18, color: AT.ink }}>Sitemap</div>
          <div style={{ fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft, marginTop: 2 }}>Auto-generated from your live pages — it always reflects the latest changes. {entries.length} URLs · {base}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ABtn kind="soft" onClick={() => download('sitemap.html', htmlDoc, 'text/html')}><AIcon name="download" size={15} /> HTML</ABtn>
          <ABtn kind="primary" onClick={() => download('sitemap.xml', xml, 'application/xml')}><AIcon name="download" size={15} /> sitemap.xml</ABtn>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: AT.body, fontSize: 12, color: '#1F8A4C', background: '#E7F4EC', borderRadius: 999, padding: '5px 11px' }}><span style={{ width: 7, height: 7, borderRadius: 999, background: '#1F8A4C' }} /> Live · updates automatically</span>
        <span style={{ fontFamily: AT.mono, fontSize: 11.5, color: AT.inkSoft, alignSelf: 'center' }}>last generated {today}</span>
      </div>

      {/* HTML preview */}
      <APanel pad={0} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: `1px solid ${AT.rule}`, background: AT.surfaceAlt }}>
          <AIcon name="eye" size={14} color={AT.inkSoft} />
          <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 12.5, color: AT.ink }}>Preview</span>
          <span style={{ fontFamily: AT.mono, fontSize: 11, color: AT.inkSoft }}>{base}/sitemap.xml</span>
        </div>
        <div style={{ padding: '8px 0', maxHeight: 460, overflowY: 'auto' }}>
          {orderedGroups.map(g => (
            <div key={g} style={{ padding: '8px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: AT.body, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: AT.inkSoft }}>{g}</span>
                <span style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft }}>{groups[g].length}</span>
                <span style={{ flex: 1, height: 1, background: AT.ruleSoft }} />
              </div>
              {groups[g].map(e => (
                <div key={e.key} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '4px 0' }}>
                  <span style={{ fontFamily: AT.body, fontSize: 13, color: AT.ink, minWidth: 150, flexShrink: 0 }}>{e.title}</span>
                  <span style={{ fontFamily: AT.mono, fontSize: 12, color: AT.accent, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.url}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </APanel>

      {/* Raw XML */}
      <div style={{ marginTop: 18 }}>
        <div style={{ fontFamily: AT.body, fontSize: 11, fontWeight: 700, letterSpacing: AT.lc, textTransform: 'uppercase', color: AT.inkSoft, marginBottom: 8 }}>sitemap.xml</div>
        <pre style={{ margin: 0, maxHeight: 220, overflow: 'auto', background: AT.ink, color: '#E7E5E0', borderRadius: AT.radiusSm, padding: 16, fontFamily: AT.mono, fontSize: 11.5, lineHeight: 1.5 }}>{xml}</pre>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// WORKSPACE
// ════════════════════════════════════════════════════════════
const CMS_TREE = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'pages', label: 'Pages', icon: 'content' },
  { id: 'nav', label: 'Navigation & footer', icon: 'orders' },
  { id: 'home', label: 'Home & blocks', icon: 'dashboard' },
  { id: 'strings', label: 'All strings (i18n)', icon: 'promos' },
  { id: 'media', label: 'Media library', icon: 'catalog' },
  { id: 'global', label: 'Global SEO', icon: 'settings' },
  { id: 'sitemap', label: 'Sitemap', icon: 'list' },
];

function AContent({ ctx, nav, params }) {
  const [section, setSection] = React.useState('overview');
  const [pageSignal, setPageSignal] = React.useState(null);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [preview, setPreview] = React.useState(false);
  const [previewDevice, setPreviewDevice] = React.useState('desktop');
  const [previewFull, setPreviewFull] = React.useState(false);
  const previewRef = React.useRef(null);
  const fullRef = React.useRef(null);
  const previewSrc = previewDevice === 'mobile' ? 'index.html' : 'desktop.html';
  const reloadIframe = (ref) => { if (ref && ref.current) { const s = ref.current.src; ref.current.src = s; } };

  React.useEffect(() => {
    const onKey = (e) => {
      // ⌘K is owned by the global search; here just support local palette via the button.
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K') && paletteOpen) { e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen]);

  const openPage = (k) => { setSection('pages'); setPageSignal({ key: k, t: Date.now() }); };
  // Deep-link from global search: nav('content', { openPage: key })
  React.useEffect(() => { if (params && params.openPage) openPage(params.openPage); }, [params && params.openPage]);

  let panel = null;
  if (section === 'overview') panel = <CmsOverview ctx={ctx} go={setSection} openPage={openPage} />;
  else if (section === 'pages') panel = <CmsPages ctx={ctx} openSignal={pageSignal} />;
  else if (section === 'nav') panel = <CmsStrings ctx={ctx} only={['nav.', 'footer.']} heading="Navigation & footer" intro="Edit the top-nav, mega-menu and footer labels per language. Changes apply to the storefront on reload." />;
  else if (section === 'home') panel = <CmsStrings ctx={ctx} only={['home.', 'trust.', 'browse.', 'sug.']} heading="Home & blocks" intro="Home page headings, featured/sale/trust block labels and CTAs. For long-form text use Pages." />;
  else if (section === 'strings') panel = <CmsStrings ctx={ctx} heading="All UI strings" intro="Every interface string across all 5 languages. Edit inline; blue cells are overridden." />;
  else if (section === 'media') panel = <CmsMedia ctx={ctx} />;
  else if (section === 'global') panel = <CmsGlobalSeo ctx={ctx} />;
  else if (section === 'sitemap') panel = <CmsSitemap ctx={ctx} />;

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', margin: -28 }}>
      {/* Left tree */}
      <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${AT.rule}`, padding: '20px 14px', background: AT.panel, minHeight: 'calc(100vh - 89px)' }}>
        <button onClick={() => setPaletteOpen(true)} style={{ all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.surfaceAlt, marginBottom: 16 }}>
          <AIcon name="search" size={15} color={AT.inkSoft} />
          <span style={{ flex: 1, fontFamily: AT.body, fontSize: 12.5, color: AT.inkSoft }}>Search…</span>
          <span style={{ fontFamily: AT.mono, fontSize: 10, color: AT.inkSoft, border: `1px solid ${AT.rule}`, borderRadius: 4, padding: '1px 5px' }}>⌘K</span>
        </button>
        {CMS_TREE.map(it => { const active = section === it.id; return (
          <button key={it.id} onClick={() => setSection(it.id)} style={{ all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: AT.radiusSm, marginBottom: 2, background: active ? AT.accentSoft : 'transparent', color: active ? AT.accent : AT.ink, fontFamily: AT.body, fontWeight: 600, fontSize: 13 }}>
            <AIcon name={it.icon} size={16} color={active ? AT.accent : AT.inkSoft} /> {it.label}
          </button>
        ); })}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${AT.rule}` }}>
          <button onClick={() => setPreview(p => !p)} style={{ all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: AT.radiusSm, background: preview ? AT.ink : 'transparent', color: preview ? '#fff' : AT.ink, fontFamily: AT.body, fontWeight: 600, fontSize: 13 }}>
            <AIcon name="eye" size={16} color={preview ? '#fff' : AT.inkSoft} /> {preview ? 'Hide preview' : 'Live preview'}
          </button>
        </div>
      </div>

      {/* Panel + optional preview */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0, padding: 28, overflowX: 'auto' }}>{panel}</div>
        {preview && (
          <div style={{ width: 480, flexShrink: 0, borderLeft: `1px solid ${AT.rule}`, background: AT.surfaceAlt, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${AT.rule}`, display: 'flex', alignItems: 'center', gap: 8, background: AT.panel, flexWrap: 'wrap' }}>
              <DeviceToggle device={previewDevice} setDevice={setPreviewDevice} />
              <div style={{ flex: 1 }} />
              <button onClick={() => setPreviewFull(true)} title="Fullscreen" style={iconBtnStyle}><AIcon name="eye" size={15} /></button>
              <ABtn kind="ghost" size="sm" onClick={() => reloadIframe(previewRef)}>Refresh</ABtn>
            </div>
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: previewDevice === 'mobile' ? '16px 0' : 0 }}>
              <iframe key={previewDevice} ref={previewRef} src={previewSrc} title="preview"
                style={{ border: 'none', background: '#fff', width: previewDevice === 'mobile' ? 440 : '100%', height: previewDevice === 'mobile' ? 900 : '100%', minHeight: 'calc(100vh - 150px)', flexShrink: 0 }} />
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen preview overlay */}
      {previewFull && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: '#0F0F0E', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, background: '#161615', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="shhh-grad-text" style={{ fontFamily: AT.display, fontWeight: 800, fontSize: 18, letterSpacing: AT.ld }}>shhh...</span>
            <span style={{ fontFamily: AT.body, fontSize: 12.5, color: 'rgba(255,255,255,0.6)' }}>Live preview</span>
            <div style={{ flex: 1 }} />
            <DeviceToggle device={previewDevice} setDevice={setPreviewDevice} dark />
            <button onClick={() => reloadIframe(fullRef)} style={{ ...iconBtnStyle, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', width: 'auto', padding: '0 12px', gap: 6, fontFamily: AT.body, fontSize: 12.5, fontWeight: 600 }}><AIcon name="returns" size={15} color="#fff" /> Refresh</button>
            <button onClick={() => setPreviewFull(false)} style={{ ...iconBtnStyle, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', width: 'auto', padding: '0 14px', gap: 6, fontFamily: AT.body, fontSize: 12.5, fontWeight: 700 }}><AIcon name="x" size={16} color="#fff" /> Close</button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: previewDevice === 'mobile' ? 'flex-start' : 'stretch', padding: previewDevice === 'mobile' ? '24px 0' : 0 }}>
            <iframe key={'full-' + previewDevice} ref={fullRef} src={previewSrc} title="fullscreen preview"
              style={{ border: 'none', background: '#fff', width: previewDevice === 'mobile' ? 460 : '100%', height: previewDevice === 'mobile' ? '92vh' : '100%', flexShrink: 0, borderRadius: previewDevice === 'mobile' ? 12 : 0 }} />
          </div>
        </div>
      )}

      {paletteOpen && <CmsPalette onClose={() => setPaletteOpen(false)} go={setSection} openPage={openPage} nav={nav} />}
    </div>
  );
}

const iconBtnStyle = { all: 'unset', cursor: 'pointer', height: 32, minWidth: 32, borderRadius: AT.radiusSm, border: `1px solid ${AT.rule}`, background: AT.panel, color: AT.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' };

function DeviceToggle({ device, setDevice, dark }) {
  const base = { all: 'unset', cursor: 'pointer', padding: '6px 12px', borderRadius: 999, fontFamily: AT.body, fontWeight: 700, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 };
  const wrap = { display: 'inline-flex', gap: 4, padding: 3, borderRadius: 999, background: dark ? 'rgba(255,255,255,0.1)' : AT.surfaceAlt };
  const on = (active) => active ? { background: dark ? '#fff' : AT.ink, color: dark ? '#0F0F0E' : '#fff' } : { color: dark ? 'rgba(255,255,255,0.7)' : AT.ink };
  return (
    <div style={wrap}>
      <button onClick={() => setDevice('desktop')} style={{ ...base, ...on(device === 'desktop') }}>🖥 Desktop</button>
      <button onClick={() => setDevice('mobile')} style={{ ...base, ...on(device === 'mobile') }}>📱 Mobile</button>
    </div>
  );
}

Object.assign(window, { AContent, AImageDrop, cmsPageUrl, cmsPageGroup, CmsPalette });
