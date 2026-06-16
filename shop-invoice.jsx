// shop-invoice.jsx — printable invoice view + download

function InvoiceScreen({ theme, nav }) {
  const order = (typeof window !== 'undefined' && window.__shhhInvoice) || null;
  if (!order) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: theme.body, color: theme.inkSoft }}>
        Rēķins nav pieejams. <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.ink, textDecoration: 'underline' }}>Atpakaļ</button>
      </div>
    );
  }
  const items = order.items.map(c => ({
    ...c, product: c.id === 'gift' ? GIFT_PRODUCT : PRODUCTS.find(p => p.id === c.id),
  })).filter(i => i.product);
  const net = order.total / 1.21;
  const vat = order.total - net;
  const today = new Date().toLocaleDateString('lv-LV');

  // Build a standalone printable HTML invoice and trigger download.
  const downloadInvoice = () => {
    const rows = items.map(i => {
      const price = i.id === 'gift' ? 0 : i.product.price;
      return `<tr><td>${i.product.name}</td><td style="text-align:center">${i.qty}</td><td style="text-align:right">€${(price * i.qty).toFixed(2)}</td></tr>`;
    }).join('');
    const html = `<!DOCTYPE html><html lang="lv"><head><meta charset="UTF-8"><title>Rēķins ${order.ref}</title>
<style>
  body{font-family:-apple-system,system-ui,sans-serif;color:#0F0F0E;max-width:680px;margin:32px auto;padding:0 24px;}
  h1{font-size:28px;letter-spacing:-1px;margin:0;}
  .muted{color:#65645E;font-size:12px;}
  table{width:100%;border-collapse:collapse;margin:24px 0;font-size:14px;}
  th,td{padding:10px 8px;border-bottom:1px solid #eee;}
  th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#65645E;}
  .tot{display:flex;justify-content:space-between;padding:4px 8px;font-size:14px;}
  .grand{font-weight:800;font-size:18px;border-top:2px solid #0F0F0E;margin-top:8px;padding-top:10px;}
  .row{display:flex;justify-content:space-between;align-items:flex-start;}
  .box{background:#F6F4EF;border-radius:12px;padding:16px;font-size:12px;color:#65645E;margin-top:24px;line-height:1.6;}
</style></head><body>
<div class="row">
  <div><h1>shhh.</h1><div class="muted">Rēķins / Invoice</div></div>
  <div style="text-align:right"><div style="font-weight:700">#${order.ref}</div><div class="muted">${today}</div></div>
</div>
<table>
  <thead><tr><th>Prece</th><th style="text-align:center">Daudz.</th><th style="text-align:right">Summa</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="tot"><span>Bez PVN</span><span>€${net.toFixed(2)}</span></div>
<div class="tot"><span>PVN 21%</span><span>€${vat.toFixed(2)}</span></div>
<div class="tot grand"><span>Kopā</span><span>€${order.total.toFixed(2)}</span></div>
<div class="box">
  <strong>NL Trading Co SIA</strong><br>Reģ. Nr. 40203456789 · PVN LV40203456789<br>
  Brīvības iela 68-14, Rīga, LV-1011, Latvija<br>
  Maksājums bankas izrakstā: "NL Trading Co"<br>
  Šis ir paraugs demonstrācijas nolūkos.
</div>
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `rekins-${order.ref}.html`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const Row = ({ l, v, bold }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: bold ? 15 : 13, color: theme.ink, fontWeight: bold ? 700 : 400, marginBottom: 6 }}>
      <span style={{ color: bold ? theme.ink : theme.inkSoft }}>{l}</span>
      <span style={{ fontFamily: theme.mono }}>{v}</span>
    </div>
  );

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ padding: '12px 20px 0', fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14 }}>
        <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>Sākums</button>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: theme.ink, fontWeight: 600 }}>Rēķins</span>
      </div>

      {/* Invoice sheet */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          borderRadius: theme.radius, background: theme.surface,
          border: `1px solid ${theme.rule}`, padding: 20,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div className="shhh-grad-text" style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 26, letterSpacing: theme.letterDisplay }}>shhh.</div>
              <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 2 }}>Rēķins · Invoice</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: theme.mono, fontSize: 14, fontWeight: 700, color: theme.ink }}>#{order.ref}</div>
              <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 2 }}>{today}</div>
            </div>
          </div>

          {/* Line items */}
          <div style={{ borderTop: `1px solid ${theme.rule}`, paddingTop: 14, marginBottom: 14 }}>
            {items.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: theme.body, fontSize: 13, fontWeight: 600, color: theme.ink }}>{i.product.name}</span>
                  <span style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft }}> × {i.qty}</span>
                </div>
                <span style={{ fontFamily: theme.mono, fontSize: 13, color: theme.ink }}>
                  €{(i.id === 'gift' ? 0 : i.product.price * i.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ borderTop: `1px solid ${theme.rule}`, paddingTop: 12 }}>
            <Row l="Bez PVN" v={`€${net.toFixed(2)}`} />
            <Row l="PVN 21%" v={`€${vat.toFixed(2)}`} />
            <div style={{ borderTop: `2px solid ${theme.ink}`, marginTop: 6, paddingTop: 10 }}>
              <Row l="Kopā" v={`€${order.total.toFixed(2)}`} bold />
            </div>
          </div>

          {/* Company */}
          <div style={{
            marginTop: 18, padding: 14, borderRadius: theme.radiusSm, background: theme.surfaceAlt,
            fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, lineHeight: 1.6,
          }}>
            <strong style={{ color: theme.ink }}>NL Trading Co SIA</strong><br />
            Reģ. Nr. 40203456789 · PVN LV40203456789<br />
            Brīvības iela 68-14, Rīga, LV-1011<br />
            Bankas izrakstā: "NL Trading Co"
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={downloadInvoice} className="shhh-grad" style={{
          cursor: 'pointer', height: 52, borderRadius: theme.radiusPill,
          fontFamily: theme.body, fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>⬇ Lejupielādēt rēķinu</button>
        <GhostButton theme={theme} onClick={() => nav('home')}>Atpakaļ uz veikalu</GhostButton>
      </div>
    </div>
  );
}

window.InvoiceScreen = InvoiceScreen;

// ─────────────────────────────────────────────────────────────
// BankTransferScreen — order submitted, awaiting offline transfer
// ─────────────────────────────────────────────────────────────
function BankTransferScreen({ theme, nav, lastOrder }) {
  if (!lastOrder) {
    return <div style={{ padding: 40, textAlign: 'center', fontFamily: theme.body, color: theme.inkSoft }}>Nav pasūtījuma.</div>;
  }
  const order = lastOrder;
  const items = order.items.map(c => ({
    ...c, product: c.id === 'gift' ? GIFT_PRODUCT : PRODUCTS.find(p => p.id === c.id),
  })).filter(i => i.product);
  const REQ = [
    ['Saņēmējs', 'SIA "NL Trading Co"'],
    ['Reģ. nr.', '40203456789'],
    ['Banka', 'AS "Swedbank"'],
    ['SWIFT', 'HABALV22'],
    ['Konts (IBAN)', 'LV66HABA0551025720513'],
    ['Summa', '€' + order.total.toFixed(2)],
    ['Maksājuma mērķis', 'Pasūtījuma Nr. ' + order.ref + ' apmaksai'],
  ];
  const copy = (txt) => { try { navigator.clipboard && navigator.clipboard.writeText(txt); } catch (e) {} };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Success header */}
      <div style={{ padding: '24px 24px 8px', textAlign: 'center' }}>
        <div style={{
          width: 54, height: 54, borderRadius: 999, margin: '0 auto 12px',
          background: '#1F8A4C', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
        }}>✓</div>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 24, color: theme.ink, letterSpacing: theme.letterDisplay, lineHeight: 1.1 }}>
          Pasūtījums iesniegts!
        </div>
        <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, marginTop: 6, lineHeight: 1.5 }}>
          Pasūtījums nr. <strong style={{ color: theme.ink }}>#{order.ref}</strong>. Sekot izpildei vari sadaļā “Mani pasūtījumi”.
        </div>
      </div>

      {/* Attention banner */}
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ padding: '12px 14px', borderRadius: theme.radius, background: '#FFF6E5', border: '1px solid #F0C97A' }}>
          <div style={{ fontFamily: theme.body, fontSize: 12.5, color: '#7A5600', lineHeight: 1.5 }}>
            <strong>⚠ Uzmanību!</strong> Pasūtījums tiks apstrādāts tikai pēc maksājuma saņemšanas (parasti 1 darba diena).
          </div>
        </div>
      </div>

      {/* Requisites card */}
      <div style={{ padding: '16px 20px 8px' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps,
          textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 10,
        }}>Maksājuma rekvizīti</div>
        <div style={{ borderRadius: theme.radius, border: `1px solid ${theme.rule}`, background: theme.surface, overflow: 'hidden' }}>
          {REQ.map(([k, v], i) => (
            <div key={k} onClick={() => copy(v)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              padding: '11px 14px', cursor: 'pointer',
              borderTop: i === 0 ? 'none' : `1px solid ${theme.rule}`,
              background: k === 'Summa' || k === 'Maksājuma mērķis' ? theme.surfaceAlt : 'transparent',
            }}>
              <span style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, flexShrink: 0 }}>{k}</span>
              <span style={{ fontFamily: theme.mono, fontSize: 12.5, fontWeight: 700, color: theme.ink, textAlign: 'right', wordBreak: 'break-all' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 8, lineHeight: 1.5 }}>
          💡 Pieskaries jebkuram laukam, lai kopētu. Norādi maksājuma mērķi precīzi, lai pasūtījumu atpazīstam ātrāk.
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '14px 20px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PrimaryButton theme={theme} onClick={() => { window.__shhhInvoice = order; nav('invoice'); }}>
          ⬇ Lejupielādēt rēķinu
        </PrimaryButton>
        <GhostButton theme={theme} onClick={() => nav('home')}>Atpakaļ uz veikalu</GhostButton>
      </div>

      {/* Order summary */}
      <div style={{ padding: '14px 20px 0' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps,
          textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 10,
        }}>Preces</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(i => (
            <div key={i.key || i.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, flexShrink: 0 }}>
                <ProductBlob product={i.product} theme={theme} size="sm" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 13, color: theme.ink }}>
                  {i.product.name} <span style={{ color: theme.inkSoft, fontWeight: 400 }}>× {i.qty}</span>
                </div>
              </div>
              <span style={{ fontFamily: theme.mono, fontSize: 13, color: theme.ink }}>
                {i.id === 'gift' ? '€0' : `€${(i.product.price * i.qty).toFixed(2)}`}
              </span>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: theme.rule, margin: '14px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 15, fontWeight: 700, color: theme.ink }}>
          <span>Kopā</span><span style={{ fontFamily: theme.mono }}>€{order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

window.BankTransferScreen = BankTransferScreen;
