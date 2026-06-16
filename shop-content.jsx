// shop-content.jsx — content pages for footer links + SEO (Trust, Support, Blog).
// Each key renders via the unified <ContentScreen /> rendered from ShopApp.

const CONTENT_PAGES = {
  'about': {
    kicker: 'Par mums', title: 'Par Shhh', sub: 'Diskrēts pieaugušo veikals, kas dibināts Rīgā.',
    sections: [
      ['Kas mēs esam', 'Shhh ir tiešsaistes pieaugušo veikals, ko vada NL Trading Co SIA (reģ. 40203456789), reģistrēts Rīgā, Latvijā. Mēs piedāvājam ķermenim drošas intīmpreces ar diskrētu piegādi visā Baltijā.'],
      ['Mūsu princips', 'Privātums pirmajā vietā. Vienkārša kaste bez logo, anonīms maksājums ar izrakstu "NL Trading Co", un klientu datu dzēšana 30 dienas pēc piegādes. Bez mārketinga e-pastiem.'],
      ['Kvalitāte', 'Visi silikona produkti ir medicīniskas klases, neporaini un hipoalerģiski. Katra partija iziet ISO 10993 laboratorijas testu. Mēs nepārdodam PVH vai neskaidrus "TPE maisījumus".'],
      ['Kontakti', 'support@shhh.lv · +371 6700 0000 · Brīvības iela 68-14, Rīga, LV-1011. Atbildam 24 stundu laikā, katru dienu.'],
      ['Rekvizīti / Impressum', 'Juridiskais nosaukums: NL Trading Co SIA · Reģistrācijas Nr.: 40203456789 · PVN Nr.: LV40203456789 · Juridiskā adrese: Brīvības iela 68-14, Rīga, LV-1011, Latvija · Valde: vienpersoniska · Reģistrs: Latvijas Republikas Uzņēmumu reģistrs · E-pasts: legal@shhh.lv · Tālrunis: +371 6700 0000 · Banka: Citadele banka, IBAN LV00 PARX 0000 0000 0000 0. Atbildīgā persona par saturu saskaņā ar ES/EEZ informācijas prasībām: NL Trading Co SIA valde.'],
    ],
  },
  // ── Brand pages (SEO: "<brand> Latvija") ──
  'brand-pulse': {
    kicker: 'Zīmols', title: 'Pulse', sub: 'Gaisa plūsmas tehnoloģija no Vācijas.',
    sections: [
      ['Par zīmolu', 'Pulse ir vācu zīmols, kas pazīstams ar gaisa plūsmas (pneimatisko) klitora stimulatoru tehnoloģiju. Klusi, ūdensizturīgi un ķermenim droši produkti ar daudzgadu garantiju.'],
      ['Populārākie', 'Mūsu Hush 01 un Echo modeļi izmanto līdzīgu pieeju — maiga, bezkontakta stimulācija ar medicīniskas klases silikonu.'],
      ['Garantija un piegāde', 'Visiem Pulse produktiem 2 gadu garantija, diskrēta piegāde Baltijā 24h, anonīms maksājums.'],
    ],
  },
  'brand-velura': {
    kicker: 'Zīmols', title: 'Velura', sub: 'Pāru rotaļlietas un tālvadība.',
    sections: [
      ['Par zīmolu', 'Velura specializējas pāru stimulatoros un attālināti vadāmās rotaļlietās. Mūsu Velvet un Halo modeļi iemieso šo filozofiju.'],
      ['Tehnoloģija', 'Bluetooth tālvadība līdz 8 m, lietotnes savienojums, mīksts izstiepjams silikons.'],
      ['Kāpēc pie mums', 'Oriģinālprodukti, diskrēta kaste, bezmaksas atgriešana 30 dienu laikā.'],
    ],
  },
  'brand-lumen': {
    kicker: 'Zīmols', title: 'Lumen', sub: 'Premium dizains un lietotnes vadība.',
    sections: [
      ['Par zīmolu', 'Lumen ir luksusa zīmols ar aerokosmiskiem materiāliem un viedtālruņa lietotnes vadību. Mūsu Glow modelis ir šīs kategorijas flagmanis.'],
      ['Iespējas', 'Sildoši uzgaļi, 16+ vibrācijas režīmi, personalizējami ritmi caur lietotni, 2h akumulators.'],
      ['Garantija', 'Mūža garantija izvēlētiem modeļiem. Diskrēta piegāde, anonīms maksājums.'],
    ],
  },
  // ── Buyer guides (SEO: high-intent informational) ──
  'guide-first-vibrator': {
    kicker: 'Ceļvedis', title: 'Kā izvēlēties pirmo vibratoru', sub: 'Pilns ceļvedis iesācējiem — izmērs, materiāls, jauda.',
    published: '20 May 2026', readMin: 5,
    sections: [
      ['Sāc ar izmēru', 'Iesācējiem ieteicams sākt ar mazāku, plaukstā ietilpstošu modeli (piemēram, Echo vai Hush 01). Tie ir mazāk iebiedējoši un viegli vadāmi ar vienu pogu.'],
      ['Materiāls ir svarīgākais', 'Izvēlies medicīniskas klases silikonu — tas ir neporains, hipoalerģisks un viegli tīrāms. Izvairies no neskaidriem "TPE maisījumiem" un PVH.'],
      ['Klusums', 'Ja dzīvo ar citiem vai plānām sienām, izvēlies modeli ar ≤32 dB rādītāju — tas ir "čukstam kluss".'],
      ['Jauda un režīmi', '5–8 režīmi ir vairāk nekā pietiekami iesācējam. Vairāk režīmu nenozīmē labāk — svarīgāka ir intensitātes pakāpeniska regulēšana.'],
      ['Lubrikants', 'Vienmēr ūdens bāzes silikona produktiem. Silikona bāzes lubrikants bojā silikona virsmu.'],
    ],
    shopHeadline: 'Iesācēju izlase', shopSub: 'Trīs draudzīgākie modeļi pirmajai pieredzei:',
    shopIds: ['echo', 'hush-01', 'murmur'],
  },
  'guide-lube': {
    kicker: 'Ceļvedis', title: 'Ūdens vs silikona lubrikants', sub: 'Kurš kuram piemērots un kāpēc.',
    published: '18 May 2026', readMin: 4,
    table: {
      head: ['', 'Ūdens', 'Silikona', 'Hibrīds'],
      rows: [
        ['Silikona rotaļlietas', '✓ Drošs', '✗ Bojā', '⚠ Pārbaudi'],
        ['Prezervatīvi', '✓ Drošs', '✓ Drošs', '✓ Drošs'],
        ['Dušā / vannā', '✗ Izskalojas', '✓ Noturīgs', '⚠ Daļēji'],
        ['Slīdamība', 'Vidēja', 'Augsta', 'Augsta'],
        ['Tīrīšana', 'Viegla', 'Vajag ziepes', 'Vidēja'],
      ],
    },
    sections: [
      ['Ūdens bāzes', 'Universāls, drošs ar visiem materiāliem un prezervatīviem, viegli notīrāms. Ātrāk izžūst — vajadzīga atkārtota uzklāšana.'],
      ['Silikona bāzes', 'Ilgāk slīd, ūdensizturīgs (lielisks dušai), bet BOJĀ silikona rotaļlietas. Lieto tikai ar stiklu, metālu vai ABS.'],
      ['Hibrīds', 'Ūdens-silikona maisījums — kompromiss starp slīdamību un saderību. Pārbaudi materiālu pirms lietošanas.'],
      ['Mūsu ieteikums', 'Silikona rotaļlietām — vienmēr ūdens bāzes. Tas ir drošākais un visplašāk saderīgais.'],
    ],
    shopHeadline: 'Lubrikanti', shopSub: 'Ūdens bāzes — drošs visam:',
    shopIds: ['drift', 'echo'],
  },
  // ── Glossary (SEO: long-tail definitions) ──
  'reviews': {
    kicker: 'Atsauksmes', title: 'Atsauksmes', sub: 'Ko saka mūsu klienti.',
    isReviews: true,
  },
  'accessibility': {
    kicker: 'Juridiski', title: 'Pieejamība', sub: 'Mūsu apņemšanās par piekļūstamību visiem.',
    intro: 'Mēs tiecamies, lai shhh.lv būtu ērti lietojams ikvienam, tostarp cilvēkiem ar redzes, dzirdes, kustību vai kognitīviem traucējumiem. Mūsu mērķis ir atbilstība WCAG 2.1 AA līmenim.',
    sections: [
      ['Standarts', 'Mēs vadāmies pēc Web Content Accessibility Guidelines (WCAG) 2.1 AA līmeņa un gatavojamies ES Pieejamības aktam (European Accessibility Act), kas stājas spēkā 2025. gada 28. jūnijā.'],
      ['Ko esam īstenojuši', 'Tastatūras navigācija visā vietnē · aria-label apzīmējumi pogām un ikonām · alt teksti produktu attēliem · pietiekams krāsu kontrasts · teksta izmēra maiņa bez satura zuduma · skaidri fokusa stāvokļi.'],
      ['Zināmie ierobežojumi', 'Daži dekoratīvie emoji var tikt nolasīti ekrāna lasītājos; strādājam pie to slēpšanas. Video pamācībām pievienosim subtitrus un transkriptus.'],
      ['Ziņo par šķērsli', 'Ja saskaries ar pieejamības problēmu, raksti access@shhh.lv. Atbildēsim 5 darbdienu laikā un piedāvāsim alternatīvu veidu, kā pabeigt darbību.'],
      ['Pēdējā pārskatīšana', 'Šis paziņojums pēdējoreiz pārskatīts 2026. gada 29. maijā un tiek atjaunināts reizi ceturksnī.'],
    ],
  },
  'gdpr': {
    kicker: 'Juridiski', title: 'Datu pieprasījums (GDPR)', sub: 'Izmanto savas datu tiesības saskaņā ar VDAR.',
    intro: 'Saskaņā ar ES Vispārīgo datu aizsardzības regulu (VDAR / GDPR) tev ir tiesības piekļūt saviem datiem, tos labot, dzēst, ierobežot apstrādi, iebilst un saņemt tos pārnesamā formātā. Aizpildi veidlapu, un mēs atbildēsim 30 dienu laikā (VDAR 12. pants).',
    formKind: 'gdpr',
  },
  'glossary': {
    kicker: 'Vārdnīca', title: 'Vārdnīca', sub: 'Īsi skaidrojumi galvenajiem terminiem.',
    sections: [
      ['Vibroola', 'Maza, ovāla formas vibrators, ko var vadīt ar tālvadību vai lietotni. Ideāls diskrētai stimulācijai.'],
      ['Gaisa plūsmas stimulators', 'Ierīce, kas rada pulsējošu gaisa spiedienu klitora bezkontakta stimulācijai.'],
      ['Prostatas masāža', 'Vīriešu iekšējā stimulācija ar īpaši izliektu ierīci. Sāc lēni un ar daudz lubrikanta.'],
      ['IPX7', 'Ūdensizturības standarts — produktu var iegremdēt ūdenī līdz 30 minūtēm.'],
      ['Medicīniskas klases silikons', 'Neporains, hipoalerģisks materiāls, kas ir drošs ķermeņa kontaktam un viegli tīrāms.'],
      ['Banklink', 'Tiešais bankas maksājums (Citadele, Swedbank, SEB, Luminor) — mēs neredzam tavus bankas datus.'],
    ],
  },
  'shipping-policy': {
    kicker: 'Trust', title: 'Piegādes politika', sub: 'Izmaksas, zonas un piegādes laiki.',
    intro: 'Visi sūtījumi tiek nosūtīti vienkāršā, neapzīmētā kastē ar sūtītāju "NL Trading Co". Pasūtījumus, kas veikti darbdienās līdz 16:00 EET, nosūtām tajā pašā dienā. Zemāk — pilnas izmaksas un laiki katrai zonai un kurjeram.',
    table: {
      head: ['Zona / kurjers', 'Laiks', 'Cena'],
      rows: [
        ['Rīga · Omniva pakomāts', '1 d. d.', '€2,50'],
        ['Rīga · DPD Pickup', '1 d. d.', '€3,50'],
        ['Rīga · piegāde līdz durvīm', '1–2 d. d.', '€4,50'],
        ['Latvija · pakomāts', '1–2 d. d.', '€2,50'],
        ['Latvija · līdz durvīm', '2–3 d. d.', '€4,50'],
        ['Lietuva / Igaunija · pakomāts', '2–3 d. d.', '€3,90'],
        ['Lietuva / Igaunija · līdz durvīm', '3–4 d. d.', '€5,90'],
        ['Visi pasūtījumi virs €60', '—', 'Bezmaksas'],
      ],
    },
    sections: [
      ['Bezmaksas piegāde', 'Pasūtījumiem virs €60 piegāde uz pakomātu ir bezmaksas visā Baltijā. Slieksnis tiek rēķināts pēc atlaižu piemērošanas.'],
      ['Nosūtīšanas laiks', 'Pasūtījumus, kas veikti darbdienās līdz 16:00 EET, nosūtām tajā pašā dienā. Vēlāk veiktie — nākamajā darbdienā. Brīvdienās un svētkos nesūtām.'],
      ['Kurjeri', 'Omniva, Latvijas Pasts (Pastomat), DPD un Venipak pakomāti, kā arī piegāde līdz durvīm caur DPD vai Omniva kurjeru. Pakomātu piegāde ir pilnībā anonīma.'],
      ['Izsekošana', 'Pēc nosūtīšanas saņemsi vienu e-pastu ar izsekošanas saiti. Mēs nesūtām SMS, izņemot, ja to pieprasa kurjers piegādei līdz durvīm.'],
      ['Saņemšana', 'Pakomāta sūtījumi tiek glabāti 7 dienas. Pēc koda saņemšanas e-pastā tos var izņemt jebkurā laikā. Neizņemtie sūtījumi tiek atgriezti, un nauda atmaksāta 5 darbdienu laikā.'],
      ['Starptautiski', 'Pašlaik piegādājam tikai Baltijas valstīs (LV, LT, EE). Piegāde ārpus Baltijas pagaidām nav pieejama.'],
    ],
  },
  'how-it-ships': {
    kicker: 'Trust', title: 'How it ships',
    sub: 'Plain box, next-day across the Baltics.',
    sections: [
      ['Plain outer carton', 'Blank brown box. No logo, no product name, no sender hint on the outside. Return label reads "NL Trading Co".'],
      ['Couriers', 'Omniva (locker), Pastomat / Latvijas Pasts (locker), DPD (pickup point or door), Venipak (locker), or "Door delivery" via DPD or Omniva courier.'],
      ['Speed', 'Order by 16:00 EET → ships the same day. Locker pickup: 1–2 business days. Door delivery: 1–2 business days.'],
      ['Tracking', 'One email with the tracking link. No SMS unless your courier requires it for door delivery.'],
    ],
  },
  'payment-methods': {
    kicker: 'Trust', title: 'Maksājumu veidi', sub: 'Visi droši, visi diskrēti. Izrakstā vienmēr "NL Trading Co".',
    intro: 'Pieņemam tapināmos (tap) maksājumus, Latvijas banku tiešmaksājumus (banklink) un kartes. Neviens no tiem neatklāj, ko esi iegādājies — bankas izrakstā parādās tikai "NL Trading Co".',
    table: {
      head: ['Veids', 'Anonīms', 'Piezīme'],
      rows: [
        ['Apple Pay', '✓', 'Face ID · karte netiek dalīta'],
        ['Google Pay', '✓', 'Tap to pay'],
        ['Citadele banklink', '✓', 'Tiešmaksājums no konta'],
        ['Swedbank banklink', '✓', 'Tiešmaksājums no konta'],
        ['SEB banklink', '✓', 'Tiešmaksājums no konta'],
        ['Luminor banklink', '✓', 'Tiešmaksājums no konta'],
        ['Karte (Visa/MC/Amex)', '—', '3D Secure · tokenizēta'],
        ['Inbank — uz nomaksu', '—', 'Sadali maksājumu 3–36 mēnešos'],
        ['Klix by Citadele — vēlāk', '—', 'Maksā vēlāk vai pa daļām'],
      ],
    },
    sections: [
      ['Tapināmie maksājumi', 'Apple Pay un Google Pay ir ātrākais un drošākais veids. Tavs karte numurs nekad nesasniedz mūsu serverus — saņemam tikai vienreizēju tokenu. Apstiprini ar Face ID vai pirkstu nospiedumu.'],
      ['Banklink — Latvijas bankas', 'Maksā tieši no sava Citadele, Swedbank, SEB vai Luminor konta. Maksājums notiek tieši starp bankām — mēs saņemam tikai "jā/nē" apstiprinājumu, nevis tavus bankas datus.'],
      ['Karte', 'Pieņemam Visa, Mastercard un American Express. Maksājumus apstrādā Stripe ar 3D Secure aizsardzību; kartes dati tiek tokenizēti un netiek glabāti pie mums.'],
      ['Uz nomaksu — Inbank', 'Sadali pirkumu ērtos ikmēneša maksājumos ar Inbank līzingu (3–36 mēneši). Pieteikšanās aizņem dažas minūtes, lēmums ir tūlītējs. Diskrētums saglabājas — līgumā parādās "NL Trading Co".'],
      ['Maksā vēlāk — Klix by Citadele', 'Ar Klix vari samaksāt vēlāk vai sadalīt summu daļās bez procentiem. Pieejams pie apmaksas, apstiprinājums dažu sekunžu laikā. Ideāli lielākiem pirkumiem.'],
      ['Bankas izraksts', 'Neatkarīgi no izvēlētā veida, maksājums izrakstā parādās kā "NL Trading Co" — vispārīgs, neidentificējams nosaukums bez atsauces uz mums vai pirkumu.'],
      ['Atmaksa', 'Atmaksa notiek pa to pašu kanālu: karte uz karti, banklink atpakaļ uz kontu, maks uz maku. "NL Trading Co" apraksts sakrīt ar sākotnējo maksājumu.'],
      ['Drošība', 'Visi maksājumi ir šifrēti ar TLS 1.3. Mēs neuzglabājam kartes numurus. Atbilstība PCI-DSS standartam caur mūsu maksājumu partneriem.'],
    ],
  },
  'anonymous-billing': {
    kicker: 'Trust', title: 'Anonymous billing',
    sub: 'Nothing recognisable on your bank statement.',
    sections: [
      ['Statement descriptor', 'Charges appear as "NL TRADING CO RIGA LV" on your card or banklink statement. No product name, no adult-shop reference.'],
      ['How we pay our processor', 'Card payments are processed by Stripe; banklinks by Klix. Neither sees product names.'],
      ['Receipts', 'Email receipts use the same generic "NL Trading Co" header. You can request a non-itemised invoice in your account.'],
    ],
  },
  'certification': {
    kicker: 'Trust', title: 'Sertifikāti un testēšana', sub: 'Visi standarti, ko mūsu produkti atbilst.',
    intro: 'Katrs elektroniskais produkts ir CE marķēts un atbilst ES drošības direktīvām. Atbilstības deklarācijas (DoC) un laboratorijas testu pārskati ir pieejami pēc pieprasījuma — raksti compliance@shhh.lv.',
    table: {
      head: ['Standarts', 'Ko sedz', 'Attiecas uz'],
      rows: [
        ['CE', 'ES atbilstības marķējums', 'Visi elektroniskie'],
        ['LVD 2014/35/ES', 'Zemsprieguma drošība', 'Uzlādējamie'],
        ['EMC 2014/30/ES', 'Elektromagnētiskā saderība', 'Visi elektroniskie'],
        ['RED 2014/53/ES', 'Radioiekārtas (Bluetooth)', 'Lietotnes / tālvadība'],
        ['RoHS', 'Bīstamo vielu ierobežojums', 'Aparatūra'],
        ['REACH', 'Ķīmiskā drošība, pigmenti', 'Visi materiāli'],
        ['ISO 10993', 'Bioloģiskā saderība (citotoks.)', 'Ķermeņa kontakts'],
        ['Bateriju regula 2023/1542', 'Li-ion akumulatori', 'Uzlādējamie'],
      ],
    },
    sections: [
      ['Atbilstības deklarācija (DoC)', 'Katram produktam ir ES atbilstības deklarācija un tehniskā dokumentācija, ko glabājam saskaņā ar likumu. Kopiju vari pieprasīt jebkurā laikā: compliance@shhh.lv.'],
      ['Laboratorijas testi', 'Neatkarīga laboratorija Tallinā veic ISO 10993 citotoksicitātes testus, smago metālu (Pb, Cd, As, Hg) un ftalātu analīzi katrai partijai. Rezultātus glabājam 5 gadus.'],
      ['Materiālu drošība', 'Visi silikona produkti ir medicīniskas klases, neporaini, hipoalerģiski, bez ftalātiem un PVH. Pigmenti atbilst REACH prasībām.'],
      ['Ražotājs un importētājs', 'Saskaņā ar ES Vispārīgo produktu drošības regulu (GPSR 2023/988) atbildīgais uzņēmējs ES tirgū: NL Trading Co SIA, Brīvības iela 68-14, Rīga, LV-1011. Katra produkta ražotāja informācija norādīta uz iepakojuma un produkta lapā.'],
      ['Akumulatori un utilizācija', 'Li-ion akumulatori atbilst ES Bateriju regulai. Nolietotos produktus pieņemam atpakaļ bezmaksas pārstrādei — raksti support@shhh.lv.'],
    ],
  },
  'body-safe': {
    kicker: 'Trust', title: 'Body-safe materials',
    sub: 'Medical-grade, lab-tested, phthalate-free.',
    sections: [
      ['Materials we use', 'Medical-grade platinum-cured silicone (food-contact class VI), aerospace-grade ABS for hard cores, and skin-safe stretch silicone for rings.'],
      ['What we never use', 'No PVC, no phthalates, no parabens, no porous TPR. Every batch passes ISO 10993 cytotoxicity screening at an independent lab in Tallinn.'],
      ['Certifications', 'CE-marked low-voltage rechargeable products. RoHS for hardware. REACH-compliant pigments.'],
      ['Sertifikāti un testi', 'Pilns standartu saraksts un testu pārskati — skati mūsu Sertifikātu un testēšanas lapā.'],
      ['Care', 'Rinse warm with a drop of mild soap. Air dry. Water-based lubricants only — silicone-based will degrade silicone shells.'],
    ],
  },
  'free-returns': {
    kicker: 'Trust', title: 'Free returns',
    sub: '30 days, no questions asked.',
    sections: [
      ['14 dienu atteikuma tiesības (ES)', 'Saskaņā ar ES Patērētāju tiesību direktīvu 2011/83/ES tev ir tiesības atteikties no pirkuma 14 dienu laikā no preces saņemšanas bez iemesla norādīšanas. Atteikuma termiņš sākas dienā, kad tu (vai tava norādītā persona) saņem preci.'],
      ['Kā izmantot atteikuma tiesības', 'Paziņo mums par atteikumu 14 dienu laikā, rakstot uz returns@shhh.lv ar pasūtījuma numuru, vai izmantojot atteikuma veidlapu. Pēc tam preci jānosūta atpakaļ 14 dienu laikā.'],
      ['Higiēnas izņēmums', 'ES likums (Direktīvas 16. pants) ļauj atteikt atgriešanu aizzīmogotām precēm, kuras nav piemērotas atgriešanai veselības vai higiēnas apsvērumu dēļ, ja zīmogs pēc piegādes ir noņemts. Tāpēc atvērtas, ķermeņa kontakta preces nevar atgriezt, ja vien tās nav bojātas.'],
      ['Atteikuma logs', '14 dienu likumiskās atteikuma tiesības + mūsu brīvprātīgā 30 dienu politika neatvērtām, aizzīmogotām precēm. Izvēlies, kurš tev izdevīgāks.'],
      ['Bojātas preces', 'Bojāta piegādē vai pārstāj darboties 2 gadu garantijas laikā? Nomainām bez maksas. Raksti support@shhh.lv. Tas neietekmē tavas likumiskās tiesības.'],
      ['Kā atgriezt', 'Nomet jebkurā Omniva vai DPD pakomātā ar apmaksāto etiķeti, ko nosūtām e-pastā 1 stundas laikā pēc atgriešanas pieprasījuma.'],
      ['Atmaksa', 'Atmaksu veicam 14 dienu laikā no atteikuma paziņojuma saņemšanas (parasti 5 darbdienās pēc preces saņemšanas) — pa to pašu maksājuma kanālu, ko izmantoji pirkumam.'],
      ['Atteikuma veidlapa', 'Lejupielādējamā ES standarta atteikuma veidlapa ir pieejama pēc pieprasījuma: raksti returns@shhh.lv un nosūtīsim PDF.'],
    ],
  },
  'order-lookup': {
    kicker: 'Support', title: 'Mani pasūtījumi',
    sub: 'Atrodi pasūtījumu pēc numura.',
    isOrderLookup: true,
  },
  'faq': {
    kicker: 'Support', title: 'FAQ',
    sub: 'The questions we get most often.',
    isFaq: true,
    sections: [
      ['Will my partner / flatmate / mum know?', 'No. Outer box is unmarked. Sender is "NL Trading Co". Statement reads "NL Trading Co". No marketing emails, ever.'],
      ['Do I need an account?', 'No. Guest checkout works for everything. An account just keeps your favourites and order history across visits.'],
      ['Which lubricants are safe with silicone?', 'Water-based only. Silicone-based lubricants degrade silicone shells.'],
      ['Can I change my address after ordering?', 'Yes, until the order ships. Email support@shhh.lv with your ref number.'],
      ['Is shipping insured?', 'Yes — full replacement value via Omniva, DPD, Latvijas Pasts and Venipak. If a parcel is lost we replace it at no cost.'],
    ],
  },
  'contact': {
    kicker: 'Support', title: 'Contact',
    sub: 'A human reads everything. We answer within 24 h.',
    sections: [
      ['Email', 'support@shhh.lv — general support, returns, missing parcels.'],
      ['Privacy', 'privacy@shhh.lv — data export or deletion requests.'],
      ['Press', 'press@shhh.lv — interviews, samples, journalism.'],
      ['Address', 'NL Trading Co SIA · Brīvības iela 68 – 14 · Rīga, LV-1011 · Latvia. No walk-ins — this is a registered office only.'],
      ['Phone', '+371 6700 0000 · Mon–Fri 10:00–17:00 EET. We don\'t mention the brand when we pick up; just say "yes, I\'m calling about an order."'],
    ],
  },
  'usage': {
    kicker: 'Support', title: 'Lietošanas instrukcijas',
    sub: 'Soli pa solim — kā lietot katru produktu droši un baudpilni.',
    isUsage: true,
  },
  'size-material': {
    kicker: 'Ceļvedis', title: 'Izmēru un materiālu ceļvedis', sub: 'Viss, kas jāzina par izmēriem un materiāliem vienuviet.',
    intro: 'Pareizs izmērs un materiāls ir svarīgākais komforta un drošības faktors. Šis ceļvedis apkopo apģērbu izmēru tabulu, materiālu salīdzinājumu un saderību ar lubrikantiem.',
    clothingTable: {
      head: ['Izmērs', 'ES', 'Krūtis (cm)', 'Viduklis (cm)', 'Gurni (cm)'],
      rows: [
        ['XS', '32–34', '76–80', '60–64', '84–88'],
        ['S', '36', '84–88', '66–70', '90–94'],
        ['M', '38–40', '90–96', '72–78', '96–102'],
        ['L', '42', '98–104', '80–86', '104–110'],
        ['XL', '44–46', '106–112', '88–96', '112–118'],
        ['XXL', '48–50', '114–122', '98–106', '120–128'],
      ],
    },
    table: {
      head: ['Materiāls', 'Lubrikants', 'Tīrīšana', 'Porains'],
      rows: [
        ['Medicīniskas klases silikons', 'Ūdens bāzes', 'Ziepes + ūdens', '✗ Nē'],
        ['Stikls', 'Jebkurš', 'Ziepes / trauku mazg.', '✗ Nē'],
        ['ABS plastmasa', 'Jebkurš', 'Slaucīt mitru', '✗ Nē'],
        ['Nerūsējošs tērauds', 'Jebkurš', 'Vāra / dezinf.', '✗ Nē'],
        ['TPE / TPR', 'Ūdens bāzes', 'Rūpīga žāvēšana', '⚠ Jā'],
        ['Lateksa', 'Ūdens bāzes', 'Vienreizlietojams', '⚠ Jā'],
      ],
    },
    sections: [
      ['Kā izmērīt izmēru', 'Garums tiek mērīts no pamatnes līdz galam; ievadāmais garums (insertable) ir īsāks par kopējo. Apkārtmērs (circumference) ir svarīgāks par diametru — izmēri to mērlentē platākajā vietā.'],
      ['Izmēru kategorijas', 'Mini (< 10 cm) iesācējiem un ceļojumiem. Vidējs (10–16 cm) — universāls. Liels (16 cm+) pieredzējušiem. Anālajiem produktiem vienmēr sāc ar mazāko izmēru un pakāpeniski palielini.'],
      ['Silikons — zelta standarts', 'Medicīniskas klases platīna silikons ir neporains, hipoalerģisks, viegli tīrāms un noturīgs. Lieto tikai ar ūdens bāzes lubrikantu — silikona bāzes lubrikants bojā virsmu.'],
      ['Stikls un metāls', 'Neporaini, viegli sterilizējami, saderīgi ar visiem lubrikantiem. Notur temperatūru — var atdzesēt vai sasildīt patīkamākai izjūtai.'],
      ['Porainie materiāli (TPE, lateks)', 'Porainie materiāli uzsūc baktērijas un nav pilnībā sterilizējami. Lieto ar prezervatīvu un nomaini biežāk. Vienmēr izvēlies neporainu, ja iespējams.'],
      ['Drošības pārbaude', 'Visi mūsu produkti ir ftalātu un PVH brīvi, ar ISO 10993 sertifikātu. Šaubu gadījumā — raksti support@shhh.lv, palīdzēsim izvēlēties.'],
    ],
    shopHeadline: 'Droši materiāli', shopSub: 'Silikona un premium izvēle:',
    shopIds: ['glow', 'hush-01', 'velvet'],
  },
  'care-guides': {
    kicker: 'Support', title: 'Care guides',
    sub: 'How to keep each product happy.',
    sections: [
      ['Silicone (medical-grade)', 'Rinse warm with a drop of mild fragrance-free soap. Air dry. Store in the soft pouch provided. Water-based lubes only.'],
      ['ABS + silicone hybrids', 'Surface-clean the ABS with a damp cloth; don\'t submerge if the product isn\'t IPX7. Silicone surfaces follow silicone rules.'],
      ['Rechargeable batteries', 'Keep above 20% charge. Don\'t leave plugged in once full. Travel with 50% charge — heat plus 100% wears Li-ion fastest.'],
      ['Travel', 'TSA-friendly. Lockable cases are included with Drift and Glow. Take batteries out of luggage on long-haul flights if you can.'],
    ],
  },

  // SEO-friendly journal index + posts
  'journal': {
    kicker: 'Journal', title: 'The Shhh Journal',
    sub: 'Plain-spoken writing on bodies, pleasure and design.',
    isIndex: true,
  },
  'journal-body-safe-explainer': {
    kicker: 'Journal · Materials', title: 'What "body-safe" actually means',
    sub: 'A 3-minute primer on silicone grades, phthalates and lab tests.',
    published: '14 Apr 2026',
    readMin: 3,
    sections: [
      ['The short version', 'Body-safe means a product is made from non-porous, non-toxic materials that don\'t leach plasticisers, heavy metals or VOCs into skin or mucosa.'],
      ['Silicone grades', 'Look for "platinum-cured medical-grade silicone." Avoid TPE, TPR, jelly, "silicone blend" and PVC — all porous, all questionable.'],
      ['The phthalate question', 'Phthalates soften plastics. Several are endocrine disruptors and banned in EU toys. Silicone doesn\'t need them; PVC almost always contains them.'],
      ['Lab tests', 'ISO 10993 cytotoxicity, REACH-compliance for pigments, and ROHS for the hardware. We publish certificates of analysis per batch — ask for yours.'],
    ],
    shopHeadline: 'Body-safe by default',
    shopSub: 'Every piece in the catalogue passes ISO 10993. These three are the most reached-for:',
    shopIds: ['hush-01', 'echo', 'glow'],
  },
  'journal-locker-vs-door': {
    kicker: 'Journal · Discretion', title: 'Locker vs door — which is more discreet?',
    sub: 'Both work. One is invisible to neighbours and flatmates.',
    published: '03 Mar 2026',
    readMin: 2,
    sections: [
      ['Locker', 'Your name appears only on the locker screen, briefly, when you scan the code. Nobody else can see it. No knock at the door.'],
      ['Door delivery', 'The courier has your name on the manifest. The parcel itself is unmarked. Good if you live alone or are home reliably.'],
      ['Recommendation', 'If discretion matters most, lockers win. If you\'re never home, door delivery still beats waiting for a redelivery.'],
    ],
    shopHeadline: 'Travel-quiet picks',
    shopSub: 'Pocket-sized, locker-friendly, whisper-quiet:',
    shopIds: ['murmur', 'drift', 'hush-01'],
  },
  'journal-first-toy': {
    kicker: 'Journal · Beginners', title: 'Buying your first toy',
    sub: 'A gentle guide. No expertise required.',
    published: '11 Jan 2026',
    readMin: 4,
    sections: [
      ['Start small', 'A palm-sized silicone pebble (like Hush 01 or Echo) is the friendliest entry. Soft, quiet, one button.'],
      ['Quiet matters', 'Decibel rating ≤ 32 dB is "whisper-quiet" — fine in a thin-walled apartment.'],
      ['Materials first', 'Pick silicone over anything plastic-y. It\'s the easiest to clean and the kindest to skin.'],
      ['Water-based lube', 'Always. Silicone lubes degrade silicone shells over time.'],
    ],
    shopHeadline: 'Friendly first picks',
    shopSub: 'Three pieces designed for first-timers — all silicone, all sub-32 dB:',
    shopIds: ['echo', 'hush-01', 'murmur'],
  },
};

const JOURNAL_INDEX = [
  'journal-body-safe-explainer',
  'journal-locker-vs-door',
  'journal-first-toy',
];

// ─────────────────────────────────────────────────────────────
// ContentScreen — unified renderer for footer / SEO pages
// ─────────────────────────────────────────────────────────────
function ContentScreen({ theme, nav, params }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const key = params?.key || 'how-it-ships';
  const SLUG_T = {
    'how-it-ships': 'pg.how', 'anonymous-billing': 'pg.anonbill', 'body-safe': 'pg.bodysafe',
    'free-returns': 'pg.freeret', 'order-lookup': 'pg.lookup', 'faq': 'pg.faq',
    'contact': 'pg.contact', 'care-guides': 'pg.care', 'usage': 'pg.usage', 'journal': 'pg.journal', 'about': 'pg.about', 'shipping-policy': 'pg.shipping', 'payment-methods': 'pg.payment', 'size-material': 'pg.sizemat', 'reviews': 'pg.reviews', 'gdpr': 'pg.gdpr', 'certification': 'pg.cert', 'accessibility': 'pg.access',
  };
  const tKey = SLUG_T[key];
  const page = CONTENT_PAGES[key] || CONTENT_PAGES['how-it-ships'];
  const [ref, setRef] = React.useState('');

  // Special-cased rich layout for the How-it-ships page
  if (key === 'how-it-ships') return <HowItArrivesScreen theme={theme} nav={nav} />;

  return (
    <div style={{ paddingBottom: 60 }}>
      {!page.isOrderLookup && (
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 12, color: theme.inkSoft,
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14,
        }}>
          <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>{t('page.home','Home')}</button>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: theme.ink, fontWeight: 600 }}>{page.title}</span>
        </div>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.accent, marginBottom: 10,
        }}>{(()=>{const m = {Trust:'content.trust',Support:'content.support'}; const head = (page.kicker||'').split(' · ')[0]; return (m[head] ? t(m[head], head) : page.kicker);})()}</div>
        <h1 style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 38,
          letterSpacing: theme.letterDisplay, lineHeight: 0.95,
          color: theme.ink, margin: 0,
        }}>{tKey ? t(tKey + '.title', page.title) : page.title}</h1>
        <p style={{
          fontFamily: theme.body, fontSize: 14, color: theme.inkSoft,
          lineHeight: 1.5, margin: '10px 0 14px',
        }}>{tKey ? t(tKey + '.sub', page.sub) : page.sub}</p>

        {page.published && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{
              padding: '6px 10px', borderRadius: 999, background: theme.surfaceAlt,
              fontFamily: theme.mono, fontSize: 11, color: theme.inkSoft,
            }}>{page.published}</span>
            {page.readMin && (
              <span style={{
                padding: '6px 10px', borderRadius: 999, border: `1px solid ${theme.rule}`,
                fontFamily: theme.mono, fontSize: 11, color: theme.inkSoft,
              }}>{page.readMin} min read</span>
            )}
          </div>
        )}
      </div>
      )}

      {page.heroImage && (
        <div style={{ padding: '0 20px 18px' }}>
          <img src={page.heroImage} alt={page.title || ''} style={{ width: '100%', borderRadius: theme.radius, display: 'block', objectFit: 'cover' }} />
        </div>
      )}

      {/* Journal index variant */}
      {page.isOrderLookup ? (
        <OrderLookupScreen theme={theme} nav={nav} />
      ) : page.isBrandsIndex ? (
        <BrandsIndexScreen theme={theme} nav={nav} />
      ) : page.isFaq ? (
        <FaqTabs theme={theme} globalSections={page.sections} initialTab={params?.faqCat} />
      ) : page.isReviews ? (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(() => {
            const all = window.FEATURED_TESTIMONIALS || [];
            const avg = all.length ? Math.round(all.reduce((s, x) => s + x.stars, 0) / all.length * 10) / 10 : 0;
            return (
              <div style={{
                padding: 18, borderRadius: theme.radius, background: theme.ink, color: theme.bg,
                display: 'flex', alignItems: 'center', gap: 16, marginBottom: 6,
              }}>
                <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 44, letterSpacing: theme.letterDisplay, lineHeight: 1 }}>{avg}</div>
                <div>
                  <div style={{ color: theme.accent, fontSize: 16, letterSpacing: 1 }}>{'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}</div>
                  <div style={{ fontFamily: theme.body, fontSize: 12, opacity: 0.8, marginTop: 2 }}>{all.length} verificētas atsauksmes · vidējais vērtējums</div>
                </div>
              </div>
            );
          })()}
          {(window.FEATURED_TESTIMONIALS || []).map((r, i) => (
            <div key={i} style={{
              padding: 16, borderRadius: theme.radius, background: theme.surface,
              border: `1px solid ${theme.rule}`,
            }}>
              <div style={{ color: theme.accent, fontSize: 13, letterSpacing: 1, marginBottom: 8 }}>
                {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
              </div>
              <div style={{ fontFamily: theme.body, fontSize: 14, color: theme.ink, lineHeight: 1.5, marginBottom: 10 }}>
                &ldquo;{r.body}&rdquo;
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink }}>{r.name} · {r.city}</span>
                <span style={{
                  fontFamily: theme.body, fontSize: 11, fontWeight: 600,
                  padding: '3px 8px', borderRadius: 999, background: theme.surfaceAlt, color: theme.inkSoft,
                }}>{r.product}</span>
              </div>
            </div>
          ))}
          <div style={{
            marginTop: 4, padding: '12px 14px', borderRadius: theme.radiusSm,
            background: theme.surfaceAlt, fontFamily: theme.body, fontSize: 11,
            color: theme.inkSoft, lineHeight: 1.45, display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <span>✓</span>
            <span>Visas atsauksmes ir no verificētiem pirkumiem. Mēs nedzēšam negatīvas atsauksmes.</span>
          </div>
          <ReviewForm theme={theme}
            onSubmitted={() => {}} />
        </div>
      ) : page.isUsage ? (
        <div style={{ padding: '0 20px' }}>
          {/* General guidance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
            {(window.USAGE_GENERAL || []).map(([h, b], i) => (
              <div key={i} style={{
                padding: 14, borderRadius: theme.radius,
                background: theme.surfaceAlt,
              }}>
                <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink, marginBottom: 4 }}>{h}</div>
                <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.5 }}>{b}</div>
              </div>
            ))}
          </div>

          {/* Per-product instructions */}
          {(window.PRODUCTS || []).filter(p => (window.PRODUCT_USAGE || {})[p.id]).map(p => {
            const u = window.PRODUCT_USAGE[p.id];
            return (
              <div key={p.id} style={{
                marginBottom: 18, borderRadius: theme.radius,
                background: theme.surface, border: `1px solid ${theme.rule}`, overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderBottom: `1px solid ${theme.rule}` }}>
                  <div style={{ width: 56, height: 56, flexShrink: 0 }}>
                    <ProductBlob product={p} theme={theme} size="sm" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: theme.display, fontWeight: 700, fontSize: 22,
                      letterSpacing: theme.letterDisplay, color: theme.ink, lineHeight: 1,
                    }}>{p.name}</div>
                    <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 3 }}>{p.material} · {p.modes} režīmi</div>
                  </div>
                  <button onClick={() => nav('product', { id: p.id })} style={{
                    all: 'unset', cursor: 'pointer', flexShrink: 0,
                    padding: '7px 12px', borderRadius: 999,
                    background: theme.surfaceAlt, color: theme.ink,
                    fontFamily: theme.body, fontWeight: 700, fontSize: 11,
                  }}>Skatīt →</button>
                </div>
                <ol style={{ margin: 0, padding: '14px 16px 14px 16px', listStyle: 'none', counterReset: 'step' }}>
                  {u.steps.map((s, i) => (
                    <li key={i} style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '7px 0',
                    }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                        background: theme.ink, color: theme.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: theme.mono, fontSize: 10, fontWeight: 700,
                      }}>{i + 1}</span>
                      <span style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.5 }}>{s}</span>
                    </li>
                  ))}
                </ol>
                {u.tip && (
                  <div style={{
                    margin: '0 16px 16px', padding: '10px 12px', borderRadius: theme.radiusSm,
                    background: theme.surfaceAlt, display: 'flex', gap: 8, alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 14 }}>💡</span>
                    <span style={{ fontFamily: theme.body, fontSize: 12, color: theme.ink, lineHeight: 1.45 }}>{u.tip}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : page.isIndex ? (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {JOURNAL_INDEX.map(k => {
            const p = CONTENT_PAGES[k];
            return (
              <button key={k} onClick={() => nav('content', { key: k })} style={{
                all: 'unset', cursor: 'pointer', display: 'block',
                padding: 18, borderRadius: theme.radius,
                background: theme.surface, border: `1px solid ${theme.rule}`,
              }}>
                <div style={{
                  fontFamily: theme.body, fontSize: 10, fontWeight: 700,
                  letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                  color: theme.accent, marginBottom: 8,
                }}>{p.kicker}</div>
                <div style={{
                  fontFamily: theme.display, fontWeight: 700, fontSize: 22,
                  letterSpacing: theme.letterDisplay, color: theme.ink,
                  lineHeight: 1.1, marginBottom: 6,
                }}>{p.title}</div>
                <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.5, marginBottom: 8 }}>
                  {p.sub}
                </div>
                <div style={{ fontFamily: theme.mono, fontSize: 11, color: theme.inkSoft }}>
                  {p.published} · {p.readMin} min
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {page.brandId && (() => {
            const prods = (window.PRODUCTS || []).filter(p => p.brand && p.brand === page.title);
            if (prods.length === 0) return null;
            return (
              <div>
                <div style={{
                  fontFamily: theme.body, fontSize: 11, fontWeight: 700,
                  letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                  color: theme.inkSoft, marginBottom: 10,
                }}>{page.title} produkti ({prods.length})</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {prods.map(p => (
                    <ProductCard key={p.id} product={p} theme={theme} variant="image"
                      onClick={() => nav('product', { id: p.id })} />
                  ))}
                </div>
              </div>
            );
          })()}
          {page.intro && (
            <p style={{
              fontFamily: theme.body, fontSize: 13, color: theme.inkSoft,
              lineHeight: 1.6, margin: 0,
            }}>{page.intro}</p>
          )}
          {page.clothingTable && (
            <div>
              <div style={{
                fontFamily: theme.body, fontSize: 11, fontWeight: 700,
                letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                color: theme.inkSoft, marginBottom: 8,
              }}>Apģērbu izmēru tabula</div>
              <div style={{
                borderRadius: theme.radius, overflow: 'hidden',
                border: `1px solid ${theme.rule}`, background: theme.surface,
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: theme.body }}>
                  <thead>
                    <tr>
                      {page.clothingTable.head.map((h, i) => (
                        <th key={i} style={{
                          textAlign: i === 0 ? 'left' : 'center', padding: '9px 6px',
                          fontSize: 10, fontWeight: 700, color: theme.ink,
                          background: theme.surfaceAlt, borderBottom: `1px solid ${theme.rule}`,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {page.clothingTable.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((c, ci) => (
                          <td key={ci} style={{
                            textAlign: ci === 0 ? 'left' : 'center', padding: '9px 6px',
                            fontSize: 11, fontWeight: ci === 0 ? 700 : 500,
                            color: ci === 0 ? theme.ink : theme.inkSoft,
                            borderBottom: ri < page.clothingTable.rows.length - 1 ? `1px solid ${theme.rule}` : 'none',
                          }}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 8, lineHeight: 1.5 }}>
                Mēri ir aptuveni. Mēri sevi mīkstā mērlentē platākajā vietā. Šaubu gadījumā izvēlies lielāko izmēru vai raksti support@shhh.lv.
              </div>
            </div>
          )}
          {page.table && (
            <div style={{
              borderRadius: theme.radius, overflow: 'hidden',
              border: `1px solid ${theme.rule}`, background: theme.surface,
            }}>
              {page.materialLabel !== false && (
                <div style={{
                  fontFamily: theme.body, fontSize: 11, fontWeight: 700,
                  letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                  color: theme.inkSoft, padding: '12px 14px 0',
                }}>Materiālu salīdzinājums</div>
              )}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: theme.body }}>
                <thead>
                  <tr>
                    {page.table.head.map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 0 ? 'left' : 'center', padding: '10px 8px',
                        fontSize: 11, fontWeight: 700, color: theme.ink,
                        background: theme.surfaceAlt,
                        borderBottom: `1px solid ${theme.rule}`,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.table.rows.map((r, ri) => (
                    <tr key={ri}>
                      {r.map((c, ci) => (
                        <td key={ci} style={{
                          textAlign: ci === 0 ? 'left' : 'center', padding: '10px 8px',
                          fontSize: ci === 0 ? 12 : 12,
                          fontWeight: ci === 0 ? 600 : 500,
                          color: ci === 0 ? theme.ink : theme.inkSoft,
                          borderBottom: ri < page.table.rows.length - 1 ? `1px solid ${theme.rule}` : 'none',
                        }}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {page.sections && page.sections.map(([title, body], i) => { const sk = 'sec.' + key + '.' + (i + 1); return (
            <div key={i} style={{
              padding: 18, borderRadius: theme.radius,
              background: theme.surface, border: `1px solid ${theme.rule}`,
            }}>
              <div style={{
                fontFamily: theme.display, fontWeight: 700, fontSize: 18,
                letterSpacing: theme.letterDisplay, color: theme.ink, marginBottom: 8, lineHeight: 1.1,
              }}>{t(sk + '.t', title)}</div>
              <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.55 }}>
                {t(sk + '.b', body)}
              </div>
            </div>
          );})}

          {page.formKind === 'lookup' && (
            <div style={{
              padding: 18, borderRadius: theme.radius,
              background: theme.surface, border: `1.5px solid ${theme.accent}`,
            }}>
              <div style={{
                fontFamily: theme.body, fontSize: 10, fontWeight: 700,
                letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                color: theme.inkSoft, marginBottom: 8,
              }}>Look up by ref</div>
              <input value={ref} onChange={(e) => setRef(e.target.value)}
                placeholder="SH-23847"
                style={{
                  width: '100%', boxSizing: 'border-box', height: 48,
                  padding: '0 14px', borderRadius: theme.radiusSm,
                  border: `1.5px solid ${theme.rule}`, background: theme.bg,
                  fontFamily: theme.mono, fontSize: 14, color: theme.ink, outline: 'none',
                  marginBottom: 10,
                }} />
              <PrimaryButton theme={theme} size="md" full
                onClick={() => alert('Lookup sent for ' + (ref || 'SH-23847'))}>
                Look up order
              </PrimaryButton>
            </div>
          )}

          {page.formKind === 'gdpr' && <GdprForm theme={theme} />}

          {/* Shop CTA — derived from page.shopIds + shopHeadline, or generic */}
          {(() => {
            const ids = page.shopIds || (key.startsWith('journal') ? JOURNAL_INDEX.length && [] : []);
            const products = (page.shopIds || []).map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
            const heading = page.shopHeadline || 'Shop the catalogue';
            const sub = page.shopSub || (page.kicker.startsWith('Journal') ? 'Plain box, anonymous billing, next-day shipping.' : 'Browse the full set — body-safe, lab-tested, shipped quietly.');
            return (
              <div style={{
                marginTop: 8, padding: 18, borderRadius: theme.radius,
                background: theme.ink, color: theme.bg,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', right: -30, top: -30,
                  width: 140, height: 140, borderRadius: 999,
                  background: theme.accent, opacity: 0.85,
                }} />
                <div style={{ position: 'relative' }}>
                  <div style={{
                    fontFamily: theme.body, fontSize: 10, fontWeight: 700,
                    letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                    color: theme.accent, marginBottom: 8,
                  }}>Shop the shop</div>
                  <div style={{
                    fontFamily: theme.display, fontWeight: 700, fontSize: 24,
                    letterSpacing: theme.letterDisplay, lineHeight: 1.05, marginBottom: 6,
                    maxWidth: 280,
                  }}>{heading}</div>
                  <div style={{
                    fontFamily: theme.body, fontSize: 12, opacity: 0.75, lineHeight: 1.45,
                    marginBottom: 14, maxWidth: 280,
                  }}>{sub}</div>

                  {products.length > 0 ? (
                    <div style={{
                      display: 'flex', gap: 10, padding: '4px 0 14px',
                      overflowX: 'auto', WebkitOverflowScrolling: 'touch',
                    }}>
                      {products.map(p => (
                        <button key={p.id} onClick={() => nav('product', { id: p.id })} style={{
                          all: 'unset', cursor: 'pointer', flex: '0 0 130px',
                          background: theme.bg, color: theme.ink, borderRadius: 12, padding: 8,
                        }}>
                          <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden' }}>
                            <ProductBlob product={p} theme={theme} size="sm" />
                          </div>
                          <div style={{
                            marginTop: 8, fontFamily: theme.display, fontWeight: 700, fontSize: 15,
                            letterSpacing: theme.letterDisplay, lineHeight: 1,
                          }}>{p.name}</div>
                          <div style={{
                            fontFamily: theme.mono, fontSize: 11, color: theme.inkSoft, marginTop: 4,
                          }}>€{p.price}</div>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => nav('category', { cat: 'all' })} className="shhh-grad" style={{
                      cursor: 'pointer', height: 40, padding: '0 16px', borderRadius: 999,
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontFamily: theme.body, fontWeight: 700, fontSize: 13,
                      boxShadow: '0 6px 18px rgba(110,77,248,0.30)',
                    }}>Shop the catalogue <Icon name="arrow" size={14} color="#fff" /></button>
                    {products[0] && (
                      <button onClick={() => nav('product', { id: products[0].id, mode: 'fast' })} style={{
                        all: 'unset', cursor: 'pointer',
                        height: 40, padding: '0 16px', borderRadius: 999,
                        background: 'transparent', color: theme.bg,
                        border: '1.5px solid rgba(255,255,255,0.35)',
                        fontFamily: theme.body, fontWeight: 700, fontSize: 13,
                        display: 'inline-flex', alignItems: 'center',
                      }}>⚡ Buy {products[0].name} · €{products[0].price}</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Related journal at bottom of each non-index page */}
          {!page.isIndex && key.indexOf('journal') === -1 && (
            <div style={{
              marginTop: 8, padding: 18, borderRadius: theme.radius,
              background: theme.surfaceAlt,
            }}>
              <div style={{
                fontFamily: theme.body, fontSize: 10, fontWeight: 700,
                letterSpacing: theme.letterCaps, textTransform: 'uppercase',
                color: theme.inkSoft, marginBottom: 10,
              }}>Read more in the journal</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {JOURNAL_INDEX.slice(0, 2).map(k => (
                  <button key={k} onClick={() => nav('content', { key: k })} style={{
                    all: 'unset', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                    padding: '6px 0', fontFamily: theme.body, fontSize: 13, color: theme.ink, fontWeight: 600,
                  }}>
                    {CONTENT_PAGES[k].title}
                    <Icon name="chev" size={14} color={theme.inkSoft} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OrderLookupScreen — find an order by ref; show status + cancel
// ─────────────────────────────────────────────────────────────
function OrderLookupScreen({ theme, nav }) {
  const [q, setQ] = React.useState('');
  const [result, setResult] = React.useState(undefined); // undefined=idle, null=not found, obj=found
  const [cancelled, setCancelled] = React.useState(false);
  const [refunded, setRefunded] = React.useState(false);
  // Auto-open a specific order when arriving from the confirmation page.
  React.useEffect(() => {
    const ref = window.__shhhLookupRef;
    if (!ref) return;
    window.__shhhLookupRef = null;
    const found = DEMO[ref] || null;
    if (found) {
      setQ((ref || '').replace(/\D/g, ''));
      setResult(found);
      const paidSet = window.__shhhPaidRefs = window.__shhhPaidRefs || {};
      setPaid(!!paidSet[ref]);
      if ((window.__shhhCancelledRefs || {})[ref]) setCancelled(true);
    }
  }, []);
  const [payOpen, setPayOpen] = React.useState(false);
  const [paid, setPaid] = React.useState(false);

  // Demo orders to look up.
  const DEMO = {
    'SH-23847': { ref: 'SH-23847', date: '01.06.2026.', total: 49.00, payMethod: 'transfer',
      paid: false, ship: 'Omniva · Origo, Rīga', items: [{ name: 'Womanizer Starlet 3', qty: 1, price: 49 }] },
    'SH-23901': { ref: 'SH-23901', date: '29.05.2026.', paidDate: '29.05.2026.', total: 128.50, payMethod: 'citadele',
      paid: true, shipped: true, ship: '30.05.2026. · DPD · durvju piegāde', items: [{ name: 'LELO Gigi 3', qty: 1, price: 189 }] },
    'SH-23890': { ref: 'SH-23890', date: '30.05.2026.', paidDate: '30.05.2026.', total: 89.00, payMethod: 'apple',
      paid: true, shipped: false, ship: 'Omniva · Spice, Rīga', items: [{ name: 'We-Vibe Sync 2', qty: 1, price: 89 }] },
  };

  const search = () => {
    const digits = q.trim().replace(/\D/g, '');
    setCancelled(false);
    const found = DEMO['SH-' + digits] || null;
    setResult(found);
    const paidSet = window.__shhhPaidRefs = window.__shhhPaidRefs || {};
    setPaid(found ? !!paidSet[found.ref] : false);
    setRefunded(false);
    if (found && (window.__shhhCancelledRefs || {})[found.ref]) setCancelled(true);
  };

  const StatusStep = ({ l, s, state }) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 14, height: 14, borderRadius: 999, marginTop: 3,
          background: state === 'done' ? '#1F8A4C' : 'transparent',
          border: `2px solid ${state === 'done' ? '#1F8A4C' : theme.rule}`,
        }} />
        <div style={{ flex: 1, width: 2, background: theme.rule, marginTop: 3, minHeight: 18 }} />
      </div>
      <div style={{ paddingBottom: 14 }}>
        <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 14, color: state === 'done' ? theme.ink : theme.inkSoft }}>{l}</div>
        <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>{s}</div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 50 }}>
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, display: 'flex', gap: 6, marginBottom: 14 }}>
          <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>Sākums</button>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: theme.ink, fontWeight: 600 }}>Mani pasūtījumi</span>
        </div>
        <h1 style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 32, letterSpacing: theme.letterDisplay, color: theme.ink, margin: '0 0 6px' }}>Mani pasūtījumi</h1>
        <p style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, margin: '0 0 16px', lineHeight: 1.5 }}>Ievadi pasūtījuma numuru, lai redzētu statusu.</p>
      </div>

      {/* Search */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, height: 48, padding: '0 14px', borderRadius: theme.radiusSm,
            border: `1.5px solid ${theme.rule}`, background: theme.bg,
            display: 'flex', alignItems: 'center', boxSizing: 'border-box',
          }}>
            <span style={{ fontFamily: theme.mono, fontSize: 15, fontWeight: 700, color: theme.inkSoft }}>SH-</span>
            <input value={q} onChange={(e) => setQ(e.target.value.replace(/\D/g, '').slice(0, 8))}
              inputMode="numeric" placeholder="23847"
              onKeyDown={(e) => { if (e.key === 'Enter') search(); }}
              style={{
                flex: 1, minWidth: 0, height: '100%', border: 'none', padding: 0, marginLeft: 2,
                background: 'transparent', fontFamily: theme.mono, fontSize: 15, color: theme.ink, outline: 'none',
              }} />
          </div>
          <PrimaryButton theme={theme} size="md" onClick={search}>Meklēt</PrimaryButton>
        </div>
        <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 8 }}>
          💡 Mēģini “SH-23847” (gaida apmaksu), “SH-23890” (apmaksāts) vai “SH-23901” (nosūtīts).
        </div>
      </div>

      {/* Not found */}
      {result === null && (
        <div style={{ margin: '14px 20px 0', padding: 18, borderRadius: theme.radius, border: `1.5px dashed ${theme.rule}`, textAlign: 'center' }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>🔍</div>
          <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink, fontWeight: 600 }}>Pasūtījums nav atrasts</div>
          <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 4 }}>Pārbaudi numuru vai sazinies: <button onClick={() => nav('content', { key: 'contact' })} style={{ all: 'unset', cursor: 'pointer', color: theme.accent, fontWeight: 700 }}>support@shhh.lv</button></div>
        </div>
      )}

      {/* Found */}
      {result && (
        <div style={{ padding: '16px 20px 0' }}>
          {/* Header card */}
          <div style={{ padding: 16, borderRadius: theme.radius, background: theme.surface, border: `1px solid ${theme.rule}`, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: theme.mono, fontSize: 15, fontWeight: 700, color: theme.ink }}>#{result.ref}</div>
                <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>Iesniegts: {result.date}</div>
              </div>
              <span style={{
                fontFamily: theme.body, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                background: cancelled ? '#FBE9E9' : (result.shipped || result.paid || paid) ? '#E7F4EC' : '#FFF6E5',
                color: cancelled ? '#B3261E' : (result.shipped || result.paid || paid) ? '#1F8A4C' : '#9A6B00',
              }}>{cancelled ? 'Atcelts' : result.shipped ? 'Nosūtīts' : (result.paid || paid) ? 'Apmaksāts' : 'Gaida apmaksu'}</span>
            </div>
          </div>

          {/* Payment status */}
          <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 10 }}>Maksājuma statuss</div>
          <div style={{ marginBottom: 16 }}>
            <StatusStep l="Iesniegts" s={result.date} state="done" />
            <StatusStep l={(result.paid || paid) ? 'Apmaksāts' : 'Gaida apmaksu'} s={(result.paid || paid) ? (result.paidDate || result.date) : 'Vēl nav saņemts'} state={(result.paid || paid) && !cancelled ? 'done' : 'pending'} />
            {cancelled && (result.paid || paid) ? (
              <>
                <StatusStep l="Atmaksa pieprasīta" s={new Date().toLocaleDateString('lv-LV')} state="done" />
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 999, marginTop: 3, background: refunded ? '#1F8A4C' : 'transparent', border: `2px solid ${refunded ? '#1F8A4C' : theme.rule}` }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 14, color: refunded ? theme.ink : theme.inkSoft }}>Atmaksa saņemta</div>
                    <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>{refunded ? (new Date().toLocaleDateString('lv-LV') + ' · €' + result.total.toFixed(2) + ' atgriezti') : '5 darba dienu laikā'}</div>
                    {!refunded && (
                      <button onClick={() => setRefunded(true)} style={{ all: 'unset', cursor: 'pointer', marginTop: 6, fontFamily: theme.body, fontSize: 11, color: theme.accent, fontWeight: 700, textDecoration: 'underline' }}>▸ Demo: atmaksa veikta</button>
                    )}
                  </div>
                </div>
              </>
            ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 14, height: 14, borderRadius: 999, marginTop: 3, background: result.shipped && !cancelled ? '#1F8A4C' : 'transparent', border: `2px solid ${result.shipped && !cancelled ? '#1F8A4C' : theme.rule}` }} />
              </div>
              <div>
                <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 14, color: result.shipped ? theme.ink : theme.inkSoft }}>Nosūtīts</div>
                <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>{result.ship}</div>
              </div>
            </div>
            )}
            {/* Refund step — when a return refund has been paid */}
            {(() => {
              const cl = (window.__shhhClaims || {})[result.ref];
              if (!cl || !cl.resolved || !cl.resolved.refund) return null;
              const done = !!cl.resolved.refundPaid;
              return (
                <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 999, marginTop: 3, background: done ? '#1F8A4C' : 'transparent', border: `2px solid ${done ? '#1F8A4C' : theme.rule}` }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: theme.body, fontWeight: 600, fontSize: 14, color: done ? theme.ink : theme.inkSoft }}>Nauda atgriezta</div>
                    <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>{done ? `€${cl.resolved.refund.toFixed(2)} · ${cl.resolved.refundDate}` : 'Gaida atmaksu'}</div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Pay now if unpaid */}
          {!result.paid && !cancelled && !paid && (
            <div style={{ marginBottom: 14 }}>
              {!payOpen ? (
                <PrimaryButton theme={theme} onClick={() => setPayOpen(true)}>
                  Apmaksāt · €{result.total.toFixed(2)}
                </PrimaryButton>
              ) : (
                <div style={{ borderRadius: theme.radius, border: `1.5px solid ${theme.rule}`, background: theme.surface, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                    <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.inkSoft }}>Izvēlies maksājuma veidu</div>
                    <button onClick={() => setPayOpen(false)} style={{ all: 'unset', cursor: 'pointer', fontFamily: theme.body, fontSize: 12, color: theme.inkSoft }}>✕</button>
                  </div>
                  {/* Tap & pay */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    {['Apple Pay', 'Google Pay'].map(l => (
                      <button key={l} onClick={() => { setPayOpen(false); (window.__shhhPaidRefs = window.__shhhPaidRefs || {})[result.ref] = true; window.__shhhShowConfirmation && window.__shhhShowConfirmation({ ref: result.ref, items: result.items.map(it => ({ id: 'x', name: it.name, price: it.price, qty: it.qty })), total: result.total }); }} style={{
                        all: 'unset', cursor: 'pointer', flex: 1, height: 48, borderRadius: theme.radiusPill,
                        background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: theme.body, fontWeight: 600, fontSize: 13,
                      }}>{l}</button>
                    ))}
                  </div>
                  {/* Banklink / card / transfer list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(window.PAYMENT_METHODS || []).filter(m => m.kind === 'banklink' || m.kind === 'bnpl' || m.kind === 'card' || m.kind === 'transfer').map(m => (
                      <button key={m.id} onClick={() => { setPayOpen(false); if (m.kind === 'transfer') { window.__shhhInvoice = { ref: result.ref, items: result.items.map(it => ({ id: 'x', qty: it.qty })), total: result.total }; nav('content', { key: 'payment-methods' }); } else { (window.__shhhPaidRefs = window.__shhhPaidRefs || {})[result.ref] = true; window.__shhhShowConfirmation && window.__shhhShowConfirmation({ ref: result.ref, items: result.items.map(it => ({ id: 'x', name: it.name, price: it.price, qty: it.qty })), total: result.total }); } }} style={{
                        all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 12px', borderRadius: theme.radiusSm, border: `1px solid ${theme.rule}`, background: theme.bg,
                      }}>
                        <span style={{ width: 28, height: 28, borderRadius: 6, background: m.color || theme.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.body, fontWeight: 800, fontSize: 11, flexShrink: 0 }}>{(m.bank || m.name).slice(0, 1).toUpperCase()}</span>
                        <span style={{ flex: 1, fontFamily: theme.body, fontWeight: 600, fontSize: 13, color: theme.ink }}>{m.name.replace(' banklink', '')}</span>
                        <span style={{ color: theme.inkSoft }}>›</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {(paid || (result.paid && !cancelled)) && (<>
            <div style={{
              marginBottom: 16, padding: '22px 18px', borderRadius: theme.radius,
              background: '#E7F4EC', textAlign: 'center',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 999, margin: '0 auto 12px',
                background: '#1F8A4C', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 700,
              }}>✓</div>
              <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 22, color: theme.ink, letterSpacing: theme.letterDisplay, marginBottom: 6 }}>
                {(() => {
                  const cl = (window.__shhhClaims || {})[result.ref];
                  if (cl && cl.resolved && cl.resolved.refundPaid) return 'Atmaksa veikta!';
                  if ((window.__shhhCancelledRefs || {})[result.ref]) return 'Atmaksa saņemta!';
                  return 'Maksājums saņemts!';
                })()}
              </div>
              <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.5, marginBottom: 4 }}>
                {(() => {
                  const cl = (window.__shhhClaims || {})[result.ref];
                  if (cl && cl.resolved && cl.resolved.refundPaid) {
                    return <>€{cl.resolved.refund.toFixed(2)} atmaksāti uz sākotnējo maksājuma metodi {cl.resolved.refundDate}.</>;
                  }
                  if ((window.__shhhCancelledRefs || {})[result.ref]) {
                    return <>Pasūtījums <strong style={{ color: theme.ink }}>#{result.ref}</strong> atcelts. €{result.total.toFixed(2)} atmaksāti uz sākotnējo maksājuma metodi.</>;
                  }
                  return <>Pasūtījums <strong style={{ color: theme.ink }}>#{result.ref}</strong> nodots apstrādei. Saņemsi e-pastu, tiklīdz tas tiks nosūtīts.</>;
                })()}
              </div>
            </div>
            {/* Paid but not yet shipped → can still cancel for a full refund */}
            {!result.shipped && !(window.__shhhCancelledRefs || {})[result.ref] && (
              <button onClick={() => { window.__shhhCancelOrder = { ref: result.ref, total: result.total, paid: true }; nav('cancel-order'); }} style={{
                all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', textAlign: 'center',
                marginTop: 12, padding: '12px 0', borderRadius: theme.radiusPill,
                border: `1.5px solid #E0282E`, color: '#E0282E',
                fontFamily: theme.body, fontWeight: 700, fontSize: 14,
              }}>Atcelt un saņemt atmaksu</button>
            )}
            {(window.__shhhCancelledRefs || {})[result.ref] && (
              <div style={{ marginTop: 12, padding: 14, borderRadius: theme.radius, background: '#FBE9E9', fontFamily: theme.body, fontSize: 13, color: '#B3261E', textAlign: 'center' }}>
                Pasūtījums atcelts. Atmaksu uz sākotnējo maksājuma metodi saņemsi 5 darba dienu laikā.
              </div>
            )}
            {/* CTAs separated below the success panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              <button onClick={() => nav('home')} className="shhh-grad" style={{
                cursor: 'pointer', height: 48, borderRadius: theme.radiusPill,
                fontFamily: theme.body, fontWeight: 700, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>Turpināt iepirkties 🍒</button>
              <button onClick={() => { window.__shhhInvoice = { ref: result.ref, items: result.items.map(it => ({ id: 'x', name: it.name, price: it.price, qty: it.qty })), total: result.total }; nav('invoice'); }} style={{
                all: 'unset', cursor: 'pointer', textAlign: 'center',
                height: 48, borderRadius: theme.radiusPill, border: `1.5px solid ${theme.rule}`, color: theme.ink,
                fontFamily: theme.body, fontWeight: 700, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box',
              }}>📄 Lejupielādēt rēķinu</button>
            </div>
          </>)}

          {/* Items + total + cancel — hidden once paid */}
          {!paid && (<>
          <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 8 }}>Preces</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {result.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 13, color: theme.ink }}>
                <span>{it.name} <span style={{ color: theme.inkSoft }}>× {it.qty}</span></span>
                <span style={{ fontFamily: theme.mono }}>€{(it.price * it.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: theme.rule, margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 15, fontWeight: 700, color: theme.ink, marginBottom: 16 }}>
            <span>Kopā</span><span style={{ fontFamily: theme.mono }}>€{result.total.toFixed(2)}</span>
          </div>

          {/* Cancel */}
          {!result.shipped && !result.paid && !paid && !cancelled && (
            <button onClick={() => { window.__shhhCancelOrder = { ref: result.ref, total: result.total }; nav('cancel-order'); }} style={{
              all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', textAlign: 'center',
              padding: '12px 0', borderRadius: theme.radiusPill, border: `1.5px solid #E0282E`, color: '#E0282E',
              fontFamily: theme.body, fontWeight: 700, fontSize: 14,
            }}>Atcelt pasūtījumu</button>
          )}
          </>)}
          {(cancelled || (window.__shhhCancelledRefs || {})[result.ref]) && !paid && !result.paid && (
            <div>
              <PrimaryButton theme={theme} full onClick={() => nav('category', {})} style={{ marginTop: 12 }}>
                Atpakaļ uz iepirkšanos 🍒
              </PrimaryButton>
            </div>
          )}
          {result.shipped && (() => {
            const claim = (window.__shhhClaims || {})[result.ref];
            if (claim) {
              const resolved = claim.resolved;
              const markResolved = () => {
                claim.resolved = {
                  outcome: claim.kind === 'return' ? 'Atgriešana apstiprināta' : 'Garantija apstiprināta — nomaiņa',
                  date: new Date().toLocaleDateString('lv-LV'),
                  refund: claim.kind === 'return' ? result.total : 0,
                  msg: claim.kind === 'return'
                    ? 'Tava atgriešana ir apstiprināta. Atmaksa tiks veikta uz sākotnējo maksājuma metodi 5 darba dienu laikā pēc preces saņemšanas. Atgriešanas uzlīme nosūtīta uz e-pastu.'
                    : 'Garantijas pieteikums apstiprināts. Nosūtīsim jaunu preci, tiklīdz saņemsim bojāto. Atgriešanas uzlīme nosūtīta uz e-pastu.',
                };
                setResult({ ...result });
              };
              if (resolved) {
                return (
                  <div style={{ padding: 14, borderRadius: theme.radius, background: '#E7F4EC', border: '1px solid #B8E0C6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink }}>
                        {claim.kind === 'return' ? '↩︎ Atgriešanas pieteikums' : '🛡 Garantijas pieteikums'}
                      </span>
                      <span style={{ fontFamily: theme.body, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: '#1F8A4C', color: '#fff' }}>Apstrādāts</span>
                    </div>
                    <div style={{ fontFamily: theme.mono, fontSize: 11, color: theme.inkSoft, marginBottom: 8 }}>{claim.claimNo} · iesniegts {claim.date} · atbildēts {resolved.date}</div>
                    <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: '#1F8A4C', marginBottom: 6 }}>✓ {resolved.outcome}</div>
                    <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.55 }}>{resolved.msg}</div>
                    {resolved.refund > 0 && (
                      <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: theme.radiusSm, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft }}>Atmaksas summa</span>
                        <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 16, color: theme.ink }}>€{resolved.refund.toFixed(2)}</span>
                      </div>
                    )}
                    {resolved.refund > 0 && (resolved.refundPaid ? (
                      <div style={{ marginTop: 8, fontFamily: theme.body, fontWeight: 700, fontSize: 12, color: '#1F8A4C' }}>
                        ✓ Nauda atgriezta {resolved.refundDate}
                      </div>
                    ) : (
                      <button onClick={() => { claim.resolved = { ...resolved, refundPaid: true, refundDate: new Date().toLocaleDateString('lv-LV') }; setResult({ ...result }); }} style={{ all: 'unset', cursor: 'pointer', marginTop: 8, fontFamily: theme.body, fontSize: 11, color: theme.accent, fontWeight: 700, textDecoration: 'underline' }}>▸ Demo: nauda atgriezta</button>
                    ))}
                  </div>
                );
              }
              return (
                <div style={{ padding: 14, borderRadius: theme.radius, background: '#EEF3FF', border: '1px solid #C9D8FF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink }}>
                      {claim.kind === 'return' ? '↩︎ Atgriešanas pieteikums' : '🛡 Garantijas pieteikums'}
                    </span>
                    <span style={{ fontFamily: theme.body, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: '#3A5BC7', color: '#fff' }}>Apstrādē</span>
                  </div>
                  <div style={{ fontFamily: theme.mono, fontSize: 11, color: theme.inkSoft, marginBottom: 4 }}>{claim.claimNo} · {claim.date}</div>
                  <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.5 }}>
                    <strong style={{ color: theme.ink }}>Iemesls:</strong> {claim.reason}
                    {claim.photos > 0 && <> · {claim.photos} foto</>}
                  </div>
                  <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 8, lineHeight: 1.5 }}>
                    Atbildēsim uz e-pastu 1 darba dienas laikā ar bezmaksas atgriešanas uzlīmi.
                  </div>
                  <button onClick={markResolved} style={{ all: 'unset', cursor: 'pointer', marginTop: 10, fontFamily: theme.body, fontSize: 11, color: theme.accent, fontWeight: 700, textDecoration: 'underline' }}>▸ Demo: saņemt atbildi</button>
                </div>
              );
            }
            return (
              <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, textAlign: 'center', lineHeight: 1.5 }}>
                Pasūtījums jau nosūtīts — to vairs nevar atcelt. Vari izmantot <button onClick={() => { window.__shhhReturnOrder = { ref: result.ref }; nav('return-form'); }} style={{ all: 'unset', cursor: 'pointer', color: theme.accent, fontWeight: 700 }}>bezmaksas atgriešanu</button>.
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ── CMS overrides ────────────────────────────────────────────
// Text/media edited in the admin panel is stored under 'shhh_cms_v1' as a
// per-page, per-language object and merged into CONTENT_PAGES here, so edits
// appear on both the mobile and desktop storefront (and follow the language).
function __shhhApplyCms() {
  try {
    const ov = JSON.parse(localStorage.getItem('shhh_cms_v1') || '{}');
    const lang = (typeof window !== 'undefined' && window.__shhhLang) || 'lv';
    const FIELDS = ['title', 'kicker', 'sub', 'intro', 'sections', 'heroImage', 'icon'];
    Object.keys(ov).forEach(k => {
      if (!CONTENT_PAGES[k]) return;
      const o = ov[k] || {};
      const merged = Object.assign({}, o.lv || {}, o[lang] || {});
      FIELDS.forEach(f => {
        const v = merged[f];
        if (v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)) CONTENT_PAGES[k][f] = v;
      });
    });
  } catch (e) {}
}
window.__shhhApplyCms = __shhhApplyCms;
__shhhApplyCms();
// Re-run after sibling modules (e.g. brand pages) register, and on language change.
if (typeof setTimeout === 'function') setTimeout(__shhhApplyCms, 0);
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('shhh-lang-change', () => setTimeout(__shhhApplyCms, 0));

Object.assign(window, { OrderLookupScreen });

Object.assign(window, { CONTENT_PAGES, JOURNAL_INDEX, ContentScreen, HowItArrivesScreen, BoxLabelPreview, NotFoundScreen, CategoryLandingScreen, ReviewForm, GdprForm, GiftCardScreen, SaleScreen, OccasionScreen, OCCASIONS, FaqTabs });

// ─────────────────────────────────────────────────────────────
// FaqTabs — full FAQ page with All + per-category tabs
// ─────────────────────────────────────────────────────────────
const FAQ_CAT_LABELS = {
  solo: 'Vibratori un stimulatori', couples: 'Anālie stimulatori',
  beginners: 'Erotiskā veļa', premium: 'Dildo', travelGear: 'Lubrikanti',
  travel: 'Prezervatīvi', premiumGear: 'Masturbatori', bdsm: 'Fetišs un BDSM',
};

function FaqTabs({ theme, globalSections, initialTab }) {
  const [tab, setTab] = React.useState(initialTab && (window.CATEGORY_FAQ || {})[initialTab] ? initialTab : 'all');
  const catFaq = (typeof window !== 'undefined' && window.CATEGORY_FAQ) || {};
  const tabs = [{ id: 'all', label: 'Visi' },
    ...Object.keys(FAQ_CAT_LABELS).filter(k => (catFaq[k] || []).length).map(k => ({ id: k, label: FAQ_CAT_LABELS[k] }))];

  const list = tab === 'all'
    ? [...(globalSections || []), ...Object.values(catFaq).flat()]
    : (catFaq[tab] || []);

  const [open, setOpen] = React.useState(0);

  return (
    <div style={{ padding: '0 20px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {tabs.map(tb => {
          const active = tab === tb.id;
          return (
            <button key={tb.id} onClick={() => { setTab(tb.id); setOpen(0); }} style={{
              all: 'unset', cursor: 'pointer', whiteSpace: 'nowrap',
              padding: '8px 14px', borderRadius: theme.radiusPill,
              background: active ? theme.ink : 'transparent',
              color: active ? theme.bg : theme.ink,
              border: active ? 'none' : `1.5px solid ${theme.rule}`,
              fontFamily: theme.body, fontSize: 13, fontWeight: 600,
            }}>{tb.label}</button>
          );
        })}
      </div>

      {/* Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((qa, i) => (
          <details key={tab + '-' + i} style={{
            padding: 16, borderRadius: theme.radius,
            background: theme.surface, border: `1px solid ${theme.rule}`,
          }}>
            <summary style={{
              cursor: 'pointer', listStyle: 'none',
              fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            }}>
              {qa[0]}
              <span style={{ color: theme.inkSoft, fontSize: 12, flexShrink: 0 }}>▾</span>
            </summary>
            <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.55, marginTop: 8 }}>{qa[1]}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OccasionScreen — use-case / occasion landing pages (SEO)
// ─────────────────────────────────────────────────────────────
const OCCASIONS = {
  gift: {
    title: 'Dāvana', kicker: 'Dāvanu idejas',
    sub: 'Diskrēta dāvana pieaugušajiem — ar gaumi un bez neveiklības.',
    intro: 'Meklē dāvanu partnerim vai draugam? Esi īstajā vietā. Visi pasūtījumi pienāk vienkāršā kastē bez logo, ar anonīmu sūtītāju "NL Trading Co". Nezini, ko izvēlēties? Dāvanu karte ļauj saņēmējam izvēlēties pašam.',
    ids: ['glow', 'velvet', 'halo'],
    cta: { label: 'Dāvanu karte 🎁', go: 'giftcard' },
  },
  couples: {
    title: 'Pāriem', kicker: 'Diviem',
    sub: 'Rotaļlietas, kas radītas kopīgiem vakariem.',
    intro: 'Pāru gredzeni, attālināti vadāmi stimulatori un komplekti, kas pārvērš ierastos vakarus par ko īpašu. Ērti, ķermenim droši un viegli lietojami — lai uzmanība paliek tur, kur tā vajadzīga.',
    ids: ['velvet', 'halo', 'ripple'],
    cta: { label: 'Skatīt visu pāriem →', go: 'category', params: { cat: 'couples' } },
  },
  first: {
    title: 'Pirmā reize', kicker: 'Iesācējiem',
    sub: 'Maigs sākums — mazi, klusi un vienkārši lietojami.',
    intro: 'Pirmā pieredze nedrīkst būt biedējoša. Šie modeļi ir mazi, klusi (līdz 32 dB) un vadāmi ar vienu pogu. Visi no medicīniskas klases silikona, viegli tīrāmi un draudzīgi. Sāc lēni, savā tempā.',
    ids: ['echo', 'hush-01', 'murmur'],
    cta: { label: 'Lasīt: kā izvēlēties pirmo →', go: 'content', params: { key: 'guide-first-vibrator' } },
  },
  solo: {
    title: 'Sev', kicker: 'Solo',
    sub: 'Klusi mirkļi tikai tev.',
    intro: 'Izlase solo baudai — no maigiem iesācēju modeļiem līdz jaudīgiem favorītiem. Visi klusi, ķermenim droši un ar diskrētu piegādi. Tavs ritms, tavi noteikumi.',
    ids: ['hush-01', 'ripple', 'glow'],
    cta: { label: 'Skatīt visu solo →', go: 'category', params: { cat: 'solo' } },
  },
  treat: {
    title: 'Palutini sevi', kicker: 'Premium',
    sub: 'Kad gribas to labāko.',
    intro: 'Mūsu izsmalcinātākā izlase: aerokosmiskie materiāli, sildoši uzgaļi, lietotnes vadība un mūža garantija. Dizains, kas izskatās tikpat labi, cik jūtas.',
    ids: ['glow', 'velvet', 'ripple'],
    cta: { label: 'Skatīt premium →', go: 'category', params: { cat: 'premium' } },
  },
  travel: {
    title: 'Ceļojumiem', kicker: 'Travel',
    sub: 'Kabatas izmēra, klusi, viegli noslēpjami.',
    intro: 'Slēdzamas ceļojumu kārbiņas, TSA-draudzīgi izmēri un ilgs akumulators — gatavi viesnīcu istabām un klusām atgriešanām. Ceļo viegli un diskrēti.',
    ids: ['drift', 'murmur', 'hush-01'],
    cta: { label: 'Skatīt ceļojumiem →', go: 'category', params: { cat: 'travel' } },
  },
};

function OccasionScreen({ theme, nav, params, favourites = [], toggleFavourite, quickBuy }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const key = params?.key && OCCASIONS[params.key] ? params.key : 'gift';
  const o = OCCASIONS[key];
  const isFav = (id) => (favourites || []).includes(id);
  const products = o.ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '12px 20px 0', fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14 }}>
        <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>{t('page.home', 'Home')}</button>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: theme.ink, fontWeight: 600 }}>{o.title}</span>
      </div>

      {/* Occasion switcher chips */}
      <div style={{ padding: '0 20px 14px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {Object.entries(OCCASIONS).map(([k, oc]) => {
          const active = k === key;
          return (
            <button key={k} onClick={() => nav('occasion', { key: k })} style={{
              all: 'unset', cursor: 'pointer', whiteSpace: 'nowrap',
              padding: '8px 14px', borderRadius: theme.radiusPill,
              background: active ? theme.ink : 'transparent',
              color: active ? theme.bg : theme.ink,
              border: active ? 'none' : `1.5px solid ${theme.rule}`,
              fontFamily: theme.body, fontSize: 13, fontWeight: 600,
            }}>{oc.title}</button>
          );
        })}
      </div>

      {/* Hero */}
      <div style={{ padding: '0 20px 22px' }}>
        <div style={{
          borderRadius: 22, padding: '28px 22px', position: 'relative', overflow: 'hidden',
          background: theme.surfaceAlt,
        }}>
          <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.accent, marginBottom: 10 }}>{o.kicker}</div>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 44, letterSpacing: theme.letterDisplay, lineHeight: 0.95, color: theme.ink, marginBottom: 10 }}>{o.title}</div>
          <div style={{ fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.45, maxWidth: 300 }}>{o.sub}</div>
        </div>
      </div>

      {/* Intro */}
      <div style={{ padding: '0 24px 22px' }}>
        <p style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.6, margin: 0 }}>{o.intro}</p>
      </div>

      {/* Curated products */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 12 }}>Mūsu izlase</div>
      </div>
      <div style={{ padding: '0 20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} theme={theme} variant="image"
            onClick={() => nav('product', { id: p.id })}
            isFavourite={isFav(p.id)} onFavourite={toggleFavourite} onQuickBuy={quickBuy} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '0 20px' }}>
        <button onClick={() => nav(o.cta.go, o.cta.params)} className="shhh-grad" style={{
          cursor: 'pointer', width: '100%', height: 52, borderRadius: theme.radiusPill,
          fontFamily: theme.body, fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>{o.cta.label}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SaleScreen — promotions landing with discounted products
// ─────────────────────────────────────────────────────────────
const SALE_DEALS = [
  { id: 'glow',    pct: 25 },
  { id: 'ripple',  pct: 20 },
  { id: 'velvet',  pct: 30 },
  { id: 'drift',   pct: 15 },
];

// Rotating promo banners for the sale page
const SALE_BANNERS = [
  { kicker: 'Tikai šonedēļ', title: 'Līdz −30%', sub: 'Izlasei pievienoti favorīti par īpašu cenu. Diskrēta piegāde, kā vienmēr. 🤫', bg: 'linear-gradient(135deg, #FF4FB8 0%, #B14BE8 45%, #2D4BFF 100%)', deco: ['🔥', '💋', '🍑', '✨'] },
  { kicker: 'Pāriem', title: '2 par €99', sub: 'Izvēlies divus pāru favorītus un ietaupi. Ideāli kopīgiem vakariem. 💞', bg: 'linear-gradient(135deg, #6E4DF8 0%, #B14BE8 50%, #FF4FB8 100%)', deco: ['💞', '✨', '🌶️', '💋'] },
  { kicker: 'Jaunums', title: 'Bezmaksas dāvana', sub: 'Pērc par €80+ un saņem Whisper komplektu bez maksas. 🎁', bg: 'linear-gradient(135deg, #2D4BFF 0%, #6E4DF8 55%, #B14BE8 100%)', deco: ['🎁', '✨', '🍑', '🔥'] },
];

function SaleBannerCarousel({ theme, onOpen }) {
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const n = SALE_BANNERS.length;
  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx(i => (i + 1) % n), 4000);
    return () => clearInterval(id);
  }, [paused, n]);
  const b = SALE_BANNERS[idx];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div onClick={onOpen} style={{
        borderRadius: 22, padding: '24px 22px', position: 'relative', overflow: 'hidden',
        background: b.bg, color: '#fff', height: 180, boxSizing: 'border-box', cursor: 'pointer',
        transition: 'background .5s ease',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {b.deco.map((e, i) => (
          <span key={i} style={{ position: 'absolute', right: 14 + (i % 2) * 30, top: 12 + i * 20, fontSize: 24, opacity: 0.5, transform: `rotate(${i * 12 - 20}deg)` }}>{e}</span>
        ))}
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', opacity: 0.9, marginBottom: 8 }}>{b.kicker}</div>
          <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 36, letterSpacing: theme.letterDisplay, lineHeight: 0.95, marginBottom: 8 }}>{b.title}</div>
          <div style={{ fontFamily: theme.body, fontSize: 13, opacity: 0.85, lineHeight: 1.35, maxWidth: 270 }}>{b.sub}</div>
        </div>
      </div>
      {/* Dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
        {SALE_BANNERS.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }} aria-label={`Banner ${i + 1}`} style={{
            all: 'unset', cursor: 'pointer',
            width: i === idx ? 18 : 6, height: 6, borderRadius: 6,
            background: i === idx ? theme.ink : theme.rule, transition: 'width .3s ease, background .3s ease',
          }} />
        ))}
      </div>
    </div>
  );
}

function SaleScreen({ theme, nav, favourites = [], toggleFavourite, quickBuy }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const isFav = (id) => (favourites || []).includes(id);
  const deals = PRODUCTS.filter(p => p.oldPrice && p.oldPrice > p.price)
    .map(p => ({ id: p.id, pct: Math.round((1 - p.price / p.oldPrice) * 100), product: p }));
  const [saleInfo, setSaleInfo] = React.useState(null);
  const [saleCat, setSaleCat] = React.useState('all');
  const [saleSort, setSaleSort] = React.useState('discount');
  const shownDeals = React.useMemo(() => {
    let l = saleCat === 'all' ? deals : deals.filter(d => d.product.category === saleCat);
    l = [...l].sort((a, b) => saleSort === 'discount' ? b.pct - a.pct : a.product.price - b.product.price);
    return l;
  }, [saleCat, saleSort]);

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Breadcrumb */}
      <div style={{ padding: '12px 20px 0', fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
        <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>{t('page.home', 'Home')}</button>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: theme.ink, fontWeight: 600 }}>Akcijas</span>
      </div>

      {/* Hero banner */}
      <div style={{ padding: '0 20px 22px' }}>
        <SaleBannerCarousel theme={theme} onOpen={() => {
          const el = document.getElementById('sale-deals');
          if (el) {
            const sc = (function find(n){ for (let p = n.parentElement; p; p = p.parentElement){ const s = getComputedStyle(p); if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && p.scrollHeight > p.clientHeight) return p; } return null; })(el);
            if (sc) sc.scrollTop = el.offsetTop - 60;
          }
        }} />
      </div>

      {/* Free shipping + gift strip */}
      <div style={{ padding: '0 20px 22px', display: 'flex', gap: 10 }}>
        {[
          { icon: <Icon name="truck" size={18} color={theme.ink} />, label: 'Bezmaksas piegāde €60+', info: 'Pasūtījumiem virs €60 piegāde uz pakomātu ir bezmaksas visā Baltijā. Slieksnis tiek rēķināts pēc atlaižu piemērošanas.' },
          { icon: <span style={{ fontSize: 16 }}>🎁</span>, label: 'Dāvana €80+', info: 'Spend €80 un grozam automātiski pievienosies bezmaksas Whisper komplekts: zīda maciņš, 5 ml lubrikanta paraugs un pateicības kartīte.' },
        ].map((p, i) => (
          <div key={i} style={{ flex: 1, padding: '12px 14px', borderRadius: theme.radius, background: theme.surfaceAlt, display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            {p.icon}
            <span style={{ flex: 1, fontFamily: theme.body, fontSize: 12, fontWeight: 600, color: theme.ink }}>{p.label}</span>
            <button onClick={() => setSaleInfo(saleInfo === i ? null : i)} aria-label="Info" style={{
              all: 'unset', cursor: 'pointer', width: 18, height: 18, borderRadius: 999, flexShrink: 0,
              border: `1.2px solid ${theme.inkSoft}`, color: theme.inkSoft,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700, fontSize: 10, lineHeight: 1,
            }}>i</button>
            {saleInfo === i && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 5,
                padding: '10px 12px', borderRadius: theme.radiusSm,
                background: theme.ink, color: theme.bg,
                fontFamily: theme.body, fontSize: 11, lineHeight: 1.45,
                boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
              }}>{p.info}</div>
            )}
          </div>
        ))}
      </div>

      {/* Deals grid */}
      <div id="sale-deals" style={{ padding: '0 20px 12px' }}>
        {/* Category filter chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 12 }}>
          {(() => {
            const CAT_LABELS = {
              solo: 'Vibratori un stimulatori', couples: 'Anālie stimulatori',
              beginners: 'Erotiskā veļa', premium: 'Dildo', travel: 'Lubrikanti',
            };
            const cats = [{ id: 'all', label: 'Visi' },
              ...CATEGORIES.filter(c => c.id !== 'all').map(c => ({ id: c.id, label: CAT_LABELS[c.id] || c.label }))]
              .filter(c => c.id === 'all' || deals.some(d => d.product.category === c.id));
            return cats.map(c => {
              const count = c.id === 'all' ? deals.length : deals.filter(d => d.product.category === c.id).length;
              const active = saleCat === c.id;
              return (
                <button key={c.id} onClick={() => setSaleCat(c.id)} style={{
                  all: 'unset', cursor: 'pointer', whiteSpace: 'nowrap',
                  padding: '8px 14px', borderRadius: theme.radiusPill,
                  background: active ? theme.ink : 'transparent',
                  color: active ? theme.bg : theme.ink,
                  border: active ? 'none' : `1.5px solid ${theme.rule}`,
                  fontFamily: theme.body, fontSize: 13, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>{c.label}<span style={{ opacity: 0.6, fontFamily: theme.mono, fontSize: 11 }}>{count.toString().padStart(2, '0')}</span></button>
              );
            });
          })()}
        </div>
        {/* Sort + count row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 5h18M6 12h12M10 19h4" stroke={theme.ink} strokeWidth="2" strokeLinecap="round" /></svg>
            <button onClick={() => setSaleSort(saleSort === 'discount' ? 'price' : 'discount')} style={{
              all: 'unset', cursor: 'pointer', fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.ink,
            }}>Kārtot: {saleSort === 'discount' ? 'Lielākā atlaide' : 'Cena'}</button>
          </div>
          <span style={{ fontFamily: theme.mono, fontSize: 11, color: theme.inkSoft }}>
            {shownDeals.length.toString().padStart(2, '0')} preces
          </span>
        </div>
      </div>
      <div style={{ padding: '0 20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {shownDeals.map(({ product: p }) => (
          <ProductCard key={p.id} product={p} theme={theme} variant="image"
            onClick={() => nav('product', { id: p.id })}
            isFavourite={isFav(p.id)} onFavourite={toggleFavourite} onQuickBuy={quickBuy} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '0 20px' }}>
        <button onClick={() => nav('category', { cat: 'all' })} className="shhh-grad" style={{
          cursor: 'pointer', width: '100%', height: 52, borderRadius: theme.radiusPill,
          fontFamily: theme.body, fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>Skatīt visu sortimentu →</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GiftCardScreen — buy a gift card, send anonymously
// ─────────────────────────────────────────────────────────────
function GiftCardScreen({ theme, nav }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const AMOUNTS = [25, 50, 75, 100, 150];
  const [amount, setAmount] = React.useState(50);
  const [custom, setCustom] = React.useState('');
  const [delivery, setDelivery] = React.useState('email'); // email | sms | link
  const [to, setTo] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [anon, setAnon] = React.useState(true);
  const [sender, setSender] = React.useState('');
  const [done, setDone] = React.useState(false);
  const [paying, setPaying] = React.useState(false);
  const [orderRef, setOrderRef] = React.useState('');
  const value = custom ? Math.max(10, parseInt(custom, 10) || 0) : amount;
  const [gcView, setGcView] = React.useState('buy'); // buy | check
  // Balance checker
  const [checkCode, setCheckCode] = React.useState('');
  const [checkResult, setCheckResult] = React.useState(null); // null | 'invalid' | {code,balance,initial}
  const runBalanceCheck = () => {
    const code = checkCode.trim().toUpperCase();
    const card = (window.GIFT_CARDS || {})[code];
    if (!card) { setCheckResult('invalid'); return; }
    setCheckResult({ code, balance: card.balance, initial: card.initial });
  };

  // ── Payment step ──
  if (paying && !done) {
    const finalize = () => {
      setOrderRef('GC' + Math.floor(Math.random() * 90000 + 10000));
      setDone(true);
    };
    return (
      <div style={{ paddingBottom: 60 }}>
        <div style={{ padding: '12px 20px 0', fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>{t('page.home', 'Home')}</button>
          <span style={{ opacity: 0.4 }}>›</span>
          <button onClick={() => setPaying(false)} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>Dāvanu karte</button>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: theme.ink, fontWeight: 600 }}>Apmaksa</span>
        </div>

        <div style={{ padding: '14px 20px 6px' }}>
          <h1 style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 28, letterSpacing: theme.letterDisplay, lineHeight: 1, margin: 0 }}>
            Apmaksā dāvanu karti 💳
          </h1>
        </div>

        {/* Order summary */}
        <div style={{ padding: '12px 20px 18px' }}>
          <div style={{
            padding: 16, borderRadius: theme.radius, background: theme.surface,
            border: `1px solid ${theme.rule}`, display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 13, color: theme.inkSoft }}>
              <span>Dāvanu karte</span><span style={{ fontFamily: theme.mono, color: theme.ink }}>€{value.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 13, color: theme.inkSoft }}>
              <span>Piegāde ({delivery === 'email' ? 'e-pasts' : delivery === 'sms' ? 'SMS' : 'saite'})</span>
              <span style={{ fontFamily: theme.mono, color: theme.ink }}>Bezmaksas</span>
            </div>
            <div style={{ height: 1, background: theme.rule, margin: '2px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink }}>Kopā jāmaksā</span>
              <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 22, color: theme.ink, letterSpacing: theme.letterDisplay }}>€{value.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 11, color: theme.inkSoft }}>
              <span>{anon ? 'Sūtītājs: anonīms 🤫' : 'Sūtītājs: ' + (sender || '—')}</span>
              <span>{delivery !== 'link' ? '→ ' + (to || 'saņēmējs') : 'Saite'}</span>
            </div>
          </div>
        </div>

        {/* Pay options */}
        <div style={{ padding: '0 20px' }}>
          <div style={{
            fontFamily: theme.body, fontSize: 11, fontWeight: 700,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            color: theme.inkSoft, marginBottom: 10,
          }}>Maksājuma veids</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
            <button onClick={finalize} style={{
              all: 'unset', cursor: 'pointer', height: 56, borderRadius: theme.radiusPill,
              background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon name="apple" size={22} color="#fff" />
              <span style={{ fontFamily: '-apple-system, system-ui', fontWeight: 500, fontSize: 19, letterSpacing: -0.2 }}>Pay</span>
            </button>
            <button onClick={finalize} style={{
              all: 'unset', cursor: 'pointer', height: 56, borderRadius: theme.radiusPill,
              background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <span style={{ fontFamily: 'Roboto, system-ui', fontWeight: 500, fontSize: 17 }}>
                <span style={{ color: '#4285F4' }}>G</span><span style={{ color: '#EA4335' }}>o</span><span style={{ color: '#FBBC05' }}>o</span><span style={{ color: '#4285F4' }}>g</span><span style={{ color: '#34A853' }}>l</span><span style={{ color: '#EA4335' }}>e</span>
              </span>
              <span>Pay</span>
            </button>
            <button onClick={finalize} className="shhh-grad" style={{
              cursor: 'pointer', height: 52, borderRadius: theme.radiusPill,
              fontFamily: theme.body, fontWeight: 700, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>Maksāt ar karti / banklink · €{value.toFixed(2)}</button>
          </div>
          <button onClick={() => setPaying(false)} style={{
            all: 'unset', cursor: 'pointer', width: '100%', textAlign: 'center',
            fontFamily: theme.body, fontSize: 13, fontWeight: 600, color: theme.inkSoft,
            textDecoration: 'underline',
          }}>← Atpakaļ</button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ paddingBottom: 60 }}>
        <div style={{ padding: '12px 20px 0', fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>{t('page.home', 'Home')}</button>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: theme.ink, fontWeight: 600 }}>Dāvanu karte</span>
        </div>
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 999, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #FF4FB8, #6E4DF8, #2D4BFF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38,
          }}>🎁</div>
          <h1 style={{
            fontFamily: theme.display, fontWeight: 700, fontSize: 32,
            letterSpacing: theme.letterDisplay, lineHeight: 1, margin: '0 0 12px',
          }}>Dāvanu karte nosūtīta! ✨</h1>
          <p style={{ fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.55, margin: '0 auto 16px', maxWidth: 320 }}>
            €{value} dāvanu karte aizceļos uz {to || 'saņēmēju'} {delivery === 'email' ? 'pa e-pastu' : delivery === 'sms' ? 'ar SMS' : 'ar saiti'}.
            {anon ? ' Sūtītājs paliek anonīms — neviens nezinās, ka tā esi tu. 🤫' : ''}
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px',
            borderRadius: 999, background: theme.surfaceAlt, marginBottom: 24,
          }}>
            <span style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.inkSoft }}>Pasūtījums</span>
            <span style={{ fontFamily: theme.mono, fontSize: 13, fontWeight: 700, color: theme.ink }}>#{orderRef}</span>
          </div>
          <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.5, maxWidth: 320, margin: '0 auto 24px' }}>
            Apstiprinājuma e-pastu nosūtījām tev. Bankas izrakstā parādīsies "NL Trading Co".
          </div>
          <PrimaryButton theme={theme} onClick={() => nav('home')}>Atpakaļ uz veikalu</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ padding: '12px 20px 0', fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14 }}>
        <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>{t('page.home', 'Home')}</button>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: theme.ink, fontWeight: 600 }}>Dāvanu karte</span>
      </div>

      {/* Buy / Check toggle */}
      <div style={{ padding: '0 20px 18px' }}>
        <div style={{
          display: 'flex', gap: 4, padding: 4, borderRadius: theme.radiusPill,
          background: theme.surfaceAlt,
        }}>
          {[['buy', '🎁 Pirkt'], ['check', '🔍 Pārbaudīt atlikumu']].map(([id, label]) => (
            <button key={id} onClick={() => setGcView(id)} style={{
              all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '10px 0',
              borderRadius: theme.radiusPill,
              background: gcView === id ? theme.surface : 'transparent',
              boxShadow: gcView === id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              fontFamily: theme.body, fontWeight: 700, fontSize: 13,
              color: gcView === id ? theme.ink : theme.inkSoft,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {gcView === 'buy' && (<>
      {/* Hero card preview */}
      <div style={{ padding: '0 20px 22px' }}>
        <div style={{
          aspectRatio: '16/10', borderRadius: 20, padding: 22,
          background: 'linear-gradient(135deg, #FF4FB8 0%, #B14BE8 45%, #2D4BFF 100%)',
          color: '#fff', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          boxShadow: '0 12px 30px rgba(110,77,248,0.30)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 22, letterSpacing: theme.letterDisplay }}>shhh<span style={{ opacity: 0.8 }}>...</span></span>
            <span style={{ fontSize: 26 }}>🎁</span>
          </div>
          <div>
            <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', opacity: 0.85 }}>Dāvanu karte</div>
            <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 42, letterSpacing: theme.letterDisplay, lineHeight: 1 }}>€{value}</div>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div style={{ padding: '0 20px 22px' }}>
        <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 12 }}>Summa</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {AMOUNTS.map(a => (
            <button key={a} onClick={() => { setAmount(a); setCustom(''); }} style={{
              all: 'unset', cursor: 'pointer', padding: '10px 16px', borderRadius: theme.radiusPill,
              background: (!custom && amount === a) ? theme.ink : theme.surface,
              color: (!custom && amount === a) ? theme.bg : theme.ink,
              border: `1.5px solid ${(!custom && amount === a) ? theme.ink : theme.rule}`,
              fontFamily: theme.body, fontWeight: 700, fontSize: 14,
            }}>€{a}</button>
          ))}
          <input value={custom} onChange={e => setCustom(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Cita…" inputMode="numeric" style={{
              width: 80, boxSizing: 'border-box', height: 42, padding: '0 14px',
              borderRadius: theme.radiusPill, border: `1.5px solid ${custom ? theme.ink : theme.rule}`,
              background: theme.surface, fontFamily: theme.body, fontSize: 14, color: theme.ink, outline: 'none',
            }} />
        </div>
      </div>

      {/* Delivery method */}
      <div style={{ padding: '0 20px 22px' }}>
        <div style={{ fontFamily: theme.body, fontSize: 11, fontWeight: 700, letterSpacing: theme.letterCaps, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 12 }}>Kā nosūtīt</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['email', '📧 E-pasts'], ['sms', '💬 SMS'], ['link', '🔗 Saite']].map(([id, label]) => (
            <button key={id} onClick={() => setDelivery(id)} style={{
              all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '12px 0',
              borderRadius: theme.radius, background: delivery === id ? theme.ink : theme.surface,
              color: delivery === id ? theme.bg : theme.ink,
              border: `1.5px solid ${delivery === id ? theme.ink : theme.rule}`,
              fontFamily: theme.body, fontWeight: 700, fontSize: 13,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Recipient + message */}
      <div style={{ padding: '0 20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {delivery !== 'link' && (
          <input value={to} onChange={e => setTo(e.target.value)}
            placeholder={delivery === 'email' ? 'Saņēmēja e-pasts' : 'Saņēmēja tālrunis'}
            style={{
              width: '100%', boxSizing: 'border-box', height: 48, padding: '0 14px',
              borderRadius: theme.radiusSm, border: `1.5px solid ${theme.rule}`,
              background: theme.surface, fontFamily: theme.body, fontSize: 15, color: theme.ink, outline: 'none',
            }} />
        )}
        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
          placeholder="Personīga ziņa (neobligāti)… 💌" style={{
            width: '100%', boxSizing: 'border-box', padding: '10px 14px',
            borderRadius: theme.radiusSm, border: `1.5px solid ${theme.rule}`,
            background: theme.surface, fontFamily: theme.body, fontSize: 14, color: theme.ink,
            outline: 'none', resize: 'vertical',
          }} />
      </div>

      {/* Anonymous toggle */}
      <div style={{ padding: '0 20px 22px' }}>
        <button onClick={() => setAnon(!anon)} style={{
          all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
          padding: 14, borderRadius: theme.radius, background: theme.surface,
          border: `1.5px solid ${anon ? theme.accent : theme.rule}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 999, flexShrink: 0,
            border: `2px solid ${anon ? theme.accent : theme.rule}`,
            background: anon ? theme.accent : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{anon && <Icon name="check" size={13} color={theme.accentInk} strokeWidth={2.4} />}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink }}>Sūtīt anonīmi 🤫</div>
            <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>Saņēmējs neredzēs tavu vārdu</div>
          </div>
        </button>
        {!anon && (
          <input value={sender} onChange={e => setSender(e.target.value)}
            placeholder="Tavs vārds (parādīsies dāvanā)" style={{
              width: '100%', boxSizing: 'border-box', height: 46, padding: '0 14px', marginTop: 10,
              borderRadius: theme.radiusSm, border: `1.5px solid ${theme.rule}`,
              background: theme.surface, fontFamily: theme.body, fontSize: 15, color: theme.ink, outline: 'none',
            }} />
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: '0 20px' }}>
        <PrimaryButton theme={theme} size="lg"
          onClick={() => { if (delivery === 'link' || to.trim()) setPaying(true); }}>
          Pirkt un nosūtīt · €{value}
        </PrimaryButton>
        <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
          Dāvanu karte derīga 24 mēnešus · izmantojama visam sortimentam · bankas izrakstā "NL Trading Co"
        </div>
      </div>
      <GiftCardInfo theme={theme} />
      </>)}

      {/* Balance checker */}
      {gcView === 'check' && (
      <div style={{ padding: '0 20px 0' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.inkSoft, marginBottom: 6,
        }}>Pārbaudīt atlikumu</div>
        <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.5, marginBottom: 12 }}>
          Saņēmi dāvanu karti? Ievadi kodu, lai redzētu atlikumu.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={checkCode} onChange={e => { setCheckCode(e.target.value); setCheckResult(null); }}
            placeholder="SHHH-GIFT-50" style={{
              flex: 1, minWidth: 0, boxSizing: 'border-box', height: 48, padding: '0 14px',
              borderRadius: theme.radiusSm, border: `1.5px solid ${checkResult === 'invalid' ? theme.accent : theme.rule}`,
              background: theme.surface, fontFamily: theme.mono, fontSize: 14, color: theme.ink,
              outline: 'none', textTransform: 'uppercase',
            }} />
          <button onClick={runBalanceCheck} style={{
            all: 'unset', cursor: 'pointer', padding: '0 18px', height: 48,
            borderRadius: theme.radiusSm, background: theme.ink, color: theme.bg,
            fontFamily: theme.body, fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>Pārbaudīt</button>
        </div>
        {checkResult === 'invalid' && (
          <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.accent, marginTop: 8 }}>
            Nederīgs vai neeksistējošs kods.
          </div>
        )}
        {checkResult && checkResult !== 'invalid' && (
          <div style={{
            marginTop: 12, padding: 16, borderRadius: theme.radius,
            background: theme.surface, border: `1.5px solid ${theme.accent}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: theme.mono, fontSize: 13, fontWeight: 700, color: theme.ink }}>{checkResult.code}</span>
              <span style={{ fontSize: 18 }}>🎁</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginBottom: 4 }}>
              <span>Sākotnējā vērtība</span>
              <span style={{ fontFamily: theme.mono, color: theme.ink }}>€{checkResult.initial.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 8, borderTop: `1px solid ${theme.rule}` }}>
              <span style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink }}>Pieejamais atlikums</span>
              <span style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 26, color: theme.accent, letterSpacing: theme.letterDisplay }}>€{checkResult.balance.toFixed(2)}</span>
            </div>
            <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 10, lineHeight: 1.45 }}>
              Izmanto šo kodu apmaksas solī, lai segtu pasūtījumu.
            </div>
          </div>
        )}
        <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 10, marginBottom: 24 }}>
          Demo kodi: SHHH-GIFT-50 · SHHH-GIFT-100 · SHHH-LOVE-25
        </div>

        {/* CTA to begin purchasing */}
        <div style={{
          padding: 18, borderRadius: theme.radius, background: theme.ink, color: theme.bg,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 20, letterSpacing: theme.letterDisplay, lineHeight: 1.1 }}>
              Gatavs iztērēt? 🛍️
            </div>
            <div style={{ fontFamily: theme.body, fontSize: 12, opacity: 0.75, marginTop: 4, lineHeight: 1.45 }}>
              Izmanto savu dāvanu karti — pārlūko visu sortimentu un izvēlies sev tīkamāko.
            </div>
          </div>
          <button onClick={() => nav('category', { cat: 'all' })} className="shhh-grad" style={{
            cursor: 'pointer', height: 48, borderRadius: theme.radiusPill,
            fontFamily: theme.body, fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>Iepirkties veikalā →</button>
        </div>
        <GiftCardInfo theme={theme} />
      </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GiftCardInfo — how-to-use, validity, and T&C (shown on both tabs)
// ─────────────────────────────────────────────────────────────
function GiftCardInfo({ theme }) {
  return (
    <div style={{ padding: '24px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* How to use + validity — two cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <div style={{
          padding: 18, borderRadius: theme.radius, background: theme.surfaceAlt,
        }}>
          <div style={{ fontSize: 26, marginBottom: 10 }}>🛍️</div>
          <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 20, color: theme.ink, letterSpacing: theme.letterDisplay, marginBottom: 8 }}>
            Kā to izmantot?
          </div>
          <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.55 }}>
            Saņēmi dāvanu karti? Ievadi tās kodu apmaksas solī — vērtība tiks automātiski atvilkta no pasūtījuma summas. Karti var izmantot visam sortimentam tiešsaistes veikalā.
          </div>
        </div>
        <div style={{
          padding: 18, borderRadius: theme.radius, background: theme.surfaceAlt,
        }}>
          <div style={{ fontSize: 26, marginBottom: 10 }}>🗓️</div>
          <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 20, color: theme.ink, letterSpacing: theme.letterDisplay, marginBottom: 8 }}>
            Derīguma termiņš
          </div>
          <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.55 }}>
            Dāvanu karte ir derīga <strong style={{ color: theme.ink }}>24 mēnešus no iegādes datuma</strong>. Karti var izmantot vairākos pirkumos, līdz tās atlikums ir izlietots. Dāvanu karte nav papildināma.
          </div>
        </div>
      </div>

      {/* T&C */}
      <div style={{
        padding: 18, borderRadius: theme.radius, background: theme.surface,
        border: `1px solid ${theme.rule}`,
      }}>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 20, color: theme.ink, letterSpacing: theme.letterDisplay, marginBottom: 10 }}>
          Noteikumi un nosacījumi
        </div>
        <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0 }}>To nevar izpirkt naudā, atgriezt vai aizvietot nozaudēšanas/zādzības gadījumā, kā arī, ja tā netiek izmantota pilnībā vai daļēji līdz derīguma termiņa beigām.</p>
          <p style={{ margin: 0 }}>Dāvanu karte ir pieņemta ikvienam, kas to uzrāda, un to var izmantot pirkumiem tiešsaistes veikalā.</p>
          <p style={{ margin: 0 }}>Ja produkta cena pārsniedz dāvanu kartes vērtību, atlikušo summu varēsi samaksāt ar kādu no veikala nodrošinātajām maksājumu metodēm (Apple Pay, Google Pay, Citadele, Swedbank, SEB, Luminor, karte).</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GdprForm — data-rights request (access / export / rectify /
// erase / restrict / object). Front-end only; confirms in-place.
// ─────────────────────────────────────────────────────────────
function GdprForm({ theme }) {
  const RIGHTS = [
    ['access', 'Piekļuve — kopija no maniem datiem'],
    ['export', 'Pārnesamība — eksports mašīnlasāmā formātā'],
    ['rectify', 'Labošana — izlabot nepareizus datus'],
    ['erase', 'Dzēšana — "tikt aizmirstam"'],
    ['restrict', 'Ierobežošana — apturēt apstrādi'],
    ['object', 'Iebildums — pārtraukt konkrētu izmantošanu'],
  ];
  const [right, setRight] = React.useState('access');
  const [email, setEmail] = React.useState('');
  const [ref, setRef] = React.useState('');
  const [sent, setSent] = React.useState(false);

  if (sent) {
    return (
      <div style={{
        padding: 18, borderRadius: theme.radius, background: theme.surface,
        border: `1.5px solid ${theme.accent}`,
      }}>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 20, color: theme.ink, letterSpacing: theme.letterDisplay, marginBottom: 8 }}>
          Pieprasījums saņemts ✓
        </div>
        <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.55 }}>
          Saņemsi apstiprinājuma e-pastu. Atbildēsim 30 dienu laikā saskaņā ar VDAR 12. pantu. Sarežģītos gadījumos termiņš var tikt pagarināts par 60 dienām, par ko tevi informēsim.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: 18, borderRadius: theme.radius, background: theme.surface,
      border: `1.5px solid ${theme.accent}`,
    }}>
      <div style={{
        fontFamily: theme.body, fontSize: 10, fontWeight: 700,
        letterSpacing: theme.letterCaps, textTransform: 'uppercase',
        color: theme.inkSoft, marginBottom: 10,
      }}>Izvēlies tiesības</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {RIGHTS.map(([id, label]) => (
          <button key={id} onClick={() => setRight(id)} style={{
            all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: theme.radiusSm,
            background: right === id ? theme.surfaceAlt : 'transparent',
            border: `1.5px solid ${right === id ? theme.ink : theme.rule}`,
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: 999, flexShrink: 0,
              border: `2px solid ${right === id ? theme.ink : theme.rule}`,
              background: right === id ? theme.ink : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{right === id && <Icon name="check" size={10} color={theme.bg} strokeWidth={2.4} />}</span>
            <span style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink, fontWeight: 600 }}>{label}</span>
          </button>
        ))}
      </div>
      <input value={email} onChange={e => setEmail(e.target.value)} type="email"
        placeholder="E-pasts (uz konta)" style={{
          width: '100%', boxSizing: 'border-box', height: 46, padding: '0 14px',
          borderRadius: theme.radiusSm, border: `1.5px solid ${theme.rule}`,
          background: theme.bg, fontFamily: theme.body, fontSize: 15, color: theme.ink,
          outline: 'none', marginBottom: 10,
        }} />
      <input value={ref} onChange={e => setRef(e.target.value)}
        placeholder="Pasūtījuma numurs (neobligāti)" style={{
          width: '100%', boxSizing: 'border-box', height: 46, padding: '0 14px',
          borderRadius: theme.radiusSm, border: `1.5px solid ${theme.rule}`,
          background: theme.bg, fontFamily: theme.mono, fontSize: 14, color: theme.ink,
          outline: 'none', marginBottom: 14,
        }} />
      <button onClick={() => { if (email.trim()) setSent(true); }} className="shhh-grad" style={{
        cursor: email.trim() ? 'pointer' : 'not-allowed', width: '100%', height: 48,
        borderRadius: theme.radiusPill, fontFamily: theme.body, fontWeight: 700, fontSize: 14,
        opacity: email.trim() ? 1 : 0.5,
      }}>Iesniegt pieprasījumu</button>
      <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 10, lineHeight: 1.45 }}>
        Datu pārzinis: NL Trading Co SIA · privacy@shhh.lv. Atbilde 30 dienu laikā (VDAR 12. pants).
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ReviewForm — hybrid review submission, gated by order number.
// Front-end only: validates a plausible order ref, then "submits"
// to a moderation queue (optimistic confirmation).
// ─────────────────────────────────────────────────────────────
function ReviewForm({ theme, productName, onSubmitted }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState('order'); // order | form | done
  const [orderRef, setOrderRef] = React.useState('');
  const [orderErr, setOrderErr] = React.useState('');
  const [verified, setVerified] = React.useState(false);
  const [stars, setStars] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [name, setName] = React.useState('');
  const [body, setBody] = React.useState('');

  // Accepts SH##### (our format) — anything else is treated as unverified.
  const checkOrder = () => {
    const v = orderRef.trim().toUpperCase().replace(/\s/g, '');
    if (!v) { setOrderErr('Ievadi pasūtījuma numuru'); return; }
    const ok = /^#?SH\d{4,6}$/.test(v);
    setVerified(ok);
    setOrderErr('');
    setStep('form');
  };

  const submit = () => {
    if (!stars || !body.trim()) return;
    if (typeof onSubmitted === 'function') {
      onSubmitted({
        name: name.trim() || 'Anonīms', stars, body: body.trim(),
        date: new Date().toLocaleDateString('lv-LV'), verified,
        orderRef: orderRef.trim(),
      });
    }
    setStep('done');
  };

  const Field = (props) => (
    <input {...props} style={{
      width: '100%', boxSizing: 'border-box', height: 46, padding: '0 14px',
      borderRadius: theme.radiusSm, border: `1.5px solid ${theme.rule}`,
      background: theme.bg, fontFamily: theme.body, fontSize: 15, color: theme.ink,
      outline: 'none', ...(props.style || {}),
    }} />
  );

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
        width: '100%', textAlign: 'center', padding: '14px 0',
        borderRadius: theme.radiusPill, border: `1.5px solid ${theme.ink}`,
        color: theme.ink, fontFamily: theme.body, fontWeight: 700, fontSize: 14,
        marginTop: 6,
      }}>✍️ {t('rev.write', 'Rakstīt atsauksmi')}</button>
    );
  }

  return (
    <div style={{
      marginTop: 10, padding: 16, borderRadius: theme.radius,
      background: theme.surface, border: `1.5px solid ${theme.accent}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: theme.display, fontWeight: 700, fontSize: 20, color: theme.ink, letterSpacing: theme.letterDisplay }}>
          {step === 'done' ? 'Paldies! 🎉' : t('rev.write', 'Rakstīt atsauksmi')}
        </div>
        <button onClick={() => { setOpen(false); setStep('order'); }} aria-label="Aizvērt" style={{
          all: 'unset', cursor: 'pointer', width: 30, height: 30, borderRadius: 999,
          background: theme.surfaceAlt, color: theme.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="close" size={16} /></button>
      </div>

      {step === 'order' && (
        <div>
          <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.5, marginBottom: 12 }}>
            Ievadi pasūtījuma numuru, lai atsauksme tiktu apzīmēta kā <strong style={{ color: theme.ink }}>verificēts pirkums</strong>. Tas ir tavā apstiprinājuma e-pastā (piem. SH72341).
          </div>
          <Field value={orderRef} onChange={e => setOrderRef(e.target.value)}
            placeholder="SH72341" style={{ fontFamily: theme.mono, textTransform: 'uppercase', marginBottom: orderErr ? 6 : 12 }} />
          {orderErr && <div style={{ fontFamily: theme.body, fontSize: 12, color: theme.accent, marginBottom: 12 }}>{orderErr}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={checkOrder} className="shhh-grad" style={{
              cursor: 'pointer', flex: 1, height: 46, borderRadius: theme.radiusPill,
              fontFamily: theme.body, fontWeight: 700, fontSize: 14,
            }}>Turpināt</button>
            <button onClick={() => { setVerified(false); setStep('form'); }} style={{
              all: 'unset', cursor: 'pointer', padding: '0 16px', height: 46,
              borderRadius: theme.radiusPill, border: `1.5px solid ${theme.rule}`,
              color: theme.inkSoft, fontFamily: theme.body, fontWeight: 600, fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>Nav numura</button>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div>
          {verified ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12,
              padding: '4px 10px', borderRadius: 999, background: theme.surfaceAlt,
              fontFamily: theme.body, fontSize: 11, fontWeight: 700, color: theme.ink,
            }}>✓ Verificēts pirkums</div>
          ) : (
            <div style={{
              fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, marginBottom: 12, lineHeight: 1.45,
            }}>Bez pasūtījuma numura — atsauksme tiks apzīmēta kā <strong>neverificēta</strong> un publicēta pēc moderācijas.</div>
          )}

          {/* Star picker */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setStars(n)}
                onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                style={{
                  all: 'unset', cursor: 'pointer', fontSize: 28, lineHeight: 1,
                  color: (hover || stars) >= n ? theme.accent : theme.rule,
                }}>★</button>
            ))}
          </div>

          <Field value={name} onChange={e => setName(e.target.value)}
            placeholder="Vārds (vai atstāj tukšu — Anonīms)" style={{ marginBottom: 10 }} />
          <textarea value={body} onChange={e => setBody(e.target.value)}
            placeholder={`Kā tev patika ${productName || 'produkts'}?`}
            rows={4} style={{
              width: '100%', boxSizing: 'border-box', padding: '10px 14px',
              borderRadius: theme.radiusSm, border: `1.5px solid ${theme.rule}`,
              background: theme.bg, fontFamily: theme.body, fontSize: 14, color: theme.ink,
              outline: 'none', resize: 'vertical', marginBottom: 12,
            }} />
          <button onClick={submit} disabled={!stars || !body.trim()} className="shhh-grad" style={{
            cursor: (!stars || !body.trim()) ? 'not-allowed' : 'pointer', width: '100%', height: 48,
            borderRadius: theme.radiusPill, fontFamily: theme.body, fontWeight: 700, fontSize: 14,
            opacity: (!stars || !body.trim()) ? 0.5 : 1,
          }}>Iesniegt atsauksmi</button>
        </div>
      )}

      {step === 'done' && (
        <div style={{ fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.55 }}>
          {verified
            ? 'Tava verificētā atsauksme ir saņemta un parādīsies šeit pēc īsas moderācijas (līdz 24h). Paldies, ka dalies!'
            : 'Tava atsauksme ir saņemta un tiks publicēta pēc moderācijas (līdz 24h). Paldies!'}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CategoryLandingScreen — SEO landing page for a top category:
// big title, SEO intro paragraph, subcategory circles, product grid.
// ─────────────────────────────────────────────────────────────
const CATEGORY_FAQ = {
  solo: [
    ['Kā izvēlēties pareizo vibratoru?', 'Iesācējiem ieteicams mazāks, kluss modelis ar vienu pogu. Pievērs uzmanību materiālam (medicīniskas klases silikons) un skaņas līmenim (≤32 dB).'],
    ['Vai tie ir klusi?', 'Mūsu modeļi darbojas 26–38 dB diapazonā. "Whisper-quiet" modeļus var droši lietot plānu sienu dzīvoklī.'],
    ['Kāds lubrikants jālieto?', 'Silikona produktiem tikai ūdens bāzes lubrikants — silikona bāze bojā virsmu.'],
  ],
  couples: [
    ['Vai anālie stimulatori ir droši iesācējiem?', 'Jā, ja sāc ar mazāko izmēru, izmanto daudz ūdens bāzes lubrikanta un izvēlies modeli ar platāku pamatni.'],
    ['Kā tos tīrīt?', 'Silti ūdens un maigas ziepes pirms un pēc lietošanas. Neporains silikons ir viegli tīrāms.'],
    ['Vai piegāde ir diskrēta?', 'Vienmēr — vienkārša kaste bez logo, sūtītājs "NL Trading Co".'],
  ],
  beginners: [
    ['Kā izvēlēties izmēru erotiskajai veļai?', 'Pārbaudi katra produkta izmēru tabulu. Šaubu gadījumā izvēlies lielāku — daudzi modeļi ir ar regulējamām siksniņām.'],
    ['Vai materiāli ir ādai draudzīgi?', 'Jā, izmantojam hipoalerģiskus audumus. Sastāvs norādīts katra produkta lapā.'],
  ],
  premium: [
    ['Ar ko atšķiras premium modeļi?', 'Aerokosmiskie materiāli, sildoši uzgaļi, lietotnes vadība, ilgāks akumulators un mūža garantija.'],
    ['Vai dildo ir ķermenim drošs?', 'Visi mūsu dildo ir no medicīniskas klases silikona vai stikla — neporaini, bez ftalātiem.'],
  ],
  travelGear: [
    ['Vai lubrikants ir saderīgs ar manu rotaļlietu?', 'Silikona rotaļlietām — ūdens bāzes lubrikants. Stiklam un metālam der jebkurš.'],
    ['Cik ilgi lubrikants saglabājas?', 'Ūdens bāzes ātrāk izžūst, silikona bāzes slīd ilgāk. Hibrīds ir kompromiss.'],
    ['Kurš lubrikants jutīgai ādai?', 'Izvēlies ūdens bāzes lubrikantu bez glicerīna un parabēniem. Hialurons palīdz saglabāt mitrumu.'],
  ],
  travel: [
    ['Kā izvēlēties pareizo prezervatīva izmēru?', 'Izmēru nosaka apkārtmērs, nevis garums. Standarta der vairumam; pārbaudi platumu mm uz iepakojuma.'],
    ['Vai der bez lateksa?', 'Jā — piedāvājam poliuretāna un poliizoprēna prezervatīvus tiem, kam ir lateksa alerģija.'],
    ['Vai der ar lubrikantu?', 'Ūdens un silikona bāzes lubrikanti ir droši ar lateksu. Eļļas bāze bojā lateksu — neizmanto.'],
  ],
  premiumGear: [
    ['Kā tīrīt masturbatoru?', 'Skalo ar siltu ūdeni pēc katras lietošanas, žāvē pilnībā un lieto atjaunojošo pulveri, ja iekļauts.'],
    ['Kāds lubrikants piemērots?', 'Tikai ūdens bāzes — silikona un eļļas bāze bojā mīksto materiālu.'],
    ['Vai piegāde ir diskrēta?', 'Vienmēr — vienkārša kaste bez logo, sūtītājs "NL Trading Co".'],
  ],
  bdsm: [
    ['Vai BDSM aksesuāri ir droši iesācējiem?', 'Jā — sāc ar maigiem komplektiem (acu apsēji, mīkstas manšetes). Vienmēr vienojies par drošības vārdu.'],
    ['Kā kopt ādas un lakādas izstrādājumus?', 'Slauki ar mitru drānu, žāvē gaisā. Ādai izmanto īpašu kopšanas līdzekli; izvairies no ūdens pārpilnības.'],
    ['Vai iepakojums ir diskrēts?', 'Jā — viss pienāk neapzīmētā kastē ar anonīmu sūtītāju.'],
  ],
};
window.CATEGORY_FAQ = CATEGORY_FAQ;

const CATEGORY_LANDINGS = {
  solo: {
    title: 'Vibratori un stimulatori',    cat: 'solo',
    intro: 'Visdažādākās vibrējošās, pulsējošās un kustīgās seksa rotaļlietas noteikti spēs ikdienas rutīnu guļamistabā padarīt par svētkiem, kā arī sniegt jaunas izjūtas, spilgtināt baudas mirkļus. Jebkuru stimulatoru var aizraujoši izmantot gan solo rotaļām, gan partnerseksā — atliek vien izvēlēties savai pieredzei, gaumei un prasībām atbilstošāko!',
    subs: [
      { l: 'Gaisa plūsmas stimulatori', c: '#FF7043' },
      { l: 'Vibratori ar klitora stimulatoru', c: '#EC407A' },
      { l: 'Vibratori', c: '#7E57C2' },
      { l: 'Pulsatori', c: '#EF5350' },
      { l: 'Minivibratori', c: '#FFB300' },
      { l: 'Vibroolas', c: '#EC407A' },
      { l: 'Pāru vibratori', c: '#5E35B1' },
      { l: 'Masāžas vibratori', c: '#9E9E9E' },
      { l: 'Vaginālie vakuuma sūknīši', c: '#F48FB1' },
      { l: 'Orālā seksa simulatori', c: '#AB47BC' },
    ],
  },
  couples: {
    title: 'Anālie stimulatori',
    cat: 'couples',
    intro: 'Anālo stimulatoru klāsts ir ļoti plašs. Iesācējiem iesakām izvēlēties mazāka izmēra anālos spraudņus (saukti arī par anālajiem "plagiem" — no angļu val. anal plug) no silikona vai stikla. Interesantākām sajūtām noderēs arī anālās virtenes, vibratori, piepūšamie stimulatori, lielizmēra mantiņas, vīriešiem — arī prostatas stimulatori.',
    subs: [
      { l: 'Anālie spraudņi', c: '#3A3633' },
      { l: 'Anālie vibratori', c: '#5E35B1' },
      { l: 'Anālās virtenes', c: '#7E57C2' },
      { l: 'Prostatas stimulatori', c: '#4A3A6B' },
      { l: 'Anālo stimulatoru komplekti', c: '#9575CD' },
      { l: 'Piepūšamie stimulatori', c: '#AB47BC' },
      { l: 'Lielizmēra stimulatori', c: '#3A3633' },
      { l: 'Klizmas veikšanai', c: '#5C2D91' },
    ],
  },
  beginners: {
    title: 'Erotiskā veļa un apavi',
    cat: 'beginners',
    intro: 'Erotiskā veļa un apavi piedāvā elegances un seksualitātes apvienojumu ar krūšturiem, biksītēm, zeķēm un fetiša apģērbu. Ar plašu klāstu plus izmēru un vīriešu apģērbu, šī kolekcija sniedz iespēju izpausties un izcelt sevi, radot neaizmirstamus intīmos mirkļus.',
    subs: [
      { l: 'Krūšturi un apakšveļas komplekti', c: '#3A3633' },
      { l: 'Biksītes un stringi', c: '#5C2D91' },
      { l: 'Zeķes, zeķbikses un zeķturi', c: '#4A3A6B' },
      { l: 'Erotiskie apģērbi', c: '#7E57C2' },
      { l: 'Plus izmērs', c: '#AB47BC' },
      { l: 'Lomu spēļu kostīmi', c: '#9575CD' },
      { l: 'Wetlook, lakāda un latekss', c: '#3A3633' },
      { l: 'Vīriešu apģērbi', c: '#5E35B1' },
      { l: 'Kurpes un zābaki', c: '#2B2520' },
      { l: 'Aksesuāri', c: '#7A2E4A' },
    ],
  },
  premium: {
    title: 'Dildo',
    cat: 'dildo',
    intro: 'Dildo jeb falla imitators, mākslīgais loceklis ir viena no vissenākajām rotaļlietām, ko cilvēki ir izmantojuši vēl aizvēstures laikos. Dildo var būt reālistiski — maksimāli atgādina dzimumlocekli vizuāli un pēc taustes, un var būt arī minimālistiski, iegareni falliskas formas vai mākslinieciska dizaina veidojumi, kas paredzēti penetratīvai izmantošanai.',
    subs: [
      { l: 'Silikona dildo', c: '#EC407A' },
      { l: 'Miesas imitācijas dildo', c: '#E8C5A8' },
      { l: 'Stikla dildo', c: '#F48FB1' },
      { l: 'Vinila/TPE dildo', c: '#AB47BC' },
      { l: 'Fantastiski dildo', c: '#7E57C2' },
      { l: 'Divpusējie dildo', c: '#C2185B' },
    ],
  },
  premiumGear: {
    title: 'Masturbatori',
    cat: 'masturbators',
    intro: 'Pazīstami arī kā "pocket pussy", "fleshlight" vai mākslīgās vagīnas. Tie var būt kā reālistiski vulvas atveidojumi ar atveri locekļa ievietošanai, tā arī nereālistiski un vizuāli nemaz neatgādināt sievietes anatomiju. Minimālistiska izskata masturbatori būs īpaši diskrēti un vairāk koncentrēti uz stimulācijas intensitāti nevis ārējo veidolu.',
    subs: [
      { l: 'Manuālie masturbatori', c: '#F48FB1' },
      { l: 'Automatizētie masturbatori', c: '#3A3633' },
      { l: 'Vienreizlietojamie masturbatori', c: '#9E9E9E' },
      { l: 'Lielizmēra masturbatori', c: '#E8C5A8' },
      { l: 'Seksa lelles', c: '#E0AC8B' },
      { l: 'Masturbatoru piederumi', c: '#5E35B1' },
    ],
  },
  travel: {
    title: 'Prezervatīvi',
    cat: 'condoms',
    intro: 'Prezervatīvi ir vienīgā barjermetode, kas spēj aizsargāt gan no seksuāli transmisīvajām slimībām (STS), gan nevēlamas grūtniecības. Lai prezervatīvs nodrošinātu maksimālu aizsardzību kā arī būtu patīkams lietošanā, tas ir jāizvēlas atbilstošā izmērā, no ķermenim draudzīga materiāla, kā arī tas pareizi jālieto. Prezervatīvu veidu ir daudz, lai katrai vajadzībai būtu pieejams piemērotākais.',
    subs: [
      { l: 'Klasiskie prezervatīvi', c: '#3A3633' },
      { l: 'Īpaši plāni prezervatīvi', c: '#9E9E9E' },
      { l: 'Prezervatīvi bez lateksa', c: '#26A69A' },
      { l: 'Dažādu izmēru prezervatīvi', c: '#1565C0' },
      { l: 'Ar pumpiņām vai rievām', c: '#EC407A' },
      { l: 'Ar smaržu un garšu', c: '#FBC02D' },
      { l: 'Ilgākam dzimumaktam', c: '#5E35B1' },
      { l: 'Prezervatīvu lielpakas un izlases', c: '#1565C0' },
      { l: 'Sieviešu prezervatīvi', c: '#C2185B' },
      { l: 'Orālajam seksam', c: '#EF5350' },
    ],
  },
  travelGear: {
    title: 'Lubrikanti',
    cat: 'lube',
    intro: 'Lai izvēlētos atbilstošāko lubrikantu, pirmkārt, jāprecizē kādai tieši aktivitātei tas tiks izmantots, piemēram, vai tiks lietotas seksa rotaļlietas. Ja tās tiks izmantotas, jāņem vērā rotaļlietu materiāls, lai piemeklētu atbilstošas bāzes lubrikantu, kas nebojātu to materiālu. Arī lubrikantu sastāvdaļas ir uzmanības vērtas un to spektrs ir plašs. Piemēram, lubrikanti, kam pievienots hialurons, palīdzēs šūnām saglabāt mitrumu un veicinās ādas elastību, bet tie, kuriem pievienota hohoba eļļa, mīkstinās un nomierinās ādu.',
    subs: [
      { l: 'Ūdens bāzes', c: '#29B6F6' },
      { l: 'Silikona bāzes', c: '#9E9E9E' },
      { l: 'Hibrīdlubrikanti', c: '#3A3633' },
      { l: 'Anālajam seksam', c: '#FBC02D' },
      { l: 'Eļļas bāzes un fistingam', c: '#424242' },
      { l: 'Ar smaržu vai garšu', c: '#66BB6A' },
      { l: 'Pulveri lubrikantu pagatavošanai', c: '#EF5350' },
    ],
  },
  bdsm: {
    title: 'Fetišs un BDSM',
    cat: 'bdsm',
    intro: 'Sākot no elegantiem atlasa acu apsējiem un spalviņām maigiem glāstiem līdz pat ādas pletnēm, rokudzelžiem un iespaidīgām seksa mēbelēm — fetiša un BDSM aksesuāru klāstā sev atbilstošāko atradīs jebkurš, kas alkst pēc pikantākām un izjustākām rotaļām, lai atklātu jaunu baudas potenciālu un piedzīvotu vēl nebijušas sajūtas.',
    subs: [
      { l: 'Sasaistes rīki', c: '#3A3633' },
      { l: 'Iepēršanai un kutināšanai', c: '#2B2520' },
      { l: 'Acu apsēji, maskas un mutes aizbāžņi', c: '#424242' },
      { l: 'Krūšu un klitora rotaļlietas', c: '#9E9E9E' },
      { l: 'Locekļa rotaļlietas', c: '#757575' },
      { l: 'Nevainības jostas', c: '#3A3633' },
      { l: 'Elektrostimulācijai', c: '#212121' },
      { l: 'Sensorās un medicīnas spēles', c: '#5C2D91' },
      { l: 'Seksa mēbeles, šūpoles, spilveni', c: '#4A3A6B' },
      { l: 'Fetiša apģērbi', c: '#212121' },
    ],
  },
};

function CategoryLandingScreen({ theme, nav, params }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;
  const key = params?.cat && CATEGORY_LANDINGS[params.cat] ? params.cat : 'solo';
  const page = CATEGORY_LANDINGS[key];
  const baseProducts = PRODUCTS.filter(p => p.category === page.cat);
  const [filters, setFilters] = React.useState({ ...DEFAULT_FILTERS, cat: 'all' });
  const [sort, setSort] = React.useState('featured');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);
  const products = React.useMemo(
    () => applyFilters(baseProducts, { ...filters, cat: 'all' }, sort),
    [baseProducts, filters, sort]
  );
  const activeCount = countActiveFilters({ ...filters, cat: 'all' });
  const sortLabel = (SORT_OPTIONS.find(s => s.id === sort) || SORT_OPTIONS[0]).label.split(' · ')[0];
  const removeFilter = (k, val) => {
    if (k === 'price') setFilters({ ...filters, priceMin: 0, priceMax: 200 });
    else if (k === 'modes') setFilters({ ...filters, modes: 0 });
    else if (k === 'inStockOnly') setFilters({ ...filters, inStockOnly: false });
    else if (val) setFilters({ ...filters, [k]: filters[k].filter(x => x !== val) });
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <div style={{
        padding: '12px 20px 0', fontFamily: theme.body, fontSize: 12, color: theme.inkSoft,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>{t('page.home', 'Home')}</button>
        <span style={{ opacity: 0.4 }}>›</span>
        <button onClick={() => nav('category')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>{t('browse.title', 'Browse')}</button>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: theme.ink, fontWeight: 600 }}>{page.title}</span>
      </div>

      {/* Hero title */}
      <div style={{ padding: '14px 20px 6px' }}>
        <h1 style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 36,
          letterSpacing: theme.letterDisplay, lineHeight: 0.98,
          color: theme.accent, margin: 0, textAlign: 'center',
        }}>{page.title}</h1>
      </div>

      {/* SEO intro paragraph */}
      <div style={{ padding: '8px 24px 22px' }}>
        <p style={{
          fontFamily: theme.body, fontSize: 13, color: theme.inkSoft,
          lineHeight: 1.6, margin: 0, textAlign: 'center',
        }}>{page.intro}</p>
      </div>

      {/* Subcategory circles — horizontal scroll */}
      <div style={{
        display: 'flex', gap: 14, padding: '0 20px 24px',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
      }}>
        {page.subs.map((s, i) => (
          <button key={i} onClick={() => nav('category', { cat: page.cat })} style={{
            all: 'unset', cursor: 'pointer', flexShrink: 0,
            width: 92, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 8, textAlign: 'center',
          }}>
            <div style={{
              width: 84, height: 84, borderRadius: 999,
              background: theme.surfaceAlt,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
              border: `1px solid ${theme.rule}`,
            }}>
              <svg viewBox="0 0 100 100" width="58%" height="58%" style={{
                filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.18))',
              }}>
                <defs>
                  <linearGradient id={'sub' + key + i} x1="0.3" y1="0.1" x2="0.7" y2="1">
                    <stop offset="0%" stopColor={_shiftHex(s.c, 12)} />
                    <stop offset="100%" stopColor={_shiftHex(s.c, -14)} />
                  </linearGradient>
                </defs>
                <path d="M50,8 C61,8 67,20 67,44 C67,76 60,93 50,93 C40,93 33,76 33,44 C33,20 39,8 50,8 Z"
                  fill={'url(#sub' + key + i + ')'} />
              </svg>
            </div>
            <span style={{
              fontFamily: theme.body, fontSize: 11, fontWeight: 600,
              color: theme.ink, lineHeight: 1.25,
            }}>{s.l}</span>
          </button>
        ))}
      </div>

      {/* Filter / sort bar */}
      <FilterBar theme={theme}
        onOpenFilters={() => setFiltersOpen(true)}
        onOpenSort={() => setSortOpen(true)}
        activeCount={activeCount}
        sortLabel={sortLabel}
        productCount={products.length}
        filters={{ ...filters, cat: 'all' }}
        removeFilter={removeFilter}
        hideCount={true} />

      <div style={{
        padding: '0 20px 24px', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 16,
      }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} theme={theme} variant="image"
            onClick={() => nav('product', { id: p.id })} />
        ))}
      </div>

      {/* Per-category FAQ */}
      {(CATEGORY_FAQ[key] || []).length > 0 && (
        <div style={{ padding: '0 20px 8px' }}>
          <div style={{
            fontFamily: theme.display, fontWeight: 700, fontSize: 24,
            letterSpacing: theme.letterDisplay, color: theme.ink, margin: '8px 0 14px',
          }}>Biežāk uzdotie jautājumi</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(CATEGORY_FAQ[key] || []).slice(0, 3).map((qa, i) => (
              <details key={i} style={{
                padding: 16, borderRadius: theme.radius,
                background: theme.surface, border: `1px solid ${theme.rule}`,
              }}>
                <summary style={{
                  cursor: 'pointer', listStyle: 'none',
                  fontFamily: theme.body, fontWeight: 700, fontSize: 14, color: theme.ink,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                }}>
                  {qa[0]}
                  <span style={{ color: theme.inkSoft, fontSize: 12, flexShrink: 0 }}>▾</span>
                </summary>
                <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.55, marginTop: 8 }}>{qa[1]}</div>
              </details>
            ))}
          </div>
          <button onClick={() => nav('content', { key: 'faq', faqCat: key })} style={{
            all: 'unset', cursor: 'pointer', marginTop: 14,
            fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.accent,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>Visi jautājumi un atbildes <Icon name="arrow" size={14} color={theme.accent} /></button>
        </div>
      )}

      {/* Collapsible SEO text — below the FAQ, content stays indexed */}
      <div style={{ padding: '4px 20px 28px' }}>
        <details style={{
          borderRadius: theme.radius, background: theme.surfaceAlt,
          padding: '14px 18px',
        }}>
          <summary style={{
            cursor: 'pointer', listStyle: 'none',
            fontFamily: theme.display, fontWeight: 700, fontSize: 18,
            letterSpacing: theme.letterDisplay, color: theme.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          }}>
            Kāpēc iepirkties pie mums?
            <span style={{ fontFamily: theme.body, fontSize: 13, fontWeight: 700, color: theme.accent }}>Lasīt vairāk</span>
          </summary>
          <p style={{
            fontFamily: theme.body, fontSize: 12, color: theme.inkSoft, lineHeight: 1.6, margin: '12px 0 0',
          }}>
            Plašākā {page.title.toLowerCase()} izlase Latvijā ar diskrētu piegādi visā Baltijā 24 stundu laikā.
            Vienkārša kaste bez logo, anonīms maksājums (Apple Pay, Google Pay, Citadele, Swedbank, SEB, Luminor)
            un ķermenim droši, laboratorijā testēti materiāli. Bezmaksas atgriešana 30 dienu laikā.
          </p>
        </details>
      </div>

      <FilterSheet theme={theme} open={filtersOpen} onClose={() => setFiltersOpen(false)}
        filters={{ ...filters, cat: 'all' }} setFilters={(f) => setFilters({ ...f, cat: 'all' })}
        productCount={products.length} />
      <SortPopover theme={theme} open={sortOpen} value={sort}
        onChange={setSort} onClose={() => setSortOpen(false)} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NotFoundScreen — stylish, naughty, on-brand 404
// ─────────────────────────────────────────────────────────────
function NotFoundScreen({ theme, nav }) {
  const t = (typeof useT === 'function') ? useT() : (k, fb) => fb || k;

  // Floating emoji burst — tap anywhere to spawn one
  const [bursts, setBursts] = React.useState([]);
  const [mouse, setMouse] = React.useState({ x: 0.5, y: 0.5 });
  const [combo, setCombo] = React.useState(0);
  const [shuffleIdx, setShuffleIdx] = React.useState(0);
  const containerRef = React.useRef(null);
  const EMOJIS = ['🍑', '🍌', '💋', '✨', '🔥', '💜', '🌶️', '🤫', '🍒', '💘', '🫦', '⭐'];
  const burstIdRef = React.useRef(0);

  const onTap = (e) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const newOnes = Array.from({ length: 5 + Math.floor(Math.random() * 3) }).map((_, i) => ({
      id: ++burstIdRef.current,
      e: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x, y,
      vx: (Math.random() - 0.5) * 240,
      vy: -(120 + Math.random() * 220),
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 360,
      size: 24 + Math.random() * 24,
      born: Date.now(),
    }));
    setBursts(b => [...b, ...newOnes].slice(-80));
    setCombo(c => Math.min(c + 1, 99));
  };

  // Cleanup old bursts
  React.useEffect(() => {
    if (bursts.length === 0) return;
    const id = setInterval(() => {
      const now = Date.now();
      setBursts(b => b.filter(x => now - x.born < 1700));
    }, 250);
    return () => clearInterval(id);
  }, [bursts.length]);

  // Pointer tracking for the parallax tilt + mascot eyes
  const onMove = (e) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    });
  };

  // Combo decay
  React.useEffect(() => {
    if (combo === 0) return;
    const id = setTimeout(() => setCombo(c => Math.max(0, c - 1)), 1200);
    return () => clearTimeout(id);
  }, [combo]);

  const tiltX = (mouse.y - 0.5) * 16;
  const tiltY = -(mouse.x - 0.5) * 16;

  // Destination roulette
  const DESTS = [
    { l: '🍑 Home',           go: () => nav('home') },
    { l: '🍒 Browse the shop', go: () => nav('category') },
    { l: '💘 Find your match',  go: () => nav('home') },
    { l: '📦 How it ships',    go: () => nav('content', { key: 'how-it-ships' }) },
    { l: '📓 The Journal',     go: () => nav('content', { key: 'journal' }) },
    { l: '🔁 Free returns',    go: () => nav('content', { key: 'free-returns' }) },
    { l: '☎️ Contact a human', go: () => nav('content', { key: 'contact' }) },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onClick={onTap}
      style={{
        position: 'relative', minHeight: 'calc(100vh - 56px)',
        background: '#0A0A0A', color: theme.bg,
        overflow: 'hidden', cursor: 'crosshair',
        perspective: 800,
      }}>

      {/* Soft gradient orb that follows cursor */}
      <div style={{
        position: 'absolute',
        left: mouse.x * 100 + '%', top: mouse.y * 100 + '%',
        width: 360, height: 360, borderRadius: 999,
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(110,77,248,0.35), rgba(255,79,184,0.10) 50%, transparent 70%)',
        filter: 'blur(12px)', pointerEvents: 'none',
        transition: 'opacity .3s',
      }} />

      {/* Tap-spawned emoji confetti */}
      {bursts.map(b => {
        const age = (Date.now() - b.born) / 1000;
        const tx = b.x + b.vx * age;
        const ty = b.y + b.vy * age + 0.5 * 600 * age * age; // gravity
        const rot = b.rot + b.rotV * age;
        const opacity = Math.max(0, 1 - age / 1.6);
        return (
          <span key={b.id} style={{
            position: 'absolute', left: tx, top: ty,
            fontSize: b.size, opacity, pointerEvents: 'none',
            transform: `translate(-50%, -50%) rotate(${rot}deg)`,
            filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.4))',
            transition: 'none', zIndex: 5,
          }}>{b.e}</span>
        );
      })}

      {/* Combo counter */}
      {combo > 1 && (
        <div style={{
          position: 'absolute', top: 16, right: 16, zIndex: 10,
          padding: '6px 12px', borderRadius: 999,
          background: 'rgba(255,255,255,0.08)',
          fontFamily: theme.mono, fontSize: 12, fontWeight: 700, color: theme.bg,
          letterSpacing: 0.4, pointerEvents: 'none',
        }}>×{combo} combo 🔥</div>
      )}

      <div style={{ position: 'relative', padding: '56px 24px 110px' }}>
        {/* Kicker */}
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.accent, marginBottom: 14,
        }}>404 · Page not found</div>

        {/* Tilting 404 */}
        <div style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: 'transform .15s ease',
          display: 'inline-block',
        }}>
          <h1 className="shhh-grad-text" style={{
            fontFamily: theme.display, fontWeight: 800, fontSize: 180,
            letterSpacing: '-0.09em', lineHeight: 0.82, margin: 0,
            textShadow: '0 22px 50px rgba(110,77,248,0.35)',
            userSelect: 'none',
          }}>404</h1>
        </div>

        {/* Mascot peach with eyes that track cursor */}
        <div style={{
          position: 'absolute', top: 64, right: 18, width: 84, height: 84,
          pointerEvents: 'none', zIndex: 4,
        }}>
          <div style={{ position: 'relative', fontSize: 70, textAlign: 'center', lineHeight: 1 }}>
            🍑
            {/* Eyes overlay */}
            <div style={{
              position: 'absolute', left: '50%', top: '38%', transform: 'translateX(-50%)',
              display: 'flex', gap: 8,
            }}>
              {[0, 1].map(i => (
                <div key={i} style={{
                  width: 12, height: 12, borderRadius: 999,
                  background: '#fff', position: 'relative',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
                }}>
                  <div style={{
                    position: 'absolute', width: 6, height: 6, borderRadius: 999,
                    background: '#0F0F0E',
                    left: 3 + (mouse.x - 0.5) * 4,
                    top: 3 + (mouse.y - 0.5) * 4,
                    transition: 'left .12s ease-out, top .12s ease-out',
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 30,
          letterSpacing: theme.letterDisplay, lineHeight: 1.05,
          color: theme.bg, margin: '24px 0 12px', maxWidth: 320, position: 'relative', zIndex: 2,
        }}>
          Oops — that page slipped <span className="shhh-grad-text">out the back</span>. 🍑
        </div>

        <p style={{
          fontFamily: theme.body, fontSize: 14, color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.55, margin: '0 0 24px', maxWidth: 340, position: 'relative', zIndex: 2,
        }}>
          Tap anywhere on this page to spawn naughty confetti 🎉 — or use one of the doors below.
        </p>

        {/* Naughty roulette */}
        <div style={{
          position: 'relative', zIndex: 2,
          padding: 16, borderRadius: 18,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          marginBottom: 16,
        }}>
          <div style={{
            fontFamily: theme.body, fontSize: 10, fontWeight: 700,
            letterSpacing: theme.letterCaps, textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)', marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>🎰</span> Surprise me
          </div>
          <div style={{
            fontFamily: theme.display, fontWeight: 700, fontSize: 22,
            letterSpacing: theme.letterDisplay, color: theme.bg, marginBottom: 14,
            lineHeight: 1.1, minHeight: 30,
          }}>{DESTS[shuffleIdx].l}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={(e) => {
              e.stopPropagation();
              let n = shuffleIdx;
              const tick = () => {
                n = (n + 1) % DESTS.length;
                setShuffleIdx(n);
              };
              let i = 0;
              const total = 9 + Math.floor(Math.random() * 5);
              const step = () => {
                tick(); i++;
                if (i < total) setTimeout(step, 80 + i * 18);
              };
              step();
            }} style={{
              all: 'unset', cursor: 'pointer', flex: 1, height: 44, borderRadius: 999,
              background: 'rgba(255,255,255,0.12)', color: theme.bg,
              fontFamily: theme.body, fontWeight: 700, fontSize: 13,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>🎲 Spin again</button>
            <button onClick={(e) => { e.stopPropagation(); DESTS[shuffleIdx].go(); }} className="shhh-grad" style={{
              cursor: 'pointer', flex: 1, height: 44, borderRadius: 999,
              fontFamily: theme.body, fontWeight: 700, fontSize: 13,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: '0 8px 22px rgba(110,77,248,0.30)',
            }}>Take me there →</button>
          </div>
        </div>

        {/* Primary CTA */}
        <button onClick={(e) => { e.stopPropagation(); nav('home'); }} className="shhh-grad" style={{
          cursor: 'pointer', width: '100%', height: 52, borderRadius: 999,
          fontFamily: theme.body, fontWeight: 700, fontSize: 15,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 10px 28px rgba(110,77,248,0.38)',
          marginBottom: 10, position: 'relative', zIndex: 2,
        }}>🍑 Take me home</button>

        {/* Quick links */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 22,
          position: 'relative', zIndex: 2,
        }}>
          <button onClick={(e) => { e.stopPropagation(); nav('category'); }} style={{
            all: 'unset', cursor: 'pointer', flex: 1, height: 44,
            borderRadius: 999, background: 'rgba(255,255,255,0.08)',
            color: theme.bg, fontFamily: theme.body, fontWeight: 700, fontSize: 12,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>🍒 Browse</button>
          <button onClick={(e) => { e.stopPropagation(); nav('content', { key: 'journal' }); }} style={{
            all: 'unset', cursor: 'pointer', flex: 1, height: 44,
            borderRadius: 999, background: 'rgba(255,255,255,0.08)',
            color: theme.bg, fontFamily: theme.body, fontWeight: 700, fontSize: 12,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>📓 Journal</button>
        </div>

        <div style={{
          padding: '8px 14px', borderRadius: 999,
          background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)',
          fontFamily: theme.mono, fontSize: 11, letterSpacing: 0.4,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          position: 'relative', zIndex: 2,
        }}>
          <span>🤫</span> Tap the page · spawn confetti
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BoxLabelPreview — interactive parcel mock with selectable
// shipping label. Lets curious users see what the parcel could
// look like with different "sender" disguises.
// ─────────────────────────────────────────────────────────────
function BoxLabelPreview({ theme }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const [pick, setPick] = React.useState('nl');
  const sender = PSEUDO_SENDERS.find(s => s.id === pick) || PSEUDO_SENDERS[0];

  // Sender-specific label content rendered on top of the box.
  // Each label is a small "shipping sticker" with its own look — barcodes,
  // hand-written address, courier accent — so the visual changes meaningfully.
  const LABEL_STYLES = {
    nl: {
      bg: '#FFFFFF', accent: '#0F0F0E', textColor: '#0F0F0E',
      header: 'NL Trading Co', strip: '#0F0F0E',
    },
    a220: {
      bg: '#FFFFFF', accent: '#E63312', textColor: '#0F0F0E',
      header: '220.lv', strip: '#E63312',
    },
    amazon: {
      bg: '#FFFFFF', accent: '#FF9900', textColor: '#0F0F0E',
      header: 'amazon', strip: '#232F3E',
    },
    pigu: {
      bg: '#FFFFFF', accent: '#0066CC', textColor: '#0F0F0E',
      header: 'Pigu.lv', strip: '#0066CC',
    },
    salidzini: {
      bg: '#FFFFFF', accent: '#7CC061', textColor: '#0F0F0E',
      header: 'Salidzini.lv', strip: '#7CC061',
    },
    rd: {
      bg: '#FFFFFF', accent: '#5C2D91', textColor: '#0F0F0E',
      header: 'Rīga Distribution', strip: '#5C2D91',
    },
  };
  const ls = LABEL_STYLES[pick] || LABEL_STYLES.nl;

  return (
    <div>
      <div style={{
        aspectRatio: '4/3', borderRadius: 20,
        background: '#F3EEFF',
        border: `1px solid ${theme.rule}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Floor shadow + dotty paper backdrop */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 50% 80%, rgba(0,0,0,0.10), transparent 50%)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(${theme.ink}10 1px, transparent 1px)`,
          backgroundSize: '14px 14px', opacity: 0.45,
        }} />

        {/* The box — drawn larger so the label fits real text */}
        <svg viewBox="0 0 320 240" width="80%" height="80%" style={{ position: 'relative' }}>
          {/* Box body */}
          <path d="M40 80 L160 50 L280 80 L280 200 L160 230 L40 200 Z"
            fill="#C9A878" stroke="#0F0F0E" strokeWidth="2.4" strokeLinejoin="round" />
          {/* Top fold lines */}
          <path d="M40 80 L160 110 L280 80" fill="none" stroke="#0F0F0E" strokeWidth="2" />
          <path d="M160 110 L160 230" fill="none" stroke="#0F0F0E" strokeWidth="2" />
          {/* Tape strip */}
          <rect x="95" y="135" width="130" height="14" fill="rgba(15,15,14,0.18)" />

          {/* Shipping label — front face. White rectangle with content. */}
          <g transform="translate(58, 95)">
            <rect x="0" y="0" width="120" height="80" fill={ls.bg} stroke="#0F0F0E" strokeWidth="1" rx="2" />
            {/* Top color strip */}
            <rect x="0" y="0" width="120" height="14" fill={ls.strip} />
            <text x="6" y="10" fill="#fff" fontSize="8" fontWeight="800"
              fontFamily="system-ui, sans-serif" letterSpacing="0">{ls.header.toUpperCase()}</text>
            {/* Address lines (mock) */}
            <text x="6" y="28" fill={ls.textColor} fontSize="6.5" fontFamily="system-ui">M. M.</text>
            <text x="6" y="38" fill={ls.textColor} fontSize="6"  fontFamily="system-ui" opacity="0.75">Omniva Stockmann</text>
            <text x="6" y="46" fill={ls.textColor} fontSize="6"  fontFamily="system-ui" opacity="0.75">13. janvāra 8</text>
            <text x="6" y="54" fill={ls.textColor} fontSize="6"  fontFamily="system-ui" opacity="0.75">Rīga LV-1050</text>
            {/* Barcode strip */}
            <g transform="translate(6, 60)">
              {Array.from({ length: 32 }).map((_, i) => (
                <rect key={i} x={i * 2.4} y="0" width={i % 3 === 0 ? 1.6 : 0.8} height="12"
                  fill="#0F0F0E" />
              ))}
              <text x="0" y="18" fill="#0F0F0E" fontSize="4.5" fontFamily="monospace" letterSpacing="0.5">
                LV {pick.toUpperCase()}-23847-0571
              </text>
            </g>
            {/* Mini "from" stamp top-right */}
            <text x="114" y="10" textAnchor="end" fill="#fff" fontSize="5.5"
              fontFamily="monospace">21mm × 297mm</text>
          </g>

          {/* Brand logo badge — bottom-left corner of front face */}
          <g transform="translate(58, 184)">
            <rect x="0" y="0" width="34" height="14" rx="2" fill={ls.accent} />
            <text x="17" y="10" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800"
              fontFamily="system-ui">{sender.logo}</text>
          </g>
        </svg>

        <div style={{
          position: 'absolute', top: 14, left: 16,
          fontFamily: theme.mono, fontSize: 10, color: theme.ink, opacity: 0.55,
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>Actual outer box · live preview</div>
        <div style={{
          position: 'absolute', top: 14, right: 16,
          padding: '4px 10px', borderRadius: 999,
          background: '#FFFFFF', color: theme.ink,
          fontFamily: theme.mono, fontSize: 10, fontWeight: 700,
          letterSpacing: 0.4, border: `1px solid ${theme.rule}`,
        }}>{sender.name}</div>
      </div>

      {/* Pick a label */}
      <div style={{ marginTop: 14 }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.inkSoft, marginBottom: 10,
        }}>{t('arrive.tryLabel','Try a sender label — purely cosmetic')}</div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
        }}>
          {PSEUDO_SENDERS.map(s => {
            const active = pick === s.id;
            return (
              <button key={s.id} onClick={() => setPick(s.id)} style={{
                all: 'unset', cursor: 'pointer',
                padding: '10px 8px', borderRadius: 12,
                background: theme.surface,
                border: `1.5px solid ${active ? theme.ink : theme.rule}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                textAlign: 'center', boxSizing: 'border-box',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 7,
                  background: s.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: theme.body, fontWeight: 800, fontSize: 11, letterSpacing: 0.2,
                }}>{s.logo}</div>
                <div style={{
                  fontFamily: theme.body, fontWeight: 700, fontSize: 11,
                  color: theme.ink, lineHeight: 1.1,
                }}>{s.name}</div>
              </button>
            );
          })}
        </div>
        <div style={{
          marginTop: 12, padding: '10px 12px', borderRadius: 12,
          background: theme.surfaceAlt, fontFamily: theme.body, fontSize: 11,
          color: theme.inkSoft, display: 'flex', gap: 8, alignItems: 'flex-start',
        }}>
          <Icon name="ghost" size={14} color={theme.inkSoft} />
          <span>
            None of these affect what's inside, who actually ships, or your warranty. Picked at checkout, printed on the label.
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HowItArrivesScreen — special-cased rich layout for the
// "how-it-ships" page. Designed to be simple + visual + stylish.
// ─────────────────────────────────────────────────────────────
function HowItArrivesScreen({ theme, nav }) {
  const t = (typeof useT === "function") ? useT() : (k, fb) => fb || k;
  const steps = [
    {
      n: '01', emoji: '🛍️', title: t('arrive.s1.title','You order'),
      body: t('arrive.s1.body','Tap-pay or banklink. Card details never reach us. Statement reads "NL Trading Co".'),
      bg: '#F3EEFF', deco: '🛍️',
    },
    {
      n: '02', emoji: '📦', title: t('arrive.s2.title','We pack'),
      body: t('arrive.s2.body','A blank brown box, unmarked tissue inside. No logo on the outside, no product name.'),
      bg: '#FFE8DC', deco: '📦',
    },
    {
      n: '03', emoji: '🚚', title: t('arrive.s3.title','Courier picks up'),
      body: t('arrive.s3.body','Omniva, Pastomat, DPD or Venipak. You choose. Sender shows as "NL Trading Co, Rīga".'),
      bg: '#E2F0DE', deco: '🚚',
    },
    {
      n: '04', emoji: '🤫', title: t('arrive.s4.title','It arrives'),
      body: t('arrive.s4.body','Locker (no name on door) or your address. Pickup with a code. Nobody else has to know.'),
      bg: '#FCEAF0', deco: '🤫',
    },
    {
      n: '05', emoji: '🌬️', title: t('arrive.s5.title','We forget'),
      body: t('arrive.s5.body','Your data is auto-deleted 30 days after delivery. No marketing emails, ever.'),
      bg: '#E4ECFF', deco: '🌬️',
    },
  ];

  const couriers = [
    { name: 'Omniva', sub: 'Parcel locker · Anon', initials: 'OM', tone: '#E63312' },
    { name: 'Pastomat', sub: 'Latvian post locker', initials: 'LP', tone: '#FFB300' },
    { name: 'DPD', sub: 'Pickup or door', initials: 'DPD', tone: '#DC0032' },
    { name: 'Venipak', sub: 'Locker · Anon', initials: 'VP', tone: '#0EA5E9' },
  ];

  const myths = [
    [t('arrive.q1','Will the courier know?'), t('arrive.a1','No — they see "NL Trading Co" + your alias. Nothing about the product.')],
    [t('arrive.q2','Will my flatmate see it?'), t('arrive.a2','Pick locker delivery. The box never crosses your doorstep without you.')],
    [t('arrive.q3','Will my bank tell on me?'), t('arrive.a3','No — the descriptor is "NL Trading Co". Searchable by nothing recognisable.')],
  ];

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 12, color: theme.inkSoft,
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14,
        }}>
          <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', color: theme.inkSoft }}>{t('page.home','Home')}</button>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: theme.ink, fontWeight: 600 }}>{t('pack.kicker','How it arrives')}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        margin: '0 20px 24px', padding: '28px 22px',
        borderRadius: 24, background: theme.surfaceAlt,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Floating emojis */}
        {['📦', '🤫', '🚚', '🍑', '💌'].map((e, i) => (
          <span key={i} style={{
            position: 'absolute',
            right: 12 + (i % 3) * 18 + 'px',
            top: 12 + i * 22 + 'px',
            fontSize: 24 - i * 2, opacity: 0.4,
            transform: `rotate(${(i % 5) * 14 - 24}deg)`,
          }}>{e}</span>
        ))}
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.accent, marginBottom: 10,
        }}>How it arrives</div>
        <h1 style={{
          fontFamily: theme.display, fontWeight: 700, fontSize: 36,
          letterSpacing: theme.letterDisplay, lineHeight: 0.95,
          color: theme.ink, margin: '0 0 12px', maxWidth: 280,
        }}>
          {t('pack.title1','Plain box.')}<br/>
          <span className="shhh-grad-text">{t('pack.title2quiet','Quiet')}</span> {t('pack.title2tail','drop.')}<br/>
          {t('pack.title3','No trace.')}
        </h1>
        <p style={{
          fontFamily: theme.body, fontSize: 14, color: theme.inkSoft, lineHeight: 1.5,
          margin: 0, maxWidth: 320,
        }}>
          Five steps from "add to bag" to "knock-knock, no-one heard a thing."
        </p>
      </div>

      {/* The 5 steps */}
      <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{
            padding: '20px 20px', borderRadius: 20,
            background: s.bg, position: 'relative', overflow: 'hidden',
          }}>
            <span style={{
              position: 'absolute', right: -12, bottom: -18, fontSize: 88,
              opacity: 0.18, transform: 'rotate(-10deg)',
            }}>{s.deco}</span>
            <div style={{ position: 'relative', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 999, flexShrink: 0,
                background: theme.ink, color: theme.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: theme.mono, fontSize: 13, fontWeight: 700, letterSpacing: 0.4,
              }}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: theme.display, fontWeight: 700, fontSize: 22,
                  letterSpacing: theme.letterDisplay, color: theme.ink, lineHeight: 1.05,
                  marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {s.title} <span style={{ fontSize: 22 }}>{s.emoji}</span>
                </div>
                <div style={{ fontFamily: theme.body, fontSize: 13, color: theme.ink, opacity: 0.75, lineHeight: 1.5 }}>
                  {s.body}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The actual outer box */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.inkSoft, marginBottom: 12,
        }}>What the box looks like · pick a label</div>
        <BoxLabelPreview theme={theme} />
      </div>

      {/* Couriers grid */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.inkSoft, marginBottom: 12,
        }}>{t('arrive.choose','Choose your courier · all anonymous')}</div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        }}>
          {couriers.map(c => (
            <div key={c.name} style={{
              padding: 14, borderRadius: 14,
              background: theme.surface, border: `1px solid ${theme.rule}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: c.tone, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: theme.body, fontWeight: 800, fontSize: 11, letterSpacing: 0.2,
              }}>{c.initials}</div>
              <div>
                <div style={{ fontFamily: theme.body, fontWeight: 700, fontSize: 13, color: theme.ink }}>
                  {c.name}
                </div>
                <div style={{ fontFamily: theme.body, fontSize: 11, color: theme.inkSoft, marginTop: 2 }}>
                  {c.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three myths */}
      <div style={{ padding: '0 20px 28px' }}>
        <div style={{
          fontFamily: theme.body, fontSize: 11, fontWeight: 700,
          letterSpacing: theme.letterCaps, textTransform: 'uppercase',
          color: theme.inkSoft, marginBottom: 12,
        }}>{t('arrive.myths','The three things people worry about')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {myths.map(([q, a], i) => (
            <div key={i} style={{
              padding: 16, borderRadius: 14,
              background: theme.surface, border: `1px solid ${theme.rule}`,
            }}>
              <div style={{
                fontFamily: theme.display, fontWeight: 700, fontSize: 16,
                color: theme.ink, letterSpacing: theme.letterDisplay,
                marginBottom: 6, lineHeight: 1.2,
                display: 'flex', alignItems: 'baseline', gap: 8,
              }}>
                <span style={{ color: theme.accent }}>—</span> {q}
              </div>
              <div style={{
                fontFamily: theme.body, fontSize: 13, color: theme.inkSoft, lineHeight: 1.5,
              }}>{a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          padding: 22, borderRadius: 20,
          background: theme.ink, color: theme.bg,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -30, top: -30,
            width: 140, height: 140, borderRadius: 999,
            background: theme.accent, opacity: 0.85,
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{
              fontFamily: theme.body, fontSize: 10, fontWeight: 700,
              letterSpacing: theme.letterCaps, textTransform: 'uppercase',
              color: theme.accent, marginBottom: 8,
            }}>Ready when you are</div>
            <h3 style={{
              fontFamily: theme.display, fontWeight: 700, fontSize: 26,
              letterSpacing: theme.letterDisplay, lineHeight: 1.05,
              margin: '0 0 6px', maxWidth: 280,
            }}>Pick something quiet.</h3>
            <p style={{
              fontFamily: theme.body, fontSize: 12, opacity: 0.75, lineHeight: 1.5,
              margin: '0 0 16px', maxWidth: 280,
            }}>
              The box leaves Rīga in under an hour. Lands in your locker tomorrow morning.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => nav('category', { cat: 'all' })} className="shhh-grad" style={{
                cursor: 'pointer', height: 42, padding: '0 18px', borderRadius: 999,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: theme.body, fontWeight: 700, fontSize: 13,
                boxShadow: '0 6px 18px rgba(110,77,248,0.30)',
              }}>Browse the shop <Icon name="arrow" size={14} color="#fff" /></button>
              <button onClick={() => nav('content', { key: 'free-returns' })} style={{
                all: 'unset', cursor: 'pointer',
                height: 42, padding: '0 18px', borderRadius: 999,
                background: 'transparent', color: theme.bg,
                border: '1.5px solid rgba(255,255,255,0.35)',
                fontFamily: theme.body, fontWeight: 700, fontSize: 13,
                display: 'inline-flex', alignItems: 'center',
              }}>Return policy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
