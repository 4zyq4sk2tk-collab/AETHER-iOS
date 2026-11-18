// ============================================================================
// AETHER v10.0 — HUMAN WISDOM & REAL-LIFE BRIDGE (human-wisdom-and-bridge.js)
// Mahalle/Mutfak/Esnaf Sezgisi -> Kalfa Köprüsü -> Gerçek Saha Ustası
// Sıfır Jargon (Çırak Modu) · Sıfır Rozet/Puan · Görmüş Geçirmiş Sakin Dost Dili
// ============================================================================
(function (global) {
  'use strict';

  const WISDOM_STORAGE_KEY = 'aether_v10_wisdom_bridge_r1';
  const VALID_LENSES = ['SOKAK', 'KOPRU', 'SAHA'];

  const LENS_META = {
    SOKAK: {
      key: 'SOKAK',
      stageIndex: 1,
      shortLabel: 'Çırak',
      title: 'Çırak: Sadece Göz ve Sokak Dili',
      subtitle: 'Hiçbir finans kısaltması yok; her şey ekmek, un, kasa çekmecesi, veresiye defteri, kepenk saati ve kurye ile anlatılır.'
    },
    KOPRU: {
      key: 'KOPRU',
      stageIndex: 2,
      shortLabel: 'Kalfa',
      title: 'Kalfa: Gerçek Hayattaki Karşılığı',
      subtitle: 'Sokaktaki sezginin yanına banka ve piyasa ekranında karşına çıkacak gerçek Türkçe adı yan yana konur.'
    },
    SAHA: {
      key: 'SAHA',
      stageIndex: 3,
      shortLabel: 'Usta',
      title: 'Usta: Gerçek Banka/KAP/Vergi Saha Uygulaması',
      subtitle: 'Gerçek banka, aracı kurum, bilanço dipnotu ve vergi kurallarıyla tam saha uygulaması.'
    }
  };

  let wisdomState = {
    lens: 'SOKAK',
    userExplicitlySetLens: false,
    practicedDrills: {},
    activeDrillId: 'maas-gunu-sinavi'
  };

  const listeners = new Set();
  let mountedLabRef = null;

  function loadWisdomState() {
    try {
      if (global.localStorage) {
        const raw = global.localStorage.getItem(WISDOM_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            if (VALID_LENSES.includes(parsed.lens)) wisdomState.lens = parsed.lens;
            wisdomState.userExplicitlySetLens = Boolean(parsed.userExplicitlySetLens);
            if (parsed.practicedDrills && typeof parsed.practicedDrills === 'object') {
              wisdomState.practicedDrills = parsed.practicedDrills;
            }
            if (typeof parsed.activeDrillId === 'string') {
              wisdomState.activeDrillId = parsed.activeDrillId;
            }
          }
        }
      }
    } catch (_) {}
  }

  function saveWisdomState() {
    try {
      if (global.localStorage) {
        global.localStorage.setItem(WISDOM_STORAGE_KEY, JSON.stringify(wisdomState));
      }
    } catch (_) {}
  }

  function notifyWisdomListeners() {
    const snap = getMasteryProfile();
    listeners.forEach((fn) => {
      try { fn(snap); } catch (_) {}
    });
    if (mountedLabRef && mountedLabRef.container && mountedLabRef.rerender) {
      try { mountedLabRef.rerender(); } catch (_) {}
    }
  }

  // --------------------------------------------------------------------------
  // 1. SELF-SCOPED CSS INJECTION (Sıcak Keten, Taş, Bakır ve Zeytin Paleti)
  // --------------------------------------------------------------------------
  function injectHumanWisdomStyles() {
    if (!global.document || global.document.getElementById('aether-hwb-styles')) return;
    const style = global.document.createElement('style');
    style.id = 'aether-hwb-styles';
    style.textContent = `
      .hwb-root {
        color: var(--ink-900, #1c1917);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.55;
        max-width: 100%;
      }
      .hwb-card {
        background: var(--bg-card, #fffdf9);
        border: 1px solid var(--border-stone, #dfd6c7);
        border-radius: var(--radius-lg, 18px);
        padding: 18px;
        box-shadow: var(--shadow-soft, 0 8px 24px rgba(28, 25, 23, 0.06));
        margin-bottom: 16px;
      }
      .hwb-subtle-box {
        background: var(--bg-subtle, #efe9dc);
        border: 1px solid var(--border-stone, #dfd6c7);
        border-radius: var(--radius-md, 12px);
        padding: 14px;
      }
      .hwb-lens-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        background: var(--bg-subtle, #efe9dc);
        border: 1px solid var(--border-stone, #dfd6c7);
        border-radius: 14px;
        padding: 10px 12px;
        margin-bottom: 16px;
      }
      .hwb-lens-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .hwb-lens-btn {
        appearance: none;
        border: 1px solid var(--border-stone, #dfd6c7);
        background: var(--bg-card, #fffdf9);
        color: var(--ink-700, #44403c);
        border-radius: 10px;
        padding: 7px 12px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.16s ease, color 0.16s ease, border-color 0.16s ease;
      }
      .hwb-lens-btn.is-active {
        background: var(--teal-700, #0f766e);
        border-color: var(--teal-700, #0f766e);
        color: #ffffff;
      }
      .hwb-drill-tabs {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(195px, 1fr));
        gap: 8px;
        margin-bottom: 16px;
      }
      .hwb-drill-tab {
        appearance: none;
        text-align: left;
        background: var(--bg-card, #fffdf9);
        border: 1px solid var(--border-stone, #dfd6c7);
        border-radius: 12px;
        padding: 10px 12px;
        cursor: pointer;
        color: var(--ink-900, #1c1917);
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .hwb-drill-tab:hover {
        border-color: var(--teal-600, #0d9488);
      }
      .hwb-drill-tab.is-active {
        background: var(--teal-soft, #e6f4f1);
        border-color: var(--teal-700, #0f766e);
      }
      .hwb-drill-tab-num {
        display: block;
        font-size: 11px;
        font-weight: 700;
        color: var(--ink-500, #78716c);
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }
      .hwb-drill-tab-title {
        display: block;
        font-size: 13px;
        font-weight: 700;
        margin-top: 2px;
      }
      .hwb-grid-2 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 14px;
      }
      .hwb-grid-4 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
        gap: 12px;
      }
      .hwb-control-row {
        margin-bottom: 12px;
      }
      .hwb-control-label {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: 13px;
        font-weight: 600;
        color: var(--ink-700, #44403c);
        margin-bottom: 4px;
      }
      .hwb-slider {
        width: 100%;
        accent-color: var(--teal-700, #0f766e);
        cursor: pointer;
      }
      .hwb-meter-track {
        width: 100%;
        height: 10px;
        border-radius: 999px;
        background: #e5dec9;
        overflow: hidden;
        margin-top: 6px;
      }
      .hwb-meter-fill {
        height: 100%;
        border-radius: 999px;
        transition: width 0.22s ease;
      }
      .hwb-tone-good { background: var(--teal-soft, #e6f4f1); border-color: #99f6e4; color: var(--teal-700, #0f766e); }
      .hwb-tone-warn { background: var(--copper-soft, #fef3c7); border-color: #fde68a; color: var(--copper-700, #b45309); }
      .hwb-tone-bad  { background: var(--crimson-soft, #fee2e2); border-color: #fecaca; color: var(--crimson-700, #b91c1c); }
      .hwb-pill {
        display: inline-block;
        padding: 3px 9px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        border: 1px solid transparent;
      }
      .hwb-action-btn {
        appearance: none;
        border: 1px solid var(--border-stone, #dfd6c7);
        background: var(--bg-card, #fffdf9);
        color: var(--ink-900, #1c1917);
        padding: 8px 12px;
        border-radius: 10px;
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
      }
      .hwb-action-btn.is-primary {
        background: var(--teal-700, #0f766e);
        border-color: var(--teal-700, #0f766e);
        color: #ffffff;
      }
      .hwb-friend-quote {
        border-left: 4px solid var(--teal-700, #0f766e);
        padding: 10px 14px;
        background: var(--bg-linen, #f7f3eb);
        border-radius: 0 12px 12px 0;
        color: var(--ink-900, #1c1917);
        font-size: 14px;
        margin-top: 12px;
      }
    `;
    global.document.head.appendChild(style);
  }

  // --------------------------------------------------------------------------
  // 2. 3-STAGE MASTERY, LENS SYSTEM & ZERO-JARGON SANITIZER
  // --------------------------------------------------------------------------
  function normalizeLens(input) {
    const up = String(input || '').trim().toUpperCase();
    if (up === 'SOKAK' || up === 'PLAIN' || up === 'CIRAK' || up === 'ÇIRAK' || up === 'NOVICE' || up === '1') return 'SOKAK';
    if (up === 'KOPRU' || up === 'KÖPRÜ' || up === 'KALFA' || up === 'BRIDGE' || up === '2') return 'KOPRU';
    if (up === 'SAHA' || up === 'GERCEK_HAYAT' || up === 'USTA' || up === 'PRO' || up === 'EXPERT' || up === '3') return 'SAHA';
    return wisdomState.lens || 'SOKAK';
  }

  function getLanguageLens() {
    return wisdomState.lens || 'SOKAK';
  }

  function setLanguageLens(lens) {
    const next = normalizeLens(lens);
    wisdomState.lens = next;
    wisdomState.userExplicitlySetLens = true;
    saveWisdomState();
    notifyWisdomListeners();
    return next;
  }

  function subscribe(fn) {
    if (typeof fn !== 'function') return function () {};
    listeners.add(fn);
    return function () { listeners.delete(fn); };
  }

  function markDrillPracticed(drillId) {
    if (!drillId) return;
    wisdomState.practicedDrills[String(drillId)] = Date.now();
    saveWisdomState();
    notifyWisdomListeners();
  }

  function getMasteryProfile(memberOverride) {
    const kernel = global.AetherKernelV10;
    const m = memberOverride || (kernel && kernel.getActiveMember ? kernel.getActiveMember() : null);
    const ms = (m && m.livedMilestones) || {};
    const livedCount = [
      ms.executedRealOrder,
      ms.waitedSettlementOrValor,
      ms.inspectedCashScale,
      ms.completedArenaYear
    ].filter(Boolean).length;
    const practicedIds = Object.keys(wisdomState.practicedDrills || {});
    const practicedCount = practicedIds.length;
    const tradeCount = Array.isArray(m && m.tradeHistory) ? m.tradeHistory.length : 0;

    let recommendedLens = 'SOKAK';
    if (livedCount >= 3 || practicedCount >= 5 || (livedCount >= 2 && practicedCount >= 3)) {
      recommendedLens = 'SAHA';
    } else if (livedCount >= 1 || practicedCount >= 2 || tradeCount >= 2) {
      recommendedLens = 'KOPRU';
    }

    const activeMeta = LENS_META[wisdomState.lens] || LENS_META.SOKAK;
    let calmSummary = 'Şu an her kavramı mahalle bakkalı, mutfak kileri ve esnaf çekmecesi üzerinden yalın gözle okuyorsun.';
    if (wisdomState.lens === 'KOPRU') {
      calmSummary = 'Sokaktaki sezgiyi oturtmaya başladın; artık her esnaf tabirinin yanında banka ekranındaki gerçek adını da görüyorsun.';
    } else if (wisdomState.lens === 'SAHA') {
      calmSummary = 'Gerçek banka gişesi, bilanço dipnotu, takas kum saati ve vergi kurallarıyla tam saha dilinde okuyorsun.';
    }

    return {
      currentLens: activeMeta.key,
      lensTitle: activeMeta.title,
      shortLabel: activeMeta.shortLabel,
      stageIndex: activeMeta.stageIndex,
      stageKey: activeMeta.key,
      stageTitle: activeMeta.title,
      stageSubtitle: activeMeta.subtitle,
      recommendedLens,
      recommendedLensTitle: LENS_META[recommendedLens].title,
      practicedDrillsCount: practicedCount,
      totalDrillsCount: 8,
      practicedDrillIds: practicedIds,
      livedMilestonesCount: livedCount,
      calmSummary,
      lensOptions: VALID_LENSES.map((k) => ({
        key: k,
        shortLabel: LENS_META[k].shortLabel,
        title: LENS_META[k].title,
        subtitle: LENS_META[k].subtitle,
        isActive: k === activeMeta.key,
        isRecommended: k === recommendedLens
      }))
    };
  }

  // Çırak ('SOKAK') modunda tek bir finansal kısaltmanın bile sızmasını önleyen Türkçe süzgeç
  const SOKAK_REPLACEMENTS = [
    [/ALTIN\.S1/gi, 'kağıt altın fişi'],
    [/TMS[-\s]*29/gi, 'enflasyon düzeltmesi'],
    [/Y[İIıi][-\s]*[ÜUüu]FE/gi, 'üretici maliyet artışı'],
    [/T[ÜUüu]FE/gi, 'çarşı pazar pahalılığı'],
    [/[ÜUüu]FE/gi, 'fabrika çıkış maliyeti'],
    [/PD\s*\/\s*DD/gi, 'özvarlık çarpanı'],
    [/F\s*\/\s*K/gi, 'kazanç yılı çarpanı'],
    [/FAV[ÖOöo]K/gi, 'dükkânın esas tezgâh kazancı'],
    [/V[İIıi]OP/gi, 'vadeli sözleşme masası'],
    [/TEFAS/gi, 'ortak fon havuzu'],
    [/BEFAS/gi, 'emeklilik havuzu'],
    [/B[İIıi]ST/gi, 'ülke şirketler pazarı'],
    [/OCF/gi, 'çekmeceye giren gerçek nakit'],
    [/BSMV/gi, 'banka işlem vergisi'],
    [/[sS][tT][oO][pP][aA][jJ][ıiIaA]?[nN]?[dD]?[aA]?[nN]?/g, 'vergi dilimi kesintisi'],
    [/[vV][aA][lL][öÖoO][rR][üÜuU]?[nN]?[eE]?/g, 'kurye bekleme süresi'],
    [/\bBYF\b/gi, 'sepet payı'],
    [/\bETF\b/gi, 'sepet payı'],
    [/\bVUK\b/gi, 'vergi dairesi defteri'],
    [/\bCMF\b/gi, 'büyük tüccar para izi'],
    [/[sS][lL][oO][aA][nN]/g, 'veresiye şişkinliği'],
    [/[pP][oO][rR][tT][fF][öÖoO][yY][üÜuU]?[nN]?[dD]?[eE]?[kK]?[iİ]?/g, 'birikim kileri'],
    [/[vV][oO][lL][aA][tT][iİıI][lL][iİıI][tT][eE][sS]?[iİıI]?/g, 'fiyat dalgalanması'],
    [/[lL][iİıI][kK][iİıI][dD][iİıI][tT][eE][sS]?[iİıI]?/g, 'nakde dönme hızı'],
    [/\bGYO\b/gi, 'kira ve mülk ortaklığı'],
    [/\bPPF\b/gi, 'günlük nakit havuzu'],
    [/D[İIıi]BS/gi, 'devlet borç senedi'],
    [/\bBES\b/gi, 'bireysel emeklilik kumbarası'],
    [/VBTS/gi, 'tedbir kuralı'],
    [/\bKAP\b/gi, 'resmi şirket duyuru panosu'],
    [/\bMKK\b/gi, 'merkezi kayıt kasası'],
    [/\bSPK\b/gi, 'piyasa denetçisi'],
    [/\bGVK\b/gi, 'gelir vergisi kuralı'],
    [/[sS][uU][kK][uU][kK]/g, 'kira sertifikası'],
    [/[eE][uU][rR][oO][bB][oO][nN][dD]/g, 'dövizli dış borç senedi'],
    [/EBITDA/gi, 'esas tezgâh kazancı']
  ];

  function sanitizeSokakText(rawText) {
    if (rawText == null) return '';
    let out = String(rawText);
    for (let i = 0; i < SOKAK_REPLACEMENTS.length; i++) {
      out = out.replace(SOKAK_REPLACEMENTS[i][0], SOKAK_REPLACEMENTS[i][1]);
    }
    return out.replace(/\s{2,}/g, ' ').trim();
  }

  function deepSanitizeSokak(val) {
    if (typeof val === 'string') return sanitizeSokakText(val);
    if (Array.isArray(val)) return val.map(deepSanitizeSokak);
    if (val && typeof val === 'object') {
      const clean = {};
      for (const [k, v] of Object.entries(val)) {
        clean[k] = (k === 'id' || k === 'lens' || k === 'verdictTone' || k === 'tone')
          ? v
          : deepSanitizeSokak(v);
      }
      return clean;
    }
    return val;
  }

  // --------------------------------------------------------------------------
  // 3. UNIVERSAL ZERO-JARGON PLACE & WORKSHOP TRANSLATOR (69 + 619 VARLIK)
  // --------------------------------------------------------------------------
  const BESPOKE_TITLES = {
    // 69 Temel Varlık — El İşçiliği Sokak İsimleri
    'mevduat-ust': 'Özel Bankanın Süreli Kilitli Faiz Kasası',
    'mevduat-tcmb': 'Bankaların Ortalama Süreli Faiz Kasası',
    'katilim-hesabi': 'Ortaklık Usulü Süreli Kâr Payı Kasası',
    'para-piyasasi-fonu': 'Sabah Bozulabilen Günlük Nakit Kavanozu',
    'dibs-tahvil': 'Devletin İki Yıllık Sabit Söz Senedi',
    'kira-sertifikasi-sukuk': 'Devletin Kesintisiz Kira Kalkanı',
    'eurobond-usdtr': 'Bankadaki Vergili Dolar Sepeti Fişi',
    'eurobond-emb': 'Gelişen Ülkelerin Dolarlı Kira Senedi',
    'doviz-usd': 'Çarşıdaki Yeşil Amerikan Banknotu',
    'doviz-eur': 'Avrupa Ticaretinin Ortak Banknotu',
    'doviz-gbp': 'Ada Krallığının Ağır Banknotu',
    'doviz-chf': 'Dağ Kasasının Sakin İsviçre Banknotu',
    'gram-altin-spot': 'Sarrafın Paslanmaz Sarı Külçesi',
    'ceyrek-altin': 'Düğün ve Yastık Altının Küçük Sarı Sikkesi',
    'cumhuriyet-altini': 'Kuşaktan Kuşağa Ağır Cumhuriyet Sikkesi',
    'bilezik-22-ayar': 'Kolda Taşınan İşçilikli Sarı Bilezik',
    'altin-sertifikasi': 'Altının Pahalı Kağıt Fişi (Hava Paralı!)',
    'altin-fonu-zgold': 'Vergi Kesintili Katılım Altın Sepeti',
    'altin-fonu-gldtr': 'Vergi Kesintili Saklama Kasası Altın Sepeti',
    'gram-gumus-spot': 'Sanayinin ve Çarşının Beyaz Külçesi',
    'gumus-fonu-gmstr': 'Vergi Kesintili Kağıt Gümüş Sepeti',
    'ons-platin': 'Ağır Sanayi ve Motorların Nadir Beyaz Metali',
    'ons-paladyum': 'Egzoz ve Arıtma Ocaklarının Nadir Metali',
    'emtia-petrol-bno': 'Açık Deniz Tankerinin Ham Petrol Varili',
    'emtia-tarim-dba': 'Dünya Buğday, Mısır ve Kahve Çuvalı',
    'bist-100': 'Ülkenin En Büyük 100 Fabrikası Ortak Sepeti',
    'bist-30': 'Ülkenin En Dev 30 Sanayi ve Kasa Çatısı',
    'bist-banka': 'Ülkenin Büyük Kredi Gişeleri Sepeti',
    'bist-temettu-25': 'Kasasından Düzenli Kâr Payı Dağıtan 25 Dükkân',
    'halka-arz-altny': 'Yerli Robot ve Savunma Atölyesi (Altınay)',
    'halka-arz-tabgd': 'AVM ve Cadde Hızlı Yemek Tezgâhları (TAB Gıda)',
    'halka-arz-rgyas': 'Büyük Alışveriş Merkezleri Kira Mülkü (Rönesans)',
    'abd-sp500-spy': 'Amerika’daki En Büyük 500 Şirket Sepeti',
    'abd-nasdaq-qqq': 'Dünya Yazılım ve Teknoloji Devleri Sepeti',
    'dunya-borsalari-vt': 'Yerkürenin Bütün Büyük Fabrikaları Sepeti',
    'kuresel-hisse-nvda': 'Yapay Zeka Beyinlerini Üreten Çip Fabrikası (Nvidia)',
    'kuresel-hisse-aapl': 'Cebimizdeki Akıllı Telefon Ekosistemi (Apple)',
    'kuresel-hisse-msft': 'Dünya Ofislerinin Bilgisayar Yazılım Mutfağı (Microsoft)',
    'viop-bist30-kontrat': 'Borçlu Kaldıraçla İki Yönlü İddia Masası',
    'fon-yerli-hisse-zpbdl': 'Banka Dışı 10 Büyük Sanayi Fabrikası Sepeti',
    'fon-yerli-banka-zplib': 'Büyük Kredi Gişeleri Ortak Pay Sepeti',
    'fon-yerli-bist30-apx30': 'Ülkenin 30 Lokomotif Şirketi Ortak Sepeti',
    'fon-katilim-z30kp': 'Faizsiz Çalışan 30 Üretim Fabrikası Sepeti',
    'fon-tematik-teknoloji-zpt10': 'Yerli Yazılım ve İletişim Mutfağı Sepeti',
    'fon-tematik-surdurulebilirlik-zsr25': 'Temiz Enerji ve Düzenli Üretim 25 Fabrika Sepeti',
    'fon-tematik-yari-iletken-soxx': 'Küresel Mikroçip Dökümhaneleri Sepeti',
    'fon-degisken-isglk': 'Vergi Kesintili Altın Katılım Sepeti',
    'bes-emeklilik': 'Devlet Katkılı Uzun Vadeli Emeklilik Kumbarası',
    'gayrimenkul-konut-tcmb': 'Ülke Genelindeki Ev Tapularının Ortalama Fiyat Ölçeği',
    'gayrimenkul-konut-ekgyo': ' Büyük Konut ve Arsa Projeleri Mülk Ortaklığı (Emlak Konut)',
    'gayrimenkul-ticari-rygyo': 'Sanayi ve Kargo Depoları Kira Mülkü (Reysaş)',
    'gayrimenkul-ticari-isgyo': 'Plaza, Kule ve Cadde Mağazaları Kira Mülkü (İş Mülk)',
    'gayrimenkul-arazi-algyo': 'Tatil Köyü ve Arsa Kasası Mülk Ortaklığı (Alarko Mülk)',
    'gayrimenkul-gyo-fonu-optgy': 'Kira Toplayan Mülk Şirketleri Ortak Sepeti',
    'kripto-btc': '7/24 Açık Dijital Kıt Kasa Kaydı (Bitcoin)',
    'kripto-eth': 'Akıllı Sözleşme Çalıştıran Dijital Ağ (Ethereum)',
    'kripto-sol': 'Hızlı Dijital Transfer Ağı Kaydı (Solana)',
    'girisim-hubvc': 'Yeni Kurulan Teknoloji Atölyeleri Ortaklığı (Hub)',
    'girisim-isgsy': 'Büyüyen KOBİ ve Atölyelere Ortak Kasa (İş Girişim)',
    'girisim-vertu': 'Genç Yazılım ve Enerji Atölyeleri Ortaklığı (Verusaturk)',
    'girisim-gozde': 'Ambalaj, Gıda ve Sanayi İştirakleri Kasası (Gözde)',
    'koleksiyon-luks-lvmh': 'Avrupa Lüks Çanta ve Saat Atölyeleri Çatısı',
    'reel-perakende-bimas': '81 İlde Peşin Çalışan Mahalle Marketi',
    'reel-perakende-mgros': 'Cadde ve İnternet Sepetli Büyük Süpermarket (Migros)',
    'reel-enerji-astor': 'Şehirlere Dev Elektrik Trafosu Üreten Fabrika (Astor)',
    'reel-enerji-cwene': 'Çatılara Güneş Paneli Döşeyen Fabrika (CW Enerji)',
    'reel-enerji-smrtg': 'Güneş Tarlası ve Panel Üretim Fabrikası (Smart Güneş)',
    'reel-yazilim-logo': 'Esnafın ve Şirketlerin Muhasebe Yazılım Mutfağı (Logo)',
    'reel-yazilim-miatk': 'Kamera, Kimlik ve Yazılım Atölyesi (MİA Teknoloji)'
  };

  // Öne çıkan semboller için birebir el işçiliği sokak karşılıkları
  const BESPOKE_TICKER_TITLES = {
    BIMAS: '81 İlde Peşin Çalışan Mahalle Marketi',
    FROTO: "Avrupa'ya Kamyon Satan Liman Fabrikası",
    SASA: 'Ağır Borçlu Dev Elyaf Fabrikası',
    THYAO: 'Dünyaya Yolcu ve Kargo Taşıyan Bayrak Filosu',
    PGSUS: 'Avrupa Hatlarında Düşük Maliyetli Uçak Filosu',
    TUPRS: 'Ülkenin Mazot ve Benzin Kaynatan Dev Rafinerisi',
    EREGL: 'Karadeniz Kıyısındaki Yassı Çelik Dökümhanesi',
    ISDMR: 'Akdeniz Kıyısındaki Ağır Demir-Çelik Ocakları',
    KRDMD: 'Tren Rayı ve İnşaat Demiri Döken Karabük Ocağı',
    ASELS: 'Radar, Telsiz ve Savunma Elektroniği Üretim Üssü',
    SISE: 'Dünyaya Cam ve Soda Külü Satan Fırınlar Devleri',
    KCHOL: 'Rafineri, Otomotiv ve Beyaz Eşya Fabrikaları Çatısı (Koç)',
    SAHOL: 'Enerji, Banka ve Sanayi Fabrikaları Çatısı (Sabancı)',
    GARAN: 'Milyonlarca Maaş ve Kredi Çeviren Büyük Banka Gişesi (Garanti)',
    AKBNK: 'Yüksek Kasalı Özel Kredi ve Mevduat Gişesi (Akbank)',
    ISCTR: 'Sanayi İştirakli Köklü Kredi ve Mevduat Gişesi (İş Bankası)',
    YKBNK: 'Ticari Kredi ve Kart Ağı Geniş Banka Gişesi (Yapı Kredi)',
    VAKBN: 'Kamu Destekli Büyük Kredi ve Maaş Gişesi (Vakıfbank)',
    HALKB: 'Esnaf Kredisi Ağırlıklı Kamu Banka Gişesi (Halkbank)',
    MGROS: 'Cadde ve İnternet Sepetli Büyük Süpermarket (Migros)',
    SOKM: 'Köşe Başı İndirimli Mahalle Bakkal Zinciri (Şok)',
    TCELL: 'Milyonların Aylık Fatura Ödediği Cep İletişim Ağı (Turkcell)',
    TTKOM: 'Ev İnterneti ve Telefon Hatları İletişim Ağı (Türk Telekom)',
    ARCLK: 'Avrupa ve Yurda Buzdolabı-Çamaşır Makinesi Üreten Fabrika',
    VESTL: 'Televizyon ve Beyaz Eşya İhraç Eden Manisa Fabrikası',
    TOASO: 'Bursa’da Otomobil ve Hafif Ticari Araç Üreten Fabrika',
    DOAS: 'İthal Otomobil Getirip Bayilerde Peşin Satan Dağıtım Ağı',
    TTRAK: 'Çiftçiye Traktör Üreten Köklü Tarım Fabrikası',
    OTKAR: 'Zırhlı Araç ve Otobüs Üreten Sakarya Fabrikası',
    ENKAI: 'Kasası Döviz Dolu Küresel İnşaat ve Santral Şirketi (Enka)',
    CCOLA: 'Bölge Ülkelerine Gazlı İçecek ve Su Şişeleyen Fabrika',
    AEFES: 'Yurt İçi ve Yurt Dışı İçecek Dolum Fabrikaları',
    ULKER: 'Bisküvi ve Çikolata Fırınları Gıda Fabrikası (Ülker)',
    MAVI: 'Kot Pantolon ve Giyim Satan Cadde Mağaza Zinciri (Mavi)',
    KOZAL: 'Topraktan Altın Cevheri Çıkaran Maden Ocakları',
    PETKM: 'Plastik Hammaddesi Üreten Aliağa Petrokimya Tesisi',
    HEKTS: 'Borç Yükü Ağırlaşmış Tarım İlacı ve Tohum Tesisi',
    GUBRF: 'Tarlaya Gübre Veren ve Altın Madeni Bulunan Tesis',
    CIMSA: 'Yurt Dışına Beyaz Çimento Satan Fırın Fabrikası (Çimsa)',
    AKSA: 'Tekstil İçin Akrilik İplik Üreten Yalova Fabrikası (Aksa)',
    ENJSA: 'Milyonlarca Hanenin Elektrik Dağıtım ve Fatura Şirketi',
    TAVHL: 'Yerli ve Yabancı Havalimanı Terminalleri İşletmecisi',
    MPARK: 'Şehirlerde Özel Hastane Zinciri İşleten Sağlık Grubu'
  };

  // 24 Sektör İçin Sıfır Jargonlu Atölye/Dükkân Arketipleri ve Hammadde Zincirleri
  const SECTOR_WORKSHOP_ARCHETYPES = {
    'Market & Perakende': {
      placeNoun: 'Mahalle ve Cadde Market Zinciri',
      upstream: [
        'Tarladaki sebze, tahıl ve süt alım fiyatları',
        'Depodan mağazaya kamyonların mazot faturası',
        'Soğuk hava dolaplarının aylık elektrik sayacı',
        'Mahallelinin ay sonu mutfak filesi bütçesi'
      ]
    },
    'Otomotiv & Yan Sanayi': {
      placeNoun: 'Araç ve Yedek Parça Fabrikası',
      upstream: [
        'Yassı çelik sac, alüminyum ve kauçuk lastik maliyeti',
        'Avrupa şehirlerindeki kamyon ve otomobil siparişleri',
        'Fabrika robot hatlarının elektrik ve doğalgaz faturası',
        'Taşıt kredisi faizlerinin alıcı iştahına etkisi'
      ]
    },
    'Demir-Çelik & Metal': {
      placeNoun: 'Demir ve Çelik Dökümhanesi',
      upstream: [
        'Gemilerle gelen demir cevheri ve taş kömürü fiyatı',
        'Yüksek fırınların devasa elektrik ve doğalgaz tüketimi',
        'İnşaat şantiyeleri ile beyaz eşya fabrikalarının sac talebi',
        'Dünya çelik pazarındaki dolar bazlı ton fiyatları'
      ]
    },
    'Kimya, Gübre & Kağıt': {
      placeNoun: 'Kimya, Plastik ve Kağıt Tesisi',
      upstream: [
        'Ham petrol türevleri, doğalgaz ve selüloz hammaddesi',
        'Kazan dairelerinin kesintisiz enerji faturası',
        'Çiftçinin gübre alım gücü ve ambalaj siparişleri',
        'İthal ürünlerle döviz kuru üzerinden fiyat rekabeti'
      ]
    },
    'Gıda, İçecek & Tarım': {
      placeNoun: 'Gıda, Un ve İçecek Mutfağı',
      upstream: [
        'Baraj doluluk oranı ve tarladaki buğday-şeker-süt rekoltesi',
        'Cam şişe, teneke kutu ve karton koli ambalaj gideri',
        'Soğuk zincir nakliye kamyonlarının mazot maliyeti',
        'Hanelerin mutfak ve market rafı talebi'
      ]
    },
    'Elektrik & Yenilenebilir Enerji': {
      placeNoun: 'Elektrik Üretim ve Ekipman Santrali',
      upstream: [
        'Barajlara düşen yağmur, rüzgâr hızı ve güneşlenme süresi',
        'Bakır tel, silisyum panel ve trafo sacı maliyetleri',
        'Sanayi bölgelerinin aylık elektrik tüketimi',
        'Şebeke yenileme ihaleleri ve dövizli ekipman siparişleri'
      ]
    },
    'Yazılım, Teknoloji & Telekom': {
      placeNoun: 'Yazılım ve İletişim Mutfağı',
      upstream: [
        'Nitelikli mühendis ve yazılımcı maaş bordroları',
        'Fiber kablo, baz istasyonu ve sunucu donanım gideri',
        'Şirketlerin ve hanelerin aylık düzenli abonelik faturaları',
        'Kamu ve özel sektör dijital dönüşüm sözleşmeleri'
      ]
    },
    'Havacılık & Lojistik': {
      placeNoun: 'Uçak ve Kargo Taşıma Filosu',
      upstream: [
        'Uçak ve tırların en büyük gideri olan jet yakıtı ve mazot',
        'Yaz aylarında Avrupa ve dünyadan gelen turist sayısı',
        'Döviz cinsinden bilet gelirleri ile yer hizmetleri gideri',
        'Küresel ticaret koridorlarındaki kargo doluluk oranı'
      ]
    },
    'Bankacılık': {
      placeNoun: 'Kredi ve Mevduat Gişesi',
      upstream: [
        'Merkez kasasının belirlediği borçlanma faiz maliyeti',
        'Vatandaşın mevduat faizi ile verilen kredi faizi arasındaki makas',
        'Esnafın ve hanelerin kredi taksitlerini zamanında ödeme gücü',
        'Ülke genelindeki kartlı harcama ve komisyon trafiği'
      ]
    },
    'Sigorta & Emeklilik': {
      placeNoun: 'Poliçe ve Güvence Havuzu',
      upstream: [
        'Araç kasko, trafik ve sağlık poliçelerinden peşin toplanan primler',
        'Toplanan peşin paranın faiz ve kira kalkanlarında nemalanması',
        'Oto yedek parça ve hastane hasar ödeme faturaları',
        'Yeni araç ve konut satışlarının poliçe adedine etkisi'
      ]
    },
    'Çimento, Cam & Seramik': {
      placeNoun: 'Çimento, Cam ve Fırın Ocağı',
      upstream: [
        'Taş ocakları hammaddesi, petrokok kömürü ve doğalgaz ateşi',
        'Konut şantiyeleri, kentsel dönüşüm ve yol inşaatları',
        'Limanlara yakınlık ve gemi navlun taşıma ücretleri',
        'İhracat pazarlarındaki inşaat canlanması'
      ]
    },
    'Savunma & Havacılık Sanayi': {
      placeNoun: 'Savunma ve Elektronik Üretim Üssü',
      upstream: [
        'Yüksek hassasiyetli optik, mikroçip ve özel alaşım metaller',
        'Uzun yıllara yayılan kesinleşmiş devlet ve ihracat siparişleri',
        'Araştırma-geliştirme mühendis kadrosunun sürekliliği',
        'Teslimat takvimine bağlı döviz bazlı hakediş tahsilatları'
      ]
    },
    'İnşaat & Taahhüt': {
      placeNoun: 'Şantiye ve Müteahhitlik Şirketi',
      upstream: [
        'Demir, hazır beton, bakır kablo ve iş makinesi mazotu',
        'Yurt dışı ve yurt içi altyapı hakediş ödemeleri',
        'Konut kredisi faiz oranlarının alıcı talebine etkisi',
        'Şantiye işçilik ve taşeron sözleşme maliyetleri'
      ]
    },
    'Gayrimenkul & GYO': {
      placeNoun: 'Kira ve Tapu Mülkü Ortaklığı',
      upstream: [
        'AVM, depo ve ofis kiracılarının aylık kira ödeme gücü',
        'Arsa payı ve inşaat demir-beton yenileme maliyetleri',
        'Konut ve ticari mülk piyasasındaki kredi faizi dengesi',
        'Enflasyona endeksli kira yenileme sözleşmeleri'
      ]
    },
    'Tekstil & Hazır Giyim': {
      placeNoun: 'Dokuma, İplik ve Giyim Tezgâhı',
      upstream: [
        'Pamuk balyası, polyester elyaf ve boya hammaddesi',
        'Atölye işçilik ücretleri ve dokuma tezgâhı elektriği',
        'Avrupa mağaza zincirlerinin sezonluk giyim siparişleri',
        'Döviz kurunun içerideki işçilik artışına yetişip yetişmemesi'
      ]
    },
    'Beyaz Eşya & Mobilya': {
      placeNoun: 'Ev Eşyası ve Mobilya Fabrikası',
      upstream: [
        'Yassı çelik sac, bakır motor sargısı, plastik ve sunta',
        'Yeni evlenen hanelerin ve yenileme pazarının taksit gücü',
        'Avrupa evlerindeki enerji tasarruflu cihaz talebi',
        'Kredi kartı taksit sınırları ve nakliye giderleri'
      ]
    },
    'Petrol, Rafineri & Doğalgaz': {
      placeNoun: 'Rafineri ve Akaryakıt Tesisi',
      upstream: [
        'Tankerlerle gelen ham petrol varil fiyatı ve işleme marjı',
        'Ülke yollarındaki kamyon, otobüs ve otomobil mazot tüketimi',
        'Uçakların yaz sezonundaki jet yakıtı talebi',
        'Rafineri bakım duruşları ve doğalgaz enerji maliyeti'
      ]
    },
    'İlaç & Sağlık': {
      placeNoun: 'İlaç ve Şifa Hizmet Tesisi',
      upstream: [
        'Dövizle ithal edilen etkin ilaç hammaddesi ve tıbbi cihazlar',
        'Resmi ilaç fiyat kararnamesi ve geri ödeme takvimi',
        'Hastane doluluk oranları ve sağlık turizmi döviz geliri',
        'Hekim, hemşire ve laboratuvar işletme giderleri'
      ]
    },
    'Makine & Sanayi Üretimi': {
      placeNoun: 'Makine ve Sanayi Atölyesi',
      upstream: [
        'Özel çelik döküm, rulman, hidrolik ve elektrik motorları',
        'Fabrikaların yeni makine yatırımı iştahı ve kredi maliyeti',
        'İhracat pazarlarına yapılan dövizli makine sevkiyatları',
        'Usta işçilik ve atölye enerji giderleri'
      ]
    },
    'Madencilik & Altın': {
      placeNoun: 'Cevher ve Maden Ocağı',
      upstream: [
        'Dünya ons altın, bakır ve krom cevheri fiyatları',
        'Kazı kamyonlarının mazotu ve cevher ayrıştırma enerjisi',
        'Toprağın altındaki tenör verimi ve işletme ruhsat süreleri',
        'Çıkarılan cevherin döviz bazında peşin satışı'
      ]
    },
    'Holding & Çoklu Yatırım': {
      placeNoun: 'Çoklu Fabrika ve Kasa Çatısı',
      upstream: [
        'Çatısı altındaki enerji, sanayi ve finans şirketlerinin nakit kârı',
        'Merkez kasadaki döviz ve nakit yastığının büyüklüğü',
        'Alt fabrikalardan merkeze her bahar akan kâr payları',
        'Ülke genelindeki sanayi çarklarının ve ihracatın temposu'
      ]
    },
    'Turizm, Medya & Hizmet': {
      placeNoun: 'Konaklama ve Hizmet İşletmesi',
      upstream: [
        'Yurt dışından gelen dövizli turist doluluk oranları',
        'Mutfak gıda maliyeti, personel ve soğutma elektriği',
        'Yaz sezonu erken rezervasyon peşin tahsilatları',
        'Şehir içi ulaşım ve etkinlik harcama bütçeleri'
      ]
    },
    'Girişim & Yatırım Ortaklığı': {
      placeNoun: 'Genç Atölyelere Ortak Kasa',
      upstream: [
        'Ortak olunan genç şirketlerin müşteri ve nakit üretme hızı',
        'Piyasadaki borçlanma faizlerinin yeni yatırımlara etkisi',
        'Büyüyen iştiraklerin satışı veya ortaklığa açılması',
        'Kasadaki yedek nakdin enflasyona karşı korunması'
      ]
    },
    'Aracı Kurum & Finansman': {
      placeNoun: 'Piyasa Gişesi ve Kiralama Şirketi',
      upstream: [
        'Günlük alım-satım işlem hacminden kesilen gişe komisyonları',
        'Kredili işlem kullanan müşterilerden alınan faiz gelirleri',
        'Makine kiralama ve faktoring tahsilat hızı',
        'Piyasadaki işlem canlılığı ve faiz oranları'
      ]
    }
  };

  function cleanCompanyRootName(rawName, ticker) {
    if (!rawName) return ticker || 'İşletme';
    let s = String(rawName)
      .replace(/\(.*?\)/g, ' ')
      .replace(/T\.A\.Ş\.|A\.Ş\.|A\.O\.|SANAYİ|VE TİCARET|TİCARET|YATIRIM ORTAKLIĞI|GAYRİMENKUL|PORTFÖY|HOLDİNG/gi, ' ')
      .replace(/[:\-–]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    const words = s.split(' ').filter((w) => w.length > 1).slice(0, 3);
    if (words.length === 0) return ticker || 'Atölye';
    return words
      .map((w) => {
        const first = w.charAt(0).toLocaleUpperCase('tr-TR');
        const rest = w.slice(1).toLocaleLowerCase('tr-TR');
        return first + rest;
      })
      .join(' ');
  }

  function resolveKernelAsset(assetKeyOrObj) {
    const kernel = global.AetherKernelV10;
    if (assetKeyOrObj && typeof assetKeyOrObj === 'object') {
      if (kernel && kernel.getAsset && (assetKeyOrObj.key || assetKeyOrObj.id || assetKeyOrObj.ticker)) {
        const found = kernel.getAsset(assetKeyOrObj.key || assetKeyOrObj.id || assetKeyOrObj.ticker);
        if (found) return found;
      }
      return assetKeyOrObj;
    }
    const rawKey = String(assetKeyOrObj || '').trim();
    if (!rawKey) return null;
    if (kernel && kernel.getAsset) {
      const direct = kernel.getAsset(rawKey)
        || kernel.getAsset(rawKey.toUpperCase())
        || kernel.getAsset('BIST:' + rawKey.toUpperCase())
        || kernel.getAsset('bist-' + rawKey.toLowerCase());
      if (direct) return direct;
    }
    return {
      key: rawKey,
      id: rawKey,
      ticker: rawKey.toUpperCase(),
      name: rawKey,
      venue: 'SPOT_24_7',
      subVenue: 'OTHER',
      priceTL: 100,
      change1D: 0,
      stopajPct: 0,
      bsmvBuyPct: 0
    };
  }

  function buildDynamicBistTitle(asset, row) {
    const tUp = String(asset.ticker || '').toUpperCase();
    if (BESPOKE_TICKER_TITLES[tUp]) return BESPOKE_TICKER_TITLES[tUp];
    if (BESPOKE_TITLES[asset.key]) return BESPOKE_TITLES[asset.key];

    const arch = SECTOR_WORKSHOP_ARCHETYPES[row && row.sector] || {
      placeNoun: 'Üretim ve Ticaret İşletmesi'
    };
    const rootBrand = cleanCompanyRootName(row ? row.name : asset.name, tUp);

    let posture = 'Çark Çeviren';
    if (row) {
      const isFin = row.entityKind === 'bank' || row.entityKind === 'insurance' || row.entityKind === 'fin_other';
      if (isFin) {
        posture = (row.roe || 0) >= 22 ? 'Kasası Güçlü' : 'Düzenli Çalışan';
      } else if (row.isNetCash && (row.ocfMillionTL || 0) > 0) {
        posture = 'Kasası Nakit Dolu';
      } else if ((row.ocfMillionTL || 0) > 0 && (row.cashConversionRatio || 0) >= 1.15) {
        posture = 'Peşin Tahsilatlı';
      } else if ((row.netDebtToEbitda || 0) >= 3.8 || ((row.ocfMillionTL || 0) < 0 && (row.netDebtMillionTL || 0) > 0)) {
        posture = 'Ağır Kredi Yüklü';
      } else if ((row.netIncomeMillionTL || 0) > 0 && (row.ocfMillionTL || 0) < 0) {
        posture = 'Veresiye Defteri Kabarık';
      } else if ((row.ocfMillionTL || 0) > 0) {
        posture = 'Nakit Üreten';
      }
    }
    return `${posture} ${arch.placeNoun} (${rootBrand})`;
  }

  function buildVisualCashAnatomy(asset, lens) {
    const row = asset.bistRow || null;
    const kernel = global.AetherKernelV10;

    // A) Şirket Bilançosu Olan 619 BIST İşletmesi
    if (row) {
      const isFin = row.entityKind === 'bank' || row.entityKind === 'insurance' || row.entityKind === 'fin_other';
      const ocf = Number(row.ocfMillionTL) || 0;
      const netInc = Number(row.netIncomeMillionTL) || 0;
      const cashM = Number(row.cashMillionTL) || 0;
      const netDebtM = Number(row.netDebtMillionTL) || 0;
      const ndEbitda = Number(row.netDebtToEbitda) || 0;
      const sloan = Number(row.sloanAccrualPct) || 0;
      const ccr = Number(row.cashConversionRatio) || 0;
      const cmf = Number(row.cmf20) || 0;
      const chg = Number(asset.change1D) || 0;

      // 1. Çekmecedeki Gerçek Nakit
      let drawerScore = 58;
      let drawerLabel = 'Dengeli Nakit Girişi';
      let drawerSummary = '';
      if (isFin) {
        drawerScore = (row.roe || 0) >= 20 ? 78 : 55;
        drawerLabel = drawerScore >= 70 ? 'Güçlü Gişe Akışı' : 'Normal Gişe Akışı';
        drawerSummary = lens === 'SAHA'
          ? `Finans kuruluşu bilançosu; özsermaye kârlılığı %${Number(row.roe || 0).toFixed(1)} ve F/K ${Number(row.pe || 0).toFixed(1)} düzeyinde.`
          : 'Müşterilerden toplanan parayla verilen krediler arasındaki makastan düzenli nakit çeviriyor.';
      } else if (ocf > 0 && ccr >= 1.1) {
        drawerScore = Math.min(96, Math.round(72 + Math.min(24, ccr * 8)));
        drawerLabel = 'Çekmeceye Peşin Para Yağıyor';
        drawerSummary = lens === 'SAHA'
          ? `Yıllık Esas Faaliyet Nakit Akışı (OCF) +${ocf.toLocaleString('tr-TR')} Milyon TL; Net Kârın ${ccr.toFixed(2)} katı gerçek nakit üretiyor.`
          : (lens === 'KOPRU'
            ? `Dükkân çekmecesine giren gerçek para (Esas Faaliyet Nakit Akışı), defterde yazan kârdan bile yüksek; müşteriden peşin tahsilat yapıyor.`
            : 'Akşam kepenk kapanırken tahta çekmeceye gerçek banknot giriyor; malı veresiye yazmadan peşin paraya çeviriyor.');
      } else if (ocf > 0) {
        drawerScore = 66;
        drawerLabel = 'Çekmece Artıda';
        drawerSummary = lens === 'SAHA'
          ? `Yıllık OCF +${ocf.toLocaleString('tr-TR')} Milyon TL ile pozitif bölgede kalmayı sürdürüyor.`
          : 'Masraflar ve hammadde ödendikten sonra dükkân çekmecesine gerçek nakit bırakıyor.';
      } else {
        drawerScore = 24;
        drawerLabel = 'Çekmeceden Nakit Eksiliyor';
        drawerSummary = lens === 'SAHA'
          ? `Dikkat: Yıllık OCF ${ocf.toLocaleString('tr-TR')} Milyon TL negatif! Satışlar henüz kasaya nakit olarak dönmüyor.`
          : 'Vitrin kalabalık görünse de akşam çekmece açıldığında içeriden nakit eksildiği görülüyor; tahsilat yavaş.';
      }

      // 2. Kağıt Kâr / Veresiye Yanılsaması
      const hasIllusion = !isFin && ((netInc > 0 && ocf < 0) || sloan >= 10);
      const illusionSummary = hasIllusion
        ? (lens === 'SAHA'
          ? `Net Kâr +${netInc.toLocaleString('tr-TR')} Milyon TL görünürken OCF ${ocf.toLocaleString('tr-TR')} Milyon TL ve Sloan Tahakkuk Oranı %${sloan.toFixed(1)} (TMS-29 veya stok/alacak şişkinliği riski).`
          : (lens === 'KOPRU'
            ? 'Defterde kâr yazıyor ama para veresiye defterinde ve raftaki malda bekliyor (Tahakkuk ve Enflasyon Muhasebesi Yanılsaması).'
            : 'Defterde kazanç yazılmış fakat para henüz müşterinin cebinde veresiye duruyor; kasada harcanabilir banknot yok.'))
        : (lens === 'SAHA'
          ? `Sloan tahakkuk oranı %${sloan.toFixed(1)}; kağıt üstü fiktif kâr şişkinliği sinyali düşük.`
          : 'Defterde yazan kazançla çekmeceye giren gerçek para birbiriyle uyumlu; veresiye şişkinliği görünmüyor.');

      // 3. Nakit Yastığı
      const cushionScore = isFin
        ? 68
        : (row.isNetCash ? 90 : Math.max(18, Math.min(82, Math.round((Number(row.currentRatio) || 1) * 42))));
      const cushionLabel = row.isNetCash ? 'Kasa Fazlası Var' : (cushionScore >= 55 ? 'Yeterli Kışlık Yastık' : 'İnce Nakit Yastığı');
      const cushionSummary = lens === 'SAHA'
        ? `Hazır nakit ve benzerleri: ${cashM.toLocaleString('tr-TR')} Milyon TL · Cari Oran: ${Number(row.currentRatio || 1).toFixed(2)}.`
        : (row.isNetCash
          ? 'Kasadaki hazır parası tüm banka borçlarından fazla; kış sert geçse de kimseye el açmaz.'
          : `Acil hammadde ve maaş ödemeleri için kenarda ${cushionScore >= 55 ? 'makul bir nakit yastığı' : 'sınırlı bir yedek akçe'} tutuyor.`);

      // 4. Borç Yükü
      let debtScore = 30;
      let debtLabel = 'Hafif Borç';
      if (!isFin) {
        if (row.isNetCash || netDebtM <= 0) {
          debtScore = 10;
          debtLabel = 'Net Borçsuz Kasa';
        } else if (ndEbitda >= 3.8 || (ocf < 0 && netDebtM > 5000)) {
          debtScore = 88;
          debtLabel = 'Ağır Faiz Kamburu';
        } else if (ndEbitda >= 2.0) {
          debtScore = 58;
          debtLabel = 'Orta Kredi Yükü';
        }
      }
      const debtSummary = lens === 'SAHA'
        ? (isFin
          ? 'Mevduat ve fonlama yapısı sektör ortalamasında izleniyor.'
          : `Net Borç: ${netDebtM.toLocaleString('tr-TR')} Milyon TL · Net Borç / FAVÖK: ${ndEbitda.toFixed(2)}x.`)
        : (debtScore >= 75
          ? 'Sırtında ağır banka kredisi taşıyor; kazandığı paranın önemli kısmı tezgâha kalmadan faize gidiyor.'
          : (debtScore <= 20
            ? 'Sırtında onu ezecek bir kredi kamburu yok; ürettiği bereket dükkânın içinde kalıyor.'
            : 'Yönetilebilir düzeyde kredi kullanıyor; tezgâh kazancı taksitleri çevirebiliyor.'));

      // 5. Kalabalık vs Büyük Tüccar İzi
      let crowdNote = 'Dükkân kapısında olağan bir alışveriş akışı var; ne aşırı panik ne de taşkın bir kalabalık görülüyor.';
      if (asset.isPumpAnomaly || (chg >= 5.5 && cmf < -0.05)) {
        crowdNote = lens === 'SAHA'
          ? `Günlük +%${chg.toFixed(1)} yükselişe rağmen 20 günlük CMF (${cmf.toFixed(3)}) negatif; gürültülü perakende alımı sırasında kurumsal dağıtım izi var.`
          : 'Kapıda yüksek sesli bir kalabalık coşkusu var ama arka kapıdan büyük tüccarların sessizce mal devrettiği görülüyor; aceleyle sıraya girme.';
      } else if (chg <= -3.0 && cmf > 0.08) {
        crowdNote = lens === 'SAHA'
          ? `Fiyat geri çekilirken (%${chg.toFixed(1)}) CMF (+${cmf.toFixed(3)}) pozitif; panik satışlarını kurumsal kasalar topluyor.`
          : 'Sabırsız kalabalık korkup kepenk önünden uzaklaşırken, sabırlı büyük tüccarlar sessizce sepet dolduruyor.';
      } else if (cmf >= 0.1) {
        crowdNote = lens === 'SAHA'
          ? `20 günlük CMF +${cmf.toFixed(3)} ile kurumsal para girişi pozitif seyrediyor.`
          : 'Gösterişsiz ve sakin biçimde büyük kasaların bu dükkâna düzenli para soktuğu görülüyor.';
      }

      let verdictTone = 'DENGELI';
      if (drawerScore >= 70 && debtScore <= 40 && !hasIllusion) verdictTone = 'SAGLAM';
      else if (debtScore >= 80 || (drawerScore <= 30 && hasIllusion)) verdictTone = 'DIKKAT';

      const plainVerdict = verdictTone === 'SAGLAM'
        ? 'Çekmecesine peşin nakit giren, borç kamburu taşımayan sağlam omurgalı bir üretim kapısı.'
        : (verdictTone === 'DIKKAT'
          ? 'Vitrin büyüklüğüne aldanma; çekmecedeki nakit zayıf veya sırtındaki kredi faizi yükü ağır, temkinli dur.'
          : 'İşini sürdüren ancak hammadde ve nakit tahsilat hızını göz ucuyla izlemen gereken dengeli bir işletme.');

      return {
        cashInDrawer: { score0to100: drawerScore, statusLabel: drawerLabel, summary: drawerSummary },
        paperProfitIllusion: { isIllusionRisk: hasIllusion, severityLabel: hasIllusion ? 'Veresiye / Kağıt Kâr Uyarısı' : 'Gerçek Nakitle Uyumlu', summary: illusionSummary },
        cashCushion: { score0to100: cushionScore, label: cushionLabel, summary: cushionSummary },
        debtBurden: { score0to100: debtScore, label: debtLabel, summary: debtSummary },
        verdictTone,
        plainVerdict,
        crowdVsWhaleNote: crowdNote
      };
    }

    // B) Darphane Altın Sertifikası Özel Hava Parası Anatomisi
    if (asset.key === 'altin-sertifikasi') {
      const dInfo = kernel && kernel.getDarphanePremiumInfo ? kernel.getDarphanePremiumInfo() : { premiumPct: 14.34, diffTL: 878 };
      const pPct = Number(dInfo.premiumPct) || 14.3;
      const highAir = pPct >= 4.0;
      return {
        cashInDrawer: {
          score0to100: 45,
          statusLabel: 'Kira Üretmeyen Kağıt Fiş',
          summary: 'Altın doğası gereği kira veya kâr payı üretmez; yalnız değer saklar.'
        },
        paperProfitIllusion: {
          isIllusionRisk: highAir,
          severityLabel: highAir ? `+%${pPct} Hava Parası Şişkinliği` : 'Normal Makas',
          summary: lens === 'SAHA'
            ? `100 adet ALTIN.S1 maliyeti fiziki spot gram altından +%${pPct} (+${Math.round(dInfo.diffTL)} TL/gr) yukarıda işlem görüyor.`
            : `Çarşıdaki gerçek sarı külçeden yaklaşık yüzde ${pPct} daha pahalıya satılıyor; makas normale döndüğünde altın düşmese bile bu hava parası buharlaşabilir.`
        },
        cashCushion: { score0to100: 75, label: 'Hafta İçi Nakde Döner', summary: 'Pazar açıkken satılabilir ama nakit çekimi iki iş günü bekler.' },
        debtBurden: { score0to100: 0, label: 'Borçsuz Varlık', summary: 'Üzerinde kredi borcu yoktur, yalnız fiyat köpüğü riski vardır.' },
        verdictTone: highAir ? 'DIKKAT' : 'DENGELI',
        plainVerdict: highAir
          ? 'Aynı altını çarşıdaki sarraftan daha ucuza almak varken kağıt fişe fazladan hava parası ödeme.'
          : 'Çarşı altın fiyatına yakın seyrettiği dönemlerde küçük tutarlı birikim için kullanılabilir.',
        crowdVsWhaleNote: 'Küçük birikimciler kolay diye ekrandan hücum ettiğinde kağıt fişin fiyatı gerçek külçeden kopup şişiyor.'
      };
    }

    // C) Kira/Faiz/Nakit Kalkanları, Fiziki Metaller, Döviz ve Fonlar
    const isRate = Boolean(asset.isRateInstrument);
    const isZeroTaxShield = asset.key === 'kira-sertifikasi-sukuk' || asset.key === 'dibs-tahvil';
    const isMetal = asset.subVenue === 'PHYSICAL_METAL' || asset.key.includes('altin') || asset.key.includes('gumus');

    return {
      cashInDrawer: {
        score0to100: isRate ? 88 : (isMetal ? 65 : 60),
        statusLabel: isRate ? 'Her Gün Düzenli Nakit İşler' : 'Değer Saklama Aracı',
        summary: isRate
          ? `Yıllık brüt %${Number(asset.annualGrossRatePct || 42).toFixed(1)} oranında düzenli getiri biriktirir${asset.stopajPct > 0 ? ` (kazançtan %${asset.stopajPct} kesinti düşülür)` : ' ve kazançtan kesinti yapılmaz'}.`
          : 'Dükkân gibi aylık kira üretmez; paranın alım gücünü korumak veya küresel üretim sepetine ortak olmak için tutulur.'
      },
      paperProfitIllusion: {
        isIllusionRisk: isRate && (Number(asset.annualGrossRatePct) || 0) * (1 - (Number(asset.stopajPct) || 0) / 100) < 42,
        severityLabel: isZeroTaxShield ? 'Kesintisiz Net Kazanç' : 'Enflasyon Karşılaştırması Şart',
        summary: isRate
          ? 'Hesapta büyüyen rakamın tamamı kâr değildir; mutfak filesindeki yıllık pahalılık düşüldükten sonra kalan kısım gerçek kazançtır.'
          : 'Döviz ve emtiada TL rakamı artsa bile kendi para birimindeki pahalılığı da hesaba katmak gerekir.'
      },
      cashCushion: {
        score0to100: asset.key.startsWith('mevduat-') ? 52 : 86,
        label: asset.key.startsWith('mevduat-') ? 'Süre Dolmadan Bozulursa Yanar' : 'Acil Durumda Çevrilebilir',
        summary: asset.key.startsWith('mevduat-')
          ? 'Süresi dolmadan 1 gün bile önce bozarsan birikmiş tüm getiri sıfırlanır, eline sadece anapara döner.'
          : 'İş günlerinde kurye ve gişe saatine uyarak nakde rahatça çevrilebilir.'
      },
      debtBurden: {
        score0to100: asset.venue === 'VIOP' ? 95 : 5,
        label: asset.venue === 'VIOP' ? 'Yüksek Kaldıraç Riski' : 'Kredi Kamburu Yok',
        summary: asset.venue === 'VIOP'
          ? 'Küçük teminatla büyük pozisyon açıldığı için ters dalgada anaparan hızla eriyebilir.'
          : 'Sırtında banka kredisi faizi taşımayan yalın varlık.'
      },
      verdictTone: asset.venue === 'VIOP' ? 'DIKKAT' : (isZeroTaxShield || asset.key === 'gram-altin-spot' ? 'SAGLAM' : 'DENGELI'),
      plainVerdict: isZeroTaxShield
        ? 'Kazancından vergi dilimi kesilmeyen, kilerin acil ve orta vadeli kalkanı olmaya çok uygun sakin kapı.'
        : (asset.key === 'gram-altin-spot'
          ? 'Yüzyıllardır kimsenin borcu olmayan, doğru saatte dar makasla alındığında mutfak gücünü koruyan paslanmaz külçe.'
          : 'Gişe saatine, alım-satım makasına ve vergi kesintisine dikkat edilerek kilerde dengeli pay ayrılabilir.'),
      crowdVsWhaleNote: asset.venue === 'TWO_DOOR'
        ? 'Gece yarısı korku haberlerinde kalabalık nöbetçi banka ekranında geniş makas öderken, sakin esnaf sabah çarşı kepenginin açılmasını bekler.'
        : 'Manşetler en çok bağırdığında değil, kilerin ihtiyaç planına göre sakin günde ekleme yapmak her zaman üstündür.'
    };
  }

  function buildActionGuideAndEssence(asset, humanTitle, lens) {
    const clock = global.AetherKernelV10 && global.AetherKernelV10.getTurkishClock
      ? global.AetherKernelV10.getTurkishClock()
      : { bankSpreadPct: 0.65, bazaarSpreadPct: 0.40, tefasBeforeCutoff: true, bistCanMatchNow: true };

    const row = asset.bistRow || null;
    const arch = (row && SECTOR_WORKSHOP_ARCHETYPES[row.sector]) || null;

    let streetEssence = '';
    let upstream = arch ? arch.upstream.slice() : [
      'Ülke mutfağındaki aylık gıda ve kira pahalılığı',
      'Merkez kasasının belirlediği borçlanma maliyeti',
      'Hanelerin tasarruf eğilimi ve nakit ihtiyacı',
      'Küresel ticaret ve enerji koridoru dengesi'
    ];
    let whereToAct = '';
    let bestTimeWindow = '';
    let hiddenCutAndWaitRule = '';
    let amateurMistake = '';
    let steps = [];

    if (asset.venue === 'TWO_DOOR') {
      const isGold = !asset.key.startsWith('doviz-');
      streetEssence = isGold
        ? 'Kimsenin iflasıyla sıfırlanmayan, asırlardır el emeğini ve mutfak alım gücünü saklayan somut değer külçesidir. Kira vermez ama kağıt paranın erimesine karşı sessiz bir kalkandır.'
        : 'Uluslararası ticaret ve ithal malların fiyatlandığı yabancı ülke banknotudur. Tek başına üretim yapmaz; yalnız kur farkını taşır.';
      upstream = isGold
        ? [
          'Dünya merkez kasalarının tonlarca külçe alımları',
          'Yurt içi düğün sezonu ve yastık altı sarraf talebi',
          'Küresel faiz oranları ile dolar kurunun bileşkesi',
          'Gece ve gündüz arasındaki gişe makası farkı'
        ]
        : [
          'Ülkenin ihracat döviz girişi ile enerji ithalatı faturası',
          'Yurt içi ve yurt dışı faiz makası',
          'Yaz aylarındaki turizm döviz kasası girişi',
          'Banka ekranı ile çarşı gişesi arasındaki makas'
        ];
      whereToAct = lens === 'SAHA'
        ? 'Kapalıçarşı / Güvenilir Sarraf Fiziki Gişesi (%0 BSMV, ~%0,40 makas) veya Hafta İçi Gündüz Banka Hazine Ekranı'
        : 'Taş Han / Çarşı sarraf gişesi ya da hafta içi gündüz açık olan banka ekranı';
      bestTimeWindow = 'Pazartesi–Cuma 10:00 ile 17:00 arası (Çarşı ve banka gişelerinin ikisi de açıkken makas en dardır; şu an banka makası %' + clock.bankSpreadPct.toFixed(2) + ').';
      hiddenCutAndWaitRule = lens === 'SAHA'
        ? 'Mobil bankadan alımda binde 2 (%0,20) kambiyo BSMV kesilir ve mesai dışında makas %3,60’a açılır; Kapalıçarşı fiziki gişede kambiyo vergisi %0’dır.'
        : 'Banka ekranından alırken her 100.000 TL’de 200 TL peşin işlem kesintisi alınır ve gece makas 6 kat açılır; çarşı sarrafında bu kesinti yoktur.';
      amateurMistake = 'Gece 23:00’te sosyal medyada korkutucu bir haber görüp nöbetçi banka ekranından yüzde 3,60 makasla panik alımı yapmak.';
      steps = [
        'Gece 18:00’den sonra ve hafta sonu banka ekranından asla al-sat tuşuna basma.',
        'Alım yapmadan önce alış ile satış fiyatı arasındaki farkı yüzdeye vur; yüzde 1’in üzerindeyse bekle.',
        isGold ? 'İşçilikli takı yerine işçiliksiz 24 ayar külçe veya standart darphane sikkesini tercih et.' : 'Kısa vadeli al-sat yerine yalnız gerçek döviz harcama ihtiyacın için tut.'
      ];
    } else if (asset.venue === 'TEFAS' || asset.venue === 'BANK_RATE') {
      const isTerm = asset.subVenue === 'TERM_DEPOSIT';
      const noTax = asset.stopajPct === 0;
      streetEssence = isTerm
        ? 'Paranı bankaya belirli bir gün sayısı boyunca kilitleyip karşılığında önceden belli bir getiri aldığın anlaşmadır. Süre dolmadan dokunursan tüm birikmiş getiri yanar.'
        : (noTax
          ? 'Devletin varlıklarına dayalı, kazancından tek kuruş vergi dilimi kesilmeyen ve iş günlerinde kurye saatine uyarak bozulabilen kira kalkanıdır.'
          : 'Acil kavanoz paranın gecelik nemalandığı, sabah kurye saatinden önce bozduğunda aynı gün eline geçen nakit havuzudur.');
      whereToAct = lens === 'SAHA'
        ? (isTerm ? 'Banka Vadeli Mevduat / Katılım Ekranı' : 'Banka Yatırım Fonları (TEFAS / Kurucu Fon) Menüsü')
        : 'Kullandığın bankanın günlük birikim veya kira kalkanı ekranı';
      bestTimeWindow = isTerm
        ? 'Hafta içi 09:30–16:30 arası (En az 3 farklı bankanın oranını karşılaştırarak).'
        : 'Hafta içi sabah 09:30 ile öğlen 13:20 arası (13:30 kuryesi kalkmadan önce emir verirsen gün kaybı yaşamazsın).';
      hiddenCutAndWaitRule = noTax
        ? 'Kazançtan vergi kesintisi sıfırdır (%0). Öğlen 13:30 kuryesini kaçırırsan emrin 1 iş günü sonraya sarkar.'
        : `Elde edilen brüt kazancın %${asset.stopajPct} kadarı otomatik kesilir${isTerm ? '; vadeden 1 gün bile erken bozarsan tüm faiz sıfırlanır' : ''}.`;
      amateurMistake = isTerm
        ? 'Evin tüm nakdini 92 günlük vadeliye kilitleyip, 20. gün kombi bozulunca vadeyi bozarak birikmiş bütün faizi yakmak.'
        : 'Cuma öğleden sonra 14:30’da bozum emri verip paranın Pazartesi gününe kadar kilitli kalacağını unutmak.';
      steps = [
        'Acil 1 aylık ev faturası payını asla uzun süreli kilitli vadeye bağlama; günlük bozulabilen kavanozda tut.',
        'Orta vadeli TL kalkanında vergi kesintisi olmayan kira sertifikası ile kesintili hesabı net ele geçen tutarla kıyasla.',
        'Fon alım-satımını mutlaka hafta içi 13:20’den önce tamamla.'
      ];
    } else if (asset.venue === 'BIST') {
      streetEssence = row
        ? `${humanTitle}, gerçek hayatta mal veya hizmet üretip satan yaşayan bir işletmedir. Ortak olduğunda ekrandaki çizgiye değil, bu işletmenin kasasına giren gerçek nakde ve fabrikasının çarkına ortak olursun.`
        : (asset.key === 'altin-sertifikasi'
          ? 'Darphane tarafından çıkarılan ve her biri 0,01 gram altını temsil eden kağıt paydır; ancak talep coştuğunda gerçek gram altından çok daha pahalıya satılabilir.'
          : 'Birden fazla büyük şirketi veya emtiayı tek sepette toplayan ortaklık payıdır.');
      whereToAct = lens === 'SAHA'
        ? 'Banka veya Aracı Kurum Pay Piyasası (BIST) Emir Ekranı — Limit Emir'
        : 'Bankanın veya yatırım kuruluşunun şirket ortaklık gişesi (Fiyat Sınırlı Emir seçerek)';
      bestTimeWindow = 'Hafta içi 10:10 ile 17:50 arası (Sabah 10:00 ilk açılış karmaşası yatıştıktan sonra, kapanış karanlık odasından önce).';
      hiddenCutAndWaitRule = lens === 'SAHA'
        ? (asset.stopajPct > 0
          ? `Bu BYF/ürün satış kârında %${asset.stopajPct} stopaja tabidir ve sattıktan sonra nakit çekimi T+2 (2 iş günü) takas süresine tabidir.`
          : 'Pay senedi alım-satım kazancında stopaj %0’dır (dağıtılan temettüde %15); ancak satış yaptığında para T+2 (2 iş günü) takas kum saatinden önce banka hesabına çekilemez!')
        : (asset.stopajPct > 0
          ? `Kazancın yüzde ${asset.stopajPct} dilimi kesilir ve sattığın gün parayı eline alıp çıkamazsın; kurye takası tam 2 iş günü sürer.`
          : 'Alım-satım kazancından vergi kesilmez ama bugün satsan bile paranı nakit çekmek için tam 2 iş günü (Cuma satarsan Salı sabahı!) beklemek zorundasın.');
      amateurMistake = 'Sosyal medyada tavan giden veya süslü başlık atan dükkânın peşinden "Piyasa Emri" ile en tepeden atlamak ya da Cuma günü satıp aynı gün kira ödeyebileceğini sanmak.';
      steps = [
        'Emir verirken "Piyasa Emri" yerine mutlaka ödemeye razı olduğun rakamı yazdığın "Limit (Fiyat Sınırlı) Emir" seç.',
        'Önümüzdeki 6 ay içinde kira, okul veya borç için lazım olacak parayla şirket payı alma.',
        'Almadan önce vitrindeki kâra değil, çekmeceye giren gerçek nakde ve sırtındaki kredi borcuna bak.'
      ];
    } else if (asset.venue === 'GLOBAL_USD') {
      streetEssence = 'Yurt dışında dolar bazında çalışan küresel fabrika veya hammadde sepetidir. Dünya üretimine ortak eder ancak kazancın vergi beyanı kuralı Türkiye içindeki paylardan farklıdır.';
      whereToAct = lens === 'SAHA'
        ? 'Yurt Dışı Piyasalar (ABD Borsaları) Erişimli Aracı Kurum / Banka Ekranı'
        : 'Yurt dışı şirket gişesi açık olan yatırım hesabı';
      bestTimeWindow = 'Hafta içi Türkiye saatiyle 16:45 – 22:45 arası (Amerika pazarı açıkken makas en dardır).';
      hiddenCutAndWaitRule = lens === 'SAHA'
        ? 'Otomatik stopaj yoktur; satış kârında alış-satış arası Yİ-ÜFE artışı %10’u aşarsa TL maliyet endekslenir, kalan reel kâr ertesi yıl Mart ayında GVK Mükerrer 80 kapsamında beyan edilir.'
        : 'Banka otomatik vergi kesmez; satış yaptığında üretici maliyet artışının üzerindeki gerçek kazancını ertesi yıl Mart ayında kendin vergi dairesine bildirirsin.';
      amateurMistake = 'Hem döviz alırken geniş makas ödemek hem de yurt dışı satış kazancının vergisiz olduğunu sanıp Mart ayı beyan kuralını unutmak.';
      steps = [
        'Döviz dönüşümünü gece değil hafta içi gündüz dar makas saatinde yap.',
        'Küçük parçalı sık al-sat yapma; komisyon ve beyan yükü birikimi kemirir.',
        'Alış tarihindeki dolar kurunu ve TL tutarını bir kenara not et.'
      ];
    } else {
      streetEssence = asset.venue === 'CRYPTO_24_7'
        ? 'Gece gündüz hiç kapanmayan, arkasında fabrika veya kira geliri bulunmayan yüksek dalgalı dijital kasa kaydıdır.'
        : 'Kilerin genel alım gücünü ve konut/emeklilik dengesini ölçmeye yarayan uzun vadeli mihenk taşıdır.';
      whereToAct = asset.venue === 'CRYPTO_24_7' ? 'Kayıtlı ve yerel banka bağlantılı dijital varlık gişesi' : 'Uzun vadeli birikim ve mülk karşılaştırma masası';
      bestTimeWindow = 'Sakin, habersiz ve panik olmayan gündüz saatleri.';
      hiddenCutAndWaitRule = 'Yüksek fiyat sıçramalarında emir tahtası açılır; borç parayla veya kilerin ana direğiyle girilmez.';
      amateurMistake = 'Komşunun hızlı kazanç hikâyesini duyup evin acil rızkını en coşkulu tepede tek kalemde yatırmak.';
      steps = [
        'Toplam kilerinin yüzde 5-10’undan fazlasını yüksek dalgalı kapılara ayırma.',
        'Gece uykunu kaçıracak büyüklükte tutarlarla işlem yapma.',
        'Her zaman önce 3 aylık acil nakit kavanozunu doldur.'
      ];
    }

    return {
      streetEssence,
      upstreamRawMaterials: upstream,
      realLifeActionGuide: {
        whereToAct,
        bestTimeWindow,
        hiddenCutAndWaitRule,
        amateurMistake,
        steps
      }
    };
  }

  function describeAssetForHuman(assetKeyOrObj, lensOverride) {
    const lens = lensOverride ? normalizeLens(lensOverride) : getLanguageLens();
    const asset = resolveKernelAsset(assetKeyOrObj);
    if (!asset) return null;

    const row = asset.bistRow || null;
    const baseHumanTitle = row
      ? buildDynamicBistTitle(asset, row)
      : (BESPOKE_TITLES[asset.key] || BESPOKE_TICKER_TITLES[asset.ticker] || cleanCompanyRootName(asset.name, asset.ticker));

    let displayTitle = baseHumanTitle;
    if (lens === 'KOPRU') {
      const cleanOfficial = sanitizeSokakText(asset.name || asset.ticker);
      displayTitle = baseHumanTitle.includes(cleanOfficial)
        ? baseHumanTitle
        : `${baseHumanTitle} — ${asset.ticker}`;
    } else if (lens === 'SAHA') {
      displayTitle = `${asset.ticker} · ${asset.name} (${baseHumanTitle})`;
    }

    const anatomy = buildVisualCashAnatomy(asset, lens);
    const guidePack = buildActionGuideAndEssence(asset, baseHumanTitle, lens);
    const meta = LENS_META[lens] || LENS_META.SOKAK;

    const result = {
      lens,
      lensTitle: meta.title,
      humanTitle: displayTitle,
      everydayName: baseHumanTitle,
      title: displayTitle,
      workshopKind: row ? (SECTOR_WORKSHOP_ARCHETYPES[row.sector]?.placeNoun || 'Üretim Atölyesi') : 'Birikim Kapısı',
      streetEssence: guidePack.streetEssence,
      visualCashAnatomy: anatomy,
      upstreamRawMaterials: guidePack.upstreamRawMaterials,
      realLifeActionGuide: guidePack.realLifeActionGuide
    };

    if (lens !== 'SOKAK') {
      result.officialTicker = asset.ticker;
      result.officialKey = asset.key;
      result.officialName = asset.name;
    }

    return lens === 'SOKAK' ? deepSanitizeSokak(result) : result;
  }

  // --------------------------------------------------------------------------
  // 4. SEKİZ GERÇEK HAYAT TÜRKİYE FİNANS TATBİKATI (ETKİLEŞİMLİ SİMÜLATÖRLER)
  // --------------------------------------------------------------------------
  const DRILLS_RAW_CATALOG = [
    {
      id: 'maas-gunu-sinavi',
      order: 1,
      title: "Ayın 15'i Maaş Masası ve 19. Gün Kombi Sınavı",
      subtitle: 'Maaşı 5 kavanoza dağıt; 4 gün sonra kombi kartı yandığında ek hesap borç sarmalı ile acil kavanoz farkını yaşa.',
      lifeLesson: 'Yatırım hisse seçmekle değil, kış ortası kombi bozulduğunda kimseye ve ek hesaba el açmayacak 1 aylık acil kavanozla başlar.'
    },
    {
      id: 'gece-yarisi-makas',
      order: 2,
      title: 'Gece 23:20 Korkutucu Haber ve Sabah Kepengi',
      subtitle: 'Gece nöbetçi banka ekranındaki %3,60 makas + kesinti ile sabah 10:00 Taş Han sarrafının dar makasını gram gram kıyasla.',
      lifeLesson: 'Korku haberleri gece yarısı yayılır; kepenk kapalıyken basılan her panik tuşu birikiminden peşin gram tıraşlar.'
    },
    {
      id: 'iki-dukkan-sirri',
      order: 3,
      title: 'İsimsiz İki Dükkân: Parlak Vitrin mi, Dolu Çekmece mi?',
      subtitle: '24 ay ileri sararak veresiye defteri kabarık parlak mağaza ile akşamdan akşama peşin çalışan mahalle marketini izle.',
      lifeLesson: 'Defterde yazan kâr karın doyurmaz; dükkânı ayakta tutan şey akşam çekmeceye giren peşin nakittir.'
    },
    {
      id: 'kurakliktan-tencereye',
      order: 4,
      title: 'Kuraklıktan Tencereye: 6 Aylık Dalga Simülatörü',
      subtitle: 'Baraj suyunu ve kamyon mazotunu değiştir; 1. ay tarla, 3. ay fabrika ve 6. ay mutfak tenceresi gecikmesini gör.',
      lifeLesson: 'Mutfaktaki etiket sürpriz değildir; 6 ay önce barajdaki su ve kamyondaki mazot ne dediyse tencereye o gelir.'
    },
    {
      id: 'borcla-yola-cikmak',
      order: 5,
      title: 'Borçla Yola Çıkmak: Kendi Paran vs 2 Kat Kredi Yükü',
      subtitle: 'Geçici bir fırtınada aylık kredi faizi kemirmesinin ve uykusuzluğun insanı nasıl en dipte zorunlu satışa mecbur bıraktığını dene.',
      lifeLesson: 'Kendi parasıyla yürüyen fırtınada ıslanır ama kurur; borçla yürüyen güneş açmadan masadan silinir.'
    },
    {
      id: 'kap-haberi-okuma',
      order: 6,
      title: 'Süslü Başlık mı, Gerçek Sipariş mi? 4 Katmanlı Büyüteç',
      subtitle: '“Görüşmelere başlandı” manşetiyle kesinleşmiş avanslı döviz siparişini 4 katmanlı büyüteç altında yan yana incele.',
      lifeLesson: 'Niyet mektubu kasaya para sokmaz; cümledeki fiile, peşin avansa ve ortakların pay satıp satmadığına bak.'
    },
    {
      id: 'gorunmez-vergi-makas',
      order: 7,
      title: '5 Yıllık Kiler Sızıntısı: Erken Bozma, Kesinti ve Hava Parası',
      subtitle: 'Erken bozulan vade, vergi kesintili vade ve +%14,5 hava paralı kağıt fiş ile kesintisiz kira kalkanının 5 yıllık farkını ölç.',
      lifeLesson: 'Küçük görünen kesintiler, erken bozulan vadeler ve hava paraları 5 yılda koca bir yıllık mutfak rızkını sessizce eritir.'
    },
    {
      id: 'ozgurluk-kileri-insasi',
      order: 8,
      title: "12'den 60 Aya Evin Özgürlük Kileri İnşası",
      subtitle: 'Evin aylık faturası ve düzenli tasarrufla 3 ay nefes, 12 ay dik duruş ve 60 aylık aile bağımsızlığı kilerini adım adım kur.',
      lifeLesson: 'Gerçek zenginlik başkasına gösterilen eşya değil, ailenin kaç ay boyunca kimseye muhtaç olmadan huzurla yaşayabildiğidir.'
    }
  ];

  function getDrillsCatalog(lensOverride) {
    const lens = lensOverride ? normalizeLens(lensOverride) : getLanguageLens();
    return DRILLS_RAW_CATALOG.map((d) => {
      const item = {
        ...d,
        practiced: Boolean(wisdomState.practicedDrills[d.id]),
        practicedAt: wisdomState.practicedDrills[d.id] || null
      };
      return lens === 'SOKAK' ? deepSanitizeSokak(item) : item;
    });
  }

  function fmtTL(n) {
    return Math.round(Number(n) || 0).toLocaleString('tr-TR') + ' TL';
  }

  function createDefaultLabInputs(member) {
    const baseExp = Math.max(15000, Number(member && member.monthlyExpenseTL) || 35000);
    return {
      // 1. Maaş günü
      salaryTL: 45000,
      jarBillsPct: 55,
      jarEmergPct: 22,
      jarLongPct: 13,
      jarJoyPct: 10,
      // 2. Gece yarısı makas
      nightAmountTL: 100000,
      morningMovePct: 0.4,
      // 3. İki dükkân
      shopMonth: 18,
      tightCreditWinter: true,
      // 4. Kuraklıktan tencereye
      damLevelPct: 28,
      dieselJumpPct: 32,
      waveStage: 3,
      // 5. Borçla yola çıkmak
      ownEquityTL: 100000,
      debtMult: 1.0,
      stormDropPct: 32,
      stormMonths: 5,
      // 6. KAP haberi büyüteç
      openLayers: { 1: true, 2: false, 3: false, 4: false },
      // 7. 5 Yıllık vergi/makas
      pantryStartTL: 200000,
      annualGrossPct: 44,
      earlyBreaksPerYear: 1,
      pantryYears: 5,
      // 8. Özgürlük kileri
      householdBillTL: baseExp,
      currentSavedTL: 105000,
      monthlySaveTL: Math.max(3000, Math.round(baseExp * 0.28)),
      realReturnPct: 4.5
    };
  }

  function mountRealLifeLab(containerEl, initialDrillId) {
    if (!containerEl) return null;
    injectHumanWisdomStyles();

    const kernel = global.AetherKernelV10;
    const member = kernel && kernel.getActiveMember ? kernel.getActiveMember() : null;
    const inputs = createDefaultLabInputs(member);

    if (initialDrillId && DRILLS_RAW_CATALOG.some((d) => d.id === initialDrillId)) {
      wisdomState.activeDrillId = initialDrillId;
    }

    function lensText(sokakStr, kopruStr, sahaStr) {
      const l = getLanguageLens();
      if (l === 'SAHA') return sahaStr || kopruStr || sokakStr;
      if (l === 'KOPRU') return kopruStr || sokakStr;
      return sanitizeSokakText(sokakStr);
    }

    function renderDrillBody(drillId) {
      const l = getLanguageLens();

      // ----------------------------------------------------------------------
      // TATBİKAT 1: MAAŞ GÜNÜ VE 19. GÜN KOMBİ ARIZASI
      // ----------------------------------------------------------------------
      if (drillId === 'maas-gunu-sinavi') {
        const totalPct = inputs.jarBillsPct + inputs.jarEmergPct + inputs.jarLongPct + inputs.jarJoyPct;
        const norm = totalPct > 0 ? 100 / totalPct : 1;
        const billsTL = Math.round(inputs.salaryTL * (inputs.jarBillsPct * norm) / 100);
        const emergTL = Math.round(inputs.salaryTL * (inputs.jarEmergPct * norm) / 100);
        const longTL = Math.round(inputs.salaryTL * (inputs.jarLongPct * norm) / 100);
        const joyTL = Math.max(0, inputs.salaryTL - billsTL - emergTL - longTL);

        const boilerCostTL = 9500;
        const shortfallTL = Math.max(0, boilerCostTL - emergTL);
        // Kredi kartı asgari / Ek hesap (KMH) 6 aylık bileşik faiz + vergi yükü (~aylık %5,25 vergi dahil maliyet)
        let debtRemain = shortfallTL;
        let totalInterestPaid = 0;
        for (let m = 0; m < 6; m++) {
          if (debtRemain <= 0) break;
          const mInt = debtRemain * 0.0525;
          totalInterestPaid += mInt;
          // Yalnız asgari ödeme yapıldığında anapara yavaş erir
          debtRemain = debtRemain * 0.84 + mInt * 0.25;
        }
        const totalBoilerBurdenTL = boilerCostTL + Math.round(totalInterestPaid);
        const calmCovered = shortfallTL === 0;

        return `
          <div class="hwb-grid-2">
            <div class="hwb-subtle-box">
              <div style="font-weight:700;margin-bottom:8px;">Ayın 15'i Maaş Masası Dağıtımı</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
                <button type="button" class="hwb-action-btn" data-preset="zero-emerg">Acil Kavanoz Yok (%0)</button>
                <button type="button" class="hwb-action-btn" data-preset="locked-all">Hepsi Kilitli Vadede</button>
                <button type="button" class="hwb-action-btn is-primary" data-preset="balanced">Sağlam 5 Kavanoz Dengesi</button>
              </div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Eve Giren Aylık Maaş</span><strong>${fmtTL(inputs.salaryTL)}</strong></div>
                <input class="hwb-slider" type="range" min="25000" max="150000" step="2500" data-field="salaryTL" value="${inputs.salaryTL}">
              </div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>1. Kira, Fatura ve Mutfak Filesi</span><strong>${fmtTL(billsTL)}</strong></div>
                <input class="hwb-slider" type="range" min="35" max="85" step="1" data-field="jarBillsPct" value="${inputs.jarBillsPct}">
              </div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>2. Acil Tamir ve Nefes Kavanozu (Günlük Hazır)</span><strong>${fmtTL(emergTL)}</strong></div>
                <input class="hwb-slider" type="range" min="0" max="40" step="1" data-field="jarEmergPct" value="${inputs.jarEmergPct}">
              </div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>3. Uzun Vadeli Üretim ve Kiler Payı</span><strong>${fmtTL(longTL)}</strong></div>
                <input class="hwb-slider" type="range" min="0" max="40" step="1" data-field="jarLongPct" value="${inputs.jarLongPct}">
              </div>
              <div style="font-size:12.5px;color:var(--ink-500);">4. Çay, Çocuk ve Soluklanma Payı: <strong>${fmtTL(joyTL)}</strong></div>
            </div>

            <div class="hwb-subtle-box">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <strong>Ayın 19'u Akşamı: Kombi Anakartı Yandı (9.500 TL)</strong>
                <span class="hwb-pill ${calmCovered ? 'hwb-tone-good' : 'hwb-tone-bad'}">${calmCovered ? 'Sıfır Borçla Çözüldü' : 'Ek Hesap Sarmalı Başladı'}</span>
              </div>
              <p style="font-size:13.5px;margin:6px 0 12px;">
                ${calmCovered
                  ? lensText(
                    `Acil kavanozunda ${fmtTL(emergTL)} hazır beklediği için ustaya 9.500 TL peşin ödendi. Ne uzun vadeli kilerin bozuldu ne de bankaya tek kuruş faiz ödendi. Kavanozda hâlâ ${fmtTL(emergTL - boilerCostTL)} nefes payı duruyor.`,
                    `Acil kavanozundaki hazır bakiye (${fmtTL(emergTL)}) kombi faturasını peşin kapattı. Kredi kartı asgari ödeme veya KMH (Ek Hesap) faizine hiç bulaşılmadı.`,
                    `Günlük likit acil fon (${fmtTL(emergTL)}) 9.500 TL şoku sıfır borçlanma maliyetiyle emdi; uzun vadeli bileşik getiri pozisyonları bozulmadı.`
                  )
                  : lensText(
                    `Acil kavanozunda yalnız ${fmtTL(emergTL)} olduğu için kalan ${fmtTL(shortfallTL)} açık ek hesap ve kart asgari ödemesine kaldı. 6 ay boyunca işleyen faiz ve vergi yüzünden 9.500 TL'lik kombi sana toplam ${fmtTL(totalBoilerBurdenTL)}'ye mal oldu!`,
                    `Acil kavanoz ${fmtTL(shortfallTL)} eksik kaldı. Kredi kartı asgari ödeme ve KMH (Ek Hesap) sarmalında 6 ayda fazladan ${fmtTL(totalInterestPaid)} faiz+vergi ödedin.`,
                    `${fmtTL(shortfallTL)} nakit açığı KMH / kredi kartı akdi faizi + KKDF + BSMV yüküyle 6 ayda +${fmtTL(totalInterestPaid)} ek finansman gideri üretti; toplam maliyet ${fmtTL(totalBoilerBurdenTL)}.`
                  )}
              </p>
              <div style="font-size:13px;border-top:1px solid var(--border-stone);padding-top:10px;">
                <div>Acil Kavanozla Peşin Ödeyenin Toplam Faturası: <strong>9.500 TL</strong></div>
                <div style="margin-top:4px;color:var(--crimson-700);">Hazırlıksız Yakalananın 6 Aylık Gerçek Faturası: <strong>${fmtTL(totalBoilerBurdenTL)}</strong></div>
              </div>
            </div>
          </div>
        `;
      }

      // ----------------------------------------------------------------------
      // TATBİKAT 2: GECE YARISI 23:20 HABERİ VE SABAH 10:00 TAŞ HAN KEPENGİ
      // ----------------------------------------------------------------------
      if (drillId === 'gece-yarisi-makas') {
        const dInfo = kernel && kernel.getDarphanePremiumInfo ? kernel.getDarphanePremiumInfo() : { spotGramPrice: 6125.57 };
        const baseGramTL = Number(dInfo.spotGramPrice) || 6125.57;
        const amt = inputs.nightAmountTL;

        // Kapı 1: Gece 23:20 Mobil Banka (%3,60 makas -> yarı makas alışta +%1,80 + binde 2 kesinti, anında bozsan toplam %3,80 erime)
        const nightAskTL = baseGramTL * (1 + 0.036 / 2);
        const nightTaxTL = amt * 0.002;
        const nightGrams = (amt - nightTaxTL) / nightAskTL;

        // Sabah 10:00 gerçek fiyat değişimi sonrası baz gram
        const morningSpotTL = baseGramTL * (1 + inputs.morningMovePct / 100);
        // Kapı 2: Sabah 10:00 Taş Han / Kapalıçarşı Sarrafı (%0,40 toplam makas -> alışta +%0,20, %0 kesinti)
        const bazaarAskTL = morningSpotTL * (1 + 0.004 / 2);
        const bazaarGrams = amt / bazaarAskTL;

        // Kapı 3: Sabah 10:30 Gündüz Banka (%0,65 makas + binde 2 kesinti)
        const dayBankAskTL = morningSpotTL * (1 + 0.0065 / 2);
        const dayBankGrams = (amt - nightTaxTL) / dayBankAskTL;

        const gramDiff = bazaarGrams - nightGrams;
        const tlAdvantage = Math.round(gramDiff * morningSpotTL);

        return `
          <div class="hwb-grid-2">
            <div class="hwb-subtle-box">
              <div style="font-weight:700;margin-bottom:8px;">Gece 23:20 Sosyal Medya Korku Başlığı</div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Alım Yapılacak Birikim</span><strong>${fmtTL(amt)}</strong></div>
                <input class="hwb-slider" type="range" min="20000" max="500000" step="10000" data-field="nightAmountTL" value="${amt}">
              </div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Sabah 10:00'da Gerçek Fiyat Değişimi</span><strong>${inputs.morningMovePct >= 0 ? '+' : ''}%${inputs.morningMovePct.toFixed(1)}</strong></div>
                <input class="hwb-slider" type="range" min="-2.0" max="4.0" step="0.2" data-field="morningMovePct" value="${inputs.morningMovePct}">
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
                <button type="button" class="hwb-action-btn" data-morn="-0.8">Sabah Sönen Dedikodu (-%0,8)</button>
                <button type="button" class="hwb-action-btn" data-morn="0.5">Normal Sabah (+%0,5)</button>
                <button type="button" class="hwb-action-btn" data-morn="2.2">Sert Sabah Artışı (+%2,2)</button>
              </div>
            </div>

            <div class="hwb-subtle-box">
              <div style="font-weight:700;margin-bottom:10px;">Keseye Giren Gerçek Külçe Karşılaştırması</div>
              <div style="font-size:13.5px;display:grid;gap:8px;">
                <div style="padding:8px 10px;border-radius:10px;background:var(--crimson-soft);">
                  <strong>1. Gece 23:20 Panik Banka Ekranı:</strong> ${nightGrams.toFixed(2)} gram
                  <div style="font-size:12px;color:var(--crimson-700);">Geniş gece makası (%3,60) + ${fmtTL(nightTaxTL)} peşin kesinti</div>
                </div>
                <div style="padding:8px 10px;border-radius:10px;background:var(--bg-card);border:1px solid var(--border-stone);">
                  <strong>2. Sabah 10:30 Gündüz Banka Ekranı:</strong> ${dayBankGrams.toFixed(2)} gram
                  <div style="font-size:12px;color:var(--ink-500);">Gündüz makası (%0,65) + ${fmtTL(nightTaxTL)} kesinti</div>
                </div>
                <div style="padding:8px 10px;border-radius:10px;background:var(--teal-soft);">
                  <strong>3. Sabah 10:00 Taş Han Sarraf Gişesi:</strong> ${bazaarGrams.toFixed(2)} gram
                  <div style="font-size:12px;color:var(--teal-700);">Dar esnaf makası (%0,40) + 0 TL vergi kesintisi</div>
                </div>
              </div>
              <p style="font-size:13px;margin:10px 0 0;">
                ${gramDiff >= 0
                  ? `Sabah altın +%${Math.max(0, inputs.morningMovePct).toFixed(1)} yükselmiş olsa bile, gece panik yapmayıp sabah çarşı kepengini bekleyen kişi <strong>+${gramDiff.toFixed(2)} gram (${fmtTL(tlAdvantage)})</strong> daha fazla altın aldı!`
                  : `Ancak bir gecede %2'nin üzerinde olağanüstü bir kopuş olduğunda gece alımı başa baş gelebildi; yüz gecenin doksan sekizinde nöbetçi makas birikimi kemirir.`}
              </p>
            </div>
          </div>
        `;
      }

      // ----------------------------------------------------------------------
      // TATBİKAT 3: İSİMSİZ İKİ DÜKKÂN (PARLAK VİTRİN VS DOLU ÇEKMECE)
      // ----------------------------------------------------------------------
      if (drillId === 'iki-dukkan-sirri') {
        const m = inputs.shopMonth;
        const rateDrag = inputs.tightCreditWinter ? 1.0 : 0.45;
        // A Dükkânı: Vitrin kârı artıyor gibi görünür ama çekmece her ay eksi yazar, 15. aydan sonra kredi duvarına çarpar
        const shopAPaperProfit = Math.round(18 * m);
        const shopACashDrawer = Math.round(20 - m * (7.5 * rateDrag));
        const shopARealPantry = Math.max(28000, Math.round(100000 * (m <= 9 ? (1 + m * 0.025) : (1.22 - (m - 9) * 0.055 * rateDrag))));

        // B Dükkânı: Gösterişsiz peşin market, her akşam kasa artıda, borçsuz bileşik büyüme
        const shopBPaperProfit = Math.round(11 * m);
        const shopBCashDrawer = Math.round(25 + m * 13.5);
        const shopBRealPantry = Math.round(100000 * Math.pow(1.021, m));

        return `
          <div>
            <div class="hwb-subtle-box" style="margin-bottom:12px;">
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Zamanı İleri Sar: <strong>${m}. Ay</strong> (24 Aylık Yolculuk)</span><span>Başlangıç: 100.000 TL Alım Gücü</span></div>
                <input class="hwb-slider" type="range" min="1" max="24" step="1" data-field="shopMonth" value="${m}">
              </div>
              <div style="display:flex;gap:8px;align-items:center;">
                <button type="button" class="hwb-action-btn ${inputs.tightCreditWinter ? 'is-primary' : ''}" data-credit="winter">Sıkı Faiz Kışı (Pahalı Kredi)</button>
                <button type="button" class="hwb-action-btn ${!inputs.tightCreditWinter ? 'is-primary' : ''}" data-credit="spring">Ucuz Kredi Havası</button>
              </div>
            </div>
            <div class="hwb-grid-2">
              <div class="hwb-subtle-box" style="border-color:${shopACashDrawer < 0 ? '#fecaca' : 'var(--border-stone)'};">
                <strong>A Dükkânı: Parlak Vitrinli Hızlı Mağaza</strong>
                <div style="font-size:13px;margin-top:8px;display:grid;gap:5px;">
                  <div>Defterde Yazan Vitrin Kârı: <strong>+${shopAPaperProfit} Birim</strong></div>
                  <div style="color:${shopACashDrawer < 0 ? 'var(--crimson-700)' : 'inherit'};">Çekmecedeki Gerçek Nakit: <strong>${shopACashDrawer} Birim</strong> (180 gün veresiye!)</div>
                  <div>24 Aylık Gerçek Alım Gücü Karşılığı: <strong>${fmtTL(shopARealPantry)}</strong></div>
                </div>
                <p style="font-size:12.5px;color:var(--ink-700);margin-top:8px;">
                  ${m < 10
                    ? 'İlk aylarda herkes "Satışlar uçuyor!" diye alkışlıyor ama malın parası henüz müşteriden tahsil edilmedi.'
                    : '12. aydan sonra veresiye alacaklar dönmeyip banka kredi faizi kapıya dayanınca parlak vitrin ortaklarından bedelli para istemek zorunda kaldı!'}
                </p>
              </div>
              <div class="hwb-subtle-box" style="border-color:#99f6e4;">
                <strong>B Dükkânı: Sessiz Köşe Başı Peşin Marketi</strong>
                <div style="font-size:13px;margin-top:8px;display:grid;gap:5px;">
                  <div>Defterde Yazan Mütevazı Kâr: <strong>+${shopBPaperProfit} Birim</strong></div>
                  <div style="color:var(--teal-700);">Çekmecedeki Gerçek Nakit: <strong>+${shopBCashDrawer} Birim</strong> (Akşam peşin kasa!)</div>
                  <div>Gerçek Alım Gücü Karşılığı: <strong>${fmtTL(shopBRealPantry)}</strong></div>
                </div>
                <p style="font-size:12.5px;color:var(--ink-700);margin-top:8px;">
                  Hiç süslü manşet atmadı; ekmeği ve peyniri peşin satıp toptancıya vadeli ödedi, kasadaki nakitle yeni şubeler açarak ortaklarının kilerini büyüttü.
                </p>
              </div>
            </div>
          </div>
        `;
      }

      // ----------------------------------------------------------------------
      // TATBİKAT 4: KURAKLIKTAN TENCEREYE (6 AYLIK GECİKMELİ DALGA)
      // ----------------------------------------------------------------------
      if (drillId === 'kurakliktan-tencereye') {
        const droughtSeverity = Math.max(0, (65 - inputs.damLevelPct) * 0.75);
        const logisticsPush = inputs.dieselJumpPct * 0.55;
        const m1FarmShock = Math.round(droughtSeverity + logisticsPush * 0.4);
        const m3FactoryShock = Math.round(droughtSeverity * 0.85 + logisticsPush * 0.85 + 6);
        const m6KitchenShock = Math.round(droughtSeverity * 0.95 + logisticsPush * 1.05 + 11);

        return `
          <div class="hwb-grid-2">
            <div class="hwb-subtle-box">
              <div style="font-weight:700;margin-bottom:8px;">Toprak ve Yol Kaynağını Ayarla</div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Baraj Doluluk Oranı</span><strong>%${inputs.damLevelPct}</strong></div>
                <input class="hwb-slider" type="range" min="15" max="85" step="1" data-field="damLevelPct" value="${inputs.damLevelPct}">
              </div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Kamyon Mazot Maliyeti Artışı</span><strong>+%${inputs.dieselJumpPct}</strong></div>
                <input class="hwb-slider" type="range" min="0" max="60" step="2" data-field="dieselJumpPct" value="${inputs.dieselJumpPct}">
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;">
                <button type="button" class="hwb-action-btn ${inputs.waveStage === 1 ? 'is-primary' : ''}" data-wave="1">1. Ay: Tarla ve Hal</button>
                <button type="button" class="hwb-action-btn ${inputs.waveStage === 3 ? 'is-primary' : ''}" data-wave="3">3. Ay: Fabrika ve Depo</button>
                <button type="button" class="hwb-action-btn ${inputs.waveStage === 6 ? 'is-primary' : ''}" data-wave="6">6. Ay: Market ve Tencere</button>
              </div>
            </div>
            <div class="hwb-subtle-box">
              <strong>6 Aylık Fiziki Maliyet Dalgası</strong>
              <div style="margin-top:10px;display:grid;gap:10px;font-size:13px;">
                <div>
                  <div style="display:flex;justify-content:space-between;"><span>1. Ay — Tarla Yemi, Buğday ve Çiğ Süt</span><strong>+%${m1FarmShock}</strong></div>
                  <div class="hwb-meter-track"><div class="hwb-meter-fill" style="width:${Math.min(100, m1FarmShock * 1.4)}%;background:var(--copper-700);"></div></div>
                </div>
                <div>
                  <div style="display:flex;justify-content:space-between;"><span>3. Ay — Un Değirmeni, Salça ve Soğuk Hava Deposu</span><strong>+%${m3FactoryShock}</strong></div>
                  <div class="hwb-meter-track"><div class="hwb-meter-fill" style="width:${Math.min(100, m3FactoryShock * 1.4)}%;background:var(--copper-700);"></div></div>
                </div>
                <div>
                  <div style="display:flex;justify-content:space-between;"><span>6. Ay — Mahalle Marketi Rafı ve Ev Tenceresi</span><strong>+%${m6KitchenShock}</strong></div>
                  <div class="hwb-meter-track"><div class="hwb-meter-fill" style="width:${Math.min(100, m6KitchenShock * 1.4)}%;background:var(--crimson-700);"></div></div>
                </div>
              </div>
              <p style="font-size:12.5px;margin-top:10px;color:var(--ink-700);">
                ${inputs.waveStage === 1
                  ? '1. Ayda televizyonlarda henüz gıda manşeti yoktur; ama baraj ve mazotu izleyen göz, kışlık kuru bakliyatını ve peşin tahsilatlı gıda dükkânı hesabını şimdiden yapar.'
                  : (inputs.waveStage === 3
                    ? '3. Ayda eski ucuz stoklar biter; teneke kutu, cam kavanoz ve nakliye faturası fabrika çıkış fiyatına biner.'
                    : '6. Ayda etiket mutfağa ulaştığında herkes şaşırır; oysa bu dalga 5 ay önce tarladan yola çıkmıştı.')}
              </p>
            </div>
          </div>
        `;
      }

      // ----------------------------------------------------------------------
      // TATBİKAT 5: BORÇLA YOLA ÇIKMAK (KENDİ PARAN VS 2 KAT KREDİ YÜKÜ)
      // ----------------------------------------------------------------------
      if (drillId === 'borcla-yola-cikmak') {
        const eq = inputs.ownEquityTL;
        const debt = Math.round(eq * inputs.debtMult);
        const totalPos = eq + debt;
        const dropFrac = inputs.stormDropPct / 100;
        const monthlyLoanRate = 0.042; // Aylık %4,2 kredi/kredili işlem maliyeti
        const interestDrainTL = Math.round(debt * monthlyLoanRate * inputs.stormMonths);

        // Kendi parasıyla yürüyen: Fırtınada düşer ama zorunlu satış yemez, sonra +%45 toparlanınca büyür
        const unlevBottomTL = Math.round(eq * (1 - dropFrac));
        const unlevAfterSunTL = Math.round(unlevBottomTL * 1.45);

        // Borçlu yürüyen: Fırtına dibinde öz sermaye
        const levBottomAssetsTL = totalPos * (1 - dropFrac);
        const levBottomNetTL = Math.round(levBottomAssetsTL - debt - interestDrainTL);
        const forcedWipeout = debt > 0 && (levBottomNetTL <= eq * 0.22 || inputs.stormDropPct >= 30);
        const levAfterSunTL = forcedWipeout
          ? Math.max(0, levBottomNetTL)
          : Math.round(levBottomAssetsTL * 1.45 - debt - interestDrainTL);

        return `
          <div class="hwb-grid-2">
            <div class="hwb-subtle-box">
              <div style="font-weight:700;margin-bottom:8px;">Yolculuk Yükü ve Fırtına Şiddeti</div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Kendi Öz Birikimin</span><strong>${fmtTL(eq)}</strong></div>
                <input class="hwb-slider" type="range" min="50000" max="500000" step="25000" data-field="ownEquityTL" value="${eq}">
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                <button type="button" class="hwb-action-btn ${inputs.debtMult === 0 ? 'is-primary' : ''}" data-debt="0">Sıfır Borç</button>
                <button type="button" class="hwb-action-btn ${inputs.debtMult === 0.5 ? 'is-primary' : ''}" data-debt="0.5">+Yarım Kredi (${fmtTL(eq * 0.5)})</button>
                <button type="button" class="hwb-action-btn ${inputs.debtMult === 1.0 ? 'is-primary' : ''}" data-debt="1">+1 Kat Kredi (${fmtTL(eq)})</button>
              </div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Geçici Piyasa Fırtınası Düşüşü</span><strong>-%${inputs.stormDropPct}</strong></div>
                <input class="hwb-slider" type="range" min="10" max="45" step="1" data-field="stormDropPct" value="${inputs.stormDropPct}">
              </div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Fırtınanın Sürdüğü Ay Sayısı</span><strong>${inputs.stormMonths} Ay</strong></div>
                <input class="hwb-slider" type="range" min="1" max="9" step="1" data-field="stormMonths" value="${inputs.stormMonths}">
              </div>
            </div>
            <div class="hwb-subtle-box">
              <strong>Fırtına Dindiğinde ve Güneş Açtığında (+%45 Toparlanma)</strong>
              <div style="margin-top:10px;display:grid;gap:10px;font-size:13.5px;">
                <div style="padding:10px;border-radius:10px;background:var(--teal-soft);">
                  <strong>Kendi Parasıyla Yürüyen:</strong> Fırtına dibinde ${fmtTL(unlevBottomTL)} gördü ama kimse onu satmaya zorlayamadı. Güneş açtığında kileri: <strong>${fmtTL(unlevAfterSunTL)}</strong>.
                </div>
                <div style="padding:10px;border-radius:10px;background:${forcedWipeout ? 'var(--crimson-soft)' : 'var(--copper-soft)'};">
                  <strong>Borç Yüküyle Yürüyen (${fmtTL(debt)} Kredi):</strong> ${inputs.stormMonths} ayda <strong>${fmtTL(interestDrainTL)}</strong> kredi faizi kemirdi.
                  ${forcedWipeout
                    ? `Fırtına dibinde teminat ve taksit sıkışmasıyla <strong>en dipte zorunlu satış</strong> yedi; güneş açtığında elinde yalnız <strong>${fmtTL(levAfterSunTL)}</strong> kaldı!`
                    : `Uykusuz geceler sonunda elinde <strong>${fmtTL(levAfterSunTL)}</strong> kaldı.`}
                </div>
              </div>
            </div>
          </div>
        `;
      }

      // ----------------------------------------------------------------------
      // TATBİKAT 6: SÜSLÜ PR BAŞLIĞI VS KESİN SİPARİŞ (4 KATMANLI BÜYÜTEÇ)
      // ----------------------------------------------------------------------
      if (drillId === 'kap-haberi-okuma') {
        const layers = [
          {
            k: 1,
            btn: '1. Katman: Cümledeki Fiil Testi',
            a: 'A Duyurusu: "İyi niyet protokolü kapsamında görüşmelere başlanmıştır." — Hukuken sıfır bağlayıcılık; yarın vazgeçilebilir.',
            b: 'B Duyurusu: "48 Milyon Euro kesin sipariş sözleşmesi imzalanmıştır." — İmzalı, cezai şartlı gerçek ticari taahhüt.'
          },
          {
            k: 2,
            btn: '2. Katman: Yıllık Ciroya Oranı ve Peşin Avans',
            a: 'A Duyurusu: Tutar belirtilmemiş, kasaya giren 1 TL avans yok, ciroya etkisi belirsiz.',
            b: 'B Duyurusu: Şirketin yıllık cirosunun %22’si büyüklüğünde ve %25 peşin döviz avansı bu hafta banka hesabına girdi.'
          },
          {
            k: 3,
            btn: '3. Katman: Son 15 Günlük Tahta ve Ortak Satışı İzi',
            a: 'A Duyurusu: Haberden önceki 15 günde fiyat zaten +%46 şişmiş ve ana ortak dün pay satışı kaydı göndermiş!',
            b: 'B Duyurusu: Fiyat sakin yatay seyirde, ortak satışı yok; aksine fabrika çift vardiyaya geçmiş.'
          },
          {
            k: 4,
            btn: '4. Katman: 6 Ay Sonra Çekmece Sonucu',
            a: 'A Duyurusu: Görüşmeler sessizce rafa kalktı; en tepeden atlayan kalabalık -%38 içeride beklemeye mahkûm oldu.',
            b: 'B Duyurusu: Sevkiyatlar limandan yüklendi, döviz tahsilatı bilançoda gerçek nakit olarak çekmeceye yazıldı.'
          }
        ];

        return `
          <div>
            <div class="hwb-grid-2" style="margin-bottom:12px;">
              <div class="hwb-subtle-box" style="border-left:4px solid var(--copper-700);">
                <div style="font-size:11.5px;font-weight:700;color:var(--copper-700);">A ŞİRKETİ DUYURUSU</div>
                <div style="font-weight:700;margin-top:4px;">"Gelecek Vizyonu Kapsamında Küresel Stratejik İş Birliği Görüşmelerine Başlanmıştır"</div>
              </div>
              <div class="hwb-subtle-box" style="border-left:4px solid var(--teal-700);">
                <div style="font-size:11.5px;font-weight:700;color:var(--teal-700);">B ŞİRKETİ DUYURUSU</div>
                <div style="font-weight:700;margin-top:4px;">"Avrupa Teslimli 48 Milyon Euro Kesinleşmiş Trafo Sözleşmesi İmzalanmış ve %25 Avans Alınmıştır"</div>
              </div>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
              ${layers.map((ly) => `
                <button type="button" class="hwb-action-btn ${inputs.openLayers[ly.k] ? 'is-primary' : ''}" data-layer="${ly.k}">
                  ${ly.btn}
                </button>
              `).join('')}
            </div>
            <div style="display:grid;gap:8px;">
              ${layers.filter((ly) => inputs.openLayers[ly.k]).map((ly) => `
                <div class="hwb-subtle-box" style="font-size:13px;">
                  <div style="font-weight:700;margin-bottom:4px;">${ly.btn}</div>
                  <div style="color:var(--crimson-700);margin-bottom:4px;">• ${l === 'SOKAK' ? sanitizeSokakText(ly.a) : ly.a}</div>
                  <div style="color:var(--teal-700);">• ${l === 'SOKAK' ? sanitizeSokakText(ly.b) : ly.b}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // ----------------------------------------------------------------------
      // TATBİKAT 7: 5 YILLIK KİLER SIZINTISI (VERGİ, ERKEN BOZMA VE HAVA PARASI)
      // ----------------------------------------------------------------------
      if (drillId === 'gorunmez-vergi-makas') {
        const p0 = inputs.pantryStartTL;
        const gross = inputs.annualGrossPct / 100;
        const yrs = inputs.pantryYears;

        // 1. Kesintisiz Kira Kalkanı (%0 kesinti, vade yanması yok)
        const zeroTaxFinal = Math.round(p0 * Math.pow(1 + gross, yrs));
        // 2. %17,5 Vergi Kesintili Standart Kapı
        const netAfter175 = gross * (1 - 0.175);
        const taxedFinal = Math.round(p0 * Math.pow(1 + netAfter175, yrs));
        // 3. Yılda N kez vadeden erken bozulan mevduat (her erken bozmada ~45 günlük faiz yanar)
        const burnedFraction = Math.min(0.65, inputs.earlyBreaksPerYear * 0.16);
        const earlyBreakRate = netAfter175 * (1 - burnedFraction);
        const earlyBreakFinal = Math.round(p0 * Math.pow(1 + earlyBreakRate, yrs));
        // 4. Başlangıçta +%14,3 hava paralı alınıp makası normale dönen kağıt fiş
        const airPoppedStart = p0 / 1.143;
        const airFinal = Math.round(airPoppedStart * Math.pow(1 + gross * 0.88, yrs));

        const leakVsBest = zeroTaxFinal - earlyBreakFinal;

        return `
          <div class="hwb-grid-2">
            <div class="hwb-subtle-box">
              <div style="font-weight:700;margin-bottom:8px;">Kiler Büyüklüğü ve Sabır Ayarı</div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Başlangıç Birikimi</span><strong>${fmtTL(p0)}</strong></div>
                <input class="hwb-slider" type="range" min="50000" max="1000000" step="25000" data-field="pantryStartTL" value="${p0}">
              </div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Yıllık Brüt Oran</span><strong>%${inputs.annualGrossPct}</strong></div>
                <input class="hwb-slider" type="range" min="30" max="50" step="1" data-field="annualGrossPct" value="${inputs.annualGrossPct}">
              </div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Yılda Vadeden Önce Bozma Sayısı</span><strong>${inputs.earlyBreaksPerYear} Kez</strong></div>
                <input class="hwb-slider" type="range" min="0" max="3" step="1" data-field="earlyBreaksPerYear" value="${inputs.earlyBreaksPerYear}">
              </div>
              <div class="hwb-control-row">
                <div class="hwb-control-label"><span>Geçen Süre</span><strong>${yrs} Yıl</strong></div>
                <input class="hwb-slider" type="range" min="1" max="5" step="1" data-field="pantryYears" value="${yrs}">
              </div>
            </div>
            <div class="hwb-subtle-box">
              <strong>${yrs} Yıl Sonunda Kilerde Kalan Gerçek Bakiye</strong>
              <div style="margin-top:10px;display:grid;gap:8px;font-size:13px;">
                <div style="padding:8px 10px;border-radius:10px;background:var(--teal-soft);">
                  <strong>Kesintisiz Kira Kalkanı (%0 Kesinti):</strong> ${fmtTL(zeroTaxFinal)}
                </div>
                <div style="padding:8px 10px;border-radius:10px;background:var(--bg-card);border:1px solid var(--border-stone);">
                  <strong>%17,5 Vergi Dilimi Kesintili Kapı:</strong> ${fmtTL(taxedFinal)}
                </div>
                <div style="padding:8px 10px;border-radius:10px;background:var(--copper-soft);">
                  <strong>+%14,3 Hava Paralı Kağıt Fiş (Köpük Sönünce):</strong> ${fmtTL(airFinal)}
                </div>
                <div style="padding:8px 10px;border-radius:10px;background:var(--crimson-soft);">
                  <strong>Erken Bozulan Kilitli Vade (${inputs.earlyBreaksPerYear} kez/yıl):</strong> ${fmtTL(earlyBreakFinal)}
                </div>
              </div>
              <p style="font-size:12.5px;margin-top:8px;color:var(--ink-700);">
                Aynı parayla yola çıkan iki komşudan kesintisiz ve boz-yapsız duran, erken vade bozana göre <strong>+${fmtTL(leakVsBest)}</strong> daha dolu bir kilere ulaştı.
              </p>
            </div>
          </div>
        `;
      }

      // ----------------------------------------------------------------------
      // TATBİKAT 8: 12'DEN 60 AYA EVİN ÖZGÜRLÜK KİLERİ İNŞASI
      // ----------------------------------------------------------------------
      const bill = inputs.householdBillTL;
      const cur = inputs.currentSavedTL;
      const saveM = inputs.monthlySaveTL;
      const rMonthly = Math.pow(1 + inputs.realReturnPct / 100, 1 / 12) - 1;

      function monthsToReach(targetMonths) {
        const targetTL = bill * targetMonths;
        if (cur >= targetTL) return 0;
        let bal = cur;
        let m = 0;
        while (bal < targetTL && m < 360) {
          bal = bal * (1 + rMonthly) + saveM;
          m++;
        }
        return m;
      }

      const curFreedomMonths = +(cur / bill).toFixed(1);
      const mTo3 = monthsToReach(3);
      const mTo12 = monthsToReach(12);
      const mTo60 = monthsToReach(60);

      return `
        <div class="hwb-grid-2">
          <div class="hwb-subtle-box">
            <div style="font-weight:700;margin-bottom:8px;">Evin Gerçek Mutfak ve Tasarruf Ölçüsü</div>
            <div class="hwb-control-row">
              <div class="hwb-control-label"><span>Aylık Zorunlu Ev Gideri (Kira+Fatura+Mutfak)</span><strong>${fmtTL(bill)}</strong></div>
              <input class="hwb-slider" type="range" min="15000" max="120000" step="2500" data-field="householdBillTL" value="${bill}">
            </div>
            <div class="hwb-control-row">
              <div class="hwb-control-label"><span>Bugün Kenarda Hazır Duran Kiler</span><strong>${fmtTL(cur)} (${curFreedomMonths} Ay)</strong></div>
              <input class="hwb-slider" type="range" min="0" max="1500000" step="15000" data-field="currentSavedTL" value="${cur}">
            </div>
            <div class="hwb-control-row">
              <div class="hwb-control-label"><span>Her Ay Düzenli Eklenen Tasarruf</span><strong>${fmtTL(saveM)}</strong></div>
              <input class="hwb-slider" type="range" min="2000" max="60000" step="1000" data-field="monthlySaveTL" value="${saveM}">
            </div>
            <div class="hwb-control-row">
              <div class="hwb-control-label"><span>Pahalılık Üstü Yıllık Gerçek Büyüme</span><strong>+%${inputs.realReturnPct.toFixed(1)}</strong></div>
              <input class="hwb-slider" type="range" min="0" max="8" step="0.5" data-field="realReturnPct" value="${inputs.realReturnPct}">
            </div>
            <button type="button" class="hwb-action-btn is-primary" data-sync-household="1">Bu Ev Faturasını Aile Kilerime Kaydet</button>
          </div>
          <div class="hwb-subtle-box">
            <strong>Üç Basamaklı Özgürlük Kileri Yol Haritası</strong>
            <div style="margin-top:10px;display:grid;gap:10px;font-size:13px;">
              <div style="padding:10px;border-radius:10px;background:${mTo3 === 0 ? 'var(--teal-soft)' : 'var(--bg-card)'};border:1px solid var(--border-stone);">
                <strong>1. Basamak — 3 Aylık Kombi ve İşsizlik Kalkanı (${fmtTL(bill * 3)})</strong>
                <div>${mTo3 === 0 ? 'Bu basamak tamamlandı; acil fırtınalara karşı evin çatısı sağlam.' : `Bugünkü adımla <strong>${mTo3} ay</strong> sonra tamamlanıyor.`}</div>
              </div>
              <div style="padding:10px;border-radius:10px;background:${mTo12 === 0 ? 'var(--teal-soft)' : 'var(--bg-card)'};border:1px solid var(--border-stone);">
                <strong>2. Basamak — 12 Aylık "Hayır Diyebilme" Omurgası (${fmtTL(bill * 12)})</strong>
                <div>${mTo12 === 0 ? 'Tam 1 yıllık ev rızkın hazır; haksızlığa boyun eğmeme özgürlüğündesin.' : `Sabırlı yürüyüşle <strong>${mTo12} ay (${(mTo12 / 12).toFixed(1)} yıl)</strong> sonra ulaşılıyor.`}</div>
              </div>
              <div style="padding:10px;border-radius:10px;background:${mTo60 === 0 ? 'var(--teal-soft)' : 'var(--bg-card)'};border:1px solid var(--border-stone);">
                <strong>3. Basamak — 60 Aylık Aile Bağımsızlığı Kileri (${fmtTL(bill * 60)})</strong>
                <div>${mTo60 === 0 ? '5 yıllık tam bağımsızlık kileri kuruldu!' : `Bileşik bereketle <strong>${(mTo60 / 12).toFixed(1)} yıl (${mTo60} ay)</strong> içinde inşa ediliyor.`}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function renderLab() {
      const lens = getLanguageLens();
      const profile = getMasteryProfile();
      const catalog = getDrillsCatalog(lens);
      const activeDrill = catalog.find((d) => d.id === wisdomState.activeDrillId) || catalog[0];

      containerEl.innerHTML = `
        <div class="hwb-root">
          <div class="hwb-lens-bar">
            <div>
              <div style="font-weight:800;font-size:14px;">${profile.stageTitle}</div>
              <div style="font-size:12px;color:var(--ink-500);">${lens === 'SOKAK' ? sanitizeSokakText(profile.stageSubtitle) : profile.stageSubtitle}</div>
            </div>
            <div class="hwb-lens-buttons">
              ${profile.lensOptions.map((opt) => `
                <button type="button" class="hwb-lens-btn ${opt.isActive ? 'is-active' : ''}" data-set-lens="${opt.key}">
                  ${opt.shortLabel}${opt.isRecommended && !opt.isActive ? ' (Önerilen)' : ''}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="hwb-drill-tabs">
            ${catalog.map((d) => `
              <button type="button" class="hwb-drill-tab ${d.id === activeDrill.id ? 'is-active' : ''}" data-select-drill="${d.id}">
                <span class="hwb-drill-tab-num">Tatbikat ${d.order} ${d.practiced ? '· Denendi' : ''}</span>
                <span class="hwb-drill-tab-title">${d.title}</span>
              </button>
            `).join('')}
          </div>

          <div class="hwb-card">
            <div style="margin-bottom:14px;">
              <h3 style="margin:0 0 4px;font-size:18px;">${activeDrill.order}. ${activeDrill.title}</h3>
              <div style="font-size:13.5px;color:var(--ink-700);">${activeDrill.subtitle}</div>
            </div>
            <div class="hwb-drill-stage">
              ${renderDrillBody(activeDrill.id)}
            </div>
            <div class="hwb-friend-quote">
              <strong>Sakin Dost Notu:</strong> ${activeDrill.lifeLesson}
            </div>
          </div>
        </div>
      `;

      bindLabEvents(activeDrill.id);
    }

    function updateStageOnly(drillId) {
      const stageEl = containerEl.querySelector('.hwb-drill-stage');
      if (stageEl) {
        stageEl.innerHTML = renderDrillBody(drillId);
        bindStageControls(drillId);
      }
    }

    function bindStageControls(drillId) {
      containerEl.querySelectorAll('.hwb-slider').forEach((sl) => {
        sl.addEventListener('input', (ev) => {
          const field = ev.target.getAttribute('data-field');
          if (field) {
            inputs[field] = Number(ev.target.value);
            markDrillPracticed(drillId);
            updateStageOnly(drillId);
          }
        });
      });

      containerEl.querySelectorAll('[data-preset]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const p = btn.getAttribute('data-preset');
          if (p === 'zero-emerg') { inputs.jarBillsPct = 72; inputs.jarEmergPct = 0; inputs.jarLongPct = 15; inputs.jarJoyPct = 13; }
          else if (p === 'locked-all') { inputs.jarBillsPct = 60; inputs.jarEmergPct = 3; inputs.jarLongPct = 32; inputs.jarJoyPct = 5; }
          else { inputs.jarBillsPct = 55; inputs.jarEmergPct = 22; inputs.jarLongPct = 15; inputs.jarJoyPct = 8; }
          markDrillPracticed(drillId);
          updateStageOnly(drillId);
        });
      });

      containerEl.querySelectorAll('[data-morn]').forEach((btn) => {
        btn.addEventListener('click', () => {
          inputs.morningMovePct = Number(btn.getAttribute('data-morn'));
          markDrillPracticed(drillId);
          updateStageOnly(drillId);
        });
      });

      containerEl.querySelectorAll('[data-credit]').forEach((btn) => {
        btn.addEventListener('click', () => {
          inputs.tightCreditWinter = btn.getAttribute('data-credit') === 'winter';
          markDrillPracticed(drillId);
          updateStageOnly(drillId);
        });
      });

      containerEl.querySelectorAll('[data-wave]').forEach((btn) => {
        btn.addEventListener('click', () => {
          inputs.waveStage = Number(btn.getAttribute('data-wave'));
          markDrillPracticed(drillId);
          updateStageOnly(drillId);
        });
      });

      containerEl.querySelectorAll('[data-debt]').forEach((btn) => {
        btn.addEventListener('click', () => {
          inputs.debtMult = Number(btn.getAttribute('data-debt'));
          markDrillPracticed(drillId);
          updateStageOnly(drillId);
        });
      });

      containerEl.querySelectorAll('[data-layer]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const k = Number(btn.getAttribute('data-layer'));
          inputs.openLayers[k] = !inputs.openLayers[k];
          markDrillPracticed(drillId);
          updateStageOnly(drillId);
        });
      });

      containerEl.querySelectorAll('[data-sync-household]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (kernel && kernel.updateHouseholdBaseline) {
            kernel.updateHouseholdBaseline({
              monthlyExpenseTL: inputs.householdBillTL,
              monthlySavingsTL: inputs.monthlySaveTL
            });
          }
          markDrillPracticed(drillId);
          btn.textContent = 'Aile Kileri Giderine Kaydedildi';
        });
      });
    }

    function bindLabEvents(drillId) {
      containerEl.querySelectorAll('[data-set-lens]').forEach((btn) => {
        btn.addEventListener('click', () => {
          setLanguageLens(btn.getAttribute('data-set-lens'));
        });
      });

      containerEl.querySelectorAll('[data-select-drill]').forEach((btn) => {
        btn.addEventListener('click', () => {
          wisdomState.activeDrillId = btn.getAttribute('data-select-drill');
          saveWisdomState();
          renderLab();
        });
      });

      bindStageControls(drillId);
    }

    mountedLabRef = { container: containerEl, rerender: renderLab };
    renderLab();
    return {
      rerender: renderLab,
      selectDrill(id) {
        if (DRILLS_RAW_CATALOG.some((d) => d.id === id)) {
          wisdomState.activeDrillId = id;
          saveWisdomState();
          renderLab();
        }
      },
      unmount() {
        if (mountedLabRef && mountedLabRef.container === containerEl) mountedLabRef = null;
        containerEl.innerHTML = '';
      }
    };
  }

  // --------------------------------------------------------------------------
  // 5. GÖRMÜŞ GEÇİRMİŞ SAKİN DOST AYNASI (BEHAVIORAL & HOUSEHOLD MIRROR)
  // --------------------------------------------------------------------------
  function buildFriendMirror(member, portfolioSnap, lensOverride) {
    const lens = lensOverride ? normalizeLens(lensOverride) : getLanguageLens();
    const kernel = global.AetherKernelV10;
    const m = member || (kernel && kernel.getActiveMember ? kernel.getActiveMember() : {
      name: 'Dostum',
      cashTL: 100000,
      monthlyExpenseTL: 35000,
      footprints: [],
      positions: {},
      rateTranches: [],
      settlementQueue: []
    });
    const snap = portfolioSnap || (kernel && kernel.evaluateMemberPortfolio ? kernel.evaluateMemberPortfolio(m) : {
      name: m.name || 'Dostum',
      cashTL: Number(m.cashTL) || 0,
      unsettledTL: 0,
      pendingOrderTL: 0,
      tranches: [],
      tranchesNetTL: 0,
      spotItems: [],
      totalNetWorthTL: Number(m.cashTL) || 100000,
      baselineTL: Number(m.baselineCapitalTL) || 100000,
      nominalPnlTL: 0,
      nominalPnlPct: 0,
      realPurchasingPnlTL: 0,
      realPurchasingPnlPct: 0,
      monthlyExpense: Number(m.monthlyExpenseTL) || 35000,
      freedomMonths: +(((Number(m.cashTL) || 100000) / (Number(m.monthlyExpenseTL) || 35000))).toFixed(1),
      largestSingleSharePct: 0
    });

    const personName = String(m.name || snap.name || 'Dostum').trim();
    const billTL = Math.max(5000, Number(snap.monthlyExpense || m.monthlyExpenseTL) || 35000);
    const cashTL = Number(snap.cashTL) || 0;
    const unsettledTL = Number(snap.unsettledTL) || 0;
    const totalNW = Math.max(1, Number(snap.totalNetWorthTL) || cashTL || 1);
    const freedomMonths = Number(snap.freedomMonths != null ? snap.freedomMonths : (totalNW / billTL));

    // Günlük bozulabilen (vade yanma cezası olmayan) dilimler
    const tranches = Array.isArray(snap.tranches) ? snap.tranches : [];
    const dailyShieldTL = tranches
      .filter((t) => !t.isTermDeposit)
      .reduce((s, t) => s + (Number(t.accruedNetValueTL) || 0), 0);
    const lockedTermTL = tranches
      .filter((t) => t.isTermDeposit && !t.isMatured)
      .reduce((s, t) => s + (Number(t.accruedNetValueTL) || 0), 0);

    const readyCushionTL = cashTL + dailyShieldTL;
    const spotItems = Array.isArray(snap.spotItems) ? snap.spotItems : [];
    const footprints = Array.isArray(m.footprints) ? m.footprints : [];

    const observations = [];
    let suggestedDrill = {
      id: 'ozgurluk-kileri-insasi',
      title: "12'den 60 Aya Evin Özgürlük Kileri İnşası",
      reason: 'Evin aylık giderine göre kilerinin kaç aylık huzur ürettiğini adım adım görmek için.'
    };

    // Gözlem 1: Acil Kavanoz, T+2 Kum Saati ve Kilitli Vade Dengesi
    if (readyCushionTL < Math.min(12000, billTL * 0.35) && (lockedTermTL > 0 || spotItems.length > 0 || unsettledTL > 0)) {
      observations.push({
        id: 'thin-emergency-jar',
        tone: 'warn',
        title: 'El Altındaki Acil Nefes Kavanozu İncelmiş',
        body: lens === 'SAHA'
          ? `Anında erişilebilir nakit + günlük fon toplamın ${fmtTL(readyCushionTL)} düzeyinde; buna karşılık ${unsettledTL > 0 ? `${fmtTL(unsettledTL)} T+2 takas kum saatinde ve ` : ''}varlıkların bağlı duruyor. Ani bir ev masrafı vadeli faizini yakmana veya T+2 sıkışmasına yol açabilir.`
          : `Kilerin toplamı güzel duruyor ama elini uzattığında bugün kullanabileceğin hazır nakit ${fmtTL(readyCushionTL)} seviyesine inmiş. Kış günü kombi veya tesisat sürpriz çıkarırsa kilitli vadeni bozup birikmiş getiriyi yakmaya ya da güzelim dükkân paylarını aceleyle satmaya mecbur kalma.`
      });
      suggestedDrill = {
        id: 'maas-gunu-sinavi',
        title: "Ayın 15'i Maaş Masası ve 19. Gün Kombi Sınavı",
        reason: 'Acil kavanoz ince kaldığında 9.500 TL’lik küçük bir arızanın kileri nasıl zorladığını görmek için.'
      };
    } else if (cashTL >= totalNW * 0.88 && tranches.length === 0 && spotItems.length === 0) {
      observations.push({
        id: 'idle-cash-melting',
        tone: 'warn',
        title: 'Tüm Birikim Açık Çekmecede Hareketsiz Bekliyor',
        body: `Toplam ${fmtTL(cashTL)} birikimin vadesiz çekmecede tek kuruş kira veya üretim geliri olmadan duruyor. 1-2 aylık acil ev faturası payını ayırdıktan sonra kalan kısmın mutfak pahalılığı karşısında erimemesi için kesintisiz kira kalkanına veya sağlam dükkânlara pay ayırabilirsin.`
      });
      suggestedDrill = {
        id: 'gorunmez-vergi-makas',
        title: '5 Yıllık Kiler Sızıntısı: Erken Bozma, Kesinti ve Hava Parası',
        reason: 'Atıl duran veya kesintili kapıda bekleyen paranın 5 yılda ne kadar alım gücü kaybettiğini görmek için.'
      };
    } else {
      observations.push({
        id: 'healthy-breathing-room',
        tone: 'good',
        title: 'Acil Nefes Payın Yerli Yerinde',
        body: `Kenarda hem günlük ulaşabileceğin ${fmtTL(readyCushionTL)} nefes yastığın var hem de kilerinin geri kalanı iş başında. Evde beklenmedik bir tamirat çıksa kimseye el açmadan kendi kavanozundan çözersin.`
      });
    }

    // Gözlem 2: Unsettled T+2 Bekleyen Nakit Varsa Sakin Hatırlatma
    if (unsettledTL > 0) {
      observations.push({
        id: 't2-hourglass-active',
        tone: 'good',
        title: 'Takas Kuryesindeki Para Yolda',
        body: lens === 'SAHA'
          ? `Satıştan gelen ${fmtTL(unsettledTL)} şu an BIST T+2 takas sürecinde; 2 iş günü dolduğunda çekilebilir nakit kasana geçecek.`
          : `Yaptığın satıştan gelen ${fmtTL(unsettledTL)} şu an 2 iş günlük takas kuryesinde yürüyor; süresi dolduğunda doğrudan hazır nakit çekmecene eklenecek.`
      });
    }

    // Gözlem 3: Tek Sepet Yoğunlaşması veya Tutulan Varlık Kalitesi
    if ((snap.largestSingleSharePct || 0) >= 65 && spotItems.length > 0) {
      const topItem = spotItems[0];
      observations.push({
        id: 'single-shutter-concentration',
        tone: 'warn',
        title: 'Kilerin Büyük Kısmı Tek Kepengin Arkasında',
        body: `Toplam birikiminin %${snap.largestSingleSharePct} kadarı tek başına "${topItem.name}" içinde toplanmış. Ne kadar sağlam görünürse görünsün, rızkı tek bir çatıya bağlamak yerine kira kalkanı, sarı külçe ve farklı üretim atölyeleri arasında dengelemek uykuyu korur.`
      });
    }

    // Gözlem 4: Tutulan Şirketlerin Çekmece / Hava Parası / Ayak İzi Kontrolü
    let riskyShopFound = null;
    let s1AirFound = false;
    for (let i = 0; i < spotItems.length; i++) {
      const it = spotItems[i];
      const fullAsset = kernel && kernel.getAsset ? kernel.getAsset(it.assetKey || it.ticker) : null;
      if (fullAsset && fullAsset.key === 'altin-sertifikasi') {
        const dInfo = kernel.getDarphanePremiumInfo ? kernel.getDarphanePremiumInfo() : { premiumPct: 14.3 };
        if (dInfo.premiumPct >= 4.0) s1AirFound = dInfo.premiumPct;
      }
      if (fullAsset && fullAsset.bistRow && !riskyShopFound) {
        const r = fullAsset.bistRow;
        if (r.entityKind !== 'bank' && ((r.ocfMillionTL || 0) < 0 || (r.netDebtToEbitda || 0) >= 3.8)) {
          riskyShopFound = { asset: fullAsset, row: r };
        }
      }
    }

    if (s1AirFound) {
      observations.push({
        id: 'darphane-air-premium-held',
        tone: 'warn',
        title: 'Kağıt Altın Fişinde Hava Parası Yükü Var',
        body: lens === 'SAHA'
          ? `Portföyündeki ALTIN.S1 payları fiziki gram altından +%${s1AirFound} primli işlem görüyor; prim daraldığında ons altın düşmese de TL bazında geri çekilme yaşanabilir.`
          : `Kilerinde tuttuğun kağıt altın fişi, çarşıdaki gerçek sarı külçeden yüzde ${s1AirFound} daha pahalıya fiyatlanıyor. Köpük indiğinde altın yerinde dursa bile aradaki hava parası eriyebilir.`
      });
      suggestedDrill = {
        id: 'gorunmez-vergi-makas',
        title: '5 Yıllık Kiler Sızıntısı: Erken Bozma, Kesinti ve Hava Parası',
        reason: 'Kağıt fişteki hava parasının gerçek külçe karşısındaki etkisini tartmak için.'
      };
    } else if (riskyShopFound) {
      const humanDesc = describeAssetForHuman(riskyShopFound.asset, lens);
      observations.push({
        id: 'drawer-debt-check',
        tone: 'warn',
        title: 'Ortak Olduğun Bir Dükkânın Çekmecesini Gözden Geçir',
        body: `"${humanDesc.everydayName}" tarafında ya akşam çekmeceye giren nakit eksi yazıyor ya da sırtındaki kredi borcu ağırlaşmış. Vitrindeki büyüme hikâyesine kapılmadan çekmece nakdini kontrol etmekte fayda var.`
      });
      suggestedDrill = {
        id: 'iki-dukkan-sirri',
        title: 'İsimsiz İki Dükkân: Parlak Vitrin mi, Dolu Çekmece mi?',
        reason: 'Veresiye defteri kabarık dükkân ile peşin çalışan kasanın 24 aylık farkını görmek için.'
      };
    } else if (footprints.length > 0) {
      const latestFp = footprints[0];
      if (latestFp.code === 'EARLY_DEPOSIT_BREAK') {
        observations.push({
          id: 'fp-early-break',
          tone: 'warn',
          title: 'Erken Bozulan Vadenin İzini Sakinleştirelim',
          body: 'Yakın zamanda süresi dolmadan bozulan bir vade yüzünden birikmiş getiri yanmış. Bundan sonra birikimi tek parça kilitlemek yerine küçük dilimlere bölmek bu kaybı tamamen önler.'
        });
      } else if (latestFp.code === 'FOMO_HERD_BUY') {
        observations.push({
          id: 'fp-herd-chase',
          tone: 'warn',
          title: 'Kalabalık Coşkusunda Alım İzi',
          body: 'Fiyat sert yükselirken kapıdaki kalabalıkla birlikte sıraya girilmiş. En güzel ortaklıklar manşetler bağırırken değil, ortalık sütlimanken kurulur.'
        });
        suggestedDrill = {
          id: 'kap-haberi-okuma',
          title: 'Süslü Başlık mı, Gerçek Sipariş mi? 4 Katmanlı Büyüteç',
          reason: 'Heyecanlı başlıkların arkasındaki gerçek nakit izini soğukkanlılıkla okumak için.'
        };
      }
    }

    // Gözlem 5: Rakam Artışı vs Gerçek Mutfak Alım Gücü
    const nomPct = Number(snap.nominalPnlPct) || 0;
    const realPct = Number(snap.realPurchasingPnlPct) || 0;
    if (Math.abs(nomPct) > 0.2 || Math.abs(realPct) > 0.2) {
      const beatInflation = realPct >= 0;
      observations.push({
        id: 'real-purchasing-check',
        tone: beatInflation ? 'good' : 'warn',
        title: beatInflation ? 'Kilerin Mutfak Pahalılığının Önünde Yürüyor' : 'Rakam Büyümüş Ama Mutfak Filesi Daha Hızlı Koşmuş',
        body: beatInflation
          ? `Kağıt üzerindeki değişim %${nomPct.toFixed(1)}, çarşı-pazar pahalılığı düşüldükten sonraki gerçek alım gücü değişimin ise +%${realPct.toFixed(1)}. Önemli olan tek terazi budur.`
          : `Hesaptaki TL rakamı %${nomPct.toFixed(1)} değişmiş görünse de mutfak pahalılığı düşüldüğünde gerçek alım gücü %${realPct.toFixed(1)} düzeyinde. Rakam büyümesine aldanmayıp gerçek sepeti korumaya odaklanalım.`
      });
    }

    // Özgürlük Ayları Ufku
    let nextMilestone = 3;
    if (freedomMonths >= 12) nextMilestone = 60;
    else if (freedomMonths >= 3) nextMilestone = 12;
    const progressPct = Math.min(100, Math.round((freedomMonths / nextMilestone) * 100));

    const freedomSummary = freedomMonths < 3
      ? `Bugünkü kilerin evin tüm faturalarını ${freedomMonths.toFixed(1)} ay sırtlıyor. İlk sakin hedefimiz bunu 3 aya çıkarıp kombi ve iş sürprizlerine karşı evi zırhlamak.`
      : (freedomMonths < 12
        ? `Evin ${freedomMonths.toFixed(1)} aylık rızkı kilerde hazır. 3 aylık acil eşiği geçmişsin; sıradaki durak 12 aylık "başını dik tutma" kileri.`
        : `Tam ${freedomMonths.toFixed(1)} aylık aile huzuru birikmiş durumda. Gösterişten uzak, sağlam adımlarla 60 aylık bağımsızlık ufkuna yürüyorsun.`);

    const greeting = `Merhaba ${personName}, çayını al gel; kilerinin defterine telaşsız bir gözle birlikte bakalım.`;
    const headline = freedomMonths >= 12
      ? `${freedomMonths.toFixed(1)} Aylık Sağlam Omurga Kurulmuş`
      : `${freedomMonths.toFixed(1)} Aylık Ev Kileri — Adım Adım Güçleniyor`;

    const calmParagraph = observations[0]
      ? `${observations[0].body} ${freedomSummary}`
      : freedomSummary;

    const nextCalmStep = readyCushionTL < billTL
      ? `Önce el altındaki günlük nakit/kira kalkanı kavanozunu 1 tam aylık ev giderin olan ${fmtTL(billTL)} seviyesine tamamla.`
      : 'Ayda sadece bir kez, maaş günü gündüz saatlerinde kilerine sakin ekleme yap; gece haberleriyle ekran açma.';

    const out = {
      lens,
      lensTitle: (LENS_META[lens] || LENS_META.SOKAK).title,
      greeting,
      headline,
      calmParagraph,
      observations,
      freedomHorizon: {
        freedomMonths: +freedomMonths.toFixed(1),
        monthlyExpenseTL: billTL,
        totalNetWorthTL: totalNW,
        nextMilestoneMonths: nextMilestone,
        progressPct,
        summary: freedomSummary
      },
      suggestedDrill,
      nextCalmStep
    };

    if (lens === 'SOKAK') {
      return {
        ...out,
        lensTitle: sanitizeSokakText(out.lensTitle),
        greeting: sanitizeSokakText(out.greeting),
        headline: sanitizeSokakText(out.headline),
        calmParagraph: sanitizeSokakText(out.calmParagraph),
        observations: out.observations.map((o) => ({
          id: o.id,
          tone: o.tone,
          title: sanitizeSokakText(o.title),
          body: sanitizeSokakText(o.body)
        })),
        freedomHorizon: {
          ...out.freedomHorizon,
          summary: sanitizeSokakText(out.freedomHorizon.summary)
        },
        suggestedDrill: {
          id: out.suggestedDrill.id,
          title: sanitizeSokakText(out.suggestedDrill.title),
          reason: sanitizeSokakText(out.suggestedDrill.reason)
        },
        nextCalmStep: sanitizeSokakText(out.nextCalmStep)
      };
    }

    return out;
  }

  // --------------------------------------------------------------------------
  // 6. HAZIR GÖRSEL KART YARDIMCILARI (İSTEĞE BAĞLI DOM MOUNT)
  // --------------------------------------------------------------------------
  function renderFriendMirrorCard(containerEl, member, portfolioSnap, lensOverride) {
    if (!containerEl) return null;
    injectHumanWisdomStyles();
    const mirror = buildFriendMirror(member, portfolioSnap, lensOverride);
    containerEl.innerHTML = `
      <div class="hwb-root">
        <div class="hwb-card">
          <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <strong style="font-size:16px;">${mirror.headline}</strong>
            <span class="hwb-pill hwb-tone-good">${mirror.freedomHorizon.freedomMonths} Ay Huzur Payı</span>
          </div>
          <p style="font-size:14px;color:var(--ink-700);margin:0 0 12px;">${mirror.greeting}</p>
          <div style="display:grid;gap:8px;margin-bottom:12px;">
            ${mirror.observations.map((obs) => `
              <div class="hwb-subtle-box" style="border-left:4px solid ${obs.tone === 'good' ? 'var(--teal-700)' : 'var(--copper-700)'};">
                <div style="font-weight:700;font-size:13.5px;">${obs.title}</div>
                <div style="font-size:13px;color:var(--ink-700);margin-top:3px;">${obs.body}</div>
              </div>
            `).join('')}
          </div>
          <div class="hwb-friend-quote">
            <strong>Sıradaki Sakin Adım:</strong> ${mirror.nextCalmStep}
          </div>
        </div>
      </div>
    `;
    return mirror;
  }

  function renderAssetWisdomCard(containerEl, assetKeyOrObj, lensOverride) {
    if (!containerEl) return null;
    injectHumanWisdomStyles();
    const d = describeAssetForHuman(assetKeyOrObj, lensOverride);
    if (!d) return null;
    const va = d.visualCashAnatomy;
    const rg = d.realLifeActionGuide;
    const toneClass = va.verdictTone === 'SAGLAM' ? 'hwb-tone-good' : (va.verdictTone === 'DIKKAT' ? 'hwb-tone-bad' : 'hwb-tone-warn');

    containerEl.innerHTML = `
      <div class="hwb-root">
        <div class="hwb-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
            <div>
              <div style="font-size:12px;color:var(--ink-500);font-weight:700;">${d.workshopKind}</div>
              <h4 style="margin:2px 0 0;font-size:17px;">${d.humanTitle}</h4>
            </div>
            <span class="hwb-pill ${toneClass}">${va.plainVerdict.slice(0, 44)}...</span>
          </div>
          <p style="font-size:13.5px;color:var(--ink-700);margin:8px 0 14px;">${d.streetEssence}</p>
          <div class="hwb-grid-4" style="margin-bottom:14px;">
            <div class="hwb-subtle-box">
              <div style="font-size:11.5px;color:var(--ink-500);">Çekmecedeki Nakit</div>
              <div style="font-weight:700;font-size:13px;margin:2px 0;">${va.cashInDrawer.statusLabel}</div>
              <div style="font-size:12px;color:var(--ink-700);">${va.cashInDrawer.summary}</div>
            </div>
            <div class="hwb-subtle-box">
              <div style="font-size:11.5px;color:var(--ink-500);">Defter / Köpük Testi</div>
              <div style="font-weight:700;font-size:13px;margin:2px 0;">${va.paperProfitIllusion.severityLabel}</div>
              <div style="font-size:12px;color:var(--ink-700);">${va.paperProfitIllusion.summary}</div>
            </div>
            <div class="hwb-subtle-box">
              <div style="font-size:11.5px;color:var(--ink-500);">Kışlık Nakit Yastığı</div>
              <div style="font-weight:700;font-size:13px;margin:2px 0;">${va.cashCushion.label}</div>
              <div style="font-size:12px;color:var(--ink-700);">${va.cashCushion.summary}</div>
            </div>
            <div class="hwb-subtle-box">
              <div style="font-size:11.5px;color:var(--ink-500);">Sırtındaki Borç Yükü</div>
              <div style="font-weight:700;font-size:13px;margin:2px 0;">${va.debtBurden.label}</div>
              <div style="font-size:12px;color:var(--ink-700);">${va.debtBurden.summary}</div>
            </div>
          </div>
          <div class="hwb-subtle-box" style="font-size:12.5px;margin-bottom:10px;">
            <strong>Gerçek Hayatta Nasıl Hareket Edilir?</strong>
            <div style="margin-top:4px;">• <strong>Gişe:</strong> ${rg.whereToAct}</div>
            <div>• <strong>En Doğru Saat:</strong> ${rg.bestTimeWindow}</div>
            <div>• <strong>Kesinti ve Bekleme Kuralı:</strong> ${rg.hiddenCutAndWaitRule}</div>
            <div style="color:var(--crimson-700);">• <strong>En Sık Yapılan Hata:</strong> ${rg.amateurMistake}</div>
          </div>
        </div>
      </div>
    `;
    return d;
  }

  // Başlangıç durumunu yükle
  loadWisdomState();
  if (global.document && global.document.readyState !== 'loading') {
    injectHumanWisdomStyles();
  } else if (global.addEventListener) {
    global.addEventListener('DOMContentLoaded', injectHumanWisdomStyles);
  }

  global.HumanWisdomBridge = {
    version: '10.0.0',
    LENS_META,
    getLanguageLens,
    setLanguageLens,
    subscribe,
    getMasteryProfile,
    sanitizeSokakText,
    describeAssetForHuman,
    getDrillsCatalog,
    mountRealLifeLab,
    markDrillPracticed,
    buildFriendMirror,
    renderFriendMirrorCard,
    renderAssetWisdomCard
  };
})(typeof window !== 'undefined' ? window : globalThis);
