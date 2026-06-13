// shop-i18n.jsx — translation strings + React context for live language switching.
// Lang codes: en, lv, ru, lt, et

const LANG_STRINGS = {
  // ─── Header / nav ───
  'nav.search': { en: 'Search the catalogue…', lv: 'Meklēt katalogā…', ru: 'Поиск по каталогу…', lt: 'Ieškoti kataloge…', et: 'Otsi kataloogist…' },
  'nav.menu': { en: 'Menu', lv: 'Izvēlne', ru: 'Меню', lt: 'Meniu', et: 'Menüü' },
  'nav.shop': { en: 'Shop', lv: 'Veikals', ru: 'Магазин', lt: 'Parduotuvė', et: 'Pood' },
  'nav.brands': { en: 'Brands', lv: 'Zīmoli', ru: 'Бренды', lt: 'Prekės ženklai', et: 'Brändid' },
  'nav.match': { en: 'Match', lv: 'Savietot', ru: 'Подбор', lt: 'Atitikimas', et: 'Sobita' },
  'search.title': { en: 'Search', lv: 'Meklēšana', ru: 'Поиск', lt: 'Paieška', et: 'Otsing' },
  'home.shopAll': { en: 'Shop all', lv: 'Skatīt visu', ru: 'Смотреть всё', lt: 'Žiūrėti viską', et: 'Vaata kõiki' },

  // ─── Bottom tab bar ───
  'tab.shop': { en: 'Shop', lv: 'Veikals', ru: 'Магазин', lt: 'Parduotuvė', et: 'Pood' },
  'tab.browse': { en: 'Browse', lv: 'Skatīt', ru: 'Каталог', lt: 'Naršyti', et: 'Sirvi' },
  'tab.you': { en: 'You', lv: 'Tu', ru: 'Вы', lt: 'Tu', et: 'Sina' },
  'tab.bag': { en: 'Bag', lv: 'Soma', ru: 'Корзина', lt: 'Krepšys', et: 'Kott' },

  // ─── Home hero / sections ───
  'home.kicker': { en: 'Adult shop · for every body', lv: 'Pieaugušajiem · katram ķermenim', ru: 'Магазин для взрослых · для каждого', lt: 'Suaugusiems · kiekvienam', et: 'Täiskasvanutele · igale kehale' },
  'home.heroA': { en: 'Quietly', lv: 'Klusi', ru: 'Тихо', lt: 'Tyliai', et: 'Vaikselt' },
  'home.heroB': { en: 'loud.', lv: 'skaļi.', ru: 'громко.', lt: 'garsiai.', et: 'valjult.' },
  'home.heroC': { en: 'For everyone.', lv: 'Visiem.', ru: 'Для всех.', lt: 'Visiems.', et: 'Kõigile.' },
  'home.heroSub': { en: 'A discreet shop for grown-ups of every kind. Plain box, anonymous billing, next-day shipping across the Baltics — and a small free gift if you spend €80.', lv: 'Diskrēts veikals visu veidu pieaugušajiem. Vienkārša kaste, anonīma maksāšana, piegāde nākamajā dienā Baltijā — un mazs dāvana, ja iztērē €80.', ru: 'Сдержанный магазин для взрослых любых возрастов. Простая коробка, анонимная оплата, доставка на следующий день по Балтии — и подарок при заказе от €80.', lt: 'Diskretiška parduotuvė visiems suaugusiems. Paprasta dėžė, anoniminis apmokėjimas, pristatymas kitą dieną Baltijos šalyse — ir maža dovana, jei išleidi €80.', et: 'Diskreetne pood igas vanuses täiskasvanutele. Tühi karp, anonüümne arveldus, järgmise päeva tarne üle Baltikumi — ja väike kingitus €80 tellimuse korral.' },
  'home.ctaBrowse': { en: 'Browse the shop', lv: 'Skatīt veikalu', ru: 'Открыть магазин', lt: 'Atidaryti parduotuvę', et: 'Sirvi poodi' },
  'home.ctaMatch': { en: '💘 Take the 30-sec match', lv: '💘 30-sek savietošana', ru: '💘 Подбор за 30 секунд', lt: '💘 30-sek atitikimas', et: '💘 30-sek sobitamine' },
  'home.featured': { en: 'Featured 🌶️', lv: 'Izceltie 🌶️', ru: 'Избранное 🌶️', lt: 'Rekomenduojama 🌶️', et: 'Esiletõstetud 🌶️' },
  'home.fullSet': { en: 'The full set 💋', lv: 'Viss komplekts 💋', ru: 'Весь набор 💋', lt: 'Visas rinkinys 💋', et: 'Täielik komplekt 💋' },
  'home.seeAll': { en: 'See all', lv: 'Visi', ru: 'Все', lt: 'Visi', et: 'Kõik' },
  'home.trustKicker': { en: 'Discretion, end to end', lv: 'Diskrētums no sākuma līdz galam', ru: 'Конфиденциальность от начала до конца', lt: 'Diskretiškumas nuo pradžios iki galo', et: 'Diskreetsus algusest lõpuni' },
  'home.trustTitle': { en: 'How it stays a secret. 🤫', lv: 'Kā tas paliek noslēpumā. 🤫', ru: 'Как сохранить это в тайне. 🤫', lt: 'Kaip tai lieka paslaptyje. 🤫', et: 'Kuidas see jääb saladuseks. 🤫' },

  // ─── Browse ───
  'browse.title': { en: 'Browse 🍒', lv: 'Skatīt 🍒', ru: 'Каталог 🍒', lt: 'Naršyti 🍒', et: 'Sirvi 🍒' },
  'browse.search': { en: 'Search by mood, size, material…', lv: 'Meklēt pēc noskaņas, izmēra, materiāla…', ru: 'Поиск по настроению, размеру, материалу…', lt: 'Ieškoti pagal nuotaiką, dydį, medžiagą…', et: 'Otsi tuju, suuruse, materjali järgi…' },
  'browse.filters': { en: 'Filters', lv: 'Filtri', ru: 'Фильтры', lt: 'Filtrai', et: 'Filtrid' },

  // ─── Product page (editable labels, buttons, specs, reviews) ───
  'pdp.saved': { en: 'Saved ♥', lv: 'Saglabāts ♥', ru: 'Сохранено ♥', lt: 'Išsaugota ♥', et: 'Salvestatud ♥' },
  'pdp.badgeNew': { en: 'New', lv: 'Jaunums', ru: 'Новинка', lt: 'Naujiena', et: 'Uus' },
  'pdp.badgeSale': { en: 'Sale', lv: 'Izpārdošana', ru: 'Скидка', lt: 'Išpardavimas', et: 'Soodustus' },
  'pdp.badgeBestseller': { en: 'Bestseller', lv: 'Bestsellers', ru: 'Хит продаж', lt: 'Perkamiausia', et: 'Menuk' },
  'pdp.brand': { en: 'Brand:', lv: 'Zīmols:', ru: 'Бренд:', lt: 'Prekės ženklas:', et: 'Bränd:' },
  'pdp.colour': { en: 'Colour', lv: 'Krāsa', ru: 'Цвет', lt: 'Spalva', et: 'Värv' },
  'pdp.size': { en: 'Size', lv: 'Izmērs', ru: 'Размер', lt: 'Dydis', et: 'Suurus' },
  'pdp.readMore': { en: 'Read more', lv: 'Lasīt vairāk', ru: 'Читать далее', lt: 'Skaityti daugiau', et: 'Loe edasi' },
  'pdp.readLess': { en: 'Show less', lv: 'Rādīt mazāk', ru: 'Свернуть', lt: 'Rodyti mažiau', et: 'Näita vähem' },
  'pdp.fullInstructions': { en: 'Full instructions', lv: 'Pilnās instrukcijas', ru: 'Полная инструкция', lt: 'Visa instrukcija', et: 'Täisjuhend' },
  'pdp.addToCart': { en: 'Add to bag', lv: 'Pievienot grozam', ru: 'В корзину', lt: 'Į krepšelį', et: 'Lisa korvi' },
  'pdp.addedToCart': { en: 'Added to bag', lv: 'Pievienots grozam', ru: 'Добавлено в корзину', lt: 'Įdėta į krepšelį', et: 'Lisatud korvi' },
  'pdp.continueShopping': { en: 'Continue shopping', lv: 'Turpināt iepirkties', ru: 'Продолжить покупки', lt: 'Tęsti apsipirkimą', et: 'Jätka ostlemist' },
  'pdp.viewCart': { en: 'View bag', lv: 'Skatīt grozu', ru: 'Открыть корзину', lt: 'Žiūrėti krepšelį', et: 'Vaata korvi' },
  'pdp.anonPayment': { en: 'Anonymous payment', lv: 'Anonīms maksājums', ru: 'Анонимная оплата', lt: 'Anoniminis mokėjimas', et: 'Anonüümne makse' },
  'pdp.getTomorrow': { en: 'Get it tomorrow', lv: 'Saņem rīt', ru: 'Получите завтра', lt: 'Gaukite rytoj', et: 'Saa homme' },
  'pdp.noReviews': { en: 'No reviews yet. Be the first!', lv: 'Vēl nav atsauksmju. Esi pirmais!', ru: 'Отзывов пока нет. Будьте первым!', lt: 'Atsiliepimų dar nėra. Būkite pirmas!', et: 'Arvustusi veel pole. Ole esimene!' },
  'pdp.goesWellWith': { en: 'Goes well with 💘', lv: 'Labi sader ar 💘', ru: 'Хорошо сочетается с 💘', lt: 'Puikiai dera su 💘', et: 'Sobib hästi 💘' },
  'pdp.tabAbout': { en: 'About', lv: 'Apraksts', ru: 'Описание', lt: 'Aprašymas', et: 'Kirjeldus' },
  'pdp.tabCare': { en: 'Care', lv: 'Kopšana', ru: 'Уход', lt: 'Priežiūra', et: 'Hooldus' },
  'pdp.tabHowto': { en: 'How to use', lv: 'Lietošana', ru: 'Как использовать', lt: 'Naudojimas', et: 'Kasutamine' },
  'pdp.tabShipping': { en: 'Shipping', lv: 'Piegāde', ru: 'Доставка', lt: 'Pristatymas', et: 'Tarne' },
  'pdp.tabReviews': { en: 'Reviews', lv: 'Atsauksmes', ru: 'Отзывы', lt: 'Atsiliepimai', et: 'Arvustused' },
  'pdp.deliveryNextDay': { en: 'Next-day delivery', lv: 'Piegāde nākamajā dienā', ru: 'Доставка на следующий день', lt: 'Pristatymas kitą dieną', et: 'Järgmise päeva tarne' },
  'pdp.plainBox': { en: 'Unmarked box', lv: 'Neapzīmēta kaste', ru: 'Коробка без маркировки', lt: 'Nepažymėta dėžė', et: 'Märgistuseta karp' },
  'pdp.discreetTracking': { en: 'Discreet tracking', lv: 'Diskrēta izsekošana', ru: 'Анонимное отслеживание', lt: 'Diskretiškas sekimas', et: 'Diskreetne jälgimine' },
  'pdp.addToBag': { en: 'Add to bag', lv: 'Pievienot grozam', ru: 'В корзину', lt: 'Į krepšelį', et: 'Lisa korvi' },
  'pdp.buyNow': { en: '⚡ Buy', lv: '⚡ Pirkt', ru: '⚡ Купить', lt: '⚡ Pirkti', et: '⚡ Osta' },
  'pdp.goesWith': { en: 'Goes well with 💘', lv: 'Labi sader ar 💘', ru: 'Хорошо сочетается с 💘', lt: 'Puikiai dera su 💘', et: 'Sobib hästi 💘' },
  'pdp.modes': { en: 'Modes', lv: 'Režīmi', ru: 'Режимы', lt: 'Režimai', et: 'Režiimid' },
  'pdp.sound': { en: 'Sound', lv: 'Skaņa', ru: 'Громкость', lt: 'Garsas', et: 'Heli' },
  'pdp.tabShip': { en: 'Shipping', lv: 'Piegāde', ru: 'Доставка', lt: 'Pristatymas', et: 'Tarne' },
  'pdp.waterproof': { en: 'Waterproof', lv: 'Ūdensizturīgs', ru: 'Водонепроницаемый', lt: 'Atsparus vandeniui', et: 'Veekindel' },
  'pdp.weight': { en: 'Weight', lv: 'Svars', ru: 'Вес', lt: 'Svoris', et: 'Kaal' },
  'browse.sort': { en: 'Sort', lv: 'Kārtot', ru: 'Сортировка', lt: 'Rūšiuoti', et: 'Sorteeri' },
  'browse.pieces': { en: 'pieces', lv: 'gabali', ru: 'товаров', lt: 'vienetai', et: 'tükki' },

  // ─── Home page sections (editable) ───
  'home.saleTitle': { en: 'Sale 🔥', lv: 'Akcijas 🔥', ru: 'Скидки 🔥', lt: 'Išpardavimas 🔥', et: 'Soodustus 🔥' },
  'home.allSales': { en: 'All sales →', lv: 'Visas akcijas →', ru: 'Все скидки →', lt: 'Visi išpardavimai →', et: 'Kõik soodustused →' },
  'home.allReviews': { en: 'Read all reviews →', lv: 'Lasīt visas atsauksmes →', ru: 'Все отзывы →', lt: 'Visi atsiliepimai →', et: 'Kõik arvustused →' },
  'home.allReviews2': { en: 'Read all reviews', lv: 'Lasīt visas atsauksmes', ru: 'Все отзывы', lt: 'Visi atsiliepimai', et: 'Kõik arvustused' },
  'home.shopByCategory': { en: 'Shop by category 🍒', lv: 'Iepērcies pēc kategorijas 🍒', ru: 'Покупки по категориям 🍒', lt: 'Pirkti pagal kategoriją 🍒', et: 'Osta kategooria järgi 🍒' },
  'home.secretTitle': { en: 'How it stays a secret. 🤫', lv: 'Kā tas paliek noslēpumā. 🤫', ru: 'Как это остаётся секретом. 🤫', lt: 'Kaip tai lieka paslaptyje. 🤫', et: 'Kuidas see jääb saladuseks. 🤫' },
  'home.giftTitle': { en: 'Whisper kit · on us', lv: 'Čukstu komplekts · no mums', ru: 'Whisper kit · в подарок', lt: 'Whisper kit · dovanų', et: 'Whisper kit · meilt' },
  'home.browse': { en: 'Browse 🍒', lv: 'Pārlūkot 🍒', ru: 'Смотреть 🍒', lt: 'Naršyti 🍒', et: 'Sirvi 🍒' },

  // ─── Menu / cart / account (editable) ───
  'menu.shop': { en: 'Shop', lv: 'Veikals', ru: 'Магазин', lt: 'Parduotuvė', et: 'Pood' },
  'menu.wishlist': { en: 'Wishlist', lv: 'Vēlmes', ru: 'Избранное', lt: 'Pageidavimai', et: 'Soovid' },
  'menu.bag': { en: 'Bag', lv: 'Grozs', ru: 'Корзина', lt: 'Krepšelis', et: 'Korv' },
  'menu.orders': { en: 'My orders', lv: 'Mani pasūtījumi', ru: 'Мои заказы', lt: 'Mano užsakymai', et: 'Minu tellimused' },
  'menu.sale': { en: 'Sale 🔥', lv: 'Akcijas 🔥', ru: 'Скидки 🔥', lt: 'Išpardavimas 🔥', et: 'Soodustus 🔥' },
  'menu.giftcard': { en: 'Gift card 🎁', lv: 'Dāvanu karte 🎁', ru: 'Подарочная карта 🎁', lt: 'Dovanų kortelė 🎁', et: 'Kinkekaart 🎁' },
  'menu.footerHint': { en: 'Everything else is in the footer ↓', lv: 'Visa pārējā info atrodama lapas kājenē ↓', ru: 'Остальное — в подвале страницы ↓', lt: 'Visa kita — puslapio apačioje ↓', et: 'Ülejäänu on jaluses ↓' },
  'cart.freeGift': { en: 'Free gift 🎁', lv: 'Bezmaksas dāvana 🎁', ru: 'Подарок 🎁', lt: 'Dovana 🎁', et: 'Tasuta kingitus 🎁' },
  'cart.discount': { en: 'Discount', lv: 'Atlaide', ru: 'Скидка', lt: 'Nuolaida', et: 'Allahindlus' },
  'account.bag': { en: 'Your bag', lv: 'Tava soma', ru: 'Ваша корзина', lt: 'Tavo krepšelis', et: 'Sinu korv' },
  'account.wishlist': { en: 'Wishlist', lv: 'Vēlmes', ru: 'Избранное', lt: 'Pageidavimai', et: 'Soovid' },
  'acc.discreetPack': { en: 'Discreet packaging', lv: 'Diskrēts iepakojums', ru: 'Скрытная упаковка', lt: 'Diskretiškas pakavimas', et: 'Diskreetne pakend' },
  'acc.discreetPackSub': { en: 'On — outer box is unmarked', lv: 'Ieslēgts — kaste bez apzīmējumiem', ru: 'Вкл — коробка без маркировки', lt: 'Įjungta — dėžė nepažymėta', et: 'Sees — karp on märgistuseta' },
  'acc.anonBilling': { en: 'Anonymous billing', lv: 'Anonīma maksāšana', ru: 'Анонимная оплата', lt: 'Anoniminis atsiskaitymas', et: 'Anonüümne arveldus' },
  'acc.anonBillingSub': { en: 'On — appears as "NL Trading Co"', lv: 'Ieslēgts — izrakstā "NL Trading Co"', ru: 'Вкл — в выписке "NL Trading Co"', lt: 'Įjungta — išraše "NL Trading Co"', et: 'Sees — väljavõttel "NL Trading Co"' },
  'acc.autoHide': { en: 'Auto-hide order history', lv: 'Automātiski slēpt pasūtījumu vēsturi', ru: 'Авто-скрытие истории заказов', lt: 'Automatiškai slėpti užsakymų istoriją', et: 'Peida tellimuste ajalugu automaatselt' },
  'acc.autoHideSub': { en: 'After 30 days post-delivery', lv: '30 dienas pēc piegādes', ru: 'Через 30 дней после доставки', lt: 'Po 30 dienų nuo pristatymo', et: '30 päeva pärast tarnet' },
  'acc.biometric': { en: 'Biometric on launch', lv: 'Biometrija atverot', ru: 'Биометрия при запуске', lt: 'Biometrija paleidžiant', et: 'Biomeetria avamisel' },
  'acc.biometricSub': { en: 'Off — tap to enable', lv: 'Izslēgts — pieskaries, lai ieslēgtu', ru: 'Выкл — нажмите, чтобы включить', lt: 'Išjungta — palieskite, kad įjungtumėte', et: 'Väljas — puuduta lubamiseks' },

  // ─── Cart / Checkout ───
  'cart.title': { en: 'Your bag 🛍️', lv: 'Tava soma 🛍️', ru: 'Ваша корзина 🛍️', lt: 'Tavo krepšys 🛍️', et: 'Sinu kott 🛍️' },
  'cart.empty': { en: 'Empty.', lv: 'Tukša.', ru: 'Пусто.', lt: 'Tuščia.', et: 'Tühi.' },
  'cart.subtotal': { en: 'Subtotal', lv: 'Starpsumma', ru: 'Подытог', lt: 'Tarpinė suma', et: 'Vahesumma' },
  'cart.shipping': { en: 'Shipping', lv: 'Piegāde', ru: 'Доставка', lt: 'Pristatymas', et: 'Tarne' },
  'cart.total': { en: 'Total', lv: 'Kopā', ru: 'Итого', lt: 'Iš viso', et: 'Kokku' },
  'cart.free': { en: 'Free', lv: 'Bezmaksas', ru: 'Бесплатно', lt: 'Nemokamai', et: 'Tasuta' },
  'cart.checkout': { en: 'Check out', lv: 'Apmaksāt', ru: 'Оформить', lt: 'Apmokėti', et: 'Vormista' },
  'checkout.title': { en: 'Checkout', lv: 'Pasūtīšana', ru: 'Оформление', lt: 'Apmokėjimas', et: 'Vormistus' },
  'checkout.fast': { en: '⚡ Fast checkout', lv: '⚡ Ātrā pasūtīšana', ru: '⚡ Быстрое оформление', lt: '⚡ Greitas apmokėjimas', et: '⚡ Kiire vormistus' },
  'checkout.standard': { en: 'Standard', lv: 'Standarta', ru: 'Стандарт', lt: 'Standartinis', et: 'Tavaline' },
  'checkout.identity': { en: 'Identity', lv: 'Identitāte', ru: 'Личность', lt: 'Asmenybė', et: 'Identiteet' },
  'checkout.delivery': { en: 'Delivery', lv: 'Piegāde', ru: 'Доставка', lt: 'Pristatymas', et: 'Tarne' },
  'checkout.pay': { en: 'Pay', lv: 'Maksāt', ru: 'Оплата', lt: 'Mokėti', et: 'Maksa' },
  'checkout.continue': { en: 'Continue', lv: 'Turpināt', ru: 'Продолжить', lt: 'Tęsti', et: 'Jätka' },
  'checkout.placeOrder': { en: 'Place order', lv: 'Iesniegt pasūtījumu', ru: 'Разместить заказ', lt: 'Pateikti užsakymą', et: 'Esita tellimus' },
  'ck.fieldAlias': { en: 'Alias name for the parcel', lv: 'Pseidonīms sūtījumam', ru: 'Псевдоним для посылки', lt: 'Slapyvardis siuntai', et: 'Varjunimi pakile' },
  'ck.fieldEmail': { en: 'Email for tracking', lv: 'E-pasts izsekošanai', ru: 'Email для отслеживания', lt: 'El. paštas sekimui', et: 'E-post jälgimiseks' },
  'ck.phoneDoor': { en: 'Phone (required for door)', lv: 'Telefons (obligāts durvju piegādei)', ru: 'Телефон (обязателен для курьера)', lt: 'Telefonas (privalomas pristatymui į duris)', et: 'Telefon (kohustuslik kulleriga)' },
  'ck.phoneLocker': { en: 'Phone (optional — for locker SMS)', lv: 'Telefons (neobligāts — pakomāta SMS)', ru: 'Телефон (необязательно — SMS постамата)', lt: 'Telefonas (neprivaloma — paštomato SMS)', et: 'Telefon (valikuline — pakiautomaadi SMS)' },
  'ck.fieldStreet': { en: 'Street + house', lv: 'Iela + māja', ru: 'Улица + дом', lt: 'Gatvė + namas', et: 'Tänav + maja' },
  'ck.fieldCity': { en: 'City', lv: 'Pilsēta', ru: 'Город', lt: 'Miestas', et: 'Linn' },
  'ck.fieldPostal': { en: 'Postal', lv: 'Pasta indekss', ru: 'Индекс', lt: 'Pašto kodas', et: 'Postiindeks' },
  'ck.alias': { en: 'Alias', lv: 'Pseidonīms', ru: 'Псевдоним', lt: 'Slapyvardis', et: 'Varjunimi' },
  'ck.aliasHint': { en: 'Goes on the parcel label. We don’t verify.', lv: 'Tiks norādīts uz sūtījuma. Mēs nepārbaudām.', ru: 'Указывается на посылке. Мы не проверяем.', lt: 'Nurodomas ant siuntos. Netikriname.', et: 'Läheb paki sildile. Me ei kontrolli.' },
  'ck.email': { en: 'Email', lv: 'E-pasts', ru: 'Email', lt: 'El. paštas', et: 'E-post' },
  'ck.emailHint': { en: 'One email when it ships. Try a + alias.', lv: 'Viens e-pasts, kad nosūtīts. Izmēģini + aliasu.', ru: 'Одно письмо при отправке. Попробуйте + псевдоним.', lt: 'Vienas laiškas išsiuntus. Išbandyk + alias.', et: 'Üks kiri saatmisel. Proovi + aliast.' },
  'ck.phoneOpt': { en: 'Phone — optional', lv: 'Telefons — neobligāts', ru: 'Телефон — необязательно', lt: 'Telefonas — neprivaloma', et: 'Telefon — valikuline' },
  'ck.phoneHintDoor': { en: 'Courier needs to call you if no one’s home.', lv: 'Kurjers piezvanīs, ja nebūsi mājās.', ru: 'Курьер позвонит, если никого нет дома.', lt: 'Kurjeris paskambins, jei nieko nėra namuose.', et: 'Kuller helistab, kui kedagi pole kodus.' },
  'ck.phoneHintLocker': { en: 'Lockers send an SMS code. Leave blank to use email only.', lv: 'Pakomāts sūta SMS kodu. Atstāj tukšu — izmantosim tikai e-pastu.', ru: 'Постамат отправит SMS-код. Оставьте пустым — только email.', lt: 'Paštomatai siunčia SMS kodą. Palik tuščią — tik el. paštas.', et: 'Pakiautomaat saadab SMS-koodi. Jäta tühjaks — ainult e-post.' },
  'ck.payTitle': { en: 'Payment method 💳', lv: 'Maksāšanas veids 💳', ru: 'Способ оплаты 💳', lt: 'Mokėjimo būdas 💳', et: 'Makseviis 💳' },
  'ck.payTap': { en: 'Tap & pay', lv: 'Tap & pay', ru: 'Tap & pay', lt: 'Tap & pay', et: 'Tap & pay' },
  'ck.payBank': { en: 'Banklink', lv: 'Banklink', ru: 'Банклинк', lt: 'Banklink', et: 'Pangalink' },
  'ck.payBnpl': { en: 'Pay later', lv: 'Maksā vēlāk', ru: 'Оплата позже', lt: 'Mokėk vėliau', et: 'Maksa hiljem' },
  'ck.payCard': { en: 'Card', lv: 'Karte', ru: 'Карта', lt: 'Kortelė', et: 'Kaart' },
  'ck.payTransfer': { en: 'Bank transfer', lv: 'Bankas pārskaitījums', ru: 'Банковский перевод', lt: 'Banko pavedimas', et: 'Pangaülekanne' },
  'ck.payTransferHint': { en: 'Pay after receiving the invoice', lv: 'Apmaksā pēc rēķina saņemšanas', ru: 'Оплата по счёту', lt: 'Apmokėk gavęs sąskaitą', et: 'Maksa pärast arve saamist' },
  'ck.orderSummary': { en: 'Order', lv: 'Pasūtījums', ru: 'Заказ', lt: 'Užsakymas', et: 'Tellimus' },
  'ck.itemsWord': { en: 'items', lv: 'preces', ru: 'товаров', lt: 'prekės', et: 'toodet' },
  'ck.showItems': { en: 'View items', lv: 'Skatīt preces', ru: 'Показать товары', lt: 'Rodyti prekes', et: 'Näita tooteid' },
  'ck.hideItems': { en: 'Hide', lv: 'Slēpt', ru: 'Скрыть', lt: 'Slėpti', et: 'Peida' },
  'ck.discount': { en: 'Discount', lv: 'Atlaide', ru: 'Скидка', lt: 'Nuolaida', et: 'Allahindlus' },
  'ck.promoOrGift': { en: 'Promo code or gift card', lv: 'Promo kods vai dāvanu karte', ru: 'Промокод или подарочная карта', lt: 'Nuolaidos kodas ar dovanų kortelė', et: 'Sooduskood või kinkekaart' },
  'ck.remove': { en: 'Remove', lv: 'Noņemt', ru: 'Убрать', lt: 'Pašalinti', et: 'Eemalda' },
  'ck.invalidCode': { en: 'Invalid or unknown code', lv: 'Nederīgs vai neeksistējošs kods', ru: 'Неверный или несуществующий код', lt: 'Neteisingas arba nežinomas kodas', et: 'Vigane või tundmatu kood' },
  'ck.secureLine': { en: '🔒 Encrypted · TLS 1.3 · billed as "NL Trading Co"', lv: '🔒 Šifrēts · TLS 1.3 · izrakstā "NL Trading Co"', ru: '🔒 Шифрование · TLS 1.3 · в выписке "NL Trading Co"', lt: '🔒 Šifruota · TLS 1.3 · išraše "NL Trading Co"', et: '🔒 Krüpteeritud · TLS 1.3 · väljavõttel "NL Trading Co"' },
  'ck.howSend': { en: 'How shall we send it? 📦', lv: 'Kā nosūtīt? 📦', ru: 'Как отправить? 📦', lt: 'Kaip išsiųsti? 📦', et: 'Kuidas saadame? 📦' },
  'ck.emptyBag': { en: 'Your bag is empty.', lv: 'Tavs grozs ir tukšs.', ru: 'Ваша корзина пуста.', lt: 'Tavo krepšelis tuščias.', et: 'Sinu korv on tühi.' },
  'ck.goShopping': { en: 'Go shopping →', lv: 'Doties iepirkties →', ru: 'За покупками →', lt: 'Eiti apsipirkti →', et: 'Mine ostlema →' },
  'ck.receiveInvoice': { en: 'Receive invoice', lv: 'Saņemt rēķinu', ru: 'Получить счёт', lt: 'Gauti sąskaitą', et: 'Saa arve' },

  // ─── PDP ───
  'pdp.addToBag': { en: 'Add to bag', lv: 'Pievienot somai', ru: 'В корзину', lt: 'Į krepšį', et: 'Lisa kotti' },
  'pdp.buyNow': { en: '⚡ Buy', lv: '⚡ Pirkt', ru: '⚡ Купить', lt: '⚡ Pirkti', et: '⚡ Osta' },
  'pdp.colour': { en: 'Colour', lv: 'Krāsa', ru: 'Цвет', lt: 'Spalva', et: 'Värv' },
  'pdp.tabAbout': { en: 'About', lv: 'Par', ru: 'О товаре', lt: 'Apie', et: 'Tutvustus' },
  'pdp.tabCare': { en: 'Care', lv: 'Kopšana', ru: 'Уход', lt: 'Priežiūra', et: 'Hooldus' },
  'pdp.tabShip': { en: 'Shipping', lv: 'Piegāde', ru: 'Доставка', lt: 'Pristatymas', et: 'Tarne' },
  'rev.write': { en: 'Write a review', lv: 'Rakstīt atsauksmi', ru: 'Написать отзыв', lt: 'Rašyti atsiliepimą', et: 'Kirjuta arvustus' },
  'pdp.tabHowto': { en: 'How to use', lv: 'Lietošana', ru: 'Применение', lt: 'Naudojimas', et: 'Kasutus' },
  'pdp.tabReviews': { en: 'Reviews', lv: 'Atsauksmes', ru: 'Отзывы', lt: 'Atsiliepimai', et: 'Arvustused' },
  'pdp.modes': { en: 'Modes', lv: 'Režīmi', ru: 'Режимы', lt: 'Režimai', et: 'Režiimid' },
  'pdp.sound': { en: 'Sound', lv: 'Skaņa', ru: 'Звук', lt: 'Garsas', et: 'Heli' },
  'pdp.weight': { en: 'Weight', lv: 'Svars', ru: 'Вес', lt: 'Svoris', et: 'Kaal' },
  'pdp.waterproof': { en: 'Waterproof', lv: 'Ūdensizturīgs', ru: 'Водонепр.', lt: 'Atsparus vandeniui', et: 'Veekindel' },

  // ─── Account ───
  'account.title': { en: 'You', lv: 'Tu', ru: 'Вы', lt: 'Tu', et: 'Sina' },
  'account.guest': { en: 'Guest mode', lv: 'Viesa režīms', ru: 'Гостевой режим', lt: 'Svečio režimas', et: 'Külalisrežiim' },
  'account.guestSub': { en: 'No account, no profile, no history kept after delivery.', lv: 'Bez konta, bez profila, vēsture netiek glabāta pēc piegādes.', ru: 'Без аккаунта, без профиля, без истории после доставки.', lt: 'Be paskyros, be profilio, be istorijos po pristatymo.', et: 'Konto, profiili ega ajalooth peale tarnet ei säilitata.' },
  'account.orders': { en: 'Orders', lv: 'Pasūtījumi', ru: 'Заказы', lt: 'Užsakymai', et: 'Tellimused' },
  'account.favourites': { en: 'Favourites', lv: 'Iecienītie', ru: 'Избранное', lt: 'Mėgstami', et: 'Lemmikud' },
  'account.settings': { en: 'Settings', lv: 'Iestatījumi', ru: 'Настройки', lt: 'Nustatymai', et: 'Sätted' },

  // ─── Footer common ───
  'footer.about': { en: 'A discreet adult shop. Plain box, anonymous billing, body-safe materials. Shipping across the Baltics in 24 hours.', lv: 'Diskrēts pieaugušo veikals. Vienkārša kaste, anonīma maksāšana, ķermeņdrošas materiāli. Piegāde Baltijā 24 stundu laikā.', ru: 'Сдержанный магазин для взрослых. Простая коробка, анонимная оплата, безопасные материалы. Доставка по Балтии за 24 часа.', lt: 'Diskretiška suaugusiųjų parduotuvė. Paprasta dėžė, anoniminis apmokėjimas, kūnui saugios medžiagos. Pristatymas Baltijos šalyse per 24 val.', et: 'Diskreetne täiskasvanute pood. Tühi karp, anonüümne arveldus, kehale ohutud materjalid. Tarne üle Baltikumi 24 tunni jooksul.' },
  'footer.shop': { en: 'Shop', lv: 'Veikals', ru: 'Магазин', lt: 'Parduotuvė', et: 'Pood' },
  'footer.guides': { en: 'Guides', lv: 'Ceļveži', ru: 'Гиды', lt: 'Gidai', et: 'Juhendid' },
  'footer.brands': { en: 'Brands', lv: 'Zīmoli', ru: 'Бренды', lt: 'Prekės ženklai', et: 'Brändid' },
  'footer.trust': { en: 'Trust', lv: 'Uzticība', ru: 'Доверие', lt: 'Pasitikėjimas', et: 'Usaldus' },
  'footer.support': { en: 'Support', lv: 'Atbalsts', ru: 'Поддержка', lt: 'Pagalba', et: 'Tugi' },
  'footer.legal': { en: 'Legal', lv: 'Juridiski', ru: 'Юридическое', lt: 'Teisinis', et: 'Õiguslik' },
  'footer.secure': { en: 'Secure payments', lv: 'Drošas maksājumi', ru: 'Безопасные платежи', lt: 'Saugūs mokėjimai', et: 'Turvalised maksed' },
  'footer.alsoOn': { en: 'Also listed on', lv: 'Atrodams arī', ru: 'Также представлены на', lt: 'Taip pat sąraše', et: 'Leitav ka' },
  'footer.company': { en: 'Company', lv: 'Uzņēmums', ru: 'Компания', lt: 'Įmonė', et: 'Ettevõte' },

  // ─── Gate ───
  'gate.kicker': { en: 'Quick check before you enter', lv: 'Ātra pārbaude pirms ieiešanas', ru: 'Быстрая проверка перед входом', lt: 'Greitas patikrinimas prieš įeinant', et: 'Kiire kontroll enne sisenemist' },
  'gate.title': { en: 'Adults only — and we mean it.', lv: 'Tikai pieaugušajiem — tas ir nopietni.', ru: 'Только для взрослых — серьёзно.', lt: 'Tik suaugusiems — rimtai.', et: 'Ainult täiskasvanutele — tõsiselt.' },
  'gate.accept': { en: "I'm 18+ — Accept & enter", lv: 'Esmu 18+ — Pieņemt un ieiet', ru: 'Мне 18+ — Принять и войти', lt: 'Man 18+ — Sutinku ir įeinu', et: 'Olen 18+ — Nõustun ja sisenen' },
  'gate.leave': { en: "I'm under 18 — leave the site", lv: 'Esmu jaunāks par 18 — atstāt vietni', ru: 'Мне меньше 18 — выйти с сайта', lt: 'Man mažiau nei 18 — palikti svetainę', et: 'Olen alla 18 — lahkun saidilt' },

  // ─── Welcome modal ───
  'welcome.step1': { en: 'Step 01 · You', lv: 'Solis 01 · Tu', ru: 'Шаг 01 · Вы', lt: 'Žingsnis 01 · Tu', et: 'Samm 01 · Sina' },
  'welcome.step2': { en: "Step 02 · What you're after", lv: 'Solis 02 · Ko meklē', ru: 'Шаг 02 · Что ищете', lt: 'Žingsnis 02 · Ko ieškai', et: 'Samm 02 · Mida otsid' },
  'welcome.skip': { en: 'Skip →', lv: 'Izlaist →', ru: 'Пропустить →', lt: 'Praleisti →', et: 'Jäta vahele →' },
  'welcome.continue': { en: 'Continue', lv: 'Turpināt', ru: 'Продолжить', lt: 'Tęsti', et: 'Jätka' },
  'welcome.find': { en: 'Find my picks', lv: 'Atrast manus', ru: 'Найти подборку', lt: 'Rasti pasirinkimus', et: 'Leia minu valikud' },

  // ─── Welcome modal pills + body ───
  'welcome.kicker': { en: 'Step 01 · You', lv: 'Solis 01 · Tu', ru: 'Шаг 01 · Вы', lt: 'Žingsnis 01 · Tu', et: 'Samm 01 · Sina' },
  'welcome.heroA': { en: 'Toys for', lv: 'Rotaļlietas', ru: 'Игрушки для', lt: 'Žaislai', et: 'Mänguasjad' },
  'welcome.heroEveryone': { en: 'everyone', lv: 'visiem', ru: 'каждого', lt: 'visiems', et: 'kõigile' },
  'welcome.heroTail': { en: 'Pick what fits you.', lv: 'Izvēlies, kas tev der.', ru: 'Выберите своё.', lt: 'Pasirink savo.', et: 'Vali endale sobiv.' },
  'welcome.mood': { en: 'in the mood', lv: 'noskaņojumā', ru: 'в настроении', lt: 'nuotaikoje', et: 'tujus' },
  'welcome.privacy': { en: 'Stays on this device.', lv: 'Paliek šajā ierīcē.', ru: 'Остаётся на этом устройстве.', lt: 'Lieka šiame įrenginyje.', et: 'Jääb sellesse seadmesse.' },

  // ─── 18+ gate ───
  'gate.bySub': { en: 'By entering you confirm you are 18 or older, and you accept our cookie policy and privacy policy.', lv: 'Ieejot apliecini, ka esi 18+ un piekrīt mūsu sīkfailu un privātuma politikai.', ru: 'Входя, вы подтверждаете, что вам 18+ и принимаете нашу политику cookies и конфиденциальности.', lt: 'Įeidamas patvirtini, kad esi 18+ ir sutinki su slapukų bei privatumo politika.', et: 'Sisenedes kinnitad, et oled 18+ ja nõustud küpsiste- ja privaatsuspoliitikaga.' },
  'gate.cookies': { en: 'Cookies — one only, the essential session cookie', lv: 'Sīkfaili — tikai viens, nepieciešamais sesijas sīkfails', ru: 'Cookies — только один, необходимый сессионный', lt: 'Slapukai — tik vienas, būtinas sesijos', et: 'Küpsised — ainult üks, vajalik sessioonisüpsis' },
  'gate.necessary': { en: 'Strictly necessary', lv: 'Stingri nepieciešami', ru: 'Строго необходимые', lt: 'Būtini', et: 'Hädavajalik' },
  'gate.analytics': { en: 'Analytics — off by default', lv: 'Analītika — pēc noklusējuma izslēgta', ru: 'Аналитика — выкл. по умолч.', lt: 'Analizė — išjungta numatytuoju atveju', et: 'Analüütika — vaikimisi väljas' },

  // ─── Packaging / How it arrives ───
  'pack.kicker': { en: 'How it arrives', lv: 'Kā tas pienāk', ru: 'Как это приходит', lt: 'Kaip jis atvyksta', et: 'Kuidas see saabub' },
  'pack.title1': { en: 'Plain box.', lv: 'Vienkārša kaste.', ru: 'Простая коробка.', lt: 'Paprasta dėžė.', et: 'Tühi karp.' },
  'pack.title2quiet': { en: 'Quiet', lv: 'Klusi', ru: 'Тихо', lt: 'Tylu', et: 'Vaikne' },
  'pack.title2tail': { en: 'drop.', lv: 'piegādāts.', ru: 'доставлено.', lt: 'pristatyta.', et: 'kohale toodud.' },
  'pack.title3': { en: 'No trace.', lv: 'Bez pēdām.', ru: 'Без следов.', lt: 'Be pėdsakų.', et: 'Jälgi pole.' },

  // ─── Confirmation flirty ───
  'conf.title': { en: 'On its way to', lv: 'Ceļā uz', ru: 'В пути к', lt: 'Pakeliui pas', et: 'Teel sinu juurde' },
  'conf.titleYou': { en: 'you', lv: 'tevi', ru: 'тебе', lt: 'tave', et: 'sind' },
  'conf.secret': { en: '🤫 Your secret is safe with us', lv: '🤫 Tavs noslēpums ir drošībā', ru: '🤫 Ваш секрет в безопасности', lt: '🤫 Tavo paslaptis saugi', et: '🤫 Sinu saladus on hoitud' },
  'conf.secretRef': { en: 'Your secret ref', lv: 'Tavs slepenais kods', ru: 'Ваш секретный код', lt: 'Tavo slaptas kodas', et: 'Sinu salakood' },
  'conf.arrives': { en: 'Arrives', lv: 'Pienāks', ru: 'Прибудет', lt: 'Atvyks', et: 'Saabub' },
  'conf.tomorrow': { en: 'Tomorrow', lv: 'Rīt', ru: 'Завтра', lt: 'Rytoj', et: 'Homme' },

  // ─── Trust strip ───
  'trust.s1.title': { en: 'You pay', lv: 'Tu maksā', ru: 'Вы платите', lt: 'Tu moki', et: 'Sa maksad' },
  'trust.s2.title': { en: 'We pack', lv: 'Mēs iepakojam', ru: 'Мы упаковываем', lt: 'Mes pakuojame', et: 'Me pakime' },
  'trust.s3.title': { en: 'Bank statement', lv: 'Bankas izraksts', ru: 'Выписка', lt: 'Banko išrašas', et: 'Pangaväljavõte' },
  'trust.s4.title': { en: 'Courier drops it', lv: 'Kurjers piegādā', ru: 'Курьер доставит', lt: 'Kurjeris pristato', et: 'Kuller toimetab' },
  'trust.s5.title': { en: 'We forget', lv: 'Mēs aizmirstam', ru: 'Мы забываем', lt: 'Mes pamirštame', et: 'Me unustame' },

  // ─── Suggestion blocks ───
  'sug.alsoPick': { en: 'Also pick this one 💋', lv: 'Izvēlies arī šo 💋', ru: 'Возьмите ещё это 💋', lt: 'Imk dar šį 💋', et: 'Võta ka see 💋' },
  'sug.goesWith': { en: 'Goes well with 💘', lv: 'Lieliski sader ar 💘', ru: 'Хорошо сочетается с 💘', lt: 'Gerai dera su 💘', et: 'Sobib hästi 💘' },
  'sug.add': { en: '+ Add', lv: '+ Pievienot', ru: '+ Добавить', lt: '+ Pridėti', et: '+ Lisa' },

  // ─── Match prompt card ───
  'match.kicker': { en: '30-second quiz', lv: '30 sekunžu tests', ru: 'Тест за 30 секунд', lt: '30-ies sekundžių testas', et: '30-sekundi test' },
  'match.headlineA': { en: 'Tell us a little.', lv: 'Pastāsti nedaudz.', ru: 'Расскажите немного.', lt: 'Papasakok šiek tiek.', et: 'Räägi natuke.' },
  'match.headlineB': { en: "We'll match", lv: 'Mēs savietosim', ru: 'Подберём', lt: 'Suderinsime', et: 'Sobitame' },
  'match.headlineC': { en: 'the toy to you.', lv: 'rotaļlietu tev.', ru: 'игрушку под вас.', lt: 'žaislą tau.', et: 'mänguasja sulle.' },
  'match.sub': { en: 'Tap a few pills · we curate the catalogue around you. Stays on this device. No account, no tracking.', lv: 'Pieskaries pāris tagiem · mēs pielāgojam katalogu tev. Paliek šajā ierīcē. Bez konta, bez izsekošanas.', ru: 'Нажмите пару тегов · мы соберём каталог под вас. Остаётся на этом устройстве. Без аккаунта, без слежки.', lt: 'Bakstelėk kelis žymenis · pritaikysime katalogą tau. Lieka šiame įrenginyje. Be paskyros, be sekimo.', et: 'Vajuta paari sildi · kohandame kataloogi sulle. Jääb sellesse seadmesse. Konto puudub, jälgimine puudub.' },
  'match.cta': { en: 'Start the match · 30 sec', lv: 'Sākt savietošanu · 30 sek', ru: 'Начать подбор · 30 сек', lt: 'Pradėti · 30 sek', et: 'Alusta · 30 sek' },

  // ─── Gift progress ───
  'gift.kicker': { en: 'Free gift', lv: 'Bezmaksas dāvana', ru: 'Подарок', lt: 'Dovana', et: 'Kingitus' },
  'gift.unlocked': { en: '🎉 Unlocked', lv: '🎉 Atbloķēts', ru: '🎉 Открыто', lt: '🎉 Atrakinta', et: '🎉 Avatud' },
  'gift.product': { en: 'Whisper kit', lv: 'Klusais komplekts', ru: 'Шёпот-набор', lt: 'Tylumo rinkinys', et: 'Sosina komplekt' },
  'gift.added': { en: 'Added to your bag', lv: 'Pievienots somai', ru: 'Добавлено в корзину', lt: 'Pridėta į krepšį', et: 'Lisatud kotti' },
  'gift.spend': { en: 'away · spend over', lv: 'attālumā · iztērē vairāk par', ru: 'осталось · потратьте больше', lt: 'liko · išleisk daugiau nei', et: 'puudu · kuluta üle' },

  // ─── PDP misc ───
  'pdp.goesWith': { en: 'Goes well with 💘', lv: 'Lieliski sader ar 💘', ru: 'Хорошо сочетается с 💘', lt: 'Gerai dera su 💘', et: 'Sobib hästi 💘' },
  'pdp.previous': { en: 'Previous', lv: 'Iepriekšējais', ru: 'Предыдущий', lt: 'Ankstesnis', et: 'Eelmine' },
  'pdp.next': { en: 'Next', lv: 'Nākamais', ru: 'Следующий', lt: 'Kitas', et: 'Järgmine' },

  // ─── Footer aggregator + secure ───
  'footer.alsoSub': { en: "Compare our prices on Latvia's biggest aggregator sites. Same plain-box shipping when you order through them.", lv: 'Salīdzini cenas lielākajās Latvijas salīdzināšanas vietnēs. Tāda pati vienkārša piegāde.', ru: 'Сравните наши цены на крупнейших латвийских агрегаторах. Та же простая доставка.', lt: 'Palygink mūsų kainas didžiausiose Latvijos agregatorių svetainėse. Toks pat paprastas pristatymas.', et: 'Võrdle meie hindu Läti suurimatel võrdlussaitidel. Sama tühi-karbi tarne.' },

  // ─── Legal page tabs ───
  'legal.tab.terms': { en: 'Terms', lv: 'Noteikumi', ru: 'Условия', lt: 'Sąlygos', et: 'Tingimused' },
  'legal.tab.privacy': { en: 'Privacy', lv: 'Privātums', ru: 'Конфиденциальность', lt: 'Privatumas', et: 'Privaatsus' },
  'legal.tab.cookies': { en: 'Cookies', lv: 'Sīkfaili', ru: 'Cookies', lt: 'Slapukai', et: 'Küpsised' },
  'legal.tab.returns': { en: 'Returns', lv: 'Atgriešanas', ru: 'Возвраты', lt: 'Grąžinimai', et: 'Tagastused' },
  'legal.tab.age': { en: '18+', lv: '18+', ru: '18+', lt: '18+', et: '18+' },
  'legal.tab.delete': { en: 'Delete', lv: 'Dzēst', ru: 'Удалить', lt: 'Ištrinti', et: 'Kustuta' },
  'legal.published': { en: 'Published', lv: 'Publicēts', ru: 'Опубликовано', lt: 'Paskelbta', et: 'Avaldatud' },
  'legal.updated': { en: 'Updated', lv: 'Atjaunots', ru: 'Обновлено', lt: 'Atnaujinta', et: 'Uuendatud' },

  // ─── Content page kickers ───
  'content.trust': { en: 'Trust', lv: 'Uzticība', ru: 'Доверие', lt: 'Pasitikėjimas', et: 'Usaldus' },
  'content.support': { en: 'Support', lv: 'Atbalsts', ru: 'Поддержка', lt: 'Pagalba', et: 'Tugi' },
  'content.journal': { en: 'Journal', lv: 'Žurnāls', ru: 'Журнал', lt: 'Žurnalas', et: 'Ajakiri' },
  'content.legal': { en: 'Legal', lv: 'Juridiski', ru: 'Юридическое', lt: 'Teisinis', et: 'Õiguslik' },

  // ─── CourierPicker ───
  'courier.method': { en: 'Delivery method', lv: 'Piegādes veids', ru: 'Способ доставки', lt: 'Pristatymo būdas', et: 'Tarneviis' },
  'courier.locker': { en: 'Parcel locker', lv: 'Pakomāts', ru: 'Постамат', lt: 'Pakomatas', et: 'Pakiautomaat' },
  'courier.pickup': { en: 'Pickup point or door', lv: 'Saņemšanas punkts vai durvīm', ru: 'Пункт выдачи или дверь', lt: 'Atsiėmimo taškas ar durys', et: 'Vastuvõtupunkt või uks' },
  'courier.door': { en: 'Door delivery', lv: 'Piegāde līdz durvīm', ru: 'Доставка к двери', lt: 'Pristatymas iki durų', et: 'Ukseni tarne' },
  'courier.eta1': { en: 'Tomorrow', lv: 'Rīt', ru: 'Завтра', lt: 'Rytoj', et: 'Homme' },
  'courier.eta2': { en: '2 days', lv: '2 dienas', ru: '2 дня', lt: '2 dienos', et: '2 päeva' },
  'courier.eta12': { en: '1–2 days', lv: '1–2 dienas', ru: '1–2 дня', lt: '1–2 dienos', et: '1–2 päeva' },
  'courier.anon': { en: 'Anon', lv: 'Anon', ru: 'Анон', lt: 'Anon', et: 'Anon' },

  // ─── AnonymityTips header ───
  'anon.cta': { en: 'Want to stay anonymous?', lv: 'Gribi palikt anonīms?', ru: 'Хотите остаться анонимным?', lt: 'Nori likti anonimas?', et: 'Soovid jääda anonüümseks?' },
  'anon.sub': { en: 'Six things you can do.', lv: 'Sešas lietas, ko vari darīt.', ru: 'Шесть простых шагов.', lt: 'Šeši dalykai, kuriuos gali padaryti.', et: 'Kuus asja, mida saad teha.' },
  'anon.tap': { en: 'Tap for six ways.', lv: 'Pieskaries sešiem veidiem.', ru: 'Шесть способов · нажмите', lt: 'Šešis būdus · bakstelėk', et: 'Kuus viisi · vajuta' },

  // ─── Legal pages (title + sub) ───
  'pg.terms.title': { en: 'Terms of service', lv: 'Lietošanas noteikumi', ru: 'Условия использования', lt: 'Naudojimo sąlygos', et: 'Kasutustingimused' },
  'pg.terms.sub':   { en: 'The rules of the road.', lv: 'Spēles noteikumi.', ru: 'Правила игры.', lt: 'Žaidimo taisyklės.', et: 'Mängureeglid.' },
  'pg.privacy.title': { en: 'Privacy policy', lv: 'Privātuma politika', ru: 'Политика конфиденциальности', lt: 'Privatumo politika', et: 'Privaatsuspoliitika' },
  'pg.privacy.sub':   { en: 'What we store, and for how long.', lv: 'Ko mēs glabājam un cik ilgi.', ru: 'Что мы храним и сколько.', lt: 'Ką saugome ir kiek laiko.', et: 'Mida ja kui kaua salvestame.' },
  'pg.cookies.title': { en: 'Cookie policy', lv: 'Sīkfailu politika', ru: 'Политика cookies', lt: 'Slapukų politika', et: 'Küpsisepoliitika' },
  'pg.cookies.sub':   { en: 'The short version: we use one cookie.', lv: 'Īsi: izmantojam vienu sīkfailu.', ru: 'Коротко: один cookie.', lt: 'Trumpai: vienas slapukas.', et: 'Lühidalt: üks küpsis.' },
  'pg.returns.title': { en: 'Returns & refunds', lv: 'Atgriešana un atmaksa', ru: 'Возвраты и возмещение', lt: 'Grąžinimai ir kompensacijos', et: 'Tagastused ja tagasimaksed' },
  'pg.returns.sub':   { en: 'Free, 30 days, no questions asked.', lv: 'Bezmaksas, 30 dienas, bez jautājumiem.', ru: 'Бесплатно, 30 дней, без вопросов.', lt: 'Nemokamai, 30 d., be klausimų.', et: 'Tasuta, 30 päeva, küsimusi pole.' },
  'pg.age.title': { en: '18+ verification', lv: '18+ pārbaude', ru: 'Проверка 18+', lt: '18+ patikrinimas', et: '18+ kontroll' },
  'pg.age.sub':   { en: 'Latvian law requires it. We make it painless.', lv: 'Latvijas likums to prasa. Mēs to padarām vienkāršu.', ru: 'Латвийский закон требует. Мы делаем это безболезненно.', lt: 'Latvijos įstatymas reikalauja. Mes padarome neskausmingai.', et: 'Läti seadus nõuab. Teeme selle valutuks.' },
  'pg.delete.title': { en: 'Delete your account', lv: 'Dzēst kontu', ru: 'Удалить аккаунт', lt: 'Ištrinti paskyrą', et: 'Kustuta konto' },
  'pg.delete.sub':   { en: 'No questions. Done in 7 days.', lv: 'Bez jautājumiem. 7 dienu laikā.', ru: 'Без вопросов. За 7 дней.', lt: 'Be klausimų. Per 7 dienas.', et: 'Küsimusi pole. 7 päevaga.' },

  // ─── Content / SEO pages (subs only) ───
  'pg.how.title': { en: 'How it ships', lv: 'Kā tas tiek piegādāts', ru: 'Как доставляется', lt: 'Kaip pristatoma', et: 'Kuidas saadetakse' },
  'pg.how.sub':   { en: 'Plain box, next-day across the Baltics.', lv: 'Vienkārša kaste, nākamajā dienā pa Baltiju.', ru: 'Простая коробка, на следующий день по Балтии.', lt: 'Paprasta dėžė, kitą dieną Baltijos šalyse.', et: 'Tühi karp, järgmise päevaga üle Baltikumi.' },
  'pg.anonbill.title': { en: 'Anonymous billing', lv: 'Anonīma maksāšana', ru: 'Анонимная оплата', lt: 'Anoniminis apmokėjimas', et: 'Anonüümne arveldus' },
  'pg.anonbill.sub':   { en: 'Nothing recognisable on your bank statement.', lv: 'Nekas atpazīstams bankas izrakstā.', ru: 'Ничего узнаваемого на выписке.', lt: 'Niekas neatpažįstama išraše.', et: 'Pangaväljavõttel midagi äratuntavat.' },
  'pg.bodysafe.title': { en: 'Body-safe materials', lv: 'Ķermenim droši materiāli', ru: 'Безопасные материалы', lt: 'Kūnui saugios medžiagos', et: 'Kehale ohutud materjalid' },
  'pg.bodysafe.sub':   { en: 'Medical-grade, lab-tested, phthalate-free.', lv: 'Medicīniskas klases, testēti laboratorijā, bez ftalātiem.', ru: 'Мед-класс, лаб. тесты, без фталатов.', lt: 'Medicininės klasės, lab. testai, be ftalatų.', et: 'Meditsiiniline klass, labori-testitud, ftalaatideta.' },
  'pg.freeret.title': { en: 'Free returns', lv: 'Bezmaksas atgriešana', ru: 'Бесплатный возврат', lt: 'Nemokamas grąžinimas', et: 'Tasuta tagastus' },
  'pg.freeret.sub':   { en: '30 days, no questions asked.', lv: '30 dienas, bez jautājumiem.', ru: '30 дней, без вопросов.', lt: '30 d., be klausimų.', et: '30 päeva, küsimusi pole.' },
  'pg.lookup.title': { en: 'Order lookup', lv: 'Pasūtījuma meklēšana', ru: 'Поиск заказа', lt: 'Užsakymo paieška', et: 'Tellimuse otsing' },
  'pg.lookup.sub':   { en: 'Find an order with just the ref number.', lv: 'Atrodi pasūtījumu pēc numura.', ru: 'Найдите заказ по номеру.', lt: 'Rask užsakymą pagal numerį.', et: 'Leia tellimus viite järgi.' },
  'pg.faq.title': { en: 'FAQ', lv: 'BUJ', ru: 'Вопросы', lt: 'DUK', et: 'KKK' },
  'pg.faq.sub':   { en: 'The questions we get most often.', lv: 'Visbiežāk uzdotie jautājumi.', ru: 'Самые частые вопросы.', lt: 'Dažniausi klausimai.', et: 'Sageli küsitud küsimused.' },
  'pg.contact.title': { en: 'Contact', lv: 'Kontakti', ru: 'Контакты', lt: 'Kontaktai', et: 'Kontakt' },
  'pg.contact.sub':   { en: 'A human reads everything. We answer within 24 h.', lv: 'Cilvēks lasa visu. Atbildēsim 24 h laikā.', ru: 'Читает человек. Ответим за 24 ч.', lt: 'Žmogus skaito viską. Atsakome per 24 val.', et: 'Loeb inimene. Vastame 24 t jooksul.' },
  'pg.care.title': { en: 'Care guides', lv: 'Kopšanas pamācības', ru: 'Уход', lt: 'Priežiūra', et: 'Hooldusjuhised' },
  'pg.care.sub':   { en: 'How to keep each product happy.', lv: 'Kā parūpēties par katru produktu.', ru: 'Как заботиться о каждом продукте.', lt: 'Kaip rūpintis kiekvienu gaminiu.', et: 'Kuidas iga toodet hooldada.' },
  'pg.journal.title': { en: 'The Shhh Journal', lv: 'Shhh žurnāls', ru: 'Журнал Shhh', lt: 'Shhh žurnalas', et: 'Shhh ajakiri' },
  'pg.journal.sub':   { en: 'Plain-spoken writing on bodies, pleasure and design.', lv: 'Vienkārši stāsti par ķermeni, baudu un dizainu.', ru: 'Просто о телах, удовольствии и дизайне.', lt: 'Atviras tekstas apie kūnus, malonumą ir dizainą.', et: 'Aus kirjutis kehadest, naudingust ja disainist.' },

  // ─── 18+ gate — body copy ───
  'gate.bodyA': { en: 'By entering you confirm you are', lv: 'Ieejot tu apliecini, ka esi', ru: 'Входя, вы подтверждаете, что вам', lt: 'Įeidamas patvirtini, kad esi', et: 'Sisenedes kinnitad, et oled' },
  'gate.bodyAge': { en: '18 or older', lv: '18+', ru: '18+', lt: '18+', et: '18+' },
  'gate.bodyB': { en: 'and you accept our', lv: 'un piekrīt mūsu', ru: 'и принимаете нашу', lt: 'ir sutinki su', et: 'ja nõustud meie' },
  'gate.cookiesLink': { en: 'cookie policy', lv: 'sīkfailu politiku', ru: 'политикой cookies', lt: 'slapukų politika', et: 'küpsisepoliitikaga' },
  'gate.and': { en: 'and', lv: 'un', ru: 'и', lt: 'ir', et: 'ja' },
  'gate.privacyLink': { en: 'privacy policy', lv: 'privātuma politiku', ru: 'политикой конфиденциальности', lt: 'privatumo politika', et: 'privaatsuspoliitikaga' },

  // ─── Page chrome ───
  'page.home': { en: 'Home', lv: 'Sākums', ru: 'Главная', lt: 'Pradžia', et: 'Avaleht' },

  // ─── Home trust strip step bodies ───
  'trust.s1.body': { en: 'Apple Pay or Google Pay. Card details never touch our servers.', lv: 'Apple Pay vai Google Pay. Kartes dati nesasniedz mūsu serverus.', ru: 'Apple Pay или Google Pay. Карта не доходит до наших серверов.', lt: 'Apple Pay arba Google Pay. Kortelės duomenys mūsų serverių nepasiekia.', et: 'Apple Pay või Google Pay. Kaardiandmed meie serverisse ei jõua.' },
  'trust.s2.body': { en: 'A plain brown box. No logo, no product name, no return label.', lv: 'Vienkārša brūna kaste. Bez logo, bez nosaukuma, bez atgriešanas etiķetes.', ru: 'Простая коричневая коробка. Без логотипа, без названия, без обратной этикетки.', lt: 'Paprasta ruda dėžė. Be logotipo, be pavadinimo, be grąžinimo etiketės.', et: 'Tühi pruun karp. Logoth, nimeth, tagastussildith.' },
  'trust.s3.body': { en: 'Charge appears as "NL Trading Co" — nothing searchable.', lv: 'Maksājums parādās kā "NL Trading Co" — nekas neidentificējams.', ru: 'Платёж показан как "NL Trading Co" — ничего не находится.', lt: 'Mokėjimas rodomas kaip "NL Trading Co" — niekur neatpažįstama.', et: 'Makse kuvatakse kui "NL Trading Co" — midagi otsitavat pole.' },
  'trust.s4.body': { en: 'Sender reads NL Trading Co. To your door, locker, or pick-up point.', lv: 'Sūtītājs ir NL Trading Co. Uz durvīm, pakomātu vai saņemšanas punktu.', ru: 'Отправитель — NL Trading Co. К двери, в постамат или пункт выдачи.', lt: 'Siuntėjas — NL Trading Co. Į duris, pakomatą ar atsiėmimo tašką.', et: 'Saatja on NL Trading Co. Ukseni, pakiautomaati või vastuvõtupunkti.' },
  'trust.s5.body': { en: 'Order data is deleted 30 days after delivery. No marketing emails. Ever.', lv: 'Pasūtījuma dati tiek dzēsti 30 dienas pēc piegādes. Nekādu mārketinga e-pastu.', ru: 'Данные удаляются через 30 дней после доставки. Никаких рассылок.', lt: 'Užsakymo duomenys ištrinami 30 dienų po pristatymo. Jokio rinkodaros pašto.', et: 'Tellimuse andmed kustutatakse 30 päeva pärast tarnet. Reklaamkirju ei tule.' },
  'trust.details': { en: 'Details', lv: 'Sīkāk', ru: 'Подробнее', lt: 'Plačiau', et: 'Detailid' },

  // ─── AnonymityTips ───
  'anon.tip1.title': { en: 'Use a parcel locker', lv: 'Izmanto pakomātu', ru: 'Постамат', lt: 'Naudok pakomatą', et: 'Kasuta pakiautomaati' },
  'anon.tip1.body':  { en: 'Omniva, Pastomat or Venipak — your name only appears on the locker screen, not on a doorstep.', lv: 'Omniva, Pastomat vai Venipak — vārds parādās tikai uz pakomāta ekrāna, ne pie durvīm.', ru: 'Omniva, Pastomat или Venipak — имя видно только на экране постамата.', lt: 'Omniva, Pastomat ar Venipak — vardas matomas tik pakomato ekrane.', et: 'Omniva, Pastomat või Venipak — nimi paistab vaid pakiautomaadi ekraanil.' },
  'anon.tip2.title': { en: 'Use an alias name', lv: 'Izmanto pseidonīmu', ru: 'Используйте псевдоним', lt: 'Naudok slapyvardį', et: 'Kasuta varjunime' },
  'anon.tip2.body':  { en: "We don't verify. Whatever name fits the locker label is fine — \"M. M.\" is a popular pick.", lv: 'Mēs nepārbaudām. Jebkurš vārds der — "M. M." ir populārs.', ru: 'Мы не проверяем. Любое имя подойдёт — "M. M." популярный вариант.', lt: 'Netikriname. Bet kuris vardas tinka — "M. M." populiarus.', et: 'Me ei kontrolli. Iga nimi sobib — "M. M." on populaarne.' },
  'anon.tip3.title': { en: 'Use a + email alias', lv: 'Izmanto + e-pasta aliasu', ru: 'Email с + алиасом', lt: 'Naudok + el. pašto alias', et: 'Kasuta + e-posti aliast' },
  'anon.tip3.body':  { en: 'On Gmail and most providers, you+shhh@yourmail.com routes to you but is easy to filter and delete.', lv: 'Gmail un citos: you+shhh@yourmail.com nonāk pie tevis, bet to viegli filtrēt un dzēst.', ru: 'В Gmail и других: you+shhh@yourmail.com приходит вам, но легко фильтровать.', lt: 'Gmail ir kt.: you+shhh@yourmail.com pasiekia tave, lengvai filtruojama.', et: 'Gmailis jt: you+shhh@yourmail.com jõuab sinuni, kerge filtreerida.' },
  'anon.tip4.title': { en: 'Pay tap-style or by banklink', lv: 'Maksā ar Tap vai bankas linku', ru: 'Tap или banklink', lt: 'Mokėk Tap arba banklink', et: 'Maksa Tap või panga-link' },
  'anon.tip4.body':  { en: 'Apple Pay, Google Pay, Citadele/Swedbank/SEB/Luminor banklinks — we never see your card number.', lv: 'Apple Pay, Google Pay, Citadele/Swedbank/SEB/Luminor banklink — mēs neredzam kartes numuru.', ru: 'Apple Pay, Google Pay, Citadele/Swedbank/SEB/Luminor — карта вам видна, нам нет.', lt: 'Apple Pay, Google Pay, Citadele/Swedbank/SEB/Luminor — kortelės nematome.', et: 'Apple Pay, Google Pay, Citadele/Swedbank/SEB/Luminor — kaardinumbrit ei näe.' },
  'anon.tip5.title': { en: 'Bank statement reads "NL Trading Co"', lv: 'Bankas izrakstā: "NL Trading Co"', ru: 'В выписке: "NL Trading Co"', lt: 'Banko išraše: "NL Trading Co"', et: 'Pangaväljavõttel: "NL Trading Co"' },
  'anon.tip5.body':  { en: 'No mention of us or what you bought. Even a casual reader sees nothing.', lv: 'Bez atsauces uz mums vai pirkumu. Pat virspusējs lasītājs neredz neko.', ru: 'Никаких упоминаний о нас или товаре. Никто не догадается.', lt: 'Jokios užuominos. Niekas nesupras.', et: 'Mingit mainimist. Keegi ei aima midagi.' },
  'anon.tip6.title': { en: 'Skip the phone number', lv: 'Izlaid tālruni', ru: 'Без телефона', lt: 'Be telefono', et: 'Telefonita' },
  'anon.tip6.body':  { en: 'Phone is optional for locker delivery. Courier door delivery is the only mode that needs it.', lv: 'Pakomātam tālrunis nav vajadzīgs. Tikai durvju piegādei.', ru: 'Для постамата телефон не нужен. Только для доставки к двери.', lt: 'Pakomatui telefono nereikia. Tik durų pristatymui.', et: 'Pakiautomaadiks telefoni vaja pole. Vaid ukseni-tarneks.' },

  // ─── How-it-arrives steps (the 5 pastel cards) ───
  'arrive.s1.title': { en: 'You order', lv: 'Tu pasūti', ru: 'Вы заказываете', lt: 'Tu užsakai', et: 'Sa tellid' },
  'arrive.s1.body':  { en: 'Tap-pay or banklink. Card details never reach us. Statement reads "NL Trading Co".', lv: 'Tap vai banklink. Kartes dati mūs nesasniedz. Izrakstā: "NL Trading Co".', ru: 'Tap или banklink. Карта до нас не доходит. В выписке: "NL Trading Co".', lt: 'Tap arba banklink. Kortelės mes nematome. Išraše: "NL Trading Co".', et: 'Tap või panga-link. Kaarti me ei näe. Väljavõttel: "NL Trading Co".' },
  'arrive.s2.title': { en: 'We pack', lv: 'Mēs iepakojam', ru: 'Мы упаковываем', lt: 'Mes pakuojame', et: 'Me pakime' },
  'arrive.s2.body':  { en: 'A blank brown box, unmarked tissue inside. No logo on the outside, no product name.', lv: 'Vienkārša brūna kaste, neapzīmēts papīrs iekšā. Bez logo, bez nosaukuma.', ru: 'Пустая коричневая коробка, бумага без надписей. Без логотипа, без названия.', lt: 'Tuščia ruda dėžė, neženklintas popierius viduje. Be logotipo, be pavadinimo.', et: 'Tühi pruun karp, sildita paber sees. Logoth, nimeth.' },
  'arrive.s3.title': { en: 'Courier picks up', lv: 'Kurjers paņem', ru: 'Курьер забирает', lt: 'Kurjeris paima', et: 'Kuller võtab peale' },
  'arrive.s3.body':  { en: 'Omniva, Pastomat, DPD or Venipak. You choose. Sender shows as "NL Trading Co, Rīga".', lv: 'Omniva, Pastomat, DPD vai Venipak. Tu izvēlies. Sūtītājs: "NL Trading Co, Rīga".', ru: 'Omniva, Pastomat, DPD или Venipak. На ваш выбор. Отправитель: "NL Trading Co, Рига".', lt: 'Omniva, Pastomat, DPD ar Venipak. Tu pasirenki. Siuntėjas: "NL Trading Co, Ryga".', et: 'Omniva, Pastomat, DPD või Venipak. Sina valid. Saatja: "NL Trading Co, Riia".' },
  'arrive.s4.title': { en: 'It arrives', lv: 'Tas pienāk', ru: 'Оно приходит', lt: 'Atvyksta', et: 'See saabub' },
  'arrive.s4.body':  { en: 'Locker (no name on door) or your address. Pickup with a code. Nobody else has to know.', lv: 'Pakomāts (uz durvīm nav vārda) vai adrese. Saņem ar kodu. Citiem nav jāzina.', ru: 'Постамат (без имени на двери) или ваш адрес. Получение по коду. Никто не должен знать.', lt: 'Pakomatas (be vardo prie durų) ar adresas. Atsiima pagal kodą. Niekam nereikia žinoti.', et: 'Pakiautomaat (ukse taga nime pole) või aadress. Kättesaamine koodiga. Keegi teine ei pea teadma.' },
  'arrive.s5.title': { en: 'We forget', lv: 'Mēs aizmirstam', ru: 'Мы забываем', lt: 'Mes pamirštame', et: 'Me unustame' },
  'arrive.s5.body':  { en: 'Your data is auto-deleted 30 days after delivery. No marketing emails, ever.', lv: 'Tavi dati tiek dzēsti 30 dienas pēc piegādes. Nekādu mārketinga e-pastu.', ru: 'Данные автоматически удалятся через 30 дней. Никаких рассылок.', lt: 'Duomenys automatiškai trinami po 30 d. Jokio rinkodaros pašto.', et: 'Andmed kustuvad automaatselt 30 päeva pärast tarnet. Reklaamkirju ei tule.' },

  // ─── Packaging "three things people worry about" ───
  'arrive.q1': { en: 'Will the courier know?', lv: 'Vai kurjers zinās?', ru: 'Узнает ли курьер?', lt: 'Ar kurjeris žinos?', et: 'Kas kuller saab teada?' },
  'arrive.a1': { en: "No — they see \"NL Trading Co\" + your alias. Nothing about the product.", lv: 'Nē — viņi redz "NL Trading Co" + tavu pseidonīmu. Nekas par produktu.', ru: 'Нет — он видит "NL Trading Co" + ваш псевдоним. О товаре ничего.', lt: 'Ne — jis mato "NL Trading Co" + tavo slapyvardį. Apie prekę nieko.', et: 'Ei — ta näeb "NL Trading Co" + sinu varjunime. Tootest mitte midagi.' },
  'arrive.q2': { en: 'Will my flatmate see it?', lv: 'Vai mans līdziedzīvotājs redzēs?', ru: 'Увидит ли сосед по квартире?', lt: 'Ar bendrabutis matys?', et: 'Kas mu korterikaaslane näeb?' },
  'arrive.a2': { en: 'Pick locker delivery. The box never crosses your doorstep without you.', lv: 'Izvēlies pakomātu. Kaste nešķērso slieksni bez tevis.', ru: 'Выберите постамат. Коробка не попадёт к двери без вас.', lt: 'Rinkis pakomatą. Dėžė nepasiekia durų be tavęs.', et: 'Vali pakiautomaat. Karp ei ületa läve sinuta.' },
  'arrive.q3': { en: 'Will my bank tell on me?', lv: 'Vai banka mani nodos?', ru: 'Выдаст ли банк?', lt: 'Ar bankas išduos?', et: 'Kas pank reedab mind?' },
  'arrive.a3': { en: 'No — the descriptor is "NL Trading Co". Searchable by nothing recognisable.', lv: 'Nē — apraksts ir "NL Trading Co". Nekas atpazīstams.', ru: 'Нет — обозначение "NL Trading Co". Ничего узнаваемого.', lt: 'Ne — pavadinimas "NL Trading Co". Nieko atpažįstamo.', et: 'Ei — kirjeldus on "NL Trading Co". Midagi äratuntavat pole.' },
  'arrive.myths': { en: 'The three things people worry about', lv: 'Trīs lietas, par ko cilvēki uztraucas', ru: 'Три вещи, о которых волнуются', lt: 'Trys dalykai, kurių žmonės nerimauja', et: 'Kolm asja, mille pärast inimesed muretsevad' },
  'arrive.choose': { en: 'Choose your courier · all anonymous', lv: 'Izvēlies kurjeru · visi anonīmi', ru: 'Выберите курьера · все анонимны', lt: 'Pasirink kurjerį · visi anonimai', et: 'Vali kuller · kõik anonüümsed' },
  'arrive.tryLabel': { en: 'Try a sender label — purely cosmetic', lv: 'Izmēģini sūtītāja etiķeti — tikai estētiski', ru: 'Попробуйте этикетку отправителя — только косметика', lt: 'Pabandyk siuntėjo etiketę — tik kosmetika', et: 'Proovi saatja silti — vaid kosmeetika' },

  // ─── Sender label chooser ───
  'sender.kicker': { en: 'Parcel sender label · optional', lv: 'Sūtītāja etiķete · pēc izvēles', ru: 'Этикетка отправителя · по желанию', lt: 'Siuntėjo etiketė · pasirinktinai', et: 'Saatja silt · valikuline' },
  'sender.help':   { en: "Override the sender printed on the parcel label. Default \"NL Trading Co\" already says nothing about us — pick another only if you'd rather the label look like an everyday shop.", lv: 'Maini sūtītāju uz pakas etiķetes. Noklusētais "NL Trading Co" jau neko nesaka par mums — izvēlies citu tikai tad, ja gribi, lai etiķete izskatās kā ikdienas veikals.', ru: 'Замените отправителя на этикетке. По умолчанию "NL Trading Co" уже ничего не говорит о нас — выбирайте другой, если хотите, чтобы этикетка выглядела как обычный магазин.', lt: 'Pakeisk siuntėją etiketėje. Numatytasis "NL Trading Co" jau nieko nesako apie mus — rinkis kitą, jei nori, kad etiketė atrodytų kaip įprasta parduotuvė.', et: 'Asenda saatja sildil. Vaikimisi "NL Trading Co" meist juba midagi ei räägi — vali teine vaid kui soovid sildi kui tavalise poe oma.' },
  'sender.note':   { en: "None of these affect what's inside, who actually ships it, or your warranty. Purely cosmetic.", lv: 'Nekas no šī neietekmē saturu, faktisko sūtītāju vai garantiju. Tikai estētiski.', ru: 'Ничего из этого не влияет на содержимое, фактического отправителя или гарантию. Только косметика.', lt: 'Niekas iš to neturi įtakos turiniui, siuntėjui ar garantijai. Tik kosmetika.', et: 'Mitte miski neist ei mõjuta sisu, tegelikku saatjat ega garantiid. Vaid kosmeetika.' },

  // ─── Terms page sections ───
  'sec.terms.1.t': { en: 'Who we are', lv: 'Kas mēs esam', ru: 'Кто мы', lt: 'Kas mes esame', et: 'Kes me oleme' },
  'sec.terms.1.b': { en: 'Shhh… is operated by NL Trading Co SIA, registered in Latvia (Reg. 40203456789). Brīvības iela 68 – 14, Rīga, LV-1011.', lv: 'Shhh… darbojas NL Trading Co SIA (Reģ. 40203456789). Brīvības iela 68 – 14, Rīga, LV-1011.', ru: 'Shhh… управляется NL Trading Co SIA (Рег. 40203456789). Brīvības iela 68 – 14, Рига, LV-1011.', lt: 'Shhh… valdo NL Trading Co SIA (Reg. 40203456789). Brīvības iela 68 – 14, Ryga, LV-1011.', et: 'Shhh… haldab NL Trading Co SIA (Reg. 40203456789). Brīvības iela 68 – 14, Riia, LV-1011.' },
  'sec.terms.2.t': { en: 'Buying', lv: 'Pirkšana', ru: 'Покупка', lt: 'Pirkimas', et: 'Ostmine' },
  'sec.terms.2.b': { en: 'Prices include 21% VAT. Stock is shown live; if an item sells out we refund within 24 hours. Orders ship next business day if placed before 16:00 EET.', lv: 'Cenas ar 21% PVN. Krājumi reāllaikā; ja prece beidzas, atmaksā 24 h laikā. Sūta nākamajā darba dienā, ja pasūtīts līdz 16:00 EET.', ru: 'Цены с 21% НДС. Остатки в реальном времени; при разборе товара возврат за 24 ч. Отправка на следующий день при заказе до 16:00 EET.', lt: 'Kainos su 21% PVM. Atsargos realiu laiku; jei prekė baigsis, grąžiname per 24 val. Siunčiame kitą darbo dieną iki 16:00 EET.', et: 'Hinnad sisaldavad 21% käibemaksu. Laoseis on reaalajas; läbimüügi korral tagastame 24 t jooksul. Saadame järgmisel tööpäeval kui tellimus on enne 16:00 EET.' },
  'sec.terms.3.t': { en: 'Age', lv: 'Vecums', ru: 'Возраст', lt: 'Amžius', et: 'Vanus' },
  'sec.terms.3.b': { en: 'You confirm you are 18 or older when you place an order. Bringing in goods on behalf of a minor is prohibited.', lv: 'Veicot pasūtījumu, apliecini, ka esi 18+. Preču iegāde nepilngadīgo vārdā ir aizliegta.', ru: 'Подтверждаете 18+ при оформлении. Заказ для несовершеннолетних запрещён.', lt: 'Užsakydamas patvirtini, kad esi 18+. Užsakymas nepilnamečių vardu draudžiamas.', et: 'Tellimist kinnitad 18+. Tellimine alaealise nimel on keelatud.' },
  'sec.terms.4.t': { en: 'Liability', lv: 'Atbildība', ru: 'Ответственность', lt: 'Atsakomybė', et: 'Vastutus' },
  'sec.terms.4.b': { en: 'Body-safe products are sold "as described." Read each product\u2019s care guide before use. We are not liable for misuse outside the guidelines.', lv: 'Ķermenim droši produkti tiek pārdoti "kā aprakstīts." Pirms lietošanas lasi kopšanas pamācību. Neuzņemamies atbildību par nepareizu lietošanu.', ru: 'Безопасные товары продаются "как описано." Перед использованием читайте инструкцию. Не несём ответственности за неправильное применение.', lt: 'Kūnui saugūs gaminiai parduodami "kaip aprašyta." Prieš naudojimą skaityk priežiūros vadovą. Neatsakome už netinkamą naudojimą.', et: 'Kehale ohutud tooted müüakse "nagu kirjeldatud." Loe enne kasutamist hooldusjuhendit. Vale kasutamise eest me ei vastuta.' },
  'sec.terms.5.t': { en: 'Disputes', lv: 'Strīdi', ru: 'Споры', lt: 'Ginčai', et: 'Vaidlused' },
  'sec.terms.5.b': { en: 'Latvian law applies. Disputes go to Rīga City Court, but we\u2019d rather sort it over email first: support@shhh.lv.', lv: 'Piemēro Latvijas tiesības. Strīdus skata Rīgas pilsētas tiesa, bet labāk vispirms rakstīt: support@shhh.lv.', ru: 'Применяется латвийское право. Споры — в Рижский городской суд. Сначала пишите: support@shhh.lv.', lt: 'Taikoma Latvijos teisė. Ginčai — Rygos miesto teismas. Pirmiausia rašyk: support@shhh.lv.', et: 'Kohaldub Läti õigus. Vaidlused — Riia linnakohus. Esmalt kirjuta: support@shhh.lv.' },

  // ─── Privacy ───
  'sec.privacy.1.t': { en: 'Data we collect', lv: 'Dati, ko ievācam', ru: 'Какие данные', lt: 'Renkami duomenys', et: 'Kogutavad andmed' },
  'sec.privacy.1.b': { en: 'Email (mandatory), shipping name + address or locker code (mandatory for delivery), phone (optional, lockers only need email). We never store your card number.', lv: 'E-pasts (obligāts), vārds + adrese vai pakomāta kods (piegādei obligāts), tālrunis (pēc izvēles, pakomātam pietiek ar e-pastu). Mēs neglabājam kartes numuru.', ru: 'Email (обязательно), имя + адрес или код постамата (для доставки), телефон (по желанию). Номер карты не храним.', lt: 'El. paštas (būtinas), vardas + adresas ar pakomato kodas (pristatymui), telefonas (pasirinktinas). Kortelės numerio nesaugome.', et: 'E-post (kohustuslik), nimi + aadress või automaadi kood (tarneks kohustuslik), telefon (valikuline). Kaardinumbrit me ei salvesta.' },
  'sec.privacy.2.t': { en: "What we don\u2019t collect", lv: 'Ko neievācam', ru: 'Что не собираем', lt: 'Ko nerinkome', et: 'Mida me ei kogu' },
  'sec.privacy.2.b': { en: 'No third-party analytics, no marketing pixels, no behavioural tracking, no profile across visits. Matchmaker picks live only on your device.', lv: 'Bez trešo pušu analītikas, mārketinga pikseļiem vai uzvedības izsekošanas. Savietošanas izvēles glabājas tikai tavā ierīcē.', ru: 'Без сторонней аналитики, маркетинговых пикселей и поведенческого отслеживания. Подборки живут только на устройстве.', lt: 'Be trečiųjų šalių analizės, rinkodaros pikselių ar elgsenos sekimo. Suderinimo pasirinkimai tik tavo įrenginyje.', et: 'Kolmandate poolte analüütikat, reklaampikseleid ega käitumise jälgimist pole. Sobitamise valikud on ainult sinu seadmes.' },
  'sec.privacy.3.t': { en: 'Retention', lv: 'Glabāšana', ru: 'Хранение', lt: 'Saugojimas', et: 'Säilitamine' },
  'sec.privacy.3.b': { en: 'Order data is auto-deleted 30 days after delivery. Anonymised purchase metrics are kept 7 years for tax law. Nothing personally identifies you.', lv: 'Pasūtījuma dati tiek dzēsti 30 dienas pēc piegādes. Anonimizēti rādītāji glabājas 7 gadus nodokļu likuma dēļ. Nekas tevi neidentificē.', ru: 'Данные заказа удаляются через 30 дней. Анонимная статистика хранится 7 лет (налоговый закон).', lt: 'Užsakymo duomenys ištrinami po 30 d. Anoniminiai rodikliai saugomi 7 m. dėl mokesčių.', et: 'Tellimuse andmed kustuvad 30 päeva pärast tarnet. Anonüümseid mõõdikuid hoiame 7 aastat maksuseaduse tõttu.' },
  'sec.privacy.4.t': { en: 'Your rights', lv: 'Tavas tiesības', ru: 'Ваши права', lt: 'Tavo teisės', et: 'Sinu õigused' },
  'sec.privacy.4.b': { en: 'You can request an export or a forced deletion any time at privacy@shhh.lv. We action it within 7 days.', lv: 'Eksportu vai dzēšanu vari pieprasīt: privacy@shhh.lv. Izpildām 7 dienu laikā.', ru: 'Экспорт или удаление: privacy@shhh.lv. Выполним за 7 дней.', lt: 'Eksportą ar ištrynimą: privacy@shhh.lv. Atliekame per 7 d.', et: 'Eksport või kustutus: privacy@shhh.lv. Teostame 7 päeva jooksul.' },

  // ─── Cookies (short) ───
  'sec.cookies.1.t': { en: 'Strictly necessary', lv: 'Stingri nepieciešami', ru: 'Строго необходимые', lt: 'Būtini', et: 'Hädavajalik' },
  'sec.cookies.1.b': { en: 'A single first-party "session" cookie keeps your bag during checkout. Expires when you close the browser.', lv: 'Viens "sesijas" sīkfails saglabā somu pasūtīšanas laikā. Beidzas, aizverot pārlūku.', ru: 'Один сессионный cookie сохраняет корзину. Удаляется при закрытии браузера.', lt: 'Vienas sesijos slapukas saugo krepšį. Pasibaigia uždarius naršyklę.', et: 'Üks seansiküpsis hoiab kotti. Aegub brauseri sulgemisel.' },
  'sec.cookies.2.t': { en: "What we don\u2019t use", lv: 'Ko neizmantojam', ru: 'Что не используем', lt: 'Ko nenaudojame', et: 'Mida me ei kasuta' },
  'sec.cookies.2.b': { en: 'No third-party cookies. No advertising IDs. No Facebook pixel, no Google Analytics, no GA4, no Meta CAPI.', lv: 'Bez trešo pušu sīkfailiem, reklāmas ID, Facebook pikseļa, Google Analytics, GA4 vai Meta CAPI.', ru: 'Без сторонних cookie, рекламных ID, Facebook pixel, Google Analytics, GA4 или Meta CAPI.', lt: 'Be trečiųjų šalių slapukų, reklamos ID, Facebook pikselio, Google Analytics, GA4 ar Meta CAPI.', et: 'Kolmandate poolte küpsiseid, reklaami-ID-sid, Facebook pikslit, Google Analyticsit, GA4-d ega Meta CAPI-t pole.' },
  'sec.cookies.3.t': { en: 'How to clear it', lv: 'Kā iztīrīt', ru: 'Как очистить', lt: 'Kaip išvalyti', et: 'Kuidas tühjendada' },
  'sec.cookies.3.b': { en: 'Browser settings → cookies → clear for shhh.lv. Your bag will reset.', lv: 'Pārlūka iestatījumi → sīkfaili → notīri shhh.lv. Soma atiestatīsies.', ru: 'Настройки браузера → cookies → очистить для shhh.lv. Корзина сбросится.', lt: 'Naršyklės nustatymai → slapukai → išvalyti shhh.lv. Krepšys atsistatys.', et: 'Brauseri sätted → küpsised → tühjenda shhh.lv jaoks. Kott lähtestub.' },

  // ─── Returns ───
  'sec.returns.1.t': { en: '14-day withdrawal rights (EU)', lv: '14 dienu atteikuma tiesības (ES)', ru: '14-дневное право отказа (ЕС)', lt: '14 d. atsisakymo teisė (ES)', et: '14-päevane taganemisõigus (EL)' },
  'sec.returns.1.b': { en: 'Under EU Consumer Rights Directive 2011/83/EU you may withdraw from your purchase within 14 days of receiving the goods, without giving a reason. The period starts the day you (or your nominee) receive the item.', lv: 'Saskaņā ar ES Patērētāju tiesību direktīvu 2011/83/ES tev ir tiesības atteikties no pirkuma 14 dienu laikā no preces saņemšanas bez iemesla norādīšanas. Atteikuma termiņš sākas dienā, kad tu (vai tava norādītā persona) saņem preci.', ru: 'Согласно Директиве ЕС 2011/83/EU вы можете отказаться от покупки в течение 14 дней с момента получения товара без объяснения причин.', lt: 'Pagal ES direktyvą 2011/83/ES gali atsisakyti pirkimo per 14 d. nuo prekės gavimo be priežasties.', et: 'EL direktiivi 2011/83/EL alusel võid ostust taganeda 14 päeva jooksul kaupa kättesaamisest, põhjust esitamata.' },
  'sec.returns.2.t': { en: 'How to exercise withdrawal', lv: 'Kā izmantot atteikuma tiesības', ru: 'Как воспользоваться отказом', lt: 'Kaip pasinaudoti atsisakymu', et: 'Kuidas taganeda' },
  'sec.returns.2.b': { en: 'Notify us within 14 days at returns@shhh.lv with your order number, or use the withdrawal form. Then return the item within 14 days.', lv: 'Paziņo mums par atteikumu 14 dienu laikā, rakstot uz returns@shhh.lv ar pasūtījuma numuru, vai izmantojot atteikuma veidlapu. Pēc tam preci jānosūta atpakaļ 14 dienu laikā.', ru: 'Сообщите в течение 14 дней на returns@shhh.lv с номером заказа. Верните товар в течение 14 дней.', lt: 'Pranešk per 14 d. returns@shhh.lv su užsakymo numeriu. Grąžink prekę per 14 d.', et: 'Teata 14 päeva jooksul returns@shhh.lv tellimuse numbriga. Tagasta toode 14 päeva jooksul.' },
  'sec.returns.3.t': { en: 'Hygiene exemption', lv: 'Higiēnas izņēmums', ru: 'Гигиеническое исключение', lt: 'Higienos išimtis', et: 'Hügieenierand' },
  'sec.returns.3.b': { en: 'EU law (Article 16) allows refusing returns of sealed goods unsuitable for return on health/hygiene grounds once unsealed after delivery. Opened body-contact products cannot be returned unless faulty.', lv: 'ES likums (Direktīvas 16. pants) ļauj atteikt atgriešanu aizzīmogotām precēm, kuras nav piemērotas atgriešanai veselības vai higiēnas apsvērumu dēļ, ja zīmogs pēc piegādes ir noņemts. Atvērtas, ķermeņa kontakta preces nevar atgriezt, ja vien tās nav bojātas.', ru: 'Закон ЕС (ст. 16) позволяет отказать в возврате вскрытых товаров по гигиеническим причинам. Открытые товары для тела не возвращаются, кроме бракованных.', lt: 'ES įstatymas (16 str.) leidžia atsisakyti grąžinti atplėštas higienos prekes. Atidaryti kūno kontakto gaminiai negrąžinami, nebent sugadinti.', et: 'EL seadus (art 16) lubab keelduda avatud hügieenitoodete tagastusest. Avatud kehakontakti tooteid ei tagastata, v.a defektsed.' },

  // ─── 18+ ───
  'sec.age.1.t': { en: 'On signup', lv: 'Reģistrējoties', ru: 'При входе', lt: 'Registruojantis', et: 'Registreerimisel' },
  'sec.age.1.b': { en: "You confirm 18+ with a single tap. We don\u2019t store ID copies.", lv: 'Apstiprini 18+ ar vienu pieskārienu. Mēs neglabājam ID kopijas.', ru: 'Подтверждаете 18+ одним нажатием. Копии ID не храним.', lt: 'Patvirtini 18+ vienu paspaudimu. ID kopijų nesaugome.', et: 'Kinnitad 18+ ühe puudutusega. ID koopiaid me ei salvesta.' },
  'sec.age.2.t': { en: 'At delivery', lv: 'Piegādes brīdī', ru: 'При доставке', lt: 'Pristatant', et: 'Tarnel' },
  'sec.age.2.b': { en: 'Couriers may ask for an ID at the door for high-value orders. Locker pickup uses your one-time code only — no ID needed.', lv: 'Kurjeri var lūgt ID pie durvīm augstas vērtības pasūtījumiem. Pakomātam pietiek ar kodu — ID nav jāuzrāda.', ru: 'Курьер может попросить ID для дорогих заказов. В постамате — только код, без ID.', lt: 'Kurjeris gali paprašyti dokumento brangiems užsakymams. Pakomatui — tik kodas, dokumento nereikia.', et: 'Kuller võib kõrgema väärtusega tellimuste juures küsida ID-d. Automaadis vajad ainult koodi — ID-d pole vaja.' },
  'sec.age.3.t': { en: 'Trust', lv: 'Uzticība', ru: 'Доверие', lt: 'Pasitikėjimas', et: 'Usaldus' },
  'sec.age.3.b': { en: 'We do not sell, supply or display to minors. If you suspect a minor is using your account, contact us and we will lock it.', lv: 'Mēs nepārdodam, nepiegādājam un nerādām nepilngadīgajiem. Ja kāds nepilngadīgais izmanto kontu, sazinies — mēs to bloķēsim.', ru: 'Не продаём и не показываем несовершеннолетним. Сообщите, если подозреваете — заблокируем аккаунт.', lt: 'Nesiūlome ir nerodome nepilnamečiams. Praneškit, jei įtariate — paskyrą užrakinsime.', et: 'Me ei müü ega kuvame alaealistele. Teata, kui kahtlustad — lukustame konto.' },

  // ─── Delete ───
  'sec.delete.1.t': { en: 'What gets deleted', lv: 'Kas tiek dzēsts', ru: 'Что удалится', lt: 'Kas ištrinama', et: 'Mis kustub' },
  'sec.delete.1.b': { en: 'All order data, addresses, email, phone, favourites and any saved matchmaker picks tied to your email.', lv: 'Visi pasūtījuma dati, adreses, e-pasts, tālrunis, iecienītie un savietošanas izvēles.', ru: 'Все данные заказа, адреса, email, телефон, избранное и подборки.', lt: 'Visi užsakymo duomenys, adresai, el. paštas, telefonas, mėgstami ir suderinimai.', et: 'Kogu tellimuse andmed, aadressid, e-post, telefon, lemmikud ja sobitamise valikud.' },
  'sec.delete.2.t': { en: 'What stays', lv: 'Kas paliek', ru: 'Что остаётся', lt: 'Kas lieka', et: 'Mis jääb' },
  'sec.delete.2.b': { en: 'Anonymised invoice totals (required by tax law for 7 years). These contain no identifying data.', lv: 'Anonimizēti rēķinu kopējie skaitļi (nodokļu likums prasa 7 gadus). Tie nesatur identificējošus datus.', ru: 'Анонимные итоги счетов (по налоговому закону 7 лет). Без идентификации.', lt: 'Anoniminės sąskaitų sumos (mokesčių įstatymas — 7 m.). Be tapatybės.', et: 'Anonüümsed arvete kogusummad (maksuseaduse järgi 7 aastat). Tuvastust pole.' },
  'sec.delete.3.t': { en: 'How', lv: 'Kā', ru: 'Как', lt: 'Kaip', et: 'Kuidas' },
  'sec.delete.3.b': { en: 'Tap below or email delete@shhh.lv. We confirm within 24 hours and the deletion runs within 7 days.', lv: 'Spied zemāk vai raksti delete@shhh.lv. Apstiprinām 24 h laikā, dzēsim 7 dienu laikā.', ru: 'Нажмите ниже или напишите delete@shhh.lv. Подтверждаем за 24 ч, удалим за 7 дней.', lt: 'Spausk žemiau arba rašyk delete@shhh.lv. Patvirtinam per 24 val., trinam per 7 d.', et: 'Vajuta all või kirjuta delete@shhh.lv. Kinnitame 24 t jooksul, kustutame 7 päevaga.' },

  // ─── Content page sections (only a few of the most prominent) ───
  // body-safe
  'sec.body-safe.1.t': { en: 'Materials we use', lv: 'Materiāli, ko izmantojam', ru: 'Что используем', lt: 'Naudojamos medžiagos', et: 'Materjalid' },
  'sec.body-safe.1.b': { en: 'Medical-grade platinum-cured silicone (food-contact class VI), aerospace-grade ABS for hard cores, and skin-safe stretch silicone for rings.', lv: 'Medicīniskā platīna silikona (VI klases pārtikas kontakts), kosmiskā kvalitāte ABS un ādai droša stiepjamā silikona gredzeniem.', ru: 'Медицинский платиновый силикон (класс VI), аэрокосмический ABS и эластичный силикон для колец.', lt: 'Medicininės klasės platinos silikonas (maisto kontakto VI klasė), aviacinis ABS ir odai saugus tampaus silikonas žiedams.', et: 'Meditsiiniline plaatina-silikoon (toidukontakti VI klass), kosmosetööstuse ABS ja nahale ohutu venitatav silikoon rõngastele.' },
  'sec.body-safe.2.t': { en: 'What we never use', lv: 'Ko nekad neizmantojam', ru: 'Что не используем', lt: 'Ko niekada nenaudojame', et: 'Mida me iial ei kasuta' },
  'sec.body-safe.2.b': { en: 'No PVC, no phthalates, no parabens, no porous TPR. Every batch passes ISO 10993 cytotoxicity screening.', lv: 'Bez PVH, ftalātiem, parabēniem, porainas TPR. Katra partija iziet ISO 10993 testu.', ru: 'Без ПВХ, фталатов, парабенов, пористого TPR. Каждая партия проходит ISO 10993.', lt: 'Be PVC, ftalatų, parabenų, porėtos TPR. Kiekviena partija — ISO 10993.', et: 'Ei mingit PVC-d, ftalaate, paraabene, poorset TPR-i. Iga partii läbib ISO 10993.' },

  // how it ships (content page, used by route 'how-it-ships' WITHOUT special render — wait,
  // this is special-cased to HowItArrivesScreen, so its 'sections' aren't shown. Skip.

  // faq (3 most-asked)
  'sec.faq.1.t': { en: 'Will my partner / flatmate / mum know?', lv: 'Vai partneris / mājas biedrs / mamma uzzinās?', ru: 'Узнает ли партнёр / сосед / мама?', lt: 'Ar partneris / kambariokas / mama sužinos?', et: 'Kas partner / korterikaaslane / ema saab teada?' },
  'sec.faq.1.b': { en: 'No. Outer box is unmarked. Sender is "NL Trading Co". Statement reads "NL Trading Co". No marketing emails.', lv: 'Nē. Ārējā kaste bez apzīmējumiem. Sūtītājs "NL Trading Co". Bez mārketinga e-pastiem.', ru: 'Нет. Коробка без знаков. Отправитель "NL Trading Co". Никаких рассылок.', lt: 'Ne. Dėžė be ženklų. Siuntėjas "NL Trading Co". Jokio rinkodaros pašto.', et: 'Ei. Karp ilma märkideta. Saatja "NL Trading Co". Reklaamkirju ei tule.' },
  'sec.faq.2.t': { en: 'Do I need an account?', lv: 'Vai vajadzīgs konts?', ru: 'Нужен ли аккаунт?', lt: 'Ar reikia paskyros?', et: 'Kas vajan kontot?' },
  'sec.faq.2.b': { en: 'No. Guest checkout works for everything. An account just keeps favourites and order history.', lv: 'Nē. Viesa pasūtīšana der visam. Konts saglabā iecienītos un vēsturi.', ru: 'Нет. Гостевая оплата подойдёт. Аккаунт только для избранного и истории.', lt: 'Ne. Svečio apmokėjimas tinka. Paskyra tik mėgstamiems ir istorijai.', et: 'Ei. Külalisostlemine sobib. Konto on vaid lemmikute ja ajaloo jaoks.' },

  // ─── PDP description prefix (we keep product-specific desc, but translate generic suffix) ───
};

// ─────────────────────────────────────────────────────────────
// Context + provider
// ─────────────────────────────────────────────────────────────
const LangContext = React.createContext({ lang: 'en', setLang: () => {} });

function LangProvider({ children }) {
  const [lang, setLang] = React.useState('lv');
  // Notify listeners on change so non-context-aware code can react, and keep
  // the document language in sync so screen readers use the right pronunciation
  // (all switcher codes — lv/ru/en/lt/et — are valid BCP-47 primary subtags).
  React.useEffect(() => {
    try { document.documentElement.lang = lang; } catch (e) {}
    window.dispatchEvent(new CustomEvent('shhh-lang-change', { detail: lang }));
  }, [lang]);
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

function useLang() {
  return React.useContext(LangContext);
}

function useT() {
  const { lang } = useLang();
  return (key, fallback) => {
    const entry = LANG_STRINGS[key];
    if (!entry) return fallback != null ? fallback : key;
    return entry[lang] || entry.en || (fallback != null ? fallback : key);
  };
}

// ── CMS string overrides ─────────────────────────────────────
// The admin "Strings" editor writes per-key, per-language overrides under
// 'shhh_cms_v1'.__strings; merge them into LANG_STRINGS so edited UI labels
// (nav, footer, home, etc.) appear on the storefront.
function __shhhApplyStrings() {
  try {
    const cms = JSON.parse(localStorage.getItem('shhh_cms_v1') || '{}');
    const s = cms.__strings || {};
    Object.keys(s).forEach(key => { LANG_STRINGS[key] = Object.assign({}, LANG_STRINGS[key], s[key]); });
  } catch (e) {}
}
window.__shhhApplyStrings = __shhhApplyStrings;
__shhhApplyStrings();

Object.assign(window, { LANG_STRINGS, LangContext, LangProvider, useLang, useT });
