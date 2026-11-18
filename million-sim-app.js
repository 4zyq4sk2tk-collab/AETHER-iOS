// ============================================================================
// 1.000.000 ₺ GERÇEK YATIRIM SİMÜLASYONU — ANA UYGULAMA MOTORU (million-sim-app.js)
// Sıfır Masalsı Metafor · Sıfır Karmaşa · %100 Gerçek Türkiye ve Dünya Yatırımları
// ============================================================================
(function (global) {
  'use strict';

  const CURATED_STARTER_KEYS = [
    'gram-altin-spot',
    'kira-sertifikasi-sukuk',
    'para-piyasasi-fonu',
    'mevduat-ust',
    'doviz-usd',
    'doviz-eur',
    'bist-thyao',
    'bist-froto',
    'bist-tuprs',
    'reel-perakende-bimas',
    'bist-asels',
    'bist-eregl',
    'reel-enerji-astor',
    'altin-sertifikasi',
    'gram-gumus-spot',
    'abd-sp500-spy',
    'kuresel-hisse-nvda',
    'kripto-btc'
  ];

  const HIST_ASSETS = [
    { id: 'gramGold', field: 'gramGoldTL', name: 'Gram Altın (Fiziki)', cat: 'Emtia', kind: 'spot', spreadPct: 0.40 },
    { id: 'gramSilver', field: 'gramSilverTL', name: 'Gram Gümüş', cat: 'Emtia', kind: 'spot', spreadPct: 0.65 },
    { id: 'sukuk', field: null, name: 'Hazine Kira Sertifikası (%0 Stopaj)', cat: 'Sabit Getiri', kind: 'sukuk', spreadPct: 0 },
    { id: 'deposit', field: null, name: 'Vadeli TL Mevduat (Stopajlı)', cat: 'Sabit Getiri', kind: 'deposit', spreadPct: 0 },
    { id: 'usd', field: 'usd', name: 'Amerikan Doları (USD)', cat: 'Döviz', kind: 'spot', spreadPct: 0.60 },
    { id: 'thyao', field: 'thyao', name: 'Türk Hava Yolları (THYAO)', cat: 'BIST Şirketi', kind: 'bist', spreadPct: 0.10 },
    { id: 'froto', field: 'froto', name: 'Ford Otosan (FROTO)', cat: 'BIST Şirketi', kind: 'bist', spreadPct: 0.10 },
    { id: 'tuprs', field: 'tuprs', name: 'TÜPRAŞ (TUPRS)', cat: 'BIST Şirketi', kind: 'bist', spreadPct: 0.10 },
    { id: 'bimas', field: 'bimas', name: 'BİM Mağazalar (BIMAS)', cat: 'BIST Şirketi', kind: 'bist', spreadPct: 0.10 },
    { id: 'asels', field: 'asels', name: 'ASELSAN (ASELS)', cat: 'BIST Şirketi', kind: 'bist', spreadPct: 0.10 },
    { id: 'eregl', field: 'eregl', name: 'Ereğli Demir Çelik (EREGL)', cat: 'BIST Şirketi', kind: 'bist', spreadPct: 0.10 },
    { id: 'garan', field: 'garan', name: 'Garanti BBVA (GARAN)', cat: 'BIST Şirketi', kind: 'bist', spreadPct: 0.10 },
    { id: 'ekgyo', field: 'ekgyo', name: 'Emlak Konut GYO (EKGYO)', cat: 'BIST Şirketi', kind: 'bist', spreadPct: 0.12 },
    { id: 'sasa', field: 'sasa', name: 'SASA Polyester (SASA)', cat: 'BIST Şirketi', kind: 'bist', spreadPct: 0.15 },
    { id: 'spy', field: 'spyUsd', name: 'ABD S&P 500 Endeksi (SPY)', cat: 'ABD Borsası', kind: 'usd_etf', spreadPct: 0.18 },
    { id: 'btc', field: 'btcUsd', name: 'Bitcoin (BTC)', cat: 'Kripto', kind: 'usd_etf', spreadPct: 0.25 }
  ];

  let activeTab = 'market';
  let activeCategory = 'STARTER';
  let bistSubFilter = 'ALL';
  let searchQuery = '';
  let selectedChainId = null;
  let scenarioShock = { type: 'OIL', pct: 0 };

  let drawerAssetKey = null;
  let selectedDoor = 'BAZAAR';
  let selectedMaturity = 32;
  let lastDrawerFeedback = null;

  // 10 Yıl 1.000.000 ₺ Simülasyon Durumu
  let sim10Y = null;
  let simTimer = null;

  function esc(s) {
    return String(s || '')
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

  // --------------------------------------------------------------------------
  // ÜST ÖZET ÇUBUĞU (AKTİF YATIRIMCI + PİYASA DURUMU + 1.000.000 ₺ ÖZETİ)
  // --------------------------------------------------------------------------
  function renderHeader() {
    const K = global.AetherKernelV10;
    if (!K) return;
    const st = K.getState();
    const clock = K.getTurkishClock();
    const snap = K.evaluateMemberPortfolio();
    const headerEl = document.getElementById('msHeaderInner');
    if (!headerEl) return;

    const pnlSign = snap.nominalPnlTL >= 0 ? '+' : '';
    const pnlCls = snap.nominalPnlTL > 0 ? 'pos' : (snap.nominalPnlTL < 0 ? 'neg' : '');

    headerEl.innerHTML = `
      <div class="ms-user-box">
        <select id="msActiveMemberSel" class="ms-member-select" aria-label="Aktif Yatırımcı">
          ${st.members.map((m) => `
            <option value="${esc(m.id)}" ${m.id === st.activeMemberId ? 'selected' : ''}>
              ${esc(m.name)} (1 Milyon ₺ Portföy)
            </option>
          `).join('')}
        </select>
        <div class="ms-market-state">
          <span class="ms-dot ${clock.bistCanMatchNow ? 'open' : ''}"></span>
          <span>${esc(clock.shortTimeStr)} · ${clock.bistCanMatchNow ? 'Borsa İstanbul Açık' : (clock.grandBazaarOpen ? 'Kapalıçarşı Açık · Borsa Kapalı' : 'Mesai Dışı (Banka & Kripto Açık)')}</span>
        </div>
      </div>

      <div class="ms-balance-strip">
        <div class="ms-bal-item">
          <span>Toplam Portföy</span>
          <strong>${fmtTL(snap.totalNetWorthTL)}</strong>
        </div>
        <div class="ms-bal-item">
          <span>Net Kâr / Zarar</span>
          <strong class="${pnlCls}">${pnlSign}${fmtTL(snap.nominalPnlTL)} (${pnlSign}%${snap.nominalPnlPct})</strong>
        </div>
        <div class="ms-bal-item">
          <span>Boş Nakit</span>
          <strong>${fmtTL(snap.cashTL)}</strong>
        </div>
      </div>
    `;

    document.getElementById('msActiveMemberSel')?.addEventListener('change', (e) => {
      K.switchActiveMember(e.target.value);
      renderCurrentTab();
      renderHeader();
    });
  }

  // --------------------------------------------------------------------------
  // SEKME 1: PİYASA, DÜNYA BAĞLANTILARI VE 672+ GERÇEK YATIRIM ARACI
  // --------------------------------------------------------------------------
  function getFilteredMarketAssets() {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const all = K.getAllAssets().filter((a) => a.venue !== 'BENCHMARK_ONLY' && a.priceTL > 0);
    const q = searchQuery.trim().toLocaleUpperCase('tr-TR');

    if (q.length > 0) {
      return all
        .filter((a) =>
          a.name.toLocaleUpperCase('tr-TR').includes(q) ||
          a.ticker.toLocaleUpperCase('tr-TR').includes(q) ||
          (a.categoryName || '').toLocaleUpperCase('tr-TR').includes(q)
        )
        .slice(0, 48);
    }

    if (selectedChainId) {
      const ch = (G.getLiveWorldChains() || []).find((c) => c.id === selectedChainId);
      if (ch) {
        return ch.assetKeys.map((k) => K.getAsset(k)).filter(Boolean);
      }
    }

    if (activeCategory === 'STARTER') {
      return CURATED_STARTER_KEYS.map((k) => K.getAsset(k)).filter(Boolean);
    }
    if (activeCategory === 'GOLD_COMMODITY') {
      return all.filter((a) => a.categoryId === '2');
    }
    if (activeCategory === 'RATE_SUKUK') {
      return all.filter((a) => a.isRateInstrument || a.id === 'eurobond-usdtr' || a.id === 'eurobond-emb');
    }
    if (activeCategory === 'FX') {
      return all.filter((a) => String(a.id || '').startsWith('doviz-'));
    }
    if (activeCategory === 'FUNDS') {
      return all.filter((a) => a.categoryId === '4' || a.subVenue === 'BIST_TAXABLE_ETF' || a.subVenue === 'BIST_EXEMPT_ETF');
    }
    if (activeCategory === 'GLOBAL_CRYPTO') {
      return all.filter((a) => a.isForeignUsd || a.venue === 'CRYPTO_24_7');
    }
    if (activeCategory === 'BIST_ALL') {
      let stocks = all.filter((a) => a.subVenue === 'BIST_STOCK' || a.id.startsWith('bist-'));
      if (bistSubFilter === 'STRONG_CASH') {
        stocks = stocks
          .filter((a) => a.bistRow && a.bistRow.ocfMillionTL > 0 && !a.isPumpAnomaly)
          .sort((a, b) => (b.bistRow.ocfMillionTL || 0) - (a.bistRow.ocfMillionTL || 0));
      } else if (bistSubFilter === 'EXPORT_IND') {
        stocks = stocks.filter((a) => a.bistRow && ['Otomotiv & Yan Sanayi', 'Makine & Sanayi Üretimi', 'Demir-Çelik & Metal Sanayi', 'Ulaştırma, Havacılık & Lojistik', 'Teknoloji, Yazılım & Savunma'].includes(a.bistRow.sector));
      } else if (bistSubFilter === 'DIVIDEND') {
        stocks = stocks
          .filter((a) => a.bistRow && (a.bistRow.dividendYield || 0) > 1.0)
          .sort((a, b) => (b.bistRow.dividendYield || 0) - (a.bistRow.dividendYield || 0));
      } else if (bistSubFilter === 'BANK_HOLDING') {
        stocks = stocks.filter((a) => a.bistRow && ['Bankacılık & Mevduat', 'Holding & Çoklu Yatırım', 'Sigorta & Emeklilik'].includes(a.bistRow.sector));
      } else {
        stocks = stocks.sort((a, b) => (b.bistRow?.turnoverMillionTL || 0) - (a.bistRow?.turnoverMillionTL || 0));
      }
      return stocks.slice(0, 60);
    }

    return CURATED_STARTER_KEYS.map((k) => K.getAsset(k)).filter(Boolean);
  }

  function computePortfolioScenarioImpact() {
    const K = global.AetherKernelV10;
    const snap = K.evaluateMemberPortfolio();
    const pct = Number(scenarioShock.pct) || 0;
    if (pct === 0) return null;

    let deltaTL = 0;
    for (const item of snap.spotItems) {
      const a = K.getAsset(item.assetKey);
      if (!a) continue;
      let sensitivity = 0;
      if (scenarioShock.type === 'USD') {
        if (String(a.id).startsWith('doviz-') || a.isForeignUsd || a.id.includes('altin') || a.id.includes('gumus') || a.venue === 'CRYPTO_24_7') sensitivity = 0.95;
        else if (['THYAO', 'FROTO', 'TOASO', 'TUPRS', 'ASELS', 'SISE', 'EREGL'].includes(a.ticker)) sensitivity = 0.55;
        else if (a.venue === 'BIST') sensitivity = 0.25;
      } else if (scenarioShock.type === 'OIL') {
        if (a.id === 'emtia-petrol-bno') sensitivity = 1.0;
        else if (a.ticker === 'TUPRS') sensitivity = 0.45;
        else if (['THYAO', 'PGSUS'].includes(a.ticker)) sensitivity = -0.40;
        else if (a.venue === 'BIST') sensitivity = -0.10;
      } else if (scenarioShock.type === 'RATE') {
        // Faiz artışı hisse ve GYO'yu baskılar
        if (a.categoryName.includes('Gayrimenkul') || a.ticker === 'EKGYO' || a.ticker === 'SASA') sensitivity = -0.75;
        else if (a.venue === 'BIST') sensitivity = -0.35;
      }
      deltaTL += item.netValTL * (pct / 100) * sensitivity;
    }
    return Math.round(deltaTL);
  }

  function renderMarketTab(host) {
    const K = global.AetherKernelV10;
    const G = global.RealInvestmentGuide;
    const md = K.getMarketData();
    const member = K.getActiveMember();
    const chains = G.getLiveWorldChains();
    const activeChain = chains.find((c) => c.id === selectedChainId) || null;
    const assets = getFilteredMarketAssets();
    const topNews = (md?.liveRealWorldFeed || [])[0] || null;
    const shockDelta = computePortfolioScenarioImpact();

    host.innerHTML = `
      <section class="ms-card">
        <div class="ms-sec-head">
          <div>
            <h2 class="ms-sec-title">Dünya Akışı & Hammadde - Şirket Bağlantıları</h2>
            <p class="ms-sec-sub">
              ${topNews ? `Güncel Akış: "${esc(topNews.title)}" — ` : ''}Bir hammadde veya ekonomik olaya dokunarak onunla bağlantılı gerçek yatırımları bir arada gör.
            </p>
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
            <div style="font-size:12.5px;font-weight:800;color:#1d4ed8">${esc(activeChain.triggerHeadline)}</div>
            <div class="ms-flow-steps">
              <div class="ms-flow-box">
                <span>1. KAYNAK / HAMMADDE</span>
                <strong>${esc(activeChain.step1)}</strong>
              </div>
              <div class="ms-flow-box">
                <span>2. ÜRETİM / FİNANSAL KANAL</span>
                <strong>${esc(activeChain.step2)}</strong>
              </div>
              <div class="ms-flow-box">
                <span>3. ETKİLENEN YATIRIMLAR</span>
                <strong>${esc(activeChain.step3)}</strong>
              </div>
            </div>
            <div style="font-size:13.2px;color:#334155">${esc(activeChain.insight)}</div>
          </div>
        ` : ''}

        <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;display:flex;flex-wrap:wrap;align-items:center;gap:12px;font-size:13px">
          <strong>Portföy Stres Testi:</strong>
          <select id="msShockType" class="ms-member-select" style="font-size:12.5px;padding:5px 10px">
            <option value="USD" ${scenarioShock.type === 'USD' ? 'selected' : ''}>Dolar / Döviz Kuru</option>
            <option value="OIL" ${scenarioShock.type === 'OIL' ? 'selected' : ''}>Brent Petrol Fiyatı</option>
            <option value="RATE" ${scenarioShock.type === 'RATE' ? 'selected' : ''}>Merkez Bankası Faizi</option>
          </select>
          <input id="msShockRange" type="range" min="-25" max="30" step="5" value="${scenarioShock.pct}" style="width:150px;accent-color:#1d4ed8" />
          <span>Değişim: <strong>${scenarioShock.pct >= 0 ? '+' : ''}%${scenarioShock.pct}</strong></span>
          ${shockDelta !== null ? `
            <span class="${shockDelta >= 0 ? 'pos' : 'neg'}" style="font-weight:800">
              -> Mevcut Portföyüne Tahmini Etkisi: ${shockDelta >= 0 ? '+' : ''}${fmtTL(shockDelta)}
            </span>
          ` : `<span style="color:#64748b">(Portföyündeki yatırımların duyarlılığını test etmek için sürgüyü kaydır)</span>`}
        </div>
      </section>

      <section class="ms-card">
        <div class="ms-sec-head">
          <div>
            <h2 class="ms-sec-title">Gerçek Yatırım Araçları (1.000.000 ₺ Sermayeni Yönet)</h2>
            <p class="ms-sec-sub">Her kart gerçek piyasa fiyatıyla çalışır. Detayına tıkladığında ne iş yaptığını, hammaddesini, vergisini ve al-sat ekranını görürsün.</p>
          </div>
        </div>

        <div class="ms-search-row">
          <input id="msSearchInp" class="ms-input" type="search" value="${esc(searchQuery)}" placeholder="Altın, Mevduat, Kira Sertifikası, Dolar, THYAO, FROTO, Bitcoin veya 619 şirketten ara..." />
        </div>

        <div class="ms-pills">
          <button type="button" class="ms-pill ${!selectedChainId && activeCategory === 'STARTER' ? 'active' : ''}" data-cat="STARTER">Öne Çıkan 18 Araç</button>
          <button type="button" class="ms-pill ${!selectedChainId && activeCategory === 'GOLD_COMMODITY' ? 'active' : ''}" data-cat="GOLD_COMMODITY">Altın, Gümüş & Emtia</button>
          <button type="button" class="ms-pill ${!selectedChainId && activeCategory === 'RATE_SUKUK' ? 'active' : ''}" data-cat="RATE_SUKUK">Mevduat, Fon & Sukuk</button>
          <button type="button" class="ms-pill ${!selectedChainId && activeCategory === 'FX' ? 'active' : ''}" data-cat="FX">Döviz</button>
          <button type="button" class="ms-pill ${!selectedChainId && activeCategory === 'BIST_ALL' ? 'active' : ''}" data-cat="BIST_ALL">Türk Şirketleri (619)</button>
          <button type="button" class="ms-pill ${!selectedChainId && activeCategory === 'FUNDS' ? 'active' : ''}" data-cat="FUNDS">Yatırım Fonları</button>
          <button type="button" class="ms-pill ${!selectedChainId && activeCategory === 'GLOBAL_CRYPTO' ? 'active' : ''}" data-cat="GLOBAL_CRYPTO">ABD Borsası & Kripto</button>
        </div>

        ${!selectedChainId && activeCategory === 'BIST_ALL' && !searchQuery ? `
          <div class="ms-pills" style="margin-top:-6px">
            <button type="button" class="ms-pill ${bistSubFilter === 'ALL' ? 'active' : ''}" data-bsub="ALL">En Çok İşlem Görenler</button>
            <button type="button" class="ms-pill ${bistSubFilter === 'STRONG_CASH' ? 'active' : ''}" data-bsub="STRONG_CASH">Kasası Güçlü Nakit Üretenler</button>
            <button type="button" class="ms-pill ${bistSubFilter === 'EXPORT_IND' ? 'active' : ''}" data-bsub="EXPORT_IND">İhracat, Sanayi & Havacılık</button>
            <button type="button" class="ms-pill ${bistSubFilter === 'DIVIDEND' ? 'active' : ''}" data-bsub="DIVIDEND">Temettü Verenler</button>
            <button type="button" class="ms-pill ${bistSubFilter === 'BANK_HOLDING' ? 'active' : ''}" data-bsub="BANK_HOLDING">Banka & Holdingler</button>
          </div>
        ` : ''}

        <div class="ms-asset-grid">
          ${assets.map((a) => {
            const info = G.explainAsset(a);
            const chg = Number(a.change1D) || 0;
            const isOwned = Boolean(member.positions?.[a.key] || (member.rateTranches || []).some((t) => t.assetKey === a.key));
            const priceLabel = a.isRateInstrument
              ? `Yıllık %${a.annualGrossRatePct.toFixed(1)}`
              : fmtUnitTL(a.priceTL);
            const chgLabel = a.isRateInstrument
              ? (a.stopajPct === 0 ? '%0 Stopaj' : `%${a.stopajPct} Stopaj`)
              : `${chg >= 0 ? '+' : ''}%${chg.toFixed(2)}`;
            const chgCls = a.isRateInstrument ? 'flat' : (chg > 0 ? 'pos' : (chg < 0 ? 'neg' : 'flat'));

            return `
              <article class="ms-asset-card ${isOwned ? 'owned' : ''}" data-open-asset="${esc(a.key)}">
                <div>
                  <div class="ms-asset-top">
                    <span class="ms-asset-code">${esc(a.ticker)}</span>
                    ${isOwned ? `<span style="font-size:11px;font-weight:800;color:#059669">Portföyde Var</span>` : ''}
                  </div>
                  <h3 class="ms-asset-name">${esc(a.name)}</h3>
                  <p class="ms-asset-desc" style="margin-top:6px">${esc(info ? info.shortDesc : a.categoryName)}</p>
                </div>
                <div class="ms-asset-bottom">
                  <span class="ms-price-val">${priceLabel}</span>
                  <span class="ms-chg-badge ${chgCls}">${esc(chgLabel)}</span>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    `;

    host.querySelectorAll('[data-chain]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-chain');
        selectedChainId = selectedChainId === id ? null : id;
        searchQuery = '';
        renderMarketTab(host);
      });
    });

    document.getElementById('msClearChainBtn')?.addEventListener('click', () => {
      selectedChainId = null;
      renderMarketTab(host);
    });

    document.getElementById('msShockType')?.addEventListener('change', (e) => {
      scenarioShock.type = e.target.value;
      renderMarketTab(host);
    });

    document.getElementById('msShockRange')?.addEventListener('input', (e) => {
      scenarioShock.pct = Number(e.target.value) || 0;
      renderMarketTab(host);
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

    host.querySelectorAll('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat');
        selectedChainId = null;
        searchQuery = '';
        renderMarketTab(host);
      });
    });

    host.querySelectorAll('[data-bsub]').forEach((btn) => {
      btn.addEventListener('click', () => {
        bistSubFilter = btn.getAttribute('data-bsub');
        renderMarketTab(host);
      });
    });

    host.querySelectorAll('[data-open-asset]').forEach((card) => {
      card.addEventListener('click', () => openAssetDrawer(card.getAttribute('data-open-asset')));
    });
  }

  // --------------------------------------------------------------------------
  // 360° YATIRIM İNCELEME VE AL-SAT ÇEKMECESİ
  // --------------------------------------------------------------------------
  function openAssetDrawer(assetKey) {
    const K = global.AetherKernelV10;
    const asset = K.getAsset(assetKey);
    if (!asset) return;
    drawerAssetKey = asset.key;
    lastDrawerFeedback = null;
    if (asset.bistRow || asset.subVenue === 'DARPHANE_S1') {
      K.markInspectedCashScale();
    }
    renderAssetDrawer();
    const bd = document.getElementById('msModalBackdrop');
    if (bd) bd.classList.add('open');
  }

  function closeAssetDrawer() {
    drawerAssetKey = null;
    const bd = document.getElementById('msModalBackdrop');
    if (bd) bd.classList.remove('open');
  }

  function renderHealthBlockHtml(health) {
    if (!health) return '';
    if (health.kind === 'COMPANY') {
      const ocf = health.ocfMillionTL;
      const inc = health.netIncomeMillionTL;
      const cash = health.cashMillionTL;
      const debt = health.totalDebtMillionTL;
      const maxVal = Math.max(100, Math.abs(ocf), Math.abs(inc), cash, debt);
      const wOcf = Math.max(6, Math.round((Math.abs(ocf) / maxVal) * 100));
      const wCash = Math.max(6, Math.round((cash / maxVal) * 100));
      const wDebt = Math.max(6, Math.round((debt / maxVal) * 100));

      return `
        <div class="ms-card" style="background:#f8fafc;margin:12px 0;padding:14px">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px">Şirket Finansal Sağlığı (Gerçek Bilanço Verisi)</div>
          <div class="ms-bar-row">
            <div class="ms-bar-label">
              <span>Kasaya Giren Faaliyet Nakdi (Yıllık)</span>
              <span class="${ocf >= 0 ? 'pos' : 'neg'}">${ocf >= 0 ? '+' : ''}${ocf.toLocaleString('tr-TR')} Milyon ₺</span>
            </div>
            <div class="ms-bar-track"><div class="ms-bar-fill ${ocf >= 0 ? 'green' : 'red'}" style="width:${wOcf}%"></div></div>
          </div>
          <div class="ms-bar-row">
            <div class="ms-bar-label">
              <span>Kasadaki Hazır Nakit</span>
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
          <div style="font-size:12.8px;color:#334155;margin-top:8px">
            <strong>Değerlendirme:</strong> ${esc(health.verdict)}
            ${health.pe != null ? ` (F/K: ${health.pe} · PD/DD: ${health.pb ?? '-'})` : ''}
          </div>
        </div>
      `;
    }

    if (health.kind === 'GOLD_SPREAD') {
      return `
        <div class="ms-alert ${health.status === 'WARN' ? 'warn' : 'info'}">
          <strong>Fiziki Altın vs Borsa Sertifikası Fiyat Farkı:</strong><br/>
          Serbest Piyasa 1 Gr Fiziki Altın: <strong>${fmtTL(health.spotGramTL)}</strong> ·
          100 Adet ALTIN.S1 (1 Gr Karşılığı): <strong>${fmtTL(health.s1GramTL)}</strong>.<br/>
          ${esc(health.verdict)}
        </div>
      `;
    }

    if (health.kind === 'RATE_VS_INF') {
      return `
        <div class="ms-alert ${health.status === 'GOOD' ? 'ok' : 'warn'}">
          <strong>Vergi Sonrası Net Getiri Hesabı:</strong>
          Brüt %${health.grossPct.toFixed(1)} -> %${health.stopajPct} stopaj kesildikten sonra yıllık <strong>net %${health.netPct}</strong> kalır (TÜİK yıllık enflasyon: %${health.inflationPct.toFixed(1)}).
        </div>
      `;
    }
    return '';
  }

  function renderAssetDrawer() {
    const sheet = document.getElementById('msModalSheet');
    if (!sheet || !drawerAssetKey) return;
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

    let channelPickerHtml = '';
    if (asset.venue === 'TWO_DOOR') {
      const exAmt = 100000;
      const bazCost = Math.round(exAmt * (clock.bazaarSpreadPct / 200));
      const bankCost = Math.round(exAmt * (clock.bankSpreadPct / 200 + 0.002));
      channelPickerHtml = `
        <div style="margin:12px 0">
          <div style="font-size:13px;font-weight:800;margin-bottom:6px">Alım-Satım Kanalı Seç (Gerçek Makas ve Vergi Farkı):</div>
          <div class="ms-door-grid">
            <button type="button" class="ms-door-card ${selectedDoor === 'BAZAAR' ? 'selected' : ''}" data-door="BAZAAR">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
                <strong>Kapalıçarşı Serbest Piyasa</strong>
                <span class="${clock.grandBazaarOpen ? 'pos' : 'neg'}" style="font-weight:800">${clock.grandBazaarOpen ? 'Açık' : 'Kapalı (09:30–18:30)'}</span>
              </div>
              <div style="font-size:12.2px;color:#334155">Makas ~%${clock.bazaarSpreadPct.toFixed(2)} · Vergi: <strong>%0</strong></div>
              <div style="font-size:11.8px;color:#64748b;margin-top:3px">100.000 ₺ işlemde makas maliyeti: ~${bazCost.toLocaleString('tr-TR')} ₺</div>
            </button>
            <button type="button" class="ms-door-card ${selectedDoor === 'BANK' ? 'selected' : ''}" data-door="BANK">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
                <strong>Mobil Banka (7/24)</strong>
                <span class="${clock.bankDaytimeTight ? 'pos' : 'neg'}" style="font-weight:800">${clock.bankDaytimeTight ? 'Mesai İçi' : 'Mesai Dışı Geniş Makas!'}</span>
              </div>
              <div style="font-size:12.2px;color:#334155">Makas %${clock.bankSpreadPct.toFixed(2)} + <strong>%0,2 Kambiyo Vergisi</strong></div>
              <div style="font-size:11.8px;color:#64748b;margin-top:3px">100.000 ₺ işlemde makas+vergi: ~${bankCost.toLocaleString('tr-TR')} ₺</div>
            </button>
          </div>
        </div>
      `;
    }

    let maturityPickerHtml = '';
    if (asset.subVenue === 'TERM_DEPOSIT') {
      maturityPickerHtml = `
        <div style="margin:12px 0">
          <div style="font-size:13px;font-weight:800;margin-bottom:6px">Mevduat Vadesi Seç (Vadeden önce bozulursa biriken faiz sıfırlanır):</div>
          <div class="ms-pills" style="margin-bottom:0">
            <button type="button" class="ms-pill ${selectedMaturity === 32 ? 'active' : ''}" data-mat="32">32 Gün (%17,5 Stopaj)</button>
            <button type="button" class="ms-pill ${selectedMaturity === 181 ? 'active' : ''}" data-mat="181">181 Gün (%15 Stopaj)</button>
            <button type="button" class="ms-pill ${selectedMaturity === 366 ? 'active' : ''}" data-mat="366">366 Gün (%10 Stopaj)</button>
          </div>
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
          <h2 style="margin:2px 0 0;font-size:20px;font-weight:800">${esc(asset.name)}</h2>
        </div>
        <button type="button" class="ms-btn sm" id="msCloseModalBtn">Kapat</button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:12px">
        <div class="ms-kpi-box" style="padding:10px">
          <span style="font-size:10.5px">Fiyat / Oran</span>
          <strong style="font-size:15px">${asset.isRateInstrument ? `Yıllık %${asset.annualGrossRatePct.toFixed(1)}` : fmtUnitTL(asset.priceTL)}</strong>
        </div>
        <div class="ms-kpi-box" style="padding:10px">
          <span style="font-size:10.5px">Boş Nakdin</span>
          <strong style="font-size:15px">${fmtTL(snap.cashTL)}</strong>
        </div>
        <div class="ms-kpi-box" style="padding:10px">
          <span style="font-size:10.5px">T+2 Takasta</span>
          <strong style="font-size:15px">${fmtTL(snap.unsettledTL)}</strong>
        </div>
      </div>

      ${lastDrawerFeedback ? `<div class="ms-alert ${lastDrawerFeedback.ok ? 'ok' : 'err'}">${esc(lastDrawerFeedback.text)}</div>` : ''}
      ${micro.statusNote ? `<div class="ms-alert warn">${esc(micro.statusNote)}</div>` : ''}

      ${channelPickerHtml}
      ${maturityPickerHtml}

      <div class="ms-card" style="background:#f8fafc;padding:14px;margin-bottom:12px">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:8px">Yatırım Tutarı Gir (₺)</div>
        <div class="ms-pills" style="margin-bottom:10px">
          <button type="button" class="ms-pill" data-qamt="50000">50.000 ₺</button>
          <button type="button" class="ms-pill" data-qamt="100000">100.000 ₺</button>
          <button type="button" class="ms-pill" data-qamt="250000">250.000 ₺</button>
          <button type="button" class="ms-pill" data-qamt="500000">500.000 ₺</button>
          <button type="button" class="ms-pill" data-qamt="${Math.max(100, Math.floor(snap.cashTL))}">Tüm Nakit (${fmtTL(snap.cashTL)})</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <input id="msOrderAmountInp" class="ms-input" style="flex:1 1 160px" type="number" min="100" step="1000" value="${Math.min(100000, Math.max(1000, Math.floor(snap.cashTL * 0.25)))}" />
          <button type="button" class="ms-btn primary" style="flex:1 1 160px" id="msBuyConfirmBtn">
            ${asset.isRateInstrument ? 'Vadeli / Fona Bağla' : 'Alım Emri Ver'}
          </button>
        </div>

        ${existingPos && existingPos.qty > 0 ? `
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px">
            <div style="font-size:13px">
              Portföydeki Miktarın: <strong>${existingPos.qty} adet</strong> (Maliyet: ${fmtUnitTL(existingPos.avgCostTL)})
            </div>
            <div style="display:flex;gap:8px">
              <button type="button" class="ms-btn sm" data-sell-part="0.5">Yarısını Sat</button>
              <button type="button" class="ms-btn danger sm" data-sell-part="1">Tamamını Sat</button>
            </div>
          </div>
        ` : ''}
      </div>

      <div class="ms-card" style="background:#f8fafc;padding:14px;margin-bottom:12px">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:4px">Nasıl Çalışır & Parayı Nereden Kazanır?</div>
        <p style="margin:0 0 10px;font-size:13.3px;color:#334155">${esc(info.howItWorks)}</p>
        <div style="display:grid;gap:6px;font-size:12.6px">
          <div><strong>Bağlı Olduğu Hammadde ve Veriler:</strong> ${esc(info.rawInputs.join(' · '))}</div>
          <div><strong class="pos">Ne Zaman Güçlenir:</strong> ${esc(info.risesWhen)}</div>
          <div><strong class="neg">Risk ve Baskı Unsuru:</strong> ${esc(info.fallsWhen)}</div>
        </div>
        ${relatedAssets.length > 0 ? `
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid #e2e8f0;display:flex;flex-wrap:wrap;gap:6px;align-items:center">
            <span style="font-size:12px;font-weight:700;color:#64748b">Bağlantılı Yatırımlar:</span>
            ${relatedAssets.map((ra) => `
              <button type="button" class="ms-btn sm" data-jump-asset="${esc(ra.key)}">${esc(ra.ticker)} · ${ra.isRateInstrument ? '%' + ra.annualGrossRatePct : fmtUnitTL(ra.priceTL)}</button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      ${renderHealthBlockHtml(info.health)}

      <div class="ms-alert info" style="font-weight:500;margin-bottom:0">
        <strong>Türkiye İşlem & Vergi Kuralı:</strong> ${esc(info.executionRule)}
      </div>
    `;

    document.getElementById('msCloseModalBtn')?.addEventListener('click', closeAssetDrawer);

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

    sheet.querySelectorAll('[data-qamt]').forEach((b) => {
      b.addEventListener('click', () => {
        const inp = document.getElementById('msOrderAmountInp');
        if (inp) inp.value = b.getAttribute('data-qamt');
      });
    });

    document.getElementById('msBuyConfirmBtn')?.addEventListener('click', () => {
      const amt = Number(document.getElementById('msOrderAmountInp')?.value || 0);
      const res = K.executeOrder({
        side: 'BUY',
        assetKey: asset.key,
        amountTL: amt,
        door: selectedDoor,
        maturityDays: selectedMaturity
      });
      lastDrawerFeedback = { ok: res.ok, text: res.ok ? res.message : res.reason };
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
  }

  // --------------------------------------------------------------------------
  // SEKME 2: PORTFÖYÜM, BENCHMARK KIYASLAMASI & HATA KOÇU
  // --------------------------------------------------------------------------
  function renderPortfolioTab(host) {
    const K = global.AetherKernelV10;
    const member = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(member);
    const idle = member.idleErosionLog || { cumulativeInflationLossTL: 0, missedSukukNetTL: 0 };

    const maxBench = Math.max(snap.totalNetWorthTL, snap.ifAllGoldTL, snap.ifAllDepositNetTL, snap.ifAllBist100TL, snap.inflationTargetTL, 1000000);
    const pctBar = (v) => Math.max(8, Math.round((v / maxBench) * 100));

    host.innerHTML = `
      <div class="ms-kpi-grid">
        <div class="ms-kpi-box">
          <span>Güncel Net Portföy Değerin</span>
          <strong>${fmtTL(snap.totalNetWorthTL)}</strong>
          <small class="${snap.nominalPnlTL >= 0 ? 'pos' : 'neg'}">
            1.000.000 ₺ başlangıca göre ${snap.nominalPnlTL >= 0 ? '+' : ''}${fmtTL(snap.nominalPnlTL)} (${snap.nominalPnlPct >= 0 ? '+' : ''}%${snap.nominalPnlPct})
          </small>
        </div>
        <div class="ms-kpi-box">
          <span>Enflasyon Karşısında Reel Durum</span>
          <strong class="${snap.realPurchasingPnlPct >= 0 ? 'pos' : 'neg'}">${snap.realPurchasingPnlPct >= 0 ? '+' : ''}%${snap.realPurchasingPnlPct}</strong>
          <small>Alım gücünü korumak için gereken alt sınır: ${fmtTL(snap.inflationTargetTL)}</small>
        </div>
        <div class="ms-kpi-box">
          <span>Kullanılabilir Boş Nakit</span>
          <strong>${fmtTL(snap.cashTL)}</strong>
          <small>Portföy ağırlığı: %${((snap.cashTL / Math.max(1, snap.totalNetWorthTL)) * 100).toFixed(1)}</small>
        </div>
        <div class="ms-kpi-box">
          <span>T+2 Takas & Bekleyen Emirler</span>
          <strong>${fmtTL(snap.unsettledTL + snap.pendingOrderTL)}</strong>
          <small>T+2 Takasta: ${fmtTL(snap.unsettledTL)} · Valör/Açılışta: ${fmtTL(snap.pendingOrderTL)}</small>
        </div>
      </div>

      <div class="ms-two-col">
        <section class="ms-card">
          <div class="ms-sec-head">
            <div>
              <h2 class="ms-sec-title">Portföyümdeki Yatırımlar</h2>
              <p class="ms-sec-sub">Tüm değerler stopaj ve vergi karşılıkları düşülmüş net tutarlardır.</p>
            </div>
          </div>

          ${(member.settlementQueue || []).map((q) => `
            <div class="ms-alert warn"><strong>T+2 Takas Beklemesi:</strong> ${esc(q.ticker)} satışından ${fmtTL(q.grossTL)} — ${esc(q.note)}</div>
          `).join('')}

          ${(member.pendingOrders || []).map((o) => `
            <div class="ms-alert info"><strong>Sırada Bekleyen Emir:</strong> ${esc(o.name)} (${o.side === 'BUY' ? fmtTL(o.reservedTL) : o.qty + ' adet'}) — ${esc(o.note)}</div>
          `).join('')}

          <div class="ms-list">
            ${snap.tranches.map((tr) => {
              const early = tr.isTermDeposit && !tr.isMatured;
              return `
                <div class="ms-list-row">
                  <div>
                    <strong>${esc(tr.name)}</strong>
                    <div style="font-size:12.5px;color:#334155">
                      Anapara: ${fmtTL(tr.principalTL)} · Biriken Net Getiri: <strong class="pos">+${fmtTL(tr.netInterestTL)}</strong> (%${tr.stopajPct} stopaj düşüldü)
                      ${early ? ` · Vadeye kalan: <strong>${tr.remainingDays} gün</strong>` : ''}
                    </div>
                  </div>
                  <button type="button" class="ms-btn ${early ? 'danger' : ''} sm" data-break-tr="${esc(tr.id)}">
                    ${early ? `Erken Boz (${fmtTL(tr.forfeitedIfBrokenEarlyTL)} Faiz Yanar)` : 'Nakde Çevir'}
                  </button>
                </div>
              `;
            }).join('')}

            ${snap.spotItems.map((it) => `
              <div class="ms-list-row">
                <div>
                  <strong>${esc(it.name)} (${it.qty} adet)</strong>
                  <div style="font-size:12.5px;color:#334155">
                    Net Değer: <strong>${fmtTL(it.netValTL)}</strong> ·
                    Kâr/Zarar: <strong class="${it.pnlNetTL >= 0 ? 'pos' : 'neg'}">${it.pnlNetTL >= 0 ? '+' : ''}${fmtTL(it.pnlNetTL)} (${it.pnlNetPct >= 0 ? '+' : ''}%${it.pnlNetPct})</strong>
                  </div>
                </div>
                <button type="button" class="ms-btn sm" data-open-pos="${esc(it.assetKey)}">Al / Sat</button>
              </div>
            `).join('')}

            ${snap.tranches.length === 0 && snap.spotItems.length === 0 ? `
              <div style="padding:12px 2px;font-size:13.5px;color:#64748b">
                Henüz yatırım yapmadın; <strong>1.000.000 ₺</strong> başlangıç sermayenin tamamı nakitte bekliyor. "Yatırım Yap" sekmesinden gerçek varlıkları seçerek portföyünü kurabilirsin.
              </div>
            ` : ''}
          </div>
        </section>

        <section class="ms-card">
          <div class="ms-sec-head">
            <div>
              <h2 class="ms-sec-title">1.000.000 ₺ Kıyaslama & Yatırım Koçu</h2>
              <p class="ms-sec-sub">Başladığın andan itibaren alternatiflere göre performansın ve karar analizin.</p>
            </div>
          </div>

          <div style="margin-bottom:16px">
            <div class="ms-bar-row">
              <div class="ms-bar-label"><span>Senin Portföyün</span><span>${fmtTL(snap.totalNetWorthTL)}</span></div>
              <div class="ms-bar-track"><div class="ms-bar-fill" style="width:${pctBar(snap.totalNetWorthTL)}%"></div></div>
            </div>
            <div class="ms-bar-row">
              <div class="ms-bar-label"><span>1 Milyonu Sadece Gram Altında Tutsaydın</span><span>${fmtTL(snap.ifAllGoldTL)}</span></div>
              <div class="ms-bar-track"><div class="ms-bar-fill amber" style="width:${pctBar(snap.ifAllGoldTL)}%"></div></div>
            </div>
            <div class="ms-bar-row">
              <div class="ms-bar-label"><span>1 Milyonu Net Mevduatta Tutsaydın</span><span>${fmtTL(snap.ifAllDepositNetTL)}</span></div>
              <div class="ms-bar-track"><div class="ms-bar-fill green" style="width:${pctBar(snap.ifAllDepositNetTL)}%"></div></div>
            </div>
            <div class="ms-bar-row">
              <div class="ms-bar-label"><span>1 Milyonu BIST 100 Endeksinde Tutsaydın</span><span>${fmtTL(snap.ifAllBist100TL)}</span></div>
              <div class="ms-bar-track"><div class="ms-bar-fill" style="width:${pctBar(snap.ifAllBist100TL)}%"></div></div>
            </div>
          </div>

          <div class="ms-alert warn">
            <strong>Atıl Nakit Maliyeti:</strong> Boşta tuttuğun nakdin enflasyon karşısındaki alım gücü kaybı <strong>${fmtTL(idle.cumulativeInflationLossTL)}</strong>; aynı nakit %0 stopajlı Kira Sertifikasında dursaydı kazanacağı getiri: <strong>+${fmtTL(idle.missedSukukNetTL)}</strong>.
          </div>

          <div class="ms-list">
            ${(member.footprints || []).length > 0
              ? member.footprints.map((fp) => `
                <div class="ms-list-row">
                  <div>
                    <strong>${esc(fp.title)}</strong>
                    <div style="font-size:12.4px;color:#334155">${esc(fp.detail)}</div>
                  </div>
                  ${fp.leakTL > 0 ? `<strong class="neg">-${fmtTL(fp.leakTL)}</strong>` : ''}
                </div>
              `).join('')
              : `<div style="font-size:13px;color:#64748b">Henüz mesai dışı yüksek banka makası, erken mevduat bozumu veya panik satışı hatası yapmadın. Tüm hamlelerin burada analiz edilir.</div>`
            }
          </div>

          <div style="margin-top:16px;padding-top:14px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <span style="font-size:12.5px;color:#64748b">Portföyü temiz 1.000.000 ₺ ile baştan başlatmak istersen:</span>
            <button type="button" class="ms-btn danger sm" id="msReset1MBtn">1.000.000 ₺ Baştan Başlat</button>
          </div>
        </section>
      </div>
    `;

    host.querySelectorAll('[data-break-tr]').forEach((b) => {
      b.addEventListener('click', () => {
        K.executeOrder({ side: 'BREAK_TRANCHE', trancheId: b.getAttribute('data-break-tr') });
        renderHeader();
        renderPortfolioTab(host);
      });
    });

    host.querySelectorAll('[data-open-pos]').forEach((b) => {
      b.addEventListener('click', () => openAssetDrawer(b.getAttribute('data-open-pos')));
    });

    document.getElementById('msReset1MBtn')?.addEventListener('click', () => {
      K.resetMemberOneMillion(member.id);
      renderHeader();
      renderPortfolioTab(host);
    });
  }

  // --------------------------------------------------------------------------
  // SEKME 3: AİLE 1 MİLYON TL LİGİ (AÇIK PORTFÖYLER & REKABET)
  // --------------------------------------------------------------------------
  function renderFamilyTab(host) {
    const K = global.AetherKernelV10;
    const st = K.getState();
    const sharePack = K.exportFamilySharePacket();

    const ranked = st.members
      .map((m) => ({ raw: m, snap: K.evaluateMemberPortfolio(m) }))
      .sort((a, b) => b.snap.totalNetWorthTL - a.snap.totalNetWorthTL);

    host.innerHTML = `
      <section class="ms-card">
        <div class="ms-sec-head">
          <div>
            <h2 class="ms-sec-title">Aile 1.000.000 ₺ Yatırım Ligi — Açık Portföyler</h2>
            <p class="ms-sec-sub">Evdeki herkes eşit 1.000.000 ₺ ile başlar. Herkesin portföy dağılımı, kâr/zararı ve yaptığı son hamle şeffafça görünür.</p>
          </div>
        </div>

        <div class="ms-league-grid">
          ${ranked.map(({ raw, snap }, idx) => {
            const isAct = raw.id === st.activeMemberId;
            const lastMove = (raw.tradeHistory || [])[0] || null;
            const lines = [
              ...snap.spotItems.map((s) => `${s.ticker}: ${fmtTL(s.netValTL)} (${s.pnlNetPct >= 0 ? '+' : ''}%${s.pnlNetPct})`),
              ...snap.tranches.map((t) => `${t.name}: ${fmtTL(t.accruedNetValueTL)}`),
              ...(raw.pendingOrders || []).map((o) => `Bekleyen Emir (${o.name}): ${fmtTL(o.reservedTL)}`),
              ...(raw.settlementQueue || []).map((q) => `T+2 Takas (${q.ticker}): ${fmtTL(q.grossTL)}`)
            ];
            if (snap.cashTL > 100) lines.push(`Nakit: ${fmtTL(snap.cashTL)}`);

            return `
              <article class="ms-member-card ${isAct ? 'active' : ''}">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="ms-rank-badge">${idx + 1}</span>
                    <div>
                      <strong style="font-size:16px">${esc(snap.name)}</strong>
                      <div style="font-size:11.8px;color:#64748b">${esc(raw.roleLabel)}</div>
                    </div>
                  </div>
                  <div style="text-align:right">
                    <strong style="font-size:17px;display:block">${fmtTL(snap.totalNetWorthTL)}</strong>
                    <span class="${snap.nominalPnlTL >= 0 ? 'pos' : 'neg'}" style="font-size:12.5px;font-weight:800">
                      ${snap.nominalPnlTL >= 0 ? '+' : ''}${fmtTL(snap.nominalPnlTL)} (${snap.nominalPnlPct >= 0 ? '+' : ''}%${snap.nominalPnlPct})
                    </span>
                  </div>
                </div>

                <div class="ms-holdings-box">
                  <strong>Portföy Dağılımı:</strong><br/>
                  ${esc(lines.join(' · '))}
                </div>

                <div style="font-size:12.3px;color:#475569">
                  <strong>Son Hamle:</strong>
                  ${lastMove ? `${esc(lastMove.side)} — ${esc(lastMove.name)} (${fmtTL(lastMove.amountTL)})` : 'Henüz işlem yapmadı'}
                </div>

                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:auto">
                  ${!isAct ? `<button type="button" class="ms-btn primary sm" data-sw-mem="${esc(raw.id)}">Bu Portföye Geç</button>` : `<span class="ms-chg-badge flat">Aktif Portföy</span>`}
                  <button type="button" class="ms-btn sm" data-comment-mem="${esc(snap.name)}" data-comment-move="${esc(lastMove ? lastMove.name : 'nakitte beklemek')}">Hamleye Yorum Yaz</button>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>

      <div class="ms-two-col">
        <section class="ms-card">
          <h3 class="ms-sec-title" style="margin-bottom:10px">Aileye Yeni Yatırımcı Ekle (1.000.000 ₺ İle Başlar)</h3>
          <div style="display:grid;gap:10px">
            <input id="msNewMemberName" class="ms-input" type="text" placeholder="İsim (Örn: Babam, Annem, Kardeşim)" />
            <input id="msNewMemberRole" class="ms-input" type="text" placeholder="Unvan / Strateji (Örn: Uzun Vadeci, Temettücü)" />
            <button type="button" class="ms-btn primary" id="msAddMemberBtn">1.000.000 ₺ Ver ve Lige Ekle</button>
          </div>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
          <h4 style="margin:0 0 6px;font-size:14px">Telefonlar Arası Portföy Eşitleme</h4>
          <p style="margin:0 0 10px;font-size:12.6px;color:#64748b">Aynı ev Wi-Fi ağındayken tüm telefonlar otomatik eşitlenir. Uzaktayken WhatsApp ile eşitleme kodunu paylaşabilirsin:</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">
            <button type="button" class="ms-btn sm" id="msCopySyncBtn">Eşitleme Kodunu Kopyala</button>
          </div>
          <div style="display:flex;gap:8px">
            <input id="msPasteSyncInp" class="ms-input" type="text" placeholder="Aileden gelen AETHER-SALON kodunu yapıştır..." />
            <button type="button" class="ms-btn primary sm" id="msApplySyncBtn">Eşitle</button>
          </div>
          <div id="msSyncMsg" style="font-size:12.5px;font-weight:700;margin-top:6px"></div>
        </section>

        <section class="ms-card">
          <h3 class="ms-sec-title" style="margin-bottom:10px">Aile İçi Hamle Yorumları</h3>
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <input id="msBanterInp" class="ms-input" type="text" placeholder="Portföyler veya günün hamlesi hakkında yaz..." />
            <button type="button" class="ms-btn primary sm" id="msSendBanterBtn">Gönder</button>
          </div>
          <div class="ms-list" style="max-height:290px;overflow-y:auto">
            ${(st.banterFeed || []).map((b) => `
              <div class="ms-list-row">
                <div style="font-size:13px">
                  <strong>${esc(b.authorName)}${b.targetName ? ' -> ' + esc(b.targetName) : ''}:</strong>
                  ${esc(b.text)}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    host.querySelectorAll('[data-sw-mem]').forEach((b) => {
      b.addEventListener('click', () => {
        K.switchActiveMember(b.getAttribute('data-sw-mem'));
        renderHeader();
        renderFamilyTab(host);
      });
    });

    host.querySelectorAll('[data-comment-mem]').forEach((b) => {
      b.addEventListener('click', () => {
        const who = b.getAttribute('data-comment-mem');
        const mv = b.getAttribute('data-comment-move');
        const inp = document.getElementById('msBanterInp');
        if (inp) {
          inp.value = `${who}, ${mv} hamlesini neye göre yaptın?`;
          inp.focus();
        }
      });
    });

    document.getElementById('msAddMemberBtn')?.addEventListener('click', () => {
      const name = document.getElementById('msNewMemberName')?.value || '';
      const role = document.getElementById('msNewMemberRole')?.value || 'Yatırımcı';
      const res = K.addFamilyMember(name, role, 40000, 1000000);
      if (res.ok) {
        renderHeader();
        renderFamilyTab(host);
      }
    });

    document.getElementById('msSendBanterBtn')?.addEventListener('click', () => {
      const inp = document.getElementById('msBanterInp');
      if (inp && inp.value.trim()) {
        K.postTeaBanter(inp.value);
        renderFamilyTab(host);
      }
    });

    document.getElementById('msCopySyncBtn')?.addEventListener('click', async () => {
      const msg = document.getElementById('msSyncMsg');
      try {
        await navigator.clipboard.writeText(sharePack.syncCode);
        if (msg) { msg.className = 'pos'; msg.textContent = 'Eşitleme kodu panoya kopyalandı!'; }
      } catch (_) {
        if (msg) { msg.className = 'pos'; msg.textContent = sharePack.syncCode; }
      }
    });

    document.getElementById('msApplySyncBtn')?.addEventListener('click', () => {
      const raw = document.getElementById('msPasteSyncInp')?.value || '';
      const res = K.importFamilySharePacket(raw);
      const msg = document.getElementById('msSyncMsg');
      if (res.ok) {
        renderHeader();
        renderFamilyTab(host);
      } else if (msg) {
        msg.className = 'neg';
        msg.textContent = res.reason;
      }
    });
  }

  // --------------------------------------------------------------------------
  // SEKME 4: 10 YILLIK 1.000.000 ₺ HIZLANDIRILMIŞ PİYASA SİMÜLASYONU (2016–2026)
  // --------------------------------------------------------------------------
  function getHistUnitPrice(asset, mRow) {
    if (!mRow) return 1;
    if (asset.kind === 'sukuk' || asset.kind === 'deposit') return 1;
    if (asset.kind === 'usd_etf') return +((Number(mRow[asset.field]) || 1) * (Number(mRow.usd) || 3.41)).toFixed(4);
    return Math.max(0.001, Number(mRow[asset.field]) || 1);
  }

  function createFresh10YSim() {
    const pack = global.__AETHER_HISTORY_121M__ || { months: [] };
    const m0 = pack.months[0] || { gramGoldTL: 140.39, usd: 3.41 };
    return {
      idx: 0,
      playing: false,
      speedMs: 2500,
      startCapitalTL: 1000000,
      cumInflation: 1.0,
      cashTL: 1000000,
      sukukTL: 0,
      depositTL: 0,
      units: {},
      goldBenchmarkUnits: 1000000 / (m0.gramGoldTL || 140.39),
      tradeCount: 0,
      logs: ['Kasım 2016: 1.000.000 ₺ başlangıç sermayesiyle 120 aylık gerçek Türkiye piyasa testi başladı.']
    };
  }

  function eval10YSim() {
    const pack = global.__AETHER_HISTORY_121M__ || { months: [], eventsByYm: {} };
    const mRow = pack.months[sim10Y.idx] || pack.months[0];
    let spotTL = 0;
    for (const a of HIST_ASSETS) {
      const q = Number(sim10Y.units[a.id]) || 0;
      if (q > 0) spotTL += q * getHistUnitPrice(a, mRow);
    }
    const totalTL = +(sim10Y.cashTL + sim10Y.sukukTL + sim10Y.depositTL + spotTL).toFixed(2);
    const infTargetTL = +(1000000 * sim10Y.cumInflation).toFixed(2);
    const realTodayEquivTL = +(totalTL / sim10Y.cumInflation).toFixed(2);
    const realPct = +(((totalTL / infTargetTL) - 1) * 100).toFixed(2);
    const goldBenchTL = +(sim10Y.goldBenchmarkUnits * (mRow?.gramGoldTL || 140.39)).toFixed(2);
    return { mRow, totalTL, infTargetTL, realTodayEquivTL, realPct, goldBenchTL };
  }

  function step10YMonth() {
    const pack = global.__AETHER_HISTORY_121M__ || { months: [], eventsByYm: {} };
    if (!sim10Y || sim10Y.idx >= pack.months.length - 1) {
      stop10YTimer();
      renderCurrentTab();
      return;
    }
    sim10Y.idx += 1;
    const mRow = pack.months[sim10Y.idx];
    const cpiMoM = (Number(mRow.cpiMoM) || 0) / 100;
    sim10Y.cumInflation *= (1 + cpiMoM);

    if (sim10Y.depositTL > 0) {
      const netMo = ((Number(mRow.depGross) || 12) * (1 - (Number(mRow.stopaj) || 15) / 100)) / 1200;
      sim10Y.depositTL = +(sim10Y.depositTL * (1 + netMo)).toFixed(2);
    }
    if (sim10Y.sukukTL > 0) {
      const sukMo = (Number(mRow.sukukGross) || 12) / 1200;
      sim10Y.sukukTL = +(sim10Y.sukukTL * (1 + sukMo)).toFixed(2);
    }

    const ev = pack.eventsByYm?.[mRow.ym];
    if (ev) {
      sim10Y.logs.unshift(`${mRow.ym}: ${ev.lateHeadline}`);
      if (sim10Y.logs.length > 12) sim10Y.logs.length = 12;
    }
    if (sim10Y.idx >= pack.months.length - 1) stop10YTimer();
    renderCurrentTab();
  }

  function stop10YTimer() {
    if (simTimer) { clearInterval(simTimer); simTimer = null; }
    if (sim10Y) sim10Y.playing = false;
  }

  function trade10Y(assetId, side, ratio) {
    const pack = global.__AETHER_HISTORY_121M__ || { months: [] };
    const mRow = pack.months[sim10Y.idx];
    const a = HIST_ASSETS.find((x) => x.id === assetId);
    if (!a || !mRow) return;

    if (side === 'BUY') {
      const spend = +(sim10Y.cashTL * ratio).toFixed(2);
      if (spend < 1000) return;
      sim10Y.cashTL = +(sim10Y.cashTL - spend).toFixed(2);
      sim10Y.tradeCount += 1;
      const net = spend * (1 - a.spreadPct / 200);
      if (a.kind === 'sukuk') sim10Y.sukukTL = +(sim10Y.sukukTL + net).toFixed(2);
      else if (a.kind === 'deposit') sim10Y.depositTL = +(sim10Y.depositTL + net).toFixed(2);
      else {
        const u = getHistUnitPrice(a, mRow);
        sim10Y.units[a.id] = +((Number(sim10Y.units[a.id]) || 0) + net / u).toFixed(6);
      }
    } else if (side === 'SELL') {
      sim10Y.tradeCount += 1;
      if (a.kind === 'sukuk' && sim10Y.sukukTL > 0) {
        const amt = +(sim10Y.sukukTL * ratio).toFixed(2);
        sim10Y.sukukTL = +(sim10Y.sukukTL - amt).toFixed(2);
        sim10Y.cashTL = +(sim10Y.cashTL + amt).toFixed(2);
      } else if (a.kind === 'deposit' && sim10Y.depositTL > 0) {
        const amt = +(sim10Y.depositTL * ratio).toFixed(2);
        sim10Y.depositTL = +(sim10Y.depositTL - amt).toFixed(2);
        sim10Y.cashTL = +(sim10Y.cashTL + amt * 0.985).toFixed(2);
      } else {
        const curQ = Number(sim10Y.units[a.id]) || 0;
        if (curQ <= 0) return;
        const sellQ = curQ * ratio;
        const gross = sellQ * getHistUnitPrice(a, mRow) * (1 - a.spreadPct / 200);
        sim10Y.units[a.id] = +(curQ - sellQ).toFixed(6);
        if (sim10Y.units[a.id] < 0.0001) delete sim10Y.units[a.id];
        sim10Y.cashTL = +(sim10Y.cashTL + gross).toFixed(2);
      }
    }
    renderCurrentTab();
  }

  function renderSim10YTab(host) {
    if (!sim10Y) sim10Y = createFresh10YSim();
    const pack = global.__AETHER_HISTORY_121M__ || { months: [], eventsByYm: {} };
    const v = eval10YSim();
    const mRow = v.mRow || {};
    const ev = pack.eventsByYm?.[mRow.ym] || null;

    host.innerHTML = `
      <section class="ms-card">
        <div class="ms-sec-head">
          <div>
            <h2 class="ms-sec-title">1.000.000 ₺ Hızlandırılmış 10 Yıl Simülasyonu (${esc(mRow.ym)} · ${sim10Y.idx}/120 Ay)</h2>
            <p class="ms-sec-sub">Kasım 2016'daki 1.000.000 ₺ sermayeyi gerçek Türkiye krizleri, faiz döngüleri ve enflasyon karşısında yöneterek stratejini test et.</p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${sim10Y.playing
              ? `<button type="button" class="ms-btn danger sm" id="msSimPause">Duraklat</button>`
              : `<button type="button" class="ms-btn primary sm" id="msSimPlay">Başlat (2,5 sn/ay)</button>`}
            <button type="button" class="ms-btn sm" id="msSimFast">Hızlı (0,8 sn/ay)</button>
            <button type="button" class="ms-btn sm" id="msSimStep">+1 Ay İlerle</button>
            <button type="button" class="ms-btn sm" id="msSimReset">1.000.000 ₺ Sıfırla</button>
          </div>
        </div>

        <div class="ms-kpi-grid">
          <div class="ms-kpi-box">
            <span>Portföy Büyüklüğün</span>
            <strong>${fmtTL(v.totalTL)}</strong>
            <small>2016 alım gücüyle karşılığı: ${fmtTL(v.realTodayEquivTL)}</small>
          </div>
          <div class="ms-kpi-box">
            <span>Enflasyon Koruma Sınırı</span>
            <strong>${fmtTL(v.infTargetTL)}</strong>
            <small class="${v.realPct >= 0 ? 'pos' : 'neg'}">Enflasyona karşı reel fark: ${v.realPct >= 0 ? '+' : ''}%${v.realPct}</small>
          </div>
          <div class="ms-kpi-box">
            <span>Sadece Altında Kalsaydı</span>
            <strong>${fmtTL(v.goldBenchTL)}</strong>
            <small>Toplam yaptığın işlem: ${sim10Y.tradeCount}</small>
          </div>
          <div class="ms-kpi-box">
            <span>Boş Nakit Bakiyen</span>
            <strong>${fmtTL(sim10Y.cashTL)}</strong>
            <small>Dolar: ${mRow.usd} ₺ · Politika Faizi: %${mRow.policy}</small>
          </div>
        </div>

        <div class="ms-two-col" style="margin-bottom:14px">
          <div class="ms-alert info" style="margin:0">
            <strong>Öncü Hammadde & Faiz Verisi:</strong><br/>
            ${ev ? esc(ev.kitchenGauge) : `Brent Petrol: ${mRow.bnoUsd} $ · Tarım Emtiası: ${mRow.dbaUsd} $ · Mevduat Brüt: %${mRow.depGross} · Aylık Enflasyon: %${mRow.cpiMoM}`}
          </div>
          <div class="ms-alert ${ev?.rumorTrap ? 'warn' : 'info'}" style="margin:0">
            <strong>Günün Manşeti & Piyasa Söylentisi:</strong><br/>
            ${ev ? esc(ev.lateHeadline) : 'Piyasalarda normal fiyatlama akışı devam ediyor.'}
            ${ev?.rumorTrap ? `<div style="margin-top:4px;color:#b91c1c">${esc(ev.rumorTrap)}</div>` : ''}
          </div>
        </div>

        <div class="ms-asset-grid">
          ${HIST_ASSETS.map((a) => {
            const u = getHistUnitPrice(a, mRow);
            let heldTL = 0;
            if (a.kind === 'sukuk') heldTL = sim10Y.sukukTL;
            else if (a.kind === 'deposit') heldTL = sim10Y.depositTL;
            else heldTL = (Number(sim10Y.units[a.id]) || 0) * u;

            const pText = a.kind === 'sukuk'
              ? `Yıllık %${mRow.sukukGross} (%0 Vergi)`
              : (a.kind === 'deposit' ? `Yıllık %${mRow.depGross} (%${mRow.stopaj} Stopaj)` : fmtUnitTL(u));

            return `
              <div class="ms-asset-card ${heldTL > 100 ? 'owned' : ''}" style="cursor:default">
                <div>
                  <div class="ms-asset-top">
                    <span class="ms-asset-code">${esc(a.cat)}</span>
                    <strong>${pText}</strong>
                  </div>
                  <h4 class="ms-asset-name">${esc(a.name)}</h4>
                  <div style="font-size:12.4px;color:#475569;margin-top:4px">
                    Portföyde: <strong>${heldTL > 100 ? fmtTL(heldTL) : 'Yok'}</strong>
                  </div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap">
                  <button type="button" class="ms-btn primary sm" data-sbuy="${a.id}">Naktin %25'iyle Al</button>
                  ${heldTL > 100 ? `<button type="button" class="ms-btn danger sm" data-ssell="${a.id}">Tamamını Sat</button>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;

    document.getElementById('msSimPlay')?.addEventListener('click', () => {
      stop10YTimer();
      sim10Y.playing = true;
      simTimer = setInterval(step10YMonth, 2500);
      renderSim10YTab(host);
    });
    document.getElementById('msSimFast')?.addEventListener('click', () => {
      stop10YTimer();
      sim10Y.playing = true;
      simTimer = setInterval(step10YMonth, 800);
      renderSim10YTab(host);
    });
    document.getElementById('msSimPause')?.addEventListener('click', () => {
      stop10YTimer();
      renderSim10YTab(host);
    });
    document.getElementById('msSimStep')?.addEventListener('click', () => {
      stop10YTimer();
      step10YMonth();
    });
    document.getElementById('msSimReset')?.addEventListener('click', () => {
      stop10YTimer();
      sim10Y = createFresh10YSim();
      renderSim10YTab(host);
    });

    host.querySelectorAll('[data-sbuy]').forEach((b) => {
      b.addEventListener('click', () => trade10Y(b.getAttribute('data-sbuy'), 'BUY', 0.25));
    });
    host.querySelectorAll('[data-ssell]').forEach((b) => {
      b.addEventListener('click', () => trade10Y(b.getAttribute('data-ssell'), 'SELL', 1.0));
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
    else if (activeTab === 'sim10y') renderSim10YTab(host);
  }

  function switchTab(tabName) {
    if (activeTab === 'sim10y' && tabName !== 'sim10y') stop10YTimer();
    activeTab = tabName;
    renderCurrentTab();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function mount() {
    const K = global.AetherKernelV10;
    K.init();
    K.subscribe(() => {
      renderHeader();
      if (activeTab === 'portfolio' || activeTab === 'family') renderCurrentTab();
    });

    document.querySelectorAll('.ms-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });

    document.getElementById('msModalBackdrop')?.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'msModalBackdrop') closeAssetDrawer();
    });

    renderHeader();
    renderCurrentTab();
    setInterval(renderHeader, 1000);
  }

  global.MillionSimApp = {
    mount,
    switchTab,
    openAssetDrawer,
    closeAssetDrawer
  };
})(typeof window !== 'undefined' ? window : globalThis);
