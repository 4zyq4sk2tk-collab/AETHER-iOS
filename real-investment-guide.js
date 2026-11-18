// ============================================================================
// GERÇEK YATIRIM REHBERİ, SOKAK ZEKÂSI, 5-BOYUTLU ADLİ BİLANÇO RÖNTGENİ,
// DERİN MUTFAK İSTİHBARATI, BAŞABAŞ TERAZİSİ, SAHA VAKALARI & UZMANLIK KÜLLİYATI
// (real-investment-guide.js — v15.1.0)
// ============================================================================
(function (global) {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. 69 TEMEL VARLIK + BIST LİDER ŞİRKETLERİ DERİN PROFİL KÜTÜPHANESİ
  //    Her varlıkta: Sokak Tanımı + Kasa Mekanizması + Uzmanın Baktığı Öncü Veri
  //    + Aceminin Düştüğü Tuzak + Hammadde/Domino Bağlantıları
  // --------------------------------------------------------------------------
  const ASSET_PROFILES = {
    // --- A) SABİT GETİRİ, MEVDUAT, SUKUK, DİBS, PPF & BES ---
    'mevduat-ust': {
      shortDesc: 'Özel bankalarda 32, 181 veya 366 gün sabit oranla bağlanan vadeli TL mevduat hesabı.',
      howItWorks: 'Anaparan tahta dalgalanmasına girmez; vade sonunda stopaj vergisi (%17,5 / %15 / %10) kesilip net faiz ödenir. Ancak vadeden 1 gün bile önce bozarsan biriken tüm faiz sıfırlanır!',
      expertEdge: 'Uzman brüt faize değil, stopaj sonrası kalan net oranın beklenen aylık TÜFE’yi ve 32 günlük Dolar başabaş kurunu geçip geçmediğine bakar; 181+ gün vadede stopajın %15’e düşmesi net getiriyi yükseltir.',
      trapWatch: 'Acil lazım olabilecek parayı uzun vadeye kilitleyip vadeden önce bozarak tüm faizi yakmak veya %0 stopajlı Kamu Sukuk varken aynı brüt oranda %17,5 vergi ödemek.',
      rawInputs: ['TCMB Politika Faizi & Depo İhaleleri', 'Bankaların TL Likidite İhtiyacı', 'Stopaj Oranı (%17,5/%15/%10)'],
      risesWhen: 'Merkez Bankası faizi enflasyonun üzerinde sıkı tuttuğunda ve kur yatay kaldığında.',
      fallsWhen: 'Ani kur şokunda veya vadeden önce nakit sıkışıklığıyla bozmak zorunda kaldığında.',
      relatedKeys: ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'dibs-tahvil', 'mevduat-tcmb']
    },
    'mevduat-tcmb': {
      shortDesc: 'TCMB resmi ağırlıklı ortalama TL vadeli mevduat faizi (%17,5 stopaja tabi standart banka gişesi).',
      howItWorks: 'Pazarlık yapmadan mobil şubeden açılan standart mevduat oranını temsil eder; üst bant özel oranlara ve %0 vergili Sukuk’a kıyasla her ay net getiri farkı bırakır.',
      expertEdge: 'TCMB her hafta Perşembe 14:30’da bankaların gerçek ağırlıklı ortalama mevduat faizini ilan eder; kredi-mevduat makası buradan okunur.',
      trapWatch: 'Bankanın "hoş geldin" süresi bitince oranın sessizce düşük standart faize çekilmesini fark etmemek.',
      rawInputs: ['TCMB Ağırlıklı Ortalama Fonlama', 'Zorunlu Karşılık Kuralları'],
      risesWhen: 'Bankacılık sisteminde TL mevduat toplama yarışı kızıştığında.',
      fallsWhen: 'Likidite bolluğunda bankalar mevduat faizini hızla aşağı çektiğinde.',
      relatedKeys: ['mevduat-ust', 'para-piyasasi-fonu', 'kira-sertifikasi-sukuk']
    },
    'katilim-hesabi': {
      shortDesc: 'Faizsiz bankacılık kâr-zarar ortaklığına dayalı vadeli TL Katılım Hesabı (%17,5 stopajlı).',
      howItWorks: 'Katılım bankasının reel ticaret ve finansman havuzundan elde ettiği kârı vade sonunda paylaşır; önceden kesin sabit faiz taahhüdü yoktur ancak referans kâr payı bandında ilerler.',
      expertEdge: 'Aynı faizsiz prensipte çalışan Hazine Kira Sertifikası (Kamu Sukuk) %0 stopajlı ve TEFAS’ta bozdurulabilir olduğu için vergi sonrası net terazi mutlaka karşılaştırılmalıdır.',
      trapWatch: 'Vadeden önce çekimde kâr payı hakkının yanması ve %17,5 stopaj kesintisini hesaba katmamak.',
      rawInputs: ['Reel Ticari Finansman Getirisi', 'TCMB Likidite Koşulları'],
      risesWhen: 'Ticari finansman kâr marjları yüksek seyrettiğinde.',
      fallsWhen: 'Enflasyon dağıtılan net kâr payının üzerine çıktığında.',
      relatedKeys: ['kira-sertifikasi-sukuk', 'fon-katilim-z30kp', 'altin-fonu-zgold']
    },
    'para-piyasasi-fonu': {
      shortDesc: 'TEFAS üzerinden her gün bileşik getiri işleten, vade bozulma cezası olmayan likit Para Piyasası Fonu (PPF).',
      howItWorks: 'Paranı gecelik TLREF repo ve kısa vadeli mevduatta çalıştırır; her gün üst üste bileşik büyür. İş günleri 13:30’dan önce bozduğunda faizin yanmadan aynı gün nakde döner (%17,5 stopaj).',
      expertEdge: 'Günlük bileşik (compounding) etkisi sayesinde 365 günde aynı brüt orandaki basit faizden belirgin şekilde daha yüksek yıllık efektif getiri üretir; yangın yeri fırsatları için "cephane park yeri"dir.',
      trapWatch: 'Saat 13:30 valör sınırını kaçırıp cuma öğleden sonra emir vererek parayı pazartesi sabahına kilitlemek.',
      rawInputs: ['BIST Gecelik TLREF Oranı', 'TCMB Politika Faizi', '%17,5 Fon Stopajı'],
      risesWhen: 'Gecelik TLREF faizi yüksekken fırsat bekleyen nakdi günlük bileşik çalıştırmak istediğinde.',
      fallsWhen: 'Merkez Bankası faiz indirim döngüsünü başlattığında günlük getirisi anında aşağı iner.',
      relatedKeys: ['kira-sertifikasi-sukuk', 'mevduat-ust', 'dibs-tahvil']
    },
    'kira-sertifikasi-sukuk': {
      shortDesc: 'Hazine Varlık Kiralama A.Ş. ihraçlı TL Kamu Kira Sertifikası (%0 Stopaj vergi kalkanlı!).',
      howItWorks: 'Devletin kamu varlıklarından kira geliri üretir. %0 stopaj muafiyeti sayesinde brüt %36,5 Sukuk, %17,5 vergili brüt %44,2 mevduata eşdeğer net nakit bırakır!',
      expertEdge: 'Türkiye’de vergi kalkanının gücünü en net gösteren araçtır: Vergi sıfır olduğu için brüt getiri kuruşu kuruşuna net cebine kalır (TEFAS T+1 valörlüdür).',
      trapWatch: '13:30 valör kuralını unutmak: Bugün boz emri verdiğinde nakit yarın (13:30 sonrasıysa 2 iş günü sonra) hesaba geçer.',
      rawInputs: ['Hazine Kira Sertifikası İhraç Getirisi', '%0 Stopaj Vergi Muafiyeti', '2Y Gösterge Tahvil'],
      risesWhen: 'Stopaj kesintisi vermeden enflasyon üstü net nakit akışı kurmak istediğinde.',
      fallsWhen: 'Aynı gün anında nakit çekimi gerektiğinde T+1 valör beklemesi gerekir.',
      relatedKeys: ['dibs-tahvil', 'para-piyasasi-fonu', 'mevduat-ust']
    },
    'dibs-tahvil': {
      shortDesc: 'Devlet İç Borçlanma Senedi (DİBS · 2 Yıllık Gösterge Hazine Tahvili · %0 Stopaj).',
      howItWorks: 'Devlete sabit faizle borç verirsin. En kritik mekanizması "tahvil tahterevallisi"dir: Piyasa faizleri düştüğünde elindeki yüksek kuponlu tahvilin ikincil piyasa fiyatı sert yükselir (sermaye kazancı yazar)!',
      expertEdge: '2 Yıllık (TR02Y) ile 10 Yıllık (TR10Y) tahvil faizi arasındaki eğim (Yield Curve) enflasyon beklentisinin röntgenidir; dezenflasyon baharı başlamadan önce sabit kuponlu DİBS çifte kazanç üretir.',
      trapWatch: 'Faizlerin daha da yükseleceği bir şok öncesinde uzun vadeli sabit tahvil alırsan vade öncesi piyasa fiyatı eksi yazabilir.',
      rawInputs: ['Türkiye 2Y ve 10Y Gösterge Tahvil Faizi', 'Hazine İhale Takvimi', 'Enflasyon Beklentisi'],
      risesWhen: 'Enflasyon düşüşe geçip Merkez Bankası faiz indirimlerine hazırlanırken.',
      fallsWhen: 'Şok faiz artışı veya bütçe açığı kaynaklı yoğun tahvil arzı geldiğinde.',
      relatedKeys: ['kira-sertifikasi-sukuk', 'gayrimenkul-konut-ekgyo', 'bist-banka']
    },
    'bes-emeklilik': {
      shortDesc: 'Bireysel Emeklilik Sistemi (BEFAS Fon Sepeti + Devlet Katkısı Uzun Vade Kumbarası).',
      howItWorks: 'Düzenli tasarrufa devlet katkısı ekleyen uzun vadeli emeklilik kalkanıdır; asıl kazancı içeride hangi BEFAS fonunu (altın, hisse, para piyasası) dönemine göre seçtiğin belirler.',
      expertEdge: 'BES kendi başına bir varlık değil bir "vergi ve devlet katkısı kabuğu"dur; 56 yaş ve 10 yıl kuralını bekleyenler stopaj ve devlet katkısı hak edişini maksimize eder.',
      trapWatch: 'Yıllarca yüksek yönetim giderli yanlış standart fonda unutmak veya ilk 3 yılda erken çıkıp devlet katkısını yakmak.',
      rawInputs: ['BEFAS Fon Dağılımı', 'Devlet Katkısı Oranı', 'TLREF & Altın/Hisse Seçimi'],
      risesWhen: 'Mevsime göre BEFAS fon dağılımı doğru yönetildiğinde ve uzun vade korunduğunda.',
      fallsWhen: 'Erken çıkış kesintilerine yakalanıldığında.',
      relatedKeys: ['para-piyasasi-fonu', 'gram-altin-spot', 'fon-yerli-bist30-apx30']
    },

    // --- B) DÖVİZ & EUROBOND ---
    'doviz-usd': {
      shortDesc: 'Amerikan Doları (Serbest Piyasa USD/TRY). Küresel enerji, borç ve hammadde ticaretinin rezerv birimi.',
      howItWorks: 'Dolar fabrika değildir; temettü veya kira üretmez. ABD’nin kendi enflasyonu yüzünden nakit dolar tutmak dünyada bile alım gücünü eritir; Türkiye’de yalnızca kur sıçramasına karşı kalkandır.',
      expertEdge: 'Uzman dolar almadan önce "32 Günlük Başabaş Kurunu" hesaplar: TL Sukuk ayda net +%3 veriyorsa, dolar 32 günde +%3’ten fazla artmadığı her ay dolar tutan reel olarak geriye düşer!',
      trapWatch: 'Akşam 17:30 sonrası mobil bankadan %3,60 açık makas + %0,2 BSMV kambiyo vergisiyle alıp daha ilk saniyede %2 zararla başlamak.',
      rawInputs: ['Türkiye-ABD Reel Faiz Farkı', 'TCMB Net Rezervleri', 'Cari Açık & CDS Risk Primi'],
      risesWhen: 'İçeride net TL faizi enflasyonun altında kaldığında veya dış finansman sıkıştığında.',
      fallsWhen: 'Yüksek reel TL faizi döneminde kur aylarca yatay gittiğinde ağır fırsat maliyeti yazar.',
      relatedKeys: ['doviz-eur', 'eurobond-usdtr', 'eurobond-emb', 'gram-altin-spot']
    },
    'doviz-eur': {
      shortDesc: 'Avrupa Para Birimi (Serbest Piyasa EUR/TRY). Türk sanayi fabrikalarının ana ihracat tahsilat parası.',
      howItWorks: 'Türkiye enerjisini Dolar ile alır, ürettiği otomobili, beyaz eşyayı ve tekstili Avrupa’ya Euro ile satar. EUR/USD paritesi yükseldiğinde hem Euro tutan hem de Kocaeli/Bursa ihracatçısı kazanır.',
      expertEdge: 'EUR/USD paritesi 1,10 üzerine güçlendiğinde FROTO, TOASO, ARCLK, SISE gibi Avrupa ihracatçılarının dolar bazlı hammadde maliyeti düşer, kar marjı çift yönlü açılır.',
      trapWatch: 'Avrupa ekonomisi resesyona girip ECB faiz indirirken parite düşüşünü hesaba katmamak.',
      rawInputs: ['USD/TRY Kuru', 'EUR/USD Paritesi', 'Avrupa Merkez Bankası (ECB) Faizi'],
      risesWhen: 'Avrupa büyümesi canlanıp EUR/USD paritesi yukarı döndüğünde.',
      fallsWhen: 'ABD Dolar Endeksi (DXY) küresel olarak güçlendiğinde.',
      relatedKeys: ['bist-froto', 'bist-toaso', 'bist-arclk', 'doviz-usd']
    },
    'doviz-gbp': {
      shortDesc: 'İngiliz Sterlini (GBP/TRY). Yüksek faizli gelişmiş ülke paritesi ve turizm/ihracat dövizi.',
      howItWorks: 'İngiltere Merkez Bankası (BoE) faiz patikası ve küresel finans merkezi akışlarıyla fiyatlanır; Türkiye’nin otomotiv, beyaz eşya ve turizm gelirlerinde önemli paya sahiptir.',
      expertEdge: 'Dolar baskılanırken çapraz parite (GBP/USD) hareketi üzerinden ek kur koruması arayanların takip ettiği majör dövizdir.',
      trapWatch: 'Banka ekranlarında Sterlin alış-satış makası Dolar ve Euro’dan daha geniş açılabilir; Kapalıçarşı makasını kontrol etmeden işlem yapmamak gerekir.',
      rawInputs: ['USD/TRY Kuru', 'GBP/USD Paritesi', 'İngiltere Merkez Bankası Faizi'],
      risesWhen: 'İngiltere faizleri yüksek kalıp GBP/USD güçlendiğinde.',
      fallsWhen: 'Küresel riskten kaçışta Dolar endeksi (DXY) sert yükseldiğinde.',
      relatedKeys: ['doviz-eur', 'doviz-chf', 'bist-froto']
    },
    'doviz-chf': {
      shortDesc: 'İsviçre Frangı (CHF/TRY). Dünyanın en düşük enflasyonlu tarihsel "sığınak" para birimi.',
      howItWorks: 'Jeopolitik krizlerde ve küresel bankacılık sarsıntılarında sermayenin ilk sığındığı para birimidir; uzun vadede Dolar ve Euro’ya karşı bile değer koruma eğilimi gösterir.',
      expertEdge: 'Küresel fırtına senaryolarında (savaş, borç krizi) Dolar’dan bile güçlü kalabilen nadir savunma paritesidir.',
      trapWatch: 'Fiziki ve banka makası dardır sanıp gece gişesinde yüksek makas ödemek.',
      rawInputs: ['Küresel Jeopolitik Risk', 'USD/CHF Paritesi', 'İsviçre Merkez Bankası (SNB)'],
      risesWhen: 'Küresel panik, savaş veya Avrupa borç stresi arttığında.',
      fallsWhen: 'Küresel risk iştahı çok yüksekken taşıma (carry) faizi düşük kaldığı için.',
      relatedKeys: ['gram-altin-spot', 'doviz-usd', 'doviz-gbp']
    },
    'eurobond-usdtr': {
      shortDesc: 'QNB Portföy Amerikan Doları Yabancı BYF (USDTR · Borsa İstanbul’da tek tıkla Dolar/Tahvil BYF).',
      howItWorks: 'Borsa saatlerinde hisse alır gibi ABD Hazine bonosu ve dolar varlığına yatırım yapar; ancak satış kazancı üzerinden %17,5 stopaj kesilir.',
      expertEdge: 'Beyanname uğraşı yoktur (kaynakta %17,5 stopaj kesilir biter), fakat kur artışından gelen TL farkının da %17,5’i vergiye gider!',
      trapWatch: 'Fiziki dövizde satış kazancı vergisi %0 iken, USDTR’de kur artışından doğan TL kazancın %17,5 stopaja tabi olduğunu unutmak.',
      rawInputs: ['Dolar / TL Kuru', 'ABD Kısa Vadeli Hazine Faizi', '%17,5 BYF Stopajı'],
      risesWhen: 'Dolar/TL yükseldiğinde ve ABD kısa vadeli dolar faizi işlediğinde.',
      fallsWhen: 'TL faizi kur artışını ezdiğinde ve %17,5 stopaj net getiriyi törpülediğinde.',
      relatedKeys: ['doviz-usd', 'eurobond-emb', 'kira-sertifikasi-sukuk']
    },
    'eurobond-emb': {
      shortDesc: 'Gelişen Ülkeler Dolar Eurobond Sepeti ETF (NASDAQ:EMB · Dolar bazında kupon + kur koruması).',
      howItWorks: 'Boş doları yastık altında tutmak yerine dolar bazında yıllık ~%5–6 kupon faizi üreten devlet Eurobond sepetine ortak eder; hem USD kuponu hem Dolar/TL kur farkı yazar.',
      expertEdge: 'Ülke risk primleri (CDS) zirveden düşerken ve Fed faiz indirirken Eurobond fiyatları dolar bazında da değer kazanır; GVK Mükerrer 80 Yİ-ÜFE %10 endeksleme kalkanından yararlanır!',
      trapWatch: 'ABD 10 yıllık tahvil faizi (US10Y) sert fırladığında tahvil fiyatları dolar bazında geri çekilebilir.',
      rawInputs: ['ABD 10Y Tahvil Faizi (US10Y)', 'Gelişen Ülke CDS Primleri', 'Dolar / TL Kuru'],
      risesWhen: 'Fed faiz indirdiğinde, CDS düştüğünde ve Dolar/TL yükseldiğinde.',
      fallsWhen: 'Küresel tahvil faizleri ve ülke risk primleri fırladığında.',
      relatedKeys: ['doviz-usd', 'abd-sp500-spy', 'eurobond-usdtr']
    },

    // --- C) ALTIN, GÜMÜŞ, KIYMETLİ MADEN & EMTİA ---
    'gram-altin-spot': {
      shortDesc: '24 ayar saf fiziki Gram Altın (Kapalıçarşı serbest piyasa TL/gr). Binlerce yıllık alım gücü terazisi.',
      howItWorks: 'İki motorla çalışır: Küresel Ons Altın ($) × İçerideki Dolar/TL kuru. Merkez bankaları para bastığında ve jeopolitik kriz çıktığında kağıt paraların erimesine karşı somut zırhtır.',
      expertEdge: 'Kapalıçarşı’da gündüz %0,40 dar makas ve %0 vergiyle alınır; borsadaki ALTIN.S1 +%10 üstü hava parası yazdığında uzman sertifikayı satıp fiziki grama geçerek bedavadan gramaj büyütür!',
      trapWatch: 'Gece yarısı banka uygulamasından %3,60 makas + %0,2 vergiyle altın almak.',
      rawInputs: ['Küresel Ons Altın ($)', 'Dolar / TL Kuru', 'ABD 10Y Reel Faizi & Merkez Bankası Alımları'],
      risesWhen: 'Jeopolitik tansiyon arttığında, Fed reel faizleri düştüğünde veya içeride kur yükseldiğinde.',
      fallsWhen: 'Dünyada dolar reel faizleri yükselip içeride TL faizi kur artışını geçtiğinde.',
      relatedKeys: ['altin-sertifikasi', 'altin-fonu-zgold', 'ceyrek-altin', 'gram-gumus-spot']
    },
    'ceyrek-altin': {
      shortDesc: 'Darphane basımı 22 ayar fiziki Çeyrek Altın (1,75 gr brüt / ~1,606 gr saf altın).',
      howItWorks: 'Gram altınla birebir aynı yönde hareket eder; ancak basım işçiliği ve düğün sezonu fiziki talebi nedeniyle alım-satım makası kesme/külçe gram altından biraz daha geniştir.',
      expertEdge: 'Kısa vadeli al-sat için değil, yıllarca bozulmayacak fiziki tasarruf içindir; sık al-sat yapacaksan has gram altın daha düşük sürtünmelidir.',
      trapWatch: 'Darphane arzının sıkıştığı yaz düğün sezonunda yüksek işçilik primiyle alıp sakin sezonda bozmak.',
      rawInputs: ['Ons Altın', 'Dolar / TL Kuru', 'Darphane Basım & Kuyumcu İşçiliği'],
      risesWhen: 'Ons ve Dolar yükseldiğinde, fiziki sarrafiye talebi arttığında.',
      fallsWhen: 'Kısa vadeli al-sat yapıldığında işçilik makası getiriyi yer.',
      relatedKeys: ['gram-altin-spot', 'cumhuriyet-altini', 'bilezik-22-ayar']
    },
    'cumhuriyet-altini': {
      shortDesc: 'Darphane basımı 22 ayar Ata / Cumhuriyet Altını (7,216 gr brüt · yüksek tutarlı fiziki saklama klasiği).',
      howItWorks: 'Çeyrek altına göre gram başına işçilik yüzdesi daha düşüktür; büyük tutarlı uzun vadeli fiziki birikimde Anadolu’nun en köklü değer saklama aracıdır.',
      expertEdge: 'Fiziki altında işçilik kaybını en aza indirmek isteyenler 24 ayar has gram külçe ile Ata Cumhuriyet arasındaki işçilik farkını mutlaka tartar.',
      trapWatch: 'Acil küçük nakit ihtiyacı olabilecek paranın tamamını tek parça büyük altına bağlamak.',
      rawInputs: ['Ons Altın', 'Dolar / TL Kuru', 'Sarrafiye İşçilik Makası'],
      risesWhen: 'Altın ons ve kur ralli yaptığında.',
      fallsWhen: 'Kısa vadede bozdurulduğunda alış-satış makası ödenir.',
      relatedKeys: ['gram-altin-spot', 'ceyrek-altin', 'altin-sertifikasi']
    },
    'bilezik-22-ayar': {
      shortDesc: '22 ayar bilezik (Gram TL). Takı ve tasarrufu birleştiren geleneksel fiziki altın formu.',
      howItWorks: '916 milyem (22 ayar) saflıktadır; taşsız/ajda tipi düz bileziklerde işçilik düşükken fantezi/işlemeli modellerde bozdururken ciddi işçilik kesintisi yaşanır!',
      expertEdge: 'Yatırım amaçlı alınıyorsa "yatırımlık işçiliksiz 22 ayar" ile "vitrin takısı" arasındaki %8-%15 işçilik erimesini bilmek servet kurtarır.',
      trapWatch: 'Yüksek işçilikli takı bileziğini yatırım sanıp kuyumcuda bozdururken gram değerinin %12 altında nakit almak.',
      rawInputs: ['24 Ayar Has Altın Fiyatı', '916 Milyem Katsayısı', 'Kuyumcu İşçilik Kesintisi'],
      risesWhen: 'Gram altın uzun vadede yükseldiğinde.',
      fallsWhen: 'İşçilikli model alınıp kısa sürede bozdurulduğunda.',
      relatedKeys: ['gram-altin-spot', 'ceyrek-altin', 'cumhuriyet-altini']
    },
    'altin-sertifikasi': {
      shortDesc: 'Darphane Altın Sertifikası (BIST:ALTIN.S1 · 100 adet sertifika = 1 gram 24 ayar altın).',
      howItWorks: 'Borsa İstanbul’da hisse gibi %0 stopajla alınıp satılır ve Darphane’den fiziki altına dönüştürülebilir. ANCAK borsada sertifika sayısı sınırlı olduğu için kalabalık hücum ettiğinde Kapalıçarşı’daki 1 gram altının %10–%15 üstüne çıkabilir!',
      expertEdge: 'Tarihsel denge primi +%1,5 ile +%3,5 arasıdır. Prim +%10’u aştığında bu fark saf "hava parası"dır; elinde S1 tutan satıp Kapalıçarşı gram altına geçerse tek kuruş eklemeden altın gramajını +%10–%14 büyütür!',
      trapWatch: 'Fiziki altın yatayken sırf hava parası balonu söndü diye ALTIN.S1’de -%12 zarar yazmak!',
      rawInputs: ['Kapalıçarşı Spot Gram Altın', 'Borsa İçi Bireysel Talep Primi (Hava Parası)'],
      risesWhen: 'Altın yükselirken veya borsada sertifikaya talep patladığında.',
      fallsWhen: 'Darphane yeni arz yaptığında veya hava parası makası normale (çarşı fiyatına) çöktüğünde!',
      relatedKeys: ['gram-altin-spot', 'altin-fonu-zgold', 'altin-fonu-gldtr']
    },
    'altin-fonu-zgold': {
      shortDesc: 'Ziraat Portföy Altın Katılım BYF (BIST:ZGOLD · Borsa ekranından fiziki altına yakın fiyatlama).',
      howItWorks: 'ALTIN.S1 gibi aşırı hava parası şişmesi yaşamaz, net aktif değerine yakın gider; ancak 9 Temmuz 2025 sonrası mevzuatla satış kârı üzerinden %17,5 stopaj kesilir!',
      expertEdge: '100.000 ₺’lik altın 150.000 ₺ olduğunda Kapalıçarşı fiziki altında 50.000 ₺ kârın tamamı cebinde kalırken, ZGOLD/GLDTR’de kârın 8.750 ₺’si (%17,5) stopaj vergisi olarak kesilir.',
      trapWatch: '%17,5 stopaj kesintisini hesaba katmadan fiziki altınla birebir aynı net getiriyi beklemek.',
      rawInputs: ['Spot Gram Altın', '%17,5 Satış Kârı Stopajı', 'BYF Net Aktif Değeri'],
      risesWhen: 'Ons altın ve Dolar/TL yükseldiğinde.',
      fallsWhen: 'Altın gerilediğinde veya %17,5 stopaj vergisi net kârı kırptığında.',
      relatedKeys: ['gram-altin-spot', 'altin-fonu-gldtr', 'altin-sertifikasi']
    },
    'altin-fonu-gldtr': {
      shortDesc: 'QNB Portföy Altın Borsa Yatırım Fonu (BIST:GLDTR · %17,5 stopaja tabi kaydi altın BYF).',
      howItWorks: 'İstanbul Takasbank/Borsa saklamasındaki külçe altına dayalı BYF’dir; borsa saatlerinde dar makasla alınıp satılır, satış kazancından %17,5 stopaj düşülür.',
      expertEdge: 'Gece banka makasından kaçıp gündüz borsa seansında hızlı altın pozisyonu açıp kapatmak isteyenlerin likit aracıdır; uzun vadeli tutuşta ise %0 vergili fiziki altın daha avantajlıdır.',
      trapWatch: 'Uzun vadeli enflasyon kalkanı kurarken nominal kur farkı kazancının %17,5’ini stopaja vermek.',
      rawInputs: ['Ons Altın ($)', 'USD/TRY', '%17,5 BYF Stopajı'],
      risesWhen: 'Altın ve kur yükseldiğinde.',
      fallsWhen: 'Reel faizler yükselip altın yatay/aşağı gittiğinde.',
      relatedKeys: ['gram-altin-spot', 'altin-fonu-zgold', 'altin-sertifikasi']
    },
    'gram-gumus-spot': {
      shortDesc: 'Fiziki Gram Gümüş (Serbest Piyasa TL/gr · %0 Stopaj). Hem değerli maden hem güneş/elektronik sanayi metali.',
      howItWorks: 'Altının küçük ama çok daha hırçın kardeşidir: Gelirinin yarısı yatırım talebinden, diğer yarısı güneş paneli (GES), elektrikli araç ve çip iletkenliğinden gelir.',
      expertEdge: 'Uzman "Altın / Gümüş Rasyosuna" bakar: Tarihsel ortalama ~65x iken rasyo 80x–85x üzerine çıktığında gümüş altına kıyasla çok ucuzlamış demektir!',
      trapWatch: 'Altın kadar sakin sanıp yüksek kaldıraçla veya tüm portföyle girerek -%15 haftalık silkelemelerde panik satışı yapmak.',
      rawInputs: ['Ons Gümüş ($)', 'Altın/Gümüş Rasyosu (80x+)', 'Güneş Paneli & Sanayi Talebi'],
      risesWhen: 'Altın yürürken küresel güneş enerjisi ve sanayi üretimi hızlandığında.',
      fallsWhen: 'Küresel sanayi durgunluğu korkusunda altına göre daha sert geri çekilir.',
      relatedKeys: ['gram-altin-spot', 'gumus-fonu-gmstr', 'reel-enerji-cwene']
    },
    'gumus-fonu-gmstr': {
      shortDesc: 'QNB Portföy Gümüş BYF (BIST:GMSTR · Borsa İstanbul’da işlem gören gümüş fonu · %17,5 stopaj).',
      howItWorks: 'Fiziki gümüş külçelerini saklama zahmeti olmadan borsa seansında tek tıkla gümüşe yatırım sağlar; satış kârından %17,5 stopaj kesilir.',
      expertEdge: 'GMSTR tahtasında da zaman zaman Net Aktif Değer (iNAV) üzerinde %3–%8 prim oluşabilir; almadan önce spot gram gümüşle makası kontrol edilmelidir.',
      trapWatch: 'Hem tahta primi şişikken almak hem de satışta %17,5 stopaj ödeyerek çift sürtünme yaşamak.',
      rawInputs: ['Spot Gram Gümüş', 'Borsa İçi Fon Primi', '%17,5 Stopaj'],
      risesWhen: 'Ons gümüş ve kur ralli yaptığında.',
      fallsWhen: 'Gümüş düzeltmesinde veya fon primi kapandığında.',
      relatedKeys: ['gram-gumus-spot', 'gram-altin-spot', 'altin-fonu-gldtr']
    },
    'ons-platin': {
      shortDesc: 'Spot Platin (TVC:PLATINUM · Otomotiv katalizörü, hidrojen ekonomisi ve ağır sanayi soy metali).',
      howItWorks: 'Altından çok daha nadir bulunmasına rağmen talebinin büyük kısmı dizel/hibrit otomotiv egzoz katalizörlerinden ve kimya sanayisinden gelir; GVK Mükerrer 80 Yİ-ÜFE endekslemesine tabidir.',
      expertEdge: 'Güney Afrika maden arz kesintileri ve hibrit araçların elektrikli araçlara kıyasla yeniden pay kazanması platin-altın makasını hareketlendirir.',
      trapWatch: 'Altın gibi saf kriz sığınağı sanmak; küresel otomotiv yavaşladığında platin baskılanır.',
      rawInputs: ['Otomotiv Katalizör Talebi', 'Güney Afrika Maden Arzı', 'Dolar / TL Kuru'],
      risesWhen: 'Hibrit/otomotiv üretimi güçlenip maden arzı kısıldığında.',
      fallsWhen: 'Küresel ağır sanayi resesyona girdiğinde.',
      relatedKeys: ['ons-paladyum', 'gram-altin-spot', 'bist-froto']
    },
    'ons-paladyum': {
      shortDesc: 'Spot Paladyum (TVC:PALLADIUM · Benzinli/hibrit araç katalizörü ve elektronik sanayi metali).',
      howItWorks: 'Arzı Rusya ve Güney Afrika’da yoğunlaşmış, emtia dünyasının en sert döngüsel metallerinden biridir; elektrikli araç geçişiyle uzun süre ezildikten sonra arz şoklarına sert tepki verir.',
      expertEdge: 'Tam bir "döngüsel emtia" dersidir: Zirveden %70 düşebilen emtialarda maden maliyet tabanını (all-in sustaining cost) izleyenler dip dönüşünü yakalar.',
      trapWatch: 'Sürü coşkusuyla emtia zirvesinde atlamak.',
      rawInputs: ['Rusya/G.Afrika Arzı', 'Benzinli/Hibrit Araç Üretimi', 'USD/TRY'],
      risesWhen: 'Jeopolitik yaptırımlar arzı kıstığında ve hibrit araç satışı arttığında.',
      fallsWhen: 'Tam elektrikli araç payı artıp katalizör talebi düştüğünde.',
      relatedKeys: ['ons-platin', 'gram-gumus-spot', 'bist-toaso']
    },
    'emtia-petrol-bno': {
      shortDesc: 'Brent Ham Petrol Emtia Fonu (AMEX:BNO · Mazot, uçak yakıtı ve enflasyon zincirinin başlangıç taşı).',
      howItWorks: 'Kuzey Denizi Brent petrol vadeli kontratlarını izler. Boğazlarda gemi sıkıştığında veya OPEC+ vanayı kıstığında ilk fırlayan varlıktır; bütün ulaşım ve gıda enflasyonunun ateşleyicisidir.',
      expertEdge: 'Havayolu (THYAO/PGSUS) veya lojistik hissesi taşıyan usta yatırımcı, enerji şoku riskine karşı küçük bir BNO/TUPRS ağırlığını "doğal sigorta (hedge)" olarak kullanır.',
      trapWatch: 'Vadeli kontrat yenileme maliyeti (contango) nedeniyle petrol yıllarca yatay kalırsa fon yavaşça aşınabilir; kriz ve trend aracıdır.',
      rawInputs: ['OPEC+ Üretim Kararları', 'Hürmüz/Kızıldeniz Boğaz Trafiği', 'Küresel Fabrika/Ulaşım Talebi'],
      risesWhen: 'Jeopolitik arz kesintisi, boğaz krizi veya güçlü yaz seyahat talebinde.',
      fallsWhen: 'Küresel resesyon korkusuyla fabrikalar ve kamyonlar yavaşladığında.',
      relatedKeys: ['bist-tuprs', 'bist-thyao', 'bist-pgsus', 'bist-petkm']
    },
    'emtia-tarim-dba': {
      shortDesc: 'Küresel Tarım Emtiaları Fonu (AMEX:DBA · Buğday, mısır, soya, şeker, kakao ve kahve sepeti).',
      howItWorks: 'Kuraklık, don, El Niño/La Niña iklim şokları ve gübre maliyetleriyle doğrudan tarladaki gıda fiyatını izler.',
      expertEdge: 'Bir bölgede kuraklık başladığında gıda fabrikalarının marjı 6 ay sonra daralırken, tarım emtiası (DBA) ve peşin kasalı gıda perakendecisi bunu ilk günden fiyatlar.',
      trapWatch: 'İyi yağış ve rekor hasat yıllarında tarımsal emtialar uzun süre yatay/aşağı süzülebilir.',
      rawInputs: ['Küresel Kuraklık & Baraj Dolulukları', 'Doğalgaz & Gübre Maliyeti', 'USD/TRY'],
      risesWhen: 'Kuraklık, ihracat kısıtlamaları ve tarımsal arz şokları başladığında.',
      fallsWhen: 'Küresel rekolte bolluğu yaşandığında.',
      relatedKeys: ['reel-perakende-bimas', 'reel-perakende-mgros', 'bist-gubrf', 'bist-ccola']
    },

    // --- D) BORSA İSTANBUL ENDEKSLER, VİOP & BORSA YATIRIM FONLARI (BYF) ---
    'bist-100': {
      shortDesc: 'Borsa İstanbul BIST 100 Endeksi (XU100 · Türkiye’nin en büyük 100 şirketinin ana barometresi).',
      howItWorks: 'Bankacılık, holding, havacılık, enerji ve sanayi devlerinin piyasa değeri ağırlıklı sepetidir; Türkiye’nin büyüme, faiz ve yabancı sermaye döngüsünü tek rakamda özetler.',
      expertEdge: 'Nominal TL rekorlarına aldanma! Uzman BIST 100’e mutlaka "Dolar bazında (XU100 / USDTRY)" ve "TÜFE enflasyonundan arındırılmış reel bazda" bakar.',
      trapWatch: 'Enflasyon %30 iken endeks +%15 çıktı diye para kazandığını sanmak (reel olarak -%11,5 erime!).',
      rawInputs: ['TCMB Faiz Döngüsü', 'Ülke CDS Risk Primi & Yabancı Girişi', 'Şirket Nakit Akışları'],
      risesWhen: 'Faiz indirim beklentisi, düşen CDS ve yabancı kurumsal giriş birleştiğinde.',
      fallsWhen: 'Yüksek reel mevduat faizi borsadaki parayı vakumladığında veya siyasi/jeopolitik şoklarda.',
      relatedKeys: ['bist-30', 'fon-yerli-bist30-apx30', 'bist-banka', 'viop-bist30-kontrat']
    },
    'bist-30': {
      shortDesc: 'Borsa İstanbul BIST 30 Endeksi (XU030 · En likit, kurumsal ve yabancı takasına açık 30 dev şirket).',
      howItWorks: 'THYAO, TUPRS, GARAN, BIMAS, ASELS, KCHOL, FROTO gibi derinliği en yüksek 30 lokomotif şirketten oluşur; yabancı fonlar Türkiye’ye girdiğinde ilk aldıkları kapıdır.',
      expertEdge: 'Sosyal medya spekülasyonundan uzak, kurumsal derinliği yüksek şirketlerle borsaya ortak olmanın omurgasıdır (%0 stopajlı APX30 BYF ile tek tıkla alınabilir).',
      trapWatch: 'Sığ yan tahta rallilerinde sabırsızlanıp sağlam BIST 30 kalelerini satarak tuzak tahtalara geçmek.',
      rawInputs: ['Yabancı Kurumsal Takas Oranı', 'CDS Primi', 'Büyük Şirket Bilançoları'],
      risesWhen: 'Yurt dışı fon girişleri ve kredi notu artışları başladığında.',
      fallsWhen: 'Küresel gelişen ülke fon çıkışlarında ilk satılan likit kapı olduğunda.',
      relatedKeys: ['fon-yerli-bist30-apx30', 'bist-100', 'viop-bist30-kontrat']
    },
    'bist-banka': {
      shortDesc: 'BIST Bankacılık Endeksi (XBANK · Garanti, Akbank, İş Bankası, Yapı Kredi öncülüğünde finans kalbi).',
      howItWorks: 'Ülke risk primi (CDS), kredi-mevduat makası (NIM) ve elindeki dev devlet tahvili portföyünün değerlemesiyle hareket eder; faiz dönüşlerinin en hızlı öncüsüdür.',
      expertEdge: 'BDDK her hafta Perşembe günü bankacılık sektörünün haftalık net kârını ve takipteki kredi (NPL) oranını açıklar; çeyrek bilançoyu beklemeden röntgen çekilir!',
      trapWatch: 'Merkez Bankası sürpriz sıkılaştırma / zorunlu karşılık artışı yaptığında en sert sarsılan sektördür.',
      rawInputs: ['BDDK Haftalık Net Faiz Marjı', 'Türkiye 5Y CDS Primi', 'TCMB Politika Faizi'],
      risesWhen: 'CDS düşerken, yabancı sermaye girerken ve faiz indirim döngüsü başlarken.',
      fallsWhen: 'Şok faiz artışı mevduat maliyetini kredi getirisinin üzerine çıkardığında.',
      relatedKeys: ['fon-yerli-banka-zplib', 'bist-garan', 'bist-akbnk', 'dibs-tahvil']
    },
    'bist-temettu-25': {
      shortDesc: 'BIST Temettü 25 Endeksi BYF (BIST:OPT25 · Düzenli nakit kâr payı dağıtan 25 şirkete %0 stopajlı ortaklık).',
      howItWorks: 'Kasasından ortaklarına düzenli nakit temettü ödeyen sağlam şirketleri tek sepette toplar; hisse senedi yoğun BYF olduğu için alım-satım kazancında stopaj %0’dır!',
      expertEdge: 'Tek tek hisse seçmeye vakti olmayan ama kendi "pasif nakit nehrini" kurmak isteyenler için vergi kalkanlı (%0 stopaj) temettü sepetidir.',
      trapWatch: 'Sadece geçmiş temettü verimine bakıp döngüsel düşüşteki sanayi ağırlığını göz ardı etmek.',
      rawInputs: ['Şirketlerin Serbest Nakit Akışı (FCF)', 'Dağıtılabilir VUK Kârı', '%0 BYF Stopajı'],
      risesWhen: 'Nakit üreten büyük sanayi ve finans şirketleri kâr büyüttüğünde.',
      fallsWhen: 'Yüksek faiz kışında şirketler nakdi korumak için temettü oranını kıstığında.',
      relatedKeys: ['bist-tuprs', 'bist-froto', 'bist-ismen', 'fon-yerli-hisse-zpbdl']
    },
    'viop-bist30-kontrat': {
      shortDesc: 'VİOP BIST 30 Vadeli İşlem Kontratı (XU030D1! · 09:30–18:15 ve 19:00–23:00 Akşam Seansı Barometresi).',
      howItWorks: 'Spot borsa 18:10’da kapandıktan sonra gece 19:00–23:00 arasında açık kalan tek yerli endeks tahtasıdır; gece gelen KAP, Fed veya Resmi Gazete haberlerinin sabah 10:00 açılışını nasıl etkileyeceğini önceden gösterir!',
      expertEdge: 'Vadeli fiyat ile Spot XU030 arasındaki farka "Teorik Taşıma Makası (Basis)" denir. Vadeli makas aylık TLREF faizinin çok altına inerse açıkçılar sıkışır, çok üstüne çıkarsa arbitraj fonları devreye girer.',
      trapWatch: 'Saat 15:00 VİOP Teminat Tamamlama (Margin Call) saatinde yetersiz teminatla yakalanıp dipten zorunlu tasfiye olmak!',
      rawInputs: ['Spot BIST 30 Endeksi', 'TLREF Vadeli Taşıma Faizi', 'Gece 19:00–23:00 Haber Akışı'],
      risesWhen: 'Spot endeks ve vadeli alım iştahı güçlendiğinde.',
      fallsWhen: 'Saat 15:00 Margin Call satışları veya gece şok haberleri geldiğinde.',
      relatedKeys: ['bist-30', 'bist-100', 'para-piyasasi-fonu']
    },
    'fon-yerli-hisse-zpbdl': {
      shortDesc: 'Ziraat Portföy BIST Banka Dışı Likit 10 BYF (BIST:ZPBDL · %0 Stopajlı 10 Sanayi/Hizmet Devi Sepeti).',
      howItWorks: 'Bankaları dışarıda bırakarak THYAO, TUPRS, BIMAS, ASELS, KCHOL, FROTO, TCELL, EREGL, SISE gibi Türkiye’nin en büyük 10 reel sektör kalesine tek tıkla ve %0 stopajla ortak eder.',
      expertEdge: 'Bankacılık regülasyonu riski almadan saf reel üretim, ihracat ve perakende devlerini tek sepette toplamanın en düşük maliyetli yoludur.',
      trapWatch: 'Banka rallisi günlerinde XBANK’ın gerisinde kalabileceğini bilerek taşımak gerekir.',
      rawInputs: ['10 Dev Reel Şirket Kasası', 'İhracat & İç Tüketim', '%0 Hisse Yoğun Stopaj'],
      risesWhen: 'Havacılık, rafineri, perakende ve savunma devleri yükseldiğinde.',
      fallsWhen: 'Sanayi ve küresel ihracat yavaşladığında.',
      relatedKeys: ['bist-thyao', 'bist-tuprs', 'reel-perakende-bimas', 'bist-asels']
    },
    'fon-yerli-banka-zplib': {
      shortDesc: 'Ziraat Portföy BIST Likit Banka BYF (BIST:ZPLIB · %0 Stopajlı Büyük Bankalar Sepeti).',
      howItWorks: 'Garanti, Akbank, İş Bankası, Yapı Kredi gibi en likit bankaları tek sepette toplar; hisse yoğun BYF statüsüyle satış kazancından %0 stopaj kesilir.',
      expertEdge: 'Tek bir bankanın bilanço sürprizine takılmadan tüm faiz indirimi ve yabancı girişi temasını tek sepetle yakalar.',
      trapWatch: 'Enflasyon muhasebesi veya makroihtiyati sıkılaştırma dönemlerinde yüksek oynaklık gösterir.',
      rawInputs: ['BDDK Haftalık Banka Kârları', 'CDS & Yabancı Girişi', 'TCMB Faiz Patikası'],
      risesWhen: 'Dezenflasyon ve faiz indirim beklentisi güçlendiğinde.',
      fallsWhen: 'Sürpriz faiz artışı veya kur şokunda.',
      relatedKeys: ['bist-banka', 'bist-garan', 'bist-akbnk']
    },
    'fon-yerli-bist30-apx30': {
      shortDesc: 'Ak Portföy BIST 30 Hisse Yoğun BYF (BIST:APX30 · %0 Stopajla En Büyük 30 Şirkete Tek Tık Ortaklık).',
      howItWorks: 'Borsa İstanbul’un en büyük 30 şirketini endeks ağırlığıyla taşır; yan tahta riskini sıfırlar ve %0 stopaj avantajına sahiptir.',
      expertEdge: 'Yeni başlayan birinin tüyolarla tek hisse batırmak yerine borsanın kaymak tabakasına kurumsal disiplinle ortak olmasını sağlar.',
      trapWatch: 'Endeks genel düşüşteyken nakit zırhı olmadan %100 ağırlıkla taşımak.',
      rawInputs: ['BIST 30 Şirket Kârları', 'Yabancı Sermaye Akışı', '%0 Stopaj'],
      risesWhen: 'BIST 30 lokomotif hisseleri yükseldiğinde.',
      fallsWhen: 'Genel piyasa riskten kaçışa geçtiğinde.',
      relatedKeys: ['bist-30', 'fon-yerli-hisse-zpbdl', 'fon-katilim-z30kp']
    },
    'fon-katilim-z30kp': {
      shortDesc: 'Ziraat Portföy Katılım 30 BYF (BIST:Z30KP · %0 Stopajlı Faizsiz/Katılım Endeksi 30 Şirket Sepeti).',
      howItWorks: 'Faizli borç/nakit oranı katılım ilkelerini aşmayan, gerçek üretim ve ticaret odaklı en büyük 30 şirkete %0 stopajla ortak eder.',
      expertEdge: 'Katılım filtresi doğal olarak aşırı faizli borç batağındaki şirketleri elediği için bilanço disiplini yüksek bir sanayi/perakende sepeti oluşturur!',
      trapWatch: 'Banka ve geleneksel holding rallilerinde endeks dışı kaldığı için farklı ayrışabilir.',
      rawInputs: ['Katılım 30 Sanayi & Perakende Bilançoları', 'Düşük Borçluluk Kriteri'],
      risesWhen: 'Borçsuz reel üretim ve perakende şirketleri öne çıktığında.',
      fallsWhen: 'Yalnızca bankacılık odaklı yükselişlerde geride kalabilir.',
      relatedKeys: ['reel-perakende-bimas', 'kira-sertifikasi-sukuk', 'bist-asels']
    },
    'fon-tematik-teknoloji-zpt10': {
      shortDesc: 'Ziraat Portföy Teknoloji & İletişim 10 BYF (BIST:ZPT10 · %0 Stopajlı ASELS, TCELL, LOGO Teknoloji Sepeti).',
      howItWorks: 'Türkiye’nin en büyük 10 savunma elektroniği, telekom ve yazılım şirketini tek sepette toplar (%0 stopaj).',
      expertEdge: 'Tekil yazılım hisselerindeki patron satışı veya aşırı çarpan riskini 10 büyük teknoloji/iletişim şirketine yayarak yumuşatır.',
      trapWatch: 'Teknoloji hisseleri F/K çarpanı şiştiğinde sert düzeltme yapabilir; 52H iskonto bölgelerinde toplamak esastır.',
      rawInputs: ['Savunma & Yazılım İhracatı', 'Telekom ARPU Tarifeleri', '%0 Stopaj'],
      risesWhen: 'Savunma, yazılım ve telekom bilançoları güçlendiğinde.',
      fallsWhen: 'Yüksek çarpanlı büyüme hisselerinde kâr satışı geldiğinde.',
      relatedKeys: ['bist-asels', 'bist-tcell', 'reel-yazilim-logo']
    },
    'fon-tematik-surdurulebilirlik-zsr25': {
      shortDesc: 'Ziraat Portföy BIST Sürdürülebilirlik 25 BYF (BIST:ZSR25 · %0 Stopajlı Kurumsal Yönetişim Sepeti).',
      howItWorks: 'Çevre, enerji verimliliği ve kurumsal şeffaflık kriterlerini geçen 25 büyük BIST şirketine %0 stopajla ortak eder.',
      expertEdge: 'Avrupa Yeşil Mutabakatı (CBAM sınırda karbon vergisi) devreye girdikçe düşük karbonlu üretim yapan sanayi şirketleri ihracatta rakiplerinin önüne geçer.',
      trapWatch: 'Genel BIST 30 ile yüksek korelasyonlu olduğunu unutup ayrı bir varlık sınıfı sanmak.',
      rawInputs: ['AB Yeşil Mutabakat Uyumlu İhracat', 'Kurumsal Yönetişim Kalitesi'],
      risesWhen: 'Yabancı ESG fonları ve büyük sanayi/finans hisseleri yükseldiğinde.',
      fallsWhen: 'Borsa İstanbul genel düzeltmeye girdiğinde.',
      relatedKeys: ['bist-30', 'bist-froto', 'bist-sise']
    },
    'fon-degisken-isglk': {
      shortDesc: 'İş Portföy Altın Katılım BYF (BIST:ISGLK · %17,5 Stopajlı Katılım Esaslı Altın BYF).',
      howItWorks: 'Katılım ilkelerine uygun fiziki altına dayalı borsa yatırım fonudur; borsa saatlerinde kolayca alınıp satılır ancak kârdan %17,5 stopaj kesilir.',
      expertEdge: 'Kapalıçarşı’ya gidemeyen ancak mesai saatlerinde düşük makasla altın taşımak isteyenler içindir; vergi maliyeti unutulmamalıdır.',
      trapWatch: '%17,5 stopaj kesintisi nedeniyle uzun vadede fiziki gram altının net getirisinin gerisinde kalır.',
      rawInputs: ['Spot Gram Altın', '%17,5 BYF Stopajı'],
      risesWhen: 'Ons altın ve Dolar/TL yükseldiğinde.',
      fallsWhen: 'Altın gerilediğinde.',
      relatedKeys: ['gram-altin-spot', 'altin-fonu-zgold', 'kira-sertifikasi-sukuk']
    },

    // --- E) GAYRİMENKUL & GYO ---
    'gayrimenkul-konut-tcmb': {
      shortDesc: 'TCMB Resmi Konut Fiyat Endeksi (TRHPI · Doğrudan alınıp satılmayan resmi konut terazi göstergesi).',
      howItWorks: 'Türkiye genelindeki tapu/ekspertiz konut değer artışını ölçen resmi gösterge endeksidir; portföyünün gerçek bir ev alım gücüne karşı eriyip büyümediğini gösterir.',
      expertEdge: 'TCMB Konut Fiyat/Kira Çarpanı ve konutun enflasyona karşı reel değişimi, GYO hisselerinin (EKGYO, RYGYO, ISGYO) ne zaman kelepir kaldığını ele verir!',
      trapWatch: 'Gösterge endeks olduğu için doğrudan emir girilemez; konut ve mülk temasına GYO payları veya OPTGY fonuyla ortak olunur.',
      rawInputs: ['Konut Kredisi Faizleri', 'İnşaat Maliyet Endeksi', 'Kira Çarpanı'],
      risesWhen: 'Konut kredisi faizleri düştüğünde ve arz daraldığında.',
      fallsWhen: 'Yüksek faiz ortamında konut fiyatları enflasyonun altında (reel eksi) kaldığında.',
      relatedKeys: ['gayrimenkul-konut-ekgyo', 'gayrimenkul-ticari-rygyo', 'gayrimenkul-gyo-fonu-optgy']
    },
    'gayrimenkul-konut-ekgyo': {
      shortDesc: 'Emlak Konut GYO (BIST:EKGYO · Türkiye’nin en büyük arsa geliştirme ve gelir paylaşımı konut GYO’su).',
      howItWorks: 'Arsalarını yüklenicilere "gelir paylaşımı" modeliyle verip satıştan pay alır. GYO statüsü sayesinde kurumlar vergisinden muaftır; faiz indirim döngüsünün en hassas barometresidir.',
      expertEdge: 'KAP’a düşen arsa ihalesi "2. Oturum Çarpanı" (ekspertiz değerinin kaç katına teklif geldiği), konut iştahını bilançodan aylar önce ifşa eder!',
      trapWatch: 'Politika faizi çok yüksekken erken ve kredili atlayıp aylarca taşıma maliyeti ödemek; kışın sonuna doğru kademeli toplanır.',
      rawInputs: ['TCMB & Konut Kredisi Faizleri', 'İhale 2. Oturum Çarpanları', 'Net Aktif Değer (NAD) İskontosu'],
      risesWhen: 'Faiz indirim baharı başladığında ve konut kampanyaları açıklandığında.',
      fallsWhen: 'Merkez Bankası şok faiz artışı yaptığında.',
      relatedKeys: ['gayrimenkul-gyo-fonu-optgy', 'gayrimenkul-ticari-isgyo', 'bist-oyakc']
    },
    'gayrimenkul-ticari-rygyo': {
      shortDesc: 'Reysaş GYO (BIST:RYGYO · E-ticaret ve perakende devlerine kiraya verilen modern lojistik depo imparatorluğu).',
      howItWorks: 'Konut satmaya değil, dev lojistik depolarından döviz/TÜFE endeksli düzenli kira nakdi toplamaya dayanır; çatı GES santralleriyle kendi elektriğini üretir.',
      expertEdge: 'Konut piyasası dursa bile market ve e-ticaret zincirlerinin soğuk/kuru depo ihtiyacı kesilmez; "depo doluluk oranı" ve kira yenilemeleri takip edilir.',
      trapWatch: 'Hızlı sert yükselişler sonrası PD/DD çarpanı diğer GYO’ların çok üzerine çıktığında güvenlik marjı daralır.',
      rawInputs: ['Lojistik Depo Kira Endeksi', 'E-Ticaret & Perakende Hacmi', 'Finansman Gideri'],
      risesWhen: 'Depo kiraları enflasyon üstü yenilendiğinde ve yeni depo metrekareleri devreye girdiğinde.',
      fallsWhen: 'Çarpan aşırı şişip kâr realizasyonu geldiğinde.',
      relatedKeys: ['gayrimenkul-ticari-isgyo', 'reel-perakende-mgros', 'gayrimenkul-gyo-fonu-optgy']
    },
    'gayrimenkul-ticari-isgyo': {
      shortDesc: 'İş GYO (BIST:ISGYO · A sınıfı ofis kuleleri, ticari mülkler ve seçkin konut projeleri portföyü).',
      howItWorks: 'İş Kuleleri başta olmak üzere kurumsal kiracılı ofis ve AVM mülklerinden düzenli kira toplar; genellikle ekspertiz Net Aktif Değerinin (NAD) ciddi altında iskontolu işlem görür.',
      expertEdge: 'Yıl sonu (4. çeyrek) gayrimenkul ekspertiz yeniden değerleme raporları özkaynakları sıçratır; PD/DD çarpanı buradan okunur.',
      trapWatch: 'Faizler zirvedeyken GYO iskontosunun hemen kapanmasını beklemek sabır ister.',
      rawInputs: ['Kurumsal Ofis/AVM Kira Gelirleri', 'Yıl Sonu Ekspertiz Değerlemesi', 'TCMB Faizi'],
      risesWhen: 'Faiz indirim beklentisiyle Net Aktif Değer iskontosu kapanırken.',
      fallsWhen: 'Sıkı para politikası uzadığında.',
      relatedKeys: ['gayrimenkul-konut-ekgyo', 'gayrimenkul-arazi-algyo', 'bist-isctr']
    },
    'gayrimenkul-arazi-algyo': {
      shortDesc: 'Alarko GYO (BIST:ALGYO · Döviz kasalı, borçsuz turizm otelleri ve değerli arsa portföyü).',
      howItWorks: 'Borçlu GYO’ların aksine kasasında güçlü döviz/nakit tutan ve Bodrum/Antalya turizm tesislerinden döviz bazlı kira alan defansif bir mülk kalesidir.',
      expertEdge: 'Hem Net Aktif Değer iskontosu hem de döviz bazlı turizm kirası sayesinde kur şoklarına en dayanıklı GYO yapılarından biridir.',
      trapWatch: 'Turizm sezonunun zayıf geçtiği jeopolitik gerginlik dönemlerinde yatay kalabilir.',
      rawInputs: ['Turizm Tesisi Döviz Kiraları', 'Kasadaki Döviz/Nakit Pozisyonu', 'Arsa Ekspertiz Değeri'],
      risesWhen: 'Turizm sezonu güçlü geçip döviz kuru ve mülk değerlemeleri arttığında.',
      fallsWhen: 'Turizmde bölgesel iptaller yaşandığında.',
      relatedKeys: ['bist-alark', 'gayrimenkul-ticari-isgyo', 'doviz-eur']
    },
    'gayrimenkul-gyo-fonu-optgy': {
      shortDesc: 'Osmanlı Portföy BIST GYO BYF (BIST:OPTGY · %0 Stopajla Tüm Büyük GYO’lara Tek Sepette Ortaklık).',
      howItWorks: 'Konut, depo, AVM ve turizm GYO’larını tek sepette toplar; tek bir proje riskine girmeden tüm "faiz indirimi baharı" temasını %0 stopajla taşır.',
      expertEdge: 'Kıştan bahara geçerken (Merkez Bankası ilk faiz indirimine hazırlanırken) tek tıkla sektör dönüşünü yakalamanın en temiz yoludur.',
      trapWatch: 'Şok faiz artışı dönemlerinde tüm sepet aynı anda baskılanır.',
      rawInputs: ['TCMB Faiz İndirim Döngüsü', 'GYO Net Aktif Değer İskontoları'],
      risesWhen: 'Enflasyon ve faizler düşüş trendine girdiğinde.',
      fallsWhen: 'Faiz artışı ve kredi kısıtlaması geldiğinde.',
      relatedKeys: ['gayrimenkul-konut-ekgyo', 'gayrimenkul-ticari-rygyo', 'dibs-tahvil']
    },

    // --- F) KÜRESEL BORSALAR, TEKNOLOJİ DEVLERİ & KRİPTO ---
    'abd-sp500-spy': {
      shortDesc: 'ABD S&P 500 Endeks ETF (AMEX:SPY · Apple, Microsoft, NVIDIA, Amazon dahil dünyanın en büyük 500 şirketi).',
      howItWorks: 'Dünya kapitalizminin amiral gemisidir: Küresel dolar kârlarının kaymağını toplar ve içeride hem USD hisse artışından hem USD/TRY kurundan çift yönlü beslenir.',
      expertEdge: 'Türkiye’de satarken alıştan bu yana Yİ-ÜFE üretici enflasyonu %10’u aşmışsa TL alış maliyetin enflasyonla yukarı endekslenir; kur/enflasyon köpüğüne boşuna vergi ödemezsin (GVK Mük. 80)!',
      trapWatch: 'ABD F/K çarpanları tarihsel zirvedeyken ve Fed sıkılaşırken tek seferde tüm parayla girmek; kademeli biriktirilir.',
      rawInputs: ['ABD 500 Şirket Hisse Başı Kârı (EPS)', 'Fed Faiz & Bilanço Likiditesi', 'Dolar / TL Kuru'],
      risesWhen: 'Küresel şirket kârları büyüdüğünde ve Dolar/TL desteklediğinde.',
      fallsWhen: 'ABD resesyonu veya küresel likidite daralması yaşandığında.',
      relatedKeys: ['abd-nasdaq-qqq', 'dunya-borsalari-vt', 'kuresel-hisse-msft']
    },
    'abd-nasdaq-qqq': {
      shortDesc: 'ABD Nasdaq 100 Teknoloji ETF (NASDAQ:QQQ · Küresel yazılım, bulut ve yapay zekâ devleri sepeti).',
      howItWorks: 'S&P 500’e göre çok daha yüksek büyüme ve kâr marjına sahip 100 teknoloji devini taşır; boğa piyasasında daha hızlı koşar, faiz şokunda daha sert sallanır.',
      expertEdge: 'ABD 10 Yıllık Tahvil Faizi (US10Y) düştüğünde teknoloji şirketlerinin gelecekteki dolar kârlarının bugünkü değeri yükselir.',
      trapWatch: 'Yüksek oynaklığı nedeniyle kısa vadeli ihtiyaç parasıyla girmek.',
      rawInputs: ['Yapay Zekâ & Bulut Büyümesi', 'ABD 10Y Tahvil Faizi', 'USD/TRY'],
      risesWhen: 'Teknoloji bilançoları beklentiyi aşıp tahvil faizleri gerilediğinde.',
      fallsWhen: 'ABD tahvil faizleri sert sıçradığında veya teknoloji yatırımları yavaşladığında.',
      relatedKeys: ['abd-sp500-spy', 'kuresel-hisse-nvda', 'fon-tematik-yari-iletken-soxx']
    },
    'dunya-borsalari-vt': {
      shortDesc: 'Tüm Dünya Borsaları ETF (AMEX:VT · ABD, Avrupa, Japonya ve Gelişen Ülkeler dahil 9.000+ şirket).',
      howItWorks: '"Hangi ülke kazanacak?" tahminine girmeden tüm dünya ekonomisine piyasa ağırlığıyla (%60+ ABD, %40 Avrupa/Asya) dolar bazında ortak eder.',
      expertEdge: 'Tek ülke riskini tamamen sıfırlayan nihai küresel çeşitlendirme omurgasıdır (GVK Mükerrer 80 Yİ-ÜFE endekslemeli).',
      trapWatch: 'Hafta sonları küresel borsalar kapalı olduğu için emir pazartesi seansında işler.',
      rawInputs: ['Küresel GSYH Büyümesi', 'Merkez Bankaları Likiditesi', 'USD/TRY'],
      risesWhen: 'Dünya ticaret hacmi ve şirket kârları genişlediğinde.',
      fallsWhen: 'Küresel eşzamanlı kriz ve likidite sıkışmasında.',
      relatedKeys: ['abd-sp500-spy', 'eurobond-emb', 'gram-altin-spot']
    },
    'fon-tematik-yari-iletken-soxx': {
      shortDesc: 'Küresel Yarı İletkenler & Çip ETF (NASDAQ:SOXX · NVIDIA, Broadcom, AMD, TSMC ekosisteminin kalbi).',
      howItWorks: 'Telefondan savunma radarına, otomobilden veri merkezine kadar modern dünyanın "yeni petrolü" olan çip tasarımcılarını ve makine üreticilerini toplar.',
      expertEdge: 'Çip sektörü sert döngüseldir: Stok fazlası dönemlerinde -%35 düşer, yeni veri merkezi/AI dalgasında katlayarak döner.',
      trapWatch: 'Döngünün en coşkulu tepesinde tüm sermayeyi tek tematik fona yığmak.',
      rawInputs: ['Küresel Çip Sipariş Döngüsü', 'Veri Merkezi CAPEX Bütçeleri', 'Tayvan/Jeopolitik Hat'],
      risesWhen: 'Yapay zekâ ve endüstriyel çip siparişleri büyüdüğünde.',
      fallsWhen: 'Çip stokları şişip ihracat kısıtlamaları geldiğinde.',
      relatedKeys: ['kuresel-hisse-nvda', 'abd-nasdaq-qqq', 'bist-asels']
    },
    'kuresel-hisse-nvda': {
      shortDesc: 'NVIDIA Corp (NASDAQ:NVDA · Yapay zekâ veri merkezlerinin GPU çip ve CUDA yazılım tekeli).',
      howItWorks: 'Altına hücum çağında altın arayan herkese kazma-kürek satan dükkân gibidir; brüt kâr marjı %70 civarındadır ancak beklenti en ufak yavaşladığında bir günde -%10 oynayabilir.',
      expertEdge: 'Microsoft, Meta, Google ve Amazon’un çeyreklik "Veri Merkezi CAPEX (Yatırım Harcaması)" rehberliği NVIDIA’nın gelecek çeyrek kasasını önceden söyler!',
      trapWatch: 'Muhteşem şirketi her fiyattan alırsan kazanacağını sanmak; büyük teknoloji devleri kendi çiplerini ürettikçe marj rekabeti izlenmelidir.',
      rawInputs: ['TSMC CoWoS Üretim Kapasitesi', 'Hiper-Ölçekli Bulut CAPEX Bütçeleri', 'USD/TRY'],
      risesWhen: 'Veri merkezi çip siparişleri beklentileri aştığında.',
      fallsWhen: 'Büyük müşteriler sunucu bütçelerinde frene bastığında.',
      relatedKeys: ['fon-tematik-yari-iletken-soxx', 'kuresel-hisse-msft', 'abd-nasdaq-qqq']
    },
    'kuresel-hisse-aapl': {
      shortDesc: 'Apple Inc (NASDAQ:AAPL · 2 milyardan fazla aktif cihaz ekosistemi ve dev hisse geri alım makinesi).',
      howItWorks: 'Sadece iPhone satmaz; App Store, iCloud ve ödeme servislerinden her ay yüksek marjlı abonelik nakdi toplar ve ürettiği yüz milyarlarca dolar serbest nakitle kendi hisselerini geri alıp iptal eder!',
      expertEdge: 'Hisse geri alımı (Share Buyback) pastadaki dilim sayısını azalttığı için kâr aynı kalsa bile senin payına düşen kârı büyütür.',
      trapWatch: 'Çin pazarındaki rekabet ve donanım yenileme döngüsünün yavaşladığı yıllarda yüksek F/K daralması.',
      rawInputs: ['Servis Abonelik Gelirleri', 'iPhone Yenileme Döngüsü', 'Hisse Geri Alım Programı'],
      risesWhen: 'Servis gelirleri ve cihaz yenileme döngüsü hızlandığında.',
      fallsWhen: 'Tüketici harcamaları yavaşlayıp tedarik zinciri sıkıştığında.',
      relatedKeys: ['kuresel-hisse-msft', 'abd-sp500-spy', 'abd-nasdaq-qqq']
    },
    'kuresel-hisse-msft': {
      shortDesc: 'Microsoft Corp (NASDAQ:MSFT · Kurumsal yazılım, Azure bulut ve kurumsal yapay zekâ omurgası).',
      howItWorks: 'Dünyadaki şirketler krizde bile Office, Windows ve Azure bulut faturalarını kesemez! Tekrarlayan kurumsal abonelik nakdiyle dünyanın AAA kredi notlu nadir kasalarındandır.',
      expertEdge: 'Bilançodaki "Azure Bulut Büyüme Oranı" ve "Ticari Kalan Performans Yükümlülüğü (RPO / Kesinleşmiş Sözleşmeler)" en kritik iki öncü satırdır.',
      trapWatch: 'Ağır yapay zekâ veri merkezi yatırımlarının (CAPEX) kısa vadede serbest nakit marjını baskılaması.',
      rawInputs: ['Azure Bulut Büyümesi', 'Kurumsal Yazılım Abonelikleri', 'USD/TRY'],
      risesWhen: 'Kurumsal bulut ve yazılım gelirleri çift haneli büyüdüğünde.',
      fallsWhen: 'Küresel BT bütçeleri daraldığında.',
      relatedKeys: ['kuresel-hisse-aapl', 'kuresel-hisse-nvda', 'abd-sp500-spy']
    },
    'koleksiyon-luks-lvmh': {
      shortDesc: 'LVMH Moët Hennessy Louis Vuitton (OTC:LVMUY · Küresel ultra-lüks marka ve fiyatlama gücü endeksi).',
      howItWorks: 'Louis Vuitton, Dior, Tiffany, TAG Heuer gibi asırlık kıtlık ve prestij markalarıyla enflasyonu müşteriye anında yansıtabilen yüksek brüt marjlı Avrupa devidir.',
      expertEdge: 'Ultra-zengin tüketici harcaması ve özellikle Çin/ABD lüks seyahat verileri bilançonun öncü sinyalidir.',
      trapWatch: 'Asya/Çin üst orta sınıf talebi daraldığında lüks tüketim hisseleri de döngüsel düzeltme yaşar.',
      rawInputs: ['Küresel Servet Etkisi', 'ABD & Asya Lüks Talebi', 'EUR/USD & USD/TRY'],
      risesWhen: 'Küresel varlık fiyatları ve turizm canlandığında.',
      fallsWhen: 'Çin ve Avrupa’da lüks harcamalar yavaşladığında.',
      relatedKeys: ['doviz-eur', 'abd-sp500-spy', 'dunya-borsalari-vt']
    },
    'kripto-btc': {
      shortDesc: 'Bitcoin / Türk Lirası (BTCTRY · Arzı 21 milyon adetle matematiksel sınırlı, 7/24 küresel likidite barometresi).',
      howItWorks: 'Kasasına kira veya temettü girmez; ancak dünyada merkez bankaları likidite musluğunu açtığında en hızlı tepki veren, çektiğinde ise -%50/-%65 silkeleyebilen yüksek volatiliteli dijital kıt varlıktır.',
      expertEdge: 'Uzman sosyal medya çığlıklarına değil, "Küresel M2 Para Arzına", "ABD Spot BTC ETF günlük net girişlerine" ve "Stablecoin (USDT+USDC) basım hacmine" bakar!',
      trapWatch: 'Hafta sonu her yer kapalıyken can sıkıntısıyla veya kaldıraç heyecanıyla tüm sepeti kriptoya sokmak.',
      rawInputs: ['Küresel Dolar Likiditesi & Fed', 'Spot ETF Net Girişleri', 'USDT/USDC Likidite Akışı'],
      risesWhen: 'Küresel likidite genişlediğinde ve kurumsal ETF alımları hızlandığında.',
      fallsWhen: 'Küresel panik anlarında kaldıraçlı pozisyonlar zincirleme patladığında.',
      relatedKeys: ['kripto-eth', 'kripto-sol', 'abd-nasdaq-qqq']
    },
    'kripto-eth': {
      shortDesc: 'Ethereum / Türk Lirası (ETHTRY · Akıllı sözleşmeler, DeFi ve tokenize finans ağının ana yakıtı).',
      howItWorks: 'Üzerinde çalışan finansal uygulamaların ve stablecoin transferlerinin işlem ücreti (gas) altyapısıdır; Bitcoin’e göre daha yüksek beta (oynaklık) taşır.',
      expertEdge: 'ETH/BTC paritesi ve ağ üzerindeki toplam kilitli değer (TVL) + ETF akışları kurumsal iştahı gösterir.',
      trapWatch: 'Likidite çekildiğinde Bitcoin’den çok daha sert düşebileceğini hesaba katmamak.',
      rawInputs: ['Küresel Kripto Likiditesi', 'Ağ Kullanımı & Staking Getirisi', 'USD/TRY'],
      risesWhen: 'Risk iştahı yüksekken ve kurumsal blokzincir kullanımı büyürken.',
      fallsWhen: 'Riskten kaçışta altcoin likiditesi kuruduğunda.',
      relatedKeys: ['kripto-btc', 'kripto-sol', 'abd-nasdaq-qqq']
    },
    'kripto-sol': {
      shortDesc: 'Solana / Türk Lirası (SOLTRY · Yüksek hızlı blokzincir ağı; çok sert yükseliş ve çok sert çöküş karakterli).',
      howItWorks: 'Düşük işlem ücreti ve hızıyla bireysel kripto ticaretinin merkezlerinden biridir; ancak spekülatif döngülerde bir ayda +%60 gidip ertesi ay -%45 çakılabilir.',
      expertEdge: 'Portföyün ana taşıyıcı kolonu değil, en fazla uykunu kaçırmayacak küçük (%2–%5) asimetrik bahis dilimi olabilir.',
      trapWatch: '"Kısa yoldan zengin olayım" diyerek ana sermayeyi yüksek oynaklıklı altcoine bağlamak.',
      rawInputs: ['Bireysel Risk İştahı', 'Token Kilit Açılımları (Unlock)', 'BTC Dominansı'],
      risesWhen: 'Küresel kripto boğasında altcoin iştahı kabardığında.',
      fallsWhen: 'BTC dominansı yükselip altcoinlerden para çekildiğinde.',
      relatedKeys: ['kripto-btc', 'kripto-eth']
    },

    // --- G) GİRİŞİM SERMAYESİ (GSYO) & HALKA ARZ TEMSİLCİLERİ ---
    'girisim-isgsy': {
      shortDesc: 'İş Girişim Sermayesi (BIST:ISGSY · İş Bankası grubunun büyüme aşamasındaki şirketlere ortaklık fonu).',
      howItWorks: 'Teknoloji, sağlık ve sanayi girişimlerine erken aşamada ortak olur, büyütür ve stratejik satış (Exit) veya halka arz ile kâr realize eder.',
      expertEdge: 'GSYO analizinde günlük ciroya değil, portföydeki iştiraklerin değerlemesine, kasadaki nakde ve yaklaşan "İştirak Satışı (Exit)" haberlerine bakılır.',
      trapWatch: 'İştirak satışı olmayan ara yıllarda kâr düzensiz görünebilir; sığ tahtada panikle al-sat yapılmaz.',
      rawInputs: ['İştirak Çıkış (Exit) Değerlemeleri', 'Sermaye Piyasası İştahı'],
      risesWhen: 'Portföyündeki bir şirketi yüksek çarpanla sattığında veya halka arz ettiğinde.',
      fallsWhen: 'Girişim çıkış piyasası donduğunda.',
      relatedKeys: ['girisim-gozde', 'girisim-vertu', 'bist-isctr']
    },
    'girisim-vertu': {
      shortDesc: 'Verusaturk Girişim Sermayesi (BIST:VERTU · Yazılım, enerji ve gıda iştiraklerine yatırım yapan GSYO).',
      howItWorks: 'Ortak olduğu girişimleri büyüterek Borsa İstanbul’da halka arz etme (IPO Exit) modeliyle özsermaye büyütür.',
      expertEdge: 'İştiraklerinin SPK halka arz başvuruları ve PD/DD (Defter Değeri) iskontosu ana takip göstergesidir.',
      trapWatch: 'Halka arz takvimi yavaşladığında iskonto uzun süre açık kalabilir.',
      rawInputs: ['SPK İştirak Halka Arz Onayları', 'Özsermaye Değerlemesi'],
      risesWhen: 'İştirak halka arz onayları geldiğinde.',
      fallsWhen: 'Halka arz piyasası soğuduğunda.',
      relatedKeys: ['girisim-isgsy', 'girisim-gozde']
    },
    'girisim-gozde': {
      shortDesc: 'Gözde Girişim Sermayesi (BIST:GOZDE · Sanayi, ambalaj, perakende ve teknoloji iştirakleri portföyü).',
      howItWorks: 'Şok Marketler, Polinas, Kümaş/Penta gibi büyük ölçekli reel şirket yatırımlarıyla tanınan, borçluluk ve iştirak değerlemesi döngüsüyle hareket eden GSYO’dur.',
      expertEdge: 'Portföyündeki halka açık iştiraklerin (SOKM, PENTA vb.) toplam borsa değeri ile GOZDE’nin kendi piyasa değeri arasındaki Net Aktif Değer iskontosu hesaplanır!',
      trapWatch: 'Solo holding borcu ve finansman giderlerinin yüksek faiz döneminde nakit akışını zorlaması.',
      rawInputs: ['Halka Açık İştirak Fiyatları', 'Net Borç & İştirak Satışı (Exit)'],
      risesWhen: 'Borç azaltıcı iştirak satışı yapıldığında ve PD/DD çok ucuzladığında.',
      fallsWhen: 'Yüksek faiz finansman giderini şişirdiğinde.',
      relatedKeys: ['bist-sokm', 'girisim-isgsy', 'girisim-vertu']
    },
    'girisim-hubvc': {
      shortDesc: 'Hub Girişim Sermayesi (BIST:HUBVC · Erken aşama yazılım/teknoloji girişimlerine yatırım yapan sığ GSYO).',
      howItWorks: 'Küçük ölçekli teknoloji girişimlerine tohum yatırım yapar; ancak sığ tahtası, sermaye artırımı süreçleri ve negatif nakit akışı nedeniyle çok yüksek risk taşır.',
      expertEdge: 'Sığ GSYO tahtalarında MKK dolaşımdaki pay artışı, bedelli/tahsisli kararları ve gerçek nakit üretimi kontrol edilmeden asla "düştü diye" atlanmaz!',
      trapWatch: 'Negatif faaliyet nakdi ve kurumsal satış baskısı varken sırf birim fiyatı küçük rakam (2–3 ₺) görünüyor diye "ucuz" sanmak!',
      rawInputs: ['Sermaye Yapısı Kararları (KAP)', 'MKK Dolaşım Oranı', 'Girişim Çıkışları'],
      risesWhen: 'Somut nakit girişi veya olumlu sermaye yapısı kararı geldiğinde.',
      fallsWhen: 'Nakit yakımı ve ortak/fon satışları sürdüğünde.',
      relatedKeys: ['girisim-isgsy', 'girisim-vertu']
    },
    'halka-arz-tabgd': {
      shortDesc: 'TAB Gıda (BIST:TABGD · Burger King, Popeyes, Sbarro, Usta Dönerci ile 1.600+ restoranlık hızlı servis devi).',
      howItWorks: 'AVM ve caddelerde müşteriden parayı kasada anında peşin/kartla tahsil eder; kendi et, ekmek ve patates tedarik ekosistemiyle ölçek ekonomisi kurar.',
      expertEdge: 'Her Perşembe 14:30’da açıklanan "TCMB Haftalık Kredi Kartı Yemek/Restoran Harcamaları" TABGD’nin çeyrek cirosunu 45 gün önceden gösterir!',
      trapWatch: 'Gıda hammaddesi ve asgari ücret artışlarının menü fiyatlarına tam yansıtılamadığı durgun çeyrekler.',
      rawInputs: ['TCMB Haftalık Restoran POS Verisi', 'Et/Patates/Buğday Maliyeti', 'Yeni Restoran Açılışları'],
      risesWhen: 'Yaz ve AVM trafiği güçlü olup pay geri alımı ve nakit üretimi hızlandığında.',
      fallsWhen: 'Tüketici dışarıda yeme bütçesini kıstığında.',
      relatedKeys: ['reel-perakende-bimas', 'reel-perakende-mgros', 'bist-ccola']
    },
    'halka-arz-altny': {
      shortDesc: 'Altınay Savunma Teknolojileri (BIST:ALTNY · İHA, deniz ve kara araçları için hareket kontrol ve silah sistemleri).',
      howItWorks: 'Milli savunma projelerine kritik alt sistem üretir; ancak halka arz sonrası aşırı coşkulu çarpanla fiyatlandığında kurumsal fon/ortak satışları ve lock-up bitişleri tahtayı baskılayabilir.',
      expertEdge: 'Savunma şirketlerinde tek kriter haber başlığı değil; "Kesinleşmiş Backlog / Piyasa Değeri" oranı ve MKK takasında fonların mal çıkıp çıkmadığıdır!',
      trapWatch: 'İyi sektörde diye 30–50x F/K çarpanından ve kurumsal satış baskısı varken tepeden atlamak.',
      rawInputs: ['Savunma Sanayii Başkanlığı Siparişleri', 'MKK Fon Takası', 'Tahsilat Süresi'],
      risesWhen: 'Çarpanlar makulleşip yeni dövizli seri üretim sözleşmeleri nakde döndüğünde.',
      fallsWhen: 'Halka arz sonrası fon/ortak satışları ve aşırı değerleme düzeltmesi sürdüğünde.',
      relatedKeys: ['bist-asels', 'fon-tematik-teknoloji-zpt10']
    },
    'halka-arz-rgyas': {
      shortDesc: 'Rönesans Gayrimenkul (BIST:RGYAS · Optimum, Piazza, Hilltown gibi dev AVM’lerden kira toplayan GYO).',
      howItWorks: 'Milyonlarca ziyaretçili AVM’lerde mağaza cirolarına endeksli kira toplar; enflasyon mağaza cirolarını büyüttükçe kira geliri de otomatik güncellenir.',
      expertEdge: 'AVM perakende ciro endeksi ve şirketin Euro cinsi yatırım borcunun FAVÖK’e oranı en kritik iki terazidir.',
      trapWatch: 'Euro kuru çok sert sıçrarken iç tüketim aynı anda durursa döviz borçlu AVM bilançoları baskılanır.',
      rawInputs: ['AVM Mağaza Ciro Artışı', 'Euro / TL Kuru (Borç Dengesi)', 'TCMB Faizi'],
      risesWhen: 'Perakende ciroları güçlü ve kur dengeli seyrettiğinde.',
      fallsWhen: 'Tüketim daralması veya sert Euro borç maliyeti oluştuğunda.',
      relatedKeys: ['gayrimenkul-ticari-isgyo', 'gayrimenkul-konut-ekgyo', 'bist-mavi']
    },

    // --- H) REEL SEKTÖR VE BIST DEV ŞİRKETLERİ (ÖZEL DERİN PROFİLLER) ---
    'bist-thyao': {
      shortDesc: 'Türk Hava Yolları (THYAO). Gelirinin ~%85’i döviz olan, 130+ ülkeye uçan bayrak taşıyıcı ve hava kargo devi.',
      howItWorks: 'Bilet ve kargoyu Dolar/Euro ile satar; en büyük gideri uçakların yaktığı jet yakıtıdır (Brent petrol). Petrol ucuzlayıp turizm ve kargo canlandığında dev bir döviz darphanesine dönüşür.',
      expertEdge: 'Bilançodan aylar önce her ayın başında KAP’a düşen "Aylık Trafik Sonuçları (Doluluk Oranı & Kargo Tonajı)" ile "EUR/USD paritesi" (bilet Euro, yakıt Dolar!) okunur.',
      trapWatch: 'Brent petrol sert fırlarken veya Orta Doğu hava sahaları kapanırken marj daralmasını hafife almak.',
      rawInputs: ['Brent Petrol & Jet Yakıtı', 'Aylık Yolcu & Hava Kargo Tonajı', 'EUR/USD Paritesi'],
      risesWhen: 'Petrol gerilediğinde, yaz turizm sezonunda ve EUR/USD yükseldiğinde.',
      fallsWhen: 'Petrol şokunda veya bölgesel hava sahası krizlerinde.',
      relatedKeys: ['emtia-petrol-bno', 'bist-tuprs', 'bist-pgsus', 'bist-tavhl']
    },
    'bist-pgsus': {
      shortDesc: 'Pegasus Hava Taşımacılığı (PGSUS). Dünyanın en yüksek FAVÖK marjlı düşük maliyetli (low-cost) havayollarından biri.',
      howItWorks: 'Genç ve yakıt cimrisi Airbus A321neo filosu + bagaj/koltuk/yemek ek gelirleriyle (ancillary revenue) yolcu başına maliyeti minimumda tutarak döviz bazında büyür.',
      expertEdge: 'Dış hat yolcu payı ve yakıt hedge (korunma) oranı bilançonun kâr kalitesini belirler.',
      trapWatch: 'Kış çeyrekleri (1Ç) havacılığın doğal zayıf sezonudur; asıl nakit 2Ç ve 3Ç yaz aylarında basılır.',
      rawInputs: ['Jet Yakıtı Fiyatı', 'Avrupa-Türkiye Dış Hat Trafiği', 'Euro / TL Kuru'],
      risesWhen: 'Petrol düşerken Avrupa dış hat yolcu sayısı arttığında.',
      fallsWhen: 'Petrol fırladığında veya kış ölü sezonunda beklenti abartıldığında.',
      relatedKeys: ['bist-thyao', 'bist-tavhl', 'emtia-petrol-bno']
    },
    'bist-tavhl': {
      shortDesc: 'TAV Havalimanları (TAVHL). Yurt içi ve yurt dışında 15+ havalimanı işleten, duty-free ve yer hizmetleri döviz kasası.',
      howItWorks: 'Uçak yakıtı riski taşımadan inen-kalkan her uluslararası yolcudan Euro bazlı ayakbastı ücreti ve duty-free harcaması tahsil eder!',
      expertEdge: 'Havayolu almak isteyip "petrol fırlarsa ne olur?" diye çekinen ustalar, yakıt riski olmayan havalimanı işletmecisini (TAVHL) tercih eder; DHMİ aylık yolcu verisiyle izlenir.',
      trapWatch: 'Yeni havalimanı imtiyaz yatırımları (Almatı, Ankara, Antalya) bitene kadar yatırım borcu taşınır; yatırımlar bittiğinde nakit hasadı başlar.',
      rawInputs: ['DHMİ Dış Hat Yolcu Sayısı', 'Euro / TL Kuru', 'Duty-Free Yolcu Başı Harcama'],
      risesWhen: 'Dış hat yolcu trafiği büyüyüp yeni terminaller devreye girdiğinde.',
      fallsWhen: 'Jeopolitik seyahat kısıtlamalarında.',
      relatedKeys: ['bist-thyao', 'bist-pgsus', 'bist-doco']
    },
    'bist-tuprs': {
      shortDesc: 'TÜPRAŞ (TUPRS). Ham petrolü kaynatıp ülkenin mazotunu, benzinini ve jet yakıtını üreten en büyük sanayi ve temettü kalesi.',
      howItWorks: 'Ham petrol varili ile işlenmiş motorin/jet yakıtı arasındaki dolar bazlı "Akdeniz Rafineri Marjından (Crack Spread)" kazanır; kasası net nakit doludur ve güçlü temettü dağıtır.',
      expertEdge: 'Petrolün kendi fiyatından çok "Dizel ve Jet Yakıtı Rafineri Marjı ($/varil)" ile "Ağır-Hafif Ham Petrol İskontosu" kârı belirler; TÜPRAŞ yatırımcı sunumlarında her ay yayınlanır!',
      trapWatch: 'Küresel rafineri marjları zirvedeyken düşük F/K’ya aldanıp marj daralma döngüsünü gözden kaçırmak.',
      rawInputs: ['Akdeniz Dizel & Jet Rafineri Marjı', 'Brent Ham Petrol', 'Doğalgaz Enerji Maliyeti'],
      risesWhen: 'Ulaşım/havacılık yakıt talebi güçlü olup rafineri marjları açıldığında.',
      fallsWhen: 'Küresel durgunlukta rafineri marjı daralıp sert petrol düşüşünde stok zararı yazıldığında.',
      relatedKeys: ['emtia-petrol-bno', 'bist-thyao', 'bist-kchol', 'bist-aygaz']
    },
    'bist-froto': {
      shortDesc: 'Ford Otosan (FROTO). Kocaeli ve Romanya fabrikalarında ticari araç üretip ~%80’ini Avrupa’ya Euro ile satan sanayi devi.',
      howItWorks: 'Ford Avrupa’nın ticari araç üretim üssüdür. İhracatın büyük kısmında "maliyet artı kâr (cost-plus)" anlaşması olduğu için hammadde ve kur dalgalanmalarına karşı doğal zırhlıdır; temettü klasiğidir.',
      expertEdge: 'Her ay açıklanan "OSD Aylık Otomotiv İhracat Adetleri" ve "Avrupa Ticari Araç Kayıtları (ACEA)" bilançoyu 45 gün önceden söyler!',
      trapWatch: 'Avrupa ticari araç pazarı daralırken ve elektrikli model geçiş yatırımları sürerken kısa vadeli sabırsızlık yapmak.',
      rawInputs: ['Avrupa Ticari Araç Talebi', 'EUR/TRY & EUR/USD Paritesi', 'Yassı Çelik Sac'],
      risesWhen: 'Avrupa siparişleri ve yeni model üretim adetleri büyüdüğünde.',
      fallsWhen: 'Avrupa sanayisi sert yavaşladığında.',
      relatedKeys: ['doviz-eur', 'bist-kchol', 'bist-toaso', 'bist-eregl']
    },
    'bist-toaso': {
      shortDesc: 'Tofaş Otomobil Fabrikası (TOASO). Bursa’da üretim yapan, Stellantis Türkiye çatısı ve yeni ticari/binek model döngüsü oyuncusu.',
      howItWorks: 'Hem iç pazar dağıtım gücünden hem de yeni nesil hafif ticari araç üretim/ihracat kontratlarından beslenen yüksek temettü geçmişli otomotiv devidir.',
      expertEdge: 'ODMD aylık yurt içi araç satışları, taşıt kredisi faizleri ve Bursa fabrikasının yeni model üretim takvimi ana katalizördür.',
      trapWatch: 'İç pazarda kredi faizleri çok yükselip ithal araç rekabeti kızıştığında marj daralması.',
      rawInputs: ['ODMD Aylık Araç Satışları', 'Taşıt Kredisi Faizleri', 'Euro Kuru & Yeni Model Üretimi'],
      risesWhen: 'Yeni üretim bantları devreye girip faiz indirim döngüsü başladığında.',
      fallsWhen: 'Yüksek faiz iç pazarı kestiğinde ve ihracat kontrat geçişlerinde boşluk olduğunda.',
      relatedKeys: ['bist-froto', 'bist-doas', 'bist-kchol']
    },
    'reel-perakende-bimas': {
      shortDesc: 'BİM Birleşik Mağazalar (BIMAS). 13.000+ mağazasıyla peşin parayla temel gıda satan Türkiye’nin en sağlam nakit makinesi.',
      howItWorks: 'Müşteriden parayı kasada bugün peşin alır, tedarikçiye 45–60 gün vadeyle öder (negatif işletme sermayesi mucizesi)! Hiç banka kredisine muhtaç kalmadan büyür.',
      expertEdge: 'Ekonomik krizde insanlar lüksten vazgeçip indirim marketine (hard-discount) ve özel markalı (private label) ürüne yöneldiği için fırtınada bile müşteri kazanır; Perşembe TCMB Market POS verisiyle izlenir.',
      trapWatch: 'Asgari ücret artışı çeyreğinde personel gideri sıçrarken sepet büyümesi yavaşlarsa faaliyet marjı geçici daralabilir.',
      rawInputs: ['TCMB Haftalık Market POS Cirosu', 'Gıda Enflasyonu', 'Asgari Ücret & Soğuk Zincir Mazot Gideri'],
      risesWhen: 'Sepet büyümesi ve mağaza trafiği enflasyonun üzerinde koştuğunda.',
      fallsWhen: 'Rekabet Kurumu cezaları veya maliyet artışının rafa geç yansıdığı çeyreklerde.',
      relatedKeys: ['reel-perakende-mgros', 'bist-sokm', 'halka-arz-tabgd']
    },
    'reel-perakende-mgros': {
      shortDesc: 'Migros Ticaret (MGROS). Fiziksel süpermarket gücünü Sanal Market, Hemen ve Yemek dijital ekosistemiyle birleştiren perakende lideri.',
      howItWorks: 'Yıllar süren Euro borç yükünü tamamen eritip "Net Nakit" kasaya geçerek kabuk değiştirmiştir; kasada biriken devasa peşin nakitten yüksek faiz ortamında ekstra finansal gelir yazar!',
      expertEdge: 'Net nakit pozisyonundaki perakendeci yüksek faiz kışında hem raftan hem de kasadaki nakdin mevduat faizinden çift yönlü kazanır!',
      trapWatch: 'Gıda enflasyonu hızla düşerken stok değerleme ve faiz gelirlerinin normalleşeceğini unutmak.',
      rawInputs: ['TCMB Market POS Verisi', 'Online Sipariş Payı', 'Kasadaki Net Nakit Getirisi'],
      risesWhen: 'Pazar payı büyürken kasadaki sıcak nakit serbest nakit akışı bastığında.',
      fallsWhen: 'Personel ve enerji giderleri ciro büyümesini aştığında.',
      relatedKeys: ['reel-perakende-bimas', 'bist-sokm', 'bist-aefes']
    },
    'bist-asels': {
      shortDesc: 'ASELSAN (ASELS). Radar, hava savunma (Çelik Kubbe), elektronik harp ve elektro-optik sistemler üreten milli savunma teknoloji lideri.',
      howItWorks: '10 milyar doları aşan yıllara sari kesinleşmiş sipariş defteriyle (Backlog) çalışır; yüksek katma değerli savunma ihracatı kilogram başına binlerce dolar gelir üretir.',
      expertEdge: 'ASELSAN analizinde en kritik iki satır: 1) Bilançodaki "Bakiye Siparişler (Backlog USD)" büyümesi, 2) "Ticari Alacakların Tahsil Hızı ve Faaliyet Nakit Akışı (OCF)"! Tahsilat hızlandığında hisse kabuk kırar.',
      trapWatch: 'Satış yazıp tahsilatın geciktiği yıllarda işletme sermayesi sıkışması veya çarpanın tarihsel bandın çok üstüne çıkması.',
      rawInputs: ['Uluslararası Savunma İhracat Sözleşmeleri', 'Nakit Hak Ediş Tahsilatı', 'Yarı İletken Çip Tedariki'],
      risesWhen: 'Döviz bazlı ihracat imzaları ve kamudan nakit tahsilatlar hızlandığında.',
      fallsWhen: 'Alacak tahsil süreleri uzayıp nakit akışı zayıfladığında.',
      relatedKeys: ['fon-tematik-teknoloji-zpt10', 'halka-arz-altny', 'fon-tematik-yari-iletken-soxx']
    },
    'bist-eregl': {
      shortDesc: 'Ereğli Demir ve Çelik (EREGL). Otomotiv, beyaz eşya ve boru sanayisinin ana yassı çelik üreticisi; fonksiyonel para birimi Dolardır!',
      howItWorks: 'Bilançosunu doğrudan USD tuttuğu için TMS-29 karmaşasından muaftır. Tam bir döngüsel sanayi devidir: Ton başına FAVÖK ($/ton) 50–60 dolara indiğinde kış yaşanır, 120–150 dolara çıktığında para basar.',
      expertEdge: 'Döngüsel hisselerde F/K kuralı TERS işler! Çelik kışında kâr düştüğü için F/K yüksek görünür (toplama bölgesi); çelik zirvesinde F/K 4x görünür (doygunluk bölgesi). "Ton Başı FAVÖK ($)" ve "HRC Sıcak Sac Fiyatı" izlenir!',
      trapWatch: 'Çin dünyaya dampingli ucuz çelik dökerken erken ve sabırsızca tüm kurşunu tek seferde sıkmak.',
      rawInputs: ['Dünya Sıcak Sac (HRC $/ton) Fiyatı', 'Demir Cevheri & Kok Kömürü Makası', 'İthal Çelik Anti-Damping Vergileri'],
      risesWhen: 'Küresel imalat PMI 50’yi aşıp ton başına dolar FAVÖK toparlandığında.',
      fallsWhen: 'Çin çelik fazlalığı fiyatları ezip enerji/kömür maliyeti yükseldiğinde.',
      relatedKeys: ['bist-isdmr', 'bist-krdmd', 'bist-froto']
    },
    'reel-enerji-astor': {
      shortDesc: 'Astor Enerji (ASTOR). Şehir şebekeleri ve yenilenebilir enerji santralleri için yüksek gerilim güç trafoları üreten sanayici.',
      howItWorks: 'Avrupa ve ABD’de yaşlanan elektrik şebekelerinin ve yeni veri merkezlerinin en büyük darboğazı olan güç trafolarını üretip ihraç eder.',
      expertEdge: 'TÜİK 12 haneli "GTİP 8504.23 Trafo İhracat Tonajı", bakır girdi maliyeti ve MKK takasında ortak satışı olup olmadığı birlikte kontrol edilmelidir!',
      trapWatch: 'Tahtada kurumsal/ortak mal çıkışı (negatif CMF) varken sırf KAP’a yeni sipariş haberi düştü diye heyecanla atlamak!',
      rawInputs: ['Elektrolitik Bakır & Silisli Sac', 'Avrupa/ABD Şebeke Siparişleri', 'MKK Fiili Dolaşım Takası'],
      risesWhen: 'İhracat payı büyürken tahtada kurumsal toplama (CMF > +0,10) eşlik ettiğinde.',
      fallsWhen: 'Ortak satışı / tipe dönüşüm arzı tahtayı baskıladığında.',
      relatedKeys: ['reel-enerji-cwene', 'reel-enerji-smrtg', 'bist-enjsa']
    },
    'reel-enerji-cwene': {
      shortDesc: 'CW Enerji (CWENE). Güneş enerjisi paneli (GES) üreticisi ve anahtar teslim santral kurulum şirketi.',
      howItWorks: 'Fabrika çatılarına ve arazilere güneş santrali kurar; panel hammaddesi olan polisilikon ve gümüş fiyatlarıyla TEİAŞ şebeke bağlantı kapasitesine doğrudan bağlıdır.',
      expertEdge: 'TEİAŞ aylık trafo kapasite tahsis listeleri ve şirketin yeni yatırım harcamasını (CAPEX) kendi faaliyet nakdiyle çevirip çeviremediği izlenir.',
      trapWatch: 'Yurt içinde güneş paneli üretim kapasitesi talebin çok üzerine çıktığında (fiyat savaşı) kâr marjlarının erimesi.',
      rawInputs: ['TEİAŞ Kapasite Tahsisleri', 'Gümüş & Hücre Maliyeti', 'Yatırım Kredisi Faizleri'],
      risesWhen: 'Şebeke kapasiteleri açılıp hücre/alüminyum yatırımları serbest nakde döndüğünde.',
      fallsWhen: 'Sektörde aşırı kapasite nedeniyle panel satış fiyatları düştüğünde.',
      relatedKeys: ['reel-enerji-astor', 'reel-enerji-smrtg', 'gram-gumus-spot']
    },
    'reel-enerji-smrtg': {
      shortDesc: 'Smart Güneş Teknolojileri (SMRTG). Aliağa entegre güneş hücresi ve panel üretimi yapan yenilenebilir enerji şirketi.',
      howItWorks: 'İthal hücre bağımlılığını azaltmak için yerli wafer/hücre üretimine yatırım yapar; Resmi Gazete ithal gözetim kararlarından korunma sağlar.',
      expertEdge: 'Yatırım teşvikli hücre fabrikasının tam kapasiteye geçişi ve Net Borç / FAVÖK oranının düşmeye başlaması dönüş işaretidir.',
      trapWatch: '2022 enerji balonundaki gibi F/K 60–80x seviyelerinden hikaye satın almak.',
      rawInputs: ['Yerli Hücre Teşvikleri & İthal Gözetim', 'Gümüş & Polisilikon', 'Finansman Gideri'],
      risesWhen: 'Yerli hücre üretimi marjları açıp borçluluk gerilediğinde.',
      fallsWhen: 'Yüksek borç faizi faaliyet kârını yuttuğunda.',
      relatedKeys: ['reel-enerji-cwene', 'reel-enerji-astor', 'gram-gumus-spot']
    },
    'reel-yazilim-logo': {
      shortDesc: 'Logo Yazılım (LOGO). Yüz binlerce KOBİ ve kuruma ERP muhasebe, e-fatura ve bordro yazılımı satan nakit üreten yazılım evi.',
      howItWorks: 'Fabrika bacası veya ağır hammadde stoğu yoktur; e-fatura kontörü ve yıllık SaaS yazılım bakım yenilemeleriyle yüksek marjlı tekrarlayan nakit akışı üretir.',
      expertEdge: 'Bilançoda "Tekrarlayan Gelirlerin (SaaS/Abonelik) Toplam Cirodaki Payı" ve Romanya (TotalSoft) operasyonu marjı takip edilir.',
      trapWatch: 'KOBİ’lerin yüksek faiz ortamında yeni yazılım paketlerini ertelediği çeyreklerde reel ciro büyümesinin yavaşlaması.',
      rawInputs: ['KOBİ Dijitalleşme & E-Belge Hacmi', 'Yazılım Mühendisliği Maaş Enflasyonu'],
      risesWhen: 'Abonelik fiyat güncellemeleri mühendislik maliyet artışını geçtiğinde.',
      fallsWhen: 'TL değerli kalıp personel gideri cirodan hızlı büyüdüğünde.',
      relatedKeys: ['fon-tematik-teknoloji-zpt10', 'bist-tcell', 'bist-asels']
    },
    'reel-yazilim-miatk': {
      shortDesc: 'MİA Teknoloji (MIATK). Kamu/sağlık yazılım projeleri ve mobilite teknolojileri şirketi.',
      howItWorks: 'Kamu ve özel sektör bilişim ihaleleriyle büyür; ancak borsa yatırımcısı için en kritik ders MKK dolaşımdaki pay takibidir!',
      expertEdge: 'Bir hissede MKK fiili dolaşımdaki lot sayısı kısa sürede yüz milyonlarca adet artıyorsa (ortakların kapalı paylarını borsada satılabilir tipe dönüştürmesi), tahtada arz baskısı oluşur!',
      trapWatch: 'MKK’da yoğun patron/ortak tipe dönüşüm arzı ve negatif CMF varken sosyal medya heyecanıyla hisseye atlamak.',
      rawInputs: ['Kamu Bilişim İhaleleri', 'MKK Fiili Dolaşım Lot Değişimi', 'Nakit Tahsilat Oranı'],
      risesWhen: 'Tipe dönüşüm arzı sindirilip gerçek serbest nakit akışı üretildiğinde.',
      fallsWhen: 'Dolaşımdaki pay adedi hızla artıp tahtaya ortak satışı geldiğinde!',
      relatedKeys: ['reel-yazilim-logo', 'fon-tematik-teknoloji-zpt10']
    },
    'bist-sasa': {
      shortDesc: 'SASA Polyester (SASA). Adana’da dev PTA ve petrokimya tesisleri kuran ancak ağır yatırım borcu taşıyan sanayi şirketi.',
      howItWorks: 'Borsa tarihinin en büyük değerleme dersidir: 2022’de harika fabrika hikayesiyle gerçek değerinin 10 katına şişirildiğinde tepeden alanlar yıllarca reel olarak erimiştir. İyi tesis ayrı, doğru fiyat ayrıdır!',
      expertEdge: 'PTA tesisinin ithalatı kesip pozitif Serbest Nakit Akışı (FCF) üretmeye başlaması ve Euro yatırım borcunun erimesi izlenir.',
      trapWatch: '"Dev fabrika kuruyor, kesin uçar" diyerek çarpanına ve borç yüküne bakmadan tepeden ortak olmak.',
      rawInputs: ['Küresel Polyester/PTA Marjları', 'Euro Yatırım Kredisi & Tahvil Dönüşümleri', 'Anti-Damping Koruma'],
      risesWhen: 'Dev CAPEX yatırımları tamamlanıp borç eritme (hasat) dönemine geçildiğinde.',
      fallsWhen: 'Küresel petrokimya marjları dipteyken finansman gideri kârı yuttuğunda.',
      relatedKeys: ['bist-petkm', 'emtia-petrol-bno']
    },
    'bist-garan': {
      shortDesc: 'Garanti BBVA (GARAN). Yüksek özsermaye kârlılığı (ROE), güçlü dijital komisyon geliri ve sadece %14 sınırlı MKK dolaşımıyla özel banka lideri.',
      howItWorks: 'Vadesiz mevduat tabanı ve kredi kartı/ödeme sistemleri komisyon geliri sayesinde yüksek faiz dönemlerinde bile rakiplerinden pozitif ayrışabilen özel bankadır.',
      expertEdge: 'Fiili dolaşımı çok düşük (~%14) olduğu için yabancı kurumsal alım geldiğinde tahtası hızlı tepki verir; BDDK haftalık verisiyle izlenir.',
      trapWatch: 'Enflasyonun altında özsermaye kârlılığı dönemlerinde nominal kâra aldanmak (bankalarda ROE > TÜFE şarttır!).',
      rawInputs: ['BDDK Haftalık Net Faiz Marjı', 'Komisyon Gelirleri', 'Türkiye CDS Primi'],
      risesWhen: 'Faiz indirim döngüsü başlarken ve yabancı fonlar BIST’e girerken.',
      fallsWhen: 'Makroihtiyati kredi kısıtları ve mevduat maliyeti sıkıştığında.',
      relatedKeys: ['bist-akbnk', 'bist-isctr', 'fon-yerli-banka-zplib']
    },
    'bist-akbnk': {
      shortDesc: 'Akbank (AKBNK). Güçlü sermaye yeterliliği ve yüksek likiditesiyle yabancı yatırımcının Türkiye’deki ilk giriş kapılarından biri.',
      howItWorks: 'Ticari/tüketici kredileri, Hazine tahvil portföyü ve varlık yönetimi komisyonlarıyla çalışır; faiz indirim beklentilerine en hızlı tepki veren banka tahtalarındandır.',
      expertEdge: 'PD/DD (Piyasa Değeri / Defter Değeri) çarpanı ile beklenen ROE arasındaki ilişki banka değerlemesinin altın anahtarıdır.',
      trapWatch: 'Perşembe 14:00 TCMB sürpriz şahin kararlarında yüksek beta nedeniyle sert dalgalanma.',
      rawInputs: ['TCMB Politika Faizi', '2Y-10Y Tahvil Portföyü', 'CDS & Yabancı Takası'],
      risesWhen: 'Enflasyon ve faizler düşüş patikasına girdiğinde.',
      fallsWhen: 'Fonlama maliyeti kredi getirisini aştığında.',
      relatedKeys: ['bist-garan', 'bist-sahol', 'fon-yerli-banka-zplib']
    },
    'bist-kchol': {
      shortDesc: 'Koç Holding (KCHOL). TÜPRAŞ, Ford Otosan, Tofaş, Yapı Kredi ve Arçelik’i tek çatıda toplayan Türkiye ekonomisinin özeti.',
      howItWorks: 'Enerji, otomotiv, finans ve dayanıklı tüketim devlerinden her yıl düzenli temettü nakdi toplar; solo holding kasasında güçlü net döviz/nakit tutar.',
      expertEdge: 'Uzman "Holding Net Aktif Değer (NAD) İskontosuna" bakar: İçindeki şirketlerin borsadaki toplam değerinden %30–%40 daha ucuza Koç Holding aldığında devlere indirimli ortak olursun!',
      trapWatch: 'Hem Avrupa ihracatı hem iç kredi piyasası aynı anda kilitlendiğinde iskonto bir süre geniş kalabilir.',
      rawInputs: ['İştirak Temettü Akışı (TUPRS/FROTO/YKBNK)', 'Holding Solo Net Nakit Kasası', 'Yabancı Girişi'],
      risesWhen: 'Yabancı yatırımcı Türkiye’ye girip NAD iskontosu kapandığında.',
      fallsWhen: 'Ülke risk primi yükseldiğinde.',
      relatedKeys: ['bist-tuprs', 'bist-froto', 'bist-sahol']
    },
    'bist-sahol': {
      shortDesc: 'Sabancı Holding (SAHOL). Akbank, Enerjisa, Çimsa, Kordsa ve Agesa ile bankacılık-enerji-malzeme dengesi kuran derin iskontolu holding.',
      howItWorks: 'Bankacılık ve enerji dağıtım nakit akışını yenilenebilir enerji ve küresel malzeme yatırımlarına yönlendirir.',
      expertEdge: 'Tarihsel olarak BIST’in en yüksek Net Aktif Değer (NAD) iskontolarından biriyle işlem görür; Akbank ve Enerjisa performansı ana sürükleyicisidir.',
      trapWatch: 'İskontonun kapanması için yabancı kurumsal akış ve net sermaye tahsisi katalizörü gerekir.',
      rawInputs: ['Akbank & Enerjisa Kârları', 'NAD İskontosu', 'TCMB Faiz Döngüsü'],
      risesWhen: 'Bankacılık ve enerji kolları eşzamanlı güçlendiğinde.',
      fallsWhen: 'Yüksek faiz kredi ve sanayi kollarını baskıladığında.',
      relatedKeys: ['bist-akbnk', 'bist-enjsa', 'bist-kchol']
    },
    'bist-enkai': {
      shortDesc: 'ENKA İnşaat (ENKAI). Kasasında milyarlarca dolarlık Eurobond/nakit zırhı taşıyan küresel mühendislik, taahhüt ve enerji kalesi.',
      howItWorks: 'Bilançosunu Dolar bazında tutar! Yurt dışında dev enerji santrali, rafineri ve altyapı projeleri yaparken kasasındaki devasa döviz/tahvil portföyünden de düzenli dolar getirisi yazar.',
      expertEdge: 'Borsa düşerken ve kur yükselirken kendi kasasındaki milyarlarca dolarlık net nakit sayesinde fırtınada sığınak görevi gören nadir BIST devidir!',
      trapWatch: 'Dolar yatay giderken ve TL faizi çok yüksekken agresif büyüme hisselerine göre daha ağırbaşlı ilerler.',
      rawInputs: ['Kasadaki Milyarlarca $ Net Nakit Portföyü', 'Yurt Dışı Dövizli Backlog', 'USD/TRY'],
      risesWhen: 'Yeni milyar dolarlık yurt dışı ihale imzalandığında ve Dolar/TL yükseldiğinde.',
      fallsWhen: 'TL aşırı değerlenip küresel tahvil piyasası sarsıldığında.',
      relatedKeys: ['doviz-usd', 'eurobond-emb', 'bist-asels']
    },
    'bist-tcell': {
      shortDesc: 'Turkcell (TCELL). Milyonlarca faturalı abonedeki enflasyon üstü paket yenilemeleriyle VUK bazında dev nakit basan iletişim lideri.',
      howItWorks: 'İnsanlar krizde bile mobil internetini kapatmaz! Enflasyon hızı yavaşlarken geriden gelen yıllık taahhüt yenilemeleri abone başı geliri (ARPU) reel olarak büyütür.',
      expertEdge: 'TMS-29 amortisman düzeltmesi kağıt kârı düşük gösterse bile, kasaya giren gerçek Faaliyet Nakit Akışı (OCF) 100 Milyar ₺’yi aşan tam bir "Gizli Nakit Şampiyonu"dur!',
      trapWatch: '5G frekans ihalesi ve fiber altyapı CAPEX ödemelerinin olduğu dönemlerde nakit çıkışı takvimi izlenmelidir.',
      rawInputs: ['Faturalı Abone ARPU Artışı', 'Veri Merkezi & Paycell Büyümesi', '5G/Fiber CAPEX'],
      risesWhen: 'Tarife zamları bilançoya yansıyıp enflasyon düşmeye başladığında.',
      fallsWhen: 'Yüksek lisans/altyapı ihale ödemeleri gündeme geldiğinde.',
      relatedKeys: ['fon-tematik-teknoloji-zpt10', 'reel-yazilim-logo']
    },
    'bist-tursg': {
      shortDesc: 'Türkiye Sigorta (TURSG). Yüksek faiz mevsiminin en kârlı iş modeline sahip kamu destekli elementer sigorta lideri.',
      howItWorks: 'Warren Buffett’ın en sevdiği iş modelidir (Float): Milyonlarca kasko/konut/sağlık poliçesinden parayı bugün peşin toplar, hasar çıkana kadar bu dev nakit havuzunu %40+ TL faizinde çalıştırır!',
      expertEdge: 'Türkiye Sigorta Birliği (TSB) her ay tüm sigorta şirketlerinin "Aylık Brüt Prim Üretimini" yayınlar; çeyrek bilanço açıklanmadan ciro kuruşu kuruşuna bilinir!',
      trapWatch: 'Faiz indirim döngüsü hızlandığında finansal yatırım gelirinin tepe yapacağını ve büyük afet hasarlarını unutmamak.',
      rawInputs: ['TSB Aylık Prim Üretimi', 'TL Mevduat/Tahvil Faiz Oranı', 'Hasar/Prim (Bileşik) Oranı'],
      risesWhen: 'Poliçe fiyatları artarken TL faizleri yüksek kaldığında (çifte kazanç!).',
      fallsWhen: 'Faizler hızla indiğinde veya yedek parça/hasar maliyeti patladığında.',
      relatedKeys: ['mevduat-ust', 'kira-sertifikasi-sukuk', 'bist-ismen']
    },
    'bist-ismen': {
      shortDesc: 'İş Yatırım Menkul Değerler (ISMEN). Borsa işlem hacmi komisyonu ve kredili/VİOP teminat nemalandırmasından para basan finans devi.',
      howItWorks: 'Borsada kim kazanırsa kazansın gişeden geçen hacimden komisyon ve kullandırılan kredilerden yüksek faiz geliri toplar; güçlü temettü geleneği vardır.',
      expertEdge: 'Borsa İstanbul’un "Günlük Toplam İşlem Hacmi (Milyar ₺)" her akşam 18:10’da bellidir; hacim katlandığında ISMEN’in çeyrek kârı şimdiden yazılır!',
      trapWatch: 'Borsa işlem hacimlerinin kuruduğu yaprak kıpırdamayan dönemlerde komisyon ivmesi düşer.',
      rawInputs: ['BIST Günlük İşlem Hacmi & VİOP Hacmi', 'Kredili İşlem Faiz Oranı'],
      risesWhen: 'Borsa hacmi patladığında ve faiz nemalandırma geliri yüksekken.',
      fallsWhen: 'Borsada hacimler kuruyup yatırımcı ilgisi azaldığında.',
      relatedKeys: ['bist-100', 'bist-isctr', 'bist-temettu-25']
    },
    'bist-sise': {
      shortDesc: 'Şişecam (SISE). Düzcam, cam ambalaj ve ABD doğal soda külü yatırımlarıyla küresel sanayi devi.',
      howItWorks: 'Gelirinin yarıdan fazlası döviz ve yurt dışı operasyonlardandır; ancak cam fırınlarını 24 saat yakmak için yoğun doğalgaz ve elektrik tüketir.',
      expertEdge: 'Doğalgaz fiyatı düştüğünde ve Avrupa inşaat/otomotiv cam talebi döndüğünde marjları hızla açılır; ağır CAPEX dönemi bitişi izlenmelidir.',
      trapWatch: 'Avrupa inşaat durgunluğu, değerli TL ve yüksek doğalgaz maliyeti üçlüsü birleştiğinde yıllarca sabır sınayabilir.',
      rawInputs: ['Doğalgaz & Elektrik Fiyatı', 'Küresel Soda Külü ($/ton)', 'EUR/TRY & İnşaat/Otomotiv Talebi'],
      risesWhen: 'Enerji ucuzlayıp küresel inşaat/otomotiv ve soda külü fiyatları döndüğünde.',
      fallsWhen: 'Enerji maliyetleri yüksekken küresel cam ve soda talebi zayıf kaldığında.',
      relatedKeys: ['doviz-eur', 'bist-eregl', 'bist-sahol']
    },
    'bist-isctr': {
      shortDesc: 'Türkiye İş Bankası (ISCTR). Bankacılık gücünü Şişecam, Anadolu Sigorta ve İş Yatırım iştirak ekosistemiyle birleştiren finans kalesi.',
      howItWorks: 'Geniş mevduat tabanı ve ticari kredilerin yanında Şişecam ve finansal iştiraklerinden gelen dev özsermaye payıyla çift katmanlı değer taşır.',
      expertEdge: 'BDDK haftalık net faiz marjı (NIM) + iştiraklerinin toplam borsa değerinin İş Bankası PD/DD çarpanına göre iskontosu birlikte okunur.',
      trapWatch: 'Sıkı para politikasında mevduat fonlama maliyetinin kredi getirisini sıkıştırdığı çeyreklerde ROE baskılanabilir.',
      rawInputs: ['BDDK Haftalık Banka Verisi', 'Şişecam & Finans İştirak Değerleri', 'Türkiye CDS Primi'],
      risesWhen: 'Faiz indirim döngüsü başlarken ve iştirak değerlemesi güçlendiğinde.',
      fallsWhen: 'Sürpriz faiz artışı ve zorunlu karşılık sıkılaştırmasında.',
      relatedKeys: ['bist-garan', 'bist-akbnk', 'bist-sise', 'bist-ismen']
    },
    'bist-ykbnk': {
      shortDesc: 'Yapı ve Kredi Bankası (YKBNK). Kredi kartı komisyon liderliği ve güçlü ticari bankacılık ağıyla Koç Grubu bankası.',
      howItWorks: 'World kredi kartı ödeme ekosistemi sayesinde faiz dışı ücret ve komisyon gelirlerinin toplam kârdaki payı en yüksek özel bankalardan biridir.',
      expertEdge: 'TCMB haftalık kartlı harcama hacmi ve 2Y-10Y tahvil faiz düşüşü YKBNK komisyon ve tahvil portföyünü doğrudan besler.',
      trapWatch: 'Tüketici kredisi ve kredi kartı faiz tavanı/taksit kısıtlamalarında komisyon büyümesinin yavaşlaması.',
      rawInputs: ['Kredi Kartı Komisyon Hacmi', 'TCMB Politika Faizi', 'Takipteki Alacaklar (NPL)'],
      risesWhen: 'Dezenflasyon, faiz indirimi ve yabancı fon girişi hızlandığında.',
      fallsWhen: 'Tüketici kredilerinde batık oranı (NPL) yükseldiğinde.',
      relatedKeys: ['bist-kchol', 'bist-garan', 'bist-akbnk']
    },
    'bist-vakbn': {
      shortDesc: 'VakıfBank (VAKBN). Kamu mevduat tabanı, KOBİ/ticari kredi hacmi ve düşük fiili dolaşım oranıyla büyük kamu bankası.',
      howItWorks: 'Kamu kurumları mevduatı ve geniş ticari kredi portföyüyle çalışır; Türkiye Varlık Fonu payı nedeniyle fiili dolaşım oranı sınırlıdır.',
      expertEdge: 'Kamu bankalarında kredi büyüme temposu ile çekirdek Net Faiz Marjı (Swap düzeltmeli NIM) ve ROE > TÜFE eşiği takip edilir.',
      trapWatch: 'Kamu görev zararı veya düşük faizli sübvanse kredi kampanyalarında kâr marjının özel bankaların gerisinde kalması.',
      rawInputs: ['BDDK Kamu Bankaları Net Kârı', 'Hazine Tahvil Portföyü', 'TCMB Fonlama Maliyeti'],
      risesWhen: 'Tahvil faizleri düşüp fonlama maliyeti ucuzladığında.',
      fallsWhen: 'Mevduat faizi yarışında fonlama maliyeti şiştiğinde.',
      relatedKeys: ['bist-halkb', 'bist-garan', 'dibs-tahvil']
    },
    'bist-halkb': {
      shortDesc: 'Halkbank (HALKB). Esnaf ve KOBİ finansmanının ana kamu bankası; düşük dolaşım ve uluslararası hukuki dosya katalizörlü.',
      howItWorks: 'Esnaf kefalet ve KOBİ kredilerinin merkezidir; bilançosunun yanında uluslararası hukuki sürecin seyri hisse üzerinde sert oynaklık yaratır.',
      expertEdge: 'Salt PD/DD ucuzluğuna değil, özsermaye kârlılığına (ROE) ve uluslararası hukuki dosya takvimine bakılarak risk boyutu sınırlandırılır.',
      trapWatch: 'Manşet haber coşkusuyla tavandan atlayıp düşük çekirdek kârlılığı göz ardı etmek.',
      rawInputs: ['KOBİ Kredi-Mevduat Makası', 'Uluslararası Hukuki Dosya Akışı', 'TCMB Faizi'],
      risesWhen: 'Fonlama maliyeti düştüğünde veya hukuki belirsizlik azaldığında.',
      fallsWhen: 'Düşük ROE ve hukuki erteleme haberlerinde.',
      relatedKeys: ['bist-vakbn', 'bist-banka']
    },
    'bist-tskb': {
      shortDesc: 'Türkiye Sınai Kalkınma Bankası (TSKB). Mevduat toplamayan, Dünya Bankası/Avrupa döviz fonlarıyla sanayi ve yeşil enerji kredisi veren yatırım bankası.',
      howItWorks: 'Şube ağı ve mevduat faizi yarışı yoktur! Uluslararası kalkınma kuruluşlarından uzun vadeli döviz kredisi bulup Türk sanayicisine yatırım kredisi olarak kullandırır.',
      expertEdge: 'Mevduat savaşına girmediği için yüksek TL mevduat faizi dönemlerinde bile Net Faiz Marjını (NIM) ve yüksek ROE kalitesini koruyan özel bir iş modelidir.',
      trapWatch: 'Sanayi yatırımlarının (CAPEX) tamamen durduğu veya kur şokunun döviz borçlu müşterileri zorladığı dönemler.',
      rawInputs: ['Kalkınma Fonu Döviz Maliyeti', 'Sanayi & Yeşil Enerji Yatırım İştahı', 'ISCTR İştirak Bağı'],
      risesWhen: 'Yeşil dönüşüm ve sanayi yatırım kredileri büyürken ROE enflasyonu aştığında.',
      fallsWhen: 'Ülke CDS primi fırlayıp dış finansman pahalandığında.',
      relatedKeys: ['bist-isctr', 'bist-garan']
    },
    'bist-ttkom': {
      shortDesc: 'Türk Telekom (TTKOM). Türkiye’nin sabit fiber internet omurgası ve mobil operatör devi; imtiyaz uzatımı ve ARPU büyüme hikayesi.',
      howItWorks: '81 ildeki fiber altyapının ana sahibidir. Enflasyon düşerken geriden gelen 12–24 aylık abone taahhüt yenilemeleri kasaya güçlü VUK/OCF nakdi pompalamaya başlar.',
      expertEdge: 'Sabit genişbant imtiyaz uzatımı şartları, 5G takvimi ve döviz borç hedge (korunma) oranı bilançonun üç anahtarıdır.',
      trapWatch: 'İmtiyaz bedeli ve 5G lisans ödemelerinin nakit akışı ve temettü kapasitesine etkisini hesaplamamak.',
      rawInputs: ['Fiber & Mobil Abone ARPU Artışı', 'İmtiyaz & 5G Lisans Ödemeleri', 'USD/EUR Borç Korunması'],
      risesWhen: 'Tarife zamları enflasyonu geçip imtiyaz belirsizliği kalktığında.',
      fallsWhen: 'Sert kur şoku veya ağır lisans CAPEX çıkışı yaşandığında.',
      relatedKeys: ['bist-tcell', 'fon-tematik-teknoloji-zpt10']
    },
    'bist-ccola': {
      shortDesc: 'Coca-Cola İçecek (CCOLA). Türkiye, Pakistan, Özbekistan, Kazakistan ve Irak dahil 12 ülkede 600+ milyon nüfusa satış yapan bölgesel içecek devi.',
      howItWorks: 'Gelirinin yarıdan fazlası yurt dışı operasyonlardan gelir; sıcak yaz aylarında ünite kasa hacmi ve fiyatlama gücüyle güçlü faaliyet nakdi (OCF) üretir.',
      expertEdge: 'Şeker, alüminyum kutu ve PET reçine hammadde fiyatları düştüğünde brüt kâr marjı sessizce genişler; çeyreklik ünite kasa hacmi KAP’ta önceden açıklanır!',
      trapWatch: 'Pakistan/Orta Asya para birimi devalüasyonları veya bölgesel tüketici boykotu/alım gücü düşüşü.',
      rawInputs: ['Şeker, Alüminyum & PET Reçine Fiyatı', 'Ünite Kasa Satış Hacmi', 'Asya & Türkiye Kur Dengesi'],
      risesWhen: 'Yaz sıcakları yüksek, hammadde ucuz ve Asya pazarları büyüdüğünde.',
      fallsWhen: 'Hammadde maliyeti artarken tüketici hacmi daraldığında.',
      relatedKeys: ['bist-aefes', 'bist-aghol', 'emtia-tarim-dba']
    },
    'bist-aefes': {
      shortDesc: 'Anadolu Efes (AEFES). Hem kendi içecek operasyonları hem de Coca-Cola İçecek’teki (%50,3) dev ortaklığıyla çarpan iskontolu içecek holdingi.',
      howItWorks: 'Yurt içi/uluslararası bira operasyonları yanında kasasında CCOLA’nın yarısını taşır; çoğu zaman sadece elindeki CCOLA payı bile AEFES piyasa değerine yaklaşır!',
      expertEdge: 'Uzman "Parçaların Toplamı (SOTP)" hesabı yapar: AEFES Piyasa Değeri eksi (%50,3 × CCOLA Piyasa Değeri) farkı, bira operasyonlarının ne kadar ucuza geldiğini gösterir.',
      trapWatch: 'Rusya/BDT operasyonlarındaki jeopolitik ve nakit transferi (temettü çıkışı) kısıtlamaları.',
      rawInputs: ['CCOLA Piyasa Değeri', 'Arpa/Malt & Alüminyum Maliyeti', 'Uluslararası Operasyon Nakit Akışı'],
      risesWhen: 'CCOLA yükselirken SOTP iskontosu kapandığında ve turizm güçlü gittiğinde.',
      fallsWhen: 'Yurt dışı jeopolitik varlık kısıtlamaları veya ÖTV zamları hacmi vurduğunda.',
      relatedKeys: ['bist-ccola', 'bist-aghol']
    },
    'bist-ulker': {
      shortDesc: 'Ülker Bisküvi (ULKER). Türkiye, Mısır, Suudi Arabistan ve Orta Asya’da pazar lideri atıştırmalık üreticisi.',
      howItWorks: 'Bisküvi ve çikolatayı güçlü marka sadakatiyle satar; ancak en kritik iki değişkeni kakao/buğday hammadde maliyeti ve açık döviz borç pozisyonunun hedge oranıdır!',
      expertEdge: 'Dünya Kakao ($/ton) fiyatındaki düşüş ve şirketin Euro/Dolar borcunu vadeli türevle kapatma oranı net kârı doğrudan belirler.',
      trapWatch: 'Kakao fiyatları fırlarken kur şokuyla açık döviz borcundan finansman zararı yazılan çeyrekler.',
      rawInputs: ['Dünya Kakao, Buğday & Şeker Fiyatı', 'Döviz Borç Hedge Oranı', 'TCMB Market POS Verisi'],
      risesWhen: 'Kakao ucuzlayıp döviz borcu azaldığında ve faaliyet nakdi güçlendiğinde.',
      fallsWhen: 'Kakao ve finansman giderleri brüt kârı erittiğinde.',
      relatedKeys: ['emtia-tarim-dba', 'reel-perakende-bimas', 'bist-sokm']
    },
    'bist-sokm': {
      shortDesc: 'Şok Marketler (SOKM). 10.900+ mahalle mağazası ve Cepte Şok ağıyla peşin çalışan indirim gıda perakendecisi.',
      howItWorks: 'BİM gibi negatif işletme sermayesiyle (müşteriden peşin al, tedarikçiye vadeli öde) çalışır; temel mutfak sepetine odaklanır.',
      expertEdge: 'BİM ve Migros’a kıyasla FD/Satışlar ve PD/DD çarpan farkı ile asgari ücret/kira giderlerinin faaliyet marjına etkisi izlenir.',
      trapWatch: 'Düşük faaliyet marjlı (%1–3) perakendede personel ve elektrik gideri ciro büyümesini aşarsa net kâr hızla daralabilir.',
      rawInputs: ['TCMB Haftalık Market POS Cirosu', 'Gıda Enflasyonu', 'Asgari Ücret & Mağaza Kira Artışı'],
      risesWhen: 'Sepet büyümesi maliyet enflasyonunun üzerine çıktığında.',
      fallsWhen: 'Maliyet artışı rafa tam yansıtılamadığında.',
      relatedKeys: ['reel-perakende-bimas', 'reel-perakende-mgros', 'girisim-gozde']
    },
    'bist-mavi': {
      shortDesc: 'Mavi Giyim (MAVI). Fason tekstilci değil; "Net Nakit" kasalı, güçlü marka fiyatlama gücüne sahip perakende ve denim lideri.',
      howItWorks: 'Kendi markasıyla AVM ve online kanalda peşin/kredi kartıyla satış yapar; borçsuz bilançosu ve yüksek ROIC oranıyla tekstil sektöründen tamamen ayrışır!',
      expertEdge: 'Her Perşembe TCMB "Haftalık Kredi Kartı Giyim ve Aksesuar Harcamaları" verisi MAVI’nin çeyrek cirosunu 45 gün önceden söyler!',
      trapWatch: 'Tüketici alım gücünün sert daraldığı veya sıcak kış/serin bahar mevsim kaymalarında stok devir hızının yavaşlaması.',
      rawInputs: ['TCMB Haftalık Giyim POS Verisi', 'Pamuk Fiyatı', 'AVM Trafiği & Online Satış'],
      risesWhen: 'Birebir mağaza (LFL) büyümesi enflasyonu geçip kasadaki net nakit büyüdüğünde.',
      fallsWhen: 'İç tüketim ve kredi kartı harcamaları sert fren yaptığında.',
      relatedKeys: ['reel-perakende-bimas', 'halka-arz-rgyas']
    },
    'bist-arclk': {
      shortDesc: 'Arçelik / Beko Europe (ARCLK). Whirlpool Avrupa birleşmesiyle Avrupa’nın hacim lideri beyaz eşya ve teknoloji devi.',
      howItWorks: 'Gelirinin büyük çoğunluğu Avrupa ve küresel pazarlardan Euro/Döviz bazında gelir; ancak birleşme sonrası artan Net Borç/FAVÖK ve Avrupa entegrasyon sinerjisi kritik eşiktir.',
      expertEdge: 'ECB (Avrupa) faiz indirimleriyle Avrupa konut/beyaz eşya yenileme döngüsünün dönmesi, EUR/USD yükselişi ve çelik/bakır/plastik düşüşü marjı açar!',
      trapWatch: 'Yüksek Net Borç / FAVÖK (>3.5x) taşırken finansman giderinin faaliyet kârını yuttuğu dönemlerde erken sabırsızlık.',
      rawInputs: ['Yassı Çelik, Bakır & Plastik Fiyatı', 'EUR/USD Paritesi & Avrupa Talebi', 'Net Borç / FAVÖK Oranı'],
      risesWhen: 'Avrupa talebi canlanıp birleşme tasarrufları serbest nakde döndüğünde.',
      fallsWhen: 'Avrupa durgunluğu ve yüksek faiz gideri üst üste bindiğinde.',
      relatedKeys: ['bist-kchol', 'doviz-eur', 'bist-eregl']
    },
    'bist-vesbe': {
      shortDesc: 'Vestel Beyaz Eşya (VESBE). Manisa’daki dev tesislerden ağırlıkla Avrupa’ya ihracat yapan beyaz eşya üreticisi.',
      howItWorks: 'Üretiminin büyük bölümünü ihraç eder; hammadde (sac/plastik) ve EUR/TRY dengesiyle çalışır, ancak ana ortağı Vestel Elektronik ile grup içi alacak/borç ilişkisi yakından izlenmelidir!',
      expertEdge: 'TÜRKBES aylık beyaz eşya ihracat verisi yanında bilançoda "İlişkili Taraflardan Ticari Olmayan Alacaklar" satırı mutlaka kontrol edilir!',
      trapWatch: 'Fabrika kâr etse bile kasadaki nakdin borçlu grup şirketine aktarılması (ilişkili taraf riski) ve Avrupa durgunluğu.',
      rawInputs: ['TÜRKBES İhracat Adetleri', 'EUR/TRY & Çelik Sac', 'Grup İçi Nakit Akışı'],
      risesWhen: 'İhracat marjları açılıp serbest nakit doğrudan kasada kaldığında.',
      fallsWhen: 'Avrupa talebi daralıp grup borçluluğu baskı yarattığında.',
      relatedKeys: ['bist-arclk', 'doviz-eur']
    },
    'bist-doas': {
      shortDesc: 'Doğuş Otomotiv (DOAS). Volkswagen, Audi, Porsche, Skoda ve Scania Türkiye distribütörü; yüksek temettü verimli ithalat/dağıtım kasası.',
      howItWorks: 'Fabrika kurma (ağır CAPEX) yükü taşımadan dünyanın en güçlü otomotiv markalarını ithal edip satar ve TÜVTÜRK araç muayene ortaklığından nakit toplar.',
      expertEdge: 'Her ayın 2. iş günü açıklanan "ODMD Aylık Marka Bazlı Araç Satışları" DOAS’ın çeyrek cirosunu günü gününe gösterir!',
      trapWatch: 'Döngüsel tepe tuzağı: Araç bulunamayan rekor marj yıllarında F/K 2–3x görünür; kredi sıkılaşıp kampanya savaşı başladığında marjlar hızla normalleşir!',
      rawInputs: ['ODMD Aylık VW/Skoda/Audi Satışları', 'Taşıt Kredisi & ÖTV Dilimleri', 'EUR/TRY Kuru'],
      risesWhen: 'İç pazar araç talebi güçlü olup düzenli yüksek temettü dağıttığında.',
      fallsWhen: 'Yüksek faiz ve ÖTV/ithal rekabeti distribütör marjını daralttığında.',
      relatedKeys: ['bist-froto', 'bist-toaso', 'bist-temettu-25']
    },
    'bist-ttrak': {
      shortDesc: 'TürkTraktör (TTRAK). Türkiye traktör pazarının açık ara lideri ve New Holland/Case IH küresel ihracat üssü (Koç & CNH ortaklığı).',
      howItWorks: 'Anadolu çiftçisinin mahsul geliri ve Ziraat Bankası sübvansiyonlu tarım kredisi musluğu açık olduğunda yüksek ROIC ve temettü üreten sanayi klasiğidir.',
      expertEdge: 'Şirket her ay KAP’a "Aylık Üretim ve Yurt İçi/İhracat Satış Adetlerini" gönderir! Çeyrek bitmeden fabrika performansı şeffafça okunur.',
      trapWatch: 'Tarım kredisi faizlerinin yükseldiği ve kuraklığın çiftçi gelirini vurduğu döngüsel daralma yıllarında tepe çarpandan girmek.',
      rawInputs: ['Aylık Traktör Satış Adetleri (KAP)', 'Sübvanse Tarım Kredisi Faizleri', 'Tarımsal Rekolte & İhracat'],
      risesWhen: 'Tarım destek kredileri açılıp aylık traktör satış adetleri dipten döndüğünde.',
      fallsWhen: 'Çiftçi kredi erişimi sıkışıp iç pazar adetleri gerilediğinde.',
      relatedKeys: ['bist-kchol', 'bist-froto', 'emtia-tarim-dba']
    },
    'bist-otkar': {
      shortDesc: 'Otokar (OTKAR). Zırhlı kara savunma araçları (Cobra, Arma, Tulpar) ve ticari otobüs ihracatçısı Koç Topluluğu savunma şirketi.',
      howItWorks: 'Savunma ihaleleri uzun hazırlık sürer ama Romanya/Avrupa/Orta Doğu zırhlı araç sözleşmeleri imzalandığında milyarlarca dolarlık yıllara sari döviz backlog’u yaratır.',
      expertEdge: 'Yeni imzalanan ihracat sözleşmelerinin teslimat takvimi ve alınan sipariş avanslarının işletme sermayesini rahatlatması izlenir.',
      trapWatch: 'Teslimatların yılın son çeyreğine (4Ç) yığılması nedeniyle ara çeyreklerdeki geçici zayıflığa aldanmak veya yüksek kısa vadeli borç faizi.',
      rawInputs: ['Uluslararası Zırhlı Araç İhaleleri', 'EUR/USD İhracat Tahsilatı', 'Ar-Ge & İşletme Sermayesi'],
      risesWhen: 'Büyük ihracat zırhlı araç teslimatları faturaya ve nakde dönüştüğünde.',
      fallsWhen: 'İhale süreçleri uzayıp finansman gideri arttığında.',
      relatedKeys: ['bist-asels', 'bist-kchol', 'bist-froto']
    },
    'bist-egeen': {
      shortDesc: 'Ege Endüstri (EGEEN). Kuzey Amerika ve Avrupa ağır ticari kamyon devlerine yüksek marjlı dingil ve aks ihraç eden niş sanayi kalesi.',
      howItWorks: 'Gelirinin neredeyse tamamı Dolar/Euro ihracattır; İzmir serbest bölge ve yeni fabrika yatırımıyla yüksek katma değerli ağır vasıta parçası üretir.',
      expertEdge: 'ABD "ACT Research Class-8 Ağır Kamyon Siparişleri" ve TÜİK İzmir otomotiv yan sanayi GTİP gümrük tonajı bilançoyu 45 gün önceden haber verir!',
      trapWatch: 'ABD ve Avrupa ağır kamyon döngüsü yavaşlarken yeni fabrika geçiş maliyetlerinin geçici marj baskısı yaratması.',
      rawInputs: ['ABD Class-8 Kamyon Siparişleri', 'USD/TRY & EUR/TRY', 'Döküm Çelik & Enerji'],
      risesWhen: 'Kuzey Amerika kamyon siparişleri artıp yeni fabrika tam kapasiteye geçtiğinde.',
      fallsWhen: 'Küresel ağır vasıta pazarı daraldığında.',
      relatedKeys: ['bist-froto', 'doviz-usd', 'doviz-eur']
    },
    'bist-isdmr': {
      shortDesc: 'İskenderun Demir ve Çelik (ISDMR). Akdeniz liman avantajına sahip entegre yassı ve uzun çelik üreticisi (OYAK / EREGL iştiraki).',
      howItWorks: 'Bilançosunu Dolar bazında tutar; Erdemir grubunun güney liman üretim üssüdür ve çelik marjları açıldığında yüksek temettü potansiyeli taşır.',
      expertEdge: 'HRC sıcak sac fiyatı ile demir cevheri/kok kömürü makası ($/ton FAVÖK) ve %5 gibi çok sınırlı MKK fiili dolaşım oranı takip edilir.',
      trapWatch: 'Sınırlı dolaşım nedeniyle EREGL’ye kıyasla PD/DD primi açıldığında güvenlik marjını kontrol etmeden almak.',
      rawInputs: ['HRC Çelik Fiyatı ($/ton)', 'Demir Cevheri & Kok Kömürü', 'Dolar / TL Kuru'],
      risesWhen: 'Ton başına dolar FAVÖK 100 $ üzerine toparlandığında.',
      fallsWhen: 'Çin çelik arz fazlası küresel fiyatları ezdiğinde.',
      relatedKeys: ['bist-eregl', 'bist-krdmd']
    },
    'bist-krdmd': {
      shortDesc: 'Kardemir D (KRDMD). Türkiye’nin tek milli demiryolu rayı, tren tekeri ve inşaat/profil uzun çelik entegre üreticisi.',
      howItWorks: 'Yassı çelik üreten EREGL’den farklı olarak inşaat demiri, profil, demiryolu rayı ve yük vagonu tekeri üretir; kentsel dönüşüm ve demiryolu yatırımlarından beslenir.',
      expertEdge: 'A, B ve D grubu paylar arasındaki fiyat/oy hakkı farkı (KRDMA/KRDMB/KRDMD) ve hurda-cevher maliyet makası uzmanların takip ettiği arbitraj alanıdır!',
      trapWatch: 'İnşaat şantiyelerinin yüksek faizle durduğu ve Çin’in ucuz kütük demir sattığı kış döngüsü.',
      rawInputs: ['İnşaat Demiri & Kütük Fiyatı ($/ton)', 'Kok Kömürü & Demir Cevheri', 'TCDD Ray/Teker Siparişleri'],
      risesWhen: 'Kentsel dönüşüm, altyapı ve küresel çelik fiyatları canlandığında.',
      fallsWhen: 'Yüksek faiz inşaat talebini kestiğinde.',
      relatedKeys: ['bist-eregl', 'bist-oyakc', 'bist-cimsa']
    },
    'bist-brsan': {
      shortDesc: 'Borusan Birleşik Boru (BRSAN). ABD enerji/petrol kuyusu hat boruları ve küresel altyapı çelik boru ihracatçısı.',
      howItWorks: 'ABD’deki yerel tesisleri (Berg Pipe satın alması dahil) sayesinde Amerikan enerji, doğalgaz ve su boru hattı ihalelerinden doğrudan Dolar ciro üretir.',
      expertEdge: 'ABD aktif petrol/gaz sondaj kule sayısı (Baker Hughes Rig Count) ve büyük boru hattı ihale KAP bildirimleri ana öncü göstergesidir.',
      trapWatch: 'Dev boru hattı projesi teslimatları bittiğinde bir sonraki büyük ihaleye kadar baz etkisinden doğan marj normalleşmesi.',
      rawInputs: ['ABD Enerji Boru Hattı İhaleleri', 'HRC Rulo Sac Fiyatı', 'USD/TRY'],
      risesWhen: 'Kuzey Amerika enerji altyapı siparişleri büyüdüğünde.',
      fallsWhen: 'Petrol/gaz sondaj yatırımları yavaşlayıp çelik fiyatları gerilediğinde.',
      relatedKeys: ['bist-eregl', 'emtia-petrol-bno', 'doviz-usd']
    },
    'bist-oyakc': {
      shortDesc: 'OYAK Çimento (OYAKC). Türkiye’nin en yaygın fabrika ağına ve güçlü net nakit kasasına sahip çimento pazar lideri (TCC ortaklığı).',
      howItWorks: 'Marmara’dan Akdeniz ve Güneydoğu’ya uzanan tesisleriyle kentsel dönüşüm ve altyapı projelerine çimento verir; kasası borçsuz ve yüksek nakit üretimli çalışır.',
      expertEdge: 'Petrokok ve elektrik fiyatları düştüğünde fırın yakıt maliyeti ucuzlar, FAVÖK marjı %30+ seviyelerine tırmanır!',
      trapWatch: 'Deprem/yeniden inşa zirve hacmi tamamlandıktan sonra konut ruhsatlarının yüksek faizle yavaşladığı dönemler.',
      rawInputs: ['Petrokok & Sanayi Elektriği Fiyatı', 'Kentsel Dönüşüm & Konut Ruhsatları', 'Hazır Beton Talebi'],
      risesWhen: 'Enerji maliyeti düşük, altyapı dökümleri yüksek ve faiz indirim döngüsü başlarken.',
      fallsWhen: 'Şantiyeler yavaşlayıp enerji faturası şiştiğinde.',
      relatedKeys: ['bist-cimsa', 'gayrimenkul-konut-ekgyo', 'bist-krdmd']
    },
    'bist-cimsa': {
      shortDesc: 'Çimsa (CIMSA). Dünyanın lider "Beyaz Çimento" ve yüksek marjlı Kalsiyum Alüminat (CAC) yapı malzemeleri ihracatçısı (Sabancı Grubu).',
      howItWorks: 'Sıradan gri çimentodan farklı olarak ABD, İspanya ve İrlanda operasyonları (Mannok dahil) ile döviz bazlı katma değerli özel yapı kimyasalları ve beyaz çimento satar.',
      expertEdge: 'Mersin limanından yapılan beyaz çimento/CAC ihracatı ve ABD/Avrupa tesislerinin döviz FAVÖK katkısı yerel inşaat durgunluğuna karşı kalkan sağlar.',
      trapWatch: 'Yurt dışı satın almalar (Mannok vb.) sonrası geçici artan Net Borç/FAVÖK oranının erime hızını izlememek.',
      rawInputs: ['Petrokok & Enerji Maliyeti', 'ABD & Avrupa Yapı Malzemeleri Talebi', 'EUR/USD & USD/TRY'],
      risesWhen: 'Küresel inşaat döngüsü dönüp döviz bazlı CAC marjları genişlediğinde.',
      fallsWhen: 'Enerji fiyatları fırlayıp küresel inşaat yavaşladığında.',
      relatedKeys: ['bist-sahol', 'bist-oyakc', 'doviz-eur']
    },
    'bist-petkm': {
      shortDesc: 'PETKİM Petrokimya (PETKM). Aliağa’da naftayı işleyip plastik, ambalaj ve kimya hammaddesi üreten entegre tesis; STAR Rafineri ortağı.',
      howItWorks: 'Kârlılığını petrol fiyatı değil, küresel "Etilen – Nafta Makası ($/ton)" ve ortağı olduğu dev STAR Rafinerisi’nden gelen temettü/hammadde sinerjisi belirler.',
      expertEdge: 'Platts Etilen-Nafta spreadi 150–200 $/ton diplerinden 350+ $/ton bandına döndüğünde petrokimya kışının bittiği anlaşılır!',
      trapWatch: 'Asya ve Orta Doğu’daki dev yeni petrokimya tesisleri yüzünden küresel marjlar dipteyken "PD/DD düşük" diye erken ve kredili yakalanmak.',
      rawInputs: ['Etilen - Nafta Petrokimya Marjı ($/ton)', 'STAR Rafineri Hammadde & Kâr Payı', 'Doğalgaz Maliyeti'],
      risesWhen: 'Küresel petrokimya makasları dipten dönüp STAR Rafineri katkısı büyüdüğünde.',
      fallsWhen: 'Etilen-Nafta makası başabaşın altına çöküp stok zararı oluştuğunda.',
      relatedKeys: ['bist-tuprs', 'bist-sasa', 'emtia-petrol-bno']
    },
    'bist-aygaz': {
      shortDesc: 'Aygaz (AYGAZ). LPG tüpgaz/otogaz dağıtım nakit makinesi + TÜPRAŞ dolaylı ortaklığı + Bangladeş ve Sendeo büyüme kolları.',
      howItWorks: 'Hem kendi istasyon ve tüpgaz ağından düzenli nakit üretir hem de Enerji Yatırımları A.Ş. üzerinden TÜPRAŞ’ta dolaylı pay taşır!',
      expertEdge: 'AYGAZ piyasa değerinin içindeki dolaylı TÜPRAŞ payı düşüldüğünde kalan LPG ve Bangladeş operasyonlarının neredeyse bedavaya gelip gelmediği hesaplanır.',
      trapWatch: 'Kış mevsimi ılık geçtiğinde ısınma/tüpgaz hacminin ve stok değerlemesinin zayıf kalması.',
      rawInputs: ['TÜPRAŞ Performansı & Temettüsü', 'Cezayir Sonatrach LPG Fiyatı', 'Otogaz Tüketimi'],
      risesWhen: 'TÜPRAŞ güçlü temettü ödediğinde ve LPG dağıtım marjları açıldığında.',
      fallsWhen: 'LPG stok zararı veya rafineri marj daralması yaşandığında.',
      relatedKeys: ['bist-tuprs', 'bist-kchol']
    },
    'bist-enjsa': {
      shortDesc: 'Enerjisa Enerji (ENJSA). Başkent, Ayedaş ve Toroslar bölgelerinde 22+ milyon nüfusa elektrik dağıtan, enflasyon endeksli nakit kalesi.',
      howItWorks: 'Elektrik üretmez; elektrik dağıtım şebekesini işletir! Geliri EPDK tarafından TÜFE enflasyonuna ve Düzenlenmiş Varlık Tabanına (DVT) endekslidir; düzenli temettü öder.',
      expertEdge: 'Şebekeye yaptığı her trafo/kablo yatırımı (CAPEX) EPDK’dan enflasyon + reel getiri garantili geri ödeme hakkı doğurur; yüksek faiz inerken finansman yükü hızla hafifler.',
      trapWatch: 'Yüksek faiz zirvesinde şebeke yatırımlarını fonlamak için kullanılan tahvil/kredi faizlerinin serbest nakdi geçici baskılaması.',
      rawInputs: ['EPDK Reel Makul Getiri Oranı & TÜFE', 'Tahvil/Kredi Faiz Maliyeti', 'Elektrik Tüketim Hacmi'],
      risesWhen: 'Faizler düşüşe geçip şebeke varlık tabanı enflasyonla büyüdüğünde.',
      fallsWhen: 'Borçlanma faizi EPDK getiri oranının çok üzerine çıktığında.',
      relatedKeys: ['bist-sahol', 'reel-enerji-astor', 'kira-sertifikasi-sukuk']
    },
    'bist-aksen': {
      shortDesc: 'Aksa Enerji (AKSEN). Özbekistan, Gana, Mali ve Türkiye’de Dolar/Euro garantili elektrik santralleri işleten küresel enerji üreticisi.',
      howItWorks: 'Yurt içinde spot elektrik fiyatına mahkûm kalmak yerine Afrika ve Orta Asya’da devlet garantili Dolar bazlı "Al ya da Öde" kapasite anlaşmalarıyla santral kurar.',
      expertEdge: 'Yurt dışı Dolar garantili santrallerin toplam FAVÖK içindeki payı (%70+) ve Özbekistan/Afrika yeni santral devreye giriş tarihleri izlenir.',
      trapWatch: 'Yeni yurt dışı santral kurulumları sırasında artan yatırım borcu (Net Borç/FAVÖK) ve gelişen ülke tahsilat gecikmeleri.',
      rawInputs: ['Dolar Garantili Yurt Dışı Santral Kapasitesi', 'EPİAŞ Yurt İçi PTF Fiyatı', 'USD/TRY'],
      risesWhen: 'Yeni döviz garantili santraller devreye girip borç erimeye başladığında.',
      fallsWhen: 'Yurt içi elektrik tavan fiyatı düşük kalıp yatırım borcu şiştiğinde.',
      relatedKeys: ['bist-enjsa', 'bist-alark', 'doviz-usd']
    },
    'bist-alark': {
      shortDesc: 'Alarko Holding (ALARK). Elektrik üretimi/dağıtımı (Meram) nakdini dev modern jeotermal sera tarımı ve havacılık dönüşümüne yatıran holding.',
      howItWorks: 'İthal kömür santrali (Cenal) ve elektrik dağıtımından kazandığı sermayeyi binlerce dönüm topraksız modern sera tarımı ve uçak dönüşüm tesislerine aktarır.',
      expertEdge: 'EPİAŞ’ta Cenal Karabiga santralinin günlük elektrik üretimi ve API2 ithal kömür maliyeti makası (Dark Spread) anlık hesaplanabilir!',
      trapWatch: 'Elektrik PTF fiyatları düşükken kömür maliyeti yüksek kaldığında enerji kolunun kâr düşüşü.',
      rawInputs: ['EPİAŞ PTF Elektrik vs İthal Kömür Makası', 'Tarımsal Sera Hektar Kapasitesi', 'Solo Net Nakit'],
      risesWhen: 'Elektrik marjları toparlanıp yeni tarım/havacılık yatırımları FAVÖK üretmeye başladığında.',
      fallsWhen: 'PTF elektrik fiyatları reel olarak gerilediğinde.',
      relatedKeys: ['bist-aksen', 'bist-kchol', 'emtia-tarim-dba']
    },
    'bist-dohol': {
      shortDesc: 'Doğan Holding (DOHOL). Solo kasası yüz milyonlarca dolar net nakit dolu; yenilenebilir enerji (Galata Wind), sigorta (Hepiyi), maden ve sanayi holdingi.',
      howItWorks: 'Medyadan tamamen çıkıp kasadaki dev döviz nakdini Hepiyi Sigorta, Gümüştaş Madencilik, Karel ve Galata Wind gibi nakit üreten sektörlere yönlendirmiştir.',
      expertEdge: 'Yüksek Net Aktif Değer (NAD) iskontosu + solo holding kasasındaki yüz milyonlarca dolarlık hazır nakit zırhı en güçlü güvenlik marjıdır.',
      trapWatch: 'Teknoloji/otomotiv yan kollarındaki döngüsel yavaşlama dönemlerinde holding iskontosunun geç kapanması.',
      rawInputs: ['Solo Holding Döviz Nakit Kasası', 'Hepiyi Sigorta & Maden Kârları', 'NAD İskontosu'],
      risesWhen: 'Maden halka arzı/büyümesi, sigorta float kârı ve hisse geri alımları hızlandığında.',
      fallsWhen: 'Holding iskontoları genel piyasayla birlikte açıldığında.',
      relatedKeys: ['bist-kchol', 'bist-sahol', 'gram-altin-spot']
    },
    'bist-mpark': {
      shortDesc: 'MLP Care — Medical Park & Liv Hospital (MPARK). Türkiye’nin en yaygın özel hastane zinciri; güçlü faaliyet nakdi ve hisse geri alım disiplini.',
      howItWorks: 'İnsanlar ekonomik durgunlukta bile sağlığını ertelemez! Tamamlayıcı Sağlık Sigortası (TSS) abone patlaması ve sağlık turizmi döviz geliriyle hastanelerini doldurur.',
      expertEdge: 'Özel sağlık sigortası (TSS) poliçe sayısındaki artış, SUT/TTB fiyat güncellemeleri ve şirketin agresif pay geri alım programı MPARK’ın motorudur.',
      trapWatch: 'Doktor ve sağlık personeli ücret enflasyonunun hasta başı ciro artışını aştığı geçiş çeyrekleri.',
      rawInputs: ['Tamamlayıcı Sağlık Sigortası (TSS) Hacmi', 'Sağlık Turizmi Döviz Geliri', 'Hisse Geri Alımları'],
      risesWhen: 'Hasta trafiği ve fiyat güncellemeleriyle güçlü Serbest Nakit Akışı (FCF) ürettiğinde.',
      fallsWhen: 'Personel maliyeti artışı tarife güncellemesini geçtiğinde.',
      relatedKeys: ['bist-selec', 'bist-tursg']
    },
    'bist-selec': {
      shortDesc: 'Selçuk Ecza Deposu (SELEC). Türkiye’deki her 10 kutu ilaçtan yaklaşık 4’ünü eczanelere dağıtan net nakit kasalı ilaç dağıtım devi.',
      howItWorks: 'İlaç fabrikalarından ilacı toplu alıp Türkiye genelindeki binlerce eczaneye günlük dağıtır; borçsuz net nakit kasası ve savunmacı iş modeliyle çalışır.',
      expertEdge: 'Resmi Gazete’de yılda 1–2 kez yayımlanan "İlaç Fiyat Kararnamesi (Euro Referans Kuru Zammı)" öncesi stok kârı ve ciro sıçraması en net takvim sinyali­dir!',
      trapWatch: 'İlaç Euro kuru zammı beklentisiyle zirveye çıkmış tahtaya karar açıklandığı sabah ("beklenti bitti" satışında) atlamak.',
      rawInputs: ['Resmi İlaç Euro Referans Kuru Kararı', 'Eczane Kutu İlaç Hacmi', 'Kasadaki Net Nakit Faizi'],
      risesWhen: 'İlaç Euro kuru güncellemesi yaklaştığında ve nakit kasası faiz yazdığında.',
      fallsWhen: 'İlaç zam takvimi ertelendiğinde marjlar geçici daraldığında.',
      relatedKeys: ['bist-mpark', 'doviz-eur']
    },
    'bist-gubrf': {
      shortDesc: 'Gübre Fabrikaları (GUBRF). Tarım Kredi iştiraki gübre üreticisi (Razi İran dahil) + Söğüt Altın Madeni rezerv hikayesi.',
      howItWorks: 'İki ayrı motoru vardır: 1) Türkiye ve İran (Razi) tarımsal gübre üretimi, 2) Bilecik Söğüt Altın Madeni’nden çıkarılan saf altın cevheri!',
      expertEdge: 'Hisseyi sadece gübre çarpanıyla değil, Söğüt Altın Madeni yıllık ons üretim kapasitesi × Ons Altın ($) projeksiyonuyla ve MKK takasıyla okumak gerekir.',
      trapWatch: 'Geçmişteki gibi aşırı kaldıraçlı/kredili spekülatif fon pozisyonlarının patladığı taban serisi risklerini unutmamak.',
      rawInputs: ['Ons Altın Fiyatı & Söğüt Maden Üretimi', 'Üre/Amonyak & Doğalgaz Fiyatı', 'MKK Takas Dengesi'],
      risesWhen: 'Söğüt altın üretimi artarken ons altın yükseldiğinde ve gübre sezonu açıldığında.',
      fallsWhen: 'İran Razi doğalgaz kesintilerinde veya aşırı çarpan düzeltmelerinde.',
      relatedKeys: ['gram-altin-spot', 'emtia-tarim-dba', 'bist-tralt']
    },
    'bist-hekts': {
      shortDesc: 'Hektaş (HEKTS). Bitki koruma, tohum ve hayvan sağlığı şirketi; borsa tarihinin en öğretici "aşırı çarpan + borç + bedelli" vaka dersi.',
      howItWorks: 'Tarım ilaçları ve tohum üretir; ancak 2022’de 80–100x F/K balonuna şişirilip ağır kısa vadeli kredi borcuyla stok taşıdığında yüksek faiz duvarına çarpmıştır.',
      expertEdge: 'HEKTS bir hissenin "hikayesi güzel diye her fiyattan alınamayacağının" canlı kanıtıdır; dönüş için tek şart OCF’nin kalıcı pozitife ve borcun sıfıra yaklaşmasıdır.',
      trapWatch: 'Sırf eski zirvesinden çok düştü diye negatif faaliyet nakdi ve stok/alacak yükü düzelmeden ucuz sanmak!',
      rawInputs: ['Tarımsal İlaç Tahsilat Süresi', 'Kısa Vadeli Kredi Faizi', 'Bedelli / Varlık Satışı Borç Azaltımı'],
      risesWhen: 'Borç yükü temizlenip esas faaliyetten pozitif nakit akışı başladığında.',
      fallsWhen: 'Negatif nakit akışı ve finansman gideri devam ettiğinde.',
      relatedKeys: ['bist-gubrf', 'bist-sasa', 'emtia-tarim-dba']
    },
    'bist-tralt': {
      shortDesc: 'Türk Altın İşletmeleri / Koza Altın (TRALT · Eski KOZAL). Kasası milyarlarca lira net nakit dolu, sıfır banka borçlu yerli altın madencisi.',
      howItWorks: 'Toprağın altından çıkardığı altını doğrudan dünya Ons ($) × Dolar/TL fiyatından satar; bir yandan da kasasındaki dev TL/Döviz nakit yığınından yüksek faiz geliri yazar!',
      expertEdge: 'İki kritik veri izlenir: 1) Yıllık altın üretim onsu ve "Ons Başına Nakit Çıkarma Maliyeti (AISC)", 2) Yeni maden sahalarının (Ağrı Mollakara vb.) ÇED ve tesis yatırımları.',
      trapWatch: 'Ons altın yükseldiği halde şirketin cevher tenörü ve üretim onsu düşüyorsa fiziki gram altının gerisinde kalabilir!',
      rawInputs: ['Ons Altın ($) & USD/TRY', 'Yıllık Altın Üretim Onsu', 'Kasadaki Net Nakit Getirisi'],
      risesWhen: 'Yeni maden rezervleri üretime geçip ons altın yükseldiğinde.',
      fallsWhen: 'Üretim onsu gerileyip çıkarma maliyetleri şiştiğinde.',
      relatedKeys: ['gram-altin-spot', 'bist-gubrf']
    },
    'bist-agesa': {
      shortDesc: 'AgeSA Hayat ve Emeklilik (AGESA). BES fon yönetimi ve hayat sigortası komisyonuyla %60+ ROE üreten Sabancı ortaklığı.',
      howItWorks: 'Milyonlarca katılımcının BES emeklilik birikimlerinden her yıl düzenli fon işletim kesintisi alır ve hayat sigortası nakit havuzunu yüksek faizde çalıştırır.',
      expertEdge: 'EGM (Emeklilik Gözetim Merkezi) haftalık BES fon büyüklüğü verisi ve TSB aylık hayat sigortası prim üretimi bilançoyu önceden gösterir!',
      trapWatch: 'Faizlerin sert düştüğü evrede finansal gelir büyümesinin normalleşmesi.',
      rawInputs: ['EGM Haftalık BES Fon Büyüklüğü', 'TSB Aylık Hayat Primi', 'TL Faiz Oranı'],
      risesWhen: 'BES fon havuzu büyüyüp yüksek ROE ve temettü ürettiğinde.',
      fallsWhen: 'Finansal yatırım getirileri daraldığında.',
      relatedKeys: ['bist-tursg', 'bist-sahol', 'bes-emeklilik']
    },
    'bist-doco': {
      shortDesc: 'DO & CO (DOCO). Viyana ve İstanbul merkezli; THY, British Airways ve Formula 1 VIP ikram tekelini elinde tutan Euro gelirli küresel dev.',
      howItWorks: 'Uçak içi gurme ikram ve Formula 1 / Şampiyonlar Ligi ağırlama hizmetlerinden %100’e yakın döviz (Euro/GBP/USD) ciro üretir; BIST’teki en saf küresel hizmet kasalarındandır.',
      expertEdge: 'THYAO dış hat yolcu büyümesi + küresel Formula 1 takvimi ve Viyana Borsası’ndaki Euro fiyatı ile BIST fiyatı arasındaki kur paritesi izlenir.',
      trapWatch: 'Birim hisse fiyatının yüksek rakam olması (binlerce TL) acemiyi korkutur ama ucuzluk birim fiyata değil F/K ve FCF büyümesine göre ölçülür!',
      rawInputs: ['Küresel Havacılık Business/Dış Hat Yolcusu', 'Formula 1 & Etkinlik Takvimi', 'EUR/TRY Kuru'],
      risesWhen: 'Küresel uçuş trafiği ve Euro kuru güçlendiğinde.',
      fallsWhen: 'Küresel seyahat şoklarında veya gıda/personel enflasyonu arttığında.',
      relatedKeys: ['bist-thyao', 'bist-tavhl', 'doviz-eur']
    },
    'bist-clebi': {
      shortDesc: 'Çelebi Hava Servisi (CLEBI). Türkiye, Hindistan, Macaristan ve Almanya havalimanlarında uçak yer hizmetleri ve kargo antreposu işletmecisi.',
      howItWorks: 'Uçak yakıtı riski almadan havalimanına inen her uçağın ramp, bagaj ve kargo elleçlemesinden Euro/Döviz bazlı ücret alır; Hindistan büyüme pazarı önemli koludur.',
      expertEdge: 'DHMİ aylık dış hat uçak trafiği ve Hindistan sivil havacılık büyüme rakamları CLEBI’nin döviz kasasını önceden gösterir.',
      trapWatch: 'Yurt dışı havalimanı lisans/imtiyaz süreçlerindeki idari kararlar ve tahtadaki sığ likidite dalgalanmaları.',
      rawInputs: ['Türkiye & Hindistan Dış Hat Uçuş Sayısı', 'EUR/TRY Kuru', 'Hava Kargo Tonajı'],
      risesWhen: 'Uluslararası uçuş ve kargo trafiği büyüdüğünde.',
      fallsWhen: 'İmtiyaz/lisans iptali veya bölgesel havacılık kesintilerinde.',
      relatedKeys: ['bist-tavhl', 'bist-thyao', 'bist-doco']
    }
  };

  // --------------------------------------------------------------------------
  // 2. 24 SEKTÖR İÇİN UZMAN ÖNCÜ VERİ & DEĞER TUZAĞI ŞABLONLARI (619 HİSSE %100 KAPSAM)
  // --------------------------------------------------------------------------
  const SECTOR_DEFAULTS = {
    'Bankacılık': {
      how: 'Mevduat toplayıp ticari ve bireysel kredi vererek net faiz marjı (NIM), tahvil portföyü ve ödeme sistemleri komisyon kârı üretir.',
      inputs: ['TCMB Politika Faizi', 'Ülke Risk Primi (5Y CDS)', 'Kredi - Mevduat Faiz Makası'],
      rise: 'Enflasyon düşüp faiz indirim döngüsü başladığında ve yabancı sermaye girişi hızlandığında.',
      fall: 'Mevduat fonlama maliyeti kredi faizini aştığında veya takipteki alacaklar (NPL) sıçradığında.',
      expertEdge: 'Her Perşembe açıklanan "BDDK Haftalık Bankacılık Sektörü Verileri" bankaların çeyrek kârını bilançodan haftalar önce gösterir; Özsermaye Kârlılığı (ROE) yıllık enflasyonla kıyaslanır.',
      trapWatch: 'Bankalarda sanayi şirketi gibi "Toplam Borç" veya "OCF" bakılmaz; PD/DD çarpanını ROE ile birlikte okumadan "F/K 3x çok ucuz" demek yanıltır.'
    },
    'Sigorta & Emeklilik': {
      how: 'Milyonlarca poliçeden peşin prim toplar (Float); hasar ödemesine kadar bu dev nakit havuzunu yüksek faizde çalıştırarak çift yönlü kazanır!',
      inputs: ['TCMB Mevduat/Tahvil Faizi', 'TSB Aylık Poliçe Prim Hacmi', 'Hasar/Prim Bileşik Oranı'],
      rise: 'Yüksek faiz ortamında teknik nakit havuzu büyüdüğünde ve poliçe fiyatları güncellendiğinde.',
      fall: 'Büyük afet hasarlarında, asgari ücret/yedek parça sıçramasında veya faizler hızla indiğinde.',
      expertEdge: 'Türkiye Sigorta Birliği (TSB) aylık brüt prim tabloları şirketin cirosunu bilançodan 45 gün önce ifşa eder!',
      trapWatch: 'Faizlerin tepe yaptığı noktada finansal kârın sonsuza dek aynı hızda büyüyeceğini varsaymak.'
    },
    'Aracı Kurum & Finansman': {
      how: 'Borsa işlem hacminden komisyon ve yatırımcılara kullandırılan kredili işlem / VİOP teminat faizinden yüksek nakit üretir.',
      inputs: ['Borsa İstanbul Günlük İşlem Hacmi', 'Kredili İşlem Faiz Oranı', 'Aktif Yatırımcı Sayısı'],
      rise: 'Borsada günlük işlem hacmi katlandığında ve yüksek faizle nemalandırma geliri büyüdüğünde.',
      fall: 'Borsa işlem hacimleri kuruduğunda veya kredi temerrütleri arttığında.',
      expertEdge: 'BIST günlük toplam işlem hacmi (Milyar ₺) her akşam 18:10’da bellidir; çeyrek ortalama hacim doğrudan komisyon kârını belirler.',
      trapWatch: 'Coşkulu boğa zirvesindeki rekor komisyon kârını ayı piyasasında da sürecek sanmak.'
    },
    'Petrol, Rafineri & Doğalgaz': {
      how: 'Ham petrol ve doğalgaz girdilerini işleyip mazot, benzin, jet yakıtı ve şehir içi gaz dağıtımı olarak sanayiye ve ulaşıma satar.',
      inputs: ['Brent Ham Petrol ($)', 'Akdeniz Dizel/Jet Rafineri Marjı', 'EPDK Dağıtım Tarifesi'],
      rise: 'Rafineri marjları açıldığında ve kış/yaz enerji tüketim hacmi güçlendiğinde.',
      fall: 'Küresel resesyonda yakıt marjı çöktüğünde veya petrolde sert stok zararı yazıldığında.',
      expertEdge: 'Ham petrol fiyatından ziyade "Akdeniz Rafineri Marjı (Crack Spread $/varil)" ve EPDK tarife güncellemeleri gerçek kârı belirler.',
      trapWatch: 'Stok kârı kaynaklı tek çeyreklik zirve marjı kalıcı sanmak.'
    },
    'Havacılık & Lojistik': {
      how: 'Yolcu bileti, havalimanı hizmeti ve uluslararası kargoyu dövizle satar; en kritik gider kalemi jet/gemi yakıtıdır.',
      inputs: ['Brent Petrol & Jet Yakıtı', 'DHMİ Aylık Yolcu & Kargo Verisi', 'EUR/USD Paritesi'],
      rise: 'Yaz turizm sezonunda (2Ç-3Ç) ve petrol fiyatları gerileyip yakıt faturası düştüğünde.',
      fall: 'Petrol sert fırladığında veya bölgesel hava sahası/boğaz krizleri yaşandığında.',
      expertEdge: 'DHMİ ve şirketlerin her ay başında açıkladığı "Aylık Trafik & Doluluk Verisi" bilançonun aynasıdır; biletler ağırlıkla Euro, yakıt Dolar olduğu için EUR/USD artışı ekstra kâr yazar!',
      trapWatch: '1. çeyrek kış zayıf sezonunu kalıcı bozulma sanmak veya petrol şokuna korumasız yakalanmak.'
    },
    'Market & Perakende': {
      how: 'Temel tüketim ürünlerini müşteriden kasada peşin tahsil eder, tedarikçiye 45–60 gün vadeli ödeyerek negatif işletme sermayesiyle sıcak nakit basar.',
      inputs: ['TCMB Haftalık Market POS Verisi', 'Gıda Enflasyonu', 'Asgari Ücret & Soğuk Zincir Mazot'],
      rise: 'Mağaza sepet hacmi ve kasadaki peşin nakdin faiz/faaliyet getirisi büyüdüğünde.',
      fall: 'Personel ve kira giderleri sepet büyümesinden hızlı arttığında veya Rekabet Kurumu cezalarında.',
      expertEdge: 'Her Perşembe 14:30’da TCMB’nin açıkladığı "Haftalık Kredi Kartı Market/Gıda Harcamaları" perakende cirosunu anlık gösterir!',
      trapWatch: 'Borçlu perakendeci ile kasası net nakit dolu perakendeciyi aynı kefeye koymak.'
    },
    'Otomotiv & Yan Sanayi': {
      how: 'Çelik, döküm ve elektroniği işleyip iç pazara ve ağırlıkla Avrupa’ya Euro ile binek/ticari araç ve yedek parça ihraç eder.',
      inputs: ['OSD & ODMD Aylık Üretim/Satış Verisi', 'EUR/TRY & EUR/USD', 'Yassı Çelik Sac & Taşıt Kredisi'],
      rise: 'Avrupa siparişleri ve Euro güçlendiğinde, içeride taşıt kredisi faizleri gevşediğinde.',
      fall: 'Yüksek faiz iç talebi kestiğinde ve Avrupa sanayisi resesyona girdiğinde.',
      expertEdge: 'Her ayın ilk haftası yayınlanan "ODMD İç Pazar Satışları" ve "OSD İhracat Adetleri" hem ana sanayiyi (FROTO/TOASO) hem yan sanayiyi (EGEEN/KORDS) 45 gün önceden ifşa eder.',
      trapWatch: 'İç pazarda kampanya/indirim savaşlarının brüt marjı erittiği dönemleri gözden kaçırmak.'
    },
    'Elektrik & Yenilenebilir Enerji': {
      how: 'Baraj, rüzgâr, güneş santrallerinde elektrik üretir veya şebeke için trafo/panel imal ederek enerji dönüşümünden kazanır.',
      inputs: ['EPİAŞ Günlük PTF Elektrik Fiyatı & Üretim (MWh)', 'Baraj Yağış Oranları', 'Bakır & Gümüş Maliyeti'],
      rise: 'EPİAŞ üretim hacmi artıp yatırım borcu (Net Borç/FAVÖK) hızla eridiğinde.',
      fall: 'Kuraklık barajları vurduğunda veya ağır döviz/TL yatırım borcu faizi tüm kârı yuttuğunda.',
      expertEdge: 'EPİAŞ Şeffaflık Platformu’nda her santralin dün kaç MWh elektrik ürettiği kuruşu kuruşuna açıktır! Bilançoyu beklemeden üretim çarpı PTF hesaplanır.',
      trapWatch: 'Net Borç / FAVÖK oranı 6x–10x üzerinde olan borçlu enerji şirketine hikayeyle yüksek çarpandan girmek.'
    },
    'Demir-Çelik & Metal': {
      how: 'Cevher ve hurdayı eritip sanayi ve inşaatın ana hammaddesi olan çeliği üretir; küresel emtia döngüsüyle hareket eder.',
      inputs: ['Dünya Sıcak Sac (HRC $/ton)', 'Demir Cevheri & Hurda Makası', 'Kok Kömürü & Elektrik'],
      rise: 'Küresel altyapı/sanayi döngüsü dönüp ton başına dolar FAVÖK yükseldiğinde.',
      fall: 'Çin dünyaya ucuz çelik döktüğünde ve enerji maliyetleri şiştiğinde.',
      expertEdge: 'Döngüsel çelik şirketlerinde "PD/DD (Defter Değeri)" ve "Ton Başına FAVÖK ($)" esastır; dip döngüde F/K yüksek görünürken toplanır!',
      trapWatch: 'Çelik marjları zirvedeyken F/K 3x görünüyor diye döngünün tepesinde yakalanmak.'
    },
    'Gıda, İçecek & Tarım': {
      how: 'Tarladan çıkan buğday, süt, şeker ve meyveyi işleyip market rafına koyar; krizde de talep gören savunma sektörüdür.',
      inputs: ['Buğday, Şeker & Çiğ Süt Maliyeti', 'Kuraklık & Rekolte', 'Yaz Turizm Tüketimi'],
      rise: 'Hammaddeyi hasat zamanı uygun fiyattan stoklayıp yaz sezonunda güçlü satış hacmi yakaladığında.',
      fall: 'Kuraklık yüzünden hammadde ve ambalaj maliyeti raf fiyatından hızlı fırladığında.',
      expertEdge: 'Stok devir hızı ve şirketin enflasyonu müşteriye hacim kaybetmeden yansıtabilme gücü (marka gücü) belirleyicidir.',
      trapWatch: 'Kısa vadeli işletme sermayesi kredisiyle stok çeviren küçük gıda şirketlerinin yüksek faizde kâr erimesi.'
    },
    'Savunma & Havacılık Sanayi': {
      how: 'Radar, haberleşme, otonom araç ve savunma sistemlerini yıllara yayılan döviz bazlı sipariş defteriyle (Backlog) üretir.',
      inputs: ['Kesinleşmiş Sipariş Defteri (Backlog $)', 'İhracat Sözleşmeleri', 'Hak Ediş Nakit Tahsilatı'],
      rise: 'Döviz bazlı ihracat imzaları büyürken kasaya giren gerçek faaliyet nakdi hızlandığında.',
      fall: 'Tahsilat vadeleri uzayıp işletme sermayesi açığı büyüdüğünde veya çarpan aşırı şiştiğinde.',
      expertEdge: 'Yeni iş sözleşmesinin tutarını şirketin yıllık cirosuyla oranla ve bilançoda "340 Alınan Sipariş Avansları" satırına bak!',
      trapWatch: 'Küçük bir siparişi tavan serisi bahanesi yapan sığ tahtalarda MKK fon satışına yakalanmak.'
    },
    'Yazılım, Teknoloji & Telekom': {
      how: 'Milyonlarca aboneye iletişim/veri hizmeti veya kurumlara tekrarlayan yazılım lisansı (SaaS) satarak yüksek marjlı nakit üretir.',
      inputs: ['Abone ARPU Tarifeleri', 'Tekrarlayan Lisans Geliri', 'Ar-Ge & Mühendis Maaş Maliyeti'],
      rise: 'Taahhüt yenilemeleri enflasyonu aşıp VUK/OCF nakit üretimi büyüdüğünde.',
      fall: 'Ar-Ge harcamalarını aktifleştirip kağıt kâr gösteren ama kasasında nakit üretemeyen şişik çarpanlı tahtalarda.',
      expertEdge: 'Yazılım şirketlerinde "Net Kâr" değil "Serbest Nakit Akışı (FCF)" ve MKK patron lot satışı kontrol edilir!',
      trapWatch: 'Kağıt üstünde Ar-Ge aktifleştirmesiyle kâr yazıp kasasından nakit çıkan teknoloji tuzakları.'
    },
    'Gayrimenkul & GYO': {
      how: 'Konut projeleri geliştirir veya AVM, lojistik depo ve ofis mülklerinden düzenli kira nakdi toplar (%0 kurumlar vergisi istisnası).',
      inputs: ['TCMB & Konut Kredisi Faizleri', 'Net Aktif Değer (NAD) İskontosu', 'Kira Doluluk Oranı'],
      rise: 'Faiz indirim döngüsü başladığında ve defter değeri iskontosu kapandığında.',
      fall: 'Politika faizi uzun süre yüksek kaldığında veya döviz borçlu GYO kur şoku yediğinde.',
      expertEdge: 'GYO’larda yıl sonu ekspertiz değerlemesi yüzünden F/K anlamsızdır! Tek doğru terazi "PD/DD (Net Aktif Değer İskontosu)" ve "Kira Geliri / Net Borç" oranıdır.',
      trapWatch: 'Ekspertiz yeniden değerleme kârını kasaya giren gerçek nakit kâr sanmak!'
    },
    'Çimento, Cam & Seramik': {
      how: 'Yüksek ısıdaki fırınlarda kireçtaşı, kil ve silis kumunu işleyerek inşaat, altyapı ve otomotiv sanayisine temel malzeme verir.',
      inputs: ['Petrokok, Doğalgaz & Elektrik Fiyatı', 'Kentsel Dönüşüm & Kamu Şantiyeleri', 'Liman İhracat Navlunu'],
      rise: 'Enerji fiyatları (petrokok/doğalgaz) düşerken konut ve altyapı dökümleri hızlandığında.',
      fall: 'Enerji faturası fırlayıp yüksek faiz inşaat şantiyelerini durdurduğunda.',
      expertEdge: 'Çimento ağır bir mal olduğu için nakliye mesafesi kısıtlıdır; hangi fabrikaların aktif deprem/kentsel dönüşüm/altyapı bölgesine yakın olduğu ve limanı bulunduğu marjı belirler!',
      trapWatch: 'İnşaat durgunluğunda enerji maliyeti yükselirken kapasite kullanım oranının düşmesi.'
    },
    'Kimya, Gübre & Kağıt': {
      how: 'Petrokimya türevleri, tarımsal gübre ve ambalaj kağıdı üreterek sanayi, tarım ve e-ticaret paketlemesini besler.',
      inputs: ['Nafta-Etilen Petrokimya Makası', 'Doğalgaz & Amonyak/Üre Fiyatı', 'Tarımsal Ekim Takvimi'],
      rise: 'Petrokimya makasları açıldığında veya ilkbahar/sonbahar gübre ekim sezonları öncesinde.',
      fall: 'Küresel ucuz ithal kimya arzı ve yüksek döviz borcu birleştiğinde.',
      expertEdge: 'Petrokimyada "Etilen-Nafta Spreadi ($/ton)", kağıt/ambalajda ise e-ticaret koli hacmi ve selüloz fiyatları öncü göstergedir.',
      trapWatch: 'Küresel petrokimya arz fazlası varken ağır kısa vadeli borç duvarı taşıyan bilançolar.'
    },
    'Beyaz Eşya & Mobilya': {
      how: 'Çelik, bakır ve plastiği işleyip hem iç pazara hem Avrupa’ya buzdolabı, çamaşır makinesi ve mobilya ihraç eder.',
      inputs: ['Yassı Çelik, Bakır & Plastik Hammadde', 'EUR/USD Paritesi', 'Kredi Kartı Taksit Sınırları'],
      rise: 'Avrupa konut yenileme talebi canlandığında, EUR/USD yükseldiğinde ve hammadde ucuzladığında.',
      fall: 'İçeride kredi kartı taksit kısıtlaması, dışarıda Avrupa durgunluğu ve yüksek borç faizi vurduğunda.',
      expertEdge: 'TÜRKВES (Beyaz Eşya Sanayicileri) aylık üretim/ihracat bülteni ile Net Borç / FAVÖK oranı birlikte okunur.',
      trapWatch: 'Avrupa satın almalarıyla döviz borcu büyümüş şirketlerde yüksek finansman giderinin faaliyet kârını eritmesi.'
    },
    'İlaç & Sağlık': {
      how: 'Özel hastane zinciri, ilaç üretimi veya ecza deposu dağıtımıyla ekonomik krizden bağımsız sağlık talebini karşılar.',
      inputs: ['Resmi İlaç Referans Euro Kuru Kararı', 'Tamamlayıcı Sağlık Sigortası & Sağlık Turizmi', 'Etken Madde İthalatı'],
      rise: 'Resmi ilaç Euro kuru güncellendiğinde ve özel hastanelerde yabancı sağlık turizmi/TSS payı büyüdüğünde.',
      fall: 'Maliyetler artarken resmi ilaç fiyat kararnamesi geciktiğinde.',
      expertEdge: 'Resmi Gazete’de yayımlanan "Beşeri Tıbbi Ürünler Fiyat Kararnamesi (İlaç Euro Kuru Güncellemesi)" ilaç ve ecza depolarının marj sıçrama tarihidir!',
      trapWatch: 'Uzun vadeli SGK/kamu alacak tahsilat sürelerinin işletme sermayesini yorması.'
    },
    'Madencilik & Altın': {
      how: 'Yer altındaki altın, bakır, çinko ve krom cevherini çıkarıp doğrudan dünya dolar fiyatlarıyla satar.',
      inputs: ['Ons Altın & Bakır Fiyatı ($)', 'Maden Rezerv Raporları (UMREK) & ÇED İzinleri', 'Üretim Ons Maliyeti (AISC)'],
      rise: 'Ons altın/bakır yükselirken yeni maden sahası ÇED onayı alıp üretime geçtiğinde.',
      fall: 'Cevher tenörü düştüğünde veya ÇED/ruhsat duruşları yaşandığında.',
      expertEdge: 'Maden şirketlerinde kasadaki net nakit + "Ons Başına Çıkarma Maliyeti" ile Çevre Bakanlığı e-ÇED / MAPEG ruhsat duyuruları takip edilir.',
      trapWatch: 'Henüz kazma vurulmamış rezerv söylentisini kesinleşmiş nakit akışı gibi fiyatlamak.'
    },
    'Holding & Çoklu Yatırım': {
      how: 'Banka, enerji, sanayi ve perakende gibi farklı sektörlerdeki şirketleri tek çatı altında toplayıp sermaye tahsisi yapar.',
      inputs: ['İştiraklerden Gelen Nakit Temettüler', 'Solo Holding Net Nakit/Borç Kasası', 'Net Aktif Değer (NAD) İskontosu'],
      rise: 'İştiraklerinin toplam değerine göre iskontosu açıldığında ve yabancı fon girişi başladığında.',
      fall: 'Solo holding borçluysa veya ülke risk primi (CDS) yükseldiğinde.',
      expertEdge: 'Holding alırken "Solo Kasa Net Nakit mi?" sorusu sorulur; içindeki halka açık şirketlerin değerinden %35+ ucuza işlem gören net nakitli holding güvenlik marjı sunar.',
      trapWatch: 'İçinde nakit yakan borçlu iştirakler barındıran sığ holdingleri sırf PD/DD düşük diye ucuz sanmak.'
    },
    'Makine & Sanayi Üretimi': {
      how: 'Traktör, savunma zırhlısı, iş makinesi ve sanayi ekipmanları üreterek tarım ve fabrikaların üretim gücünü kurar.',
      inputs: ['Sübvanse Tarım & Yatırım Kredisi Faizleri', 'Çelik & Motor Girdisi', 'İhracat Siparişleri'],
      rise: 'Tarım/yatırım kredileri uygun olduğunda ve ihracat sözleşmeleri büyüdüğünde.',
      fall: 'Yüksek kredi faizi ortamında çiftçi ve sanayici makine yenilemeyi ertelediğinde.',
      expertEdge: 'Aylık traktör üretim/satış adetleri (TTRAK/TÜMOSAN) tarım ekonomisinin nabzını bilançodan önce verir.',
      trapWatch: 'Tepe talep yılındaki düşük F/K çarpanına bakıp kredi daralma döngüsüne yakalanmak.'
    },
    'İnşaat & Taahhüt': {
      how: 'Yurt içinde ve yurt dışında enerji santrali, otoyol, metro ve endüstriyel tesis müteahhitliği yaparak döviz hak ediş toplar.',
      inputs: ['Yurt Dışı Müteahhitlik Backlog ($)', 'Petrol Üreticisi Ülkelerin Altyapı Bütçeleri', 'Demir & Çimento Maliyeti'],
      rise: 'Büyük dövizli taahhüt ihaleleri kazanıldığında ve hak ediş tahsilatları kasada nakde döndüğünde.',
      fall: 'Şantiye maliyet aşımı veya politik riskli ülkelerde hak ediş tahsilat gecikmesi yaşandığında.',
      expertEdge: 'Yeni alınan işlerin "Toplam Backlog ($)" büyüklüğüne oranı ve bilançodaki net döviz kasası izlenir.',
      trapWatch: 'Düşük marjlı sabit fiyatlı iç ihale işlerinde maliyet enflasyonu altında ezilmek.'
    },
    'Tekstil & Hazır Giyim': {
      how: 'Pamuk ve ipliği işleyip Avrupa’ya ihracat yapar veya güçlü perakende mağaza markasıyla (Mavi vb.) içeride peşin satış yapar.',
      inputs: ['Pamuk & Polyester Fiyatı', 'Dolar Bazlı Asgari Ücret / Kur Dengesi', 'Mağaza Sepet Büyümesi'],
      rise: 'Markalı perakendede mağaza trafiği güçlü olduğunda veya kur ihracatçıyı rekabetçi kıldığında.',
      fall: 'TL reel olarak değerlenip işçilik maliyeti dolar bazında Mısır/Bangladeş’i geçtiğinde fason üretici zorlanır.',
      expertEdge: '"Fason tekstil fabrikası" ile "Markalı peşin perakende kasası (MAVI gibi)" tamamen farklı iki dünyadır; birincisi kura mahkûmdur, ikincisi marka gücüyle fiyatlar!',
      trapWatch: 'Markası olmayan borçlu iplik/kumaş üreticilerini değerli TL döneminde taşımak.'
    },
    'Turizm, Medya & Hizmet': {
      how: 'Otel konaklaması, havalimanı ikramı (DOCO), araç kiralama ve hizmet gelirleriyle özellikle yaz döviz akışından beslenir.',
      inputs: ['Kültür ve Turizm Bakanlığı Aylık Turist Verisi', 'EUR/TRY Kuru', 'Oda Başına Döviz Geliri (RevPAR)'],
      rise: 'Nisan-Ekim turizm sezonunda doluluk ve Euro gelirleri zirve yaptığında.',
      fall: 'Kış ölü sezonunda veya bölgesel jeopolitik gerginliklerde.',
      expertEdge: 'Erken rezervasyon verileri ve Antalya/İstanbul dış hat yolcu iniş sayıları yaz bilançosunu bahardan söyler.',
      trapWatch: 'Yaz sonunda turizm zirvesi manşetlerdeyken alıp kış zarar çeyreklerini taşımak.'
    },
    'Girişim & Yatırım Ortaklığı': {
      how: 'Büyüme aşamasındaki girişimlere ortak olup stratejik satış (Exit) veya halka arz ile özsermaye büyütmeyi hedefler.',
      inputs: ['İştirak Çıkış (Exit) & Halka Arz İştahı', 'PD/DD Net Aktif İskontosu', 'MKK Fiili Dolaşım Yapısı'],
      rise: 'Portföy şirketleri halka arz edildiğinde veya nakit karşılığı satıldığında.',
      fall: 'Sığ tahtalarda ortak satışı geldiğinde veya sermaye piyasası risk iştahı kapandığında.',
      expertEdge: 'GSYO bilançolarında kağıt üstü "yeniden değerleme kârı" ile gerçek nakit "İştirak Satışı (Exit)" mutlaka ayrılmalıdır!',
      trapWatch: 'Sığ tahtalarda sosyal medya pazarlamasına kapılıp özsermayesinin 5–10 katı fiyattan girmek.'
    }
  };

  // Alt-Endüstri Özel Operasyonel Modelleri (621 BIST şirketinin tamamında sektörel farkları keskinleştirir)
  const SUB_INDUSTRY_MODELS = {
    'Real Estate Investment Trusts': { model: 'AVM, ofis, lojistik depo veya konut portföyü işleten GYO yapısı (%0 kurumlar vergisi muafiyetli)', lead: 'Yıl sonu SPK gayrimenkul ekspertiz raporları, kira yenileme endeksi ve NAD iskontosu (PD/DD)' },
    'Real Estate Development': { model: 'Arsa geliştirme, konut/ticari proje inşası ve ön satış nakit tahsilatı modeli', lead: 'Konut kredisi faiz patikası, yapı ruhsatları ve ertelenmiş gelirler (340 Sipariş Avansları)' },
    'Food: Specialty/Candy': { model: 'Markalı paketli gıda, şekerleme ve atıştırmalık üretimi', lead: 'Kakao/şeker/ambalaj maliyeti ve TCMB haftalık market POS cirosu' },
    'Agricultural Commodities/Milling': { model: 'Buğday, un, yem, yağlı tohum ve tarımsal ürün işleme tesisi', lead: 'TMO alım fiyatları, hasat rekoltesi ve kuraklık/baraj verisi' },
    'Food: Meat/Fish/Dairy': { model: 'Süt, peynir, et ve su ürünleri soğuk zincir işleme/ihracat modeli', lead: 'Ulusal Süt Konseyi çiğ süt referans fiyatı, yem maliyeti ve Avrupa su ürünleri ihracatı' },
    'Beverages: Non-Alcoholic': { model: 'Alkolsüz içecek, su ve meyve suyu şişeleme/dağıtım operasyonu', lead: 'Yaz sıcaklık ortalamaları, ünite kasa hacmi ve alüminyum/PET reçine maliyeti' },
    'Construction Materials': { model: 'Çimento, hazır beton, seramik ve yalıtım malzemeleri fırın üretimi', lead: 'Petrokok/doğalgaz yakıt fiyatı ve bölgesel kentsel dönüşüm/altyapı hakedişleri' },
    'Building Products': { model: 'Boru, profil, cam, boya ve yapı kimyasalları üretimi', lead: 'Konut tamamlama istatistikleri, PVC/reçine girdisi ve ihracat pazarları' },
    'Textiles': { model: 'İplik, dokuma, boya-apre ve teknik tekstil üretimi', lead: 'Pamuk/polyester makası, dolar bazlı işçilik maliyeti ve AB tekstil siparişleri' },
    'Apparel/Footwear': { model: 'Hazır giyim, konfeksiyon ve ayakkabı tasarım/perakende satışı', lead: 'TCMB haftalık giyim POS verisi ve EUR/USD ihracat paritesi' },
    'Steel': { model: 'Sıcak/soğuk haddelenmiş çelik, kütük demir ve galvaniz sac üretimi', lead: 'Dünya HRC çelik fiyatı ($/ton) eksi hurda/cevher/kok kömürü marjı' },
    'Metal Fabrication': { model: 'Çelik boru, tel, kablo zırhı ve endüstriyel metal işleme', lead: 'TÜİK demir-çelik mamulleri GTİP USD/kg ihracat birim fiyatı' },
    'Aluminum': { model: 'Alüminyum profil, levha ve otomotiv/güneş paneli çerçeve ekstrüzyonu', lead: 'LME Alüminyum ($/ton) fiyatı ve AB sınırda karbon (CBAM) avantajı' },
    'Alternative Power Generation': { model: 'Güneş (GES), rüzgâr (RES), jeotermal ve biyokütle elektrik santrali işletmeciliği', lead: 'EPİAŞ saatlik santral üretimi (MWh) ve YEKDEM döviz alım garantisi süresi' },
    'Electric Utilities': { model: 'Elektrik üretim ve bölgesel dağıtım şebekesi işletmeciliği', lead: 'EPİAŞ PTF spot elektrik fiyatı, doğalgaz/kömür marjı ve EPDK tarife tavanı' },
    'Electrical Products': { model: 'Yüksek gerilim trafo, enerji kablosu, anahtarlama ve GES panel ekipmanı imalatı', lead: 'TEİAŞ şebeke ihaleleri, elektrolitik bakır maliyeti ve GTİP trafo/kablo ihracatı' },
    'Finance/Rental/Leasing': { model: 'Faktoring, finansal kiralama (leasing) ve varlık yönetimi finansmanı', lead: 'Ticari çek/fatura iskonto faiz marjı ve BDDK aylık faktoring/leasing bülteni' },
    'Investment Banks/Brokers': { model: 'Borsa aracılık komisyonu, kredili işlem faizi ve kurumsal finansman/halka arz geliri', lead: 'BIST + VİOP günlük toplam işlem hacmi ve kredili teminat büyüklüğü' },
    'Investment Managers': { model: 'Girişim sermayesi (GSYO), menkul kıymet yatırım ortaklığı ve portföy yönetimi', lead: 'Birim pay / Net Aktif Değer (NAD) iskontosu ve iştirak çıkış (Exit) KAP bildirimleri' },
    'Containers/Packaging': { model: 'Oluklu mukavva, karton kutu, esnek plastik ve cam/metal ambalaj üretimi', lead: 'E-ticaret kargo/koli hacmi, selüloz/atık kağıt ve polietilen fiyatları' },
    'Engineering & Construction': { model: 'Ağır altyapı, enerji tesisi, metro ve endüstriyel anahtar teslim müteahhitlik', lead: 'Bakiye sipariş defteri (Backlog $), hakediş tahsilatı ve uluslararası tahkim/ihale akışı' },
    'Packaged Software': { model: 'Kurumsal ERP, siber güvenlik, finans teknolojisi ve SaaS abonelik yazılımı', lead: 'Yıllık tekrarlayan lisans geliri (ARR), Ar-Ge aktifleştirme oranı ve serbest nakit akışı' },
    'Information Technology Services': { model: 'Sistem entegrasyonu, bulut veri merkezi ve kurumsal BT altyapı projeleri', lead: 'Kamu/banka teknoloji ihaleleri ve döviz bazlı bakım sözleşmeleri' },
    'Electronics Distributors': { model: 'Telefon, bilgisayar ve teknoloji donanımı toptan dağıtım ağı', lead: 'Kredi kartı taksit düzenlemeleri, stok devir hızı ve kur farkı yönetimi' },
    'Auto Parts: OEM': { model: 'Ana otomotiv fabrikalarına (OEM) dingil, fren, jant, döküm ve piston tedariki', lead: 'OSD/ACEA aylık otomotiv ihracat adetleri ve ana sanayi (FROTO/TOASO) üretim temposu' },
    'Trucks/Construction/Farm Machinery': { model: 'Traktör, kamyon, otobüs ve iş makinesi imalatı', lead: 'Aylık üretim/satış bültenleri ve sübvanse tarım/yatırım kredisi musluğu' },
    'Chemicals: Specialty': { model: 'Özel poliüretan, boya, reçine, akrilik elyaf ve endüstriyel kimya üretimi', lead: 'Petrokimya türev fiyatları, tekstil/inşaat ara malı talebi ve GTİP ihracat tonajı' },
    'Chemicals: Agricultural': { model: 'Tarımsal gübre, bitki koruma ilacı ve tohum üretimi', lead: 'Doğalgaz/amonyak/üre fiyatları, ilkbahar-sonbahar ekim sezonu ve alacak tahsil süresi' },
    'Hotels/Resorts/Cruise lines': { model: 'Turizm otelciliği, tatil köyü, marina ve kruvaziyer liman işletmeciliği', lead: 'DHMİ dış hat turist iniş sayıları, erken rezervasyon ve Euro bazlı oda geliri (RevPAR)' },
    'Pharmaceuticals: Major': { model: 'Beşeri ilaç, biyoteknoloji ve tıbbi malzeme üretimi', lead: 'Resmi Gazete İlaç Euro Referans Kuru kararnamesi ve SGK geri ödeme listesi' },
    'Hospital/Nursing Management': { model: 'Özel hastane zinciri ve ileri tanı/tedavi sağlık hizmetleri', lead: 'Tamamlayıcı Sağlık Sigortası (TSS) penetrasyonu ve yabancı sağlık turizmi geliri' },
    'Marine Shipping': { model: 'Kuru yük gemisi filosu, tanker taşımacılığı ve liman konteyner elleçleme', lead: 'Baltic Dry Index (BDI) / Supramax günlük dolar navlun kira oranları!' }
  };

  const TR_INT_FMT = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
  const TR_DEC1_FMT = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
  const fmtInt = (n) => TR_INT_FMT.format(Math.round(Number(n) || 0));
  const fmtDec1 = (n) => TR_DEC1_FMT.format(Number(n) || 0);

  let cachedForensicRev = -1;
  let cachedForensicScoreMap = new Map();
  let cachedQuickSignalMap = new Map();

  function getQuickForensicScore(assetOrKey) {
    const K = global.AetherKernelV10;
    if (!K) return 0;
    const rev = K.getCatalogRev ? K.getCatalogRev() : 0;
    if (rev !== cachedForensicRev) {
      cachedForensicRev = rev;
      cachedForensicScoreMap.clear();
      cachedQuickSignalMap.clear();
    }
    const asset = typeof assetOrKey === 'string' ? K.getAsset(assetOrKey) : assetOrKey;
    if (!asset) return 0;
    const hit = cachedForensicScoreMap.get(asset.key);
    if (hit !== undefined) return hit;

    let sc = 0;
    const r = asset.bistRow || null;
    if (r && isFinancialEntityRow(r)) {
      const inf = K.getAnnualInflationPct();
      const hasFinData = r.roe != null || r.netIncomeMillionTL != null || r.pb != null;
      const roe = Number(r.roe) || 0;
      const pb = r.pb != null ? Number(r.pb) : 1.2;
      const cmf = Number(r.cmf20) || 0;
      const floatPct = Number(r.floatPct) || 35;
      const p1 = !hasFinData ? 56 : (roe >= inf ? 92 : (roe >= inf * 0.75 ? 78 : (roe > 0 ? 55 : 28)));
      const p2 = !hasFinData ? 58 : (pb <= 0.85 && roe > 15 ? 92 : (pb <= 1.35 ? 80 : (pb <= 2.2 ? 64 : 42)));
      const p3 = !hasFinData ? 56 : ((r.netIncomeMillionTL || 0) > 0 ? ((r.dividendYield || 0) >= 3 ? 90 : 78) : 30);
      const p4 = floatPct <= 25 ? 88 : (floatPct <= 50 ? 75 : 58);
      const p5 = asset.isPatronSelling ? 30 : (cmf >= 0.12 ? 90 : (cmf >= 0 ? 72 : 46));
      sc = Math.round(p1 * 0.28 + p2 * 0.24 + p3 * 0.20 + p4 * 0.12 + p5 * 0.16);
    } else if (r) {
      const hasOcf = r.ocfMillionTL != null || r.fcfMillionTL != null;
      const hasNetInc = r.netIncomeMillionTL != null;
      const hasCashFlow = hasOcf || hasNetInc;
      const hasBalanceSheet = r.cashMillionTL != null || r.totalDebtMillionTL != null || r.netDebtMillionTL != null;
      const ocf = Number(r.ocfMillionTL) || 0;
      const netInc = Number(r.netIncomeMillionTL) || 0;
      const capexAbs = Math.abs(Number(r.capexMillionTL) || 0);
      const fcf = r.fcfMillionTL != null ? Number(r.fcfMillionTL) : (ocf - capexAbs);
      const cash = Number(r.cashMillionTL) || 0;
      const debt = Number(r.totalDebtMillionTL) || 0;
      const netDebt = (r.netDebtMillionTL != null && Number.isFinite(Number(r.netDebtMillionTL)))
        ? Number(r.netDebtMillionTL)
        : (debt - cash);
      const ndEbitda = r.netDebtToEbitda != null ? Number(r.netDebtToEbitda) : null;
      const curRatio = r.currentRatio != null ? Number(r.currentRatio) : null;
      const sloan = r.sloanAccrualPct != null ? Number(r.sloanAccrualPct) : null;
      const cashConv = r.cashConversionRatio != null ? Number(r.cashConversionRatio) : ((hasOcf && netInc > 0) ? +(ocf / netInc).toFixed(2) : null);
      const roic = r.roic != null ? Number(r.roic) : null;
      const evEbitda = r.evEbitda != null ? Number(r.evEbitda) : null;
      const pb = r.pb != null ? Number(r.pb) : null;
      const cmf = Number(r.cmf20) || 0;

      let p1 = 55;
      if (hasOcf) {
        if (ocf > 0 && fcf > 0) p1 = 92;
        else if (ocf > 0 && fcf <= 0) p1 = 74;
        else if (ocf <= 0 && fcf < 0) p1 = 26;
      } else if (hasNetInc) {
        p1 = netInc > 0 ? 68 : 38;
      }

      let p2 = hasOcf ? 68 : (hasNetInc ? (netInc > 0 ? 66 : 42) : 56);
      if (hasOcf) {
        if (ocf > 0 && ((sloan != null && sloan < -5) || (cashConv != null && cashConv >= 1.35))) p2 = 94;
        else if ((hasNetInc && netInc > 0 && ocf < 0) || asset.isTms29Illusion || (sloan != null && sloan > 18)) p2 = 24;
        else if (ocf < 0 && netInc <= 0) p2 = 34;
      }

      let p3 = 65;
      if (((pb != null && pb <= 1.5) || (evEbitda != null && evEbitda > 0 && evEbitda <= 7.5)) && (hasOcf ? ocf > 0 : netInc > 0)) {
        p3 = (roic != null && roic >= 15) ? 93 : 85;
      } else if (pb != null && pb > 6.5 && (roic == null || roic < 15)) {
        p3 = 34;
      } else if (hasOcf && ocf <= 0 && pb != null && pb < 1.0) {
        p3 = 40;
      }

      let p4 = hasBalanceSheet ? 66 : 56;
      if (hasBalanceSheet) {
        if (netDebt < 0 || (cash > debt && cash > 0)) p4 = 95;
        else if (netDebt === 0) p4 = (curRatio != null && curRatio < 0.85) ? 58 : 86;
        else if (ndEbitda != null && ndEbitda > 0 && ndEbitda <= 2.2 && (curRatio == null || curRatio >= 1.2)) p4 = 84;
        else if ((ndEbitda != null && ndEbitda >= 4.5) || (curRatio != null && curRatio < 0.85 && debt > cash * 2)) p4 = 28;
      }

      let p5 = 65;
      if (asset.isPatronSelling || asset.isPumpAnomaly) p5 = 24;
      else if (asset.isShareBuyback && cmf >= 0.05) p5 = 94;
      else if (cmf >= 0.12) p5 = 88;
      else if (cmf <= -0.15) p5 = 38;

      sc = Math.round(p1 * 0.28 + p2 * 0.20 + p3 * 0.20 + p4 * 0.18 + p5 * 0.14);
    } else {
      const dx = computeDeepForensicXray(asset, 100000);
      sc = dx ? (Number(dx.overallScore) || 0) : 0;
    }

    cachedForensicScoreMap.set(asset.key, sc);
    return sc;
  }

  function isPreciousMetalAsset(a) {
    if (!a) return false;
    const id = String(a.id || '');
    return a.subVenue === 'PHYSICAL_METAL' || a.subVenue === 'DARPHANE_S1' || id === 'fon-degisken-isglk' || id.includes('altin') || id.includes('gumus') || id.includes('platin') || id.includes('paladyum');
  }

  function isFxLinkedShieldAsset(a) {
    if (!a) return false;
    const id = String(a.id || '');
    return id.startsWith('doviz-') || id === 'eurobond-usdtr' || id === 'eurobond-emb' || a.isForeignUsd || isPreciousMetalAsset(a);
  }

  function isFinancialEntityRow(r) {
    return Boolean(r && (r.entityKind === 'bank' || r.entityKind === 'insurance' || r.entityKind === 'fin_other'));
  }

  // --------------------------------------------------------------------------
  // 3. CANLI BAŞABAŞ TERAZİSİ (TL FAİZ / SUKUK vs DOLAR / ALTIN / ALTIN.S1)
  // --------------------------------------------------------------------------
  function computeBreakevenComparison(amountTL = 100000, horizonDays = 32) {
    const K = global.AetherKernelV10;
    const amt = Math.max(1000, Math.round(Number(amountTL) || 100000));
    const days = Math.max(1, Math.round(Number(horizonDays) || 32));
    if (!K) return null;

    const usdNow = K.getUsdTry();
    const goldNow = K.getAsset('gram-altin-spot')?.priceTL || 6057.5;
    const dInfo = K.getDarphanePremiumInfo();
    const clock = K.getTurkishClock();
    const annualInf = K.getAnnualInflationPct();

    const sukukGross = K.getAsset('kira-sertifikasi-sukuk')?.annualGrossRatePct || 36.5;
    const depGross = K.getAsset('mevduat-ust')?.annualGrossRatePct || 39.0;
    const ppfGross = K.getAsset('para-piyasasi-fonu')?.annualGrossRatePct || 38.5;

    const depStopaj = days > 365 ? 10 : (days > 180 ? 15 : 17.5);
    const sukukNetPct = +(sukukGross * (days / 365)).toFixed(2);
    const depNetPct = +((depGross * (1 - depStopaj / 100)) * (days / 365)).toFixed(2);
    const ppfDailyNet = (ppfGross / 100 / 365);
    const ppfGrossPeriod = Math.pow(1 + ppfDailyNet, days) - 1;
    const ppfNetPct = +((ppfGrossPeriod * (1 - 0.175)) * 100).toFixed(2);
    const infPeriodPct = +((Math.pow(1 + annualInf / 100, days / 365) - 1) * 100).toFixed(2);

    const sukukEndTL = Math.round(amt * (1 + sukukNetPct / 100));
    const depEndTL = Math.round(amt * (1 + depNetPct / 100));
    const ppfEndTL = Math.round(amt * (1 + ppfNetPct / 100));
    const infBarTL = Math.round(amt * (1 + infPeriodPct / 100));

    const bestSafeNetPct = Math.max(sukukNetPct, depNetPct, ppfNetPct);
    const bestSafeEndTL = Math.max(sukukEndTL, depEndTL, ppfEndTL);
    const bazaarFrictionFactor = 1 + (clock.bazaarSpreadPct / 100);
    const bankNightFrictionFactor = 1 + (3.60 / 100) + 0.002;

    const breakevenUsdBazaar = +(usdNow * (1 + bestSafeNetPct / 100) * bazaarFrictionFactor).toFixed(2);
    const breakevenUsdBankNight = +(usdNow * (1 + bestSafeNetPct / 100) * bankNightFrictionFactor).toFixed(2);
    const breakevenGoldBazaar = Math.round(goldNow * (1 + bestSafeNetPct / 100) * bazaarFrictionFactor);

    const bazaarGrams = +(amt / (goldNow * (1 + clock.bazaarSpreadPct / 200))).toFixed(3);
    const s1Grams = +(amt / Math.max(1, dInfo.s1GramEquiv)).toFixed(3);
    const extraGramsInBazaar = +(bazaarGrams - s1Grams).toFixed(3);
    const s1AirMoneyTL = Math.max(0, Math.round(extraGramsInBazaar * goldNow));

    return {
      amountTL: amt,
      horizonDays: days,
      usdNow: +usdNow.toFixed(2),
      goldNow: Math.round(goldNow),
      annualInf: +annualInf.toFixed(1),
      infPeriodPct,
      infBarTL,
      sukuk: { annualGross: sukukGross, stopaj: 0, netPeriodPct: sukukNetPct, endTL: sukukEndTL, netGainTL: sukukEndTL - amt },
      deposit: { annualGross: depGross, stopaj: depStopaj, netPeriodPct: depNetPct, endTL: depEndTL, netGainTL: depEndTL - amt },
      ppf: { annualGross: ppfGross, stopaj: 17.5, netPeriodPct: ppfNetPct, endTL: ppfEndTL, netGainTL: ppfEndTL - amt },
      bestSafeEndTL,
      bestSafeNetPct,
      breakevenUsdBazaar,
      breakevenUsdBankNight,
      breakevenGoldBazaar,
      goldArbitrage: {
        bazaarGrams,
        s1Grams,
        extraGramsInBazaar,
        s1PremiumPct: dInfo.premiumPct,
        s1AirMoneyTL
      }
    };
  }

  // --------------------------------------------------------------------------
  // 4. MAHALLE FIRINI / BANKA KASASI & 5-BOYUTLU ADLİ BİLANÇO RÖNTGENİ
  // --------------------------------------------------------------------------
  function computeBakery100kScale(asset, customAmountTL = 100000) {
    const r = asset?.bistRow;
    if (!r || !r.marketCapBillionTL || r.marketCapBillionTL <= 0) return null;
    if (isFinancialEntityRow(r)) return null;
    if (r.ocfMillionTL == null && r.fcfMillionTL == null) return null;

    const baseAmt = Math.max(1000, Number(customAmountTL) || 100000);
    const mcapMillion = r.marketCapBillionTL * 1000;
    const ratio = (baseAmt / 1e6) / mcapMillion;

    const rawOcfMillion = r.ocfMillionTL != null ? Number(r.ocfMillionTL) : Number(r.fcfMillionTL);
    const annualOcfTL = Math.round(rawOcfMillion * 1e6 * ratio);
    const dailyOcfTL = +(annualOcfTL / 365).toFixed(1);
    const rawCapexAbsMillion = Math.abs(Number(r.capexMillionTL) || 0);
    const annualCapexTL = Math.round(rawCapexAbsMillion * 1e6 * ratio);
    const rawFcfMillion = r.fcfMillionTL != null
      ? Number(r.fcfMillionTL)
      : (rawOcfMillion - rawCapexAbsMillion);
    const annualFcfTL = Math.round(rawFcfMillion * 1e6 * ratio);
    const cashShareTL = Math.round((Number(r.cashMillionTL) || 0) * 1e6 * ratio);
    const debtShareTL = Math.round((Number(r.totalDebtMillionTL) || 0) * 1e6 * ratio);
    const annualNetDivTL = Math.round(baseAmt * ((Number(r.dividendYield) || 0) / 100) * 0.85);
    const fmtBase = fmtInt(baseAmt);

    let plainSummary = '';
    if (annualOcfTL > 0 && annualFcfTL > 0 && cashShareTL >= debtShareTL) {
      plainSummary = `${fmtBase} ₺ ortak olduğunda fabrikanın kasasına senin payına günde +${fmtDec1(dailyOcfTL)} ₺ (yılda +${fmtInt(annualOcfTL)} ₺ esas nakit, fabrika yatırımı düşüldükten sonra net +${fmtInt(annualFcfTL)} ₺ serbest nakit) giriyor ve hazır nakdi borcundan fazla!`;
    } else if (annualOcfTL > 0 && annualFcfTL > 0) {
      plainSummary = `${fmtBase} ₺ ortaklığa karşılık kasaya yılda +${fmtInt(annualOcfTL)} ₺ faaliyet nakdi ve yatırım harcamaları sonrası cebine +${fmtInt(annualFcfTL)} ₺ saf serbest nakit (FCF) kalıyor.`;
    } else if (annualOcfTL > 0 && annualFcfTL <= 0) {
      plainSummary = `${fmtBase} ₺ ortaklığa karşılık esas işten yılda +${fmtInt(annualOcfTL)} ₺ nakit giriyor; ancak şirket ${fmtInt(annualCapexTL)} ₺ yeni tesis yatırımı (CAPEX) yaptığı için serbest nakit henüz yatırıma harcanıyor.`;
    } else if (annualOcfTL === 0) {
      plainSummary = `${fmtBase} ₺ ortaklığa karşılık şirketin son 12 aylık esas faaliyet nakit akışı başabaş (~0 ₺) seyrediyor${debtShareTL > 0 ? ` (Sırtına binen borç payı: ${fmtInt(debtShareTL)} ₺)` : ''}.`;
    } else {
      plainSummary = `Dikkat: ${fmtBase} ₺ ortaklığa karşılık şirketin esas faaliyet kasasından yılda ${fmtInt(Math.abs(annualOcfTL))} ₺ nakit eksiliyor (Sırtına binen borç payı: ${fmtInt(debtShareTL)} ₺).`;
    }

    return {
      partnerBaseTL: Math.round(baseAmt),
      annualOcfTL,
      dailyOcfTL,
      annualCapexTL,
      annualFcfTL,
      cashShareTL,
      debtShareTL,
      annualNetDivTL,
      plainSummary
    };
  }

  function computeFinancial100kScale(asset, customAmountTL = 100000) {
    const r = asset?.bistRow;
    if (!r || !isFinancialEntityRow(r) || !r.marketCapBillionTL || r.marketCapBillionTL <= 0) return null;
    const baseAmt = Math.max(1000, Number(customAmountTL) || 100000);
    const mcapMillion = r.marketCapBillionTL * 1000;
    const ratio = (baseAmt / 1e6) / mcapMillion;
    const annualNetProfitTL = Math.round((Number(r.netIncomeMillionTL) || 0) * 1e6 * ratio);
    const dailyNetProfitTL = +(annualNetProfitTL / 365).toFixed(1);
    const annualNetDivTL = Math.round(baseAmt * ((Number(r.dividendYield) || 0) / 100) * 0.85);
    const roePct = r.roe != null ? +Number(r.roe).toFixed(1) : null;
    const fmtBase = fmtInt(baseAmt);
    const plainSummary = annualNetProfitTL > 0
      ? `${fmtBase} ₺ ortak olduğunda kurum senin payına yılda +${fmtInt(annualNetProfitTL)} ₺ (günde +${fmtDec1(dailyNetProfitTL)} ₺) net dönem kârı üretiyor${roePct != null ? ` (Özsermaye Kârlılığı: %${roePct})` : ''}.`
      : `Dikkat: ${fmtBase} ₺ ortaklığa karşılık kurum son 12 ayda ${fmtInt(Math.abs(annualNetProfitTL))} ₺ net zarar yazdı.`;

    return {
      partnerBaseTL: Math.round(baseAmt),
      annualNetProfitTL,
      dailyNetProfitTL,
      annualNetDivTL,
      roePct,
      pe: r.pe,
      pb: r.pb,
      plainSummary
    };
  }

  function computeDeepForensicXray(assetOrKey, customPartnerTL = 100000) {
    const K = global.AetherKernelV10;
    const asset = typeof assetOrKey === 'string' ? K?.getAsset(assetOrKey) : assetOrKey;
    if (!asset || !K) return null;

    const partnerTL = Math.max(1000, Math.round(Number(customPartnerTL) || 100000));
    const inf = K.getAnnualInflationPct();
    const r = asset.bistRow || null;
    const kitchenFindings = [];

    if (asset.tms29Record) {
      kitchenFindings.push({
        badge: asset.tms29Record.verdict || 'TMS-29 Denetimi',
        tone: asset.tms29Record.kind === 'CASH_CHAMPION' ? 'good' : 'danger',
        note: asset.tms29Record.auditNote
      });
    }
    if (asset.vukRecord) {
      kitchenFindings.push({
        badge: asset.vukRecord.kind === 'VUK_CASH_LEADER' ? '🟢 VUK Saf Fatura Nakdi Lideri' : '⛔ VUK / Tahvil İtfa Alarmı',
        tone: asset.vukRecord.kind === 'VUK_CASH_LEADER' ? 'good' : 'danger',
        note: asset.vukRecord.vukVerdict || asset.vukRecord.auditWarning || asset.vukRecord.bondDeskNote
      });
    }
    if (asset.mkkAlert) {
      const mkkTone = asset.mkkAlert.kind === 'LOT_EXPANSION' || asset.mkkAlert.kind === 'HIGH_DILUTION' ? 'danger' : 'good';
      const mkkBadge = asset.mkkAlert.kind === 'LOT_EXPANSION'
        ? '🕵️ MKK Tipe Dönüşüm / Patron Arzı'
        : (asset.mkkAlert.kind === 'TIGHT_FLOAT' ? '🔒 MKK Sınırlı Dolaşım Kalesi' : '🕵️ MKK Pay İzi');
      kitchenFindings.push({ badge: mkkBadge, tone: mkkTone, note: asset.mkkAlert.note });
    }
    if (asset.capexRecord) {
      kitchenFindings.push({
        badge: asset.capexRecord.kind === 'CAPEX_HARVEST' ? '🏭 CAPEX Nakit Hasadı Başladı' : (asset.capexRecord.kind === 'EVA_MOAT' ? '💎 Yüksek ROIC Hendek Şampiyonu' : '🏗️ Özkaynakla Büyüyen Tesis & Vergi Kalkanı'),
        tone: 'good',
        note: asset.capexRecord.harvestNote || asset.capexRecord.evaNote || asset.capexRecord.shieldNote
      });
    }
    if (asset.forensicPattern) {
      kitchenFindings.push({
        badge: `📐 Tahta İzi: ${asset.forensicPattern.patternLabel}`,
        tone: asset.forensicPattern.tone || 'info',
        note: asset.forensicPattern.forensicNote
      });
    }
    if (asset.whaleRecord) {
      kitchenFindings.push({
        badge: '🐋 Hazirun & Kurumsal Balina Emilimi',
        tone: 'good',
        note: asset.whaleRecord.whaleSignal
      });
    }
    if (asset.bddkRecord) {
      kitchenFindings.push({
        badge: '🏦 BDDK Haftalık Banka Masası',
        tone: 'info',
        note: asset.bddkRecord.bddkSignal
      });
    }
    if (asset.legalArbRecord) {
      kitchenFindings.push({
        badge: '⚖️ Özsermaye / Defter Tabanı İskontosu',
        tone: 'good',
        note: asset.legalArbRecord.legalNote
      });
    }
    if (asset.fxFortressRecord) {
      kitchenFindings.push({
        badge: '🛡️ Çeyrek Sonu 15:30 Döviz/Nakit Kalesi',
        tone: 'good',
        note: asset.fxFortressRecord.fxNote
      });
    }
    if (asset.epiasRecord) {
      kitchenFindings.push({
        badge: '⚡ EPİAŞ Saatlik Üretim & PTF Masası',
        tone: 'info',
        note: asset.epiasRecord.fieldNote
      });
    }
    if (asset.insFieldRecord) {
      kitchenFindings.push({
        badge: '☂️ TSB Aylık Poliçe & Float Masası',
        tone: 'good',
        note: asset.insFieldRecord.fieldNote
      });
    }
    if (asset.tierPromoRecord) {
      kitchenFindings.push({
        badge: '🏛️ BIST Üst Pazar / Endeks Terfi Adayı',
        tone: 'good',
        note: asset.tierPromoRecord.catalyst
      });
    }
    if (asset.fundTrimRecord) {
      kitchenFindings.push({
        badge: '⚠️ Fon Yasal Tavan / Zorunlu Azaltım İzlemesi',
        tone: 'warn',
        note: asset.fundTrimRecord.note || asset.fundTrimRecord.alert || 'Yatırım fonu yasal konsantrasyon sınırı izlenmeli.'
      });
    }
    if (asset.trueSignalRecord) {
      kitchenFindings.push({
        badge: asset.trueSignalRecord.verdictBadge || '🎯 Öncü Mutfak Sinyali',
        tone: 'good',
        note: `${asset.trueSignalRecord.summary} (Öncü Kaynak: ${asset.trueSignalRecord.primaryKitchenSource})`
      });
    }
    if (asset.trapAlertRecord) {
      kitchenFindings.push({
        badge: asset.trapAlertRecord.verdictBadge || '⛔ Değer / Tasfiye Tuzağı',
        tone: 'danger',
        note: asset.trapAlertRecord.summary
      });
    }
    if (asset.anomalyEvent) {
      kitchenFindings.push({
        badge: asset.anomalyEvent.badge || '⚡ Canlı Hacim Anomalisi',
        tone: 'info',
        note: asset.anomalyEvent.detail
      });
    }

    // 1) BANKA / SİGORTA / FİNANS KURUMLARI RÖNTGENİ
    if (r && isFinancialEntityRow(r)) {
      const fn = computeFinancial100kScale(asset, partnerTL);
      const hasFinData = r.roe != null || r.netIncomeMillionTL != null || r.pb != null;
      const roe = Number(r.roe) || 0;
      const pb = r.pb != null ? Number(r.pb) : 1.2;
      const pe = r.pe != null ? Number(r.pe) : 6.0;
      const cmf = Number(r.cmf20) || 0;
      const floatPct = Number(r.floatPct) || 35;

      const p1 = !hasFinData ? 56 : (roe >= inf ? 92 : (roe >= inf * 0.75 ? 78 : (roe > 0 ? 55 : 28)));
      const p2 = !hasFinData ? 58 : (pb <= 0.85 && roe > 15 ? 92 : (pb <= 1.35 ? 80 : (pb <= 2.2 ? 64 : 42)));
      const p3 = !hasFinData ? 56 : ((r.netIncomeMillionTL || 0) > 0 ? ((r.dividendYield || 0) >= 3 ? 90 : 78) : 30);
      const p4 = floatPct <= 25 ? 88 : (floatPct <= 50 ? 75 : 58);
      const p5 = asset.isPatronSelling ? 30 : (cmf >= 0.12 ? 90 : (cmf >= 0 ? 72 : 46));
      const overallScore = Math.round(p1 * 0.28 + p2 * 0.24 + p3 * 0.20 + p4 * 0.12 + p5 * 0.16);

      const valueTrapVerdict = !hasFinData
        ? 'ℹ️ Yeni Kotasyon / KAP Dönem Verisi Bekleniyor: İlk tam yıllık BDDK/KAP mali tabloları açıklanana kadar kademeli ve temkinli izlenmeli.'
        : ((pb < 0.8 && roe < 10)
          ? '⚠️ Düşük PD/DD ama özsermaye kârlılığı enflasyonun çok altında (Ucuzluk tek başına yetmez).'
          : (pb <= 1.3 && roe >= inf * 0.8
            ? '🟢 Güçlü Özsermaye Çarkı: Defter değerine yakın/iskontolu çarpanla özsermayesini hızla büyütüyor.'
            : '⚖️ Makul Çarpan Dengesi: Faiz indirim ve BDDK marj döngüsüyle izlenmeli.'));

      return {
        kind: 'FINANCIAL_XRAY',
        overallScore,
        gradeLabel: overallScore >= 84 ? 'A · Güçlü Finans Kasası' : (overallScore >= 70 ? 'B+ · Sağlam Kurum' : (overallScore >= 55 ? 'C · Döngüsel Finans' : 'D · Zayıf Kârlılık')),
        tone: overallScore >= 75 ? 'good' : (overallScore >= 55 ? 'info' : 'warn'),
        partnerScale: fn,
        valueTrapVerdict,
        pillars: [
          {
            label: 'Özsermaye Çarkı (ROE vs TÜFE)',
            score: p1,
            metric: !hasFinData ? `KAP ROE Bekleniyor · TÜFE %${inf.toFixed(1)}` : `ROE %${roe ? roe.toFixed(1) : '-'} · TÜFE %${inf.toFixed(1)}`,
            explain: !hasFinData
              ? 'Yeni kotasyon tahtası; ilk tam yıllık KAP özsermaye kârlılığı verisi takip edilmeli.'
              : (roe >= inf
                ? 'Özsermayesini yıllık enflasyonun üzerinde büyütüyor; reel değer üretiyor.'
                : 'Banka/finans şirketinde özsermaye büyümesi enflasyonun altında kalırsa reel sermaye aşınır.')
          },
          {
            label: 'Defter & Kazanç Terazisi',
            score: p2,
            metric: `PD/DD ${r.pb ?? '-'}x · F/K ${r.pe ?? '-'}x`,
            explain: 'PD/DD 1.0x altı kurumun kendi özkaynağından bile iskontolu fiyatlandığını gösterir.'
          },
          {
            label: 'Net Kâr & Temettü Üretimi',
            score: p3,
            metric: !hasFinData ? 'İlk KAP Bilançosu Bekleniyor' : `Net Kâr ${(r.netIncomeMillionTL || 0).toLocaleString('tr-TR')}M ₺ · Temettü %${(r.dividendYield || 0).toFixed(1)}`,
            explain: fn ? fn.plainSummary : (!hasFinData ? 'KAP tam dönem kâr/zarar tablosu ve BDDK bülteni izlenmeli.' : 'Son 12 aylık net kâr performansı.')
          },
          {
            label: 'MKK Fiili Dolaşım Yapısı',
            score: p4,
            metric: `Dolaşım %${floatPct.toFixed(1)} · FDPD ${Math.round(r.fdpdMillionTL || 0).toLocaleString('tr-TR')}M ₺`,
            explain: floatPct <= 25 ? 'Sınırlı fiili dolaşım kurumsal alımlarda tahtayı güçlü tutar.' : 'Orta/geniş halka açıklık oranı.'
          },
          {
            label: 'Tahta & Kurumsal Para İzi',
            score: p5,
            metric: `CMF-20 ${cmf >= 0 ? '+' : ''}${cmf.toFixed(2)} · Hacim ${(r.volRatio || 1).toFixed(2)}x · RSI ${r.rsi ?? '-'}`,
            explain: cmf >= 0.10 ? 'Son 20 günde tahtaya net kurumsal para girişi var.' : (cmf <= -0.10 ? 'Tahtada kurumsal satış / dağıtım baskısı izleniyor.' : 'Alıcı ve satıcı dengeli.')
          }
        ],
        kitchenFindings
      };
    }

    // 2) REEL ŞİRKET / SANAYİ / HİZMET / GYO / HOLDİNG 5-BOYUTLU ADLİ RÖNTGENİ
    if (r) {
      const bk = computeBakery100kScale(asset, partnerTL);
      const hasOcf = r.ocfMillionTL != null || r.fcfMillionTL != null;
      const hasNetInc = r.netIncomeMillionTL != null;
      const hasCashFlow = hasOcf || hasNetInc;
      const hasBalanceSheet = r.cashMillionTL != null || r.totalDebtMillionTL != null || r.netDebtMillionTL != null;
      const ocf = Number(r.ocfMillionTL) || 0;
      const netInc = Number(r.netIncomeMillionTL) || 0;
      const capexAbs = Math.abs(Number(r.capexMillionTL) || 0);
      const fcf = r.fcfMillionTL != null ? Number(r.fcfMillionTL) : (ocf - capexAbs);
      const cash = Number(r.cashMillionTL) || 0;
      const debt = Number(r.totalDebtMillionTL) || 0;
      const netDebt = (r.netDebtMillionTL != null && Number.isFinite(Number(r.netDebtMillionTL)))
        ? Number(r.netDebtMillionTL)
        : (debt - cash);
      const ndEbitda = r.netDebtToEbitda != null ? Number(r.netDebtToEbitda) : null;
      const curRatio = r.currentRatio != null ? Number(r.currentRatio) : null;
      const sloan = r.sloanAccrualPct != null ? Number(r.sloanAccrualPct) : null;
      const cashConv = r.cashConversionRatio != null ? Number(r.cashConversionRatio) : ((hasOcf && netInc > 0) ? +(ocf / netInc).toFixed(2) : null);
      const roic = r.roic != null ? Number(r.roic) : null;
      const evEbitda = r.evEbitda != null ? Number(r.evEbitda) : null;
      const cmf = Number(r.cmf20) || 0;
      const floatPct = Number(r.floatPct) || 35;

      // Sütun 1: Kasa & Serbest Nakit (OCF & FCF)
      let p1 = 55;
      if (hasOcf) {
        if (ocf > 0 && fcf > 0) p1 = 92;
        else if (ocf > 0 && fcf <= 0) p1 = 74;
        else if (ocf <= 0 && fcf < 0) p1 = 26;
      } else if (hasNetInc) {
        p1 = netInc > 0 ? 68 : 38;
      }

      // Sütun 2: TMS-29 & VUK Gerçeklik Testi
      let p2 = hasOcf ? 68 : (hasNetInc ? (netInc > 0 ? 66 : 42) : 56);
      let tmsExplain = hasOcf
        ? 'Kâr ile kasaya giren nakit birbiriyle uyumlu seyrediyor.'
        : (hasNetInc
          ? 'Dönem net sonucu açıklandı; TMS-29 nakit dönüşüm kalitesi için KAP konsolide nakit akış dipnotu izlenmeli.'
          : 'Yeni kotasyon / tam dönem KAP finansalları bekleniyor; izahname ve VUK beyannamesi takip edilmeli.');
      if (hasOcf) {
        if (ocf > 0 && (sloan != null && sloan < -5 || (cashConv != null && cashConv >= 1.35))) {
          p2 = 94;
          tmsExplain = 'Gizli Nakit Kalitesi: Kasaya giren gerçek faaliyet nakdi, manşetteki kağıt net kârdan çok daha yüksek!';
        } else if ((hasNetInc && netInc > 0 && ocf < 0) || asset.isTms29Illusion || (sloan != null && sloan > 18)) {
          p2 = 24;
          tmsExplain = 'Makyajlı Kâr Alarmı: Kağıt üstünde kâr görünüyor ama kasadan gerçek nakit çıkıyor (TMS-29 veya tahsil edilemeyen alacak etkisi)!';
        } else if (ocf < 0 && netInc <= 0) {
          p2 = 34;
          tmsExplain = 'Şirket hem bilançoda zarar yazıyor hem de kasadan nakit yakıyor.';
        }
      }

      // Sütun 3: Değerleme, ROIC & Değer Tuzağı Testi
      let p3 = 65;
      const pb = r.pb != null ? Number(r.pb) : null;
      const pe = r.pe != null ? Number(r.pe) : null;
      const dd52 = Number(r.drawdown52WPct) || 0;
      if ((pb != null && pb <= 1.5 || (evEbitda != null && evEbitda > 0 && evEbitda <= 7.5)) && (hasOcf ? ocf > 0 : netInc > 0)) {
        p3 = (roic != null && roic >= 15) ? 93 : 85;
      } else if (pb != null && pb > 6.5 && (roic == null || roic < 15)) {
        p3 = 34;
      } else if (hasOcf && ocf <= 0 && pb != null && pb < 1.0) {
        p3 = 40; // Ucuz görünümlü değer tuzağı!
      }

      // Sütun 4: Borç & Yüksek Faiz Zırhı
      let p4 = hasBalanceSheet ? 66 : 56;
      if (hasBalanceSheet) {
        if (netDebt < 0 || (cash > debt && cash > 0)) p4 = 95;
        else if (netDebt === 0) p4 = (curRatio != null && curRatio < 0.85) ? 58 : 86;
        else if (ndEbitda != null && ndEbitda > 0 && ndEbitda <= 2.2 && (curRatio == null || curRatio >= 1.2)) p4 = 84;
        else if ((ndEbitda != null && ndEbitda >= 4.5) || (curRatio != null && curRatio < 0.85 && debt > cash * 2)) p4 = 28;
      }

      // Sütun 5: MKK Takas & Tahta Para İzi
      let p5 = 65;
      if (asset.isPatronSelling || asset.isPumpAnomaly) p5 = 24;
      else if (asset.isShareBuyback && cmf >= 0.05) p5 = 94;
      else if (cmf >= 0.12) p5 = 88;
      else if (cmf <= -0.15) p5 = 38;

      const overallScore = Math.round(p1 * 0.28 + p2 * 0.20 + p3 * 0.20 + p4 * 0.18 + p5 * 0.14);

      let valueTrapVerdict = !hasCashFlow && !hasBalanceSheet
        ? 'ℹ️ Yeni Kotasyon / KAP Dönem Verisi Bekleniyor: Tam yıllık nakit akışı ve dipnotlar açıklanana kadar izahname fon kullanım raporu esas alınmalı.'
        : '⚖️ Dengeli Fiyatlama: Çarpanları ile nakit üretimi paralel seyrediyor.';
      if (overallScore >= 82 && dd52 <= -20 && ocf > 0) {
        valueTrapVerdict = `🔥 Gerçek Yangın Yeri Hazinesi: Zirvesinden %${Math.abs(Math.round(dd52))} düşmüş olmasına rağmen kasası gerçek nakit basıyor!`;
      } else if ((pb != null && pb < 1.1 || dd52 <= -35) && hasOcf && ocf < 0) {
        valueTrapVerdict = '⛔ Çürük Ucuz (Değer Tuzağı Riski): Fiyatı çok düşmüş veya PD/DD düşük görünüyor ama kasadan nakit yaktığı için ucuzluk yanıltıcı olabilir!';
      } else if (pb != null && pb > 6 && hasOcf && ocf <= 0) {
        valueTrapVerdict = '⛔ Aşırı Pahalı Hikaye: Kasada nakit üretimi yokken çok yüksek çarpanla fiyatlanıyor.';
      } else if (overallScore >= 80) {
        valueTrapVerdict = '🟢 Kaliteli Bileşik Kasa: Sağlam nakit üretimi ve kontrol altındaki borç yapısıyla uzun vadeli ortaklığa uygun.';
      }

      return {
        kind: 'COMPANY_XRAY',
        overallScore,
        gradeLabel: overallScore >= 84 ? 'A+ · Kaya Gibi Kasa' : (overallScore >= 72 ? 'A · Sağlam İşletme' : (overallScore >= 58 ? 'B · Seçici / Döngüsel' : (overallScore >= 44 ? 'C · Borç / Nakit Baskısı' : 'D · Yüksek Tuzak Riski'))),
        tone: overallScore >= 74 ? 'good' : (overallScore >= 56 ? 'info' : (overallScore >= 42 ? 'warn' : 'danger')),
        partnerScale: bk,
        valueTrapVerdict,
        pillars: [
          {
            label: '1. Mahalle Fırını & Serbest Nakit (FCF)',
            score: p1,
            metric: !hasOcf
              ? (hasNetInc ? `KAP Konsolide OCF Bekleniyor · Net Kâr ${netInc >= 0 ? '+' : ''}${netInc.toLocaleString('tr-TR')}M ₺` : 'İlk KAP Nakit Tablosu Bekleniyor')
              : (ocf === 0 && fcf === 0
                ? 'Başabaş Kasa (~0M ₺ OCF / FCF)'
                : `OCF ${ocf >= 0 ? '+' : ''}${ocf.toLocaleString('tr-TR')}M ₺ · FCF ${fcf >= 0 ? '+' : ''}${fcf.toLocaleString('tr-TR')}M ₺`),
            explain: !hasOcf
              ? (hasNetInc
                ? 'Bilançoda net dönem sonucu açıklandı; konsolide esas faaliyet nakit akışı KAP dipnotundan teyit edilmelidir.'
                : 'Yeni kotasyon tahtası; ilk tam yıllık KAP nakit akış tablosu ve fon kullanım raporu izlenmeli.')
              : (fcf > 0
                ? `Fabrika bakım/yatırım masrafı (${capexAbs.toLocaleString('tr-TR')}M ₺) ödendiği halde kasada net serbest nakit kalıyor.`
                : (ocf > 0
                  ? 'Esas işten nakit giriyor ama tamamı yeni tesis yatırımına (CAPEX) harcanıyor.'
                  : (ocf === 0 && fcf === 0
                    ? 'Esas faaliyet nakit akışı başabaş (~0M ₺) düzeyinde; henüz belirgin serbest nakit fazlası oluşmadı.'
                    : 'Esas faaliyetten nakit üretilemiyor; kasa nakit yakıyor.')))
          },
          {
            label: '2. TMS-29 & VUK Gerçeklik Testi',
            score: p2,
            metric: !hasCashFlow
              ? 'KAP / VUK Dönem Beyanı Bekleniyor'
              : (!hasOcf
                ? `Net Kâr ${netInc >= 0 ? '+' : ''}${netInc.toLocaleString('tr-TR')}M ₺ · OCF Dipnotu Bekleniyor`
                : `Net Kâr ${hasNetInc ? netInc.toLocaleString('tr-TR') + 'M ₺' : '-'}${cashConv != null ? ` · Nakit/Kâr ${cashConv}x` : ''}${sloan != null ? ` · Sloan %${sloan}` : ''}`),
            explain: tmsExplain
          },
          {
            label: '3. Çarpan, ROIC & Ucuzluk Terazisi',
            score: p3,
            metric: `F/K ${pe ?? '-'} · PD/DD ${pb ?? '-'} · FD/FAVÖK ${evEbitda ?? '-'}${roic != null ? ` · ROIC %${roic}` : ''}`,
            explain: roic != null
              ? `Yatırılan sermaye getirisi (ROIC) %${roic}; iyi bir fabrika yatırdığı sermayeden reel getiri üretmelidir.`
              : 'FD/FAVÖK şirketin borcu dahil kaç yıllık işletme kârına satıldığını gösterir (<7x makul).'
          },
          {
            label: '4. Borç Yükü & Uyku Rahatlığı',
            score: p4,
            metric: !hasBalanceSheet
              ? 'KAP Bilanço Borç/Nakit Dipnotu Bekleniyor'
              : (netDebt < 0
                ? `Net Nakit +${Math.abs(netDebt).toLocaleString('tr-TR')}M ₺ · Cari Oran ${curRatio ?? '-'}`
                : (netDebt === 0
                  ? `Finansal Borçsuz Kasa (Net Borç 0M ₺) · Cari Oran ${curRatio ?? '-'}`
                  : `Net Borç ${netDebt.toLocaleString('tr-TR')}M ₺${ndEbitda != null && ndEbitda > 0 ? ` (${ndEbitda}x FAVÖK)` : ''} · Cari ${curRatio ?? '-'}`)),
            explain: !hasBalanceSheet
              ? 'Yeni kotasyon / ara dönem borç-nakit kırılımı KAP dipnotlarından teyit edilmelidir.'
              : (netDebt < 0
                ? 'Kasadaki hazır nakit tüm banka borçlarından fazla! Yüksek faiz kışında faiz ödemez, faiz kazanır.'
                : (netDebt === 0
                  ? 'Şirketin net finansal banka borcu bulunmuyor; faiz yükü baskısı taşımıyor.'
                  : (ndEbitda != null && ndEbitda > 4 ? 'Dikkat: Net borcunu 4 yıldan uzun sürede kapatabiliyor; yüksek faiz kârı kemirir.' : 'Borç seviyesi faaliyet kârıyla yönetilebilir sınırda.')))
          },
          {
            label: '5. MKK Takas & Akıllı Para İzi',
            score: p5,
            metric: `Dolaşım %${floatPct.toFixed(1)} · CMF ${cmf >= 0 ? '+' : ''}${cmf.toFixed(2)} · Hacim ${(r.volRatio || 1).toFixed(2)}x · RSI ${r.rsi ?? '-'}`,
            explain: asset.isPatronSelling
              ? 'Alarm: MKK kayıtlarında dolaşımdaki pay adedi arttı (ortak/patron satış hazırlığı)!'
              : (cmf >= 0.12 ? 'Tahtada güçlü kurumsal para girişi (toplama) izi var.' : (cmf <= -0.12 ? 'Tahtada kurumsal mal dağıtımı (çıkış) izi var.' : 'Tahta akışı nötr dengede.'))
          }
        ],
        kitchenFindings
      };
    }

    // 3) SABİT GETİRİ / ALTIN / DÖVİZ / KÜRESEL ETF ÖZEL TERAZİSİ
    const be = computeBreakevenComparison(partnerTL, 32);
    if (asset.isRateInstrument) {
      const netAnnual = +(asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100)).toFixed(2);
      const realSpread = +(netAnnual - inf).toFixed(2);
      const monthlyNetTL = Math.round((partnerTL * (netAnnual / 100)) / 12);
      const score = realSpread >= 2 ? 90 : (realSpread >= -1 ? 76 : 48);
      return {
        kind: 'MACRO_INSTRUMENT_XRAY',
        overallScore: score,
        gradeLabel: score >= 85 ? 'A · Pozitif Reel Nakit Zırhı' : (score >= 70 ? 'B+ · Likidite Kalkanı' : 'C · Enflasyon Altı Getiri'),
        tone: realSpread >= 0 ? 'good' : 'warn',
        valueTrapVerdict: realSpread >= 0
          ? `🟢 Vergi sonrası yıllık net %${netAnnual} getiri, mevcut %${inf.toFixed(1)} TÜFE enflasyonunun +${realSpread} puan üzerinde reel alım gücü üretiyor.`
          : `⚠️ Vergi sonrası net %${netAnnual} getiri, %${inf.toFixed(1)} enflasyonun gerisinde kalıyor.`,
        pillars: [
          { label: 'Stopaj Sonrası Net Akış', score, metric: `Brüt %${asset.annualGrossRatePct.toFixed(1)} -> Net %${netAnnual}`, explain: `${partnerTL.toLocaleString('tr-TR')} ₺ bağlandığında ayda net +${monthlyNetTL.toLocaleString('tr-TR')} ₺ kasana damlar.` },
          { label: '32 Günlük Dolar Başabaş Kuru', score: 85, metric: `Başabaş: ${be.breakevenUsdBazaar} ₺`, explain: `Dolar 32 gün sonra ${be.breakevenUsdBazaar} ₺ seviyesini aşmazsa bu sabit getiri aracı dolardan daha çok kazandırır!` },
          { label: 'Valör & Erken Bozum Kuralı', score: asset.subVenue === 'TERM_DEPOSIT' ? 62 : 90, metric: asset.subVenue === 'TERM_DEPOSIT' ? 'Vade Kilidi Var' : (asset.venue === 'TEFAS' ? '13:30 TEFAS Valörü' : 'İkincil Piyasa Likit'), explain: asset.subVenue === 'TERM_DEPOSIT' ? 'Vadeden 1 gün bile önce bozarsan biriken tüm faiz sıfırlanır!' : 'Vade yanma cezası olmadan valör kuralıyla nakde döner.' }
        ],
        kitchenFindings
      };
    }

    const dInfo = K.getDarphanePremiumInfo();
    const isS1 = asset.subVenue === 'DARPHANE_S1';
    const score = isS1 && dInfo.premiumPct >= 7 ? 38 : (asset.stopajPct >= 17.5 ? 68 : 84);
    return {
      kind: 'MACRO_INSTRUMENT_XRAY',
      overallScore: score,
      gradeLabel: isS1 && dInfo.premiumPct >= 7 ? 'D · Şişik Hava Parası Primi' : (score >= 80 ? 'A · Küresel / Fiziki Değer Kalkanı' : 'B · Stopaj Sürtünmeli Fon'),
      tone: isS1 && dInfo.premiumPct >= 7 ? 'danger' : (score >= 75 ? 'good' : 'info'),
      valueTrapVerdict: isS1 && dInfo.premiumPct >= 5
        ? `⛔ Hava Parası Uyarısı: 100 adet ALTIN.S1 (${Math.round(dInfo.s1GramEquiv).toLocaleString('tr-TR')} ₺), Kapalıçarşı 1 gr fiziki altından (${Math.round(dInfo.spotGramPrice).toLocaleString('tr-TR')} ₺) +%${dInfo.premiumPct} daha pahalı!`
        : (asset.stopajPct > 0
          ? `⚖️ Satış kârından %${asset.stopajPct} stopaj kesilir; %0 vergili alternatiflerle net terazi karşılaştırılmalıdır.`
          : (asset.isGvk80
            ? '🌍 Yİ-ÜFE üretici enflasyonu alış-satış arasında %10’u aşarsa TL maliyetin enflasyonla düzeltilir; kur köpüğüne değil sadece reel kazanca vergi çıkar.'
            : '🛡️ %0 stopaj avantajıyla alım-satım makası doğru gişeden yönetildiğinde net değer korur.')),
      pillars: [
        {
          label: 'Vergi & Stopaj Verimliliği',
          score: asset.stopajPct === 0 ? 92 : 62,
          metric: asset.stopajPct > 0 ? `%${asset.stopajPct} Stopaj` : (asset.isGvk80 ? 'GVK 80 (Yİ-ÜFE Endeksli)' : '%0 Stopaj'),
          explain: asset.taxNote || 'Türkiye gerçek vergi mevzuatı birebir uygulanır.'
        },
        {
          label: 'Gişe Makası / Prim Kontrolü',
          score: isS1 && dInfo.premiumPct >= 7 ? 28 : 84,
          metric: isS1 ? `Çarşıya Göre +%${dInfo.premiumPct}` : (asset.venue === 'TWO_DOOR' ? 'Çarşı %0,40 vs Gece Banka %3,60' : 'Borsa / Küresel Kotasyon'),
          explain: isS1
            ? `${partnerTL.toLocaleString('tr-TR')} ₺ ile Kapalıçarşı’dan alsan +${be.goldArbitrage.extraGramsInBazaar} gr (~${be.goldArbitrage.s1AirMoneyTL.toLocaleString('tr-TR')} ₺) daha fazla gerçek altın alırsın!`
            : 'Alırken ödediğin makas, maça kaç sıfır geride başladığını belirler.'
        },
        {
          label: '32 Günlük Sabit Getiri Terazisi',
          score: 78,
          metric: `32G Sukuk Eşiği: +%${be.sukuk.netPeriodPct}`,
          explain: `Önümüzdeki 32 günde TL karşılığı en az +%${be.sukuk.netPeriodPct} yükselmezse %0 vergili Kamu Sukuk daha yüksek net TL bırakır.`
        }
      ],
      kitchenFindings
    };
  }

  // --------------------------------------------------------------------------
  // 5. EMİR ÖNCESİ "DOSTUN 3 SANİYELİK TERAZİ KONTROLÜ" (SOKRATİK UYARI)
  // --------------------------------------------------------------------------
  function getPreTradeMentorCheck(params = {}) {
    const K = global.AetherKernelV10;
    if (!K) return null;
    const asset = K.getAsset(params.assetKey);
    if (!asset) return null;
    const amt = Math.max(1000, Number(params.amountTL) || 100000);
    const clock = K.getTurkishClock();
    const dInfo = K.getDarphanePremiumInfo();
    const be = computeBreakevenComparison(amt, 32);

    if (asset.subVenue === 'DARPHANE_S1' && dInfo.premiumPct >= 5) {
      const lostTL = Math.round(amt * (dInfo.premiumPct / (100 + dInfo.premiumPct)));
      return {
        tone: 'danger',
        title: `Dostun Uyarısı: +%${dInfo.premiumPct} Hava Parası Ödüyorsun!`,
        text: `${amt.toLocaleString('tr-TR')} ₺ ile ALTIN.S1 aldığında Kapalıçarşı fiziki altına göre tam ${lostTL.toLocaleString('tr-TR')} ₺ fazladan hava parası veriyorsun. Prim sönerse altın düşmese bile zarar yazar.`,
        altAssetKey: 'gram-altin-spot',
        altLabel: 'Fiziki Gram Altına Geç'
      };
    }

    if (asset.venue === 'TWO_DOOR' && params.door === 'BANK' && !clock.bankDaytimeTight) {
      const nightLoss = Math.round(amt * (clock.bankSpreadPct / 200 + 0.002));
      const dayBazaarLoss = Math.round(amt * (clock.bazaarSpreadPct / 200));
      return {
        tone: 'warn',
        title: 'Mesai Dışı Gece Makası Açık!',
        text: `Şu an mobil bankada makas %${clock.bankSpreadPct.toFixed(2)} + %0,2 vergi: Daha tuşa bastığın saniye ~${nightLoss.toLocaleString('tr-TR')} ₺ eriyecek (Gündüz Kapalıçarşı’da sadece ~${dayBazaarLoss.toLocaleString('tr-TR')} ₺).`,
        altAssetKey: null,
        altLabel: null
      };
    }

    if (asset.subVenue === 'BIST_TAXABLE_ETF' && asset.stopajPct >= 17.5) {
      return {
        tone: 'info',
        title: '%17,5 Stopaj Sürtünmesini Unutma',
        text: `${asset.ticker} satış kârından %17,5 stopaj kesilir (100B ₺ kârın 17.500 ₺’si vergiye gider). Hisse yoğun BYF’lerde (ZPBDL, APX30, Z30KP) ve fiziki altında ise stopaj %0’dır.`,
        altAssetKey: asset.id.includes('altin') ? 'gram-altin-spot' : null,
        altLabel: asset.id.includes('altin') ? 'Fiziki Gram (%0 Vergi)' : null
      };
    }

    if (asset.isPatronSelling || asset.isTms29Illusion || asset.isPumpAnomaly) {
      let msg = 'Bu tahtada kurumsal satış veya bilanço nakit zayıflığı sinyali var.';
      if (asset.isPatronSelling && asset.mkkAlert) msg = asset.mkkAlert.note;
      else if (asset.isTms29Illusion) msg = 'Şirket kağıt üstünde kâr açıklasa da esas faaliyet kasasından gerçek nakit çıkıyor (TMS-29 illüzyonu).';
      else if (asset.isPumpAnomaly) msg = 'Olağandışı hacim şişmesi ve kurumsal para çıkışı tespit edildi — sürü coşkusuyla tepeden yakalanma!';
      return {
        tone: 'danger',
        title: 'Mutfak Radarı Kırmızı Bayrak Yakaladı',
        text: msg,
        altAssetKey: null,
        altLabel: null
      };
    }

    if (params.useMargin) {
      const dailyInt = Math.round((amt * (K.getAnnualMarginRatePct() / 100)) / 365);
      return {
        tone: 'danger',
        title: 'Kredili İşlem Faiz Saati İşleyecek',
        text: `Yıllık %${K.getAnnualMarginRatePct()} kredi faiziyle günde ~${dailyInt.toLocaleString('tr-TR')} ₺ faiz ödeyeceksin; sert düşüşte saat 15:00 Margin Call zorunlu satışı tetiklenebilir.`,
        altAssetKey: null,
        altLabel: null
      };
    }

    if (String(asset.id).startsWith('doviz-usd')) {
      return {
        tone: 'info',
        title: '32 Günlük Başabaş Terazisi',
        text: `%0 vergili Kamu Sukuk 32 günde net +${be.sukuk.netGainTL.toLocaleString('tr-TR')} ₺ veriyor. Dolar 32 gün sonra ${be.breakevenUsdBazaar} ₺ kurunu geçmezse nakit Sukuk daha kârlı çıkar.`,
        altAssetKey: 'kira-sertifikasi-sukuk',
        altLabel: '%0 Vergili Sukuk İncele'
      };
    }

    if (asset.id === 'mevduat-ust' && Number(params.maturityDays || 32) <= 32) {
      const sukukDiff = be.sukuk.netGainTL - be.deposit.netGainTL;
      if (sukukDiff > 80) {
        return {
          tone: 'info',
          title: 'Vergi Kalkanı Farkı',
          text: `32 günlük mevduatta %17,5 stopaj kesildiği için net ${be.deposit.netGainTL.toLocaleString('tr-TR')} ₺ kalır; %0 vergili Kamu Sukuk aynı sürede +${sukukDiff.toLocaleString('tr-TR')} ₺ daha fazla net bırakıyor.`,
          altAssetKey: 'kira-sertifikasi-sukuk',
          altLabel: 'Kamu Sukuk (%0 Vergi)'
        };
      }
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // 6. GÜNÜN SOKAK ZEKÂSI ÖZETİ & MAKRO SPREAD NABZI
  // --------------------------------------------------------------------------
  function getDailyStreetBriefing() {
    const K = global.AetherKernelV10;
    if (!K) return null;
    const md = K.getMarketData() || {};
    const clock = K.getTurkishClock();
    const dInfo = K.getDarphanePremiumInfo();
    const inf = K.getAnnualInflationPct();
    const usd = K.getUsdTry();
    const kis = md.kitchenIntelSummary || {};
    const mc = kis?.openHorizon?.macroChains || {};
    const ms = kis?.macroSpreads || {};
    const brent = mc?.inputOutputChains?.brentOilUsd || 84.5;
    const brent1M = Number(mc?.inputOutputChains?.brentOilPerf1M || 0);
    const viop = K.getViopEveningSignal();
    const sukukRate = K.getAsset('kira-sertifikasi-sukuk')?.annualGrossRatePct || 36.5;
    const be32 = computeBreakevenComparison(100000, 32);
    const gsRatio = ms?.goldSilverRatio?.value || 81;
    const tr2y = md?.macro?.tr02y || 36.2;
    const tr10y = md?.macro?.tr10y || 33.9;
    const slopeBps = Math.round((tr10y - tr2y) * 100);
    const pumpCount = (kis?.microstructureAndWhale?.telegramPumpAnomalies || []).length;

    let leadHeadline = '';
    let friendAdvice = '';

    if (dInfo.premiumPct >= 8) {
      leadHeadline = `Kapalıçarşı'da 1 gr fiziki altın ${Math.round(dInfo.spotGramPrice).toLocaleString('tr-TR')} ₺ iken, borsadaki kağıt sertifikası (ALTIN.S1) ${Math.round(dInfo.s1GramEquiv).toLocaleString('tr-TR')} ₺'den dönüyor!`;
      friendAdvice = `Bak dostum, aynı altına borsada gram başına tam ${Math.round(dInfo.diffTL).toLocaleString('tr-TR')} ₺ (+%${dInfo.premiumPct}) fazladan hava parası ödeniyor. Üstelik 32 günlük Dolar başabaş kuru ${be32.breakevenUsdBazaar} ₺: Yani önümüzdeki 1 ayda Dolar ${be32.breakevenUsdBazaar} ₺'yi geçmezse %0 vergili Kamu Sukuk dövizden daha fazla net kazandırır.`;
    } else if (Math.abs(brent1M) >= 8) {
      leadHeadline = `Brent petrol ${brent} $ seviyesinde (Son 1 ayda ${brent1M >= 0 ? '+' : ''}%${brent1M.toFixed(1)} hareket etti).`;
      friendAdvice = brent1M < 0
        ? `Mazotun ana hammaddesi petrol ucuzluyor. Bu ne demek? Uçak kaldıran THYAO/PGSUS ve 81 ile kamyon yürüten perakendecinin yakıt faturası hafifler, kâr marjı açılır.`
        : `Petrol sert pahalanıyor. Pompaya zam geldiğinde tarladan hallere gelen malın nakliyesi de havayollarının yakıt gideri de şişer; rafineri (TUPRS) ise stok gücü yazar.`;
    } else {
      leadHeadline = `TÜFE Enflasyon %${inf.toFixed(1)}, Dolar ${usd.toFixed(2)} ₺ (32G Başabaş: ${be32.breakevenUsdBazaar} ₺), %0 Vergili Sukuk %${sukukRate.toFixed(1)}.`;
      friendAdvice = `Nakit parayı boşta bekletmek her gün sessizce alım gücü kaybetmektir; öte yandan sosyal medyada bağıran ${pumpCount > 0 ? pumpCount + ' adet ' : ''}şişik tahtaya atlamak da kumardır. Mutfak radarından kasasına gerçek VUK/OCF nakdi giren sağlam fabrikaları seç.`;
    }

    const pulses = [
      {
        label: 'Enflasyon vs %0 Vergili Sukuk',
        value: `TÜFE %${inf.toFixed(1)} · Sukuk Net %${sukukRate.toFixed(1)}`,
        tone: sukukRate >= inf ? 'good' : 'warn'
      },
      {
        label: '32 Günlük Dolar Başabaş Kuru',
        value: `Şu an ${usd.toFixed(2)} ₺ -> Eşik ${be32.breakevenUsdBazaar} ₺`,
        tone: 'info'
      },
      {
        label: 'Altın Terazi & Gümüş Rasyosu',
        value: `S1 +%${dInfo.premiumPct} · Altın/Gümüş ${gsRatio}x`,
        tone: dInfo.premiumPct >= 5 ? 'warn' : 'good'
      },
      {
        label: clock.viopEvening ? 'VİOP Akşam & Tahvil Eğrisi' : 'VİOP Makası & Tahvil Eğrisi',
        value: `VİOP %${viop.basisPct >= 0 ? '+' : ''}${viop.basisPct} · 2Y/10Y ${slopeBps}bp`,
        tone: 'info'
      }
    ];

    return { leadHeadline, friendAdvice, pulses };
  }

  // --------------------------------------------------------------------------
  // 7. CANLI KAP, RESMİ GAZETE VE ANALİST TEYİT KURALI EŞLEŞTİRİCİ
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
      let streetImpact = 'Makro fiyatlama ve kurumsal risk algısı üzerinde doğrudan etkili güncel gelişme.';
      let analystRule = 'Uzman Kuralı: Manşetle heyecanlanma; etkilenen şirketin bilançosundaki döviz/borç pozisyonunu ve tahtadaki CMF-20 para akışını teyit et.';

      if (/PETROL|BRENT|AKARYAKIT|MAZOT/.test(tUp)) {
        linkedKeys = ['emtia-petrol-bno', 'bist-tuprs', 'bist-thyao', 'bist-pgsus'];
        streetImpact = 'Petrol hareketi önce rafineri marjını (TUPRS), ardından uçak yakıtı ve soğuk zincir nakliye maliyetini (THYAO, BIMAS) doğrudan değiştirir.';
        analystRule = 'Uzman Teyidi: Akdeniz dizel/jet rafineri marjı açılıyorsa TUPRS pozitif; petrol düşüyorsa havayollarının CASK (koltuk maliyeti) düşer.';
      } else if (/ENFLASYON|TÜİK|FAİZ|MERKEZ BANKASI|TCMB|MEVDUAT|STOPAJ|RESMİ GAZETE/.test(tUp)) {
        linkedKeys = ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'dibs-tahvil', 'gayrimenkul-konut-ekgyo'];
        streetImpact = 'Enflasyon, stopaj ve faiz kararları tüm sabit getirili araçların net reel korumasını ve GYO/banka çarpanlarını anında yeniden yazar.';
        analystRule = 'Uzman Teyidi: Stopaj sonrası net getiriyi beklenen aylık TÜFE ile karşılaştır; faiz indirim sinyali varsa DİBS, XBANK ve GYO iskontolarına bak.';
      } else if (/TEMETTÜ|HALKA ARZ|BEDELLİ|GERİ ALIM/.test(tUp)) {
        linkedKeys = ['bist-tuprs', 'bist-froto', 'halka-arz-tabgd', 'bist-ismen'];
        streetImpact = 'Nakit temettü ve pay geri alımı ortak lehinedir; bedelli sermaye artırımı ise ortaklardan taze nakit ister.';
        analystRule = 'Uzman Teyidi: Temettünün borçla mı yoksa gerçek Serbest Nakit Akışı (FCF) ile mi ödendiğini "Kasa & Röntgen" sekmesinden kontrol et.';
      } else if (/ALTIN|ONS|FED|GÜMÜŞ/.test(tUp)) {
        linkedKeys = ['gram-altin-spot', 'altin-sertifikasi', 'gram-gumus-spot'];
        streetImpact = 'Küresel ons ve ABD reel faiz beklentisi fiziki gram altın ve gümüş fiyatına saniyesi saniyesine yansır.';
        analystRule = 'Uzman Teyidi: Altın alırken ALTIN.S1 hava parası primini ve 17:30 sonrası banka gece makasını kontrol etmeden tuşa basma.';
      } else if (/KURAKLIK|YAĞIŞ|TARIM|GIDA|ŞEKER|BUĞDAY/.test(tUp)) {
        linkedKeys = ['emtia-tarim-dba', 'reel-perakende-bimas', 'reel-perakende-mgros'];
        streetImpact = 'Tarladaki rekolte ve baraj doluluğu aylar sonra hidroelektrik üretimini, gıda hammadde faturasını ve market sepetini belirler.';
        analystRule = 'Uzman Teyidi: Kuraklıkta borçlu HES üreticisi zorlanırken raf fiyatını anında güncelleyen peşin kasalı marketler marjını korur.';
      } else {
        linkedKeys = ['bist-100', 'gram-altin-spot', 'kira-sertifikasi-sukuk'];
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
        analystRule,
        linkedKeys
      });
    }

    for (const h of horizonItems.slice(0, 8)) {
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
        analystRule: 'Uzman Teyidi: İyi KAP haberi düştüğünde tahtada CMF > +0,10 ve hacim > 1,15x ise gerçek kurumsal alımdır; CMF negatifse küçük yatırımcıya mal dağıtımı olabilir!',
        linkedKeys: tickers.length > 0 ? tickers.map((tk) => K.getAsset(tk).key) : ['bist-100', 'kira-sertifikasi-sukuk']
      });
    }

    return combined.slice(0, 12);
  }

  // --------------------------------------------------------------------------
  // 8. DERİN MUTFAK İSTİHBARATI MASALARI (%98 GİZLİ MOTORUN TAM AÇILIMI!)
  // --------------------------------------------------------------------------
  function getKitchenIntelDesks() {
    const K = global.AetherKernelV10;
    if (!K) return null;
    const md = K.getMarketData() || {};
    const kis = md.kitchenIntelSummary || {};

    return {
      auditAndBarbell: {
        scorecard: kis?.selfAuditScorecard || null,
        barbellPlan: kis?.casinoAsymmetricPlan || null,
        arbitrageChains: (kis?.supplyChainArbitrage?.chains || []).slice(0, 6),
        regimeNotes: (kis?.openHorizon?.structuralRegimeNotes || []).slice(0, 4)
      },
      tms29: {
        auditedCount: kis?.tms29AuditReport?.totalCorporateAudited || 377,
        cashChampions: (kis?.tms29AuditReport?.cashFlowChampions || []).slice(0, 8),
        illusionTraps: (kis?.tms29AuditReport?.tms29IllusionTraps || []).slice(0, 8),
        debtWalls: (kis?.tms29AuditReport?.debtWallAlerts || []).slice(0, 6),
        vukCashLeaders: (kis?.vukAuditAndRelatedParty?.vukInvoiceCashLeaders || []).slice(0, 6),
        relatedPartyRisks: (kis?.vukAuditAndRelatedParty?.relatedPartyHollowingAlerts || []).slice(0, 6),
        bondRolloverRisks: (kis?.vukAuditAndRelatedParty?.ostBondRolloverRisks || []).slice(0, 5)
      },
      mkkWhale: {
        meta: kis?.mkkFloatDeltaLedger?.ledgerMeta || {},
        lotExpansions: (kis?.mkkFloatDeltaLedger?.lotExpansionAlerts || []).slice(0, 8),
        tightFortresses: (kis?.mkkFloatDeltaLedger?.tightFloatFortresses || []).slice(0, 8),
        stealthWhales: (kis?.microstructureAndWhale?.stealthWhaleConcentration || []).slice(0, 6),
        pumpAnomalies: (kis?.microstructureAndWhale?.telegramPumpAnomalies || []).slice(0, 6),
        quarterEndFxFortresses: (kis?.microstructureAndWhale?.quarterEndFxCashFortresses || []).slice(0, 6),
        globalWhaleMatrix: (kis?.microstructureAndWhale?.globalWhaleAndUnlockMatrix || []).slice(0, 4)
      },
      boardPatterns: {
        quietBottom: (kis?.forensicBoardPatterns626?.pattern1QuietBottomAbsorption || []).slice(0, 6),
        ironFloor: (kis?.forensicBoardPatterns626?.pattern2IronFloorCompression || []).slice(0, 6),
        instBreakout: (kis?.forensicBoardPatterns626?.pattern3InstitutionalBreakout || []).slice(0, 6),
        hiddenDist: (kis?.forensicBoardPatterns626?.pattern4HiddenDistribution || []).slice(0, 6),
        recentAnomalies: (kis?.realtimeAnomalyLog?.recentEvents || []).slice(0, 6)
      },
      capexAndValue: {
        capexHarvest: (kis?.capexHarvestAndEva?.capexHarvestBreakouts || []).slice(0, 6),
        evaMoat: (kis?.capexHarvestAndEva?.evaMoatChampions || []).slice(0, 6),
        taxShieldBuilders: (kis?.capexHarvestAndEva?.taxShieldCapexBuilders || []).slice(0, 5),
        bookArbitrage: (kis?.legalArbitrageAndTender?.mandatoryCallAndTaspArbitrage || []).slice(0, 6),
        tierPromotions: (kis?.forcedFlowsAndCalendar?.bistTierPromotionCandidates || []).slice(0, 6),
        fundTrimAlerts: (kis?.forcedFlowsAndCalendar?.fundCapForcedTrimAlerts || []).slice(0, 4),
        mandatoryCalendar: (kis?.forcedFlowsAndCalendar?.mandatoryCalendarEvents || []).slice(0, 5)
      },
      fieldAndBddk: {
        gtipMatrix: (kis?.physicalFieldAndCustoms?.gtipCustomsMatrix || []).slice(0, 6),
        epiasEnergy: (kis?.physicalFieldAndCustoms?.epiasEnergyField || []).slice(0, 6),
        insuranceFloat: (kis?.physicalFieldAndCustoms?.insuranceAndFinanceField || []).slice(0, 6),
        timBasins: (kis?.globalLogisticsAndBddk?.timProvinceExportMatrix || []).slice(0, 6),
        bddkBanks: (kis?.globalLogisticsAndBddk?.bddkWeeklyBankMatrix || []).slice(0, 8),
        viopCarry: kis?.forcedFlowsAndCalendar?.viopCashAndCarry || null,
        oemCross: (kis?.legalArbitrageAndTender?.supplyChainCrossDisclosure || []).slice(0, 4),
        tenderTracker: (kis?.legalArbitrageAndTender?.tenderAndArbitrationTracker || []).slice(0, 4)
      }
    };
  }

  // --------------------------------------------------------------------------
  // 9. 10 DERİN SOKAK ZEKÂSI DOMİNO ZİNCİRİ (ÖNCÜ KAYNAK & ZAMAN GECİKMELİ)
  // --------------------------------------------------------------------------
  function getLiveWorldChains() {
    const K = global.AetherKernelV10;
    if (!K) return [];
    const md = K.getMarketData() || {};
    const gp = K.getGlobalLivePulse ? K.getGlobalLivePulse() : null;
    const mc = md?.kitchenIntelSummary?.openHorizon?.macroChains || {};
    const ms = md?.kitchenIntelSummary?.macroSpreads || {};
    const brent = gp?.brentUsd || mc?.inputOutputChains?.brentOilUsd || 84.5;
    const copper = gp?.copperUsd || mc?.inputOutputChains?.copperUsd || 5.42;
    const wheat = gp?.wheatUsd || mc?.inputOutputChains?.wheatUsd || 562.0;
    const damPct = md?.worldLiveEvolution?.townWeatherAndMood?.damWaterPct || 39.1;
    const gold = K.getAsset('gram-altin-spot');
    const s1Info = K.getDarphanePremiumInfo();
    const dep = K.getAsset('mevduat-ust');
    const eur = K.getAsset('doviz-eur');
    const inf = K.getAnnualInflationPct();
    const us10y = ms?.us10yAndDxy?.us10y || 4.85;
    const dxy = ms?.us10yAndDxy?.dxy || 103.5;

    return [
      {
        id: 'chain-oil',
        title: 'Mazot -> Domates, Kamyon & Uçak Bileti',
        shortTitle: 'Mazot & Uçak',
        leadingSource: 'ICE Brent Vadeli + TÜPRAŞ Aylık Akdeniz Dizel/Jet Rafineri Marjı',
        delayNote: 'Pompaya 3–5 günde, havayolu ve perakende bilançosuna ilk çeyrekte yansır.',
        triggerHeadline: `Brent Petrol ${brent} $ · Rafineriden Hal Kamyonuna Maliyet Zinciri`,
        step1: `Ham Petrol Varili (${brent} $) & Rafineri Marjı`,
        step2: 'İşlenmiş Mazot & Jet Yakıtı (TÜPRAŞ)',
        step3: 'Uçak Yakıt Faturası & Soğuk Zincir Nakliye (THYAO, PGSUS, BİM)',
        insight: 'Pazarda domatesin niye pahalandığını mazottan şıp diye anlarsın: Petrol düştüğünde yakıt gideri cironun ~%30’u olan havayolları (THYAO/PGSUS) ve 81 ile kamyon yürüten perakendeci nefes alır; rafineri marjı açıldığında ise TUPRS dolar bazında nakit basar.',
        assetKeys: ['emtia-petrol-bno', 'bist-tuprs', 'bist-thyao', 'bist-pgsus', 'reel-perakende-bimas']
      },
      {
        id: 'chain-drought',
        title: 'Kuraklık -> Baraj, HES, Buğday & Market Rafı',
        shortTitle: 'Kuraklık & Gıda',
        leadingSource: 'İSKİ/DSİ Baraj Doluluk Verisi + EPİAŞ Günlük HES Üretimi + CBOT Buğday',
        delayNote: 'HES elektrik üretimine anında, gıda fabrikası hammaddesine 2–4 ay gecikmeyle vurur!',
        triggerHeadline: `Baraj Doluluk %${damPct} · Dünya Buğday ${wheat} ¢ · İklimden Bilançoya Öncü Bakış`,
        step1: `Yağış Azlığı (Baraj %${damPct}) & Buğday (${wheat} ¢)`,
        step2: 'Düşen Hidroelektrik Üretimi & Artan Un/Yem/Şeker Faturası',
        step3: 'Peşin Kasalı Marketler Ayakta Kalır, Borçlu Gıda/HES Zorlanır',
        insight: 'Bir yerde kuraklık başladığında borçlu hidroelektrik santrali (HES) su bulamaz, aylar sonra da un/süt/yem maliyeti patlayan borçlu fabrika sıkışır. Buna karşılık hammaddeyi peşin gücüyle ucuza alıp raf fiyatını aynı sabah güncelleyen marketler (BIMAS, MGROS) fırtınayı zırhla geçer.',
        assetKeys: ['emtia-tarim-dba', 'reel-perakende-bimas', 'reel-perakende-mgros', 'halka-arz-tabgd', 'bist-ccola']
      },
      {
        id: 'chain-gold',
        title: 'Altın Terazisi, Hava Parası & Stopaj Arbitrajı',
        shortTitle: 'Altın Terazisi',
        leadingSource: 'Kapalıçarşı Fiziki Gram vs BIST:ALTIN.S1 Makası & %17,5 Fon Stopajı',
        delayNote: 'Anlık arbitraj farkı — aynı saniyede gramaj büyütebilirsin!',
        triggerHeadline: `Çarşı Gram ${Math.round(gold?.priceTL || 6058).toLocaleString('tr-TR')} ₺ vs ALTIN.S1 +%${s1Info.premiumPct} Fark`,
        step1: 'Ons Altın ($) × Dolar/TL Kuru',
        step2: 'Kapalıçarşı Fiziki Gram (%0 Vergi · %0,40 Dar Makas)',
        step3: `ALTIN.S1 (+${Math.round(s1Info.diffTL)} ₺/gr Hava Parası) & Altın BYF (%17,5 Stopaj)`,
        insight: `Aynı altına üç farklı kapıdan gidersen üç farklı sonuç alırsın: Kapalıçarşı'da vergi %0'dır; ZGOLD/GLDTR fonlarında kârın %17,5'i vergiye gider; ALTIN.S1'de ise kalabalık gram başına ${Math.round(s1Info.diffTL).toLocaleString('tr-TR')} ₺ hava parası ödüyor! Usta yatırımcı pahalı kağıdı satıp ucuz fizikiyi koyar.`,
        assetKeys: ['gram-altin-spot', 'altin-sertifikasi', 'altin-fonu-zgold', 'gram-gumus-spot', 'ceyrek-altin']
      },
      {
        id: 'chain-winter',
        title: 'Bakır, Gümüş & Elektrik Şebekesi Darboğazı',
        shortTitle: 'Bakır & Trafo',
        leadingSource: 'TÜİK GTİP 8504.23 Trafo İhracatı + TEİAŞ Kapasite Listesi + COMEX Bakır',
        delayNote: 'Bakır/gümüş düşüşü trafo ve panel üreticisinin maliyetini 1 çeyrek sonra rahatlatır.',
        triggerHeadline: `Bakır ${copper} $ · Şebeke Yenileme ve Trafo/Panel Maliyet Makası`,
        step1: `Elektrolitik Bakır (${copper} $) & Endüstriyel Gümüş Girişi`,
        step2: 'Güç Trafosu & Güneş Paneli Üretimi (ASTOR, CWENE, SMRTG)',
        step3: 'Şebeke Dağıtım & Sanayi Elektrifikasyonu (ENJSA)',
        insight: 'Dünyada yapay zekâ veri merkezleri ve elektrikli araçlar şebekeyi zorladıkça trafo ihtiyacı büyür; ancak hammadde (bakır/gümüş) maliyeti ve tahtadaki MKK ortak satışı kontrol edilmeden yalnız manşetle atlanmaz.',
        assetKeys: ['reel-enerji-astor', 'reel-enerji-cwene', 'gram-gumus-spot', 'bist-enjsa', 'reel-enerji-smrtg']
      },
      {
        id: 'chain-export',
        title: 'Çelik, EUR/USD Paritesi & Kocaeli/Bursa İhracat Hattı',
        shortTitle: 'Euro & İhracat',
        leadingSource: 'OSD Otomotiv İhracat Raporu + TİM Kocaeli/Bursa Tonajı + EUR/USD',
        delayNote: 'Aylık TİM ve OSD ihracat verisi bilançodan tam 45 gün önce açıklanır!',
        triggerHeadline: `Euro/TL ${(eur?.priceTL || 55.4).toFixed(2)} ₺ · EUR/USD ${(gp?.eurUsd || 1.10).toFixed(3)} · Döviz Kasası`,
        step1: 'Yassı Çelik Sac & Alüminyum Girdisi (EREGL, ISDMR)',
        step2: 'Avrupa Otomotiv & Makine İhracat Devleri (FROTO, TOASO, ARCLK)',
        step3: 'Yan Sanayi & Yüksek Teknoloji İhracatı (EGEEN, ASELS)',
        insight: 'Türk sanayicisi enerjiyi ve çeliği Dolar ile alır, ürettiği ticari aracı Avrupa’ya Euro ile satar. EUR/USD paritesi yükseldiğinde ihracatçının kasasında çift yönlü kâr marjı açılır.',
        assetKeys: ['doviz-eur', 'bist-froto', 'bist-toaso', 'bist-eregl', 'bist-asels']
      },
      {
        id: 'chain-rates',
        title: 'Faiz Kalkanı vs Borçlu Sanayi & GYO Baharı',
        shortTitle: 'Faiz & GYO',
        leadingSource: 'TCMB PPK Kararı + 2Y/10Y Tahvil Eğrisi + Konut Kredi Faizleri',
        delayNote: 'Faiz indiriminden 2–3 ay önce tahvil (DİBS), XBANK ve GYO fiyatlamaya başlar!',
        triggerHeadline: `Mevduat Brüt %${dep?.annualGrossRatePct || 39} · TÜFE %${inf.toFixed(1)}`,
        step1: 'TCMB Politika Faizi & Likidite Sıkılığı',
        step2: 'Kış Zırhı: %0 Stopaj Kamu Sukuk, DİBS & Günlük PPF',
        step3: 'Bahar Tohumları: Konut GYO & Borç Azaltan Sanayi (EKGYO, ISGYO, SASA)',
        insight: 'Kış gelmeden odun stoklayan köylü gibi düşün: Faiz %40’lardayken borçlu şirket bankaya çalışır, Sukuk ve nakit kaleleri korur. Enflasyon kırılıp faiz indirimi ufukta göründüğünde ise en sert uyanışı DİBS, Bankalar ve GYO’lar yapar.',
        assetKeys: ['kira-sertifikasi-sukuk', 'dibs-tahvil', 'gayrimenkul-konut-ekgyo', 'gayrimenkul-gyo-fonu-optgy', 'bist-sasa']
      },
      {
        id: 'chain-insurance',
        title: 'Sigorta Poliçe Havuzu (Float) -> Yüksek Faiz Çifte Kazancı',
        shortTitle: 'Sigorta Çarkı',
        leadingSource: 'Türkiye Sigorta Birliği (TSB) Aylık Prim Üretimi + TLREF Faizi',
        delayNote: 'TSB aylık verisiyle poliçe cirosu bilançodan 45 gün önce kesinleşir.',
        triggerHeadline: 'Peşin Poliçe Primi × %38+ Faiz Getirisi = Çift Motorlu Kasa',
        step1: 'Milyonlarca Kasko, Konut ve Sağlık Poliçesinden Peşin Nakit Girişi',
        step2: 'Dev Teknik Nakit Havuzunun (Float) Yüksek Faiz/Sukukta Çalışması',
        step3: 'Sigorta & Emeklilik Şirketlerinin Özsermaye Patlaması (TURSG, AGESA)',
        insight: 'Sanayici yüksek faizden ağlarken sigorta şirketi gülümser! Çünkü müşteriden poliçe parasını bugün peşin alır, hasar çıkana kadar o milyarlarca lirayı yüksek faizde çalıştırır.',
        assetKeys: ['bist-tursg', 'kira-sertifikasi-sukuk', 'mevduat-ust', 'bes-emeklilik']
      },
      {
        id: 'chain-holding',
        title: 'Holding Net Aktif İskontosu & Yabancı Sermaye Kapısı',
        shortTitle: 'Holding & Banka',
        leadingSource: 'Türkiye 5Y CDS Risk Primi + TCMB Haftalık Yabancı Menkul Kıymet Girişi',
        delayNote: 'CDS 250 bp altına indikçe büyük yabancı fonlar ilk holding ve bankalara girer.',
        triggerHeadline: 'İçindeki Dev Fabrikaları %35 İndirimli Almanın Kurumsal Yolu',
        step1: 'Ülke CDS Priminin Düşmesi & Kredi Notu Artışları',
        step2: 'Yabancı Fonların Likit BIST-30 Kapısından Girişi (KCHOL, SAHOL, GARAN)',
        step3: 'Holding Net Aktif Değer (NAD) İskontosunun Kapanması & Aracı Kurum Hacmi (ISMEN)',
        insight: 'Yabancı büyük fon Türkiye’ye geldiğinde sığ yan tahta alamaz; doğrudan KCHOL, SAHOL, GARAN, AKBNK, THYAO ve BIMAS alır, artan işlem hacmi de ISMEN’in kasasını doldurur.',
        assetKeys: ['bist-kchol', 'bist-sahol', 'bist-garan', 'bist-akbnk', 'bist-ismen']
      },
      {
        id: 'chain-energy-chem',
        title: 'Doğalgaz & Enerji Faturası -> Cam, Çimento ve Petrokimya',
        shortTitle: 'Doğalgaz & Fırın',
        leadingSource: 'Avrupa TTF / NYMEX Doğalgaz + BOTAŞ Sanayi Tarifesi + Petrokok',
        delayNote: 'Fırınları 7/24 yanan sektörlerde enerji faturası doğrudan brüt marjı belirler.',
        triggerHeadline: '24 Saat Sönmeyen Sanayi Fırınlarının Maliyet Denklemi',
        step1: 'Doğalgaz, Petrokok ve Sanayi Elektriği Birim Maliyeti',
        step2: 'Yüksek Isılı Üretim: Cam, Çimento ve Petrokimya (SISE, OYAKC, PETKM)',
        step3: 'Kentsel Dönüşüm, Altyapı ve İhracat Marjı',
        insight: 'Cam ve çimento fabrikasının fırını soğutulamaz; enerji ucuzlayıp şantiyeler hızlandığında kâr katlanır, enerji pahalıyken talep durursa marj bıçak gibi kesilir.',
        assetKeys: ['bist-sise', 'bist-oyakc', 'bist-petkm', 'bist-gubrf']
      },
      {
        id: 'chain-global-liq',
        title: 'ABD 10Y Tahvil & DXY -> Küresel Teknoloji, Altın & Kripto',
        shortTitle: 'Fed & Küresel',
        leadingSource: 'ABD 10Y Tahvil Faizi (US10Y) + DXY Dolar Endeksi + Fed Bilançosu',
        delayNote: 'New York seansı (TR 16:30–23:00) açıldığı saniye tüm dünyayı fiyatlar!',
        triggerHeadline: `ABD 10Y Tahvil %${us10y} · Dolar Endeksi (DXY) ${dxy} · Küresel Musluk`,
        step1: `ABD 10Y Tahvil Faizi (%${us10y}) ve DXY (${dxy}) Hareketi`,
        step2: 'Ons Altın, Eurobond (EMB) ve Yapay Zekâ Devleri (SPY, QQQ, NVDA)',
        step3: 'En Uç Risk Halkası: 7/24 Kripto Likiditesi (BTC, ETH)',
        insight: 'Dünyadaki tüm varlıkların yerçekimi ABD 10 yıllık tahvil faizidir: Bu faiz düştüğünde ve dolar bolluğu arttığında altın, Eurobond, teknoloji hisseleri ve Bitcoin nefes alır; fırladığında ise önce kaldıraçlı kripto ve pahalı teknoloji sarsılır.',
        assetKeys: ['abd-sp500-spy', 'abd-nasdaq-qqq', 'kuresel-hisse-nvda', 'eurobond-emb', 'kripto-btc']
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
    let currentTitle = 'Yüksek Faiz Kışı & Seçici Kasa Toplama Mevsimi';
    let villagerWisdom = 'Hiçbir kış sonsuza kadar sürmez, hiçbir yaz da sonsuza kadar yükselmez. Kredi faizleri yüksekken borçsuz nakit kaleleri, sigorta havuzu ve %0 vergili Sukuk ocağı sıcak tutar; ama ileri görüşlü köylü, faiz baharı gelmeden önce yangın yerindeki sağlam fabrikaların tohumunu sessizce toplar.';
    let thrivesNowKeys = ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'reel-perakende-bimas', 'bist-tursg', 'bist-enkai'];
    let nextSeedKeys = ['dibs-tahvil', 'gayrimenkul-konut-ekgyo', 'bist-froto', 'bist-garan', 'bist-eregl'];

    if (realSpread < -2) {
      activePhase = 'INFLATION_AUTUMN';
      currentTitle = 'Negatif Reel Faiz & Gerçek Varlık Zırhı Mevsimi';
      villagerWisdom = 'Enflasyon net faizin üzerinde koştuğunda TL nakitte bekleyen sessizce erir; fiziki altın, döviz kasalı ihracatçılar ve fiyatlama gücü olan peşin kasalar kalkan olur.';
      thrivesNowKeys = ['gram-altin-spot', 'bist-froto', 'bist-thyao', 'reel-perakende-bimas', 'abd-sp500-spy'];
      nextSeedKeys = ['kira-sertifikasi-sukuk', 'bist-tursg', 'bist-asels'];
    } else if (inf < 24 && realSpread >= 2) {
      activePhase = 'DISINFLATION_SPRING';
      currentTitle = 'Dezenflasyon & Faiz İndirimi Baharı';
      villagerWisdom = 'Enflasyon ateşi düşerken faiz indirim döngüsü kapıyı çalar; yüksek faiz kışında ezilmiş sabit tahviller (DİBS), konut GYO, bankalar ve otomotiv şirketleri bahar suyuyla ilk filizlenenler olur.';
      thrivesNowKeys = ['dibs-tahvil', 'gayrimenkul-konut-ekgyo', 'bist-garan', 'bist-froto', 'bist-kchol'];
      nextSeedKeys = ['bist-eregl', 'bist-sise', 'abd-sp500-spy'];
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
        { code: 'TIGHT_WINTER', name: 'Sıkı Faiz Kışı', sub: 'Sukuk, Sigorta & Net Nakit Kaleleri Korur' },
        { code: 'DISINFLATION_SPRING', name: 'Faiz İndirim Baharı', sub: 'DİBS, Banka, GYO & Otomotiv İlk Uyanır' },
        { code: 'GROWTH_SUMMER', name: 'Üretim & İhracat Yazı', sub: 'Çelik, Havacılık & Sanayi Tam Kapasite Koşar' },
        { code: 'INFLATION_AUTUMN', name: 'Isınma & Emtia Sonbaharı', sub: 'Fiziki Altın, Enerji & Peşin Market Zırh Olur' }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // 10. 10 GERÇEKÇİ KRİZ & FIRTINA TATBİKATI + SOĞUKKANLI USTA REÇETESİ
  // --------------------------------------------------------------------------
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
      desc: 'Deniz ticareti kilitlendi, Brent petrol bir gecede +%35 fırladı, küresel navlun ve fiziki altın sert yükseldi; havacılık ve enerji ithalatçıları ilk satışı yedi.',
      masterPlaybook: 'Soğukkanlı Usta Ne Yapar? Panikle kaliteli havayolunu tabanda yok pahasına vermez; elindeki altın/petrol/rafineri kalkanının kârıyla, kriz yatışmaya başladığında aşırı cezalandırılmış döviz gelirli ihracatçıları kademeli toplar.',
      fireSaleKeys: ['bist-thyao', 'bist-froto', 'bist-tavhl'],
      computeAssetShockPct(a) {
        if (a.id === 'emtia-petrol-bno') return 35;
        if (a.ticker === 'TUPRS') return 14;
        if (isPreciousMetalAsset(a)) return 11;
        if (String(a.id).startsWith('doviz-') || a.id === 'eurobond-usdtr' || a.ticker === 'ENKAI') return 6;
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
      title: 'Organize Sanayi Elektrik & Doğalgaz Kısıntısı Krizi',
      cashInflationShockPct: 2.5,
      desc: 'Kış ortasında doğalgaz/iletim arızasıyla OSB fabrikalarında 5 günlük enerji kesintisi başladı; fırınları duran ağır sanayi sarsılırken şebeke/trafo üreticileri ve nakit kaleleri ayrıştı.',
      masterPlaybook: 'Soğukkanlı Usta Ne Yapar? Enerji kesintisinin geçici arz şoku olduğunu bilir; ağır borçlu olanlardan uzak durur, fakat kasası net nakit dolu olan sanayi devlerinde panik satışlarını fırsata çevirir.',
      fireSaleKeys: ['bist-eregl', 'bist-sise', 'bist-froto'],
      computeAssetShockPct(a) {
        if (['ASTOR', 'CWENE', 'SMRTG', 'ENJSA'].includes(a.ticker)) return 9;
        if (a.isRateInstrument) return 0;
        if (isPreciousMetalAsset(a) || String(a.id).startsWith('doviz-') || a.id === 'eurobond-usdtr') return 5;
        if (['EREGL', 'KRDMD', 'SASA', 'SISE', 'PETKM', 'OYAKC'].includes(a.ticker)) return -13;
        if (a.venue === 'BIST') return -8;
        return -2;
      }
    },
    {
      id: 'SEVERE_DROUGHT',
      shortTitle: 'Kuraklık & Gıda',
      title: 'Şiddetli Kuraklık, Baraj Krizi & Gıda Enflasyonu Dalgası',
      cashInflationShockPct: 8.5,
      desc: 'Barajlar %20 altına indi, tarımsal rekolte düştü; gıda fiyatları sıçrarken su/HES yoğun tesisler zorlandı ve boş nakdin mutfak alım gücü sert eridi.',
      masterPlaybook: 'Soğukkanlı Usta Ne Yapar? Boş vadesiz nakitte beklemez; tarım emtiası, %0 vergili Sukuk ve fiyat artışını rafa anında yansıtan peşin kasalı gıda perakendecisiyle alım gücünü korur.',
      fireSaleKeys: ['reel-perakende-bimas', 'reel-perakende-mgros', 'emtia-tarim-dba'],
      computeAssetShockPct(a) {
        if (a.id === 'emtia-tarim-dba') return 22;
        if (['BIMAS', 'MGROS', 'TABGD', 'SOKM'].includes(a.ticker)) return 8;
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
      title: 'Perşembe 14:00 Sürpriz TCMB Faiz Artışı (+750 bp)',
      cashInflationShockPct: 0,
      desc: 'Merkez Bankası saat tam 14:00’te beklentilerin çok üzerinde sert faiz artırdı; kredili konut (GYO), sabit tahvil ve yüksek borçlu şirketler sert satış yedi.',
      masterPlaybook: 'Soğukkanlı Usta Ne Yapar? Kredili (margin) borç taşımadığı için zorunlu satışa yakalanmaz; Para Piyasası Fonu ve sigorta şirketleri yüksek faizden hemen faydalanırken borçlu tahtalardan uzak durur.',
      fireSaleKeys: ['para-piyasasi-fonu', 'kira-sertifikasi-sukuk', 'bist-tursg'],
      computeAssetShockPct(a) {
        if (a.id === 'dibs-tahvil') return -6.5;
        if (a.isRateInstrument) return 1.5;
        if (a.ticker === 'TURSG') return 4.5;
        if (a.categoryName.includes('Gayrimenkul') || ['EKGYO', 'RYGYO', 'ISGYO', 'SASA', 'PETKM'].includes(a.ticker)) return -15;
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
      desc: 'İç ve dış gerilimle döviz kurları +%22 sıçradı; fiziki altın, küresel varlıklar ve döviz kasalı ihracatçılar korurken boş TL nakdin alım gücü hızla eridi.',
      masterPlaybook: 'Soğukkanlı Usta Ne Yapar? Gece banka makası %4’e açılmışken panikle tepeden dövize saldırmaz! Portföyünde önceden taşıdığı altın, Eurobond ve döviz gelirli ihracat devleri (THYAO, FROTO, ENKAI, ASELS) zaten otomatik kalkan olur.',
      fireSaleKeys: ['bist-enkai', 'bist-froto', 'bist-thyao', 'gram-altin-spot'],
      computeAssetShockPct(a) {
        if (isFxLinkedShieldAsset(a) || a.venue === 'CRYPTO_24_7') return 21;
        if (['THYAO', 'FROTO', 'TOASO', 'TUPRS', 'ASELS', 'SISE', 'EREGL', 'ENKAI', 'TAVHL'].includes(a.ticker)) return 13;
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
      desc: 'Dünya borsalarında sert satış dalgası: Kripto -%32, ABD teknoloji -%16, gelişen ülke borsaları -%11 çekildi; yalnızca sabit nakit zırhı ve fiziki altın korudu.',
      masterPlaybook: 'Soğukkanlı Usta Ne Yapar? İşte "Nakit Kalkanının (PPF/Sukuk)" gerçek değeri bu günde ortaya çıkar! Herkes teminat tamamlamak için kaliteli varlıklarını yok pahasına satarken, cebinde hazır nakdi olan usta en kaliteli dünya ve Türkiye şirketlerini indirimden toplar.',
      fireSaleKeys: ['abd-sp500-spy', 'kuresel-hisse-msft', 'bist-kchol', 'bist-tuprs'],
      computeAssetShockPct(a) {
        if (a.venue === 'CRYPTO_24_7') return -32;
        if (isPreciousMetalAsset(a) && a.subVenue !== 'DARPHANE_S1') return 6;
        if (a.subVenue === 'DARPHANE_S1') return 2;
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
      title: 'Hava Parası Balonlarının Sönmesi & Spekülatif Taban Serisi',
      cashInflationShockPct: 0,
      desc: 'Fiziki altın yatay kalırken borsadaki şişik ALTIN.S1 primi sıfırlandı ve sosyal medya/MKK patron satışı olan tahtalar üst üste taban kilitledi; sağlam kasalar artı kapattı!',
      masterPlaybook: 'Soğukkanlı Usta Ne Yapar? Taban serisi yiyen nakit yakıcı tahtada "maliyet düşüreyim" tuzağına asla girmez; baştan terazi hesabıyla gerçek nakit üreten kasalarda durmanın huzurunu yaşar.',
      fireSaleKeys: ['gram-altin-spot', 'reel-perakende-bimas', 'bist-tcell'],
      computeAssetShockPct(a) {
        if (a.subVenue === 'DARPHANE_S1') return -Math.max(9, Math.round(global.AetherKernelV10?.getDarphanePremiumInfo()?.premiumPct || 12));
        if (a.isPumpAnomaly || a.isTms29Illusion || a.distributionTrap || a.isPatronSelling) return -26;
        if (isPreciousMetalAsset(a) || a.isRateInstrument) return 0.5;
        if (a.bistRow && (a.bistRow.ocfMillionTL || 0) > 250) return 2.0;
        if (a.venue === 'BIST') return -4;
        return 0;
      }
    },
    {
      id: 'CDS_BANK_STRESS',
      shortTitle: 'CDS +450bp Şoku',
      title: 'Ülke Risk Primi (CDS) Sıçraması & Yabancı Çıkış Testi',
      cashInflationShockPct: 5.5,
      desc: 'Jeopolitik tansiyonla Türkiye 5Y CDS primi bir haftada +180 baz puan yükseldi; yabancı ağırlıklı bankalar ve Eurobondlar gerilerken fiziki altın ve net döviz kasalı şirketler direndi.',
      masterPlaybook: 'Soğukkanlı Usta Ne Yapar? CDS sıçramalarında likit banka ve holdinglerdeki yabancı çıkışının durulmasını bekler; kasasında milyarlarca dolar net nakit taşıyan (ENKAI gibi) ve fiziki altın kalkanlarına yaslanır.',
      fireSaleKeys: ['bist-garan', 'bist-kchol', 'eurobond-emb'],
      computeAssetShockPct(a) {
        if (a.id === 'gram-altin-spot' || a.id === 'doviz-chf' || a.id === 'doviz-usd') return 8;
        if (a.ticker === 'ENKAI') return 4;
        if (a.id === 'eurobond-emb') return -6;
        if (a.bistRow?.entityKind === 'bank' || a.id === 'bist-banka' || a.id === 'fon-yerli-banka-zplib') return -14;
        if (a.isRateInstrument) return 0;
        if (a.venue === 'BIST') return -8;
        return 2;
      }
    },
    {
      id: 'MIDNIGHT_GAZETTE_TAX',
      shortTitle: 'Gece Resmi Gazete',
      title: 'Gece Yarısı Resmi Gazete: Stopaj & Kredi Kısıtı Kararı',
      cashInflationShockPct: 1.5,
      desc: 'Gece 01:30 Resmi Gazete’de bazı fon stopajları artırıldı ve tüketici kredi kartı taksitlerine sıkı sınır getirildi; sabah 09:55 açılış eşleşmesinde perakende dayanıklı tüketim sarsılırken %0 vergili istisna kaleleri öne çıktı.',
      masterPlaybook: 'Soğukkanlı Usta Ne Yapar? Gece Resmi Gazete kararını sabah 09:55 zili çalmadan Pusula’dan okur; kazanılmış vergi muafiyeti olan elindeki dilimleri aceleyle bozmaz (stopaj artışları genellikle yeni alımlara uygulanır!).',
      fireSaleKeys: ['kira-sertifikasi-sukuk', 'fon-yerli-hisse-zpbdl', 'reel-perakende-bimas'],
      computeAssetShockPct(a) {
        if (a.id === 'kira-sertifikasi-sukuk' || a.subVenue === 'BIST_EXEMPT_ETF') return 1.5;
        if (a.subVenue === 'BIST_TAXABLE_ETF') return -3.5;
        if (a.bistRow?.sector === 'Beyaz Eşya & Mobilya' || a.bistRow?.sector === 'Gayrimenkul & GYO') return -9.5;
        if (a.isRateInstrument) return 0;
        if (a.venue === 'BIST') return -3.5;
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
      itemImpacts.push({ name: it.ticker || it.name, assetKey: a.key, pct, deltaTL: dTL });
    }
    for (const tr of snap.tranches) {
      const a = K.getAsset(tr.assetKey);
      if (!a) continue;
      const pct = sc.computeAssetShockPct(a);
      const dTL = Math.round(tr.accruedNetValueTL * (pct / 100));
      totalDeltaTL += dTL;
      if (dTL !== 0) itemImpacts.push({ name: tr.name, assetKey: a.key, pct, deltaTL: dTL });
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
      masterPlaybook: sc.masterPlaybook || '',
      fireSaleKeys: sc.fireSaleKeys || [],
      itemImpacts: itemImpacts.sort((a, b) => a.deltaTL - b.deltaTL)
    };
  }

  // --------------------------------------------------------------------------
  // 11. 1M PORTFÖY KASA DOKTORU & GİZLİ KORELASYON DEDEKTÖRÜ
  // --------------------------------------------------------------------------
  const EXPORT_SHIELD_TICKERS = new Set([
    'THYAO', 'PGSUS', 'TAVHL', 'DOCO', 'FROTO', 'TOASO', 'TUPRS', 'ASELS', 'ENKAI', 'SISE', 'EREGL', 'ISDMR', 'ARCLK', 'EGEEN', 'BRSAN', 'KORDS', 'CCOLA', 'AEFES', 'ALGYO'
  ]);

  function evaluatePortfolioDoctor(member, snapOverride) {
    const K = global.AetherKernelV10;
    if (!K) return null;
    const m = member || K.getActiveMember();
    const snap = snapOverride || K.evaluateMemberPortfolio(m);

    let annualPartnerOcfTL = 0;
    let annualPartnerFcfTL = 0;
    let fxNaturalShieldTL = 0;
    let peWeightedSum = 0;
    let peWeightTotal = 0;
    let pbWeightedSum = 0;
    let pbWeightTotal = 0;
    let trapExposureTL = 0;
    const sectorBuckets = {};

    for (const it of snap.spotItems) {
      const a = K.getAsset(it.assetKey);
      if (!a) continue;
      if (isFxLinkedShieldAsset(a) || EXPORT_SHIELD_TICKERS.has(a.ticker) || a.venue === 'CRYPTO_24_7') {
        fxNaturalShieldTL += it.netValTL;
      }
      if (a.isPatronSelling || a.isTms29Illusion || a.isPumpAnomaly || a.distributionTrap) {
        trapExposureTL += it.netValTL;
      }
      if (a.bistRow) {
        const sec = a.bistRow.sector || 'Borsa İstanbul';
        sectorBuckets[sec] = (sectorBuckets[sec] || 0) + it.netValTL;
        if (!isFinancialEntityRow(a.bistRow)) {
          const bk = computeBakery100kScale(a, it.netValTL);
          if (bk) {
            annualPartnerOcfTL += bk.annualOcfTL;
            annualPartnerFcfTL += bk.annualFcfTL;
          } else if (a.bistRow.netIncomeMillionTL != null && a.bistRow.marketCapBillionTL > 0) {
            const npShare = Math.round(Number(a.bistRow.netIncomeMillionTL) * 1e6 * ((it.netValTL / 1e6) / (a.bistRow.marketCapBillionTL * 1000)));
            annualPartnerOcfTL += npShare;
            annualPartnerFcfTL += npShare;
          }
        } else {
          const fn = computeFinancial100kScale(a, it.netValTL);
          if (fn) {
            annualPartnerOcfTL += fn.annualNetProfitTL;
            annualPartnerFcfTL += fn.annualNetProfitTL;
          }
        }
        if (a.bistRow.pe > 0 && a.bistRow.pe < 120) {
          peWeightedSum += a.bistRow.pe * it.netValTL;
          peWeightTotal += it.netValTL;
        }
        if (a.bistRow.pb > 0 && a.bistRow.pb < 30) {
          pbWeightedSum += a.bistRow.pb * it.netValTL;
          pbWeightTotal += it.netValTL;
        }
      }
    }

    const annualRateCashTL = Math.round(snap.tranches.reduce((s, t) => s + t.monthlyNetDripTL * 12, 0));
    const totalAnnualCashEngineTL = Math.round(annualPartnerOcfTL + annualRateCashTL);
    const dailyCashEngineTL = +(totalAnnualCashEngineTL / 365).toFixed(1);
    const fxNaturalShieldPct = +((fxNaturalShieldTL / Math.max(1, snap.totalNetWorthTL)) * 100).toFixed(1);
    const weightedPe = peWeightTotal > 0 ? +(peWeightedSum / peWeightTotal).toFixed(1) : null;
    const weightedPb = pbWeightTotal > 0 ? +(pbWeightedSum / pbWeightTotal).toFixed(2) : null;

    const warnings = [];
    for (const [sec, val] of Object.entries(sectorBuckets)) {
      const pct = Math.round((val / Math.max(1, snap.totalNetWorthTL)) * 100);
      if (pct >= 45 && snap.spotItems.length >= 2) {
        warnings.push(`Gizli Ortak Faktör Riski: Görünürde birden fazla hissen var ama portföyünün %${pct}'i tek başına "${sec}" döngüsüne göbekten bağlı!`);
      }
    }
    if (trapExposureTL > 0) {
      warnings.push(`Kırmızı Bayraklı Pay: Portföyündeki ${Math.round(trapExposureTL).toLocaleString('tr-TR')} ₺ büyüklüğündeki pozisyonda MKK ortak satışı veya TMS-29 nakit yakımı uyarısı var.`);
    }
    if (fxNaturalShieldPct < 15 && snap.allocationBreakdown.cashPct > 50) {
      warnings.push(`Kur Şoku Korumasızlığı: Portföyünün yalnızca %${fxNaturalShieldPct}'i doğal döviz/altın/ihracat zırhına sahip; olası kur sıçramasında alım gücü geride kalabilir.`);
    }

    const be32 = computeBreakevenComparison(100000, 32);
    return {
      annualPartnerOcfTL: Math.round(annualPartnerOcfTL),
      annualPartnerFcfTL: Math.round(annualPartnerFcfTL),
      annualRateCashTL,
      totalAnnualCashEngineTL,
      dailyCashEngineTL,
      fxNaturalShieldPct,
      weightedPe,
      weightedPb,
      trapExposureTL: Math.round(trapExposureTL),
      breakevenUsd32d: be32?.breakevenUsdBazaar || 0,
      warnings
    };
  }

  // --------------------------------------------------------------------------
  // 12. KART HIZLI SİNYALİ, ZAMAN TERAZİSİ & 360° VARLIK AÇIKLAMASI
  // --------------------------------------------------------------------------
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
    if (!asset || asset.isRateInstrument || !(asset.priceTL > 0)) return null;
    const r = asset.bistRow;
    if (r && r.low52W > 0 && r.high52W > r.low52W) {
      const low = +Math.min(Number(r.low52W), asset.priceTL).toFixed(2);
      const high = +Math.max(Number(r.high52W), asset.priceTL).toFixed(2);
      const pct = Math.max(0, Math.min(100, Math.round(((asset.priceTL - low) / Math.max(0.01, high - low)) * 100)));
      return {
        low,
        high,
        pct,
        drawdownPct: +(((asset.priceTL / high) - 1) * 100).toFixed(1)
      };
    }
    const usdTry = global.AetherKernelV10?.getUsdTry ? global.AetherKernelV10.getUsdTry() : 50.44;
    const scale = asset.isForeignUsd ? usdTry : 1;
    const fn = asset.fundamentals;
    if (fn && Number(fn.low52W) > 0 && Number(fn.high52W) > Number(fn.low52W)) {
      const low = +Math.min(Number(fn.low52W) * scale, asset.priceTL).toFixed(2);
      const high = +Math.max(Number(fn.high52W) * scale, asset.priceTL).toFixed(2);
      const pct = Math.max(0, Math.min(100, Math.round(((asset.priceTL - low) / Math.max(0.01, high - low)) * 100)));
      return {
        low,
        high,
        pct,
        drawdownPct: +(((asset.priceTL / high) - 1) * 100).toFixed(1)
      };
    }
    // Spot Döviz / Fiziki Altın-Gümüş / TCMB Konut için gerçek tarihsel getiri + ampirik kanaldan 52H aralığı türet
    const pts = [asset.priceTL];
    for (const pf of [asset.perf1W, asset.perf1M, asset.perf3M, asset.perf6M, asset.perf1Y]) {
      if (pf != null && Number.isFinite(Number(pf)) && (1 + Number(pf) / 100) > 0.15) {
        pts.push(asset.priceTL / (1 + Number(pf) / 100));
      }
    }
    const emp = asset.trainedDaily?.empiricalRules;
    if (emp) {
      const eSup = Number(emp.supportPrice) * scale;
      const eRes = Number(emp.resistancePrice) * scale;
      if (eSup > asset.priceTL * 0.35 && eSup < asset.priceTL * 2.2) pts.push(eSup);
      if (eRes > asset.priceTL * 0.35 && eRes < asset.priceTL * 2.2) pts.push(eRes);
    }
    const low = +Math.min(...pts).toFixed(2);
    const high = +Math.max(...pts).toFixed(2);
    if (high > low * 1.002) {
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
    const rev = K?.getCatalogRev ? K.getCatalogRev() : 0;
    if (rev !== cachedForensicRev) {
      cachedForensicRev = rev;
      cachedForensicScoreMap.clear();
      cachedQuickSignalMap.clear();
    }
    const cachedSig = cachedQuickSignalMap.get(asset.key);
    if (cachedSig) return cachedSig;

    const sig = computeCardQuickSignalUncached(asset, K);
    cachedQuickSignalMap.set(asset.key, sig);
    return sig;
  }

  function computeCardQuickSignalUncached(asset, K) {
    if (asset.subVenue === 'DARPHANE_S1') {
      const d = K.getDarphanePremiumInfo();
      if (d.premiumPct >= 5) {
        return {
          badge: `⚠️ +%${d.premiumPct} Hava Parası`,
          tone: 'warn',
          oneLiner: `Fiziki gram altından gr başına ${fmtInt(d.diffTL)} ₺ daha pahalı işlem görüyor!`
        };
      }
    }

    if (asset.isRateInstrument) {
      const netAnnual = +(asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100)).toFixed(1);
      const monthly100k = Math.round((100000 * (netAnnual / 100)) / 12);
      return {
        badge: asset.stopajPct === 0 ? '💧 %0 Vergi Kalkanı' : `💧 Net %${netAnnual}/Yıl`,
        tone: 'good',
        oneLiner: `100.000 ₺ bağlarsan her ay net +${fmtInt(monthly100k)} ₺ kasana damlar.`
      };
    }

    const fin = computeFinancial100kScale(asset);
    if (fin) {
      if (fin.annualNetProfitTL > 0 && (asset.bistRow?.dividendYield || 0) >= 3.0) {
        return {
          badge: `🏦 ROE %${fin.roePct ?? '-'} · Temettü`,
          tone: 'good',
          oneLiner: `100B ₺ ortaklığa yılda +${fmtInt(fin.annualNetProfitTL)} ₺ net kâr · PD/DD ${fin.pb ?? '-'}x.`
        };
      }
      if (fin.annualNetProfitTL > 0) {
        return {
          badge: `🏦 Kârlı Finans (PD/DD ${fin.pb ?? '-'}x)`,
          tone: 'info',
          oneLiner: `100B ₺ ortaklığa yılda +${fmtInt(fin.annualNetProfitTL)} ₺ net kâr${fin.roePct != null ? ` · ROE %${fin.roePct}` : ''}.`
        };
      }
      return { badge: '⚠️ Kârlılık Baskısı', tone: 'warn', oneLiner: fin.plainSummary };
    }

    if (asset.isPumpAnomaly || asset.isTms29Illusion || asset.distributionTrap || asset.isPatronSelling) {
      let why = 'Kurumsal para çıkışı veya bilanço zayıflığı tespit edildi.';
      let bdg = '⛔ Tuzak / Risk Alarmı';
      if (asset.isPatronSelling) {
        bdg = '🕵️ MKK Patron Arzı';
        why = asset.mkkAlert?.note || 'MKK fiili dolaşımdaki pay adedi arttı (ortak satışı hazırlığı).';
      } else if (asset.isTms29Illusion) {
        bdg = '⛔ TMS-29 Makyajlı Kâr';
        why = 'Kağıt üstünde kâr görünse de kasadan gerçek nakit çıkıyor!';
      } else if (asset.isPumpAnomaly) {
        bdg = '⛔ Hacim Şişmesi';
        why = 'Sosyal medya / olağandışı hacim anomalisi — sürü coşkusuna dikkat!';
      } else if (asset.distributionTrap?.trapReason) {
        why = asset.distributionTrap.trapReason;
      }
      return { badge: bdg, tone: 'danger', oneLiner: why };
    }

    if (asset.vukRecord?.kind === 'VUK_CASH_LEADER') {
      const bk = computeBakery100kScale(asset);
      return {
        badge: '🟢 VUK Saf Nakit Şampiyonu',
        tone: 'good',
        oneLiner: bk
          ? `100B ₺'ye yılda +${fmtInt(bk.annualOcfTL)} ₺ gerçek kasa nakdi (Kağıt kârının çok üzerinde!).`
          : asset.vukRecord.vukVerdict
      };
    }

    if (asset.capexRecord?.kind === 'CAPEX_HARVEST') {
      const bk = computeBakery100kScale(asset);
      return {
        badge: '🏭 CAPEX Nakit Hasadı',
        tone: 'good',
        oneLiner: bk
          ? `Yatırımını katlayıp 100B ₺'ye yılda net +${fmtInt(bk.annualFcfTL)} ₺ serbest nakit (FCF) bırakıyor.`
          : asset.capexRecord.harvestNote
      };
    }

    if (asset.accumulationGem || asset.forensicPattern?.patternCode === 'QUIET_BOTTOM' || (asset.bistRow && (asset.bistRow.drawdown52WPct || 0) <= -30 && (asset.bistRow.ocfMillionTL || 0) > 0 && (asset.bistRow.cmf20 || 0) >= 0.10)) {
      const bk = computeBakery100kScale(asset);
      return {
        badge: '🔥 Yangın Yeri Hazinesi',
        tone: 'good',
        oneLiner: bk
          ? `Zirveden %${Math.abs(Math.round(asset.bistRow?.drawdown52WPct || 35))} iskontolu; 100B ₺'ye yılda +${fmtInt(bk.annualOcfTL)} ₺ nakit üretiyor.`
          : 'İskontolu fiyatta tahtada sessiz kurumsal toplama ve pozitif nakit akışı var.'
      };
    }

    const bk = computeBakery100kScale(asset);
    if (bk) {
      if (bk.annualOcfTL > 0 && bk.cashShareTL >= bk.debtShareTL * 0.8) {
        return {
          badge: '🥖 Net Nakit & Sağlam Kasa',
          tone: 'good',
          oneLiner: `100B ₺ ortaklığa yılda +${fmtInt(bk.annualOcfTL)} ₺ gerçek nakit üretir · Borcu rahat.`
        };
      }
      if (bk.annualOcfTL < 0) {
        return {
          badge: '⚠️ Kasa Nakit Yakıyor',
          tone: 'warn',
          oneLiner: `100B ₺ ortaklığa karşılık esas faaliyetten yılda ${fmtInt(Math.abs(bk.annualOcfTL))} ₺ nakit eksiliyor.`
        };
      }
      if (bk.annualOcfTL === 0) {
        return {
          badge: '⚖️ Başabaş Kasa',
          tone: 'neutral',
          oneLiner: `Son 12 ayda esas faaliyet nakit akışı başabaş (~0 ₺) seyrediyor.`
        };
      }
      return {
        badge: (asset.bistRow?.dividendYield || 0) >= 2.5 ? '💧 Temettü & Kasa' : '📊 Reel Üretim Kasası',
        tone: 'info',
        oneLiner: `100B ₺ ortaklığa yılda +${fmtInt(bk.annualOcfTL)} ₺ faaliyet nakdi giriyor.`
      };
    }

    if (asset.bistRow && asset.bistRow.netIncomeMillionTL > 0 && asset.bistRow.marketCapBillionTL > 0) {
      const np100k = Math.round(Number(asset.bistRow.netIncomeMillionTL) * 1e6 * ((100000 / 1e6) / (asset.bistRow.marketCapBillionTL * 1000)));
      return {
        badge: (asset.bistRow.dividendYield || 0) >= 2.5 ? '💧 Kârlı & Temettü' : `📊 Kârlı Ortaklık (PD/DD ${asset.bistRow.pb ?? '-'}x)`,
        tone: 'info',
        oneLiner: `100B ₺ ortaklığa yılda +${fmtInt(np100k)} ₺ net dönem kârı düşüyor.`
      };
    }

    const custom = ASSET_PROFILES[asset.key] || ASSET_PROFILES[asset.id] || ASSET_PROFILES['bist-' + String(asset.ticker || '').toLowerCase()];
    return {
      badge: asset.venue === 'TWO_DOOR'
        ? '⚖️ Çarşı vs Banka (%0 Vergi)'
        : (asset.subVenue === 'BIST_EXEMPT_ETF' ? '🛡️ %0 Stopaj BYF' : (asset.subVenue === 'BIST_TAXABLE_ETF' ? '📋 %17,5 Stopaj BYF' : (asset.isForeignUsd ? '🌍 Küresel USD (GVK 80)' : null))),
      tone: 'neutral',
      oneLiner: custom ? custom.shortDesc : asset.categoryName
    };
  }

  function extractQuantitativePassport(asset) {
    const td = asset?.trainedDaily;
    const K = global.AetherKernelV10;
    const buildAnalogs = (src) => {
      const arr = [];
      if (src?.analogs1W) {
        arr.push({
          horizon: '1 Hafta',
          sampleCount: src.analogs1W.sampleCount || 25,
          winRatePct: src.analogs1W.winRatePct,
          hurdleWinPct: src.analogs1W.hurdleWinRatePct,
          expectedPct: src.analogs1W.expectedPct,
          medianPct: src.analogs1W.medianPct
        });
      }
      if (src?.analogs1M) {
        arr.push({
          horizon: '1 Ay',
          sampleCount: src.analogs1M.sampleCount || 25,
          winRatePct: src.analogs1M.winRatePct,
          hurdleWinPct: src.analogs1M.hurdleWinRatePct,
          expectedPct: src.analogs1M.expectedPct,
          medianPct: src.analogs1M.medianPct
        });
      }
      if (src?.analogs3M) {
        arr.push({
          horizon: '3 Ay',
          sampleCount: src.analogs3M.sampleCount || 25,
          winRatePct: src.analogs3M.winRatePct,
          hurdleWinPct: src.analogs3M.hurdleWinRatePct,
          expectedPct: src.analogs3M.expectedPct,
          medianPct: src.analogs3M.medianPct
        });
      }
      return arr;
    };

    if (td && td.isRateAnalysis) {
      const rad = td.radar || {};
      const emp = td.empiricalRules || {};
      const wf = td.walkForward || null;
      const inf = K?.getAnnualInflationPct ? K.getAnnualInflationPct() : 29.8;
      const usdTry = K?.getUsdTry ? K.getUsdTry() : 50.44;
      const netAnnualPct = +(asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100)).toFixed(2);
      const fisherSpreadPct = +(netAnnualPct - inf).toFixed(2);
      const usdBreakeven1M = +(usdTry * (1 + (netAnnualPct / 100) * (30 / 365))).toFixed(2);
      return {
        kind: 'RATE_EMPIRICAL_10Y',
        title: '10 Yıllık Reel Faiz & Carry Başabaş Testi',
        badgeTag: `${td.totalBars || 2500}G`,
        totalBars: td.totalBars || 0,
        dateRange: td.firstDate && td.lastDate ? `${td.firstDate} -> ${td.lastDate}` : (td.selectedModelName || ''),
        modelName: td.selectedModelName || '',
        regimeLabel: td.currentState?.regimeLabel || '',
        walkForwardHitPct: wf?.hitRatePct ?? null,
        walkForwardTests: wf?.testCount ?? null,
        intrinsicPriceTL: null,
        marginOfSafetyPct: null,
        valuationMethodLabel: td.selectedModelName || null,
        piotroskiScore: null,
        kellyPct: rad.kellyPct ?? null,
        cvar95Pct: 0,
        hurst: rad.hurst ?? null,
        supportTL: null,
        resistanceTL: null,
        netAnnualPct,
        fisherSpreadPct,
        usdBreakeven1M,
        verdictBadge: emp.verdictBadge || rad.boardBadge || null,
        preRallyHistoryText: rad.preRallyHistoryText || null,
        whyItMoves: rad.whyItMoves || null,
        bullCondition: emp.bullCondition || rad.boardActionText || null,
        bearCondition: emp.bearCondition || rad.kitchenBlueprint?.hiddenRiskToWatch || null,
        analogs: buildAnalogs(td)
      };
    }

    if (td && !td.isRateAnalysis) {
      const isGoldByf = asset.id === 'altin-fonu-zgold' || asset.id === 'altin-fonu-gldtr' || asset.id === 'fon-degisken-isglk';
      const isSilverByf = asset.id === 'gumus-fonu-gmstr';
      const gramSpot = (isGoldByf && K?.getAsset) ? K.getAsset('gram-altin-spot') : null;
      const silverSpot = (isSilverByf && K?.getAsset) ? K.getAsset('gram-gumus-spot') : null;
      const effTd = (asset.id === 'fon-degisken-isglk' && gramSpot?.trainedDaily) ? gramSpot.trainedDaily : td;
      const rad = effTd.radar || {};
      const emp = effTd.empiricalRules || {};
      const wf = effTd.walkForward || null;
      const usdTry = K?.getUsdTry ? K.getUsdTry() : 50.44;
      const scaleTL = asset.isForeignUsd ? usdTry : 1;
      const r52 = computeRange52W(asset);

      const candInt = rad.intrinsicPrice > 0 ? +(rad.intrinsicPrice * scaleTL).toFixed(2) : null;
      let intrinsicPriceTL = candInt;
      if (isGoldByf && gramSpot?.priceTL > 0 && gramSpot?.trainedDaily?.radar?.intrinsicPrice > 0) {
        intrinsicPriceTL = +(asset.priceTL * (gramSpot.trainedDaily.radar.intrinsicPrice / gramSpot.priceTL)).toFixed(2);
      } else if (isSilverByf && silverSpot?.priceTL > 0 && silverSpot?.trainedDaily?.radar?.intrinsicPrice > 0) {
        intrinsicPriceTL = +(asset.priceTL * (silverSpot.trainedDaily.radar.intrinsicPrice / silverSpot.priceTL)).toFixed(2);
      } else if (candInt != null && asset.priceTL > 0 && (candInt / asset.priceTL > 3.2 || candInt / asset.priceTL < 0.14)) {
        intrinsicPriceTL = (rad.marginOfSafetyPct != null && Math.abs(Number(rad.marginOfSafetyPct)) <= 80)
          ? +(asset.priceTL * (1 + Number(rad.marginOfSafetyPct) / 100)).toFixed(2)
          : null;
      }

      const marginOfSafetyPct = (intrinsicPriceTL != null && asset.priceTL > 0)
        ? +(((intrinsicPriceTL / asset.priceTL) - 1) * 100).toFixed(1)
        : null;

      const candSup = emp.supportPrice > 0 ? +(emp.supportPrice * scaleTL).toFixed(2) : null;
      const candRes = emp.resistancePrice > 0 ? +(emp.resistancePrice * scaleTL).toFixed(2) : null;
      const scaleOk = candSup != null && candRes != null && candRes > candSup && asset.priceTL > 0 &&
        candSup >= asset.priceTL * 0.30 && candSup <= asset.priceTL * 2.2 &&
        candRes >= asset.priceTL * 0.40 && candRes <= asset.priceTL * 3.0;
      let supportTL = scaleOk ? candSup : (r52 ? r52.low : (asset.priceTL > 0 ? +(asset.priceTL * 0.90).toFixed(2) : null));
      let resistanceTL = scaleOk ? candRes : (r52 ? r52.high : (asset.priceTL > 0 ? +(asset.priceTL * 1.15).toFixed(2) : null));
      if (supportTL != null && asset.priceTL > 0 && supportTL > asset.priceTL) {
        supportTL = r52 ? +Math.min(r52.low, asset.priceTL * 0.97).toFixed(2) : +(asset.priceTL * 0.95).toFixed(2);
      }
      if (resistanceTL != null && asset.priceTL > 0 && resistanceTL < asset.priceTL) {
        resistanceTL = r52 ? +Math.max(r52.high, asset.priceTL * 1.03).toFixed(2) : +(asset.priceTL * 1.06).toFixed(2);
      }

      return {
        kind: 'TRAINED_10Y',
        title: '10 Yıllık Ampirik İkiz Günler & Adil Değer Testi',
        badgeTag: `${effTd.totalBars || 2500}G`,
        totalBars: effTd.totalBars || 0,
        dateRange: effTd.firstDate && effTd.lastDate ? `${effTd.firstDate} -> ${effTd.lastDate}` : '',
        modelName: effTd.selectedModelName || '',
        regimeLabel: effTd.currentState?.regimeLabel || '',
        walkForwardHitPct: wf?.hitRatePct ?? null,
        walkForwardTests: wf?.testCount ?? null,
        intrinsicPriceTL,
        marginOfSafetyPct,
        valuationMethodLabel: rad.valuationMethodLabel || null,
        piotroskiScore: rad.piotroskiScore ?? null,
        kellyPct: rad.kellyPct ?? null,
        cvar95Pct: rad.cvar95Pct ?? null,
        hurst: rad.hurst ?? null,
        supportTL,
        resistanceTL,
        verdictBadge: emp.verdictBadge || rad.boardBadge || null,
        preRallyHistoryText: rad.preRallyHistoryText || null,
        whyItMoves: rad.whyItMoves || null,
        bullCondition: emp.bullCondition || null,
        bearCondition: emp.bearCondition || null,
        analogs: buildAnalogs(effTd)
      };
    }

    // 621/621 BIST Şirketi İçin Canlı Bilanço Adil Değer (FCF / EV-EBITDA / Gordon ROE-PD/DD), 9-Kriter Sağlamlık & Yarım-Kelly Kartı
    const r = asset?.bistRow;
    if (!r || !(asset.priceTL > 0)) return null;

    const inf = K?.getAnnualInflationPct ? K.getAnnualInflationPct() : 29.8;
    const price = Number(asset.priceTL);
    const mcapM = Number(r.marketCapBillionTL) > 0 ? Number(r.marketCapBillionTL) * 1000 : 0;
    const hasBalanceSheet = r.cashMillionTL != null || r.totalDebtMillionTL != null || r.netDebtMillionTL != null;
    const isFin = isFinancialEntityRow(r);
    const isGyo = r.sector === 'Gayrimenkul & GYO' || r.industry === 'Real Estate Investment Trusts';
    const ocf = Number(r.ocfMillionTL) || 0;
    const fcf = r.fcfMillionTL != null ? Number(r.fcfMillionTL) : (ocf - Math.abs(Number(r.capexMillionTL) || 0));
    const ebitda = Number(r.ebitdaMillionTL) || 0;
    const netInc = Number(r.netIncomeMillionTL) || 0;
    const netDebt = (r.netDebtMillionTL != null && Number.isFinite(Number(r.netDebtMillionTL)))
      ? Number(r.netDebtMillionTL)
      : ((Number(r.totalDebtMillionTL) || 0) - (Number(r.cashMillionTL) || 0));
    const pb = r.pb != null && Number(r.pb) > 0 ? Number(r.pb) : null;
    const roe = r.roe != null ? Number(r.roe) : null;
    const roic = r.roic != null ? Number(r.roic) : null;

    let fairMcapM = null;
    let methodLabel = mcapM > 0 ? '' : 'Yeni Kotasyon 52H Fiyat Bandı & Tahta Disiplini';
    if (mcapM > 0 && isFin && pb != null) {
      const bookEquityM = mcapM / pb;
      const targetPb = roe != null && roe > 0 ? Math.max(0.55, Math.min(2.4, roe / Math.max(18, inf * 0.92))) : 0.95;
      fairMcapM = bookEquityM * targetPb;
      methodLabel = `Gordon Özsermaye Modeli (Adil PD/DD ${targetPb.toFixed(2)}x · ROE/TÜFE)`;
    } else if (mcapM > 0 && isGyo && pb != null) {
      const bookEquityM = mcapM / pb;
      const targetPb = netDebt <= 0 ? 0.85 : 0.68;
      fairMcapM = bookEquityM * targetPb;
      methodLabel = `GYO Net Aktif Değer (NAD) İskontolu Adil Çarpan (${targetPb}x PD/DD)`;
    } else if (mcapM > 0) {
      const estimates = [];
      if (fcf > 0) estimates.push(fcf * 9.5 - Math.max(0, netDebt * 0.35));
      if (ebitda > 0) {
        const fairEvMult = (roic != null && roic >= 20) ? 7.8 : 6.2;
        const eqFromEv = ebitda * fairEvMult - netDebt;
        if (eqFromEv > 0) estimates.push(eqFromEv);
      }
      if (pb != null && netInc > 0) {
        const bookEq = mcapM / pb;
        estimates.push(Math.sqrt(Math.max(1, netInc * 8.5 * bookEq * 1.25)));
        if (r.ocfMillionTL == null && r.ebitdaMillionTL == null && (r.opMarginPct || 0) >= 8) {
          estimates.push(bookEq * 0.9);
        }
      } else if (pb != null && estimates.length === 0) {
        estimates.push((mcapM / pb) * (ocf > 0 ? 1.0 : 0.65));
      }
      if (estimates.length > 0) {
        fairMcapM = estimates.reduce((s, v) => s + v, 0) / estimates.length;
        methodLabel = fcf > 0 && ebitda > 0
          ? 'Bileşik FCF (9.5x) + FD/FAVÖK + Graham Özsermaye Ortalaması'
          : (ebitda > 0 ? 'Normalleştirilmiş FD/FAVÖK - Net Borç Değerlemesi' : 'Özsermaye & Nakit Akışı Değerlemesi');
      }
    }

    let intrinsicPriceTL = null;
    let marginOfSafetyPct = null;
    if (mcapM > 0 && fairMcapM != null && fairMcapM > 0) {
      const ratio = Math.max(0.2, Math.min(3.2, fairMcapM / mcapM));
      intrinsicPriceTL = +(price * ratio).toFixed(2);
      marginOfSafetyPct = +(((intrinsicPriceTL / price) - 1) * 100).toFixed(1);
    } else if (pb != null && pb > 0) {
      const ratio = Math.max(0.3, Math.min(2.4, (isGyo ? 0.8 : 1.1) / pb));
      intrinsicPriceTL = +(price * ratio).toFixed(2);
      marginOfSafetyPct = +(((intrinsicPriceTL / price) - 1) * 100).toFixed(1);
    }

    // 9-Kriter Bilanço & Tahta Sağlamlık Skoru (Piotroski F-Skor disiplini)
    let fScore = 0;
    if (isFin ? netInc > 0 : ocf > 0) fScore++;
    if (netInc > 0) fScore++;
    if (isFin ? (roe != null && roe >= inf * 0.85) : fcf > 0) fScore++;
    if (isFin ? (pb != null && pb <= 1.25) : (r.ocfMillionTL != null && ocf > netInc)) fScore++;
    if (isFin ? ((r.dividendYield || 0) > 0) : (hasBalanceSheet && (netDebt <= 0 || (r.netDebtToEbitda != null && r.netDebtToEbitda <= 2.2)))) fScore++;
    if (isFin ? ((r.floatPct || 40) <= 45) : (hasBalanceSheet && (r.currentRatio == null || r.currentRatio >= 1.2))) fScore++;
    if (!asset.isPatronSelling && !asset.isPumpAnomaly) fScore++;
    if (isFin ? (roe != null && roe >= 25) : ((r.opMarginPct || 0) >= 8 || (roic != null && roic >= 14))) fScore++;
    if ((Number(r.cmf20) || 0) >= 0) fScore++;

    // Yarım-Kelly Kasa Tavanı (%0 - %22 arası disiplinli pozisyon büyüklüğü)
    const foren = getQuickForensicScore(asset);
    let kellyPct = 0;
    if (!asset.isPatronSelling && !asset.isPumpAnomaly && foren >= 58) {
      const mosBoost = marginOfSafetyPct != null ? Math.max(-6, Math.min(8, marginOfSafetyPct * 0.12)) : 0;
      kellyPct = +Math.max(0, Math.min(22, (foren - 54) * 0.42 + mosBoost)).toFixed(1);
    }

    const low52 = Number(r.low52W) > 0 ? +Math.min(Number(r.low52W), price).toFixed(2) : +(price * 0.85).toFixed(2);
    const high52 = Number(r.high52W) > 0 ? +Math.max(Number(r.high52W), price).toFixed(2) : +(price * 1.25).toFixed(2);
    const cmf = Number(r.cmf20) || 0;

    return {
      kind: 'FUNDAMENTAL_QUANT',
      title: 'Kantitatif Adil Değer, Güvenlik Marjı & Kasa Tavanı',
      badgeTag: 'ADİL',
      totalBars: 0,
      dateRange: methodLabel,
      modelName: methodLabel,
      regimeLabel: '',
      walkForwardHitPct: null,
      walkForwardTests: null,
      intrinsicPriceTL,
      marginOfSafetyPct,
      valuationMethodLabel: methodLabel,
      piotroskiScore: fScore,
      kellyPct,
      cvar95Pct: null,
      hurst: null,
      supportTL: low52,
      resistanceTL: high52,
      verdictBadge: null,
      preRallyHistoryText: null,
      whyItMoves: null,
      bullCondition: `CMF-20 > +0.10 (Şu an ${cmf >= 0 ? '+' : ''}${cmf.toFixed(2)}) ve hacim > 1.2x ile 52H tabanı (${low52} ₺) üzerinde kurumsal toplama.`,
      bearCondition: `Esas faaliyet nakdinin bozulması, MKK pay arzı veya 52H desteğinin (${low52} ₺) hacimli kırılması.`,
      analogs: []
    };
  }

  function explainAsset(assetOrKey, customPartnerTL = 100000) {
    const K = global.AetherKernelV10;
    const asset = typeof assetOrKey === 'string' ? K?.getAsset(assetOrKey) : assetOrKey;
    if (!asset) return null;

    const custom = ASSET_PROFILES[asset.key] || ASSET_PROFILES[asset.id] || ASSET_PROFILES['bist-' + String(asset.ticker || '').toLowerCase()] || null;
    const r = asset.bistRow || null;
    const secDef = SECTOR_DEFAULTS[r?.sector || asset.categoryName] || null;
    const subInd = r?.industry ? (SUB_INDUSTRY_MODELS[r.industry] || null) : null;
    const bakery100k = computeBakery100kScale(asset, customPartnerTL);
    const financial100k = computeFinancial100kScale(asset, customPartnerTL);
    const deepXray = computeDeepForensicXray(asset, customPartnerTL);
    const multiHorizon = computeMultiHorizonRealTable(asset);
    const range52W = computeRange52W(asset);
    const quickSignal = getCardQuickSignal(asset);
    const quantPassport = extractQuantitativePassport(asset);

    let shortDesc = custom?.shortDesc || '';
    let howItWorks = custom?.howItWorks || '';
    let expertEdge = custom?.expertEdge || '';
    let trapWatch = custom?.trapWatch || '';
    let rawInputs = custom?.rawInputs || [];
    let risesWhen = custom?.risesWhen || '';
    let fallsWhen = custom?.fallsWhen || '';
    let relatedKeys = custom?.relatedKeys || [];

    if (!custom) {
      if (asset.isRateInstrument) {
        shortDesc = `Yıllık brüt %${asset.annualGrossRatePct.toFixed(1)} oranlı, %${asset.stopajPct} stopajlı sabit getiri aracı.`;
        howItWorks = 'Anaparanı tahta dalgalanmasına sokmadan büyütür; asıl ölçü vergi düşüldükten sonra kalan net getirinin mutfak enflasyonunu geçmesidir.';
        expertEdge = 'Stopaj sonrası net oranı beklenen TÜFE ve 32 günlük Dolar başabaş kuruyla kıyaslayarak gerçek alım gücü kazancını ölç.';
        trapWatch = 'Vadeden önce bozarak faizi yakmak veya %0 vergili alternatif varken gereksiz stopaj ödemek.';
        rawInputs = ['Merkez Bankası Politika Faizi', 'TÜİK Enflasyonu', 'Stopaj Vergi Oranı'];
        risesWhen = 'Net faiz enflasyonun üzerinde kaldığında (pozitif reel getiri).';
        fallsWhen = 'Enflasyon veya kur net faizin üzerinde sıçradığında.';
        relatedKeys = ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'mevduat-ust'];
      } else if (r) {
        const hasMcap = Number(r.marketCapBillionTL) > 0;
        const mcapStr = hasMcap
          ? `${Number(r.marketCapBillionTL).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Milyar ₺`
          : 'Yeni Kotasyon';
        const floatStr = r.floatPct != null ? `%${Number(r.floatPct).toFixed(1)}` : '%35';
        const isFin = isFinancialEntityRow(r);
        const hasOcf = r.ocfMillionTL != null || r.fcfMillionTL != null;
        const hasNetInc = r.netIncomeMillionTL != null;
        const hasCashFlow = hasOcf || hasNetInc;
        const hasBalanceSheet = r.cashMillionTL != null || r.totalDebtMillionTL != null || r.netDebtMillionTL != null;
        const ocfM = Number(r.ocfMillionTL) || 0;
        const fcfM = r.fcfMillionTL != null ? Number(r.fcfMillionTL) : (ocfM - Math.abs(Number(r.capexMillionTL) || 0));
        const netIncM = Number(r.netIncomeMillionTL) || 0;
        const netDebtM = r.netDebtMillionTL != null ? Number(r.netDebtMillionTL) : ((Number(r.totalDebtMillionTL) || 0) - (Number(r.cashMillionTL) || 0));
        const cmfVal = Number(r.cmf20) || 0;
        const ddVal = Number(r.drawdown52WPct) || 0;

        shortDesc = `${asset.name} (${asset.ticker} · ${r.sector || 'BIST'} · ${hasMcap ? `Piyasa Değeri: ${mcapStr}` : mcapStr} · Dolaşım: ${floatStr}).`;

        const baseModel = subInd?.model
          ? `${asset.name} (${asset.ticker}), ${subInd.model} alanında (${mcapStr}) faaliyet gösterir.`
          : `${asset.name} (${asset.ticker}), ${r.sector || 'Borsa İstanbul'} alanında (${mcapStr}) faaliyet gösterir. ${secDef?.how || ''}`;

        let liveKasaFact = '';
        if (!hasCashFlow && !hasBalanceSheet && r.roe == null) {
          liveKasaFact = 'Yeni kotasyon döneminde işlem görüyor; ilk tam yıllık KAP finansal tabloları ve izahname fon kullanım raporları takip edilmelidir.';
        } else if (isFin) {
          liveKasaFact = hasNetInc
            ? `Son 12 aylık bilançoda ${netIncM >= 0 ? '+' : ''}${netIncM.toLocaleString('tr-TR')} Milyon ₺ net kâr${r.roe != null ? `, %${Number(r.roe).toFixed(1)} özsermaye kârlılığı (ROE)` : ''} ve ${r.pb ?? '-'}x PD/DD çarpanıyla işlem görüyor.`
            : `KAP dönem bilançosu bekleniyor; güncel tahtada ${r.pb ?? '-'}x PD/DD çarpanıyla işlem görüyor.`;
        } else {
          const flowClause = hasOcf
            ? (ocfM === 0 && fcfM === 0
              ? 'Son 12 ayda esas faaliyet nakit akışı başabaş (~0M ₺ OCF) düzeyinde seyretti'
              : `Son 12 ayda esas faaliyet kasasında ${ocfM >= 0 ? '+' : ''}${ocfM.toLocaleString('tr-TR')} Milyon ₺ nakit (yatırımlar sonrası FCF: ${fcfM >= 0 ? '+' : ''}${fcfM.toLocaleString('tr-TR')}M ₺) üretti`)
            : (hasNetInc
              ? `Son 12 aylık bilançoda ${netIncM >= 0 ? '+' : ''}${netIncM.toLocaleString('tr-TR')} Milyon ₺ net dönem sonucu açıkladı (konsolide nakit akış dipnotu KAP'tan izlenmeli)`
              : 'Konsolide KAP nakit akış ve gelir tablosu bekleniyor');
          const debtClause = !hasBalanceSheet
            ? 'borç/nakit kırılımı KAP dipnotlarından takip edilmelidir'
            : (netDebtM < 0
              ? `kasa durumu +${Math.abs(netDebtM).toLocaleString('tr-TR')}M ₺ Net Nakit zırhındadır`
              : (netDebtM === 0
                ? 'finansal banka borcu bulunmayan dengeli kasa yapısındadır'
                : `kasa durumu ${netDebtM.toLocaleString('tr-TR')}M ₺ Net Borç (${r.netDebtToEbitda != null && r.netDebtToEbitda > 0 ? r.netDebtToEbitda + 'x FAVÖK' : 'izlenmeli'}) seviyesindedir`));
          liveKasaFact = `${flowClause}; ${debtClause}.`;
        }

        howItWorks = `${baseModel} ${liveKasaFact}`;

        const leadSrc = subInd?.lead || secDef?.expertEdge || 'Esas Faaliyet Nakit Akışı (OCF), VUK beyannamesi ve MKK fiili dolaşım değişimi';
        const valFact = isFin
          ? `${asset.ticker} için öncü saha göstergesi: ${leadSrc}. Güncel tahtada F/K ${r.pe ?? '-'}x, PD/DD ${r.pb ?? '-'}x ve CMF-20 para akışı ${cmfVal >= 0 ? '+' : ''}${cmfVal.toFixed(2)} seyrediyor.`
          : `${asset.ticker} için öncü saha göstergesi: ${leadSrc}. Güncel çarpanlar FD/FAVÖK ${r.evEbitda ?? '-'}x · PD/DD ${r.pb ?? '-'}x${r.roic != null ? ` · ROIC %${r.roic}` : ''} · CMF-20 ${cmfVal >= 0 ? '+' : ''}${cmfVal.toFixed(2)} (52H zirveye uzaklık: %${ddVal.toFixed(1)}).`;

        expertEdge = valFact;

        let specificRisk = secDef?.trapWatch || 'Kağıt üstünde kâr yazarken kasadan nakit çıkması (TMS-29 illüzyonu) veya yüksek kısa vadeli borç faizi.';
        if (asset.isPatronSelling && asset.mkkAlert) {
          specificRisk = `${asset.ticker} Özel Uyarısı: ${asset.mkkAlert.note} — MKK pay arzı sindirilmeden agresif alım risklidir.`;
        } else if (!isFin && ocfM < 0 && netIncM > 0) {
          specificRisk = `${asset.ticker} Özel Uyarısı: Manşette +${netIncM.toLocaleString('tr-TR')}M ₺ net kâr görünmesine rağmen esas faaliyet kasasından ${Math.abs(ocfM).toLocaleString('tr-TR')}M ₺ nakit çıkıyor (tahsilat/stok veya TMS-29 etkisi)!`;
        } else if (!isFin && (r.netDebtToEbitda || 0) > 4.0) {
          specificRisk = `${asset.ticker} Özel Uyarısı: Net Borç/FAVÖK oranı ${r.netDebtToEbitda}x ile yüksek; sıkı faiz ortamında finansman gideri faaliyet kârını baskılayabilir.`;
        } else if ((r.pb || 0) > 6.0 && (r.roic == null || r.roic < 15)) {
          specificRisk = `${asset.ticker} Özel Uyarısı: ${r.pb}x PD/DD çarpanıyla özsermayesinin oldukça üzerinde fiyatlanıyor; büyüme yavaşlarsa çarpan daralması yaşanabilir.`;
        } else {
          specificRisk = `${asset.ticker} Takip Noktası (${floatStr} fiili dolaşım): ${specificRisk}`;
        }
        trapWatch = specificRisk;

        rawInputs = secDef?.inputs || ['Enerji & Hammadde Maliyeti', 'Ticari Kredi Faizleri', 'İç ve İhracat Talebi'];
        risesWhen = secDef?.rise || 'Satışları ve kasasına giren gerçek faaliyet nakdi büyürken borçluluğu düşük kaldığında.';
        fallsWhen = secDef?.fall || 'Borç faizleri faaliyet kârını yuttuğunda veya ortak satışı geldiğinde.';
        // Sektör içi en likit benzer şirketleri otomatik bağla
        const peers = K.getAllAssets()
          .filter((x) => x.key !== asset.key && x.bistRow && x.bistRow.sector === r.sector)
          .sort((a, b) => (b.bistRow?.marketCapBillionTL || 0) - (a.bistRow?.marketCapBillionTL || 0))
          .slice(0, 4)
          .map((x) => x.key);
        relatedKeys = peers;
      } else if (asset.isForeignUsd) {
        shortDesc = `Dolar bazında işlem gören küresel yatırım aracı (${asset.symbol}).`;
        howItWorks = 'Hem yurt dışındaki dolar fiyatından hem de içerideki Dolar/TL kurundan aynı anda beslenir.';
        expertEdge = 'Satışta alıştan bu yana Yİ-ÜFE üretici enflasyonu %10’u aşmışsa TL maliyetin enflasyonla yükseltilir; kur farkı köpüğüne değil reel kazanca beyan vergisi hesaplanır.';
        trapWatch = 'Küresel F/K zirvelerinde tüm parayla tek kademede girmek.';
        rawInputs = ['Küresel Dolar Fiyatı', 'Dolar / TL Kuru', 'GVK Mükerrer 80 Yİ-ÜFE Endekslemesi'];
        risesWhen = 'Küresel piyasada yükselirken kur desteklediğinde.';
        fallsWhen = 'Küresel borsalarda satış dalgası yaşandığında.';
        relatedKeys = ['abd-sp500-spy', 'abd-nasdaq-qqq', 'doviz-usd'];
      } else {
        shortDesc = `${asset.categoryName.replace(/^\d+\.\s*/, '')} grubunda gerçek yatırım aracı.`;
        howItWorks = 'Piyasadaki arz-talep, kur ve likidite koşullarına göre anlık fiyatlanır.';
        expertEdge = 'Alım-satım makası, stopaj oranı ve alternatif sabit getiri fırsat maliyeti birlikte tartılır.';
        trapWatch = 'Sürü coşkusuyla likidite zirvesinde yakalanmak.';
        rawInputs = ['Küresel Likidite', 'Kur ve Faiz Dengesi'];
        risesWhen = 'Talep ve para girişi hızlandığında.';
        fallsWhen = 'Risk iştahı daraldığında.';
      }
    }

    let executionRule = '';
    if (asset.venue === 'BIST') {
      executionRule = `Hafta içi 10:00–18:00 arası anında eşleşir (kapalı saatte girilen emir sabah 10:00 açılış ziline yazılır; 09:50–10:00 ve 18:01–18:05 eşleşmesinde iptal kilitlenir). Satışta para gerçek T+2 takas kuralıyla 2 iş günü sonra çekilebilir nakde döner.${asset.stopajPct > 0 ? ` Satış kârından %${asset.stopajPct} stopaj kesilir.` : ' Gerçek kişi pay/hisse yoğun BYF alım-satım kazancında %0 stopaj uygulanır.'}`;
    } else if (asset.venue === 'TEFAS') {
      executionRule = `İş günleri 13:30 valör sınırından önce verilen emir gününde işlenir; 13:30 sonrası alım ve bozum emirleri +1/+2 iş günü valör bekler. Stopaj: %${asset.stopajPct}.`;
    } else if (asset.venue === 'TWO_DOOR') {
      executionRule = `Üç gerçek gişe arasında seçim yaparsın: Kapalıçarşı (Pzt–Cmt 09:30–18:30, %0,40 dar makas, %0 vergi), Nöbetçi Döviz/Kuyumcu (Her gün 10:00–22:00, %1,45 makas, %0 vergi) ve Mobil Banka (7/24 açık; 17:30 sonrası ve hafta sonu makas %3,60 açılır + alımda %0,2 kambiyo vergisi kesilir).`;
    } else if (asset.subVenue === 'TERM_DEPOSIT') {
      executionRule = `Vade sonuna kadar (32/181/366 gün) kilitlenir. 6 aya kadar %17,5, 1 yıla kadar %15, 1 yıl üstü %10 stopaj kesilir. Vadeden önce bozarsan biriken faizin tamamı yanar!`;
    } else if (asset.isGvk80) {
      executionRule = `ABD/Avrupa borsaları hafta sonu kapalıdır. Satış anında alıştan bu yana Yİ-ÜFE üretici enflasyonu %10'u geçtiyse TL maliyetin enflasyonla yükseltilir; kalan reel kazanç üzerinden GVK Mükerrer 80 beyan vergisi karşılığı ayrılır.`;
    } else if (asset.venue === 'VIOP') {
      executionRule = `Hafta içi 09:30–18:15 gündüz ve 19:00–23:00 akşam seansında işlem görür; saat 15:00 günlük teminat tamamlama (Margin Call) kontrol saatidir.`;
    } else {
      executionRule = `7/24 kesintisiz anlık piyasa fiyatıyla işlem görür (%0,10 işlem komisyonu).`;
    }

    let smartMoneyNote = null;
    if (r && r.cmf20 != null) {
      if (r.cmf20 >= 0.15) smartMoneyNote = `Tahtada güçlü kurumsal para girişi var (CMF-20: +${r.cmf20.toFixed(2)} · Hacim ${(r.volRatio || 1).toFixed(2)}x).`;
      else if (r.cmf20 <= -0.15) smartMoneyNote = `Dikkat: Tahtada kurumsal para çıkışı / mal dağıtımı izi var (CMF-20: ${r.cmf20.toFixed(2)}).`;
      else smartMoneyNote = `Tahtada alıcı ve satıcı dengeli seyrediyor (CMF-20: ${r.cmf20.toFixed(2)}).`;
    }
    if (asset.isShareBuyback) {
      smartMoneyNote = (smartMoneyNote ? smartMoneyNote + ' ' : '') + 'MKK kayıtlarında dolaşımdaki pay adedi azaldı (geri alım / pay çekilmesi desteği).';
    } else if (asset.isPatronSelling && asset.mkkAlert) {
      smartMoneyNote = (smartMoneyNote ? smartMoneyNote + ' ' : '') + asset.mkkAlert.note;
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
    } else if (r && bakery100k) {
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
      expertEdge,
      trapWatch,
      rawInputs,
      risesWhen,
      fallsWhen,
      relatedKeys,
      executionRule,
      range52W,
      quickSignal,
      bakery100k,
      financial100k,
      deepXray,
      quantPassport,
      multiHorizon,
      smartMoneyNote,
      health
    };
  }

  // --------------------------------------------------------------------------
  // 13. 12 İNTERAKTİF GERÇEK SAHA VAKASI ("SEN OLSAN NE YAPARDIN?")
  // --------------------------------------------------------------------------
  function getFieldCaseCatalog() {
    const K = global.AetherKernelV10;
    const dInfo = K?.getDarphanePremiumInfo ? K.getDarphanePremiumInfo() : { spotGramPrice: 6058, s1GramEquiv: 6917, premiumPct: 14.1, diffTL: 859 };
    const be32 = computeBreakevenComparison(100000, 32) || { usdNow: 50.44, breakevenUsdBazaar: 52.25, sukuk: { netGainTL: 3190 } };

    return [
      {
        id: 'case_01_kap_mkk_trap',
        category: 'KAP & MKK Takas',
        title: 'Vaka 1: Gece 21:30’da Düşen "Dev Sipariş" Haberi ve MKK Patron İzi',
        situation: 'Gece 21:30’da sığ bir teknoloji hissesi KAP’a "Şirketimiz 28 Milyon $ yeni iş sözleşmesi imzaladı!" bildirimi gönderdi. Sosyal medya "Sabah tavan!" diye yıkılıyor. Açıp AETHER Mutfak Radarına baktığında ise patronun 3 gün önce MKK’ya başvurup 35 milyon kapalı lotu borsada satılabilir tipe dönüştürdüğünü ve son 20 günde CMF para akışının -0,24 (kurumsal çıkış) olduğunu görüyorsun.',
        question: 'Sabah 09:55 açılış eşleşmesinde 200.000 ₺ nakdinle ne yaparsın?',
        choices: [
          { id: 'A', label: 'Sabah 09:55’te tavandan piyasa alım emri yazarım; ihale haberi hisseyi uçurur.', isOptimal: false },
          { id: 'B', label: 'Uzak dururum; MKK tipe dönüşüm + negatif CMF varken atılan parlak haber, patronun kalabalığa mal çıkma likiditesi olabilir.', isOptimal: true },
          { id: 'C', label: 'Kredili (margin) alım açıp açılışta %5 alıp hemen satarım.', isOptimal: false }
        ],
        consequence100k: 'Sabah tavandan atlayan 100.000 ₺, öğleden sonra patronun MKK’dan dönüşen 35 milyon lotu tahtaya basmasıyla günü tabanda (-%10) kapattı ve 1 haftada 76.000 ₺’ye eridi!',
        proRule: 'Uzman Kuralı: İyi haber tek başına hiçbir şeydir! Haberin geldiği tahtada 1) MKK Fiili Dolaşım Lot Değişimine, 2) CMF-20 Kurumsal Para Akışına, 3) Yeni işin yıllık ciroya oranına bakmadan tek lot alınmaz.',
        linkedKeys: ['reel-yazilim-miatk', 'bist-asels', 'reel-yazilim-logo']
      },
      {
        id: 'case_02_gold_three_doors',
        category: 'Makas & Vergi Arbitrajı',
        title: 'Vaka 2: Aynı Altının Üç Farklı Kapısı — Hava Parası mı, Vergi mi, Saf Gram mı?',
        situation: `Cumartesi değil, çarşamba öğlen saat 14:00. 300.000 ₺ ile altın almak istiyorsun. Kapalıçarşı fiziki gram altın ${Math.round(dInfo.spotGramPrice).toLocaleString('tr-TR')} ₺ (%0,40 makas, %0 vergi), borsadaki ALTIN.S1 sertifikasının gram karşılığı ${Math.round(dInfo.s1GramEquiv).toLocaleString('tr-TR')} ₺ (+%${dInfo.premiumPct} prim, %0 vergi), altın BYF fonu (ZGOLD) ise spot fiyata yakın ama satış kârından %17,5 stopaj kesiyor.`,
        question: '300.000 ₺ ile en çok saf altını ve en yüksek vergi sonrası net parayı hangi kapı bırakır?',
        choices: [
          { id: 'A', label: 'ALTIN.S1 alırım; borsada komisyon çok düşük ve vergi %0.', isOptimal: false },
          { id: 'B', label: 'Gündüz açıkken Kapalıçarşı fiziki gram altın alırım (%0,40 dar makas, %0 stopaj, sıfır hava parası).', isOptimal: true },
          { id: 'C', label: 'Akşam 19:00’u bekleyip mobil bankadan alırım; telefonumdan çıkmama gerek kalmaz.', isOptimal: false }
        ],
        consequence100k: `100.000 ₺ ile ALTIN.S1 alan kişi baştan ~${Math.round(100000 * (dInfo.premiumPct / (100 + dInfo.premiumPct))).toLocaleString('tr-TR')} ₺ hava parası ödedi; prim normale döndüğünde altın hiç düşmediği halde zarara geçti!`,
        proRule: 'Uzman Kuralı: Aynı varlığın ambalajına fazladan hava parası veya gereksiz stopaj ödenmez. ALTIN.S1 primi +%3,5 altındaysa alınır; +%10 üstündeyse satılıp fiziki altına geçilerek bedavadan gramaj artırılır.',
        linkedKeys: ['gram-altin-spot', 'altin-sertifikasi', 'altin-fonu-zgold']
      },
      {
        id: 'case_03_tms29_illusion',
        category: 'Bilanço & TMS-29',
        title: 'Vaka 3: "F/K 4x Çok Ucuz!" Denilen Şirket mi, Kağıt Kârı Düşük Nakit Makinesi mi?',
        situation: 'Önünde iki sanayi şirketi var: X Şirketi manşette +1,2 Milyar ₺ Net Kâr açıkladı (F/K 4,5x görünüyor) ama Nakit Akış Tablosunda Esas Faaliyet Nakdi (OCF) -1,8 Milyar ₺ ekside! Y Şirketi (TCELL benzeri) TMS-29 amortismanı yüzünden kağıt üstünde sadece +20 Milyar ₺ kâr gösterdi ama kasasına +132 Milyar ₺ gerçek sıcak nakit (OCF) girdi.',
        question: 'Mahalle fırını mantığıyla hangisine ortak olursun?',
        choices: [
          { id: 'A', label: 'X Şirketini alırım; herkes F/K oranına bakar, 4,5x F/K bedavadır.', isOptimal: false },
          { id: 'B', label: 'Y Şirketine ortak olurum; kağıt kâr muhasebe görüşüdür, kasaya giren gerçek nakit (OCF & FCF) ise su götürmez gerçektir!', isOptimal: true },
          { id: 'C', label: 'İkisini yarı yarıya alırım.', isOptimal: false }
        ],
        consequence100k: 'X Şirketinin kârı TMS-29 parasal pozisyon kazancından (borç enflasyon düzeltmesinden) geliyordu; 2 çeyrek sonra nakit sıkışıklığıyla %42 faizle kredi çekmek zorunda kaldı ve hisse yarıya düştü.',
        proRule: 'Uzman Kuralı: Bilançoda ilk bakılacak satır Net Kâr değil, "İşletme Faaliyetlerinden Nakit Akışları (OCF)" ve "Sloan Tahakkuk Oranı"dır. Net kâr pozitifken OCF ağır negatifse o kâr makyajdır!',
        linkedKeys: ['bist-tcell', 'bist-enkai', 'reel-perakende-bimas']
      },
      {
        id: 'case_04_usd_breakeven',
        category: 'Faiz-Kur Matematiği',
        title: 'Vaka 4: "Dolar Kesin Yükselecek!" Diyen Komşu vs 32 Günlük Başabaş Hesabı',
        situation: `Dolar şu an ${be32.usdNow} ₺. Komşun "Ay sonuna Dolar 51,50 ₺ olacakmış, hemen bütün parayı dolara göm!" diyor. Oysa TEFAS’ta %0 stopajlı Kamu Kira Sertifikası (Sukuk) 32 günde net +${be32.sukuk.netGainTL.toLocaleString('tr-TR')} ₺ (100B ₺ için) kazandırıyor ve Dolar başabaş kuru ${be32.breakevenUsdBazaar} ₺ çıkıyor.`,
        question: 'Komşunun dediği gibi Dolar 32 gün sonra gerçekten 51,50 ₺ olursa kim daha kârlı çıkar?',
        choices: [
          { id: 'A', label: 'Dolar 50,44’ten 51,50’ye çıktığı için kesinlikle Dolar alan daha çok kazanır.', isOptimal: false },
          { id: 'B', label: `%0 vergili Sukuk alan kazanır! Çünkü Dolar ${be32.breakevenUsdBazaar} ₺ başabaş eşiğini geçemediği için kur artsa bile TL sabit getirinin altında kalmıştır.`, isOptimal: true },
          { id: 'C', label: 'Vadesiz TL’de bekleyen kazanır.', isOptimal: false }
        ],
        consequence100k: `Dolar 51,50 ₺ olduğunda makas sonrası 100.000 ₺ ~101.700 ₺ olurken, %0 vergili Sukuk ${100000 + be32.sukuk.netGainTL} ₺ oldu! Tahmini doğru çıkan komşu bile terazi hesabı bilmediği için para kaybetti.`,
        proRule: 'Uzman Kuralı: Türkiye’de döviz almadan önce daima "Başabaş Kur = Bugünkü Kur × (1 + Net TL Getirisi) × (1 + Makas)" formülünü kur! Kur bu eşiği aşamayacaksa döviz taşımak reel zarardır.',
        linkedKeys: ['kira-sertifikasi-sukuk', 'doviz-usd', 'para-piyasasi-fonu']
      },
      {
        id: 'case_05_oil_strait_domino',
        category: 'Makro Domino',
        title: 'Vaka 5: Boğazda Tanker Sıkıştı, Brent Petrol Bir Gecede +%25 Fırladı!',
        situation: 'Sabah uyandığında Hürmüz/Kızıldeniz hattında kriz çıktığını ve Brent petrolün 84 $’dan 105 $’a fırladığını gördün. Portföyünün yarısı havayolu hissesinde, yarısı boş nakitte.',
        question: 'Sokak zekâsı domino zinciri bu şokta hangi sırayla çalışır?',
        choices: [
          { id: 'A', label: 'Petrol artışı tüm sanayi ve havayolu şirketlerine yarar; çünkü enflasyon her şeyi yükseltir.', isOptimal: false },
          { id: 'B', label: 'En büyük gideri jet yakıtı olan havayolları maliyet şoku yer; işlenmiş dizel/jet marjı açılan rafineri (TUPRS), petrol fonu (BNO) ve altın ilk kalkan olur.', isOptimal: true },
          { id: 'C', label: 'Sadece GYO şirketleri yükselir.', isOptimal: false }
        ],
        consequence100k: 'Havayollarında yakıt toplam giderin ~%30-35’idir; petrol şokunda rafineri (TUPRS) ve fiziki altın portföyün sigortası olurken korumasız tek sektör sepeti sert darbe yer.',
        proRule: 'Uzman Kuralı: Portföy kurarken "Aynı şokta biri ağlarken diğeri gülen" doğal denge çiftleri (örneğin THYAO yanına TUPRS veya Fiziki Altın) taşırsan hiçbir fırtına seni yıkamaz.',
        linkedKeys: ['emtia-petrol-bno', 'bist-tuprs', 'bist-thyao', 'gram-altin-spot']
      },
      {
        id: 'case_06_value_trap_vs_gem',
        category: 'Değer Tuzağı Testi',
        title: 'Vaka 6: Zirvesinden %65 Düşmüş İki Hisse — Hangisi Hazine, Hangisi Çürük Elma?',
        situation: 'İki hisse de geçen yılki zirvesinden %65 düşmüş. A Hissesi: Net Borç/FAVÖK 11x, Cari Oran 0,62, kasadan her çeyrek nakit çıkıyor ve CMF -0,28. B Hissesi: Zirveden %60 düşmüş, PD/DD 0,55x, kasası pozitif faaliyet nakdi (OCF+) üretiyor ve tahtada CMF +0,18 ile sessiz kurumsal toplama var.',
        question: '"Çok düştü, buradan tepki verir" diyerek hangisini seçersin?',
        choices: [
          { id: 'A', label: 'İkisi de %65 düşmüş, daha ne kadar düşebilir ki? Daha çok düşeni alırım.', isOptimal: false },
          { id: 'B', label: 'Yalnızca B Hissesini kademeli toplarım; A Hissesi %65 düştükten sonra bir %60 daha düşebilen klasik "Değer Tuzağı"dır!', isOptimal: true },
          { id: 'C', label: 'Düşen hiçbir hisse alınmaz; sadece tavan giden hisse alınır.', isOptimal: false }
        ],
        consequence100k: '%80 düşmüş bir hisse, %90 düşüşe giderken elindeki parayı TAM YARI YARIYA (-%50) daha eritir! Çürük bilançoda "dip" yoktur; sağlam kasada ise yangın yeri servet kurdurur.',
        proRule: 'Uzman Kuralı: Ucuz malı sırf ucuz diye alma! Yangın yerinde mal toplamanın 3 şartı: 1) Pozitif Faaliyet Nakdi (OCF > 0), 2) Çevrilebilir Borç (Cari Oran > 1 / Düşük Net Borç), 3) Kurumsal Emilim (CMF > 0).',
        linkedKeys: ['bist-enkai', 'bist-petkm', 'girisim-hubvc']
      },
      {
        id: 'case_07_t2_settlement_trap',
        category: 'Türkiye Piyasa Fiziği',
        title: 'Vaka 7: Çarşamba Satılan Hissenin Cuma Sabahı Nakit Sürprizi (T+2 Kuralı)',
        situation: 'Perşembe öğleden sonra tapuda veya ödemede kullanmak ya da Kapalıçarşı’dan fiziki altın almak için nakde ihtiyacın var. Çarşamba saat 15:00’te Borsa İstanbul’daki 250.000 ₺’lik hisseni sattın.',
        question: 'Perşembe sabahı bu 250.000 ₺’yi banka hesabına çekip kuyumcuya gidebilir misin?',
        choices: [
          { id: 'A', label: 'Evet, sattığım an para hesabımda görünür, hemen çekerim.', isOptimal: false },
          { id: 'B', label: 'Hayır! BIST T+2 takas kuralı gereği Çarşamba satılan hissenin parasıyla başka BIST hissesi alabilirsin ama Cuma sabahından önce nakit çekemez ve altına/mevduata dönemezsin!', isOptimal: true },
          { id: 'C', label: 'Aynı gün akşam 18:10’da çekilir.', isOptimal: false }
        ],
        consequence100k: 'T+2 takas kuralını bilmeyen yatırımcı Perşembe günü ödemesini yapamaz veya yüksek faizli kredili nakit çekmek zorunda kalır; araya bayram tatili girerse bekleme 5–9 güne uzar!',
        proRule: 'Uzman Kuralı: Borsa İstanbul’da takas T+2 iş günüdür (Cuma satarsan Salı günü nakde döner!). VBTS Brüt Takas tedbirli hissede ise T+2 nakdiyle aynı gün başka hisse bile alınamaz.',
        linkedKeys: ['bist-thyao', 'para-piyasasi-fonu', 'gram-altin-spot']
      },
      {
        id: 'case_08_margin_sleep_killer',
        category: 'Risk & Kaldıraç',
        title: 'Vaka 8: Kredili İşlemle (Margin) Yakalanan Sürpriz Haber ve Saat 15:00 Tasfiyesi',
        situation: '1.000.000 ₺ özsermayenin üzerine %50 de aracı kurum kredisi (500.000 ₺ borç, yıllık ~%52 faiz) çekerek 1.500.000 ₺’lik tek hisseye girdin. Beklenmedik bir kararla hisse 2 gün üst üste taban (-%19) açtı ve özsermaye teminat oranın %35 sınırının altına indi.',
        question: 'Böyle bir durumda gerçek hayatta saat 15:00’te ne yaşanır?',
        choices: [
          { id: 'A', label: 'Uzun vadeli yatırımcıyım derim, ekranı kapatır 6 ay beklerim; nasıl olsa geri çıkar.', isOptimal: false },
          { id: 'B', label: 'Bekleyemezsin! Özsermaye oranı %35 altına indiğinde aracı kurum saat 15:00 Margin Call’da sen istemesen bile hisselerini en dipten zorla satar!', isOptimal: true },
          { id: 'C', label: 'Kredi faizi düşüş günlerinde işlemez.', isOptimal: false }
        ],
        consequence100k: 'Özsermayesiyle alan kişi fırtına geçince zararını kurtarabilirken, boyundan büyük borçla giren kişi tam en dip günde zorla tasfiye edildi ve yükselişi dışarıdan izledi!',
        proRule: 'Uzman Kuralı: Borç parayla alınan malın patronu sen değilsin, saattir! %52+ kredi faiziyle hisse taşımak her gece kasandan kesin para yakar ve ilk fırtınada seni oyun dışına atar.',
        linkedKeys: ['viop-bist30-kontrat', 'bist-sasa', 'para-piyasasi-fonu']
      },
      {
        id: 'case_09_ipo_allocation_math',
        category: 'SPK Halka Arz & Lock-Up',
        title: 'Vaka 9: Halka Arza "500.000 ₺ Bastım" Yanılgısı ve 180 Gün Kilidi',
        situation: 'SPK onaylı "Tamamı Eşit Dağıtımlı" popüler bir halka arza 500.000 ₺ nakit bloke ederek talep girdin (Arz büyüklüğü 18,5 milyon lot, katılımcı 500.000 kişi, hisse 40 ₺). Ayrıca 6 ay önce halka arz olmuş başka bir şirketin yarın 180 günlük "Ortak Satmama Taahhüdü (Lock-Up)" süresi doluyor.',
        question: 'Gerçek piyasada bu iki işlem nasıl sonuçlanır?',
        choices: [
          { id: 'A', label: '500.000 ₺ yatırdığım için bana 12.500 lotun tamamı gelir.', isOptimal: false },
          { id: 'B', label: 'Eşit dağıtımda 500B ₺ de yatırsan kişi başı ~37 lot (~1.480 ₺) düşer, 498.520 ₺ boşta bloke bekler! Diğer hissede ise 180. gün Lock-Up bitişi ortak satışı riski doğurur.', isOptimal: true },
          { id: 'C', label: 'Halka arz hisseleri asla düşmez.', isOptimal: false }
        ],
        consequence100k: '500.000 ₺’yi 4 gün boyunca halka arza bloke eden kişi sadece 1.480 ₺’lik lot alırken, kalan 498.520 ₺’nin 4 günlük ~2.100 ₺ PPF/repo getirisini boşuna yaktı!',
        proRule: 'Uzman Kuralı: Eşit dağıtım halka arzlarda tahmini kişi başı düşecek tutarın 1,5–2 katından fazla nakit bağlanmaz; izahnamede gelirin borç kapamaya mı yoksa yeni fabrikaya mı gideceğine bakılır.',
        linkedKeys: ['halka-arz-tabgd', 'halka-arz-altny', 'para-piyasasi-fonu']
      },
      {
        id: 'case_10_capital_increase_types',
        category: 'Sermaye Yapısı',
        title: 'Vaka 10: Bedelsiz, Bedelli ve Tahsisli Sermaye Artırımı — Hangisi Gerçekten Ne Yapar?',
        situation: 'Üç şirket KAP attı: 1) A Şirketi "%400 Bedelsiz Sermaye Artırımı" açıkladı. 2) B Şirketi borç çevirmek için "%200 Bedelli Sermaye Artırımı" açıkladı. 3) C Şirketinde patron "Şirkete cebimden nakit koyarak piyasa fiyatından Tahsisli Sermaye Artırımı yapıyorum" dedi.',
        question: 'Finansal matematik açısından hangisi şirketin kasasını ortakları sulandırmadan/yormadan güçlendirir?',
        choices: [
          { id: 'A', label: '%400 Bedelsiz en iyisidir; bedavadan 4 kat zengin olurum!', isOptimal: false },
          { id: 'B', label: 'Bedelsiz bir pizzayı 4 yerine 20 dilime bölmektir (toplam değer değişmez!); Bedelli senden ek nakit ister; Patronun nakit koyduğu Tahsisli / Geri Alım ise kasaya gerçek taze kan sokar.', isOptimal: true },
          { id: 'C', label: 'Bedelli sermaye artırımı her zaman bedava para dağıtır.', isOptimal: false }
        ],
        consequence100k: '"%400 bedelsiz verecek!" coşkusuyla zirveden atlayan acemi, bölünme sabahı lot sayısının 5’e çıkıp hisse fiyatının 5’te 1’e bölündüğünü (100.000 ₺’nin yine 100.000 ₺ kaldığını) görünce şok yaşadı!',
        proRule: 'Uzman Kuralı: Bedelsiz sermaye artırımı kasaya 1 kuruş bile yeni para sokmaz, sadece muhasebe kalemleri arası aktarımdır. Gerçek değer yaratımı yalnızca ROIC > Sermaye Maliyeti ve Serbest Nakit Akışıdır.',
        linkedKeys: ['bist-froto', 'bist-tuprs', 'girisim-hubvc']
      },
      {
        id: 'case_11_season_rotation',
        category: 'Mevsim & Döngü',
        title: 'Vaka 11: Kıştan Bahara Geçiş — Enflasyon ve Faiz Zirveden Dönerken Köylü Bilgeliği',
        situation: 'Aylarca süren %45+ sıkı faiz kışından sonra aylık enflasyon üst üste 3 ay beklenti altı geldi, 2 yıllık Hazine tahvil faizi geri çekilmeye başladı ve Merkez Bankası ilk faiz indirim sinyallerini verdi.',
        question: 'Kış biterken portföy çarkını hangi varlıklara doğru kademeli kaydırırsın?',
        choices: [
          { id: 'A', label: 'Sonsuza kadar sadece gecelik Para Piyasası Fonunda (PPF) kalırım; hiç kıpırdamam.', isOptimal: false },
          { id: 'B', label: 'Sabit kuponlu Tahvil (DİBS), iskontolu büyük Bankalar, Konut/Mülk GYO ve faize duyarlı Otomotiv/Sanayi tohumlarını kalabalık uyanmadan kademeli ekerim.', isOptimal: true },
          { id: 'C', label: 'Faiz düşerken en çok borçlu batık şirketleri tek sepette alırım.', isOptimal: false }
        ],
        consequence100k: 'Faiz indirim döngüsü başladığında PPF’nin günlük getirisi her ay erirken, sabit kuponlu DİBS ve 0,5x PD/DD’den toplanan sağlam GYO/Banka/Otomotiv sepeti bahar rallisini sırtladı.',
        proRule: 'Uzman Kuralı: Borsa bugünü değil, 6 ay sonrasını fiyatlar. Faiz indirimi gazetelerin manşetine çıktığında tren yarı yolu gitmiş olur; öncü sinyal 2Y-10Y tahvil faizinin yön değiştirmesidir!',
        linkedKeys: ['dibs-tahvil', 'gayrimenkul-konut-ekgyo', 'bist-garan', 'bist-froto']
      },
      {
        id: 'case_12_gvk80_yiufe_tax',
        category: 'Küresel Yatırım & Vergi',
        title: 'Vaka 12: ABD S&P 500 (SPY) Satışında "Yİ-ÜFE %10 Endeksleme" Vergi Kalkanı',
        situation: '1 yıl önce Dolar 38 ₺ iken 380.000 ₺ (10.000 $) ödeyerek S&P 500 ETF (SPY) aldın. Bugün SPY dolar bazında +%10 artarak 11.000 $ oldu, Dolar/TL de 50,44 ₺’ye çıktı (Satış tutarın: ~554.840 ₺ · Kağıt üstü TL fark: +174.840 ₺). Bu sürede TÜİK Yİ-ÜFE üretici enflasyonu +%28 arttı.',
        question: 'Türkiye vergi kanununa (GVK Mükerrer 80) göre vergin 174.840 ₺’nin tamamı üzerinden mi hesaplanır?',
        choices: [
          { id: 'A', label: 'Evet, 174.840 ₺ TL farkının tamamı vergiye tabidir.', isOptimal: false },
          { id: 'B', label: 'Hayır! Alış-satış arası Yİ-ÜFE artışı %10’u geçtiği için (+%28), 380.000 ₺ alış maliyetin enflasyonla ~486.400 ₺’ye yükseltilir; sadece kalan ~68.440 ₺ "gerçek reel kazanç" vergiye tabi olur!', isOptimal: true },
          { id: 'C', label: 'Yurt dışı borsalarda Türkiye’de hiçbir vergi beyanı kuralı yoktur.', isOptimal: false }
        ],
        consequence100k: 'Yİ-ÜFE %10 eşiğini (örneğin %9,6’da acele satmayıp %10,2 olmasını) bekleyen uzman yatırımcı, kur/enflasyon farkı üzerinden on binlerce lira fazladan vergi ödemekten tamamen yasal olarak kurtuldu!',
        proRule: 'Uzman Kuralı: Yurt dışı hisse/ETF ve Eurobond satışlarında alış ile satış ayı arasındaki Yİ-ÜFE artışı %10,00 ve üzerindeyse maliyet endekslemesi devreye girer; satmadan önce Yİ-ÜFE farkını mutlaka kontrol et!',
        linkedKeys: ['abd-sp500-spy', 'abd-nasdaq-qqq', 'eurobond-emb']
      },
      {
        id: 'case_13_drought_6month_lead',
        category: 'İklim & Saha Öncüsü',
        title: 'Vaka 13: Barajlar %28’e İndi, Kuraklık Başladı — 6 Ay Sonra Kimin Kasası Dolacak, Kim Zorlanacak?',
        situation: 'İlkbahar yağışları mevsim normallerinin %45 altında kaldı; DSİ baraj dolulukları ve EPİAŞ hidroelektrik (HES) üretimi sert düştü, dünya buğday/yem fiyatları kıpırdanmaya başladı. Bilançolarda ise henüz her şey güllük gülistanlık görünüyor!',
        question: 'Aylar sonrasını bugünden okuyan usta yatırımcı nasıl pozisyon alır?',
        choices: [
          { id: 'A', label: 'Yüksek döviz borçlu HES elektrik şirketlerine ve vadeli/borçlu küçük gıda fabrikalarına yüklenirim.', isOptimal: false },
          { id: 'B', label: 'Su bulamayan borçlu HES ve hammadde sıkışması yaşayacak borçlu fabrikadan çıkarım; hammaddeyi peşin alıp zammı aynı sabah rafa yansıtan Net Nakitli Gıda Perakendecisi (BIMAS/MGROS) ve Tarım Emtiası (DBA) seçerim.', isOptimal: true },
          { id: 'C', label: 'Kuraklığın şirket bilançolarıyla hiçbir ilgisi yoktur.', isOptimal: false }
        ],
        consequence100k: '2 çeyrek sonra su seviyesi düşen borçlu HES santralinin FAVÖK’ü yarıya inerken, raf fiyatlama gücü ve peşin nakit kasası olan market zincirleri enflasyonun üzerinde reel kâr büyüttü!',
        proRule: 'Uzman Kuralı: Doğadaki fiziksel darboğaz (yağış, baraj, navlun, gümrük tonajı), muhasebe bilançosuna 3 ila 6 ay gecikmeyle düşer. EPİAŞ ve DSİ verisini izleyen fırtınayı herkes uyumadan görür.',
        linkedKeys: ['emtia-tarim-dba', 'reel-perakende-bimas', 'reel-perakende-mgros']
      },
      {
        id: 'case_14_oem_supplier_leak',
        category: 'Tedarik Zinciri Sızıntısı',
        title: 'Vaka 14: Ana Sanayi Devi Rekor İhracat Açıkladı — Yan Sanayiye Atlarken Hangi Tuzağa Bakılır?',
        situation: 'Ayın 3’ünde OSD raporu açıklandı: Ana otomotiv ve savunma devlerinin (FROTO, ASELS) ihracat teslimatları güçlü arttı. Yan sanayi tedarikçisi iki şirketten X’te PD/DD 0,65x ve CMF +0,14 (kurumsal giriş) var; Y’de ise PD/DD 9,5x ve CMF -0,22 (kurumsal çıkış) var.',
        question: 'Çapraz tedarik zinciri okumasını nasıl uygularsın?',
        choices: [
          { id: 'A', label: 'Ana sanayi büyüdüyse bütün yan sanayi hisseleri gözü kapalı tavan gider; Y daha hareketli diye Y’yi alırım.', isOptimal: false },
          { id: 'B', label: 'Ana sanayi verisini "öncü ciro sinyali" olarak kullanırım ama sadece çarpanı makul ve tahtasında kurumsal toplama (CMF > 0) olan X tedarikçisine girerim!', isOptimal: true },
          { id: 'C', label: 'Bilanço açıklanana kadar 45 gün bekler, en tepeden alırım.', isOptimal: false }
        ],
        consequence100k: 'Ana firmanın (OEM) aylık bülteni yan sanayinin cirosunu 45 gün önceden sızdırır; ancak çarpanı şişik ve CMF’si negatif olan Y tahtasında iyi haber mal dağıtımı için kullanıldı!',
        proRule: 'Uzman Kuralı: Ana Sanayi (OEM) -> Yan Sanayi çapraz okumasında 2 filtre şarttır: 1) Yan sanayide makul PD/DD ve pozitif OCF, 2) Tahtada CMF > 0 kurumsal teyidi (Pusula -> Mutfak -> Gümrük & BDDK masasında canlı izlenir).',
        linkedKeys: ['bist-froto', 'bist-egeen', 'bist-asels']
      },
      {
        id: 'case_15_barbell_zero_ruin',
        category: 'Portföy Mimarisi',
        title: 'Vaka 15: Sıfır İflas "Halter (Barbell)" Stratejisi vs Ortada Ezilen Sepet',
        situation: '1.000.000 ₺ sermayeni yönetirken hem %30 enflasyona ezilmek istemiyorsun hem de ani bir jeopolitik krizde -%40 eriyip oyun dışı kalmak istemiyorsun.',
        question: 'Kurumsal fon yöneticilerinin kullandığı "Halter (Barbell)" mimarisi bu 1 milyonu nasıl kurar?',
        choices: [
          { id: 'A', label: '1 milyonun tamamıyla ne uzayan ne kısalan borçlu yan tahtalar alıp dua ederim.', isOptimal: false },
          { id: 'B', label: 'Bir uca %50–65 "Kırılmaz Zırh" (%0 vergili Sukuk, PPF, Fiziki Altın) koyup her ay kesin nakit üretirim; diğer uca %35–50 "Nakit Basan İskontolu Kaleler" (FCF+, ROIC yüksek devler) koyarım, sıfır kaldıraç taşırım!', isOptimal: true },
          { id: 'C', label: '500.000 ₺ kredi çekip tek hisseye 1.500.000 ₺ basarım.', isOptimal: false }
        ],
        consequence100k: 'Piyasa +%30 ralli yaptığında kaliteli hisse ucu portföyü yukarı taşır; piyasa -%25 çöktüğünde ise Kırılmaz Zırh hem portföyü korur hem de yangın yerinden bedava fabrika toplayacak sıcak cephaneyi hazır tutar!',
        proRule: 'Uzman Kuralı: Asla iflas etmeyen (Zero-Ruin) yatırımcı her mevsimde hayatta kalır; bileşik getiri ancak büyük çöküşlerde sıfırlanmayan kasalarda mucize yaratır.',
        linkedKeys: ['kira-sertifikasi-sukuk', 'gram-altin-spot', 'bist-tuprs', 'bist-enkai']
      }
    ];
  }

  // --------------------------------------------------------------------------
  // 14. 10 BÖLÜMLÜK YAŞAYAN UZMANLIK REHBERİ & 26 TERİMLİK SOKAK SÖZLÜĞÜ
  // --------------------------------------------------------------------------
  function getExpertCurriculum() {
    const K = global.AetherKernelV10;
    const inf = K?.getAnnualInflationPct ? K.getAnnualInflationPct() : 29.8;
    const be32 = computeBreakevenComparison(100000, 32) || { usdNow: 50.44, breakevenUsdBazaar: 52.25, sukuk: { annualGross: 36.5 } };
    const dInfo = K?.getDarphanePremiumInfo ? K.getDarphanePremiumInfo() : { premiumPct: 14.1 };

    return [
      {
        id: 'mod_01_bakery_cash',
        step: '01',
        title: 'Bilanço Röntgeni: Kağıt Kâr Yalan Söyler, Kasa Nakdi Doğruyu Söyler',
        streetSummary: 'Mahalledeki fırının defterinde "Bu ay 500 bin lira kâr ettik" yazıyor ama kasayı açıyorsun içinde para yok; hepsi veresiye defterinde ve stokta! Borsada da Net Kâr muhasebe görüşüdür, Esas Faaliyet Nakit Akışı (OCF) ise kasaya giren gerçek sıcak paradır.',
        proFormula: 'Altın Formül: Serbest Nakit Akışı (FCF) = Esas Faaliyet Nakdi (OCF) − Yatırım Harcaması (CAPEX). Nakit Dönüşüm Oranı = OCF / Net Kâr (> 1,0x olmalı). Sloan Tahakkuk Oranı = (Net Kâr − OCF) / Toplam Varlıklar (Negatifse kasa çok kalitelidir; +%15 üstüyse makyajlı kâr tehlikesidir!).',
        liveCheck: 'Herhangi bir BIST hissesine dokunup "Kasa & Röntgen" sekmesini açtığında bu 5 sütunun canlı hesabını saniyesinde görürsün.',
        sampleKeys: ['bist-tcell', 'reel-perakende-bimas', 'bist-enkai', 'bist-tuprs']
      },
      {
        id: 'mod_02_tms29_vuk',
        step: '02',
        title: 'TMS-29 Enflasyon Muhasebesi vs VUK Vergi Dairesi Gerçeği',
        streetSummary: 'Türkiye’de enflasyon muhasebesi (TMS-29) yüzünden borçlu şirket "borcum enflasyonla eridi" diye kağıt üstünde parasal kazanç yazabilirken, özkaynağı ve fabrikası güçlü şirket yüksek amortisman yüzünden kağıt üstünde düşük kâr gösterebilir!',
        proFormula: 'Uzman Sırrı: KAP’a düşen "Vergi Dairesine Sunulan (VUK) Geçici Vergi Beyannamesi" enflasyon muhasebesi makyajı içermez; saf kesilen fatura ve tahsilat gücünü gösterir. OCF ve FAVÖK güçlü olduğu halde TMS-29 yüzünden F/K yüksek görünen şirketler en büyük gizli hazinelerdir!',
        liveCheck: 'Pusula -> Mutfak -> "TMS-29 & VUK Kasa" masasından 377 şirketin canlı denetimini incele.',
        sampleKeys: ['bist-tcell', 'bist-thyao', 'bist-petkm']
      },
      {
        id: 'mod_03_sector_scales',
        step: '03',
        title: 'Her Dükkân Aynı Teraziyle Tartılmaz: Sanayi, Banka, Sigorta, GYO ve Holding',
        streetSummary: 'Kuyumcu terazisiyle kamyon tartılmaz! Sanayi şirketinde F/K ve FD/FAVÖK bakılır ama bir Banka veya GYO’ya sanayi terazisiyle bakarsan büyük hata yaparsın.',
        proFormula: '5 Sektörün 5 Gerçek Terazisi: 1) Sanayi/Perakende -> FD/FAVÖK (<7x), ROIC (>TÜFE) ve FCF. 2) Banka -> PD/DD ve ROE (ROE > %' + inf.toFixed(0) + ' enflasyon olmalı). 3) Sigorta -> Teknik Karşılık Havuzu (Float) × Faiz + TSB Aylık Prim. 4) GYO -> F/K bakılmaz! Yalnızca PD/DD (NAD İskontosu < 0,65x) ve Kira/Borç bakılır. 5) Holding -> Solo Net Nakit + İştirak NAD İskontosu (%30+).',
        liveCheck: 'Farklı sektörlerdeki varlık çekmecelerinde sistem otomatik olarak o sektöre özel doğru teraziyi kurar.',
        sampleKeys: ['bist-garan', 'bist-tursg', 'gayrimenkul-konut-ekgyo', 'bist-kchol']
      },
      {
        id: 'mod_04_mkk_smart_money',
        step: '04',
        title: 'MKK Takas, Patron Lot Dönüşümü ve 4 Adli Tahta Ayak İzi',
        streetSummary: 'Pazarda tezgah sahibi arka kapıdan kamyonla çürük mal indirirken ön tarafta "Gel vatandaş kapışılıyor!" diye bağırıyorsa oradan kaçılır. Borsanın arka kapısı Merkezi Kayıt Kuruluşu (MKK) kayıtlarıdır!',
        proFormula: 'Uzman Takibi: 1) KAP’ta "Borsada İşlem Gören Tipe Dönüşüm" bildirimi ve MKK Fiili Dolaşım Lot Artışı -> Patron/ortak satış hazırlığı! 2) CMF-20 (Chaikin Para Akışı) > +0,12 ve 52H dipte yatay fiyat -> Sessiz Kurumsal Toplama. 3) Tavana yakın fiyatta CMF < -0,15 -> Yeşil mumda küçük yatırımcıya mal yıkımı!',
        liveCheck: 'Pusula -> Mutfak -> "MKK & Balina" ve "4 Tahta İzi" masalarında canlı yakalanan tahtaları gör.',
        sampleKeys: ['reel-yazilim-miatk', 'bist-garan', 'bist-selec']
      },
      {
        id: 'mod_05_tax_friction',
        step: '05',
        title: 'Türkiye Vergi, Stopaj, Makas ve GVK Mükerrer 80 Matematiği',
        streetSummary: 'Brüt kazanç övünmek içindir, vergi ve makas düşüldükten sonra cebinde kalan Net Reel Kazanç ise ev geçindirir! Yanlış gişeden ve yanlış vergi kabuğundan işlem yapan, kazancının beşte birini masada bırakır.',
        proFormula: `Türkiye Gerçek Vergi Haritası: • BIST Hisse & Hisse Yoğun BYF (ZPBDL/APX30/Z30KP/OPTGY): %0 Stopaj. • Kamu Kira Sertifikası (Sukuk) & DİBS: %0 Stopaj. • Fiziki Altın/Döviz (Kapalıçarşı): %0 Stopaj, %0,40 makas (Mobil Bankada gece %3,60 makas + %0,2 BSMV!). • Altın/Gümüş/Döviz BYF (ZGOLD/GLDTR/GMSTR/USDTR) & PPF: %17,5 Stopaj. • Temettü: %15 Stopaj. • ABD Hisse/ETF (SPY/NVDA): Yİ-ÜFE >= %10 maliyet endekslemesi sonrası reel kâra beyan.`,
        liveCheck: `Şu an ALTIN.S1 makası +%${dInfo.premiumPct}; Pusula -> Mutfak -> "Başabaş Terazisi" ile kuruşu kuruşuna hesapla.`,
        sampleKeys: ['kira-sertifikasi-sukuk', 'fon-yerli-hisse-zpbdl', 'gram-altin-spot', 'abd-sp500-spy']
      },
      {
        id: 'mod_06_breakeven_triangle',
        step: '06',
        title: 'Faiz – Kur – Enflasyon Üçgeni ve Başabaş Kuru Hesabı',
        streetSummary: 'Türkiye’de yatırımın kalbi üçlü bir tahterevallidir: Politika Faizi, Enflasyon (TÜFE) ve Döviz Kuru. Duyguyla "Ben hep dolarcıyım" veya "Ben hep faizciyim" diyen mevsim değiştiğinde ezilir.',
        proFormula: `Canlı Terazi: Bugün Dolar ${be32.usdNow} ₺, %0 vergili Sukuk yıllık %${be32.sukuk.annualGross}. 32 günlük Dolar Başabaş Kuru = ${be32.breakevenUsdBazaar} ₺! Reel Faiz = Net Faiz − Beklenen Enflasyon. Reel faiz yüksek pozitifken TL sabit getiri dolar bazında bile servet büyütür; reel faiz negatife döndüğünde ise mal, altın ve ihracatçı korur.`,
        liveCheck: 'Pusula -> Mutfak -> "Başabaş Terazisi"nde tutar ve gün seçerek kendi başabaş kurunu test et.',
        sampleKeys: ['kira-sertifikasi-sukuk', 'doviz-usd', 'mevduat-ust', 'dibs-tahvil']
      },
      {
        id: 'mod_07_leading_data',
        step: '07',
        title: 'Bilançoyu 45 Gün Önceden Okumak: Resmi Saha Öncü Verileri',
        streetSummary: 'Herkes çeyrek bilançonun açıklanacağı geceyi beklerken, usta yatırımcı fabrikanın kapısından geçen kamyonu ve kasadan geçen POS cihazını resmi bültenlerden haftalar önce okur!',
        proFormula: '6 Resmi Öncü Kaynak: 1) Market/Gıda/Giyim/Havayolu -> TCMB Haftalık Kredi Kartı POS Harcamaları (Her Perşembe 14:30). 2) Bankalar -> BDDK Haftalık Bülteni (Perşembe). 3) Sigorta -> TSB Aylık Prim Tablosu. 4) Elektrik/HES/GES -> EPİAŞ Şeffaflık Platformu Saatlik Üretim. 5) Otomotiv -> ODMD & OSD Aylık Adetler. 6) Sanayi İhracatı -> TÜİK 12 Haneli GTİP USD/kg Gümrük Verisi & TİM!',
        liveCheck: 'Pusula -> Mutfak -> "Gümrük & BDDK" masasından canlı GTİP ve TİM ihracat havzalarını incele.',
        sampleKeys: ['halka-arz-tabgd', 'bist-tursg', 'bist-froto', 'reel-enerji-astor']
      },
      {
        id: 'mod_08_microstructure',
        step: '08',
        title: 'Borsa İstanbul Saat Fiziği: Eşleşme, Devre Kesici, T+2, Valör ve VBTS',
        streetSummary: 'Oyunun kurallarını bilmeden sahaya çıkan daha ilk dakikada ofsayta düşer. Borsa İstanbul’un açılış-kapanış tek fiyat eşleşmeleri, 13:30 TEFAS valörü ve T+2 takası gerçek hayatta saniyesi saniyesine işler.',
        proFormula: 'Kritik Saatler: • 09:40–09:55 Emir Toplama (09:50 sonrası iptal kilitlenir!) -> 09:55 Açılış Eşleşmesi -> 10:00 Sürekli Müzayede. • 13:30 TEFAS Fon Valör Sınırı. • 14:00 Perşembe TCMB Faiz Kararı. • 15:00 VİOP/Kredi Margin Call. • 18:00–18:05 Kapanış Eşleşmesi -> 18:10 Kapanış. • 19:00–23:00 VİOP Akşam Seansı. • Arife yarım gün kapanışı: 12:40.',
        liveCheck: 'Pusula -> Takvim sekmesinden tüm seansların şu anki canlı durumunu ve kum saatini takip et.',
        sampleKeys: ['viop-bist30-kontrat', 'para-piyasasi-fonu', 'bist-30']
      },
      {
        id: 'mod_09_contrarian_value',
        step: '09',
        title: 'Yangın Yeri Cesaretini Kurmak ve Değer Tuzağından Kaçmak',
        streetSummary: 'Kalabalık güllük gülistanlık günde pahalıya almak için sıraya girer, fırtına çıktığında ise altın değerindeki fabrikaları zararına sokağa atar. Servet, fırtına gününde cebinde nakit ve yüreğinde terazi bulunduranların el değiştirme ödülüdür.',
        proFormula: 'Yangın Yeri Kontrol Listesi: 1) Şirket 52 haftalık zirvesinden en az %25–%40 iskontolu mu? 2) Kriz geçici mi yoksa iş modeli mi öldü? 3) Kasası pozitif OCF/FCF üretiyor ve borcu çevrilebilir mi? 4) Tek seferde tüm kurşunu sıkmak yerine 3–4 parçalı kademeyle mi giriyorsun?',
        liveCheck: 'Piyasa sekmesindeki "🔥 Yangın Yeri" ve "🏭 Hasat & Değer" mercekleriyle canlı adayları tara.',
        sampleKeys: ['bist-eregl', 'bist-froto', 'bist-sise', 'bist-enkai']
      },
      {
        id: 'mod_10_personal_wheel',
        step: '10',
        title: 'Kendi Nakit Çarkını ve Karakterine Uygun Stratejiyi İnşa Etmek',
        streetSummary: 'Başkasının gömleği sana dar gelir. Kimi insan -%10 düşüşte uykusunu kaybeder, kimi insan 3 yıl sabırla temettü ve fabrika büyütür. En iyi portföy, en yüksek hayali getiriyi vaat eden değil, fırtınada panik yapmadan taşıyabildiğin portföydür!',
        proFormula: 'Çekirdek + Uydu Mimarisi: • %35–50 Enflasyon & Nakit Zırhı (Sukuk, PPF, Fiziki Altın) -> Uykunu korur ve krizde cephane sağlar. • %35–50 Nakit Basan Kaliteli Şirketler & Küresel Endeks (TUPRS, BIMAS, FROTO, THYAO, SPY vb.) -> Reel servet büyütür. • %0–10 Asimetrik Fırsatlar -> Kaldıraçsız, tek sepete %25’ten fazla yüklenmeden.',
        liveCheck: 'Cüzdan sekmesindeki "Kendi Nakit Çarkın (Özgürlük %)" ve Ustalık sekmesindeki "Kasa Doktoru" ile çarkını ölç.',
        sampleKeys: ['kira-sertifikasi-sukuk', 'gram-altin-spot', 'bist-tuprs', 'abd-sp500-spy']
      }
    ];
  }

  function getStreetLexicon() {
    return [
      { term: 'Esas Faaliyet Nakdi (OCF)', cat: 'Bilanço', street: 'Mahalle fırınının borç almadan, arsa satmadan, sırf ekmek satıp kasasına koyduğu gerçek sıcak para.', pro: 'Pozitif ve Net Kârdan büyükse (OCF > Net Kâr) bilanço kaya gibidir; negatifse şirket nakit yakıyordur.' },
      { term: 'Serbest Nakit Akışı (FCF)', cat: 'Bilanço', street: 'Fırının kasasına giren paradan bozulan fırın küreği ve yeni hamur makinesi masrafı (CAPEX) düşüldükten sonra patronun cebine kalan saf para.', pro: 'FCF = OCF − CAPEX. Temettünün ve borçsuz büyümenin tek gerçek kaynağıdır.' },
      { term: 'CAPEX (Yatırım Harcaması)', cat: 'Bilanço', street: 'Şirketin yeni fabrika, uçak, santral veya makine kurmak için kasadan harcadığı para.', pro: 'OCF / CAPEX oranı > 1,5x olduğunda şirket yatırımlarını kendi iç nakdiyle rahatça fonluyor (hasat dönemi) demektir.' },
      { term: 'TMS-29 Enflasyon Muhasebesi', cat: 'Bilanço', street: 'Bilançodaki fabrika, stok ve borçların enflasyonla güncellenmesi; bazen nakit üretmeyen borçlu şirketi kağıt üstünde kârlı gösterebilir!', pro: 'TMS-29 yanılsamasına düşmemek için mutlaka OCF, Sloan Tahakkuku ve VUK Vergi Beyannamesine bakılır.' },
      { term: 'Sloan Tahakkuk Oranı', cat: 'Adli Denetim', street: 'Açıklanan kârın ne kadarının "veresiye defteri ve muhasebe tahmini", ne kadarının "peşin kasa parası" olduğunu ölçen yalan makinesi.', pro: 'Negatif Sloan (%0 altı) nakit kalitesini; +%15 üzeri ise tahsil edilmemiş kağıt kâr riskini gösterir.' },
      { term: 'VUK Geçici Vergi Beyannamesi', cat: 'Adli Denetim', street: 'Şirketin Maliye vergi dairesine sunduğu, enflasyon muhasebesi makyajı olmayan saf fatura kâr/zarar tablosu.', pro: 'Bilançodan önce KAP’a düşer; gerçek operasyonel ivmeyi en çıplak haliyle gösterir.' },
      { term: 'FAVÖK (EBITDA)', cat: 'Değerleme', street: 'Vergi, kredi faizi ve makine eskimesi (amortisman) düşülmeden önceki saf dükkân işletme kârı.', pro: 'Farklı borç yapısındaki iki fabrikayı yan yana kıyaslamak için kullanılır.' },
      { term: 'FD / FAVÖK (EV/EBITDA)', cat: 'Değerleme', street: 'Bir dükkânı devralırken ödediğin paraya kasadaki borcu da ekleyip "Bu dükkân tüm maliyetini kaç yıllık işletme kârıyla çıkarır?" diye sormak.', pro: 'F/K’dan çok daha dürüsttür çünkü borcu gizlemez! Sanayide 4x–7x arası cazip, 15x+ pahalı bölgedir.' },
      { term: 'F/K (Fiyat / Kazanç)', cat: 'Değerleme', street: 'Şirketin bugünkü fiyatının son 1 yıllık net kârının kaç katı olduğu.', pro: 'Tek başına bakılmaz! Döngüsel şirketlerde (çelik/rafineri) en tepede F/K düşük, en dipte yüksek görünür; GYO’larda ise ekspertiz kârı yüzünden anlamsızdır.' },
      { term: 'PD / DD (Piyasa / Defter Değeri)', cat: 'Değerleme', street: 'Şirketin bütün malını mülkünü satıp borçlarını kapatsan elde kalacak özsermayenin kaç katına borsada satıldığı.', pro: 'Bankalarda (ROE ile birlikte), GYO’larda ve Holdinglerde birincil değerleme terazisidir (<1,0x özkaynağından ucuz demektir).' },
      { term: 'ROIC (Yatırılan Sermaye Getirisi)', cat: 'Değerleme', street: 'Şirketin işe bağladığı her 100 liradan yılda kaç lira gerçek faaliyet kârı ürettiği.', pro: 'ROIC sermaye maliyetinden (WACC / Enflasyon) yüksekse şirket büyüdükçe servet yaratır, düşükse büyüdükçe değer yıkar.' },
      { term: 'Net Borç / FAVÖK', cat: 'Risk', street: 'Şirketin kasadaki hazır parasını düştükten sonra kalan banka borcunu kaç yıllık işletme kârıyla sıfırlayabileceği.', pro: '0’ın altı "Net Nakit Kalesi"dir; 0–2x sağlıklı, 4x üzeri yüksek faiz ortamında tehlike çanıdır!' },
      { term: 'Cari Oran', cat: 'Risk', street: 'Önümüzdeki 1 yıl içinde vadesi gelecek faturaları ve kredileri ödemek için kasada/stokta kaç kat dönen varlık olduğu.', pro: 'Sanayide 1,2x üstü güvenli nefes alanıdır; 0,8x altı kısa vadeli nakit sıkışıklığı (bedelli/yüksek faizli kredi) riskidir.' },
      { term: 'MKK Tipe Dönüşüm & Fiili Dolaşım', cat: 'Takas', street: 'Patronun kasada kilitli duran paylarını borsada küçük yatırımcıya satabilmek için Merkezi Kayıt Kuruluşu’nda "açık paya" çevirmesi.', pro: 'KAP’ta tipe dönüşüm ve MKK lot artışı görülürse tahtada arz baskısı beklenir; pay geri alımı ise tam tersi destektir.' },
      { term: 'CMF-20 (Chaikin Para Akışı)', cat: 'Tahta İzi', street: 'Son 20 günde tahtadaki işlemlerin günün tepesinden mi (iştahlı kurumsal toplama) yoksa dibinden mi (gizli mal yedirme) kapandığının ölçüsü.', pro: '+0,10 ve üzeri kurumsal para girişini, -0,10 ve altı kurumsal mal çıkışını işaret eder.' },
      { term: 'Net Aktif Değer (NAD) İskontosu', cat: 'Değerleme', street: 'İçinde 10 milyon liralık ev ve araba bulunan bir şirketin tamamının borsada 6 milyon liraya (%40 indirimli) satılması.', pro: 'Holding (KCHOL/SAHOL) ve GYO analizinin temelidir.' },
      { term: 'T+2 Takas Kuralı', cat: 'Piyasa Fiziği', street: 'Borsada hisse sattığında paranın çekilebilir nakde dönmesi için 2 iş günü bekleme zorunluluğu.', pro: 'T+2’deki parayla (Brüt Takas yoksa) aynı gün başka hisse alınabilir ama nakit çekilemez, altın/mevduat alınamaz.' },
      { term: 'TEFAS 13:30 Valörü', cat: 'Piyasa Fiziği', street: 'Yatırım fonu alırken veya bozarken saat 13:30 gişe sınırını kaçırırsan işlemin 1–2 iş günü sonraya sarkması.', pro: 'PPF 13:30 öncesi T+0 aynı gün nakittir; Sukuk ve hisse/döviz fonları T+1 / T+2 valörlüdür.' },
      { term: 'VBTS Brüt Takas', cat: 'Piyasa Fiziği', street: 'Aşırı dalgalanan tahtalarda Borsa İstanbul’un koyduğu "Peşin parayla al, aldığını bugün satamazsın, sattığının parasıyla takas dolmadan hisse alamazsın" freni.', pro: 'Kredili işlem ve açığa satış da eşzamanlı kapatılır; spekülatif hacmi soğutur.' },
      { term: 'Stopaj Vergisi', cat: 'Vergi', street: 'Kazandığın faiz, fon kârı veya temettü daha hesabına yatarken kaynağında otomatik kesilen vergi.', pro: 'Kamu Sukuk, DİBS, BIST Hisse ve Hisse Yoğun BYF’de %0; PPF ve Altın/Döviz BYF’de %17,5; Temettüde %15’tir.' },
      { term: 'GVK Mükerrer 80 & Yİ-ÜFE %10', cat: 'Vergi', street: 'ABD hissesi veya Eurobond sattığında devletin "Enflasyon %10’u geçtiyse TL maliyetini üretici enflasyonuyla büyüt, sadece gerçek reel kazancının vergisini öde" dediği kalkan.', pro: 'Alış-satış arası Yİ-ÜFE %10,00 sınırını aşmadan satmamak vergi yükünü dramatik biçimde azaltır.' },
      { term: 'VİOP Basis (Vadeli-Spot Makası)', cat: 'VİOP', street: 'VİOP vadeli endeks kontratının spot endeksten vade sonuna kadarki faiz (TLREF) kadar yukarıda işlem görmesi.', pro: 'Makas teorik TLREF faizinin çok üstüne çıkarsa Spot Al / VİOP Sat arbitrajı doğar; 19:00 akşam seansı sabahın öncüsüdür.' },
      { term: 'Margin Call (Teminat Tamamlama)', cat: 'Risk', street: 'Borçlu/kaldıraçlı işlemde ters hareket olunca aracı kurumun saat 15:00’e kadar "Ya nakit getir ya da pozisyonunu zorla kapatırım!" uyarısı.', pro: 'Özsermaye oranı %35 altına inerse zorunlu tasfiye (likidasyon) gerçekleşir.' },
      { term: 'Crack Spread (Rafineri Marjı)', cat: 'Sektör', street: 'Kasabın canlı hayvanı alıp pirzola olarak sattığında aradaki işleme farkından kazandığı para gibi, TÜPRAŞ’ın 1 varil ham petrolden mazot/jet yakıtı üreterek kazandığı dolar farkı.', pro: 'Rafineri kârını petrolün seviyesi değil, bu marj belirler.' },
      { term: 'CDS (Ülke Risk Primi)', cat: 'Makro', street: 'Yabancı yatırımcının Türkiye’ye borç verirken ödediği kasko sigorta primi.', pro: 'CDS düştükçe (örn. 250 bp altı) Eurobondlar değerlenir, bankalara ve holdinglere yabancı sermaye girer.' },
      { term: '12 Haneli GTİP Verisi', cat: 'Saha Öncüsü', street: 'Gümrük kapısından geçen her bir malın (trafo, kablo, lastik, çimento) geçen ay kaç ton ve kilosu kaç dolardan ihraç edildiğini gösteren resmi gümrük kaydı.', pro: 'TÜİK dış ticaret verisinde bilançodan 45–60 gün önce yayınlanır.' },
      { term: 'Piotroski F-Skoru (0–9)', cat: 'Adli Denetim', street: 'Bir şirketin kârlılık, borç azaltma ve nakit kalitesini 9 ayrı sınavdan geçirip çürük elmaları eleyen puan cetveli.', pro: '7–9 puan finansal gücü hızla iyileşen kaleleri; 0–3 puan ise zayıflayan değer tuzaklarını gösterir.' },
      { term: '340 Alınan Sipariş Avansları', cat: 'Bilanço', street: 'Müşterinin malı daha teslim almadan fabrikanın kasasına peşin yatırdığı kapora parası.', pro: 'Savunma, makine ve GYO bilançolarında bu satır büyüyorsa gelecek çeyreklerin cirosu şimdiden garantilenmiştir!' },
      { term: 'İlişkili Taraf Alacağı', cat: 'Adli Denetim', street: 'Halka açık şirketin kasasındaki parayı faizsiz/ucuza patronun dışarıdaki özel şirketine borç vermesi.', pro: 'Bu kalem özsermayeye oranla şişiyorsa kasadaki nakit ortaklar yerine grup dışına sızıyor demektir — kırmızı bayraktır!' },
      { term: 'CVaR-95 (Kuyruk Riski)', cat: 'Kantitatif Risk', street: '"En kötü %5’lik fırtına aylarında bu varlık ortalama yüzde kaç kaybettirmiş?" sorusunun gerçek tarihsel cevabı.', pro: 'Standart sapmadan çok daha gerçekçidir; uykunu kaçıracak çöküş şiddetini önceden ölçer.' },
      { term: 'Half-Kelly (Yarım Kelly) Ağırlığı', cat: 'Portföy Matematiği', street: 'Kazanma ihtimali ve kazanç/kayıp oranına göre tek bir yatırıma kasanın en fazla yüzde kaçını koyman gerektiğini söyleyen sigorta formülü.', pro: 'Avantaj (Edge) negatifse Kelly %0 verir; en parlak fırsatta bile aşırı yüklenip batmayı matematiksel olarak engeller.' },
      { term: 'Hurst Üssü (H)', cat: 'Kantitatif', street: 'Bir varlığın başladığı yönde akmaya devam eden "inatçı nehir" mi (H > 0,55), yoksa lastik gibi ortalamaya geri dönen "yay" mı (H < 0,45) olduğunu ölçer.', pro: 'H > 0,55 trend takip stratejisine; H < 0,45 ise destekten al / dirençten sat stratejisine uygundur.' }
    ];
  }

  global.RealInvestmentGuide = {
    explainAsset,
    computeDeepForensicXray,
    getQuickForensicScore,
    extractQuantitativePassport,
    getPreTradeMentorCheck,
    computeBreakevenComparison,
    getDailyStreetBriefing,
    getEnrichedLiveNewsFeed,
    getKitchenIntelDesks,
    getLiveWorldChains,
    getMarketSeasonCompass,
    getCardQuickSignal,
    computeRange52W,
    computeBakery100kScale,
    computeFinancial100kScale,
    computeMultiHorizonRealTable,
    evaluatePortfolioDoctor,
    getFieldCaseCatalog,
    getExpertCurriculum,
    getStreetLexicon,
    CRISIS_SCENARIOS,
    simulatePortfolioCrisis
  };
})(typeof window !== 'undefined' ? window : globalThis);
