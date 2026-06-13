/* Shhh — minimal React error boundary.
   Without one, a single component error unmounts the whole React tree and
   the page goes blank. This catches render errors, logs them, and shows a
   small recoverable fallback instead of a white screen. */

class ShhhErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[shhh] UI error caught by boundary:', error, info); }
  render() {
    if (!this.state.error) return this.props.children;
    const reload = () => { try { location.reload(); } catch (e) {} };
    return React.createElement('div', {
      style: {
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 14, padding: 28,
        textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#0A0A0A', color: '#fff',
      },
    },
      React.createElement('div', { style: { fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' } }, 'shhh…'),
      React.createElement('div', { style: { fontSize: 15, opacity: 0.8, maxWidth: 320, lineHeight: 1.5 } },
        'Something hiccuped on this page. A reload usually sorts it out.'),
      React.createElement('button', {
        onClick: reload,
        style: {
          marginTop: 6, padding: '11px 22px', borderRadius: 999, border: 'none',
          background: '#fff', color: '#0A0A0A', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        },
      }, 'Reload'),
    );
  }
}
window.ShhhErrorBoundary = ShhhErrorBoundary;
