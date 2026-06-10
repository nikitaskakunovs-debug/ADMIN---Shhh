/* Shhh Admin — Content (CMS): storefront pages, banners and FAQ. */

(function () {
  const { useState } = React;
  const UI = window.AdminUI, T = UI.T, D = window.AdminData;

  function PageEditor({ page, onClose, onSaved }) {
    const [form, setForm] = useState({ title: page.title, slug: page.slug, body: page.body, status: page.status });
    const set = (k, v) => setForm({ ...form, [k]: v });
    const save = () => {
      page.title = form.title.trim() || page.title;
      page.slug = form.slug.trim() || page.slug;
      page.body = form.body;
      page.status = form.status;
      page.updatedAt = new Date(D.NOW).toISOString().slice(0, 10);
      page.author = 'Nikita';
      onSaved();
      UI.toast(`Saved "${page.title}"`);
      onClose();
    };
    return (
      <UI.Drawer title={page.title} subtitle={'Page · ' + page.slug} onClose={onClose} width={520} footer={
        <React.Fragment>
          <UI.Button variant="ghost" onClick={onClose}>Cancel</UI.Button>
          <UI.Button icon="check" onClick={save}>Save page</UI.Button>
        </React.Fragment>
      }>
        <UI.Field label="Title"><UI.Input value={form.title} onChange={e => set('title', e.target.value)} /></UI.Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <UI.Field label="Slug"><UI.Input value={form.slug} onChange={e => set('slug', e.target.value)} style={{ fontFamily: T.mono }} /></UI.Field>
          <UI.Field label="Status">
            <UI.Select value={form.status} onChange={v => set('status', v)} options={[
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
              { value: 'scheduled', label: 'Scheduled' },
            ]} />
          </UI.Field>
        </div>
        <UI.Field label="Content" hint="Plain-text outline in this demo — the storefront renders rich blocks.">
          <UI.Textarea rows={12} value={form.body} onChange={e => set('body', e.target.value)} />
        </UI.Field>
      </UI.Drawer>
    );
  }

  function CmsScreen() {
    const [editing, setEditing] = useState(null);
    const [, bumpState] = useState(0);
    const bump = () => bumpState(n => n + 1);

    const toggleBanner = (b) => {
      b.active = !b.active; bump();
      UI.toast(`Banner ${b.active ? 'shown' : 'hidden'}: ${b.title}`);
    };

    return (
      <AdminViews.Page title="Content"
        description="Pages, banners and FAQ shown on the storefront"
        actions={<UI.Button icon="plus" onClick={() => UI.toast('Page creation is stubbed in this demo', 'danger')}>New page</UI.Button>}>

        <UI.Card title="Pages" pad={14} style={{ marginBottom: 16 }}>
          <UI.Table
            rowKey={p => p.id}
            onRowClick={p => setEditing(p)}
            columns={[
              { key: 'title', label: 'Page', render: p => (
                <div>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: T.faint, fontFamily: T.mono }}>{p.slug}</div>
                </div>
              )},
              { key: 'status', label: 'Status', render: p => <UI.StatusBadge status={p.status} /> },
              { key: 'author', label: 'Author', render: p => <span style={{ color: T.sub }}>{p.author}</span> },
              { key: 'updatedAt', label: 'Updated', align: 'right', render: p => <span style={{ color: T.sub }}>{p.updatedAt}</span> },
              { key: 'edit', label: '', align: 'right', render: () => <UI.Icon name="edit" size={15} color={T.faint} /> },
            ]}
            rows={SHOP_CONTENT.pages} />
        </UI.Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <UI.Card title="Banners">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {SHOP_CONTENT.banners.map(b => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{b.message}</div>
                    <div style={{ fontSize: 12, color: T.faint }}>{b.placement}</div>
                  </div>
                  <UI.Toggle checked={b.active} onChange={() => toggleBanner(b)} />
                </div>
              ))}
            </div>
          </UI.Card>

          <UI.Card title="FAQ">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SHOP_CONTENT.faqs.map(f => (
                <details key={f.id} style={{ fontSize: 13.5 }}>
                  <summary style={{ fontWeight: 600, cursor: 'pointer' }}>{f.q}</summary>
                  <div style={{ color: T.sub, marginTop: 6, lineHeight: 1.5 }}>{f.a}</div>
                </details>
              ))}
            </div>
          </UI.Card>
        </div>

        {editing && <PageEditor page={editing} onClose={() => setEditing(null)} onSaved={bump} />}
      </AdminViews.Page>
    );
  }

  window.AdminScreens = window.AdminScreens || {};
  window.AdminScreens.Cms = CmsScreen;
})();
