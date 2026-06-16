# Shhh — Admin

A self-contained e-commerce admin dashboard built with React 18 + Babel standalone
(no build step). `index.html` loads the storefront data files (`shop-*.jsx`) and the
admin code (`admin-*.jsx`) as `text/babel` scripts and renders `<AdminApp />`.

## Run it

Browsers block `text/babel` script fetches from `file://`, so serve the folder over HTTP:

```bash
cd admin
python3 -m http.server 8000
# open http://localhost:8000
```

React, ReactDOM and Babel are loaded from unpkg, so an internet connection is required.

## What's inside

| Area | Files |
| --- | --- |
| Storefront data (source of truth) | `shop-data.jsx`, `shop-i18n.jsx`, `shop-promo.jsx`, `shop-content.jsx`, `shop-brands.jsx` |
| Data layer (orders/customers generated deterministically, metrics, prefs) | `admin-data.jsx` |
| UI kit (icons, buttons, tables, drawers, charts, toasts) | `admin-ui.jsx` |
| Chrome (sidebar, topbar, page scaffold, nav context) | `admin-vies.jsx` |
| Screens: dashboard, orders, products, customers, discounts | `admin-screens-1.jsx` … `admin-screens-5.jsx` |
| Reports + Finances hubs | `admin-reports.jsx` |
| Settings, Content (CMS) | `admin-settings.jsx`, `admin-cms.jsx` |
| Help drawer + guide content | `admin-help.jsx`, `admin-help-guides.jsx` |
| Global search palette | `admin-search.jsx` |
| "Report a problem" dialog | `admin-report.jsx` |
| Developer panel | `admin-devtools.jsx` |
| Root app & routing | `admin-app.jsx` |

## Nice things to try

- **Dashboard** — hover a card for drag/remove controls, reorder by dragging,
  add cards back via "Add card". Layout persists in `localStorage`.
- **⌘K / Ctrl+K** — global search across orders, products, customers, screens.
- **Ctrl+`** — developer panel (state snapshot, console logging, prefs reset).
- **Orders** — open one and advance it pending → paid → fulfilled, or refund it.
- **Discounts** — create a code, pause/resume existing ones.
- **Settings → Languages** — translation coverage preview from `shop-i18n.jsx`.
- **Reports / Orders** — CSV export downloads real files.

All data is demo data, regenerated deterministically on every load (seeded RNG),
so the numbers are stable. Only UI preferences persist in the browser.
