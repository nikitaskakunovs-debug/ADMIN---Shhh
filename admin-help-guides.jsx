/* Shhh Admin — guide content for the Help drawer. */

window.ADMIN_GUIDES = {
  guides: [
    { id: 'g-dashboard', title: 'Customising your dashboard', tags: ['dashboard', 'widgets', 'layout'],
      body: 'Your dashboard is made of cards you can rearrange.\n\n• Hover a card to reveal its controls in the top-right corner.\n• Drag the dotted handle to reorder cards.\n• Click × to remove a card.\n• Use "Add card" in the page header to bring cards back, or reset to the default layout.\n\nYour layout is saved in this browser automatically.' },
    { id: 'g-fulfil', title: 'Fulfilling an order', tags: ['orders', 'shipping', 'fulfilment'],
      body: 'Open Orders, click any order, then use "Mark paid / fulfilled" in the header to advance it.\n\nThe timeline on the order page shows where it is. Orders waiting on you are counted in the sidebar badge and the "Needs attention" dashboard card.\n\nRefunds: open the order and click Refund — the customer keeps the discount code they used.' },
    { id: 'g-stock', title: 'Keeping an eye on stock', tags: ['products', 'inventory', 'stock'],
      body: 'The "Low stock" dashboard card lists active products at 10 units or fewer.\n\nTo update stock, open Products, click the product, edit the Stock field and save. Items at zero show "Out of stock" on the storefront and stop accepting orders.' },
    { id: 'g-discount', title: 'Creating a discount code', tags: ['discounts', 'promo', 'codes'],
      body: 'Go to Discounts → "New discount".\n\n• Percentage off — e.g. QUIET10 takes 10% off.\n• Fixed amount — e.g. SHHH5 takes €5 off.\n• Free shipping — waives the delivery fee.\n\nCodes can be limited to a category, paused at any time, and usage is tracked in the Redemptions chart.' },
    { id: 'g-translate', title: 'Managing storefront languages', tags: ['settings', 'languages', 'i18n', 'translations'],
      body: 'Settings → Languages lists every storefront locale with its translation coverage.\n\nToggle a language on or off (the default language can\'t be disabled). Use the Translation preview table to spot missing strings — they show a "missing" badge and fall back to English on the storefront.' },
    { id: 'g-cms', title: 'Editing storefront pages', tags: ['content', 'cms', 'pages', 'banners'],
      body: 'Content lists every storefront page. Click a row to edit its title, slug, status and body.\n\n• Published — live on the storefront.\n• Draft — only visible to the team.\n• Scheduled — goes live with its campaign.\n\nBanners can be toggled instantly — handy for flash promos.' },
    { id: 'g-payout', title: 'Understanding payouts', tags: ['finances', 'payouts', 'fees', 'vat'],
      body: 'Finances shows weekly payouts: gross sales minus processing fees (2.9% + €0.25 per order).\n\nThe pending payout lands in your bank account two days after the week closes. The VAT card estimates the 21% Latvian VAT included in your gross sales — your accountant will love you.' },
    { id: 'g-search', title: 'Finding anything fast', tags: ['search', 'shortcuts', 'keyboard'],
      body: 'Press ⌘K (Ctrl+K on Windows/Linux) anywhere to open search.\n\nIt looks across orders, products, customers and admin screens. Use ↑↓ to move and Enter to jump. Ctrl+` toggles the developer panel.' },
  ],
};
