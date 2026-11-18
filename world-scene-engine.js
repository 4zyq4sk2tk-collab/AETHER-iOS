// ============================================================================
// WORLD SCENE ENGINE — TAM EKRAN 2.5B YAŞAYAN TÜRKİYE DÜNYASI VE DOKUNSAL MEKÂNLAR
// Sıfır Dashboard · Sıfır Tablo · Sıfır Emoji · %100 Görsel Nedensellik & Ses
// ============================================================================
(function (global) {
  'use strict';

  const WORLD_W = 2360;
  const WORLD_H = 1420;
  const AUDIO_MUTE_KEY = 'aether_world_audio_muted_v1';
  const LENS_STORAGE_KEY = 'aether_world_language_lens_v1';

  const TR_WEEKDAYS = [
    'Pazar',
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi'
  ];

  // --------------------------------------------------------------------------
  // 1. PROSEDÜREL WEB AUDIO API SES MOTORU (SIFIR HARİCİ DOSYA, DOKUNSAL SESLER)
  // --------------------------------------------------------------------------
  const WorldAudio = (function () {
    let ctx = null;
    let muted = false;
    try {
      muted = global.localStorage?.getItem(AUDIO_MUTE_KEY) === '1';
    } catch (_) {}

    function ensureCtx() {
      if (muted) return null;
      const AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) {
        try { ctx = new AC(); } catch (_) { return null; }
      }
      if (ctx && ctx.state === 'suspended') {
        try { ctx.resume(); } catch (_) {}
      }
      return ctx;
    }

    function playTone(freq, endFreq, dur, type, peakGain, delaySec = 0) {
      const c = ensureCtx();
      if (!c) return;
      try {
        const now = c.currentTime + delaySec;
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, now);
        if (endFreq && endFreq !== freq) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + dur);
        }
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(peakGain || 0.06, now + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(g);
        g.connect(c.destination);
        osc.start(now);
        osc.stop(now + dur + 0.02);
      } catch (_) {}
    }

    function playNoiseBurst(dur, filterFreq, filterQ, peakGain) {
      const c = ensureCtx();
      if (!c) return;
      try {
        const len = Math.max(1, Math.floor(c.sampleRate * dur));
        const buf = c.createBuffer(1, len, c.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / len);
        }
        const src = c.createBufferSource();
        src.buffer = buf;
        const biq = c.createBiquadFilter();
        biq.type = 'bandpass';
        biq.frequency.value = filterFreq || 1200;
        biq.Q.value = filterQ || 1.8;
        const g = c.createGain();
        g.gain.setValueAtTime(peakGain || 0.05, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
        src.connect(biq);
        biq.connect(g);
        g.connect(c.destination);
        src.start();
      } catch (_) {}
    }

    return {
      unlock() { ensureCtx(); },
      isMuted() { return muted; },
      setMuted(val) {
        muted = Boolean(val);
        try { global.localStorage?.setItem(AUDIO_MUTE_KEY, muted ? '1' : '0'); } catch (_) {}
        return muted;
      },
      toggle() {
        return this.setMuted(!muted);
      },
      bell() {
        playTone(880, 880, 0.36, 'triangle', 0.065, 0);
        playTone(1318.5, 1318.5, 0.42, 'sine', 0.045, 0.05);
      },
      coin() {
        playTone(1760, 1820, 0.18, 'sine', 0.06, 0);
        playTone(2637, 2680, 0.28, 'sine', 0.05, 0.065);
      },
      shutter() {
        playNoiseBurst(0.18, 320, 1.2, 0.07);
        playTone(118, 52, 0.22, 'triangle', 0.08, 0);
      },
      sand() {
        playNoiseBurst(0.28, 2900, 2.4, 0.035);
      },
      water() {
        playTone(460, 880, 0.16, 'sine', 0.045, 0);
      },
      horn() {
        playTone(146.8, 144, 0.48, 'triangle', 0.045, 0);
        playTone(220, 218, 0.48, 'sine', 0.03, 0.02);
      },
      knock() {
        playTone(170, 95, 0.15, 'triangle', 0.075, 0);
      },
      softClick() {
        playTone(540, 620, 0.07, 'sine', 0.03, 0);
      }
    };
  })();

  // --------------------------------------------------------------------------
  // 2. GÜVENLİ YARDIMCILAR VE İNSAN DİLİ <-> GERÇEK HAYAT KÖPRÜSÜ ÇEVİRİCİSİ
  // --------------------------------------------------------------------------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtTL(n) {
    return Math.round(Number(n) || 0).toLocaleString('tr-TR') + ' TL';
  }

  function fmtUnitTL(n) {
    const v = Number(n) || 0;
    if (v >= 1000) return Math.round(v).toLocaleString('tr-TR') + ' TL';
    return v.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  // Sıfır finans bilgisi olan insan için yerleşik sözlük (HumanWisdomBridge yedeği ve zenginleştiricisi)
  const PLAIN_ASSET_LEXICON = {
    'gram-altin-spot': {
      plainName: 'Taş Han Fiziki Gram Altın',
      everydayRole: 'Yastık altı somut maden; enflasyona ve kağıt paranın erimesine karşı bin yıllık çapa.',
      realWorldWhere: 'Kapalıçarşı sarrafları veya kuyumcudan elden alınan 24 ayar gram külçe.'
    },
    'ceyrek-altin': {
      plainName: 'Sarraf Çeyrek Altını',
      everydayRole: 'Düğün ve ev kilerinin küçük parçalı fiziki altın birikimi.',
      realWorldWhere: 'Kuyumcu vitrinindeki Darphane baskılı fiziki çeyrek altın.'
    },
    'cumhuriyet-altini': {
      plainName: 'Cumhuriyet Ata Altını',
      everydayRole: 'Uzun yıllar bozulmadan saklanan ağır fiziki aile altını.',
      realWorldWhere: 'Sarraf ve kuyumcularda Darphane baskılı Ata Lira.'
    },
    'bilezik-22-ayar': {
      plainName: '22 Ayar İşçiliksiz Bilezik',
      everydayRole: 'Kolda taşınabilen fiziki altın kileri.',
      realWorldWhere: 'Kuyumcularda gramla tartılan 22 ayar burma/ajda bilezik.'
    },
    'gram-gumus-spot': {
      plainName: 'Fiziki Gram Gümüş Külçesi',
      everydayRole: 'Hem güneş paneli sanayisinde kullanılan hem sarrafta saklanan parlak maden.',
      realWorldWhere: 'Kapalıçarşı gümüşçüleri veya banka gümüş hesabı.'
    },
    'altin-sertifikasi': {
      plainName: 'Borsa Kağıt Altın Kuponu',
      everydayRole: 'Borsada alınıp satılan altın kağıdı; talep şiştiğinde gerçek altından pahalıya (hava parasıyla) satılabilir!',
      realWorldWhere: 'Banka/aracı kurum borsa ekranında ALTIN.S1 (Darphane Altın Sertifikası).'
    },
    'kira-sertifikasi-sukuk': {
      plainName: 'Devlet Kira Kalkanı (Vergisiz)',
      everydayRole: 'Paranı devlete kiraya verip vergi kesintisi olmadan düzenli kira aldığın sağlam taş kalkan.',
      realWorldWhere: 'Banka uygulamasındaki Hazine Kira Sertifikası (Sukuk) veya Kira Sertifikası Fonları.'
    },
    'para-piyasasi-fonu': {
      plainName: 'Günlük Nöbetçi Nakit Sepeti',
      everydayRole: 'Boşta duran paranın gecelik erimesini yavaşlatan, iş günü 13:30 öncesinde hemen bozulabilen nöbetçi kasa.',
      realWorldWhere: 'Tüm mobil bankalarda Yatırım Fonları -> Para Piyasası Fonu (PPF).'
    },
    'mevduat-ust': {
      plainName: 'Mühürlü Vadeli Banka Kavanozu',
      everydayRole: 'Süresi dolana kadar kapağını açmama sözüyle faiz biriktiren cam kavanoz; erken açarsan tüm biriken yanar!',
      realWorldWhere: 'Mobil bankacılık Vadeli TL Mevduat Hesabı (32 / 92 / 181 / 366 gün).'
    },
    'dibs-tahvil': {
      plainName: 'Devlet Uzun Vade Senedi',
      everydayRole: 'Hazineye verilen borç senedi; faizler düştüğünde senedin kendi değeri değerlenir.',
      realWorldWhere: 'Banka uygulaması Devlet İç Borçlanma Senetleri (DİBS / Tahvil).'
    },
    'doviz-usd': {
      plainName: 'Amerikan Doları Gişesi',
      everydayRole: 'İthal hammadde ve küresel ticaret parası; ama ABD enflasyonu karşısında kendi içinde de erir.',
      realWorldWhere: 'Döviz bürosu fiziki gişesi veya mobil banka USD hesabı.'
    },
    'doviz-eur': {
      plainName: 'Avrupa Eurosu Gişesi',
      everydayRole: 'Kocaeli ve Bursa fabrikalarının Avrupa’ya mal satarken tahsil ettiği ihracat parası.',
      realWorldWhere: 'Döviz bürosu veya mobil banka EUR hesabı.'
    },
    'reel-perakende-bimas': {
      plainName: 'Mahalle Peşin İndirim Marketi',
      everydayRole: 'Müşteriden parayı kasada peşin alıp toptancıya vadeli ödeyen, binlerce şubeli mahalle marketi ortaklığı.',
      realWorldWhere: 'Borsa İstanbul pay senedi: BİM Mağazalar (BIST:BIMAS).'
    },
    'reel-perakende-mgros': {
      plainName: 'Büyük Şehir Süpermarket Ağı',
      everydayRole: 'Hem sokak mağazası hem eve sipariş kuryesiyle her gün sıcak kasa nakdi toplayan market zinciri.',
      realWorldWhere: 'Borsa İstanbul pay senedi: Migros Ticaret (BIST:MGROS).'
    },
    'bist-tuprs': {
      plainName: 'İzmit Mazot ve Benzin Rafinerisi',
      everydayRole: 'Gemilerle gelen ham petrolü kamyon mazotuna ve uçak yakıtına çeviren dev enerji kazanı.',
      realWorldWhere: 'Borsa İstanbul pay senedi: Tüpraş Rafineri (BIST:TUPRS).'
    },
    'bist-froto': {
      plainName: 'Kocaeli Ticari Kamyon & İhracat Fabrikası',
      everydayRole: 'Banttan indirdiği 10 ticari aracın 8’ini gemiyle Avrupa’ya Euro karşılığı satan üretim devi.',
      realWorldWhere: 'Borsa İstanbul pay senedi: Ford Otosan (BIST:FROTO).'
    },
    'bist-thyao': {
      plainName: 'Kıtalararası Bayrak Taşıyıcı Havayolu',
      everydayRole: '130 ülkeye dolar ve euro ile uçak bileti ve hava kargosu satan küresel uçuş filosu.',
      realWorldWhere: 'Borsa İstanbul pay senedi: Türk Hava Yolları (BIST:THYAO).'
    },
    'bist-eregl': {
      plainName: 'Yüksek Fırın Yassı Çelik Ocağı',
      everydayRole: 'Otomobil kaportasından buzdolabına kadar her fabrikanın mecbur olduğu ana çelik sac üreticisi.',
      realWorldWhere: 'Borsa İstanbul pay senedi: Erdemir Demir Çelik (BIST:EREGL).'
    },
    'bist-asels': {
      plainName: 'Ankara Radar ve Savunma Atölyesi',
      everydayRole: 'Yıllara yayılan kesinleşmiş radar, haberleşme ve savunma elektroniği siparişleri üreten mühendislik üssü.',
      realWorldWhere: 'Borsa İstanbul pay senedi: Aselsan (BIST:ASELS).'
    },
    'reel-enerji-astor': {
      plainName: 'Şebeke Trafo Fabrikası',
      everydayRole: 'Şehirlerin ve güneş santrallerinin elektriğini taşıyan dev trafoları üretip ihraç eden fabrika.',
      realWorldWhere: 'Borsa İstanbul pay senedi: Astor Enerji (BIST:ASTOR).'
    },
    'abd-sp500-spy': {
      plainName: 'Dünya 500 Dev Şirket Sepeti',
      everydayRole: 'Amerika’daki en büyük 500 şirkete tek sepette dolar bazlı ortaklık.',
      realWorldWhere: 'Yurt dışı borsa ekranı: S&P 500 ETF (SPY — satışta Yİ-ÜFE endeksli beyana tabi).'
    }
  };

  const SECTOR_HUMAN_DESC = {
    'Gıda, İçecek & Tarım': 'Tarladan mutfak rafına uzanan gıda ve içecek üretim atölyesi',
    'Ticaret & Perakende': 'Sokak ve AVM kasalarından günlük sıcak nakit toplayan mağaza zinciri',
    'Otomotiv & Yan Sanayi': 'Araç, aks, fren ve ihracat parçası üreten sanayi fabrikası',
    'Enerji, Elektrik & Gaz': 'Elektrik üretimi, güneş paneli ve enerji dağıtım santrali',
    'Kimya, İlaç & Petrol': 'Rafineri, petrokimya, gübre ve ilaç hammaddesi tesisi',
    'Demir-Çelik & Metal Sanayi': 'Yüksek fırın çelik, boru ve sanayi metali ocağı',
    'Taş, Toprak & Çimento': 'İnşaat ve altyapılar için çimento, cam ve seramik ocağı',
    'Ulaştırma, Havacılık & Lojistik': 'Yolcu uçağı, havalimanı yer hizmeti ve kargo taşımacılığı',
    'Teknoloji, Yazılım & Savunma': 'Yazılım, radar ve yüksek teknoloji mühendislik atölyesi',
    'Bankacılık & Mevduat': 'Kredi, mevduat ve ödeme gişesi işleten banka kurumu',
    'Gayrimenkul (GYO) & İnşaat': 'Konut, iş merkezi ve kira geliri üreten gayrimenkul ortaklığı',
    'Holding & Çoklu Yatırım': 'Birden fazla fabrika ve sektörü aynı çatı altında toplayan çatı ortaklık'
  };

  function formatPlainLensText(rawText) {
    const s = String(rawText || '');
    if (!s || languageLens === 'BRIDGE') return s;
    let out = s;
    try {
      if (global.HumanWisdomBridge && typeof global.HumanWisdomBridge.sanitizeSokakText === 'function') {
        out = global.HumanWisdomBridge.sanitizeSokakText(out);
      }
    } catch (_) {}
    return out
      .replace(/\bALTIN\.S1\b/gi, 'kağıt altın kuponu')
      .replace(/\bTEFAS\b/gi, 'ortak kasa gişesi')
      .replace(/\bBIST\b/gi, 'atölye pazarı')
      .replace(/\bBSMV\b/gi, 'gişe kesintisi')
      .replace(/\bVBTS\b/gi, 'tedbir kuralı')
      .replace(/\bBYF\b/gi, 'ortak sepet')
      .replace(/\bETF\b/gi, 'ortak sepet')
      .replace(/\bVİOP\b/gi, 'vadeli sözleşme')
      .replace(/\bDİBS\b/gi, 'hazine senedi')
      .replace(/\bSukuk\b/gi, 'kira kalkanı')
      .replace(/valör fiyatından/gi, 'kurye sırası fiyatından')
      .replace(/valör kuralı/gi, '13:30 kurye saati kuralı')
      .replace(/\bvalörlü\b/gi, 'kurye sıralı')
      .replace(/\bvalör\b/gi, 'kurye sırası')
      .replace(/portföye/gi, 'kilere')
      .replace(/portföy/gi, 'kiler')
      .replace(/\bstopajlı\b/gi, 'gelir kesintili')
      .replace(/\bstopaj\b/gi, 'gelir kesintisi')
      .replace(/\blot\/pay\b/gi, 'pay')
      .replace(/\blot\b/gi, 'pay');
  }

  function describeAssetHumanSafe(asset, lens) {
    if (!asset) {
      return {
        displayTitle: 'Atölye',
        subLabel: '',
        realName: '',
        everydayRole: '',
        realWorldWhere: ''
      };
    }
    const useBridge = lens === 'BRIDGE';
    let bridgeInfo = null;
    try {
      if (global.HumanWisdomBridge && typeof global.HumanWisdomBridge.describeAssetForHuman === 'function') {
        bridgeInfo = global.HumanWisdomBridge.describeAssetForHuman(asset.key || asset.id, lens);
      }
    } catch (_) {}

    const lex = PLAIN_ASSET_LEXICON[asset.key] || PLAIN_ASSET_LEXICON[asset.id] || null;
    const cleanCompanyName = String(asset.name || asset.ticker || 'Atölye')
      .replace(/\bA\.Ş\.?\b/gi, '')
      .replace(/\bSANAYİ VE TİCARET\b/gi, '')
      .trim();

    let plainName = '';
    if (bridgeInfo && typeof bridgeInfo === 'object') {
      plainName = bridgeInfo.humanTitle || bridgeInfo.plainTitle || bridgeInfo.plainName || bridgeInfo.title || '';
    } else if (typeof bridgeInfo === 'string' && bridgeInfo.trim()) {
      plainName = bridgeInfo.trim();
    }
    if (!plainName) {
      if (lex) {
        plainName = lex.plainName;
      } else if (asset.subVenue === 'BIST_STOCK') {
        plainName = `${cleanCompanyName} Atölyesi`;
      } else {
        plainName = cleanCompanyName;
      }
    }

    const sectorPlain = SECTOR_HUMAN_DESC[asset.categoryName]
      || (asset.isRateInstrument ? 'Vade ve kira kalkanı aracı' : 'Üretim ve ticaret ortaklığı');

    const everydayRole = (bridgeInfo && typeof bridgeInfo === 'object' && (bridgeInfo.streetEssence || bridgeInfo.everydayAnalogy || bridgeInfo.plainSummary || bridgeInfo.description))
      || (lex && lex.everydayRole)
      || `${sectorPlain}. İnsanların günlük ihtiyacını üreterek kasasına fatura geliri toplar.`;

    const realWorldWhere = (bridgeInfo && typeof bridgeInfo === 'object' && (bridgeInfo.realLifeActionGuide?.whereToAct || bridgeInfo.whereToFind || bridgeInfo.realWorldWhere || bridgeInfo.realCounterpart))
      || (lex && lex.realWorldWhere)
      || (asset.venue === 'BIST'
        ? `Banka ve aracı kurumların Borsa İstanbul ekranında "${asset.ticker}" koduyla işlem gören gerçek şirket payı.`
        : asset.venue === 'TEFAS'
          ? `Tüm Türkiye bankalarının Yatırım Fonları (TEFAS) menüsünde işlem gören fon.`
          : asset.venue === 'TWO_DOOR'
            ? `Fiziki olarak Kapalıçarşı/kuyumcuda veya kaydi olarak mobil banka döviz/altın hesabında bulunur.`
            : `${asset.name} (${asset.symbol || asset.ticker})`);

    const displayTitle = useBridge
      ? `${plainName} · ${asset.ticker || asset.name}`
      : plainName;

    const subLabel = useBridge
      ? `${asset.name} (${asset.symbol || asset.ticker}) · ${asset.categoryName || ''}`
      : everydayRole;

    return {
      displayTitle,
      plainName,
      subLabel,
      realName: `${asset.name} (${asset.symbol || asset.ticker})`,
      everydayRole,
      realWorldWhere
    };
  }

  // --------------------------------------------------------------------------
  // 3. YAŞAYAN KASABA MEKÂNLARI (14 GERÇEK MİMARİ YAPI + 4 SİS İSKELESİ)
  // --------------------------------------------------------------------------
  const WORLD_LANDMARKS = [
    {
      id: 'bizim-ev',
      x: 440, y: 925, hitR: 92,
      kind: 'home',
      plainTitle: 'Bizim Ev & Erzak Dolabı',
      bridgeTitle: 'Bizim Ev · Net Kiler & T+2 Kum Saati',
      plainHint: '5 raflı kışlık erzak dolabın, ahşap masadaki nakdin ve mühürlü kavanozların'
    },
    {
      id: 'cay-masasi',
      x: 640, y: 985, hitR: 74,
      kind: 'tea',
      plainTitle: 'Bahçe Çay Masası (Ailem)',
      bridgeTitle: 'Aile Çay Masası · Ortak Salon & Eşitleme',
      plainHint: 'Semaver başında ailenin açık sepetleri, fırtına kaptanı ve telefon eşitleme'
    },
    {
      id: 'mahalle-firini',
      x: 885, y: 855, hitR: 88,
      kind: 'shop',
      plainTitle: 'Mahalle Fırını & Peşin Market',
      bridgeTitle: 'Fırın & Peşin Market (BİM · MGROS · TABGD)',
      plainHint: 'Sıcak ekmek kasası, peşin tahsilat ve mazotun mutfak etiketine etkisi',
      primaryKeys: ['reel-perakende-bimas', 'reel-perakende-mgros', 'halka-arz-tabgd', 'emtia-tarim-dba'],
      bistSectors: ['Gıda, İçecek & Tarım', 'Ticaret & Perakende']
    },
    {
      id: 'tas-han-sarraf',
      x: 1140, y: 780, hitR: 86,
      kind: 'shop',
      plainTitle: 'Taş Han Sarrafı',
      bridgeTitle: 'Kapalıçarşı Fiziki Altın vs ALTIN.S1 Terazisi',
      plainHint: 'Akşam 18:30 demir kepengi ve fiziki külçe ile kağıt kupon terazisi',
      primaryKeys: ['gram-altin-spot', 'ceyrek-altin', 'cumhuriyet-altini', 'bilezik-22-ayar', 'gram-gumus-spot', 'altin-sertifikasi'],
      bistSectors: ['Madencilik & Kıymetli Metal']
    },
    {
      id: 'cam-kule-hazine',
      x: 1390, y: 705, hitR: 90,
      kind: 'shop',
      plainTitle: '7/24 Cam Kule & Kira Kalkanı',
      bridgeTitle: 'Mobil Banka Makası & %0 Stopajlı Hazine Sukuk',
      plainHint: 'Gece açılan banka makası ile vergisiz Devlet Kira Kalkanı yan yana',
      primaryKeys: ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust', 'dibs-tahvil', 'doviz-usd', 'doviz-eur'],
      bistSectors: ['Bankacılık & Mevduat']
    },
    {
      id: 'anadolu-baraji',
      x: 965, y: 395, hitR: 92,
      kind: 'shop',
      plainTitle: 'Anadolu Barajı & Buğday Tepesi',
      bridgeTitle: 'Baraj Rezervi, Tarım & Gıda Zinciri',
      plainHint: 'Yağmurla dolan baraj gölü, başak tarlası ve traktör bereketi',
      primaryKeys: ['emtia-tarim-dba', 'reel-perakende-bimas', 'bist-ulker', 'bist-tatgd', 'bist-hekts'],
      bistSectors: ['Gıda, İçecek & Tarım']
    },
    {
      id: 'izmit-rafineri',
      x: 1655, y: 675, hitR: 88,
      kind: 'shop',
      plainTitle: 'İzmit Rafinerisi & Enerji',
      bridgeTitle: 'Rafineri & Trafo Santrali (TUPRS · ASTOR · CWENE)',
      plainHint: 'Mazot tankerlerinin çıkış kapısı, güneş panelleri ve elektrik trafoları',
      primaryKeys: ['bist-tuprs', 'reel-enerji-astor', 'reel-enerji-cwene', 'emtia-petrol-bno'],
      bistSectors: ['Enerji, Elektrik & Gaz', 'Kimya, İlaç & Petrol']
    },
    {
      id: 'kocaeli-liman',
      x: 1875, y: 900, hitR: 95,
      kind: 'shop',
      plainTitle: 'Kocaeli İhracat Limanı',
      bridgeTitle: 'İhracat Limanı & Otomotiv (FROTO · TOASO · EGEEN)',
      plainHint: 'Avrupa’ya araç götürüp yeşil döviz sandığıyla dönen gemiler',
      primaryKeys: ['bist-froto', 'bist-toaso', 'bist-egeen', 'bist-parsn', 'bist-kords', 'bist-arclk'],
      bistSectors: ['Otomotiv & Yan Sanayi', 'Makine & Sanayi Üretimi', 'Ev Eşyası, Tekstil & Tüketim']
    },
    {
      id: 'celik-ocaklari',
      x: 1925, y: 540, hitR: 84,
      kind: 'shop',
      plainTitle: 'Çelik & Şantiye Ocakları',
      bridgeTitle: 'Demir-Çelik, Cam & Çimento (EREGL · SISE · CIMSA)',
      plainHint: 'Sönmeyen yüksek fırın, sanayi sacı, cam ve şantiye betonu',
      primaryKeys: ['bist-eregl', 'bist-sise', 'bist-cimsa', 'gayrimenkul-konut-ekgyo', 'gayrimenkul-ticari-rygyo'],
      bistSectors: ['Demir-Çelik & Metal Sanayi', 'Taş, Toprak & Çimento', 'Gayrimenkul (GYO) & İnşaat']
    },
    {
      id: 'havalimani',
      x: 470, y: 535, hitR: 90,
      kind: 'shop',
      plainTitle: 'Kıtalararası Havalimanı',
      bridgeTitle: 'Havacılık & Döviz Gişesi (THYAO · PGSUS · TAVHL)',
      plainHint: 'Dövizle bilet kesip dünyaya uçan jetler ve pist kulesi',
      primaryKeys: ['bist-thyao', 'bist-pgsus', 'bist-tavhl', 'bist-clebi'],
      bistSectors: ['Ulaştırma, Havacılık & Lojistik', 'Turizm, Medya & Hizmet']
    },
    {
      id: 'ankara-radar',
      x: 1445, y: 395, hitR: 84,
      kind: 'shop',
      plainTitle: 'Ankara Radar & Yazılım Tepesi',
      bridgeTitle: 'Savunma, Yazılım & Küresel Teknoloji (ASELS · LOGO · SPY)',
      plainHint: 'Dönen radar çanağı, uzun vadeli mühendislik ve dünya teknoloji sepeti',
      primaryKeys: ['bist-asels', 'halka-arz-altny', 'reel-yazilim-logo', 'abd-sp500-spy', 'abd-nasdaq-qqq', 'kuresel-hisse-nvda'],
      bistSectors: ['Teknoloji, Yazılım & Savunma', 'Telekomünikasyon']
    },
    {
      id: 'dedikodu-meydani',
      x: 1205, y: 1035, hitR: 80,
      kind: 'shop',
      plainTitle: 'Gürültülü Dedikodu Meydanı',
      bridgeTitle: 'Sürü Tuzağı & Megafon Anomalisi Tahtaları',
      plainHint: 'Sallanan tahta iskelede megafonla bağırılan dedikodu hisseleri',
      primaryKeys: ['altin-sertifikasi', 'bist-sasa', 'kripto-btc'],
      bistSectors: ['Holding & Çoklu Yatırım'],
      isHerdSquare: true
    },
    {
      id: 'zaman-istasyonu',
      x: 245, y: 735, hitR: 88,
      kind: 'train',
      plainTitle: 'Zaman İstasyonu (10 Yıl Treni)',
      bridgeTitle: '10 Yıllık Gerçek Türkiye Fırtına Tüneli (120 Ay)',
      plainHint: 'Bin trene, 10 yıllık gerçek Türkiye fırtınalarını bizzat yaşa'
    },
    {
      id: 'tatbikat-okulu',
      x: 1535, y: 1035, hitR: 84,
      kind: 'school',
      plainTitle: 'Gerçek Hayat Tatbikat Okulu',
      bridgeTitle: 'Uygulamalı Hayat & Karar Tatbikat Atölyesi',
      plainHint: 'Paranı riske atmadan gerçek hayat tuzaklarını ellerinle dene'
    },
    // --- ORGANİK YAŞAYAN SİS BÖLGELERİ (DOĞU İSKELESİ — HİLE BUTONU YOKTUR) ---
    {
      id: 'mist-balina',
      x: 1995, y: 745, hitR: 72,
      kind: 'mist',
      milestoneKey: 'executedRealOrder',
      plainTitle: 'Sessiz Kargo İskelesi',
      bridgeTitle: 'MKK Sessiz Pay Toplama İskelesi',
      fogWhisper: 'Bu iskeledeki sis, kasabadaki herhangi bir dükkândan ilk gerçek alım veya kavanoz kararını verdiğinde kendiliğinden dağılır.',
      primaryKeys: ['bist-100', 'fon-yerli-hisse-zpbdl', 'fon-katilim-z30kp'],
      bistSectors: ['Holding & Çoklu Yatırım']
    },
    {
      id: 'mist-valor',
      x: 2010, y: 590, hitR: 72,
      kind: 'mist',
      milestoneKey: 'waitedSettlementOrValor',
      plainTitle: 'Kum Saati Feneri',
      bridgeTitle: 'T+2 Takas & 13:30 Valör Deniz Feneri',
      fogWhisper: 'Bu deniz fenerinin sisi, bir kum saati süresini veya öğlen 13:30 kurye saatini sabırla beklediğinde kendiliğinden açılır.',
      primaryKeys: ['bist-temettu-25', 'fon-yerli-bist30-apx30', 'eurobond-usdtr'],
      bistSectors: ['Sigorta & Emeklilik']
    },
    {
      id: 'mist-kasa',
      x: 2005, y: 935, hitR: 72,
      kind: 'mist',
      milestoneKey: 'inspectedCashScale',
      plainTitle: 'Arka Mutfak Kantar İskelesi',
      bridgeTitle: 'TMS-29 Gerçek Nakit vs Kağıt Kâr Kantarı',
      fogWhisper: 'Herhangi bir üretim atölyesine girip Arka Mutfak Kasa Çekmecesini incelediğinde bu kantarın sisi dağılır.',
      primaryKeys: ['reel-perakende-bimas', 'bist-froto', 'bist-sasa'],
      bistSectors: ['Kağıt, Ambalaj & Orman']
    },
    {
      id: 'mist-gumruk',
      x: 2030, y: 400, hitR: 72,
      kind: 'mist',
      milestoneKey: 'completedArenaYear',
      plainTitle: 'Uzak Gümrük Kapısı',
      bridgeTitle: 'GTİP Gümrük & 15:00 VİOP Teminat Köprüsü',
      fogWhisper: 'Zaman İstasyonundaki 10 Yıllık Trende en az bir tam yılı geride bıraktığında bu uzak gümrük kapısının sisi kalkar.',
      primaryKeys: ['viop-bist30-kontrat', 'eurobond-emb', 'kripto-btc'],
      bistSectors: ['Aracı Kurum, Faktoring & Finans']
    }
  ];

  // Şirket Bazlı Somut Hammadde -> Atölye -> Müşteri Boru Hattı
  const WORKSHOP_PIPES = {
    FROTO: {
      up: 'Yassı Çelik Sac + Mazot ve Elektrik',
      work: 'Kocaeli Ticari Kamyon & Minibüs Bandı',
      down: 'Avrupa Limanlarına Euro İle Satılan Araçlar (%80 İhracat)',
      peers: ['TOASO', 'EGEEN', 'PARSN', 'KORDS']
    },
    TOASO: {
      up: 'Çelik Sac + Yarı İletken Parça',
      work: 'Bursa Otomobil ve Hafif Ticari Montaj Hattı',
      down: 'Yurt İçi Bayiler ve Avrupa İhracat Pazarı',
      peers: ['FROTO', 'DOAS', 'OTKAR']
    },
    TUPRS: {
      up: 'Tanker Gemileriyle Gelen Ham Petrol',
      work: 'İzmit & Aliağa Dev Damıtma Kazanları',
      down: '81 İldeki Kamyon Mazotu, Benzin ve Uçak Jet Yakıtı',
      peers: ['AYGAZ', 'PETKM', 'ASTOR']
    },
    BIMAS: {
      up: 'Buğday, Süt, Yağ + Soğuk Hava Kamyon Mazotu',
      work: 'Mahalle İçi Düşük Masraflı İndirim Rafları',
      down: 'Her Akşam Peşin Dolup Taşan Mutfak Kasası',
      peers: ['MGROS', 'SOKM', 'TABGD']
    },
    MGROS: {
      up: 'Tarla Ürünleri, Taze Et/Süt + Kurye Filosu',
      work: 'Şehir Süpermarketleri ve Anında Eve Teslim Ağı',
      down: 'Peşin Kasa Tahsilatı (Tedarikçiye Vadeli Ödeme Gücü)',
      peers: ['BIMAS', 'SOKM', 'ULKER']
    },
    THYAO: {
      up: 'Havalimanı Jet Yakıtı + Uçak Bakım ve Ekip',
      work: 'Kıtalararası Yolcu ve Hava Kargo Köprüsü',
      down: '130 Ülkeden Dolar ve Euro İle Kesilen Bilet Kasası',
      peers: ['PGSUS', 'TAVHL', 'CLEBI']
    },
    EREGL: {
      up: 'Demir Cevheri + Taşkömürü Ateşi',
      work: 'Sönmeyen Yüksek Fırın ve Yassı Çelik Haddehanesi',
      down: 'Kamyon, Beyaz Eşya ve Boru Fabrikalarının Ana Sacı',
      peers: ['ISDMR', 'KRDMD', 'SISE']
    },
    ASELS: {
      up: 'Hassas Çip, Optik Mercek ve Mühendislik Emeği',
      work: 'Ankara Radar, Haberleşme ve Savunma Atölyesi',
      down: 'Yıllara Yayılan Kesinleşmiş Döviz Bazlı Sipariş Defteri',
      peers: ['ALTNY', 'LOGO', 'MIATK']
    },
    ASTOR: {
      up: 'Elektrolitik Bakır Tel + Silisli Çelik Sac',
      work: 'Yüksek Gerilim Güç Trafosu Üretim Holü',
      down: 'Şehir Elektrik Şebekeleri ve Yurt Dışı Güneş Santralleri',
      peers: ['CWENE', 'EUPWR', 'SMRTG']
    }
  };

  // --------------------------------------------------------------------------
  // 4. SAHNE DURUMU, KAMERA FİZİĞİ VE CANLI DENEY KOLLARI
  // --------------------------------------------------------------------------
  let rootEl = null;
  let hostContainer = null;
  let canvas = null;
  let ctx = null;
  let rafId = null;
  let kernelUnsub = null;
  let clockTimerId = null;
  let mistToastTimer = null;

  let languageLens = 'PLAIN'; // 'PLAIN' (Sokak Dili) | 'BRIDGE' (Gerçek Hayat Köprüsü)
  try {
    const savedLens = global.localStorage?.getItem(LENS_STORAGE_KEY);
    if (savedLens === 'BRIDGE' || savedLens === 'PLAIN') languageLens = savedLens;
  } catch (_) {}

  const cam = {
    x: 980,
    y: 800,
    zoom: 0.72,
    tx: 980,
    ty: 800,
    tz: 0.72,
    minZoom: 0.36,
    maxZoom: 1.65,
    vw: 1280,
    vh: 800,
    dpr: 1
  };

  // Mahalle Fırını & Kasaba Deney Kolları (İlk 60 Saniye Sezgisel Keşif)
  const levers = {
    dieselPct: 0, // -25 .. +50 (Mazot Pompası)
    rainPct: 0,   // -40 (Kuraklık) .. +40 (Bereketli Yağış)
    fxPct: 0      // -20 .. +50 (Döviz Rüzgârı)
  };

  let hoveredLandmarkId = null;
  let activeCompassZone = 'street';
  let activeInteriorMode = null; // null | 'HOME' | 'TEA' | 'SHOP' | 'TRAIN' | 'SCHOOL'
  let activeDistrictId = 'mahalle-firini';
  let activeAssetKey = 'reel-perakende-bimas';
  let unmaskOpen = false;
  let shopSearchQuery = '';
  let selectedDoor = 'BAZAAR';
  let selectedMaturityDays = 32;
  let lastOrderFeedback = null;
  let whisperDismissed = false;
  let expCollapsed = false;

  // Animasyon Değişkenleri
  let shutterAnim = 0; // 0 = Açık, 1 = Kapalı demir kepenk
  const roadTankers = [
    { t: 0.08, speed: 0.0014, route: 0 },
    { t: 0.54, speed: 0.0014, route: 0 },
    { t: 0.25, speed: 0.0016, route: 1 },
    { t: 0.76, speed: 0.0016, route: 1 },
    { t: 0.42, speed: 0.0012, route: 2 }
  ];

  const TANKER_PATHS = [
    // Rafineri -> Mahalle Fırını (Soğuk zincir & fırın mazotu)
    [{ x: 1630, y: 710 }, { x: 1380, y: 805 }, { x: 1140, y: 855 }, { x: 910, y: 885 }],
    // Rafineri -> Kocaeli İhracat Fabrikası
    [{ x: 1670, y: 705 }, { x: 1775, y: 790 }, { x: 1855, y: 875 }],
    // Çelik Ocakları -> Kocaeli Fabrikası (Çelik sac kamyonu)
    [{ x: 1920, y: 580 }, { x: 1900, y: 730 }, { x: 1880, y: 865 }]
  ];

  const skyClouds = [
    { x: 240, y: 120, s: 1.05, v: 0.18 },
    { x: 780, y: 95, s: 0.85, v: 0.14 },
    { x: 1360, y: 135, s: 1.15, v: 0.16 },
    { x: 1940, y: 105, s: 0.92, v: 0.13 }
  ];

  function getKernel() {
    return global.AetherKernelV10 || null;
  }

  function getLiveEvo() {
    const K = getKernel();
    const md = K ? K.getMarketData() : global.__AETHER_EMBEDDED_DATA__;
    return (md && md.worldLiveEvolution) ? md.worldLiveEvolution : {};
  }

  function computeTownSignals() {
    const K = getKernel();
    const infBase = K ? K.getAnnualInflationPct() : 44.38;
    const dInfo = K ? K.getDarphanePremiumInfo() : { premiumPct: 14.3, spotGramPrice: 6125, s1GramEquiv: 7018, diffTL: 893 };
    const clock = K ? K.getTurkishClock() : {
      hh: 11, mm: 0, weekday: 3, shortTimeStr: '11:00',
      isWeekend: false, isBizDay: true, bistCanMatchNow: true,
      grandBazaarOpen: true, bankDaytimeTight: true, bankSpreadPct: 0.65, bazaarSpreadPct: 0.40
    };

    const droughtStress = -levers.rainPct; // + ise kuraklık, - ise bereketli yağmur
    const breadBaseTL = 12.5;
    const breadDeltaPct = levers.dieselPct * 0.34 + droughtStress * 0.28 + levers.fxPct * 0.22;
    const breadSimTL = Math.max(8, +(breadBaseTL * (1 + breadDeltaPct / 100)).toFixed(1));
    const exportBoostPct = +(levers.fxPct * 0.65 - levers.dieselPct * 0.12).toFixed(1);
    const damLevel = clamp(0.62 + (levers.rainPct / 110), 0.18, 0.94);

    return {
      clock,
      infBase,
      dInfo,
      breadSimTL,
      breadDeltaPct: +breadDeltaPct.toFixed(1),
      exportBoostPct,
      damLevel,
      isRainy: levers.rainPct >= 14
    };
  }

  // --------------------------------------------------------------------------
  // 5. 2.5B ÖZEL ÇİZİM VEKTÖR MİMARİSİ (<canvas> 60FPS RENDERER)
  // --------------------------------------------------------------------------
  function drawRoundedRect(c, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + w, y, x + w, y + h, rr);
    c.arcTo(x + w, y + h, x, y + h, rr);
    c.arcTo(x, y + h, x, y, rr);
    c.arcTo(x, y, x + w, y, rr);
    c.closePath();
  }

  function pointAlongPolyline(pts, t) {
    const segs = pts.length - 1;
    const scaled = clamp(t, 0, 0.9999) * segs;
    const idx = Math.floor(scaled);
    const f = scaled - idx;
    const a = pts[idx];
    const b = pts[idx + 1];
    return {
      x: a.x + (b.x - a.x) * f,
      y: a.y + (b.y - a.y) * f,
      dx: b.x - a.x,
      dy: b.y - a.y
    };
  }

  function drawTree(c, x, y, scale, isNight) {
    c.save();
    c.translate(x, y);
    c.scale(scale, scale);
    // Gövde
    c.fillStyle = isNight ? '#3a291c' : '#65452b';
    c.fillRect(-4, -18, 8, 20);
    // Yaprak kümeleri
    c.fillStyle = isNight ? '#244734' : '#3f7d4c';
    c.beginPath();
    c.arc(0, -28, 17, 0, Math.PI * 2);
    c.arc(-11, -22, 12, 0, Math.PI * 2);
    c.arc(11, -22, 12, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = isNight ? '#2e5941' : '#559960';
    c.beginPath();
    c.arc(-3, -32, 11, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  function drawStreetLamp(c, x, y, isNight) {
    c.save();
    c.translate(x, y);
    c.strokeStyle = '#2d3136';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, -44);
    c.quadraticCurveTo(0, -52, 10, -52);
    c.stroke();

    c.fillStyle = isNight ? '#ffd97d' : '#d8dde2';
    c.beginPath();
    c.arc(11, -50, 4.5, 0, Math.PI * 2);
    c.fill();

    if (isNight) {
      const grad = c.createRadialGradient(11, -48, 2, 11, -20, 56);
      grad.addColorStop(0, 'rgba(255, 214, 112, 0.45)');
      grad.addColorStop(1, 'rgba(255, 214, 112, 0)');
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(11, -50);
      c.lineTo(-26, 8);
      c.lineTo(48, 8);
      c.closePath();
      c.fill();
    }
    c.restore();
  }

  // 1) Bizim Ev, Kiler Penceresi & T+2 Kum Saati + Bahçe Çay Masası
  function drawHomeAndTeaGarden(c, tSec, isNight, snap, memberCount) {
    // Taş Bahçe Duvarı & Çim Avlu
    c.save();
    c.fillStyle = isNight ? '#2d4732' : '#8ab661';
    c.beginPath();
    c.ellipse(525, 965, 210, 96, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = isNight ? '#575049' : '#9c8f7e';
    c.lineWidth = 6;
    c.stroke();

    drawTree(c, 335, 920, 1.15, isNight);
    drawTree(c, 535, 865, 0.95, isNight);
    drawTree(c, 715, 945, 1.05, isNight);

    // Bizim Ev Gövdesi (440, 925 merkezli)
    const hx = 365;
    const hy = 845;
    // Gölge
    c.fillStyle = 'rgba(20, 16, 12, 0.18)';
    c.beginPath();
    c.ellipse(440, 960, 95, 24, 0, 0, Math.PI * 2);
    c.fill();

    // Alt Taş Kat
    c.fillStyle = isNight ? '#877b6e' : '#c9bca8';
    c.fillRect(hx, hy + 52, 145, 56);
    // Üst Cumba / Ahşap Karkaslı Sıcak Sıva Katı
    c.fillStyle = isNight ? '#b59f84' : '#f7ead2';
    c.fillRect(hx - 6, hy, 157, 56);
    c.strokeStyle = '#6b472b';
    c.lineWidth = 3;
    c.strokeRect(hx - 6, hy, 157, 56);

    // Baca & Tütme
    c.fillStyle = '#9b472e';
    c.fillRect(hx + 112, hy - 42, 16, 30);
    for (let i = 0; i < 3; i++) {
      const puff = ((tSec * 0.45 + i * 0.33) % 1);
      c.fillStyle = `rgba(245, 240, 232, ${(1 - puff) * 0.45})`;
      c.beginPath();
      c.arc(hx + 120 + puff * 18, hy - 46 - puff * 34, 6 + puff * 9, 0, Math.PI * 2);
      c.fill();
    }

    // Kiremit Çatı
    c.fillStyle = isNight ? '#873321' : '#c84b2c';
    c.beginPath();
    c.moveTo(hx - 20, hy + 4);
    c.lineTo(hx + 72, hy - 42);
    c.lineTo(hx + 170, hy + 4);
    c.closePath();
    c.fill();
    c.strokeStyle = '#6d2515';
    c.lineWidth = 2.5;
    c.stroke();

    // Üst Kat Pencereleri (Gece Sıcak Işık)
    const winColor = isNight ? '#ffd56b' : '#7fb3d5';
    for (let wx = hx + 12; wx <= hx + 104; wx += 44) {
      c.fillStyle = winColor;
      c.fillRect(wx, hy + 14, 26, 26);
      c.strokeStyle = '#5c3d24';
      c.lineWidth = 2;
      c.strokeRect(wx, hy + 14, 26, 26);
    }

    // Ahşap Kapı
    c.fillStyle = '#5c3a21';
    drawRoundedRect(c, hx + 18, hy + 66, 28, 42, 6);
    c.fill();

    // Görünür Kiler Penceresi (İçindeki Kavanozlar freedomMonths'a göre dolar!)
    c.fillStyle = '#3c281a';
    c.fillRect(hx + 62, hy + 62, 68, 36);
    c.strokeStyle = '#6e492d';
    c.lineWidth = 2.5;
    c.strokeRect(hx + 62, hy + 62, 68, 36);
    // İki raf çizgisi
    c.strokeStyle = '#8e623e';
    c.beginPath();
    c.moveTo(hx + 64, hy + 80);
    c.lineTo(hx + 128, hy + 80);
    c.stroke();
    const filledJars = clamp(Math.ceil((snap.freedomMonths || 1) * 1.1), 1, 8);
    for (let j = 0; j < filledJars; j++) {
      const row = j < 4 ? 0 : 1;
      const col = j % 4;
      c.fillStyle = j % 2 === 0 ? '#f4b942' : '#d96b38';
      c.fillRect(hx + 68 + col * 15, hy + 67 + row * 16, 9, 10);
    }

    // Veranda T+2 Takas Kum Saati (Eğer T+2'de bekleyen nakit varsa parlak kum saati!)
    if ((snap.unsettledTL || 0) > 0) {
      const gx = hx - 22;
      const gy = hy + 84;
      const glow = c.createRadialGradient(gx, gy, 4, gx, gy, 34);
      glow.addColorStop(0, 'rgba(255, 198, 70, 0.65)');
      glow.addColorStop(1, 'rgba(255, 198, 70, 0)');
      c.fillStyle = glow;
      c.beginPath();
      c.arc(gx, gy, 34, 0, Math.PI * 2);
      c.fill();

      // Pirinç Çerçeve
      c.fillStyle = '#b87d24';
      c.fillRect(gx - 14, gy - 22, 28, 4);
      c.fillRect(gx - 14, gy + 18, 28, 4);
      // Cam Gövde
      c.fillStyle = 'rgba(235, 248, 255, 0.85)';
      c.beginPath();
      c.moveTo(gx - 11, gy - 18);
      c.lineTo(gx + 11, gy - 18);
      c.lineTo(gx + 2, gy);
      c.lineTo(gx + 11, gy + 18);
      c.lineTo(gx - 11, gy + 18);
      c.lineTo(gx - 2, gy);
      c.closePath();
      c.fill();
      c.strokeStyle = '#946218';
      c.lineWidth = 1.6;
      c.stroke();
      // Akan Kum Taneleri
      c.fillStyle = '#e59819';
      c.beginPath();
      c.moveTo(gx - 7, gy - 8);
      c.lineTo(gx + 7, gy - 8);
      c.lineTo(gx, gy - 1);
      c.closePath();
      c.fill();
      c.beginPath();
      c.moveTo(gx - 9, gy + 17);
      c.lineTo(gx + 9, gy + 17);
      c.lineTo(gx, gy + 9);
      c.closePath();
      c.fill();
      const grainY = gy + ((tSec * 22) % 14);
      c.fillRect(gx - 1, grainY, 2, 3);
    }

    // --- BAHÇE ÇARDAĞI & AİLE ÇAY MASASI (640, 985) ---
    const tx = 640;
    const ty = 985;
    // Ahşap Çardak Direkleri
    c.strokeStyle = '#6a4529';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(tx - 44, ty + 12); c.lineTo(tx - 44, ty - 42);
    c.moveTo(tx + 44, ty + 12); c.lineTo(tx + 44, ty - 42);
    c.stroke();
    // Çardak Çatısı
    c.fillStyle = isNight ? '#7a4d2b' : '#b57441';
    c.beginPath();
    c.moveTo(tx - 56, ty - 40);
    c.lineTo(tx, ty - 64);
    c.lineTo(tx + 56, ty - 40);
    c.closePath();
    c.fill();

    // Sandalyeler (Aile Üyesi Sayısına Göre)
    const seats = clamp(memberCount || 1, 2, 6);
    for (let s = 0; s < seats; s++) {
      const ang = (Math.PI * 2 * s) / seats;
      const sx = tx + Math.cos(ang) * 36;
      const sy = ty + Math.sin(ang) * 16;
      c.fillStyle = '#7c5130';
      c.beginPath();
      c.arc(sx, sy, 8, 0, Math.PI * 2);
      c.fill();
    }

    // Yuvarlak Ahşap Masa
    c.fillStyle = '#9c6639';
    c.beginPath();
    c.ellipse(tx, ty, 30, 16, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#56351b';
    c.lineWidth = 2;
    c.stroke();

    // Bakır Semaver & Buhar
    c.fillStyle = '#c87333';
    c.fillRect(tx - 6, ty - 18, 12, 15);
    c.fillStyle = '#992b1d';
    // İnce belli çay bardakları
    c.fillRect(tx - 18, ty - 6, 4, 6);
    c.fillRect(tx + 14, ty - 6, 4, 6);
    c.fillRect(tx + 5, ty + 3, 4, 6);

    for (let st = 0; st < 2; st++) {
      const p = ((tSec * 0.7 + st * 0.5) % 1);
      c.strokeStyle = `rgba(255, 255, 255, ${(1 - p) * 0.65})`;
      c.lineWidth = 2;
      c.beginPath();
      c.arc(tx + Math.sin(tSec * 3 + st) * 4, ty - 22 - p * 18, 4 + p * 4, 0, Math.PI);
      c.stroke();
    }
    c.restore();
  }

  // 2) Mahalle Fırını & Peşin Market (885, 855)
  function drawBakeryAndMarket(c, tSec, isNight, sig) {
    c.save();
    const bx = 815;
    const by = 785;

    // Arka Teslimat Kamyoneti
    c.fillStyle = '#f1f5f9';
    drawRoundedRect(c, bx + 132, by + 56, 46, 26, 5);
    c.fill();
    c.fillStyle = '#2563eb';
    c.fillRect(bx + 168, by + 62, 14, 20);
    c.fillStyle = '#1e293b';
    c.beginPath();
    c.arc(bx + 144, by + 84, 5, 0, Math.PI * 2);
    c.arc(bx + 172, by + 84, 5, 0, Math.PI * 2);
    c.fill();

    // Tuğla Bina Gövdesi
    c.fillStyle = isNight ? '#96523b' : '#cf6d4a';
    c.fillRect(bx, by + 18, 136, 78);
    c.strokeStyle = '#6d311d';
    c.lineWidth = 2.5;
    c.strokeRect(bx, by + 18, 136, 78);

    // Çatı & Fırın Bacası
    c.fillStyle = '#6d3724';
    c.beginPath();
    c.moveTo(bx - 10, by + 20);
    c.lineTo(bx + 68, by - 16);
    c.lineTo(bx + 146, by + 20);
    c.closePath();
    c.fill();

    c.fillStyle = '#4a2518';
    c.fillRect(bx + 22, by - 28, 14, 24);
    const smokeDark = levers.dieselPct > 15 ? 120 : 235;
    for (let i = 0; i < 3; i++) {
      const p = (tSec * 0.6 + i * 0.33) % 1;
      c.fillStyle = `rgba(${smokeDark}, ${smokeDark}, ${smokeDark}, ${(1 - p) * 0.5})`;
      c.beginPath();
      c.arc(bx + 29 + p * 16, by - 32 - p * 32, 6 + p * 8, 0, Math.PI * 2);
      c.fill();
    }

    // Kırmızı-Krem Çizgili Tente
    for (let s = 0; s < 8; s++) {
      c.fillStyle = s % 2 === 0 ? '#c83e2b' : '#fbf3e4';
      c.fillRect(bx - 4 + s * 18, by + 40, 18, 13);
    }

    // Sıcak Taş Fırın Alevi & Ekmek Vitrini
    c.fillStyle = '#3b1d11';
    c.fillRect(bx + 12, by + 58, 66, 30);
    const ovenGlow = 0.7 + Math.sin(tSec * 5) * 0.2;
    c.fillStyle = `rgba(255, 148, 36, ${ovenGlow})`;
    c.beginPath();
    c.arc(bx + 32, by + 76, 12, Math.PI, 0);
    c.fill();
    // Vitrin Ekmek Somunları
    c.fillStyle = '#e49b35';
    for (let l = 0; l < 4; l++) {
      c.beginPath();
      c.ellipse(bx + 22 + l * 14, by + 82, 6, 3.5, 0, 0, Math.PI * 2);
      c.fill();
    }

    // Canlı Ekmek Etiketi Tabelası (Mazot ve Kuraklığa Anında Tepki Verir!)
    c.fillStyle = sig.breadDeltaPct > 4 ? '#991b1b' : '#2b1f17';
    drawRoundedRect(c, bx + 84, by + 56, 46, 26, 5);
    c.fill();
    c.fillStyle = '#fde68a';
    c.font = '700 10px sans-serif';
    c.textAlign = 'center';
    c.fillText(`${sig.breadSimTL} TL`, bx + 107, by + 73);

    // Kapı Önünde Nakit Ödeyen Müşteri Kuyruğu
    for (let p = 0; p < 3; p++) {
      const bob = Math.sin(tSec * 3.5 + p * 1.4) * 1.8;
      const px = bx + 92 + p * 18;
      const py = by + 104 + bob;
      c.strokeStyle = isNight ? '#e2e8f0' : '#292524';
      c.lineWidth = 2.2;
      c.beginPath();
      c.arc(px, py - 14, 4, 0, Math.PI * 2);
      c.moveTo(px, py - 10); c.lineTo(px, py);
      c.moveTo(px, py); c.lineTo(px - 4, py + 8);
      c.moveTo(px, py); c.lineTo(px + 4, py + 8);
      c.stroke();
      // Yeşil Peşin Banknot
      if (p === 0) {
        c.fillStyle = '#22c55e';
        c.fillRect(px - 9, py - 9, 8, 5);
      }
    }
    c.restore();
  }

  // 3) Taş Han Sarrafı (Demir Kepenkli + Dışarıda İki Kefeli Pirinç Terazi & Uçan Kağıt Balon)
  function drawBazaarAndGoldScale(c, tSec, isNight, sig) {
    c.save();
    const kx = 1075;
    const ky = 720;

    // Kurşun Kubbeler
    c.fillStyle = isNight ? '#525b66' : '#7b8794';
    c.beginPath();
    c.arc(kx + 38, ky + 18, 30, Math.PI, 0);
    c.arc(kx + 94, ky + 18, 30, Math.PI, 0);
    c.fill();
    // Kubbe Alemleri
    c.strokeStyle = '#d4a017';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(kx + 38, ky - 12); c.lineTo(kx + 38, ky - 22);
    c.moveTo(kx + 94, ky - 12); c.lineTo(kx + 94, ky - 22);
    c.stroke();

    // Kesme Taş Duvar
    c.fillStyle = isNight ? '#968b7c' : '#dfd5c5';
    c.fillRect(kx, ky + 18, 132, 72);
    c.strokeStyle = '#7c7060';
    c.lineWidth = 2.5;
    c.strokeRect(kx, ky + 18, 132, 72);

    // Kemerli Sarraf Kapısı (İçeride Altın Parıltısı)
    c.fillStyle = '#2c1e12';
    c.beginPath();
    c.moveTo(kx + 42, ky + 90);
    c.lineTo(kx + 42, ky + 50);
    c.arc(kx + 66, ky + 50, 24, Math.PI, 0);
    c.lineTo(kx + 90, ky + 90);
    c.closePath();
    c.fill();

    // Vitrin Külçeleri (Kepenk açıkken görünür)
    if (shutterAnim < 0.92) {
      c.fillStyle = '#fbbf24';
      c.fillRect(kx + 50, ky + 68, 14, 7);
      c.fillRect(kx + 68, ky + 68, 14, 7);
      c.fillRect(kx + 59, ky + 60, 14, 7);
    }

    // ANİMASYONLU DEMİR KEPENK (18:30 sonrası ve Pazar fiziksel olarak iner!)
    const targetShutter = sig.clock.grandBazaarOpen ? 0 : 1;
    shutterAnim += (targetShutter - shutterAnim) * 0.08;
    if (shutterAnim > 0.02) {
      const shH = 58 * shutterAnim;
      c.fillStyle = '#475569';
      c.fillRect(kx + 40, ky + 32, 52, shH);
      c.strokeStyle = '#1e293b';
      c.lineWidth = 1.5;
      for (let sy = ky + 38; sy < ky + 32 + shH; sy += 7) {
        c.beginPath();
        c.moveTo(kx + 40, sy);
        c.lineTo(kx + 92, sy);
        c.stroke();
      }
      if (shutterAnim > 0.8) {
        // Sarı Asma Kilit
        c.fillStyle = '#eab308';
        c.fillRect(kx + 61, ky + 74, 10, 9);
      }
    }

    // DIŞARIDA İKİ KEFELİ PİRİNÇ TERAZİ (Fiziki Külçe vs Şişkin Kağıt Kupon Balonu!)
    const sx = kx + 158;
    const sy = ky + 84;
    const prem = clamp(sig.dInfo.premiumPct || 14, -5, 30);
    const tilt = clamp(prem * 0.014, -0.15, 0.34);

    // Kaide ve Direk
    c.fillStyle = '#785226';
    c.fillRect(sx - 14, sy, 28, 7);
    c.strokeStyle = '#d99b26';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(sx, sy);
    c.lineTo(sx, sy - 44);
    c.stroke();

    c.save();
    c.translate(sx, sy - 42);
    c.rotate(-tilt); // Sol kefe ağır gerçek külçe, sağ kefe uçan hava parası balonu
    c.beginPath();
    c.moveTo(-26, 0);
    c.lineTo(26, 0);
    c.stroke();

    // Sol Kefe: Ağır Fiziki Altın Külçesi
    c.fillStyle = '#f59e0b';
    c.fillRect(-33, 14, 15, 8);
    c.strokeStyle = '#b45309';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(-26, 0); c.lineTo(-26, 14);
    c.stroke();

    // Sağ Kefe: İple Bağlı Şişkin Kağıt Kupon Balonu!
    const bob = Math.sin(tSec * 2.8) * 3;
    c.strokeStyle = '#9ca3af';
    c.beginPath();
    c.moveTo(26, 0); c.lineTo(26, -18 + bob);
    c.stroke();
    c.fillStyle = '#ef4444';
    c.beginPath();
    c.ellipse(26, -29 + bob, 12, 15, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#fff';
    c.font = '700 8.5px sans-serif';
    c.textAlign = 'center';
    c.fillText(`+%${Math.round(prem)}`, 26, -26 + bob);
    c.restore();

    c.restore();
  }

  // 4) 7/24 Cam Banka Kulesi & Sağlam Taş Devlet Kira Kalkanı (1390, 705)
  function drawGlassBankAndShield(c, tSec, isNight, sig) {
    c.save();
    const gx = 1335;
    const gy = 590;

    // Gece Mesai Dışı Açık Makas Uyarı Halesi (%3,60 Gece Makası!)
    if (!sig.clock.bankDaytimeTight) {
      const pulse = 0.26 + Math.sin(tSec * 3.2) * 0.1;
      const aura = c.createRadialGradient(gx + 34, gy + 70, 10, gx + 34, gy + 70, 78);
      aura.addColorStop(0, `rgba(245, 158, 11, ${pulse + 0.2})`);
      aura.addColorStop(1, 'rgba(245, 158, 11, 0)');
      c.fillStyle = aura;
      c.beginPath();
      c.arc(gx + 34, gy + 70, 78, 0, Math.PI * 2);
      c.fill();
    }

    // 7/24 Cam Kule Gövdesi
    const glassGrad = c.createLinearGradient(gx, gy, gx + 68, gy + 145);
    glassGrad.addColorStop(0, isNight ? '#164e63' : '#38bdf8');
    glassGrad.addColorStop(1, isNight ? '#0f172a' : '#0369a1');
    c.fillStyle = glassGrad;
    c.fillRect(gx, gy, 68, 145);
    c.strokeStyle = '#bae6fd';
    c.lineWidth = 2;
    c.strokeRect(gx, gy, 68, 145);

    // 7/24 Yanan Cam Kule Pencereleri (Gece 03:00'te bile yanar!)
    for (let r = 0; r < 7; r++) {
      for (let col = 0; col < 3; col++) {
        c.fillStyle = !sig.clock.bankDaytimeTight
          ? (r % 2 === 0 ? '#fcd34d' : '#7dd3fc')
          : '#e0f2fe';
        c.fillRect(gx + 9 + col * 19, gy + 12 + r * 18, 13, 11);
      }
    }

    // Gece Makas Sembolü (Kule Tepesinde Açılan Makas Uyarısı)
    if (!sig.clock.bankDaytimeTight) {
      c.fillStyle = '#92400e';
      drawRoundedRect(c, gx - 8, gy - 26, 84, 20, 6);
      c.fill();
      c.fillStyle = '#fef3c7';
      c.font = '700 9.5px sans-serif';
      c.textAlign = 'center';
      c.fillText('GECE MAKASI AÇIK', gx + 34, gy - 13);
    }

    // YANINDA SAĞLAM TAŞ "DEVLET KİRA KALKANI" KUBBESİ
    const sx = gx + 82;
    const sy = gy + 68;
    c.fillStyle = isNight ? '#82786a' : '#d6cbb8';
    c.fillRect(sx, sy + 16, 68, 60);
    c.strokeStyle = '#57534e';
    c.lineWidth = 2.5;
    c.strokeRect(sx, sy + 16, 68, 60);
    // Taş Kubbe
    c.fillStyle = '#0f766e';
    c.beginPath();
    c.arc(sx + 34, sy + 16, 30, Math.PI, 0);
    c.fill();
    // Kalkan Arması
    c.fillStyle = '#eab308';
    c.beginPath();
    c.moveTo(sx + 34, sy + 28);
    c.lineTo(sx + 48, sy + 34);
    c.lineTo(sx + 44, sy + 52);
    c.lineTo(sx + 34, sy + 60);
    c.lineTo(sx + 24, sy + 52);
    c.lineTo(sx + 20, sy + 34);
    c.closePath();
    c.fill();

    c.restore();
  }

  // 5) Anadolu Barajı, Yükselen/Alçalan Mavi Su Rezervi & Buğday Tarlası + Traktör (965, 395)
  function drawDamAndWheatHills(c, tSec, isNight, sig) {
    c.save();
    const dx = 915;
    const dy = 340;

    // Baraj Gölü Havzası (Su seviyesi sig.damLevel ile canlı yükselir/alçalır!)
    const waterRadiusX = 68 + sig.damLevel * 44;
    const waterRadiusY = 22 + sig.damLevel * 20;
    c.fillStyle = isNight ? '#1d4ed8' : '#2563eb';
    c.beginPath();
    c.ellipse(dx + 10, dy + 8, waterRadiusX, waterRadiusY, -0.06, 0, Math.PI * 2);
    c.fill();

    // Su Dalga Çizgileri
    c.strokeStyle = 'rgba(255,255,255,0.45)';
    c.lineWidth = 1.6;
    c.beginPath();
    c.moveTo(dx - 25, dy + 4);
    c.lineTo(dx + 25 + Math.sin(tSec * 2) * 8, dy + 4);
    c.stroke();

    // Kavisli Beton Baraj Gövdesi
    c.fillStyle = isNight ? '#94a3b8' : '#cbd5e1';
    c.beginPath();
    c.moveTo(dx - 52, dy + 16);
    c.quadraticCurveTo(dx + 12, dy + 48, dx + 76, dy + 16);
    c.lineTo(dx + 68, dy + 62);
    c.quadraticCurveTo(dx + 12, dy + 88, dx - 44, dy + 62);
    c.closePath();
    c.fill();
    c.strokeStyle = '#64748b';
    c.lineWidth = 2.5;
    c.stroke();

    // Dolusavak Köpüğü (Baraj doluyken coşar)
    if (sig.damLevel > 0.45) {
      c.fillStyle = 'rgba(186, 230, 253, 0.8)';
      c.fillRect(dx + 4, dy + 38, 18, 36);
    }

    // Yamaçta Dalgalanan Altın Buğday Tarlası & Traktör
    const wx = dx + 105;
    const wy = dy + 28;
    const isDry = levers.rainPct < -15;
    c.fillStyle = isDry ? '#b4823e' : '#eab308';
    drawRoundedRect(c, wx, wy, 138, 56, 14);
    c.fill();

    // Başaklar
    c.strokeStyle = isDry ? '#785323' : '#fef08a';
    c.lineWidth = 2;
    for (let s = 0; s < 14; s++) {
      const sx = wx + 12 + s * 9;
      const sy = wy + 18 + (s % 2) * 18;
      const sway = Math.sin(tSec * 2.8 + s * 0.5) * 4;
      c.beginPath();
      c.moveTo(sx, sy + 12);
      c.lineTo(sx + sway, sy);
      c.stroke();
    }

    // İlerleyen Kırmızı Traktör
    const trX = wx + 22 + ((tSec * 14) % 92);
    const trY = wy + 28;
    c.fillStyle = '#dc2626';
    c.fillRect(trX, trY - 10, 18, 10);
    c.fillRect(trX + 8, trY - 18, 9, 9);
    c.fillStyle = '#1e293b';
    c.beginPath();
    c.arc(trX + 13, trY + 1, 6, 0, Math.PI * 2);
    c.arc(trX + 3, trY + 2, 4, 0, Math.PI * 2);
    c.fill();

    c.restore();
  }

  // 6) İzmit Rafinerisi, Güneş Panelleri & Elektrik Trafoları (1655, 675)
  function drawRefineryAndEnergy(c, tSec, isNight) {
    c.save();
    const rx = 1595;
    const ry = 620;

    // Beyaz Silindirik Petrol Tankları
    for (let i = 0; i < 2; i++) {
      const tx = rx + i * 44;
      c.fillStyle = isNight ? '#cbd5e1' : '#f8fafc';
      c.fillRect(tx, ry + 32, 36, 38);
      c.beginPath();
      c.ellipse(tx + 18, ry + 32, 18, 6, 0, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#64748b';
      c.lineWidth = 2;
      c.strokeRect(tx, ry + 32, 36, 38);
      // Kırmızı şerit
      c.fillStyle = '#dc2626';
      c.fillRect(tx, ry + 46, 36, 5);
    }

    // Damıtma Kulesi ve Meşale Alevi
    c.fillStyle = '#94a3b8';
    c.fillRect(rx + 96, ry - 8, 16, 78);
    const flareR = 7 + Math.sin(tSec * 8) * 2.5 + Math.max(0, levers.dieselPct * 0.08);
    c.fillStyle = '#f97316';
    c.beginPath();
    c.arc(rx + 104, ry - 15, flareR, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#fde047';
    c.beginPath();
    c.arc(rx + 104, ry - 14, flareR * 0.5, 0, Math.PI * 2);
    c.fill();

    // Eğik Mavi Güneş Panelleri Dizisi
    for (let p = 0; p < 3; p++) {
      const px = rx + 8 + p * 38;
      const py = ry + 82;
      c.fillStyle = '#1d4ed8';
      c.beginPath();
      c.moveTo(px, py + 12);
      c.lineTo(px + 28, py + 12);
      c.lineTo(px + 33, py);
      c.lineTo(px + 5, py);
      c.closePath();
      c.fill();
      c.strokeStyle = '#93c5fd';
      c.lineWidth = 1.2;
      c.stroke();
    }

    // Yüksek Gerilim Trafo Direği & Teller
    c.strokeStyle = '#475569';
    c.lineWidth = 2.2;
    c.beginPath();
    c.moveTo(rx + 134, ry + 72); c.lineTo(rx + 142, ry + 20);
    c.lineTo(rx + 150, ry + 72);
    c.moveTo(rx + 130, ry + 32); c.lineTo(rx + 154, ry + 32);
    c.stroke();

    c.restore();
  }

  // 7) Kocaeli İhracat Limanı, Vinçler, Boğaz Kargo Gemisi & Çelik Ocakları
  function drawPortShipsAndSteel(c, tSec, isNight, sig) {
    c.save();

    // --- ÇELİK & ŞANTİYE YÜKSEK FIRINI (1925, 540) ---
    const sx = 1885;
    const sy = 485;
    c.fillStyle = '#475569';
    c.fillRect(sx, sy + 18, 78, 56);
    c.fillStyle = '#334155';
    c.beginPath();
    c.moveTo(sx + 14, sy + 18);
    c.lineTo(sx + 24, sy - 22);
    c.lineTo(sx + 46, sy - 22);
    c.lineTo(sx + 56, sy + 18);
    c.closePath();
    c.fill();
    // Erimiş Çelik Kızıllığı
    c.fillStyle = '#f97316';
    c.beginPath();
    c.arc(sx + 38, sy + 56, 14, Math.PI, 0);
    c.fill();
    for (let k = 0; k < 3; k++) {
      const p = (tSec * 0.5 + k * 0.33) % 1;
      c.fillStyle = `rgba(148, 163, 184, ${(1 - p) * 0.5})`;
      c.beginPath();
      c.arc(sx + 35 + p * 20, sy - 26 - p * 30, 7 + p * 8, 0, Math.PI * 2);
      c.fill();
    }

    // --- KOCAELİ OTOMOTİV FABRİKASI & LİMAN VİNÇLERİ (1875, 900) ---
    const px = 1805;
    const py = 835;
    // Testere Dişli Mavi Fabrika Çatısı
    c.fillStyle = isNight ? '#1e3a8a' : '#2563eb';
    c.fillRect(px, py + 24, 126, 52);
    c.fillStyle = '#1d4ed8';
    for (let r = 0; r < 3; r++) {
      c.beginPath();
      c.moveTo(px + r * 42, py + 24);
      c.lineTo(px + r * 42 + 28, py + 4);
      c.lineTo(px + (r + 1) * 42, py + 24);
      c.closePath();
      c.fill();
    }
    // Fabrika Pencereleri
    c.fillStyle = isNight ? '#fde68a' : '#dbeafe';
    for (let w = 0; w < 4; w++) {
      c.fillRect(px + 12 + w * 28, py + 40, 18, 14);
    }

    // Turuncu Liman Gantry Vinçleri
    for (let cr = 0; cr < 2; cr++) {
      const cx = px + 140 + cr * 48;
      const cy = py + 72;
      c.strokeStyle = '#ea580c';
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(cx, cy); c.lineTo(cx + 8, cy - 58);
      c.lineTo(cx + 22, cy);
      c.moveTo(cx - 10, cy - 52); c.lineTo(cx + 46, cy - 52);
      c.stroke();
    }

    // BOĞAZ / KÖRFEZ SUYUNDA İHRACAT GEMİSİ (Giderken Araç, Dönerken Yeşil Döviz Kasası!)
    const shipCycle = (tSec * (0.055 + Math.max(0, levers.fxPct) * 0.0008)) % 2;
    const outbound = shipCycle < 1;
    const prog = outbound ? shipCycle : (2 - shipCycle);
    const shX = 1520 + prog * 540;
    const shY = 1155 + Math.sin(tSec * 2) * 4;

    c.save();
    c.translate(shX, shY);
    if (!outbound) c.scale(-1, 1);

    // Su İzi
    c.strokeStyle = 'rgba(255,255,255,0.55)';
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(-68, 12);
    c.lineTo(-96, 6);
    c.moveTo(-68, 14);
    c.lineTo(-94, 20);
    c.stroke();

    // Gemi Gövdesi
    c.fillStyle = '#7f1d1d';
    c.beginPath();
    c.moveTo(-62, 0);
    c.lineTo(66, 0);
    c.lineTo(52, 18);
    c.lineTo(-54, 18);
    c.closePath();
    c.fill();
    // Kaptan Köşkü
    c.fillStyle = '#f8fafc';
    c.fillRect(-46, -22, 24, 22);

    // Güverte Yükü: Giderken Mavi Kamyonlar, Dönerken Yeşil Euro/Döviz Sandıkları!
    const crateCount = sig.exportBoostPct > 8 ? 4 : 3;
    for (let b = 0; b < crateCount; b++) {
      c.fillStyle = outbound ? '#38bdf8' : '#16a34a';
      c.fillRect(-14 + b * 17, -12, 14, 12);
      c.strokeStyle = '#0f172a';
      c.lineWidth = 1;
      c.strokeRect(-14 + b * 17, -12, 14, 12);
    }
    c.restore();

    c.restore();
  }

  // 8) Kıtalararası Havalimanı (470, 535) & Ankara Radar Tepesi (1445, 395)
  function drawAirportAndRadar(c, tSec, isNight) {
    c.save();
    // --- HAVALİMANI PİSTİ VE KALKAN/İNEN UÇAK ---
    const ax = 365;
    const ay = 525;
    c.save();
    c.translate(ax + 100, ay + 20);
    c.rotate(-0.14);
    c.fillStyle = '#334155';
    drawRoundedRect(c, -125, -15, 250, 30, 6);
    c.fill();
    c.strokeStyle = '#f8fafc';
    c.setLineDash([12, 10]);
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-105, 0); c.lineTo(105, 0);
    c.stroke();
    c.setLineDash([]);
    c.restore();

    // Hava Kontrol Kulesi
    c.fillStyle = '#e2e8f0';
    c.fillRect(ax + 150, ay - 36, 16, 42);
    c.fillStyle = '#0284c7';
    c.fillRect(ax + 144, ay - 48, 28, 13);

    // Animasyonlu Yolcu Uçağı (Pistten Hızlanıp Göğe Yükselir!)
    const fProg = (tSec * 0.14) % 1;
    const planeX = ax - 20 + fProg * 250;
    const lift = fProg > 0.42 ? Math.pow((fProg - 0.42) * 1.7, 1.5) * 95 : 0;
    const planeY = ay + 34 - fProg * 34 - lift;
    const pitch = fProg > 0.42 ? -0.28 : -0.14;

    c.save();
    c.translate(planeX, planeY);
    c.rotate(pitch);
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.ellipse(0, 0, 22, 5.5, 0, 0, Math.PI * 2);
    c.fill();
    // Kırmızı Kuyruk
    c.fillStyle = '#dc2626';
    c.beginPath();
    c.moveTo(-16, -2); c.lineTo(-24, -13); c.lineTo(-10, -3);
    c.closePath();
    c.fill();
    // Kanat
    c.fillStyle = '#cbd5e1';
    c.beginPath();
    c.moveTo(-2, 1); c.lineTo(-10, 13); c.lineTo(6, 2);
    c.closePath();
    c.fill();
    c.restore();

    // --- ANKARA RADAR & YAZILIM TEPESİ (1445, 395) ---
    const rx = 1445;
    const ry = 395;
    c.fillStyle = isNight ? '#475569' : '#e2e8f0';
    c.fillRect(rx - 36, ry - 4, 72, 38);
    c.fillStyle = '#6d28d9';
    c.fillRect(rx - 36, ry - 10, 72, 8);
    // Dönen Beyaz Radar Çanağı
    const dishSwing = Math.sin(tSec * 1.8) * 18;
    c.strokeStyle = '#334155';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(rx, ry - 10); c.lineTo(rx, ry - 32);
    c.stroke();
    c.fillStyle = '#f8fafc';
    c.beginPath();
    c.ellipse(rx + dishSwing * 0.25, ry - 38, Math.max(6, Math.abs(20 - Math.abs(dishSwing) * 0.5)), 16, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#6366f1';
    c.lineWidth = 2;
    c.stroke();

    // Radar Sinyal Halkası
    const rPulse = (tSec * 0.8) % 1;
    c.strokeStyle = `rgba(139, 92, 246, ${(1 - rPulse) * 0.6})`;
    c.lineWidth = 1.8;
    c.beginPath();
    c.arc(rx, ry - 38, 12 + rPulse * 36, -Math.PI * 0.85, -Math.PI * 0.15);
    c.stroke();

    c.restore();
  }

  // 9) Gürültülü Dedikodu Meydanı (1205, 1035) + Zaman İstasyonu (245, 735) + Tatbikat Okulu (1535, 1035)
  function drawSquareTrainAndSchool(c, tSec, isNight) {
    c.save();

    // --- GÜRÜLTÜLÜ DEDİKODU MEYDANI & SALLANAN İSKELE (1205, 1035) ---
    const gx = 1205;
    const gy = 1045;
    const wobble = Math.sin(tSec * 5.5) * 5;
    c.strokeStyle = '#92400e';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(gx - 22, gy); c.lineTo(gx - 16 + wobble, gy - 58);
    c.moveTo(gx + 22, gy); c.lineTo(gx + 16 + wobble, gy - 58);
    c.moveTo(gx - 20, gy - 26); c.lineTo(gx + 20 + wobble * 0.5, gy - 26);
    c.moveTo(gx - 20 + wobble, gy - 58); c.lineTo(gx + 20 + wobble, gy - 58);
    c.stroke();

    // Megafon Sallayan Kalabalık
    for (let i = -2; i <= 2; i++) {
      const px = gx + i * 18;
      const py = gy + 8 + Math.abs(Math.sin(tSec * 6 + i)) * -5;
      c.strokeStyle = isNight ? '#f1f5f9' : '#1f2937';
      c.lineWidth = 2;
      c.beginPath();
      c.arc(px, py - 13, 3.8, 0, Math.PI * 2);
      c.moveTo(px, py - 9); c.lineTo(px, py);
      c.stroke();
      if (i % 2 === 0) {
        // Kırmızı Megafon
        c.fillStyle = '#dc2626';
        c.beginPath();
        c.moveTo(px + 2, py - 12);
        c.lineTo(px + 13, py - 18);
        c.lineTo(px + 13, py - 9);
        c.closePath();
        c.fill();
      }
    }
    // Ses Dalgaları
    const ring = (tSec * 1.4) % 1;
    c.strokeStyle = `rgba(220, 38, 38, ${(1 - ring) * 0.65})`;
    c.lineWidth = 2;
    c.beginPath();
    c.arc(gx + wobble, gy - 54, 10 + ring * 32, 0, Math.PI * 2);
    c.stroke();

    // --- ZAMAN İSTASYONU & 10 YILLIK TREN (245, 735) ---
    const zx = 175;
    const zy = 695;
    // Raylar
    c.strokeStyle = '#57534e';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(80, zy + 72); c.lineTo(355, zy + 72);
    c.moveTo(80, zy + 79); c.lineTo(355, zy + 79);
    c.stroke();

    // Taş İstasyon Binası ve Saat Kulesi
    c.fillStyle = isNight ? '#9a8c78' : '#efe4d2';
    c.fillRect(zx, zy + 10, 110, 52);
    c.fillStyle = '#7c2d12';
    c.beginPath();
    c.moveTo(zx - 8, zy + 12);
    c.lineTo(zx + 55, zy - 22);
    c.lineTo(zx + 118, zy + 12);
    c.closePath();
    c.fill();
    // İstasyon Saati
    c.fillStyle = '#fffbeb';
    c.beginPath();
    c.arc(zx + 55, zy - 3, 9, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#451a03';
    c.lineWidth = 1.6;
    c.stroke();

    // Bordo-Pirinç 10 Yıllık Ekspres Lokomotif
    const trainBob = Math.sin(tSec * 4) * 0.8;
    c.fillStyle = '#881337';
    drawRoundedRect(c, zx + 12, zy + 46 + trainBob, 96, 24, 6);
    c.fill();
    c.fillStyle = '#f59e0b';
    c.fillRect(zx + 12, zy + 56 + trainBob, 96, 4);
    // Buhar Bacası
    c.fillStyle = '#1e293b';
    c.fillRect(zx + 90, zy + 34 + trainBob, 10, 13);
    for (let s = 0; s < 3; s++) {
      const p = (tSec * 0.65 + s * 0.33) % 1;
      c.fillStyle = `rgba(255,255,255,${(1 - p) * 0.55})`;
      c.beginPath();
      c.arc(zx + 95 - p * 22, zy + 30 - p * 24, 5 + p * 7, 0, Math.PI * 2);
      c.fill();
    }

    // --- GERÇEK HAYAT TATBİKAT OKULU (1535, 1035) ---
    const ox = 1485;
    const oy = 985;
    c.fillStyle = isNight ? '#a3937e' : '#f5ebd6';
    c.fillRect(ox, oy + 16, 102, 54);
    c.strokeStyle = '#785c3c';
    c.lineWidth = 2.2;
    c.strokeRect(ox, oy + 16, 102, 54);
    c.fillStyle = '#15803d';
    c.beginPath();
    c.moveTo(ox - 8, oy + 18);
    c.lineTo(ox + 51, oy - 16);
    c.lineTo(ox + 110, oy + 18);
    c.closePath();
    c.fill();
    // Çan Kulesi
    c.fillStyle = '#d97706';
    c.beginPath();
    c.arc(ox + 51, oy - 20, 7, 0, Math.PI * 2);
    c.fill();
    // Avlu Kara Tahtası
    c.fillStyle = '#14532d';
    c.fillRect(ox + 22, oy + 32, 58, 24);
    c.strokeStyle = '#92400e';
    c.strokeRect(ox + 22, oy + 32, 58, 24);

    c.restore();
  }

  // Tabelalar ve Organik Yaşayan Sis Çizimi
  function drawLandmarkSignboard(c, lm, isMistVeiled, isHovered) {
    const title = languageLens === 'BRIDGE' ? lm.bridgeTitle : lm.plainTitle;
    const labelText = isMistVeiled ? `Sisli İskele · ${title}` : title;
    c.save();
    c.font = '700 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const tw = c.measureText(labelText).width;
    const bw = tw + 22;
    const bh = 27;
    const bx = clamp(lm.x - bw / 2, 14, WORLD_W - bw - 14);
    const by = lm.y + 52;

    c.fillStyle = isMistVeiled
      ? 'rgba(51, 65, 85, 0.86)'
      : (isHovered ? '#2b1f17' : 'rgba(251, 247, 238, 0.95)');
    c.strokeStyle = isHovered ? '#eab308' : '#b89f7a';
    c.lineWidth = isHovered ? 2.2 : 1.5;
    drawRoundedRect(c, bx, by, bw, bh, 9);
    c.fill();
    c.stroke();

    c.fillStyle = (isMistVeiled || isHovered) ? '#fbf7ee' : '#241c15';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(labelText, bx + bw / 2, by + bh / 2 + 0.5);
    c.restore();
  }

  function drawWorldFrame(tsMs) {
    if (!ctx || !canvas) return;
    const tSec = (tsMs || performance.now()) * 0.001;

    // Yumuşak kamera sönümlemesi
    cam.zoom += (cam.tz - cam.zoom) * 0.14;
    cam.x += (cam.tx - cam.x) * 0.14;
    cam.y += (cam.ty - cam.y) * 0.14;

    const K = getKernel();
    const member = K ? K.getActiveMember() : { livedMilestones: {} };
    const snap = K ? K.evaluateMemberPortfolio(member) : { freedomMonths: 2.8, unsettledTL: 0, clearedCloudsCount: 0 };
    const state = K ? K.getState() : { members: [member] };
    const sig = computeTownSignals();
    const hh = sig.clock.hh;
    const isNight = hh >= 20 || hh < 6;
    const isDusk = (hh >= 18 && hh < 20) || (hh >= 6 && hh < 7);

    ctx.save();
    ctx.setTransform(cam.dpr, 0, 0, cam.dpr, 0, 0);
    ctx.clearRect(0, 0, cam.vw, cam.vh);

    // Kamera Dönüşümü
    ctx.translate(cam.vw * 0.5, cam.vh * 0.5);
    ctx.scale(cam.zoom, cam.zoom);
    ctx.translate(-cam.x, -cam.y);

    // 1) İSTANBUL GÖKYÜZÜ (Gündüz / Gün Batımı / Yıldızlı Gece)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 560);
    if (isNight) {
      skyGrad.addColorStop(0, '#0b132b');
      skyGrad.addColorStop(1, '#1d3557');
    } else if (isDusk) {
      skyGrad.addColorStop(0, '#355070');
      skyGrad.addColorStop(0.6, '#b56576');
      skyGrad.addColorStop(1, '#eaac8b');
    } else {
      skyGrad.addColorStop(0, '#72b5e8');
      skyGrad.addColorStop(1, '#d8f0fc');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(-300, -240, WORLD_W + 600, 820);

    // Güneş veya Hilal Ay + Yıldızlar
    if (isNight) {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(1980, 130, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f1c38';
      ctx.beginPath();
      ctx.arc(1992, 122, 28, 0, Math.PI * 2);
      ctx.fill();
      for (let st = 0; st < 28; st++) {
        const sx = (st * 89) % WORLD_W;
        const sy = 35 + ((st * 47) % 190);
        const tw = 0.35 + 0.55 * Math.abs(Math.sin(tSec * 2 + st));
        ctx.fillStyle = `rgba(255,255,240,${tw})`;
        ctx.fillRect(sx, sy, 2.5, 2.5);
      }
    } else {
      const sunX = 1860;
      const sunY = isDusk ? 255 : 135;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 110);
      sunGlow.addColorStop(0, 'rgba(255, 232, 128, 0.95)');
      sunGlow.addColorStop(1, 'rgba(255, 232, 128, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 110, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 34, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gökyüzü Bulutları
    for (const cl of skyClouds) {
      const cx = ((cl.x + tSec * 14 * cl.v) % (WORLD_W + 200)) - 100;
      ctx.fillStyle = isNight ? 'rgba(148, 163, 184, 0.16)' : 'rgba(255, 255, 255, 0.78)';
      ctx.beginPath();
      ctx.arc(cx, cl.y, 28 * cl.s, 0, Math.PI * 2);
      ctx.arc(cx + 26 * cl.s, cl.y - 6 * cl.s, 34 * cl.s, 0, Math.PI * 2);
      ctx.arc(cx + 56 * cl.s, cl.y + 2 * cl.s, 25 * cl.s, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2) ANADOLU TEPELERİ, ZEMİN VE BOĞAZ/KÖRFEZ DENİZİ
    ctx.fillStyle = isNight ? '#1f3629' : '#76a856';
    ctx.beginPath();
    ctx.moveTo(-300, 420);
    ctx.quadraticCurveTo(450, 250, 1020, 320);
    ctx.quadraticCurveTo(1560, 235, 2120, 335);
    ctx.lineTo(WORLD_W + 300, 420);
    ctx.lineTo(WORLD_W + 300, WORLD_H + 300);
    ctx.lineTo(-300, WORLD_H + 300);
    ctx.closePath();
    ctx.fill();

    // Orta Kasaba Çayırı
    ctx.fillStyle = isNight ? '#263f30' : '#95be6d';
    ctx.beginPath();
    ctx.moveTo(-300, 560);
    ctx.quadraticCurveTo(780, 495, 1620, 565);
    ctx.lineTo(WORLD_W + 300, 610);
    ctx.lineTo(WORLD_W + 300, WORLD_H + 300);
    ctx.lineTo(-300, WORLD_H + 300);
    ctx.closePath();
    ctx.fill();

    // Marmara / Boğaz Mavi Kıyı Suyu (Sağ Alt ve Alt Kıyı Şeridi)
    const seaGrad = ctx.createLinearGradient(0, 1040, 0, WORLD_H + 200);
    seaGrad.addColorStop(0, isNight ? '#0e3a5c' : '#1d78a8');
    seaGrad.addColorStop(1, isNight ? '#082036' : '#0f4c75');
    ctx.fillStyle = seaGrad;
    ctx.beginPath();
    ctx.moveTo(-300, 1210);
    ctx.quadraticCurveTo(720, 1170, 1340, 1110);
    ctx.quadraticCurveTo(1750, 1030, 2130, 995);
    ctx.lineTo(WORLD_W + 300, 980);
    ctx.lineTo(WORLD_W + 300, WORLD_H + 300);
    ctx.lineTo(-300, WORLD_H + 300);
    ctx.closePath();
    ctx.fill();

    // Kıyı Kum/Rıhtım Çizgisi
    ctx.strokeStyle = isNight ? '#64748b' : '#e7d5b5';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-200, 1208);
    ctx.quadraticCurveTo(720, 1168, 1340, 1108);
    ctx.quadraticCurveTo(1750, 1028, 2130, 993);
    ctx.stroke();

    // 3) KASABA TAŞ SOKAĞI VE SANAYİ ASFALT KARAYOLU
    ctx.strokeStyle = isNight ? '#475569' : '#cfc2ac';
    ctx.lineWidth = 34;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(250, 775);
    ctx.lineTo(450, 935);
    ctx.lineTo(885, 895);
    ctx.lineTo(1150, 845);
    ctx.lineTo(1395, 795);
    ctx.lineTo(1655, 710);
    ctx.lineTo(1875, 885);
    ctx.stroke();

    // Meydan & Okul Yan Yolu
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.moveTo(1150, 845);
    ctx.lineTo(1205, 1025);
    ctx.lineTo(1535, 1030);
    ctx.stroke();

    // Yolda İlerleyen Kırmızı Mazot Tankerleri!
    const speedFactor = clamp(1 + levers.dieselPct * 0.012, 0.45, 1.85);
    for (const tk of roadTankers) {
      tk.t = (tk.t + tk.speed * speedFactor) % 1;
      const path = TANKER_PATHS[tk.route];
      const pos = pointAlongPolyline(path, tk.t);
      const ang = Math.atan2(pos.dy, pos.dx);
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(ang);
      // Kırmızı Tanker Dorsesi
      ctx.fillStyle = tk.route === 2 ? '#475569' : '#dc2626';
      drawRoundedRect(ctx, -15, -6, 22, 12, 4);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(7, -5, 8, 10);
      ctx.restore();
    }

    // 4) TÜM MİMARİ YAPILARIN ÇİZİMİ
    drawDamAndWheatHills(ctx, tSec, isNight, sig);
    drawAirportAndRadar(ctx, tSec, isNight);
    drawRefineryAndEnergy(ctx, tSec, isNight);
    drawPortShipsAndSteel(ctx, tSec, isNight, sig);
    drawGlassBankAndShield(ctx, tSec, isNight, sig);
    drawBazaarAndGoldScale(ctx, tSec, isNight, sig);
    drawBakeryAndMarket(ctx, tSec, isNight, sig);
    drawHomeAndTeaGarden(ctx, tSec, isNight, snap, (state.members || []).length);
    drawSquareTrainAndSchool(ctx, tSec, isNight);

    // Sokak Lambaları (Gece sıcak ışık havuzları saçar)
    drawStreetLamp(ctx, 540, 920, isNight);
    drawStreetLamp(ctx, 765, 895, isNight);
    drawStreetLamp(ctx, 1025, 865, isNight);
    drawStreetLamp(ctx, 1280, 820, isNight);
    drawStreetLamp(ctx, 1365, 1025, isNight);

    // Yağmur Yağışı (Baraj Yağmuru kolu açıldığında gökten baraja bereket yağar)
    if (sig.isRainy) {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
      ctx.lineWidth = 1.6;
      for (let r = 0; r < 55; r++) {
        const rx = ((r * 97 + tSec * 120) % 1700) + 250;
        const ry = ((r * 73 + tSec * 420) % 720) + 120;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 6, ry + 16);
        ctx.stroke();
      }
    }

    // 5) DOĞU İSKELESİ ORGANİK SİS BULUTLARI (clearedCloudsCount < 4 ise nazikçe örter)
    const ms = member.livedMilestones || {};
    for (const lm of WORLD_LANDMARKS) {
      if (lm.kind !== 'mist') continue;
      const unlocked = Boolean(ms[lm.milestoneKey]);
      if (unlocked) {
        // Açılmış İskele Yapısı
        ctx.fillStyle = '#0f766e';
        drawRoundedRect(ctx, lm.x - 28, lm.y - 22, 56, 40, 8);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(lm.x, lm.y - 6, 7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Yumuşak Süzülen Canlı Sis Kümesi
        for (let p = 0; p < 4; p++) {
          const ox = Math.sin(tSec * 0.7 + p * 1.6 + lm.y * 0.01) * 20 + (p - 1.5) * 22;
          const oy = Math.cos(tSec * 0.5 + p) * 9;
          const g = ctx.createRadialGradient(lm.x + ox, lm.y + oy, 8, lm.x + ox, lm.y + oy, 64);
          g.addColorStop(0, 'rgba(241, 245, 249, 0.92)');
          g.addColorStop(1, 'rgba(226, 232, 240, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(lm.x + ox, lm.y + oy, 64, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 6) BİNA TABELALARI
    for (const lm of WORLD_LANDMARKS) {
      const veiled = lm.kind === 'mist' && !Boolean(ms[lm.milestoneKey]);
      drawLandmarkSignboard(ctx, lm, veiled, hoveredLandmarkId === lm.id);
    }

    ctx.restore();
    rafId = global.requestAnimationFrame(drawWorldFrame);
  }

  // --------------------------------------------------------------------------
  // 6. ÖZEL VEKTÖR (SVG) İKONLAR VE GÖRSEL METAFOR ÜRETİCİLERİ (SIFIR EMOJİ)
  // --------------------------------------------------------------------------
  function svgJarIcon(sealedWarn) {
    const lidColor = sealedWarn ? '#b84326' : '#1f6f4a';
    const fill = sealedWarn ? '#f59e0b' : '#34d399';
    return `
      <svg class="wse-jar-icon" viewBox="0 0 44 44" aria-hidden="true">
        <rect x="11" y="5" width="22" height="6" rx="2" fill="${lidColor}" />
        <rect x="9" y="11" width="26" height="28" rx="7" fill="rgba(224,242,254,0.75)" stroke="#64748b" stroke-width="2" />
        <rect x="12" y="21" width="20" height="15" rx="4" fill="${fill}" opacity="0.75" />
        ${sealedWarn ? '<circle cx="22" cy="13" r="4" fill="#dc2626" />' : ''}
      </svg>
    `;
  }

  function svgHourglassIcon() {
    return `
      <svg class="wse-jar-icon" viewBox="0 0 44 44" aria-hidden="true">
        <rect x="9" y="5" width="26" height="4" rx="2" fill="#92400e" />
        <rect x="9" y="35" width="26" height="4" rx="2" fill="#92400e" />
        <path d="M12 9 L32 9 L24 22 L32 35 L12 35 L20 22 Z" fill="#e0f2fe" stroke="#b45309" stroke-width="2" />
        <polygon points="15,14 29,14 22,21" fill="#f59e0b" />
        <polygon points="14,34 30,34 22,27" fill="#d97706" />
      </svg>
    `;
  }

  function svgShelfGoods(count, kind) {
    let items = '';
    for (let i = 0; i < count; i++) {
      if (kind === 'bread') {
        items += `<ellipse cx="${12 + i * 20}" cy="13" rx="8" ry="5" fill="#e59824" stroke="#8c5311" stroke-width="1.4"/>`;
      } else if (kind === 'jar') {
        items += `<rect x="${6 + i * 18}" y="5" width="12" height="15" rx="3" fill="#fbbf24" stroke="#92400e" stroke-width="1.4"/>`;
      } else {
        items += `<rect x="${6 + i * 18}" y="6" width="13" height="14" rx="2" fill="#34d399" stroke="#065f46" stroke-width="1.4"/>`;
      }
    }
    return `<svg width="${Math.max(28, count * 20 + 6)}" height="22" viewBox="0 0 ${Math.max(28, count * 20 + 6)} 22" aria-hidden="true">${items}</svg>`;
  }

  function renderFriendMirrorHtml(member, snap) {
    let bridgeOut = null;
    try {
      if (global.HumanWisdomBridge && typeof global.HumanWisdomBridge.buildFriendMirror === 'function') {
        bridgeOut = global.HumanWisdomBridge.buildFriendMirror(member, snap);
      }
    } catch (_) {}

    if (typeof bridgeOut === 'string' && bridgeOut.trim()) {
      return `<div class="wse-wood-panel warm-tint">${bridgeOut}</div>`;
    }
    if (bridgeOut && typeof bridgeOut === 'object') {
      const title = bridgeOut.headline || bridgeOut.title || 'Görmüş Geçirmiş Dost Aynası';
      const body = bridgeOut.calmParagraph || bridgeOut.reflection || bridgeOut.summary || bridgeOut.message || bridgeOut.text || '';
      const nudge = bridgeOut.nextCalmStep || bridgeOut.gentleNudge || bridgeOut.nextStep || bridgeOut.watchout || '';
      return `
        <div class="wse-wood-panel warm-tint">
          <h4 class="wse-panel-title">${esc(title)}</h4>
          <p class="wse-panel-sub" style="margin-bottom:${nudge ? '8px' : '0'}">${esc(body)}</p>
          ${nudge ? `<div style="font-size:12.5px;font-weight:700;color:#6b4417">${esc(nudge)}</div>` : ''}
        </div>
      `;
    }

    // Yerleşik sakin dost yansıması
    let calmMsg = 'Kilerin dengeli biçimde nefes alıyor. Acele al-sat yerine gerçek ihtiyaç üreten atölyelere ve vergisiz kira kalkanına yaslanmak gemiyi fırtınada dik tutar.';
    if (snap.spotItems.length === 0 && snap.tranches.length === 0) {
      calmMsg = 'Şu an tüm paran ahşap masanın üstünde açıkta bekliyor. Mutfak enflasyonu her gün banknotların ucundan sessizce kemirir; bir kısmını Taş Han veya Kira Kalkanına koyarak koruyabilirsin.';
    } else if (snap.largestSingleSharePct >= 68) {
      calmMsg = `Varlığının %${snap.largestSingleSharePct} kadarı tek bir sepette toplanmış. Tek direkli gemi rüzgârda sert yatar; kileri en az iki-üç farklı sağlam zemine yaymak huzur verir.`;
    }
    return `
      <div class="wse-wood-panel warm-tint">
        <h4 class="wse-panel-title">Görmüş Geçirmiş Dost Aynası</h4>
        <p class="wse-panel-sub" style="margin-bottom:0">${esc(calmMsg)}</p>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 7A. İÇ MEKÂN 1: BİZİM EV — 5 RAFLI ERZAK DOLABI, AHŞAP MASA VE DOST AYNASI
  // --------------------------------------------------------------------------
  function renderHomePantryBody(bodyEl, headerKickerEl, headerTitleEl) {
    const K = getKernel();
    const member = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(member);
    const idle = member.idleErosionLog || { cumulativeInflationLossTL: 0, missedSukukNetTL: 0 };

    headerKickerEl.textContent = 'Bizim Ev · Kiler ve Ahşap Masa';
    headerTitleEl.textContent = `${member.name} — Evimizin Erzak Dolabı (${snap.freedomMonths} Ay Güvende)`;

    const shelfDefs = [
      { minM: 0, targetM: 1, label: '1. Raf: İlk 1 Aylık Acil Ekmek & Fatura', kind: 'bread' },
      { minM: 1, targetM: 3, label: '2. Raf: 3 Aylık Kışlık Erzak Kavanozları', kind: 'jar' },
      { minM: 3, targetM: 6, label: '3. Raf: 6 Aylık İşsizlik & Fırtına Kalkanı', kind: 'jar' },
      { minM: 6, targetM: 12, label: '4. Raf: 1 Yıllık Tam Aile Nefes Payı', kind: 'deed' },
      { minM: 12, targetM: 24, label: '5. Raf: 2+ Yıl Kendi Kendini Besleyen Bahçe', kind: 'deed' }
    ];

    const shelvesHtml = shelfDefs.map((sh) => {
      const fm = snap.freedomMonths || 0;
      const ratio = clamp((fm - sh.minM) / (sh.targetM - sh.minM), 0, 1);
      const itemCount = Math.round(ratio * 4);
      const statusTxt = ratio >= 1
        ? 'Tam Dolu'
        : ratio > 0
          ? `%${Math.round(ratio * 100)} Doldu`
          : 'Henüz Boş Raf';
      return `
        <div class="wse-shelf-row ${ratio >= 0.99 ? 'is-filled' : ''}">
          <div class="wse-shelf-info">
            <span class="wse-shelf-name">${esc(sh.label)}</span>
            <span class="wse-shelf-status">${statusTxt}</span>
          </div>
          <div class="wse-shelf-goods">
            ${itemCount > 0 ? svgShelfGoods(itemCount, sh.kind) : '<span style="font-size:11px;opacity:0.55">Boş</span>'}
          </div>
        </div>
      `;
    }).join('');

    const cashRatioKeep = snap.cashTL > 0
      ? clamp(100 - ((idle.cumulativeInflationLossTL || 0) / Math.max(1, snap.cashTL + (idle.cumulativeInflationLossTL || 0))) * 100, 62, 99)
      : 100;

    bodyEl.innerHTML = `
      ${lastOrderFeedback ? `<div class="wse-feedback-banner ${lastOrderFeedback.ok ? 'ok' : 'err'}">${esc(formatPlainLensText(lastOrderFeedback.text))}</div>` : ''}

      <div class="wse-room-grid two-col">
        <div class="wse-wood-panel">
          <h3 class="wse-panel-title">5 Raflı Kışlık Erzak Dolabı</h3>
          <p class="wse-panel-sub">
            Vergiler düşülmüş gerçek net varlığın <strong>${fmtTL(snap.totalNetWorthTL)}</strong>.
            Evin aylık gideri (${fmtTL(snap.monthlyExpense)}) hesaba katıldığında dolabın seni <strong>${snap.freedomMonths} ay</strong> boyunca kimseye muhtaç etmez.
          </p>
          <div class="wse-cupboard">${shelvesHtml}</div>
        </div>

        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="wse-wood-panel">
            <h3 class="wse-panel-title">Ahşap Masadaki Açık Banknot Destesi</h3>
            <p class="wse-panel-sub">
              Hemen harcanabilir nakit: <strong>${fmtTL(snap.cashTL)}</strong>.
              Masada boş bekleyen kağıt para mutfak enflasyonunda her gün sessizce küçülür.
            </p>
            <div class="wse-banknote-bar" title="Enflasyon erimesi görseli">
              <div class="wse-note-keep" style="width:${cashRatioKeep}%"></div>
              <div class="wse-note-slice" style="width:${100 - cashRatioKeep}%"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-top:6px;color:#5c4f42">
              <span>Eriyen Alım Gücü: <strong>-${fmtTL(idle.cumulativeInflationLossTL)}</strong></span>
              <span>Kaçan Kira Kavanozu: <strong>+${fmtTL(idle.missedSukukNetTL)}</strong></span>
            </div>
          </div>

          ${(snap.unsettledTL > 0 || snap.pendingOrderTL > 0) ? `
            <div class="wse-wood-panel warm-tint">
              <div class="wse-jar-left">
                ${svgHourglassIcon()}
                <div class="wse-jar-meta">
                  <strong>Verandadaki Cam Kum Saati İşliyor</strong>
                  <span>
                    Satılan atölye payından gelecek takas nakdi: <strong>${fmtTL(snap.unsettledTL)}</strong> (2 iş günü dolmadan döviz/altın alınamaz) ·
                    Sırada bekleyen emir: <strong>${fmtTL(snap.pendingOrderTL)}</strong>
                  </span>
                </div>
              </div>
            </div>
          ` : ''}

          ${renderFriendMirrorHtml(member, snap)}
        </div>
      </div>

      <div class="wse-wood-panel">
        <h3 class="wse-panel-title">Mühürlü Cam Kavanozlar & Ortaklık Sepetleri</h3>
        <p class="wse-panel-sub">Her vadeli kavanoz kendi mühür gününü taşır; süresi dolmadan kapağını kırarsan biriken faiz dökülür.</p>

        <div class="wse-jar-list">
          ${snap.tranches.map((tr) => {
            const earlyWarn = tr.isTermDeposit && !tr.isMatured;
            const assetObj = K.getAsset(tr.assetKey);
            const human = describeAssetHumanSafe(assetObj || { name: tr.name, key: tr.assetKey }, languageLens);
            return `
              <div class="wse-jar-card ${earlyWarn ? 'sealed-warn' : ''}">
                <div class="wse-jar-left">
                  ${svgJarIcon(earlyWarn)}
                  <div class="wse-jar-meta">
                    <strong>${esc(human.displayTitle)}</strong>
                    <span>
                      Anapara: ${fmtTL(tr.principalTL)} · Biriken Net: <strong>+${fmtTL(tr.netInterestTL)}</strong>
                      ${earlyWarn ? ` · Mühür açılışına <strong>${tr.remainingDays} gün</strong> var!` : ' · Hemen nakde çevrilebilir'}
                    </span>
                  </div>
                </div>
                <button type="button" class="wse-btn ${earlyWarn ? 'danger' : ''}" data-break-tranche="${esc(tr.id)}">
                  ${earlyWarn ? `Mührü Kır (${fmtTL(tr.forfeitedIfBrokenEarlyTL)} Yanar)` : 'Kavanozu Boşalt'}
                </button>
              </div>
            `;
          }).join('')}

          ${snap.spotItems.map((it) => {
            const assetObj = K.getAsset(it.assetKey);
            const human = describeAssetHumanSafe(assetObj || it, languageLens);
            return `
              <div class="wse-jar-card">
                <div class="wse-jar-left">
                  ${svgJarIcon(false)}
                  <div class="wse-jar-meta">
                    <strong>${esc(human.displayTitle)} (${it.qty} adet)</strong>
                    <span>
                      Vergi sonrası net değer: <strong>${fmtTL(it.netValTL)}</strong>
                      (${it.pnlNetTL >= 0 ? '+' : ''}${fmtTL(it.pnlNetTL)} / ${it.pnlNetPct >= 0 ? '+' : ''}%${it.pnlNetPct})
                    </span>
                  </div>
                </div>
                <button type="button" class="wse-btn" data-goto-shop="${esc(it.assetKey)}">Dükkâna Git</button>
              </div>
            `;
          }).join('')}

          ${snap.tranches.length === 0 && snap.spotItems.length === 0 ? `
            <div style="padding:10px 4px;font-size:13.5px;color:#5c4f42">
              Raflarda henüz mühürlü kavanoz veya dükkân ortaklığı yok. Kasabaya çıkıp Mahalle Fırınına, Taş Han Sarrafına veya Kira Kalkanına uğrayabilirsin.
            </div>
          ` : ''}
        </div>
      </div>

      ${(member.footprints || []).length > 0 ? `
        <div class="wse-wood-panel">
          <h3 class="wse-panel-title">Yaşanmış Karar İzleri</h3>
          <div class="wse-jar-list">
            ${member.footprints.slice(0, 5).map((fp) => `
              <div class="wse-jar-card">
                <div class="wse-jar-meta">
                  <strong>${esc(formatPlainLensText(fp.title))}</strong>
                  <span>${esc(formatPlainLensText(fp.detail))}</span>
                </div>
                ${fp.leakTL > 0 ? `<strong style="color:#b84326">-${fmtTL(fp.leakTL)}</strong>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="wse-wood-panel">
        <h3 class="wse-panel-title">Ev Faturası ve Maaş Günü Defteri</h3>
        <div class="wse-room-grid two-col">
          <label style="font-size:13px;font-weight:700">
            Aylık Ev Gideri (TL)
            <input id="wseInpExpense" class="wse-input" type="number" min="5000" step="1000" value="${member.monthlyExpenseTL}" />
          </label>
          <label style="font-size:13px;font-weight:700">
            Maaş Günü
            <select id="wseSelSalaryDay" class="wse-select">
              <option value="1" ${Number(member.salaryDay) === 1 ? 'selected' : ''}>Her Ayın 1'i</option>
              <option value="15" ${Number(member.salaryDay) !== 1 ? 'selected' : ''}>Her Ayın 15'i</option>
            </select>
          </label>
          <label style="font-size:13px;font-weight:700">
            Aylık Kenara Konan Taze Birikim (TL)
            <input id="wseInpSavings" class="wse-input" type="number" min="0" step="500" value="${member.monthlySavingsTL}" />
          </label>
          <label style="font-size:13px;font-weight:700">
            Temiz Başlangıç Nakdi (İsteğe Bağlı Sıfırlama)
            <input id="wseInpResetCash" class="wse-input" type="number" min="0" step="5000" placeholder="Dokunmak istemiyorsan boş bırak" />
          </label>
        </div>
        <div style="margin-top:12px">
          <button type="button" class="wse-btn primary" id="wseSaveHomeBtn">Ev Defterini Kaydet</button>
        </div>
      </div>
    `;

    bodyEl.querySelectorAll('[data-break-tranche]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = K.executeOrder({ side: 'BREAK_TRANCHE', trancheId: btn.getAttribute('data-break-tranche') });
        if (res.ok) {
          res.status === 'BROKEN_EARLY' ? WorldAudio.shutter() : WorldAudio.coin();
          lastOrderFeedback = { ok: true, text: res.message };
        } else {
          WorldAudio.knock();
          lastOrderFeedback = { ok: false, text: res.reason };
        }
        renderInterior();
      });
    });

    bodyEl.querySelectorAll('[data-goto-shop]').forEach((btn) => {
      btn.addEventListener('click', () => {
        WorldAudio.bell();
        openWorkshop(btn.getAttribute('data-goto-shop'));
      });
    });

    bodyEl.querySelector('#wseSaveHomeBtn')?.addEventListener('click', () => {
      const exp = Number(bodyEl.querySelector('#wseInpExpense')?.value) || 35000;
      const salDay = Number(bodyEl.querySelector('#wseSelSalaryDay')?.value) === 1 ? 1 : 15;
      const sav = Number(bodyEl.querySelector('#wseInpSavings')?.value) || 0;
      const rstRaw = bodyEl.querySelector('#wseInpResetCash')?.value;
      const payload = { monthlyExpenseTL: exp, salaryDay: salDay, monthlySavingsTL: sav };
      if (rstRaw && Number(rstRaw) >= 1000) payload.resetCashBaselineTL = Number(rstRaw);
      K.updateHouseholdBaseline(payload);
      WorldAudio.coin();
      lastOrderFeedback = { ok: true, text: 'Ev gideri ve maaş günü ayarların kiler defterine işlendi.' };
      renderInterior();
    });
  }

  // --------------------------------------------------------------------------
  // 7B. İÇ MEKÂN 2: SALON ÇAY MASASI — YUVARLAK AİLE MASASI & IPHONE EŞİTLEME
  // --------------------------------------------------------------------------
  function renderTeaTableBody(bodyEl, headerKickerEl, headerTitleEl) {
    const K = getKernel();
    const state = K.getState();
    const activeMember = K.getActiveMember();

    headerKickerEl.textContent = 'Bahçe Çardağı · Aile Çay Masası';
    headerTitleEl.textContent = 'Semaver Başında Açık Kilerler ve Dost Sohbeti';

    const memberSnaps = (state.members || []).map((m) => ({
      member: m,
      snap: K.evaluateMemberPortfolio(m)
    }));

    // Fırtınada gemisini en sağlam tutan (enflasyon sonrası reel koruma + tek sepete yığmama)
    memberSnaps.sort((a, b) => (b.snap.realPurchasingPnlPct - a.snap.realPurchasingPnlPct));
    const safestId = memberSnaps[0]?.member.id;

    const seatsHtml = memberSnaps.map(({ member, snap }) => {
      const isCurrent = member.id === activeMember.id;
      const isSafest = member.id === safestId;
      const lastMove = (member.tradeHistory || [])[0];
      const lastMoveAsset = lastMove && lastMove.assetKey ? K.getAsset(lastMove.assetKey) : null;
      const lastMoveLabel = lastMove
        ? (lastMoveAsset ? describeAssetHumanSafe(lastMoveAsset, languageLens).displayTitle : formatPlainLensText(lastMove.name))
        : '';
      const topBasket = snap.spotItems.slice(0, 2).map((s) => {
        const a = K.getAsset(s.assetKey);
        return describeAssetHumanSafe(a || s, languageLens).displayTitle;
      });
      if (snap.tranches.length > 0) topBasket.unshift('Mühürlü Kavanoz / Kalkan');
      if ((member.pendingOrders || []).length > 0) topBasket.push('Kurye/Açılış Sırasında');
      if ((member.settlementQueue || []).length > 0) topBasket.push('Kum Saatinde');
      const basketLine = topBasket.length > 0 ? topBasket.join(' · ') : 'Tümü Açık Nakitte';

      return `
        <div class="wse-tea-seat ${isCurrent ? 'is-active-member' : ''}" data-seat-member="${esc(member.id)}">
          <div class="wse-tea-seat-head">
            <strong>${esc(member.name)} (${esc(member.roleLabel)})</strong>
            <span class="wse-calm-badge ${isSafest ? '' : 'stormy'}">
              ${isSafest ? 'En Sağlam Gemi' : `${snap.freedomMonths} Ay Kiler`}
            </span>
          </div>
          <div style="font-size:12.5px;color:#4a3525">
            Net Kiler: <strong>${fmtTL(snap.totalNetWorthTL)}</strong> · Reel Durum: <strong>${snap.realPurchasingPnlPct >= 0 ? '+' : ''}%${snap.realPurchasingPnlPct}</strong>
          </div>
          <div style="font-size:12px;color:#5c4f42">Açık Sepeti: <strong>${esc(basketLine)}</strong></div>
          <div style="font-size:11.8px;color:#7d6e5d">
            Son Hamle: ${lastMove ? `${esc(lastMoveLabel)} (${fmtTL(lastMove.amountTL)})` : 'Henüz hamle yapmadı'}
          </div>
          <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap">
            <button type="button" class="wse-btn" style="min-height:44px;padding:6px 10px;font-size:12px" data-switch-seat="${esc(member.id)}">
              ${isCurrent ? 'Masadaki Koltuğun' : 'Bu Koltuğa Geç'}
            </button>
            <button type="button" class="wse-btn warm" style="min-height:44px;padding:6px 10px;font-size:12px" data-quipto="${esc(member.name)}" data-quipmove="${esc(lastMove ? lastMoveLabel : 'açık nakitte bekleyiş')}">
              Bu Hamleye Laf At
            </button>
          </div>
        </div>
      `;
    }).join('');

    bodyEl.innerHTML = `
      ${lastOrderFeedback ? `<div class="wse-feedback-banner ${lastOrderFeedback.ok ? 'ok' : 'err'}">${esc(formatPlainLensText(lastOrderFeedback.text))}</div>` : ''}

      <div class="wse-tea-arena">
        <div style="text-align:center;max-width:560px">
          <strong style="font-size:15px;color:#2b1f17">Yuvarlak Çay Masası — Gizli Saklı Yok, Herkesin Sepeti Açık</strong>
          <div style="font-size:12.5px;color:#5c4f42;margin-top:3px">
            Kimin mutfak yangınına karşı gemisini koruduğu, kimin gece banka makasına yakalandığı masada dostça konuşulur.
          </div>
        </div>
        <div class="wse-tea-seats-ring">${seatsHtml}</div>
      </div>

      <div class="wse-room-grid two-col">
        <div class="wse-wood-panel">
          <h3 class="wse-panel-title">Çay Sohbeti & Dostça Takılma</h3>
          <div class="wse-quick-chips" style="margin-bottom:10px">
            <button type="button" class="wse-chip-btn" data-quick-tea="Çaylar demli, kiler sağlam; fırtınada panik yok!">Çaylar Benden</button>
            <button type="button" class="wse-chip-btn" data-quick-tea="Gece 18:30 sonrası banka makasına dikkat edin, kepenk açılışını bekleyin!">Gece Makası Uyarısı</button>
            <button type="button" class="wse-chip-btn" data-quick-tea="Tüm yumurtaları tek dükkâna yığmayalım, sepeti yayalım.">Sepeti Yayalım</button>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <input id="wseTeaInput" class="wse-input" type="text" maxlength="200" placeholder="Masaya sıcak bir not bırak..." />
            <button type="button" class="wse-btn primary" id="wseSendTeaBtn">Gönder</button>
          </div>
          <div class="wse-banter-feed">
            ${(state.banterFeed || []).slice(0, 12).map((b) => `
              <div class="wse-banter-bubble">
                <strong>${esc(b.authorName)}</strong>${b.targetName ? ` -> <strong>${esc(b.targetName)}</strong>` : ''}:
                ${esc(b.text)}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="wse-wood-panel">
            <h3 class="wse-panel-title">Masaya Yeni Aile Sandalyesi Ekle</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              <input id="wseNewMemName" class="wse-input" type="text" placeholder="İsim (Örn: Ayşe)" />
              <input id="wseNewMemRole" class="wse-input" type="text" placeholder="Rol (Örn: Ev Kaptanı)" />
              <input id="wseNewMemExp" class="wse-input" type="number" min="5000" step="1000" value="35000" placeholder="Aylık Gider" />
              <input id="wseNewMemCash" class="wse-input" type="number" min="1000" step="5000" value="100000" placeholder="Başlangıç Nakdi" />
            </div>
            <button type="button" class="wse-btn dark" id="wseAddMemBtn" style="margin-top:10px;width:100%">Yeni Sandalye Çek</button>
          </div>

          <div class="wse-wood-panel warm-tint">
            <h3 class="wse-panel-title">Farklı Telefonları Tek Dokunuşla Eşitle</h3>
            <p class="wse-panel-sub">Ailenin farklı iPhone veya bilgisayarlarını bağlamak için kanonik bağlantıyı gönder veya AETHER-SALON kodunu yapıştır.</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px">
              <button type="button" class="wse-btn primary" id="wseShareLinkBtn">Kanonik Bağlantıyı Paylaş / Kopyala</button>
              <button type="button" class="wse-btn" id="wseCopyCodeBtn">AETHER-SALON Kodunu Kopyala</button>
            </div>
            <div style="display:flex;gap:8px">
              <input id="wseImportSyncInput" class="wse-input" type="text" placeholder="AETHER-SALON:... kodunu buraya yapıştır" />
              <button type="button" class="wse-btn dark" id="wseImportSyncBtn">Birleştir</button>
            </div>
          </div>
        </div>
      </div>
    `;

    bodyEl.querySelectorAll('[data-switch-seat]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        K.switchActiveMember(btn.getAttribute('data-switch-seat'));
        WorldAudio.bell();
        renderInterior();
      });
    });

    bodyEl.querySelectorAll('[data-quipto]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const target = btn.getAttribute('data-quipto');
        const move = btn.getAttribute('data-quipmove');
        const text = `${target}, son "${move}" hamleni gördüm; çayı koy da gerekçesini masada dinleyelim!`;
        K.postTeaBanter(text, target);
        WorldAudio.bell();
        renderInterior();
      });
    });

    bodyEl.querySelectorAll('[data-quick-tea]').forEach((btn) => {
      btn.addEventListener('click', () => {
        K.postTeaBanter(btn.getAttribute('data-quick-tea'));
        WorldAudio.softClick();
        renderInterior();
      });
    });

    bodyEl.querySelector('#wseSendTeaBtn')?.addEventListener('click', () => {
      const inp = bodyEl.querySelector('#wseTeaInput');
      if (inp && inp.value.trim()) {
        K.postTeaBanter(inp.value.trim());
        WorldAudio.bell();
        renderInterior();
      }
    });

    bodyEl.querySelector('#wseAddMemBtn')?.addEventListener('click', () => {
      const nm = bodyEl.querySelector('#wseNewMemName')?.value;
      const rl = bodyEl.querySelector('#wseNewMemRole')?.value;
      const ex = Number(bodyEl.querySelector('#wseNewMemExp')?.value) || 35000;
      const cs = Number(bodyEl.querySelector('#wseNewMemCash')?.value) || 100000;
      const res = K.addFamilyMember(nm, rl, ex, cs);
      if (res.ok) {
        WorldAudio.coin();
        lastOrderFeedback = { ok: true, text: `${res.member.name} için çay masasına yeni sandalye eklendi.` };
      } else {
        WorldAudio.knock();
        lastOrderFeedback = { ok: false, text: res.reason };
      }
      renderInterior();
    });

    bodyEl.querySelector('#wseShareLinkBtn')?.addEventListener('click', async () => {
      const pkt = K.exportFamilySharePacket();
      WorldAudio.coin();
      if (global.navigator?.share) {
        try {
          await global.navigator.share({ title: 'Aile Çay Masası Paketi', url: pkt.shareUrl });
          return;
        } catch (_) {}
      }
      try { await global.navigator.clipboard.writeText(pkt.shareUrl); } catch (_) {}
      lastOrderFeedback = { ok: true, text: 'Kanonik Aile Bağlantısı panoya kopyalandı; WhatsApp veya Mesajlar ile gönderebilirsin.' };
      renderInterior();
    });

    bodyEl.querySelector('#wseCopyCodeBtn')?.addEventListener('click', async () => {
      const pkt = K.exportFamilySharePacket();
      try { await global.navigator.clipboard.writeText(pkt.syncCode); } catch (_) {}
      WorldAudio.coin();
      lastOrderFeedback = { ok: true, text: 'AETHER-SALON eşitleme kodu kopyalandı.' };
      renderInterior();
    });

    bodyEl.querySelector('#wseImportSyncBtn')?.addEventListener('click', () => {
      const raw = bodyEl.querySelector('#wseImportSyncInput')?.value || '';
      const res = K.importFamilySharePacket(raw);
      if (res.ok) {
        WorldAudio.bell();
        lastOrderFeedback = { ok: true, text: `${res.count} aile üyesinin kileri masayla birleştirildi.` };
      } else {
        WorldAudio.knock();
        lastOrderFeedback = { ok: false, text: res.reason };
      }
      renderInterior();
    });
  }

  // --------------------------------------------------------------------------
  // 7C. İÇ MEKÂN 3: DÜKKÂN ARKA MUTFAĞI, 672 ATÖLYE REHBERİ VE İKİ KAPILI GİŞE
  // --------------------------------------------------------------------------
  function buildWorkshopBackKitchenHtml(asset) {
    const K = getKernel();
    const dInfo = K.getDarphanePremiumInfo();
    const infPct = K.getAnnualInflationPct();

    // 1) Altın ve Sertifika Tartısı (Fiziki Külçe vs Hava Parası Balonu)
    if (asset.subVenue === 'DARPHANE_S1' || asset.id === 'gram-altin-spot') {
      const warn = dInfo.premiumPct >= 4;
      return `
        <div class="wse-wood-panel ${warn ? 'warm-tint' : ''}">
          <h4 class="wse-panel-title">İki Kefeli Pirinç Terazi: Fiziki Külçe vs Kağıt Sertifika Balonu</h4>
          <svg viewBox="0 -34 420 156" style="width:100%;max-width:440px;height:auto;display:block;margin:6px auto" aria-hidden="true">
            <rect x="190" y="106" width="40" height="8" rx="3" fill="#6b4423" />
            <line x1="210" y1="106" x2="210" y2="32" stroke="#c98a1e" stroke-width="5" />
            <g transform="translate(210,36) rotate(${warn ? -9 : 0})">
              <line x1="-110" y1="0" x2="110" y2="0" stroke="#c98a1e" stroke-width="4" />
              <line x1="-100" y1="0" x2="-100" y2="38" stroke="#785323" stroke-width="2" />
              <rect x="-132" y="38" width="64" height="22" rx="4" fill="#f59e0b" stroke="#92400e" stroke-width="2" />
              <text x="-100" y="53" text-anchor="middle" font-size="11" font-weight="800" fill="#2b1f17">Fiziki Külçe</text>
              <line x1="100" y1="0" x2="100" y2="-10" stroke="#94a3b8" stroke-width="2" />
              <ellipse cx="100" cy="-24" rx="42" ry="18" fill="#dc2626" />
              <text x="100" y="-20" text-anchor="middle" font-size="10.5" font-weight="800" fill="#ffffff">+%${dInfo.premiumPct} Balon</text>
            </g>
          </svg>
          <p class="wse-panel-sub" style="margin-bottom:0">
            Taş Han’da 1 gram gerçek fiziki altın <strong>${fmtTL(dInfo.spotGramPrice)}</strong> iken, borsadaki kağıt kuponun 1 gram karşılığı <strong>${fmtTL(dInfo.s1GramEquiv)}</strong>.
            Aradaki <strong>${fmtTL(dInfo.diffTL)} (+%${dInfo.premiumPct})</strong> fark malın kendisi değil, kalabalığın ödediği hava parasıdır!
          </p>
        </div>
      `;
    }

    // 2) Kira Kalkanı / Mevduat / Fon: Vergi Sonrası Net Kavanoz vs Mutfak Enflasyonu
    if (asset.isRateInstrument) {
      const netRate = +(asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100)).toFixed(2);
      const beatsInf = netRate >= infPct;
      const netH = clamp(Math.round((netRate / Math.max(60, infPct, netRate)) * 68), 16, 70);
      const infH = clamp(Math.round((infPct / Math.max(60, infPct, netRate)) * 68), 16, 70);
      return `
        <div class="wse-wood-panel ${beatsInf ? '' : 'warm-tint'}">
          <h4 class="wse-panel-title">Kavanoz Hesabı: Vergi Kesildikten Sonra Mutfak Yangınını Geçiyor mu?</h4>
          <svg viewBox="0 0 380 112" style="width:100%;max-width:400px;height:auto;display:block;margin:6px auto" aria-hidden="true">
            <rect x="65" y="18" width="84" height="78" rx="12" fill="#e0f2fe" stroke="#475569" stroke-width="2" />
            <rect x="69" y="${92 - netH}" width="76" height="${netH}" rx="8" fill="#1f6f4a" />
            <text x="107" y="108" text-anchor="middle" font-size="11" font-weight="800" fill="#241c15">Net Kavanoz %${netRate}</text>

            <rect x="230" y="18" width="84" height="78" rx="12" fill="#fef2f2" stroke="#991b1b" stroke-width="2" />
            <rect x="234" y="${92 - infH}" width="76" height="${infH}" rx="8" fill="#dc2626" />
            <text x="272" y="108" text-anchor="middle" font-size="11" font-weight="800" fill="#7f1d1d">Mutfak Yangını %${infPct.toFixed(1)}</text>
          </svg>
          <p class="wse-panel-sub" style="margin-bottom:0">
            Brüt tabela rakamına (%${asset.annualGrossRatePct.toFixed(1)}) aldanma; <strong>%${asset.stopajPct} vergi</strong> kesildikten sonra cebine net <strong>%${netRate}</strong> kalır.
          </p>
        </div>
      `;
    }

    // 3) Üretim ve Ticaret Atölyesi: Kasa Çekmecesi vs Kağıt Balonu + Borç Çuvalı vs Nakit Yastığı
    if (asset.bistRow) {
      K.markInspectedCashScale();
      const r = asset.bistRow;
      const ocf = Number(r.ocfMillionTL) || 0;
      const netInc = Number(r.netIncomeMillionTL) || 0;
      const cash = Number(r.cashMillionTL) || 0;
      const debt = Number(r.totalDebtMillionTL) || 0;
      const paperTrap = netInc > 0 && ocf < 0;
      const heavyDebt = debt > Math.max(100, cash * 2.4);
      const isHerdAlert = Boolean(asset.isPumpAnomaly) || ((Number(r.relVol) || 1) >= 1.5 && (Number(r.cmf20) || 0) <= -0.08);

      return `
        <div class="wse-wood-panel ${paperTrap || isHerdAlert ? 'warm-tint' : ''}">
          <h4 class="wse-panel-title">Arka Mutfak Görsel Kantarı: Kasa Çekmecesi ve Borç Çuvalı</h4>
          <div class="wse-room-grid two-col" style="margin-top:8px">
            <div class="wse-pipe-node">
              <strong style="font-size:13px;display:block;margin-bottom:6px">1. Kasaya Giren Nakit vs Kağıt Üstü Kâr</strong>
              <svg viewBox="0 0 250 86" style="width:100%;height:auto" aria-hidden="true">
                <!-- Ahşap Kasa Çekmecesi -->
                <rect x="14" y="38" width="96" height="34" rx="6" fill="#6b4423" />
                <rect x="22" y="26" width="80" height="16" rx="3" fill="${ocf >= 0 ? '#22c55e' : '#ef4444'}" />
                <text x="62" y="83" text-anchor="middle" font-size="10" font-weight="800" fill="#241c15">Çekmece: ${ocf >= 0 ? '+' : ''}${ocf.toLocaleString('tr-TR')}M</text>
                <!-- Kağıt Kâr Balonu -->
                <ellipse cx="188" cy="36" rx="40" ry="22" fill="${paperTrap ? '#f59e0b' : '#cbd5e1'}" />
                <text x="188" y="40" text-anchor="middle" font-size="10" font-weight="800" fill="#1e293b">Defter: ${netInc >= 0 ? '+' : ''}${netInc.toLocaleString('tr-TR')}M</text>
              </svg>
              <div style="font-size:12px;color:#4a3525;margin-top:4px">
                ${paperTrap
                  ? 'Dikkat: Defterde kağıt üstü kâr yazıyor ama dükkânın nakit çekmecesinden para eksilmiş!'
                  : 'Sağlam: Satılan malın faturası gerçekten kasa çekmecesine nakit olarak giriyor.'}
              </div>
            </div>

            <div class="wse-pipe-node">
              <strong style="font-size:13px;display:block;margin-bottom:6px">2. Nakit Yastığı vs Sırtındaki Borç Çuvalı</strong>
              <svg viewBox="0 0 250 86" style="width:100%;height:auto" aria-hidden="true">
                <!-- Yeşil Nakit Yastığı -->
                <rect x="16" y="36" width="90" height="32" rx="12" fill="#34d399" stroke="#065f46" stroke-width="2" />
                <text x="61" y="56" text-anchor="middle" font-size="10" font-weight="800" fill="#064e3b">${cash.toLocaleString('tr-TR')}M Yastık</text>
                <!-- Kahverengi Borç Çuvalı -->
                <ellipse cx="186" cy="48" rx="${heavyDebt ? 44 : 30}" ry="${heavyDebt ? 26 : 19}" fill="${heavyDebt ? '#b84326' : '#a8a29e'}" />
                <text x="186" y="52" text-anchor="middle" font-size="10" font-weight="800" fill="#ffffff">${debt.toLocaleString('tr-TR')}M Borç</text>
              </svg>
              <div style="font-size:12px;color:#4a3525;margin-top:4px">
                ${heavyDebt
                  ? 'Sırtındaki borç çuvalı hazır parasından ağır; kredi faizi yükseldiğinde terler.'
                  : 'Kasasındaki nakit yastığı güçlü; fırtınada bankaya el açmadan ayakta durur.'}
              </div>
            </div>
          </div>
          ${isHerdAlert ? `
            <div class="wse-feedback-banner err" style="margin-top:10px">
              Gürültülü Dedikodu Meydanı Uyarısı: Bu tahtada kalabalık megafonla bağırırken içeriden sessizce mal boşaltılıyor olabilir!
            </div>
          ` : ''}
        </div>
      `;
    }

    return '';
  }

  function buildWorkshopPipeHtml(asset, human) {
    const K = getKernel();
    const custom = WORKSHOP_PIPES[asset.ticker];

    let panelTitle = 'Nereden Beslenir, Kime Mal Satar?';
    let step1Label = '1. GİREN HAMMADDE';
    let step2Label = '2. ÇALIŞAN ATÖLYE';
    let step3Label = '3. KASAYI DOLDURAN MÜŞTERİ';
    let upTxt = custom ? custom.up : 'Enerji, Hammadde ve Emek Girişi';
    let midTxt = custom ? custom.work : human.plainName;
    let downTxt = custom ? custom.down : 'Müşteriye Kesilen Fatura ve Kasa Tahsilatı';

    if (!custom) {
      if (asset.subVenue === 'PHYSICAL_METAL' || asset.subVenue === 'DARPHANE_S1' || String(asset.id || '').includes('altin') || String(asset.id || '').includes('gumus')) {
        panelTitle = 'Değerini Nereden Alır, Evde Neyi Korur?';
        step1Label = '1. HAREKETE GEÇİREN GÜÇ';
        step2Label = '2. DEĞER SAKLAMA ARACI';
        step3Label = '3. EVDEKİ GÖREVİ';
        upTxt = 'Dünyada Karşılıksız Para Basımı ve Fırtına Korkusu';
        midTxt = human.plainName;
        downTxt = 'Fatura Kesip Yeni Ürün Üretmez; Alın Terinin Erimesini Önleyen Taş Kalkan Olur';
      } else if (asset.subVenue === 'FX_CASH') {
        panelTitle = 'Değerini Nereden Alır, Neden Boş Beklerse Aşınır?';
        step1Label = '1. HAREKETE GEÇİREN GÜÇ';
        step2Label = '2. YABANCI BANKNOT';
        step3Label = '3. EVDEKİ GERÇEĞİ';
        upTxt = 'İthalat Faturası ve İçerideki Mutfak Enflasyonu Farkı';
        midTxt = human.plainName;
        downTxt = 'Kur Sıçramasında Korur Ama Kendi Ülkesinin Enflasyonu Yüzünden Boş Beklerse Yavaşça Erir';
      } else if (asset.isRateInstrument) {
        panelTitle = 'Nereden Beslenir, Kavanoza Ne Bırakır?';
        step1Label = '1. BAĞLANAN ANAPARA';
        step2Label = '2. KİRA / VADE KAVANOZU';
        step3Label = '3. DÖNEN NET MEYVE';
        upTxt = 'Senin Kenara Ayırdığın Nakit Birikim';
        midTxt = human.plainName;
        downTxt = 'Süre Sonunda Kesintisi Düşülmüş Düzenli Kira / Getiri';
      } else if (asset.venue === 'CRYPTO_24_7') {
        panelTitle = 'Nereden Beslenir, Fırtınada Nasıl Davranır?';
        step1Label = '1. HAREKETE GEÇİREN GÜÇ';
        step2Label = '2. 7/24 AÇIK DİJİTAL AĞ';
        step3Label = '3. KİLERDEKİ SINAVI';
        upTxt = 'Küresel Para Bolluğu ve Risk İştahı';
        midTxt = human.plainName;
        downTxt = 'Bollukta Hızlı Katlanır, Para Çekildiğinde Sert Sallanır; Sabır ve Küçük Pay İster';
      }
    }

    return `
      <div class="wse-wood-panel">
        <h4 class="wse-panel-title">${esc(panelTitle)}</h4>
        <div class="wse-pipe-flow">
          <div class="wse-pipe-node">
            <div style="font-size:11px;font-weight:800;color:#7c5333">${esc(step1Label)}</div>
            <strong style="font-size:13px">${esc(upTxt)}</strong>
          </div>
          <div class="wse-pipe-arrow">-&gt;</div>
          <div class="wse-pipe-node center-workshop">
            <div style="font-size:11px;font-weight:800;color:#92400e">${esc(step2Label)}</div>
            <strong style="font-size:13px">${esc(midTxt)}</strong>
          </div>
          <div class="wse-pipe-arrow">-&gt;</div>
          <div class="wse-pipe-node">
            <div style="font-size:11px;font-weight:800;color:#1f6f4a">${esc(step3Label)}</div>
            <strong style="font-size:13px">${esc(downTxt)}</strong>
          </div>
        </div>
        ${custom && custom.peers ? `
          <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;align-items:center">
            <span style="font-size:12px;color:#5c4f42;font-weight:700">Aynı Zincirdeki Kardeş Dükkânlar:</span>
            ${custom.peers.map((p) => {
              const peerAsset = K ? K.getAsset(p) : null;
              const peerLabel = peerAsset ? describeAssetHumanSafe(peerAsset, languageLens).displayTitle : p;
              return `<button type="button" class="wse-chip-btn" style="min-height:44px" data-pick-asset="${esc(peerAsset ? peerAsset.key : p)}">${esc(peerLabel)}</button>`;
            }).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  function collectDistrictWorkshops(district, allAssets) {
    const K = getKernel();
    const out = [];
    const seen = new Set();

    // Dedikodu Meydanı ise megafon/pump anomalili hisseleri öne çıkar
    if (district && district.isHerdSquare) {
      for (const a of allAssets) {
        if (a.isPumpAnomaly || Math.abs(a.change1D || 0) >= 6.5) {
          if (!seen.has(a.key)) { seen.add(a.key); out.push(a); }
        }
        if (out.length >= 16) break;
      }
    }

    for (const k of (district?.primaryKeys || [])) {
      const a = K.getAsset(k);
      if (a && !seen.has(a.key)) { seen.add(a.key); out.push(a); }
    }

    const secSet = new Set(district?.bistSectors || []);
    for (const a of allAssets) {
      if (seen.has(a.key)) continue;
      if (secSet.has(a.categoryName)) {
        seen.add(a.key);
        out.push(a);
        if (out.length >= 28) break;
      }
    }
    return out;
  }

  function renderShopInteriorBody(bodyEl, headerKickerEl, headerTitleEl) {
    const K = getKernel();
    const clock = K.getTurkishClock();
    const member = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(member);
    const allAssets = K.getAllAssets();
    const district = WORLD_LANDMARKS.find((l) => l.id === activeDistrictId) || WORLD_LANDMARKS[2];

    let asset = K.getAsset(activeAssetKey);
    const districtList = collectDistrictWorkshops(district, allAssets);
    if (!asset) asset = districtList[0] || allAssets[0];
    if (!asset) return;
    activeAssetKey = asset.key;

    const human = describeAssetHumanSafe(asset, languageLens);
    const micro = K.inspectBoardMicrostructure(asset);
    const existingPos = member.positions?.[asset.key] || null;

    headerKickerEl.textContent = languageLens === 'BRIDGE' ? district.bridgeTitle : district.plainTitle;
    headerTitleEl.textContent = human.displayTitle;

    // 672+ Atölyede İnsan Dili Arama Süzgeci
    const q = shopSearchQuery.trim().toLocaleLowerCase('tr-TR');
    let visibleShops = districtList;
    if (q.length >= 1) {
      visibleShops = allAssets.filter((a) => {
        const h = describeAssetHumanSafe(a, 'BRIDGE');
        const hay = `${a.name} ${a.ticker} ${a.categoryName} ${h.plainName} ${h.everydayRole}`.toLocaleLowerCase('tr-TR');
        return hay.includes(q);
      }).slice(0, 36);
    }

    // İki Kapılı Banknot Kesici (Taş Han Sarraf vs 7/24 Gece Mobil Banka)
    let twoDoorHtml = '';
    if (asset.venue === 'TWO_DOOR') {
      const sampleTL = 20000;
      const bazLeak = Math.round(sampleTL * (clock.bazaarSpreadPct / 200));
      const bankLeak = Math.round(sampleTL * (clock.bankSpreadPct / 200 + 0.002));
      const bazKeepPct = clamp(100 - clock.bazaarSpreadPct * 4, 88, 99);
      const bankKeepPct = clamp(100 - (clock.bankSpreadPct + 0.4) * 4, 68, 96);

      twoDoorHtml = `
        <div class="wse-wood-panel">
          <h4 class="wse-panel-title">Hangi Kapıdan Alacaksın? (Banknotundan Kesilen Makas Dilimi)</h4>
          <div class="wse-two-door-grid">
            <button type="button" class="wse-door-card ${selectedDoor === 'BAZAAR' ? 'is-picked' : ''}" data-pick-door="BAZAAR">
              <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
                <strong>1. Kapı: Taş Han Sarrafı</strong>
                <span style="font-size:11.5px;font-weight:800;color:${clock.grandBazaarOpen ? '#1f6f4a' : '#b84326'}">
                  ${clock.grandBazaarOpen ? 'Kepenk Açık' : 'Demir Kepenk Kapalı (09:30-18:30)'}
                </span>
              </div>
              <div class="wse-banknote-bar">
                <div class="wse-note-keep" style="width:${bazKeepPct}%"></div>
                <div class="wse-note-slice" style="width:${100 - bazKeepPct}%"></div>
              </div>
              <span style="font-size:12px;color:#4a3525">
                Dar makas (%${clock.bazaarSpreadPct.toFixed(2)}) · Kambiyo Vergisi: <strong>0 TL</strong> · 20.000 TL’de kesinti ~${bazLeak} TL
              </span>
            </button>

            <button type="button" class="wse-door-card night-spread-warn ${selectedDoor === 'BANK' ? 'is-picked' : ''}" data-pick-door="BANK">
              <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
                <strong>2. Kapı: 7/24 Cam Banka</strong>
                <span style="font-size:11.5px;font-weight:800;color:${clock.bankDaytimeTight ? '#1f6f4a' : '#b84326'}">
                  ${clock.bankDaytimeTight ? 'Gündüz Makası' : 'Gece Geniş Makas Kesintisi!'}
                </span>
              </div>
              <div class="wse-banknote-bar">
                <div class="wse-note-keep" style="width:${bankKeepPct}%"></div>
                <div class="wse-note-slice" style="width:${100 - bankKeepPct}%"></div>
              </div>
              <span style="font-size:12px;color:#4a3525">
                Makas %${clock.bankSpreadPct.toFixed(2)} + <strong>Binde 2 Vergi</strong> · 20.000 TL’de eriyen dilim ~${bankLeak} TL
              </span>
            </button>
          </div>
        </div>
      `;
    }

    // Vadeli Kavanoz Süre Seçici
    let maturityHtml = '';
    if (asset.subVenue === 'TERM_DEPOSIT') {
      maturityHtml = `
        <div class="wse-wood-panel">
          <h4 class="wse-panel-title">Kavanoz Mühür Süresi (Uzun Vadede Vergi Düşer, Erken Açarsan Faiz Yanar)</h4>
          <div class="wse-quick-chips">
            <button type="button" class="wse-chip-btn" style="${selectedMaturityDays === 32 ? 'background:#2b1f17;color:#fbf7ee' : ''}" data-mat="32">32 Gün (%17,5 Vergi)</button>
            <button type="button" class="wse-chip-btn" style="${selectedMaturityDays === 181 ? 'background:#2b1f17;color:#fbf7ee' : ''}" data-mat="181">181 Gün (%15 Vergi)</button>
            <button type="button" class="wse-chip-btn" style="${selectedMaturityDays === 366 ? 'background:#2b1f17;color:#fbf7ee' : ''}" data-mat="366">366 Gün (%10 Vergi)</button>
          </div>
        </div>
      `;
    }

    bodyEl.innerHTML = `
      ${lastOrderFeedback ? `<div class="wse-feedback-banner ${lastOrderFeedback.ok ? 'ok' : 'err'}">${esc(formatPlainLensText(lastOrderFeedback.text))}</div>` : ''}

      <div class="wse-wood-panel">
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;margin-bottom:10px">
          <strong style="font-size:13.5px;color:#2b1f17">Sokaktaki Dükkânlar ve Tüm 672+ Türkiye Atölyesi</strong>
          <input id="wseShopSearchInp" class="wse-input" style="max-width:310px;min-height:44px" type="search" value="${esc(shopSearchQuery)}" placeholder="Ekmek, kamyon, altın, uçak veya kod ara..." />
        </div>
        <div class="wse-shop-sign-strip">
          ${visibleShops.map((a) => {
            const h = describeAssetHumanSafe(a, languageLens);
            const sel = a.key === asset.key;
            return `
              <button type="button" class="wse-shop-sign-btn ${sel ? 'is-selected' : ''}" data-pick-asset="${esc(a.key)}">
                <strong>${esc(h.displayTitle)}</strong>
                <small>${a.isRateInstrument ? `Brüt %${a.annualGrossRatePct.toFixed(1)}` : `${fmtUnitTL(a.priceTL)} (${a.change1D >= 0 ? '+' : ''}%${(a.change1D || 0).toFixed(1)})`}</small>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <div class="wse-wood-panel warm-tint">
        <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
          <div style="flex:1 1 260px">
            <strong style="font-size:15px;color:#2b1f17">${esc(human.everydayRole)}</strong>
            <div style="font-size:12.5px;color:#5c4f42;margin-top:4px">
              Birim Değer: <strong>${asset.isRateInstrument ? `Yıllık Brüt %${asset.annualGrossRatePct.toFixed(1)}` : fmtUnitTL(asset.priceTL)}</strong> ·
              Masadaki Nakdin: <strong>${fmtTL(snap.cashTL)}</strong>
              ${snap.unsettledTL > 0 ? ` · Kum Saatinde: <strong>${fmtTL(snap.unsettledTL)}</strong>` : ''}
            </div>
          </div>
          <button type="button" class="wse-btn dark" id="wseToggleUnmaskBtn">
            Gerçek Hayattaki Karşılığı Nedir?
          </button>
        </div>

        ${unmaskOpen ? `
          <div class="wse-unmask-card" style="margin-top:12px">
            <div style="font-size:11.5px;font-weight:800;color:#ffd58a;margin-bottom:4px">GERÇEK TÜRKİYE KARŞILIĞI VE KURALLARI</div>
            <div style="font-size:14.5px;font-weight:800;margin-bottom:4px">${esc(human.realName)}</div>
            <div style="font-size:13px;line-height:1.45;color:#f5ebd9">${esc(human.realWorldWhere)}</div>
            <div style="font-size:12px;line-height:1.4;color:#decab0;margin-top:6px">
              Gerçek Hayat Kuralı:
              ${asset.venue === 'BIST'
                ? `Mesai saatinde (10:00–18:00) anında eşleşir; mesai dışında sabah 10:00 açılış ziline yazılır. Satış yaptığında para 2 iş günü (T+2) takas kum saatinde bekler.`
                : asset.venue === 'TEFAS'
                  ? `İş günleri saat 13:30 valör saatinden önce girilen emir gününde işler; 13:30 sonrası ertesi iş günü valör sırasına girer.`
                  : asset.venue === 'TWO_DOOR'
                    ? `Taş Han/Kapalıçarşı 09:30–18:30 arası dar makas ve %0 vergiyle çalışır; banka ekranı 7/24 açıktır ama gece makası açılır ve binde 2 kambiyo vergisi kesilir.`
                    : `Gerçek piyasa saatleri ve stopaj kuralları birebir uygulanır.`}
            </div>
          </div>
        ` : ''}
      </div>

      ${micro.statusNote ? `<div class="wse-feedback-banner err">${esc(formatPlainLensText(micro.statusNote))}</div>` : ''}
      ${buildWorkshopBackKitchenHtml(asset)}
      ${buildWorkshopPipeHtml(asset, human)}
      ${twoDoorHtml}
      ${maturityHtml}

      <div class="wse-wood-panel">
        <h4 class="wse-panel-title">Canlı Gişe — Gerçek Türkiye Kurallarıyla Al veya Sat</h4>
        <div class="wse-quick-chips" style="margin-bottom:10px">
          <button type="button" class="wse-chip-btn" data-qamt="2500">2.500 TL</button>
          <button type="button" class="wse-chip-btn" data-qamt="10000">10.000 TL</button>
          <button type="button" class="wse-chip-btn" data-qamt="25000">25.000 TL</button>
          <button type="button" class="wse-chip-btn" data-qamt="${Math.max(100, Math.floor(snap.cashTL * 0.5))}">Masadaki Naktin Yarısı</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <input id="wseOrderAmtInp" class="wse-input" style="flex:1 1 180px" type="number" min="100" step="100" value="${Math.min(10000, Math.max(500, Math.floor(snap.cashTL * 0.25)))}" />
          <button type="button" class="wse-btn primary" id="wseExecBuyBtn" style="flex:1 1 200px">
            ${asset.isRateInstrument ? 'Mühürlü Kavanoz / Kalkan Bağla' : 'Kilerime Ekle (Al)'}
          </button>
        </div>

        ${existingPos && existingPos.qty > 0 ? `
          <div style="margin-top:14px;padding-top:12px;border-top:1.5px solid #e7dcc6;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px">
            <div style="font-size:13px;color:#2b1f17">
              Kilerinde <strong>${existingPos.qty} adet</strong> bulunuyor (Ortalama maliyet: ${fmtUnitTL(existingPos.avgCostTL)})
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <button type="button" class="wse-btn" data-sell-ratio="0.25">Çeyreğini Sat</button>
              <button type="button" class="wse-btn" data-sell-ratio="0.5">Yarısını Sat</button>
              <button type="button" class="wse-btn danger" data-sell-ratio="1">Tamamını Sat</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    const searchEl = bodyEl.querySelector('#wseShopSearchInp');
    if (searchEl) {
      searchEl.addEventListener('input', () => {
        shopSearchQuery = searchEl.value;
        const pos = searchEl.selectionStart || shopSearchQuery.length;
        renderInterior();
        const again = bodyEl.querySelector('#wseShopSearchInp');
        if (again) {
          again.focus();
          try { again.setSelectionRange(pos, pos); } catch (_) {}
        }
      });
    }

    bodyEl.querySelectorAll('[data-pick-asset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const picked = K.getAsset(btn.getAttribute('data-pick-asset'));
        if (picked) {
          activeAssetKey = picked.key;
          activeDistrictId = resolveDistrictIdForAsset(picked);
          lastOrderFeedback = null;
          WorldAudio.softClick();
          renderInterior();
        }
      });
    });

    bodyEl.querySelector('#wseToggleUnmaskBtn')?.addEventListener('click', () => {
      unmaskOpen = !unmaskOpen;
      WorldAudio.softClick();
      renderInterior();
    });

    bodyEl.querySelectorAll('[data-pick-door]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedDoor = btn.getAttribute('data-pick-door') === 'BANK' ? 'BANK' : 'BAZAAR';
        selectedDoor === 'BAZAAR' && !clock.grandBazaarOpen ? WorldAudio.shutter() : WorldAudio.softClick();
        renderInterior();
      });
    });

    bodyEl.querySelectorAll('[data-mat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedMaturityDays = Number(btn.getAttribute('data-mat')) || 32;
        WorldAudio.softClick();
        renderInterior();
      });
    });

    bodyEl.querySelectorAll('[data-qamt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const inp = bodyEl.querySelector('#wseOrderAmtInp');
        if (inp) inp.value = btn.getAttribute('data-qamt');
        WorldAudio.softClick();
      });
    });

    bodyEl.querySelector('#wseExecBuyBtn')?.addEventListener('click', () => {
      const amt = Number(bodyEl.querySelector('#wseOrderAmtInp')?.value) || 0;
      const res = K.executeOrder({
        side: 'BUY',
        assetKey: asset.key,
        amountTL: amt,
        door: selectedDoor,
        maturityDays: selectedMaturityDays
      });
      if (res.ok) {
        WorldAudio.coin();
        lastOrderFeedback = { ok: true, text: res.message };
      } else {
        WorldAudio.knock();
        lastOrderFeedback = { ok: false, text: res.reason };
      }
      renderInterior();
      syncHud();
    });

    bodyEl.querySelectorAll('[data-sell-ratio]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ratio = Number(btn.getAttribute('data-sell-ratio')) || 1;
        const res = K.executeOrder({
          side: 'SELL',
          assetKey: asset.key,
          sellRatio: ratio,
          door: selectedDoor
        });
        if (res.ok) {
          res.status === 'SOLD_T2_SETTLEMENT' ? WorldAudio.sand() : WorldAudio.coin();
          lastOrderFeedback = { ok: true, text: res.message };
        } else {
          WorldAudio.knock();
          lastOrderFeedback = { ok: false, text: res.reason };
        }
        renderInterior();
        syncHud();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7D. ZAMAN İSTASYONU (10 YIL) VE GERÇEK HAYAT TATBİKAT OKULU SAHNELERİ
  // --------------------------------------------------------------------------
  let externalDrillId = null;
  let externalJourneyOpts = null;

  let lastRenderedRoomSig = '';

  function renderInterior() {
    if (!rootEl) return;
    const backdrop = rootEl.querySelector('#wseInteriorBackdrop');
    const sheet = rootEl.querySelector('#wseInteriorSheet');
    const kickerEl = rootEl.querySelector('#wseSheetKicker');
    const titleEl = rootEl.querySelector('#wseSheetTitle');
    const bodyEl = rootEl.querySelector('#wseSheetBody');
    if (!backdrop || !sheet || !bodyEl) return;

    if (!activeInteriorMode) {
      backdrop.classList.remove('is-open');
      sheet.classList.remove('is-fullscreen-stage');
      lastRenderedRoomSig = '';
      return;
    }

    backdrop.classList.add('is-open');
    sheet.classList.toggle('is-fullscreen-stage', activeInteriorMode === 'TRAIN' || activeInteriorMode === 'SCHOOL');
    const nextRoomSig = `${activeInteriorMode}:${activeInteriorMode === 'SHOP' ? activeAssetKey : ''}`;
    if (nextRoomSig !== lastRenderedRoomSig) {
      bodyEl.scrollTop = 0;
      lastRenderedRoomSig = nextRoomSig;
    }

    if (activeInteriorMode === 'HOME') {
      renderHomePantryBody(bodyEl, kickerEl, titleEl);
    } else if (activeInteriorMode === 'TEA') {
      renderTeaTableBody(bodyEl, kickerEl, titleEl);
    } else if (activeInteriorMode === 'SHOP') {
      renderShopInteriorBody(bodyEl, kickerEl, titleEl);
    } else if (activeInteriorMode === 'TRAIN') {
      kickerEl.textContent = 'Zaman İstasyonu · 120 Aylık Gerçek Yolculuk';
      titleEl.textContent = '10 Yıllık Türkiye Hayat ve Fırtına Treni';
      bodyEl.innerHTML = `<div id="wseDecadeMountHost" style="min-height:70vh;width:100%"></div>`;
      const mountTarget = bodyEl.querySelector('#wseDecadeMountHost');
      if (global.DecadeLifeJourney && typeof global.DecadeLifeJourney.mount === 'function') {
        try {
          global.DecadeLifeJourney.mount(mountTarget, {
            ...(externalJourneyOpts || {}),
            lens: languageLens,
            onClose: () => closeOverlay()
          });
        } catch (err) {
          mountTarget.innerHTML = `<div class="wse-wood-panel"><p class="wse-panel-sub">Zaman Tüneli vagonu hazırlanırken bir sorun oluştu: ${esc(err.message)}</p></div>`;
        }
      } else if (global.AetherArena120mV10 && typeof global.AetherArena120mV10.mountArenaSpace === 'function') {
        global.AetherArena120mV10.mountArenaSpace(mountTarget);
      } else {
        mountTarget.innerHTML = `<div class="wse-wood-panel"><h3 class="wse-panel-title">10 Yıllık Ekspres Vagonu Hazırlanıyor</h3><p class="wse-panel-sub">Zaman Tüneli modülü yükleniyor, birkaç saniye içinde tekrar dokunabilirsin.</p></div>`;
      }
    } else if (activeInteriorMode === 'SCHOOL') {
      kickerEl.textContent = 'Gerçek Hayat Tatbikat Okulu';
      titleEl.textContent = 'Paranı Riske Atmadan Tuzakları Ellerinle Dene';
      bodyEl.innerHTML = `<div id="wseLabMountHost" style="min-height:68vh;width:100%"></div>`;
      const mountTarget = bodyEl.querySelector('#wseLabMountHost');
      if (global.HumanWisdomBridge && typeof global.HumanWisdomBridge.mountRealLifeLab === 'function') {
        try {
          global.HumanWisdomBridge.mountRealLifeLab(mountTarget, externalDrillId);
        } catch (err) {
          mountTarget.innerHTML = `<div class="wse-wood-panel"><p class="wse-panel-sub">Tatbikat masası hazırlanırken hata oluştu: ${esc(err.message)}</p></div>`;
        }
      } else {
        mountTarget.innerHTML = `<div class="wse-wood-panel"><h3 class="wse-panel-title">Tatbikat Okulu Masası Kuruluyor</h3><p class="wse-panel-sub">Uygulamalı tatbikat modülü yükleniyor.</p></div>`;
      }
    }
  }

  function closeOverlay() {
    if (activeInteriorMode === 'TRAIN' && global.DecadeLifeJourney && typeof global.DecadeLifeJourney.unmount === 'function') {
      try { global.DecadeLifeJourney.unmount(); } catch (_) {}
    }
    activeInteriorMode = null;
    lastOrderFeedback = null;
    renderInterior();
    syncHud();
  }

  // --------------------------------------------------------------------------
  // 8. YÜZEN DOĞAL HUD SENKRONİZASYONU VE KAMERA ZIPLAMA ÇAPALARI
  // --------------------------------------------------------------------------
  function buildPlainClockLine(clock) {
    const dayName = TR_WEEKDAYS[clock.weekday] || 'Bugün';
    let statePhrase = 'Çarşı ve Atölyeler Açık';
    if (clock.isHoliday) {
      statePhrase = 'Resmi Tatil · Kepenkler Kapalı';
    } else if (clock.isWeekend) {
      statePhrase = clock.grandBazaarOpen
        ? 'Cumartesi · Sarraf Açık, Fabrikalar Dinlenmede'
        : 'Pazar · Kepenkler Kapalı, Gece Makası Açık';
    } else if (clock.bistCanMatchNow) {
      statePhrase = 'Çarşı ve Atölyeler Açık';
    } else if (clock.hh >= 18 || clock.hh < 9) {
      statePhrase = 'Kepenkler İndi · Gece Banka Makası Açık';
    } else {
      statePhrase = 'Sabah Hazırlığı · Kepenkler Açılıyor';
    }
    return `${dayName} ${clock.shortTimeStr} · ${statePhrase}`;
  }

  function syncHud() {
    if (!rootEl) return;
    const K = getKernel();
    const member = K ? K.getActiveMember() : { name: 'Ben' };
    const snap = K ? K.evaluateMemberPortfolio(member) : { freedomMonths: 2.8, totalNetWorthTL: 100000, unsettledTL: 0 };
    const clock = K ? K.getTurkishClock() : { weekday: 3, shortTimeStr: '10:30', bistCanMatchNow: true, grandBazaarOpen: true, hh: 10 };
    const evo = getLiveEvo();

    // Sol Üst: Erzak Dolabı + Saat
    const pantryHead = rootEl.querySelector('#wsePantryHeadline');
    const clockSub = rootEl.querySelector('#wseClockSubline');
    const miniShelfSvg = rootEl.querySelector('#wseMiniShelvesGroup');
    if (pantryHead) {
      pantryHead.textContent = `Erzak Dolabı: ${snap.freedomMonths} Ay Güvende · ${fmtTL(snap.totalNetWorthTL)}`;
    }
    if (clockSub) {
      clockSub.textContent = buildPlainClockLine(clock);
    }
    if (miniShelfSvg) {
      const filledBars = clamp(Math.ceil((snap.freedomMonths || 0.5) / 2.2), 1, 5);
      let rects = '';
      for (let i = 0; i < 5; i++) {
        const y = 25 - i * 5;
        const on = i < filledBars;
        rects += `<rect x="6" y="${y}" width="20" height="3.6" rx="1.5" fill="${on ? '#e59824' : 'rgba(92,79,66,0.22)'}" />`;
      }
      miniShelfSvg.innerHTML = rects;
    }

    // Ses Butonu
    const sndBtn = rootEl.querySelector('#wseSoundBtn');
    if (sndBtn) {
      const m = WorldAudio.isMuted();
      sndBtn.classList.toggle('is-muted', m);
      sndBtn.setAttribute('aria-label', m ? 'Sesi Aç' : 'Sesi Kapat');
      sndBtn.innerHTML = m
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.8 5.5a9.5 9.5 0 0 1 0 13"/></svg>`;
    }

    // Sağ Üst: Gözlük / Dil Seçici
    rootEl.querySelectorAll('[data-lens-pick]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-lens-pick') === languageLens);
    });

    // Günlük Kasaba Fısıltısı (worldLiveEvolution.plainHumanDailyStory veya Saat Durumu)
    const whisperBox = rootEl.querySelector('#wseStoryWhisper');
    const whisperTxt = rootEl.querySelector('#wseStoryWhisperText');
    if (whisperBox && whisperTxt && !whisperDismissed) {
      const evoStory = evo?.plainHumanDailyStory?.noviceHeadline
        || evo?.plainHumanDailyStory?.headline
        || (typeof evo?.plainHumanDailyStory === 'string' ? evo.plainHumanDailyStory : '');
      const defaultStory = !clock.grandBazaarOpen
        ? `Taş Han Sarrafının demir kepengi şu an kapalı; 7/24 yanan Cam Banka kulesinde ise gece makası %${clock.bankSpreadPct.toFixed(2)} açık.`
        : `Mahalle fırınında sıcak ekmek çıkıyor, Kocaeli limanından ihracat gemisi kalkıyor. Merak ettiğin binanın çatısına dokunarak içeri girebilirsin.`;
      whisperTxt.textContent = evoStory || defaultStory;
      whisperBox.classList.remove('is-hidden');
    }

    // Deney Kolu Etki Metni
    const sig = computeTownSignals();
    const expEffect = rootEl.querySelector('#wseExpEffectText');
    if (expEffect) {
      if (levers.dieselPct === 0 && levers.rainPct === 0 && levers.fxPct === 0) {
        expEffect.textContent = 'Kolları kaydır: Tanker hızını, baraj suyunu, fırın etiketini ve ihracat gemisini anında izle.';
      } else {
        expEffect.textContent = `Fırın etiketi: ${sig.breadSimTL} TL (${sig.breadDeltaPct >= 0 ? '+' : ''}%${sig.breadDeltaPct}) · Baraj doluluğu: %${Math.round(sig.damLevel * 100)} · İhracat kasası: ${sig.exportBoostPct >= 0 ? '+' : ''}%${sig.exportBoostPct}`;
      }
    }

    // Alt Pusula Aktiflik
    rootEl.querySelectorAll('[data-compass-jump]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-compass-jump') === activeCompassZone);
    });
  }

  function showMistWhisper(text) {
    if (!rootEl) return;
    const toast = rootEl.querySelector('#wseMistToast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('is-open');
    if (mistToastTimer) clearTimeout(mistToastTimer);
    mistToastTimer = setTimeout(() => toast.classList.remove('is-open'), 5200);
  }

  // --------------------------------------------------------------------------
  // 9. KAMERA KONTROLLERİ, SÜRÜKLEME, İKİ PARMAK YAKINLAŞTIRMA VE BİNA DOKUNUŞU
  // --------------------------------------------------------------------------
  function clampCameraTargets() {
    const padX = 160;
    const padY = 120;
    cam.tz = clamp(cam.tz, cam.minZoom, cam.maxZoom);
    cam.tx = clamp(cam.tx, padX, WORLD_W - padX);
    cam.ty = clamp(cam.ty, padY, WORLD_H - padY);
  }

  function setInitialFraming() {
    const isPortraitMobile = cam.vw < 640;
    if (isPortraitMobile) {
      // iPhone 375px / 393px açılışında Bizim Ev + Çay Masası + Mahalle Fırını + Taş Han kenar kesilmesi olmadan görünür!
      cam.minZoom = 0.34;
      cam.tz = 0.44;
      cam.tx = 795;
      cam.ty = 875;
    } else {
      const fitW = cam.vw / 2260;
      const fitH = cam.vh / 1240;
      cam.minZoom = 0.42;
      cam.tz = clamp(Math.max(fitW, fitH), 0.56, 0.84);
      cam.tx = 1130;
      cam.ty = 760;
    }
    cam.zoom = cam.tz;
    cam.x = cam.tx;
    cam.y = cam.ty;
  }

  function screenToWorld(sx, sy) {
    return {
      wx: (sx - cam.vw * 0.5) / cam.zoom + cam.x,
      wy: (sy - cam.vh * 0.5) / cam.zoom + cam.y
    };
  }

  function findLandmarkAtScreen(sx, sy) {
    const { wx, wy } = screenToWorld(sx, sy);
    let best = null;
    let bestDist = Infinity;
    for (const lm of WORLD_LANDMARKS) {
      const dx = wx - lm.x;
      const dy = wy - lm.y;
      const d = Math.hypot(dx, dy);
      const effectiveR = Math.max(lm.hitR, 34 / cam.zoom);
      if (d <= effectiveR && d < bestDist) {
        best = lm;
        bestDist = d;
      }
    }
    return best;
  }

  function handleLandmarkTap(lm) {
    if (!lm) return;
    WorldAudio.unlock();
    const K = getKernel();
    const member = K ? K.getActiveMember() : { livedMilestones: {} };

    cam.tx = lm.x;
    cam.ty = lm.y;
    clampCameraTargets();

    if (lm.kind === 'mist' && !member.livedMilestones?.[lm.milestoneKey]) {
      WorldAudio.sand();
      showMistWhisper(lm.fogWhisper);
      return;
    }

    if (lm.kind === 'home') {
      WorldAudio.bell();
      openHomePantry();
    } else if (lm.kind === 'tea') {
      WorldAudio.bell();
      openFamilyTeaTable();
    } else if (lm.kind === 'train') {
      WorldAudio.horn();
      openDecadeJourney();
    } else if (lm.kind === 'school') {
      WorldAudio.bell();
      openRealLifeLab();
    } else {
      if (lm.id === 'tas-han-sarraf' && K && !K.getTurkishClock().grandBazaarOpen) {
        WorldAudio.shutter();
      } else if (lm.id === 'kocaeli-liman') {
        WorldAudio.horn();
      } else {
        WorldAudio.bell();
      }
      activeDistrictId = lm.id;
      activeAssetKey = (lm.primaryKeys && lm.primaryKeys[0]) || 'reel-perakende-bimas';
      activeInteriorMode = 'SHOP';
      lastOrderFeedback = null;
      renderInterior();
    }
  }

  function bindCanvasGestures() {
    if (!canvas) return;
    const pointers = new Map();
    let startX = 0;
    let startY = 0;
    let movedDist = 0;
    let lastPinchDist = 0;

    canvas.addEventListener('pointerdown', (e) => {
      WorldAudio.unlock();
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        startX = e.clientX;
        startY = e.clientY;
        movedDist = 0;
        canvas.classList.add('is-dragging');
      } else if (pointers.size === 2) {
        const pts = Array.from(pointers.values());
        lastPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      }
    });

    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;

      if (pointers.size === 0) {
        const hit = findLandmarkAtScreen(lx, ly);
        hoveredLandmarkId = hit ? hit.id : null;
        canvas.style.cursor = hit ? 'pointer' : 'grab';
        return;
      }

      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 1) {
        movedDist += Math.hypot(dx, dy);
        cam.tx -= dx / cam.zoom;
        cam.ty -= dy / cam.zoom;
        clampCameraTargets();
      } else if (pointers.size === 2) {
        movedDist += 20;
        const pts = Array.from(pointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (lastPinchDist > 10 && dist > 10) {
          cam.tz *= (dist / lastPinchDist);
          clampCameraTargets();
        }
        lastPinchDist = dist;
      }
    });

    const finishPointer = (e) => {
      const wasSingle = pointers.size === 1;
      pointers.delete(e.pointerId);
      if (pointers.size === 0) {
        canvas.classList.remove('is-dragging');
      }
      if (wasSingle && movedDist < 10) {
        const rect = canvas.getBoundingClientRect();
        const hit = findLandmarkAtScreen(e.clientX - rect.left, e.clientY - rect.top);
        if (hit) handleLandmarkTap(hit);
      }
    };

    canvas.addEventListener('pointerup', finishPointer);
    canvas.addEventListener('pointercancel', (e) => {
      pointers.delete(e.pointerId);
      canvas.classList.remove('is-dragging');
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.11 : 0.90;
      cam.tz = clamp(cam.tz * factor, cam.minZoom, cam.maxZoom);
      clampCameraTargets();
    }, { passive: false });
  }

  // --------------------------------------------------------------------------
  // 10. SAHNE DOM KURULUMU VE DIŞ ARAYÜZ SÖZLEŞMESİ (window.WorldSceneEngine)
  // --------------------------------------------------------------------------
  function resize() {
    if (!rootEl || !canvas) return;
    const rect = rootEl.getBoundingClientRect();
    cam.vw = Math.max(320, rect.width || global.innerWidth || 375);
    cam.vh = Math.max(420, rect.height || global.innerHeight || 667);
    cam.dpr = Math.min(2.5, global.devicePixelRatio || 1);
    canvas.width = Math.round(cam.vw * cam.dpr);
    canvas.height = Math.round(cam.vh * cam.dpr);
  }

  function jumpCompass(zone) {
    activeCompassZone = zone;
    WorldAudio.unlock();
    if (zone === 'home') {
      cam.tx = 455; cam.ty = 910; cam.tz = Math.max(cam.tz, 0.72);
      clampCameraTargets();
      openHomePantry();
    } else if (zone === 'tea') {
      cam.tx = 640; cam.ty = 965; cam.tz = Math.max(cam.tz, 0.74);
      clampCameraTargets();
      openFamilyTeaTable();
    } else if (zone === 'street') {
      closeOverlay();
      WorldAudio.softClick();
      cam.tx = 1090; cam.ty = 815; cam.tz = cam.vw < 640 ? 0.58 : 0.78;
      clampCameraTargets();
    } else if (zone === 'industry') {
      closeOverlay();
      WorldAudio.horn();
      cam.tx = 1720; cam.ty = 720; cam.tz = cam.vw < 640 ? 0.54 : 0.74;
      clampCameraTargets();
    } else if (zone === 'train') {
      cam.tx = 255; cam.ty = 740;
      clampCameraTargets();
      WorldAudio.horn();
      openDecadeJourney();
    } else if (zone === 'school') {
      cam.tx = 1535; cam.ty = 1020;
      clampCameraTargets();
      WorldAudio.bell();
      openRealLifeLab();
    }
    syncHud();
  }

  function openHomePantry() {
    activeCompassZone = 'home';
    activeInteriorMode = 'HOME';
    lastOrderFeedback = null;
    renderInterior();
    syncHud();
  }

  function openFamilyTeaTable() {
    activeCompassZone = 'tea';
    activeInteriorMode = 'TEA';
    lastOrderFeedback = null;
    renderInterior();
    syncHud();
  }

  function resolveDistrictIdForAsset(asset) {
    if (!asset) return activeDistrictId || 'mahalle-firini';
    const byPrimary = WORLD_LANDMARKS.find((l) => l.kind === 'shop' && (l.primaryKeys || []).includes(asset.key));
    if (byPrimary) return byPrimary.id;
    const bySector = WORLD_LANDMARKS.find((l) => l.kind === 'shop' && (l.bistSectors || []).includes(asset.categoryName));
    if (bySector) return bySector.id;
    if (asset.subVenue === 'PHYSICAL_METAL' || asset.subVenue === 'DARPHANE_S1' || String(asset.id || '').includes('altin') || String(asset.id || '').includes('gumus')) {
      return 'tas-han-sarraf';
    }
    if (asset.isRateInstrument || asset.subVenue === 'FX_CASH') {
      return 'cam-kule-hazine';
    }
    return 'kocaeli-liman';
  }

  function openWorkshop(assetKeyOrLandmarkId) {
    const K = getKernel();
    const byLm = WORLD_LANDMARKS.find((l) => l.id === assetKeyOrLandmarkId);
    if (byLm && byLm.kind === 'shop') {
      activeDistrictId = byLm.id;
      activeAssetKey = (byLm.primaryKeys && byLm.primaryKeys[0]) || 'reel-perakende-bimas';
    } else if (K) {
      const a = K.getAsset(assetKeyOrLandmarkId);
      if (a) {
        activeAssetKey = a.key;
        activeDistrictId = resolveDistrictIdForAsset(a);
      }
    }
    activeInteriorMode = 'SHOP';
    lastOrderFeedback = null;
    renderInterior();
    syncHud();
  }

  function openDecadeJourney(opts = {}) {
    activeCompassZone = 'train';
    externalJourneyOpts = opts;
    activeInteriorMode = 'TRAIN';
    renderInterior();
    syncHud();
  }

  function openRealLifeLab(initialDrillId = null) {
    activeCompassZone = 'school';
    externalDrillId = initialDrillId;
    activeInteriorMode = 'SCHOOL';
    renderInterior();
    syncHud();
  }

  function setLanguageLens(lens) {
    languageLens = lens === 'BRIDGE' ? 'BRIDGE' : 'PLAIN';
    try { global.localStorage?.setItem(LENS_STORAGE_KEY, languageLens); } catch (_) {}
    try {
      if (global.HumanWisdomBridge && typeof global.HumanWisdomBridge.setLanguageLens === 'function') {
        global.HumanWisdomBridge.setLanguageLens(languageLens);
      }
    } catch (_) {}
    syncHud();
    if (activeInteriorMode) renderInterior();
    return languageLens;
  }

  function mount(containerOrSelector, options = {}) {
    unmount();

    const K = getKernel();
    if (K && !K.getState()) {
      try { K.init(); } catch (_) {}
    }

    let target = null;
    if (typeof containerOrSelector === 'string') {
      target = global.document.querySelector(containerOrSelector);
    } else if (containerOrSelector && containerOrSelector.nodeType === 1) {
      target = containerOrSelector;
    }
    if (!target) {
      target = global.document.getElementById('worldStageRoot')
        || global.document.getElementById('v10MainStage')
        || global.document.body;
    }
    hostContainer = target;

    if (options.initialLens) setLanguageLens(options.initialLens);

    global.document.documentElement.classList.add('wse-lock-viewport');
    global.document.body.classList.add('wse-world-active');

    expCollapsed = true;

    rootEl = global.document.createElement('div');
    rootEl.className = 'wse-root';
    rootEl.innerHTML = `
      <canvas class="wse-canvas" id="wseWorldCanvas"></canvas>

      <div class="wse-hud-layer">
        <div>
          <div class="wse-hud-top">
            <div class="wse-hud-left-cluster">
              <button type="button" class="wse-pantry-clock-pill" id="wseOpenHomeHudBtn" title="Evimizin Erzak Dolabını Aç">
                <svg class="wse-mini-shelves-svg" viewBox="0 0 32 32" aria-hidden="true">
                  <rect x="3" y="2" width="26" height="28" rx="5" fill="#f2ead9" stroke="#8c6239" stroke-width="2" />
                  <g id="wseMiniShelvesGroup"></g>
                </svg>
                <div class="wse-pantry-clock-text">
                  <span class="wse-pantry-headline" id="wsePantryHeadline">Erzak Dolabı Yükleniyor...</span>
                  <span class="wse-clock-subline" id="wseClockSubline">Kasaba saati okunuyor...</span>
                </div>
              </button>
              <button type="button" class="wse-sound-btn" id="wseSoundBtn" aria-label="Sesi Aç veya Kapat"></button>
            </div>

            <div class="wse-lens-switch" role="group" aria-label="Dil Gözlüğü Seçici">
              <button type="button" class="wse-lens-btn" data-lens-pick="PLAIN">Sokak Dili</button>
              <button type="button" class="wse-lens-btn" data-lens-pick="BRIDGE">Gerçek Hayat Köprüsü</button>
            </div>
          </div>

          <div class="wse-story-whisper" id="wseStoryWhisper">
            <span class="wse-story-whisper-text" id="wseStoryWhisperText"></span>
            <button type="button" class="wse-story-whisper-close" id="wseDismissWhisperBtn" aria-label="Fısıltıyı Gizle">Gizle</button>
          </div>
        </div>

        <div class="wse-hud-bottom">
          <div class="wse-experiment-dock ${expCollapsed ? 'is-collapsed' : ''}" id="wseExpDock">
            <button type="button" class="wse-exp-header" id="wseExpToggleBtn">
              <div class="wse-exp-header-left">
                <span class="wse-exp-badge">Canlı Deney</span>
                <span class="wse-exp-title">Mazot, Yağmur ve Dövizle Oyna</span>
              </div>
              <span class="wse-exp-toggle-label" id="wseExpToggleLabel">${expCollapsed ? 'Kolu Aç' : 'Küçült'}</span>
            </button>
            <div class="wse-exp-body">
              <label class="wse-exp-row">
                <span class="wse-exp-label">Mazot Pompası</span>
                <input class="wse-exp-slider" type="range" min="-25" max="50" step="5" value="0" data-lever="dieselPct" />
                <span class="wse-exp-val" id="wseValDiesel">%0</span>
              </label>
              <label class="wse-exp-row">
                <span class="wse-exp-label">Baraj Yağmuru</span>
                <input class="wse-exp-slider" type="range" min="-40" max="40" step="5" value="0" data-lever="rainPct" />
                <span class="wse-exp-val" id="wseValRain">Normal</span>
              </label>
              <label class="wse-exp-row">
                <span class="wse-exp-label">Döviz Rüzgârı</span>
                <input class="wse-exp-slider" type="range" min="-20" max="50" step="5" value="0" data-lever="fxPct" />
                <span class="wse-exp-val" id="wseValFx">%0</span>
              </label>
              <div class="wse-exp-effect-strip">
                <span id="wseExpEffectText"></span>
                <button type="button" class="wse-exp-reset-btn" id="wseExpResetBtn">Sıfırla</button>
              </div>
            </div>
          </div>

          <nav class="wse-compass-bar" aria-label="Kasaba Hızlı Kamera Pusulası">
            <button type="button" class="wse-compass-pill" data-compass-jump="home">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/></svg>
              Evim &amp; Erzak Dolabı
            </button>
            <button type="button" class="wse-compass-pill" data-compass-jump="tea">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 8h10v6a5 5 0 0 1-10 0V8z"/><path d="M16 9h2a2 2 0 0 1 0 4h-2"/><line x1="4" y1="20" x2="18" y2="20"/></svg>
              Çay Masası (Ailem)
            </button>
            <button type="button" class="wse-compass-pill is-active" data-compass-jump="street">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 9l2-5h14l2 5"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
              Çarşı &amp; Sokak
            </button>
            <button type="button" class="wse-compass-pill" data-compass-jump="industry">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 20V10l6 4V10l6 4V6h6v14H3z"/></svg>
              Fabrikalar &amp; Liman
            </button>
            <button type="button" class="wse-compass-pill" data-compass-jump="train">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="4" y="3" width="16" height="14" rx="3"/><line x1="4" y1="11" x2="20" y2="11"/><line x1="8" y1="21" x2="6" y2="17"/><line x1="16" y1="21" x2="18" y2="17"/></svg>
              10 Yıl Hayat Tüneli
            </button>
            <button type="button" class="wse-compass-pill" data-compass-jump="school">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3L2 8l10 5 10-5-10-5z"/><path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5"/></svg>
              Gerçek Hayat Tatbikatı
            </button>
          </nav>
        </div>
      </div>

      <div class="wse-mist-toast" id="wseMistToast"></div>

      <div class="wse-interior-backdrop" id="wseInteriorBackdrop">
        <div class="wse-interior-sheet" id="wseInteriorSheet" role="dialog" aria-modal="true">
          <div class="wse-sheet-header">
            <div class="wse-sheet-title-wrap">
              <div class="wse-sheet-kicker" id="wseSheetKicker">Kasaba Mekânı</div>
              <h2 class="wse-sheet-title" id="wseSheetTitle">İç Mekân</h2>
            </div>
            <button type="button" class="wse-close-btn" id="wseCloseSheetBtn">Kasabaya Dön</button>
          </div>
          <div class="wse-sheet-body" id="wseSheetBody"></div>
        </div>
      </div>
    `;

    hostContainer.appendChild(rootEl);
    canvas = rootEl.querySelector('#wseWorldCanvas');
    ctx = canvas.getContext('2d');

    resize();
    setInitialFraming();
    bindCanvasGestures();

    // HUD Etkileşimleri
    rootEl.querySelector('#wseOpenHomeHudBtn')?.addEventListener('click', () => {
      WorldAudio.unlock();
      WorldAudio.bell();
      jumpCompass('home');
    });

    rootEl.querySelector('#wseSoundBtn')?.addEventListener('click', () => {
      const nowMuted = WorldAudio.toggle();
      if (!nowMuted) WorldAudio.bell();
      syncHud();
    });

    rootEl.querySelectorAll('[data-lens-pick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        WorldAudio.unlock();
        WorldAudio.softClick();
        setLanguageLens(btn.getAttribute('data-lens-pick'));
      });
    });

    rootEl.querySelector('#wseDismissWhisperBtn')?.addEventListener('click', () => {
      whisperDismissed = true;
      rootEl.querySelector('#wseStoryWhisper')?.classList.add('is-hidden');
    });

    // Deney Kolu Etkileşimleri
    rootEl.querySelector('#wseExpToggleBtn')?.addEventListener('click', () => {
      expCollapsed = !expCollapsed;
      rootEl.querySelector('#wseExpDock')?.classList.toggle('is-collapsed', expCollapsed);
      const lbl = rootEl.querySelector('#wseExpToggleLabel');
      if (lbl) lbl.textContent = expCollapsed ? 'Kolu Aç' : 'Küçült';
      WorldAudio.softClick();
    });

    const updateLeverLabels = () => {
      const dEl = rootEl.querySelector('#wseValDiesel');
      const rEl = rootEl.querySelector('#wseValRain');
      const fEl = rootEl.querySelector('#wseValFx');
      if (dEl) dEl.textContent = `${levers.dieselPct >= 0 ? '+' : ''}%${levers.dieselPct}`;
      if (rEl) rEl.textContent = levers.rainPct > 5 ? `+Yağış` : (levers.rainPct < -5 ? 'Kurak' : 'Normal');
      if (fEl) fEl.textContent = `${levers.fxPct >= 0 ? '+' : ''}%${levers.fxPct}`;
      syncHud();
    };

    rootEl.querySelectorAll('[data-lever]').forEach((sl) => {
      sl.addEventListener('input', () => {
        WorldAudio.unlock();
        const k = sl.getAttribute('data-lever');
        levers[k] = Number(sl.value) || 0;
        if (k === 'rainPct') WorldAudio.water();
        else WorldAudio.softClick();
        updateLeverLabels();
      });
    });

    rootEl.querySelector('#wseExpResetBtn')?.addEventListener('click', () => {
      levers.dieselPct = 0;
      levers.rainPct = 0;
      levers.fxPct = 0;
      rootEl.querySelectorAll('[data-lever]').forEach((sl) => { sl.value = '0'; });
      WorldAudio.softClick();
      updateLeverLabels();
    });

    rootEl.querySelectorAll('[data-compass-jump]').forEach((btn) => {
      btn.addEventListener('click', () => jumpCompass(btn.getAttribute('data-compass-jump')));
    });

    rootEl.querySelector('#wseCloseSheetBtn')?.addEventListener('click', () => {
      WorldAudio.softClick();
      closeOverlay();
    });

    rootEl.querySelector('#wseInteriorBackdrop')?.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'wseInteriorBackdrop') {
        WorldAudio.softClick();
        closeOverlay();
      }
    });

    global.addEventListener('resize', resize);

    if (K && typeof K.subscribe === 'function') {
      kernelUnsub = K.subscribe(() => {
        syncHud();
        if (activeInteriorMode && activeInteriorMode !== 'TRAIN' && activeInteriorMode !== 'SCHOOL') {
          renderInterior();
        }
      });
    }

    clockTimerId = setInterval(syncHud, 10000);
    syncHud();
    rafId = global.requestAnimationFrame(drawWorldFrame);
    return api;
  }

  function unmount() {
    if (rafId) {
      global.cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (kernelUnsub) {
      try { kernelUnsub(); } catch (_) {}
      kernelUnsub = null;
    }
    if (clockTimerId) {
      clearInterval(clockTimerId);
      clockTimerId = null;
    }
    if (activeInteriorMode === 'TRAIN' && global.DecadeLifeJourney && typeof global.DecadeLifeJourney.unmount === 'function') {
      try { global.DecadeLifeJourney.unmount(); } catch (_) {}
    }
    global.removeEventListener('resize', resize);
    if (rootEl && rootEl.parentNode) {
      rootEl.parentNode.removeChild(rootEl);
    }
    rootEl = null;
    canvas = null;
    ctx = null;
    activeInteriorMode = null;
  }

  const api = {
    mount,
    unmount,
    resize,
    focusLandmark(landmarkId, openInteriorNow = false) {
      const lm = WORLD_LANDMARKS.find((l) => l.id === landmarkId);
      if (!lm) return false;
      cam.tx = lm.x;
      cam.ty = lm.y;
      clampCameraTargets();
      if (openInteriorNow) handleLandmarkTap(lm);
      return true;
    },
    openHomePantry,
    openFamilyTeaTable,
    openWorkshop,
    openDecadeJourney,
    openRealLifeLab,
    closeOverlay,
    setLanguageLens,
    getLanguageLens: () => languageLens,
    setMuted: (m) => { const r = WorldAudio.setMuted(m); syncHud(); return r; },
    toggleMute: () => { const r = WorldAudio.toggle(); syncHud(); return r; },
    getLevers: () => ({ ...levers }),
    setLever(key, val) {
      if (Object.prototype.hasOwnProperty.call(levers, key)) {
        levers[key] = Number(val) || 0;
        syncHud();
      }
    },
    resetLevers() {
      levers.dieselPct = 0; levers.rainPct = 0; levers.fxPct = 0;
      syncHud();
    },
    refresh() {
      syncHud();
      if (activeInteriorMode) renderInterior();
    }
  };

  global.WorldSceneEngine = api;

  // Eski veya yardımcı modüllerin openWorkshopDrawer çağrılarıyla geri uyumluluk köprüsü
  if (!global.AetherCanvasWorldV10) {
    global.AetherCanvasWorldV10 = {
      mountMapSpace: (el) => mount(el),
      unmountMapSpace: () => unmount(),
      openWorkshopDrawer: (assetKey) => openWorkshop(assetKey),
      closeDrawer: () => closeOverlay()
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);
