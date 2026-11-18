// ============================================================================
// AETHER v13.0 — 1.000.000 ₺ GERÇEK YATIRIM MEYDANI, SOKAK ZEKÂSI KEŞFİ,
// USTALIK AYNASI & KÜRESEL CANLI YATIRIMCI LİGİ UYGULAMASI (million-sim-app.js)
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
    'bist-eregl',
    'reel-enerji-astor',
    'gayrimenkul-konut-ekgyo',
    'altin-sertifikasi',
    'gram-gumus-spot',
    'eurobond-usdtr',
    'abd-sp500-spy',
    'kuresel-hisse-nvda',
    'kripto-btc'
  ];

  let activeTab = 'market';
  let activeLens = 'VITRIN'; // VITRIN | FIRE_SALE | BAKERY_CASH | PASSIVE_RIVER | ROTTEN_TRAPS | IPO_DIVIDEND
  let activeCategory = 'ALL'; // ALL | GOLD_COMMODITY | RATE_SUKUK | FX | BIST_ALL | FUNDS | GLOBAL_CRYPTO
  let searchQuery = '';
  let selectedChainId = null;
  let selectedNewsId = null;
  let selectedCrisisId = 'NONE';
  let showNewsPanel = false;
  let leagueSortBy = 'NET_WORTH'; // NET_WORTH | PNL_PCT | MASTERY

  // Çekmece (Modal) Durumu: 'ASSET' | 'WELCOME' | 'PROFILE' | 'PEER_XRAY' | null
  let modalMode = null;
  let drawerAssetKey = null;
  let drawerOpenedAtMs = 0;
  let inspectedPeerId = null;
  let selectedDoor = 'BAZAAR';
  let selectedMaturity = 32;
  let selectedUseMargin = false;
  let selectedThesisTag = 'RESEARCH_FUNDAMENTAL';
  let draftThesisNote = '';
  let draftOrderAmount = 100000;
  let lastDrawerFeedback = null;
  let lastIpoFeedback = null;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtTL(n) {
    return Math.round(Number(n) || 0).toLocaleString('tr-TR') + ' ₺';
  }

  function fmtUnitTL(n) {
    const v = Number(n) || 0;
    if (v >= 1000) return Math.round(v).toLocaleString('tr-TR') + ' ₺';
    if (v >= 1) return v.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
    return v.toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 4 }) + ' ₺';
  }

  function fmtAgo(ts) {
    if (!ts) return 'Az önce';
    const diffSec = Math.max(0, Math.floor((Date.now() - Number(ts)) / 1000));
    if (diffSec < 65) return 'Şimdi Açık';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} dk önce`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} sa önce`;
    return `${Math.floor(diffSec / 86400)} gün önce`;
  }

  function initials(name) {
    const parts = String(name || 'Y').trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toLocaleUpperCase('tr-TR');
    return String(parts[0] || 'Y').slice(0, 2).toLocaleUpperCase('tr-TR');
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
        ${ab.equityPct > 0.4 ? `<span><i style="background:#2563eb"></i>Hisse %${ab.equityPct}</span>` : ''}
        ${ab.metalPct > 0.4 ? `<span><i style="background:#eab308"></i>Altın/Emtia %${ab.metalPct}</span>` : ''}
        ${ab.fixedPct > 0.4 ? `<span><i style="background:#059669"></i>Sabit Getiri %${ab.fixedPct}</span>` : ''}
        ${ab.globalFxCryptoPct > 0.4 ? `<span><i style="background:#7c3aed"></i>Döviz/Küresel/Kripto %${ab.globalFxCryptoPct}</span>` : ''}
        ${ab.cashPct > 0.4 ? `<span><i style="background:#94a3b8"></i>Nakit/Takas %${ab.cashPct}</span>` : ''}
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // ÜST KOKPİT ÇUBUĞU (KİŞİSEL KASA + CANLI PİYASA SAATLERİ + CANLI KUR ŞERİDİ)
  // --------------------------------------------------------------------------
  let lastHeaderPhaseSig = '';
  let lastPortfolioFeedback = null;

  function renderHeader() {
    const K = global.AetherKernelV10;
    if (!K) return;
    const me = K.getActiveMember();
    const clock = K.getTurkishClock();
    const snap = K.evaluateMemberPortfolio(me);
    const mastery = K.evaluateInvestorMastery(me, snap);
    const league = K.getLeagueStatus();
    const headerEl = document.getElementById('msHeaderInner');
    if (!headerEl) return;

    const pnlSign = snap.nominalPnlTL >= 0 ? '+' : '';
    const pnlCls = snap.nominalPnlTL > 0 ? 'pos' : (snap.nominalPnlTL < 0 ? 'neg' : '');
    const usd = K.getUsdTry();
    const gold = K.getAsset('gram-altin-spot')?.priceTL || 6115;
    const bist = K.getAsset('bist-100')?.priceTL || 11677;
    const inf = K.getAnnualInflationPct();

    lastHeaderPhaseSig = `${clock.bistPhase}|${clock.grandBazaarOpen}|${clock.bankDaytimeTight}|${clock.tefasBeforeCutoff}|${clock.calendarAlerts.join(',')}`;

    const badgeEl = document.getElementById('msLeagueTabBadge');
    if (badgeEl) {
      badgeEl.textContent = String(Math.max(1, league.investorCount));
    }

    headerEl.innerHTML = `
      <div class="ms-header-top">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <button type="button" class="ms-profile-trigger" id="msOpenProfileBtn" title="Profil ve Maaş Ayarları">
            <span class="ms-avatar" style="background:${esc(me.avatarColor || '#2563eb')}">${esc(initials(me.profileRegistered ? me.name : 'Ben'))}</span>
            <span>${esc(me.profileRegistered ? me.name : 'Adını Kaydet')} · <small style="color:#93c5fd;font-weight:700">${esc(mastery.rankTitle)}</small></span>
          </button>
          <span class="ms-clock-chip" style="font-size:12px;color:#cbd5e1">
            <span class="ms-dot ${league.isOnline ? 'open' : ''}"></span>
            <span>${league.isOnline ? `Canlı Lig Aktif (${league.investorCount} Yatırımcı)` : 'Lig Bağlanıyor...'}</span>
          </span>
        </div>

        <div class="ms-balance-strip">
          <div class="ms-bal-item">
            <span>Net Portföyüm</span>
            <strong>${fmtTL(snap.totalNetWorthTL)}</strong>
          </div>
          <div class="ms-bal-item">
            <span>Net Kâr / Zarar</span>
            <strong class="${pnlCls}">${pnlSign}${fmtTL(snap.nominalPnlTL)} (${pnlSign}%${snap.nominalPnlPct})</strong>
          </div>
          <div class="ms-bal-item">
            <span>Boş Nakit${snap.autoOvernightRepo ? ' (O/N)' : ''}</span>
            <strong>${fmtTL(snap.cashTL)}</strong>
          </div>
          ${snap.marginDebtTL > 0 ? `
            <div class="ms-bal-item">
              <span>Kredi Borcu</span>
              <strong class="neg">-${fmtTL(snap.marginDebtTL)}</strong>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="ms-clock-ribbon">
        <span class="ms-clock-chip">
          <span class="ms-dot ${clock.bistCanMatchNow ? 'open' : 'closed'}"></span>
          <strong id="msLiveClockTime">${esc(clock.timeStr)}</strong> · <span id="msLiveBistLabel">${esc(clock.bistLabel)}</span>
        </span>
        <span class="ms-clock-chip">
          <span class="ms-dot ${clock.grandBazaarOpen ? 'open' : ''}"></span>
          Çarşı Makas %${clock.bazaarSpreadPct.toFixed(2)} · Banka %${clock.bankSpreadPct.toFixed(2)}
        </span>
        <span class="ms-clock-chip" id="msLiveTefasLabel">
          ${esc(clock.tefasLabel)}
        </span>
        <span style="margin-left:auto;font-weight:700;color:#e2e8f0">
          Dolar ${usd.toFixed(2)} ₺ · Gr Altın ${Math.round(gold).toLocaleString('tr-TR')} ₺ · BIST ${Math.round(bist).toLocaleString('tr-TR')} · TÜFE %${inf.toFixed(1)}
        </span>
      </div>
      ${clock.calendarAlerts.length > 0 ? `
        <div style="background:rgba(245,158,11,0.18);border:1px solid rgba(251,191,36,0.4);color:#fde68a;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:700">
          Canlı Takvim Uyarısı: ${esc(clock.calendarAlerts.join(' | '))}
        </div>
      ` : ''}
    `;

    document.getElementById('msOpenProfileBtn')?.addEventListener('click', () => {
      openProfileModal();
    });
  }

  function tickHeaderClockOnly() {
    const K = global.AetherKernelV10;
    if (!K) return;
    const clock = K.getTurkishClock();
    const sig = `${clock.bistPhase}|${clock.grandBazaarOpen}|${clock.bankDaytimeTight}|${clock.tefasBeforeCutoff}|${clock.calendarAlerts.join(',')}`;
    if (sig !== lastHeaderPhaseSig || !document.getElementById('msLiveClockTime')) {
      renderHeader();
      return;
    }
    const timeEl = document.getElementById('msLiveClockTime');
    if (timeEl) timeEl.textContent = clock.timeStr;
    const tefasEl = document.getElementById('msLiveTefasLabel');
    if (tefasEl) tefasEl.textContent = clock.tefasLabel;
  }

  // --------------------------------------------------------------------------
  // SEKME 1: PİYASA & KEŞİF (SOKAK ZEKÂSI, 5 USTA MERCEK, KRİZ TATBİKATI & 672+ VARLIK)
  // --------------------------------------------------------------------------
  function getFilteredMarketAssets() {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const all = K.getAllAssets().filter((a) => a.venue !== 'BENCHMARK_ONLY' && (a.priceTL > 0 || a.isRateInstrument));
    const q = searchQuery.trim().toLocaleUpperCase('tr-TR');

    if (q.length > 0) {
      return all
        .filter((a) =>
          a.name.toLocaleUpperCase('tr-TR').includes(q) ||
          a.ticker.toLocaleUpperCase('tr-TR').includes(q) ||
          (a.categoryName || '').toLocaleUpperCase('tr-TR').includes(q)
        )
        .slice(0, 60);
    }

    if (selectedNewsId) {
      const nw = (G.getEnrichedLiveNewsFeed() || []).find((x) => x.id === selectedNewsId);
      if (nw && nw.linkedKeys.length > 0) {
        return nw.linkedKeys.map((k) => K.getAsset(k)).filter(Boolean);
      }
    }

    if (selectedChainId) {
      const ch = (G.getLiveWorldChains() || []).find((c) => c.id === selectedChainId);
      if (ch) {
        return ch.assetKeys.map((k) => K.getAsset(k)).filter(Boolean);
      }
    }

    // Alt varlık sınıfı filtresi seçilmişse
    if (activeCategory !== 'ALL') {
      if (activeCategory === 'GOLD_COMMODITY') return all.filter((a) => a.categoryId === '2' || a.subVenue === 'DARPHANE_S1');
      if (activeCategory === 'RATE_SUKUK') return all.filter((a) => a.isRateInstrument || a.id === 'eurobond-usdtr' || a.id === 'eurobond-emb');
      if (activeCategory === 'FX') return all.filter((a) => String(a.id || '').startsWith('doviz-'));
      if (activeCategory === 'FUNDS') return all.filter((a) => a.categoryId === '4' || a.subVenue === 'BIST_TAXABLE_ETF' || a.subVenue === 'BIST_EXEMPT_ETF');
      if (activeCategory === 'GLOBAL_CRYPTO') return all.filter((a) => a.isForeignUsd || a.venue === 'CRYPTO_24_7');
      if (activeCategory === 'BIST_ALL') {
        return all
          .filter((a) => a.subVenue === 'BIST_STOCK')
          .sort((a, b) => (b.bistRow?.turnoverMillionTL || 0) - (a.bistRow?.turnoverMillionTL || 0))
          .slice(0, 72);
      }
    }

    // 5 Usta Keşif Merceği
    if (activeLens === 'FIRE_SALE') {
      const gems = all.filter((a) =>
        a.accumulationGem ||
        (a.bistRow && (a.bistRow.drawdown52WPct || 0) <= -25 && (a.bistRow.ocfMillionTL || 0) > 0 && !a.isPumpAnomaly)
      );
      return gems
        .sort((a, b) => ((b.bistRow?.cmf20 || 0) - (a.bistRow?.cmf20 || 0)))
        .slice(0, 36);
    }

    if (activeLens === 'BAKERY_CASH') {
      return all
        .filter((a) => a.bistRow && a.bistRow.entityKind !== 'bank' && (a.bistRow.ocfMillionTL || 0) > 250 && !a.isPumpAnomaly && !a.isTms29Illusion)
        .sort((a, b) => {
          const ratioA = (a.bistRow.ocfMillionTL || 0) / Math.max(0.5, a.bistRow.marketCapBillionTL || 10);
          const ratioB = (b.bistRow.ocfMillionTL || 0) / Math.max(0.5, b.bistRow.marketCapBillionTL || 10);
          return ratioB - ratioA;
        })
        .slice(0, 36);
    }

    if (activeLens === 'PASSIVE_RIVER') {
      const fixed = ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust', 'dibs-tahvil', 'eurobond-usdtr']
        .map((k) => K.getAsset(k))
        .filter(Boolean);
      const divStocks = all
        .filter((a) => a.bistRow && (a.bistRow.dividendYield || 0) >= 2.0 && (a.bistRow.ocfMillionTL || 0) > 0)
        .sort((a, b) => (b.bistRow.dividendYield || 0) - (a.bistRow.dividendYield || 0))
        .slice(0, 24);
      return [...fixed, ...divStocks];
    }

    if (activeLens === 'ROTTEN_TRAPS') {
      const s1 = K.getAsset('altin-sertifikasi');
      const traps = all.filter((a) => a.isPumpAnomaly || a.isTms29Illusion || a.distributionTrap || a.isPatronSelling);
      const out = s1 && K.getDarphanePremiumInfo().premiumPct >= 5 ? [s1, ...traps] : traps;
      return Array.from(new Set(out)).slice(0, 36);
    }

    return CURATED_VITRIN_KEYS.map((k) => K.getAsset(k)).filter(Boolean);
  }

  function renderIpoAndDividendDeskHtml() {
    const K = global.AetherKernelV10;
    const ipos = K.getActiveIpoCatalog();
    const divs = K.getDividendSchedule();
    const me = K.getActiveMember();

    return `
      <section class="ms-card" style="border:2px solid #bfdbfe;background:linear-gradient(180deg,#ffffff 0%,#f8fbff 100%)">
        <div class="ms-sec-head">
          <div>
            <h2 class="ms-sec-title">SPK Halka Arz Talep Toplama & Gerçek Temettü Takvimi</h2>
            <p class="ms-sec-sub">Halka arzlarda tüm paranla talep girsen bile gerçek kişi sayısına göre eşit lot düşer; temettüler ise ödeme gününde %15 stopajı kesilmiş net TL olarak kasana yatar.</p>
          </div>
        </div>

        ${lastIpoFeedback ? `<div class="ms-alert ${lastIpoFeedback.ok ? 'ok' : 'err'}">${esc(lastIpoFeedback.text)}</div>` : ''}

        <div class="ms-two-col">
          <div>
            <h3 style="margin:0 0 10px;font-size:15px;font-weight:800">Aktif SPK Halka Arz Gişesi</h3>
            <div class="ms-list">
              ${ipos.map((ipo) => {
                const already = (me.ipoRequests || []).find((r) => r.ipoId === ipo.id);
                const estLots = Math.round(ipo.totalOfferedLots / ipo.estimatedParticipants);
                return `
                  <div class="ms-list-row" style="align-items:flex-start;flex-direction:column">
                    <div style="width:100%;display:flex;justify-content:space-between;gap:8px;align-items:center">
                      <div>
                        <span class="ms-asset-code">${esc(ipo.ticker)}</span>
                        <strong style="font-size:14.5px;margin-left:6px">${esc(ipo.name)}</strong>
                      </div>
                      <strong style="font-size:15px">${fmtUnitTL(ipo.offerPriceTL)}</strong>
                    </div>
                    <div style="font-size:12.4px;color:#334155">
                      ${esc(ipo.distributionMethod)} · Tahmini Katılımcı: ~${ipo.estimatedParticipants.toLocaleString('tr-TR')} kişi (Kişi başı tahmini ~<strong>${estLots} lot / ${fmtTL(estLots * ipo.offerPriceTL)}</strong> düşer).<br/>
                      <span style="color:#64748b">${esc(ipo.netCashUseNote)}</span>
                    </div>
                    ${already ? `
                      <span class="ms-sig-pill good">Talebin Alındı: ${already.requestedLots} Lot (${fmtTL(already.blockedCashTL)} bloke edildi)</span>
                    ` : `
                      <div style="display:flex;gap:8px;width:100%;align-items:center;flex-wrap:wrap">
                        <input type="number" class="ms-input" id="msIpoLots_${esc(ipo.id)}" value="100" min="10" step="10" style="width:120px;padding:7px 10px" />
                        <span style="font-size:12px;color:#64748b">Lot Talep Et</span>
                        <button type="button" class="ms-btn primary sm" data-join-ipo="${esc(ipo.id)}" style="margin-left:auto">Halka Arza Katıl</button>
                      </div>
                    `}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div>
            <h3 style="margin:0 0 10px;font-size:15px;font-weight:800">Yaklaşan Nakit Temettü Ödemeleri (%15 Stopaj Sonrası Net)</h3>
            <div class="ms-list">
              ${divs.slice(0, 6).map((d) => {
                const held = me.positions?.[d.assetKey]?.qty || 0;
                return `
                  <div class="ms-list-row">
                    <div>
                      <strong>${esc(d.ticker)}</strong> · <span style="font-size:12.5px;color:#475569">${esc(d.frequency)}</span>
                      <div style="font-size:12.2px;color:#334155">
                        Pay Başı Net: <strong class="pos">+${fmtUnitTL(d.netPerShareTL)}</strong> (Net Verim %${d.netYieldPct}) · Ödeme: <strong>${esc(d.payDateYmd)}</strong>
                        ${held > 0 ? ` · <span class="pos">Beklenen Tahsilatın: +${fmtTL(held * d.netPerShareTL)}</span>` : ''}
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

  function renderMarketTab(host) {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const me = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(me);
    const brief = G.getDailyStreetBriefing();
    const newsFeed = G.getEnrichedLiveNewsFeed();
    const activeNews = newsFeed.find((x) => x.id === selectedNewsId) || null;
    const chains = G.getLiveWorldChains();
    const activeChain = chains.find((c) => c.id === selectedChainId) || null;
    const crisisSim = G.simulatePortfolioCrisis(selectedCrisisId);
    const assets = getFilteredMarketAssets();

    host.innerHTML = `
      <!-- 1. GÜNÜN SOKAK ZEKÂSI & GÖRMÜŞ GEÇİRMİŞ DOST KOKPİTİ -->
      <section class="ms-hero-brief">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="ms-hero-kicker">Günün Sokak Zekâsı & Canlı Piyasa Röntgeni</span>
          <button type="button" class="ms-btn sm" id="msToggleNewsBtn" style="background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.25);color:#fff">
            ${showNewsPanel ? 'Haber Akışını Daralt' : `Canlı KAP & Resmi Akış (${newsFeed.length})`}
          </button>
        </div>
        <h2 class="ms-hero-title">${esc(brief?.leadHeadline || '')}</h2>
        <p class="ms-hero-body">${esc(brief?.friendAdvice || '')}</p>

        <div class="ms-pulse-grid">
          ${(brief?.pulses || []).map((p) => `
            <div class="ms-pulse-box ${esc(p.tone)}">
              <span>${esc(p.label)}</span>
              <strong>${esc(p.value)}</strong>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- CANLI KAP, RESMİ GAZETE VE MUTFAK HABER AKIŞI -->
      ${showNewsPanel || activeNews ? `
        <section class="ms-card">
          <div class="ms-sec-head">
            <div>
              <h3 class="ms-sec-title">Canlı KAP, Resmi Gazete & Piyasa Haber Akışı</h3>
              <p class="ms-sec-sub">Bir habere dokunduğunda o gelişmenin gerçek hayatta hangi yatırımları etkilediğini aşağıda anında süzersin.</p>
            </div>
            ${selectedNewsId ? `<button type="button" class="ms-btn sm" id="msClearNewsBtn">Haber Filtresini Kaldır</button>` : ''}
          </div>
          <div class="ms-news-strip">
            ${newsFeed.map((nw) => `
              <button type="button" class="ms-news-item ${selectedNewsId === nw.id ? 'active' : ''}" data-news="${esc(nw.id)}">
                <span class="ms-news-tag ${esc(nw.tone)}">${esc(nw.badge)} · ${esc(nw.source)}</span>
                <div style="font-size:13.2px;font-weight:800;color:#0f172a;margin-bottom:4px">${esc(nw.title)}</div>
                <div style="font-size:12px;color:#475569">${esc(nw.streetImpact)}</div>
              </button>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- 2. DOMİNO ZİNCİRLERİ VE CANLI KRİZ / FIRTINA TATBİKATI -->
      <section class="ms-card">
        <div class="ms-sec-head">
          <div>
            <h2 class="ms-sec-title">Hammadde -> Fabrika Zincirleri & Ani Fırtına Tatbikatı</h2>
            <p class="ms-sec-sub">Mazottan domatese, kuraklıktan fabrikaya tüm bağlantıları kur; ortalık aniden karışırsa portföyüne ne olacağını önceden sına.</p>
          </div>
          ${selectedChainId ? `<button type="button" class="ms-btn sm" id="msClearChainBtn">Tüm Piyasaya Dön</button>` : ''}
        </div>

        <div class="ms-chains-strip">
          ${chains.map((c) => `
            <button type="button" class="ms-chain-pill ${selectedChainId === c.id ? 'active' : ''}" data-chain="${esc(c.id)}">
              ${esc(c.title)}
            </button>
          `).join('')}
        </div>

        ${activeChain ? `
          <div class="ms-chain-detail">
            <div style="font-size:12.8px;font-weight:800;color:#1d4ed8">${esc(activeChain.triggerHeadline)}</div>
            <div class="ms-flow-steps">
              <div class="ms-flow-box"><span>1. ÖNCÜ HAMMADDE / TETİK</span><strong>${esc(activeChain.step1)}</strong></div>
              <div class="ms-flow-box"><span>2. ÜRETİM / FİNANS KANALI</span><strong>${esc(activeChain.step2)}</strong></div>
              <div class="ms-flow-box"><span>3. KASASI ETKİLENENLER</span><strong>${esc(activeChain.step3)}</strong></div>
            </div>
            <div style="font-size:13.3px;color:#1e293b;font-weight:500">${esc(activeChain.insight)}</div>
          </div>
        ` : ''}

        <div style="margin-top:14px;padding-top:13px;border-top:1px solid #e2e8f0;display:flex;flex-wrap:wrap;align-items:center;gap:10px">
          <strong style="font-size:13.2px">Ani Fırtına Tatbikatı:</strong>
          <select id="msCrisisSelect" class="ms-input" style="width:auto;min-width:260px;padding:8px 12px;font-weight:700;font-size:13px">
            ${G.CRISIS_SCENARIOS.map((sc) => `
              <option value="${esc(sc.id)}" ${selectedCrisisId === sc.id ? 'selected' : ''}>${esc(sc.title)}</option>
            `).join('')}
          </select>
          ${selectedCrisisId !== 'NONE' ? `<button type="button" class="ms-btn sm" id="msResetCrisisBtn">Sıfırla</button>` : ''}
        </div>

        ${crisisSim ? `
          <div class="ms-alert ${crisisSim.totalDeltaTL >= 0 ? 'ok' : 'err'}" style="margin-bottom:0;margin-top:10px">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:4px">
              <strong>Senaryo: ${esc(crisisSim.scenario.title)}</strong>
              <strong style="font-size:14.5px">
                Portföyüne Anlık Etkisi: ${crisisSim.totalDeltaTL >= 0 ? '+' : ''}${fmtTL(crisisSim.totalDeltaTL)} (${crisisSim.totalDeltaPct >= 0 ? '+' : ''}%${crisisSim.totalDeltaPct})
                -> Yeni Değer: ${fmtTL(crisisSim.postNetWorthTL)}
              </strong>
            </div>
            <div style="font-size:12.5px;font-weight:500">${esc(crisisSim.scenario.desc)}</div>
            ${crisisSim.marginWiped ? `<div style="margin-top:6px;font-weight:800;color:#991b1b">⚠️ KREDİLİ BORÇ ALARMI: Bu şokta özsermaye teminatın %35'in altına çöküyor; aracı kurum saat 15:00'te hisselerini en dipten zorla satar!</div>` : ''}
            ${crisisSim.itemImpacts.length > 0 ? `
              <div style="margin-top:6px;font-size:12px">
                <strong>Kalem Bazlı Dalga:</strong>
                ${crisisSim.itemImpacts.map((it) => `${esc(it.name)} (${it.deltaTL >= 0 ? '+' : ''}${fmtTL(it.deltaTL)})`).join(' · ')}
              </div>
            ` : `<div style="margin-top:6px;font-size:12px">Portföyünün tamamı henüz boş nakitte olduğu için fiyat dalgası vurmadı; ancak kur/enflasyon şokunda nakdin alım gücü sessizce erir.</div>`}
          </div>
        ` : ''}
      </section>

      <!-- 3. HALKA ARZ VE TEMETTÜ MASASI SEÇİLİYSE GÖSTER -->
      ${activeLens === 'IPO_DIVIDEND' ? renderIpoAndDividendDeskHtml() : ''}

      <!-- 4. KEŞİF MERCEKLERİ & 672+ GERÇEK YATIRIM ARACI MEYDANI -->
      <section class="ms-card">
        <div class="ms-sec-head">
          <div>
            <h2 class="ms-sec-title">Yatırım Keşif Radarı & Gerçek Varlıklar</h2>
            <p class="ms-sec-sub">Ezbere hisse arama; 5 usta bakış açısından birini seçerek 672+ gerçek yatırımı kasasına, nakit akışına ve fiyat döngüsüne göre incele.</p>
          </div>
        </div>

        <div class="ms-lens-grid">
          <button type="button" class="ms-lens-card ${activeLens === 'VITRIN' && activeCategory === 'ALL' && !selectedChainId && !selectedNewsId ? 'active' : ''}" data-lens="VITRIN">
            <strong>Vitrin: 20 Ana Kutup</strong>
            <span>Altın, Sukuk, Döviz, Sanayi Devleri, ABD & Kripto</span>
          </button>
          <button type="button" class="ms-lens-card ${activeLens === 'FIRE_SALE' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="FIRE_SALE">
            <strong>🔥 Yangın Yeri Hazineleri</strong>
            <span>Çok düşmüş ama kasası nakit üreten & toplananlar</span>
          </button>
          <button type="button" class="ms-lens-card ${activeLens === 'BAKERY_CASH' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="BAKERY_CASH">
            <strong>🥖 Fırın Gibi Nakit Basanlar</strong>
            <span>Kağıt kârı değil, kasasına sıcak nakit giren kaleler</span>
          </button>
          <button type="button" class="ms-lens-card ${activeLens === 'PASSIVE_RIVER' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="PASSIVE_RIVER">
            <strong>💧 Düzenli Nakit Çarkı</strong>
            <span>%0 Stopaj Sukuk, Günlük PPF & Temettü Şampiyonları</span>
          </button>
          <button type="button" class="ms-lens-card ${activeLens === 'ROTTEN_TRAPS' && activeCategory === 'ALL' ? 'active' : ''}" data-lens="ROTTEN_TRAPS">
            <strong>⛔ Çürük Elma & Tuzaklar</strong>
            <span>Nakit yakanlar, hava parası balonları & patron satışı</span>
          </button>
          <button type="button" class="ms-lens-card ${activeLens === 'IPO_DIVIDEND' ? 'active' : ''}" data-lens="IPO_DIVIDEND">
            <strong>🏛️ Halka Arz & Temettü</strong>
            <span>SPK eşit dağıtım gişesi & net temettü ödeme takvimi</span>
          </button>
        </div>

        <div class="ms-search-row">
          <input id="msSearchInp" class="ms-input" type="search" value="${esc(searchQuery)}" placeholder="672+ gerçek yatırımdan ara: Gram Altın, Kira Sertifikası, TUPRS, THYAO, FROTO, BIMAS, S&P 500, Bitcoin..." />
        </div>

        <div class="ms-pills">
          <button type="button" class="ms-pill ${activeCategory === 'ALL' ? 'active' : ''}" data-cat="ALL">Seçili Radar</button>
          <button type="button" class="ms-pill ${activeCategory === 'GOLD_COMMODITY' ? 'active' : ''}" data-cat="GOLD_COMMODITY">Altın, Gümüş & Emtia</button>
          <button type="button" class="ms-pill ${activeCategory === 'RATE_SUKUK' ? 'active' : ''}" data-cat="RATE_SUKUK">Mevduat, PPF & Sukuk</button>
          <button type="button" class="ms-pill ${activeCategory === 'FX' ? 'active' : ''}" data-cat="FX">Döviz</button>
          <button type="button" class="ms-pill ${activeCategory === 'BIST_ALL' ? 'active' : ''}" data-cat="BIST_ALL">Türk Şirketleri (619)</button>
          <button type="button" class="ms-pill ${activeCategory === 'FUNDS' ? 'active' : ''}" data-cat="FUNDS">Fonlar & BYF</button>
          <button type="button" class="ms-pill ${activeCategory === 'GLOBAL_CRYPTO' ? 'active' : ''}" data-cat="GLOBAL_CRYPTO">ABD Borsası & Kripto</button>
        </div>

        <div class="ms-asset-grid">
          ${assets.map((a) => {
            const sig = G.getCardQuickSignal(a);
            const r52 = G.computeRange52W(a);
            const chg = Number(a.change1D) || 0;
            const heldSpot = snap.spotItems.find((x) => x.assetKey === a.key);
            const heldTr = snap.tranches.find((t) => t.assetKey === a.key);
            const isOwned = Boolean(heldSpot || heldTr);
            const flash = K.getPriceFlash(a.key);
            const priceLabel = a.isRateInstrument
              ? `Yıllık %${a.annualGrossRatePct.toFixed(1)}`
              : fmtUnitTL(a.priceTL);
            const chgLabel = a.isRateInstrument
              ? (a.stopajPct === 0 ? '%0 Vergi' : `%${a.stopajPct} Stopaj`)
              : `${chg >= 0 ? '+' : ''}%${chg.toFixed(2)}`;
            const chgCls = a.isRateInstrument ? 'flat' : (chg > 0 ? 'pos' : (chg < 0 ? 'neg' : 'flat'));

            return `
              <article class="ms-asset-card ${isOwned ? 'owned' : ''} ${flash === 'up' ? 'flash-up' : (flash === 'down' ? 'flash-down' : '')}" data-open-asset="${esc(a.key)}">
                <div>
                  <div class="ms-asset-top">
                    <span class="ms-asset-code">${esc(a.ticker)}</span>
                    ${sig.badge ? `<span class="ms-sig-pill ${esc(sig.tone)}">${esc(sig.badge)}</span>` : ''}
                  </div>
                  <h3 class="ms-asset-name">${esc(a.name)}</h3>
                  <p class="ms-asset-desc">${esc(sig.oneLiner)}</p>

                  ${r52 ? `
                    <div class="ms-range-wrap">
                      <div class="ms-range-labels">
                        <span>52H Dip: ${fmtUnitTL(r52.low)}</span>
                        <span>Zirveye ${r52.drawdownPct}%</span>
                      </div>
                      <div class="ms-range-track">
                        <span class="ms-range-dot" style="left:${r52.pct}%"></span>
                      </div>
                    </div>
                  ` : ''}
                </div>

                <div>
                  ${heldSpot ? `
                    <div style="font-size:11.8px;font-weight:800;margin-bottom:6px;color:${heldSpot.pnlNetTL >= 0 ? '#059669' : '#dc2626'}">
                      Portföyde: ${fmtTL(heldSpot.netValTL)} (${heldSpot.pnlNetTL >= 0 ? '+' : ''}%${heldSpot.pnlNetPct})
                    </div>
                  ` : (heldTr ? `
                    <div style="font-size:11.8px;font-weight:800;margin-bottom:6px;color:#059669">
                      Portföyde Bağlı: ${fmtTL(heldTr.accruedNetValueTL)}
                    </div>
                  ` : '')}
                  <div class="ms-asset-bottom">
                    <span class="ms-price-val">${priceLabel}</span>
                    <span class="ms-chg-badge ${chgCls}">${esc(chgLabel)}</span>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    `;

    document.getElementById('msToggleNewsBtn')?.addEventListener('click', () => {
      showNewsPanel = !showNewsPanel;
      renderMarketTab(host);
    });

    host.querySelectorAll('[data-news]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-news');
        selectedNewsId = selectedNewsId === id ? null : id;
        selectedChainId = null;
        searchQuery = '';
        renderMarketTab(host);
      });
    });

    document.getElementById('msClearNewsBtn')?.addEventListener('click', () => {
      selectedNewsId = null;
      renderMarketTab(host);
    });

    host.querySelectorAll('[data-chain]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-chain');
        selectedChainId = selectedChainId === id ? null : id;
        selectedNewsId = null;
        searchQuery = '';
        renderMarketTab(host);
      });
    });

    document.getElementById('msClearChainBtn')?.addEventListener('click', () => {
      selectedChainId = null;
      renderMarketTab(host);
    });

    document.getElementById('msCrisisSelect')?.addEventListener('change', (e) => {
      selectedCrisisId = e.target.value;
      renderMarketTab(host);
    });

    document.getElementById('msResetCrisisBtn')?.addEventListener('click', () => {
      selectedCrisisId = 'NONE';
      renderMarketTab(host);
    });

    host.querySelectorAll('[data-lens]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeLens = btn.getAttribute('data-lens');
        activeCategory = 'ALL';
        selectedChainId = null;
        selectedNewsId = null;
        searchQuery = '';
        lastIpoFeedback = null;
        renderMarketTab(host);
      });
    });

    host.querySelectorAll('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat');
        selectedChainId = null;
        selectedNewsId = null;
        searchQuery = '';
        renderMarketTab(host);
      });
    });

    const searchInp = document.getElementById('msSearchInp');
    if (searchInp) {
      searchInp.addEventListener('input', () => {
        searchQuery = searchInp.value;
        const pos = searchInp.selectionStart || searchQuery.length;
        renderMarketTab(host);
        const again = document.getElementById('msSearchInp');
        if (again) {
          again.focus();
          try { again.setSelectionRange(pos, pos); } catch (_) {}
        }
      });
    }

    host.querySelectorAll('[data-join-ipo]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ipoId = btn.getAttribute('data-join-ipo');
        const inp = document.getElementById('msIpoLots_' + ipoId);
        const lots = Number(inp?.value || 100);
        const res = K.participateInIpo(ipoId, lots);
        lastIpoFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
        renderHeader();
        renderMarketTab(host);
      });
    });

    host.querySelectorAll('[data-open-asset]').forEach((el) => {
      el.addEventListener('click', () => openAssetDrawer(el.getAttribute('data-open-asset')));
    });
  }

  // --------------------------------------------------------------------------
  // 360° YATIRIM RÖNTGENİ, MAHALLE FIRINI KASASI & GERÇEK EMİR GİŞESİ ÇEKMECESİ
  // --------------------------------------------------------------------------
  function openModalShell() {
    const bd = document.getElementById('msModalBackdrop');
    if (bd) bd.classList.add('open');
  }

  function closeModal() {
    modalMode = null;
    drawerAssetKey = null;
    inspectedPeerId = null;
    const bd = document.getElementById('msModalBackdrop');
    if (bd) bd.classList.remove('open');
  }

  function openAssetDrawer(assetKey) {
    const K = global.AetherKernelV10;
    const asset = K.getAsset(assetKey);
    if (!asset) return;
    modalMode = 'ASSET';
    drawerAssetKey = asset.key;
    drawerOpenedAtMs = Date.now();
    selectedUseMargin = false;
    selectedThesisTag = asset.isRateInstrument ? 'INFLATION_SHIELD' : 'RESEARCH_FUNDAMENTAL';
    draftThesisNote = '';
    lastDrawerFeedback = null;

    const snap = K.evaluateMemberPortfolio();
    draftOrderAmount = Math.min(100000, Math.max(1000, Math.floor(snap.cashTL * 0.25) || 25000));

    if (asset.bistRow || asset.subVenue === 'DARPHANE_S1') {
      K.markInspectedCashScale();
    }
    renderAssetDrawer();
    openModalShell();
  }

  function renderCycleAndRealHorizonHtml(info) {
    const mh = info?.multiHorizon;
    const r52 = info?.range52W;
    if (!mh || !Array.isArray(mh.horizons) || mh.horizons.length === 0) return '';

    let sparkSvg = '';
    if (Array.isArray(mh.sparklinePts) && mh.sparklinePts.length >= 4) {
      const pts = mh.sparklinePts;
      const w = 260;
      const h = 48;
      const coords = pts.map((val, i) => {
        const x = +((i / Math.max(1, pts.length - 1)) * w).toFixed(1);
        const y = +(h - (Math.max(0, Math.min(100, Number(val) || 50)) / 100) * (h - 8) - 4).toFixed(1);
        return `${x},${y}`;
      });
      const isUp = pts[pts.length - 1] >= pts[0];
      const stroke = isUp ? '#059669' : '#dc2626';
      const fill = isUp ? 'rgba(16,185,129,0.12)' : 'rgba(220,38,38,0.10)';
      const poly = `0,${h} ${coords.join(' ')} ${w},${h}`;
      sparkSvg = `
        <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:52px;display:block;margin-bottom:8px" preserveAspectRatio="none" aria-label="Fiyat Döngüsü">
          <polygon points="${poly}" fill="${fill}"></polygon>
          <polyline points="${coords.join(' ')}" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></polyline>
        </svg>
      `;
    }

    return `
      <div class="ms-card" style="background:#f8fafc;margin:12px 0;padding:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px">
          <strong style="font-size:13.6px">Zaman Döngüsü & Enflasyon Terazisi (Reel Alım Gücü)</strong>
          ${r52 ? `<span style="font-size:11.6px;font-weight:700;color:#475569">52H Dip ${fmtUnitTL(r52.low)} · Zirve ${fmtUnitTL(r52.high)} (${r52.drawdownPct}%)</span>` : ''}
        </div>
        ${sparkSvg}
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px">
          ${mh.horizons.map((hz) => `
            <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:9px;padding:7px 8px;text-align:center">
              <span style="display:block;font-size:10.5px;font-weight:800;color:#64748b">${esc(hz.label)}</span>
              <strong style="display:block;font-size:13px;color:#0f172a">${hz.nominalPct >= 0 ? '+' : ''}%${hz.nominalPct}</strong>
              <small style="display:block;font-size:10.6px;font-weight:800" class="${hz.realPct >= 0 ? 'pos' : 'neg'}">
                Reel ${hz.realPct >= 0 ? '+' : ''}%${hz.realPct}
              </small>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderHealthAndBakeryHtml(info) {
    const h = info?.health;
    if (!h) return '';

    if (h.kind === 'FINANCIAL') {
      const fn = h.financial100k;
      return `
        <div class="ms-card" style="background:#f8fafc;margin:12px 0;padding:15px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
            <strong style="font-size:14px">Banka & Finans Kasası (100.000 ₺ Ortaklıkta Senin Payın)</strong>
            <span style="font-size:12px;font-weight:700;color:#475569">F/K: ${h.pe ?? '-'} · PD/DD: ${h.pb ?? '-'}${h.roePct != null ? ` · ROE: %${h.roePct}` : ''}</span>
          </div>
          ${fn ? `
            <p style="margin:0 0 8px;font-size:13px;color:#1e293b">${esc(fn.plainSummary)}</p>
            <div class="ms-bakery-grid" style="margin-bottom:10px">
              <div class="ms-bakery-cell">
                <span>Günlük Net Kâr Payın</span>
                <strong class="${fn.dailyNetProfitTL >= 0 ? 'pos' : 'neg'}">${fn.dailyNetProfitTL >= 0 ? '+' : ''}${fn.dailyNetProfitTL.toLocaleString('tr-TR')} ₺/gün</strong>
              </div>
              <div class="ms-bakery-cell">
                <span>Yıllık Net Kâr Payın</span>
                <strong class="${fn.annualNetProfitTL >= 0 ? 'pos' : 'neg'}">${fn.annualNetProfitTL >= 0 ? '+' : ''}${fmtTL(fn.annualNetProfitTL)}</strong>
              </div>
              <div class="ms-bakery-cell">
                <span>Özsermaye Kârlılığı (ROE)</span>
                <strong>${fn.roePct != null ? '%' + fn.roePct : '-'}</strong>
              </div>
              <div class="ms-bakery-cell">
                <span>Yıllık Net Temettü Payın</span>
                <strong class="${fn.annualNetDivTL > 0 ? 'pos' : ''}">${fn.annualNetDivTL > 0 ? '+' + fmtTL(fn.annualNetDivTL) : 'Dağıtım Yok'}</strong>
              </div>
            </div>
          ` : ''}
          <div style="font-size:12.6px;color:#1e293b;margin-top:6px">
            <strong>Bilanço Hükmü:</strong> ${esc(h.verdict)}
            ${h.smartMoneyNote ? `<br/><strong>Tahta Para İzi:</strong> ${esc(h.smartMoneyNote)}` : ''}
          </div>
        </div>
      `;
    }

    if (h.kind === 'COMPANY') {
      const bk = h.bakery100k;
      const ocf = h.ocfMillionTL;
      const cash = h.cashMillionTL;
      const debt = h.totalDebtMillionTL;
      const maxVal = Math.max(100, Math.abs(ocf), cash, debt);
      const wOcf = Math.max(6, Math.round((Math.abs(ocf) / maxVal) * 100));
      const wCash = Math.max(6, Math.round((cash / maxVal) * 100));
      const wDebt = Math.max(6, Math.round((debt / maxVal) * 100));

      return `
        <div class="ms-card" style="background:#f8fafc;margin:12px 0;padding:15px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
            <strong style="font-size:14px">Mahalle Fırını Hesabı (100.000 ₺ Ortaklıkta Senin Payın)</strong>
            ${h.pe != null ? `<span style="font-size:12px;font-weight:700;color:#475569">F/K: ${h.pe} · PD/DD: ${h.pb ?? '-'}</span>` : ''}
          </div>
          ${bk ? `
            <p style="margin:0 0 8px;font-size:13px;color:#1e293b">${esc(bk.plainSummary)}</p>
            <div class="ms-bakery-grid" style="margin-bottom:12px">
              <div class="ms-bakery-cell">
                <span>Günlük Kasaya Giren</span>
                <strong class="${bk.dailyOcfTL >= 0 ? 'pos' : 'neg'}">${bk.dailyOcfTL >= 0 ? '+' : ''}${bk.dailyOcfTL.toLocaleString('tr-TR')} ₺/gün</strong>
              </div>
              <div class="ms-bakery-cell">
                <span>Yıllık Faaliyet Nakdi</span>
                <strong class="${bk.annualOcfTL >= 0 ? 'pos' : 'neg'}">${bk.annualOcfTL >= 0 ? '+' : ''}${fmtTL(bk.annualOcfTL)}</strong>
              </div>
              <div class="ms-bakery-cell">
                <span>Hazır Kasa Nakdi Payın</span>
                <strong>${fmtTL(bk.cashShareTL)}</strong>
              </div>
              <div class="ms-bakery-cell">
                <span>Sırtına Binen Borç Payı</span>
                <strong class="${bk.debtShareTL > bk.cashShareTL * 2 ? 'neg' : ''}">${fmtTL(bk.debtShareTL)}</strong>
              </div>
            </div>
          ` : ''}

          <div class="ms-bar-row">
            <div class="ms-bar-label">
              <span>Şirket Toplam Faaliyet Nakdi (Yıllık)</span>
              <span class="${ocf >= 0 ? 'pos' : 'neg'}">${ocf >= 0 ? '+' : ''}${ocf.toLocaleString('tr-TR')} Milyon ₺</span>
            </div>
            <div class="ms-bar-track"><div class="ms-bar-fill ${ocf >= 0 ? 'green' : 'red'}" style="width:${wOcf}%"></div></div>
          </div>
          <div class="ms-bar-row">
            <div class="ms-bar-label">
              <span>Şirket Hazır Nakdi</span>
              <span>${cash.toLocaleString('tr-TR')} Milyon ₺</span>
            </div>
            <div class="ms-bar-track"><div class="ms-bar-fill" style="width:${wCash}%"></div></div>
          </div>
          <div class="ms-bar-row" style="margin-bottom:6px">
            <div class="ms-bar-label">
              <span>Toplam Banka & Finansal Borç</span>
              <span class="${debt > cash * 2 ? 'neg' : ''}">${debt.toLocaleString('tr-TR')} Milyon ₺</span>
            </div>
            <div class="ms-bar-track"><div class="ms-bar-fill ${debt > cash * 2 ? 'amber' : ''}" style="width:${wDebt}%"></div></div>
          </div>
          <div style="font-size:12.6px;color:#1e293b;margin-top:8px">
            <strong>Kasa Hükmü:</strong> ${esc(h.verdict)}
            ${h.smartMoneyNote ? `<br/><strong>Tahta Para İzi:</strong> ${esc(h.smartMoneyNote)}` : ''}
          </div>
        </div>
      `;
    }

    if (h.kind === 'GOLD_SPREAD') {
      return `
        <div class="ms-alert ${h.status === 'WARN' ? 'warn' : 'ok'}">
          <strong>Terazi Kontrolü (Fiziki Altın vs Borsa Sertifikası):</strong><br/>
          Kapalıçarşı 1 Gr Fiziki Altın: <strong>${fmtTL(h.spotGramTL)}</strong> ·
          100 Adet ALTIN.S1: <strong>${fmtTL(h.s1GramTL)}</strong>.<br/>
          ${esc(h.verdict)}
        </div>
      `;
    }

    if (h.kind === 'RATE_VS_INF') {
      return `
        <div class="ms-alert ${h.status === 'GOOD' ? 'ok' : 'warn'}">
          <strong>Vergi Sonrası Gerçek Getiri:</strong>
          Brüt %${h.grossPct.toFixed(1)} -> %${h.stopajPct} stopaj kesildikten sonra yıllık <strong>net %${h.netPct}</strong> kalır (Yıllık TÜFE: %${h.inflationPct.toFixed(1)}). ${esc(h.verdict)}
        </div>
      `;
    }
    return '';
  }

  function computeOrderRipplePreview(asset, amountTL) {
    const K = global.AetherKernelV10;
    const clock = K.getTurkishClock();
    const snap = K.evaluateMemberPortfolio();
    const amt = Math.max(0, Number(amountTL) || 0);

    let frictionTL = 0;
    let timingText = 'Anında portföye geçer';
    let monthlyDripTL = 0;

    if (asset.venue === 'TWO_DOOR') {
      const sp = selectedDoor === 'BAZAAR' ? clock.bazaarSpreadPct : clock.bankSpreadPct;
      const bsmv = selectedDoor === 'BANK' ? 0.20 : 0;
      frictionTL = Math.round(amt * ((sp / 2 + bsmv) / 100));
      timingText = selectedDoor === 'BAZAAR'
        ? (clock.grandBazaarOpen ? 'Kapalıçarşı anında teslim (%0 vergi)' : 'Çarşı kapalı (Sabah 09:30)')
        : 'Mobil Banka 7/24 anında (%0,2 vergi dahil)';
    } else if (asset.venue === 'BIST') {
      frictionTL = Math.round(amt * 0.00084);
      timingText = clock.bistCanMatchNow ? 'Borsa açık: Anında eşleşir (Satışta T+2 takas)' : 'Borsa kapalı: Sabah 10:00 açılış eşleşmesine yazılır';
      if (asset.bistRow?.dividendYield > 0) {
        monthlyDripTL = Math.round((amt * (asset.bistRow.dividendYield / 100) * 0.85) / 12);
      }
    } else if (asset.venue === 'TEFAS') {
      timingText = (asset.subVenue === 'TEFAS_PPF' && clock.tefasBeforeCutoff)
        ? '13:30 öncesi: Bugün T+0 kazanmaya başlar'
        : 'TEFAS Valör Sırası (+1 / +2 iş günü 10:30)';
      const netR = asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100);
      monthlyDripTL = Math.round((amt * (netR / 100)) / 12);
    } else if (asset.venue === 'BANK_RATE') {
      let stp = asset.stopajPct;
      if (asset.subVenue === 'TERM_DEPOSIT') {
        stp = selectedMaturity > 365 ? 10 : (selectedMaturity > 180 ? 15 : 17.5);
        timingText = `${selectedMaturity} gün kilitlenir (Erken bozarsan faiz sıfırlanır)`;
      }
      const netR = asset.annualGrossRatePct * (1 - stp / 100);
      monthlyDripTL = Math.round((amt * (netR / 100)) / 12);
    } else {
      frictionTL = Math.round(amt * 0.0012);
    }

    const existingVal = snap.spotItems.find((x) => x.assetKey === asset.key)?.netValTL || 0;
    const newSingleSharePct = Math.min(100, Math.round(((existingVal + amt) / Math.max(1, snap.totalNetWorthTL)) * 100));

    return { frictionTL, timingText, monthlyDripTL, newSingleSharePct };
  }

  function renderAssetDrawer() {
    const sheet = document.getElementById('msModalSheet');
    if (!sheet || modalMode !== 'ASSET' || !drawerAssetKey) return;
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const asset = K.getAsset(drawerAssetKey);
    if (!asset) return;

    const info = G.explainAsset(asset);
    const clock = K.getTurkishClock();
    const member = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(member);
    const micro = K.inspectBoardMicrostructure(asset);
    const existingPos = member.positions?.[asset.key] || null;
    const existingTranches = snap.tranches.filter((t) => t.assetKey === asset.key);
    const existingPending = (member.pendingOrders || []).filter((o) => o.assetKey === asset.key);
    const ripple = computeOrderRipplePreview(asset, draftOrderAmount);

    let channelPickerHtml = '';
    if (asset.venue === 'TWO_DOOR') {
      const bazCost = Math.round(100000 * (clock.bazaarSpreadPct / 200));
      const bankCost = Math.round(100000 * (clock.bankSpreadPct / 200 + 0.002));
      channelPickerHtml = `
        <div style="margin:12px 0">
          <div style="font-size:13px;font-weight:800;margin-bottom:6px">Alım-Satım Gişesini Seç (Gerçek Makas & Vergi Farkı):</div>
          <div class="ms-door-grid">
            <button type="button" class="ms-door-card ${selectedDoor === 'BAZAAR' ? 'selected' : ''}" data-door="BAZAAR">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
                <strong>Kapalıçarşı Serbest Piyasa</strong>
                <span class="${clock.grandBazaarOpen ? 'pos' : 'neg'}" style="font-weight:800">${clock.grandBazaarOpen ? 'Açık' : 'Kapalı (09:30)'}</span>
              </div>
              <div style="font-size:12.2px;color:#334155">Makas ~%${clock.bazaarSpreadPct.toFixed(2)} · Vergi: <strong>%0</strong></div>
              <div style="font-size:11.6px;color:#64748b;margin-top:3px">100.000 ₺ işlemde kayıp: ~${bazCost.toLocaleString('tr-TR')} ₺</div>
            </button>
            <button type="button" class="ms-door-card ${selectedDoor === 'BANK' ? 'selected' : ''}" data-door="BANK">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
                <strong>Mobil Banka (7/24)</strong>
                <span class="${clock.bankDaytimeTight ? 'pos' : 'neg'}" style="font-weight:800">${clock.bankDaytimeTight ? 'Mesai İçi' : 'Gece Makası Açık!'}</span>
              </div>
              <div style="font-size:12.2px;color:#334155">Makas %${clock.bankSpreadPct.toFixed(2)} + <strong>%0,2 Vergi</strong></div>
              <div style="font-size:11.6px;color:#64748b;margin-top:3px">100.000 ₺ işlemde kayıp: ~${bankCost.toLocaleString('tr-TR')} ₺</div>
            </button>
          </div>
        </div>
      `;
    }

    let maturityPickerHtml = '';
    if (asset.subVenue === 'TERM_DEPOSIT') {
      maturityPickerHtml = `
        <div style="margin:12px 0">
          <div style="font-size:13px;font-weight:800;margin-bottom:6px">Mevduat Vadesi Seç (Vadeden önce bozulursa tüm faiz yanar!):</div>
          <div class="ms-pills" style="margin-bottom:0">
            <button type="button" class="ms-pill ${selectedMaturity === 32 ? 'active' : ''}" data-mat="32">32 Gün (%17,5 Stopaj)</button>
            <button type="button" class="ms-pill ${selectedMaturity === 181 ? 'active' : ''}" data-mat="181">181 Gün (%15 Stopaj)</button>
            <button type="button" class="ms-pill ${selectedMaturity === 366 ? 'active' : ''}" data-mat="366">366 Gün (%10 Stopaj)</button>
          </div>
        </div>
      `;
    }

    let marginToggleHtml = '';
    if (micro.marginAllowed && clock.bistCanMatchNow) {
      const maxBorrow = Math.max(0, Math.round(snap.totalNetWorthTL * 0.50 - snap.marginDebtTL));
      marginToggleHtml = `
        <div style="margin:10px 0;padding:10px 12px;border-radius:10px;border:1px solid ${selectedUseMargin ? '#fca5a5' : '#e2e8f0'};background:${selectedUseMargin ? '#fef2f2' : '#ffffff'};display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
          <label style="display:flex;align-items:center;gap:8px;font-size:12.6px;font-weight:700;cursor:pointer">
            <input type="checkbox" id="msUseMarginChk" ${selectedUseMargin ? 'checked' : ''} />
            <span>Kredili İşlem (Aracı Kurumdan Borçla Al — Yıllık %${K.getAnnualMarginRatePct()} Günlük Faiz)</span>
          </label>
          <span style="font-size:11.8px;color:#64748b">Ek Kredi Limiti: ${fmtTL(maxBorrow)}</span>
        </div>
      `;
    }

    const relatedAssets = (info?.relatedKeys || [])
      .map((rk) => K.getAsset(rk))
      .filter((x) => x && x.key !== asset.key);

    sheet.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px">
        <div>
          <span class="ms-asset-code">${esc(asset.symbol)}</span>
          ${info.quickSignal?.badge ? `<span class="ms-sig-pill ${esc(info.quickSignal.tone)}" style="margin-left:6px">${esc(info.quickSignal.badge)}</span>` : ''}
          <h2 style="margin:4px 0 0;font-size:20px;font-weight:800">${esc(asset.name)}</h2>
        </div>
        <button type="button" class="ms-btn sm" id="msCloseModalBtn">Kapat</button>
      </div>

      <div class="ms-drawer-kpi-grid">
        <div class="ms-kpi-box" style="padding:10px">
          <span style="font-size:10.5px">Canlı Fiyat / Oran</span>
          <strong style="font-size:14.5px">${asset.isRateInstrument ? `%${asset.annualGrossRatePct.toFixed(1)}` : fmtUnitTL(asset.priceTL)}</strong>
        </div>
        <div class="ms-kpi-box" style="padding:10px">
          <span style="font-size:10.5px">1 Ay / 1 Yıl</span>
          <strong style="font-size:13.5px">${asset.isRateInstrument ? 'Sabit Akış' : `%${asset.perf1M.toFixed(1)} / %${asset.perf1Y.toFixed(0)}`}</strong>
        </div>
        <div class="ms-kpi-box" style="padding:10px">
          <span style="font-size:10.5px">Boş Nakdin</span>
          <strong style="font-size:14.5px">${fmtTL(snap.cashTL)}</strong>
        </div>
        <div class="ms-kpi-box" style="padding:10px">
          <span style="font-size:10.5px">T+2 Takasta</span>
          <strong style="font-size:14.5px">${fmtTL(snap.unsettledTL)}</strong>
        </div>
      </div>

      ${lastDrawerFeedback ? `<div class="ms-alert ${lastDrawerFeedback.ok ? 'ok' : 'err'}">${esc(lastDrawerFeedback.text)}</div>` : ''}
      ${micro.statusNote ? `<div class="ms-alert warn">${esc(micro.statusNote)}</div>` : ''}

      ${renderCycleAndRealHorizonHtml(info)}
      ${renderHealthAndBakeryHtml(info)}

      ${channelPickerHtml}
      ${maturityPickerHtml}

      <!-- ALIM / SATIM VE KARAR GÜNLÜĞÜ KUTUSU -->
      <div class="ms-card" style="background:#f8fafc;padding:15px;margin-bottom:12px;border:1.5px solid #cbd5e1">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:8px">1. Yatırım Tutarını Seç (₺)</div>
        <div class="ms-pills" style="margin-bottom:10px">
          <button type="button" class="ms-pill" data-qamt="50000">50.000 ₺</button>
          <button type="button" class="ms-pill" data-qamt="100000">100.000 ₺</button>
          <button type="button" class="ms-pill" data-qamt="250000">250.000 ₺</button>
          <button type="button" class="ms-pill" data-qamt="500000">500.000 ₺</button>
          <button type="button" class="ms-pill" data-qamt="${Math.max(100, Math.floor(snap.cashTL))}">Tüm Nakit (${fmtTL(snap.cashTL)})</button>
        </div>

        ${marginToggleHtml}

        <div style="font-size:13px;font-weight:800;margin:10px 0 6px">2. Bu Hamleyi Neye Dayanarak Yapıyorsun? (Ay Sonu Karneni Belirler)</div>
        <div class="ms-pills" style="margin-bottom:8px">
          <button type="button" class="ms-pill ${selectedThesisTag === 'RESEARCH_FUNDAMENTAL' ? 'active' : ''}" data-thesis="RESEARCH_FUNDAMENTAL">📊 Bilanço & Kasa Sağlam</button>
          <button type="button" class="ms-pill ${selectedThesisTag === 'MACRO_CHAIN' ? 'active' : ''}" data-thesis="MACRO_CHAIN">🛢️ Hammadde / Makro Öngörü</button>
          <button type="button" class="ms-pill ${selectedThesisTag === 'INFLATION_SHIELD' ? 'active' : ''}" data-thesis="INFLATION_SHIELD">🛡️ Enflasyon / Nakit Kalkanı</button>
          <button type="button" class="ms-pill ${selectedThesisTag === 'RUMOR_IMPULSE' ? 'active' : ''}" data-thesis="RUMOR_IMPULSE">🔥 Duyum / Anlık Heyecan</button>
        </div>

        <input id="msThesisNoteInp" class="ms-input" style="margin-bottom:10px;font-size:13px" type="text" value="${esc(draftThesisNote)}" placeholder="Kısa yatırım notun (İsteğe bağlı — Örn: Petrol düşerken marjı açılacak, Canlı Ligde görünür)" />

        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:9px 12px;margin-bottom:10px;font-size:12.3px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px">
          <span><strong>İşlem Akışı:</strong> ${esc(ripple.timingText)}</span>
          <span><strong>Makas/Vergi Kaybı:</strong> ${ripple.frictionTL > 0 ? '-' + fmtTL(ripple.frictionTL) : '0 ₺'}</span>
          <span class="${ripple.newSingleSharePct >= 65 ? 'neg' : ''}"><strong>Tek Sepet Ağırlığı:</strong> %${ripple.newSingleSharePct}</span>
          ${ripple.monthlyDripTL > 0 ? `<span class="pos"><strong>Tahmini Nakit Çarkı:</strong> +${fmtTL(ripple.monthlyDripTL)}/ay</span>` : ''}
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <input id="msOrderAmountInp" class="ms-input" style="flex:1 1 160px;font-weight:800;font-size:15px" type="number" min="100" step="1000" value="${draftOrderAmount}" />
          <button type="button" class="ms-btn primary" style="flex:1 1 190px;font-size:14.5px" id="msBuyConfirmBtn">
            ${asset.isRateInstrument ? 'Vadeli / Fona Bağla' : (selectedUseMargin ? 'Kredili Alım Emri Ver' : 'Alım Emri Ver')}
          </button>
        </div>

        ${existingPos && existingPos.qty > 0 ? `
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px">
            <div style="font-size:13px">
              Elimdeki: <strong>${existingPos.qty} adet</strong> (Maliyet: ${fmtUnitTL(existingPos.avgCostTL)})
            </div>
            <div style="display:flex;gap:7px;flex-wrap:wrap">
              <button type="button" class="ms-btn sm" data-sell-part="0.25">%25 Sat</button>
              <button type="button" class="ms-btn sm" data-sell-part="0.5">Yarısını Sat</button>
              <button type="button" class="ms-btn danger sm" data-sell-part="1">Tamamını Sat</button>
            </div>
          </div>
        ` : ''}

        ${existingTranches.length > 0 ? `
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;display:grid;gap:8px">
            <div style="font-size:12.8px;font-weight:800;color:#334155">Portföyümdeki Aktif Dilimler (${existingTranches.length}):</div>
            ${existingTranches.map((tr) => {
              const early = tr.isTermDeposit && !tr.isMatured;
              return `
                <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:9px;padding:8px 10px;font-size:12.4px">
                  <span>Anapara: <strong>${fmtTL(tr.principalTL)}</strong> · Net Biriken: <strong class="pos">+${fmtTL(tr.netInterestTL)}</strong>${early ? ` (${tr.remainingDays} gün kaldı)` : ''}</span>
                  <button type="button" class="ms-btn ${early ? 'danger' : ''} sm" data-drawer-break-tr="${esc(tr.id)}">
                    ${early ? `Erken Boz (${fmtTL(tr.forfeitedIfBrokenEarlyTL)} Yanar)` : 'Nakde Çevir'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        ${existingPending.length > 0 ? `
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;display:grid;gap:8px">
            <div style="font-size:12.8px;font-weight:800;color:#1e40af">Sırada Bekleyen Emirlerim (${existingPending.length}):</div>
            ${existingPending.map((ord) => `
              <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:9px;padding:8px 10px;font-size:12.3px">
                <span><strong>${ord.side === 'BUY' ? 'ALIM' : 'SATIŞ'}</strong> (${ord.side === 'BUY' ? fmtTL(ord.reservedTL) : ord.qty + ' adet'}) — ${esc(ord.note)}</span>
                <button type="button" class="ms-btn danger sm" data-drawer-cancel-ord="${esc(ord.id)}">Emri İptal Et</button>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- NASIL PARA KAZANIR & HAMMADDE ZİNCİRİ -->
      <div class="ms-card" style="background:#f8fafc;padding:14px;margin-bottom:12px">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:4px">Nasıl Çalışır & Parayı Nereden Kazanır?</div>
        <p style="margin:0 0 10px;font-size:13.2px;color:#334155">${esc(info.howItWorks)}</p>
        <div style="display:grid;gap:6px;font-size:12.6px">
          <div><strong>Bağlı Olduğu Hammadde ve Veriler:</strong> ${esc(info.rawInputs.join(' · '))}</div>
          <div><strong class="pos">Ne Zaman Güçlenir:</strong> ${esc(info.risesWhen)}</div>
          <div><strong class="neg">Ne Zaman Zorlanır:</strong> ${esc(info.fallsWhen)}</div>
        </div>
        ${relatedAssets.length > 0 ? `
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid #e2e8f0;display:flex;flex-wrap:wrap;gap:6px;align-items:center">
            <span style="font-size:12px;font-weight:700;color:#64748b">Zincirdeki Bağlantılı Varlıklar:</span>
            ${relatedAssets.map((ra) => `
              <button type="button" class="ms-btn sm" data-jump-asset="${esc(ra.key)}">${esc(ra.ticker)} · ${ra.isRateInstrument ? '%' + ra.annualGrossRatePct : fmtUnitTL(ra.priceTL)}</button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="ms-alert info" style="font-weight:500;margin-bottom:0">
        <strong>Türkiye Gerçek Piyasa & Vergi Kuralı:</strong> ${esc(info.executionRule)}
      </div>
    `;

    document.getElementById('msCloseModalBtn')?.addEventListener('click', closeModal);

    sheet.querySelectorAll('[data-jump-asset]').forEach((b) => {
      b.addEventListener('click', () => {
        openAssetDrawer(b.getAttribute('data-jump-asset'));
        sheet.scrollTop = 0;
      });
    });

    sheet.querySelectorAll('[data-door]').forEach((b) => {
      b.addEventListener('click', () => {
        selectedDoor = b.getAttribute('data-door');
        renderAssetDrawer();
      });
    });

    sheet.querySelectorAll('[data-mat]').forEach((b) => {
      b.addEventListener('click', () => {
        selectedMaturity = Number(b.getAttribute('data-mat')) || 32;
        renderAssetDrawer();
      });
    });

    document.getElementById('msUseMarginChk')?.addEventListener('change', (e) => {
      selectedUseMargin = Boolean(e.target.checked);
      renderAssetDrawer();
    });

    sheet.querySelectorAll('[data-thesis]').forEach((b) => {
      b.addEventListener('click', () => {
        selectedThesisTag = b.getAttribute('data-thesis');
        renderAssetDrawer();
      });
    });

    document.getElementById('msThesisNoteInp')?.addEventListener('input', (e) => {
      draftThesisNote = e.target.value;
    });

    sheet.querySelectorAll('[data-qamt]').forEach((b) => {
      b.addEventListener('click', () => {
        draftOrderAmount = Number(b.getAttribute('data-qamt')) || 50000;
        renderAssetDrawer();
      });
    });

    document.getElementById('msOrderAmountInp')?.addEventListener('input', (e) => {
      draftOrderAmount = Number(e.target.value) || 0;
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
      lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
      if (res.ok) draftThesisNote = '';
      renderAssetDrawer();
      renderHeader();
      renderCurrentTab();
    });

    sheet.querySelectorAll('[data-sell-part]').forEach((b) => {
      b.addEventListener('click', () => {
        const ratio = Number(b.getAttribute('data-sell-part')) || 1;
        const res = K.executeOrder({
          side: 'SELL',
          assetKey: asset.key,
          sellRatio: ratio,
          door: selectedDoor
        });
        lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
        renderAssetDrawer();
        renderHeader();
        renderCurrentTab();
      });
    });

    sheet.querySelectorAll('[data-drawer-break-tr]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'BREAK_TRANCHE', trancheId: b.getAttribute('data-drawer-break-tr') });
        lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
        renderAssetDrawer();
        renderHeader();
        renderCurrentTab();
      });
    });

    sheet.querySelectorAll('[data-drawer-cancel-ord]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'CANCEL_ORDER', orderId: b.getAttribute('data-drawer-cancel-ord') });
        lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
        renderAssetDrawer();
        renderHeader();
        renderCurrentTab();
      });
    });
  }

  // --------------------------------------------------------------------------
  // İLK AÇILIŞ HOŞ GELDİN & PROFİL / MAAŞ GÜNÜ MODALLARI
  // --------------------------------------------------------------------------
  function openWelcomeModal() {
    modalMode = 'WELCOME';
    const sheet = document.getElementById('msModalSheet');
    if (!sheet) return;
    sheet.innerHTML = `
      <div style="margin-bottom:14px">
        <span class="ms-asset-code">AETHER CANLI PİYASA & YATIRIMCI LİGİ</span>
        <h2 style="margin:6px 0 4px;font-size:22px;font-weight:800">1.000.000 ₺ Gerçek Piyasa Sermayen Hazır</h2>
        <p style="margin:0;font-size:13.6px;color:#475569">
          İleri sarma veya hayali oyun yok: Borsa İstanbul, Kapalıçarşı, TEFAS ve dünya piyasalarının birebir kurallarıyla 1.000.000 ₺ yönetirsin. Uygulamayı yükleyen herkes Canlı Yatırımcı Liginde birbirinin portföyünü ve kâr/zararını anlık görür.
        </p>
      </div>

      <div style="display:grid;gap:12px;margin-bottom:14px">
        <div>
          <label style="display:block;font-size:12.8px;font-weight:800;margin-bottom:5px">Canlı Ligde Görünecek Adın:</label>
          <input id="msWelcomeName" class="ms-input" type="text" maxlength="28" placeholder="Örn: Hera, Ahmet, Mert, Zeynep..." autofocus />
        </div>
        <div>
          <label style="display:block;font-size:12.8px;font-weight:800;margin-bottom:5px">Yatırım Tarzın / Unvanın:</label>
          <select id="msWelcomeRole" class="ms-input">
            <option value="Değer & Kasa Avcısı">Değer & Kasa Avcısı</option>
            <option value="Uzun Vadeli Ortak">Uzun Vadeli Ortak</option>
            <option value="Temettü & Nakit Çarkı">Temettü & Nakit Çarkı</option>
            <option value="Altın & Makro Stratejist">Altın & Makro Stratejist</option>
            <option value="1 Milyon ₺ Portföy Yöneticisi">1 Milyon ₺ Portföy Yöneticisi</option>
          </select>
        </div>
        <div id="msWelcomeErr" class="neg" style="font-size:12.5px;font-weight:700;display:none"></div>
        <button type="button" class="ms-btn primary" style="padding:13px;font-size:15px" id="msWelcomeStartBtn">
          1.000.000 ₺ Portföyümü Aç ve Canlı Lige Katıl
        </button>
      </div>
    `;
    openModalShell();

    const submit = () => {
      const name = document.getElementById('msWelcomeName')?.value || '';
      const role = document.getElementById('msWelcomeRole')?.value || 'Yatırımcı';
      const res = global.AetherKernelV10.completeOnboarding(name, role);
      if (!res.ok) {
        const errEl = document.getElementById('msWelcomeErr');
        if (errEl) { errEl.style.display = 'block'; errEl.textContent = res.reason; }
        return;
      }
      closeModal();
      renderHeader();
      renderCurrentTab();
    };

    document.getElementById('msWelcomeStartBtn')?.addEventListener('click', submit);
    document.getElementById('msWelcomeName')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
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
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <h2 style="margin:0;font-size:19px;font-weight:800">Yatırımcı Kimliğim & Maaş Günü Ayarları</h2>
        <button type="button" class="ms-btn sm" id="msCloseModalBtn">Kapat</button>
      </div>

      <div style="display:grid;gap:12px">
        <div>
          <label style="display:block;font-size:12.5px;font-weight:800;margin-bottom:4px">Canlı Ligde Görünen Adın</label>
          <input id="msProfName" class="ms-input" type="text" value="${esc(me.profileRegistered ? me.name : '')}" placeholder="Adın..." />
        </div>
        <div>
          <label style="display:block;font-size:12.5px;font-weight:800;margin-bottom:4px">Yatırım Tarzı / Unvan</label>
          <input id="msProfRole" class="ms-input" type="text" value="${esc(me.roleLabel)}" />
        </div>
        <div class="ms-two-col" style="gap:10px">
          <div>
            <label style="display:block;font-size:12.5px;font-weight:800;margin-bottom:4px">Aylık Yaşam Giderin (₺ — Özgürlük Çarkı İçin)</label>
            <input id="msProfExpense" class="ms-input" type="number" step="5000" value="${me.monthlyExpenseTL || 40000}" />
          </div>
          <div>
            <label style="display:block;font-size:12.5px;font-weight:800;margin-bottom:4px">Maaş Gününde Eklenecek Tasarruf (₺/Ay)</label>
            <input id="msProfSavings" class="ms-input" type="number" step="5000" value="${me.monthlySavingsTL || 0}" placeholder="0 (Sadece 1M ile yarış)" />
          </div>
        </div>
        <div class="ms-two-col" style="gap:10px">
          <div>
            <label style="display:block;font-size:12.5px;font-weight:800;margin-bottom:4px">Gerçek Takvim Maaş Günü</label>
            <select id="msProfSalDay" class="ms-input">
              <option value="1" ${Number(me.salaryDay) === 1 ? 'selected' : ''}>Her Ayın 1'i</option>
              <option value="15" ${Number(me.salaryDay) !== 1 ? 'selected' : ''}>Her Ayın 15'i</option>
            </select>
          </div>
          <div>
            <label style="display:block;font-size:12.5px;font-weight:800;margin-bottom:4px">Lig Odası (Varsayılan: ORTAK-LIG)</label>
            <input id="msProfRoom" class="ms-input" type="text" value="${esc(st.roomCode || 'ORTAK-LIG')}" />
          </div>
        </div>
        <div style="padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px">
          <label style="display:flex;align-items:center;gap:8px;font-size:12.6px;font-weight:800;cursor:pointer">
            <input id="msProfOvernightRepo" type="checkbox" ${me.autoOvernightRepo ? 'checked' : ''} />
            <span>Aracı Kurum Otomatik Gecelik Nema (10.000 ₺ üstü nakit gecelik net %${K.getOvernightRepoNetAnnualPct()} çalışsın)</span>
          </label>
        </div>
        <div style="font-size:12px;color:#64748b">
          Aynı Lig Odası kodundaki (varsayılan <strong>ORTAK-LIG</strong>) uygulamayı yükleyen herkes Wi-Fi veya 4G/5G fark etmeksizin birbirini otomatik görür.
        </div>
        <button type="button" class="ms-btn primary" id="msSaveProfileBtn">Ayarları Kaydet ve Senkronize Et</button>
      </div>
    `;
    openModalShell();

    document.getElementById('msCloseModalBtn')?.addEventListener('click', closeModal);
    document.getElementById('msSaveProfileBtn')?.addEventListener('click', () => {
      const nm = document.getElementById('msProfName')?.value || '';
      const rl = document.getElementById('msProfRole')?.value || '';
      const exp = Number(document.getElementById('msProfExpense')?.value || 40000);
      const sav = Number(document.getElementById('msProfSavings')?.value || 0);
      const sday = Number(document.getElementById('msProfSalDay')?.value || 15);
      const repoChk = Boolean(document.getElementById('msProfOvernightRepo')?.checked);
      const room = document.getElementById('msProfRoom')?.value || 'ORTAK-LIG';
      if (nm.trim().length >= 2) K.completeOnboarding(nm, rl);
      K.updateHouseholdBaseline({ name: nm, roleLabel: rl, monthlyExpenseTL: exp, monthlySavingsTL: sav, salaryDay: sday, autoOvernightRepo: repoChk, roomCode: room });
      closeModal();
      renderHeader();
      renderCurrentTab();
    });
  }

  // --------------------------------------------------------------------------
  // SEKME 2: PORTFÖYÜM & USTALIK AYNASI (NAKİT ÇARKI, SABIR KANITI & KARAR KARNESİ)
  // --------------------------------------------------------------------------
  function renderPortfolioTab(host) {
    const K = global.AetherKernelV10;
    const member = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(member);
    const mastery = K.evaluateInvestorMastery(member, snap);
    const idle = member.idleErosionLog || { cumulativeInflationLossTL: 0, missedSukukNetTL: 0 };
    const repoNetAnnual = K.getOvernightRepoNetAnnualPct();

    const maxBench = Math.max(snap.totalNetWorthTL, snap.ifAllGoldTL, snap.ifAllDepositNetTL, snap.ifAllBist100TL, snap.inflationTargetTL, 1000000);
    const pctBar = (v) => Math.max(8, Math.round((v / maxBench) * 100));
    const dailyPassive = +(snap.monthlyPassiveIncomeTL / 30).toFixed(0);

    host.innerHTML = `
      ${lastPortfolioFeedback ? `<div class="ms-alert ${lastPortfolioFeedback.ok ? 'ok' : 'err'}">${esc(lastPortfolioFeedback.text)}</div>` : ''}

      <div class="ms-kpi-grid">
        <div class="ms-kpi-box">
          <span>Güncel Net Portföy Değerin</span>
          <strong>${fmtTL(snap.totalNetWorthTL)}</strong>
          <small class="${snap.nominalPnlTL >= 0 ? 'pos' : 'neg'}">
            Başlangıca göre ${snap.nominalPnlTL >= 0 ? '+' : ''}${fmtTL(snap.nominalPnlTL)} (${snap.nominalPnlPct >= 0 ? '+' : ''}%${snap.nominalPnlPct})
          </small>
        </div>
        <div class="ms-kpi-box">
          <span>Enflasyona Karşı Reel Alım Gücü</span>
          <strong class="${snap.realPurchasingPnlPct >= 0 ? 'pos' : 'neg'}">${snap.realPurchasingPnlPct >= 0 ? '+' : ''}%${snap.realPurchasingPnlPct}</strong>
          <small>Alım gücünü koruma eşiği: ${fmtTL(snap.inflationTargetTL)}</small>
        </div>
        <div class="ms-kpi-box">
          <span>Kendi Nakit Çarkın (Pasif Gelir)</span>
          <strong class="pos">+${fmtTL(snap.monthlyPassiveIncomeTL)} / ay</strong>
          <small>Günde ~+${Number(dailyPassive).toLocaleString('tr-TR')} ₺ · Gider karşılama: <strong>%${snap.passiveCoveragePct}</strong></small>
        </div>
        <div class="ms-kpi-box">
          <span>Boş Nakit & Takas/Valör</span>
          <strong>${fmtTL(snap.cashTL)}</strong>
          <small>T+2 Takas: ${fmtTL(snap.unsettledTL)} · Valör/Halka Arz: ${fmtTL(snap.pendingOrderTL + snap.ipoBlockedTL)}</small>
        </div>
      </div>

      ${snap.marginStatus ? `
        <div class="ms-alert ${snap.marginStatus.isWarning ? 'err' : 'warn'}" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
          <div>
            <strong>Kredili Borç Baskısı: -${fmtTL(snap.marginStatus.debtTL)}</strong> ·
            Özsermaye Oranı: <strong>%${snap.marginStatus.equityRatioPct}</strong> (Alt sınır %35) ·
            Her gece işleyen faiz: <strong class="neg">-${fmtUnitTL(snap.marginStatus.dailyInterestCostTL)}/gün</strong>
          </div>
          ${snap.cashTL >= 100 ? `<button type="button" class="ms-btn danger sm" id="msRepayMarginBtn">Nakitle Borç Kapat</button>` : ''}
        </div>
      ` : ''}

      ${snap.gvk80TaxPayableTL > 0 ? `
        <div class="ms-alert warn" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
          <div>
            <strong>Yurt Dışı Beyanname Vergi Karşılığı (GVK Mük. 80): -${fmtTL(snap.gvk80TaxPayableTL)}</strong>
            <span style="font-weight:500"> · Yurt dışı satışlardan doğan Yİ-ÜFE endeksli reel kazanç vergi borcun net portföyünden düşülmüştür.</span>
          </div>
          ${snap.cashTL >= 100 ? `<button type="button" class="ms-btn sm" id="msPayGvkTaxBtn">Vergi Karşılığını Öde</button>` : ''}
        </div>
      ` : ''}

      <div class="ms-two-col">
        <!-- SOL SÜTUN: AÇIK POZİSYONLAR, VADELİ DİLİMLER, TAKAS VE İŞLEM GEÇMİŞİ -->
        <section class="ms-card">
          <div class="ms-sec-head">
            <div>
              <h2 class="ms-sec-title">Portföyümdeki Gerçek Varlıklar</h2>
              <p class="ms-sec-sub">Stopaj, komisyon ve Yİ-ÜFE endeksli vergi karşılıkları düşülmüş net değerler.</p>
            </div>
          </div>

          ${renderAllocRibbonHtml(snap.allocationBreakdown)}

          <div style="margin:12px 0;padding:10px 12px;border-radius:11px;border:1px solid ${snap.autoOvernightRepo ? '#a7f3d0' : '#e2e8f0'};background:${snap.autoOvernightRepo ? '#ecfdf5' : '#f8fafc'};display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:12.5px">
            <div>
              <strong>Aracı Kurum Otomatik Gecelik Nema (O/N Repo):</strong>
              ${snap.autoOvernightRepo
                ? `<span class="pos">Açık (10.000 ₺ üstü nakit yıllık net %${repoNetAnnual} gecelik işliyor${snap.overnightRepoEarnedTL > 0 ? ` · Kazanılan: +${fmtTL(snap.overnightRepoEarnedTL)}` : ''})</span>`
                : `<span style="color:#64748b">Kapalı (Boş nakit vadesiz %0 duruyor · Açarsan yıllık net %${repoNetAnnual} gecelik işler)</span>`}
            </div>
            <button type="button" class="ms-btn ${snap.autoOvernightRepo ? '' : 'primary'} sm" id="msToggleRepoBtn">
              ${snap.autoOvernightRepo ? 'Kapat' : 'Gecelik Nemayı Aç'}
            </button>
          </div>

          <div style="margin-top:12px">
            ${(member.settlementQueue || []).map((q) => `
              <div class="ms-alert warn"><strong>Takas / Valör Kum Saati:</strong> ${esc(q.ticker)} işleminden ${fmtTL(q.grossTL)} — ${esc(q.note)}</div>
            `).join('')}

            ${(member.pendingOrders || []).map((o) => `
              <div class="ms-alert info" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                <span><strong>Sırada Bekleyen Emir:</strong> ${esc(o.name)} (${o.side === 'BUY' ? fmtTL(o.reservedTL) : o.qty + ' adet'}) — ${esc(o.note)}</span>
                <button type="button" class="ms-btn danger sm" data-cancel-ord="${esc(o.id)}">Emri İptal Et</button>
              </div>
            `).join('')}

            ${(member.ipoRequests || []).map((r) => `
              <div class="ms-alert info"><strong>Halka Arz Blokesi:</strong> ${esc(r.ticker)} (${r.requestedLots} lot talep · ${fmtTL(r.blockedCashTL)} bloke)</div>
            `).join('')}
          </div>

          <div class="ms-list" style="margin-top:10px">
            ${snap.tranches.map((tr) => {
              const early = tr.isTermDeposit && !tr.isMatured;
              return `
                <div class="ms-list-row">
                  <div>
                    <strong>${esc(tr.name)}</strong>
                    <div style="font-size:12.4px;color:#334155">
                      Anapara: ${fmtTL(tr.principalTL)} · Biriken Net: <strong class="pos">+${fmtTL(tr.netInterestTL)}</strong> (Ayda ~+${fmtTL(tr.monthlyNetDripTL)})
                      ${early ? ` · Vadeye kalan: <strong>${tr.remainingDays} gün</strong>` : ''}
                    </div>
                  </div>
                  <button type="button" class="ms-btn ${early ? 'danger' : ''} sm" data-break-tr="${esc(tr.id)}">
                    ${early ? `Erken Boz (${fmtTL(tr.forfeitedIfBrokenEarlyTL)} Yanar)` : 'Nakde Çevir'}
                  </button>
                </div>
              `;
            }).join('')}

            ${snap.spotItems.map((it) => `
              <div class="ms-list-row">
                <div>
                  <strong>${esc(it.ticker)} — ${esc(it.name)}</strong> <span style="font-size:12px;color:#64748b">(${it.qty} adet · Maliyet ${fmtUnitTL(it.avgCostTL)})</span>
                  <div style="font-size:12.5px;color:#334155">
                    Net Değer: <strong>${fmtTL(it.netValTL)}</strong> ·
                    Kâr/Zarar: <strong class="${it.pnlNetTL >= 0 ? 'pos' : 'neg'}">${it.pnlNetTL >= 0 ? '+' : ''}${fmtTL(it.pnlNetTL)} (${it.pnlNetPct >= 0 ? '+' : ''}%${it.pnlNetPct})</strong>
                  </div>
                  ${it.thesisNote ? `<div style="font-size:11.8px;color:#1d4ed8;margin-top:2px">Alım Tezin: "${esc(it.thesisNote)}"</div>` : ''}
                </div>
                <button type="button" class="ms-btn sm" data-open-pos="${esc(it.assetKey)}">İncele / Sat</button>
              </div>
            `).join('')}

            ${snap.tranches.length === 0 && snap.spotItems.length === 0 ? `
              <div style="padding:14px 4px;font-size:13.5px;color:#64748b">
                Henüz yatırım yapmadın; <strong>1.000.000 ₺</strong> sermayenin tamamı boş nakitte duruyor. "Piyasa & Keşif" sekmesinden ilk gerçek adımını atabilirsin.
              </div>
            ` : ''}
          </div>
        </section>

        <!-- SAĞ SÜTUN: USTALIK RADARI, SABIR KANITI & ARAŞTIRMA vs DEDİKODU KARNESİ -->
        <section class="ms-card">
          <div class="ms-sec-head">
            <div>
              <h2 class="ms-sec-title">Yatırımcı Ustalık Aynası (${mastery.overallScore}/100)</h2>
              <p class="ms-sec-sub">Ünvanın: <strong>${esc(mastery.rankTitle)}</strong></p>
            </div>
          </div>

          <div class="ms-alert info" style="margin-top:0">
            <strong>Usta Dostun Notu:</strong> ${esc(mastery.mentorVoice)}
          </div>

          <div style="margin:14px 0">
            ${mastery.axes.map((ax) => `
              <div class="ms-bar-row">
                <div class="ms-bar-label"><span>${esc(ax.label)}</span><span>${ax.score}/100</span></div>
                <div class="ms-bar-track"><div class="ms-bar-fill ${ax.score >= 75 ? 'green' : (ax.score >= 50 ? '' : 'amber')}" style="width:${ax.score}%"></div></div>
              </div>
            `).join('')}
          </div>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:14px 0" />

          <h3 style="margin:0 0 8px;font-size:14.5px;font-weight:800">Sabır Testi & Alternatif Kıyaslama</h3>
          <div class="ms-bar-row">
            <div class="ms-bar-label"><span>Senin Portföyün</span><span>${fmtTL(snap.totalNetWorthTL)}</span></div>
            <div class="ms-bar-track"><div class="ms-bar-fill" style="width:${pctBar(snap.totalNetWorthTL)}%"></div></div>
          </div>
          ${snap.ghostHoldNetWorthTL != null ? `
            <div class="ms-bar-row">
              <div class="ms-bar-label">
                <span>İlk Kurduğun Sepeti Hiç Kurcalamasaydın</span>
                <span>${fmtTL(snap.ghostHoldNetWorthTL)}</span>
              </div>
              <div class="ms-bar-track"><div class="ms-bar-fill purple" style="width:${pctBar(snap.ghostHoldNetWorthTL)}%"></div></div>
            </div>
          ` : ''}
          <div class="ms-bar-row">
            <div class="ms-bar-label"><span>1 Milyonu Sadece Gram Altında Tutsaydın</span><span>${fmtTL(snap.ifAllGoldTL)}</span></div>
            <div class="ms-bar-track"><div class="ms-bar-fill amber" style="width:${pctBar(snap.ifAllGoldTL)}%"></div></div>
          </div>
          <div class="ms-bar-row">
            <div class="ms-bar-label"><span>1 Milyonu Net Mevduatta Tutsaydın</span><span>${fmtTL(snap.ifAllDepositNetTL)}</span></div>
            <div class="ms-bar-track"><div class="ms-bar-fill green" style="width:${pctBar(snap.ifAllDepositNetTL)}%"></div></div>
          </div>

          <div class="ms-alert warn">
            <strong>Sessiz Fırsat & Sürtünme Kaybı Muhasebesi:</strong><br/>
            • Korkup boşta tuttuğun nakdin enflasyon erimesi: <strong>-${fmtTL(idle.cumulativeInflationLossTL)}</strong> (Vergisiz Sukuk'ta dursaydı kazanacağı: <strong>+${fmtTL(idle.missedSukukNetTL)}</strong>).<br/>
            • Al-sat makası, komisyon, erken bozum ve kredi faizinde yanan toplam para: <strong class="neg">-${fmtTL(snap.totalFrictionBurnedTL)}</strong>.
          </div>

          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;margin-bottom:12px;font-size:12.6px">
            <strong>Araştırma vs Duyum/Heyecan Karnesi:</strong><br/>
            • Bilanço / Makro İnceleyerek Alınanlar (${mastery.researchVsRumor.researchCount} işlem):
            <strong>${mastery.researchVsRumor.researchAvgPct != null ? (mastery.researchVsRumor.researchAvgPct >= 0 ? '+' : '') + '%' + mastery.researchVsRumor.researchAvgPct : 'Henüz veri yok'}</strong><br/>
            • Duyum / Sürü Coşkusuyla Atlananlar (${mastery.researchVsRumor.rumorCount} işlem):
            <strong>${mastery.researchVsRumor.rumorAvgPct != null ? (mastery.researchVsRumor.rumorAvgPct >= 0 ? '+' : '') + '%' + mastery.researchVsRumor.rumorAvgPct : '0 işlem (Temiz Disiplin)'}</strong>
          </div>

          <div class="ms-list">
            ${(member.footprints || []).map((fp) => `
              <div class="ms-list-row">
                <div>
                  <strong>${esc(fp.title)}</strong>
                  <div style="font-size:12.3px;color:#334155">${esc(fp.detail)}</div>
                </div>
                ${fp.leakTL > 0 ? `<strong class="neg">-${fmtTL(fp.leakTL)}</strong>` : ''}
              </div>
            `).join('')}
          </div>

          <div style="margin-top:16px;padding-top:14px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <span style="font-size:12.4px;color:#64748b">Portföyünü temiz 1.000.000 ₺ ile sıfırdan başlatmak istersen:</span>
            <button type="button" class="ms-btn danger sm" id="msReset1MBtn">1.000.000 ₺ Baştan Başlat</button>
          </div>
        </section>
      </div>
    `;

    document.getElementById('msRepayMarginBtn')?.addEventListener('click', () => {
      const res = K.executeOrder({ side: 'REPAY_MARGIN' });
      lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
      renderHeader();
      renderPortfolioTab(host);
    });

    document.getElementById('msPayGvkTaxBtn')?.addEventListener('click', () => {
      const res = K.executeOrder({ side: 'PAY_GVK80_TAX' });
      lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
      renderHeader();
      renderPortfolioTab(host);
    });

    document.getElementById('msToggleRepoBtn')?.addEventListener('click', () => {
      const res = K.executeOrder({ side: 'TOGGLE_OVERNIGHT_REPO' });
      lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
      renderHeader();
      renderPortfolioTab(host);
    });

    host.querySelectorAll('[data-cancel-ord]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'CANCEL_ORDER', orderId: b.getAttribute('data-cancel-ord') });
        lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
        renderHeader();
        renderPortfolioTab(host);
      });
    });

    host.querySelectorAll('[data-break-tr]').forEach((b) => {
      b.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'BREAK_TRANCHE', trancheId: b.getAttribute('data-break-tr') });
        lastPortfolioFeedback = { ok: res.ok, text: res.message || res.reason || '' };
        renderHeader();
        renderPortfolioTab(host);
      });
    });

    host.querySelectorAll('[data-open-pos]').forEach((b) => {
      b.addEventListener('click', () => openAssetDrawer(b.getAttribute('data-open-pos')));
    });

    document.getElementById('msReset1MBtn')?.addEventListener('click', () => {
      K.resetMemberOneMillion();
      lastPortfolioFeedback = { ok: true, text: 'Portföyün temiz 1.000.000 ₺ sermaye ile sıfırdan başlatıldı.' };
      renderHeader();
      renderPortfolioTab(host);
    });
  }

  // --------------------------------------------------------------------------
  // SEKME 3: CANLI YATIRIMCI LİGİ (UYGULAMAYI YÜKLEYEN HERKESİN CANLI PORTFÖYÜ)
  // --------------------------------------------------------------------------
  function openPeerXrayModal(peerId) {
    const K = global.AetherKernelV10;
    const all = K.getAllLeagueMembers();
    const peer = all.find((x) => x.id === peerId);
    if (!peer) return;
    modalMode = 'PEER_XRAY';
    inspectedPeerId = peer.id;
    const snap = K.evaluateMemberPortfolio(peer);
    const mastery = K.evaluateInvestorMastery(peer, snap);
    const sheet = document.getElementById('msModalSheet');
    if (!sheet) return;

    sheet.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:10px">
          <span class="ms-avatar" style="width:40px;height:40px;font-size:16px;background:${esc(peer.avatarColor || '#2563eb')}">${esc(initials(peer.name))}</span>
          <div>
            <h2 style="margin:0;font-size:20px;font-weight:800">${esc(peer.name)} — Açık Portföy Röntgeni</h2>
            <div style="font-size:12.5px;color:#64748b">${esc(peer.roleLabel)} · ${esc(peer.deviceLabel || 'Cihaz')} · Ustalık: ${mastery.overallScore}/100 (${esc(mastery.rankTitle)})</div>
          </div>
        </div>
        <button type="button" class="ms-btn sm" id="msCloseModalBtn">Kapat</button>
      </div>

      <div class="ms-xray-kpi-grid">
        <div class="ms-kpi-box" style="padding:11px">
          <span>Toplam Portföy</span>
          <strong style="font-size:17px">${fmtTL(snap.totalNetWorthTL)}</strong>
        </div>
        <div class="ms-kpi-box" style="padding:11px">
          <span>Net Kâr / Zarar</span>
          <strong style="font-size:17px" class="${snap.nominalPnlTL >= 0 ? 'pos' : 'neg'}">${snap.nominalPnlTL >= 0 ? '+' : ''}${fmtTL(snap.nominalPnlTL)} (${snap.nominalPnlPct >= 0 ? '+' : ''}%${snap.nominalPnlPct})</strong>
        </div>
        <div class="ms-kpi-box" style="padding:11px">
          <span>Boş Nakit</span>
          <strong style="font-size:17px">${fmtTL(snap.cashTL)}</strong>
        </div>
      </div>

      ${renderAllocRibbonHtml(snap.allocationBreakdown)}

      <h3 style="margin:16px 0 8px;font-size:15px;font-weight:800">Taşıdığı Yatırımlar ve Canlı Kâr/Zarar Durumu</h3>
      <div class="ms-list">
        ${snap.spotItems.map((it) => `
          <div class="ms-list-row">
            <div>
              <strong>${esc(it.ticker)} — ${esc(it.name)}</strong> (${it.qty} adet · Maliyet: ${fmtUnitTL(it.avgCostTL)})
              <div style="font-size:12.5px;color:#334155">
                Güncel Değer: <strong>${fmtTL(it.netValTL)}</strong> ·
                Kâr/Zarar: <strong class="${it.pnlNetTL >= 0 ? 'pos' : 'neg'}">${it.pnlNetTL >= 0 ? '+' : ''}${fmtTL(it.pnlNetTL)} (${it.pnlNetPct >= 0 ? '+' : ''}%${it.pnlNetPct})</strong>
              </div>
              ${it.thesisNote ? `<div style="font-size:12px;color:#1d4ed8">Notu: "${esc(it.thesisNote)}"</div>` : ''}
            </div>
            <button type="button" class="ms-btn sm" data-xray-jump="${esc(it.assetKey)}">Bu Varlığı İncele</button>
          </div>
        `).join('')}

        ${snap.tranches.map((tr) => `
          <div class="ms-list-row">
            <div>
              <strong>${esc(tr.name)}</strong>
              <div style="font-size:12.5px;color:#334155">
                Bağlı Tutar: ${fmtTL(tr.principalTL)} · Biriken Net: <strong class="pos">+${fmtTL(tr.netInterestTL)}</strong>
              </div>
            </div>
          </div>
        `).join('')}

        ${(peer.pendingOrders || []).map((o) => `
          <div class="ms-list-row">
            <div>
              <strong>⏳ Bekleyen Emir: ${esc(o.name)}</strong>
              <div style="font-size:12.5px;color:#334155">${o.side === 'BUY' ? fmtTL(o.reservedTL) + ' bloke' : o.qty + ' adet satım'} · ${esc(o.note || '')}</div>
            </div>
          </div>
        `).join('')}

        ${(peer.ipoRequests || []).map((r) => `
          <div class="ms-list-row">
            <div>
              <strong>🏛️ Halka Arz Talebi: ${esc(r.ticker)}</strong>
              <div style="font-size:12.5px;color:#334155">${r.requestedLots} lot · ${fmtTL(r.blockedCashTL)} bloke</div>
            </div>
          </div>
        `).join('')}

        ${snap.spotItems.length === 0 && snap.tranches.length === 0 && (peer.pendingOrders || []).length === 0 && (peer.ipoRequests || []).length === 0 ? `
          <div style="font-size:13px;color:#64748b">Henüz pozisyon açmamış; tamamı nakitte bekliyor.</div>
        ` : ''}
      </div>

      ${(peer.tradeHistory || []).length > 0 ? `
        <h3 style="margin:16px 0 8px;font-size:15px;font-weight:800">Son Yaptığı Hamleler</h3>
        <div class="ms-list">
          ${peer.tradeHistory.slice(0, 6).map((th) => `
            <div class="ms-list-row">
              <div style="font-size:12.6px">
                <strong>${esc(th.side)} — ${esc(th.name)}</strong> (${fmtTL(th.amountTL)})
                ${th.thesisNote ? `<div style="color:#1d4ed8">Tezi: "${esc(th.thesisNote)}"</div>` : ''}
              </div>
              <span style="font-size:11.5px;color:#64748b">${esc(fmtAgo(th.ts))}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;

    openModalShell();
    document.getElementById('msCloseModalBtn')?.addEventListener('click', closeModal);
    sheet.querySelectorAll('[data-xray-jump]').forEach((b) => {
      b.addEventListener('click', () => openAssetDrawer(b.getAttribute('data-xray-jump')));
    });
  }

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

    host.innerHTML = `
      <section class="ms-card" style="border-left:4px solid ${league.isOnline ? '#10b981' : '#f59e0b'}">
        <div class="ms-sec-head" style="margin-bottom:8px">
          <div>
            <h2 class="ms-sec-title">Canlı Yatırımcı Ligi — Uygulamayı Yükleyenlerin Açık Portföyleri</h2>
            <p class="ms-sec-sub">
              Uygulamayı telefonuna veya bilgisayarına yükleyip adını giren herkes (4G/5G veya farklı Wi-Fi fark etmeksizin) bu meydanda otomatik görünür. Herkesin portföy dağılımı ve kâr/zararı canlı fiyatlarla anlık hesaplanır.
            </p>
          </div>
          <button type="button" class="ms-btn sm" id="msEditRoomBtn">Profil & Oda (${esc(league.roomCode)})</button>
        </div>

        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;padding-top:8px;border-top:1px solid #e2e8f0">
          <div style="display:flex;align-items:center;gap:8px;font-size:12.8px;font-weight:700">
            <span class="ms-dot ${league.isOnline ? 'open' : ''}"></span>
            <span>${league.isOnline
              ? `Küresel Canlı Ağ Bağlı (${league.connectedBrokers}/${league.totalBrokers} Sunucu) · ${evaluated.length} Yatırımcı Ligde`
              : 'Canlı Bulut Ağına Bağlanılıyor...'}</span>
          </div>
          <div class="ms-pills" style="margin:0">
            <button type="button" class="ms-pill ${leagueSortBy === 'NET_WORTH' ? 'active' : ''}" data-lsort="NET_WORTH">Portföy Büyüklüğü</button>
            <button type="button" class="ms-pill ${leagueSortBy === 'PNL_PCT' ? 'active' : ''}" data-lsort="PNL_PCT">% Kâr / Zarar</button>
            <button type="button" class="ms-pill ${leagueSortBy === 'MASTERY' ? 'active' : ''}" data-lsort="MASTERY">Ustalık Puanı</button>
          </div>
        </div>
      </section>

      ${!me.profileRegistered ? `
        <div class="ms-alert warn" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
          <span>Diğer telefonların seni Canlı Ligde görebilmesi için adını kaydetmelisin.</span>
          <button type="button" class="ms-btn primary sm" id="msPromptRegBtn">Adımı Kaydet ve Lige Çık</button>
        </div>
      ` : ''}

      <div class="ms-league-grid" style="margin-bottom:16px">
        ${evaluated.map(({ raw, snap, mastery }, idx) => {
          const isMe = raw.id === me.id;
          const onlineNow = isMe || (Date.now() - (raw.lastSeenAt || raw.updatedAt || 0)) < 75000;
          const lastMove = (raw.tradeHistory || [])[0] || null;
          const rankCls = idx === 0 ? 'gold' : (idx === 1 ? 'silver' : (idx === 2 ? 'bronze' : ''));
          const displayName = raw.profileRegistered ? raw.name : 'Ben (Henüz Ad Girilmedi)';

          return `
            <article class="ms-member-card ${isMe ? 'is-me' : ''}">
              <div class="ms-member-head">
                <div class="ms-member-ident">
                  <span class="ms-rank-badge ${rankCls}">${idx + 1}</span>
                  <span class="ms-avatar" style="background:${esc(raw.avatarColor || '#2563eb')}">${esc(initials(displayName))}</span>
                  <div style="min-width:0">
                    <strong style="font-size:15.5px">${esc(displayName)} ${isMe ? '<small style="color:#2563eb">(Sen)</small>' : ''}</strong>
                    <div style="font-size:11.6px;color:#64748b">
                      <span style="color:${onlineNow ? '#059669' : '#64748b'};font-weight:700">${onlineNow ? '● Şimdi Açık' : '○ ' + esc(fmtAgo(raw.lastSeenAt || raw.updatedAt))}</span>
                      · ${esc(raw.deviceLabel || 'Cihaz')} · Ustalık ${mastery.overallScore}
                    </div>
                  </div>
                </div>

                <div class="ms-member-worth">
                  <strong style="font-size:17px;display:block">${fmtTL(snap.totalNetWorthTL)}</strong>
                  <span class="${snap.nominalPnlTL >= 0 ? 'pos' : 'neg'}" style="font-size:12.6px;font-weight:800">
                    ${snap.nominalPnlTL >= 0 ? '+' : ''}${fmtTL(snap.nominalPnlTL)} (${snap.nominalPnlPct >= 0 ? '+' : ''}%${snap.nominalPnlPct})
                  </span>
                </div>
              </div>

              ${renderAllocRibbonHtml(snap.allocationBreakdown)}

              <div class="ms-holdings-box">
                <div style="font-weight:800;margin-bottom:3px;color:#334155">Portföy Dağılımı & Kâr/Zarar:</div>
                ${snap.spotItems.map((s) => `
                  <span class="ms-holding-chip">
                    ${esc(s.ticker)} ${fmtTL(s.netValTL)}
                    <span class="${s.pnlNetPct >= 0 ? 'pos' : 'neg'}">(${s.pnlNetPct >= 0 ? '+' : ''}%${s.pnlNetPct})</span>
                  </span>
                `).join('')}
                ${snap.tranches.map((t) => `
                  <span class="ms-holding-chip">${esc(t.name.split(' ')[0])} ${fmtTL(t.accruedNetValueTL)}</span>
                `).join('')}
                ${snap.cashTL > 200 ? `<span class="ms-holding-chip">Nakit ${fmtTL(snap.cashTL)}</span>` : ''}
                ${snap.unsettledTL > 0 ? `<span class="ms-holding-chip">T+2 Takas ${fmtTL(snap.unsettledTL)}</span>` : ''}
                ${snap.pendingOrderTL > 0 ? `<span class="ms-holding-chip">Valör/Emir ${fmtTL(snap.pendingOrderTL)}</span>` : ''}
                ${snap.ipoBlockedTL > 0 ? `<span class="ms-holding-chip">Halka Arz ${fmtTL(snap.ipoBlockedTL)}</span>` : ''}
              </div>

              <div style="font-size:12.3px;color:#334155">
                <strong>Son Hamle:</strong>
                ${lastMove
                  ? `${esc(lastMove.side)} — ${esc(lastMove.name)} (${fmtTL(lastMove.amountTL)})${lastMove.thesisNote ? ` · "${esc(lastMove.thesisNote)}"` : ''}`
                  : 'Henüz alım-satım yapmadı'}
              </div>

              <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:auto">
                <button type="button" class="ms-btn primary sm" data-xray-peer="${esc(raw.id)}">Portföy Röntgenini Gör</button>
                ${!isMe ? `
                  <button type="button" class="ms-btn sm" data-ask-peer="${esc(raw.name)}" data-ask-move="${esc(lastMove ? lastMove.name : 'portföy stratejisi')}">
                    "Bunu Nereden Gördün?" Sor
                  </button>
                ` : ''}
              </div>
            </article>
          `;
        }).join('')}
      </div>

      <!-- CANLI HAMLE AKIŞI & MEYDAN SOHBETİ -->
      <section class="ms-card">
        <div class="ms-sec-head">
          <div>
            <h3 class="ms-sec-title">Canlı Hamle Akışı & "Bunu Nereden Gördün?" Meydanı</h3>
            <p class="ms-sec-sub">Canlı Ligde biri güçlü bir hamle yakaladığında kıskanmak yerine mantığını sor, aynı pencereden bakmayı öğren.</p>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <input id="msBanterInp" class="ms-input" type="text" placeholder="Bir hamleyi sor veya piyasa öngörünü paylaş..." />
          <button type="button" class="ms-btn primary" id="msSendBanterBtn">Gönder</button>
        </div>
        <div class="ms-list" style="max-height:340px;overflow-y:auto">
          ${(st.banterFeed || []).length > 0 ? (st.banterFeed || []).map((b) => `
            <div class="ms-list-row" style="background:${b.kind === 'TRADE' ? '#eff6ff' : '#f8fafc'}">
              <div style="font-size:13px">
                <strong>${esc(b.authorName)}${b.targetName ? ' -> ' + esc(b.targetName) : ''}:</strong>
                ${esc(b.text)}
              </div>
              <span style="font-size:11.5px;color:#64748b">${esc(fmtAgo(b.ts))}</span>
            </div>
          `).join('') : `
            <div style="font-size:13px;color:#64748b">Henüz meydan mesajı yok. Yapılan tüm işlemler ve sorular tüm cihazlarda anında burada akar.</div>
          `}
        </div>
      </section>
    `;

    document.getElementById('msEditRoomBtn')?.addEventListener('click', openProfileModal);
    document.getElementById('msPromptRegBtn')?.addEventListener('click', openWelcomeModal);

    host.querySelectorAll('[data-lsort]').forEach((b) => {
      b.addEventListener('click', () => {
        leagueSortBy = b.getAttribute('data-lsort');
        renderFamilyTab(host);
      });
    });

    host.querySelectorAll('[data-xray-peer]').forEach((b) => {
      b.addEventListener('click', () => openPeerXrayModal(b.getAttribute('data-xray-peer')));
    });

    host.querySelectorAll('[data-ask-peer]').forEach((b) => {
      b.addEventListener('click', () => {
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
  // GENEL SEKME YÖNETİMİ VE BAŞLATMA
  // --------------------------------------------------------------------------
  function renderCurrentTab() {
    const host = document.getElementById('msMainContainer');
    if (!host) return;
    document.querySelectorAll('.ms-tab-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-tab') === activeTab);
    });
    if (activeTab === 'market') renderMarketTab(host);
    else if (activeTab === 'portfolio') renderPortfolioTab(host);
    else if (activeTab === 'family') renderFamilyTab(host);
  }

  function switchTab(tabName) {
    activeTab = tabName;
    renderCurrentTab();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function mount() {
    const K = global.AetherKernelV10;
    K.init();

    K.subscribe(() => {
      renderHeader();
      if (modalMode === 'PEER_XRAY' && inspectedPeerId) {
        openPeerXrayModal(inspectedPeerId);
      }
      // Kullanıcı arama, sohbet, tatbikat seçimi veya halka arz lot kutusundaysa odak bozulmasın
      const activeId = document.activeElement?.id || '';
      if (
        activeId === 'msSearchInp' ||
        activeId === 'msBanterInp' ||
        activeId === 'msCrisisSelect' ||
        activeId.startsWith('msIpoLots_')
      ) {
        return;
      }
      renderCurrentTab();
    });

    document.querySelectorAll('.ms-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });

    document.getElementById('msModalBackdrop')?.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'msModalBackdrop' && modalMode !== 'WELCOME') {
        closeModal();
      }
    });

    renderHeader();
    renderCurrentTab();
    setInterval(tickHeaderClockOnly, 1000);

    // İlk kez açan kullanıcıya 3 saniyelik net karşılama ekranı göster
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
    closeModal
  };
})(typeof window !== 'undefined' ? window : globalThis);
