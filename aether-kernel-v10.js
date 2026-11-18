// ============================================================================
// AETHER v10.0 — TEKİL MUHASEBE, TÜRKİYE PİYASA FİZİĞİ, VERGİ & SESSİZ AYNA ÇEKİRDEĞİ
// Sıfır Ütopya · Sıfır Çift Defter · 2025-2026 Resmi Gazete & BIST/TEFAS/Kapalıçarşı Kuralları
// ============================================================================
(function (global) {
  'use strict';

  const STORAGE_KEY = 'aether_v10_unified_state_r1';
  const CANONICAL_CLOUD_URL = 'https://4zyq4sk2tk-collab.github.io/AETHER-iOS/';
  const CLOUD_BUNDLE_URL = CANONICAL_CLOUD_URL + 'aether-data-bundle.js';

  // 2026-2027 Resmi Tatil ve Yarım Gün (Arife 12:40 Kapanış) Takvimi
  const TR_FULL_HOLIDAYS = new Set([
    '2026-01-01',
    '2026-03-20', '2026-03-21', '2026-03-22', // Ramazan Bayramı
    '2026-04-23', '2026-05-01', '2026-05-19',
    '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30', // Kurban Bayramı
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

  // %17,5 Stopaja Tabi BIST Borsa Yatırım Fonları (9 Temmuz 2025 RG 10041 & 2026 Uzatma)
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

  // Fiziki / Kuyumcu / Kapalıçarşı - Banka İki Kapılı Varlıklar
  const TWO_DOOR_FX_METAL_IDS = new Set([
    'doviz-usd', 'doviz-eur', 'doviz-gbp', 'doviz-chf',
    'gram-altin-spot', 'ceyrek-altin', 'cumhuriyet-altini', 'bilezik-22-ayar', 'gram-gumus-spot'
  ]);

  // Güncel Yİ-ÜFE Baz Endeksi (Kasım 2026 Yaklaşık Seri Çapası — GVK Mük. 80 Endeksleme İçin)
  const CURRENT_YIUFE_INDEX = 4120.0;

  let marketData = global.__AETHER_EMBEDDED_DATA__ || { instruments: [], macro: {}, kitchenIntelSummary: {} };
  let assetCatalog = new Map();
  let state = null;
  let listeners = new Set();
  let bcChannel = null;
  let clockOverride = null; // Yalnızca test doğrulaması için; kullanıcı arayüzünde ileri sarma yoktur.

  // --------------------------------------------------------------------------
  // 1. ZAMAN VE TÜRKİYE PİYASA SAATİ (EUROPE/ISTANBUL UTC+3)
  // --------------------------------------------------------------------------
  function getIstanbulParts(customMs) {
    const baseMs = customMs != null ? customMs : (clockOverride != null ? clockOverride : Date.now());
    const d = new Date(baseMs);
    // Türkiye kalıcı UTC+3 saat dilimindedir
    const trMs = d.getTime() + (3 * 3600 * 1000);
    const tr = new Date(trMs);
    const year = tr.getUTCFullYear();
    const month = tr.getUTCMonth() + 1;
    const day = tr.getUTCDate();
    const weekday = tr.getUTCDay(); // 0 Pazar .. 6 Cumartesi
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
    // Hedef İstanbul saatini UTC ms'ye çevir (UTC = TR - 3 saat)
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

    // 6 Evreli Borsa İstanbul Pay Piyasası Saati
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
          ? '09:50–09:55 Emir Toplama (İptal Kısıtlı Son 5 Dk)'
          : '09:40–09:55 Açılış Emir Toplama';
      } else if (m >= 9 * 60 + 55 && m < 10 * 60) {
        bistPhase = 'OPEN_MATCH';
        bistCancelLocked = true;
        bistLabel = '09:55–10:00 Tek Fiyat Açılış Eşleşmesi';
      } else if (m >= 10 * 60 && m < contEnd) {
        bistPhase = 'CONTINUOUS';
        bistCanMatchNow = true;
        bistLabel = isHalfDay ? '10:00–12:30 Yarım Gün Sürekli İşlem' : '10:00–18:00 Sürekli İşlem Seansı Açık';
      } else if (m >= contEnd && m < closeCollectEnd) {
        bistPhase = 'CLOSE_COLLECT';
        bistLabel = 'Kapanış Seansı Emir Toplama (±%3 Koridoru)';
      } else if (m >= closeCollectEnd && m < closeMatchEnd) {
        bistPhase = 'CLOSE_MATCH';
        bistCancelLocked = true;
        bistLabel = 'Kapanış Tek Fiyat Eşleşmesi';
      } else if (m >= closeMatchEnd && m < closeKfEnd) {
        bistPhase = 'CLOSE_MARJ';
        bistCanMatchNow = true;
        bistLabel = 'Kapanış Fiyatından İşlem (KF)';
      }
    }

    // VİOP Saati (09:30-18:15 Gündüz + 19:00-23:00 Akşam Seansı + 15:00 Teminat Çağrısı)
    let viopOpen = false;
    let viopLabel = 'VİOP Kapalı';
    if (isBizDay) {
      if (m >= 9 * 60 + 30 && m < 18 * 60 + 15) {
        viopOpen = true;
        viopLabel = (m >= 14 * 60 + 45 && m <= 15 * 60 + 15)
          ? 'VİOP Açık · 15:00 Teminat Tamamlama (Margin Call) Saati!'
          : 'VİOP Gündüz Seansı Açık';
      } else if (!isHalfDay && m >= 19 * 60 && m < 23 * 60) {
        viopOpen = true;
        viopLabel = '19:00–23:00 VİOP Akşam Seansı Açık';
      }
    }

    // TEFAS 13:30 Valör Saati
    const tefasBeforeCutoff = isBizDay && m >= 9 * 60 && m < 13 * 60 + 30;
    const tefasLabel = tefasBeforeCutoff
      ? 'TEFAS Valör Açık (13:30 Öncesi Bugün Sırası)'
      : 'TEFAS 13:30 Geçildi (+1 İş Günü Valör)';

    // Kapalıçarşı (Pzt-Cmt 09:30-18:30, Pazar ve Bayramda Kapalı) vs Mobil Banka Makası
    const grandBazaarOpen = !isHoliday && p.weekday !== 0 && m >= 9 * 60 + 30 && m < 18 * 60 + 30;
    const bankDaytimeTight = isBizDay && m >= 9 * 60 + 30 && m < 17 * 60 + 30;
    const bankSpreadPct = bankDaytimeTight ? 0.65 : 3.60; // Mesai dışı / hafta sonu gerçek banka makası %3,60
    const bazaarSpreadPct = 0.40; // Kapalıçarşı fiziki dar makas ~%0,40

    // Resmi Takvim Olay Pencereleri (TÜİK Ayın 3'ü 10:00, TCMB Perşembe 14:00, Çeyrek Sonu 15:30 Kur)
    const calendarAlerts = [];
    if (p.day === 3 && m >= 9 * 60 + 55 && m <= 12 * 60) {
      calendarAlerts.push('TÜİK Aylık Enflasyon Verisi (10:00): Tüm kilerlerin gerçek alım gücü güncellendi.');
    }
    if (isBizDay && p.weekday === 4 && m >= 13 * 60 + 50 && m <= 14 * 60 + 45) {
      calendarAlerts.push('Perşembe 14:00 TCMB Faiz / 14:30 Haftalık Rezerv & Kart Harcama Penceresi.');
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
      viopLabel,
      tefasBeforeCutoff,
      tefasLabel,
      grandBazaarOpen,
      bankDaytimeTight,
      bankSpreadPct,
      bazaarSpreadPct,
      calendarAlerts
    };
  }

  // --------------------------------------------------------------------------
  // 2. BIST PAY PİYASASI FİYAT ADIMI (TICK SIZE), TAVAN/TABAN VE DEVRE KESİCİ
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
        statusNote: null
      };
    }
    const chg = Number(asset.change1D) || 0;
    const tickSize = getBistTickSize(asset.priceTL);
    // ETF'lerde marj daha geniştir; pay piyasası şirketlerinde ±%10 tavan/taban ve aşağı yönlü -%5 devre kesici çalışır
    const isEquity = asset.subVenue === 'BIST_STOCK';
    const isTavanLocked = isEquity && chg >= 9.85;
    const isTabanLocked = isEquity && chg <= -9.85;
    // Devre kesici YALNIZCA aşağı yönlü sert düşüşte (-%5,0 ile -%9,84 arası) tetiklenir; yükselen hissede çalışmaz!
    const isCircuitBreaker = isEquity && chg <= -5.0 && chg > -9.85;
    const isBrutTakas = Boolean(asset.isBrutTakas);

    let statusNote = null;
    if (isTavanLocked) statusNote = `Tavan Kilitli (+%${chg.toFixed(2)}): Tahtada satıcı yok, alım emirleri tavan lot kuyruğunda bekler.`;
    else if (isTabanLocked) statusNote = `Taban Kilitli (%${chg.toFixed(2)}): Tahtada alıcı yok, satış emirleri taban kuyruğunda kilitli!`;
    else if (isCircuitBreaker) statusNote = `Pay Bazında Devre Kesici (%${chg.toFixed(2)}): Aşağı yönlü -%5 eşiği aşıldı; 10+2 dk tek fiyat eşleşmesinde.`;
    else if (isBrutTakas) statusNote = `VBTS Brüt Takas Tedbiri: Aynı gün al-sat yapılamaz ve T+2 bekleyen takas nakdi kullanılamaz.`;

    return { tickSize, isTavanLocked, isTabanLocked, isCircuitBreaker, isBrutTakas, statusNote };
  }

  // --------------------------------------------------------------------------
  // 3. 69 VARLIK + 619 BIST ŞİRKETİ BİRLEŞİK KATALOG MOTORU
  // --------------------------------------------------------------------------
  function getUsdTry() {
    const d = marketData?.macro?.usdTry || assetCatalog.get('doviz-usd')?.priceTL || 50.44;
    return Number(d) > 0 ? Number(d) : 50.44;
  }

  function getAnnualInflationPct() {
    const inf = marketData?.macro?.tuikInflationYoY
      || marketData?.kitchenIntelSummary?.openHorizon?.macroChains?.ratesAndInflation?.tuikCpiYoY
      || 44.38;
    return Number(inf) > 0 ? Number(inf) : 44.38;
  }

  function getDarphanePremiumInfo() {
    const s1 = assetCatalog.get('altin-sertifikasi');
    const spot = assetCatalog.get('gram-altin-spot');
    const s1Price = s1 ? s1.priceTL : 70.18;
    const spotPrice = spot ? spot.priceTL : 6125.57;
    const s1GramEquiv = +(s1Price * 100).toFixed(2);
    const diffTL = +(s1GramEquiv - spotPrice).toFixed(2);
    const premiumPct = spotPrice > 0 ? +(((s1GramEquiv / spotPrice) - 1) * 100).toFixed(2) : 14.34;
    return { s1SharePrice: s1Price, s1GramEquiv, spotGramPrice: spotPrice, diffTL, premiumPct };
  }

  function rebuildAssetCatalog() {
    assetCatalog.clear();
    const kis = marketData?.kitchenIntelSummary || {};
    const bistLookup = kis?.openHorizon?.bistStockLookup || {};
    const pumpSet = new Set(
      (kis?.microstructureAndWhale?.telegramPumpAnomalies || []).map((x) => String(x.ticker || '').toUpperCase())
    );
    const brutSet = new Set(
      (kis?.forensicBoardPatterns626?.vbtsCandidateAlerts || []).map((x) => String(x.ticker || '').toUpperCase())
    );

    const usdTry = Number(marketData?.macro?.usdTry)
      || Number((marketData?.instruments || []).find((i) => i.id === 'doviz-usd')?.currentPrice)
      || 50.44;

    // A) 69 Temel Yatırım Aracı
    for (const inst of (marketData?.instruments || [])) {
      const sym = String(inst.symbol || '');
      const rawTicker = sym.includes(':') ? sym.split(':')[1] : sym;
      const bistRow = sym.startsWith('BIST:') ? (bistLookup[rawTicker] || null) : null;
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

      // Resmi Stopaj & Kambiyo Vergisi Kuralları
      let stopajPct = Number(inst.taxRatePct) || 0;
      if (TAXABLE_175_BIST_ETFS.has(sym)) stopajPct = 17.5;
      if (EQUITY_EXEMPT_BIST_ETFS.has(sym)) stopajPct = 0;
      if (inst.id === 'dibs-tahvil' || inst.id === 'kira-sertifikasi-sukuk') stopajPct = 0;

      const descriptor = {
        key: inst.id,
        id: inst.id,
        ticker: rawTicker || inst.id.toUpperCase(),
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
        change1D: Number(inst.change1D) || 0,
        perf1W: Number(inst.perf1W) || 0,
        perf1M: Number(inst.perf1M) || 0,
        perf1Y: Number(inst.perf1Y ?? bistRow?.perf1Y) || 0,
        stopajPct,
        bsmvBuyPct: venue === 'TWO_DOOR' ? 0.20 : 0, // Banka kapısında binde 2 (%0,2) BSMV; Kapalıçarşı kapısında %0
        isGvk80: isForeignUsd,
        bistRow,
        trainedDaily: inst.trainedDaily || null,
        isPumpAnomaly: pumpSet.has(rawTicker),
        isBrutTakas: brutSet.has(rawTicker),
        verifyUrl: inst.verifyUrl || null
      };

      assetCatalog.set(inst.id, descriptor);
      if (sym) assetCatalog.set(sym.toUpperCase(), descriptor);
      if (rawTicker && sym.startsWith('BIST:')) assetCatalog.set('BIST:' + rawTicker.toUpperCase(), descriptor);
    }

    // B) 619 BIST Şirketinin Tamamını Birinci Sınıf İşlem ve Atölye Varlığı Olarak Ekle
    for (const [ticker, row] of Object.entries(bistLookup)) {
      const tUp = String(ticker || '').toUpperCase();
      if (!tUp) continue;
      const bistKey = 'BIST:' + tUp;
      const existing = assetCatalog.get(bistKey);
      if (existing) {
        existing.bistRow = row;
        existing.isPumpAnomaly = pumpSet.has(tUp);
        existing.isBrutTakas = brutSet.has(tUp);
        assetCatalog.set(tUp, existing);
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
        perf1Y: Number(row.perf1Y) || 0,
        stopajPct: 0, // BIST pay senedi alım-satım kazancı gerçek kişilerde %0 stopaj; temettüde %15 stopaj
        bsmvBuyPct: 0,
        isGvk80: false,
        bistRow: row,
        trainedDaily: null,
        isPumpAnomaly: pumpSet.has(tUp),
        isBrutTakas: brutSet.has(tUp),
        verifyUrl: `https://tr.tradingview.com/symbols/BIST-${tUp}/`
      };
      assetCatalog.set(desc.key, desc);
      assetCatalog.set(bistKey, desc);
      assetCatalog.set(tUp, desc);
    }
  }

  function getAsset(idOrSym) {
    if (!idOrSym) return null;
    const raw = String(idOrSym).trim();
    return assetCatalog.get(raw) || assetCatalog.get(raw.toUpperCase()) || assetCatalog.get('BIST:' + raw.toUpperCase()) || null;
  }

  // --------------------------------------------------------------------------
  // 4. TEKİL EYALET VE AİLE ÇAY MASASI DEFTERİ (SINGLE SOURCE OF TRUTH)
  // --------------------------------------------------------------------------
  function createMemberProfile(name, roleLabel, monthlyExpenseTL, startingCashTL) {
    const now = Date.now();
    const clean = String(name || 'Ben').trim().slice(0, 28);
    const slug = clean.toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g, '_').replace(/^_+|_+$/g, '') || 'uye';
    const id = 'fam_' + slug;
    return {
      id,
      name: clean,
      roleLabel: String(roleLabel || 'Ev Kaptanı').slice(0, 28),
      createdAt: now,
      updatedAt: now,
      baselineCapitalTL: Number(startingCashTL) || 100000,
      monthlyExpenseTL: Math.max(5000, Number(monthlyExpenseTL) || 35000),
      monthlySavingsTL: 12000,
      salaryDay: 15, // Ayın 1'i veya 15'i gerçek maaş günü
      lastSalaryCreditedYm: getIstanbulParts(now).ym,
      cashTL: Number(startingCashTL) || 100000,
      // T+2 Takas Kum Saatindeki Bekleyen BIST Satış Tahsilatları
      settlementQueue: [], // { id, ticker, grossTL, settlesAtMs, soldAtMs, note }
      // TEFAS Valör veya Borsa Açılış Eşleşmesi Bekleyen Emirler
      pendingOrders: [],   // { id, side, assetKey, name, reservedTL, qty, orderType, executesAtMs, createdAtMs, door, note }
      // Ayrı Vade Dilimleri (Yeni para asla eski mevduat gününü kopyalamaz!)
      rateTranches: [],    // { id, assetKey, name, principalTL, annualGrossPct, stopajPct, openedAtMs, maturityDays, maturesAtMs, isTermDeposit }
      // Spot / Pay / Fon / Maden Varlık Pozisyonları
      positions: {},       // { [assetKey]: { assetKey, qty, avgCostTL, avgCostUsd, buyYiUfe, openedAtMs, lastBuyDayYmd, doorUsed } }
      // Tek Seferlik SPK Halka Arz Dağıtım Kaydı
      ipoParticipations: {},
      // İşlem Geçmişi ve Aile Çay Sohbeti İçin Son Hamleler
      tradeHistory: [],    // { id, ts, side, assetKey, name, amountTL, priceTL, feeAndTaxTL, spreadLeakTL, note }
      // Görünmez Davranış İzleri (Sessiz Ayna)
      footprints: [],      // { id, ts, code, title, detail, leakTL }
      // Uçup Giden Fırsat Kavanozu (Korkup Boş Nakitte Beklemenin Maliyeti)
      idleErosionLog: {
        lastCheckedMs: now,
        cumulativeInflationLossTL: 0,
        missedSukukNetTL: 0
      },
      // Organik Dağılan Sis Deneyim İzleri (Hile Butonu Yoktur!)
      livedMilestones: {
        executedRealOrder: false,
        waitedSettlementOrValor: false,
        inspectedCashScale: false,
        completedArenaYear: false
      },
      arenaBestSummary: null
    };
  }

  function createInitialState() {
    const starter = createMemberProfile('Ben', 'Aile Kaptanı', 35000, 100000);
    return {
      version: '10.0.0',
      activeMemberId: starter.id,
      members: [starter],
      banterFeed: [
        {
          id: 'b_init',
          ts: Date.now(),
          authorName: 'Çay Masası',
          targetName: '',
          text: 'Akşam çayı demlendi. Herkesin kileri, kârı, zararı ve takas kum saati masada açık.'
        }
      ],
      blindMode: false
    };
  }

  function loadState() {
    try {
      const raw = global.localStorage ? global.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.members) && parsed.members.length > 0) {
          state = parsed;
          if (!state.members.some((m) => m.id === state.activeMemberId)) {
            state.activeMemberId = state.members[0].id;
          }
          return;
        }
      }
    } catch (_) {}
    state = createInitialState();
    saveState(false);
  }

  function saveState(emit = true) {
    if (!state) return;
    try {
      if (global.localStorage) {
        global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (_) {}
    if (bcChannel) {
      try { bcChannel.postMessage({ type: 'AETHER_V10_STATE', state }); } catch (_) {}
    }
    if (emit) notifyListeners();
  }

  function getActiveMember() {
    if (!state) loadState();
    return state.members.find((m) => m.id === state.activeMemberId) || state.members[0];
  }

  function notifyListeners() {
    for (const fn of listeners) {
      try { fn(state, marketData); } catch (e) { console.error('Listener error:', e); }
    }
  }

  // --------------------------------------------------------------------------
  // 5. OTOMATİK TAKAS (T+2), VALÖR (13:30), MAAŞ GÜNÜ VE ATIL NAKİT ERİMESİ MOTORU
  // --------------------------------------------------------------------------
  function recordFootprint(member, code, title, detail, leakTL = 0) {
    if (!member.footprints) member.footprints = [];
    // Aynı gün aynı kodlu izi spamlama
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

  function processTimeHooksForMember(member, customNowMs) {
    const clock = getTurkishClock(customNowMs);
    const nowMs = clock.ms;
    let changed = false;

    // 1) T+2 BIST Takas Kum Saati Çözülmesi
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
            if (qty > 0) mergeSpotPosition(member, asset, qty, execPrice, clock.ymd, ord.door || 'STANDARD');
          }
          member.livedMilestones.waitedSettlementOrValor = true;
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

    // 3) Gerçek Takvim Maaş Günü (Ayın 1'i veya 15'i geldiğinde ayda yalnızca 1 kez taze birikim girer)
    const sDay = Number(member.salaryDay) === 1 ? 1 : 15;
    if (member.monthlySavingsTL > 0 && clock.ym > (member.lastSalaryCreditedYm || '2000-01') && clock.day >= sDay) {
      const addTL = Number(member.monthlySavingsTL) || 0;
      member.cashTL = +(member.cashTL + addTL).toFixed(2);
      member.baselineCapitalTL = +(member.baselineCapitalTL + addTL).toFixed(2);
      member.lastSalaryCreditedYm = clock.ym;
      member.tradeHistory.unshift({
        id: 'tr_sal_' + clock.ym,
        ts: nowMs,
        side: 'SALARY',
        assetKey: 'CASH_TL',
        name: `Ayın ${sDay}'i Maaş Tasarrufu`,
        amountTL: addTL,
        priceTL: 1,
        feeAndTaxTL: 0,
        spreadLeakTL: 0,
        note: `${clock.ym} gerçek takvim maaş tasarrufu kilere eklendi.`
      });
      changed = true;
    }

    // 4) Korkup Boş Nakitte Bekleyen Paranın Sessiz Erimesi ("Uçup Giden Fırsat Kavanozu")
    if (!member.idleErosionLog) {
      member.idleErosionLog = { lastCheckedMs: nowMs, cumulativeInflationLossTL: 0, missedSukukNetTL: 0 };
    }
    const elapsedDays = (nowMs - (member.idleErosionLog.lastCheckedMs || nowMs)) / (24 * 3600 * 1000);
    if (elapsedDays >= 0.05) {
      if (member.cashTL >= 1000) {
        const annualInf = getAnnualInflationPct() / 100;
        const sukukGross = (getAsset('kira-sertifikasi-sukuk')?.annualGrossRatePct || 36.5) / 100;
        const infLoss = member.cashTL * (annualInf / 365) * elapsedDays;
        const missedSukuk = member.cashTL * (sukukGross / 365) * elapsedDays;
        member.idleErosionLog.cumulativeInflationLossTL = +(member.idleErosionLog.cumulativeInflationLossTL + infLoss).toFixed(2);
        member.idleErosionLog.missedSukukNetTL = +(member.idleErosionLog.missedSukukNetTL + missedSukuk).toFixed(2);
      }
      member.idleErosionLog.lastCheckedMs = nowMs;
      changed = true;
    }

    return changed;
  }

  function mergeSpotPosition(member, asset, addQty, buyUnitTL, ymd, doorUsed) {
    const prev = member.positions[asset.key];
    const usdTry = getUsdTry();
    const buyUsd = asset.isForeignUsd ? +(buyUnitTL / usdTry).toFixed(4) : null;
    if (!prev || prev.qty <= 0) {
      member.positions[asset.key] = {
        assetKey: asset.key,
        qty: addQty,
        avgCostTL: +buyUnitTL.toFixed(4),
        avgCostUsd: buyUsd,
        buyYiUfe: CURRENT_YIUFE_INDEX,
        openedAtMs: getTurkishClock().ms,
        lastBuyDayYmd: ymd,
        doorUsed: doorUsed || 'STANDARD'
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
    }
  }

  function computePositionTaxOnGain(asset, pos, sellUnitTL, sellQty, currentYiUfeOverride) {
    const grossProceedsTL = +(sellQty * sellUnitTL).toFixed(2);
    const costBasisTL = +(sellQty * (pos.avgCostTL || sellUnitTL)).toFixed(2);
    const nominalGainTL = +(grossProceedsTL - costBasisTL).toFixed(2);

    // 1) %17,5 Kaynakta Stopajlı BIST BYF'ler (ZGOLD, GLDTR, GMSTR, USDTR, ISGLK)
    if (asset.stopajPct > 0 && !asset.isRateInstrument) {
      const stopajTL = nominalGainTL > 0 ? +(nominalGainTL * (asset.stopajPct / 100)).toFixed(2) : 0;
      return { stopajTL, gvk80TaxReserveTL: 0, indexedRealGainTL: nominalGainTL, yiUfeIndexed: false };
    }

    // 2) GVK Mükerrer 80 Yurt Dışı Hisse/ETF (Yİ-ÜFE artışı >= %10 ise TL maliyet endekslenir!)
    if (asset.isGvk80) {
      const buyUfe = Number(pos.buyYiUfe) || CURRENT_YIUFE_INDEX;
      const curUfe = Number(currentYiUfeOverride) || CURRENT_YIUFE_INDEX;
      const ufeGrowth = buyUfe > 0 ? (curUfe / buyUfe) - 1 : 0;
      const yiUfeIndexed = ufeGrowth >= 0.10;
      const indexedCostTL = yiUfeIndexed ? +(costBasisTL * (curUfe / buyUfe)).toFixed(2) : costBasisTL;
      const realTaxableGainTL = Math.max(0, +(grossProceedsTL - indexedCostTL).toFixed(2));
      // Başlangıç gelir vergisi dilimi %15-%20 ihtiyat karşılığı
      const gvk80TaxReserveTL = +(realTaxableGainTL * 0.20).toFixed(2);
      return { stopajTL: 0, gvk80TaxReserveTL, indexedRealGainTL: realTaxableGainTL, yiUfeIndexed };
    }

    return { stopajTL: 0, gvk80TaxReserveTL: 0, indexedRealGainTL: nominalGainTL, yiUfeIndexed: false };
  }

  function settleSpotSale(member, asset, sellQty, rawExecPriceTL, nowMs, door, fromValorQueue) {
    const pos = member.positions[asset.key];
    if (!pos || pos.qty <= 0) return null;
    const clock = getTurkishClock(nowMs);

    // Kapalıçarşı vs Mobil Banka Satış Makası (Alış-satış yarı makası düşülür)
    let spreadHalfPct = 0;
    if (asset.venue === 'TWO_DOOR') {
      spreadHalfPct = (door === 'BAZAAR' ? clock.bazaarSpreadPct : clock.bankSpreadPct) / 2;
    }
    const effectiveBidTL = +(rawExecPriceTL * (1 - spreadHalfPct / 100)).toFixed(4);
    const grossTL = +(sellQty * effectiveBidTL).toFixed(2);
    const spreadLeakTL = +(sellQty * rawExecPriceTL - grossTL).toFixed(2);
    const feeTL = asset.venue === 'BIST' ? +(grossTL * 0.00084).toFixed(2) : 0;
    const taxInfo = computePositionTaxOnGain(asset, pos, effectiveBidTL, sellQty);
    const netAfterFeeAndStopajTL = Math.max(0, +(grossTL - feeTL - taxInfo.stopajTL).toFixed(2));

    pos.qty = +(pos.qty - sellQty).toFixed(6);
    if (pos.qty <= 0.000001) delete member.positions[asset.key];

    // BIST Pay ve BYF satışlarında gerçek T+2 Takas Kuralı (Çarşamba satılan Cuma sabahı nakde döner!)
    if (asset.venue === 'BIST') {
      const settlesAtMs = addTurkishBusinessDays(nowMs, 2, 10, 0);
      const settlesParts = getIstanbulParts(settlesAtMs);
      member.settlementQueue.push({
        id: 't2_' + Math.random().toString(36).slice(2, 9),
        ticker: asset.ticker,
        name: asset.name,
        grossTL: netAfterFeeAndStopajTL,
        soldAtMs: nowMs,
        settlesAtMs,
        note: `T+2 Takas: ${settlesParts.ymd} saat 10:00'da çekilebilir nakde dönüşür.`
      });
    } else {
      member.cashTL = +(member.cashTL + netAfterFeeAndStopajTL).toFixed(2);
    }

    // Sessiz Ayna: Düşüş gününde panik satışı izi
    if ((asset.change1D || 0) <= -3.5) {
      recordFootprint(
        member,
        'PANIC_RED_DAY_SALE',
        'Kırmızı Tahtada Panik Satışı',
        `${asset.name} günde %${Math.abs(asset.change1D).toFixed(1)} düşerken elden çıkarıldı. Fırtına ortasında gemiyi terk etmek kalıcı hasar bırakır.`,
        spreadLeakTL + feeTL
      );
    }

    member.tradeHistory.unshift({
      id: 'th_' + Math.random().toString(36).slice(2, 9),
      ts: nowMs,
      side: 'SELL',
      assetKey: asset.key,
      name: asset.name,
      amountTL: netAfterFeeAndStopajTL,
      priceTL: effectiveBidTL,
      feeAndTaxTL: +(feeTL + taxInfo.stopajTL).toFixed(2),
      spreadLeakTL,
      gvk80DeclarationNote: taxInfo.gvk80TaxReserveTL > 0
        ? `GVK Mük. 80 Beyan İhtiyatı: ~${taxInfo.gvk80TaxReserveTL.toLocaleString('tr-TR')} TL (${taxInfo.yiUfeIndexed ? 'Yİ-ÜFE endekslemeli' : 'endeksleme altı'})`
        : null,
      note: asset.venue === 'BIST'
        ? 'Satış gerçekleşti; para T+2 takas kum saatine girdi (2 iş günü nakit çekilemez).'
        : (fromValorQueue ? 'Valör süresi tamamlandı ve satış nakde döndü.' : 'Satış tamamlandı.')
    });
    if (member.tradeHistory.length > 60) member.tradeHistory.length = 60;
    member.updatedAt = nowMs;
    return { netAfterFeeAndStopajTL, feeTL, stopajTL: taxInfo.stopajTL, gvk80TaxReserveTL: taxInfo.gvk80TaxReserveTL };
  }

  // --------------------------------------------------------------------------
  // 6. CANLI EMİR GİŞESİ (EXECUTE ORDER — %100 GERÇEK TÜRKİYE KURALLARI)
  // --------------------------------------------------------------------------
  function executeOrder(params = {}) {
    const member = getActiveMember();
    processTimeHooksForMember(member);
    const clock = getTurkishClock();
    const nowMs = clock.ms;

    const side = String(params.side || 'BUY').toUpperCase();

    // --- VADELİ MEVDUAT / SUKUK / PPF DİLİM BOZMA (EARLY BREAK KURALI DAHİL!) ---
    if (side === 'BREAK_TRANCHE') {
      const trancheId = params.trancheId;
      const idx = (member.rateTranches || []).findIndex((t) => t.id === trancheId);
      if (idx < 0) return { ok: false, reason: 'Bozulacak vade dilimi bulunamadı.' };
      const tr = member.rateTranches[idx];
      const trVal = evaluateRateTranche(tr, nowMs);

      if (tr.assetKey === 'kira-sertifikasi-sukuk' && !clock.isBizDay) {
        return { ok: false, reason: 'Hafta sonu / resmi tatilde TEFAS fon bozum valörü kapalıdır; iş günü verilebilir.' };
      }

      member.rateTranches.splice(idx, 1);
      if (tr.isTermDeposit && nowMs < tr.maturesAtMs) {
        // Vadeden önce bozulan vadeli mevduatta tüm faiz yanar, yalnızca anapara döner!
        member.cashTL = +(member.cashTL + tr.principalTL).toFixed(2);
        recordFootprint(
          member,
          'EARLY_DEPOSIT_BREAK',
          'Vadeden Önce Bozulan Mevduat',
          `${tr.name} vadesi dolmadan bozuldu; birikmiş ${trVal.forfeitedIfBrokenEarlyTL.toLocaleString('tr-TR')} TL net faiz tamamen yandı!`,
          trVal.forfeitedIfBrokenEarlyTL
        );
        member.tradeHistory.unshift({
          id: 'th_' + Math.random().toString(36).slice(2, 9),
          ts: nowMs,
          side: 'EARLY_BREAK',
          assetKey: tr.assetKey,
          name: tr.name,
          amountTL: tr.principalTL,
          priceTL: 1,
          feeAndTaxTL: 0,
          spreadLeakTL: trVal.forfeitedIfBrokenEarlyTL,
          note: `Vadeden önce bozuldu: ${trVal.forfeitedIfBrokenEarlyTL.toLocaleString('tr-TR')} TL birikmiş faiz sıfırlandı, yalnızca anapara döndü.`
        });
        member.updatedAt = nowMs;
        saveState(true);
        return {
          ok: true,
          status: 'BROKEN_EARLY',
          message: `Vadeli hesap süresi dolmadan bozulduğu için ${trVal.forfeitedIfBrokenEarlyTL.toLocaleString('tr-TR')} TL faiz yandı; kasana yalnızca ${tr.principalTL.toLocaleString('tr-TR')} TL anapara döndü.`
        };
      }

      member.cashTL = +(member.cashTL + trVal.netRedeemableTL).toFixed(2);
      member.tradeHistory.unshift({
        id: 'th_' + Math.random().toString(36).slice(2, 9),
        ts: nowMs,
        side: 'REDEEM',
        assetKey: tr.assetKey,
        name: tr.name,
        amountTL: trVal.netRedeemableTL,
        priceTL: 1,
        feeAndTaxTL: trVal.stopajTL,
        spreadLeakTL: 0,
        note: `Net getiri (+${trVal.netInterestTL.toLocaleString('tr-TR')} TL, stopaj: ${trVal.stopajTL.toLocaleString('tr-TR')} TL) kasaya aktarıldı.`
      });
      member.updatedAt = nowMs;
      saveState(true);
      return {
        ok: true,
        status: 'REDEEMED',
        message: `${tr.name} dilimi kapatıldı; net ${trVal.netRedeemableTL.toLocaleString('tr-TR')} TL nakit kasana geçti.`
      };
    }

    const asset = getAsset(params.assetKey);
    if (!asset) {
      return { ok: false, reason: 'Varlık bulunamadı.' };
    }
    if (asset.venue === 'BENCHMARK_ONLY') {
      return {
        ok: false,
        reason: 'TCMB Konut Fiyat Endeksi resmi gösterge endeksidir, saniyelik alınıp satılamaz. Gayrimenkul ortaklığı için EKGYO / RYGYO / ISGYO / OPTGY dükkânlarını kullanabilirsin.'
      };
    }

    // --- ALIM İŞLEMİ (BUY) ---
    if (side === 'BUY') {
      const amountTL = +(Number(params.amountTL) || 0).toFixed(2);
      if (amountTL < 100) {
        return { ok: false, reason: 'En az 100 TL tutarında işlem girebilirsin.' };
      }

      const micro = inspectBoardMicrostructure(asset);
      const unsettledUsableForBist = (asset.venue === 'BIST' && !micro.isBrutTakas)
        ? (member.settlementQueue || []).reduce((s, x) => s + Number(x.grossTL || 0), 0)
        : 0;
      const maxPurchasingPower = +(member.cashTL + unsettledUsableForBist).toFixed(2);

      if (amountTL > maxPurchasingPower) {
        if (asset.venue !== 'BIST' && (member.settlementQueue || []).length > 0) {
          return {
            ok: false,
            reason: `Çekilebilir nakdin ${member.cashTL.toLocaleString('tr-TR')} TL. Borsa satışından gelen para T+2 takas kum saatinde beklediği için takas dolmadan döviz, altın veya mevduata dönemez!`
          };
        }
        return { ok: false, reason: `Yetersiz bakiye (Kullanılabilir güç: ${maxPurchasingPower.toLocaleString('tr-TR')} TL).` };
      }

      // Nakitten (gerekirse BIST mahsubu için T+2 takastan) düş
      const deductCash = (amt) => {
        if (member.cashTL >= amt) {
          member.cashTL = +(member.cashTL - amt).toFixed(2);
        } else {
          let rem = +(amt - member.cashTL).toFixed(2);
          member.cashTL = 0;
          for (const q of member.settlementQueue) {
            if (rem <= 0) break;
            const take = Math.min(q.grossTL, rem);
            q.grossTL = +(q.grossTL - take).toFixed(2);
            rem = +(rem - take).toFixed(2);
          }
          member.settlementQueue = member.settlementQueue.filter((q) => q.grossTL > 0.01);
        }
      };

      // A) BANKA VADELİ MEVDUAT / DİBS (Ayrı Dilim + Resmi Stopaj Vadesi)
      if (asset.venue === 'BANK_RATE') {
        if (!clock.isBizDay && asset.subVenue === 'GOV_BOND') {
          return { ok: false, reason: 'Hazine DİBS tahvil gişesi hafta sonu ve resmi tatilde kapalıdır.' };
        }
        const maturityDays = asset.subVenue === 'TERM_DEPOSIT'
          ? (Number(params.maturityDays) || 32)
          : 0;
        // 2025-2026 Resmi Gazete Vadeli TL Stopaj Kademesi: <=180 gün %17,5 | 181-365 gün %15,0 | >365 gün %10,0
        let stopajPct = asset.stopajPct;
        if (asset.subVenue === 'TERM_DEPOSIT') {
          if (maturityDays > 365) stopajPct = 10.0;
          else if (maturityDays > 180) stopajPct = 15.0;
          else stopajPct = 17.5;
        } else if (asset.id === 'dibs-tahvil') {
          stopajPct = 0;
        }
        deductCash(amountTL);
        member.rateTranches.push({
          id: 'tr_' + Math.random().toString(36).slice(2, 9),
          assetKey: asset.key,
          name: asset.subVenue === 'TERM_DEPOSIT' ? `${asset.name} (${maturityDays} Gün Vadeli)` : asset.name,
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
          side: 'BUY',
          assetKey: asset.key,
          name: asset.name,
          amountTL,
          priceTL: asset.annualGrossRatePct,
          feeAndTaxTL: 0,
          spreadLeakTL: 0,
          note: asset.subVenue === 'TERM_DEPOSIT'
            ? `${maturityDays} gün vadeli yeni dilim açıldı (%${stopajPct} stopaj; vadeden önce bozulursa faiz yanar).`
            : `Yeni sabit getiri dilimi açıldı (%${stopajPct} stopaj).`
        });
        member.updatedAt = nowMs;
        saveState(true);
        return {
          ok: true,
          status: 'FILLED',
          message: `${amountTL.toLocaleString('tr-TR')} TL ayrı bir vade dilimi olarak bağlandı (%${asset.annualGrossRatePct} brüt, %${stopajPct} stopaj).`
        };
      }

      // B) TEFAS FON GİŞESİ (13:30 KESİN VALÖR SAATİ!)
      if (asset.venue === 'TEFAS') {
        if (asset.subVenue === 'TEFAS_PPF' && clock.tefasBeforeCutoff) {
          // 09:00-13:30 iş gününde PPF T+0 aynı gün bağlanır
          deductCash(amountTL);
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
            side: 'BUY',
            assetKey: asset.key,
            name: asset.name,
            amountTL,
            priceTL: asset.annualGrossRatePct,
            feeAndTaxTL: 0,
            spreadLeakTL: 0,
            note: '13:30 valör saatinden önce girildiği için T+0 aynı gün fona bağlandı (%17,5 stopaj).'
          });
          member.updatedAt = nowMs;
          saveState(true);
          return { ok: true, status: 'FILLED', message: `Saat 13:30 öncesi olduğu için Para Piyasası Fonu T+0 valörle bugün devreye girdi.` };
        }

        // 13:30 sonrası, hafta sonu veya T+1 valörlü Sukuk fonu -> Gerçek Valör Kuyruğuna girer!
        const bizDaysWait = asset.subVenue === 'TEFAS_PPF'
          ? 1
          : (clock.tefasBeforeCutoff ? 1 : 2);
        const executesAtMs = addTurkishBusinessDays(nowMs, bizDaysWait, 10, 30);
        const execParts = getIstanbulParts(executesAtMs);
        deductCash(amountTL);
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
          note: `TEFAS Valör Beklemesi: ${execParts.ymd} saat 10:30 fiyatından eşleşecek.`
        });
        member.tradeHistory.unshift({
          id: 'th_' + Math.random().toString(36).slice(2, 9),
          ts: nowMs,
          side: 'VALÖR SIRA',
          assetKey: asset.key,
          name: asset.name,
          amountTL,
          priceTL: asset.priceTL,
          feeAndTaxTL: 0,
          spreadLeakTL: 0,
          note: `TEFAS valör kuyruğuna alındı (${execParts.ymd} 10:30).`
        });
        member.livedMilestones.executedRealOrder = true;
        member.updatedAt = nowMs;
        saveState(true);
        return {
          ok: true,
          status: 'QUEUED_VALOR',
          message: `TEFAS 13:30 valör kuralı işledi: Emrin ${execParts.ymd} günü saat 10:30 valör fiyatından portföye girecek.`
        };
      }

      // C) İKİ KAPILI DÖVİZ & KIYMETLİ MADEN GİŞESİ (KAPALIÇARŞI vs MOBİL BANKA + %0,2 BSMV)
      if (asset.venue === 'TWO_DOOR') {
        const door = params.door === 'BAZAAR' ? 'BAZAAR' : 'BANK';
        if (door === 'BAZAAR' && !clock.grandBazaarOpen) {
          return {
            ok: false,
            reason: `Kapalıçarşı ve fiziki sarraf dükkânları şu an kapalı (${clock.shortTimeStr}). Sabah 09:30'u bekleyebilir veya %${clock.bankSpreadPct.toFixed(2)} mesai dışı makas + %0,2 kambiyo vergisiyle Mobil Banka kapısını seçebilirsin.`
          };
        }
        const halfSpreadPct = (door === 'BAZAAR' ? clock.bazaarSpreadPct : clock.bankSpreadPct) / 2;
        const bsmvPct = door === 'BANK' ? 0.20 : 0; // 17 Mart 2025 RG: Bankadan döviz ve kaydi altın/gümüş alımında binde 2 BSMV!
        const askPriceTL = +(asset.priceTL * (1 + halfSpreadPct / 100)).toFixed(4);
        const bsmvTL = +(amountTL * (bsmvPct / 100)).toFixed(2);
        const netForMetalOrFx = Math.max(0, +(amountTL - bsmvTL).toFixed(2));
        const qty = +(netForMetalOrFx / askPriceTL).toFixed(6);
        const pureMidQty = amountTL / asset.priceTL;
        const spreadAndTaxLeakTL = +((pureMidQty - qty) * asset.priceTL).toFixed(2);

        deductCash(amountTL);
        mergeSpotPosition(member, asset, qty, askPriceTL, clock.ymd, door);
        member.livedMilestones.executedRealOrder = true;

        if (door === 'BANK' && !clock.bankDaytimeTight) {
          recordFootprint(
            member,
            'NIGHT_BANK_SPREAD_LEAK',
            'Mesai Dışı Banka Makası & Kambiyo Vergisi',
            `Akşam/hafta sonu banka ekranından ${asset.name} alınırken %${clock.bankSpreadPct.toFixed(2)} açık makas + %0,2 BSMV yüzünden ${spreadAndTaxLeakTL.toLocaleString('tr-TR')} TL gişede eridi.`,
            spreadAndTaxLeakTL
          );
        }

        member.tradeHistory.unshift({
          id: 'th_' + Math.random().toString(36).slice(2, 9),
          ts: nowMs,
          side: 'BUY',
          assetKey: asset.key,
          name: `${asset.name} (${door === 'BAZAAR' ? 'Kapalıçarşı Fiziki' : 'Mobil Banka'})`,
          amountTL,
          priceTL: askPriceTL,
          feeAndTaxTL: bsmvTL,
          spreadLeakTL: spreadAndTaxLeakTL,
          note: door === 'BAZAAR'
            ? `Kapalıçarşı dar makasla (%0 BSMV) fiziki kiler alımı.`
            : `Banka gişesi (%${(halfSpreadPct * 2).toFixed(2)} makas + ${bsmvTL.toLocaleString('tr-TR')} TL BSMV kambiyo vergisi).`
        });
        member.updatedAt = nowMs;
        checkConcentrationFootprint(member);
        saveState(true);
        return {
          ok: true,
          status: 'FILLED',
          message: `${door === 'BAZAAR' ? 'Kapalıçarşı' : 'Mobil Banka'} gişesinden ${qty.toFixed(3)} birim ${asset.name} alındı (Makas+Vergi sürtünmesi: ${spreadAndTaxLeakTL.toLocaleString('tr-TR')} TL).`
        };
      }

      // D) BORSA İSTANBUL PAY VE BYF GİŞESİ (SEANS SAATİ, FİYAT ADIMI, DEVRE KESİCİ, TAVAN KİLİDİ, ALTIN.S1 BALONU!)
      if (asset.venue === 'BIST') {
        if (micro.isCircuitBreaker) {
          return {
            ok: false,
            reason: `${asset.ticker} tahtasında aşağı yönlü -%5 devre kesici aktif! Tek fiyat eşleşme süresi bitene kadar anlık alım-satım yapılamaz.`
          };
        }
        if (micro.isTavanLocked) {
          return {
            ok: false,
            reason: `${asset.ticker} +%${asset.change1D.toFixed(2)} ile Tavan Kilitli! Tahtada satıcı olmadığı için piyasa emri anında gerçekleşmez.`
          };
        }

        if (!clock.bistCanMatchNow) {
          const nextOpenMs = getNextBistOpenMatchMs(nowMs);
          const nextParts = getIstanbulParts(nextOpenMs);
          deductCash(amountTL);
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
            note: `Borsa İstanbul şu an kapalı (${clock.bistLabel}); emir ${nextParts.ymd} saat 10:00 açılış eşleşmesine yazıldı.`
          });
          member.tradeHistory.unshift({
            id: 'th_' + Math.random().toString(36).slice(2, 9),
            ts: nowMs,
            side: 'AÇILIŞ EMİR',
            assetKey: asset.key,
            name: asset.name,
            amountTL,
            priceTL: asset.priceTL,
            feeAndTaxTL: 0,
            spreadLeakTL: 0,
            note: `${nextParts.ymd} 10:00 Borsa İstanbul açılış eşleşmesine yazıldı.`
          });
          member.livedMilestones.executedRealOrder = true;
          member.updatedAt = nowMs;
          saveState(true);
          return {
            ok: true,
            status: 'QUEUED_BIST_OPEN',
            message: `${clock.bistLabel}. Alım emrin tıpkı gerçek hayattaki gibi ${nextParts.ymd} sabah 10:00 Borsa İstanbul açılış ziline kuyruğa alındı.`
          };
        }

        const execPrice = asset.subVenue === 'BIST_STOCK' ? snapToBistTick(asset.priceTL) : asset.priceTL;
        const feeTL = +(amountTL * 0.00084).toFixed(2);
        const investable = Math.max(0, amountTL - feeTL);
        const qty = asset.subVenue === 'BIST_STOCK'
          ? Math.floor(investable / execPrice)
          : +(investable / execPrice).toFixed(4);
        if (qty <= 0) {
          return { ok: false, reason: `1 lot ${asset.ticker} fiyatı (${execPrice.toLocaleString('tr-TR')} TL) girilen tutardan yüksek.` };
        }
        const totalCostTL = +(qty * execPrice + feeTL).toFixed(2);
        deductCash(totalCostTL);
        mergeSpotPosition(member, asset, qty, execPrice, clock.ymd, 'BIST');
        member.livedMilestones.executedRealOrder = true;

        // Sessiz Ayna 1: Darphane ALTIN.S1 Hava Parası Uyarısı
        if (asset.subVenue === 'DARPHANE_S1') {
          const dInfo = getDarphanePremiumInfo();
          if (dInfo.premiumPct >= 4.0) {
            const airLeakTL = +(totalCostTL * (dInfo.premiumPct / (100 + dInfo.premiumPct))).toFixed(2);
            recordFootprint(
              member,
              'ALTIN_S1_AIR_PREMIUM',
              'Darphane Sertifikasında Fiziki Hava Parası',
              `ALTIN.S1 fiziki gram altından +%${dInfo.premiumPct} pahalıyken alındı; aynı parayla Kapalıçarşı'dan alınsaydı ${airLeakTL.toLocaleString('tr-TR')} TL hava parası ödenmeyecekti.`,
              airLeakTL
            );
          }
        }

        // Sessiz Ayna 2: Gürültülü Megafon / Sürü Zirvesi Kovalama
        if ((asset.change1D || 0) >= 6.0 || asset.isPumpAnomaly) {
          recordFootprint(
            member,
            'FOMO_HERD_BUY',
            'Sürü Coşkusunda Zirve Kovalama',
            `${asset.ticker} sert yükselişteyken (+%${(asset.change1D || 0).toFixed(1)}) veya sosyal medya hacim şişmesi varken atlandı.`,
            feeTL
          );
        }

        member.tradeHistory.unshift({
          id: 'th_' + Math.random().toString(36).slice(2, 9),
          ts: nowMs,
          side: 'BUY',
          assetKey: asset.key,
          name: asset.name,
          amountTL: totalCostTL,
          priceTL: execPrice,
          feeAndTaxTL: feeTL,
          spreadLeakTL: 0,
          note: `${qty} lot/pay eşleşti (Fiyat adımı: ${micro.tickSize} TL · Aracı kurum+BSMV: ${feeTL.toLocaleString('tr-TR')} TL).`
        });
        member.updatedAt = nowMs;
        checkConcentrationFootprint(member);
        saveState(true);
        return {
          ok: true,
          status: 'FILLED',
          message: `${qty} adet ${asset.ticker} ${execPrice.toLocaleString('tr-TR')} TL fiyattan portföye eklendi.`
        };
      }

      // E) VİOP, YURT DIŞI USD BORSALARI VE 7/24 KRİPTO
      if (asset.venue === 'VIOP' && !clock.viopOpen) {
        return { ok: false, reason: `${clock.viopLabel}. VİOP kontratları yalnızca gündüz (09:30–18:15) ve akşam (19:00–23:00) seanslarında işlem görür.` };
      }
      if (asset.venue === 'GLOBAL_USD' && clock.isWeekend) {
        return { ok: false, reason: 'ABD ve küresel borsalar cumartesi ve pazar günleri kapalıdır.' };
      }

      const feeRate = asset.venue === 'GLOBAL_USD' ? 0.0015 : 0.001;
      const feeTL = +(amountTL * feeRate).toFixed(2);
      const netTL = Math.max(0, amountTL - feeTL);
      const qty = +(netTL / asset.priceTL).toFixed(6);
      deductCash(amountTL);
      mergeSpotPosition(member, asset, qty, asset.priceTL, clock.ymd, asset.venue);
      member.livedMilestones.executedRealOrder = true;
      member.tradeHistory.unshift({
        id: 'th_' + Math.random().toString(36).slice(2, 9),
        ts: nowMs,
        side: 'BUY',
        assetKey: asset.key,
        name: asset.name,
        amountTL,
        priceTL: asset.priceTL,
        feeAndTaxTL: feeTL,
        spreadLeakTL: 0,
        note: asset.isGvk80
          ? 'Yurt dışı varlık alındı (Satışta Yİ-ÜFE endekslemesi sonrası GVK Mük. 80 gelir vergisi beyanına tabidir).'
          : 'İşlem tamamlandı.'
      });
      member.updatedAt = nowMs;
      checkConcentrationFootprint(member);
      saveState(true);
      return { ok: true, status: 'FILLED', message: `${asset.name} alımı tamamlandı.` };
    }

    // --- SATIŞ İŞLEMİ (SELL) ---
    if (side === 'SELL') {
      const pos = member.positions[asset.key];
      if (!pos || pos.qty <= 0) {
        return { ok: false, reason: 'Kilerinde bu varlıktan bulunmuyor.' };
      }
      const micro = inspectBoardMicrostructure(asset);
      const ratio = Math.min(1, Math.max(0.01, Number(params.sellRatio) || 1));
      const sellQty = asset.subVenue === 'BIST_STOCK'
        ? Math.max(1, Math.floor(pos.qty * ratio))
        : +(pos.qty * ratio).toFixed(6);

      if (asset.venue === 'BIST') {
        if (micro.isBrutTakas && pos.lastBuyDayYmd === clock.ymd) {
          return {
            ok: false,
            reason: `${asset.ticker} üzerinde VBTS Brüt Takas tedbiri var: Bugün alınan pay aynı gün satılamaz, yarını beklemek zorundasın!`
          };
        }
        if (micro.isTabanLocked) {
          return {
            ok: false,
            reason: `${asset.ticker} %${asset.change1D.toFixed(2)} ile Taban Kilitli! Tahtada tek bir alıcı yok; satış emrin taban kuyruğunda kilitli kalır.`
          };
        }
        if (micro.isCircuitBreaker) {
          return {
            ok: false,
            reason: `${asset.ticker} devre kesicide! Eşleşme bitene kadar satış yapılamaz.`
          };
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
            note: `Borsa kapalı; satış emri ${nextParts.ymd} 10:00 açılış eşleşmesine yazıldı.`
          });
          saveState(true);
          return {
            ok: true,
            status: 'QUEUED_BIST_OPEN',
            message: `Borsa kapalı olduğu için satış emrin ${nextParts.ymd} sabah 10:00 açılış eşleşmesine alındı.`
          };
        }
      }

      const door = params.door === 'BAZAAR' ? 'BAZAAR' : 'BANK';
      if (asset.venue === 'TWO_DOOR' && door === 'BAZAAR' && !clock.grandBazaarOpen) {
        return { ok: false, reason: 'Kapalıçarşı şu an kapalı; sabah 09:30 açılışını bekle veya Mobil Banka kapısını seç.' };
      }

      const res = settleSpotSale(member, asset, sellQty, asset.priceTL, nowMs, door, false);
      saveState(true);
      return {
        ok: true,
        status: asset.venue === 'BIST' ? 'SOLD_T2_SETTLEMENT' : 'SOLD_CASH',
        message: asset.venue === 'BIST'
          ? `${sellQty} adet ${asset.ticker} satıldı. Net ${res.netAfterFeeAndStopajTL.toLocaleString('tr-TR')} TL gerçek T+2 takas kum saatine girdi (2 iş günü nakit çekilemez).`
          : `Satış tamamlandı; net ${res.netAfterFeeAndStopajTL.toLocaleString('tr-TR')} TL kasana geçti.`
      };
    }

    return { ok: false, reason: 'Geçersiz işlem yönü.' };
  }

  // --------------------------------------------------------------------------
  // 7. PORTFÖY KİLERİ DEĞERLEME, GERÇEKLEŞMEMİŞ STOPAJ & FİNANSAL ÖZGÜRLÜK HESABI
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
    return {
      ...tr,
      elapsedDays: +elapsedDays.toFixed(2),
      remainingDays: tr.isTermDeposit ? Math.max(0, Math.ceil(((tr.maturesAtMs || 0) - nowMs) / (24 * 3600 * 1000))) : 0,
      isMatured,
      grossInterestTL,
      stopajTL,
      netInterestTL,
      accruedNetValueTL: +(tr.principalTL + netInterestTL).toFixed(2),
      netRedeemableTL: isMatured ? +(tr.principalTL + netInterestTL).toFixed(2) : tr.principalTL,
      forfeitedIfBrokenEarlyTL: isMatured ? 0 : netInterestTL
    };
  }

  function evaluateMemberPortfolio(member, customNowMs) {
    const m = member || getActiveMember();
    const nowMs = customNowMs != null ? customNowMs : getTurkishClock().ms;

    const cashTL = +(Number(m.cashTL) || 0).toFixed(2);
    const unsettledTL = +((m.settlementQueue || []).reduce((s, q) => s + Number(q.grossTL || 0), 0)).toFixed(2);
    const pendingOrderTL = +((m.pendingOrders || []).reduce((s, o) => s + Number(o.reservedTL || 0), 0)).toFixed(2);

    const tranches = (m.rateTranches || []).map((t) => evaluateRateTranche(t, nowMs));
    const tranchesNetTL = +(tranches.reduce((s, t) => s + t.accruedNetValueTL, 0)).toFixed(2);

    const spotItems = [];
    let spotGrossTL = 0;
    let spotNetAfterTaxTL = 0;

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

      spotGrossTL += grossValTL;
      spotNetAfterTaxTL += netValTL;
      spotItems.push({
        ...pos,
        name: asset ? asset.name : pos.assetKey,
        ticker: asset ? asset.ticker : pos.assetKey,
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

    const totalNetWorthTL = +(cashTL + unsettledTL + pendingOrderTL + tranchesNetTL + spotNetAfterTaxTL).toFixed(2);
    const baselineTL = Math.max(1, Number(m.baselineCapitalTL) || 100000);
    const nominalPnlTL = +(totalNetWorthTL - baselineTL).toFixed(2);
    const nominalPnlPct = +(((totalNetWorthTL / baselineTL) - 1) * 100).toFixed(2);

    // Enflasyondan Arındırılmış Gerçek Alım Gücü ve Özgürlük Ayları
    const elapsedYears = Math.max(0, (nowMs - (m.createdAt || nowMs)) / (365 * 24 * 3600 * 1000));
    const infFactor = Math.pow(1 + (getAnnualInflationPct() / 100), elapsedYears);
    const inflationAdjustedBaselineTL = +(baselineTL * infFactor).toFixed(2);
    const realPurchasingPnlTL = +(totalNetWorthTL - inflationAdjustedBaselineTL).toFixed(2);
    const realPurchasingPnlPct = inflationAdjustedBaselineTL > 0
      ? +(((totalNetWorthTL / inflationAdjustedBaselineTL) - 1) * 100).toFixed(2)
      : 0;

    const monthlyExpense = Math.max(5000, Number(m.monthlyExpenseTL) || 35000);
    const freedomMonths = +(totalNetWorthTL / monthlyExpense).toFixed(1);
    const largestSingleSharePct = totalNetWorthTL > 0 && spotItems.length > 0
      ? +((spotItems[0].netValTL / totalNetWorthTL) * 100).toFixed(1)
      : 0;

    // Dağılan Sis Sayısı (0..4 arası gerçek yaşanmışlık)
    const ms = m.livedMilestones || {};
    const clearedCloudsCount = [
      ms.executedRealOrder,
      ms.waitedSettlementOrValor,
      ms.inspectedCashScale,
      ms.completedArenaYear
    ].filter(Boolean).length;

    return {
      memberId: m.id,
      name: m.name,
      roleLabel: m.roleLabel,
      cashTL,
      unsettledTL,
      pendingOrderTL,
      tranches,
      tranchesNetTL,
      spotItems,
      spotGrossTL: +spotGrossTL.toFixed(2),
      spotNetAfterTaxTL: +spotNetAfterTaxTL.toFixed(2),
      totalNetWorthTL,
      baselineTL,
      nominalPnlTL,
      nominalPnlPct,
      realPurchasingPnlTL,
      realPurchasingPnlPct,
      monthlyExpense,
      freedomMonths,
      largestSingleSharePct,
      clearedCloudsCount
    };
  }

  function checkConcentrationFootprint(member) {
    const snap = evaluateMemberPortfolio(member);
    if (snap.largestSingleSharePct >= 68 && snap.spotItems.length > 0) {
      recordFootprint(
        member,
        'SINGLE_BASKET_RISK',
        'Tüm Yumurtalar Tek Sepette',
        `Toplam varlığının %${snap.largestSingleSharePct} kadarı tek başına ${snap.spotItems[0].name} içinde duruyor; tek bir sarsıntı tüm kileri sarsabilir.`,
        0
      );
    }
  }

  // --------------------------------------------------------------------------
  // 8. AİLE ÇAY MASASI: ÜYE YÖNETİMİ, SOHBET & ÇOK CİHAZLI PAKET SENKRONİZASYONU
  // --------------------------------------------------------------------------
  function addFamilyMember(name, roleLabel, monthlyExpenseTL, startingCashTL) {
    const cleanName = String(name || '').trim();
    if (!cleanName) return { ok: false, reason: 'Lütfen aile bireyinin adını yaz.' };
    const candidate = createMemberProfile(cleanName, roleLabel || 'Aile Üyesi', monthlyExpenseTL || 35000, startingCashTL || 100000);
    const existing = state.members.find((x) => x.id === candidate.id);
    if (existing) {
      state.activeMemberId = existing.id;
      saveState(true);
      return { ok: true, member: existing };
    }
    state.members.push(candidate);
    state.activeMemberId = candidate.id;
    saveState(true);
    pushFamilyHubAsync();
    return { ok: true, member: candidate };
  }

  function switchActiveMember(memberId) {
    if (state.members.some((m) => m.id === memberId)) {
      state.activeMemberId = memberId;
      saveState(true);
      return true;
    }
    return false;
  }

  function updateHouseholdBaseline(params = {}) {
    const m = getActiveMember();
    if (params.name) m.name = String(params.name).trim().slice(0, 28);
    if (params.roleLabel) m.roleLabel = String(params.roleLabel).trim().slice(0, 28);
    if (params.monthlyExpenseTL != null) m.monthlyExpenseTL = Math.max(5000, Number(params.monthlyExpenseTL) || 35000);
    if (params.monthlySavingsTL != null) m.monthlySavingsTL = Math.max(0, Number(params.monthlySavingsTL) || 0);
    if (params.salaryDay != null) m.salaryDay = Number(params.salaryDay) === 1 ? 1 : 15;
    if (params.resetCashBaselineTL != null && Number(params.resetCashBaselineTL) >= 1000) {
      // Hileli kâr üretmemek için başlangıç beyanı değiştirildiğinde mevcut sanal pozisyonlar sıfırlanıp temiz defter açılır
      const freshCash = +Number(params.resetCashBaselineTL).toFixed(2);
      m.baselineCapitalTL = freshCash;
      m.cashTL = freshCash;
      m.positions = {};
      m.rateTranches = [];
      m.settlementQueue = [];
      m.pendingOrders = [];
      m.createdAt = Date.now();
    }
    m.updatedAt = Date.now();
    saveState(true);
    pushFamilyHubAsync();
    return { ok: true };
  }

  function postTeaBanter(text, targetName = '') {
    const clean = String(text || '').trim().slice(0, 220);
    if (!clean) return false;
    const m = getActiveMember();
    state.banterFeed.unshift({
      id: 'b_' + Math.random().toString(36).slice(2, 9),
      ts: Date.now(),
      authorName: m.name,
      targetName: String(targetName || '').slice(0, 28),
      text: clean
    });
    if (state.banterFeed.length > 40) state.banterFeed.length = 40;
    saveState(true);
    pushFamilyHubAsync();
    return true;
  }

  function encodeUtf8Base64Url(obj) {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeUtf8Base64Url(b64url) {
    const clean = String(b64url || '').trim()
      .replace(/^AETHER-SALON:/i, '')
      .replace(/^.*#aile=/i, '')
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padded = clean + '==='.slice((clean.length + 3) % 4);
    const bin = atob(padded);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function exportFamilySharePacket() {
    const compactMembers = state.members.map((m) => ({
      id: m.id,
      name: m.name,
      roleLabel: m.roleLabel,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      baselineCapitalTL: m.baselineCapitalTL,
      monthlyExpenseTL: m.monthlyExpenseTL,
      monthlySavingsTL: m.monthlySavingsTL,
      salaryDay: m.salaryDay,
      lastSalaryCreditedYm: m.lastSalaryCreditedYm,
      cashTL: m.cashTL,
      settlementQueue: (m.settlementQueue || []).slice(0, 12),
      pendingOrders: (m.pendingOrders || []).slice(0, 12),
      rateTranches: (m.rateTranches || []).slice(0, 12),
      positions: m.positions || {},
      tradeHistory: (m.tradeHistory || []).slice(0, 8),
      footprints: (m.footprints || []).slice(0, 6),
      livedMilestones: m.livedMilestones || {},
      arenaBestSummary: m.arenaBestSummary || null
    }));
    const token = encodeUtf8Base64Url({
      v: 10,
      ts: Date.now(),
      members: compactMembers,
      banterFeed: (state.banterFeed || []).slice(0, 12)
    });
    // file:// iOS yerel uygulama içinde çalışsa bile DAİMA çalışan kanonik HTTPS bağlantısı üretir!
    return {
      shareUrl: `${CANONICAL_CLOUD_URL}#aile=${token}`,
      syncCode: `AETHER-SALON:${token}`
    };
  }

  function importFamilySharePacket(rawInput) {
    try {
      const incoming = decodeUtf8Base64Url(rawInput);
      if (!incoming || !Array.isArray(incoming.members)) {
        return { ok: false, reason: 'Geçersiz Aile Salonu kodu veya bağlantısı.' };
      }
      mergeIncomingMembers(incoming.members, incoming.banterFeed || []);
      saveState(true);
      pushFamilyHubAsync();
      return { ok: true, count: incoming.members.length };
    } catch (e) {
      return { ok: false, reason: 'Paket çözümlenemedi: Kodu eksiksiz kopyaladığından emin ol.' };
    }
  }

  function mergeIncomingMembers(incMembers, incBanter = []) {
    const byId = new Map(state.members.map((m) => [m.id, m]));
    for (const inc of incMembers) {
      if (!inc || !inc.id) continue;
      const cur = byId.get(inc.id);
      if (!cur || (Number(inc.updatedAt) || 0) >= (Number(cur.updatedAt) || 0)) {
        byId.set(inc.id, { ...cur, ...inc });
      }
    }
    state.members = Array.from(byId.values()).slice(0, 16);
    if (Array.isArray(incBanter) && incBanter.length > 0) {
      const seenB = new Set(state.banterFeed.map((b) => b.id));
      for (const b of incBanter) {
        if (b && b.id && !seenB.has(b.id)) {
          state.banterFeed.push(b);
          seenB.add(b.id);
        }
      }
      state.banterFeed.sort((a, b) => (b.ts || 0) - (a.ts || 0));
      state.banterFeed = state.banterFeed.slice(0, 40);
    }
  }

  async function pushFamilyHubAsync() {
    if (!global.fetch || global.location?.protocol === 'file:') return;
    try {
      const res = await fetch('./api/family-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: state.members, banterFeed: state.banterFeed })
      });
      if (res.ok) {
        const merged = await res.json();
        if (merged && Array.isArray(merged.members)) {
          mergeIncomingMembers(merged.members, merged.banterFeed || []);
          saveState(true);
        }
      }
    } catch (_) {}
  }

  async function pullFamilyHubAsync() {
    if (!global.fetch || global.location?.protocol === 'file:') return;
    try {
      const res = await fetch('./api/family-hub', { cache: 'no-store' });
      if (res.ok) {
        const merged = await res.json();
        if (merged && Array.isArray(merged.members) && merged.members.length > 0) {
          mergeIncomingMembers(merged.members, merged.banterFeed || []);
          saveState(true);
        }
      }
    } catch (_) {}
  }

  // --------------------------------------------------------------------------
  // 9. ARKA PLAN CANLI VERİ SENKRONİZASYONU (SERVER + BULUT + 49 SÜTUN MOBİL SCANNER)
  // --------------------------------------------------------------------------
  async function refreshLiveMarketData() {
    if (!global.fetch) return false;
    const isFileMode = global.location?.protocol === 'file:' || Boolean(global.__AETHER_NATIVE_IOS_APP__);

    // 1) Yerel Sunucu /api/market-data denemesi
    if (!isFileMode) {
      try {
        const r = await fetch('./api/market-data', { cache: 'no-store' });
        if (r.ok) {
          const fresh = await r.json();
          if (fresh && Array.isArray(fresh.instruments) && fresh.instruments.length > 0) {
            marketData = fresh;
            rebuildAssetCatalog();
            notifyListeners();
            return true;
          }
        }
      } catch (_) {}
    }

    // 2) GitHub Pages / Native iOS Canlı Bulut Paketi (aether-data-bundle.js) sıcak yüklemesi
    try {
      const bundleUrl = (isFileMode ? CLOUD_BUNDLE_URL : './aether-data-bundle.js') + '?t=' + Math.floor(Date.now() / 60000);
      const rb = await fetch(bundleUrl, { cache: 'no-store' });
      if (rb.ok) {
        const txt = await rb.text();
        const prefix = 'window.__AETHER_EMBEDDED_DATA__ = ';
        const idx = txt.indexOf(prefix);
        if (idx >= 0) {
          const parsed = JSON.parse(txt.slice(idx + prefix.length).trim().replace(/;$/, ''));
          if (parsed && Array.isArray(parsed.instruments)) {
            marketData = parsed;
            rebuildAssetCatalog();
          }
        }
      }
    } catch (_) {}

    // 3) Doğrudan 49 Sütunlu Canlı BIST + Küresel Fiyat Tazeleme (Sunucusuz modda tüm bilanço sütunlarını korur!)
    try {
      const tvRes = await fetch('https://scanner.tradingview.com/turkey/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        })
      });
      if (tvRes.ok) {
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
        // 69 varlık içindeki BIST sembollerini de eşzamanlı güncelle
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
        rebuildAssetCatalog();
        notifyListeners();
        return true;
      }
    } catch (_) {}
    return false;
  }

  // --------------------------------------------------------------------------
  // 10. BAŞLATMA VE DIŞ ARAYÜZ SÖZLEŞMESİ
  // --------------------------------------------------------------------------
  function init() {
    rebuildAssetCatalog();
    loadState();

    // URL #aile=... bağlantısından gelen aile paketini otomatik içeri al
    if (global.location?.hash && global.location.hash.startsWith('#aile=')) {
      importFamilySharePacket(global.location.hash);
      try {
        global.history.replaceState(null, '', global.location.pathname + global.location.search);
      } catch (_) {}
    }

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bcChannel = new BroadcastChannel('aether_v10_family_bus');
        bcChannel.onmessage = (ev) => {
          if (ev.data?.type === 'AETHER_V10_STATE' && ev.data.state) {
            state = ev.data.state;
            notifyListeners();
          }
        };
      } catch (_) {}
    }

    for (const m of state.members) processTimeHooksForMember(m);
    saveState(false);

    // Arka plan canlı yenileme döngüsü
    setTimeout(() => {
      refreshLiveMarketData();
      pullFamilyHubAsync();
    }, 1200);
    setInterval(() => {
      let anyHook = false;
      for (const m of state.members) {
        if (processTimeHooksForMember(m)) anyHook = true;
      }
      if (anyHook) saveState(true);
    }, 15000);
    setInterval(() => {
      refreshLiveMarketData();
      pullFamilyHubAsync();
    }, 45000);
  }

  global.AetherKernelV10 = {
    init,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    getMarketData: () => marketData,
    getAllAssets: () => Array.from(new Set(assetCatalog.values())),
    getAsset,
    getTurkishClock,
    getBistTickSize,
    snapToBistTick,
    inspectBoardMicrostructure,
    getDarphanePremiumInfo,
    getAnnualInflationPct,
    getUsdTry,
    getState: () => state,
    getActiveMember,
    evaluateMemberPortfolio,
    evaluateRateTranche,
    executeOrder,
    addFamilyMember,
    switchActiveMember,
    updateHouseholdBaseline,
    postTeaBanter,
    exportFamilySharePacket,
    importFamilySharePacket,
    refreshLiveMarketData,
    markInspectedCashScale() {
      const m = getActiveMember();
      if (!m.livedMilestones.inspectedCashScale) {
        m.livedMilestones.inspectedCashScale = true;
        saveState(true);
      }
    },
    recordArenaCompletion(summary) {
      const m = getActiveMember();
      m.livedMilestones.completedArenaYear = true;
      m.arenaBestSummary = summary;
      m.updatedAt = Date.now();
      saveState(true);
      pushFamilyHubAsync();
    },
    toggleBlindMode() {
      state.blindMode = !state.blindMode;
      saveState(true);
      return state.blindMode;
    },
    // Yalnızca otomatik Red-Team doğrulama testleri için kontrollü saat kancası
    _setTestClockMs(ms) {
      clockOverride = ms;
      for (const m of state.members) processTimeHooksForMember(m, ms);
      notifyListeners();
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
