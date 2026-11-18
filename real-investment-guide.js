// ============================================================================
// GERÇEK YATIRIM REHBERİ & 360° HAMMADDE-DÜNYA BAĞLANTI MOTORU (real-investment-guide.js)
// Sıfır Masalsı Metafor · Sıfır Karmaşık Jargon · Tüm 672+ Gerçek Yatırım İçin Net Türkçe Analiz
// ============================================================================
(function (global) {
  'use strict';

  // Önemli varlık ve şirketler için somut iş modeli, hammadde ve dünya bağlantısı sözlüğü
  const ASSET_PROFILES = {
    'gram-altin-spot': {
      shortDesc: '24 ayar saf altın (TL/gram). Enflasyona ve küresel belirsizliğe karşı fiziki değer koruma aracı.',
      howItWorks: 'Faiz veya temettü üretmez; dünyada dolar bolluğu arttığında, merkez bankaları faiz indirdiğinde veya Türkiye’de döviz kuru yükseldiğinde TL karşılığı değer kazanır.',
      rawInputs: ['Ons Altın (Küresel Dolar Fiyatı)', 'Dolar / TL Kuru', 'ABD Merkez Bankası (Fed) Faiz Kararları'],
      risesWhen: 'Küresel savaş/kriz riski arttığında, ABD faiz indirdiğinde veya içeride Dolar/TL yükseldiğinde.',
      fallsWhen: 'ABD reel tahvil faizleri sert yükseldiğinde ve içeride TL mevduat faizi kur artışının çok üzerinde kaldığında.',
      relatedKeys: ['altin-sertifikasi', 'altin-fonu-zgold', 'ceyrek-altin', 'doviz-usd', 'gram-gumus-spot']
    },
    'ceyrek-altin': {
      shortDesc: 'Darphane basımı fiziki çeyrek altın (1,75 gr 22 ayar). Geleneksel fiziki birikim aracı.',
      howItWorks: 'Gram altın ile birebir aynı yönde hareket eder; ancak üzerinde Darphane işçilik farkı ve kuyumcu alış-satış makası bulunur.',
      rawInputs: ['Ons Altın', 'Dolar / TL Kuru', 'Fiziki İşçilik Primi'],
      risesWhen: 'Gram altın yükseldiğinde ve iç piyasada fiziki altın talebi arttığında.',
      fallsWhen: 'Kısa vadeli al-sat yapıldığında işçilik ve kuyumcu makası nedeniyle getiri aşınır.',
      relatedKeys: ['gram-altin-spot', 'cumhuriyet-altini', 'altin-sertifikasi']
    },
    'altin-sertifikasi': {
      shortDesc: 'Borsa İstanbul’da işlem gören Darphane Altın Sertifikası (ALTIN.S1 · 100 adet = 1 gram altın).',
      howItWorks: 'Borsa saatlerinde hisse senedi gibi %0 stopajla alınıp satılır. Ancak talep yoğun olduğunda fiziki gram altının %10-%15 üzerine çıkabilir; bu fark "hava parası" riskidir.',
      rawInputs: ['Fiziki Gram Altın Fiyatı', 'Borsa İçi Bireysel Yatırımcı Talebi'],
      risesWhen: 'Altın yükseldiğinde veya sertifikaya talep arttığında.',
      fallsWhen: 'Fiziki altınla arasındaki prim makası normalleştiğinde altın düşmese bile sertifika geri çekilebilir.',
      relatedKeys: ['gram-altin-spot', 'altin-fonu-zgold', 'altin-fonu-gldtr']
    },
    'gram-gumus-spot': {
      shortDesc: 'Hem kıymetli maden hem de güneş paneli ve elektrikli araç sanayisinin kritik iletken hammaddesi.',
      howItWorks: 'Altınla birlikte güvenli liman olarak hareket ederken, aynı zamanda dünya sanayi üretimi ve güneş enerjisi yatırımlarından doğrudan beslenir; altına göre daha sert dalgalanır.',
      rawInputs: ['Ons Gümüş', 'Dolar / TL Kuru', 'Güneş Paneli & Elektronik Sanayi Talebi'],
      risesWhen: 'Altın yükselirken küresel sanayi ve yenilenebilir enerji yatırımları hızlandığında.',
      fallsWhen: 'Küresel durgunluk (resesyon) korkusuyla fabrikaların hammadde talebi yavaşladığında.',
      relatedKeys: ['gumus-fonu-gmstr', 'gram-altin-spot', 'reel-enerji-cwene', 'reel-enerji-astor']
    },
    'mevduat-ust': {
      shortDesc: 'Bankada belirli bir vade (32, 181 veya 366 gün) boyunca sabit faizle bağlanan TL mevduat.',
      howItWorks: 'Anaparan nominal olarak düşmez; vade sonunda brüt faizden stopaj vergisi (%17,5 / %15 / %10) kesilerek net faiz ödenir. Vadeden önce bozarsan biriken tüm faiz sıfırlanır.',
      rawInputs: ['TCMB Politika Faizi', 'Bankaların TL Likidite İhtiyacı', 'TÜİK Enflasyonu'],
      risesWhen: 'Merkez Bankası enflasyonu düşürmek için faizleri yüksek tuttuğunda ve kur sakin seyrettiğinde reel kazanç sağlar.',
      fallsWhen: 'Net faiz gerçek enflasyonun altında kaldığında veya ani kur sıçramasında alım gücü erir; erken bozumda faiz yanar.',
      relatedKeys: ['para-piyasasi-fonu', 'kira-sertifikasi-sukuk', 'dibs-tahvil']
    },
    'para-piyasasi-fonu': {
      shortDesc: 'TEFAS üzerinden günlük bileşik faiz üreten, vade bozulma cezası olmayan likit fon (PPF).',
      howItWorks: 'İçinde gecelik mevduat ve kısa vadeli tahvil tutar. İş günleri 13:30’a kadar alınıp satıldığında aynı gün nakde döner; kazançtan %17,5 stopaj kesilir.',
      rawInputs: ['Gecelik TLREF Faizi', 'Merkez Bankası Politika Faizi'],
      risesWhen: 'Faizler yüksekken paranı vadeye kilitlemeden günlük değerlendirmek istediğinde.',
      fallsWhen: 'Merkez Bankası faiz indirim döngüsüne girdiğinde günlük getirisi hızla düşer.',
      relatedKeys: ['mevduat-ust', 'kira-sertifikasi-sukuk']
    },
    'kira-sertifikasi-sukuk': {
      shortDesc: 'Hazine varlık kiralama karşılığı çıkarılan faizsiz kamu kira sertifikası fonu (%0 Stopaj avantajlı).',
      howItWorks: 'Devletin kamu varlıklarından kira geliri üretir. 2026 sonuna kadar %0 stopaj muafiyeti sayesinde aynı brüt orandaki %17,5 vergili mevduata göre daha yüksek net getiri bırakır (TEFAS valörü T+1).',
      rawInputs: ['Hazine Kira Sertifikası Getirisi', '%0 Stopaj Vergi Avantajı'],
      risesWhen: 'Yüksek getiri döneminde stopaj kesintisi ödemeden sabit nakit akışı arandığında.',
      fallsWhen: 'TEFAS 13:30 valör kuralı nedeniyle paranın hesaba geçmesi 1-2 iş günü sürer.',
      relatedKeys: ['dibs-tahvil', 'para-piyasasi-fonu', 'katilim-hesabi']
    },
    'doviz-usd': {
      shortDesc: 'Amerikan Doları (USD/TRY). Küresel ticaretin ve Türkiye’nin enerji/hammadde ithalatının ana para birimi.',
      howItWorks: 'Kur artışına karşı korur ancak kendi başına kâr veya faiz üretmez. ABD’nin kendi enflasyonu nedeniyle yıllarca boş nakit dolar tutmak küresel alım gücünü eritir.',
      rawInputs: ['Türkiye - ABD Enflasyon ve Faiz Farkı', 'Merkez Bankası Rezervleri', 'Dış Ticaret Dengesi'],
      risesWhen: 'İçeride faizler enflasyonun altına indiğinde veya dış finansman sıkıştığında.',
      fallsWhen: 'Yüksek TL faizi döneminde kur yatay kaldığında (carry trade) TL mevduata karşı reel olarak geride kalır.',
      relatedKeys: ['doviz-eur', 'eurobond-usdtr', 'abd-sp500-spy', 'gram-altin-spot']
    },
    'doviz-eur': {
      shortDesc: 'Avrupa Para Birimi (EUR/TRY). Türkiye sanayisinin en büyük ihracat pazarının gelir para birimi.',
      howItWorks: 'Hem Dolar/TL kurundan hem de küresel EUR/USD paritesinden etkilenir. Euro güçlendiğinde Avrupa’ya mal satan Türk sanayi şirketlerinin (Ford Otosan, Tofaş, Şişecam) TL gelirleri artar.',
      rawInputs: ['Dolar / TL Kuru', 'EUR / USD Paritesi', 'Avrupa Merkez Bankası Kararları'],
      risesWhen: 'Avrupa ekonomisi güçlendiğinde veya içeride döviz kurları yükseldiğinde.',
      fallsWhen: 'Avrupa durgunluğa girip dolar karşısında değer kaybettiğinde.',
      relatedKeys: ['bist-froto', 'bist-toaso', 'bist-sise', 'doviz-usd']
    },
    'bist-thyao': {
      shortDesc: 'Türk Hava Yolları (THYAO). 130’dan fazla ülkeye uçan, gelirinin ~%85’i döviz olan küresel havayolu ve kargo devi.',
      howItWorks: 'Yolcu bileti ve hava kargosunu dolar/euro bazında satar; en büyük maliyet kalemi uçak yakıtıdır (Brent petrol). Turizm canlı ve petrol dengeli olduğunda güçlü döviz nakdi üretir.',
      rawInputs: ['Brent Petrol & Jet Yakıtı Fiyatı', 'Küresel Turizm ve Kargo Hacmi', 'Dolar & Euro Kuru'],
      risesWhen: 'Petrol fiyatları gerilediğinde, yaz turizm sezonu güçlü geçtiğinde ve döviz gelirleri arttığında.',
      fallsWhen: 'Petrol sert fırladığında, jeopolitik hava sahası kapanmalarında veya salgın/küresel durgunlukta.',
      relatedKeys: ['emtia-petrol-bno', 'bist-tuprs', 'bist-pgsus', 'bist-tavhl']
    },
    'bist-tuprs': {
      shortDesc: 'TÜPRAŞ (TUPRS). Türkiye’nin en büyük sanayi şirketi; ham petrolü mazot, benzin ve jet yakıtına dönüştüren rafineri devi.',
      howItWorks: 'Ham petrol varili ile işlenmiş mazot/benzin arasındaki "rafineri marjından" dolar bazında para kazanır. Ülkedeki neredeyse her kamyon, uçak ve fabrika onun yakıtını kullanır; düzenli temettü ödeyicisidir.',
      rawInputs: ['Brent Ham Petrol', 'Akdeniz Rafineri Marjı (Dizel/Jet Crack)', 'Doğalgaz Enerji Maliyeti'],
      risesWhen: 'Mazot ve jet yakıtı talebi güçlü olduğunda, rafineri marjları açıldığında ve döviz yükseldiğinde.',
      fallsWhen: 'Küresel yakıt talebi daraldığında veya ham petrol fiyatında ani sert çöküşlerle stok zararı oluştuğunda.',
      relatedKeys: ['emtia-petrol-bno', 'bist-thyao', 'reel-perakende-bimas']
    },
    'bist-froto': {
      shortDesc: 'Ford Otosan (FROTO). Kocaeli ve Romanya fabrikalarında ticari araç üretip ~%80’ini Avrupa’ya Euro ile ihraç eden sanayi devi.',
      howItWorks: 'Yassı çelik, alüminyum ve yan sanayi parçalarını işleyip Avrupa’ya ticari araç satar. Maliyet geçişkenliği (Cost+ sözleşmeleri) ve düzenli temettü geleneğiyle Türkiye’nin en sağlam sanayi kasalarından biridir.',
      rawInputs: ['Yassı Çelik Sac (Ereğli)', 'Avrupa Ticari Araç Talebi', 'Euro / TL Kuru'],
      risesWhen: 'Avrupa’da ticari araç satışları arttığında ve Euro/TL kuru yükseldiğinde.',
      fallsWhen: 'Avrupa ekonomisi sert daraldığında veya otomotiv çip/tedarik zinciri aksadığında.',
      relatedKeys: ['doviz-eur', 'bist-eregl', 'bist-toaso', 'bist-egeen']
    },
    'reel-perakende-bimas': {
      shortDesc: 'BİM Birleşik Mağazalar (BIMAS). 81 ilde temel gıda ve tüketim ürünleri satan Türkiye’nin en büyük indirim market zinciri.',
      howItWorks: 'Müşteriden kasada peşin tahsilat yapar, tedarikçiye ise vadeli ödeme yapar (negatif işletme sermayesi). İnsanlar krizde de temel gıda aldığı ve enflasyonu anında raf fiyatına yansıtabildiği için savunma gücü yüksektir.',
      rawInputs: ['Gıda & Tarım Ürünleri', 'Soğuk Zincir Mazot & Elektrik Maliyeti', 'Hane Halkı Alım Gücü'],
      risesWhen: 'Gıda enflasyonu yüksekken nakit akışı büyüdüğünde ve mağaza sepet hacmi arttığında.',
      fallsWhen: 'Asgari ücret/personel giderleri satış artışından hızlı büyüdüğünde veya düzenleyici cezalar geldiğinde.',
      relatedKeys: ['reel-perakende-mgros', 'emtia-tarim-dba', 'halka-arz-tabgd']
    },
    'bist-eregl': {
      shortDesc: 'Erdemir — Ereğli Demir ve Çelik (EREGL). Otomotiv, beyaz eşya ve boru sanayisinin temel yassı çelik üreticisi.',
      howItWorks: 'Demir cevheri ve taşkömürünü yüksek fırınlarda eriterek çelik sac üretir. Döngüsel (cyclical) bir şirkettir: dünya çelik fiyatları ve sanayi üretimi canlandığında kârı katlanır, Çin ucuz çelik sattığında marjı daralır.',
      rawInputs: ['Demir Cevheri', 'Koklaşabilir Taşkömürü', 'Küresel Sıcak Haddelenmiş Sac (HRC) Fiyatı'],
      risesWhen: 'Küresel sanayi ve altyapı yatırımları hızlandığında, çelik dolar fiyatları yükseldiğinde.',
      fallsWhen: 'Çin piyasaya aşırı ucuz çelik sürdüğünde ve enerji maliyetleri arttığında.',
      relatedKeys: ['bist-froto', 'bist-krdmd', 'bist-sise']
    },
    'bist-asels': {
      shortDesc: 'ASELSAN (ASELS). Radar, hava savunma, elektronik harp ve haberleşme sistemleri üreten Türkiye’nin lider savunma teknolojisi şirketi.',
      howItWorks: 'Milyarlarca dolarlık uzun vadeli kesinleşmiş sipariş defteriyle (backlog) çalışır. İhracat sözleşmeleri büyüdükçe ve teslimat tahsilatları hızlandıkça dolar bazında büyür.',
      rawInputs: ['Yarı İletken Çip & Elektro-Optik Bileşenler', 'Ar-Ge Mühendisliği', 'Savunma Bütçeleri'],
      risesWhen: 'Yeni uluslararası savunma ihracat sözleşmeleri imzalandığında ve tahsilat nakit akışı güçlendiğinde.',
      fallsWhen: 'Kamu hak ediş tahsilatları geciktiğinde ve işletme sermayesi ihtiyacı arttığında.',
      relatedKeys: ['halka-arz-altny', 'fon-tematik-yari-iletken-soxx', 'reel-yazilim-miatk']
    },
    'reel-enerji-astor': {
      shortDesc: 'Astor Enerji (ASTOR). Elektrik şebekeleri ve yenilenebilir enerji santralleri için dev güç transformatörleri ve anahtarlama ürünleri üreticisi.',
      howItWorks: 'Bakır ve silisli sac kullanarak ürettiği trafoları hem Türkiye elektrik şebekesine hem de Avrupa/Ortadoğu’ya ihraç eder. Dünya elektrik şebekeleri yenilendikçe sipariş alır.',
      rawInputs: ['Elektrolitik Bakır', 'Silisli Çelik Sac', 'Küresel Elektrik Şebekesi Yatırımları'],
      risesWhen: 'Avrupa ve Türkiye trafo ihracatı ile güneş/rüzgâr şebeke yatırımları hızlandığında.',
      fallsWhen: 'Bakır hammadde maliyeti sert artıp sipariş teslim süreleri uzadığında.',
      relatedKeys: ['reel-enerji-cwene', 'reel-enerji-smrtg', 'gram-gumus-spot']
    },
    'gayrimenkul-konut-ekgyo': {
      shortDesc: 'Emlak Konut GYO (EKGYO). Türkiye’nin en büyük gayrimenkul yatırım ortaklığı; arsa geliştirme ve gelir paylaşımı konut projeleri yürütür.',
      howItWorks: 'Faiz oranlarına en duyarlı sektördür. Konut kredisi faizleri düştüğünde satışları patlar; Merkez Bankası faizi %35-%50 bandında yüksek kaldığında ise konut talebi yavaşlar ve hisse yıllarca enflasyonun gerisinde kalabilir.',
      rawInputs: ['Merkez Bankası ve Konut Kredisi Faizleri', 'Çimento & İnşaat Demiri Maliyeti'],
      risesWhen: 'Merkez Bankası güçlü faiz indirim döngüsüne girdiğinde ve konut kredileri açıldığında.',
      fallsWhen: 'Faizler yüksek kaldığında ve inşaat maliyetleri konut fiyatından hızlı arttığında.',
      relatedKeys: ['gayrimenkul-ticari-rygyo', 'gayrimenkul-gyo-fonu-optgy', 'mevduat-ust']
    },
    'bist-sasa': {
      shortDesc: 'SASA Polyester (SASA). Adana’da dev petrokimya, PTA ve polyester elyaf tesisleri kuran sanayi şirketi.',
      howItWorks: 'Büyük fabrika yatırımları (CAPEX) nedeniyle yüksek döviz borcu taşır. 2022 sonunda sosyal medya coşkusuyla gerçek değerinin katbekat üzerine çıktıktan sonra yıllar süren sert bir düşüş yaşayarak "iyi şirket bile aşırı pahalı fiyattan alınırsa zarar yazar" dersinin en somut örneği olmuştur.',
      rawInputs: ['Ham Petrol Türevleri (PTA / MEG)', 'Yatırım Kredisi Faizleri', 'Tekstil & Ambalaj Talebi'],
      risesWhen: 'Yeni PTA tesisleri tam kapasite nakit üretmeye başladığında ve borç yükü azaldığında.',
      fallsWhen: 'Herkesin aynı anda hücum ettiği aşırı çarpanlarda veya finansman giderleri kârı erittiğinde.',
      relatedKeys: ['emtia-petrol-bno', 'bist-tuprs']
    },
    'abd-sp500-spy': {
      shortDesc: 'ABD S&P 500 Endeks Fonu (SPY). Apple, Microsoft, NVIDIA, Amazon gibi dünyanın en büyük 500 Amerikan şirketine tek kalemde ortak eder.',
      howItWorks: 'Dolar bazında küresel büyümeden pay alır. Türkiye’de yerleşik yatırımcı için satış kârında alış-satış arası Yİ-ÜFE artışı %10 üzerindeyse TL maliyeti enflasyonla endekslenir, kalan reel kâr beyana tabidir.',
      rawInputs: ['ABD Şirket Kârları', 'Fed Faiz Politikası', 'Dolar / TL Kuru'],
      risesWhen: 'Küresel teknoloji ve ABD ekonomisi büyüdüğünde ve Dolar/TL yükseldiğinde.',
      fallsWhen: 'ABD borsalarında düzeltme yaşandığında veya Fed sıkılaştırma yaptığında.',
      relatedKeys: ['abd-nasdaq-qqq', 'kuresel-hisse-nvda', 'kuresel-hisse-msft', 'dunya-borsalari-vt']
    },
    'kuresel-hisse-nvda': {
      shortDesc: 'NVIDIA (NVDA). Dünya yapay zekâ veri merkezlerinin beyni olan GPU çiplerini tasarlayan küresel teknoloji lideri.',
      howItWorks: 'Büyük teknoloji şirketleri yapay zekâ sunucuları kurdukça yüksek kâr marjıyla çip satar. Getirisi çok yüksek olabildiği gibi değerleme beklentileri bozulduğunda sert dalgalanır.',
      rawInputs: ['TSMC Yarı İletken Üretim Kapasitesi', 'Küresel Bulut & Yapay Zekâ Yatırımları'],
      risesWhen: 'Yapay zekâ veri merkezi siparişleri beklentileri aştığında.',
      fallsWhen: 'Büyük teknoloji devleri sunucu harcamalarını yavaşlattığında veya ihracat kısıtlamaları geldiğinde.',
      relatedKeys: ['fon-tematik-yari-iletken-soxx', 'abd-nasdaq-qqq', 'kuresel-hisse-msft']
    },
    'kripto-btc': {
      shortDesc: 'Bitcoin (BTC/TRY). Toplam arzı 21 milyon adetle sınırlandırılmış, 7/24 kesintisiz işlem gören en büyük kripto varlık.',
      howItWorks: 'Şirket kârı veya faiz üretmez; küresel para bolluğu (likidite) arttığında hızla yükselir, merkez bankaları piyasadan para çektiğinde ise -%50 ile -%75 arası sert düşüşler yaşayabilir.',
      rawInputs: ['Küresel Dolar Likiditesi', 'Kurumsal Spot ETF Girişleri', 'Dolar / TL Kuru'],
      risesWhen: 'Küresel faizler düşüp para bolluğu arttığında ve kurumsal alımlar hızlandığında.',
      fallsWhen: 'Küresel riskten kaçış dönemlerinde kaldıraçlı pozisyonlar tasfiye edildiğinde.',
      relatedKeys: ['kripto-eth', 'kripto-sol', 'abd-nasdaq-qqq']
    }
  };

  const SECTOR_DEFAULTS = {
    'Bankacılık & Mevduat': {
      how: 'Mevduat toplayıp ticari ve bireysel kredi vererek faiz marjı ve komisyon geliri üretir.',
      inputs: ['TCMB Politika Faizi', 'Ülke Risk Primi (CDS)', 'Kredi Büyümesi ve Tahsilat Kalitesi'],
      rise: 'Enflasyon düşerken faiz indirim döngüsü yaklaştığında ve yabancı yatırımcı girişi hızlandığında.',
      fall: 'Kredi-mevduat makası daraldığında veya batık kredi karşılıkları arttığında.'
    },
    'Otomotiv & Yan Sanayi': {
      how: 'Araç veya otomotiv parçası üretip iç pazara ve ağırlıklı olarak Avrupa’ya ihraç eder.',
      inputs: ['Yassı Çelik ve Alüminyum', 'Euro / TL Kuru', 'Avrupa ve İç Pazar Araç Talebi'],
      rise: 'Avrupa ihracat siparişleri ve Euro kuru güçlendiğinde.',
      fall: 'Kredi faizleri iç talebi kıstığında veya Avrupa pazarı daraldığında.'
    },
    'Enerji, Elektrik & Gaz': {
      how: 'Elektrik üretimi, dağıtımı veya enerji ekipmanı satışı üzerinden düzenli nakit akışı yaratır.',
      inputs: ['Doğalgaz ve Kömür Fiyatları', 'Baraj Yağış Oranları (HES)', 'EPİAŞ Elektrik Tavan Fiyatı'],
      rise: 'Elektrik tüketimi ve şebeke yatırımları arttığında, borçluluğu düşük santraller tam kapasite çalıştığında.',
      fall: 'Kuraklıkta hidroelektrik üretimi düştüğünde veya döviz bazlı yatırım borcu faizi şiştiğinde.'
    },
    'Gıda, İçecek & Tarım': {
      how: 'Temel gıda ve içecek üretip hem iç pazara hem ihracata satar; enflasyonu fiyatlara yansıtma gücü vardır.',
      inputs: ['Buğday, Şeker ve Tarım Emtiaları', 'Ambalaj (Cam/Alüminyum)', 'Mazot Lojistik Maliyeti'],
      rise: 'Yaz turizm ve tüketim sezonunda hacim büyüdüğünde, hammadde maliyetleri dengelendiğinde.',
      fall: 'Kuraklık nedeniyle tarımsal hammadde maliyetleri satış fiyatından hızlı arttığında.'
    },
    'Teknoloji, Yazılım & Savunma': {
      how: 'Kurumsal yazılım lisansı, siber güvenlik veya savunma elektroniği projeleri geliştirir.',
      inputs: ['Nitelikli Mühendislik Maliyeti', 'Yarı İletken Donanım', 'Kamu ve İhracat İhaleleri'],
      rise: 'Döviz bazlı yeni proje sözleşmeleri açıklandığında ve tahsilat hızı yüksek olduğunda.',
      fall: 'Fiyatı kazancına göre aşırı şiştiğinde veya tahsilat süreleri uzadığında.'
    }
  };

  // Canlı Dünya -> Hammadde -> Şirket Zincirleri
  function getLiveWorldChains() {
    const K = global.AetherKernelV10;
    if (!K) return [];
    const oil = K.getAsset('emtia-petrol-bno');
    const gold = K.getAsset('gram-altin-spot');
    const s1Info = K.getDarphanePremiumInfo();
    const dep = K.getAsset('mevduat-ust');
    const sukuk = K.getAsset('kira-sertifikasi-sukuk');
    const eur = K.getAsset('doviz-eur');
    const inf = K.getAnnualInflationPct();

    return [
      {
        id: 'chain-oil',
        title: 'Petrol & Yakıt Zinciri',
        triggerHeadline: `Brent Petrol Endeksi ${oil ? oil.priceUsd + ' $' : '58,9 $'} (${oil && oil.change1D >= 0 ? '+' : ''}%${(oil?.change1D || 0).toFixed(2)})`,
        step1: 'Ham Petrol (Brent)',
        step2: 'Rafineri İşleme & Akaryakıt Pompası (TÜPRAŞ)',
        step3: 'Uçak Yakıtı & Market Nakliyesi (THYAO, Pegasus, BİM)',
        insight: 'Petrol yükseldiğinde rafineri stok ve marj avantajı yakalayabilirken, en büyük gideri yakıt olan havayolları ve nakliye maliyetli sektörler baskılanır; petrol düştüğünde ise THYAO ve ulaştırma rahatlar.',
        assetKeys: ['emtia-petrol-bno', 'bist-tuprs', 'bist-thyao', 'bist-pgsus', 'reel-perakende-bimas']
      },
      {
        id: 'chain-gold',
        title: 'Altın & Sertifika Makası',
        triggerHeadline: `Gram Altın ${Math.round(gold?.priceTL || 6120).toLocaleString('tr-TR')} ₺ · Darphane Sertifikası +%${s1Info.premiumPct} Farklı`,
        step1: 'Küresel Ons Altın + Dolar/TL Kuru',
        step2: 'Kapalıçarşı Fiziki Gram Altın (%0 Stopaj)',
        step3: `Borsa Sertifikası ALTIN.S1 (+${Math.round(s1Info.diffTL)} ₺/gr Fark) & Altın Fonu (%17,5 Stopaj)`,
        insight: `Aynı altına yatırım yaparken seçtiğin kanal sonucu değiştirir: Kapalıçarşı fiziki altında vergi yoktur; altın fonlarında kârdan %17,5 stopaj kesilir; ALTIN.S1 sertifikasında ise şu an gram başına ${Math.round(s1Info.diffTL).toLocaleString('tr-TR')} ₺ fazladan prim ödenmektedir.`,
        assetKeys: ['gram-altin-spot', 'altin-sertifikasi', 'altin-fonu-zgold', 'ceyrek-altin', 'gram-gumus-spot']
      },
      {
        id: 'chain-rates',
        title: 'Faiz, Enflasyon & Gayrimenkul',
        triggerHeadline: `Mevduat Brüt %${dep?.annualGrossRatePct || 39} · Enflasyon %${inf.toFixed(1)} · Sukuk %0 Stopaj`,
        step1: 'Merkez Bankası Politika Faizi',
        step2: 'Vergisiz Kira Sertifikası (%0 Stopaj) vs Mevduat (%17,5 Stopaj)',
        step3: 'Krediyle Büyüyen GYO ve Borçlu Şirketler (EKGYO, SASA)',
        insight: 'Faizler yüksekken borçsuz ve nakit üreten araçlar (%0 stopajlı Kira Sertifikası, Para Piyasası Fonu) koruma sağlar; yüksek borçlu şirketler ve kredi faizine duyarlı GYO’lar ise faiz indirim döngüsü başlayana kadar zorlanır.',
        assetKeys: ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust', 'bist-banka', 'gayrimenkul-konut-ekgyo']
      },
      {
        id: 'chain-export',
        title: 'Çelik, Euro & Avrupa İhracatı',
        triggerHeadline: `Euro/TL ${(eur?.priceTL || 55.4).toFixed(2)} ₺ · Otomotiv ve Makine İhracat Hattı`,
        step1: 'Demir Cevheri & Yassı Çelik Sac (Ereğli)',
        step2: 'Ana İhracat Fabrikaları (Ford Otosan, Tofaş, Astor)',
        step3: 'Yan Sanayi Tedarikçileri (Ege Endüstri, Parsan, Kordsa)',
        insight: 'Avrupa’ya Euro ile mal satan ihracatçı şirketler, içeride maliyet artsa bile döviz gelirleriyle bilançolarını korur; ana fabrika büyüdüğünde ona parça veren yan sanayi şirketleri de peşinden gelir.',
        assetKeys: ['doviz-eur', 'bist-eregl', 'bist-froto', 'bist-toaso', 'reel-enerji-astor']
      },
      {
        id: 'chain-food',
        title: 'Tarım, Enflasyon & Perakende',
        triggerHeadline: `Yıllık Enflasyon %${inf.toFixed(1)} · Gıda ve Peşin Kasa Zinciri`,
        step1: 'Küresel Tarım Emtiası, Yağış & Gübre',
        step2: 'Gıda Üreticileri (Ülker, Coca-Cola, Tukaş)',
        step3: 'Peşin Tahsilat Yapan Marketler (BİM, Migros, Şok)',
        insight: 'Enflasyonist ortamda müşteriden peşin para alıp tedarikçiye 45-60 gün sonra ödeme yapan büyük gıda perakendecileri kasalarında sürekli sıcak nakit çevirir.',
        assetKeys: ['emtia-tarim-dba', 'reel-perakende-bimas', 'reel-perakende-mgros', 'halka-arz-tabgd']
      },
      {
        id: 'chain-tech',
        title: 'Çip, Yapay Zekâ & Savunma',
        triggerHeadline: 'Küresel Yarı İletken ve Savunma Teknolojileri Akışı',
        step1: 'Yarı İletken Çip Üreticileri (NVIDIA, SOXX)',
        step2: 'Küresel Teknoloji Devleri (S&P 500, Nasdaq, Microsoft)',
        step3: 'Yerli Savunma & Kurumsal Yazılım (ASELSAN, Logo, Altınay)',
        insight: 'Dünyada yapay zekâ ve savunma bütçeleri büyüdükçe hem küresel teknoloji endeksleri hem de döviz bazlı sipariş defteri olan savunma şirketleri uzun vadeli büyüme yakalar.',
        assetKeys: ['kuresel-hisse-nvda', 'abd-sp500-spy', 'abd-nasdaq-qqq', 'bist-asels', 'reel-yazilim-logo']
      }
    ];
  }

  function explainAsset(assetOrKey) {
    const K = global.AetherKernelV10;
    const asset = typeof assetOrKey === 'string' ? K?.getAsset(assetOrKey) : assetOrKey;
    if (!asset) return null;

    const custom = ASSET_PROFILES[asset.key] || ASSET_PROFILES[asset.id] || null;
    const r = asset.bistRow || null;
    const secDef = SECTOR_DEFAULTS[asset.categoryName] || null;

    let shortDesc = custom?.shortDesc || '';
    let howItWorks = custom?.howItWorks || '';
    let rawInputs = custom?.rawInputs || [];
    let risesWhen = custom?.risesWhen || '';
    let fallsWhen = custom?.fallsWhen || '';
    let relatedKeys = custom?.relatedKeys || [];

    if (!custom) {
      if (asset.isRateInstrument) {
        shortDesc = `Yıllık brüt %${asset.annualGrossRatePct.toFixed(1)} oranlı, %${asset.stopajPct} stopaj kesintili sabit getirili yatırım aracı.`;
        howItWorks = `Anaparanı piyasa dalgalanmasına sokmadan belirli faiz/kira oranıyla büyütür; önemli olan stopaj vergisi düşüldükten sonra kalan net getirinin enflasyonu geçmesidir.`;
        rawInputs = ['Merkez Bankası Politika Faizi', 'TÜİK Enflasyon Oranı', 'Stopaj Vergi Oranı'];
        risesWhen = 'Reel faiz pozitif olduğunda (net getiri enflasyonun üzerinde kaldığında).';
        fallsWhen = 'Enflasyon veya döviz kuru net faizin üzerinde sıçradığında alım gücü geride kalır.';
        relatedKeys = ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust'];
      } else if (r) {
        shortDesc = `${r.sector || 'Borsa İstanbul'} alanında faaliyet gösteren halka açık şirket (${asset.ticker}).`;
        howItWorks = secDef?.how || `${asset.name}, kendi sektöründe mal ve hizmet üretip satışlarından faaliyet nakdi ve bilanço kârı elde etmeyi hedefler.`;
        rawInputs = secDef?.inputs || ['Enerji ve Hammadde Maliyeti', 'Finansman / Kredi Faizleri', 'İç ve Dış Talep'];
        risesWhen = secDef?.rise || 'Satışları ve kasasına giren gerçek faaliyet nakdi büyürken borçluluğu düşük kaldığında.';
        fallsWhen = secDef?.fall || 'Borç faizleri faaliyet kârını erittiğinde veya kağıt üzerinde kâr yazıp nakit akışı eksiye düştüğünde.';
      } else if (asset.isForeignUsd) {
        shortDesc = `Dolar bazında işlem gören küresel yatırım aracı (${asset.symbol}).`;
        howItWorks = `Hem yurt dışındaki dolar fiyatının değişiminden hem de Türkiye’deki Dolar/TL kurundan eşzamanlı etkilenir.`;
        rawInputs = ['Küresel Dolar Fiyatı', 'Dolar / TL Kuru', 'GVK Mükerrer 80 Yİ-ÜFE Endeksleme Kuralı'];
        risesWhen = 'Küresel piyasada dolar bazında değer kazanırken içeride kur desteklediğinde.';
        fallsWhen = 'Küresel piyasalarda satış dalgası yaşandığında.';
        relatedKeys = ['abd-sp500-spy', 'abd-nasdaq-qqq', 'doviz-usd'];
      } else {
        shortDesc = `${asset.categoryName.replace(/^\d+\.\s*/, '')} grubunda gerçek piyasa yatırım aracı.`;
        howItWorks = 'Piyasadaki arz-talep dengesi, döviz kuru ve faiz ortamına göre anlık fiyatlanır.';
        rawInputs = ['Piyasa Likiditesi', 'Faiz ve Kur Dengesi'];
        risesWhen = 'Sektörel talep ve nakit girişi güçlendiğinde.';
        fallsWhen = 'Sıkı para politikası veya talep daralması yaşandığında.';
      }
    }

    // Türkiye Gerçek İşlem, Takas ve Vergi Kuralları Özeti
    let executionRule = '';
    if (asset.venue === 'BIST') {
      executionRule = `Hafta içi 10:00–18:00 arası anında işlem görür (mesai dışında verilen emir sabah 10:00 açılış eşleşmesine yazılır). Satış yaptığında para T+2 takas kuralı gereği 2 iş günü sonra çekilebilir nakde döner.${asset.stopajPct > 0 ? ` Kazanç üzerinden %${asset.stopajPct} stopaj kesilir.` : ' Gerçek kişilerde hisse alım-satım kazancında %0 stopaj uygulanır.'}`;
    } else if (asset.venue === 'TEFAS') {
      executionRule = `İş günleri saat 13:30 valör sınırından önce verilen emirler gününde işleme alınır; 13:30 sonrası verilen emirler 1 iş günü sarkar. Stopaj oranı: %${asset.stopajPct}.`;
    } else if (asset.venue === 'TWO_DOOR') {
      executionRule = `İki gerçek kanal vardır: 1) Kapalıçarşı Serbest Piyasa (Pzt–Cmt 09:30–18:30 açık, dar makas, %0 vergi), 2) Mobil Banka (7/24 açık; ancak 17:30 sonrası ve hafta sonu makas ~%3,60 açılır ve alımda %0,2 kambiyo vergisi kesilir).`;
    } else if (asset.subVenue === 'TERM_DEPOSIT') {
      executionRule = `Seçilen vade boyunca (32/181/366 gün) para bağlanır; 6 aya kadar %17,5, 1 yıla kadar %15, 1 yıldan uzun vadede %10 stopaj kesilir. Vadeden önce bozulursa faiz tamamen sıfırlanır.`;
    } else if (asset.isGvk80) {
      executionRule = `Yurt dışı varlıklarda alış ile satış arasındaki Yİ-ÜFE üretici enflasyonu %10 ve üzerindeyse TL alış maliyeti enflasyonla yükseltilir; kalan reel TL kazanç gelir vergisi beyanına tabidir.`;
    } else {
      executionRule = `7/24 anlık piyasa fiyatıyla işlem görür; işlem komisyonu %0,10 olarak uygulanır.`;
    }

    // Görsel Bilanço / Değer Sağlığı Analizi
    let health = null;
    if (r && (r.ocfMillionTL != null || r.netIncomeMillionTL != null)) {
      const ocf = Number(r.ocfMillionTL) || 0;
      const netInc = Number(r.netIncomeMillionTL) || 0;
      const cash = Number(r.cashMillionTL) || 0;
      const debt = Number(r.totalDebtMillionTL) || 0;
      let status = 'NEUTRAL';
      let verdict = 'Dengeli finansal görünüm.';
      if (ocf > 0 && cash >= debt * 0.6) {
        status = 'GOOD';
        verdict = 'Güçlü Kasa: Şirket esas faaliyetlerinden gerçek nakit üretiyor ve borç yükü kontrollü.';
      } else if (netInc > 0 && ocf < 0) {
        status = 'WARN';
        verdict = 'Dikkat: Bilançoda kağıt üzerinde kâr görünse de şirketin faaliyet nakit akışı ekside (kasadan nakit çıkıyor).';
      } else if (debt > Math.max(500, cash * 3) && ocf <= 0) {
        status = 'WARN';
        verdict = 'Yüksek Borç Riski: Şirketin toplam borcu hazır nakdine göre çok yüksek; yüksek faiz ortamında finansman gideri kârı baskılar.';
      } else if (ocf > 0) {
        status = 'GOOD';
        verdict = 'Nakit Üretiyor: Satışlarından kasasına düzenli faaliyet nakdi giriyor.';
      }
      health = { kind: 'COMPANY', status, verdict, ocfMillionTL: ocf, netIncomeMillionTL: netInc, cashMillionTL: cash, totalDebtMillionTL: debt, pe: r.pe, pb: r.pb };
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
          ? `Darphane Sertifikası (ALTIN.S1) şu an fiziki gram altından gram başına ${Math.round(d.diffTL).toLocaleString('tr-TR')} ₺ (+%${d.premiumPct}) daha pahalı işlem görüyor.`
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
          ? `Vergi sonrası yıllık net %${netAnnual} getiri, mevcut %${inf.toFixed(1)} yıllık enflasyonun üzerinde koruma sağlıyor.`
          : `Vergi kesildikten sonra yıllık net %${netAnnual} kalıyor; %${inf.toFixed(1)} yıllık enflasyon karşısında tek başına reel büyüme sağlamakta zorlanabilir.`
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
      health
    };
  }

  global.RealInvestmentGuide = {
    explainAsset,
    getLiveWorldChains
  };
})(typeof window !== 'undefined' ? window : globalThis);
