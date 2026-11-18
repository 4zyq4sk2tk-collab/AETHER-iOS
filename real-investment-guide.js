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
      shortDesc: 'Darphane basımı 22 ayar fiziki çeyrek altın (1,75 gr). Anadolu’nun klasik uzun vadeli fiziki tasarruf aracı.',
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
    'Bankacılık': {
      how: 'Mevduat toplayıp ticari ve bireysel kredi vererek net faiz marjı, tahvil portföyü ve işlem komisyonu kârı üretir.',
      inputs: ['TCMB Politika Faizi', 'Ülke Risk Primi (CDS)', 'Kredi - Mevduat Faiz Makası'],
      rise: 'Enflasyon düşüp faiz indirim döngüsü başladığında ve yabancı sermaye girişi hızlandığında.',
      fall: 'Mevduat fonlama maliyeti kredi faizini aştığında veya tahsili gecikmiş alacaklar arttığında.'
    },
    'Sigorta & Emeklilik': {
      how: 'Milyonlarca poliçeden peşin prim toplar; hasar ödemesine kadar bu dev nakit havuzunu yüksek faizde çalıştırarak çift yönlü kazanır!',
      inputs: ['TCMB Mevduat/Tahvil Faizi', 'Kasko & Sağlık Poliçe Hacmi', 'Hasar/Prim Oranı'],
      rise: 'Yüksek faiz ortamında teknik nakit havuzu büyüdüğünde ve poliçe fiyatları güncellendiğinde.',
      fall: 'Büyük doğal afet hasarlarında veya yedek parça maliyeti poliçe artışını geçtiğinde.'
    },
    'Aracı Kurum & Finansman': {
      how: 'Borsa işlem hacminden komisyon ve yatırımcılara kullandırılan kredili işlem / VİOP teminat faizinden yüksek nakit üretir.',
      inputs: ['Borsa İstanbul Günlük İşlem Hacmi', 'Kredili İşlem Faiz Oranı', 'Halka Arz & Yatırımcı Sayısı'],
      rise: 'Borsada işlem hacmi ve yatırımcı iştahı canlandığında, yüksek faizle nemalandırma geliri büyüdüğünde.',
      fall: 'Borsa işlem hacimleri kuruduğunda.'
    },
    'Petrol, Rafineri & Doğalgaz': {
      how: 'Ham petrol ve enerji girdilerini işleyip mazot, benzin, jet yakıtı ve doğalgaz olarak sanayiye ve ulaşıma satar.',
      inputs: ['Brent Ham Petrol ($)', 'Akdeniz Rafineri Marjı', 'Dolar / TL Kuru'],
      rise: 'Dizel ve jet yakıtı marjları açıldığında, stok değerlemesi güçlendiğinde.',
      fall: 'Küresel durgunlukta yakıt talebi ve rafineri marjı daraldığında.'
    },
    'Havacılık & Lojistik': {
      how: 'Yolcu bileti ve uluslararası kargoyu dövizle satar; en kritik maliyet kalemi uçak/gemi yakıtıdır.',
      inputs: ['Brent Petrol & Jet Yakıtı', 'Turizm & Küresel Kargo Talebi', 'Euro / Dolar Paritesi'],
      rise: 'Yaz turizm sezonunda ve petrol fiyatları gerileyip yakıt faturası düştüğünde.',
      fall: 'Petrol sert fırladığında veya jeopolitik hava sahası kapanmaları yaşandığında.'
    },
    'Market & Perakende': {
      how: 'Temel tüketim ürünlerini müşteriden kasada peşin tahsil eder, tedarikçiye vadeli ödeyerek sıcak nakit döngüsü kurar.',
      inputs: ['Gıda Enflasyonu', 'Soğuk Zincir Mazot Gideri', 'Mağaza Sepet Büyümesi'],
      rise: 'Enflasyonist ortamda raf devir hızı ve kasadaki peşin nakit büyüdüğünde.',
      fall: 'Asgari ücret ve kira giderleri sepet büyümesinden hızlı arttığında.'
    },
    'Otomotiv & Yan Sanayi': {
      how: 'Çelik ve yan sanayi parçalarını işleyip iç pazara ve ağırlıkla Avrupa’ya dövizle araç ihraç eder.',
      inputs: ['Yassı Çelik ve Alüminyum', 'Euro / TL Kuru', 'Avrupa Araç Talebi'],
      rise: 'Avrupa siparişleri ve Euro kuru güçlendiğinde, iç pazarda taşıt kredileri gevşediğinde.',
      fall: 'Kredi faizleri iç talebi kestiğinde veya Avrupa sanayisi yavaşladığında.'
    },
    'Elektrik & Yenilenebilir Enerji': {
      how: 'Baraj, rüzgâr, güneş santrallerinde elektrik veya şebeke trafosu/paneli üreterek enerji dönüşümünden kazanır.',
      inputs: ['Baraj Yağış Oranları (Kuraklık)', 'Bakır & Gümüş Maliyeti', 'EPİAŞ Elektrik Fiyatı'],
      rise: 'Yağışlar ve şebeke yatırımları güçlü, döviz yatırım borcu düşük olduğunda.',
      fall: 'Kuraklık barajları vurduğunda veya ağır yatırım kredisi faizi kârı yediğinde.'
    },
    'Demir-Çelik & Metal': {
      how: 'Cevher ve hurdayı eritip otomotiv, beyaz eşya ve inşaatın ana hammaddesi olan çeliği üretir; döngüsel sektördür.',
      inputs: ['Demir Cevheri & Hurda ($)', 'Kok Kömürü & Elektrik', 'Dünya Sıcak Sac (HRC) Fiyatı'],
      rise: 'Küresel altyapı ve sanayi döngüsü yukarı döndüğünde.',
      fall: 'Çin dünyaya ucuz çelik döktüğünde ve enerji maliyetleri şiştiğinde.'
    },
    'Gıda, İçecek & Tarım': {
      how: 'Tarladan çıkan ürünü işleyip market rafına koyar; krizde de talep gören savunma sektörüdür.',
      inputs: ['Buğday, Şeker & Gübre', 'Mazot Nakliye Gideri', 'Kuraklık & İklim'],
      rise: 'Yaz turizm sezonunda ve gıda enflasyonunu rafa yansıtabildiğinde.',
      fall: 'Kuraklık yüzünden hammadde maliyeti satış fiyatından hızlı fırladığında.'
    },
    'Savunma & Havacılık Sanayi': {
      how: 'Radar, haberleşme ve savunma sistemlerini yıllara yayılan döviz bazlı sipariş defteriyle (backlog) üretir.',
      inputs: ['Yarı İletken Çip', 'Ar-Ge Mühendisliği', 'Uluslararası Savunma İhaleleri'],
      rise: 'Yeni ihracat sözleşmeleri imzalanıp nakit hak ediş tahsilatları hızlandığında.',
      fall: 'Tahsilat vadeleri uzayıp işletme sermayesi ihtiyacı arttığında.'
    },
    'Yazılım, Teknoloji & Telekom': {
      how: 'Milyonlarca aboneye veri/iletişim hizmeti veya kurumsal yazılım lisansı satarak tekrarlayan gelir üretir.',
      inputs: ['Abone & Veri Trafiği', '5G/Fiber Altyapı Yatırımı', 'Bilişim Mühendisliği Maliyeti'],
      rise: 'Enflasyon üstü tarife güncellemeleri bilançoya yansıdığında ve döviz yazılım ihracatı büyüdüğünde.',
      fall: 'Yüksek çarpanla şişmiş hisselerde büyüme beklentisi yavaşladığında.'
    },
    'Gayrimenkul & GYO': {
      how: 'Konut projeleri geliştirir veya AVM, depo ve ofis mülklerinden düzenli kira nakdi toplar.',
      inputs: ['TCMB & Konut Kredisi Faizleri', 'İnşaat Maliyet Endeksi', 'Ticari Kira Doluluk Oranı'],
      rise: 'Faiz indirim döngüsü başladığında ve net aktif değer iskontosu kapandığında.',
      fall: 'Politika ve kredi faizleri uzun süre yüksek kaldığında.'
    },
    'Çimento, Cam & Seramik': {
      how: 'Yüksek ısıda kireçtaşı ve silis kumunu işleyerek inşaat ve otomotiv/ambalaj sanayisine temel malzeme verir.',
      inputs: ['Doğalgaz, Petrokok & Elektrik', 'Kentsel Dönüşüm & Altyapı', 'İhracat Navlunu'],
      rise: 'Enerji fiyatları gerilerken konut ve altyapı şantiyeleri hızlandığında.',
      fall: 'Doğalgaz/elektrik faturası sıçrayıp inşaat sektörü durgunlaştığında.'
    },
    'Kimya, Gübre & Kağıt': {
      how: 'Petrokimya türevleri, tarımsal gübre ve ambalaj hammaddesi üreterek sanayi ve tarımı besler.',
      inputs: ['Petrol & Doğalgaz Türevleri', 'Tarımsal Ekim Sezonu', 'Döviz Kuru'],
      rise: 'Ekim sezonları öncesinde ve petrokimya ürün makasları açıldığında.',
      fall: 'İthal ucuz ürün rekabeti ve ağır döviz kredi borcu birleştiğinde.'
    },
    'Beyaz Eşya & Mobilya': {
      how: 'Çelik, plastik ve bakırı işleyip hem iç pazara hem Avrupa’ya buzdolabı, çamaşır makinesi ve mobilya satar.',
      inputs: ['Yassı Çelik, Bakır & Plastik', 'Euro / Dolar Paritesi', 'Tüketici Taksit Sınırları'],
      rise: 'Avrupa konut/yenileme talebi canlandığında ve hammadde ucuzladığında.',
      fall: 'Kredi kartı taksit kısıtlamaları ve Avrupa durgunluğu aynı anda vurduğunda.'
    },
    'İlaç & Sağlık': {
      how: 'İlaç üretimi, ecza deposu dağıtımı veya özel hastane hizmetiyle ekonomik döngüden bağımsız sağlık talebini karşılar.',
      inputs: ['Resmi İlaç Euro Kuru Güncellemesi', 'SGK ve Özel Sağlık Talebi', 'Etken Madde İthalatı'],
      rise: 'İlaç referans Euro kuru güncellendiğinde ve sağlık turizmi büyüdüğünde.',
      fall: 'İthal maliyetler artarken resmi fiyat güncellemesi geciktiğinde.'
    },
    'Madencilik & Altın': {
      how: 'Yer altındaki altın, bakır, çinko ve krom cevherini çıkarıp dünya dolar fiyatlarıyla satar.',
      inputs: ['Ons Altın & Bakır Fiyatı ($)', 'Dolar / TL Kuru', 'Rezerv & Maden İzni'],
      rise: 'Ons altın ve emtia fiyatları yükselirken kasadaki net nakit büyüdüğünde.',
      fall: 'Üretim tenörü düştüğünde veya maden sahası duruşları yaşandığında.'
    },
    'Holding & Çoklu Yatırım': {
      how: 'Enerji, banka, sanayi ve perakende gibi farklı sektörlerdeki dev şirketleri tek çatı altında toplar.',
      inputs: ['İştiraklerden Gelen Temettüler', 'Holding Net Nakit Pozisyonu', 'Yabancı Yatırımcı Girişi'],
      rise: 'İştiraklerinin toplam değerine göre iskontosu açıldığında ve yabancı girişi başladığında.',
      fall: 'Ülke risk primi yükselip ana sanayi kolları aynı anda yavaşladığında.'
    },
    'Makine & Sanayi Üretimi': {
      how: 'Traktör, iş makinesi ve sanayi ekipmanları üreterek tarım ve fabrikaların üretim gücünü kurar.',
      inputs: ['Çelik & Motor Parçaları', 'Tarım ve Yatırım Kredisi Faizi', 'İhracat Siparişleri'],
      rise: 'Sübvanse tarım/yatırım kredileri açıldığında ve ihracat siparişleri büyüdüğünde.',
      fall: 'Yüksek faiz ortamında çiftçi ve sanayici makine yenilemeyi ertelediğinde.'
    },
    'İnşaat & Taahhüt': {
      how: 'Yurt içinde ve yurt dışında baraj, otoyol, havalimanı ve enerji santrali müteahhitliği yaparak döviz hak ediş toplar.',
      inputs: ['Demir & Çimento Maliyeti', 'Yurt Dışı Altyapı İhaleleri', 'Döviz Kuru'],
      rise: 'Petrol üreticisi ülkelerde ve Avrupa’da büyük dövizli taahhüt projeleri alındığında.',
      fall: 'Hak ediş ödemeleri geciktiğinde veya şantiye maliyetleri öngörüyü aştığında.'
    },
    'Tekstil & Hazır Giyim': {
      how: 'Pamuk ve ipliği işleyip iç pazara ve Avrupa mağaza zincirlerine hazır giyim/ev tekstili satar.',
      inputs: ['Pamuk & Polyester İplik', 'İşçilik Maliyeti', 'Euro / TL Kuru'],
      rise: 'Kur rekabetçi olduğunda ve markalı perakende mağazaları peşin nakit ürettiğinde.',
      fall: 'TL değerli kalıp işçilik maliyeti dolar bazında rakipleri geçtiğinde.'
    },
    'Turizm, Medya & Hizmet': {
      how: 'Otel konaklaması, araç kiralama ve hizmet gelirleriyle özellikle yaz döviz akışından beslenir.',
      inputs: ['Yabancı Turist Sayısı', 'Euro & Dolar Kuru', 'Konaklama Doluluk Oranı'],
      rise: 'İlkbahar sonundan itibaren yaz rezervasyonları ve döviz gelirleri zirve yaptığında.',
      fall: 'Kış ölü sezonunda veya bölgesel jeopolitik gerginliklerde.'
    },
    'Girişim & Yatırım Ortaklığı': {
      how: 'Büyüme aşamasındaki teknoloji, enerji ve gıda girişimlerine erken aşamada ortak olup değerlenince çıkış yapar.',
      inputs: ['Girişim Değerlemeleri', 'Halka Arz Piyasası İştahı', 'Sermaye Maliyeti'],
      rise: 'İştirak ettiği şirketler halka arz edildiğinde veya stratejik satış yaptığında.',
      fall: 'Sermaye piyasalarında risk iştahı kapandığında.'
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
  function hashNewsId(prefix, titleStr, sourceStr) {
    const raw = `${String(titleStr || '').trim().toLocaleUpperCase('tr-TR')}|${String(sourceStr || '').trim()}`;
    let h = 2166136261 >>> 0;
    for (let i = 0; i < raw.length; i++) {
      h ^= raw.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return `${prefix}_${h.toString(36)}`;
  }

  function getEnrichedLiveNewsFeed() {
    const K = global.AetherKernelV10;
    if (!K) return [];
    const md = K.getMarketData() || {};
    const rawFeed = md.liveRealWorldFeed || [];
    const horizonItems = md?.kitchenIntelSummary?.openHorizon?.items || [];

    const combined = [];
    const seenIds = new Set();

    for (const n of rawFeed.slice(0, 8)) {
      const t = String(n.title || '').trim();
      if (!t) continue;
      const nid = hashNewsId('nw', t, n.source);
      if (seenIds.has(nid)) continue;
      seenIds.add(nid);
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

      const isResmiGazete = /RESMİ GAZETE|TEBLİĞ|STOPAJ|CUMHURBAŞKANI KARARI/.test(tUp);
      combined.push({
        id: nid,
        badge: isResmiGazete ? 'Resmi Gazete' : (n.cat === 'kap_bist' ? 'KAP & Borsa' : (n.cat === 'hammadde_dunya' ? 'Hammadde & Dünya' : 'Resmi & Makro')),
        tone: isResmiGazete ? 'danger' : (n.cat === 'kap_bist' ? 'info' : 'warn'),
        isUrgentDisclosure: Boolean(isResmiGazete || n.cat === 'kap_bist'),
        title: t,
        source: n.source || 'Piyasa Akışı',
        streetImpact,
        linkedKeys
      });
    }

    for (const h of horizonItems.slice(0, 6)) {
      const ht = String(h.title || '').trim();
      if (!ht) continue;
      const hid = hashNewsId('hz', ht, h.pubDate);
      if (seenIds.has(hid)) continue;
      seenIds.add(hid);
      const tickers = (h.detectedTickers || []).filter((tk) => K.getAsset(tk));
      combined.push({
        id: hid,
        badge: String(h.badge || 'Mutfak İstihbaratı').replace(/^[^\wÇĞİÖŞÜçğıöşü]+/u, '').trim(),
        tone: h.direction === 'BEARISH_TRAP' ? 'danger' : (h.direction === 'BULLISH_CATALYST' ? 'good' : 'info'),
        isUrgentDisclosure: true,
        title: ht,
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
    const gp = K.getGlobalLivePulse ? K.getGlobalLivePulse() : null;
    const mc = md?.kitchenIntelSummary?.openHorizon?.macroChains || {};
    const brent = gp?.brentUsd || mc?.inputOutputChains?.brentOilUsd || 88.4;
    const copper = gp?.copperUsd || mc?.inputOutputChains?.copperUsd || 5.74;
    const wheat = gp?.wheatUsd || mc?.inputOutputChains?.wheatUsd || 562.0;
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
        shortTitle: 'Mazot & Uçak',
        triggerHeadline: `Brent Petrol ${brent} $ · Rafineriden Market Kasasına Maliyet Zinciri`,
        step1: `Ham Petrol Varili (${brent} $)`,
        step2: 'Rafineri Mazot & Jet Yakıtı (TÜPRAŞ)',
        step3: 'Uçak Gideri & Hal Kamyonu (THYAO, Pegasus, BİM)',
        insight: 'Pazarda domatesin niye pahalandığını anlamanın sırrı mazottadır: Petrol düştüğünde uçak kaldıran THYAO ve binlerce kamyonla mal taşıyan perakendeci nefes alır; petrol fırladığında ise rafineri (TUPRS) stok gücü kazanır.',
        assetKeys: ['emtia-petrol-bno', 'bist-tuprs', 'bist-thyao', 'bist-pgsus', 'reel-perakende-bimas']
      },
      {
        id: 'chain-drought',
        title: 'Kuraklık -> Baraj, Buğday & Raf',
        shortTitle: 'Kuraklık & Gıda',
        triggerHeadline: `Baraj Doluluk %${damPct} · Dünya Buğday ${wheat} ¢ · İklimden Bilançoya Öncü Bakış`,
        step1: `Yağış Azlığı & Buğday (${wheat} ¢ / DBA)`,
        step2: 'Hidroelektrik & Gıda Hammadde Maliyeti',
        step3: 'Peşin Kasalı Marketler & İçecek/Gıda (BİM, Migros, TAB Gıda)',
        insight: 'Kuraklık başladığında barajdan ucuz elektrik üreten HES’ler zorlanır ve tarladaki ürün azalır; aylar sonra hammaddeyi ucuza stoklamış ve raf fiyatını anında güncelleyen peşin kasalı marketler ayakta kalır.',
        assetKeys: ['emtia-tarim-dba', 'reel-perakende-bimas', 'reel-perakende-mgros', 'halka-arz-tabgd', 'bist-ccola']
      },
      {
        id: 'chain-gold',
        title: 'Altın Terazisi & Hava Parası',
        shortTitle: 'Altın Terazisi',
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
        shortTitle: 'Bakır & Trafo',
        triggerHeadline: `Bakır ${copper} $ · Şebeke, Trafo ve Yenilenebilir Döngüsü`,
        step1: `Bakır (${copper} $), Gümüş & Doğalgaz Girişi`,
        step2: 'Trafo ve Güneş Paneli Üreticileri (Astor, CW Enerji)',
        step3: 'Elektrik Dağıtım & Sanayi Üretimi (Enerjisa)',
        insight: 'Kış gelmeden odun-kömür stoklayan köylü gibi, faiz ve mevsim döngüleri dönmeden önce şebeke yenileme ve enerji altyapı darboğazlarını okuyan yatırımcı sürüden önce pozisyon alır.',
        assetKeys: ['reel-enerji-astor', 'reel-enerji-cwene', 'gram-gumus-spot', 'bist-enjsa', 'reel-enerji-smrtg']
      },
      {
        id: 'chain-export',
        title: 'Çelik, Euro & Avrupa İhracatı',
        shortTitle: 'Euro & İhracat',
        triggerHeadline: `Euro/TL ${(eur?.priceTL || 55.4).toFixed(2)} ₺ · EUR/USD ${(gp?.eurUsd || 1.09).toFixed(3)} · Döviz Kasası`,
        step1: 'Yassı Çelik Sac & Alüminyum (Ereğli)',
        step2: 'Avrupa İhracat Devleri (Ford Otosan, Tofaş)',
        step3: 'Niş Yan Sanayi & Savunma (ASELSAN, Ege Endüstri)',
        insight: 'İçeride TL sıkışsa bile ürününü Avrupa ve dünyaya dövizle satan fabrikalar bilançolarını doğal döviz kalkanıyla korur.',
        assetKeys: ['doviz-eur', 'bist-eregl', 'bist-froto', 'bist-toaso', 'bist-asels']
      },
      {
        id: 'chain-rates',
        title: 'Faiz Kalkanı vs Borçlu Şirketler',
        shortTitle: 'Faiz & Kalkan',
        triggerHeadline: `Mevduat Brüt %${dep?.annualGrossRatePct || 39} · Enflasyon %${inf.toFixed(1)}`,
        step1: 'Merkez Bankası Politika Faizi',
        step2: '%0 Stopaj Sukuk & Günlük PPF Kalkanı',
        step3: 'Faiz İndirimi Bekleyen GYO & Borçlu Sanayi (EKGYO, SASA)',
        insight: 'Faizler yüksekken borçlu şirketlerin kârı banka faizine gider; bu mevsimde nakit üretenler ve %0 vergili Sukuk korur. Faizler inmeye başlayacağı zaman ise ilk GYO ve sanayi uyanır.',
        assetKeys: ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust', 'gayrimenkul-konut-ekgyo', 'bist-sasa']
      }
    ];
  }

  function getMarketSeasonCompass() {
    const K = global.AetherKernelV10;
    if (!K) return null;
    const inf = K.getAnnualInflationPct();
    const sukukNet = K.getAsset('kira-sertifikasi-sukuk')?.annualGrossRatePct || 36.5;
    const depNet = +((K.getAsset('mevduat-ust')?.annualGrossRatePct || 39) * 0.825).toFixed(1);
    const realSpread = +(sukukNet - inf).toFixed(1);

    let activePhase = 'TIGHT_WINTER';
    let currentTitle = 'Yüksek Faiz Kışı & Seçici Toplama Mevsimi';
    let villagerWisdom = 'Hiçbir kış sonsuza kadar sürmez, hiçbir yaz da sonsuza kadar yükselmez. Kredi faizleri yüksekken borçsuz nakit kaleleri ve %0 vergili Sukuk ocağı sıcak tutar; ama ileri görüşlü köylü, faiz baharı gelmeden önce yangın yerindeki sağlam fabrikaların tohumunu sessizce toplar.';
    let thrivesNowKeys = ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'reel-perakende-bimas', 'bist-tuprs'];
    let nextSeedKeys = ['gayrimenkul-konut-ekgyo', 'bist-froto', 'bist-eregl', 'reel-enerji-astor'];

    if (realSpread < -2) {
      activePhase = 'INFLATION_AUTUMN';
      currentTitle = 'Negatif Reel Faiz & Malda Korunma Mevsimi';
      villagerWisdom = 'Enflasyon net faizin üzerinde koştuğunda TL nakitte bekleyen sessizce erir; fiziki altın, döviz kasalı ihracatçılar ve fiyatlama gücü olan gerçek varlıklar kalkan olur.';
      thrivesNowKeys = ['gram-altin-spot', 'bist-froto', 'bist-thyao', 'reel-perakende-bimas'];
      nextSeedKeys = ['kira-sertifikasi-sukuk', 'bist-asels', 'abd-sp500-spy'];
    } else if (inf < 24 && realSpread >= 2) {
      activePhase = 'DISINFLATION_SPRING';
      currentTitle = 'Dezenflasyon & Faiz İndirimi Baharı';
      villagerWisdom = 'Enflasyon ateşi düşerken faiz indirim döngüsü kapıyı çalar; yüksek faiz kışında ezilmiş konut, sanayi ve otomotiv şirketleri bahar suyuyla ilk filizlenenler olur.';
      thrivesNowKeys = ['gayrimenkul-konut-ekgyo', 'bist-froto', 'bist-eregl', 'bist-tuprs'];
      nextSeedKeys = ['bist-asels', 'abd-sp500-spy', 'gram-altin-spot'];
    }

    return {
      activePhase,
      currentTitle,
      realSpreadPct: realSpread,
      inflationPct: inf,
      sukukNetPct: sukukNet,
      depositNetPct: depNet,
      villagerWisdom,
      thrivesNowKeys,
      nextSeedKeys,
      wheel: [
        { code: 'TIGHT_WINTER', name: 'Sıkı Faiz Kışı', sub: 'Nakit Basan & Sukuk Korur' },
        { code: 'DISINFLATION_SPRING', name: 'Faiz İndirim Baharı', sub: 'GYO, Otomotiv & Sanayi Uyanır' },
        { code: 'GROWTH_SUMMER', name: 'Üretim & İhracat Yazı', sub: 'Çelik, Havacılık & Büyüme Koşar' },
        { code: 'INFLATION_AUTUMN', name: 'Isınma & Emtia Sonbaharı', sub: 'Altın, Enerji & Perakende Zırh Olur' }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // 4. 7 GERÇEKÇİ KRİZ & FIRTINA TATBİKATI ("ORTALIK KARIŞTIĞINDA KİM SOĞUKKANLI?")
  // --------------------------------------------------------------------------
  function isPreciousMetalAsset(a) {
    if (!a) return false;
    const id = String(a.id || '');
    return a.subVenue === 'PHYSICAL_METAL' || a.subVenue === 'DARPHANE_S1' || id.includes('altin') || id.includes('gumus');
  }

  function isFxLinkedShieldAsset(a) {
    if (!a) return false;
    const id = String(a.id || '');
    return id.startsWith('doviz-') || id === 'eurobond-usdtr' || id === 'eurobond-emb' || a.isForeignUsd || isPreciousMetalAsset(a);
  }

  const CRISIS_SCENARIOS = [
    {
      id: 'NONE',
      shortTitle: 'Normal Piyasa',
      title: 'Tatbikat Seç (Normal Piyasa)',
      cashInflationShockPct: 0,
      desc: 'Her şey güllük gülistanlık giderken aniden ortalık karıştığında mevcut portföyüne ne olacağını test et.'
    },
    {
      id: 'STRAIT_BLOCKADE',
      shortTitle: 'Boğaz & Petrol +%35',
      title: 'Boğazlarda Gemi Sıkışması & Petrol Şoku (+%35)',
      cashInflationShockPct: 4.5,
      desc: 'Deniz ticareti kilitlendi, Brent petrol bir gecede +%35 fırladı, küresel navlun ve altın sert yükseldi; havacılık ve ithalata dayalı sektörler satış yedi.',
      computeAssetShockPct(a) {
        if (a.id === 'emtia-petrol-bno') return 35;
        if (a.ticker === 'TUPRS') return 14;
        if (isPreciousMetalAsset(a)) return 11;
        if (String(a.id).startsWith('doviz-') || a.id === 'eurobond-usdtr') return 6;
        if (['THYAO', 'PGSUS', 'TAVHL'].includes(a.ticker)) return -16;
        if (a.isRateInstrument) return 0;
        if (a.venue === 'CRYPTO_24_7') return -14;
        if (a.venue === 'BIST') return -7;
        return -4;
      }
    },
    {
      id: 'GRID_BLACKOUT',
      shortTitle: 'Elektrik Kesintisi',
      title: 'Bölgesel Elektrik & Sanayi Kesintisi Krizi',
      cashInflationShockPct: 2.0,
      desc: 'Organize sanayi bölgelerinde enerji kısıntısı başladı; yüksek enerji tüketen fabrikalar yavaşlarken şebeke/trafo üreticileri ve nakit kalkanları ayrıştı.',
      computeAssetShockPct(a) {
        if (['ASTOR', 'CWENE', 'SMRTG', 'ENJSA'].includes(a.ticker)) return 9;
        if (a.isRateInstrument) return 0;
        if (isPreciousMetalAsset(a) || String(a.id).startsWith('doviz-') || a.id === 'eurobond-usdtr') return 5;
        if (['EREGL', 'KRDMD', 'SASA', 'SISE'].includes(a.ticker)) return -13;
        if (a.venue === 'BIST') return -8;
        return -2;
      }
    },
    {
      id: 'SEVERE_DROUGHT',
      shortTitle: 'Kuraklık & Gıda',
      title: 'Şiddetli Kuraklık & Gıda Enflasyonu Dalgası',
      cashInflationShockPct: 8.5,
      desc: 'Barajlar kritik sınırın altına indi, tarımsal rekolte düştü; gıda fiyatları sıçrarken su/enerji yoğun tesisler zorlandı ve boş nakdin mutfak alım gücü eridi.',
      computeAssetShockPct(a) {
        if (a.id === 'emtia-tarim-dba') return 22;
        if (['BIMAS', 'MGROS', 'TABGD'].includes(a.ticker)) return 8;
        if (a.isRateInstrument) return 0;
        if (a.categoryName.includes('Enerji') && !['ASTOR'].includes(a.ticker)) return -11;
        if (isPreciousMetalAsset(a)) return 4;
        if (a.venue === 'BIST') return -5;
        return 2;
      }
    },
    {
      id: 'SHOCK_RATE_HIKE',
      shortTitle: '14:00 Şok Faiz +750bp',
      title: 'Perşembe 14:00 Şok TCMB Faiz Artışı (+750 bp)',
      cashInflationShockPct: 0,
      desc: 'Merkez Bankası beklentilerin çok üzerinde sert faiz artırdı; kredili konut (GYO) ve yüksek borçlu şirketler tabana yaklaştı.',
      computeAssetShockPct(a) {
        if (a.isRateInstrument) return 1.5;
        if (a.categoryName.includes('Gayrimenkul') || ['EKGYO', 'RYGYO', 'ISGYO', 'SASA'].includes(a.ticker)) return -15;
        if (a.bistRow && (a.bistRow.totalDebtMillionTL || 0) > (a.bistRow.cashMillionTL || 0) * 3) return -13;
        if (String(a.id).startsWith('doviz-') || a.id === 'eurobond-usdtr' || isPreciousMetalAsset(a)) return -4.5;
        if (a.venue === 'BIST') return -6.5;
        return -2;
      }
    },
    {
      id: 'FX_SPIKE',
      shortTitle: 'Kur Şoku +%22',
      title: 'Ani Döviz Kuru Sıçraması (+%22 Kur Şoku)',
      cashInflationShockPct: 16.0,
      desc: 'İç ve dış gerilimle döviz kurları +%22 sıçradı; döviz geliri olan ihracatçılar ve altın korurken boş TL nakdin alım gücü sert eridi.',
      computeAssetShockPct(a) {
        if (isFxLinkedShieldAsset(a) || a.venue === 'CRYPTO_24_7') return 21;
        if (['THYAO', 'FROTO', 'TOASO', 'TUPRS', 'ASELS', 'SISE', 'EREGL'].includes(a.ticker)) return 12;
        if (a.isRateInstrument) return 0;
        if (a.venue === 'BIST') return 3;
        return 0;
      }
    },
    {
      id: 'GLOBAL_CRASH',
      shortTitle: 'Küresel Çöküş',
      title: 'Küresel Likidite Çöküşü & Kaldıraç Tasfiyesi',
      cashInflationShockPct: 0,
      desc: 'Dünya borsalarında sert satış dalgası: Kripto -%32, ABD teknoloji -%16, gelişen ülke borsaları -%11 çekildi; sabit getiri ve fiziki altın korudu.',
      computeAssetShockPct(a) {
        if (a.venue === 'CRYPTO_24_7') return -32;
        if (isPreciousMetalAsset(a) && a.subVenue !== 'DARPHANE_S1') return 6;
        if (a.subVenue === 'DARPHANE_S1') return 3;
        if (a.isForeignUsd) return -16;
        if (String(a.id).startsWith('doviz-') || a.id === 'eurobond-usdtr') return 2.5;
        if (a.isRateInstrument) return 0;
        if (a.venue === 'BIST') return -11;
        return -5;
      }
    },
    {
      id: 'ALTIN_S1_BUBBLE_POP',
      shortTitle: 'Hava Parası Çöküşü',
      title: 'Hava Parası Balonlarının Sönmesi & Spekülatif Tahta Çözülmesi',
      cashInflationShockPct: 0,
      desc: 'Fiziki altın yatay kalırken borsadaki şişik ALTIN.S1 primi sıfırlandı ve sosyal medya/dedikodu tahtaları üst üste taban kilitledi; kaliteli kasalar sağlam kaldı.',
      computeAssetShockPct(a) {
        if (a.subVenue === 'DARPHANE_S1') return -Math.max(9, Math.round(global.AetherKernelV10?.getDarphanePremiumInfo()?.premiumPct || 12));
        if (a.isPumpAnomaly || a.isTms29Illusion || a.distributionTrap) return -24;
        if (isPreciousMetalAsset(a) || a.isRateInstrument) return 0.5;
        if (a.bistRow && (a.bistRow.ocfMillionTL || 0) > 250) return 1.5;
        if (a.venue === 'BIST') return -4;
        return 0;
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
    let postBistCollateralTL = 0;
    const itemImpacts = [];

    for (const it of snap.spotItems) {
      const a = K.getAsset(it.assetKey);
      if (!a) continue;
      const pct = sc.computeAssetShockPct(a);
      const dTL = Math.round(it.netValTL * (pct / 100));
      totalDeltaTL += dTL;
      if (a.venue === 'BIST') {
        postBistCollateralTL += Math.max(0, it.grossValTL * (1 + pct / 100));
      }
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
    const infShockPct = Number(sc.cashInflationShockPct) || 0;
    const realPostWorthTL = infShockPct > 0
      ? Math.round(postNetWorthTL / (1 + infShockPct / 100))
      : postNetWorthTL;
    const realPurchasingDeltaTL = Math.round(realPostWorthTL - snap.totalNetWorthTL);
    const realPurchasingDeltaPct = +((realPurchasingDeltaTL / Math.max(1, snap.totalNetWorthTL)) * 100).toFixed(2);
    const postCollateralBase = Math.max(1, postBistCollateralTL + snap.cashTL + snap.unsettledTL);
    const postCollateralEqRatio = (postCollateralBase - snap.marginDebtTL) / postCollateralBase;
    const marginWiped = snap.marginDebtTL > 0 && (
      postCollateralEqRatio < 0.35 ||
      (postNetWorthTL / Math.max(1, postNetWorthTL + snap.marginDebtTL)) < 0.35
    );

    return {
      scenario: sc,
      totalDeltaTL,
      totalDeltaPct: +((totalDeltaTL / Math.max(1, snap.totalNetWorthTL)) * 100).toFixed(2),
      postNetWorthTL,
      infShockPct,
      realPostWorthTL,
      realPurchasingDeltaTL,
      realPurchasingDeltaPct,
      marginWiped,
      itemImpacts: itemImpacts.sort((a, b) => a.deltaTL - b.deltaTL)
    };
  }

  // --------------------------------------------------------------------------
  // 5. MAHALLE FIRINI / BANKA KASASI SOMUTLAŞTIRMASI (100.000 ₺ ORTAKLIK) & DÖNGÜ
  // --------------------------------------------------------------------------
  function isFinancialEntityRow(r) {
    return Boolean(r && (r.entityKind === 'bank' || r.entityKind === 'insurance' || r.entityKind === 'fin_other'));
  }

  function computeBakery100kScale(asset) {
    const r = asset?.bistRow;
    if (!r || !r.marketCapBillionTL || r.marketCapBillionTL <= 0) return null;
    if (isFinancialEntityRow(r)) return null;

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
      plainSummary = `Dikkat: 100.000 ₺ ortaklığa karşılık şirketin esas faaliyet kasasından yılda ${Math.abs(annualOcfTL).toLocaleString('tr-TR')} ₺ nakit eksiliyor (Sırtına binen borç payı: ${debtShareTL.toLocaleString('tr-TR')} ₺).`;
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

  function computeFinancial100kScale(asset) {
    const r = asset?.bistRow;
    if (!r || !isFinancialEntityRow(r) || !r.marketCapBillionTL || r.marketCapBillionTL <= 0) return null;
    const mcapMillion = r.marketCapBillionTL * 1000;
    const ratio = 0.1 / mcapMillion;
    const annualNetProfitTL = Math.round((Number(r.netIncomeMillionTL) || 0) * 1e6 * ratio);
    const dailyNetProfitTL = +(annualNetProfitTL / 365).toFixed(1);
    const annualNetDivTL = Math.round(100000 * ((Number(r.dividendYield) || 0) / 100) * 0.85);
    const roePct = r.roe != null ? +Number(r.roe).toFixed(1) : null;
    const plainSummary = annualNetProfitTL > 0
      ? `100.000 ₺ ortak olduğunda kurum senin payına yılda +${annualNetProfitTL.toLocaleString('tr-TR')} ₺ (günde +${dailyNetProfitTL.toLocaleString('tr-TR')} ₺) net dönem kârı üretiyor${roePct != null ? ` (Özsermaye Kârlılığı: %${roePct})` : ''}.`
      : `Dikkat: 100.000 ₺ ortaklığa karşılık kurum son 12 ayda ${Math.abs(annualNetProfitTL).toLocaleString('tr-TR')} ₺ net zarar yazdı.`;

    return {
      annualNetProfitTL,
      dailyNetProfitTL,
      annualNetDivTL,
      roePct,
      pe: r.pe,
      pb: r.pb,
      plainSummary
    };
  }

  function computeMultiHorizonRealTable(asset) {
    const K = global.AetherKernelV10;
    if (!asset || !K) return null;
    const md = K.getMarketData() || {};
    const infBench = md.inflationBenchmarks || {
      perf1W: 0.6, perf1M: 2.58, perf3M: 6.73, perf6M: 13.92, perf1Y: 29.77, perf3Y: 145.24, perf5Y: 563.78
    };

    const rawHorizons = [
      { key: '1H', label: '1 Hafta', nom: asset.perf1W, inf: infBench.perf1W },
      { key: '1A', label: '1 Ay', nom: asset.perf1M, inf: infBench.perf1M },
      { key: '3A', label: '3 Ay', nom: asset.perf3M, inf: infBench.perf3M },
      { key: '6A', label: '6 Ay', nom: asset.perf6M, inf: infBench.perf6M },
      { key: '1Y', label: '1 Yıl', nom: asset.perf1Y, inf: infBench.perf1Y },
      { key: '3Y', label: '3 Yıl', nom: asset.perf3Y, inf: infBench.perf3Y },
      { key: '5Y', label: '5 Yıl', nom: asset.perf5Y, inf: infBench.perf5Y }
    ];

    const horizons = [];
    for (const h of rawHorizons) {
      if (h.nom == null || Number.isNaN(Number(h.nom))) continue;
      if ((h.key === '3Y' || h.key === '5Y') && asset.perf3Y == null && asset.perf5Y == null) continue;
      const nomPct = +Number(h.nom).toFixed(1);
      const infPct = +Number(h.inf || 0).toFixed(1);
      const realPct = +((((1 + nomPct / 100) / Math.max(0.05, 1 + infPct / 100)) - 1) * 100).toFixed(1);
      horizons.push({
        key: h.key,
        label: h.label,
        nominalPct: nomPct,
        inflationPct: infPct,
        realPct
      });
    }

    let sparklinePts = asset.trainedDaily?.radar?.sparklinePts || null;
    if ((!Array.isArray(sparklinePts) || sparklinePts.length < 6) && !asset.isRateInstrument) {
      const cur = 100;
      const p1w = cur / Math.max(0.15, 1 + (Number(asset.perf1W) || 0) / 100);
      const p1m = cur / Math.max(0.15, 1 + (Number(asset.perf1M) || 0) / 100);
      const p3m = cur / Math.max(0.15, 1 + (Number(asset.perf3M) || 0) / 100);
      const p6m = cur / Math.max(0.15, 1 + (Number(asset.perf6M || asset.perf3M) || 0) / 100);
      const p1y = cur / Math.max(0.15, 1 + (Number(asset.perf1Y) || 0) / 100);
      const anchors = [p1y, (p1y + p6m) / 2, p6m, (p6m + p3m) / 2, p3m, (p3m + p1m) / 2, p1m, (p1m + p1w) / 2, p1w, cur];
      const mn = Math.min(...anchors);
      const mx = Math.max(...anchors);
      const span = Math.max(0.5, mx - mn);
      sparklinePts = anchors.map((v) => +(((v - mn) / span) * 84 + 8).toFixed(1));
    }

    return { horizons, sparklinePts };
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

    const fin = computeFinancial100kScale(asset);
    if (fin) {
      if (fin.annualNetProfitTL > 0 && (asset.bistRow?.dividendYield || 0) >= 3.0) {
        return {
          badge: '💧 Finans & Temettü Kasası',
          tone: 'good',
          oneLiner: `100.000 ₺ ortaklığa yılda +${fin.annualNetProfitTL.toLocaleString('tr-TR')} ₺ net kâr · Temettü %${asset.bistRow.dividendYield.toFixed(1)}.`
        };
      }
      if (fin.annualNetProfitTL > 0) {
        return {
          badge: '🏦 Karlı Finans Kurumu',
          tone: 'info',
          oneLiner: `100.000 ₺ ortaklığa yılda +${fin.annualNetProfitTL.toLocaleString('tr-TR')} ₺ net kâr (PD/DD: ${fin.pb ?? '-'}).`
        };
      }
      return {
        badge: '⚠️ Kârlılık Baskısı',
        tone: 'warn',
        oneLiner: fin.plainSummary
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
      if (asset.isShareBuyback && bk.annualOcfTL > 0) {
        return {
          badge: '🛡️ Geri Alım & Sağlam Kasa',
          tone: 'good',
          oneLiner: `Şirket kendi paylarını topluyor · 100.000 ₺'ye yılda +${bk.annualOcfTL.toLocaleString('tr-TR')} ₺ sıcak nakit üretir.`
        };
      }
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
          oneLiner: `100.000 ₺ ortaklığa karşılık kasadan yılda ${Math.abs(bk.annualOcfTL).toLocaleString('tr-TR')} ₺ nakit eksiliyor.`
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
    const secDef = SECTOR_DEFAULTS[r?.sector || asset.categoryName] || null;
    const bakery100k = computeBakery100kScale(asset);
    const financial100k = computeFinancial100kScale(asset);
    const multiHorizon = computeMultiHorizonRealTable(asset);
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
        shortDesc = `${r.sector || 'Borsa İstanbul'} sektöründe faaliyet gösteren gerçek kurum (${asset.ticker}).`;
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
      executionRule = `Hafta içi 10:00–18:00 arası anında eşleşir (kapalı saatte girilen emir sabah 10:00 açılış ziline yazılır; 09:50–10:00 eşleşmesinde iptal kilitlenir). Satışta para gerçek T+2 takas kuralıyla 2 iş günü sonra çekilebilir nakde döner.${asset.stopajPct > 0 ? ` Kârdan %${asset.stopajPct} stopaj kesilir.` : ' Hisse alım-satım kazancında %0 stopaj uygulanır.'}`;
    } else if (asset.venue === 'TEFAS') {
      executionRule = `İş günleri 13:30 valör sınırından önce verilen emir gününde işlenir; 13:30 sonrası alım ve bozum emirleri +1/+2 iş günü valör bekler. Stopaj: %${asset.stopajPct}.`;
    } else if (asset.venue === 'TWO_DOOR') {
      executionRule = `Üç gerçek gişe arasında seçim yaparsın: Kapalıçarşı (Pzt–Cmt 09:30–18:30, %0,40 dar makas, %0 vergi), Nöbetçi Döviz/Kuyumcu (Her gün 10:00–22:00, %1,45 hafta sonu/akşam makası, %0 vergi) ve Mobil Banka (7/24 açık; 17:30 sonrası ve hafta sonu makas %3,60 açılır + alımda %0,2 kambiyo vergisi kesilir).`;
    } else if (asset.subVenue === 'TERM_DEPOSIT') {
      executionRule = `Vade sonuna kadar (32/181/366 gün) kilitlenir. 6 aya kadar %17,5, 1 yıla kadar %15, 1 yıl üstü %10 stopaj kesilir. Vadeden önce bozarsan biriken faizin tamamı yanar!`;
    } else if (asset.isGvk80) {
      executionRule = `ABD/Avrupa borsaları hafta sonu kapalıdır. Satış anında alıştan bu yana Yİ-ÜFE üretici enflasyonu %10'u geçtiyse TL maliyetin enflasyonla yükseltilir; kalan reel kazanç üzerinden GVK Mükerrer 80 beyan vergisi karşılığı ayrılır.`;
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
    if (asset.isShareBuyback) {
      smartMoneyNote = (smartMoneyNote ? smartMoneyNote + ' ' : '') + 'MKK kayıtlarında dolaşımdaki pay adedi azaldı (geri alım / pay çekilmesi desteği).';
    }

    let health = null;
    if (r && isFinancialEntityRow(r)) {
      const netInc = Number(r.netIncomeMillionTL) || 0;
      const roe = r.roe != null ? +Number(r.roe).toFixed(1) : null;
      const inf = K.getAnnualInflationPct();
      let status = 'NEUTRAL';
      let verdict = 'Dengeli finansal kurum bilançosu.';
      if (netInc > 0 && (roe == null || roe >= inf * 0.8)) {
        status = 'GOOD';
        verdict = `Güçlü Özsermaye Çarkı: Kurum son 12 ayda +${netInc.toLocaleString('tr-TR')} Milyon ₺ net kâr üretti${roe != null ? ` ve özsermayesini yılda %${roe} büyütüyor` : ''}.`;
      } else if (netInc > 0) {
        status = 'NEUTRAL';
        verdict = `Kurum +${netInc.toLocaleString('tr-TR')} Milyon ₺ net kârda; ancak özsermaye kârlılığının (%${roe ?? '-'}) enflasyonu (%${inf.toFixed(1)}) geçmesi takip edilmeli.`;
      } else {
        status = 'WARN';
        verdict = 'Son 12 aylık dönem bilançosunda net kârlılık zayıf/eksi bölgede.';
      }
      health = {
        kind: 'FINANCIAL',
        status,
        verdict,
        netIncomeMillionTL: netInc,
        roePct: roe,
        pe: r.pe,
        pb: r.pb,
        dividendYield: r.dividendYield || 0,
        smartMoneyNote,
        financial100k
      };
    } else if (r && (r.ocfMillionTL != null || r.netIncomeMillionTL != null)) {
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
      financial100k,
      multiHorizon,
      smartMoneyNote,
      health
    };
  }

  global.RealInvestmentGuide = {
    explainAsset,
    getDailyStreetBriefing,
    getEnrichedLiveNewsFeed,
    getLiveWorldChains,
    getMarketSeasonCompass,
    getCardQuickSignal,
    computeRange52W,
    computeBakery100kScale,
    computeFinancial100kScale,
    computeMultiHorizonRealTable,
    CRISIS_SCENARIOS,
    simulatePortfolioCrisis
  };
})(typeof window !== 'undefined' ? window : globalThis);
