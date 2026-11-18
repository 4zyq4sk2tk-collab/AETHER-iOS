// ============================================================================
// AETHER — 10 YILLIK HIZLANDIRILMIŞ EV VE MEMLEKET YOLCULUĞU (KASIM 2016 – KASIM 2026)
// window.DecadeLifeJourney · 120 Gerçek Ay · Yaşayan Kiler, Mevsimler, İki Kulak ve Hafıza Aynası
// Sıfır Ticker Ezberi (Yalın Hayat Modu) + Tek Dokunuşla Gerçek İsimleri Açma (Usta Modu)
// ============================================================================
(function (global) {
  'use strict';

  const STYLE_ELEMENT_ID = 'dlj-scoped-styles-v1';

  // Gerçek Türkiye fırtına ayları (gökyüzü kararır, şimşek çakar, gece makası açılır)
  const STORM_MONTHS = new Set([
    '2018-08',
    '2020-03',
    '2021-03',
    '2021-12',
    '2023-02'
  ]);

  const MONTH_NAMES_TR = [
    '', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // 4 Yaşam Kapısı (14'lü borsa kartı tablosu yerine evden çıkıp uğranan gerçek hayat durakları)
  const QUARTERS = [
    {
      id: 'shields',
      noviceLabel: 'Evin Kalkanları ve Kasa',
      masterLabel: 'Kalkanlar (Altın · Sukuk · Mevduat · Döviz)',
      subtitle: 'Mutfak masasında eriyen nakdi koruyan sağlam çekmece ve kira kalkanları'
    },
    {
      id: 'daily_port',
      noviceLabel: 'Mahalle Kasası ve Liman',
      masterLabel: 'Nakit Akışı ve İhracat (BIMAS · FROTO · THYAO)',
      subtitle: 'Her gün peşin ürün satan market kasası, ihracat limanı ve gökyüzü filosu'
    },
    {
      id: 'heavy_global',
      noviceLabel: 'Ağır Ocaklar ve Dünya',
      masterLabel: 'Sanayi, Savunma ve Küresel (TUPRS · EREGL · ASELS · SPY)',
      subtitle: 'Rafineri kazanları, çelik ocakları, mühendislik atölyesi ve dünya devleri'
    },
    {
      id: 'crowd_shortcuts',
      noviceLabel: 'Söylenti Kapısı ve Kredi Yükü',
      masterLabel: 'Kalabalık Tuzakları ve Kaldıraç (EKGYO · SASA · Kredi)',
      subtitle: 'Kahvehanede konuşulan kestirme kapılar ve çatıya binen banka borcu'
    }
  ];

  // Sıfır-jargon gerçek hayat yerleri ve tek dokunuşla açılan gerçek şirket/varlık kimlikleri
  const PLACES = [
    {
      id: 'gramGold',
      quarter: 'shields',
      kind: 'spot',
      field: 'gramGoldTL',
      spreadPct: 0.45,
      stormSpread: true,
      icon: 'ingot',
      noviceName: 'Sarrafın Paslanmaz Sarı Külçesi',
      masterName: 'Gram Altın (Fiziki Külçe)',
      masterCode: 'Gram Altın',
      realLifeRole: 'Merkez bankaları basamaz, paslanmaz, kimsenin borç kağıdı değildir. Para bolluğunda ve mutfak yangınında çekmecede sessizce ağırlaşır; fırtına gecelerinde alım-satım makası açılır.'
    },
    {
      id: 'sukuk',
      quarter: 'shields',
      kind: 'sukuk',
      field: null,
      spreadPct: 0,
      stormSpread: false,
      icon: 'arch',
      noviceName: 'Devletin Kesintisiz Kira Kalkanı',
      masterName: 'Sukuk · Hazine Kira Sertifikası (%0 Stopaj)',
      masterCode: 'Sukuk',
      realLifeRole: 'Kamu varlıklarının kira gelirine dayanan kesintisiz kalkandır. Vergi kesintisi yapılmaz ve vadeden önce bozma cezası yoktur; ancak kira oranı mutfak pahalılığının altında kalırsa alım gücü geriler.'
    },
    {
      id: 'deposit',
      quarter: 'shields',
      kind: 'deposit',
      field: null,
      spreadPct: 0,
      stormSpread: false,
      icon: 'jar',
      noviceName: 'Bankanın Kesintili Vade Kavanozu',
      masterName: 'Mevduat · Banka Vadeli TL Hesabı (Stopajlı)',
      masterCode: 'Mevduat',
      realLifeRole: 'Anaparan kağıt üzerinde hiç azalmaz ama her ay brüt getiriden vergi kesintisi düşülür; süresinden önce çözersen birikmiş getirinin bir kısmı yanar.'
    },
    {
      id: 'usdCash',
      quarter: 'shields',
      kind: 'spot',
      field: 'usd',
      spreadPct: 0.60,
      stormSpread: true,
      icon: 'note',
      noviceName: 'Döviz Bürosunun Yeşil Banknotu',
      masterName: 'Nakit Amerikan Doları (USD)',
      masterCode: 'USD',
      realLifeRole: 'Fırtına gecelerinde herkes kapısında kuyruk olur ve gece makası sert açılır; fakat fabrika gibi üretim yapmadığı için kendi enflasyonu yüzünden uzun yıllarda mutfak filesine karşı yorulur.'
    },
    {
      id: 'bimas',
      quarter: 'daily_port',
      kind: 'bist',
      field: 'bimas',
      spreadPct: 0.12,
      stormSpread: false,
      icon: 'market',
      noviceName: '81 İlde Peşin Çalışan Mahalle Marketi',
      masterName: 'BIMAS · BİM Birleşik Mağazalar',
      masterCode: 'BIMAS',
      realLifeRole: 'Her sokakta un, yağ ve süt satar. Müşteriden parayı peşin alır, toptancıya vadeli öder; mutfak pahalılığı arttıkça raf etiketini anında güncelleyip kilerini korur.'
    },
    {
      id: 'froto',
      quarter: 'daily_port',
      kind: 'bist',
      field: 'froto',
      spreadPct: 0.12,
      stormSpread: false,
      icon: 'truck',
      noviceName: "Avrupa'ya Kamyon Gönderen Liman Fabrikası",
      masterName: 'FROTO · Ford Otosan İhracat Fabrikası',
      masterCode: 'FROTO',
      realLifeRole: 'Banttan indirdiği ticari araçların büyük bölümünü gemilerle Avrupa pazarına yabancı parayla gönderir; içeride işler yavaşlasa bile limandan döviz akışı sürer.'
    },
    {
      id: 'thyao',
      quarter: 'daily_port',
      kind: 'bist',
      field: 'thyao',
      spreadPct: 0.12,
      stormSpread: false,
      icon: 'plane',
      noviceName: 'Kıtalararası Uçak Filosu',
      masterName: 'THYAO · Türk Hava Yolları',
      masterCode: 'THYAO',
      realLifeRole: 'Biletini küresel parayla keser, yolcu ve kargo taşır. Salgın ve sınır kapanmalarında hangara çekilip sabrı sınar; gökyüzü açıldığında tüm zararını katlayarak telafi eder.'
    },
    {
      id: 'tuprs',
      quarter: 'heavy_global',
      kind: 'bist',
      field: 'tuprs',
      spreadPct: 0.12,
      stormSpread: false,
      icon: 'refinery',
      noviceName: 'İzmit Ham Petrol Rafinerisi',
      masterName: 'TUPRS · TÜPRAŞ Petrol Rafinerileri',
      masterCode: 'TUPRS',
      realLifeRole: 'Gemilerle gelen ham petrolü işleyip ülkenin traktörüne mazot, uçağına yakıt yapar. Enerji darboğazlarında ve yaz trafiğinde dev kazanları tam kapasite çalışır.'
    },
    {
      id: 'eregl',
      quarter: 'heavy_global',
      kind: 'bist',
      field: 'eregl',
      spreadPct: 0.12,
      stormSpread: false,
      icon: 'steel',
      noviceName: 'Karadeniz Çelik Ocağı',
      masterName: 'EREGL · Ereğli Demir ve Çelik',
      masterCode: 'EREGL',
      realLifeRole: 'Beyaz eşyadan otomobile kadar sanayinin ana çelik levhasını döker. Küresel üretim canlandığında güçlü nakit üretir; enerji pahalanıp sipariş yavaşladığında uzun süre dinlenir.'
    },
    {
      id: 'asels',
      quarter: 'heavy_global',
      kind: 'bist',
      field: 'asels',
      spreadPct: 0.12,
      stormSpread: false,
      icon: 'radar',
      noviceName: 'Ankara Radar ve Savunma Atölyesi',
      masterName: 'ASELS · ASELSAN Savunma Elektroniği',
      masterCode: 'ASELS',
      realLifeRole: 'Yıllara yayılan kesinleşmiş sipariş defteriyle radar, haberleşme ve güvenlik sistemleri üretir; mühendislik birikimi uzun vadede sabırlı ortağı ödüllendirir.'
    },
    {
      id: 'spy',
      quarter: 'heavy_global',
      kind: 'usd_etf',
      field: 'spyUsd',
      spreadPct: 0.20,
      stormSpread: false,
      icon: 'globe',
      noviceName: 'Dünya 500 Dev Şirket Ortaklığı',
      masterName: 'SPY · Dünya / ABD 500 Şirket Sepeti',
      masterCode: 'SPY',
      realLifeRole: 'Dünyanın en büyük teknoloji, sağlık ve üretim şirketlerine aynı anda ortak eder; hem döviz hem küresel üretim büyümesi taşır, satışta reel kazanç üzerinden vergi payı ayrılır.'
    },
    {
      id: 'ekgyo',
      quarter: 'crowd_shortcuts',
      kind: 'bist',
      field: 'ekgyo',
      spreadPct: 0.15,
      stormSpread: false,
      icon: 'brick',
      noviceName: 'Ucuz Görünen Arsa/İnşaat Ortaklığı',
      masterName: 'EKGYO · Emlak Konut GYO',
      masterCode: 'EKGYO',
      realLifeRole: "Dışarıdan 'fiyatı çok ucuz kaldı, arsa kaybettirmez' diye konuşulur; ancak kredi maliyetleri ve inşaat demiri pahalandığında yıllarca mutfak pahalılığının gerisinde kalabilir."
    },
    {
      id: 'sasa',
      quarter: 'crowd_shortcuts',
      kind: 'bist',
      field: 'sasa',
      spreadPct: 0.18,
      stormSpread: false,
      icon: 'spool',
      noviceName: 'Herkesin Koştuğu Dev Elyaf Fabrikası',
      masterName: 'SASA · SASA Polyester Sanayi',
      masterCode: 'SASA',
      realLifeRole: 'Büyük üretim tesisleri kurar; fakat berberden kahvehaneye herkes aynı anda kapısına yığılıp 20 yıllık kazancını peşin fiyatladığında, tepeden gireni yıllarca eriyen sandıklarla bekletir.'
    }
  ];

  const PLACE_MAP = new Map(PLACES.map((p) => [p.id, p]));

  // Modül durum değişkenleri
  let state = null;
  let hostEl = null;
  let els = null;
  let playTimerId = null;
  let rafId = null;
  let resizeObs = null;
  let onWinResize = null;
  let mountOpts = {};

  // 60fps Canvas animasyon parçacık ve yumuşatma (lerp) durumu
  const anim = {
    t: 0,
    lastTs: 0,
    stormAlpha: 0,
    lightningFlash: 0,
    roofShudder: 0,
    smoothLoaves: 6,
    smoothOil: 5,
    smoothSacks: 4,
    smoothBricks: 3,
    smoothBanknoteScale: 1.0,
    smoothCrates: 0,
    smoothDebtRatio: 0,
    smoothNeighborTree: 0.25,
    canvasNotice: 'Kasım 2016: Mutfak masasında 10.000 ₺ (tam 100 haftalık mutfak filesi) ile 10 yıllık ev yolculuğumuz başlıyor.',
    particles: Array.from({ length: 46 }, (_, i) => ({
      x: (i * 0.0217) % 1,
      y: (i * 0.0731) % 1,
      v: 0.18 + (i % 5) * 0.06,
      r: 1.4 + (i % 3) * 0.9,
      drift: (i % 2 === 0 ? 1 : -1) * (0.04 + (i % 4) * 0.015)
    })),
    smokePuffs: Array.from({ length: 9 }, (_, i) => ({
      phase: i / 9
    }))
  };

  // --------------------------------------------------------------------------
  // 1. VERİ SETİ & MEVSİM / FİYAT YARDIMCILARI
  // --------------------------------------------------------------------------
  function getHistoryPack() {
    const h = global.__AETHER_HISTORY_121M__;
    if (h && Array.isArray(h.months) && h.months.length > 0) return h;
    // Güvenli yedek (veri seti henüz yüklenmemişse çökmemesi için)
    return {
      months: [
        {
          ym: '2016-11', cpiMoM: 0, policy: 8, depGross: 10.8, stopaj: 15, sukukGross: 11.2,
          usd: 3.41, eur: 3.63, gramGoldTL: 140.39, gramSilverTL: 1.86, bnoUsd: 14.44, dbaUsd: 17.14,
          spyUsd: 188.2, xu100: 739.9, thyao: 4.7, bimas: 8.91, froto: 1.59, tuprs: 4.55,
          eregl: 1.26, asels: 2.65, ekgyo: 2.25, garan: 5.35, sasa: 0.015, sise: 2.42
        }
      ],
      eventsByYm: {},
      blindClues: {}
    };
  }

  function parseYm(ym) {
    const parts = String(ym || '2016-11').split('-');
    const year = Number(parts[0]) || 2016;
    const month = Number(parts[1]) || 11;
    return { year, month, label: `${MONTH_NAMES_TR[month] || 'Kasım'} ${year}` };
  }

  function getSeasonInfo(ym) {
    const { month } = parseYm(ym);
    if (month === 12 || month === 1 || month === 2) {
      return {
        id: 'winter',
        name: 'Kış',
        savingsMult: 0.78,
        householdNote: 'Kış soğuğu: Doğalgaz ve soba yakacağı faturası arttı; bu ay maaştan kilere ayrılan pay biraz daraldı.'
      };
    }
    if (month >= 3 && month <= 5) {
      return {
        id: 'spring',
        name: 'İlkbahar',
        savingsMult: 1.00,
        householdNote: 'İlkbahar yağmurları: Barajlar doluyor, tarlada ekim başladı; evin aylık tasarruf akışı dengeli.'
      };
    }
    if (month >= 6 && month <= 8) {
      return {
        id: 'summer',
        name: 'Yaz',
        savingsMult: 1.18,
        householdNote: 'Yaz bereketi: Tarlada hasat, gökyüzünde dolu uçaklar; yakacak faturası kalktığı için kilere daha çok pay ayrıldı.'
      };
    }
    return {
      id: 'autumn',
      name: 'Sonbahar',
      savingsMult: 0.95,
      householdNote: 'Sonbahar telaşı: Limandan ihracat gemileri kalkıyor; evde kışlık hazırlık ve okul giderleri var.'
    };
  }

  function getUnitPriceTL(place, mRow) {
    if (!place || !mRow) return 1;
    if (place.kind === 'sukuk' || place.kind === 'deposit') return 1;
    if (place.kind === 'usd_etf') {
      const usdP = Math.max(0.01, Number(mRow[place.field]) || 188.2);
      const fx = Math.max(0.01, Number(mRow.usd) || 3.41);
      return +(usdP * fx).toFixed(4);
    }
    return Math.max(0.0001, Number(mRow[place.field]) || 1);
  }

  function getEpochKeyByIdx(idx) {
    if (idx <= 36) return 'early';
    if (idx <= 84) return 'middle';
    return 'late';
  }

  // Yalın Hayat (Acemi) modunda metinlerdeki borsa kodlarını ve finans kısaltmalarını gerçek hayat diline çevirir
  function formatModeText(rawText, unmasked) {
    const str = String(rawText || '');
    if (unmasked || !str) return str;
    return str
      .replace(/\(TÜPRAŞ\)/g, '(ham petrol rafinerisi)')
      .replace(/TÜPRAŞ/g, 'İzmit Ham Petrol Rafinerisi')
      .replace(/\(THYAO[^)]*\)/g, '(uçak filosu payları dip seviyede!)')
      .replace(/THYAO/g, 'Kıtalararası Uçak Filosu')
      .replace(/\(BİM\)/g, '(mahalle marketi)')
      .replace(/BIMAS/g, 'mahalle marketi')
      .replace(/FROTO/g, 'liman kamyon fabrikası')
      .replace(/\(ASELSAN\)/g, '(savunma elektroniği atölyesi)')
      .replace(/ASELSAN|ASELS/g, 'savunma atölyesi')
      .replace(/Bir polyester hissesi \(SASA\)/g, 'Herkesin koştuğu dev elyaf fabrikası')
      .replace(/SASA hissesine/g, 'dev elyaf fabrikasına')
      .replace(/\(SASA\)|SASA/g, 'dev elyaf fabrikası')
      .replace(/gayrimenkul kağıtları \(GYO\)/g, 'ucuz görünen arsa/inşaat ortaklıkları')
      .replace(/\(GYO\)|EKGYO/g, 'arsa/inşaat ortaklığı')
      .replace(/Darphane altın sertifikası \(ALTIN\.S1\)/g, 'ekrandaki kağıt altın sertifikası')
      .replace(/ALTIN\.S1/g, 'kağıt altın sertifikası')
      .replace(/80 çarpan defter değerine/g, 'gerçek fabrika binalarının 80 katı fiyata')
      .replace(/serbest nakit akışı/g, 'kasaya giren gerçek nakdi')
      .replace(/TMS-29 enflasyon muhasebesi/g, 'gerçek enflasyon hesabı')
      .replace(/Enflasyon muhasebesi/g, 'Gerçek enflasyon hesabı')
      .replace(/Kambiyo Vergisi \(BSMV\)/g, 'gişe döviz kesintisi')
      .replace(/\bBSMV\b/g, 'gişe kesintisi')
      .replace(/Para Piyasası Fonları|\bPPF\b|Para Piyasası Fonu/g, 'günlük nakit havuzu')
      .replace(/Hazine Kira Sertifikası \(Sukuk\)|DİBS\/Sukuk|\bSukuk\b/g, 'Devletin Kesintisiz Kira Kalkanı')
      .replace(/TÜİK enflasyonu/g, 'resmi mutfak pahalılığı')
      .replace(/resmi TÜFE/g, 'resmi mutfak pahalılığı')
      .replace(/Borsa İstanbul'da|Borsa İstanbul/g, 'memleket tezgâhlarında')
      .replace(/yabancı takası/g, 'büyük dış ortaklar')
      .replace(/stopaj oranları/g, 'kazanç kesintisi oranları')
      .replace(/stopajlı/gi, 'kesintili')
      .replace(/\bstopajı\b|\bstopaj\b/gi, 'vergi kesintisi')
      .replace(/Kur Korumalı Mevduat/g, 'kur korumalı banka hesabı')
      .replace(/politika faizini|Politika faizi/g, 'Merkez borçlanma oranını')
      .replace(/baz puan/g, 'puan');
  }

  function createEpochBucket(label, rangeLabel) {
    return {
      label,
      rangeLabel,
      monthsObserved: 0,
      idleCashShareSum: 0,
      tradeCount: 0,
      panicSales: 0,
      calmStormBuys: 0,
      rumorChases: 0,
      highDebtMonths: 0,
      forcedLiquidations: 0,
      winterPreparedMonths: 0,
      churnLostFiles: 0,
      memorableMoments: []
    };
  }

  function pushMoment(epochObj, text) {
    if (!epochObj || !text) return;
    if (epochObj.memorableMoments.length < 4 && !epochObj.memorableMoments.includes(text)) {
      epochObj.memorableMoments.push(text);
    }
  }

  // --------------------------------------------------------------------------
  // 2. BAŞLANGIÇ DURUMU VE DEĞERLEME MOTORU
  // --------------------------------------------------------------------------
  function createFreshState(unmaskedDefault) {
    const pack = getHistoryPack();
    const m0 = pack.months[0];
    const startCashTL = 10000; // Kasım 2016: 10.000 TL = 100 Mutfak Filesi = 8.000 Somun Ekmek

    return {
      idx: 0,
      ym: m0.ym || '2016-11',
      playing: false,
      speedMs: 3200,
      unmasked: Boolean(unmaskedDefault),
      activeQuarter: 'shields',
      cumCpiFactor: 1.0,
      monthlyBaseSavingsTL: 450, // Kasım 2016 bazında aylık tasarruf (mevsim ve enflasyonla güncellenir)
      contributedRealFiles: 100.0,
      cashTL: startCashTL,
      sukukTL: 0,
      depositTL: 0,
      debtTL: 0,
      units: {},
      // Her varlık için reel maliyet ve sürü coşkusu kaydı (elde kalan sandık hesabı için)
      costLedger: {},
      residualManiaCrates: 0,
      tradeCount: 0,
      churnFrictionFiles: 0,
      panicSalesCount: 0,
      calmStormBuysCount: 0,
      rumorChasesCount: 0,
      forcedLiquidationsCount: 0,
      peakRealFiles: 100.0,
      maxRealDrawdownPct: 0,
      // Yan evdeki "Hiçbir Şey Yapmadan İşine Gücüne Bakan Sabırlı Komşu"
      neighborUnits: {
        gold: (startCashTL * 0.40) / Math.max(0.01, Number(m0.gramGoldTL) || 140.39),
        bimas: (startCashTL * 0.30) / Math.max(0.01, Number(m0.bimas) || 8.91),
        froto: (startCashTL * 0.30) / Math.max(0.01, Number(m0.froto) || 1.59)
      },
      idleOnlyFiles: 100.0,
      epochs: {
        early: createEpochBucket('İlk 3 Yıl (Acemilik ve İlk Sınavlar)', 'Kasım 2016 – Ekim 2019'),
        middle: createEpochBucket('Orta Yıllar (Büyük Fırtınalar ve Sürü Hücumu)', 'Kasım 2019 – Ekim 2023'),
        late: createEpochBucket('Son Yıllar (Sıkı Para ve Ustalık Dengesi)', 'Kasım 2023 – Kasım 2026')
      },
      diary: [
        {
          ym: m0.ym || '2016-11',
          kind: 'start',
          text: 'Kasım 2016: Mutfak masasında 10.000 ₺ (tam 100 haftalık mutfak filesi ya da 8.000 somun ekmek gücü) ile yolculuk başladı.'
        }
      ],
      historyCurve: [
        { ym: m0.ym || '2016-11', userFiles: 100.0, neighborFiles: 100.0, idleCashFiles: 100.0 }
      ]
    };
  }

  function isManiaWindowForPlace(placeId, mRow, idx, pack) {
    if (!mRow) return false;
    const ym = mRow.ym;
    if (placeId === 'sasa' && ym >= '2022-08' && ym <= '2023-08') return true;
    if ((placeId === 'usdCash' || placeId === 'gramGold') && (ym === '2021-11' || ym === '2021-12')) return true;
    if (placeId === 'ekgyo' && ((ym >= '2018-04' && ym <= '2018-07') || (ym >= '2022-11' && ym <= '2023-02'))) return true;
    // Son 3 ayda reel olarak %65 üzerinde şişmiş herhangi bir tezgâha tepeden atlama kontrolü
    if (idx >= 3) {
      const place = PLACE_MAP.get(placeId);
      const prev3 = pack.months[idx - 3];
      if (place && prev3 && place.kind !== 'sukuk' && place.kind !== 'deposit') {
        const pNow = getUnitPriceTL(place, mRow);
        const pOld = getUnitPriceTL(place, prev3);
        if (pOld > 0 && (pNow / pOld) >= 1.75) return true;
      }
    }
    return false;
  }

  function computeSpyTaxReserveTL(unitsQty, mRow) {
    if (!unitsQty || unitsQty <= 0 || !mRow) return 0;
    const ledger = state.costLedger.spy;
    if (!ledger) return 0;
    const spyPlace = PLACE_MAP.get('spy');
    const unitNowTL = getUnitPriceTL(spyPlace, mRow);
    const grossTL = unitsQty * unitNowTL;
    const avgEntryCpi = ledger.entryCpiWeighted || 1.0;
    const avgUnitCostTL = ledger.avgUnitCostTL || unitNowTL;
    const cpiRatio = avgEntryCpi > 0 ? (state.cumCpiFactor / avgEntryCpi) : 1.0;
    const indexedCostTL = (unitsQty * avgUnitCostTL) * (cpiRatio >= 1.10 ? cpiRatio : 1.0);
    const taxableRealGainTL = Math.max(0, grossTL - indexedCostTL);
    return +(taxableRealGainTL * 0.15).toFixed(2);
  }

  function evaluateHousehold() {
    const pack = getHistoryPack();
    const safeIdx = Math.min(Math.max(0, state.idx), pack.months.length - 1);
    const mRow = pack.months[safeIdx] || pack.months[0];
    const currentFilePriceTL = 100 * state.cumCpiFactor;
    const currentBreadPriceTL = 1.25 * state.cumCpiFactor;

    let spotGrossTL = 0;
    let spyTaxReserveTL = 0;
    const holdings = [];
    let maniaCratesRaw = 0;

    for (const p of PLACES) {
      let grossValTL = 0;
      let netValTL = 0;
      const q = Number(state.units[p.id]) || 0;

      if (p.kind === 'sukuk') {
        grossValTL = state.sukukTL;
        netValTL = state.sukukTL;
      } else if (p.kind === 'deposit') {
        grossValTL = state.depositTL;
        netValTL = state.depositTL;
      } else if (q > 0) {
        const uTL = getUnitPriceTL(p, mRow);
        grossValTL = q * uTL;
        if (p.id === 'spy') {
          const taxTL = computeSpyTaxReserveTL(q, mRow);
          spyTaxReserveTL += taxTL;
          netValTL = Math.max(0, grossValTL - taxTL);
        } else {
          netValTL = grossValTL;
        }
      }

      if (netValTL > 0.5) {
        const realFiles = netValTL / currentFilePriceTL;
        const ledger = state.costLedger[p.id];
        const investedFiles = ledger ? Math.max(0.01, Number(ledger.investedRealFiles) || realFiles) : realFiles;
        const realPnlFiles = realFiles - investedFiles;
        const realPnlPct = investedFiles > 0 ? ((realFiles / investedFiles) - 1) * 100 : 0;

        // Sürü coşkusu veya ucuzluk tuzağında eriyen pozisyonlar kapı önünde ahşap sandık biriktirir
        if ((ledger?.boughtInMania || p.id === 'sasa' || p.id === 'ekgyo') && realPnlPct <= -14) {
          const lossFiles = Math.max(0, investedFiles - realFiles);
          const baseCrates = ledger?.boughtInMania ? 1.5 : 0.6;
          maniaCratesRaw += baseCrates + (lossFiles / 14);
        }

        holdings.push({
          place: p,
          id: p.id,
          netValTL: +netValTL.toFixed(2),
          realFiles: +realFiles.toFixed(1),
          investedFiles: +investedFiles.toFixed(1),
          realPnlFiles: +realPnlFiles.toFixed(1),
          realPnlPct: +realPnlPct.toFixed(1)
        });
      }

      if (p.kind !== 'sukuk' && p.kind !== 'deposit' && q > 0) {
        spotGrossTL += grossValTL;
      }
    }

    holdings.sort((a, b) => b.netValTL - a.netValTL);

    const grossAssetsTL = state.cashTL + state.sukukTL + state.depositTL + Math.max(0, spotGrossTL - spyTaxReserveTL);
    const netWorthTL = Math.max(0, grossAssetsTL - state.debtTL);
    const realFiles = +(netWorthTL / currentFilePriceTL).toFixed(1);
    const idleCashFiles = +(state.cashTL / currentFilePriceTL).toFixed(1);
    const idleCashSharePct = grossAssetsTL > 0 ? +((state.cashTL / grossAssetsTL) * 100).toFixed(1) : 100;

    // Sabırlı Komşu hesabı
    const neighborGrossTL =
      (state.neighborUnits.gold * (Number(mRow.gramGoldTL) || 140.39)) +
      (state.neighborUnits.bimas * (Number(mRow.bimas) || 8.91)) +
      (state.neighborUnits.froto * (Number(mRow.froto) || 1.59));
    const neighborFiles = +(neighborGrossTL / currentFilePriceTL).toFixed(1);

    const debtRatioPct = grossAssetsTL > 0 ? +((state.debtTL / grossAssetsTL) * 100).toFixed(1) : 0;

    // Erzak rafları fiziksel karşılıkları
    const loafCount = Math.max(0, Math.round(netWorthTL / currentBreadPriceTL));
    const oliveJugs = Math.max(0, Math.round(realFiles * 1.0)); // 1 File = 1 teneke (5L) sızma zeytinyağı
    const fuelSacks = Math.max(0, Math.round(realFiles / 4.2));
    const homeBricks = Math.max(0, Math.round(realFiles * 2.4));
    const banknoteScalePct = +Math.max(6.5, (100 / state.cumCpiFactor)).toFixed(1);
    const banknoteLoavesNow = +(80 / state.cumCpiFactor).toFixed(1);

    const stuckCratesCount = Math.min(8, Math.max(0, Math.round(maniaCratesRaw + state.residualManiaCrates)));
    const sleeplessLampActive = debtRatioPct > 25;

    return {
      mRow,
      season: getSeasonInfo(mRow.ym),
      grossAssetsTL: +grossAssetsTL.toFixed(2),
      netWorthTL: +netWorthTL.toFixed(2),
      currentFilePriceTL: +currentFilePriceTL.toFixed(2),
      currentBreadPriceTL: +currentBreadPriceTL.toFixed(2),
      realFiles,
      idleCashFiles,
      idleCashSharePct,
      neighborFiles,
      pureIdleBenchmarkFiles: +state.idleOnlyFiles.toFixed(1),
      debtRatioPct,
      loafCount,
      oliveJugs,
      fuelSacks,
      homeBricks,
      banknoteScalePct,
      banknoteLoavesNow,
      stuckCratesCount,
      sleeplessLampActive,
      holdings
    };
  }

  // --------------------------------------------------------------------------
  // 3. İKİ KULAK DİNLEME MOTORU (ÖNCÜ SAHA İBRESİ vs GEÇ GELEN SOKAK GÜRÜLTÜSÜ)
  // --------------------------------------------------------------------------
  function computeTwoEarsIntel(idx) {
    const pack = getHistoryPack();
    const mRow = pack.months[idx] || pack.months[0];
    const prev1 = pack.months[Math.max(0, idx - 1)] || mRow;
    const prev3 = pack.months[Math.max(0, idx - 3)] || mRow;
    const ev = pack.eventsByYm[mRow.ym] || null;
    const season = getSeasonInfo(mRow.ym);

    // 1) Mazot ve Enerji Basıncı (-100 .. +100 -> İbre açısı)
    const pumpNow = (Number(mRow.bnoUsd) || 15) * (Number(mRow.usd) || 3.41);
    const pumpPrev3 = (Number(prev3.bnoUsd) || 15) * (Number(prev3.usd) || 3.41);
    const pumpChg3mPct = pumpPrev3 > 0 ? ((pumpNow / pumpPrev3) - 1) * 100 : 0;
    const pumpNeedle = Math.max(-90, Math.min(90, pumpChg3mPct * 2.2));

    // 2) Tarla ve Hammadde Döngüsü
    const farmNow = (Number(mRow.dbaUsd) || 17) * (Number(mRow.usd) || 3.41);
    const farmPrev3 = (Number(prev3.dbaUsd) || 17) * (Number(prev3.usd) || 3.41);
    const farmChg3mPct = farmPrev3 > 0 ? ((farmNow / farmPrev3) - 1) * 100 : 0;
    const farmNeedle = Math.max(-90, Math.min(90, farmChg3mPct * 2.4));

    // 3) Kasa ve Kredi Sıkılığı (Yıllıklandırılmış aylık enflasyona karşı net politika duruşu)
    const annCpiApprox = ((Math.pow(1 + ((Number(mRow.cpiMoM) || 0) / 100), 12)) - 1) * 100;
    const realRateGap = (Number(mRow.policy) || 8) - Math.min(110, annCpiApprox);
    const rateNeedle = Math.max(-90, Math.min(90, realRateGap * 2.1));

    let leadHeadline = '';
    let leadCausalHint = '';
    let streetHeadline = '';
    let streetWhisper = null;

    if (ev) {
      leadHeadline = formatModeText(ev.kitchenGauge, state.unmasked);
      leadCausalHint = formatModeText(ev.seasonHint || season.householdNote, state.unmasked);
      streetHeadline = formatModeText(ev.lateHeadline, state.unmasked);
      streetWhisper = ev.rumorTrap ? formatModeText(ev.rumorTrap, state.unmasked) : null;
    } else {
      // Ara aylarda da gerçek öncü saha verilerinden canlı nedensel okuma üret
      if (pumpChg3mPct >= 16) {
        leadHeadline = `Son 3 ayda ithal enerji ve mazot maliyeti %${Math.round(pumpChg3mPct)} kabardı; nakliye kamyonlarının ve fabrika kazanlarının faturası manşetlerden önce dönüyor.`;
        leadCausalHint = 'Pompadaki mazot artışı, 2-3 ay sonra market rafına ve mutfak filesine yansır; peşin satan market ve rafineri kasası önden güçlenir.';
      } else if (realRateGap <= -12) {
        leadHeadline = `Kredi muslukları mutfak yangınının çok altında çalışıyor; masada boş duran nakit bu ay %${Number(mRow.cpiMoM).toFixed(2)} eridi.`;
        leadCausalHint = 'Sabit kavanozda ve boş nakitte bekleyen paranın alım gücü sessizce buharlaşırken somut üretim ve sarı külçe ağırlaşır.';
      } else if (realRateGap >= 8 && Number(mRow.policy) >= 35) {
        leadHeadline = state.unmasked
          ? `Sıkı para dönemi: Politika faizi %${mRow.policy}, Sukuk brüt %${mRow.sukukGross} (%0 stopaj) ile borçlu atölyeleri sıkıştırıyor.`
          : `Kredi maliyeti çok yükseldi: Devletin Kesintisiz Kira Kalkanı yıllık %${mRow.sukukGross} hızla çalışırken borçlu işler terliyor.`;
        leadCausalHint = 'Borç taşıyanın çatısı ağırlaşır; kasasında hazır nakdi ve kira kalkanı olan fırtınasız büyür.';
      } else if (farmChg3mPct >= 12) {
        leadHeadline = `Tarla ve gıda hammaddesi son 3 ayda %${Math.round(farmChg3mPct)} kıpırdadı; toptancı halindeki fiyatlar gazete haberinden önde gidiyor.`;
        leadCausalHint = season.householdNote;
      } else {
        const eurChg = prev3.eur > 0 ? (((mRow.eur / prev3.eur) - 1) * 100) : 0;
        leadHeadline = `Saha sakin akıyor: Aylık mutfak pahalılığı %${Number(mRow.cpiMoM).toFixed(2)}, liman ihracat kuru 3 ayda %${eurChg.toFixed(1)} değişti.`;
        leadCausalHint = season.householdNote;
      }

      // Geç gelen sokak / kahvehane gürültüsü (her zaman geçmiş 3 ayın bitmiş hareketini konuşur!)
      const bistChg3m = prev3.xu100 > 0 ? (((mRow.xu100 / prev3.xu100) - 1) * 100) : 0;
      const sasaChg3m = prev3.sasa > 0 ? (((mRow.sasa / prev3.sasa) - 1) * 100) : 0;
      const goldChg1m = prev1.gramGoldTL > 0 ? (((mRow.gramGoldTL / prev1.gramGoldTL) - 1) * 100) : 0;

      if (sasaChg3m >= 55 && mRow.ym >= '2021-01' && mRow.ym <= '2023-06') {
        streetHeadline = 'Kahvehanede ve berber koltuğunda herkes son aylarda katlanan tek bir fabrika payını konuşuyor.';
        streetWhisper = state.unmasked
          ? 'Sokak Fısıltısı: Komşunun oğlu SASA ile iki ayda maaşını katlamış, tren kaçmadan ne varsa oraya atla!'
          : 'Sokak Fısıltısı: Komşunun oğlu dev elyaf fabrikasında iki ayda birikimini katlamış, tren kaçmadan sen de atla!';
      } else if (bistChg3m >= 22) {
        streetHeadline = 'Gazete ekonomi sayfaları coşkulu: Son üç ayda yükselen tezgâhlar yeni kalabalıkları içeri çekiyor.';
        streetWhisper = 'Kahvehane Sesi: Sıkıcı kalkanları bırak, herkesin koştuğu hızlı tahtalarda haftalık harçlık çıkar!';
      } else if (bistChg3m <= -8) {
        streetHeadline = 'Manşetlerde karamsarlık hakim: Son haftalardaki geri çekilme sonrası küçük birikimciler tedirgin.';
        streetWhisper = 'Sokak Sesi: Ortalık daha da bozulacak diyorlar, elindeki üretim ortaklıklarını satıp beklemeye geç!';
      } else if (goldChg1m >= 9) {
        streetHeadline = 'Kuyumcu vitrinleri önünde kalabalık arttı; televizyon yorumcuları sıçrayan fiyatları tartışıyor.';
      } else {
        streetHeadline = 'Gazetelerde dün olup biten rakamlar ve kısa yoldan zengin olma hikayeleri konuşuluyor; öncü hammadde izine bakan az.';
      }
    }

    return {
      leadHeadline,
      leadCausalHint,
      streetHeadline,
      streetWhisper,
      gauges: [
        {
          label: 'Mazot ve Kazan',
          needleDeg: pumpNeedle,
          stateText: pumpChg3mPct >= 12 ? 'Isınıyor' : (pumpChg3mPct <= -8 ? 'Gevşiyor' : 'Dengeli')
        },
        {
          label: 'Tarla ve Kiler',
          needleDeg: farmNeedle,
          stateText: farmChg3mPct >= 10 ? 'Pahalanıyor' : (farmChg3mPct <= -6 ? 'Sakin' : 'Olağan')
        },
        {
          label: 'Kasa Sıkılığı',
          needleDeg: rateNeedle,
          stateText: realRateGap >= 5 ? 'Sıkı Kalkan' : (realRateGap <= -10 ? 'Gevşek / Erime' : 'Geçişte')
        }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // 4. 10 YILLIK KİŞİSEL HAFIZA AYNASI ("ESKİ KAFAMLA ŞİMDİKİ AKLIM ARASINDAKİ FARK")
  // --------------------------------------------------------------------------
  function buildMemoryNarrative(val) {
    const e1 = state.epochs.early;
    const e2 = state.epochs.middle;
    const e3 = state.epochs.late;

    const avgIdle = (ep) => (ep.monthsObserved > 0 ? Math.round(ep.idleCashShareSum / ep.monthsObserved) : 0);
    const idle1 = avgIdle(e1);
    const idle2 = avgIdle(e2);
    const idle3 = avgIdle(e3);

    if (state.idx < 6) {
      return {
        headline: 'Hafıza Defteri Yeni Açıldı',
        body: 'Henüz yolculuğun ilk aylarındasın. İlk yıllardaki kararların, orta yıllardaki büyük fırtınalar ve son yıllardaki olgunluk dönemlerin yan yana biriktikçe, kendi zihninin nasıl değiştiğini burada göreceksin.',
        neighborVerdict: 'Yan evdeki Sabırlı Komşu ilk aydan erzak sepetini kurdu ve sessizce işine gücüne bakıyor.'
      };
    }

    const parts = [];

    // 1) İlk Yıllar Tespiti
    if (e1.monthsObserved > 0) {
      if (idle1 >= 68 && e1.tradeCount <= 2) {
        parts.push(`İlk yıllarda parayı mutfak masasında nakit tutmayı güvenli liman sandın (varlığının ortalama %${idle1} kadarı açıkta bekledi) ve banknotun sessizce küçülmesini izledin.`);
      } else if (e1.panicSales > 0 || e1.rumorChases > 0) {
        parts.push(`İlk 3 yılda dışarıdaki gürültüye kulağın açıktı (${e1.panicSales > 0 ? `${e1.panicSales} kez fırtınada korkuyla mal çözdün` : 'söylenti kapılarını yokladın'}, toplam ${e1.tradeCount} hamle yaptın).`);
      } else if (e1.highDebtMonths >= 6) {
        parts.push(`İlk yıllarda kileri hızlı büyütme arzusuyla çatıya erken borç yükü bindirdin (${e1.highDebtMonths} ay uykusuzluk lamban yandı).`);
      } else {
        parts.push(`İlk 3 yılda (${e1.tradeCount} hamle, ortalama %${idle1} açık nakit) kilerini somut üretim ve kalkanlarla tanıştırarak sağlam bir temel attın.`);
      }
    }

    // 2) Orta Yıllar Dönüşümü (Salgın, 2021 Aralık, 2022 SASA Sürü Hücumu)
    if (e2.monthsObserved > 0) {
      if (e2.rumorChases > 0) {
        parts.push(`Orta yıllarda enflasyon hızlanınca kalabalığın coşkusuna kapılıp ${e2.rumorChases} kez herkesin koştuğu zirve kapılarına girdin; kapı önünde biriken ahşap sandıklar sana fiyat ile gerçek değer arasındaki farkı yaşatarak öğretti.`);
      } else if (e2.panicSales > 0 && e1.panicSales > 0) {
        parts.push(`Orta yıllardaki büyük fırtınalarda da eski refleksin nüksetti ve sarsıntı aylarında ${e2.panicSales} kez gemiden erken indin.`);
      } else if (e2.calmStormBuys > 0) {
        parts.push(`Orta yıllarda 2020 ve 2021 sarsıntıları koparken sokaktaki paniğe kapılmayıp ${e2.calmStormBuys} kez fırtına ortasında sağlam üretim yerlerine ortak oldun.`);
      } else if (idle2 >= 55) {
        parts.push(`2020–2023 arasındaki büyük mutfak yangınında nakitte fazla beklemek (%${idle2} açık nakit) kiler raflarını terletti.`);
      } else {
        parts.push(`Orta yılların en sert kur ve salgın dalgalarında sağa sola savrulmadan kiler dengeni korudun.`);
      }
    }

    // 3) Son Yıllar vs İlk Yıllar Zihin Evrimi Kıyaslaması
    if (e3.monthsObserved > 0) {
      const calmedDown = (e1.panicSales + e2.panicSales > 0) && e3.panicSales === 0 && e3.rumorChases === 0;
      const curedIdleCash = idle1 >= 60 && idle3 <= 30;
      const grewRestlessLate = (e1.rumorChases === 0 && e3.rumorChases > 0) || (e3.tradeCount > e1.tradeCount + 8);
      const shedDebt = (e1.highDebtMonths + e2.highDebtMonths >= 6) && e3.highDebtMonths === 0;

      if (calmedDown && curedIdleCash) {
        parts.push(`Son yıllara geldiğinde ise eski telaşlı ve kararsız halin yerini dingin bir ustalığa bıraktı: Masada boş para eritmedin (%${idle3} açık nakit) ve tek bir söylenti peşinde koşmadın.`);
      } else if (calmedDown) {
        parts.push(`Son yıllarda zihnindeki en belirgin olgunlaşma sükûnet oldu: Eskiden fırtınada eli satışa giden veya kalabalığa bakan aklın, son dönemde öncü ibreyi okuyup yerini korudu.`);
      } else if (curedIdleCash) {
        parts.push(`Eski kafanla şimdiki aklın arasındaki en büyük fark nakit yanılsamasını aşman oldu: İlk yıllarda masada eriyen parayı (%${idle1}) son yıllarda (%${idle3}) kesintisiz kalkanlara ve üretime dönüştürdün.`);
      } else if (shedDebt) {
        parts.push(`Gençlik yıllarında taşıdığın borç ağırlığını son yıllarda sırtından indirip uykusuz gece lambasını söndürdün; huzurun da kiler kadar değerli olduğunu kavradın.`);
      } else if (grewRestlessLate) {
        parts.push(`İlginç bir ayna: İlk yıllarda daha temkinliyken, son yıllarda sabırsızlanıp ${e3.tradeCount} kez yer değiştirdin; bazen insan kileri büyüdükçe daha çok kurcalama tuzağına düşebiliyor.`);
      } else if (idle1 >= 70 && idle2 >= 70 && idle3 >= 70) {
        parts.push(`10 yıl boyunca neredeyse hiç kıpırdamadan nakitte bekledin; kavanozdaki sayılar değişmedi sanırken masadaki banknotun %${val.banknoteScalePct} boyutuna inmesi hareketsizliğin de bir karar olduğunu gösterdi.`);
      } else {
        parts.push(`Son yıllarda (${e3.tradeCount} hamle, ortalama %${idle3} nakit) kendi ritmini bulup kilerini istikrarla taşıdın.`);
      }
    }

    const diffVsNeighbor = +(val.realFiles - val.neighborFiles).toFixed(1);
    let neighborVerdict = '';
    if (diffVsNeighbor >= 15) {
      neighborVerdict = `Sabırlı Komşu 0 al-sat ile ${val.neighborFiles} fileye ulaşırken, sen öncü izleri zamanında okuyarak ${val.realFiles} file (+${diffVsNeighbor} file fark) ürettin.`;
    } else if (diffVsNeighbor <= -20) {
      neighborVerdict = `Hiçbir habere bakmadan sadece işine gücüne bakan Sabırlı Komşu ${val.neighborFiles} fileye ulaşırken senin kilerin ${val.realFiles} filede kaldı (Aradaki ${Math.abs(diffVsNeighbor).toFixed(1)} filelik fark; boşta bekleyen nakit ve ${state.tradeCount} hamlelik telaşın sessiz bedelidir).`;
    } else {
      neighborVerdict = `Senin kilerin (${val.realFiles} file) ile yan evdeki Sabırlı Komşu (${val.neighborFiles} file) başa baş ilerliyor; az kurcalamanın gücü göz önünde.`;
    }

    let headline = 'Yolculuk Ortasında Zihin İzi';
    if (state.idx >= 120) {
      headline = '10 Yılın Muhasebesi: Eski Kafamla Şimdiki Aklım Arasındaki Fark';
    } else if (state.idx >= 85) {
      headline = 'Son Düzlükte Olgunlaşan Bakış';
    }

    return {
      headline,
      body: parts.join(' '),
      neighborVerdict
    };
  }

  // --------------------------------------------------------------------------
  // 5. EYLEMLER: EMANET ET (AL), EVE ÇEK (SAT), BORÇ YÜKÜ VE AY İLERLETME
  // --------------------------------------------------------------------------
  function entrustOrWithdraw(placeId, direction, ratio = 0.25) {
    if (!state) return false;
    const pack = getHistoryPack();
    const mRow = pack.months[state.idx];
    const place = PLACE_MAP.get(placeId);
    if (!place || !mRow) return false;

    const cleanRatio = Math.min(1, Math.max(0.05, Number(ratio) || 0.25));
    const ev = pack.eventsByYm[mRow.ym] || null;
    const isStorm = STORM_MONTHS.has(mRow.ym) || (ev && ev.type === 'storm');
    const halfSpreadPct = (isStorm && place.stormSpread && ev?.nightSpreadPct)
      ? (Number(ev.nightSpreadPct) / 2)
      : (place.spreadPct / 2);

    const currentFilePriceTL = 100 * state.cumCpiFactor;
    const ep = state.epochs[getEpochKeyByIdx(state.idx)];
    const displayTitle = state.unmasked ? place.masterCode : place.noviceName;

    if (direction === 'BUY') {
      const spendTL = +(state.cashTL * cleanRatio).toFixed(2);
      if (spendTL < 20) {
        anim.canvasNotice = 'Mutfak masasında emanet edilecek yeterli boş nakit kalmadı.';
        syncUI();
        return false;
      }

      state.cashTL = +(state.cashTL - spendTL).toFixed(2);
      state.tradeCount += 1;
      ep.tradeCount += 1;

      const frictionTL = +(spendTL * (halfSpreadPct / 100)).toFixed(2);
      const lostFiles = frictionTL / currentFilePriceTL;
      state.churnFrictionFiles = +(state.churnFrictionFiles + lostFiles).toFixed(2);
      ep.churnLostFiles = +(ep.churnLostFiles + lostFiles).toFixed(2);

      const netInvestTL = Math.max(0, spendTL - frictionTL);
      const addedRealFiles = netInvestTL / currentFilePriceTL;
      const inMania = isManiaWindowForPlace(place.id, mRow, state.idx, pack);

      if (place.kind === 'sukuk') {
        state.sukukTL = +(state.sukukTL + netInvestTL).toFixed(2);
      } else if (place.kind === 'deposit') {
        state.depositTL = +(state.depositTL + netInvestTL).toFixed(2);
      } else {
        const unitTL = getUnitPriceTL(place, mRow);
        const addQ = netInvestTL / unitTL;
        const prevQ = Number(state.units[place.id]) || 0;
        const totalQ = +(prevQ + addQ).toFixed(6);
        state.units[place.id] = totalQ;

        const prevLed = state.costLedger[place.id] || {
          investedRealFiles: 0,
          boughtInMania: false,
          avgUnitCostTL: unitTL,
          entryCpiWeighted: state.cumCpiFactor
        };
        const weightedUnitTL = totalQ > 0 ? (((prevQ * prevLed.avgUnitCostTL) + (addQ * unitTL)) / totalQ) : unitTL;
        const weightedCpi = totalQ > 0 ? (((prevQ * prevLed.entryCpiWeighted) + (addQ * state.cumCpiFactor)) / totalQ) : state.cumCpiFactor;

        state.costLedger[place.id] = {
          investedRealFiles: +(prevLed.investedRealFiles + addedRealFiles).toFixed(3),
          boughtInMania: Boolean(prevLed.boughtInMania || inMania),
          avgUnitCostTL: +weightedUnitTL.toFixed(4),
          entryCpiWeighted: +weightedCpi.toFixed(4)
        };
      }

      if (place.kind === 'sukuk' || place.kind === 'deposit') {
        const prevLed = state.costLedger[place.id] || { investedRealFiles: 0, boughtInMania: false };
        state.costLedger[place.id] = {
          investedRealFiles: +(prevLed.investedRealFiles + addedRealFiles).toFixed(3),
          boughtInMania: false,
          avgUnitCostTL: 1,
          entryCpiWeighted: state.cumCpiFactor
        };
      }

      if (inMania) {
        state.rumorChasesCount += 1;
        ep.rumorChases += 1;
        pushMoment(ep, `${parseYm(mRow.ym).label}: Kalabalığın konuştuğu zirve günlerinde ${place.noviceName} kapısına girdin.`);
        state.diary.unshift({
          ym: mRow.ym,
          kind: 'mania',
          text: `${parseYm(mRow.ym).label}: Sokakta herkesin dilinde olan dönemde ${displayTitle} payına ortak oldun.`
        });
      } else if (isStorm && (place.quarter === 'daily_port' || place.quarter === 'heavy_global' || place.id === 'gramGold')) {
        state.calmStormBuysCount += 1;
        ep.calmStormBuys += 1;
        pushMoment(ep, `${parseYm(mRow.ym).label}: Fırtına karanlığında korkmayıp ${place.noviceName} topladın.`);
        state.diary.unshift({
          ym: mRow.ym,
          kind: 'calm',
          text: `${parseYm(mRow.ym).label}: Gökyüzü fırtınalıyken soğukkanlılıkla ${displayTitle} kilerine ekleme yaptın.`
        });
      }

      anim.canvasNotice = `${displayTitle} durağına ${addedRealFiles.toFixed(1)} mutfak filesi emanet edildi.`;
    } else if (direction === 'SELL') {
      let grossProceedsTL = 0;
      let penaltyOrSpreadTL = 0;
      let taxCutTL = 0;
      const prevLed = state.costLedger[place.id];

      if (place.kind === 'sukuk') {
        if (state.sukukTL <= 0.5) return false;
        const takeTL = cleanRatio >= 0.99 ? state.sukukTL : +(state.sukukTL * cleanRatio).toFixed(2);
        state.sukukTL = Math.max(0, +(state.sukukTL - takeTL).toFixed(2));
        grossProceedsTL = takeTL;
      } else if (place.kind === 'deposit') {
        if (state.depositTL <= 0.5) return false;
        const takeTL = cleanRatio >= 0.99 ? state.depositTL : +(state.depositTL * cleanRatio).toFixed(2);
        // Vadeden önce bozma sürtünmesi (~1 aylık faiz yanması)
        penaltyOrSpreadTL = +(takeTL * (((Number(mRow.depGross) || 14) / 1200) * 0.85)).toFixed(2);
        state.depositTL = Math.max(0, +(state.depositTL - takeTL).toFixed(2));
        grossProceedsTL = takeTL;
      } else {
        const curQ = Number(state.units[place.id]) || 0;
        if (curQ <= 0.000001) return false;
        const sellQ = cleanRatio >= 0.99 ? curQ : +(curQ * cleanRatio).toFixed(6);
        const unitTL = getUnitPriceTL(place, mRow);
        grossProceedsTL = +(sellQ * unitTL).toFixed(2);
        penaltyOrSpreadTL = +(grossProceedsTL * (halfSpreadPct / 100)).toFixed(2);
        if (place.id === 'spy') {
          taxCutTL = computeSpyTaxReserveTL(sellQ, mRow);
        }
        const remQ = +(curQ - sellQ).toFixed(6);
        if (remQ <= 0.000001) {
          delete state.units[place.id];
        } else {
          state.units[place.id] = remQ;
        }
      }

      state.tradeCount += 1;
      ep.tradeCount += 1;

      const lostFiles = penaltyOrSpreadTL / currentFilePriceTL;
      state.churnFrictionFiles = +(state.churnFrictionFiles + lostFiles).toFixed(2);
      ep.churnLostFiles = +(ep.churnLostFiles + lostFiles).toFixed(2);

      const netCashBackTL = Math.max(0, +(grossProceedsTL - penaltyOrSpreadTL - taxCutTL).toFixed(2));
      state.cashTL = +(state.cashTL + netCashBackTL).toFixed(2);

      // Maliyet defterini oransal azalt; sürü zirvesinden zararına çıkıldıysa kapı önünde geçici sandık izi bırak
      if (prevLed) {
        const soldInvestedFiles = prevLed.investedRealFiles * cleanRatio;
        const realizedFiles = netCashBackTL / currentFilePriceTL;
        if (prevLed.boughtInMania && realizedFiles < soldInvestedFiles * 0.82) {
          state.residualManiaCrates = Math.min(5, state.residualManiaCrates + 2.0);
        }
        const remRatio = Math.max(0, 1 - cleanRatio);
        if (remRatio <= 0.01) {
          delete state.costLedger[place.id];
        } else {
          prevLed.investedRealFiles = +(prevLed.investedRealFiles * remRatio).toFixed(3);
        }
      }

      // Fırtına ayında veya sert düşüşte panik satışı tespiti
      const prevRow = pack.months[Math.max(0, state.idx - 1)] || mRow;
      const monthlyDrop = (place.kind !== 'sukuk' && place.kind !== 'deposit')
        ? ((getUnitPriceTL(place, mRow) / getUnitPriceTL(place, prevRow)) - 1) * 100
        : 0;

      if ((isStorm || monthlyDrop <= -9) && place.kind !== 'sukuk' && place.kind !== 'deposit') {
        state.panicSalesCount += 1;
        ep.panicSales += 1;
        pushMoment(ep, `${parseYm(mRow.ym).label}: Fırtına ortasında ${place.noviceName} payını elden çıkardın.`);
        state.diary.unshift({
          ym: mRow.ym,
          kind: 'panic',
          text: `${parseYm(mRow.ym).label}: Hava sertleştiğinde ${displayTitle} emanetini bozup masaya nakit çektin.`
        });
      }

      anim.canvasNotice = `${displayTitle} durağından ${(netCashBackTL / currentFilePriceTL).toFixed(1)} file karşılığı nakit mutfak masasına döndü.`;
    }

    if (state.diary.length > 24) state.diary.length = 24;
    syncUI();
    return true;
  }

  function adjustHouseholdDebt(action) {
    if (!state) return false;
    const val = evaluateHousehold();
    const stepFiles = 15; // Her adımda 15 mutfak filesi büyüklüğünde kredi dilimi
    const stepTL = +(stepFiles * val.currentFilePriceTL).toFixed(2);

    if (action === 'BORROW') {
      if (val.debtRatioPct >= 52) {
        anim.canvasNotice = 'Çatıdaki borç ağırlığı zaten yüksek; banka yeni kredi dilimi açmıyor.';
        syncUI();
        return false;
      }
      state.debtTL = +(state.debtTL + stepTL).toFixed(2);
      state.cashTL = +(state.cashTL + stepTL).toFixed(2);
      state.diary.unshift({
        ym: val.mRow.ym,
        kind: 'debt',
        text: `${parseYm(val.mRow.ym).label}: Çatıya ${stepFiles} mutfak filesi tutarında (${Math.round(stepTL).toLocaleString('tr-TR')} ₺) banka borcu yüklendin.`
      });
      anim.canvasNotice = 'Bankadan kredi çekildi; borç oranı %25 sınırını aşarsa çatıya demir ağırlıklar biner ve gece lambası uykusuz yanar.';
    } else if (action === 'REPAY') {
      if (state.debtTL <= 0 || state.cashTL <= 0) return false;
      const payTL = Math.min(state.debtTL, state.cashTL);
      state.debtTL = Math.max(0, +(state.debtTL - payTL).toFixed(2));
      state.cashTL = Math.max(0, +(state.cashTL - payTL).toFixed(2));
      state.diary.unshift({
        ym: val.mRow.ym,
        kind: 'calm',
        text: `${parseYm(val.mRow.ym).label}: Masadaki nakitle ${Math.round(payTL).toLocaleString('tr-TR')} ₺ borç kapatıldı; çatının yükü hafifledi.`
      });
      anim.canvasNotice = 'Borç yükü azaltıldı; evin çatısı ve gece uykusu rahatladı.';
    }

    if (state.diary.length > 24) state.diary.length = 24;
    syncUI();
    return true;
  }

  function stepOneMonth() {
    if (!state) state = createFreshState(false);
    const pack = getHistoryPack();
    if (state.idx >= pack.months.length - 1) {
      stopPlayback();
      notifyKernelMilestone();
      syncUI();
      return getState();
    }

    state.idx += 1;
    const mRow = pack.months[state.idx];
    state.ym = mRow.ym;

    const cpiMoM = (Number(mRow.cpiMoM) || 0) / 100;
    state.cumCpiFactor = state.cumCpiFactor * (1 + cpiMoM);
    const currentFilePriceTL = 100 * state.cumCpiFactor;
    const season = getSeasonInfo(mRow.ym);

    // Geçici sandık izi her ay yavaşça temizlenir
    if (state.residualManiaCrates > 0) {
      state.residualManiaCrates = Math.max(0, +(state.residualManiaCrates - 0.30).toFixed(2));
    }

    // 1) Sabit Getirili Kalkanların Aylık İşleyişi (Sukuk %0 kesinti vs Mevduat stopaj kesintili)
    if (state.sukukTL > 0) {
      const sukMo = (Number(mRow.sukukGross) || 12) / 1200;
      state.sukukTL = +(state.sukukTL * (1 + sukMo)).toFixed(2);
    }
    if (state.depositTL > 0) {
      const depGross = Number(mRow.depGross) || 12;
      const stopajPct = Number(mRow.stopaj) || 15;
      const depNetMo = (depGross * (1 - stopajPct / 100)) / 1200;
      state.depositTL = +(state.depositTL * (1 + depNetMo)).toFixed(2);
    }

    // 2) Çatıdaki Borç Yükünün Aylık Faiz Maliyeti (Politika faizi + %9 kredi marjı)
    if (state.debtTL > 0) {
      const annualLoanRate = (Number(mRow.policy) || 15) + 9.0;
      const interestTL = +(state.debtTL * (annualLoanRate / 1200)).toFixed(2);
      state.debtTL = +(state.debtTL + interestTL).toFixed(2);
    }

    // 3) Mevsimsel Ev Tasarrufu Girişi (Kullanıcıya, Sabırlı Komşuya ve Boş Nakit Karşılaştırmasına Eşit Girer)
    const monthlySavedTL = +(state.monthlyBaseSavingsTL * state.cumCpiFactor * season.savingsMult).toFixed(2);
    const addedFiles = monthlySavedTL / currentFilePriceTL;

    state.cashTL = +(state.cashTL + monthlySavedTL).toFixed(2);
    state.contributedRealFiles = +(state.contributedRealFiles + addedFiles).toFixed(2);

    state.neighborUnits.gold += (monthlySavedTL * 0.40) / Math.max(0.01, Number(mRow.gramGoldTL) || 1);
    state.neighborUnits.bimas += (monthlySavedTL * 0.30) / Math.max(0.01, Number(mRow.bimas) || 1);
    state.neighborUnits.froto += (monthlySavedTL * 0.30) / Math.max(0.01, Number(mRow.froto) || 1);
    state.idleOnlyFiles = +((state.idleOnlyFiles / (1 + cpiMoM)) + addedFiles).toFixed(2);

    // 4) Borç Oranı %65 Sınırını Aşarsa Zorunlu Dip Tasfiyesi (Kırmızı Hata Kutusu Yok, Fiziksel Çatı Sarsıntısı!)
    let val = evaluateHousehold();
    if (val.debtRatioPct >= 65 && state.debtTL > 0) {
      state.forcedLiquidationsCount += 1;
      const epNow = state.epochs[getEpochKeyByIdx(state.idx)];
      epNow.forcedLiquidations += 1;
      anim.roofShudder = 1.0;

      let raisedTL = 0;
      for (const p of PLACES) {
        if (p.kind === 'sukuk' && state.sukukTL > 0) {
          const cut = +(state.sukukTL * 0.60).toFixed(2);
          state.sukukTL = +(state.sukukTL - cut).toFixed(2);
          raisedTL += cut;
        } else if (p.kind === 'deposit' && state.depositTL > 0) {
          const cut = +(state.depositTL * 0.60).toFixed(2);
          state.depositTL = +(state.depositTL - cut).toFixed(2);
          raisedTL += cut * 0.98;
        } else {
          const q = Number(state.units[p.id]) || 0;
          if (q > 0) {
            const sellQ = +(q * 0.60).toFixed(6);
            state.units[p.id] = +(q - sellQ).toFixed(6);
            if (state.units[p.id] <= 0.000001) delete state.units[p.id];
            // Fırtına dip tasfiyesi %5 iskonto ve makas kaybıyla gerçekleşir
            raisedTL += sellQ * getUnitPriceTL(p, mRow) * 0.95;
            if (state.costLedger[p.id]) {
              state.costLedger[p.id].investedRealFiles = +(state.costLedger[p.id].investedRealFiles * 0.40).toFixed(3);
            }
          }
        }
      }

      const availableForDebt = raisedTL + state.cashTL * 0.85;
      const paydown = Math.min(state.debtTL, availableForDebt);
      state.cashTL = Math.max(0, +(state.cashTL + raisedTL - paydown).toFixed(2));
      state.debtTL = Math.max(0, +(state.debtTL - paydown).toFixed(2));

      pushMoment(epNow, `${parseYm(mRow.ym).label}: Borç çatının %65'ini aşınca alacaklılar kilerdeki malları dip fiyattan sattırdı.`);
      state.diary.unshift({
        ym: mRow.ym,
        kind: 'liquidation',
        text: `${parseYm(mRow.ym).label} — Uykusuz Gece Sonu: Borç yükü kilerin %65 sınırını aştığı için varlıkların bir kısmı dip fiyattan zorunlu tasfiye edildi.`
      });

      val = evaluateHousehold();
    }

    // 5) Dönemsel Davranış Hafızası Güncellemesi
    const ep = state.epochs[getEpochKeyByIdx(state.idx)];
    ep.monthsObserved += 1;
    ep.idleCashShareSum += val.idleCashSharePct;
    if (val.debtRatioPct > 25) ep.highDebtMonths += 1;
    if (season.id === 'winter' && val.idleCashSharePct <= 35 && val.debtRatioPct <= 25) {
      ep.winterPreparedMonths += 1;
    }

    // Zirve ve en derin reel sarsıntı takibi
    if (val.realFiles > state.peakRealFiles) state.peakRealFiles = val.realFiles;
    const ddPct = state.peakRealFiles > 0
      ? +(((val.realFiles - state.peakRealFiles) / state.peakRealFiles) * 100).toFixed(1)
      : 0;
    if (ddPct < state.maxRealDrawdownPct) state.maxRealDrawdownPct = ddPct;

    state.historyCurve.push({
      ym: mRow.ym,
      userFiles: val.realFiles,
      neighborFiles: val.neighborFiles,
      idleCashFiles: val.pureIdleBenchmarkFiles
    });

    // Önemli tarihsel olay aylarını günlüğe ve sahne şeridine yansıt
    const ev = pack.eventsByYm[mRow.ym];
    if (ev) {
      const cleanGauge = formatModeText(ev.kitchenGauge, state.unmasked);
      state.diary.unshift({
        ym: mRow.ym,
        kind: ev.type || 'event',
        text: `${parseYm(mRow.ym).label}: ${cleanGauge}`
      });
      anim.canvasNotice = `${parseYm(mRow.ym).label} (${season.name}) — ${cleanGauge}`;
      if (STORM_MONTHS.has(mRow.ym)) {
        anim.lightningFlash = 1.0;
      }
    } else {
      anim.canvasNotice = `${parseYm(mRow.ym).label} (${season.name}) — ${season.householdNote}`;
    }

    if (state.diary.length > 24) state.diary.length = 24;

    if (state.idx >= 12) {
      notifyKernelMilestone();
    }
    if (state.idx >= pack.months.length - 1) {
      stopPlayback();
    }

    if (typeof mountOpts.onMonthStep === 'function') {
      try { mountOpts.onMonthStep(getState()); } catch (_) {}
    }
    if (state.idx === pack.months.length - 1 && typeof mountOpts.onComplete === 'function') {
      try { mountOpts.onComplete(getState()); } catch (_) {}
    }

    syncUI();
    return getState();
  }

  function notifyKernelMilestone() {
    if (!global.AetherKernelV10 || typeof global.AetherKernelV10.recordArenaCompletion !== 'function') return;
    const val = evaluateHousehold();
    try {
      global.AetherKernelV10.recordArenaCompletion({
        ymReached: state.ym,
        realFiles: val.realFiles,
        passiveFiles: val.neighborFiles,
        maxRealDrawdownPct: state.maxRealDrawdownPct,
        tradeCount: state.tradeCount
      });
    } catch (_) {}
  }

  function startPlayback(ms) {
    if (!state) state = createFreshState(false);
    if (ms != null && Number(ms) > 0) {
      state.speedMs = Math.max(80, Number(ms));
    }
    stopPlayback();
    const pack = getHistoryPack();
    if (state.idx >= pack.months.length - 1) {
      return false;
    }
    state.playing = true;
    playTimerId = setInterval(() => {
      stepOneMonth();
    }, state.speedMs);
    syncUI();
    return true;
  }

  function stopPlayback() {
    if (playTimerId) {
      clearInterval(playTimerId);
      playTimerId = null;
    }
    if (state) state.playing = false;
    if (els) syncHeaderOnly();
  }

  function reset() {
    stopPlayback();
    const keepUnmasked = state ? state.unmasked : Boolean(mountOpts.unmasked);
    state = createFreshState(keepUnmasked);
    anim.stormAlpha = 0;
    anim.lightningFlash = 0;
    anim.roofShudder = 0;
    anim.smoothBanknoteScale = 1.0;
    anim.smoothCrates = 0;
    anim.smoothDebtRatio = 0;
    anim.canvasNotice = 'Kasım 2016: Mutfak masasında 10.000 ₺ (tam 100 haftalık mutfak filesi) ile 10 yıllık ev yolculuğumuz yeniden başladı.';
    syncUI();
    return getState();
  }

  function getState() {
    if (!state) state = createFreshState(false);
    const val = evaluateHousehold();
    const narrative = buildMemoryNarrative(val);
    return {
      idx: state.idx,
      totalTransitions: Math.max(1, getHistoryPack().months.length - 1),
      ym: state.ym,
      playing: state.playing,
      speedMs: state.speedMs,
      unmasked: state.unmasked,
      activeQuarter: state.activeQuarter,
      season: val.season,
      cumCpiFactor: +state.cumCpiFactor.toFixed(4),
      banknoteScalePct: val.banknoteScalePct,
      cashTL: state.cashTL,
      sukukTL: state.sukukTL,
      depositTL: state.depositTL,
      debtTL: state.debtTL,
      debtRatioPct: val.debtRatioPct,
      netWorthTL: val.netWorthTL,
      realFiles: val.realFiles,
      contributedRealFiles: +state.contributedRealFiles.toFixed(1),
      neighborFiles: val.neighborFiles,
      idleCashFiles: val.pureIdleBenchmarkFiles,
      loafCount: val.loafCount,
      oliveJugs: val.oliveJugs,
      fuelSacks: val.fuelSacks,
      homeBricks: val.homeBricks,
      stuckCratesCount: val.stuckCratesCount,
      sleeplessLampActive: val.sleeplessLampActive,
      tradeCount: state.tradeCount,
      churnFrictionFiles: state.churnFrictionFiles,
      panicSalesCount: state.panicSalesCount,
      rumorChasesCount: state.rumorChasesCount,
      forcedLiquidationsCount: state.forcedLiquidationsCount,
      maxRealDrawdownPct: state.maxRealDrawdownPct,
      units: { ...state.units },
      holdings: val.holdings,
      epochs: state.epochs,
      memoryNarrative: narrative,
      historyCurve: state.historyCurve
    };
  }

  // --------------------------------------------------------------------------
  // 6. 60FPS CANVAS PANORAMA ÇİZİM MOTORU (EV, KİLER RAFLARI, KOMŞU, MEVSİM, FIRTINA)
  // --------------------------------------------------------------------------
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function drawRoundedRect(ctx, x, y, w, h, r) {
    const rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
  }

  function renderPanoramaCanvas(ts) {
    if (!hostEl || !els || !els.canvas || !state) return;
    const canvas = els.canvas;
    const ctx = typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null;
    if (!ctx) return;

    const dt = anim.lastTs ? Math.min(0.05, Math.max(0.005, (ts - anim.lastTs) / 1000)) : 0.016;
    anim.lastTs = ts;
    anim.t += dt;

    const dpr = Math.min(2, Number(global.devicePixelRatio) || 1);
    const cssW = Math.max(280, canvas.clientWidth || 720);
    const cssH = Math.max(230, canvas.clientHeight || 295);
    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const W = cssW;
    const H = cssH;
    const compact = W < 560;
    const val = evaluateHousehold();
    const isStorm = STORM_MONTHS.has(state.ym);

    // Yumuşak fiziksel geçişler
    anim.stormAlpha = lerp(anim.stormAlpha, isStorm ? 1.0 : 0.0, dt * 3.5);
    if (isStorm && Math.random() < dt * 0.65) {
      anim.lightningFlash = 0.95;
    }
    anim.lightningFlash = Math.max(0, anim.lightningFlash - dt * 2.8);
    anim.roofShudder = Math.max(0, anim.roofShudder - dt * 1.8);

    const targetLoaves = Math.max(1, Math.min(11, Math.round(val.realFiles / 55)));
    const targetOil = Math.max(1, Math.min(8, Math.round(val.realFiles / 75)));
    const targetSacks = Math.max(1, Math.min(7, Math.round(val.realFiles / 90)));
    const targetBricks = Math.max(2, Math.min(18, Math.round(val.realFiles / 45)));
    const targetBankScale = Math.max(0.065, 1 / state.cumCpiFactor);

    anim.smoothLoaves = lerp(anim.smoothLoaves, targetLoaves, dt * 4);
    anim.smoothOil = lerp(anim.smoothOil, targetOil, dt * 4);
    anim.smoothSacks = lerp(anim.smoothSacks, targetSacks, dt * 4);
    anim.smoothBricks = lerp(anim.smoothBricks, targetBricks, dt * 4);
    anim.smoothBanknoteScale = lerp(anim.smoothBanknoteScale, targetBankScale, dt * 5);
    anim.smoothCrates = lerp(anim.smoothCrates, val.stuckCratesCount, dt * 4.5);
    anim.smoothDebtRatio = lerp(anim.smoothDebtRatio, val.debtRatioPct, dt * 4);
    anim.smoothNeighborTree = lerp(anim.smoothNeighborTree, Math.min(1, val.neighborFiles / 950), dt * 3);

    const seasonId = val.season.id;

    // 1) GÖKYÜZÜ VE MEVSİM PALETİ
    const skyPalettes = {
      winter: ['#cbd5e1', '#e2e8f0'],
      spring: ['#bae6fd', '#ecfdf5'],
      summer: ['#93c5fd', '#fef3c7'],
      autumn: ['#cbd5e1', '#fde68a']
    };
    const pal = skyPalettes[seasonId] || skyPalettes.autumn;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.68);
    skyGrad.addColorStop(0, pal[0]);
    skyGrad.addColorStop(1, pal[1]);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Fırtına kararması ve şimşek
    if (anim.stormAlpha > 0.02) {
      const stGrad = ctx.createLinearGradient(0, 0, 0, H * 0.72);
      stGrad.addColorStop(0, `rgba(23, 30, 44, ${0.84 * anim.stormAlpha})`);
      stGrad.addColorStop(1, `rgba(51, 65, 85, ${0.65 * anim.stormAlpha})`);
      ctx.fillStyle = stGrad;
      ctx.fillRect(0, 0, W, H * 0.75);
    }
    if (anim.lightningFlash > 0.05) {
      ctx.fillStyle = `rgba(248, 250, 252, ${anim.lightningFlash * 0.35})`;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = `rgba(254, 249, 195, ${anim.lightningFlash})`;
      ctx.lineWidth = 2.4;
      const lx = W * 0.68;
      ctx.beginPath();
      ctx.moveTo(lx, 6);
      ctx.lineTo(lx - 16, H * 0.16);
      ctx.lineTo(lx + 6, H * 0.19);
      ctx.lineTo(lx - 22, H * 0.38);
      ctx.stroke();
    }

    // Güneş (fırtına yokken)
    if (anim.stormAlpha < 0.6) {
      const sunAlpha = (1 - anim.stormAlpha) * (seasonId === 'winter' ? 0.45 : 0.85);
      ctx.fillStyle = `rgba(251, 191, 36, ${sunAlpha})`;
      ctx.beginPath();
      ctx.arc(W * 0.84, H * 0.15, compact ? 16 : 22, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2) UZAK DAĞLAR, BARAJ GÖLÜ VE LİMAN UFKU
    const horizonY = H * 0.64;
    ctx.fillStyle = seasonId === 'winter' ? '#94a3b8' : (seasonId === 'spring' ? '#86efac' : (seasonId === 'summer' ? '#d9bc6a' : '#b89f6d'));
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.quadraticCurveTo(W * 0.25, H * 0.43, W * 0.52, horizonY - 12);
    ctx.quadraticCurveTo(W * 0.76, H * 0.39, W, horizonY - 18);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // Kışın dağ zirvesinde kar örtüsü
    if (seasonId === 'winter') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.moveTo(W * 0.66, H * 0.49);
      ctx.quadraticCurveTo(W * 0.76, H * 0.40, W * 0.86, H * 0.48);
      ctx.lineTo(W * 0.79, H * 0.51);
      ctx.lineTo(W * 0.72, H * 0.48);
      ctx.closePath();
      ctx.fill();
    }

    // Sağ ufukta Baraj / Liman suyu (İlkbaharda yükselir, sonbaharda gemi taşır)
    const waterX = compact ? W * 0.58 : W * 0.55;
    const waterH = seasonId === 'spring' ? 24 : (state.ym === '2021-09' ? 12 : 18);
    ctx.fillStyle = anim.stormAlpha > 0.4 ? '#334155' : '#0284c7';
    ctx.fillRect(waterX, horizonY - waterH + 6, W - waterX, waterH);

    // Yazın gökyüzünde uçak filosu (2020 Bahar salgın kapanması hariç)
    const groundedPandemic = state.ym >= '2020-03' && state.ym <= '2020-05';
    if (!groundedPandemic && (seasonId === 'summer' || (Number(state.units.thyao) || 0) > 0)) {
      const px = W * 0.56 + ((anim.t * 28) % (W * 0.38));
      const py = H * 0.22 - ((px - W * 0.56) * 0.12);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px - 28, py + 4);
      ctx.lineTo(px - 4, py + 1);
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(px + 9, py);
      ctx.lineTo(px - 5, py - 3);
      ctx.lineTo(px - 3, py + 3);
      ctx.closePath();
      ctx.fill();
    }

    // Limanda ihracat gemisi (Sonbahar veya liman fabrikası tutulduğunda belirgin)
    const shipX = waterX + 16 + Math.sin(anim.t * 0.7) * (compact ? 10 : 22);
    const shipY = horizonY - waterH + 6;
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(shipX, shipY);
    ctx.lineTo(shipX + 38, shipY);
    ctx.lineTo(shipX + 32, shipY + 8);
    ctx.lineTo(shipX + 5, shipY + 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#b45309';
    ctx.fillRect(shipX + 7, shipY - 6, 9, 6);
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(shipX + 18, shipY - 6, 9, 6);

    // Uzak fabrika / rafineri bacası
    const facX = W - (compact ? 36 : 58);
    const facY = horizonY - 26;
    ctx.fillStyle = '#57534e';
    ctx.fillRect(facX, facY, 8, 22);
    ctx.fillRect(facX + 12, facY + 5, 14, 17);
    ctx.fillStyle = 'rgba(120, 113, 108, 0.42)';
    const puffOff = (anim.t * 14) % 18;
    ctx.beginPath();
    ctx.arc(facX + 4 + puffOff * 0.4, facY - 5 - puffOff, 5 + puffOff * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Zemin / Avlu toprağı
    const groundGrad = ctx.createLinearGradient(0, horizonY, 0, H);
    groundGrad.addColorStop(0, seasonId === 'winter' ? '#e2e8f0' : '#d6cbb5');
    groundGrad.addColorStop(1, seasonId === 'winter' ? '#cbd5e1' : '#c2b295');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // 3) YAN EV: SABIRLI KOMŞUNUN EVİ VE ZEYTİN AĞACI (SAĞ ÖN PLAN)
    const nbX = compact ? W * 0.68 : W * 0.67;
    const nbW = compact ? W * 0.28 : W * 0.26;
    const nbH = H * 0.34;
    const nbY = H * 0.87 - nbH;

    // Komşu duvar
    drawRoundedRect(ctx, nbX, nbY, nbW, nbH, 4);
    ctx.fillStyle = '#f5f0e6';
    ctx.fill();
    ctx.strokeStyle = '#a8a29e';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Komşu çatı
    ctx.fillStyle = '#9a3412';
    ctx.beginPath();
    ctx.moveTo(nbX - 8, nbY + 2);
    ctx.lineTo(nbX + nbW * 0.5, nbY - 26);
    ctx.lineTo(nbX + nbW + 8, nbY + 2);
    ctx.closePath();
    ctx.fill();

    // Komşu huzurlu sıcak pencere (hiç borç yükü yok)
    const winW = Math.min(28, nbW * 0.26);
    drawRoundedRect(ctx, nbX + 12, nbY + 16, winW, 24, 3);
    ctx.fillStyle = '#fde68a';
    ctx.fill();
    ctx.strokeStyle = '#78716c';
    ctx.stroke();

    // Komşunun bahçesindeki büyüyen zeytin ağacı
    const treeX = nbX + nbW * 0.74;
    const treeBaseY = nbY + nbH;
    const canopyR = 11 + anim.smoothNeighborTree * (compact ? 11 : 17);
    ctx.fillStyle = '#57534e';
    ctx.fillRect(treeX - 3, treeBaseY - 26, 6, 26);
    ctx.fillStyle = '#3f6212';
    ctx.beginPath();
    ctx.arc(treeX, treeBaseY - 30, canopyR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#65a30d';
    ctx.beginPath();
    ctx.arc(treeX - 5, treeBaseY - 33, canopyR * 0.68, 0, Math.PI * 2);
    ctx.fill();

    // 4) BİZİM EV VE AÇIK KİLER KESİTİ (SOL-ORTA ANA SAHNE)
    const shakeX = anim.roofShudder > 0 ? Math.sin(anim.t * 48) * 4 * anim.roofShudder : 0;
    const homeX = (compact ? W * 0.03 : W * 0.04) + shakeX;
    const homeW = compact ? W * 0.53 : W * 0.50;
    const homeH = H * 0.56;
    const homeY = H * 0.88 - homeH;
    const roofSag = anim.smoothDebtRatio > 25 ? Math.min(11, (anim.smoothDebtRatio - 25) * 0.26) : 0;

    // Evin dış tuğla / taş büyüme duvarı (sağ yan duvarda biriken gerçek çatı/ev tuğlaları)
    const brickCount = Math.round(anim.smoothBricks);
    const brickColX = homeX - (compact ? 8 : 14);
    for (let b = 0; b < brickCount; b++) {
      const row = Math.floor(b / 2);
      const col = b % 2;
      const bx = brickColX + col * 7;
      const by = homeY + homeH - 8 - row * 7;
      ctx.fillStyle = row % 2 === 0 ? '#b45309' : '#9a3412';
      ctx.fillRect(bx, by, 6, 5.5);
    }

    // Evin iç kesit gövdesi
    drawRoundedRect(ctx, homeX, homeY + roofSag * 0.4, homeW, homeH - roofSag * 0.4, 6);
    ctx.fillStyle = '#fffbeb';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#78716c';
    ctx.stroke();

    // Kışın tüten baca
    const chimX = homeX + homeW * 0.22;
    const chimY = homeY - 38 + roofSag;
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(chimX, chimY, 14, 24);
    if (seasonId === 'winter') {
      for (const sp of anim.smokePuffs) {
        const p = (sp.phase + anim.t * 0.28) % 1;
        ctx.fillStyle = `rgba(226, 232, 240, ${(1 - p) * 0.58})`;
        ctx.beginPath();
        ctx.arc(chimX + 7 + p * 24, chimY - 4 - p * 34, 5 + p * 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Evin kiremit çatısı (borç yüküyle hafif bel verir)
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(homeX - 12, homeY + 4 + roofSag * 0.4);
    ctx.quadraticCurveTo(homeX + homeW * 0.5, homeY - 44 + roofSag * 1.5, homeX + homeW + 12, homeY + 4 + roofSag * 0.4);
    ctx.lineTo(homeX + homeW - 4, homeY + 8 + roofSag * 0.6);
    ctx.quadraticCurveTo(homeX + homeW * 0.5, homeY - 26 + roofSag * 1.6, homeX + 4, homeY + 8 + roofSag * 0.6);
    ctx.closePath();
    ctx.fill();

    // Kışın çatıda kar şeridi
    if (seasonId === 'winter') {
      ctx.strokeStyle = 'rgba(255,255,255,0.88)';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(homeX - 8, homeY + 2 + roofSag * 0.4);
      ctx.quadraticCurveTo(homeX + homeW * 0.5, homeY - 41 + roofSag * 1.5, homeX + homeW + 8, homeY + 2 + roofSag * 0.4);
      ctx.stroke();
    }

    // Çatı katı uykusuzluk penceresi (Borç > %25 olduğunda gece lambası titrer!)
    const atticW = 28;
    const atticH = 18;
    const atticX = homeX + homeW * 0.5 - atticW / 2;
    const atticY = homeY - 19 + roofSag * 1.1;
    drawRoundedRect(ctx, atticX, atticY, atticW, atticH, 4);
    if (val.sleeplessLampActive) {
      const flicker = 0.62 + 0.38 * Math.abs(Math.sin(anim.t * 14) * Math.cos(anim.t * 9));
      ctx.fillStyle = `rgba(245, 158, 11, ${flicker})`;
      ctx.fill();
      // Penceredeki uykusuz gölge
      ctx.fillStyle = 'rgba(28, 25, 23, 0.68)';
      ctx.beginPath();
      ctx.arc(atticX + atticW * 0.5 + Math.sin(anim.t * 3) * 3, atticY + 8, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#fef3c7';
      ctx.fill();
    }
    ctx.strokeStyle = '#57534e';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Çatı Üstünde Ağır Demir Borç Ağırlıkları (debtRatioPct > 25%)
    if (anim.smoothDebtRatio > 25) {
      const weightCount = Math.min(4, Math.max(1, Math.ceil((anim.smoothDebtRatio - 20) / 12)));
      for (let i = 0; i < weightCount; i++) {
        const wx = homeX + homeW * 0.34 + i * 24;
        const wy = homeY - 31 + roofSag * 1.2;
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.moveTo(wx + 3, wy);
        ctx.lineTo(wx + 17, wy);
        ctx.lineTo(wx + 20, wy + 15);
        ctx.lineTo(wx, wy + 15);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#78716c';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // EVİN İÇİ SOL BÖLÜM: 3 AHŞAP ERZAK RAFI (Ekmek, Zeytinyağı, Kışlık Çuval)
    const shelfX = homeX + 10;
    const shelfW = homeW * 0.54;
    const shelfY1 = homeY + homeH * 0.30;
    const shelfY2 = homeY + homeH * 0.56;
    const shelfY3 = homeY + homeH * 0.82;

    ctx.fillStyle = '#a16207';
    [shelfY1, shelfY2, shelfY3].forEach((sy) => {
      ctx.fillRect(shelfX, sy, shelfW, 4);
    });

    // Raf 1: Somun Ekmekler
    const loavesToDraw = Math.round(anim.smoothLoaves);
    const loafStep = Math.min(16, (shelfW - 8) / Math.max(1, loavesToDraw));
    for (let i = 0; i < loavesToDraw; i++) {
      const lx = shelfX + 4 + i * loafStep;
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(lx + 6, shelfY1 - 5, 6.5, 5, 0, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lx + 4, shelfY1 - 8);
      ctx.lineTo(lx + 7, shelfY1 - 5);
      ctx.stroke();
    }

    // Raf 2: Zeytinyağı Damacanaları
    const oilToDraw = Math.round(anim.smoothOil);
    const oilStep = Math.min(19, (shelfW - 8) / Math.max(1, oilToDraw));
    for (let i = 0; i < oilToDraw; i++) {
      const ox = shelfX + 5 + i * oilStep;
      ctx.fillStyle = '#65a30d';
      drawRoundedRect(ctx, ox, shelfY2 - 14, 10, 13, 3);
      ctx.fill();
      ctx.fillStyle = '#a16207';
      ctx.fillRect(ox + 3, shelfY2 - 17, 4, 3);
    }

    // Raf 3: Kışlık Yakacak & Un Çuvalları
    const sacksToDraw = Math.round(anim.smoothSacks);
    const sackStep = Math.min(22, (shelfW - 8) / Math.max(1, sacksToDraw));
    for (let i = 0; i < sacksToDraw; i++) {
      const sx = shelfX + 5 + i * sackStep;
      ctx.fillStyle = '#b69b74';
      drawRoundedRect(ctx, sx, shelfY3 - 15, 13, 14, 4);
      ctx.fill();
      ctx.strokeStyle = '#78716c';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx + 3, shelfY3 - 12);
      ctx.lineTo(sx + 10, shelfY3 - 12);
      ctx.stroke();
    }

    // EVİN İÇİ SAĞ BÖLÜM: MUTFAK MASASI VE ERİYEN 2016 100 ₺ BANKNOTU
    const tblX = homeX + homeW * 0.61;
    const tblW = homeW * 0.34;
    const tblY = homeY + homeH * 0.64;

    // Masa tablası ve ayakları
    ctx.fillStyle = '#92400e';
    ctx.fillRect(tblX, tblY, tblW, 5);
    ctx.fillRect(tblX + 5, tblY + 5, 4, homeY + homeH - tblY - 7);
    ctx.fillRect(tblX + tblW - 9, tblY + 5, 4, homeY + homeH - tblY - 7);

    // Masanın üstünde 2016 100 ₺ banknotunun orijinal çerçevesi (kesikli iz) ve küçülen gerçek hali
    const ghostW = Math.min(58, tblW - 8);
    const ghostH = 26;
    const ghostX = tblX + (tblW - ghostW) / 2;
    const ghostY = tblY - ghostH - 5;

    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(120, 113, 108, 0.55)';
    ctx.lineWidth = 1.1;
    ctx.strokeRect(ghostX, ghostY, ghostW, ghostH);
    ctx.restore();

    // Fiziksel küçülen banknot (alan/boyut küçülmesi %6,5'e kadar iner!)
    const linScale = Math.max(0.24, Math.sqrt(anim.smoothBanknoteScale));
    const curBillW = Math.max(9, ghostW * anim.smoothBanknoteScale * 1.15);
    const curBillH = Math.max(6, ghostH * linScale);
    const curBillX = ghostX + (ghostW - curBillW) / 2;
    const curBillY = ghostY + ghostH - curBillH;

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(curBillX, curBillY, curBillW, curBillH);
    ctx.strokeStyle = '#075985';
    ctx.lineWidth = 1;
    ctx.strokeRect(curBillX, curBillY, curBillW, curBillH);

    // Masada yüksek boş nakit erirken buharlaşma çizgileri
    if (val.idleCashSharePct > 32 && (Number(val.mRow.cpiMoM) || 0) >= 1.2) {
      ctx.strokeStyle = 'rgba(185, 28, 28, 0.38)';
      ctx.lineWidth = 1.2;
      for (let w = 0; w < 3; w++) {
        const wx = ghostX + 10 + w * 16;
        const wy = ghostY - 2 - ((anim.t * 14 + w * 5) % 12);
        ctx.beginPath();
        ctx.moveTo(wx, wy + 6);
        ctx.quadraticCurveTo(wx + 3, wy + 3, wx - 1, wy);
        ctx.stroke();
      }
    }

    // 5) KAPI ÖNÜNDE YIĞILAN ELDE KALAN AHŞAP SANDIKLAR (Sürü Coşkusu Sonucu)
    const cratesToDraw = Math.round(anim.smoothCrates);
    if (cratesToDraw > 0) {
      const porchX = homeX + homeW + 6;
      const porchBaseY = homeY + homeH;
      for (let c = 0; c < cratesToDraw; c++) {
        const col = c % 2;
        const row = Math.floor(c / 2);
        const cx = porchX + col * 21;
        const cy = porchBaseY - 19 - row * 19;
        ctx.fillStyle = '#a16207';
        ctx.fillRect(cx, cy, 19, 18);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(cx, cy, 19, 18);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + 19, cy + 18);
        ctx.stroke();
      }
    }

    // 6) MEVSİM YAĞIŞ PARÇACIKLARI (Kış Kar, İlkbahar/Fırtına Yağmur, Sonbahar Yaprak)
    if (seasonId === 'winter' || seasonId === 'spring' || seasonId === 'autumn' || anim.stormAlpha > 0.35) {
      for (const p of anim.particles) {
        const py = ((p.y + anim.t * p.v * (anim.stormAlpha > 0.4 ? 1.8 : 1)) % 1) * H;
        const px = ((p.x + anim.t * p.drift + 10) % 1) * W;
        if (seasonId === 'winter' && anim.stormAlpha < 0.5) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (seasonId === 'spring' || anim.stormAlpha >= 0.35) {
          ctx.strokeStyle = anim.stormAlpha > 0.4 ? 'rgba(186, 230, 253, 0.55)' : 'rgba(14, 116, 144, 0.35)';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - 3, py + 8);
          ctx.stroke();
        } else if (seasonId === 'autumn') {
          ctx.fillStyle = 'rgba(180, 83, 9, 0.55)';
          ctx.beginPath();
          ctx.ellipse(px, py, 2.8, 1.6, anim.t + p.x * 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 7) SAHNE ETİKETLERİ (Sade, okunaklı, sıfır emoji)
    ctx.font = `700 ${compact ? 10 : 11}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    const drawBadge = (text, bx, by, bg, fg) => {
      const tw = ctx.measureText(text).width;
      const bw = tw + 12;
      const clampedX = Math.max(6, Math.min(bx, W - bw - 6));
      const clampedY = Math.max(6, Math.min(by, H - 23));
      drawRoundedRect(ctx, clampedX, clampedY, bw, 19, 6);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.fillText(text, clampedX + 6, clampedY + 13);
    };

    drawBadge(`Bizim Ev · ${val.realFiles} File`, homeX + 4, H - 24, 'rgba(28, 25, 23, 0.82)', '#fffdf9');
    drawBadge(`Sabırlı Komşu · ${val.neighborFiles} File`, nbX, H - 24, 'rgba(15, 118, 110, 0.88)', '#ffffff');
    drawBadge(`100 ₺ Boyutu: %${val.banknoteScalePct}`, tblX - (compact ? 18 : 8), tblY - ghostH - 27, 'rgba(255, 253, 249, 0.90)', '#075985');

    if (cratesToDraw > 0) {
      drawBadge(`Elde Kalan: ${cratesToDraw} Sandık`, homeX + homeW - 10, homeY + homeH - 46 - Math.floor(cratesToDraw / 2) * 18, 'rgba(124, 45, 18, 0.90)', '#fef3c7');
    }
    if (val.sleeplessLampActive) {
      drawBadge(`Borç Yükü %${val.debtRatioPct} · Uykusuz Gece`, atticX - 38, Math.max(6, atticY - 22), 'rgba(28, 25, 23, 0.88)', '#fcd34d');
    }

    ctx.restore();
  }

  function startAnimationLoop() {
    if (rafId || typeof global.requestAnimationFrame !== 'function') return;
    const tick = (ts) => {
      renderPanoramaCanvas(ts);
      rafId = global.requestAnimationFrame(tick);
    };
    rafId = global.requestAnimationFrame(tick);
  }

  function stopAnimationLoop() {
    if (rafId && typeof global.cancelAnimationFrame === 'function') {
      global.cancelAnimationFrame(rafId);
    }
    rafId = null;
  }

  // --------------------------------------------------------------------------
  // 7. SVG İKONLAR, İBRELER VE KARŞILAŞTIRMA EĞRİSİ (SIFIR EMOJİ)
  // --------------------------------------------------------------------------
  function renderPlaceSvg(iconKind) {
    const common = 'width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    switch (iconKind) {
      case 'ingot':
        return `<svg ${common}><polygon points="4 17 7 9 17 9 20 17 4 17"/><line x1="9" y1="13" x2="15" y2="13"/></svg>`;
      case 'arch':
        return `<svg ${common}><path d="M4 20V10l8-6 8 6v10"/><path d="M9 20v-6a3 3 0 0 1 6 0v6"/></svg>`;
      case 'jar':
        return `<svg ${common}><rect x="6" y="7" width="12" height="14" rx="3"/><line x1="8" y1="4" x2="16" y2="4"/><line x1="9" y1="13" x2="15" y2="13"/></svg>`;
      case 'note':
        return `<svg ${common}><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>`;
      case 'market':
        return `<svg ${common}><path d="M3 9l2-5h14l2 5"/><path d="M5 9v11h14V9"/><line x1="9" y1="20" x2="9" y2="14"/><line x1="15" y1="20" x2="15" y2="14"/></svg>`;
      case 'truck':
        return `<svg ${common}><rect x="2" y="7" width="12" height="9" rx="1"/><path d="M14 10h4l3 3v3h-7v-6z"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/></svg>`;
      case 'plane':
        return `<svg ${common}><path d="M3 16l18-7-7 11-3-5-8 1z"/></svg>`;
      case 'refinery':
        return `<svg ${common}><rect x="4" y="10" width="5" height="10"/><rect x="12" y="6" width="7" height="14"/><path d="M6 6c1-2 3-2 4 0"/></svg>`;
      case 'steel':
        return `<svg ${common}><path d="M5 8h14l-2 9H7L5 8z"/><line x1="3" y1="8" x2="21" y2="8"/></svg>`;
      case 'radar':
        return `<svg ${common}><path d="M12 20v-4"/><path d="M5 11a9 9 0 0 0 14 0"/><line x1="12" y1="12" x2="17" y2="6"/></svg>`;
      case 'globe':
        return `<svg ${common}><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/></svg>`;
      case 'brick':
        return `<svg ${common}><rect x="3" y="6" width="18" height="12" rx="1"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="10" y1="6" x2="10" y2="12"/><line x1="14" y1="12" x2="14" y2="18"/></svg>`;
      case 'spool':
        return `<svg ${common}><line x1="6" y1="5" x2="18" y2="5"/><line x1="6" y1="19" x2="18" y2="19"/><rect x="8" y="5" width="8" height="14"/></svg>`;
      default:
        return `<svg ${common}><circle cx="12" cy="12" r="8"/></svg>`;
    }
  }

  function renderGaugeDialSvg(deg) {
    const clamped = Math.max(-88, Math.min(88, Number(deg) || 0));
    const rad = ((clamped - 90) * Math.PI) / 180;
    const nx = 36 + Math.cos(rad) * 22;
    const ny = 34 + Math.sin(rad) * 22;
    return `
      <svg viewBox="0 0 72 42" class="dlj-dial-svg" aria-hidden="true">
        <path d="M 10 34 A 26 26 0 0 1 62 34" fill="none" stroke="#dfd6c7" stroke-width="5" stroke-linecap="round"/>
        <path d="M 36 8 A 26 26 0 0 1 62 34" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" opacity="0.55"/>
        <line x1="36" y1="34" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="#1c1917" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="36" cy="34" r="3.4" fill="#0f766e"/>
      </svg>
    `;
  }

  function renderComparisonCurveSvg() {
    const pts = state.historyCurve || [];
    if (pts.length < 2) {
      return `<div class="dlj-curve-empty">İlk aylar ilerledikçe Senin Kilerin, Sabırlı Komşu ve Boş Nakit eğrileri burada çizilir.</div>`;
    }
    const w = 560;
    const h = 112;
    const maxV = Math.max(140, ...pts.map((p) => Math.max(p.userFiles, p.neighborFiles, p.idleCashFiles)));
    const toPoint = (i, v) => {
      const x = 10 + (i / 120) * (w - 20);
      const y = h - 12 - (Math.min(maxV, Math.max(0, v)) / maxV) * (h - 24);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    };

    const userPts = pts.map((p, i) => toPoint(i, p.userFiles)).join(' ');
    const nbPts = pts.map((p, i) => toPoint(i, p.neighborFiles)).join(' ');
    const idlePts = pts.map((p, i) => toPoint(i, p.idleCashFiles)).join(' ');

    return `
      <svg viewBox="0 0 ${w} ${h}" class="dlj-curve-svg" preserveAspectRatio="none" aria-label="120 aylık gerçek kiler karşılaştırması">
        <polyline fill="none" stroke="#b91c1c" stroke-width="1.6" stroke-dasharray="4 4" points="${idlePts}"/>
        <polyline fill="none" stroke="#64748b" stroke-width="2.1" points="${nbPts}"/>
        <polyline fill="none" stroke="#0f766e" stroke-width="3.0" points="${userPts}"/>
      </svg>
    `;
  }

  // --------------------------------------------------------------------------
  // 8. KAPSÜLLENMİŞ CSS ENJEKSİYONU (375px MOBİL & 1440px MASAÜSTÜ SIFIR TAŞMA)
  // --------------------------------------------------------------------------
  function ensureStylesInjected() {
    if (typeof document === 'undefined' || !document.head) return;
    if (document.getElementById(STYLE_ELEMENT_ID)) return;

    const st = document.createElement('style');
    st.id = STYLE_ELEMENT_ID;
    st.textContent = `
      .dlj-root, .dlj-root *, .dlj-root *::before, .dlj-root *::after {
        box-sizing: border-box;
      }
      .dlj-root {
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
        color: var(--ink-900, #1c1917);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .dlj-card {
        background: var(--bg-card, #fffdf9);
        border: 1px solid var(--border-stone, #dfd6c7);
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 6px 20px rgba(28, 25, 23, 0.05);
        max-width: 100%;
      }
      .dlj-topbar {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }
      .dlj-eyebrow {
        font-size: 11.5px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--copper-700, #b45309);
        margin-bottom: 4px;
      }
      .dlj-title {
        margin: 0 0 4px;
        font-size: 20px;
        font-weight: 800;
        letter-spacing: -0.3px;
        line-height: 1.25;
      }
      .dlj-sub {
        margin: 0;
        font-size: 13.5px;
        color: var(--ink-700, #44403c);
        max-width: 680px;
      }
      .dlj-controls {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 7px;
      }
      .dlj-btn {
        appearance: none;
        border: 1px solid var(--border-stone, #dfd6c7);
        background: var(--bg-subtle, #efe9dc);
        color: var(--ink-900, #1c1917);
        border-radius: 10px;
        padding: 8px 12px;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        line-height: 1.2;
        transition: background 0.15s ease, border-color 0.15s ease;
      }
      .dlj-btn:hover {
        border-color: var(--teal-700, #0f766e);
      }
      .dlj-btn-primary {
        background: var(--teal-700, #0f766e);
        border-color: var(--teal-700, #0f766e);
        color: #ffffff;
      }
      .dlj-btn-pause {
        background: #7c2d12;
        border-color: #7c2d12;
        color: #fef3c7;
      }
      .dlj-btn-unmask {
        background: #fef3c7;
        border-color: #f59e0b;
        color: #78350f;
      }
      .dlj-btn-unmask.active {
        background: #1c1917;
        border-color: #1c1917;
        color: #fde68a;
      }
      .dlj-btn.active-speed {
        background: #e6f4f1;
        border-color: #0f766e;
        color: #0f766e;
      }
      .dlj-panorama-wrap {
        position: relative;
        width: 100%;
        height: 300px;
        border-radius: 13px;
        overflow: hidden;
        border: 1px solid var(--border-stone, #dfd6c7);
        background: #e2e8f0;
        margin-top: 12px;
      }
      .dlj-panorama-canvas {
        width: 100%;
        height: 100%;
        display: block;
        touch-action: manipulation;
      }
      .dlj-scene-caption {
        margin-top: 9px;
        padding: 9px 12px;
        border-radius: 10px;
        background: var(--bg-linen, #f7f3eb);
        border: 1px solid var(--border-stone, #dfd6c7);
        font-size: 13px;
        color: var(--ink-700, #44403c);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px;
      }
      .dlj-timeline-bar {
        margin-top: 10px;
        width: 100%;
        height: 9px;
        background: var(--bg-subtle, #efe9dc);
        border-radius: 999px;
        overflow: hidden;
        position: relative;
      }
      .dlj-timeline-fill {
        height: 100%;
        background: linear-gradient(90deg, #0f766e 0%, #b45309 100%);
        transition: width 0.22s ease;
      }
      .dlj-trio-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }
      .dlj-panel-kicker {
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.45px;
        color: var(--ink-500, #78716c);
        margin-bottom: 6px;
      }
      .dlj-big-stat {
        font-size: 22px;
        font-weight: 800;
        color: var(--ink-900, #1c1917);
        line-height: 1.2;
        margin-bottom: 6px;
      }
      .dlj-pantry-items {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 7px;
        margin-top: 8px;
      }
      .dlj-pantry-pill {
        background: var(--bg-linen, #f7f3eb);
        border: 1px solid var(--border-stone, #dfd6c7);
        border-radius: 9px;
        padding: 7px 9px;
        font-size: 12px;
      }
      .dlj-pantry-pill strong {
        display: block;
        font-size: 13.5px;
        color: var(--ink-900, #1c1917);
      }
      /* Masadaki Eriyen 100 TL Banknot Numunesi */
      .dlj-banknote-stage {
        margin: 10px 0;
        padding: 10px;
        border-radius: 11px;
        background: var(--bg-linen, #f7f3eb);
        border: 1px dashed #a8a29e;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .dlj-note-ghost {
        width: 128px;
        height: 56px;
        border: 1.5px dashed #78716c;
        border-radius: 6px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: rgba(255,255,255,0.5);
      }
      .dlj-note-real {
        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        color: #ffffff;
        border: 1px solid #075985;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 10px;
        overflow: hidden;
        white-space: nowrap;
        transition: width 0.25s ease, height 0.25s ease;
      }
      /* Sabırlı Komşu Kıyas Çubukları */
      .dlj-compare-bars {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 8px 0 10px;
      }
      .dlj-cmp-row {
        font-size: 12px;
      }
      .dlj-cmp-head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3px;
        font-weight: 600;
      }
      .dlj-cmp-track {
        height: 8px;
        background: var(--bg-subtle, #efe9dc);
        border-radius: 999px;
        overflow: hidden;
      }
      .dlj-cmp-fill {
        height: 100%;
        border-radius: 999px;
        transition: width 0.25s ease;
      }
      .dlj-curve-svg {
        width: 100%;
        height: 92px;
        display: block;
        background: var(--bg-linen, #f7f3eb);
        border: 1px solid var(--border-stone, #dfd6c7);
        border-radius: 9px;
      }
      .dlj-curve-empty {
        font-size: 12px;
        color: var(--ink-500, #78716c);
        padding: 12px;
        background: var(--bg-linen, #f7f3eb);
        border-radius: 9px;
      }
      /* İki Kulak Dinleme Alanı */
      .dlj-ears-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }
      .dlj-ear-lead {
        background: linear-gradient(160deg, #f3faf8 0%, #fffdf9 100%);
        border: 1px solid #99f6e4;
      }
      .dlj-ear-noise {
        background: linear-gradient(160deg, #faf5eb 0%, #fffdf9 100%);
        border: 1px solid #e7d8c1;
      }
      .dlj-dials-row {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 10px;
      }
      .dlj-dial-box {
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid var(--border-stone, #dfd6c7);
        border-radius: 10px;
        padding: 6px;
        text-align: center;
      }
      .dlj-dial-svg {
        width: 64px;
        height: 38px;
        display: block;
        margin: 0 auto;
      }
      .dlj-dial-box span {
        display: block;
        font-size: 11px;
        font-weight: 700;
        color: var(--ink-700, #44403c);
      }
      .dlj-dial-box small {
        font-size: 10.5px;
        color: var(--teal-700, #0f766e);
        font-weight: 700;
      }
      .dlj-whisper-box {
        margin-top: 9px;
        padding: 9px 11px;
        border-radius: 9px;
        background: #fef3c7;
        border: 1px solid #fcd34d;
        color: #78350f;
        font-size: 12.5px;
        font-weight: 600;
      }
      /* 4 Yaşam Kapısı Tezgâhı */
      .dlj-held-strip {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 7px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--bg-linen, #f7f3eb);
        border: 1px solid var(--border-stone, #dfd6c7);
        margin-bottom: 12px;
        font-size: 12.5px;
      }
      .dlj-held-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #ffffff;
        border: 1px solid var(--border-stone, #dfd6c7);
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 600;
      }
      .dlj-held-chip button {
        appearance: none;
        border: none;
        background: var(--bg-subtle, #efe9dc);
        color: var(--ink-900, #1c1917);
        border-radius: 999px;
        padding: 2px 7px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }
      .dlj-quarters-tabs {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 12px;
      }
      .dlj-qtab {
        appearance: none;
        border: 1px solid var(--border-stone, #dfd6c7);
        background: var(--bg-linen, #f7f3eb);
        color: var(--ink-700, #44403c);
        border-radius: 11px;
        padding: 10px 9px;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        text-align: left;
      }
      .dlj-qtab.active {
        background: var(--teal-700, #0f766e);
        border-color: var(--teal-700, #0f766e);
        color: #ffffff;
      }
      .dlj-places-stage {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .dlj-place-bench {
        border: 1px solid var(--border-stone, #dfd6c7);
        background: #ffffff;
        border-radius: 13px;
        padding: 13px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
      }
      .dlj-place-bench.is-held {
        border-color: #0f766e;
        background: linear-gradient(180deg, #f5fbf9 0%, #ffffff 100%);
      }
      .dlj-place-head {
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }
      .dlj-place-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: var(--bg-linen, #f7f3eb);
        color: var(--teal-700, #0f766e);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .dlj-place-title {
        margin: 0 0 3px;
        font-size: 15px;
        font-weight: 800;
        line-height: 1.25;
      }
      .dlj-place-pulse {
        font-size: 12px;
        font-weight: 700;
        color: var(--copper-700, #b45309);
      }
      .dlj-place-desc {
        margin: 0;
        font-size: 12.5px;
        color: var(--ink-700, #44403c);
        line-height: 1.45;
      }
      .dlj-place-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      /* 10 Yıllık Kişisel Hafıza Aynası */
      .dlj-epochs-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
      .dlj-epoch-box {
        background: var(--bg-linen, #f7f3eb);
        border: 1px solid var(--border-stone, #dfd6c7);
        border-radius: 12px;
        padding: 12px;
        font-size: 12.5px;
      }
      .dlj-epoch-box h4 {
        margin: 0 0 2px;
        font-size: 13.5px;
        font-weight: 800;
      }
      .dlj-epoch-range {
        font-size: 11px;
        color: var(--ink-500, #78716c);
        margin-bottom: 8px;
      }
      .dlj-epoch-list {
        margin: 0;
        padding-left: 15px;
        color: var(--ink-700, #44403c);
      }
      .dlj-epoch-list li {
        margin-bottom: 4px;
      }
      .dlj-mirror-prose {
        padding: 13px 15px;
        border-radius: 12px;
        background: linear-gradient(135deg, #fffdf9 0%, #f4ede0 100%);
        border: 1px solid var(--border-stone, #dfd6c7);
        font-size: 13.5px;
        line-height: 1.55;
        color: var(--ink-900, #1c1917);
      }
      @media (max-width: 920px) {
        .dlj-trio-grid, .dlj-ears-grid, .dlj-epochs-grid {
          grid-template-columns: minmax(0, 1fr);
        }
        .dlj-quarters-tabs {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 600px) {
        .dlj-card {
          padding: 13px;
        }
        .dlj-panorama-wrap {
          height: 255px;
        }
        .dlj-places-stage {
          grid-template-columns: minmax(0, 1fr);
        }
        .dlj-quarters-tabs {
          grid-template-columns: minmax(0, 1fr);
        }
        .dlj-title {
          font-size: 17.5px;
        }
      }
    `;
    document.head.appendChild(st);
  }

  // --------------------------------------------------------------------------
  // 9. KALICI İSKELET VE SEÇİCİ DOM GÜNCELLEMESİ (CANVAS HİÇ SIFIRLANMAZ!)
  // --------------------------------------------------------------------------
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildSkeleton() {
    if (!hostEl) return;
    hostEl.innerHTML = `
      <div class="dlj-root">
        <section class="dlj-card">
          <div class="dlj-topbar" data-slot="header"></div>
          <div class="dlj-panorama-wrap">
            <canvas class="dlj-panorama-canvas" data-slot="canvas"></canvas>
          </div>
          <div class="dlj-timeline-bar">
            <div class="dlj-timeline-fill" data-slot="progress"></div>
          </div>
          <div class="dlj-scene-caption" data-slot="caption"></div>
        </section>

        <section class="dlj-trio-grid" data-slot="trio"></section>

        <section class="dlj-ears-grid" data-slot="ears"></section>

        <section class="dlj-card" data-slot="bench"></section>

        <section class="dlj-card" data-slot="memory"></section>
      </div>
    `;

    els = {
      header: hostEl.querySelector('[data-slot="header"]'),
      canvas: hostEl.querySelector('[data-slot="canvas"]'),
      progress: hostEl.querySelector('[data-slot="progress"]'),
      caption: hostEl.querySelector('[data-slot="caption"]'),
      trio: hostEl.querySelector('[data-slot="trio"]'),
      ears: hostEl.querySelector('[data-slot="ears"]'),
      bench: hostEl.querySelector('[data-slot="bench"]'),
      memory: hostEl.querySelector('[data-slot="memory"]')
    };
  }

  function syncHeaderOnly() {
    if (!els || !els.header || !state) return;
    const pack = getHistoryPack();
    const maxTransitions = Math.max(1, pack.months.length - 1);
    const { label } = parseYm(state.ym);
    const season = getSeasonInfo(state.ym);

    els.header.innerHTML = `
      <div>
        <div class="dlj-eyebrow">${escapeHtml(season.name)} Mevsimi · ${escapeHtml(label)} · ${state.idx} / ${maxTransitions} Ay</div>
        <h2 class="dlj-title">10 Yıllık Hızlandırılmış Ev ve Memleket Yolculuğu</h2>
        <p class="dlj-sub">Kasım 2016'dan Kasım 2026'ya gerçek Türkiye verileriyle mutfak kilerini, eriyen banknotu, öncü saha ibresini ve kendi karar evrimini yaşa.</p>
      </div>
      <div class="dlj-controls">
        ${state.playing
          ? `<button type="button" class="dlj-btn dlj-btn-pause" data-dlj-act="pause">Duraklat</button>`
          : `<button type="button" class="dlj-btn dlj-btn-primary" data-dlj-act="play" data-ms="${state.speedMs}">Yolculuğu Başlat</button>`}
        <button type="button" class="dlj-btn" data-dlj-act="step">+1 Ay İlerle</button>
        <button type="button" class="dlj-btn ${state.playing && state.speedMs >= 7000 ? 'active-speed' : ''}" data-dlj-act="play" data-ms="8000">Sakin</button>
        <button type="button" class="dlj-btn ${state.playing && state.speedMs > 1800 && state.speedMs < 7000 ? 'active-speed' : ''}" data-dlj-act="play" data-ms="3200">Akıcı</button>
        <button type="button" class="dlj-btn ${state.playing && state.speedMs <= 1800 ? 'active-speed' : ''}" data-dlj-act="play" data-ms="950">Hızlı</button>
        <button type="button" class="dlj-btn dlj-btn-unmask ${state.unmasked ? 'active' : ''}" data-dlj-act="toggle-unmask">
          ${state.unmasked ? 'Yalın Hayat Görünümüne Dön' : 'Gerçek Hayattaki Adlarını Göster'}
        </button>
        <button type="button" class="dlj-btn" data-dlj-act="reset">Baştan Başla</button>
      </div>
    `;
  }

  function syncUI() {
    if (!els || !state) return;
    const pack = getHistoryPack();
    const maxTransitions = Math.max(1, pack.months.length - 1);
    const m0 = pack.months[0];
    const val = evaluateHousehold();
    const ears = computeTwoEarsIntel(state.idx);
    const mem = buildMemoryNarrative(val);

    syncHeaderOnly();

    if (els.progress) {
      const pct = Math.min(100, Math.max(0, (state.idx / maxTransitions) * 100));
      els.progress.style.width = `${pct.toFixed(1)}%`;
    }

    if (els.caption) {
      const statusHint = val.stuckCratesCount > 0
        ? `Kapı önünde elde kalan ${val.stuckCratesCount} ahşap sandık bekliyor`
        : (val.sleeplessLampActive
          ? `Çatıda %${val.debtRatioPct} borç ağırlığı var; gece lambası uykusuz`
          : `Çatı borçsuz ve dingin · Mutfak filesi ${state.cumCpiFactor.toFixed(2)} kat pahalandı`);
      els.caption.innerHTML = `
        <span>${escapeHtml(anim.canvasNotice)}</span>
        <strong>${escapeHtml(statusHint)}</strong>
      `;
    }

    // 1) ÜÇLÜ EV ŞERİDİ: Erzak Rafları | Eriyen 100 TL Banknot | Sabırlı Komşu Kıyaslaması
    const noteW = Math.max(12, Math.round(124 * (val.banknoteScalePct / 100)));
    const noteH = Math.max(10, Math.round(52 * Math.sqrt(val.banknoteScalePct / 100)));
    const maxCmp = Math.max(120, val.realFiles, val.neighborFiles, val.pureIdleBenchmarkFiles);

    els.trio.innerHTML = `
      <div class="dlj-card">
        <div class="dlj-panel-kicker">Evimizin Erzak Rafları (Gerçek Alım Gücü)</div>
        <div class="dlj-big-stat">${val.realFiles} Mutfak Filesi</div>
        <div style="font-size:12px;color:var(--ink-700,#44403c);">
          Bugüne dek alın teriyle koyduğun: <strong>${state.contributedRealFiles.toFixed(1)} File</strong>
          ${state.unmasked ? ` · Nominal varlık: ${Math.round(val.netWorthTL).toLocaleString('tr-TR')} ₺` : ''}
        </div>
        <div class="dlj-pantry-items">
          <div class="dlj-pantry-pill">
            <span>Somun Ekmek</span>
            <strong>${val.loafCount.toLocaleString('tr-TR')} adet</strong>
          </div>
          <div class="dlj-pantry-pill">
            <span>5 Lt Zeytinyağı</span>
            <strong>${val.oliveJugs.toLocaleString('tr-TR')} teneke</strong>
          </div>
          <div class="dlj-pantry-pill">
            <span>Kışlık Erzak Çuvalı</span>
            <strong>${val.fuelSacks.toLocaleString('tr-TR')} çuval</strong>
          </div>
          <div class="dlj-pantry-pill">
            <span>Ev Çatısı Tuğlası</span>
            <strong>${val.homeBricks.toLocaleString('tr-TR')} tuğla</strong>
          </div>
        </div>
      </div>

      <div class="dlj-card">
        <div class="dlj-panel-kicker">Masadaki Eriyen 2016 Banknot Destesi</div>
        <div class="dlj-big-stat">100 ₺ -> %${val.banknoteScalePct} Boyut</div>
        <div class="dlj-banknote-stage">
          <div class="dlj-note-ghost" title="Kasım 2016'daki 100 TL boyutu (%100)">
            <div class="dlj-note-real" style="width:${noteW}px;height:${noteH}px;">${noteW >= 42 ? '100 ₺' : ''}</div>
          </div>
          <div style="font-size:12px;color:var(--ink-700,#44403c);">
            2016'da <strong>80 ekmek</strong> alan boş 100 ₺, bugün <strong>${val.banknoteLoavesNow} ekmek</strong> alıyor.<br/>
            <span>1 Mutfak Filesi: 100 ₺ -> <strong>${Math.round(val.currentFilePriceTL).toLocaleString('tr-TR')} ₺</strong></span>
          </div>
        </div>
        <div style="font-size:12px;color:${val.idleCashSharePct > 40 ? '#9a3412' : 'var(--ink-700,#44403c)'};">
          Masada açıkta duran nakdin: <strong>${val.idleCashFiles} File</strong> (Varlığının %${val.idleCashSharePct} kadarı)
        </div>
      </div>

      <div class="dlj-card">
        <div class="dlj-panel-kicker">Hiçbir Şey Yapmadan İşine Gücüne Bakan Sabırlı Komşu</div>
        <div class="dlj-compare-bars">
          <div class="dlj-cmp-row">
            <div class="dlj-cmp-head">
              <span>Senin Kilerin (${state.tradeCount} hamle)</span>
              <strong>${val.realFiles} File</strong>
            </div>
            <div class="dlj-cmp-track">
              <div class="dlj-cmp-fill" style="width:${((val.realFiles / maxCmp) * 100).toFixed(1)}%;background:#0f766e;"></div>
            </div>
          </div>
          <div class="dlj-cmp-row">
            <div class="dlj-cmp-head">
              <span>Sabırlı Komşu (0 al-sat telaşı)</span>
              <strong>${val.neighborFiles} File</strong>
            </div>
            <div class="dlj-cmp-track">
              <div class="dlj-cmp-fill" style="width:${((val.neighborFiles / maxCmp) * 100).toFixed(1)}%;background:#64748b;"></div>
            </div>
          </div>
          <div class="dlj-cmp-row">
            <div class="dlj-cmp-head">
              <span>Hep Boş Nakitte Bekleyen</span>
              <strong>${val.pureIdleBenchmarkFiles} File</strong>
            </div>
            <div class="dlj-cmp-track">
              <div class="dlj-cmp-fill" style="width:${((val.pureIdleBenchmarkFiles / maxCmp) * 100).toFixed(1)}%;background:#b91c1c;"></div>
            </div>
          </div>
        </div>
        ${renderComparisonCurveSvg()}
      </div>
    `;

    // 2) İKİ KULAK DİNLEME KÖŞESİ ("İNCE KULAK OLUŞTURMA")
    els.ears.innerHTML = `
      <div class="dlj-card dlj-ear-lead">
        <div class="dlj-panel-kicker" style="color:#0f766e;">1. Kulak · Toprak, Mazot ve Fabrika Bacası İbresi (Gerçek Öncü İz)</div>
        <div class="dlj-dials-row">
          ${ears.gauges.map((g) => `
            <div class="dlj-dial-box">
              ${renderGaugeDialSvg(g.needleDeg)}
              <span>${escapeHtml(g.label)}</span>
              <small>${escapeHtml(g.stateText)}</small>
            </div>
          `).join('')}
        </div>
        <p style="margin:0 0 6px;font-size:13.5px;font-weight:700;">${escapeHtml(ears.leadHeadline)}</p>
        <p style="margin:0;font-size:12.5px;color:var(--ink-700,#44403c);">${escapeHtml(ears.leadCausalHint)}</p>
      </div>

      <div class="dlj-card dlj-ear-noise">
        <div class="dlj-panel-kicker" style="color:#9a3412;">2. Kulak · Sokak Dedikodusu ve Geç Gelen Manşet (Gürültü)</div>
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;line-height:1.4;">${escapeHtml(ears.streetHeadline)}</p>
        <p style="margin:0;font-size:12.5px;color:var(--ink-500,#78716c);">
          Gazete manşeti ve kahvehane sohbeti genellikle hammadde ibresi döndükten aylar sonra, hareketin sonuna doğru gürültü çıkarır.
        </p>
        ${ears.streetWhisper ? `<div class="dlj-whisper-box">${escapeHtml(ears.streetWhisper)}</div>` : ''}
      </div>
    `;

    // 3) 4 YAŞAM KAPISI VE SIFIR-JARGON YER KARARLARI
    const activeQ = QUARTERS.find((q) => q.id === state.activeQuarter) || QUARTERS[0];
    const visiblePlaces = PLACES.filter((p) => p.quarter === activeQ.id);

    const placePulseLabel = (p) => {
      if (p.kind === 'sukuk') {
        return state.unmasked
          ? `Yıllık Brüt %${val.mRow.sukukGross} · %0 Stopaj Kesintisiz`
          : `Yıllık kesintisiz kira koruma hızı: %${val.mRow.sukukGross}`;
      }
      if (p.kind === 'deposit') {
        const netRate = +((Number(val.mRow.depGross) || 12) * (1 - (Number(val.mRow.stopaj) || 15) / 100)).toFixed(1);
        return state.unmasked
          ? `Brüt %${val.mRow.depGross} · %${val.mRow.stopaj} Stopaj (Net %${netRate})`
          : `Kesinti sonrası yıllık kavanoz hızı: %${netRate}`;
      }
      const curUnit = getUnitPriceTL(p, val.mRow);
      const startUnit = getUnitPriceTL(p, m0);
      const realMult = startUnit > 0 ? ((curUnit / startUnit) / state.cumCpiFactor) : 1;
      const loavesFrom100 = Math.round(100 * realMult);
      if (state.unmasked) {
        return `${p.masterCode} · Birim: ${curUnit.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺ · 2016'dan reel ${realMult.toFixed(2)}x`;
      }
      return `2016'da buraya konan 100 ekmek gücü bugün ${loavesFrom100} ekmek ediyor`;
    };

    els.bench.innerHTML = `
      <div class="dlj-held-strip">
        <span>Masadaki Boş Nakit: <strong>${val.idleCashFiles} File</strong> (${Math.round(state.cashTL).toLocaleString('tr-TR')} ₺)</span>
        ${val.holdings.length === 0
          ? `<span style="color:var(--ink-500,#78716c);">· Henüz hiçbir durağa emanet bırakmadın; tüm nakdin mutfak masasında duruyor.</span>`
          : val.holdings.map((h) => {
              const title = state.unmasked ? h.place.masterCode : h.place.noviceName;
              return `
                <span class="dlj-held-chip">
                  ${escapeHtml(title)}: <strong>${h.realFiles} File</strong>
                  <button type="button" data-dlj-sell="${h.id}" data-ratio="0.5">Yarısını Çek</button>
                </span>
              `;
            }).join('')}
      </div>

      <div class="dlj-quarters-tabs">
        ${QUARTERS.map((q) => `
          <button type="button" class="dlj-qtab ${q.id === activeQ.id ? 'active' : ''}" data-dlj-quarter="${q.id}">
            ${escapeHtml(state.unmasked ? q.masterLabel : q.noviceLabel)}
          </button>
        `).join('')}
      </div>

      <p style="margin:0 0 12px;font-size:13px;color:var(--ink-700,#44403c);">${escapeHtml(activeQ.subtitle)}</p>

      <div class="dlj-places-stage">
        ${visiblePlaces.map((p) => {
          const heldObj = val.holdings.find((h) => h.id === p.id);
          const pTitle = state.unmasked ? p.masterName : p.noviceName;
          return `
            <div class="dlj-place-bench ${heldObj ? 'is-held' : ''}">
              <div>
                <div class="dlj-place-head">
                  <div class="dlj-place-icon">${renderPlaceSvg(p.icon)}</div>
                  <div>
                    <h3 class="dlj-place-title">${escapeHtml(pTitle)}</h3>
                    <div class="dlj-place-pulse">${escapeHtml(placePulseLabel(p))}</div>
                  </div>
                </div>
                <p class="dlj-place-desc" style="margin-top:8px;">${escapeHtml(p.realLifeRole)}</p>
              </div>
              <div>
                <div style="font-size:12px;margin-bottom:7px;color:var(--ink-700,#44403c);">
                  Buradaki Emanetin: <strong>${heldObj ? `${heldObj.realFiles} File (${heldObj.realPnlFiles >= 0 ? '+' : ''}${heldObj.realPnlFiles} File reel fark)` : 'Yok'}</strong>
                </div>
                <div class="dlj-place-actions">
                  <button type="button" class="dlj-btn dlj-btn-primary" data-dlj-buy="${p.id}" data-ratio="0.25">Naktin %25'ini Emanet Et</button>
                  <button type="button" class="dlj-btn" data-dlj-buy="${p.id}" data-ratio="0.50">Yarısını Emanet Et</button>
                  ${heldObj ? `
                    <button type="button" class="dlj-btn" data-dlj-sell="${p.id}" data-ratio="0.50">Yarısını Eve Çek</button>
                    <button type="button" class="dlj-btn" data-dlj-sell="${p.id}" data-ratio="1.00">Tamamını Çöz</button>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}

        ${activeQ.id === 'crowd_shortcuts' ? `
          <div class="dlj-place-bench ${state.debtTL > 0 ? 'is-held' : ''}">
            <div>
              <div class="dlj-place-head">
                <div class="dlj-place-icon">${renderPlaceSvg('jar')}</div>
                <div>
                  <h3 class="dlj-place-title">Bankanın Kredi ve Borç Gişesi</h3>
                  <div class="dlj-place-pulse">
                    Yıllık borç maliyeti: %${((Number(val.mRow.policy) || 15) + 9).toFixed(1)} · Çatıdaki borç oranı: %${val.debtRatioPct}
                  </div>
                </div>
              </div>
              <p class="dlj-place-desc" style="margin-top:8px;">
                Olmayan parayla kileri büyütmeye çalışmak güneşli günde tatlı görünür; ancak borç oranı %25'i aştığında çatıya demir ağırlıklar biner, %65 sınırında ise fırtına dibinde malların zorla satılır.
              </p>
            </div>
            <div class="dlj-place-actions">
              <button type="button" class="dlj-btn" data-dlj-debt="BORROW">15 Filelik Borç Yüklen</button>
              ${state.debtTL > 0 ? `<button type="button" class="dlj-btn dlj-btn-primary" data-dlj-debt="REPAY">Masadaki Nakitle Borcu Kapat</button>` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // 4) 10 YILLIK KİŞİSEL HAFIZA AYNASI ("ESKİ KAFAMLA ŞİMDİKİ AKLIM ARASINDAKİ FARK")
    const renderEpochCard = (ep) => {
      if (ep.monthsObserved === 0) {
        return `
          <div class="dlj-epoch-box">
            <h4>${escapeHtml(ep.label)}</h4>
            <div class="dlj-epoch-range">${escapeHtml(ep.rangeLabel)}</div>
            <p style="margin:0;color:var(--ink-500,#78716c);">Zaman bu yıllara ulaştığında buradaki gerçek ayak izlerin kayda geçecek.</p>
          </div>
        `;
      }
      const avgIdlePct = Math.round(ep.idleCashShareSum / ep.monthsObserved);
      return `
        <div class="dlj-epoch-box">
          <h4>${escapeHtml(ep.label)}</h4>
          <div class="dlj-epoch-range">${escapeHtml(ep.rangeLabel)} · ${ep.monthsObserved} ay yaşandı</div>
          <ul class="dlj-epoch-list">
            <li>Yer değiştirme telaşı: <strong>${ep.tradeCount} hamle</strong> (Sürtünme: ${ep.churnLostFiles.toFixed(1)} file)</li>
            <li>Masada açıkta bekleyen nakit ortalaması: <strong>%${avgIdlePct}</strong></li>
            <li>Fırtınada korku satışı: <strong>${ep.panicSales}</strong> · Fırtınada sakin toplama: <strong>${ep.calmStormBuys}</strong></li>
            <li>Sürü coşkusu kapısına giriş: <strong>${ep.rumorChases}</strong> · Ağır borçlu ay: <strong>${ep.highDebtMonths}</strong></li>
            ${ep.memorableMoments.map((m) => `<li><em>${escapeHtml(m)}</em></li>`).join('')}
          </ul>
        </div>
      `;
    };

    els.memory.innerHTML = `
      <div class="dlj-eyebrow">Uzun Dönemli Kişisel Hafıza Aynası</div>
      <h3 class="dlj-title" style="font-size:18px;margin-bottom:8px;">${escapeHtml(mem.headline)}</h3>
      <div class="dlj-mirror-prose">
        <p style="margin:0 0 8px;">${escapeHtml(mem.body)}</p>
        <p style="margin:0;font-weight:700;color:var(--teal-700,#0f766e);">${escapeHtml(mem.neighborVerdict)}</p>
      </div>
      <div class="dlj-epochs-grid">
        ${renderEpochCard(state.epochs.early)}
        ${renderEpochCard(state.epochs.middle)}
        ${renderEpochCard(state.epochs.late)}
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 10. ETKİLEŞİM DELEGASYONU & YAŞAM DÖNGÜSÜ (PUBLIC API)
  // --------------------------------------------------------------------------
  function onContainerClick(ev) {
    const target = ev.target && typeof ev.target.closest === 'function'
      ? ev.target.closest('[data-dlj-act],[data-dlj-quarter],[data-dlj-buy],[data-dlj-sell],[data-dlj-debt]')
      : null;
    if (!target || !state) return;

    const act = target.getAttribute('data-dlj-act');
    if (act === 'play') {
      const ms = Number(target.getAttribute('data-ms')) || state.speedMs;
      startPlayback(ms);
      return;
    }
    if (act === 'pause') {
      stopPlayback();
      syncUI();
      return;
    }
    if (act === 'step') {
      stopPlayback();
      stepOneMonth();
      return;
    }
    if (act === 'toggle-unmask') {
      state.unmasked = !state.unmasked;
      syncUI();
      return;
    }
    if (act === 'reset') {
      reset();
      return;
    }

    const qId = target.getAttribute('data-dlj-quarter');
    if (qId) {
      state.activeQuarter = qId;
      syncUI();
      return;
    }

    const buyId = target.getAttribute('data-dlj-buy');
    if (buyId) {
      const r = Number(target.getAttribute('data-ratio')) || 0.25;
      entrustOrWithdraw(buyId, 'BUY', r);
      return;
    }

    const sellId = target.getAttribute('data-dlj-sell');
    if (sellId) {
      const r = Number(target.getAttribute('data-ratio')) || 0.50;
      entrustOrWithdraw(sellId, 'SELL', r);
      return;
    }

    const debtAct = target.getAttribute('data-dlj-debt');
    if (debtAct) {
      adjustHouseholdDebt(debtAct);
    }
  }

  function onCanvasPointer(ev) {
    if (!els || !els.canvas || !state) return;
    const rect = typeof els.canvas.getBoundingClientRect === 'function'
      ? els.canvas.getBoundingClientRect()
      : null;
    if (!rect || rect.width <= 0) return;
    const relX = (ev.clientX - rect.left) / rect.width;
    const val = evaluateHousehold();

    if (relX < 0.34) {
      anim.canvasNotice = `Evimizin Kileri: Raflarda ${val.loafCount.toLocaleString('tr-TR')} somun ekmek, ${val.oliveJugs} teneke zeytinyağı ve ${val.homeBricks} ev tuğlası gücü birikti.`;
    } else if (relX < 0.56) {
      anim.canvasNotice = `Mutfak Masası: 2016'nın 100 ₺ banknotu enflasyon karşısında %${val.banknoteScalePct} boyutuna indi (80 ekmekten ${val.banknoteLoavesNow} ekmeğe).`;
    } else if (relX < 0.68 && val.stuckCratesCount > 0) {
      anim.canvasNotice = `Kapı Önü: Kalabalık coşkusuyla tepeden girilen yerlerden kalan ${val.stuckCratesCount} ahşap sandık avluda bekliyor.`;
    } else {
      anim.canvasNotice = `Yan Evdeki Sabırlı Komşu: Hiçbir dedikoduya bakmadan 0 al-sat ile kilerini ${val.neighborFiles} mutfak filesine ulaştırdı.`;
    }
    syncUI();
  }

  function mount(containerEl, opts = {}) {
    if (!containerEl) return null;
    unmount();
    mountOpts = opts || {};
    hostEl = containerEl;

    ensureStylesInjected();
    if (!state || opts.fresh) {
      state = createFreshState(opts.unmasked != null ? opts.unmasked : false);
    } else if (opts.unmasked != null) {
      state.unmasked = Boolean(opts.unmasked);
    }
    if (opts.speedMs && Number(opts.speedMs) > 0) {
      state.speedMs = Math.max(80, Number(opts.speedMs));
    }

    buildSkeleton();
    hostEl.addEventListener('click', onContainerClick);
    if (els && els.canvas) {
      els.canvas.addEventListener('click', onCanvasPointer);
    }

    if (typeof ResizeObserver !== 'undefined' && els?.canvas) {
      resizeObs = new ResizeObserver(() => {
        renderPanoramaCanvas(anim.lastTs || 16);
      });
      resizeObs.observe(els.canvas);
    } else if (typeof global.addEventListener === 'function') {
      onWinResize = () => renderPanoramaCanvas(anim.lastTs || 16);
      global.addEventListener('resize', onWinResize);
    }

    syncUI();
    renderPanoramaCanvas(16);
    startAnimationLoop();

    if (opts.autoPlay) {
      startPlayback(state.speedMs);
    }
    return getState();
  }

  function unmount() {
    stopPlayback();
    stopAnimationLoop();
    if (resizeObs) {
      try { resizeObs.disconnect(); } catch (_) {}
      resizeObs = null;
    }
    if (onWinResize && typeof global.removeEventListener === 'function') {
      global.removeEventListener('resize', onWinResize);
      onWinResize = null;
    }
    if (els && els.canvas && typeof els.canvas.removeEventListener === 'function') {
      els.canvas.removeEventListener('click', onCanvasPointer);
    }
    if (hostEl && typeof hostEl.removeEventListener === 'function') {
      hostEl.removeEventListener('click', onContainerClick);
      hostEl.innerHTML = '';
    }
    hostEl = null;
    els = null;
  }

  global.DecadeLifeJourney = {
    mount,
    unmount,
    stepOneMonth,
    startPlayback,
    stopPlayback,
    reset,
    getState,
    entrustOrWithdraw,
    adjustHouseholdDebt,
    setUnmasked(flag) {
      if (!state) state = createFreshState(Boolean(flag));
      state.unmasked = Boolean(flag);
      syncUI();
      return state.unmasked;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
