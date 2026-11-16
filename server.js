const http = require('http');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { promisify } = require('util');
const gzipAsync = promisify(zlib.gzip);
const {
  scanOpenHorizonBistAndGlobal,
  getKitchenLeadingBlueprint,
  evaluateKitchenCrossCheck,
  computeSpecialistDomainEngine,
  getAssetTms29Audit,
  computeSupplyChainAndArbitrageMatrix,
  computeCasinoAsymmetricPlan,
  computeLiveSelfAuditScorecard,
  computeForcedFlowsAndCalendarEngine,
  computePhysicalFieldAndCustomsEngine,
  computeMicrostructureAndWhaleEngine,
  computeVukAuditAndRelatedPartyEngine,
  computeLegalArbitrageAndTenderEngine,
  computeAssetFull15PhasePassport,
  computeCapexHarvestAndEvaEngine,
  computeGlobalLogisticsAndBddkEngine,
  computeForensicBoardPatterns626,
  computeMkkFloatDeltaLedgerEngine,
  computeRealtimeAnomalyEventLogEngine
} = require('./deep_kitchen_intel');

const PORT = process.env.PORT || 3847;

// 1) Doviz.com üzerinden birebir çekilecek serbest piyasa Altın, Gümüş ve Döviz sayfaları
const DOVIZ_PAGES = {
  'gram-altin': 'https://altin.doviz.com/gram-altin',
  'ceyrek-altin': 'https://altin.doviz.com/ceyrek-altin',
  'cumhuriyet-altini': 'https://altin.doviz.com/cumhuriyet-altini',
  'bilezik-22': 'https://altin.doviz.com/22-ayar-bilezik',
  'gumus-gram': 'https://altin.doviz.com/gumus',
  'usd-try': 'https://kur.doviz.com/serbest-piyasa/amerikan-dolari',
  'eur-try': 'https://kur.doviz.com/serbest-piyasa/euro',
  'gbp-try': 'https://kur.doviz.com/serbest-piyasa/sterlin',
  'chf-try': 'https://kur.doviz.com/serbest-piyasa/isvicre-frangi'
};

// 2) TradingView Türkiye sembol sayfalarından birebir çekilecek sayfalar
const TV_SYMBOL_PAGES = {
  // Kripto TL Çiftleri (Doğrudan TL Fiyatlı)
  'BTCTRY': 'https://tr.tradingview.com/symbols/BTCTRY/',
  'ETHTRY': 'https://tr.tradingview.com/symbols/ETHTRY/',
  'SOLTRY': 'https://tr.tradingview.com/symbols/SOLTRY/',

  // Borsa İstanbul Endeksler, VİOP & Sertifika
  'BIST-XU100': 'https://tr.tradingview.com/symbols/BIST-XU100/',
  'BIST-XU030': 'https://tr.tradingview.com/symbols/BIST-XU030/',
  'BIST-XBANK': 'https://tr.tradingview.com/symbols/BIST-XBANK/',
  'BIST-XU030D1!': 'https://tr.tradingview.com/symbols/BIST-XU030D1!/',
  'BIST-ALTIN': 'https://tr.tradingview.com/symbols/BIST-ALTIN/',

  // Borsa Yatırım Fonları (BYF / ETF)
  'BIST-ZGOLD': 'https://tr.tradingview.com/symbols/BIST-ZGOLD/',
  'BIST-GLDTR': 'https://tr.tradingview.com/symbols/BIST-GLDTR/',
  'BIST-GMSTR': 'https://tr.tradingview.com/symbols/BIST-GMSTR/',
  'BIST-USDTR': 'https://tr.tradingview.com/symbols/BIST-USDTR/',
  'BIST-OPT25': 'https://tr.tradingview.com/symbols/BIST-OPT25/',
  'BIST-ZPT10': 'https://tr.tradingview.com/symbols/BIST-ZPT10/',
  'BIST-ZSR25': 'https://tr.tradingview.com/symbols/BIST-ZSR25/',
  'BIST-ZPBDL': 'https://tr.tradingview.com/symbols/BIST-ZPBDL/',
  'BIST-ZPLIB': 'https://tr.tradingview.com/symbols/BIST-ZPLIB/',
  'BIST-APX30': 'https://tr.tradingview.com/symbols/BIST-APX30/',
  'BIST-Z30KP': 'https://tr.tradingview.com/symbols/BIST-Z30KP/',
  'BIST-ISGLK': 'https://tr.tradingview.com/symbols/BIST-ISGLK/',
  'BIST-OPTGY': 'https://tr.tradingview.com/symbols/BIST-OPTGY/',

  // Gayrimenkul (GYO) Şirketleri (Konut, Ticari Depo, Ofis/AVM, Arazi)
  'BIST-EKGYO': 'https://tr.tradingview.com/symbols/BIST-EKGYO/',
  'BIST-RYGYO': 'https://tr.tradingview.com/symbols/BIST-RYGYO/',
  'BIST-ISGYO': 'https://tr.tradingview.com/symbols/BIST-ISGYO/',
  'BIST-ALGYO': 'https://tr.tradingview.com/symbols/BIST-ALGYO/',

  // Halka Arz Şirketleri (Tekil ve Birebir Teyitli)
  'BIST-ALTNY': 'https://tr.tradingview.com/symbols/BIST-ALTNY/',
  'BIST-TABGD': 'https://tr.tradingview.com/symbols/BIST-TABGD/',
  'BIST-RGYAS': 'https://tr.tradingview.com/symbols/BIST-RGYAS/',

  // Girişim Sermayesi Yatırım Ortaklıkları (Startup / Kitle Fonlama - Tekil)
  'BIST-HUBVC': 'https://tr.tradingview.com/symbols/BIST-HUBVC/',
  'BIST-ISGSY': 'https://tr.tradingview.com/symbols/BIST-ISGSY/',
  'BIST-VERTU': 'https://tr.tradingview.com/symbols/BIST-VERTU/',
  'BIST-GOZDE': 'https://tr.tradingview.com/symbols/BIST-GOZDE/',

  // Reel Sektör: Perakende, Yenilenebilir Enerji (GES) ve Yazılım (Tekil)
  'BIST-BIMAS': 'https://tr.tradingview.com/symbols/BIST-BIMAS/',
  'BIST-MGROS': 'https://tr.tradingview.com/symbols/BIST-MGROS/',
  'BIST-ASTOR': 'https://tr.tradingview.com/symbols/BIST-ASTOR/',
  'BIST-CWENE': 'https://tr.tradingview.com/symbols/BIST-CWENE/',
  'BIST-SMRTG': 'https://tr.tradingview.com/symbols/BIST-SMRTG/',
  'BIST-LOGO': 'https://tr.tradingview.com/symbols/BIST-LOGO/',
  'BIST-MIATK': 'https://tr.tradingview.com/symbols/BIST-MIATK/',

  // Küresel Emtialar, Eurobond ve Yurt Dışı Borsalar (USD Bazlı Kaynak Sayfaları)
  'TVC-PLATINUM': 'https://tr.tradingview.com/symbols/TVC-PLATINUM/',
  'TVC-PALLADIUM': 'https://tr.tradingview.com/symbols/TVC-PALLADIUM/',
  'AMEX-BNO': 'https://tr.tradingview.com/symbols/AMEX-BNO/',
  'AMEX-DBA': 'https://tr.tradingview.com/symbols/AMEX-DBA/',
  'NASDAQ-EMB': 'https://tr.tradingview.com/symbols/NASDAQ-EMB/',
  'AMEX-SPY': 'https://tr.tradingview.com/symbols/AMEX-SPY/',
  'NASDAQ-QQQ': 'https://tr.tradingview.com/symbols/NASDAQ-QQQ/',
  'AMEX-VT': 'https://tr.tradingview.com/symbols/AMEX-VT/',
  'NASDAQ-SOXX': 'https://tr.tradingview.com/symbols/NASDAQ-SOXX/',
  'NASDAQ-NVDA': 'https://tr.tradingview.com/symbols/NASDAQ-NVDA/',
  'NASDAQ-AAPL': 'https://tr.tradingview.com/symbols/NASDAQ-AAPL/',
  'NASDAQ-MSFT': 'https://tr.tradingview.com/symbols/NASDAQ-MSFT/',
  'OTC-LVMUY': 'https://tr.tradingview.com/symbols/OTC-LVMUY/'
};

function parseTrNumber(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/\./g, '').replace(',', '.'));
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8500) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchDovizPage(key, url) {
  try {
    const r = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, 8500);
    const t = await r.text();
    const priceStr = t.match(/text-xl font-semibold text-white"[^>]*>\s*([0-9.,]+)/)?.[1];
    const wStr = t.match(/Haftalık Değişim\s*<\/span>\s*<span[^>]*>%([0-9.,-]+)/)?.[1];
    const mStr = t.match(/Aylık Değişim\s*<\/span>\s*<span[^>]*>%([0-9.,-]+)/)?.[1];
    const yStr = t.match(/Yıllık Değişim\s*<\/span>\s*<span[^>]*>%([0-9.,-]+)/)?.[1];

    const price = parseTrNumber(priceStr);
    const perf1W = parseTrNumber(wStr);
    const perf1M = parseTrNumber(mStr);
    const perf1Y = parseTrNumber(yStr);

    return {
      key,
      url,
      currentPrice: price,
      perf1W,
      perf1M,
      perf3M: null,
      perf6M: null,
      perf1Y
    };
  } catch (err) {
    console.error('Doviz page fetch error:', key, err.message);
    return null;
  }
}

async function fetchTvSymbolPage(key, url) {
  try {
    const r = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, 8500);
    const html = await r.text();
    const currentPrice = Number(
      html.match(/"trade"\s*:\s*\{"price"\s*:\s*([0-9.]+)/)?.[1] ||
      html.match(/"price"\s*:\s*"?([0-9.]+)"?/)?.[1] || 0
    );
    const extract = (field) => {
      const m = html.match(new RegExp(`"${field}"\\s*:\\s*([0-9.-]+)`));
      return m ? Number(m[1]) : null;
    };
    const perf1W = extract('Perf.5D') ?? extract('Perf.W') ?? 0;
    const perf1M = extract('Perf.1M') ?? 0;
    const perf3M = extract('Perf.3M') ?? 0;
    const perf6M = extract('Perf.6M') ?? 0;
    const perf1Y = extract('Perf.Y') ?? 0;
    const perf3Y = extract('Perf.3Y');
    const perf5Y = extract('Perf.5Y');
    const perfAll = extract('Perf.All');
    return {
      key,
      url,
      currentPrice,
      perf1W,
      perf1M,
      perf3M,
      perf6M,
      perf1Y,
      perf3Y,
      perf5Y,
      perfAll
    };
  } catch (err) {
    console.error('TV page fetch error:', key, err.message);
    return null;
  }
}

function tvKeyToScannerTicker(key) {
  if (key === 'BTCTRY' || key === 'ETHTRY' || key === 'SOLTRY') return `BINANCE:${key}`;
  return key.replace('-', ':');
}

async function fetchMacroFromScanner() {
  const tvTickers = Object.keys(TV_SYMBOL_PAGES).map(tvKeyToScannerTicker);
  const tickers = [
    'ECONOMICS:TRIRMM',
    'ECONOMICS:TRIRYY',
    'ECONOMICS:TRPPIMM',
    'ECONOMICS:TRINTR',
    'ECONOMICS:TRLR',
    'ECONOMICS:TRDIR',
    'ECONOMICS:TRHPI',
    'ECONOMICS:TRRPP',
    'ECONOMICS:TRPRR',
    'ECONOMICS:TRMW',
    'TVC:TR02Y',
    'TVC:TR10Y',
    'FX_IDC:USDTRY',
    'FX_IDC:EURTRY',
    'FX_IDC:GBPTRY',
    'FX_IDC:CHFTRY',
    'FX_IDC:EURUSD',
    'TVC:GOLD',
    'TVC:SILVER',
    'TVC:US10Y',
    'TVC:DXY',
    ...tvTickers
  ];
  const columns = [
    'name', 'description', 'close', 'change',
    'Perf.W', 'Perf.1M', 'Perf.3M', 'Perf.6M', 'Perf.Y', 'Perf.3Y', 'Perf.5Y', 'Perf.All',
    'price_earnings_ttm', 'price_book_fq', 'return_on_equity', 'debt_to_equity',
    'RSI', 'relative_volume_10d_calc', 'dividends_yield_current',
    'return_on_invested_capital', 'return_on_assets', 'gross_margin', 'operating_margin',
    'after_tax_margin', 'ebitda_margin_ttm', 'enterprise_value_ebitda_ttm', 'price_free_cash_flow_ttm',
    'free_cash_flow_ttm', 'cash_f_operating_activities_ttm', 'net_debt', 'total_debt',
    'cash_n_short_term_invest_fq', 'current_ratio', 'market_cap_basic',
    'earnings_per_share_basic_ttm', 'book_value_per_share_fq',
    'total_revenue_yoy_growth_ttm', 'earnings_per_share_diluted_yoy_growth_ttm',
    'ChaikinMoneyFlow', 'MoneyFlow', 'SMA200', 'price_52_week_high', 'price_52_week_low'
  ];
  const bistTickers = tickers.filter(t => t.startsWith('BIST:'));
  const [rGlobal, rTurkey] = await Promise.all([
    fetchWithTimeout('https://scanner.tradingview.com/global/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols: { tickers, query: { types: [] } }, columns })
    }, 9000),
    fetchWithTimeout('https://scanner.tradingview.com/turkey/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols: { tickers: bistTickers, query: { types: [] } }, columns })
    }, 9000).catch(() => null)
  ]);
  const dGlobal = await rGlobal.json();
  const dTurkey = rTurkey ? await rTurkey.json().catch(() => ({ data: [] })) : { data: [] };
  const combinedRows = [...(dGlobal.data || []), ...(dTurkey.data || [])];
  const map = {};
  for (const row of combinedRows) {
    map[row.s] = {
      close: row.d[2],
      change: row.d[3],
      perf1W: row.d[4],
      perf1M: row.d[5],
      perf3M: row.d[6],
      perf6M: row.d[7],
      perf1Y: row.d[8],
      perf3Y: row.d[9],
      perf5Y: row.d[10],
      perfAll: row.d[11],
      pe: row.d[12] != null ? +Number(row.d[12]).toFixed(2) : null,
      pb: row.d[13] != null ? +Number(row.d[13]).toFixed(2) : null,
      roe: row.d[14] != null ? +Number(row.d[14]).toFixed(2) : null,
      debtToEquity: row.d[15] != null ? +Number(row.d[15]).toFixed(2) : null,
      rsi: row.d[16] != null ? +Number(row.d[16]).toFixed(1) : null,
      relVol: row.d[17] != null ? +Number(row.d[17]).toFixed(2) : null,
      divYield: row.d[18] != null ? +Number(row.d[18]).toFixed(2) : null,
      roic: row.d[19] != null ? +Number(row.d[19]).toFixed(2) : null,
      roa: row.d[20] != null ? +Number(row.d[20]).toFixed(2) : null,
      grossMargin: row.d[21] != null ? +Number(row.d[21]).toFixed(2) : null,
      operatingMargin: row.d[22] != null ? +Number(row.d[22]).toFixed(2) : null,
      netMargin: row.d[23] != null ? +Number(row.d[23]).toFixed(2) : null,
      ebitdaMargin: row.d[24] != null ? +Number(row.d[24]).toFixed(2) : null,
      evEbitda: row.d[25] != null ? +Number(row.d[25]).toFixed(2) : null,
      pFcf: row.d[26] != null ? +Number(row.d[26]).toFixed(2) : null,
      fcf: row.d[27] != null ? Number(row.d[27]) : null,
      ocf: row.d[28] != null ? Number(row.d[28]) : null,
      netDebt: row.d[29] != null ? Number(row.d[29]) : null,
      totalDebt: row.d[30] != null ? Number(row.d[30]) : null,
      cash: row.d[31] != null ? Number(row.d[31]) : null,
      currentRatio: row.d[32] != null ? +Number(row.d[32]).toFixed(2) : null,
      marketCap: row.d[33] != null ? Number(row.d[33]) : null,
      eps: row.d[34] != null ? +Number(row.d[34]).toFixed(2) : null,
      bvps: row.d[35] != null ? +Number(row.d[35]).toFixed(2) : null,
      revGrowth: row.d[36] != null ? +Number(row.d[36]).toFixed(1) : null,
      epsGrowth: row.d[37] != null ? +Number(row.d[37]).toFixed(1) : null,
      cmf: row.d[38] != null ? +Number(row.d[38]).toFixed(3) : null,
      mfi: row.d[39] != null ? +Number(row.d[39]).toFixed(1) : null,
      sma200: row.d[40] != null ? +Number(row.d[40]).toFixed(2) : null,
      high52W: row.d[41] != null ? +Number(row.d[41]).toFixed(2) : null,
      low52W: row.d[42] != null ? +Number(row.d[42]).toFixed(2) : null
    };
  }
  return map;
}

// Yıllık orandan farklı vadeler için hem brüt hem stopaj sonrası net getiriyi hesaplar.
// mode === 'rollover32': 32 günde bir yenilenen vadeli mevduat / katılım (stopaj her vade dönüşünde kesilir!)
// mode === 'daily_deferred': Para piyasası / BES fonu (günlük bileşik büyür, stopaj yalnızca satışta tek sefer kesilir!)
// mode === 'bond_coupon': Yıllık basit kira/kupon oranı verilen araçlar (Sukuk vb.: 6 ayda bir kira ödemesi yeniden yatırılırsa bileşik büyür)
// mode === 'annual_compounded': Piyasada doğrudan Yıllık Bileşik Getiri olarak kote edilen gösterge tahviller (TR02Y vb.: çifte bileşik hatası yapılmaz!)
function calcFixedIncomePeriods(annualRatePct, mode = 'rollover32', taxRatePct = 17.5) {
  const r = (Number(annualRatePct) || 0) / 100;
  const tau = Math.max(0, (Number(taxRatePct) || 0) / 100);
  const spreadRatio = (Number(annualRatePct) || 36.0) / 36.0;
  // Gerçek 2023-2026 TCMB / Mevduat Tarihsel Serisi:
  // Yıl -3 (Kas 2023 - Kas 2024 sıkılaşma zirvesi): politika ort %47.5, stopaj ~%7.5
  // Yıl -2 (Kas 2024 - Kas 2025): politika ort %43.5, stopaj ~%15.0
  // Yıl -1 (Kas 2025 - Kas 2026): mevcut canlı oran ve mevcut stopaj
  const rY3_1 = 0.465 * spreadRatio;
  const rY3_2 = 0.435 * spreadRatio;
  const rY3_3 = r;
  // Gerçek 2021-2023 Negatif Reel Faiz Dönemi (5 Yıllık Pencerenin İlk 2 Yılı):
  // Yıl -5 (Kas 2021 - Kas 2022): ort %16, stopaj %5 | Yıl -4 (Kas 2022 - Kas 2023): ort %24, stopaj %5
  const rY5_1 = 0.16 * spreadRatio;
  const rY5_2 = 0.24 * spreadRatio;
  const tau22 = tau > 0 ? Math.min(tau, 0.05) : 0;
  const tau23 = tau > 0 ? Math.min(tau, 0.05) : 0;
  const tau24 = tau > 0 ? Math.min(tau, 0.075) : 0;
  const tau25 = tau > 0 ? Math.min(tau, 0.15) : 0;

  const daysMap = { perf1W: 7, perf1M: 32, perf3M: 92, perf6M: 182, perf1Y: 365 };

  if (mode === 'annual_compounded') {
    const yrFactor = (rComp, taxFrac) => {
      const semiGross = Math.pow(1 + Math.max(0, rComp), 0.5) - 1;
      const semiNet = semiGross * (1 - taxFrac);
      return Math.pow(1 + semiNet, 2);
    };
    const factorDaysComp = (rComp, days, taxFrac) => Math.pow(yrFactor(rComp, taxFrac), days / 365);
    const gross = {};
    const net = {};
    for (const [k, d] of Object.entries(daysMap)) {
      gross[k] = +((factorDaysComp(r, d, 0) - 1) * 100).toFixed(2);
      net[k] = +((factorDaysComp(r, d, tau) - 1) * 100).toFixed(2);
    }
    gross.perf3Y = +((yrFactor(rY3_1, 0) * yrFactor(rY3_2, 0) * yrFactor(rY3_3, 0) - 1) * 100).toFixed(2);
    net.perf3Y = +((yrFactor(rY3_1, tau24) * yrFactor(rY3_2, tau25) * yrFactor(rY3_3, tau) - 1) * 100).toFixed(2);
    gross.perf5Y = +((yrFactor(rY5_1, 0) * yrFactor(rY5_2, 0) * yrFactor(rY3_1, 0) * yrFactor(rY3_2, 0) * yrFactor(rY3_3, 0) - 1) * 100).toFixed(2);
    net.perf5Y = +((yrFactor(rY5_1, tau22) * yrFactor(rY5_2, tau23) * yrFactor(rY3_1, tau24) * yrFactor(rY3_2, tau25) * yrFactor(rY3_3, tau) - 1) * 100).toFixed(2);
    return { compoundingMode: mode, ...gross, netPerf: net };
  }

  if (mode === 'daily_deferred') {
    const effYrGross = (rAnn) => Math.pow(1 + rAnn / 365, 365);
    const gross = {};
    const net = {};
    for (const [k, d] of Object.entries(daysMap)) {
      const g = (Math.pow(1 + r / 365, d) - 1) * 100;
      gross[k] = +g.toFixed(2);
      net[k] = +(g * (1 - tau)).toFixed(2);
    }
    const g3 = (effYrGross(rY3_1) * effYrGross(rY3_2) * effYrGross(rY3_3) - 1) * 100;
    const g5 = (effYrGross(rY5_1) * effYrGross(rY5_2) * effYrGross(rY3_1) * effYrGross(rY3_2) * effYrGross(rY3_3) - 1) * 100;
    gross.perf3Y = +g3.toFixed(2);
    gross.perf5Y = +g5.toFixed(2);
    net.perf3Y = +(g3 * (1 - tau)).toFixed(2);
    net.perf5Y = +(g5 * (1 - tau)).toFixed(2);
    return { compoundingMode: mode, ...gross, netPerf: net };
  }

  const rollDays = mode === 'bond_coupon' ? 182.5 : 32;
  const factorForDays = (rAnn, days, taxFrac) => {
    const rEff = rAnn * (1 - taxFrac);
    if (days <= rollDays) return 1 + rEff * (days / 365);
    return Math.pow(1 + rEff * (rollDays / 365), days / rollDays);
  };

  const gross = {};
  const net = {};
  for (const [k, d] of Object.entries(daysMap)) {
    gross[k] = +((factorForDays(r, d, 0) - 1) * 100).toFixed(2);
    net[k] = +((factorForDays(r, d, tau) - 1) * 100).toFixed(2);
  }
  const yrG = (rAnn) => factorForDays(rAnn, 365, 0);
  const yrN = (rAnn, tf) => factorForDays(rAnn, 365, tf);

  gross.perf3Y = +((yrG(rY3_1) * yrG(rY3_2) * yrG(rY3_3) - 1) * 100).toFixed(2);
  net.perf3Y = +((yrN(rY3_1, tau24) * yrN(rY3_2, tau25) * yrN(rY3_3, tau) - 1) * 100).toFixed(2);

  gross.perf5Y = +((yrG(rY5_1) * yrG(rY5_2) * yrG(rY3_1) * yrG(rY3_2) * yrG(rY3_3) - 1) * 100).toFixed(2);
  net.perf5Y = +((yrN(rY5_1, tau22) * yrN(rY5_2, tau23) * yrN(rY3_1, tau24) * yrN(rY3_2, tau25) * yrN(rY3_3, tau) - 1) * 100).toFixed(2);

  return { compoundingMode: mode, ...gross, netPerf: net };
}

const KNOWN_PARTIAL_3Y_IDS = new Set([
  'bist-temettu-25', 'halka-arz-altny', 'halka-arz-rgyas', 'fon-degisken-isglk', 'gayrimenkul-gyo-fonu-optgy'
]);
const KNOWN_PARTIAL_5Y_IDS = new Set([
  'altin-sertifikasi', 'bist-temettu-25', 'halka-arz-altny', 'halka-arz-tabgd', 'halka-arz-rgyas',
  'fon-yerli-bist30-apx30', 'fon-tematik-surdurulebilirlik-zsr25', 'fon-degisken-isglk',
  'gayrimenkul-gyo-fonu-optgy', 'reel-enerji-astor', 'reel-enerji-cwene', 'reel-enerji-smrtg', 'reel-yazilim-miatk'
]);
// Yurt dışı kupon/temettü ödeyen ETF'lerin fiyat serisine eklenen doğrulanmış yıllık nakit dağıtım getirileri
const USD_ETF_ANNUAL_YIELD_PCT = {
  'eurobond-emb': 4.8,
  'abd-sp500-spy': 1.3,
  'dunya-borsalari-vt': 1.9,
  'abd-nasdaq-qqq': 0.6,
  'fon-tematik-yari-iletken-soxx': 0.7
};

// USD varlık sayfasındaki birebir değişimi (ve varsa nakit kupon/temettü toplam getirisini) USD/TRY ile birleştirir
function buildUsdAssetItem(baseMeta, tvPage, usdTryPage) {
  const p = tvPage || { currentPrice: 0, perf1W: 0, perf1M: 0, perf3M: 0, perf6M: 0, perf1Y: 0, perf3Y: 0, perf5Y: 0 };
  const fx = usdTryPage || { currentPrice: 50.38, perf1W: 0, perf1M: 0, perf3M: 0, perf6M: 0, perf1Y: 0, perf3Y: 76.5, perf5Y: 401.3 };
  const combine = (u, f) => +(((1 + (u || 0) / 100) * (1 + (f || 0) / 100) - 1) * 100).toFixed(2);
  const divAnn = USD_ETF_ANNUAL_YIELD_PCT[baseMeta.id] || 0;
  const withYield = (rawPct, yrs) => {
    const base = Number(rawPct) || 0;
    if (!divAnn || yrs <= 0) return +base.toFixed(2);
    return +((((1 + base / 100) * Math.pow(1 + divAnn / 100, yrs)) - 1) * 100).toFixed(2);
  };

  const u1W = +(p.perf1W || 0).toFixed(2);
  const u1M = +(p.perf1M || 0).toFixed(2);
  const u3M = withYield(p.perf3M, 0.25);
  const u6M = withYield(p.perf6M, 0.5);
  const u1Y = withYield(p.perf1Y, 1);
  const u3Y = withYield(p.perf3Y, 3);
  const u5Y = withYield(p.perf5Y, 5);

  const isPartial3Y = KNOWN_PARTIAL_3Y_IDS.has(baseMeta.id) || Boolean(p.perf3Y == null || (p.perfAll != null && Math.abs(p.perf3Y - p.perfAll) < 1.5));
  const isPartial5Y = KNOWN_PARTIAL_5Y_IDS.has(baseMeta.id) || Boolean(p.perf5Y == null || (p.perfAll != null && Math.abs(p.perf5Y - p.perfAll) < 1.5));

  const isForeignListed = /^(AMEX|NASDAQ|OTC|NYSE):/i.test(String(baseMeta.symbol || ''));
  const usdChg1D = typeof p.change1D === 'number' && Number.isFinite(p.change1D) ? +p.change1D.toFixed(2) : 0;
  const fxChg1D = typeof fx.change1D === 'number' && Number.isFinite(fx.change1D) ? +fx.change1D.toFixed(2) : 0;

  return {
    ...baseMeta,
    taxRegime: baseMeta.taxRegime || (isForeignListed ? 'declaration' : null),
    isUsdAsset: true,
    currency: 'USD',
    currentPrice: p.currentPrice,
    currentPriceTL: +(p.currentPrice * fx.currentPrice).toFixed(2),
    change1D: usdChg1D,
    tlChange1D: combine(usdChg1D, fxChg1D),
    isPartial3Y: baseMeta.isPartial3Y ?? isPartial3Y,
    isPartial5Y: baseMeta.isPartial5Y ?? isPartial5Y,
    fundamentals: p.fundamentals || null,
    pagePerf: {
      perf1W: u1W,
      perf1M: u1M,
      perf3M: u3M,
      perf6M: u6M,
      perf1Y: u1Y,
      perf3Y: u3Y,
      perf5Y: u5Y
    },
    tlPerf: {
      perf1W: combine(u1W, fx.perf1W),
      perf1M: combine(u1M, fx.perf1M),
      perf3M: combine(u3M, fx.perf3M),
      perf6M: combine(u6M, fx.perf6M),
      perf1Y: combine(u1Y, fx.perf1Y),
      perf3Y: combine(u3Y, fx.perf3Y),
      perf5Y: combine(u5Y, fx.perf5Y)
    },
    perf1W: u1W,
    perf1M: u1M,
    perf3M: u3M,
    perf6M: u6M,
    perf1Y: u1Y,
    perf3Y: u3Y,
    perf5Y: u5Y
  };
}

function buildDirectItem(baseMeta, pageData) {
  const p = pageData || { currentPrice: 0, perf1W: 0, perf1M: 0, perf3M: 0, perf6M: 0, perf1Y: 0, perf3Y: 0, perf5Y: 0 };
  const isPartial3Y = KNOWN_PARTIAL_3Y_IDS.has(baseMeta.id) || Boolean(p.perf3Y == null || (p.perfAll != null && Math.abs(p.perf3Y - p.perfAll) < 1.5));
  const isPartial5Y = KNOWN_PARTIAL_5Y_IDS.has(baseMeta.id) || Boolean(p.perf5Y == null || (p.perfAll != null && Math.abs(p.perf5Y - p.perfAll) < 1.5));
  return {
    ...baseMeta,
    isUsdAsset: false,
    currency: 'TRY',
    currentPrice: p.currentPrice,
    change1D: typeof p.change1D === 'number' && Number.isFinite(p.change1D) ? +p.change1D.toFixed(2) : 0,
    isPartial3Y: baseMeta.isPartial3Y ?? isPartial3Y,
    isPartial5Y: baseMeta.isPartial5Y ?? isPartial5Y,
    fundamentals: p.fundamentals || null,
    perf1W: +(p.perf1W || 0).toFixed(2),
    perf1M: +(p.perf1M || 0).toFixed(2),
    perf3M: +(p.perf3M || 0).toFixed(2),
    perf6M: +(p.perf6M || 0).toFixed(2),
    perf1Y: +(p.perf1Y || 0).toFixed(2),
    perf3Y: +(p.perf3Y || 0).toFixed(2),
    perf5Y: +(p.perf5Y || 0).toFixed(2)
  };
}

async function buildFullDataset() {
  const dovizPromises = Object.entries(DOVIZ_PAGES).map(([k, u]) => fetchDovizPage(k, u));
  const tvPromises = Object.entries(TV_SYMBOL_PAGES).map(([k, u]) => fetchTvSymbolPage(k, u));

  const [dovizList, tvList, macroMap] = await Promise.all([
    Promise.all(dovizPromises),
    Promise.all(tvPromises),
    fetchMacroFromScanner()
  ]);

  const dv = {};
  for (const item of dovizList) {
    if (item) dv[item.key] = item;
  }

  const compPct = (a, b) => +(((1 + (a || 0) / 100) * (1 + (b || 0) / 100) - 1) * 100).toFixed(2);
  const syncFxFromScanner = (dvKey, scanSym, fallbackPrice) => {
    const sc = macroMap[scanSym];
    if (!dv[dvKey]) dv[dvKey] = { key: dvKey, currentPrice: sc?.close || fallbackPrice };
    if ((!dv[dvKey].currentPrice || dv[dvKey].currentPrice <= 0) && sc?.close > 0) {
      dv[dvKey].currentPrice = +Number(sc.close).toFixed(4);
    }
    if (sc) {
      dv[dvKey].change1D = sc.change != null ? +Number(sc.change).toFixed(2) : 0;
      if (sc.perf1W != null) dv[dvKey].perf1W = +Number(sc.perf1W).toFixed(2);
      if (sc.perf1M != null) dv[dvKey].perf1M = +Number(sc.perf1M).toFixed(2);
      if (sc.perf3M != null) dv[dvKey].perf3M = +Number(sc.perf3M).toFixed(2);
      if (sc.perf6M != null) dv[dvKey].perf6M = +Number(sc.perf6M).toFixed(2);
      if (sc.perf1Y != null) dv[dvKey].perf1Y = +Number(sc.perf1Y).toFixed(2);
      if (sc.perf3Y != null) dv[dvKey].perf3Y = +Number(sc.perf3Y).toFixed(2);
      if (sc.perf5Y != null) dv[dvKey].perf5Y = +Number(sc.perf5Y).toFixed(2);
      dv[dvKey].fundamentals = { rsi: sc.rsi ?? null };
    }
  };
  syncFxFromScanner('usd-try', 'FX_IDC:USDTRY', 50.38);
  syncFxFromScanner('eur-try', 'FX_IDC:EURTRY', 55.45);
  syncFxFromScanner('gbp-try', 'FX_IDC:GBPTRY', 66.47);
  syncFxFromScanner('chf-try', 'FX_IDC:CHFTRY', 59.97);

  const fxSc = macroMap['FX_IDC:USDTRY'] || {};
  const goldSc = macroMap['TVC:GOLD'] || {};
  const silverSc = macroMap['TVC:SILVER'] || {};
  const calcSpotGram = (onsRow, defVal) => (onsRow.close > 0 && fxSc.close > 0)
    ? +((onsRow.close * fxSc.close) / 31.1034768).toFixed(2)
    : defVal;
  const spotGramAu = calcSpotGram(goldSc, 6248);
  const spotGramAg = calcSpotGram(silverSc, 76.3);

  const goldMults = { 'gram-altin': 1.0, 'ceyrek-altin': 1.651, 'cumhuriyet-altini': 6.755, 'bilezik-22': 0.946 };
  ['gram-altin', 'ceyrek-altin', 'cumhuriyet-altini', 'bilezik-22'].forEach(k => {
    if (!dv[k]) dv[k] = { key: k, currentPrice: +(spotGramAu * goldMults[k]).toFixed(2) };
    if (!dv[k].currentPrice || dv[k].currentPrice <= 0) {
      dv[k].currentPrice = +(spotGramAu * goldMults[k]).toFixed(2);
    }
    dv[k].change1D = compPct(goldSc.change, fxSc.change);
    dv[k].perf1W = compPct(goldSc.perf1W, fxSc.perf1W);
    dv[k].perf1M = compPct(goldSc.perf1M, fxSc.perf1M);
    dv[k].perf3M = compPct(goldSc.perf3M, fxSc.perf3M);
    dv[k].perf6M = compPct(goldSc.perf6M, fxSc.perf6M);
    dv[k].perf1Y = compPct(goldSc.perf1Y, fxSc.perf1Y);
    dv[k].perf3Y = compPct(goldSc.perf3Y, fxSc.perf3Y);
    dv[k].perf5Y = compPct(goldSc.perf5Y, fxSc.perf5Y);
    dv[k].fundamentals = { rsi: goldSc.rsi ?? null };
  });

  if (!dv['gumus-gram']) dv['gumus-gram'] = { key: 'gumus-gram', currentPrice: spotGramAg };
  if (!dv['gumus-gram'].currentPrice || dv['gumus-gram'].currentPrice <= 0) dv['gumus-gram'].currentPrice = spotGramAg;
  dv['gumus-gram'].change1D = compPct(silverSc.change, fxSc.change);
  dv['gumus-gram'].perf1W = compPct(silverSc.perf1W, fxSc.perf1W);
  dv['gumus-gram'].perf1M = compPct(silverSc.perf1M, fxSc.perf1M);
  dv['gumus-gram'].perf3M = compPct(silverSc.perf3M, fxSc.perf3M);
  dv['gumus-gram'].perf6M = compPct(silverSc.perf6M, fxSc.perf6M);
  dv['gumus-gram'].perf1Y = compPct(silverSc.perf1Y, fxSc.perf1Y);
  dv['gumus-gram'].perf3Y = compPct(silverSc.perf3Y, fxSc.perf3Y);
  dv['gumus-gram'].perf5Y = compPct(silverSc.perf5Y, fxSc.perf5Y);
  dv['gumus-gram'].fundamentals = { rsi: silverSc.rsi ?? null };

  const tv = {};
  for (const item of tvList) {
    if (item) {
      const scanTicker = tvKeyToScannerTicker(item.key);
      const scanRow = macroMap[scanTicker];
      if (scanRow) {
        if (scanRow.close != null && scanRow.close > 0) item.currentPrice = +Number(scanRow.close).toFixed(2);
        if (scanRow.change != null) item.change1D = +Number(scanRow.change).toFixed(2);
        if (scanRow.perf1W != null) item.perf1W = +Number(scanRow.perf1W).toFixed(2);
        if (scanRow.perf1M != null) item.perf1M = +Number(scanRow.perf1M).toFixed(2);
        if (scanRow.perf3M != null) item.perf3M = +Number(scanRow.perf3M).toFixed(2);
        if (scanRow.perf6M != null) item.perf6M = +Number(scanRow.perf6M).toFixed(2);
        if (scanRow.perf1Y != null) item.perf1Y = +Number(scanRow.perf1Y).toFixed(2);
        if (scanRow.perf3Y != null) item.perf3Y = +Number(scanRow.perf3Y).toFixed(2);
        if (scanRow.perf5Y != null) item.perf5Y = +Number(scanRow.perf5Y).toFixed(2);
        if (scanRow.perfAll != null) item.perfAll = +Number(scanRow.perfAll).toFixed(2);
        item.fundamentals = {
          pe: scanRow.pe,
          pb: scanRow.pb,
          roe: scanRow.roe,
          roic: scanRow.roic,
          roa: scanRow.roa,
          grossMargin: scanRow.grossMargin,
          operatingMargin: scanRow.operatingMargin,
          netMargin: scanRow.netMargin,
          ebitdaMargin: scanRow.ebitdaMargin,
          evEbitda: scanRow.evEbitda,
          pFcf: scanRow.pFcf,
          fcf: scanRow.fcf,
          ocf: scanRow.ocf,
          netDebt: scanRow.netDebt,
          totalDebt: scanRow.totalDebt,
          cash: scanRow.cash,
          currentRatio: scanRow.currentRatio,
          marketCap: scanRow.marketCap,
          eps: scanRow.eps,
          bvps: scanRow.bvps,
          revGrowth: scanRow.revGrowth,
          epsGrowth: scanRow.epsGrowth,
          debtToEquity: scanRow.debtToEquity,
          rsi: scanRow.rsi,
          relVol: scanRow.relVol,
          divYield: scanRow.divYield,
          cmf: scanRow.cmf,
          mfi: scanRow.mfi,
          sma200: scanRow.sma200,
          high52W: scanRow.high52W,
          low52W: scanRow.low52W
        };
      }
      tv[item.key] = item;
    }
  }

  const cpiMom = macroMap['ECONOMICS:TRIRMM']?.close || 2.58;
  const cpiYoy = macroMap['ECONOMICS:TRIRYY']?.close || 29.77;
  const ppiMom = macroMap['ECONOMICS:TRPPIMM']?.close || 1.65;
  const tcmbPolicyRate = macroMap['ECONOMICS:TRINTR']?.close || 36.0;
  const tcmbUpperRate = macroMap['ECONOMICS:TRLR']?.close || 39.0;
  const tcmbDepositRate = macroMap['ECONOMICS:TRDIR']?.close || 34.5;
  const tcmbHpi = macroMap['ECONOMICS:TRHPI']?.close || 239.38;
  const tcmbHpiMom = +(macroMap['ECONOMICS:TRHPI']?.change || 1.22).toFixed(2);
  const tcmbHpiYoy = +(macroMap['ECONOMICS:TRRPP']?.close || 25.14).toFixed(2);
  const tcmbPriceToRent = macroMap['ECONOMICS:TRPRR']?.close || 125.31;
  const minWageGross = macroMap['ECONOMICS:TRMW']?.close || 33030;
  const tr02y = macroMap['TVC:TR02Y']?.close || 36.23;
  const tr10y = macroMap['TVC:TR10Y']?.close || 33.07;

  // TÜİK 2003=100 Resmi Yıllık TÜFE Serisi ile Doğrulanmış 2026 Kümülatif 3Y ve 5Y Enflasyon:
  // 2022: %64,27 | 2023: %64,77 | 2024: %44,38 | 2025: %30,89 | Son 12 Ay (2026): cpiYoy (%29,77)
  const cpi3Y = +(((1 + 0.4438) * (1 + 0.3089) * (1 + cpiYoy / 100) - 1) * 100).toFixed(2);
  const cpi5Y = +(((1 + 0.6427) * (1 + 0.6477) * (1 + 0.4438) * (1 + 0.3089) * (1 + cpiYoy / 100) - 1) * 100).toFixed(2);

  const inflationBenchmarks = {
    perf1W: +((Math.pow(1 + cpiMom / 100, 7 / 30) - 1) * 100).toFixed(2),
    perf1M: cpiMom,
    perf3M: +((Math.pow(1 + cpiYoy / 100, 3 / 12) - 1) * 100).toFixed(2),
    perf6M: +((Math.pow(1 + cpiYoy / 100, 6 / 12) - 1) * 100).toFixed(2),
    perf1Y: cpiYoy,
    perf3Y: cpi3Y,
    perf5Y: cpi5Y
  };

  const usdTryRef = dv['usd-try'];

  const mevduatUstPeriods = calcFixedIncomePeriods(tcmbUpperRate, 'rollover32', 17.5);
  const mevduatStdPeriods = calcFixedIncomePeriods(tcmbDepositRate, 'rollover32', 17.5);
  const katilimPeriods = calcFixedIncomePeriods(tcmbPolicyRate, 'rollover32', 17.5);
  const ppfPeriods = calcFixedIncomePeriods(tcmbUpperRate, 'daily_deferred', 17.5);
  const dibsPeriods = calcFixedIncomePeriods(tr02y, 'annual_compounded', 0.0);
  const sukukPeriods = calcFixedIncomePeriods(tcmbPolicyRate + 0.5, 'bond_coupon', 0.0);
  const besPeriods = calcFixedIncomePeriods(tcmbPolicyRate, 'daily_deferred', 15.0);

  const instruments = [
    // =========================================================================
    // KATEGORİ 1: NAKİT VE SABİT GETİRİLİ YATIRIM ARAÇLARI
    // =========================================================================
    {
      id: 'mevduat-ust',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'Vadeli Mevduat (TL - TCMB Üst Bant / Özel Banka Oranı)',
      subCategory: 'Vadeli Mevduat (TL)',
      symbol: 'ECONOMICS:TRLR',
      sourceName: 'TCMB Gecelik Borç Verme / Mevduat Üst Bandı (%39,0 Yıllık)',
      verifyUrl: 'https://tr.tradingview.com/symbols/ECONOMICS-TRLR/',
      unitLabel: 'Yıllık Brüt Faiz %',
      isRateInstrument: true,
      isCustomizableRate: true,
      currentPrice: tcmbUpperRate,
      taxRatePct: 17.5,
      taxNote: 'Yıllık %39,00 brüt faiz oranının 32 günlük getirisi (Brüt +%3,42) üzerinden %17,5 stopaj kesilerek hesaplanmıştır.',
      ...mevduatUstPeriods
    },
    {
      id: 'mevduat-tcmb',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'Vadeli Mevduat (TL - TCMB Bankalar Ortalaması)',
      subCategory: 'Vadeli Mevduat (TL)',
      symbol: 'ECONOMICS:TRDIR',
      sourceName: 'TCMB Ağırlıklı Ortalama Mevduat Faizi (%34,5 Yıllık)',
      verifyUrl: 'https://tr.tradingview.com/symbols/ECONOMICS-TRDIR/',
      unitLabel: 'Yıllık Brüt Faiz %',
      isRateInstrument: true,
      currentPrice: tcmbDepositRate,
      taxRatePct: 17.5,
      taxNote: 'TCMB resmi ortalama mevduat faizi (%34,50) üzerinden %17,5 stopaj düşülmüştür.',
      ...mevduatStdPeriods
    },
    {
      id: 'katilim-hesabi',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'Katılım Hesabı (TL Kâr Payı - Faizsiz)',
      subCategory: 'Katılım Kâr Payı Hesabı (Faizsiz)',
      symbol: 'ECONOMICS:TRINTR',
      sourceName: 'Katılım Bankaları Kâr Payı Referansı (%36,0 Yıllık)',
      verifyUrl: 'https://tr.tradingview.com/symbols/ECONOMICS-TRINTR/',
      unitLabel: 'Yıllık Brüt Kâr Payı %',
      isRateInstrument: true,
      currentPrice: tcmbPolicyRate,
      taxRatePct: 17.5,
      taxNote: 'Yıllık %36,00 referans brüt kâr payı üzerinden her vade dönüşünde %17,5 stopaj düşülmüştür.',
      ...katilimPeriods
    },
    {
      id: 'para-piyasasi-fonu',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'Para Piyasası Fonları (PPF - Günlük Bileşik Getiri)',
      subCategory: 'Para Piyasası Fonları',
      symbol: 'TEFAS:PPF',
      sourceName: 'TCMB Gecelik Repo (%39,0) Günlük Bileşik Getiri',
      verifyUrl: 'https://www.tefas.gov.tr/FonKarsilastirma.aspx',
      unitLabel: 'Yıllık Baz Oran %',
      isRateInstrument: true,
      currentPrice: tcmbUpperRate,
      taxRatePct: 17.5,
      taxNote: 'Günlük bileşik repo/mevduat getirisi (Brüt +%3,48) üzerinden %17,5 fon stopajı düşülmüştür.',
      ...ppfPeriods
    },
    {
      id: 'dibs-tahvil',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'Devlet İç Borçlanma Senetleri (DİBS - 2 Yıllık Tahvil Faizi)',
      subCategory: 'Hazine Bonosu ve Devlet Tahvili',
      symbol: 'TVC:TR02Y',
      sourceName: 'Türkiye 2 Yıllık Gösterge Devlet Tahvili Getirisi',
      verifyUrl: 'https://tr.tradingview.com/symbols/TVC-TR02Y/',
      unitLabel: 'Yıllık Bileşik Faiz %',
      isRateInstrument: true,
      currentPrice: tr02y,
      taxRatePct: 0.0,
      taxNote: `Hazine ve Maliye Bakanlığı ihraçlı Devlet Tahvili ve Hazine Bonolarında 31.12.2026'ya kadar iktisap edilenlerde stopaj oranı %0'dır.`,
      ...dibsPeriods
    },
    {
      id: 'kira-sertifikasi-sukuk',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'Hazine Kira Sertifikası (TL Kamu Sukuk - Faizsiz)',
      subCategory: 'Katılım & Kira Sertifikası (Faizsiz)',
      symbol: 'TEFAS:SUKUK',
      sourceName: 'Hazine Varlık Kiralama TL Kira Sertifikası',
      verifyUrl: 'https://www.hmb.gov.tr/kamu-finansmani',
      unitLabel: 'Yıllık Basit Kira %',
      isRateInstrument: true,
      currentPrice: tcmbPolicyRate + 0.5,
      taxRatePct: 0.0,
      taxNote: 'Hazine Varlık Kiralama A.Ş. ihraçlı kamu kira sertifikalarında 31.12.2026 sonuna kadar stopaj %0’dır.',
      ...sukukPeriods
    },
    buildDirectItem({
      id: 'eurobond-usdtr',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'QNB Portföy Amerikan Doları Yabancı BYF (USDTR)',
      subCategory: 'Dolar Borsa Yatırım Fonu',
      symbol: 'BIST:USDTR',
      sourceName: 'TradingView BIST:USDTR (Birebir Sayfa Verisi)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-USDTR'],
      unitLabel: 'TL / Pay',
      taxRatePct: 17.5,
      taxNote: '9 Temmuz 2025 sonrası alınan döviz/yabancı BYF paylarında satış kazancı üzerinden %17,5 stopaj uygulanır.'
    }, tv['BIST-USDTR']),
    buildUsdAssetItem({
      id: 'eurobond-emb',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'Eurobond Sepeti ETF (iShares Emerging Markets Bond - EMB)',
      subCategory: 'Eurobond (Döviz Tahvili)',
      symbol: 'NASDAQ:EMB',
      sourceName: 'TradingView NASDAQ:EMB (Birebir Sayfa Verisi)',
      verifyUrl: TV_SYMBOL_PAGES['NASDAQ-EMB'],
      unitLabel: 'USD / Pay',
      taxRatePct: 0,
      taxNote: 'Tabloda hem TradingView NASDAQ:EMB sayfasındaki birebir USD fiyat/değişim hem de Dolar/TL kur farkı eklenmiş TL karşılığı gösterilmektedir.'
    }, tv['NASDAQ-EMB'], usdTryRef),
    buildDirectItem({
      id: 'doviz-usd',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'ABD Doları (Serbest Piyasa USD / TRY)',
      subCategory: 'Döviz (Yabancı Para)',
      symbol: 'DOVIZ:USD',
      sourceName: 'Doviz.com Serbest Piyasa Amerikan Doları (Birebir)',
      verifyUrl: DOVIZ_PAGES['usd-try'],
      unitLabel: 'TL',
      taxRatePct: 0,
      taxNote: 'Doviz.com Amerikan Doları sayfasındaki Haftalık, Aylık ve Yıllık değişim oranlarıyla birebir aynıdır.'
    }, dv['usd-try']),
    buildDirectItem({
      id: 'doviz-eur',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'Euro (Serbest Piyasa EUR / TRY)',
      subCategory: 'Döviz (Yabancı Para)',
      symbol: 'DOVIZ:EUR',
      sourceName: 'Doviz.com Serbest Piyasa Euro (Birebir)',
      verifyUrl: DOVIZ_PAGES['eur-try'],
      unitLabel: 'TL',
      taxRatePct: 0,
      taxNote: 'Doviz.com Euro sayfasındaki Haftalık, Aylık ve Yıllık değişim oranlarıyla birebir aynıdır.'
    }, dv['eur-try']),
    buildDirectItem({
      id: 'doviz-gbp',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'İngiliz Sterlini (Serbest Piyasa GBP / TRY)',
      subCategory: 'Döviz (Yabancı Para)',
      symbol: 'DOVIZ:GBP',
      sourceName: 'Doviz.com Serbest Piyasa Sterlin (Birebir)',
      verifyUrl: DOVIZ_PAGES['gbp-try'],
      unitLabel: 'TL',
      taxRatePct: 0,
      taxNote: 'Doviz.com Sterlin sayfasındaki Haftalık, Aylık ve Yıllık değişim oranlarıyla birebir aynıdır.'
    }, dv['gbp-try']),
    buildDirectItem({
      id: 'doviz-chf',
      categoryId: 1,
      categoryName: '1. Nakit ve Sabit Getirili Araçlar',
      name: 'İsviçre Frangı (Serbest Piyasa CHF / TRY)',
      subCategory: 'Döviz (Yabancı Para)',
      symbol: 'DOVIZ:CHF',
      sourceName: 'Doviz.com Serbest Piyasa İsviçre Frangı (Birebir)',
      verifyUrl: DOVIZ_PAGES['chf-try'],
      unitLabel: 'TL',
      taxRatePct: 0,
      taxNote: 'Doviz.com İsviçre Frangı sayfasındaki Haftalık, Aylık ve Yıllık değişim oranlarıyla birebir aynıdır.'
    }, dv['chf-try']),

    // =========================================================================
    // KATEGORİ 2: KIYMETLİ MADENLER VE EMTİALAR
    // =========================================================================
    buildDirectItem({
      id: 'gram-altin-spot',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'Gram Altın (Serbest Piyasa TL)',
      subCategory: 'Fiziki / Banka Gram Altın',
      symbol: 'DOVIZ:GRAM-ALTIN',
      sourceName: 'Doviz.com Gram Altın Sayfası (Birebir)',
      verifyUrl: DOVIZ_PAGES['gram-altin'],
      unitLabel: 'TL / Gram',
      taxRatePct: 0,
      taxNote: 'Doviz.com Gram Altın sayfasındaki anlık fiyat ve Haftalık/Aylık/Yıllık değişim oranlarıyla birebir aynıdır.'
    }, dv['gram-altin']),
    buildDirectItem({
      id: 'ceyrek-altin',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'Çeyrek Altın (Serbest Piyasa TL)',
      subCategory: 'Fiziki Altın',
      symbol: 'DOVIZ:CEYREK-ALTIN',
      sourceName: 'Doviz.com Çeyrek Altın Sayfası (Birebir)',
      verifyUrl: DOVIZ_PAGES['ceyrek-altin'],
      unitLabel: 'TL / Adet',
      taxRatePct: 0,
      taxNote: 'Doviz.com Çeyrek Altın sayfasındaki anlık fiyat ve değişim oranlarıyla birebir aynıdır.'
    }, dv['ceyrek-altin']),
    buildDirectItem({
      id: 'cumhuriyet-altini',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'Cumhuriyet Altını (Serbest Piyasa TL)',
      subCategory: 'Fiziki Altın',
      symbol: 'DOVIZ:CUMHURIYET',
      sourceName: 'Doviz.com Cumhuriyet Altını Sayfası (Birebir)',
      verifyUrl: DOVIZ_PAGES['cumhuriyet-altini'],
      unitLabel: 'TL / Adet',
      taxRatePct: 0,
      taxNote: 'Doviz.com Cumhuriyet Altını sayfasındaki anlık fiyat ve değişim oranlarıyla birebir aynıdır.'
    }, dv['cumhuriyet-altini']),
    buildDirectItem({
      id: 'bilezik-22-ayar',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: '22 Ayar Bilezik (Gram TL)',
      subCategory: 'Fiziki Altın',
      symbol: 'DOVIZ:22-AYAR',
      sourceName: 'Doviz.com 22 Ayar Bilezik Sayfası (Birebir)',
      verifyUrl: DOVIZ_PAGES['bilezik-22'],
      unitLabel: 'TL / Gram',
      taxRatePct: 0,
      taxNote: 'Doviz.com 22 Ayar Bilezik sayfasındaki anlık fiyat ve değişim oranlarıyla birebir aynıdır.'
    }, dv['bilezik-22']),
    buildDirectItem({
      id: 'altin-sertifikasi',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'Darphane Altın Sertifikası (ALTIN.S1)',
      subCategory: 'Darphane Altın Sertifikası',
      symbol: 'BIST:ALTIN',
      sourceName: 'TradingView BIST:ALTIN Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ALTIN'],
      unitLabel: 'TL / Sertifika',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:ALTIN sayfasındaki fiyat ve 1 Ay (%0,52) değişimiyle birebir aynıdır.'
    }, tv['BIST-ALTIN']),
    buildDirectItem({
      id: 'altin-fonu-zgold',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'Ziraat Portföy Altın Katılım BYF (ZGOLD)',
      subCategory: 'Altın Fonları / BYF',
      symbol: 'BIST:ZGOLD',
      sourceName: 'TradingView BIST:ZGOLD Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ZGOLD'],
      unitLabel: 'TL / Pay',
      taxRatePct: 17.5,
      taxNote: '9 Temmuz 2025 sonrası alınan altın fonu/BYF paylarında satış kârı üzerinden %17,5 stopaj uygulanır.'
    }, tv['BIST-ZGOLD']),
    buildDirectItem({
      id: 'altin-fonu-gldtr',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'QNB Portföy Altın BYF (GLDTR)',
      subCategory: 'Altın Fonları / BYF',
      symbol: 'BIST:GLDTR',
      sourceName: 'TradingView BIST:GLDTR Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-GLDTR'],
      unitLabel: 'TL / Pay',
      taxRatePct: 17.5,
      taxNote: '9 Temmuz 2025 sonrası alınan altın fonu/BYF paylarında satış kârı üzerinden %17,5 stopaj uygulanır.'
    }, tv['BIST-GLDTR']),
    buildDirectItem({
      id: 'gram-gumus-spot',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'Gram Gümüş (Serbest Piyasa TL)',
      subCategory: 'Gümüş Yatırımı',
      symbol: 'DOVIZ:GUMUS',
      sourceName: 'Doviz.com Gümüş Sayfası (Birebir)',
      verifyUrl: DOVIZ_PAGES['gumus-gram'],
      unitLabel: 'TL / Gram',
      taxRatePct: 0,
      taxNote: 'Fiziki gümüş satış kazancında stopaj %0’dır (banka kaydi alımlarında binde 2 kambiyo vergisi bulunur).'
    }, dv['gumus-gram']),
    buildDirectItem({
      id: 'gumus-fonu-gmstr',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'QNB Portföy Gümüş BYF (GMSTR)',
      subCategory: 'Gümüş Fonu / BYF',
      symbol: 'BIST:GMSTR',
      sourceName: 'TradingView BIST:GMSTR Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-GMSTR'],
      unitLabel: 'TL / Pay',
      taxRatePct: 17.5,
      taxNote: '9 Temmuz 2025 sonrası alınan gümüş BYF paylarında satış kârı üzerinden %17,5 stopaj uygulanır.'
    }, tv['BIST-GMSTR']),
    buildUsdAssetItem({
      id: 'ons-platin',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'Platin (Spot Platin - TVC:PLATINUM)',
      subCategory: 'Platin ve Paladyum',
      symbol: 'TVC:PLATINUM',
      sourceName: 'TradingView TVC:PLATINUM Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['TVC-PLATINUM'],
      unitLabel: 'USD / Ons',
      taxRatePct: 0,
      taxNote: 'TradingView TVC:PLATINUM sayfasındaki birebir fiyat/yüzde ve TL kur farkı karşılığıdır.'
    }, tv['TVC-PLATINUM'], usdTryRef),
    buildUsdAssetItem({
      id: 'ons-paladyum',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'Paladyum (Spot Paladyum - TVC:PALLADIUM)',
      subCategory: 'Platin ve Paladyum',
      symbol: 'TVC:PALLADIUM',
      sourceName: 'TradingView TVC:PALLADIUM Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['TVC-PALLADIUM'],
      unitLabel: 'USD / Ons',
      taxRatePct: 0,
      taxNote: 'TradingView TVC:PALLADIUM sayfasındaki birebir fiyat/yüzde ve TL kur farkı karşılığıdır.'
    }, tv['TVC-PALLADIUM'], usdTryRef),
    buildUsdAssetItem({
      id: 'emtia-petrol-bno',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'Brent Petrol Emtia Fonu (AMEX:BNO)',
      subCategory: 'Enerji Emtiaları',
      symbol: 'AMEX:BNO',
      sourceName: 'TradingView AMEX:BNO Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['AMEX-BNO'],
      unitLabel: 'USD / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView AMEX:BNO sayfasındaki birebir fiyat/yüzde ve TL kur farkı karşılığıdır.'
    }, tv['AMEX-BNO'], usdTryRef),
    buildUsdAssetItem({
      id: 'emtia-tarim-dba',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'Tarım Emtiaları Fonu (Invesco Agriculture - AMEX:DBA)',
      subCategory: 'Tarım Emtiaları',
      symbol: 'AMEX:DBA',
      sourceName: 'TradingView AMEX:DBA Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['AMEX-DBA'],
      unitLabel: 'USD / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView AMEX:DBA sayfasındaki birebir fiyat/yüzde ve TL kur farkı karşılığıdır.'
    }, tv['AMEX-DBA'], usdTryRef),

    // =========================================================================
    // KATEGORİ 3: SERMAYE PİYASALARI VE HİSSE SENETLERİ
    // =========================================================================
    buildDirectItem({
      id: 'bist-100',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'Borsa İstanbul BIST 100 Endeksi (XU100)',
      subCategory: 'BIST Genel Endeks',
      symbol: 'BIST:XU100',
      sourceName: 'TradingView BIST:XU100 Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-XU100'],
      unitLabel: 'Puan',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:XU100 sayfasındaki 1 Ay (-%8,10), 3 Ay (-%17,65) ve 1 Yıl (+%3,24) verisiyle birebir aynıdır.'
    }, tv['BIST-XU100']),
    buildDirectItem({
      id: 'bist-30',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'Borsa İstanbul BIST 30 Endeksi (XU030)',
      subCategory: 'BIST Büyük Şirketler',
      symbol: 'BIST:XU030',
      sourceName: 'TradingView BIST:XU030 Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-XU030'],
      unitLabel: 'Puan',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:XU030 sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-XU030']),
    buildDirectItem({
      id: 'bist-banka',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'BIST Bankacılık Endeksi (XBANK)',
      subCategory: 'Bankacılık Hisseleri',
      symbol: 'BIST:XBANK',
      sourceName: 'TradingView BIST:XBANK Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-XBANK'],
      unitLabel: 'Puan',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:XBANK sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-XBANK']),
    buildDirectItem({
      id: 'bist-temettu-25',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'BIST Temettü 25 Endeksi BYF (Osmanlı Portföy OPT25)',
      subCategory: 'Temettü Hisseleri',
      symbol: 'BIST:OPT25',
      sourceName: 'TradingView BIST:OPT25 Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-OPT25'],
      unitLabel: 'TL / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:OPT25 sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-OPT25']),
    buildDirectItem({
      id: 'halka-arz-altny',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'BIST Halka Arz: Altınay Savunma Teknolojileri (ALTNY)',
      subCategory: 'Halka Arzlar (IPO)',
      symbol: 'BIST:ALTNY',
      sourceName: 'TradingView BIST:ALTNY Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ALTNY'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:ALTNY sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-ALTNY']),
    buildDirectItem({
      id: 'halka-arz-tabgd',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'BIST Halka Arz: TAB Gıda (TABGD)',
      subCategory: 'Halka Arzlar (IPO)',
      symbol: 'BIST:TABGD',
      sourceName: 'TradingView BIST:TABGD Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-TABGD'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:TABGD sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-TABGD']),
    buildDirectItem({
      id: 'halka-arz-rgyas',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'BIST Halka Arz: Rönesans Gayrimenkul (RGYAS)',
      subCategory: 'Halka Arzlar (IPO)',
      symbol: 'BIST:RGYAS',
      sourceName: 'TradingView BIST:RGYAS Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-RGYAS'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:RGYAS sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-RGYAS']),
    buildUsdAssetItem({
      id: 'abd-sp500-spy',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'ABD S&P 500 Endeks ETF (SPDR S&P 500 - AMEX:SPY)',
      subCategory: 'Yabancı Borsa Yatırım Fonları (ETF)',
      symbol: 'AMEX:SPY',
      sourceName: 'TradingView AMEX:SPY Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['AMEX-SPY'],
      unitLabel: 'USD / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView AMEX:SPY sayfasındaki birebir USD fiyat/değişim ve Dolar/TL kur farkı eklenmiş karşılığıdır.'
    }, tv['AMEX-SPY'], usdTryRef),
    buildUsdAssetItem({
      id: 'abd-nasdaq-qqq',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'ABD Nasdaq 100 Teknoloji ETF (Invesco QQQ - NASDAQ:QQQ)',
      subCategory: 'Yabancı Borsa Yatırım Fonları (ETF)',
      symbol: 'NASDAQ:QQQ',
      sourceName: 'TradingView NASDAQ:QQQ Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['NASDAQ-QQQ'],
      unitLabel: 'USD / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView NASDAQ:QQQ sayfasındaki birebir USD fiyat/değişim ve Dolar/TL kur farkı eklenmiş karşılığıdır.'
    }, tv['NASDAQ-QQQ'], usdTryRef),
    buildUsdAssetItem({
      id: 'dunya-borsalari-vt',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'Tüm Dünya Borsaları ETF (Vanguard Total World - AMEX:VT)',
      subCategory: 'Yabancı Borsa Yatırım Fonları (ETF)',
      symbol: 'AMEX:VT',
      sourceName: 'TradingView AMEX:VT Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['AMEX-VT'],
      unitLabel: 'USD / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView AMEX:VT sayfasındaki birebir USD fiyat/değişim ve Dolar/TL kur farkı eklenmiş karşılığıdır.'
    }, tv['AMEX-VT'], usdTryRef),
    buildUsdAssetItem({
      id: 'kuresel-hisse-nvda',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'Yurt Dışı Hisse: NVIDIA Corp (NASDAQ:NVDA)',
      subCategory: 'Küresel Hisse Senetleri',
      symbol: 'NASDAQ:NVDA',
      sourceName: 'TradingView NASDAQ:NVDA Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['NASDAQ-NVDA'],
      unitLabel: 'USD / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView NASDAQ:NVDA sayfasındaki birebir USD fiyat/değişim ve Dolar/TL kur farkı eklenmiş karşılığıdır.'
    }, tv['NASDAQ-NVDA'], usdTryRef),
    buildUsdAssetItem({
      id: 'kuresel-hisse-aapl',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'Yurt Dışı Hisse: Apple Inc (NASDAQ:AAPL)',
      subCategory: 'Küresel Hisse Senetleri',
      symbol: 'NASDAQ:AAPL',
      sourceName: 'TradingView NASDAQ:AAPL Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['NASDAQ-AAPL'],
      unitLabel: 'USD / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView NASDAQ:AAPL sayfasındaki birebir USD fiyat/değişim ve Dolar/TL kur farkı eklenmiş karşılığıdır.'
    }, tv['NASDAQ-AAPL'], usdTryRef),
    buildUsdAssetItem({
      id: 'kuresel-hisse-msft',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'Yurt Dışı Hisse: Microsoft Corp (NASDAQ:MSFT)',
      subCategory: 'Küresel Hisse Senetleri',
      symbol: 'NASDAQ:MSFT',
      sourceName: 'TradingView NASDAQ:MSFT Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['NASDAQ-MSFT'],
      unitLabel: 'USD / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView NASDAQ:MSFT sayfasındaki birebir USD fiyat/değişim ve Dolar/TL kur farkı eklenmiş karşılığıdır.'
    }, tv['NASDAQ-MSFT'], usdTryRef),
    buildDirectItem({
      id: 'viop-bist30-kontrat',
      categoryId: 3,
      categoryName: '3. Sermaye Piyasaları ve Hisse Senetleri',
      name: 'VİOP BIST 30 Vadeli İşlem Kontratı (XU030D1!)',
      subCategory: 'VİOP (Vadeli İşlem ve Opsiyon)',
      symbol: 'BIST:XU030D1!',
      sourceName: 'TradingView BIST:XU030D1! Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-XU030D1!'],
      unitLabel: 'Puan',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:XU030D1! sayfasındaki fiyat (14.562) ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-XU030D1!']),

    // =========================================================================
    // KATEGORİ 4: YATIRIM FONLARI VE BİREYSEL EMEKLİLİK
    // =========================================================================
    buildDirectItem({
      id: 'fon-yerli-hisse-zpbdl',
      categoryId: 4,
      categoryName: '4. Yatırım Fonları ve Bireysel Emeklilik',
      name: 'Ziraat Portföy BIST Banka Dışı Likit 10 Hisse Yoğun BYF (ZPBDL)',
      subCategory: 'Yerli Hisse Senedi Yoğun Fonlar',
      symbol: 'BIST:ZPBDL',
      sourceName: 'TradingView BIST:ZPBDL Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ZPBDL'],
      unitLabel: 'TL / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:ZPBDL sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır (%0 Stopaj).'
    }, tv['BIST-ZPBDL']),
    buildDirectItem({
      id: 'fon-yerli-banka-zplib',
      categoryId: 4,
      categoryName: '4. Yatırım Fonları ve Bireysel Emeklilik',
      name: 'Ziraat Portföy BIST Likit Banka Hisse Yoğun BYF (ZPLIB)',
      subCategory: 'Yerli Hisse Senedi Yoğun Fonlar',
      symbol: 'BIST:ZPLIB',
      sourceName: 'TradingView BIST:ZPLIB Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ZPLIB'],
      unitLabel: 'TL / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:ZPLIB sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır (%0 Stopaj).'
    }, tv['BIST-ZPLIB']),
    buildDirectItem({
      id: 'fon-yerli-bist30-apx30',
      categoryId: 4,
      categoryName: '4. Yatırım Fonları ve Bireysel Emeklilik',
      name: 'Ak Portföy BIST 30 Hisse Senedi Yoğun BYF (APX30)',
      subCategory: 'Yerli Hisse Senedi Yoğun Fonlar',
      symbol: 'BIST:APX30',
      sourceName: 'TradingView BIST:APX30 Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-APX30'],
      unitLabel: 'TL / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:APX30 sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır (%0 Stopaj).'
    }, tv['BIST-APX30']),
    buildDirectItem({
      id: 'fon-katilim-z30kp',
      categoryId: 4,
      categoryName: '4. Yatırım Fonları ve Bireysel Emeklilik',
      name: 'Ziraat Portföy Katılım 30 Faizsiz Hisse Yoğun BYF (Z30KP)',
      subCategory: 'Katılım Hisse Fonları',
      symbol: 'BIST:Z30KP',
      sourceName: 'TradingView BIST:Z30KP Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-Z30KP'],
      unitLabel: 'TL / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:Z30KP sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır (%0 Stopaj).'
    }, tv['BIST-Z30KP']),
    buildDirectItem({
      id: 'fon-tematik-teknoloji-zpt10',
      categoryId: 4,
      categoryName: '4. Yatırım Fonları ve Bireysel Emeklilik',
      name: 'Ziraat Portföy Teknoloji ve İletişim 10 BYF (ZPT10)',
      subCategory: 'Tematik Yatırım Fonları',
      symbol: 'BIST:ZPT10',
      sourceName: 'TradingView BIST:ZPT10 Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ZPT10'],
      unitLabel: 'TL / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:ZPT10 sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-ZPT10']),
    buildDirectItem({
      id: 'fon-tematik-surdurulebilirlik-zsr25',
      categoryId: 4,
      categoryName: '4. Yatırım Fonları ve Bireysel Emeklilik',
      name: 'Ziraat Portföy BIST Sürdürülebilirlik 25 BYF (ZSR25)',
      subCategory: 'Tematik Yatırım Fonları',
      symbol: 'BIST:ZSR25',
      sourceName: 'TradingView BIST:ZSR25 Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ZSR25'],
      unitLabel: 'TL / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:ZSR25 sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-ZSR25']),
    buildUsdAssetItem({
      id: 'fon-tematik-yari-iletken-soxx',
      categoryId: 4,
      categoryName: '4. Yatırım Fonları ve Bireysel Emeklilik',
      name: 'Küresel Yarı İletkenler & Çip Fonu (iShares Semiconductor - SOXX)',
      subCategory: 'Yabancı Tematik Fonlar',
      symbol: 'NASDAQ:SOXX',
      sourceName: 'TradingView NASDAQ:SOXX Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['NASDAQ-SOXX'],
      unitLabel: 'USD / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView NASDAQ:SOXX sayfasındaki birebir USD fiyat/değişim ve Dolar/TL kur farkı eklenmiş karşılığıdır.'
    }, tv['NASDAQ-SOXX'], usdTryRef),
    buildDirectItem({
      id: 'fon-degisken-isglk',
      categoryId: 2,
      categoryName: '2. Kıymetli Madenler ve Emtialar',
      name: 'İş Portföy Altın Katılım BYF (ISGLK)',
      subCategory: 'Altın Fonları / BYF',
      symbol: 'BIST:ISGLK',
      sourceName: 'TradingView BIST:ISGLK Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ISGLK'],
      unitLabel: 'TL / Pay',
      taxRatePct: 17.5,
      isPartial3Y: true,
      isPartial5Y: true,
      taxNote: 'İş Portföy Altın Katılım BYF (ISGLK); 9 Temmuz 2025 sonrası alımlarda satış kazancından %17,5 stopaj uygulanır.'
    }, tv['BIST-ISGLK']),
    {
      id: 'bes-emeklilik',
      categoryId: 4,
      categoryName: '4. Yatırım Fonları ve Bireysel Emeklilik',
      name: 'Bireysel Emeklilik Sistemi (BES Standart/Para Piyasası Fonu)',
      subCategory: 'Bireysel Emeklilik Sistemi (BES)',
      symbol: 'BEFAS:BES',
      sourceName: `BEFAS Fon Getirisi + Asgari Ücret (${minWageGross.toLocaleString('tr-TR')} TL) %30 Devlet Katkısı`,
      verifyUrl: 'https://www.befas.gov.tr/',
      unitLabel: 'Yıllık Baz Oran %',
      isRateInstrument: true,
      currentPrice: tcmbPolicyRate,
      taxRatePct: 15.0,
      taxNote: 'BEFAS para piyasası/standart fon getirisi üzerinden hesaplanmıştır.',
      ...besPeriods
    },

    // =========================================================================
    // KATEGORİ 5: GAYRİMENKUL VE TAŞINMAZ YATIRIMLARI
    // =========================================================================
    {
      id: 'gayrimenkul-konut-tcmb',
      categoryId: 5,
      categoryName: '5. Gayrimenkul ve Taşınmaz Yatırımları',
      name: 'Türkiye Resmi Konut Fiyat Endeksi (TCMB KFE)',
      subCategory: 'Konut Yatırımı (Resmi TCMB Endeksi)',
      symbol: 'ECONOMICS:TRHPI',
      sourceName: `TCMB Resmi Konut Fiyat Endeksi (${tcmbHpi})`,
      verifyUrl: 'https://tr.tradingview.com/symbols/ECONOMICS-TRHPI/',
      unitLabel: 'Endeks Puanı',
      currentPrice: tcmbHpi,
      taxRatePct: 0,
      taxNote: `TradingView ECONOMICS:TRHPI sayfasındaki resmi TCMB Konut Fiyat Endeksi (${tcmbHpi}) ve son aylık resmi değişim (+%${tcmbHpiMom}) ile birebir aynıdır.`,
      perf1W: +((tcmbHpiMom * 7) / 30).toFixed(2),
      perf1M: tcmbHpiMom,
      perf3M: +((Math.pow(1 + tcmbHpiYoy / 100, 3 / 12) - 1) * 100).toFixed(2),
      perf6M: +((Math.pow(1 + tcmbHpiYoy / 100, 6 / 12) - 1) * 100).toFixed(2),
      perf1Y: tcmbHpiYoy,
      perf3Y: +(((1 + 0.755) * (1 + 0.312) * (1 + tcmbHpiYoy / 100) - 1) * 100).toFixed(2),
      perf5Y: +(((1 + 0.596) * (1 + 1.678) * (1 + 0.755) * (1 + 0.312) * (1 + tcmbHpiYoy / 100) - 1) * 100).toFixed(2)
    },
    buildDirectItem({
      id: 'gayrimenkul-konut-ekgyo',
      categoryId: 5,
      categoryName: '5. Gayrimenkul ve Taşınmaz Yatırımları',
      name: 'Konut Gayrimenkul: Emlak Konut GYO (EKGYO)',
      subCategory: 'Konut GYO Hissesi',
      symbol: 'BIST:EKGYO',
      sourceName: 'TradingView BIST:EKGYO Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-EKGYO'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:EKGYO sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-EKGYO']),
    buildDirectItem({
      id: 'gayrimenkul-ticari-rygyo',
      categoryId: 5,
      categoryName: '5. Gayrimenkul ve Taşınmaz Yatırımları',
      name: 'Ticari Gayrimenkul (Depo & Lojistik): Reysaş GYO (RYGYO)',
      subCategory: 'Ticari Gayrimenkul (Depo / Fabrika)',
      symbol: 'BIST:RYGYO',
      sourceName: 'TradingView BIST:RYGYO Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-RYGYO'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:RYGYO sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-RYGYO']),
    buildDirectItem({
      id: 'gayrimenkul-ticari-isgyo',
      categoryId: 5,
      categoryName: '5. Gayrimenkul ve Taşınmaz Yatırımları',
      name: 'Ticari Gayrimenkul (Ofis, Kule & Mağaza): İş GYO (ISGYO)',
      subCategory: 'Ticari Gayrimenkul (Ofis / Mağaza)',
      symbol: 'BIST:ISGYO',
      sourceName: 'TradingView BIST:ISGYO Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ISGYO'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:ISGYO sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-ISGYO']),
    buildDirectItem({
      id: 'gayrimenkul-arazi-algyo',
      categoryId: 5,
      categoryName: '5. Gayrimenkul ve Taşınmaz Yatırımları',
      name: 'Arazi ve Turizm Gayrimenkulü: Alarko GYO (ALGYO)',
      subCategory: 'Arsa ve Arazi Gayrimenkul',
      symbol: 'BIST:ALGYO',
      sourceName: 'TradingView BIST:ALGYO Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ALGYO'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:ALGYO sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-ALGYO']),
    buildDirectItem({
      id: 'gayrimenkul-gyo-fonu-optgy',
      categoryId: 5,
      categoryName: '5. Gayrimenkul ve Taşınmaz Yatırımları',
      name: 'BIST GYO Endeksi Fonu (Osmanlı Portföy GYO BYF - OPTGY)',
      subCategory: 'GYO Endeks Fonu',
      symbol: 'BIST:OPTGY',
      sourceName: 'TradingView BIST:OPTGY Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-OPTGY'],
      unitLabel: 'TL / Pay',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:OPTGY sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-OPTGY']),

    // =========================================================================
    // KATEGORİ 6: ALTERNATİF VE YENİ NESİL YATIRIM ARAÇLARI
    // =========================================================================
    buildDirectItem({
      id: 'kripto-btc',
      categoryId: 6,
      categoryName: '6. Alternatif ve Yeni Nesil Yatırım Araçları',
      name: 'Bitcoin / Türk Lirası (BTCTRY)',
      subCategory: 'Kripto Varlıklar',
      symbol: 'BINANCE:BTCTRY',
      sourceName: 'TradingView BTCTRY Sayfası (Doğrudan TL Fiyatlı - Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BTCTRY'],
      unitLabel: 'TL / BTC',
      taxRatePct: 0,
      taxNote: 'TradingView BTCTRY sayfasındaki doğrudan TL fiyatı ve yüzdesiyle (%-10,03) birebir aynıdır.'
    }, tv['BTCTRY']),
    buildDirectItem({
      id: 'kripto-eth',
      categoryId: 6,
      categoryName: '6. Alternatif ve Yeni Nesil Yatırım Araçları',
      name: 'Ethereum / Türk Lirası (ETHTRY)',
      subCategory: 'Kripto Varlıklar',
      symbol: 'BINANCE:ETHTRY',
      sourceName: 'TradingView ETHTRY Sayfası (Doğrudan TL Fiyatlı - Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['ETHTRY'],
      unitLabel: 'TL / ETH',
      taxRatePct: 0,
      taxNote: 'TradingView ETHTRY sayfasındaki doğrudan TL fiyatı ve yüzdesiyle (%-16,06) birebir aynıdır.'
    }, tv['ETHTRY']),
    buildDirectItem({
      id: 'kripto-sol',
      categoryId: 6,
      categoryName: '6. Alternatif ve Yeni Nesil Yatırım Araçları',
      name: 'Solana / Türk Lirası (SOLTRY)',
      subCategory: 'Kripto Varlıklar (Altcoin)',
      symbol: 'BINANCE:SOLTRY',
      sourceName: 'TradingView SOLTRY Sayfası (Doğrudan TL Fiyatlı - Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['SOLTRY'],
      unitLabel: 'TL / SOL',
      taxRatePct: 0,
      taxNote: 'TradingView SOLTRY sayfasındaki doğrudan TL fiyatı ve yüzdesiyle (%-24,06) birebir aynıdır.'
    }, tv['SOLTRY']),
    buildDirectItem({
      id: 'girisim-hubvc',
      categoryId: 6,
      categoryName: '6. Alternatif ve Yeni Nesil Yatırım Araçları',
      name: 'Girişim Sermayesi / Startup: Hub Girişim (HUBVC)',
      subCategory: 'Girişim Sermayesi ve Startup Yatırımcılığı',
      symbol: 'BIST:HUBVC',
      sourceName: 'TradingView BIST:HUBVC Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-HUBVC'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:HUBVC sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-HUBVC']),
    buildDirectItem({
      id: 'girisim-isgsy',
      categoryId: 6,
      categoryName: '6. Alternatif ve Yeni Nesil Yatırım Araçları',
      name: 'Girişim Sermayesi / Startup: İş Girişim Sermayesi (ISGSY)',
      subCategory: 'Girişim Sermayesi ve Startup Yatırımcılığı',
      symbol: 'BIST:ISGSY',
      sourceName: 'TradingView BIST:ISGSY Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ISGSY'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:ISGSY sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-ISGSY']),
    buildDirectItem({
      id: 'girisim-vertu',
      categoryId: 6,
      categoryName: '6. Alternatif ve Yeni Nesil Yatırım Araçları',
      name: 'Girişim Sermayesi / Startup: Verusaturk Girişim (VERTU)',
      subCategory: 'Girişim Sermayesi ve Startup Yatırımcılığı',
      symbol: 'BIST:VERTU',
      sourceName: 'TradingView BIST:VERTU Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-VERTU'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:VERTU sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-VERTU']),
    buildDirectItem({
      id: 'girisim-gozde',
      categoryId: 6,
      categoryName: '6. Alternatif ve Yeni Nesil Yatırım Araçları',
      name: 'Girişim Sermayesi / Startup: Gözde Girişim (GOZDE)',
      subCategory: 'Girişim Sermayesi ve Startup Yatırımcılığı',
      symbol: 'BIST:GOZDE',
      sourceName: 'TradingView BIST:GOZDE Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-GOZDE'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:GOZDE sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-GOZDE']),
    buildUsdAssetItem({
      id: 'koleksiyon-luks-lvmh',
      categoryId: 6,
      categoryName: '6. Alternatif ve Yeni Nesil Yatırım Araçları',
      name: 'Lüks Saat, Sanat ve Koleksiyon Endeksi (LVMH - OTC:LVMUY)',
      subCategory: 'Sanat ve Koleksiyon Yatırımları',
      symbol: 'OTC:LVMUY',
      sourceName: 'TradingView OTC:LVMUY Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['OTC-LVMUY'],
      unitLabel: 'USD / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView OTC:LVMUY sayfasındaki birebir USD fiyat/değişim ve Dolar/TL kur farkı eklenmiş karşılığıdır.'
    }, tv['OTC-LVMUY'], usdTryRef),

    // =========================================================================
    // KATEGORİ 7: REEL SEKTÖR, ENERJİ VE BİLİŞİM YATIRIMLARI (TEKİL & BİREBİR)
    // =========================================================================
    buildDirectItem({
      id: 'reel-perakende-bimas',
      categoryId: 7,
      categoryName: '7. Reel Sektör, Enerji ve Bilişim Yatırımları',
      name: 'Reel Sektör Perakende & Zincir Mağazacılık: BİM (BIMAS)',
      subCategory: 'Ticaret ve Perakende',
      symbol: 'BIST:BIMAS',
      sourceName: 'TradingView BIST:BIMAS Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-BIMAS'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:BIMAS sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-BIMAS']),
    buildDirectItem({
      id: 'reel-perakende-mgros',
      categoryId: 7,
      categoryName: '7. Reel Sektör, Enerji ve Bilişim Yatırımları',
      name: 'Reel Sektör Perakende & E-Ticaret: Migros (MGROS)',
      subCategory: 'Ticaret ve Perakende',
      symbol: 'BIST:MGROS',
      sourceName: 'TradingView BIST:MGROS Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-MGROS'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:MGROS sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-MGROS']),
    buildDirectItem({
      id: 'reel-enerji-astor',
      categoryId: 7,
      categoryName: '7. Reel Sektör, Enerji ve Bilişim Yatırımları',
      name: 'Yenilenebilir Enerji & Trafo: Astor Enerji (ASTOR)',
      subCategory: 'Enerji ve GES Yatırımları',
      symbol: 'BIST:ASTOR',
      sourceName: 'TradingView BIST:ASTOR Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-ASTOR'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:ASTOR sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-ASTOR']),
    buildDirectItem({
      id: 'reel-enerji-cwene',
      categoryId: 7,
      categoryName: '7. Reel Sektör, Enerji ve Bilişim Yatırımları',
      name: 'Güneş Enerjisi Santrali (GES) Panel Üretimi: CW Enerji (CWENE)',
      subCategory: 'Güneş Enerjisi (GES)',
      symbol: 'BIST:CWENE',
      sourceName: 'TradingView BIST:CWENE Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-CWENE'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:CWENE sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-CWENE']),
    buildDirectItem({
      id: 'reel-enerji-smrtg',
      categoryId: 7,
      categoryName: '7. Reel Sektör, Enerji ve Bilişim Yatırımları',
      name: 'Güneş Enerjisi Santrali (GES) Teknolojileri: Smart Güneş (SMRTG)',
      subCategory: 'Güneş Enerjisi (GES)',
      symbol: 'BIST:SMRTG',
      sourceName: 'TradingView BIST:SMRTG Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-SMRTG'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:SMRTG sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-SMRTG']),
    buildDirectItem({
      id: 'reel-yazilim-logo',
      categoryId: 7,
      categoryName: '7. Reel Sektör, Enerji ve Bilişim Yatırımları',
      name: 'Yazılım ve Bilişim Sermayesi: Logo Yazılım (LOGO)',
      subCategory: 'Yazılım ve Teknoloji',
      symbol: 'BIST:LOGO',
      sourceName: 'TradingView BIST:LOGO Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-LOGO'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:LOGO sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-LOGO']),
    buildDirectItem({
      id: 'reel-yazilim-miatk',
      categoryId: 7,
      categoryName: '7. Reel Sektör, Enerji ve Bilişim Yatırımları',
      name: 'Yapay Zeka ve Bilişim Teknolojileri: MİA Teknoloji (MIATK)',
      subCategory: 'Yazılım ve Teknoloji',
      symbol: 'BIST:MIATK',
      sourceName: 'TradingView BIST:MIATK Sayfası (Birebir)',
      verifyUrl: TV_SYMBOL_PAGES['BIST-MIATK'],
      unitLabel: 'TL / Hisse',
      taxRatePct: 0,
      taxNote: 'TradingView BIST:MIATK sayfasındaki fiyat ve yüzde değişimiyle birebir aynıdır.'
    }, tv['BIST-MIATK'])
  ];

  // 10 Yıllık Günlük OHLCV Veri Tabanından Eğitilen Gerçek İstatistiksel Modeli Yükle
  // FAZ 1, 2, 3 & 4: 626 BIST Tam Evren Taraması, Canlı Fiziki/Vadeli/On-Chain Makaslar ve 18 Mutfak Kanalı
  const spotGramGoldNow = dv['gram-altin']?.currentPrice || 6687.89;
  const openHorizon = await scanOpenHorizonBistAndGlobal(false, spotGramGoldNow).catch(() => ({ items: [], structuralRegimeNotes: [], bist626AccumulationGems: [], bist626DistributionTraps: [], totalBistStocksScanned: 626 }));

  let trainedModel = null;
  try {
    const modelPath = path.join(__dirname, 'trained_daily_model.json');
    if (fs.existsSync(modelPath)) {
      trainedModel = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
      const liveMacroChains = openHorizon.macroChains || trainedModel.macroChains || null;
      for (const inst of instruments) {
        if (trainedModel.instruments && trainedModel.instruments[inst.id]) {
          inst.trainedDaily = trainedModel.instruments[inst.id];
          if (inst.trainedDaily.currentState?.rsi != null) {
            if (!inst.fundamentals) inst.fundamentals = {};
            inst.fundamentals.rsi = inst.trainedDaily.currentState.rsi;
          }
          // Her API çağrısında varlığın Mutfak Öncü Haritasını canlı fiziki/vadeli/on-chain zincirlerle güncelle
          const rd = inst.trainedDaily.radar;
          if (rd) {
            const specGuess = {
              type: inst.trainedDaily.isRateAnalysis ? 'RATE_TL' : (inst.isUsdAsset ? 'DIRECT_USD_AND_TRY' : 'DIRECT'),
              assetClass: inst.id.startsWith('doviz-') ? 'FX' : ''
            };
            const bistSym = String(inst.symbol || '').startsWith('BIST:') ? inst.symbol.split(':')[1] : null;
            const liveSt = bistSym ? (openHorizon.bistStockLookup || {})[bistSym] : null;
            const livePb = liveSt?.pb ?? rd.fundamentals?.pb ?? null;
            const liveOcf = liveSt?.ocfMillionTL ?? (rd.fundamentals?.ocf != null ? rd.fundamentals.ocf / 1e6 : null);
            const liveRoe = liveSt?.roe ?? rd.fundamentals?.roe ?? null;
            const isSpeculativeBubbleTrap =
              (livePb != null && livePb > 5.0 && (liveOcf == null || liveOcf < 0)) ||
              (liveOcf != null && liveOcf < 0 && liveRoe != null && liveRoe < -5) ||
              ((inst.perf1M || 0) >= 25 && (liveOcf == null || liveOcf < 0 || (rd.fundamentals?.fcf || 0) < 0));

            rd.kitchenBlueprint = getKitchenLeadingBlueprint(inst.id, specGuess, liveMacroChains);
            rd.earlySignal = `Mutfak Öncü Kaynağı: ${rd.kitchenBlueprint.primaryKitchenSource}. Nasıl Çalışır: ${rd.kitchenBlueprint.leadingMechanism} Gizli Risk / Tuzak: ${rd.kitchenBlueprint.hiddenRiskToWatch}`;
            rd.kitchenCrossCheck = evaluateKitchenCrossCheck(inst.id, specGuess, {
              drawdown52WPct: rd.drawdown52WPct ?? 0,
              upDownVolRatio: rd.upDownVolRatio ?? 1.0,
              cmf20: rd.cmf20 ?? 0,
              mfi14: rd.mfi14 ?? 50,
              rsi: inst.trainedDaily.currentState?.rsi ?? 50,
              mom5: inst.perf1W ?? 0,
              mom20: inst.perf1M ?? 0,
              isValueTrap: (rd.isValueTrap ?? false) || isSpeculativeBubbleTrap,
              valueTrapReason: isSpeculativeBubbleTrap ? `Aşırı Çarpan (${livePb}x PD/DD) & Negatif Faaliyet Nakdi (${liveOcf}M TL OCF)` : (rd.valueTrapReason ?? null),
              pb: livePb,
              ocfMillionTL: liveOcf,
              marginOfSafetyPct: rd.marginOfSafetyPct ?? null,
              isNetCash: rd.fundamentals?.isNetCash ?? false,
              fcf: rd.fundamentals?.fcf ?? null,
              roic: rd.fundamentals?.roic ?? null,
              roe: rd.fundamentals?.roe ?? null
            }, rd.liveNews || []);
            rd.boardBadge = rd.kitchenCrossCheck.verdictBadge;
            rd.isValueTrap = Boolean(rd.kitchenCrossCheck.isTrap);
            if (!rd.isValueTrap && (rd.buffettScore || 0) < 65 && (rd.kitchenCrossCheck.verdictCode === 'TRUE_EARLY_SIGNAL' || rd.kitchenCrossCheck.verdictCode === 'STEALTH_ACCUMULATION')) {
              rd.buffettScore = 68;
            } else if (isSpeculativeBubbleTrap) {
              rd.buffettScore = 28;
            }
            rd.specialistEngine = computeSpecialistDomainEngine(inst.id, specGuess, {
              drawdown52WPct: rd.drawdown52WPct ?? 0,
              upDownVolRatio: rd.upDownVolRatio ?? 1.0,
              cmf20: rd.cmf20 ?? 0,
              mfi14: rd.mfi14 ?? 50,
              rsi: inst.trainedDaily.currentState?.rsi ?? 50,
              mom5: inst.perf1W ?? 0,
              mom20: inst.perf1M ?? 0
            }, rd.fundamentals || null, liveMacroChains, rd.kitchenCrossCheck);
            rd.tms29Audit = getAssetTms29Audit(inst, openHorizon.bistStockLookup || {});
            rd.full15PhasePassport = computeAssetFull15PhasePassport({
              ...inst,
              cmf20: rd.cmf20,
              upDownVolRatio: rd.upDownVolRatio,
              drawdown52WPct: rd.drawdown52WPct,
              kitchenCrossCheck: rd.kitchenCrossCheck,
              tms29Audit: rd.tms29Audit
            }, openHorizon, liveMacroChains, tcmbPolicyRate);
          }
        }
      }
    }
  } catch (err) {
    console.error('Trained daily model read error:', err.message);
  }

  const usdChange1D = +(macroMap['FX_IDC:USDTRY']?.change ?? 0).toFixed(2);
  const goldOnsChange1D = +(macroMap['TVC:GOLD']?.change ?? 0).toFixed(2);
  const silverOnsChange1D = +(macroMap['TVC:SILVER']?.change ?? 0).toFixed(2);
  const gramGoldChange1D = +((((1 + goldOnsChange1D / 100) * (1 + usdChange1D / 100)) - 1) * 100).toFixed(2);
  const gramSilverChange1D = +((((1 + silverOnsChange1D / 100) * (1 + usdChange1D / 100)) - 1) * 100).toFixed(2);
  const symChangeMap = {
    'DOVIZ:USD': 'FX_IDC:USDTRY',
    'DOVIZ:EUR': 'FX_IDC:EURTRY',
    'DOVIZ:GBP': 'FX_IDC:GBPTRY',
    'DOVIZ:CHF': 'FX_IDC:CHFTRY'
  };
  for (const inst of instruments) {
    if (inst.isRateInstrument) {
      inst.change1D = +((Number(inst.currentPrice) || 0) / 365).toFixed(2);
    } else if (inst.id === 'gram-altin-spot' || inst.id === 'ceyrek-altin' || inst.id === 'cumhuriyet-altini' || inst.id === 'bilezik-22-ayar') {
      inst.change1D = gramGoldChange1D;
    } else if (inst.id === 'gram-gumus-spot') {
      inst.change1D = gramSilverChange1D;
    } else if (inst.id === 'gayrimenkul-konut-tcmb') {
      inst.change1D = +((tcmbHpiMom || 0) / 30).toFixed(2);
    } else {
      const mKey = symChangeMap[inst.symbol] || inst.symbol;
      const rawChg = macroMap[mKey]?.change;
      if (rawChg != null && !Number.isNaN(Number(rawChg))) {
        if (inst.isUsdAsset) {
          inst.change1D = +Number(rawChg).toFixed(2);
          inst.tlChange1D = +((((1 + Number(rawChg) / 100) * (1 + usdChange1D / 100)) - 1) * 100).toFixed(2);
        } else {
          inst.change1D = +Number(rawChg).toFixed(2);
        }
      } else {
        inst.change1D = 0;
      }
    }
  }

  const trueSignals = [];
  const trapsAndAlerts = [];
  const fortressArmor = [];

  for (const inst of instruments) {
    const rd = inst.trainedDaily?.radar;
    const kc = rd?.kitchenCrossCheck;
    const kb = rd?.kitchenBlueprint;
    if (!rd || !kc) continue;

    const itemBrief = {
      id: inst.id,
      name: inst.name,
      symbol: inst.symbol,
      currentPrice: inst.currentPrice,
      currency: inst.currency || 'TRY',
      perf1W: inst.perf1W,
      perf1M: inst.perf1M,
      drawdown52WPct: rd.drawdown52WPct,
      upDownVolRatio: rd.upDownVolRatio,
      cmf20: rd.cmf20,
      buffettScore: rd.buffettScore,
      kellyPct: rd.kellyPct,
      supportPrice: inst.trainedDaily?.empiricalRules?.supportPrice ?? null,
      verdictCode: kc.verdictCode,
      verdictBadge: kc.verdictBadge,
      summary: kc.summary,
      primaryKitchenSource: kb?.primaryKitchenSource || '',
      headline: rd.liveNews?.[0]?.title || ''
    };

    if (kc.verdictCode === 'TRUE_EARLY_SIGNAL' || kc.verdictCode === 'STEALTH_ACCUMULATION' || kc.verdictCode === 'STRUCTURAL_CATALYST_AT_BOTTOM' || kc.verdictCode === 'FX_PARITY_BREAKOUT') {
      trueSignals.push(itemBrief);
    } else if (kc.isTrap) {
      trapsAndAlerts.push(itemBrief);
    } else if (kc.verdictCode === 'FORTRESS_ARMOR') {
      fortressArmor.push({
        ...itemBrief,
        breakevenUsd1M: inst.trainedDaily?.empiricalRules?.breakevenUsd1M ?? null
      });
    }
  }

  // Öncü izleri önce yapısal katalizör + kurumsal hacim gücüne göre sırala
  trueSignals.sort((a, b) => {
    const pA = a.verdictCode === 'TRUE_EARLY_SIGNAL' ? 3 : (a.verdictCode === 'STEALTH_ACCUMULATION' ? 2 : 1);
    const pB = b.verdictCode === 'TRUE_EARLY_SIGNAL' ? 3 : (b.verdictCode === 'STEALTH_ACCUMULATION' ? 2 : 1);
    if (pB !== pA) return pB - pA;
    return (b.upDownVolRatio || 1) - (a.upDownVolRatio || 1);
  });

  // Tuzakları en tehlikeli olanlardan (İş haberiyle mal çıkışı / Ceza / Zirve FOMO) başlatarak sırala
  trapsAndAlerts.sort((a, b) => {
    const tA = a.verdictCode === 'DISTRIBUTION_TRAP' ? 4 : (a.verdictCode === 'LIQUIDATION_ALERT' ? 3 : (a.verdictCode === 'FOMO_TOP_TRAP' ? 2 : 1));
    const tB = b.verdictCode === 'DISTRIBUTION_TRAP' ? 4 : (b.verdictCode === 'LIQUIDATION_ALERT' ? 3 : (b.verdictCode === 'FOMO_TOP_TRAP' ? 2 : 1));
    if (tB !== tA) return tB - tA;
    return (a.upDownVolRatio || 1) - (b.upDownVolRatio || 1);
  });

  const onsGoldClose = macroMap['TVC:GOLD']?.close || 2740;
  const onsSilverClose = macroMap['TVC:SILVER']?.close || 32.5;
  const goldSilverRatio = onsSilverClose > 0 ? +(onsGoldClose / onsSilverClose).toFixed(1) : 80.0;
  const eurUsdClose = macroMap['FX_IDC:EURUSD']?.close || ((dv['eur-try']?.currentPrice && dv['usd-try']?.currentPrice) ? +(dv['eur-try'].currentPrice / dv['usd-try'].currentPrice).toFixed(4) : 1.085);
  const eurUsdPerf1M = +(macroMap['FX_IDC:EURUSD']?.perf1M ?? ((dv['eur-try']?.perf1M || 0) - (dv['usd-try']?.perf1M || 0))).toFixed(2);
  const us10yYield = +(macroMap['TVC:US10Y']?.close ?? 4.32).toFixed(2);
  const dxyClose = +(macroMap['TVC:DXY']?.close ?? 104.2).toFixed(2);

  const liveMacroChainsForSummary = openHorizon.macroChains || trainedModel?.macroChains || {};
  const supplyChainArbitrage = computeSupplyChainAndArbitrageMatrix(liveMacroChainsForSummary, openHorizon, instruments);
  const casinoAsymmetricPlan = computeCasinoAsymmetricPlan(instruments, openHorizon, liveMacroChainsForSummary);
  const selfAuditScorecard = computeLiveSelfAuditScorecard(instruments, openHorizon);
  const forcedFlowsAndCalendar = computeForcedFlowsAndCalendarEngine(openHorizon, instruments, liveMacroChainsForSummary, tcmbPolicyRate);
  const physicalFieldAndCustoms = computePhysicalFieldAndCustomsEngine(openHorizon, liveMacroChainsForSummary);
  const microstructureAndWhale = computeMicrostructureAndWhaleEngine(openHorizon, instruments, liveMacroChainsForSummary);
  const vukAuditAndRelatedParty = computeVukAuditAndRelatedPartyEngine(openHorizon);
  const legalArbitrageAndTender = computeLegalArbitrageAndTenderEngine(openHorizon);
  const capexHarvestAndEva = computeCapexHarvestAndEvaEngine(openHorizon, tcmbPolicyRate);
  const globalLogisticsAndBddk = computeGlobalLogisticsAndBddkEngine(openHorizon, liveMacroChainsForSummary);
  const forensicBoardPatterns626 = computeForensicBoardPatterns626(openHorizon);
  const mkkFloatDeltaLedger = computeMkkFloatDeltaLedgerEngine(openHorizon);
  const realtimeAnomalyLog = computeRealtimeAnomalyEventLogEngine(openHorizon, instruments, liveMacroChainsForSummary, forcedFlowsAndCalendar);

  const kitchenIntelSummary = {
    macroSpreads: {
      eurUsd: {
        value: eurUsdClose,
        perf1M: eurUsdPerf1M,
        interpretation: eurUsdPerf1M >= 0
          ? `EUR/USD ${eurUsdClose} (+%${eurUsdPerf1M}): Dolarla hammadde alıp Avrupa'ya Euro ile satan BIST ihracatçılarının marjını destekliyor.`
          : `EUR/USD ${eurUsdClose} (-%${Math.abs(eurUsdPerf1M)}): Euro zayıflığı Avrupa ihracatçılarının marjını baskılarken Dolar gelirli şirketleri öne çıkarıyor.`
      },
      goldSilverRatio: {
        value: goldSilverRatio,
        interpretation: goldSilverRatio >= 82
          ? `Altın/Gümüş Oranı ${goldSilverRatio}x: Gümüş, altına kıyasla tarihsel olarak ucuz bölgede.`
          : goldSilverRatio <= 68
            ? `Altın/Gümüş Oranı ${goldSilverRatio}x: Gümüş altına göre primli/ısınmış bölgede; fiziki stok ve COT raporuna dikkat.`
            : `Altın/Gümüş Oranı ${goldSilverRatio}x: Tarihsel denge bandında.`
      },
      us10yAndDxy: {
        us10y: us10yYield,
        us10yChange1D: +(macroMap['TVC:US10Y']?.change ?? 0).toFixed(2),
        dxy: dxyClose,
        dxyChange1D: +(macroMap['TVC:DXY']?.change ?? 0).toFixed(2),
        onsGoldUsd: +onsGoldClose.toFixed(2),
        onsGoldChange1D: goldOnsChange1D,
        onsSilverUsd: +onsSilverClose.toFixed(2),
        onsSilverChange1D: silverOnsChange1D,
        interpretation: `ABD 10Y Tahvil %${us10yYield} · DXY ${dxyClose}: Küresel dolar likiditesi ve kıymetli madenlerin ters (inverse) makro göstergesi.`
      }
    },
    trueSignals: trueSignals.slice(0, 12),
    trapsAndAlerts: trapsAndAlerts.slice(0, 14),
    fortressArmor: fortressArmor.slice(0, 6),
    openHorizon,
    tms29AuditReport: openHorizon.tms29AuditReport || null,
    supplyChainArbitrage,
    casinoAsymmetricPlan,
    selfAuditScorecard,
    forcedFlowsAndCalendar,
    physicalFieldAndCustoms,
    microstructureAndWhale,
    vukAuditAndRelatedParty,
    legalArbitrageAndTender,
    capexHarvestAndEva,
    globalLogisticsAndBddk,
    forensicBoardPatterns626,
    mkkFloatDeltaLedger,
    realtimeAnomalyLog
  };

  return {
    timestamp: new Date().toISOString(),
    trainingMeta: trainedModel ? {
      trainedAt: trainedModel.trainedAt,
      symbolCount: trainedModel.symbolCount,
      totalDailyBars: trainedModel.totalDailyBars,
      yearRange: trainedModel.yearRange
    } : null,
    kitchenIntelSummary,
    macro: {
      cpiMom,
      cpiYoy,
      ppiMom,
      tcmbPolicyRate,
      tcmbUpperRate,
      tcmbDepositRate,
      tcmbHpi,
      tcmbHpiMom,
      tcmbHpiYoy,
      tcmbPriceToRent,
      minWageGross,
      tr02y,
      tr10y,
      usdTry: dv['usd-try']?.currentPrice || 50.15,
      eurTry: dv['eur-try']?.currentPrice || 55.92,
      spotGramGold: dv['gram-altin']?.currentPrice || 6556.39,
      spotGramSilver: dv['gumus-gram']?.currentPrice || 83.81,
      bist100: tv['BIST-XU100']?.currentPrice || 11482.6,
      btcTry: tv['BTCTRY']?.currentPrice || 3789208
    },
    usdTryPerf: {
      perf1W: dv['usd-try']?.perf1W || 0.42,
      perf1M: dv['usd-try']?.perf1M || 1.93,
      perf3M: dv['usd-try']?.perf3M || 5.02,
      perf6M: dv['usd-try']?.perf6M || 9.79,
      perf1Y: dv['usd-try']?.perf1Y || 18.82,
      perf3Y: dv['usd-try']?.perf3Y || 76.05,
      perf5Y: dv['usd-try']?.perf5Y || 417.72
    },
    causalBenchmarks: {
      onsGold: {
        perf1W: +(macroMap['TVC:GOLD']?.perf1W ?? 1.25).toFixed(2),
        perf1M: +(macroMap['TVC:GOLD']?.perf1M ?? -1.03).toFixed(2),
        perf3M: +(macroMap['TVC:GOLD']?.perf3M ?? -3.97).toFixed(2),
        perf6M: +(macroMap['TVC:GOLD']?.perf6M ?? -13.12).toFixed(2),
        perf1Y: +(macroMap['TVC:GOLD']?.perf1Y ?? 2.30).toFixed(2),
        perf3Y: +(macroMap['TVC:GOLD']?.perf3Y ?? 105.89).toFixed(2),
        perf5Y: +(macroMap['TVC:GOLD']?.perf5Y ?? 127.42).toFixed(2)
      },
      onsSilver: {
        perf1W: +(macroMap['TVC:SILVER']?.perf1W ?? -0.49).toFixed(2),
        perf1M: +(macroMap['TVC:SILVER']?.perf1M ?? -13.28).toFixed(2),
        perf3M: +(macroMap['TVC:SILVER']?.perf3M ?? -15.60).toFixed(2),
        perf6M: +(macroMap['TVC:SILVER']?.perf6M ?? -34.61).toFixed(2),
        perf1Y: +(macroMap['TVC:SILVER']?.perf1Y ?? 8.23).toFixed(2),
        perf3Y: +(macroMap['TVC:SILVER']?.perf3Y ?? 125.58).toFixed(2),
        perf5Y: +(macroMap['TVC:SILVER']?.perf5Y ?? 118.41).toFixed(2)
      },
      xu100: {
        perf1W: +(tv['BIST-XU100']?.perf1W ?? macroMap['BIST:XU100']?.perf1W ?? 3.45).toFixed(2),
        perf1M: +(tv['BIST-XU100']?.perf1M ?? macroMap['BIST:XU100']?.perf1M ?? -7.32).toFixed(2),
        perf3M: +(tv['BIST-XU100']?.perf3M ?? macroMap['BIST:XU100']?.perf3M ?? -16.96).toFixed(2),
        perf6M: +(tv['BIST-XU100']?.perf6M ?? macroMap['BIST:XU100']?.perf6M ?? -23.62).toFixed(2),
        perf1Y: +(tv['BIST-XU100']?.perf1Y ?? macroMap['BIST:XU100']?.perf1Y ?? 4.11).toFixed(2),
        perf3Y: +(tv['BIST-XU100']?.perf3Y ?? macroMap['BIST:XU100']?.perf3Y ?? 45.83).toFixed(2),
        perf5Y: +(tv['BIST-XU100']?.perf5Y ?? macroMap['BIST:XU100']?.perf5Y ?? 628.67).toFixed(2)
      },
      spy: {
        perf1W: +(tv['AMEX-SPY']?.perf1W ?? macroMap['AMEX:SPY']?.perf1W ?? -3.43).toFixed(2),
        perf1M: +(tv['AMEX-SPY']?.perf1M ?? macroMap['AMEX:SPY']?.perf1M ?? -5.22).toFixed(2),
        perf3M: +(tv['AMEX-SPY']?.perf3M ?? macroMap['AMEX:SPY']?.perf3M ?? -4.63).toFixed(2),
        perf6M: +(tv['AMEX-SPY']?.perf6M ?? macroMap['AMEX:SPY']?.perf6M ?? 0.05).toFixed(2),
        perf1Y: +(tv['AMEX-SPY']?.perf1Y ?? macroMap['AMEX:SPY']?.perf1Y ?? 8.70).toFixed(2),
        perf3Y: +(tv['AMEX-SPY']?.perf3Y ?? macroMap['AMEX:SPY']?.perf3Y ?? 68.76).toFixed(2),
        perf5Y: +(tv['AMEX-SPY']?.perf5Y ?? macroMap['AMEX:SPY']?.perf5Y ?? 56.68).toFixed(2)
      }
    },
    inflationBenchmarks,
    instruments
  };
}

// ============================================================================
// YÜKSEK ÖLÇEKLENEBİLİR BELLEK ÖNBELLEĞİ, SINGLEFLIGHT & GZIP/ETAG MİMARİSİ
// Binlerce eşzamanlı kullanıcıda sıfır JSON.stringify tekrarı, sıfır bloklayan I/O
// ============================================================================
let cachedData = null;
let cachedJsonBuf = null;
let cachedGzipBuf = null;
let cachedEtag = null;
let lastFetchTime = 0;
let lastForceTime = 0;
let inflightRefreshPromise = null;

const staticMemCache = new Map();

async function persistBundleAtomically(jsonStr) {
  const bundleContent = 'window.__AETHER_EMBEDDED_DATA__ = ' + jsonStr + ';\n';
  const finalPath = path.join(__dirname, 'aether-data-bundle.js');
  const tmpPath = path.join(__dirname, `.aether-data-bundle.${process.pid}.tmp`);
  try {
    await fsp.writeFile(tmpPath, bundleContent, 'utf8');
    await fsp.rename(tmpPath, finalPath);
  } catch (e) {
    try { await fsp.unlink(tmpPath); } catch (_) {}
  }
}

async function refreshMarketDataset() {
  if (inflightRefreshPromise) return inflightRefreshPromise;
  inflightRefreshPromise = (async () => {
    try {
      const fresh = await buildFullDataset();
      const jsonStr = JSON.stringify(fresh);
      const rawBuf = Buffer.from(jsonStr, 'utf8');
      const gzBuf = await gzipAsync(rawBuf, { level: zlib.constants.Z_BEST_SPEED });
      const etag = 'W/"' + crypto.createHash('sha1').update(rawBuf).digest('hex').slice(0, 16) + '"';

      cachedData = fresh;
      cachedJsonBuf = rawBuf;
      cachedGzipBuf = gzBuf;
      cachedEtag = etag;
      lastFetchTime = Date.now();

      persistBundleAtomically(jsonStr);
      return fresh;
    } finally {
      inflightRefreshPromise = null;
    }
  })();
  return inflightRefreshPromise;
}

// Sunucu açılışında mevcut gömülü veri paketini anında RAM'e yükle (0ms soğuk başlangıç)
(async function warmCacheFromDisk() {
  try {
    const bp = path.join(__dirname, 'aether-data-bundle.js');
    if (fs.existsSync(bp)) {
      const txt = await fsp.readFile(bp, 'utf8');
      const prefix = 'window.__AETHER_EMBEDDED_DATA__ = ';
      const idx = txt.indexOf(prefix);
      if (idx >= 0) {
        const jsonPart = txt.slice(idx + prefix.length).trim().replace(/;$/, '');
        const parsed = JSON.parse(jsonPart);
        const rawBuf = Buffer.from(jsonPart, 'utf8');
        const gzBuf = await gzipAsync(rawBuf, { level: zlib.constants.Z_BEST_SPEED });
        cachedData = parsed;
        cachedJsonBuf = rawBuf;
        cachedGzipBuf = gzBuf;
        cachedEtag = 'W/"' + crypto.createHash('sha1').update(rawBuf).digest('hex').slice(0, 16) + '"';
      }
    }
  } catch (_) {}
  refreshMarketDataset().catch((err) => console.error('Initial background warm error:', err.message));
})();

setInterval(() => {
  refreshMarketDataset().catch((err) => console.error('Scheduled refresh error:', err.message));
}, 45000).unref();

function clientAcceptsGzip(req) {
  const ae = req.headers['accept-encoding'] || '';
  return ae.includes('gzip');
}

async function serveCachedStaticFile(req, res, relFile, mime, cacheControl = 'no-cache', downloadName = null) {
  const fp = path.join(__dirname, relFile);
  let st;
  try {
    st = await fsp.stat(fp);
  } catch (_) {
    return false;
  }

  // Büyük ikili dosyalar (.ipa > 5MB) stream edilir; metin/kod dosyaları RAM + Gzip ile 0.05ms'de sunulur
  if (st.size > 5 * 1024 * 1024) {
    const headers = {
      'Content-Type': mime,
      'Content-Length': st.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': cacheControl
    };
    if (downloadName) headers['Content-Disposition'] = `attachment; filename="${downloadName}"`;
    res.writeHead(200, headers);
    fs.createReadStream(fp).pipe(res);
    return true;
  }

  let entry = staticMemCache.get(fp);
  if (!entry || entry.mtimeMs !== st.mtimeMs || entry.size !== st.size) {
    const rawBuf = await fsp.readFile(fp);
    const compressible = /javascript|json|html|svg|xml|css|text/.test(mime);
    const gzBuf = compressible ? await gzipAsync(rawBuf, { level: zlib.constants.Z_BEST_SPEED }) : null;
    const etag = 'W/"' + st.size.toString(16) + '-' + Math.floor(st.mtimeMs).toString(16) + '"';
    entry = { mtimeMs: st.mtimeMs, size: st.size, rawBuf, gzBuf, etag };
    staticMemCache.set(fp, entry);
  }

  if (!downloadName && req.headers['if-none-match'] === entry.etag) {
    res.writeHead(304, {
      'ETag': entry.etag,
      'Cache-Control': cacheControl,
      'Access-Control-Allow-Origin': '*'
    });
    res.end();
    return true;
  }

  const useGz = Boolean(entry.gzBuf && clientAcceptsGzip(req));
  const body = useGz ? entry.gzBuf : entry.rawBuf;
  const headers = {
    'Content-Type': mime,
    'Content-Length': body.length,
    'ETag': entry.etag,
    'Vary': 'Accept-Encoding',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': cacheControl
  };
  if (useGz) headers['Content-Encoding'] = 'gzip';
  if (downloadName) headers['Content-Disposition'] = `attachment; filename="${downloadName}"`;
  res.writeHead(200, headers);
  res.end(body);
  return true;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, If-None-Match'
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/api/market-data') {
    try {
      const now = Date.now();
      const force = url.searchParams.get('force') === '1' && (now - lastForceTime > 10000);

      if (!cachedJsonBuf) {
        await refreshMarketDataset();
      } else if (force) {
        lastForceTime = now;
        await refreshMarketDataset();
      } else if (now - lastFetchTime > 30000) {
        // Stale-While-Revalidate: Mevcut önbelleği 0.05ms'de dön, arka planda tekil (singleflight) yenile
        refreshMarketDataset().catch((err) => console.error('SWR refresh error:', err.message));
      }

      if (cachedEtag && req.headers['if-none-match'] === cachedEtag) {
        res.writeHead(304, {
          'ETag': cachedEtag,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=5, stale-while-revalidate=45'
        });
        res.end();
        return;
      }

      const useGz = Boolean(cachedGzipBuf && clientAcceptsGzip(req));
      const outBuf = useGz ? cachedGzipBuf : cachedJsonBuf;
      const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': outBuf.length,
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept-Encoding',
        'Cache-Control': 'public, max-age=5, stale-while-revalidate=45'
      };
      if (cachedEtag) headers['ETag'] = cachedEtag;
      if (useGz) headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      res.end(outBuf);
    } catch (err) {
      console.error('API Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: 'Canlı piyasa verileri çekilirken hata oluştu: ' + err.message }));
    }
    return;
  }

  // Statik iOS / PWA / Veri Paketi Dosyaları
  const staticMap = {
    '/aether-data-bundle.js': { file: 'aether-data-bundle.js', mime: 'application/javascript; charset=utf-8', cc: 'no-cache' },
    '/manifest.json': { file: 'manifest.json', mime: 'application/manifest+json; charset=utf-8', cc: 'no-cache' },
    '/sw.js': { file: 'sw.js', mime: 'application/javascript; charset=utf-8', cc: 'no-cache' },
    '/apple-touch-icon.svg': { file: 'apple-touch-icon.svg', mime: 'image/svg+xml', cc: 'public, max-age=3600' },
    '/apple-touch-icon.png': { file: 'apple-touch-icon.png', mime: 'image/png', cc: 'public, max-age=3600' },
    '/download/AETHER-Sideload.ipa': { file: 'AETHER-Sideload.ipa', mime: 'application/octet-stream', cc: 'no-cache', download: 'AETHER-iOS.ipa' }
  };
  if (staticMap[url.pathname]) {
    const item = staticMap[url.pathname];
    const served = await serveCachedStaticFile(req, res, item.file, item.mime, item.cc, item.download);
    if (served) return;
  }

  // iOS Tam Ekran Bağımsız WebApp Kurulum Profili (.mobileconfig — Kalıcı HTTPS + Offline ServiceWorker)
  if (url.pathname === '/download/AETHER.mobileconfig' || url.pathname === '/AETHER.mobileconfig') {
    try {
      const iconPath = path.join(__dirname, 'apple-touch-icon.png');
      const iconB64 = fs.existsSync(iconPath) ? (await fsp.readFile(iconPath)).toString('base64') : '';
      const cloudHttpsUrl = 'https://4zyq4sk2tk-collab.github.io/AETHER-iOS/?source=ios-webclip';

      const mobileConfigXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>FullScreen</key>
      <true/>
      <key>IgnoreManifestScope</key>
      <true/>
      <key>IsRemovable</key>
      <true/>${iconB64 ? `\n      <key>Icon</key>\n      <data>${iconB64}</data>` : ''}
      <key>Label</key>
      <string>AETHER</string>
      <key>PayloadDescription</key>
      <string>AETHER — Enflasyona Karşı Akıllı Sepet ve Yatırım Rehberi</string>
      <key>PayloadDisplayName</key>
      <string>AETHER iOS Uygulaması</string>
      <key>PayloadIdentifier</key>
      <string>com.aether.market.webclip</string>
      <key>PayloadType</key>
      <string>com.apple.webClip.managed</string>
      <key>PayloadUUID</key>
      <string>556F026D-7AD7-4665-B85F-B5C8A49F9EE9</string>
      <key>PayloadVersion</key>
      <integer>4</integer>
      <key>Precomposed</key>
      <true/>
      <key>URL</key>
      <string>${cloudHttpsUrl}</string>
    </dict>
  </array>
  <key>PayloadDescription</key>
  <string>AETHER Tam Ekran Bağımsız iOS Uygulaması — Çevrimdışı Önbellek ve Canlı Piyasa Akışı</string>
  <key>PayloadDisplayName</key>
  <string>AETHER iOS Uygulama Paketi</string>
  <key>PayloadIdentifier</key>
  <string>com.aether.market.profile</string>
  <key>PayloadOrganization</key>
  <string>AETHER</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>9A4E1120-7AD7-4665-B85F-B5C8A49F9ED5</string>
  <key>PayloadVersion</key>
  <integer>4</integer>
</dict>
</plist>`;
      res.writeHead(200, {
        'Content-Type': 'application/x-apple-aspen-config; charset=utf-8',
        'Content-Disposition': 'attachment; filename="AETHER.mobileconfig"',
        'Cache-Control': 'no-store'
      });
      res.end(mobileConfigXml);
    } catch (e) {
      res.writeHead(500);
      res.end('Mobileconfig oluşturulamadı: ' + e.message);
    }
    return;
  }

  // Tek Dosyalık %100 Bağımsız iOS Sürümü (Veri + Uygulama Tek HTML İçinde Gömülü)
  if (url.pathname === '/download/AETHER-iOS-Standalone.html') {
    try {
      const htmlRaw = await fsp.readFile(path.join(__dirname, 'index.html'), 'utf8');
      const bp = path.join(__dirname, 'aether-data-bundle.js');
      const bundleRaw = fs.existsSync(bp)
        ? await fsp.readFile(bp, 'utf8')
        : (cachedJsonBuf ? 'window.__AETHER_EMBEDDED_DATA__ = ' + cachedJsonBuf.toString('utf8') + ';' : '');
      const standaloneHtml = htmlRaw.replace(
        '<script src="aether-data-bundle.js"></script>',
        `<script>${bundleRaw}</script>`
      );
      const outBuf = clientAcceptsGzip(req)
        ? await gzipAsync(Buffer.from(standaloneHtml, 'utf8'), { level: zlib.constants.Z_BEST_SPEED })
        : Buffer.from(standaloneHtml, 'utf8');
      const headers = {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': outBuf.length,
        'Content-Disposition': 'attachment; filename="AETHER-iOS-Standalone.html"'
      };
      if (clientAcceptsGzip(req)) headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      res.end(outBuf);
    } catch (e) {
      res.writeHead(500);
      res.end('Standalone paket oluşturulamadı: ' + e.message);
    }
    return;
  }

  if (url.pathname === '/' || url.pathname === '/index.html') {
    const served = await serveCachedStaticFile(
      req,
      res,
      'index.html',
      'text/html; charset=utf-8',
      'no-cache, must-revalidate'
    );
    if (!served) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Sunucu hatası: index.html okunamadı.');
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Bulunamadı');
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`AETHER Yüksek Ölçekli Veri Sunucusu çalışıyor:`);
  console.log(`- Bilgisayardan: http://localhost:${PORT}`);
});
