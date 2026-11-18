// ============================================================================
// AETHER v13.1 — GERÇEK PİYASA FİZİĞİ, CİHAZ BAZLI YATIRIMCI KİMLİĞİ,
// KÜRESEL CANLI YATIRIMCI LİGİ AĞI (WSS MQTT MESH) & USTALIK AYNASI ÇEKİRDEĞİ
// ============================================================================
(function (global) {
  'use strict';

  const STORAGE_KEY_BASE = 'aether_investor_v13';
  const DEFAULT_STARTING_CAPITAL_TL = 1000000;
  const CANONICAL_CLOUD_URL = 'https://4zyq4sk2tk-collab.github.io/AETHER-iOS/';
  const MESH_NAMESPACE = 'aether/tr1m/f7c92a4b81e3d605';
  const DEFAULT_ROOM_CODE = 'ORTAK-LIG';

  const MQTT_BROKERS = [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt',
    'wss://test.mosquitto.org:8081'
  ];

  // 2026-2027 Resmi Tatil ve Yarım Gün (Arife 12:40 Kapanış) Takvimi
  const TR_FULL_HOLIDAYS = new Set([
    '2026-01-01',
    '2026-03-20', '2026-03-21', '2026-03-22',
    '2026-04-23', '2026-05-01', '2026-05-19',
    '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30',
    '2026-07-15', '2026-08-30', '2026-10-29',
    '2027-01-01',
    '2027-03-09', '2027-03-10', '2027-03-11',
    '2027-04-23', '2027-05-01', '2027-05-16', '2027-05-17', '2027-05-18', '2027-05-19',
    '2027-07-15', '2027-08-30', '2027-10-29'
  ]);

  const TR_HALF_DAYS = new Set([
    '2026-03-19', '2026-05-26', '2026-10-28',
    '2027-03-08', '2027-05-15', '2027-10-28'
  ]);

  // %17,5 Stopaja Tabi BIST Borsa Yatırım Fonları
  const TAXABLE_175_BIST_ETFS = new Set([
    'BIST:ZGOLD', 'BIST:GLDTR', 'BIST:GMSTR', 'BIST:USDTR', 'BIST:ISGLK',
    'ZGOLD', 'GLDTR', 'GMSTR', 'USDTR', 'ISGLK'
  ]);

  // %0 Stopajlı Hisse Senedi Yoğun BIST BYF'ler
  const EQUITY_EXEMPT_BIST_ETFS = new Set([
    'BIST:ZPBDL', 'BIST:ZPLIB', 'BIST:APX30', 'BIST:Z30KP', 'BIST:ZPT10', 'BIST:ZSR25', 'BIST:OPT25', 'BIST:OPTGY',
    'ZPBDL', 'ZPLIB', 'APX30', 'Z30KP', 'ZPT10', 'ZSR25', 'OPT25', 'OPTGY'
  ]);

  // GVK Mükerrer 80 Yurt Dışı Beyana Tabi USD Varlıklar (Yİ-ÜFE >= %10 Endekslemeli)
  const FOREIGN_GVK80_IDS = new Set([
    'eurobond-emb', 'emtia-petrol-bno', 'emtia-tarim-dba',
    'abd-sp500-spy', 'abd-nasdaq-qqq', 'dunya-borsalari-vt',
    'kuresel-hisse-nvda', 'kuresel-hisse-aapl', 'kuresel-hisse-msft',
    'fon-tematik-yari-iletken-soxx', 'koleksiyon-luks-lvmh'
  ]);

  // Fiziki Kapalıçarşı - Mobil Banka İki Kapılı Varlıklar
  const TWO_DOOR_FX_METAL_IDS = new Set([
    'doviz-usd', 'doviz-eur', 'doviz-gbp', 'doviz-chf',
    'gram-altin-spot', 'ceyrek-altin', 'cumhuriyet-altini', 'bilezik-22-ayar', 'gram-gumus-spot'
  ]);

  const AVATAR_PALETTE = [
    '#2563eb', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#ea580c', '#4f46e5'
  ];

  const CURRENT_YIUFE_INDEX = 4120.0;

  let marketData = global.__AETHER_EMBEDDED_DATA__ || { instruments: [], macro: {}, kitchenIntelSummary: {} };
  let assetCatalog = new Map();
  let state = null;
  let listeners = new Set();
  let bcChannel = null;
  let clockOverride = null;
  let lastLiveSyncMs = 0;
  let priceFlashMap = new Map();

  // Canlı Küresel Bulut Ligi Bağlantı Durumu
  const meshClients = new Map();
  let meshPublishTimer = null;
  let lastSyncPingMs = 0;
  const nativeFetchCallbacks = new Map();

  // iOS Native NSURLSession Köprüsü Yanıt Yakalayıcı (Doğrudan UTF-8 Metin + Base64 Yedekli)
  global.__onAetherNativeFetch = function (reqId, statusCode, bodyPayload, errStr, isRawText) {
    const cb = nativeFetchCallbacks.get(reqId);
    if (!cb) return;
    nativeFetchCallbacks.delete(reqId);
    if (errStr || !statusCode) {
      cb.reject(new Error(errStr || 'Native HTTP error'));
      return;
    }
    try {
      let text = '';
      if (isRawText) {
        text = String(bodyPayload || '');
      } else {
        const bin = atob(bodyPayload || '');
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        text = new TextDecoder('utf-8').decode(bytes);
      }
      cb.resolve({
        ok: statusCode >= 200 && statusCode < 300,
        status: statusCode,
        text: async () => text,
        json: async () => JSON.parse(text)
      });
    } catch (e) {
      cb.reject(e);
    }
  };

  function getInvestorSlotSuffix() {
    try {
      if (global.location?.search) {
        const sp = new URLSearchParams(global.location.search);
        const slot = sp.get('investor');
        if (slot && /^[a-zA-Z0-9_-]{1,24}$/.test(slot)) return '_' + slot;
      }
    } catch (_) {}
    return '';
  }

  function getStorageKey() {
    return STORAGE_KEY_BASE + getInvestorSlotSuffix();
  }

  function detectDeviceLabel() {
    if (global.__AETHER_DEVICE_LABEL__) return String(global.__AETHER_DEVICE_LABEL__);
    const ua = String(global.navigator?.userAgent || '');
    if (/iPhone/i.test(ua)) return global.__AETHER_NATIVE_IOS_APP__ ? 'iPhone Uygulaması' : 'iPhone Web';
    if (/iPad/i.test(ua)) return 'iPad';
    if (/Android/i.test(ua)) return 'Android';
    if (/Macintosh/i.test(ua)) return 'Mac';
    if (/Windows/i.test(ua)) return 'Bilgisayar';
    return 'Cihaz';
  }

  // --------------------------------------------------------------------------
  // 1. ZAMAN VE TÜRKİYE PİYASA SAATİ (EUROPE/ISTANBUL UTC+3)
  // --------------------------------------------------------------------------
  function getIstanbulParts(customMs) {
    const baseMs = customMs != null ? customMs : (clockOverride != null ? clockOverride : Date.now());
    const d = new Date(baseMs);
    const trMs = d.getTime() + (3 * 3600 * 1000);
    const tr = new Date(trMs);
    const year = tr.getUTCFullYear();
    const month = tr.getUTCMonth() + 1;
    const day = tr.getUTCDate();
    const weekday = tr.getUTCDay();
    const hh = tr.getUTCHours();
    const mm = tr.getUTCMinutes();
    const ss = tr.getUTCSeconds();
    const ymd = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const ym = `${year}-${String(month).padStart(2, '0')}`;
    return { ms: baseMs, year, month, day, weekday, hh, mm, ss, ymd, ym, minOfDay: hh * 60 + mm };
  }

  function isTurkishBusinessDay(ymd, weekday) {
    if (weekday === 0 || weekday === 6) return false;
    if (TR_FULL_HOLIDAYS.has(ymd)) return false;
    return true;
  }

  function addTurkishBusinessDays(startMs, businessDaysToAdd, targetHour = 10, targetMin = 0) {
    let cursorMs = startMs;
    let added = 0;
    let guard = 0;
    while (added < businessDaysToAdd && guard < 45) {
      cursorMs += 24 * 3600 * 1000;
      guard++;
      const p = getIstanbulParts(cursorMs);
      if (isTurkishBusinessDay(p.ymd, p.weekday)) {
        added++;
      }
    }
    const finalP = getIstanbulParts(cursorMs);
    return Date.UTC(finalP.year, finalP.month - 1, finalP.day, targetHour - 3, targetMin, 0);
  }

  function getNextBistOpenMatchMs(startMs) {
    const p = getIstanbulParts(startMs);
    if (isTurkishBusinessDay(p.ymd, p.weekday) && p.minOfDay < 10 * 60) {
      return Date.UTC(p.year, p.month - 1, p.day, 10 - 3, 0, 0);
    }
    return addTurkishBusinessDays(startMs, 1, 10, 0);
  }

  function getTurkishClock(customMs) {
    const p = getIstanbulParts(customMs);
    const isWeekend = p.weekday === 0 || p.weekday === 6;
    const isHoliday = TR_FULL_HOLIDAYS.has(p.ymd);
    const isHalfDay = TR_HALF_DAYS.has(p.ymd);
    const isBizDay = !isWeekend && !isHoliday;
    const m = p.minOfDay;

    let bistPhase = 'CLOSED';
    let bistLabel = 'Borsa Kapalı · Emirler Sabah 09:55 Eşleşmesinde';
    let bistCanMatchNow = false;
    let bistCancelLocked = false;

    if (isBizDay) {
      const contEnd = isHalfDay ? (12 * 60 + 30) : (18 * 60);
      const closeCollectEnd = isHalfDay ? (12 * 60 + 35) : (18 * 60 + 5);
      const closeMatchEnd = isHalfDay ? (12 * 60 + 38) : (18 * 60 + 8);
      const closeKfEnd = isHalfDay ? (12 * 60 + 40) : (18 * 60 + 10);

      if (m >= 9 * 60 + 40 && m < 9 * 60 + 55) {
        bistPhase = 'OPEN_COLLECT';
        bistCancelLocked = m >= 9 * 60 + 50;
        bistLabel = bistCancelLocked
          ? '09:50–09:55 Emir Toplama (İptal Kısıtlı)'
          : '09:40–09:55 Açılış Emir Toplama';
      } else if (m >= 9 * 60 + 55 && m < 10 * 60) {
        bistPhase = 'OPEN_MATCH';
        bistCancelLocked = true;
        bistLabel = '09:55–10:00 Tek Fiyat Açılış Eşleşmesi';
      } else if (m >= 10 * 60 && m < contEnd) {
        bistPhase = 'CONTINUOUS';
        bistCanMatchNow = true;
        bistLabel = isHalfDay ? '10:00–12:30 Yarım Gün Seansı Açık' : '10:00–18:00 Borsa İstanbul Açık';
      } else if (m >= contEnd && m < closeCollectEnd) {
        bistPhase = 'CLOSE_COLLECT';
        bistLabel = '18:00–18:05 Kapanış Seansı Emir Toplama';
      } else if (m >= closeCollectEnd && m < closeMatchEnd) {
        bistPhase = 'CLOSE_MATCH';
        bistCancelLocked = true;
        bistLabel = '18:05–18:08 Kapanış Tek Fiyat Eşleşmesi';
      } else if (m >= closeMatchEnd && m < closeKfEnd) {
        bistPhase = 'CLOSE_MARJ';
        bistCanMatchNow = true;
        bistLabel = '18:08–18:10 Kapanış Fiyatından İşlem';
      }
    }

    // VİOP Gündüz (09:30–18:15) + Akşam Seansı (19:00–23:00) + 15:00 Margin Call
    let viopOpen = false;
    let viopEvening = false;
    let isMarginCallWindow = false;
    let viopLabel = 'VİOP Kapalı';
    if (isBizDay) {
      if (m >= 9 * 60 + 30 && m < 18 * 60 + 15) {
        viopOpen = true;
        isMarginCallWindow = (m >= 14 * 60 + 45 && m <= 15 * 60 + 15);
        viopLabel = isMarginCallWindow
          ? 'VİOP Açık · 15:00 Teminat Çağrısı (Margin Call) Saati!'
          : '09:30–18:15 VİOP Gündüz Seansı Açık';
      } else if (!isHalfDay && m >= 19 * 60 && m < 23 * 60) {
        viopOpen = true;
        viopEvening = true;
        viopLabel = '19:00–23:00 VİOP Akşam Seansı (Sabah Spot İpucu)';
      }
    }

    // Londra (11:00–19:30 TR) & New York (16:30–23:00 TR) Küresel Seans Durumu
    const globalLondonOpen = !isWeekend && m >= 11 * 60 && m < 19 * 60 + 30;
    const globalNyOpen = !isWeekend && m >= 16 * 60 + 30 && m < 23 * 60;
    const globalSessionLabel = globalNyOpen
      ? 'ABD (New York) Seansı Açık'
      : (globalLondonOpen ? 'Avrupa (Londra) Seansı Açık' : (isWeekend ? 'Küresel Borsalar Hafta Sonu Kapalı · Kripto 7/24' : 'Küresel Vadeli İşlemler Açık'));

    // TEFAS 13:30 Valör Saati
    const tefasBeforeCutoff = isBizDay && m >= 9 * 60 && m < 13 * 60 + 30;
    const minsToTefas = tefasBeforeCutoff ? (13 * 60 + 30 - m) : 0;
    const tefasLabel = tefasBeforeCutoff
      ? `TEFAS Valör Açık (13:30'a ${minsToTefas} dk kaldı)`
      : 'TEFAS 13:30 Geçildi (+1 İş Günü Valör)';

    // Kapalıçarşı vs Mobil Banka Makası
    const grandBazaarOpen = !isHoliday && p.weekday !== 0 && m >= 9 * 60 + 30 && m < 18 * 60 + 30;
    const bankDaytimeTight = isBizDay && m >= 9 * 60 + 30 && m < 17 * 60 + 30;
    const bankSpreadPct = bankDaytimeTight ? 0.65 : 3.60;
    const bazaarSpreadPct = 0.40;

    // Resmi Takvim Pencereleri
    const calendarAlerts = [];
    if (p.day === 3 && m >= 9 * 60 + 55 && m <= 13 * 60) {
      calendarAlerts.push('TÜİK Aylık Enflasyon Verisi (Ayın 3’ü 10:00): Tüm portföylerin reel alım gücü güncellendi.');
    }
    if (isBizDay && p.weekday === 4 && m >= 13 * 60 + 50 && m <= 14 * 60 + 50) {
      calendarAlerts.push('Perşembe 14:00 TCMB Faiz Kararı & 14:30 Haftalık Rezerv/Kart Harcama Penceresi!');
    }
    if (isMarginCallWindow) {
      calendarAlerts.push('Saat 15:00 Takasbank / VİOP Teminat Tamamlama (Margin Call) Penceresi!');
    }
    if (isBizDay && [3, 6, 9, 12].includes(p.month) && p.day >= 28 && m >= 15 * 60 + 15 && m <= 16 * 60) {
      calendarAlerts.push('Çeyrek Sonu 15:30 TCMB Bilanço Değerleme Kuru Sabitlemesi.');
    }

    return {
      ...p,
      timeStr: `${String(p.hh).padStart(2, '0')}:${String(p.mm).padStart(2, '0')}:${String(p.ss).padStart(2, '0')}`,
      shortTimeStr: `${String(p.hh).padStart(2, '0')}:${String(p.mm).padStart(2, '0')}`,
      isWeekend,
      isHoliday,
      isHalfDay,
      isBizDay,
      bistPhase,
      bistLabel,
      bistCanMatchNow,
      bistCancelLocked,
      viopOpen,
      viopEvening,
      isMarginCallWindow,
      viopLabel,
      globalLondonOpen,
      globalNyOpen,
      globalSessionLabel,
      tefasBeforeCutoff,
      minsToTefas,
      tefasLabel,
      grandBazaarOpen,
      bankDaytimeTight,
      bankSpreadPct,
      bazaarSpreadPct,
      calendarAlerts
    };
  }

  // --------------------------------------------------------------------------
  // 2. BIST FİYAT ADIMI, TAVAN/TABAN, DEVRE KESİCİ VE BRÜT TAKAS
  // --------------------------------------------------------------------------
  function getBistTickSize(price) {
    const p = Math.abs(Number(price) || 0);
    if (p < 20) return 0.01;
    if (p < 50) return 0.02;
    if (p < 100) return 0.05;
    if (p < 250) return 0.10;
    if (p < 500) return 0.25;
    if (p < 1000) return 0.50;
    if (p < 2500) return 1.00;
    return 2.50;
  }

  function snapToBistTick(price) {
    const p = Number(price) || 0;
    if (p <= 0) return 0;
    const tick = getBistTickSize(p);
    return +(Math.round(p / tick) * tick).toFixed(2);
  }

  function inspectBoardMicrostructure(asset) {
    if (!asset || asset.venue !== 'BIST') {
      return {
        tickSize: 0.01,
        isTavanLocked: false,
        isTabanLocked: false,
        isCircuitBreaker: false,
        isBrutTakas: false,
        marginAllowed: false,
        statusNote: null
      };
    }
    const chg = Number(asset.change1D) || 0;
    const tickSize = getBistTickSize(asset.priceTL);
    const isEquity = asset.subVenue === 'BIST_STOCK';
    const isTavanLocked = isEquity && chg >= 9.85;
    const isTabanLocked = isEquity && chg <= -9.85;
    const isCircuitBreaker = isEquity && chg <= -5.0 && chg > -9.85;
    const isBrutTakas = Boolean(asset.isBrutTakas);
    const marginAllowed = isEquity && !isBrutTakas && !asset.isPumpAnomaly;

    let statusNote = null;
    if (isTavanLocked) statusNote = `Tavan Kilitli (+%${chg.toFixed(2)}): Tahtada satıcı yok, piyasa alım emri eşleşmez.`;
    else if (isTabanLocked) statusNote = `Taban Kilitli (%${chg.toFixed(2)}): Tahtada alıcı yok, satış emri taban kuyruğunda kilitli!`;
    else if (isCircuitBreaker) statusNote = `Pay Bazında Devre Kesici (%${chg.toFixed(2)}): Aşağı yönlü -%5 eşiği aşıldı; eşleşme bitene kadar işlemler durdu.`;
    else if (isBrutTakas) statusNote = `VBTS Brüt Takas & Kredili İşlem Yasağı: Aynı gün al-sat ve kredili alım kapalıdır; T+2 takas nakdi kullanılamaz.`;

    return { tickSize, isTavanLocked, isTabanLocked, isCircuitBreaker, isBrutTakas, marginAllowed, statusNote };
  }

  // --------------------------------------------------------------------------
  // 3. 69 TEMEL VARLIK + 619 BIST ŞİRKETİ KATALOG MOTORU
  // --------------------------------------------------------------------------
  function getUsdTry() {
    const d = marketData?.macro?.usdTry || assetCatalog.get('doviz-usd')?.priceTL || 50.44;
    return Number(d) > 0 ? Number(d) : 50.44;
  }

  function getAnnualInflationPct() {
    const inf = marketData?.macro?.cpiYoy
      || marketData?.macro?.tuikInflationYoY
      || marketData?.kitchenIntelSummary?.openHorizon?.macroChains?.ratesAndInflation?.tuikCpiYoY
      || 29.77;
    return Number(inf) > 0 ? Number(inf) : 29.77;
  }

  function getAnnualMarginRatePct() {
    const upper = Number(marketData?.macro?.tcmbUpperRate || marketData?.macro?.tcmbPolicyRate || 36);
    return +(upper + 16.0).toFixed(2); // Gerçek Türkiye aracı kurum kredili hisse faizi (~%52-%55)
  }

  function getDarphanePremiumInfo() {
    const s1 = assetCatalog.get('altin-sertifikasi');
    const spot = assetCatalog.get('gram-altin-spot');
    const s1Price = s1 ? s1.priceTL : 69.37;
    const spotPrice = spot ? spot.priceTL : 6115.0;
    const s1GramEquiv = +(s1Price * 100).toFixed(2);
    const diffTL = +(s1GramEquiv - spotPrice).toFixed(2);
    const premiumPct = spotPrice > 0 ? +(((s1GramEquiv / spotPrice) - 1) * 100).toFixed(2) : 13.44;
    return { s1SharePrice: s1Price, s1GramEquiv, spotGramPrice: spotPrice, diffTL, premiumPct };
  }

  function getViopEveningSignal() {
    const mc = marketData?.kitchenIntelSummary?.openHorizon?.macroChains?.viopAndSpot || {};
    const spot = Number(mc.xu030Spot || assetCatalog.get('BIST:XU030')?.priceTL || 14641);
    const fut = Number(mc.xu030Fut || assetCatalog.get('BIST:XU030D1!')?.priceTL || 15157);
    const basisPct = spot > 0 ? +(((fut / spot) - 1) * 100).toFixed(2) : 0;
    return { xu030Spot: spot, xu030Fut: fut, basisPct };
  }

  function rebuildAssetCatalog() {
    const prevPrices = new Map();
    for (const [k, v] of assetCatalog.entries()) {
      if (v && v.key === k && v.priceTL > 0) prevPrices.set(k, v.priceTL);
    }

    assetCatalog.clear();
    const kis = marketData?.kitchenIntelSummary || {};
    const bistLookup = kis?.openHorizon?.bistStockLookup || {};
    const pumpSet = new Set(
      (kis?.microstructureAndWhale?.telegramPumpAnomalies || []).map((x) => String(x.ticker || '').toUpperCase())
    );
    const brutSet = new Set(
      (kis?.forensicBoardPatterns626?.vbtsCandidateAlerts || []).map((x) => String(x.ticker || '').toUpperCase())
    );
    const gemMap = new Map(
      (kis?.openHorizon?.bist626AccumulationGems || []).map((x) => [String(x.ticker || '').toUpperCase(), x])
    );
    const trapMap = new Map(
      (kis?.openHorizon?.bist626DistributionTraps || []).map((x) => [String(x.ticker || '').toUpperCase(), x])
    );
    const tmsIllusionSet = new Set(
      (kis?.tms29AuditReport?.tms29IllusionTraps || []).map((x) => String(x.ticker || '').toUpperCase())
    );
    const cashChampSet = new Set(
      (kis?.tms29AuditReport?.cashFlowChampions || []).map((x) => String(x.ticker || '').toUpperCase())
    );
    const mkkAlerts = kis?.mkkFloatDeltaLedger?.lotExpansionAlerts || [];
    const patronSellSet = new Set(
      mkkAlerts
        .filter((x) => Number(x.deltaFloatShares) > 0)
        .map((x) => String(x.ticker || '').toUpperCase())
    );
    const shareBuybackSet = new Set(
      mkkAlerts
        .filter((x) => Number(x.deltaFloatShares) < 0)
        .map((x) => String(x.ticker || '').toUpperCase())
    );

    const usdTry = Number(marketData?.macro?.usdTry)
      || Number((marketData?.instruments || []).find((i) => i.id === 'doviz-usd')?.currentPrice)
      || 50.44;
    const fxChg1D = Number((marketData?.instruments || []).find((i) => i.id === 'doviz-usd')?.change1D) || 0;

    for (const inst of (marketData?.instruments || [])) {
      const sym = String(inst.symbol || '');
      const rawTicker = sym.includes(':') ? sym.split(':')[1] : sym;
      const tUp = rawTicker.toUpperCase();
      const bistRow = sym.startsWith('BIST:') ? (bistLookup[tUp] || null) : null;
      const isForeignUsd = FOREIGN_GVK80_IDS.has(inst.id) || /^(AMEX:|NASDAQ:|OTC:|TVC:PLATINUM|TVC:PALLADIUM)/.test(sym);
      const rawPrice = Number(inst.currentPrice) || 0;
      const priceTL = inst.isRateInstrument
        ? 1.0
        : (isForeignUsd ? +(rawPrice * usdTry).toFixed(2) : +rawPrice.toFixed(4));

      let venue = 'SPOT_24_7';
      let subVenue = 'OTHER';
      if (inst.id === 'gayrimenkul-konut-tcmb') {
        venue = 'BENCHMARK_ONLY';
        subVenue = 'PHYSICAL_INDEX';
      } else if (inst.isRateInstrument) {
        if (sym.startsWith('TEFAS:')) {
          venue = 'TEFAS';
          subVenue = inst.id === 'para-piyasasi-fonu' ? 'TEFAS_PPF' : 'TEFAS_DEBT';
        } else {
          venue = 'BANK_RATE';
          subVenue = inst.id.startsWith('mevduat-') || inst.id === 'katilim-hesabi' ? 'TERM_DEPOSIT' : 'GOV_BOND';
        }
      } else if (TWO_DOOR_FX_METAL_IDS.has(inst.id)) {
        venue = 'TWO_DOOR';
        subVenue = inst.id.startsWith('doviz-') ? 'FX_CASH' : 'PHYSICAL_METAL';
      } else if (sym.startsWith('BIST:')) {
        if (sym.includes('D1!')) {
          venue = 'VIOP';
          subVenue = 'VIOP_INDEX';
        } else if (TAXABLE_175_BIST_ETFS.has(sym)) {
          venue = 'BIST';
          subVenue = 'BIST_TAXABLE_ETF';
        } else if (EQUITY_EXEMPT_BIST_ETFS.has(sym) || sym === 'BIST:XU100' || sym === 'BIST:XU030' || sym === 'BIST:XBANK') {
          venue = 'BIST';
          subVenue = 'BIST_EXEMPT_ETF';
        } else if (sym === 'BIST:ALTIN') {
          venue = 'BIST';
          subVenue = 'DARPHANE_S1';
        } else {
          venue = 'BIST';
          subVenue = 'BIST_STOCK';
        }
      } else if (isForeignUsd) {
        venue = 'GLOBAL_USD';
        subVenue = 'GVK80_USD';
      } else if (sym.startsWith('BINANCE:')) {
        venue = 'CRYPTO_24_7';
        subVenue = 'CRYPTO';
      }

      let stopajPct = Number(inst.taxRatePct) || 0;
      if (TAXABLE_175_BIST_ETFS.has(sym)) stopajPct = 17.5;
      if (EQUITY_EXEMPT_BIST_ETFS.has(sym)) stopajPct = 0;
      if (inst.id === 'dibs-tahvil' || inst.id === 'kira-sertifikasi-sukuk') stopajPct = 0;

      const tlPerf = inst.tlPerf || null;
      const netPerf = inst.netPerf || null;
      const rawChg1D = Number(inst.change1D) || 0;
      const effChg1D = isForeignUsd
        ? (typeof inst.tlChange1D === 'number' ? inst.tlChange1D : +((((1 + rawChg1D / 100) * (1 + fxChg1D / 100)) - 1) * 100).toFixed(2))
        : rawChg1D;

      const descriptor = {
        key: inst.id,
        id: inst.id,
        ticker: tUp || inst.id.toUpperCase(),
        symbol: sym,
        name: inst.name,
        categoryId: String(inst.categoryId || '1'),
        categoryName: inst.categoryName || '',
        venue,
        subVenue,
        isRateInstrument: Boolean(inst.isRateInstrument),
        annualGrossRatePct: inst.isRateInstrument ? rawPrice : 0,
        isForeignUsd,
        priceUsd: isForeignUsd ? rawPrice : null,
        priceTL,
        change1D: effChg1D,
        perf1W: Number(tlPerf?.perf1W ?? netPerf?.perf1W ?? inst.perf1W) || 0,
        perf1M: Number(tlPerf?.perf1M ?? netPerf?.perf1M ?? inst.perf1M) || 0,
        perf3M: Number(tlPerf?.perf3M ?? netPerf?.perf3M ?? inst.perf3M ?? bistRow?.perf3M) || 0,
        perf6M: Number(tlPerf?.perf6M ?? netPerf?.perf6M ?? inst.perf6M ?? bistRow?.perf6M) || 0,
        perf1Y: Number(tlPerf?.perf1Y ?? netPerf?.perf1Y ?? inst.perf1Y ?? bistRow?.perf1Y) || 0,
        perf3Y: tlPerf?.perf3Y ?? netPerf?.perf3Y ?? (inst.perf3Y != null ? Number(inst.perf3Y) : null),
        perf5Y: tlPerf?.perf5Y ?? netPerf?.perf5Y ?? (inst.perf5Y != null ? Number(inst.perf5Y) : null),
        stopajPct,
        bsmvBuyPct: venue === 'TWO_DOOR' ? 0.20 : 0,
        isGvk80: isForeignUsd,
        bistRow,
        trainedDaily: inst.trainedDaily || null,
        isPumpAnomaly: pumpSet.has(tUp),
        isBrutTakas: brutSet.has(tUp),
        accumulationGem: gemMap.get(tUp) || null,
        distributionTrap: trapMap.get(tUp) || null,
        isTms29Illusion: tmsIllusionSet.has(tUp),
        isCashChampion: cashChampSet.has(tUp),
        isPatronSelling: patronSellSet.has(tUp),
        isShareBuyback: shareBuybackSet.has(tUp),
        verifyUrl: inst.verifyUrl || null
      };

      const oldP = prevPrices.get(descriptor.key);
      if (oldP && Math.abs(descriptor.priceTL - oldP) > 0.0001) {
        priceFlashMap.set(descriptor.key, descriptor.priceTL > oldP ? 'up' : 'down');
      }

      assetCatalog.set(inst.id, descriptor);
      if (sym) assetCatalog.set(sym.toUpperCase(), descriptor);
      if (tUp && sym.startsWith('BIST:')) {
        assetCatalog.set('BIST:' + tUp, descriptor);
        assetCatalog.set(tUp, descriptor);
        assetCatalog.set('bist-' + tUp.toLowerCase(), descriptor);
      }
    }

    // 619 BIST Şirketinin Tamamı
    for (const [ticker, row] of Object.entries(bistLookup)) {
      const tUp = String(ticker || '').toUpperCase();
      if (!tUp) continue;
      const bistKey = 'BIST:' + tUp;
      const existing = assetCatalog.get(bistKey);
      if (existing) {
        existing.bistRow = row;
        existing.isPumpAnomaly = pumpSet.has(tUp);
        existing.isBrutTakas = brutSet.has(tUp);
        existing.accumulationGem = gemMap.get(tUp) || existing.accumulationGem;
        existing.distributionTrap = trapMap.get(tUp) || existing.distributionTrap;
        existing.isTms29Illusion = tmsIllusionSet.has(tUp);
        existing.isCashChampion = cashChampSet.has(tUp);
        existing.isPatronSelling = patronSellSet.has(tUp);
        existing.isShareBuyback = shareBuybackSet.has(tUp);
        if (!existing.perf6M && row.perf6M) existing.perf6M = Number(row.perf6M) || 0;
        assetCatalog.set(tUp, existing);
        assetCatalog.set('bist-' + tUp.toLowerCase(), existing);
        continue;
      }
      const desc = {
        key: 'bist-' + tUp.toLowerCase(),
        id: 'bist-' + tUp.toLowerCase(),
        ticker: tUp,
        symbol: bistKey,
        name: row.name || tUp,
        categoryId: '3',
        categoryName: row.sector || 'Borsa İstanbul Şirketi',
        venue: 'BIST',
        subVenue: 'BIST_STOCK',
        isRateInstrument: false,
        annualGrossRatePct: 0,
        isForeignUsd: false,
        priceUsd: null,
        priceTL: Number(row.close) || 0,
        change1D: Number(row.change1D) || 0,
        perf1W: Number(row.perf1W) || 0,
        perf1M: Number(row.perf1M) || 0,
        perf3M: Number(row.perf3M) || 0,
        perf6M: Number(row.perf6M) || 0,
        perf1Y: Number(row.perf1Y) || 0,
        perf3Y: null,
        perf5Y: null,
        stopajPct: 0,
        bsmvBuyPct: 0,
        isGvk80: false,
        bistRow: row,
        trainedDaily: null,
        isPumpAnomaly: pumpSet.has(tUp),
        isBrutTakas: brutSet.has(tUp),
        accumulationGem: gemMap.get(tUp) || null,
        distributionTrap: trapMap.get(tUp) || null,
        isTms29Illusion: tmsIllusionSet.has(tUp),
        isCashChampion: cashChampSet.has(tUp),
        isPatronSelling: patronSellSet.has(tUp),
        isShareBuyback: shareBuybackSet.has(tUp),
        verifyUrl: `https://tr.tradingview.com/symbols/BIST-${tUp}/`
      };
      const oldP = prevPrices.get(desc.key);
      if (oldP && Math.abs(desc.priceTL - oldP) > 0.0001) {
        priceFlashMap.set(desc.key, desc.priceTL > oldP ? 'up' : 'down');
      }
      assetCatalog.set(desc.key, desc);
      assetCatalog.set(bistKey, desc);
      assetCatalog.set(tUp, desc);
    }

    // Halka arz dağıtımından gelebilecek payları tüm cihazlarda (Canlı Lig dahil) önden kaydet
    for (const ipo of IPO_STATIC_DEFS) {
      const synthKey = 'bist-' + ipo.ticker.toLowerCase();
      if (!assetCatalog.has(synthKey)) {
        const ipoDesc = {
          key: synthKey,
          id: synthKey,
          ticker: ipo.ticker,
          symbol: 'BIST:' + ipo.ticker,
          name: ipo.name,
          categoryId: '3',
          categoryName: ipo.sector,
          venue: 'BIST',
          subVenue: 'BIST_STOCK',
          isSyntheticIpo: true,
          ipoId: ipo.id,
          isRateInstrument: false,
          annualGrossRatePct: 0,
          isForeignUsd: false,
          priceUsd: null,
          priceTL: ipo.offerPriceTL,
          change1D: 0,
          perf1W: 0,
          perf1M: 0,
          perf3M: 0,
          perf6M: 0,
          perf1Y: 0,
          perf3Y: null,
          perf5Y: null,
          stopajPct: 0,
          bsmvBuyPct: 0,
          isGvk80: false,
          bistRow: null
        };
        assetCatalog.set(synthKey, ipoDesc);
        assetCatalog.set('BIST:' + ipo.ticker, ipoDesc);
        assetCatalog.set(ipo.ticker, ipoDesc);
      }
    }
  }

  function getAsset(idOrSym) {
    if (!idOrSym) return null;
    const raw = String(idOrSym).trim();
    return assetCatalog.get(raw)
      || assetCatalog.get(raw.toUpperCase())
      || assetCatalog.get('BIST:' + raw.toUpperCase())
      || assetCatalog.get('bist-' + raw.toLowerCase())
      || null;
  }

  // --------------------------------------------------------------------------
  // 4. SPK HALKA ARZ (IPO) VE GERÇEK TEMETTÜ TAKVİMİ MOTORU (SABİT TAKVİM ÇAPALI)
  // --------------------------------------------------------------------------
  const IPO_EPOCH_MONDAY_MS = Date.UTC(2026, 0, 5, 7, 0, 0); // Pazartesi 05.01.2026 10:00 TR
  const IPO_STATIC_DEFS = [
    {
      id: 'ipo_endustri_teknik_2026',
      ticker: 'ENTEK',
      name: 'Anadolu Güç Sistemleri & Trafo Sanayi A.Ş.',
      sector: 'Enerji Ekipmanları & İhracat',
      offerPriceTL: 42.50,
      totalOfferedLots: 18500000,
      estimatedParticipants: 485000, // Kişi başı ~38 lot (~1.615 ₺)
      distributionMethod: 'Tamamı Eşit Dağıtım (Bireysel)',
      lockUpDays: 180,
      bizDayOffsetInWeek: 3, // Haftanın 4. iş günü (Perşembe 17:00) sabit kapanış
      netCashUseNote: 'Gelirin %65’i yeni yüksek gerilim trafo fabrikası (CAPEX), %35’i işletme sermayesi.',
      statusLabel: 'Talep Toplama Açık (10:30–17:00)'
    },
    {
      id: 'ipo_liman_lojistik_2026',
      ticker: 'MRLOG',
      name: 'Marmara Konteyner ve Soğuk Zincir Lojistik A.Ş.',
      sector: 'Ulaştırma & Lojistik',
      offerPriceTL: 28.80,
      totalOfferedLots: 24000000,
      estimatedParticipants: 540000, // Kişi başı ~44 lot (~1.267 ₺)
      distributionMethod: 'Bireysele Eşit Dağıtım',
      lockUpDays: 365,
      bizDayOffsetInWeek: 4, // Haftanın 5. iş günü (Cuma 17:00) sabit kapanış
      netCashUseNote: 'Gelirin %80’i döviz cinsi liman vinci ve soğuk hava deposu yatırımı, %20’si kredi kapama.',
      statusLabel: 'SPK Bülteni Onaylı · Talep Toplamada'
    }
  ];

  function getActiveIpoCatalog(customNowMs) {
    const clock = getTurkishClock(customNowMs);
    const nowMs = clock.ms;
    const weekSpanMs = 7 * 24 * 3600 * 1000;
    const weekIdx = Math.floor((nowMs - IPO_EPOCH_MONDAY_MS) / weekSpanMs);
    const weekStartMs = IPO_EPOCH_MONDAY_MS + weekIdx * weekSpanMs;

    return IPO_STATIC_DEFS.map((def) => {
      let closesAtMs = addTurkishBusinessDays(weekStartMs, def.bizDayOffsetInWeek, 17, 0);
      let cycleTag = 'w' + weekIdx;
      if (closesAtMs <= nowMs) {
        closesAtMs = addTurkishBusinessDays(weekStartMs + weekSpanMs, def.bizDayOffsetInWeek, 17, 0);
        cycleTag = 'w' + (weekIdx + 1);
      }
      const closeParts = getIstanbulParts(closesAtMs);
      return {
        ...def,
        cycleId: `${def.id}_${cycleTag}`,
        closesAtMs,
        closesDateYmd: closeParts.ymd
      };
    });
  }

  const DIVIDEND_STATIC_CANDIDATES = [
    { ticker: 'TUPRS', bizOffset: 10, grossYieldOverride: null, frequency: 'Yılda 2 Taksit Nakit Temettü' },
    { ticker: 'FROTO', bizOffset: 15, grossYieldOverride: null, frequency: 'Yılda 2 Taksit Euro İhracat Temettüsü' },
    { ticker: 'BIMAS', bizOffset: 21, grossYieldOverride: null, frequency: 'Düzenli Perakende Kasa Temettüsü' },
    { ticker: 'ISMEN', bizOffset: 28, grossYieldOverride: null, frequency: 'Yüksek Nakit Dağıtım Geleneği' },
    { ticker: 'DOAS', bizOffset: 34, grossYieldOverride: null, frequency: 'Otomotiv Nakit Temettü Ödeyicisi' },
    { ticker: 'ENJSA', bizOffset: 41, grossYieldOverride: null, frequency: 'Dağıtım Şebekesi Nakit Temettüsü' },
    { ticker: 'TTRAK', bizOffset: 48, grossYieldOverride: null, frequency: 'Sanayi Temettü Klasiği' },
    { ticker: 'SISE', bizOffset: 55, grossYieldOverride: null, frequency: 'Küresel Cam & Soda Temettüsü' }
  ];

  function buildDividendEntryForAnchor(c, anchorMs) {
    const asset = getAsset(c.ticker);
    const price = asset?.priceTL || 100;
    const rawYield = Number(c.grossYieldOverride || asset?.bistRow?.dividendYield || 4.8);
    const effectiveGrossYieldPct = Math.max(2.2, rawYield);
    const grossPerShareTL = +(price * (effectiveGrossYieldPct / 100)).toFixed(2);
    const netPerShareTL = +(grossPerShareTL * 0.85).toFixed(2); // %15 gerçek kişi temettü stopajı
    const payMs = addTurkishBusinessDays(anchorMs, c.bizOffset, 10, 0);
    const payParts = getIstanbulParts(payMs);
    return {
      ticker: c.ticker,
      assetKey: asset ? asset.key : ('bist-' + c.ticker.toLowerCase()),
      name: asset ? asset.name : c.ticker,
      priceTL: price,
      grossYieldPct: +effectiveGrossYieldPct.toFixed(2),
      netYieldPct: +(effectiveGrossYieldPct * 0.85).toFixed(2),
      grossPerShareTL,
      netPerShareTL,
      payDateYmd: payParts.ymd,
      payAtMs: payMs,
      frequency: c.frequency
    };
  }

  function getSemiAnnualAnchorsAround(nowMs) {
    const p = getIstanbulParts(nowMs);
    return [
      Date.UTC(p.year - 1, 10, 16, 7, 0, 0),
      Date.UTC(p.year, 3, 15, 7, 0, 0),
      Date.UTC(p.year, 10, 16, 7, 0, 0),
      Date.UTC(p.year + 1, 3, 15, 7, 0, 0)
    ];
  }

  function getDividendSchedule(customNowMs, includeRecentPayable = false) {
    const nowMs = getTurkishClock(customNowMs).ms;
    const anchors = getSemiAnnualAnchorsAround(nowMs);

    if (includeRecentPayable) {
      const allWindow = [];
      for (const anc of anchors) {
        for (const c of DIVIDEND_STATIC_CANDIDATES) {
          const entry = buildDividendEntryForAnchor(c, anc);
          if (entry.payAtMs <= nowMs && (nowMs - entry.payAtMs) <= 60 * 24 * 3600 * 1000) {
            allWindow.push(entry);
          }
        }
      }
      return allWindow;
    }

    return DIVIDEND_STATIC_CANDIDATES.map((c) => {
      for (const anc of anchors) {
        const entry = buildDividendEntryForAnchor(c, anc);
        if (entry.payAtMs >= nowMs - 24 * 3600 * 1000) {
          return entry;
        }
      }
      return buildDividendEntryForAnchor(c, anchors[anchors.length - 1]);
    }).sort((a, b) => a.payAtMs - b.payAtMs);
  }

  // --------------------------------------------------------------------------
  // 5. CİHAZ BAZLI YATIRIMCI KİMLİĞİ & AÇIK LİG EYALET DEFTERİ
  // --------------------------------------------------------------------------
  function captureCurrentBenchmarkPrices() {
    return {
      goldPrice: getAsset('gram-altin-spot')?.priceTL || 6115,
      usdPrice: getAsset('doviz-usd')?.priceTL || 50.44,
      bistPrice: getAsset('bist-100')?.priceTL || 11677,
      depositNetAnnualPct: +(((getAsset('mevduat-ust')?.annualGrossRatePct || 39) * (1 - 0.175))).toFixed(2),
      sukukNetAnnualPct: +(getAsset('kira-sertifikasi-sukuk')?.annualGrossRatePct || 36.5).toFixed(2)
    };
  }

  function pickAvatarColor(seedStr) {
    let h = 0;
    const s = String(seedStr || 'aether');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
  }

  function createDeviceInvestor(deviceId, name, roleLabel) {
    const now = Date.now();
    const cleanName = String(name || '').trim().slice(0, 28) || 'Yatırımcı';
    return {
      id: deviceId,
      deviceId,
      name: cleanName,
      roleLabel: String(roleLabel || '1 Milyon ₺ Yatırımcısı').trim().slice(0, 32),
      avatarColor: pickAvatarColor(deviceId + cleanName),
      deviceLabel: detectDeviceLabel(),
      profileRegistered: Boolean(name && String(name).trim().length > 0),
      rev: 1,
      createdAt: now,
      updatedAt: now,
      lastSeenAt: now,
      baselineCapitalTL: DEFAULT_STARTING_CAPITAL_TL,
      monthlyExpenseTL: 40000,
      monthlySavingsTL: 0,
      salaryDay: 15,
      lastSalaryCreditedYm: getIstanbulParts(now).ym,
      cashTL: DEFAULT_STARTING_CAPITAL_TL,
      marginDebtTL: 0,
      gvk80TaxPayableTL: 0,
      autoOvernightRepo: false,
      overnightRepoEarnedTL: 0,
      lastOvernightRepoMs: now,
      lastMarginAccrualMs: now,
      totalFrictionBurnedTL: 0,
      benchmarksAtStart: captureCurrentBenchmarkPrices(),
      ghostHoldPortfolio: null,
      settlementQueue: [],
      pendingOrders: [],
      rateTranches: [],
      positions: {},
      ipoRequests: [],
      creditedDividends: {},
      tradeHistory: [],
      footprints: [],
      idleErosionLog: {
        lastCheckedMs: now,
        cumulativeInflationLossTL: 0,
        missedSukukNetTL: 0
      },
      livedMilestones: {
        executedRealOrder: false,
        waitedSettlementOrValor: false,
        inspectedCashScale: false,
        wroteInvestmentThesis: false
      }
    };
  }

  function createInitialState() {
    const slotSuffix = getInvestorSlotSuffix();
    const deviceId = slotSuffix
      ? ('inv' + slotSuffix)
      : ('inv_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4));
    const me = createDeviceInvestor(deviceId, '', '1 Milyon ₺ Portföy Yöneticisi');
    return {
      version: '13.1.0',
      roomCode: DEFAULT_ROOM_CODE,
      localDeviceId: deviceId,
      me,
      peers: {},
      banterFeed: []
    };
  }

  function normalizeLoadedState(parsed) {
    if (!parsed || !parsed.me || !parsed.me.id) return null;
    const me = parsed.me;
    me.deviceId = me.deviceId || me.id;
    me.deviceLabel = detectDeviceLabel();
    me.avatarColor = me.avatarColor || pickAvatarColor(me.id);
    me.rev = Number(me.rev) || 1;
    me.marginDebtTL = Number(me.marginDebtTL) || 0;
    me.gvk80TaxPayableTL = Number(me.gvk80TaxPayableTL) || 0;
    me.autoOvernightRepo = Boolean(me.autoOvernightRepo);
    me.overnightRepoEarnedTL = Number(me.overnightRepoEarnedTL) || 0;
    me.lastOvernightRepoMs = Number(me.lastOvernightRepoMs) || Date.now();
    me.lastMarginAccrualMs = Number(me.lastMarginAccrualMs) || Date.now();
    me.totalFrictionBurnedTL = Number(me.totalFrictionBurnedTL) || 0;
    me.ipoRequests = Array.isArray(me.ipoRequests) ? me.ipoRequests : [];
    me.creditedDividends = me.creditedDividends || {};
    me.positions = me.positions || {};
    me.rateTranches = Array.isArray(me.rateTranches) ? me.rateTranches : [];
    me.settlementQueue = Array.isArray(me.settlementQueue) ? me.settlementQueue : [];
    me.pendingOrders = Array.isArray(me.pendingOrders) ? me.pendingOrders : [];
    me.tradeHistory = Array.isArray(me.tradeHistory) ? me.tradeHistory : [];
    me.footprints = Array.isArray(me.footprints) ? me.footprints : [];
    me.livedMilestones = me.livedMilestones || {};
    parsed.roomCode = String(parsed.roomCode || DEFAULT_ROOM_CODE).toUpperCase();
    parsed.peers = parsed.peers && typeof parsed.peers === 'object' ? parsed.peers : {};
    parsed.banterFeed = Array.isArray(parsed.banterFeed) ? parsed.banterFeed : [];
    return parsed;
  }

  function isNewerInvestorState(cand, ref) {
    if (!cand) return false;
    if (!ref) return true;
    const cReg = Boolean(cand.me?.profileRegistered);
    const rReg = Boolean(ref.me?.profileRegistered);
    if (cReg !== rReg) return cReg;
    const cRev = Number(cand.me?.rev) || 0;
    const rRev = Number(ref.me?.rev) || 0;
    if (cRev !== rRev) return cRev > rRev;
    return (Number(cand.me?.updatedAt) || 0) >= (Number(ref.me?.updatedAt) || 0);
  }

  function loadState() {
    const key = getStorageKey();
    let nativeParsed = null;
    let localParsed = null;

    // 1) iOS Native NSUserDefaults Köprüsünden Aday Yükle (Varsa ve slot yoksa)
    if (!getInvestorSlotSuffix() && typeof global.__AETHER_NATIVE_SAVED_STATE__ === 'string' && global.__AETHER_NATIVE_SAVED_STATE__.length > 10) {
      try {
        nativeParsed = normalizeLoadedState(JSON.parse(global.__AETHER_NATIVE_SAVED_STATE__));
      } catch (_) {}
    }

    // 2) Tarayıcı localStorage'dan Aday Yükle
    try {
      const raw = global.localStorage ? global.localStorage.getItem(key) : null;
      if (raw) {
        localParsed = normalizeLoadedState(JSON.parse(raw));
      }
    } catch (_) {}

    // İkisinden en güncel revizyonlu/kayıtlı olanı seç (WKWebView yenilemesinde eski bootScript'in yeni işlemi ezmesini önler!)
    const best = isNewerInvestorState(localParsed, nativeParsed) ? localParsed : nativeParsed;
    if (best) {
      state = best;
      if (!getInvestorSlotSuffix()) {
        global.__AETHER_NATIVE_SAVED_STATE__ = JSON.stringify(best);
      }
      return;
    }

    state = createInitialState();
    saveState(false, false);
  }

  function persistStateLocally() {
    if (!state) return;
    const serialized = JSON.stringify(state);
    try {
      if (global.localStorage) {
        global.localStorage.setItem(getStorageKey(), serialized);
      }
    } catch (_) {}
    if (!getInvestorSlotSuffix()) {
      global.__AETHER_NATIVE_SAVED_STATE__ = serialized;
    }
    // iOS Native Uygulama NSUserDefaults Yedeklemesi
    if (!getInvestorSlotSuffix() && global.webkit?.messageHandlers?.aetherBridge) {
      try {
        global.webkit.messageHandlers.aetherBridge.postMessage({
          action: 'saveState',
          payload: serialized
        });
      } catch (_) {}
    }
  }

  function saveState(emit = true, syncCloud = true) {
    if (!state) return;
    persistStateLocally();
    if (bcChannel) {
      try {
        bcChannel.postMessage({
          type: 'AETHER_V13_PEER',
          roomCode: state.roomCode,
          packet: state.me.profileRegistered ? buildCompactInvestorPacket(state.me) : null,
          banterFeed: state.banterFeed.slice(0, 30)
        });
      } catch (_) {}
    }
    if (emit) notifyListeners();
    if (syncCloud && state.me.profileRegistered) {
      scheduleCloudPublish();
    }
  }

  function getActiveMember() {
    if (!state) loadState();
    return state.me;
  }

  function getAllLeagueMembers() {
    if (!state) loadState();
    const list = [];
    if (state.me) list.push(state.me);
    for (const p of Object.values(state.peers || {})) {
      if (p && p.id && p.id !== state.me.id && p.profileRegistered !== false) {
        list.push(p);
      }
    }
    return list;
  }

  function notifyListeners() {
    for (const fn of listeners) {
      try { fn(state, marketData); } catch (e) { console.error('Listener error:', e); }
    }
  }

  // --------------------------------------------------------------------------
  // 6. KÜRESEL CANLI LİG AĞI — SIFIR BAĞIMLILIKLI BINARY MQTT OVER WSS MESH
  //    (4G/5G Hücresel, Farklı Wi-Fi, iOS .ipa file://, Safari ve Masaüstü!)
  // --------------------------------------------------------------------------
  function encodeMqttVarLen(len) {
    const bytes = [];
    do {
      let digit = len % 128;
      len = Math.floor(len / 128);
      if (len > 0) digit |= 0x80;
      bytes.push(digit);
    } while (len > 0);
    return bytes;
  }

  function encodeMqttUtf8(str) {
    const body = new TextEncoder().encode(String(str || ''));
    const out = new Uint8Array(2 + body.length);
    out[0] = (body.length >> 8) & 0xff;
    out[1] = body.length & 0xff;
    out.set(body, 2);
    return out;
  }

  function concatUint8(arrays) {
    let total = 0;
    for (const a of arrays) total += a.length;
    const out = new Uint8Array(total);
    let offset = 0;
    for (const a of arrays) {
      out.set(a, offset);
      offset += a.length;
    }
    return out;
  }

  function buildMqttConnectPacket(clientId) {
    const proto = encodeMqttUtf8('MQTT');
    const vh = new Uint8Array([0x04, 0x02, 0x00, 0x3c]); // v3.1.1, CleanSession, 60s KeepAlive
    const cid = encodeMqttUtf8(clientId);
    const remLen = proto.length + vh.length + cid.length;
    const fh = new Uint8Array([0x10, ...encodeMqttVarLen(remLen)]);
    return concatUint8([fh, proto, vh, cid]);
  }

  function buildMqttPublishPacket(topic, jsonStr, retain = false) {
    const tBytes = encodeMqttUtf8(topic);
    const pBytes = new TextEncoder().encode(String(jsonStr || ''));
    const remLen = tBytes.length + pBytes.length;
    const fh = new Uint8Array([0x30 | (retain ? 0x01 : 0x00), ...encodeMqttVarLen(remLen)]);
    return concatUint8([fh, tBytes, pBytes]);
  }

  function buildMqttSubscribePacket(topicFilter, packetId = 1) {
    const vh = new Uint8Array([(packetId >> 8) & 0xff, packetId & 0xff]);
    const tf = encodeMqttUtf8(topicFilter);
    const qos = new Uint8Array([0x00]);
    const remLen = vh.length + tf.length + qos.length;
    const fh = new Uint8Array([0x82, ...encodeMqttVarLen(remLen)]);
    return concatUint8([fh, vh, tf, qos]);
  }

  function buildMqttUnsubscribePacket(topicFilter, packetId = 1) {
    const vh = new Uint8Array([(packetId >> 8) & 0xff, packetId & 0xff]);
    const tf = encodeMqttUtf8(topicFilter);
    const remLen = vh.length + tf.length;
    const fh = new Uint8Array([0xA2, ...encodeMqttVarLen(remLen)]);
    return concatUint8([fh, vh, tf]);
  }

  function parseMqttFrames(bufferBytes, onPublish, onConnAck) {
    let offset = 0;
    while (offset < bufferBytes.length) {
      if (offset + 2 > bufferBytes.length) break;
      const header = bufferBytes[offset];
      let idx = offset + 1;
      let mult = 1;
      let remLen = 0;
      let completeLen = false;
      while (idx < bufferBytes.length) {
        const b = bufferBytes[idx++];
        remLen += (b & 0x7f) * mult;
        mult *= 128;
        if ((b & 0x80) === 0) {
          completeLen = true;
          break;
        }
      }
      if (!completeLen || idx + remLen > bufferBytes.length) break;

      const pktType = header & 0xf0;
      const bodyStart = idx;
      const bodyEnd = idx + remLen;

      if (pktType === 0x20) {
        onConnAck();
      } else if (pktType === 0x30 && remLen >= 2) {
        const qos = (header >> 1) & 0x03;
        const tLen = (bufferBytes[bodyStart] << 8) | bufferBytes[bodyStart + 1];
        const tStart = bodyStart + 2;
        const tEnd = tStart + tLen;
        if (tEnd <= bodyEnd) {
          const topic = new TextDecoder('utf-8').decode(bufferBytes.subarray(tStart, tEnd));
          const pStart = qos > 0 ? Math.min(bodyEnd, tEnd + 2) : tEnd;
          const payload = new TextDecoder('utf-8').decode(bufferBytes.subarray(pStart, bodyEnd));
          onPublish(topic, payload);
        }
      }
      offset = bodyEnd;
    }
    return bufferBytes.subarray(offset);
  }

  function getRoomTopicBase() {
    const room = String(state?.roomCode || DEFAULT_ROOM_CODE).toUpperCase().replace(/[^A-Z0-9_-]/g, '') || DEFAULT_ROOM_CODE;
    return `${MESH_NAMESPACE}/${room}`;
  }

  function buildCompactInvestorPacket(inv) {
    const snap = evaluateMemberPortfolio(inv);
    const mastery = evaluateInvestorMastery(inv, snap);
    return {
      v: 13,
      id: inv.id,
      deviceId: inv.deviceId || inv.id,
      name: inv.name,
      roleLabel: inv.roleLabel,
      avatarColor: inv.avatarColor || pickAvatarColor(inv.id),
      deviceLabel: inv.deviceLabel || 'Cihaz',
      profileRegistered: true,
      rev: Number(inv.rev) || 1,
      createdAt: inv.createdAt,
      updatedAt: inv.updatedAt || Date.now(),
      lastSeenAt: Date.now(),
      baselineCapitalTL: inv.baselineCapitalTL || DEFAULT_STARTING_CAPITAL_TL,
      monthlyExpenseTL: inv.monthlyExpenseTL || 40000,
      cashTL: inv.cashTL,
      marginDebtTL: inv.marginDebtTL || 0,
      gvk80TaxPayableTL: inv.gvk80TaxPayableTL || 0,
      autoOvernightRepo: Boolean(inv.autoOvernightRepo),
      totalFrictionBurnedTL: inv.totalFrictionBurnedTL || 0,
      benchmarksAtStart: inv.benchmarksAtStart || captureCurrentBenchmarkPrices(),
      settlementQueue: (inv.settlementQueue || []).slice(0, 10),
      pendingOrders: (inv.pendingOrders || []).slice(0, 10),
      ipoRequests: (inv.ipoRequests || []).slice(0, 8),
      rateTranches: (inv.rateTranches || []).slice(0, 12),
      positions: inv.positions || {},
      tradeHistory: (inv.tradeHistory || []).slice(0, 10),
      footprints: (inv.footprints || []).slice(0, 6),
      masteryScore: mastery.overallScore,
      masteryRank: mastery.rankTitle
    };
  }

  function mergeIncomingPeerPacket(pkt) {
    if (!pkt || !pkt.id || !pkt.name || pkt.profileRegistered === false) return false;
    if (state && pkt.id === state.me.id) return false;
    const prev = state.peers[pkt.id];
    const incRev = Number(pkt.rev) || 0;
    const prevRev = Number(prev?.rev) || 0;
    const incUpd = Number(pkt.updatedAt) || 0;
    const prevUpd = Number(prev?.updatedAt) || 0;
    const incSeen = Number(pkt.lastSeenAt) || incUpd;
    const prevSeen = Number(prev?.lastSeenAt) || prevUpd;
    const incCreated = Number(pkt.createdAt) || 0;
    const prevCreated = Number(prev?.createdAt) || 0;
    const isFreshReset = incCreated > prevCreated + 1500 && incUpd >= prevUpd;

    if (!prev || isFreshReset || incRev > prevRev || (incRev === prevRev && (incUpd >= prevUpd || incSeen > prevSeen))) {
      state.peers[pkt.id] = {
        ...prev,
        ...pkt,
        lastSeenAt: Math.max(incSeen, prevSeen)
      };
      return true;
    }
    return false;
  }

  function mergeIncomingBanter(items) {
    if (!Array.isArray(items) || items.length === 0) return false;
    const seen = new Set((state.banterFeed || []).map((x) => x.id));
    let added = false;
    for (const item of items) {
      if (item && item.id && !seen.has(item.id) && item.text) {
        state.banterFeed.push(item);
        seen.add(item.id);
        added = true;
      }
    }
    if (added) {
      state.banterFeed.sort((a, b) => (b.ts || 0) - (a.ts || 0));
      if (state.banterFeed.length > 40) state.banterFeed.length = 40;
    }
    return added;
  }

  function handleMeshMessage(topic, payloadStr) {
    if (!payloadStr || !state) return;
    try {
      const base = getRoomTopicBase();
      if (topic.startsWith(base + '/member/')) {
        const pkt = JSON.parse(payloadStr);
        if (mergeIncomingPeerPacket(pkt)) {
          persistStateLocally();
          notifyListeners();
        }
        return;
      }
      if (topic === base + '/event') {
        const ev = JSON.parse(payloadStr);
        let changed = false;
        if (ev.memberPacket && mergeIncomingPeerPacket(ev.memberPacket)) changed = true;
        if (ev.banterItem && mergeIncomingBanter([ev.banterItem])) changed = true;
        if (changed) {
          persistStateLocally();
          notifyListeners();
        }
        return;
      }
      if (topic === base + '/banter_snapshot') {
        const snap = JSON.parse(payloadStr);
        if (Array.isArray(snap.items) && mergeIncomingBanter(snap.items)) {
          persistStateLocally();
          notifyListeners();
        }
        return;
      }
      if (topic === base + '/sync_ping') {
        const ping = JSON.parse(payloadStr);
        if (ping && ping.senderId !== state.me.id) {
          const now = Date.now();
          if (now - lastSyncPingMs > 4000) {
            lastSyncPingMs = now;
            setTimeout(() => {
              if (state.me.profileRegistered) publishMyInvestorToMesh();
            }, 180 + Math.floor(Math.random() * 420));
          }
        }
        return;
      }
      if (topic === `${MESH_NAMESPACE}/market_pulse`) {
        const pulse = JSON.parse(payloadStr);
        if (pulse && pulse.ts && pulse.ts > lastLiveSyncMs) {
          applyMarketPulsePacket(pulse);
        }
      }
    } catch (_) {}
  }

  function applyMarketPulsePacket(pulse) {
    if (!pulse) return;
    if (pulse.macro && marketData.macro) {
      Object.assign(marketData.macro, pulse.macro);
    }
    if (pulse.prices && typeof pulse.prices === 'object') {
      for (const inst of (marketData.instruments || [])) {
        const p = pulse.prices[inst.id];
        if (p && p.p > 0) {
          inst.currentPrice = p.p;
          if (p.c != null) inst.change1D = p.c;
          if (p.tlc != null) inst.tlChange1D = p.tlc;
        }
      }
    }
    if (Array.isArray(pulse.feed) && pulse.feed.length > 0) {
      marketData.liveRealWorldFeed = pulse.feed;
    }
    lastLiveSyncMs = Date.now();
    rebuildAssetCatalog();
    notifyListeners();
  }

  let mqttSubPacketSeq = 10;
  function subscribeSocketToActiveRoom(ws) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const base = getRoomTopicBase();
    const s = () => ((mqttSubPacketSeq = (mqttSubPacketSeq % 60000) + 1));
    ws.send(buildMqttSubscribePacket(`${base}/member/+`, s()));
    ws.send(buildMqttSubscribePacket(`${base}/event`, s()));
    ws.send(buildMqttSubscribePacket(`${base}/banter_snapshot`, s()));
    ws.send(buildMqttSubscribePacket(`${base}/sync_ping`, s()));
    ws.send(buildMqttSubscribePacket(`${MESH_NAMESPACE}/market_pulse`, s()));
    if (state?.me?.profileRegistered) {
      const pkt = JSON.stringify(buildCompactInvestorPacket(state.me));
      ws.send(buildMqttPublishPacket(`${base}/member/${state.me.id}`, pkt, true));
    }
    ws.send(buildMqttPublishPacket(`${base}/sync_ping`, JSON.stringify({ senderId: state?.me?.id, ts: Date.now() }), false));
  }

  function connectBrokerClient(brokerUrl) {
    if (typeof WebSocket === 'undefined') return;
    if (meshClients.has(brokerUrl)) {
      const ex = meshClients.get(brokerUrl);
      if (ex.ws && (ex.ws.readyState === WebSocket.OPEN || ex.ws.readyState === WebSocket.CONNECTING)) return;
    }

    const clientState = {
      url: brokerUrl,
      ws: null,
      connected: false,
      rxBuf: new Uint8Array(0),
      pingTimer: null,
      reconnectTimer: null
    };
    meshClients.set(brokerUrl, clientState);

    try {
      const ws = new WebSocket(brokerUrl, 'mqtt');
      ws.binaryType = 'arraybuffer';
      clientState.ws = ws;

      ws.onopen = () => {
        const cid = 'ae13_' + (state?.me?.id || 'anon').slice(-8) + '_' + Math.random().toString(36).slice(2, 6);
        ws.send(buildMqttConnectPacket(cid));
      };

      ws.onmessage = (ev) => {
        const chunk = new Uint8Array(ev.data);
        clientState.rxBuf = concatUint8([clientState.rxBuf, chunk]);
        clientState.rxBuf = parseMqttFrames(
          clientState.rxBuf,
          (topic, payload) => handleMeshMessage(topic, payload),
          () => {
            clientState.connected = true;
            subscribeSocketToActiveRoom(ws);

            clearInterval(clientState.pingTimer);
            clientState.pingTimer = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                try { ws.send(new Uint8Array([0xc0, 0x00])); } catch (_) {}
              }
            }, 25000);
            notifyListeners();
          }
        );
      };

      const onDrop = () => {
        clientState.connected = false;
        clearInterval(clientState.pingTimer);
        clearTimeout(clientState.reconnectTimer);
        clientState.reconnectTimer = setTimeout(() => connectBrokerClient(brokerUrl), 4500 + Math.floor(Math.random() * 2500));
        notifyListeners();
      };
      ws.onerror = onDrop;
      ws.onclose = onDrop;
    } catch (_) {}
  }

  function startCloudMesh() {
    for (const url of MQTT_BROKERS) {
      connectBrokerClient(url);
    }
  }

  function broadcastMqttPacket(topic, obj, retain = false) {
    const str = JSON.stringify(obj);
    for (const c of meshClients.values()) {
      if (c.connected && c.ws && c.ws.readyState === WebSocket.OPEN) {
        try {
          c.ws.send(buildMqttPublishPacket(topic, str, retain));
        } catch (_) {}
      }
    }
  }

  function publishMyInvestorToMesh(liveEventBanter = null) {
    if (!state || !state.me || !state.me.profileRegistered) return;
    state.me.lastSeenAt = Date.now();
    const myPacket = buildCompactInvestorPacket(state.me);
    const base = getRoomTopicBase();
    broadcastMqttPacket(`${base}/member/${state.me.id}`, myPacket, true);
    if (liveEventBanter) {
      broadcastMqttPacket(`${base}/event`, { memberPacket: myPacket, banterItem: liveEventBanter }, false);
      broadcastMqttPacket(`${base}/banter_snapshot`, { ts: Date.now(), items: state.banterFeed.slice(0, 30) }, true);
    }
    syncHttpFamilyHubAsync(myPacket);
  }

  function scheduleCloudPublish() {
    clearTimeout(meshPublishTimer);
    meshPublishTimer = setTimeout(() => {
      publishMyInvestorToMesh();
    }, 220);
  }

  async function syncHttpFamilyHubAsync(myPacketOverride) {
    if (!global.fetch || global.location?.protocol === 'file:' || !state) return;
    const reqRoom = String(state.roomCode || DEFAULT_ROOM_CODE).toUpperCase();
    try {
      const pkt = myPacketOverride || (state?.me?.profileRegistered ? buildCompactInvestorPacket(state.me) : null);
      const res = pkt
        ? await fetch('./api/family-hub', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
            body: JSON.stringify({ roomCode: reqRoom, member: pkt, banterFeed: state.banterFeed.slice(0, 30) })
          })
        : await fetch('./api/family-hub?room=' + encodeURIComponent(reqRoom), { cache: 'no-store' });

      if (res.ok) {
        const data = await res.json();
        const currentRoom = String(state?.roomCode || DEFAULT_ROOM_CODE).toUpperCase();
        if (!state || currentRoom !== reqRoom || (data.roomCode && String(data.roomCode).toUpperCase() !== reqRoom)) {
          return;
        }
        let changed = false;
        for (const m of (data.members || [])) {
          if (mergeIncomingPeerPacket(m)) changed = true;
        }
        if (mergeIncomingBanter(data.banterFeed || [])) changed = true;
        if (changed) {
          persistStateLocally();
          notifyListeners();
        }
      }
    } catch (_) {}
  }

  function getLeagueStatus() {
    let connectedBrokers = 0;
    for (const c of meshClients.values()) {
      if (c.connected) connectedBrokers++;
    }
    const all = getAllLeagueMembers();
    const now = Date.now();
    const onlineCount = all.filter((m) => m.id === state?.me?.id || (now - (m.lastSeenAt || m.updatedAt || 0)) < 75000).length;
    return {
      connectedBrokers,
      totalBrokers: MQTT_BROKERS.length,
      isOnline: connectedBrokers > 0,
      roomCode: state?.roomCode || DEFAULT_ROOM_CODE,
      investorCount: all.filter((m) => m.profileRegistered !== false).length,
      onlineCount
    };
  }

  // --------------------------------------------------------------------------
  // 7. OTOMATİK ZAMAN KANCALARI: T+2 TAKAS, VALÖR, MAAŞ, KREDİ FAİZİ, TEMETTÜ & HALKA ARZ
  // --------------------------------------------------------------------------
  function recordFootprint(member, code, title, detail, leakTL = 0) {
    if (!member.footprints) member.footprints = [];
    const todayYmd = getIstanbulParts().ymd;
    const dup = member.footprints.find((f) => f.code === code && getIstanbulParts(f.ts).ymd === todayYmd);
    if (dup) {
      if (leakTL > 0) dup.leakTL = +(Number(dup.leakTL || 0) + leakTL).toFixed(2);
      return;
    }
    member.footprints.unshift({
      id: 'fp_' + Math.random().toString(36).slice(2, 9),
      ts: Date.now(),
      code,
      title,
      detail,
      leakTL: +Number(leakTL || 0).toFixed(2)
    });
    if (member.footprints.length > 40) member.footprints.length = 40;
  }

  function getOvernightRepoNetAnnualPct() {
    const policy = Number(marketData?.macro?.tcmbPolicyRate || 36.0);
    const grossRepo = Math.max(5.0, policy - 2.5);
    return +(grossRepo * (1 - 0.175)).toFixed(2);
  }

  function maybeSnapshotGhostHoldPortfolio(member) {
    if (member.ghostHoldPortfolio) return;
    const snap = evaluateMemberPortfolio(member);
    const investedTL = snap.tranchesNetTL + snap.spotNetAfterTaxTL;
    if (investedTL >= member.baselineCapitalTL * 0.25) {
      const clonePos = {};
      for (const [k, v] of Object.entries(member.positions || {})) {
        if (v && v.qty > 0) clonePos[k] = { ...v };
      }
      const cloneTr = (member.rateTranches || []).map((t) => ({ ...t }));
      const extraCashPoolTL = +(snap.unsettledTL + snap.pendingOrderTL + snap.ipoBlockedTL).toFixed(2);
      member.ghostHoldPortfolio = {
        capturedAtMs: getTurkishClock().ms,
        cashTL: +(member.cashTL + extraCashPoolTL).toFixed(2),
        marginDebtTL: snap.marginDebtTL,
        gvk80TaxPayableTL: Number(member.gvk80TaxPayableTL) || 0,
        positions: clonePos,
        rateTranches: cloneTr
      };
    }
  }

  function processTimeHooksForMember(member, customNowMs) {
    const clock = getTurkishClock(customNowMs);
    const nowMs = clock.ms;
    let changed = false;

    // 1) T+2 BIST Takas & TEFAS Bozum Valörü Kum Saati Çözülmesi
    const stillUnsettled = [];
    for (const item of (member.settlementQueue || [])) {
      if (nowMs >= item.settlesAtMs) {
        member.cashTL = +(member.cashTL + Number(item.grossTL || 0)).toFixed(2);
        member.livedMilestones.waitedSettlementOrValor = true;
        changed = true;
      } else {
        stillUnsettled.push(item);
      }
    }
    member.settlementQueue = stillUnsettled;

    // 2) Bekleyen TEFAS Valör ve BIST Açılış Emirlerinin Eşleşmesi
    const stillPending = [];
    for (const ord of (member.pendingOrders || [])) {
      if (nowMs >= ord.executesAtMs) {
        const asset = getAsset(ord.assetKey);
        if (!asset) continue;
        if (ord.side === 'BUY') {
          if (asset.isRateInstrument) {
            member.rateTranches.push({
              id: 'tr_' + Math.random().toString(36).slice(2, 9),
              assetKey: asset.key,
              name: asset.name,
              principalTL: ord.reservedTL,
              annualGrossPct: asset.annualGrossRatePct,
              stopajPct: asset.stopajPct,
              openedAtMs: nowMs,
              maturityDays: 0,
              maturesAtMs: 0,
              isTermDeposit: false
            });
          } else {
            const execPrice = asset.priceTL > 0 ? asset.priceTL : 1;
            const feePct = asset.venue === 'BIST' ? 0.00084 : 0;
            const feeTL = +(ord.reservedTL * feePct).toFixed(2);
            const netInvestTL = Math.max(0, ord.reservedTL - feeTL);
            const qty = asset.venue === 'BIST' && asset.subVenue === 'BIST_STOCK'
              ? Math.floor(netInvestTL / execPrice)
              : +(netInvestTL / execPrice).toFixed(6);
            const spentTL = +(qty * execPrice + feeTL).toFixed(2);
            const refundTL = Math.max(0, +(ord.reservedTL - spentTL).toFixed(2));
            if (refundTL > 0) member.cashTL = +(member.cashTL + refundTL).toFixed(2);
            member.totalFrictionBurnedTL = +((member.totalFrictionBurnedTL || 0) + feeTL).toFixed(2);
            if (qty > 0) {
              mergeSpotPosition(member, asset, qty, execPrice, clock.ymd, ord.door || 'STANDARD', ord.thesisTag, ord.thesisNote);
            }
          }
          member.livedMilestones.waitedSettlementOrValor = true;
          maybeSnapshotGhostHoldPortfolio(member);
          changed = true;
        } else if (ord.side === 'SELL') {
          const execPrice = asset.priceTL > 0 ? asset.priceTL : 1;
          const pos = member.positions[asset.key];
          if (pos && pos.qty > 0) {
            const sellQty = Math.min(pos.qty, ord.qty || pos.qty);
            settleSpotSale(member, asset, sellQty, execPrice, nowMs, ord.door || 'STANDARD', true);
            member.livedMilestones.waitedSettlementOrValor = true;
            changed = true;
          }
        }
      } else {
        stillPending.push(ord);
      }
    }
    member.pendingOrders = stillPending;

    // 3) SPK Halka Arz Dağıtım Günü Geldiğinde Kişi Başına Lot Dağıtımı & Nakit İadesi
    const stillIpos = [];
    for (const req of (member.ipoRequests || [])) {
      if (nowMs >= req.allocatesAtMs) {
        const allocatedLots = Math.min(req.requestedLots, req.perCapitaLots);
        const spentTL = +(allocatedLots * req.offerPriceTL).toFixed(2);
        const refundTL = Math.max(0, +(req.blockedCashTL - spentTL).toFixed(2));
        member.cashTL = +(member.cashTL + refundTL).toFixed(2);
        if (allocatedLots > 0) {
          const synthKey = 'bist-' + req.ticker.toLowerCase();
          const a = getAsset(synthKey);
          if (a) {
            mergeSpotPosition(member, a, allocatedLots, req.offerPriceTL, clock.ymd, 'SPK_IPO', 'RESEARCH_FUNDAMENTAL', 'SPK Halka Arz Eşit Dağıtım');
          }
        }
        member.tradeHistory.unshift({
          id: 'th_ipo_' + Math.random().toString(36).slice(2, 8),
          ts: nowMs,
          side: 'HALKA ARZ DAĞITIM',
          assetKey: 'bist-' + req.ticker.toLowerCase(),
          name: `${req.name} (${req.ticker})`,
          amountTL: spentTL,
          priceTL: req.offerPriceTL,
          feeAndTaxTL: 0,
          spreadLeakTL: 0,
          note: `${req.requestedLots} lot talep edildi; katılımcı sayısına göre ${allocatedLots} lot (${spentTL.toLocaleString('tr-TR')} ₺) düştü, kalan ${refundTL.toLocaleString('tr-TR')} ₺ nakde iade edildi.`
        });
        changed = true;
      } else {
        stillIpos.push(req);
      }
    }
    member.ipoRequests = stillIpos;

    // 4) Gerçek Ödeme Gününde %15 Stopajı Kesilmiş Net Temettü Yatırımı (Sabit Takvim Çapalı!)
    if (!member.creditedDividends) member.creditedDividends = {};
    for (const div of getDividendSchedule(nowMs, true)) {
      const divKey = `${div.ticker}_${div.payDateYmd}`;
      if (nowMs >= div.payAtMs && !member.creditedDividends[divKey]) {
        const pos = member.positions[div.assetKey];
        if (pos && pos.qty > 0 && (pos.openedAtMs || 0) < div.payAtMs) {
          const netPayoutTL = +(pos.qty * div.netPerShareTL).toFixed(2);
          if (netPayoutTL > 0) {
            member.cashTL = +(member.cashTL + netPayoutTL).toFixed(2);
            member.creditedDividends[divKey] = netPayoutTL;
            member.tradeHistory.unshift({
              id: 'th_div_' + Math.random().toString(36).slice(2, 8),
              ts: nowMs,
              side: 'NET TEMETTÜ',
              assetKey: div.assetKey,
              name: `${div.ticker} Nakit Temettü (%15 Stopaj Kesilmiş)`,
              amountTL: netPayoutTL,
              priceTL: div.netPerShareTL,
              feeAndTaxTL: +(pos.qty * (div.grossPerShareTL - div.netPerShareTL)).toFixed(2),
              spreadLeakTL: 0,
              note: `${pos.qty} adet pay için net ${netPayoutTL.toLocaleString('tr-TR')} ₺ temettü (${div.payDateYmd}) hesabına yattı.`
            });
            changed = true;
          }
        }
      }
    }

    // 5) Kredili İşlem (Borçlu Yatırım) Günlük Faiz İşlemesi & Saat 15:00 Margin Call Baskısı
    if ((member.marginDebtTL || 0) > 0) {
      const elapsedDebtDays = Math.max(0, (nowMs - (member.lastMarginAccrualMs || nowMs)) / (24 * 3600 * 1000));
      if (elapsedDebtDays >= 0.02) {
        const annualMarginPct = getAnnualMarginRatePct() / 100;
        const interestAdd = +(member.marginDebtTL * (annualMarginPct / 365) * elapsedDebtDays).toFixed(2);
        if (interestAdd >= 0.05) {
          member.marginDebtTL = +(member.marginDebtTL + interestAdd).toFixed(2);
          member.totalFrictionBurnedTL = +((member.totalFrictionBurnedTL || 0) + interestAdd).toFixed(2);
          changed = true;
        }
        member.lastMarginAccrualMs = nowMs;
      }
      const snapCheck = evaluateMemberPortfolio(member, nowMs);
      if (snapCheck.marginStatus && snapCheck.marginStatus.isMarginCall) {
        recordFootprint(
          member,
          'MARGIN_CALL_PRESSURE',
          'Kredili İşlem Teminat Tamamlama (Margin Call) Baskısı!',
          `Borç parayla (${Math.round(member.marginDebtTL).toLocaleString('tr-TR')} ₺) taşınan pozisyonda özsermaye oranı %${snapCheck.marginStatus.equityRatioPct} seviyesine indi! Saat 15:00’e kadar nakit eklenmez veya pozisyon azaltılmazsa zorunlu satış riski doğar.`,
          0
        );
        changed = true;
      }
    } else {
      member.lastMarginAccrualMs = nowMs;
    }

    // 6) Gerçek Takvim Maaş Günü (Ayın 1'i veya 15'i)
    const sDay = Number(member.salaryDay) === 1 ? 1 : 15;
    if (member.monthlySavingsTL > 0 && clock.ym > (member.lastSalaryCreditedYm || '2000-01') && clock.day >= sDay) {
      const addTL = Number(member.monthlySavingsTL) || 0;
      member.cashTL = +(member.cashTL + addTL).toFixed(2);
      member.baselineCapitalTL = +(member.baselineCapitalTL + addTL).toFixed(2);
      if (member.ghostHoldPortfolio) {
        member.ghostHoldPortfolio.cashTL = +((member.ghostHoldPortfolio.cashTL || 0) + addTL).toFixed(2);
      }
      member.lastSalaryCreditedYm = clock.ym;
      member.tradeHistory.unshift({
        id: 'tr_sal_' + clock.ym,
        ts: nowMs,
        side: 'MAAŞ BİRİKİMİ',
        assetKey: 'CASH_TL',
        name: `Ayın ${sDay}'i Düzenli Tasarruf Girişi`,
        amountTL: addTL,
        priceTL: 1,
        feeAndTaxTL: 0,
        spreadLeakTL: 0,
        note: `${clock.ym} ayı düzenli birikimi portföy nakdine eklendi.`
      });
      changed = true;
    }

    // 7) Aracı Kurum Otomatik Gecelik Nema (O/N Repo) + Boş Nakit Fırsat/Enflasyon Muhasebesi
    if (!member.idleErosionLog) {
      member.idleErosionLog = { lastCheckedMs: nowMs, cumulativeInflationLossTL: 0, missedSukukNetTL: 0 };
    }
    const elapsedDays = Math.max(0, (nowMs - (member.idleErosionLog.lastCheckedMs || nowMs)) / (24 * 3600 * 1000));
    if (elapsedDays >= 0.04) {
      const repoNetAnnual = getOvernightRepoNetAnnualPct() / 100;
      let repoEarnedNow = 0;
      if (member.autoOvernightRepo && member.cashTL > 10000) {
        const repoPrincipal = member.cashTL - 10000;
        repoEarnedNow = +(repoPrincipal * (repoNetAnnual / 365) * elapsedDays).toFixed(2);
        if (repoEarnedNow >= 0.05) {
          member.cashTL = +(member.cashTL + repoEarnedNow).toFixed(2);
          member.overnightRepoEarnedTL = +((member.overnightRepoEarnedTL || 0) + repoEarnedNow).toFixed(2);
        }
      }

      if (member.cashTL >= 1000) {
        const annualInf = getAnnualInflationPct() / 100;
        const sukukGross = (getAsset('kira-sertifikasi-sukuk')?.annualGrossRatePct || 36.5) / 100;
        const rawInfLoss = member.cashTL * (annualInf / 365) * elapsedDays;
        const rawSukukGain = member.cashTL * (sukukGross / 365) * elapsedDays;
        const netInfLoss = Math.max(0, rawInfLoss - repoEarnedNow);
        const netMissedSukuk = Math.max(0, rawSukukGain - repoEarnedNow);
        member.idleErosionLog.cumulativeInflationLossTL = +(member.idleErosionLog.cumulativeInflationLossTL + netInfLoss).toFixed(2);
        member.idleErosionLog.missedSukukNetTL = +(member.idleErosionLog.missedSukukNetTL + netMissedSukuk).toFixed(2);
      }
      member.idleErosionLog.lastCheckedMs = nowMs;
      member.lastOvernightRepoMs = nowMs;
      changed = true;
    }

    if (changed) {
      member.updatedAt = nowMs;
      member.rev = (Number(member.rev) || 1) + 1;
    }
    return changed;
  }

  function mergeSpotPosition(member, asset, addQty, buyUnitTL, ymd, doorUsed, thesisTag, thesisNote) {
    const prev = member.positions[asset.key];
    const usdTry = getUsdTry();
    const buyUsd = asset.isForeignUsd ? +(buyUnitTL / usdTry).toFixed(4) : null;
    const cleanTag = thesisTag || 'RESEARCH_FUNDAMENTAL';
    const cleanNote = String(thesisNote || '').trim().slice(0, 140);

    if (!prev || prev.qty <= 0) {
      member.positions[asset.key] = {
        assetKey: asset.key,
        qty: addQty,
        avgCostTL: +buyUnitTL.toFixed(4),
        avgCostUsd: buyUsd,
        buyYiUfe: CURRENT_YIUFE_INDEX,
        openedAtMs: getTurkishClock().ms,
        lastBuyDayYmd: ymd,
        doorUsed: doorUsed || 'STANDARD',
        thesisTag: cleanTag,
        thesisNote: cleanNote
      };
    } else {
      const totalQty = +(prev.qty + addQty).toFixed(6);
      const weightedTL = ((prev.qty * prev.avgCostTL) + (addQty * buyUnitTL)) / totalQty;
      const weightedUfe = ((prev.qty * (prev.buyYiUfe || CURRENT_YIUFE_INDEX)) + (addQty * CURRENT_YIUFE_INDEX)) / totalQty;
      prev.qty = totalQty;
      prev.avgCostTL = +weightedTL.toFixed(4);
      if (buyUsd != null) {
        prev.avgCostUsd = +((((prev.qty - addQty) * (prev.avgCostUsd || buyUsd)) + (addQty * buyUsd)) / totalQty).toFixed(4);
      }
      prev.buyYiUfe = +weightedUfe.toFixed(2);
      prev.lastBuyDayYmd = ymd;
      prev.doorUsed = doorUsed || prev.doorUsed;
      if (cleanTag) prev.thesisTag = cleanTag;
      if (cleanNote) prev.thesisNote = cleanNote;
    }
  }

  function computePositionTaxOnGain(asset, pos, sellUnitTL, sellQty, currentYiUfeOverride) {
    const grossProceedsTL = +(sellQty * sellUnitTL).toFixed(2);
    const costBasisTL = +(sellQty * (pos.avgCostTL || sellUnitTL)).toFixed(2);
    const nominalGainTL = +(grossProceedsTL - costBasisTL).toFixed(2);

    if (asset.stopajPct > 0 && !asset.isRateInstrument) {
      const stopajTL = nominalGainTL > 0 ? +(nominalGainTL * (asset.stopajPct / 100)).toFixed(2) : 0;
      return { stopajTL, gvk80TaxReserveTL: 0, indexedRealGainTL: nominalGainTL, yiUfeIndexed: false };
    }

    if (asset.isGvk80) {
      const buyUfe = Number(pos.buyYiUfe) || CURRENT_YIUFE_INDEX;
      const curUfe = Number(currentYiUfeOverride) || CURRENT_YIUFE_INDEX;
      const ufeGrowth = buyUfe > 0 ? (curUfe / buyUfe) - 1 : 0;
      const yiUfeIndexed = ufeGrowth >= 0.10;
      const indexedCostTL = yiUfeIndexed ? +(costBasisTL * (curUfe / buyUfe)).toFixed(2) : costBasisTL;
      const realTaxableGainTL = Math.max(0, +(grossProceedsTL - indexedCostTL).toFixed(2));
      const gvk80TaxReserveTL = +(realTaxableGainTL * 0.20).toFixed(2);
      return { stopajTL: 0, gvk80TaxReserveTL, indexedRealGainTL: realTaxableGainTL, yiUfeIndexed };
    }

    return { stopajTL: 0, gvk80TaxReserveTL: 0, indexedRealGainTL: nominalGainTL, yiUfeIndexed: false };
  }

  function settleSpotSale(member, asset, sellQty, rawExecPriceTL, nowMs, door, fromValorQueue) {
    const pos = member.positions[asset.key];
    if (!pos || pos.qty <= 0) return null;
    const clock = getTurkishClock(nowMs);

    let spreadHalfPct = 0;
    if (asset.venue === 'TWO_DOOR') {
      spreadHalfPct = (door === 'BAZAAR' ? clock.bazaarSpreadPct : clock.bankSpreadPct) / 2;
    }
    const effectiveBidTL = +(rawExecPriceTL * (1 - spreadHalfPct / 100)).toFixed(4);
    const grossTL = +(sellQty * effectiveBidTL).toFixed(2);
    const spreadLeakTL = Math.max(0, +(sellQty * rawExecPriceTL - grossTL).toFixed(2));
    let feeRate = 0;
    if (asset.venue === 'BIST') feeRate = 0.00084;
    else if (asset.venue === 'GLOBAL_USD') feeRate = 0.0015;
    else if (asset.venue === 'CRYPTO_24_7' || asset.venue === 'VIOP') feeRate = 0.0010;
    const feeTL = +(grossTL * feeRate).toFixed(2);
    const taxInfo = computePositionTaxOnGain(asset, pos, effectiveBidTL, sellQty);
    const netAfterFeeAndStopajTL = Math.max(0, +(grossTL - feeTL - taxInfo.stopajTL).toFixed(2));
    const realizedPnlPct = pos.avgCostTL > 0 ? +(((effectiveBidTL / pos.avgCostTL) - 1) * 100).toFixed(2) : 0;
    const originThesisTag = pos.thesisTag || 'RESEARCH_FUNDAMENTAL';

    if (taxInfo.gvk80TaxReserveTL > 0) {
      member.gvk80TaxPayableTL = +((member.gvk80TaxPayableTL || 0) + taxInfo.gvk80TaxReserveTL).toFixed(2);
    }

    member.totalFrictionBurnedTL = +((member.totalFrictionBurnedTL || 0) + spreadLeakTL + feeTL).toFixed(2);

    pos.qty = +(pos.qty - sellQty).toFixed(6);
    if (pos.qty <= 0.000001) delete member.positions[asset.key];

    // Satış geliri varsa önce varsa Kredili İşlem borcunu otomatik azaltır!
    let remainingProceedsTL = netAfterFeeAndStopajTL;
    let repaidMarginTL = 0;
    if ((member.marginDebtTL || 0) > 0) {
      repaidMarginTL = Math.min(member.marginDebtTL, remainingProceedsTL);
      member.marginDebtTL = +(member.marginDebtTL - repaidMarginTL).toFixed(2);
      remainingProceedsTL = +(remainingProceedsTL - repaidMarginTL).toFixed(2);
    }

    if (asset.venue === 'BIST' && remainingProceedsTL > 0) {
      const settlesAtMs = addTurkishBusinessDays(nowMs, 2, 10, 0);
      const settlesParts = getIstanbulParts(settlesAtMs);
      member.settlementQueue.push({
        id: 't2_' + Math.random().toString(36).slice(2, 9),
        ticker: asset.ticker,
        name: asset.name,
        grossTL: remainingProceedsTL,
        soldAtMs: nowMs,
        settlesAtMs,
        note: `T+2 Takas: ${settlesParts.ymd} saat 10:00'da çekilebilir nakde dönüşür.`
      });
    } else if (remainingProceedsTL > 0) {
      member.cashTL = +(member.cashTL + remainingProceedsTL).toFixed(2);
    }

    if ((asset.change1D || 0) <= -3.5) {
      recordFootprint(
        member,
        'PANIC_RED_DAY_SALE',
        'Kırmızı Tahtada Panik Satışı',
        `${asset.name} günde %${Math.abs(asset.change1D).toFixed(1)} düşerken satıldı. Fırtına ortasında panikleyen el kalıcı hasar yazar.`,
        spreadLeakTL + feeTL
      );
    }

    const gvkNote = taxInfo.gvk80TaxReserveTL > 0
      ? ` (Yİ-ÜFE endeksli GVK Mük. 80 beyan vergisi karşılığı: ${taxInfo.gvk80TaxReserveTL.toLocaleString('tr-TR')} ₺ ayrıldı)`
      : '';

    member.tradeHistory.unshift({
      id: 'th_' + Math.random().toString(36).slice(2, 9),
      ts: nowMs,
      side: 'SATIŞ',
      assetKey: asset.key,
      ticker: asset.ticker,
      name: asset.name,
      amountTL: netAfterFeeAndStopajTL,
      priceTL: effectiveBidTL,
      realizedPnlPct,
      thesisTag: originThesisTag,
      feeAndTaxTL: +(feeTL + taxInfo.stopajTL + taxInfo.gvk80TaxReserveTL).toFixed(2),
      spreadLeakTL,
      note: repaidMarginTL > 0
        ? `Satıştan ${repaidMarginTL.toLocaleString('tr-TR')} ₺ kredi borcu kapatıldı; kalan tutar ${asset.venue === 'BIST' ? 'T+2 takasa girdi.' : 'nakde döndü.'}${gvkNote}`
        : (asset.venue === 'BIST'
          ? 'Satış gerçekleşti; para T+2 takas kum saatine girdi (2 iş günü nakit çekilemez).'
          : (fromValorQueue ? 'Valör tamamlandı ve nakde döndü.' : `Satış tamamlandı.${gvkNote}`))
    });
    if (member.tradeHistory.length > 60) member.tradeHistory.length = 60;
    return { netAfterFeeAndStopajTL, feeTL, stopajTL: taxInfo.stopajTL, gvk80TaxReserveTL: taxInfo.gvk80TaxReserveTL, repaidMarginTL };
  }

  // --------------------------------------------------------------------------
  // 8. CANLI EMİR GİŞESİ (ALIM, SATIM, İPTAL, KREDİLİ İŞLEM, VADE BOZUM, HALKA ARZ)
  // --------------------------------------------------------------------------
  function broadcastTradeToLeague(member, actionLabel, assetName, amountTL, thesisNote) {
    if (!member.profileRegistered) return null;
    const item = {
      id: 'ev_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3),
      ts: Date.now(),
      kind: 'TRADE',
      authorId: member.id,
      authorName: member.name,
      targetName: '',
      text: `${actionLabel}: ${assetName} (${Math.round(amountTL).toLocaleString('tr-TR')} ₺)${thesisNote ? ` — Notu: "${thesisNote}"` : ''}`
    };
    state.banterFeed.unshift(item);
    if (state.banterFeed.length > 40) state.banterFeed.length = 40;
    return item;
  }

  function executeOrder(params = {}) {
    const member = getActiveMember();
    processTimeHooksForMember(member);
    const clock = getTurkishClock();
    const nowMs = clock.ms;
    const side = String(params.side || 'BUY').toUpperCase();

    // --- SIRADA BEKLEYEN EMRİ İPTAL ETME (09:50–10:00 BIST İPTAL YASAĞI KONTROLLÜ) ---
    if (side === 'CANCEL_ORDER') {
      const idx = (member.pendingOrders || []).findIndex((o) => o.id === params.orderId);
      if (idx < 0) return { ok: false, reason: 'İptal edilecek bekleyen emir bulunamadı.' };
      const ord = member.pendingOrders[idx];
      if (ord.orderType === 'BIST_OPEN_AUCTION' && clock.bistCancelLocked) {
        return {
          ok: false,
          reason: `Borsa İstanbul Kuralı (${clock.bistLabel}): Eşleşme penceresinde bekleyen emir iptal edilemez!`
        };
      }
      member.pendingOrders.splice(idx, 1);
      if ((ord.reservedTL || 0) > 0) {
        member.cashTL = +(member.cashTL + Number(ord.reservedTL)).toFixed(2);
      }
      member.updatedAt = nowMs;
      member.rev = (member.rev || 1) + 1;
      saveState(true, true);
      return {
        ok: true,
        status: 'ORDER_CANCELLED',
        message: `${ord.name} için bekleyen ${ord.side === 'BUY' ? 'alım' : 'satış'} emri iptal edildi${ord.reservedTL > 0 ? ` ve ${ord.reservedTL.toLocaleString('tr-TR')} ₺ nakde iade edildi` : ''}.`
      };
    }

    // --- YURT DIŞI GVK MÜKERRER 80 BEYANNAME VERGİSİNİ NAKİTLE ÖDEME ---
    if (side === 'PAY_GVK80_TAX') {
      const taxDue = Number(member.gvk80TaxPayableTL) || 0;
      if (taxDue <= 0) return { ok: false, reason: 'Ödenecek yurt dışı beyanname vergi borcu bulunmuyor.' };
      const payAmt = Math.min(taxDue, member.cashTL);
      if (payAmt <= 0) return { ok: false, reason: 'Vergi karşılığını ödemek için kullanılabilir nakdin yetersiz.' };
      member.cashTL = +(member.cashTL - payAmt).toFixed(2);
      member.gvk80TaxPayableTL = +(taxDue - payAmt).toFixed(2);
      member.updatedAt = nowMs;
      member.rev = (member.rev || 1) + 1;
      saveState(true, true);
      return {
        ok: true,
        status: 'TAX_PAID',
        message: `${payAmt.toLocaleString('tr-TR')} ₺ Yurt Dışı Beyanname (GVK Mük. 80) vergisi nakitten ödendi.`
      };
    }

    // --- ARACI KURUM OTOMATİK GECELİK NEMA (O/N REPO) ANAHTARI ---
    if (side === 'TOGGLE_OVERNIGHT_REPO') {
      member.autoOvernightRepo = params.enabled != null ? Boolean(params.enabled) : !member.autoOvernightRepo;
      member.lastOvernightRepoMs = nowMs;
      member.updatedAt = nowMs;
      member.rev = (member.rev || 1) + 1;
      saveState(true, true);
      return {
        ok: true,
        status: 'REPO_TOGGLED',
        message: member.autoOvernightRepo
          ? `Aracı Kurum Gecelik Nema açıldı: 10.000 ₺ üzerindeki boş nakdin gecelik net %${getOvernightRepoNetAnnualPct()} oranıyla otomatik nemalanacak.`
          : 'Aracı Kurum Gecelik Nema kapatıldı: Boş nakit vadesiz hesapta (%0 faiz) bekleyecek.'
      };
    }

    // --- KREDİ BORCUNU NAKİTLE KAPATMA ---
    if (side === 'REPAY_MARGIN') {
      const debt = Number(member.marginDebtTL) || 0;
      if (debt <= 0) return { ok: false, reason: 'Aktif kredi borcun bulunmuyor.' };
      const payAmt = Math.min(debt, member.cashTL, Number(params.amountTL) || debt);
      if (payAmt <= 0) return { ok: false, reason: 'Kredi borcunu kapatmak için kullanılabilir nakdin yetersiz.' };
      member.cashTL = +(member.cashTL - payAmt).toFixed(2);
      member.marginDebtTL = +(debt - payAmt).toFixed(2);
      member.updatedAt = nowMs;
      member.rev = (member.rev || 1) + 1;
      saveState(true, true);
      return {
        ok: true,
        status: 'MARGIN_REPAID',
        message: `${payAmt.toLocaleString('tr-TR')} ₺ kredi borcu kapatıldı. Kalan borç: ${member.marginDebtTL.toLocaleString('tr-TR')} ₺.`
      };
    }

    // --- VADELİ MEVDUAT / SUKUK / PPF BOZUMU (13:30 TEFAS VALÖR KURALI DAHİL!) ---
    if (side === 'BREAK_TRANCHE') {
      const trancheId = params.trancheId;
      const idx = (member.rateTranches || []).findIndex((t) => t.id === trancheId);
      if (idx < 0) return { ok: false, reason: 'Bozulacak vade dilimi bulunamadı.' };
      const tr = member.rateTranches[idx];
      const trVal = evaluateRateTranche(tr, nowMs);
      const trAsset = getAsset(tr.assetKey);

      if (trAsset && trAsset.venue === 'TEFAS') {
        if (!clock.isBizDay && trAsset.subVenue === 'TEFAS_DEBT') {
          return { ok: false, reason: 'Hafta sonu ve resmi tatilde TEFAS Kira Sertifikası bozum gişesi kapalıdır.' };
        }
        // TEFAS Kira Sertifikası / Borçlanma fonlarında gerçek T+1 (13:30 sonrası T+2) valör işler!
        if (trAsset.subVenue === 'TEFAS_DEBT') {
          member.rateTranches.splice(idx, 1);
          const waitBizDays = clock.tefasBeforeCutoff ? 1 : 2;
          const settlesAtMs = addTurkishBusinessDays(nowMs, waitBizDays, 10, 30);
          const settlesParts = getIstanbulParts(settlesAtMs);
          member.settlementQueue.push({
            id: 'val_' + Math.random().toString(36).slice(2, 9),
            assetKey: tr.assetKey,
            usableForBist: false,
            ticker: trAsset.ticker,
            name: tr.name,
            grossTL: trVal.netRedeemableTL,
            soldAtMs: nowMs,
            settlesAtMs,
            note: `TEFAS Fon Bozum Valörü: ${settlesParts.ymd} saat 10:30'da nakit hesabına geçer.`
          });
          member.tradeHistory.unshift({
            id: 'th_' + Math.random().toString(36).slice(2, 9),
            ts: nowMs,
            side: 'FON BOZUM VALÖRÜ',
            assetKey: tr.assetKey,
            name: tr.name,
            amountTL: trVal.netRedeemableTL,
            priceTL: 1,
            feeAndTaxTL: trVal.stopajTL,
            spreadLeakTL: 0,
            note: `TEFAS 13:30 valör kuralıyla ${settlesParts.ymd} 10:30'da nakde dönecek (+${trVal.netInterestTL.toLocaleString('tr-TR')} ₺ net getiri).`
          });
          member.updatedAt = nowMs;
          member.rev = (member.rev || 1) + 1;
          saveState(true, true);
          return {
            ok: true,
            status: 'QUEUED_TEFAS_REDEMPTION',
            message: `${tr.name} bozum emri alındı: TEFAS valör kuralıyla net ${trVal.netRedeemableTL.toLocaleString('tr-TR')} ₺ tutar ${settlesParts.ymd} saat 10:30'da nakde geçecek.`
          };
        }
        // Para Piyasası Fonu (PPF): 13:30 öncesi T+0 anında nakit; 13:30 sonrası / hafta sonu ilk iş günü sabah 10:00 valörlü!
        if (trAsset.subVenue === 'TEFAS_PPF' && !clock.tefasBeforeCutoff) {
          member.rateTranches.splice(idx, 1);
          const settlesAtMs = addTurkishBusinessDays(nowMs, 1, 10, 0);
          const settlesParts = getIstanbulParts(settlesAtMs);
          member.settlementQueue.push({
            id: 'val_' + Math.random().toString(36).slice(2, 9),
            assetKey: tr.assetKey,
            usableForBist: false,
            ticker: trAsset.ticker,
            name: tr.name,
            grossTL: trVal.netRedeemableTL,
            soldAtMs: nowMs,
            settlesAtMs,
            note: `PPF 13:30 Sonrası Valör: ${settlesParts.ymd} saat 10:00'da nakde geçer.`
          });
          member.tradeHistory.unshift({
            id: 'th_' + Math.random().toString(36).slice(2, 9),
            ts: nowMs,
            side: 'PPF VALÖR BOZUM',
            assetKey: tr.assetKey,
            name: tr.name,
            amountTL: trVal.netRedeemableTL,
            priceTL: 1,
            feeAndTaxTL: trVal.stopajTL,
            spreadLeakTL: 0,
            note: `Saat 13:30 geçildiği için ${settlesParts.ymd} 10:00'da nakde dönecek.`
          });
          member.updatedAt = nowMs;
          member.rev = (member.rev || 1) + 1;
          saveState(true, true);
          return {
            ok: true,
            status: 'QUEUED_PPF_REDEMPTION',
            message: `Saat 13:30 TEFAS valör sınırı geçildiği için Para Piyasası Fonu bozum tutarın (${trVal.netRedeemableTL.toLocaleString('tr-TR')} ₺) ${settlesParts.ymd} sabah 10:00'da nakde geçecek.`
          };
        }
      }

      member.rateTranches.splice(idx, 1);
      if (tr.isTermDeposit && nowMs < tr.maturesAtMs) {
        member.cashTL = +(member.cashTL + tr.principalTL).toFixed(2);
        member.totalFrictionBurnedTL = +((member.totalFrictionBurnedTL || 0) + trVal.forfeitedIfBrokenEarlyTL).toFixed(2);
        recordFootprint(
          member,
          'EARLY_DEPOSIT_BREAK',
          'Vadeden Önce Bozulan Mevduat (Sabırsızlık Bedeli)',
          `${tr.name} vadesi dolmadan bozuldu; birikmiş ${trVal.forfeitedIfBrokenEarlyTL.toLocaleString('tr-TR')} ₺ net faiz tamamen yandı!`,
          trVal.forfeitedIfBrokenEarlyTL
        );
        member.tradeHistory.unshift({
          id: 'th_' + Math.random().toString(36).slice(2, 9),
          ts: nowMs,
          side: 'ERKEN BOZUM',
          assetKey: tr.assetKey,
          name: tr.name,
          amountTL: tr.principalTL,
          priceTL: 1,
          feeAndTaxTL: 0,
          spreadLeakTL: trVal.forfeitedIfBrokenEarlyTL,
          note: `Vadeden önce bozuldu: ${trVal.forfeitedIfBrokenEarlyTL.toLocaleString('tr-TR')} ₺ birikmiş faiz sıfırlandı.`
        });
        member.updatedAt = nowMs;
        member.rev = (member.rev || 1) + 1;
        saveState(true, true);
        return {
          ok: true,
          status: 'BROKEN_EARLY',
          message: `Vadeli mevduat erken bozulduğu için ${trVal.forfeitedIfBrokenEarlyTL.toLocaleString('tr-TR')} ₺ faiz yandı; kasana sadece ${tr.principalTL.toLocaleString('tr-TR')} ₺ anapara döndü.`
        };
      }

      member.cashTL = +(member.cashTL + trVal.netRedeemableTL).toFixed(2);
      member.tradeHistory.unshift({
        id: 'th_' + Math.random().toString(36).slice(2, 9),
        ts: nowMs,
        side: 'VADE DÖNÜŞÜ',
        assetKey: tr.assetKey,
        name: tr.name,
        amountTL: trVal.netRedeemableTL,
        priceTL: 1,
        feeAndTaxTL: trVal.stopajTL,
        spreadLeakTL: 0,
        note: `Net getiri (+${trVal.netInterestTL.toLocaleString('tr-TR')} ₺) nakit kasana geçti.`
      });
      member.updatedAt = nowMs;
      member.rev = (member.rev || 1) + 1;
      saveState(true, true);
      return {
        ok: true,
        status: 'REDEEMED',
        message: `${tr.name} nakde çevrildi; net ${trVal.netRedeemableTL.toLocaleString('tr-TR')} ₺ hesabına geçti.`
      };
    }

    const asset = getAsset(params.assetKey);
    if (!asset) return { ok: false, reason: 'Yatırım aracı bulunamadı.' };
    if (asset.venue === 'BENCHMARK_ONLY') {
      return {
        ok: false,
        reason: 'TCMB Konut Fiyat Endeksi resmi gösterge endeksidir, doğrudan alınıp satılamaz. Gayrimenkul yatırımı için EKGYO, RYGYO, ISGYO veya OPTGY seçebilirsin.'
      };
    }
    if (asset.isSyntheticIpo && side === 'BUY') {
      return {
        ok: false,
        reason: `${asset.ticker} henüz SPK Halka Arz talep toplama aşamasındadır; "Halka Arz & Temettü" merceğinden eşit dağıtım talebi girebilirsin.`
      };
    }

    // --- ALIM İŞLEMİ (BUY) ---
    if (side === 'BUY') {
      const amountTL = +(Number(params.amountTL) || 0).toFixed(2);
      if (amountTL < 100) return { ok: false, reason: 'En az 100 ₺ tutarında emir girebilirsin.' };

      const micro = inspectBoardMicrostructure(asset);
      const useMargin = Boolean(params.useMargin) && micro.marginAllowed && clock.bistCanMatchNow;
      const snapNow = evaluateMemberPortfolio(member, nowMs);
      const maxMarginCapacity = micro.marginAllowed
        ? Math.max(0, +(snapNow.totalNetWorthTL * 0.50 - (member.marginDebtTL || 0)).toFixed(2))
        : 0;

      const unsettledUsableForBist = (asset.venue === 'BIST' && !micro.isBrutTakas)
        ? (member.settlementQueue || []).filter((x) => x.usableForBist !== false).reduce((s, x) => s + Number(x.grossTL || 0), 0)
        : 0;
      const maxCashPower = +(member.cashTL + unsettledUsableForBist).toFixed(2);
      const maxTotalPower = +(maxCashPower + (useMargin ? maxMarginCapacity : 0)).toFixed(2);

      if (Boolean(params.useMargin) && !micro.marginAllowed) {
        return { ok: false, reason: `${asset.ticker} üzerinde kredili alım kapalıdır (VBTS Brüt Takas, spekülatif hacim veya borsa dışı varlık).` };
      }

      if (amountTL > maxTotalPower) {
        if (asset.venue !== 'BIST' && (member.settlementQueue || []).length > 0) {
          return {
            ok: false,
            reason: `Çekilebilir nakdin ${member.cashTL.toLocaleString('tr-TR')} ₺. Borsa satışından gelen para T+2 takasta beklediği için takas dolmadan altın, döviz veya mevduata dönemez!`
          };
        }
        return { ok: false, reason: `Yetersiz alım gücü (Kullanılabilir: ${maxTotalPower.toLocaleString('tr-TR')} ₺).` };
      }

      // Karar Tezi & İnceleme Tespiti
      const inspectedMs = Number(params.inspectedMs) || 0;
      let thesisTag = String(params.thesisTag || 'RESEARCH_FUNDAMENTAL');
      const thesisNote = String(params.thesisNote || '').trim().slice(0, 140);
      if (thesisNote.length >= 4) member.livedMilestones.wroteInvestmentThesis = true;

      // Eğer kullanıcı +6% üzeri uçan veya pump hissesine 4 saniyeden kısa sürede incelemeden atladıysa dürüstçe işaretle
      if (((asset.change1D || 0) >= 6.0 || asset.isPumpAnomaly) && inspectedMs < 4000 && thesisTag !== 'RUMOR_IMPULSE') {
        thesisTag = 'RUMOR_IMPULSE';
      }

      const deductFunds = (amt) => {
        if (member.cashTL >= amt) {
          member.cashTL = +(member.cashTL - amt).toFixed(2);
          return 0;
        }
        let rem = +(amt - member.cashTL).toFixed(2);
        member.cashTL = 0;
        if (asset.venue === 'BIST' && !micro.isBrutTakas) {
          for (const q of member.settlementQueue) {
            if (rem <= 0) break;
            if (q.usableForBist === false) continue;
            const take = Math.min(q.grossTL, rem);
            q.grossTL = +(q.grossTL - take).toFixed(2);
            rem = +(rem - take).toFixed(2);
          }
          member.settlementQueue = member.settlementQueue.filter((q) => q.grossTL > 0.01);
        }
        let borrowed = 0;
        if (rem > 0 && useMargin) {
          borrowed = rem;
          member.marginDebtTL = +((member.marginDebtTL || 0) + borrowed).toFixed(2);
          member.lastMarginAccrualMs = nowMs;
          rem = 0;
        }
        return borrowed;
      };

      // A) BANKA VADELİ MEVDUAT / DİBS
      if (asset.venue === 'BANK_RATE') {
        if (!clock.isBizDay && asset.subVenue === 'GOV_BOND') {
          return { ok: false, reason: 'Hazine DİBS tahvil gişesi hafta sonu ve resmi tatilde kapalıdır.' };
        }
        const maturityDays = asset.subVenue === 'TERM_DEPOSIT' ? (Number(params.maturityDays) || 32) : 0;
        let stopajPct = asset.stopajPct;
        if (asset.subVenue === 'TERM_DEPOSIT') {
          if (maturityDays > 365) stopajPct = 10.0;
          else if (maturityDays > 180) stopajPct = 15.0;
          else stopajPct = 17.5;
        } else if (asset.id === 'dibs-tahvil') {
          stopajPct = 0;
        }
        deductFunds(amountTL);
        const labelName = asset.subVenue === 'TERM_DEPOSIT' ? `${asset.name} (${maturityDays} Gün Vadeli)` : asset.name;
        member.rateTranches.push({
          id: 'tr_' + Math.random().toString(36).slice(2, 9),
          assetKey: asset.key,
          name: labelName,
          principalTL: amountTL,
          annualGrossPct: asset.annualGrossRatePct,
          stopajPct,
          openedAtMs: nowMs,
          maturityDays,
          maturesAtMs: maturityDays > 0 ? nowMs + maturityDays * 24 * 3600 * 1000 : 0,
          isTermDeposit: asset.subVenue === 'TERM_DEPOSIT'
        });
        member.livedMilestones.executedRealOrder = true;
        member.tradeHistory.unshift({
          id: 'th_' + Math.random().toString(36).slice(2, 9),
          ts: nowMs,
          side: 'VADELİ / SABİT',
          assetKey: asset.key,
          name: labelName,
          amountTL,
          priceTL: asset.annualGrossRatePct,
          thesisTag,
          thesisNote,
          feeAndTaxTL: 0,
          spreadLeakTL: 0,
          note: asset.subVenue === 'TERM_DEPOSIT'
            ? `${maturityDays} gün vadeli bağlandı (%${stopajPct} stopaj; erken bozumda faiz yanar).`
            : `Sabit getiri dilimi açıldı (%${stopajPct} stopaj).`
        });
        maybeSnapshotGhostHoldPortfolio(member);
        member.updatedAt = nowMs;
        member.rev = (member.rev || 1) + 1;
        const ev = broadcastTradeToLeague(member, 'Vadeli/Sabit Getiriye Bağladı', labelName, amountTL, thesisNote);
        saveState(true, false);
        publishMyInvestorToMesh(ev);
        return {
          ok: true,
          status: 'FILLED',
          message: `${amountTL.toLocaleString('tr-TR')} ₺ vade dilimi olarak bağlandı (Brüt %${asset.annualGrossRatePct}, Stopaj %${stopajPct}).`
        };
      }

      // B) TEFAS FON GİŞESİ (13:30 VALÖR KURALI)
      if (asset.venue === 'TEFAS') {
        if (asset.subVenue === 'TEFAS_PPF' && clock.tefasBeforeCutoff) {
          deductFunds(amountTL);
          member.rateTranches.push({
            id: 'tr_' + Math.random().toString(36).slice(2, 9),
            assetKey: asset.key,
            name: asset.name,
            principalTL: amountTL,
            annualGrossPct: asset.annualGrossRatePct,
            stopajPct: 17.5,
            openedAtMs: nowMs,
            maturityDays: 0,
            maturesAtMs: 0,
            isTermDeposit: false
          });
          member.livedMilestones.executedRealOrder = true;
          member.tradeHistory.unshift({
            id: 'th_' + Math.random().toString(36).slice(2, 9),
            ts: nowMs,
            side: 'FON ALIM',
            assetKey: asset.key,
            name: asset.name,
            amountTL,
            priceTL: asset.annualGrossRatePct,
            thesisTag,
            thesisNote,
            feeAndTaxTL: 0,
            spreadLeakTL: 0,
            note: '13:30 valör sınırından önce verildiği için T+0 bugün devreye girdi.'
          });
          maybeSnapshotGhostHoldPortfolio(member);
          member.updatedAt = nowMs;
          member.rev = (member.rev || 1) + 1;
          const ev = broadcastTradeToLeague(member, 'Fona Park Etti', asset.name, amountTL, thesisNote);
          saveState(true, false);
          publishMyInvestorToMesh(ev);
          return { ok: true, status: 'FILLED', message: `Saat 13:30 öncesi olduğu için Para Piyasası Fonu T+0 bugün kazanmaya başladı.` };
        }

        const bizDaysWait = asset.subVenue === 'TEFAS_PPF' ? 1 : (clock.tefasBeforeCutoff ? 1 : 2);
        const executesAtMs = addTurkishBusinessDays(nowMs, bizDaysWait, 10, 30);
        const execParts = getIstanbulParts(executesAtMs);
        deductFunds(amountTL);
        member.pendingOrders.push({
          id: 'po_' + Math.random().toString(36).slice(2, 9),
          side: 'BUY',
          assetKey: asset.key,
          name: asset.name,
          reservedTL: amountTL,
          qty: 0,
          orderType: 'TEFAS_VALOR',
          executesAtMs,
          createdAtMs: nowMs,
          door: 'TEFAS',
          thesisTag,
          thesisNote,
          note: `TEFAS 13:30 Valör Beklemesi: ${execParts.ymd} 10:30'da fona dönüşecek.`
        });
        member.tradeHistory.unshift({
          id: 'th_' + Math.random().toString(36).slice(2, 9),
          ts: nowMs,
          side: 'TEFAS VALÖR',
          assetKey: asset.key,
          name: asset.name,
          amountTL,
          priceTL: asset.priceTL,
          thesisTag,
          thesisNote,
          feeAndTaxTL: 0,
          spreadLeakTL: 0,
          note: `TEFAS valör kuyruğuna alındı (${execParts.ymd} 10:30).`
        });
        member.livedMilestones.executedRealOrder = true;
        member.updatedAt = nowMs;
        member.rev = (member.rev || 1) + 1;
        const ev = broadcastTradeToLeague(member, 'TEFAS Valör Emri Verdi', asset.name, amountTL, thesisNote);
        saveState(true, false);
        publishMyInvestorToMesh(ev);
        return {
          ok: true,
          status: 'QUEUED_VALOR',
          message: `TEFAS 13:30 valör kuralı işledi: Emrin ${execParts.ymd} saat 10:30 fiyatından portföye girecek.`
        };
      }

      // C) KAPALIÇARŞI vs MOBİL BANKA (İKİ KAPILI ALTIN/GÜMÜŞ/DÖVİZ)
      if (asset.venue === 'TWO_DOOR') {
        const door = params.door === 'BAZAAR' ? 'BAZAAR' : 'BANK';
        if (door === 'BAZAAR' && !clock.grandBazaarOpen) {
          return {
            ok: false,
            reason: `Kapalıçarşı şu an kapalı (${clock.shortTimeStr} · Açılış 09:30). Sabahı bekleyebilir veya %${clock.bankSpreadPct.toFixed(2)} mesai dışı makas + %0,2 kambiyo vergisiyle Mobil Banka kanalını seçebilirsin.`
          };
        }
        const halfSpreadPct = (door === 'BAZAAR' ? clock.bazaarSpreadPct : clock.bankSpreadPct) / 2;
        const bsmvPct = door === 'BANK' ? 0.20 : 0;
        const askPriceTL = +(asset.priceTL * (1 + halfSpreadPct / 100)).toFixed(4);
        const bsmvTL = +(amountTL * (bsmvPct / 100)).toFixed(2);
        const netForMetalOrFx = Math.max(0, +(amountTL - bsmvTL).toFixed(2));
        const qty = +(netForMetalOrFx / askPriceTL).toFixed(6);
        const pureMidQty = amountTL / asset.priceTL;
        const spreadAndTaxLeakTL = Math.max(0, +((pureMidQty - qty) * asset.priceTL).toFixed(2));

        deductFunds(amountTL);
        member.totalFrictionBurnedTL = +((member.totalFrictionBurnedTL || 0) + spreadAndTaxLeakTL).toFixed(2);
        mergeSpotPosition(member, asset, qty, askPriceTL, clock.ymd, door, thesisTag, thesisNote);
        member.livedMilestones.executedRealOrder = true;

        if (door === 'BANK' && !clock.bankDaytimeTight) {
          recordFootprint(
            member,
            'NIGHT_BANK_SPREAD_LEAK',
            'Mesai Dışı Açık Banka Makası & Kambiyo Vergisi',
            `Mesai dışında banka ekranından ${asset.name} alınırken %${clock.bankSpreadPct.toFixed(2)} açık makas + %0,2 BSMV nedeniyle ${spreadAndTaxLeakTL.toLocaleString('tr-TR')} ₺ gişede eridi.`,
            spreadAndTaxLeakTL
          );
        }

        member.tradeHistory.unshift({
          id: 'th_' + Math.random().toString(36).slice(2, 9),
          ts: nowMs,
          side: 'ALIM',
          assetKey: asset.key,
          ticker: asset.ticker,
          name: `${asset.name} (${door === 'BAZAAR' ? 'Kapalıçarşı' : 'Mobil Banka'})`,
          amountTL,
          priceTL: askPriceTL,
          thesisTag,
          thesisNote,
          feeAndTaxTL: bsmvTL,
          spreadLeakTL: spreadAndTaxLeakTL,
          note: door === 'BAZAAR'
            ? 'Kapalıçarşı dar makas (%0 kambiyo vergisi).'
            : `Mobil Banka (%${(halfSpreadPct * 2).toFixed(2)} makas + ${bsmvTL.toLocaleString('tr-TR')} ₺ kambiyo vergisi).`
        });
        maybeSnapshotGhostHoldPortfolio(member);
        checkConcentrationFootprint(member);
        member.updatedAt = nowMs;
        member.rev = (member.rev || 1) + 1;
        const ev = broadcastTradeToLeague(member, 'Aldı', `${asset.name} (${door === 'BAZAAR' ? 'Kapalıçarşı' : 'Banka'})`, amountTL, thesisNote);
        saveState(true, false);
        publishMyInvestorToMesh(ev);
        return {
          ok: true,
          status: 'FILLED',
          message: `${door === 'BAZAAR' ? 'Kapalıçarşı' : 'Mobil Banka'} üzerinden ${qty.toFixed(3)} birim ${asset.name} alındı (Makas+Vergi maliyeti: ${spreadAndTaxLeakTL.toLocaleString('tr-TR')} ₺).`
        };
      }

      // D) BORSA İSTANBUL PAY VE BYF GİŞESİ
      if (asset.venue === 'BIST') {
        if (micro.isCircuitBreaker) {
          return {
            ok: false,
            reason: `${asset.ticker} tahtasında devre kesici aktif! Eşleşme bitene kadar alım-satım yapılamaz.`
          };
        }
        if (micro.isTavanLocked) {
          return {
            ok: false,
            reason: `${asset.ticker} +%${asset.change1D.toFixed(2)} ile Tavan Kilitli! Tahtada satıcı olmadığı için piyasa emri eşleşmez.`
          };
        }

        if (!clock.bistCanMatchNow) {
          const nextOpenMs = getNextBistOpenMatchMs(nowMs);
          const nextParts = getIstanbulParts(nextOpenMs);
          deductFunds(amountTL);
          member.pendingOrders.push({
            id: 'po_' + Math.random().toString(36).slice(2, 9),
            side: 'BUY',
            assetKey: asset.key,
            name: asset.name,
            reservedTL: amountTL,
            qty: 0,
            orderType: 'BIST_OPEN_AUCTION',
            executesAtMs: nextOpenMs,
            createdAtMs: nowMs,
            door: 'BIST',
            thesisTag,
            thesisNote,
            note: `Borsa kapalı (${clock.bistLabel}); emir ${nextParts.ymd} saat 10:00 açılış eşleşmesine yazıldı.`
          });
          member.tradeHistory.unshift({
            id: 'th_' + Math.random().toString(36).slice(2, 9),
            ts: nowMs,
            side: 'AÇILIŞ EMRİ',
            assetKey: asset.key,
            ticker: asset.ticker,
            name: asset.name,
            amountTL,
            priceTL: asset.priceTL,
            thesisTag,
            thesisNote,
            feeAndTaxTL: 0,
            spreadLeakTL: 0,
            note: `${nextParts.ymd} 10:00 Borsa İstanbul açılış ziline kuyruğa alındı.`
          });
          member.livedMilestones.executedRealOrder = true;
          member.updatedAt = nowMs;
          member.rev = (member.rev || 1) + 1;
          const ev = broadcastTradeToLeague(member, 'Sabah Açılışına Emir Yazdı', asset.ticker, amountTL, thesisNote);
          saveState(true, false);
          publishMyInvestorToMesh(ev);
          return {
            ok: true,
            status: 'QUEUED_BIST_OPEN',
            message: `${clock.bistLabel}. Alım emrin gerçek hayattaki gibi ${nextParts.ymd} sabah 10:00 açılış eşleşmesine alındı.`
          };
        }

        const execPrice = asset.subVenue === 'BIST_STOCK' ? snapToBistTick(asset.priceTL) : asset.priceTL;
        const feeTL = +(amountTL * 0.00084).toFixed(2);
        const investable = Math.max(0, amountTL - feeTL);
        const qty = asset.subVenue === 'BIST_STOCK'
          ? Math.floor(investable / execPrice)
          : +(investable / execPrice).toFixed(4);
        if (qty <= 0) {
          return { ok: false, reason: `1 lot ${asset.ticker} fiyatı (${execPrice.toLocaleString('tr-TR')} ₺) girilen tutardan yüksek.` };
        }
        const totalCostTL = +(qty * execPrice + feeTL).toFixed(2);
        const borrowedTL = deductFunds(totalCostTL);
        member.totalFrictionBurnedTL = +((member.totalFrictionBurnedTL || 0) + feeTL).toFixed(2);
        mergeSpotPosition(member, asset, qty, execPrice, clock.ymd, borrowedTL > 0 ? 'BIST_MARGIN' : 'BIST', thesisTag, thesisNote);
        member.livedMilestones.executedRealOrder = true;

        if (asset.subVenue === 'DARPHANE_S1') {
          const dInfo = getDarphanePremiumInfo();
          if (dInfo.premiumPct >= 4.0) {
            const airLeakTL = +(totalCostTL * (dInfo.premiumPct / (100 + dInfo.premiumPct))).toFixed(2);
            recordFootprint(
              member,
              'ALTIN_S1_AIR_PREMIUM',
              'Darphane Sertifikasında Fiziki Hava Parası',
              `ALTIN.S1 fiziki gram altından +%${dInfo.premiumPct} pahalıyken alındı; Kapalıçarşı fiziki altına göre ${airLeakTL.toLocaleString('tr-TR')} ₺ fazladan hava parası ödendi.`,
              airLeakTL
            );
          }
        }

        if ((asset.change1D || 0) >= 6.0 || asset.isPumpAnomaly) {
          recordFootprint(
            member,
            'FOMO_HERD_BUY',
            'Sürü Coşkusunda Zirve / Dedikodu Kovalama',
            `${asset.ticker} sert yükselişteyken (+%${(asset.change1D || 0).toFixed(1)}) veya sosyal medya hacim anomalisi varken alındı.`,
            feeTL
          );
        }

        if (borrowedTL > 0) {
          recordFootprint(
            member,
            'LEVERAGED_DEBT_LOAD',
            'Kredili Borç Yükü Omuzlarda',
            `${asset.ticker} alımında ${borrowedTL.toLocaleString('tr-TR')} ₺ aracı kurum kredisi kullanıldı (Yıllık %${getAnnualMarginRatePct()} faiz her gün işler).`,
            0
          );
        }

        member.tradeHistory.unshift({
          id: 'th_' + Math.random().toString(36).slice(2, 9),
          ts: nowMs,
          side: borrowedTL > 0 ? 'KREDİLİ ALIM' : 'ALIM',
          assetKey: asset.key,
          ticker: asset.ticker,
          name: asset.name,
          amountTL: totalCostTL,
          priceTL: execPrice,
          thesisTag,
          thesisNote,
          feeAndTaxTL: feeTL,
          spreadLeakTL: 0,
          note: borrowedTL > 0
            ? `${qty} lot alındı (${borrowedTL.toLocaleString('tr-TR')} ₺ kredi borcu kullanıldı · Günlük faiz işler).`
            : `${qty} lot ${execPrice.toLocaleString('tr-TR')} ₺ fiyattan eşleşti (Komisyon: ${feeTL.toLocaleString('tr-TR')} ₺).`
        });
        maybeSnapshotGhostHoldPortfolio(member);
        checkConcentrationFootprint(member);
        member.updatedAt = nowMs;
        member.rev = (member.rev || 1) + 1;
        const ev = broadcastTradeToLeague(member, borrowedTL > 0 ? 'Kredili Aldı' : 'Aldı', `${asset.ticker} (${qty} lot)`, totalCostTL, thesisNote);
        saveState(true, false);
        publishMyInvestorToMesh(ev);
        return {
          ok: true,
          status: 'FILLED',
          message: `${qty} adet ${asset.ticker} ${execPrice.toLocaleString('tr-TR')} ₺ fiyattan portföye eklendi${borrowedTL > 0 ? ` (${borrowedTL.toLocaleString('tr-TR')} ₺ kredi kullanıldı)` : ''}.`
        };
      }

      // E) VİOP, KÜRESEL USD BORSALARI & 7/24 KRİPTO
      if (asset.venue === 'VIOP' && !clock.viopOpen) {
        return { ok: false, reason: `${clock.viopLabel}. VİOP kontratları yalnızca 09:30–18:15 ve 19:00–23:00 seanslarında işlem görür.` };
      }
      if (asset.venue === 'GLOBAL_USD' && clock.isWeekend) {
        return { ok: false, reason: 'ABD ve Avrupa borsaları cumartesi ve pazar günleri kapalıdır (Kripto 7/24 açıktır).' };
      }

      const feeRate = asset.venue === 'GLOBAL_USD' ? 0.0015 : 0.001;
      const feeTL = +(amountTL * feeRate).toFixed(2);
      const netTL = Math.max(0, amountTL - feeTL);
      const qty = +(netTL / asset.priceTL).toFixed(6);
      deductFunds(amountTL);
      member.totalFrictionBurnedTL = +((member.totalFrictionBurnedTL || 0) + feeTL).toFixed(2);
      mergeSpotPosition(member, asset, qty, asset.priceTL, clock.ymd, asset.venue, thesisTag, thesisNote);
      member.livedMilestones.executedRealOrder = true;
      member.tradeHistory.unshift({
        id: 'th_' + Math.random().toString(36).slice(2, 9),
        ts: nowMs,
        side: 'ALIM',
        assetKey: asset.key,
        ticker: asset.ticker,
        name: asset.name,
        amountTL,
        priceTL: asset.priceTL,
        thesisTag,
        thesisNote,
        feeAndTaxTL: feeTL,
        spreadLeakTL: 0,
        note: asset.isGvk80
          ? 'Yurt dışı varlık alındı (Satışta Yİ-ÜFE endekslemesi sonrası GVK Mük. 80 beyanına tabidir).'
          : 'Anlık piyasa fiyatından eşleşti.'
      });
      maybeSnapshotGhostHoldPortfolio(member);
      checkConcentrationFootprint(member);
      member.updatedAt = nowMs;
      member.rev = (member.rev || 1) + 1;
      const ev = broadcastTradeToLeague(member, 'Aldı', asset.ticker, amountTL, thesisNote);
      saveState(true, false);
      publishMyInvestorToMesh(ev);
      return { ok: true, status: 'FILLED', message: `${asset.name} alımı tamamlandı.` };
    }

    // --- SATIŞ İŞLEMİ (SELL) ---
    if (side === 'SELL') {
      const pos = member.positions[asset.key];
      if (!pos || pos.qty <= 0) return { ok: false, reason: 'Portföyünde bu yatırımdan bulunmuyor.' };

      if (asset.venue === 'VIOP' && !clock.viopOpen) {
        return { ok: false, reason: `${clock.viopLabel}. VİOP kontratları yalnızca 09:30–18:15 ve 19:00–23:00 seanslarında kapatılabilir.` };
      }
      if (asset.venue === 'GLOBAL_USD' && clock.isWeekend) {
        return { ok: false, reason: 'ABD ve Avrupa borsaları cumartesi ve pazar günleri kapalıdır; satış emri pazartesi seans açılışında verilebilir.' };
      }

      const alreadyQueuedSellQty = (member.pendingOrders || [])
        .filter((o) => o.side === 'SELL' && o.assetKey === asset.key)
        .reduce((s, o) => s + Number(o.qty || 0), 0);
      const availableQty = +(pos.qty - alreadyQueuedSellQty).toFixed(6);
      if (availableQty <= 0.000001) {
        return {
          ok: false,
          reason: `Bu pozisyonun tamamı (${alreadyQueuedSellQty} adet) zaten sabah 10:00 açılış eşleşmesi için satış kuyruğunda bekliyor.`
        };
      }

      const micro = inspectBoardMicrostructure(asset);
      const ratio = Math.min(1, Math.max(0.01, Number(params.sellRatio) || 1));
      const sellQty = asset.subVenue === 'BIST_STOCK'
        ? Math.min(Math.floor(availableQty), Math.max(1, Math.floor(availableQty * ratio)))
        : +(availableQty * ratio).toFixed(6);
      if (sellQty <= 0) {
        return { ok: false, reason: 'Satılabilir lot miktarı yetersiz.' };
      }

      if (asset.venue === 'BIST') {
        if (micro.isBrutTakas && pos.lastBuyDayYmd === clock.ymd) {
          return {
            ok: false,
            reason: `${asset.ticker} üzerinde VBTS Brüt Takas tedbiri var: Bugün alınan pay aynı gün satılamaz!`
          };
        }
        if (micro.isTabanLocked) {
          return {
            ok: false,
            reason: `${asset.ticker} %${asset.change1D.toFixed(2)} ile Taban Kilitli! Tahtada alıcı yok, satış emri taban kuyruğunda kilitli kalır.`
          };
        }
        if (micro.isCircuitBreaker) {
          return { ok: false, reason: `${asset.ticker} devre kesicide! Eşleşme bitene kadar satış yapılamaz.` };
        }
        if (!clock.bistCanMatchNow) {
          const nextOpenMs = getNextBistOpenMatchMs(nowMs);
          const nextParts = getIstanbulParts(nextOpenMs);
          member.pendingOrders.push({
            id: 'po_' + Math.random().toString(36).slice(2, 9),
            side: 'SELL',
            assetKey: asset.key,
            name: asset.name,
            reservedTL: 0,
            qty: sellQty,
            orderType: 'BIST_OPEN_AUCTION',
            executesAtMs: nextOpenMs,
            createdAtMs: nowMs,
            door: 'BIST',
            note: `Borsa kapalı; ${sellQty} adet satış emri ${nextParts.ymd} 10:00 açılış eşleşmesine yazıldı.`
          });
          member.updatedAt = nowMs;
          member.rev = (member.rev || 1) + 1;
          saveState(true, true);
          return {
            ok: true,
            status: 'QUEUED_BIST_OPEN',
            message: `Borsa kapalı olduğu için ${sellQty} adet satış emrin ${nextParts.ymd} sabah 10:00 açılış eşleşmesine alındı.`
          };
        }
      }

      const door = params.door === 'BAZAAR' ? 'BAZAAR' : 'BANK';
      if (asset.venue === 'TWO_DOOR' && door === 'BAZAAR' && !clock.grandBazaarOpen) {
        return { ok: false, reason: 'Kapalıçarşı şu an kapalı; sabah 09:30 açılışını bekle veya Mobil Banka kanalını seç.' };
      }

      const res = settleSpotSale(member, asset, sellQty, asset.priceTL, nowMs, door, false);
      member.updatedAt = nowMs;
      member.rev = (member.rev || 1) + 1;
      const ev = broadcastTradeToLeague(member, 'Sattı', asset.ticker, res.netAfterFeeAndStopajTL, '');
      saveState(true, false);
      publishMyInvestorToMesh(ev);
      return {
        ok: true,
        status: asset.venue === 'BIST' ? 'SOLD_T2_SETTLEMENT' : 'SOLD_CASH',
        message: asset.venue === 'BIST'
          ? `${sellQty} adet ${asset.ticker} satıldı. Net ${res.netAfterFeeAndStopajTL.toLocaleString('tr-TR')} ₺ T+2 takas kum saatine girdi (2 iş günü nakit çekilemez).`
          : `Satış tamamlandı; net ${res.netAfterFeeAndStopajTL.toLocaleString('tr-TR')} ₺ nakit kasana geçti${res.gvk80TaxReserveTL > 0 ? ` (${res.gvk80TaxReserveTL.toLocaleString('tr-TR')} ₺ beyan vergisi karşılığı ayrıldı)` : ''}.`
      };
    }

    return { ok: false, reason: 'Geçersiz işlem yönü.' };
  }

  function participateInIpo(ipoId, requestedLots) {
    const member = getActiveMember();
    processTimeHooksForMember(member);
    const catalog = getActiveIpoCatalog();
    const ipo = catalog.find((x) => x.id === ipoId);
    if (!ipo) return { ok: false, reason: 'Halka arz bulunamadı.' };
    const reqCycleKey = ipo.cycleId || ipo.id;
    if ((member.ipoRequests || []).some((r) => (r.cycleId || r.ipoId) === reqCycleKey)) {
      return { ok: false, reason: 'Bu halka arza zaten talep gönderdin.' };
    }
    const lots = Math.max(1, Math.floor(Number(requestedLots) || 0));
    const blockedCashTL = +(lots * ipo.offerPriceTL).toFixed(2);
    if (blockedCashTL > member.cashTL) {
      return { ok: false, reason: `Halka arz talebi için ${blockedCashTL.toLocaleString('tr-TR')} ₺ nakit blokajı gerekiyor (Mevcut nakit: ${member.cashTL.toLocaleString('tr-TR')} ₺).` };
    }
    const perCapitaLots = Math.max(5, Math.round(ipo.totalOfferedLots / ipo.estimatedParticipants));
    member.cashTL = +(member.cashTL - blockedCashTL).toFixed(2);
    member.ipoRequests.push({
      id: 'ipor_' + Math.random().toString(36).slice(2, 8),
      ipoId: ipo.id,
      cycleId: reqCycleKey,
      ticker: ipo.ticker,
      name: ipo.name,
      sector: ipo.sector,
      offerPriceTL: ipo.offerPriceTL,
      requestedLots: lots,
      perCapitaLots,
      blockedCashTL,
      allocatesAtMs: ipo.closesAtMs
    });
    const closeParts = getIstanbulParts(ipo.closesAtMs);
    const nowTs = getTurkishClock().ms;
    member.tradeHistory.unshift({
      id: 'th_iporeq_' + Math.random().toString(36).slice(2, 8),
      ts: nowTs,
      side: 'HALKA ARZ TALEP',
      assetKey: 'bist-' + ipo.ticker.toLowerCase(),
      name: `${ipo.name} (${ipo.ticker})`,
      amountTL: blockedCashTL,
      priceTL: ipo.offerPriceTL,
      feeAndTaxTL: 0,
      spreadLeakTL: 0,
      note: `${lots} lot talep girildi (${blockedCashTL.toLocaleString('tr-TR')} ₺ bloke edildi · Dağıtım: ${closeParts.ymd} 17:00).`
    });
    member.updatedAt = nowTs;
    member.rev = (member.rev || 1) + 1;
    const ev = broadcastTradeToLeague(member, 'Halka Arza Katıldı', `${ipo.ticker} (${lots} lot talep)`, blockedCashTL, '');
    saveState(true, false);
    publishMyInvestorToMesh(ev);
    return {
      ok: true,
      message: `${ipo.ticker} halka arzına ${lots} lot (${blockedCashTL.toLocaleString('tr-TR')} ₺) talep girildi. ${closeParts.ymd} saat 17:00 dağıtımında gerçek katılımcı sayısına göre (~${perCapitaLots} lot) pay düşecek ve artan nakit iade edilecek.`
    };
  }

  // --------------------------------------------------------------------------
  // 9. PORTFÖY DEĞERLEME, TEMİNAT RİSKİ, HAYALET SABIR SEPETİ VE USTALIK ENDEKSİ
  // --------------------------------------------------------------------------
  function evaluateRateTranche(tr, nowMs) {
    const elapsedDays = Math.max(0, (nowMs - (tr.openedAtMs || nowMs)) / (24 * 3600 * 1000));
    const effectiveDays = tr.isTermDeposit && tr.maturityDays > 0
      ? Math.min(elapsedDays, tr.maturityDays)
      : elapsedDays;
    const grossInterestTL = +(tr.principalTL * ((tr.annualGrossPct || 0) / 100) * (effectiveDays / 365)).toFixed(2);
    const stopajTL = +(grossInterestTL * ((tr.stopajPct || 0) / 100)).toFixed(2);
    const netInterestTL = +(grossInterestTL - stopajTL).toFixed(2);
    const isMatured = !tr.isTermDeposit || nowMs >= (tr.maturesAtMs || 0);
    const annualNetPct = +((tr.annualGrossPct || 0) * (1 - (tr.stopajPct || 0) / 100)).toFixed(2);
    const monthlyNetDripTL = +((tr.principalTL * (annualNetPct / 100)) / 12).toFixed(2);
    return {
      ...tr,
      elapsedDays: +elapsedDays.toFixed(2),
      remainingDays: tr.isTermDeposit ? Math.max(0, Math.ceil(((tr.maturesAtMs || 0) - nowMs) / (24 * 3600 * 1000))) : 0,
      isMatured,
      grossInterestTL,
      stopajTL,
      netInterestTL,
      annualNetPct,
      monthlyNetDripTL,
      accruedNetValueTL: +(tr.principalTL + netInterestTL).toFixed(2),
      netRedeemableTL: isMatured ? +(tr.principalTL + netInterestTL).toFixed(2) : tr.principalTL,
      forfeitedIfBrokenEarlyTL: isMatured ? 0 : netInterestTL
    };
  }

  function evaluateGhostHoldValue(ghost, nowMs) {
    if (!ghost) return null;
    let total = Number(ghost.cashTL) || 0;
    for (const t of (ghost.rateTranches || [])) {
      total += evaluateRateTranche(t, nowMs).accruedNetValueTL;
    }
    for (const pos of Object.values(ghost.positions || {})) {
      if (!pos || pos.qty <= 0) continue;
      const asset = getAsset(pos.assetKey);
      const unitTL = asset ? asset.priceTL : pos.avgCostTL;
      const grossValTL = +(pos.qty * unitTL).toFixed(2);
      const taxInfo = asset ? computePositionTaxOnGain(asset, pos, unitTL, pos.qty) : { stopajTL: 0, gvk80TaxReserveTL: 0 };
      total += (grossValTL - taxInfo.stopajTL - taxInfo.gvk80TaxReserveTL);
    }
    const baseDebt = Number(ghost.marginDebtTL) || 0;
    if (baseDebt > 0) {
      const elapsedDays = Math.max(0, (nowMs - (ghost.capturedAtMs || nowMs)) / (24 * 3600 * 1000));
      const ghostDebtNow = baseDebt * (1 + (getAnnualMarginRatePct() / 100 / 365) * elapsedDays);
      total -= ghostDebtNow;
    }
    total -= (Number(ghost.gvk80TaxPayableTL) || 0);
    return Math.max(0, +total.toFixed(2));
  }

  function evaluateMemberPortfolio(member, customNowMs) {
    const m = member || getActiveMember();
    const nowMs = customNowMs != null ? customNowMs : getTurkishClock().ms;

    const cashTL = +(Number(m.cashTL) || 0).toFixed(2);
    const marginDebtTL = +(Number(m.marginDebtTL) || 0).toFixed(2);
    const gvk80TaxPayableTL = +(Number(m.gvk80TaxPayableTL) || 0).toFixed(2);
    const unsettledTL = +((m.settlementQueue || []).reduce((s, q) => s + Number(q.grossTL || 0), 0)).toFixed(2);
    const pendingOrderTL = +((m.pendingOrders || []).reduce((s, o) => s + Number(o.reservedTL || 0), 0)).toFixed(2);
    const ipoBlockedTL = +((m.ipoRequests || []).reduce((s, r) => s + Number(r.blockedCashTL || 0), 0)).toFixed(2);

    const tranches = (m.rateTranches || []).map((t) => evaluateRateTranche(t, nowMs));
    const tranchesNetTL = +(tranches.reduce((s, t) => s + t.accruedNetValueTL, 0)).toFixed(2);

    const spotItems = [];
    let spotGrossTL = 0;
    let spotNetAfterTaxTL = 0;
    let bistCollateralTL = 0;
    let annualDividendNetTL = 0;

    for (const pos of Object.values(m.positions || {})) {
      if (!pos || pos.qty <= 0) continue;
      const asset = getAsset(pos.assetKey);
      const unitTL = asset ? asset.priceTL : pos.avgCostTL;
      const grossValTL = +(pos.qty * unitTL).toFixed(2);
      const costValTL = +(pos.qty * pos.avgCostTL).toFixed(2);
      const taxInfo = asset
        ? computePositionTaxOnGain(asset, pos, unitTL, pos.qty)
        : { stopajTL: 0, gvk80TaxReserveTL: 0 };
      const netValTL = +(grossValTL - taxInfo.stopajTL - taxInfo.gvk80TaxReserveTL).toFixed(2);
      const pnlNetTL = +(netValTL - costValTL).toFixed(2);
      const pnlNetPct = costValTL > 0 ? +((pnlNetTL / costValTL) * 100).toFixed(2) : 0;

      if (asset && asset.venue === 'BIST') bistCollateralTL += grossValTL;
      if (asset && asset.bistRow && (asset.bistRow.dividendYield || 0) > 0) {
        annualDividendNetTL += grossValTL * ((asset.bistRow.dividendYield / 100) * 0.85);
      } else if (asset && asset.id === 'eurobond-usdtr') {
        annualDividendNetTL += grossValTL * 0.068;
      }

      spotGrossTL += grossValTL;
      spotNetAfterTaxTL += netValTL;
      spotItems.push({
        ...pos,
        name: asset ? asset.name : pos.assetKey,
        ticker: asset ? asset.ticker : pos.assetKey,
        categoryName: asset ? asset.categoryName : '',
        venue: asset ? asset.venue : 'SPOT',
        change1D: asset ? asset.change1D : 0,
        unitTL,
        grossValTL,
        netValTL,
        costValTL,
        unrealizedStopajTL: taxInfo.stopajTL,
        unrealizedGvk80TL: taxInfo.gvk80TaxReserveTL,
        pnlNetTL,
        pnlNetPct
      });
    }

    spotItems.sort((a, b) => b.netValTL - a.netValTL);

    const grossAssetsTL = +(cashTL + unsettledTL + pendingOrderTL + ipoBlockedTL + tranchesNetTL + spotNetAfterTaxTL).toFixed(2);
    const totalNetWorthTL = Math.max(0, +(grossAssetsTL - marginDebtTL - gvk80TaxPayableTL).toFixed(2));
    const baselineTL = Math.max(1, Number(m.baselineCapitalTL) || DEFAULT_STARTING_CAPITAL_TL);
    const nominalPnlTL = +(totalNetWorthTL - baselineTL).toFixed(2);
    const nominalPnlPct = +(((totalNetWorthTL / baselineTL) - 1) * 100).toFixed(2);

    const elapsedYears = Math.max(0, (nowMs - (m.createdAt || nowMs)) / (365 * 24 * 3600 * 1000));
    const infFactor = Math.pow(1 + (getAnnualInflationPct() / 100), elapsedYears);
    const inflationAdjustedBaselineTL = +(baselineTL * infFactor).toFixed(2);
    const realPurchasingPnlTL = +(totalNetWorthTL - inflationAdjustedBaselineTL).toFixed(2);
    const realPurchasingPnlPct = inflationAdjustedBaselineTL > 0
      ? +(((totalNetWorthTL / inflationAdjustedBaselineTL) - 1) * 100).toFixed(2)
      : 0;

    const bm = m.benchmarksAtStart || captureCurrentBenchmarkPrices();
    const curGold = getAsset('gram-altin-spot')?.priceTL || bm.goldPrice || 6115;
    const curBist = getAsset('bist-100')?.priceTL || bm.bistPrice || 11677;
    const depNetPct = bm.depositNetAnnualPct || 32.18;
    const ifAllGoldTL = +(baselineTL * (curGold / Math.max(1, bm.goldPrice || curGold))).toFixed(2);
    const ifAllBist100TL = +(baselineTL * (curBist / Math.max(1, bm.bistPrice || curBist))).toFixed(2);
    const ifAllDepositNetTL = +(baselineTL * Math.pow(1 + depNetPct / 100, elapsedYears)).toFixed(2);

    // Kredili İşlem Teminat Durumu
    let marginStatus = null;
    if (marginDebtTL > 0) {
      const collateralBase = Math.max(1, bistCollateralTL + cashTL + unsettledTL);
      const equityRatioPct = +(((collateralBase - marginDebtTL) / collateralBase) * 100).toFixed(1);
      const dailyInterestCostTL = +((marginDebtTL * (getAnnualMarginRatePct() / 100)) / 365).toFixed(2);
      marginStatus = {
        debtTL: marginDebtTL,
        annualRatePct: getAnnualMarginRatePct(),
        dailyInterestCostTL,
        equityRatioPct,
        isMarginCall: equityRatioPct < 35.0,
        isWarning: equityRatioPct < 45.0
      };
    }

    // Pasif Nakit Çarkı (Aylık Net Gelir Damlası + Aktifse Gecelik Nema)
    const monthlyRateIncomeTL = tranches.reduce((s, t) => s + t.monthlyNetDripTL, 0);
    const monthlyOvernightRepoTL = (m.autoOvernightRepo && cashTL > 10000)
      ? ((cashTL - 10000) * (getOvernightRepoNetAnnualPct() / 100)) / 12
      : 0;
    const monthlyPassiveIncomeTL = +(monthlyRateIncomeTL + monthlyOvernightRepoTL + (annualDividendNetTL / 12)).toFixed(2);
    const monthlyExpense = Math.max(5000, Number(m.monthlyExpenseTL) || 40000);
    const passiveCoveragePct = +((monthlyPassiveIncomeTL / monthlyExpense) * 100).toFixed(1);

    // Hayalet Sabır Portföyü Kıyaslaması
    const ghostHoldNetWorthTL = evaluateGhostHoldValue(m.ghostHoldPortfolio, nowMs);
    const patienceDiffTL = ghostHoldNetWorthTL != null ? +(totalNetWorthTL - ghostHoldNetWorthTL).toFixed(2) : null;

    // Varlık Sınıfı Dağılım Yüzdeleri (Görsel Çubuk İçin)
    let metalTL = 0, equityTL = 0, fixedTL = tranchesNetTL, fxCryptoGlobalTL = 0;
    for (const s of spotItems) {
      const a = getAsset(s.assetKey);
      if (!a) { equityTL += s.netValTL; continue; }
      if (a.categoryId === '2' || a.subVenue === 'DARPHANE_S1') metalTL += s.netValTL;
      else if (a.venue === 'BIST') equityTL += s.netValTL;
      else fxCryptoGlobalTL += s.netValTL;
    }
    const denom = Math.max(1, grossAssetsTL);
    const allocationBreakdown = {
      equityPct: +((equityTL / denom) * 100).toFixed(1),
      metalPct: +((metalTL / denom) * 100).toFixed(1),
      fixedPct: +((fixedTL / denom) * 100).toFixed(1),
      globalFxCryptoPct: +((fxCryptoGlobalTL / denom) * 100).toFixed(1),
      cashPct: +(((cashTL + unsettledTL + pendingOrderTL + ipoBlockedTL) / denom) * 100).toFixed(1)
    };

    const largestSingleSharePct = totalNetWorthTL > 0 && spotItems.length > 0
      ? +((spotItems[0].netValTL / totalNetWorthTL) * 100).toFixed(1)
      : 0;

    return {
      memberId: m.id,
      name: m.name,
      roleLabel: m.roleLabel,
      cashTL,
      marginDebtTL,
      gvk80TaxPayableTL,
      autoOvernightRepo: Boolean(m.autoOvernightRepo),
      overnightRepoEarnedTL: +(Number(m.overnightRepoEarnedTL) || 0).toFixed(2),
      marginStatus,
      unsettledTL,
      pendingOrderTL,
      ipoBlockedTL,
      tranches,
      tranchesNetTL,
      spotItems,
      spotGrossTL: +spotGrossTL.toFixed(2),
      spotNetAfterTaxTL: +spotNetAfterTaxTL.toFixed(2),
      totalNetWorthTL,
      baselineTL,
      nominalPnlTL,
      nominalPnlPct,
      inflationTargetTL: inflationAdjustedBaselineTL,
      realPurchasingPnlTL,
      realPurchasingPnlPct,
      ifAllGoldTL,
      ifAllBist100TL,
      ifAllDepositNetTL,
      monthlyPassiveIncomeTL,
      monthlyExpense,
      passiveCoveragePct,
      ghostHoldNetWorthTL,
      patienceDiffTL,
      totalFrictionBurnedTL: +(Number(m.totalFrictionBurnedTL) || 0).toFixed(2),
      allocationBreakdown,
      largestSingleSharePct
    };
  }

  function evaluateInvestorMastery(member, snapOverride) {
    const m = member || getActiveMember();
    const snap = snapOverride || evaluateMemberPortfolio(m);

    // 1) Kasa & Varlık Kalitesi (0–100)
    let qualityScore = 65;
    if (snap.spotItems.length > 0 || snap.tranches.length > 0) {
      let weightedQ = 0, totalW = 0;
      for (const tr of snap.tranches) {
        const q = tr.stopajPct === 0 ? 92 : 82;
        weightedQ += q * tr.accruedNetValueTL;
        totalW += tr.accruedNetValueTL;
      }
      for (const it of snap.spotItems) {
        const a = getAsset(it.assetKey);
        let q = 74;
        if (a?.bistRow) {
          const isFin = a.bistRow.entityKind === 'bank' || a.bistRow.entityKind === 'insurance' || a.bistRow.entityKind === 'fin_other';
          if (isFin) {
            if ((a.bistRow.netIncomeMillionTL || 0) > 0 && (a.bistRow.roe || 0) >= 20) q = 89;
            else if ((a.bistRow.netIncomeMillionTL || 0) > 0) q = 80;
            else q = 48;
          } else if ((a.bistRow.ocfMillionTL || 0) > 0 && (a.bistRow.cashMillionTL || 0) >= (a.bistRow.totalDebtMillionTL || 0) * 0.5) q = 94;
          else if ((a.bistRow.ocfMillionTL || 0) > 0) q = 84;
          else if (a.isTms29Illusion || a.distributionTrap || a.isPumpAnomaly) q = 28;
          else q = 52;
        } else if (a?.subVenue === 'DARPHANE_S1' && getDarphanePremiumInfo().premiumPct > 8) {
          q = 42;
        } else if (a?.id === 'gram-altin-spot' || a?.id === 'abd-sp500-spy') {
          q = 86;
        }
        weightedQ += q * it.netValTL;
        totalW += it.netValTL;
      }
      if (totalW > 0) qualityScore = Math.round(weightedQ / totalW);
    }

    // 2) Sepet Dengesi & Risk Kontrolü
    let balanceScore = 85;
    if (snap.allocationBreakdown.cashPct > 92) balanceScore = 45;
    else if (snap.largestSingleSharePct > 75) balanceScore = 32;
    else if (snap.largestSingleSharePct > 55) balanceScore = 58;
    else if ((snap.spotItems.length + snap.tranches.length) >= 3) balanceScore = 94;
    if (snap.marginDebtTL > snap.totalNetWorthTL * 0.35) balanceScore = Math.max(20, balanceScore - 28);

    // 3) Maliyet, Makas & Vergi Ustalığı
    const frictionRatioPct = (snap.totalFrictionBurnedTL / Math.max(1, snap.baselineTL)) * 100;
    const costScore = Math.max(20, Math.min(98, Math.round(96 - frictionRatioPct * 22)));

    // 4) Sabır & Soğukkanlılık
    const sellTrades = (m.tradeHistory || []).filter((t) => t.side === 'SATIŞ' || t.side === 'ERKEN BOZUM').length;
    const panicCount = (m.footprints || []).filter((f) => f.code === 'PANIC_RED_DAY_SALE' || f.code === 'EARLY_DEPOSIT_BREAK').length;
    const patienceScore = Math.max(20, Math.min(98, 92 - sellTrades * 4 - panicCount * 18));

    // 5) Araştırma vs Dedikodu Disiplini
    let resSum = 0, resCnt = 0, rumSum = 0, rumCnt = 0;
    for (const it of snap.spotItems) {
      if (it.thesisTag === 'RUMOR_IMPULSE') { rumSum += it.pnlNetPct; rumCnt++; }
      else { resSum += it.pnlNetPct; resCnt++; }
    }
    for (const th of (m.tradeHistory || [])) {
      if (th.side === 'SATIŞ' && th.realizedPnlPct != null) {
        if (th.thesisTag === 'RUMOR_IMPULSE') { rumSum += th.realizedPnlPct; rumCnt++; }
        else { resSum += th.realizedPnlPct; resCnt++; }
      }
    }
    const thesisWrittenCount = Object.values(m.positions || {}).filter((p) => p.thesisNote && p.thesisNote.length >= 4).length;
    const disciplineScore = Math.max(25, Math.min(98, 72 + thesisWrittenCount * 7 - rumCnt * 14 + (m.livedMilestones?.inspectedCashScale ? 8 : 0)));

    // 6) Enflasyon Kalkanı & Nakit Çarkı
    let shieldScore = 60;
    if (snap.allocationBreakdown.cashPct <= 25 && snap.monthlyPassiveIncomeTL > 0) shieldScore = 90;
    else if (snap.allocationBreakdown.cashPct <= 40) shieldScore = 78;
    else if (snap.allocationBreakdown.cashPct > 80) shieldScore = 38;

    const overallScore = Math.round(
      qualityScore * 0.24 +
      balanceScore * 0.18 +
      costScore * 0.16 +
      patienceScore * 0.18 +
      disciplineScore * 0.14 +
      shieldScore * 0.10
    );

    let rankTitle = 'Gözlemci Çırak';
    if (overallScore >= 85) rankTitle = 'Keskin Gözlü Kasa Ustası';
    else if (overallScore >= 74) rankTitle = 'Soğukkanlı Stratejist';
    else if (overallScore >= 62) rankTitle = 'Pazar Sezgisi Açık Yatırımcı';

    // Görmüş Geçirmiş Dostun Kişisel Yorumu
    let mentorVoice = '';
    if (snap.allocationBreakdown.cashPct > 85) {
      mentorVoice = 'Paranın neredeyse tamamı hâlâ boş nakitte bekliyor dostum. Enflasyonun %' + getAnnualInflationPct().toFixed(1) + ' olduğu yerde hareketsiz beklemek de bir karardır ama her gün sessizce alım gücünden yer. Hiç değilse bir kısmını %0 stopajlı Kira Sertifikası veya sağlam kasalı gerçek varlıklarla çalıştırmaya başla.';
    } else if (snap.marginStatus?.isWarning) {
      mentorVoice = 'Sırtında ' + Math.round(snap.marginDebtTL).toLocaleString('tr-TR') + ' ₺ aracı kurum kredisi taşıyorsun ve her gece faiz işliyor. Borç parayla alınan mal, piyasa biraz sallandığında insanın uykusunu kaçırır ve en dipte zorla sattırır. Özsermayeni rahatlat.';
    } else if (snap.largestSingleSharePct >= 68) {
      mentorVoice = '1 milyon liranın %' + snap.largestSingleSharePct + ' kadarını tek bir sepete yüklemişsin. Haklı çıkarsan yüzün güler ama o tek dal kırılırsa içini cız ettirir; yanına farklı mevsimde çalışan bir denge ayağı ekle.';
    } else if (rumCnt > 0) {
      mentorVoice = 'Portföyünde bilanço bakmadan veya sert yükseliş heyecanıyla atladığın hamleler var. Ay sonunda kasa yalan söylemez: İşin mutfağını kurcalayarak aldıklarınla gaza gelip aldıklarının farkını aşağıda net göreceksin.';
    } else if (overallScore >= 80) {
      mentorVoice = 'Kurduğun denge sağlam görünüyor dostum: Hem nakit üreten kaliteli kasalar seçmişsin hem de gişe makaslarına yem olmamışsın. Şimdi en zor ama en kazançlı kısım başlıyor: Ekran başında her dakika kurcalamadan sabırla işine gücüne bakmak.';
    } else {
      mentorVoice = 'Adımlarını atmaya başladın. Bir şirkete ortak olurken sadece hisse fiyatına değil, mahalle fırını gibi kasasına gerçek nakit girip girmediğine ve borç yüküne bakmayı alışkanlık haline getir.';
    }

    return {
      overallScore,
      rankTitle,
      mentorVoice,
      axes: [
        { label: 'Kasa & Nakit Kalitesi', score: qualityScore },
        { label: 'Sepet Dengesi', score: balanceScore },
        { label: 'Makas & Vergi Ustalığı', score: costScore },
        { label: 'Sabır & Soğukkanlılık', score: patienceScore },
        { label: 'Araştırma Disiplini', score: disciplineScore },
        { label: 'Enflasyon & Nakit Çarkı', score: shieldScore }
      ],
      researchVsRumor: {
        researchCount: resCnt,
        researchAvgPct: resCnt > 0 ? +(resSum / resCnt).toFixed(2) : null,
        rumorCount: rumCnt,
        rumorAvgPct: rumCnt > 0 ? +(rumSum / rumCnt).toFixed(2) : null
      }
    };
  }

  function checkConcentrationFootprint(member) {
    const snap = evaluateMemberPortfolio(member);
    if (snap.largestSingleSharePct >= 68 && snap.spotItems.length > 0) {
      recordFootprint(
        member,
        'SINGLE_BASKET_RISK',
        'Tüm Yumurtalar Tek Sepette',
        `Toplam portföyünün %${snap.largestSingleSharePct} kadarı tek başına ${snap.spotItems[0].name} içinde toplandı; tek bir ters haber tüm sermayeni sarsabilir.`,
        0
      );
    }
  }

  // --------------------------------------------------------------------------
  // 10. KİMLİK KAYDI, ODA DEĞİŞİMİ, SIFIRLAMA VE MEYDAN SOHBETİ
  // --------------------------------------------------------------------------
  function completeOnboarding(name, roleLabel) {
    const cleanName = String(name || '').trim().slice(0, 28);
    if (cleanName.length < 2) {
      return { ok: false, reason: 'Lütfen ligde görünecek adını yaz (en az 2 harf).' };
    }
    const m = getActiveMember();
    const wasRegistered = Boolean(m.profileRegistered);
    m.name = cleanName;
    if (roleLabel && String(roleLabel).trim()) {
      m.roleLabel = String(roleLabel).trim().slice(0, 32);
    }
    m.avatarColor = pickAvatarColor(m.id + cleanName);
    m.deviceLabel = detectDeviceLabel();
    m.profileRegistered = true;
    m.updatedAt = Date.now();
    m.rev = (Number(m.rev) || 1) + 1;

    let joinEv = null;
    if (!wasRegistered) {
      joinEv = {
        id: 'ev_join_' + m.id + '_' + Date.now().toString(36).slice(-4),
        ts: Date.now(),
        kind: 'JOIN',
        authorId: m.id,
        authorName: m.name,
        targetName: '',
        text: `${m.name} (${m.deviceLabel}) 1.000.000 ₺ başlangıç sermayesiyle Canlı Yatırımcı Ligine katıldı!`
      };
      state.banterFeed.unshift(joinEv);
    }
    saveState(true, false);
    publishMyInvestorToMesh(joinEv);
    return { ok: true, member: m };
  }

  function resetMemberOneMillion() {
    const target = getActiveMember();
    const now = Date.now();
    target.baselineCapitalTL = DEFAULT_STARTING_CAPITAL_TL;
    target.cashTL = DEFAULT_STARTING_CAPITAL_TL;
    target.marginDebtTL = 0;
    target.gvk80TaxPayableTL = 0;
    target.overnightRepoEarnedTL = 0;
    target.totalFrictionBurnedTL = 0;
    target.benchmarksAtStart = captureCurrentBenchmarkPrices();
    target.ghostHoldPortfolio = null;
    target.positions = {};
    target.rateTranches = [];
    target.settlementQueue = [];
    target.pendingOrders = [];
    target.ipoRequests = [];
    target.creditedDividends = {};
    target.tradeHistory = [{
      id: 'th_rst_' + Math.random().toString(36).slice(2, 8),
      ts: now,
      side: 'BAŞLANGIÇ',
      assetKey: 'CASH_TL',
      name: '1.000.000 ₺ Sermaye Sıfırlandı',
      amountTL: DEFAULT_STARTING_CAPITAL_TL,
      priceTL: 1,
      feeAndTaxTL: 0,
      spreadLeakTL: 0,
      note: 'Portföy temiz 1.000.000 ₺ nakit ile yeniden başlatıldı.'
    }];
    target.footprints = [];
    target.idleErosionLog = { lastCheckedMs: now, cumulativeInflationLossTL: 0, missedSukukNetTL: 0 };
    target.createdAt = now;
    target.updatedAt = now;
    target.rev = (Number(target.rev) || 1) + 1;
    saveState(true, true);
    return { ok: true };
  }

  function updateHouseholdBaseline(params = {}) {
    const m = getActiveMember();
    if (params.name && String(params.name).trim().length >= 2) {
      m.name = String(params.name).trim().slice(0, 28);
      m.profileRegistered = true;
    }
    if (params.roleLabel) m.roleLabel = String(params.roleLabel).trim().slice(0, 32);
    if (params.monthlyExpenseTL != null) m.monthlyExpenseTL = Math.max(5000, Number(params.monthlyExpenseTL) || 40000);
    if (params.monthlySavingsTL != null) m.monthlySavingsTL = Math.max(0, Number(params.monthlySavingsTL) || 0);
    if (params.salaryDay != null) m.salaryDay = Number(params.salaryDay) === 1 ? 1 : 15;
    if (params.autoOvernightRepo != null) m.autoOvernightRepo = Boolean(params.autoOvernightRepo);
    if (params.roomCode != null) {
      const cleanRoom = String(params.roomCode || DEFAULT_ROOM_CODE).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '') || DEFAULT_ROOM_CODE;
      if (cleanRoom !== state.roomCode) {
        const oldRoom = state.roomCode;
        const oldBase = `${MESH_NAMESPACE}/${oldRoom}`;
        state.roomCode = cleanRoom;
        state.peers = {};
        state.banterFeed = [];
        for (const c of meshClients.values()) {
          if (c.connected && c.ws && c.ws.readyState === WebSocket.OPEN) {
            try {
              const s = () => ((mqttSubPacketSeq = (mqttSubPacketSeq % 60000) + 1));
              c.ws.send(buildMqttUnsubscribePacket(`${oldBase}/member/+`, s()));
              c.ws.send(buildMqttUnsubscribePacket(`${oldBase}/event`, s()));
              c.ws.send(buildMqttUnsubscribePacket(`${oldBase}/banter_snapshot`, s()));
              c.ws.send(buildMqttUnsubscribePacket(`${oldBase}/sync_ping`, s()));
              if (m.profileRegistered) {
                c.ws.send(buildMqttPublishPacket(`${oldBase}/member/${m.id}`, '', true));
              }
              subscribeSocketToActiveRoom(c.ws);
            } catch (_) {}
          }
        }
        if (m.profileRegistered && global.fetch && global.location?.protocol !== 'file:') {
          fetch('./api/family-hub', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
            body: JSON.stringify({ roomCode: oldRoom, members: [{ id: m.id, _deleted: true }] })
          }).catch(() => {});
        }
        startCloudMesh();
        syncHttpFamilyHubAsync();
      }
    }
    m.updatedAt = Date.now();
    m.rev = (Number(m.rev) || 1) + 1;
    saveState(true, true);
    return { ok: true };
  }

  function postTeaBanter(text, targetName = '') {
    const clean = String(text || '').trim().slice(0, 240);
    if (!clean) return false;
    const m = getActiveMember();
    const item = {
      id: 'b_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3),
      ts: Date.now(),
      kind: 'CHAT',
      authorId: m.id,
      authorName: m.name || 'Yatırımcı',
      targetName: String(targetName || '').slice(0, 28),
      text: clean
    };
    state.banterFeed.unshift(item);
    if (state.banterFeed.length > 40) state.banterFeed.length = 40;
    saveState(true, false);
    publishMyInvestorToMesh(item);
    return true;
  }

  // --------------------------------------------------------------------------
  // 11. ARKA PLAN CANLI PİYASA SENKRONİZASYONU (CORS-FREE TEXT/PLAIN + iOS NATIVE)
  // --------------------------------------------------------------------------
  function nativeBridgePostJson(url, bodyStr) {
    const reqId = 'nf_' + Math.random().toString(36).slice(2, 10);
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        nativeFetchCallbacks.delete(reqId);
        reject(new Error('Native fetch timeout'));
      }, 10000);
      nativeFetchCallbacks.set(reqId, {
        resolve: (res) => { clearTimeout(t); resolve(res); },
        reject: (err) => { clearTimeout(t); reject(err); }
      });
      global.webkit.messageHandlers.aetherBridge.postMessage({
        action: 'httpFetch',
        reqId,
        url,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyStr
      });
    });
  }

  async function smartHttpPostJson(url, bodyObj) {
    const bodyStr = JSON.stringify(bodyObj);
    if (global.fetch) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: bodyStr
        });
        if (res && res.ok) return res;
      } catch (_) {}
    }
    if (global.webkit?.messageHandlers?.aetherBridge) {
      return nativeBridgePostJson(url, bodyStr);
    }
    throw new Error('HTTP request failed');
  }

  async function refreshLiveMarketData() {
    if (!global.fetch && !global.webkit?.messageHandlers?.aetherBridge) return false;
    const isFileMode = global.location?.protocol === 'file:' || Boolean(global.__AETHER_NATIVE_IOS_APP__);

    if (!isFileMode) {
      try {
        const r = await fetch('./api/market-data', { cache: 'no-store' });
        if (r.ok) {
          const fresh = await r.json();
          if (fresh && Array.isArray(fresh.instruments) && fresh.instruments.length > 0) {
            marketData = fresh;
            lastLiveSyncMs = Date.now();
            rebuildAssetCatalog();
            notifyListeners();
            return true;
          }
        }
      } catch (_) {}
    }

    // Doğrudan Canlı TradingView Türkiye & Küresel Piyasa Taraması (0 Sunucuyla 4G/5G'de Çalışır!)
    try {
      const [tvRes, glRes] = await Promise.all([
        smartHttpPostJson('https://scanner.tradingview.com/turkey/scan', {
          filter: [{ left: 'type', operation: 'in_range', right: ['stock'] }],
          options: { lang: 'tr' },
          markets: ['turkey'],
          columns: [
            'name', 'close', 'change', 'Perf.W', 'Perf.1M', 'volume',
            'relative_volume_10d_calc', 'ChaikinMoneyFlow', 'price_earnings_ttm', 'price_book_fq',
            'total_debt', 'cash_n_short_term_invest_fq', 'net_debt',
            'current_ratio_fq', 'operating_margin_ttm',
            'capital_expenditures_ttm', 'cash_f_operating_activities_ttm',
            'net_income_ttm', 'total_assets_fq', 'ebitda_ttm'
          ],
          range: [0, 650]
        }).catch(() => null),
        smartHttpPostJson('https://scanner.tradingview.com/global/scan', {
          symbols: {
            tickers: [
              'FX_IDC:USDTRY', 'FX_IDC:EURTRY', 'FX_IDC:GBPTRY', 'FX_IDC:CHFTRY',
              'TVC:GOLD', 'TVC:SILVER', 'BIST:ALTIN', 'BIST:XU100', 'BIST:XU030', 'BIST:XU030D1!',
              'BIST:ZGOLD', 'BIST:GMSTR', 'BIST:USDTR',
              'BINANCE:BTCTRY', 'BINANCE:ETHTRY', 'BINANCE:SOLTRY',
              'AMEX:SPY', 'NASDAQ:QQQ', 'NASDAQ:NVDA', 'NASDAQ:AAPL', 'NASDAQ:MSFT',
              'AMEX:BNO', 'AMEX:DBA', 'ICEEUR:BRN1!', 'COMEX:HG1!'
            ]
          },
          columns: ['close', 'change']
        }).catch(() => null)
      ]);

      let updatedAny = false;

      if (glRes && glRes.ok) {
        const glJson = await glRes.json();
        const glMap = {};
        for (const item of (glJson.data || [])) {
          if (item.s && item.d && item.d[0] > 0) {
            glMap[item.s] = { close: Number(item.d[0]), chg: Number(item.d[1] || 0) };
          }
        }
        const usdTry = glMap['FX_IDC:USDTRY']?.close || marketData?.macro?.usdTry || 0;
        const usdChg = glMap['FX_IDC:USDTRY']?.chg || 0;
        const combineChg = (a, b) => +((((1 + (Number(a) || 0) / 100) * (1 + (Number(b) || 0) / 100)) - 1) * 100).toFixed(2);
        if (usdTry > 0 && marketData?.macro) marketData.macro.usdTry = +usdTry.toFixed(4);
        if (glMap['FX_IDC:EURTRY']?.close && marketData?.macro) marketData.macro.eurTry = +glMap['FX_IDC:EURTRY'].close.toFixed(4);
        if (glMap['BIST:XU100']?.close && marketData?.macro) marketData.macro.bist100 = +glMap['BIST:XU100'].close.toFixed(2);

        const mc = marketData?.kitchenIntelSummary?.openHorizon?.macroChains;
        if (mc) {
          if (mc.viopAndSpot) {
            if (glMap['BIST:XU030']?.close) mc.viopAndSpot.xu030Spot = +glMap['BIST:XU030'].close.toFixed(2);
            if (glMap['BIST:XU030D1!']?.close) mc.viopAndSpot.xu030Fut = +glMap['BIST:XU030D1!'].close.toFixed(2);
          }
          if (mc.inputOutputChains) {
            if (glMap['ICEEUR:BRN1!']?.close) mc.inputOutputChains.brentOilUsd = +glMap['ICEEUR:BRN1!'].close.toFixed(2);
            if (glMap['COMEX:HG1!']?.close) mc.inputOutputChains.copperUsd = +glMap['COMEX:HG1!'].close.toFixed(3);
          }
        }

        const ozGold = glMap['TVC:GOLD']?.close || 0;
        const ozSilver = glMap['TVC:SILVER']?.close || 0;
        const gramGoldCalc = (ozGold > 0 && usdTry > 0) ? +((ozGold * usdTry) / 31.1034768).toFixed(2) : 0;
        const gramSilverCalc = (ozSilver > 0 && usdTry > 0) ? +((ozSilver * usdTry) / 31.1034768).toFixed(2) : 0;
        const goldTlChg = combineChg(glMap['TVC:GOLD']?.chg, usdChg);
        const silverTlChg = combineChg(glMap['TVC:SILVER']?.chg, usdChg);

        for (const inst of (marketData?.instruments || [])) {
          if (inst.id === 'doviz-usd' && glMap['FX_IDC:USDTRY']) { inst.currentPrice = +glMap['FX_IDC:USDTRY'].close.toFixed(4); inst.change1D = +glMap['FX_IDC:USDTRY'].chg.toFixed(2); }
          else if (inst.id === 'doviz-eur' && glMap['FX_IDC:EURTRY']) { inst.currentPrice = +glMap['FX_IDC:EURTRY'].close.toFixed(4); inst.change1D = +glMap['FX_IDC:EURTRY'].chg.toFixed(2); }
          else if (inst.id === 'doviz-gbp' && glMap['FX_IDC:GBPTRY']) { inst.currentPrice = +glMap['FX_IDC:GBPTRY'].close.toFixed(4); inst.change1D = +glMap['FX_IDC:GBPTRY'].chg.toFixed(2); }
          else if (inst.id === 'doviz-chf' && glMap['FX_IDC:CHFTRY']) { inst.currentPrice = +glMap['FX_IDC:CHFTRY'].close.toFixed(4); inst.change1D = +glMap['FX_IDC:CHFTRY'].chg.toFixed(2); }
          else if (inst.id === 'gram-altin-spot' && gramGoldCalc > 0) { inst.currentPrice = gramGoldCalc; inst.change1D = goldTlChg; }
          else if (inst.id === 'ceyrek-altin' && gramGoldCalc > 0) { inst.currentPrice = +(gramGoldCalc * 1.651).toFixed(2); inst.change1D = goldTlChg; }
          else if (inst.id === 'cumhuriyet-altini' && gramGoldCalc > 0) { inst.currentPrice = +(gramGoldCalc * 6.755).toFixed(2); inst.change1D = goldTlChg; }
          else if (inst.id === 'bilezik-22-ayar' && gramGoldCalc > 0) { inst.currentPrice = +(gramGoldCalc * 0.946).toFixed(2); inst.change1D = goldTlChg; }
          else if (inst.id === 'gram-gumus-spot' && gramSilverCalc > 0) { inst.currentPrice = gramSilverCalc; inst.change1D = silverTlChg; }
          else if (inst.id === 'altin-sertifikasi' && glMap['BIST:ALTIN']) { inst.currentPrice = +glMap['BIST:ALTIN'].close.toFixed(2); inst.change1D = +glMap['BIST:ALTIN'].chg.toFixed(2); }
          else if (inst.id === 'bist-100' && glMap['BIST:XU100']) { inst.currentPrice = +glMap['BIST:XU100'].close.toFixed(2); inst.change1D = +glMap['BIST:XU100'].chg.toFixed(2); }
          else if (inst.id === 'kripto-btc' && glMap['BINANCE:BTCTRY']) { inst.currentPrice = Math.round(glMap['BINANCE:BTCTRY'].close); inst.change1D = +glMap['BINANCE:BTCTRY'].chg.toFixed(2); }
          else if (inst.id === 'kripto-eth' && glMap['BINANCE:ETHTRY']) { inst.currentPrice = Math.round(glMap['BINANCE:ETHTRY'].close); inst.change1D = +glMap['BINANCE:ETHTRY'].chg.toFixed(2); }
          else if (inst.id === 'kripto-sol' && glMap['BINANCE:SOLTRY']) { inst.currentPrice = +glMap['BINANCE:SOLTRY'].close.toFixed(2); inst.change1D = +glMap['BINANCE:SOLTRY'].chg.toFixed(2); }
          else if (glMap[inst.symbol]) {
            const isUsdAsset = FOREIGN_GVK80_IDS.has(inst.id) || /^(AMEX:|NASDAQ:|OTC:)/.test(inst.symbol);
            inst.currentPrice = +glMap[inst.symbol].close.toFixed(2);
            inst.change1D = +glMap[inst.symbol].chg.toFixed(2);
            if (isUsdAsset) inst.tlChange1D = combineChg(glMap[inst.symbol].chg, usdChg);
          }
        }
        updatedAny = true;
      }

      if (tvRes && tvRes.ok) {
        const tvJson = await tvRes.json();
        const lookup = marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup || {};
        for (const item of (tvJson.data || [])) {
          const d = item.d || [];
          const sym = d[0];
          const row = lookup[sym];
          if (row && d[1] > 0) {
            row.close = +Number(d[1]).toFixed(2);
            row.change1D = +Number(d[2] || 0).toFixed(2);
            row.perf1W = +Number(d[3] || row.perf1W || 0).toFixed(2);
            row.perf1M = +Number(d[4] || row.perf1M || 0).toFixed(2);
            row.dailyVolume = Math.round(d[5] || row.dailyVolume || 0);
            row.turnoverMillionTL = +(((d[5] || 0) * row.close) / 1e6).toFixed(2);
            row.relVol = +Number(d[6] || row.relVol || 1).toFixed(2);
            row.cmf20 = +Number(d[7] ?? row.cmf20 ?? 0).toFixed(3);
            if (d[8] != null) row.pe = +Number(d[8]).toFixed(1);
            if (d[9] != null) row.pb = +Number(d[9]).toFixed(2);
            if (row.entityKind !== 'bank' && row.entityKind !== 'insurance' && row.entityKind !== 'fin_other') {
              if (d[10] != null) row.totalDebtMillionTL = Math.round(d[10] / 1e6);
              if (d[11] != null) row.cashMillionTL = Math.round(d[11] / 1e6);
              if (d[12] != null) row.netDebtMillionTL = Math.round(d[12] / 1e6);
              if (d[13] != null) row.currentRatio = +Number(d[13]).toFixed(2);
              if (d[14] != null) row.opMarginPct = +Number(d[14]).toFixed(1);
              if (d[15] != null) row.capexMillionTL = Math.round(d[15] / 1e6);
              if (d[16] != null) row.ocfMillionTL = Math.round(d[16] / 1e6);
              if (d[17] != null) row.netIncomeMillionTL = Math.round(d[17] / 1e6);
              if (d[18] != null) row.totalAssetsMillionTL = Math.round(d[18] / 1e6);
              if (d[19] != null) row.ebitdaMillionTL = Math.round(d[19] / 1e6);
            }
          }
        }
        for (const inst of (marketData?.instruments || [])) {
          const sym = String(inst.symbol || '');
          if (sym.startsWith('BIST:')) {
            const t = sym.split(':')[1];
            if (lookup[t] && lookup[t].close > 0) {
              inst.currentPrice = lookup[t].close;
              inst.change1D = lookup[t].change1D;
            }
          }
        }
        updatedAny = true;
      }

      if (updatedAny) {
        lastLiveSyncMs = Date.now();
        rebuildAssetCatalog();
        notifyListeners();
        return true;
      }
    } catch (_) {}
    return false;
  }

  // --------------------------------------------------------------------------
  // 12. BAŞLATMA, HÜCRESEL ÖN PLAN UYANIŞI VE DIŞ SÖZLEŞME
  // --------------------------------------------------------------------------
  function wakeUpMeshAndLiveFeed() {
    if (!state) return;
    startCloudMesh();
    for (const c of meshClients.values()) {
      if (c.connected && c.ws && c.ws.readyState === WebSocket.OPEN) {
        try { c.ws.send(new Uint8Array([0xc0, 0x00])); } catch (_) {}
      }
    }
    if (processTimeHooksForMember(state.me)) {
      saveState(true, false);
    }
    if (state.me.profileRegistered) {
      publishMyInvestorToMesh();
    }
    refreshLiveMarketData();
    syncHttpFamilyHubAsync();
  }

  function init() {
    rebuildAssetCatalog();
    loadState();

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bcChannel = new BroadcastChannel('aether_v13_live_bus');
        bcChannel.onmessage = (ev) => {
          if (ev.data?.type === 'AETHER_V13_PEER' && ev.data.roomCode === state.roomCode) {
            let changed = false;
            if (ev.data.packet && mergeIncomingPeerPacket(ev.data.packet)) changed = true;
            if (Array.isArray(ev.data.banterFeed) && mergeIncomingBanter(ev.data.banterFeed)) changed = true;
            if (changed) notifyListeners();
          }
        };
      } catch (_) {}
    }

    processTimeHooksForMember(state.me);
    saveState(false, false);

    startCloudMesh();
    setTimeout(() => {
      refreshLiveMarketData();
      syncHttpFamilyHubAsync();
    }, 600);

    // Mobil hücresel / arka plan dönüşünde kopmuş WSS soketlerini ve fiyatları anında uyandır!
    if (global.addEventListener) {
      global.addEventListener('online', wakeUpMeshAndLiveFeed);
      global.addEventListener('pageshow', wakeUpMeshAndLiveFeed);
      global.addEventListener('aetherNativeForeground', wakeUpMeshAndLiveFeed);
    }
    if (global.document?.addEventListener) {
      global.document.addEventListener('visibilitychange', () => {
        if (global.document.visibilityState === 'visible') {
          wakeUpMeshAndLiveFeed();
        }
      });
    }

    setInterval(() => {
      if (processTimeHooksForMember(state.me)) {
        saveState(true, true);
      }
    }, 15000);

    // Yerel ağ / HTTP Hub yedek senkronizasyonu (Dış WSS engelli ağlarda bile canlı lig senkron kalır)
    setInterval(() => {
      if (global.document?.visibilityState !== 'hidden') {
        syncHttpFamilyHubAsync();
      }
    }, 8000);

    // Canlı çevrimiçi kalp atışı (25 sn) & Piyasa fiyat yenileme (25 sn)
    setInterval(() => {
      if (state.me.profileRegistered) {
        publishMyInvestorToMesh();
      }
      refreshLiveMarketData();
    }, 25000);
  }

  global.AetherKernelV10 = {
    init,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    getMarketData: () => marketData,
    getLastLiveSyncMs: () => lastLiveSyncMs,
    getPriceFlash: (key) => priceFlashMap.get(key) || null,
    getAllAssets: () => Array.from(new Set(assetCatalog.values())).filter((a) => !a.isSyntheticIpo),
    getAsset,
    getTurkishClock,
    getBistTickSize,
    snapToBistTick,
    inspectBoardMicrostructure,
    getDarphanePremiumInfo,
    getViopEveningSignal,
    getAnnualInflationPct,
    getAnnualMarginRatePct,
    getOvernightRepoNetAnnualPct,
    getUsdTry,
    getActiveIpoCatalog,
    getDividendSchedule,
    getState: () => state,
    getActiveMember,
    getAllLeagueMembers,
    getLeagueStatus,
    evaluateMemberPortfolio,
    evaluateRateTranche,
    evaluateInvestorMastery,
    executeOrder,
    participateInIpo,
    completeOnboarding,
    resetMemberOneMillion,
    DEFAULT_STARTING_CAPITAL_TL,
    updateHouseholdBaseline,
    postTeaBanter,
    refreshLiveMarketData,
    buildCompactInvestorPacket,
    mergeIncomingPeerPacket,
    markInspectedCashScale() {
      const m = getActiveMember();
      if (!m.livedMilestones.inspectedCashScale) {
        m.livedMilestones.inspectedCashScale = true;
        saveState(false, false);
      }
    },
    _setTestClockMs(ms) {
      clockOverride = ms;
      processTimeHooksForMember(state.me, ms);
      notifyListeners();
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
