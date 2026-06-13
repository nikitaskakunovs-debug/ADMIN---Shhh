// shop-usage.jsx — per-product usage instructions for the
// "Lietošanas instrukcijas" SEO page. Latvian, step-by-step.

const PRODUCT_USAGE = {
  'hush-01': {
    steps: [
      'Pirms pirmās lietošanas nomazgā Hush 01 ar siltu ūdeni un maigām ziepēm, noslauki ar mīkstu dvieli.',
      'Uzlādē pilnībā ar komplektā iekļauto USB-C vadu (apm. 90 min). LED indikators pārstās mirgot, kad būs pilns.',
      'Uzklāj nedaudz ūdens bāzes lubrikanta uz stimulatora virsmas — silikona gadījumā nekad nelieto silikona bāzes lubrikantu.',
      'Ieslēdz ar vienu pogas piespiedienu. Katrs nākamais piespiediens pārslēdz starp 8 vibrācijas režīmiem.',
      'Sāc ar zemāko intensitāti un pakāpeniski palielini. Pielāgo spiedienu un leņķi sev tīkamākajai izjūtai.',
      'Pēc lietošanas izslēdz (turi pogu 2 sek), nomazgā un uzglabā komplektā iekļautajā maisiņā.',
    ],
    tip: 'Hush 01 ir ūdensizturīgs (IPX7) — to var lietot dušā vai vannā.',
  },
  'ripple': {
    steps: [
      'Pārliecinies, ka Ripple ir pilnībā uzlādēts. Pirms lietošanas notīri.',
      'Uzklāj devu ūdens bāzes lubrikanta uz galviņas un masāžas zonas.',
      'Ieslēdz ar ieslēgšanas pogu; izvēlies vienu no 12 režīmiem ar režīmu pogu.',
      'Šī vēzīša formas ierīce paredzēta ārējai stimulācijai — virzi to lēni gar vēlamo zonu.',
      'Eksperimentē ar artikulāciju — galviņa nedaudz lokās, lai pielāgotos ķermenim.',
      'Izslēdz, notīri un uzglabā sausu.',
    ],
    tip: 'Stiprāks, nekā izskatās — sāc ar maigāko režīmu.',
  },
  'velvet': {
    steps: [
      'Velvet ir radīts diviem. Uzlādē abas zonas pirms lietošanas.',
      'Notīri un uzklāj ūdens bāzes lubrikantu.',
      'Ieslēdz un izvēlies vienu no 10 režīmiem ar tālvadību.',
      'Viens partneris var vadīt režīmus, kamēr otrs bauda — vai dali vadību.',
      'Pielāgo novietojumu, līdz abas zonas saskaras patīkami.',
      'Pēc lietošanas izslēdz, notīri un uzglabā.',
    ],
    tip: 'Tālvadība darbojas līdz 8 m attālumā — lieliski rotaļām.',
  },
  'echo': {
    steps: [
      'Ideāls pirmajai pieredzei. Uzlādē pilnībā (viena uzlāde kalpo līdz nedēļai).',
      'Notīri ar siltu ūdeni un maigām ziepēm.',
      'Uzklāj nelielu daudzumu ūdens bāzes lubrikanta.',
      'Ieslēdz ar vienu pogu; izvēlies vienu no 5 maigajiem režīmiem.',
      'Nesteidzies — Echo ir radīts lēnam, izpētes tempam.',
      'Notīri un uzglabā maisiņā.',
    ],
    tip: 'Tikai 28 dB — viens no klusākajiem modeļiem, ideāls plānām sienām.',
  },
  'glow': {
    steps: [
      'Mūsu flagmanis. Lejupielādē Shhh lietotni un savieno Glow caur Bluetooth (neobligāti).',
      'Uzlādē pilnībā (2 h darbība no vienas uzlādes).',
      'Notīri un uzklāj ūdens bāzes lubrikantu.',
      'Ieslēdz; izvēlies no 16 režīmiem vai vadi caur lietotni ar saviem ritmiem.',
      'Sildošā galviņa uzsilst līdz ķermeņa temperatūrai — ļauj tai uzsilt 30 sek.',
      'Pēc lietošanas notīri un uzlādē uzglabāšanai pie 50% jaudas.',
    ],
    tip: 'Lietotne ļauj izveidot un saglabāt personīgus vibrāciju ritmus.',
  },
  'murmur': {
    steps: [
      'Murmur izmanto vienu AAA bateriju (komplektā). Ievieto bateriju, ievērojot polaritāti.',
      'Notīri pirms pirmās lietošanas.',
      'Uzklāj ūdens bāzes lubrikantu.',
      'Ieslēdz ar pamatnes pogu; pārslēdz starp 5 režīmiem.',
      'Mazā izmēra dēļ ideāls precīzai, punktveida stimulācijai.',
      'Pēc lietošanas izņem bateriju ilgākai uzglabāšanai.',
    ],
    tip: 'Tikai 26 dB un kabatas izmērs — visdiskrētākais ceļabiedrs.',
  },
  'drift': {
    steps: [
      'Drift nāk ar slēdzamu ceļojumu kārbiņu. Uzlādē pirms ceļojuma.',
      'Notīri un uzglabā kārbiņā, kad nelieto.',
      'Uzklāj ūdens bāzes lubrikantu pirms lietošanas.',
      'Ieslēdz; izvēlies no 6 režīmiem.',
      'TSA-draudzīgs — ceļojumu bloķēšana neļauj ieslēgties somā.',
      'Pēc lietošanas notīri, ievieto kārbiņā un aizslēdz.',
    ],
    tip: 'Aktivizē ceļojumu bloķēšanu, turot abas pogas 3 sek.',
  },
  'halo': {
    steps: [
      'Halo ir izstiepjams pāru gredzens. Uzlādē pilnībā (1 h).',
      'Notīri pirms lietošanas.',
      'Uzklāj ūdens bāzes lubrikantu gredzena iekšpusē.',
      'Uzvelc gredzenu — mīkstais silikons izstiepjas un pielāgojas.',
      'Ieslēdz; izvēlies no 7 režīmiem stimulācijai abiem partneriem.',
      'Pēc lietošanas noņem, notīri un uzglabā.',
    ],
    tip: 'Viens izmērs ar mīkstu izstiepumu — paliek savā vietā.',
  },
};

// General safety + lube guidance shown at the top of the usage page.
const USAGE_GENERAL = [
  ['Pirms pirmās lietošanas', 'Vienmēr nomazgā produktu ar siltu ūdeni un maigām, bezsmaržu ziepēm. Ļauj nožūt gaisā.'],
  ['Lubrikanti', 'Silikona produktiem lieto tikai ūdens bāzes lubrikantu — silikona bāzes lubrikants bojā silikona virsmu.'],
  ['Uzlāde', 'Uzlādējamos produktus glabā virs 20% jaudas. Ceļojumiem optimāli — 50%.'],
  ['Higiēna', 'Notīri pirms un pēc katras lietošanas. Uzglabā komplektā iekļautajā maisiņā vai kārbiņā, sausā vietā.'],
];

Object.assign(window, { PRODUCT_USAGE, USAGE_GENERAL });
