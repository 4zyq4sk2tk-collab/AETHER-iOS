// ============================================================================
// AETHER v10.0 — MEKÂN 2: 120 AYLIK GERÇEK ZAMAN TÜNELİ (KASIM 2016 – KASIM 2026)
// 14 Gerçek Türkiye/Dünya Varlığı · Eriyen Ekmek Filesi · Kredili Yük Baskısı · Sabır Kıyaslaması
// ============================================================================
(function (global) {
  'use strict';

  const ARENA_ASSETS = [
    { id: 'gramGold', field: 'gramGoldTL', name: 'Fiziki Gram Altın', group: 'Maden & Kalkan', kind: 'spot', spreadPct: 0.45 },
    { id: 'gramSilver', field: 'gramSilverTL', name: 'Fiziki Gram Gümüş', group: 'Maden & Kalkan', kind: 'spot', spreadPct: 0.70 },
    { id: 'sukuk', field: null, name: 'Hazine Kira Sertifikası (Sukuk %0 Stopaj)', group: 'Maden & Kalkan', kind: 'sukuk', spreadPct: 0 },
    { id: 'deposit', field: null, name: 'Banka Vadeli Mevduat (Stopajlı)', group: 'Maden & Kalkan', kind: 'deposit', spreadPct: 0 },
    { id: 'usdCash', field: 'usd', name: 'Nakit Amerikan Doları', group: 'Maden & Kalkan', kind: 'spot', spreadPct: 0.65 },
    { id: 'bimas', field: 'bimas', name: 'BİM Birleşik Mağazalar (BIMAS)', group: 'Gerçek Atölyeler', kind: 'bist', spreadPct: 0.12 },
    { id: 'froto', field: 'froto', name: 'Ford Otosan İhracat (FROTO)', group: 'Gerçek Atölyeler', kind: 'bist', spreadPct: 0.12 },
    { id: 'thyao', field: 'thyao', name: 'Türk Hava Yolları (THYAO)', group: 'Gerçek Atölyeler', kind: 'bist', spreadPct: 0.12 },
    { id: 'tuprs', field: 'tuprs', name: 'TÜPRAŞ Rafineri (TUPRS)', group: 'Gerçek Atölyeler', kind: 'bist', spreadPct: 0.12 },
    { id: 'asels', field: 'asels', name: 'ASELSAN Savunma (ASELS)', group: 'Gerçek Atölyeler', kind: 'bist', spreadPct: 0.12 },
    { id: 'eregl', field: 'eregl', name: 'Ereğli Demir Çelik (EREGL)', group: 'Gerçek Atölyeler', kind: 'bist', spreadPct: 0.12 },
    { id: 'ekgyo', field: 'ekgyo', name: 'Emlak Konut GYO (EKGYO)', group: 'Sürü & Ucuzluk Sınavı', kind: 'bist', spreadPct: 0.15 },
    { id: 'sasa', field: 'sasa', name: 'SASA Polyester (SASA)', group: 'Sürü & Ucuzluk Sınavı', kind: 'bist', spreadPct: 0.18 },
    { id: 'spy', field: 'spyUsd', name: 'Dünya 500 Şirket Sepeti (SPY)', group: 'Küresel', kind: 'usd_etf', spreadPct: 0.20 }
  ];

  let arena = null;
  let timerId = null;
  let hostContainer = null;

  function getHistoryPack() {
    return global.__AETHER_HISTORY_121M__ || { months: [], eventsByYm: {}, blindClues: {} };
  }

  function getUnitPriceTL(assetDef, mRow) {
    if (!mRow) return 1;
    if (assetDef.kind === 'sukuk' || assetDef.kind === 'deposit') return 1;
    if (assetDef.kind === 'usd_etf') return +((Number(mRow[assetDef.field]) || 1) * (Number(mRow.usd) || 3.41)).toFixed(4);
    return Math.max(0.001, Number(mRow[assetDef.field]) || 1);
  }

  function createFreshArena() {
    const pack = getHistoryPack();
    const m0 = pack.months[0] || { usd: 3.41, gramGoldTL: 140.39, bimas: 8.91, froto: 1.59 };
    const startCash = 10000; // Kasım 2016'da 10.000 TL (~2.932 Dolar veya 100 haftalık mutfak filesi!)
    return {
      idx: 0,
      playing: false,
      speedMs: 3800, // Varsayılan Akıcı hız: her ay ~3.8 sn -> 120 ay ~7.6 dk (Sakin: 10sn/ay = 20 dk, Hızlı: 1.1sn/ay)
      cumCpiFactor: 1.0,
      monthlySalaryBaseTL: 450, // Kasım 2016'da her ay kenara ayrılan ~450 TL (enflasyonla her yıl güncellenir)
      totalContributedRealFiles: 100.0, // Başlangıç 100 mutfak filesi + maaş eklemelerinin gerçek file karşılığı
      cashTL: startCash,
      sukukTL: 0,
      depositTL: 0,
      debtTL: 0,
      units: {},
      tradeCount: 0,
      churnFrictionRealFiles: 0,
      panicSalesCount: 0,
      fomoManiaBuysCount: 0,
      marginCallTriggeredCount: 0,
      peakRealFiles: 100.0,
      maxRealDrawdownPct: 0,
      // "Hiç Kıpırdamayan Sabırlı Usta" kıyas sepeti (%40 Gram Altın + %30 BIMAS + %30 FROTO + Maaş katkıları)
      passiveUnits: {
        gold: (startCash * 0.40) / (m0.gramGoldTL || 140.39),
        bimas: (startCash * 0.30) / (m0.bimas || 8.91),
        froto: (startCash * 0.30) / (m0.froto || 1.59)
      },
      historyCurve: [{ ym: m0.ym || '2016-11', userFiles: 100, passiveFiles: 100, idleCashFiles: 100 }],
      idleOnlyFiles: 100.0,
      eventLog: [
        'Kasım 2016: Cebinde 10.000 ₺ (tam 100 haftalık mutfak filesi veya 8.000 ekmek parası) ile 10 yıllık yolculuk başladı.'
      ]
    };
  }

  function computeArenaValuation() {
    const pack = getHistoryPack();
    const mRow = pack.months[arena.idx] || pack.months[0];
    if (!mRow) return { grossTL: 10000, netTL: 10000, realFiles: 100, passiveFiles: 100, loafCount: 8000, debtRatioPct: 0 };

    let spotTL = 0;
    for (const a of ARENA_ASSETS) {
      const q = Number(arena.units[a.id]) || 0;
      if (q > 0) {
        spotTL += q * getUnitPriceTL(a, mRow);
      }
    }
    const grossAssetsTL = arena.cashTL + arena.sukukTL + arena.depositTL + spotTL;
    const netWorthTL = Math.max(0, grossAssetsTL - arena.debtTL);

    // Kasım 2016'da 1 mutfak filesi = 100 TL, 1 ekmek = 1.25 TL; her ay TÜİK cpiMoM ile pahalanır
    const currentFilePriceTL = 100 * arena.cumCpiFactor;
    const currentBreadPriceTL = 1.25 * arena.cumCpiFactor;
    const realFiles = +(netWorthTL / currentFilePriceTL).toFixed(1);
    const loafCount = Math.round(netWorthTL / currentBreadPriceTL);
    const idleLoafCount = Math.round((arena.idleOnlyFiles * currentFilePriceTL) / currentBreadPriceTL);

    const passiveGrossTL =
      (arena.passiveUnits.gold * (mRow.gramGoldTL || 140.39)) +
      (arena.passiveUnits.bimas * (mRow.bimas || 8.91)) +
      (arena.passiveUnits.froto * (mRow.froto || 1.59));
    const passiveFiles = +(passiveGrossTL / currentFilePriceTL).toFixed(1);

    const debtRatioPct = grossAssetsTL > 0 ? +((arena.debtTL / grossAssetsTL) * 100).toFixed(1) : 0;

    return {
      mRow,
      grossAssetsTL: +grossAssetsTL.toFixed(2),
      netWorthTL: +netWorthTL.toFixed(2),
      currentFilePriceTL: +currentFilePriceTL.toFixed(2),
      currentBreadPriceTL: +currentBreadPriceTL.toFixed(2),
      realFiles,
      passiveFiles,
      loafCount,
      idleLoafCount,
      debtRatioPct
    };
  }

  function stepOneMonth() {
    const pack = getHistoryPack();
    if (!arena || arena.idx >= pack.months.length - 1) {
      stopPlayback();
      finalizeArenaMilestone();
      renderArena();
      return;
    }

    arena.idx += 1;
    const mRow = pack.months[arena.idx];
    const cpiMoM = (Number(mRow.cpiMoM) || 0) / 100;
    arena.cumCpiFactor = arena.cumCpiFactor * (1 + cpiMoM);
    const currentFilePriceTL = 100 * arena.cumCpiFactor;

    // 1) Vadeli Mevduat (Stopajlı) & Sukuk (%0 Stopajlı) Aylık Getiri İşlemesi
    if (arena.depositTL > 0) {
      const depNetMo = ((Number(mRow.depGross) || 12) * (1 - (Number(mRow.stopaj) || 15) / 100)) / 1200;
      arena.depositTL = +(arena.depositTL * (1 + depNetMo)).toFixed(2);
    }
    if (arena.sukukTL > 0) {
      const sukNetMo = (Number(mRow.sukukGross) || 12) / 1200;
      arena.sukukTL = +(arena.sukukTL * (1 + sukNetMo)).toFixed(2);
    }

    // 2) Borç / Kredi Yükü Faizi (Politika faizi + %9 ticari kredi marjı her ay omuzlarına biner!)
    if (arena.debtTL > 0) {
      const loanAnnualPct = (Number(mRow.policy) || 15) + 9.0;
      const interestTL = +(arena.debtTL * (loanAnnualPct / 1200)).toFixed(2);
      arena.debtTL = +(arena.debtTL + interestTL).toFixed(2);
    }

    // 3) Gerçek Aylık Maaş Tasarrufu Girişi (Enflasyonla yılda iki kez Ocak ve Temmuz'da güncellenir)
    const salaryNominalTL = +(arena.monthlySalaryBaseTL * arena.cumCpiFactor).toFixed(2);
    arena.cashTL = +(arena.cashTL + salaryNominalTL).toFixed(2);
    const addedFiles = salaryNominalTL / currentFilePriceTL;
    arena.totalContributedRealFiles = +(arena.totalContributedRealFiles + addedFiles).toFixed(1);

    // Sabırlı Usta sepetine ve "Sadece Nakitte Kalan" kıyas sepetine de aynı maaş tasarrufu girer (adil elma-elma kıyas!)
    arena.passiveUnits.gold += (salaryNominalTL * 0.40) / (mRow.gramGoldTL || 1);
    arena.passiveUnits.bimas += (salaryNominalTL * 0.30) / (mRow.bimas || 1);
    arena.passiveUnits.froto += (salaryNominalTL * 0.30) / (mRow.froto || 1);
    arena.idleOnlyFiles = +((arena.idleOnlyFiles / (1 + cpiMoM)) + addedFiles).toFixed(1);

    // 4) Boyundan Büyük Borçta Zorunlu Tasfiye (Margin Call — LTV >= %65 Olduğunda Fırtına Dibinde Malın Satılır!)
    let val = computeArenaValuation();
    if (val.debtRatioPct >= 65 && arena.debtTL > 0) {
      arena.marginCallTriggeredCount += 1;
      // Borcu kapatmak için eldeki tüm varlıkların yarısı fırtına makasıyla zorla satılır!
      let raisedTL = 0;
      for (const a of ARENA_ASSETS) {
        const q = Number(arena.units[a.id]) || 0;
        if (q > 0) {
          const sellQ = q * 0.6;
          arena.units[a.id] = +(q - sellQ).toFixed(6);
          raisedTL += sellQ * getUnitPriceTL(a, mRow) * 0.96;
        }
      }
      const paydown = Math.min(arena.debtTL, raisedTL + arena.cashTL * 0.8);
      arena.cashTL = Math.max(0, +(arena.cashTL + raisedTL - paydown).toFixed(2));
      arena.debtTL = Math.max(0, +(arena.debtTL - paydown).toFixed(2));
      arena.eventLog.unshift(`${mRow.ym} — UYKUSUZ GECE (Zorunlu Tasfiye): Borç yükün kilerinin %65'ini aştığı için banka varlıklarını fırtına dibinden zorla sattı!`);
      val = computeArenaValuation();
    }

    // Zirve ve Fırtına Sarsıntısı (Max Real Drawdown) Takibi
    if (val.realFiles > arena.peakRealFiles) arena.peakRealFiles = val.realFiles;
    const ddPct = arena.peakRealFiles > 0
      ? +(((val.realFiles - arena.peakRealFiles) / arena.peakRealFiles) * 100).toFixed(1)
      : 0;
    if (ddPct < arena.maxRealDrawdownPct) arena.maxRealDrawdownPct = ddPct;

    arena.historyCurve.push({
      ym: mRow.ym,
      userFiles: val.realFiles,
      passiveFiles: val.passiveFiles,
      idleCashFiles: arena.idleOnlyFiles
    });

    const ev = pack.eventsByYm[mRow.ym];
    if (ev) {
      arena.eventLog.unshift(`${mRow.ym} — ${ev.kitchenGauge}`);
      if (arena.eventLog.length > 18) arena.eventLog.length = 18;
    }

    if (arena.idx >= 12) {
      finalizeArenaMilestone();
    }
    if (arena.idx >= pack.months.length - 1) {
      stopPlayback();
    }
    renderArena();
  }

  function finalizeArenaMilestone() {
    const val = computeArenaValuation();
    if (global.AetherKernelV10) {
      global.AetherKernelV10.recordArenaCompletion({
        ymReached: val.mRow?.ym || '2026-11',
        realFiles: val.realFiles,
        passiveFiles: val.passiveFiles,
        maxRealDrawdownPct: arena.maxRealDrawdownPct,
        tradeCount: arena.tradeCount
      });
    }
  }

  function tradeInArena(assetId, action, portion = 0.25) {
    const pack = getHistoryPack();
    const mRow = pack.months[arena.idx];
    const asset = ARENA_ASSETS.find((a) => a.id === assetId);
    if (!asset || !mRow) return;

    const ev = pack.eventsByYm[mRow.ym] || null;
    const stormSpreadExtra = (ev && ev.nightSpreadPct && (asset.id === 'usdCash' || asset.id === 'gramGold' || asset.id === 'gramSilver'))
      ? (ev.nightSpreadPct / 2)
      : (asset.spreadPct / 2);

    const currentFilePriceTL = 100 * arena.cumCpiFactor;

    if (action === 'BUY') {
      const spendTL = +(arena.cashTL * portion).toFixed(2);
      if (spendTL < 20) return;
      arena.cashTL = +(arena.cashTL - spendTL).toFixed(2);
      arena.tradeCount += 1;

      const frictionTL = +(spendTL * (stormSpreadExtra / 100)).toFixed(2);
      arena.churnFrictionRealFiles = +(arena.churnFrictionRealFiles + (frictionTL / currentFilePriceTL)).toFixed(2);
      const netTL = Math.max(0, spendTL - frictionTL);

      if (asset.kind === 'sukuk') {
        arena.sukukTL = +(arena.sukukTL + netTL).toFixed(2);
      } else if (asset.kind === 'deposit') {
        arena.depositTL = +(arena.depositTL + netTL).toFixed(2);
      } else {
        const unitTL = getUnitPriceTL(asset, mRow);
        const addQ = netTL / unitTL;
        arena.units[asset.id] = +((Number(arena.units[asset.id]) || 0) + addQ).toFixed(6);
      }

      // SASA Kasım 2022 veya Aralık 2021 Kur Zirvesi Sürü Hücumu Tespiti
      if ((asset.id === 'sasa' && mRow.ym >= '2022-09' && mRow.ym <= '2023-05') || (asset.id === 'usdCash' && mRow.ym === '2021-12')) {
        arena.fomoManiaBuysCount += 1;
        arena.eventLog.unshift(`${mRow.ym} — Sürü Coşkusu Notu: Herkesin konuştuğu zirve ayında ${asset.name} aldın; bakalım gelecek aylar ne gösterecek.`);
      }
    } else if (action === 'SELL') {
      arena.tradeCount += 1;
      if (asset.kind === 'sukuk' && arena.sukukTL > 0) {
        const take = +(arena.sukukTL * portion).toFixed(2);
        arena.sukukTL = +(arena.sukukTL - take).toFixed(2);
        arena.cashTL = +(arena.cashTL + take).toFixed(2);
      } else if (asset.kind === 'deposit' && arena.depositTL > 0) {
        // Erken bozulan mevduatta 1 aylık faiz yanması sürtünmesi
        const take = +(arena.depositTL * portion).toFixed(2);
        const penalty = +(take * 0.018).toFixed(2);
        arena.depositTL = +(arena.depositTL - take).toFixed(2);
        arena.cashTL = +(arena.cashTL + take - penalty).toFixed(2);
        arena.churnFrictionRealFiles = +(arena.churnFrictionRealFiles + (penalty / currentFilePriceTL)).toFixed(2);
      } else {
        const curQ = Number(arena.units[asset.id]) || 0;
        if (curQ <= 0) return;
        const sellQ = curQ * portion;
        const grossTL = sellQ * getUnitPriceTL(asset, mRow);
        const frictionTL = +(grossTL * (stormSpreadExtra / 100)).toFixed(2);
        arena.churnFrictionRealFiles = +(arena.churnFrictionRealFiles + (frictionTL / currentFilePriceTL)).toFixed(2);
        arena.units[asset.id] = +(curQ - sellQ).toFixed(6);
        if (arena.units[asset.id] < 0.00001) delete arena.units[asset.id];
        arena.cashTL = +(arena.cashTL + grossTL - frictionTL).toFixed(2);

        if (ev && ev.type === 'storm') {
          arena.panicSalesCount += 1;
          arena.eventLog.unshift(`${mRow.ym} — Fırtınada Satış İzi: Ortalık karışıkken ${asset.name} elden çıkarıldı.`);
        }
      }
    }
    renderArena();
  }

  function adjustArenaDebt(action) {
    const val = computeArenaValuation();
    const stepDebt = +(5000 * arena.cumCpiFactor * 0.25).toFixed(0);
    if (action === 'BORROW') {
      if (val.debtRatioPct >= 50) return;
      arena.debtTL = +(arena.debtTL + stepDebt).toFixed(2);
      arena.cashTL = +(arena.cashTL + stepDebt).toFixed(2);
      arena.eventLog.unshift(`${val.mRow.ym} — Omuzlarına ${Math.round(stepDebt).toLocaleString('tr-TR')} ₺ borç yükü aldın (Yıllık faizi her ay kasandan kesilecek).`);
    } else if (action === 'REPAY' && arena.debtTL > 0 && arena.cashTL > 0) {
      const pay = Math.min(arena.debtTL, arena.cashTL);
      arena.debtTL = +(arena.debtTL - pay).toFixed(2);
      arena.cashTL = +(arena.cashTL - pay).toFixed(2);
      arena.eventLog.unshift(`${val.mRow.ym} — ${Math.round(pay).toLocaleString('tr-TR')} ₺ borç kapatıldı; omuzlarındaki yük hafifledi.`);
    }
    renderArena();
  }

  function startPlayback(speedMs) {
    if (speedMs) arena.speedMs = speedMs;
    stopPlayback();
    arena.playing = true;
    timerId = setInterval(stepOneMonth, arena.speedMs);
    renderArena();
  }

  function stopPlayback() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    if (arena) arena.playing = false;
  }

  function buildCurveSvg() {
    const pts = arena.historyCurve || [];
    if (pts.length < 2) return '';
    const w = 640;
    const h = 130;
    const maxV = Math.max(140, ...pts.map((p) => Math.max(p.userFiles, p.passiveFiles, p.idleCashFiles)));
    const toXY = (i, val) => {
      const x = 16 + (i / 120) * (w - 32);
      const y = h - 16 - (Math.min(maxV, Math.max(0, val)) / maxV) * (h - 32);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    };
    const userLine = pts.map((p, i) => toXY(i, p.userFiles)).join(' ');
    const passLine = pts.map((p, i) => toXY(i, p.passiveFiles)).join(' ');
    const idleLine = pts.map((p, i) => toXY(i, p.idleCashFiles)).join(' ');

    return `
      <svg viewBox="0 0 ${w} ${h}" class="v10-arena-svg" preserveAspectRatio="none">
        <polyline fill="none" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4 4" points="${idleLine}" />
        <polyline fill="none" stroke="#64748b" stroke-width="2" points="${passLine}" />
        <polyline fill="none" stroke="#0f766e" stroke-width="3" points="${userLine}" />
      </svg>
      <div class="v10-curve-legend">
        <span class="leg-user">Senin Kilerin (${pts[pts.length - 1].userFiles} File)</span>
        <span class="leg-pass">Hiç Kıpırdamayan Sabırlı Sepet (${pts[pts.length - 1].passiveFiles} File)</span>
        <span class="leg-idle">Boş Nakitte Bekleyen (${pts[pts.length - 1].idleCashFiles} File — Eridi!)</span>
      </div>
    `;
  }

  function renderArena() {
    if (!hostContainer) return;
    if (!arena) arena = createFreshArena();
    const pack = getHistoryPack();
    const blindMode = global.AetherKernelV10?.getState()?.blindMode;
    const val = computeArenaValuation();
    const mRow = val.mRow;
    const ev = pack.eventsByYm[mRow.ym] || null;
    const pctDone = Math.round((arena.idx / 120) * 100);

    // Boşta bekleyen TL'nin erime görseli (Başlangıç 100 TL paranın alım gücü %6,5'e kadar küçülür!)
    const coinPurchasingPct = Math.max(6, Math.round((1 / arena.cumCpiFactor) * 100));

    hostContainer.innerHTML = `
      <section class="v10-arena-top">
        <div class="v10-arena-header">
          <div>
            <div class="v10-eyebrow">Bisiklet Sahası · Gerçek 120 Ay (${escapeHtml(mRow.ym)} · ${arena.idx}/120 Ay)</div>
            <h2 class="v10-sec-title">10 Yıllık Türkiye Zaman Tüneli (Kasım 2016 – Kasım 2026)</h2>
            <p class="v10-sec-sub">Uydurma senaryo yok: 2018 kur şoku, 2020 pandemi, 2021 20 Aralık gecesi, 2022 SASA sürü hücumu ve %50 faiz dönemi birebir gerçek fiyatlarla akıyor.</p>
          </div>
          <div class="v10-arena-controls">
            ${arena.playing
              ? `<button type="button" class="v10-btn-danger" id="btnArenaPause">Duraklat</button>`
              : `<button type="button" class="v10-btn-primary" id="btnArenaPlayFlow">Akıcı Başlat (4 sn/ay)</button>`}
            <button type="button" class="v10-pill ${arena.playing && arena.speedMs >= 9000 ? 'active' : ''}" id="btnArenaCalm">Sakin (10 sn/ay)</button>
            <button type="button" class="v10-pill ${arena.playing && arena.speedMs <= 1500 ? 'active' : ''}" id="btnArenaFast">Hızlı Sar (1 sn/ay)</button>
            <button type="button" class="v10-pill" id="btnArenaStep1">+1 Ay İlerle</button>
            <button type="button" class="v10-pill ${blindMode ? 'active-amber' : ''}" id="btnArenaBlind">${blindMode ? 'İsimsiz Mod: AÇIK' : 'İsimsiz Esnaf Modu'}</button>
            <button type="button" class="v10-link-btn" id="btnArenaReset">Baştan Başla</button>
          </div>
        </div>

        <div class="v10-progress-track">
          <div class="v10-progress-fill" style="width:${pctDone}%"></div>
        </div>

        <div class="v10-pantry-hud">
          <div class="v10-hud-card highlight">
            <span>Gerçek Kiler Gücün (Enflasyondan Arındırılmış)</span>
            <strong>${val.realFiles} Mutfak Filesi</strong>
            <small>Ekmek karşılığı: ${val.loafCount.toLocaleString('tr-TR')} somun (Toplam nominal: ${Math.round(val.netWorthTL).toLocaleString('tr-TR')} ₺)</small>
          </div>
          <div class="v10-hud-card">
            <span>Sabırlı Usta vs. Senin Hamlelerin</span>
            <strong>${val.passiveFiles} File (Sabırlı) · ${arena.tradeCount} İşlem</strong>
            <small>Al-sat ve makas sürtünmesine giden: ${arena.churnFrictionRealFiles} File · En sert sarsıntı: %${arena.maxRealDrawdownPct}</small>
          </div>
          <div class="v10-hud-card melt">
            <span>2016'daki Boş 100 ₺ Banknotun Bugünkü Boyutu</span>
            <div class="v10-melting-bar-wrap">
              <div class="v10-melting-bar" style="width:${coinPurchasingPct}%">%${coinPurchasingPct}</div>
            </div>
            <small>1 Mutfak Filesi: 100 ₺ -> <strong>${val.currentFilePriceTL.toLocaleString('tr-TR')} ₺</strong> (${arena.cumCpiFactor.toFixed(2)} kat enflasyon)</small>
          </div>
          <div class="v10-hud-card ${arena.debtTL > 0 ? 'debt-active' : ''}">
            <span>Omuzlardaki Borç Baskısı (Kredili Yük)</span>
            <strong>${Math.round(arena.debtTL).toLocaleString('tr-TR')} ₺ (%${val.debtRatioPct})</strong>
            <div class="v10-debt-btns">
              <button type="button" class="v10-pill" id="btnBorrowArena">Borç Yüklen</button>
              ${arena.debtTL > 0 ? `<button type="button" class="v10-pill active" id="btnRepayArena">Borcu Kapat</button>` : ''}
            </div>
          </div>
        </div>

        <div class="v10-signal-vs-news">
          <div class="v10-signal-pane">
            <div class="v10-pane-tag">ÖNCÜ SAHA & HAMMADDE GÖSTERGESİ (Manşetten Önce Döner)</div>
            <p><strong>${ev ? escapeHtml(ev.kitchenGauge) : `Brent Ham Petrol Endeksi: ${mRow.bnoUsd}$ · Tarım Sepeti: ${mRow.dbaUsd}$ · Merkez Politika Faizi: %${mRow.policy} · Dolar: ${mRow.usd} ₺`}</strong></p>
            ${ev?.seasonHint ? `<small>${escapeHtml(ev.seasonHint)}</small>` : `<small>Boşta kalan nakit bu ay %${mRow.cpiMoM} eridi; vadeli mevduat brüt %${mRow.depGross}, Sukuk %${mRow.sukukGross} çalışıyor.</small>`}
          </div>
          <div class="v10-news-pane ${ev?.rumorTrap ? 'trap' : ''}">
            <div class="v10-pane-tag">DIŞARIDAKİ GÜRÜLTÜ, GAZETE MANŞETİ & DEDİKODU</div>
            <p>${ev ? escapeHtml(ev.lateHeadline) : 'Gazetelerde olağan gündem; kahvehanede kısa yoldan köşe dönme sohbetleri sürüyor.'}</p>
            ${ev?.rumorTrap ? `<div class="v10-rumor-box">${escapeHtml(ev.rumorTrap)}</div>` : ''}
          </div>
        </div>

        ${buildCurveSvg()}
      </section>

      <section class="v10-arena-board">
        <div class="v10-arena-cashbar">
          <span>Kullanılabilir Boş Nakit: <strong>${Math.round(arena.cashTL).toLocaleString('tr-TR')} ₺</strong> (${(arena.cashTL / val.currentFilePriceTL).toFixed(1)} File)</span>
          <span>Her tıklama boş naktin %25'iyle alım yapar veya o varlığın yarısını satar.</span>
        </div>

        <div class="v10-arena-grid">
          ${ARENA_ASSETS.map((a) => {
            const clueObj = pack.blindClues[a.id] || { blindTitle: a.name, clue: a.group };
            const title = blindMode ? clueObj.blindTitle : a.name;
            const unitTL = getUnitPriceTL(a, mRow);
            let heldTL = 0;
            if (a.kind === 'sukuk') heldTL = arena.sukukTL;
            else if (a.kind === 'deposit') heldTL = arena.depositTL;
            else heldTL = (Number(arena.units[a.id]) || 0) * unitTL;
            const heldFiles = +(heldTL / val.currentFilePriceTL).toFixed(1);

            const priceDisplay = a.kind === 'sukuk'
              ? `Yıllık %${mRow.sukukGross} (%0 Vergi)`
              : (a.kind === 'deposit' ? `Yıllık %${mRow.depGross} (%${mRow.stopaj} Stopaj)` : `${unitTL.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺`);

            return `
              <div class="v10-arena-card ${heldTL > 1 ? 'held' : ''}">
                <div class="v10-shop-top">
                  <span class="v10-shop-badge">${escapeHtml(a.group)}</span>
                  <strong class="v10-arena-price">${blindMode && a.kind !== 'sukuk' && a.kind !== 'deposit' ? 'Fiyat Gizli' : priceDisplay}</strong>
                </div>
                <h4>${escapeHtml(title)}</h4>
                <p class="v10-arena-clue">${escapeHtml(clueObj.clue)}</p>
                <div class="v10-arena-holdline">
                  <span>Kilerdeki Payın: <strong>${heldTL > 1 ? `${heldFiles} File (${Math.round(heldTL).toLocaleString('tr-TR')} ₺)` : 'Yok'}</strong></span>
                </div>
                <div class="v10-arena-actions">
                  <button type="button" class="v10-btn-primary sm" data-abuy="${a.id}">Naktin %25'iyle Al</button>
                  ${heldTL > 1 ? `<button type="button" class="v10-btn-ghost sm" data-asell="${a.id}">Yarısını Sat</button>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="v10-arena-log">
          <strong>Yolculuk Defteri (Kararlarının ve Fırtınaların İzi)</strong>
          <ul>
            ${arena.eventLog.slice(0, 6).map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
          </ul>
        </div>
      </section>
    `;

    document.getElementById('btnArenaPlayFlow')?.addEventListener('click', () => startPlayback(3800));
    document.getElementById('btnArenaCalm')?.addEventListener('click', () => startPlayback(10000));
    document.getElementById('btnArenaFast')?.addEventListener('click', () => startPlayback(1100));
    document.getElementById('btnArenaPause')?.addEventListener('click', () => { stopPlayback(); renderArena(); });
    document.getElementById('btnArenaStep1')?.addEventListener('click', () => { stopPlayback(); stepOneMonth(); });
    document.getElementById('btnArenaBlind')?.addEventListener('click', () => {
      global.AetherKernelV10?.toggleBlindMode();
      renderArena();
    });
    document.getElementById('btnArenaReset')?.addEventListener('click', () => {
      stopPlayback();
      arena = createFreshArena();
      renderArena();
    });
    document.getElementById('btnBorrowArena')?.addEventListener('click', () => adjustArenaDebt('BORROW'));
    document.getElementById('btnRepayArena')?.addEventListener('click', () => adjustArenaDebt('REPAY'));

    hostContainer.querySelectorAll('[data-abuy]').forEach((btn) => {
      btn.addEventListener('click', () => tradeInArena(btn.getAttribute('data-abuy'), 'BUY', 0.25));
    });
    hostContainer.querySelectorAll('[data-asell]').forEach((btn) => {
      btn.addEventListener('click', () => tradeInArena(btn.getAttribute('data-asell'), 'SELL', 0.50));
    });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  global.AetherArena120mV10 = {
    mount(el) {
      hostContainer = el;
      if (!arena) arena = createFreshArena();
      renderArena();
    },
    unmount() {
      stopPlayback();
    },
    stepOneMonth,
    getState: () => arena
  };
})(typeof window !== 'undefined' ? window : globalThis);
