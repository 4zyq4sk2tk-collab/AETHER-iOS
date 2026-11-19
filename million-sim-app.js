// ============================================================================
// AETHER v19.0.0 — HERKESİN ANLAYABİLECEĞİ MODERN, FERAH VE 100/100
// UZMANLIK DERİNLİKLİ GERÇEK 2026 TÜRKİYE YATIRIM MEYDANI UYGULAMASI
// Limit/Stop/Kâr Al · 5 Kademe Tahta · 5 Soruda Röntgen · 6 Çok Aşamalı Tatbikat
// 9 Canlı Laboratuvar (2026 Vergi & BES) · 48 Saha Vakası · 24 Akademi Modülü · 84 Terim
// ============================================================================
(function (global) {
  'use strict';

  const CURATED_VITRIN_KEYS = [
    'gram-altin-spot',
    'kira-sertifikasi-sukuk',
    'para-piyasasi-fonu',
    'mevduat-ust',
    'doviz-usd',
    'doviz-eur',
    'bist-tuprs',
    'bist-thyao',
    'bist-froto',
    'reel-perakende-bimas',
    'bist-asels',
    'tefas-mac',
    'bist-eregl',
    'reel-enerji-astor',
    'gayrimenkul-konut-ekgyo',
    'altin-sertifikasi',
    'gram-gumus-spot',
    'tefas-aft',
    'abd-sp500-spy',
    'kuresel-hisse-nvda',
    'kripto-btc'
  ];

  // Uygulama Durumu
  let activeTab = 'home'; // home | market | compass | mastery | family
  let homeSubTab = 'TODAY'; // TODAY | HOLDINGS | QUEUES
  let compassSubTab = 'BRIEF'; // BRIEF | CHAINS | CRISIS | KITCHEN_CAL
  let walletSubTab = 'HOLDINGS'; // HOLDINGS | QUEUES | LEDGER (geriye uyumluluk)
  let masterySubTab = 'MIRROR'; // MIRROR | LABS | CASES | MANUAL
  let labToolId = 'DRILL'; // DRILL | DETECTIVE | BAKERY | KAP_READER | BREAKEVEN | GVK80 | BES2026 | BASKET | FREEDOM
  let marketViewMode = 'LIST'; // LIST | BENTO
  let marketSortBy = 'DEFAULT'; // DEFAULT | FORENSIC_SCORE | CHANGE_DESC | CHANGE_ASC | DISCOUNT_52W
  let marketShowProTools = false;
  let activeLens = 'VITRIN'; // VITRIN | CUSTOM_SCREENER | EARLY_SIGNALS | HARVEST_VALUE | FIRE_SALE | BAKERY_CASH | PASSIVE_RIVER | ROTTEN_TRAPS | IPO_DIVIDEND
  let activeCategory = 'ALL'; // ALL | GOLD_COMMODITY | RATE_SUKUK | FX | BIST_ALL | FUNDS | GLOBAL_CRYPTO | SAFE_HAVEN
  let bistSectorFilter = 'ALL';
  let bistVisibleLimit = 100;
  let lastMarketMatchTotal = 0;
  let searchQuery = '';
  let screenerSelectedIds = null; // null -> kernel'den yüklenir
  let kitchenDeskId = 'BREAKEVEN'; // BREAKEVEN | AUDIT_BARBELL | TMS29 | MKK_WHALE | PATTERNS | CAPEX_VALUE | FIELD_BDDK
  let calcAmountTL = 250000;
  let calcDays = 32;
  let caseFilterCat = 'ALL';
  let caseDiffFilter = 'ALL'; // ALL | Temel | Orta | Uzman
  let manualSearchQuery = '';
  let detectiveSeed = (Math.floor(Date.now() / 1000) % 89999) + 101;
  let detectivePickedSide = null; // null | 'LEFT' | 'RIGHT'
  let dailyPickedChoiceId = null;
  let activeDrillId = 'drill_tcmb_thursday';
  let drillStageIdx = 0;
  let drillCapitalTL = 1000000;
  let drillScore = 0;
  let drillPickedChoice = null;
  let drillHistory = [];
  let labTaxSub = 'GVK80'; // GVK80 | DIVIDEND | EUROBOND
  let labDivGrossTL = 850000;
  let labEbCouponTL = 420000;
  let labBesMonthlyTL = 15000;
  let labBesYears = 10;
  let labBesStartAge = 35;
  let labBesRealPct = 10;
  let compassNewsVisible = 5;
  let compassNewsFilter = 'ALL';
  let casesVisibleLimit = 10;
  let academyStageFilter = 'ALL';
  let homeBasketOpen = false;
  let homeDailyOpen = false;
  let drawerBuyMode = 'MARKET'; // MARKET | LIMIT
  let drawerSellMode = 'MARKET'; // MARKET | STOP_LOSS | TAKE_PROFIT
  let draftTriggerPriceTL = 0;
  let fwMonthlyAddTL = 15000;
  let fwRealReturnPct = 10;
  let fwMonthlyExpTL = 45000;
  let fwYears = 10;
  // İnteraktif Laboratuvar & Domino Durumları
  let labBakeryKey = 'bist-tuprs';
  let labBakerySearch = '';
  let labBakeryAmt = 100000;
  let labGvkBuy = 500000;
  let labGvkSell = 780000;
  let labGvkUfe = 12;
  let labBasketWeight = 100;
  let labBasketDrop = 50;
  let dominoOil = 20;
  let dominoUsd = 10;
  let dominoRate = 0;
  let dominoDrought = false;
  // Ana Sayfa Canlı Sepet Terazisi & KAP Okuyucu Durumları
  let hbPresetId = 'FOUR_SEASON';
  let hbSukukPct = 40;
  let hbGoldPct = 25;
  let hbEquityPct = 25;
  let kapReaderId = 'kap_new_contract';
  let kapCheckedMap = {};
  let stagedOtaVersion = null;

  let selectedChainId = 'chain-oil';
  let selectedNewsId = null;
  let selectedCrisisId = 'STRAIT_BLOCKADE';
  let leagueSortBy = 'NET_WORTH'; // NET_WORTH | PNL_PCT | MASTERY
  let starterGuideDismissed = false;
  let preOpenBriefDismissed = false;
  let uiTheme = 'obsidian'; // obsidian | daylight
  let uiFontScale = 'normal'; // normal | large (Aa+ Rahat Okuma Modu)

  // Alt Çekmece (Bottom Sheet) Durumu
  let modalMode = null; // 'ASSET' | 'WELCOME' | 'PROFILE' | 'PEER_XRAY' | 'INSTALL' | 'RESET_CONFIRM' | null
  let drawerAssetKey = null;
  let drawerSubTab = 'ORDER'; // ORDER | VAULT | DUEL | LOGIC
  let drawerChartRange = '1Y'; // 1D | 1W | 1M | 3M | 1Y | 5Y
  let drawerChartReality = 'TL'; // TL | REAL | USD
  let activeChartToken = 0;
  let duelRivalKey = null;
  let duelSearchQuery = '';
  let drawerOrderSide = 'BUY'; // BUY | SELL
  let drawerOpenedAtMs = 0;
  let inspectedPeerId = null;
  let selectedDoor = 'BAZAAR'; // BAZAAR | NOBETCI | BANK
  let selectedMaturity = 32;
  let selectedUseMargin = false;
  let selectedThesisTag = 'RESEARCH_FUNDAMENTAL';
  let draftThesisNote = '';
  let draftOrderAmount = 100000;
  let draftSellRatio = 1;
  let draftSellQty = null;
  let lastDrawerFeedback = null;
  let lastIpoFeedback = null;
  let lastPortfolioFeedback = null;

  let toastTimer = null;
  let lastKnownTradeFeedId = null;
  let knownNewsFeedIds = new Set();
  let newsTrackerReady = false;
  let deferredPwaPrompt = null;
  let lastHeaderPhaseSig = '';

  function isRunningAsInstalledApp() {
    try {
      return Boolean(
        global.__AETHER_NATIVE_IOS_APP__ ||
        global.navigator?.standalone === true ||
        global.matchMedia?.('(display-mode: standalone)')?.matches ||
        global.location?.protocol === 'file:'
      );
    } catch (_) {
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // 1. NATIVE iOS HAPTIC, TEMA, PAYLAŞIM & DYNAMIC ISLAND BİLDİRİM KÖPRÜSÜ
  // --------------------------------------------------------------------------
  const AetherNative = {
    haptic(style = 'light') {
      try {
        if (global.webkit?.messageHandlers?.aetherBridge) {
          global.webkit.messageHandlers.aetherBridge.postMessage({ action: 'haptic', style });
          return;
        }
        if (global.navigator?.vibrate) {
          const ms = style === 'error' ? [18, 30, 24] : (style === 'success' ? [12, 24, 14] : (style === 'selection' ? 6 : 10));
          global.navigator.vibrate(ms);
        }
      } catch (_) {}
    },

    applyTheme(themeName, persist = true) {
      uiTheme = themeName === 'daylight' ? 'daylight' : 'obsidian';
      if (global.document?.documentElement) {
        global.document.documentElement.setAttribute('data-theme', uiTheme);
      }
      const meta = global.document?.getElementById('aeThemeColorMeta');
      if (meta) {
        meta.setAttribute('content', uiTheme === 'daylight' ? '#eef2f7' : '#060a12');
      }
      if (persist) {
        try { global.localStorage?.setItem('aether_ui_theme', uiTheme); } catch (_) {}
      }
      try {
        if (global.webkit?.messageHandlers?.aetherBridge) {
          global.webkit.messageHandlers.aetherBridge.postMessage({ action: 'setTheme', theme: uiTheme });
        }
      } catch (_) {}
    },

    toggleTheme() {
      this.haptic('selection');
      this.applyTheme(uiTheme === 'obsidian' ? 'daylight' : 'obsidian', true);
      renderHeader();
    },

    applyFontScale(scaleName, persist = true) {
      uiFontScale = scaleName === 'large' ? 'large' : 'normal';
      if (global.document?.documentElement) {
        global.document.documentElement.setAttribute('data-font-scale', uiFontScale);
      }
      if (persist) {
        try { global.localStorage?.setItem('aether_font_scale', uiFontScale); } catch (_) {}
      }
    },

    toggleFontScale() {
      this.haptic('selection');
      this.applyFontScale(uiFontScale === 'large' ? 'normal' : 'large', true);
      this.toast(uiFontScale === 'large' ? 'Rahat Okuma (Büyük Yazı) açıldı' : 'Standart yazı boyutuna dönüldü', 'ok');
      renderHeader();
    },

    toast(text, tone = 'info', onTap = null) {
      const el = document.getElementById('aeIslandToast');
      if (!el || !text) return;
      el.style.top = 'auto';
      const dotColor = tone === 'ok' ? '#10b981' : (tone === 'err' ? '#f43f5e' : '#fbbf24');
      el.innerHTML = `<span class="ae-island-dot" style="background:${dotColor};box-shadow:0 0 10px ${dotColor}"></span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:80vw">${esc(text)}</span>`;
      el.onclick = () => {
        el.classList.remove('show');
        if (typeof onTap === 'function') onTap();
      };
      el.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        el.classList.remove('show');
      }, 3600);
    },

    scheduleLocalPush(id, title, body, delaySec = 1) {
      try {
        if (global.webkit?.messageHandlers?.aetherBridge) {
          global.webkit.messageHandlers.aetherBridge.postMessage({
            action: 'scheduleNotification',
            id: String(id || 'ae_push'),
            title: String(title || 'AETHER'),
            body: String(body || ''),
            delaySec: Math.max(1, Number(delaySec) || 1)
          });
          return;
        }
        if (typeof global.Notification !== 'undefined' && global.Notification.permission === 'granted' && global.document?.visibilityState === 'hidden') {
          new global.Notification(String(title || 'AETHER'), { body: String(body || ''), icon: './apple-touch-icon.png' });
        }
      } catch (_) {}
    },

    async share({ title, text, url }) {
      this.haptic('medium');
      if (global.webkit?.messageHandlers?.aetherBridge) {
        try {
          global.webkit.messageHandlers.aetherBridge.postMessage({
            action: 'share',
            title: title || 'AETHER 1M Yatırımcı Ligi',
            text: text || '',
            url: url || ''
          });
          return;
        } catch (_) {}
      }
      if (global.navigator?.share) {
        try {
          await global.navigator.share({ title, text, url });
          return;
        } catch (_) {}
      }
      try {
        await global.navigator?.clipboard?.writeText([text, url].filter(Boolean).join(' '));
        this.toast('Davet bağlantısı panoya kopyalandı!', 'ok');
      } catch (_) {
        this.toast(text || 'Oda kodu: ORTAK-LIG', 'info');
      }
    },

    canSpeak() {
      try {
        if (global.__AETHER_NATIVE_TTS__ && global.webkit?.messageHandlers?.aetherBridge) return true;
        return typeof global.speechSynthesis !== 'undefined' && typeof global.SpeechSynthesisUtterance !== 'undefined';
      } catch (_) {
        return false;
      }
    },

    stopSpeak() {
      try {
        if (global.__AETHER_NATIVE_TTS__ && global.webkit?.messageHandlers?.aetherBridge) {
          global.webkit.messageHandlers.aetherBridge.postMessage({ action: 'stopSpeak' });
        }
        if (global.speechSynthesis) global.speechSynthesis.cancel();
      } catch (_) {}
    },

    speak(text) {
      this.haptic('selection');
      if (!this.canSpeak()) {
        this.toast('Bu cihazda sesli okuma desteklenmiyor.', 'info');
        return;
      }
      try {
        const clean = String(text || '').replace(/[^\p{L}\p{N}\s.,;:!?%+\-₺$]/gu, ' ').replace(/\s+/g, ' ').trim();
        if (!clean) return;
        if (global.__AETHER_NATIVE_TTS__ && global.webkit?.messageHandlers?.aetherBridge) {
          global.webkit.messageHandlers.aetherBridge.postMessage({ action: 'speak', text: clean });
          return;
        }
        const syn = global.speechSynthesis;
        if (syn.speaking) {
          syn.cancel();
          this.toast('Sesli anlatım durduruldu', 'info');
          return;
        }
        const utt = new global.SpeechSynthesisUtterance(clean);
        utt.lang = 'tr-TR';
        utt.rate = 0.96;
        utt.pitch = 1.0;
        const voices = syn.getVoices ? syn.getVoices() : [];
        const trVoice = voices.find((v) => String(v.lang || '').toLowerCase().startsWith('tr'));
        if (trVoice) utt.voice = trVoice;
        syn.speak(utt);
        this.toast('🔊 Dost sesli anlatıyor (durdurmak için tekrar dokun)', 'ok');
      } catch (_) {}
    }
  };

  // --------------------------------------------------------------------------
  // 2. YARDIMCI BİÇİMLENDİRİCİLER VE MİNİ SVG ÜRETİCİLERİ
  // --------------------------------------------------------------------------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const TR_INT = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
  const TR_DEC2 = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const TR_DEC4 = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 4 });

  function fmtTL(n) {
    return TR_INT.format(Math.round(Number(n) || 0)) + ' ₺';
  }

  function fmtInt(n) {
    return TR_INT.format(Math.round(Number(n) || 0));
  }

  function fmtCompactTL(n) {
    const v = Number(n) || 0;
    const abs = Math.abs(v);
    const sign = v < 0 ? '-' : '';
    if (abs >= 1000000) return sign + TR_DEC2.format(abs / 1000000) + ' Mn ₺';
    if (abs >= 10000) return sign + TR_INT.format(Math.round(abs / 1000)) + ' Bin ₺';
    return TR_INT.format(Math.round(v)) + ' ₺';
  }

  function fmtUnitTL(n) {
    const v = Number(n) || 0;
    if (v >= 1000) return TR_INT.format(Math.round(v)) + ' ₺';
    if (v >= 1) return TR_DEC2.format(v) + ' ₺';
    return TR_DEC4.format(v) + ' ₺';
  }

  function fmtAgo(ts) {
    if (!ts) return 'Az önce';
    const diffSec = Math.max(0, Math.floor((Date.now() - Number(ts)) / 1000));
    if (diffSec < 65) return 'Şimdi Açık';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} dk önce`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} sa önce`;
    return `${Math.floor(diffSec / 86400)} gün önce`;
  }

  function fmtCountdown(targetMs) {
    const diff = Math.max(0, Number(targetMs || 0) - Date.now());
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Birazdan';
    if (mins < 60) return `${mins} dk kaldı`;
    const hrs = Math.floor(mins / 60);
    const remM = mins % 60;
    if (hrs < 24) return `${hrs} sa ${remM} dk`;
    const days = Math.floor(hrs / 24);
    return `${days} gün ${hrs % 24} sa`;
  }

  function initials(name) {
    const parts = String(name || 'Y').trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toLocaleUpperCase('tr-TR');
    return String(parts[0] || 'Y').slice(0, 2).toLocaleUpperCase('tr-TR');
  }

  function buildMiniSparkSvg(asset) {
    if (!asset) return '';
    if (asset.isRateInstrument) {
      return `
        <svg viewBox="0 0 68 26" width="68" height="26" aria-hidden="true">
          <path d="M2,22 L18,18 L34,14 L50,10 L66,5" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    }
    let pts = asset.trainedDaily?.radar?.sparklinePts;
    if (!Array.isArray(pts) || pts.length < 4) {
      const c = 100;
      const p1d = c / Math.max(0.2, 1 + (Number(asset.change1D) || 0) / 100);
      const p1w = c / Math.max(0.2, 1 + (Number(asset.perf1W) || 0) / 100);
      const p1m = c / Math.max(0.2, 1 + (Number(asset.perf1M) || 0) / 100);
      const raw = [p1m, (p1m + p1w) / 2, p1w, (p1w + p1d) / 2, p1d, c];
      const mn = Math.min(...raw);
      const mx = Math.max(...raw);
      const sp = Math.max(0.4, mx - mn);
      pts = raw.map((v) => ((v - mn) / sp) * 80 + 10);
    }
    const sample = pts.length > 8 ? pts.slice(-8) : pts;
    const w = 66, h = 24;
    const coords = sample.map((v, i) => {
      const x = +((i / Math.max(1, sample.length - 1)) * w + 1).toFixed(1);
      const y = +(h - (Math.max(5, Math.min(95, Number(v) || 50)) / 100) * (h - 4) - 2).toFixed(1);
      return `${x},${y}`;
    });
    const up = (Number(asset.change1D) || 0) >= 0;
    const stroke = up ? '#10b981' : '#f43f5e';
    return `
      <svg viewBox="0 0 68 26" width="68" height="26" aria-hidden="true">
        <polyline points="${coords.join(' ')}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  function renderAllocRibbonHtml(ab) {
    if (!ab) return '';
    return `
      <div class="ms-alloc-ribbon" title="Portföy Varlık Dağılımı">
        <div class="ms-alloc-seg eq" style="width:${ab.equityPct}%"></div>
        <div class="ms-alloc-seg mt" style="width:${ab.metalPct}%"></div>
        <div class="ms-alloc-seg fi" style="width:${ab.fixedPct}%"></div>
        <div class="ms-alloc-seg fx" style="width:${ab.globalFxCryptoPct}%"></div>
        <div class="ms-alloc-seg ca" style="width:${ab.cashPct}%"></div>
      </div>
      <div class="ms-alloc-legend">
        ${ab.equityPct > 0.4 ? `<span><i style="background:#3b82f6"></i>Hisse %${ab.equityPct}</span>` : ''}
        ${ab.metalPct > 0.4 ? `<span><i style="background:#f59e0b"></i>Altın/Emtia %${ab.metalPct}</span>` : ''}
        ${ab.fixedPct > 0.4 ? `<span><i style="background:#10b981"></i>Sabit %${ab.fixedPct}</span>` : ''}
        ${ab.globalFxCryptoPct > 0.4 ? `<span><i style="background:#a855f7"></i>Döviz/Küresel %${ab.globalFxCryptoPct}</span>` : ''}
        ${ab.cashPct > 0.4 ? `<span><i style="background:#64748b"></i>Nakit/Takas %${ab.cashPct}</span>` : ''}
      </div>
    `;
  }

  function renderPortfolioEquityChartSvg(member, snap) {
    const curve = Array.isArray(member?.equityCurve) && member.equityCurve.length > 0
      ? [...member.equityCurve]
      : [{ ts: member?.createdAt || Date.now() - 3600000, nw: snap.baselineTL, base: snap.baselineTL }];
    const nowPt = { ts: Date.now(), nw: Math.round(snap.totalNetWorthTL), base: Math.round(snap.baselineTL) };
    if (curve.length === 1) {
      curve.push(nowPt);
    } else {
      curve[curve.length - 1] = nowPt;
    }

    const vals = curve.map((p) => Number(p.nw) || snap.baselineTL);
    const baseVal = Number(snap.baselineTL) || 1000000;
    const minV = Math.min(...vals, baseVal) * 0.9985;
    const maxV = Math.max(...vals, baseVal) * 1.0015;
    const span = Math.max(500, maxV - minV);
    const w = 340, h = 86;

    const coords = curve.map((p, i) => {
      const x = +((i / Math.max(1, curve.length - 1)) * w).toFixed(1);
      const y = +(h - (((Number(p.nw) || baseVal) - minV) / span) * (h - 14) - 7).toFixed(1);
      return { x, y, nw: p.nw, ts: p.ts };
    });
    const baseY = +(h - ((baseVal - minV) / span) * (h - 14) - 7).toFixed(1);
    const ptsStr = coords.map((c) => `${c.x},${c.y}`).join(' ');
    const areaStr = `0,${h} ${ptsStr} ${w},${h}`;
    const isUp = snap.nominalPnlTL >= 0;
    const stroke = isUp ? '#10b981' : '#f43f5e';
    const gradId = isUp ? 'aeEqGradUp' : 'aeEqGradDn';
    const lastC = coords[coords.length - 1];

    return `
      <div style="margin:10px 0 6px;position:relative">
        <svg id="aePortfolioChartSvg" viewBox="0 0 ${w} ${h}" style="width:100%;height:88px;display:block;overflow:visible" preserveAspectRatio="none" aria-label="Portföy Değer Eğrisi">
          <defs>
            <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${stroke}" stop-opacity="0.28"/>
              <stop offset="100%" stop-color="${stroke}" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <line x1="0" y1="${baseY}" x2="${w}" y2="${baseY}" stroke="rgba(148,163,184,0.32)" stroke-width="1" stroke-dasharray="4 4"/>
          <polygon points="${areaStr}" fill="url(#${gradId})"/>
          <polyline points="${ptsStr}" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="${lastC.x}" cy="${lastC.y}" r="4" fill="${stroke}" stroke="#ffffff" stroke-width="1.5"/>
        </svg>
        <div style="display:flex;justify-content:space-between;font-size:10.4px;color:var(--ink-500);font-weight:700">
          <span>Başlangıç: ${fmtCompactTL(baseVal)}</span>
          <span>Enflasyon Barajı: ${fmtTL(snap.inflationTargetTL)}</span>
        </div>
      </div>
    `;
  }

  function renderMasteryHexagonSvg(axes) {
    if (!Array.isArray(axes) || axes.length < 6) return '';
    const cx = 130, cy = 112, rMax = 74;
    const angleAt = (i) => (-Math.PI / 2) + (i * (2 * Math.PI / 6));
    const ptAt = (i, ratio) => {
      const a = angleAt(i);
      return `${+(cx + Math.cos(a) * rMax * ratio).toFixed(1)},${+(cy + Math.sin(a) * rMax * ratio).toFixed(1)}`;
    };

    const rings = [0.33, 0.66, 1.0].map((rt) =>
      `<polygon points="${[0, 1, 2, 3, 4, 5].map((i) => ptAt(i, rt)).join(' ')}" fill="none" stroke="rgba(148,163,184,0.18)" stroke-width="1"/>`
    ).join('');

    const spokes = [0, 1, 2, 3, 4, 5].map((i) => {
      const end = ptAt(i, 1.0).split(',');
      return `<line x1="${cx}" y1="${cy}" x2="${end[0]}" y2="${end[1]}" stroke="rgba(148,163,184,0.15)" stroke-width="1"/>`;
    }).join('');

    const valPoly = axes.slice(0, 6).map((ax, i) => ptAt(i, Math.max(0.15, Math.min(1, (Number(ax.score) || 50) / 100)))).join(' ');
    const shortLabels = ['Kasa', 'Denge', 'Maliyet', 'Sabır', 'Araştırma', 'Kalkan'];
    const labelsSvg = axes.slice(0, 6).map((ax, i) => {
      const a = angleAt(i);
      const lx = +(cx + Math.cos(a) * (rMax + 24)).toFixed(1);
      const ly = +(cy + Math.sin(a) * (rMax + 17)).toFixed(1);
      return `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" fill="var(--ink-200)" font-size="10.2" font-weight="800">${shortLabels[i]} ${ax.score}</text>`;
    }).join('');

    return `
      <svg viewBox="0 0 260 224" style="width:100%;max-width:270px;height:auto;display:block;margin:0 auto" aria-label="6 Eksenli Ustalık Radarı">
        ${rings}
        ${spokes}
        <polygon points="${valPoly}" fill="rgba(245, 158, 11, 0.24)" stroke="#fbbf24" stroke-width="2.3" stroke-linejoin="round"/>
        ${axes.slice(0, 6).map((ax, i) => {
          const [px, py] = ptAt(i, Math.max(0.15, Math.min(1, (Number(ax.score) || 50) / 100))).split(',');
          return `<circle cx="${px}" cy="${py}" r="3.5" fill="#fbbf24" stroke="#060a12" stroke-width="1.2"/>`;
        }).join('')}
        ${labelsSvg}
      </svg>
    `;
  }

  // --------------------------------------------------------------------------
  // 2.5 HER YERDEN TEK DOKUNUŞ TERİM AÇIKLAYICI KATMANI (10 SANİYEDE NET ÖZET)
  // --------------------------------------------------------------------------
  function closeTermPopover() {
    AetherNative.stopSpeak();
    const ov = document.getElementById('aeTermOverlay');
    if (ov) ov.hidden = true;
  }

  function openTermPopover(termQuery) {
    const G = global.RealInvestmentGuide;
    const ov = document.getElementById('aeTermOverlay');
    const card = document.getElementById('aeTermCard');
    if (!ov || !card || !G?.lookupTermByKey) return;
    const hit = G.lookupTermByKey(termQuery);
    if (!hit) return;
    AetherNative.haptic('light');
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px">
        <div style="min-width:0;flex:1">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span class="ms-sig-pill info">💡 10 Saniyede Dost Anlatımı · ${esc(hit.cat)}</span>
            ${AetherNative.canSpeak() ? `<button type="button" class="ae-term-pill" id="aeSpeakTermBtn" style="padding:3px 9px;font-size:11.2px">🔊 Sesli Dinle</button>` : ''}
          </div>
          <h3 style="margin:7px 0 0;font-size:18.5px;font-weight:900;line-height:1.25">${esc(hit.term)}</h3>
        </div>
        <button type="button" class="ae-clear-btn" id="aeCloseTermX" style="position:static;transform:none;width:32px;height:32px;font-size:18px" aria-label="Kapat">×</button>
      </div>
      <div style="background:var(--surface-2);border-radius:14px;padding:13px 14px;margin-bottom:10px;font-size:14.2px;line-height:1.52;color:var(--ink-100)">
        <strong style="display:block;color:var(--gold-bright);font-size:12px;margin-bottom:4px">🥖 En Sade Haliyle Nedir?</strong>
        ${esc(hit.street)}
      </div>
      <div style="background:var(--surface-2);border-left:3.5px solid var(--cyan);border-radius:11px;padding:11px 13px;margin-bottom:14px;font-size:13px;line-height:1.48;color:var(--ink-200)">
        <strong style="display:block;color:var(--cyan);font-size:11.6px;margin-bottom:3px">🦅 Uzman Kuralı & Gerçek Eşik:</strong>
        ${esc(hit.pro)}
      </div>
      <button type="button" class="ae-big-btn gold" style="width:100%" id="aeCloseTermOk">Anladım, Devam Et</button>
    `;
    ov.hidden = false;
    document.getElementById('aeSpeakTermBtn')?.addEventListener('click', () => {
      AetherNative.speak(`${hit.term}. En sade haliyle: ${hit.street}. Uzman kuralı: ${hit.pro}`);
    });
    document.getElementById('aeCloseTermX')?.addEventListener('click', closeTermPopover);
    document.getElementById('aeCloseTermOk')?.addEventListener('click', closeTermPopover);
  }

  function bindTermExplainClicks(root) {
    if (!root) return;
    root.querySelectorAll('[data-explain-term]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        openTermPopover(el.getAttribute('data-explain-term'));
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. ÜST NATIVE KOKPİT ÇUBUĞU VE ALT SEKME ROZETLERİ
  // --------------------------------------------------------------------------
  function updateBottomDockBadges(snap, league, unreadNews) {
    const leagueBadge = document.getElementById('msLeagueTabBadge');
    if (leagueBadge) {
      leagueBadge.textContent = String(Math.max(1, league.investorCount));
    }
    const compassDot = document.getElementById('aeCompassBadge');
    if (compassDot) {
      compassDot.hidden = !(unreadNews > 0);
    }
    const walletBadge = document.getElementById('aeWalletBadge');
    if (walletBadge) {
      const activeQ = (snap.unsettledTL > 0 ? 1 : 0) + (snap.pendingOrderTL > 0 ? 1 : 0) + (snap.ipoBlockedTL > 0 ? 1 : 0);
      walletBadge.hidden = activeQ === 0;
      if (activeQ > 0) walletBadge.textContent = String(activeQ);
    }
  }

  function renderHeader() {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    if (!K || !G) return;
    const me = K.getActiveMember();
    const clock = K.getTurkishClock();
    const snap = K.evaluateMemberPortfolio(me);
    const mastery = K.evaluateInvestorMastery(me, snap);
    const league = K.getLeagueStatus();
    const feed = G.getEnrichedLiveNewsFeed() || [];
    const unreadNews = K.getUnreadDisclosureCount ? K.getUnreadDisclosureCount(feed.map((x) => x.id)) : 0;

    updateBottomDockBadges(snap, league, unreadNews);

    const topbarEl = document.getElementById('msHeader');
    if (!topbarEl) return;

    const pnlSign = snap.nominalPnlTL >= 0 ? '+' : '';
    const pnlCls = snap.nominalPnlTL > 0 ? 'pos' : (snap.nominalPnlTL < 0 ? 'neg' : '');
    lastHeaderPhaseSig = `${clock.bistPhase}|${clock.grandBazaarOpen}|${clock.nobetciOpen}|${clock.tefasBeforeCutoff}|${uiTheme}|${uiFontScale}|${unreadNews}|${activeTab}`;

    const sessionShort = clock.bistCanMatchNow
      ? 'Borsa İstanbul Açık'
      : (clock.viopEvening ? 'Borsa Kapalı · VİOP Akşam Açık' : (clock.globalNyOpen ? 'ABD Açık · Borsa İstanbul Kapalı' : (clock.isWeekend ? 'Hafta Sonu · Kripto & Nöbetçi Açık' : 'Borsa Kapalı · Açılış 09:55')));

    topbarEl.innerHTML = `
      <div id="msHeaderInner" class="ae-topbar-inner">
        <button type="button" class="ae-ident-btn" id="msOpenProfileBtn" title="Profil, Oda ve Maaş Ayarları">
          <span class="ae-avatar" style="background:${esc(me.avatarColor || '#2563eb')}">${esc(initials(me.profileRegistered ? me.name : 'Ben'))}</span>
          <span class="ae-ident-meta">
            <span class="ae-ident-name">${esc(me.profileRegistered ? me.name : 'Adını Kaydet')}</span>
            <span class="ae-ident-sub">${esc(mastery.rankTitle)} · ${mastery.overallScore}p</span>
          </span>
        </button>

        <div class="ae-top-right">
          ${activeTab !== 'home' ? `
            <button type="button" class="ae-worth-pill" id="aeQuickWalletBtn" title="Ana Sayfa ve Cüzdanıma Git">
              <strong>${fmtCompactTL(snap.totalNetWorthTL)}</strong>
              <small class="${pnlCls}">${pnlSign}%${snap.nominalPnlPct}</small>
            </button>
          ` : ''}

          <button type="button" class="ae-icon-btn ${uiFontScale === 'large' ? 'font-active' : ''}" id="aeFontToggleBtn" title="${uiFontScale === 'large' ? 'Standart Yazıya Dön' : 'Rahat Okuma (Büyük Yazı) Aç'}" style="font-size:13px;font-weight:900;width:38px">
            Aa+
          </button>

          <button type="button" class="ae-icon-btn" id="aeNotifBellBtn" title="Canlı KAP & Resmi Akış">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            ${unreadNews > 0 ? `<span class="ae-notif-badge">${unreadNews}</span>` : ''}
          </button>

          <button type="button" class="ae-icon-btn" id="aeThemeToggleBtn" title="${uiTheme === 'obsidian' ? 'Gündüz Moduna Geç' : 'Obsidian Gece Moduna Geç'}">
            ${uiTheme === 'obsidian' ? `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4.5"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            ` : `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            `}
          </button>
        </div>
      </div>

      <div class="ae-session-microbar">
        <span class="ae-live-status">
          <span class="ms-dot ${clock.bistCanMatchNow ? 'open' : (clock.viopEvening ? '' : 'closed')}"></span>
          <strong id="msLiveClockTime" style="color:var(--ink-200)">${esc(clock.timeStr)}</strong>
          <span>· ${esc(sessionShort)}</span>
        </span>
        <button type="button" id="aeHeaderClockHelpBtn" style="appearance:none;border:none;background:none;color:var(--cyan);font-size:11.2px;font-weight:800;cursor:pointer;padding:0;white-space:nowrap">
          Saatler ›
        </button>
      </div>

      ${clock.calendarAlerts.length > 0 ? `
        <div style="max-width:1080px;margin:5px auto 0;background:var(--amber-soft);border:1px solid rgba(245,158,11,0.35);color:var(--amber-ink);border-radius:10px;padding:5px 10px;font-size:11.6px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ⚡ ${esc(clock.calendarAlerts[0])}
        </div>
      ` : ''}
    `;

    document.getElementById('msOpenProfileBtn')?.addEventListener('click', () => {
      AetherNative.haptic('light');
      openProfileModal();
    });
    document.getElementById('aeQuickWalletBtn')?.addEventListener('click', () => {
      homeSubTab = 'HOLDINGS';
      switchTab('home');
    });
    document.getElementById('aeFontToggleBtn')?.addEventListener('click', () => {
      AetherNative.toggleFontScale();
    });
    document.getElementById('aeNotifBellBtn')?.addEventListener('click', () => {
      compassSubTab = 'BRIEF';
      switchTab('compass');
    });
    document.getElementById('aeThemeToggleBtn')?.addEventListener('click', () => {
      AetherNative.toggleTheme();
    });
    document.getElementById('aeHeaderClockHelpBtn')?.addEventListener('click', () => {
      compassSubTab = 'KITCHEN_CAL';
      switchTab('compass');
    });
  }

  function tickHeaderClockOnly() {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    if (!K || !G) return;
    const clock = K.getTurkishClock();
    const feed = G.getEnrichedLiveNewsFeed() || [];
    const unreadNews = K.getUnreadDisclosureCount ? K.getUnreadDisclosureCount(feed.map((x) => x.id)) : 0;
    const sig = `${clock.bistPhase}|${clock.grandBazaarOpen}|${clock.nobetciOpen}|${clock.tefasBeforeCutoff}|${uiTheme}|${uiFontScale}|${unreadNews}|${activeTab}`;
    if (sig !== lastHeaderPhaseSig || !document.getElementById('msLiveClockTime')) {
      renderHeader();
      return;
    }
    const timeEl = document.getElementById('msLiveClockTime');
    if (timeEl) timeEl.textContent = clock.timeStr;
  }

  // --------------------------------------------------------------------------
  // 4. SEKME 1: PİYASA (CANLI KUR BANDI, ANINDA ARAMA, USTA RADAR & HİSSE SATIRLARI)
  // --------------------------------------------------------------------------
  function getActiveScreenerIds() {
    const K = global.AetherKernelV10;
    if (!Array.isArray(screenerSelectedIds)) {
      const saved = K?.getCustomScreenerFilters ? K.getCustomScreenerFilters() : [];
      screenerSelectedIds = saved.length > 0 ? [...saved] : ['OCF_REAL_CASH', 'NET_CASH_VAULT', 'CLEAN_GOVERNANCE'];
    }
    return screenerSelectedIds;
  }

  function getFilteredMarketAssets() {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const all = K.getAllAssets().filter((a) => a.venue !== 'BENCHMARK_ONLY' && (a.priceTL > 0 || a.isRateInstrument));
    const q = searchQuery.trim().toLocaleUpperCase('tr-TR');

    let list = [];

    if (activeLens === 'CUSTOM_SCREENER' && activeCategory === 'ALL' && G?.runCustomScreener) {
      const scrRes = G.runCustomScreener(getActiveScreenerIds(), searchQuery);
      list = (scrRes.items || []).map((x) => x.asset);
    } else if (q.length > 0) {
      list = all.filter((a) =>
        a.name.toLocaleUpperCase('tr-TR').includes(q) ||
        a.ticker.toLocaleUpperCase('tr-TR').includes(q) ||
        (a.categoryName || '').toLocaleUpperCase('tr-TR').includes(q) ||
        (a.bistRow?.sector || a.sector || '').toLocaleUpperCase('tr-TR').includes(q)
      );
    } else if (activeCategory !== 'ALL') {
      if (activeCategory === 'WATCHLIST') {
        const wList = K.getActiveMember()?.watchlist || [];
        list = wList.map((w) => K.getAsset(w.assetKey)).filter(Boolean);
      } else if (activeCategory === 'SAFE_HAVEN') {
        const safeIds = ['gram-altin-spot', 'kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust', 'dibs-tahvil', 'doviz-usd', 'doviz-eur', 'gram-gumus-spot'];
        list = safeIds.map((k) => K.getAsset(k)).filter(Boolean);
      } else if (activeCategory === 'GOLD_FX') {
        list = all.filter((a) => a.categoryId === '2' || a.subVenue === 'DARPHANE_S1' || a.id === 'tefas-kzl' || String(a.id || '').startsWith('doviz-'));
      } else if (activeCategory === 'GOLD_COMMODITY') list = all.filter((a) => a.categoryId === '2' || a.subVenue === 'DARPHANE_S1' || a.id === 'tefas-kzl');
      else if (activeCategory === 'RATE_SUKUK') list = all.filter((a) => a.isRateInstrument || a.id === 'eurobond-usdtr' || a.id === 'eurobond-emb');
      else if (activeCategory === 'FX') list = all.filter((a) => String(a.id || '').startsWith('doviz-'));
      else if (activeCategory === 'FUNDS') list = all.filter((a) => a.categoryId === '4' || a.venue === 'TEFAS' || a.subVenue === 'BIST_ETF' || a.subVenue === 'BIST_TAXABLE_ETF' || a.subVenue === 'BIST_EXEMPT_ETF');
      else if (activeCategory === 'GLOBAL_CRYPTO') list = all.filter((a) => a.isForeignUsd || a.venue === 'CRYPTO' || a.venue === 'CRYPTO_24_7' || a.id === 'tefas-aft' || a.id === 'tefas-afa');
      else if (activeCategory === 'BIST_ALL') {
        list = all.filter((a) => a.subVenue === 'BIST_STOCK' && (bistSectorFilter === 'ALL' || a.bistRow?.sector === bistSectorFilter));
        if (marketSortBy === 'DEFAULT') {
          list = [...list].sort((a, b) => (b.bistRow?.turnoverMillionTL || 0) - (a.bistRow?.turnoverMillionTL || 0));
        }
      }
    } else if (activeLens === 'EARLY_SIGNALS') {
      list = all
        .filter((a) =>
          a.trueSignalRecord ||
          a.vukRecord?.kind === 'VUK_CASH_LEADER' ||
          a.forensicPattern?.patternCode === 'QUIET_BOTTOM' ||
          a.forensicPattern?.patternCode === 'INST_BREAKOUT' ||
          a.whaleRecord
        )
        .sort((a, b) => ((b.bistRow?.cmf20 || 0) - (a.bistRow?.cmf20 || 0)))
        .slice(0, 48);
    } else if (activeLens === 'HARVEST_VALUE') {
      list = all
        .filter((a) =>
          a.capexRecord ||
          a.legalArbRecord ||
          a.tms29Record?.kind === 'CASH_CHAMPION' ||
          (a.bistRow && (a.bistRow.fcfMillionTL || 0) > 500 && (a.bistRow.pb || 9) <= 1.25 && !a.isPatronSelling)
        )
        .sort((a, b) => ((b.bistRow?.fcfMillionTL || 0) - (a.bistRow?.fcfMillionTL || 0)))
        .slice(0, 48);
    } else if (activeLens === 'FIRE_SALE') {
      list = all
        .filter((a) =>
          a.accumulationGem ||
          (a.bistRow && (a.bistRow.drawdown52WPct || 0) <= -25 && (a.bistRow.ocfMillionTL || 0) > 0 && !a.isPumpAnomaly)
        )
        .sort((a, b) => ((b.bistRow?.cmf20 || 0) - (a.bistRow?.cmf20 || 0)))
        .slice(0, 48);
    } else if (activeLens === 'BAKERY_CASH') {
      list = all
        .filter((a) => a.bistRow && a.bistRow.entityKind !== 'bank' && (a.bistRow.ocfMillionTL || 0) > 250 && !a.isPumpAnomaly && !a.isTms29Illusion)
        .sort((a, b) => {
          const rA = (a.bistRow.ocfMillionTL || 0) / Math.max(0.5, a.bistRow.marketCapBillionTL || 10);
          const rB = (b.bistRow.ocfMillionTL || 0) / Math.max(0.5, b.bistRow.marketCapBillionTL || 10);
          return rB - rA;
        })
        .slice(0, 48);
    } else if (activeLens === 'PASSIVE_RIVER') {
      const fixed = ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust', 'dibs-tahvil', 'eurobond-usdtr', 'tefas-mac']
        .map((k) => K.getAsset(k))
        .filter(Boolean);
      const divStocks = all
        .filter((a) => a.bistRow && (a.bistRow.dividendYield || 0) >= 2.0 && (a.bistRow.ocfMillionTL || 0) > 0)
        .sort((a, b) => (b.bistRow.dividendYield || 0) - (a.bistRow.dividendYield || 0))
        .slice(0, 32);
      list = [...fixed, ...divStocks];
    } else if (activeLens === 'ROTTEN_TRAPS') {
      const s1 = K.getAsset('altin-sertifikasi');
      const traps = all.filter((a) => a.isPumpAnomaly || a.isTms29Illusion || a.distributionTrap || a.isPatronSelling);
      const out = s1 && K.getDarphanePremiumInfo().premiumPct >= 5 ? [s1, ...traps] : traps;
      list = Array.from(new Set(out)).slice(0, 48);
    } else {
      list = CURATED_VITRIN_KEYS.map((k) => K.getAsset(k)).filter(Boolean);
    }

    // Tam Evren Sıralaması: Kesmeden ÖNCE tüm eşleşen varlıklar sıralanır (Schwartzian O(N) Önbellek!)
    if (marketSortBy === 'FORENSIC_SCORE') {
      list = list
        .map((a) => ({ a, v: G.getQuickForensicScore ? G.getQuickForensicScore(a) : (G.computeDeepForensicXray(a)?.overallScore ?? 0) }))
        .sort((x, y) => y.v - x.v)
        .map((x) => x.a);
    } else if (marketSortBy === 'CHANGE_DESC') {
      list = [...list].sort((a, b) => (Number(b.change1D) || 0) - (Number(a.change1D) || 0));
    } else if (marketSortBy === 'CHANGE_ASC') {
      list = [...list].sort((a, b) => (Number(a.change1D) || 0) - (Number(b.change1D) || 0));
    } else if (marketSortBy === 'DISCOUNT_52W') {
      list = list
        .map((a) => ({
          a,
          v: a.bistRow?.drawdown52WPct != null && Number.isFinite(Number(a.bistRow.drawdown52WPct))
            ? Number(a.bistRow.drawdown52WPct)
            : (G.computeRange52W(a)?.drawdownPct ?? 0)
        }))
        .sort((x, y) => x.v - y.v)
        .map((x) => x.a);
    }

    lastMarketMatchTotal = list.length;
    if (q.length > 0) {
      return list.slice(0, 100);
    }
    if (activeCategory === 'BIST_ALL' || activeLens === 'CUSTOM_SCREENER') {
      return list.slice(0, bistVisibleLimit);
    }
    return list;
  }

  function renderCustomScreenerWorkbenchHtml() {
    const G = global.RealInvestmentGuide;
    if (!G?.runCustomScreener) return '';
    const activeIds = getActiveScreenerIds();
    const res = G.runCustomScreener(activeIds, searchQuery);
    const defs = G.CUSTOM_SCREENER_DEFS || [];

    return `
      <section class="ae-card" style="border-color:rgba(245,158,11,0.42);margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
          <div>
            <span class="ms-sig-pill warn">🧪 Ham Malzeme Tezgâhı · Kendi Yoğurt Yiyişin</span>
            <h3 style="margin:4px 0 2px;font-size:14.8px;font-weight:900">670+ Varlıkta Kendi Bilanço & Vergi Süzgecini Kur</h3>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <strong style="font-size:16px;color:var(--gold-bright)">${res.matchedCount}</strong>
            <small style="display:block;font-size:10px;color:var(--ink-400)">/ ${res.totalUniverse} Eşleşti</small>
          </div>
        </div>

        <div class="ae-hscroll" style="padding-bottom:4px">
          <button type="button" class="ae-chip sub" data-scr-preset="FORTRESS">🛡️ Kırılmaz Kaleler</button>
          <button type="button" class="ae-chip sub" data-scr-preset="FIRE_GEM">🔥 Yangın Yeri Cevheri</button>
          <button type="button" class="ae-chip sub" data-scr-preset="EXPORT_CASH">🌍 İhracat & Nakit</button>
          <button type="button" class="ae-chip sub" data-scr-preset="TAX_RIVER">💸 %0 Stopaj & Akış</button>
          <button type="button" class="ae-chip sub" data-scr-preset="CLEAR">Temizle</button>
        </div>

        <div class="ae-screener-grid">
          ${defs.map((d) => {
            const on = activeIds.includes(d.id);
            return `
              <button type="button" class="ae-screener-btn ${on ? 'active' : ''}" data-scr-toggle="${esc(d.id)}">
                <strong>${esc(d.icon)} ${esc(d.short)}</strong>
                <small>${esc(d.desc)}</small>
              </button>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  function renderIpoAndDividendDeskHtml() {
    const K = global.AetherKernelV10;
    const ipos = K.getActiveIpoCatalog();
    const spkDesk = K.getSpkIpoDesk ? K.getSpkIpoDesk() : { recentListed: [] };
    const divs = K.getDividendSchedule();
    const me = K.getActiveMember();

    return `
      <section class="ae-card" style="border-color:rgba(56,189,248,0.35)">
        <div style="margin-bottom:10px">
          <span class="ms-sig-pill info">SPK Halka Arz & KAP Nakit Temettü Masası</span>
          <h3 style="margin:6px 0 3px;font-size:15.5px;font-weight:800">Talep Toplama, 180-Gün Lock-Up & Kesin KAP Temettüleri</h3>
          <p style="margin:0;font-size:12px;color:var(--ink-400)">Eşit dağıtımda kişi sayısına göre gerçek lot düşer; yeni arz olan hisselerde 180 gün Lock-Up sayacı işler; temettüler %15 stopaj sonrası net yatar.</p>
        </div>

        ${lastIpoFeedback ? `<div class="ms-alert ${lastIpoFeedback.ok ? 'ok' : 'err'}">${esc(lastIpoFeedback.text)}</div>` : ''}

        <div class="ae-two-col">
          <div>
            <div style="font-size:11.6px;font-weight:800;color:var(--gold-bright);margin-bottom:6px">🏛️ Aktif / SPK Sırasındaki Talep Toplamalar</div>
            <div class="ms-list" style="margin-bottom:10px">
              ${ipos.map((ipo) => {
                const already = (me.ipoRequests || []).find((r) => (r.cycleId && ipo.cycleId ? r.cycleId === ipo.cycleId : r.ipoId === ipo.id) || r.ipoId === ipo.id);
                const estLots = Math.max(1, Math.round(ipo.totalOfferedLots / Math.max(1, ipo.estimatedParticipants)));
                return `
                  <div class="ms-list-row" style="flex-direction:column;align-items:stretch">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                      <div style="min-width:0">
                        <span class="ms-asset-code">${esc(ipo.ticker)}</span>
                        <strong style="font-size:13.4px;margin-left:5px">${esc(ipo.name)}</strong>
                      </div>
                      <strong style="font-size:14px;flex-shrink:0">${fmtUnitTL(ipo.offerPriceTL)}</strong>
                    </div>
                    <div style="font-size:11.6px;color:var(--ink-400)">
                      ${esc(ipo.distributionMethod)} · ~${ipo.estimatedParticipants.toLocaleString('tr-TR')} kişi -> Tahmini <strong style="color:var(--ink-100)">~${estLots} lot (${fmtTL(estLots * ipo.offerPriceTL)})</strong> düşer.
                    </div>
                    ${(ipo.netCashUseNote || ipo.fundUseNote) ? `<div style="font-size:11px;color:var(--cyan)">İzahname: ${esc(ipo.netCashUseNote || ipo.fundUseNote)}</div>` : ''}
                    ${already ? `
                      <span class="ms-sig-pill good">Talebin Alındı: ${already.requestedLots} Lot (${fmtTL(already.blockedCashTL)} bloke)</span>
                    ` : `
                      <div style="display:flex;gap:8px;align-items:center">
                        <input type="number" class="ae-input" id="msIpoLots_${esc(ipo.id)}" value="${Math.max(20, estLots * 2)}" min="10" step="10" style="width:105px;padding:7px 10px" />
                        <span style="font-size:11.8px;color:var(--ink-400)">Lot</span>
                        <button type="button" class="ms-btn primary sm" data-join-ipo="${esc(ipo.id)}" style="margin-left:auto">Talebe Katıl</button>
                      </div>
                    `}
                  </div>
                `;
              }).join('')}
            </div>

            ${(spkDesk.recentListed || []).length > 0 ? `
              <div style="font-size:11.6px;font-weight:800;color:var(--cyan);margin-bottom:6px">🔓 Son Halka Arzlar: Canlı Getiri & 180-Gün Lock-Up Kilidi</div>
              <div class="ms-list" style="margin-bottom:10px">
                ${spkDesk.recentListed.slice(0, 6).map((ri) => {
                  const lockDays = ri.lockUpRemDays ?? ri.lockupDaysLeft ?? null;
                  const retPct = Number(ri.sinceIpoPct ?? ri.returnSinceIpoPct ?? 0);
                  return `
                  <div class="ms-list-row">
                    <div style="min-width:0;flex:1">
                      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                        <span class="ms-asset-code">${esc(ri.ticker)}</span>
                        <strong style="font-size:12.8px">${esc(ri.name)}</strong>
                        ${lockDays != null ? `<span class="ms-sig-pill ${lockDays <= 30 ? 'warn' : 'neutral'}">${lockDays > 0 ? `Lock-Up ${lockDays}g` : 'Kilit Açıldı'}</span>` : ''}
                      </div>
                      <div style="font-size:11.4px;color:var(--ink-400);margin-top:2px">
                        Arz: ${fmtUnitTL(ri.offerPriceTL)} -> Canlı: <strong style="color:var(--ink-100)">${fmtUnitTL(ri.currentPriceTL)}</strong>
                        <strong class="${retPct >= 0 ? 'pos' : 'neg'}"> (${retPct >= 0 ? '+' : ''}%${retPct})</strong>
                      </div>
                    </div>
                    ${ri.assetKey ? `<button type="button" class="ms-btn sm" data-open-asset="${esc(ri.assetKey)}">Tahta</button>` : ''}
                  </div>
                `;
                }).join('')}
              </div>
            ` : ''}
          </div>

          <div>
            <div style="font-size:11.6px;font-weight:800;color:var(--green-ink);margin-bottom:6px">💸 KAP Nakit Temettü Takvimi (%15 Stopaj Sonrası Net)</div>
            <div class="ms-list">
              ${divs.slice(0, 8).map((d) => {
                const held = me.positions?.[d.assetKey]?.qty || 0;
                return `
                  <div class="ms-list-row">
                    <div style="min-width:0;flex:1">
                      <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
                        <strong>${esc(d.ticker)}</strong>
                        <small style="color:var(--ink-400)">· ${esc(d.payDateYmd)}</small>
                        <span class="ms-sig-pill ${d.isConfirmedKap ? 'good' : 'neutral'}" style="font-size:9.8px;padding:1px 6px">${d.isConfirmedKap ? 'KESİN KAP' : 'DÖNGÜSEL'}</span>
                      </div>
                      <div style="font-size:11.6px;color:var(--ink-400);margin-top:2px">
                        Pay Başı Net: <strong class="pos">+${fmtUnitTL(d.netPerShareTL)}</strong> (%${d.netYieldPct})
                        ${held > 0 ? ` · <strong class="pos">Tahsilatın: +${fmtTL(held * d.netPerShareTL)}</strong>` : ''}
                      </div>
                    </div>
                    <button type="button" class="ms-btn sm" data-open-asset="${esc(d.assetKey)}">İncele</button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function buildMarketAssetListHtml(assets, snap) {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;

    if (assets.length === 0) {
      return `
        <div class="ae-card" style="text-align:center;padding:26px 14px;color:var(--ink-400)">
          Seçtiğin süzgece veya aramaya uygun yatırım aracı bulunamadı. Filtrelerden birini gevşetebilirsin.
        </div>
      `;
    }

    const showMoreBist = (activeCategory === 'BIST_ALL' || activeLens === 'CUSTOM_SCREENER') && !searchQuery.trim() && assets.length < lastMarketMatchTotal;
    const moreFooterHtml = showMoreBist ? `
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px 2px 4px">
        <button type="button" class="ms-btn primary sm" id="aeLoadMoreBistBtn" style="flex:1;min-width:170px;padding:10px 12px">
          Daha Fazla Göster (${assets.length} / ${lastMarketMatchTotal})
        </button>
        <button type="button" class="ms-btn sm" id="aeLoadAllBistBtn" style="padding:10px 12px">
          Tümünü Aç (${lastMarketMatchTotal})
        </button>
      </div>
    ` : '';

    if (marketViewMode === 'BENTO') {
      return `
        <div class="ae-bento-grid">
          ${assets.map((a) => {
            const sig = G.getCardQuickSignal(a);
            const fScore = G.getQuickForensicScore ? G.getQuickForensicScore(a) : 0;
            const chg = Number(a.change1D) || 0;
            const heldSpot = snap.spotItems.find((x) => x.assetKey === a.key);
            const heldTr = snap.tranches.find((t) => t.assetKey === a.key);
            const priceLabel = a.isRateInstrument ? `%${a.annualGrossRatePct.toFixed(1)}` : fmtUnitTL(a.priceTL);
            const chgLabel = a.isRateInstrument
              ? (a.stopajPct === 0 ? '%0 Vergi' : `%${a.stopajPct} Vergi`)
              : `${chg >= 0 ? '+' : ''}%${chg.toFixed(2)}`;
            const chgCls = a.isRateInstrument ? 'flat' : (chg > 0 ? 'pos' : (chg < 0 ? 'neg' : 'flat'));
            return `
              <article class="ae-bento-card" data-open-asset="${esc(a.key)}">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;margin-bottom:5px">
                    <span class="ms-asset-code">${esc(a.ticker)}</span>
                    ${(heldSpot || heldTr)
                      ? `<span class="ae-owned-tag">Portföyde</span>`
                      : (fScore > 0 ? `<span class="ae-fscore-tag ${fScore >= 76 ? 'good' : (fScore >= 52 ? 'mid' : 'low')}">${fScore}p</span>` : '')}
                  </div>
                  <div style="font-size:13.4px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(a.name)}</div>
                  <div style="font-size:11px;color:var(--ink-400);margin-top:3px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(sig.badge || sig.oneLiner)}</div>
                </div>
                <div>
                  <div style="margin:4px 0">${buildMiniSparkSvg(a)}</div>
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:4px">
                    <strong style="font-size:13.8px">${priceLabel}</strong>
                    <span class="ms-chg-badge ${chgCls}" style="min-width:54px;padding:2px 6px;font-size:10.8px">${esc(chgLabel)}</span>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
        ${moreFooterHtml}
      `;
    }

    return `
      <div class="ae-asset-list-v17">
        ${assets.map((a) => {
          const gv = G.getPlainAssetVerdict ? G.getPlainAssetVerdict(a, 100000) : null;
          const sig = G.getCardQuickSignal(a);
          const fScore = G.getQuickForensicScore ? G.getQuickForensicScore(a) : 0;
          const micro = K.inspectBoardMicrostructure(a);
          const chg = Number(a.change1D) || 0;
          const heldSpot = snap.spotItems.find((x) => x.assetKey === a.key);
          const heldTr = snap.tranches.find((t) => t.assetKey === a.key);
          const isOwned = Boolean(heldSpot || heldTr);
          const isWatched = Boolean((K.getActiveMember()?.watchlist || []).some((w) => w.assetKey === a.key));
          const flash = K.getPriceFlash(a.key);

          const priceLabel = a.isRateInstrument
            ? `Yıllık %${a.annualGrossRatePct.toFixed(1)}`
            : fmtUnitTL(a.priceTL);
          const chgLabel = a.isRateInstrument
            ? (a.stopajPct === 0 ? '%0 Vergi' : `%${a.stopajPct} Vergi`)
            : `${chg >= 0 ? '+' : ''}%${chg.toFixed(2)}`;
          const chgCls = a.isRateInstrument ? 'flat' : (chg > 0 ? 'pos' : (chg < 0 ? 'neg' : 'flat'));

          let microBadge = '';
          if (micro.isCircuitBreaker) microBadge = `<span class="ms-sig-pill danger">⚡ Devre Kesici</span>`;
          else if (micro.isTavanLocked) microBadge = `<span class="ms-sig-pill good">🔒 Tavan</span>`;
          else if (micro.isTabanLocked) microBadge = `<span class="ms-sig-pill danger">🔒 Taban</span>`;
          else if (micro.isBrutTakas) microBadge = `<span class="ms-sig-pill warn">Brüt Takas</span>`;

          const ownedVal = heldSpot ? fmtCompactTL(heldSpot.netValTL) : (heldTr ? fmtCompactTL(heldTr.accruedNetValueTL) : '');
          const traffic = gv?.trafficLight || 'amber';
          const plainLine = gv?.cardSummary || gv?.simpleMeaning || sig.oneLiner;

          return `
            <article class="ae-asset-card-v17 ${isOwned ? 'owned' : ''} ${flash === 'up' ? 'flash-up' : (flash === 'down' ? 'flash-down' : '')}" data-open-asset="${esc(a.key)}">
              <div class="ae-v17-main">
                <div class="ae-row-top">
                  <span class="ae-traffic-dot ${esc(traffic)}" title="${esc(gv?.simpleLabel || '')}"></span>
                  <span class="ae-ticker-badge">${esc(a.ticker)}</span>
                  ${isWatched ? `<span style="color:var(--gold-bright);font-size:12px" title="İzleme Listende">★</span>` : ''}
                  ${isOwned ? `<span class="ae-owned-tag">Bende: ${esc(ownedVal)}</span>` : (fScore > 0 ? `<span class="ae-fscore-tag ${fScore >= 76 ? 'good' : (fScore >= 52 ? 'mid' : 'low')}">${fScore}/100</span>` : '')}
                  ${microBadge}
                </div>
                <div class="ae-v17-title">${esc(a.name)}</div>
                <div class="ae-v17-desc">${esc(plainLine)}</div>
              </div>
              <div class="ae-v17-right">
                <span class="ae-v17-price">${priceLabel}</span>
                <span class="ms-chg-badge ${chgCls}">${esc(chgLabel)}</span>
              </div>
            </article>
          `;
        }).join('')}
      </div>
      ${moreFooterHtml}
    `;
  }

  function bindAssetListClicks(root) {
    root.querySelectorAll('[data-open-asset]').forEach((el) => {
      el.addEventListener('click', () => {
        AetherNative.haptic('light');
        openAssetDrawer(el.getAttribute('data-open-asset'), 'ORDER');
      });
    });

    root.querySelector('#aeLoadMoreBistBtn')?.addEventListener('click', () => {
      AetherNative.haptic('selection');
      bistVisibleLimit = Math.min(lastMarketMatchTotal || 700, bistVisibleLimit + 160);
      const listReg = document.getElementById('aeMarketListRegion');
      if (listReg) {
        const K = global.AetherKernelV10;
        listReg.innerHTML = buildMarketAssetListHtml(getFilteredMarketAssets(), K.evaluateMemberPortfolio());
        bindAssetListClicks(listReg);
      }
    });

    root.querySelector('#aeLoadAllBistBtn')?.addEventListener('click', () => {
      AetherNative.haptic('selection');
      bistVisibleLimit = Math.max(700, lastMarketMatchTotal || 700);
      const listReg = document.getElementById('aeMarketListRegion');
      if (listReg) {
        const K = global.AetherKernelV10;
        listReg.innerHTML = buildMarketAssetListHtml(getFilteredMarketAssets(), K.evaluateMemberPortfolio());
        bindAssetListClicks(listReg);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4A. SEKME 1: ANA SAYFA (1M KOKPİT, 4 KOLAY KAPI, DOST SOHBETİ, CÜZDAN & GÜNLÜK SORU)
  // --------------------------------------------------------------------------
  function buildHomeBasketLiveHtml(hb, snap) {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    if (!hb || !K) return '';
    const drift = (snap && G?.computePortfolioDriftPlan)
      ? G.computePortfolioDriftPlan(snap, { sukukPct: hb.wSukuk, goldPct: hb.wGold, equityPct: hb.wEquity })
      : null;

    return `
      <div class="ae-kpi-2x2" style="margin-bottom:10px">
        <div class="ms-kpi-box" style="border-color:rgba(16,185,129,0.42)">
          <span>Aylık Düzenli Gelir</span>
          <strong class="pos">+${fmtTL(hb.monthlyCashDripTL)}/ay</strong>
          <small>Sukuk + nema + temettü</small>
        </div>
        <div class="ms-kpi-box">
          <span>Enflasyon Üstü Güç</span>
          <strong class="${hb.estRealAnnualPct >= 0 ? 'pos' : 'neg'}">${hb.estRealAnnualPct >= 0 ? '+' : ''}%${hb.estRealAnnualPct} Reel</strong>
          <small>Yıllık tahmini ~%${hb.estNominalAnnualPct}</small>
        </div>
        <div class="ms-kpi-box" style="border-color:${hb.crisisDeltaPct <= -15 ? 'rgba(244,63,94,0.42)' : 'rgba(56,189,248,0.38)'}">
          <span>Borsa -%30 Çökerse</span>
          <strong class="${hb.crisisDeltaTL >= 0 ? 'pos' : 'warn-txt'}">${hb.crisisDeltaTL >= 0 ? '+' : ''}${fmtCompactTL(hb.crisisDeltaTL)}</strong>
          <small>Toplam etki: ${hb.crisisDeltaPct >= 0 ? '+' : ''}%${hb.crisisDeltaPct}</small>
        </div>
        <div class="ms-kpi-box">
          <span>Uyku Rahatlığı</span>
          <strong class="${hb.comfortTone === 'good' ? 'pos' : 'warn-txt'}" style="font-size:13.4px">${esc(hb.comfortLabel)}</strong>
          <small>Hazır nakit: %${hb.wCash}</small>
        </div>
      </div>

      ${drift ? `
        <div style="background:var(--surface-2);border:1px solid var(--line-subtle);border-radius:13px;padding:10px 12px;margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:7px;flex-wrap:wrap">
            <strong style="font-size:12.6px;color:var(--gold-bright)">⚖️ Mevcut Portföyün vs Bu Hedef Plan</strong>
            <span class="ms-sig-pill ${drift.needsRebalance ? 'warn' : 'good'}">${drift.needsRebalance ? `En fazla %${Math.round(drift.maxAbsDriftPct)} sapma` : 'Dengede'}</span>
          </div>
          <div style="display:grid;gap:5px">
            ${drift.rows.map((dr) => `
              <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:11.8px">
                <span style="min-width:0;color:var(--ink-200)">${dr.icon} ${esc(dr.label)}</span>
                <span style="flex-shrink:0;font-weight:800" class="${Math.abs(dr.deltaPct) >= 10 ? (dr.deltaTL > 0 ? 'warn-txt' : 'pos') : ''}">
                  %${Math.round(dr.curPct)} → %${dr.targetPct} ${dr.id !== 'CASH' && dr.deltaTL >= 15000 ? `(+${fmtCompactTL(dr.deltaTL)} eksik)` : ''}
                </span>
              </div>
            `).join('')}
          </div>
          ${drift.nextAction ? `
            <button type="button" class="ms-btn primary sm" style="width:100%;margin-top:9px" data-open-asset="${esc(drift.nextAction.actionKey)}" data-prefill-amt="${Math.min(Math.max(10000, drift.nextAction.deltaTL), Math.max(10000, Math.floor(snap?.cashTL || drift.nextAction.deltaTL)))}">
              🎯 Eksik Ayağı Tamamla: ${esc(drift.nextAction.actionTicker)} (${fmtCompactTL(drift.nextAction.deltaTL)}) ›
            </button>
          ` : ''}
        </div>
      ` : ''}

      <div class="ms-alert ${hb.comfortTone === 'good' ? 'ok' : 'info'}" style="margin-bottom:10px">
        <strong>🧭 Dostun Terazi Yorumu:</strong> ${esc(hb.mentorAdvice)}
      </div>
      <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:7px">
        ${hb.buckets.map((bk) => `
          <div style="min-width:0;max-width:100%;background:var(--surface-2);border:1px solid var(--line-subtle);border-radius:13px;padding:9px 11px">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:5px">
              <strong style="font-size:13.2px;min-width:0">${bk.icon} ${esc(bk.label)} (%${bk.pct})</strong>
              <strong style="font-size:13.2px;color:var(--gold-bright)">${fmtTL(bk.amountTL)}</strong>
            </div>
            <div class="ae-hscroll" style="padding-bottom:0">
              ${bk.sampleKeys.map((sk) => {
                const a = K.getAsset(sk);
                return a ? `<button type="button" class="ae-chip sub" data-open-asset="${esc(a.key)}" data-prefill-amt="${Math.max(1000, bk.amountTL)}" style="padding:4px 9px;font-size:11.5px">${esc(a.ticker)} Aç ›</button>` : '';
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderHomeTab(host) {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const member = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(member);
    const homeBrief = G.getDailyHomeBriefing ? G.getDailyHomeBriefing() : null;
    const dailyQ = G.getDailyQuickChallenge ? G.getDailyQuickChallenge() : null;
    const repoNetAnnual = K.getOvernightRepoNetAnnualPct();
    const dailyPassive = Math.round(snap.monthlyPassiveIncomeTL / 30);
    const freedomPct = Math.min(100, Math.round(snap.passiveCoveragePct));
    const condOrders = Array.isArray(member.conditionalOrders) ? member.conditionalOrders : [];
    const watchItems = Array.isArray(member.watchlist) ? member.watchlist : [];
    const triggeredAlerts = watchItems.filter((w) => w.triggeredAtMs > 0);
    const queueCount = (member.settlementQueue || []).length + (member.pendingOrders || []).length + condOrders.length + (member.ipoRequests || []).length;
    const holdingsCount = snap.spotItems.length + snap.tranches.length;
    const investedOrPendingTL = Math.max(0, Math.round(snap.totalNetWorthTL - snap.cashTL));
    const firstPendingBuy = (member.pendingOrders || []).find((o) => o.side === 'BUY' && (o.reservedTL || 0) >= 10000);
    const showInstallBanner = !isRunningAsInstalledApp();

    const step1Done = Boolean(member.livedMilestones?.inspectedCashScale);
    const step2Done = Boolean(member.livedMilestones?.executedRealOrder || holdingsCount > 0 || (member.pendingOrders || []).length > 0 || condOrders.length > 0);
    const step3Done = Object.keys(member.completedFieldCases || {}).length > 0 || (member.detectiveStats?.played || 0) > 0 || Object.keys(member.completedDrills || {}).length > 0;
    const stepsDoneCount = [step1Done, step2Done, step3Done].filter(Boolean).length;
    const showStarterFlow = !starterGuideDismissed && stepsDoneCount < 3;

    let subBodyHtml = '';

    if (homeSubTab === 'TODAY') {
      const dcLog = member.dailyChallengeLog || { lastYmd: '', streak: 0, totalPlayed: 0, totalCorrect: 0 };
      const cs = dailyQ?.fieldCase || null;
      const attempt = cs ? (member.completedFieldCases?.[cs.id] || (dailyPickedChoiceId ? { choiceId: dailyPickedChoiceId, isOptimal: cs.choices.find((x) => x.id === dailyPickedChoiceId)?.isOptimal } : null)) : null;
      const pickedObj = (cs && attempt) ? cs.choices.find((x) => x.id === attempt.choiceId) : null;
      const optimalObj = cs ? cs.choices.find((x) => x.isOptimal) : null;
      const hbPreview = G.simulateBalancedBasketBuilder ? G.simulateBalancedBasketBuilder({
        capitalTL: Math.max(100000, Math.round(snap.totalNetWorthTL || 1000000)),
        sukukPct: hbSukukPct,
        goldPct: hbGoldPct,
        equityPct: hbEquityPct
      }) : null;
      const driftPreview = (hbPreview && G.computePortfolioDriftPlan)
        ? G.computePortfolioDriftPlan(snap, { sukukPct: hbSukukPct, goldPct: hbGoldPct, equityPct: hbEquityPct })
        : null;

      const nextStepLabel = !step1Done
        ? '1. Adım: TUPRS fırın kasasını ve 5 Soruda Röntgenini incele'
        : (!step2Done
          ? '2. Adım: İlk gerçek yatırım veya Limit Alım kararını ver'
          : '3. Adım: Canlı Piyasa Karar Tatbikatı veya Kasa Dedektifi çöz');
      const nextStepBtnId = !step1Done ? 'aeStep1GoBtn' : (!step2Done ? 'aeStep2GoBtn' : 'aeStep3GoBtn');
      const nextStepBtnTxt = !step1Done ? 'İncele ›' : (!step2Done ? 'Yatırım Yap ›' : 'Başla ›');

      subBodyHtml = `
        <!-- KOMPAKT 3 ADIMLI BAŞLANGIÇ ÇUBUĞU (EKRANI BOĞMAZ!) -->
        ${showStarterFlow ? `
          <section class="ae-card" style="border-color:rgba(240,180,41,0.36);padding:13px 14px">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:7px">
              <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap">
                <span class="ms-sig-pill warn">🌱 İlk 5 Dakika (${stepsDoneCount}/3)</span>
                <strong style="font-size:13.8px">3 Adımda Gerçek Piyasayı Tanı</strong>
              </div>
              <button type="button" class="ae-clear-btn" id="aeDismissStarterHomeBtn" style="position:static;transform:none;width:26px;height:26px" aria-label="Kapat">×</button>
            </div>
            <div class="ms-bar-track" style="height:6px;margin-bottom:9px">
              <div class="ms-bar-fill green" style="width:${Math.round((stepsDoneCount / 3) * 100)}%"></div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
              <span style="font-size:12.6px;color:var(--ink-200);flex:1;min-width:170px">${esc(nextStepLabel)}</span>
              <button type="button" class="ms-btn primary sm" id="${nextStepBtnId}">${nextStepBtnTxt}</button>
            </div>
          </section>
        ` : ''}

        <!-- 1. "NE YAPMAK İSTİYORSUN?" — 4 HEDEF ODALI KAPI -->
        <div class="ae-section-title">
          <h2>Ne Yapmak İstiyorsun?</h2>
          <span style="font-size:12px;color:var(--ink-400);font-weight:700">1 dokunuşla başla</span>
        </div>
        <div class="ae-doorway-grid">
          <button type="button" class="ae-doorway-card" data-home-door="SAFE_HAVEN">
            <span class="ae-doorway-icon">🛡️</span>
            <strong>Param Erimesin</strong>
            <span>Fiziki altın, %0 vergili kira sertifikası ve güvenli limanlar</span>
          </button>
          <button type="button" class="ae-doorway-card" data-home-door="BAKERY_CASH">
            <span class="ae-doorway-icon">🥖</span>
            <strong>Sağlam Şirkete Ortak Ol</strong>
            <span>Kasasına her gün sıcak para giren dev Türk fabrikaları</span>
          </button>
          <button type="button" class="ae-doorway-card" data-home-door="PASSIVE_RIVER">
            <span class="ae-doorway-icon">💧</span>
            <strong>Aylık Düzenli Gelir Kur</strong>
            <span>Temettü, sukuk ve uyurken kazandıran nakit çarkı</span>
          </button>
          <button type="button" class="ae-doorway-card" data-home-door="FIRE_SALE">
            <span class="ae-doorway-icon">🔥</span>
            <strong>Fırsat & İndirim Avla</strong>
            <span>Zirveden düşmüş ama kasası sağlam ucuz cevherler</span>
          </button>
        </div>

        <!-- 2. BUGÜNÜN 4 ANA PİYASA NABZI -->
        ${homeBrief ? `
          <div class="ae-section-title">
            <h2>Canlı Piyasa Nabzı</h2>
            <button type="button" class="ms-btn sm" id="aeSeeAllMarketBtn">Tümünü Gör ›</button>
          </div>
          <div class="ae-pulse-grid">
            ${homeBrief.heroStats.map((hs) => {
              const chg = Number(hs.chg) || 0;
              return `
                <button type="button" class="ae-pulse-tile" data-open-asset="${esc(hs.key)}">
                  <span class="p-lbl">${esc(hs.label)}</span>
                  <strong class="p-val">${esc(hs.val)}</strong>
                  ${hs.badge
                    ? `<span class="ms-sig-pill good" style="align-self:flex-start">${esc(hs.badge)}</span>`
                    : `<span class="ms-chg-badge ${chg >= 0 ? 'pos' : 'neg'}" style="align-self:flex-start;min-width:auto">${chg >= 0 ? '+' : ''}%${chg.toFixed(2)}</span>`}
                </button>
              `;
            }).join('')}
          </div>

          <!-- 3. DOSTUN BUGÜNKÜ 30 SANİYELİK ÖZETİ -->
          <div class="ae-section-title">
            <h2>Dostun Bugünkü Özeti</h2>
            <div style="display:flex;align-items:center;gap:6px">
              ${AetherNative.canSpeak() ? `<button type="button" class="ae-term-pill" id="aeSpeakHomeBriefBtn" style="padding:4px 10px;font-size:11.6px">🔊 Sesli Dinle</button>` : `<span style="font-size:12px;color:var(--gold-bright);font-weight:800">Canlı Analiz</span>`}
            </div>
          </div>
          <div class="ae-brief-stack">
            ${homeBrief.bullets.map((bl) => `
              <article class="ae-brief-item ${esc(bl.tone)}">
                <strong>${esc(bl.icon)} ${esc(bl.title)}</strong>
                <p>${esc(bl.body)}</p>
              </article>
            `).join('')}
          </div>

          <!-- 10 SANİYELİK TERİM KISAYOLLARI -->
          <div style="margin-bottom:14px">
            <div style="font-size:12.2px;font-weight:800;color:var(--ink-400);margin:0 2px 6px">💡 Merak ettiğin terime dokun, 10 saniyede net özetini gör:</div>
            <div class="ae-hscroll">
              <button type="button" class="ae-term-pill" data-explain-term="Stopaj">Stopaj nedir?</button>
              <button type="button" class="ae-term-pill" data-explain-term="Limit Emir">Limit Emir nedir?</button>
              <button type="button" class="ae-term-pill" data-explain-term="Hava Parası">Hava Parası nedir?</button>
              <button type="button" class="ae-term-pill" data-explain-term="T+2 Takas">T+2 Takas nedir?</button>
              <button type="button" class="ae-term-pill" data-explain-term="Kamu Kira Sertifikası">Sukuk nedir?</button>
              <button type="button" class="ae-term-pill" data-explain-term="BES %20 Devlet Katkısı">2026 BES nedir?</button>
              <button type="button" class="ae-term-pill" data-explain-term="Eurobond">Eurobond nedir?</button>
              <button type="button" class="ae-term-pill" data-explain-term="Zarar Kes">Zarar Kes nedir?</button>
            </div>
          </div>

          <!-- 4. AÇILIR-KAPANIR 1M SEPET PLANLAYICI & DENGE KAYMASI KOÇU (FERAH ANA SAYFA!) -->
          ${hbPreview ? `
            <details class="ae-home-acc" id="aeHomeBasketDetails" ${homeBasketOpen ? 'open' : ''} style="border-color:rgba(240,180,41,0.34)">
              <summary>
                <div style="min-width:0;flex:1">
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px">
                    <span class="ms-sig-pill warn">🧺 Sepet Planlayıcı & Denge Koçu</span>
                    ${driftPreview ? `<span class="ms-sig-pill ${driftPreview.needsRebalance ? 'info' : 'good'}">${driftPreview.needsRebalance ? `Hedefe %${Math.round(driftPreview.maxAbsDriftPct)} fark` : 'Planla Uyumlu'}</span>` : ''}
                  </div>
                  <strong style="font-size:14.8px;display:block">1 Milyon ₺’yi Nasıl Bölersen Ne Kazanırsın?</strong>
                  <span style="font-size:12px;color:var(--ink-400)">Tahmini +${fmtTL(hbPreview.monthlyCashDripTL)}/ay gelir · Aç ve portföyünle kıyasla</span>
                </div>
                <span style="color:var(--gold-bright);font-weight:900;font-size:14px">▾</span>
              </summary>
              <div class="ae-home-acc-body">
                <div class="ae-hscroll" style="margin-bottom:10px">
                  <button type="button" class="ae-chip ${hbPresetId === 'CALM_SHIELD' ? 'active' : ''}" data-hb-preset="CALM_SHIELD">🛡️ Huzurlu Kalkan</button>
                  <button type="button" class="ae-chip ${hbPresetId === 'FOUR_SEASON' ? 'active' : ''}" data-hb-preset="FOUR_SEASON">⚖️ 4 Mevsim Denge</button>
                  <button type="button" class="ae-chip ${hbPresetId === 'MONTHLY_INCOME' ? 'active' : ''}" data-hb-preset="MONTHLY_INCOME">💧 Aylık Maaş Çarkı</button>
                  <button type="button" class="ae-chip ${hbPresetId === 'GROWTH_FACTORY' ? 'active' : ''}" data-hb-preset="GROWTH_FACTORY">🏭 Üretim & Büyüme</button>
                </div>

                <div class="ae-lab-slider-row">
                  <div class="ae-lab-slider-head"><span>🛡️ %0 Vergili Sabit Gelir (Sukuk)</span><strong id="aeHbSukukLbl">%${hbPreview.wSukuk}</strong></div>
                  <input type="range" class="ae-slider" id="aeHbSukukSl" min="0" max="80" step="5" value="${hbPreview.wSukuk}" />
                </div>
                <div class="ae-lab-slider-row">
                  <div class="ae-lab-slider-head"><span>🪙 Altın & Döviz Zırhı</span><strong id="aeHbGoldLbl">%${hbPreview.wGold}</strong></div>
                  <input type="range" class="ae-slider" id="aeHbGoldSl" min="0" max="75" step="5" value="${hbPreview.wGold}" />
                </div>
                <div class="ae-lab-slider-row">
                  <div class="ae-lab-slider-head"><span>🥖 Sağlam Şirket & Fon</span><strong id="aeHbEqLbl">%${hbPreview.wEquity}</strong></div>
                  <input type="range" class="ae-slider" id="aeHbEqSl" min="0" max="80" step="5" value="${hbPreview.wEquity}" />
                </div>

                <div id="aeHomeBasketLiveOut">
                  ${buildHomeBasketLiveHtml(hbPreview, snap)}
                </div>
              </div>
            </details>
          ` : ''}
        ` : ''}

        <!-- 5. AÇILIR-KAPANIR GÜNÜN 1 DAKİKALIK USTA SORUSU -->
        ${cs ? `
          <details class="ae-home-acc" id="aeHomeDailyDetails" ${homeDailyOpen || attempt ? 'open' : ''} style="border-color:rgba(56,189,248,0.35)">
            <summary>
              <div style="min-width:0;flex:1">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px">
                  <span class="ms-sig-pill info">🎯 Günün 1 Dakikalık Sorusu</span>
                  <span class="ms-sig-pill warn">🔥 Seri: ${dcLog.streak} Gün</span>
                  ${attempt ? `<span class="ms-sig-pill ${attempt.isOptimal ? 'good' : 'warn'}">${attempt.isOptimal ? '✓ Çözüldü' : '↻ İncelendi'}</span>` : ''}
                </div>
                <strong style="font-size:14.4px;display:block;line-height:1.3">${esc(cs.title)}</strong>
              </div>
              <span style="color:var(--cyan);font-weight:900;font-size:14px">▾</span>
            </summary>
            <div class="ae-home-acc-body">
              <p style="margin:0 0 8px;font-size:13.2px;color:var(--ink-200);line-height:1.5">${esc(cs.situation)}</p>
              <div style="font-size:13.2px;font-weight:800;color:var(--gold-bright);margin-bottom:6px">❓ ${esc(cs.question)}</div>
              <div class="ae-choice-stack">
                ${cs.choices.map((ch) => {
                  const isPicked = attempt && attempt.choiceId === ch.id;
                  const cls = isPicked ? (ch.isOptimal ? 'picked-right' : 'picked-wrong') : '';
                  return `
                    <button type="button" class="ae-choice-btn ${cls}" data-daily-case="${esc(cs.id)}" data-daily-choice="${esc(ch.id)}" data-daily-opt="${ch.isOptimal ? '1' : '0'}">
                      <span class="ae-choice-key">${esc(ch.id)}</span>
                      <span>${esc(ch.label)}</span>
                    </button>
                  `;
                }).join('')}
              </div>
              ${attempt ? `
                <div class="ms-alert ${attempt.isOptimal ? 'ok' : 'warn'}" style="margin-top:10px;margin-bottom:8px">
                  ${pickedObj?.why ? `<div style="margin-bottom:6px"><strong>${attempt.isOptimal ? '🎯 Aferin! Doğru Okudun:' : '💡 Dikkat — Neden Bu Tuzaktı:'}</strong> ${esc(pickedObj.why)}</div>` : ''}
                  ${!attempt.isOptimal && optimalObj?.why ? `<div style="margin-bottom:6px;color:var(--green-ink)"><strong>✓ En Sağlam Karar (${optimalObj.id}):</strong> ${esc(optimalObj.why)}</div>` : ''}
                  <div><strong>Gerçek Hayat Sonucu:</strong> ${esc(cs.consequence100k)}</div>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <button type="button" class="ms-btn primary sm" id="aeGoMoreCasesBtn">Tüm 48 Vakaya Geç ›</button>
                  <button type="button" class="ms-btn sm" id="aeGoLabsFromHomeBtn">🎯 Karar Tatbikatı</button>
                </div>
              ` : ''}
            </div>
          </details>
        ` : ''}

        ${showInstallBanner ? `
          <section class="ae-card" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;border-color:rgba(240,180,41,0.35)">
            <div style="min-width:0;flex:1">
              <strong style="font-size:14px;display:block">📲 Telefona Gerçek Uygulama Olarak Kur</strong>
              <span style="font-size:12.2px;color:var(--ink-400)">Tarayıcı çubuğu olmadan tam ekran iPhone / Android uygulaması olarak kullan.</span>
            </div>
            <button type="button" class="ms-btn primary sm" id="aeHomeInstallBtn">Kurulumu Aç</button>
          </section>
        ` : ''}
      `;
    } else if (homeSubTab === 'HOLDINGS') {
      subBodyHtml = `
        <!-- PORTFÖY DEĞER EĞRİSİ, DAĞILIM & ÖZGÜRLÜK ÇARKI -->
        <section class="ae-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <strong style="font-size:15px">Paramın Dağılımı & Gelişimi</strong>
            <span style="font-size:12.2px;font-weight:800" class="${snap.realPurchasingPnlPct >= 0 ? 'pos' : 'neg'}">Alım Gücü: ${snap.realPurchasingPnlPct >= 0 ? '+' : ''}%${snap.realPurchasingPnlPct}</span>
          </div>
          ${renderPortfolioEquityChartSvg(member, snap)}
          ${renderAllocRibbonHtml(snap.allocationBreakdown)}
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--line-subtle)">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;margin-bottom:5px;gap:6px;flex-wrap:wrap">
              <span style="font-weight:700;color:var(--ink-200)">💧 Aylık Pasif Gelir Çarkın: <strong class="pos">+${fmtTL(snap.monthlyPassiveIncomeTL)}/ay</strong> (~+${dailyPassive.toLocaleString('tr-TR')} ₺/gün)</span>
              <strong style="color:var(--gold-bright)">Giderinin %${snap.passiveCoveragePct}’si</strong>
            </div>
            <div class="ms-bar-track" style="height:8px">
              <div class="ms-bar-fill green" style="width:${freedomPct}%"></div>
            </div>
          </div>
        </section>

        ${snap.marginStatus ? `
          <div class="ms-alert ${snap.marginStatus.isWarning ? 'err' : 'warn'}" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <div>
              <strong>⚠️ Kredili Borç Yükü: -${fmtTL(snap.marginStatus.debtTL)}</strong> · Özsermaye: %${snap.marginStatus.equityRatioPct} · Günlük Faiz: <strong class="neg">-${fmtUnitTL(snap.marginStatus.dailyInterestCostTL)}/gün</strong>
            </div>
            ${snap.cashTL >= 100 ? `<button type="button" class="ms-btn danger sm" id="msRepayMarginBtn">Borç Kapat</button>` : ''}
          </div>
        ` : ''}

        ${snap.gvk80TaxPayableTL > 0 ? `
          <div class="ms-alert warn" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <div>
              <strong>Yurt Dışı Satış Vergisi Karşılığı (GVK 80): -${fmtTL(snap.gvk80TaxPayableTL)}</strong>
            </div>
            ${snap.cashTL >= 100 ? `<button type="button" class="ms-btn sm" id="msPayGvkTaxBtn">Nakitle Öde</button>` : ''}
          </div>
        ` : ''}

        <section class="ae-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <strong style="font-size:15.5px">Elimdeki Yatırımlar (${holdingsCount})</strong>
            <button type="button" class="ms-btn primary sm" id="aeGoMarketFromWallet">+ Yeni Yatırım Al</button>
          </div>

          <div class="ms-list">
            ${snap.tranches.map((tr) => {
              const early = tr.isTermDeposit && !tr.isMatured;
              return `
                <div class="ms-list-row">
                  <div style="min-width:0;flex:1">
                    <strong style="font-size:14.2px">${esc(tr.name)}</strong>
                    <div style="font-size:12.6px;color:var(--ink-400);margin-top:3px">
                      Yatırılan: ${fmtTL(tr.principalTL)} · Biriken Net: <strong class="pos">+${fmtTL(tr.netInterestTL)}</strong> (+${fmtTL(tr.monthlyNetDripTL)}/ay)
                      ${early ? ` · <strong>${tr.remainingDays} gün kaldı</strong>` : ''}
                    </div>
                  </div>
                  <button type="button" class="ms-btn ${early ? 'danger' : ''} sm" data-break-tr="${esc(tr.id)}">
                    ${early ? `Erken Boz (-${fmtCompactTL(tr.forfeitedIfBrokenEarlyTL)})` : 'Nakde Çevir'}
                  </button>
                </div>
              `;
            }).join('')}

            ${snap.spotItems.map((it) => {
              const aObj = K.getAsset(it.assetKey);
              const gv = aObj && G.getPlainAssetVerdict ? G.getPlainAssetVerdict(aObj) : null;
              return `
                <div class="ms-list-row">
                  <div style="min-width:0;flex:1;cursor:pointer" data-open-pos="${esc(it.assetKey)}">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                      ${gv ? `<span class="ae-traffic-dot ${esc(gv.trafficLight)}"></span>` : ''}
                      <span class="ms-asset-code">${esc(it.ticker)}</span>
                      <strong style="font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(it.name)}</strong>
                    </div>
                    <div style="font-size:12.6px;color:var(--ink-400);margin-top:3px">
                      ${it.qty} adet · Alış Ort: ${fmtUnitTL(it.avgCostTL)} · Güncel: <strong style="color:var(--ink-100)">${fmtTL(it.netValTL)}</strong>
                    </div>
                    <div style="font-size:13.2px;font-weight:800;margin-top:2px" class="${it.pnlNetTL >= 0 ? 'pos' : 'neg'}">
                      ${it.pnlNetTL >= 0 ? 'Kâr: +' : 'Zarar: '}${fmtTL(it.pnlNetTL)} (${it.pnlNetPct >= 0 ? '+' : ''}%${it.pnlNetPct})
                    </div>
                    ${it.thesisNote ? `<div style="font-size:12px;color:var(--cyan);margin-top:2px">Notun: "${esc(it.thesisNote)}"</div>` : ''}
                  </div>
                  <div style="display:flex;gap:6px">
                    <button type="button" class="ms-btn buy-cta sm" data-open-pos="${esc(it.assetKey)}" data-pos-side="BUY">Al</button>
                    <button type="button" class="ms-btn danger sm" data-open-pos="${esc(it.assetKey)}" data-pos-side="SELL">Sat</button>
                  </div>
                </div>
              `;
            }).join('')}

            ${(member.pendingOrders || []).map((o) => `
              <div class="ms-list-row" style="border-color:rgba(56,189,248,0.38)">
                <div style="min-width:0;flex:1">
                  <span class="ms-sig-pill info">⏳ Sırada Bekleyen Emir · ${esc(fmtCountdown(o.executesAtMs))}</span>
                  <div style="font-size:14px;font-weight:800;margin-top:4px">${esc(o.name)} (${o.side === 'BUY' ? fmtTL(o.reservedTL) : o.qty + ' adet satım'})</div>
                  <div style="font-size:12.4px;color:var(--ink-400);margin-top:2px">${esc(o.note)}</div>
                </div>
                <button type="button" class="ms-btn danger sm" data-cancel-ord="${esc(o.id)}">İptal Et</button>
              </div>
            `).join('')}

            ${holdingsCount === 0 && (member.pendingOrders || []).length === 0 ? `
              <div style="padding:20px 10px;text-align:center;font-size:14px;color:var(--ink-400)">
                Henüz yatırım yapmadın; <strong>${fmtTL(snap.cashTL)}</strong> boş nakitte seni bekliyor.
              </div>
            ` : ''}
          </div>
        </section>
      `;
    } else {
      // QUEUES & LEDGER
      subBodyHtml = `
        <section class="ae-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap">
            <div style="min-width:0;flex:1">
              <strong style="font-size:15px;display:block">🌙 Boş Nakit Uyurken Çalışsın mı? (Gecelik Nema)</strong>
              <div style="font-size:12.8px;color:var(--ink-400);margin-top:3px">
                ${snap.autoOvernightRepo
                  ? `Açık: Boşta duran 10B ₺ üstü nakdin her gece otomatik net %${repoNetAnnual} kazandırıyor${snap.overnightRepoEarnedTL > 0 ? ` (+${fmtTL(snap.overnightRepoEarnedTL)} kazanıldı)` : ''}.`
                  : `Şu an kapalı (%0 faiz). Açarsan kenarda bekleyen paran boşta erimez, her gece net %${repoNetAnnual} işler!`}
              </div>
            </div>
            <button type="button" class="ms-btn ${snap.autoOvernightRepo ? '' : 'buy-cta'}" id="msToggleRepoBtn">
              ${snap.autoOvernightRepo ? 'Nemayı Kapat' : 'Nemayı Aç'}
            </button>
          </div>

          <div class="ae-kpi-2x2">
            <div class="ms-kpi-box"><span>Kullanılabilir Nakit</span><strong>${fmtTL(snap.cashTL)}</strong></div>
            <div class="ms-kpi-box"><span>T+2 Takas (2 İş Günü)</span><strong>${fmtTL(snap.unsettledTL)}</strong></div>
            <div class="ms-kpi-box"><span>Valör / Açılış Sırası</span><strong>${fmtTL(snap.pendingOrderTL)}</strong></div>
            <div class="ms-kpi-box"><span>Halka Arz Blokesi</span><strong>${fmtTL(snap.ipoBlockedTL)}</strong></div>
          </div>

          <div class="ms-list">
            ${(member.conditionalOrders || []).map((co) => {
              const aObj = K.getAsset(co.assetKey);
              const liveP = aObj?.priceTL || 0;
              const diffPct = liveP > 0 ? +(((co.triggerPriceTL / liveP) - 1) * 100).toFixed(1) : 0;
              const kindLbl = co.kind === 'LIMIT_BUY' ? '🎯 Limit Alım' : (co.kind === 'STOP_LOSS' ? '🛡️ Zarar Kes' : '🎯 Kâr Al');
              const pillCls = co.kind === 'STOP_LOSS' ? 'danger' : (co.kind === 'TAKE_PROFIT' ? 'good' : 'info');
              return `
                <div class="ms-list-row" style="border-color:rgba(240,180,41,0.38)">
                  <div style="min-width:0;flex:1">
                    <span class="ms-sig-pill ${pillCls}">${kindLbl} · Hedef ${fmtUnitTL(co.triggerPriceTL)} (${diffPct >= 0 ? '+' : ''}%${diffPct})</span>
                    <div style="font-size:14px;font-weight:800;margin-top:4px">${esc(co.ticker)} — ${co.kind === 'LIMIT_BUY' ? fmtTL(co.reservedTL) : co.qty + ' adet'}</div>
                    <div style="font-size:12px;color:var(--ink-400)">Güncel: ${fmtUnitTL(liveP)} · Fiyat hedefe ulaşınca otomatik işler.</div>
                  </div>
                  <button type="button" class="ms-btn danger sm" data-cancel-cond="${esc(co.id)}">İptal Et</button>
                </div>
              `;
            }).join('')}

            ${(member.settlementQueue || []).map((q) => `
              <div class="ms-list-row">
                <div>
                  <span class="ms-sig-pill warn">⏳ Takas / Valör Kum Saati · ${esc(fmtCountdown(q.settlesAtMs))}</span>
                  <div style="font-size:14px;font-weight:800;margin-top:4px">${esc(q.ticker || q.name)} — ${fmtTL(q.grossTL)}</div>
                  <div style="font-size:12.4px;color:var(--ink-400)">${esc(q.note)}</div>
                </div>
              </div>
            `).join('')}

            ${(member.pendingOrders || []).map((o) => `
              <div class="ms-list-row">
                <div style="min-width:0;flex:1">
                  <span class="ms-sig-pill info">🕒 Bekleyen Emir · ${esc(fmtCountdown(o.executesAtMs))}</span>
                  <div style="font-size:14px;font-weight:800;margin-top:4px">${esc(o.name)} (${o.side === 'BUY' ? fmtTL(o.reservedTL) : o.qty + ' adet satım'})</div>
                  <div style="font-size:12.4px;color:var(--ink-400)">${esc(o.note)}</div>
                </div>
                <button type="button" class="ms-btn danger sm" data-cancel-ord="${esc(o.id)}">İptal Et</button>
              </div>
            `).join('')}

            ${(member.ipoRequests || []).map((r) => `
              <div class="ms-list-row">
                <div>
                  <span class="ms-sig-pill info">🏛️ SPK Halka Arz Talebi · ${esc(fmtCountdown(r.allocatesAtMs))}</span>
                  <div style="font-size:14px;font-weight:800;margin-top:4px">${esc(r.ticker)} — ${r.requestedLots} Lot Talep (${fmtTL(r.blockedCashTL)} bloke)</div>
                </div>
              </div>
            `).join('')}

            ${queueCount === 0 ? `
              <div style="font-size:13.2px;color:var(--ink-400);text-align:center;padding:12px">Şu an takasta veya valör kuyruğunda bekleyen işlemin yok.</div>
            ` : ''}
          </div>
        </section>

        <!-- ★ İZLEME LİSTEM & HEDEF FİYAT ALARMLARIM -->
        <section class="ae-card" style="border-color:rgba(240,180,41,0.32)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <strong style="font-size:15.2px">★ İzleme Listem & Fiyat Alarmları (${watchItems.length})</strong>
            <button type="button" class="ms-btn sm" id="aeGoMarketWatchBtn">+ Ekle</button>
          </div>
          ${watchItems.length > 0 ? `
            <div class="ms-list">
              ${watchItems.map((w) => {
                const aObj = K.getAsset(w.assetKey);
                const liveP = aObj?.priceTL || 0;
                const distPct = (w.targetPriceTL > 0 && liveP > 0) ? +(((w.targetPriceTL / liveP) - 1) * 100).toFixed(1) : null;
                return `
                  <div class="ms-list-row" style="${w.triggeredAtMs ? 'border-color:rgba(16,185,129,0.55)' : ''}">
                    <div style="min-width:0;flex:1;cursor:pointer" data-open-asset="${esc(w.assetKey)}">
                      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                        <span class="ms-asset-code">${esc(w.ticker)}</span>
                        <strong style="font-size:13.8px">${esc(aObj?.name || w.name)}</strong>
                        ${w.triggeredAtMs ? `<span class="ms-sig-pill good">🔔 Alarm Çaldı!</span>` : ''}
                      </div>
                      <div style="font-size:12px;color:var(--ink-400);margin-top:3px">
                        Canlı: <strong style="color:var(--ink-100)">${fmtUnitTL(liveP)}</strong>
                        ${w.targetPriceTL > 0 ? ` · Hedef (${w.direction === 'ABOVE' ? '≥' : '≤'}): <strong style="color:var(--gold-bright)">${fmtUnitTL(w.targetPriceTL)}</strong> (${distPct >= 0 ? '+' : ''}%${distPct})` : ' · Alarm yok'}
                      </div>
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0">
                      <button type="button" class="ms-btn primary sm" data-open-asset="${esc(w.assetKey)}">Aç</button>
                      <button type="button" class="ms-btn sm" data-unwatch-key="${esc(w.assetKey)}">×</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `<div style="font-size:12.8px;color:var(--ink-400)">Henüz takip ettiğin varlık yok. Herhangi bir hisse veya altını açıp <strong>☆ Takip</strong> tuşuna basarak fiyat alarmı kurabilirsin.</div>`}
        </section>

        <section class="ae-card">
          <strong style="display:block;font-size:15.5px;margin-bottom:10px">📒 Tüm İşlem & Temettü Defterim</strong>
          <div class="ms-list">
            ${(member.tradeHistory || []).length > 0 ? member.tradeHistory.slice(0, 30).map((th) => `
              <div class="ms-list-row">
                <div style="min-width:0;flex:1">
                  <div style="display:flex;align-items:center;gap:6px;min-width:0">
                    <span class="ms-sig-pill ${th.side.includes('SATIŞ') || th.side.includes('BOZUM') ? 'warn' : 'good'}" style="flex-shrink:0">${esc(th.side)}</span>
                    <strong style="font-size:13.6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0">${esc(th.name)}</strong>
                  </div>
                  <div style="font-size:12.2px;color:var(--ink-400);margin-top:3px">${esc(th.note || '')}</div>
                  ${th.thesisNote ? `<div style="font-size:12px;color:var(--cyan)">Notun: "${esc(th.thesisNote)}"</div>` : ''}
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <strong style="font-size:14px;display:block">${fmtTL(th.amountTL)}</strong>
                  <small style="font-size:11.4px;color:var(--ink-500)">${esc(fmtAgo(th.ts))}</small>
                </div>
              </div>
            `).join('') : `
              <div style="font-size:13.2px;color:var(--ink-400);text-align:center;padding:14px">Henüz işlem kaydı yok.</div>
            `}
          </div>
        </section>
      `;
    }

    host.innerHTML = `
      ${lastPortfolioFeedback ? `<div class="ms-alert ${lastPortfolioFeedback.ok ? 'ok' : 'err'}">${esc(lastPortfolioFeedback.text)}</div>` : ''}

      <!-- DEV FERAH 1.000.000 ₺ KOKPİT KARTI -->
      <section class="ae-balance-hero">
        <div class="ae-balance-eyebrow">${esc(homeBrief?.greeting || 'Hoş geldin')}${member.profileRegistered ? ', ' + esc(member.name) : ''} · Toplam Portföy Değerin</div>
        <div class="ae-balance-figure">${fmtTL(snap.totalNetWorthTL)}</div>
        <div class="ae-balance-pills">
          <span class="ms-sig-pill ${snap.nominalPnlTL >= 0 ? 'good' : 'danger'}" style="font-size:12.8px;padding:4px 10px">
            ${snap.nominalPnlTL >= 0 ? 'Kazanç: +' : 'Kayıp: '}${fmtTL(snap.nominalPnlTL)} (${snap.nominalPnlPct >= 0 ? '+' : ''}%${snap.nominalPnlPct})
          </span>
          <span class="ms-sig-pill ${snap.realPurchasingPnlPct >= 0 ? 'info' : 'warn'}" style="font-size:12.2px;padding:4px 9px">
            🥖 Alım Gücü: ${snap.realPurchasingPnlPct >= 0 ? '+' : ''}%${snap.realPurchasingPnlPct}
          </span>
        </div>

        <div class="ae-balance-trio">
          <div class="ae-trio-cell">
            <span>Boş Nakit</span>
            <strong>${fmtCompactTL(snap.cashTL)}</strong>
          </div>
          <div class="ae-trio-cell">
            <span>Yatırımda</span>
            <strong>${fmtCompactTL(investedOrPendingTL)}</strong>
          </div>
          <div class="ae-trio-cell">
            <span>Aylık Gelir</span>
            <strong class="${snap.monthlyPassiveIncomeTL > 0 ? 'pos' : ''}">+${fmtCompactTL(snap.monthlyPassiveIncomeTL)}</strong>
          </div>
        </div>

        <div class="ae-hero-cta-row">
          <button type="button" class="ae-big-btn gold" id="aeHeroInvestBtn">💰 Yatırım Yap</button>
          <button type="button" class="ae-big-btn" id="aeHeroQueuesBtn">⏳ Emirler${queueCount > 0 ? ` (${queueCount})` : ''}</button>
        </div>
      </section>

      <!-- TETİKLENEN FİYAT ALARMLARI BANDI -->
      ${triggeredAlerts.length > 0 ? triggeredAlerts.slice(0, 2).map((al) => `
        <div class="ae-alert-strip">
          <div style="min-width:0;flex:1;font-size:12.8px">
            🔔 <strong>${esc(al.ticker)} hedef fiyatına ulaştı!</strong> Hedef: ${fmtUnitTL(al.targetPriceTL)} · Canlı: <strong>${fmtUnitTL(K.getAsset(al.assetKey)?.priceTL || al.triggeredPriceTL)}</strong>
          </div>
          <div style="display:flex;gap:6px">
            <button type="button" class="ms-btn primary sm" data-open-asset="${esc(al.assetKey)}">İncele</button>
            <button type="button" class="ms-btn sm" data-dismiss-alert="${esc(al.assetKey)}">Tamam</button>
          </div>
        </div>
      `).join('') : ''}

      <!-- BEKLEYEN VALÖR / AÇILIŞ EMRİ KOLAY NAKİT ÇÖZÜCÜ -->
      ${firstPendingBuy && snap.cashTL < 25000 ? `
        <div class="ae-pending-unlock-box">
          <div style="font-size:13.2px;line-height:1.45;margin-bottom:8px">
            ⏳ <strong>${fmtTL(firstPendingBuy.reservedTL)}</strong> paran şu an <strong>${esc(firstPendingBuy.name)}</strong> valör sırasında bekliyor (${esc(fmtCountdown(firstPendingBuy.executesAtMs))}). Başka yatırım denemek istersen bir kısmını tek tıkla nakde çözebilirsin:
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${firstPendingBuy.reservedTL >= 260000 ? `<button type="button" class="ms-btn primary sm" data-home-release-ord="${esc(firstPendingBuy.id)}" data-home-release-amt="250000">250.000 ₺ Nakde Çöz</button>` : ''}
            <button type="button" class="ms-btn sm" id="aeHomeOpenQueuesFromPending">Tüm Emirleri Gör</button>
          </div>
        </div>
      ` : ''}

      <div class="ae-seg" role="tablist">
        <button type="button" class="ae-seg-btn ${homeSubTab === 'TODAY' ? 'active' : ''}" data-hsub="TODAY">Bugün</button>
        <button type="button" class="ae-seg-btn ${homeSubTab === 'HOLDINGS' ? 'active' : ''}" data-hsub="HOLDINGS">Varlıklar (${holdingsCount})</button>
        <button type="button" class="ae-seg-btn ${homeSubTab === 'QUEUES' ? 'active' : ''}" data-hsub="QUEUES">Emir & Takip${queueCount + watchItems.length > 0 ? ` (${queueCount + watchItems.length})` : ''}</button>
      </div>

      ${subBodyHtml}
    `;

    host.querySelectorAll('[data-hsub]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        homeSubTab = b.getAttribute('data-hsub') || 'TODAY';
        renderHomeTab(host);
      });
    });

    document.getElementById('aeHeroInvestBtn')?.addEventListener('click', () => {
      activeCategory = 'ALL';
      activeLens = 'VITRIN';
      switchTab('market');
    });
    document.getElementById('aeHeroQueuesBtn')?.addEventListener('click', () => {
      AetherNative.haptic('selection');
      homeSubTab = 'QUEUES';
      renderHomeTab(host);
    });
    document.getElementById('aeHomeOpenQueuesFromPending')?.addEventListener('click', () => {
      homeSubTab = 'QUEUES';
      renderHomeTab(host);
    });
    document.getElementById('aeSeeAllMarketBtn')?.addEventListener('click', () => switchTab('market'));
    document.getElementById('aeHomeInstallBtn')?.addEventListener('click', () => openInstallAppModal(false));
    document.getElementById('aeDismissStarterHomeBtn')?.addEventListener('click', () => {
      starterGuideDismissed = true;
      renderHomeTab(host);
    });
    document.getElementById('aeStep1GoBtn')?.addEventListener('click', () => openAssetDrawer('bist-tuprs', 'VAULT'));
    document.getElementById('aeStep2GoBtn')?.addEventListener('click', () => {
      activeCategory = 'SAFE_HAVEN';
      activeLens = 'VITRIN';
      switchTab('market');
    });
    document.getElementById('aeStep3GoBtn')?.addEventListener('click', () => {
      masterySubTab = 'LABS';
      labToolId = 'DRILL';
      switchTab('mastery');
    });
    document.getElementById('aeHomeBasketDetails')?.addEventListener('toggle', (e) => {
      homeBasketOpen = Boolean(e.target.open);
    });
    document.getElementById('aeHomeDailyDetails')?.addEventListener('toggle', (e) => {
      homeDailyOpen = Boolean(e.target.open);
    });
    document.getElementById('aeGoMarketWatchBtn')?.addEventListener('click', () => {
      activeCategory = 'ALL';
      activeLens = 'VITRIN';
      switchTab('market');
    });
    host.querySelectorAll('[data-cancel-cond]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'CANCEL_CONDITIONAL', orderId: b.getAttribute('data-cancel-cond') });
        AetherNative.haptic(res.ok ? 'success' : 'error');
        AetherNative.toast(res.ok ? res.message : res.reason, res.ok ? 'ok' : 'err');
        renderHeader();
        renderHomeTab(host);
      });
    });
    host.querySelectorAll('[data-unwatch-key]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.toggleWatchlistAsset(b.getAttribute('data-unwatch-key'));
        AetherNative.haptic('selection');
        if (res.message) AetherNative.toast(res.message, 'info');
        renderHomeTab(host);
      });
    });
    host.querySelectorAll('[data-dismiss-alert]').forEach((b) => {
      b.addEventListener('click', () => {
        K.dismissWatchlistAlert(b.getAttribute('data-dismiss-alert'));
        renderHomeTab(host);
      });
    });
    document.getElementById('aeGoMoreCasesBtn')?.addEventListener('click', () => {
      masterySubTab = 'CASES';
      switchTab('mastery');
    });
    document.getElementById('aeGoLabsFromHomeBtn')?.addEventListener('click', () => {
      masterySubTab = 'LABS';
      switchTab('mastery');
    });

    document.getElementById('aeSpeakHomeBriefBtn')?.addEventListener('click', () => {
      if (!homeBrief) return;
      const speechText = homeBrief.bullets.map((b) => `${b.title}. ${b.body}`).join(' ');
      AetherNative.speak(speechText);
    });

    const bindPrefillAssetButtons = (scopeEl) => {
      scopeEl?.querySelectorAll('[data-prefill-amt]').forEach((btn) => {
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          AetherNative.haptic('light');
          const aKey = btn.getAttribute('data-open-asset');
          const prefAmt = Number(btn.getAttribute('data-prefill-amt')) || 100000;
          openAssetDrawer(aKey, 'ORDER');
          draftOrderAmount = prefAmt;
          renderAssetDrawer();
        });
      });
    };
    bindPrefillAssetButtons(host);

    host.querySelectorAll('[data-hb-preset]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        const pid = b.getAttribute('data-hb-preset');
        hbPresetId = pid || 'FOUR_SEASON';
        homeBasketOpen = true;
        if (pid === 'CALM_SHIELD') { hbSukukPct = 55; hbGoldPct = 30; hbEquityPct = 10; }
        else if (pid === 'MONTHLY_INCOME') { hbSukukPct = 60; hbGoldPct = 15; hbEquityPct = 20; }
        else if (pid === 'GROWTH_FACTORY') { hbSukukPct = 20; hbGoldPct = 20; hbEquityPct = 50; }
        else { hbSukukPct = 40; hbGoldPct = 25; hbEquityPct = 25; }
        renderHomeTab(host);
      });
    });

    const updateHomeBasketLive = () => {
      if (!G.simulateBalancedBasketBuilder) return;
      hbPresetId = 'CUSTOM';
      const hb = G.simulateBalancedBasketBuilder({
        capitalTL: Math.max(100000, Math.round(snap.totalNetWorthTL || 1000000)),
        sukukPct: hbSukukPct,
        goldPct: hbGoldPct,
        equityPct: hbEquityPct
      });
      const l1 = document.getElementById('aeHbSukukLbl');
      const l2 = document.getElementById('aeHbGoldLbl');
      const l3 = document.getElementById('aeHbEqLbl');
      if (l1) l1.textContent = `%${hb.wSukuk}`;
      if (l2) l2.textContent = `%${hb.wGold}`;
      if (l3) l3.textContent = `%${hb.wEquity}`;
      const out = document.getElementById('aeHomeBasketLiveOut');
      if (out) {
        out.innerHTML = buildHomeBasketLiveHtml(hb, snap);
        bindAssetListClicks(out);
        bindPrefillAssetButtons(out);
      }
    };
    document.getElementById('aeHbSukukSl')?.addEventListener('input', (e) => { hbSukukPct = Number(e.target.value) || 0; updateHomeBasketLive(); });
    document.getElementById('aeHbGoldSl')?.addEventListener('input', (e) => { hbGoldPct = Number(e.target.value) || 0; updateHomeBasketLive(); });
    document.getElementById('aeHbEqSl')?.addEventListener('input', (e) => { hbEquityPct = Number(e.target.value) || 0; updateHomeBasketLive(); });

    host.querySelectorAll('[data-home-door]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('light');
        const door = b.getAttribute('data-home-door');
        searchQuery = '';
        if (door === 'SAFE_HAVEN') {
          activeCategory = 'SAFE_HAVEN';
          activeLens = 'VITRIN';
        } else {
          activeCategory = 'ALL';
          activeLens = door || 'VITRIN';
        }
        switchTab('market');
      });
    });

    host.querySelectorAll('[data-home-release-ord]').forEach((b) => {
      b.addEventListener('click', () => {
        const oid = b.getAttribute('data-home-release-ord');
        const amt = Number(b.getAttribute('data-home-release-amt')) || 250000;
        const res = K.executeOrder({ side: 'REDUCE_PENDING_ORDER', orderId: oid, releaseAmountTL: amt });
        AetherNative.haptic(res.ok ? 'success' : 'error');
        AetherNative.toast(res.ok ? res.message : res.reason, res.ok ? 'ok' : 'err');
        renderHeader();
        renderHomeTab(host);
      });
    });

    host.querySelectorAll('[data-daily-case]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cid = btn.getAttribute('data-daily-case');
        const chId = btn.getAttribute('data-daily-choice');
        const isOpt = btn.getAttribute('data-daily-opt') === '1';
        dailyPickedChoiceId = chId;
        K.recordFieldCaseAttempt(cid, chId, isOpt);
        if (K.recordDailyChallenge && dailyQ?.dateYmd) {
          K.recordDailyChallenge(dailyQ.dateYmd, isOpt);
        }
        AetherNative.haptic(isOpt ? 'success' : 'warning');
        AetherNative.toast(isOpt ? 'Harika! Günün usta sorusunu bildin!' : 'Tuzak açıklaması açıldı — hemen oku!', isOpt ? 'ok' : 'info');
        renderHeader();
        renderHomeTab(host);
      });
    });

    // Cüzdan etkileşimleri
    document.getElementById('aeGoMarketFromWallet')?.addEventListener('click', () => switchTab('market'));
    document.getElementById('msRepayMarginBtn')?.addEventListener('click', () => {
      const res = K.executeOrder({ side: 'REPAY_MARGIN' });
      AetherNative.haptic(res.ok ? 'success' : 'error');
      lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
      renderHeader();
      renderHomeTab(host);
    });
    document.getElementById('msPayGvkTaxBtn')?.addEventListener('click', () => {
      const res = K.executeOrder({ side: 'PAY_GVK80_TAX' });
      AetherNative.haptic(res.ok ? 'success' : 'error');
      lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
      renderHeader();
      renderHomeTab(host);
    });
    document.getElementById('msToggleRepoBtn')?.addEventListener('click', () => {
      const res = K.executeOrder({ side: 'TOGGLE_OVERNIGHT_REPO' });
      AetherNative.haptic('selection');
      lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
      renderHeader();
      renderHomeTab(host);
    });
    host.querySelectorAll('[data-cancel-ord]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'CANCEL_ORDER', orderId: b.getAttribute('data-cancel-ord') });
        AetherNative.haptic(res.ok ? 'success' : 'error');
        lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
        renderHeader();
        renderHomeTab(host);
      });
    });
    host.querySelectorAll('[data-break-tr]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'BREAK_TRANCHE', trancheId: b.getAttribute('data-break-tr') });
        AetherNative.haptic(res.ok ? 'warning' : 'error');
        lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
        renderHeader();
        renderHomeTab(host);
      });
    });
    host.querySelectorAll('[data-open-pos]').forEach((b) => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        AetherNative.haptic('light');
        const side = b.getAttribute('data-pos-side') || 'BUY';
        openAssetDrawer(b.getAttribute('data-open-pos'), 'ORDER', side);
      });
    });

    bindAssetListClicks(host);
    bindTermExplainClicks(host);
  }

  // --------------------------------------------------------------------------
  // 4B. SEKME 2: YATIRIM (FERAH KATEGORİLER, ANINDA ARAMA & AKILLI SÜZGEÇLER)
  // --------------------------------------------------------------------------
  function renderMarketTab(host) {
    const K = global.AetherKernelV10;
    const me = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(me);
    const sectorWeather = K.getSectorWeatherPulse ? K.getSectorWeatherPulse() : [];
    const allBistCount = K.getAllAssets().filter((a) => a.subVenue === 'BIST_STOCK' && a.priceTL > 0).length || 619;
    const assets = getFilteredMarketAssets();
    const firstPendingBuy = (me.pendingOrders || []).find((o) => o.side === 'BUY' && (o.reservedTL || 0) >= 10000);

    const sortShortLabel = marketSortBy === 'FORENSIC_SCORE'
      ? 'Sağlamlık'
      : (marketSortBy === 'CHANGE_DESC' ? 'Yükselenler' : (marketSortBy === 'CHANGE_ASC' ? 'Düşenler' : (marketSortBy === 'DISCOUNT_52W' ? 'Ucuzlar' : 'Sırala')));

    const activeLensTitleMap = {
      VITRIN: '⭐ Öne Çıkanlar',
      CUSTOM_SCREENER: '🧪 Kendi Süzgecin',
      EARLY_SIGNALS: '🎯 Öncü İzler',
      HARVEST_VALUE: '🏭 Hasat & Değer',
      FIRE_SALE: '🔥 Yangın Yeri Cevherleri',
      BAKERY_CASH: '🥖 Fırın Kasalar (Gerçek Nakit)',
      PASSIVE_RIVER: '💧 Aylık Nakit Çarkı',
      ROTTEN_TRAPS: '⛔ Dikkat: Tuzak & Hava Parası',
      IPO_DIVIDEND: '🏛️ Halka Arz & Temettü'
    };

    host.innerHTML = `
      <!-- 1. ANINDA ARAMA (BÜYÜK, FERAH) -->
      <div class="ae-search-bar" style="margin:2px 0 10px">
        <div class="ae-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7.5"/><path d="M20 20l-3.8-3.8"/>
          </svg>
          <input id="msSearchInp" class="ae-input" type="search" autocomplete="off" autocorrect="off" spellcheck="false" value="${esc(searchQuery)}" placeholder="Altın, Dolar, Tüpraş, THY, Fon ara..." />
          <button type="button" id="aeClearSearchBtn" class="ae-clear-btn" ${searchQuery ? '' : 'hidden'} aria-label="Aramayı Temizle">×</button>
        </div>
      </div>

      <!-- 2. 7 SADE, ANLAŞILIR ANA KATEGORİ (+ İZLEME LİSTESİ) -->
      <div class="ae-hscroll" id="aeCatScroll" style="margin-bottom:8px">
        <button type="button" class="ae-chip ${activeCategory === 'ALL' && activeLens === 'VITRIN' ? 'active' : ''}" data-lens="VITRIN">⭐ Öne Çıkanlar</button>
        <button type="button" class="ae-chip ${activeCategory === 'WATCHLIST' ? 'active' : ''}" data-cat="WATCHLIST">★ Takip (${(me.watchlist || []).length})</button>
        <button type="button" class="ae-chip ${activeCategory === 'SAFE_HAVEN' ? 'active' : ''}" data-cat="SAFE_HAVEN">🛡️ Güvenli Liman</button>
        <button type="button" class="ae-chip ${activeCategory === 'GOLD_FX' ? 'active' : ''}" data-cat="GOLD_FX">🪙 Altın & Döviz</button>
        <button type="button" class="ae-chip ${activeCategory === 'RATE_SUKUK' ? 'active' : ''}" data-cat="RATE_SUKUK">💧 Faiz & Sukuk</button>
        <button type="button" class="ae-chip ${activeCategory === 'BIST_ALL' ? 'active' : ''}" data-cat="BIST_ALL">🏭 Borsa (${allBistCount})</button>
        <button type="button" class="ae-chip ${activeCategory === 'FUNDS' ? 'active' : ''}" data-cat="FUNDS">📦 Fonlar (TEFAS)</button>
        <button type="button" class="ae-chip ${activeCategory === 'GLOBAL_CRYPTO' ? 'active' : ''}" data-cat="GLOBAL_CRYPTO">🌍 Dünya & Kripto</button>
      </div>

      <!-- 3. ETİKETLİ NET ARAÇ ÇUBUĞU (GİZEMLİ İKON YOK!) -->
      <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px">
        <button type="button" class="ms-btn ${marketShowProTools || (activeCategory === 'ALL' && activeLens !== 'VITRIN') ? 'primary' : ''} sm" id="aeToggleProToolsBtn" style="flex:1;min-width:140px">
          🎯 Akıllı Radarlar ${marketShowProTools ? '▲' : '▼'}
        </button>
        <button type="button" class="ms-btn sm" id="aeQuickDuelLaunchBtn">⚔️ Kıyasla</button>
        <button type="button" class="ms-btn ${marketSortBy !== 'DEFAULT' ? 'primary' : ''} sm" id="aeSortCycleBtn">↕️ ${esc(sortShortLabel)}</button>
      </div>

      <!-- BEKLEYEN VALÖR EMRİ HIZLI ÇÖZÜCÜ -->
      ${firstPendingBuy && snap.cashTL < 25000 ? `
        <div class="ae-pending-unlock-box" style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
          <div style="min-width:0;flex:1;font-size:12.6px;line-height:1.38">
            ⏳ <strong>${fmtTL(firstPendingBuy.reservedTL)}</strong> paran <strong>${esc(firstPendingBuy.name)}</strong> sırasında bekliyor.
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            ${firstPendingBuy.reservedTL >= 260000 ? `<button type="button" class="ms-btn primary sm" data-mkt-release-ord="${esc(firstPendingBuy.id)}" data-mkt-release-amt="250000">250 Bin ₺ Çöz</button>` : ''}
            <button type="button" class="ms-btn sm" id="aeJumpQueuesFromMktBtn">Emirler</button>
          </div>
        </div>
      ` : ''}

      <!-- AKILLI RADARLAR & SEKTÖR HAVA DURUMU (TEK DOKUNUŞLA AÇILIR — EKRANI BOĞMAZ!) -->
      ${marketShowProTools ? `
        <section class="ae-card" style="border-color:rgba(240,180,41,0.34);padding:13px">
          <div style="font-size:12.6px;font-weight:800;color:var(--gold-bright);margin-bottom:7px">🎯 Uzman Keşif Radarları & Kendi Süzgecin:</div>
          <div class="ae-hscroll" id="aeLensScroll" style="margin-bottom:8px">
            <button type="button" class="ae-chip ${activeLens === 'BAKERY_CASH' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="BAKERY_CASH">🥖 Fırın Kasalar</button>
            <button type="button" class="ae-chip ${activeLens === 'FIRE_SALE' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="FIRE_SALE">🔥 Yangın Yeri</button>
            <button type="button" class="ae-chip ${activeLens === 'PASSIVE_RIVER' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="PASSIVE_RIVER">💧 Nakit Çarkı</button>
            <button type="button" class="ae-chip ${activeLens === 'CUSTOM_SCREENER' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="CUSTOM_SCREENER">🧪 Kendi Süzgecin</button>
            <button type="button" class="ae-chip ${activeLens === 'EARLY_SIGNALS' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="EARLY_SIGNALS">🎯 Öncü İzler</button>
            <button type="button" class="ae-chip ${activeLens === 'HARVEST_VALUE' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="HARVEST_VALUE">🏭 Hasat & Değer</button>
            <button type="button" class="ae-chip ${activeLens === 'ROTTEN_TRAPS' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="ROTTEN_TRAPS">⛔ Tuzak & Hava Parası</button>
            <button type="button" class="ae-chip ${activeLens === 'IPO_DIVIDEND' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="IPO_DIVIDEND">🏛️ Arz & Temettü</button>
          </div>
          ${sectorWeather.length > 0 ? `
            <div style="font-size:12px;font-weight:800;color:var(--ink-400);margin-bottom:5px">🌤️ Bugün Sektörlerin Durumu (Dokun ve süz):</div>
            <div class="ae-hscroll" id="aeSectorWeatherScroll" style="padding-bottom:2px">
              ${sectorWeather.map((sw) => {
                const cls = sw.avgChg1D >= 0.4 ? 'hot' : (sw.avgChg1D <= -0.4 ? 'cold' : '');
                return `
                  <button type="button" class="ae-sector-tile ${cls}" data-weather-pillar="${esc(sw.id)}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;font-size:12px;font-weight:800">
                      <span>${esc(sw.icon)} ${esc(sw.label)}</span>
                      <span class="${sw.avgChg1D >= 0 ? 'pos' : 'neg'}">${sw.avgChg1D >= 0 ? '+' : ''}%${sw.avgChg1D.toFixed(1)}</span>
                    </div>
                    <div style="font-size:10.6px;color:var(--ink-400);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                      Öncü: <strong style="color:var(--ink-200)">${esc(sw.topTicker)}</strong>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          ` : ''}
        </section>
      ` : ''}

      <!-- SEÇİLİ RADAR BAŞLIĞI (VİTRİN DIŞI AKTİFSE NET GÖSTER) -->
      ${activeCategory === 'ALL' && activeLens !== 'VITRIN' && !searchQuery ? `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:2px 4px 8px">
          <strong style="font-size:14.2px;color:var(--gold-bright)">${esc(activeLensTitleMap[activeLens] || activeLens)} (${assets.length})</strong>
          <button type="button" class="ms-btn sm" data-lens="VITRIN">Öne Çıkanlara Dön</button>
        </div>
      ` : ''}

      ${activeCategory === 'BIST_ALL' ? `
        <div class="ae-hscroll" id="aeSectorScroll" style="margin-bottom:8px">
          ${[
            ['ALL', `Tüm Sektörler (${allBistCount})`],
            ['Bankacılık', '🏦 Banka'],
            ['Havacılık & Lojistik', '✈️ Havacılık'],
            ['Elektrik & Yenilenebilir Enerji', '⚡ Enerji'],
            ['Market & Perakende', '🛒 Market/Perakende'],
            ['Otomotiv & Yan Sanayi', '🚗 Otomotiv'],
            ['Savunma & Havacılık Sanayi', '🛡️ Savunma'],
            ['Yazılım, Teknoloji & Telekom', '💻 Teknoloji'],
            ['Gıda, İçecek & Tarım', '🌾 Gıda/Tarım'],
            ['Demir-Çelik & Metal', '🏗️ Demir-Çelik'],
            ['Gayrimenkul & GYO', '🏢 GYO'],
            ['Holding & Çoklu Yatırım', '🏛️ Holding'],
            ['Sigorta & Emeklilik', '☂️ Sigorta'],
            ['Petrol, Rafineri & Doğalgaz', '🛢️ Rafineri/Gaz'],
            ['Kimya, Gübre & Kağıt', '🧪 Kimya/Gübre'],
            ['Çimento, Cam & Seramik', '🧱 Çimento/Cam'],
            ['Beyaz Eşya & Mobilya', '🏠 Beyaz Eşya'],
            ['İlaç & Sağlık', '💊 Sağlık'],
            ['Madencilik & Altın', '⛏️ Maden/Altın']
          ].map(([sKey, sLabel]) => `
            <button type="button" class="ae-chip ${bistSectorFilter === sKey ? 'active' : ''}" data-bsec="${esc(sKey)}">${esc(sLabel)}</button>
          `).join('')}
        </div>
      ` : ''}

      ${marketSortBy !== 'DEFAULT' ? `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 4px 8px;font-size:12.4px;color:var(--gold-bright);font-weight:800">
          <span>Sıralama: ${marketSortBy === 'FORENSIC_SCORE' ? 'En Sağlam Kasa Puanı' : (marketSortBy === 'CHANGE_DESC' ? 'En Çok Yükselenler' : (marketSortBy === 'CHANGE_ASC' ? 'En Çok Düşenler' : 'Zirveden En Ucuzlar'))}</span>
          <button type="button" class="ms-btn sm" id="aeResetSortBtn">Sıfırla</button>
        </div>
      ` : ''}

      <!-- KENDİ SÜZGECİN TEZGÂHI -->
      ${activeLens === 'CUSTOM_SCREENER' && activeCategory === 'ALL' ? renderCustomScreenerWorkbenchHtml() : ''}

      <!-- HALKA ARZ & TEMETTÜ MASASI -->
      ${activeLens === 'IPO_DIVIDEND' ? renderIpoAndDividendDeskHtml() : ''}

      <!-- 5. FERAH VARLIK LİSTESİ BÖLGESİ -->
      <div id="aeMarketListRegion">
        ${buildMarketAssetListHtml(assets, snap)}
      </div>
    `;

    document.getElementById('aeToggleProToolsBtn')?.addEventListener('click', () => {
      AetherNative.haptic('selection');
      marketShowProTools = !marketShowProTools;
      renderMarketTab(host);
    });

    document.getElementById('aeJumpQueuesFromMktBtn')?.addEventListener('click', () => {
      AetherNative.haptic('light');
      homeSubTab = 'QUEUES';
      switchTab('home');
    });

    host.querySelectorAll('[data-mkt-release-ord]').forEach((b) => {
      b.addEventListener('click', () => {
        const oid = b.getAttribute('data-mkt-release-ord');
        const amt = Number(b.getAttribute('data-mkt-release-amt')) || 250000;
        const res = K.executeOrder({ side: 'REDUCE_PENDING_ORDER', orderId: oid, releaseAmountTL: amt });
        AetherNative.haptic(res.ok ? 'success' : 'error');
        AetherNative.toast(res.ok ? res.message : res.reason, res.ok ? 'ok' : 'err');
        renderHeader();
        renderMarketTab(host);
      });
    });

    document.getElementById('aeQuickDuelLaunchBtn')?.addEventListener('click', () => {
      AetherNative.haptic('light');
      duelRivalKey = 'gram-altin-spot';
      openAssetDrawer('bist-tuprs', 'DUEL');
    });

    host.querySelectorAll('[data-weather-pillar]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        const pid = b.getAttribute('data-weather-pillar');
        const secMap = {
          bank: 'Bankacılık',
          aero: 'Havacılık & Lojistik',
          retail: 'Market & Perakende',
          auto: 'Otomotiv & Yan Sanayi',
          energy: 'Elektrik & Yenilenebilir Enerji',
          defense: 'Savunma & Havacılık Sanayi',
          reit: 'Gayrimenkul & GYO'
        };
        if (pid === 'shield') {
          activeCategory = 'GOLD_FX';
          activeLens = 'VITRIN';
        } else if (secMap[pid]) {
          activeCategory = 'BIST_ALL';
          bistSectorFilter = secMap[pid];
          bistVisibleLimit = 100;
        }
        renderMarketTab(host);
      });
    });

    host.querySelectorAll('[data-scr-toggle]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        const fid = b.getAttribute('data-scr-toggle');
        const cur = new Set(getActiveScreenerIds());
        if (cur.has(fid)) cur.delete(fid);
        else cur.add(fid);
        screenerSelectedIds = Array.from(cur);
        if (K.saveCustomScreenerFilters) K.saveCustomScreenerFilters(screenerSelectedIds);
        renderMarketTab(host);
      });
    });

    host.querySelectorAll('[data-scr-preset]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        const p = b.getAttribute('data-scr-preset');
        const presets = {
          FORTRESS: ['OCF_REAL_CASH', 'NET_CASH_VAULT', 'HIGH_CAPITAL_RETURN', 'CLEAN_GOVERNANCE'],
          FIRE_GEM: ['DRAWDOWN_HUNTER', 'OCF_REAL_CASH', 'DEEP_BOOK_DISCOUNT', 'CLEAN_GOVERNANCE'],
          EXPORT_CASH: ['FX_EXPORT_ARMOR', 'OCF_REAL_CASH', 'CLEAN_GOVERNANCE'],
          TAX_RIVER: ['ZERO_TAX_SHIELD', 'DIVIDEND_RIVER'],
          CLEAR: []
        };
        screenerSelectedIds = presets[p] ? [...presets[p]] : [];
        if (K.saveCustomScreenerFilters) K.saveCustomScreenerFilters(screenerSelectedIds);
        renderMarketTab(host);
      });
    });

    document.getElementById('aeOpenPreBriefBtn')?.addEventListener('click', () => {
      compassSubTab = 'BRIEF';
      switchTab('compass');
    });

    document.getElementById('aeDismissPreBriefBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      preOpenBriefDismissed = true;
      renderMarketTab(host);
    });

    document.getElementById('aeOpenInstallChipBtn')?.addEventListener('click', () => {
      AetherNative.haptic('light');
      openInstallAppModal();
    });

    document.getElementById('aeViewToggleBtn')?.addEventListener('click', () => {
      AetherNative.haptic('selection');
      marketViewMode = marketViewMode === 'LIST' ? 'BENTO' : 'LIST';
      renderMarketTab(host);
    });

    document.getElementById('aeSortCycleBtn')?.addEventListener('click', () => {
      AetherNative.haptic('selection');
      const order = ['DEFAULT', 'FORENSIC_SCORE', 'CHANGE_DESC', 'CHANGE_ASC', 'DISCOUNT_52W'];
      marketSortBy = order[(order.indexOf(marketSortBy) + 1) % order.length];
      renderMarketTab(host);
    });

    document.getElementById('aeResetSortBtn')?.addEventListener('click', () => {
      marketSortBy = 'DEFAULT';
      renderMarketTab(host);
    });

    host.querySelectorAll('[data-lens]').forEach((btn) => {
      btn.addEventListener('click', () => {
        AetherNative.haptic('selection');
        activeLens = btn.getAttribute('data-lens');
        activeCategory = 'ALL';
        bistSectorFilter = 'ALL';
        bistVisibleLimit = 100;
        searchQuery = '';
        lastIpoFeedback = null;
        renderMarketTab(host);
      });
    });

    host.querySelectorAll('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        AetherNative.haptic('selection');
        activeCategory = btn.getAttribute('data-cat');
        bistVisibleLimit = 100;
        searchQuery = '';
        renderMarketTab(host);
      });
    });

    host.querySelectorAll('[data-bsec]').forEach((btn) => {
      btn.addEventListener('click', () => {
        AetherNative.haptic('selection');
        bistSectorFilter = btn.getAttribute('data-bsec') || 'ALL';
        bistVisibleLimit = 100;
        renderMarketTab(host);
      });
    });

    // Cerrahi Arama: Klavyeyi ve odağı ASLA kaybetmeden yalnızca #aeMarketListRegion güncellenir!
    const searchInp = document.getElementById('msSearchInp');
    const clearBtn = document.getElementById('aeClearSearchBtn');
    if (searchInp) {
      searchInp.addEventListener('input', () => {
        searchQuery = searchInp.value;
        if (clearBtn) clearBtn.hidden = !searchQuery;
        const listReg = document.getElementById('aeMarketListRegion');
        if (listReg) {
          const curSnap = K.evaluateMemberPortfolio();
          listReg.innerHTML = buildMarketAssetListHtml(getFilteredMarketAssets(), curSnap);
          bindAssetListClicks(listReg);
        }
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchQuery = '';
        if (searchInp) {
          searchInp.value = '';
          searchInp.focus();
        }
        clearBtn.hidden = true;
        const listReg = document.getElementById('aeMarketListRegion');
        if (listReg) {
          listReg.innerHTML = buildMarketAssetListHtml(getFilteredMarketAssets(), K.evaluateMemberPortfolio());
          bindAssetListClicks(listReg);
        }
      });
    }

    host.querySelectorAll('[data-join-ipo]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ipoId = btn.getAttribute('data-join-ipo');
        const inp = document.getElementById('msIpoLots_' + ipoId);
        const lots = Number(inp?.value || 100);
        const res = K.participateInIpo(ipoId, lots);
        AetherNative.haptic(res.ok ? 'success' : 'error');
        lastIpoFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
        if (res.ok) AetherNative.toast('Halka arz talebin kayda alındı!', 'ok');
        renderHeader();
        renderMarketTab(host);
      });
    });

    bindAssetListClicks(host);
  }

  // --------------------------------------------------------------------------
  // 5. SEKME 2: PUSULA (DOST & KAP, MUTFAK RADARI, DOMİNO, FIRTINA, TAKVİM)
  // --------------------------------------------------------------------------
  function renderKitchenSubDeskHtml() {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const desks = G.getKitchenIntelDesks ? G.getKitchenIntelDesks() : null;
    const be = G.computeBreakevenComparison ? G.computeBreakevenComparison(calcAmountTL, calcDays) : null;

    const deskChipsHtml = `
      <div class="ae-hscroll" id="aeKitchenDeskScroll" style="margin-bottom:10px">
        <button type="button" class="ae-chip ${kitchenDeskId === 'BREAKEVEN' ? 'active' : ''}" data-kdesk="BREAKEVEN">⚖️ Başabaş Terazisi</button>
        <button type="button" class="ae-chip ${kitchenDeskId === 'AUDIT_BARBELL' ? 'active' : ''}" data-kdesk="AUDIT_BARBELL">🛡️ Öz-Denetim & Zırh</button>
        <button type="button" class="ae-chip ${kitchenDeskId === 'TMS29' ? 'active' : ''}" data-kdesk="TMS29">🥖 TMS-29 & VUK Kasa</button>
        <button type="button" class="ae-chip ${kitchenDeskId === 'MKK_WHALE' ? 'active' : ''}" data-kdesk="MKK_WHALE">🕵️ MKK & Balina</button>
        <button type="button" class="ae-chip ${kitchenDeskId === 'PATTERNS' ? 'active' : ''}" data-kdesk="PATTERNS">📐 4 Tahta İzi</button>
        <button type="button" class="ae-chip ${kitchenDeskId === 'CAPEX_VALUE' ? 'active' : ''}" data-kdesk="CAPEX_VALUE">🏭 Hasat & Değer</button>
        <button type="button" class="ae-chip ${kitchenDeskId === 'FIELD_BDDK' ? 'active' : ''}" data-kdesk="FIELD_BDDK">🚢 Gümrük & BDDK</button>
      </div>
    `;

    const quickTickerBtn = (tk, extraLabel = '') => {
      const cleanTk = String(tk || '').replace(/^BIST:/i, '').trim();
      const a = K.getAsset(cleanTk) || K.getAsset(tk);
      if (!a) return `<span class="ms-asset-code" style="flex-shrink:0">${esc(cleanTk || tk)}</span>`;
      return `<button type="button" class="ms-btn sm" data-open-asset="${esc(a.key)}" style="padding:5px 9px;font-size:11.2px;flex-shrink:0">${esc(a.ticker)}${extraLabel ? ' · ' + esc(extraLabel) : ' · ' + (a.isRateInstrument ? '%' + a.annualGrossRatePct.toFixed(1) : fmtUnitTL(a.priceTL))}</button>`;
    };

    if (kitchenDeskId === 'AUDIT_BARBELL' && desks?.auditAndBarbell) {
      const sc = desks.auditAndBarbell.scorecard;
      const bp = desks.auditAndBarbell.barbellPlan;
      const zr = bp?.zeroRuinProof || null;
      const arbs = desks.auditAndBarbell.arbitrageChains || [];
      return `
        ${deskChipsHtml}
        ${sc ? `
          <section class="ae-hero-card">
            <span class="ms-sig-pill good">Feynman Öz-Denetim Karnesi · ${esc(sc.windowLabel || 'T-22 -> T-0')}</span>
            <h3 style="margin:6px 0 4px;font-size:15.8px;font-weight:900">Motor Kendi Sinyallerini Canlı Piyasada Denetledi</h3>
            <div class="ae-kpi-2x2" style="margin:8px 0">
              <div class="ms-kpi-box" style="border-color:rgba(16,185,129,0.4)">
                <span>Tuzaklardan Koruma İsabeti</span>
                <strong class="pos">%${sc.trapAvoidanceAccuracyPct ?? 96}</strong>
                <small>${sc.trapCount || 27} tuzak ort: %${sc.avgWorst6Traps1M ?? sc.avgTrap1M}</small>
              </div>
              <div class="ms-kpi-box" style="border-color:rgba(56,189,248,0.4)">
                <span>Top-6 Doğrulanmış Alfa Farkı</span>
                <strong class="pos">+${sc.netAlphaTop6SpreadPct ?? 38.7} puan</strong>
                <small>Top-6 ort: +%${sc.avgTop6Verified1M ?? 15.9}</small>
              </div>
            </div>
            ${sc.feynmanSelfCritique ? `<p style="margin:0 0 8px;font-size:11.8px;color:var(--ink-200);line-height:1.45">${esc(sc.feynmanSelfCritique)}</p>` : ''}
            ${(sc.topVerifiedWinners || []).length > 0 ? `
              <div class="ae-hscroll" style="padding-bottom:0">
                ${sc.topVerifiedWinners.slice(0, 6).map((w) => quickTickerBtn(w.id || w.symbol, (w.perf1M >= 0 ? '+' : '') + '%' + w.perf1M)).join('')}
              </div>
            ` : ''}
          </section>
        ` : ''}

        ${bp ? `
          <section class="ae-card">
            <span class="ms-sig-pill info">%${bp.armorWeightPct || 65} Kasa Zırhı + %${bp.equityBasketWeightPct || 35} Asimetrik Sepet</span>
            <h3 style="margin:6px 0 4px;font-size:15.4px;font-weight:800">1.000.000 ₺ Sıfır Yıkım (Zero-Ruin) Halter Mimarisi</h3>
            ${zr?.mathematicalTheorem ? `
              <div class="ms-alert ok" style="margin-bottom:10px;font-size:11.8px">
                <strong>Matematiksel Kanıt:</strong> ${esc(zr.mathematicalTheorem)}
              </div>
            ` : ''}
            <div class="ms-list" style="margin-bottom:10px">
              ${(bp.layer1Armor || []).map((arm) => `
                <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:5px">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0">
                    <div style="min-width:0;flex:1"><span class="ms-sig-pill good">${esc(arm.slot)} · %${arm.weightPct}</span> <strong style="font-size:12.8px">${esc(arm.name)}</strong></div>
                    ${arm.assetId ? quickTickerBtn(arm.assetId) : ''}
                  </div>
                  <div style="font-size:11.6px;color:var(--ink-200)">${esc(arm.role)}</div>
                </div>
              `).join('')}
            </div>
            <div style="font-size:12px;font-weight:800;color:var(--gold-bright);margin-bottom:6px">🎯 Katman-2: %${bp.equityBasketWeightPct || 35} Asimetrik Öncü Sepet (Stop: %${bp.hardStopLossPct || -7}):</div>
            <div class="ms-list">
              ${(bp.layer2AsymmetricBasket || []).slice(0, 6).map((eq) => `
                <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:5px">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0">
                    <div style="min-width:0;flex:1"><span class="ms-asset-code">${esc(String(eq.ticker || '').replace(/^BIST:/, ''))}</span> <strong style="font-size:12.6px">${esc(eq.name)}</strong></div>
                    ${quickTickerBtn(eq.ticker, 'R/R ' + (eq.riskRewardRatio || '2x'))}
                  </div>
                  <div style="font-size:11.5px;color:var(--ink-400)">Pay: %${eq.weightPct} · Destek: ${eq.supportBand} · Stop: ${eq.stopLossPrice} · 1A Hedef: +${eq.targetGainPct}%</div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${arbs.length > 0 ? `
          <section class="ae-card">
            <span class="ms-sig-pill warn">Canlı Tedarik Zinciri & Ambalaj Arbitrajları</span>
            <h3 style="margin:6px 0 8px;font-size:15px;font-weight:800">Aynı Varlık / Zincirde Fiyat Sapması Yakalayanlar</h3>
            <div class="ms-list">
              ${arbs.map((ch) => `
                <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:5px">
                  <span class="ms-sig-pill info" style="align-self:flex-start">${esc(ch.badge || 'Arbitraj')}</span>
                  <strong style="font-size:13px">${esc(ch.title)}</strong>
                  <div style="font-size:11.6px;color:var(--ink-200)">${esc(ch.actionableRule || ch.transmissionMechanism)}</div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      `;
    }

    if (kitchenDeskId === 'BREAKEVEN' && be) {
      return `
        ${deskChipsHtml}
        <section class="ae-hero-card">
          <span class="ms-sig-pill info">Canlı Faiz – Kur – Altın – Enflasyon Terazisi</span>
          <h3 style="margin:6px 0 4px;font-size:16px;font-weight:900">Dolar veya Altın Kaç ₺ Olmazsa TL Getirisine Yenilir?</h3>
          <p style="margin:0 0 10px;font-size:12px;color:var(--ink-200)">Tutar ve vadeyi seç; stopaj ve makas düşülmüş gerçek net sonuçları kuruşu kuruşuna tart:</p>

          <div style="font-size:11px;font-weight:800;color:var(--ink-400);margin-bottom:4px">Sermaye Tutarı:</div>
          <div class="ae-hscroll" style="margin-bottom:8px">
            ${[100000, 250000, 500000, 1000000].map((v) => `
              <button type="button" class="ae-chip sub ${calcAmountTL === v ? 'active' : ''}" data-bamt="${v}">${fmtCompactTL(v)}</button>
            `).join('')}
          </div>

          <div style="font-size:11px;font-weight:800;color:var(--ink-400);margin-bottom:4px">Vade Süresi:</div>
          <div class="ae-hscroll" style="margin-bottom:10px">
            ${[[32, '32 Gün (1 Ay)'], [90, '90 Gün (3 Ay)'], [180, '180 Gün (6 Ay)'], [365, '365 Gün (1 Yıl)']].map(([d, lbl]) => `
              <button type="button" class="ae-chip sub ${calcDays === d ? 'active' : ''}" data-bdays="${d}">${lbl}</button>
            `).join('')}
          </div>

          <div class="ae-kpi-2x2" style="margin-bottom:10px">
            <div class="ms-kpi-box" style="border-color:rgba(16,185,129,0.45)">
              <span>💧 %0 Vergili Kamu Sukuk</span>
              <strong class="pos">${fmtTL(be.sukuk.endTL)}</strong>
              <small>Net +${fmtTL(be.sukuk.netGainTL)} (+%${be.sukuk.netPeriodPct})</small>
            </div>
            <div class="ms-kpi-box">
              <span>🏦 Vadeli Mevduat (%${be.deposit.stopaj} Stopaj)</span>
              <strong>${fmtTL(be.deposit.endTL)}</strong>
              <small>Net +${fmtTL(be.deposit.netGainTL)} (+%${be.deposit.netPeriodPct})</small>
            </div>
            <div class="ms-kpi-box">
              <span>⚡ Günlük Bileşik PPF (%17,5 Vergi)</span>
              <strong>${fmtTL(be.ppf.endTL)}</strong>
              <small>Net +${fmtTL(be.ppf.netGainTL)} (+%${be.ppf.netPeriodPct})</small>
            </div>
            <div class="ms-kpi-box" style="border-color:rgba(245,158,11,0.42)">
              <span>🥖 Mutfak Enflasyon Barajı</span>
              <strong class="warn-txt">${fmtTL(be.infBarTL)}</strong>
              <small>Alım gücünü koruma sınırı (+%${be.infPeriodPct})</small>
            </div>
          </div>

          <div class="ae-card" style="background:var(--surface-2);margin-bottom:8px">
            <div style="font-size:12.6px;font-weight:800;margin-bottom:6px;color:var(--gold-bright)">🎯 ${be.horizonDays} Gün Sonraki Başabaş Kurları (Sukuk'u Geçmek İçin):</div>
            <div style="display:grid;gap:6px;font-size:12.2px">
              <div>• <strong>Dolar (Kapalıçarşıdan alırsan):</strong> Şu an ${be.usdNow} ₺ -> ${be.horizonDays} gün sonra en az <strong>${be.breakevenUsdBazaar} ₺</strong> olmalı! <span style="color:var(--ink-400)">(Gece bankadan alırsan ${be.breakevenUsdBankNight} ₺ olmalı!)</span></div>
              <div>• <strong>Fiziki Gram Altın:</strong> Şu an ${fmtTL(be.goldNow)} -> ${be.horizonDays} gün sonra en az <strong>${fmtTL(be.breakevenGoldBazaar)}</strong> olmalı!</div>
              <div>• <strong>ALTIN.S1 Hava Parası Farkı:</strong> ${fmtTL(be.amountTL)} ile Çarşıdan <strong>${be.goldArbitrage.bazaarGrams} gr</strong> altın alırken, borsada ALTIN.S1 alırsan sadece <strong>${be.goldArbitrage.s1Grams} gr</strong> alabiliyorsun (<strong class="neg">-${be.goldArbitrage.extraGramsInBazaar} gr / ~${fmtTL(be.goldArbitrage.s1AirMoneyTL)} hava parası kaybı!</strong>).</div>
            </div>
            <div class="ae-hscroll" style="margin-top:9px;padding-bottom:0">
              ${quickTickerBtn('kira-sertifikasi-sukuk', '%' + be.sukuk.annualGross + ' %0 Vergi')}
              ${quickTickerBtn('gram-altin-spot')}
              ${quickTickerBtn('altin-sertifikasi')}
              ${quickTickerBtn('doviz-usd')}
            </div>
          </div>
        </section>
      `;
    }

    if (kitchenDeskId === 'TMS29' && desks) {
      return `
        ${deskChipsHtml}
        <section class="ae-card">
          <span class="ms-sig-pill good">${desks.tms29.auditedCount} BIST Şirketi Bilanço Denetimi</span>
          <h3 style="margin:6px 0 4px;font-size:15.5px;font-weight:800">Saf Kasa Nakdi Şampiyonları (VUK & OCF >> Kağıt Kâr)</h3>
          <p style="margin:0 0 9px;font-size:11.9px;color:var(--ink-400)">TMS-29 amortismanı yüzünden kağıt kârı düşük görünse de vergi dairesi (VUK) ve esas faaliyet kasasında oluk oluk nakit basanlar:</p>
          <div class="ms-list" style="margin-bottom:12px">
            ${[...desks.tms29.vukCashLeaders, ...desks.tms29.cashChampions].slice(0, 8).map((x) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:6px">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0">
                  <div style="min-width:0;flex:1"><span class="ms-asset-code">${esc(x.ticker)}</span> <strong style="font-size:13px">${esc(x.name)}</strong></div>
                  ${quickTickerBtn(x.ticker, 'Röntgen')}
                </div>
                <div style="font-size:11.8px;color:var(--ink-200)">${esc(x.vukVerdict || x.auditNote)}</div>
              </div>
            `).join('')}
          </div>

          <span class="ms-sig-pill danger">Kırmızı Bayrak · Makyajlı Kâr, İlişkili Taraf & ÖST Borç Duvarı</span>
          <h3 style="margin:6px 0 4px;font-size:15px;font-weight:800">Kağıt Üstünde Kâr Yazıp Kasadan Nakit Yakanlar</h3>
          <div class="ms-list">
            ${[
              ...desks.tms29.illusionTraps.slice(0, 4),
              ...(desks.tms29.relatedPartyRisks || []).slice(0, 3),
              ...(desks.tms29.bondRolloverRisks || []).slice(0, 3),
              ...desks.tms29.debtWalls.slice(0, 2)
            ].map((x) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:6px;border-color:rgba(244,63,94,0.28)">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0">
                  <div style="min-width:0;flex:1"><span class="ms-sig-pill danger">${esc(x.ticker)}</span> <strong style="font-size:13px">${esc(x.name)}</strong></div>
                  ${quickTickerBtn(x.ticker, 'İncele')}
                </div>
                <div style="font-size:11.8px;color:var(--ink-400)">${esc(x.auditNote || x.auditWarning || x.bondDeskNote)}</div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }

    if (kitchenDeskId === 'MKK_WHALE' && desks) {
      return `
        ${deskChipsHtml}
        <section class="ae-card">
          <span class="ms-sig-pill danger">MKK Fiili Dolaşım Lot Artışı (${desks.mkkWhale.meta?.totalSnapshotsRecorded || 2700}+ Anlık Kesit)</span>
          <h3 style="margin:6px 0 4px;font-size:15.5px;font-weight:800">Patron / Ortak "Tipe Dönüşüm" Arz Alarmları</h3>
          <p style="margin:0 0 9px;font-size:11.9px;color:var(--ink-400)">Kapalı payların MKK'da borsada satılabilir açık lota dönüştüğü tahtalar — parlak haber gelse bile dikkatle yaklaşılır:</p>
          <div class="ms-list" style="margin-bottom:12px">
            ${desks.mkkWhale.lotExpansions.map((x) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:6px;border-color:rgba(244,63,94,0.3)">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0">
                  <div style="min-width:0;flex:1"><span class="ms-sig-pill danger">${esc(x.ticker)}</span> <strong style="font-size:13px">${esc(x.name)}</strong></div>
                  ${quickTickerBtn(x.ticker, 'Röntgen')}
                </div>
                <div style="font-size:11.8px;color:var(--ink-200)">${esc(x.note)}</div>
              </div>
            `).join('')}
          </div>

          <span class="ms-sig-pill good">Kurumsal Emilim, Döviz Kaleleri & Küresel Zincir Üstü Akış</span>
          <h3 style="margin:6px 0 4px;font-size:15px;font-weight:800">Hazirun Balinaları & Çeyrek Sonu Net Nakit Kaleleri</h3>
          <div class="ms-list">
            ${[
              ...desks.mkkWhale.stealthWhales,
              ...(desks.mkkWhale.quarterEndFxFortresses || []).slice(0, 4),
              ...desks.mkkWhale.tightFortresses.slice(0, 3)
            ].map((x) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:6px">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0">
                  <div style="min-width:0;flex:1"><span class="ms-asset-code">${esc(x.ticker)}</span> <strong style="font-size:13px">${esc(x.name)}</strong></div>
                  ${quickTickerBtn(x.ticker, 'İncele')}
                </div>
                <div style="font-size:11.8px;color:var(--ink-200)">${esc(x.whaleSignal || x.fxNote || x.note)}</div>
              </div>
            `).join('')}
            ${(desks.mkkWhale.globalWhaleMatrix || []).map((gw) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:5px">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap">
                  <strong style="font-size:12.8px">🌍 ${esc(gw.asset)}</strong>
                  <span class="ms-sig-pill warn">${esc(gw.statusBadge || gw.category)}</span>
                </div>
                <div style="font-size:11.5px;color:var(--cyan)">${esc(gw.metrics)}</div>
                <div style="font-size:11.6px;color:var(--ink-400)">${esc(gw.interpretation)}</div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }

    if (kitchenDeskId === 'PATTERNS' && desks) {
      const renderPatBlock = (badge, tone, title, arr) => `
        <div style="margin-bottom:12px">
          <span class="ms-sig-pill ${tone}">${badge}</span>
          <h4 style="margin:5px 0 6px;font-size:14.2px;font-weight:800">${title}</h4>
          <div class="ms-list">
            ${arr.map((x) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:5px">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0">
                  <div style="min-width:0;flex:1"><span class="ms-asset-code">${esc(x.ticker)}</span> <strong style="font-size:12.8px">${esc(x.name)}</strong></div>
                  ${quickTickerBtn(x.ticker)}
                </div>
                <div style="font-size:11.6px;color:var(--ink-400)">${esc(x.forensicNote)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      return `
        ${deskChipsHtml}
        <section class="ae-card">
          <h3 style="margin:0 0 8px;font-size:15.5px;font-weight:800">Tüm BIST Hisselerinde 4 Adli Tahta İzi Taraması</h3>
          ${renderPatBlock('1. İz · Sessiz Toplama', 'good', 'Fiyat Yatayken Dipte Kurumsal Emilim (CMF+)', desks.boardPatterns.quietBottom)}
          ${renderPatBlock('2. İz · Demir Taban', 'info', '52 Haftalık Dipte Özsermaye Altı Sıkışma', desks.boardPatterns.ironFloor)}
          ${renderPatBlock('3. İz · Hacimli Kırılım', 'good', '2x+ Hacim ve Nakit Akışı Onaylı Kırılım', desks.boardPatterns.instBreakout)}
          ${renderPatBlock('4. İz · Tuzak Dağıtım', 'danger', 'CMF Negatifken Tahtadan Kurumsal Mal Çıkışı', desks.boardPatterns.hiddenDist)}
        </section>
      `;
    }

    if (kitchenDeskId === 'CAPEX_VALUE' && desks) {
      return `
        ${deskChipsHtml}
        <section class="ae-card">
          <span class="ms-sig-pill good">Fabrika Yatırımı Bitti -> Para Basma Dönemi</span>
          <h3 style="margin:6px 0 4px;font-size:15.5px;font-weight:800">CAPEX Nakit Hasadı & Yüksek ROIC Hendek Şampiyonları</h3>
          <div class="ms-list" style="margin-bottom:12px">
            ${[...desks.capexAndValue.capexHarvest, ...desks.capexAndValue.evaMoat.slice(0, 4)].map((x) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:6px">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0">
                  <div style="min-width:0;flex:1"><span class="ms-asset-code">${esc(x.ticker)}</span> <strong style="font-size:13px">${esc(x.name)}</strong></div>
                  ${quickTickerBtn(x.ticker, 'Röntgen')}
                </div>
                <div style="font-size:11.8px;color:var(--ink-200)">${esc(x.harvestNote || x.evaNote)}</div>
              </div>
            `).join('')}
          </div>

          <span class="ms-sig-pill info">Defter Arbitrajı, Üst Pazar Terfisi & Zorunlu Fon Takvimi</span>
          <h3 style="margin:6px 0 6px;font-size:15px;font-weight:800">Özsermaye Altı Emilim & Endeks Akışı Adayları</h3>
          <div class="ms-list">
            ${[...desks.capexAndValue.bookArbitrage, ...(desks.capexAndValue.tierPromotions || []).slice(0, 4)].map((x) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:6px">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0">
                  <div style="min-width:0;flex:1"><span class="ms-asset-code">${esc(x.ticker)}</span> <strong style="font-size:13px">${esc(x.name)}</strong></div>
                  ${quickTickerBtn(x.ticker)}
                </div>
                <div style="font-size:11.8px;color:var(--ink-400)">${esc(x.legalNote || x.catalyst)}</div>
              </div>
            `).join('')}
            ${(desks.capexAndValue.mandatoryCalendar || []).map((mc) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:5px">
                <span class="ms-sig-pill good" style="align-self:flex-start">${esc(mc.badge)}</span>
                <div style="font-size:11.6px;color:var(--cyan);font-weight:700">${esc(mc.window || '')}</div>
                <div style="font-size:11.6px;color:var(--ink-200)">${esc(mc.mechanism)}</div>
                <div class="ae-hscroll" style="padding-bottom:0">
                  ${(mc.affectedTickers || []).slice(0, 6).map((tk) => quickTickerBtn(tk)).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }

    // FIELD_BDDK
    return `
      ${deskChipsHtml}
      ${desks ? `
        <section class="ae-card">
          <span class="ms-sig-pill info">Bilançodan 45–60 Gün Önce Konuşan Saha Verileri</span>
          <h3 style="margin:6px 0 8px;font-size:15.5px;font-weight:800">12 Haneli GTİP Gümrük, Ana-Yan Sanayi & TİM Havzaları</h3>
          <div class="ms-list" style="margin-bottom:12px">
            ${desks.fieldAndBddk.gtipMatrix.map((g) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:6px">
                <div style="min-width:0"><span class="ms-sig-pill warn">${esc(g.hsCode)}</span> <strong style="font-size:13px;margin-left:4px">${esc(g.productName)}</strong></div>
                <div style="font-size:11.5px;color:var(--cyan);font-weight:700">Öncü Kaynak: ${esc(g.leadingSource)}</div>
                <div style="font-size:11.8px;color:var(--ink-200)">${esc(g.liveSpreadSignal)}</div>
                <div class="ae-hscroll" style="padding-bottom:0">
                  ${(g.matchedStocks || []).slice(0, 5).map((ms) => quickTickerBtn(ms.ticker)).join('')}
                </div>
              </div>
            `).join('')}

            ${(desks.fieldAndBddk.oemCross || []).map((oc) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:6px">
                <strong style="font-size:12.8px">🔗 ${esc(oc.chainTitle)}</strong>
                <div style="font-size:11.6px;color:var(--ink-200)">${esc(oc.disclosureMechanism)}</div>
                <div class="ae-hscroll" style="padding-bottom:0">
                  ${[...(oc.anchors || []).slice(0, 2), ...(oc.suppliers || []).slice(0, 4)].map((s) => quickTickerBtn(s.ticker)).join('')}
                </div>
              </div>
            `).join('')}

            ${desks.fieldAndBddk.timBasins.slice(0, 4).map((tb) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:6px">
                <strong>🏭 ${esc(tb.province)} — <small style="color:var(--ink-400)">${esc(tb.sectorFocus)}</small></strong>
                <div style="font-size:11.7px;color:var(--ink-200)">${esc(tb.exportDriver)}</div>
                <div class="ae-hscroll" style="padding-bottom:0">
                  ${(tb.companies || []).slice(0, 5).map((c) => quickTickerBtn(c.ticker)).join('')}
                </div>
              </div>
            `).join('')}

            ${[...(desks.fieldAndBddk.epiasEnergy || []).slice(0, 3), ...(desks.fieldAndBddk.insuranceFloat || []).slice(0, 3)].map((ef) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:5px">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0">
                  <div style="min-width:0;flex:1"><span class="ms-asset-code">${esc(ef.ticker)}</span> <strong style="font-size:12.8px">${esc(ef.name)}</strong></div>
                  ${quickTickerBtn(ef.ticker)}
                </div>
                <div style="font-size:11.6px;color:var(--ink-200)">${esc(ef.fieldNote)}</div>
              </div>
            `).join('')}

            ${(desks.fieldAndBddk.tenderTracker || []).map((td) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:5px">
                <span class="ms-sig-pill info" style="align-self:flex-start">${esc(td.category)}</span>
                <div style="font-size:11.6px;color:var(--ink-200)">${esc(td.insight)}</div>
                <div class="ae-hscroll" style="padding-bottom:0">
                  ${(td.tickers || []).slice(0, 6).map((tk) => quickTickerBtn(tk)).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <span class="ms-sig-pill good">BDDK Haftalık Banka Karnesi & VİOP Taşıma</span>
          <h3 style="margin:6px 0 6px;font-size:15px;font-weight:800">Bankacılık ROE / PD-DD Matrisi</h3>
          ${desks.fieldAndBddk.viopCarry ? `
            <div class="ms-alert info" style="margin-bottom:8px">
              <strong>${esc(desks.fieldAndBddk.viopCarry.viopArbitrageVerdict)}:</strong> ${esc(desks.fieldAndBddk.viopCarry.viopArbitrageAction)}
            </div>
          ` : ''}
          <div class="ms-list">
            ${desks.fieldAndBddk.bddkBanks.map((b) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:5px">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0">
                  <div style="min-width:0;flex:1"><span class="ms-asset-code">${esc(b.ticker)}</span> <strong style="font-size:13px">${esc(b.name)}</strong></div>
                  ${quickTickerBtn(b.ticker)}
                </div>
                <div style="font-size:11.6px;color:var(--ink-400)">${esc(b.bddkSignal)}</div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
    `;
  }

  function renderCompassTab(host) {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const me = K.getActiveMember();
    const clock = K.getTurkishClock();
    const brief = G.getDailyStreetBriefing();
    const newsFeed = G.getEnrichedLiveNewsFeed() || [];
    const chains = G.getLiveWorldChains() || [];
    const season = G.getMarketSeasonCompass ? G.getMarketSeasonCompass() : null;
    const gp = K.getGlobalLivePulse ? K.getGlobalLivePulse() : null;

    if (compassSubTab === 'BRIEF' && K.markDisclosuresSeen) {
      K.markDisclosuresSeen(newsFeed.map((x) => x.id));
    }

    let bodyHtml = '';

    if (compassSubTab === 'BRIEF') {
      bodyHtml = `
        <section class="ae-hero-card">
          <span class="ms-sig-pill info">Görmüş Geçirmiş Dostun Sokak Özeti</span>
          <h2 style="margin:7px 0 6px;font-size:17px;font-weight:800;line-height:1.32">${esc(brief?.leadHeadline || '')}</h2>
          <p style="margin:0 0 12px;font-size:13.2px;color:var(--ink-200);line-height:1.5">${esc(brief?.friendAdvice || '')}</p>
          <div class="ae-kpi-2x2" style="margin-bottom:0">
            ${(brief?.pulses || []).map((p) => `
              <div class="ms-kpi-box" style="padding:9px 10px">
                <span>${esc(p.label)}</span>
                <strong style="font-size:12.2px;white-space:normal;line-height:1.25" class="${p.tone === 'good' ? 'pos' : (p.tone === 'warn' ? 'warn-txt' : '')}">${esc(p.value)}</strong>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="ae-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px">
            <div>
              <h3 style="margin:0;font-size:15.5px;font-weight:800">Canlı KAP, Resmi Gazete & Gece Bilanço Masası</h3>
              <p style="margin:2px 0 0;font-size:11.8px;color:var(--ink-400)">
                ${clock.bistCanMatchNow ? 'Haberi sokak ve uzman gözüyle yorumla; etkilenen tahtaları anında incele.' : 'Borsa kapalıyken bilançoları ve Resmi Gazete kararlarını okuyup yorumlayan, sabah 09:55 açılışına önde girer!'}
              </p>
            </div>
          </div>

          <div class="ae-hscroll" style="margin-bottom:10px">
            <button type="button" class="ae-chip ${compassNewsFilter === 'ALL' ? 'active' : 'sub'}" data-cnflt="ALL">Tümü (${newsFeed.length})</button>
            <button type="button" class="ae-chip ${compassNewsFilter === 'KAP' ? 'active' : 'sub'}" data-cnflt="KAP">🏛️ KAP & Şirket</button>
            <button type="button" class="ae-chip ${compassNewsFilter === 'RG' ? 'active' : 'sub'}" data-cnflt="RG">📜 Resmi Gazete & Vergi</button>
            <button type="button" class="ae-chip ${compassNewsFilter === 'MACRO' ? 'active' : 'sub'}" data-cnflt="MACRO">🌍 Makro & Merkez</button>
          </div>

          ${(() => {
            const filteredNews = newsFeed.filter((nw) => {
              if (compassNewsFilter === 'ALL') return true;
              const hay = ((nw.badge || '') + ' ' + (nw.source || '') + ' ' + (nw.title || '')).toLocaleUpperCase('tr-TR');
              if (compassNewsFilter === 'KAP') return hay.includes('KAP') || hay.includes('BİLANÇO') || hay.includes('TEMETTÜ') || hay.includes('GERİ ALIM');
              if (compassNewsFilter === 'RG') return hay.includes('RESMİ') || hay.includes('STOPAJ') || hay.includes('VERGİ') || hay.includes('KARAR');
              return !hay.includes('KAP');
            });
            const visibleNews = filteredNews.slice(0, compassNewsVisible);
            return `
              <div class="ms-list">
                ${visibleNews.map((nw) => {
                  const studied = me.studiedDisclosures?.[nw.id];
                  return `
                    <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:7px">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap">
                        <span class="ms-sig-pill ${esc(nw.tone === 'danger' ? 'danger' : (nw.tone === 'good' ? 'good' : (nw.tone === 'warn' ? 'warn' : 'info')))}">${esc(nw.badge)} · ${esc(nw.source)}</span>
                        ${studied ? `<span class="ms-sig-pill good">✓ İncelendi (${esc(studied.stance)})</span>` : ''}
                      </div>
                      <strong style="font-size:13.6px;line-height:1.35">${esc(nw.title)}</strong>
                      <div style="font-size:12px;color:var(--ink-200)">${esc(nw.streetImpact)}</div>
                      ${nw.analystRule ? `<div style="font-size:11.3px;color:var(--cyan);background:var(--surface-1);padding:6px 9px;border-radius:9px">🎯 ${esc(nw.analystRule)}</div>` : ''}

                      <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding-top:2px">
                        ${(nw.linkedKeys || []).slice(0, 4).map((lk) => {
                          const a = K.getAsset(lk);
                          if (!a) return '';
                          return `<button type="button" class="ms-btn sm" data-open-asset="${esc(a.key)}" style="padding:5px 9px;font-size:11.2px">${esc(a.ticker)} · ${a.isRateInstrument ? '%' + a.annualGrossRatePct : fmtUnitTL(a.priceTL)}</button>`;
                        }).join('')}
                      </div>

                      <div style="display:flex;gap:6px;flex-wrap:wrap;padding-top:4px;border-top:1px solid var(--line-subtle)">
                        <span style="font-size:11px;color:var(--ink-500);font-weight:700;align-self:center">Yorumun:</span>
                        <button type="button" class="ms-btn sm ${studied?.stance === 'Pozitif' ? 'buy-cta' : ''}" data-study-news="${esc(nw.id)}" data-stance="Pozitif" data-ntitle="${esc(nw.title)}" style="padding:4px 9px;font-size:11px">📈 Olumlu</button>
                        <button type="button" class="ms-btn sm ${studied?.stance === 'Fiyatlanmış' ? 'primary' : ''}" data-study-news="${esc(nw.id)}" data-stance="Fiyatlanmış" data-ntitle="${esc(nw.title)}" style="padding:4px 9px;font-size:11px">⚖️ Fiyatlanmış</button>
                        <button type="button" class="ms-btn sm ${studied?.stance === 'Tuzak/Risk' ? 'danger' : ''}" data-study-news="${esc(nw.id)}" data-stance="Tuzak/Risk" data-ntitle="${esc(nw.title)}" style="padding:4px 9px;font-size:11px">⚠️ Riskli</button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
              ${filteredNews.length > visibleNews.length ? `
                <button type="button" class="ms-btn sm" style="width:100%;margin-top:10px" id="aeShowMoreNewsBtn">
                  Daha Fazla Haber Göster (${visibleNews.length}/${filteredNews.length})
                </button>
              ` : ''}
            `;
          })()}
        </section>
      `;
    } else if (compassSubTab === 'KITCHEN') {
      bodyHtml = renderKitchenSubDeskHtml();
    } else if (compassSubTab === 'CHAINS') {
      const activeChain = chains.find((c) => c.id === selectedChainId) || chains[0];
      const chainAssets = (activeChain?.assetKeys || []).map((k) => K.getAsset(k)).filter(Boolean);
      const snap = K.evaluateMemberPortfolio(me);
      const whatIf = G.simulateMacroDominoWhatIf
        ? G.simulateMacroDominoWhatIf({ oilDeltaPct: dominoOil, usdDeltaPct: dominoUsd, rateDeltaPts: dominoRate, droughtShock: dominoDrought })
        : null;

      bodyHtml = `
        <!-- İNTERAKTİF "YA OLURSA?" CANLI MAKRO DOMİNO SİMÜLATÖRÜ -->
        ${whatIf ? `
          <section class="ae-hero-card">
            <span class="ms-sig-pill warn">🔗 İnteraktif Mazottan Domatese Domino Simülatörü</span>
            <h2 style="margin:6px 0 4px;font-size:17.5px;font-weight:900">Dünyada Bir Taş Oynarsa Türkiye’de Ne Olur?</h2>
            <p style="margin:0 0 12px;font-size:13px;color:var(--ink-200);line-height:1.45">Aşağıdaki kolları kaydır; petrol, dolar, faiz veya kuraklık değiştiğinde hangi sektörün güçlendiğini ve senin <strong>${fmtTL(snap.totalNetWorthTL)}</strong> kasanın nasıl etkilendiğini canlı gör:</p>

            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>🛢️ Petrol (Mazot) Değişimi</span><strong id="aeDominoOilLbl" class="${dominoOil >= 0 ? 'warn-txt' : 'pos'}">${dominoOil >= 0 ? '+' : ''}%${dominoOil}</strong></div>
              <input type="range" class="ae-slider" id="aeDominoOilSl" min="-40" max="60" step="5" value="${dominoOil}" />
            </div>
            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>💵 Dolar/TL Değişimi</span><strong id="aeDominoUsdLbl" class="${dominoUsd > 0 ? 'warn-txt' : ''}">${dominoUsd >= 0 ? '+' : ''}%${dominoUsd}</strong></div>
              <input type="range" class="ae-slider" id="aeDominoUsdSl" min="-15" max="45" step="5" value="${dominoUsd}" />
            </div>
            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>🏛️ Merkez Bankası Faiz Hamlesi</span><strong id="aeDominoRateLbl" class="${dominoRate < 0 ? 'pos' : (dominoRate > 0 ? 'warn-txt' : '')}">${dominoRate >= 0 ? '+' : ''}${dominoRate} Puan</strong></div>
              <input type="range" class="ae-slider" id="aeDominoRateSl" min="-12" max="12" step="2" value="${dominoRate}" />
            </div>
            <label style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:13px;background:var(--surface-2);border:1px solid ${dominoDrought ? 'rgba(244,63,94,0.45)' : 'var(--line-subtle)'};font-size:13.2px;font-weight:800;cursor:pointer;margin-bottom:12px">
              <span>☀️ Kuraklık & Baraj Düşüşü Şoku Ekle (6 Ay Gecikmeli)</span>
              <input type="checkbox" id="aeDominoDroughtChk" ${dominoDrought ? 'checked' : ''} style="width:20px;height:20px" />
            </label>

            <div id="aeDominoLiveOut">
              <div class="ms-alert info" style="margin:0 0 10px">
                <strong>Dostun Yorumu:</strong> ${esc(whatIf.streetVerdict)}
              </div>

              <div class="ae-kpi-2x2" style="margin-bottom:10px">
                <div class="ms-kpi-box">
                  <span>Mutfak Enflasyonu Etkisi</span>
                  <strong class="${whatIf.kitchenInflationShiftPct > 5 ? 'neg' : 'warn-txt'}">+%${whatIf.kitchenInflationShiftPct}</strong>
                  <small>Pazar & fatura maliyet dalgası</small>
                </div>
                <div class="ms-kpi-box">
                  <span>Senin Kasanın Alım Gücü Etkisi</span>
                  <strong class="${whatIf.realDeltaTL >= 0 ? 'pos' : 'neg'}">${whatIf.realDeltaTL >= 0 ? '+' : ''}${fmtCompactTL(whatIf.realDeltaTL)}</strong>
                  <small>Nominal fark: ${whatIf.portfolioDeltaTL >= 0 ? '+' : ''}${fmtCompactTL(whatIf.portfolioDeltaTL)}</small>
                </div>
              </div>

              <div class="ms-list">
                ${whatIf.sectors.map((sec) => `
                  <div class="ms-list-row" style="padding:10px 12px">
                    <div style="min-width:0;flex:1">
                      <strong style="font-size:13.6px">${esc(sec.icon)} ${esc(sec.name)}</strong>
                      <div style="font-size:12px;color:var(--ink-400);margin-top:2px">${esc(sec.why)}</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:7px;flex-shrink:0">
                      <span class="ms-chg-badge ${sec.pct >= 0 ? 'pos' : 'neg'}">${sec.pct >= 0 ? '+' : ''}%${sec.pct}</span>
                      <button type="button" class="ms-btn sm" data-open-asset="${esc(sec.assetKey)}">Bak</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        ` : ''}

        <!-- DÜNYA SEANSLARI VE HAMMADDE CANLI PANELİ -->
        ${gp ? `
          <section class="ae-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <strong style="font-size:14.2px">Dünya Emtia & Seans Akışı (${esc(clock.globalSessionLabel)})</strong>
            </div>
            <div class="ae-hscroll" style="padding-bottom:2px">
              <div class="ae-ticker-chip"><span class="t-sym">BRENT</span><span class="t-val">${gp.brentUsd.toFixed(2)} $</span><span class="t-chg ${gp.brentChg1D >= 0 ? 'pos' : 'neg'}">${gp.brentChg1D >= 0 ? '+' : ''}%${gp.brentChg1D.toFixed(2)}</span></div>
              <div class="ae-ticker-chip"><span class="t-sym">BAKIR</span><span class="t-val">${gp.copperUsd.toFixed(3)} $</span><span class="t-chg ${gp.copperChg1D >= 0 ? 'pos' : 'neg'}">${gp.copperChg1D >= 0 ? '+' : ''}%${gp.copperChg1D.toFixed(2)}</span></div>
              <div class="ae-ticker-chip"><span class="t-sym">BUĞDAY</span><span class="t-val">${gp.wheatUsd.toFixed(1)} ¢</span><span class="t-chg ${gp.wheatChg1D >= 0 ? 'pos' : 'neg'}">${gp.wheatChg1D >= 0 ? '+' : ''}%${gp.wheatChg1D.toFixed(2)}</span></div>
              <div class="ae-ticker-chip"><span class="t-sym">EUR/USD</span><span class="t-val">${gp.eurUsd.toFixed(3)}</span><span class="t-chg ${gp.eurUsdChg1D >= 0 ? 'pos' : 'neg'}">${gp.eurUsdChg1D >= 0 ? '+' : ''}%${gp.eurUsdChg1D.toFixed(2)}</span></div>
              <div class="ae-ticker-chip"><span class="t-sym">VİOP BAZ</span><span class="t-val">%${gp.viop.basisPct >= 0 ? '+' : ''}${gp.viop.basisPct}</span></div>
            </div>
          </section>
        ` : ''}

        <!-- 10 HAMMADDE -> FABRİKA DOMİNO ZİNCİRİ -->
        <section class="ae-card">
          <h3 style="margin:0 0 4px;font-size:16px;font-weight:800">10 Gerçek Hammadde -> Fabrika -> Kasa Zinciri</h3>
          <p style="margin:0 0 10px;font-size:12.6px;color:var(--ink-400)">Mazottan domatese, kuraklıktan baraja, TSB priminden sigorta kasasına sebep-sonuç hatları:</p>

          <div class="ae-hscroll" id="aeChainScroll" style="margin-bottom:8px">
            ${chains.map((c) => `
              <button type="button" class="ae-chip ${activeChain?.id === c.id ? 'active' : ''}" data-chain="${esc(c.id)}">
                ${esc(c.shortTitle || c.title)}
              </button>
            `).join('')}
          </div>

          ${activeChain ? `
            <div style="background:var(--surface-2);border:1px solid var(--line-subtle);border-radius:14px;padding:13px;margin-bottom:10px">
              <div style="font-size:13.4px;font-weight:800;color:var(--gold-bright);margin-bottom:6px">${esc(activeChain.triggerHeadline)}</div>
              ${activeChain.leadingSource ? `<div style="font-size:12.2px;color:var(--cyan);font-weight:700;margin-bottom:4px">🔍 Öncü Resmi Veri: ${esc(activeChain.leadingSource)}</div>` : ''}
              ${activeChain.delayNote ? `<div style="font-size:12px;color:var(--ink-400);margin-bottom:8px">⏳ Aktarım Süresi: ${esc(activeChain.delayNote)}</div>` : ''}
              <div style="display:grid;gap:6px;margin-bottom:8px">
                <div style="background:var(--surface-1);padding:9px 11px;border-radius:10px;font-size:12.8px"><span style="color:var(--cyan);font-weight:800">1. ÖNCÜ TETİK:</span> <strong>${esc(activeChain.step1)}</strong></div>
                <div style="background:var(--surface-1);padding:9px 11px;border-radius:10px;font-size:12.8px"><span style="color:var(--gold-bright);font-weight:800">2. AKTARIM KANALI:</span> <strong>${esc(activeChain.step2)}</strong></div>
                <div style="background:var(--surface-1);padding:9px 11px;border-radius:10px;font-size:12.8px"><span style="color:var(--green-ink);font-weight:800">3. KASASI ETKİLENEN:</span> <strong>${esc(activeChain.step3)}</strong></div>
              </div>
              <div style="font-size:13px;color:var(--ink-200);line-height:1.48">${esc(activeChain.insight)}</div>
            </div>
            ${buildMarketAssetListHtml(chainAssets, snap)}
          ` : ''}
        </section>

        <!-- 4 MEVSİM EKONOMİ VE DÖNGÜ PUSULASI -->
        ${season ? `
          <section class="ae-card">
            <span class="ms-sig-pill warn">Kıştan Önce Odun Stoklayan Köylü Bakışı</span>
            <h3 style="margin:6px 0 4px;font-size:16px;font-weight:800">${esc(season.currentTitle)}</h3>
            <p style="margin:0 0 10px;font-size:13px;color:var(--ink-200);line-height:1.5">${esc(season.villagerWisdom)}</p>

            <div class="ae-kpi-2x2" style="margin-bottom:10px">
              ${season.wheel.map((w) => `
                <div class="ms-kpi-box" style="padding:10px 11px;border-color:${w.code === season.activePhase ? 'var(--gold)' : 'var(--line-subtle)'};background:${w.code === season.activePhase ? 'var(--gold-soft)' : 'var(--surface-2)'}">
                  <strong style="font-size:13px;white-space:normal;line-height:1.25">${w.code === season.activePhase ? '● ' : ''}${esc(w.name)}</strong>
                  <small>${esc(w.sub)}</small>
                </div>
              `).join('')}
            </div>

            <div style="font-size:12.6px;font-weight:700;color:var(--ink-400);margin-bottom:6px">Gelecek Mevsimin Tohum Adayları:</div>
            <div class="ae-hscroll">
              ${season.nextSeedKeys.map((k) => {
                const a = K.getAsset(k);
                return a ? `<button type="button" class="ae-chip sub" data-open-asset="${esc(a.key)}">🌱 ${esc(a.ticker)} · ${a.isRateInstrument ? '%' + a.annualGrossRatePct : fmtUnitTL(a.priceTL)}</button>` : '';
              }).join('')}
            </div>
          </section>
        ` : ''}
      `;
    } else if (compassSubTab === 'CRISIS') {
      const scenarios = G.CRISIS_SCENARIOS.filter((s) => s.id !== 'NONE');
      const crisisSim = G.simulatePortfolioCrisis(selectedCrisisId === 'NONE' ? 'STRAIT_BLOCKADE' : selectedCrisisId);
      const snap = K.evaluateMemberPortfolio(me);

      bodyHtml = `
        <section class="ae-hero-card">
          <span class="ms-sig-pill danger">9 Gerçek Fırtına & Stres Laboratuvarı</span>
          <h2 style="margin:6px 0 4px;font-size:16.5px;font-weight:800">Ortalık Aniden Karıştığında Kim Soğukkanlı?</h2>
          <p style="margin:0 0 10px;font-size:12.2px;color:var(--ink-200)">Bir şok seç; mevcut <strong>${fmtTL(snap.totalNetWorthTL)}</strong> portföyünün hem TL karşılığını hem de gerçek alım gücünü anında sına.</p>

          <div class="ae-hscroll" id="aeCrisisScroll">
            ${scenarios.map((sc) => `
              <button type="button" class="ae-chip ${(selectedCrisisId || 'STRAIT_BLOCKADE') === sc.id ? 'active' : ''}" data-crisis="${esc(sc.id)}">
                ⚡ ${esc(sc.shortTitle || sc.title)}
              </button>
            `).join('')}
          </div>
        </section>

        ${crisisSim ? `
          <section class="ae-card">
            <h3 style="margin:0 0 5px;font-size:15px;font-weight:800">${esc(crisisSim.scenario.title)}</h3>
            <p style="margin:0 0 12px;font-size:12.2px;color:var(--ink-400)">${esc(crisisSim.scenario.desc)}</p>

            <div class="ae-kpi-2x2">
              <div class="ms-kpi-box">
                <span>Şok Sonrası Nominal Değer</span>
                <strong class="${crisisSim.totalDeltaTL >= 0 ? 'pos' : 'neg'}">${fmtTL(crisisSim.postNetWorthTL)}</strong>
                <small class="${crisisSim.totalDeltaTL >= 0 ? 'pos' : 'neg'}">${crisisSim.totalDeltaTL >= 0 ? '+' : ''}${fmtTL(crisisSim.totalDeltaTL)} (${crisisSim.totalDeltaPct >= 0 ? '+' : ''}%${crisisSim.totalDeltaPct})</small>
              </div>
              <div class="ms-kpi-box">
                <span>Gerçek Alım Gücü Etkisi</span>
                <strong class="${crisisSim.realPurchasingDeltaTL >= 0 ? 'pos' : 'neg'}">${crisisSim.realPurchasingDeltaTL >= 0 ? '+' : ''}${fmtTL(crisisSim.realPurchasingDeltaTL)}</strong>
                <small>${crisisSim.infShockPct > 0 ? `Mutfak/Kur şoku +${crisisSim.infShockPct}% dahil` : 'Reel satın alma karşılığı'}</small>
              </div>
            </div>

            ${crisisSim.marginWiped ? `
              <div class="ms-alert err">
                🚨 <strong>SAAT 15:00 MARGIN CALL TASFİYESİ:</strong> Kredili borcun yüzünden özsermaye teminatın %35'in altına çöküyor; aracı kurum hisselerini en dipten zorla satar!
              </div>
            ` : ''}

            ${snap.largestSingleSharePct >= 65 ? `
              <div class="ms-alert warn">
                🥚 <strong>Tek Sepet Uyarısı:</strong> Portföyünün %${snap.largestSingleSharePct} kadarı tek varlıkta toplandığı için bu fırtınada dalgalanma doğrudan kalbine vuruyor.
              </div>
            ` : ''}

            ${crisisSim.masterPlaybook ? `
              <div class="ms-alert ok">
                🧭 ${esc(crisisSim.masterPlaybook)}
              </div>
            ` : ''}

            ${(crisisSim.fireSaleKeys || []).length > 0 ? `
              <div style="margin:8px 0 10px">
                <span style="display:block;font-size:11.4px;font-weight:800;color:var(--gold-bright);margin-bottom:5px">🔥 Bu Fırtınada Kalabalık Kaçarken İzlenecek Kaleler:</span>
                <div class="ae-hscroll" style="padding-bottom:0">
                  ${crisisSim.fireSaleKeys.map((fk) => {
                    const fa = K.getAsset(fk);
                    return fa ? `<button type="button" class="ae-chip sub" data-open-asset="${esc(fa.key)}">${esc(fa.ticker)} · ${fa.isRateInstrument ? '%' + fa.annualGrossRatePct : fmtUnitTL(fa.priceTL)}</button>` : '';
                  }).join('')}
                </div>
              </div>
            ` : ''}

            <div style="font-size:12.4px;font-weight:800;margin:10px 0 6px">Varlık Bazlı Şok Dalgası:</div>
            ${crisisSim.itemImpacts.length > 0 ? `
              <div class="ms-list">
                ${crisisSim.itemImpacts.map((it) => `
                  <div class="ms-list-row" style="padding:9px 12px">
                    <strong>${esc(it.name)}</strong>
                    <strong class="${it.deltaTL >= 0 ? 'pos' : 'neg'}">${it.deltaTL >= 0 ? '+' : ''}${fmtTL(it.deltaTL)} (${it.pct >= 0 ? '+' : ''}%${it.pct})</strong>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="ms-alert info">
                Henüz yatırım pozisyonu açmadığın için tahta fiyatı oynamadı; ancak ${crisisSim.infShockPct > 0 ? `kur/gıda şokunda boş TL nakdinin gerçek alım gücü <strong>${fmtTL(crisisSim.realPurchasingDeltaTL)}</strong> eridi!` : '1.000.000 ₺ nakitte bekliyor.'}
              </div>
            `}
          </section>
        ` : ''}
      `;
    } else {
      // KITCHEN_CAL: Mutfak İstihbaratı + Canlı Türkiye Piyasa Saatleri & Takvimi
      const viop = K.getViopEveningSignal();
      bodyHtml = `
        <section class="ae-card">
          <h3 style="margin:0 0 6px;font-size:16px;font-weight:900">⏰ Canlı Türkiye & Dünya Piyasa Saatleri</h3>
          <p style="margin:0 0 10px;font-size:12.8px;color:var(--ink-400)">İleri sarma yok; gerçek saat dilimi, BIST -%6 EBDKS ve resmi takvim kuralları birebir işler.</p>
          <div class="ms-list">
            <div class="ms-list-row">
              <div><strong>Borsa İstanbul Pay Pazarı</strong><div style="font-size:12.2px;color:var(--ink-400)">09:55 Eşleşme · 10:00–18:00 Seans · 18:05 Eşleşme / 18:10 Kapanış (Arife 12:40) · EBDKS -%6</div></div>
              <span class="ms-sig-pill ${clock.bistCanMatchNow ? 'good' : 'warn'}">${clock.bistCanMatchNow ? 'Açık' : 'Kapalı'}</span>
            </div>
            <div class="ms-list-row">
              <div><strong>VİOP & 19:00 Akşam Seansı</strong><div style="font-size:12.2px;color:var(--ink-400)">XU030 Vadeli-Spot Makası: %${viop.basisPct >= 0 ? '+' : ''}${viop.basisPct} · 15:00 Margin Call</div></div>
              <span class="ms-sig-pill ${clock.viopOpen ? 'good' : 'neutral'}">${clock.viopEvening ? 'Akşam Açık' : (clock.viopOpen ? 'Gündüz Açık' : 'Kapalı')}</span>
            </div>
            <div class="ms-list-row">
              <div><strong>TEFAS Fon Valör Gişesi (13:30 Sınırı)</strong><div style="font-size:12.2px;color:var(--ink-400)">${esc(clock.tefasLabel)}</div></div>
              <span class="ms-sig-pill ${clock.tefasBeforeCutoff ? 'good' : 'warn'}">${clock.tefasBeforeCutoff ? '13:30 Öncesi' : '+1 İş Günü'}</span>
            </div>
            <div class="ms-list-row">
              <div><strong>Kapalıçarşı / Nöbetçi / Mobil Banka</strong><div style="font-size:12.2px;color:var(--ink-400)">Çarşı %${clock.bazaarSpreadPct.toFixed(2)} · Nöbetçi %${clock.nobetciSpreadPct.toFixed(2)} · Banka %${clock.bankSpreadPct.toFixed(2)} (+%0,2 BSMV)</div></div>
              <span class="ms-sig-pill ${clock.grandBazaarOpen ? 'good' : 'info'}">${clock.grandBazaarOpen ? 'Çarşı Açık' : (clock.nobetciOpen ? 'Nöbetçi Açık' : 'Gece Makası')}</span>
            </div>
            <div class="ms-list-row">
              <div><strong>Resmi Veri & Maaş Takvimi</strong><div style="font-size:12.2px;color:var(--ink-400)">Ayın 3'ü 10:00 TÜİK TÜFE · Perşembe 14:00 TCMB & BDDK/POS · Ayın 1'i / 15'i Maaş</div></div>
              <span class="ms-sig-pill info">Canlı Takvim</span>
            </div>
          </div>
        </section>

        ${renderKitchenSubDeskHtml()}
        ${renderIpoAndDividendDeskHtml()}
      `;
    }

    const activeCompassSeg = (compassSubTab === 'KITCHEN' || compassSubTab === 'CALENDAR') ? 'KITCHEN_CAL' : compassSubTab;

    host.innerHTML = `
      <div class="ae-seg" role="tablist">
        <button type="button" class="ae-seg-btn ${activeCompassSeg === 'BRIEF' ? 'active' : ''}" data-csub="BRIEF">📰 Gündem</button>
        <button type="button" class="ae-seg-btn ${activeCompassSeg === 'CHAINS' ? 'active' : ''}" data-csub="CHAINS">🔗 Domino</button>
        <button type="button" class="ae-seg-btn ${activeCompassSeg === 'CRISIS' ? 'active' : ''}" data-csub="CRISIS">🌪️ Fırtına</button>
        <button type="button" class="ae-seg-btn ${activeCompassSeg === 'KITCHEN_CAL' ? 'active' : ''}" data-csub="KITCHEN_CAL">🧮 Mutfak</button>
      </div>
      ${bodyHtml}
    `;

    const updateDominoLiveDom = () => {
      if (!G.simulateMacroDominoWhatIf) return;
      const wi = G.simulateMacroDominoWhatIf({ oilDeltaPct: dominoOil, usdDeltaPct: dominoUsd, rateDeltaPts: dominoRate, droughtShock: dominoDrought });
      if (!wi) return;
      const oLbl = document.getElementById('aeDominoOilLbl');
      const uLbl = document.getElementById('aeDominoUsdLbl');
      const rLbl = document.getElementById('aeDominoRateLbl');
      if (oLbl) { oLbl.textContent = `${dominoOil >= 0 ? '+' : ''}%${dominoOil}`; oLbl.className = dominoOil >= 0 ? 'warn-txt' : 'pos'; }
      if (uLbl) { uLbl.textContent = `${dominoUsd >= 0 ? '+' : ''}%${dominoUsd}`; uLbl.className = dominoUsd > 0 ? 'warn-txt' : ''; }
      if (rLbl) { rLbl.textContent = `${dominoRate >= 0 ? '+' : ''}${dominoRate} Puan`; rLbl.className = dominoRate < 0 ? 'pos' : (dominoRate > 0 ? 'warn-txt' : ''); }
      const out = document.getElementById('aeDominoLiveOut');
      if (out) {
        out.innerHTML = `
          <div class="ms-alert info" style="margin:0 0 10px">
            <strong>Dostun Yorumu:</strong> ${esc(wi.streetVerdict)}
          </div>
          <div class="ae-kpi-2x2" style="margin-bottom:10px">
            <div class="ms-kpi-box">
              <span>Mutfak Enflasyonu Etkisi</span>
              <strong class="${wi.kitchenInflationShiftPct > 5 ? 'neg' : 'warn-txt'}">+%${wi.kitchenInflationShiftPct}</strong>
              <small>Pazar & fatura maliyet dalgası</small>
            </div>
            <div class="ms-kpi-box">
              <span>Senin Kasanın Alım Gücü Etkisi</span>
              <strong class="${wi.realDeltaTL >= 0 ? 'pos' : 'neg'}">${wi.realDeltaTL >= 0 ? '+' : ''}${fmtCompactTL(wi.realDeltaTL)}</strong>
              <small>Nominal fark: ${wi.portfolioDeltaTL >= 0 ? '+' : ''}${fmtCompactTL(wi.portfolioDeltaTL)}</small>
            </div>
          </div>
          <div class="ms-list">
            ${wi.sectors.map((sec) => `
              <div class="ms-list-row" style="padding:10px 12px">
                <div style="min-width:0;flex:1">
                  <strong style="font-size:13.6px">${esc(sec.icon)} ${esc(sec.name)}</strong>
                  <div style="font-size:12px;color:var(--ink-400);margin-top:2px">${esc(sec.why)}</div>
                </div>
                <div style="display:flex;align-items:center;gap:7px;flex-shrink:0">
                  <span class="ms-chg-badge ${sec.pct >= 0 ? 'pos' : 'neg'}">${sec.pct >= 0 ? '+' : ''}%${sec.pct}</span>
                  <button type="button" class="ms-btn sm" data-open-asset="${esc(sec.assetKey)}">Bak</button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        bindAssetListClicks(out);
      }
    };
    document.getElementById('aeDominoOilSl')?.addEventListener('input', (e) => {
      dominoOil = Number(e.target.value) || 0;
      updateDominoLiveDom();
    });
    document.getElementById('aeDominoUsdSl')?.addEventListener('input', (e) => {
      dominoUsd = Number(e.target.value) || 0;
      updateDominoLiveDom();
    });
    document.getElementById('aeDominoRateSl')?.addEventListener('input', (e) => {
      dominoRate = Number(e.target.value) || 0;
      updateDominoLiveDom();
    });
    document.getElementById('aeDominoDroughtChk')?.addEventListener('change', (e) => {
      AetherNative.haptic('medium');
      dominoDrought = Boolean(e.target.checked);
      updateDominoLiveDom();
    });

    host.querySelectorAll('[data-csub]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        compassSubTab = b.getAttribute('data-csub');
        renderHeader();
        renderCompassTab(host);
      });
    });

    host.querySelectorAll('[data-kdesk]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        kitchenDeskId = b.getAttribute('data-kdesk') || 'BREAKEVEN';
        renderCompassTab(host);
      });
    });

    host.querySelectorAll('[data-bamt]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        calcAmountTL = Number(b.getAttribute('data-bamt')) || 250000;
        renderCompassTab(host);
      });
    });

    host.querySelectorAll('[data-bdays]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        calcDays = Number(b.getAttribute('data-bdays')) || 32;
        renderCompassTab(host);
      });
    });

    host.querySelectorAll('[data-cnflt]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        compassNewsFilter = b.getAttribute('data-cnflt') || 'ALL';
        compassNewsVisible = 5;
        renderCompassTab(host);
      });
    });
    document.getElementById('aeShowMoreNewsBtn')?.addEventListener('click', () => {
      AetherNative.haptic('selection');
      compassNewsVisible += 8;
      renderCompassTab(host);
    });

    host.querySelectorAll('[data-study-news]').forEach((b) => {
      b.addEventListener('click', () => {
        const nid = b.getAttribute('data-study-news');
        const stance = b.getAttribute('data-stance');
        const title = b.getAttribute('data-ntitle');
        const res = K.markDisclosureStudied(nid, stance, title);
        AetherNative.haptic('success');
        AetherNative.toast(res.preOpen ? 'Gece bilanço/KAP notun kaydedildi — sabah açılışına hazırlıklısın!' : 'Haber analizin ustalık karnene işlendi.', 'ok');
        renderHeader();
        renderCompassTab(host);
      });
    });

    host.querySelectorAll('[data-chain]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        selectedChainId = b.getAttribute('data-chain');
        renderCompassTab(host);
      });
    });

    host.querySelectorAll('[data-crisis]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('medium');
        selectedCrisisId = b.getAttribute('data-crisis');
        renderCompassTab(host);
      });
    });

    host.querySelectorAll('[data-join-ipo]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ipoId = btn.getAttribute('data-join-ipo');
        const inp = document.getElementById('msIpoLots_' + ipoId);
        const lots = Number(inp?.value || 100);
        const res = K.participateInIpo(ipoId, lots);
        AetherNative.haptic(res.ok ? 'success' : 'error');
        lastIpoFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
        renderHeader();
        renderCompassTab(host);
      });
    });

    bindAssetListClicks(host);
  }

  // --------------------------------------------------------------------------
  // 6. SEKME 3: CÜZDAN (1.000.000 ₺ KOKPİT, NAKİT ÇARKI, KUM SAATİ & DEFTER)
  // --------------------------------------------------------------------------
  function renderWalletTab(host) {
    const K = global.AetherKernelV10;
    const member = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(member);
    const repoNetAnnual = K.getOvernightRepoNetAnnualPct();
    const dailyPassive = Math.round(snap.monthlyPassiveIncomeTL / 30);
    const freedomPct = Math.min(100, Math.round(snap.passiveCoveragePct));

    const queueCount = (member.settlementQueue || []).length + (member.pendingOrders || []).length + (member.ipoRequests || []).length;

    let subHtml = '';
    if (walletSubTab === 'HOLDINGS') {
      subHtml = `
        <section class="ae-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <strong style="font-size:14.5px">Açık Pozisyonlar & Vadeli Dilimler</strong>
            <button type="button" class="ms-btn sm" id="aeGoMarketFromWallet">+ Yatırım Ekle</button>
          </div>

          <div class="ms-list">
            ${snap.tranches.map((tr) => {
              const early = tr.isTermDeposit && !tr.isMatured;
              return `
                <div class="ms-list-row">
                  <div style="min-width:0;flex:1">
                    <strong>${esc(tr.name)}</strong>
                    <div style="font-size:11.8px;color:var(--ink-400)">
                      Anapara: ${fmtTL(tr.principalTL)} · Biriken Net: <strong class="pos">+${fmtTL(tr.netInterestTL)}</strong> (+${fmtTL(tr.monthlyNetDripTL)}/ay)
                      ${early ? ` · <strong>${tr.remainingDays} gün kaldı</strong>` : ''}
                    </div>
                  </div>
                  <button type="button" class="ms-btn ${early ? 'danger' : ''} sm" data-break-tr="${esc(tr.id)}">
                    ${early ? `Erken Boz (-${fmtCompactTL(tr.forfeitedIfBrokenEarlyTL)})` : 'Nakde Çevir'}
                  </button>
                </div>
              `;
            }).join('')}

            ${snap.spotItems.map((it) => {
              const aObj = K.getAsset(it.assetKey);
              const qSig = aObj ? global.RealInvestmentGuide?.getCardQuickSignal(aObj) : null;
              return `
              <div class="ms-list-row">
                <div style="min-width:0;flex:1;cursor:pointer" data-open-pos="${esc(it.assetKey)}">
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                    <span class="ms-asset-code">${esc(it.ticker)}</span>
                    <strong style="font-size:13.8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(it.name)}</strong>
                    ${qSig?.badge ? `<span class="ms-sig-pill ${esc(qSig.tone || 'neutral')}">${esc(qSig.badge)}</span>` : ''}
                  </div>
                  <div style="font-size:11.8px;color:var(--ink-400);margin-top:2px">
                    ${it.qty} adet · Maliyet ${fmtUnitTL(it.avgCostTL)} · Değer: <strong style="color:var(--ink-100)">${fmtTL(it.netValTL)}</strong>
                  </div>
                  <div style="font-size:12px;font-weight:800" class="${it.pnlNetTL >= 0 ? 'pos' : 'neg'}">
                    ${it.pnlNetTL >= 0 ? '+' : ''}${fmtTL(it.pnlNetTL)} (${it.pnlNetPct >= 0 ? '+' : ''}%${it.pnlNetPct})
                  </div>
                  ${it.thesisNote ? `<div style="font-size:11.2px;color:var(--cyan);margin-top:2px">Tez: "${esc(it.thesisNote)}"</div>` : ''}
                </div>
                <div style="display:flex;gap:5px">
                  <button type="button" class="ms-btn sm" data-open-pos="${esc(it.assetKey)}" data-pos-side="BUY">Al</button>
                  <button type="button" class="ms-btn danger sm" data-open-pos="${esc(it.assetKey)}" data-pos-side="SELL">Sat</button>
                </div>
              </div>
              `;
            }).join('')}

            ${(member.pendingOrders || []).map((o) => `
              <div class="ms-list-row" style="border-color:rgba(56,189,248,0.32)">
                <div style="min-width:0;flex:1">
                  <span class="ms-sig-pill info">🕒 Sırada Bekleyen Emir · ${esc(fmtCountdown(o.executesAtMs))}</span>
                  <div style="font-size:13px;font-weight:800;margin-top:3px">${esc(o.name)} (${o.side === 'BUY' ? fmtTL(o.reservedTL) : o.qty + ' adet satım'})</div>
                  <div style="font-size:11.4px;color:var(--ink-400)">${esc(o.note)}</div>
                </div>
                <button type="button" class="ms-btn danger sm" data-cancel-ord="${esc(o.id)}">İptal</button>
              </div>
            `).join('')}

            ${snap.tranches.length === 0 && snap.spotItems.length === 0 && (member.pendingOrders || []).length === 0 ? `
              <div style="padding:18px 8px;text-align:center;font-size:13px;color:var(--ink-400)">
                Portföyünde henüz açık varlık yok; <strong>${fmtTL(snap.cashTL)}</strong> boş nakitte duruyor.
              </div>
            ` : ''}
          </div>
        </section>
      `;
    } else if (walletSubTab === 'QUEUES') {
      subHtml = `
        <section class="ae-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px">
            <div>
              <strong style="font-size:14.2px">Boş Nakit & Gecelik Otomatik Nema</strong>
              <div style="font-size:11.6px;color:var(--ink-400)">
                ${snap.autoOvernightRepo
                  ? `Açık: 10B ₺ üstü nakit gecelik net %${repoNetAnnual} çalışıyor${snap.overnightRepoEarnedTL > 0 ? ` (+${fmtTL(snap.overnightRepoEarnedTL)} kazanıldı)` : ''}`
                  : `Kapalı: Boş nakit %0 vadesiz bekliyor (Açarsan yıllık net %${repoNetAnnual} işler)`}
              </div>
            </div>
            <button type="button" class="ms-btn ${snap.autoOvernightRepo ? '' : 'primary'} sm" id="msToggleRepoBtn">
              ${snap.autoOvernightRepo ? 'Nemayı Kapat' : 'Nemayı Aç'}
            </button>
          </div>

          <div class="ae-kpi-2x2">
            <div class="ms-kpi-box"><span>Çekilebilir Nakit</span><strong>${fmtTL(snap.cashTL)}</strong></div>
            <div class="ms-kpi-box"><span>T+2 Takas Blokesi</span><strong>${fmtTL(snap.unsettledTL)}</strong></div>
            <div class="ms-kpi-box"><span>Valör / Bekleyen Emir</span><strong>${fmtTL(snap.pendingOrderTL)}</strong></div>
            <div class="ms-kpi-box"><span>Halka Arz Blokesi</span><strong>${fmtTL(snap.ipoBlockedTL)}</strong></div>
          </div>

          <div class="ms-list">
            ${(member.conditionalOrders || []).map((co) => {
              const aObj = K.getAsset(co.assetKey);
              const liveP = aObj?.priceTL || 0;
              const diffPct = liveP > 0 ? +(((co.triggerPriceTL / liveP) - 1) * 100).toFixed(1) : 0;
              const kindLbl = co.kind === 'LIMIT_BUY' ? '🎯 Limit Alım' : (co.kind === 'STOP_LOSS' ? '🛡️ Zarar Kes' : '🎯 Kâr Al');
              const pillCls = co.kind === 'STOP_LOSS' ? 'danger' : (co.kind === 'TAKE_PROFIT' ? 'good' : 'info');
              return `
                <div class="ms-list-row" style="border-color:rgba(240,180,41,0.38)">
                  <div style="min-width:0;flex:1">
                    <span class="ms-sig-pill ${pillCls}">${kindLbl} · Hedef ${fmtUnitTL(co.triggerPriceTL)} (${diffPct >= 0 ? '+' : ''}%${diffPct})</span>
                    <div style="font-size:14px;font-weight:800;margin-top:4px">${esc(co.ticker)} — ${co.kind === 'LIMIT_BUY' ? fmtTL(co.reservedTL) : co.qty + ' adet'}</div>
                    <div style="font-size:12px;color:var(--ink-400)">Güncel: ${fmtUnitTL(liveP)} · Fiyat hedefe ulaşınca otomatik işler.</div>
                  </div>
                  <button type="button" class="ms-btn danger sm" data-cancel-cond="${esc(co.id)}">İptal Et</button>
                </div>
              `;
            }).join('')}

            ${(member.settlementQueue || []).map((q) => `
              <div class="ms-list-row">
                <div>
                  <span class="ms-sig-pill warn">⏳ Takas / Valör Kum Saati · ${esc(fmtCountdown(q.settlesAtMs))}</span>
                  <div style="font-size:13px;font-weight:800;margin-top:4px">${esc(q.ticker || q.name)} — ${fmtTL(q.grossTL)}</div>
                  <div style="font-size:11.6px;color:var(--ink-400)">${esc(q.note)}</div>
                </div>
              </div>
            `).join('')}

            ${(member.pendingOrders || []).map((o) => `
              <div class="ms-list-row">
                <div style="min-width:0;flex:1">
                  <span class="ms-sig-pill info">🕒 Bekleyen Emir · ${esc(fmtCountdown(o.executesAtMs))}</span>
                  <div style="font-size:13px;font-weight:800;margin-top:4px">${esc(o.name)} (${o.side === 'BUY' ? fmtTL(o.reservedTL) : o.qty + ' adet satım'})</div>
                  <div style="font-size:11.6px;color:var(--ink-400)">${esc(o.note)}</div>
                </div>
                <button type="button" class="ms-btn danger sm" data-cancel-ord="${esc(o.id)}">İptal Et</button>
              </div>
            `).join('')}

            ${(member.ipoRequests || []).map((r) => `
              <div class="ms-list-row">
                <div>
                  <span class="ms-sig-pill info">🏛️ SPK Halka Arz Talebi · ${esc(fmtCountdown(r.allocatesAtMs))}</span>
                  <div style="font-size:13px;font-weight:800;margin-top:4px">${esc(r.ticker)} — ${r.requestedLots} Lot Talep (${fmtTL(r.blockedCashTL)} bloke)</div>
                </div>
              </div>
            `).join('')}

            ${queueCount === 0 ? `
              <div style="font-size:12.5px;color:var(--ink-400);text-align:center;padding:12px">Şu an T+2 takasta veya valör kuyruğunda bekleyen işlemin yok.</div>
            ` : ''}
          </div>
        </section>
      `;
    } else {
      subHtml = `
        <section class="ae-card">
          <strong style="display:block;font-size:14.5px;margin-bottom:8px">Gerçekleşen Emir & Temettü Defteri</strong>
          <div class="ms-list">
            ${(member.tradeHistory || []).length > 0 ? member.tradeHistory.slice(0, 30).map((th) => `
              <div class="ms-list-row">
                <div style="min-width:0;flex:1">
                  <div style="display:flex;align-items:center;gap:6px;min-width:0">
                    <span class="ms-sig-pill ${th.side.includes('SATIŞ') || th.side.includes('BOZUM') ? 'warn' : 'good'}" style="flex-shrink:0">${esc(th.side)}</span>
                    <strong style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0">${esc(th.name)}</strong>
                  </div>
                  <div style="font-size:11.6px;color:var(--ink-400);margin-top:3px">${esc(th.note || '')}</div>
                  ${th.thesisNote ? `<div style="font-size:11.2px;color:var(--cyan)">Not: "${esc(th.thesisNote)}"</div>` : ''}
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <strong style="font-size:13.2px;display:block">${fmtTL(th.amountTL)}</strong>
                  <small style="font-size:10.8px;color:var(--ink-500)">${esc(fmtAgo(th.ts))}</small>
                </div>
              </div>
            `).join('') : `
              <div style="font-size:12.5px;color:var(--ink-400);text-align:center;padding:14px">Henüz işlem kaydı yok.</div>
            `}
          </div>
        </section>
      `;
    }

    host.innerHTML = `
      ${lastPortfolioFeedback ? `<div class="ms-alert ${lastPortfolioFeedback.ok ? 'ok' : 'err'}">${esc(lastPortfolioFeedback.text)}</div>` : ''}

      <!-- HERO PORTFÖY KARTI + CANLI DEĞER EĞRİSİ -->
      <section class="ae-hero-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <div>
            <span style="font-size:11px;font-weight:800;color:var(--ink-400);text-transform:uppercase;letter-spacing:0.4px">Net Portföy Değerim</span>
            <div style="font-size:27px;font-weight:900;letter-spacing:-0.6px;line-height:1.12;margin-top:2px">${fmtTL(snap.totalNetWorthTL)}</div>
          </div>
          <div style="text-align:right">
            <span class="ms-sig-pill ${snap.nominalPnlTL >= 0 ? 'good' : 'danger'}" style="font-size:12px;padding:4px 9px">
              ${snap.nominalPnlTL >= 0 ? '+' : ''}${fmtTL(snap.nominalPnlTL)} (${snap.nominalPnlPct >= 0 ? '+' : ''}%${snap.nominalPnlPct})
            </span>
            <div style="font-size:11px;font-weight:700;margin-top:4px" class="${snap.realPurchasingPnlPct >= 0 ? 'pos' : 'neg'}">
              Reel Alım Gücü: ${snap.realPurchasingPnlPct >= 0 ? '+' : ''}%${snap.realPurchasingPnlPct}
            </div>
          </div>
        </div>

        ${renderPortfolioEquityChartSvg(member, snap)}
        ${renderAllocRibbonHtml(snap.allocationBreakdown)}

        <!-- PASİF NAKİT NEHRİ & ÖZGÜRLÜK ÇARKI -->
        <div style="margin-top:11px;padding-top:10px;border-top:1px solid var(--line-subtle)">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-bottom:4px">
            <span style="font-weight:700;color:var(--ink-200)">💧 Kendi Nakit Çarkın: <strong class="pos">+${fmtTL(snap.monthlyPassiveIncomeTL)}/ay</strong> (~+${dailyPassive.toLocaleString('tr-TR')} ₺/gün)</span>
            <strong style="color:var(--gold-bright)">Özgürlük %${snap.passiveCoveragePct}</strong>
          </div>
          <div class="ms-bar-track" style="height:7px">
            <div class="ms-bar-fill green" style="width:${freedomPct}%"></div>
          </div>
        </div>
      </section>

      ${snap.marginStatus ? `
        <div class="ms-alert ${snap.marginStatus.isWarning ? 'err' : 'warn'}" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div>
            <strong>⚠️ Kredili Borç Yükü: -${fmtTL(snap.marginStatus.debtTL)}</strong> · Özsermaye: %${snap.marginStatus.equityRatioPct} · Günlük Faiz: <strong class="neg">-${fmtUnitTL(snap.marginStatus.dailyInterestCostTL)}/gün</strong>
          </div>
          ${snap.cashTL >= 100 ? `<button type="button" class="ms-btn danger sm" id="msRepayMarginBtn">Borç Kapat</button>` : ''}
        </div>
      ` : ''}

      ${snap.gvk80TaxPayableTL > 0 ? `
        <div class="ms-alert warn" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div>
            <strong>GVK Mük. 80 Yurt Dışı Vergi Karşılığı: -${fmtTL(snap.gvk80TaxPayableTL)}</strong> (Yİ-ÜFE endeksli reel kazanç vergisi)
          </div>
          ${snap.cashTL >= 100 ? `<button type="button" class="ms-btn sm" id="msPayGvkTaxBtn">Nakitle Öde</button>` : ''}
        </div>
      ` : ''}

      <div class="ae-seg" role="tablist">
        <button type="button" class="ae-seg-btn ${walletSubTab === 'HOLDINGS' ? 'active' : ''}" data-wsub="HOLDINGS">Varlıklar (${snap.spotItems.length + snap.tranches.length})</button>
        <button type="button" class="ae-seg-btn ${walletSubTab === 'QUEUES' ? 'active' : ''}" data-wsub="QUEUES">Kum Saati${queueCount > 0 ? ` (${queueCount})` : ''}</button>
        <button type="button" class="ae-seg-btn ${walletSubTab === 'LEDGER' ? 'active' : ''}" data-wsub="LEDGER">Defter</button>
      </div>

      ${subHtml}
    `;

    host.querySelectorAll('[data-wsub]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        walletSubTab = b.getAttribute('data-wsub');
        renderWalletTab(host);
      });
    });

    document.getElementById('aeGoMarketFromWallet')?.addEventListener('click', () => switchTab('market'));

    document.getElementById('msRepayMarginBtn')?.addEventListener('click', () => {
      const res = K.executeOrder({ side: 'REPAY_MARGIN' });
      AetherNative.haptic(res.ok ? 'success' : 'error');
      lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
      renderHeader();
      renderWalletTab(host);
    });

    document.getElementById('msPayGvkTaxBtn')?.addEventListener('click', () => {
      const res = K.executeOrder({ side: 'PAY_GVK80_TAX' });
      AetherNative.haptic(res.ok ? 'success' : 'error');
      lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
      renderHeader();
      renderWalletTab(host);
    });

    document.getElementById('msToggleRepoBtn')?.addEventListener('click', () => {
      const res = K.executeOrder({ side: 'TOGGLE_OVERNIGHT_REPO' });
      AetherNative.haptic('selection');
      lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
      renderHeader();
      renderWalletTab(host);
    });

    host.querySelectorAll('[data-cancel-ord]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'CANCEL_ORDER', orderId: b.getAttribute('data-cancel-ord') });
        AetherNative.haptic(res.ok ? 'success' : 'error');
        lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
        renderHeader();
        renderWalletTab(host);
      });
    });

    host.querySelectorAll('[data-break-tr]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'BREAK_TRANCHE', trancheId: b.getAttribute('data-break-tr') });
        AetherNative.haptic(res.ok ? 'warning' : 'error');
        lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
        renderHeader();
        renderWalletTab(host);
      });
    });

    host.querySelectorAll('[data-open-pos]').forEach((b) => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        AetherNative.haptic('light');
        const side = b.getAttribute('data-pos-side') || 'BUY';
        openAssetDrawer(b.getAttribute('data-open-pos'), 'ORDER', side);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. SEKME 4: USTALIK (KARNEM & KASA DOKTORU, 12 SAHA VAKASI, UZMANLIK REHBERİ)
  // --------------------------------------------------------------------------
  function buildManualAndLexiconRegionHtml() {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const me = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(me);
    const studiedSet = new Set(Array.isArray(me?.studiedAcademyIds) ? me.studiedAcademyIds : []);
    const modules = G.getExpertCurriculum ? G.getExpertCurriculum() : [];
    const lexicon = G.getStreetLexicon ? G.getStreetLexicon() : [];
    const q = manualSearchQuery.trim().toLocaleUpperCase('tr-TR');

    const stageFilteredMods = (!q && academyStageFilter !== 'ALL')
      ? modules.filter((m) => String(m.rankStage || '').startsWith(academyStageFilter))
      : modules;

    const filteredMods = q
      ? modules.filter((m) =>
          (m.title + ' ' + (m.rankStage || '') + ' ' + (m.plainSummary20s || '') + ' ' + m.streetSummary + ' ' + m.proFormula).toLocaleUpperCase('tr-TR').includes(q)
        )
      : stageFilteredMods;

    const filteredLex = q
      ? lexicon.filter((lx) =>
          (lx.term + ' ' + lx.cat + ' ' + lx.street + ' ' + lx.pro).toLocaleUpperCase('tr-TR').includes(q)
        )
      : lexicon;

    const fw = G.computeFreedomWheelProjection
      ? G.computeFreedomWheelProjection({
          startCapitalTL: Math.max(100000, Math.round(snap.totalNetWorthTL || 1000000)),
          monthlyAddTL: fwMonthlyAddTL,
          realAnnualReturnPct: fwRealReturnPct,
          monthlyExpenseTL: fwMonthlyExpTL,
          years: fwYears
        })
      : null;

    return `
      ${!q && fw ? `
        <section class="ae-card" style="border-color:rgba(16,185,129,0.36);margin-bottom:11px">
          <span class="ms-sig-pill good">🌊 Küçük Damlalardan Koca Nehre · Kendi Özgürlük Çarkın</span>
          <h3 style="margin:6px 0 3px;font-size:15.2px;font-weight:900">Düzenli Birikim & Reel Bileşik Getiri Simülatörü</h3>
          <p style="margin:0 0 8px;font-size:11.6px;color:var(--ink-400)">Enflasyon arındırılmış <strong>bugünün alım gücüyle</strong> her ay eklediğin damlaların ne zaman aylık yaşam giderini (%100 özgürlük) tek başına ödeyeceğini gör:</p>

          <div style="font-size:11px;font-weight:800;color:var(--ink-400);margin-bottom:4px">Aylık Kenara Ayrılan Tutar (Bugünkü ₺):</div>
          <div class="ae-hscroll" style="margin-bottom:6px">
            ${[0, 5000, 15000, 30000, 50000].map((v) => `
              <button type="button" class="ae-chip ${fwMonthlyAddTL === v ? 'active' : ''}" data-fw-add="${v}" style="padding:4px 9px;font-size:11px">${v === 0 ? '0 ₺ (Sadece Kasa)' : '+' + (v / 1000) + 'B ₺/ay'}</button>
            `).join('')}
          </div>

          <div style="font-size:11px;font-weight:800;color:var(--ink-400);margin-bottom:4px">TÜFE Üstü Yıllık Net Reel Getiri & Aylık Gider Hedefi:</div>
          <div class="ae-hscroll" style="margin-bottom:8px">
            ${[6, 10, 14, 18].map((r) => `
              <button type="button" class="ae-chip sub ${fwRealReturnPct === r ? 'active' : ''}" data-fw-ret="${r}" style="padding:4px 9px;font-size:11px">Reel +%${r}/yıl</button>
            `).join('')}
            ${[35000, 55000, 85000].map((ex) => `
              <button type="button" class="ae-chip sub ${fwMonthlyExpTL === ex ? 'active' : ''}" data-fw-exp="${ex}" style="padding:4px 9px;font-size:11px">Gider ${(ex / 1000)}B ₺</button>
            `).join('')}
          </div>

          <div class="ae-kpi-2x2" style="margin-bottom:8px">
            <div class="ms-kpi-box">
              <span>${fwYears}. Yıl Reel Kasa (Bugünkü Güç)</span>
              <strong style="font-size:14.2px">${fmtCompactTL(fw.finalRealVaultTL)}</strong>
              <small>Bileşik Reel Büyüme Dahil</small>
            </div>
            <div class="ms-kpi-box">
              <span>${fwYears}. Yıl Aylık Pasif Nehir</span>
              <strong style="font-size:14.2px" class="pos">+${fmtTL(fw.finalMonthlyPassiveRealTL)}/ay</strong>
              <small>${fw.freedomYears != null ? `🎯 ${fw.freedomYears}. yılda %100 Özgür!` : `Giderin %${fw.finalCoveragePct}’sini karşılar`}</small>
            </div>
          </div>

          <div style="display:grid;gap:4px">
            ${fw.milestones.filter((m) => m.year === 1 || m.year === 3 || m.year === 5 || m.year === 8 || m.year === 10).map((ms) => `
              <div style="display:flex;align-items:center;gap:8px;font-size:11px">
                <strong style="width:42px;color:var(--ink-400)">${ms.year}. Yıl</strong>
                <div class="ms-bar-track" style="flex:1;height:6px">
                  <div class="ms-bar-fill ${ms.expenseCoveragePct >= 100 ? 'green' : 'amber'}" style="width:${Math.min(100, ms.expenseCoveragePct)}%"></div>
                </div>
                <strong style="min-width:96px;text-align:right" class="${ms.expenseCoveragePct >= 100 ? 'pos' : ''}">+${fmtCompactTL(ms.monthlyPassiveRealTL)}/ay (%${ms.expenseCoveragePct})</strong>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!q ? `
        <div class="ae-hscroll" style="margin-bottom:8px">
          <button type="button" class="ae-chip ${academyStageFilter === 'ALL' ? 'active' : 'sub'}" data-astage="ALL">Tümü (${modules.length})</button>
          <button type="button" class="ae-chip ${academyStageFilter === '1. Kademe' ? 'active' : 'sub'}" data-astage="1. Kademe">1. Kasa Gözü</button>
          <button type="button" class="ae-chip ${academyStageFilter === '2. Kademe' ? 'active' : 'sub'}" data-astage="2. Kademe">2. Terazi</button>
          <button type="button" class="ae-chip ${academyStageFilter === '3. Kademe' ? 'active' : 'sub'}" data-astage="3. Kademe">3. Tahta</button>
          <button type="button" class="ae-chip ${academyStageFilter === '4. Kademe' ? 'active' : 'sub'}" data-astage="4. Kademe">4. Fon & BES</button>
          <button type="button" class="ae-chip ${academyStageFilter === '5. Kademe' ? 'active' : 'sub'}" data-astage="5. Kademe">5. İstihbarat</button>
          <button type="button" class="ae-chip ${academyStageFilter === '6. Kademe' ? 'active' : 'sub'}" data-astage="6. Kademe">6. Strateji</button>
        </div>
      ` : ''}

      ${filteredMods.length > 0 ? `
        <div style="display:flex;justify-content:space-between;align-items:center;margin:4px 2px 8px">
          <span style="font-size:12px;font-weight:800;color:var(--gold-bright)">📚 6 Kademeli Saha Akademisi (${studiedSet.size}/${modules.length} Özümsendi)</span>
        </div>
        ${filteredMods.map((m, idx) => {
          const isDone = studiedSet.has(m.id);
          const quick20s = m.plainSummary20s || m.grandmaSummary || '';
          return `
            <details class="ae-guide-acc" ${idx === 0 || q ? 'open' : ''}>
              <summary>
                <span style="display:flex;align-items:center;gap:9px;min-width:0">
                  <span class="ae-step-tag" style="${isDone ? 'background:rgba(16,185,129,0.2);color:var(--green-ink)' : ''}">${isDone ? '✓' : esc(m.step)}</span>
                  <span style="min-width:0">
                    ${m.rankStage ? `<small style="display:block;font-size:10px;color:var(--ink-400);font-weight:800">${esc(m.rankStage)}</small>` : ''}
                    <span style="line-height:1.26;display:block">${esc(m.title)}</span>
                  </span>
                </span>
              </summary>
              <div class="ae-guide-body">
                ${quick20s ? `
                  <div style="margin-top:10px;background:var(--gold-soft);border:1px solid rgba(240,180,41,0.34);border-radius:12px;padding:10px 12px;margin-bottom:8px;color:var(--ink-100)">
                    <strong style="color:var(--gold-bright);display:block;font-size:12px;margin-bottom:3px">⚡ 20 Saniyede Net Özeti:</strong>
                    ${esc(quick20s)}
                  </div>
                ` : ''}
                <div style="margin-top:${quick20s ? '0' : '10px'};background:var(--surface-2);border-radius:11px;padding:10px 12px;margin-bottom:8px">
                  <strong style="color:var(--gold-bright);display:block;font-size:11.8px;margin-bottom:3px">🥖 Sokak Türkçesiyle Derin Özü:</strong>
                  ${esc(m.streetSummary)}
                </div>
                <div style="background:var(--surface-2);border-left:3.5px solid var(--cyan);border-radius:10px;padding:10px 12px;margin-bottom:8px">
                  <strong style="color:var(--cyan);display:block;font-size:11.8px;margin-bottom:3px">🦅 Profesyonelin Terazisi & 2026 Mevzuat Formülü:</strong>
                  ${esc(m.proFormula)}
                </div>
                <div style="font-size:12.2px;color:var(--ink-400);margin-bottom:9px">💡 <strong>Canlı Kontrol:</strong> ${esc(m.liveCheck)}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
                  <div class="ae-hscroll" style="padding-bottom:0;flex:1">
                    ${(m.sampleKeys || []).map((sk) => {
                      const a = K.getAsset(sk);
                      return a ? `<button type="button" class="ae-chip sub" data-open-asset="${esc(a.key)}">${esc(a.ticker)} · ${a.isRateInstrument ? '%' + a.annualGrossRatePct : fmtUnitTL(a.priceTL)}</button>` : '';
                    }).join('')}
                  </div>
                  <button type="button" class="ms-btn ${isDone ? '' : 'primary'} sm" data-toggle-acad="${esc(m.id)}">
                    ${isDone ? '✓ Özümsendi' : 'Özümsedim İşaretle'}
                  </button>
                </div>
              </div>
            </details>
          `;
        }).join('')}
      ` : ''}

      <section class="ae-card" style="margin-top:12px">
        <span class="ms-sig-pill info">Sokak Türkçesi -> Profesyonel Analist Sözlüğü</span>
        <h3 style="margin:6px 0 8px;font-size:15.5px;font-weight:800">${lexicon.length} Temel Kavramın Mahalle Fırını Çevirisi (${filteredLex.length})</h3>
        ${filteredLex.length > 0 ? `
          <div class="ms-list">
            ${filteredLex.map((lx) => `
              <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:5px">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                  <strong style="font-size:13.4px;color:var(--gold-bright)">${esc(lx.term)}</strong>
                  <span class="ms-sig-pill neutral">${esc(lx.cat)}</span>
                </div>
                <div style="font-size:12px;color:var(--ink-100)"><strong>Sokak Dili:</strong> ${esc(lx.street)}</div>
                <div style="font-size:11.6px;color:var(--cyan)"><strong>Usta Eşiği:</strong> ${esc(lx.pro)}</div>
              </div>
            `).join('')}
          </div>
        ` : `<div style="font-size:12.4px;color:var(--ink-400);padding:8px">Aramana uygun terim veya bölüm bulunamadı.</div>`}
      </section>
    `;
  }

  function bindManualAcademyEvents(root, host) {
    const K = global.AetherKernelV10;
    bindAssetListClicks(root);
    root.querySelectorAll('[data-astage]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        academyStageFilter = b.getAttribute('data-astage') || 'ALL';
        renderMasteryTab(host);
      });
    });
    root.querySelectorAll('[data-toggle-acad]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.toggleAcademyModuleStudied(b.getAttribute('data-toggle-acad'));
        AetherNative.haptic(res.studied ? 'success' : 'selection');
        if (res.studied) AetherNative.toast('Modül ustalık karnene işlendi!', 'ok');
        renderHeader();
        renderMasteryTab(host);
      });
    });
    root.querySelectorAll('[data-fw-add]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        fwMonthlyAddTL = Number(b.getAttribute('data-fw-add')) || 0;
        renderMasteryTab(host);
      });
    });
    root.querySelectorAll('[data-fw-ret]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        fwRealReturnPct = Number(b.getAttribute('data-fw-ret')) || 10;
        renderMasteryTab(host);
      });
    });
    root.querySelectorAll('[data-fw-exp]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        fwMonthlyExpTL = Number(b.getAttribute('data-fw-exp')) || 45000;
        renderMasteryTab(host);
      });
    });
  }

  function renderInteractiveLabsHtml(member, snap) {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const detStats = member.detectiveStats || { played: 0, wins: 0, streak: 0, bestStreak: 0 };

    const toolBar = `
      <div class="ae-hscroll" id="aeLabToolsScroll" style="margin-bottom:10px">
        <button type="button" class="ae-chip ${labToolId === 'DRILL' ? 'active' : ''}" data-lab-tool="DRILL">🎯 Karar Tatbikatı (6)</button>
        <button type="button" class="ae-chip ${labToolId === 'DETECTIVE' ? 'active' : ''}" data-lab-tool="DETECTIVE">⚔️ Kasa Dedektifi</button>
        <button type="button" class="ae-chip ${labToolId === 'BAKERY' ? 'active' : ''}" data-lab-tool="BAKERY">🥖 Mahalle Fırını (621)</button>
        <button type="button" class="ae-chip ${labToolId === 'KAP_READER' ? 'active' : ''}" data-lab-tool="KAP_READER">🔬 KAP Okuyucu</button>
        <button type="button" class="ae-chip ${labToolId === 'BREAKEVEN' ? 'active' : ''}" data-lab-tool="BREAKEVEN">⚖️ 4 Kapı Terazisi</button>
        <button type="button" class="ae-chip ${labToolId === 'GVK80' ? 'active' : ''}" data-lab-tool="GVK80">🏛️ 2026 Vergi Merkezi</button>
        <button type="button" class="ae-chip ${labToolId === 'BES2026' ? 'active' : ''}" data-lab-tool="BES2026">🛡️ 2026 BES Motoru</button>
        <button type="button" class="ae-chip ${labToolId === 'BASKET' ? 'active' : ''}" data-lab-tool="BASKET">🥚 Tek Sepet Testi</button>
        <button type="button" class="ae-chip ${labToolId === 'FREEDOM' ? 'active' : ''}" data-lab-tool="FREEDOM">🌊 Özgürlük Çarkı</button>
      </div>
    `;

    if (labToolId === 'DRILL') {
      const drills = G.getInteractiveDecisionDrills ? G.getInteractiveDecisionDrills() : [];
      const curDrill = drills.find((d) => d.id === activeDrillId) || drills[0];
      const doneMap = member.completedDrills || {};
      if (!curDrill) return `${toolBar}<div class="ae-card">Tatbikatlar yükleniyor...</div>`;
      const totalStages = curDrill.stages.length;
      const isFinished = drillStageIdx >= totalStages;
      const curStage = !isFinished ? curDrill.stages[drillStageIdx] : null;
      const deltaFrom1M = drillCapitalTL - curDrill.startCapitalTL;

      return `
        ${toolBar}
        <section class="ae-lab-card" style="border-color:rgba(240,180,41,0.38)">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
            <span class="ms-sig-pill warn">🎯 Çok Aşamalı Gerçek Piyasa Karar Masası</span>
            <span class="ms-sig-pill good">${Object.keys(doneMap).length}/${drills.length} Tamamlandı</span>
          </div>
          <h2 style="margin:4px 0 6px;font-size:17.2px;font-weight:900">1.000.000 ₺ Sanal Tatbikat Kasasıyla 4 Aşamada Karar Ver</h2>

          <div class="ae-hscroll" style="margin-bottom:10px">
            ${drills.map((dr) => {
              const rec = doneMap[dr.id];
              return `<button type="button" class="ae-chip ${curDrill.id === dr.id ? 'active' : 'sub'}" data-drill-pick="${esc(dr.id)}">${rec ? '✓ ' : ''}${esc(dr.badge)}</button>`;
            }).join('')}
          </div>

          <div style="background:var(--surface-2);border:1px solid var(--line-subtle);border-radius:14px;padding:11px 13px;margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
              <div style="min-width:0;flex:1">
                <strong style="font-size:14.4px;display:block">${esc(curDrill.title)}</strong>
                <span style="font-size:12px;color:var(--ink-400)">${esc(curDrill.subtitle)}</span>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <strong style="font-size:15.5px;display:block" class="${deltaFrom1M >= 0 ? 'pos' : 'neg'}">${fmtTL(drillCapitalTL)}</strong>
                <small style="font-size:11px;color:var(--ink-400)">${deltaFrom1M >= 0 ? '+' : ''}${fmtCompactTL(deltaFrom1M)} · ${drillScore}/100p</small>
              </div>
            </div>
            <div class="ae-drill-stepper">
              ${curDrill.stages.map((_, i) => `<div class="ae-drill-step ${i < drillStageIdx ? 'done' : (i === drillStageIdx ? 'active' : '')}"></div>`).join('')}
            </div>
          </div>

          ${!isFinished && curStage ? `
            <div style="margin-bottom:8px">
              <span class="ms-sig-pill info">⏱️ Aşama ${drillStageIdx + 1}/${totalStages} · ${esc(curStage.clock)}</span>
              <p style="margin:8px 0 10px;font-size:13.6px;color:var(--ink-100);line-height:1.52;font-weight:600">${esc(curStage.headline)}</p>
              <div class="ae-choice-stack">
                ${curStage.choices.map((ch) => {
                  const isPicked = drillPickedChoice && drillPickedChoice.id === ch.id;
                  const cls = drillPickedChoice
                    ? (ch.score >= 20 ? 'picked-right' : (isPicked ? 'picked-wrong' : ''))
                    : '';
                  return `
                    <button type="button" class="ae-choice-btn ${cls}" data-drill-choice="${esc(ch.id)}" ${drillPickedChoice ? 'disabled' : ''}>
                      <span class="ae-choice-key">${esc(ch.id)}</span>
                      <span>${esc(ch.label)}</span>
                    </button>
                  `;
                }).join('')}
              </div>
              ${drillPickedChoice ? `
                <div class="ms-alert ${drillPickedChoice.score >= 20 ? 'ok' : (drillPickedChoice.score >= 10 ? 'info' : 'warn')}" style="margin-top:10px;margin-bottom:10px">
                  <strong>${drillPickedChoice.deltaTL >= 0 ? `✅ +${fmtTL(drillPickedChoice.deltaTL)}` : `⚠️ ${fmtTL(drillPickedChoice.deltaTL)}`} (${drillPickedChoice.score}/25 puan):</strong>
                  ${esc(drillPickedChoice.outcome)}
                </div>
                <button type="button" class="ae-big-btn gold" style="width:100%" id="aeDrillNextStageBtn">
                  ${drillStageIdx + 1 < totalStages ? `Sonraki Aşamaya Geç (${drillStageIdx + 2}/${totalStages}) →` : 'Tatbikat Karnesini Gör →'}
                </button>
              ` : ''}
            </div>
          ` : `
            <div class="ae-verdict-banner ${drillScore >= 75 ? 'green' : (drillScore >= 50 ? 'amber' : 'red')}">
              <strong style="font-size:16px;display:block;margin-bottom:4px">
                ${drillScore >= 85 ? '🏆 Usta Seviyesi Karar Yönetimi!' : (drillScore >= 60 ? '🧭 Sağlam Refleksler — Birkaç İnce Ayar Kaldı' : '⚠️ Piyasa Tuzakları Can Yaktı — Tekrar Dene!')}
              </strong>
              <div style="font-size:13.2px;color:var(--ink-100)">
                Final Tatbikat Kasası: <strong>${fmtTL(drillCapitalTL)}</strong> (${deltaFrom1M >= 0 ? '+' : ''}${fmtTL(deltaFrom1M)}) · Ustalık Skoru: <strong>${drillScore}/100</strong>
              </div>
            </div>
            <div class="ms-list" style="margin-bottom:10px">
              ${drillHistory.map((h, i) => `
                <div class="ms-list-row" style="padding:8px 10px;font-size:12px">
                  <div style="min-width:0;flex:1"><strong>${i + 1}. ${esc(h.clock)}</strong><div style="color:var(--ink-400);margin-top:2px">${esc(h.outcome)}</div></div>
                  <strong class="${h.deltaTL >= 0 ? 'pos' : 'neg'}" style="flex-shrink:0">${h.deltaTL >= 0 ? '+' : ''}${fmtCompactTL(h.deltaTL)}</strong>
                </div>
              `).join('')}
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button type="button" class="ms-btn primary" style="flex:1" id="aeDrillReplayBtn">↻ Bu Tatbikatı Tekrarla</button>
              <button type="button" class="ms-btn" style="flex:1" id="aeDrillNextScenarioBtn">Sonraki Senaryo ›</button>
            </div>
          `}
        </section>
      `;
    }

    if (labToolId === 'BES2026') {
      const bes = K.computeBes2026Simulation
        ? K.computeBes2026Simulation({ monthlyContribTL: labBesMonthlyTL, years: labBesYears, ageAtStart: labBesStartAge, fundRealAnnualPct: labBesRealPct })
        : null;
      return `
        ${toolBar}
        ${bes ? `
          <section class="ae-lab-card" style="border-color:rgba(16,185,129,0.4)">
            <span class="ms-sig-pill good">🛡️ 2026 Güncel BES Motoru · 10811 Sayılı Karar (%20 Devlet Katkısı)</span>
            <h2 style="margin:6px 0 4px;font-size:17.2px;font-weight:900">BES’te Standart Fon vs Aktif BEFAS Sepeti Farkı</h2>
            <p style="margin:0 0 10px;font-size:12.8px;color:var(--ink-200)">1 Ocak 2026 itibarıyla devlet katkısı <strong>%20</strong> ve yıllık tavan <strong>396.360 ₺</strong> katkıya maks <strong>79.272 ₺</strong>. Kendi aylık katkı ve BEFAS fon getirinle bugünkü alım gücüyle gerçek sonucunu gör:</p>

            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>Aylık Katkı Payın</span><strong id="aeBesMonLbl">${fmtTL(labBesMonthlyTL)}/ay</strong></div>
              <input type="range" class="ae-slider" id="aeBesMonSl" min="2000" max="45000" step="1000" value="${labBesMonthlyTL}" />
            </div>
            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>Başlangıç Yaşın</span><strong id="aeBesAgeLbl">${labBesStartAge} Yaş</strong></div>
              <input type="range" class="ae-slider" id="aeBesAgeSl" min="18" max="55" step="1" value="${labBesStartAge}" />
            </div>
            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>Sistemde Kalma Süren</span><strong id="aeBesYrLbl">${labBesYears} Yıl (Çıkış Yaşı: ${bes.endAge})</strong></div>
              <input type="range" class="ae-slider" id="aeBesYrSl" min="2" max="25" step="1" value="${labBesYears}" />
            </div>
            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>BEFAS Fon Reel Getirisi (Enflasyon Üstü)</span><strong id="aeBesRealLbl" class="${labBesRealPct >= 2 ? 'pos' : 'warn-txt'}">Reel ${labBesRealPct >= 0 ? '+' : ''}%${labBesRealPct}/yıl</strong></div>
              <input type="range" class="ae-slider" id="aeBesRealSl" min="0" max="16" step="1" value="${labBesRealPct}" />
            </div>

            <div id="aeBesLiveOut">
              <div class="ae-kpi-2x2" style="margin-bottom:10px">
                <div class="ms-kpi-box" style="border-color:rgba(16,185,129,0.48)"><span>Net Reel BES Havuzun</span><strong class="pos">${fmtCompactTL(bes.totalNetRealTL)}</strong><small>Yatırdığın: ${fmtCompactTL(bes.totalOwnPaidTL)}</small></div>
                <div class="ms-kpi-box"><span>2026 Yıllık Devlet Katkısı</span><strong class="pos">+${fmtTL(bes.annualStateContribTL)}/yıl</strong><small>Hak Ediş: %${bes.vestingPct} · Stopaj: %${bes.exitStopajPct}</small></div>
                <div class="ms-kpi-box" style="border-color:rgba(240,180,41,0.45)"><span>BEFAS Yönetimi Farkı</span><strong class="${bes.befasAdvantageTL >= 0 ? 'pos' : 'neg'}">${bes.befasAdvantageTL >= 0 ? '+' : ''}${fmtCompactTL(bes.befasAdvantageTL)}</strong><small>Standart fon (${fmtCompactTL(bes.netStdTotalTL)}) farkı</small></div>
                <div class="ms-kpi-box"><span>Aylık Ömür Boyu Maaş (%4)</span><strong>+${fmtTL(bes.monthlyPensionReal4PctTL)}/ay</strong><small>Bugünkü alım gücüyle</small></div>
              </div>
              <div class="ms-alert ${bes.vestingPct >= 60 ? 'ok' : 'warn'}" style="margin-bottom:0">
                <strong>📋 ${esc(bes.exitStageLabel)}:</strong>
                ${bes.overCapAnnualTL > 0
                  ? ` Yıllık katkın 2026 tavanı olan 396.360 ₺’yi ${fmtTL(bes.overCapAnnualTL)} aşıyor; aşan tutar 2027 yılı devlet katkısı hesabına devreder!`
                  : ` Yıllık tavan (${fmtTL(bes.annualCapContrib2026TL)}) içindesin; devlet katkısının tamamından yararlanıyorsun.`}
              </div>
            </div>
          </section>
        ` : ''}
      `;
    }

    if (labToolId === 'KAP_READER') {
      const scenarios = G.getKapForensicReaderScenarios ? G.getKapForensicReaderScenarios() : [];
      const curSc = scenarios.find((s) => s.id === kapReaderId) || scenarios[0];
      const chkState = kapCheckedMap[curSc?.id] || {};
      const doneCnt = curSc ? curSc.checks.filter((_, idx) => chkState[idx]).length : 0;
      return `
        ${toolBar}
        <section class="ae-lab-card">
          <span class="ms-sig-pill info">🔬 30 Saniyede KAP & Bilanço Satır Okuyucu</span>
          <h2 style="margin:6px 0 4px;font-size:17.5px;font-weight:900">Manşete Değil, Dipnottaki Gerçeğe Bak!</h2>
          <p style="margin:0 0 10px;font-size:13px;color:var(--ink-200)">Gerçek borsada acemi manşet heyecanıyla atlar, usta 3 kontrol maddesini işaretleyip karar verir. Bir bildirim türü seç:</p>

          <div class="ae-hscroll" style="margin-bottom:10px">
            ${scenarios.map((sc) => `
              <button type="button" class="ae-chip ${curSc?.id === sc.id ? 'active' : 'sub'}" data-kap-sc="${esc(sc.id)}">${esc(sc.badge)}</button>
            `).join('')}
          </div>

          ${curSc ? `
            <div style="background:var(--surface-2);border:1px solid var(--line-strong);border-radius:14px;padding:12px 13px;margin-bottom:10px">
              <span style="display:block;font-size:11px;font-weight:800;color:var(--gold-bright);margin-bottom:4px">📢 EKRANA DÜŞEN BİLDİRİM MANŞETİ:</span>
              <strong style="font-size:14.2px;line-height:1.42;color:var(--ink-100);display:block">${esc(curSc.headline)}</strong>
              <div style="margin-top:7px;padding-top:7px;border-top:1px solid var(--line-subtle);font-size:12.4px;color:var(--red-ink)">
                <strong>⛔ Aceminin Hatası:</strong> ${esc(curSc.amateurTrap)}
              </div>
            </div>

            <div class="ae-verdict-banner ${esc(curSc.verdictTone)}">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px">
                <strong style="font-size:14.5px">🦅 ${esc(curSc.verdictTitle)}</strong>
                <span class="ms-sig-pill ${doneCnt === curSc.checks.length ? 'good' : 'info'}">${doneCnt}/${curSc.checks.length} Kontrol</span>
              </div>
              <div style="display:grid;gap:7px">
                ${curSc.checks.map((ck, idx) => `
                  <label style="display:flex;align-items:flex-start;gap:9px;padding:9px 10px;border-radius:11px;background:var(--surface-1);border:1px solid ${chkState[idx] ? 'rgba(16,185,129,0.5)' : 'var(--line-subtle)'};font-size:12.6px;line-height:1.45;cursor:pointer">
                    <input type="checkbox" data-kap-chk="${idx}" ${chkState[idx] ? 'checked' : ''} style="width:18px;height:18px;margin-top:2px;flex-shrink:0" />
                    <span style="color:var(--ink-100)">${esc(ck)}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <div style="font-size:12px;font-weight:800;color:var(--ink-400);margin-bottom:6px">Canlı BIST Örneklerinde Şimdi İncele:</div>
            <div class="ae-hscroll" style="padding-bottom:0">
              ${(curSc.sampleKeys || []).map((sk) => {
                const a = K.getAsset(sk);
                return a ? `<button type="button" class="ae-chip sub" data-open-asset="${esc(a.key)}">${esc(a.ticker)} Kasasını Aç ›</button>` : '';
              }).join('')}
            </div>
          ` : ''}
        </section>
      `;
    }

    if (labToolId === 'BAKERY') {
      const quickStocks = ['bist-tuprs', 'bist-thyao', 'bist-froto', 'reel-perakende-bimas', 'bist-asels', 'bist-garan', 'bist-tursg', 'bist-eregl', 'bist-enkai', 'bist-tcell'];
      const bq = labBakerySearch.trim().toLocaleUpperCase('tr-TR');
      const searchHits = bq.length > 0
        ? K.getAllAssets().filter((a) => a.subVenue === 'BIST_STOCK' && (a.ticker.toLocaleUpperCase('tr-TR').includes(bq) || a.name.toLocaleUpperCase('tr-TR').includes(bq))).slice(0, 8)
        : [];
      const target = K.getAsset(labBakeryKey) || K.getAsset('bist-tuprs');
      const bk = target ? G.computeBakery100kScale(target, labBakeryAmt) : null;
      const fn = target ? G.computeFinancial100kScale(target, labBakeryAmt) : null;
      const gv = target && G.getPlainAssetVerdict ? G.getPlainAssetVerdict(target, labBakeryAmt) : null;
      const paybackYears = bk && bk.annualOcfTL > 0 ? +(labBakeryAmt / bk.annualOcfTL).toFixed(1) : (fn && fn.annualNetProfitTL > 0 ? +(labBakeryAmt / fn.annualNetProfitTL).toFixed(1) : null);

      return `
        ${toolBar}
        <section class="ae-lab-card">
          <span class="ms-sig-pill warn">🥖 621 Gerçek Türk Şirketini Mahalle Fırınına Çevir</span>
          <h2 style="margin:6px 0 4px;font-size:17.5px;font-weight:900">Neye Ortak Olduğunu Etimle Kemiğimle Gör</h2>
          <p style="margin:0 0 10px;font-size:13px;color:var(--ink-200)">İstediğin şirketi ve tutarı seç; karmaşık milyonluk bilançoyu senin kendi paranın ürettiği <strong>günlük fırın hasılatına</strong> çevirelim:</p>

          <div class="ae-hscroll" style="margin-bottom:7px">
            ${quickStocks.map((sk) => {
              const sa = K.getAsset(sk);
              return sa ? `<button type="button" class="ae-chip ${target?.key === sa.key ? 'active' : 'sub'}" data-lab-bk-key="${esc(sa.key)}">${esc(sa.ticker)}</button>` : '';
            }).join('')}
          </div>

          <input id="aeLabBakerySearchInp" class="ae-input" type="search" value="${esc(labBakerySearch)}" placeholder="621 şirketten ara (örn: MGROS, CCOLA, SASA, TTRAK)..." style="margin-bottom:8px" />
          ${searchHits.length > 0 ? `
            <div class="ae-hscroll" style="margin-bottom:8px">
              ${searchHits.map((sh) => `<button type="button" class="ae-chip active" data-lab-bk-key="${esc(sh.key)}">${esc(sh.ticker)} · ${esc(sh.name.slice(0, 18))}</button>`).join('')}
            </div>
          ` : ''}

          <div class="ae-lab-slider-row">
            <div class="ae-lab-slider-head"><span>Ortak Olacağın Tutar</span><strong id="aeLabBakeryAmtLbl" style="color:var(--gold-bright)">${fmtTL(labBakeryAmt)}</strong></div>
            <input type="range" class="ae-slider" id="aeLabBakeryAmtSl" min="25000" max="1000000" step="25000" value="${labBakeryAmt}" />
          </div>

          <div id="aeLabBakeryLiveOut">
          ${target ? `
            <div class="ae-verdict-banner ${esc(gv?.trafficLight || 'amber')}">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
                <strong style="font-size:15.5px">${esc(target.ticker)} · ${esc(target.name)}</strong>
                <span class="ms-sig-pill ${gv?.trafficLight === 'green' ? 'good' : (gv?.trafficLight === 'red' ? 'danger' : 'warn')}">${esc(gv?.simpleLabel || 'Analiz')}</span>
              </div>
              <p style="margin:0;font-size:13.6px;line-height:1.5;color:var(--ink-100)">${esc(bk?.plainSummary || fn?.plainSummary || gv?.simpleMeaning || '')}</p>
            </div>

            ${bk ? `
              <div class="ae-kpi-2x2" style="margin-bottom:10px">
                <div class="ms-kpi-box"><span>Günlük Kasaya Giren Nakit</span><strong class="${bk.dailyOcfTL >= 0 ? 'pos' : 'neg'}">${bk.dailyOcfTL >= 0 ? '+' : ''}${bk.dailyOcfTL.toLocaleString('tr-TR')} ₺/gün</strong><small>Her gün fırın kasasına</small></div>
                <div class="ms-kpi-box"><span>Yıllık Serbest Nakit (FCF)</span><strong class="${bk.annualFcfTL >= 0 ? 'pos' : 'warn-txt'}">${bk.annualFcfTL >= 0 ? '+' : ''}${fmtTL(bk.annualFcfTL)}</strong><small>Yeni makine masrafı sonrası</small></div>
                <div class="ms-kpi-box"><span>Kasadaki Hazır Para Payın</span><strong>${fmtTL(bk.cashShareTL)}</strong><small>Sırtındaki borç: ${fmtTL(bk.debtShareTL)}</small></div>
                <div class="ms-kpi-box"><span>Kendi Kendini Ödeme Süresi</span><strong>${paybackYears ? paybackYears + ' Yıl' : 'Nakit Zayıf'}</strong><small>Yıllık net temettü: +${fmtTL(bk.annualNetDivTL)}</small></div>
              </div>
            ` : (fn ? `
              <div class="ae-kpi-2x2" style="margin-bottom:10px">
                <div class="ms-kpi-box"><span>Günlük Net Kâr Payın</span><strong class="${fn.dailyNetProfitTL >= 0 ? 'pos' : 'neg'}">${fn.dailyNetProfitTL >= 0 ? '+' : ''}${fn.dailyNetProfitTL.toLocaleString('tr-TR')} ₺/gün</strong></div>
                <div class="ms-kpi-box"><span>Yıllık Net Kâr Payın</span><strong class="${fn.annualNetProfitTL >= 0 ? 'pos' : 'neg'}">${fn.annualNetProfitTL >= 0 ? '+' : ''}${fmtTL(fn.annualNetProfitTL)}</strong></div>
                <div class="ms-kpi-box"><span>Özsermaye Kârlılığı (ROE)</span><strong>${fn.roePct != null ? '%' + fn.roePct : '-'}</strong></div>
                <div class="ms-kpi-box"><span>Kendi Kendini Ödeme</span><strong>${paybackYears ? paybackYears + ' Yıl' : '-'}</strong></div>
              </div>
            ` : '')}

            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button type="button" class="ms-btn primary" style="flex:1" data-open-asset="${esc(target.key)}">${esc(target.ticker)} Canlı Tahtasını Aç</button>
              <button type="button" class="ae-term-pill" data-explain-term="OCF">OCF nedir?</button>
              <button type="button" class="ae-term-pill" data-explain-term="FCF">FCF nedir?</button>
            </div>
          ` : ''}
          </div>
        </section>
      `;
    }

    if (labToolId === 'BREAKEVEN') {
      const be = G.computeBreakevenComparison ? G.computeBreakevenComparison(calcAmountTL, calcDays) : null;
      return `
        ${toolBar}
        ${be ? `
          <section class="ae-lab-card">
            <span class="ms-sig-pill info">⚖️ Canlı 4 Kapı Vergi, Makas & Başabaş Terazisi</span>
            <h2 style="margin:6px 0 4px;font-size:17.5px;font-weight:900">Dolar veya Altın Kaç ₺ Olmazsa TL’ye Yenilir?</h2>
            <p style="margin:0 0 10px;font-size:13px;color:var(--ink-200)">2026 güncel stopaj oranları (%0 Sukuk, %17,5/%15/%10 Mevduat, %17,5 PPF) ve canlı makaslarla gerçek net kazancı kıyasla:</p>

            <div style="font-size:12px;font-weight:800;color:var(--ink-400);margin-bottom:5px">Sermaye Tutarı:</div>
            <div class="ae-hscroll" style="margin-bottom:8px">
              ${[100000, 250000, 500000, 1000000].map((v) => `<button type="button" class="ae-chip sub ${calcAmountTL === v ? 'active' : ''}" data-lab-bamt="${v}">${fmtCompactTL(v)}</button>`).join('')}
            </div>

            <div style="font-size:12px;font-weight:800;color:var(--ink-400);margin-bottom:5px">Vade Süresi:</div>
            <div class="ae-hscroll" style="margin-bottom:12px">
              ${[[32, '32 Gün (1 Ay)'], [90, '90 Gün (3 Ay)'], [180, '180 Gün (6 Ay)'], [365, '365 Gün (1 Yıl)']].map(([d, lbl]) => `<button type="button" class="ae-chip sub ${calcDays === d ? 'active' : ''}" data-lab-bdays="${d}">${lbl}</button>`).join('')}
            </div>

            <div class="ae-kpi-2x2" style="margin-bottom:10px">
              <div class="ms-kpi-box" style="border-color:rgba(16,185,129,0.45)"><span>💧 %0 Vergili Kamu Sukuk</span><strong class="pos">${fmtTL(be.sukuk.endTL)}</strong><small>Net +${fmtTL(be.sukuk.netGainTL)} (+%${be.sukuk.netPeriodPct})</small></div>
              <div class="ms-kpi-box"><span>🏦 Vadeli Mevduat (%${be.deposit.stopaj} Vergi)</span><strong>${fmtTL(be.deposit.endTL)}</strong><small>Net +${fmtTL(be.deposit.netGainTL)} (+%${be.deposit.netPeriodPct})</small></div>
              <div class="ms-kpi-box"><span>⚡ Günlük PPF (%17,5 Vergi)</span><strong>${fmtTL(be.ppf.endTL)}</strong><small>Net +${fmtTL(be.ppf.netGainTL)} (+%${be.ppf.netPeriodPct})</small></div>
              <div class="ms-kpi-box" style="border-color:rgba(240,180,41,0.45)"><span>🥖 Enflasyon Barajı</span><strong class="warn-txt">${fmtTL(be.infBarTL)}</strong><small>Alım gücünü koruma sınırı</small></div>
            </div>

            <div class="ms-alert info" style="margin-bottom:10px">
              <strong style="display:block;margin-bottom:5px">🎯 ${be.horizonDays} Gün Sonraki Başabaş Sınırları (Sukuk’u Geçmek İçin):</strong>
              <div>• <strong>Dolar:</strong> Bugün ${be.usdNow} ₺ -> En az <strong>${be.breakevenUsdBazaar} ₺</strong> olmalı (Gece bankadan alırsan <strong>${be.breakevenUsdBankNight} ₺</strong>!).</div>
              <div style="margin-top:4px">• <strong>Gram Altın:</strong> Bugün ${fmtTL(be.goldNow)} -> En az <strong>${fmtTL(be.breakevenGoldBazaar)}</strong> olmalı.</div>
              <div style="margin-top:4px">• <strong>ALTIN.S1 Hava Parası:</strong> Aynı parayla Çarşıdan <strong>${be.goldArbitrage.bazaarGrams} gr</strong>, ALTIN.S1’den sadece <strong>${be.goldArbitrage.s1Grams} gr</strong> alınır (<strong class="neg">-${fmtTL(be.goldArbitrage.s1AirMoneyTL)} fark!</strong>).</div>
            </div>

            <div class="ae-hscroll" style="padding-bottom:0">
              <button type="button" class="ae-term-pill" data-explain-term="Başabaş Kuru">Başabaş Kuru?</button>
              <button type="button" class="ae-term-pill" data-explain-term="Kamu Kira Sertifikası">Sukuk %0 Vergi?</button>
              <button type="button" class="ae-term-pill" data-explain-term="Hava Parası">Hava Parası?</button>
            </div>
          </section>
        ` : ''}
      `;
    }

    if (labToolId === 'GVK80') {
      const sim = K.computeGvk80Simulation
        ? K.computeGvk80Simulation({ buyTL: labGvkBuy, sellTL: labGvkSell, yiUfePct: labGvkUfe, priorAnnualGainTL: 0 })
        : null;
      const divSim = K.computeDividendTax2026 ? K.computeDividendTax2026({ grossDividendTL: labDivGrossTL }) : null;
      const ebSim = K.computeEurobondTax2026 ? K.computeEurobondTax2026({ annualCouponTL: labEbCouponTL }) : null;
      return `
        ${toolBar}
        <section class="ae-lab-card">
          <span class="ms-sig-pill info">🏛️ 2026 Türkiye Güncel Vergi Merkezi (GVK 80 · Temettü · Eurobond)</span>
          <div class="ae-seg" style="margin:8px 0 10px">
            <button type="button" class="ae-seg-btn ${labTaxSub === 'GVK80' ? 'active' : ''}" data-tax-sub="GVK80">ABD Hisse</button>
            <button type="button" class="ae-seg-btn ${labTaxSub === 'DIVIDEND' ? 'active' : ''}" data-tax-sub="DIVIDEND">Temettü</button>
            <button type="button" class="ae-seg-btn ${labTaxSub === 'EUROBOND' ? 'active' : ''}" data-tax-sub="EUROBOND">Eurobond</button>
          </div>

          ${labTaxSub === 'DIVIDEND' && divSim ? `
            <h2 style="margin:2px 0 4px;font-size:17px;font-weight:900">2026 Temettü Beyanı (%50 İstisna & %15 Stopaj Mahsubu)</h2>
            <p style="margin:0 0 10px;font-size:12.8px;color:var(--ink-200)">Brüt temettünün yarısı vergiden muaf, 2026 beyan sınırı <strong>400.000 ₺</strong> (yani <strong>800.000 ₺ brüt / 680.000 ₺ net</strong> altı 0 ₺ ek vergi). Sınırı hemen geçince devletten <strong>vergi iadesi</strong> çıktığını kaydırıp gör:</p>
            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>Yıllık Brüt BIST Temettün</span><strong id="aeLabDivLbl" class="pos">${fmtTL(labDivGrossTL)}</strong></div>
              <input type="range" class="ae-slider" id="aeLabDivSl" min="100000" max="8000000" step="50000" value="${labDivGrossTL}" />
            </div>
            <div id="aeLabDivLiveOut">
              <div class="ae-kpi-2x2" style="margin-bottom:10px">
                <div class="ms-kpi-box"><span>Kaynakta Kesilen %15 Stopaj</span><strong>-${fmtTL(divSim.withholdingPaidTL)}</strong><small>Net yatan: ${fmtTL(divSim.netReceivedAtSourceTL)}</small></div>
                <div class="ms-kpi-box"><span>Beyana Tabi Yarı Matrah</span><strong>${fmtTL(divSim.taxableHalfTL)}</strong><small>2026 Sınırı: 400.000 ₺</small></div>
                <div class="ms-kpi-box" style="border-color:${divSim.isTaxRefund ? 'rgba(16,185,129,0.5)' : 'rgba(240,180,41,0.45)'}"><span>${divSim.mustDeclare ? (divSim.isTaxRefund ? '🎉 Devletten Vergi İadesi!' : 'Ek Ödenecek Vergi') : 'Beyan Durumu'}</span><strong class="${divSim.isTaxRefund || !divSim.mustDeclare ? 'pos' : 'warn-txt'}">${divSim.mustDeclare ? (divSim.isTaxRefund ? '+' + fmtTL(Math.abs(divSim.extraTaxOrRefundTL)) : '-' + fmtTL(divSim.extraTaxOrRefundTL)) : 'Beyan Yok (0 ₺)'}</strong><small>Efektif vergi: %${divSim.effectiveTaxPct}</small></div>
                <div class="ms-kpi-box"><span>Cebinde Kalan Final Net</span><strong class="pos">${fmtTL(divSim.finalNetCashTL)}</strong><small>%50 istisna + mahsup sonrası</small></div>
              </div>
              <div class="ms-alert ${!divSim.mustDeclare || divSim.isTaxRefund ? 'ok' : 'info'}" style="margin-bottom:0">
                ${!divSim.mustDeclare
                  ? `✅ <strong>Beyanname Gerekmez!</strong> Yarısı (${fmtTL(divSim.taxableHalfTL)}) 2026 sınırı olan 400.000 ₺’nin altında kaldığı için ek vergin 0 ₺.`
                  : (divSim.isTaxRefund
                    ? `🎉 <strong>Vergi İadesi Bölgesi!</strong> Hesaplanan gelir vergisi (${fmtTL(divSim.calculatedTaxTL)}), kaynağında kesilen %15 stopajdan (${fmtTL(divSim.withholdingPaidTL)}) küçük olduğu için Mart 2027 beyanıyla <strong>+${fmtTL(Math.abs(divSim.extraTaxOrRefundTL))}</strong> iade hakkın doğar!`
                    : `📊 <strong>Kademeli Dilim (%${divSim.topBracketPct}):</strong> Hesaplanan ${fmtTL(divSim.calculatedTaxTL)} vergiden ödediğin ${fmtTL(divSim.withholdingPaidTL)} stopaj mahsup edilir; sadece fark (${fmtTL(divSim.extraTaxOrRefundTL)}) ödenir.`)}
              </div>
            </div>
          ` : (labTaxSub === 'EUROBOND' && ebSim ? `
            <h2 style="margin:2px 0 4px;font-size:17px;font-weight:900">2026 Eurobond Kupon Vergi Sınırı (400.000 ₺ Eşiği)</h2>
            <p style="margin:0 0 10px;font-size:12.8px;color:var(--ink-200)">Eurobond kuponunda banka stopajı <strong>%0</strong>’dır. 2026 yıllık toplam brüt kuponun <strong>400.000 ₺</strong>’yi 1 TL bile aşarsa <strong>tamamı</strong> beyan edilir! Kaydırıcıyı 390B → 410B TL’ye çekip uçurumu gör:</p>
            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>Yıllık Brüt Eurobond Kupon Gelirin</span><strong id="aeLabEbLbl" class="${ebSim.couponMustDeclare ? 'warn-txt' : 'pos'}">${fmtTL(labEbCouponTL)}</strong></div>
              <input type="range" class="ae-slider" id="aeLabEbSl" min="100000" max="1500000" step="10000" value="${labEbCouponTL}" />
            </div>
            <div id="aeLabEbLiveOut">
              <div class="ae-kpi-2x2" style="margin-bottom:10px">
                <div class="ms-kpi-box"><span>2026 Beyan Sınırı</span><strong>400.000 ₺</strong><small>2. Gelir Vergisi Dilimi</small></div>
                <div class="ms-kpi-box" style="border-color:${ebSim.couponMustDeclare ? 'rgba(244,63,94,0.45)' : 'rgba(16,185,129,0.45)'}"><span>2026 Beyanname Vergin</span><strong class="${ebSim.couponMustDeclare ? 'neg' : 'pos'}">${fmtTL(ebSim.totalTaxTL)}</strong><small>${ebSim.couponMustDeclare ? `Dilim %${ebSim.topBracketPct}` : '%0 Vergi!'}</small></div>
              </div>
              <div class="ms-alert ${ebSim.couponMustDeclare ? 'warn' : 'ok'}" style="margin-bottom:0">
                ${ebSim.couponMustDeclare
                  ? `⚠️ <strong>400.000 ₺ Uçurumunu Geçtin!</strong> Aşan kısım değil, ${fmtTL(ebSim.annualCouponTL)} kuponun TAMAMI beyana girdi ve ${fmtTL(ebSim.totalTaxTL)} vergi doğdu. İtfaya kadar tutulan Eurobond’da anapara kur farkı vergisi ise 0 ₺’dir!`
                  : `🛡️ <strong>%0 Vergi Kalkanı!</strong> Yıllık kuponun 400.000 ₺ sınırının altında (başka beyan gelirin yoksa): 0 ₺ stopaj + 0 ₺ beyan vergisi!`}
              </div>
            </div>
          ` : (sim ? `
            <h2 style="margin:2px 0 4px;font-size:17px;font-weight:900">ABD Hisse / ETF: GVK Mükerrer 80 & "%10 Yİ-ÜFE Eşiği"</h2>
            <p style="margin:0 0 10px;font-size:12.8px;color:var(--ink-200)">ABD hissesi sattığında üretici enflasyonu (Yİ-ÜFE) <strong>%10’u geçtiyse</strong> maliyetin enflasyonla büyür! Kaydırıcıyı <strong>%9 → %11</strong> oynat:</p>

            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>Alış Maliyetin (TL Karşılığı)</span><strong id="aeLabGvkBuyLbl">${fmtTL(labGvkBuy)}</strong></div>
              <input type="range" class="ae-slider" id="aeLabGvkBuySl" min="100000" max="1500000" step="50000" value="${labGvkBuy}" />
            </div>
            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>Satış Tutarın (TL Karşılığı)</span><strong id="aeLabGvkSellLbl" class="pos">${fmtTL(labGvkSell)}</strong></div>
              <input type="range" class="ae-slider" id="aeLabGvkSellSl" min="150000" max="2500000" step="50000" value="${labGvkSell}" />
            </div>
            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>Aradaki Yİ-ÜFE Enflasyonu</span><strong id="aeLabGvkUfeLbl" class="${sim.yiUfeIndexed ? 'pos' : 'neg'}">%${labGvkUfe} ${sim.yiUfeIndexed ? '✓ (%10 Endeksleme AÇIK!)' : '✗ (%10 Altı — Endeksleme YOK!)'}</strong></div>
              <input type="range" class="ae-slider" id="aeLabGvkUfeSl" min="0" max="60" step="1" value="${labGvkUfe}" />
            </div>

            <div id="aeLabGvkLiveOut">
              <div class="ae-kpi-2x2" style="margin-bottom:10px">
                <div class="ms-kpi-box"><span>Endekslenmiş Maliyet</span><strong>${fmtTL(sim.indexedCostTL)}</strong><small>Vergi Matrahı: ${fmtTL(sim.taxableGainTL)}</small></div>
                <div class="ms-kpi-box" style="border-color:${sim.taxTL > 0 ? 'rgba(245,158,11,0.45)' : 'rgba(16,185,129,0.45)'}"><span>2026 Beyanname Vergin</span><strong class="${sim.taxTL > 0 ? 'warn-txt' : 'pos'}">${fmtTL(sim.taxTL)}</strong><small>2026 Tarife Dilimi: %${sim.topBracketPct}</small></div>
                <div class="ms-kpi-box"><span>Yİ-ÜFE %10 İle Kurtardığın</span><strong class="pos">+${fmtTL(sim.taxSavedByIndexTL)}</strong><small>Endekssiz vergi: ${fmtTL(sim.unindexedTaxTL)}</small></div>
                <div class="ms-kpi-box"><span>Cebinde Kalan Net Kâr</span><strong class="${sim.netProfitAfterTaxTL >= 0 ? 'pos' : 'neg'}">${sim.netProfitAfterTaxTL >= 0 ? '+' : ''}${fmtTL(sim.netProfitAfterTaxTL)}</strong><small>Mart & Temmuz 2 taksit</small></div>
              </div>

              <div class="ms-alert ${sim.yiUfeIndexed ? 'ok' : 'warn'}" style="margin-bottom:8px">
                ${sim.yiUfeIndexed
                  ? `🛡️ <strong>Endeksleme Kalkanı Devrede!</strong> Yİ-ÜFE %${labGvkUfe} (>= %10) olduğu için alış maliyetin ${fmtTL(sim.indexedCostTL)} sayıldı ve cebinde tam <strong>${fmtTL(sim.taxSavedByIndexTL)}</strong> fazladan kaldı!`
                  : `⚠️ <strong>%10 Eşiğini Kaçırdın!</strong> Yİ-ÜFE %${labGvkUfe} olduğu için devlet maliyetini hiç güncellemedi; nominal kur artışından bile vergi hesaplandı. Birkaç hafta bekleyip %10’u geçmek büyük avantaj sağlar!`}
              </div>
            </div>
            <div style="font-size:12px;color:var(--ink-400)">2026 Kademeli Tarife: 190 Bin’e kadar %15 · 400 Bin’e kadar %20 · 1 Mn’ye kadar %27 · 5,3 Mn’ye kadar %35 · Üstü %40.</div>
          ` : ''))}
        </section>
      `;
    }

    if (labToolId === 'BASKET') {
      const drop = G.simulateSingleBasketDrop
        ? G.simulateSingleBasketDrop({ capitalTL: 1000000, singleWeightPct: labBasketWeight, shockDropPct: labBasketDrop })
        : null;
      return `
        ${toolBar}
        ${drop ? `
          <section class="ae-lab-card">
            <span class="ms-sig-pill danger">🥚 Tüm Yumurtaları Tek Sepete Koyup Düşürme Testi</span>
            <h2 style="margin:6px 0 4px;font-size:17.5px;font-weight:900">İç Cız Etmesini Gerçek Para Kaybetmeden Yaşa</h2>
            <p style="margin:0 0 10px;font-size:13px;color:var(--ink-200)">1.000.000 ₺’nin yüzde kaçını tek bir sepete koyduğunu ve o sepetin bir krizde ne kadar düştüğünü seç; <strong>4 parçalı dengeli sepetle</strong> farkını gör:</p>

            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>Tek Sepete Koyduğun Pay</span><strong id="aeLabBasketWLbl" class="${labBasketWeight >= 60 ? 'neg' : 'pos'}">%${labBasketWeight} (${fmtCompactTL(1000000 * labBasketWeight / 100)})</strong></div>
              <input type="range" class="ae-slider" id="aeLabBasketWSl" min="15" max="100" step="5" value="${labBasketWeight}" />
            </div>
            <div class="ae-lab-slider-row">
              <div class="ae-lab-slider-head"><span>O Sepette Yaşanan Kriz Düşüşü</span><strong id="aeLabBasketDLbl" class="neg">-%${labBasketDrop}</strong></div>
              <input type="range" class="ae-slider" id="aeLabBasketDSl" min="15" max="75" step="5" value="${labBasketDrop}" />
            </div>

            <div id="aeLabBasketLiveOut">
              <div class="ae-kpi-2x2" style="margin-bottom:10px">
                <div class="ms-kpi-box" style="border-color:rgba(244,63,94,0.45)">
                  <span>Senin Kalan Paran</span>
                  <strong class="neg">${fmtTL(drop.endCapitalTL)}</strong>
                  <small>Kayıp: -${fmtTL(drop.netLossTL)} (-%${drop.netDropPct})</small>
                </div>
                <div class="ms-kpi-box" style="border-color:rgba(240,180,41,0.48)">
                  <span>Eski 1M’ye Dönmek İçin</span>
                  <strong class="warn-txt">+%${drop.recoveryNeededPct} Çıkmalı!</strong>
                  <small>Kayıp asimetrisi duvarı</small>
                </div>
                <div class="ms-kpi-box" style="border-color:rgba(16,185,129,0.45)">
                  <span>4 Parçalı Dengeli Sepet</span>
                  <strong class="pos">${fmtTL(drop.balEndTL)}</strong>
                  <small>Sadece -%${drop.balDropPct} etkilenir (+%${drop.balRecoveryPct} yeter)</small>
                </div>
                <div class="ms-kpi-box">
                  <span>Sepet Yapmanın Kurtardığı</span>
                  <strong class="pos">+${fmtTL(drop.savedByDiversifyingTL)}</strong>
                  <small>Aynı fırtınada uykun bozulmaz</small>
                </div>
              </div>

              <div class="ms-alert ${drop.recoveryNeededPct >= 40 ? 'err' : 'ok'}" style="margin-bottom:0">
                ${drop.recoveryNeededPct >= 40
                  ? `🚨 <strong>İşte o iç cız etmesi:</strong> Tek sepetin -%${labBasketDrop} düşünce paran ${fmtTL(drop.endCapitalTL)}’ye indi ve sadece eski parana dönmen için tam <strong>+%${drop.recoveryNeededPct}</strong> kazanman gerekiyor!`
                  : `🛡️ <strong>Huzurlu Denge:</strong> Tek sepete aşırı yüklenmediğin için büyük şokta bile sadece -%${drop.netDropPct} etkilendin; birkaç ayda toparlanıp yoluna devam edersin.`}
              </div>
            </div>
          </section>
        ` : ''}
      `;
    }

    if (labToolId === 'FREEDOM') {
      const fw = G.computeFreedomWheelProjection
        ? G.computeFreedomWheelProjection({
            startCapitalTL: Math.max(100000, Math.round(snap.totalNetWorthTL || 1000000)),
            monthlyAddTL: fwMonthlyAddTL,
            realAnnualReturnPct: fwRealReturnPct,
            monthlyExpenseTL: fwMonthlyExpTL,
            years: fwYears
          })
        : null;
      return `
        ${toolBar}
        ${fw ? `
          <section class="ae-lab-card" style="border-color:rgba(16,185,129,0.38)">
            <span class="ms-sig-pill good">🌊 Küçük Damlalardan Koca Nehre · Kendi Özgürlük Çarkın</span>
            <h2 style="margin:6px 0 4px;font-size:17.5px;font-weight:900">Düzenli Birikim & Enflasyonsuz Bileşik Getiri</h2>
            <p style="margin:0 0 10px;font-size:13px;color:var(--ink-200)">Bugünkü alım gücüyle her ay kenara koyduğun küçük damlaların ne zaman aylık geçim masrafını tek başına ödeyeceğini hesapla:</p>

            <div style="font-size:12px;font-weight:800;color:var(--ink-400);margin-bottom:5px">Aylık Eklenen Birikim (Bugünkü ₺):</div>
            <div class="ae-hscroll" style="margin-bottom:8px">
              ${[0, 5000, 15000, 30000, 50000].map((v) => `<button type="button" class="ae-chip ${fwMonthlyAddTL === v ? 'active' : ''}" data-lab-fw-add="${v}">${v === 0 ? '0 ₺ (Sadece 1M)' : '+' + (v / 1000) + ' Bin ₺/ay'}</button>`).join('')}
            </div>

            <div style="font-size:12px;font-weight:800;color:var(--ink-400);margin-bottom:5px">Enflasyon Üstü Yıllık Reel Getiri & Aylık Geçim Hedefin:</div>
            <div class="ae-hscroll" style="margin-bottom:10px">
              ${[6, 10, 14, 18].map((r) => `<button type="button" class="ae-chip sub ${fwRealReturnPct === r ? 'active' : ''}" data-lab-fw-ret="${r}">Reel +%${r}/yıl</button>`).join('')}
              ${[35000, 55000, 85000].map((ex) => `<button type="button" class="ae-chip sub ${fwMonthlyExpTL === ex ? 'active' : ''}" data-lab-fw-exp="${ex}">Gider ${(ex / 1000)} Bin ₺</button>`).join('')}
            </div>

            <div class="ae-kpi-2x2" style="margin-bottom:10px">
              <div class="ms-kpi-box"><span>${fwYears}. Yıl Gerçek Kasa</span><strong>${fmtCompactTL(fw.finalRealVaultTL)}</strong><small>Bugünkü alım gücüyle</small></div>
              <div class="ms-kpi-box"><span>Aylık Pasif Gelir Nehri</span><strong class="pos">+${fmtTL(fw.finalMonthlyPassiveRealTL)}/ay</strong><small>${fw.freedomYears != null ? `🎯 ${fw.freedomYears}. yılda %100 Özgür!` : `Giderinin %${fw.finalCoveragePct}’si`}</small></div>
            </div>

            <div style="display:grid;gap:6px">
              ${fw.milestones.filter((m) => m.year === 1 || m.year === 3 || m.year === 5 || m.year === 8 || m.year === 10).map((ms) => `
                <div style="display:flex;align-items:center;gap:8px;font-size:12.4px">
                  <strong style="width:46px;color:var(--ink-400)">${ms.year}. Yıl</strong>
                  <div class="ms-bar-track" style="flex:1;height:8px"><div class="ms-bar-fill ${ms.expenseCoveragePct >= 100 ? 'green' : 'amber'}" style="width:${Math.min(100, ms.expenseCoveragePct)}%"></div></div>
                  <strong style="min-width:112px;text-align:right" class="${ms.expenseCoveragePct >= 100 ? 'pos' : ''}">+${fmtCompactTL(ms.monthlyPassiveRealTL)} (%${ms.expenseCoveragePct})</strong>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      `;
    }

    // DETECTIVE (Varsayılan Laboratuvar Oyunu)
    const round = G.generateLiveKasaDuelRound ? G.generateLiveKasaDuelRound(detectiveSeed) : null;
    const hitPct = detStats.played > 0 ? Math.round((detStats.wins / detStats.played) * 100) : 0;
    if (!round) {
      return `${toolBar}<div class="ae-card">Canlı bilanço havuzu yükleniyor...</div>`;
    }
    const revealed = detectivePickedSide === 'LEFT' || detectivePickedSide === 'RIGHT';
    const userWon = revealed && detectivePickedSide === round.optimalSide;

    const renderSideCard = (sideKey, cardObj) => {
      const isOpt = round.optimalSide === sideKey;
      const isPicked = detectivePickedSide === sideKey;
      const cardCls = revealed ? (isOpt ? 'won' : 'lost') : '';
      return `
        <div class="ae-detective-card ${cardCls}">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;margin-bottom:6px">
              <span class="ms-asset-code">${revealed ? esc(cardObj.reveal.ticker) : esc(cardObj.codeLabel)}</span>
              ${revealed ? `<span class="ae-fscore-tag ${cardObj.reveal.forensicScore >= 75 ? 'good' : 'low'}">${cardObj.reveal.forensicScore}p</span>` : '<span class="ms-sig-pill neutral">Gizli BIST</span>'}
            </div>
            ${revealed ? `
              <div style="font-size:13.6px;font-weight:900;margin-bottom:4px;line-height:1.25">${esc(cardObj.reveal.name)}</div>
              <div style="font-size:11.6px;color:var(--ink-400);margin-bottom:7px">${esc(cardObj.reveal.sector || 'Borsa İstanbul')} · ${fmtUnitTL(cardObj.reveal.priceTL)}</div>
            ` : ''}

            <div style="display:grid;gap:6px">
              ${cardObj.clues.map((cl) => `
                <div style="background:var(--surface-1);border:1px solid var(--line-subtle);border-radius:10px;padding:7px 9px">
                  <span style="display:block;font-size:10.8px;color:var(--ink-400);font-weight:700">${esc(cl.k)}</span>
                  <strong style="font-size:12.6px;color:var(--ink-100)">${esc(cl.v)}</strong>
                </div>
              `).join('')}
            </div>
          </div>

          ${!revealed ? `
            <button type="button" class="ms-btn primary" style="width:100%;padding:11px;margin-top:4px" data-det-pick="${sideKey}">
              🔍 ${esc(cardObj.codeLabel)} Sağlam!
            </button>
          ` : `
            <div style="display:grid;gap:6px;margin-top:4px">
              <span class="ms-sig-pill ${isOpt ? 'good' : 'danger'}" style="justify-content:center;text-align:center">
                ${isOpt ? '🏆 Gerçek Kasa Kalesi' : '⚠️ Nakit/Borç Tuzağı'} ${isPicked ? '(Seçimin)' : ''}
              </span>
              <button type="button" class="ms-btn sm" style="width:100%" data-open-asset="${esc(cardObj.reveal.key)}">Fırın Kasasını Aç</button>
            </div>
          `}
        </div>
      `;
    };

    return `
      ${toolBar}
      <section class="ae-hero-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <div>
            <span class="ms-sig-pill warn">⚔️ Canlı Kasa Dedektifi · Kör Bilanço Düellosu</span>
            <h2 style="margin:5px 0 3px;font-size:17.5px;font-weight:900">İsimlere Bakma, Kasadaki Gerçek Nakdi Bul!</h2>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <strong style="font-size:19px;color:var(--gold-bright)">🔥 ${detStats.streak}</strong>
            <small style="display:block;font-size:11px;color:var(--ink-400)">İsabet %${hitPct} (${detStats.wins}/${detStats.played})</small>
          </div>
        </div>
        <p style="margin:5px 0 8px;font-size:13px;color:var(--ink-200);line-height:1.45">
          Aşağıdaki iki kart şu an Borsa İstanbul’da işlem gören <strong>iki gerçek şirketin</strong> canlı kasası. Biri sıcak para basan kale, diğeri kâğıt kâr/borç tuzağı. Hangisine ortak olursun?
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:2px">
          <button type="button" class="ae-term-pill" data-explain-term="OCF">Esas Nakit (OCF) nedir?</button>
          <button type="button" class="ae-term-pill" data-explain-term="Net Borç / FAVÖK">Borç Yükü nedir?</button>
          <button type="button" class="ae-term-pill" data-explain-term="PD / DD">PD/DD nedir?</button>
        </div>
      </section>

      <div class="ae-detective-grid">
        ${renderSideCard('LEFT', round.left)}
        ${renderSideCard('RIGHT', round.right)}
      </div>

      ${revealed ? `
        <section class="ae-card" style="border-color:${userWon ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.5)'}">
          <div class="ms-alert ${userWon ? 'ok' : 'warn'}" style="margin-bottom:10px">
            <strong>${userWon ? '🎯 Keskin Göz! Kasa Kalesini Şıp Diye Yakaladın:' : '🧐 Kağıt Kâr İlüzyonuna Dikkat — İşte Gerçek Tablo:'}</strong>
            <div style="margin-top:6px">${esc(round.whyWinner)}</div>
            <div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--line-subtle)">${esc(round.whyLoser)}</div>
          </div>
          <button type="button" class="ae-big-btn gold" style="width:100%" id="aeNextDetectiveRoundBtn">
            Sonraki Kör Bilanço Düellosu →
          </button>
        </section>
      ` : ''}
    `;
  }

  function renderMasteryTab(host) {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const member = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(member);
    const mastery = K.evaluateInvestorMastery(member, snap);
    const idle = member.idleErosionLog || { cumulativeInflationLossTL: 0, missedSukukNetTL: 0 };
    const arch = mastery.archetype || { title: 'Piyasa Gözcüsü', motto: '', strength: '', blindSpot: '' };
    const allCases = G.getFieldCaseCatalog ? G.getFieldCaseCatalog() : [];
    const solvedCount = Object.values(member.completedFieldCases || {}).filter((c) => c && c.isOptimal).length;
    const detStats = member.detectiveStats || { played: 0, wins: 0, streak: 0, bestStreak: 0 };
    const studiedModCount = Array.isArray(member.studiedAcademyIds) ? member.studiedAcademyIds.length : 0;

    let subBodyHtml = '';

    if (masterySubTab === 'LABS' || masterySubTab === 'DETECTIVE') {
      subBodyHtml = renderInteractiveLabsHtml(member, snap);
    } else if (masterySubTab === 'CASES') {
      const cats = ['ALL', ...Array.from(new Set(allCases.map((c) => c.category)))];
      const byDiff = caseDiffFilter === 'ALL' ? allCases : allCases.filter((c) => (c.difficulty || 'Orta') === caseDiffFilter);
      const shownCases = caseFilterCat === 'ALL' ? byDiff : byDiff.filter((c) => c.category === caseFilterCat);
      const solvePct = allCases.length > 0 ? Math.round((solvedCount / allCases.length) * 100) : 0;

      subBodyHtml = `
        <section class="ae-hero-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px">
            <div>
              <span class="ms-sig-pill info">3 Seviyeli Gerçek Piyasa Karar Meydanı</span>
              <h2 style="margin:5px 0 2px;font-size:18px;font-weight:900">${allCases.length} Gerçek Saha Vakası</h2>
            </div>
            <strong style="font-size:21px;font-weight:900;color:var(--gold-bright)">${solvedCount}/${allCases.length}</strong>
          </div>
          <p style="margin:0 0 9px;font-size:13px;color:var(--ink-200)">Yeni başlıyorsan <strong>🌱 Başlangıç</strong> vakalarından başla; ustalaştıkça <strong>🧭 Orta</strong> ve <strong>🦅 Uzman</strong> seviyelerine geç!</p>
          <div class="ms-bar-track" style="height:8px;margin-bottom:10px">
            <div class="ms-bar-fill green" style="width:${solvePct}%"></div>
          </div>

          <div class="ae-hscroll" style="margin-bottom:6px">
            <button type="button" class="ae-chip ${caseDiffFilter === 'ALL' ? 'active' : ''}" data-cdiff="ALL">Tümü (${allCases.length})</button>
            <button type="button" class="ae-chip ${caseDiffFilter === 'Temel' ? 'active' : ''}" data-cdiff="Temel">🌱 Başlangıç</button>
            <button type="button" class="ae-chip ${caseDiffFilter === 'Orta' ? 'active' : ''}" data-cdiff="Orta">🧭 Orta</button>
            <button type="button" class="ae-chip ${caseDiffFilter === 'Uzman' ? 'active' : ''}" data-cdiff="Uzman">🦅 Uzman</button>
          </div>

          <div class="ae-hscroll" id="aeCaseCatScroll" style="padding-bottom:0">
            ${cats.map((ct) => `
              <button type="button" class="ae-chip sub ${caseFilterCat === ct ? 'active' : ''}" data-ccat="${esc(ct)}">${ct === 'ALL' ? 'Tüm Konular' : esc(ct)}</button>
            `).join('')}
          </div>
        </section>

        ${shownCases.length === 0 ? `<div class="ae-card" style="text-align:center;color:var(--ink-400)">Bu seviye ve konu birleşiminde vaka yok; "Tümü" seçeneğine dokunabilirsin.</div>` : ''}

        ${shownCases.slice(0, casesVisibleLimit).map((cs) => {
          const attempt = member.completedFieldCases?.[cs.id] || null;
          const pickedObj = attempt ? cs.choices.find((x) => x.id === attempt.choiceId) : null;
          const optimalObj = cs.choices.find((x) => x.isOptimal);
          const diffTone = cs.difficulty === 'Temel' ? 'good' : (cs.difficulty === 'Uzman' ? 'warn' : 'info');
          return `
            <article class="ae-case-card ${attempt?.isOptimal ? 'solved-ok' : ''}">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px">
                <div style="display:flex;gap:6px;align-items:center">
                  <span class="ms-sig-pill ${diffTone}">${cs.difficulty === 'Temel' ? '🌱 Başlangıç' : (cs.difficulty === 'Uzman' ? '🦅 Uzman' : '🧭 Orta')}</span>
                  <span class="ms-sig-pill neutral">${esc(cs.category)}</span>
                </div>
                ${attempt ? `<span class="ms-sig-pill ${attempt.isOptimal ? 'good' : 'warn'}">${attempt.isOptimal ? '✓ Usta Kararı' : '↻ Tekrar Dene'}</span>` : '<span class="ms-sig-pill neutral">Çözülmedi</span>'}
              </div>
              <h3 style="margin:0 0 7px;font-size:15.5px;font-weight:800;line-height:1.34">${esc(cs.title)}</h3>
              <p style="margin:0 0 8px;font-size:13.4px;color:var(--ink-200);line-height:1.5">${esc(cs.situation)}</p>
              <div style="font-size:13.4px;font-weight:800;color:var(--gold-bright)">❓ ${esc(cs.question)}</div>

              <div class="ae-choice-stack">
                ${cs.choices.map((ch) => {
                  const isPicked = attempt && attempt.choiceId === ch.id;
                  const cls = isPicked ? (ch.isOptimal ? 'picked-right' : 'picked-wrong') : '';
                  return `
                    <button type="button" class="ae-choice-btn ${cls}" data-case-id="${esc(cs.id)}" data-choice-id="${esc(ch.id)}" data-optimal="${ch.isOptimal ? '1' : '0'}">
                      <span class="ae-choice-key">${esc(ch.id)}</span>
                      <span>${esc(ch.label)}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              ${attempt ? `
                <div class="ms-alert ${attempt.isOptimal ? 'ok' : 'warn'}" style="margin-top:10px;margin-bottom:8px">
                  ${pickedObj?.why ? `<div style="margin-bottom:6px"><strong>${attempt.isOptimal ? `🎯 Seçimin (${pickedObj.id}):` : `⚠️ Neden ${pickedObj.id} Şıkkı Tuzaktı:`}</strong> ${esc(pickedObj.why)}</div>` : ''}
                  ${!attempt.isOptimal && optimalObj?.why ? `<div style="margin-bottom:6px;color:var(--green-ink)"><strong>✓ Doğru Hamle (${optimalObj.id}):</strong> ${esc(optimalObj.why)}</div>` : ''}
                  <div><strong>100B ₺ Gerçek Piyasa Sonucu:</strong> ${esc(cs.consequence100k)}</div>
                  <div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--line-subtle);color:var(--ink-100)">
                    ${esc(cs.proRule)}
                  </div>
                </div>
                <div class="ae-hscroll" style="padding-bottom:0">
                  ${(cs.linkedKeys || []).map((lk) => {
                    const a = K.getAsset(lk);
                    return a ? `<button type="button" class="ae-chip sub" data-open-asset="${esc(a.key)}">${esc(a.ticker)} · Canlı İncele</button>` : '';
                  }).join('')}
                </div>
              ` : ''}
            </article>
          `;
        }).join('')}
        ${shownCases.length > casesVisibleLimit ? `
          <button type="button" class="ms-btn primary sm" style="width:100%;margin-top:8px" id="aeShowMoreCasesBtn">
            Sonraki Vakaları Göster (${Math.min(casesVisibleLimit, shownCases.length)} / ${shownCases.length})
          </button>
        ` : ''}
      `;
    } else if (masterySubTab === 'MANUAL') {
      subBodyHtml = `
        <div class="ae-search-bar" style="margin:0 0 10px">
          <div class="ae-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="7.5"/><path d="M20 20l-3.8-3.8"/>
            </svg>
            <input id="aeManualSearchInp" class="ae-input" type="search" autocomplete="off" value="${esc(manualSearchQuery)}" placeholder="Konu veya terim ara: Stopaj, Altın, TMS-29, GVK 80, Sukuk..." />
            <button type="button" id="aeClearManualSearchBtn" class="ae-clear-btn" ${manualSearchQuery ? '' : 'hidden'} aria-label="Temizle">×</button>
          </div>
        </div>
        <div id="aeManualResultsRegion">
          ${buildManualAndLexiconRegionHtml()}
        </div>
      `;
    } else {
      // MIRROR: Karnem, 6 Basamaklı Ustalık Yolculuğu & Kasa Doktoru
      const maxBench = Math.max(snap.totalNetWorthTL, snap.ifAllGoldTL, snap.ifAllDepositNetTL, snap.ifAllBist100TL, snap.inflationTargetTL, 1000000);
      const pctBar = (v) => Math.max(10, Math.round((v / maxBench) * 100));
      const doc = G.evaluatePortfolioDoctor ? G.evaluatePortfolioDoctor(member, snap) : null;
      const imp = K.evaluateImpatienceLedger ? K.evaluateImpatienceLedger(member) : { missedUpsideTotalTL: 0, savedDownsideTotalTL: 0, decisions: [] };

      const drillDone = Object.keys(member.completedDrills || {}).length;
      const journeySteps = [
        { n: 1, name: 'Pazar Sezgisi', done: Boolean(member.livedMilestones?.inspectedCashScale || solvedCount >= 1), hint: '1 şirketin Kasa Röntgenini incele veya ilk vakayı çöz.' },
        { n: 2, name: 'Vergi & Emir', done: Boolean(member.livedMilestones?.executedRealOrder || member.livedMilestones?.usedLimitOrStop || studiedModCount >= 2), hint: 'İlk gerçek yatırım/Limit emrini ver veya 2 akademi modülü tamamla.' },
        { n: 3, name: 'Fırın Kasası', done: detStats.wins >= 2 || solvedCount >= 5, hint: 'Kasa Dedektifinde 2 isabet yap veya 5 saha vakası çöz.' },
        { n: 4, name: 'Fırtına Tatbikatı', done: drillDone >= 1 || solvedCount >= 10 || studiedModCount >= 6, hint: 'Atölyede 1 Çok Aşamalı Karar Tatbikatı tamamla veya 10 vaka çöz.' },
        { n: 5, name: 'Adli & Makro', done: drillDone >= 3 || solvedCount >= 18 || studiedModCount >= 12, hint: '3 Karar Tatbikatı tamamla veya 18 vaka / 12 akademi modülü bitir.' },
        { n: 6, name: 'Özgür Yatırımcı', done: drillDone >= 4 && solvedCount >= 25 && studiedModCount >= 14, hint: '4 Tatbikat + 25 Saha Vakası + 14 Akademi Modülü ile tam ustalık!' }
      ];
      let foundCurrent = false;
      const renderedJourney = journeySteps.map((st) => {
        let cls = '';
        if (st.done) cls = 'done';
        else if (!foundCurrent) { cls = 'current'; foundCurrent = true; }
        return `
          <button type="button" class="ae-journey-node ${cls}" data-jstep-hint="${esc(st.name + ': ' + st.hint)}">
            <div style="font-size:15px">${st.done ? '✅' : (cls === 'current' ? '🎯' : '🔒')}</div>
            <strong style="display:block;font-size:11.6px;margin-top:2px;color:var(--ink-100)">${st.n}. ${esc(st.name)}</strong>
          </button>
        `;
      }).join('');

      subBodyHtml = `
        <!-- 0. 6 BASAMAKLI USTALIK YOLCULUĞUM -->
        <section class="ae-hero-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px">
            <div>
              <span class="ms-sig-pill info">Yatırımcı Ustalık Aynası</span>
              <h2 style="margin:5px 0 0;font-size:19.5px;font-weight:900">${esc(mastery.rankTitle)}</h2>
            </div>
            <div style="text-align:right">
              <strong style="font-size:30px;font-weight:900;color:var(--gold-bright)">${mastery.overallScore}</strong><span style="font-size:13px;color:var(--ink-400)">/100</span>
            </div>
          </div>

          <div class="ae-journey-grid">${renderedJourney}</div>

          ${renderMasteryHexagonSvg(mastery.axes)}

          <div class="ms-alert info" style="margin-bottom:8px;margin-top:8px">
            <strong>Görmüş Geçirmiş Dostun Notu:</strong> ${esc(mastery.mentorVoice)}
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="ms-btn primary sm" style="flex:1" id="aeJumpToLabsFromMirror">🧪 İnteraktif Laboratuvara Gir</button>
            <button type="button" class="ms-btn sm" style="flex:1" id="aeJumpToCasesFromMirror">🎯 Vaka Çöz (${solvedCount}/${allCases.length})</button>
          </div>
        </section>

        <!-- 2. 1M PORTFÖY KASA DOKTORU & GERÇEK İŞLETME GÜCÜ -->
        ${doc ? `
          <section class="ae-card" style="border-color:rgba(56,189,248,0.32)">
            <span class="ms-sig-pill info">1M Portföy Kasa Doktoru · Neye Ortaksın?</span>
            <h3 style="margin:6px 0 4px;font-size:16px;font-weight:800">Ortak Olduğun Kasaların Senin Payına Ürettiği Güç</h3>
            <p style="margin:0 0 10px;font-size:12.8px;color:var(--ink-400)">Ekran fiyatı her gün iner çıkar; asıl zenginlik ortak olduğun şirketlerin ve sabit dilimlerin senin payına ürettiği gerçek nakittir:</p>
            <div class="ae-kpi-2x2" style="margin-bottom:8px">
              <div class="ms-kpi-box">
                <span>Yıllık Kasa & Faiz Motorun</span>
                <strong style="font-size:15px" class="${doc.totalAnnualCashEngineTL >= 0 ? 'pos' : 'neg'}">${doc.totalAnnualCashEngineTL >= 0 ? '+' : ''}${Math.abs(doc.totalAnnualCashEngineTL) >= 1000000 ? fmtCompactTL(doc.totalAnnualCashEngineTL) : fmtTL(doc.totalAnnualCashEngineTL)}/yıl</strong>
                <small>Günde ~${doc.dailyCashEngineTL >= 0 ? '+' : ''}${doc.dailyCashEngineTL.toLocaleString('tr-TR')} ₺ üretim</small>
              </div>
              <div class="ms-kpi-box">
                <span>Şirket Serbest Nakit Payın</span>
                <strong style="font-size:15px" class="${doc.annualPartnerFcfTL >= 0 ? 'pos' : 'warn-txt'}">${doc.annualPartnerFcfTL >= 0 ? '+' : ''}${Math.abs(doc.annualPartnerFcfTL) >= 1000000 ? fmtCompactTL(doc.annualPartnerFcfTL) : fmtTL(doc.annualPartnerFcfTL)}/yıl</strong>
                <small>Yatırım sonrası saf FCF</small>
              </div>
              <div class="ms-kpi-box">
                <span>Doğal Döviz / Altın Zırhı</span>
                <strong>%${doc.fxNaturalShieldPct}</strong>
                <small>32G USD Başabaş: ${doc.breakevenUsd32d} ₺</small>
              </div>
              <div class="ms-kpi-box">
                <span>Ağırlıklı Hisse Çarpanı</span>
                <strong>${doc.weightedPe != null ? `F/K ${doc.weightedPe}x` : 'Hisse Yok'}</strong>
                <small>${doc.weightedPb != null ? `Ort. PD/DD: ${doc.weightedPb}x` : 'Nakit / Sabit ağırlıklı'}</small>
              </div>
            </div>
            ${doc.warnings.map((w) => `<div class="ms-alert warn" style="margin:6px 0 0">${esc(w)}</div>`).join('')}
          </section>
        ` : ''}

        <!-- 3. KENDİ YOĞURT YİYİŞİN (KARAKTER ARKETİPİ) -->
        <section class="ae-card">
          <span class="ms-sig-pill warn">Kendi Yoğurt Yiyişin · Yatırımcı Karakterin</span>
          <h3 style="margin:6px 0 2px;font-size:16.5px;font-weight:800">${esc(arch.title)}</h3>
          <div style="font-size:13px;color:var(--gold-bright);font-weight:700;margin-bottom:8px">"${esc(arch.motto)}"</div>
          <div class="ae-kpi-2x2" style="margin-bottom:0">
            <div class="ms-kpi-box">
              <span class="pos">Güçlü Kasın</span>
              <div style="font-size:12.8px;font-weight:600;color:var(--ink-200)">${esc(arch.strength)}</div>
            </div>
            <div class="ms-kpi-box">
              <span class="warn-txt">Kör Noktan</span>
              <div style="font-size:12.8px;font-weight:600;color:var(--ink-200)">${esc(arch.blindSpot)}</div>
            </div>
          </div>
        </section>

        <!-- 4. SABIR KANITI & SABIRSIZLIK AYNASI -->
        <section class="ae-card">
          <h3 style="margin:0 0 4px;font-size:16px;font-weight:800">Huzurlu Büyüme vs Ekran Nöbeti Kanıtı</h3>
          <p style="margin:0 0 10px;font-size:12.6px;color:var(--ink-400)">Sürekli al-sat yapmak gerçekten kazandırdı mı, yoksa ilk sağlam sepeti hiç kurcalamamak daha mı huzurluydu?</p>

          <div class="ms-bar-row">
            <div class="ms-bar-label"><span>Senin Portföyün</span><span>${fmtTL(snap.totalNetWorthTL)}</span></div>
            <div class="ms-bar-track"><div class="ms-bar-fill" style="width:${pctBar(snap.totalNetWorthTL)}%"></div></div>
          </div>
          ${snap.ghostHoldNetWorthTL != null ? `
            <div class="ms-bar-row">
              <div class="ms-bar-label"><span>İlk Kurduğun Sepete Hiç Dokunmasaydın</span><span>${fmtTL(snap.ghostHoldNetWorthTL)}</span></div>
              <div class="ms-bar-track"><div class="ms-bar-fill purple" style="width:${pctBar(snap.ghostHoldNetWorthTL)}%"></div></div>
            </div>
          ` : ''}
          <div class="ms-bar-row">
            <div class="ms-bar-label"><span>1M Tamamı Fiziki Gram Altın Olsaydı</span><span>${fmtTL(snap.ifAllGoldTL)}</span></div>
            <div class="ms-bar-track"><div class="ms-bar-fill amber" style="width:${pctBar(snap.ifAllGoldTL)}%"></div></div>
          </div>
          <div class="ms-bar-row">
            <div class="ms-bar-label"><span>1M Tamamı Net Mevduatta Olsaydı</span><span>${fmtTL(snap.ifAllDepositNetTL)}</span></div>
            <div class="ms-bar-track"><div class="ms-bar-fill green" style="width:${pctBar(snap.ifAllDepositNetTL)}%"></div></div>
          </div>

          ${imp.decisions.length > 0 ? `
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line-subtle)">
              <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.6px;font-weight:800;margin-bottom:6px">
                <span>🪞 Sattıktan Sonra Ne Oldu? (Sabırsızlık Aynası)</span>
                <span>
                  ${imp.missedUpsideTotalTL > 0 ? `<small class="warn-txt">Erken Satış: -${fmtCompactTL(imp.missedUpsideTotalTL)}</small>` : ''}
                  ${imp.savedDownsideTotalTL > 0 ? ` <small class="pos">Doğru Çıkış: +${fmtCompactTL(imp.savedDownsideTotalTL)}</small>` : ''}
                </span>
              </div>
              <div class="ms-list">
                ${imp.decisions.slice(0, 4).map((d) => `
                  <div class="ms-list-row" style="padding:8px 10px;font-size:12.4px">
                    <span><strong>${esc(d.ticker)}</strong> (${fmtUnitTL(d.soldPriceTL)} -> ${fmtUnitTL(d.currentPriceTL)})</span>
                    <strong class="${d.kind === 'SAVED_DOWNSIDE' ? 'pos' : 'warn-txt'}">
                      ${d.kind === 'SAVED_DOWNSIDE' ? `Doğru Çıkış (+${fmtTL(d.diffTL)} korundu)` : `Sabırsızlık (-${fmtTL(d.diffTL)} kaçtı)`}
                    </strong>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </section>

        <!-- 5. SESSİZ FIRSAT MALİYETİ & ARAŞTIRMA vs DEDİKODU KARNESİ -->
        <div class="ae-two-col">
          <section class="ae-card">
            <h3 style="margin:0 0 8px;font-size:15.5px;font-weight:800">Sessizce Biriken Fırsat & Makas Kaybı</h3>
            <div class="ae-kpi-2x2" style="margin-bottom:0">
              <div class="ms-kpi-box">
                <span>Boş Nakit Enflasyon Erimesi</span>
                <strong class="neg">-${fmtTL(idle.cumulativeInflationLossTL)}</strong>
                <small>Kaçan %0 Vergili Sukuk: +${fmtTL(idle.missedSukukNetTL)}</small>
              </div>
              <div class="ms-kpi-box">
                <span>Yanan Makas, Komisyon & Ceza</span>
                <strong class="neg">-${fmtTL(snap.totalFrictionBurnedTL)}</strong>
                <small>Sabırsızlık ve gişe sürtünmesi</small>
              </div>
            </div>
          </section>

          <section class="ae-card">
            <h3 style="margin:0 0 8px;font-size:15.5px;font-weight:800">Araştırma vs Dedikodu/Heyecan Karnesi</h3>
            <div class="ae-kpi-2x2" style="margin-bottom:0">
              <div class="ms-kpi-box">
                <span>📊 Kasa & Makro İnceleyerek (${mastery.researchVsRumor.researchCount})</span>
                <strong style="font-size:14.6px" class="${(mastery.researchVsRumor.researchAvgPct || 0) >= 0 ? 'pos' : 'neg'}">
                  ${mastery.researchVsRumor.researchAvgPct != null ? `${mastery.researchVsRumor.researchAvgPct >= 0 ? '+' : ''}%${mastery.researchVsRumor.researchAvgPct}` : 'Bekleniyor'}
                </strong>
                <small>KAP: ${mastery.studiedDisclosureCount || 0} · Dedektif: ${detStats.wins}</small>
              </div>
              <div class="ms-kpi-box">
                <span>🔥 Duyum & Sürü Coşkusu (${mastery.researchVsRumor.rumorCount})</span>
                <strong style="font-size:14.6px" class="${(mastery.researchVsRumor.rumorAvgPct || 0) >= 0 ? 'pos' : 'neg'}">
                  ${mastery.researchVsRumor.rumorAvgPct != null ? `${mastery.researchVsRumor.rumorAvgPct >= 0 ? '+' : ''}%${mastery.researchVsRumor.rumorAvgPct}` : '0 İşlem (Temiz)'}
                </strong>
                <small>İncelemeden atlanan işlemler</small>
              </div>
            </div>
          </section>
        </div>

        <!-- 6. YAŞANMIŞ TECRÜBE İZLERİ & SIFIRLAMA -->
        <section class="ae-card">
          <h3 style="margin:0 0 8px;font-size:15.5px;font-weight:800">Yaşanmış Piyasa Tecrübe İzleri</h3>
          ${(member.footprints || []).length > 0 ? `
            <div class="ms-list" style="margin-bottom:12px">
              ${member.footprints.map((fp) => `
                <div class="ms-list-row">
                  <div style="min-width:0;flex:1">
                    <strong style="font-size:13.6px">${esc(fp.title)}</strong>
                    <div style="font-size:12.4px;color:var(--ink-400)">${esc(fp.detail)}</div>
                  </div>
                  ${fp.leakTL > 0 ? `<strong class="neg">-${fmtTL(fp.leakTL)}</strong>` : ''}
                </div>
              `).join('')}
            </div>
          ` : `<div style="font-size:13px;color:var(--ink-400);margin-bottom:12px">Henüz ağır bir makas, panik satışı veya erken vade bozumu hatası yapmadın.</div>`}

          <div style="padding-top:12px;border-top:1px solid var(--line-subtle);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <button type="button" class="ms-btn sm" id="aeOpenProfFromMastery">Profil & Maaş Ayarları</button>
            <button type="button" class="ms-btn danger sm" id="msReset1MBtn">1.000.000 ₺ Baştan Başlat</button>
          </div>
        </section>
      `;
    }

    const activeMasterySeg = masterySubTab === 'DETECTIVE' ? 'LABS' : masterySubTab;

    host.innerHTML = `
      <div class="ae-seg" role="tablist">
        <button type="button" class="ae-seg-btn ${activeMasterySeg === 'MIRROR' ? 'active' : ''}" data-msub="MIRROR">Karnem</button>
        <button type="button" class="ae-seg-btn ${activeMasterySeg === 'LABS' ? 'active' : ''}" data-msub="LABS">Atölye</button>
        <button type="button" class="ae-seg-btn ${activeMasterySeg === 'CASES' ? 'active' : ''}" data-msub="CASES">Vakalar (${solvedCount})</button>
        <button type="button" class="ae-seg-btn ${activeMasterySeg === 'MANUAL' ? 'active' : ''}" data-msub="MANUAL">Akademi</button>
      </div>
      ${subBodyHtml}
    `;

    host.querySelectorAll('[data-msub]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        masterySubTab = b.getAttribute('data-msub') || 'MIRROR';
        renderMasteryTab(host);
      });
    });

    document.getElementById('aeJumpToLabsFromMirror')?.addEventListener('click', () => {
      AetherNative.haptic('light');
      masterySubTab = 'LABS';
      renderMasteryTab(host);
    });
    document.getElementById('aeJumpToCasesFromMirror')?.addEventListener('click', () => {
      AetherNative.haptic('light');
      masterySubTab = 'CASES';
      renderMasteryTab(host);
    });

    // Laboratuvar etkileşimleri
    host.querySelectorAll('[data-jstep-hint]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        AetherNative.toast(b.getAttribute('data-jstep-hint'), 'info');
      });
    });
    document.getElementById('aeShowMoreCasesBtn')?.addEventListener('click', () => {
      AetherNative.haptic('selection');
      casesVisibleLimit += 12;
      renderMasteryTab(host);
    });
    host.querySelectorAll('[data-drill-pick]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        activeDrillId = b.getAttribute('data-drill-pick') || 'drill_tcmb_thursday';
        drillStageIdx = 0;
        drillCapitalTL = 1000000;
        drillScore = 0;
        drillPickedChoice = null;
        drillHistory = [];
        renderMasteryTab(host);
      });
    });
    host.querySelectorAll('[data-drill-choice]').forEach((b) => {
      b.addEventListener('click', () => {
        if (drillPickedChoice) return;
        const drills = G.getInteractiveDecisionDrills ? G.getInteractiveDecisionDrills() : [];
        const curDrill = drills.find((d) => d.id === activeDrillId) || drills[0];
        const stg = curDrill?.stages?.[drillStageIdx];
        const ch = stg?.choices?.find((x) => x.id === b.getAttribute('data-drill-choice'));
        if (!ch) return;
        drillPickedChoice = ch;
        drillCapitalTL = Math.max(100000, drillCapitalTL + (Number(ch.deltaTL) || 0));
        drillScore = Math.min(100, drillScore + (Number(ch.score) || 0));
        drillHistory.push({ clock: stg.clock, choiceId: ch.id, deltaTL: ch.deltaTL, score: ch.score, outcome: ch.outcome });
        AetherNative.haptic(ch.score >= 20 ? 'success' : 'warning');
        renderMasteryTab(host);
      });
    });
    document.getElementById('aeDrillNextStageBtn')?.addEventListener('click', () => {
      const drills = G.getInteractiveDecisionDrills ? G.getInteractiveDecisionDrills() : [];
      const curDrill = drills.find((d) => d.id === activeDrillId) || drills[0];
      drillStageIdx++;
      drillPickedChoice = null;
      if (curDrill && drillStageIdx >= curDrill.stages.length && K.recordDrillCompletion) {
        K.recordDrillCompletion(curDrill.id, drillScore, drillCapitalTL);
        AetherNative.haptic('success');
        AetherNative.toast(`Tatbikat tamamlandı! Skor: ${drillScore}/100`, 'ok');
        renderHeader();
      }
      renderMasteryTab(host);
    });
    document.getElementById('aeDrillReplayBtn')?.addEventListener('click', () => {
      AetherNative.haptic('light');
      drillStageIdx = 0;
      drillCapitalTL = 1000000;
      drillScore = 0;
      drillPickedChoice = null;
      drillHistory = [];
      renderMasteryTab(host);
    });
    document.getElementById('aeDrillNextScenarioBtn')?.addEventListener('click', () => {
      const drills = G.getInteractiveDecisionDrills ? G.getInteractiveDecisionDrills() : [];
      const curIdx = drills.findIndex((d) => d.id === activeDrillId);
      const next = drills[(curIdx + 1) % Math.max(1, drills.length)];
      if (next) activeDrillId = next.id;
      drillStageIdx = 0;
      drillCapitalTL = 1000000;
      drillScore = 0;
      drillPickedChoice = null;
      drillHistory = [];
      renderMasteryTab(host);
    });
    host.querySelectorAll('[data-tax-sub]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        labTaxSub = b.getAttribute('data-tax-sub') || 'GVK80';
        renderMasteryTab(host);
      });
    });
    document.getElementById('aeLabDivSl')?.addEventListener('input', (e) => {
      labDivGrossTL = Number(e.target.value) || 850000;
      const d = K.computeDividendTax2026 ? K.computeDividendTax2026({ grossDividendTL: labDivGrossTL }) : null;
      const lbl = document.getElementById('aeLabDivLbl');
      if (lbl) lbl.textContent = fmtTL(labDivGrossTL);
      const out = document.getElementById('aeLabDivLiveOut');
      if (out && d) {
        out.innerHTML = `
          <div class="ae-kpi-2x2" style="margin-bottom:10px">
            <div class="ms-kpi-box"><span>Kaynakta Kesilen %15 Stopaj</span><strong>-${fmtTL(d.withholdingPaidTL)}</strong><small>Net yatan: ${fmtTL(d.netReceivedAtSourceTL)}</small></div>
            <div class="ms-kpi-box"><span>Beyana Tabi Yarı Matrah</span><strong>${fmtTL(d.taxableHalfTL)}</strong><small>2026 Sınırı: 400.000 ₺</small></div>
            <div class="ms-kpi-box" style="border-color:${d.isTaxRefund ? 'rgba(16,185,129,0.5)' : 'rgba(240,180,41,0.45)'}"><span>${d.mustDeclare ? (d.isTaxRefund ? '🎉 Devletten Vergi İadesi!' : 'Ek Ödenecek Vergi') : 'Beyan Durumu'}</span><strong class="${d.isTaxRefund || !d.mustDeclare ? 'pos' : 'warn-txt'}">${d.mustDeclare ? (d.isTaxRefund ? '+' + fmtTL(Math.abs(d.extraTaxOrRefundTL)) : '-' + fmtTL(d.extraTaxOrRefundTL)) : 'Beyan Yok (0 ₺)'}</strong><small>Efektif vergi: %${d.effectiveTaxPct}</small></div>
            <div class="ms-kpi-box"><span>Cebinde Kalan Final Net</span><strong class="pos">${fmtTL(d.finalNetCashTL)}</strong><small>%50 istisna + mahsup sonrası</small></div>
          </div>
          <div class="ms-alert ${!d.mustDeclare || d.isTaxRefund ? 'ok' : 'info'}" style="margin-bottom:0">
            ${!d.mustDeclare
              ? `✅ <strong>Beyanname Gerekmez!</strong> Yarısı (${fmtTL(d.taxableHalfTL)}) 2026 sınırı olan 400.000 ₺’nin altında kaldığı için ek vergin 0 ₺.`
              : (d.isTaxRefund
                ? `🎉 <strong>Vergi İadesi Bölgesi!</strong> Hesaplanan gelir vergisi (${fmtTL(d.calculatedTaxTL)}), kaynağında kesilen %15 stopajdan (${fmtTL(d.withholdingPaidTL)}) küçük olduğu için Mart 2027 beyanıyla <strong>+${fmtTL(Math.abs(d.extraTaxOrRefundTL))}</strong> iade hakkın doğar!`
                : `📊 <strong>Kademeli Dilim (%${d.topBracketPct}):</strong> Hesaplanan ${fmtTL(d.calculatedTaxTL)} vergiden ödediğin ${fmtTL(d.withholdingPaidTL)} stopaj mahsup edilir; sadece fark (${fmtTL(d.extraTaxOrRefundTL)}) ödenir.`)}
          </div>
        `;
      }
    });
    document.getElementById('aeLabEbSl')?.addEventListener('input', (e) => {
      labEbCouponTL = Number(e.target.value) || 420000;
      const eb = K.computeEurobondTax2026 ? K.computeEurobondTax2026({ annualCouponTL: labEbCouponTL }) : null;
      const lbl = document.getElementById('aeLabEbLbl');
      if (lbl && eb) { lbl.textContent = fmtTL(labEbCouponTL); lbl.className = eb.couponMustDeclare ? 'warn-txt' : 'pos'; }
      const out = document.getElementById('aeLabEbLiveOut');
      if (out && eb) {
        out.innerHTML = `
          <div class="ae-kpi-2x2" style="margin-bottom:10px">
            <div class="ms-kpi-box"><span>2026 Beyan Sınırı</span><strong>400.000 ₺</strong><small>2. Gelir Vergisi Dilimi</small></div>
            <div class="ms-kpi-box" style="border-color:${eb.couponMustDeclare ? 'rgba(244,63,94,0.45)' : 'rgba(16,185,129,0.45)'}"><span>2026 Beyanname Vergin</span><strong class="${eb.couponMustDeclare ? 'neg' : 'pos'}">${fmtTL(eb.totalTaxTL)}</strong><small>${eb.couponMustDeclare ? `Dilim %${eb.topBracketPct}` : '%0 Vergi!'}</small></div>
          </div>
          <div class="ms-alert ${eb.couponMustDeclare ? 'warn' : 'ok'}" style="margin-bottom:0">
            ${eb.couponMustDeclare
              ? `⚠️ <strong>400.000 ₺ Uçurumunu Geçtin!</strong> Aşan kısım değil, ${fmtTL(eb.annualCouponTL)} kuponun TAMAMI beyana girdi ve ${fmtTL(eb.totalTaxTL)} vergi doğdu. İtfaya kadar tutulan Eurobond’da anapara kur farkı vergisi ise 0 ₺’dir!`
              : `🛡️ <strong>%0 Vergi Kalkanı!</strong> Yıllık kuponun 400.000 ₺ sınırının altında (başka beyan gelirin yoksa): 0 ₺ stopaj + 0 ₺ beyan vergisi!`}
          </div>
        `;
      }
    });
    const updateBesLive = () => {
      const bes = K.computeBes2026Simulation
        ? K.computeBes2026Simulation({ monthlyContribTL: labBesMonthlyTL, years: labBesYears, ageAtStart: labBesStartAge, fundRealAnnualPct: labBesRealPct })
        : null;
      if (!bes) return;
      const mLbl = document.getElementById('aeBesMonLbl');
      const aLbl = document.getElementById('aeBesAgeLbl');
      const yLbl = document.getElementById('aeBesYrLbl');
      const rLbl = document.getElementById('aeBesRealLbl');
      if (mLbl) mLbl.textContent = `${fmtTL(labBesMonthlyTL)}/ay`;
      if (aLbl) aLbl.textContent = `${labBesStartAge} Yaş`;
      if (yLbl) yLbl.textContent = `${labBesYears} Yıl (Çıkış Yaşı: ${bes.endAge})`;
      if (rLbl) {
        rLbl.textContent = `Reel ${labBesRealPct >= 0 ? '+' : ''}%${labBesRealPct}/yıl`;
        rLbl.className = labBesRealPct >= 2 ? 'pos' : 'warn-txt';
      }
      const out = document.getElementById('aeBesLiveOut');
      if (out) {
        out.innerHTML = `
          <div class="ae-kpi-2x2" style="margin-bottom:10px">
            <div class="ms-kpi-box" style="border-color:rgba(16,185,129,0.48)"><span>Net Reel BES Havuzun</span><strong class="pos">${fmtCompactTL(bes.totalNetRealTL)}</strong><small>Yatırdığın: ${fmtCompactTL(bes.totalOwnPaidTL)}</small></div>
            <div class="ms-kpi-box"><span>2026 Yıllık Devlet Katkısı</span><strong class="pos">+${fmtTL(bes.annualStateContribTL)}/yıl</strong><small>Hak Ediş: %${bes.vestingPct} · Stopaj: %${bes.exitStopajPct}</small></div>
            <div class="ms-kpi-box" style="border-color:rgba(240,180,41,0.45)"><span>BEFAS Yönetimi Farkı</span><strong class="${bes.befasAdvantageTL >= 0 ? 'pos' : 'neg'}">${bes.befasAdvantageTL >= 0 ? '+' : ''}${fmtCompactTL(bes.befasAdvantageTL)}</strong><small>Standart fon (${fmtCompactTL(bes.netStdTotalTL)}) farkı</small></div>
            <div class="ms-kpi-box"><span>Aylık Ömür Boyu Maaş (%4)</span><strong>+${fmtTL(bes.monthlyPensionReal4PctTL)}/ay</strong><small>Bugünkü alım gücüyle</small></div>
          </div>
          <div class="ms-alert ${bes.vestingPct >= 60 ? 'ok' : 'warn'}" style="margin-bottom:0">
            <strong>📋 ${esc(bes.exitStageLabel)}:</strong>
            ${bes.overCapAnnualTL > 0
              ? ` Yıllık katkın 2026 tavanı olan 396.360 ₺’yi ${fmtTL(bes.overCapAnnualTL)} aşıyor; aşan tutar 2027 yılı devlet katkısı hesabına devreder!`
              : ` Yıllık tavan (${fmtTL(bes.annualCapContrib2026TL)}) içindesin; devlet katkısının tamamından yararlanıyorsun.`}
          </div>
        `;
      }
    };
    document.getElementById('aeBesMonSl')?.addEventListener('input', (e) => { labBesMonthlyTL = Number(e.target.value) || 15000; updateBesLive(); });
    document.getElementById('aeBesAgeSl')?.addEventListener('input', (e) => { labBesStartAge = Number(e.target.value) || 35; updateBesLive(); });
    document.getElementById('aeBesYrSl')?.addEventListener('input', (e) => { labBesYears = Number(e.target.value) || 10; updateBesLive(); });
    document.getElementById('aeBesRealSl')?.addEventListener('input', (e) => { labBesRealPct = Number(e.target.value); if (!Number.isFinite(labBesRealPct)) labBesRealPct = 10; updateBesLive(); });

    host.querySelectorAll('[data-lab-tool]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        labToolId = b.getAttribute('data-lab-tool') || 'DETECTIVE';
        renderMasteryTab(host);
      });
    });
    host.querySelectorAll('[data-lab-bk-key]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        labBakeryKey = b.getAttribute('data-lab-bk-key') || 'bist-tuprs';
        labBakerySearch = '';
        renderMasteryTab(host);
      });
    });
    const labBkInp = document.getElementById('aeLabBakerySearchInp');
    if (labBkInp) {
      labBkInp.addEventListener('input', () => {
        labBakerySearch = labBkInp.value;
        renderMasteryTab(host);
        const again = document.getElementById('aeLabBakerySearchInp');
        if (again) {
          again.focus();
          try { again.setSelectionRange(labBakerySearch.length, labBakerySearch.length); } catch (_) {}
        }
      });
    }
    host.querySelectorAll('[data-kap-sc]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        kapReaderId = b.getAttribute('data-kap-sc') || 'kap_new_contract';
        renderMasteryTab(host);
      });
    });
    host.querySelectorAll('[data-kap-chk]').forEach((chk) => {
      chk.addEventListener('change', () => {
        AetherNative.haptic('light');
        const idx = Number(chk.getAttribute('data-kap-chk'));
        if (!kapCheckedMap[kapReaderId]) kapCheckedMap[kapReaderId] = {};
        kapCheckedMap[kapReaderId][idx] = Boolean(chk.checked);
        renderMasteryTab(host);
      });
    });

    const updateLabBakeryLive = () => {
      const target = K.getAsset(labBakeryKey) || K.getAsset('bist-tuprs');
      const lbl = document.getElementById('aeLabBakeryAmtLbl');
      if (lbl) lbl.textContent = fmtTL(labBakeryAmt);
      const out = document.getElementById('aeLabBakeryLiveOut');
      if (!target || !out) return;
      const bk = G.computeBakery100kScale(target, labBakeryAmt);
      const fn = G.computeFinancial100kScale(target, labBakeryAmt);
      const gv = G.getPlainAssetVerdict ? G.getPlainAssetVerdict(target, labBakeryAmt) : null;
      const paybackYears = bk && bk.annualOcfTL > 0 ? +(labBakeryAmt / bk.annualOcfTL).toFixed(1) : (fn && fn.annualNetProfitTL > 0 ? +(labBakeryAmt / fn.annualNetProfitTL).toFixed(1) : null);
      out.innerHTML = `
        <div class="ae-verdict-banner ${esc(gv?.trafficLight || 'amber')}">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
            <strong style="font-size:15.5px">${esc(target.ticker)} · ${esc(target.name)}</strong>
            <span class="ms-sig-pill ${gv?.trafficLight === 'green' ? 'good' : (gv?.trafficLight === 'red' ? 'danger' : 'warn')}">${esc(gv?.simpleLabel || 'Analiz')}</span>
          </div>
          <p style="margin:0;font-size:13.6px;line-height:1.5;color:var(--ink-100)">${esc(bk?.plainSummary || fn?.plainSummary || gv?.simpleMeaning || '')}</p>
        </div>
        ${bk ? `
          <div class="ae-kpi-2x2" style="margin-bottom:10px">
            <div class="ms-kpi-box"><span>Günlük Kasaya Giren Nakit</span><strong class="${bk.dailyOcfTL >= 0 ? 'pos' : 'neg'}">${bk.dailyOcfTL >= 0 ? '+' : ''}${bk.dailyOcfTL.toLocaleString('tr-TR')} ₺/gün</strong><small>Her gün fırın kasasına</small></div>
            <div class="ms-kpi-box"><span>Yıllık Serbest Nakit (FCF)</span><strong class="${bk.annualFcfTL >= 0 ? 'pos' : 'warn-txt'}">${bk.annualFcfTL >= 0 ? '+' : ''}${fmtTL(bk.annualFcfTL)}</strong><small>Yeni makine masrafı sonrası</small></div>
            <div class="ms-kpi-box"><span>Kasadaki Hazır Para Payın</span><strong>${fmtTL(bk.cashShareTL)}</strong><small>Sırtındaki borç: ${fmtTL(bk.debtShareTL)}</small></div>
            <div class="ms-kpi-box"><span>Kendi Kendini Ödeme Süresi</span><strong>${paybackYears ? paybackYears + ' Yıl' : 'Nakit Zayıf'}</strong><small>Yıllık net temettü: +${fmtTL(bk.annualNetDivTL)}</small></div>
          </div>
        ` : (fn ? `
          <div class="ae-kpi-2x2" style="margin-bottom:10px">
            <div class="ms-kpi-box"><span>Günlük Net Kâr Payın</span><strong class="${fn.dailyNetProfitTL >= 0 ? 'pos' : 'neg'}">${fn.dailyNetProfitTL >= 0 ? '+' : ''}${fn.dailyNetProfitTL.toLocaleString('tr-TR')} ₺/gün</strong></div>
            <div class="ms-kpi-box"><span>Yıllık Net Kâr Payın</span><strong class="${fn.annualNetProfitTL >= 0 ? 'pos' : 'neg'}">${fn.annualNetProfitTL >= 0 ? '+' : ''}${fmtTL(fn.annualNetProfitTL)}</strong></div>
            <div class="ms-kpi-box"><span>Özsermaye Kârlılığı (ROE)</span><strong>${fn.roePct != null ? '%' + fn.roePct : '-'}</strong></div>
            <div class="ms-kpi-box"><span>Kendi Kendini Ödeme</span><strong>${paybackYears ? paybackYears + ' Yıl' : '-'}</strong></div>
          </div>
        ` : '')}
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="ms-btn primary" style="flex:1" data-open-asset="${esc(target.key)}">${esc(target.ticker)} Canlı Tahtasını Aç</button>
          <button type="button" class="ae-term-pill" data-explain-term="OCF">OCF nedir?</button>
          <button type="button" class="ae-term-pill" data-explain-term="FCF">FCF nedir?</button>
        </div>
      `;
      bindAssetListClicks(out);
      bindTermExplainClicks(out);
    };
    document.getElementById('aeLabBakeryAmtSl')?.addEventListener('input', (e) => {
      labBakeryAmt = Number(e.target.value) || 100000;
      updateLabBakeryLive();
    });

    host.querySelectorAll('[data-lab-bamt]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        calcAmountTL = Number(b.getAttribute('data-lab-bamt')) || 250000;
        renderMasteryTab(host);
      });
    });
    host.querySelectorAll('[data-lab-bdays]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        calcDays = Number(b.getAttribute('data-lab-bdays')) || 32;
        renderMasteryTab(host);
      });
    });

    const updateLabGvkLive = () => {
      if (!K.computeGvk80Simulation) return;
      const sim = K.computeGvk80Simulation({ buyTL: labGvkBuy, sellTL: labGvkSell, yiUfePct: labGvkUfe, priorAnnualGainTL: 0 });
      const bLbl = document.getElementById('aeLabGvkBuyLbl');
      const sLbl = document.getElementById('aeLabGvkSellLbl');
      const uLbl = document.getElementById('aeLabGvkUfeLbl');
      if (bLbl) bLbl.textContent = fmtTL(labGvkBuy);
      if (sLbl) sLbl.textContent = fmtTL(labGvkSell);
      if (uLbl) {
        uLbl.textContent = `%${labGvkUfe} ${sim.yiUfeIndexed ? '✓ (%10 Endeksleme AÇIK!)' : '✗ (%10 Altı — Endeksleme YOK!)'}`;
        uLbl.className = sim.yiUfeIndexed ? 'pos' : 'neg';
      }
      const out = document.getElementById('aeLabGvkLiveOut');
      if (out) {
        out.innerHTML = `
          <div class="ae-kpi-2x2" style="margin-bottom:10px">
            <div class="ms-kpi-box"><span>Endekslenmiş Maliyet</span><strong>${fmtTL(sim.indexedCostTL)}</strong><small>Vergi Matrahı: ${fmtTL(sim.taxableGainTL)}</small></div>
            <div class="ms-kpi-box" style="border-color:${sim.taxTL > 0 ? 'rgba(245,158,11,0.45)' : 'rgba(16,185,129,0.45)'}"><span>2026 Beyanname Vergin</span><strong class="${sim.taxTL > 0 ? 'warn-txt' : 'pos'}">${fmtTL(sim.taxTL)}</strong><small>2026 Tarife Dilimi: %${sim.topBracketPct}</small></div>
            <div class="ms-kpi-box"><span>Yİ-ÜFE %10 İle Kurtardığın</span><strong class="pos">+${fmtTL(sim.taxSavedByIndexTL)}</strong><small>Endekssiz vergi: ${fmtTL(sim.unindexedTaxTL)}</small></div>
            <div class="ms-kpi-box"><span>Cebinde Kalan Net Kâr</span><strong class="${sim.netProfitAfterTaxTL >= 0 ? 'pos' : 'neg'}">${sim.netProfitAfterTaxTL >= 0 ? '+' : ''}${fmtTL(sim.netProfitAfterTaxTL)}</strong><small>Mart & Temmuz 2 taksit</small></div>
          </div>
          <div class="ms-alert ${sim.yiUfeIndexed ? 'ok' : 'warn'}" style="margin-bottom:8px">
            ${sim.yiUfeIndexed
              ? `🛡️ <strong>Endeksleme Kalkanı Devrede!</strong> Yİ-ÜFE %${labGvkUfe} (>= %10) olduğu için alış maliyetin ${fmtTL(sim.indexedCostTL)} sayıldı ve cebinde tam <strong>${fmtTL(sim.taxSavedByIndexTL)}</strong> fazladan kaldı!`
              : `⚠️ <strong>%10 Eşiğini Kaçırdın!</strong> Yİ-ÜFE %${labGvkUfe} olduğu için devlet maliyetini hiç güncellemedi; nominal kur artışından bile vergi hesaplandı. Birkaç hafta bekleyip %10’u geçmek büyük avantaj sağlar!`}
          </div>
        `;
      }
    };
    document.getElementById('aeLabGvkBuySl')?.addEventListener('input', (e) => { labGvkBuy = Number(e.target.value) || 500000; updateLabGvkLive(); });
    document.getElementById('aeLabGvkSellSl')?.addEventListener('input', (e) => { labGvkSell = Number(e.target.value) || 780000; updateLabGvkLive(); });
    document.getElementById('aeLabGvkUfeSl')?.addEventListener('input', (e) => { labGvkUfe = Number(e.target.value) || 0; updateLabGvkLive(); });

    const updateLabBasketLive = () => {
      if (!G.simulateSingleBasketDrop) return;
      const drop = G.simulateSingleBasketDrop({ capitalTL: 1000000, singleWeightPct: labBasketWeight, shockDropPct: labBasketDrop });
      const wLbl = document.getElementById('aeLabBasketWLbl');
      const dLbl = document.getElementById('aeLabBasketDLbl');
      if (wLbl) {
        wLbl.textContent = `%${labBasketWeight} (${fmtCompactTL(1000000 * labBasketWeight / 100)})`;
        wLbl.className = labBasketWeight >= 60 ? 'neg' : 'pos';
      }
      if (dLbl) dLbl.textContent = `-%${labBasketDrop}`;
      const out = document.getElementById('aeLabBasketLiveOut');
      if (out) {
        out.innerHTML = `
          <div class="ae-kpi-2x2" style="margin-bottom:10px">
            <div class="ms-kpi-box" style="border-color:rgba(244,63,94,0.45)">
              <span>Senin Kalan Paran</span>
              <strong class="neg">${fmtTL(drop.endCapitalTL)}</strong>
              <small>Kayıp: -${fmtTL(drop.netLossTL)} (-%${drop.netDropPct})</small>
            </div>
            <div class="ms-kpi-box" style="border-color:rgba(240,180,41,0.48)">
              <span>Eski 1M’ye Dönmek İçin</span>
              <strong class="warn-txt">+%${drop.recoveryNeededPct} Çıkmalı!</strong>
              <small>Kayıp asimetrisi duvarı</small>
            </div>
            <div class="ms-kpi-box" style="border-color:rgba(16,185,129,0.45)">
              <span>4 Parçalı Dengeli Sepet</span>
              <strong class="pos">${fmtTL(drop.balEndTL)}</strong>
              <small>Sadece -%${drop.balDropPct} etkilenir (+%${drop.balRecoveryPct} yeter)</small>
            </div>
            <div class="ms-kpi-box">
              <span>Sepet Yapmanın Kurtardığı</span>
              <strong class="pos">+${fmtTL(drop.savedByDiversifyingTL)}</strong>
              <small>Aynı fırtınada uykun bozulmaz</small>
            </div>
          </div>
          <div class="ms-alert ${drop.recoveryNeededPct >= 40 ? 'err' : 'ok'}" style="margin-bottom:0">
            ${drop.recoveryNeededPct >= 40
              ? `🚨 <strong>İşte o iç cız etmesi:</strong> Tek sepetin -%${labBasketDrop} düşünce paran ${fmtTL(drop.endCapitalTL)}’ye indi ve sadece eski parana dönmen için tam <strong>+%${drop.recoveryNeededPct}</strong> kazanman gerekiyor!`
              : `🛡️ <strong>Huzurlu Denge:</strong> Tek sepete aşırı yüklenmediğin için büyük şokta bile sadece -%${drop.netDropPct} etkilendin; birkaç ayda toparlanıp yoluna devam edersin.`}
          </div>
        `;
      }
    };
    document.getElementById('aeLabBasketWSl')?.addEventListener('input', (e) => { labBasketWeight = Number(e.target.value) || 100; updateLabBasketLive(); });
    document.getElementById('aeLabBasketDSl')?.addEventListener('input', (e) => { labBasketDrop = Number(e.target.value) || 50; updateLabBasketLive(); });
    host.querySelectorAll('[data-lab-fw-add]').forEach((b) => {
      b.addEventListener('click', () => { fwMonthlyAddTL = Number(b.getAttribute('data-lab-fw-add')) || 0; renderMasteryTab(host); });
    });
    host.querySelectorAll('[data-lab-fw-ret]').forEach((b) => {
      b.addEventListener('click', () => { fwRealReturnPct = Number(b.getAttribute('data-lab-fw-ret')) || 10; renderMasteryTab(host); });
    });
    host.querySelectorAll('[data-lab-fw-exp]').forEach((b) => {
      b.addEventListener('click', () => { fwMonthlyExpTL = Number(b.getAttribute('data-lab-fw-exp')) || 45000; renderMasteryTab(host); });
    });

    host.querySelectorAll('[data-cdiff]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        caseDiffFilter = b.getAttribute('data-cdiff') || 'ALL';
        renderMasteryTab(host);
      });
    });

    host.querySelectorAll('[data-det-pick]').forEach((b) => {
      b.addEventListener('click', () => {
        const picked = b.getAttribute('data-det-pick');
        const round = G.generateLiveKasaDuelRound ? G.generateLiveKasaDuelRound(detectiveSeed) : null;
        if (!round || detectivePickedSide) return;
        detectivePickedSide = picked;
        const won = picked === round.optimalSide;
        if (K.recordDetectiveAttempt) K.recordDetectiveAttempt(won);
        AetherNative.haptic(won ? 'success' : 'warning');
        AetherNative.toast(won ? 'Bilanço dedektifi isabeti! Gerçek şirketler açıldı.' : 'Kağıt kâr tuzağı! Gerçek şirketleri incele.', won ? 'ok' : 'info');
        renderHeader();
        renderMasteryTab(host);
      });
    });

    document.getElementById('aeNextDetectiveRoundBtn')?.addEventListener('click', () => {
      AetherNative.haptic('light');
      detectiveSeed = (detectiveSeed * 1664525 + 1013904223) % 999983 + 7;
      detectivePickedSide = null;
      renderMasteryTab(host);
    });

    host.querySelectorAll('[data-ccat]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        caseFilterCat = b.getAttribute('data-ccat') || 'ALL';
        renderMasteryTab(host);
      });
    });

    host.querySelectorAll('[data-case-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cid = btn.getAttribute('data-case-id');
        const chId = btn.getAttribute('data-choice-id');
        const isOpt = btn.getAttribute('data-optimal') === '1';
        K.recordFieldCaseAttempt(cid, chId, isOpt);
        AetherNative.haptic(isOpt ? 'success' : 'warning');
        AetherNative.toast(isOpt ? 'Usta işi karar! Gerçek piyasa kuralı ustalık puanına işlendi.' : 'Seçtiğin şıkkın tuzak analizi açıldı — incele!', isOpt ? 'ok' : 'info');
        renderHeader();
        renderMasteryTab(host);
      });
    });

    const manualReg = document.getElementById('aeManualResultsRegion');
    if (manualReg) bindManualAcademyEvents(manualReg, host);

    const mInp = document.getElementById('aeManualSearchInp');
    const mClr = document.getElementById('aeClearManualSearchBtn');
    if (mInp) {
      mInp.addEventListener('input', () => {
        manualSearchQuery = mInp.value;
        if (mClr) mClr.hidden = !manualSearchQuery;
        const reg = document.getElementById('aeManualResultsRegion');
        if (reg) {
          reg.innerHTML = buildManualAndLexiconRegionHtml();
          bindManualAcademyEvents(reg, host);
        }
      });
    }
    if (mClr) {
      mClr.addEventListener('click', () => {
        manualSearchQuery = '';
        if (mInp) {
          mInp.value = '';
          mInp.focus();
        }
        mClr.hidden = true;
        const reg = document.getElementById('aeManualResultsRegion');
        if (reg) {
          reg.innerHTML = buildManualAndLexiconRegionHtml();
          bindManualAcademyEvents(reg, host);
        }
      });
    }

    document.getElementById('aeOpenProfFromMastery')?.addEventListener('click', openProfileModal);
    document.getElementById('msReset1MBtn')?.addEventListener('click', () => {
      AetherNative.haptic('warning');
      openResetConfirmModal();
    });
    bindAssetListClicks(host);
    bindTermExplainClicks(host);
  }

  // --------------------------------------------------------------------------
  // 8. SEKME 5: CANLI LİG (PODYUM, AÇIK PORTFÖYLER, RÖNTGEN & DAVET)
  // --------------------------------------------------------------------------
  function renderFamilyTab(host) {
    const K = global.AetherKernelV10;
    const st = K.getState();
    const me = K.getActiveMember();
    const league = K.getLeagueStatus();

    const evaluated = K.getAllLeagueMembers()
      .filter((m) => m.profileRegistered !== false || m.id === me.id)
      .map((m) => {
        const snap = K.evaluateMemberPortfolio(m);
        const mastery = K.evaluateInvestorMastery(m, snap);
        return { raw: m, snap, mastery };
      });

    evaluated.sort((a, b) => {
      if (leagueSortBy === 'PNL_PCT') return b.snap.nominalPnlPct - a.snap.nominalPnlPct;
      if (leagueSortBy === 'MASTERY') return b.mastery.overallScore - a.mastery.overallScore;
      return b.snap.totalNetWorthTL - a.snap.totalNetWorthTL;
    });

    const showPodium = evaluated.length >= 2;
    const podiumTop = evaluated.slice(0, 3);

    host.innerHTML = `
      <!-- ÜST LİG AĞI VE DAVET KARTI -->
      <section class="ae-hero-card" style="padding:14px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap">
          <div>
            <div style="display:flex;align-items:center;gap:6px">
              <span class="ms-dot ${league.isOnline ? 'open' : ''}"></span>
              <span style="font-size:11.2px;font-weight:800;color:var(--gold-bright)">ODA: ${esc(league.roomCode)} · ${evaluated.length} YATIRIMCI</span>
            </div>
            <h2 style="margin:4px 0 2px;font-size:17px;font-weight:900">Canlı Yatırımcı Ligi</h2>
            <p style="margin:0;font-size:11.8px;color:var(--ink-200)">Uygulamayı yükleyen herkesin 1M portföyü, kâr/zararı ve hamleleri canlı fiyatlarla anlık akar.</p>
          </div>
          <div style="display:flex;gap:6px">
            <button type="button" class="ms-btn primary sm" id="aeShareLeagueBtn">Davet Et</button>
            <button type="button" class="ms-btn sm" id="msEditRoomBtn">Oda</button>
          </div>
        </div>

        <div class="ae-hscroll" style="margin-top:10px;padding-bottom:0">
          <button type="button" class="ae-chip ${leagueSortBy === 'NET_WORTH' ? 'active' : ''}" data-lsort="NET_WORTH">Portföy Büyüklüğü</button>
          <button type="button" class="ae-chip ${leagueSortBy === 'PNL_PCT' ? 'active' : ''}" data-lsort="PNL_PCT">% Kâr / Zarar</button>
          <button type="button" class="ae-chip ${leagueSortBy === 'MASTERY' ? 'active' : ''}" data-lsort="MASTERY">Ustalık Puanı</button>
        </div>
      </section>

      ${!me.profileRegistered ? `
        <div class="ms-alert warn" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <span>Diğer telefonlarda görünmek için adını kaydetmelisin.</span>
          <button type="button" class="ms-btn primary sm" id="msPromptRegBtn">Adımı Kaydet</button>
        </div>
      ` : ''}

      <!-- İLK 3 PODYUM -->
      ${showPodium ? `
        <div class="ae-podium-strip">
          ${podiumTop.map((item, i) => `
            <div class="ae-podium-card ${i === 0 ? 'rank-1' : ''}" data-xray-peer="${esc(item.raw.id)}">
              <div style="font-size:11px;font-weight:900;color:${i === 0 ? 'var(--gold-bright)' : 'var(--ink-400)'}">#${i + 1}</div>
              <div class="ae-avatar" style="margin:5px auto;background:${esc(item.raw.avatarColor || '#2563eb')}">${esc(initials(item.raw.name))}</div>
              <div style="font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(item.raw.profileRegistered ? item.raw.name : 'Ben')}</div>
              <div style="font-size:12.2px;font-weight:900;margin-top:2px">${fmtCompactTL(item.snap.totalNetWorthTL)}</div>
              <div style="font-size:10.8px;font-weight:800" class="${item.snap.nominalPnlPct >= 0 ? 'pos' : 'neg'}">${item.snap.nominalPnlPct >= 0 ? '+' : ''}%${item.snap.nominalPnlPct}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- YATIRIMCI AÇIK PORTFÖY KARTLARI -->
      <div class="ms-league-grid" style="margin-bottom:14px">
        ${evaluated.map(({ raw, snap, mastery }, idx) => {
          const isMe = raw.id === me.id;
          const onlineNow = isMe || (Date.now() - (raw.lastSeenAt || raw.updatedAt || 0)) < 75000;
          const lastMove = (raw.tradeHistory || [])[0] || null;
          const rankCls = idx === 0 ? 'gold' : (idx === 1 ? 'silver' : (idx === 2 ? 'bronze' : ''));
          const displayName = raw.profileRegistered ? raw.name : 'Ben (Ad Girilmedi)';

          return `
            <article class="ms-member-card ${isMe ? 'is-me' : ''}">
              <div class="ms-member-head">
                <div class="ms-member-ident">
                  <span class="ms-rank-badge ${rankCls}">${idx + 1}</span>
                  <span class="ae-avatar" style="background:${esc(raw.avatarColor || '#2563eb')}">${esc(initials(displayName))}</span>
                  <div style="min-width:0">
                    <strong style="font-size:14.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(displayName)} ${isMe ? '<small style="color:var(--gold-bright)">(Sen)</small>' : ''}</strong>
                    <div style="font-size:11px;color:var(--ink-400)">
                      <span style="color:${onlineNow ? 'var(--green-ink)' : 'var(--ink-500)'};font-weight:700">${onlineNow ? '● Açık' : '○ ' + esc(fmtAgo(raw.lastSeenAt || raw.updatedAt))}</span>
                      · ${esc(raw.deviceLabel || 'Cihaz')} · ${mastery.overallScore}p
                    </div>
                  </div>
                </div>

                <div class="ms-member-worth">
                  <strong style="font-size:15.5px;display:block">${fmtTL(snap.totalNetWorthTL)}</strong>
                  <span class="${snap.nominalPnlTL >= 0 ? 'pos' : 'neg'}" style="font-size:11.8px;font-weight:800">
                    ${snap.nominalPnlTL >= 0 ? '+' : ''}%${snap.nominalPnlPct} (${snap.nominalPnlTL >= 0 ? '+' : ''}${fmtCompactTL(snap.nominalPnlTL)})
                  </span>
                </div>
              </div>

              ${renderAllocRibbonHtml(snap.allocationBreakdown)}

              <div class="ms-holdings-box">
                ${snap.spotItems.slice(0, 6).map((s) => `
                  <span class="ms-holding-chip">
                    ${esc(s.ticker)} ${fmtCompactTL(s.netValTL)}
                    <span class="${s.pnlNetPct >= 0 ? 'pos' : 'neg'}">${s.pnlNetPct >= 0 ? '+' : ''}%${s.pnlNetPct}</span>
                  </span>
                `).join('')}
                ${snap.tranches.slice(0, 3).map((t) => `
                  <span class="ms-holding-chip">${esc(t.name.split(' ')[0])} ${fmtCompactTL(t.accruedNetValueTL)}</span>
                `).join('')}
                ${snap.cashTL > 200 ? `<span class="ms-holding-chip">Nakit ${fmtCompactTL(snap.cashTL)}</span>` : ''}
                ${snap.pendingOrderTL > 0 ? `<span class="ms-holding-chip">⏳ Emir ${fmtCompactTL(snap.pendingOrderTL)}</span>` : ''}
                ${snap.unsettledTL > 0 ? `<span class="ms-holding-chip">T+2 ${fmtCompactTL(snap.unsettledTL)}</span>` : ''}
                ${snap.ipoBlockedTL > 0 ? `<span class="ms-holding-chip">🏛️ Arz ${fmtCompactTL(snap.ipoBlockedTL)}</span>` : ''}
              </div>

              ${lastMove ? `
                <div style="font-size:11.6px;color:var(--ink-400)">
                  <strong style="color:var(--ink-200)">Son Hamle:</strong> ${esc(lastMove.side)} · ${esc(lastMove.name)} (${fmtCompactTL(lastMove.amountTL)})${lastMove.thesisNote ? ` — "${esc(lastMove.thesisNote)}"` : ''}
                </div>
              ` : ''}

              <div style="display:flex;gap:8px;margin-top:auto">
                <button type="button" class="ms-btn primary sm" style="flex:1" data-xray-peer="${esc(raw.id)}">Portföy Röntgeni</button>
                ${!isMe ? `
                  <button type="button" class="ms-btn sm" data-ask-peer="${esc(raw.name)}" data-ask-move="${esc(lastMove ? lastMove.name : 'bu stratejiyi')}">
                    "Nereden Gördün?"
                  </button>
                ` : ''}
              </div>
            </article>
          `;
        }).join('')}
      </div>

      <!-- CANLI HAMLE & MEYDAN SOHBETİ -->
      <section class="ae-card">
        <strong style="display:block;font-size:14.5px;margin-bottom:3px">Meydan Akışı & "Bunu Nereden Gördün?"</strong>
        <p style="margin:0 0 10px;font-size:11.8px;color:var(--ink-400)">Güzel bir hamle yakalayanı kıskanmak yerine hangi veriden gördüğünü sor; aynı pencereden bakmayı öğren.</p>

        <div style="display:flex;gap:7px;margin-bottom:10px">
          <input id="msBanterInp" class="ae-input" type="text" placeholder="Hamleyi sor veya piyasa öngörünü yaz..." />
          <button type="button" class="ms-btn primary" id="msSendBanterBtn">Gönder</button>
        </div>

        <div class="ms-list" style="max-height:300px;overflow-y:auto">
          ${(st.banterFeed || []).length > 0 ? (st.banterFeed || []).map((b) => `
            <div class="ms-list-row" style="padding:9px 12px;border-left:${b.kind === 'TRADE' ? '3px solid var(--gold)' : '1px solid var(--line-subtle)'}">
              <div style="font-size:12.4px;min-width:0;flex:1">
                <strong>${esc(b.authorName)}${b.targetName ? ' -> ' + esc(b.targetName) : ''}:</strong> ${esc(b.text)}
              </div>
              <span style="font-size:10.8px;color:var(--ink-500);flex-shrink:0">${esc(fmtAgo(b.ts))}</span>
            </div>
          `).join('') : `
            <div style="font-size:12.2px;color:var(--ink-400);text-align:center;padding:10px">Yapılan işlemler ve sorular tüm telefonlarda anında burada akar.</div>
          `}
        </div>
      </section>
    `;

    document.getElementById('aeShareLeagueBtn')?.addEventListener('click', () => {
      const mySnap = K.evaluateMemberPortfolio(me);
      AetherNative.share({
        title: 'AETHER 1.000.000 ₺ Canlı Yatırımcı Ligi',
        text: `${me.profileRegistered ? me.name : 'Ben'} AETHER Canlı Yatırımcı Liginde (${league.roomCode} odası · Portföy: ${fmtTL(mySnap.totalNetWorthTL)}). Uygulamayı aç ve 1.000.000 ₺ ile lige katıl!`,
        url: 'https://4zyq4sk2tk-collab.github.io/AETHER-iOS/'
      });
    });

    document.getElementById('msEditRoomBtn')?.addEventListener('click', openProfileModal);
    document.getElementById('msPromptRegBtn')?.addEventListener('click', openWelcomeModal);

    host.querySelectorAll('[data-lsort]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        leagueSortBy = b.getAttribute('data-lsort');
        renderFamilyTab(host);
      });
    });

    host.querySelectorAll('[data-xray-peer]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('light');
        openPeerXrayModal(b.getAttribute('data-xray-peer'));
      });
    });

    host.querySelectorAll('[data-ask-peer]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        const who = b.getAttribute('data-ask-peer');
        const mv = b.getAttribute('data-ask-move');
        const inp = document.getElementById('msBanterInp');
        if (inp) {
          inp.value = `${who}, ${mv} hamlesini nereden gördün, hangi veriye güvendin?`;
          inp.focus();
        }
      });
    });

    const sendChat = () => {
      const inp = document.getElementById('msBanterInp');
      if (inp && inp.value.trim()) {
        AetherNative.haptic('success');
        K.postTeaBanter(inp.value);
        renderFamilyTab(host);
      }
    };
    document.getElementById('msSendBanterBtn')?.addEventListener('click', sendChat);
    document.getElementById('msBanterInp')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendChat();
    });
  }

  // --------------------------------------------------------------------------
  // 9. NATIVE SÜRÜKLENEBİLİR ALT ÇEKMECE: 360° VARLIK & DOKUNMATİK EMİR GİŞESİ
  // --------------------------------------------------------------------------
  function openModalShell() {
    const bd = document.getElementById('msModalBackdrop');
    const sheet = document.getElementById('msModalSheet');
    if (sheet) {
      sheet.style.transform = '';
      sheet.scrollTop = 0;
    }
    if (bd) bd.classList.add('open');
  }

  function closeModal() {
    AetherNative.stopSpeak();
    modalMode = null;
    drawerAssetKey = null;
    inspectedPeerId = null;
    const bd = document.getElementById('msModalBackdrop');
    const sheet = document.getElementById('msModalSheet');
    if (sheet) sheet.style.transform = '';
    if (bd) bd.classList.remove('open');
  }

  function openAssetDrawer(assetKey, initialSubTab = 'ORDER', initialSide = 'BUY') {
    const K = global.AetherKernelV10;
    const asset = K.getAsset(assetKey);
    if (!asset) return;
    const clock = K.getTurkishClock();

    modalMode = 'ASSET';
    drawerAssetKey = asset.key;
    drawerSubTab = initialSubTab || 'ORDER';
    drawerOpenedAtMs = Date.now();
    selectedUseMargin = false;
    selectedThesisTag = asset.isRateInstrument ? 'INFLATION_SHIELD' : 'RESEARCH_FUNDAMENTAL';
    draftThesisNote = '';
    draftSellRatio = 1;
    drawerBuyMode = 'MARKET';
    drawerSellMode = 'MARKET';
    draftTriggerPriceTL = 0;
    lastDrawerFeedback = null;

    if (asset.venue === 'TWO_DOOR') {
      selectedDoor = clock.grandBazaarOpen ? 'BAZAAR' : (clock.nobetciOpen ? 'NOBETCI' : 'BANK');
    }

    const member = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(member);
    const micro = K.inspectBoardMicrostructure(asset);
    const hasPos = Boolean(member.positions?.[asset.key]?.qty > 0);
    drawerOrderSide = (initialSide === 'SELL' && hasPos) ? 'SELL' : 'BUY';
    draftSellQty = null;

    const unsettledUsable = (asset.venue === 'BIST' && !micro.isBrutTakas)
      ? (member.settlementQueue || []).filter((x) => x.usableForBist !== false).reduce((s, x) => s + Number(x.grossTL || 0), 0)
      : 0;
    const availCashPower = Math.max(0, Math.floor(snap.cashTL + unsettledUsable));
    const minOrderTL = (asset.venue === 'BANK_RATE' || asset.venue === 'TEFAS') ? 100 : 10;
    if (availCashPower <= 0) {
      draftOrderAmount = 25000;
    } else if (availCashPower < 1000) {
      draftOrderAmount = Math.max(minOrderTL, availCashPower);
    } else {
      draftOrderAmount = Math.min(100000, Math.max(1000, Math.floor(availCashPower * 0.25)));
    }

    if (drawerSubTab === 'VAULT' && (asset.bistRow || asset.subVenue === 'DARPHANE_S1')) {
      K.markInspectedCashScale();
    }
    duelSearchQuery = '';
    renderAssetDrawer();
    openModalShell();
  }

  function fmtChartDateLabel(tsMs, rangeKey) {
    try {
      const d = new Date(tsMs);
      if (rangeKey === '1D') {
        return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
      }
      if (rangeKey === '1W' || rangeKey === '1M' || rangeKey === '3M') {
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', timeZone: 'Europe/Istanbul' });
      }
      return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Istanbul' });
    } catch (_) {
      return '';
    }
  }

  function fmtRealityPrice(val, reality, isRateCurve) {
    const n = Number(val) || 0;
    if (isRateCurve && reality !== 'USD') {
      return n.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' Endeks';
    }
    if (reality === 'USD') {
      const dec = n >= 100 ? 2 : (n >= 1 ? 3 : 4);
      return '$' + n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: dec });
    }
    return fmtUnitTL(n);
  }

  function renderProChartContainerHtml(asset) {
    const realities = [
      ['TL', '₺ TL'],
      ['REAL', '🥖 REEL'],
      ['USD', '$ DOLAR']
    ];
    const ranges = [
      ['1D', '1G'],
      ['1W', '1H'],
      ['1M', '1A'],
      ['3M', '3A'],
      ['1Y', '1Y'],
      ['5Y', '5Y']
    ];
    return `
      <div class="ae-pro-chart-box" id="aeProChartRoot">
        <div class="ae-chart-top-bar">
          <div style="min-width:0;flex:1">
            <div class="ae-chart-readout-val" id="aeChartReadoutVal">${asset.isRateInstrument ? `Yıllık Brüt %${asset.annualGrossRatePct.toFixed(1)}` : fmtUnitTL(asset.priceTL)}</div>
            <div class="ae-chart-readout-sub" id="aeChartReadoutSub">Grafik verisi yükleniyor · Parmağınla gezerek geçmişi incele</div>
          </div>
          <span class="ms-sig-pill neutral" id="aeChartPctBadge">...</span>
        </div>

        <div class="ae-chart-stage" id="aeChartStage">
          <div style="height:100%;display:flex;align-items:center;justify-content:center;font-size:11.5px;color:var(--ink-400)">
            Canlı fiyat ve enflasyon serisi çiziliyor...
          </div>
        </div>

        <div class="ae-chart-100k-strip" id="aeChart100kStrip">
          <span id="aeChart100kLabel"> Dönem Başı <strong>100.000 ₺</strong> -></span>
          <strong id="aeChart100kVal" style="color:var(--gold-bright)">Hesaplanıyor...</strong>
        </div>

        <div class="ae-chart-controls">
          <div class="ae-chart-pill-group" role="group" aria-label="Gerçeklik Birimi">
            ${realities.map(([rKey, rLbl]) => {
              const act = drawerChartReality === rKey;
              const cls = act ? (rKey === 'REAL' ? 'active real-active' : 'active') : '';
              return `<button type="button" class="ae-chart-pill ${cls}" data-chart-reality="${rKey}">${rLbl}</button>`;
            }).join('')}
          </div>
          <div class="ae-chart-pill-group" role="group" aria-label="Zaman Aralığı">
            ${ranges.map(([rgKey, rgLbl]) => `
              <button type="button" class="ae-chart-pill ${drawerChartRange === rgKey ? 'active' : ''}" data-chart-range="${rgKey}">${rgLbl}</button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  async function hydrateInteractiveAssetChart(asset, existingPos, info) {
    const K = global.AetherKernelV10;
    if (!K?.fetchAssetChartSeries || !asset) return;
    const token = ++activeChartToken;
    const rangeAtCall = drawerChartRange;
    const realityAtCall = drawerChartReality;

    const payload = await K.fetchAssetChartSeries(asset.key, rangeAtCall);
    if (token !== activeChartToken || modalMode !== 'ASSET' || drawerAssetKey !== asset.key) return;

    const stage = document.getElementById('aeChartStage');
    const valEl = document.getElementById('aeChartReadoutVal');
    const subEl = document.getElementById('aeChartReadoutSub');
    const badgeEl = document.getElementById('aeChartPctBadge');
    const lbl100k = document.getElementById('aeChart100kLabel');
    const val100k = document.getElementById('aeChart100kVal');
    if (!stage || !valEl || !subEl || !badgeEl) return;

    const pts = Array.isArray(payload?.points) ? payload.points : [];
    if (pts.length < 2) {
      stage.innerHTML = `<div style="height:100%;display:flex;align-items:center;justify-content:center;font-size:11.5px;color:var(--ink-400)">Tarihsel veri bulunamadı.</div>`;
      return;
    }

    const pickVal = (p) => realityAtCall === 'REAL' ? Number(p.realTl) : (realityAtCall === 'USD' ? Number(p.usd) : Number(p.tl));
    const vals = pts.map(pickVal);
    let minV = Math.min(...vals);
    let maxV = Math.max(...vals);
    if (!Number.isFinite(minV) || !Number.isFinite(maxV)) return;
    if (maxV - minV < maxV * 0.004) {
      minV = minV * 0.992;
      maxV = maxV * 1.008;
    }

    const w = 340, h = 150, padTop = 12, padBot = 18;
    const plotH = h - padTop - padBot;
    const xAt = (i) => +((i / Math.max(1, pts.length - 1)) * w).toFixed(1);
    const yAt = (v) => +(padTop + plotH - ((v - minV) / Math.max(1e-9, maxV - minV)) * plotH).toFixed(1);

    const polyCoords = vals.map((v, i) => `${xAt(i)},${yAt(v)}`).join(' ');
    const startV = Math.max(1e-9, vals[0]);
    const endV = vals[vals.length - 1];
    const totalPct = +(((endV / startV) - 1) * 100).toFixed(2);
    const isUp = endV >= startV;
    const strokeColor = isUp ? '#10b981' : '#f43f5e';
    const gradId = 'aeCg_' + token;

    // Maliyetim & Adil Değer Referans Çizgileri (Sadece TL Modunda ve Eksen İçindeyse)
    let refLinesSvg = '';
    if (realityAtCall === 'TL' && !payload.isRateCurve) {
      const avgCost = Number(existingPos?.avgCostTL) || 0;
      if (avgCost >= minV && avgCost <= maxV) {
        const cy = yAt(avgCost);
        refLinesSvg += `
          <line x1="0" y1="${cy}" x2="${w}" y2="${cy}" stroke="#f59e0b" stroke-width="1.1" stroke-dasharray="3,3" opacity="0.85"></line>
          <text x="4" y="${Math.max(10, cy - 3)}" fill="#fbbf24" font-size="8.6" font-weight="800">Maliyetim ${fmtUnitTL(avgCost)}</text>
        `;
      }
      const fairP = Number(info?.quantPassport?.intrinsicPriceTL) || 0;
      if (fairP >= minV && fairP <= maxV && Math.abs(fairP - avgCost) > (maxV - minV) * 0.06) {
        const fy = yAt(fairP);
        refLinesSvg += `
          <line x1="0" y1="${fy}" x2="${w}" y2="${fy}" stroke="#38bdf8" stroke-width="1.1" stroke-dasharray="4,3" opacity="0.8"></line>
          <text x="${w - 4}" y="${Math.max(10, fy - 3)}" text-anchor="end" fill="#38bdf8" font-size="8.6" font-weight="800">Adil Değer ${fmtUnitTL(fairP)}</text>
        `;
      }
    }

    const startLbl = fmtChartDateLabel(pts[0].t, rangeAtCall);
    const endLbl = fmtChartDateLabel(pts[pts.length - 1].t, rangeAtCall);

    stage.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.28"/>
            <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="0" y1="${padTop}" x2="${w}" y2="${padTop}" stroke="rgba(148,163,184,0.12)" stroke-width="1"></line>
        <line x1="0" y1="${padTop + plotH / 2}" x2="${w}" y2="${padTop + plotH / 2}" stroke="rgba(148,163,184,0.10)" stroke-width="1" stroke-dasharray="2,3"></line>
        <line x1="0" y1="${padTop + plotH}" x2="${w}" y2="${padTop + plotH}" stroke="rgba(148,163,184,0.15)" stroke-width="1"></line>
        ${refLinesSvg}
        <polygon points="0,${padTop + plotH} ${polyCoords} ${w},${padTop + plotH}" fill="url(#${gradId})"></polygon>
        <polyline points="${polyCoords}" fill="none" stroke="${strokeColor}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"></polyline>
        <line id="aeCrossLine" x1="0" y1="${padTop}" x2="0" y2="${padTop + plotH}" stroke="#f8fafc" stroke-width="1.1" stroke-dasharray="2,2" visibility="hidden"></line>
        <circle id="aeCrossDot" cx="0" cy="0" r="4.3" fill="${strokeColor}" stroke="#ffffff" stroke-width="1.8" visibility="hidden"></circle>
        <text x="2" y="${h - 3}" fill="rgba(148,163,184,0.78)" font-size="8.6" font-weight="700">${esc(startLbl)}</text>
        <text x="${w - 2}" y="${h - 3}" text-anchor="end" fill="rgba(148,163,184,0.78)" font-size="8.6" font-weight="700">${esc(endLbl)}</text>
      </svg>
    `;

    const realityExplain = realityAtCall === 'REAL'
      ? `TÜFE Enflasyonu Arındırılmış Bugünkü Alım Gücü`
      : (realityAtCall === 'USD' ? `Dolar ($) Bazlı Karşılık` : `Nominal TL Fiyat Serisi`);

    const applyIndexReadout = (idx, isScrubbing) => {
      const p = pts[idx];
      const v = vals[idx];
      const chgFromStart = +(((v / startV) - 1) * 100).toFixed(2);
      const eq100k = Math.round(100000 * (endV / Math.max(1e-9, v)));
      const fromStart100k = Math.round(100000 * (v / startV));

      valEl.textContent = fmtRealityPrice(v, realityAtCall, payload.isRateCurve);
      subEl.textContent = isScrubbing
        ? `📍 ${fmtChartDateLabel(p.t, rangeAtCall)} · Başlangıca göre ${chgFromStart >= 0 ? '+' : ''}%${chgFromStart}`
        : `${realityExplain} (${startLbl} -> ${endLbl})`;
      badgeEl.className = `ms-sig-pill ${chgFromStart >= 0 ? 'good' : 'danger'}`;
      badgeEl.textContent = `${chgFromStart >= 0 ? '+' : ''}%${chgFromStart}`;

      if (lbl100k && val100k) {
        if (isScrubbing && idx < pts.length - 1) {
          if (realityAtCall === 'USD') {
            const eqUsd10k = Math.round(10000 * (endV / Math.max(1e-9, v)));
            lbl100k.innerHTML = `${esc(fmtChartDateLabel(p.t, rangeAtCall))} <strong>$10.000</strong> -> Bugün:`;
            val100k.textContent = `$${eqUsd10k.toLocaleString('tr-TR')}`;
            val100k.className = eqUsd10k >= 10000 ? 'pos' : 'neg';
          } else {
            lbl100k.innerHTML = realityAtCall === 'REAL'
              ? `${esc(fmtChartDateLabel(p.t, rangeAtCall))} <strong>100.000 ₺ Alım Gücü</strong> -> Bugün:`
              : `${esc(fmtChartDateLabel(p.t, rangeAtCall))} <strong>100.000 ₺</strong> -> Bugün:`;
            val100k.textContent = fmtTL(eq100k);
            val100k.className = eq100k >= 100000 ? 'pos' : 'neg';
          }
        } else {
          lbl100k.innerHTML = realityAtCall === 'REAL'
            ? `Dönem Başı <strong>100.000 ₺ Alım Gücü</strong> -> Bugün:`
            : (realityAtCall === 'USD' ? `Dönem Başı <strong>$10.000</strong> -> Bugün:` : `Dönem Başı <strong>100.000 ₺</strong> -> Bugün:`);
          if (realityAtCall === 'USD') {
            const endUsd10k = Math.round(10000 * (endV / startV));
            val100k.textContent = `$${endUsd10k.toLocaleString('tr-TR')}`;
            val100k.className = endUsd10k >= 10000 ? 'pos' : 'neg';
          } else {
            val100k.textContent = fmtTL(fromStart100k);
            val100k.className = fromStart100k >= 100000 ? 'pos' : 'neg';
          }
        }
      }
    };

    applyIndexReadout(pts.length - 1, false);

    const crossLine = stage.querySelector('#aeCrossLine');
    const crossDot = stage.querySelector('#aeCrossDot');
    let lastIdx = -1;
    let lastHapMs = 0;

    const handleScrubAtClientX = (clientX) => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width) return;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const idx = Math.max(0, Math.min(pts.length - 1, Math.round(ratio * (pts.length - 1))));
      const cx = xAt(idx);
      const cy = yAt(vals[idx]);
      if (crossLine && crossDot) {
        crossLine.setAttribute('x1', cx);
        crossLine.setAttribute('x2', cx);
        crossLine.setAttribute('visibility', 'visible');
        crossDot.setAttribute('cx', cx);
        crossDot.setAttribute('cy', cy);
        crossDot.setAttribute('visibility', 'visible');
      }
      if (idx !== lastIdx) {
        lastIdx = idx;
        applyIndexReadout(idx, true);
        const nowT = Date.now();
        if (nowT - lastHapMs > 42) {
          lastHapMs = nowT;
          AetherNative.haptic('selection');
        }
      }
    };

    const endScrub = () => {
      lastIdx = -1;
      if (crossLine) crossLine.setAttribute('visibility', 'hidden');
      if (crossDot) crossDot.setAttribute('visibility', 'hidden');
      applyIndexReadout(pts.length - 1, false);
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let scrubDirectionLock = null;

    stage.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        scrubDirectionLock = null;
        handleScrubAtClientX(touchStartX);
      }
    }, { passive: true });
    stage.addEventListener('touchmove', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      const cx = e.touches[0].clientX;
      const cy = e.touches[0].clientY;
      if (!scrubDirectionLock) {
        const dx = Math.abs(cx - touchStartX);
        const dy = Math.abs(cy - touchStartY);
        if (dx + dy > 5) {
          scrubDirectionLock = dx >= dy * 0.72 ? 'x' : 'y';
        }
      }
      if (scrubDirectionLock === 'y') {
        endScrub();
        return;
      }
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      handleScrubAtClientX(cx);
    }, { passive: false });
    stage.addEventListener('touchend', () => { scrubDirectionLock = null; endScrub(); }, { passive: true });
    stage.addEventListener('touchcancel', () => { scrubDirectionLock = null; endScrub(); }, { passive: true });
    stage.addEventListener('mousemove', (e) => handleScrubAtClientX(e.clientX));
    stage.addEventListener('mouseleave', endScrub);
  }

  async function hydrateDuelDualChart(assetA, assetB) {
    const K = global.AetherKernelV10;
    const mount = document.getElementById('aeDuelDualChartMount');
    if (!K?.fetchAssetChartSeries || !mount || !assetA || !assetB) return;
    const reality = drawerChartReality;
    const [pA, pB] = await Promise.all([
      K.fetchAssetChartSeries(assetA.key, '1Y'),
      K.fetchAssetChartSeries(assetB.key, '1Y')
    ]);
    const curMount = document.getElementById('aeDuelDualChartMount');
    if (!curMount || modalMode !== 'ASSET' || drawerSubTab !== 'DUEL') return;

    const ptsA = pA?.points || [];
    const ptsB = pB?.points || [];
    if (ptsA.length < 2 || ptsB.length < 2) return;

    const pick = (p) => reality === 'REAL' ? Number(p.realTl) : (reality === 'USD' ? Number(p.usd) : Number(p.tl));
    const baseA = Math.max(1e-9, pick(ptsA[0]));
    const baseB = Math.max(1e-9, pick(ptsB[0]));
    const normA = ptsA.map((p) => 100000 * (pick(p) / baseA));
    const normB = ptsB.map((p) => 100000 * (pick(p) / baseB));

    const allV = [...normA, ...normB];
    const minV = Math.min(...allV) * 0.985;
    const maxV = Math.max(...allV) * 1.015;
    const w = 330, h = 118, pad = 10;
    const yAt = (v) => +(pad + (h - pad * 2) - ((v - minV) / Math.max(1, maxV - minV)) * (h - pad * 2)).toFixed(1);
    const polyA = normA.map((v, i) => `${((i / (normA.length - 1)) * w).toFixed(1)},${yAt(v)}`).join(' ');
    const polyB = normB.map((v, i) => `${((i / (normB.length - 1)) * w).toFixed(1)},${yAt(v)}`).join(' ');
    const endA = Math.round(normA[normA.length - 1]);
    const endB = Math.round(normB[normB.length - 1]);
    const y100 = yAt(100000);

    curMount.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:11.2px;margin-bottom:5px;gap:6px;flex-wrap:wrap">
        <span style="color:#fbbf24;font-weight:900">● ${esc(assetA.ticker)}: ${fmtTL(endA)}</span>
        <span style="font-size:10px;color:var(--ink-400)">1 Yıllık 100B ₺ (${reality === 'REAL' ? '🥖 Reel Güç' : (reality === 'USD' ? '$ Dolar' : '₺ TL')})</span>
        <span style="color:#38bdf8;font-weight:900">● ${esc(assetB.ticker)}: ${fmtTL(endB)}</span>
      </div>
      <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:118px;display:block" preserveAspectRatio="none">
        ${y100 >= pad && y100 <= h - pad ? `<line x1="0" y1="${y100}" x2="${w}" y2="${y100}" stroke="rgba(148,163,184,0.28)" stroke-width="1" stroke-dasharray="3,3"></line>` : ''}
        <polyline points="${polyB}" fill="none" stroke="#38bdf8" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"></polyline>
        <polyline points="${polyA}" fill="none" stroke="#f59e0b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></polyline>
      </svg>
    `;
  }

  function computeOrderRipplePreview(asset, amountTL) {
    const K = global.AetherKernelV10;
    const clock = K.getTurkishClock();
    const snap = K.evaluateMemberPortfolio();
    const amt = Math.max(0, Number(amountTL) || 0);

    let frictionTL = 0;
    let timingText = 'Anında eşleşir';
    let monthlyDripTL = 0;

    if (asset.venue === 'TWO_DOOR') {
      const sp = selectedDoor === 'BAZAAR'
        ? clock.bazaarSpreadPct
        : (selectedDoor === 'NOBETCI' ? clock.nobetciSpreadPct : clock.bankSpreadPct);
      const bsmv = selectedDoor === 'BANK' ? 0.20 : 0;
      frictionTL = Math.round(amt * ((sp / 2 + bsmv) / 100));
      timingText = selectedDoor === 'BAZAAR'
        ? (clock.grandBazaarOpen ? 'Çarşı anında (%0 vergi)' : 'Çarşı kapalı (09:30)')
        : (selectedDoor === 'NOBETCI'
          ? (clock.nobetciOpen ? 'Nöbetçi anında (%0 vergi)' : 'Nöbetçi kapalı (10:00)')
          : 'Mobil Banka 7/24 (%0,2 vergi)');
    } else if (asset.venue === 'BIST') {
      frictionTL = Math.round(amt * 0.00084);
      if (clock.bistCanMatchNow) {
        timingText = 'Anında eşleşir (Satışta T+2)';
      } else {
        const auc = K.getNextBistAuctionMatchInfo ? K.getNextBistAuctionMatchInfo(clock.ms) : { sessionLabel: '10:00 Açılış Eşleşmesi' };
        timingText = `Sıraya girer (${auc.sessionLabel})`;
      }
      if (asset.bistRow?.dividendYield > 0) {
        monthlyDripTL = Math.round((amt * (asset.bistRow.dividendYield / 100) * 0.85) / 12);
      }
    } else if (asset.venue === 'TEFAS') {
      timingText = (asset.subVenue === 'TEFAS_PPF' && clock.tefasBeforeCutoff)
        ? '13:30 öncesi: T+0 bugün işler'
        : 'TEFAS Valör (+1/+2 iş günü)';
      const netR = asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100);
      monthlyDripTL = Math.round((amt * (netR / 100)) / 12);
    } else if (asset.venue === 'BANK_RATE') {
      let stp = asset.stopajPct;
      if (asset.subVenue === 'TERM_DEPOSIT') {
        stp = selectedMaturity > 365 ? 10 : (selectedMaturity > 180 ? 15 : 17.5);
        timingText = `${selectedMaturity} gün kilitli (Erken bozarsan yanar)`;
      } else if (!clock.isBizDay && asset.subVenue === 'GOV_BOND') {
        timingText = 'Tatil/Hafta sonu gişe kapalı';
      }
      const netR = asset.annualGrossRatePct * (1 - stp / 100);
      monthlyDripTL = Math.round((amt * (netR / 100)) / 12);
    } else if (asset.venue === 'GLOBAL_USD') {
      frictionTL = Math.round(amt * 0.0015);
      timingText = clock.isWeekend
        ? 'Hafta sonu kapalı (Pzt açılır)'
        : (clock.globalNyOpen ? 'ABD Seansı Açık · Anında' : 'Küresel Kotasyon · Anında');
      if (asset.id === 'eurobond-usdtr' || asset.id === 'eurobond-emb') {
        monthlyDripTL = Math.round((amt * 0.055) / 12);
      }
    } else if (asset.venue === 'VIOP') {
      frictionTL = Math.round(amt * 0.0010);
      timingText = clock.viopOpen
        ? (clock.viopEvening ? '19:00 Akşam Seansı · Anında' : 'VİOP Seansı · Anında')
        : 'VİOP Kapalı (09:30 / 19:00)';
    } else {
      frictionTL = Math.round(amt * 0.0010);
      timingText = '7/24 Kesintisiz · Anında';
    }

    const existingSpotVal = snap.spotItems.find((x) => x.assetKey === asset.key)?.netValTL || 0;
    const existingTrancheVal = snap.tranches.filter((t) => t.assetKey === asset.key).reduce((s, t) => s + (t.accruedNetValueTL || 0), 0);
    const newSingleSharePct = Math.min(100, Math.round(((existingSpotVal + existingTrancheVal + amt) / Math.max(1, snap.totalNetWorthTL)) * 100));

    return { frictionTL, timingText, monthlyDripTL, newSingleSharePct };
  }

  function renderInteractiveCycleSvg(info) {
    const mh = info?.multiHorizon;
    const r52 = info?.range52W;
    if (!mh || !Array.isArray(mh.horizons) || mh.horizons.length === 0) return '';

    let sparkSvg = '';
    if (Array.isArray(mh.sparklinePts) && mh.sparklinePts.length >= 4) {
      const pts = mh.sparklinePts;
      const w = 300, h = 64;
      const coords = pts.map((val, i) => {
        const x = +((i / Math.max(1, pts.length - 1)) * w).toFixed(1);
        const y = +(h - (Math.max(0, Math.min(100, Number(val) || 50)) / 100) * (h - 10) - 5).toFixed(1);
        return `${x},${y}`;
      });
      const isUp = pts[pts.length - 1] >= pts[0];
      const stroke = isUp ? '#10b981' : '#f43f5e';
      const fill = isUp ? 'rgba(16,185,129,0.16)' : 'rgba(244,63,94,0.14)';
      sparkSvg = `
        <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:64px;display:block;margin-bottom:8px" preserveAspectRatio="none">
          <polygon points="0,${h} ${coords.join(' ')} ${w},${h}" fill="${fill}"></polygon>
          <polyline points="${coords.join(' ')}" fill="none" stroke="${stroke}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"></polyline>
        </svg>
      `;
    }

    return `
      <div class="ae-card" style="background:var(--surface-2);margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px">
          <strong style="font-size:13.2px">Zaman Döngüsü & Enflasyon Terazisi</strong>
          ${r52 ? `<span style="font-size:11px;color:var(--ink-400);font-weight:700">52H Dip ${fmtUnitTL(r52.low)} · Zirve ${fmtUnitTL(r52.high)} (${r52.drawdownPct}%)</span>` : ''}
        </div>
        ${sparkSvg}
        <div class="ae-hscroll" style="padding-bottom:2px">
          ${mh.horizons.map((hz) => `
            <div style="flex-shrink:0;min-width:82px;background:var(--surface-1);border:1px solid var(--line-subtle);border-radius:10px;padding:7px 8px;text-align:center">
              <span style="display:block;font-size:10px;font-weight:800;color:var(--ink-400)">${esc(hz.label)}</span>
              <strong style="display:block;font-size:12.6px">${hz.nominalPct >= 0 ? '+' : ''}%${hz.nominalPct}</strong>
              <small style="display:block;font-size:10.3px;font-weight:800" class="${hz.realPct >= 0 ? 'pos' : 'neg'}">Reel ${hz.realPct >= 0 ? '+' : ''}%${hz.realPct}</small>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderHealthVaultHtml(info, assetObj) {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const h = info?.health;
    const dx = info?.deepXray;
    const q5 = (assetObj && G?.computeFiveQuestionCompanyXray) ? G.computeFiveQuestionCompanyXray(assetObj) : null;
    let q5Html = '';
    if (q5) {
      q5Html = `
        <div class="ae-card" style="background:var(--surface-2);border-color:rgba(240,180,41,0.34);margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px">
            <strong style="font-size:13.8px;color:var(--gold-bright)">🔎 5 Soruda ${esc(q5.ticker)} Şirket Röntgeni</strong>
            <span class="ms-sig-pill ${q5.redCount === 0 && q5.greenCount >= 4 ? 'good' : (q5.redCount >= 2 ? 'danger' : 'warn')}">${q5.greenCount}/5 Yeşil</span>
          </div>
          <p style="margin:0 0 8px;font-size:12px;color:var(--ink-200)">${esc(q5.summaryLine)}</p>
          <div class="ae-q5-list">
            ${q5.questions.map((item) => `
              <div class="ae-q5-row ${esc(item.tone)}">
                <div class="ae-q5-head">
                  <strong>${item.num}. ${esc(item.q)}</strong>
                  <span class="ms-sig-pill ${item.tone === 'good' ? 'good' : (item.tone === 'red' ? 'danger' : 'warn')}">${esc(item.badge)}</span>
                </div>
                <div class="ae-q5-body">${esc(item.verdict)}</div>
              </div>
            `).join('')}
          </div>
          <div style="display:flex;gap:7px;flex-wrap:wrap">
            <button type="button" class="ms-btn primary sm" style="flex:1" data-vault-limit-price="${q5.suggestedLimitBuyTL}">
              🎯 ${fmtUnitTL(q5.suggestedLimitBuyTL)}’den Limit Alım Kur
            </button>
            <button type="button" class="ms-btn sm" data-vault-alert-price="${q5.suggestedLimitBuyTL}">
              🔔 Alarm Kur
            </button>
          </div>
        </div>
      `;
    }
    let topVaultHtml = '';

    if (h?.kind === 'FINANCIAL') {
      const fn = h.financial100k;
      const baseLbl = fn?.partnerBaseTL ? fmtTL(fn.partnerBaseTL) : '100.000 ₺';
      topVaultHtml = `
        <div class="ae-card" style="background:var(--surface-2);margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px">
            <strong style="font-size:13.6px">🏦 Finans Kasası (${baseLbl} Ortaklıkta Payın)</strong>
            <span style="font-size:11.4px;font-weight:700;color:var(--ink-400)">F/K ${h.pe ?? '-'} · PD/DD ${h.pb ?? '-'}</span>
          </div>
          ${fn ? `
            <p style="margin:0 0 8px;font-size:12.2px;color:var(--ink-200)">${esc(fn.plainSummary)}</p>
            <div class="ms-bakery-grid">
              <div class="ms-bakery-cell"><span>Günlük Net Kâr Payın</span><strong class="${fn.dailyNetProfitTL >= 0 ? 'pos' : 'neg'}">${fn.dailyNetProfitTL >= 0 ? '+' : ''}${fn.dailyNetProfitTL.toLocaleString('tr-TR')} ₺/gün</strong></div>
              <div class="ms-bakery-cell"><span>Yıllık Net Kâr Payın</span><strong class="${fn.annualNetProfitTL >= 0 ? 'pos' : 'neg'}">${fn.annualNetProfitTL >= 0 ? '+' : ''}${fmtTL(fn.annualNetProfitTL)}</strong></div>
              <div class="ms-bakery-cell"><span>Özsermaye Büyümesi</span><strong>${fn.roePct != null ? '%' + fn.roePct : '-'}</strong></div>
              <div class="ms-bakery-cell"><span>Yıllık Net Temettü</span><strong class="${fn.annualNetDivTL > 0 ? 'pos' : ''}">${fn.annualNetDivTL > 0 ? '+' + fmtTL(fn.annualNetDivTL) : 'Yok'}</strong></div>
            </div>
          ` : ''}
        </div>
      `;
    } else if (h?.kind === 'COMPANY') {
      const bk = h.bakery100k;
      const baseLbl = bk?.partnerBaseTL ? fmtTL(bk.partnerBaseTL) : '100.000 ₺';
      topVaultHtml = `
        <div class="ae-card" style="background:var(--surface-2);margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px">
            <strong style="font-size:13.6px">🥖 Mahalle Fırını Hesabı (${baseLbl} Ortaklık)</strong>
            ${h.pe != null ? `<span style="font-size:11.4px;font-weight:700;color:var(--ink-400)">F/K ${h.pe} · PD/DD ${h.pb ?? '-'}</span>` : ''}
          </div>
          ${bk ? `
            <p style="margin:0 0 8px;font-size:12.2px;color:var(--ink-200)">${esc(bk.plainSummary)}</p>
            <div class="ms-bakery-grid">
              <div class="ms-bakery-cell"><span>Günlük Esas Nakit</span><strong class="${bk.dailyOcfTL >= 0 ? 'pos' : 'neg'}">${bk.dailyOcfTL >= 0 ? '+' : ''}${bk.dailyOcfTL.toLocaleString('tr-TR')} ₺/gün</strong></div>
              <div class="ms-bakery-cell"><span>Yıllık Serbest Nakit (FCF)</span><strong class="${bk.annualFcfTL >= 0 ? 'pos' : 'warn-txt'}">${bk.annualFcfTL >= 0 ? '+' : ''}${fmtTL(bk.annualFcfTL)}</strong></div>
              <div class="ms-bakery-cell"><span>Hazır Kasa Payın</span><strong>${fmtTL(bk.cashShareTL)}</strong></div>
              <div class="ms-bakery-cell"><span>Sırtına Binen Borç</span><strong class="${bk.debtShareTL > bk.cashShareTL * 2 ? 'neg' : ''}">${fmtTL(bk.debtShareTL)}</strong></div>
            </div>
          ` : ''}
        </div>
      `;
    } else if (h?.kind === 'GOLD_SPREAD') {
      topVaultHtml = `
        <div class="ms-alert ${h.status === 'WARN' ? 'warn' : 'ok'}">
          <strong>Terazi Kontrolü:</strong> Kapalıçarşı 1 Gr Fiziki Altın <strong>${fmtTL(h.spotGramTL)}</strong> vs 100 Adet ALTIN.S1 <strong>${fmtTL(h.s1GramTL)}</strong>.<br/>
          ${esc(h.verdict)}
        </div>
      `;
    } else if (h?.kind === 'RATE_VS_INF') {
      topVaultHtml = `
        <div class="ms-alert ${h.status === 'GOOD' ? 'ok' : 'warn'}">
          <strong>Vergi Sonrası Net Getiri:</strong> Brüt %${h.grossPct.toFixed(1)} -> %${h.stopajPct} stopaj sonrası yıllık <strong>net %${h.netPct}</strong> (TÜFE: %${h.inflationPct.toFixed(1)}). ${esc(h.verdict)}
        </div>
      `;
    }

    let xrayHtml = '';
    if (dx) {
      xrayHtml = `
        <div class="ae-xray-header">
          <div style="min-width:0;flex:1">
            <span style="font-size:10.6px;font-weight:800;color:var(--gold-bright);text-transform:uppercase">Adli Kasa & Değerleme Röntgeni</span>
            <div style="font-size:14.2px;font-weight:900;margin-top:1px">${esc(dx.gradeLabel)}</div>
            <div style="font-size:11.6px;color:var(--ink-200);margin-top:3px;line-height:1.35">${esc(dx.valueTrapVerdict)}</div>
          </div>
          <div class="ae-score-orb ${esc(dx.tone || 'info')}">
            <span style="font-size:17px">${dx.overallScore}</span>
            <small style="font-size:9px;opacity:0.8">/100</small>
          </div>
        </div>

        <div class="ae-pillar-list" style="margin-bottom:10px">
          ${(dx.pillars || []).map((pl) => {
            const barCls = pl.score >= 76 ? 'green' : (pl.score >= 52 ? 'amber' : 'red');
            return `
              <div class="ae-pillar-card">
                <div class="ae-pillar-top">
                  <span>${esc(pl.label)}</span>
                  <span style="color:var(--ink-200)">${pl.score}p</span>
                </div>
                <div class="ae-pillar-metric">${esc(pl.metric)}</div>
                <div class="ms-bar-track" style="height:5px"><div class="ms-bar-fill ${barCls}" style="width:${pl.score}%"></div></div>
                <div class="ae-pillar-exp">${esc(pl.explain)}</div>
              </div>
            `;
          }).join('')}
        </div>

        ${(dx.kitchenFindings || []).length > 0 ? `
          <div class="ae-card" style="background:var(--surface-2);margin-bottom:10px">
            <strong style="display:block;font-size:12.8px;margin-bottom:6px;color:var(--gold-bright)">🕵️ Canlı Mutfak & Takas İstihbaratı Bulguları</strong>
            <div class="ms-list">
              ${dx.kitchenFindings.map((kf) => `
                <div class="ms-list-row" style="padding:8px 10px;flex-direction:column;align-items:stretch;gap:4px">
                  <span class="ms-sig-pill ${esc(kf.tone || 'info')}" style="align-self:flex-start">${esc(kf.badge)}</span>
                  <div style="font-size:11.6px;color:var(--ink-200)">${esc(kf.note)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      `;
    }

    let quantHtml = '';
    const qp = info?.quantPassport || null;
    if (qp) {
      quantHtml = `
        <details class="ae-guide-acc" open style="margin-bottom:10px">
          <summary>
            <span style="display:flex;align-items:center;gap:8px;min-width:0">
              <span class="ae-step-tag">${esc(qp.badgeTag || (qp.totalBars ? qp.totalBars + 'G' : 'ADİL'))}</span>
              <span style="line-height:1.28">${esc(qp.title || '10 Yıllık Ampirik İkiz Günler & Adil Değer Testi')}</span>
            </span>
          </summary>
          <div class="ae-guide-body" style="padding-top:10px">
            <div style="font-size:11.4px;color:var(--ink-400);margin-bottom:8px">
              ${qp.dateRange ? `Yöntem / Kapsam: <strong style="color:var(--ink-200)">${esc(qp.dateRange)}</strong>` : ''}
              ${qp.walkForwardHitPct != null ? ` · Walk-Forward İsabet: <strong class="${qp.walkForwardHitPct >= 55 ? 'pos' : 'warn-txt'}">%${qp.walkForwardHitPct}</strong>` : ''}
            </div>

            <div class="ms-bakery-grid" style="margin-bottom:8px">
              ${qp.kind === 'RATE_EMPIRICAL_10Y' ? `
                <div class="ms-bakery-cell">
                  <span>Net Oran & Fisher Farkı</span>
                  <strong style="font-size:13px" class="pos">Net %${qp.netAnnualPct}/Yıl</strong>
                  <small class="${(qp.fisherSpreadPct || 0) >= 0 ? 'pos' : 'neg'}">${(qp.fisherSpreadPct || 0) >= 0 ? '+' : ''}${qp.fisherSpreadPct}p TÜFE Farkı</small>
                </div>
                <div class="ms-bakery-cell">
                  <span>1A Dolar Başabaş & Kelly</span>
                  <strong style="font-size:13px">${qp.usdBreakeven1M != null ? fmtUnitTL(qp.usdBreakeven1M) : '-'}</strong>
                  <small>Yarım-Kelly Tavanı: %${qp.kellyPct ?? 0}</small>
                </div>
              ` : ''}
              ${qp.intrinsicPriceTL != null ? `
                <div class="ms-bakery-cell">
                  <span>İçsel Adil Değer</span>
                  <strong style="font-size:13px">${fmtUnitTL(qp.intrinsicPriceTL)}</strong>
                  <small class="${(qp.marginOfSafetyPct || 0) >= 0 ? 'pos' : 'neg'}">${(qp.marginOfSafetyPct || 0) >= 0 ? `+%${qp.marginOfSafetyPct} Güvenlik Marjı` : `%${qp.marginOfSafetyPct} Primli`}</small>
                </div>
              ` : ''}
              ${qp.piotroskiScore != null ? `
                <div class="ms-bakery-cell">
                  <span>9-Kriter Kasa & Kelly</span>
                  <strong style="font-size:13px" class="${qp.piotroskiScore >= 6 ? 'pos' : (qp.piotroskiScore <= 3 ? 'neg' : '')}">${qp.piotroskiScore}/9 Sağlamlık</strong>
                  <small>Yarım-Kelly Tavanı: %${qp.kellyPct ?? 0}</small>
                </div>
              ` : ''}
              ${qp.supportTL != null || qp.resistanceTL != null ? `
                <div class="ms-bakery-cell">
                  <span>${qp.kind === 'FUNDAMENTAL_QUANT' ? '52H Taban / Tavan' : 'Ampirik Destek / Direnç'}</span>
                  <strong style="font-size:12.6px">${qp.supportTL != null ? fmtUnitTL(qp.supportTL) : '-'} / ${qp.resistanceTL != null ? fmtUnitTL(qp.resistanceTL) : '-'}</strong>
                  <small>${qp.cvar95Pct != null ? `CVaR-95 Uç Risk: %${qp.cvar95Pct} · Hurst: ${qp.hurst ?? '-'}` : 'Kademeli Alım/Direnç Bandı'}</small>
                </div>
              ` : ''}
            </div>

            ${(qp.analogs || []).length > 0 ? `
              <div style="font-size:11.5px;font-weight:800;color:var(--gold-bright);margin-bottom:5px">🪞 Tarihteki En Benzer ${qp.analogs[0].sampleCount || 25} İkiz Günden Sonra Ne Oldu?</div>
              <div class="ms-list" style="margin-bottom:8px">
                ${qp.analogs.map((an) => `
                  <div class="ms-list-row" style="padding:7px 10px;font-size:11.6px">
                    <span><strong>${esc(an.horizon)} Sonra:</strong> Pozitif %${an.winRatePct} · Mevduatı Geçme %${an.hurdleWinPct ?? '-'}</span>
                    <strong class="${(an.expectedPct || 0) >= 0 ? 'pos' : 'neg'}">${(an.expectedPct || 0) >= 0 ? '+' : ''}%${an.expectedPct}</strong>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${qp.preRallyHistoryText ? `
              <div style="font-size:11.5px;color:var(--ink-200);background:var(--surface-2);border-radius:9px;padding:8px 10px;margin-bottom:6px;line-height:1.42">
                <strong style="color:var(--cyan);display:block;margin-bottom:2px">📜 Büyük Rallilerden Önceki Parmak İzi:</strong>
                ${esc(qp.preRallyHistoryText)}
              </div>
            ` : ''}

            ${qp.bullCondition || qp.bearCondition ? `
              <div style="display:grid;gap:4px;font-size:11.4px;color:var(--ink-400)">
                ${qp.bullCondition ? `<div><strong class="pos">Boğa Kuralı:</strong> ${esc(qp.bullCondition)}</div>` : ''}
                ${qp.bearCondition ? `<div><strong class="neg">Ayı Kuralı:</strong> ${esc(qp.bearCondition)}</div>` : ''}
              </div>
            ` : ''}
          </div>
        </details>
      `;
    }

    return q5Html + topVaultHtml + xrayHtml + quantHtml;
  }

  function buildPreTradeMentorBoxHtml(asset) {
    const G = global.RealInvestmentGuide;
    if (!G?.getPreTradeMentorCheck || !asset) return '';
    const chk = G.getPreTradeMentorCheck({
      assetKey: asset.key,
      amountTL: draftOrderAmount,
      door: selectedDoor,
      maturityDays: selectedMaturity,
      useMargin: selectedUseMargin
    });
    if (!chk) return '';
    const cls = chk.tone === 'danger' ? 'err' : (chk.tone === 'warn' ? 'warn' : 'info');
    return `
      <div class="ms-alert ${cls}" style="margin:0 0 10px;padding:9px 11px;font-size:11.8px">
        <strong style="display:block;margin-bottom:2px">🧭 ${esc(chk.title)}</strong>
        <div>${esc(chk.text)}</div>
        ${chk.altAssetKey ? `<button type="button" class="ms-btn sm" data-jump-order-asset="${esc(chk.altAssetKey)}" style="margin-top:6px;padding:4px 9px;font-size:11px">⚡ ${esc(chk.altLabel || 'Alternatife Geç')}</button>` : ''}
      </div>
    `;
  }

  function bindMentorJumpButtons(root) {
    root?.querySelectorAll('[data-jump-order-asset]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('light');
        openAssetDrawer(b.getAttribute('data-jump-order-asset'), 'ORDER');
      });
    });
  }

  function estimatePlainUnitPurchase(asset, amountTL, overridePriceTL = 0) {
    const amt = Math.max(0, Number(amountTL) || 0);
    if (!asset || amt <= 0) return '';
    if (asset.isRateInstrument) {
      const netR = asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100);
      const m = Math.round((amt * (netR / 100)) / 12);
      return `Aylık net ~+${fmtTL(m)} gelir üretir`;
    }
    const p = Number(overridePriceTL) > 0 ? Number(overridePriceTL) : (Number(asset.priceTL) || 0);
    if (p <= 0) return '';
    const atSuffix = Number(overridePriceTL) > 0 ? ` (${fmtUnitTL(p)} hedefinde)` : '';
    if (asset.subVenue === 'BIST_STOCK') {
      const lots = Math.floor((amt * (1 - 0.00084)) / p);
      return `Yaklaşık ${lots.toLocaleString('tr-TR')} adet (lot) hisse alırsın${atSuffix}`;
    }
    if (asset.id === 'gram-altin-spot' || asset.id === 'gram-gumus-spot') {
      const gr = +(amt / p).toFixed(2);
      return `Yaklaşık ${gr.toLocaleString('tr-TR')} gram alırsın${atSuffix}`;
    }
    const qty = +(amt / p).toFixed(p >= 100 ? 2 : 3);
    return `Yaklaşık ${qty.toLocaleString('tr-TR')} birim alırsın${atSuffix}`;
  }

  function updateLiveRippleBoxInSheet(asset) {
    const unitEl = document.getElementById('aeEstUnitsLine');
    if (unitEl && asset) {
      const trigOverride = (drawerOrderSide === 'BUY' && drawerBuyMode === 'LIMIT')
        ? (Number(document.getElementById('aeCondTriggerInp')?.value) || draftTriggerPriceTL || 0)
        : 0;
      unitEl.textContent = estimatePlainUnitPurchase(asset, draftOrderAmount, trigOverride);
    }
    const box = document.getElementById('aeLiveRippleBox');
    if (box && asset) {
      const ripple = computeOrderRipplePreview(asset, draftOrderAmount);
      box.innerHTML = `
        <div class="ms-bakery-cell"><span>Ne Zaman Geçer?</span><strong style="font-size:12.6px">${esc(ripple.timingText)}</strong></div>
        <div class="ms-bakery-cell"><span>Gişe & Makas Maliyeti</span><strong style="font-size:13px" class="${ripple.frictionTL > 0 ? 'warn-txt' : 'pos'}">${ripple.frictionTL > 0 ? '-' + fmtTL(ripple.frictionTL) : '0 ₺'}</strong></div>
        <div class="ms-bakery-cell"><span>Sepetindeki Payı</span><strong style="font-size:13px" class="${ripple.newSingleSharePct >= 65 ? 'neg' : ''}">%${ripple.newSingleSharePct}</strong></div>
        <div class="ms-bakery-cell"><span>Tahmini Aylık Gelir</span><strong style="font-size:13px" class="pos">${ripple.monthlyDripTL > 0 ? '+' + fmtTL(ripple.monthlyDripTL) + '/ay' : 'Değer Artışı'}</strong></div>
      `;
    }
    const mBox = document.getElementById('aeMentorPreCheckBox');
    if (mBox && asset) {
      mBox.innerHTML = buildPreTradeMentorBoxHtml(asset);
      bindMentorJumpButtons(mBox);
    }
    const obLine = document.getElementById('aeOrderBookSlipLine');
    if (obLine && asset && global.RealInvestmentGuide?.computeOrderBookDepth) {
      const ob = global.RealInvestmentGuide.computeOrderBookDepth(asset, draftOrderAmount);
      if (ob) {
        obLine.innerHTML = `Günlük Hacim: <strong>${fmtInt(ob.turnoverMillionTL)} Mn ₺</strong> · Adım: <strong>${ob.tick} ₺</strong> · ${fmtCompactTL(ob.orderAmountTL)} Piyasa Emri Kayması: <strong class="${ob.slippagePct >= 0.35 ? 'neg' : 'pos'}">~%${ob.slippagePct} (${ob.slippageTL > 0 ? '-' + fmtTL(ob.slippageTL) : '0 ₺'})</strong>`;
      }
    }
  }

  function renderAssetDrawer() {
    const sheet = document.getElementById('msModalSheet');
    if (!sheet || modalMode !== 'ASSET' || !drawerAssetKey) return;
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const asset = K.getAsset(drawerAssetKey);
    if (!asset) return;

    const clock = K.getTurkishClock();
    const member = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(member);
    const micro = K.inspectBoardMicrostructure(asset);
    const existingPos = member.positions?.[asset.key] || null;
    const existingSpotSnap = snap.spotItems.find((s) => s.assetKey === asset.key) || null;
    const existingTranches = snap.tranches.filter((t) => t.assetKey === asset.key);
    const existingPending = (member.pendingOrders || []).filter((o) => o.assetKey === asset.key);
    const existingConds = (member.conditionalOrders || []).filter((c) => c.assetKey === asset.key);
    const watchEntry = (member.watchlist || []).find((w) => w.assetKey === asset.key) || null;
    const supportsConditional = !asset.isRateInstrument && asset.venue !== 'TEFAS' && asset.venue !== 'BENCHMARK_ONLY' && asset.priceTL > 0;
    const orderBook = (asset.subVenue === 'BIST_STOCK' && G.computeOrderBookDepth)
      ? G.computeOrderBookDepth(asset, draftOrderAmount || 100000)
      : null;
    const partnerScaleTL = existingSpotSnap
      ? Math.max(1000, Math.round(existingSpotSnap.netValTL))
      : Math.max(1000, Math.round(draftOrderAmount || 100000));
    const info = G.explainAsset(asset, partnerScaleTL);

    const unsettledUsableForBist = (asset.venue === 'BIST' && !micro.isBrutTakas)
      ? (member.settlementQueue || []).filter((x) => x.usableForBist !== false).reduce((s, x) => s + Number(x.grossTL || 0), 0)
      : 0;
    const usableCashTL = Math.max(0, +(snap.cashTL + unsettledUsableForBist).toFixed(2));
    const minOrderTL = (asset.venue === 'BANK_RATE' || asset.venue === 'TEFAS') ? 100 : 10;
    const marginEffective = selectedUseMargin && micro.marginAllowed && drawerBuyMode === 'MARKET';
    const rawMaxPower = Math.floor(usableCashTL + (marginEffective ? Math.max(0, snap.totalNetWorthTL * 0.5 - snap.marginDebtTL) : 0));
    const maxBuyPower = Math.max(minOrderTL, rawMaxPower);
    const sliderMin = rawMaxPower > 0 && rawMaxPower < 1000 ? minOrderTL : 1000;
    const sliderMax = Math.max(sliderMin + 100, rawMaxPower > 0 ? rawMaxPower : 10000);
    const sliderStep = sliderMax <= 2000 ? 10 : (sliderMax <= 50000 ? 250 : (sliderMax <= 5000000 ? 1000 : Math.pow(10, Math.max(3, Math.floor(Math.log10(sliderMax)) - 3))));
    const chg = Number(asset.change1D) || 0;

    // 1-Satırlık Hızlı Kasa/Terazi Özeti (Her modda üstte görünür -> Kör bahis önleyici!)
    let oneLineTruth = info.shortDesc;
    if (info.bakery100k) oneLineTruth = info.bakery100k.plainSummary;
    else if (info.financial100k) oneLineTruth = info.financial100k.plainSummary;

    let tabContentHtml = '';

    if (drawerSubTab === 'ORDER') {
      let doorHtml = '';
      if (asset.venue === 'TWO_DOOR') {
        const bazCost = Math.round(100000 * (clock.bazaarSpreadPct / 200));
        const nobCost = Math.round(100000 * (clock.nobetciSpreadPct / 200));
        const bankCost = Math.round(100000 * (clock.bankSpreadPct / 200 + (drawerOrderSide === 'BUY' ? 0.002 : 0)));
        doorHtml = `
          <div style="margin:8px 0">
            <div style="font-size:11.6px;font-weight:800;color:var(--ink-400);margin-bottom:5px">İşlem Gişesini Seç (Gerçek Makas & Vergi Farkı):</div>
            <div class="ms-door-grid">
              <button type="button" class="ms-door-card ${selectedDoor === 'BAZAAR' ? 'selected' : ''}" data-door="BAZAAR">
                <div style="display:flex;justify-content:space-between;font-size:12px">
                  <strong>Kapalıçarşı</strong>
                  <span class="${clock.grandBazaarOpen ? 'pos' : 'neg'}" style="font-weight:800">${clock.grandBazaarOpen ? 'Açık' : 'Kapalı'}</span>
                </div>
                <div style="font-size:11px;color:var(--ink-400);margin-top:2px">Makas %${clock.bazaarSpreadPct.toFixed(2)} · %0 Vergi (~${bazCost} ₺/100B)</div>
              </button>
              <button type="button" class="ms-door-card ${selectedDoor === 'NOBETCI' ? 'selected' : ''}" data-door="NOBETCI">
                <div style="display:flex;justify-content:space-between;font-size:12px">
                  <strong>Nöbetçi Gişe</strong>
                  <span class="${clock.nobetciOpen ? 'pos' : 'neg'}" style="font-weight:800">${clock.nobetciOpen ? '10–22 Açık' : 'Kapalı'}</span>
                </div>
                <div style="font-size:11px;color:var(--ink-400);margin-top:2px">Makas %${clock.nobetciSpreadPct.toFixed(2)} · %0 Vergi (~${nobCost} ₺/100B)</div>
              </button>
              <button type="button" class="ms-door-card ${selectedDoor === 'BANK' ? 'selected' : ''}" data-door="BANK">
                <div style="display:flex;justify-content:space-between;font-size:12px">
                  <strong>Mobil Banka</strong>
                  <span class="${clock.bankDaytimeTight ? 'pos' : 'warn-txt'}" style="font-weight:800">${clock.bankDaytimeTight ? 'Dar' : 'Gece Makası'}</span>
                </div>
                <div style="font-size:11px;color:var(--ink-400);margin-top:2px">Makas %${clock.bankSpreadPct.toFixed(2)} + %0,2 Vergi (~${bankCost} ₺/100B)</div>
              </button>
            </div>
          </div>
        `;
      }

      let matHtml = '';
      if (asset.subVenue === 'TERM_DEPOSIT') {
        matHtml = `
          <div style="margin:8px 0">
            <div style="font-size:11.6px;font-weight:800;color:var(--ink-400);margin-bottom:5px">Vade Seçimi (Erken bozarsan tüm faiz yanar):</div>
            <div class="ae-hscroll">
              <button type="button" class="ae-chip ${selectedMaturity === 32 ? 'active' : ''}" data-mat="32">32 Gün (%17,5 Vergi)</button>
              <button type="button" class="ae-chip ${selectedMaturity === 181 ? 'active' : ''}" data-mat="181">181 Gün (%15 Vergi)</button>
              <button type="button" class="ae-chip ${selectedMaturity === 366 ? 'active' : ''}" data-mat="366">366 Gün (%10 Vergi)</button>
            </div>
          </div>
        `;
      }

      let marginHtml = '';
      if (micro.marginAllowed && clock.bistCanMatchNow && drawerOrderSide === 'BUY' && drawerBuyMode === 'MARKET') {
        marginHtml = `
          <label style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 11px;margin:8px 0;border-radius:11px;background:${selectedUseMargin ? 'var(--red-soft)' : 'var(--surface-2)'};border:1px solid ${selectedUseMargin ? 'rgba(244,63,94,0.4)' : 'var(--line-subtle)'};font-size:12px;font-weight:700;cursor:pointer">
            <span>⚡ Kredili İşlem (Yıllık %${K.getAnnualMarginRatePct()} Günlük Faiz)</span>
            <input type="checkbox" id="msUseMarginChk" ${selectedUseMargin ? 'checked' : ''} style="width:18px;height:18px" />
          </label>
        `;
      }

      if (drawerOrderSide === 'SELL' && existingPos && existingPos.qty > 0) {
        const queuedSellQty = existingPending
          .filter((o) => o.side === 'SELL')
          .reduce((s, o) => s + Number(o.qty || 0), 0);
        const availQty = Math.max(0, +(existingPos.qty - queuedSellQty).toFixed(6));
        const isIntLot = asset.subVenue === 'BIST_STOCK';
        const effectiveSellQty = (draftSellQty != null && draftSellQty > 0)
          ? (isIntLot ? Math.min(Math.floor(availQty), Math.max(1, Math.floor(draftSellQty))) : Math.min(availQty, +Number(draftSellQty).toFixed(6)))
          : (isIntLot
            ? Math.min(Math.floor(availQty), Math.max(1, Math.floor(availQty * draftSellRatio)))
            : +(availQty * draftSellRatio).toFixed(6));
        const effectivePct = availQty > 0 ? Math.min(100, Math.round((effectiveSellQty / availQty) * 100)) : 0;

        let unitBidTL = asset.priceTL;
        if (asset.venue === 'TWO_DOOR') {
          const sp = selectedDoor === 'BAZAAR' ? clock.bazaarSpreadPct : (selectedDoor === 'NOBETCI' ? clock.nobetciSpreadPct : clock.bankSpreadPct);
          unitBidTL = +(asset.priceTL * (1 - sp / 200)).toFixed(4);
        }
        const sellFeeRate = asset.venue === 'BIST' ? 0.00084 : (asset.venue === 'GLOBAL_USD' ? 0.0015 : ((asset.venue === 'CRYPTO_24_7' || asset.venue === 'VIOP') ? 0.0010 : 0));
        const grossSaleTL = effectiveSellQty * unitBidTL;
        const estStopajRatio = (asset.stopajPct > 0 && !asset.isRateInstrument && unitBidTL > existingPos.avgCostTL)
          ? ((unitBidTL - existingPos.avgCostTL) / unitBidTL) * (asset.stopajPct / 100)
          : 0;
        const estGross = Math.max(0, Math.round(grossSaleTL * (1 - sellFeeRate - estStopajRatio)));
        const showPartialRatios = !isIntLot || Math.floor(availQty) >= 2;

        const fmtCompactLots = (q) => {
          const fl = Math.floor(q);
          if (fl >= 1000000) return TR_DEC2.format(fl / 1000000) + 'M Lot';
          if (fl >= 100000) return Math.round(fl / 1000).toLocaleString('tr-TR') + 'B Lot';
          return fl.toLocaleString('tr-TR') + ' Lot';
        };
        const segAvailLbl = isIntLot
          ? fmtCompactLots(availQty)
          : (+Number(availQty).toFixed(availQty >= 10 ? 2 : 4)).toLocaleString('tr-TR');

        const snapStrictTrigger = (rawTarget, mustBeBelow) => {
          const isBist = asset.subVenue === 'BIST_STOCK';
          const pLive = Number(asset.priceTL) || 0;
          let snapped = isBist ? K.snapToBistTick(Math.max(0.01, rawTarget)) : +Math.max(0.01, rawTarget).toFixed(2);
          if (mustBeBelow && snapped >= pLive) {
            const step = isBist ? K.getBistTickSize(Math.max(0.01, pLive - 0.0001)) : 0.01;
            snapped = +(Math.max(0.01, (isBist ? K.snapToBistTick(pLive) : pLive) - step)).toFixed(2);
          } else if (!mustBeBelow && snapped <= pLive) {
            const step = isBist ? K.getBistTickSize(pLive + 0.0001) : 0.01;
            snapped = +((isBist ? K.snapToBistTick(pLive) : pLive) + step).toFixed(2);
          }
          return snapped;
        };
        const defaultCondSellP = drawerSellMode === 'TAKE_PROFIT'
          ? snapStrictTrigger(asset.priceTL * 1.15, false)
          : snapStrictTrigger(asset.priceTL * 0.92, true);
        const activeSellTrigP = (draftTriggerPriceTL > 0 && ((drawerSellMode === 'TAKE_PROFIT' && draftTriggerPriceTL > asset.priceTL) || (drawerSellMode === 'STOP_LOSS' && draftTriggerPriceTL < asset.priceTL)))
          ? draftTriggerPriceTL
          : defaultCondSellP;
        const condEstProceedsTL = Math.round(effectiveSellQty * activeSellTrigP);
        const condEstPnlTL = Math.round(effectiveSellQty * (activeSellTrigP - (existingPos.avgCostTL || activeSellTrigP)));

        tabContentHtml = `
          ${ !asset.isRateInstrument ? `
            <div class="ae-seg" style="margin-bottom:10px">
              <button type="button" class="ae-seg-btn" data-dside="BUY">Alım Yap</button>
              <button type="button" class="ae-seg-btn active" data-dside="SELL" style="color:var(--red-ink)">Satış (${segAvailLbl})</button>
            </div>
          ` : ''}

          ${supportsConditional ? `
            <div class="ae-hscroll" style="margin-bottom:8px">
              <button type="button" class="ae-chip ${drawerSellMode === 'MARKET' ? 'active' : 'sub'}" data-sell-mode="MARKET">⚡ Anlık Sat</button>
              <button type="button" class="ae-chip ${drawerSellMode === 'STOP_LOSS' ? 'active' : 'sub'}" data-sell-mode="STOP_LOSS">🛡️ Zarar Kes (Stop)</button>
              <button type="button" class="ae-chip ${drawerSellMode === 'TAKE_PROFIT' ? 'active' : 'sub'}" data-sell-mode="TAKE_PROFIT">🎯 Kâr Al (Hedef)</button>
            </div>
          ` : ''}

          ${doorHtml}

          <div class="ae-card" style="background:var(--surface-2)">
            <div style="display:flex;justify-content:space-between;font-size:12.4px;margin-bottom:8px">
              <span>Satılabilir: <strong>${availQty} ${isIntLot ? 'lot' : 'birim'}</strong> (Maliyet ${fmtUnitTL(existingPos.avgCostTL)})</span>
              <strong class="${(existingSpotSnap?.pnlNetTL || 0) >= 0 ? 'pos' : 'neg'}">${(existingSpotSnap?.pnlNetTL || 0) >= 0 ? '+' : ''}${fmtTL(existingSpotSnap?.pnlNetTL || 0)}</strong>
            </div>

            ${drawerSellMode !== 'MARKET' && supportsConditional ? `
              <div style="margin-bottom:10px;padding:10px;border-radius:12px;background:var(--surface-1);border:1px solid ${drawerSellMode === 'STOP_LOSS' ? 'rgba(244,63,94,0.4)' : 'rgba(16,185,129,0.4)'}">
                <label style="display:block;font-size:11.6px;font-weight:800;color:${drawerSellMode === 'STOP_LOSS' ? 'var(--red-ink)' : 'var(--green-ink)'};margin-bottom:5px">
                  ${drawerSellMode === 'STOP_LOSS' ? '🛡️ Zarar Kes Tetik Fiyatı (Güncel fiyatın altında):' : '🎯 Kâr Al Hedef Fiyatı (Güncel fiyatın üstünde):'}
                </label>
                <input id="aeCondTriggerInp" class="ae-input" type="number" inputmode="decimal" step="any" value="${activeSellTrigP}" style="font-weight:900;text-align:center;font-size:17px !important;padding:9px" />
                <div class="ae-hscroll" style="margin-top:7px;padding-bottom:0">
                  ${drawerSellMode === 'STOP_LOSS'
                    ? [-5, -8, -12, -15].map((p) => `<button type="button" class="ae-chip sub" data-trig-pct="${p}">%${p}</button>`).join('')
                    : [10, 15, 25, 40].map((p) => `<button type="button" class="ae-chip sub" data-trig-pct="${p}">+%${p}</button>`).join('')}
                </div>
              </div>
            ` : `
              <div style="margin-bottom:8px">
                <label style="display:block;font-size:11.3px;font-weight:800;color:var(--ink-400);margin-bottom:4px">Satılacak Miktar (${isIntLot ? 'Tam Lot' : 'Birim'}):</label>
                <input id="aeSellQtyInp" class="ae-input" type="number" inputmode="decimal" min="${isIntLot ? 1 : 0.0001}" max="${availQty}" step="${isIntLot ? 1 : 'any'}" value="${effectiveSellQty}" style="font-weight:800;text-align:center" />
              </div>
            `}

            ${showPartialRatios ? `
              <div class="ae-hscroll" style="margin-bottom:10px">
                ${(!isIntLot || Math.floor(availQty * 0.25) >= 1) ? `<button type="button" class="ae-chip ${draftSellQty == null && draftSellRatio === 0.25 ? 'active' : ''}" data-sratio="0.25">%25 Sat</button>` : ''}
                ${(!isIntLot || Math.floor(availQty * 0.5) >= 1) ? `<button type="button" class="ae-chip ${draftSellQty == null && draftSellRatio === 0.5 ? 'active' : ''}" data-sratio="0.5">%50 Yarısı</button>` : ''}
                ${(!isIntLot || Math.floor(availQty * 0.75) >= 1) ? `<button type="button" class="ae-chip ${draftSellQty == null && draftSellRatio === 0.75 ? 'active' : ''}" data-sratio="0.75">%75 Sat</button>` : ''}
                <button type="button" class="ae-chip ${draftSellQty == null && draftSellRatio === 1 ? 'active' : ''}" data-sratio="1">Tamamını Sat (${availQty})</button>
              </div>
            ` : `
              <div style="font-size:11.5px;color:var(--gold-bright);font-weight:700;margin-bottom:8px">
                Borsa İstanbul paylarında en küçük işlem birimi 1 tam lottur.
              </div>
            `}

            ${drawerSellMode !== 'MARKET' && supportsConditional ? `
              <div id="aeCondSellPreviewLine" style="font-size:11.8px;color:var(--ink-400);margin-bottom:10px">
                Tetiklenince satılacak: <strong style="color:var(--ink-100)">${effectiveSellQty} ${isIntLot ? 'lot' : 'birim'} (%${effectivePct})</strong> · Tahmini Tutar: <strong style="color:var(--ink-100)">~${fmtTL(condEstProceedsTL)}</strong> (<strong class="${condEstPnlTL >= 0 ? 'pos' : 'neg'}">${condEstPnlTL >= 0 ? '+' : ''}${fmtTL(condEstPnlTL)}</strong> maliyete göre)
              </div>
              <button type="button" class="ms-btn ${drawerSellMode === 'STOP_LOSS' ? 'sell-cta' : 'buy-cta'}" style="width:100%;padding:13px;font-size:14.8px" id="aeConfirmCondSellBtn" ${availQty <= 0 ? 'disabled' : ''}>
                ${drawerSellMode === 'STOP_LOSS' ? `🛡️ ${effectiveSellQty} ${isIntLot ? 'Lot' : 'Birim'} Zarar Kes Kalkanı Kur` : `🎯 ${effectiveSellQty} ${isIntLot ? 'Lot' : 'Birim'} Hedef Kâr Al Emri Kur`}
              </button>
            ` : `
              <div id="aeSellPreviewLine" style="font-size:11.8px;color:var(--ink-400);margin-bottom:10px">
                Satılacak: <strong style="color:var(--ink-100)">${effectiveSellQty} ${isIntLot ? 'lot' : 'birim'} (%${effectivePct})</strong> · Tahmini Net Tutar: <strong style="color:var(--ink-100)">~${fmtTL(estGross)}</strong> ·
                ${asset.venue === 'BIST'
                  ? 'BIST kuralıyla satış tutarı T+2 takas kum saatine girer (2 iş günü nakit çekilemez).'
                  : (asset.venue === 'TEFAS'
                    ? `TEFAS valör kuralıyla bozum tutarı T+${asset.sellValorDays || 1} iş gününde nakit kasana geçer${asset.stopajPct > 0 ? ` (kârdan %${asset.stopajPct} stopaj kesilir)` : ' (%0 stopaj)'}.`
                    : 'Anında nakit kasana geçer.')}
              </div>

              <button type="button" class="ms-btn sell-cta" style="width:100%;padding:13px;font-size:15px" id="aeConfirmSellBtn" ${availQty <= 0 ? 'disabled' : ''}>
                ${effectiveSellQty} ${isIntLot ? 'Lot' : 'Birim'} (%${effectivePct}) Satış Emri Ver
              </button>
            `}
          </div>

          ${existingConds.length > 0 ? `
            <div class="ms-list" style="margin-top:8px">
              ${existingConds.map((co) => `
                <div class="ms-list-row" style="border-color:rgba(240,180,41,0.38)">
                  <span style="font-size:12px">
                    ${co.kind === 'LIMIT_BUY' ? '🎯 Limit Alım' : (co.kind === 'STOP_LOSS' ? '🛡️ Zarar Kes' : '🎯 Kâr Al')}:
                    <strong>${fmtUnitTL(co.triggerPriceTL)}</strong> (${co.kind === 'LIMIT_BUY' ? fmtTL(co.reservedTL) : co.qty + ' adet'})
                  </span>
                  <button type="button" class="ms-btn danger sm" data-drawer-cancel-cond="${esc(co.id)}">İptal</button>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${existingPending.length > 0 ? `
            <div class="ms-list" style="margin-top:8px">
              ${existingPending.map((ord) => `
                <div class="ms-list-row">
                  <span style="font-size:12px">⏳ Bekleyen ${ord.side === 'BUY' ? 'Alım' : 'Satış'} (${ord.side === 'BUY' ? fmtTL(ord.reservedTL) : ord.qty + ' adet'})</span>
                  <button type="button" class="ms-btn danger sm" data-drawer-cancel-ord="${esc(ord.id)}">İptal Et</button>
                </div>
              `).join('')}
            </div>
          ` : ''}
        `;
      } else {
        const ripple = computeOrderRipplePreview(asset, draftOrderAmount);
        const segHeldLbl = existingPos && existingPos.qty > 0
          ? (asset.subVenue === 'BIST_STOCK'
            ? (Math.floor(existingPos.qty) >= 1000000
              ? TR_DEC2.format(Math.floor(existingPos.qty) / 1000000) + 'M Lot'
              : (Math.floor(existingPos.qty) >= 100000
                ? Math.round(Math.floor(existingPos.qty) / 1000).toLocaleString('tr-TR') + 'B Lot'
                : Math.floor(existingPos.qty).toLocaleString('tr-TR') + ' Lot'))
            : (+Number(existingPos.qty).toFixed(existingPos.qty >= 10 ? 2 : 4)).toLocaleString('tr-TR'))
          : '';
        const rawDefaultLimit = asset.subVenue === 'BIST_STOCK'
          ? K.snapToBistTick(Math.max(0.01, asset.priceTL * 0.96))
          : +(Math.max(0.01, asset.priceTL * 0.96)).toFixed(2);
        const defaultLimitBuyP = rawDefaultLimit >= asset.priceTL
          ? +(Math.max(0.01, (asset.subVenue === 'BIST_STOCK' ? K.snapToBistTick(asset.priceTL) : asset.priceTL) - (asset.subVenue === 'BIST_STOCK' ? K.getBistTickSize(Math.max(0.01, asset.priceTL - 0.0001)) : 0.01))).toFixed(2)
          : rawDefaultLimit;
        const activeBuyTrigP = (draftTriggerPriceTL > 0 && draftTriggerPriceTL < asset.priceTL) ? draftTriggerPriceTL : defaultLimitBuyP;

        tabContentHtml = `
          ${existingPos && existingPos.qty > 0 ? `
            <div class="ae-seg" style="margin-bottom:10px">
              <button type="button" class="ae-seg-btn active" data-dside="BUY" style="color:var(--green-ink)">Alım Ekle</button>
              <button type="button" class="ae-seg-btn" data-dside="SELL">Satış (${segHeldLbl})</button>
            </div>
          ` : ''}

          ${supportsConditional ? `
            <div class="ae-hscroll" style="margin-bottom:8px">
              <button type="button" class="ae-chip ${drawerBuyMode === 'MARKET' ? 'active' : 'sub'}" data-buy-mode="MARKET">⚡ Anlık (Piyasa)</button>
              <button type="button" class="ae-chip ${drawerBuyMode === 'LIMIT' ? 'active' : 'sub'}" data-buy-mode="LIMIT">🎯 Limit Emir (Hedef Fiyat)</button>
            </div>
          ` : ''}

          ${doorHtml}
          ${matHtml}
          ${marginHtml}

          ${usableCashTL < 5000 && (member.pendingOrders || []).some((o) => o.side === 'BUY' && (o.reservedTL || 0) >= 1000) ? (() => {
            const pOrd = (member.pendingOrders || []).find((o) => o.side === 'BUY' && (o.reservedTL || 0) >= 1000);
            const resTL = Number(pOrd.reservedTL) || 0;
            return `
              <div class="ae-pending-unlock-box">
                <div style="font-size:11.6px;line-height:1.35;margin-bottom:7px">
                  ⏳ <strong>Boş nakdin ${fmtTL(snap.cashTL)}</strong> çünkü <strong>${fmtTL(resTL)}</strong> tutarın <strong>${esc(pOrd.name)}</strong> valör/açılış sırasında bekliyor (${esc(fmtCountdown(pOrd.executesAtMs))}). Buradan tek dokunuşla nakit çözebilirsin:
                </div>
                <div class="ae-hscroll" style="padding-bottom:0">
                  ${resTL > 110000 ? `<button type="button" class="ae-chip active" data-drawer-release-ord="${esc(pOrd.id)}" data-drawer-release-amt="100000">100 Bin ₺ Çöz</button>` : ''}
                  ${resTL > 260000 ? `<button type="button" class="ae-chip active" data-drawer-release-ord="${esc(pOrd.id)}" data-drawer-release-amt="250000">250 Bin ₺ Çöz</button>` : ''}
                  ${resTL > 510000 ? `<button type="button" class="ae-chip active" data-drawer-release-ord="${esc(pOrd.id)}" data-drawer-release-amt="500000">500 Bin ₺ Çöz</button>` : ''}
                  <button type="button" class="ae-chip sub" data-drawer-release-ord="${esc(pOrd.id)}" data-drawer-release-amt="${resTL}">Tamamını Çöz (${fmtCompactTL(resTL)})</button>
                </div>
              </div>
            `;
          })() : ''}

          <div class="ae-card" style="background:var(--surface-2);padding:15px">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px;flex-wrap:wrap;margin-bottom:7px">
              <span style="font-size:13.4px;font-weight:800;color:var(--ink-200)">Ne kadar yatırmak istiyorsun?</span>
              <span style="font-size:12.2px;color:var(--ink-400)">
                ${unsettledUsableForBist > 0
                  ? `Alım Gücü: <strong style="color:var(--ink-100)">${fmtTL(usableCashTL)}</strong> <small>(T+2 dahil)</small>`
                  : `Boş Nakit: <strong style="color:var(--ink-100)">${fmtTL(snap.cashTL)}</strong>`}
              </span>
            </div>

            <input id="msOrderAmountInp" class="ae-input" style="font-weight:900;font-size:22px !important;text-align:center;padding:12px" type="number" inputmode="numeric" min="${minOrderTL}" step="${sliderStep}" value="${draftOrderAmount}" />
            <div id="aeEstUnitsLine" style="text-align:center;font-size:13px;font-weight:800;color:var(--gold-bright);margin-top:6px">
              ${esc(estimatePlainUnitPurchase(asset, draftOrderAmount, drawerBuyMode === 'LIMIT' ? activeBuyTrigP : 0))}
            </div>

            <input id="aeAmountSlider" class="ae-slider" type="range" min="${sliderMin}" max="${sliderMax}" step="${sliderStep}" value="${Math.min(sliderMax, Math.max(sliderMin, draftOrderAmount))}" />

            <div class="ae-hscroll" style="margin:6px 0 10px">
              ${usableCashTL >= 50000 ? `<button type="button" class="ae-chip sub" data-qamt="50000">50 Bin ₺</button>` : ''}
              ${usableCashTL >= 100000 ? `<button type="button" class="ae-chip sub" data-qamt="100000">100 Bin ₺</button>` : ''}
              ${usableCashTL >= 250000 ? `<button type="button" class="ae-chip sub" data-qamt="250000">250 Bin ₺</button>` : ''}
              <button type="button" class="ae-chip sub" data-qamt="${Math.max(minOrderTL, Math.floor(usableCashTL * 0.25))}">Çeyreği (%25)</button>
              <button type="button" class="ae-chip sub" data-qamt="${Math.max(minOrderTL, Math.floor(usableCashTL * 0.5))}">Yarısı (%50)</button>
              <button type="button" class="ae-chip sub" data-qamt="${Math.max(minOrderTL, Math.floor(usableCashTL))}">${unsettledUsableForBist > 0 ? 'Tüm Alım Gücü' : 'Tamamı'}</button>
            </div>

            <!-- CANLI SİPARİŞ ÖZETİ (SADE TÜRKÇE) -->
            <div id="aeLiveRippleBox" class="ms-bakery-grid" style="margin-bottom:11px">
              <div class="ms-bakery-cell"><span>Ne Zaman Geçer?</span><strong style="font-size:12.6px">${esc(ripple.timingText)}</strong></div>
              <div class="ms-bakery-cell"><span>Gişe & Makas Maliyeti</span><strong style="font-size:13px" class="${ripple.frictionTL > 0 ? 'warn-txt' : 'pos'}">${ripple.frictionTL > 0 ? '-' + fmtTL(ripple.frictionTL) : '0 ₺'}</strong></div>
              <div class="ms-bakery-cell"><span>Sepetindeki Payı</span><strong style="font-size:13px" class="${ripple.newSingleSharePct >= 65 ? 'neg' : ''}">%${ripple.newSingleSharePct}</strong></div>
              <div class="ms-bakery-cell"><span>Tahmini Aylık Gelir</span><strong style="font-size:13px" class="pos">${ripple.monthlyDripTL > 0 ? '+' + fmtTL(ripple.monthlyDripTL) + '/ay' : 'Değer Artışı'}</strong></div>
            </div>

            <!-- DOSTUN EMİR ÖNCESİ 3 SANİYELİK TERAZİ KONTROLÜ -->
            <div id="aeMentorPreCheckBox">${buildPreTradeMentorBoxHtml(asset)}</div>

            <!-- İSTEĞE BAĞLI YATIRIM NOTU (AÇILIR KUTU — YENİ BAŞLAYANI BOĞMAZ!) -->
            <details class="ae-guide-acc" style="margin-bottom:12px;background:var(--surface-1)">
              <summary style="padding:10px 12px;font-size:12.8px">📝 Neden Alıyorsun? (İsteğe Bağlı Not & Etiket)</summary>
              <div class="ae-guide-body" style="padding:10px 12px">
                <div class="ae-hscroll" style="margin-bottom:8px">
                  <button type="button" class="ae-chip ${selectedThesisTag === 'RESEARCH_FUNDAMENTAL' ? 'active' : ''}" data-thesis="RESEARCH_FUNDAMENTAL">📊 Kasa Sağlam</button>
                  <button type="button" class="ae-chip ${selectedThesisTag === 'MACRO_CHAIN' ? 'active' : ''}" data-thesis="MACRO_CHAIN">🛢️ Makro Zincir</button>
                  <button type="button" class="ae-chip ${selectedThesisTag === 'INFLATION_SHIELD' ? 'active' : ''}" data-thesis="INFLATION_SHIELD">🛡️ Enflasyon Kalkanı</button>
                  <button type="button" class="ae-chip ${selectedThesisTag === 'RUMOR_IMPULSE' ? 'active' : ''}" data-thesis="RUMOR_IMPULSE">🔥 Anlık Heyecan</button>
                </div>
                <input id="msThesisNoteInp" class="ae-input" style="padding:10px 12px" type="text" value="${esc(draftThesisNote)}" placeholder="Kısa notun (Canlı Ligde görünür, isteğe bağlı)" />
              </div>
            </details>

            ${drawerBuyMode === 'LIMIT' && supportsConditional ? `
              <div style="margin-bottom:11px;padding:10px;border-radius:12px;background:var(--surface-1);border:1px solid rgba(56,189,248,0.4)">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:5px;flex-wrap:wrap">
                  <label style="font-size:11.8px;font-weight:800;color:var(--cyan)">🎯 Hedef Limit Alım Fiyatı (₺):</label>
                  <span style="font-size:11px;color:var(--ink-400)">Güncel: ${fmtUnitTL(asset.priceTL)}${asset.subVenue === 'BIST_STOCK' ? ` · Adım: ${K.getBistTickSize(asset.priceTL)} ₺` : ''}</span>
                </div>
                <input id="aeCondTriggerInp" class="ae-input" type="number" inputmode="decimal" step="any" value="${activeBuyTrigP}" style="font-weight:900;text-align:center;font-size:17px !important;padding:9px" />
                <div class="ae-hscroll" style="margin-top:7px;padding-bottom:0">
                  ${[-2, -4, -7, -10].map((p) => `<button type="button" class="ae-chip sub" data-trig-pct="${p}">%${p} İndirim</button>`).join('')}
                </div>
              </div>
              <button type="button" class="ae-big-btn gold" style="width:100%" id="aeConfirmLimitBuyBtn">
                🎯 Hedef Fiyattan Limit Alım Kur
              </button>
            ` : `
              <button type="button" class="ae-big-btn green" style="width:100%" id="msBuyConfirmBtn">
                ${asset.isRateInstrument ? '✅ Vadeli / Fona Bağla' : (selectedUseMargin ? '⚡ Kredili Alım Emri Ver' : '✅ Alım Emri Ver')}
              </button>
            `}
          </div>

          ${orderBook ? `
            <details class="ae-guide-acc" ${orderBook.recommendLimit ? 'open' : ''} style="margin-top:10px;background:var(--surface-2)">
              <summary style="padding:10px 12px;font-size:12.6px">
                <span style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                  <span>📊 5 Kademe Tahta Derinliği</span>
                  <span class="ms-sig-pill ${orderBook.liquidityTone === 'good' ? 'good' : (orderBook.liquidityTone === 'danger' ? 'danger' : 'info')}">${esc(orderBook.liquidityTier)}</span>
                </span>
              </summary>
              <div class="ae-guide-body" style="padding:8px 12px 12px">
                <div id="aeOrderBookSlipLine" style="font-size:11.6px;color:var(--ink-200);margin-bottom:6px">
                  Günlük Hacim: <strong>${fmtInt(orderBook.turnoverMillionTL)} Mn ₺</strong> · Adım: <strong>${orderBook.tick} ₺</strong> · ${fmtCompactTL(orderBook.orderAmountTL)} Piyasa Emri Kayması:
                  <strong class="${orderBook.slippagePct >= 0.35 ? 'neg' : 'pos'}">~%${orderBook.slippagePct} (${orderBook.slippageTL > 0 ? '-' + fmtTL(orderBook.slippageTL) : '0 ₺'})</strong>
                </div>
                ${orderBook.recommendLimit ? `<div class="ms-alert warn" style="margin:0 0 6px;padding:7px 9px;font-size:11.6px">⚠️ Bu tahtada piyasa emri ${orderBook.levelsSwept} kademe süpürüyor! Yukarıdan <strong>🎯 Limit Emir</strong> seçerek kaymayı sıfırla.</div>` : ''}
                <div class="ae-ob-grid">
                  <div class="ae-ob-col">
                    <div class="ae-ob-head"><span>ALIŞ (Lot)</span><span>FİYAT</span></div>
                    ${orderBook.bids.map((b) => {
                      const lotLbl = b.lots >= 1000000 ? `${TR_DEC2.format(b.lots / 1000000)}M` : (b.lots >= 100000 ? `${Math.round(b.lots / 1000)}B` : b.lots.toLocaleString('tr-TR'));
                      const pickAttr = b.priceTL < asset.priceTL ? `data-ob-pick-price="${b.priceTL}" style="cursor:pointer" title="Limit Alım hedefi yap"` : '';
                      return `
                      <div class="ae-ob-row" ${pickAttr}>
                        <div class="ae-ob-bar bid" style="width:${Math.max(12, Math.round((b.valueTL / orderBook.maxLevelTL) * 100))}%"></div>
                        <span class="ae-ob-lots">${lotLbl}</span>
                        <span class="ae-ob-price pos">${b.priceTL.toFixed(2)}</span>
                      </div>`;
                    }).join('')}
                  </div>
                  <div class="ae-ob-col">
                    <div class="ae-ob-head"><span>SATIŞ</span><span>(Lot)</span></div>
                    ${orderBook.asks.map((a) => {
                      const lotLbl = a.lots >= 1000000 ? `${TR_DEC2.format(a.lots / 1000000)}M` : (a.lots >= 100000 ? `${Math.round(a.lots / 1000)}B` : a.lots.toLocaleString('tr-TR'));
                      return `
                      <div class="ae-ob-row">
                        <div class="ae-ob-bar ask" style="width:${Math.max(12, Math.round((a.valueTL / orderBook.maxLevelTL) * 100))}%"></div>
                        <span class="ae-ob-price neg">${a.priceTL.toFixed(2)}</span>
                        <span class="ae-ob-lots">${lotLbl}</span>
                      </div>`;
                    }).join('')}
                  </div>
                </div>
              </div>
            </details>
          ` : ''}

          ${supportsConditional ? `
            <details class="ae-guide-acc" style="margin-top:8px;background:var(--surface-2)">
              <summary style="padding:10px 12px;font-size:12.6px">
                🔔 Fiyat Alarmı & İzleme Notu ${watchEntry?.targetPriceTL > 0 ? `(Hedef: ${fmtUnitTL(watchEntry.targetPriceTL)})` : ''}
              </summary>
              <div class="ae-guide-body" style="padding:10px 12px">
                <div style="display:flex;gap:7px;align-items:center">
                  <input id="aeAlertPriceInp" class="ae-input" type="number" inputmode="decimal" step="any" value="${watchEntry?.targetPriceTL > 0 ? watchEntry.targetPriceTL : defaultLimitBuyP}" placeholder="Hedef fiyat (₺)" style="padding:8px 10px;font-weight:800" />
                  <button type="button" class="ms-btn primary sm" id="aeSavePriceAlertBtn" style="flex-shrink:0">🔔 Alarm Kur</button>
                </div>
                <div style="font-size:11.2px;color:var(--ink-400);margin-top:5px">Hedef fiyat güncel fiyatın altındaysa "düşünce", üstündeyse "çıkınca" otomatik uyarır.</div>
              </div>
            </details>
          ` : ''}

          ${existingConds.length > 0 ? `
            <div class="ms-list" style="margin-top:8px">
              ${existingConds.map((co) => `
                <div class="ms-list-row" style="border-color:rgba(240,180,41,0.38)">
                  <span style="font-size:12px">
                    ${co.kind === 'LIMIT_BUY' ? '🎯 Limit Alım' : (co.kind === 'STOP_LOSS' ? '🛡️ Zarar Kes' : '🎯 Kâr Al')}:
                    <strong>${fmtUnitTL(co.triggerPriceTL)}</strong> (${co.kind === 'LIMIT_BUY' ? fmtTL(co.reservedTL) : co.qty + ' adet'})
                  </span>
                  <button type="button" class="ms-btn danger sm" data-drawer-cancel-cond="${esc(co.id)}">İptal</button>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${existingTranches.length > 0 ? `
            <div class="ms-list" style="margin-top:8px">
              ${existingTranches.map((tr) => {
                const early = tr.isTermDeposit && !tr.isMatured;
                return `
                  <div class="ms-list-row">
                    <span style="font-size:12px">Aktif Dilim: <strong>${fmtTL(tr.principalTL)}</strong> (+${fmtTL(tr.netInterestTL)})</span>
                    <button type="button" class="ms-btn ${early ? 'danger' : ''} sm" data-drawer-break-tr="${esc(tr.id)}">
                      ${early ? `Erken Boz (-${fmtCompactTL(tr.forfeitedIfBrokenEarlyTL)})` : 'Nakde Çevir'}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}

          ${existingPending.length > 0 ? `
            <div class="ms-list" style="margin-top:8px">
              ${existingPending.map((ord) => `
                <div class="ms-list-row">
                  <span style="font-size:12px">⏳ Bekleyen ${ord.side === 'BUY' ? 'Alım' : 'Satış'} (${ord.side === 'BUY' ? fmtTL(ord.reservedTL) : ord.qty + ' adet'})</span>
                  <button type="button" class="ms-btn danger sm" data-drawer-cancel-ord="${esc(ord.id)}">İptal Et</button>
                </div>
              `).join('')}
            </div>
          ` : ''}
        `;
      }
    } else if (drawerSubTab === 'VAULT') {
      tabContentHtml = `
        ${renderInteractiveCycleSvg(info)}
        ${renderHealthVaultHtml(info, asset)}
        <button type="button" class="ms-btn primary" style="width:100%;padding:12px" id="aeJumpToOrderTabBtn">Emir Gişesine Geç</button>
      `;
    } else if (drawerSubTab === 'DUEL') {
      const candidateKeys = [
        ...(info?.relatedKeys || []),
        'gram-altin-spot',
        'kira-sertifikasi-sukuk',
        'tefas-mac',
        'bist-100',
        'abd-sp500-spy',
        'doviz-usd'
      ].filter((k, i, arr) => k && k !== asset.key && arr.indexOf(k) === i && K.getAsset(k));

      if (!duelRivalKey || duelRivalKey === asset.key || !K.getAsset(duelRivalKey)) {
        duelRivalKey = candidateKeys[0] || 'gram-altin-spot';
      }
      const rival = K.getAsset(duelRivalKey);
      const cmp = (rival && G.compareAssetsHeadToHead) ? G.compareAssetsHeadToHead(asset.key, rival.key, 100000) : null;

      let searchHits = [];
      if (duelSearchQuery.trim().length > 0) {
        const dq = duelSearchQuery.trim().toLocaleUpperCase('tr-TR');
        searchHits = K.getAllAssets()
          .filter((x) => x.key !== asset.key && x.venue !== 'BENCHMARK_ONLY' && (x.ticker.toLocaleUpperCase('tr-TR').includes(dq) || x.name.toLocaleUpperCase('tr-TR').includes(dq)))
          .slice(0, 8);
      }

      tabContentHtml = `
        <div class="ae-card" style="background:var(--surface-2);margin-bottom:10px">
          <span style="display:block;font-size:11px;font-weight:800;color:var(--gold-bright);margin-bottom:5px">⚔️ Kafa Kafaya Terazi Düellosu — Rakip Seç:</span>
          <div class="ae-hscroll" style="margin-bottom:7px">
            ${candidateKeys.slice(0, 8).map((rk) => {
              const ra = K.getAsset(rk);
              return ra ? `<button type="button" class="ae-chip ${duelRivalKey === ra.key ? 'active' : 'sub'}" data-duel-rival="${esc(ra.key)}" style="padding:4px 9px;font-size:11.2px">${esc(ra.ticker)}</button>` : '';
            }).join('')}
          </div>
          <input id="aeDuelSearchInp" class="ae-input" type="search" autocomplete="off" value="${esc(duelSearchQuery)}" placeholder="675+ varlıktan başka rakip yaz (örn: PGSUS, QQQ, AFT)..." style="padding:7px 10px;font-size:12px" />
          ${searchHits.length > 0 ? `
            <div class="ae-hscroll" style="margin-top:6px;padding-bottom:0">
              ${searchHits.map((sh) => `
                <button type="button" class="ae-chip active" data-duel-rival="${esc(sh.key)}" style="padding:4px 9px;font-size:11px">${esc(sh.ticker)} · ${esc(sh.name.slice(0, 18))}</button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        ${cmp && rival ? `
          <div class="ae-card" style="background:var(--surface-2);margin-bottom:10px">
            <div id="aeDuelDualChartMount" style="min-height:132px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--line-subtle)">
              <div style="height:118px;display:flex;align-items:center;justify-content:center;font-size:11.2px;color:var(--ink-400)">100.000 ₺ ikili yarış eğrisi çiziliyor...</div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding:7px 10px;background:var(--surface-1);border-radius:11px">
              <strong style="color:#fbbf24;font-size:13.5px">${esc(asset.ticker)}: ${cmp.winsA} Tur</strong>
              <span class="ms-sig-pill ${cmp.overallWinner === 'A' ? 'good' : (cmp.overallWinner === 'B' ? 'info' : 'neutral')}">
                ${cmp.overallWinner === 'A' ? `${esc(asset.ticker)} Üstün` : (cmp.overallWinner === 'B' ? `${esc(rival.ticker)} Üstün` : 'Terazide Başa Baş')}
              </span>
              <strong style="color:#38bdf8;font-size:13.5px">${esc(rival.ticker)}: ${cmp.winsB} Tur</strong>
            </div>

            <div style="display:grid;gap:6px;margin-bottom:10px">
              ${cmp.rounds.map((rd) => `
                <div class="ae-duel-round">
                  <div class="ae-duel-round-hdr">${esc(rd.title)}</div>
                  <div class="ae-duel-round-vals">
                    <span style="text-align:left;color:${rd.winner === 'A' ? 'var(--green-ink)' : 'var(--ink-200)'};overflow:hidden;text-overflow:ellipsis">${rd.winner === 'A' ? '✓ ' : ''}${esc(rd.valA)}</span>
                    <span style="font-size:10px;color:var(--ink-500)">VS</span>
                    <span style="text-align:right;color:${rd.winner === 'B' ? '#38bdf8' : 'var(--ink-200)'};overflow:hidden;text-overflow:ellipsis">${esc(rd.valB)}${rd.winner === 'B' ? ' ✓' : ''}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="ms-alert info" style="margin-bottom:8px">
              <strong>Uzman Terazi Kararı:</strong> ${esc(cmp.verdict)}
            </div>

            <div style="display:flex;gap:8px">
              <button type="button" class="ms-btn primary sm" style="flex:1;padding:10px" id="aeJumpToOrderTabBtn">${esc(asset.ticker)} Al / Sat</button>
              <button type="button" class="ms-btn sm" style="flex:1;padding:10px" data-jump-order-asset="${esc(rival.key)}">${esc(rival.ticker)} Gişesine Geç</button>
            </div>
          </div>
        ` : ''}
      `;
    } else {
      const relatedAssets = (info?.relatedKeys || [])
        .map((rk) => K.getAsset(rk))
        .filter((x) => x && x.key !== asset.key);

      tabContentHtml = `
        <div class="ae-card" style="background:var(--surface-2);margin-bottom:10px">
          <strong style="display:block;font-size:14px;margin-bottom:5px">Parayı Nereden ve Nasıl Kazanır?</strong>
          <p style="margin:0 0 10px;font-size:12.6px;color:var(--ink-200);line-height:1.5">${esc(info.howItWorks)}</p>
          <div style="display:grid;gap:7px;font-size:12.2px">
            <div><strong style="color:var(--cyan)">Bağlı Olduğu Hammaddeler:</strong> ${esc(info.rawInputs.join(' · '))}</div>
            <div><strong class="pos">Ne Zaman Güçlenir:</strong> ${esc(info.risesWhen)}</div>
            <div><strong class="neg">Ne Zaman Zorlanır:</strong> ${esc(info.fallsWhen)}</div>
          </div>

          ${info.expertEdge ? `
            <div style="margin-top:10px;padding:9px 10px;border-radius:10px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.24);font-size:12px;color:var(--ink-200);line-height:1.45">
              <strong style="display:block;color:var(--green-ink);margin-bottom:2px">🎯 Uzmanın Baktığı Öncü Veri (45 Gün Önceden):</strong>
              ${esc(info.expertEdge)}
            </div>
          ` : ''}

          ${info.trapWatch ? `
            <div style="margin-top:8px;padding:9px 10px;border-radius:10px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.24);font-size:12px;color:var(--ink-200);line-height:1.45">
              <strong style="display:block;color:var(--red-ink);margin-bottom:2px">⛔ Aceminin Düştüğü Tuzak:</strong>
              ${esc(info.trapWatch)}
            </div>
          ` : ''}

          ${relatedAssets.length > 0 ? `
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line-subtle)">
              <span style="display:block;font-size:11.4px;font-weight:700;color:var(--ink-400);margin-bottom:6px">Zincirdeki Bağlantılı Yatırımlar:</span>
              <div class="ae-hscroll">
                ${relatedAssets.map((ra) => `
                  <button type="button" class="ae-chip sub" data-jump-asset="${esc(ra.key)}">${esc(ra.ticker)} · ${ra.isRateInstrument ? '%' + ra.annualGrossRatePct : fmtUnitTL(ra.priceTL)}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="ms-alert info">
          <strong>Türkiye Gerçek Piyasa & Vergi Kuralı:</strong> ${esc(info.executionRule)}
        </div>
      `;
    }

    const gv = G.getPlainAssetVerdict ? G.getPlainAssetVerdict(asset, partnerScaleTL) : null;

    sheet.innerHTML = `
      <div class="ae-sheet-grabber-zone" id="aeSheetDragHandle">
        <span class="ae-sheet-grabber"></span>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px">
        <div style="min-width:0;flex:1">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            ${gv ? `<span class="ae-traffic-dot ${esc(gv.trafficLight)}"></span>` : ''}
            <span class="ms-asset-code">${esc(asset.symbol)}</span>
            <button type="button" class="ae-watch-btn ${watchEntry ? 'active' : ''}" id="aeDrawerWatchBtn">${watchEntry ? '★ Takipte' : '☆ Takip'}</button>
            ${gv ? `<span class="ms-sig-pill ${gv.trafficLight === 'green' ? 'good' : (gv.trafficLight === 'red' ? 'danger' : 'warn')}">${esc(gv.simpleLabel)}</span>` : ''}
          </div>
          <h2 style="margin:5px 0 0;font-size:19.5px;font-weight:900;line-height:1.22">${esc(asset.name)}</h2>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <strong style="font-size:19.5px;font-weight:900;display:block">${asset.isRateInstrument ? `%${asset.annualGrossRatePct.toFixed(1)}` : fmtUnitTL(asset.priceTL)}</strong>
          <span class="${asset.isRateInstrument ? 'pos' : (chg >= 0 ? 'pos' : 'neg')}" style="font-size:12.6px;font-weight:800">
            ${asset.isRateInstrument ? (asset.stopajPct === 0 ? '%0 Vergi' : `%${asset.stopajPct} Vergi`) : `${chg >= 0 ? '+' : ''}%${chg.toFixed(2)}`}
          </span>
        </div>
      </div>

      <!-- HERKES İÇİN 5 SANİYELİK SADE ÖZET & TERİM KISAYOLLARI -->
      <div class="ae-verdict-banner ${esc(gv?.trafficLight || 'amber')}">
        <div style="font-size:13.8px;font-weight:700;color:var(--ink-100);line-height:1.48">${esc(gv?.simpleMeaning || oneLineTruth)}</div>
        ${gv?.watchOut ? `<div style="font-size:12.4px;color:var(--ink-200);margin-top:6px;padding-top:6px;border-top:1px solid var(--line-subtle)">⚠️ <strong>Dikkat:</strong> ${esc(gv.watchOut)}</div>` : ''}
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:9px;align-items:center">
          ${AetherNative.canSpeak() ? `<button type="button" class="ae-term-pill" id="aeSpeakDrawerVerdictBtn" style="border-style:solid;color:var(--gold-bright)">🔊 Sesli Dinle</button>` : ''}
          ${(gv?.termKeys || []).map((tk) => `<button type="button" class="ae-term-pill" data-explain-term="${esc(tk)}">${esc(tk)} nedir?</button>`).join('')}
        </div>
      </div>

      ${renderProChartContainerHtml(asset)}

      ${lastDrawerFeedback ? `<div class="ms-alert ${lastDrawerFeedback.ok ? 'ok' : 'err'}">${esc(lastDrawerFeedback.text)}</div>` : ''}
      ${micro.statusNote ? `<div class="ms-alert warn">${esc(micro.statusNote)}</div>` : ''}

      <div class="ae-seg" role="tablist">
        <button type="button" class="ae-seg-btn ${drawerSubTab === 'ORDER' ? 'active' : ''}" data-dtab="ORDER">💰 Al / Sat</button>
        <button type="button" class="ae-seg-btn ${drawerSubTab === 'VAULT' ? 'active' : ''}" data-dtab="VAULT">🥖 Kasa</button>
        <button type="button" class="ae-seg-btn ${drawerSubTab === 'DUEL' ? 'active' : ''}" data-dtab="DUEL">⚔️ Kıyasla</button>
        <button type="button" class="ae-seg-btn ${drawerSubTab === 'LOGIC' ? 'active' : ''}" data-dtab="LOGIC">📖 Nedir?</button>
      </div>

      ${tabContentHtml}

      <button type="button" class="ms-btn" style="width:100%;margin-top:10px;padding:12px" id="msCloseModalBtn">Kapat</button>
    `;

    bindSheetDragToDismiss();
    bindMentorJumpButtons(sheet);
    bindTermExplainClicks(sheet);
    document.getElementById('aeSpeakDrawerVerdictBtn')?.addEventListener('click', () => {
      AetherNative.speak(`${asset.name}. ${gv?.simpleMeaning || oneLineTruth} ${gv?.watchOut ? 'Dikkat: ' + gv.watchOut : ''}`);
    });
    document.getElementById('msCloseModalBtn')?.addEventListener('click', closeModal);
    hydrateInteractiveAssetChart(asset, existingPos, info);
    if (drawerSubTab === 'DUEL' && duelRivalKey) {
      const rvObj = K.getAsset(duelRivalKey);
      if (rvObj) hydrateDuelDualChart(asset, rvObj);
    }

    sheet.querySelectorAll('[data-chart-reality]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        drawerChartReality = b.getAttribute('data-chart-reality') || 'TL';
        renderAssetDrawer();
      });
    });

    sheet.querySelectorAll('[data-chart-range]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        drawerChartRange = b.getAttribute('data-chart-range') || '1Y';
        renderAssetDrawer();
      });
    });

    sheet.querySelectorAll('[data-duel-rival]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        duelRivalKey = b.getAttribute('data-duel-rival');
        duelSearchQuery = '';
        renderAssetDrawer();
      });
    });

    const dSearch = document.getElementById('aeDuelSearchInp');
    if (dSearch) {
      dSearch.addEventListener('input', () => {
        duelSearchQuery = dSearch.value;
        renderAssetDrawer();
        const again = document.getElementById('aeDuelSearchInp');
        if (again) {
          again.focus();
          try { again.setSelectionRange(duelSearchQuery.length, duelSearchQuery.length); } catch (_) {}
        }
      });
    }

    sheet.querySelectorAll('[data-drawer-release-ord]').forEach((b) => {
      b.addEventListener('click', () => {
        const oid = b.getAttribute('data-drawer-release-ord');
        const amt = Number(b.getAttribute('data-drawer-release-amt')) || 250000;
        const res = K.executeOrder({ side: 'REDUCE_PENDING_ORDER', orderId: oid, releaseAmountTL: amt });
        AetherNative.haptic(res.ok ? 'success' : 'error');
        lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
        if (res.ok && res.releasedTL > 0) {
          draftOrderAmount = Math.min(res.releasedTL, Math.max(1000, amt));
        }
        renderAssetDrawer();
        renderHeader();
        renderCurrentTab(true);
      });
    });

    sheet.querySelectorAll('[data-dtab]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        drawerSubTab = b.getAttribute('data-dtab');
        if (drawerSubTab === 'VAULT' && (asset.bistRow || asset.subVenue === 'DARPHANE_S1')) {
          K.markInspectedCashScale();
        }
        renderAssetDrawer();
      });
    });

    document.getElementById('aeJumpToOrderTabBtn')?.addEventListener('click', () => {
      drawerSubTab = 'ORDER';
      renderAssetDrawer();
    });

    sheet.querySelectorAll('[data-dside]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        drawerOrderSide = b.getAttribute('data-dside');
        draftTriggerPriceTL = 0;
        renderAssetDrawer();
      });
    });

    sheet.querySelectorAll('[data-sratio]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        draftSellQty = null;
        draftSellRatio = Number(b.getAttribute('data-sratio')) || 1;
        renderAssetDrawer();
      });
    });

    const sellQtyInp = document.getElementById('aeSellQtyInp');
    if (sellQtyInp && existingPos && existingPos.qty > 0) {
      sellQtyInp.addEventListener('input', () => {
        const rawV = Number(sellQtyInp.value);
        const queuedSQ = existingPending.filter((o) => o.side === 'SELL').reduce((s, o) => s + Number(o.qty || 0), 0);
        const avQ = Math.max(0, +(existingPos.qty - queuedSQ).toFixed(6));
        const isInt = asset.subVenue === 'BIST_STOCK';
        if (!Number.isFinite(rawV) || rawV <= 0 || avQ <= 0) return;
        draftSellQty = rawV;
        const effQ = isInt ? Math.min(Math.floor(avQ), Math.max(1, Math.floor(rawV))) : Math.min(avQ, +rawV.toFixed(6));
        const effPct = avQ > 0 ? Math.min(100, Math.round((effQ / avQ) * 100)) : 0;
        let uBid = asset.priceTL;
        if (asset.venue === 'TWO_DOOR') {
          const sp = selectedDoor === 'BAZAAR' ? clock.bazaarSpreadPct : (selectedDoor === 'NOBETCI' ? clock.nobetciSpreadPct : clock.bankSpreadPct);
          uBid = +(asset.priceTL * (1 - sp / 200)).toFixed(4);
        }
        const sFee = asset.venue === 'BIST' ? 0.00084 : (asset.venue === 'GLOBAL_USD' ? 0.0015 : ((asset.venue === 'CRYPTO_24_7' || asset.venue === 'VIOP') ? 0.0010 : 0));
        const gSale = effQ * uBid;
        const eStop = (asset.stopajPct > 0 && !asset.isRateInstrument && uBid > existingPos.avgCostTL)
          ? ((uBid - existingPos.avgCostTL) / uBid) * (asset.stopajPct / 100)
          : 0;
        const eGross = Math.max(0, Math.round(gSale * (1 - sFee - eStop)));

        sheet.querySelectorAll('[data-sratio]').forEach((rb) => rb.classList.remove('active'));
        const prevEl = document.getElementById('aeSellPreviewLine');
        if (prevEl) {
          const sellSettleNote = asset.venue === 'BIST'
            ? 'BIST kuralıyla satış tutarı T+2 takas kum saatine girer (2 iş günü nakit çekilemez).'
            : (asset.venue === 'TEFAS'
              ? `TEFAS valör kuralıyla bozum tutarı T+${asset.sellValorDays || 1} iş gününde nakit kasana geçer${asset.stopajPct > 0 ? ` (kârdan %${asset.stopajPct} stopaj kesilir)` : ' (%0 stopaj)'}.`
              : 'Anında nakit kasana geçer.');
          prevEl.innerHTML = `Satılacak: <strong style="color:var(--ink-100)">${effQ} ${isInt ? 'lot' : 'birim'} (%${effPct})</strong> · Tahmini Net Tutar: <strong style="color:var(--ink-100)">~${fmtTL(eGross)}</strong> · ${sellSettleNote}`;
        }
        const sellBtn = document.getElementById('aeConfirmSellBtn');
        if (sellBtn) {
          sellBtn.textContent = `${effQ} ${isInt ? 'Lot' : 'Birim'} (%${effPct}) Satış Emri Ver`;
        }
      });
    }

    sheet.querySelectorAll('[data-door]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        selectedDoor = b.getAttribute('data-door');
        renderAssetDrawer();
      });
    });

    sheet.querySelectorAll('[data-mat]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        selectedMaturity = Number(b.getAttribute('data-mat')) || 32;
        renderAssetDrawer();
      });
    });

    document.getElementById('msUseMarginChk')?.addEventListener('change', (e) => {
      AetherNative.haptic('warning');
      selectedUseMargin = Boolean(e.target.checked);
      renderAssetDrawer();
    });

    sheet.querySelectorAll('[data-thesis]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        selectedThesisTag = b.getAttribute('data-thesis');
        renderAssetDrawer();
      });
    });

    document.getElementById('msThesisNoteInp')?.addEventListener('input', (e) => {
      draftThesisNote = e.target.value;
    });

    const amtInp = document.getElementById('msOrderAmountInp');
    const slider = document.getElementById('aeAmountSlider');
    if (amtInp) {
      amtInp.addEventListener('input', () => {
        draftOrderAmount = Math.max(0, Number(amtInp.value) || 0);
        if (slider) slider.value = String(Math.min(Number(slider.max), draftOrderAmount));
        updateLiveRippleBoxInSheet(asset);
      });
    }
    if (slider) {
      slider.addEventListener('input', () => {
        const rawV = Number(slider.value) || minOrderTL;
        const maxV = Number(slider.max) || maxBuyPower;
        const stp = Number(slider.step) || 1000;
        draftOrderAmount = (maxV - rawV) < stp && rawMaxPower > 0 ? maxV : rawV;
        if (amtInp) amtInp.value = String(draftOrderAmount);
        updateLiveRippleBoxInSheet(asset);
      });
    }

    sheet.querySelectorAll('[data-qamt]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        draftOrderAmount = Number(b.getAttribute('data-qamt')) || 50000;
        if (amtInp) amtInp.value = String(draftOrderAmount);
        if (slider) slider.value = String(Math.min(Number(slider.max), draftOrderAmount));
        updateLiveRippleBoxInSheet(asset);
      });
    });

    sheet.querySelectorAll('[data-jump-asset]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('light');
        openAssetDrawer(b.getAttribute('data-jump-asset'), 'VAULT');
      });
    });

    document.getElementById('msBuyConfirmBtn')?.addEventListener('click', () => {
      const amt = Number(document.getElementById('msOrderAmountInp')?.value || draftOrderAmount || 0);
      const noteVal = document.getElementById('msThesisNoteInp')?.value || draftThesisNote || '';
      const res = K.executeOrder({
        side: 'BUY',
        assetKey: asset.key,
        amountTL: amt,
        door: selectedDoor,
        maturityDays: selectedMaturity,
        useMargin: selectedUseMargin,
        thesisTag: selectedThesisTag,
        thesisNote: noteVal,
        inspectedMs: Date.now() - drawerOpenedAtMs
      });
      AetherNative.haptic(res.ok ? 'success' : 'error');
      lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
      if (res.ok) {
        draftThesisNote = '';
        AetherNative.toast(`${asset.ticker}: İşlem başarıyla kayda alındı!`, 'ok');
      }
      renderAssetDrawer();
      renderHeader();
      renderCurrentTab(true);
    });

    document.getElementById('aeConfirmSellBtn')?.addEventListener('click', () => {
      const typedQty = Number(document.getElementById('aeSellQtyInp')?.value || 0);
      const res = K.executeOrder({
        side: 'SELL',
        assetKey: asset.key,
        sellQty: typedQty > 0 ? typedQty : undefined,
        sellRatio: draftSellRatio,
        door: selectedDoor
      });
      AetherNative.haptic(res.ok ? 'success' : 'error');
      lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
      if (res.ok) {
        draftSellQty = null;
        AetherNative.toast(`${asset.ticker} satış emri işlendi.`, 'ok');
        if (!K.getActiveMember().positions?.[asset.key]) drawerOrderSide = 'BUY';
      }
      renderAssetDrawer();
      renderHeader();
      renderCurrentTab(true);
    });

    sheet.querySelectorAll('[data-drawer-break-tr]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'BREAK_TRANCHE', trancheId: b.getAttribute('data-drawer-break-tr') });
        AetherNative.haptic(res.ok ? 'warning' : 'error');
        lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
        renderAssetDrawer();
        renderHeader();
        renderCurrentTab(true);
      });
    });

    sheet.querySelectorAll('[data-drawer-cancel-ord]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'CANCEL_ORDER', orderId: b.getAttribute('data-drawer-cancel-ord') });
        AetherNative.haptic(res.ok ? 'success' : 'error');
        lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
        renderAssetDrawer();
        renderHeader();
        renderCurrentTab(true);
      });
    });

    document.getElementById('aeDrawerWatchBtn')?.addEventListener('click', () => {
      const res = K.toggleWatchlistAsset(asset.key);
      AetherNative.haptic('selection');
      if (res.message) AetherNative.toast(res.message, 'info');
      renderAssetDrawer();
      renderCurrentTab(true);
    });

    sheet.querySelectorAll('[data-buy-mode]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        drawerBuyMode = b.getAttribute('data-buy-mode') || 'MARKET';
        draftTriggerPriceTL = 0;
        renderAssetDrawer();
      });
    });

    sheet.querySelectorAll('[data-sell-mode]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        drawerSellMode = b.getAttribute('data-sell-mode') || 'MARKET';
        draftTriggerPriceTL = 0;
        renderAssetDrawer();
      });
    });

    const refreshCondSellPreview = (trigVal) => {
      const prevEl = document.getElementById('aeCondSellPreviewLine');
      if (!prevEl || !existingPos || !(existingPos.qty > 0) || !(trigVal > 0)) return;
      const queuedSQ = existingPending.filter((o) => o.side === 'SELL').reduce((s, o) => s + Number(o.qty || 0), 0);
      const avQ = Math.max(0, +(existingPos.qty - queuedSQ).toFixed(6));
      const isInt = asset.subVenue === 'BIST_STOCK';
      const effQ = isInt ? Math.min(Math.floor(avQ), Math.max(1, Math.floor(avQ * draftSellRatio))) : +(avQ * draftSellRatio).toFixed(6);
      const effPct = avQ > 0 ? Math.min(100, Math.round((effQ / avQ) * 100)) : 0;
      const estProc = Math.round(effQ * trigVal);
      const estPnl = Math.round(effQ * (trigVal - (existingPos.avgCostTL || trigVal)));
      prevEl.innerHTML = `Tetiklenince satılacak: <strong style="color:var(--ink-100)">${effQ} ${isInt ? 'lot' : 'birim'} (%${effPct})</strong> · Tahmini Tutar: <strong style="color:var(--ink-100)">~${fmtTL(estProc)}</strong> (<strong class="${estPnl >= 0 ? 'pos' : 'neg'}">${estPnl >= 0 ? '+' : ''}${fmtTL(estPnl)}</strong> maliyete göre)`;
    };

    sheet.querySelectorAll('[data-trig-pct]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        const pct = Number(b.getAttribute('data-trig-pct')) || 0;
        const raw = asset.priceTL * (1 + pct / 100);
        const isBist = asset.subVenue === 'BIST_STOCK';
        let snapped = isBist ? K.snapToBistTick(Math.max(0.01, raw)) : +Math.max(0.01, raw).toFixed(2);
        if (pct < 0 && snapped >= asset.priceTL) {
          const step = isBist ? K.getBistTickSize(Math.max(0.01, asset.priceTL - 0.0001)) : 0.01;
          snapped = +(Math.max(0.01, (isBist ? K.snapToBistTick(asset.priceTL) : asset.priceTL) - step)).toFixed(2);
        } else if (pct > 0 && snapped <= asset.priceTL) {
          const step = isBist ? K.getBistTickSize(asset.priceTL + 0.0001) : 0.01;
          snapped = +((isBist ? K.snapToBistTick(asset.priceTL) : asset.priceTL) + step).toFixed(2);
        }
        draftTriggerPriceTL = snapped;
        const inp = document.getElementById('aeCondTriggerInp');
        if (inp) inp.value = String(draftTriggerPriceTL);
        if (drawerOrderSide === 'BUY' && drawerBuyMode === 'LIMIT') updateLiveRippleBoxInSheet(asset);
        else if (drawerOrderSide === 'SELL' && drawerSellMode !== 'MARKET') refreshCondSellPreview(draftTriggerPriceTL);
      });
    });

    document.getElementById('aeCondTriggerInp')?.addEventListener('input', (e) => {
      draftTriggerPriceTL = Number(e.target.value) || 0;
      if (drawerOrderSide === 'BUY' && drawerBuyMode === 'LIMIT') updateLiveRippleBoxInSheet(asset);
      else if (drawerOrderSide === 'SELL' && drawerSellMode !== 'MARKET') refreshCondSellPreview(draftTriggerPriceTL);
    });

    sheet.querySelectorAll('[data-ob-pick-price]').forEach((row) => {
      row.addEventListener('click', () => {
        const picked = Number(row.getAttribute('data-ob-pick-price')) || 0;
        if (!(picked > 0)) return;
        AetherNative.haptic('selection');
        draftTriggerPriceTL = picked;
        drawerOrderSide = 'BUY';
        drawerBuyMode = 'LIMIT';
        AetherNative.toast(`Limit Alım hedefi ${fmtUnitTL(picked)} olarak ayarlandı.`, 'info');
        renderAssetDrawer();
      });
    });

    document.getElementById('aeConfirmLimitBuyBtn')?.addEventListener('click', () => {
      const amt = Number(document.getElementById('msOrderAmountInp')?.value || draftOrderAmount || 0);
      const trig = Number(document.getElementById('aeCondTriggerInp')?.value || draftTriggerPriceTL || 0);
      const noteVal = document.getElementById('msThesisNoteInp')?.value || draftThesisNote || '';
      const res = K.executeOrder({
        side: 'PLACE_LIMIT_BUY',
        assetKey: asset.key,
        amountTL: amt,
        triggerPriceTL: trig,
        door: selectedDoor,
        thesisTag: selectedThesisTag,
        thesisNote: noteVal
      });
      AetherNative.haptic(res.ok ? 'success' : 'error');
      lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
      if (res.ok) AetherNative.toast(`${asset.ticker}: Limit Alım emri kuruldu!`, 'ok');
      renderAssetDrawer();
      renderHeader();
      renderCurrentTab(true);
    });

    document.getElementById('aeConfirmCondSellBtn')?.addEventListener('click', () => {
      const trig = Number(document.getElementById('aeCondTriggerInp')?.value || draftTriggerPriceTL || 0);
      const res = K.executeOrder({
        side: drawerSellMode === 'TAKE_PROFIT' ? 'PLACE_TAKE_PROFIT' : 'PLACE_STOP_LOSS',
        assetKey: asset.key,
        triggerPriceTL: trig,
        sellRatio: draftSellRatio,
        door: selectedDoor
      });
      AetherNative.haptic(res.ok ? 'success' : 'error');
      lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
      if (res.ok) AetherNative.toast(res.message, 'ok');
      renderAssetDrawer();
      renderHeader();
      renderCurrentTab(true);
    });

    document.getElementById('aeSavePriceAlertBtn')?.addEventListener('click', () => {
      const pVal = Number(document.getElementById('aeAlertPriceInp')?.value || 0);
      if (!(pVal > 0)) return;
      const dir = pVal >= asset.priceTL ? 'ABOVE' : 'BELOW';
      const res = K.toggleWatchlistAsset(asset.key, pVal, dir, 'Hedef Fiyat Alarmı');
      AetherNative.haptic(res.ok ? 'success' : 'error');
      lastDrawerFeedback = { ok: res.ok, text: res.message || res.reason || '' };
      if (res.ok) AetherNative.toast(res.message, 'ok');
      renderAssetDrawer();
      renderCurrentTab(true);
    });

    sheet.querySelectorAll('[data-drawer-cancel-cond]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'CANCEL_CONDITIONAL', orderId: b.getAttribute('data-drawer-cancel-cond') });
        AetherNative.haptic(res.ok ? 'success' : 'error');
        lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
        renderAssetDrawer();
        renderHeader();
        renderCurrentTab(true);
      });
    });

    sheet.querySelectorAll('[data-vault-limit-price]').forEach((b) => {
      b.addEventListener('click', () => {
        AetherNative.haptic('selection');
        draftTriggerPriceTL = Number(b.getAttribute('data-vault-limit-price')) || 0;
        drawerSubTab = 'ORDER';
        drawerOrderSide = 'BUY';
        drawerBuyMode = 'LIMIT';
        renderAssetDrawer();
      });
    });

    sheet.querySelectorAll('[data-vault-alert-price]').forEach((b) => {
      b.addEventListener('click', () => {
        const pVal = Number(b.getAttribute('data-vault-alert-price')) || 0;
        if (!(pVal > 0)) return;
        const res = K.toggleWatchlistAsset(asset.key, pVal, pVal >= asset.priceTL ? 'ABOVE' : 'BELOW', 'Röntgen Hedefi');
        AetherNative.haptic('success');
        if (res.message) AetherNative.toast(res.message, 'ok');
        renderAssetDrawer();
        renderCurrentTab(true);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. RAKİP / AİLE PORTFÖY RÖNTGENİ, HOŞ GELDİN & PROFİL ÇEKMECELERİ
  // --------------------------------------------------------------------------
  function openPeerXrayModal(peerId) {
    const K = global.AetherKernelV10;
    const all = K.getAllLeagueMembers();
    const peer = all.find((x) => x.id === peerId);
    if (!peer) return;
    const me = K.getActiveMember();
    const isMe = peer.id === me.id;
    modalMode = 'PEER_XRAY';
    inspectedPeerId = peer.id;
    const snap = K.evaluateMemberPortfolio(peer);
    const mastery = K.evaluateInvestorMastery(peer, snap);
    const archTitle = peer.archetypeTitle || mastery.archetype?.title || 'Piyasa Gözcüsü';
    const archMotto = peer.archetypeMotto || mastery.archetype?.motto || '';
    const solvedCases = peer.solvedCasesCount != null
      ? peer.solvedCasesCount
      : Object.values(peer.completedFieldCases || {}).filter((c) => c && c.isOptimal).length;
    const studiedKap = mastery.studiedDisclosureCount || 0;
    const lastMove = (peer.tradeHistory || [])[0] || null;
    const sheet = document.getElementById('msModalSheet');
    if (!sheet) return;

    sheet.innerHTML = `
      <div class="ae-sheet-grabber-zone" id="aeSheetDragHandle"><span class="ae-sheet-grabber"></span></div>

      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:10px;min-width:0">
          <span class="ae-avatar" style="width:38px;height:38px;font-size:15px;background:${esc(peer.avatarColor || '#2563eb')}">${esc(initials(peer.name))}</span>
          <div style="min-width:0">
            <h2 style="margin:0;font-size:18px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(peer.name)}</h2>
            <div style="font-size:11.6px;color:var(--ink-400)">${esc(peer.roleLabel)} · ${esc(peer.deviceLabel || 'Cihaz')} · Ustalık ${mastery.overallScore}p</div>
          </div>
        </div>
        <button type="button" class="ms-btn sm" id="msCloseModalBtn">Kapat</button>
      </div>

      <div style="background:var(--surface-2);border:1px solid var(--line-subtle);border-radius:11px;padding:8px 11px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="min-width:0;flex:1">
          <span class="ms-sig-pill info">🧭 Karakter: ${esc(archTitle)}</span>
          ${archMotto ? `<div style="font-size:11.3px;color:var(--ink-400);margin-top:3px">${esc(archMotto)}</div>` : ''}
        </div>
        <div style="font-size:11.2px;color:var(--gold-bright);font-weight:800;flex-shrink:0">
          Vaka: ${solvedCases} · KAP: ${studiedKap}
        </div>
      </div>

      <div class="ms-xray-kpi-grid">
        <div class="ms-kpi-box"><span>Net Portföy</span><strong>${fmtTL(snap.totalNetWorthTL)}</strong></div>
        <div class="ms-kpi-box"><span>Net Kâr / Zarar</span><strong class="${snap.nominalPnlTL >= 0 ? 'pos' : 'neg'}">${snap.nominalPnlTL >= 0 ? '+' : ''}${fmtTL(snap.nominalPnlTL)} (${snap.nominalPnlPct >= 0 ? '+' : ''}%${snap.nominalPnlPct})</strong></div>
        <div class="ms-kpi-box"><span>Boş Nakit</span><strong>${fmtTL(snap.cashTL)}</strong></div>
      </div>

      ${renderPortfolioEquityChartSvg(peer, snap)}
      ${renderAllocRibbonHtml(snap.allocationBreakdown)}

      <h3 style="margin:12px 0 8px;font-size:14px;font-weight:800">Taşıdığı Gerçek Varlıklar</h3>
      <div class="ms-list">
        ${snap.spotItems.map((it) => `
          <div class="ms-list-row">
            <div style="min-width:0;flex:1">
              <strong>${esc(it.ticker)} — ${esc(it.name)}</strong>
              <div style="font-size:11.8px;color:var(--ink-400)">
                ${it.qty} adet · Değer: <strong>${fmtTL(it.netValTL)}</strong> ·
                <strong class="${it.pnlNetTL >= 0 ? 'pos' : 'neg'}">${it.pnlNetPct >= 0 ? '+' : ''}%${it.pnlNetPct}</strong>
              </div>
              ${it.thesisNote ? `<div style="font-size:11.4px;color:var(--cyan)">Notu: "${esc(it.thesisNote)}"</div>` : ''}
            </div>
            <button type="button" class="ms-btn sm" data-xray-jump="${esc(it.assetKey)}">İncele</button>
          </div>
        `).join('')}

        ${snap.tranches.map((tr) => `
          <div class="ms-list-row">
            <div>
              <strong>${esc(tr.name)}</strong>
              <div style="font-size:11.8px;color:var(--ink-400)">Anapara ${fmtTL(tr.principalTL)} · Biriken <strong class="pos">+${fmtTL(tr.netInterestTL)}</strong></div>
            </div>
          </div>
        `).join('')}

        ${snap.spotItems.length === 0 && snap.tranches.length === 0 ? `
          <div style="font-size:12.5px;color:var(--ink-400);padding:8px">Henüz pozisyon açmamış; nakitte bekliyor.</div>
        ` : ''}
      </div>

      ${!isMe ? `
        <button type="button" class="ms-btn primary" style="width:100%;margin-top:10px;padding:11px" id="aeXrayAskWhyBtn">
          💬 "${esc(peer.name)}, ${esc(lastMove ? lastMove.name : (snap.spotItems[0]?.ticker || 'bu stratejiyi'))} hamlesini nereden gördün?" Sor
        </button>
      ` : ''}
    `;

    openModalShell();
    bindSheetDragToDismiss();
    document.getElementById('msCloseModalBtn')?.addEventListener('click', closeModal);
    document.getElementById('aeXrayAskWhyBtn')?.addEventListener('click', () => {
      AetherNative.haptic('selection');
      const targetAssetName = lastMove ? lastMove.name : (snap.spotItems[0]?.ticker || 'bu stratejiyi');
      closeModal();
      switchTab('family');
      setTimeout(() => {
        const inp = document.getElementById('msBanterInp');
        if (inp) {
          inp.value = `${peer.name}, ${targetAssetName} hamlesini nereden gördün, hangi veriye güvendin?`;
          inp.focus();
        }
      }, 60);
    });
    sheet.querySelectorAll('[data-xray-jump]').forEach((b) => {
      b.addEventListener('click', () => openAssetDrawer(b.getAttribute('data-xray-jump'), 'VAULT'));
    });
  }

  function openWelcomeModal() {
    modalMode = 'WELCOME';
    const sheet = document.getElementById('msModalSheet');
    if (!sheet) return;
    sheet.innerHTML = `
      <div style="padding-top:10px;margin-bottom:14px">
        <span class="ms-sig-pill warn">AETHER 1M · GERÇEK PİYASA YATIRIM MEYDANI</span>
        <h2 style="margin:9px 0 6px;font-size:24px;font-weight:900;line-height:1.18">Hoş Geldin! 1.000.000 ₺ Hazır</h2>
        <p style="margin:0;font-size:14px;color:var(--ink-200);line-height:1.5">
          Gerçek altın, döviz, kira sertifikası ve Borsa İstanbul fiyatlarıyla <strong>sıfır riskle</strong> yatırım öğren; canlı ligde sevdiklerinle yarış!
        </p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:14px">
        <div class="ae-trio-cell" style="text-align:center"><span>⏱️ Canlı</span><strong style="font-size:12.4px">Gerçek Fiyat</strong></div>
        <div class="ae-trio-cell" style="text-align:center"><span>🥖 Sade</span><strong style="font-size:12.4px">Herkes Anlar</strong></div>
        <div class="ae-trio-cell" style="text-align:center"><span>🏆 Sosyal</span><strong style="font-size:12.4px">Canlı Lig</strong></div>
      </div>

      <div style="display:grid;gap:12px;margin-bottom:8px">
        <div>
          <label style="display:block;font-size:13.2px;font-weight:800;color:var(--ink-100);margin-bottom:6px">Adın Nedir?</label>
          <input id="msWelcomeName" class="ae-input" type="text" maxlength="28" placeholder="Örn: Ertuğrul, Deniz, Kerem..." />
        </div>
        <div>
          <label style="display:block;font-size:13.2px;font-weight:800;color:var(--ink-100);margin-bottom:6px">Hedefin Ne?</label>
          <select id="msWelcomeRole" class="ae-input">
            <option value="Değer & Kasa Avcısı">Sağlam Şirket & Değer Avcısı</option>
            <option value="Uzun Vadeli Ortak">Huzurlu Uzun Vadeli Yatırımcı</option>
            <option value="Temettü & Nakit Çarkı">Düzenli Aylık Gelir Kurucu</option>
            <option value="Altın & Makro Stratejist">Altın & Güvenli Liman Koruyucusu</option>
            <option value="1 Milyon ₺ Portföy Yöneticisi">1 Milyon ₺ Portföy Yöneticisi</option>
          </select>
        </div>

        <label style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 13px;background:var(--surface-2);border:1px solid var(--line-subtle);border-radius:14px;font-size:13.4px;font-weight:800;cursor:pointer">
          <span>👓 Rahat Okuma (Büyük Yazı) Modunu Aç</span>
          <input id="msWelcomeBigFont" type="checkbox" ${uiFontScale === 'large' ? 'checked' : ''} style="width:20px;height:20px" />
        </label>

        <div id="msWelcomeErr" class="neg" style="font-size:13px;font-weight:700;display:none"></div>
        <button type="button" class="ae-big-btn gold" style="width:100%" id="msWelcomeStartBtn">
          1.000.000 ₺ İle Başla →
        </button>
        ${!isRunningAsInstalledApp() ? `
          <button type="button" class="ms-btn sm" style="width:100%" id="msWelcomeInstallBtn">
            📲 Telefona Uygulama Olarak Kur
          </button>
        ` : ''}
      </div>
    `;
    openModalShell();

    document.getElementById('msWelcomeBigFont')?.addEventListener('change', (e) => {
      AetherNative.applyFontScale(e.target.checked ? 'large' : 'normal', true);
    });

    document.getElementById('msWelcomeInstallBtn')?.addEventListener('click', () => {
      AetherNative.haptic('light');
      openInstallAppModal(true);
    });

    const submit = () => {
      const name = document.getElementById('msWelcomeName')?.value || '';
      const role = document.getElementById('msWelcomeRole')?.value || 'Yatırımcı';
      const res = global.AetherKernelV10.completeOnboarding(name, role);
      if (!res.ok) {
        AetherNative.haptic('error');
        const errEl = document.getElementById('msWelcomeErr');
        if (errEl) { errEl.style.display = 'block'; errEl.textContent = res.reason; }
        return;
      }
      AetherNative.haptic('success');
      try {
        if (global.webkit?.messageHandlers?.aetherBridge) {
          global.webkit.messageHandlers.aetherBridge.postMessage({ action: 'requestNotifications' });
        } else if (typeof global.Notification !== 'undefined' && global.Notification.permission === 'default') {
          global.Notification.requestPermission().catch(() => {});
        }
      } catch (_) {}
      closeModal();
      AetherNative.toast(`Hoş geldin ${res.member.name}! 1.000.000 ₺ kasan hazır.`, 'ok');
      renderHeader();
      renderCurrentTab(true);
    };

    document.getElementById('msWelcomeStartBtn')?.addEventListener('click', submit);
    document.getElementById('msWelcomeName')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
    });
  }

  function openResetConfirmModal() {
    modalMode = 'RESET_CONFIRM';
    const K = global.AetherKernelV10;
    const snap = K.evaluateMemberPortfolio();
    const sheet = document.getElementById('msModalSheet');
    if (!sheet) return;

    sheet.innerHTML = `
      <div class="ae-sheet-grabber-zone" id="aeSheetDragHandle"><span class="ae-sheet-grabber"></span></div>
      <div style="margin-bottom:12px">
        <span class="ms-sig-pill danger">Güvenlik Onayı · Geri Alınamaz</span>
        <h2 style="margin:6px 0 4px;font-size:18.5px;font-weight:900">1.000.000 ₺ Kasayı Baştan Başlat?</h2>
        <p style="margin:0;font-size:12.6px;color:var(--ink-400);line-height:1.48">
          Mevcut <strong>${fmtTL(snap.totalNetWorthTL)}</strong> portföyün, açık pozisyonların, bekleyen T+2 / valör emirlerin ve işlem geçmişin silinerek temiz <strong>1.000.000 ₺</strong> nakit ile sıfırdan başlatılacak.
        </p>
      </div>
      <div style="display:flex;gap:8px">
        <button type="button" class="ms-btn" style="flex:1;padding:13px" id="aeCancelResetBtn">Vazgeç</button>
        <button type="button" class="ms-btn sell-cta" style="flex:1.3;padding:13px" id="aeConfirmResetExecBtn">Evet, 1M İle Sıfırla</button>
      </div>
    `;

    openModalShell();
    bindSheetDragToDismiss();
    document.getElementById('aeCancelResetBtn')?.addEventListener('click', closeModal);
    document.getElementById('aeConfirmResetExecBtn')?.addEventListener('click', () => {
      AetherNative.haptic('warning');
      K.resetMemberOneMillion();
      starterGuideDismissed = false;
      closeModal();
      AetherNative.toast('Portföyün temiz 1.000.000 ₺ ile sıfırlandı.', 'ok');
      renderHeader();
      renderCurrentTab(false);
    });
  }

  function openInstallAppModal(returnToWelcome = false) {
    modalMode = 'INSTALL';
    const sheet = document.getElementById('msModalSheet');
    if (!sheet) return;

    const releaseIpaUrl = 'https://github.com/4zyq4sk2tk-collab/AETHER-iOS/releases/download/v19.0.0-ios/AETHER-iOS.ipa';
    const sideStoreDeepLink = 'sidestore://install?url=' + encodeURIComponent(releaseIpaUrl);
    const isLocalServer = global.location?.port === '3847';
    const directIpaHref = isLocalServer ? './download/AETHER-Sideload.ipa' : releaseIpaUrl;
    const mobileConfigHref = isLocalServer ? './download/AETHER.mobileconfig' : './AETHER.mobileconfig';

    sheet.innerHTML = `
      <div class="ae-sheet-grabber-zone" id="aeSheetDragHandle"><span class="ae-sheet-grabber"></span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px">
        <div>
          <span class="ms-sig-pill info">Sıfır Tarayıcı Çubuğu · Gerçek Uygulama</span>
          <h2 style="margin:5px 0 0;font-size:18.5px;font-weight:900">AETHER'i Telefonuna Kur</h2>
        </div>
        <button type="button" class="ms-btn sm" id="msCloseModalBtn">${returnToWelcome ? 'Geri' : 'Kapat'}</button>
      </div>

      <div class="ms-list">
        <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:8px;border-color:rgba(245,158,11,0.42)">
          <div>
            <strong style="font-size:14px">1. iPhone Native ARM64 Uygulama (.ipa · Taptic + Bildirim)</strong>
            <div style="font-size:11.8px;color:var(--ink-400);margin-top:2px">
              Gerçek iOS ikili paketi (Taptic Engine titreşim, yerel bildirim, tam ekran Dynamic Island uyumu).
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <a href="${esc(sideStoreDeepLink)}" class="ms-btn primary sm" style="flex:1;text-decoration:none">⚡ SideStore'da Aç</a>
            <a href="${esc(directIpaHref)}" download="AETHER-iOS.ipa" class="ms-btn sm" style="flex:1;text-decoration:none">📦 AETHER-iOS.ipa İndir</a>
          </div>
        </div>

        <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:8px">
          <div>
            <strong style="font-size:14px">2. SideStore Olmadan iPhone Tam Ekran Kurulum Profili</strong>
            <div style="font-size:11.8px;color:var(--ink-400);margin-top:2px">
              1 dokunuşla iOS Ana Ekranına Safari adres çubuğu olmadan tam ekran AETHER uygulaması kurar (Ayarlar -> Profil İndirildi -> Yükle).
            </div>
          </div>
          <a href="${esc(mobileConfigHref)}" class="ms-btn buy-cta sm" style="width:100%;text-decoration:none">📲 Tam Ekran iOS Profilini Yükle (.mobileconfig)</a>
        </div>

        ${deferredPwaPrompt ? `
          <div class="ms-list-row" style="flex-direction:column;align-items:stretch;gap:8px">
            <div>
              <strong style="font-size:14px">3. Android / Chrome Doğrudan Uygulama Kurulumu</strong>
              <div style="font-size:11.8px;color:var(--ink-400);margin-top:2px">Ana ekranına bağımsız tam ekran uygulama olarak anında eklenir.</div>
            </div>
            <button type="button" class="ms-btn primary sm" id="aeTriggerPwaInstallBtn">🚀 Ana Ekrana Uygulama Olarak Kur</button>
          </div>
        ` : `
          <div class="ms-alert info" style="margin:0">
            <strong>Hızlı İpucu (Safari / Chrome):</strong> Tarayıcının altındaki <strong>Paylaş</strong> simgesine dokunup <strong>"Ana Ekrana Ekle"</strong> seçerek de tam ekran uygulama moduna geçebilirsin.
          </div>
        `}
      </div>
    `;

    openModalShell();
    bindSheetDragToDismiss();
    document.getElementById('msCloseModalBtn')?.addEventListener('click', () => {
      if (returnToWelcome && !global.AetherKernelV10.getActiveMember().profileRegistered) {
        openWelcomeModal();
      } else {
        closeModal();
      }
    });
    document.getElementById('aeTriggerPwaInstallBtn')?.addEventListener('click', async () => {
      if (!deferredPwaPrompt) return;
      try {
        deferredPwaPrompt.prompt();
        await deferredPwaPrompt.userChoice;
        deferredPwaPrompt = null;
        closeModal();
      } catch (_) {}
    });
  }

  function openProfileModal() {
    modalMode = 'PROFILE';
    const K = global.AetherKernelV10;
    const me = K.getActiveMember();
    const st = K.getState();
    const sheet = document.getElementById('msModalSheet');
    if (!sheet) return;

    sheet.innerHTML = `
      <div class="ae-sheet-grabber-zone" id="aeSheetDragHandle"><span class="ae-sheet-grabber"></span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h2 style="margin:0;font-size:18px;font-weight:900">Yatırımcı Kimliği, Oda & Maaş Günü</h2>
        <button type="button" class="ms-btn sm" id="msCloseModalBtn">Kapat</button>
      </div>

      <div style="display:grid;gap:11px">
        <div>
          <label style="display:block;font-size:11.8px;font-weight:800;color:var(--ink-400);margin-bottom:4px">Canlı Ligde Görünen Adın</label>
          <input id="msProfName" class="ae-input" type="text" maxlength="28" value="${esc(me.profileRegistered ? me.name : '')}" placeholder="En az 2 harf yaz..." />
        </div>
        <div>
          <label style="display:block;font-size:11.8px;font-weight:800;color:var(--ink-400);margin-bottom:4px">Yatırım Unvanın</label>
          <input id="msProfRole" class="ae-input" type="text" maxlength="32" value="${esc(me.roleLabel)}" />
        </div>
        <div class="ae-kpi-2x2" style="margin-bottom:0">
          <div>
            <label style="display:block;font-size:11.5px;font-weight:800;color:var(--ink-400);margin-bottom:4px">Aylık Giderin (₺)</label>
            <input id="msProfExpense" class="ae-input" type="number" step="5000" value="${me.monthlyExpenseTL || 40000}" />
          </div>
          <div>
            <label style="display:block;font-size:11.5px;font-weight:800;color:var(--ink-400);margin-bottom:4px">Maaş Günü Eklenen (₺)</label>
            <input id="msProfSavings" class="ae-input" type="number" step="5000" value="${me.monthlySavingsTL || 0}" />
          </div>
        </div>
        <div class="ae-kpi-2x2" style="margin-bottom:0">
          <div>
            <label style="display:block;font-size:11.5px;font-weight:800;color:var(--ink-400);margin-bottom:4px">Maaş Günü</label>
            <select id="msProfSalDay" class="ae-input">
              <option value="1" ${Number(me.salaryDay) === 1 ? 'selected' : ''}>Her Ayın 1'i</option>
              <option value="15" ${Number(me.salaryDay) !== 1 ? 'selected' : ''}>Her Ayın 15'i</option>
            </select>
          </div>
          <div>
            <label style="display:block;font-size:11.5px;font-weight:800;color:var(--ink-400);margin-bottom:4px">Lig Odası Kodu</label>
            <input id="msProfRoom" class="ae-input" type="text" value="${esc(st.roomCode || 'ORTAK-LIG')}" />
          </div>
        </div>

        <label style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;background:var(--surface-2);border:1px solid var(--line-subtle);border-radius:12px;font-size:13px;font-weight:700;cursor:pointer">
          <span>🌙 Gecelik Otomatik Nema (Net %${K.getOvernightRepoNetAnnualPct()})</span>
          <input id="msProfOvernightRepo" type="checkbox" ${me.autoOvernightRepo ? 'checked' : ''} style="width:19px;height:19px" />
        </label>

        <label style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;background:var(--surface-2);border:1px solid var(--line-subtle);border-radius:12px;font-size:13px;font-weight:700;cursor:pointer">
          <span>👓 Rahat Okuma (Büyük Yazı · Aa+)</span>
          <input id="msProfBigFont" type="checkbox" ${uiFontScale === 'large' ? 'checked' : ''} style="width:19px;height:19px" />
        </label>

        ${!isRunningAsInstalledApp() ? `
          <button type="button" class="ms-btn" style="width:100%;border-color:rgba(245,158,11,0.45);color:var(--gold-bright)" id="aeOpenInstallFromProfBtn">
            📲 Telefona Gerçek Uygulama Olarak Kur (.ipa / Tam Ekran)
          </button>
        ` : ''}

        <div id="msProfErr" class="neg" style="font-size:12px;font-weight:700;display:none"></div>

        <div style="display:flex;gap:8px">
          <button type="button" class="ms-btn" style="flex:1" id="aeModalThemeBtn">${uiTheme === 'obsidian' ? '☀️ Gündüz Modu' : '🌙 Gece Modu'}</button>
          <button type="button" class="ms-btn primary" style="flex:1.4" id="msSaveProfileBtn">Kaydet & Eşitle</button>
        </div>
      </div>
    `;

    openModalShell();
    bindSheetDragToDismiss();
    document.getElementById('msCloseModalBtn')?.addEventListener('click', closeModal);
    document.getElementById('msProfBigFont')?.addEventListener('change', (e) => {
      AetherNative.applyFontScale(e.target.checked ? 'large' : 'normal', true);
      renderHeader();
    });
    document.getElementById('aeOpenInstallFromProfBtn')?.addEventListener('click', () => {
      AetherNative.haptic('light');
      openInstallAppModal(false);
    });
    document.getElementById('aeModalThemeBtn')?.addEventListener('click', () => {
      AetherNative.toggleTheme();
      openProfileModal();
    });
    document.getElementById('msSaveProfileBtn')?.addEventListener('click', () => {
      const nm = (document.getElementById('msProfName')?.value || '').trim();
      const rl = document.getElementById('msProfRole')?.value || '';
      const exp = Number(document.getElementById('msProfExpense')?.value || 40000);
      const sav = Number(document.getElementById('msProfSavings')?.value || 0);
      const sday = Number(document.getElementById('msProfSalDay')?.value || 15);
      const repoChk = Boolean(document.getElementById('msProfOvernightRepo')?.checked);
      const room = document.getElementById('msProfRoom')?.value || 'ORTAK-LIG';
      if (nm.length > 0 && nm.length < 2) {
        AetherNative.haptic('error');
        const errEl = document.getElementById('msProfErr');
        if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Lütfen en az 2 harfli bir ad gir.'; }
        return;
      }
      K.updateHouseholdBaseline({ name: nm, roleLabel: rl, monthlyExpenseTL: exp, monthlySavingsTL: sav, salaryDay: sday, autoOvernightRepo: repoChk, roomCode: room });
      AetherNative.haptic('success');
      closeModal();
      AetherNative.toast('Profil ve lig odası güncellendi.', 'ok');
      renderHeader();
      renderCurrentTab(true);
    });
  }

  // --------------------------------------------------------------------------
  // 11. DOKUNMATİK JESTLER: SHEET SÜRÜKLE-KAPAT VE PULL-TO-REFRESH
  // --------------------------------------------------------------------------
  function bindSheetDragToDismiss() {
    const handle = document.getElementById('aeSheetDragHandle');
    const sheet = document.getElementById('msModalSheet');
    if (!handle || !sheet || modalMode === 'WELCOME') return;

    let startY = 0;
    let deltaY = 0;
    let dragging = false;

    handle.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      deltaY = 0;
      dragging = true;
      sheet.style.transition = 'none';
    }, { passive: true });

    handle.addEventListener('touchmove', (e) => {
      if (!dragging || !e.touches || e.touches.length !== 1) return;
      deltaY = Math.max(0, e.touches[0].clientY - startY);
      sheet.style.transform = `translateY(${deltaY}px)`;
    }, { passive: true });

    const finishDrag = () => {
      if (!dragging) return;
      dragging = false;
      sheet.style.transition = 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)';
      if (deltaY > 88) {
        AetherNative.haptic('light');
        closeModal();
      } else {
        sheet.style.transform = 'translateY(0)';
      }
    };

    handle.addEventListener('touchend', finishDrag, { passive: true });
    handle.addEventListener('touchcancel', finishDrag, { passive: true });
  }

  function setupViewportPullToRefresh() {
    const vp = document.getElementById('aeViewport');
    const ptr = document.getElementById('aePtrBar');
    if (!vp || !ptr) return;

    let startY = 0;
    let pulling = false;
    let refreshing = false;

    vp.addEventListener('touchstart', (e) => {
      if (vp.scrollTop <= 0 && e.touches?.length === 1 && !refreshing) {
        startY = e.touches[0].clientY;
        pulling = true;
      } else {
        pulling = false;
      }
    }, { passive: true });

    vp.addEventListener('touchmove', (e) => {
      if (!pulling || refreshing || vp.scrollTop > 0) return;
      const dy = (e.touches?.[0]?.clientY || 0) - startY;
      if (dy > 58) {
        ptr.classList.add('active');
      }
    }, { passive: true });

    vp.addEventListener('touchend', async () => {
      if (!pulling) return;
      pulling = false;
      if (ptr.classList.contains('active') && !refreshing) {
        refreshing = true;
        AetherNative.haptic('medium');
        try {
          await global.AetherKernelV10?.refreshLiveMarketData();
          AetherNative.toast('Canlı piyasa ve lig fiyatları yenilendi', 'ok');
        } catch (_) {}
        setTimeout(() => {
          ptr.classList.remove('active');
          refreshing = false;
        }, 420);
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 12. GENEL SEKME YÖNETİMİ (KAYDIRMA KORUMALI) VE BAŞLATMA
  // --------------------------------------------------------------------------
  function renderCurrentTab(preserveScroll = false) {
    const vp = document.getElementById('aeViewport');
    const host = document.getElementById('msMainContainer');
    if (!host) return;

    const prevScrollTop = preserveScroll && vp ? vp.scrollTop : 0;
    const savedHScrolls = {};
    if (preserveScroll) {
      host.querySelectorAll('.ae-hscroll[id]').forEach((el) => {
        savedHScrolls[el.id] = el.scrollLeft;
      });
    }

    document.querySelectorAll('.ms-tab-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-tab') === activeTab);
    });

    if (activeTab === 'home') renderHomeTab(host);
    else if (activeTab === 'market') renderMarketTab(host);
    else if (activeTab === 'compass') renderCompassTab(host);
    else if (activeTab === 'wallet') {
      activeTab = 'home';
      homeSubTab = walletSubTab === 'QUEUES' ? 'QUEUES' : 'HOLDINGS';
      renderHomeTab(host);
    } else if (activeTab === 'mastery') renderMasteryTab(host);
    else if (activeTab === 'family') renderFamilyTab(host);

    if (preserveScroll && vp) {
      vp.scrollTop = prevScrollTop;
      Object.entries(savedHScrolls).forEach(([id, sl]) => {
        const el = document.getElementById(id);
        if (el) el.scrollLeft = sl;
      });
    }
  }

  function switchTab(tabName) {
    if (!tabName) return;
    AetherNative.haptic('selection');
    if (tabName === 'wallet') {
      activeTab = 'home';
      homeSubTab = walletSubTab === 'QUEUES' ? 'QUEUES' : 'HOLDINGS';
    } else {
      activeTab = tabName;
    }
    renderHeader();
    renderCurrentTab(false);
    const vp = document.getElementById('aeViewport');
    if (vp) vp.scrollTop = 0;
  }

  function mount() {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    try {
      const savedTheme = global.localStorage?.getItem('aether_ui_theme');
      AetherNative.applyTheme(savedTheme || 'obsidian', false);
      const savedFont = global.localStorage?.getItem('aether_font_scale');
      AetherNative.applyFontScale(savedFont || 'normal', false);
    } catch (_) {
      AetherNative.applyTheme('obsidian', false);
      AetherNative.applyFontScale('normal', false);
    }

    if (global.addEventListener) {
      global.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPwaPrompt = e;
        if (modalMode === 'INSTALL') openInstallAppModal(false);
      });
      global.addEventListener('aetherOtaReady', (e) => {
        const ver = e?.detail || '';
        stagedOtaVersion = ver;
        AetherNative.toast(`🚀 Yeni güncelleme (v${ver}) hazır! Yüklemek için dokun`, 'ok', () => {
          try {
            global.webkit?.messageHandlers?.aetherBridge?.postMessage({ action: 'applyStagedOtaNow' });
          } catch (_) {}
        });
      });
      global.addEventListener('aetherNativeTtsState', (e) => {
        const st = e?.detail || '';
        if (st === 'speaking') {
          AetherNative.toast('🔊 Dost sesli anlatıyor (durdurmak için tekrar dokun)', 'ok');
        } else if (st === 'stopped') {
          AetherNative.toast('Sesli anlatım durduruldu', 'info');
        }
      });
    }

    K.init();
    const initBanter = K.getState()?.banterFeed?.[0]?.id || null;
    lastKnownTradeFeedId = initBanter;

    const initialFeed = G?.getEnrichedLiveNewsFeed ? G.getEnrichedLiveNewsFeed() : [];
    initialFeed.forEach((n) => { if (n?.id) knownNewsFeedIds.add(n.id); });
    newsTrackerReady = true;

    K.subscribe(() => {
      renderHeader();

      // 1) Yeni KAP / Resmi Gazete / Makro bildirimi düştüyse Dynamic Island + Yerel Push tetikle!
      if (newsTrackerReady && G?.getEnrichedLiveNewsFeed) {
        const curFeed = G.getEnrichedLiveNewsFeed() || [];
        let freshUrgent = null;
        for (const item of curFeed) {
          if (item?.id && !knownNewsFeedIds.has(item.id)) {
            knownNewsFeedIds.add(item.id);
            if (!freshUrgent) freshUrgent = item;
          }
        }
        if (freshUrgent) {
          preOpenBriefDismissed = false;
          AetherNative.haptic('medium');
          AetherNative.toast(`${freshUrgent.badge}: ${freshUrgent.title}`, 'info', () => {
            compassSubTab = 'BRIEF';
            switchTab('compass');
          });
          AetherNative.scheduleLocalPush(freshUrgent.id, `AETHER · ${freshUrgent.badge}`, freshUrgent.title, 1);
        }
      }

      // 2) Yeni canlı lig hamlesi düştüyse Dynamic Island bildirimi göster (yalnızca son 45 sn içindeki taze anlık olaylar)
      const latestEv = K.getState()?.banterFeed?.[0];
      if (latestEv && latestEv.id !== lastKnownTradeFeedId) {
        const hadPrev = lastKnownTradeFeedId !== null;
        lastKnownTradeFeedId = latestEv.id;
        const evAgeMs = Math.abs(Date.now() - (Number(latestEv.ts) || 0));
        if (hadPrev && evAgeMs <= 45000 && latestEv.authorId && latestEv.authorId !== K.getActiveMember().id) {
          AetherNative.haptic('light');
          AetherNative.toast(`Canlı Lig · ${latestEv.authorName}: ${latestEv.text}`, 'info', () => switchTab('family'));
        }
      }

      if (modalMode === 'PEER_XRAY' && inspectedPeerId) {
        openPeerXrayModal(inspectedPeerId);
      }

      // Kullanıcı bir metin kutusunda yazıyorsa veya çekmece açıksa arka plan ekranını sıçratma
      const activeTag = document.activeElement?.tagName || '';
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT' || modalMode === 'ASSET' || modalMode === 'PROFILE' || modalMode === 'WELCOME' || modalMode === 'INSTALL' || modalMode === 'RESET_CONFIRM') {
        return;
      }
      renderCurrentTab(true);
    });

    document.querySelectorAll('.ms-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });

    document.getElementById('msModalBackdrop')?.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'msModalBackdrop' && modalMode !== 'WELCOME') {
        closeModal();
      }
    });

    document.getElementById('aeTermOverlay')?.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'aeTermOverlay') {
        closeTermPopover();
      }
    });

    setupViewportPullToRefresh();
    renderHeader();
    renderCurrentTab(false);
    setInterval(tickHeaderClockOnly, 1000);

    if (!K.getActiveMember().profileRegistered) {
      openWelcomeModal();
    }
  }

  global.MillionSimApp = {
    mount,
    switchTab,
    openAssetDrawer,
    openWelcomeModal,
    openProfileModal,
    openInstallAppModal,
    openResetConfirmModal,
    openTermPopover,
    closeTermPopover,
    closeModal,
    toggleTheme: () => AetherNative.toggleTheme(),
    toggleFontScale: () => AetherNative.toggleFontScale()
  };
})(typeof window !== 'undefined' ? window : globalThis);
