/* Shhh Admin — Help drawer. Guide content lives in admin-help-guides.jsx
   (loaded after this file, read lazily at render time). */

(function () {
  const { useState, useMemo } = React;
  const UI = window.AdminUI, T = UI.T;

  function HelpDrawer({ onClose }) {
    const [q, setQ] = useState('');
    const [open, setOpen] = useState(null);
    const guides = (window.ADMIN_GUIDES && window.ADMIN_GUIDES.guides) || [];

    const results = useMemo(() => {
      const needle = q.trim().toLowerCase();
      if (!needle) return guides;
      return guides.filter(g =>
        g.title.toLowerCase().includes(needle)
        || g.body.toLowerCase().includes(needle)
        || g.tags.some(t => t.includes(needle)));
    }, [q, guides]);

    if (open) {
      const g = guides.find(x => x.id === open);
      return (
        <UI.Drawer title={g.title} subtitle={g.tags.map(t => '#' + t).join('  ')} onClose={onClose} width={480}
          footer={<UI.Button variant="ghost" icon="arrowLeft" onClick={() => setOpen(null)}>All guides</UI.Button>}>
          <div style={{ fontSize: 14, lineHeight: 1.65, color: T.ink, whiteSpace: 'pre-wrap' }}>{g.body}</div>
        </UI.Drawer>
      );
    }

    return (
      <UI.Drawer title="Help & guides" subtitle="Short answers for running the store" onClose={onClose} width={480}>
        <UI.SearchBox value={q} onChange={setQ} placeholder="Search guides…" style={{ marginBottom: 16 }} />
        {results.length === 0 && <UI.EmptyState title="No guides match" hint="Try a different word, or report a problem from the sidebar." icon="book" />}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map(g => (
            <button key={g.id} onClick={() => setOpen(g.id)} style={{
              textAlign: 'left', padding: '13px 15px', borderRadius: 13, cursor: 'pointer',
              border: `1px solid ${T.line}`, background: '#fff', transition: 'border-color .12s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.line}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <UI.Icon name="book" size={16} color={T.accent} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{g.title}</div>
                  <div style={{ fontSize: 12.5, color: T.sub, marginTop: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {g.body.split('\n')[0]}
                  </div>
                </div>
                <UI.Icon name="chevronRight" size={14} color={T.faint} />
              </div>
            </button>
          ))}
        </div>
        <div style={{
          marginTop: 18, padding: '14px 16px', borderRadius: 13, background: T.accentSoft,
          fontSize: 13, color: T.accent, fontWeight: 600,
        }}>
          Still stuck? Use “Report a problem” in the sidebar and we'll take a look. 🤫
        </div>
      </UI.Drawer>
    );
  }

  window.AdminHelp = { HelpDrawer };
})();
