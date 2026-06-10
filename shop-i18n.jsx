/* Shhh — storefront localisation. The admin reads this to manage locales
   and to preview storefront strings in the CMS / Settings screens. */

window.SHOP_I18N = {
  defaultLocale: 'en',

  locales: [
    { code: 'en', name: 'English',  flag: '🇬🇧', enabled: true,  coverage: 100 },
    { code: 'lv', name: 'Latviešu', flag: '🇱🇻', enabled: true,  coverage: 92 },
    { code: 'ru', name: 'Русский',  flag: '🇷🇺', enabled: true,  coverage: 87 },
    { code: 'de', name: 'Deutsch',  flag: '🇩🇪', enabled: false, coverage: 41 },
  ],

  strings: {
    en: {
      'nav.shop': 'Shop', 'nav.new': 'New in', 'nav.sale': 'Sale',
      'cart.title': 'Your bag', 'cart.empty': 'Your bag is empty — shhh, nobody saw.',
      'cart.checkout': 'Checkout', 'product.addToCart': 'Add to bag',
      'product.sizeGuide': 'Size guide', 'checkout.shipping': 'Shipping',
      'checkout.payment': 'Payment', 'footer.newsletter': 'Quiet drops, no spam. Ever.',
    },
    lv: {
      'nav.shop': 'Veikals', 'nav.new': 'Jaunumi', 'nav.sale': 'Izpārdošana',
      'cart.title': 'Tava soma', 'cart.empty': 'Tava soma ir tukša — kluss, neviens neredzēja.',
      'cart.checkout': 'Noformēt pirkumu', 'product.addToCart': 'Ielikt somā',
      'product.sizeGuide': 'Izmēru tabula', 'checkout.shipping': 'Piegāde',
      'checkout.payment': 'Apmaksa', 'footer.newsletter': 'Klusi jaunumi, bez surogātpasta.',
    },
    ru: {
      'nav.shop': 'Магазин', 'nav.new': 'Новинки', 'nav.sale': 'Скидки',
      'cart.title': 'Ваша корзина', 'cart.empty': 'Корзина пуста — тсс, никто не видел.',
      'cart.checkout': 'Оформить заказ', 'product.addToCart': 'В корзину',
      'product.sizeGuide': 'Таблица размеров', 'checkout.shipping': 'Доставка',
      'checkout.payment': 'Оплата', 'footer.newsletter': 'Тихие новинки, без спама.',
    },
    de: {
      'nav.shop': 'Shop', 'nav.new': 'Neu', 'nav.sale': 'Sale',
      'cart.title': 'Deine Tasche', 'product.addToCart': 'In die Tasche',
    },
  },

  t(locale, key) {
    const table = this.strings[locale] || {};
    return table[key] != null ? table[key] : (this.strings.en[key] != null ? this.strings.en[key] : key);
  },

  keys() {
    return Object.keys(this.strings.en);
  },
};
