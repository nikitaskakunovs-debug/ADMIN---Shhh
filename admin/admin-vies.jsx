// admin-vies.jsx — EU VAT (VIES) validation for reverse-charge orders.
// In production the round-trip is a SERVER-SIDE call to the EU VIES SOAP/REST
// service (checkVatService) — never the browser, and never the public web page.
// Here we mirror that contract: format pre-check + simulated lookup that stamps
// a result, timestamp, and consultation number onto the order.

// ── Per-member-state VAT number formats (after the 2-letter country prefix) ──
const VIES_FORMATS = {
  AT: /^U\d{8}$/, BE: /^0\d{9}$/, BG: /^\d{9,10}$/, CY: /^\d{8}[A-Z]$/,
  CZ: /^\d{8,10}$/, DE: /^\d{9}$/, DK: /^\d{8}$/, EE: /^\d{9}$/,
  EL: /^\d{9}$/, ES: /^[A-Z0-9]\d{7}[A-Z0-9]$/, FI: /^\d{8}$/,
  FR: /^[A-Z0-9]{2}\d{9}$/, HR: /^\d{11}$/, HU: /^\d{8}$/, IE: /^[A-Z0-9]{8,9}$/,
  IT: /^\d{11}$/, LT: /^(\d{9}|\d{12})$/, LU: /^\d{8}$/, LV: /^\d{11}$/,
  MT: /^\d{8}$/, NL: /^\d{9}B\d{2}$/, PL: /^\d{10}$/, PT: /^\d{9}$/,
  RO: /^\d{2,10}$/, SE: /^\d{12}$/, SI: /^\d{8}$/, SK: /^\d{10}$/,
};
const VIES_STALE_DAYS = 90;

function viesParse(vatNo) {
  if (!vatNo) return null;
  const clean = String(vatNo).toUpperCase().replace(/[\s.-]/g, '');
  const m = clean.match(/^([A-Z]{2})(.+)$/);
  if (!m) return { cc: null, rest: clean, clean };
  return { cc: m[1], rest: m[2], clean };
}
function viesFormatValid(vatNo) {
  const p = viesParse(vatNo);
  if (!p || !p.cc) return false;
  const re = VIES_FORMATS[p.cc];
  return re ? re.test(p.rest) : p.rest.length >= 4; // unknown CC → lenient
}
function viesDaysSince(iso) {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / 86400000;
}

// Assess an order's VIES standing → { state, tone, label, days, detail }
// states: valid · stale · unchecked · invalid · badformat
function viesAssess(order) {
  if (!order || !order.vatNo) return null;
  const fmtOk = viesFormatValid(order.vatNo);
  const v = order.vies;
  if (!fmtOk && (!v || !v.checkedAt)) return { state: 'badformat', tone: 'danger', label: 'Invalid format' };
  if (!v || !v.checkedAt) return { state: 'unchecked', tone: 'warn', label: 'Not verified' };
  if (v.valid === false) return { state: 'invalid', tone: 'danger', label: 'Invalid', detail: v };
  const days = viesDaysSince(v.checkedAt);
  if (days > VIES_STALE_DAYS) return { state: 'stale', tone: 'warn', label: 'Re-validate', days, detail: v };
  return { state: 'valid', tone: 'ok', label: 'Valid', days, detail: v };
}

function viesFmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) { return iso.slice(0, 10); }
}
function viesAgo(days) {
  if (days == null || !isFinite(days)) return '';
  const d = Math.round(days);
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 45) return d + ' days ago';
  return Math.round(d / 30) + ' months ago';
}

// Simulate the server→VIES round-trip. Real impl: backend SOAP checkVat.
function viesLookup(order) {
  const p = viesParse(order.vatNo);
  const ok = viesFormatValid(order.vatNo);
  const consult = 'W' + (p ? p.cc : 'XX') + Math.random().toString(36).slice(2, 10).toUpperCase();
  return {
    valid: ok,
    checkedAt: new Date().toISOString(),
    consult,
    name: ok ? (order.company || order.alias || '—') : '—',
    address: ok ? (order.locker ? order.locker.replace(/^Door · /, '') + ', ' + (p ? p.cc : '') : (p ? p.cc : '')) : '—',
    source: 'VIES · ec.europa.eu',
  };
}

// ── UI: status chip + verify panel for the order Payment block ──
function ViesPanel({ order, ctx }) {
  const [busy, setBusy] = React.useState(false);
  const a = viesAssess(order);
  if (!a) return null;
  const v = order.vies;

  const run = () => {
    if (busy) return;
    setBusy(true);
    setTimeout(() => {
      const res = viesLookup(order);
      ctx.updateOrder(order.ref, { vies: res });
      setBusy(false);
      if (ctx.toast) ctx.toast(res.valid ? 'VIES: VAT number valid · logged ' + res.consult : 'VIES: VAT number could not be validated');
    }, 1100);
  };

  const toneMap = {
    ok: ['#E4F4EA', '#1F8A4C', '#1F8A4C'],
    warn: ['#FCEFD9', '#9A5B00', '#C2410C'],
    danger: ['#FBE3E3', '#B0282C', '#D0282E'],
  };
  const [chipBg, chipFg, dot] = toneMap[a.tone] || toneMap.warn;

  return (
    <div style={{ marginTop: 10, border: `1px solid ${AT.rule}`, borderRadius: AT.radiusSm, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: AT.surfaceAlt }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 6, background: AT.panel, border: `1px solid ${AT.rule}` }}>
          <AIcon name="finance" size={14} color={AT.ink} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: AT.body, fontWeight: 700, fontSize: 12.5, color: AT.ink }}>VIES check</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 999, background: chipBg, color: chipFg, fontFamily: AT.body, fontWeight: 700, fontSize: 11 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: dot }} />{busy ? 'Checking…' : a.label}
            </span>
          </div>
          <div style={{ fontFamily: AT.mono, fontSize: 10.5, color: AT.inkSoft, marginTop: 2 }}>
            {order.vatNo}{a.state === 'valid' || a.state === 'stale' ? ' · checked ' + viesFmtDate(v.checkedAt) + ' (' + viesAgo(a.days) + ')' : ''}
          </div>
        </div>
        <button onClick={run} disabled={busy} style={{
          all: 'unset', cursor: busy ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 12px', borderRadius: 8, background: busy ? AT.surfaceAlt : AT.ink, color: busy ? AT.inkSoft : '#fff',
          fontFamily: AT.body, fontWeight: 700, fontSize: 12, border: busy ? `1px solid ${AT.rule}` : 'none', opacity: busy ? 0.7 : 1,
        }}>
          <AIcon name={busy ? 'plug' : 'refund'} size={13} color={busy ? AT.inkSoft : '#fff'} />
          {busy ? 'Contacting VIES' : (v && v.checkedAt ? 'Re-check' : 'Validate')}
        </button>
      </div>

      {/* Detail / guidance row */}
      <div style={{ padding: '9px 12px', fontFamily: AT.body, fontSize: 11.5, lineHeight: 1.5, color: AT.inkSoft, borderTop: `1px solid ${AT.ruleSoft}` }}>
        {a.state === 'valid' && v && (
          <span>Validated against the EU VIES register — <strong style={{ color: AT.ink }}>{v.name}</strong>{v.address && v.address !== '—' ? ', ' + v.address : ''}. Consultation no. <span style={{ fontFamily: AT.mono, color: AT.ink }}>{v.consult}</span>.</span>
        )}
        {a.state === 'stale' && (
          <span style={{ color: '#9A5B00' }}>Last verified {viesAgo(a.days)} — re-validate before issuing a 0% invoice so the consultation proof stays current.</span>
        )}
        {a.state === 'unchecked' && (
          <span style={{ color: '#9A5B00' }}>This number has not been checked against VIES yet. Validate before zero-rating VAT — it confirms the number is active for intra-Community supply.</span>
        )}
        {a.state === 'invalid' && (
          <span style={{ color: AT.danger }}>VIES could not confirm this VAT number as valid. Do not zero-rate — charge domestic VAT or contact the buyer.</span>
        )}
        {a.state === 'badformat' && (
          <span style={{ color: AT.danger }}>This is not a well-formed EU VAT number for its country prefix. Correct it before validating.</span>
        )}
      </div>
    </div>
  );
}

// Compact inline chip for lists / customer header
function ViesChip({ order, showNo }) {
  const a = viesAssess(order);
  if (!a) return null;
  const toneMap = { ok: ['#E4F4EA', '#1F8A4C'], warn: ['#FCEFD9', '#9A5B00'], danger: ['#FBE3E3', '#B0282C'] };
  const [bg, fg] = toneMap[a.tone] || toneMap.warn;
  return (
    <span title={'VIES: ' + a.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 999, background: bg, color: fg, fontFamily: AT.body, fontWeight: 700, fontSize: 10.5 }}>
      <span style={{ width: 5, height: 5, borderRadius: 999, background: fg }} />VIES {a.label}{showNo ? ' · ' + order.vatNo : ''}
    </span>
  );
}

Object.assign(window, { viesAssess, viesFormatValid, viesLookup, ViesPanel, ViesChip });
