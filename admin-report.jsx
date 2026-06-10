/* Shhh Admin — "Report a problem" dialog (separate from the Reports hub). */

(function () {
  const { useState } = React;
  const UI = window.AdminUI, T = UI.T;

  function ReportIssueModal({ onClose, route }) {
    const [form, setForm] = useState({ area: 'orders', severity: 'normal', message: '', includeContext: true });
    const [sending, setSending] = useState(false);
    const set = (k, v) => setForm({ ...form, [k]: v });

    const submit = () => {
      if (!form.message.trim()) { UI.toast('Tell us what went wrong first', 'danger'); return; }
      setSending(true);
      // demo: pretend to send, then confirm
      setTimeout(() => {
        setSending(false);
        UI.toast('Thanks — report sent to the team 🤫');
        onClose();
      }, 700);
    };

    return (
      <UI.Modal title="Report a problem" onClose={onClose} width={460} footer={
        <React.Fragment>
          <UI.Button variant="ghost" onClick={onClose}>Cancel</UI.Button>
          <UI.Button icon={sending ? 'refresh' : 'bug'} onClick={submit} disabled={sending}>
            {sending ? 'Sending…' : 'Send report'}
          </UI.Button>
        </React.Fragment>
      }>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <UI.Field label="Where?">
            <UI.Select value={form.area} onChange={v => set('area', v)} options={[
              { value: 'dashboard', label: 'Dashboard' }, { value: 'orders', label: 'Orders' },
              { value: 'products', label: 'Products' }, { value: 'customers', label: 'Customers' },
              { value: 'discounts', label: 'Discounts' }, { value: 'reports', label: 'Reports / Finances' },
              { value: 'cms', label: 'Content' }, { value: 'settings', label: 'Settings' },
              { value: 'other', label: 'Somewhere else' },
            ]} />
          </UI.Field>
          <UI.Field label="How bad?">
            <UI.Select value={form.severity} onChange={v => set('severity', v)} options={[
              { value: 'low', label: 'Cosmetic' },
              { value: 'normal', label: 'Annoying' },
              { value: 'high', label: 'Blocking my work' },
            ]} />
          </UI.Field>
        </div>
        <UI.Field label="What happened?">
          <UI.Textarea rows={5} value={form.message} placeholder="What did you do, what did you expect, what happened instead?"
            onChange={e => set('message', e.target.value)} />
        </UI.Field>
        <UI.Toggle checked={form.includeContext} onChange={v => set('includeContext', v)}
          label={`Attach context (current screen: ${route ? route.screen : 'unknown'})`} />
      </UI.Modal>
    );
  }

  window.AdminReport = { ReportIssueModal };
})();
