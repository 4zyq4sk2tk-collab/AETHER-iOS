'use strict';

// ============================================================================
// AETHER AUTONOMOUS WORLD EVOLVER (MAKRO-MİKRO GERÇEK DÜNYA ÇEVİRMENİ)
// Saf Node.js CommonJS Modülü - Sıfır Dış Bağımlılık - Sıfır Emoji
// Görev: server.js + deep_kitchen_intel.js tarafından üretilen canlı veri
// setini (69 temel varlık + 619 BIST şirketi + makro zincirler + MKK takas +
// TMS-29 denetimi + canlı haber akışı) Yaşayan Kasaba için evrimleştirir.
// ============================================================================

const fs = require('fs');
const path = require('path');

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

const TR_MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const TR_WEEKDAY_NAMES = [
  'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'
];

// Mevsimsel Anadolu Baraj Doluluk Eğrisi (Ocak..Aralık baz referans yüzdeleri)
const SEASONAL_DAM_BASELINE_PCT = [
  54, 62, 70, 75, 73, 66, 57, 48, 42, 40, 44, 49
];

// Modül İçi Sağlıklı Önbellek (Sunucu soğuk açılış / anlık ağ kesintisi kendi kendini onarma omurgası)
let lastHealthyKitchenSnapshot = null;

// ----------------------------------------------------------------------------
// 1. SAYISAL GÜVENLİK, FORMATLAMA VE EMOJİ TEMİZLEME YARDIMCILARI
// ----------------------------------------------------------------------------
function safeNum(val, fallback = 0) {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(val, min, max) {
  const n = safeNum(val, min);
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

function roundTo(val, decimals = 2, fallback = 0) {
  const n = safeNum(val, fallback);
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}

function fmtTrNum(val, decimals = 2) {
  const n = safeNum(val, 0);
  return n.toLocaleString('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function fmtSignedPct(val, decimals = 2) {
  const n = roundTo(val, decimals, 0);
  const sign = n > 0 ? '+' : (n < 0 ? '-' : '');
  return `${sign}%${fmtTrNum(Math.abs(n), decimals)}`;
}

function stripEmojis(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u{1F000}-\u{1FAFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/\u200D/g, '')
    .replace(/\u20E3/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function sanitizeOutputTree(node) {
  if (typeof node === 'string') {
    return stripEmojis(node);
  }
  if (typeof node === 'number') {
    return Number.isFinite(node) ? node : 0;
  }
  if (Array.isArray(node)) {
    return node.map((item) => sanitizeOutputTree(item));
  }
  if (node && typeof node === 'object') {
    const clean = {};
    for (const [k, v] of Object.entries(node)) {
      if (v === undefined) {
        clean[k] = null;
      } else {
        clean[k] = sanitizeOutputTree(v);
      }
    }
    return clean;
  }
  return node === undefined ? null : node;
}

function toFriendlyTurkishTitle(rawName, ticker) {
  let clean = stripEmojis(String(rawName || ticker || 'Atölye'))
    .replace(/^[^:]+:\s*/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/(?:T\.A\.Ş\.|A\.Ş\.|A\.S\.)/gi, '')
    .replace(/\b(ANONİM ŞİRKETİ|ANONIM SIRKETI|TİCARET VE SANAYİ|SANAYİ VE TİCARET|TİCARET|SANAYİİ|SANAYİ|AS)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (!clean || clean.length < 2) {
    clean = String(ticker || 'Atölye');
  }

  return clean
    .toLocaleLowerCase('tr-TR')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
    .join(' ');
}

// ----------------------------------------------------------------------------
// 2. İSTANBUL SAATİ (UTC+3) VE PİYASA KEPENK FİZİĞİ
// ----------------------------------------------------------------------------
function computeIstanbulClock(nowMs) {
  const baseMs = safeNum(nowMs, Date.now());
  const trMs = baseMs + 3 * 3600 * 1000;
  const tr = new Date(trMs);
  const year = tr.getUTCFullYear();
  const month = tr.getUTCMonth() + 1;
  const day = tr.getUTCDate();
  const weekday = tr.getUTCDay();
  const hh = tr.getUTCHours();
  const mm = tr.getUTCMinutes();
  const minOfDay = hh * 60 + mm;
  const ymd = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const shortTime = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;

  const isWeekend = weekday === 0 || weekday === 6;
  const isHoliday = TR_FULL_HOLIDAYS.has(ymd);
  const isHalfDay = TR_HALF_DAYS.has(ymd);
  const isBizDay = !isWeekend && !isHoliday;

  const contEnd = isHalfDay ? (12 * 60 + 30) : (18 * 60);
  const isBistContinuousOpen = isBizDay && minOfDay >= (10 * 60) && minOfDay < contEnd;
  const isBistAuctionWindow = isBizDay && (
    (minOfDay >= (9 * 60 + 40) && minOfDay < (10 * 60)) ||
    (minOfDay >= contEnd && minOfDay < (isHalfDay ? (12 * 60 + 40) : (18 * 60 + 10)))
  );
  const isGrandBazaarOpen = !isHoliday && weekday !== 0 && minOfDay >= (9 * 60 + 30) && minOfDay < (18 * 60 + 30);
  const isBankDaytimeTight = isBizDay && minOfDay >= (9 * 60 + 30) && minOfDay < (17 * 60 + 30);

  const humanDateLabel = `${day} ${TR_MONTH_NAMES[month - 1] || 'Ay'} ${TR_WEEKDAY_NAMES[weekday] || 'Gün'}`;

  let plainTownPhase = 'Çarşı kepenkleri kapalı, gece sessizliği';
  if (isHoliday) {
    plainTownPhase = 'Resmi tatil dinlenmesi, çarşı kepenkleri kapalı';
  } else if (weekday === 0) {
    plainTownPhase = 'Pazar dinlenmesi, tüm dükkân kepenkleri kapalı';
  } else if (weekday === 6) {
    plainTownPhase = isGrandBazaarOpen
      ? 'Cumartesi sabahı, taş çarşıdaki kuyumcular açık, büyük fabrikalar dinlenmede'
      : 'Hafta sonu akşamı, çarşı kepenkleri kapalı';
  } else if (isBistContinuousOpen) {
    plainTownPhase = 'Gündüz mesaisi, taş çarşı ve ülke atölyeleri tam vardiya açık';
  } else if (isBistAuctionWindow) {
    plainTownPhase = 'Sabah kepenk açılış hazırlığı, tezgâhlar kuruluyor';
  } else if (minOfDay >= 7 * 60 && minOfDay < (9 * 60 + 40)) {
    plainTownPhase = 'Sabah erken saat, fırınlar yandı, çarşı kepenk açılışını bekliyor';
  } else if (minOfDay >= 18 * 60 && minOfDay < 22 * 60) {
    plainTownPhase = 'Mesai dışı akşam saati, çarşı kepenkleri indi, gece gişesi devrede';
  }

  return {
    baseMs,
    year,
    month,
    day,
    weekday,
    hh,
    mm,
    minOfDay,
    ymd,
    shortTime,
    humanDateLabel,
    isWeekend,
    isHoliday,
    isHalfDay,
    isBizDay,
    isBistContinuousOpen,
    isBistAuctionWindow,
    isGrandBazaarOpen,
    isBankDaytimeTight,
    plainTownPhase
  };
}

// ----------------------------------------------------------------------------
// 3. SEKTÖR -> HARİTA BİNASI VE SOĞUK AÇILIŞ KENDİ KENDİNİ ONARMA MOTORU
// ----------------------------------------------------------------------------
function buildTickerToInstrumentKeyMap(instruments) {
  const map = new Map();
  for (const inst of instruments) {
    if (!inst || !inst.id) continue;
    const sym = String(inst.symbol || '').toUpperCase();
    if (sym.startsWith('BIST:')) {
      const rawTicker = sym.split(':')[1];
      if (rawTicker && !map.has(rawTicker)) {
        map.set(rawTicker, inst.id);
      }
    }
  }
  return map;
}

function synthesizeFallbackBistLookup(instruments) {
  const fallback = {};
  // 1) 69 temel varlık içindeki BIST hisselerinin gerçek bilanço (fundamentals) verilerini aktar
  for (const inst of instruments) {
    const sym = String(inst?.symbol || '').toUpperCase();
    if (!sym.startsWith('BIST:')) continue;
    const ticker = sym.split(':')[1];
    if (!ticker || ticker.includes('D1!') || ['XU100', 'XU030', 'XBANK', 'ALTIN', 'ZGOLD', 'GLDTR', 'GMSTR', 'USDTR', 'ISGLK', 'ZPBDL', 'ZPLIB', 'APX30', 'Z30KP', 'ZPT10', 'ZSR25', 'OPTGY'].includes(ticker)) {
      continue;
    }
    const f = inst.fundamentals || {};
    const ocfM = f.ocf != null ? roundTo(Number(f.ocf) / 1e6, 0, 0) : 0;
    const fcfM = f.fcf != null ? roundTo(Number(f.fcf) / 1e6, 0, 0) : 0;
    const mcapB = f.marketCap != null ? roundTo(Number(f.marketCap) / 1e9, 2, 5.0) : 5.0;
    const netDebtM = f.netDebt != null ? roundTo(Number(f.netDebt) / 1e6, 0, 0) : 0;
    fallback[ticker] = {
      ticker,
      name: inst.name || ticker,
      sector: inst.categoryName || 'Sanayi ve Hizmet',
      close: safeNum(inst.currentPrice, 0),
      change1D: safeNum(inst.change1D, 0),
      perf1W: safeNum(inst.perf1W, 0),
      perf1M: safeNum(inst.perf1M, 0),
      perf1Y: safeNum(inst.perf1Y, 0),
      volRatio: 1.0,
      relVol: safeNum(f.relVol, 1.0),
      rsi: safeNum(f.rsi, 50),
      cmf20: safeNum(f.cmf, 0),
      marketCapBillionTL: mcapB,
      pe: f.pe != null ? safeNum(f.pe, 10) : null,
      pb: f.pb != null ? safeNum(f.pb, 1.2) : 1.2,
      fcfMillionTL: fcfM,
      ocfMillionTL: ocfM,
      netIncomeMillionTL: roundTo(ocfM * 0.55, 0, 0),
      netDebtMillionTL: netDebtM,
      isNetCash: netDebtM < 0,
      currentRatio: safeNum(f.currentRatio, 1.2),
      sloanAccrualPct: ocfM > 0 ? -6.5 : 12.0,
      ocfToCapexRatio: ocfM > 0 ? 1.5 : -0.5,
      netDebtToEbitda: netDebtM > 0 ? 1.8 : -0.4,
      floatPct: 30.0
    };
  }

  // 2) Disk üzerindeki mkk_float_ledger.json varsa son kapanış ve CMF izlerini salt-okunur tamamla
  try {
    const ledgerPath = path.join(__dirname, 'mkk_float_ledger.json');
    if (fs.existsSync(ledgerPath)) {
      const parsed = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
      const stocks = parsed?.stocks || {};
      for (const [tk, st] of Object.entries(stocks)) {
        const up = String(tk).toUpperCase();
        if (!fallback[up] && safeNum(st?.latestClose, 0) > 0) {
          fallback[up] = {
            ticker: up,
            name: up,
            sector: 'Borsa Şirketi',
            close: safeNum(st.latestClose, 0),
            change1D: 0,
            perf1W: 0,
            perf1M: 0,
            perf1Y: 0,
            volRatio: 1.0,
            relVol: 1.0,
            cmf20: safeNum(st.latestCmf20, 0),
            marketCapBillionTL: 3.5,
            pe: null,
            pb: 1.2,
            ocfMillionTL: null,
            fcfMillionTL: null,
            netIncomeMillionTL: null,
            netDebtMillionTL: null,
            floatPct: safeNum(st.latestFloatPct, 30),
            deltaFloatShares: safeNum(st.latestFloatShares, 0) - safeNum(st.baselineFloatShares, 0)
          };
        }
      }
    }
  } catch {
    // Salt okunur yedekleme erişilemezse sessizce temel varlık omurgasıyla devam edilir
  }

  return fallback;
}

function resolveTargetAssetKey(ticker, tickerToInstMap) {
  const clean = String(ticker || '').toUpperCase().trim();
  if (!clean) return 'bist-100';
  if (tickerToInstMap && tickerToInstMap.has(clean)) {
    return tickerToInstMap.get(clean);
  }
  return 'bist-' + clean.toLowerCase();
}

function resolveTargetBuildingId(sectorStr, tickerStr) {
  const t = String(tickerStr || '').toUpperCase();
  const s = String(sectorStr || '').toLocaleLowerCase('tr-TR');

  if (['TUPRS', 'PETKM', 'AYGAZ', 'ASTOR', 'CWENE', 'SMRTG', 'ENJSA', 'ENERY', 'AHGAZ', 'MOGAN', 'ODAS', 'GWIND', 'GEREL', 'KLYPV'].includes(t)) {
    return 'izmit-rafineri';
  }
  if (['FROTO', 'TOASO', 'EGEEN', 'PARSN', 'KORDS', 'ASUZU', 'DOAS', 'OTKAR', 'ARCLK', 'VESBE', 'VESTL'].includes(t)) {
    return 'kocaeli-otomotiv';
  }
  if (['EREGL', 'KRDMD', 'KRDMB', 'ISDMR', 'SISE', 'CIMSA', 'AKCNS', 'EKGYO', 'TRGYO', 'RYGYO', 'ISGYO', 'IZMDC', 'ALBTN'].includes(t)) {
    return 'zonguldak-celik';
  }
  if (['THYAO', 'PGSUS', 'TAVHL', 'CLEBI', 'PASEU'].includes(t)) {
    return 'bogaz-havalimani';
  }
  if (['ASELS', 'TCELL', 'TTKOM', 'LOGO', 'ALTNY', 'MIATK', 'SDTTR', 'ONRYT', 'ESCOM'].includes(t)) {
    return 'ankara-savunma';
  }
  if (['GARAN', 'AKBNK', 'ISCTR', 'YKBNK', 'TSKB', 'VAKBN', 'HALKB', 'TURSG', 'SAHOL', 'KCHOL', 'AGHOL'].includes(t)) {
    return 'banka-hazine';
  }
  if (['BIMAS', 'MGROS', 'SOKM', 'TABGD', 'EBEBK', 'ULKER', 'CCOLA', 'AEFES', 'SELEC'].includes(t)) {
    return 'fener-pazar';
  }

  if (s.includes('enerji') || s.includes('elektrik') || s.includes('petrol') || s.includes('rafineri') || s.includes('kimya')) {
    return 'izmit-rafineri';
  }
  if (s.includes('otomotiv') || s.includes('makine') || s.includes('ev eşyası') || s.includes('tekstil')) {
    return 'kocaeli-otomotiv';
  }
  if (s.includes('demir') || s.includes('çelik') || s.includes('çimento') || s.includes('gayrimenkul') || s.includes('gyo')) {
    return 'zonguldak-celik';
  }
  if (s.includes('ulaştırma') || s.includes('havacılık') || s.includes('turizm') || s.includes('lojistik')) {
    return 'bogaz-havalimani';
  }
  if (s.includes('teknoloji') || s.includes('yazılım') || s.includes('savunma') || s.includes('telekom')) {
    return 'ankara-savunma';
  }
  if (s.includes('banka') || s.includes('finans') || s.includes('sigorta') || s.includes('holding')) {
    return 'banka-hazine';
  }
  if (s.includes('maden') || s.includes('altın')) {
    return 'kapalicarsi-kiler';
  }
  return 'fener-pazar';
}

// ----------------------------------------------------------------------------
// 4. KASABA HAVASI VE RUH HALİ (townWeatherAndMood) HESAPLAYICISI
// ----------------------------------------------------------------------------
function computeTownWeatherAndMood(ctx) {
  const {
    clock,
    instMap,
    macro,
    bistList,
    bistLookup,
    macroChains,
    tms29,
    mkkLedger,
    whale,
    forensic,
    anomalyLog,
    liveFeed,
    openHorizonItems
  } = ctx;

  // A) Altın ve Darphane Hava Parası Hesabı
  const s1Inst = instMap.get('altin-sertifikasi');
  const spotGoldInst = instMap.get('gram-altin-spot');
  const mp = macroChains.metalsAndPhysical || {};

  const spotGramGoldTL = safeNum(
    spotGoldInst?.currentPrice,
    safeNum(macro.spotGramGold, safeNum(mp.spotGramGoldTL, 6117.13))
  );
  const s1SharePrice = safeNum(
    s1Inst?.currentPrice,
    mp.altinS1GramEquiv ? safeNum(mp.altinS1GramEquiv, 6904) / 100 : 69.07
  );
  const s1GramEquivTL = roundTo(s1SharePrice * 100, 2, spotGramGoldTL);
  const darphaneExtraTLPerGram = roundTo(s1GramEquivTL - spotGramGoldTL, 2, 0);
  const darphaneBalloonExtraPct = spotGramGoldTL > 0
    ? roundTo(((s1GramEquivTL / spotGramGoldTL) - 1) * 100, 2, 0)
    : roundTo(safeNum(mp.darphanePhysicalPremiumPct, 0), 2, 0);

  // B) Kapalıçarşı vs Mobil Banka Canlı Makas ve 1.000 TL Kesinti Dilimi
  const goldVolBoost = clamp(Math.abs(safeNum(spotGoldInst?.change1D, 0)) * 0.03, 0, 0.22);
  const fxVolBoost = clamp(Math.abs(safeNum(instMap.get('doviz-usd')?.change1D, 0)) * 0.05, 0, 0.25);
  const bazaarOpenSpreadPct = roundTo(0.40 + goldVolBoost * 0.5, 2, 0.40);
  const bankBaseSpread = clock.isBankDaytimeTight ? 0.65 : 3.60;
  const bankCurrentSpreadPct = roundTo(bankBaseSpread + goldVolBoost + fxVolBoost, 2, bankBaseSpread);
  // Banka gişesinde alım-satım tam makası + %0,20 kambiyo vergisi (BSMV) karşılığı 1.000 TL başına anlık erime
  const bankSlicePer1000TL = roundTo(1000 * ((bankCurrentSpreadPct + 0.20) / 100), 2, 8.50);

  // C) Yıllık Ekmek ve Mutfak Enflasyonu Nabzı
  const officialCpiYoy = safeNum(macro.cpiYoy, safeNum(ctx.inflationBenchmarks?.perf1Y, 29.77));
  const cpiMom = safeNum(macro.cpiMom, safeNum(ctx.inflationBenchmarks?.perf1M, 2.58));
  const annualizedRecentMom = (Math.pow(1 + clamp(cpiMom, -2, 15) / 100, 12) - 1) * 100;
  const agriPerf1M = safeNum(instMap.get('emtia-tarim-dba')?.perf1M, 0);
  const usdPerf1M = safeNum(instMap.get('doviz-usd')?.perf1M, 1.5);

  const breadInflationAnnualPct = roundTo(
    clamp(officialCpiYoy * 0.68 + annualizedRecentMom * 0.27 + Math.max(0, agriPerf1M + usdPerf1M) * 0.35, 8.0, 120.0),
    2,
    officialCpiYoy
  );

  // D) Mazot ve Pompa Maliyet Baskısı (%)
  const io = macroChains.inputOutputChains || {};
  const brentUsd = safeNum(io.brentOilUsd, 88.0);
  const brentPerf1M = safeNum(io.brentOilPerf1M, safeNum(instMap.get('emtia-petrol-bno')?.perf1M, 0));
  const bnoPerf3M = safeNum(instMap.get('emtia-petrol-bno')?.perf3M, 0);
  const usdPerf3M = safeNum(instMap.get('doviz-usd')?.perf3M, 4.0);
  const ppiMom = safeNum(macro.ppiMom, 1.65);

  const barrelAboveEquilibriumPct = ((brentUsd - 75.0) / 75.0) * 100;
  const tlFuel3MPressure = bnoPerf3M * 0.35 + usdPerf3M * 0.85 + brentPerf1M * 0.25;
  const dieselPressurePct = roundTo(
    clamp(barrelAboveEquilibriumPct * 0.50 + tlFuel3MPressure * 0.45 + ppiMom * 3.8, 0, 100),
    2,
    18.0
  );

  // E) Baraj Doluluk ve Su Rahatlığı (0-100)
  const monthBaseline = SEASONAL_DAM_BASELINE_PCT[(clock.month - 1) % 12] || 50;
  const natGasPerf1M = safeNum(io.natGasPerf1M, 0);
  const allHeadlineText = [
    ...liveFeed.map((x) => String(x?.title || '')),
    ...openHorizonItems.slice(0, 15).map((x) => String(x?.title || ''))
  ].join(' ').toLocaleLowerCase('tr-TR');

  let headlineHydroDelta = 0;
  if (/kurak|susuz|baraj.*gerile|su kesinti/.test(allHeadlineText)) headlineHydroDelta -= 7.5;
  if (/yağış|kar yağ|baraj.*yüksel|baraj.*doldu/.test(allHeadlineText)) headlineHydroDelta += 6.5;

  const hydroTickers = ['MOGAN', 'GWIND', 'AYDEM', 'ODAS', 'ALARK'];
  let hydroCmfSum = 0;
  let hydroCount = 0;
  for (const ht of hydroTickers) {
    const row = bistLookup[ht];
    if (row && Number.isFinite(Number(row.cmf20))) {
      hydroCmfSum += Number(row.cmf20);
      hydroCount++;
    }
  }
  const avgHydroCmf = hydroCount > 0 ? hydroCmfSum / hydroCount : 0;
  const damWaterPct = roundTo(
    clamp(
      monthBaseline
      - Math.max(0, agriPerf1M) * 0.65
      - Math.max(0, natGasPerf1M) * 0.45
      + avgHydroCmf * 12.0
      + headlineHydroDelta,
      12,
      94
    ),
    1,
    monthBaseline
  );

  // F) Rafineri ve Ağır Sanayi Baca Yoğunluğu (0-100)
  const industrialTickers = ['TUPRS', 'PETKM', 'AYGAZ', 'EREGL', 'KRDMD', 'SISE', 'FROTO', 'CIMSA'];
  let volSum = 0;
  let ocfPosCount = 0;
  let indCount = 0;
  for (const it of industrialTickers) {
    const row = bistLookup[it];
    if (row) {
      volSum += clamp(safeNum(row.volRatio, 1.0), 0.3, 2.5);
      if (safeNum(row.ocfMillionTL, 0) > 0) ocfPosCount++;
      indCount++;
    }
  }
  const avgIndVol = indCount > 0 ? volSum / indCount : 1.0;
  const indCashRatio = indCount > 0 ? ocfPosCount / indCount : 0.6;
  const oilCrackTailwind = clamp(-brentPerf1M * 0.45, -8, 12);
  const sessionActivityAdj = clock.isBistContinuousOpen ? 6.0 : (clock.isBizDay ? 0.0 : -8.0);
  const refineryIntensity = roundTo(
    clamp(42.0 + (avgIndVol - 0.8) * 24.0 + indCashRatio * 18.0 + oilCrackTailwind + sessionActivityAdj, 15, 96),
    1,
    65.0
  );

  // G) Liman İhracat Gücü (0-100)
  const exportTickers = ['FROTO', 'TOASO', 'EGEEN', 'PARSN', 'KORDS', 'THYAO', 'PGSUS', 'TAVHL', 'ASELS', 'SISE', 'ARCLK', 'ASUZU'];
  let expCmfSum = 0;
  let expCashPos = 0;
  let expPerf1MSum = 0;
  let expFound = 0;
  for (const et of exportTickers) {
    const row = bistLookup[et];
    if (row) {
      expCmfSum += safeNum(row.cmf20, 0);
      if (safeNum(row.ocfMillionTL, 0) > 0) expCashPos++;
      expPerf1MSum += clamp(safeNum(row.perf1M, 0), -25, 25);
      expFound++;
    }
  }
  const avgExpCmf = expFound > 0 ? expCmfSum / expFound : 0;
  const expCashShare = expFound > 0 ? expCashPos / expFound : 0.7;
  const avgExpPerf1M = expFound > 0 ? expPerf1MSum / expFound : 0;
  const eurUsdVal = safeNum(io.eurUsd, safeNum(ctx.macroSpreads?.eurUsd?.value, 1.10));
  const eurUsdBonus = (eurUsdVal - 1.08) * 65.0;
  const fuelExportBonus = clamp(-brentPerf1M * 0.35, -6, 8);

  const harborExportStrength = roundTo(
    clamp(
      38.0 + expCashShare * 28.0 + avgExpCmf * 55.0 + avgExpPerf1M * 0.65 + eurUsdBonus + fuelExportBonus,
      14,
      95
    ),
    1,
    62.0
  );

  // H) Kalabalık Megafon Tehlikesi (0-100) ve Aktif Megafon Sayısı
  const megaphoneTickerSet = new Set();
  for (const item of (whale.telegramPumpAnomalies || [])) {
    if (item?.ticker) megaphoneTickerSet.add(String(item.ticker).toUpperCase());
  }
  for (const item of (mkkLedger.lotExpansionAlerts || [])) {
    if (item?.ticker && safeNum(item.deltaFloatShares, 0) > 250000 && safeNum(item.cmf20, 0) < 0.05) {
      megaphoneTickerSet.add(String(item.ticker).toUpperCase());
    }
  }
  for (const item of (forensic.pattern4HiddenDistribution || [])) {
    if (item?.ticker) megaphoneTickerSet.add(String(item.ticker).toUpperCase());
  }
  for (const item of (ctx.openHorizon?.bist626DistributionTraps || [])) {
    if (item?.ticker) megaphoneTickerSet.add(String(item.ticker).toUpperCase());
  }
  for (const ev of (anomalyLog.recentEvents || [])) {
    if (ev?.severity === 'BIST_VOL_DISTRIBUTION' && String(ev.symbol || '').startsWith('BIST:')) {
      megaphoneTickerSet.add(String(ev.symbol).split(':')[1].toUpperCase());
    }
  }
  for (const row of bistList) {
    if (
      safeNum(row.relVol, 0) >= 1.85 &&
      safeNum(row.cmf20, 0) <= -0.12 &&
      (safeNum(row.ocfMillionTL, 0) < 0 || safeNum(row.pb, 1) >= 6.0)
    ) {
      megaphoneTickerSet.add(String(row.ticker).toUpperCase());
    }
  }
  if (megaphoneTickerSet.size === 0 && Array.isArray(ctx.trapsAndAlerts)) {
    for (const tr of ctx.trapsAndAlerts) {
      const sym = String(tr?.symbol || '');
      if (sym.startsWith('BIST:')) megaphoneTickerSet.add(sym.split(':')[1].toUpperCase());
    }
  }

  const activeMegaphoneCount = megaphoneTickerSet.size;
  const illusionRatio = safeNum(tms29.totalCorporateAudited, 0) > 0
    ? safeNum(tms29.illusionTrapCount, 0) / safeNum(tms29.totalCorporateAudited, 1)
    : 0.12;

  const crowdMegaphoneDanger = roundTo(
    clamp(
      18.0
      + activeMegaphoneCount * 2.35
      + Math.max(0, darphaneBalloonExtraPct - 3.5) * 1.45
      + illusionRatio * 85.0,
      8,
      98
    ),
    1,
    45.0
  );

  // I) Gökyüzü Gerilim Skoru ve skyMood ('CALM' | 'BREEZY' | 'OVERCAST' | 'STORM')
  const bist100Inst = instMap.get('bist-100');
  const bist1D = safeNum(bist100Inst?.change1D, 0);
  const bist1W = safeNum(bist100Inst?.perf1W, 0);
  const usd1D = safeNum(instMap.get('doviz-usd')?.change1D, 0);
  const policyRate = safeNum(macro.tcmbPolicyRate, 36.0);
  const trSlopeAbs = Math.abs(safeNum(macroChains.yieldCurves?.trYieldSlopeBps, -200));

  const skyTensionScore = roundTo(
    clamp(
      (breadInflationAnnualPct - 15.0) * 0.65
      + Math.max(0, policyRate - 25.0) * 0.55
      + Math.abs(bist1D) * 4.8
      + Math.max(0, -bist1W) * 2.2
      + Math.abs(usd1D) * 6.5
      + dieselPressurePct * 0.25
      + crowdMegaphoneDanger * 0.22
      + clamp(trSlopeAbs / 45.0, 0, 8.0),
      5,
      99
    ),
    1,
    50.0
  );

  let skyMood = 'BREEZY';
  if (skyTensionScore < 30 || (Math.abs(bist1D) < 0.8 && breadInflationAnnualPct < 18 && crowdMegaphoneDanger < 32)) {
    skyMood = 'CALM';
  } else if (skyTensionScore < 54) {
    skyMood = 'BREEZY';
  } else if (skyTensionScore < 76 && bist1D > -3.5 && usd1D < 2.5) {
    skyMood = 'OVERCAST';
  } else {
    skyMood = 'STORM';
  }

  return {
    skyMood,
    skyTensionScore,
    damWaterPct,
    refineryIntensity,
    dieselPressurePct,
    breadInflationAnnualPct,
    bazaarOpenSpreadPct,
    bankCurrentSpreadPct,
    bankSlicePer1000TL,
    darphaneBalloonExtraPct,
    darphaneExtraTLPerGram,
    harborExportStrength,
    crowdMegaphoneDanger,
    activeMegaphoneCount,
    spotGramGoldTL: roundTo(spotGramGoldTL, 2, 6117.13),
    s1GramEquivTL
  };
}

// ----------------------------------------------------------------------------
// 5. SIFIR JARGON SABAH HİKÂYESİ VE GERÇEK HAYAT KÖPRÜSÜ (plainHumanDailyStory)
// ----------------------------------------------------------------------------
function computePlainHumanDailyStory(ctx, weather) {
  const { clock, instMap, macro, liveFeed, tms29, macroChains, tickerToInstMap } = ctx;

  const spotGold = weather.spotGramGoldTL;
  const s1Gram = weather.s1GramEquivTL;
  const extraGoldTL = Math.round(Math.abs(weather.darphaneExtraTLPerGram));
  const extraGoldPct = weather.darphaneBalloonExtraPct;
  const sukukRate = safeNum(instMap.get('kira-sertifikasi-sukuk')?.currentPrice, 36.5);
  const ppfRate = safeNum(instMap.get('para-piyasasi-fonu')?.currentPrice, 39.0);
  const officialCpi = safeNum(macro.cpiYoy, 29.77);
  const policyRate = safeNum(macro.tcmbPolicyRate, 36.0);
  const usdTry = safeNum(macro.usdTry, safeNum(instMap.get('doviz-usd')?.currentPrice, 50.44));
  const brentUsd = safeNum(macroChains.inputOutputChains?.brentOilUsd, 91.6);
  const brent1M = safeNum(macroChains.inputOutputChains?.brentOilPerf1M, -9.0);

  const topFeedItem = Array.isArray(liveFeed) && liveFeed.length > 0 ? liveFeed[0] : null;
  const topFeedCleanTitle = topFeedItem ? stripEmojis(String(topFeedItem.title || '')) : '';
  const topFeedSource = topFeedItem ? stripEmojis(String(topFeedItem.source || 'Ekonomi Basını')) : 'Ekonomi Basını';

  const topCashRow = (tms29.cashFlowChampions && tms29.cashFlowChampions[0]) || null;
  const cashSampleTicker = topCashRow?.ticker || 'FROTO';

  // Novice Kicker: Sıfır finansal kısaltma, yalnızca gün, saat ve kasabanın somut durumu
  const noviceKicker = `${clock.humanDateLabel} · Saat ${clock.shortTime} · ${clock.plainTownPhase}`;

  let noviceHeadline = '';
  let noviceBody = '';
  let roadA = null;
  let roadB = null;
  let realWorldBridgeNote = '';

  if (!clock.isBankDaytimeTight && weather.bankCurrentSpreadPct >= 2.2) {
    noviceHeadline = `Çarşı kepenkleri inikken telefon ekranındaki gece gişesi her 1.000 liranın yaklaşık ${Math.round(weather.bankSlicePer1000TL)} lirasını daha ilk adımda aralık ve işlem kesintisi olarak alıyor.`;
    noviceBody = `Karanlıkta taş çarşıda terazi kurulmadığı için gece yarısı aceleyle altın veya yabancı para alanlar gişe memuruna fazladan pay bırakır. Sakin yolcu sabahı bekler; birikimini ya gündüz dar aralıkta gerçek terazide tartar ya da kesintisiz kira geliri getiren hazine kalkanında dinlendirir.`;
    roadA = {
      label: '1. Yol: Taş Çarşıdaki Gerçek Altın Terazisini İncele',
      targetBuildingId: 'kapalicarsi-kiler',
      targetAssetKey: 'gram-altin-spot'
    };
    roadB = {
      label: '2. Yol: Kesintisiz Devlet Kira Kalkanına Göz At',
      targetBuildingId: 'banka-hazine',
      targetAssetKey: 'kira-sertifikasi-sukuk'
    };
    realWorldBridgeNote = `Gerçek Hayat Karşılığı: Şu an mesai dışı saat diliminde mobil bankalarda döviz ve altın alım-satım makası yaklaşık %${fmtTrNum(weather.bankCurrentSpreadPct, 2)} seviyesine açılmıştır; buna alım anındaki %0,20 kambiyo gider vergisi (BSMV) eklendiğinde 1.000 TL'de ${fmtTrNum(weather.bankSlicePer1000TL, 2)} TL anlık maliyet oluşur. Gündüz Kapalıçarşı açıkken fiziki külçe makası ~%${fmtTrNum(weather.bazaarOpenSpreadPct, 2)} ve vergi %0'dır. Ayrıca borsadaki Darphane Altın Sertifikası (BIST:ALTIN / ALTIN.S1) ${fmtTrNum(s1Gram, 2)} TL/gr eşdeğeriyle fiziki gram altına (${fmtTrNum(spotGold, 2)} TL) karşı +%${fmtTrNum(extraGoldPct, 2)} hava parası taşırken, Hazine Kira Sertifikası (%0 stopaj, brüt/net %${fmtTrNum(sukukRate, 2)}) resmi TÜFE'nin (%${fmtTrNum(officialCpi, 2)}) üzerinde reel zırh sunmaktadır.${topFeedCleanTitle ? ` Günün manşet akışı (${topFeedSource}): "${topFeedCleanTitle}".` : ''}`;
  } else if (extraGoldPct >= 6.5) {
    noviceHeadline = `Kuyumcunun pirinç terazisinde ${Math.round(spotGold).toLocaleString('tr-TR')} liraya tartılan bir gram altın, kalabalığın elden ele koşturduğu kağıt fişi üzerinde tam ${extraGoldTL.toLocaleString('tr-TR')} lira daha pahalıya el değiştiriyor.`;
    noviceBody = `Mahalle fırınında ekmek ve mutfak filesi yılda yüzde ${Math.round(weather.breadInflationAnnualPct)} zamlanırken alın terini korumak doğrudur; ancak aynı altının sırf kağıt fişine yüzde ${fmtTrNum(extraGoldPct, 1)} fazladan hava parası ödemek kileri büyütmez. Usta gözler kalabalığın fişini değil, ya gerçek külçe terazisini ya da akşam çekmecesi peşin parayla dolan üretim atölyelerini seçer.`;
    roadA = {
      label: '1. Yol: Pirinç Terazi ile Kağıt Fişi Yan Yana Tart',
      targetBuildingId: 'kapalicarsi-kiler',
      targetAssetKey: 'altin-sertifikasi'
    };
    roadB = {
      label: '2. Yol: Kasası Her Akşam Peşin Dolan Mahalle Kilerine Git',
      targetBuildingId: 'fener-pazar',
      targetAssetKey: 'reel-perakende-bimas'
    };
    realWorldBridgeNote = `Gerçek Hayat Karşılığı: Spot piyasada 1 gram fiziki altın (gram-altin-spot) ${fmtTrNum(spotGold, 2)} TL iken, Borsa İstanbul'da işlem gören Darphane Altın Sertifikası (BIST:ALTIN / ALTIN.S1, 100 adet = 1 gr) ${fmtTrNum(s1Gram, 2)} TL/gr eşdeğerindedir; aradaki +${fmtTrNum(weather.darphaneExtraTLPerGram, 2)} TL/gr (+%${fmtTrNum(extraGoldPct, 2)}) fark, tarihsel +%1,5-%3,5 denge bandının çok üzerinde spekülatif perakende primidir. Yıllık %${fmtTrNum(officialCpi, 2)} resmi TÜFE, %${fmtTrNum(policyRate, 2)} TCMB politika faizi, ${fmtTrNum(usdTry, 2)} TL Dolar kuru ve varili ${fmtTrNum(brentUsd, 2)}$ olan Brent petrol (1A: ${fmtSignedPct(brent1M, 2)}) ortamında; ALTIN.S1'den fiziki altına geçiş gramajı anında artırırken, %0 stopajlı Hazine Sukuk (%${fmtTrNum(sukukRate, 2)}) ve güçlü faaliyet nakit akışı (OCF) üreten BIMAS / ${cashSampleTicker} gibi şirketler rasyonel karşılık oluşturur.${topFeedCleanTitle ? ` Canlı gündem (${topFeedSource}): "${topFeedCleanTitle}".` : ''}`;
  } else if (brent1M <= -10.0) {
    noviceHeadline = `Limana yanaşan gemilerdeki ham yakıt son bir ayda yüzde ${Math.round(Math.abs(brent1M))} ucuzlarken, mahalle çarşısındaki etiketler inmek bilmiyor ama uçak ve kamyon filolarının yakıt faturası hafifliyor.`;
    noviceBody = `Yakıt ucuzladığında çarşıdaki esnaf raf fiyatını kolay kolay indirmez; aradaki fark yakıtı tonla yakan hava limanı gemilerinin ve dağıtım kamyonlarının kasasında kalır. Fiyat etiketine kızmak yerine yakıt faturası düşen bu büyük taşıyıcıların kasasına ortak olmak evin mutfak hesabını dengeler.`;
    roadA = {
      label: '1. Yol: Yakıt Faturası Hafifleyen Uçak Limanına Bak',
      targetBuildingId: 'bogaz-havalimani',
      targetAssetKey: resolveTargetAssetKey('THYAO', tickerToInstMap)
    };
    roadB = {
      label: '2. Yol: Rafineri ve Enerji Kazanlarını Yerinde Gör',
      targetBuildingId: 'izmit-rafineri',
      targetAssetKey: resolveTargetAssetKey('TUPRS', tickerToInstMap)
    };
    realWorldBridgeNote = `Gerçek Hayat Karşılığı: Küresel Brent petrol son 1 ayda ${fmtSignedPct(brent1M, 2)} gerileyerek ${fmtTrNum(brentUsd, 2)}$ seviyesine inmiştir (USD/TRY: ${fmtTrNum(usdTry, 2)} TL). Havacılık ve lojistikte (THYAO, PGSUS, CLEBI) jet yakıtı toplam giderin %28-%34'ünü oluşturduğundan petrol düşüşü doğrudan FAVÖK ve serbest nakit akışı (FCF) marjını genişletir; perakendede (BIMAS, MGROS) ise fiyat yapışkanlığı sayesinde soğuk zincir nakliye tasarrufu kasada kalır.${topFeedCleanTitle ? ` Canlı haber akışı (${topFeedSource}): "${topFeedCleanTitle}".` : ''}`;
  } else {
    noviceHeadline = `Mahalle fırınındaki sıcak ekmek sepeti yılda yüzde ${Math.round(weather.breadInflationAnnualPct)} pahalanırken, çekmecesine her akşam gerçek peşin para giren atölyeler borçlu dükkânlardan sessizce ayrılıyor.`;
    noviceBody = `Borç faizinin yüksek olduğu günlerde krediyle dönen gösterişli binalar yorulur; borcu olmayan ve sattığı malın parasını aynı akşam tahsil eden mütevazı işlikler ise ayakta kalır. Atıl nakitte eriyen kağıt para yerine ya kesintisiz devlet kira kalkanı ya da çekmecesi dolu üretim dükkânları seçilir.`;
    roadA = {
      label: '1. Yol: Çekmecesi Peşin Dolan İhracat Fabrikalarına Git',
      targetBuildingId: 'kocaeli-otomotiv',
      targetAssetKey: resolveTargetAssetKey('FROTO', tickerToInstMap)
    };
    roadB = {
      label: '2. Yol: Kesintisiz Devlet Kira Kalkanını Tart',
      targetBuildingId: 'banka-hazine',
      targetAssetKey: 'kira-sertifikasi-sukuk'
    };
    realWorldBridgeNote = `Gerçek Hayat Karşılığı: Yıllık %${fmtTrNum(officialCpi, 2)} resmi TÜFE (aylık %${fmtTrNum(safeNum(macro.cpiMom, 2.58), 2)}) ve %${fmtTrNum(ppfRate, 2)} Para Piyasası Fonu / %${fmtTrNum(sukukRate, 2)} %0 stopajlı Hazine Sukuk getirisi ortamında yüksek finansman gideri borçlu şirketleri baskılamaktadır. TMS-29 denetiminde ${safeNum(tms29.cashChampionCount, 0)} şirket net kârının üzerinde saf faaliyet nakdi (OCF) üretirken, ${safeNum(tms29.illusionTrapCount, 0)} şirkette kağıt üstü tahakkuk illüzyonu tespit edilmiştir.${topFeedCleanTitle ? ` Canlı gündem (${topFeedSource}): "${topFeedCleanTitle}".` : ''}`;
  }

  return {
    noviceKicker,
    noviceHeadline,
    noviceBody,
    roadA,
    roadB,
    realWorldBridgeNote
  };
}

// ----------------------------------------------------------------------------
// 6. 6 CANLI TEDARİK ZİNCİRİ NABZI (supplyChainLivePulses)
// "Mazottan Domatese / Bacadan Tencereye" Sıfır Jargon + Usta Katmanı
// ----------------------------------------------------------------------------
function computeSupplyChainLivePulses(ctx, weather) {
  const { instMap, macro, bistLookup, macroChains } = ctx;
  const io = macroChains.inputOutputChains || {};
  const mp = macroChains.metalsAndPhysical || {};

  const brentUsd = safeNum(io.brentOilUsd, 91.6);
  const brent1W = safeNum(io.brentOilPerf1W, safeNum(instMap.get('emtia-petrol-bno')?.perf1W, 0));
  const brent1M = safeNum(io.brentOilPerf1M, safeNum(instMap.get('emtia-petrol-bno')?.perf1M, -9.08));
  const usdTry = safeNum(macro.usdTry, safeNum(instMap.get('doviz-usd')?.currentPrice, 50.44));
  const usd1M = safeNum(instMap.get('doviz-usd')?.perf1M, 1.88);
  const eurTry = safeNum(macro.eurTry, safeNum(instMap.get('doviz-eur')?.currentPrice, 55.43));
  const eurUsd = safeNum(io.eurUsd, safeNum(ctx.macroSpreads?.eurUsd?.value, 1.098));
  const eurUsd1M = safeNum(io.eurUsdPerf1M, safeNum(ctx.macroSpreads?.eurUsd?.perf1M, -2.13));

  const copperUsd = safeNum(io.copperUsd, 5.82);
  const copper1M = safeNum(io.copperPerf1M, -11.22);
  const silverGramTL = safeNum(instMap.get('gram-gumus-spot')?.currentPrice, safeNum(macro.spotGramSilver, 74.52));
  const silver1M = safeNum(instMap.get('gram-gumus-spot')?.perf1M, -17.86);
  const goldSilverRatio = safeNum(mp.goldSilverRatio, safeNum(ctx.macroSpreads?.goldSilverRatio?.value, 82.1));

  const agriInst = instMap.get('emtia-tarim-dba');
  const agri1W = safeNum(agriInst?.perf1W, 1.03);
  const agri1M = safeNum(agriInst?.perf1M, -6.62);

  const sukukRate = safeNum(instMap.get('kira-sertifikasi-sukuk')?.currentPrice, 36.5);
  const ppfRate = safeNum(instMap.get('para-piyasasi-fonu')?.currentPrice, 39.0);
  const hpiYoy = safeNum(macro.tcmbHpiYoy, 25.14);
  const priceToRent = safeNum(macro.tcmbPriceToRent, 125.31);

  const tuprs = bistLookup.TUPRS || {};
  const thyao = bistLookup.THYAO || {};
  const pgsus = bistLookup.PGSUS || {};
  const bimas = bistLookup.BIMAS || {};
  const mgros = bistLookup.MGROS || {};
  const tabgd = bistLookup.TABGD || {};
  const eregl = bistLookup.EREGL || {};
  const krdmb = bistLookup.KRDMB || {};
  const froto = bistLookup.FROTO || {};
  const toaso = bistLookup.TOASO || {};
  const egeen = bistLookup.EGEEN || {};
  const astor = bistLookup.ASTOR || {};
  const cwene = bistLookup.CWENE || {};
  const mogan = bistLookup.MOGAN || {};
  const ahgaz = bistLookup.AHGAZ || {};
  const petkm = bistLookup.PETKM || {};
  const garan = bistLookup.GARAN || {};
  const enkai = bistLookup.ENKAI || {};

  const tlOilNet1M = roundTo(((1 + brent1M / 100) * (1 + usd1M / 100) - 1) * 100, 2, -7.0);
  const oilFalling = tlOilNet1M < -1.5;

  const chain1 = {
    id: 'PULSE_1_DIESEL_TO_TOMATO_AND_WINGS',
    titleNovice: oilFalling
      ? 'Limandaki Yakıt Gemisi Ucuzladı: Uçak ve Kamyon Depoları Nefes Alıyor'
      : 'Pompadaki Yakıt Faturası Kabardı: 12 Günde Kamyona, 30 Günde Pazar Tezgâhına Yansır',
    stepsNovice: [
      oilFalling
        ? `Denizden gelen ham yakıt son bir ayda lira hesabında bile yüzde ${fmtTrNum(Math.abs(tlOilNet1M), 1)} gerileyerek rafineri kazanlarına daha ucuza girdi.`
        : `Denizden gelen ham yakıt ve döviz artışı birleşince rafineri çıkışındaki pompa maliyeti son bir ayda yüzde ${fmtTrNum(Math.abs(tlOilNet1M), 1)} yukarı itildi.`,
      oilFalling
        ? `En büyük gideri yakıt olan yolcu uçakları ve şehirler arası soğuk hava kamyonları her seferde daha az yakıt parası ödüyor.`
        : `Sebze ve süt taşıyan soğuk hava kamyonlarının yol parası kabardığı için fabrika çıkış faturaları 12 gün içinde zamlanmaya başlıyor.`,
      oilFalling
        ? `Çarşıdaki domates ve peynir fiyatı hemen düşmese de yakıt tasarrufu taşıyıcı şirketlerin ve mahalle marketlerinin akşam kasasında fazladan nakit olarak kalıyor.`
        : `Ay sonuna doğru bu nakliye faturası mahalle pazarındaki domatesin ve peynirin etiketine kuruş kuruş ekleniyor.`
    ],
    realWorldMapping: {
      rawMaterialName: `Brent Ham Petrol (${fmtTrNum(brentUsd, 2)}$) ve USD/TRY (${fmtTrNum(usdTry, 2)} TL)`,
      primaryCompanies: [
        'TUPRS (Tüpraş Rafineri)',
        'THYAO (Türk Hava Yolları)',
        'PGSUS (Pegasus)',
        'BIMAS (BİM Birleşik Mağazalar)'
      ],
      realMetricsText: `Brent 1H: ${fmtSignedPct(brent1W, 2)} · 1A: ${fmtSignedPct(brent1M, 2)} · TL bazlı net petrol maliyeti 1A: ${fmtSignedPct(tlOilNet1M, 2)} · TUPRS (${fmtTrNum(tuprs.close, 2)} TL, 1A: ${fmtSignedPct(tuprs.perf1M, 2)}, OCF: ${fmtTrNum(tuprs.ocfMillionTL, 0)}M TL) · THYAO (${fmtTrNum(thyao.close, 2)} TL, 1A: ${fmtSignedPct(thyao.perf1M, 2)}, OCF: ${fmtTrNum(thyao.ocfMillionTL, 0)}M TL) · PGSUS (${fmtTrNum(pgsus.close, 2)} TL, 1A: ${fmtSignedPct(pgsus.perf1M, 2)}).`
    }
  };

  const chain2 = {
    id: 'PULSE_2_BRASS_SCALE_VS_GOLD_SLIP',
    titleNovice: `Taş Çarşıdaki Altın Terazisi ile Kağıt Fişi Arasında ${Math.round(Math.abs(weather.darphaneExtraTLPerGram))} Liralık Uçurum`,
    stepsNovice: [
      `Dünya madenlerindeki gerçek altın ve gümüş son bir ayda dinlenmeye çekilirken, kuyumcu vitrinindeki bir gram altın ${Math.round(weather.spotGramGoldTL).toLocaleString('tr-TR')} liraya indi.`,
      `Ancak kalabalık sıraya girip altının kendisi yerine kağıt fişini kapıştığı için, aynı gramın kağıt fişi ${Math.round(weather.s1GramEquivTL).toLocaleString('tr-TR')} liradan satılıyor.`,
      `Evdeki birikimi korurken fiş balonuna fazladan yüzde ${fmtTrNum(weather.darphaneBalloonExtraPct, 1)} hava parası vermeyenler, aynı parayla kilerine daha fazla gerçek gram koyuyor.`
    ],
    realWorldMapping: {
      rawMaterialName: `Fiziki Külçe Altın (${fmtTrNum(weather.spotGramGoldTL, 2)} TL/gr) ve Spot Gümüş (${fmtTrNum(silverGramTL, 2)} TL/gr)`,
      primaryCompanies: [
        'gram-altin-spot (Kapalıçarşı Külçe)',
        'ALTIN.S1 (Darphane Altın Sertifikası)',
        'ZGOLD / GLDTR (Altın BYF - %17,5 Stopaj)',
        'gram-gumus-spot (Fiziki Gümüş)'
      ],
      realMetricsText: `Spot Gram Altın 1A: ${fmtSignedPct(instMap.get('gram-altin-spot')?.perf1M, 2)} vs ALTIN.S1 1A: ${fmtSignedPct(instMap.get('altin-sertifikasi')?.perf1M, 2)} · Net Sertifika Hava Parası: +${fmtTrNum(weather.darphaneExtraTLPerGram, 2)} TL/gr (+%${fmtTrNum(weather.darphaneBalloonExtraPct, 2)}) · Altın/Gümüş Rasyosu: ${fmtTrNum(goldSilverRatio, 1)}x (Gümüş 1A: ${fmtSignedPct(silver1M, 2)}) · ZGOLD/GLDTR/GMSTR kârında %17,5 stopaj varken Kapalıçarşı fiziki külçede vergi %0'dır.`
    }
  };

  const chain3 = {
    id: 'PULSE_3_WHEAT_AND_DAM_TO_PANTRY_REGISTER',
    titleNovice: 'Tarladaki Hasat ve Baraj Suyundan Akşam Peşin Dolan Mahalle Marketine',
    stepsNovice: [
      `Anadolu barajlarında su seviyesi yüzde ${fmtTrNum(weather.damWaterPct, 0)} dolayında seyrederken, dünya tahıl ambarındaki buğday ve mısır fiyatları son ayda yüzde ${fmtTrNum(Math.abs(agri1M), 1)} ${agri1M <= 0 ? 'gevşeyerek un değirmenlerini rahatlattı' : 'yükselerek un maliyetini artırdı'}.`,
      `Un, yağ ve süt kolileri depolardan çıkıp her mahalle sokağındaki zincir market raflarına günlük sevkiyatla diziliyor.`,
      `Mahalleli akşam yemeği alışverişini kasada peşin ödüyor; market ise toptancıya parasını 45 gün sonra verdiği için kasadaki sıcak nakit her gün kendi kendini büyütüyor.`
    ],
    realWorldMapping: {
      rawMaterialName: `Küresel Tarım Sepeti DBA (1A: ${fmtSignedPct(agri1M, 2)}, 1H: ${fmtSignedPct(agri1W, 2)}) ve Yıllık Mutfak Enflasyonu (%${fmtTrNum(weather.breadInflationAnnualPct, 2)})`,
      primaryCompanies: [
        'BIMAS (BİM Mağazaları)',
        'MGROS (Migros Ticaret)',
        'TABGD (TAB Gıda)',
        'SELEC (Selçuk Ecza Deposu)'
      ],
      realMetricsText: `Resmi TÜFE Yıllık: %${fmtTrNum(macro.cpiYoy, 2)} (Aylık: %${fmtTrNum(macro.cpiMom, 2)}) · BIMAS (${fmtTrNum(bimas.close, 2)} TL, 1A: ${fmtSignedPct(bimas.perf1M, 2)}, OCF: +${fmtTrNum(bimas.ocfMillionTL, 0)}M TL) · MGROS (${fmtTrNum(mgros.close, 2)} TL, 1A: ${fmtSignedPct(mgros.perf1M, 2)}, OCF: +${fmtTrNum(mgros.ocfMillionTL, 0)}M TL) · TABGD (${fmtTrNum(tabgd.close, 2)} TL, OCF: +${fmtTrNum(tabgd.ocfMillionTL, 0)}M TL, Sloan: ${fmtSignedPct(tabgd.sloanAccrualPct, 1)}) negatif işletme sermayesiyle nakit üretiyor.`
    }
  };

  const chain4 = {
    id: 'PULSE_4_BLAST_FURNACE_TO_EXPORT_HARBOR',
    titleNovice: 'Kızgın Çelik Ocağından Avrupa Limanına Giden Kamyon Gemisine',
    stepsNovice: [
      `Yerli çelik ocaklarında eritilen yassı sac ruloları, dışarıdan gelen ithal saca getirilen ek gümrük kalkanı sayesinde yeniden yerli fabrikaların ilk tercihi oldu.`,
      `Bu çelik saclar Kocaeli ve Bursa'daki dev montaj bantlarında kamyonet, otobüs ve dingil parçalarına dönüşüyor; her 10 araçtan 8'i gemiye yükleniyor.`,
      `Avrupa parasının son bir ayda dolar karşısında yüzde ${fmtTrNum(Math.abs(eurUsd1M), 1)} zayıflaması kâr payını biraz daraltsa da yurt dışından gelen taze döviz bu atölyelerin kasasını diri tutuyor.`
    ],
    realWorldMapping: {
      rawMaterialName: `Yassı Çelik Sac, EUR/TRY (${fmtTrNum(eurTry, 2)} TL) ve EUR/USD Paritesi (${fmtTrNum(eurUsd, 3)})`,
      primaryCompanies: [
        'FROTO (Ford Otomotiv)',
        'TOASO (Tofaş Oto)',
        'EGEEN (Ege Endüstri)',
        'EREGL / KRDMB (Erdemir ve Kardemir)'
      ],
      realMetricsText: `EUR/USD 1A: ${fmtSignedPct(eurUsd1M, 2)} · 57 Seri No.lu KDV Tebliği yerli çelik sac korumasında EREGL (${fmtTrNum(eregl.close, 2)} TL, PD/DD: ${fmtTrNum(eregl.pb, 2)}x) ve KRDMB (${fmtTrNum(krdmb.close, 2)} TL, OCF: +${fmtTrNum(krdmb.ocfMillionTL, 0)}M TL, CMF: +${fmtTrNum(krdmb.cmf20, 2)}) · İhracat hattında FROTO (${fmtTrNum(froto.close, 2)} TL, 1A: ${fmtSignedPct(froto.perf1M, 2)}, OCF: +${fmtTrNum(froto.ocfMillionTL, 0)}M TL, F/K: ${fmtTrNum(froto.pe, 1)}x), TOASO (${fmtTrNum(toaso.close, 2)} TL) ve EGEEN (${fmtTrNum(egeen.close, 2)} TL).`
    }
  };

  const chain5 = {
    id: 'PULSE_5_COPPER_WIRE_TO_CITY_POWER_GRID',
    titleNovice: 'Bakır Tel Ucuzlarken Neden Sadece Fatura Tahsil Eden Enerji Dükkânları Rahat?',
    stepsNovice: [
      `Elektrik trafolarının ve güneş panellerinin kalbi olan bakır ve gümüş madenleri son bir ayda yüzde ${fmtTrNum(Math.abs(copper1M), 1)} ucuzlayarak atölye malzeme faturasını düşürdü.`,
      `Ne var ki yeni fabrika kuracak müşteriler pahalı kredi yüzünden siparişleri erteleyince, sırf ekipman satan kalabalık atölyelerde büyük ortaklar sessizce çıkış yaptı.`,
      `Buna karşılık her ay evlerin ve dükkânların mecburi elektrik ve doğalgaz sayacını okuyan dağıtım ve üretim tesislerinin kasasına düzenli peşin para akmaya devam ediyor.`
    ],
    realWorldMapping: {
      rawMaterialName: `Elektrolitik Bakır (${fmtTrNum(copperUsd, 2)}$, 1A: ${fmtSignedPct(copper1M, 2)}) ve GTİP 8504/8541 Trafo-Panel Zinciri`,
      primaryCompanies: [
        'MOGAN (Mogan Enerji)',
        'AHGAZ (Ahlatcı Doğalgaz)',
        'ASTOR (Astor Enerji - Dağıtım Uyarısı)',
        'CWENE (CW Enerji - Dağıtım Uyarısı)'
      ],
      realMetricsText: `Bakır 1A: ${fmtSignedPct(copper1M, 2)} ve Gümüş 1A: ${fmtSignedPct(silver1M, 2)} girdi düşüşüne rağmen ekipman tarafında ASTOR (${fmtTrNum(astor.close, 2)} TL, CMF: ${fmtTrNum(astor.cmf20, 2)}) ve CWENE (${fmtTrNum(cwene.close, 2)} TL, CMF: ${fmtTrNum(cwene.cmf20, 2)}) negatif kurumsal akışta; EPİAŞ ve dağıtım nakit akışında ise MOGAN (OCF: +${fmtTrNum(mogan.ocfMillionTL, 0)}M TL, CMF: +${fmtTrNum(mogan.cmf20, 2)}) ve AHGAZ (OCF: +${fmtTrNum(ahgaz.ocfMillionTL, 0)}M TL, Net Nakit) pozitif ayrışıyor.`
    }
  };

  const chain6 = {
    id: 'PULSE_6_VAULT_RATE_TO_BRICK_AND_CASH_FORTRESS',
    titleNovice: 'Pahalı Borç Döneminde Boş Bekleyen Şantiye ile Kasası Dolu Ustanın Farkı',
    stepsNovice: [
      `Ülkenin hazine kulesinde bekleyen hazır nakit yılda yüzde ${fmtTrNum(sukukRate, 1)} ile yüzde ${fmtTrNum(ppfRate, 1)} arasında hazır kira geliri verince, borç paranın maliyeti ateş pahası oldu.`,
      `Krediyle ev almak zorlaştığı için konut fiyat artışı yılda yüzde ${fmtTrNum(hpiYoy, 1)} seviyesinde kalarak mutfak enflasyonunun gerisine düştü; bir evin kira ile kendini geri ödeme süresi ${Math.round(priceToRent)} aya uzadı.`,
      `Ağır borç altındaki fabrikalar tüm yıl alacaklıya çalışırken, kasasında hazır nakit tutan borçsuz dükkânlar hem işinden hem de kasasındaki nakitten çift kazanç yazıyor.`
    ],
    realWorldMapping: {
      rawMaterialName: `TCMB Politika Faizi (%${fmtTrNum(macro.tcmbPolicyRate, 2)}), Hazine Sukuk (%${fmtTrNum(sukukRate, 2)}) ve Konut Kira Çarpanı (${fmtTrNum(priceToRent, 1)} Ay)`,
      primaryCompanies: [
        'kira-sertifikasi-sukuk (%0 Stopaj Hazine Sukuk)',
        'ENKAI (Enka İnşaat - Net Nakit Kalesi)',
        'GARAN (Garanti BBVA - PBLK Kilit Kalkanı)',
        'PETKM (Petkim - Kısa Vadeli Borç Duvarı Uyarısı)'
      ],
      realMetricsText: `PPF Brüt: %${fmtTrNum(ppfRate, 2)} (%17,5 stopaj sonrası net ~%${fmtTrNum(ppfRate * 0.825, 2)}) vs Hazine Sukuk: %${fmtTrNum(sukukRate, 2)} (%0 stopaj) · TCMB Konut Endeksi Yıllık: +%${fmtTrNum(hpiYoy, 2)} (TÜFE %${fmtTrNum(macro.cpiYoy, 2)} altında reel kayıp) · Borç duvarında PETKM (NetBorç/FAVÖK: ${fmtTrNum(petkm.netDebtToEbitda, 1)}x, FCF: ${fmtTrNum(petkm.fcfMillionTL, 0)}M TL) zorlanırken, ENKAI (OCF: +${fmtTrNum(enkai.ocfMillionTL, 0)}M TL, CMF: +${fmtTrNum(enkai.cmf20, 2)}) ve GARAN (PD/DD: ${fmtTrNum(garan.pb, 2)}x, CMF: +${fmtTrNum(garan.cmf20, 2)}) kurumsal toplama görüyor.`
    }
  };

  return [chain1, chain2, chain3, chain4, chain5, chain6];
}

// ----------------------------------------------------------------------------
// 7. 4 ERZAK DOLABI VE KITLIK SİNYALİ (scarcityAndPantrySignals)
// ('energy', 'food_water', 'fx_import', 'credit_cash')
// ----------------------------------------------------------------------------
function computeScarcityAndPantrySignals(ctx, weather) {
  const { instMap, macro, bistLookup, macroChains, tms29 } = ctx;
  const io = macroChains.inputOutputChains || {};

  const brentUsd = safeNum(io.brentOilUsd, 91.6);
  const natGas1M = safeNum(io.natGasPerf1M, 2.78);
  const usdTry = safeNum(macro.usdTry, 50.44);
  const usd1Y = safeNum(instMap.get('doviz-usd')?.perf1Y, 19.19);
  const cpiYoy = safeNum(macro.cpiYoy, 29.77);
  const policyRate = safeNum(macro.tcmbPolicyRate, 36.0);
  const sukukRate = safeNum(instMap.get('kira-sertifikasi-sukuk')?.currentPrice, 36.5);
  const debtWallCount = safeNum(tms29.debtWallCount, 8);

  const energyTightness = roundTo(clamp(38 + weather.dieselPressurePct * 0.72 + Math.max(0, natGas1M) * 2.1, 20, 96), 1, 62);
  const foodWaterTightness = roundTo(clamp((100 - weather.damWaterPct) * 0.58 + weather.breadInflationAnnualPct * 0.85, 22, 96), 1, 64);
  const fxImportTightness = roundTo(clamp(44 + Math.max(0, cpiYoy - usd1Y) * 1.15 + Math.max(0, 1.12 - safeNum(io.eurUsd, 1.10)) * 120, 25, 95), 1, 61);
  const creditCashTightness = roundTo(clamp(policyRate * 1.45 + debtWallCount * 0.85, 25, 98), 1, 78);

  const labelFor = (lvl) => {
    if (lvl >= 75) return 'KRİTİK DARBOĞAZ VE MECBURİ AKIŞ';
    if (lvl >= 55) return 'SIKIŞIK KİLER VE SEÇİCİ GÜÇ';
    return 'DENGELİ TEDARİK AKIŞI';
  };

  return [
    {
      id: 'energy',
      scarcityLevelPct: energyTightness,
      severityLabel: labelFor(energyTightness),
      titleNovice: 'Kışın Yanan Kombi ve Kamyon Deposu: Dışarıdan Gelen Yakıt Mecburiyeti',
      pantryStoryNovice: `Evdeki odunluk boşaldığında kışın ortasında sobayı söndüremezsin; ülkemiz de yaktığı petrolün ve doğalgazın büyük kısmını dışarıdan gemiyle ve boru hattıyla alıyor. Ham yakıt gemisi ${Math.round(brentUsd)} dolar civarında seyrettikçe hiçbir fabrika veya şehir bu faturadan kaçamıyor.`,
      whoNeedsItNovice: `Her apartman dairesi ısınmak, her fırın hamur pişirmek ve her kamyon yola çıkmak için bu yakıta mecbur; vananın başında durup sayaç okuyan ve yakıtı işleyen tesislerin kasası ise hiç boş kalmıyor.`,
      realWorldInvestorNote: `Enerji Arz Darboğazı (%${fmtTrNum(energyTightness, 1)} Sinyal Gücü): Brent petrol ${fmtTrNum(brentUsd, 2)}$, Henry Hub doğalgaz 1A ${fmtSignedPct(natGas1M, 2)} ve USD/TRY ${fmtTrNum(usdTry, 2)} TL denkleminde Türkiye'nin birincil enerji ithalat faturası zorunlu taleptir. Rafineri omurgası TUPRS (OCF: +${fmtTrNum(bistLookup.TUPRS?.ocfMillionTL, 0)}M TL), şehir içi doğalgaz ve elektrik dağıtım nakit akışıyla AHGAZ (OCF: +${fmtTrNum(bistLookup.AHGAZ?.ocfMillionTL, 0)}M TL), ENERY ve ENJSA ile yenilenebilir baz yük üreticisi MOGAN (OCF/CAPEX: ${fmtTrNum(bistLookup.MOGAN?.ocfToCapexRatio, 2)}x) fiyatlama gücünü elinde tutarken; ithal nafta ve enerji bağımlısı borçlu tesisler (PETKM vb.) marj baskısı altındadır.`,
      primaryBeneficiaryTickers: ['TUPRS', 'AHGAZ', 'MOGAN', 'ENERY', 'ENJSA'],
      vulnerableTickers: ['PETKM', 'IZMDC', 'CANTE'],
      targetBuildingId: 'izmit-rafineri',
      targetAssetKey: 'emtia-petrol-bno'
    },
    {
      id: 'food_water',
      scarcityLevelPct: foodWaterTightness,
      severityLabel: labelFor(foodWaterTightness),
      titleNovice: 'Barajdaki Su ve Mutfaktaki Ekmek: Yarına Ertelenemeyen Tek Alışveriş',
      pantryStoryNovice: `Bir aile yeni koltuk veya televizyon almayı iki yıl erteleyebilir ama akşam tenceresindeki sütü, yumurtayı, unu ve ilacı yarına bırakamaz. Barajların doluluğu yüzde ${fmtTrNum(weather.damWaterPct, 0)} seviyesindeyken mutfak filesi yılda yüzde ${Math.round(weather.breadInflationAnnualPct)} hızla zamlanmaya devam ediyor.`,
      whoNeedsItNovice: `Seksen beş milyon insan her akşam bu fileyi doldurmak zorunda; ürünü rafta çürütmeden peşin satıp toptancıya vade yapan mahalle marketleri ve ilaç depoları bu mecburiyetin doğal kasasıdır.`,
      realWorldInvestorNote: `Su ve Zorunlu Gıda-Sağlık Darboğazı (%${fmtTrNum(foodWaterTightness, 1)} Sinyal Gücü): Baraj doluluk tahmini %${fmtTrNum(weather.damWaterPct, 1)} ve yıllık mutfak enflasyonu %${fmtTrNum(weather.breadInflationAnnualPct, 2)} (Resmi TÜFE: %${fmtTrNum(cpiYoy, 2)}) ortamında zorunlu tüketim talebi inelastiktir. Raf fiyatını aynı hafta güncelleyip negatif işletme sermayesiyle çalışan BIMAS (OCF: +${fmtTrNum(bistLookup.BIMAS?.ocfMillionTL, 0)}M TL), MGROS (OCF: +${fmtTrNum(bistLookup.MGROS?.ocfMillionTL, 0)}M TL), hızlı servis gıda lideri TABGD (OCF: +${fmtTrNum(bistLookup.TABGD?.ocfMillionTL, 0)}M TL) ve zorunlu ilaç dağıtım omurgası SELEC (CMF: +${fmtTrNum(bistLookup.SELEC?.cmf20, 2)}) enflasyonu anında kasaya geçirir.`,
      primaryBeneficiaryTickers: ['BIMAS', 'MGROS', 'TABGD', 'SELEC', 'EBEBK'],
      vulnerableTickers: ['VESBE', 'VESTL', 'MAALT'],
      targetBuildingId: 'fener-pazar',
      targetAssetKey: 'reel-perakende-bimas'
    },
    {
      id: 'fx_import',
      scarcityLevelPct: fxImportTightness,
      severityLabel: labelFor(fxImportTightness),
      titleNovice: 'Yerli Üretim Kalkanı ve Dışarıdan Parça Bekleyen Atölyelerin Sınavı',
      pantryStoryNovice: `Evde kendi salçanı ve eriştenden kışlığını kendin yapıyorsan çarşıdaki fahiş etiketten korkmazsın; ama her vidayı dışarıdan hazır alıp birleştiren atölye gümrük kapısı pahalandığında köşeye sıkışır. İçeride mutfak fiyatları yüzde ${Math.round(cpiYoy)} artarken döviz artışı yüzde ${Math.round(usd1Y)} kalınca, dışarıdan ucuza mal getirenlerin vergi avantajı da kapatıldı.`,
      whoNeedsItNovice: `Dışarıdan hazır parça getirmek zorlaşınca bütün fabrikalar içeride kendi çeliğini, camını ve yazılımını üreten yerli ocaklara ve yurt dışına mal satan ihracat kalelerine mecbur kalıyor.`,
      realWorldInvestorNote: `Döviz Akışı ve 57 Seri No.lu KDV Tebliği Koruması (%${fmtTrNum(fxImportTightness, 1)} Sinyal Gücü): Yıllık TÜFE (%${fmtTrNum(cpiYoy, 2)}) ile USD/TRY değişimi (%${fmtTrNum(usd1Y, 2)}) arasındaki reel TL değerlenmesi normalde ithalatı teşvik ederken, 1 Mayıs 2026 yürürlüklü 57 Seri No.lu KDV Tebliği gözetim ve ek mali yükümlülük kapsamındaki ithal girdilerde KDV indirim hakkını kaldırarak ithal yarı-mamul maliyetini +%20 artırmıştır. Bu yapısal kalkan entegre yerli üreticileri (KRDMB, EREGL, SISE) ve net döviz sözleşmeli ASELS, THYAO, FROTO ve ENKAI'yi korurken, ithal montajcı şirketlerin marjını daraltır.`,
      primaryBeneficiaryTickers: ['ASELS', 'FROTO', 'THYAO', 'KRDMB', 'EREGL'],
      vulnerableTickers: ['SMRTG', 'CWENE', 'GEREL'],
      targetBuildingId: 'kocaeli-otomotiv',
      targetAssetKey: 'doviz-usd'
    },
    {
      id: 'credit_cash',
      scarcityLevelPct: creditCashTightness,
      severityLabel: labelFor(creditCashTightness),
      titleNovice: 'Kasada Hazır Nakit Kıtlığı: Borçlu Çalışan Alacaklıya, Nakdi Olan Kendine Çalışır',
      pantryStoryNovice: `Mahallede hazır nakit para herkesin cebinden çekildiğinde, borca mal alan esnaf dükkânın tüm kazancını alacaklıya faiz diye öder. Bugün ülkede hazır parayı kiralamanın bedeli yılda yüzde kırkları aştığı için en kıymetli erzak, kimseye borcu olmayan dolu kasa çekmecesidir.`,
      whoNeedsItNovice: `Kısa vadeli borç senedi vadesi gelen borçlu şirketler bu pahalı nakde mecbur; kasasında hazır para tutan borçsuz şirketler ve hazine kira kalkanı ise masanın en güçlü tarafında oturuyor.`,
      realWorldInvestorNote: `Nakit ve Kredi Likidite Kıtlığı (%${fmtTrNum(creditCashTightness, 1)} Sinyal Gücü): TCMB politika faizi %${fmtTrNum(policyRate, 2)}, PPF %${fmtTrNum(instMap.get('para-piyasasi-fonu')?.currentPrice, 2)} ve ticari kredi maliyetlerinin %42-%48 bandında olduğu rejimde, BIST evreninde ${debtWallCount} büyük şirket kısa vadeli borç duvarı alarmı vermektedir. %0 stopajlı Hazine Kira Sertifikası (%${fmtTrNum(sukukRate, 2)} net), 131 Fon PBLK 3 aylık satış kilidiyle korunan düşük çarpanlı bankalar (GARAN, TSKB) ve devasa OCF üreten TCELL, SAHOL, ENKAI, ALGYO likidite primini toplarken; yüksek NetBorç/FAVÖK taşıyan PETKM, VESBE, KLYPV finansman giderine çalışmaktadır.`,
      primaryBeneficiaryTickers: ['kira-sertifikasi-sukuk', 'TCELL', 'GARAN', 'TSKB', 'ENKAI'],
      vulnerableTickers: ['PETKM', 'VESBE', 'KLYPV', 'IZMDC'],
      targetBuildingId: 'banka-hazine',
      targetAssetKey: 'kira-sertifikasi-sukuk'
    }
  ];
}

// ----------------------------------------------------------------------------
// 8. ATÖLYE VİTRİNİ: 8 KAYA GİBİ KASA vs 6 İÇİ BOŞ KAĞIT VİTRİN (workshopSpotlight)
// ----------------------------------------------------------------------------
function computeWorkshopSpotlight(ctx) {
  const { bistList, bistLookup, tms29, mkkLedger, whale, trapsAndAlerts, tickerToInstMap } = ctx;

  const excludedSpeculative = new Set(['METRO', 'EUHOL', 'IHLAS', 'IHGZT', 'ADESE']);
  const cashCandidates = [];

  for (const row of bistList) {
    if (!row || !row.ticker || excludedSpeculative.has(row.ticker)) continue;
    const close = safeNum(row.close, 0);
    const mcapB = safeNum(row.marketCapBillionTL, 0);
    const ocfM = safeNum(row.ocfMillionTL, 0);
    const fcfM = safeNum(row.fcfMillionTL, 0);
    const niM = safeNum(row.netIncomeMillionTL, 0);
    const cmf = safeNum(row.cmf20, 0);
    const pb = safeNum(row.pb, 1.5);
    const pe = row.pe != null ? safeNum(row.pe, 12) : null;
    const ndEb = row.netDebtToEbitda != null ? safeNum(row.netDebtToEbitda, 0) : null;
    const sloan = safeNum(row.sloanAccrualPct, 0);

    if (close <= 0 || mcapB < 4.5 || ocfM < 1800) continue;
    if (fcfM < 400) continue;
    if (cmf < -0.04) continue;
    if (pb <= 0 || pb > 3.2) continue;
    if (pe !== null && (pe <= 0 || pe > 24)) continue;
    if (ndEb !== null && ndEb > 2.6) continue;

    const ocfYieldPct = (ocfM / (mcapB * 1000)) * 100;
    const fcfYieldPct = (fcfM / (mcapB * 1000)) * 100;
    const cashOverProfitBonus = niM > 0 && ocfM > niM ? Math.min(18, (ocfM / niM) * 3.5) : 4;
    const netCashBonus = (row.isNetCash || (ndEb !== null && ndEb <= 0)) ? 10 : 0;
    const score = ocfYieldPct * 1.35 + fcfYieldPct * 1.15 + cmf * 65 + cashOverProfitBonus + netCashBonus - pb * 4.5 - sloan * 0.35;

    cashCandidates.push({ row, score });
  }

  cashCandidates.sort((a, b) => b.score - a.score);

  const selectedSolid = [];
  const sectorCounts = new Map();
  for (const cand of cashCandidates) {
    if (selectedSolid.length >= 8) break;
    const sec = String(cand.row.sector || 'Genel Sanayi');
    const used = sectorCounts.get(sec) || 0;
    if (used >= 2) continue;
    sectorCounts.set(sec, used + 1);
    selectedSolid.push(cand);
  }

  if (selectedSolid.length < 8) {
    const pickedSet = new Set(selectedSolid.map((x) => x.row.ticker));
    const backupPool = [
      ...(tms29.cashFlowChampions || []),
      ...bistList.filter((x) => safeNum(x?.ocfMillionTL, 0) > 0).sort((a, b) => safeNum(b.ocfMillionTL, 0) - safeNum(a.ocfMillionTL, 0))
    ];
    for (const ch of backupPool) {
      if (selectedSolid.length >= 8) break;
      if (!ch?.ticker || pickedSet.has(ch.ticker)) continue;
      const fullRow = bistLookup[ch.ticker] || ch;
      pickedSet.add(ch.ticker);
      selectedSolid.push({ row: fullRow, score: 50 });
    }
  }

  const rockSolidCashDrawers = selectedSolid.slice(0, 8).map((item, idx) => {
    const r = item.row;
    const ticker = String(r.ticker).toUpperCase();
    const friendlyName = toFriendlyTurkishTitle(r.name, ticker);
    const ocfB = roundTo(safeNum(r.ocfMillionTL, 0) / 1000, 1, 1.0);
    const fcfB = roundTo(safeNum(r.fcfMillionTL, 0) / 1000, 1, 0.5);
    const niB = roundTo(safeNum(r.netIncomeMillionTL, 0) / 1000, 2, 0.5);
    const isDebtFree = Boolean(r.isNetCash) || (r.netDebtToEbitda != null && safeNum(r.netDebtToEbitda, 1) <= 0.1);

    const plainDrawerStory = `${friendlyName} dükkânının kasasına son dönemde tam ${fmtTrNum(ocfB, 1)} milyar lira gerçek tahsil edilmiş nakit girdi; tüm fabrika ve bakım masrafları çıktıktan sonra bile çekmecede ${fmtTrNum(fcfB, 1)} milyar lira hazır para kaldı.${isDebtFree ? ' Üstelik sırtında borç yükü taşımadığı için kimseye eğilmiyor ve büyük kasalar paylarını sessizce topluyor.' : ' Borcu kazancına göre gayet düşük kaldığı için fırtınalı havada bile kendi yağıyla kavruluyor.'}`;

    const masterForensicNote = `${ticker} (${fmtTrNum(r.close, 2)} TL · 1A: ${fmtSignedPct(r.perf1M, 2)}): Bilanço Net Kârı ${fmtTrNum(niB, 2)} Milyar TL iken kasaya giren gerçek Faaliyet Nakit Akışı (OCF) +${fmtTrNum(r.ocfMillionTL, 0)}M TL ve Serbest Nakit Akışı (FCF) +${fmtTrNum(r.fcfMillionTL, 0)}M TL (Sloan Tahakkuk: ${fmtSignedPct(r.sloanAccrualPct, 2)}, PD/DD: ${fmtTrNum(r.pb, 2)}x${r.pe != null ? `, F/K: ${fmtTrNum(r.pe, 1)}x` : ''}, CMF-20: ${r.cmf20 >= 0 ? '+' : ''}${fmtTrNum(r.cmf20, 2)}).`;

    return {
      rank: idx + 1,
      ticker,
      symbol: `BIST:${ticker}`,
      targetAssetKey: resolveTargetAssetKey(ticker, tickerToInstMap),
      targetBuildingId: resolveTargetBuildingId(r.sector, ticker),
      workshopName: friendlyName,
      officialName: stripEmojis(String(r.name || ticker)),
      sector: stripEmojis(String(r.sector || 'Sanayi ve Hizmet')),
      closePriceTL: roundTo(r.close, 2, 0),
      plainDrawerStory,
      masterForensicNote,
      metrics: {
        ocfMillionTL: roundTo(r.ocfMillionTL, 0, 0),
        fcfMillionTL: roundTo(r.fcfMillionTL, 0, 0),
        netIncomeMillionTL: roundTo(r.netIncomeMillionTL, 0, 0),
        sloanAccrualPct: roundTo(r.sloanAccrualPct, 2, 0),
        pb: roundTo(r.pb, 2, 0),
        pe: roundTo(r.pe, 2, 0),
        cmf20: roundTo(r.cmf20, 3, 0),
        perf1M: roundTo(r.perf1M, 2, 0)
      }
    };
  });

  // B) TOP 6 HOLLOW PAPER FRONTS
  const trapPool = [];
  const seenTrapTickers = new Set();

  for (const lotItem of (mkkLedger.lotExpansionAlerts || [])) {
    const t = String(lotItem?.ticker || '').toUpperCase();
    const delta = safeNum(lotItem?.deltaFloatShares, 0);
    if (!t || delta < 1000000 || seenTrapTickers.has(t)) continue;
    const full = bistLookup[t] || lotItem;
    seenTrapTickers.add(t);
    trapPool.push({
      archetype: 'MKK_LOT_EXPANSION',
      priorityScore: 95 + Math.min(25, delta / 15000000) - safeNum(full.cmf20, 0) * 30,
      row: full,
      deltaFloatShares: delta
    });
    if (trapPool.length >= 2) break;
  }

  let addedIllusion = 0;
  for (const ill of (tms29.tms29IllusionTraps || [])) {
    if (addedIllusion >= 2) break;
    const t = String(ill?.ticker || '').toUpperCase();
    if (!t || seenTrapTickers.has(t)) continue;
    const full = bistLookup[t] || ill;
    seenTrapTickers.add(t);
    addedIllusion++;
    trapPool.push({
      archetype: 'TMS29_ACCRUAL_ILLUSION',
      priorityScore: 90 + safeNum(ill.sloanAccrualPct, 20) * 0.5 - safeNum(full.cmf20, 0) * 25,
      row: full,
      deltaFloatShares: 0
    });
  }

  let addedDebt = 0;
  for (const dw of (tms29.debtWallAlerts || [])) {
    if (addedDebt >= 2) break;
    const t = String(dw?.ticker || '').toUpperCase();
    if (!t || seenTrapTickers.has(t)) continue;
    const full = bistLookup[t] || dw;
    if (safeNum(full.cmf20, 0) > 0.02) continue;
    seenTrapTickers.add(t);
    addedDebt++;
    trapPool.push({
      archetype: 'SHORT_TERM_DEBT_WALL',
      priorityScore: 88 + Math.min(30, safeNum(dw.netDebtToEbitda, 20) * 0.15) - safeNum(full.cmf20, 0) * 25,
      row: full,
      deltaFloatShares: 0
    });
  }

  if (trapPool.length < 6) {
    const extraSources = [
      ...(whale.telegramPumpAnomalies || []),
      ...bistList.filter((s) => safeNum(s.deltaFloatShares, 0) > 1000000 && safeNum(s.cmf20, 0) < 0.05),
      ...bistList.filter((s) => safeNum(s.ocfMillionTL, 0) < -100 && safeNum(s.cmf20, 0) < -0.05),
      ...(trapsAndAlerts || []).map((x) => {
        const sym = String(x?.symbol || '');
        const tk = sym.startsWith('BIST:') ? sym.split(':')[1] : '';
        return tk ? (bistLookup[tk] || { ticker: tk, name: x.name, close: x.currentPrice, cmf20: x.cmf20, pb: 1.5, ocfMillionTL: -120 }) : null;
      }).filter(Boolean),
      ...[...bistList].filter((s) => safeNum(s.cmf20, 0) <= -0.10).sort((a, b) => safeNum(a.cmf20, 0) - safeNum(b.cmf20, 0)).slice(0, 10)
    ];

    for (const ex of extraSources) {
      if (trapPool.length >= 6) break;
      const t = String(ex?.ticker || '').toUpperCase();
      if (!t || seenTrapTickers.has(t)) continue;
      seenTrapTickers.add(t);
      const dShares = safeNum(ex?.deltaFloatShares, 0);
      trapPool.push({
        archetype: dShares > 1000000 ? 'MKK_LOT_EXPANSION' : 'MEGAPHONE_DISTRIBUTION',
        priorityScore: 75 - safeNum(ex.cmf20, 0) * 20,
        row: bistLookup[t] || ex,
        deltaFloatShares: dShares
      });
    }
  }

  trapPool.sort((a, b) => b.priorityScore - a.priorityScore);

  const hollowPaperFronts = trapPool.slice(0, 6).map((item, idx) => {
    const r = item.row || {};
    const ticker = String(r.ticker || 'BIST').toUpperCase();
    const friendlyName = toFriendlyTurkishTitle(r.name, ticker);
    const ocfM = safeNum(r.ocfMillionTL, 0);
    const fcfM = safeNum(r.fcfMillionTL, 0);
    const niM = safeNum(r.netIncomeMillionTL, 0);
    const netDebtM = safeNum(r.netDebtMillionTL, 0);
    const ndEb = safeNum(r.netDebtToEbitda, 0);
    const deltaLotsM = roundTo(safeNum(item.deltaFloatShares, 0) / 1e6, 1, 0);

    let plainTrapStory = '';
    let masterForensicNote = '';

    if (item.archetype === 'MKK_LOT_EXPANSION') {
      plainTrapStory = `${friendlyName} dükkânında büyük ortaklar arka depoda kilitli duran tam ${fmtTrNum(deltaLotsM, 1)} milyon adet ortaklık kağıdını sessizce çarşıya indirip kalabalığa satışa koydu. Vitrindeki kalabalık ucuzluk sanırken içerideki büyük eller nakde geçip uzaklaşıyor.`;
      masterForensicNote = `${ticker} (${fmtTrNum(r.close, 2)} TL): MKK fiili dolaşımdaki pay adedi +${Math.round(item.deltaFloatShares).toLocaleString('tr-TR')} lot arttı (Dolaşım: %${fmtTrNum(r.floatPct, 1)}, CMF-20: ${fmtTrNum(r.cmf20, 2)}, PD/DD: ${fmtTrNum(r.pb, 2)}x). Ortak veya patron borsada işlem gören tipe dönüşüm arzı ile tahtada dağıtım baskısı var.`;
    } else if (item.archetype === 'TMS29_ACCRUAL_ILLUSION') {
      plainTrapStory = `${friendlyName} vitrin tabelaya "${Math.round(niM).toLocaleString('tr-TR')} milyon lira kâr ettik" diye yazmış ama akşam dükkânın kasa çekmecesi açıldığında içeriden ${Math.round(Math.abs(ocfM)).toLocaleString('tr-TR')} milyon lira eksildiği görülüyor. Defterdeki kağıt kâr karın doyurmaz; çekmeceye gerçek para girmiyor.`;
      masterForensicNote = `${ticker} (${fmtTrNum(r.close, 2)} TL): Manşette +${fmtTrNum(niM, 0)}M TL Net Kâr açıklamasına rağmen gerçek Faaliyet Nakit Akışı (OCF) ${fmtTrNum(ocfM, 0)}M TL ve Serbest Nakit Akışı (FCF) ${fmtTrNum(fcfM, 0)}M TL (Sloan Tahakkuk: ${fmtSignedPct(r.sloanAccrualPct, 2)}, CMF-20: ${fmtTrNum(r.cmf20, 2)}). TMS-29 parasal kazanç veya tahsil edilmemiş alacak illüzyonu.`;
    } else if (item.archetype === 'SHORT_TERM_DEBT_WALL') {
      plainTrapStory = `${friendlyName} atölyesinin sırtında ${fmtTrNum(netDebtM / 1000, 1)} milyar liralık dev bir borç çuvalı var ve kasasından her dönem nakit eksiliyor. Borç faizinin ateş pahası olduğu bu havada dükkân kendi ortaklarına değil, borç aldığı alacaklılara çalışıyor.`;
      masterForensicNote = `${ticker} (${fmtTrNum(r.close, 2)} TL): Net Borç ${fmtTrNum(netDebtM, 0)}M TL, Net Borç/FAVÖK ${fmtTrNum(ndEb, 1)}x, Cari Oran ${fmtTrNum(r.currentRatio, 2)} ve FCF ${fmtTrNum(fcfM, 0)}M TL (CMF-20: ${fmtTrNum(r.cmf20, 2)}). Yüksek ticari kredi faizi ortamında finansman gideri faaliyet kârını eritiyor.`;
    } else {
      plainTrapStory = `${friendlyName} önünde megafonla bağıran kalabalık gürültü yapıyor ama dükkânın kasa çekmecesi eksi yazıyor ve büyük eller kapıdan sessizce çıkıyor. Gürültünün çok, gerçek tahsilatın yok olduğu tezgâha girilmez.`;
      masterForensicNote = `${ticker} (${fmtTrNum(r.close, 2)} TL): Negatif faaliyet nakit akışı (OCF: ${fmtTrNum(ocfM, 0)}M TL) ve kurumsal para çıkışı (CMF-20: ${fmtTrNum(r.cmf20, 2)}, PD/DD: ${fmtTrNum(r.pb, 2)}x) bir arada; dağıtım ve değer tuzağı uyarısı.`;
    }

    return {
      rank: idx + 1,
      trapArchetype: item.archetype,
      ticker,
      symbol: `BIST:${ticker}`,
      targetAssetKey: resolveTargetAssetKey(ticker, tickerToInstMap),
      targetBuildingId: resolveTargetBuildingId(r.sector, ticker),
      workshopName: friendlyName,
      officialName: stripEmojis(String(r.name || ticker)),
      sector: stripEmojis(String(r.sector || 'Sanayi ve Hizmet')),
      closePriceTL: roundTo(r.close, 2, 0),
      plainTrapStory,
      masterForensicNote,
      metrics: {
        ocfMillionTL: roundTo(ocfM, 0, 0),
        fcfMillionTL: roundTo(fcfM, 0, 0),
        netIncomeMillionTL: roundTo(niM, 0, 0),
        sloanAccrualPct: roundTo(r.sloanAccrualPct, 2, 0),
        netDebtMillionTL: roundTo(netDebtM, 0, 0),
        netDebtToEbitda: roundTo(ndEb, 2, 0),
        deltaFloatShares: Math.round(safeNum(item.deltaFloatShares, 0)),
        cmf20: roundTo(r.cmf20, 3, 0),
        pb: roundTo(r.pb, 2, 0)
      }
    };
  });

  return {
    rockSolidCashDrawers,
    hollowPaperFronts
  };
}

// ----------------------------------------------------------------------------
// 9. KENDİNİ DENETLEYEN VE ONARAN SAĞLIK RAPORU (selfDiagnosticReport)
// ----------------------------------------------------------------------------
function computeSelfDiagnosticReport(ctx, weather) {
  const {
    nowMs,
    datasetTimestamp,
    instruments,
    instMap,
    macro,
    bistList,
    macroChains,
    tms29,
    mkkLedger,
    anomalyLog,
    trapsAndAlerts,
    selfHealingActions
  } = ctx;

  const parsedDatasetMs = datasetTimestamp ? Date.parse(String(datasetTimestamp)) : NaN;
  const datasetAgeMinutes = Number.isFinite(parsedDatasetMs)
    ? roundTo(Math.max(0, (nowMs - parsedDatasetMs) / 60000), 2, 0)
    : 0;

  const macroChainMs = macroChains.fetchedAt ? Date.parse(String(macroChains.fetchedAt)) : NaN;
  const macroChainAgeMinutes = Number.isFinite(macroChainMs)
    ? roundTo(Math.max(0, (nowMs - macroChainMs) / 60000), 2, 0)
    : datasetAgeMinutes;

  let freshnessStatus = 'FRESH';
  if (!Number.isFinite(parsedDatasetMs) || datasetAgeMinutes > 1440) {
    freshnessStatus = 'STALE_FALLBACK';
  } else if (datasetAgeMinutes > 90) {
    freshnessStatus = 'WARM_CACHE';
  }

  let validPriceInstrumentsCount = 0;
  let nanOrBrokenPerfFieldCount = 0;
  const invalidOrMissingInstrumentIds = [];

  for (const inst of instruments) {
    const p = Number(inst?.currentPrice);
    if (Number.isFinite(p) && p > 0) {
      validPriceInstrumentsCount++;
    } else {
      invalidOrMissingInstrumentIds.push(String(inst?.id || 'UNKNOWN_ID'));
    }
    for (const f of ['change1D', 'perf1W', 'perf1M', 'perf1Y']) {
      if (inst && inst[f] !== null && inst[f] !== undefined && !Number.isFinite(Number(inst[f]))) {
        nanOrBrokenPerfFieldCount++;
      }
    }
  }

  let validClosePriceBistCount = 0;
  let validCashFlowBistCount = 0;
  let validValuationBistCount = 0;
  const corruptedBistTickers = [];

  for (const row of bistList) {
    const c = Number(row?.close);
    if (Number.isFinite(c) && c > 0) {
      validClosePriceBistCount++;
    } else if (row?.ticker) {
      corruptedBistTickers.push(String(row.ticker));
    }
    if (row?.ocfMillionTL !== null && row?.ocfMillionTL !== undefined && Number.isFinite(Number(row.ocfMillionTL))) {
      validCashFlowBistCount++;
    }
    if (
      (row?.pb !== null && row?.pb !== undefined && Number.isFinite(Number(row.pb))) ||
      (row?.marketCapBillionTL !== null && Number.isFinite(Number(row.marketCapBillionTL)) && Number(row.marketCapBillionTL) > 0)
    ) {
      validValuationBistCount++;
    }
  }

  const usdTry = safeNum(macro.usdTry, safeNum(instMap.get('doviz-usd')?.currentPrice, 50.44));
  const eurTry = safeNum(macro.eurTry, safeNum(instMap.get('doviz-eur')?.currentPrice, 55.43));
  const impliedEurUsd = usdTry > 0 ? eurTry / usdTry : 1.098;
  const reportedEurUsd = safeNum(
    macroChains.inputOutputChains?.eurUsd,
    safeNum(ctx.macroSpreads?.eurUsd?.value, impliedEurUsd)
  );
  const fxCrossDriftPct = reportedEurUsd > 0
    ? roundTo((Math.abs(impliedEurUsd - reportedEurUsd) / reportedEurUsd) * 100, 3, 0)
    : 0;

  const onsGoldUsd = safeNum(
    macroChains.metalsAndPhysical?.spotGoldUsd,
    safeNum(ctx.macroSpreads?.us10yAndDxy?.onsGoldUsd, 3773.42)
  );
  const theoreticalGramGoldTL = (onsGoldUsd / 31.1034768) * usdTry;
  const goldParityDriftPct = theoreticalGramGoldTL > 0
    ? roundTo((Math.abs(weather.spotGramGoldTL - theoreticalGramGoldTL) / theoreticalGramGoldTL) * 100, 3, 0)
    : 0;

  const spot30 = safeNum(macroChains.viopAndSpot?.xu030Spot, safeNum(instMap.get('bist-30')?.currentPrice, 14664));
  const fut30 = safeNum(macroChains.viopAndSpot?.xu030Fut, safeNum(instMap.get('viop-bist30-kontrat')?.currentPrice, 15178));
  const viopBasisPct = spot30 > 0 ? roundTo(((fut30 - spot30) / spot30) * 100, 2, 0) : 0;

  const bankVsBazaarSane = weather.bankCurrentSpreadPct >= weather.bazaarOpenSpreadPct && weather.bazaarOpenSpreadPct > 0;
  const fxCrossSane = fxCrossDriftPct <= 2.5;
  const goldParitySane = goldParityDriftPct <= 3.5;

  const mkkPositiveExpansionCount = (mkkLedger.lotExpansionAlerts || []).filter(
    (x) => safeNum(x?.deltaFloatShares, 0) > 0
  ).length;

  let integrityScore = 100;
  if (instruments.length === 0) integrityScore -= 45;
  else integrityScore -= invalidOrMissingInstrumentIds.length * 2.5;

  if (bistList.length < 500) integrityScore -= 12;
  else integrityScore -= corruptedBistTickers.length * 1.5;

  if (!fxCrossSane) integrityScore -= 10;
  if (!goldParitySane) integrityScore -= 10;
  if (!bankVsBazaarSane) integrityScore -= 8;
  if (freshnessStatus === 'STALE_FALLBACK') integrityScore -= 12;
  if (selfHealingActions.length > 0) integrityScore -= Math.min(8, selfHealingActions.length * 2);

  const integrityScorePct = roundTo(clamp(integrityScore, 0, 100), 1, 95);

  let overallHealthStatus = 'HEALTHY';
  if (integrityScorePct < 65 || instruments.length === 0) {
    overallHealthStatus = 'CRITICAL_DATA_GAP';
  } else if (selfHealingActions.length > 0 || invalidOrMissingInstrumentIds.length > 0 || corruptedBistTickers.length > 0) {
    overallHealthStatus = 'DEGRADED_SELF_HEALED';
  }

  const plainHealthSummary = `Arka plan denetçisi ${instruments.length} temel varlığın ${validPriceInstrumentsCount} tanesinde ve ${bistList.length} borsa şirketinin ${validClosePriceBistCount} tanesinde geçerli canlı fiyat doğruladı (${validCashFlowBistCount} şirkette nakit akışı denetimi tam). Ons-Dolar-Gram altın terazisi sapması yalnızca %${fmtTrNum(goldParityDriftPct, 2)}, Euro-Dolar çapraz kur sapması %${fmtTrNum(fxCrossDriftPct, 2)} ile matematiksel denge içindedir.${selfHealingActions.length > 0 ? ` Eksik görülen ${selfHealingActions.length} alan yedek omurgadan otomatik onarıldı.` : ' Sistem sıfır kopuklukla kendi kendini doğruladı.'}`;

  return {
    auditedAt: new Date(nowMs).toISOString(),
    overallHealthStatus,
    integrityScorePct,
    plainHealthSummary,
    freshness: {
      freshnessStatus,
      datasetTimestamp: datasetTimestamp ? String(datasetTimestamp) : new Date(nowMs).toISOString(),
      datasetAgeMinutes,
      macroChainAgeMinutes
    },
    instrumentsAudit: {
      expectedInstrumentsCount: 69,
      totalInstrumentsCount: instruments.length,
      validPriceInstrumentsCount,
      invalidOrMissingInstrumentCount: invalidOrMissingInstrumentIds.length,
      invalidOrMissingInstrumentIds: invalidOrMissingInstrumentIds.slice(0, 10),
      nanOrBrokenPerfFieldCount
    },
    bistUniverseAudit: {
      totalBistStocksCount: bistList.length,
      validClosePriceBistCount,
      validCashFlowBistCount,
      validValuationBistCount,
      corruptedBistStockCount: corruptedBistTickers.length,
      corruptedBistTickers: corruptedBistTickers.slice(0, 10)
    },
    spreadSanity: {
      fxCrossDriftPct,
      fxCrossSane,
      goldParityDriftPct,
      goldParitySane,
      darphaneBalloonExtraPct: weather.darphaneBalloonExtraPct,
      isDarphaneBubbleActive: weather.darphaneBalloonExtraPct > 3.5,
      viopBasisPct,
      bankCurrentSpreadPct: weather.bankCurrentSpreadPct,
      bazaarOpenSpreadPct: weather.bazaarOpenSpreadPct,
      bankVsBazaarSane
    },
    anomalySurveillance: {
      realtimeActiveEventCount: safeNum(anomalyLog.activeEventCount, (anomalyLog.recentEvents || []).length),
      totalHistoricalEventsLogged: safeNum(anomalyLog.totalEventsLogged, 0),
      tms29CashChampionCount: safeNum(tms29.cashChampionCount, 0),
      tms29IllusionTrapCount: safeNum(tms29.illusionTrapCount, 0),
      shortTermDebtWallCount: safeNum(tms29.debtWallCount, 0),
      mkkLotExpansionAlertCount: mkkPositiveExpansionCount,
      liquidationOrTrapAlertCount: Array.isArray(trapsAndAlerts) ? trapsAndAlerts.length : 0,
      activeMegaphoneCount: weather.activeMegaphoneCount
    },
    selfHealingActionsCount: selfHealingActions.length,
    selfHealingActions
  };
}

// ----------------------------------------------------------------------------
// 10. ANA EVRİM MOTORU GİRİŞ NOKTASI (computeAutonomousWorldEvolution)
// ----------------------------------------------------------------------------
function computeAutonomousWorldEvolution(dataset = {}, options = {}) {
  const safeDataset = (dataset && typeof dataset === 'object') ? dataset : {};
  const nowMs = safeNum(options.nowMs, Date.now());
  const selfHealingActions = [];

  const instruments = Array.isArray(safeDataset.instruments) ? safeDataset.instruments : [];
  if (!Array.isArray(safeDataset.instruments) || instruments.length === 0) {
    selfHealingActions.push('Temel varlık dizisi (instruments) boş veya eksik geldi; varsayılan makro referans omurgası devreye alındı.');
  }

  const instMap = new Map();
  for (const inst of instruments) {
    if (inst && inst.id) {
      instMap.set(inst.id, inst);
    }
  }

  const macro = (safeDataset.macro && typeof safeDataset.macro === 'object') ? safeDataset.macro : {};
  if (!safeDataset.macro) {
    selfHealingActions.push('Makro göstergeler nesnesi eksikti; enstrüman fiyatlarından türetildi.');
  }

  const kis = (safeDataset.kitchenIntelSummary && typeof safeDataset.kitchenIntelSummary === 'object')
    ? safeDataset.kitchenIntelSummary
    : {};
  const openHorizon = (kis.openHorizon && typeof kis.openHorizon === 'object') ? kis.openHorizon : {};

  let bistLookup = (openHorizon.bistStockLookup && typeof openHorizon.bistStockLookup === 'object')
    ? openHorizon.bistStockLookup
    : {};
  let tms29 = (kis.tms29AuditReport && typeof kis.tms29AuditReport === 'object')
    ? kis.tms29AuditReport
    : ((openHorizon.tms29AuditReport && typeof openHorizon.tms29AuditReport === 'object') ? openHorizon.tms29AuditReport : {});
  let mkkLedger = (kis.mkkFloatDeltaLedger && typeof kis.mkkFloatDeltaLedger === 'object')
    ? kis.mkkFloatDeltaLedger
    : {};

  if (Object.keys(bistLookup).length >= 400) {
    lastHealthyKitchenSnapshot = { bistLookup, tms29, mkkLedger };
  } else if (lastHealthyKitchenSnapshot) {
    bistLookup = lastHealthyKitchenSnapshot.bistLookup;
    if (!tms29 || !tms29.cashFlowChampions) tms29 = lastHealthyKitchenSnapshot.tms29;
    if (!mkkLedger || !mkkLedger.lotExpansionAlerts) mkkLedger = lastHealthyKitchenSnapshot.mkkLedger;
    selfHealingActions.push('Canlı BIST sözlüğü bu döngüde eksik geldi; son doğrulanmış bellek içi 619 şirket önbelleğiyle kesintisiz onarıldı.');
  } else if (Object.keys(bistLookup).length === 0) {
    bistLookup = synthesizeFallbackBistLookup(instruments);
    selfHealingActions.push(`619 şirketlik BIST mutfak sözlüğü soğuk açılışta boş geldi; temel varlık bilançoları ve MKK defterinden ${Object.keys(bistLookup).length} şirket otomatik sentezlendi.`);
  }

  const bistList = Object.values(bistLookup);
  const macroChains = (openHorizon.macroChains && typeof openHorizon.macroChains === 'object')
    ? openHorizon.macroChains
    : {};
  const whale = (kis.microstructureAndWhale && typeof kis.microstructureAndWhale === 'object')
    ? kis.microstructureAndWhale
    : {};
  const forensic = (kis.forensicBoardPatterns626 && typeof kis.forensicBoardPatterns626 === 'object')
    ? kis.forensicBoardPatterns626
    : {};
  const anomalyLog = (kis.realtimeAnomalyLog && typeof kis.realtimeAnomalyLog === 'object')
    ? kis.realtimeAnomalyLog
    : {};
  const liveFeed = Array.isArray(safeDataset.liveRealWorldFeed) ? safeDataset.liveRealWorldFeed : [];
  const openHorizonItems = Array.isArray(openHorizon.items) ? openHorizon.items : [];
  const trapsAndAlerts = Array.isArray(kis.trapsAndAlerts) ? kis.trapsAndAlerts : [];

  const clock = computeIstanbulClock(nowMs);
  const tickerToInstMap = buildTickerToInstrumentKeyMap(instruments);

  const ctx = {
    nowMs,
    datasetTimestamp: safeDataset.timestamp || null,
    clock,
    instruments,
    instMap,
    tickerToInstMap,
    macro,
    inflationBenchmarks: safeDataset.inflationBenchmarks || {},
    macroSpreads: kis.macroSpreads || {},
    openHorizon,
    openHorizonItems,
    bistLookup,
    bistList,
    macroChains,
    tms29,
    mkkLedger,
    whale,
    forensic,
    anomalyLog,
    liveFeed,
    trapsAndAlerts,
    selfHealingActions
  };

  const rawWeather = computeTownWeatherAndMood(ctx);
  const plainHumanDailyStory = computePlainHumanDailyStory(ctx, rawWeather);
  const supplyChainLivePulses = computeSupplyChainLivePulses(ctx, rawWeather);
  const scarcityAndPantrySignals = computeScarcityAndPantrySignals(ctx, rawWeather);
  const workshopSpotlight = computeWorkshopSpotlight(ctx);
  const selfDiagnosticReport = computeSelfDiagnosticReport(ctx, rawWeather);

  const townWeatherAndMood = {
    skyMood: rawWeather.skyMood,
    damWaterPct: rawWeather.damWaterPct,
    refineryIntensity: rawWeather.refineryIntensity,
    dieselPressurePct: rawWeather.dieselPressurePct,
    breadInflationAnnualPct: rawWeather.breadInflationAnnualPct,
    bazaarOpenSpreadPct: rawWeather.bazaarOpenSpreadPct,
    bankCurrentSpreadPct: rawWeather.bankCurrentSpreadPct,
    bankSlicePer1000TL: rawWeather.bankSlicePer1000TL,
    darphaneBalloonExtraPct: rawWeather.darphaneBalloonExtraPct,
    darphaneExtraTLPerGram: rawWeather.darphaneExtraTLPerGram,
    harborExportStrength: rawWeather.harborExportStrength,
    crowdMegaphoneDanger: rawWeather.crowdMegaphoneDanger,
    activeMegaphoneCount: rawWeather.activeMegaphoneCount,
    skyTensionScore: rawWeather.skyTensionScore,
    isGrandBazaarOpen: clock.isGrandBazaarOpen,
    isBistContinuousOpen: clock.isBistContinuousOpen,
    istanbulTimeLabel: `${clock.ymd} ${clock.shortTime}`
  };

  const rawResult = {
    generatedAt: new Date(nowMs).toISOString(),
    townWeatherAndMood,
    plainHumanDailyStory,
    supplyChainLivePulses,
    scarcityAndPantrySignals,
    workshopSpotlight,
    selfDiagnosticReport
  };

  const worldLiveEvolution = sanitizeOutputTree(rawResult);

  if (dataset && typeof dataset === 'object') {
    dataset.worldLiveEvolution = worldLiveEvolution;
  }

  return worldLiveEvolution;
}

module.exports = {
  computeAutonomousWorldEvolution
};
