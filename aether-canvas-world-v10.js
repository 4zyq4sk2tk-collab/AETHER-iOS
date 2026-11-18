// ============================================================================
// AETHER v10.0 — MEKÂN 1: 60FPS ETKİLEŞİMLİ TÜRKİYE EKONOMİ HARİTASI (<canvas>),
// NEDENSEL KALDIRAÇ KOLLARI, ORGANİK SİS VE SIFIR-TABLO ATÖLYE SOKAKLARI
// ============================================================================
(function (global) {
  'use strict';

  const LANDMARKS = [
    {
      id: 'fener-pazar',
      x: 0.29, y: 0.36,
      title: 'Mahalle Fırını & Pazar Filesi',
      subtitle: 'Un, yağ, süt, POS harcaması ve mutfak enflasyonu',
      kind: 'core',
      color: '#d97706',
      primaryKeys: ['reel-perakende-bimas', 'reel-perakende-mgros', 'halka-arz-tabgd', 'emtia-tarim-dba'],
      bistSectors: ['Gıda, İçecek & Tarım', 'Ticaret & Perakende'],
      streetStory: 'Mahalledeki kasa her akşam peşin dolar; tedarikçiye ise 45 gün sonra ödeme yapılır. Enflasyon mutfağı yaktığında raf etiketi aynı hafta güncellenir.'
    },
    {
      id: 'kapalicarsi-kiler',
      x: 0.22, y: 0.28,
      title: 'Kapalıçarşı & Taş Kiler',
      subtitle: 'Fiziki külçe altın, gümüş ve Darphane sertifika terazisi',
      kind: 'core',
      color: '#b45309',
      primaryKeys: ['gram-altin-spot', 'ceyrek-altin', 'gram-gumus-spot', 'altin-sertifikasi', 'altin-fonu-zgold', 'gumus-fonu-gmstr'],
      bistSectors: ['Madencilik & Kıymetli Metal'],
      streetStory: 'Sabah 09:30’da kepenk açar, 18:30’da kapatır. Fiziki külçede kambiyo vergisi yoktur; ama borsadaki sertifikaya (ALTIN.S1) dikkat etmezsen +%14 hava parası ödersin.'
    },
    {
      id: 'banka-hazine',
      x: 0.29, y: 0.16,
      title: 'Banka & Hazine Kulesi',
      subtitle: 'PPF, %0 stopajlı Sukuk, vadeli mevduat ve döviz gişesi',
      kind: 'core',
      color: '#0f766e',
      primaryKeys: ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust', 'dibs-tahvil', 'doviz-usd', 'doviz-eur', 'doviz-chf'],
      bistSectors: ['Bankacılık & Mevduat'],
      streetStory: '7/24 ışığı yanar ama gece 17:30’dan sonra döviz makasını %3,60’a açar ve binde 2 kambiyo vergisi keser. Aynı kulede %0 stopajlı Hazine Sukuk kalkanı da durur.'
    },
    {
      id: 'izmit-rafineri',
      x: 0.34, y: 0.29,
      title: 'İzmit–Aliağa Rafineri & Enerji',
      subtitle: 'Ham petrol, mazot pompası, trafo ve güneş santralleri',
      kind: 'core',
      color: '#c2410c',
      primaryKeys: ['bist-tuprs', 'reel-enerji-astor', 'reel-enerji-cwene', 'emtia-petrol-bno'],
      bistSectors: ['Enerji, Elektrik & Gaz', 'Kimya, İlaç & Petrol'],
      streetStory: 'Gemilerle gelen ham petrol burada mazota dönüşür. Pompadaki her artış 12 gün içinde kamyon navlununa, 30 gün içinde pazardaki domatese yansır.'
    },
    {
      id: 'kocaeli-otomotiv',
      x: 0.36, y: 0.44,
      title: 'Kocaeli–Bursa İhracat Fabrikaları',
      subtitle: 'Avrupa’ya Euro ile giden kamyonlar ve yan sanayi aks/kord zinciri',
      kind: 'core',
      color: '#1d4ed8',
      primaryKeys: ['bist-froto', 'bist-toaso', 'bist-egeen', 'bist-parsn', 'bist-kords'],
      bistSectors: ['Otomotiv & Yan Sanayi', 'Makine & Sanayi Üretimi', 'Ev Eşyası, Tekstil & Tüketim'],
      streetStory: 'Banttan inen her 10 aracın 8’i gemiyle Avrupa’ya Euro karşılığı gider. Ana fabrika vardiya artırdığında aks, fren ve lastik kord bezini üreten yan atölyelerin kasası önceden dolar.'
    },
    {
      id: 'zonguldak-celik',
      x: 0.52, y: 0.22,
      title: 'Karadeniz–İskenderun Çelik & Cam Ocakları',
      subtitle: 'Yassı çelik sac, soda külü, çimento ve şantiye demiri',
      kind: 'core',
      color: '#4338ca',
      primaryKeys: ['bist-eregl', 'bist-sise', 'bist-cimsa', 'gayrimenkul-konut-ekgyo', 'gayrimenkul-ticari-rygyo'],
      bistSectors: ['Demir-Çelik & Metal Sanayi', 'Taş, Toprak & Çimento', 'Gayrimenkul (GYO) & İnşaat'],
      streetStory: 'Yüksek fırın soğumaz; ancak küresel demir cevheri ve doğalgaz faturası şiştiğinde marj daralır, sanayi canlandığında ise her fabrika bu ocağın sacına mecbur kalır.'
    },
    {
      id: 'bogaz-havalimani',
      x: 0.13, y: 0.22,
      title: 'Boğaz & Kıtalararası Havalimanı',
      subtitle: 'Dövizle kesilen uçak biletleri, yer hizmetleri ve turizm kapısı',
      kind: 'core',
      color: '#0369a1',
      primaryKeys: ['bist-thyao', 'bist-pgsus', 'bist-tavhl', 'bist-clebi'],
      bistSectors: ['Ulaştırma, Havacılık & Lojistik', 'Turizm, Medya & Hizmet'],
      streetStory: 'Giderinin bir kısmı TL, bilet gelirinin tamamına yakını dolar ve eurodur. Petrol ucuzlayıp turizm açıldığında döviz darphanesine dönüşür.'
    },
    {
      id: 'ankara-savunma',
      x: 0.49, y: 0.47,
      title: 'Ankara Savunma, Yazılım & Küresel Hat',
      subtitle: 'Radar siparişi, kurumsal yazılım ve ABD teknoloji sepeti',
      kind: 'core',
      color: '#6d28d9',
      primaryKeys: ['bist-asels', 'halka-arz-altny', 'reel-yazilim-logo', 'abd-sp500-spy', 'abd-nasdaq-qqq', 'kuresel-hisse-nvda'],
      bistSectors: ['Teknoloji, Yazılım & Savunma', 'Telekomünikasyon'],
      streetStory: 'Yıllara yayılan kesinleşmiş savunma sözleşmeleri ve döviz bazlı teknoloji sepetleri; kısa vadeli iç tüketim daralmasından bağımsız büyür.'
    },
    // --- ORGANİK BULUTLA ÖRTÜLÜ 4 İLERİ BÖLGE (HİLE BUTONU YOKTUR, YAŞAYARAK AÇILIR!) ---
    {
      id: 'mkk-balina-limani',
      x: 0.15, y: 0.49,
      title: 'MKK Takas & Balina İskelesi',
      subtitle: 'Sessiz pay toplama mavnaları vs. sosyal medya megafon kalabalığı',
      kind: 'fog',
      milestoneKey: 'executedRealOrder',
      fogHint: 'Bu iskele üzerindeki sis, içeride ilk gerçek alım veya satım kararını verdiğinde kendiliğinden dağılır.',
      color: '#0f766e',
      primaryKeys: ['bist-100', 'fon-yerli-hisse-zpbdl', 'fon-katilim-z30kp'],
      bistSectors: ['Holding & Çoklu Yatırım']
    },
    {
      id: 'valör-takas-kulesi',
      x: 0.68, y: 0.34,
      title: 'T+2 Takas & 13:30 Valör Kulesi',
      subtitle: 'Takas kum saati, ay sonu fon akışları ve temettü takvimi',
      kind: 'fog',
      milestoneKey: 'waitedSettlementOrValor',
      fogHint: 'Bu kulenin sisi, bir T+2 takas süresini veya 13:30 TEFAS valörünü gerçekten beklediğinde dağılır.',
      color: '#9a3412',
      primaryKeys: ['bist-temettu-25', 'fon-yerli-bist30-apx30', 'eurobond-usdtr'],
      bistSectors: ['Sigorta & Emeklilik']
    },
    {
      id: 'tms29-mutfak',
      x: 0.64, y: 0.56,
      title: 'TMS-29 Arka Mutfak Terazisi',
      subtitle: 'Gerçek VUK kasa nakdi (OCF) ile kağıt üstü enflasyon kârı ayrımı',
      kind: 'fog',
      milestoneKey: 'inspectedCashScale',
      fogHint: 'Herhangi bir şirket dükkânına girip Kasa Terazisini incelediğinde bu mutfağın sisi kalkar.',
      color: '#15803d',
      primaryKeys: ['bist-bimas', 'bist-froto', 'bist-sasa'],
      bistSectors: ['Kağıt, Ambalaj & Orman']
    },
    {
      id: 'gtip-viop-koprusu',
      x: 0.80, y: 0.44,
      title: 'Gümrük GTİP & 15:00 VİOP Köprüsü',
      subtitle: '12 haneli gümrük sevkiyat verisi ve kaldıraçlı teminat köprüsü',
      kind: 'fog',
      milestoneKey: 'completedArenaYear',
      fogHint: 'Zaman Tünelinde en az 12 aylık gerçek fırtınayı tamamladığında bu sınır kapısı açılır.',
      color: '#be123c',
      primaryKeys: ['viop-bist30-kontrat', 'kripto-btc', 'eurobond-emb'],
      bistSectors: ['Aracı Kurum, Faktoring & Finans']
    }
  ];

  // Gerçek Tedarik Zinciri Bağlantıları (Harita Üzerinde Canlı Kamyon/Gemi Rotaları)
  const SUPPLY_ROUTES = [
    { from: 'izmit-rafineri', to: 'kocaeli-otomotiv', label: 'Mazot & Petrokimya' },
    { from: 'izmit-rafineri', to: 'fener-pazar', label: 'Soğuk Zincir Mazotu' },
    { from: 'zonguldak-celik', to: 'kocaeli-otomotiv', label: 'Yassı Çelik Sac' },
    { from: 'kocaeli-otomotiv', to: 'bogaz-havalimani', label: 'Avrupa İhracat Gemisi' },
    { from: 'banka-hazine', to: 'fener-pazar', label: 'POS & Ticari Kredi' },
    { from: 'kapalicarsi-kiler', to: 'banka-hazine', label: 'Fiziki - Kaydi Makas' }
  ];

  // Şirket Bazlı Hammadde -> Atölye -> Müşteri Zinciri Sözlüğü
  const COMPANY_CHAINS = {
    FROTO: { up: ['Yassı Çelik Sac (EREGL)', 'Enerji & Mazot (TUPRS)'], peers: ['EGEEN (Aks)', 'PARSN (Dövme Çelik)', 'KORDS'], down: 'Avrupa Ticari Araç İhracatı (%80 Euro Gelir)' },
    TOASO: { up: ['Yassı Çelik Sac (EREGL)', 'İthal Yarı İletken'], peers: ['BFREN', 'OTKAR', 'DOAS'], down: 'İç Pazar & Avrupa Hafif Ticari Satışı' },
    TUPRS: { up: ['Brent Ham Petrol Gemileri', 'Doğalgaz Enerjisi'], peers: ['AYGAZ', 'PETKM'], down: '81 İl Mazot, Benzin ve Havalimanı Jet Yakıtı (THYAO)' },
    THYAO: { up: ['Jet Yakıtı (TUPRS)', 'Küresel Filo Kirası'], peers: ['PGSUS', 'TAVHL', 'CLEBI', 'DOCO'], down: '130 Ülke Dolar/Euro Yolcu ve Kargo Kasası' },
    BIMAS: { up: ['Tarım & Buğday (DBA)', 'Soğuk Zincir Mazotu'], peers: ['MGROS', 'SOKM', 'TABGD'], down: 'Mahalle Mutfak Filesi (Peşin Tahsilat, Sıfır Stok Çürümesi)' },
    EREGL: { up: ['Demir Cevheri', 'Koklaşabilir Taşkömürü'], peers: ['KRDMD', 'ISDMR', 'CEMTS'], down: 'Otomotiv (FROTO), Beyaz Eşya (ARCLK) ve Boru Sanayi' },
    ASELS: { up: ['Yarı İletken Çip (SOXX)', 'Nitelikli Mühendislik'], peers: ['ALTNY', 'SDTTR', 'MIATK'], down: 'Uzun Vadeli Savunma Sipariş Defteri (Döviz Endeksli)' },
    ASTOR: { up: ['Silisli Sac & Elektrolitik Bakır (GTİP 8504)'], peers: ['CWENE', 'SMRTG', 'EUPWR'], down: 'TEİAŞ Şebeke ve Avrupa Trafo İhracatı' },
    EKGYO: { up: ['Hazır Beton & Çimento (CIMSA/AKCNS)', 'İnşaat Demiri'], peers: ['ISGYO', 'RYGYO', 'TRGYO'], down: 'Konut İhaleleri (Faiz Yükseldiğinde Talep Yavaşlar)' },
    SASA: { up: ['İthal PTA & Monoetilen Glikol', 'Yüksek Yatırım Kredisi'], peers: ['AKSA', 'KORDS'], down: 'Polyester Elyaf & Cips (Borç/Nakit Dengesi Kritik)' }
  };

  let canvas = null;
  let ctx = null;
  let animId = null;
  let selectedLandmarkId = 'fener-pazar';
  let activeSectorFilter = 'ALL';
  let searchQuery = '';
  let activeDrawerAssetKey = null;
  let selectedDoor = 'BAZAAR';
  let selectedMaturityDays = 32;

  // Nedensel Kaldıraç Kolları Durumu (-30% .. +50%)
  const levers = {
    dieselPct: 0,
    fxPct: 0,
    ratePts: 0,
    droughtPct: 0
  };

  // Canlı Parçacıklar
  const particles = [];
  for (let i = 0; i < 36; i++) {
    particles.push({
      routeIdx: i % SUPPLY_ROUTES.length,
      t: (i * 0.17) % 1,
      speed: 0.0022 + (i % 5) * 0.0005
    });
  }

  function fmtTL(n) {
    return Math.round(Number(n) || 0).toLocaleString('tr-TR') + ' ₺';
  }

  function fmtUnitTL(n) {
    const v = Number(n) || 0;
    if (v >= 1000) return Math.round(v).toLocaleString('tr-TR') + ' ₺';
    return v.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
  }

  // --------------------------------------------------------------------------
  // 1. SABAH TEK GERÇEK HİKÂYE VE ÖNÜMDEKİ İKİ YOL ÜRETİCİSİ
  // --------------------------------------------------------------------------
  function buildMorningStory() {
    const K = global.AetherKernelV10;
    const md = K.getMarketData();
    const clock = K.getTurkishClock();
    const dInfo = K.getDarphanePremiumInfo();
    const feed = md?.liveRealWorldFeed || [];
    const topFeed = feed[0] || null;
    const infYoY = K.getAnnualInflationPct();
    const sukuk = K.getAsset('kira-sertifikasi-sukuk');
    const sukukRate = sukuk ? sukuk.annualGrossRatePct : 36.5;

    if (!clock.isBizDay || clock.bistPhase === 'CLOSED') {
      return {
        kicker: `${clock.ymd} · ${clock.shortTimeStr} · ${clock.isWeekend ? 'Hafta Sonu Kepenkleri Kapalı' : 'Mesai Dışı Akşam Nöbeti'}`,
        headline: topFeed
          ? `Günün Gerçek Akışı: "${topFeed.title}"`
          : `Borsa İstanbul ve Kapalıçarşı şu an dinleniyor; mobil bankalarda ise döviz ve altın makası %${clock.bankSpreadPct.toFixed(2)} açık.`,
        subtext: `Gerçek hayatta mesai dışında yapılan her acele döviz/altın işlemi gişede ~%${(clock.bankSpreadPct / 2 + 0.2).toFixed(2)} makas ve kambiyo vergisi bırakır. Sabırlı kaptan kepenk açılışını bekler.`,
        roadA: {
          label: '1. Yol: Gece Makasını Gör, Kepenk Açılışını Bekle',
          action: () => openWorkshopDrawer('gram-altin-spot')
        },
        roadB: {
          label: '2. Yol: 10 Yıllık Zaman Tünelinde Antrenman Yap',
          action: () => global.AetherSwitchSpace && global.AetherSwitchSpace('arena')
        }
      };
    }

    if (dInfo.premiumPct >= 8.0) {
      return {
        kicker: `${clock.ymd} · ${clock.shortTimeStr} · ${clock.bistLabel}`,
        headline: topFeed
          ? `${topFeed.title} — Öte yandan borsadaki altın sertifikası (ALTIN.S1) fiziki gram altından +%${dInfo.premiumPct} daha pahalı!`
          : `Bugün tartıda dikkat çeken gerçek: Borsadaki Darphane sertifikası (${fmtTL(dInfo.s1GramEquiv)}/gr), Kapalıçarşı fiziki altından (${fmtTL(dInfo.spotGramPrice)}/gr) tam ${fmtTL(dInfo.diffTL)} daha pahalı.`,
        subtext: `Enflasyon yıllık %${infYoY.toFixed(1)} akarken aynı mala +%${dInfo.premiumPct} hava parası ödemek yerine fiziki kiler veya %0 stopajlı Hazine Kira Sertifikası (%${sukukRate}) kalkanını tartabilirsin.`,
        roadA: {
          label: '1. Yol: Altın Terazisinde Hava Parasını Tart',
          action: () => openWorkshopDrawer('altin-sertifikasi')
        },
        roadB: {
          label: '2. Yol: Kasası Nakit Dolu İhracat Fabrikalarına Bak',
          action: () => selectLandmark('kocaeli-otomotiv')
        }
      };
    }

    return {
      kicker: `${clock.ymd} · ${clock.shortTimeStr} · ${clock.bistLabel}`,
      headline: topFeed ? topFeed.title : `Borsa İstanbul seansı açık; yıllık %${infYoY.toFixed(1)} enflasyona karşı gerçek kasa nakdi üreten atölyeler ayrışıyor.`,
      subtext: `Manşete kapılmak yerine hammadde maliyetine ve şirketin kasasına giren gerçek faturaya odaklan.`,
      roadA: {
        label: '1. Yol: Mahalle Kileri ve Gıda Zincirine Git',
        action: () => selectLandmark('fener-pazar')
      },
      roadB: {
        label: '2. Yol: Vergisiz Hazine Kira Kalkanını İncele',
        action: () => openWorkshopDrawer('kira-sertifikasi-sukuk')
      }
    };
  }

  // --------------------------------------------------------------------------
  // 2. NEDENSEL KALDIRAÇ ETKİ HESAPLAYICISI (GÜN 1 -> GÜN 12 -> GÜN 30 DALGASI)
  // --------------------------------------------------------------------------
  function computeCausalRipple() {
    const d = levers.dieselPct;
    const fx = levers.fxPct;
    const r = levers.ratePts;
    const dr = levers.droughtPct;

    const active = Math.abs(d) > 0 || Math.abs(fx) > 0 || Math.abs(r) > 0 || Math.abs(dr) > 0;
    // Ampirik esneklikler (2.500 günlük BIST-Makro beta matrisinden kalibre)
    const transportCostPct = +(d * 0.42 + fx * 0.28).toFixed(1);
    const groceryBasketPct = +(d * 0.24 + fx * 0.31 + dr * 0.38).toFixed(1);
    const exporterMarginPct = +(fx * 0.55 - d * 0.14 - r * 0.08).toFixed(1);
    const indebtedGyoPct = +(-r * 0.72 - d * 0.18 + fx * 0.10).toFixed(1);
    const refineryCashPct = +(d * 0.48 + fx * 0.35).toFixed(1);

    return {
      active,
      transportCostPct,
      groceryBasketPct,
      exporterMarginPct,
      indebtedGyoPct,
      refineryCashPct,
      day1Text: `Gün 1 (Hammadde Kapısı): Pompa ve gümrük giriş faturası ${transportCostPct >= 0 ? '+' : ''}%${transportCostPct} oynadı; rafineri (TÜPRAŞ) kasası ${refineryCashPct >= 0 ? '+' : ''}%${refineryCashPct} etkilendi.`,
      day12Text: `Gün 12 (Fabrika & Kamyon): Euro ihracatçısı (FROTO/EGEEN) marjı ${exporterMarginPct >= 0 ? '+' : ''}%${exporterMarginPct} değişirken, borçlu şantiye/GYO tarafı ${indebtedGyoPct >= 0 ? '+' : ''}%${indebtedGyoPct} baskı gördü.`,
      day30Text: `Gün 30 (Mutfak Tenceresi): Baraj ve nakliye etkisiyle mahalle pazar filesi ${groceryBasketPct >= 0 ? '+' : ''}%${groceryBasketPct} zamlandı; boşta duran nakit TL aynı oranda küçüldü.`
    };
  }

  // --------------------------------------------------------------------------
  // 3. 60FPS HiDPI <CANVAS> HARİTA ÇİZİM VE ETKİLEŞİM MOTORU
  // --------------------------------------------------------------------------
  function getNodePixel(lm, w, h) {
    return { x: lm.x * w, y: lm.y * h };
  }

  function renderCanvasFrame(ts) {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 40 || rect.height < 40) {
      animId = requestAnimationFrame(renderCanvasFrame);
      return;
    }
    const dpr = Math.min(2, global.devicePixelRatio || 1);
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.save();
    ctx.scale(dpr, dpr);

    const K = global.AetherKernelV10;
    const clock = K.getTurkishClock();
    const member = K.getActiveMember();
    const milestones = member?.livedMilestones || {};
    const isNight = clock.hh >= 19 || clock.hh < 7;

    // 1) Deniz Arka Planı (Gündüz Ege/Marmara Mavisi vs Akşam Laciverti)
    const seaGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (isNight) {
      seaGrad.addColorStop(0, '#0f172a');
      seaGrad.addColorStop(1, '#1e293b');
    } else {
      seaGrad.addColorStop(0, '#dbeafe');
      seaGrad.addColorStop(1, '#bfdbfe');
    }
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 0, w, h);

    // 2) Trakya & Anadolu Kara Silüeti (Stilize Organik Yarımada)
    const landColor = levers.droughtPct >= 20
      ? (isNight ? '#3b2f26' : '#ede0c8')
      : (isNight ? '#1f2937' : '#f5efe4');
    const landStroke = isNight ? '#475569' : '#cbbba0';

    // Trakya Yakası
    ctx.beginPath();
    ctx.moveTo(w * 0.05, h * 0.10);
    ctx.lineTo(w * 0.24, h * 0.12);
    ctx.lineTo(w * 0.25, h * 0.24);
    ctx.lineTo(w * 0.12, h * 0.30);
    ctx.lineTo(w * 0.04, h * 0.22);
    ctx.closePath();
    ctx.fillStyle = landColor;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = landStroke;
    ctx.stroke();

    // Anadolu Yarımadası
    ctx.beginPath();
    ctx.moveTo(w * 0.27, h * 0.22);
    ctx.quadraticCurveTo(w * 0.45, h * 0.13, w * 0.65, h * 0.16);
    ctx.quadraticCurveTo(w * 0.84, h * 0.15, w * 0.95, h * 0.24);
    ctx.lineTo(w * 0.94, h * 0.66);
    ctx.quadraticCurveTo(w * 0.72, h * 0.74, w * 0.50, h * 0.72);
    ctx.quadraticCurveTo(w * 0.30, h * 0.74, w * 0.13, h * 0.60);
    ctx.quadraticCurveTo(w * 0.10, h * 0.42, w * 0.21, h * 0.34);
    ctx.quadraticCurveTo(w * 0.31, h * 0.32, w * 0.27, h * 0.22);
    ctx.closePath();
    ctx.fillStyle = landColor;
    ctx.fill();
    ctx.strokeStyle = landStroke;
    ctx.stroke();

    // Baraj / Su Havzası Göstergesi (Orta-Doğu Anadolu)
    const waterScale = Math.max(0.35, 1 - (levers.droughtPct / 75));
    ctx.beginPath();
    ctx.ellipse(w * 0.73, h * 0.52, 22 * waterScale, 11 * waterScale, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = isNight ? '#0284c7' : '#38bdf8';
    ctx.fill();

    // 3) Tedarik Zinciri Yolları ve Canlı Kamyon/Gemi Parçacıkları
    const dieselStress = levers.dieselPct >= 15;
    for (let rIdx = 0; rIdx < SUPPLY_ROUTES.length; rIdx++) {
      const route = SUPPLY_ROUTES[rIdx];
      const a = LANDMARKS.find((l) => l.id === route.from);
      const b = LANDMARKS.find((l) => l.id === route.to);
      if (!a || !b) continue;
      const pA = getNodePixel(a, w, h);
      const pB = getNodePixel(b, w, h);

      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.strokeStyle = dieselStress
        ? 'rgba(220, 38, 38, 0.55)'
        : (isNight ? 'rgba(148, 163, 184, 0.38)' : 'rgba(120, 113, 108, 0.42)');
      ctx.lineWidth = dieselStress ? 2.2 : 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (const pt of particles) {
      const route = SUPPLY_ROUTES[pt.routeIdx];
      const a = LANDMARKS.find((l) => l.id === route.from);
      const b = LANDMARKS.find((l) => l.id === route.to);
      if (!a || !b) continue;
      const speedMult = clock.bistCanMatchNow ? 1.0 : 0.35;
      pt.t = (pt.t + pt.speed * speedMult) % 1;
      const pA = getNodePixel(a, w, h);
      const pB = getNodePixel(b, w, h);
      const px = pA.x + (pB.x - pA.x) * pt.t;
      const py = pA.y + (pB.y - pA.y) * pt.t;

      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = dieselStress ? '#dc2626' : '#d97706';
      ctx.fill();
    }

    // 4) Merkez ve Bölge Düğümleri + Organik Sis Bulutları
    for (const lm of LANDMARKS) {
      const pos = getNodePixel(lm, w, h);
      const isFogLocked = lm.kind === 'fog' && !milestones[lm.milestoneKey];
      const isSelected = lm.id === selectedLandmarkId;

      if (isFogLocked) {
        // Organik Yüzen Sis Kümesi (Hile butonu yok; yumuşak yarı saydam bulut katmanı)
        const drift = Math.sin((ts || 0) / 1400 + lm.x * 8) * 4;
        ctx.save();
        ctx.fillStyle = isNight ? 'rgba(51, 65, 85, 0.86)' : 'rgba(226, 232, 240, 0.90)';
        ctx.beginPath();
        ctx.arc(pos.x + drift - 12, pos.y + 2, 16, 0, Math.PI * 2);
        ctx.arc(pos.x + drift + 4, pos.y - 4, 19, 0, Math.PI * 2);
        ctx.arc(pos.x + drift + 18, pos.y + 3, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isNight ? '#64748b' : '#94a3b8';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = isNight ? '#cbd5e1' : '#475569';
        ctx.font = '600 10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Sisli Bölge', pos.x + drift + 2, pos.y + 2);
        ctx.restore();
        continue;
      }

      // Seçili Düğüm Halesi
      if (isSelected) {
        const pulse = 18 + Math.sin((ts || 0) / 360) * 3;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217, 119, 6, 0.22)';
        ctx.fill();
      }

      // Düğüm Gövdesi
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isSelected ? 12 : 9.5, 0, Math.PI * 2);
      ctx.fillStyle = lm.color;
      ctx.fill();
      ctx.lineWidth = isSelected ? 2.8 : 1.8;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Fabrika Bacası / Kepenk Durumu Küçük İşareti
      if (lm.id === 'kapalicarsi-kiler' && !clock.grandBazaarOpen) {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(pos.x + 7, pos.y - 11, 7, 7);
      }

      // Okunaklı Etiket Kutusu
      const shortTitle = lm.title.split('&')[0].trim();
      ctx.font = (isSelected ? '700 ' : '600 ') + (w < 460 ? '10px' : '11px') + ' -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      const tw = ctx.measureText(shortTitle).width + 10;
      const lx = Math.max(tw / 2 + 4, Math.min(w - tw / 2 - 4, pos.x));
      const ly = pos.y + (lm.y < 0.24 ? -20 : 21);

      ctx.fillStyle = isNight ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 252, 245, 0.92)';
      ctx.strokeStyle = isSelected ? lm.color : (isNight ? '#334155' : '#d6d3d1');
      ctx.lineWidth = isSelected ? 1.6 : 1;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(lx - tw / 2, ly - 9, tw, 17, 5);
      else ctx.rect(lx - tw / 2, ly - 9, tw, 17);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isNight ? '#f8fafc' : '#1c1917';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(shortTitle, lx, ly);
    }

    // Sağ Üst Canlı Seans & Deniz Feneri Durumu
    const statusText = clock.bistCanMatchNow
      ? `BIST Açık (${clock.shortTimeStr})`
      : (clock.grandBazaarOpen ? `Çarşı Açık · BIST Kapalı (${clock.shortTimeStr})` : `Kepenkler Kapalı (${clock.shortTimeStr})`);
    ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const sw = ctx.measureText(statusText).width + 16;
    ctx.fillStyle = isNight ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.9)';
    ctx.fillRect(w - sw - 10, 10, sw, 22);
    ctx.fillStyle = clock.bistCanMatchNow ? '#15803d' : '#b45309';
    ctx.textAlign = 'left';
    ctx.fillText(statusText, w - sw - 2, 21);

    ctx.restore();
    animId = requestAnimationFrame(renderCanvasFrame);
  }

  function handleCanvasTap(ev) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = (ev.clientX || (ev.touches && ev.touches[0]?.clientX) || 0) - rect.left;
    const cy = (ev.clientY || (ev.touches && ev.touches[0]?.clientY) || 0) - rect.top;
    const w = rect.width;
    const h = rect.height;

    let closest = null;
    let bestDist = 42;
    for (const lm of LANDMARKS) {
      const p = getNodePixel(lm, w, h);
      const dist = Math.hypot(cx - p.x, cy - p.y);
      if (dist < bestDist) {
        bestDist = dist;
        closest = lm;
      }
    }
    if (!closest) return;

    const milestones = global.AetherKernelV10.getActiveMember()?.livedMilestones || {};
    if (closest.kind === 'fog' && !milestones[closest.milestoneKey]) {
      showWorldToast(`${closest.title}: ${closest.fogHint}`);
      return;
    }
    selectLandmark(closest.id);
  }

  function selectLandmark(landmarkId) {
    selectedLandmarkId = landmarkId;
    activeSectorFilter = 'LANDMARK';
    renderWorkshopSection();
    const el = document.getElementById('v10WorkshopSection');
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // --------------------------------------------------------------------------
  // 4. SIFIR-TABLO ATÖLYE SOKAĞI (69 VARLIK + 619 BIST ŞİRKETİ GÖRSEL DÜKKÂNLARI)
  // --------------------------------------------------------------------------
  function getWorkshopAssets() {
    const K = global.AetherKernelV10;
    const all = K.getAllAssets().filter((a) => a.venue !== 'BENCHMARK_ONLY');
    const q = searchQuery.trim().toUpperCase();

    if (q.length > 0) {
      return all
        .filter((a) => a.ticker.toUpperCase().includes(q) || a.name.toUpperCase().includes(q) || (a.categoryName || '').toUpperCase().includes(q))
        .slice(0, 36);
    }

    if (activeSectorFilter === 'ALL_BIST_CASH') {
      return all
        .filter((a) => a.bistRow && a.bistRow.ocfMillionTL > 0 && !a.isPumpAnomaly)
        .sort((a, b) => (b.bistRow.ocfMillionTL || 0) - (a.bistRow.ocfMillionTL || 0))
        .slice(0, 24);
    }

    if (activeSectorFilter === 'ARMOR_AND_METALS') {
      return all.filter((a) => a.categoryId === '1' || a.categoryId === '2').slice(0, 24);
    }

    if (activeSectorFilter === 'GLOBAL_AND_FUNDS') {
      return all.filter((a) => a.categoryId === '4' || a.isForeignUsd || a.venue === 'CRYPTO_24_7').slice(0, 24);
    }

    // Seçili Harita Bölgesinin Dükkânları
    const lm = LANDMARKS.find((l) => l.id === selectedLandmarkId) || LANDMARKS[0];
    const picked = [];
    const seen = new Set();
    for (const key of (lm.primaryKeys || [])) {
      const a = K.getAsset(key);
      if (a && !seen.has(a.key)) {
        picked.push(a);
        seen.add(a.key);
      }
    }
    for (const a of all) {
      if (picked.length >= 18) break;
      if (seen.has(a.key)) continue;
      if (a.bistRow && (lm.bistSectors || []).includes(a.bistRow.sector)) {
        picked.push(a);
        seen.add(a.key);
      }
    }
    return picked;
  }

  function describeShopfrontPlainly(asset) {
    const blindMode = global.AetherKernelV10.getState()?.blindMode;
    const r = asset.bistRow;
    let badge = 'Canlı Gişe';
    let tone = 'neutral';
    let cashLine = '';

    if (asset.isRateInstrument) {
      const netAnnual = +(asset.annualGrossRatePct * (1 - asset.stopajPct / 100)).toFixed(1);
      badge = asset.stopajPct === 0 ? '%0 Stopaj Kalkanı' : `%${asset.stopajPct} Stopajlı Getiri`;
      tone = asset.stopajPct === 0 ? 'good' : 'neutral';
      cashLine = `Yıllık brüt %${asset.annualGrossRatePct.toFixed(1)} -> Vergi sonrası net %${netAnnual} hızında çalışır.`;
    } else if (asset.subVenue === 'DARPHANE_S1') {
      const d = global.AetherKernelV10.getDarphanePremiumInfo();
      badge = d.premiumPct >= 5 ? `+%${d.premiumPct} Hava Parası Dikkat!` : 'Darphane Sertifikası';
      tone = d.premiumPct >= 5 ? 'warn' : 'good';
      cashLine = `100 payı ${fmtTL(d.s1GramEquiv)} ediyor; Kapalıçarşı fiziki gram altından ${fmtTL(d.diffTL)} daha pahalı.`;
    } else if (asset.venue === 'TWO_DOOR') {
      badge = 'İki Kapılı Gişe (Çarşı vs Banka)';
      tone = 'good';
      cashLine = `Kapalıçarşı’da %0 vergi ve dar makas; Mobil Banka’da binde 2 kambiyo vergisi + saatlik makas işler.`;
    } else if (r) {
      if (r.ocfMillionTL != null && r.ocfMillionTL > 0 && (r.cashConversionRatio == null || r.cashConversionRatio >= 0.9)) {
        badge = 'Kasasına Gerçek Nakit Giren Atölye';
        tone = 'good';
        cashLine = `Kasaya giren yıllık gerçek faaliyet nakdi: +${r.ocfMillionTL.toLocaleString('tr-TR')} Milyon ₺.`;
      } else if (r.netIncomeMillionTL > 0 && r.ocfMillionTL < 0) {
        badge = 'Kağıt Kârı Var, Kasadan Nakit Çıkıyor!';
        tone = 'warn';
        cashLine = `Bilançoda +${r.netIncomeMillionTL.toLocaleString('tr-TR')}M ₺ kağıt kâr yazsa da kasadan ${r.ocfMillionTL.toLocaleString('tr-TR')}M ₺ nakit çıkmış.`;
      } else {
        badge = r.sector || 'Borsa İstanbul Tahtası';
        cashLine = r.turnoverMillionTL > 0
          ? `Günlük tahta işlem hacmi: ${r.turnoverMillionTL.toLocaleString('tr-TR')} Milyon ₺.`
          : 'Borsa İstanbul seans saatlerinde (10:00–18:00) işlem görür.';
      }
    } else if (asset.isGvk80) {
      badge = 'Küresel Döviz Varlığı (Yİ-ÜFE Vergi Kuralı)';
      cashLine = `Dolar bazında küresel ortaklık sağlar; satışta Yİ-ÜFE endekslemesi sonrası beyan kuralı geçerlidir.`;
    } else {
      cashLine = `Anlık birim değeri ${fmtTL(asset.priceTL)}.`;
    }

    const displayTitle = blindMode
      ? `İsimsiz Dükkân #${asset.ticker.slice(0, 2)} (${asset.categoryName.replace(/^\d+\.\s*/, '')})`
      : asset.name;

    return { displayTitle, badge, tone, cashLine };
  }

  function renderWorkshopSection() {
    const host = document.getElementById('v10WorkshopSection');
    if (!host) return;
    const K = global.AetherKernelV10;
    const blindMode = K.getState()?.blindMode;
    const lm = LANDMARKS.find((l) => l.id === selectedLandmarkId) || LANDMARKS[0];
    const items = getWorkshopAssets();

    host.innerHTML = `
      <div class="v10-workshop-header">
        <div>
          <div class="v10-eyebrow">${activeSectorFilter === 'LANDMARK' ? 'Seçili Bölge Sokakları' : 'Tüm Memleket Dükkânları (69 Araç + 619 Şirket)'}</div>
          <h3 class="v10-sec-title">${activeSectorFilter === 'LANDMARK' ? lm.title : 'Atölye ve Kiler Rehberi'}</h3>
          <p class="v10-sec-sub">${activeSectorFilter === 'LANDMARK' ? lm.streetStory : 'Sıkıcı tarama tablosu yok: Her kart şirketin kasasına gerçekten para girip girmediğini ve gişe kuralını çıplak gözle gösterir.'}</p>
        </div>
        <div class="v10-workshop-controls">
          <input id="v10AssetSearch" class="v10-input" type="search" placeholder="619 şirket veya maden ara (THYAO, FROTO, Altın, Sukuk...)" value="${escapeHtml(searchQuery)}" />
          <div class="v10-filter-pills">
            <button class="v10-pill ${activeSectorFilter === 'LANDMARK' ? 'active' : ''}" data-wfilter="LANDMARK">Harita Bölgesi</button>
            <button class="v10-pill ${activeSectorFilter === 'ARMOR_AND_METALS' ? 'active' : ''}" data-wfilter="ARMOR_AND_METALS">Altın, Döviz & Kalkanlar</button>
            <button class="v10-pill ${activeSectorFilter === 'ALL_BIST_CASH' ? 'active' : ''}" data-wfilter="ALL_BIST_CASH">Kasası Nakit Basan Şirketler</button>
            <button class="v10-pill ${activeSectorFilter === 'GLOBAL_AND_FUNDS' ? 'active' : ''}" data-wfilter="GLOBAL_AND_FUNDS">Fonlar & Dünya</button>
            <button class="v10-pill ${blindMode ? 'active-amber' : ''}" id="v10ToggleBlindBtn">${blindMode ? 'İsimsiz Keşif: AÇIK' : 'İsimleri Gizle, İşinden Tanı'}</button>
          </div>
        </div>
      </div>
      <div class="v10-shop-grid">
        ${items.map((a) => {
          const info = describeShopfrontPlainly(a);
          const chg = Number(a.change1D) || 0;
          const priceStr = a.isRateInstrument
            ? `%${a.annualGrossRatePct.toFixed(1)} Yıllık`
            : fmtUnitTL(a.priceTL);
          return `
            <article class="v10-shop-card tone-${info.tone}" data-open-asset="${escapeHtml(a.key)}">
              <div class="v10-shop-top">
                <span class="v10-shop-badge tone-${info.tone}">${escapeHtml(info.badge)}</span>
                <span class="v10-shop-chg ${chg >= 0 ? 'pos' : 'neg'}">${a.isRateInstrument ? 'Günlük Birikim' : `${chg >= 0 ? '+' : ''}%${chg.toFixed(2)}`}</span>
              </div>
              <h4 class="v10-shop-title">${escapeHtml(info.displayTitle)}</h4>
              <p class="v10-shop-story">${escapeHtml(info.cashLine)}</p>
              <div class="v10-shop-foot">
                <span class="v10-shop-price">${blindMode && !a.isRateInstrument ? 'Tabelayı Aç ve İncele' : priceStr}</span>
                <span class="v10-shop-cta">Arka Mutfağa Gir -></span>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;

    const sInput = document.getElementById('v10AssetSearch');
    if (sInput) {
      sInput.addEventListener('input', (e) => {
        searchQuery = e.target.value || '';
        renderWorkshopSection();
        const again = document.getElementById('v10AssetSearch');
        if (again) {
          again.focus();
          again.setSelectionRange(searchQuery.length, searchQuery.length);
        }
      });
    }

    host.querySelectorAll('[data-wfilter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeSectorFilter = btn.getAttribute('data-wfilter');
        searchQuery = '';
        renderWorkshopSection();
      });
    });

    const blindBtn = document.getElementById('v10ToggleBlindBtn');
    if (blindBtn) {
      blindBtn.addEventListener('click', () => {
        K.toggleBlindMode();
        renderWorkshopSection();
      });
    }

    host.querySelectorAll('[data-open-asset]').forEach((card) => {
      card.addEventListener('click', () => {
        openWorkshopDrawer(card.getAttribute('data-open-asset'));
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. 360° DÜKKÂN ARKA MUTFAĞI, KASA TERAZİSİ VE İKİ KAPILI CANLI GİŞE ÇEKMECESİ
  // --------------------------------------------------------------------------
  function openWorkshopDrawer(assetKey) {
    const K = global.AetherKernelV10;
    const asset = K.getAsset(assetKey);
    if (!asset) return;
    activeDrawerAssetKey = asset.key;
    // Bir şirketin arka mutfak kasa terazisini incelemek, TMS-29 Arka Mutfak bulutunu organik olarak dağıtır!
    if (asset.bistRow || asset.subVenue === 'DARPHANE_S1') {
      K.markInspectedCashScale();
    }
    renderDrawerContents();
    const modal = document.getElementById('v10WorkshopDrawer');
    if (modal) modal.classList.add('open');
  }

  function closeWorkshopDrawer() {
    activeDrawerAssetKey = null;
    const modal = document.getElementById('v10WorkshopDrawer');
    if (modal) modal.classList.remove('open');
  }

  function buildVisualScaleHtml(asset) {
    const K = global.AetherKernelV10;
    // Darphane ALTIN.S1 için Fiziki Gram Altın vs Sertifika Hava Parası Terazisi
    if (asset.subVenue === 'DARPHANE_S1' || asset.id === 'gram-altin-spot') {
      const d = K.getDarphanePremiumInfo();
      return `
        <div class="v10-scale-box warn">
          <div class="v10-scale-title">Tartı Kontrolü: Kapalıçarşı Fiziki Gram vs. Darphane Sertifikası (ALTIN.S1)</div>
          <div class="v10-scale-bars">
            <div class="v10-scale-col">
              <div class="v10-scale-bar good" style="height:68px"></div>
              <strong>${fmtTL(d.spotGramPrice)}</strong>
              <span>1 Gr Fiziki Altın</span>
            </div>
            <div class="v10-scale-col">
              <div class="v10-scale-bar warn" style="height:${Math.min(105, Math.round(68 * (1 + d.premiumPct / 100)))}px"></div>
              <strong>${fmtTL(d.s1GramEquiv)}</strong>
              <span>100 Adet ALTIN.S1 (+%${d.premiumPct} Hava Parası!)</span>
            </div>
          </div>
          <p class="v10-scale-note">Aynı 1 gram altın için borsa sertifikasında tam <strong>${fmtTL(d.diffTL)}</strong> fazladan prim ödeniyor. Tartıya bakmadan çuval alan gişede kaybeder.</p>
        </div>
      `;
    }

    const r = asset.bistRow;
    if (r && (r.ocfMillionTL != null || r.netIncomeMillionTL != null)) {
      const ocf = Number(r.ocfMillionTL) || 0;
      const netInc = Number(r.netIncomeMillionTL) || 0;
      const cash = Number(r.cashMillionTL) || 0;
      const debt = Number(r.totalDebtMillionTL) || 0;
      const maxBar = Math.max(100, Math.abs(ocf), Math.abs(netInc), cash, debt);
      const hOcf = Math.max(14, Math.round((Math.abs(ocf) / maxBar) * 86));
      const hInc = Math.max(14, Math.round((Math.abs(netInc) / maxBar) * 86));
      const hCash = Math.max(12, Math.round((cash / maxBar) * 76));
      const hDebt = Math.max(12, Math.round((debt / maxBar) * 76));
      const isPaperTrap = netInc > 0 && ocf < 0;

      // Balina Mavnası vs Megafon Kalabalığı
      const cmf = Number(r.cmf20) || 0;
      const relVol = Number(r.relVol) || 1;
      let pierVerdict = 'Normal İskele Akışı: Alıcı ve satıcı dengeli.';
      if (asset.isPumpAnomaly || (relVol >= 1.5 && cmf <= -0.08)) {
        pierVerdict = 'DİKKAT — Gürültülü Megafon İskelesi: İşlem hacmi şişkin ama içeriden sessizce mal boşaltılıyor!';
      } else if (cmf >= 0.10) {
        pierVerdict = 'Sessiz Kargo Mavnası: Gösterişsiz biçimde tahtadaki paylar kasaya toplanıyor.';
      }

      return `
        <div class="v10-scale-box ${isPaperTrap ? 'warn' : 'good'}">
          <div class="v10-scale-title">Arka Mutfak Terazisi: Kasaya Giren Gerçek Fatura vs. Kağıt Üstü Bilanço Kârı</div>
          <div class="v10-scale-bars">
            <div class="v10-scale-col">
              <div class="v10-scale-bar ${ocf >= 0 ? 'good' : 'neg'}" style="height:${hOcf}px"></div>
              <strong>${ocf >= 0 ? '+' : ''}${ocf.toLocaleString('tr-TR')}M ₺</strong>
              <span>Gerçek Kasa Nakdi (OCF)</span>
            </div>
            <div class="v10-scale-col">
              <div class="v10-scale-bar neutral" style="height:${hInc}px"></div>
              <strong>${netInc >= 0 ? '+' : ''}${netInc.toLocaleString('tr-TR')}M ₺</strong>
              <span>Bilanço Net Kârı</span>
            </div>
            <div class="v10-scale-col">
              <div class="v10-scale-bar good" style="height:${hCash}px"></div>
              <strong>${cash.toLocaleString('tr-TR')}M ₺</strong>
              <span>Kasadaki Hazır Para</span>
            </div>
            <div class="v10-scale-col">
              <div class="v10-scale-bar ${debt > cash * 2 ? 'warn' : 'neutral'}" style="height:${hDebt}px"></div>
              <strong>${debt.toLocaleString('tr-TR')}M ₺</strong>
              <span>Toplam Borç Yükü</span>
            </div>
          </div>
          <p class="v10-scale-note">${isPaperTrap
            ? 'Uyarı: Bilanço kağıt üzerinde kâr gösterse de mahalle fırınının çekmecesinden nakit eksilmiş. Enflasyon muhasebesi (TMS-29) veya tahsil edilemeyen alacak etkisi olabilir.'
            : 'Sağlam Zemin: Satılan malın parası gerçekten kasaya giriyor; kağıt üstü illüzyon değil somut tahsilat var.'}</p>
          <div class="v10-pier-strip">${escapeHtml(pierVerdict)}</div>
        </div>
      `;
    }

    return '';
  }

  function buildChainConnectionsHtml(asset) {
    const chain = COMPANY_CHAINS[asset.ticker];
    if (!chain) {
      if (asset.id === 'kira-sertifikasi-sukuk' || asset.id === 'para-piyasasi-fonu' || asset.id.startsWith('mevduat-')) {
        return `
          <div class="v10-chain-card">
            <div class="v10-scale-title">Vergi ve Alım Gücü Bağlantısı</div>
            <p class="v10-scale-note">Merkez Bankası faizi (%${global.AetherKernelV10.getAsset('mevduat-tcmb')?.annualGrossRatePct || 36}) arttığında bu kalkan güçlenir; ancak önemli olan brüt rakam değil, stopaj kesildikten sonra yıllık %${global.AetherKernelV10.getAnnualInflationPct().toFixed(1)} mutfak enflasyonunu geçip geçemediğidir.</p>
          </div>
        `;
      }
      return '';
    }
    return `
      <div class="v10-chain-card">
        <div class="v10-scale-title">360° Bağlantı Ağı: Hammadde -> Bu Atölye -> Müşteri & Yan Sanayi</div>
        <div class="v10-chain-flow">
          <div class="v10-chain-step">
            <span>Giren Hammadde</span>
            <strong>${escapeHtml(chain.up.join(' + '))}</strong>
          </div>
          <div class="v10-chain-arrow">-></div>
          <div class="v10-chain-step active">
            <span>Ana Üretim</span>
            <strong>${escapeHtml(asset.ticker)}</strong>
          </div>
          <div class="v10-chain-arrow">-></div>
          <div class="v10-chain-step">
            <span>Kasayı Dolduran Pazar</span>
            <strong>${escapeHtml(chain.down)}</strong>
          </div>
        </div>
        <div class="v10-chain-peers">Birlikte Nefes Alan Yan Dükkânlar: <strong>${escapeHtml(chain.peers.join(' · '))}</strong></div>
      </div>
    `;
  }

  function renderDrawerContents() {
    const body = document.getElementById('v10DrawerBody');
    if (!body || !activeDrawerAssetKey) return;
    const K = global.AetherKernelV10;
    const asset = K.getAsset(activeDrawerAssetKey);
    if (!asset) return;

    const clock = K.getTurkishClock();
    const member = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(member);
    const micro = K.inspectBoardMicrostructure(asset);
    const existingPos = member.positions?.[asset.key] || null;

    // İki Kapılı Gişe Karşılaştırması (Kapalıçarşı vs Mobil Banka)
    let doorSelectorHtml = '';
    if (asset.venue === 'TWO_DOOR') {
      const sampleAmt = 20000;
      const bazaarCostLeak = Math.round(sampleAmt * (clock.bazaarSpreadPct / 200));
      const bankCostLeak = Math.round(sampleAmt * (clock.bankSpreadPct / 200 + 0.002));
      doorSelectorHtml = `
        <div class="v10-door-grid">
          <button type="button" class="v10-door-btn ${selectedDoor === 'BAZAAR' ? 'selected' : ''}" data-pick-door="BAZAAR">
            <div class="v10-door-head">
              <strong>Kapı 1: Kapalıçarşı Sarraf</strong>
              <span class="${clock.grandBazaarOpen ? 'open' : 'closed'}">${clock.grandBazaarOpen ? 'Kepenk Açık' : 'Şu An Kapalı (09:30–18:30)'}</span>
            </div>
            <p>Makas ~%${clock.bazaarSpreadPct.toFixed(2)} · Kambiyo Vergisi: <strong>%0</strong></p>
            <small>20.000 ₺ işlemde gişe sürtünmesi: ~${bazaarCostLeak} ₺</small>
          </button>
          <button type="button" class="v10-door-btn ${selectedDoor === 'BANK' ? 'selected' : ''}" data-pick-door="BANK">
            <div class="v10-door-head">
              <strong>Kapı 2: Mobil Banka 7/24</strong>
              <span class="${clock.bankDaytimeTight ? 'open' : 'warn'}">${clock.bankDaytimeTight ? 'Gündüz Makası' : 'Gece/Tatil Geniş Makas!'}</span>
            </div>
            <p>Makas %${clock.bankSpreadPct.toFixed(2)} + <strong>%0,2 BSMV Vergisi</strong></p>
            <small>20.000 ₺ işlemde makas+vergi kaybı: ~${bankCostLeak} ₺</small>
          </button>
        </div>
      `;
    }

    // Vadeli Mevduat Vade Seçici (17.5% / 15% / 10% Resmi Stopaj Kademeleri)
    let maturityHtml = '';
    if (asset.subVenue === 'TERM_DEPOSIT') {
      maturityHtml = `
        <div class="v10-maturity-row">
          <span>Vade Süresi Seç (Erken bozulursa faiz sıfırlanır):</span>
          <div class="v10-filter-pills">
            <button type="button" class="v10-pill ${selectedMaturityDays === 32 ? 'active' : ''}" data-pick-mat="32">32 Gün (%17,5 Stopaj)</button>
            <button type="button" class="v10-pill ${selectedMaturityDays === 181 ? 'active' : ''}" data-pick-mat="181">181 Gün (%15 Stopaj)</button>
            <button type="button" class="v10-pill ${selectedMaturityDays === 366 ? 'active' : ''}" data-pick-mat="366">366 Gün (%10 Stopaj)</button>
          </div>
        </div>
      `;
    }

    // Mikro Kural Bandı
    let ruleNotice = '';
    if (asset.venue === 'BIST') {
      ruleNotice = `${clock.bistLabel} · Fiyat Adımı: ${micro.tickSize} ₺ · Satışta gerçek T+2 takas (2 iş günü nakit çekilemez)${asset.stopajPct > 0 ? ` · Kârdan %${asset.stopajPct} kaynakta stopaj kesilir` : ''}.`;
      if (micro.statusNote) ruleNotice = micro.statusNote;
    } else if (asset.venue === 'TEFAS') {
      ruleNotice = `${clock.tefasLabel} · Stopaj: %${asset.stopajPct}.`;
    } else if (asset.isGvk80) {
      ruleNotice = `Yurt dışı USD varlığı: Satışta alış-satış arası Yİ-ÜFE artışı %10 ve üzeriyse TL maliyetin enflasyonla endekslenir, kalan reel kâr beyana tabidir.`;
    }

    body.innerHTML = `
      <div class="v10-drawer-head">
        <div>
          <span class="v10-eyebrow">${escapeHtml(asset.symbol)} · ${escapeHtml(asset.categoryName)}</span>
          <h3>${escapeHtml(asset.name)}</h3>
        </div>
        <button type="button" class="v10-close-btn" id="v10CloseDrawerBtn">Kapat</button>
      </div>

      <div class="v10-drawer-price-strip">
        <div>
          <span>Anlık Gişe Değeri</span>
          <strong>${asset.isRateInstrument ? `Yıllık Brüt %${asset.annualGrossRatePct.toFixed(1)}` : fmtUnitTL(asset.priceTL)}</strong>
        </div>
        <div>
          <span>Çekilebilir Nakdin</span>
          <strong>${fmtTL(snap.cashTL)}</strong>
        </div>
        <div>
          <span>T+2 Takasta Bekleyen</span>
          <strong>${fmtTL(snap.unsettledTL)}</strong>
        </div>
      </div>

      ${ruleNotice ? `<div class="v10-rule-banner">${escapeHtml(ruleNotice)}</div>` : ''}
      ${buildVisualScaleHtml(asset)}
      ${buildChainConnectionsHtml(asset)}
      ${doorSelectorHtml}
      ${maturityHtml}

      <div class="v10-order-box">
        <label for="v10OrderAmountInput">İşlem Tutarı (₺) — Hazır Dilimler:</label>
        <div class="v10-quick-amts">
          <button type="button" class="v10-pill" data-qamt="5000">5.000 ₺</button>
          <button type="button" class="v10-pill" data-qamt="15000">15.000 ₺</button>
          <button type="button" class="v10-pill" data-qamt="30000">30.000 ₺</button>
          <button type="button" class="v10-pill" data-qamt="${Math.max(100, Math.floor(snap.cashTL * 0.5))}">Naktin Yarısı</button>
        </div>
        <div class="v10-order-row">
          <input id="v10OrderAmountInput" class="v10-input" type="number" min="100" step="100" value="${Math.min(10000, Math.max(500, Math.floor(snap.cashTL * 0.25)))}" />
          <button type="button" class="v10-btn-primary" id="v10ExecBuyBtn">${asset.isRateInstrument ? 'Yeni Vade Dilimi Bağla' : 'Gerçek Kuralla Al'}</button>
        </div>
        ${existingPos ? `
          <div class="v10-existing-pos">
            <span>Kilerdeki Mevcut Payın: <strong>${existingPos.qty} adet</strong> (Maliyet: ${fmtTL(existingPos.avgCostTL)})</span>
            <div class="v10-sell-btns">
              <button type="button" class="v10-btn-ghost" data-sell-ratio="0.5">Yarısını Sat</button>
              <button type="button" class="v10-btn-danger" data-sell-ratio="1">Tamamını Sat</button>
            </div>
          </div>
        ` : ''}
        <div id="v10OrderFeedback" class="v10-order-feedback"></div>
      </div>
    `;

    document.getElementById('v10CloseDrawerBtn')?.addEventListener('click', closeWorkshopDrawer);

    body.querySelectorAll('[data-pick-door]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedDoor = btn.getAttribute('data-pick-door');
        renderDrawerContents();
      });
    });

    body.querySelectorAll('[data-pick-mat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedMaturityDays = Number(btn.getAttribute('data-pick-mat')) || 32;
        renderDrawerContents();
      });
    });

    body.querySelectorAll('[data-qamt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const inp = document.getElementById('v10OrderAmountInput');
        if (inp) inp.value = btn.getAttribute('data-qamt');
      });
    });

    document.getElementById('v10ExecBuyBtn')?.addEventListener('click', () => {
      const amt = Number(document.getElementById('v10OrderAmountInput')?.value || 0);
      const res = K.executeOrder({
        side: 'BUY',
        assetKey: asset.key,
        amountTL: amt,
        door: selectedDoor,
        maturityDays: selectedMaturityDays
      });
      renderDrawerContents();
      const fb = document.getElementById('v10OrderFeedback');
      if (fb) {
        fb.className = 'v10-order-feedback ' + (res.ok ? 'ok' : 'err');
        fb.textContent = res.ok ? res.message : res.reason;
      }
    });

    body.querySelectorAll('[data-sell-ratio]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ratio = Number(btn.getAttribute('data-sell-ratio')) || 1;
        const res = K.executeOrder({
          side: 'SELL',
          assetKey: asset.key,
          sellRatio: ratio,
          door: selectedDoor
        });
        renderDrawerContents();
        const fb = document.getElementById('v10OrderFeedback');
        if (fb) {
          fb.className = 'v10-order-feedback ' + (res.ok ? 'ok' : 'err');
          fb.textContent = res.ok ? res.message : res.reason;
        }
      });
    });
  }

  function showWorldToast(msg) {
    const el = document.getElementById('v10WorldToast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('visible'), 4200);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --------------------------------------------------------------------------
  // 6. MEKÂN 1 TAM SAHNE KURULUMU VE YENİLEME
  // --------------------------------------------------------------------------
  function mount(containerEl) {
    if (!containerEl) return;
    const story = buildMorningStory();
    const ripple = computeCausalRipple();

    containerEl.innerHTML = `
      <section class="v10-story-card" id="v10MorningStoryBox">
        <div class="v10-story-kicker">${escapeHtml(story.kicker)}</div>
        <h2 class="v10-story-headline">${escapeHtml(story.headline)}</h2>
        <p class="v10-story-sub">${escapeHtml(story.subtext)}</p>
        <div class="v10-story-roads">
          <button type="button" class="v10-btn-primary" id="v10StoryRoadA">${escapeHtml(story.roadA.label)}</button>
          <button type="button" class="v10-btn-secondary" id="v10StoryRoadB">${escapeHtml(story.roadB.label)}</button>
        </div>
      </section>

      <section class="v10-map-shell">
        <div class="v10-map-topbar">
          <div>
            <strong>Canlı Memleket Ekonomisi Haritası</strong>
            <span>Bir bölgeye dokunarak o işin hammaddesine ve dükkânlarına in. Sisli bölgeler yaşadıkça kendiliğinden açılır.</span>
          </div>
        </div>
        <div class="v10-canvas-wrap">
          <canvas id="aetherTurkeyCanvas"></canvas>
          <div id="v10WorldToast" class="v10-world-toast"></div>
        </div>

        <div class="v10-levers-panel">
          <div class="v10-levers-head">
            <strong>Mazottan Domatese / Bacadan Tencereye Nedensel Kollar</strong>
            <button type="button" class="v10-link-btn" id="v10ResetLeversBtn">Kolları Sıfırla</button>
          </div>
          <div class="v10-levers-grid">
            <label class="v10-lever-item">
              <span>Mazot Pompası: <strong id="lblLevDiesel">${levers.dieselPct >= 0 ? '+' : ''}%${levers.dieselPct}</strong></span>
              <input type="range" min="-20" max="50" step="5" value="${levers.dieselPct}" data-lever="dieselPct" />
            </label>
            <label class="v10-lever-item">
              <span>Döviz Kuru: <strong id="lblLevFx">${levers.fxPct >= 0 ? '+' : ''}%${levers.fxPct}</strong></span>
              <input type="range" min="-15" max="45" step="5" value="${levers.fxPct}" data-lever="fxPct" />
            </label>
            <label class="v10-lever-item">
              <span>Merkez Faizi: <strong id="lblLevRate">${levers.ratePts >= 0 ? '+' : ''}${levers.ratePts} Puan</strong></span>
              <input type="range" min="-15" max="20" step="5" value="${levers.ratePts}" data-lever="ratePts" />
            </label>
            <label class="v10-lever-item">
              <span>Kuraklık & Baraj: <strong id="lblLevDrought">+%${levers.droughtPct}</strong></span>
              <input type="range" min="0" max="50" step="10" value="${levers.droughtPct}" data-lever="droughtPct" />
            </label>
          </div>
          <div id="v10CausalRippleBox" class="v10-ripple-strip ${ripple.active ? 'active' : ''}">
            <div>${escapeHtml(ripple.day1Text)}</div>
            <div>${escapeHtml(ripple.day12Text)}</div>
            <div>${escapeHtml(ripple.day30Text)}</div>
          </div>
        </div>
      </section>

      <section id="v10WorkshopSection" class="v10-workshop-section"></section>
    `;

    document.getElementById('v10StoryRoadA')?.addEventListener('click', () => story.roadA.action());
    document.getElementById('v10StoryRoadB')?.addEventListener('click', () => story.roadB.action());

    canvas = document.getElementById('aetherTurkeyCanvas');
    if (canvas) {
      ctx = canvas.getContext('2d');
      canvas.addEventListener('click', handleCanvasTap);
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(renderCanvasFrame);
    }

    containerEl.querySelectorAll('[data-lever]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const k = inp.getAttribute('data-lever');
        levers[k] = Number(inp.value) || 0;
        updateLeversDom();
      });
    });

    document.getElementById('v10ResetLeversBtn')?.addEventListener('click', () => {
      levers.dieselPct = 0;
      levers.fxPct = 0;
      levers.ratePts = 0;
      levers.droughtPct = 0;
      containerEl.querySelectorAll('[data-lever]').forEach((inp) => { inp.value = '0'; });
      updateLeversDom();
    });

    renderWorkshopSection();
  }

  function updateLeversDom() {
    const r = computeCausalRipple();
    const dEl = document.getElementById('lblLevDiesel');
    const fEl = document.getElementById('lblLevFx');
    const rEl = document.getElementById('lblLevRate');
    const drEl = document.getElementById('lblLevDrought');
    if (dEl) dEl.textContent = `${levers.dieselPct >= 0 ? '+' : ''}%${levers.dieselPct}`;
    if (fEl) fEl.textContent = `${levers.fxPct >= 0 ? '+' : ''}%${levers.fxPct}`;
    if (rEl) rEl.textContent = `${levers.ratePts >= 0 ? '+' : ''}${levers.ratePts} Puan`;
    if (drEl) drEl.textContent = `+%${levers.droughtPct}`;
    const box = document.getElementById('v10CausalRippleBox');
    if (box) {
      box.className = 'v10-ripple-strip ' + (r.active ? 'active' : '');
      box.innerHTML = `
        <div>${escapeHtml(r.day1Text)}</div>
        <div>${escapeHtml(r.day12Text)}</div>
        <div>${escapeHtml(r.day30Text)}</div>
      `;
    }
  }

  global.AetherCanvasWorldV10 = {
    mount,
    openWorkshopDrawer,
    closeWorkshopDrawer,
    refreshIfOpen() {
      renderWorkshopSection();
      if (activeDrawerAssetKey) renderDrawerContents();
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
