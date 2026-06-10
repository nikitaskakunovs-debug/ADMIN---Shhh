/* Shhh — brands carried by the store. */

window.SHOP_BRANDS = {
  brands: [
    { id: 'shhh-house',   name: 'Shhh House',     country: 'LV', kind: 'In-house label',  margin: 'high',
      blurb: 'Our own line — essentials, loungewear, and the 3-packs that pay the rent.' },
    { id: 'maison-nuit',  name: 'Maison Nuit',    country: 'FR', kind: 'Partner brand',   margin: 'medium',
      blurb: 'Parisian lace specialist. Balconettes, bridal tulle, drama.' },
    { id: 'silk-route',   name: 'Silk Route',     country: 'IT', kind: 'Partner brand',   margin: 'medium',
      blurb: 'Mulberry silk slips, robes and sleep accessories from Como.' },
    { id: 'atelier-anouk',name: 'Atelier Anouk',  country: 'NL', kind: 'Consignment',     margin: 'low',
      blurb: 'Small-batch body care: pillow mists, oils, nothing that stains silk.' },
  ],

  brand(id) {
    return this.brands.find(b => b.id === id) || null;
  },
  name(id) {
    const b = this.brand(id);
    return b ? b.name : id;
  },
};
