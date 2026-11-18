// ============================================================================
// GERÇEK YATIRIM REHBERİ, SOKAK ZEKÂSI, MAHALLE FIRINI KASASI & KRİZ MOTORU
// (real-investment-guide.js — v13.0)
// ============================================================================
(function (global) {
  'use strict';

  const ASSET_PROFILES = {
    'gram-altin-spot': {
      shortDesc: '24 ayar saf fiziki altın (TL/gram). Binlerce yıldır kağıt paraların erimesine karşı somut değer terazi taşı.',
      howItWorks: 'Faiz veya temettü üretmez; dünyada merkez bankaları para bastığında, jeopolitik tansiyon yükseldiğinde veya içeride Dolar/TL arttığında alım gücünü korur.',
      rawInputs: ['Küresel Ons Altın ($)', 'Dolar / TL Kuru', 'ABD Reel Tahvil Faizleri'],
      risesWhen: 'Savaş/kriz endişesi arttığında, Fed faiz indirdiğinde veya içeride kur yükseldiğinde.',
      fallsWhen: 'Dünyada reel faizler yükseldiğinde ve içeride TL faizi kur artışının çok üzerinde kaldığında.',
      relatedKeys: ['altin-sertifikasi', 'altin-fonu-zgold', 'ceyrek-altin', 'doviz-usd', 'gram-gumus-spot']
    },
    'ceyrek-altin': {
      shortDesc: 'Darphane basımı 22 ayar fiziki çeyrek altın (1,75 gr). Anadolu’nun klasik yastık dışı fiziki tasarruf aracı.',
      howItWorks: 'Gram altınla aynı yönde gider; ancak alırken Darphane işçiliği ve kuyumcu makası ödenir. Kısa vadeli al-sat için değil, uzun süreli saklama içindir.',
      rawInputs: ['Ons Altın', 'Dolar / TL Kuru', 'Fiziki İşçilik Primi'],
      risesWhen: 'Gram altın yükseldiğinde ve düğün/fiziki talep sezonunda.',
      fallsWhen: 'Sık al-sat yapıldığında kuyumcu alış-satış makası getiriyi kemirir.',
      relatedKeys: ['gram-altin-spot', 'cumhuriyet-altini', 'altin-sertifikasi']
    },
    'altin-sertifikasi': {
      shortDesc: 'Borsa İstanbul’da işlem gören Darphane Altın Sertifikası (ALTIN.S1 · 100 adet = 1 gram altın).',
      howItWorks: 'Borsa saatlerinde hisse gibi %0 stopajla alınıp satılır. Ancak kalabalık hücum ettiğinde Kapalıçarşı’daki gerçek 1 gram altının %10-%15 üstüne çıkabilir; bu fark saf "hava parası" riskidir.',
      rawInputs: ['Fiziki Gram Altın Fiyatı', 'Borsa İçi Bireysel Talep Primi'],
      risesWhen: 'Ons/Dolar yükseldiğinde veya borsada sertifika talebi şiştiğinde.',
      fallsWhen: 'Fiziki altınla arasındaki balon fark kapandığında altın düşmese bile sertifika sert düşebilir!',
      relatedKeys: ['gram-altin-spot', 'altin-fonu-zgold', 'altin-fonu-gldtr']
    },
    'gram-gumus-spot': {
      shortDesc: 'Yarısı kıymetli maden, yarısı güneş paneli ve elektrikli araç sanayisinin vazgeçilmez iletken hammaddesi.',
      howItWorks: 'Altının kardeşi gibi güvenli liman ararken aynı zamanda fabrikaların üretim iştahından beslenir; altına göre çok daha hırçın iner çıkar.',
      rawInputs: ['Ons Gümüş ($)', 'Dolar / TL Kuru', 'Güneş Enerjisi & Elektronik Üretimi'],
      risesWhen: 'Altın yürürken dünyada güneş paneli ve sanayi üretimi hızlandığında.',
      fallsWhen: 'Küresel fabrika siparişleri durgunluğa girdiğinde.',
      relatedKeys: ['gumus-fonu-gmstr', 'gram-altin-spot', 'reel-enerji-cwene', 'reel-enerji-astor']
    },
    'mevduat-ust': {
      shortDesc: 'Bankada 32, 181 veya 366 gün sabit oranla bağlanan vadeli TL mevduat hesabı.',
      howItWorks: 'Anaparan eksi yazmaz; vade sonunda stopaj vergisi (%17,5 / %15 / %10) kesilip net faiz ödenir. Ama vadeden 1 gün bile önce bozarsan biriken tüm faizin yanar!',
      rawInputs: ['TCMB Politika Faizi', 'Bankaların TL Likidite İhtiyacı', 'TÜİK Enflasyonu'],
      risesWhen: 'Merkez Bankası faizi enflasyonun üzerinde sıkı tuttuğunda ve kur yatay kaldığında.',
      fallsWhen: 'Ani kur şokunda veya vadeden önce nakit sıkışıklığıyla bozmak zorunda kaldığında.',
      relatedKeys: ['para-piyasasi-fonu', 'kira-sertifikasi-sukuk', 'dibs-tahvil']
    },
    'para-piyasasi-fonu': {
      shortDesc: 'TEFAS üzerinden her gün bileşik getiri işleten, vade bozulma cezası olmayan likit Para Piyasası Fonu (PPF).',
      howItWorks: 'Paranı gecelik yüksek faizde çalıştırır. İş günleri saat 13:30’dan önce bozduğunda faizin yanmadan aynı gün nakde döner; kazançtan %17,5 stopaj kesilir.',
      rawInputs: ['Gecelik TLREF Faizi', 'TCMB Politika Faizi'],
      risesWhen: 'Fırsat beklerken boş nakdin enflasyona ezilmesini önlemek istediğinde.',
      fallsWhen: 'Faiz indirim döngüsü başladığında günlük getirisi anında aşağı iner.',
      relatedKeys: ['mevduat-ust', 'kira-sertifikasi-sukuk']
    },
    'kira-sertifikasi-sukuk': {
      shortDesc: 'Hazine varlık kiralama karşılığı kamu kira sertifikası fonu (%0 Stopaj vergi kalkanlı!).',
      howItWorks: 'Devletin kamu varlıklarından kira geliri üretir. %0 stopaj avantajı sayesinde aynı brüt orandaki %17,5 vergili mevduattan çok daha yüksek net nakit bırakır (TEFAS T+1 valörlüdür).',
      rawInputs: ['Hazine Kira Sertifikası Getirisi', '%0 Stopaj Vergi Muafiyeti'],
      risesWhen: 'Vergi kesintisi vermeden paranı enflasyon üstü sabit akışta büyütmek istediğinde.',
      fallsWhen: '13:30 valör kuralı nedeniyle paranın nakde dönmesi 1 iş günü sürer.',
      relatedKeys: ['dibs-tahvil', 'para-piyasasi-fonu', 'mevduat-ust']
    },
    'doviz-usd': {
      shortDesc: 'Amerikan Doları (USD/TRY). Küresel enerji ve hammadde ticaretinin ana para birimi.',
      howItWorks: 'Dolar kendi başına fabrika gibi kâr üretmez; ABD’nin kendi enflasyonu yüzünden yıllarca boş dolar tutmak dünyada alım gücünü eritir. Yalnızca TL kur sıçramasına karşı kalkandır.',
      rawInputs: ['Türkiye - ABD Faiz ve Enflasyon Farkı', 'TCMB Rezervleri', 'Dış Ticaret Açığı'],
      risesWhen: 'İçeride TL faizi enflasyonun altında kaldığında veya dış finansman sıkıştığında.',
      fallsWhen: 'Yüksek TL faizi döneminde kur aylarca yatay gittiğinde ciddi fırsat maliyeti yazar.',
      relatedKeys: ['doviz-eur', 'eurobond-usdtr', 'abd-sp500-spy', 'gram-altin-spot']
    },
    'doviz-eur': {
      shortDesc: 'Avrupa Para Birimi (EUR/TRY). Türk sanayi fabrikalarının en büyük ihracat kasası.',
      howItWorks: 'Türkiye hammaddesini çoğunlukla Dolar ile alır, ürettiği arabayı ve makineyi Avrupa’ya Euro ile satar. Euro güçlendiğinde ihracatçı sanayicinin yüzü güler.',
      rawInputs: ['Dolar / TL Kuru', 'EUR / USD Paritesi', 'Avrupa Merkez Bankası'],
      risesWhen: 'Avrupa ekonomisi canlandığında ve Euro/Dolar paritesi yükseldiğinde.',
      fallsWhen: 'Avrupa sanayisi durgunluğa girdiğinde.',
      relatedKeys: ['bist-froto', 'bist-toaso', 'bist-sise', 'doviz-usd']
    },
    'bist-thyao': {
      shortDesc: 'Türk Hava Yolları (THYAO). Gelirinin ~%85’i döviz olan, 130+ ülkeye uçan bayrak taşıyıcı ve kargo devi.',
      howItWorks: 'Bilet ve kargoyu Dolar/Euro ile satar; en büyük gideri uçakların yaktığı jet yakıtıdır (Brent petrol). Petrol ucuzlayıp turizm canlandığında dev bir döviz darphanesine dönüşür.',
      rawInputs: ['Brent Petrol & Jet Yakıtı', 'Küresel Yolcu ve Hava Kargo Hacmi', 'Dolar & Euro Kuru'],
      risesWhen: 'Petrol fiyatları düştüğünde, yaz turizm sezonunda ve döviz kurları desteklediğinde.',
      fallsWhen: 'Petrol fırladığında veya bölgesel savaş/hava sahası kapanmaları yaşandığında.',
      relatedKeys: ['emtia-petrol-bno', 'bist-tuprs', 'bist-pgsus', 'bist-tavhl']
    },
    'bist-tuprs': {
      shortDesc: 'TÜPRAŞ (TUPRS). Ham petrolü kaynatıp ülkenin mazotunu, benzinini ve uçak yakıtını üreten en büyük sanayi kalesi.',
      howItWorks: 'Ham petrol varili ile işlenmiş mazot arasındaki "rafineri marjından" dolar bazında kazanır. Pazara domates taşıyan kamyondan uçağa kadar herkes onun müşterisidir; güçlü nakit ve temettü öder.',
      rawInputs: ['Brent Ham Petrol', 'Akdeniz Dizel/Jet Rafineri Marjı', 'Doğalgaz Maliyeti'],
      risesWhen: 'Mazot ve uçak yakıtı talebi güçlü olduğunda ve rafineri marjları açıldığında.',
      fallsWhen: 'Küresel resesyonda yakıt tüketimi düştüğünde veya petrolde sert stok zararı yazıldığında.',
      relatedKeys: ['emtia-petrol-bno', 'bist-thyao', 'reel-perakende-bimas']
    },
    'bist-froto': {
      shortDesc: 'Ford Otosan (FROTO). Kocaeli ve Romanya fabrikalarında ticari araç üretip ~%80’ini Avrupa’ya Euro ile satan sanayi devi.',
      howItWorks: 'Ereğli’den aldığı çeliği işleyip Avrupa’ya minibüs ve kamyon ihraç eder. Döviz korumalı "maliyet artı kâr" anlaşmaları ve yıllardır aksamayan temettü çarkıyla tanınır.',
      rawInputs: ['Yassı Çelik Sac', 'Avrupa Ticari Araç Siparişleri', 'Euro / TL Kuru'],
      risesWhen: 'Avrupa ticari araç pazarı büyüdüğünde ve Euro kuru yükseldiğinde.',
      fallsWhen: 'Avrupa’da resesyon olduğunda veya tedarik zinciri aksadığında.',
      relatedKeys: ['doviz-eur', 'bist-eregl', 'bist-toaso', 'bist-egeen']
    },
    'reel-perakende-bimas': {
      shortDesc: 'BİM Mağazalar (BIMAS). Her mahallede peşin parayla temel gıda satan Türkiye’nin en büyük perakende kasası.',
      howItWorks: 'Müşteriden parayı kasada bugün peşin alır, üreticiye 45-60 gün sonra öder! Enflasyon arttıkça raf fiyatı da anında güncellendiği için ekonomik fırtınalarda en sağlam kalan savunma kalesidir.',
      rawInputs: ['Tarım & Gıda Fiyatları', 'Mazot (Soğuk Zincir Nakliye)', 'Hane Halkı Sepet Hacmi'],
      risesWhen: 'Gıda enflasyonu yüksekken kasadaki sıcak nakit hızla büyüdüğünde.',
      fallsWhen: 'Maliyet artışları raf fiyatından hızlı büyüdüğünde veya rekabet cezaları geldiğinde.',
      relatedKeys: ['reel-perakende-mgros', 'emtia-tarim-dba', 'halka-arz-tabgd']
    },
    'bist-eregl': {
      shortDesc: 'Ereğli Demir Çelik (EREGL). Araba, beyaz eşya ve boru fabrikalarının ana yassı çelik üreticisi.',
      howItWorks: 'Tam bir "mevsim ve döngü" şirketidir: Dünya fabrikaları harıl harıl çalışırken çelik fiyatları uçar ve para basar; Çin dünyaya ucuz çelik döktüğünde ise kârı daralır. Kışta toplanıp baharda hasat edilir.',
      rawInputs: ['Demir Cevheri', 'Koklaşabilir Taşkömürü', 'Dünya Sıcak Sac (HRC) Fiyatı'],
      risesWhen: 'Küresel sanayi ve altyapı yatırımları canlanıp çelik dolar fiyatları döndüğünde.',
      fallsWhen: 'Çin dampingli ucuz çelik sattığında ve enerji maliyetleri şiştiğinde.',
      relatedKeys: ['bist-froto', 'bist-krdmd', 'bist-sise']
    },
    'bist-asels': {
      shortDesc: 'ASELSAN (ASELS). Radar, hava savunma ve elektro-optik sistemler üreten yüksek teknoloji savunma lideri.',
      howItWorks: 'Yıllarca sürecek milyarlarca dolarlık kesinleşmiş sipariş defteriyle (backlog) çalışır. İhracat payı büyüdükçe ve hak ediş tahsilatları hızlandıkça kasası güçlenir.',
      rawInputs: ['Yarı İletken Çipler', 'Ar-Ge Mühendisliği', 'Uluslararası Savunma Sözleşmeleri'],
      risesWhen: 'Yeni döviz bazlı ihracat imzaları ve nakit tahsilatlar hızlandığında.',
      fallsWhen: 'Alacak tahsilat süreleri uzayıp işletme sermayesi sıkıştığında.',
      relatedKeys: ['halka-arz-altny', 'fon-tematik-yari-iletken-soxx', 'reel-yazilim-miatk']
    },
    'reel-enerji-astor': {
      shortDesc: 'Astor Enerji (ASTOR). Şehir şebekeleri ve güneş/rüzgâr santralleri için dev güç trafoları üreten sanayici.',
      howItWorks: 'Elektrik kesintilerini önleyen ve yenilenebilir enerjiyi şebekeye bağlayan trafoları üretip dünyaya satar; ana hammaddesi bakır ve silisli çeliktir.',
      rawInputs: ['Elektrolitik Bakır', 'Silisli Sac', 'Avrupa & Türkiye Şebeke Yatırımları'],
      risesWhen: 'Dünyada elektrik şebekesi yenileme ve trafo siparişleri arttığında.',
      fallsWhen: 'Bakır fiyatları sert fırlayıp tahtada kurumsal satış baskısı oluştuğunda.',
      relatedKeys: ['reel-enerji-cwene', 'reel-enerji-smrtg', 'gram-gumus-spot']
    },
    'gayrimenkul-konut-ekgyo': {
      shortDesc: 'Emlak Konut GYO (EKGYO). Arsa geliştirme ve konut projeleri yürüten en büyük gayrimenkul ortaklığı.',
      howItWorks: 'Faiz teraziyle ters çalışır: Konut kredisi faizleri yüksekken yaprak kıpırdamaz; Merkez Bankası faiz indirmeye başlayacağı beklentisi doğduğunda ise kıştan önce odun stoklayanlar kazanır.',
      rawInputs: ['TCMB & Konut Kredisi Faizleri', 'İnşaat Demiri & Çimento Maliyeti'],
      risesWhen: 'Faiz indirim döngüsü başladığında ve konut kampanyaları açıldığında.',
      fallsWhen: 'Politika faizi uzun süre yüksek kaldığında.',
      relatedKeys: ['gayrimenkul-ticari-rygyo', 'gayrimenkul-gyo-fonu-optgy', 'mevduat-ust']
    },
    'bist-sasa': {
      shortDesc: 'SASA Polyester (SASA). Dev petrokimya yatırımları yapan ancak ağır yatırım borcu taşıyan sanayi şirketi.',
      howItWorks: 'Borsanın en unutulmaz dersidir: 2022’de "herkes alıyor" diye gerçek değerinin 10 katına fırladığında tepeden atlayanları yıllarca eritmiştir. Kaliteli tesis kurmak ayrıdır, aşırı pahalı fiyattan ve borçlu bilançodan almak ayrıdır.',
      rawInputs: ['Petrol Türevleri (PTA/MEG)', 'Döviz Yatırım Kredisi Faizi', 'Tekstil Talebi'],
      risesWhen: 'Yatırımlar bitip serbest nakit üretmeye başladığında ve borç eridiğinde.',
      fallsWhen: 'Yüksek finansman gideri faaliyet kârını yuttuğunda veya çarpanlar şiştiğinde.',
      relatedKeys: ['emtia-petrol-bno', 'bist-tuprs']
    },
    'abd-sp500-spy': {
      shortDesc: 'ABD S&P 500 Endeks Fonu (SPY). Apple, Microsoft, NVIDIA, Amazon dahil dünyanın en büyük 500 şirketine tek tıkla ortaklık.',
      howItWorks: 'Dünya ekonomisinin kaymağını dolar bazında toplar. Türkiye’de satarken alış-satış arası Yİ-ÜFE enflasyonu %10 üstündeyse TL maliyetin enflasyonla düzeltilir, sadece reel kazancın vergiye tabidir.',
      rawInputs: ['ABD Şirket Kârları', 'Fed Faiz Kararları', 'Dolar / TL Kuru'],
      risesWhen: 'Küresel teknoloji ve ABD şirket kârları büyüdüğünde.',
      fallsWhen: 'ABD’de resesyon veya faiz şoku yaşandığında.',
      relatedKeys: ['abd-nasdaq-qqq', 'kuresel-hisse-nvda', 'kuresel-hisse-msft']
    },
    'kuresel-hisse-nvda': {
      shortDesc: 'NVIDIA (NVDA). Yapay zekâ veri merkezlerinin kalbi olan çipleri üreten dünya teknoloji devi.',
      howItWorks: 'Altına hücum çağında altın arayanlara kazma-kürek satan dükkân gibidir; kâr marjı olağanüstüdür ama beklenti en ufak yavaşladığında çok sert sallanır.',
      rawInputs: ['TSMC Çip Üretim Kapasitesi', 'Büyük Teknoloji Şirketlerinin Sunucu Yatırımları'],
      risesWhen: 'Yapay zekâ sunucu siparişleri katlandığında.',
      fallsWhen: 'Teknoloji devleri veri merkezi bütçelerini kıstığında.',
      relatedKeys: ['fon-tematik-yari-iletken-soxx', 'abd-nasdaq-qqq', 'kuresel-hisse-msft']
    },
    'kripto-btc': {
      shortDesc: 'Bitcoin (BTC/TRY). Arzı 21 milyonla sınırlı, 7/24 hiç kapanmayan küresel dijital likidite barometresi.',
      howItWorks: 'Kasasına kira veya temettü girmez; dünyada ucuz para bolluğu olduğunda roket gibi çıkar, likidite çekildiğinde -%60 çakılabilir. Sepetin tamamıyla değil, uykunu kaçırmayacak payla taşınır.',
      rawInputs: ['Küresel Dolar Likiditesi', 'Kurumsal ETF Girişleri', 'Dolar / TL Kuru'],
      risesWhen: 'Küresel para bolluğu ve risk iştahı arttığında.',
      fallsWhen: 'Küresel panik anlarında kaldıraçlı işlemler patladığında.',
      relatedKeys: ['kripto-eth', 'kripto-sol', 'abd-nasdaq-qqq']
    }
  };

  const SECTOR_DEFAULTS = {
    'Bankacılık & Mevduat': {
      how: 'Mevduat toplayıp ticari/bireysel kredi satarak faiz makası ve komisyon nakdi üretir.',
      inputs: ['TCMB Politika Faizi', 'Ülke Risk Primi (CDS)', 'Batık Kredi Oranı'],
      rise: 'Enflasyon düşüp faiz indirim döngüsü ve yabancı girişi başladığında.',
      fall: 'Fonlama maliyeti kredi faizini geçtiğinde veya tahsilatlar bozulduğunda.'
    },
    'Otomotiv & Yan Sanayi': {
      how: 'Çelik ve yan sanayi parçalarını işleyip iç pazara ve Avrupa’ya araç ihraç eder.',
      inputs: ['Yassı Çelik ve Alüminyum', 'Euro / TL Kuru', 'Avrupa Araç Talebi'],
      rise: 'Avrupa siparişleri ve Euro kuru güçlendiğinde.',
      fall: 'Kredi faizleri iç talebi kestiğinde veya Avrupa yavaşladığında.'
    },
    'Enerji, Elektrik & Gaz': {
      how: 'Baraj, rüzgâr, güneş veya doğalgaz santrallerinde elektrik üretip günlük sıcak nakit toplar.',
      inputs: ['Baraj Yağış Oranları (Kuraklık)', 'Doğalgaz & Kömür Fiyatı', 'EPİAŞ Elektrik Fiyatı'],
      rise: 'Yağışlar ve elektrik tüketimi güçlü, yatırım borcu düşük olduğunda.',
      fall: 'Kuraklık barajları vurduğunda veya döviz kredi borcu faizi kârı yediğinde.'
    },
    'Gıda, İçecek & Tarım': {
      how: 'Tarladan çıkan ürünü işleyip market rafına koyar; krizde de talep gören savunma sektörüdür.',
      inputs: ['Buğday, Şeker & Gübre', 'Mazot Nakliye Gideri', 'Kuraklık & İklim'],
      rise: 'Yaz turizm sezonunda ve gıda enflasyonunu rafa yansıtabildiğinde.',
      fall: 'Kuraklık yüzünden hammadde maliyeti satış fiyatından hızlı fırladığında.'
    },
    'Teknoloji, Yazılım & Savunma': {
      how: 'Yazılım lisansı ve savunma elektroniği sözleşmeleriyle yüksek katma değer üretir.',
      inputs: ['Mühendislik Gücü', 'Yarı İletken Çip', 'Savunma & İhracat İhaleleri'],
      rise: 'Döviz bazlı sipariş defteri büyüyüp nakit tahsilata döndüğünde.',
      fall: 'Sırf popüler diye kazancının 40-50 katı fiyattan alındığında.'
    }
  };

  // --------------------------------------------------------------------------
  // 1. GÜNÜN SOKAK ZEKÂSI ÖZETİ ("GÖRMÜŞ GEÇİRMİŞ DOST" SES TONU)
  // --------------------------------------------------------------------------
  function getDailyStreetBriefing() {
    const K = global.AetherKernelV10;
    if (!K) return null;
    const md = K.getMarketData() || {};
    const clock = K.getTurkishClock();
    const dInfo = K.getDarphanePremiumInfo();
    const inf = K.getAnnualInflationPct();
    const usd = K.getUsdTry();
    const mc = md?.kitchenIntelSummary?.openHorizon?.macroChains || {};
    const brent = mc?.inputOutputChains?.brentOilUsd || 88;
    const brent1M = Number(mc?.inputOutputChains?.brentOilPerf1M || 0);
    const viop = K.getViopEveningSignal();
    const sukukRate = K.getAsset('kira-sertifikasi-sukuk')?.annualGrossRatePct || 36.5;
    const pumpCount = (md?.kitchenIntelSummary?.microstructureAndWhale?.telegramPumpAnomalies || []).length;

    let leadHeadline = '';
    let friendAdvice = '';

    if (dInfo.premiumPct >= 8) {
      leadHeadline = `Kapalıçarşı'da 1 gr fiziki altın ${Math.round(dInfo.spotGramPrice).toLocaleString('tr-TR')} ₺ iken, borsadaki kağıt sertifikası (ALTIN.S1) ${Math.round(dInfo.s1GramEquiv).toLocaleString('tr-TR')} ₺'den dönüyor!`;
      friendAdvice = `Bak dostum, aynı altına borsada gram başına tam ${Math.round(dInfo.diffTL).toLocaleString('tr-TR')} ₺ (+%${dInfo.premiumPct}) fazladan hava parası ödeniyor. Pazarda aynı domatesi yan tezgahta %13 pahalıya almazsın; ekranda da heyecanla tuşa basmadan önce teraziyi tart.`;
    } else if (Math.abs(brent1M) >= 8) {
      leadHeadline = `Brent petrol ${brent} $ seviyesinde (Son 1 ayda ${brent1M >= 0 ? '+' : ''}%${brent1M.toFixed(1)} hareket etti).`;
      friendAdvice = brent1M < 0
        ? `Mazotun ana hammaddesi petrol ucuzluyor. Bu ne demek? Uçak kaldıran THYAO'nun ve 81 ile kamyon yürüten perakendecinin yakıt faturası hafifler, marjı açılır.`
        : `Petrol sert pahalanıyor. Pompaya zam geldiğinde tarladan hallere gelen malın nakliyesi de havayollarının yakıt gideri de şişer; rafineri ve enerji tarafı ise stok gücü yazar.`;
    } else {
      leadHeadline = `Yıllık TÜİK enflasyonu %${inf.toFixed(1)}, Dolar ${usd.toFixed(2)} ₺, %0 vergili Kira Sertifikası yıllık %${sukukRate.toFixed(1)}.`;
      friendAdvice = `Nakit parayı boşta bekletmek her gün sessizce alım gücü kaybetmektir; öte yandan sosyal medyada bağıran ${pumpCount > 0 ? pumpCount + ' adet ' : ''}şişik tahtaya atlamak da kumardır. Kasasına gerçek nakit giren sağlam işlere odaklan.`;
    }

    const pulses = [
      {
        label: 'Enflasyon vs Vergisiz Getiri',
        value: `TÜFE %${inf.toFixed(1)} · Sukuk Net %${sukukRate.toFixed(1)}`,
        tone: sukukRate >= inf ? 'good' : 'warn'
      },
      {
        label: 'Altın Terazi Farkı (S1 vs Çarşı)',
        value: dInfo.premiumPct >= 5 ? `+%${dInfo.premiumPct} Hava Parası!` : `%${dInfo.premiumPct} Dengeli`,
        tone: dInfo.premiumPct >= 5 ? 'warn' : 'good'
      },
      {
        label: 'Mazot & Petrol Öncüsü',
        value: `${brent} $ (${brent1M >= 0 ? '+' : ''}%${brent1M.toFixed(1)} / ay)`,
        tone: brent1M <= 0 ? 'good' : 'warn'
      },
      {
        label: clock.viopEvening ? 'VİOP Akşam Seansı Sinyali' : 'VİOP Vadeli - Spot Makası',
        value: `XU030 Vadeli %${viop.basisPct >= 0 ? '+' : ''}${viop.basisPct}`,
        tone: 'info'
      }
    ];

    return { leadHeadline, friendAdvice, pulses };
  }

  // --------------------------------------------------------------------------
  // 2. CANLI KAP, RESMİ GAZETE VE MAKRO HABER -> ETKİLENEN VARLIK EŞLEŞTİRİCİ
  // --------------------------------------------------------------------------
  function getEnrichedLiveNewsFeed() {
    const K = global.AetherKernelV10;
    if (!K) return [];
    const md = K.getMarketData() || {};
    const rawFeed = md.liveRealWorldFeed || [];
    const horizonItems = md?.kitchenIntelSummary?.openHorizon?.items || [];

    const combined = [];

    for (const n of rawFeed.slice(0, 8)) {
      const t = String(n.title || '');
      const tUp = t.toLocaleUpperCase('tr-TR');
      let linkedKeys = [];
      let streetImpact = 'Makro fiyatlama ve piyasa algısı üzerinde doğrudan etkili güncel gelişme.';

      if (/PETROL|BRENT|AKARYAKIT|MAZOT/.test(tUp)) {
        linkedKeys = ['emtia-petrol-bno', 'bist-tuprs', 'bist-thyao', 'bist-pgsus'];
        streetImpact = 'Petrol hareketi önce rafineri marjını (TUPRS), ardından uçak yakıtı ve nakliye maliyetini (THYAO, BIMAS) doğrudan değiştirir.';
      } else if (/ENFLASYON|TÜİK|FAİZ|MERKEZ BANKASI|TCMB|MEVDUAT|STOPAJ|RESMİ GAZETE/.test(tUp)) {
        linkedKeys = ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust', 'gayrimenkul-konut-ekgyo'];
        streetImpact = 'Enflasyon ve faiz beklentisi sabit getirili araçların reel korumasını ve faize duyarlı GYO/banka hisselerini yeniden fiyatlar.';
      } else if (/TEMETTÜ|HALKA ARZ|BEDELLİ/.test(tUp)) {
        linkedKeys = ['bist-tuprs', 'bist-froto', 'reel-perakende-bimas', 'halka-arz-tabgd'];
        streetImpact = 'Nakit temettü kasadan yatırımcıya gerçek para dağıtır; bedelli sermaye artırımı ise ortaklardan taze para ister.';
      } else if (/ALTIN|ONS|FED|GÜMÜŞ/.test(tUp)) {
        linkedKeys = ['gram-altin-spot', 'altin-sertifikasi', 'gram-gumus-spot'];
        streetImpact = 'Küresel ons ve faiz beklentisi fiziki gram altın ve gümüş fiyatına saniyesi saniyesine yansır.';
      } else if (/KURAKLIK|YAĞIŞ|TARIM|GIDA|ŞEKER|BUĞDAY/.test(tUp)) {
        linkedKeys = ['emtia-tarim-dba', 'reel-perakende-bimas', 'reel-perakende-mgros'];
        streetImpact = 'Tarladaki rekolte ve kuraklık aylar sonra gıda fabrikalarının hammadde faturasını ve market rafını belirler.';
      } else {
        linkedKeys = ['bist-100', 'gram-altin-spot', 'doviz-usd'];
      }

      combined.push({
        id: 'nw_' + combined.length,
        badge: n.cat === 'kap_bist' ? 'KAP & Borsa' : (n.cat === 'hammadde_dunya' ? 'Hammadde & Dünya' : 'Resmi & Makro'),
        tone: n.cat === 'kap_bist' ? 'info' : 'warn',
        title: t,
        source: n.source || 'Piyasa Akışı',
        streetImpact,
        linkedKeys
      });
    }

    for (const h of horizonItems.slice(0, 6)) {
      const tickers = (h.detectedTickers || []).filter((tk) => K.getAsset(tk));
      combined.push({
        id: 'hz_' + combined.length,
        badge: String(h.badge || 'Mutfak İstihbaratı').replace(/^[^\wÇĞİÖŞÜçğıöşü]+/u, '').trim(),
        tone: h.direction === 'BEARISH_TRAP' ? 'danger' : (h.direction === 'BULLISH_CATALYST' ? 'good' : 'info'),
        title: h.title,
        source: h.pubDate || 'KAP / Resmi Tarama',
        streetImpact: h.whyItMatters,
        linkedKeys: tickers.length > 0 ? tickers.map((tk) => K.getAsset(tk).key) : ['bist-100', 'kira-sertifikasi-sukuk']
      });
    }

    return combined.slice(0, 10);
  }

  // --------------------------------------------------------------------------
  // 3. 6 SOKAK ZEKÂSI DOMİNO ZİNCİRİ (KURAKLIK, MAZOT, KIŞ STOKU, ALTIN, İHRACAT, FAİZ)
  // --------------------------------------------------------------------------
  function getLiveWorldChains() {
    const K = global.AetherKernelV10;
    if (!K) return [];
    const md = K.getMarketData() || {};
    const mc = md?.kitchenIntelSummary?.openHorizon?.macroChains || {};
    const brent = mc?.inputOutputChains?.brentOilUsd || 88.4;
    const copper = mc?.inputOutputChains?.copperUsd || 5.74;
    const damPct = md?.worldLiveEvolution?.townWeatherAndMood?.damWaterPct || 41.8;
    const gold = K.getAsset('gram-altin-spot');
    const s1Info = K.getDarphanePremiumInfo();
    const dep = K.getAsset('mevduat-ust');
    const eur = K.getAsset('doviz-eur');
    const inf = K.getAnnualInflationPct();

    return [
      {
        id: 'chain-oil',
        title: 'Mazot -> Domates & Uçak Bileti',
        triggerHeadline: `Brent Petrol ${brent} $ · Rafineriden Market Kasasına Maliyet Zinciri`,
        step1: 'Ham Petrol Varili (Brent)',
        step2: 'Rafineri Mazot & Jet Yakıtı (TÜPRAŞ)',
        step3: 'Uçak Gideri & Hal Kamyonu (THYAO, Pegasus, BİM)',
        insight: 'Pazarda domatesin niye pahalandığını anlamanın sırrı mazottadır: Petrol düştüğünde uçak kaldıran THYAO ve binlerce kamyonla mal taşıyan perakendeci nefes alır; petrol fırladığında ise rafineri (TUPRS) stok gücü kazanır.',
        assetKeys: ['emtia-petrol-bno', 'bist-tuprs', 'bist-thyao', 'bist-pgsus', 'reel-perakende-bimas']
      },
      {
        id: 'chain-drought',
        title: 'Kuraklık -> Baraj, Fabrika & Raf',
        triggerHeadline: `Baraj Doluluk Referansı %${damPct} · İklimden Bilançoya Öncü Bakış`,
        step1: 'Yağış Azlığı & Tarım Emtiası (DBA)',
        step2: 'Hidroelektrik & Gıda Hammadde Maliyeti',
        step3: 'Peşin Kasalı Marketler & İçecek/Gıda (BİM, Migros, TAB Gıda)',
        insight: 'Kuraklık başladığında barajdan ucuz elektrik üreten HES’ler zorlanır ve tarladaki ürün azalır; aylar sonra hammaddeyi ucuza stoklamış ve raf fiyatını anında güncelleyen peşin kasalı marketler ayakta kalır.',
        assetKeys: ['emtia-tarim-dba', 'reel-perakende-bimas', 'reel-perakende-mgros', 'halka-arz-tabgd', 'bist-ccola']
      },
      {
        id: 'chain-gold',
        title: 'Altın Terazisi & Hava Parası',
        triggerHeadline: `Çarşı Gram ${Math.round(gold?.priceTL || 6115).toLocaleString('tr-TR')} ₺ vs Borsa ALTIN.S1 +%${s1Info.premiumPct} Fark`,
        step1: 'Ons Altın ($) + Dolar/TL Kuru',
        step2: 'Kapalıçarşı Fiziki Gram (%0 Vergi · Dar Makas)',
        step3: `ALTIN.S1 (+${Math.round(s1Info.diffTL)} ₺/gr Hava Parası) & Altın Fonu (%17,5 Stopaj)`,
        insight: `Aynı altını nereden aldığın kaderini değiştirir: Kapalıçarşı'da vergi %0'dır; Altın BYF fonlarında kârdan %17,5 vergi kesilir; ALTIN.S1 sertifikasında ise kalabalık şu an gram başına ${Math.round(s1Info.diffTL).toLocaleString('tr-TR')} ₺ fazladan hava parası ödüyor!`,
        assetKeys: ['gram-altin-spot', 'altin-sertifikasi', 'altin-fonu-zgold', 'ceyrek-altin', 'gram-gumus-spot']
      },
      {
        id: 'chain-winter',
        title: 'Kış Öncesi Enerji & Bakır Stoku',
        triggerHeadline: `Bakır ${copper} $ · Şebeke, Trafo ve Yenilenebilir Döngüsü`,
        step1: 'Bakır, Gümüş & Doğalgaz Girişi',
        step2: 'Trafo ve Güneş Paneli Üreticileri (Astor, CW Enerji)',
        step3: 'Elektrik Dağıtım & Sanayi Üretimi (Enerjisa)',
        insight: 'Kış gelmeden odun-kömür stoklayan köylü gibi, faiz ve mevsim döngüleri dönmeden önce şebeke yenileme ve enerji altyapı darboğazlarını okuyan yatırımcı sürüden önce pozisyon alır.',
        assetKeys: ['reel-enerji-astor', 'reel-enerji-cwene', 'gram-gumus-spot', 'bist-enjsa', 'bist-smrtg']
      },
      {
        id: 'chain-export',
        title: 'Çelik, Euro & Avrupa İhracatı',
        triggerHeadline: `Euro/TL ${(eur?.priceTL || 55.4).toFixed(2)} ₺ · Fabrikadan Limana Döviz Kasası`,
        step1: 'Yassı Çelik Sac & Alüminyum (Ereğli)',
        step2: 'Avrupa İhracat Devleri (Ford Otosan, Tofaş)',
        step3: 'Niş Yan Sanayi & Savunma (ASELSAN, Ege Endüstri)',
        insight: 'İçeride TL sıkışsa bile ürününü Avrupa ve dünyaya dövizle satan fabrikalar bilançolarını doğal döviz kalkanıyla korur.',
        assetKeys: ['doviz-eur', 'bist-eregl', 'bist-froto', 'bist-toaso', 'bist-asels']
      },
      {
        id: 'chain-rates',
        title: 'Faiz Kalkanı vs Borçlu Şirketler',
        triggerHeadline: `Mevduat Brüt %${dep?.annualGrossRatePct || 39} · Enflasyon %${inf.toFixed(1)}`,
        step1: 'Merkez Bankası Politika Faizi',
        step2: '%0 Stopaj Sukuk & Günlük PPF Kalkanı',
        step3: 'Faiz İndirimi Bekleyen GYO & Borçlu Sanayi (EKGYO, SASA)',
        insight: 'Faizler yüksekken borçlu şirketlerin kârı banka faizine gider; bu mevsimde nakit üretenler ve %0 vergili Sukuk korur. Faizler inmeye başlayacağı zaman ise ilk GYO ve sanayi uyanır.',
        assetKeys: ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust', 'gayrimenkul-konut-ekgyo', 'bist-sasa']
      }
    ];
  }

  // --------------------------------------------------------------------------
  // 4. 6 GERÇEKÇİ KRİZ & FIRTINA TATBİKATI ("ORTALIK KARIŞTIĞINDA KİM SOĞUKKANLI?")
  // --------------------------------------------------------------------------
  const CRISIS_SCENARIOS = [
    {
      id: 'NONE',
      title: 'Tatbikat Seç (Normal Piyasa)',
      desc: 'Her şey güllük gülistanlık giderken aniden ortalık karıştığında mevcut portföyüne ne olacağını test et.'
    },
    {
      id: 'STRAIT_BLOCKADE',
      title: 'Boğazlarda Gemi Sıkışması & Petrol Şoku (+%35)',
      desc: 'Deniz ticareti kilitlendi, Brent petrol bir gecede +%35 fırladı, küresel navlun ve altın sert yükseldi; havacılık ve ithalata dayalı sektörler satış yedi.',
      computeAssetShockPct(a) {
        if (a.id === 'emtia-petrol-bno') return 35;
        if (a.ticker === 'TUPRS') return 14;
        if (a.id.includes('altin') || a.id.includes('gumus')) return 11;
        if (String(a.id).startsWith('doviz-')) return 6;
        if (['THYAO', 'PGSUS', 'TAVHL'].includes(a.ticker)) return -16;
        if (a.isRateInstrument) return 0;
        if (a.venue === 'CRYPTO_24_7') return -14;
        if (a.venue === 'BIST') return -7;
        return -4;
      }
    },
    {
      id: 'GRID_BLACKOUT',
      title: 'Bölgesel Elektrik & Sanayi Kesintisi Krizi',
      desc: 'Organize sanayi bölgelerinde enerji kısıntısı başladı; yüksek enerji tüketen fabrikalar yavaşlarken şebeke/trafo üreticileri ve nakit kalkanları ayrıştı.',
      computeAssetShockPct(a) {
        if (['ASTOR', 'CWENE', 'SMRTG', 'ENJSA'].includes(a.ticker)) return 9;
        if (a.isRateInstrument) return 0;
        if (a.id.includes('altin') || String(a.id).startsWith('doviz-')) return 5;
        if (['EREGL', 'KRDMD', 'SASA', 'SISE'].includes(a.ticker)) return -13;
        if (a.venue === 'BIST') return -8;
        return -2;
      }
    },
    {
      id: 'SEVERE_DROUGHT',
      title: 'Şiddetli Kuraklık & Gıda Enflasyonu Dalgası',
      desc: 'Barajlar kritik sınırın altına indi, tarımsal rekolte düştü; gıda fiyatları sıçrarken su/enerji yoğun tesisler zorlandı.',
      computeAssetShockPct(a) {
        if (a.id === 'emtia-tarim-dba') return 22;
        if (['BIMAS', 'MGROS', 'TABGD'].includes(a.ticker)) return 8;
        if (a.isRateInstrument) return 0;
        if (a.categoryName.includes('Enerji') && !['ASTOR'].includes(a.ticker)) return -11;
        if (a.venue === 'BIST') return -5;
        return 2;
      }
    },
    {
      id: 'SHOCK_RATE_HIKE',
      title: 'Perşembe 14:00 Şok TCMB Faiz Artışı (+750 bp)',
      desc: 'Merkez Bankası beklentilerin çok üzerinde sert faiz artırdı; kredili konut (GYO) ve yüksek borçlu şirketler tabana yaklaştı.',
      computeAssetShockPct(a) {
        if (a.isRateInstrument) return 1.5;
        if (a.categoryName.includes('Gayrimenkul') || ['EKGYO', 'RYGYO', 'ISGYO', 'SASA'].includes(a.ticker)) return -15;
        if (a.bistRow && (a.bistRow.totalDebtMillionTL || 0) > (a.bistRow.cashMillionTL || 0) * 3) return -13;
        if (String(a.id).startsWith('doviz-') || a.id.includes('altin')) return -4.5;
        if (a.venue === 'BIST') return -6.5;
        return -2;
      }
    },
    {
      id: 'FX_SPIKE',
      title: 'Ani Döviz Kuru Sıçraması (+%22 Kur Şoku)',
      desc: 'İç ve dış gerilimle döviz kurları +%22 sıçradı; döviz geliri olan ihracatçılar ve altın korurken borçlu iç pazar sarsıldı.',
      computeAssetShockPct(a) {
        if (String(a.id).startsWith('doviz-') || a.isForeignUsd || a.id.includes('altin') || a.id.includes('gumus') || a.venue === 'CRYPTO_24_7') return 21;
        if (['THYAO', 'FROTO', 'TOASO', 'TUPRS', 'ASELS', 'SISE', 'EREGL'].includes(a.ticker)) return 12;
        if (a.isRateInstrument) return 0; // Nominal düşmez ama alım gücü %18 erir!
        if (a.venue === 'BIST') return 3;
        return 0;
      }
    },
    {
      id: 'GLOBAL_CRASH',
      title: 'Küresel Likidite Çöküşü & Kaldıraç Tasfiyesi',
      desc: 'Dünya borsalarında sert satış dalgası: Kripto -%32, ABD teknoloji -%16, gelişen ülke borsaları -%11 çekildi; sabit getiri ve fiziki altın korudu.',
      computeAssetShockPct(a) {
        if (a.venue === 'CRYPTO_24_7') return -32;
        if (a.isForeignUsd && a.id !== 'gram-altin-spot') return -16;
        if (a.id === 'gram-altin-spot' || a.id === 'ceyrek-altin') return 6;
        if (a.isRateInstrument) return 0;
        if (a.venue === 'BIST') return -11;
        return -5;
      }
    }
  ];

  function simulatePortfolioCrisis(crisisId) {
    const K = global.AetherKernelV10;
    if (!K || !crisisId || crisisId === 'NONE') return null;
    const sc = CRISIS_SCENARIOS.find((x) => x.id === crisisId);
    if (!sc) return null;

    const snap = K.evaluateMemberPortfolio();
    let totalDeltaTL = 0;
    const itemImpacts = [];

    for (const it of snap.spotItems) {
      const a = K.getAsset(it.assetKey);
      if (!a) continue;
      const pct = sc.computeAssetShockPct(a);
      const dTL = Math.round(it.netValTL * (pct / 100));
      totalDeltaTL += dTL;
      itemImpacts.push({ name: it.ticker || it.name, pct, deltaTL: dTL });
    }
    for (const tr of snap.tranches) {
      const a = K.getAsset(tr.assetKey);
      if (!a) continue;
      const pct = sc.computeAssetShockPct(a);
      const dTL = Math.round(tr.accruedNetValueTL * (pct / 100));
      totalDeltaTL += dTL;
      if (dTL !== 0) itemImpacts.push({ name: tr.name, pct, deltaTL: dTL });
    }

    const postNetWorthTL = Math.max(0, Math.round(snap.totalNetWorthTL + totalDeltaTL));
    const marginWiped = snap.marginDebtTL > 0 && (postNetWorthTL / Math.max(1, postNetWorthTL + snap.marginDebtTL)) < 0.35;

    return {
      scenario: sc,
      totalDeltaTL,
      totalDeltaPct: +((totalDeltaTL / Math.max(1, snap.totalNetWorthTL)) * 100).toFixed(2),
      postNetWorthTL,
      marginWiped,
      itemImpacts: itemImpacts.sort((a, b) => a.deltaTL - b.deltaTL)
    };
  }

  // --------------------------------------------------------------------------
  // 5. MAHALLE FIRINI SOMUTLAŞTIRMASI (100.000 ₺ ORTAKLIK HESABI) & 52H TERMOMETRE
  // --------------------------------------------------------------------------
  function computeBakery100kScale(asset) {
    const r = asset?.bistRow;
    if (!r || !r.marketCapBillionTL || r.marketCapBillionTL <= 0) return null;
    if (r.entityKind === 'bank' || r.entityKind === 'insurance') return null;

    const mcapMillion = r.marketCapBillionTL * 1000;
    const ratio = 0.1 / mcapMillion; // 100.000 TL = 0.1 Milyon TL ortaklık payı

    const annualOcfTL = Math.round((Number(r.ocfMillionTL) || 0) * 1e6 * ratio);
    const dailyOcfTL = +(annualOcfTL / 365).toFixed(1);
    const cashShareTL = Math.round((Number(r.cashMillionTL) || 0) * 1e6 * ratio);
    const debtShareTL = Math.round((Number(r.totalDebtMillionTL) || 0) * 1e6 * ratio);
    const annualNetDivTL = Math.round(100000 * ((Number(r.dividendYield) || 0) / 100) * 0.85);

    let plainSummary = '';
    if (annualOcfTL > 0 && cashShareTL >= debtShareTL) {
      plainSummary = `100.000 ₺ ortak olduğunda fabrikanın kasasına senin payına günde +${dailyOcfTL.toLocaleString('tr-TR')} ₺ (yılda +${annualOcfTL.toLocaleString('tr-TR')} ₺) gerçek nakit giriyor ve kasadaki hazır nakit borcundan fazla!`;
    } else if (annualOcfTL > 0) {
      plainSummary = `100.000 ₺ ortaklığa karşılık kasaya yılda +${annualOcfTL.toLocaleString('tr-TR')} ₺ (günde +${dailyOcfTL.toLocaleString('tr-TR')} ₺) sıcak faaliyet nakdi giriyor.`;
    } else {
      plainSummary = `Dikkat: 100.000 ₺ ortaklığa karşılık şirketin esas faaliyet kasasından yılda ${annualOcfTL.toLocaleString('tr-TR')} ₺ nakit çıkıyor (Sırtına binen borç payı: ${debtShareTL.toLocaleString('tr-TR')} ₺).`;
    }

    return {
      annualOcfTL,
      dailyOcfTL,
      cashShareTL,
      debtShareTL,
      annualNetDivTL,
      plainSummary
    };
  }

  function computeRange52W(asset) {
    const r = asset?.bistRow;
    if (r && r.low52W > 0 && r.high52W > r.low52W && asset.priceTL > 0) {
      const pct = Math.max(0, Math.min(100, Math.round(((asset.priceTL - r.low52W) / (r.high52W - r.low52W)) * 100)));
      return {
        low: r.low52W,
        high: r.high52W,
        pct,
        drawdownPct: Number(r.drawdown52WPct) || +(((asset.priceTL / r.high52W) - 1) * 100).toFixed(1)
      };
    }
    const td = asset?.trainedDaily;
    if (td && td.low52w > 0 && td.high52w > td.low52w && asset.priceTL > 0) {
      const low = asset.isForeignUsd ? +(td.low52w * global.AetherKernelV10.getUsdTry()).toFixed(2) : td.low52w;
      const high = asset.isForeignUsd ? +(td.high52w * global.AetherKernelV10.getUsdTry()).toFixed(2) : td.high52w;
      const pct = Math.max(0, Math.min(100, Math.round(((asset.priceTL - low) / Math.max(0.01, high - low)) * 100)));
      return {
        low,
        high,
        pct,
        drawdownPct: +(((asset.priceTL / high) - 1) * 100).toFixed(1)
      };
    }
    return null;
  }

  function getCardQuickSignal(asset) {
    const K = global.AetherKernelV10;
    if (!asset) return { badge: null, tone: 'neutral', oneLiner: '' };

    if (asset.subVenue === 'DARPHANE_S1') {
      const d = K.getDarphanePremiumInfo();
      if (d.premiumPct >= 5) {
        return {
          badge: `⚠️ +%${d.premiumPct} Hava Parası`,
          tone: 'warn',
          oneLiner: `Fiziki gram altından gr başına ${Math.round(d.diffTL).toLocaleString('tr-TR')} ₺ daha pahalı işlem görüyor!`
        };
      }
    }

    if (asset.isRateInstrument) {
      const netAnnual = +(asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100)).toFixed(1);
      const monthly100k = Math.round((100000 * (netAnnual / 100)) / 12);
      return {
        badge: asset.stopajPct === 0 ? '💧 %0 Vergi Kalkanı' : `💧 Net %${netAnnual}/Yıl`,
        tone: 'good',
        oneLiner: `100.000 ₺ bağlarsan her ay net +${monthly100k.toLocaleString('tr-TR')} ₺ kasana damlar.`
      };
    }

    if (asset.isPumpAnomaly || asset.isTms29Illusion || asset.distributionTrap || asset.isPatronSelling) {
      let why = 'Kurumsal para çıkışı veya bilanço zayıflığı tespit edildi.';
      if (asset.isPumpAnomaly) why = 'Sosyal medya / olağandışı hacim şişmesi uyarısı — sürü coşkusuna dikkat!';
      else if (asset.isTms29Illusion) why = 'Kağıt üstünde kâr görünse de kasadan gerçek nakit çıkıyor (TMS-29 illüzyonu).';
      else if (asset.isPatronSelling) why = 'MKK dolaşımdaki pay artışı (ortak satışı hazırlığı) izleniyor.';
      else if (asset.distributionTrap?.trapReason) why = asset.distributionTrap.trapReason;
      return {
        badge: '⛔ Tuzak / Risk Alarmı',
        tone: 'danger',
        oneLiner: why
      };
    }

    if (asset.accumulationGem || (asset.bistRow && (asset.bistRow.drawdown52WPct || 0) <= -30 && (asset.bistRow.ocfMillionTL || 0) > 0 && (asset.bistRow.cmf20 || 0) >= 0.12)) {
      const bk = computeBakery100kScale(asset);
      return {
        badge: '🔥 Yangın Yeri Hazinesi',
        tone: 'good',
        oneLiner: bk
          ? `Zirveden %${Math.abs(Math.round(asset.bistRow.drawdown52WPct || 35))} ucuz; 100B ₺'ye yılda +${bk.annualOcfTL.toLocaleString('tr-TR')} ₺ nakit üretiyor.`
          : 'Sert düşüş sonrası tahtada kurumsal toplama ve pozitif nakit akışı var.'
      };
    }

    const bk = computeBakery100kScale(asset);
    if (bk) {
      if (bk.annualOcfTL > 0 && bk.cashShareTL >= bk.debtShareTL * 0.8) {
        return {
          badge: '🥖 Sağlam Kasa',
          tone: 'good',
          oneLiner: `100.000 ₺ ortaklığa yılda +${bk.annualOcfTL.toLocaleString('tr-TR')} ₺ gerçek nakit üretir · Borcu düşük.`
        };
      }
      if (bk.annualOcfTL < 0) {
        return {
          badge: '⚠️ Nakit Yakıyor',
          tone: 'warn',
          oneLiner: `100.000 ₺ ortaklığa karşılık kasadan yılda ${bk.annualOcfTL.toLocaleString('tr-TR')} ₺ nakit eksiliyor.`
        };
      }
      return {
        badge: (asset.bistRow?.dividendYield || 0) >= 2.5 ? '💧 Temettü Ödeyicisi' : '📊 Reel Şirket',
        tone: 'info',
        oneLiner: `100.000 ₺ ortaklığa yılda +${bk.annualOcfTL.toLocaleString('tr-TR')} ₺ faaliyet nakdi giriyor.`
      };
    }

    const custom = ASSET_PROFILES[asset.key] || ASSET_PROFILES[asset.id];
    return {
      badge: asset.venue === 'TWO_DOOR' ? '⚖️ Çarşı vs Banka' : (asset.isForeignUsd ? '🌍 Küresel Dolar Varlığı' : null),
      tone: 'neutral',
      oneLiner: custom ? custom.shortDesc : asset.categoryName
    };
  }

  function explainAsset(assetOrKey) {
    const K = global.AetherKernelV10;
    const asset = typeof assetOrKey === 'string' ? K?.getAsset(assetOrKey) : assetOrKey;
    if (!asset) return null;

    const custom = ASSET_PROFILES[asset.key] || ASSET_PROFILES[asset.id] || null;
    const r = asset.bistRow || null;
    const secDef = SECTOR_DEFAULTS[asset.categoryName] || null;
    const bakery100k = computeBakery100kScale(asset);
    const range52W = computeRange52W(asset);
    const quickSignal = getCardQuickSignal(asset);

    let shortDesc = custom?.shortDesc || '';
    let howItWorks = custom?.howItWorks || '';
    let rawInputs = custom?.rawInputs || [];
    let risesWhen = custom?.risesWhen || '';
    let fallsWhen = custom?.fallsWhen || '';
    let relatedKeys = custom?.relatedKeys || [];

    if (!custom) {
      if (asset.isRateInstrument) {
        shortDesc = `Yıllık brüt %${asset.annualGrossRatePct.toFixed(1)} oranlı, %${asset.stopajPct} stopajlı sabit getiri aracı.`;
        howItWorks = 'Anaparanı tahta dalgalanmasına sokmadan büyütür; asıl ölçü vergi düşüldükten sonra kalan net getirinin mutfak enflasyonunu geçmesidir.';
        rawInputs = ['Merkez Bankası Politika Faizi', 'TÜİK Enflasyonu', 'Stopaj Vergi Oranı'];
        risesWhen = 'Net faiz enflasyonun üzerinde kaldığında (pozitif reel getiri).';
        fallsWhen = 'Enflasyon veya kur net faizin üzerinde sıçradığında.';
        relatedKeys = ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust'];
      } else if (r) {
        shortDesc = `${r.sector || 'Borsa İstanbul'} sektöründe faaliyet gösteren gerçek şirket (${asset.ticker}).`;
        howItWorks = secDef?.how || `${asset.name}, kendi alanında üretim ve satış yaparak kasasına gerçek faaliyet nakdi sokmayı hedefler.`;
        rawInputs = secDef?.inputs || ['Enerji & Hammadde Maliyeti', 'Kredi Faizleri', 'İç ve İhracat Talebi'];
        risesWhen = secDef?.rise || 'Satışları ve kasasına giren gerçek faaliyet nakdi büyürken borçluluğu düşük kaldığında.';
        fallsWhen = secDef?.fall || 'Borç faizleri faaliyet kârını yuttuğunda veya kağıt üstünde kâr yazıp nakit yaktığında.';
      } else if (asset.isForeignUsd) {
        shortDesc = `Dolar bazında işlem gören küresel yatırım aracı (${asset.symbol}).`;
        howItWorks = 'Hem yurt dışındaki dolar fiyatından hem de içerideki Dolar/TL kurundan aynı anda beslenir.';
        rawInputs = ['Küresel Dolar Fiyatı', 'Dolar / TL Kuru', 'GVK Mükerrer 80 Yİ-ÜFE Endekslemesi'];
        risesWhen = 'Küresel piyasada yükselirken kur desteklediğinde.';
        fallsWhen = 'Küresel borsalarda satış dalgası yaşandığında.';
        relatedKeys = ['abd-sp500-spy', 'abd-nasdaq-qqq', 'doviz-usd'];
      } else {
        shortDesc = `${asset.categoryName.replace(/^\d+\.\s*/, '')} grubunda gerçek yatırım aracı.`;
        howItWorks = 'Piyasadaki arz-talep, kur ve likidite koşullarına göre anlık fiyatlanır.';
        rawInputs = ['Küresel Likidite', 'Kur ve Faiz Dengesi'];
        risesWhen = 'Talep ve para girişi hızlandığında.';
        fallsWhen = 'Risk iştahı daraldığında.';
      }
    }

    let executionRule = '';
    if (asset.venue === 'BIST') {
      executionRule = `Hafta içi 10:00–18:00 arası anında eşleşir (kapalı saatte girilen emir sabah 10:00 açılış ziline yazılır). Satışta para gerçek T+2 takas kuralıyla 2 iş günü sonra çekilebilir nakde döner.${asset.stopajPct > 0 ? ` Kârdan %${asset.stopajPct} stopaj kesilir.` : ' Hisse alım-satım kazancında %0 stopaj uygulanır.'}`;
    } else if (asset.venue === 'TEFAS') {
      executionRule = `İş günleri 13:30 valör sınırından önce verilen emir gününde işlenir; 13:30 sonrası verilen emir +1 iş günü valör bekler. Stopaj: %${asset.stopajPct}.`;
    } else if (asset.venue === 'TWO_DOOR') {
      executionRule = `Kapalıçarşı (Pzt–Cmt 09:30–18:30, dar makas, %0 vergi) ile Mobil Banka (7/24 açık; ancak akşam 17:30 sonrası ve hafta sonu makas %3,60 açılır + %0,2 kambiyo vergisi kesilir) arasında gerçek seçim yaparsın.`;
    } else if (asset.subVenue === 'TERM_DEPOSIT') {
      executionRule = `Vade sonuna kadar (32/181/366 gün) kilitlenir. 6 aya kadar %17,5, 1 yıla kadar %15, 1 yıl üstü %10 stopaj kesilir. Vadeden önce bozarsan biriken faizin tamamı yanar!`;
    } else if (asset.isGvk80) {
      executionRule = `Satış anında alıştan bu yana Yİ-ÜFE üretici enflasyonu %10'u geçtiyse TL maliyetin enflasyonla yükseltilir; kalan reel kazanç beyana tabidir.`;
    } else {
      executionRule = `7/24 kesintisiz anlık piyasa fiyatıyla işlem görür (%0,10 işlem komisyonu).`;
    }

    // Akıllı Para / MKK Takas Özeti
    let smartMoneyNote = null;
    if (r && r.cmf20 != null) {
      if (r.cmf20 >= 0.15) smartMoneyNote = `Tahtada güçlü kurumsal para girişi var (CMF-20: +${r.cmf20.toFixed(2)} · Hacim iştahı alıcıdan yana).`;
      else if (r.cmf20 <= -0.15) smartMoneyNote = `Dikkat: Tahtada kurumsal para çıkışı / mal dağıtımı izi var (CMF-20: ${r.cmf20.toFixed(2)}).`;
      else smartMoneyNote = `Tahtada alıcı ve satıcı dengeli seyrediyor (CMF-20: ${r.cmf20.toFixed(2)}).`;
    }

    let health = null;
    if (r && (r.ocfMillionTL != null || r.netIncomeMillionTL != null)) {
      const ocf = Number(r.ocfMillionTL) || 0;
      const netInc = Number(r.netIncomeMillionTL) || 0;
      const cash = Number(r.cashMillionTL) || 0;
      const debt = Number(r.totalDebtMillionTL) || 0;
      let status = 'NEUTRAL';
      let verdict = 'Dengeli bilanço görünümü.';
      if (ocf > 0 && cash >= debt * 0.6) {
        status = 'GOOD';
        verdict = 'Kaya Gibi Kasa: Şirket esas işinden gerçek nakit basıyor ve borç yükü çok rahat.';
      } else if (netInc > 0 && ocf < 0) {
        status = 'WARN';
        verdict = 'Makyajlı Kâr Uyarısı: Bilançoda kağıt üzerinde kâr yazıyor ama kasadan gerçek nakit çıkıyor!';
      } else if (debt > Math.max(500, cash * 3) && ocf <= 0) {
        status = 'WARN';
        verdict = 'Ağır Borç Yükü: Hazır nakdine göre banka borcu çok yüksek; yüksek faiz döneminde kazancı faize gider.';
      } else if (ocf > 0) {
        status = 'GOOD';
        verdict = 'Sıcak Nakit Üretiyor: Satışlarından kasasına düzenli faaliyet nakdi giriyor.';
      }
      health = {
        kind: 'COMPANY',
        status,
        verdict,
        ocfMillionTL: ocf,
        netIncomeMillionTL: netInc,
        cashMillionTL: cash,
        totalDebtMillionTL: debt,
        pe: r.pe,
        pb: r.pb,
        dividendYield: r.dividendYield || 0,
        smartMoneyNote,
        bakery100k
      };
    } else if (asset.subVenue === 'DARPHANE_S1' || asset.id === 'gram-altin-spot') {
      const d = K.getDarphanePremiumInfo();
      health = {
        kind: 'GOLD_SPREAD',
        status: asset.subVenue === 'DARPHANE_S1' && d.premiumPct >= 5 ? 'WARN' : 'GOOD',
        spotGramTL: d.spotGramPrice,
        s1GramTL: d.s1GramEquiv,
        premiumPct: d.premiumPct,
        diffTL: d.diffTL,
        verdict: d.premiumPct >= 5
          ? `Darphane Sertifikası (ALTIN.S1) şu an Kapalıçarşı fiziki gram altından gram başına ${Math.round(d.diffTL).toLocaleString('tr-TR')} ₺ (+%${d.premiumPct}) daha pahalı!`
          : 'Fiziki gram altın ile sertifika fiyatı birbirine yakın dengede.'
      };
    } else if (asset.isRateInstrument) {
      const netAnnual = +(asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100)).toFixed(2);
      const inf = K.getAnnualInflationPct();
      health = {
        kind: 'RATE_VS_INF',
        status: netAnnual >= inf ? 'GOOD' : 'WARN',
        grossPct: asset.annualGrossRatePct,
        stopajPct: asset.stopajPct,
        netPct: netAnnual,
        inflationPct: inf,
        verdict: netAnnual >= inf
          ? `Vergi düşüldükten sonra kalan yıllık net %${netAnnual} getiri, mevcut %${inf.toFixed(1)} yıllık enflasyonun üzerinde reel koruma sağlıyor.`
          : `Vergi sonrası yıllık net %${netAnnual} kalıyor; %${inf.toFixed(1)} enflasyona karşı tek başına alım gücünü büyütmekte zorlanır.`
      };
    }

    return {
      asset,
      shortDesc,
      howItWorks,
      rawInputs,
      risesWhen,
      fallsWhen,
      relatedKeys,
      executionRule,
      range52W,
      quickSignal,
      bakery100k,
      smartMoneyNote,
      health
    };
  }

  global.RealInvestmentGuide = {
    explainAsset,
    getDailyStreetBriefing,
    getEnrichedLiveNewsFeed,
    getLiveWorldChains,
    getCardQuickSignal,
    computeRange52W,
    computeBakery100kScale,
    CRISIS_SCENARIOS,
    simulatePortfolioCrisis
  };
})(typeof window !== 'undefined' ? window : globalThis);
