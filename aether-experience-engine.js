/* ============================================================================
   AETHER v8.0 — GERÇEK ZAMANLI TÜRKİYE PİYASA FİZİĞİ, SOKAK ZEKASI BAĞLANTI AĞI,
   SESSİZ SONUÇ AYNASI VE AİLE ÇAY MASASI DENEYİM MOTORU
   Sıfır ütopya, sıfır uydurma fiyat, sıfır sıkıcı borsa jargonu.
   ============================================================================ */
(function () {
  'use strict';

  const FAMILY_STORAGE_KEY = 'aether_v8_family_state';
  const ACTIVE_MEMBER_KEY = 'aether_v8_active_member_id';

  // 2026-2027 Türkiye Resmi Tatilleri (Tam Gün Kapalı) ve Yarım Gün Arifeler (12:40 Kapanış)
  const TR_FULL_HOLIDAYS = new Set([
    '2026-01-01',
    '2026-03-20', '2026-03-21', '2026-03-22', // Ramazan Bayramı
    '2026-04-23',
    '2026-05-01',
    '2026-05-19',
    '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30', // Kurban Bayramı
    '2026-07-15',
    '2026-08-30',
    '2026-10-29',
    '2027-01-01',
    '2027-03-09', '2027-03-10', '2027-03-11',
    '2027-04-23',
    '2027-05-01',
    '2027-05-16', '2027-05-17', '2027-05-18', '2027-05-19',
    '2027-07-15',
    '2027-08-30',
    '2027-10-29'
  ]);

  const TR_HALF_DAY_EVES = new Set([
    '2026-03-19', // Ramazan Bayramı Arifesi (12:40 kapanış)
    '2026-05-26', // Kurban Bayramı Arifesi (12:40 kapanış)
    '2026-10-28', // Cumhuriyet Bayramı Arifesi (12:40 kapanış)
    '2027-03-08',
    '2027-05-15',
    '2027-10-28'
  ]);

  const DAY_NAMES_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const MONTH_NAMES_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  /* ==========================================================================
     1. GERÇEK İSTANBUL SAATİ (UTC+3), SEANS KİLİTLERİ, T+2 TAKAS & 13:30 VALÖR
     ========================================================================== */
  function getIstanbulParts(ms = Date.now()) {
    // Türkiye kalıcı UTC+3 saat dilimindedir
    const trDate = new Date(ms + 3 * 3600 * 1000);
    const year = trDate.getUTCFullYear();
    const month = trDate.getUTCMonth() + 1;
    const day = trDate.getUTCDate();
    const weekday = trDate.getUTCDay(); // 0 Pazar .. 6 Cumartesi
    const hour = trDate.getUTCHours();
    const minute = trDate.getUTCMinutes();
    const second = trDate.getUTCSeconds();
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const minsOfDay = hour * 60 + minute;
    const isWeekend = weekday === 0 || weekday === 6;
    const isHoliday = TR_FULL_HOLIDAYS.has(dateKey);
    const isHalfDay = TR_HALF_DAY_EVES.has(dateKey);
    const isBusinessDay = !isWeekend && !isHoliday;
    return {
      ms, year, month, day, weekday, hour, minute, second,
      dateKey, minsOfDay, isWeekend, isHoliday, isHalfDay, isBusinessDay,
      dayName: DAY_NAMES_TR[weekday],
      monthName: MONTH_NAMES_TR[month - 1],
      timeStr: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      timeSecStr: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    };
  }

  function istanbulDateKeyToUtcMs(year, month, day, hour = 9, minute = 30) {
    return Date.UTC(year, month - 1, day, hour - 3, minute, 0, 0);
  }

  function addBusinessDaysTR(fromMs, busDays, releaseHour = 9, releaseMin = 55) {
    let cursorMs = fromMs;
    let remaining = Math.max(1, Math.round(busDays));
    let guard = 0;
    while (remaining > 0 && guard < 40) {
      cursorMs += 24 * 3600 * 1000;
      const p = getIstanbulParts(cursorMs);
      if (p.isBusinessDay) remaining--;
      guard++;
    }
    const target = getIstanbulParts(cursorMs);
    return istanbulDateKeyToUtcMs(target.year, target.month, target.day, releaseHour, releaseMin);
  }

  function getNextBistOpenMs(nowMs = Date.now()) {
    const p = getIstanbulParts(nowMs);
    const closeMin = p.isHalfDay ? (12 * 60 + 40) : (18 * 60 + 10);
    if (p.isBusinessDay && p.minsOfDay < 9 * 60 + 55) {
      return istanbulDateKeyToUtcMs(p.year, p.month, p.day, 10, 0);
    }
    if (p.isBusinessDay && p.minsOfDay < closeMin) {
      return nowMs;
    }
    return addBusinessDaysTR(nowMs, 1, 10, 0);
  }

  function getIstanbulMarketClock(nowMs = Date.now()) {
    const p = getIstanbulParts(nowMs);
    const bistContClose = p.isHalfDay ? (12 * 60 + 30) : (18 * 60);
    const bistFinalClose = p.isHalfDay ? (12 * 60 + 40) : (18 * 60 + 10);

    // 1. Borsa İstanbul Pay Piyasası (09:55 Eşleşme, 10:00 Zil, 18:00-18:10 Kapanış Seansı, Arife 12:40)
    let bistState = 'CLOSED';
    let bistLabel = 'Kapalı';
    let bistDetail = 'Sabah 09:55 eşleşmesini bekliyor';
    if (!p.isBusinessDay) {
      bistState = 'CLOSED';
      bistLabel = p.isHoliday ? 'Resmi Tatil (Kapalı)' : 'Hafta Sonu (Kapalı)';
      bistDetail = 'Borsa tahtaları kilitli; verilen emirler ilk iş günü 09:55 eşleşmesine yazılır.';
    } else if (p.minsOfDay >= 9 * 60 + 55 && p.minsOfDay < 10 * 60) {
      bistState = 'MATCHING';
      bistLabel = '09:55 Açılış Eşleşmesi';
      bistDetail = 'Fiyatlar eşleşiyor; 10:00 ziliyle sürekli işlemler başlayacak.';
    } else if (p.minsOfDay >= 10 * 60 && p.minsOfDay < bistContClose) {
      bistState = 'OPEN';
      bistLabel = p.isHalfDay ? 'Açık (Arife 12:40 Kapanış)' : 'Borsa Açık (Canlı)';
      bistDetail = p.isHalfDay ? 'Yarım gün seansı 12:40’ta kapanacak.' : 'Tahtalar açık, fiyatlar gerçek piyasayla birebir akıyor.';
    } else if (p.minsOfDay >= bistContClose && p.minsOfDay < bistFinalClose) {
      bistState = 'CLOSING_AUCTION';
      bistLabel = 'Kapanış Eşleşmesi';
      bistDetail = 'Kapanış seansı tek fiyat eşleşmesi yapılıyor.';
    } else if (p.minsOfDay < 9 * 60 + 55) {
      bistState = 'CLOSED';
      bistLabel = 'Açılış Öncesi (Kapalı)';
      bistDetail = '09:55’te eşleşme, 10:00’da Borsa İstanbul zili çalacak.';
    } else {
      bistState = 'CLOSED';
      bistLabel = 'Tahtalar Kapandı (18:10)';
      bistDetail = 'Spot piyasa kapandı; şimdi verilen hisse emri yarın sabah 09:55 açılışını bekler.';
    }

    // 2. VİOP Akşam Seansı (19:00 - 23:00)
    const viopOpen = p.isBusinessDay && !p.isHalfDay && p.minsOfDay >= 19 * 60 && p.minsOfDay < 23 * 60;

    // 3. TEFAS Fon Valörü (13:30 sınırı)
    const tefasBeforeCutoff = p.isBusinessDay && p.minsOfDay < (13 * 60 + 30);
    const tefasSettlementMs = tefasBeforeCutoff
      ? addBusinessDaysTR(nowMs, 1, 14, 30)
      : addBusinessDaysTR(nowMs, 2, 14, 30);

    // 4. Banka & Kapalıçarşı Altın/Döviz Makası (09:00 - 17:30 mesai içi dar, 17:30 sonrası & hafta sonu geniş)
    const bankHoursOpen = p.isBusinessDay && p.minsOfDay >= 9 * 60 && p.minsOfDay < (17 * 60 + 30);
    const bankSpreadPct = bankHoursOpen ? 0.65 : 3.60; // Banka mesai dışı gerçek Türkiye makası (~%3,6)
    const carsiSpreadPct = p.isWeekend ? 1.15 : 0.40;  // Kapalıçarşı / Nöbetçi döviz makası

    // 5. ABD & Küresel Emtia Seansı (Londra 11:00, NY 17:30 - 00:00 kış / 16:30 - 23:00 yaz)
    const isSummerUs = p.month >= 3 && p.month <= 10;
    const nyOpenMin = isSummerUs ? (16 * 60 + 30) : (17 * 60 + 30);
    const nyCloseMin = isSummerUs ? (23 * 60) : (24 * 60 - 1);
    const usEquitiesOpen = !p.isWeekend && p.minsOfDay >= nyOpenMin && p.minsOfDay <= nyCloseMin;
    const globalCommoditiesOpen = !p.isWeekend && p.minsOfDay >= 3 * 60;

    // 6. TÜİK Enflasyon (Her ayın 3'ü 10:00 — hafta sonuna gelirse takip eden ilk iş günü 10:00)
    let tuikYear = p.year, tuikMonth = p.month;
    let tuikMs = istanbulDateKeyToUtcMs(tuikYear, tuikMonth, 3, 10, 0);
    while (!getIstanbulParts(tuikMs).isBusinessDay) tuikMs += 24 * 3600 * 1000;
    if (tuikMs < nowMs - 6 * 3600 * 1000) {
      tuikMonth++;
      if (tuikMonth > 12) { tuikMonth = 1; tuikYear++; }
      tuikMs = istanbulDateKeyToUtcMs(tuikYear, tuikMonth, 3, 10, 0);
      while (!getIstanbulParts(tuikMs).isBusinessDay) tuikMs += 24 * 3600 * 1000;
    }

    // 7. Perşembe 14:00 TCMB Karar / Veri Saati
    let daysUntilThu = (4 - p.weekday + 7) % 7;
    if (daysUntilThu === 0 && p.minsOfDay >= 14 * 60 + 30) daysUntilThu = 7;
    const tcmbThuParts = getIstanbulParts(nowMs + daysUntilThu * 24 * 3600 * 1000);
    const nextThu14Ms = istanbulDateKeyToUtcMs(tcmbThuParts.year, tcmbThuParts.month, tcmbThuParts.day, 14, 0);

    return {
      ...p,
      bistState,
      bistIsTradableNow: bistState === 'OPEN' || bistState === 'CLOSING_AUCTION',
      bistLabel,
      bistDetail,
      nextBistOpenMs: getNextBistOpenMs(nowMs),
      viopOpen,
      tefasBeforeCutoff,
      tefasSettlementMs,
      bankHoursOpen,
      bankSpreadPct,
      carsiSpreadPct,
      usEquitiesOpen,
      globalCommoditiesOpen,
      tuikMs,
      nextThu14Ms
    };
  }

  function formatTrShortDateTime(ms) {
    const p = getIstanbulParts(ms);
    return `${p.day} ${p.monthName} ${p.dayName} ${p.timeStr}`;
  }

  function formatCountdownShort(targetMs, nowMs = Date.now()) {
    const diff = Math.max(0, targetMs - nowMs);
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hrs >= 48) return `${Math.ceil(hrs / 24)} gün sonra`;
    if (hrs >= 1) return `${hrs} sa ${mins} dk`;
    return `${mins} dk`;
  }

  /* ==========================================================================
     2. GERÇEK BIST TEDBİRLERİ (DEVRE KESİCİ, VBTS BRÜT TAKAS) & TAKVİM VERİLERİ
     ========================================================================== */
  function getBistTradingRestriction(ticker) {
    const st = window.marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup?.[ticker];
    if (!st) return { circuitBreaker: false, brutTakas: false, creditBan: false, note: '' };
    const absChg = Math.abs(Number(st.change1D) || 0);
    const circuitBreaker = absChg >= 7.2 && absChg < 9.85;
    const isSpeculative = (Number(st.pb) < 0) || ((Number(st.pe) || 0) > 85 && (Number(st.marketCapBillionTL) || 0) < 8) || ((Number(st.volRatio) || 1) > 2.8 && absChg > 5.5);
    return {
      circuitBreaker,
      brutTakas: isSpeculative,
      creditBan: isSpeculative,
      isCeilingOrFloor: absChg >= 9.85,
      note: circuitBreaker
        ? 'Devre Kesici Eşleşme Molası: Sert fiyat hareketi nedeniyle geçici tek fiyat eşleşmesinde, anlık emir gerçekleşmez.'
        : isSpeculative
          ? 'VBTS Brüt Takas & Kredili İşlem Kısıtı: Yalnızca nakit bakiye ile alınabilir, aynı gün satılamaz; satıldığında T+2 gün bitmeden başka hisse bile alınamaz.'
          : ''
    };
  }

  // Gerçekçi Türkiye Temettü ve SPK Halka Arz Takvimi (Gerçek Kişi Başı Eşit Dağıtım Sınırlı!)
  const UPCOMING_DIVIDEND_WATCH = [
    { ticker: 'FROTO', name: 'Ford Otomotiv', estGrossPerShareTL: 42.50, stopajPct: 15, note: 'İhracat nakit akışıyla yılda iki taksit düzenli kâr payı geleneği; brütten %15 stopaj kesilir, T+2 gün hesaba yatar.' },
    { ticker: 'TUPRS', name: 'Tüpraş', estGrossPerShareTL: 13.80, stopajPct: 15, note: 'Rafineri nakit fazlasından temettü ödemesi; hak kazanmak için dağıtım gününden bir akşam önce pay sahibi olunmalıdır.' },
    { ticker: 'BIMAS', name: 'BİM Mağazalar', estGrossPerShareTL: 11.00, stopajPct: 15, note: 'Günlük market kasası nakdinden taksitli kâr payı; ödeme günü hisse fiyatı brüt temettü kadar düzeltilir (bedava para değil, kasa paylaşımıdır).' },
    { ticker: 'ENJSA', name: 'Enerjisa Enerji', estGrossPerShareTL: 4.20, stopajPct: 15, note: 'Elektrik dağıtım tahsilatından düzenli yıllık nakit paylaşımı (%15 stopaj sonrası net yatar).' }
  ];

  const ACTIVE_SPK_IPO_SIM = {
    code: 'SPK-ARZ',
    companyName: 'Anadolu Şebeke & Trafo Sanayi A.Ş. (SPK Eşit Dağıtım Simülasyonu)',
    lotPriceTL: 34.50,
    estParticipants: 1850000,
    maxAllottedLotsPerPerson: 22, // Türkiye gerçeği: 500.000 ₺ yatırsan da kişi başı ~22 lot (759 ₺) düşer!
    summary: 'SPK Bülteni bireysele eşit dağıtım kuralı: 500 Bin ₺ talep girsen bile 1,85 milyon katılımcıda kişi başı en fazla 22 lot (759 ₺) gelir; kalan paran iade olana kadar boşta bağlanır.'
  };

  /* ==========================================================================
     3. SOKAK ZEKASI: "MAZOTTAN DOMATESİ ANLAMA" 360° DEĞER ZİNCİRİ GRAFİĞİ
     ========================================================================== */
  function getEntity360Chain(kind, idOrTicker) {
    const m = window.marketData?.macro || {};
    const lookup = window.marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup || {};
    const usd = Number(m.usdTry) || 50.4;
    const eur = Number(m.eurTry) || 54.0;
    const cpi = Number(m.cpiYoy) || 29.8;
    const tr02y = Number(m.tr02y) || 36.3;

    const getInstSnap = (id, fallbackLabel) => {
      const inst = window.instById?.get(id);
      if (!inst) return { id, kind: 'inst', label: fallbackLabel || id, priceStr: '—', chg1D: 0, chg3M: 0 };
      const meta = window.getAssetMeta ? window.getAssetMeta(inst) : { title: inst.name };
      const chg3M = window.computeAssetStageMetrics ? window.computeAssetStageMetrics(inst, 2).tlNetPct : (Number(inst.perf3M) || 0);
      return {
        id,
        kind: 'inst',
        label: meta.title,
        priceStr: window.fmtAssetPrice ? window.fmtAssetPrice(inst.currentPrice, inst.unitLabel, inst.isUsdAsset, inst.isRateInstrument) : String(inst.currentPrice),
        chg1D: Number(inst.tlChange1D ?? inst.change1D) || 0,
        chg3M
      };
    };

    const getBistSnap = (ticker) => {
      const st = lookup[ticker];
      if (!st) return null;
      return {
        id: ticker,
        kind: 'bist',
        label: `${ticker} · ${window.formatBistCompanyName ? window.formatBistCompanyName(st.name, ticker) : ticker}`,
        priceStr: `${window.fmtNum ? window.fmtNum(st.close, 2) : st.close} ₺`,
        chg1D: Number(st.change1D) || 0,
        chg3M: Number(st.perf3M) || 0
      };
    };

    // Sektöre veya varlığa göre "Mazot -> Domates / Fabrika Bacası -> Mutfak Tenceresi" eşleşmesi
    let sectorKey = 'general';
    let stObj = null;
    let instObj = null;

    if (kind === 'bist') {
      stObj = lookup[idOrTicker];
      const sec = stObj && window.getSectorTr ? window.getSectorTr(stObj) : '';
      if (/Havacılık|Lojistik/i.test(sec)) sectorKey = 'aviation';
      else if (/Petrol|Rafineri|Doğalgaz|Kimya/i.test(sec) || ['SASA', 'PETKM', 'GUBRF', 'HEKTS'].includes(idOrTicker)) sectorKey = 'petro_chem';
      else if (/Elektrik|Yenilenebilir/i.test(sec)) sectorKey = 'power_solar';
      else if (/Otomotiv|Beyaz Eşya|Makine/i.test(sec)) sectorKey = 'auto_export';
      else if (/Demir-Çelik|Madencilik/i.test(sec)) sectorKey = 'steel_mining';
      else if (/Perakende|Gıda|Tarım|İçecek/i.test(sec)) sectorKey = 'food_retail';
      else if (/Banka|Sigorta|Finans|Gayrimenkul|Çimento/i.test(sec) || stObj?.entityKind === 'gyo' || stObj?.entityKind === 'bank') sectorKey = 'rate_sensitive';
      else if (/Savunma|Yazılım|Teknoloji|Telekom/i.test(sec)) sectorKey = 'tech_defense';
    } else {
      instObj = window.instById?.get(idOrTicker);
      const id = String(idOrTicker || '');
      if (id.includes('altin') || id.includes('ceyrek') || id.includes('cumhuriyet') || id.includes('bilezik') || id === 'fon-degisken-isglk') sectorKey = 'gold_shield';
      else if (id.includes('gumus') || id.startsWith('ons-')) sectorKey = 'silver_ind';
      else if (id === 'emtia-petrol-bno') sectorKey = 'oil_root';
      else if (id === 'emtia-tarim-dba') sectorKey = 'agri_root';
      else if (id.includes('tahvil') || id.includes('sukuk') || id.includes('mevduat') || id.includes('katilim') || id.includes('para-piyasasi') || id === 'bes-emeklilik') sectorKey = 'money_rate';
      else if (id.includes('sp500') || id.includes('nasdaq') || id.includes('dunya') || id.includes('nvda') || id.includes('aapl') || id.includes('msft') || id.includes('soxx')) sectorKey = 'global_tech';
      else if (id.includes('gayrimenkul') || id.includes('gyo')) sectorKey = 'rate_sensitive';
      else if (id.includes('perakende') || id.includes('tabgd')) sectorKey = 'food_retail';
      else if (id.includes('enerji')) sectorKey = 'power_solar';
      else if (id.startsWith('kripto-')) sectorKey = 'crypto_cycle';
    }

    const chains = {
      aviation: {
        kitchenAnalogy: 'Pazarcının kamyonuna koyduğu mazot neyse, uçak şirketinin en büyük masrafı da jet yakıtıdır (Brent Petrol). Biletini ise Avrupalı turiste Euro ve Dolarla keser.',
        newsTrap: 'Yaz ortasında televizyonda "Havalimanları doldu taştı, rekor yolcu!" haberini beklemek — o gün geldiğinde fiyat çoktan tepeye çıkmıştır.',
        rawSignal: 'Kış ortasında kimse konuşmazken Brent Petrolün ucuzlamasına ve Euro/TL kurunun güçlenmesine bakmak.',
        inputs: [getInstSnap('emtia-petrol-bno', 'Brent Petrol'), getInstSnap('doviz-eur', 'Euro / TL'), getInstSnap('doviz-usd', 'Dolar / TL')],
        peers: [getBistSnap('THYAO'), getBistSnap('PGSUS'), getInstSnap('fon-yerli-bist30-apx30', '30 Dev Şirket Fonu')].filter(Boolean)
      },
      petro_chem: {
        kitchenAnalogy: 'Ham petrolü alıp mazot, benzin, plastik veya gübreye çeviren koca kazan. Mazot ve gübre pahalandığında tarladaki domatesten nakliyeye kadar her şeyin fiyatı değişir.',
        newsTrap: ' Kâr patladıktan veya kriz manşete düştükten sonra peşinden koşmak.',
        rawSignal: 'Dünya petrol (Brent) ve tarım hammaddesi (DBA) fiyatlarıyla fabrikanın elindeki nakit/borç dengesini izlemek.',
        inputs: [getInstSnap('emtia-petrol-bno', 'Brent Petrol'), getInstSnap('emtia-tarim-dba', 'Dünya Tarım & Gıda'), getInstSnap('doviz-usd', 'Dolar / TL')],
        peers: [getBistSnap('TUPRS'), getBistSnap('AYGAZ'), getInstSnap('fon-yerli-hisse-zpbdl', 'Banka Dışı 10 Dev Fonu')].filter(Boolean)
      },
      power_solar: {
        kitchenAnalogy: 'Fabrikaların ve yapay zeka veri merkezlerinin prizdeki elektriği. Güneş panelinin içinde iletken olarak Gümüş, trafonun içinde Bakır ve Çelik kullanılır.',
        newsTrap: 'Sosyal medyada "Yeni iş anlaşması attı!" dedikodusuyla tavandan atlamak.',
        rawSignal: 'Gümüş ve metal girdi fiyatlarını, döviz bazlı trafo/enerji ihracatını ve şirketin kasasında borçtan fazla nakit olup olmadığını kontrol etmek.',
        inputs: [getInstSnap('gram-gumus-spot', 'Gram Gümüş (Panel İletkeni)'), getInstSnap('doviz-usd', 'Dolar / TL'), getInstSnap('dibs-tahvil', '2Y Yatırım Faizi')],
        peers: [getBistSnap('ASTOR'), getBistSnap('ENJSA'), getInstSnap('fon-tematik-yari-iletken-soxx', 'Dünya Çip & Veri Merkezi')].filter(Boolean)
      },
      auto_export: {
        kitchenAnalogy: 'Bursa, Kocaeli ve Eskişehir’de çelik ve platin işleyip ürettiği aracın %75’ini Avrupa’ya Euro ile satan dev ihracat atölyesi.',
        newsTrap: '"İç piyasada araba satışları yavaşladı" manşetinden korkup sağlam ihracatçıyı ucuza kaptırmak.',
        rawSignal: 'Avrupa parası (Euro) güçlenirken ve kredi/tahvil faizleri zirveden dönmeye hazırlanırken kıştan odun toplar gibi kademeli biriktirmek.',
        inputs: [getInstSnap('doviz-eur', 'Euro / TL (İhracat Kasası)'), getInstSnap('ons-platin', 'Platin (Katalizör Metali)'), getInstSnap('dibs-tahvil', '2Y Tahvil (Taşıt Kredisi Öncüsü)')],
        peers: [getBistSnap('FROTO'), getBistSnap('TOASO'), getInstSnap('bist-temettu-25', 'Temettü 25 Fonu (%0 Vergi)')].filter(Boolean)
      },
      steel_mining: {
        kitchenAnalogy: 'İnşaatın demiri, arabanın sacı, toprağın altındaki altın. Bu işler mevsim gibidir; dünyada sanayi üşüdüğünde fiyatları dibe iner, bahar geldiğinde en sert onlar uyanır.',
        newsTrap: 'Demir-çelik şirketi rekor kâr açıklayıp herkes övdüğünde almak (döngü tepesidir!).',
        rawSignal: 'Fabrikalar en durgun dönemindeyken, hisse defterdeki mal varlığının bile altına indiğinde sabırla bekleyebilecek parayla girmek.',
        inputs: [getInstSnap('gram-altin-spot', 'Gram Altın'), getInstSnap('emtia-petrol-bno', 'Enerji Maliyeti'), getInstSnap('doviz-usd', 'Dolar / TL')],
        peers: [getBistSnap('EREGL'), getBistSnap('KOZAL'), getInstSnap('altin-sertifikasi', 'Darphane Altın S1')].filter(Boolean)
      },
      food_retail: {
        kitchenAnalogy: 'Mahallenin her akşam önünde kuyruk olan fırını ve marketi. Vatandaş peyniri-ekmeği peşin alır; market ise toptancıya 60 gün sonra öder, o sırada kasadaki nakdi günlük fonda çalıştırır!',
        newsTrap: '"Hayat pahalı, millet harcayamıyor" diye düşünüp temel gıda marketini küçümsemek.',
        rawSignal: 'Mazot (nakliye), dünya tarım emtiası (buğday/yağ) ve enflasyon arttığında bile kasasında borç olmayan marketin hasılatı enflasyonla birlikte büyür.',
        inputs: [getInstSnap('emtia-tarim-dba', 'Dünya Buğday & Gıda'), getInstSnap('emtia-petrol-bno', 'Mazot / Nakliye Girdisi'), getInstSnap('para-piyasasi-fonu', 'Kasa Nakit Getirisi')],
        peers: [getBistSnap('BIMAS'), getBistSnap('MGROS'), getInstSnap('fon-katilim-z30kp', 'Katılım 30 Fonu (%0 Vergi)')].filter(Boolean)
      },
      rate_sensitive: {
        kitchenAnalogy: 'Bu iş kolunun hammaddesi demir ya da un değil, doğrudan "Paranın Kirası (Faiz)"dir! Kredi pahalıyken ev ve dükkan satışı donar; faiz düşeceği kokusu çıktığında ilk bunlar koşar.',
        newsTrap: 'Merkez Bankası faizleri tamamen indirdikten ve konut kuyrukları haberlere çıktıktan sonra girmek.',
        rawSignal: 'Resmi faiz inmeden aylar önce 2 Yıllık Devlet Tahvili oranının gevşemeye başlamasını ve tapu değerinin yarı fiyatına (0,5x özvarlık) inmiş borçsuz GYO/bankaları izlemek.',
        inputs: [getInstSnap('dibs-tahvil', '2Y Tahvil (Öncü Faiz İzi)'), getInstSnap('kira-sertifikasi-sukuk', 'Hazine Sukuk (%0 Vergi)'), getInstSnap('gayrimenkul-konut-tcmb', 'Türkiye Konut Fiyat Endeksi')],
        peers: [getInstSnap('fon-yerli-banka-zplib', 'Bankalar Fonu (%0 Vergi)'), getInstSnap('gayrimenkul-gyo-fonu-optgy', 'GYO Sepet Fonu (%0 Vergi)'), getBistSnap('EKGYO')].filter(Boolean)
      },
      tech_defense: {
        kitchenAnalogy: 'Demiri kiloyla satmak yerine içine akıl ve yazılım koyup gramla yüksek fiyata satmak. Arkasındaki görünmez hammadde dünyadaki Çip (Yarı İletken) üretimi ve mühendis bilgisidir.',
        newsTrap: 'Fiyatı kendi kârının 50 katına şişmiş popüler teknoloji dedikodusuna kapılmak.',
        rawSignal: 'Dünya çip üreticilerinin (SOXX) gidişatına ve şirketin gerçekten kasasına nakit sokup sokmadığına bakmak.',
        inputs: [getInstSnap('fon-tematik-yari-iletken-soxx', 'Dünya Çip Üreticileri'), getInstSnap('abd-sp500-spy', 'ABD 500 Şirket'), getInstSnap('doviz-usd', 'Dolar / TL')],
        peers: [getBistSnap('ASELS'), getBistSnap('LOGO'), getInstSnap('fon-tematik-teknoloji-zpt10', 'Yerli Teknoloji Fonu (%0 Vergi)')].filter(Boolean)
      },
      gold_shield: {
        kitchenAnalogy: 'Kimsenin borcu olmayan, basılamayan binlerce yıllık sığınak. Türkiye’de Gram Altın iki kanatla uçar: hem dünyadaki Ons Altın fiyatı hem içerideki Dolar/TL kuru.',
        newsTrap: 'Kuyumcu önünde kuyruk varken akşam saatinde bankadan %4 makasla panik alımı yapmak!',
        rawSignal: 'Borsa açıkken (10:00–18:00) Darphane Altın Sertifikası (S1) veya düşük makasla sakin günlerde kalkan kurmak; mesai dışı banka makasına yem olmamak.',
        inputs: [getInstSnap('doviz-usd', 'Dolar / TL Kuru'), getInstSnap('gram-gumus-spot', 'Gram Gümüş'), getInstSnap('kira-sertifikasi-sukuk', 'Rakibi: %0 Vergili Kira')],
        peers: [getInstSnap('altin-sertifikasi', 'Darphane Altın S1 (%0 Vergi)'), getInstSnap('gram-altin-spot', 'Gram Altın'), getInstSnap('gram-gumus-spot', 'Gram Gümüş')].filter(Boolean)
      },
      silver_ind: {
        kitchenAnalogy: 'Yarısı altının küçük kardeşi (değerli maden), diğer yarısı güneş panelleri ve elektrikli araçların mecburi hammaddesi!',
        newsTrap: 'Sadece sert fırladığı haftalarda sosyal medyadan duyup tepeden girmek.',
        rawSignal: 'Altın önden gidip Gümüş geride kaldığında ve dünyada güneş/elektrik yatırımları hızlandığında sabırla toplamak.',
        inputs: [getInstSnap('gram-altin-spot', 'Gram Altın'), getInstSnap('doviz-usd', 'Dolar / TL'), getInstSnap('fon-tematik-yari-iletken-soxx', 'Sanayi & Çip Talebi')],
        peers: [getInstSnap('gram-gumus-spot', 'Gram Gümüş (%0 Vergi)'), getInstSnap('altin-sertifikasi', 'Darphane S1'), getBistSnap('CWENE')].filter(Boolean)
      },
      oil_root: {
        kitchenAnalogy: 'Dünya ekonomisinin damarlarındaki mazot. Gemiler boğazda sıkıştığında veya savaş çıktığında fırlar; fabrikalar yavaşladığında düşer ve enflasyonu da peşinden sürükler.',
        newsTrap: 'Savaş manşeti çıktığı gün en tepeden petrol fonuna atlamak.',
        rawSignal: 'Petrolün hareketinden hangi şirketin (havayolu, lojistik, tarım, rafineri) 3 ay sonra ne yaşayacağını okumak!',
        inputs: [getInstSnap('doviz-usd', 'Dolar / TL'), getInstSnap('emtia-tarim-dba', 'Tarım & Gübre Zinciri'), getInstSnap('gram-altin-spot', 'Jeopolitik Kalkan: Altın')],
        peers: [getBistSnap('TUPRS'), getBistSnap('THYAO'), getInstSnap('emtia-tarim-dba', 'Dünya Gıda Fonu')].filter(Boolean)
      },
      agri_root: {
        kitchenAnalogy: 'Kilerdeki un, buğday, mısır, kahve ve kakao. Bir ülkede kuraklık başladığında veya mazot/gübre pahalandığında önce burası kıpırdar, 3 ay sonra market rafına zam olarak yansır.',
        newsTrap: 'Market zamları haber olduktan sonra şaşırmak.',
        rawSignal: 'Kuraklık, gübre ve mazot maliyetinden gıda enflasyonunun yönünü aylar öncesinden sezmek.',
        inputs: [getInstSnap('emtia-petrol-bno', 'Mazot & Gübre Girdisi'), getInstSnap('doviz-usd', 'Dolar / TL'), getInstSnap('gram-altin-spot', 'Enflasyon Kalkanı')],
        peers: [getBistSnap('BIMAS'), getBistSnap('MGROS'), getBistSnap('TABGD')].filter(Boolean)
      },
      money_rate: {
        kitchenAnalogy: 'Kışlık erzak beklerken paranın boşta durup farelere (enflasyona) yem olmaması için konulan kiler. Tek başına zengin etmez; fırtınada cephaneni korur.',
        newsTrap: 'Bankanın verdiği %39 brüt faizi "kâr" sanıp her ay harcayarak anaparayı eritmek ve %17,5 stopaj ödemek.',
        rawSignal: 'Enflasyon (%' + (cpi.toFixed ? cpi.toFixed(1).replace('.', ',') : cpi) + ') barajının üzerinde net kalan %0 vergili Kira Sertifikası / Tahvil ile fırsat gününe nakit saklamak.',
        inputs: [getInstSnap('kira-sertifikasi-sukuk', 'Hazine Sukuk (%0 Vergi)'), getInstSnap('para-piyasasi-fonu', 'Günlük Fon (PPF)'), getInstSnap('gram-altin-spot', 'Kur Kalkanı: Altın')],
        peers: [getInstSnap('dibs-tahvil', '2Y Devlet Tahvili (%0 Vergi)'), getInstSnap('mevduat-ust', 'Banka Vadeli (-%17,5 Vergi)'), getInstSnap('altin-sertifikasi', 'Darphane S1')].filter(Boolean)
      },
      global_tech: {
        kitchenAnalogy: 'Telefonundan bulut sunucusuna kadar tüm dünyanın her gün dolar ödediği 500 dev dükkan. Türkiye’de kur artsa da artmasa da dünyada dolar bazında üretimle büyür.',
        newsTrap: 'Yurt dışı hisse/ETF kârında beyanname vergisi kuralını bilmeden küçük tutarla sürekli al-sat yapmak.',
        rawSignal: 'ABD faizleri ve çip/bulut yatırımlarını izleyip düşüş haftalarında uzun vadeli dolar ortağı olmak.',
        inputs: [getInstSnap('doviz-usd', 'Dolar / TL'), getInstSnap('fon-tematik-yari-iletken-soxx', 'Çip Hammaddesi (SOXX)'), getInstSnap('gram-altin-spot', 'Altın Kalkanı')],
        peers: [getInstSnap('abd-sp500-spy', 'ABD 500 Şirket (SPY)'), getInstSnap('dunya-borsalari-vt', 'Tüm Dünya Şirketleri (VT)'), getInstSnap('abd-nasdaq-qqq', 'ABD Teknoloji 100 (QQQ)')].filter(Boolean)
      },
      crypto_cycle: {
        kitchenAnalogy: 'Hafta sonu ve gece yarısı bile hiç kapanmayan, dünyada para bolluğu varken coşan, para sıkılaşınca yarı yarıya çakılabilen çok sert deniz.',
        newsTrap: 'Herkes zengin olma hayaliyle konuşurken tüm birikimiyle veya borç parayla girmek.',
        rawSignal: 'Sadece kaybettiğinde uykunu kaçırmayacak küçük bir payla (%5 gibi), kimse yüzüne bakmazken kademeli dokunmak.',
        inputs: [getInstSnap('abd-nasdaq-qqq', 'Küresel Risk İştahı (QQQ)'), getInstSnap('doviz-usd', 'Dolar / TL'), getInstSnap('gram-altin-spot', 'Fiziki Sığınak: Altın')],
        peers: [getInstSnap('kripto-btc', 'Bitcoin'), getInstSnap('altin-sertifikasi', 'Darphane Altın S1'), getInstSnap('para-piyasasi-fonu', 'Günlük Nakit Cephane')].filter(Boolean)
      },
      general: {
        kitchenAnalogy: 'Bir işe ortak olurken tabelasına değil; sattığı malın hammaddesine, kasasındaki nakde ve borcunun uykusunu kaçırıp kaçırmadığına bakılır.',
        newsTrap: 'Dışarıdan duyulan dedikoduyla işin mutfağına bakmadan atlamak.',
        rawSignal: 'Döviz kuru, faiz maliyeti ve şirketin kendi kârıyla kendini kaç yılda çıkardığını birlikte görmek.',
        inputs: [getInstSnap('doviz-usd', 'Dolar / TL'), getInstSnap('dibs-tahvil', '2Y Borçlanma Faizi'), getInstSnap('gram-altin-spot', 'Gram Altın')],
        peers: [getInstSnap('fon-yerli-bist30-apx30', '30 Dev Şirket Fonu (%0 Vergi)'), getInstSnap('kira-sertifikasi-sukuk', 'Hazine Sukuk (%0 Vergi)')].filter(Boolean)
      }
    };

    const chosen = chains[sectorKey] || chains.general;

    // Fırın Hasılatı Somutlaştırması (BIST şirketleri için: 100.000 ₺ ortaklığa düşen yıllık kâr/nakit)
    let bakeryNote = '';
    if (stObj) {
      const mcapMillion = (Number(stObj.marketCapBillionTL) || 0) * 1000;
      const netInc = Number(stObj.netIncomeMillionTL);
      if (mcapMillion > 0 && Number.isFinite(netInc)) {
        const per100k = Math.round((netInc / mcapMillion) * 100000);
        if (per100k > 0) {
          bakeryNote = `Mahalle Fırını Hesabı: Bu şirkete bugün 100.000 ₺’lik ortak olsan, şirketin son 1 yılda kasasına koyduğu net kârdan senin payına düşen gerçek üretim ${window.fmtTL ? window.fmtTL(per100k, 0) : per100k + ' ₺'}${stObj.isNetCash ? ' — üstelik kasasındaki nakit tüm borcundan fazla!' : '.'}`;
        } else {
          bakeryNote = `Mahalle Fırını Hesabı: Bu dükkân son 1 yılda kasaya net kâr koyamamış (100.000 ₺ paya ${window.fmtTL ? window.fmtTL(per100k, 0) : per100k + ' ₺'} zarar düşüyor). Ucuz görünse bile kâr etmeyen mal elde çürüyebilir.`;
        }
      }
    }

    // Döngü Sıcaklığı (Sürü Hücum mu Ediyor, Yangın Yerinde Sahipsiz mi?)
    let cycleBadge = { cls: 'info', text: 'Dengeli Seyirde' };
    if (stObj) {
      const dd = Number(stObj.drawdown52WPct) || 0;
      const m1 = Number(stObj.perf1M) || 0;
      if (dd <= -25 && (!Number.isFinite(stObj.netIncomeMillionTL) || stObj.netIncomeMillionTL > 0)) {
        cycleBadge = { cls: 'pos', text: `Kalabalık Bakmıyor · Zirveden %${Math.abs(Math.round(dd))} İndirimde` };
      } else if (dd <= -25 && stObj.netIncomeMillionTL < 0) {
        cycleBadge = { cls: 'warn', text: `Zirveden %${Math.abs(Math.round(dd))} Düştü Ama Zararda (Ucuzluk Tuzağı Riski)` };
      } else if (m1 >= 22 || (Number(stObj.rsi) || 50) >= 70) {
        cycleBadge = { cls: 'warn', text: 'Kalabalık Hücum Ediyor · Fiyat Isınmış' };
      }
    } else if (instObj && !instObj.isRateInstrument) {
      const m3 = window.computeAssetStageMetrics ? window.computeAssetStageMetrics(instObj, 2).tlNetPct : 0;
      if (m3 >= 22) cycleBadge = { cls: 'warn', text: `Son 3 Ayda ${window.fmtPct ? window.fmtPct(m3, 0) : m3 + '%'} Koştu · Acele Etme` };
      else if (m3 <= -8) cycleBadge = { cls: 'pos', text: 'Geri Çekilmiş · Sakin Toplama Bölgesi' };
    }

    // Şu anki gerçek Türkiye işlem ve takas kuralı
    const clk = getIstanbulMarketClock();
    let ruleLine = '';
    if (kind === 'bist') {
      const rest = getBistTradingRestriction(idOrTicker);
      const t2Str = formatTrShortDateTime(addBusinessDaysTR(clk.ms, 2, 9, 30));
      ruleLine = `${clk.bistIsTradableNow ? 'Tahta şu an AÇIK (anlık işlem).' : 'Tahta şu an KAPALI (emrin ilk seansta 09:55 eşleşmesini bekler).'} Sattığında nakit T+2 kuralıyla ${t2Str} itibarıyla çekilebilir olur.${rest.note ? ' · ' + rest.note : ''}`;
    } else if (instObj) {
      const id = instObj.id;
      if (id.startsWith('kripto-')) {
        ruleLine = '7/24 kesintisiz açık; hafta sonu ve gece dahil anlık alınıp satılır (%0,15 işlem payı).';
      } else if (id === 'gram-altin-spot' || id.startsWith('doviz-') || id === 'ceyrek-altin' || id === 'cumhuriyet-altini' || id === 'bilezik-22-ayar') {
        ruleLine = clk.bankHoursOpen
          ? `Mesai saatindeyiz: Banka makası dar (~%${clk.bankSpreadPct.toFixed(2).replace('.', ',')}), Kapalıçarşı makası ~%${clk.carsiSpreadPct.toFixed(2).replace('.', ',')}.`
          : `Mesai dışındayız (17:30 sonrası / tatil): Bankalarda alım-satım makası ~%${clk.bankSpreadPct.toFixed(1).replace('.', ',')} açıldı! Şimdi alırsan güne makas kaybıyla başlarsın.`;
      } else if (instObj.symbol && instObj.symbol.startsWith('BIST:')) {
        ruleLine = `${clk.bistIsTradableNow ? 'Borsa İstanbul seansı açık, dar makasla işlem görüyor.' : 'Borsa kapalı; emrin sabah 09:55 açılış eşleşmesine yazılır.'} BIST pay/BYF satışında T+2 takas uygulanır.`;
      } else if (id === 'para-piyasasi-fonu') {
        ruleLine = clk.bankHoursOpen
          ? 'Günlük Para Piyasası Fonu mesai içinde aynı gün bozulabilir; içeride kaldığı her gece gerçek oranla nemalanır.'
          : 'Mesai dışında Para Piyasası Fonu emri ilk iş günü sabah valörüyle işlenir.';
      } else if (instObj.isUsdAsset) {
        ruleLine = clk.usEquitiesOpen
          ? 'New York borsası şu an AÇIK; dolar bazlı canlı fiyat akıyor.'
          : 'ABD seansı şu an kapalı (17:30–00:00 arası açık); emrin seans açılışını bekler.';
      } else {
        const valStr = formatTrShortDateTime(clk.tefasSettlementMs);
        ruleLine = `TEFAS 13:30 valör kuralı: Şimdi verilen emir ${valStr} valörüyle gerçekleşir.`;
      }
    }

    return {
      ...chosen,
      peers: (chosen.peers || []).filter(pr => pr && pr.id !== idOrTicker),
      bakeryNote,
      cycleBadge,
      ruleLine
    };
  }

  function buildEntityEcosystem360Html(kind, idOrTicker) {
    const eco = getEntity360Chain(kind, idOrTicker);
    const esc = window.escapeHtml || (s => String(s || ''));
    const fmtP = window.fmtPct || (v => v + '%');
    const pCls = window.pctCls || (v => (v >= 0 ? 'pos' : 'neg'));

    return `
      <div class="stat-box" style="margin-bottom:12px;border-color:rgba(59,130,246,0.28);background:linear-gradient(165deg,rgba(18,24,40,0.95) 0%,rgba(11,14,24,0.96) 100%);">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <span style="font-size:11px;font-weight:800;color:var(--accent-bright);text-transform:uppercase;letter-spacing:0.04em;">
            360° Bağlantı Ağı · Mazottan Domatese
          </span>
          <span class="chg-pill ${eco.cycleBadge.cls}" style="font-size:10.5px;">${esc(eco.cycleBadge.text)}</span>
        </div>

        <p style="font-size:12.5px;color:#f1f5f9;line-height:1.5;margin-bottom:8px;">
          ${esc(eco.kitchenAnalogy)}
        </p>

        ${eco.bakeryNote ? `
          <div style="padding:8px 10px;border-radius:10px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.24);font-size:12px;color:#e2e8f0;line-height:1.45;margin-bottom:9px;">
            ${esc(eco.bakeryNote)}
          </div>
        ` : ''}

        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:6px;">
          Arkasındaki Hammaddeler &amp; Tetikleyiciler (Dokun ve İncele):
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-bottom:10px;">
          ${eco.inputs.map(inp => {
            const clickAct = inp.kind === 'bist' ? `openBistDetailDrawer('${esc(inp.id)}')` : `openAssetDetailDrawer('${esc(inp.id)}')`;
            return `
              <div onclick="${clickAct}" style="cursor:pointer;padding:8px;border-radius:10px;background:rgba(9,11,18,0.72);border:1px solid var(--border-hairline);min-width:0;">
                <div style="font-size:10.5px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(inp.label)}</div>
                <div class="num-tab" style="font-size:12.5px;font-weight:800;color:#fff;margin-top:2px;">${esc(inp.priceStr)}</div>
                <div class="num-tab ${pCls(inp.chg1D)}" style="font-size:10.5px;margin-top:1px;">Bugün ${fmtP(inp.chg1D, 2)}</div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="display:grid;grid-template-columns:1fr;gap:6px;font-size:11.5px;line-height:1.45;margin-bottom:9px;">
          <div style="padding:7px 9px;border-radius:9px;background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.20);">
            <strong style="color:#fca5a5;">Geç Kalan Dedikodu / Haber:</strong> <span class="muted">${esc(eco.newsTrap)}</span>
          </div>
          <div style="padding:7px 9px;border-radius:9px;background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.22);">
            <strong style="color:#6ee7b7;">Önceden Söyleyen Hammadde İzi:</strong> <span class="muted">${esc(eco.rawSignal)}</span>
          </div>
        </div>

        <div style="padding:7px 9px;border-radius:9px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.22);font-size:11.5px;color:var(--text-secondary);line-height:1.45;margin-bottom:8px;">
          <strong style="color:#fbbf24;">Şu Anki Gerçek Türkiye Kuralı:</strong> ${esc(eco.ruleLine)}
        </div>

        <div class="chip-rail" style="margin-bottom:7px;">
          ${eco.peers.map(pr => {
            const fn = pr.kind === 'bist' ? `openBistDetailDrawer('${esc(pr.id)}')` : `openAssetDetailDrawer('${esc(pr.id)}')`;
            return `<button class="chip" style="height:27px;font-size:11px;padding:0 9px;" onclick="${fn}">Benzer / Alternatif: ${esc(pr.label)}</button>`;
          }).join('')}
        </div>
        <button class="btn-secondary" style="width:100%;height:31px;font-size:11.5px;" onclick="window.AetherExp.logWatchedOpportunity('${kind}','${esc(idOrTicker)}')">
          Almadan Kenardan İzle (Sessiz Köşeye Kaydet)
        </button>
      </div>
    `;
  }

  /* ==========================================================================
     4. AİLE ÜYELERİ, GERÇEK ZAMANLI CÜZDAN, T+2 TAKAS, SESSİZ SONUÇ & SENKRON
     ========================================================================== */
  let familyState = {
    updatedAt: Date.now(),
    showArchetypes: true,
    members: []
  };
  let activeMemberId = 'me_main';

  function createDefaultMember(id, name, roleTag, initialCashTL = 2000000, salaryDay = 1, monthlyAddTL = 30000, holdings = []) {
    const now = Date.now();
    return {
      id,
      name,
      roleTag,
      isArchetype: false,
      createdAt: now,
      updatedAt: now,
      salaryDay, // 1 veya 15
      monthlySalarySaveTL: monthlyAddTL,
      lastSalaryCreditedYm: '',
      wallet: {
        freeCashTL: initialCashTL,
        idleCashErosionTL: 0,
        frictionLeakTL: 0,
        lastAccrualMs: now,
        t2PendingSettlements: [],
        pendingOrders: [],
        watchedPassList: []
      },
      holdings: Array.isArray(holdings) ? holdings : [],
      activityFeed: [],
      blindSolvedIds: {},
      storyChoices: {},
      stats: {
        calmScore: 65,
        afterHoursSpreadHits: 0,
        impatientTradesCount: 0,
        smartRawReads: 0,
        panicSells: 0,
        peakValTL: initialCashTL,
        maxDrawdownPct: 0
      }
    };
  }

  function buildInitialFamilySeed() {
    const usdTry = Number(window.marketData?.macro?.usdTry) || 50.4;
    const goldP = Number(window.instById?.get('gram-altin-spot')?.currentPrice) || 6250;
    const s1P = Number(window.instById?.get('altin-sertifikasi')?.currentPrice) || 69.5;
    const spyP = Number(window.instById?.get('abd-sp500-spy')?.currentPrice) || 595;
    const bimasP = Number(window.marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup?.BIMAS?.close) || 495;
    const frotoP = Number(window.marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup?.FROTO?.close) || 95;
    const sasaP = Number(window.marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup?.SASA?.close) || 4.2;

    // Ana kullanıcı: Başlangıçta mevcut Kasam sepetiyle veya 2M ₺ gerçekçi dağılımla başlar
    const existingHoldings = Array.isArray(window.userPortfolio) && window.userPortfolio.length > 0
      ? JSON.parse(JSON.stringify(window.userPortfolio))
      : (window.buildPresetHoldings ? window.buildPresetHoldings('balanced') : []);

    const me = createDefaultMember('me_main', 'Ben', 'Kaptan Adayı', 150000, 1, 30000, existingHoldings);
    me.activityFeed.push({
      ts: Date.now() - 3600000 * 5,
      action: 'Kasa Kuruluşu',
      detail: 'Vergisiz Kira Sertifikası, Darphane Altın S1, Dünya Şirketleri ve nakit zengini market ortaklığıyla yola çıktı; 150.000 ₺ hazır nakit ayırdı.',
      why: 'Tek sepete sıkışmadan kışa da bahara da hazırlıklı olmak için.'
    });

    // Ev içi sohbet ve şans/ustalık kıyaslaması için 2 öğretici aile referans profili (1 tuşla gizlenebilir veya gerçek isimle değiştirilebilir!)
    const calmSister = createDefaultMember('fam_abla', 'Abla (Örnek)', 'Sabırlı Kalkan', 80000, 15, 25000, [
      { uid: 'ab_1', kind: 'inst', id: 'kira-sertifikasi-sukuk', name: 'Hazine Kira Sertifikası (Sukuk)', isRate: true, isUsd: false, qty: 600000, unitCost: 36.5, daysElapsed: 55, maturityDays: 365, rateStruct: 'fixed_coupon' },
      { uid: 'ab_2', kind: 'inst', id: 'altin-sertifikasi', name: 'Darphane Altın Sertifikası (S1)', isRate: false, isUsd: false, qty: +(620000 / (s1P * 0.92)).toFixed(2), unitCost: +(s1P * 0.92).toFixed(2), entryUsdTry: usdTry },
      { uid: 'ab_3', kind: 'bist', id: 'FROTO', name: 'FROTO · Ford Otomotiv', isRate: false, isUsd: false, qty: Math.max(10, Math.round(450000 / (frotoP * 0.94))), unitCost: +(frotoP * 0.94).toFixed(2) },
      { uid: 'ab_4', kind: 'inst', id: 'abd-sp500-spy', name: 'ABD En Büyük 500 Şirket Fonu', isRate: false, isUsd: true, qty: +(250000 / (spyP * 0.95 * usdTry)).toFixed(4), unitCost: +(spyP * 0.95).toFixed(2), entryUsdTry: +(usdTry * 0.98).toFixed(4) }
    ]);
    calmSister.isArchetype = true;
    calmSister.stats.smartRawReads = 4;
    calmSister.stats.calmScore = 88;
    calmSister.activityFeed.push({
      ts: Date.now() - 3600000 * 9,
      action: 'İhracat & Altın Kalkanı',
      detail: 'Euro ihracatı yapan otomotiv fabrikasını zirvesinden %45 indirimdeyken topladı; mesai içinde %0 vergili S1 aldı.',
      why: 'Avrupa siparişleri ve tahvil faizi dönüşünü manşetlerden önce beklemek için.'
    });

    const hastyCousin = createDefaultMember('fam_kuzen', 'Aceleci Kuzen (Örnek)', 'Dedikodu & Tek Sepet', 320000, 1, 20000, [
      { uid: 'kz_1', kind: 'bist', id: 'SASA', name: 'SASA · Sasa Polyester', isRate: false, isUsd: false, qty: Math.max(100, Math.round(1350000 / (sasaP * 1.09))), unitCost: +(sasaP * 1.09).toFixed(2) },
      { uid: 'kz_2', kind: 'inst', id: 'gram-altin-spot', name: 'Gram Altın (Gece Banka Makaslı)', isRate: false, isUsd: false, qty: +(330000 / (goldP * 1.036)).toFixed(2), unitCost: +(goldP * 1.036).toFixed(2), entryUsdTry: usdTry }
    ]);
    hastyCousin.isArchetype = true;
    hastyCousin.wallet.frictionLeakTL = 18400;
    hastyCousin.wallet.idleCashErosionTL = 4120;
    hastyCousin.stats.afterHoursSpreadHits = 2;
    hastyCousin.stats.impatientTradesCount = 6;
    hastyCousin.stats.calmScore = 31;
    hastyCousin.activityFeed.push({
      ts: Date.now() - 3600000 * 3,
      action: 'Gece 23:15 Bankadan Altın & Tek Hisse',
      detail: 'Akşam sosyal medyada haber görüp banka uygulamasından %3,6 mesai dışı makasla altın aldı; parasının %70’ini tek hisseye bağladı.',
      why: 'Arkadaş grubunda "uçacak" dendiği için kaçırmaktan korktu.'
    });

    return [me, calmSister, hastyCousin];
  }

  function loadFamilyState() {
    try {
      const raw = localStorage.getItem(FAMILY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.members) && parsed.members.length > 0) {
          familyState = parsed;
        }
      }
    } catch (_) {}

    if (!Array.isArray(familyState.members) || familyState.members.length === 0) {
      familyState.members = buildInitialFamilySeed();
      familyState.updatedAt = Date.now();
    }

    const savedActive = localStorage.getItem(ACTIVE_MEMBER_KEY);
    if (savedActive && familyState.members.some(m => m.id === savedActive)) {
      activeMemberId = savedActive;
    } else {
      activeMemberId = familyState.members[0].id;
    }

    importFamilyFromUrlHash();
    syncActiveMemberWithGlobalKasam(false);
  }

  function saveFamilyState(pushServer = true) {
    familyState.updatedAt = Date.now();
    try {
      localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(familyState));
      localStorage.setItem(ACTIVE_MEMBER_KEY, activeMemberId);
    } catch (_) {}

    if (pushServer) {
      pushFamilyToLocalServer().catch(() => {});
    }
  }

  function ensureFamilyLoaded() {
    if (!window.__aetherV8Booted && window.marketData) {
      window.__aetherV8Booted = true;
      loadFamilyState();
    }
  }

  function getActiveMember() {
    ensureFamilyLoaded();
    let m = familyState.members.find(x => x.id === activeMemberId);
    if (!m) {
      m = familyState.members[0];
      if (m) activeMemberId = m.id;
    }
    return m;
  }

  let __v8SyncGuard = false;
  function syncActiveMemberWithGlobalKasam(writeFromGlobalToMember = true) {
    if (__v8SyncGuard) return;
    const m = getActiveMember();
    if (!m) return;
    __v8SyncGuard = true;
    try {
      if (writeFromGlobalToMember) {
        m.holdings = JSON.parse(JSON.stringify(window.userPortfolio || []));
        m.updatedAt = Date.now();
        saveFamilyState(true);
      } else {
        window.userPortfolio = JSON.parse(JSON.stringify(m.holdings || []));
        window.isPortfolioSample = false;
        if (window.persistPortfolio) window.persistPortfolio();
      }
    } finally {
      __v8SyncGuard = false;
    }
  }

  async function pushFamilyToLocalServer() {
    if (location.hostname.endsWith('github.io') || location.protocol === 'file:') return;
    try {
      const realMembers = familyState.members.filter(m => !m.isArchetype);
      if (!realMembers.length) return;
      const res = await fetch('/api/family-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: realMembers })
      });
      if (res.ok) {
        const data = await res.json();
        mergeRemoteMembers(data.members || []);
      }
    } catch (_) {}
  }

  async function pullFamilyFromLocalServer() {
    if (location.hostname.endsWith('github.io') || location.protocol === 'file:') return;
    try {
      const res = await fetch('/api/family-hub', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (mergeRemoteMembers(data.members || [])) {
          renderAllExperienceSurfaces();
        }
      }
    } catch (_) {}
  }

  function mergeRemoteMembers(remoteList) {
    if (!Array.isArray(remoteList) || !remoteList.length) return false;
    let changed = false;
    for (const rm of remoteList) {
      if (!rm || !rm.id) continue;
      const idx = familyState.members.findIndex(x => x.id === rm.id);
      if (idx < 0) {
        familyState.members.push(rm);
        changed = true;
      } else if ((Number(rm.updatedAt) || 0) > (Number(familyState.members[idx].updatedAt) || 0)) {
        familyState.members[idx] = rm;
        if (rm.id === activeMemberId) syncActiveMemberWithGlobalKasam(false);
        changed = true;
      }
    }
    if (changed) saveFamilyState(false);
    return changed;
  }

  function exportFamilyShareUrl() {
    const compact = familyState.members.filter(m => !m.isArchetype).map(m => ({
      id: m.id,
      name: m.name,
      roleTag: m.roleTag,
      updatedAt: m.updatedAt,
      salaryDay: m.salaryDay,
      monthlySalarySaveTL: m.monthlySalarySaveTL,
      wallet: m.wallet,
      holdings: m.holdings,
      activityFeed: (m.activityFeed || []).slice(0, 6),
      stats: m.stats
    }));
    const json = JSON.stringify({ v: 8, members: compact });
    const b64 = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const base = location.origin && location.origin !== 'null'
      ? (location.origin + location.pathname)
      : 'https://4zyq4sk2tk-collab.github.io/AETHER-iOS/';
    return `${base}#aile=${b64}`;
  }

  function importFamilyFromUrlHash() {
    try {
      const h = String(location.hash || '');
      if (!h.startsWith('#aile=')) return;
      let b64 = h.slice(6).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const json = decodeURIComponent(escape(atob(b64)));
      const parsed = JSON.parse(json);
      if (parsed && Array.isArray(parsed.members)) {
        mergeRemoteMembers(parsed.members);
        history.replaceState(null, '', location.pathname + location.search);
        if (window.showToast) window.showToast('Aile kasaları ve son hamleler eşitlendi');
      }
    } catch (_) {}
  }

  /* ==========================================================================
     5. GERÇEK ZAMANLI GECELİK NEMALANDIRMA, ENFLASYON ERİMESİ, MAAŞ, T+2 & EMİR ÇÖZÜMÜ
     ========================================================================== */
  function settleRealTimeMemberWallet(member, nowMs = Date.now()) {
    if (!member || !member.wallet || !window.marketData) return;
    const w = member.wallet;
    const clk = getIstanbulMarketClock(nowMs);
    const cpiYoy = Number(window.marketData.macro?.cpiYoy) || 29.77;
    const dailyInfRate = Math.pow(1 + cpiYoy / 100, 1 / 365) - 1;

    // 1. Geçen gerçek süreye göre boşta vadesiz nakdin sessiz enflasyon erimesini işle
    const elapsedMs = Math.max(0, nowMs - (Number(w.lastAccrualMs) || nowMs));
    if (elapsedMs >= 60000) {
      const elapsedDays = elapsedMs / (24 * 3600 * 1000);
      if ((w.freeCashTL || 0) > 100) {
        w.idleCashErosionTL = +((Number(w.idleCashErosionTL) || 0) + w.freeCashTL * dailyInfRate * elapsedDays).toFixed(2);
      }
      // Oran bazlı varlıkların (PPF, Mevduat, Sukuk, Tahvil) gerçek takvim günü ilerlemesi
      if (elapsedDays >= 0.05) {
        for (const h of (member.holdings || [])) {
          if (h.isRate) {
            h.daysElapsed = +((Number(h.daysElapsed) || 0) + elapsedDays).toFixed(2);
          }
        }
      }
      w.lastAccrualMs = nowMs;
    }

    // 2. Gerçek Maaş Günü (Ayın 1'i veya 15'i) geldiyse aylık tasarrufu taze nakit olarak yatır
    const ymKey = `${clk.year}-${String(clk.month).padStart(2, '0')}-${member.salaryDay || 1}`;
    if (!member.isArchetype && clk.day >= (member.salaryDay || 1) && member.lastSalaryCreditedYm !== ymKey) {
      // İlk kurulum gününde sürpriz bakiye şişmesi olmasın diye yalnız kurulumdan sonraki maaş günlerinde yatırır
      if (nowMs - (member.createdAt || nowMs) > 12 * 3600 * 1000 && (member.monthlySalarySaveTL || 0) > 0) {
        w.freeCashTL = Math.round((w.freeCashTL || 0) + member.monthlySalarySaveTL);
        member.activityFeed.unshift({
          ts: nowMs,
          action: `Maaş Günü Birikimi (+${window.fmtTL(member.monthlySalarySaveTL, 0)})`,
          detail: `Ayın ${member.salaryDay || 1}’i geldi; kenara ayrılan taze nakit kasaya eklendi.`,
          why: 'Düzenli aylık çark'
        });
      }
      member.lastSalaryCreditedYm = ymKey;
    }

    // 3. T+2 Takas süresi dolan hisse satış paralarını çekilebilir nakde aktar
    if (Array.isArray(w.t2PendingSettlements) && w.t2PendingSettlements.length > 0) {
      const stillPending = [];
      for (const s of w.t2PendingSettlements) {
        if (nowMs >= (Number(s.releaseAtMs) || 0)) {
          w.freeCashTL = Math.round((w.freeCashTL || 0) + (Number(s.amountTL) || 0));
          member.activityFeed.unshift({
            ts: nowMs,
            action: 'T+2 Takas Çözüldü',
            detail: `${s.sourceName} satışından bekleyen ${window.fmtTL(s.amountTL, 0)} takastan çıkıp serbest nakde geçti.`,
            why: 'BIST T+2 gerçek takas süresi tamamlandı'
          });
        } else {
          stillPending.push(s);
        }
      }
      w.t2PendingSettlements = stillPending;
    }

    // 4. Bekleyen Emirlerin (09:55 BIST Açılışı veya 13:30 TEFAS Valörü) zamanı geldiyse gerçek fiyattan gerçekleştir
    if (Array.isArray(w.pendingOrders) && w.pendingOrders.length > 0) {
      const remainingOrders = [];
      for (const ord of w.pendingOrders) {
        const canFillBist = ord.venue === 'bist' && clk.bistIsTradableNow && nowMs >= (ord.executeAfterMs || 0);
        const canFillTefas = ord.venue === 'tefas' && nowMs >= (ord.executeAfterMs || 0);
        const canFillUs = ord.venue === 'us' && clk.usEquitiesOpen && nowMs >= (ord.executeAfterMs || 0);
        if (canFillBist || canFillTefas || canFillUs) {
          fillQueuedOrderIntoHoldings(member, ord, nowMs);
        } else {
          remainingOrders.push(ord);
        }
      }
      w.pendingOrders = remainingOrders;
    }
  }

  function fillQueuedOrderIntoHoldings(member, ord, nowMs) {
    const usdTry = Number(window.marketData?.macro?.usdTry) || 50.4;
    const lookup = window.marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup || {};
    if (ord.kind === 'bist') {
      const st = lookup[ord.targetId];
      const liveP = Number(st?.close) || Number(ord.refPrice) || 1;
      const lots = Math.max(1, Math.floor(ord.amountTL / liveP));
      const actualCost = lots * liveP;
      const rem = Math.max(0, ord.amountTL - actualCost);
      member.wallet.freeCashTL = Math.round((member.wallet.freeCashTL || 0) + rem);
      mergeHoldingIntoMember(member, {
        kind: 'bist',
        id: ord.targetId,
        name: `${ord.targetId} · ${window.formatBistCompanyName ? window.formatBistCompanyName(st?.name, ord.targetId) : ord.targetId}`,
        isRate: false,
        isUsd: false,
        qty: lots,
        unitCost: liveP
      });
      member.activityFeed.unshift({
        ts: nowMs,
        action: `Bekleyen Emir Gerçekleşti (${ord.targetId})`,
        detail: `Seans açılışıyla ${lots} pay ${window.fmtNum(liveP, 2)} ₺ canlı fiyattan kasaya alındı.`,
        why: ord.why || 'Seans açılış emri'
      });
    } else {
      const inst = window.instById?.get(ord.targetId);
      if (!inst) return;
      const meta = window.getAssetMeta ? window.getAssetMeta(inst) : { title: inst.name };
      const liveP = Number(inst.currentPrice) || Number(ord.refPrice) || 1;
      const unitTL = inst.isUsdAsset ? liveP * usdTry : liveP;
      const qty = +(ord.amountTL / Math.max(0.0001, unitTL)).toFixed(4);
      mergeHoldingIntoMember(member, {
        kind: 'inst',
        id: inst.id,
        name: meta.title,
        isRate: Boolean(inst.isRateInstrument),
        isUsd: Boolean(inst.isUsdAsset),
        qty: inst.isRateInstrument ? ord.amountTL : qty,
        unitCost: liveP,
        entryUsdTry: usdTry,
        daysElapsed: 0,
        maturityDays: inst.id === 'kira-sertifikasi-sukuk' ? 365 : 32,
        rateStruct: inst.id === 'kira-sertifikasi-sukuk' ? 'fixed_coupon' : 'daily_ppf'
      });
      member.activityFeed.unshift({
        ts: nowMs,
        action: `Valörlü Emir Kasaya Geçti`,
        detail: `${meta.title} emri valör saati tamamlanarak güncel fiyattan kasaya işlendi.`,
        why: ord.why || 'Valörlü alım'
      });
    }
    if (member.id === activeMemberId) syncActiveMemberWithGlobalKasam(false);
  }

  function mergeHoldingIntoMember(member, newItem) {
    const list = member.holdings || (member.holdings = []);
    const idx = list.findIndex(x => x.kind === newItem.kind && x.id === newItem.id);
    if (idx >= 0) {
      const ex = list[idx];
      const totQty = (Number(ex.qty) || 0) + (Number(newItem.qty) || 0);
      const mergedCost = totQty > 0
        ? (((Number(ex.qty) || 0) * (Number(ex.unitCost) || newItem.unitCost)) + ((Number(newItem.qty) || 0) * newItem.unitCost)) / totQty
        : newItem.unitCost;
      list[idx] = { ...ex, qty: +totQty.toFixed(4), unitCost: +mergedCost.toFixed(4) };
    } else {
      list.push({
        uid: 'pf_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        ...newItem
      });
    }
  }

  // Gerçek Türkiye Kurallarıyla Alım / Satım Yürütücüsü (T+2, 13:30 Valör, 17:30 Banka Makası, VBTS, Devre Kesici!)
  function executeRealTurkishOrder(opts) {
    const member = getActiveMember();
    if (!member || !window.marketData) return;
    const nowMs = Date.now();
    settleRealTimeMemberWallet(member, nowMs);

    const clk = getIstanbulMarketClock(nowMs);
    const usdTry = Number(window.marketData.macro?.usdTry) || 50.4;
    const lookup = window.marketData.kitchenIntelSummary?.openHorizon?.bistStockLookup || {};
    const { side, kind, targetId, amountTL, holdUid, whyReason } = opts;

    if (side === 'sell') {
      const idx = (member.holdings || []).findIndex(x => x.uid === holdUid);
      if (idx < 0) return;
      const item = member.holdings[idx];
      const r = window.resolveHoldingLiveState(item);

      // 1. BIST Hisse veya BIST BYF Satışı -> Seans açık olmalı + T+2 Takas Kuralı!
      const isBistTraded = item.kind === 'bist' || (r.inst?.symbol && String(r.inst.symbol).startsWith('BIST:'));
      if (isBistTraded) {
        if (item.kind === 'bist') {
          const rest = getBistTradingRestriction(item.id);
          if (rest.circuitBreaker) {
            window.showToast('Bu hissede Devre Kesici eşleşme molası aktif; şu an satış eşleşmez.');
            return;
          }
          if (rest.brutTakas && item.boughtDateKey === clk.dateKey) {
            window.showToast('VBTS Brüt Takas kuralı: Bugün alınan pay aynı gün satılamaz.');
            return;
          }
        }
        if (!clk.bistIsTradableNow) {
          window.showToast(`Borsa İstanbul şu an kapalı (${clk.timeStr}). Satış işlemi sabah 10:00 seansında yapılabilir.`);
          return;
        }
        const comm = Math.round(r.valueTL * 0.0008); // Binde 0,8 gerçekçi borsa/aracı kurum payı
        const netProceeds = Math.max(0, Math.round(r.valueTL - comm));
        const releaseMs = addBusinessDaysTR(nowMs, 2, 9, 30);
        const rest = item.kind === 'bist' ? getBistTradingRestriction(item.id) : { brutTakas: false };
        member.wallet.frictionLeakTL = +((member.wallet.frictionLeakTL || 0) + comm).toFixed(2);
        member.wallet.t2PendingSettlements.push({
          id: 't2_' + Date.now().toString(36),
          sourceName: r.displayName,
          amountTL: netProceeds,
          soldAtMs: nowMs,
          releaseAtMs: releaseMs,
          isBrutTakas: Boolean(rest.brutTakas)
        });
        if (r.pnlPct <= -8) member.stats.panicSells = (member.stats.panicSells || 0) + 1;
        member.stats.impatientTradesCount = (member.stats.impatientTradesCount || 0) + 1;
        member.holdings.splice(idx, 1);
        member.activityFeed.unshift({
          ts: nowMs,
          action: `Satış · T+2 Takasa Alındı (${r.code})`,
          detail: `${r.displayName} satıldı. ${window.fmtTL(netProceeds, 0)} tutar gerçek T+2 takas kuralıyla ${formatTrShortDateTime(releaseMs)} sabahı nakde dönecek.`,
          why: whyReason || 'Pozisyon kapatma'
        });
        syncActiveMemberWithGlobalKasam(false);
        saveFamilyState(true);
        window.closeSheet();
        renderAllExperienceSurfaces();
        window.showToast(`Satıldı · Nakit T+2 takasta (${formatTrShortDateTime(releaseMs)})`);
        return;
      }

      // 2. Banka Altın / Döviz Satışı -> 17:30 sonrası mesai dışı alış makası kesintisi!
      const isPhysicalOrBankFxGold = item.id === 'gram-altin-spot' || String(item.id).startsWith('doviz-') || item.id === 'ceyrek-altin' || item.id === 'cumhuriyet-altini';
      let netCash = r.valueTL;
      let spreadLoss = 0;
      if (isPhysicalOrBankFxGold) {
        const halfSpread = (clk.bankSpreadPct / 2) / 100;
        spreadLoss = Math.round(r.valueTL * halfSpread);
        netCash = Math.max(0, Math.round(r.valueTL - spreadLoss));
        member.wallet.frictionLeakTL = +((member.wallet.frictionLeakTL || 0) + spreadLoss).toFixed(2);
        if (!clk.bankHoursOpen) member.stats.afterHoursSpreadHits = (member.stats.afterHoursSpreadHits || 0) + 1;
      } else if (r.inst && Number(r.inst.taxRatePct) > 0 && !item.isRate && r.pnlTL > 0) {
        // Stopajlı yatırım fonlarında kârdan %17,5 gerçek stopaj kesintisi
        const stopajCut = Math.round(r.pnlTL * (Number(r.inst.taxRatePct) / 100));
        netCash = Math.max(0, Math.round(r.valueTL - stopajCut));
      }

      member.wallet.freeCashTL = Math.round((member.wallet.freeCashTL || 0) + netCash);
      member.holdings.splice(idx, 1);
      member.stats.impatientTradesCount = (member.stats.impatientTradesCount || 0) + 1;
      member.activityFeed.unshift({
        ts: nowMs,
        action: `Bozduruldu (${r.code})`,
        detail: `${r.displayName} bozduruldu; ${window.fmtTL(netCash, 0)} serbest nakde geçti${spreadLoss > 500 ? ` (Mesai dışı banka makas farkı: -${window.fmtTL(spreadLoss, 0)})` : ''}.`,
        why: whyReason || 'Nakde geçiş'
      });
      syncActiveMemberWithGlobalKasam(false);
      saveFamilyState(true);
      window.closeSheet();
      renderAllExperienceSurfaces();
      window.showToast(`${window.fmtTL(netCash, 0)} nakde geçti`);
      return;
    }

    // ALIM İŞLEMİ (BUY)
    const reqTL = Math.max(0, Math.round(Number(amountTL) || 0));
    if (reqTL < 500) {
      window.showToast('En az 500 ₺ tutar girin');
      return;
    }

    const isBistOrder = kind === 'bist' || (window.instById?.get(targetId)?.symbol && String(window.instById.get(targetId).symbol).startsWith('BIST:'));
    const rest = kind === 'bist' ? getBistTradingRestriction(targetId) : { circuitBreaker: false, brutTakas: false };

    // T+2 takastaki parayla normal BIST hissesi alınabilir, ama VBTS Brüt Takas hissesi veya banka altını/mevduatı ALINAMAZ!
    const usableT2ForBist = (isBistOrder && !rest.brutTakas)
      ? (member.wallet.t2PendingSettlements || []).filter(s => !s.isBrutTakas).reduce((sum, s) => sum + (Number(s.amountTL) || 0), 0)
      : 0;
    const maxSpendable = (member.wallet.freeCashTL || 0) + usableT2ForBist;

    if (reqTL > maxSpendable) {
      const t2Locked = (member.wallet.t2PendingSettlements || []).reduce((sum, s) => sum + (Number(s.amountTL) || 0), 0);
      window.showToast(
        t2Locked > 0
          ? `Serbest nakit yetersiz (${window.fmtTL(member.wallet.freeCashTL, 0)}). ${window.fmtTL(t2Locked, 0)} T+2 takasta bekliyor!`
          : `Kasada yeterli boş nakit yok (Mevcut: ${window.fmtTL(member.wallet.freeCashTL, 0)})`
      );
      return;
    }

    if (rest.circuitBreaker) {
      window.showToast('Bu hissede Devre Kesici eşleşme molası çalışıyor; mola bitene kadar işlem kilitli.');
      return;
    }

    // Bakiye düşümü (Önce serbest nakitten, yetmezse BIST içi T+2'den)
    let fromFree = Math.min(member.wallet.freeCashTL || 0, reqTL);
    let fromT2 = reqTL - fromFree;
    member.wallet.freeCashTL = Math.round((member.wallet.freeCashTL || 0) - fromFree);
    if (fromT2 > 0) {
      for (const s of member.wallet.t2PendingSettlements) {
        if (s.isBrutTakas || fromT2 <= 0) continue;
        const take = Math.min(s.amountTL, fromT2);
        s.amountTL -= take;
        fromT2 -= take;
      }
      member.wallet.t2PendingSettlements = member.wallet.t2PendingSettlements.filter(s => s.amountTL > 1);
    }

    // Durum A: BIST kapalıysa bekleyen emir kuyruğuna yaz (09:55 / 10:00'u beklesin!)
    if (isBistOrder && !clk.bistIsTradableNow) {
      const openMs = clk.nextBistOpenMs;
      const st = kind === 'bist' ? lookup[targetId] : null;
      const inst = kind === 'inst' ? window.instById.get(targetId) : null;
      const refP = kind === 'bist' ? (st?.close || 1) : (inst?.currentPrice || 1);
      const title = kind === 'bist'
        ? `${targetId} · ${window.formatBistCompanyName ? window.formatBistCompanyName(st?.name, targetId) : targetId}`
        : (window.getAssetMeta ? window.getAssetMeta(inst).title : targetId);

      member.wallet.pendingOrders.push({
        id: 'ord_' + Date.now().toString(36),
        venue: 'bist',
        kind,
        targetId,
        title,
        amountTL: reqTL,
        refPrice: refP,
        createdAtMs: nowMs,
        executeAfterMs: openMs,
        why: whyReason || 'Açılış bekleyen emir'
      });
      member.activityFeed.unshift({
        ts: nowMs,
        action: `Bekleyen Emir Yazıldı (${kind === 'bist' ? targetId : 'BIST'})`,
        detail: `Tahtalar kapalı olduğu için ${window.fmtTL(reqTL, 0)} tutarlı ${title} emri ${formatTrShortDateTime(openMs)} açılış seansına alındı.`,
        why: whyReason || 'Sabah açılışını bekliyor'
      });
      saveFamilyState(true);
      window.closeSheet();
      renderAllExperienceSurfaces();
      window.showToast(`Tahta kapalı · Emir ${formatTrShortDateTime(openMs)} açılışına yazıldı`);
      return;
    }

    // Durum B: BIST açıkken anlık gerçek fiyattan alış
    if (kind === 'bist') {
      const st = lookup[targetId];
      const liveP = Number(st?.close) || 1;
      const comm = Math.round(reqTL * 0.0008);
      const netForLots = Math.max(liveP, reqTL - comm);
      const lots = Math.max(1, Math.floor(netForLots / liveP));
      const spent = lots * liveP + comm;
      if (reqTL > spent) member.wallet.freeCashTL += Math.round(reqTL - spent);
      member.wallet.frictionLeakTL = +((member.wallet.frictionLeakTL || 0) + comm).toFixed(2);

      mergeHoldingIntoMember(member, {
        kind: 'bist',
        id: targetId,
        name: `${targetId} · ${window.formatBistCompanyName ? window.formatBistCompanyName(st?.name, targetId) : targetId}`,
        isRate: false,
        isUsd: false,
        qty: lots,
        unitCost: liveP,
        boughtDateKey: clk.dateKey
      });
      if ((Number(st?.drawdown52WPct) || 0) <= -20 && (Number(st?.netIncomeMillionTL) || 0) > 0) {
        member.stats.smartRawReads = (member.stats.smartRawReads || 0) + 1;
      }
      member.activityFeed.unshift({
        ts: nowMs,
        action: `Ortaklık Alındı (${targetId})`,
        detail: `${lots} pay (${window.fmtTL(lots * liveP, 0)}) güncel tahta fiyatından kasaya eklendi.`,
        why: whyReason || 'Dükkân ortaklığı'
      });
      syncActiveMemberWithGlobalKasam(false);
      saveFamilyState(true);
      window.closeSheet();
      renderAllExperienceSurfaces();
      window.showToast(`${lots} pay ${targetId} kasana eklendi`);
      return;
    }

    // Durum C: Diğer Varlıklar (Banka Altın/Döviz makası, ABD seansı, TEFAS 13:30 valörü, Sukuk/PPF)
    const inst = window.instById?.get(targetId);
    if (!inst) return;
    const meta = window.getAssetMeta ? window.getAssetMeta(inst) : { title: inst.name };
    const id = inst.id;

    // C1: Banka Altın / Döviz — Mesai dışı açık makas gerçekliği!
    if (id === 'gram-altin-spot' || id.startsWith('doviz-') || id === 'ceyrek-altin' || id === 'cumhuriyet-altini' || id === 'bilezik-22-ayar') {
      const halfSpread = (clk.bankSpreadPct / 2) / 100;
      const buyUnitPrice = +(Number(inst.currentPrice) * (1 + halfSpread)).toFixed(2);
      const spreadHit = Math.round(reqTL * halfSpread);
      member.wallet.frictionLeakTL = +((member.wallet.frictionLeakTL || 0) + spreadHit).toFixed(2);
      if (!clk.bankHoursOpen) member.stats.afterHoursSpreadHits = (member.stats.afterHoursSpreadHits || 0) + 1;

      const qty = +(reqTL / buyUnitPrice).toFixed(3);
      mergeHoldingIntoMember(member, {
        kind: 'inst',
        id: inst.id,
        name: meta.title,
        isRate: false,
        isUsd: false,
        qty,
        unitCost: buyUnitPrice,
        entryUsdTry: usdTry
      });
      member.activityFeed.unshift({
        ts: nowMs,
        action: `${meta.title} Alındı`,
        detail: `${window.fmtTL(reqTL, 0)} ile ${window.fmtNum(buyUnitPrice, 2)} ₺ alış kurundan alındı${!clk.bankHoursOpen ? ` (17:30 sonrası banka makası nedeniyle -${window.fmtTL(spreadHit, 0)} fark oluştu)` : ''}.`,
        why: whyReason || 'Kalkan alımı'
      });
      syncActiveMemberWithGlobalKasam(false);
      saveFamilyState(true);
      window.closeSheet();
      renderAllExperienceSurfaces();
      window.showToast(!clk.bankHoursOpen ? `Alındı (Mesai dışı banka makasıyla: ${window.fmtNum(buyUnitPrice, 0)} ₺)` : `${meta.title} kasana eklendi`);
      return;
    }

    // C2: ABD Borsası kapalıysa NY açılışını (17:30) bekleyen emir
    if (inst.isUsdAsset && !clk.usEquitiesOpen) {
      const nextOpen = clk.isWeekend ? addBusinessDaysTR(nowMs, 1, 17, 30) : istanbulDateKeyToUtcMs(clk.year, clk.month, clk.day + (clk.minsOfDay > 18 * 60 ? 1 : 0), 17, 30);
      member.wallet.pendingOrders.push({
        id: 'ord_' + Date.now().toString(36),
        venue: 'us',
        kind: 'inst',
        targetId: inst.id,
        title: meta.title,
        amountTL: reqTL,
        refPrice: inst.currentPrice,
        createdAtMs: nowMs,
        executeAfterMs: nextOpen,
        why: whyReason || 'ABD açılış emri'
      });
      member.activityFeed.unshift({
        ts: nowMs,
        action: `ABD Seans Emri Yazıldı`,
        detail: `New York seansı kapalı olduğu için ${meta.title} emri saat 17:30 açılışına yazıldı.`,
        why: whyReason || 'Küresel ortaklık'
      });
      saveFamilyState(true);
      window.closeSheet();
      renderAllExperienceSurfaces();
      window.showToast('New York borsası 17:30’da açıldığında emrin gerçekleşecek');
      return;
    }

    // C3: Kripto (7/24), PPF / Mevduat / Sukuk (mesai içi anlık) veya açık BIST BYF (S1, APX30 vb.)
    const liveP = Number(inst.currentPrice) || 1;
    const unitTL = inst.isUsdAsset ? liveP * usdTry : liveP;
    const qty = inst.isRateInstrument ? reqTL : +(reqTL / Math.max(0.0001, unitTL)).toFixed(4);
    mergeHoldingIntoMember(member, {
      kind: 'inst',
      id: inst.id,
      name: meta.title,
      isRate: Boolean(inst.isRateInstrument),
      isUsd: Boolean(inst.isUsdAsset),
      qty,
      unitCost: liveP,
      entryUsdTry: usdTry,
      daysElapsed: 0,
      maturityDays: id === 'kira-sertifikasi-sukuk' ? 365 : id === 'dibs-tahvil' ? 730 : 32,
      rateStruct: (id === 'kira-sertifikasi-sukuk' || id === 'dibs-tahvil') ? 'fixed_coupon' : 'daily_ppf'
    });
    member.activityFeed.unshift({
      ts: nowMs,
      action: `${meta.title} Eklendi`,
      detail: `${window.fmtTL(reqTL, 0)} tutar güncel piyasa koşuluyla kasaya yerleştirildi.`,
      why: whyReason || 'Portföy adımı'
    });
    syncActiveMemberWithGlobalKasam(false);
    saveFamilyState(true);
    window.closeSheet();
    renderAllExperienceSurfaces();
    window.showToast(`${meta.title} kasana eklendi`);
  }

  // SPK Halka Arz Talep Toplama (Gerçek Kişi Başı Eşit Dağıtım Sınırlı!)
  function participateInSpkIpo(requestedTL) {
    const member = getActiveMember();
    if (!member) return;
    const req = Math.max(0, Number(requestedTL) || 0);
    if (req < ACTIVE_SPK_IPO_SIM.lotPriceTL) {
      window.showToast('En az 1 lot tutarı girin');
      return;
    }
    if (req > (member.wallet.freeCashTL || 0)) {
      window.showToast('Serbest nakit yetersiz');
      return;
    }
    const requestedLots = Math.floor(req / ACTIVE_SPK_IPO_SIM.lotPriceTL);
    const allottedLots = Math.min(requestedLots, ACTIVE_SPK_IPO_SIM.maxAllottedLotsPerPerson);
    const allottedCost = +(allottedLots * ACTIVE_SPK_IPO_SIM.lotPriceTL).toFixed(2);
    const refundedTL = Math.max(0, req - allottedCost);

    member.wallet.freeCashTL = Math.round((member.wallet.freeCashTL || 0) - allottedCost);
    mergeHoldingIntoMember(member, {
      kind: 'inst',
      id: 'reel-enerji-astor',
      name: `${ACTIVE_SPK_IPO_SIM.companyName} (${allottedLots} Lot)`,
      isRate: false,
      isUsd: false,
      qty: allottedLots,
      unitCost: Number(window.instById?.get('reel-enerji-astor')?.currentPrice) || ACTIVE_SPK_IPO_SIM.lotPriceTL
    });
    member.activityFeed.unshift({
      ts: Date.now(),
      action: `Halka Arz Dağıtımı (${allottedLots} Lot)`,
      detail: `${window.fmtTL(req, 0)} talep girildi; 1,85 milyon katılımcıda kişi başı en fazla ${allottedLots} lot (${window.fmtTL(allottedCost, 0)}) düştü. Kalan ${window.fmtTL(refundedTL, 0)} nakde iade edildi.`,
      why: 'SPK eşit dağıtım gerçekliği'
    });
    syncActiveMemberWithGlobalKasam(false);
    saveFamilyState(true);
    window.closeSheet();
    renderAllExperienceSurfaces();
    window.showToast(`Kişi başı ${allottedLots} lot (${window.fmtTL(allottedCost, 0)}) düştü; üstü iade edildi`);
  }

  // "Almadım, Kenardan İzliyorum" — Sessizce Kaçanlar / Sabır Köşesi Kaydı
  function logWatchedOpportunity(kind, idOrTicker, customNote = '') {
    const member = getActiveMember();
    if (!member || !window.marketData) return;
    const lookup = window.marketData.kitchenIntelSummary?.openHorizon?.bistStockLookup || {};
    let refPrice = 0;
    let label = idOrTicker;
    if (kind === 'bist') {
      const st = lookup[idOrTicker];
      if (!st) return;
      refPrice = Number(st.close) || 0;
      label = `${idOrTicker} · ${window.formatBistCompanyName ? window.formatBistCompanyName(st.name, idOrTicker) : idOrTicker}`;
    } else {
      const inst = window.instById?.get(idOrTicker);
      if (!inst) return;
      const usdTry = Number(window.marketData.macro?.usdTry) || 50.4;
      refPrice = inst.isUsdAsset ? Number(inst.currentPrice) * usdTry : Number(inst.currentPrice);
      label = window.getAssetMeta ? window.getAssetMeta(inst).title : inst.name;
    }
    if (refPrice <= 0) return;
    const list = member.wallet.watchedPassList || (member.wallet.watchedPassList = []);
    if (!list.some(x => x.kind === kind && x.id === idOrTicker)) {
      list.unshift({
        kind,
        id: idOrTicker,
        label,
        refPriceTL: refPrice,
        loggedAtMs: Date.now(),
        note: customNote || 'Kenardan izlemeye alındı'
      });
      if (list.length > 12) list.length = 12;
      member.stats.calmScore = Math.min(100, (member.stats.calmScore || 65) + 2);
      saveFamilyState(true);
    }
    window.closeSheet();
    renderAllExperienceSurfaces();
    window.showToast('Sessiz takip köşesine eklendi; zaman geçtikçe ne kaçırdığını veya neden korunduğunu göreceksin.');
  }

  /* ==========================================================================
     6. SABAHIN GERÇEK HİKÂYESİ VE "İSİMSİZ DÜKKÂN" SOKAK ZEKASI BULMACASI
     ========================================================================== */
  function buildTodayMorningStory() {
    const m = window.marketData?.macro || {};
    const clk = getIstanbulMarketClock();
    const oilInst = window.instById?.get('emtia-petrol-bno');
    const goldInst = window.instById?.get('gram-altin-spot');
    const sukukInst = window.instById?.get('kira-sertifikasi-sukuk');
    const smartList = window.getSmartBistCandidates ? window.getSmartBistCandidates() : [];
    const topSmart = smartList[0];
    const oilChg1M = Number(oilInst?.pagePerf?.perf1M ?? oilInst?.perf1M) || 0;
    const feed = window.marketData?.liveRealWorldFeed || [];
    const topNews = feed[0];

    // Saate ve gerçek piyasa durumuna duyarlı canlı hikâye (Sabah Açılış Öncesi vs Gece Mesai Dışı vs Canlı Seans)
    if (clk.isBusinessDay && clk.hour >= 6 && !clk.bistIsTradableNow && clk.minsOfDay < 10 * 60) {
      const targetTicker = topSmart ? topSmart.ticker : 'BIMAS';
      return {
        id: 'story_morning_prep_' + clk.dateKey,
        kicker: `SABAH AÇILIŞ HAZIRLIĞI · SAAT ${clk.timeStr}`,
        headline: clk.minsOfDay < 9 * 60
          ? 'Sabah çayı vakti: 09:00’da banka makası daralır, 09:55’te Borsa eşleşmesi başlar.'
          : 'Banka makasları daraldı; 09:55 açılış eşleşmesine ve 10:00 Borsa ziline dakikalar kaldı!',
        body: `${topNews ? `Sabah masasında "${topNews.title}" başlığı var. ` : ''}${clk.minsOfDay < 9 * 60 ? `Şu an saat 09:00 öncesi olduğu için bankalarda döviz/altın makası hâlâ ~%${clk.bankSpreadPct.toFixed(1).replace('.', ',')} açık; 09:00’u beklemeden bankadan işlem yapan güne ekside başlar.` : 'Bankalar mesaiye geçti (~%0,65 dar makas).'} Şimdi acemi gibi ilk saniye paniğine kapılmak yerine sabah stratejini seç:`,
        pathA: {
          label: '10:00 Zili Çalsın, İlk Köpük Geçsin Öyle Bak',
          sub: 'Sabah açılış heyecanına atlamadan sakin kal (Usta sabrı)',
          act: () => {
            const mem = getActiveMember();
            if (mem) {
              mem.storyChoices['morning_' + clk.dateKey] = 'waited_bell';
              mem.stats.calmScore = Math.min(100, (mem.stats.calmScore || 65) + 3);
              mem.activityFeed.unshift({
                ts: Date.now(),
                action: 'Sabah Açılış Sabrı Gösterdi',
                detail: 'Açılış öncesi acele etmeyip 10:00 zilinden sonra tahtaların oturmasını beklemeyi seçti.',
                why: 'Açılış köpüğünden ve erken makastan korundu'
              });
              saveFamilyState(true);
              renderAllExperienceSurfaces();
              window.showToast('Doğru sabah duruşu: İlk dakika gürültüsüne yem olmadın.');
            }
          }
        },
        pathB: {
          label: `09:55 Eşleşmesi İçin ${targetTicker} Mutfağını İncele`,
          sub: 'Zil çalmadan önce şirketin kasasına ve hammaddesine hazırlıklı gir',
          act: () => window.openBistDetailDrawer(targetTicker)
        }
      };
    }

    if (!clk.bankHoursOpen) {
      return {
        id: 'story_afterhours_' + clk.dateKey,
        kicker: `ŞU AN SAAT ${clk.timeStr} · MESAİ DIŞI GERÇEK TÜRKİYE`,
        headline: 'Kepenkler indi, bankalarda makas açıldı; gece panik yapan sabah harçlığını masada bırakır.',
        body: `Şu dakika Borsa İstanbul kapalı ve bankaların döviz/altın alım-satım makası ~%${clk.bankSpreadPct.toFixed(1).replace('.', ',')} açılmış durumda.${topNews ? ` Dışarıda "${topNews.title}" başlığı konuşuluyor.` : ''} Gece ekran başında heyecanlanıp bankadan işlem yapan kişi daha ilk saniyede yüzdelerce lira makas yiyor; sabredip sabah 10:00 zilini bekleyen ise malı dar makasla yerine koyuyor.`,
        pathA: {
          label: 'Sabaha Kadar Kıpırdama, Sakin İzle',
          sub: 'Hiçbir işlem yapmadan durmanın ustalığını seç (Makas yemezsin)',
          act: () => {
            const mem = getActiveMember();
            if (mem) {
              mem.storyChoices['afterhours_' + clk.dateKey] = 'waited_calm';
              mem.stats.calmScore = Math.min(100, (mem.stats.calmScore || 65) + 3);
              mem.activityFeed.unshift({
                ts: Date.now(),
                action: 'Mesai Dışı Sabır Gösterdi',
                detail: `Gece %${clk.bankSpreadPct.toFixed(1).replace('.', ',')} banka makasına girmeyip sabah seansını beklemeyi seçti.`,
                why: 'Gereksiz makas kaybından korundu'
              });
              saveFamilyState(true);
              renderAllExperienceSurfaces();
              window.showToast('Doğru duruş: Gece makasına tek kuruş kaptırmadın.');
            }
          }
        },
        pathB: {
          label: 'Sabah 09:55 İçin Darphane S1 Emri Hazırla',
          sub: 'Kalkan kuracaksan %0 vergili ve dar makaslı borsa açılışını kullan',
          act: () => openQuickRealOrderSheet('inst', 'altin-sertifikasi')
        }
      };
    }

    if (topSmart) {
      const cleanName = window.formatBistCompanyName ? window.formatBistCompanyName(topSmart.name, topSmart.ticker) : topSmart.ticker;
      const disc = Math.abs(Math.round(topSmart.drawdown52WPct || 25));
      return {
        id: 'story_day_' + clk.dateKey,
        kicker: `CANLI SEANS · SAAT ${clk.timeStr} · MAZOTTAN DOMATESE`,
        headline: `Kalabalık %39 mevduat faizine bakarken, kârlı üretim dükkânları zirvesinden %${disc} iskontolu bekliyor.`,
        body: `Bugün yıllık resmi enflasyon %${(Number(m.cpiYoy) || 29.8).toFixed(1).replace('.', ',')}; dünya petrolü son 1 ayda ${oilChg1M >= 0 ? '+' : ''}%${oilChg1M.toFixed(1).replace('.', ',')} hareket etti.${topNews ? ` Gündemde "${topNews.title}" haberi var.` : ''} Örneğin kasası sağlam ${cleanName} (${topSmart.ticker}) zirvesinden %${disc} aşağıda işlem görüyor; öte yandan %0 vergili Hazine Kira Sertifikası yıllık ~%${(Number(sukukInst?.currentPrice) || 36.5).toFixed(1).replace('.', ',')} kira üretiyor. Önünde iki gerçek yol var:`,
        pathA: {
          label: `${topSmart.ticker} Dükkânının Mutfağını ve Hammaddesini Gör`,
          sub: 'Almadan önce ne iş yaptığına, borcuna ve hammaddesine bak',
          act: () => window.openBistDetailDrawer(topSmart.ticker)
        },
        pathB: {
          label: 'Şimdilik Cephaneyi %0 Vergili Kirada Tut',
          sub: `${cleanName} payını sessiz izleme köşesine al, nakdi eritme`,
          act: () => logWatchedOpportunity('bist', topSmart.ticker, 'Seans içi izlemeye alındı')
        }
      };
    }

    return {
      id: 'story_fallback_' + clk.dateKey,
      kicker: `BUGÜNÜN GERÇEK AKIŞI · ${clk.timeStr}`,
      headline: 'Paranın durduğu yerde eridiği dünyada en büyük hata tek bir noktaya saplanmaktır.',
      body: 'Boşta bekleyen nakit her gün erirken, tüm parayı tek bir dedikoduya yatırmak da uykuları kaçırır. Bugün kasandaki dengeyi kontrol et.',
      pathA: {
        label: 'Kasamdaki Kalkanı Kontrol Et',
        sub: 'Boşta eriyen nakit veya tek sepet riski var mı bak',
        act: () => window.switchTab('portfoy')
      },
      pathB: {
        label: 'Dünya Hammadde Zincirlerine Bak',
        sub: 'Petrol, gümüş, buğday ve faizin nereyi vurduğunu gör',
        act: () => window.switchTab('varliklar')
      }
    };
  }

  // İsimsiz Sokak Zekası Bulmacaları (Kağıdın adını göstermeden ne işe yaradığından buldurur!)
  const BLIND_STREET_PUZZLES = [
    {
      id: 'pz_oil_drop',
      situation: 'Dünyada petrol kuyularından bol mal geldi, varil fiyatı %18 ucuzladı; Avrupa’dan Türkiye’ye gelen turist sayısı ise artıyor. İsimlerini boş ver; aşağıdaki üç işten hangisinin kasası önümüzdeki aylarda en çok rahatlar?',
      options: [
        {
          key: 'a',
          desc: 'Her gün yüzlerce uçağı havalandıran, en büyük faturası yakıt olan ve biletini Euro/Dolar ile satan yolcu taşıma işi.',
          isBest: true,
          revealTitle: 'THYAO & PGSUS (Havacılık)',
          lesson: 'Tam isabet! Pazarda mazot ucuzlayınca nakliyecinin yüzü nasıl gülerse, petrol düştüğünde de havayolunun en büyük gideri azalır; Euro bilet geliri kasada kâr olarak kalır.',
          targetKind: 'bist',
          targetId: 'THYAO'
        },
        {
          key: 'b',
          desc: 'Sadece ham petrol fiyatının yükselmesine yatırım yapan enerji fonu.',
          isBest: false,
          revealTitle: 'BNO (Brent Petrol Fonu)',
          lesson: 'Ters rüzgârda kaldın: Petrol ucuzlarken doğrudan petrole bağlı fon değer kaybeder; ucuzlayan mazottan onu yakanlar kazanır.',
          targetKind: 'inst',
          targetId: 'emtia-petrol-bno'
        },
        {
          key: 'c',
          desc: 'Gırtlağına kadar yüksek faizli TL kredi borcuna batmış, ürettiğini sadece içeride veresiye satan küçük fabrika.',
          isBest: false,
          revealTitle: 'Borçlu İç Pazar Şirketleri',
          lesson: 'Yakıt biraz ucuzlasa bile yüksek kredi faizi o fabrikanın tüm kazancını bankaya çalıştırır; borç yükü uykuları kaçırır.',
          targetKind: 'bist',
          targetId: 'ZOREN'
        }
      ]
    },
    {
      id: 'pz_drought_wheat',
      situation: 'Bu yaz kurak geçti, dünyada buğday ve kakao ambarları azaldı; içeride ise kredi faizleri %40’ın üzerinde. Hangi dükkân bu kışı hem sarsılmadan hem kasasını büyüterek çıkarır?',
      options: [
        {
          key: 'a',
          desc: '81 ilde her mahallede ekmeği, yağı, peyniri peşin parayla satan, hiç banka borcu olmayan, topladığı nakdi 60 gün çalıştıran indirim marketi.',
          isBest: true,
          revealTitle: 'BIMAS & MGROS (Nakit Zengini Marketler)',
          lesson: 'Esnaf gözü budur! Erzak pahalandığında herkes lüksü keser ama mutfak alışverişini kesemez. Üstelik peşin satıp toptancıya vadeli ödediği için kasadaki nakitten yüksek faiz döneminde ek gelir yazar.',
          targetKind: 'bist',
          targetId: 'BIMAS'
        },
        {
          key: 'b',
          desc: 'Sadece kredi kartı taksitiyle lüks mobilya ve konut satan, borcu yüksek şirket.',
          isBest: false,
          revealTitle: 'Borçlu Dayanıklı Tüketim / GYO',
          lesson: 'Faiz %40 iken kimse kolay kredi çekip lüks eşya almaz; erzak dolabı daralırken önce keyfi harcamalar durur.',
          targetKind: 'inst',
          targetId: 'gayrimenkul-gyo-fonu-optgy'
        },
        {
          key: 'c',
          desc: 'Parasını hiçbir yere koymayıp vadesiz TL hesabında "güvende" tutan kişi.',
          isBest: false,
          revealTitle: 'Vadesiz Nakit (Sessiz Erime)',
          lesson: 'Rakam aynı kalsa da kuraklık ve zamlarla o paranın doldurduğu poşet sayısı her ay gözünün önünde küçülür.',
          targetKind: 'inst',
          targetId: 'para-piyasasi-fonu'
        }
      ]
    },
    {
      id: 'pz_grid_silver',
      situation: 'Dünyada yapay zeka veri merkezleri ve elektrikli araçlar yüzünden elektrik şebekeleri yetmemeye başladı; her ülke dev trafolar ve güneş santralleri kuruyor. Nereye ortak olursun?',
      options: [
        {
          key: 'a',
          desc: 'Kasasında borcundan fazla nakdi olan, 90 ülkeye yüksek gerilim elektrik trafosu satan ve fiyatı geçen yılki zirvesinden %45 indirimde duran fabrika + güneş panelinin içindeki iletken maden.',
          isBest: true,
          revealTitle: 'ASTOR (Trafo Üreticisi) & Gram Gümüş',
          lesson: 'Harika bakış! Altına hücum varken kazma-kürek satanı buldun: Elektrik olmadan tek bir veri merkezi çalışmaz; güneş paneli de gümüş olmadan üretilmez.',
          targetKind: 'bist',
          targetId: 'ASTOR'
        },
        {
          key: 'b',
          desc: 'Son 1 ayda hiçbir kârı yokken dedikoduyla 3 katına fırlamış, herkesin kahvede konuştuğu kağıt.',
          isBest: false,
          revealTitle: 'Sürü Hücumu (Tepeden Yakalanma)',
          lesson: 'Herkes aynı kapıya hücum ettiğinde ilk girenler çoktan malını kalabalığa devredip çıkmıştır; geriye elde kalan pahalı mal kalır.',
          targetKind: 'inst',
          targetId: 'bist-100'
        },
        {
          key: 'c',
          desc: '32 günlük vadeli mevduata koyup gelen faizin tamamını her ay çatır çatır yemek.',
          isBest: false,
          revealTitle: 'Anapara Kemirme Tuzağı',
          lesson: 'Hem %17,5 vergi verdin hem de enflasyon tamirini kâr sanıp harcadığın için 3 yıl sonra elindeki para kuşa döndü.',
          targetKind: 'inst',
          targetId: 'kira-sertifikasi-sukuk'
        }
      ]
    },
    {
      id: 'pz_rate_turn',
      situation: 'Kış bitmek üzere: Enflasyon yavaşlamaya başladı, 2 yıllık tahvil faizleri aşağı kıvrılıyor ama gazetelerde hâlâ "Konut ve araba satışları çok durgun" yazıyor. Köylünün kıştan önce odun toplaması gibi ne yaparsın?',
      options: [
        {
          key: 'a',
          desc: 'Gazetelerin "her şey düzeldi" demesini beklemeden, tapu değerinin yarı fiyatına inmiş sağlam mülk/ihracat ortaklıklarına ve sabit kuponlu vergisiz tahvile kademeli geçerim.',
          isBest: true,
          revealTitle: '2Y Sabit Tahvil (%0 Vergi) & İskontolu Sağlam Ortaklıklar',
          lesson: 'İleri görüşlülük budur! Faiz düşerken hem elindeki sabit kuponlu tahvil değer kazanır hem de kredi musluğu açıldığında ucuz kalmış mülk ve sanayi şirketleri uyanır.',
          targetKind: 'inst',
          targetId: 'dibs-tahvil'
        },
        {
          key: 'b',
          desc: 'Gazetelerde "Konut satışları patladı!" manşeti çıkana kadar bekler, o gün en tepeden girerim.',
          isBest: false,
          revealTitle: 'Manşet Bekleme Gecikmesi',
          lesson: 'Bahar gelip çiçekler açtığında odun değil, pahalı bahçe satılır; manşeti bekleyen hep en yüksek fiyattan alır.',
          targetKind: 'inst',
          targetId: 'gayrimenkul-gyo-fonu-optgy'
        },
        {
          key: 'c',
          desc: 'Bankadan kredi çekip boyumdan büyük borçla tek bir hisseye girerim.',
          isBest: false,
          revealTitle: 'Kaldıraç ve Borç Uykusuzluğu',
          lesson: 'Dönüş 3 ay gecikse borcun faizi seni ezer ve tam bahar gelmeden elindekini zararına sattırır.',
          targetKind: 'inst',
          targetId: 'para-piyasasi-fonu'
        }
      ]
    },
    {
      id: 'pz_strait_jam',
      situation: 'Her şey güllük gülistanlık giderken boğazda tankerler sıkıştı; petrol ve navlun bir gecede %14 fırladı, akşam saat 22:30’da televizyonlar son dakika geçiyor. Kim gemisini batırmadan çıkarır?',
      options: [
        {
          key: 'a',
          desc: 'Önceden kalkanını (Darphane S1 / Altın / Sukuk) kurmuş olan; gece 22:30’da %3,6 banka makasına yem olmayıp sabah 10:00 seansında ham petrolü işleyen rafinerinin kasasına sakin kafayla bakan.',
          isBest: true,
          revealTitle: 'TUPRS (Rafineri) & Darphane Altın S1 (%0 Vergi)',
          lesson: 'Soğukkanlı kaptan! Gece banka ekranından panik alımı yapan makasa soyulur; fırtına çıkmadan kalkanı olan ise sabah gerçek piyasada kimin işine yaradığına bakar.',
          targetKind: 'bist',
          targetId: 'TUPRS'
        },
        {
          key: 'b',
          desc: 'Gece 22:35’te korkuyla banka uygulamasını açıp kasasındaki her şeyi satarak açık makastan döviz ve altın alan.',
          isBest: false,
          revealTitle: 'Gece Panik Makası (-%3,6 Anında Kayıp)',
          lesson: 'Daha ilk dakikada hem elindeki ucuz malı kaptırdın hem de mesai dışı banka makasına binlerce lira bıraktın.',
          targetKind: 'inst',
          targetId: 'gram-altin-spot'
        },
        {
          key: 'c',
          desc: 'En büyük gideri yakıt olan ve döviz borcu yüksek bir taşımacılık şirketine tüm parasıyla tek kalemde atlayan.',
          isBest: false,
          revealTitle: 'Yakıt Şokuna Ters Yakalanma',
          lesson: 'Petrol fırladığında yakıt yakan işin maliyeti şişer; tüm yumurtaları tek sepete koymak iç cız ettirir.',
          targetKind: 'inst',
          targetId: 'emtia-petrol-bno'
        }
      ]
    },
    {
      id: 'pz_cheap_rotten_trap',
      situation: 'Pazarda iki kasa elma var: Biri geçen yıla göre yarı fiyatına düşmüş ama içi çürük; diğeri makul fiyatta ve kütür kütür. İki şirket de zirvesinden %45 düşmüş; hangisi sağlam mal, hangisi elde çürüyecek tuzak?',
      options: [
        {
          key: 'a',
          desc: 'Zirvesinden %45 düşmesine rağmen her gün kasasına sıcak nakit giren, tüm banka borcundan daha fazla nakdi bulunan ve kârıyla kendini 8 yılda amorti eden üretim dükkânı.',
          isBest: true,
          revealTitle: 'Kasası Nakit Dolu Sağlam Üretici',
          lesson: 'Kaliteli mal geçici olarak ucuzladığında fırsattır! Kâr eden ve borcu olmayan dükkân fırtına dinince değerini bulur.',
          targetKind: 'bist',
          targetId: 'MAVI'
        },
        {
          key: 'b',
          desc: 'Fiyatı 50 liradan 12 liraya indi diye "bedava oldu" sanılan ama son 1 yıldır zarar yazan ve faaliyet kârının 7 katı kredi borcu taşıyan şirket.',
          isBest: false,
          revealTitle: 'Ucuzluk Tuzağı (Elde Çürüyen Mal)',
          lesson: 'Sırf fiyatı düştü diye zarar eden borçlu şirketi almak, pazardan çürük meyve almaya benzer; ucuz görünen mal elinde erir.',
          targetKind: 'bist',
          targetId: 'SASA'
        },
        {
          key: 'c',
          desc: 'Sosyal medyada "tahtacısı götürecek" diye fısıldanan, yıllık kârının 95 katından satılan küçük şirket.',
          isBest: false,
          revealTitle: 'VBTS Brüt Takas & Dedikodu Çukuru',
          lesson: 'Dedikoduyla şişen kağıtta devre kesici ve brüt takas yediğinde satacak alıcı bile bulamazsın.',
          targetKind: 'inst',
          targetId: 'fon-yerli-bist30-apx30'
        }
      ]
    },
    {
      id: 'pz_euro_workshop',
      situation: 'Avrupa’da faizler indi ve siparişler canlandı; içeride Euro/TL kuru yukarı hareketlenirken Türkiye’deki işçilik gideri TL cinsinden ödeniyor. Hangi fabrikanın bacası mutfağa bereket taşır?',
      options: [
        {
          key: 'a',
          desc: 'Bursa ve Kocaeli’de üretim yapıp ürettiği ticari aracın %78’ini Avrupa’ya Euro faturayla satan ve yılda iki kez ortaklarına nakit kâr payı (temettü) dağıtan dev atölye.',
          isBest: true,
          revealTitle: 'FROTO (Euro İhracatçısı & Temettü Çarkı)',
          lesson: 'Mutfak hesabı çok net: Masrafının bir kısmı TL, kasaya giren faturanın dörtte üçü Euro! Avrupa canlandığında hem ihracat hem temettü büyür.',
          targetKind: 'bist',
          targetId: 'FROTO'
        },
        {
          key: 'b',
          desc: 'Hammaddesini dışarıdan Euro/Dolar ile ithal edip içeride sadece TL ile veresiye mal satan borçlu işletme.',
          isBest: false,
          revealTitle: 'Kur Makasında Sıkışan İthalatçı',
          lesson: 'Dövizle mal alıp içeride TL ile satmak kur yükseldiğinde maliyeti patlatır, kâr marjını eritir.',
          targetKind: 'inst',
          targetId: 'doviz-eur'
        },
        {
          key: 'c',
          desc: 'Üst üste iki kere kazandı diye gaza gelip kredili işlemle boyundan büyük yük altına giren sabırsız oyuncu.',
          isBest: false,
          revealTitle: 'Sahte Özgüven Tokadı',
          lesson: 'Kazanmanın verdiği sahte özgüven insanın en tehlikeli anıdır; piyasa ufak bir silkelendiğinde kredili pozisyon uykuları kaçırır.',
          targetKind: 'inst',
          targetId: 'bist-temettu-25'
        }
      ]
    }
  ];

  function getAllBlindPuzzles() {
    const list = BLIND_STREET_PUZZLES.slice();
    const lookup = window.marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup || {};
    const all = Object.values(lookup).filter(x => x && x.ticker && x.close > 0);
    if (all.length > 50) {
      const strong = all.find(s => s.isNetCash && (Number(s.netIncomeMillionTL) || 0) > 500 && (Number(s.drawdown52WPct) || 0) <= -22 && (Number(s.pe) || 99) >= 3 && (Number(s.pe) || 99) <= 12);
      const weak = all.find(s => (Number(s.netIncomeMillionTL) || 0) < -300 && (Number(s.netDebtToEbitda) || 0) > 4.5);
      const hot = all.find(s => (Number(s.perf1M) || 0) >= 24 && (Number(s.pe) || 0) > 40);
      if (strong && weak && hot) {
        const strongDisc = Math.abs(Math.round(strong.drawdown52WPct));
        const strongClean = window.formatBistCompanyName ? window.formatBistCompanyName(strong.name, strong.ticker) : strong.ticker;
        const weakClean = window.formatBistCompanyName ? window.formatBistCompanyName(weak.name, weak.ticker) : weak.ticker;
        const hotClean = window.formatBistCompanyName ? window.formatBistCompanyName(hot.name, hot.ticker) : hot.ticker;
        list.push({
          id: 'pz_live_bist_today',
          situation: 'CANLI BIST TABLOSUNDAN GERÇEK SINAV: Şu an borsada işlem gören üç gerçek şirketin adını gizledik. Bilanço ve fiyat verileri bugünün canlı verisi; hangisine ortak olursun?',
          options: [
            {
              key: 'a',
              desc: `İş kolu: ${window.getSectorTr ? window.getSectorTr(strong) : strong.sector}. Zirvesinden %${strongDisc} indirimde, tüm borcundan fazla nakdi var ve yıllık kârıyla kendini ${strong.pe} yılda amorti ediyor.`,
              isBest: true,
              revealTitle: `${strong.ticker} · ${strongClean}`,
              lesson: `Canlı bilançoyu okudun! ${strong.ticker} şu an hem kasası net nakit dolu hem de ${strong.pe} yıllık kâr çarpanıyla iskontolu bekliyor.`,
              targetKind: 'bist',
              targetId: strong.ticker
            },
            {
              key: 'b',
              desc: `İş kolu: ${window.getSectorTr ? window.getSectorTr(weak) : weak.sector}. Son 12 ayda zarar açıklamış ve net borcu yıllık faaliyet kârının ${weak.netDebtToEbitda} katına çıkmış.`,
              isBest: false,
              revealTitle: `${weak.ticker} · ${weakClean}`,
              lesson: `Bilanço uyarısı: ${weak.ticker} şu an hem zarar yazıyor hem de yüksek borç yükü taşıyor; yüksek faiz ortamında kârı bankaya gider.`,
              targetKind: 'bist',
              targetId: weak.ticker
            },
            {
              key: 'c',
              desc: `İş kolu: ${window.getSectorTr ? window.getSectorTr(hot) : hot.sector}. Sadece son 1 ayda +%${Math.round(hot.perf1M)} fırlamış ve kârıyla kendini ${hot.pe} yılda ancak amorti ediyor.`,
              isBest: false,
              revealTitle: `${hot.ticker} · ${hotClean}`,
              lesson: `Fiyat çoktan ısınmış: ${hot.ticker} son 1 ayda sert koştuğu için amorti süresi ${hot.pe} yıla uzamış; kalabalığın peşinden koşmak yerine soğumasını izlemek ustalıktır.`,
              targetKind: 'bist',
              targetId: hot.ticker
            }
          ]
        });
      }
    }
    return list;
  }

  /* ==========================================================================
     7. KAPTANLIK, ŞANS VS USTALIK VE OLGUNLAŞMA (SİSİN DAĞILMASI) HESAPLAYICISI
     ========================================================================== */
  function evaluateMemberCaptaincy(member) {
    if (!member) member = getActiveMember();
    if (!member) return null;
    settleRealTimeMemberWallet(member, Date.now());
    const usdTry = Number(window.marketData?.macro?.usdTry) || 50.4;
    const evals = (member.holdings || []).map(window.resolveHoldingLiveState);
    const holdingsValTL = evals.reduce((s, r) => s + r.valueTL, 0);
    const holdingsCostTL = evals.reduce((s, r) => s + r.costTL, 0);
    const freeCashTL = Number(member.wallet?.freeCashTL) || 0;
    const t2CashTL = (member.wallet?.t2PendingSettlements || []).reduce((s, x) => s + (Number(x.amountTL) || 0), 0);
    const pendingOrdTL = (member.wallet?.pendingOrders || []).reduce((s, x) => s + (Number(x.amountTL) || 0), 0);

    const totalNetWorthTL = holdingsValTL + freeCashTL + t2CashTL + pendingOrdTL;
    const totalBaseCostTL = holdingsCostTL + freeCashTL + t2CashTL + pendingOrdTL;
    const pnlTL = holdingsValTL - holdingsCostTL;
    const pnlPct = holdingsCostTL > 0 ? (pnlTL / holdingsCostTL) * 100 : 0;
    const dayTL = evals.reduce((s, r) => s + r.dayChgTL, 0);

    // En yüksek tek varlık ağırlığı (Tek sepet riski!)
    let maxSingleSharePct = 0;
    for (const r of evals) {
      const sh = totalNetWorthTL > 0 ? (r.valueTL / totalNetWorthTL) * 100 : 0;
      if (sh > maxSingleSharePct) maxSingleSharePct = sh;
    }

    const distinctGroups = new Set(evals.map(r => r.group));
    if (freeCashTL > totalNetWorthTL * 0.05) distinctGroups.add('Serbest Nakit');

    const zeroTaxVal = evals.filter(r => r.h.kind === 'bist' || (r.inst && window.getAssetTaxBadge(r.inst).isZeroTax)).reduce((s, r) => s + r.valueTL, 0);
    const zeroTaxPct = holdingsValTL > 0 ? (zeroTaxVal / holdingsValTL) * 100 : 0;

    // Kaptanlık & Şans vs Ustalık Teşhisi
    let verdictBadge = 'Dengeli Kaptan';
    let verdictTone = 'pos';
    let verdictReason = 'Yumurtaları farklı sepetlere bölmüş, vergi kaçağını azaltmış ve fırtınaya dayanıklı gidiyor.';

    if (maxSingleSharePct >= 62) {
      verdictBadge = pnlPct >= 0 ? 'Şansla Önde (Tek Sepet Riski!)' : 'Tek Sepet Sarsıntısı';
      verdictTone = pnlPct >= 0 ? 'warn' : 'neg';
      verdictReason = `Kasasının %${Math.round(maxSingleSharePct)} kadarı tek bir yerde toplanmış! Bugün kârda görünse bile ters bir haberde gemi su alabilir.`;
    } else if ((member.stats?.afterHoursSpreadHits || 0) >= 2 || (member.wallet?.frictionLeakTL || 0) > totalNetWorthTL * 0.012) {
      verdictBadge = 'Aceleci · Makasa Para Kaptırıyor';
      verdictTone = 'warn';
      verdictReason = `Mesai dışı makaslara ve sık al-sata toplam ${window.fmtTL(member.wallet?.frictionLeakTL || 0, 0)} kaptırdı; biraz yavaşlasa çok daha huzurlu büyüyecek.`;
    } else if (freeCashTL > totalNetWorthTL * 0.65) {
      verdictBadge = 'Kenarda Bekliyor (Nakit Eriyor)';
      verdictTone = 'warn';
      verdictReason = `Parasının %${Math.round((freeCashTL / Math.max(1, totalNetWorthTL)) * 100)} kadarı vadesiz boşta duruyor ve enflasyona eriyor.`;
    } else if (distinctGroups.size >= 3 && zeroTaxPct >= 50) {
      verdictBadge = 'Sağlam Kaptan (Okuyarak Büyüyor)';
      verdictTone = 'pos';
      verdictReason = `${distinctGroups.size} farklı kalkanla ilerliyor, varlıklarının %${Math.round(zeroTaxPct)}’i %0 vergili ve fırtınada gemisi dengede.`;
    }

    // Fırtına Dayanıklılık Puanı (Kimin çok kazandığı değil, kimin gemiyi batırmadan limana yanaştırabildiği!)
    const spreadPenalty = Math.min(25, (member.stats?.afterHoursSpreadHits || 0) * 8);
    const singleBetPenalty = maxSingleSharePct > 50 ? Math.round((maxSingleSharePct - 50) * 0.7) : 0;
    const idlePenalty = freeCashTL > totalNetWorthTL * 0.4 ? 15 : 0;
    const diversityBonus = Math.min(25, distinctGroups.size * 7);
    const puzzleBonus = Math.min(16, Object.keys(member.blindSolvedIds || {}).length * 4);
    const captainScore = Math.max(12, Math.min(99, Math.round(52 + diversityBonus + puzzleBonus - spreadPenalty - singleBetPenalty - idlePenalty)));

    // 7 Gerçek Dünya Hazırlık Kanıtı
    const proofs = [
      { ok: freeCashTL < totalNetWorthTL * 0.35, label: 'Parayı boşta eritmeme alışkanlığı kazandın' },
      { ok: zeroTaxPct >= 45, label: 'Boş yere %17,5 vergi vermek yerine %0 vergili araçları kurdun' },
      { ok: distinctGroups.size >= 3 && maxSingleSharePct < 55, label: 'Tüm yumurtaları tek sepete koymamayı öğrendin' },
      { ok: Object.keys(member.blindSolvedIds || {}).length >= 2, label: 'İsimlere bakmadan mazottan domatesi (hammadde izini) çözdün' },
      { ok: (member.stats?.afterHoursSpreadHits || 0) === 0, label: 'Mesai dışı banka makasına yem olmadan doğru saatte işlem yaptın' },
      { ok: (member.wallet?.watchedPassList || []).length >= 1 || Object.keys(member.storyChoices || {}).length >= 1, label: 'Hemen atlamak yerine sabırla izlemeyi deneyimledin' },
      { ok: (member.stats?.panicSells || 0) === 0 && totalNetWorthTL >= 100000, label: 'Sarsıntıda panikle zararına mal kaptırmadın' }
    ];
    const passedCount = proofs.filter(x => x.ok).length;

    // Nefes Alanı / Özgür Zaman Karşılığı (Aylık 55.000 ₺ sade yaşam hesabıyla kaç aylık nefes alanı?)
    const monthlyLifeTL = 55000;
    const breathingMonths = +(totalNetWorthTL / monthlyLifeTL).toFixed(1);
    const sustainableYearlyMonths = +(((totalNetWorthTL * 0.065) / monthlyLifeTL)).toFixed(1);

    return {
      member,
      evals,
      holdingsValTL,
      holdingsCostTL,
      freeCashTL,
      t2CashTL,
      pendingOrdTL,
      totalNetWorthTL,
      totalNetWorthUSD: usdTry > 0 ? totalNetWorthTL / usdTry : 0,
      pnlTL,
      pnlPct,
      dayTL,
      maxSingleSharePct,
      distinctGroupsCount: distinctGroups.size,
      zeroTaxPct,
      verdictBadge,
      verdictTone,
      verdictReason,
      captainScore,
      proofs,
      passedCount,
      breathingMonths,
      sustainableYearlyMonths
    };
  }

  /* ==========================================================================
     8. HIZLI GERÇEK EMİR & AİLE KASA RÖNTGENİ ÇEKMECELERİ
     ========================================================================== */
  function openQuickRealOrderSheet(kind, idOrTicker) {
    const member = getActiveMember();
    if (!member || !window.marketData) return;
    const clk = getIstanbulMarketClock();
    const lookup = window.marketData.kitchenIntelSummary?.openHorizon?.bistStockLookup || {};
    let title = idOrTicker;
    let priceTxt = '';
    if (kind === 'bist') {
      const st = lookup[idOrTicker];
      if (!st) return;
      title = `${idOrTicker} · ${window.formatBistCompanyName ? window.formatBistCompanyName(st.name, idOrTicker) : idOrTicker}`;
      priceTxt = `${window.fmtNum(st.close, 2)} ₺`;
    } else {
      const inst = window.instById?.get(idOrTicker);
      if (!inst) return;
      title = window.getAssetMeta ? window.getAssetMeta(inst).title : inst.name;
      priceTxt = window.fmtAssetPrice(inst.currentPrice, inst.unitLabel, inst.isUsdAsset, inst.isRateInstrument);
    }

    const eco = getEntity360Chain(kind, idOrTicker);
    const freeCash = Math.round(member.wallet?.freeCashTL || 0);
    const presets = [10000, 25000, 50000, 100000].filter(v => v <= Math.max(50000, freeCash));

    window.openSheetWithHtml(`
      <div class="sheet-head">
        <div>
          <h3 style="font-size:16.5px;font-weight:800;color:#fff;">Gerçek Kurallarla Kasaya Ekle</h3>
          <p class="dim" style="font-size:12px;margin-top:2px;">${window.escapeHtml(title)} · Güncel: <strong>${window.escapeHtml(priceTxt)}</strong></p>
        </div>
        <button class="icon-btn" onclick="closeSheet()"><svg class="ico" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>

      <div class="stat-box" style="margin-bottom:12px;border-color:rgba(245,158,11,0.28);background:rgba(245,158,11,0.07);font-size:12px;line-height:1.45;">
        <div style="font-weight:700;color:#fbbf24;margin-bottom:3px;">Şu Anki Saat (${clk.timeStr}) İtibarıyla İşleyecek Kural:</div>
        <div style="color:#e2e8f0;">${window.escapeHtml(eco.ruleLine)}</div>
      </div>

      <div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;">
          <span class="muted">Ne Kadarlık Alacaksın? (₺)</span>
          <span class="num-tab">Serbest Nakdin: <strong class="pos">${window.fmtTL(freeCash, 0)}</strong></span>
        </div>
        <input type="number" id="realOrdAmtInp" class="inp mono" value="${Math.min(freeCash > 1000 ? freeCash : 25000, 50000)}" min="500" step="5000" />
        <div class="chip-rail" style="margin-top:6px;">
          ${presets.map(v => `<button class="chip" style="height:28px;font-size:11.5px;" onclick="document.getElementById('realOrdAmtInp').value=${v}">${window.fmtCompactTL(v)}</button>`).join('')}
          ${freeCash >= 1000 ? `<button class="chip" style="height:28px;font-size:11.5px;" onclick="document.getElementById('realOrdAmtInp').value=${freeCash}">Tüm Serbest Nakit</button>` : ''}
        </div>
      </div>

      <div style="margin-bottom:14px;">
        <label style="display:block;font-size:12px;color:var(--text-secondary);margin-bottom:5px;">Akşam Çayında Ailene Ne Diyeceksin? (Karar Nedenin)</label>
        <select id="realOrdWhySel" class="sel">
          <option value="Hammaddesi ve iş kolu lehine dönüyor">Hammaddesi ve iş kolu lehine dönüyor</option>
          <option value="Kalabalık bakmazken fiyatı ucuzlamış">Kalabalık bakmazken fiyatı ucuzlamış</option>
          <option value="Enflasyon ve kur kalkanı için ekledim">Enflasyon ve kur kalkanı için ekledim</option>
          <option value="Vergisiz (%0 stopaj) cephane olarak park ettim">Vergisiz (%0 stopaj) cephane olarak park ettim</option>
          <option value="Dışarıda duyduğum habere güvendim">Dışarıda duyduğum habere güvendim</option>
        </select>
      </div>

      <button class="btn-emerald" style="width:100%;height:42px;font-size:13.5px;" onclick="window.AetherExp.submitQuickBuy('${kind}','${window.escapeHtml(idOrTicker)}')">
        Emri Gerçek Piyasa Kuralıyla Gönder
      </button>
    `);
  }

  function submitQuickBuy(kind, idOrTicker) {
    const amt = parseFloat(document.getElementById('realOrdAmtInp')?.value || '0') || 0;
    const why = document.getElementById('realOrdWhySel')?.value || '';
    executeRealTurkishOrder({ side: 'buy', kind, targetId: idOrTicker, amountTL: amt, whyReason: why });
  }

  function openFamilyMemberXraySheet(memberId) {
    const m = familyState.members.find(x => x.id === memberId);
    if (!m) return;
    const cap = evaluateMemberCaptaincy(m);
    const esc = window.escapeHtml;

    window.openSheetWithHtml(`
      <div class="sheet-head">
        <div>
          <div style="display:flex;align-items:center;gap:8px;">
            <h3 style="font-size:17px;font-weight:800;color:#fff;">${esc(m.name)} — Açık Kasa &amp; Hamleler</h3>
            <span class="chg-pill ${cap.verdictTone}">${esc(cap.verdictBadge)}</span>
          </div>
          <p class="dim" style="font-size:12px;margin-top:3px;">${esc(cap.verdictReason)}</p>
        </div>
        <button class="icon-btn" onclick="closeSheet()"><svg class="ico" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:12px;">
        <div class="stat-box" style="padding:10px;">
          <div class="dim" style="font-size:10.5px;">Toplam Varlığı</div>
          <div class="num-tab" style="font-size:15px;font-weight:800;color:#fff;margin-top:2px;">${window.fmtTL(cap.totalNetWorthTL, 0)}</div>
          <div class="dim num-tab" style="font-size:10.5px;">${cap.breathingMonths} aylık nefes alanı</div>
        </div>
        <div class="stat-box" style="padding:10px;">
          <div class="dim" style="font-size:10.5px;">Açık Kâr / Zarar</div>
          <div class="num-tab ${window.pctCls(cap.pnlTL)}" style="font-size:15px;font-weight:800;margin-top:2px;">${cap.pnlTL >= 0 ? '+' : ''}${window.fmtCompactTL(cap.pnlTL)}</div>
          <div class="num-tab ${window.pctCls(cap.pnlPct)}" style="font-size:10.5px;">${window.fmtPct(cap.pnlPct, 2)}</div>
        </div>
        <div class="stat-box" style="padding:10px;">
          <div class="dim" style="font-size:10.5px;">Serbest / Takas Nakit</div>
          <div class="num-tab" style="font-size:14px;font-weight:800;color:#fff;margin-top:2px;">${window.fmtCompactTL(cap.freeCashTL)}</div>
          <div class="dim num-tab" style="font-size:10px;">${cap.t2CashTL > 0 ? `T+2: ${window.fmtCompactTL(cap.t2CashTL)}` : 'Takas blokajı yok'}</div>
        </div>
      </div>

      <div style="font-size:12px;font-weight:700;color:#fff;margin-bottom:6px;">Kasasında Neler Taşıyor?</div>
      <div class="surface" style="background:var(--bg-input);box-shadow:none;margin-bottom:12px;">
        ${cap.evals.length ? cap.evals.map(r => `
          <div class="list-row" style="grid-template-columns:minmax(0,1fr) auto;padding:9px 12px;">
            <div class="row-main">
              <div class="avatar tone-${r.tone}" style="width:34px;height:34px;font-size:10px;">${esc(r.code)}</div>
              <div class="row-titles">
                <div class="row-name" style="font-size:13px;">${esc(r.displayName)}</div>
                <div class="row-sub num-tab">${esc(r.qtyDisplay)} · Alış: ${esc(r.unitCostDisplay)}</div>
              </div>
            </div>
            <div class="r-right num-tab">
              <div style="font-size:13px;font-weight:700;color:#fff;">${window.fmtTL(r.valueTL, 0)}</div>
              <div class="${window.pctCls(r.pnlTL)}" style="font-size:11px;">${r.pnlTL >= 0 ? '+' : ''}${window.fmtCompactTL(r.pnlTL)} (${window.fmtPct(r.pnlPct, 1)})</div>
            </div>
          </div>
        `).join('') : `<div style="padding:14px;font-size:12px;color:var(--text-muted);">Henüz varlık eklenmemiş, nakitte bekliyor.</div>`}
      </div>

      <div style="font-size:12px;font-weight:700;color:#fff;margin-bottom:6px;">Son Kararları ve Gerekçeleri</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px;">
        ${(m.activityFeed || []).slice(0, 4).map(a => `
          <div class="stat-box" style="padding:9px 11px;font-size:12px;">
            <div style="display:flex;justify-content:space-between;gap:8px;">
              <strong style="color:#fff;">${esc(a.action)}</strong>
              <span class="dim num-tab" style="font-size:10.5px;">${formatTrShortDateTime(a.ts)}</span>
            </div>
            <div class="muted" style="margin-top:2px;">${esc(a.detail)}</div>
            ${a.why ? `<div style="margin-top:3px;font-size:11px;color:var(--accent-bright);">Neden: "${esc(a.why)}"</div>` : ''}
          </div>
        `).join('')}
      </div>

      <div style="display:flex;gap:8px;">
        ${m.id !== activeMemberId ? `
          <button class="btn-primary" style="flex:1;height:40px;" onclick="window.AetherExp.switchActiveMember('${esc(m.id)}');closeSheet();">Bu Kişi Olarak Devam Et</button>
        ` : `
          <button class="btn-primary" style="flex:1;height:40px;" onclick="closeSheet();switchTab('portfoy');">Kasamı Düzenle</button>
        `}
      </div>
    `);
  }

  function openMemberSwitcherSheet() {
    const esc = window.escapeHtml;
    window.openSheetWithHtml(`
      <div class="sheet-head">
        <div>
          <h3 style="font-size:16.5px;font-weight:800;color:#fff;">Ailede Kim Kullanıyor?</h3>
          <p class="dim" style="font-size:12px;margin-top:2px;">Kendi adına geçerek kendi kasanı ve kararlarını yönet veya yeni aile üyesi ekle</p>
        </div>
        <button class="icon-btn" onclick="closeSheet()"><svg class="ico" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>

      <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:14px;">
        ${familyState.members.filter(m => familyState.showArchetypes || !m.isArchetype).map(m => {
          const cap = evaluateMemberCaptaincy(m);
          const isCur = m.id === activeMemberId;
          return `
            <div onclick="window.AetherExp.switchActiveMember('${esc(m.id)}');closeSheet();" style="cursor:pointer;padding:10px 12px;border-radius:12px;border:1px solid ${isCur ? 'rgba(59,130,246,0.6)' : 'var(--border-hairline)'};background:${isCur ? 'rgba(59,130,246,0.12)' : 'var(--bg-input)'};display:flex;justify-content:space-between;align-items:center;gap:10px;">
              <div>
                <div style="font-size:13.5px;font-weight:700;color:#fff;">${esc(m.name)} ${isCur ? '<span class="chg-pill info" style="font-size:10px;margin-left:4px;">Aktif</span>' : ''}</div>
                <div class="dim num-tab" style="font-size:11px;margin-top:2px;">Toplam: ${window.fmtTL(cap.totalNetWorthTL, 0)} · Kâr: <span class="${window.pctCls(cap.pnlTL)}">${cap.pnlTL >= 0 ? '+' : ''}${window.fmtCompactTL(cap.pnlTL)}</span></div>
              </div>
              <span class="chg-pill ${cap.verdictTone}" style="font-size:10.5px;">${cap.passedCount}/7 Kanıt</span>
            </div>
          `;
        }).join('')}
      </div>

      <div class="stat-box" style="margin-bottom:12px;">
        <div style="font-size:12px;font-weight:700;color:#fff;margin-bottom:8px;">+ Yeni Aile Üyesi Ekle</div>
        <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:8px;margin-bottom:8px;">
          <input type="text" id="newFamNameInp" class="inp" placeholder="İsim (Örn: Babam, Eşim, Ali)" />
          <input type="number" id="newFamCashInp" class="inp mono" value="500000" min="10000" step="50000" placeholder="Başlangıç Nakdi (₺)" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
          <select id="newFamSalaryDay" class="sel">
            <option value="1">Maaş Günü: Her Ayın 1’i</option>
            <option value="15">Maaş Günü: Her Ayın 15’i</option>
          </select>
          <input type="number" id="newFamMonthlySave" class="inp mono" value="25000" min="0" step="5000" placeholder="Aylık Ek Birikim (₺)" />
        </div>
        <button class="btn-emerald" style="width:100%;height:38px;" onclick="window.AetherExp.createNewFamilyMember()">Aileye Ekle ve Başlat</button>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
        <button class="btn-secondary" style="font-size:11.5px;" onclick="window.AetherExp.toggleArchetypes()">
          ${familyState.showArchetypes ? 'Örnek Profilleri Gizle' : 'Örnek Profilleri Göster'}
        </button>
        <button class="btn-primary" style="font-size:12px;" onclick="window.AetherExp.shareFamilyToWhatsApp()">
          Aile WhatsApp Linkini Paylaş
        </button>
      </div>
    `);
  }

  function createNewFamilyMember() {
    const name = String(document.getElementById('newFamNameInp')?.value || '').trim();
    const cash = Math.max(5000, parseFloat(document.getElementById('newFamCashInp')?.value || '500000') || 500000);
    const salDay = parseInt(document.getElementById('newFamSalaryDay')?.value || '1', 10) || 1;
    const mSave = Math.max(0, parseFloat(document.getElementById('newFamMonthlySave')?.value || '25000') || 0);
    if (!name) {
      window.showToast('Lütfen aile üyesinin adını yazın');
      return;
    }
    const id = 'fam_' + Date.now().toString(36);
    const nm = createDefaultMember(id, name.slice(0, 28), 'Aile Üyesi', cash, salDay, mSave, []);
    nm.activityFeed.push({
      ts: Date.now(),
      action: 'Aile Meydanına Katıldı',
      detail: `${window.fmtTL(cash, 0)} başlangıç nakdi ve her ayın ${salDay}’inde +${window.fmtTL(mSave, 0)} düzenli birikim planıyla başladı.`,
      why: 'Sıfırdan kendi yolculuğu'
    });
    familyState.members.push(nm);
    activeMemberId = id;
    syncActiveMemberWithGlobalKasam(false);
    saveFamilyState(true);
    window.closeSheet();
    renderAllExperienceSurfaces();
    window.showToast(`${name} eklendi ve aktif edildi`);
  }

  function switchActiveMember(id) {
    if (!familyState.members.some(x => x.id === id)) return;
    activeMemberId = id;
    syncActiveMemberWithGlobalKasam(false);
    saveFamilyState(false);
    renderAllExperienceSurfaces();
    if (window.renderActiveView) window.renderActiveView();
    const m = getActiveMember();
    if (m && window.showToast) window.showToast(`Aktif kişi: ${m.name}`);
  }

  function toggleArchetypes() {
    familyState.showArchetypes = !familyState.showArchetypes;
    saveFamilyState(false);
    openMemberSwitcherSheet();
    renderAllExperienceSurfaces();
  }

  async function shareFamilyToWhatsApp() {
    const url = exportFamilyShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AETHER Aile Kasa & Hamle Tablosu',
          text: 'Aile içi güncel kasa, kâr/zarar ve son hamlelerimizi görmek için dokun:',
          url
        });
        return;
      } catch (_) {}
    }
    try {
      await navigator.clipboard.writeText(url);
      window.showToast('Aile eşitleme bağlantısı kopyalandı; WhatsApp grubuna yapıştırabilirsin');
    } catch (_) {
      prompt('Bu bağlantıyı kopyalayıp aile grubuna gönder:', url);
    }
  }

  /* ==========================================================================
     9. ANA DENEYİM EKRANLARI: MEYDAN (SABAH HİKÂYESİ, SEANS SAATİ, İSİMSİZ DÜKKÂN,
        CANLI KAP/RESMİ GAZETE) & AİLE ÇAY MASASI & KİŞİSEL İZ AYNASI
     ========================================================================== */
  let activePuzzleIdx = 0;
  let revealedPuzzleChoice = null;
  let meydanSubMode = 'today'; // 'today' | 'chains' | 'family' | 'mirror'
  let mirrorDebtSimBorrowed = false;
  let fogPreviewUnlocked = false;

  function selectBlindPuzzleChoice(choiceKey) {
    const allPz = getAllBlindPuzzles();
    const pz = allPz[activePuzzleIdx % allPz.length];
    if (!pz) return;
    revealedPuzzleChoice = choiceKey;
    const chosenOpt = pz.options.find(o => o.key === choiceKey);
    const member = getActiveMember();
    if (member && chosenOpt) {
      if (chosenOpt.isBest) {
        member.blindSolvedIds[pz.id] = true;
        member.stats.smartRawReads = (member.stats.smartRawReads || 0) + 1;
      }
      member.activityFeed.unshift({
        ts: Date.now(),
        action: chosenOpt.isBest ? 'Hammadde Bağlantısını Çözdü' : 'İsimsiz Dükkân Denemesi',
        detail: `${chosenOpt.revealTitle}: ${chosenOpt.lesson.slice(0, 110)}…`,
        why: 'Sokak zekası antrenmanı'
      });
      saveFamilyState(true);
    }
    renderMeydanView();
  }

  function nextBlindPuzzle() {
    const allPz = getAllBlindPuzzles();
    activePuzzleIdx = (activePuzzleIdx + 1) % allPz.length;
    revealedPuzzleChoice = null;
    renderMeydanView();
  }

  function renderHeaderMemberBadge() {
    const btn = document.getElementById('headerMemberBtn');
    const m = getActiveMember();
    if (!btn || !m) return;
    const cap = evaluateMemberCaptaincy(m);
    btn.innerHTML = `
      <span style="width:7px;height:7px;border-radius:50%;background:#34d399;display:inline-block;"></span>
      <span>${window.escapeHtml(m.name)}</span>
      <span class="dim num-tab" style="font-size:10.5px;">${cap.passedCount}/7</span>
    `;
  }

  function setMeydanSubMode(mode) {
    meydanSubMode = mode;
    document.querySelectorAll('#meydanSubNav .seg-item').forEach(b => {
      b.classList.toggle('active', b.dataset.msub === mode);
    });
    renderMeydanView();
  }

  function renderMeydanView() {
    const mount = document.getElementById('meydanRootMount');
    if (!mount || !window.marketData) return;

    const clk = getIstanbulMarketClock();
    const activeMem = getActiveMember();
    const myCap = evaluateMemberCaptaincy(activeMem);
    const esc = window.escapeHtml;

    if (meydanSubMode === 'chains') {
      renderWorldChainsInto(mount, clk);
      return;
    }
    if (meydanSubMode === 'family') {
      renderFamilyTeaTableInto(mount, clk, myCap);
      return;
    }
    if (meydanSubMode === 'mirror') {
      renderPersonalMirrorInto(mount, clk, myCap);
      return;
    }
    if (window.AetherWorld && typeof window.AetherWorld.renderLivingHomeInto === 'function') {
      window.AetherWorld.renderLivingHomeInto(mount, clk, myCap);
      return;
    }

    const story = buildTodayMorningStory();
    const allPz = getAllBlindPuzzles();
    const pz = allPz[activePuzzleIdx % allPz.length];
    const feed = window.marketData.liveRealWorldFeed || [];
    const ekmekLost = Math.max(0, (activeMem.wallet?.idleCashErosionTL || 0) / 15); // 15 ₺ ekmek hesabı

    mount.innerHTML = `
      <!-- 1. GERÇEK İSTANBUL SAATİ VE CANLI SEANS KİLİTLERİ ŞERİDİ -->
      <div class="stat-box" style="margin-bottom:12px;padding:11px 13px;background:rgba(12,16,28,0.92);border-color:rgba(255,255,255,0.09);">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="sync-dot" style="background:${clk.bistIsTradableNow ? '#10b981' : '#f59e0b'};"></span>
            <strong class="num-tab" style="font-size:13px;color:#fff;">İstanbul ${clk.timeStr} · ${clk.day} ${clk.monthName} ${clk.dayName}</strong>
          </div>
          <span class="dim num-tab" style="font-size:11px;">TÜİK Enflasyon: ${formatCountdownShort(clk.tuikMs, clk.ms)} · TCMB Prş 14:00: ${formatCountdownShort(clk.nextThu14Ms, clk.ms)}</span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:6px;font-size:11px;">
          <div style="padding:7px 9px;border-radius:9px;background:var(--bg-card);border:1px solid var(--border-hairline);">
            <div class="dim">Borsa İstanbul</div>
            <div style="font-weight:700;color:${clk.bistIsTradableNow ? '#34d399' : '#fbbf24'};margin-top:1px;">${esc(clk.bistLabel)}</div>
          </div>
          <div style="padding:7px 9px;border-radius:9px;background:var(--bg-card);border:1px solid var(--border-hairline);">
            <div class="dim">Banka &amp; Çarşı Makası</div>
            <div class="num-tab" style="font-weight:700;color:${clk.bankHoursOpen ? '#34d399' : '#f87171'};margin-top:1px;">
              ${clk.bankHoursOpen ? `Mesai İçi Dar (%${clk.bankSpreadPct.toFixed(2).replace('.', ',')})` : `Mesai Dışı Açık (%${clk.bankSpreadPct.toFixed(1).replace('.', ',')})`}
            </div>
          </div>
          <div style="padding:7px 9px;border-radius:9px;background:var(--bg-card);border:1px solid var(--border-hairline);">
            <div class="dim">TEFAS Fon Valörü</div>
            <div style="font-weight:700;color:${clk.tefasBeforeCutoff ? '#34d399' : '#94a3b8'};margin-top:1px;">
              ${clk.tefasBeforeCutoff ? '13:30 Öncesi (T+1)' : '13:30 Geçti (+2 İş Günü)'}
            </div>
          </div>
          <div style="padding:7px 9px;border-radius:9px;background:var(--bg-card);border:1px solid var(--border-hairline);">
            <div class="dim">Dış Dünya &amp; VİOP</div>
            <div style="font-weight:700;color:${clk.usEquitiesOpen || clk.viopOpen ? '#34d399' : '#60a5fa'};margin-top:1px;">
              ${clk.viopOpen ? 'VİOP Akşam Açık' : clk.usEquitiesOpen ? 'ABD & Emtia Canlı' : '7/24 Kripto & Emtia'}
            </div>
          </div>
        </div>
      </div>

      <!-- 2. GÜNÜN TEK GERÇEK HİKÂYESİ VE ÖNÜNDEKİ İKİ YOL -->
      <div class="compass-hero" style="margin-bottom:14px;">
        <div style="display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:700;color:var(--pos-bright);background:var(--pos-soft);padding:2.5px 9px;border-radius:99px;margin-bottom:7px;">
          ${esc(story.kicker)}
        </div>
        <h2 style="font-size:18.5px;font-weight:800;letter-spacing:-0.02em;color:#fff;line-height:1.28;margin-bottom:8px;">
          ${esc(story.headline)}
        </h2>
        <p style="font-size:13px;color:var(--text-secondary);line-height:1.55;margin-bottom:12px;">
          ${esc(story.body)}
        </p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:9px;">
          <button id="storyPathABtn" style="text-align:left;padding:12px 13px;border-radius:13px;background:rgba(16,185,129,0.11);border:1px solid rgba(16,185,129,0.38);cursor:pointer;transition:transform 0.12s;">
            <div style="font-size:13px;font-weight:800;color:#34d399;margin-bottom:3px;">1. Yol → ${esc(story.pathA.label)}</div>
            <div class="muted" style="font-size:11.5px;line-height:1.4;">${esc(story.pathA.sub)}</div>
          </button>
          <button id="storyPathBBtn" style="text-align:left;padding:12px 13px;border-radius:13px;background:rgba(59,130,246,0.10);border:1px solid rgba(59,130,246,0.32);cursor:pointer;transition:transform 0.12s;">
            <div style="font-size:13px;font-weight:800;color:#60a5fa;margin-bottom:3px;">2. Yol → ${esc(story.pathB.label)}</div>
            <div class="muted" style="font-size:11.5px;line-height:1.4;">${esc(story.pathB.sub)}</div>
          </button>
        </div>
      </div>

      <!-- 3. CEBİNDEKİ PARANIN NEFES ALANI VE BOŞTA ERİME GÖSTERGESİ -->
      <div class="compass-3col" style="margin-top:0;margin-bottom:14px;">
        <div class="stat-box" style="cursor:pointer;" onclick="switchTab('portfoy')">
          <div class="dim" style="font-size:11px;">Sana Satın Aldığı Zaman (Nefes Alanı)</div>
          <div class="num-tab pos" style="font-size:19px;font-weight:800;margin-top:2px;">${window.fmtNum(myCap.breathingMonths, 1)} Ay Özgürlük</div>
          <div class="dim" style="font-size:11px;margin-top:3px;line-height:1.4;">
            Toplam ${window.fmtTL(myCap.totalNetWorthTL, 0)} kasan kimseye eyvallah etmeden ${window.fmtNum(myCap.breathingMonths, 1)} ay nefes aldırır; çarkı ise yılda ${window.fmtNum(myCap.sustainableYearlyMonths, 1)} ayı bedavaya getirir.
          </div>
        </div>

        <div class="stat-box" style="cursor:pointer;" onclick="window.AetherExp.openQuickRealOrderSheet('inst','para-piyasasi-fonu')">
          <div class="dim" style="font-size:11px;">Boşta Duran Nakdin (${window.fmtTL(myCap.freeCashTL, 0)})</div>
          <div class="num-tab ${myCap.freeCashTL > 50000 ? 'warn' : 'muted'}" style="font-size:18px;font-weight:800;margin-top:2px;">
            ${(activeMem.wallet?.idleCashErosionTL || 0) >= 1
              ? `-${window.fmtTL(activeMem.wallet.idleCashErosionTL, 0)} Eridi`
              : `Günde -${window.fmtTL(myCap.freeCashTL * 0.00072, 0)} Eriyor`}
          </div>
          <div class="dim" style="font-size:11px;margin-top:3px;line-height:1.4;">
            ${ekmekLost >= 1
              ? `Duran nakdin şimdiye kadar ${window.fmtNum(ekmekLost, 1)} somun ekmek alım gücü kaybetti. Günlük fona veya Sukuk’a dokunup koru.`
              : 'Vadesizde duran her 100.000 ₺ ayda yaklaşık 145 somun ekmek alım gücü kaybeder.'}
          </div>
        </div>

        <div class="stat-box" style="cursor:pointer;" onclick="window.AetherExp.setMeydanSubMode('family')">
          <div class="dim" style="font-size:11px;">Aile Çay Masası Durumun</div>
          <div class="num-tab" style="font-size:16px;font-weight:800;color:#fff;margin-top:2px;">${esc(myCap.verdictBadge)}</div>
          <div class="dim" style="font-size:11px;margin-top:3px;line-height:1.4;">
            Gerçek Dünya Kanıtı: <strong class="pos">${myCap.passedCount}/7</strong> · Ailedekilerin ne alıp sattığını görmek için dokun →
          </div>
        </div>
      </div>

      <!-- 4. İSİMSİZ DÜKKÂN BULMACASI (KAĞIDIN ADINI GÖSTERMEDEN NE İŞE YARADIĞINDAN BULDUR!) -->
      <div class="surface surface-pad" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
          <span style="font-size:11px;font-weight:800;color:#fbbf24;text-transform:uppercase;letter-spacing:0.04em;">
            İsimsiz Dükkân Sınavı · Tabelaya Değil İşin Aslına Bak (${(activePuzzleIdx % allPz.length) + 1}/${allPz.length})
          </span>
          <button class="link-btn" style="padding:0;font-size:11.5px;" onclick="window.AetherExp.nextBlindPuzzle()">Başka Olay Getir →</button>
        </div>

        <p style="font-size:13.5px;font-weight:600;color:#fff;line-height:1.5;margin-bottom:10px;">
          ${esc(pz.situation)}
        </p>

        <div style="display:flex;flex-direction:column;gap:8px;">
          ${pz.options.map((opt, idx) => {
            const isPicked = revealedPuzzleChoice === opt.key;
            const showReveal = revealedPuzzleChoice !== null;
            const borderCol = !showReveal
              ? 'var(--border-hairline)'
              : opt.isBest
                ? 'rgba(16,185,129,0.55)'
                : isPicked
                  ? 'rgba(245,158,11,0.55)'
                  : 'var(--border-hairline)';
            const bgCol = !showReveal
              ? 'var(--bg-input)'
              : opt.isBest
                ? 'rgba(16,185,129,0.10)'
                : isPicked
                  ? 'rgba(245,158,11,0.09)'
                  : 'var(--bg-input)';

            return `
              <div onclick="window.AetherExp.selectBlindPuzzleChoice('${opt.key}')" style="cursor:pointer;padding:11px 13px;border-radius:12px;border:1px solid ${borderCol};background:${bgCol};transition:all 0.15s;">
                <div style="font-size:12.5px;color:#f8fafc;line-height:1.45;">
                  <strong style="color:var(--accent-bright);">${idx + 1}. Seçenek:</strong> ${esc(opt.desc)}
                </div>
                ${showReveal && (isPicked || opt.isBest) ? `
                  <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border-hairline);display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                    <div style="flex:1;min-width:200px;font-size:12px;color:${opt.isBest ? '#6ee7b7' : '#fcd34d'};line-height:1.45;">
                      <strong>Gerçekteki Karşılığı (${esc(opt.revealTitle)}):</strong> ${esc(opt.lesson)}
                    </div>
                    <button class="btn-secondary" style="height:30px;font-size:11.5px;" onclick="event.stopPropagation();${opt.targetKind === 'bist' ? `openBistDetailDrawer('${opt.targetId}')` : `openAssetDetailDrawer('${opt.targetId}')`}">
                      360° Bağlantısını Aç →
                    </button>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 5. CANLI KAP, RESMİ GAZETE, SPK HALKA ARZ VE TEMETTÜ AKIŞI -->
      <div class="radar-2col">
        <div class="surface" style="background:var(--bg-input);box-shadow:none;">
          <div style="padding:10px 13px;border-bottom:1px solid var(--border-hairline);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:12.5px;font-weight:700;color:#fff;">Canlı KAP, Resmi Gazete &amp; Dünya Akışı</span>
            <span class="dim" style="font-size:11px;">Gürültüyü Ayıkla</span>
          </div>
          ${feed.length ? feed.slice(0, 5).map(n => {
            const badge = n.cat === 'makro_resmi' ? 'Resmi / Makro' : n.cat === 'kap_bist' ? 'KAP / Şirket' : 'Hammadde';
            const cls = n.cat === 'makro_resmi' ? 'warn' : n.cat === 'kap_bist' ? 'info' : 'pos';
            return `
              <div style="padding:9px 12px;border-bottom:1px solid var(--border-hairline);font-size:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:3px;">
                  <span class="chg-pill ${cls}" style="font-size:10px;">${badge}</span>
                  <span class="dim num-tab" style="font-size:10.5px;">${esc(n.source)}</span>
                </div>
                <div style="color:#f1f5f9;line-height:1.4;">${esc(n.title)}</div>
              </div>
            `;
          }).join('') : `
            <div style="padding:16px;font-size:12px;color:var(--text-muted);">Canlı bülten akışı arka planda tazeleniyor…</div>
          `}
        </div>

        <div class="surface" style="background:var(--bg-input);box-shadow:none;padding:12px 13px;display:flex;flex-direction:column;justify-content:space-between;gap:10px;">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <span style="font-size:12.5px;font-weight:700;color:#fff;">SPK Halka Arz &amp; Temettü Gerçeği</span>
              <span class="chg-pill info" style="font-size:10px;">Eşit Dağıtım Sınırı</span>
            </div>
            <p class="muted" style="font-size:12px;line-height:1.45;margin-bottom:8px;">
              ${esc(ACTIVE_SPK_IPO_SIM.summary)}
            </p>
            <div style="display:flex;gap:6px;margin-bottom:10px;">
              <input type="number" id="ipoReqInp" class="inp mono" value="50000" step="5000" min="500" style="height:34px;font-size:12.5px;" />
              <button class="btn-secondary" style="height:34px;font-size:12px;" onclick="window.AetherExp.participateInSpkIpo(document.getElementById('ipoReqInp').value)">
                Talep Gir (Gerçek Lot Düşsün)
              </button>
            </div>
          </div>

          <div style="border-top:1px solid var(--border-hairline);padding-top:9px;">
            <div style="font-size:11.5px;font-weight:700;color:#fff;margin-bottom:5px;">Düzenli Nakit (Temettü) Çarkı (%15 Stopaj Sonrası Net):</div>
            ${UPCOMING_DIVIDEND_WATCH.slice(0, 3).map(d => {
              const netDiv = +(d.estGrossPerShareTL * (1 - d.stopajPct / 100)).toFixed(2);
              return `
                <div onclick="openBistDetailDrawer('${d.ticker}')" style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:11.5px;border-bottom:1px solid rgba(255,255,255,0.04);">
                  <span><strong style="color:#fff;">${d.ticker}</strong> · ${esc(d.name)}</span>
                  <span class="num-tab pos">Pay başı net ~${window.fmtNum(netDiv, 2)} ₺</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    const btnA = document.getElementById('storyPathABtn');
    const btnB = document.getElementById('storyPathBBtn');
    if (btnA) btnA.onclick = story.pathA.act;
    if (btnB) btnB.onclick = story.pathB.act;
  }

  function renderFamilyTeaTableInto(mount, clk, myCap) {
    const esc = window.escapeHtml;
    const visibleMembers = familyState.members
      .filter(m => familyState.showArchetypes || !m.isArchetype)
      .map(evaluateMemberCaptaincy)
      .sort((a, b) => b.captainScore - a.captainScore);

    const allFeed = [];
    for (const c of visibleMembers) {
      for (const f of (c.member.activityFeed || []).slice(0, 4)) {
        allFeed.push({ memberName: c.member.name, memberId: c.member.id, ...f });
      }
    }
    allFeed.sort((a, b) => b.ts - a.ts);

    mount.innerHTML = `
      <div class="verdict-banner" style="margin-bottom:12px;">
        <div style="min-width:0;flex:1;">
          <div style="font-size:11px;font-weight:700;color:var(--pos-bright);text-transform:uppercase;">
            AİLE ÇAY MASASI · KİM GEMİYİ SAĞLAM YANAŞTIRIYOR, KİM TEK ZARA OYNUYOR?
          </div>
          <div style="font-size:17px;font-weight:800;color:#fff;margin-top:2px;">
            Çok para kazanan değil, fırtınada batmayıp bilerek büyüyen üst sırada yer alır.
          </div>
          <div class="muted" style="font-size:12px;margin-top:3px;">
            Herhangi bir aile üyesine dokunarak kasasındaki tüm varlıkları, alış fiyatlarını, kâr/zararını ve neden o hamleyi yaptığını açıkça gör.
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn-secondary" onclick="window.AetherExp.openMemberSwitcherSheet()">+ Aile Üyesi Ekle / Değiştir</button>
          <button class="btn-emerald" onclick="window.AetherExp.shareFamilyToWhatsApp()">Aile Grubuna Gönder</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(285px,1fr));gap:10px;margin-bottom:14px;">
        ${visibleMembers.map((c, idx) => `
          <div class="stat-box" onclick="window.AetherExp.openFamilyMemberXraySheet('${esc(c.member.id)}')" style="cursor:pointer;border-color:${c.member.id === activeMemberId ? 'rgba(59,130,246,0.55)' : 'var(--border-hairline)'};">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px;">
              <div>
                <span class="dim mono" style="font-size:11px;">#${idx + 1} Kaptanlık Sağlamlığı: ${c.captainScore}/100</span>
                <div style="font-size:15px;font-weight:800;color:#fff;">${esc(c.member.name)}</div>
              </div>
              <span class="chg-pill ${c.verdictTone}" style="font-size:10.5px;">${esc(c.verdictBadge)}</span>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
              <div class="num-tab" style="font-size:19px;font-weight:800;color:#fff;">${window.fmtTL(c.totalNetWorthTL, 0)}</div>
              <div class="num-tab ${window.pctCls(c.pnlTL)}" style="font-size:13px;font-weight:700;">
                ${c.pnlTL >= 0 ? '+' : ''}${window.fmtTL(c.pnlTL, 0)} (${window.fmtPct(c.pnlPct, 1)})
              </div>
            </div>

            <p class="muted" style="font-size:11.5px;line-height:1.42;margin-bottom:8px;">
              ${esc(c.verdictReason)}
            </p>

            <div class="num-tab dim" style="padding-top:7px;border-top:1px solid var(--border-hairline);display:flex;justify-content:space-between;font-size:11px;">
              <span>Çeşitlilik: <strong>${c.distinctGroupsCount} Kova</strong> · %0 Vergi: <strong>%${Math.round(c.zeroTaxPct)}</strong></span>
              <span style="color:var(--accent-bright);">Kasayı Aç →</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="v9-salon-hero">
        <div style="font-size:11px;font-weight:800;color:#fbbf24;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;">
          AKŞAM ÇAYI MUHABBETİ · BİRBİRİNİZE LAF ATIN VEYA NEDENİNİ SORUN
        </div>
        <div class="chip-rail" style="margin-bottom:8px;">
          <button class="chip" onclick="window.AetherWorld.sendFamilyTeaBanter('Sen niye bugün elindekini sattın?')">"Sen niye bugün elindekini sattın?"</button>
          <button class="chip" onclick="window.AetherWorld.sendFamilyTeaBanter('Gece banka makasına yem olmuşsun, sabahı bekleseydin!')">"Gece makasına yem olmuşsun!"</button>
          <button class="chip" onclick="window.AetherWorld.sendFamilyTeaBanter('Helal, sürü bakmazken sağlam dükkânı güzel yakalamışsın.')">"Sağlam dükkânı güzel yakalamışsın"</button>
        </div>
        <div style="display:flex;gap:8px;">
          <input type="text" id="v9TeaBanterInp" class="inp" placeholder="Çay masasına not bırak (Örn: Baba o hissenin borcu çok, dikkat et)…" />
          <button class="btn-primary" onclick="window.AetherWorld.sendFamilyTeaBanter()">Masaya Yaz</button>
        </div>
      </div>

      <div class="surface" style="background:var(--bg-input);box-shadow:none;">
        <div style="padding:10px 13px;border-bottom:1px solid var(--border-hairline);display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:13px;font-weight:700;color:#fff;">Akşam Çayı Muhabbeti: Kim Bugün Ne Yaptı ve Neden?</span>
          <span class="dim" style="font-size:11px;">Şeffaf Aile Akışı</span>
        </div>
        ${allFeed.slice(0, 10).map(item => `
          <div onclick="window.AetherExp.openFamilyMemberXraySheet('${esc(item.memberId)}')" style="cursor:pointer;padding:10px 13px;border-bottom:1px solid var(--border-hairline);font-size:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:2px;">
              <span><strong style="color:var(--accent-bright);">${esc(item.memberName)}</strong> · <strong style="color:#fff;">${esc(item.action)}</strong></span>
              <span class="dim num-tab" style="font-size:10.5px;">${formatTrShortDateTime(item.ts)}</span>
            </div>
            <div class="muted" style="line-height:1.45;">${esc(item.detail)}</div>
            ${item.why ? `<div style="font-size:11px;color:#34d399;margin-top:2px;">Sebebi: "${esc(item.why)}"</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderWorldChainsInto(mount, clk) {
    const esc = window.escapeHtml;
    const fmtP = window.fmtPct || (v => v + '%');
    const pCls = window.pctCls || (v => (v >= 0 ? 'pos' : 'neg'));
    const lookup = window.marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup || {};

    const snapInst = (id, shortLbl) => {
      const inst = window.instById?.get(id);
      if (!inst) return { kind: 'inst', id, label: shortLbl, p: '—', c1: 0, m1: 0 };
      const p = window.fmtAssetPrice ? window.fmtAssetPrice(inst.currentPrice, inst.unitLabel, inst.isUsdAsset, inst.isRateInstrument) : String(inst.currentPrice);
      const c1 = Number(inst.tlChange1D ?? inst.change1D) || 0;
      const m1 = window.computeAssetStageMetrics ? window.computeAssetStageMetrics(inst, 1).tlNetPct : (Number(inst.perf1M) || 0);
      return { kind: 'inst', id, label: shortLbl, p, c1, m1 };
    };
    const snapBist = (ticker, shortLbl) => {
      const st = lookup[ticker];
      if (!st) return { kind: 'bist', id: ticker, label: shortLbl || ticker, p: '—', c1: 0, m1: 0 };
      return {
        kind: 'bist',
        id: ticker,
        label: shortLbl || ticker,
        p: `${window.fmtNum(st.close, 2)} ₺`,
        c1: Number(st.change1D) || 0,
        m1: Number(st.perf1M) || 0
      };
    };

    const liveChains = [
      {
        tag: '1. ZİNCİR · MAZOTTAN DOMATESE & UÇAK BİLETİNE',
        title: 'Ham Petrol Ucuzlarsa Kim Nefes Alır, Fırlarsa Neresi Yanar?',
        story: 'Kamyonun deposundaki mazot pahalandığında pazardaki domatesten uçak biletine kadar her şey zamlanır; petrol düştüğünde ise en çok yakıt yakan havayolunun kasası bayram eder.',
        step1: snapInst('emtia-petrol-bno', '1. Hammadde: Brent Petrol'),
        step2: snapBist('TUPRS', '2. Kazan: Tüpraş Rafineri'),
        step3: snapBist('THYAO', '3. Yakıt Yakan: THY Havacılık'),
        verdict: (snapInst('emtia-petrol-bno', '').m1 <= -3)
          ? 'Son 1 ayda petrol gevşedi → Yakıt faturası düşen havacılık ve taşımacılık lehine rüzgâr var.'
          : 'Petrol diri seyrediyor → Enerji/rafineri kalkanı güçlü, yakıt tüketen işlerde maliyet takibi şart.'
      },
      {
        tag: '2. ZİNCİR · TARLADAKİ KURAKLIKTAN MUTFAK TENCERESİNE',
        title: 'Buğday ve Gübre Kıpırdadığında Kasası Bozulmayan Dükkân',
        story: 'Kuraklık veya nakliye zammı geldiğinde önce dünya tarım emtiası uyanır, 3 ay sonra market etiketi değişir. Vatandaş lüksü kısar ama ekmeği peşin satan borçsuz marketin hasılatı enflasyonla büyür.',
        step1: snapInst('emtia-tarim-dba', '1. Tarla: Dünya Tarım Sepeti'),
        step2: snapBist('BIMAS', '2. Peşin Kasa: BİM Market'),
        step3: snapBist('MGROS', '3. Raf & Online: Migros'),
        verdict: 'Borçsuz gıda perakendecisi toptancıya vadeli ödeyip müşteriden peşin tahsil ettiği nakdi yüksek faizde çalıştırır.'
      },
      {
        tag: '3. ZİNCİR · YAPAY ZEKA SUNUCUSUNDAN TRAFO VE GÜMÜŞE',
        title: 'Herkes Çip Konuşurken Prizdeki Elektriği ve İletkeni Satanlar',
        story: 'Veri merkezleri ve elektrikli araçlar devasa elektrik çeker. Şebeke yenilenmeden sunucu çalışmaz; gümüş olmadan da güneş paneli üretilmez.',
        step1: snapInst('fon-tematik-yari-iletken-soxx', '1. Kıvılcım: Dünya Çipleri'),
        step2: snapBist('ASTOR', '2. Şebeke: Astor Trafo'),
        step3: snapInst('gram-gumus-spot', '3. İletken: Gram Gümüş'),
        verdict: 'Tabeladaki teknoloji dedikodusu yerine şebekenin kazma-küreğini (trafo ve gümüşü) izleyen sürüden önce uyanır.'
      },
      {
        tag: '4. ZİNCİR · PARANIN KİRASINDAN (FAİZ) TAPU VE KREDİYE',
        title: 'Kış Bitmeden Baharı Haber Veren 2 Yıllık Tahvil İzi',
        story: 'Merkez Bankası faizi henüz yüksekken konut ve kredi piyasası donuktur. Ancak büyük para, faiz indirimini aylar öncesinden 2 Yıllık Tahvil faizini düşürerek fiyatlar.',
        step1: snapInst('dibs-tahvil', '1. Öncü İz: 2Y Devlet Tahvili'),
        step2: snapInst('gayrimenkul-gyo-fonu-optgy', '2. Tapu İskontosu: GYO Fonu'),
        step3: snapInst('fon-yerli-banka-zplib', '3. Kredi Musluğu: Bankalar Fonu'),
        verdict: 'Gazeteler "Konut kuyruğu başladı" diye yazdığında iş işten geçmiştir; öncü sinyal 2Y tahvil faizinin yönüdür.'
      },
      {
        tag: '5. ZİNCİR · AVRUPA SİPARİŞİNDEN İHRACAT ATÖLYESİNE',
        title: 'İçeride TL Masraf Yapıp Dışarıya Euro Fatura Kesenler',
        story: 'İç pazar daralsa bile ürettiği aracın ve makinenin %75’ini Avrupa’ya Euro ile satan fabrikalar, Euro/TL kuru ve Avrupa talebiyle nefes alır.',
        step1: snapInst('doviz-eur', '1. Döviz Kasası: Euro / TL'),
        step2: snapBist('FROTO', '2. Atölye: Ford Otomotiv'),
        step3: snapInst('bist-temettu-25', '3. Nakit Payı: Temettü 25'),
        verdict: 'İhracatçı sanayi şirketi döviz korumasını üretimle birleştirir; kârını da ortaklarına temettü olarak dağıtır.'
      },
      {
        tag: '6. ZİNCİR · GECE KORKUSUNDAN DOĞRU KALKANA',
        title: 'Sarsıntı Gecesi Banka Makasına Yem Olmadan Kalkan Kurmak',
        story: 'Akşam 17:30’dan sonra banka ekranında altın makası %3,6 açılır. Kalkan fırtına gecesi değil, güneşli mesai saatinde %0 vergili Darphane S1 veya Sukuk ile kurulur.',
        step1: snapInst('doviz-usd', '1. Kur Ayağı: Dolar / TL'),
        step2: snapInst('altin-sertifikasi', '2. Borsa Kalkanı: Altın S1'),
        step3: snapInst('kira-sertifikasi-sukuk', '3. Nakit Kalkanı: %0 Sukuk'),
        verdict: clk.bankHoursOpen
          ? 'Şu an mesai içi: Makaslar dar, kalkan kurmak veya dengelemek için sağlıklı saat.'
          : `Şu an mesai dışı (${clk.timeStr}): Banka makası ~%${clk.bankSpreadPct.toFixed(1).replace('.', ',')} açık! Gece işlem yapmama disiplini aktif.`
      }
    ];

    mount.innerHTML = `
      <div class="verdict-banner" style="margin-bottom:12px;">
        <div style="min-width:0;flex:1;">
          <div style="font-size:11px;font-weight:700;color:var(--accent-bright);text-transform:uppercase;">
            FABRİKA BACASINDAN MUTFAK TENCERESİNE · 6 CANLI DÜNYA ZİNCİRİ
          </div>
          <div style="font-size:17px;font-weight:800;color:#fff;margin-top:2px;">
            Tek bir fiyata hapsolma; bir yerdeki kıvılcımın üç adım ötede nereyi ısıttığını canlı rakamlarla gör.
          </div>
          <div class="muted" style="font-size:12px;margin-top:3px;">
            Kutuların her biri şu anki gerçek piyasa fiyatıdır. Herhangi bir halkaya dokunarak 360° mutfak karnesini açabilirsin.
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px;">
        ${liveChains.map(ch => `
          <div class="surface surface-pad" style="margin-bottom:0;display:flex;flex-direction:column;justify-content:space-between;gap:10px;">
            <div>
              <div style="font-size:10.5px;font-weight:800;color:#fbbf24;letter-spacing:0.04em;margin-bottom:4px;">${esc(ch.tag)}</div>
              <h3 style="font-size:15px;font-weight:800;color:#fff;line-height:1.3;margin-bottom:6px;">${esc(ch.title)}</h3>
              <p class="muted" style="font-size:12px;line-height:1.48;margin-bottom:10px;">${esc(ch.story)}</p>

              <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;">
                ${[ch.step1, ch.step2, ch.step3].map(st => {
                  const fn = st.kind === 'bist' ? `openBistDetailDrawer('${esc(st.id)}')` : `openAssetDetailDrawer('${esc(st.id)}')`;
                  return `
                    <div onclick="${fn}" style="cursor:pointer;padding:8px;border-radius:10px;background:var(--bg-input);border:1px solid var(--border-hairline);min-width:0;">
                      <div style="font-size:10px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(st.label)}</div>
                      <div class="num-tab" style="font-size:12.5px;font-weight:800;color:#fff;margin-top:3px;">${esc(st.p)}</div>
                      <div class="num-tab ${pCls(st.c1)}" style="font-size:10px;margin-top:1px;">G: ${fmtP(st.c1, 1)}</div>
                      <div class="num-tab ${pCls(st.m1)}" style="font-size:10px;">1A: ${fmtP(st.m1, 1)}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <div style="padding:8px 10px;border-radius:10px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.22);font-size:11.5px;color:#e2e8f0;line-height:1.42;">
              <strong style="color:var(--accent-bright);">Şu Anki Okuma:</strong> ${esc(ch.verdict)}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function toggleMirrorDebtSim(borrowed) {
    mirrorDebtSimBorrowed = Boolean(borrowed);
    renderMeydanView();
  }

  function unlockFogPreview() {
    fogPreviewUnlocked = !fogPreviewUnlocked;
    renderMeydanView();
  }

  function renderPersonalMirrorInto(mount, clk, myCap) {
    const esc = window.escapeHtml;
    const m = myCap.member;
    const w = m.wallet || {};
    const watched = w.watchedPassList || [];
    const lookup = window.marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup || {};
    const usdTry = Number(window.marketData?.macro?.usdTry) || 50.4;

    // Kişinin tercihlerinden süzülen "Dost Aynası" Davranış Teşhisi (Jungçu Gölge & Kahneman Sabır Aynası)
    let shadowTitle = 'Dengeli Yolcu · Adımlarını Tartarak Atıyor';
    let shadowBody = 'Şimdiye kadar ne tüm yumurtaları tek sepete koydun ne de gece panik makasına parayı kaptırdın. Asıl ustalık, üst üste kazandığın günlerde gelecek "ben bu işi çözdüm" rehavetine kapılmamaktır.';
    let nextChallengeBtn = `<button class="btn-secondary" style="height:32px;font-size:11.5px;" onclick="window.AetherExp.setMeydanSubMode('today')">İsimsiz Dükkân Sınavıyla Gözünü Keskinleştir →</button>`;

    if ((m.stats?.afterHoursSpreadHits || 0) > 0) {
      shadowTitle = 'Gece Nöbetçisi Gölgesi · Mesai Dışı Makas Yedin';
      shadowBody = `Kepenkler kapalıyken ekran başında heyecanlanıp ${m.stats.afterHoursSpreadHits} kez mesai dışı banka makasına girdin. Hatırla: Sabaha kadar beklemek bazen tüm gün çalışmaktan daha çok kazandırır.`;
      nextChallengeBtn = `<button class="btn-secondary" style="height:32px;font-size:11.5px;" onclick="openAssetDetailDrawer('altin-sertifikasi')">Dar Makaslı Borsa Kalkanını (S1) İncele →</button>`;
    } else if (myCap.maxSingleSharePct >= 58) {
      shadowTitle = 'Tek Sepet Cesaret Tuzağı · Yumurtalar Tek Elde';
      shadowBody = `Kasandaki paranın %${Math.round(myCap.maxSingleSharePct)} kadarı tek bir varlığa yüklenmiş. İşler yolunda giderken bu özgüven tatlı gelir ama tek bir ters haberde bütün uykunu kaçırabilir.`;
      nextChallengeBtn = `<button class="btn-secondary" style="height:32px;font-size:11.5px;" onclick="switchTab('portfoy');setPfSubTab('stress');">Kasamı Fırtına Senaryosunda Test Et →</button>`;
    } else if (myCap.freeCashTL > myCap.totalNetWorthTL * 0.45) {
      shadowTitle = 'Aşırı Temkin Gölgesi · Kilerde Beklerken Erime';
      shadowBody = `Hata yapmaktan çekinip paranın %${Math.round((myCap.freeCashTL / Math.max(1, myCap.totalNetWorthTL)) * 100)} kadarını vadesiz boşta tutuyorsun. Hiç karar vermemek de sessiz bir karardır ve her gün somun ekmek hesabıyla erir.`;
      nextChallengeBtn = `<button class="btn-secondary" style="height:32px;font-size:11.5px;" onclick="window.AetherExp.openQuickRealOrderSheet('inst','kira-sertifikasi-sukuk')">%0 Vergili Hazine Kirasıyla Erimeyi Durdur →</button>`;
    }

    // Eski Kafam vs Şimdiki Aklım Karşılaştırması
    const feedLog = m.activityFeed || [];
    const earliestEntry = feedLog[feedLog.length - 1] || { action: 'Başlangıç', detail: 'Henüz ilk adım kaydedilmedi.', ts: m.createdAt || Date.now() };
    const latestEntry = feedLog[0] || earliestEntry;
    const solvedCount = Object.keys(m.blindSolvedIds || {}).length;

    // Borç / Kredi Uykusuzluğu Simülasyonu (500.000 ₺ öz para ile yola çıkış: Kendi Parası vs +500.000 ₺ Kredili Boyundan Büyük Yük)
    const baseEq = 500000;
    const dipPct = -22; // Gerçekçi sert borsa sarsıntısı (-%22)
    const creditQuarterInterest = Math.round(500000 * (0.62 * 90 / 365)); // 3 aylık ~%62 kredili işlem faiz yükü
    const unlevAfterDip = Math.round(baseEq * (1 + dipPct / 100)); // 390.000 ₺ (Hisse elinde durur, kimse zorla satamaz)
    const levGrossPosAfterDip = Math.round(1000000 * (1 + dipPct / 100)); // 780.000 ₺
    const levEquityLeft = Math.max(0, levGrossPosAfterDip - 500000 - creditQuarterInterest); // 203.560 ₺ (-%59,3 erime + teminat tamamlama çağrısı!)

    // Sisin Dağılması (Fog of Mastery): Seviye 2 VİOP & Bilanço Masası + Seviye 3 Sektör Döngü Haritası
    const stage2Open = myCap.passedCount >= 3 || fogPreviewUnlocked;
    const stage3Open = myCap.passedCount >= 5 || fogPreviewUnlocked;

    const viopInst = window.instById?.get('viop-bist30-kontrat');
    const bist30Inst = window.instById?.get('bist-30');
    const viopDiff = (Number(viopInst?.change1D) || 0) - (Number(bist30Inst?.change1D) || 0);
    const smartBargains = (window.getSmartBistCandidates ? window.getSmartBistCandidates() : []).slice(0, 4);

    // Sektör Sıcaklık Özeti (619 Şirketten Canlı Özet)
    const secAgg = {};
    for (const st of Object.values(lookup)) {
      if (!st || !st.ticker) continue;
      const s = window.getSectorTr ? window.getSectorTr(st) : (st.sector || 'Diğer');
      if (!secAgg[s]) secAgg[s] = { cnt: 0, sumDd: 0, netCashCnt: 0 };
      secAgg[s].cnt++;
      secAgg[s].sumDd += (Number(st.drawdown52WPct) || 0);
      if (st.isNetCash) secAgg[s].netCashCnt++;
    }
    const topSectors = Object.entries(secAgg)
      .filter(([, v]) => v.cnt >= 8)
      .map(([name, v]) => ({ name, cnt: v.cnt, avgDd: +(v.sumDd / v.cnt).toFixed(1), netCashCnt: v.netCashCnt }))
      .sort((a, b) => a.avgDd - b.avgDd)
      .slice(0, 6);

    mount.innerHTML = `
      <div class="verdict-banner ${myCap.passedCount >= 7 ? '' : 'warn-tone'}" style="margin-bottom:12px;">
        <div style="min-width:0;flex:1;">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:${myCap.passedCount >= 7 ? 'var(--pos-bright)' : 'var(--warn-bright)'};">
            GERÇEK DÜNYAYA ADIM ATMA KANITI (${myCap.passedCount} / 7 TAMAMLANDI)
          </div>
          <div style="font-size:18px;font-weight:800;color:#fff;margin-top:2px;">
            ${myCap.passedCount >= 7
              ? 'Alıştırma sahasındaki tüm gerçek sınavları geçtin; gerçek dünyaya yabancı değilsin.'
              : 'Acele etme; gerçek parayla tokat yemeden önce buradaki eksik halkalarını tamamla.'}
          </div>
          <div class="bench-track" style="margin-top:8px;">
            <div class="bench-fill" style="width:${((myCap.passedCount / 7) * 100).toFixed(0)}%;background:#34d399;"></div>
          </div>
        </div>
      </div>

      <!-- DOST AYNASI & ESKİ KAFAM VS ŞİMDİKİ AKLIM -->
      <div class="radar-2col" style="margin-bottom:12px;">
        <div class="surface surface-pad" style="margin-bottom:0;">
          <div style="font-size:11px;font-weight:800;color:var(--accent-bright);text-transform:uppercase;margin-bottom:4px;">
            Parayla İmtihan Aynan · Görmüş Geçirmiş Dost Notu
          </div>
          <div style="font-size:15px;font-weight:800;color:#fff;margin-bottom:6px;">${esc(shadowTitle)}</div>
          <p class="muted" style="font-size:12px;line-height:1.5;margin-bottom:10px;">${esc(shadowBody)}</p>
          ${nextChallengeBtn}
        </div>

        <div class="surface surface-pad" style="margin-bottom:0;">
          <div style="font-size:11px;font-weight:800;color:#34d399;text-transform:uppercase;margin-bottom:6px;">
            Eski Kafam vs. Şimdiki Aklım · Bıraktığın İz
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11.5px;">
            <div style="padding:8px 10px;border-radius:10px;background:var(--bg-input);border:1px solid var(--border-hairline);">
              <div class="dim" style="font-size:10.5px;">İlk Adımın (${formatTrShortDateTime(earliestEntry.ts)})</div>
              <div style="font-weight:700;color:#e2e8f0;margin-top:2px;">${esc(earliestEntry.action)}</div>
              <div class="muted" style="font-size:11px;margin-top:2px;">Başlangıç noktası · 0 bulmaca</div>
            </div>
            <div style="padding:8px 10px;border-radius:10px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.28);">
              <div style="font-size:10.5px;color:#6ee7b7;font-weight:700;">Şimdiki Duruşun</div>
              <div style="font-weight:700;color:#fff;margin-top:2px;">${esc(latestEntry.action)}</div>
              <div class="muted num-tab" style="font-size:11px;margin-top:2px;">${myCap.passedCount}/7 Kanıt · ${solvedCount} Hammadde Çözümü</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 7 SOMUT GERÇEK HAYAT KANITI -->
      <div class="surface surface-pad" style="margin-bottom:12px;">
        <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:8px;">Ne Zaman Gerçekten Hazır Olacaksın? (7 Somut Kanıt)</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:7px;">
          ${myCap.proofs.map(p => `
            <div style="padding:9px 11px;border-radius:10px;background:var(--bg-input);border:1px solid ${p.ok ? 'rgba(16,185,129,0.34)' : 'var(--border-hairline)'};display:flex;align-items:center;gap:8px;font-size:12px;">
              <span style="width:9px;height:9px;border-radius:50%;flex-shrink:0;background:${p.ok ? '#34d399' : '#475569'};"></span>
              <span style="color:${p.ok ? '#f8fafc' : 'var(--text-secondary)'};">${esc(p.label)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- BORÇLA / KREDİYLE YOLA ÇIKMANIN UYKUSUZLUK AYNASI -->
      <div class="surface surface-pad" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <div>
            <div style="font-size:11px;font-weight:800;color:#fbbf24;text-transform:uppercase;">Boyundan Büyük Yük Sınavı · Borç Uykusuzluğu</div>
            <div style="font-size:14px;font-weight:800;color:#fff;margin-top:1px;">500.000 ₺ Öz Paran Varken Piyasa 3 Ayda -%22 Sarsılırsa Ne Yaşarsın?</div>
          </div>
          <div class="seg-bar inline">
            <button class="seg-item ${!mirrorDebtSimBorrowed ? 'active' : ''}" onclick="window.AetherExp.toggleMirrorDebtSim(false)">Kendi Paramla (Borçsuz)</button>
            <button class="seg-item ${mirrorDebtSimBorrowed ? 'active' : ''}" onclick="window.AetherExp.toggleMirrorDebtSim(true)">+500B ₺ Kredili / Borçlu</button>
          </div>
        </div>
        ${!mirrorDebtSimBorrowed ? `
          <div style="padding:10px 12px;border-radius:11px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.28);font-size:12.5px;color:#e2e8f0;line-height:1.5;">
            <strong>Huzurlu Uyku:</strong> 500.000 ₺ öz paran kağıt üzerinde geçici olarak <strong class="num-tab">${window.fmtTL(unlevAfterDip, 0)}</strong> görünür ama <strong>tek bir lotun bile eksilmez</strong>. Kimse seni arayıp "teminat tamamla yoksa malını dipten satıyoruz" diyemez; fırtına dinince gemin limana çıkar.
          </div>
        ` : `
          <div style="padding:10px 12px;border-radius:11px;background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.34);font-size:12.5px;color:#fecaca;line-height:1.5;">
            <strong>Uykusuz Gece &amp; Zorunlu Dip Satışı:</strong> 500B ₺ öz paranın yanına 500B ₺ kredili yük aldığında, -%22 sarsıntı + 3 aylık kredi faizi (<strong class="num-tab">-${window.fmtTL(creditQuarterInterest, 0)}</strong>) öz paranı bir anda <strong class="num-tab neg">${window.fmtTL(levEquityLeft, 0)} (-%59)</strong> seviyesine indirir! Aracı kurum teminat çağrısı yapar ve elindeki sağlam malı en dipten zorla sattırır.
          </div>
        `}
      </div>

      <!-- OLGUNLAŞTIKÇA DAĞILAN SİS (PROGRESSIVE FOG-OF-MASTERY) -->
      <div class="surface surface-pad" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <div>
            <div style="font-size:11px;font-weight:800;color:var(--pos-bright);text-transform:uppercase;">Sen Olgunlaştıkça Dağılan Sis · Derin Katmanlar</div>
            <div class="dim" style="font-size:11.5px;">Temeli oturtmadan karmaşık veriye boğulmazsın; kanıt topladıkça yeni ufuklar açılır.</div>
          </div>
          ${myCap.passedCount < 5 ? `
            <button class="link-btn" style="font-size:11.5px;padding:0;" onclick="window.AetherExp.unlockFogPreview()">
              ${fogPreviewUnlocked ? 'Normal Seviyeme Dön' : 'Derin Katmanlara Göz At →'}
            </button>
          ` : ''}
        </div>

        <div class="radar-2col">
          <div class="stat-box" style="opacity:${stage2Open ? '1' : '0.62'};">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <strong style="font-size:12.5px;color:#fff;">2. Katman: VİOP Akşam İpucu &amp; Bilanço Masası</strong>
              <span class="chg-pill ${stage2Open ? 'pos' : 'muted'}" style="font-size:10px;">${stage2Open ? 'Açık' : '3/7 Kanıtta Açılır'}</span>
            </div>
            ${stage2Open ? `
              <div style="font-size:11.5px;color:var(--text-secondary);margin-bottom:7px;line-height:1.42;">
                Vadeli BIST 30 – Spot Makası: <strong class="num-tab ${window.pctCls(viopDiff)}">${window.fmtPct(viopDiff, 2)}</strong> (${clk.viopOpen ? 'VİOP Akşam Seansı şu an canlı' : 'Sabah 09:55 eşleşmesi için beklenti sinyali'}).
              </div>
              ${smartBargains.map(st => `
                <div onclick="openBistDetailDrawer('${esc(st.ticker)}')" style="cursor:pointer;display:flex;justify-content:space-between;padding:5px 0;border-top:1px solid var(--border-hairline);font-size:11.5px;">
                  <span><strong style="color:#fff;">${esc(st.ticker)}</strong> · ${st.isNetCash ? 'Nakit Fazlası' : 'Kârlı'}</span>
                  <span class="num-tab pos">Zirveden ${window.fmtPct(st.drawdown52WPct, 0)}</span>
                </div>
              `).join('')}
            ` : `<div class="dim" style="font-size:11.5px;">3 gerçek dünya kanıtını tamamladığında akşam bilançoları ve vadeli piyasa açılış sinyali burada belirir.</div>`}
          </div>

          <div class="stat-box" style="opacity:${stage3Open ? '1' : '0.62'};">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <strong style="font-size:12.5px;color:#fff;">3. Katman: 619 Şirket İş Kolu İskonto Haritası</strong>
              <span class="chg-pill ${stage3Open ? 'pos' : 'muted'}" style="font-size:10px;">${stage3Open ? 'Açık' : '5/7 Kanıtta Açılır'}</span>
            </div>
            ${stage3Open ? `
              ${topSectors.map(sc => `
                <div onclick="bistSectorFilter='${esc(sc.name)}';switchTab('bist');" style="cursor:pointer;display:flex;justify-content:space-between;padding:5px 0;border-top:1px solid var(--border-hairline);font-size:11.5px;">
                  <span><strong style="color:#fff;">${esc(sc.name)}</strong> (${sc.netCashCnt} nakit zengini)</span>
                  <span class="num-tab warn">Ort. ${window.fmtPct(sc.avgDd, 0)}</span>
                </div>
              `).join('')}
            ` : `<div class="dim" style="font-size:11.5px;">5 kanıtı tamamladığında tüm iş kollarının zirveye uzaklık ve nakit bolluğu haritası açılır.</div>`}
          </div>
        </div>
      </div>

      <!-- BEKLEYEN EMİRLER & T+2 TAKASTAKİ PARALAR -->
      <div class="radar-2col">
        <div class="surface" style="background:var(--bg-input);box-shadow:none;padding:12px 13px;">
          <div style="font-size:12.5px;font-weight:700;color:#fff;margin-bottom:6px;">T+2 Takasta &amp; Valörde Bekleyenlerin</div>
          ${(w.t2PendingSettlements?.length || w.pendingOrders?.length) ? `
            ${(w.t2PendingSettlements || []).map(s => `
              <div class="stat-box" style="padding:8px 10px;margin-bottom:6px;font-size:11.5px;">
                <div style="display:flex;justify-content:space-between;"><strong>T+2 Takas: ${esc(s.sourceName)}</strong><strong class="pos">${window.fmtTL(s.amountTL, 0)}</strong></div>
                <div class="dim" style="margin-top:2px;">Serbest nakde geçiş: ${formatTrShortDateTime(s.releaseAtMs)}</div>
              </div>
            `).join('')}
            ${(w.pendingOrders || []).map(o => `
              <div class="stat-box" style="padding:8px 10px;margin-bottom:6px;font-size:11.5px;">
                <div style="display:flex;justify-content:space-between;"><strong>Bekleyen Emir: ${esc(o.title)}</strong><strong>${window.fmtTL(o.amountTL, 0)}</strong></div>
                <div class="dim" style="margin-top:2px;">Gerçekleşeceği seans/valör: ${formatTrShortDateTime(o.executeAfterMs)}</div>
              </div>
            `).join('')}
          ` : `<div class="muted" style="font-size:12px;">Şu an takasta veya seans açılış kuyruğunda bekleyen işlemin yok.</div>`}

          <div style="margin-top:10px;padding-top:9px;border-top:1px solid var(--border-hairline);font-size:11.5px;color:var(--text-secondary);">
            Sabırsızlık, Komisyon &amp; Mesai Dışı Makas Kaybın: <strong class="${(w.frictionLeakTL || 0) > 1000 ? 'neg' : 'muted'}">-${window.fmtTL(w.frictionLeakTL || 0, 0)}</strong>
          </div>
        </div>

        <!-- SESSİZCE KAÇAN FIRSATLAR VE SAKINILAN TUZAKLAR KÖŞESİ -->
        <div class="surface" style="background:var(--bg-input);box-shadow:none;padding:12px 13px;">
          <div style="font-size:12.5px;font-weight:700;color:#fff;margin-bottom:6px;">Sessiz Köşe: Kenarda Beklerken Uçup Gidenler &amp; Kurtuldukların</div>
          ${watched.length ? watched.map(wt => {
            let nowTL = wt.refPriceTL;
            if (wt.kind === 'bist') nowTL = Number(lookup[wt.id]?.close) || wt.refPriceTL;
            else {
              const inst = window.instById?.get(wt.id);
              if (inst) nowTL = inst.isUsdAsset ? Number(inst.currentPrice) * usdTry : Number(inst.currentPrice);
            }
            const chgPct = wt.refPriceTL > 0 ? ((nowTL - wt.refPriceTL) / wt.refPriceTL) * 100 : 0;
            const hypo200k = Math.round(200000 * (chgPct / 100));
            return `
              <div style="padding:8px 0;border-bottom:1px solid var(--border-hairline);font-size:11.5px;display:flex;justify-content:space-between;gap:8px;">
                <div>
                  <strong style="color:#fff;">${esc(wt.label)}</strong>
                  <div class="dim">${formatTrShortDateTime(wt.loggedAtMs)} tarihinde bakıp geçtin</div>
                </div>
                <div class="r-right num-tab">
                  <div class="${window.pctCls(chgPct)}" style="font-weight:700;">${window.fmtPct(chgPct, 2)}</div>
                  <div class="dim" style="font-size:10.5px;">200B ₺’de ${hypo200k >= 0 ? '+' : ''}${window.fmtTL(hypo200k, 0)}</div>
                </div>
              </div>
            `;
          }).join('') : `
            <div class="muted" style="font-size:12px;line-height:1.45;">
              Herhangi bir şirketin veya aracın kartında <strong>"İzlemeye Al (Almadan Takip Et)"</strong> tuşuna dokunduğunda, korkup almadığın şeylerin ne kazandırdığını ya da sabredip atlamadığın tuzaklardan nasıl korunduğunu burada sessizce biriktirir.
            </div>
          `}
        </div>
      </div>
    `;
  }

  function renderAllExperienceSurfaces() {
    renderHeaderMemberBadge();
    if (window.activeTab === 'meydan') {
      renderMeydanView();
    } else if (window.activeTab === 'portfoy') {
      injectKasamWalletStrip();
    }
  }

  function injectKasamWalletStrip() {
    const heroBox = document.getElementById('portfoyHeroBox');
    if (!heroBox || !window.marketData) return;
    const m = getActiveMember();
    if (!m) return;
    const cap = evaluateMemberCaptaincy(m);
    const esc = window.escapeHtml;
    const existing = heroBox.querySelector('.v8-kasam-wallet-strip');
    if (existing) existing.remove();

    const strip = document.createElement('div');
    strip.className = 'stat-box v8-kasam-wallet-strip';
    strip.style.cssText = 'margin-bottom:10px;padding:10px 12px;border-color:rgba(59,130,246,0.28);background:rgba(14,19,32,0.92);';
    strip.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;">
          <strong style="color:#fff;">Aktif Kasa: ${esc(m.name)}</strong>
          <span class="chg-pill info num-tab">Serbest Nakit: ${window.fmtTL(cap.freeCashTL, 0)}</span>
          ${cap.t2CashTL > 0 ? `<span class="chg-pill warn num-tab">T+2 Takasta: ${window.fmtTL(cap.t2CashTL, 0)}</span>` : ''}
          ${cap.pendingOrdTL > 0 ? `<span class="chg-pill muted num-tab">Bekleyen Emir: ${window.fmtTL(cap.pendingOrdTL, 0)}</span>` : ''}
          <span class="dim num-tab" style="font-size:11px;">Maaş Günü: Her ayın ${m.salaryDay || 1}’i (+${window.fmtCompactTL(m.monthlySalarySaveTL || 0)})</span>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn-secondary" style="height:29px;font-size:11.5px;padding:0 10px;" onclick="window.AetherExp.openMemberSwitcherSheet()">Kişi Değiştir</button>
          <button class="btn-emerald" style="height:29px;font-size:11.5px;padding:0 10px;" onclick="window.AetherExp.shareFamilyToWhatsApp()">Aileyle Paylaş</button>
        </div>
      </div>
    `;
    heroBox.prepend(strip);
  }

  // Mevcut çekmecelere (69 Araç & 619 Şirket) 360° Mazot->Domates Bağlantı Ağını ve Gerçek Emir Butonunu Enjekte Et
  function installHooks() {
    const origPersist = window.persistPortfolio;
    if (typeof origPersist === 'function' && !origPersist.__v8Wrapped) {
      const wrappedPersist = function () {
        origPersist();
        if (window.__aetherV8Booted && !__v8SyncGuard) {
          syncActiveMemberWithGlobalKasam(true);
          renderHeaderMemberBadge();
        }
      };
      wrappedPersist.__v8Wrapped = true;
      window.persistPortfolio = wrappedPersist;
    }

    const origRenderPf = window.renderPortfoyView;
    if (typeof origRenderPf === 'function' && !origRenderPf.__v8Wrapped) {
      const wrappedRenderPf = function () {
        origRenderPf();
        injectKasamWalletStrip();
      };
      wrappedRenderPf.__v8Wrapped = true;
      window.renderPortfoyView = wrappedRenderPf;
    }

    const origAssetDrawer = window.openAssetDetailDrawer;
    if (typeof origAssetDrawer === 'function' && !origAssetDrawer.__v8Wrapped) {
      const wrappedAsset = function (instId) {
        origAssetDrawer(instId);
        const panel = document.getElementById('sheetContent');
        if (!panel) return;
        const head = panel.querySelector('.sheet-head');
        if (head && !panel.querySelector('.v8-eco-injected')) {
          const holder = document.createElement('div');
          holder.className = 'v8-eco-injected';
          holder.innerHTML = buildEntityEcosystem360Html('inst', instId);
          head.insertAdjacentElement('afterend', holder);
        }
        const primaryBtn = panel.querySelector('.btn-primary');
        if (primaryBtn && !String(window.instById?.get(instId)?.unitLabel || '').includes('Puan')) {
          primaryBtn.textContent = 'Gerçek Kurallarla Kasama Al';
          primaryBtn.setAttribute('onclick', `window.AetherExp.openQuickRealOrderSheet('inst','${instId}')`);
        }
      };
      wrappedAsset.__v8Wrapped = true;
      window.openAssetDetailDrawer = wrappedAsset;
    }

    const origBistDrawer = window.openBistDetailDrawer;
    if (typeof origBistDrawer === 'function' && !origBistDrawer.__v8Wrapped) {
      const wrappedBist = function (ticker) {
        origBistDrawer(ticker);
        const panel = document.getElementById('sheetContent');
        if (!panel) return;
        const head = panel.querySelector('.sheet-head');
        if (head && !panel.querySelector('.v8-eco-injected')) {
          const holder = document.createElement('div');
          holder.className = 'v8-eco-injected';
          holder.innerHTML = buildEntityEcosystem360Html('bist', ticker);
          head.insertAdjacentElement('afterend', holder);
        }
        const primaryBtn = panel.querySelector('.btn-primary');
        if (primaryBtn) {
          primaryBtn.textContent = 'Gerçek Seans Kuralıyla Ortak Ol';
          primaryBtn.setAttribute('onclick', `window.AetherExp.openQuickRealOrderSheet('bist','${ticker}')`);
        }
      };
      wrappedBist.__v8Wrapped = true;
      window.openBistDetailDrawer = wrappedBist;
    }

    const origHoldSheet = window.openPfHoldingActionSheet;
    if (typeof origHoldSheet === 'function' && !origHoldSheet.__v8Wrapped) {
      const wrappedHold = function (uid) {
        origHoldSheet(uid);
        const panel = document.getElementById('sheetContent');
        if (!panel) return;
        const dangerBtn = panel.querySelector('.btn-danger');
        if (dangerBtn) {
          dangerBtn.textContent = 'Gerçek Piyasa Kuralıyla Sat / Bozdur (T+2 / Makas)';
          dangerBtn.setAttribute('onclick', `window.AetherExp.executeRealTurkishOrder({side:'sell',holdUid:'${uid}',whyReason:'Kasadan satış'})`);
        }
      };
      wrappedHold.__v8Wrapped = true;
      window.openPfHoldingActionSheet = wrappedHold;
    }

    const origApplyData = window.applyMarketDataToUI;
    if (typeof origApplyData === 'function' && !origApplyData.__v8Wrapped) {
      const wrappedApply = function (data, statusLabel, isLive) {
        origApplyData(data, statusLabel, isLive);
        if (!window.__aetherV8Booted) {
          window.__aetherV8Booted = true;
          loadFamilyState();
        }
        for (const m of familyState.members) settleRealTimeMemberWallet(m, Date.now());
        renderAllExperienceSurfaces();
      };
      wrappedApply.__v8Wrapped = true;
      window.applyMarketDataToUI = wrappedApply;
    }
  }

  // Her 15 saniyede bir gerçek İstanbul saatini, seans geçişlerini (09:55, 10:00, 13:30, 17:30, 18:10, 19:00), T+2 takasları ve aile sunucusunu sessizce kontrol et
  setInterval(() => {
    if (!window.marketData) return;
    for (const m of familyState.members) settleRealTimeMemberWallet(m, Date.now());
    renderAllExperienceSurfaces();
  }, 15000);

  setInterval(() => {
    if (!document.hidden && window.marketData) pullFamilyFromLocalServer();
  }, 30000);

  window.addEventListener('hashchange', () => {
    importFamilyFromUrlHash();
    renderAllExperienceSurfaces();
  });

  function postFamilyBanterNote(msg) {
    const m = getActiveMember();
    if (!m || !msg) return;
    m.activityFeed.unshift({
      ts: Date.now(),
      action: 'Çay Masası Notu',
      detail: String(msg).slice(0, 220),
      why: 'Aile içi muhabbet'
    });
    saveFamilyState(true);
    renderAllExperienceSurfaces();
    if (window.showToast) window.showToast('Notun aile çay masasına bırakıldı');
  }

  function recordJourneyGraduation(summary) {
    const m = getActiveMember();
    if (!m || !summary) return;
    m.storyChoices['journey_10y_done'] = summary.finalBags;
    if (summary.finalBags >= 120) {
      m.stats.smartRawReads = (m.stats.smartRawReads || 0) + 2;
      m.stats.calmScore = Math.min(100, (m.stats.calmScore || 65) + 8);
    }
    m.activityFeed.unshift({
      ts: Date.now(),
      action: `10 Yıllık Fırtına Sınavını Bitirdi (${window.fmtNum(summary.finalBags, 0)} File)`,
      detail: `100 pazar filesiyle başladığı 2017–2026 Türkiye döngüsünü ${window.fmtNum(summary.finalBags, 0)} pazar filesi ve %${Math.round(summary.sleep || 80)} uyku huzuruyla tamamladı.`,
      why: (summary.lessons && summary.lessons[0]) || 'Düşe kalka bisiklet dengesi'
    });
    saveFamilyState(true);
    renderHeaderMemberBadge();
  }

  window.AetherExp = {
    getIstanbulMarketClock,
    formatCountdownShort,
    buildTodayMorningStory,
    getBistTradingRestriction,
    getEntity360Chain,
    buildEntityEcosystem360Html,
    executeRealTurkishOrder,
    openQuickRealOrderSheet,
    submitQuickBuy,
    participateInSpkIpo,
    logWatchedOpportunity,
    openFamilyMemberXraySheet,
    openMemberSwitcherSheet,
    createNewFamilyMember,
    switchActiveMember,
    toggleArchetypes,
    shareFamilyToWhatsApp,
    selectBlindPuzzleChoice,
    nextBlindPuzzle,
    getActivePuzzleIdx: () => activePuzzleIdx,
    getRevealedPuzzleChoice: () => revealedPuzzleChoice,
    postFamilyBanterNote,
    recordJourneyGraduation,
    setMeydanSubMode,
    toggleMirrorDebtSim,
    unlockFogPreview,
    renderMeydanView,
    renderAllExperienceSurfaces,
    syncActiveMemberWithGlobalKasam,
    evaluateMemberCaptaincy,
    getAllBlindPuzzles
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installHooks);
  } else {
    installHooks();
  }
})();
