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
      shortDesc: 'Bireysel Emeklilik Sistemi (2026: 10811 Sayılı Kararla %20 Devlet Katkısı · Yıllık 79.272 ₺ Tavan + BEFAS Fon Seçimi).',
      howItWorks: 'Düzenli tasarrufuna devletin %20 ek katkı yaptığı uzun vadeli emeklilik kabuğudur (1 Ocak 2026 itibarıyla 396.360 ₺ yıllık brüt asgari ücret tavanına kadar maks 79.272 ₺/yıl). Asıl kazancı yılda 12 kez değiştirebileceğin BEFAS fon dağılımı (Altın, Hisse, Borçlanma) belirler.',
      expertEdge: 'BES kendi başına bir getiri değil vergi ve %20 devlet katkısı kabuğudur; standart fonda bırakmak yerine döneme göre BEFAS Altın/Hisse fonlarına dağıtmak ve 10 yıl + 56 yaş (%100 hak ediş + %5 stopaj) hedefine taşımak reel serveti katlar.',
      trapWatch: 'Yıllarca düşük getirili standart fonda unutmak, yıllık 396.360 ₺ katkı tavanını takip etmemek veya ilk 3 yılda çıkıp devlet katkısını (%0 hak ediş) yakmak.',
      rawInputs: ['BEFAS Fon Dağılımı', '2026 %20 Devlet Katkısı (10811 Karar)', 'Altın/Hisse/TLREF Seçimi'],
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
    },
    'tefas-mac': {
      shortDesc: 'Marmara Capital Hisse Senedi Fonu (MAC · Hisse Yoğun · %0 Stopaj). Bilanço ve çarpan disipliniyle seçilmiş konsantre Türk hisse portföyü.',
      howItWorks: 'Portföyünün en az %80’ini devamlı BIST paylarında tuttuğu için "Hisse Senedi Yoğun Fon" statüsündedir; yıllarca taşısan da kârından %0 stopaj kesilir! Saat 13:30 valör kuralıyla T+1 iş gününde alınır, T+2 iş gününde nakde döner.',
      expertEdge: 'Tek tek bilanço takip etmeye vakti olmayan yatırımcı için %0 vergi kalkanıyla aktif değer yatırımı disiplinini birleştirir; KAP’taki aylık "Portföy Dağılım Raporu"ndan hangi hisseleri topladığı şeffafça okunur!',
      trapWatch: 'Hisse yoğun fon olduğu için kural gereği borsa düşerken nakde kaçamaz (%80 hisse zorunluluğu vardır); kısa vadeli al-sat aracı değildir.',
      rawInputs: ['Seçili Değer Hisseleri İskontosu', 'BIST 100 Genel Çarpan Seviyesi', 'Yıllık Yönetim Ücreti'],
      risesWhen: 'Temeli sağlam iskontolu sanayi ve hizmet şirketleri gerçek değerine yürüdüğünde.',
      fallsWhen: 'Borsa İstanbul genelinde sert sistemik satış yaşandığında.',
      relatedKeys: ['tefas-iih', 'fon-yerli-hisse-zpbdl', 'bist-100']
    },
    'tefas-iih': {
      shortDesc: 'İstanbul Portföy Üçüncü Hisse Senedi Fonu (IIH · Hisse Yoğun · %0 Stopaj). Yüksek alfa ve katalizör odaklı aktif BIST hisse fonu.',
      howItWorks: 'BIST 100 endeksini yenmeyi hedefleyen aktif hisse seçim stratejisi uygular. Hisse yoğun şemsiyesi sayesinde kazanç üzerinden kesilen stopaj %0’dır; 13:30 öncesi emirlerde T+1 alım, T+2 satış valörü işler.',
      expertEdge: 'Aylık KAP Portföy Dağılım Raporunda fonun sektör ağırlık değişimlerini (banka, havacılık, perakende rotasyonu) okumak kurumsal aklın nereye kaydığını gösterir.',
      trapWatch: '13:30 valör saatinden sonra verilen emir 2 iş günü sonraki fiyattan eşleşir; panik gününde fon bozulmaz.',
      rawInputs: ['BIST Sektör Rotasyonu', 'Yabancı Kurumsal Akış', 'Şirket Bilanço Katalizörleri'],
      risesWhen: 'BIST’te bilanço ve faiz indirim döngüsü başladığında.',
      fallsWhen: 'Yüksek faiz ve likidite daralması borsayı baskıladığında.',
      relatedKeys: ['tefas-mac', 'tefas-ti2', 'bist-30']
    },
    'tefas-ti2': {
      shortDesc: 'İş Portföy İş’te Kadın Hisse Senedi Fonu (TI2 · Hisse Yoğun · %0 Stopaj). Yönetiminde ve istihdamında kadın liderliği güçlü kurumsal BIST şirketleri fonu.',
      howItWorks: 'Kurumsal yönetişimi güçlü büyük ve orta ölçekli BIST şirketlerine yatırım yapar; Hisse Yoğun Fon olduğu için satış kârından %0 stopaj kesilir (T+1 alım / T+2 satış valörü).',
      expertEdge: 'Kurumsal yönetişim kalitesi yüksek şirketler ilişkili taraf sızıntısı ve patron tuzaklarına çok daha az yakalanır.',
      trapWatch: '%80+ hisse taşıma zorunluluğu nedeniyle genel borsa düzeltmelerinden etkilenir.',
      rawInputs: ['BIST Kurumsal Şirket Kârları', 'Yabancı ESG Fon Girişleri'],
      risesWhen: 'Mavi çip (blue-chip) BIST devlerine kurumsal para girdiğinde.',
      fallsWhen: 'Genel endeks satışlarında.',
      relatedKeys: ['tefas-mac', 'fon-tematik-surdurulebilirlik-zsr25', 'bist-kchol']
    },
    'tefas-aft': {
      shortDesc: 'Ak Portföy Yeni Teknolojiler Yabancı Hisse Fonu (AFT · %17,5 Stopaj · T+1/T+3 Valör). Apple, Nvidia, Microsoft ve küresel teknoloji devlerine TL ile yatırım.',
      howItWorks: 'Küresel teknoloji devlerinden oluşan sepeti TL ile kolayca almanı sağlar, beyanname uğraşı yoktur. ANCAK çok kritik vergi farkı vardır: Satarken Dolar/TL kur artışından kaynaklanan TL farkı dahil tüm kârdan kaynağında %17,5 stopaj kesilir ve bozum parası T+3 iş gününde yatar!',
      expertEdge: 'Uzman Hesabı: Küçük tutarda ve beyanname sınırıyla uğraşmak istemeyen için AFT pratiktir; ancak büyük tutarda ve Yİ-ÜFE üretici enflasyonu >= %10 iken doğrudan QQQ ETF almak, kur/enflasyon farkını vergiden düştüğü için net getiride AFT’yi geçebilir!',
      trapWatch: 'Hem %17,5 kur+kâr stopajını hem de satışta T+3 iş günü (13:30 sonrası T+4!) nakit bekleme süresini hesaba katmamak.',
      rawInputs: ['Nasdaq Teknoloji Devleri ($)', 'USD/TRY Kuru', '%17,5 Stopaj & Yıllık %2,9 Yönetim Ücreti'],
      risesWhen: 'Küresel yapay zeka/teknoloji hisseleri ve Dolar/TL birlikte yükseldiğinde.',
      fallsWhen: 'ABD teknoloji çarpanları daraldığında veya TL reel olarak değerlendiğinde.',
      relatedKeys: ['abd-nasdaq-qqq', 'tefas-afa', 'kuresel-hisse-nvda']
    },
    'tefas-afa': {
      shortDesc: 'Ak Portföy Amerika Yabancı Hisse Senedi Fonu (AFA · %17,5 Stopaj · T+1/T+3 Valör). ABD S&P 500 devlerine tek tıkla TL üzerinden ortaklık.',
      howItWorks: 'ABD ekonomisinin en büyük şirketlerine yatırım yapar; beyanname gerektirmez fakat satış anında TL bazlı toplam kazanç üzerinden %17,5 stopaj kesilir ve bozum valörü T+3 iş günüdür.',
      expertEdge: 'Doğrudan S&P 500 (SPY) ETF’sindeki GVK Mükerrer 80 Yİ-ÜFE %10 endeksleme kalkanı ile AFA’nın %17,5 otomatik stopajı arasındaki net vergi farkını vade ve enflasyona göre kıyasla!',
      trapWatch: 'Acil nakit lazım olduğunda ABD tatili + T+3 TEFAS valörü yüzünden paranın 4–5 gün sonra hesaba geçmesi.',
      rawInputs: ['ABD S&P 500 Endeksi ($)', 'USD/TRY Kuru', '%17,5 Kaynakta Stopaj'],
      risesWhen: 'ABD şirket kârları büyürken Dolar/TL yükseldiğinde.',
      fallsWhen: 'Fed şahinleşip küresel borsalar düzeltmeye girdiğinde.',
      relatedKeys: ['abd-sp500-spy', 'tefas-aft', 'dunya-borsalari-vt']
    },
    'tefas-ipb': {
      shortDesc: 'İstanbul Portföy Birinci Değişken Fon (IPB · %17,5 Stopaj · T+1/T+2 Valör). Piyasa mevsimine göre hisse, altın, döviz ve VİOP ağırlığını değiştiren esnek fon.',
      howItWorks: 'Hisse yoğun fonların aksine %80 hisse taşıma mecburiyeti yoktur! Fon yöneticisi fırtına gördüğünde hisse azaltıp altın, döviz veya sabit getiriye geçebilir; karşılığında kârdan %17,5 stopaj kesilir.',
      expertEdge: 'Piyasa yönü belirsizken aktif koruma arayan yatırımcılar için tasarlanmıştır; başarısı tamamen fon yönetiminin zamanlama isabetine bağlıdır.',
      trapWatch: 'Ralli dönemlerinde saf hisse yoğun fonların (%0 stopajlı MAC/IIH) gerisinde kalabilmesi ve %17,5 stopaj kesintisi.',
      rawInputs: ['Aktif Varlık Dağılımı (BIST / Altın / Döviz / VİOP)', '%17,5 Stopaj'],
      risesWhen: 'Fon yönetimi makro dönüşleri doğru yakaladığında.',
      fallsWhen: 'Ters pozisyonda veya ani piyasa dönüşlerinde.',
      relatedKeys: ['tefas-mac', 'kira-sertifikasi-sukuk', 'gram-altin-spot']
    },
    'tefas-kzl': {
      shortDesc: 'Kuveyt Türk Portföy Altın Katılım Fonu (KZL · %17,5 Stopaj · T+1/T+1 Valör). Banka saklamalı, faizsiz altın katılım fonu.',
      howItWorks: 'Evde çalınma riski veya gece banka makası olmadan altın fiyatına ortak eder; ancak satış kârından %17,5 stopaj kesilir ve 13:30 valörüyle T+1 iş gününde nakde döner.',
      expertEdge: 'Uzman Kıyaslaması: Gündüz Kapalıçarşı fiziki altın (%0,40 makas, %0 stopaj) veya makası düşükken ALTIN.S1 (%0 stopaj), uzun vadede %17,5 stopaj kesen altın fonundan çok daha fazla net para bırakır!',
      trapWatch: 'Altın %50 yükseldiğinde kazancın %17,5’ini stopaj vergisi olarak masada bırakmak.',
      rawInputs: ['Ons Altın ($)', 'USD/TRY Kuru', '%17,5 Stopaj Kesintisi'],
      risesWhen: 'Ons altın ve Dolar/TL yükseldiğinde.',
      fallsWhen: 'Küresel reel faizler artıp altın gerilediğinde.',
      relatedKeys: ['gram-altin-spot', 'altin-sertifikasi', 'altin-fonu-zgold']
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
    return a.subVenue === 'PHYSICAL_METAL' || a.subVenue === 'DARPHANE_S1' || id === 'fon-degisken-isglk' || id === 'tefas-kzl' || id.includes('altin') || id.includes('gumus') || id.includes('platin') || id.includes('paladyum');
  }

  function isFxLinkedShieldAsset(a) {
    if (!a) return false;
    const id = String(a.id || '');
    return id.startsWith('doviz-') || id === 'eurobond-usdtr' || id === 'eurobond-emb' || id === 'tefas-aft' || id === 'tefas-afa' || a.isForeignUsd || isPreciousMetalAsset(a);
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
  // 13. 24 İNTERAKTİF GERÇEK SAHA VAKASI (4 ŞIKLI · A/B/C/D DENGELİ · TANI AÇIKLAMALI)
  // --------------------------------------------------------------------------
  function getFieldCaseCatalog() {
    const K = global.AetherKernelV10;
    const dInfo = K?.getDarphanePremiumInfo ? K.getDarphanePremiumInfo() : { spotGramPrice: 6058, s1GramEquiv: 6917, premiumPct: 14.1, diffTL: 859 };
    const be32 = computeBreakevenComparison(100000, 32) || { usdNow: 50.44, breakevenUsdBazaar: 52.25, sukuk: { netGainTL: 3190, annualGross: 36.5 } };

    return [
      {
        id: 'case_01_kap_mkk_trap',
        category: 'KAP & MKK Takas',
        difficulty: 'Uzman',
        title: 'Vaka 1: Gece 21:30’da Düşen "Dev Sipariş" Haberi ve MKK Patron İzi',
        situation: 'Gece 21:30’da sığ bir teknoloji hissesi KAP’a "Şirketimiz 28 Milyon $ yeni iş sözleşmesi imzaladı!" bildirimi attı. Sosyal medya "Sabah tavan!" diye coşuyor. Ancak AETHER Mutfak Radarına baktığında 3 gün önce ortakların MKK’da 35 milyon kapalı lotu borsada satılabilir tipe dönüştürdüğünü ve 20 günlük CMF para akışının -0,24 (kurumsal çıkış) olduğunu görüyorsun.',
        question: 'Sabah 09:55 açılış eşleşmesinde 200.000 ₺ nakdinle en doğru hamle nedir?',
        choices: [
          { id: 'A', label: '09:45’te tavandan serbest fiyatlı alım yazarım; KAP ihale haberi gelen tahta ilk gün kesin tavan kilitler.', isOptimal: false, why: 'MKK’dan dönüşen 35 milyon lot tam olarak sabah açılış eşleşmesinde senin gibi alıcı beklemektedir; tavan çözülürse aynı gün -%18 marj yersin.' },
          { id: 'B', label: '09:52’de alış yazar, tavan bozulacak gibi olursa 09:54’te emrimi iptal ederim.', isOptimal: false, why: 'Borsa İstanbul kural hatası! Saat 09:50:00’den 09:55 eşleşmesine kadar emir iptali ve azaltımı kilitlenir; 09:54’te iptal tuşu çalışmaz!' },
          { id: 'C', label: 'Tahtadan uzak dururum; MKK tipe dönüşüm + negatif CMF varken atılan parlak haber, ortak satışı için alıcı toplama likiditesi olabilir.', isOptimal: true, why: 'Doğru teşhis! Arka kapıdan (MKK) mal kamyonu yanaşmışken ön vitrindeki parlak haber kalabalığa likidite yaratmak için kullanılabilir.' },
          { id: 'D', label: 'Kredili (margin) alım açıp açılışta %3 kâr görünce hemen satarım.', isOptimal: false, why: 'Sığ tahtada patron satışı başladığında kademeler boşalır; kredili pozisyon hem komisyon/faiz yakar hem de tabana kilitlenirse çıkamazsın.' }
        ],
        consequence100k: 'Sabah 09:55 eşleşmesinde tavandan atlayan 100.000 ₺, öğleden sonra MKK’dan dönüşen lotların tahtaya basılmasıyla günü tabanda kapattı ve 5 iş gününde 74.200 ₺’ye eridi.',
        proRule: 'Uzman Kuralı: KAP haberini tek başına okuma! 1) MKK Fiili Dolaşım Lot Değişimine, 2) CMF-20 Kurumsal Para Akışına, 3) 09:50 emir iptal kilidine bakmadan açılışa girilmez.',
        linkedKeys: ['reel-yazilim-miatk', 'bist-asels', 'reel-yazilim-logo']
      },
      {
        id: 'case_02_gold_three_doors',
        category: 'Makas & Vergi Arbitrajı',
        difficulty: 'Temel',
        title: 'Vaka 2: Aynı Altının Dört Kapısı — Hava Parası mı, %17,5 Stopaj mı, Saf Gram mı?',
        situation: `Çarşamba öğlen saat 14:00, piyasalar açık. 300.000 ₺ ile altın biriktireceksin. Kapalıçarşı fiziki gram altın ${Math.round(dInfo.spotGramPrice).toLocaleString('tr-TR')} ₺ (%0,40 makas, %0 vergi), borsadaki ALTIN.S1 sertifikasının gram karşılığı ${Math.round(dInfo.s1GramEquiv).toLocaleString('tr-TR')} ₺ (+%${dInfo.premiumPct} prim, %0 vergi), altın fonu (ZGOLD/KZL) ise kârdan %17,5 stopaj kesiyor.`,
        question: 'Gündüz mesai saatinde 300.000 ₺ ile en çok saf altını ve en yüksek vergi sonrası net parayı hangi kapı bırakır?',
        choices: [
          { id: 'A', label: 'Gündüz açıkken Kapalıçarşı dar makasından (%0,40) fiziki gram altın alırım (%0 stopaj, %0 BSMV, sıfır hava parası).', isOptimal: true, why: 'En temiz matematik! Hem +%14 hava parasından hem %17,5 fon stopajından hem de %0,2 banka kambiyo vergisinden kurtulursun.' },
          { id: 'B', label: 'Borsadan ALTIN.S1 sertifikası alırım; komisyonu onbinde 8 ve stopajı %0 olduğu için en ucuzudur.', isOptimal: false, why: `Stopaj %0 olsa da ALTIN.S1 şu an fiziki altından +%${dInfo.premiumPct} pahalı! Baştan fazladan hava parası ödersin; prim daraldığında altın düşmese bile zarar yazarsın.` },
          { id: 'C', label: 'Altın fonu (ZGOLD veya KZL) alırım; makas derdi yoktur ve kârın tamamı cebime kalır.', isOptimal: false, why: 'Altın fonlarında (BYF ve TEFAS katılım/altın fonları) satış anında toplam TL kâr üzerinden %17,5 stopaj kesilir!' },
          { id: 'D', label: 'Akşam 20:00’de evden mobil bankadan gram altın alırım.', isOptimal: false, why: 'Akşam 18:00 sonrasında bankalar makası %3,5–%4,5 seviyesine açar ve üstüne binde 2 (%0,20) BSMV kambiyo vergisi keser.' }
        ],
        consequence100k: `100.000 ₺ ile yüksek primli ALTIN.S1 alan kişi baştan ~${Math.round(100000 * (dInfo.premiumPct / (100 + dInfo.premiumPct))).toLocaleString('tr-TR')} ₺ hava parası ödedi; altın fonu alan ise %50 yükselişte 8.750 ₺ stopaj vergisi bıraktı!`,
        proRule: 'Uzman Kuralı: ALTIN.S1 primi +%3,5 altındaysa sertifika caziptir; prim +%10 üstündeyse Kapalıçarşı fiziki altın rakipsizdir (hatta eldeki S1 satılıp fizikiye geçilerek gramaj artırılır).',
        linkedKeys: ['gram-altin-spot', 'altin-sertifikasi', 'tefas-kzl']
      },
      {
        id: 'case_03_tms29_illusion',
        category: 'Bilanço & TMS-29',
        difficulty: 'Orta',
        title: 'Vaka 3: "F/K 4x Bedava!" Denilen Şirket mi, Kağıt Kârı Düşük Nakit Makinesi mi?',
        situation: 'İki sanayi şirketini inceliyorsun: X Şirketi manşette +1,4 Milyar ₺ Net Kâr açıkladı (F/K 4,2x görünüyor) ama Nakit Akış Tablosunda Esas Faaliyet Nakdi (OCF) -1,9 Milyar ₺ ekside! Y Şirketi ise TMS-29 yüksek amortismanı yüzünden manşette sadece +18 Milyar ₺ kâr gösterdi (F/K 14x) ama kasasına +128 Milyar ₺ gerçek sıcak faaliyet nakdi (OCF) koydu.',
        question: 'Mahalle fırını ve adli muhasebe gözüyle hangisi gerçek servet üretir?',
        choices: [
          { id: 'A', label: 'X Şirketini alırım; borsa ekranlarında herkes F/K’ya bakar, 4,2x F/K 14x’ten üç kat ucuzdur.', isOptimal: false, why: 'X’in net kârı borçlarının TMS-29 parasal pozisyon kazancından gelmektedir; kasada ekmek parası yok, aksine 1,9 Milyar ₺ nakit yanmıştır!' },
          { id: 'B', label: 'İkisine de girmem; F/K yüksekse pahalıdır, OCF negatifse geçicidir.', isOptimal: false, why: 'Y Şirketinin F/K’sını yüksek gösteren şey nakit çıkışı olmayan TMS-29 fabrika amortismanıdır; böyle gizli nakit kalelerini kaçırmak büyük fırsat maliyetidir.' },
          { id: 'C', label: 'X Şirketine %70, Y Şirketine %30 yatırırım ki ucuz F/K ağırlıklı olsun.', isOptimal: false, why: 'Nakit yakan (Sloan tahakkuku şişik) şirkete ağırlık vermek portföyü yüksek faizli borç duvarına çarptırır.' },
          { id: 'D', label: 'Y Şirketine ortak olurum; Net Kâr muhasebe görüşüdür, kasaya giren +128 Milyar ₺ OCF ve Serbest Nakit Akışı (FCF) ise su götürmez gerçektir!', isOptimal: true, why: 'Tam isabet! TMS-29 amortismanı yüzünden kağıt kârı baskılanan ama kasası oluk oluk nakit dolan şirketler kurumsal yatırımcının en sevdiği avdır.' }
        ],
        consequence100k: 'X Şirketi 2 çeyrek sonra kasa nakdi bittiği için %48 faizle kredi çekip bedelli sermaye artırımına gitti; Y Şirketi ise kasadaki nakitle temettü dağıtıp borcunu sıfırladı.',
        proRule: 'Uzman Kuralı: Bilançoda ilk bakılacak satır Net Kâr değil, "İşletme Faaliyetlerinden Nakit Akışları (OCF)" ve "OCF / Net Kâr (>1,0x)" oranıdır.',
        linkedKeys: ['bist-tcell', 'bist-enkai', 'bist-bimas']
      },
      {
        id: 'case_04_usd_breakeven',
        category: 'Faiz-Kur Matematiği',
        difficulty: 'Temel',
        title: 'Vaka 4: "Ay Sonu Dolar 51,50 ₺ Olacak!" Diyen Komşu vs Başabaş Terazisi',
        situation: `Dolar şu an ${be32.usdNow} ₺. Komşun "Kesin duyum aldım, 32 gün sonra Dolar 51,50 ₺ olacak!" diyerek tüm parasını dolara çevirdi. Oysa TEFAS’ta %0 stopajlı Kamu Kira Sertifikası (Sukuk) 32 günde 100.000 ₺’ye net +${be32.sukuk.netGainTL.toLocaleString('tr-TR')} ₺ veriyor ve Dolar başabaş kuru ${be32.breakevenUsdBazaar} ₺ çıkıyor.`,
        question: '32 gün sonra komşunun tahmini birebir tutar ve Dolar tam 51,50 ₺ olursa kim kazanır?',
        choices: [
          { id: 'A', label: 'Tahmini tuttuğu için Dolar alan komşu daha çok kazanır.', isOptimal: false, why: 'Nominal olarak dolar artsa da %2,1’lik kur artışı (üstelik alış-satış makası düşülünce ~%1,7), Sukuk’un ~%3,2 net getirisinin altında kalmıştır!' },
          { id: 'B', label: `%0 vergili Sukuk alan kazanır! Dolar ${be32.breakevenUsdBazaar} ₺ başabaş eşiğini aşamadığı için kur tahmini doğru çıkan komşu bile dolar bazında zarar etmiştir.`, isOptimal: true, why: 'Kusursuz terazi hesabı! Sukuk vade sonunda bozulduğunda komşudan daha fazla Dolar satın alabilmektedir.' },
          { id: 'C', label: 'Mobil bankadan gece dolar alan en yüksek kârı yazar.', isOptimal: false, why: 'Gece mobil banka %3,6 makas + %0,2 BSMV kestiği için 51,50 ₺ kurda anaparadan bile içeride kalır!' },
          { id: 'D', label: 'Vadesiz TL’de bekleyen risk almadığı için en kârlıdır.', isOptimal: false, why: 'Vadesiz TL hem kura hem enflasyona hem de alternatif Sukuk getirisine karşı %100 erir.' }
        ],
        consequence100k: `32. günde komşunun 100.000 ₺’si makas sonrası ~101.700 ₺ olurken, %0 stopajlı Sukuk ${100000 + be32.sukuk.netGainTL} ₺ oldu!`,
        proRule: 'Uzman Kuralı: Döviz almadan önce daima "Başabaş Kur = Bugünkü Kur × (1 + Net TL Getirisi) × (1 + Makas)" hesabını yap.',
        linkedKeys: ['kira-sertifikasi-sukuk', 'doviz-usd', 'para-piyasasi-fonu']
      },
      {
        id: 'case_05_oil_strait_domino',
        category: 'Makro Domino',
        difficulty: 'Orta',
        title: 'Vaka 5: Boğazda Tanker Krizi — Brent Petrol Bir Gecede 84 $’dan 106 $’a Fırladı!',
        situation: 'Sabah uyandığında Hürmüz Boğazı’nda sevkiyat krizi çıktığını ve ham petrolün +%26 fırladığını gördün. Portföyünde THYAO (havayolu), çimento hissesi ve boş nakit var.',
        question: 'Girdi-çıktı maliyet zincirine göre bu şok sektörlere hangi sırayla vurur?',
        choices: [
          { id: 'A', label: 'Petrol artışı enflasyon yaratacağı için havayolu ve çimento kar marjları anında genişler.', isOptimal: false, why: 'Tam tersi! Havayolunun en büyük gideri jet yakıtı, çimentonun en büyük gideri enerji/petrokoktur; girdi maliyeti bir gecede patlar.' },
          { id: 'B', label: 'Sadece uzun vadeli sabit kuponlu TL tahviller (DİBS) yükselir.', isOptimal: false, why: 'Petrol şoku Türkiye’de akaryakıt enflasyonunu ve faiz beklentisini yukarı iter; sabit tahvil fiyatları baskılanır.' },
          { id: 'C', label: 'Jet yakıtı/enerji gideri patlayan havayolu ve ağır sanayi baskılanır; dizel/jet işleme marjı (Crack Spread) açılan rafineri (TUPRS), petrol fonu (BNO) ve fiziki altın doğal sigorta olur.', isOptimal: true, why: 'Sokak zekâsı domino okuması! Aynı şokta kimin faturası kabarıyor, kimin işleme makası açılıyor şıp diye ayırdın.' },
          { id: 'D', label: 'Elimdeki tüm varlıkları sabah 09:55’te tabandan satıp tamamen nakde geçerim.', isOptimal: false, why: 'Panik açılışında tabandan mal satmak en pahalı hatadır; doğru olan önceden karşı-denge (hedge) ayağı taşımaktır.' }
        ],
        consequence100k: 'Portföyünde THYAO’nun yanında %20 TUPRS ve Fiziki Altın tutan yatırımcı şoku neredeyse sıfır hasarla atlatırken, tek sektör taşıyan sarsıldı.',
        proRule: 'Uzman Kuralı: Portföyde "Aynı şokta biri maliyet yerken diğeri marj büyüten" doğal denge çiftleri (Havayolu + Rafineri/Altın gibi) bulundur.',
        linkedKeys: ['bist-tuprs', 'emtia-petrol-bno', 'bist-thyao', 'gram-altin-spot']
      },
      {
        id: 'case_06_value_trap_vs_gem',
        category: 'Değer Tuzağı Testi',
        difficulty: 'Orta',
        title: 'Vaka 6: Zirvesinden %65 Düşmüş İki Hisse — Hangisi Hazine, Hangisi Dipsiz Kuyu?',
        situation: 'İki BIST şirketi de geçen yılki zirvesinden %65 düşmüş. K Şirketi: PD/DD 0,58x, OCF pozitif (+2,4 Milyar ₺), Net Nakit kasalı ve son 20 günde CMF +0,17. L Şirketi: Zirveden %72 düşmüş, Net Borç/FAVÖK 9,8x, Cari Oran 0,64, OCF negatif ve CMF -0,26.',
        question: 'Yangın yerinde servet kurmak isteyen yatırımcı nasıl hareket eder?',
        choices: [
          { id: 'A', label: 'Yalnızca K Şirketini 3 parçalı kademeyle toplarım; L Şirketi %72 düştükten sonra bir %60 daha eriyebilen klasik "Değer Tuzağı"dır!', isOptimal: true, why: 'Doğru! K’da kasa sağlam ve kurumsal emilim (CMF+) başlamış; L’de ise borç sarmalı özsermayeyi kemiriyor.' },
          { id: 'B', label: 'L Şirketini alırım; %72 düşmüş mal %65 düşenden daha ucuzdur ve daha sert tepki verir.', isOptimal: false, why: 'Borsanın en ölümcül yanılgısı! %80 düşmüş hisse %90 düşüşe indiğinde yatırdığın paranın TAM YARISINI (-%50) daha siler.' },
          { id: 'C', label: 'İkisini eşit bölerim ki hangisi dönerse yakalayayım.', isOptimal: false, why: 'Çürük bilançoyu sağlam kaleyle karıştırmak bileşik getiriyi zehirler.' },
          { id: 'D', label: 'Hisse zirvesini yukarı kırana kadar bekler, +%180 çıktıktan sonra alırım.', isOptimal: false, why: 'Güvenlik marjını (0,58x PD/DD iskontosunu) tamamen masada bırakmış olursun.' }
        ],
        consequence100k: 'Sağlam kasalı K Hissesi döngü döndüğünde 2,4 katına çıkarken, borçlu L Hissesi %150 bedelli açıklayıp reel olarak erimeye devam etti.',
        proRule: 'Uzman Kuralı: Yangın yerinde mal toplamanın 3 filtresi: 1) OCF > 0, 2) Çevrilebilir Borç (Cari Oran > 1,1 / Net Nakit), 3) CMF > 0 kurumsal toplama.',
        linkedKeys: ['bist-enkai', 'bist-sise', 'bist-hekts']
      },
      {
        id: 'case_07_t2_settlement_trap',
        category: 'Türkiye Piyasa Fiziği',
        difficulty: 'Temel',
        title: 'Vaka 7: Çarşamba Satılan Hissenin Perşembe Tapu / Kuyumcu Sürprizi (T+2)',
        situation: 'Perşembe saat 11:00’de Kapalıçarşı’dan fiziki altın almak veya tapu harcı ödemek için 400.000 ₺ nakde ihtiyacın var. Çarşamba saat 14:30’da Borsa İstanbul’daki 400.000 ₺’lik hisseni sattın ve emir anında eşleşti.',
        question: 'Perşembe sabahı saat 11:00’de bu 400.000 ₺ ile ne yapabilirsin?',
        choices: [
          { id: 'A', label: 'Hisse satıldığı an para vadesiz banka hesabıma geçer; Perşembe sabahı kuyumcudan altınımı alırım.', isOptimal: false, why: 'Yanlış! Borsa İstanbul’da Takasbank nakit takası T+2 iş günüdür; Çarşamba satılan payın nakdi Cuma sabahından önce çekilemez.' },
          { id: 'B', label: 'Aynı gün akşam 18:10 kapanış seansı bitince para çekilebilir olur.', isOptimal: false, why: '18:10 sadece seans kapanışıdır; T+1 Perşembe, T+2 Cuma günüdür.' },
          { id: 'C', label: 'T+2 dolana kadar bu parayla Borsa İstanbul’da başka hiçbir hisse de alamam.', isOptimal: false, why: 'Eğer alacağın hissede VBTS Brüt Takas tedbiri YOKSA, T+2 takasta bekleyen satış tutarıyla aynı saniyede başka BIST hissesi alabilirsin!' },
          { id: 'D', label: 'Bu tutarla Brüt Takas olmayan başka BIST hissesi alabilirim ama Cuma sabahından önce nakit çekemem, mevduata veya fiziki altına dönemem!', isOptimal: true, why: 'Borsa İstanbul Takasbank fiziğini kuruşu kuruşuna biliyorsun! Cuma satılan hissenin nakdi ise hafta sonu yüzünden Salı günü çekilir.' }
        ],
        consequence100k: 'T+2 takasını unutarak Çarşamba satış yapan kişi Perşembe tapuda nakitsiz kaldı; aracı kurum T+0 erken nakit avansı için 2 günlük ağır faiz kesti.',
        proRule: 'Uzman Kuralı: Nakit çekimi planlıyorsan BIST satışını en az 2 tam iş günü (araya resmi tatil/bayram giriyorsa tatil öncesi!) yapmalısın.',
        linkedKeys: ['bist-thyao', 'para-piyasasi-fonu', 'gram-altin-spot']
      },
      {
        id: 'case_08_margin_sleep_killer',
        category: 'Risk & Kaldıraç',
        difficulty: 'Orta',
        title: 'Vaka 8: %50 Kredili (Margin) Pozisyonda İki Taban ve Saat 15:00 Duvarı',
        situation: '1.000.000 ₺ özsermayenin üstüne 500.000 ₺ aracı kurum kredisi (yıllık ~%52 faiz) çekerek 1.500.000 ₺’lik tek hisseye girdin. Beklenmedik bir regülasyon haberiyle hisse iki günde toplam -%24 düştü ve özsermaye teminat oranın %33’e geriledi.',
        question: 'Gerçek bir Türk aracı kurumunda o gün saat 15:00’te ne yaşanır?',
        choices: [
          { id: 'A', label: '"Ben uzun vadeciyim, satmadığım sürece zararda sayılmam" deyip ekranı kapatırım.', isOptimal: false, why: 'Özsermayenle alsaydın bekleyebilirdin; ama krediyle aldığın malda teminat %35 altına inince karar hakkı senden çıkar!' },
          { id: 'B', label: 'Saat 15:00 Margin Call sınırına kadar dışarıdan nakit eklemezsen, aracı kurum risk birimi hisselerini en dip fiyattan zorla satar!', isOptimal: true, why: 'Acı gerçek! Kaldıraçlı yatırımcı piyasa sonradan toparlasa bile o toparlanmayı göremeden en dipte tasfiye edilir.' },
          { id: 'C', label: 'Hisse düşüşte olduğu günlerde aracı kurum kredi faizi işletmeyi durdurur.', isOptimal: false, why: 'Aracı kurum kredi faizi hafta sonu ve tatil günleri dahil her takvim günü acımasızca işler.' },
          { id: 'D', label: 'Teminat açığını kapatmak için VBTS Brüt Takaslı başka bir hisseye geçerim.', isOptimal: false, why: 'VBTS Brüt Takaslı hisselerin kredi teminat katsayısı %0’dır; teminat açığını kapatmak yerine daha da büyütür!' }
        ],
        consequence100k: '1.000.000 ₺ özsermayesiyle kredisiz alan kişi -%24 düşüşten 3 ay sonra kârla çıkarken, kredili giren kişi 640.000 ₺’ye erimiş halde dipte zorla satıldı.',
        proRule: 'Uzman Kuralı: Türkiye’de %50+ faiz ortamında kredili hisse taşımak, akıntıya karşı taş bağlayıp yüzmektir; kaldıracı sıfır tutan fırtınanın efendisi olur.',
        linkedKeys: ['viop-bist30-kontrat', 'bist-sasa', 'para-piyasasi-fonu']
      },
      {
        id: 'case_09_ipo_allocation_math',
        category: 'SPK Halka Arz & Lock-Up',
        difficulty: 'Temel',
        title: 'Vaka 9: Eşit Dağıtım Halka Arza 500.000 ₺ Bloke Etmek ve 180. Gün Lock-Up',
        situation: 'SPK bülteninde onaylanan "Tamamı Eşit Dağıtımlı" 20 milyon lotluk (hisse 30 ₺) halka arza 600.000 katılımcı bekleniyor. Arkadaşın "Çok lot gelsin diye 500.000 ₺ nakit bağladım!" diyor. Ayrıca 6 ay önce halka arz olan başka bir hissenin yarın 180 günlük "Ortak Satmama Taahhüdü (Lock-Up)" doluyor.',
        question: 'Sermaye verimliliği açısından doğru hesap nedir?',
        choices: [
          { id: 'A', label: 'Eşit dağıtımda 500B ₺ de bağlasan kişi başı ~34 lot (~1.020 ₺) düşer; ~2.000 ₺ talep yeterlidir, kalan 498.000 ₺’yi PPF/Sukuk’ta çalıştırırım ve 180. gün Lock-Up biten hissede ortak arzına dikkat ederim!', isOptimal: true, why: 'Kusursuz fırsat maliyeti hesabı! Boşuna bloke edilen 498.000 ₺’nin 4 günlük faizini yakmaz, üstelik Lock-Up takvimini izlersin.' },
          { id: 'B', label: 'Ne kadar çok para yatırırsan eşit dağıtımda da o kadar çok lot alırsın; 500.000 ₺ yatırmak doğrudur.', isOptimal: false, why: 'Tamamı eşit dağıtımda tavan lot sınırı herkese eşittir; fazla yatırılan para 3–4 gün sıfır getiriyle kilitli bekler.' },
          { id: 'C', label: 'Halka arzdan gelen gelirin %100’ü patronun cebine gidiyor olsa bile ilk 10 gün kesin tavan gider.', isOptimal: false, why: 'Ortak satışı ağırlıklı ve pahalı çarpanlı halka arzlar daha ilk günden arz fiyatının altına sarkabilmektedir!' },
          { id: 'D', label: '180 günlük Lock-Up süresi dolduğunda hisse fiyatı otomatik ikiye katlanır.', isOptimal: false, why: 'Tam tersi: Lock-Up bitişi, şirket ortaklarının kapalı paylarını borsada satabilme kilidinin açıldığı tarihtir.' }
        ],
        consequence100k: '500.000 ₺’yi 4 gün boşuna bloke eden kişi 1.020 ₺’lik lot için ~2.150 ₺ gecelik nema/PPF getirisini çöpe attı; daha maça eksi yazarak başladı!',
        proRule: 'Uzman Kuralı: Halka arzda 1) Fon Kullanım Yeri Raporuna (yeni yatırım mı, borç/ortak satışı mı?), 2) Kişi başı tahmini lot tutarına, 3) 180 gün Lock-Up sayacına bakılır.',
        linkedKeys: ['para-piyasasi-fonu', 'kira-sertifikasi-sukuk', 'bist-tabgd']
      },
      {
        id: 'case_10_capital_increase_types',
        category: 'Sermaye Yapısı',
        difficulty: 'Orta',
        title: 'Vaka 10: %400 Bedelsiz Coşkusu vs Bedelli vs Patron Geri Alımı',
        situation: 'Aynı akşam üç KAP bildirimi düştü: 1) M Şirketi "%400 İç Kaynaklardan Bedelsiz Sermaye Artırımı" açıkladı. 2) N Şirketi kısa vadeli banka borcunu ödemek için "%200 Bedelli" açıkladı. 3) P Şirketi ise kendi serbest nakdiyle borsadan paylarının %5’ini geri alıp iptal edeceğini duyurdu.',
        question: 'Finans bilimine göre hangisi ortak başına düşen gerçek şirket değerini artırır?',
        choices: [
          { id: 'A', label: 'M Şirketinin %400 Bedelsizi! Elimdeki 100 lot bedavadan 500 lot olacağı için servetim 5 katına çıkar.', isOptimal: false, why: 'Bedelsiz bölünme sabahı lot sayın 5 katına çıkarken hisse fiyatı tam 5’te 1’ine bölünür (100 lot × 100 ₺ = 500 lot × 20 ₺ = 10.000 ₺)!' },
          { id: 'B', label: 'N Şirketinin %200 Bedellisi; rüçhan kuponu her zaman bedava kârdır.', isOptimal: false, why: 'Borç faizi çevirmek için yapılan bedelli, mevcut ortakların cebinden zorla taze nakit istemektir.' },
          { id: 'C', label: 'P Şirketinin Serbest Nakitle Pay Geri Alımı! Bedelsiz pizzayı daha küçük dilimlere bölmektir; pay geri alımı ise pastadaki dilim sayısını azaltıp senin ortaklık payını büyütür.', isOptimal: true, why: 'Tam bir kurumsal finansman ustası cevabı! Şirket kendi ucuz hissesini kasadaki nakitle toplayınca hisse başı kâr (HBK) kalıcı büyür.' },
          { id: 'D', label: 'Üçü de şirket değerini hiç etkilemez.', isOptimal: false, why: 'İskontolu fiyattan yapılan pay geri alımı ile yüksek faizli borç sarmalındaki bedelli arasında devasa değer farkı vardır.' }
        ],
        consequence100k: '"Bedelsiz verecek!" diye 18x PD/DD’den zirvede M Hissesine atlayan yatırımcı, bölünme sabahı toplam portföy tutarının kuruş değişmediğini ve "beklenti bitti" satışıyla -%22 düştüğünü yaşayarak öğrendi.',
        proRule: 'Uzman Kuralı: Bedelsiz sermaye artırımı şirketin kasasına 1 TL bile sokmaz; sadece özsermaye kalemleri arası muhasebe kaydıdır.',
        linkedKeys: ['bist-mpark', 'bist-bimas', 'bist-froto']
      },
      {
        id: 'case_11_season_rotation',
        category: 'Mevsim & Döngü',
        difficulty: 'Orta',
        title: 'Vaka 11: Faiz Kışından İndirim Baharına Geçiş — Öncü Sinyali Kim Verir?',
        situation: 'Aylarca süren %45+ sıkı faiz kışından sonra çekirdek enflasyon yavaşladı ve 2 yıllık Hazine gösterge tahvil faizi TCMB henüz faiz indirmeden 400 baz puan geri çekildi.',
        question: 'Kış bitmeden bahar hazırlığı yapan stratejist portföyünü nasıl evirir?',
        choices: [
          { id: 'A', label: 'TCMB faizleri %15’e indirene kadar 1 yıl daha %100 gecelik PPF’de beklerim; resmi karar çıkmadan kıpırdamam.', isOptimal: false, why: 'TCMB faizi %15’e indirdiğinde bankalar, tahviller ve GYO’lar çoktan 2–3 katına gitmiş olur; piyasa geleceği önceden fiyatlar.' },
          { id: 'B', label: 'Faiz düşecekse tüm paramla en borçlu ve zarar eden spekülatif yan tahtalara girerim.', isOptimal: false, why: 'Ekonomik yavaşlama gecikmeli vurduğu için faiz indiriminin ilk aylarında çürük şirketlerin tahsilat krizi devam eder.' },
          { id: 'C', label: ' Sabit kuponlu tahvillerimi satıp kısa vadeli mevduata geçerim.', isOptimal: false, why: 'Ters işlem! Piyasa faizi düşerken sabit kuponlu uzun tahvillerin (DİBS) anapara fiyatı YÜKSELİR.' },
          { id: 'D', label: 'PPF ağırlığımı kademeli azaltıp Sabit Kuponlu Tahvil (DİBS), iskontolu Banka, Net Aktif Değer iskontolu GYO ve kaliteli Otomotiv/Sanayi kalelerine yayarım.', isOptimal: true, why: '2 yıllık tahvil faizinin öncü dönüşünü okudun! Hem tahvil değer kazancı hem çarpan genişlemesi bahar döngüsünü taşır.' }
        ],
        consequence100k: 'Tahvil faizi dönerken kademeli rotasyon yapan portföy, sadece PPF’de kalan portföye 1 yılda +%28 reel fark attı.',
        proRule: 'Uzman Kuralı: Merkez Bankası manşeti değil, "2 Yıllık Gösterge Tahvil Faizi" ve "Aylık Mevsimsellikten Arındırılmış TÜFE" döngü pusulasıdır.',
        linkedKeys: ['dibs-tahvil', 'bist-garan', 'bist-ekgyo', 'bist-froto']
      },
      {
        id: 'case_12_gvk80_yiufe_tax',
        category: 'Küresel Yatırım & Vergi',
        difficulty: 'Uzman',
        title: 'Vaka 12: ABD S&P 500 (SPY) Satışında "%9,6 vs %10,2 Yİ-ÜFE" Vergi Uçurumu!',
        situation: 'Dolar 40,00 ₺ iken 400.000 ₺ (10.000 $) ile ABD S&P 500 ETF (SPY) aldın. Bugün SPY dolar bazında +%8 artarak 10.800 $ oldu, Dolar/TL ise 44,50 ₺’ye geldi (Brüt satış: 480.600 ₺ · TL fark: +80.600 ₺). Alış ayından bugüne TÜİK Yİ-ÜFE artışı şu an +%9,6; gelecek ayın 3’ünde açıklanacak veriyle +%10,4 olacağı görülüyor.',
        question: 'Acil nakit ihtiyacın yoksa vergi kanununa (GVK Mük. 80) göre ne yaparsın?',
        choices: [
          { id: 'A', label: 'Bugün satarım; %9,6 ile %10,4 arasında sadece %0,8 enflasyon farkı var, vergide hiçbir şey değişmez.', isOptimal: false, why: 'DEVASA TUZAK! GVK Mük. 80’de %10,00 keskin bir uçurum eşiğidir (cliff effect): %9,99’da maliyetin HİÇ endekslenmez, %10,00 olduğu an TAMAMI endekslenir!' },
          { id: 'B', label: 'Ayın 3’ünü bekleyip Yİ-ÜFE farkı %10,00 eşiğini aştığında (%10,4) satarım; 400.000 ₺ maliyetim yasal olarak 441.600 ₺’ye çıkar ve vergi matrahım bir anda yarıdan fazla düşer!', isOptimal: true, why: 'Gerçek vergi uzmanlığı! Sadece birkaç gün bekleyerek kur/enflasyon köpüğünün vergisini ödemekten tamamen yasal olarak kurtuldun.' },
          { id: 'C', label: 'Yurt dışı ETF’lerde %17,5 otomatik stopaj kesildiği için Yİ-ÜFE’nin önemi yoktur.', isOptimal: false, why: 'Doğrudan yabancı borsadaki ETF (SPY/QQQ) kaynakta stopaja değil, Yİ-ÜFE endekslemeli yıllık beyana tabidir (%17,5 stopaj yerli TEFAS fonlarındadır).' },
          { id: 'D', label: 'Parayı Türkiye’ye çekmediğim sürece satış yapsam bile vergi doğmaz.', isOptimal: false, why: 'Yanlış şehir efsanesi! Vergiyi doğuran olay paranın banka hesabına transferi değil, hissenin/ETF’nin satıldığı (realize edildiği) tarihtir.' }
        ],
        consequence100k: 'Yİ-ÜFE %9,6 iken acele satan 80.600 ₺ üzerinden vergi öderken, %10,4’ü bekleyen sadece 39.000 ₺ reel fark üzerinden vergi hesapladı!',
        proRule: 'Uzman Kuralı: Yurt dışı hisse/ETF ve Eurobond satmadan önce alış ayı ile satıştan önceki ay arasındaki TÜİK Yİ-ÜFE artışının >= %10,00 olduğunu mutlaka doğrula!',
        linkedKeys: ['abd-sp500-spy', 'abd-nasdaq-qqq', 'eurobond-emb']
      },
      {
        id: 'case_13_drought_6month_lead',
        category: 'İklim & Saha Öncüsü',
        difficulty: 'Orta',
        title: 'Vaka 13: Barajlar %26’ya İndi, Kuraklık Başladı — 6 Ay Sonrayı Bugünden Okumak',
        situation: 'Bahar yağışları normallerin %45 altında kaldı; DSİ baraj dolulukları ve EPİAŞ hidroelektrik (HES) üretimi sert geriledi, yem ve buğday fiyatları kıpırdanıyor. Ancak şirketlerin açıklanan son bilançoları hâlâ geçen kışın yağışlı rakamlarını gösteriyor.',
        question: 'Bilanço gecikmesini bilen saha yatırımcısı 6 ay sonrası için nasıl hazırlanır?',
        choices: [
          { id: 'A', label: 'Döviz borçlu saf HES santrallerinden ve vadeli satan küçük gıda üreticilerinden uzak durur; peşin satıp maliyet artışını aynı gün rafa yansıtan Net Nakitli Gıda Perakendecisi (BIMAS/MGROS) ve Tarım Emtiası (DBA) seçerim.', isOptimal: true, why: 'Fiziksel dünyayı muhasebeden 6 ay önce okudun! Fiyatlama gücü ve eksi işletme sermayesi olan market zinciri gıda enflasyonunda kâr büyütür.' },
          { id: 'B', label: 'Son bilançosu iyi geldiği için borçlu HES elektrik şirketini hemen alırım.', isOptimal: false, why: 'Dikiz aynasına bakarak araba kullanmak! Geçen çeyreğin suyu geçti; gelecek 2 çeyrek baraj boşken döviz kredi taksiti ödenecek.' },
          { id: 'C', label: 'Kuraklık sadece çiftçiyi ilgilendirir, Borsa İstanbul şirketlerini etkilemez.', isOptimal: false, why: 'Gıda enflasyonu -> TCMB faiz patikası -> Elektrik PTF maliyeti -> Sanayi marjları doğrudan birbirine bağlıdır.' },
          { id: 'D', label: 'Uzun vadeli tarım kredisi kullanan traktör hisselerine krediyle girerim.', isOptimal: false, why: 'Kuraklık + yüksek gıda enflasyonu = sıkı faiz ve çiftçi gelir kaybı; traktör talebi böyle dönemlerde ertelenir.' }
        ],
        consequence100k: 'EPİAŞ su verisini izleyen yatırımcı, 2 çeyrek sonra gelecek "sürpriz zayıf HES bilançosundan" burnu bile kanamadan kurtuldu.',
        proRule: 'Uzman Kuralı: Doğadaki fiziksel veri (DSİ su, EPİAŞ MWh, gümrük tonajı) bilançodan 90–180 gün önden yürür.',
        linkedKeys: ['emtia-tarim-dba', 'bist-bimas', 'bist-mgros']
      },
      {
        id: 'case_14_oem_supplier_leak',
        category: 'Tedarik Zinciri Sızıntısı',
        difficulty: 'Uzman',
        title: 'Vaka 14: Ana Sanayi (OEM) Rekor İhracat Açıkladı — Yan Sanayi Seçim Filtresi',
        situation: 'Ayın 4’ünde OSD ve TİM verileri açıklandı: Ana otomotiv devlerinin Avrupa ticari araç ihracatı +%24 sıçradı. Bu devlere parça veren iki yan sanayi şirketinden X’te PD/DD 0,72x, OCF pozitif ve CMF +0,15; Y’de ise PD/DD 11,4x ve CMF -0,21 (kurumsal çıkış) var.',
        question: 'Tedarik zinciri sızıntısını paraya çevirirken hangi kuralı işletirsin?',
        choices: [
          { id: 'A', label: 'Ana sanayi büyüdüyse en sığ ve en pahalı yan sanayi (Y) daha hızlı tavan yapar, Y’yi alırım.', isOptimal: false, why: '11,4x PD/DD zaten gelecek 5 yılın büyümesini peşin fiyatlamış; üstelik CMF -0,21 kurumsalların iyi haberi satış fırsatı yaptığını gösteriyor.' },
          { id: 'B', label: 'Yan sanayiye hiç bakmam; aylık ihracat verisinin bilançoyla ilgisi yoktur.', isOptimal: false, why: 'Ana sanayi (OEM) üretim bandı hızlandığında aks, lastik, cam ve kablo tedarikçisinin faturası aynı ay kesilir!' },
          { id: 'C', label: 'OEM ihracat sıçramasını 45 gün öncü ciro sinyali olarak kullanır, fakat yalnızca çarpanı iskontolu (PD/DD 0,72x), OCF+ ve tahtasında kurumsal toplama (CMF > 0) olan X tedarikçisini seçerim!', isOptimal: true, why: 'Hem saha verisini hem değerleme güvenlik marjını hem de tahta akışını birleştiren üçlü kilit!' },
          { id: 'D', label: 'Bilanço açıklanacağı geceye kadar bekler, ertesi sabah açılışta alırım.', isOptimal: false, why: 'Bilanço gecesi geldiğinde kurumsal fonlar 45 gün önce topladıkları malı manşet okuyanlara devreder.' }
        ],
        consequence100k: 'İskontolu X tedarikçisi bilanço döneminde +%34 değerlenirken, şişik çarpanlı Y iyi bilançoya rağmen "beklenti bitti" satışıyla -%16 geriledi.',
        proRule: 'Uzman Kuralı: İyi sektör verisi bile pahalı ve dağıtılan (CMF < 0) tahtayı kurtarmaz; Öncü Veri + Ucuz Çarpan + CMF > 0 birlikte aranır.',
        linkedKeys: ['bist-froto', 'bist-brisa', 'bist-kords']
      },
      {
        id: 'case_15_barbell_zero_ruin',
        category: 'Portföy Mimarisi',
        difficulty: 'Orta',
        title: 'Vaka 15: Sıfır İflas "Halter (Barbell)" Mimarisi vs Kırılgan Sepet',
        situation: '1.000.000 ₺ sermayeni yönetirken ne %30 enflasyona ezilmek istiyorsun ne de beklenmedik bir küresel/iç şokta -%40 çöküp oyun dışı kalmak istiyorsun.',
        question: 'Nassim Taleb ve kurumsal fonların kullandığı "Halter (Barbell)" stratejisi bu 1 milyonu nasıl kurar?',
        choices: [
          { id: 'A', label: '1 milyonun tamamını orta halli, borçlu 15 farklı yan tahtaya bölerim.', isOptimal: false, why: 'Kriz anında tüm borçlu yan tahtaların korelasyonu 1,00’a çıkar ve hepsi aynı anda taban olur; sahte çeşitlendirmedir!' },
          { id: 'B', label: '1 milyonun tamamını vadesiz dövizde tutup hiç dokunmam.', isOptimal: false, why: 'ABD/küresel dolar enflasyonu (%3-4) ve Türkiye’deki reel TL getiri dönemlerinde alım gücün erir; nakit akışı sıfırdır.' },
          { id: 'C', label: '500.000 ₺ kredi kullanarak 1.500.000 ₺ BIST 30 hissesi taşırım.', isOptimal: false, why: 'Kaldıraç sıfır iflas (Zero-Ruin) kuralının tam zıddıdır.' },
          { id: 'D', label: 'Bir uca %50–60 "Kırılmaz Zırh" (%0 vergili Sukuk, PPF, Fiziki Altın) koyup her ay kesin nakit akışı üretirim; diğer uca %40–50 "Nakit Basan İskontolu Kaleler" (FCF+, Net Nakit devler) koyarım, sıfır borç taşırım!', isOptimal: true, why: 'Kırılmaz mimari! Rallide kaliteli şirketler serveti büyütür; çöküşte ise Kırılmaz Zırh hem uykunu korur hem de dipten fabrika toplayacak mermiyi verir.' }
        ],
        consequence100k: 'Borsa -%25 düzeltme yaptığında Halter portföyü sadece -%4 geri çekildi ve elindeki Sukuk nakdiyle dipten ucuz sanayi devlerini topladı!',
        proRule: 'Uzman Kuralı: Bileşik getirinin birinci kuralı akışı asla kesmemektir; büyük çöküşte elinde nakit zırhı olan kişi krizin alıcısı olur.',
        linkedKeys: ['kira-sertifikasi-sukuk', 'gram-altin-spot', 'bist-tuprs', 'bist-enkai']
      },
      {
        id: 'case_16_tefas_aft_vs_qqq_tax',
        category: 'TEFAS vs Yabancı ETF',
        difficulty: 'Uzman',
        title: 'Vaka 16: Teknoloji Yatırımında Gizli Vergi Farkı — TEFAS AFT Fonu mu, Doğrudan QQQ mu?',
        situation: '500.000 ₺ ile 2 yıl vadeli ABD teknoloji devlerine yatırım yapacaksın. 2 yılda Nasdaq dolar bazında +%20, Dolar/TL ise +%55 (Yİ-ÜFE +%52) arttı diyelim (500.000 ₺ -> 930.000 ₺, toplam TL kâr +430.000 ₺). AFT fonunda beyanname yok ama kaynakta %17,5 stopaj ve yıllık ~%2,9 yönetim ücreti var; QQQ ETF’de yönetim ücreti %0,20 ve GVK Mük. 80 Yİ-ÜFE endekslemesi var.',
        question: '2 yıl sonunda vergi ve fon kesintileri sonrası hangisinin matematiği nasıl işler?',
        choices: [
          { id: 'A', label: 'AFT yerli TEFAS fonu olduğu için Hisse Yoğun Fon sayılır ve stopajı %0’dır.', isOptimal: false, why: 'Kritik hata! "%0 Hisse Yoğun" istisnası yalnızca portföyünün >=%80’i BIST (yerli) paylarından oluşan fonlar (MAC/IIH/TI2) içindir; yabancı fonlarda (AFT/AFA) stopaj %17,5’tir!' },
          { id: 'B', label: 'AFT kur artışından doğan TL farkı dahil tüm 430.000 ₺ üzerinden %17,5 stopaj (~75.250 ₺) + yıllık %2,9 ücret keser; QQQ ise Yİ-ÜFE +%52 olduğu için 500.000 ₺ maliyeti 760.000 ₺’ye endeksler ve sadece 170.000 ₺ reel kazancı beyana tabi tutar!', isOptimal: true, why: 'Türkiye’de yatırımcıların %95’inin bilmediği altın detay! Yüksek enflasyon + büyük tutar + uzun vadede Yİ-ÜFE endekslemesi devasa vergi ve ücret avantajı yaratır.' },
          { id: 'C', label: 'AFT sattığım gün T+0 anında nakde döner, QQQ ise 15 günde döner.', isOptimal: false, why: 'Yabancı hisse TEFAS fonlarının (AFT/AFA) satış valörü T+3 iş günüdür (13:30 sonrası T+4 iş günü!).' },
          { id: 'D', label: 'Küçük tutarda (örn. 15.000 ₺) bile her zaman QQQ almak daha kolaydır, beyanname asla gerekmez.', isOptimal: false, why: 'Küçük tutarda beyanname takibi istemeyen için AFT pratik kolaylık sunar; büyük tutar ve uzun vadede ise QQQ maliyet/endeksleme üstünlüğü kurar.' }
        ],
        consequence100k: '500.000 ₺’lik 2 yıllık yatırımda yönetim ücreti farkı (~28.000 ₺) ve kur farkı stopajı eklendiğinde iki kapı arasında ~50.000 ₺’yi aşan net servet farkı doğdu!',
        proRule: 'Uzman Kuralı: TEFAS’ta yerli Hisse Yoğun Fonlar (MAC, IIH, TI2) %0 stopajlıdır; yabancı fonlar (AFT, AFA) ise TL kur farkı dahil %17,5 stopajlı ve T+3 bozum valörlüdür.',
        linkedKeys: ['tefas-aft', 'abd-nasdaq-qqq', 'tefas-mac']
      },
      {
        id: 'case_17_cyclical_low_pe_trap',
        category: 'Döngüsel Değerleme',
        difficulty: 'Uzman',
        title: 'Vaka 17: Peter Lynch’in Döngüsel Terslik Kuralı — Rafineri ve Çelikte F/K 2,8x Ne Demek?',
        situation: 'Ağır döngüsel bir çelik veya rafineri şirketinde dünya ürün marjları son 15 yılın rekor zirvesine çıkmış, şirket rekor kâr açıklamış ve ekranda F/K çarpanı 2,8x görünüyor! Tam tersine marjların en dip olduğu yılda ise aynı şirketin F/K’sı 28x veya zararda görünüyor.',
        question: 'Döngüsel (emtia/çelik/rafineri/petrokimya) şirketlerde F/K terazi kuralı nasıl çalışır?',
        choices: [
          { id: 'A', label: 'Döngüsel şirketlerde çarpan TERS çalışır! Marjlar tarihi zirvedeyken F/K en düşük (2,8x) görünür ve tehlikelidir; marjlar dipteyken F/K yüksek görünür ama PD/DD iskontoluysa asıl toplama zamanı orasıdır!', isOptimal: true, why: 'Usta seviye! Döngüsel şirketi rekor marj yılında 2,8x F/K’ya aldanıp tepeden alanlar, marj normale dönünce kârın %70 eridiğini görür.' },
          { id: 'B', label: '2,8x F/K şirketin kendini 2,8 yılda amorti edeceğini kanıtlar; tüm paramla girerim.', isOptimal: false, why: 'O hesap ancak kâr sabit veya büyüyorsa geçerlidir; emtia döngüsü tepeden döndüğünde gelecek yılın F/K’sı bir anda 16x’e fırlar!' },
          { id: 'C', label: 'Döngüsel şirketler 28x F/K olduğunda her zaman balon demektir, asla alınmaz.', isOptimal: false, why: 'Emtia marjı tarihi dipteyken paydadaki kâr geçici olarak küçüldüğü için F/K şişik görünür; oysa fabrika özkaynağının yarısına (0,5x PD/DD) satılıyor olabilir!' },
          { id: 'D', label: 'Çelik ve rafineri şirketlerinde ürün marjının (HRC makası / Crack Spread) önemi yoktur.', isOptimal: false, why: 'Bu şirketlerin kârının %80’ini ton veya varil başına dolar işleme makası belirler.' }
        ],
        consequence100k: '2022 emtia zirvesinde "F/K 3x çok ucuz!" diyerek döngüsel hisse alanlar 2 yıl boyunca reel olarak erirken, marj dibinde düşük PD/DD’den toplayanlar döngü dönüşünü yakaladı.',
        proRule: 'Uzman Kuralı: Döngüsel sanayide (EREGL, KRDMD, TUPRS, PETKM) F/K’ya değil; "Tarihsel Ürün Marjı Konumu (Dip mi, Tepe mi?) + PD/DD + Ton/Kapasite Değeri"ne bak!',
        linkedKeys: ['bist-eregl', 'bist-tuprs', 'bist-petkm']
      },
      {
        id: 'case_18_kap_revenue_ratio_illusion',
        category: 'KAP Okuma Sanatı',
        difficulty: 'Orta',
        title: 'Vaka 18: KAP’ta "65 Milyon TL Dev Sipariş Aldık!" Başlığı — Gerçekten Dev mi?',
        situation: 'Yıllık toplam cirosu 52 Milyar ₺ olan bir sanayi şirketi gün ortasında KAP’a "Şirketimiz yurt içinde 65.000.000 ₺ tutarında yeni sipariş almıştır, hayırlı olsun" bildirimi gönderdi. Hisse haberle +%6 sıçradı.',
        question: 'KAP bildiriminde zorunlu "Son Yıllık Hasılata Oranı (%)" satırını hesapladığında ne görürsün?',
        choices: [
          { id: 'A', label: '65 Milyon ₺ çok büyük paradır; hemen +%6’dan alım yaparım.', isOptimal: false, why: 'Bireysel bütçe için 65 Milyon ₺ büyük görünebilir ama 52 Milyar ₺ cirolu fabrika bu tutarı zaten her sabah öğlene kadar (yarım günde!) kesmektedir!' },
          { id: 'B', label: 'Yıllık cironun %12’si demektir, bilançoyu uçurur.', isOptimal: false, why: 'Bölme hatası: 65 Milyon / 52.000 Milyon = 0,00125 yani sadece BİNDE 1,25 (%0,12)!' },
          { id: 'C', label: 'Hisseyi açığa satarım.', isOptimal: false, why: 'Sırf rutin sipariş haberi geldi diye trende karşı açığa satış yapmak gereksiz sıkışma riskidir.' },
          { id: 'D', label: '65 Milyon ₺, 52 Milyar ₺ yıllık cironun sadece %0,12’sidir (fabrikanın 11 saatlik rutin mesaisi!); manşet rakamın büyüsüne kapılıp +%6 primli tahtaya atlamam.', isOptimal: true, why: 'Keskin matematik gözü! KAP’ta mutlak TL rakamına değil, daima "Yıllık Ciroya Oranı (%)" ve "340 Alınan Avanslar" etkisine bakılır.' }
        ],
        consequence100k: 'Rutin yarım günlük siparişi "dev ihale" sanıp +%6’dan atlayanlar, seans sonu hissenin başladığı yere dönmesiyle aynı gün -%5,5 içeri girdi.',
        proRule: 'Uzman Kuralı: Bir yeni iş bildiriminin şirketin kaderini değiştirmesi için yıllık cironun en az %8–%15’i büyüklüğünde olması ve marjının güçlü olması gerekir.',
        linkedKeys: ['bist-asels', 'bist-astor', 'bist-otkar']
      },
      {
        id: 'case_19_reit_appraisal_pe_illusion',
        category: 'Sektörel Terazi',
        difficulty: 'Orta',
        title: 'Vaka 19: GYO Hissesinde "F/K 1,9x" İlüzyonu vs Kira ve Net Aktif Değer',
        situation: 'Bir Gayrimenkul Yatırım Ortaklığı (GYO) yıl sonu bilançosunda 8 Milyar ₺ Net Kâr açıkladı ve F/K çarpanı 1,9x’e düştü! Ancak dipnota baktığında bu 8 Milyar ₺’nin 7,7 Milyar ₺’sinin "Yatırım Amaçlı Gayrimenkul Ekspertiz Değer Artış Kazancı" olduğunu, kasaya giren gerçek kira/satış nakdinin (OCF) ise sadece 300 Milyon ₺ ve döviz borcunun 6 Milyar ₺ olduğunu gördün.',
        question: 'GYO analizinde hangi yargı doğrudur?',
        choices: [
          { id: 'A', label: '1,9x F/K şirketin her 2 yılda bir kendi piyasa değeri kadar nakit kazandığını gösterir; kaçırılmaz fırsattır.', isOptimal: false, why: 'Ekspertiz raporuyla AVM’nin kağıt üstü değerini artırmak kasaya 1 lira bile nakit sokmaz; o kârla borç ödenemez ve temettü dağıtılamaz!' },
          { id: 'B', label: 'GYO’lar %25 kurumlar vergisi ödediği için net kârları çok kalitelidir.', isOptimal: false, why: 'Bilgi hatası: GYO’lar Türkiye’de kurumlar vergisinden istisnadır (%0), fakat kârlarının çoğu nakit olmayan yıl sonu değerlemesidir.' },
          { id: 'C', label: 'GYO’larda F/K çarpanı ekspertiz değerlemesi yüzünden yanıltıcıdır! Tek doğru terazi "PD/DD (Net Aktif Değer İskontosu)" ve "Yıllık Düzenli Kira Nakdi / Net Borç" oranıdır; bu borçlu şirketten uzak dururum.', isOptimal: true, why: 'Sektörel terazi ustalığı! Nakit kira üreten borçsuz GYO ile ekspertiz kârı yazan döviz borçlu GYO’yu bıçak gibi ayırdın.' },
          { id: 'D', label: 'Döviz kuru yükseldiğinde döviz borçlu GYO’ların kârı artar.', isOptimal: false, why: 'AVM kiraları TL iken banka kredisi döviz olan GYO kur şokunda ağır kambiyo zararı yazar.' }
        ],
        consequence100k: '1,9x F/K’ya aldanan yatırımcı, sonraki 3 ara çeyrekte ekspertiz değerlemesi yapılmadığı için şirketin finansman gideriyle zarar açıkladığını görünce şok oldu.',
        proRule: 'Uzman Kuralı: Sanayi terazisiyle GYO tartılmaz! GYO’da "PD/DD < 0,60x + Düzenli Kira Geliri + Net Nakit Kasa" üçlüsü aranır.',
        linkedKeys: ['bist-ekgyo', 'bist-rygyo', 'bist-isgyo']
      },
      {
        id: 'case_20_deposit_break_vs_sukuk_ladder',
        category: 'Nakit Yönetimi',
        difficulty: 'Temel',
        title: 'Vaka 20: 181 Gün Vadeli Mevduatın 150. Gününde Çıkan Yangın Yeri Fırsatı!',
        situation: 'Stopajı %17,5 yerine %15 olsun diye 1.000.000 ₺’nin tamamını tek parça 181 gün vadeli banka mevduatına bağladın. Vadenin 150. gününde (~145.000 ₺ net faiz birikmişken) borsada 5 yılda bir gelen dev bir yangın yeri iskontosu oluştu ve nakit lazım oldu.',
        question: 'Bankadaki 181 günlük vadeli mevduatı 150. günde bozarsan gerçek hayatta ne olur?',
        choices: [
          { id: 'A', label: '150 günlük birikmiş 145.000 ₺ net faizimi alır, kalan 31 günün faizinden vazgeçerim.', isOptimal: false, why: 'Banka vadeli mevduat sözleşmesinde erken bozumda geçmiş 150 günün tüm faizi YANAR (vadesiz faizi ~%0 uygulanır)!' },
          { id: 'B', label: '150 günlük birikmiş ~145.000 ₺ faizin TAMAMI sıfırlanır, eline sadece 1.000.000 ₺ anapara geçer! Bu yüzden uzman yatırımcı nakit zırhını tek vade yerine günlük işleyen PPF ve %0 stopajlı Kira Sertifikasına (Sukuk) böler.', isOptimal: true, why: 'Tam isabet! %2,5 stopaj avantajı alayım derken 5 aylık tüm getiriyi ve likidite esnekliğini kilitlemenin bedeli çok ağırdır.' },
          { id: 'C', label: 'Banka anaparadan da %10 ceza keser, 900.000 ₺ verir.', isOptimal: false, why: 'Vadeli mevduatta anaparadan kesinti olmaz ama birikmiş tüm faiz sıfırlanır.' },
          { id: 'D', label: 'Vadeli mevduat vade dolmadan teknik olarak asla kapatılamaz.', isOptimal: false, why: 'İstediğin gün kapatabilirsin ancak tüm işlemiş faiz yanar.' }
        ],
        consequence100k: 'Tek parça uzun vadeli mevduata kilitlenen kişi ya 145.000 ₺ faizini yakmak ya da borsadaki tarihi fırsatı eli kolu bağlı izlemek zorunda kaldı.',
        proRule: 'Uzman Kuralı: Fırsat cephaneni asla tek uzun vadeye kilitleme; PPF (13:30 öncesi T+0) + %0 stopajlı Kamu Sukuk (T+1) her gün üstüne koyarak likit kalır.',
        linkedKeys: ['mevduat-ust', 'kira-sertifikasi-sukuk', 'para-piyasasi-fonu']
      },
      {
        id: 'case_21_bedelli_ruchan_expiry',
        category: 'Yatırımcı Hakları',
        difficulty: 'Uzman',
        title: 'Vaka 21: Portföyde Unutulan "Rüçhan Kuponu (.R)" — Son Gün Saat 17:00’de Ne Olur?',
        situation: 'Portföyündeki bir şirket %100 Bedelli Sermaye Artırımı başlattı ve hesabına ana hissenin yanında "XYZ.R (Rüçhan Hakkı Kuponu)" tanımlandı. Bedelliye yeni para koymak istemiyorsun ama ekrana 15 gün boyunca hiç bakmadın.',
        question: 'Rüçhan kuponu pazarının son gününe kadar ne bedelliye katılırsan ne de .R kuponlarını satarsan sonuç ne olur?',
        choices: [
          { id: 'A', label: 'Kullanılmayan ve rüçhan pazarında satılmayan .R kuponları süre sonunda tamamen SIFIRLANIR (yanar)! Bölünme sabahı ana hisseden düşen değer kadar cebinden geri dönüşsüz servet buharlaşır!', isOptimal: true, why: 'Türkiye’de her yıl binlerce küçük yatırımcının ekranına bakmadığı için yaşadığı en acı teknik kayıp! Katılmayacaksan rüçhan kuponunu süresi bitmeden pazarda satıp nakde çevirmelisin.' },
          { id: 'B', label: 'Aracı kurum son gün kuponlarımı benim adıma otomatik nakde çevirip hesabıma yatırır.', isOptimal: false, why: 'Aracı kurum izinsiz emir göndermez; süresi dolan rüçhan kuponu değersiz kâğıt olarak silinir (birincil piyasada kalan payları şirket satar ama para şirkete gider, sana değil!).' },
          { id: 'C', label: 'Bedelliye katılmazsam ana hissemin fiyatı bölünmeden önceki yüksek fiyatta kalır.', isOptimal: false, why: 'Bölünme sabahı herkesin hissesi teorik fiyata bölünür; aradaki fark .R kuponuna geçer. Kuponu yakarsan doğrudan zarar edersin.' },
          { id: 'D', label: 'Rüçhan kuponu 5 yıl boyunca geçerlidir, istediğim zaman kullanırım.', isOptimal: false, why: 'Rüçhan hakkı kullanım süresi genellikle sadece 15 takvim günüdür (rüçhan pazarı daha da erken kapanır!).' }
        ],
        consequence100k: '100.000 ₺’lik hissede yüksek oranlı bedellinin rüçhan kuponunu unutan yatırımcı, hisse hiç düşmediği halde bir gecede 25.000–40.000 ₺ hakkını çöpe attı!',
        proRule: 'Uzman Kuralı: Portföyünde ".R" uzantılı rüçhan kuponu gördüğün an iki seçeneğin var: Ya nakit yatırıp yeni paya çevir ya da Rüçhan Pazarında kuponu sat — ASLA kendi haline bırakma!',
        linkedKeys: ['bist-hekts', 'bist-sasa', 'bist-petkm']
      },
      {
        id: 'case_22_viop_evening_tlref_basis',
        category: 'VİOP & Arbitraj',
        difficulty: 'Uzman',
        title: 'Vaka 22: Akşam 21:00’de VİOP BIST30 Kontratı Spotun +%3,2 Üstünde — Boğa Sinyali mi, Faiz mi?',
        situation: 'Akşam saat 21:00’de VİOP akşam seansına bakıyorsun: BIST 30 spot endeks 18:10’da 11.000 puandan kapanmış, 30 gün vadeli VİOP BIST30 kontratı ise 11.352 puanda (spotun +%3,20 üzerinde) işlem görüyor! Yıllık gecelik TLREF faizi ise %39.',
        question: 'Ertesi sabah saat 10:00’da spot borsanın +%3,20 ralliyle açılacağını mı düşünürsün?',
        choices: [
          { id: 'A', label: 'Evet! Vadeli kontrat spotun %3,2 üstündeyse sabah borsa %3,2 yukarıda açılır.', isOptimal: false, why: 'Klasik acemi tuzağı! Vadeli kontrat fiyatı zaten vade sonuna kadarki taşıma faizini (Spot × Faiz × Gün/365) içinde barındırır!' },
          { id: 'B', label: 'Hayır, sabah borsa kesinlikle -%3,2 düşüşle açılır.', isOptimal: false, why: '%3,2 fark düşüş sinyali değil, 30 günlük normal TLREF taşıma maliyetidir (~%39 / 12 = %3,25).' },
          { id: 'C', label: 'VİOP akşam seansında oluşan fiyatlar tamamen sanaldır, gerçek para dönmez.', isOptimal: false, why: '19:00–23:00 VİOP akşam seansı Takasbank güvenceli %100 gerçek canlı piyasadır.' },
          { id: 'D', label: 'Hayır! Yıllık %39 faizde 30 günlük teorik taşıma maliyeti zaten ~%3,20’dir; yani VİOP şu an yatay (%0,0) bir sabah açılışını fiyatlıyor! Gerçek sinyal ancak VİOP’un 18:15 kapanışına göre değişiminden okunur.', isOptimal: true, why: 'Profesyonel masa bilgisi! Teorik vadeli makas (Basis = Spot × r × t) ile akşam seansı net değişimini kusursuz ayırdın.' }
        ],
        consequence100k: 'VİOP teorik faiz makasını "ralli" sanıp sabah 09:55’te heyecanla alım yapan acemi, borsanın yatay açıldığını görünce neye uğradığını şaşırdı.',
        proRule: 'Uzman Kuralı: Sabah açılış ipucu için "VİOP Fiyatı − Spot" farkına değil, "VİOP’un Akşam 19:00 Sonrası Yüzde Değişimine" veya "Gerçek Makas − Teorik TLREF Makası" farkına bakılır (AETHER bunu otomatik hesaplar!).',
        linkedKeys: ['viop-bist30-kontrat', 'bist-30', 'bist-100']
      },
      {
        id: 'case_23_related_party_cash_drain',
        category: 'Adli Muhasebe',
        difficulty: 'Uzman',
        title: 'Vaka 23: Kasadaki Nakit Nereye Gitti? — Dipnotlardaki "İlişkili Taraf Alacağı"',
        situation: 'Borsada işlem gören bir sanayi şirketi geçen yıl halka arzdan ve faaliyetlerinden 2,2 Milyar ₺ nakit topladı. Ancak yeni bilançonun "Ticari Olmayan İlişkili Taraf Alacakları" dipnotuna baktığında, şirketin bu 2 Milyar ₺’yi borsada açık olmayan "Patronun Özel İnşaat Şirketine" uzun vadeli borç verdiğini gördün!',
        question: 'Adli bilanço denetçisi bu tabloya hangi teşhisi koyar?',
        choices: [
          { id: 'A', label: 'Alacak da bir varlıktır; bilançonun aktif büyüklüğü arttığı için olumludur.', isOptimal: false, why: 'Halka açık şirketin kasasındaki sıcak nakdin, küçük ortakların payı olmayan dışarıdaki özel grup şirketini fonlaması kurumsal yönetişim alarmıdır!' },
          { id: 'B', label: 'Patron şirketi olduğu için tahsilat riski sıfırdır, PD/DD ucuzsa alınır.', isOptimal: false, why: 'Borsa tarihinde iflas eden veya yıllarca sürünen birçok şirkette asıl delik tam olarak tahsil edilemeyen grup içi (ilişkili taraf) alacaklarıdır.' },
          { id: 'C', label: 'Kırmızı Bayrak (Kasa Sızıntısı)! Halka açık şirketin nakdi ortaklara temettü veya fabrika yatırımı olmak yerine patronun özel şirketine aktarılmaktadır; çarpanı ne kadar ucuz görünürse görünsün elimi sürmem.', isOptimal: true, why: 'Adli muhasebenin bir numaralı kalkanı! Ortaklarına dürüst davranmayan yönetime 0,3x PD/DD’de bile para emanet edilmez.' },
          { id: 'D', label: 'Sadece teknik grafikte 200 günlük ortalamayı kırmasına bakarım, dipnot önemsizdir.', isOptimal: false, why: 'İçi boşaltılan kasanın teknik grafiği bir sabah gelen SPK/denetçi uyarısıyla paramparça olur.' }
        ],
        consequence100k: 'Dipnot okumayıp "ucuz" diye girenler yıllarca beklerken, paralarını şeffaf kurumsal yönetişimli (temettü/geri alım yapan) şirketlere koyanlar servet büyüttü.',
        proRule: 'Uzman Kuralı: KAP finansal raporunda `CTRL+F -> "İlişkili Taraf"` araması yapmadan bir şirkete büyük sermaye bağlanmaz!',
        linkedKeys: ['bist-kchol', 'bist-froto', 'tefas-ti2']
      },
      {
        id: 'case_24_tcmb_1400_liquidity_whipsaw',
        category: 'Merkez Bankası & Likidite',
        difficulty: 'Orta',
        title: 'Vaka 24: Perşembe Saat Tam 14:00:05 — TCMB Kararı Saniyesindeki Testere (Whipsaw)',
        situation: 'Perşembe saat 14:00’te TCMB faiz kararını açıkladı. Karar metnindeki tek bir cümle yüzünden saat 14:00:10’da bankacılık endeksi (XBANK) önce +%3,8 fırladı, algoritmik robotların kademeleri taramasıyla 14:03’te -%2,5’e çakıldı ve 14:30’da yönünü buldu.',
        question: 'Perşembe 14:00 karar saniyesinde soğukkanlı profesyonel ne yapar?',
        choices: [
          { id: 'A', label: '14:00:05’te gördüğüm ilk yeşil mumda tüm paramla serbest fiyatlı (piyasa) alım emri gönderirim.', isOptimal: false, why: 'Karar saniyesinde emir defteri (order book) kademeleri bomboştur! Serbest fiyatlı piyasa emri en üst kademeden eşleşip 90 saniyede -%5 zarar yazar.' },
          { id: 'B', label: '14:00–14:15 arasındaki algoritmik testerede piyasa emri göndermem; PPK karar metnindeki "politika duruşu + likidite/enflasyon vurgusunu" ve 2Y tahvil faizinin tepkisini okuyup limit fiyatlı kademeli işlem yaparım!', isOptimal: true, why: 'Tam bir masa ustası refleksi! İlk 3 dakika robotların likidite avıdır; gerçek yönü metnin satır araları ve tahvil faizi belirler.' },
          { id: 'C', label: '14:00’ten 1 dakika önce 10x kaldıraçlı VİOP pozisyonu açıp yazı-tura atarım.', isOptimal: false, why: 'Çift yönlü iğne barı (önce +%3,8 sonra -%2,5) iki yönlü yüksek kaldıracı da aynı 3 dakika içinde patlatır!' },
          { id: 'D', label: 'TCMB kararlarının banka ve GYO hisseleri üzerinde hiçbir etkisi yoktur.', isOptimal: false, why: 'Banka fonlama maliyeti ve GYO konut kredisi talebi doğrudan TCMB politika patikasına bağlıdır.' }
        ],
        consequence100k: 'Karar saniyesinde serbest emirle atlayan yatırımcı kademe kaymasından (slippage) 4.800 ₺ kaybetti; metni okuyup 14:25’te limit emirle giren ise temiz trendi yakaladı.',
        proRule: 'Uzman Kuralı: Yüksek volatilite pencerelerinde (Perşembe 14:00 TCMB, Ayın 3’ü 10:00 TÜİK, 09:55 Açılış) asla korumasız serbest emirle robotların önüne atlama!',
        linkedKeys: ['bist-akbnk', 'bist-garan', 'bist-banka', 'dibs-tahvil']
      },
      {
        id: 'case_25_ebdks_6pct_circuit_breaker',
        category: 'Piyasa Fiziği & Panik',
        difficulty: 'Temel',
        title: 'Vaka 25: BIST 100 Bir Günde -%6 Düştü, Tüm Borsa Durdu (EBDKS)!',
        situation: 'Salı öğlen saat 13:45’te beklenmedik jeopolitik haberle BIST 100 endeksi -%6,1 düştü ve Borsa İstanbul’un yeni tek kademeli Endekse Bağlı Devre Kesici Sistemi (EBDKS) tüm piyasayı durdurdu. Ekranda her yer kıpkırmızı; arkadaşların "Her şey batıyor, açılır açılmaz sat!" diye mesaj atıyor.',
        question: 'Devre kesici açıldığında ne yaparsın?',
        choices: [
          { id: 'A', label: 'Korkuyla açılış eşleşmesine tüm sağlam hisselerim için "tabandan serbest satış" girerim.', isOptimal: false, why: 'Devre kesici zaten paniği soğutmak için vardır! Eşleşme anında tabandan serbest satış göndermek, en ucuz saniyede malını robotlara teslim etmek demektir.' },
          { id: 'B', label: 'Soğukkanlı kalırım: 1) Önce kredili borcum yoksa panik satışı yapmam, 2) Haberin kalıcı mı geçici mi olduğunu okurum, 3) Cebimdeki nakit zırhıyla (Sukuk/PPF) kasası sağlam ama panikle ezilmiş şirketleri kademeli izlerim!', isOptimal: true, why: 'Gerçek soğukkanlı yatırımcı! BIST EBDKS -%6 kuralı paniği durdurmak içindir; sağlam işletmelerin fabrikası bir günde yok olmaz.' },
          { id: 'C', label: 'Borsa tamamen kapandı, artık haftaya kadar hiçbir işlem olmaz.', isOptimal: false, why: 'EBDKS geçici bir soğutma molasıdır (emir toplama + eşleşme ile aynı gün yeniden açılır).' },
          { id: 'D', label: 'Hemen kredi çekip tek bir hisseye %100 kaldıraçla dalarım.', isOptimal: false, why: 'Fırtına ortasında borçla tek sepete girmek ikinci dalgada Margin Call tasfiyesine yol açar!' }
        ],
        consequence100k: 'Devre kesici sonrası panikle dipten satanlar ertesi hafta %14 zararla izlerken, soğukkanlı bekleyip kasası nakit dolu şirkette kalanlar zararsız çıktı.',
        proRule: 'Uzman Kuralı: Borsa İstanbul’da BIST 100 gün içi -%6 düştüğünde tek kademe EBDKS, tekil hissede -%5 düştüğünde pay bazlı devre kesici çalışır. Bu mola panik yapmak için değil, nefes alıp teraziye bakmak içindir!',
        linkedKeys: ['bist-100', 'kira-sertifikasi-sukuk', 'gram-altin-spot']
      },
      {
        id: 'case_26_serbest_fon_vs_tefas_stopaj_2026',
        category: 'Vergi & Fonlar (2026)',
        difficulty: 'Orta',
        title: 'Vaka 26: "Hisse Fonu = Sıfır Vergi" Sanıp %17,5 Stopaj Ödemek (Mart 2026 Kuralı)',
        situation: 'İki hisse senedi yoğun fon arasında kaldın: 1) TEFAS’ta herkese açık işlem gören Yerli Hisse Yoğun Fon (MAC / IIH), 2) TEFAS’ta işlem görmeyen, sadece nitelikli yatırımcıya açık "Serbest Hisse Yoğun Fon". İkisinin de 1 yıllık getirisi +%60 oldu.',
        question: '2026 Türkiye güncel stopaj mevzuatına göre iki fon arasında cebine giren net kâr farkı nedir?',
        choices: [
          { id: 'A', label: 'İkisi de hisse yoğun olduğu için ikisinde de %0 stopaj vardır.', isOptimal: false, why: 'Eski bilgi! Mart 2026 düzenlemesiyle TEFAS’ta işlem görmeyen serbest hisse yoğun fonlardaki %0 stopaj istisnası kaldırılıp %17,5 yapıldı!' },
          { id: 'B', label: 'TEFAS’taki standart Yerli Hisse Yoğun Fonlarda (MAC, IIH, TI2) %0 stopaj devam ederken, TEFAS dışı serbest hisse fonlarında kârdan %17,5 stopaj kesilir!', isOptimal: true, why: 'Mükemmel 2026 mevzuat hakimiyeti! 600.000 ₺ kârda tam 105.000 ₺ net vergi farkı demektir.' },
          { id: 'C', label: 'TEFAS fonlarında %25, serbest fonlarda %0 stopaj vardır.', isOptimal: false, why: 'Tam tersidir: TEFAS yerli hisse yoğun fonlarda %0 stopaj geçerlidir.' },
          { id: 'D', label: 'Fon kazançları hiçbir zaman vergilendirilmez.', isOptimal: false, why: 'PPF, altın, borçlanma, yabancı hisse ve TEFAS dışı serbest fonlarda %17,5 stopaj kesilir.' }
        ],
        consequence100k: '1.000.000 ₺’den 600.000 ₺ kâr elde edildiğinde TEFAS yerli hisse fonunda 600.000 ₺ net kalırken, %17,5 stopajlı fonda 105.000 ₺ vergiye kesildi!',
        proRule: 'Uzman Kuralı: Her fon almadan önce 2 soruyu kontrol et: "TEFAS’ta işlem görüyor mu?" ve "İçeriği en az %80 yerli BIST hissesi mi?" — ikisi de EVET ise %0 stopaj kalkanındasın.',
        linkedKeys: ['tefas-mac', 'tefas-iih', 'tefas-ti2']
      },
      {
        id: 'case_27_340_order_advances',
        category: 'Saha Öncü Veri',
        difficulty: 'Uzman',
        title: 'Vaka 27: Bilançodaki Gizli Hazine — "340 Alınan Sipariş Avansları"',
        situation: 'Bir savunma ve enerji makinesi fabrikasının son bilançosunda net kârı yatay kalmış ama "Alınan Sipariş Avansları (Ertelenmiş Gelirler)" kalemi bir yılda 4 Milyar ₺’den 14 Milyar ₺’ye fırlamış! Yani müşteriler daha mal teslim edilmeden 14 Milyar ₺ peşin kapora yatırmış.',
        question: 'Bu bilançodaki avans patlaması sana gelecek 12 ay için ne fısıldar?',
        choices: [
          { id: 'A', label: 'Avanslar bilançoda "Borç (Yükümlülük)" tarafında yazdığı için şirket batıyor demektir!', isOptimal: false, why: 'Muhasebe tuzağı! Müşteriden alınan kapora, mal teslim edilene kadar pasifte "yükümlülük" yazılır ama faizsiz bedava finansman ve garanti gelecek cirodur!' },
          { id: 'B', label: 'Çok güçlü öncü büyüme sinyali! Şirket hem faizsiz müşteri parasıyla kendi işletmesini çeviriyor hem de ürünler teslim edildikçe bu avanslar önümüzdeki çeyreklerde doğrudan ciro ve kâra yazılacak.', isOptimal: true, why: 'Analist altın madeni! ASELSAN, ASTOR ve büyük taahhüt/savunma şirketlerinde en keskin gelecek ciro göstergesi alınan sipariş avansları ve bakiye sipariş (backlog) tutarıdır.' },
          { id: 'C', label: 'Müşteriler şirketten alacaklı olduğu için şirket faiz ödemek zorunda kalır.', isOptimal: false, why: 'Sipariş avansına faiz ödenmez; aksine şirket yüksek faiz ortamında bedava nakit kullanmış olur.' },
          { id: 'D', label: 'Sadece bugünkü F/K oranına bakarım, avans satırı önemsizdir.', isOptimal: false, why: 'F/K geçmiş 12 ayı gösterir; 340 avansları ise gelecek 12 ayın faturasını bugünden haber verir.' }
        ],
        consequence100k: 'Geçmiş F/K’ya takılıp bakanlar treni kaçırırken, avans patlamasını okuyup erken ortak olanlar teslimat çeyreklerinde %60+ reel kâr yazdı.',
        proRule: 'Uzman Kuralı: Bilançoda her "yükümlülük" kötü borç değildir: "Banka Kredisi" faiz yakan kötü borçtur; "Alınan Sipariş Avansı" ise müşterinin peşin ödediği garanti cirodur!',
        linkedKeys: ['bist-asels', 'reel-enerji-astor', 'bist-enkai']
      },
      {
        id: 'case_28_gold_silver_ratio_and_bazaar',
        category: 'Altın & Emtia',
        difficulty: 'Temel',
        title: 'Vaka 28: Altın mı, Gümüş mü, Kuyumcu mu, Gece Bankası mı?',
        situation: 'Anneannen birikmiş 200.000 ₺’sini Cuma akşamı saat 21:00’de telefonundaki banka uygulamasından gram altına çevirmek istiyor. Banka o an %3,60 alış-satış makası ve %0,20 kambiyo vergisi (BSMV) uyguluyor. Pazartesi sabahı Kapalıçarşı veya gündüz dar makas ise sadece %0,40.',
        question: 'Anneannene karşımda oturan görmüş geçirmiş bir dost gibi ne dersin?',
        choices: [
          { id: 'A', label: 'Hemen şimdi akşam 21:00’de al, sabaha kadar altın uçar!', isOptimal: false, why: 'Cuma gecesi banka makası %3,60 + %0,20 vergi = tek tıkta ~4.000 ₺ anında buhar olur! Acele etmenin bedeli çok ağırdır.' },
          { id: 'B', label: 'Cuma akşamı acele etme: Gece bankada makas çok açık (~4.000 ₺ baştan kayıp). Pazartesi gündüz saat 10:00–17:00 arası dar makastan veya Kapalıçarşı’dan alırsan o 3.500 ₺ cebinde kalır!', isOptimal: true, why: 'İşte gerçek dostluk ve sokak zekâsı! Sadece 2 gün sabretmek tek hamlede yarım gramdan fazla altını bedavaya kurtarır.' },
          { id: 'C', label: 'Fiziki altın yerine borsada +%14 hava paralı ALTIN.S1 alalım.', isOptimal: false, why: 'ALTIN.S1 yüksek primliyken fiziki altından çok daha pahalıdır; prim kapanırsa zarar yazar.' },
          { id: 'D', label: 'Bankada gece ile gündüz arasında hiçbir fiyat farkı yoktur.', isOptimal: false, why: 'Türkiye’de bankalar 17:30 sonrası ve hafta sonu riskten korunmak için döviz/altın makasını 5–8 kat açar!' }
        ],
        consequence100k: '200.000 ₺’yi Cuma gecesi bankadan çeviren daha ilk saniyede 4.000 ₺ kaybetti; Pazartesi gündüzü bekleyen ise 3.600 ₺’yi cebinde tuttu.',
        proRule: 'Uzman Kuralı: Türkiye’de döviz ve altın alım-satımı mecbur kalmadıkça hafta içi 09:30–17:00 dar makas penceresinde yapılır. Gece makası sabırsızlığın vergisidir!',
        linkedKeys: ['gram-altin-spot', 'gram-gumus-spot', 'altin-sertifikasi']
      },
      {
        id: 'case_29_bedelli_good_vs_bad',
        category: 'Sermaye Hamleleri',
        difficulty: 'Orta',
        title: 'Vaka 29: Şirket %100 Bedelli Sermaye Artırımı Açıkladı — Kaçmalı mı, Katılmalı mı?',
        situation: 'İki farklı şirket aynı hafta %100 bedelli sermaye artırımı (ortaklardan yeni nakit isteme) açıkladı. A Şirketi izahnamesinde paranın %90’ıyla vadesi dolan yüksek faizli banka borçlarını kapatacağını, B Şirketi ise tamamıyla ihracat garantili yeni fabrika ve güneş santrali kuracağını yazdı.',
        question: 'İki bedelli arasındaki farkı nasıl okursun?',
        choices: [
          { id: 'A', label: 'Tüm bedelliler kötüdür, ikisinden de koşarak kaçarım.', isOptimal: false, why: 'Ezber hata! Borç deliğini yamamak için yapılan bedelli zehirdir ama yüksek getirili yeni fabrika kuran bedelli uzun vadede şirketi büyütebilir.' },
          { id: 'B', label: 'İzahnamedeki "Fon Kullanım Yeri Raporuna" bakarım: Borç yamayan ve sürekli nakit yakan A Şirketinden uzak dururum; yüksek ROIC’li fabrika kuran B Şirketini ise projeye göre değerlendiririm!', isOptimal: true, why: 'Gerçek ortak gözü! Önemli olan bedelli kelimesi değil, senden istenen paranın yakılacak mı yoksa yeni fırın mı kuracağıdır.' },
          { id: 'C', label: 'Bedelli açıklayan hisse kesinlikle 10 gün tavan gider.', isOptimal: false, why: 'Bedelli nakit çıkışı gerektirdiği için kısa vadede genellikle baskı yaratır; tavan garantisi tamamen şehir efsanesidir.' },
          { id: 'D', label: 'Bedelsiz ile bedelli aynı şeydir, cebimden para çıkmaz.', isOptimal: false, why: 'Bedelsizde cebinden 0 ₺ çıkar; bedellide yeni pay almak için nakit yatırman (veya rüçhan kuponunu satman) gerekir.' }
        ],
        consequence100k: 'Sürekli zarar edip borç kapatan bedelliye para koyanlar 2 yılda %40 reel erirken, ihracat fabrikası kuran verimli şirketlerin ortakları kârını katladı.',
        proRule: 'Uzman Kuralı: KAP’ta bedelli haberi gördüğünde açacağın ilk PDF "Sermaye Artırımından Elde Edilecek Fonun Kullanım Yeri Raporu"dur!',
        linkedKeys: ['bist-sasa', 'bist-hekts', 'bist-froto']
      },
      {
        id: 'case_30_insurance_float_high_rates',
        category: 'Sektör Terazisi',
        difficulty: 'Uzman',
        title: 'Vaka 30: Faizler %36–%40 İken Sigorta Şirketleri Neden Para Basar?',
        situation: 'Yüksek faiz ortamında birçok sanayi şirketi kredi faizi ödemekten zorlanırken, Türkiye’nin büyük sigorta şirketleri (TURSG, ANSGR, AGESA) rekor kârlar açıklıyor. Warren Buffett’ın da en sevdiği bu iş modelinin sırrı ne?',
        question: 'Yüksek faizde sigorta şirketinin kasasını dolduran gizli motor hangisidir?',
        choices: [
          { id: 'A', label: 'Sigorta şirketleri hiç hasar ödemez.', isOptimal: false, why: 'Hasar öderler; hatta bazen sadece poliçe gelirinden teknik zarar bile yazabilirler — asıl motor başka yerdedir.' },
          { id: 'B', label: 'Teknik Karşılık Havuzu (Float)! Kasko, trafik ve sağlık primlerini müşteriden peşin toplarlar; hasar ödenene kadar geçen aylarda bu dev bedava nakdi %36–40 faizli mevduat/sukuk/PPF’de çalıştırıp devasa finansal gelir yazarlar!', isOptimal: true, why: 'Buffett’ın 60 yıllık servet formülü! Faiz yüksekken borçlu sanayici ezilir, elinde dev nakit havuzu (float) tutan sigortacı adeta para basar.' },
          { id: 'C', label: 'Sigorta şirketleri döviz borçlandığı için kazanır.', isOptimal: false, why: 'Sigortacılar döviz borçlanmaz; TL/döviz prim havuzunu likit faiz/tahvil enstrümanlarında değerlendirir.' },
          { id: 'D', label: 'Faiz düştükçe sigorta şirketlerinin faiz geliri artar.', isOptimal: false, why: 'Tam tersi: Faizler hızlı düşmeye başladığında sigortacıların yeni yatırım getirisi azalır, bu kez tahvil değer artışı ve bankalar öne geçer.' }
        ],
        consequence100k: 'Yüksek faiz kışında herkes sanayide sıkışırken, TSB aylık primlerini ve float gücünü okuyup sigorta kalesine girenler enflasyonu ikiye katladı.',
        proRule: 'Uzman Kuralı: Sigorta sektöründe her ay Türkiye Sigorta Birliği (TSB) prim üretimini ve bilançodaki "Yönetilen Nakit Havuzu × Piyasa Faizi" çarpımını takip et!',
        linkedKeys: ['bist-tursg', 'bist-ansgr', 'bist-agesa']
      },
      {
        id: 'case_31_asymmetric_loss_math',
        category: 'Risk & Sepet Matematiği',
        difficulty: 'Temel',
        title: 'Vaka 31: Tüm Yumurtaları Tek Sepete Koyup Düşürmenin Acı Matematiği',
        situation: 'İki komşu 1.000.000 ₺ ile başlıyor. Biri tüm parasını (%100) çok güvendiği tek bir hisseye koyuyor; diğeri 4 ayrı sepete (%35 %0 Vergili Sukuk, %25 Fiziki Altın, %25 Nakit Basan 3 Büyük Şirket, %15 Yabancı Endeks) bölüyor. Beklenmedik sektör kriziyle o tek hisse -%50 düşüyor!',
        question: 'Tek sepetteki 1.000.000 ₺’si 500.000 ₺’ye inen kişinin SADECE eski 1.000.000 ₺’sine geri dönmesi için hissesinin yüzde kaç yükselmesi gerekir?',
        choices: [
          { id: 'A', label: 'Yüzde 50 düşmüşse yüzde 50 çıkınca eski parama dönerim.', isOptimal: false, why: 'En ölümcül matematik yanılsaması! 500.000 ₺’nin +%50’si sadece 750.000 ₺ eder — hâlâ 250.000 ₺ zarardasın!' },
          { id: 'B', label: 'Tam +%100 (iki katı!) yükselmesi gerekir! Oysa 4 parçalı dengeli sepette aynı şok toplam parayı sadece -%6 civarı etkiler ve 2 ayda toparlanır.', isOptimal: true, why: 'Kayıp asimetrisini iliklerine kadar kavradın! Büyük kayıplardan kaçınmak, büyük kazanç aramaktan matematiksel olarak çok daha değerlidir.' },
          { id: 'C', label: 'Yüzde 25 çıksa bile eski parasına döner.', isOptimal: false, why: '500.000 ₺’nin +%25’i sadece 625.000 ₺ yapar.' },
          { id: 'D', label: 'Tek sepete koymak her zaman daha güvenlidir çünkü takip etmesi kolaydır.', isOptimal: false, why: 'Tek sepet düştüğünde hem uykun kaçar hem de bir daha ayağa kalkması yıllar sürer.' }
        ],
        consequence100k: 'Tek sepette -%50 düşen kasa 2 yıl boyunca sadece eski yerine dönmeye uğraşırken, dengeli sepetteki yatırımcı huzurla büyüyüp öne geçti.',
        proRule: 'Uzman Kuralı: Kayıp Asimetrisi — -%10 kayıp için +%11, -%30 için +%43, -%50 için +%100, -%80 için tam +%400 kazanç gerekir! Tek bir varlığa asla kasanın tamamını bağlama.',
        linkedKeys: ['kira-sertifikasi-sukuk', 'gram-altin-spot', 'tefas-mac', 'abd-sp500-spy']
      },
      {
        id: 'case_32_fisher_real_rate_tuik',
        category: 'Enflasyon & Reel Güç',
        difficulty: 'Temel',
        title: 'Vaka 32: "Param %30 Arttı, Zengin Oldum!" İlüzyonu — Ayın 3’ü TÜİK Gerçeği',
        situation: 'Bir yıl boyunca paranı bir yatırımda tuttun ve 1.000.000 ₺’n tam 1.250.000 ₺ oldu (+%25 kazanç!). Ancak aynı 1 yılda TÜİK enflasyonu (market, kira, fatura fiyatları) %30 arttı.',
        question: '1 yılın sonunda gerçekten zenginleştin mi yoksa fakirleştin mi?',
        choices: [
          { id: 'A', label: 'Cebimde 250.000 ₺ daha fazla para var, kesinlikle %25 zenginleştim!', isOptimal: false, why: 'Nominal (rakam) yanılsaması! Geçen yıl 1.000.000 ₺’ye aldığın sepet bugün 1.300.000 ₺ oldu; yani paran 50.000 ₺ alım gücü kaybetti.' },
          { id: 'B', label: 'Gerçek alım gücüm -%3,85 eridi (fakirleştim)! Çünkü enflasyon %30 iken benim param sadece %25 büyüdü; pazar filesi paramdan hızlı zamlandı.', isOptimal: true, why: 'Ekonominin bir numaralı gerçeği! Fisher Denklemi: (1,25 / 1,30) − 1 = -%3,85. Bu yüzden AETHER’deki tüm grafiklerde "🥖 Alım Gücü (Reel)" düğmesi var!' },
          { id: 'C', label: 'Enflasyon sadece markette olur, yatırımcıyı etkilemez.', isOptimal: false, why: 'Yatırımın tek amacı gelecekte daha fazla mal/hizmet (alım gücü) alabilmektir; enflasyonu yenemeyen her getiri gerçekte kayıptır.' },
          { id: 'D', label: 'En iyisi parayı yastık altında TL nakit tutmak, en azından sayı azalmaz.', isOptimal: false, why: '1.000.000 ₺ boş nakit %30 enflasyonda 1 yılda sessizce ~230.000 ₺ alım gücü kaybeder!' }
        ],
        consequence100k: 'Nominal rakama aldanıp enflasyonun altında kalanlar 3 yılda alım güçlerinin %20’sini sessizce kaybetti; her grafikte Reel Alım Gücü terazisine bakanlar ise gerçek servet kurdu.',
        proRule: 'Uzman Kuralı: Her yatırımın tek gerçek sınavı şudur: "Vergi ve makastan sonra enflasyonu yendi mi?" — AETHER’de her grafiğin altındaki "🥖 REEL" tuşuna mutlaka dokun!',
        linkedKeys: ['kira-sertifikasi-sukuk', 'gram-altin-spot', 'bist-tuprs']
      },
      {
        id: 'case_33_fake_open_auction_0950_lock',
        category: 'Piyasa Fiziği & Mikroyapı',
        difficulty: 'Orta',
        title: 'Vaka 33: Saat 09:46 "Teorik Tavan Eşleşme" İlüzyonu ve 09:50 İptal Kilidi',
        situation: 'Sabah 09:46’da derinlik ekranına bakıyorsun: Sığ bir hisse teorik açılış eşleşmesinde +%9,90 TAVAN görünüyor! Heyecanla serbest (piyasa) alım emri girmeyi düşünüyorsun ama saat 09:49’da büyük oyuncu alım emrini bir saniyede siliyor ve saat 09:50:00 oluyor.',
        question: 'Borsa İstanbul açılış emir toplama kurallarına göre saat 09:50–09:55 arasında ne olur ve doğru savunma nedir?',
        choices: [
          { id: 'A', label: 'Saat 09:52’de fikir değiştirip emrimi iptal ederim, nasıl olsa seans 10:00’da başlıyor.', isOptimal: false, why: 'Borsa İstanbul kuralı: Saat 09:50:00 olduğu saniye emir iptali, miktar azaltma ve fiyat kötüleştirme KİLİTLENİR! 09:55 eşleşmesine kadar elin kolun bağlı kalır.' },
          { id: 'B', label: 'Teorik tavan göründüyse kesin tavan açar, tüm nakdimle piyasa emri yollarım.', isOptimal: false, why: '09:40–09:49 arasındaki sahte alım emirleri (spoofing) tam olarak acemileri içeri çekmek için yazılır ve 09:49:55’te silinir!' },
          { id: 'C', label: '09:40–09:49 arasındaki teorik eşleşmeye asla güvenmem; açılışa emir yazacaksam yalnızca razı olduğum fiyattan LİMİT EMİR kullanırım veya 10:00 sürekli seansın oturmasını beklerim.', isOptimal: true, why: 'Tam isabet! Limit emir seni sahte eşleşme tuzaklarından korur; 10:00 sonrası gerçek hacim ve kademe görülür.' },
          { id: 'D', label: 'Açılış eşleşmesine sadece kredili emir girilir.', isOptimal: false, why: 'Tam tersine, açılış oynaklığında kredili piyasa emri en tehlikeli kombinasyondur.' }
        ],
        consequence100k: '09:47’de tavan görünümüne serbest emirle atlayan yatırımcı 09:55 eşleşmesinde yukarıdan malı kucağında bulup gün sonunda -%6,4 (-6.400 ₺) zarar yazdı.',
        proRule: 'Uzman Kuralı: BIST Pay Piyasası 09:40–09:55 emir toplar; 09:50–09:55 arası emir iptali YASAKTIR. Eşleşme seanslarına asla fiyatsız (Piyasa) emir gönderilmez!',
        linkedKeys: ['bist-100', 'bist-thyao', 'bist-asels']
      },
      {
        id: 'case_34_salary_dca_vs_lump_peak',
        category: 'Psikoloji & Birikim',
        difficulty: 'Temel',
        title: 'Vaka 34: Her Ayın 15’i Maaş Günü Disiplini vs "En Dibi Bekleyeyim" Tuzağı',
        situation: 'Mert her ayın 15’inde maaşından artan 15.000 ₺ ile borsa düşse de çıksa da hiç aksatmadan sağlam şirket fonu ve fiziki altın topluyor. İş arkadaşı ise "Borsa düşsün en dipten tek seferde gireceğim" diyerek parasını vadesiz hesapta bekletiyor.',
        question: 'Enflasyonist Türkiye piyasasında 2 yılın sonunda neden düzenli maaş günü alımı (Kademeli Alım / DCA) neredeyse her zaman galip gelir?',
        choices: [
          { id: 'A', label: 'Çünkü en dibi kimse bilemez; vadesizde bekleyen para her ay enflasyona erirken, düzenli alan kişi ucuz aylarda daha çok pay toplayıp ortalama maliyetini düşürür.', isOptimal: true, why: 'Mükemmel özet! Kademeli alım (DCA) hem zamanlama stresini sıfırlar hem de düşüş aylarını otomatik olarak "daha fazla adet toplama fırsatına" çevirir.' },
          { id: 'B', label: 'Çünkü ayın 15’inde borsada komisyon alınmaz.', isOptimal: false, why: 'Komisyon her iş günü aynıdır; üstünlük zamanlama hatasını ve enflasyon erimesini önlemesinden gelir.' },
          { id: 'C', label: 'En dibi bekleyen her zaman daha çok kazanır.', isOptimal: false, why: 'Türkiye gibi yüksek enflasyonlu ekonomilerde "dibi beklerken" kaçan trend ve eriyen TL alım gücü en büyük gizli zarardır.' },
          { id: 'D', label: 'Maaş günü sadece kripto alınmalıdır.', isOptimal: false, why: 'Tüm birikimi tek yüksek oynaklıklı varlığa bağlamak yerine dengeli sepete yaymak esastır.' }
        ],
        consequence100k: '24 ay düzenli maaş günü sepeti kuran yatırımcı, "düşsün de alayım" diye vadesizde bekleyen komşusuna reel alım gücünde +%34 fark attı.',
        proRule: 'Uzman Kuralı: Piyasada "en doğru günü yakalamak" (timing) değil, "piyasada geçen süre ve düzenli disiplin" (time in the market) servet inşa eder. Profil -> Maaş Günü ayarından kendi birikim gününü aç!',
        linkedKeys: ['tefas-mac', 'gram-altin-spot', 'kira-sertifikasi-sukuk']
      },
      {
        id: 'case_35_eurobond_2026_400k_coupon_vs_sale',
        category: '2026 Vergi & Mevzuat',
        difficulty: 'Uzman',
        title: 'Vaka 35: Türkiye Cumhuriyeti Eurobond’unda Kupon Vergisi (400 Bin ₺ Sınırı) vs Erken Satış',
        situation: '2026 yılında portföyündeki T.C. Dolar Eurobond’undan yılda 310.000 ₺ karşılığı kupon (faiz) geliri elde ettin ve başka beyana tabi gelirin yok. Ancak aynı yıl başka bir yatırımcı Eurobond’unu vadesini beklemeden kur fırlamışken satıp 310.000 ₺ alım-satım kârı yazdı.',
        question: '2026 Türkiye vergi mevzuatına göre bu iki yatırımcının vergi durumu arasındaki kritik fark nedir?',
        choices: [
          { id: 'A', label: 'İkisi de %17,5 stopaj öder, beyanname ikisine de gerekmez.', isOptimal: false, why: 'Eurobondlarda banka stopajı %0’dır; vergilendirme stopajla değil beyanname kurallarıyla yürür!' },
          { id: 'B', label: 'Eurobond KUPON gelirinde 2026 beyan sınırı 400.000 ₺’dir; 310.000 ₺ kupon alan 0 ₺ vergi öder! Oysa vadeden önce SATIŞ kârında istisna sınırı yoktur (sadece Yİ-ÜFE ≥ %10 endekslemesi vardır), ilk liradan beyana tabidir!', isOptimal: true, why: 'Gerçek bir vergi ustası cevabı! Eurobond kuponu GVK 103 ikinci dilim sınırının (2026: 400.000 ₺) altındaysa beyan edilmez; fakat erken satış kazancı GVK Mük. 80 kapsamında istisnasız beyana tabidir!' },
          { id: 'C', label: 'Eurobond kuponu tamamen vergisizdir, 10 milyon ₺ kupon alınsa bile beyan edilmez.', isOptimal: false, why: '2026’da yıllık brüt kupon toplamı 400.000 ₺’yi aşarsa tamamı gelir vergisi beyannamesine girer.' },
          { id: 'D', label: 'Eurobond vadesinde itfa olunca da kur farkı vergisi ödenir.', isOptimal: false, why: 'Çok önemli detay: Eurobond vade sonuna (itfaya) kadar tutulursa anapara kur farkından 0 ₺ vergi doğar; vergi yalnızca vadeden önce satılırsa doğar!' }
        ],
        consequence100k: 'Kupon sınırını ve itfa kuralını bilen yatırımcı %5,8 dolar getirisini 0 ₺ vergiyle cebine koyarken, kur fırladığında bilmeden erken satan yatırımcı Mart ayında kademeli gelir vergisi sürpriziyle karşılaştı.',
        proRule: 'Uzman Kuralı: Eurobond 3 Altın Kuralı (2026): 1) Stopaj %0’dır. 2) Kupon geliri 400.000 ₺ altındaysa beyan yok! 3) İtfaya (vade sonuna) kadar tutarsan kur farkı vergisi 0 ₺; erken satarsan Yİ-ÜFE ≥ %10 endekslemesini kontrol et!',
        linkedKeys: ['eurobond-usdtr', 'eurobond-emb', 'kira-sertifikasi-sukuk']
      },
      {
        id: 'case_36_arife_half_day_holiday_margin_trap',
        category: 'Piyasa Fiziği & Kaldıraç',
        difficulty: 'Orta',
        title: 'Vaka 36: Bayram Arifesi Saat 12:40 Kapanışı ve 9 Günlük Tatil Kredi Faizi Tuzağı',
        situation: 'Ramazan veya Kurban Bayramı arifesi (yarım gün seans: 12:40 kapanış). Bir yatırımcı "Bayramdan sonra borsa tavan açar!" diyerek saat 12:20’de 500.000 ₺ aracı kurum kredisi (yıllık %55 faiz) kullanıp hisse alıyor; diğer yatırımcı ise arife günü hisse satıp bayram harçlığı çekmek istiyor.',
        question: 'Türkiye resmi takvim ve Takasbank kurallarına göre bu iki kişiyi hangi sürpriz bekler?',
        choices: [
          { id: 'A', label: 'Bayramda borsa kapalı olduğu için kredi faizi işlemez; arife günü satılan hissenin parası da öğleden sonra çekilir.', isOptimal: false, why: 'İkisi de yanlış! Takvim günleri boyunca kredi faizi her gün işler ve T+2 takası sadece "iş günlerinde" ilerler!' },
          { id: 'B', label: 'Arife günü saat 13:00’ten akşam 18:00’e kadar seans normal devam eder.', isOptimal: false, why: 'Arife günleri Borsa İstanbul sürekli seansı 12:30’da biter, 12:35 eşleşmesi ve 12:40 kapanışıyla tahtalar tamamen kapanır!' },
          { id: 'C', label: 'Kredili hisse taşıyan kişi 9 günlük bayram tatilinin tamamında (borsa kapalıyken bile!) takvim günü üzerinden ~6.780 ₺ kesin faiz öder; arife günü hisse satanın T+2 nakdi ise ancak bayram bitip 2 iş günü geçtikten sonra çekilebilir!', isOptimal: true, why: 'Kusursuz saha bilgisi! Tatil öncesi nakit ihtiyacı olan satışını arifeden en az 2 iş günü önce yapar; tatil boyunca yüksek faizli kredi taşınmaz!' },
          { id: 'D', label: 'Bayramda VİOP akşam seansı açık kalır.', isOptimal: false, why: 'Arife yarım günlerinde (12:40 sonrası) ve resmi tatillerde VİOP akşam seansı yapılmaz.' }
        ],
        consequence100k: '9 günlük bayram tatiline kredili giren yatırımcı daha seans açılmadan net -%1,35 kesin faiz maliyetiyle başladı; bayram nakdini 2 iş günü önceden ayarlayan yatırımcı ise parasını %0 vergili Sukuk/PPF’de tatil boyunca çalıştırdı.',
        proRule: 'Uzman Kuralı: Uzun tatillerden önce iki şey kontrol edilir: 1) Nakit lazım olacaksa T+2 takas süresi tatilden 2 iş günü önce biter. 2) Tatilde kredi borcu her takvim günü faiz yazar, mevduat/PPF/Sukuk ise her takvim günü getiri yazar!',
        linkedKeys: ['para-piyasasi-fonu', 'kira-sertifikasi-sukuk', 'bist-100']
      },
      {
        id: 'case_37_holding_nav_discount_solo_cash',
        category: 'Değerleme & Sektör Terazisi',
        difficulty: 'Uzman',
        title: 'Vaka 37: Holding İskontosu: "İçindeki Fabrikalar 100 Milyar, Holding Borsada 58 Milyar!"',
        situation: 'Borsa İstanbul’da iki büyük holding inceliyorsun. İkisi de iştiraklerinin toplam değerine (Net Aktif Değer - NAD) göre -%40 iskontolu işlem görüyor. Ancak A Holding’in kendi merkez kasasında (Solo Bilanço) +1,2 Milyar $ net nakit var ve iştirakleri her yıl düzenli temettü ödüyor; B Holding’in ise solo merkezinde ağır döviz borcu var.',
        question: 'Usta bir değer yatırımcısı bu iki holding arasındaki farkı nasıl okur?',
        choices: [
          { id: 'A', label: 'İkisi de -%40 iskontoluysa ikisi de aynı derecede ucuzdur.', isOptimal: false, why: 'Solo merkezde borç taşıyan holdinglerde iştiraklerden gelen temettü ortaklara ulaşmadan faize gider; iskonto "kronik değer tuzağına" dönüşebilir.' },
          { id: 'B', label: 'Holding analizinde tek başına NAD iskontosu yetmez; "Solo Net Nakit Kasası + İştiraklerden Merkeze Akan Düzenli Temettü + Geri Alım Politikası" birleşen A Holding gerçek değer kalesidir!', isOptimal: true, why: 'Kurumsal analist düzeyi! Solo kasası döviz dolu olan holding kriz dönemlerinde zordaki şirketleri ucuza toplar ve kendi paylarını geri alarak iskontoyu daraltır.' },
          { id: 'C', label: 'Holding yerine her zaman en küçük yan tahtası alınır.', isOptimal: false, why: 'Solo nakit kalesi ve çeşitlendirilmiş temettü akışı holdingi fırtınalarda çok daha dayanıklı kılar.' },
          { id: 'D', label: 'Holdinglerde sadece F/K oranına bakılır.', isOptimal: false, why: 'Konsolide enflasyon muhasebesi F/K’yı çarpıtır; holdingin gerçek terazisi NAD İskontosu + Solo Net Nakittir.' }
        ],
        consequence100k: 'Solo net nakdi güçlü holding hem kur şokunda döviz kasasıyla korundu hem de düzenli temettü dağıttı; borçlu holdingin iskontosu ise -%55’e açıldı.',
        proRule: 'Uzman Kuralı: Holding Terazisi = 1) NAD İskontosu (%35+ tarihsel ucuzluk) + 2) Solo Net Nakit Pozisyonu + 3) İştiraklerin nakit temettü üretme kapasitesi.',
        linkedKeys: ['bist-kchol', 'bist-sahol', 'bist-enkai']
      },
      {
        id: 'case_38_gtip_export_unit_value_usd_kg',
        category: 'Saha Öncüsü & Makro',
        difficulty: 'Uzman',
        title: 'Vaka 38: Bilançodan 45 Gün Önce TÜİK Gümrük Verisi: "Tonaj Arttı Ama Kâr Neden Çöktü?"',
        situation: 'TÜİK aylık dış ticaret verisinde (12 haneli GTİP kodu) iki ihracatçı sektörü inceliyorsun. X sektöründe ihraç edilen tonaj +%25 artmış ama kilogram başına ihracat fiyatı (USD/kg) $4,20’den $3,10’a düşmüş. Y sektöründe (güç trafosu / savunma elektroniği) ise hem tonaj +%18 artmış hem de USD/kg fiyatı $14’ten $19’a çıkmış!',
        question: '45 gün sonra açıklanacak çeyrek bilançolarda bu iki sektörde nasıl bir tablo görürsün?',
        choices: [
          { id: 'A', label: 'X sektörü daha çok mal sattığı için kâr marjı rekor kırar.', isOptimal: false, why: 'Fiyat kırarak (damping / Çin rekabetiyle) tonaj artıran şirketin cirosu şişse bile brüt kâr marjı erir!' },
          { id: 'B', label: 'Y sektöründeki şirketler (hem tonaj hem USD/kg birim değeri artanlar) katma değerli fiyatlama gücü sayesinde brüt marj ve FAVÖK patlaması açıklar; X sektöründe ise fiyat rekabeti marjları ezer!', isOptimal: true, why: 'Tam bir saha istihbaratçısı! USD/kg birim ihracat değeri, bir fabrikanın dünyadaki fiyatlama gücünün (pricing power) en saf resmi kanıtıdır.' },
          { id: 'C', label: 'Gümrük verileri bilançoyla hiç ilişkili değildir.', isOptimal: false, why: 'İhracatçı sanayi şirketlerinin faturaları gümrük beyannamesi kapandıktan sonra çeyrek bilançosuna doğrudan yansır.' },
          { id: 'D', label: 'Sadece sosyal medyadaki fabrika fotoğraflarına bakmak yeterlidir.', isOptimal: false, why: 'Fotoğraf marjı göstermez; TÜİK 12 haneli GTİP verisi kuruşu kuruşuna dolar ve kilogram gösterir.' }
        ],
        consequence100k: 'GTİP USD/kg artışını bilançodan 40 gün önce yakalayan yatırımcı yüksek marjlı ihracatçıda +%28 getiri elde ederken, emtia fiyat kırılması yaşayan sektörde bilanço gecesi satış geldi.',
        proRule: 'Uzman Kuralı: İhracatçıda Sihirli Çarpım = Tonaj × Birim Fiyat (USD/kg). İkisi aynı anda yükseliyorsa çeyrek bilançoda sürpriz FAVÖK büyümesi kapıdadır (Pusula -> Gümrük & BDDK masasında canlı izle!).',
        linkedKeys: ['reel-enerji-astor', 'bist-asels', 'bist-froto']
      },
      {
        id: 'case_39_working_capital_ccc_trap',
        category: 'Bilanço & Kasa Kalitesi',
        difficulty: 'Orta',
        title: 'Vaka 39: Neden Bazı Marketler Eksi (-30 Gün) Sermayeyle Büyürken Bazı Şirketler Büyürken Batar?',
        situation: 'A Şirketi malı peşin satıp tedarikçisine parasını 60 gün sonra ödüyor (Nakit Dönüşüm Süresi: -35 gün). B Şirketi ise hammaddeyi peşin alıyor, 90 gün depoda tutuyor, müşteriye 120 gün veresiye satıyor (Nakit Dönüşüm Süresi: +180 gün) ve yüksek faiz döneminde ciroyu 2 katına çıkarıyor!',
        question: 'Faizlerin %45–55 olduğu bir yılda bu iki şirketin kasasına ne olur?',
        choices: [
          { id: 'A', label: 'B Şirketi ciroyu 2 katına çıkardığı için kasası parayla dolar.', isOptimal: false, why: '+180 gün nakit döngüsüyle büyüyen şirket her yeni satışta 6 ay boyunca cebinden işletme sermayesi fonlamak zorunda kalır; yüksek faizde banka kredisine boğulur!' },
          { id: 'B', label: 'A Şirketi (negatif nakit döngüsü) yeni şube açtıkça tedarikçi parasıyla bedava büyür ve kasadaki peşin parayı günlük faizde çalıştırır; B Şirketi ise büyüdükçe nakit açığına düşüp faiz giderine ezilir!', isOptimal: true, why: 'İşletme sermayesi ustalığı! Perakende ve önden avans alan şirketlerin yüksek faiz/enflasyon dönemlerinde neden "nakit kalesi" olduğunun tam sırrı budur.' },
          { id: 'C', label: 'Veresiye süresinin şirket kasasıyla hiçbir ilgisi yoktur.', isOptimal: false, why: 'Enflasyonda 120 gün vadeli tahsil edilen her TL alacak erir ve finansman açığı doğurur.' },
          { id: 'D', label: 'Stokta ne kadar çok mal beklerse o kadar iyidir.', isOptimal: false, why: 'Yavaş dönen stok hem depolama/finansman maliyeti yazar hem de demode olma riski taşır.' }
        ],
        consequence100k: 'Negatif işletme sermayeli perakende devi hem enflasyonu anında etikete yansıttı hem de sıfır krediyle büyüdü; 180 gün vadeli çalışan şirket ise tüm faaliyet kârını banka faizine verdi.',
        proRule: 'Uzman Kuralı: Nakit Dönüşüm Süresi (CCC) = Stok Gün + Alacak Tahsil Gün − Ticari Borç Ödeme Gün. Bu sayı ne kadar düşük (hatta negatif!) ise şirketin büyümesi o kadar az nakit yakar.',
        linkedKeys: ['reel-perakende-bimas', 'bist-mgros', 'bist-asels']
      },
      {
        id: 'case_40_rate_cut_bond_duration_vs_ppf',
        category: 'Makro & Sabit Getiri',
        difficulty: 'Uzman',
        title: 'Vaka 40: Merkez Bankası Faiz İndirim Döngüsü Başladığında PPF mi, Sabit Kuponlu Tahvil/Sukuk mu?',
        situation: 'Enflasyon düşüşe geçiyor ve Merkez Bankası’nın önümüzdeki 12 ayda politika faizini %38’den %24’e indireceği öngörülüyor. Bir yatırımcı tüm parasını günlük Para Piyasası Fonunda (PPF) tutuyor; diğeri ise yıllık %36,5 sabit oranlı uzun vadeli %0 stopajlı Hazine DİBS / Kira Sertifikasını kilitliyor.',
        question: 'Faiz indirim döngüsü ilerledikçe bu iki yatırımcının getirisi nasıl ayrışır?',
        choices: [
          { id: 'A', label: 'PPF oranı sonsuza kadar %39 kalır, hiç düşmez.', isOptimal: false, why: 'PPF gecelik repo/mevduat taşır! TCMB faiz indirdiği günün ertesinde PPF’nin günlük getirisi de anında aşağı iner (Yeniden Yatırım Riski)!' },
          { id: 'B', label: 'Faiz indikçe PPF’nin günlük getirisi her toplantıda erirken (Yeniden Yatırım Riski), yüksek orandan sabitlenen %0 vergili DİBS/Sukuk hem yüksek kuponunu korur hem de tahvil fiyatı ikincil piyasada ekstra değer kazanır!', isOptimal: true, why: 'Tahvil matematiğinin (Duration) altın kuralı! Piyasa faizleri düşerken, elindeki eski yüksek faizli tahvilin değeri tahterevalli gibi yukarı fırlar!' },
          { id: 'C', label: 'Faiz düşerken sabit kuponlu tahvilin fiyatı düşer.', isOptimal: false, why: 'Tam tersi! Faiz ile tahvil fiyatı ters yönlüdür: Faiz yükselirken tahvil fiyatı düşer; faiz düşerken tahvil fiyatı yükselir!' },
          { id: 'D', label: 'Faiz indirimi sadece dövizi düşürür.', isOptimal: false, why: 'Faiz indirimi döngüsünde kısa vadeli mevduat/PPF getirisi daralırken uzun vadeli sabit tahviller, bankalar ve GYO’lar güçlenir.' }
        ],
        consequence100k: 'Faiz zirvesinde %0 stopajlı sabit Hazine kağıdını kilitleyen yatırımcı hem yüksek kupon hem de anapara değer artışı kazanırken, sadece günlük PPF’de kalanın getirisi her faiz indiriminde eridi.',
        proRule: 'Uzman Kuralı: Faiz artırımı döngüsünde kısa vade (PPF) kraldır; faiz indirimi döngüsü başlarken ise uzun vadeli sabit oranlı (%0 stopajlı DİBS/Sukuk) ve faize duyarlı hisseler öne geçer!',
        linkedKeys: ['dibs-tahvil', 'kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'bist-garan']
      },
      {
        id: 'case_41_bes_2026_10811_befas',
        category: '2026 Vergi & Mevzuat',
        difficulty: 'Temel',
        title: 'Vaka 41: 2026 BES (%20 Devlet Katkısı) — Standart Fonda Unutmak vs BEFAS Fon Yönetimi',
        situation: '1 Ocak 2026 itibarıyla 10811 Sayılı Kararla BES devlet katkısı %20 (yıllık tavan 396.360 ₺ katkıya maks 79.272 ₺) olarak uygulanıyor. İki arkadaş her ay 15.000 ₺ BES ödüyor: Biri 10 yıl boyunca varsayılan standart fonda hiç bakmadan bekliyor; diğeri yılda 2–3 kez BEFAS üzerinden Altın, Yerli Hisse ve Borçlanma fonlarını dönemine göre dengeliyor.',
        question: '10 yıl sonunda iki birikim arasındaki dev farkın asıl sebebi nedir?',
        choices: [
          { id: 'A', label: 'BES’te tüm fonlar aynı getiriyi verir; sadece devlet katkısı fark yaratır.', isOptimal: false, why: 'En büyük yanılgı! Standart fonlar çoğu yıl enflasyonun altında kalırken, BEFAS altın/hisse fonları bileşik getiriyle birikimi katlar.' },
          { id: 'B', label: 'BES bir varlık değil vergi ve %20 devlet katkısı kabuğudur: İçerideki BEFAS fon dağılımını aktif yöneten yatırımcı hem %20 devlet katkısını alır hem de enflasyon üstü bileşik büyümeyle milyonlarca lira öne geçer!', isOptimal: true, why: 'Kusursuz tespit! Yılda 12 kez fon dağılım değişikliği hakkın var; üstelik 10 yıl + 56 yaş şartında devlet katkısının %100’ünü hak edip sadece %5 getiri stopajıyla çıkarsın.' },
          { id: 'C', label: 'BES’ten 2. yılda çıkılırsa devlet katkısının tamamı ödenir.', isOptimal: false, why: 'İlk 3 yıl içinde çıkışta devlet katkısı hak edişi %0’dır; 3–6 yıl %15, 6–10 yıl %35, 10+ yıl %60, 10 yıl + 56 yaş %100’dür.' },
          { id: 'D', label: '2026 yılında BES devlet katkısında üst limit yoktur.', isOptimal: false, why: '2026 yıllık brüt asgari ücret (396.360 ₺) tavanına kadar %20 = maksimum 79.272 ₺ devlet katkısı alınır; fazlası ertesi yıla devreder.' }
        ],
        consequence100k: '10 yılda standart fonda unutulan BES reel değerini zar zor korurken, BEFAS Altın+Hisse dengesi kuran katılımcı aynı aylık taksitle 2,1 kat daha büyük reel emeklilik havuzu kurdu.',
        proRule: 'Uzman Kuralı: BES açtığın gün ilk işin BEFAS fon dağılımını kurmak olsun (Ustalık -> Atölye -> 2026 BES Motoru ile kendi rakamını hesapla!).',
        linkedKeys: ['bes-emeklilik', 'bist-agesa', 'gram-altin-spot']
      },
      {
        id: 'case_42_dividend_2026_800k_exemption',
        category: '2026 Vergi & Mevzuat',
        difficulty: 'Uzman',
        title: 'Vaka 42: 2026 Temettü Beyanı — "800.000 ₺ Brüt Temettüde Ek Vergi Sıfır, Hatta İade Bile Olabilir!"',
        situation: '2026 yılında BIST şirketlerinden toplam 700.000 ₺ brüt temettü kazandın; şirketler kaynağında %15 stopaj (105.000 ₺) kesip hesabına net 595.000 ₺ yatırdı. Başka beyana tabi gelirin yok. Bir arkadaşın "Çok temettü aldın, Mart ayında devlete ağır ek vergi ödeyeceksin!" diye telaşlanıyor.',
        question: '2026 GVK Md. 22 ve Md. 103 kurallarına göre gerçek durum nedir?',
        choices: [
          { id: 'A', label: '700.000 ₺ brüt temettünün yarısı (%50 = 350.000 ₺) vergiden istisnadır; kalan 350.000 ₺, 2026 beyan sınırı olan 400.000 ₺’nin altında kaldığı için beyanname VERİLMEZ ve ek vergi 0 ₺’dir!', isOptimal: true, why: 'Tam isabet! 2026’da başka beyan gelirin yoksa brüt 800.000 ₺ (net 680.000 ₺) temettüye kadar 0 ₺ beyanname vergisi vardır; üstünde bile kesilen %15 stopajın TAMAMI mahsup edilir!' },
          { id: 'B', label: 'İlk 100.000 ₺’den sonra tüm temettüler %40 vergilendirilir.', isOptimal: false, why: 'Yanlış! Hem %50 istisna hem 400.000 ₺ 2. dilim eşiği hem de %15 stopajın tamamının mahsubu vardır.' },
          { id: 'C', label: 'Temettü stopajı %0’dır, hiç kesinti olmaz.', isOptimal: false, why: '9286 Sayılı Kararla gerçek kişi kâr payı stopajı %15’tir.' },
          { id: 'D', label: 'Brüt 850.000 ₺ temettü alan kişi %15 stopajını geri mahsup edemez.', isOptimal: false, why: 'Tam tersine: Beyan sınırını az aştığında, kesilen %15 stopajın tamamı (127.500 ₺) hesaplanan vergiden (77.250 ₺) büyük çıkıp vergi İADESİ bile doğurabilir!' }
        ],
        consequence100k: 'GVK 22 istisnasını bilen temettü yatırımcısı korkup sağlam ortaklıklarını satmadı; hatta 900.000 ₺ brüt temettü beyan ettiğinde fazla kesilen stopajdan vergi iadesi aldı!',
        proRule: 'Uzman Kuralı: 2026 Temettü Sınırı = Brüt 800.000 ₺ (Net 680.000 ₺). Ustalık -> Atölye -> 2026 Vergi Merkezinde kendi temettü tutarını anında test et!',
        linkedKeys: ['bist-tuprs', 'bist-froto', 'bist-isctr']
      },
      {
        id: 'case_43_limit_order_thin_book_slippage',
        category: 'Piyasa Fiziği & Kaldıraç',
        difficulty: 'Temel',
        title: 'Vaka 43: Sığ Tahtada 5 Kademe Derinlik ve Piyasa Emri Kayması (Slippage)',
        situation: 'Günlük işlem hacmi düşük (sığ) bir BIST hissesi 42,00 ₺ görünüyor. Satış tarafındaki 5 kademede 42,02’de sadece 200 lot, 42,10’da 400 lot, 42,80’de 1.500 lot var. Sen tek seferde 250.000 ₺’lik "Piyasa Emri (Serbest Fiyat)" gönderiyorsun.',
        question: 'Borsa eşleşme motoru bu emrini hangi fiyattan gerçekleştirir?',
        choices: [
          { id: 'A', label: 'Tamamını ekranda gördüğün 42,00 ₺’den verir.', isOptimal: false, why: 'Ekrandaki son fiyat sadece geçmiş işlemdir; satış kademelerinde yeterli lot yoksa emrin tahtayı süpürerek yukarı tırmanır!' },
          { id: 'B', label: 'Satış kademelerindeki tüm ucuz lotları süpürüp 42,80–43,90 ₺ bandına kadar pahalıdan eşleşir; daha aldığın saniye -%3 ila -%5 zararla başlarsın! Çözüm: 5 Kademeyi kontrol edip LİMİT EMİR vermektir.', isOptimal: true, why: 'Saha ustası refleksi! Sığ tahtada serbest emir vermek açık çek imzalamaktır. Limit emir koyarsan senin belirlediğin fiyatın 1 kuruş üstünden mal alınmaz!' },
          { id: 'C', label: 'Borsa İstanbul fazla lotu kendi kasasından 42,00 ₺’ye tamamlar.', isOptimal: false, why: 'Borsa yalnızca alıcı ve satıcı emirlerini eşleştirir; kendi kasasından hisse vermez.' },
          { id: 'D', label: 'Emir otomatik olarak iptal edilir.', isOptimal: false, why: 'Piyasa emri tavan fiyatına kadar bulduğu bütün satıcılarla eşleşir.' }
        ],
        consequence100k: 'Sığ tahtaya serbest emir gönderen yatırımcı tek tıkta %3,8 (-3.800 ₺) kademe kayması yaşarken, Limit Emir kullanan yatırımcı istediği fiyattan temiz maliyetle girdi.',
        proRule: 'Uzman Kuralı: İşlem tuşuna basmadan önce 5 Kademe Tahta Derinliğine bak; sığ tahtada ASLA piyasa emri değil LİMİT EMİR kullan! AETHER Al/Sat ekranında Limit Emir aktif.',
        linkedKeys: ['bist-tuprs', 'bist-100', 'bist-thyao']
      },
      {
        id: 'case_44_stop_loss_vs_hope_anchoring',
        category: 'Psikoloji & Birikim',
        difficulty: 'Orta',
        title: 'Vaka 44: Zarar Kes (Stop-Loss) Disiplini vs "Maliyetime Gelsin Satacağım" Çıpası',
        situation: 'Yüksek büyüme beklentisiyle aldığın şirketin bilançosu bozuldu: Esas faaliyet nakdi negatife döndü, borçlar katlandı ve hisse alış fiyatın olan 100 ₺’den 78 ₺’ye indi. İçinden bir ses "78’den satmam, tekrar 100 ₺ olsun başabaş çıkayım" diyor.',
        question: 'Davranışsal finans ve sermaye koruma açısından en sağlıklı karar hangisidir?',
        choices: [
          { id: 'A', label: 'Hisse 100 ₺’ye dönene kadar 5 yıl bile olsa beklemek; satmadıkça zarar gerçek olmaz.', isOptimal: false, why: '"Satmadıkça zarar olmaz" en tehlikeli bilişsel illüzyondur: Hem temel bozulursa hisse 30 ₺’ye inebilir hem de %30 enflasyonda 3 yıl beklemek sermayenin yarısını sessizce eritir!' },
          { id: 'B', label: 'Alış fiyatını (100 ₺) unut; "Bugün elimde nakit 78.000 ₺ olsa bu bozulmuş bilançolu şirketi alır mıydım?" diye sor. Cevap HAYIR ise Zarar Kes uygulayıp sermayeyi nakit basan sağlam kaleye taşı!', isOptimal: true, why: 'Mükemmel zihinsel berraklık! Piyasa senin alış maliyetini bilmez ve umursamaz. Temel tezi bozulmuş pozisyonu küçük zararda kesmek, büyük enkazı önler.' },
          { id: 'C', label: 'Kredi çekip 78 ₺’den iki kat daha fazla alarak ortalamayı düşürmek.', isOptimal: false, why: 'Temeli bozulmuş, nakit yakan şirkette borçla ortalama düşürmek batan gemiye ağırlık eklemektir!' },
          { id: 'D', label: 'Sağlam nakit üreten dev bir şirkette her -%2 düşüşte hemen stop olmak.', isOptimal: false, why: 'İnce ayrım: Kasa sağlamsa -%2 gürültüde satılmaz; temel tez bozulduğunda veya risk sınırı aşıldığında disiplinli Zarar Kes çalışır.' }
        ],
        consequence100k: 'Temel bozulmada -%15’te zarar kesip sermayesini sağlam nakit kalesine taşıyan yatırımcı 6 ayda kâra geçerken, "maliyetime gelsin" çıpasına takılanın parası -%62 eridi.',
        proRule: 'Uzman Kuralı: Bir pozisyona girmeden önce hangi koşulda veya hangi fiyatta vazgeçeceğini (Zarar Kes / Tez Bozulma Kuralı) baştan belirle!',
        linkedKeys: ['bist-tuprs', 'kira-sertifikasi-sukuk', 'gram-altin-spot']
      },
      {
        id: 'case_45_decision_11734_corporate_vs_retail_ppf',
        category: '2026 Vergi & Mevzuat',
        difficulty: 'Orta',
        title: 'Vaka 45: 5 Eylül 2026 (11734 Sayılı Karar) — Bireysel vs Kurumsal PPF ve %0 Sukuk Farkı',
        situation: 'Eylül 2026’da 11734 Sayılı Kararla şirketlerin (tüzel kişilerin) Para Piyasası Fonlarındaki %0 stopajı %10’a çıkarıldı; bireysel yatırımcıda PPF stopajı ise %17,5 devam ediyor. Aynı gün elinde 1.000.000 ₺ bireysel nakit var ve 60 gün değerlendirmek istiyorsun.',
        question: 'Brüt %39 veren PPF (%17,5 stopaj) ile brüt %36,5 veren 11444 Kararlı Kamu Sukuk (%0 stopaj) arasında bireysel yatırımcı hangisinde daha fazla net TL kazanır?',
        choices: [
          { id: 'A', label: 'PPF’nin brüt oranı %39 daha yüksek olduğu için her zaman PPF kazanır.', isOptimal: false, why: 'Brüt orana aldanma! %39 × (1 − 0,175) = Net %32,18! Kamu Sukuk’ta ise %0 stopajla brüt = net %36,50!' },
          { id: 'B', label: 'Kamu Sukuk (%0 stopaj) yıllık net %36,5 ile PPF’nin (%17,5 stopaj sonrası net %32,18) yıllık +4,3 puan önüne geçer! 1 milyon ₺’de yılda tam +43.000 ₺ daha fazla net para bırakır!', isOptimal: true, why: 'Vergi sonrası net matematik zaferi! Brüt tabela değil, stopaj kesildikten sonra cebinde kalan net oran kazanır.' },
          { id: 'C', label: '11734 Sayılı Karar bireysel yatırımcının PPF stopajını %0’a indirdi.', isOptimal: false, why: '11734 Sayılı Karar kurumsal/şirket yatırımcıların PPF stopajını %0’dan %10’a yükseltti; bireysel %17,5 devam ediyor.' },
          { id: 'D', label: 'Sukuk ve PPF’nin ikisi de stopaj kesmez.', isOptimal: false, why: 'Bireysel PPF kârından %17,5 stopaj kesilir; 11444 Sayılı Kararla doğrudan Hazine Kamu Sukuk (31.12.2026’ya kadar) %0 stopajlıdır.' }
        ],
        consequence100k: 'Brüt %39 tabelasına aldanmayıp %0 stopajlı Kamu Sukuk seçen yatırımcı 1.000.000 ₺’de 1 yılda fazladan +43.200 ₺ net vergi avantajı sağladı.',
        proRule: 'Uzman Kuralı: Asla brüt faiz/getiri kıyaslama! Her zaman Net Oran = Brüt × (1 − Stopaj) formülünü çalıştır.',
        linkedKeys: ['kira-sertifikasi-sukuk', 'para-piyasasi-fonu', 'dibs-tahvil']
      },
      {
        id: 'case_46_crypto_2026_turkey_rules_risk',
        category: '2026 Vergi & Mevzuat',
        difficulty: 'Orta',
        title: 'Vaka 46: 2026 Türkiye Kripto Çerçevesi — 7/24 Açık Piyasa, Saklama ve Aşırı Oynaklık',
        situation: 'Pazar gecesi saat 23:30’da Borsa İstanbul ve bankalar kapalıyken kripto ekranında bir altcoin +%35 fırlamış. Bir yatırımcı "2026’da kripto işlem vergisi yasalaşmadı, hem 7/24 açık hem vergisiz, tüm 1 milyon liramı buraya basayım!" diyor.',
        question: '2026 Türkiye kripto mevzuatı ve risk yönetimi açısından doğru analiz hangisidir?',
        choices: [
          { id: 'A', label: '27 Mart 2026’da binde 3 işlem vergisi teklifi TBMM’de geri çekildiği için şu an özel kripto işlem vergisi yok; ANCAK SPK lisanslı saklama, uluslararası CARF veri paylaşımı ve -%70’e varan kuyruk riski nedeniyle toplam servetin yalnızca küçük bir dilimi (%5–10 tavanı) ayrılmalıdır!', isOptimal: true, why: 'Dengeli ve güncel 2026 uzman bakışı! Vergi avantajı tek başına aşırı oynaklık riskini yok etmez; hafta sonu 7/24 açık olması gece dürtüsel kumar riskini büyütür.' },
          { id: 'B', label: 'Kripto varlıklar devlet garantisi altındadır ve hiç düşmez.', isOptimal: false, why: 'Kripto varlıklar TMSF/devlet garantisi kapsamında değildir ve tek günde %30–%60 değer kaybedebilir.' },
          { id: 'C', label: 'Hafta sonu borsa kapalıyken tüm nakdi kriptoda değerlendirmek risksizdir.', isOptimal: false, why: 'Hafta sonu likidite daha sığ olduğu için sert ani iğne hareketleri (flash crash) en çok hafta sonu olur.' },
          { id: 'D', label: 'Kripto alım-satımında %17,5 banka stopajı kesilir.', isOptimal: false, why: '2026 itibarıyla yürürlükte özel bir kripto stopajı bulunmamaktadır (ancak ticari süreklilikte genel vergi incelemesi ve SPK/CARF raporlaması geçerlidir).' }
        ],
        consequence100k: 'Pazar gecesi tüm kasasıyla +%35’ten atlayan yatırımcı 48 saatte -%38 (-380.000 ₺) erirken, kriptoyu portföyünün %5’iyle sınırlayan yatırımcı fırtınadan yara almadan çıktı.',
        proRule: 'Uzman Kuralı: Yüksek oynaklıklı varlıklarda kural: Kasanın %5–10’unu aşma, SPK lisanslı platform + soğuk cüzdan güvenliğini gözet, hafta sonu FOMO’suna kapılma.',
        linkedKeys: ['kripto-btc', 'kripto-eth', 'gram-altin-spot']
      },
      {
        id: 'case_47_sloan_accrual_cash_conversion',
        category: 'Bilanço & Kasa Kalitesi',
        difficulty: 'Uzman',
        title: 'Vaka 47: Sloan Tahakkuk & Nakit Dönüşüm Oranı — "İkisi de 5 Milyar ₺ Kâr Açıkladı!"',
        situation: 'Borsa İstanbul’da iki sanayi şirketi aynı gece tam 5 Milyar ₺ net kâr açıkladı. Şirket A’nın Esas Faaliyet Nakdi (OCF) 7,2 Milyar ₺ (Nakit Dönüşüm: 1,44x · Sloan: -%8). Şirket B’nin ise OCF’si -1,4 Milyar ₺ (Nakit Dönüşüm: negatif · Sloan: +%19), yani kârın tamamı yeniden değerleme ve tahsil edilemeyen alacaklardan gelmiş!',
        question: 'Sloan Tahakkuk (Accrual) kanıtına göre 12 ay sonra hangi şirket ortaklarını korur?',
        choices: [
          { id: 'A', label: 'İkisi de 5 Milyar ₺ kâr ettiği için ikisinin kalitesi eşittir.', isOptimal: false, why: 'Akademik ve pratik adli muhasebe kanıtı: Nakit destekli kâr kalıcıdır, yüksek tahakkuklu kağıt kâr ise 2–4 çeyrek içinde geri döner!' },
          { id: 'B', label: 'Şirket A (OCF/Net Kâr > 1,0x ve negatif Sloan) gerçek sıcak para ürettiği için temettü dağıtır ve borçsuz büyür; Şirket B’nin yüksek pozitif Sloan’ı (+%19) yaklaşan kâr çöküşünün erken alarmıdır!', isOptimal: true, why: 'Kurumsal adli bilanço ustalığı! Richard Sloan’ın ünlü tahakkuk keşfi BIST’te özellikle enflasyon muhasebesi döneminde kağıt kâr ile gerçek fırın kasasını şaşmaz biçimde ayırır.' },
          { id: 'C', label: 'Sloan oranının +%20 üstünde olması şirketin çok nakit ürettiğini gösterir.', isOptimal: false, why: 'Tam tersi! Sloan = (Net Kâr − OCF) / Toplam Varlıklar. OCF yüksekse pay negatif çıkar; pozitif yüksek Sloan "kâr var ama nakit yok" uyarısıdır!' },
          { id: 'D', label: 'Nakit akış tablosu sadece bankalar için önemlidir.', isOptimal: false, why: 'Tam tersi: Sanayi, enerji, perakende ve teknoloji şirketlerinde Nakit Akış Tablosu bilançonun kalbidir.' }
        ],
        consequence100k: 'OCF/Net Kâr > 1,0x ve negatif Sloan filtresiyle seçilen şirket temettü ve büyüme getirirken, kağıt kârlı şirket ertesi çeyrek nakit sıkışıklığıyla %44 düştü.',
        proRule: 'Uzman Kuralı: Herhangi bir BIST hissesini açtığında "Kasa -> 5 Soruda Şirket Röntgeni" panelinde Nakit Dönüşüm ve Sloan skorunu 3 saniyede gör!',
        linkedKeys: ['bist-tuprs', 'reel-perakende-bimas', 'bist-tcell']
      },
      {
        id: 'case_48_rebalancing_drift_discipline',
        category: 'Psikoloji & Birikim',
        difficulty: 'Temel',
        title: 'Vaka 48: Sepet Kayması (Drift) & Yılda 2 Kez Mekanik Dengeleme Gücü',
        situation: 'Başlangıçta 1.000.000 ₺’ni huzurlu bir 4’lü sepetle böldün: %35 Sukuk, %25 Altın, %30 Sağlam Hisseler, %10 Nakit. 8 ay sonra borsa çok hızlı ralli yaptı ve hisselerinin payı %30’dan %54’e şişti; diğer ayakların payı küçüldü.',
        question: 'Tam bu noktada profesyonel portföy yöneticisi ne yapar?',
        choices: [
          { id: 'A', label: '"Hisseler uçuyor, Sukuk ve Altını da satıp %100 hisseye gireyim!" der.', isOptimal: false, why: 'Bu en klasik zirve tuzağıdır: En çok yükselmiş varlığa tüm kalkanını bozarak yüklenmek, ilk düzeltmede ağır darbe yemene yol açar.' },
          { id: 'B', label: 'Şişen hisse diliminden yalnızca hedef üstü taşan kârı kırpıp (örn. %54 -> %30’a çekip) geride/ucuz kalmış %0 vergili Sukuk ve Altın ayaklarına aktararak dengeyi tazeler!', isOptimal: true, why: 'Muhteşem disiplin! Portföy Dengeleme (Rebalancing), geleceği tahmin etmeye çalışmadan seni otomatik olarak "pahalıdan kâr al, ucuz kalan kalkanı güçlendir" kuralına zorlar!' },
          { id: 'C', label: 'Tüm portföyü sıfırlayıp vadesiz nakde çeker.', isOptimal: false, why: 'Tamamen nakde çıkmak enflasyon karşısında alım gücünü eritir; sadece taşan ağırlığı dengeye çekmek yeterlidir.' },
          { id: 'D', label: 'Her gün sabah-akşam ağırlıkları %1 için al-sat yapar.', isOptimal: false, why: 'Aşırı sık dengeleme komisyon ve makas yakar; yılda 2 kez veya bir bacak hedeften ±%10 sapınca dengelemek idealdir.' }
        ],
        consequence100k: 'Ralli tepesinde mekanik dengeleme yapıp kârı Sukuk ve Altın kalkanına aktaran yatırımcı, sonraki -%25 borsa düzeltmesinde ucuzdan tekrar sağlam şirket toplayacak nakde sahipti.',
        proRule: 'Uzman Kuralı: Hedef sepet oranların ±%10 kaydığında dengele! Ana Sayfa’daki Sepet Planlayıcı artık mevcut portföyünle hedef plan arasındaki kaymayı canlı hesaplar.',
        linkedKeys: ['kira-sertifikasi-sukuk', 'gram-altin-spot', 'tefas-mac']
      }
    ];
  }

  // --------------------------------------------------------------------------
  // 14. 24 MODÜLLÜK 6-KADEME USTALIK AKADEMİSİ & 84 TERİMLİK SOKAK SÖZLÜĞÜ
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
        rankStage: '1. Kademe · Kasa Gözü',
        title: 'Bilanço Röntgeni: Kağıt Kâr Yalan Söyler, Kasa Nakdi Doğruyu Söyler',
        plainSummary20s: 'Bir dükkânın defterde "çok kazandım" yazması yetmez; önemli olan akşam kasayı açtığında içinde gerçekten nakit para olmasıdır.',
        streetSummary: 'Mahalledeki fırının defterinde "Bu ay 500 bin lira kâr ettik" yazıyor ama kasayı açıyorsun içinde para yok; hepsi veresiye defterinde ve stokta! Borsada da Net Kâr muhasebe görüşüdür, Esas Faaliyet Nakit Akışı (OCF) ise kasaya giren gerçek sıcak paradır.',
        proFormula: 'Altın Formül: Serbest Nakit Akışı (FCF) = Esas Faaliyet Nakdi (OCF) − Yatırım Harcaması (CAPEX). Nakit Dönüşüm Oranı = OCF / Net Kâr (> 1,0x olmalı). Sloan Tahakkuk Oranı = (Net Kâr − OCF) / Toplam Varlıklar (Negatifse kasa çok kalitelidir; +%15 üstüyse makyajlı kâr tehlikesidir!).',
        liveCheck: 'Herhangi bir BIST hissesine dokunup "Fırın Kasası" sekmesini veya Ustalık -> "⚔️ Dedektif" meydanını açarak gerçek bilançolarda test et.',
        sampleKeys: ['bist-tcell', 'bist-bimas', 'bist-enkai', 'bist-tuprs']
      },
      {
        id: 'mod_02_tms29_vuk',
        step: '02',
        rankStage: '1. Kademe · Kasa Gözü',
        title: 'TMS-29 Enflasyon Muhasebesi vs VUK Vergi Dairesi Gerçeği',
        plainSummary20s: 'Enflasyon muhasebesi yüzünden bazen çok sağlam fabrikalar kâğıt üstünde az kâr etmiş gibi görünür; bu yüzden vergi dairesi tablosuna ve kasadaki nakde bakılır.',
        streetSummary: 'Türkiye’de enflasyon muhasebesi (TMS-29) yüzünden borçlu şirket "borcum enflasyonla eridi" diye kağıt üstünde parasal kazanç yazabilirken, özkaynağı ve fabrikası güçlü şirket yüksek amortisman yüzünden kağıt üstünde düşük kâr gösterebilir!',
        proFormula: 'Uzman Sırrı: KAP’a düşen "Vergi Dairesine Sunulan (VUK) Geçici Vergi Beyannamesi" enflasyon muhasebesi makyajı içermez; saf kesilen fatura ve tahsilat gücünü gösterir. OCF ve FAVÖK güçlü olduğu halde TMS-29 yüzünden F/K yüksek görünen şirketler en büyük gizli hazinelerdir!',
        liveCheck: 'Pusula -> Hesap & Mutfak -> "TMS-29 & VUK Kasa" masasından yüzlerce şirketin canlı denetimini incele.',
        sampleKeys: ['bist-tcell', 'bist-thyao', 'bist-petkm']
      },
      {
        id: 'mod_03_sector_scales',
        step: '03',
        rankStage: '2. Kademe · Terazi Ustası',
        title: 'Her Dükkân Aynı Teraziyle Tartılmaz: Sanayi, Banka, Sigorta, GYO ve Holding',
        plainSummary20s: 'Altın kuyumcu terazisiyle, patates kantarla tartılır: Fabrika ile banka veya emlak şirketi aynı ölçüyle kıyaslanmaz.',
        streetSummary: 'Kuyumcu terazisiyle kamyon tartılmaz! Sanayi şirketinde F/K ve FD/FAVÖK bakılır ama bir Banka veya GYO’ya sanayi terazisiyle bakarsan büyük hata yaparsın.',
        proFormula: '5 Sektörün 5 Gerçek Terazisi: 1) Sanayi/Perakende -> FD/FAVÖK (<7x), ROIC (>TÜFE) ve FCF. 2) Banka -> PD/DD ve ROE (ROE > %' + inf.toFixed(0) + ' enflasyon olmalı). 3) Sigorta -> Teknik Karşılık Havuzu (Float) × Faiz + TSB Aylık Prim. 4) GYO -> F/K bakılmaz! Yalnızca PD/DD (NAD İskontosu < 0,65x) ve Kira/Borç bakılır. 5) Holding -> Solo Net Nakit + İştirak NAD İskontosu (%30+).',
        liveCheck: 'Varlık çekmecesindeki "⚔️ Kıyasla" sekmesi iki varlığı yan yana koyup sektöre uygun teraziyle kıyaslar.',
        sampleKeys: ['bist-garan', 'bist-tursg', 'bist-ekgyo', 'bist-kchol']
      },
      {
        id: 'mod_04_cyclical_inversion',
        step: '04',
        rankStage: '2. Kademe · Terazi Ustası',
        title: 'Döngüsel Şirketlerde "Düşük F/K Tuzağı" ve Kapasite Değerlemesi',
        plainSummary20s: 'Demir, petrol ve oto işleri mevsim gibidir: Herkesin "rekor kâr, çok ucuz!" dediği yaz ortası genelde en pahalı zamandır; asıl fırsat kışın ortasındadır.',
        streetSummary: 'Demir-çelik, rafineri, petrokimya ve otomotiv gibi sektörler mevsim gibi dalgalanır. İşlerin en parlak olduğu zirve yılında kâr rekor kırdığı için F/K 2,5x–3,5x gibi çok ucuz görünür; oysa tam o an döngünün tepesidir!',
        proFormula: 'Peter Lynch Kuralı: Döngüsel sanayide F/K en düşükken satım/temkin, marjlar dipteyken (PD/DD < 0,8x ve kasa borçsuzsa) toplama bölgesidir! Takip edilecek veri F/K değil, ürün makasıdır (TÜPRAŞ için Dizel/Jet Crack Spread, EREGL için HRC-Cevher makası, PETKM için Etilen-Nafta makası).',
        liveCheck: 'Varlık çekmecesinin üstündeki 5 Yıllık grafikte "🥖 REEL (Alım Gücü)" moduna geçerek döngülerin gerçek boyunu gör!',
        sampleKeys: ['bist-tuprs', 'bist-eregl', 'bist-petkm', 'bist-froto']
      },
      {
        id: 'mod_05_mkk_smart_money',
        step: '05',
        rankStage: '3. Kademe · Tahta Dedektifi',
        title: 'MKK Takas, Patron Lot Dönüşümü, İlişkili Taraf ve 4 Tahta Ayak İzi',
        plainSummary20s: 'Dükkânın sahibi malını gizlice satıp çıkmaya çalışıyorsa, o dükkâna ortak olunmaz! Biz bunu resmi MKK kayıtlarından önceden yakalıyoruz.',
        streetSummary: 'Pazarda tezgah sahibi arka kapıdan kamyonla çürük mal indirirken ön tarafta "Gel vatandaş kapışılıyor!" diye bağırıyorsa oradan kaçılır. Borsanın arka kapısı Merkezi Kayıt Kuruluşu (MKK) ve dipnotlardır!',
        proFormula: 'Adli Kontrol: 1) KAP "Borsada İşlem Gören Tipe Dönüşüm" + MKK Dolaşım Artışı -> Ortak satış hazırlığı! 2) Bilanço dipnotunda "Ticari Olmayan İlişkili Taraf Alacağı" -> Kasadaki nakdin patronun özel şirketine sızması! 3) CMF-20 > +0,12 ve 52H dipte yatay fiyat -> Sessiz Kurumsal Toplama.',
        liveCheck: 'Pusula -> Hesap & Mutfak -> "MKK & Balina" masasında ve Yatırım -> "Kendi Süzgecin" aracında temiz kasaları süz.',
        sampleKeys: ['reel-yazilim-miatk', 'bist-mpark', 'bist-selec']
      },
      {
        id: 'mod_06_tax_friction',
        step: '06',
        rankStage: '3. Kademe · Tahta Dedektifi',
        title: '2026 Türkiye Vergi, Stopaj, Makas ve GVK Mükerrer 80 (%10 Yİ-ÜFE) Matematiği',
        plainSummary20s: 'Önemli olan "ne kadar kazandım?" değil, vergi ve banka makası kesildikten sonra cebinde net kaç lira kaldığıdır!',
        streetSummary: 'Brüt kazanç övünmek içindir, vergi ve makas düşüldükten sonra cebinde kalan Net Reel Kazanç ise ev geçindirir! Yanlış gişeden ve yanlış vergi kabuğundan işlem yapan, kazancının beşte birini masada bırakır.',
        proFormula: `2026 Türkiye Güncel Vergi Haritası: • BIST Hisse & TEFAS Yerli Hisse Yoğun Fonlar (MAC/IIH/TI2): %0 Stopaj. • 11444 Sayılı Kararla Kamu Sukuk & DİBS (31.12.2026'ya kadar): %0 Stopaj. • Fiziki Altın/Döviz (Kapalıçarşı): %0 Stopaj, ~%0,40 makas (Gece Banka %3,60 + %0,2 BSMV!). • Mevduat (≤6 ay %17,5 / ≤1 yıl %15 / >1 yıl %10), PPF/Altın/Yabancı/Serbest Fon: %17,5 Stopaj. • 9286 Karar Temettü: %15 Stopaj. • ABD Hisse/ETF: Yİ-ÜFE ≥ %10 endekslemesi + 2026 kademeli tarife (190B %15 / 400B %20 / 1M %27 / 5.3M %35 / %40).`,
        liveCheck: `Şu an ALTIN.S1 makası +%${dInfo.premiumPct}; Ustalık -> Laboratuvar'dan 2026 GVK 80 & 4 Kapı Terazisini canlı hesapla!`,
        sampleKeys: ['kira-sertifikasi-sukuk', 'tefas-mac', 'gram-altin-spot', 'abd-sp500-spy']
      },
      {
        id: 'mod_07_tefas_mastery',
        step: '07',
        rankStage: '4. Kademe · Fon & Makro Mimarı',
        title: 'TEFAS Fon Seçim Sanatı: Hisse Yoğun (%0) vs Yabancı/Serbest Fon (%17,5) ve 13:30 Valörü',
        plainSummary20s: 'Tek tek şirket seçmek istemiyorsan yatırım fonu hazır sepette 30 şirkete birden ortak olmanı sağlar — ama saat 13:30 sınırını ve vergisini bilmek gerekir.',
        streetSummary: 'Fon almak kolaydır ama içindeki kuralları bilmeyen hem valörde hem vergide şaşırır. TEFAS’taki Yerli Hisse Yoğun fonlarda devlet sıfır stopaj alırken, yabancı hisse fonlarında ve Mart 2026 itibarıyla TEFAS dışı serbest fonlarda %17,5 vergi kesilir!',
        proFormula: 'TEFAS 2026 Kuralları: 1) Saat 13:30 altın sınırdır; kaçırırsan emrin +1 iş günü sarkar. 2) TEFAS Yerli Hisse Yoğun (MAC, IIH, TI2): %0 stopaj, T+1 alım / T+2 satış. 3) Yabancı Hisse Fonları (AFT, AFA) & Serbest Hisse Fonları: %17,5 stopaj (kur farkı dahil!), T+1 alım / T+3 satış. 4) KAP aylık "Portföy Dağılım Raporu" fonun gerçek mutfağıdır.',
        liveCheck: 'Yatırım sekmesinde "Yatırım Fonları" filtresine dokunup MAC, IIH, AFT, AFA, IPB ve KZL’yi canlı karşılaştır.',
        sampleKeys: ['tefas-mac', 'tefas-iih', 'tefas-aft', 'tefas-ipb']
      },
      {
        id: 'mod_08_breakeven_triangle',
        step: '08',
        rankStage: '4. Kademe · Fon & Makro Mimarı',
        title: 'Faiz – Kur – Enflasyon Üçgeni ve Başabaş Kuru Hesabı',
        plainSummary20s: '"Hep dolar alayım" veya "hep faizde kalayım" demek yerine, her ay basit bir hesapla hangisinin seni enflasyondan daha iyi koruduğuna bakılır.',
        streetSummary: 'Türkiye’de yatırımın kalbi üçlü bir tahterevallidir: Politika Faizi, Enflasyon (TÜFE) ve Döviz Kuru. Duyguyla "Ben hep dolarcıyım" veya "Ben hep faizciyim" diyen mevsim değiştiğinde ezilir.',
        proFormula: `Canlı Terazi: Bugün Dolar ${be32.usdNow} ₺, %0 vergili Sukuk yıllık %${be32.sukuk.annualGross}. 32 günlük Dolar Başabaş Kuru = ${be32.breakevenUsdBazaar} ₺! Reel Faiz = ((1 + Net Faiz) / (1 + Beklenen TÜFE)) − 1 (Fisher Denklemi). Reel faiz yüksek pozitifken TL sabit getiri dolar bazında bile servet büyütür; reel faiz negatife döndüğünde mal, altın ve ihracatçı korur.`,
        liveCheck: 'Pusula -> Hesap & Mutfak -> "Başabaş Terazisi"nde tutar ve gün seçerek kendi başabaş kurunu test et.',
        sampleKeys: ['kira-sertifikasi-sukuk', 'doviz-usd', 'mevduat-ust', 'dibs-tahvil']
      },
      {
        id: 'mod_09_leading_data',
        step: '09',
        rankStage: '5. Kademe · Saha İstihbaratçısı',
        title: 'Bilançoyu 45 Gün Önceden Okumak: 6 Resmi Saha Öncü Verisi',
        plainSummary20s: 'Bir lokantanın kâr edip etmeyeceğini 3 ay sonraki defterden değil, bugün kapısındaki müşteri kuyruğundan anlarsın — borsada da aynı resmi veriler var!',
        streetSummary: 'Herkes çeyrek bilançonun açıklanacağı geceyi beklerken, usta yatırımcı fabrikanın kapısından geçen kamyonu ve kasadan geçen POS cihazını resmi bültenlerden haftalar önce okur!',
        proFormula: '6 Resmi Öncü Kaynak: 1) Market/Giyim/Havayolu -> TCMB Haftalık Kredi Kartı POS Harcamaları (Perşembe 14:30). 2) Bankalar -> BDDK Haftalık Bülteni. 3) Sigorta -> TSB Aylık Prim Üretimi. 4) Elektrik -> EPİAŞ Şeffaflık Saatlik Üretim & PTF. 5) Otomotiv -> ODMD & OSD Aylık Adetler. 6) Sanayi İhracatı -> TÜİK 12 Haneli GTİP USD/kg Gümrük Verisi!',
        liveCheck: 'Pusula -> Hesap & Mutfak -> "Gümrük & BDDK" masasından canlı GTİP ve TİM ihracat havzalarını incele.',
        sampleKeys: ['bist-tabgd', 'bist-tursg', 'bist-froto', 'bist-astor']
      },
      {
        id: 'mod_10_microstructure',
        step: '10',
        rankStage: '5. Kademe · Saha İstihbaratçısı',
        title: 'Borsa İstanbul Saat Fiziği: Eşleşme, Devre Kesici (-%6), T+2, Rüçhan ve VİOP',
        plainSummary20s: 'Borsa sabah 10’da açılır, akşam 6’da kapanır; sattığın hissenin parası 2 iş günü sonra nakit olur. Bu gerçek kuralları bilen hiç şaşırmaz.',
        streetSummary: 'Oyunun kurallarını bilmeden sahaya çıkan daha ilk dakikada ofsayta düşer. Borsa İstanbul’un 09:50 emir iptal kilidi, T+2 takası, tek kademe -%6 EBDKS devre kesicisi ve VİOP akşam seansı gerçek hayatta saniyesi saniyesine işler.',
        proFormula: 'Kritik Saatler: • 09:40–09:55 Emir Toplama (09:50 sonrası iptal kilitlenir!) -> 09:55 Açılış Eşleşmesi -> 10:00 Sürekli Müzayede. • 13:30 TEFAS Valör Sınırı. • 14:00 Perşembe TCMB Kararı. • 15:00 Margin Call. • 18:00–18:05 Kapanış Eşleşmesi -> 18:08–18:10 Kapanış Fiyatından İşlem -> 18:10 Kesin Kapanış (Arife: 12:40). • 19:00–23:00 VİOP Akşam Seansı.',
        liveCheck: 'Pusula -> Hesap & Takvim sekmesinden tüm seansların şu anki canlı durumunu ve kum saatini takip et.',
        sampleKeys: ['viop-bist30-kontrat', 'para-piyasasi-fonu', 'bist-30']
      },
      {
        id: 'mod_11_contrarian_value',
        step: '11',
        rankStage: '6. Kademe · Baş Stratejist',
        title: 'Yangın Yeri Cesaretini Kurmak ve Değer Tuzağından Kaçmak',
        plainSummary20s: 'Kalabalık korkup kaçarken sağlam mal ucuza düşer — ama önce gerçekten sağlam mı yoksa çürük mü diye kasasına bakmak şarttır.',
        streetSummary: 'Kalabalık güllük gülistanlık günde pahalıya almak için sıraya girer, fırtına çıktığında ise altın değerindeki fabrikaları zararına sokağa atar. Servet, fırtına gününde cebinde nakit ve yüreğinde terazi bulunduranların el değiştirme ödülüdür.',
        proFormula: 'Yangın Yeri 4’lü Filtresi: 1) 52 haftalık zirveden -%30+ iskonto var mı? 2) Sorun geçici makro fırtına mı yoksa kalıcı yıkım mı? 3) OCF > 0 ve Net Borç/FAVÖK < 2,2x mi? 4) Tek kurşun yerine 3 parçalı kademeyle mi giriyorsun?',
        liveCheck: 'Yatırım sekmesindeki "Akıllı Süzgeç -> Yangın Yeri" veya "Kendi Süzgecin" aracında sağlam ucuzları keşfet!',
        sampleKeys: ['bist-eregl', 'bist-froto', 'bist-sise', 'bist-enkai']
      },
      {
        id: 'mod_12_personal_wheel',
        step: '12',
        rankStage: '6. Kademe · Baş Stratejist',
        title: 'Kendi Nakit Çarkını, Özgürlük Nehrini ve Strateji Anayasanı Kurmak',
        plainSummary20s: 'En iyi yatırım, gece başını yastığa koyduğunda uykunu kaçırmayan ve her ay düzenli gelir damlatan yatırımdır.',
        streetSummary: 'Başkasının gömleği sana dar gelir. En iyi portföy, en yüksek hayali getiriyi vaat eden değil, gece yastığa başını koyduğunda uykunu kaçırmayan ve düzenli damlalarla seni özgürleştiren portföydür!',
        proFormula: 'Halter (Barbell) & Özgürlük Çarkı: • %40–55 Enflasyon & Nakit Zırhı (11444 Sayılı Kararla %0 Stopajlı Sukuk, Fiziki Altın, PPF) -> Uykunu korur ve fırtınada cephane verir. • %45–60 Nakit Basan Kaliteli Şirketler & Küresel Endeks (TUPRS, BIMAS, FROTO, MAC, SPY) -> Reel servet ve temettü büyütür. • Kaldıraç = 0, Tek hisse tavanı <= %25.',
        liveCheck: 'Hemen yukarıdaki "Özgürlük Çarkı Hesaplayıcısı" ile kendi özgürlük tarihini hesapla!',
        sampleKeys: ['kira-sertifikasi-sukuk', 'gram-altin-spot', 'tefas-mac', 'bist-tuprs']
      },
      {
        id: 'mod_13_loss_asymmetry',
        step: '13',
        rankStage: '1. Kademe · Kasa Gözü',
        title: 'Kayıp Matematiği: Neden %50 Düşen Sepetin Ayağa Kalkması İçin +%100 Gerekir?',
        plainSummary20s: 'Tüm yumurtaları tek sepete koyup düşürürsen bir daha toplaman yıllar sürer; parayı 3–4 farklı kaba bölen kişi fırtınada bile rahat uyur.',
        streetSummary: '1 milyon liranın yarısını kaybedip 500 bine inersen, tekrar 1 milyon olman için %50 değil tam %100 (iki katı!) kazanman gerekir. Bu yüzden usta yatırımcı önce "Ne kadar kazanırım?" diye değil, "En kötü günde ne kadar kaybederim?" diye sorar.',
        proFormula: 'Kayıp Asimetrisi Tablosu: -%10 düşüş -> +%11,1 gerek; -%25 -> +%33,3; -%50 -> +%100; -%80 -> +%400! Çözüm: Birbirine ters/bağımsız çalışan 4 sütun (TL Nakit/Sukuk + Altın/Döviz + Nakit Basan Yerli Şirket + Küresel Endeks) ve tek hissede maksimum %20–25 tavan!',
        liveCheck: 'Ustalık -> "🧪 Laboratuvar" sekmesindeki "🥚 Tek Sepet Düşürme Testi"nde bunu bizzat dene!',
        sampleKeys: ['kira-sertifikasi-sukuk', 'gram-altin-spot', 'tefas-mac', 'abd-sp500-spy']
      },
      {
        id: 'mod_14_order_types_book',
        step: '14',
        rankStage: '3. Kademe · Tahta Dedektifi',
        title: 'Emir Türleri, 09:50 İptal Kilidi & EBDKS -%6 Devre Kesici Fiziği',
        plainSummary20s: 'Pazarda fiyat sormadan "ne tutarsa ver" demek nasıl pahalıya patlarsa, borsada da fiyatsız (piyasa) emri vermek seni en yüksek fiyattan yakalatır.',
        streetSummary: 'Sakin tahtada bile serbest (piyasa) emir yerine kendi razı olduğun fiyatı yazan Limit Emir kullanmak seni robotların kademe oyunlarından korur. 09:50’den sonra açılış emri iptal edilemez; BIST 100 -%6 düşerse tüm borsa tek kademe devre kesiciye girer.',
        proFormula: 'BIST 2025/2026 Kuralları: 1) 09:40–09:55 Açılış Emir Toplama (son 5 dk 09:50–09:55 emir iptali ve fiyat kötüleştirme kilitlidir!). 2) Tekil hisse -%5 pay bazlı devre kesici (10 dk emir toplama + 2 dk eşleşme). 3) BIST 100 -%6 tek kademe EBDKS endeks devre kesici. 4) Limit Emir = Maksimum alış / minimum satış kalkanı.',
        liveCheck: 'Pusula -> Takvim masasında anlık BIST seans fazını ve 09:55 / 18:05 eşleşme pencerelerini izle.',
        sampleKeys: ['bist-100', 'bist-thyao', 'bist-garan']
      },
      {
        id: 'mod_15_corporate_actions',
        step: '15',
        rankStage: '4. Kademe · Fon & Makro Mimarı',
        title: 'Bedelli, Bedelsiz, Temettü (%15 Stopaj) ve Pay Geri Alımı: Hangisi Gerçek Değer?',
        plainSummary20s: 'Bir pizzayı 4 yerine 8 dilime kesmek (bedelsiz) pizzayı büyütmez; ama fırının kasasındaki kârı her yıl ortaklara dağıtması (temettü) veya kendi payını ucuza geri toplaması gerçek değerdir.',
        streetSummary: 'Sosyal medyada "Bedelsiz bölünecek uçacak!" diye gaza gelen acemi pizzanın büyümediğini unutur. Bedelli sermaye artırımında ise "Parayı borç yamamak için mi yoksa yeni fabrika için mi istiyor?" sorusunu mutlaka sor!',
        proFormula: '4 Sermaye Hamlesi: 1) Bedelsiz = Dilim artar, fiyat düşer, toplam değer matematiksel olarak 0 TL değişir. 2) Bedelli = Nakit istenir; .R rüçhan kuponu 15 günde kullanılmaz/satılmazsa sıfırlanır! 3) Temettü = 9286 Sayılı Kararla %15 stopaj kesilip net ödenir; düzenli artan temettü nakit akışı kanıtıdır. 4) Pay Geri Alımı = Şirket kendi hissesini ucuz bulup piyasadan toplar (en temiz pozitif sinyal!).',
        liveCheck: 'Piyasa -> "Arz & Temettü" masasında kesinleşmiş KAP nakit temettülerini ve net verimlerini incele.',
        sampleKeys: ['bist-tuprs', 'bist-froto', 'bist-isctr', 'tefas-ti2']
      },
      {
        id: 'mod_16_behavioral_psychology',
        step: '16',
        rankStage: '6. Kademe · Baş Stratejist',
        title: 'İnsanın En Büyük Düşmanı Kendi Sabırsızlığı: 5 Bilişsel Tuzak & Yatırımcı Anayasası',
        plainSummary20s: 'Piyasada para en çok bilgisi olana değil, herkes panikle koşarken sakin kalıp sabırla bekleyebilene gider.',
        streetSummary: 'Fiyat yükselirken "kaçırıyorum!" korkusuyla (FOMO) tepeden atlamak, düştüğünde ise "zararına satmam" inadıyla çürük malı yıllarca taşımak insan doğasının en pahalı iki tuzağıdır. Ekranı her saat yenileyen değil, sağlam sepet kurup işine bakan kazanır.',
        proFormula: 'Kahneman & Davranışsal Finans Kalkanı: 1) FOMO (Kaçırma Korkusu) -> 24 saat soğuma kuralı. 2) Batık Maliyet (Sunk Cost) -> "Bugün cebimde nakit olsa bu şirketi alır mıydım?" testi. 3) Çapa Etkisi -> Eski zirve fiyatına değil bugünkü nakit üretimine bak. 4) Aşırı İşlem -> Her tık komisyon/makas/vergi yakar (AETHER Sabırsızlık Aynası bunu otomatik ölçer!).',
        liveCheck: 'Ustalık -> "Karnem" sekmesinde Sabırsızlık Aynanı ve "İlk Sepete Hiç Dokunmasaydın" grafiğini kontrol et!',
        sampleKeys: ['kira-sertifikasi-sukuk', 'tefas-mac', 'gram-altin-spot']
      },
      {
        id: 'mod_17_eurobond_cds',
        step: '17',
        rankStage: '4. Kademe · Fon & Makro Mimarı',
        title: 'Eurobond, CDS Primi & 2026 Vergi Sınırı (400.000 ₺ Kupon vs İtfa Kuralı)',
        plainSummary20s: 'Devlete dolarla borç verip yılda iki kez dolar kira (kupon) almaktır; vadesine kadar tutarsan kur artışından vergi ödemezsin.',
        streetSummary: 'Doları yastık altında tutarsan ABD enflasyonuna erir; Eurobond ise dolarına yılda %5,5–6,5 dolar faizi öder. Ülke risk primi (CDS) düştükçe elindeki Eurobond’un fiyatı da yükselir!',
        proFormula: '2026 Eurobond 3 Altın Kuralı: 1) Kaynakta stopaj %0’dır. 2) Yıllık brüt kupon gelirin 2026 2. gelir dilimi olan 400.000 ₺’yi aşmıyorsa beyanname ve vergi 0 ₺’dir! 3) İtfaya (vade sonuna) kadar beklersen anapara kur farkı vergisi 0 ₺’dir; vadeden önce satarsan Yİ-ÜFE ≥ %10 endekslemesi sonrası GVK Mük. 80 uygulanır.',
        liveCheck: 'Yatırım -> "Faiz & Sukuk" kategorisinden T.C. Dolar Eurobond’u açıp kupon akışını incele.',
        sampleKeys: ['eurobond-usdtr', 'eurobond-emb', 'doviz-usd']
      },
      {
        id: 'mod_18_working_capital_ccc',
        step: '18',
        rankStage: '2. Kademe · Terazi Ustası',
        title: 'İşletme Sermayesi & Nakit Dönüşüm Süresi (CCC): Büyürken Nakit Basanlar vs Boğulanlar',
        plainSummary20s: 'Malı peşin satıp toptancıya parayı 2 ay sonra ödeyen market kendi kendine büyür; veresiye satıp peşin alan dükkân ise büyürken kredi faizine boğulur.',
        streetSummary: 'Yüksek faizli Türkiye’de iki şirketin cirosu aynı hızda büyürken biri zenginleşir, diğeri bedelli sermaye artırımına muhtaç kalır. Aradaki fark "Nakit Dönüşüm Süresi" ve "340 Alınan Sipariş Avansları"dır!',
        proFormula: 'Nakit Dönüşüm Süresi (CCC) = Stok Tutma Günü + Alacak Tahsil Günü − Ticari Borç Ödeme Günü. Perakende (BIMAS/MGROS) negatif CCC ile tedarikçi parasıyla büyür; savunma ve enerji ekipmanı (ASELS/ASTOR) ise müşteriden peşin aldığı "340 Alınan Sipariş Avansları" ile sıfır krediyle üretim yapar!',
        liveCheck: 'Ustalık -> "Atölye -> 🔬 KAP Okuyucu" laboratuvarında sipariş avansı ve tahsilat vadesi kontrolünü dene!',
        sampleKeys: ['reel-perakende-bimas', 'bist-mgros', 'bist-asels', 'reel-enerji-astor']
      },
      {
        id: 'mod_19_duration_bond_cycle',
        step: '19',
        rankStage: '5. Kademe · Saha İstihbaratçısı',
        title: 'Faiz Döngüsü & Tahvil Tahterevallisi: Ne Zaman Günlük PPF, Ne Zaman Uzun Tahvil/Sukuk?',
        plainSummary20s: 'Faizler yükselirken günlük fon (PPF) kazandırır; ama Merkez Bankası faiz indirmeye başlarken yüksek oranı uzun vadeli kilitleyen kazanır.',
        streetSummary: 'Pek çok yatırımcı "Günlük PPF %39 veriyor, hep burada kalayım" der; oysa Merkez Bankası faizi indirdiği sabah PPF’nin getirisi de anında düşer (Yeniden Yatırım Riski).',
        proFormula: 'Tahvil Vade (Duration) Matematiği: Tahvil Fiyat Değişimi ≈ −Duration × ΔFaiz. Faiz artırımı döngüsünde kısa vade (PPF + kısa Sukuk) anaparayı korur; enflasyon ve faiz zirveden dönmeye başladığında ise %0 stopajlı sabit DİBS/Sukuk hem yüksek oranı kilitler hem de anapara değer kazancı yazar!',
        liveCheck: 'Pusula -> "Domino" simülatöründe Merkez Bankası faiz kolunu -6 puana çekip sektör ve tahvil etkisini canlı gör!',
        sampleKeys: ['dibs-tahvil', 'kira-sertifikasi-sukuk', 'para-piyasasi-fonu']
      },
      {
        id: 'mod_20_dca_salary_discipline',
        step: '20',
        rankStage: '6. Kademe · Baş Stratejist',
        title: 'Maaş Günü Disiplini, Kademeli Alım (DCA) ve Yılda 2 Kez Sepet Dengeleme (Rebalancing)',
        plainSummary20s: 'Her ay maaş günü düzenli damla ekleyen ve çok şişen sepetten azıcık alıp ucuz kalan sepete aktaran kişi hiç stres yaşamadan servet kurar.',
        streetSummary: 'Kimse her ay en dibi ve en tepeyi bilemez. Ama kendi kuralı olan yatırımcı tahmin yapmak zorunda kalmaz: Ayın 1’i veya 15’inde düzenli alır; sepet oranları %10’dan fazla kaydığında tekrar dengeye çeker.',
        proFormula: 'Otomatik Servet Sistemi: 1) Maaş günü gelir gelmez önce tasarrufu ayır (Önce Kendine Öde). 2) 4 sütunlu hedef ağırlık belirle (örn. %35 Sukuk/PPF + %25 Altın + %25 Sağlam Şirket/Fon + %15 Küresel/Nakit). 3) Yılda 2 kez hedef ağırlığından +%10 taşanı kırpıp ucuz kalana ekle -> Matematiksel olarak "Tepeden Sat, Dipten Al" disiplinini otomatik çalıştırır!',
        liveCheck: 'Ana Sayfa’daki "🧺 1 Milyon ₺ Kendi Sepet Terazini Kur" aracıyla kendi 4 sütunlu dengeni hemen kur!',
        sampleKeys: ['kira-sertifikasi-sukuk', 'gram-altin-spot', 'tefas-mac', 'bist-froto']
      },
      {
        id: 'mod_21_bes_2026_strategy',
        step: '21',
        rankStage: '4. Kademe · Fon & Makro Mimarı',
        title: '2026 BES (%20 Devlet Katkısı · 10811 Karar) ve BEFAS Fon Yönetimi Sanatı',
        plainSummary20s: 'BES sadece para biriktirme kutusu değil, devletin %20 eklediği bir vergi kalkanıdır; ama içindeki fonları kendin seçmezsen enflasyona yenilir.',
        streetSummary: '1 Ocak 2026 itibarıyla 10811 Sayılı Kararla devlet katkısı %20 ve yıllık tavan 396.360 ₺ katkıya karşılık 79.272 ₺ oldu. Birikimini yıllarca bankanın standart fonunda unutmak yerine yılda 12 hakkınla BEFAS Altın, Yerli Hisse ve Tahvil fonlarına paylaştırmak sonucu 2–3 kat büyütür.',
        proFormula: '2026 BES Matematiği: • Devlet Katkısı = %20 (Maks 79.272 ₺/yıl; üstü 2027’ye devreder). • Hak Ediş: <3 yıl %0 · 3–6 yıl %15 · 6–10 yıl %35 · 10+ yıl %60 · 10 yıl + 56 yaş %100. • Çıkış Stopajı (yalnızca getiriden): <10 yıl %15 · 10+ yıl %10 · Emeklilik %5.',
        liveCheck: 'Ustalık -> Atölye -> "🛡️ 2026 BES Motoru"nda kendi aylık taksitinle BEFAS fon farkını canlı hesapla!',
        sampleKeys: ['bes-emeklilik', 'bist-agesa', 'gram-altin-spot']
      },
      {
        id: 'mod_22_orderbook_limit_stop',
        step: '22',
        rankStage: '3. Kademe · Tahta Dedektifi',
        title: '5 Kademe Tahta Derinliği, Sığ Tahta Kayması (Slippage), Limit Emir ve Zarar Kes',
        plainSummary20s: 'Fiyat etiketine değil tezgâhta kaç kilo mal olduğuna bak: Sığ tahtada serbest emir verirsen pahalıya alırsın; Limit Emir ve Zarar Kes seni korur.',
        streetSummary: 'BIST-30 devlerinde milyon liralık emir tek kademede erirken, günlük hacmi düşük sığ bir hissede 200 bin liralık piyasa emri tahtayı 5 kademe yukarı süpürür. Disiplinli yatırımcı hedef fiyata Limit Alım yazar, tez bozulursa duygusuzca Zarar Kes uygular.',
        proFormula: '3 Profesyonel Emir Kuralı: 1) BIST fiyat adımı kuralıyla uyumlu LİMİT ALIM koyarak kaymayı (slippage) sıfırla. 2) Pozisyonu açarken temel tezinin iptal olacağı seviye için ZARAR KES (Stop-Loss) belirle. 3) Aşırı ralli hedeflerinde kademeli KÂR AL (Take-Profit) kullan.',
        liveCheck: 'Herhangi bir BIST hissesinde "Al / Sat" çekmecesini aç: Canlı 5 Kademe Derinliğini incele ve gerçek Limit / Zarar Kes emri kur!',
        sampleKeys: ['bist-tuprs', 'bist-thyao', 'bist-garan']
      },
      {
        id: 'mod_23_dividend_tax_2026',
        step: '23',
        rankStage: '5. Kademe · Saha İstihbaratçısı',
        title: '2026 Temettü Vergi Matematiği: %50 İstisna, 800 Bin ₺ Brüt Sınır & Stopaj İadesi',
        plainSummary20s: 'Temettüden kesilen %15 stopaj çoğu yatırımcı için son vergidir; 2026’da brüt 800 bin liraya kadar ek beyan gerekmez, üstünde bile vergi iadesi çıkabilir!',
        streetSummary: 'Temettü portföyü büyüten pek çok kişi "yüksek temettü alırsam devlete çok ek vergi çıkar mı?" diye çekinir. Oysa GVK Md. 22’deki %50 istisna ve %15 stopajın tamamının mahsubu sayesinde temettü yatırımcısı Türkiye’nin en avantajlı vergi dilimlerinden birindedir.',
        proFormula: '2026 Temettü Beyan Formülü: • Beyan Matrahı = Brüt Temettü × %50. • 2026 Sınırı = 400.000 ₺ (yani Brüt 800.000 ₺ / Net 680.000 ₺ altı beyan DIŞI!). • Sınır aşılırsa hesaplanan vergiden, kaynağında kesilen %15 stopajın TAMAMI düşülür; ilk dilimlerde devletten vergi İADESİ bile doğar!',
        liveCheck: 'Ustalık -> Atölye -> "🏛️ 2026 Vergi Merkezi -> Temettü" sekmesinde 850.000 ₺ brüt temettüyü deneyip vergi iadesini gör!',
        sampleKeys: ['bist-tuprs', 'bist-froto', 'bist-isctr']
      },
      {
        id: 'mod_24_crypto_carf_2026',
        step: '24',
        rankStage: '5. Kademe · Saha İstihbaratçısı',
        title: '2026 Dijital Varlık & Kripto Gerçekleri: Yasal Çerçeve, SPK Saklama & Kuyruk Riski',
        plainSummary20s: '7/24 açık olması büyük özgürlük gibi görünür ama en çok hata gece ve hafta sonu yapılır; kripto portföyün tamamı değil, küçük baharatı olmalıdır.',
        streetSummary: '27 Mart 2026’da TBMM’de binde 3 işlem vergisi teklifi geri çekildi; ancak SPK lisanslı platform denetimi ve uluslararası CARF şeffaflığı devrede. Yüzde 60–80 düşüş görebilen bir varlığa ev parasının tamamını koymak yatırım değil kumardır.',
        proFormula: '2026 Kripto Disiplini: 1) Toplam portföyde %5–10 üst sınır (Asimetrik getiri, sınırlı hasar). 2) Yalnızca SPK lisanslı saklama / donanım cüzdanı. 3) Gece 02:00 veya hafta sonu %30 yükselmiş altcoin’e FOMO ile atlamama kuralı.',
        liveCheck: 'Yatırım -> "Dünya & Kripto" sekmesinde BTC/ETH’yi 5 yıllık "🥖 REEL" ve "$ DOLAR" grafiğinde incele.',
        sampleKeys: ['kripto-btc', 'kripto-eth', 'gram-altin-spot']
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
      { term: 'F/K & Döngüsel Terslik', cat: 'Değerleme', street: 'Şirketin bugünkü fiyatının son 1 yıllık net kârının kaç katı olduğu; ama döngüsel işlerde en tepede en ucuz görünerek tuzak kurar!', pro: 'Çelik, rafineri ve petrokimyada marj zirvesinde F/K 3x görünür (pahalıdır), marj dibinde yüksek görünür; PD/DD ve ürün marjıyla birlikte okunur.' },
      { term: 'PD / DD (Piyasa / Defter Değeri)', cat: 'Değerleme', street: 'Şirketin bütün malını mülkünü satıp borçlarını kapatsan elde kalacak özsermayenin kaç katına borsada satıldığı.', pro: 'Bankalarda (ROE ile birlikte), GYO’larda ve Holdinglerde birincil değerleme terazisidir (<1,0x özkaynağından ucuz demektir).' },
      { term: 'ROIC (Yatırılan Sermaye Getirisi)', cat: 'Değerleme', street: 'Şirketin işe bağladığı her 100 liradan yılda kaç lira gerçek faaliyet kârı ürettiği.', pro: 'ROIC sermaye maliyetinden (WACC / Enflasyon) yüksekse şirket büyüdükçe servet yaratır, düşükse büyüdükçe değer yıkar.' },
      { term: 'Net Borç / FAVÖK', cat: 'Risk', street: 'Şirketin kasadaki hazır parasını düştükten sonra kalan banka borcunu kaç yıllık işletme kârıyla sıfırlayabileceği.', pro: '0’ın altı "Net Nakit Kalesi"dir; 0–2x sağlıklı, 4x üzeri yüksek faiz ortamında tehlike çanıdır!' },
      { term: 'Cari Oran', cat: 'Risk', street: 'Önümüzdeki 1 yıl içinde vadesi gelecek faturaları ve kredileri ödemek için kasada/stokta kaç kat dönen varlık olduğu.', pro: 'Sanayide 1,2x üstü güvenli nefes alanıdır; 0,8x altı kısa vadeli nakit sıkışıklığı (bedelli/yüksek faizli kredi) riskidir.' },
      { term: 'MKK Tipe Dönüşüm & Fiili Dolaşım', cat: 'Takas', street: 'Patronun kasada kilitli duran paylarını borsada küçük yatırımcıya satabilmek için Merkezi Kayıt Kuruluşu’nda "açık paya" çevirmesi.', pro: 'KAP’ta tipe dönüşüm ve MKK lot artışı görülürse tahtada arz baskısı beklenir; pay geri alımı ise tam tersi destektir.' },
      { term: 'CMF-20 (Chaikin Para Akışı)', cat: 'Tahta İzi', street: 'Son 20 günde tahtadaki işlemlerin günün tepesinden mi (iştahlı kurumsal toplama) yoksa dibinden mi (gizli mal yedirme) kapandığının ölçüsü.', pro: '+0,10 ve üzeri kurumsal para girişini, -0,10 ve altı kurumsal mal çıkışını işaret eder.' },
      { term: 'Net Aktif Değer (NAD) İskontosu', cat: 'Değerleme', street: 'İçinde 10 milyon liralık ev ve fabrika bulunan bir holdingin borsada 6 milyon liraya (%40 indirimli) satılması.', pro: 'Holding (KCHOL/SAHOL/DOHOL) ve GYO analizinin temelidir.' },
      { term: 'Hisse Senedi Yoğun Fon (%0 Stopaj)', cat: 'TEFAS', street: 'Portföyünün en az %80’ini devamlı yerli BIST hisselerinde tuttuğu için devletin kârından 0 TL vergi kestiği yatırım fonu (örn. MAC, IIH, TI2).', pro: 'Yabancı hisse fonları (AFT/AFA) bu kapsamda değildir; onlarda kur farkı dahil %17,5 stopaj kesilir!' },
      { term: 'Rüçhan Hakkı Kuponu (.R)', cat: 'Sermaye', street: 'Bedelli sermaye artırımında mevcut ortağa verilen "yeni payı indirimli alma veya kuponu pazarda satma" hakkı.', pro: 'Süresi içinde kullanılmaz ve rüçhan pazarında satılmazsa sıfırlanarak doğrudan servet kaybı yaratır!' },
      { term: 'Lock-Up (Ortak Satmama Taahhüdü)', cat: 'Halka Arz', street: 'Yeni halka arz olan şirkette patronun "180 gün boyunca borsada tek lot hisse satmayacağım" sözü.', pro: '180. gün dolduğunda dolaşıma girebilecek ortak payları izlenmelidir.' },
      { term: 'Net Faiz Marjı (NIM) & ROE', cat: 'Bankacılık', street: 'Bankanın topladığı mevduata verdiği faiz ile dağıttığı krediden aldığı faiz arasındaki net kazanç makası ve özkaynak kârlılığı.', pro: 'Bankalarda ROE > TÜFE Enflasyonu olduğu dönemlerde defter değeri reel olarak büyür.' },
      { term: 'Teknik Karşılık (Sigorta Float’u)', cat: 'Sigorta', street: 'Sigorta şirketinin poliçe kesip peşin topladığı parayı hasar ödeyene kadar yüksek faizde çalıştırdığı dev nakit havuzu.', pro: 'Yüksek faiz ortamında TURSG ve AGESA gibi şirketlerin finansal gelir motorudur.' },
      { term: 'T+2 Takas Kuralı', cat: 'Piyasa Fiziği', street: 'Borsada hisse sattığında paranın çekilebilir nakde dönmesi için 2 iş günü bekleme zorunluluğu.', pro: 'T+2’deki parayla (Brüt Takas yoksa) aynı gün başka hisse alınabilir ama nakit çekilemez, altın/mevduat alınamaz.' },
      { term: 'TEFAS 13:30 Valörü', cat: 'Piyasa Fiziği', street: 'Yatırım fonu alırken veya bozarken saat 13:30 gişe sınırını kaçırırsan işlemin 1–2 iş günü sonraya sarkması.', pro: 'PPF 13:30 öncesi T+0 aynı gün nakittir; Sukuk T+1, yerli hisse fonu T+2, yabancı fon satışta T+3 valörlüdür.' },
      { term: 'VBTS Brüt Takas', cat: 'Piyasa Fiziği', street: 'Aşırı dalgalanan tahtalarda Borsa İstanbul’un koyduğu "Peşin parayla al, aldığını bugün satamazsın, sattığının parasıyla takas dolmadan hisse alamazsın" freni.', pro: 'Kredili işlem ve açığa satış da eşzamanlı kapatılır; kredi teminat katsayısı %0 olur.' },
      { term: 'Stopaj Vergisi', cat: 'Vergi', street: 'Kazandığın faiz, fon kârı veya temettü daha hesabına yatarken kaynağında otomatik kesilen vergi.', pro: 'Kamu Sukuk, DİBS, BIST Hisse ve Hisse Yoğun Fonlarda %0; PPF ve Altın/Yabancı Fonlarda %17,5; Temettüde %15’tir.' },
      { term: 'GVK Mükerrer 80 & Yİ-ÜFE %10', cat: 'Vergi', street: 'ABD hissesi veya Eurobond sattığında devletin "Üretici enflasyonu %10’u geçtiyse TL maliyetini enflasyonla büyüt, sadece gerçek reel kazancının vergisini öde" dediği kalkan.', pro: 'Alış-satış arası Yİ-ÜFE %10,00 sınırını aşmadan satmamak vergi yükünü dramatik biçimde azaltır.' },
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
      { term: 'Hurst Üssü (H)', cat: 'Kantitatif', street: 'Bir varlığın başladığı yönde akmaya devam eden "inatçı nehir" mi (H > 0,55), yoksa lastik gibi ortalamaya geri dönen "yay" mı (H < 0,45) olduğunu ölçer.', pro: 'H > 0,55 trend takip stratejisine; H < 0,45 ise destekten al / dirençten sat stratejisine uygundur.' },
      { term: 'Fisher Reel Getiri Denklemi', cat: 'Ekonomi', street: 'Paranın rakam olarak ne kadar büyüdüğü değil, enflasyon canavarı payını aldıktan sonra kaç ekmek daha fazla alabildiğin!', pro: 'Reel Getiri = ((1 + Nominal Getiri) / (1 + TÜFE Enflasyonu)) − 1. Grafiğin "🥖 REEL" modunda canlı çizilir!' },
      { term: 'Kamu Kira Sertifikası (Sukuk)', cat: 'Güvenli Liman', street: 'Devletin kira geliri esasına dayalı, faizsiz ve 11444 Sayılı Kararla 31 Aralık 2026’ya kadar %0 vergili düzenli gelir aracı.', pro: 'Stopajı %0 olduğu için brüt oranı doğrudan net cebine kalır; 32 günlük mevduat (%17,5 stopaj) ile kıyaslandığında ciddi vergi avantajı sunar.' },
      { term: 'Para Piyasası Fonu (PPF)', cat: 'Güvenli Liman', street: 'Paranı 32 gün kilitlemeden her gün kazandıran ve hafta içi saat 13:30’dan önce bozarsan aynı gün cebine dönen günlük nakit fonu.', pro: 'Bireysel yatırımcıda kârdan %17,5 stopaj kesilir; acil fırsat cephane parası için en likit park yeridir.' },
      { term: 'Hava Parası (ALTIN.S1 Primi)', cat: 'Altın & Emtia', street: 'Kapalıçarşı’da 6.000 ₺ olan 1 gram altının, borsada sertifika kılıfıyla 6.900 ₺’ye satılması — aradaki 900 ₺ sadece kâğıt kılıf parasıdır!', pro: 'Darphane ALTIN.S1 primi +%5’i aştığında fiziki gram altına göre pahalıdır; prim söndüğünde altın düşmese bile zarar yazdırır.' },
      { term: 'Başabaş Kuru', cat: 'Makro & Kur', street: '"Dolar 1 ay sonra kaç lirayı geçmezse TL kira sertifikası / faiz beni daha çok zengin eder?" sorusunun kuruşu kuruşuna sınırı.', pro: 'Başabaş Kur = Bugünkü Alış Kuru × (1 + Dönemlik Net TL Getirisi). Duyguyu bırakıp matematikle karar vermenin anahtarıdır.' },
      { term: 'Enflasyon (TÜFE)', cat: 'Ekonomi', street: 'Geçen sene 100 liraya dolan pazar filesinin bu sene 130 liraya çıkması — yani boşta duran paranın sessizce erime hızı.', pro: 'TÜİK her ayın 3’ünde saat 10:00’da açıklar. Yatırımın enflasyonu geçmiyorsa gerçekte fakirleşiyorsun demektir.' },
      { term: 'Temettü (Kâr Payı)', cat: 'Hisse Senedi', street: 'Ortak olduğun fabrikanın yıl sonunda kasasında biriken net kârın bir kısmını senin banka hesabına nakit olarak bölüştürmesi.', pro: '9286 Sayılı Kararla %15 stopaj kesilerek net ödenir; bedava para değildir, ödeme günü hisse fiyatı brüt temettü kadar düşer ama düzenli temettü nakit gücünün kanıtıdır.' },
      { term: 'Makas (Alış-Satış Farkı)', cat: 'Gişe Kuralı', street: 'Kuyumcu veya bankanın aynı altını/doları sana sattığı fiyat ile senden geri aldığı fiyat arasındaki fark. Gece bankada bu makas 6–8 kat açılır!', pro: 'Gündüz Kapalıçarşı ~%0,40 iken akşam 17:30 sonrası mobil bankada %3,60 + %0,20 BSMV’ye çıkar.' },
      { term: 'BSMV (Kambiyo Vergisi)', cat: 'Vergi', street: 'Bankadan döviz veya kaydi altın alırken devletin alış tutarı üzerinden kestiği binde 2 (%0,20) işlem vergisi.', pro: '100.000 ₺’lik banka alımında 200 ₺ anında vergiye gider; fiziki çarşı ve borsa hisselerinde kambiyo vergisi yoktur.' },
      { term: 'EBDKS (-%6 Devre Kesici)', cat: 'Piyasa Fiziği', street: 'Borsa İstanbul’da tüm piyasa bir günde %6 düşerse panik dursun diye borsanın geçici olarak mola vermesi.', pro: 'Eski %5/%7 iki kademe yerine artık tek kademe -%6 endeks devre kesici uygulanır; tekil hisselerde ise -%5 pay bazlı devre kesici vardır.' },
      { term: 'Bedelli Sermaye Artırımı', cat: 'Sermaye', street: 'Şirketin ortaklarına "Yeni fabrika kuracağım (veya borç ödeyeceğim), gelin ortak olarak kasaya ek nakit koyun" demesi.', pro: 'KAP’taki Fon Kullanım Raporuna bakılır: Fabrika/ihracat yatırımı olumlu, borç yamama bedellisi alarmdır.' },
      { term: 'Bedelsiz Sermaye Artırımı', cat: 'Sermaye', street: 'Bir tepsi böreği 4 yerine 8 dilime kesmek: Elindeki hisse adedi artar, fiyatı aynı oranda bölünür ama toplam paran 1 kuruş değişmez.', pro: 'Sadece likiditeyi artırır; tek başına şirketin kasasına 1 TL bile sokmaz.' },
      { term: 'Pay Geri Alımı', cat: 'Sermaye', street: 'Fabrikanın patronunun "Bizim dükkân borsada ederinin çok altında satılıyor" deyip şirketin kendi kasasından borsadaki kendi hisselerini toplaması.', pro: 'Patronun hisse satmasının (MKK) tam tersidir; genellikle en dürüst değerleme dip sinyalidir.' },
      { term: 'Limit Emir vs Piyasa Emri', cat: 'Gişe Kuralı', street: 'Pazarda "kaç liraysa ver" demek Piyasa Emridir (pahalıya alırsın); "en fazla 50 TL’den alırım" demek Limit Emirdir (seni korur).', pro: 'Açılışta, TCMB 14:00 kararında ve sığ tahtalarda her zaman Limit Emir kullanılır.' },
      { term: 'FOMO (Kaçırma Korkusu)', cat: 'Psikoloji', street: 'Herkesin dilindeki yükselen hisseyi görünce "tren kaçıyor" telaşıyla incelemeden en tepeden atlama hastalığı.', pro: 'Küçük yatırımcının en çok para kaybettiği davranışsal hatadır; panikle tepeden alıp korkuyla dipten satmaya yol açar.' },
      { term: 'Serbest Fon (%17,5 Stopaj)', cat: 'TEFAS', street: 'TEFAS’ta herkese açık olmayan, sadece büyük/nitelikli yatırımcılara özel fonlar — Mart 2026 itibarıyla hisse yoğun olsalar bile %17,5 vergiye tabidir.', pro: 'Bireysel yatırımcı için TEFAS’ta açık yerli hisse yoğun fonlar (MAC, IIH, TI2) hâlâ %0 stopajlıdır.' },
      { term: 'Kayıp Asimetrisi', cat: 'Risk', street: '100 liranın yarısını kaybedip 50 liraya düşersen, eski 100 lirana dönmek için %50 değil tam %100 kazanman gerekir!', pro: 'Sermayeyi büyük çöküşlerden korumak (sepet çeşitlendirmesi ve sıfır kaldıraç), bileşik getirinin birinci şartıdır.' },
      { term: 'Halka Arz (Eşit Dağıtım)', cat: 'Halka Arz', street: 'Bir şirketin ilk kez borsaya açılıp paylarını vatandaşlara eşit şekilde bölüştürmesi; katılan kişi sayısı arttıkça kişi başı düşen lot küçülür.', pro: '500 bin kişi katıldığında genelde kişi başı 1.500–3.000 ₺ arası pay düşer; tüm nakdi tek arza kilitlemek fırsat maliyetidir.' },
      { term: 'Otomatik Gecelik Nema', cat: 'Güvenli Liman', street: 'Aracı kurumda boşta duran nakit paranın akşam sen uyurken otomatik olarak gecelik repoda çalışıp sabaha kâr yazması.', pro: 'Boş nakdin vadesizde %0 ile enflasyona yenilmesini engeller; Cüzdan -> Emirler sekmesinden tek tuşla açılır.' },
      { term: 'Eurobond & 400 Bin ₺ Sınırı', cat: 'Vergi & Döviz', street: 'Devletin dolar cinsinden çıkardığı uzun vadeli tahvil; yılda iki kez dolar faizi (kupon) öder ve vadesine kadar tutarsan kur farkından 0 ₺ vergi çıkar.', pro: '2026’da yıllık brüt kupon geliri 400.000 ₺ altındaysa beyanname verilmez (%0 stopaj); erken satış kârı ise Yİ-ÜFE ≥ %10 endekslemesiyle GVK Mük. 80’e tabidir.' },
      { term: 'Nakit Dönüşüm Süresi (CCC)', cat: 'Bilanço', street: 'Dükkânın mal alıp parasını müşteriden tahsil edene kadar cebinden kaç gün para bağladığının süresi; eksi (-) ise tedarikçi parasıyla bedava büyüyordur!', pro: 'CCC = Stok Günü + Alacak Günü − Ticari Borç Günü. Yüksek faiz ortamında düşük/negatif CCC altın değerindedir.' },
      { term: 'Kademeli Alım (DCA)', cat: 'Strateji', street: 'Paranın tamamıyla tek bir günde riske girmek yerine her ay maaş gününde parça parça alarak düşüş aylarında ucuza daha çok adet toplama yöntemi.', pro: 'Zamanlama hatası (zirveden tek kurşun yakalanma) riskini ortadan kaldırır ve davranışsal disiplini korur.' },
      { term: 'Portföy Dengeleme (Rebalancing)', cat: 'Strateji', street: 'Çok yükselip şişen sepetten bir dilim kâr alıp, geride ve ucuz kalan sağlam sepete aktararak teraziyi eski dengesine getirmek.', pro: 'Duygusal tahmin yapmadan mekanik olarak "pahalıdan sat, ucuzdan topla" kuralını işletir.' },
      { term: 'Tahvil Vadesi (Duration)', cat: 'Sabit Getiri', street: 'Merkez Bankası faiz indirdiğinde elindeki eski yüksek faizli devlet tahvilinin ne kadar ekstra değer kazanacağını ölçen kaldıraç katsayısı.', pro: 'Faiz ile tahvil fiyatı ters çalışır; faiz indirim döngüsü başlarken uzun vadeli sabit kuponlu tahviller sermaye kazancı üretir.' },
      { term: 'Yeniden Yatırım Riski', cat: 'Sabit Getiri', street: 'Bugün %39 veren gecelik fon veya 32 günlük mevduatın, 6 ay sonra faizler %25’e indiğinde artık aynı yüksek geliri verememesi riski.', pro: 'Faiz zirvesinde sadece gecelik fonda kalmak yerine bir kısmı uzun vadeli %0 stopajlı Sukuk/DİBS ile sabitlemek bu riski çözer.' },
      { term: '09:50 Emir İptal Kilidi', cat: 'Piyasa Fiziği', street: 'Sabah açılış eşleşmesinde son 5 dakikaya (09:50–09:55) girildiği an kimsenin verdiği emri silememesi kuralı.', pro: '09:40–09:49 arası sahte tavan/taban gösteren emirlerin son saniyede silinip yatırımcıyı tuzağa düşürmesini önlemek için getirilmiştir.' },
      { term: 'İhracat Birim Değeri (USD/kg)', cat: 'Saha Öncüsü', street: 'Fabrikanın yurt dışına sattığı malın kilosundan kaç dolar kazandığı; bu rakam artıyorsa şirket fasoncu değil yüksek kârlı teknoloji/marka satıyordur.', pro: 'TÜİK 12 haneli GTİP verisinden bilançodan 45 gün önce takip edilir.' },
      { term: 'Solo Holding Nakdi', cat: 'Değerleme', street: 'Altındaki fabrikaların kasası hariç, bizzat çatı holding merkezinin kendi banka hesabında duran net nakit para.', pro: 'NAD iskontosu yüksek olan holdingde solo net nakit pozitifse değer tuzağı riski düşer, krizde satın alma gücü artar.' },
      { term: 'Temettü Verimi (%)', cat: 'Hisse Senedi', street: '100.000 ₺’lik hisse aldığında şirketin bir yılda senin hesabına yatırdığı nakit kâr payının yüzdesi.', pro: 'Brüt temettüden %15 stopaj kesilir (9286 Sayılı Karar); sürdürülebilir olması için şirketin FCF > Dağıtılan Temettü olması şarttır.' },
      { term: 'Halka Açıklık Oranı (%)', cat: 'Takas', street: 'Şirketin toplam paylarının yüzde kaçının borsada alınıp satılabilir durumda olduğu.', pro: '%20–%45 arası dengeli kabul edilir; %85 üzeri sahipsiz/dağınık tahtalarda veya %3 altı aşırı sığ tahtalarda manipülasyon riski yükselir.' },
      { term: 'Bileşik Getiri (Kartopu)', cat: 'Ekonomi', street: 'Kazandığın kârı ve temettüyü harcamayıp tekrar işe koştuğunda, bir süre sonra kârın da kendi yavrusunu doğurarak çığ gibi büyümesi.', pro: 'Albert Einstein’ın 8. harika dediği etki; çalışması için iki şart vardır: Sabır (zaman) ve büyük çöküşlerden korunmak (kayıp asimetrisi kalkanı).' },
      { term: 'BES %20 Devlet Katkısı (2026)', cat: '2026 Mevzuat', street: 'Emeklilik kumbarana koyduğun her 100 liranın üstüne devletin 20 lira daha eklemesi (2026’da yılda en fazla 79.272 ₺).', pro: '10811 Sayılı Kararla 1 Ocak 2026’dan itibaren %20; tam hak ediş için 10 yıl sistemde kalma ve 56 yaş şartı vardır.' },
      { term: 'BEFAS Fon Platformu', cat: 'BES & Fon', street: 'Sadece kendi BES şirketinin standart fonuna mahkûm olmadan, Türkiye’deki tüm şirketlerin altın, hisse ve döviz emeklilik fonlarını tek ekrandan seçebilmek.', pro: 'Yılda 12 kez fon dağılım değişikliği hakkı ile enflasyonu yenen uzun vadeli sepet kurulabilir.' },
      { term: 'Zarar Kes (Stop-Loss)', cat: 'Emir & Risk', street: 'Bir yatırım beklediğin gibi gitmeyip belirli bir fiyatın altına düştüğünde daha büyük kaybı önlemek için önceden kurulmuş otomatik satış kalkanı.', pro: 'Duygusal "maliyetime gelsin satarım" çıpasını kırar; sermayeyi büyük çöküşlerden korur.' },
      { term: 'Kâr Al (Take-Profit)', cat: 'Emir & Risk', street: 'Hisse veya altın hedeflediğin kâr seviyesine ulaştığında açgözlülüğe kapılmadan otomatik olarak kârı nakde çeviren hedef satış emri.', pro: 'Zirve coşkusunda disiplinli kademeli kâr realizasyonu sağlar.' },
      { term: '5 Kademe Tahta Derinliği', cat: 'Piyasa Fiziği', street: 'Borsada şu an en yakın 5 alış ve 5 satış fiyatında sıraya girmiş kaç lot alıcı ve satıcı olduğunu gösteren canlı tezgâh defteri.', pro: 'BIST-30 devlerinde kademeler milyonlarca lira derindir; sığ tahtalarda ise boşluklar piyasa emrinde ağır kayma yaratır.' },
      { term: 'Sığ Tahta & Kayma (Slippage)', cat: 'Piyasa Fiziği', street: 'Az mal bulunan tezgâhta tek seferde büyük sipariş verince fiyatı kendi elinle yukarı çekip ekranda gördüğünden çok daha pahalıya almak.', pro: 'Günlük hacmi düşük hisselerde mutlaka LİMİT EMİR ve parçalı giriş kullanılır.' },
      { term: 'Nakit Dönüşüm Oranı (OCF/Net Kâr)', cat: 'Bilanço', street: 'Şirketin defterde açıkladığı her 100 TL net kârın kaç lirasının gerçekten akşam kasaya sıcak nakit olarak girdiğinin göstergesi.', pro: '1,0x ve üzeri üstün kasa kalitesidir; 0,5x altı veya negatifse kağıt kâr şüphesi doğar.' },
      { term: 'Temettü %50 İstisna & 400B ₺ Sınırı', cat: '2026 Mevzuat', street: 'BIST temettülerinin yarısının gelir vergisinden muaf olması sayesinde 2026’da brüt 800.000 ₺ (net 680.000 ₺) temettüye kadar ek beyanname gerekmemesi.', pro: 'Sınır aşılsa bile kaynakta kesilen %15 stopajın tamamı hesaplanan vergiden mahsup edilir.' },
      { term: '11734 Sayılı Karar (Kurumsal PPF)', cat: '2026 Mevzuat', street: '5 Eylül 2026’dan itibaren şirketlerin (tüzel kişilerin) para piyasası fonu kazançlarına %10 stopaj getiren düzenleme.', pro: 'Bireysel yatırımcıda PPF stopajı %17,5 devam ederken Kamu Sukuk/DİBS %0 avantajını korur.' },
      { term: '11444 Sayılı Karar (Sukuk %0)', cat: '2026 Mevzuat', street: 'Hazine Devlet Tahvili (DİBS) ve Kamu Kira Sertifikalarında %0 vergi avantajını 31 Aralık 2026’ya kadar uzatan Cumhurbaşkanı Kararı.', pro: 'Brüt getirinin tamamı net cebine kalır; yüksek faizde en güçlü sabit getiri kalkanıdır.' },
      { term: '11107 Sayılı Karar (Serbest Fon)', cat: '2026 Mevzuat', street: 'Mart 2026 itibarıyla TEFAS dışında kalan serbest hisse fonlarındaki %0 stopajı kaldırıp %17,5’e çıkaran karar.', pro: 'TEFAS’ta işlem gören yerli Hisse Senedi Yoğun Fonlar (MAC, IIH, TI2) hâlâ %0 stopajlıdır.' },
      { term: '10811 Sayılı Karar (BES %20)', cat: '2026 Mevzuat', street: '1 Ocak 2026 itibarıyla Bireysel Emeklilik devlet katkısını %20 (yıllık tavan 79.272 ₺) olarak belirleyen düzenleme.', pro: 'Maksimum katkı için 2026 yıllık brüt asgari ücret olan 396.360 ₺ sınırına kadar ödeme yapılır.' },
      { term: 'SMA-200 (200 Günlük Ortalama)', cat: 'Teknik & Döngü', street: 'Bir hissenin son 1 yıllık ortalama fiyatı; fiyat bunun çok üstündeyse fazla ısınmış, altında ama kasası sağlamsa indirim bölgesinde olabilir.', pro: 'Kurumsal fonların ana trend pusulasıdır; tek başına değil kasa kalitesiyle birlikte okunur.' },
      { term: 'RSI (Göreceli Güç Endeksi)', cat: 'Teknik & Döngü', street: 'Bir varlığın son 14 günde aşırı heyecanla şiştiğini (70 üstü) mü yoksa aşırı korkuyla satıldığını (30 altı) mı gösteren tansiyon ölçer.', pro: 'RSI 30 altı + güçlü OCF kasa kalitesi sabırlı yatırımcı için kademeli inceleme sinyalidir.' },
      { term: 'Güvenlik Marjı (Margin of Safety)', cat: 'Değerleme', street: '10 ton taşıyan köprüden 6 tonluk kamyonla geçmek gibi, ederi 100 TL hesapladığın sağlam şirketi 70 TL’den alarak hata payı bırakmak.', pro: 'Benjamin Graham ve Warren Buffett’ın temel ilkesi: Tahminin hafif şaşsa bile para kaybetmemeni sağlar.' },
      { term: 'Fiyat Alarmı & İzleme Listesi', cat: 'Strateji', street: 'Beğendiğin ama şu an pahalı bulduğun şirketi takibe alıp "şu fiyata düşerse bana haber ver" diye pusu kurmak.', pro: 'Ekran başında nöbet tutmadan disiplinli ve sabırlı giriş yapmanın en pratik yoludur.' }
    ];
  }

  // --------------------------------------------------------------------------
  // 15. HAM MALZEME TEZGÂHI (KENDİ SÜZGECİN), KAFA KAFAYA DÜELLO & KASA DEDEKTİFİ
  // --------------------------------------------------------------------------
  const CUSTOM_SCREENER_DEFS = [
    { id: 'OCF_REAL_CASH', icon: '🥖', short: 'Gerçek Kasa Nakdi', desc: 'Esas faaliyet nakdi pozitif (OCF > 0 & FCF ≥ 0) veya net sabit getiri üretenler' },
    { id: 'NET_CASH_VAULT', icon: '🛡️', short: 'Borçsuz / Net Nakit', desc: 'Kasasındaki hazır para toplam banka borcundan büyük olanlar veya sıfır borçlu varlıklar' },
    { id: 'DEEP_BOOK_DISCOUNT', icon: '🏷️', short: 'PD/DD ≤ 1,15x Ucuz', desc: 'Özsermaye (defter) değerinin altında veya hemen yakınında işlem görenler' },
    { id: 'HIGH_CAPITAL_RETURN', icon: '⚡', short: 'ROIC/ROE ≥ TÜFE', desc: 'Yatırdığı sermayeden enflasyonun üzerinde getiri üreten yüksek verimli işler' },
    { id: 'DRAWDOWN_HUNTER', icon: '🔥', short: 'Zirveden -%30+ İskonto', desc: '52 haftalık zirvesinden en az %30 geri çekilmiş yangın yeri adayları' },
    { id: 'SMART_MONEY_CMF', icon: '🐋', short: 'Kurumsal Giriş (CMF+)', desc: 'Son 20 günde Chaikin Para Akışı (CMF ≥ +0,08) ile kurumsal toplama izi olanlar' },
    { id: 'DIVIDEND_RIVER', icon: '💸', short: 'Temettü / Nakit Çarkı', desc: 'Yıllık ≥ %2,5 nakit temettü veya düzenli faiz/sukuk akışı sağlayanlar' },
    { id: 'ZERO_TAX_SHIELD', icon: '🏛️', short: '%0 Stopaj Kalkanı', desc: 'Kazanç üzerinden kaynakta %0 stopaj kesilen vergi avantajlı araçlar' },
    { id: 'CLEAN_GOVERNANCE', icon: '🔍', short: 'Sıfır Tuzak & Temiz MKK', desc: 'Patron lot satışı, hacim anomalisi ve TMS-29 kağıt kâr yanılsaması OLMAYANLAR' },
    { id: 'FX_EXPORT_ARMOR', icon: '🌍', short: 'Döviz / Altın / İhracat', desc: 'Doğrudan döviz/altın tabanlı veya güçlü ihracat/döviz gelir kalkanlı olanlar' }
  ];

  const EXPORT_HEAVY_SECTORS = new Set([
    'Havacılık & Lojistik', 'Otomotiv & Yan Sanayi', 'Savunma & Havacılık Sanayi',
    'Demir-Çelik & Metal', 'Beyaz Eşya & Mobilya', 'Madencilik & Altın', 'Tekstil & Hazır Giyim'
  ]);
  const EXPORT_FLAGSHIP_KEYS = new Set([
    'bist-tuprs', 'bist-enkai', 'bist-doco', 'bist-sise', 'bist-astor', 'bist-ccola', 'bist-aefes', 'bist-tkfen'
  ]);

  function matchesSingleScreenerRule(asset, ruleId, infPct) {
    if (!asset || asset.venue === 'BENCHMARK_ONLY') return false;
    const r = asset.bistRow || {};
    const fn = asset.fundamentals || {};
    const ocf = r.ocfMillionTL ?? (fn.ocf != null ? Number(fn.ocf) / 1e6 : null);
    const fcf = r.fcfMillionTL ?? (fn.fcf != null ? Number(fn.fcf) / 1e6 : null);
    const roic = r.roic ?? fn.roic ?? null;
    const roe = r.roe ?? fn.roe ?? null;
    const pb = r.pb ?? fn.pb ?? asset.pb ?? null;
    const cmf = r.cmf20 ?? fn.cmf ?? asset.cmf20 ?? null;
    const dd52 = r.drawdown52WPct ?? computeRange52W(asset)?.drawdownPct ?? null;
    const divYld = Number(r.dividendYield ?? fn.divYield ?? asset.divYieldPct) || 0;
    const secStr = String(r.sector || asset.sector || '');

    switch (ruleId) {
      case 'OCF_REAL_CASH':
        if (asset.isRateInstrument) return (asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100)) >= infPct * 0.85;
        if (isFinancialEntityRow(r)) return roe != null && Number(roe) >= infPct * 0.85;
        return ocf != null && ocf > 0 && (fcf == null || fcf >= 0);
      case 'NET_CASH_VAULT':
        if (
          asset.isRateInstrument ||
          isPreciousMetalAsset(asset) ||
          asset.venue === 'TEFAS' ||
          asset.subVenue === 'BIST_EXEMPT_ETF' ||
          asset.subVenue === 'BIST_TAXABLE_ETF'
        ) return true;
        return Boolean(r.isNetCash || asset.isNetCash || (r.netDebtMillionTL != null && Number(r.netDebtMillionTL) <= 0));
      case 'DEEP_BOOK_DISCOUNT':
        return pb != null && Number(pb) > 0.05 && Number(pb) <= 1.15;
      case 'HIGH_CAPITAL_RETURN':
        if (asset.isRateInstrument) return (asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100)) >= infPct;
        return (roic != null && Number(roic) >= infPct * 0.80) || (roe != null && Number(roe) >= infPct);
      case 'DRAWDOWN_HUNTER':
        return dd52 != null && Number(dd52) <= -30;
      case 'SMART_MONEY_CMF':
        return cmf != null && Number(cmf) >= 0.08;
      case 'DIVIDEND_RIVER':
        return Boolean(
          asset.isRateInstrument ||
          asset.id === 'eurobond-usdtr' ||
          asset.id === 'eurobond-emb' ||
          divYld >= 2.5 ||
          (Number(r.dpsTL) > 0 && asset.priceTL > 0 && (r.dpsTL / asset.priceTL) * 100 >= 2.5)
        );
      case 'ZERO_TAX_SHIELD':
        return (Number(asset.stopajPct) || 0) === 0 && !asset.isForeignUsd;
      case 'CLEAN_GOVERNANCE':
        return !asset.isPatronSelling && !asset.isPumpAnomaly && !asset.isTms29Illusion && getQuickForensicScore(asset) >= 62;
      case 'FX_EXPORT_ARMOR':
        return isFxLinkedShieldAsset(asset) || Boolean(asset.fxFortressRecord) || EXPORT_HEAVY_SECTORS.has(secStr) || EXPORT_FLAGSHIP_KEYS.has(String(asset.key));
      default:
        return true;
    }
  }

  function runCustomScreener(activeFilterIds = [], searchText = '') {
    const K = global.AetherKernelV10;
    if (!K) return { defs: CUSTOM_SCREENER_DEFS, activeFilterIds: [], totalUniverse: 0, matchedCount: 0, items: [] };
    const infPct = K.getAnnualInflationPct ? K.getAnnualInflationPct() : 29.77;
    const validIds = Array.isArray(activeFilterIds)
      ? activeFilterIds.filter((id) => CUSTOM_SCREENER_DEFS.some((d) => d.id === id))
      : [];
    const q = String(searchText || '').trim().toLocaleLowerCase('tr-TR');
    const all = K.getAllAssets().filter((a) => a.venue !== 'BENCHMARK_ONLY');

    const matched = [];
    for (const a of all) {
      const r = a.bistRow || {};
      const fn = a.fundamentals || {};
      if (q) {
        const hay = `${a.ticker} ${a.name} ${r.sector || a.sector || ''} ${a.categoryName || ''}`.toLocaleLowerCase('tr-TR');
        if (!hay.includes(q)) continue;
      }
      let ok = true;
      for (const fid of validIds) {
        if (!matchesSingleScreenerRule(a, fid, infPct)) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      const fScore = getQuickForensicScore(a);
      const tags = [];
      const isNC = Boolean(r.isNetCash || a.isNetCash || (r.netDebtMillionTL != null && Number(r.netDebtMillionTL) < 0));
      const pbV = r.pb ?? fn.pb ?? a.pb;
      const ddV = r.drawdown52WPct ?? computeRange52W(a)?.drawdownPct;
      const cmfV = r.cmf20 ?? fn.cmf ?? a.cmf20;
      const divV = Number(r.dividendYield ?? fn.divYield) || 0;
      if (isNC) tags.push('Net Nakit');
      if (pbV != null && Number(pbV) > 0) tags.push(`PD/DD ${Number(pbV).toFixed(2)}x`);
      if (ddV != null && Number(ddV) <= -15) tags.push(`52H ${Number(ddV).toFixed(0)}%`);
      if (cmfV != null && Number(cmfV) >= 0.08) tags.push(`CMF +${Number(cmfV).toFixed(2)}`);
      if (divV >= 2.5) tags.push(`Temettü %${divV.toFixed(1)}`);
      if ((a.stopajPct || 0) === 0 && !a.isForeignUsd) tags.push('%0 Stopaj');
      matched.push({ asset: a, forensicScore: fScore, tags: tags.slice(0, 3) });
    }

    matched.sort((x, y) => {
      const tx = Number(x.asset.turnoverMillionTL ?? x.asset.bistRow?.turnoverMillionTL) || 0;
      const ty = Number(y.asset.turnoverMillionTL ?? y.asset.bistRow?.turnoverMillionTL) || 0;
      const sx = (x.forensicScore || 55) + (x.asset.isCore ? 8 : 0) + Math.min(12, tx / 350);
      const sy = (y.forensicScore || 55) + (y.asset.isCore ? 8 : 0) + Math.min(12, ty / 350);
      return sy - sx;
    });

    return {
      defs: CUSTOM_SCREENER_DEFS,
      activeFilterIds: validIds,
      totalUniverse: all.length,
      matchedCount: matched.length,
      items: matched
    };
  }

  function compareAssetsHeadToHead(keyA, keyB, capitalTL = 100000) {
    const K = global.AetherKernelV10;
    if (!K) return null;
    const a = K.getAsset(keyA);
    const b = K.getAsset(keyB);
    if (!a || !b) return null;
    const infPct = K.getAnnualInflationPct ? K.getAnnualInflationPct() : 29.77;
    const cap = Math.max(10000, Number(capitalTL) || 100000);

    const calcReal1Y = (x) => {
      const nom = x.isRateInstrument
        ? (Number(x.annualGrossRatePct || 0) * (1 - (Number(x.stopajPct) || 0) / 100))
        : (Number(x.perf1Y) || 0);
      return +((((1 + nom / 100) / (1 + infPct / 100)) - 1) * 100).toFixed(1);
    };

    const calcAnnualCash100k = (x) => {
      if (x.isRateInstrument) {
        const netRate = Number(x.annualGrossRatePct || 0) * (1 - (Number(x.stopajPct) || 0) / 100);
        return { val: Math.round(cap * (netRate / 100)), label: `+${Math.round(cap * (netRate / 100)).toLocaleString('tr-TR')} ₺ Net Getiri` };
      }
      const fScale = computeFinancial100kScale(x, cap);
      if (fScale && fScale.annualNetProfitTL != null) {
        const v = Math.round(fScale.annualNetProfitTL);
        return { val: v, label: `${v >= 0 ? '+' : ''}${v.toLocaleString('tr-TR')} ₺ Özkaynak Kârı` };
      }
      const bScale = computeBakery100kScale(x, cap);
      if (bScale && bScale.annualOcfTL != null) {
        const v = Math.round(bScale.annualOcfTL);
        return { val: v, label: `${v >= 0 ? '+' : ''}${v.toLocaleString('tr-TR')} ₺ Kasa OCF` };
      }
      if (bScale && bScale.annualNetProfitTL != null) {
        const v = Math.round(bScale.annualNetProfitTL);
        return { val: v, label: `${v >= 0 ? '+' : ''}${v.toLocaleString('tr-TR')} ₺ Net Kâr Payı` };
      }
      if (x.id === 'eurobond-usdtr' || x.id === 'eurobond-emb') {
        const v = Math.round(cap * 0.056);
        return { val: v, label: `+${v.toLocaleString('tr-TR')} ₺ Kupon/Getiri` };
      }
      const divPct = Number(x.bistRow?.dividendYield ?? x.fundamentals?.divYield ?? x.divYieldPct) || 0;
      if (divPct > 0) {
        const v = Math.round(cap * (divPct / 100) * 0.85);
        return { val: v, label: `+${v.toLocaleString('tr-TR')} ₺ Net Temettü` };
      }
      return { val: 0, label: 'Saf Değer Artışı (0 ₺ Akış)' };
    };

    const dPremPct = K.getDarphanePremiumInfo ? Number(K.getDarphanePremiumInfo()?.premiumPct || 0) : 0;

    const calcFrictionPct = (x) => {
      const stopaj = Number(x.stopajPct) || 0;
      const mgmt = Number(x.mgmtFeePct) || 0;
      if (x.subVenue === 'DARPHANE_S1') {
        if (dPremPct > 2.0) {
          return {
            score: Math.max(25, Math.round(95 - dPremPct * 3.2)),
            text: `+%${dPremPct.toFixed(1)} Darphane Primi · %0 Stopaj`
          };
        }
        return { score: 96, text: '%0 Stopaj · Spot Altına Yakın' };
      }
      if (x.venue === 'TWO_DOOR') return { score: 92, text: '%0,40 Çarşı Makası · %0 Stopaj' };
      if (x.isForeignUsd) return { score: 78, text: 'Yİ-ÜFE ≥%10 Beyan Kalkanı' };
      if (stopaj === 0) return { score: mgmt > 1 ? 90 : 97, text: `%0 Stopaj${mgmt > 0 ? ` · %${mgmt} Yön.Ücr.` : ''}` };
      return { score: Math.max(45, Math.round(92 - stopaj * 2.1 - mgmt * 3)), text: `%${stopaj} Stopaj${mgmt > 0 ? ` · %${mgmt} Ücret` : ''}` };
    };

    const calcLiquidity = (x) => {
      if (x.venue === 'CRYPTO_24_7' || x.venue === 'CRYPTO') return { score: 96, text: '7/24 Anında Nakit (T+0)' };
      if (x.subVenue === 'TEFAS_PPF') return { score: 94, text: '13:30 Öncesi T+0 Nakit' };
      if (x.venue === 'TWO_DOOR') return { score: 90, text: 'Gündüz Çarşı Anında Nakit' };
      if (x.venue === 'BIST') return { score: x.isBrutTakas ? 58 : 84, text: x.isBrutTakas ? 'VBTS Brüt Takas (T+2 Kilitli)' : 'Anında Eşleşme · T+2 Çekim' };
      if (x.venue === 'GLOBAL_USD') return { score: 82, text: 'ABD Seansı Anında · T+1 Takas' };
      if (x.venue === 'TEFAS') return { score: 74 - ((x.sellValorDays || 1) - 1) * 6, text: `13:30 Valör · T+${x.sellValorDays || 1} Bozum` };
      if (x.subVenue === 'TERM_DEPOSIT') return { score: 48, text: 'Vadeli Kilit (Erken Bozumda Faiz Yanar)' };
      return { score: 80, text: 'Seans İçinde Likit' };
    };

    const calcValuationMetric = (x, qX) => {
      if (x.isRateInstrument) {
        const netPct = +(Number(x.annualGrossRatePct || 0) * (1 - (Number(x.stopajPct) || 0) / 100)).toFixed(1);
        return { label: `Net %${netPct} / Yıl`, score: Math.max(40, Math.min(92, Math.round(62 + (netPct - infPct) * 2.2))) };
      }
      if (x.subVenue === 'DARPHANE_S1') {
        return {
          label: dPremPct >= 0 ? `Spot Altına +%${dPremPct.toFixed(1)} Primli` : `Spot Altına %${dPremPct.toFixed(1)} İskontolu`,
          score: Math.max(25, Math.min(95, Math.round(86 - dPremPct * 2.8)))
        };
      }
      const pb = x.bistRow?.pb ?? x.fundamentals?.pb ?? x.pb ?? null;
      const pe = x.bistRow?.pe ?? x.fundamentals?.pe ?? x.pe ?? null;
      const r52 = computeRange52W(x);
      if (pb != null && Number(pb) > 0) {
        const pbN = Number(pb);
        const peN = pe != null && Number(pe) > 0 ? Number(pe) : null;
        const lbl = peN ? `PD/DD ${pbN.toFixed(2)}x · F/K ${peN.toFixed(1)}x` : `PD/DD ${pbN.toFixed(2)}x`;
        let sc = 104 - pbN * 16;
        if (peN != null) sc += (peN <= 7 ? 8 : (peN >= 25 ? -8 : 0));
        if (qX?.marginOfSafetyPct != null) sc += Math.max(-10, Math.min(10, Number(qX.marginOfSafetyPct) * 0.2));
        return { label: lbl, score: Math.max(22, Math.min(97, Math.round(sc))) };
      }
      if (pe != null && Number(pe) > 0) {
        const peN = Number(pe);
        return { label: `F/K ${peN.toFixed(1)}x`, score: Math.max(25, Math.min(94, Math.round(100 - peN * 2.4))) };
      }
      if (r52 && r52.pct != null) {
        return {
          label: `52H Bant %${r52.pct} (${r52.drawdownPct}%)`,
          score: Math.max(35, Math.min(92, Math.round(88 - r52.pct * 0.35)))
        };
      }
      return { label: 'Spot Piyasa Değeri', score: 72 };
    };

    const calcDrawdown52 = (x, qX) => {
      if (x.isRateInstrument) return 0;
      const raw = x.bistRow?.drawdown52WPct ?? computeRange52W(x)?.drawdownPct ?? (qX?.cvar95Pct != null ? -Math.abs(Number(qX.cvar95Pct)) : -12);
      return Math.abs(Number(raw) || 0);
    };

    const r1A = calcReal1Y(a);
    const r1B = calcReal1Y(b);
    const cA = calcAnnualCash100k(a);
    const cB = calcAnnualCash100k(b);
    const fA = getQuickForensicScore(a) || (a.isRateInstrument ? 86 : (isPreciousMetalAsset(a) ? 88 : 74));
    const fB = getQuickForensicScore(b) || (b.isRateInstrument ? 86 : (isPreciousMetalAsset(b) ? 88 : 74));
    const frA = calcFrictionPct(a);
    const frB = calcFrictionPct(b);
    const lqA = calcLiquidity(a);
    const lqB = calcLiquidity(b);
    const qA = extractQuantitativePassport(a);
    const qB = extractQuantitativePassport(b);
    const ddA = calcDrawdown52(a, qA);
    const ddB = calcDrawdown52(b, qB);
    const vmA = calcValuationMetric(a, qA);
    const vmB = calcValuationMetric(b, qB);
    const valA = vmA.label;
    const valB = vmB.label;
    const valScoreA = vmA.score;
    const valScoreB = vmB.score;

    const rounds = [
      {
        title: '1Y Reel Alım Gücü (TÜFE Sonrası)',
        valA: `${r1A >= 0 ? '+' : ''}%${r1A}`,
        valB: `${r1B >= 0 ? '+' : ''}%${r1B}`,
        winner: Math.abs(r1A - r1B) < 0.8 ? 'TIE' : (r1A > r1B ? 'A' : 'B')
      },
      {
        title: '100B ₺ Ortaklıkta Yıllık Kasa Üretimi',
        valA: cA.label,
        valB: cB.label,
        winner: Math.abs(cA.val - cB.val) < 400 ? 'TIE' : (cA.val > cB.val ? 'A' : 'B')
      },
      {
        title: 'Bilanço & Kasa Sağlamlığı',
        valA: `${fA} / 100`,
        valB: `${fB} / 100`,
        winner: Math.abs(fA - fB) <= 2 ? 'TIE' : (fA > fB ? 'A' : 'B')
      },
      {
        title: 'Çarpan & Fiyat Konumu',
        valA: valA,
        valB: valB,
        winner: Math.abs(valScoreA - valScoreB) <= 4 ? 'TIE' : (valScoreA > valScoreB ? 'A' : 'B')
      },
      {
        title: 'Vergi & Makas Verimliliği',
        valA: frA.text,
        valB: frB.text,
        winner: Math.abs(frA.score - frB.score) <= 3 ? 'TIE' : (frA.score > frB.score ? 'A' : 'B')
      },
      {
        title: 'Likidite & Valör Hızı',
        valA: lqA.text,
        valB: lqB.text,
        winner: Math.abs(lqA.score - lqB.score) <= 4 ? 'TIE' : (lqA.score > lqB.score ? 'A' : 'B')
      },
      {
        title: 'Fırtına Dayanıklılığı (52H Düşüş)',
        valA: ddA <= 1 ? 'Anapara Sabit' : `-%${ddA.toFixed(1)}`,
        valB: ddB <= 1 ? 'Anapara Sabit' : `-%${ddB.toFixed(1)}`,
        winner: Math.abs(ddA - ddB) <= 2.5 ? 'TIE' : (ddA < ddB ? 'A' : 'B')
      }
    ];

    let winsA = 0, winsB = 0, ties = 0;
    for (const rd of rounds) {
      if (rd.winner === 'A') winsA++;
      else if (rd.winner === 'B') winsB++;
      else ties++;
    }

    const overallWinner = winsA > winsB ? 'A' : (winsB > winsA ? 'B' : 'TIE');
    let verdict = '';
    if (a.isRateInstrument !== b.isRateInstrument) {
      const rateSide = a.isRateInstrument ? a : b;
      const growthSide = a.isRateInstrument ? b : a;
      verdict = `Bu iki araç birbirinin rakibi değil, Halter (Barbell) portföyünün iki tamamlayıcı ucudur: Sıkı faiz ve belirsizlikte ${rateSide.ticker} düzenli nakit zırhı sağlar; faiz indirimi, büyüme veya kur döngüsünde ise ${growthSide.ticker} reel çarpan taşır.`;
    } else if (overallWinner === 'A') {
      verdict = `7 turun ${winsA}’sinde ${a.ticker} üstünlük kurdu. Özellikle kasa kalitesi (${fA}p) ve vergi/nakit terazisinde ${b.ticker} karşısında daha yüksek güvenlik marjı sunuyor.`;
    } else if (overallWinner === 'B') {
      verdict = `7 turun ${winsB}’sinde ${b.ticker} öne çıktı. Mevcut fiyatlama, kasa sağlamlığı (${fB}p) ve sürtünme maliyetinde ${a.ticker} karşısında daha avantajlı duruyor.`;
    } else {
      verdict = `${a.ticker} ve ${b.ticker} terazide başa baş (${winsA}–${winsB}) çıktı! Tek birine yüklenmek yerine sermayeyi ikisi arasında bölmek sektörel tekil riski azaltır.`;
    }

    return {
      assetA: a,
      assetB: b,
      winsA,
      winsB,
      ties,
      overallWinner,
      rounds,
      verdict
    };
  }

  function generateLiveKasaDuelRound(seedInput) {
    const K = global.AetherKernelV10;
    if (!K) return null;
    const allBist = K.getAllAssets().filter((a) => a.subVenue === 'BIST_STOCK' && a.bistRow && !isFinancialEntityRow(a.bistRow));

    const fortresses = [];
    const traps = [];
    for (const a of allBist) {
      const r = a.bistRow;
      const mcB = Number(r.marketCapBillionTL || a.marketCapBillionTL) || 0;
      if (r.ocfMillionTL == null || r.netIncomeMillionTL == null || !(mcB > 1.2)) continue;
      const fs = getQuickForensicScore(a);
      const fcf = r.fcfMillionTL != null ? r.fcfMillionTL : (r.ocfMillionTL - Math.abs(r.capexMillionTL || 0));
      if (
        fs >= 78 &&
        r.ocfMillionTL > 250 &&
        fcf > 0 &&
        r.ocfMillionTL >= r.netIncomeMillionTL * 0.85 &&
        !a.isPatronSelling &&
        !a.isTms29Illusion &&
        (r.isNetCash || (r.netDebtToEbitda != null && r.netDebtToEbitda <= 2.0))
      ) {
        fortresses.push(a);
      } else if (
        fs > 0 &&
        fs <= 46 &&
        ((r.netIncomeMillionTL > 50 && r.ocfMillionTL < -50) ||
          a.isTms29Illusion ||
          (r.ocfMillionTL < -150 && (r.netDebtToEbitda >= 3.8 || (r.currentRatio != null && r.currentRatio < 0.95))))
      ) {
        traps.push(a);
      }
    }

    if (fortresses.length === 0 || traps.length === 0) return null;

    let s = Math.abs(Math.floor(Number(seedInput) || Date.now())) || 1337;
    const nextRand = () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };

    const fort = fortresses[Math.floor(nextRand() * fortresses.length)];
    const trap = traps[Math.floor(nextRand() * traps.length)];
    const fortressOnLeft = nextRand() < 0.5;

    const buildAnonCard = (asset, codeLabel) => {
      const r = asset.bistRow;
      const mcM = Math.max(100, (Number(r.marketCapBillionTL || asset.marketCapBillionTL) || 1) * 1000);
      const scale100k = 100000 / (mcM * 1e6);
      const ocf100k = Math.round((Number(r.ocfMillionTL) || 0) * 1e6 * scale100k);
      const net100k = Math.round((Number(r.netIncomeMillionTL) || 0) * 1e6 * scale100k);
      const fcfM = r.fcfMillionTL != null ? Number(r.fcfMillionTL) : ((Number(r.ocfMillionTL) || 0) - Math.abs(Number(r.capexMillionTL) || 0));
      const fcf100k = Math.round(fcfM * 1e6 * scale100k);
      const debtText = r.isNetCash
        ? `Net Nakit Kalesi (${Math.abs(Math.round(r.netDebtMillionTL || 0)).toLocaleString('tr-TR')} Mn ₺ Fazla)`
        : (r.netDebtToEbitda != null ? `Net Borç / FAVÖK: ${Number(r.netDebtToEbitda).toFixed(1)}x` : `Net Borç: ${Math.round(r.netDebtMillionTL || 0).toLocaleString('tr-TR')} Mn ₺`);
      const boardClue = asset.isPatronSelling
        ? '⚠️ MKK’da Ortak Lot Artışı / Negatif CMF'
        : ((Number(r.cmf20) || 0) >= 0.05 ? `Kurumsal Toplama (CMF +${Number(r.cmf20).toFixed(2)})` : `Dengeli / Nötr Akış (CMF ${Number(r.cmf20 || 0).toFixed(2)})`);

      return {
        codeLabel,
        clues: [
          { k: '100B ₺ Ortaklıkta Manşet Net Kâr', v: `${net100k >= 0 ? '+' : ''}${net100k.toLocaleString('tr-TR')} ₺ / yıl` },
          { k: '100B ₺ Ortaklıkta Gerçek Kasa Nakdi (OCF)', v: `${ocf100k >= 0 ? '+' : ''}${ocf100k.toLocaleString('tr-TR')} ₺ / yıl` },
          { k: 'Yatırım Sonrası Serbest Nakit (FCF)', v: `${fcf100k >= 0 ? '+' : ''}${fcf100k.toLocaleString('tr-TR')} ₺ / yıl` },
          { k: 'Borç & Kasa Zırhı', v: debtText },
          { k: 'PD/DD & Cari Oran', v: `PD/DD ${r.pb != null ? Number(r.pb).toFixed(2) + 'x' : '—'} · Cari ${r.currentRatio != null ? Number(r.currentRatio).toFixed(2) + 'x' : '—'}` },
          { k: 'Tahta Ayak İzi', v: boardClue }
        ],
        reveal: {
          key: asset.key,
          ticker: asset.ticker,
          name: asset.name,
          sector: r.sector || asset.sector || asset.categoryName || 'Borsa İstanbul',
          priceTL: asset.priceTL,
          perf1Y: asset.perf1Y,
          forensicScore: getQuickForensicScore(asset)
        }
      };
    };

    const leftCard = buildAnonCard(fortressOnLeft ? fort : trap, 'Şirket ALFA');
    const rightCard = buildAnonCard(fortressOnLeft ? trap : fort, 'Şirket BETA');
    const fr = fort.bistRow;
    const tr = trap.bistRow;

    return {
      roundId: 'duel_' + s.toString(36),
      left: leftCard,
      right: rightCard,
      optimalSide: fortressOnLeft ? 'LEFT' : 'RIGHT',
      whyWinner: `${fort.ticker} (${fort.name}) son 12 ayda kasasına +${Math.round(fr.ocfMillionTL).toLocaleString('tr-TR')} Milyon ₺ gerçek faaliyet nakdi koydu ve ${fr.isNetCash ? 'sıfır net borçla (Net Nakit)' : `sağlıklı borç çarpanıyla`} çalışıyor (Adli Röntgen: ${getQuickForensicScore(fort)}/100).`,
      whyLoser: `${trap.ticker} (${trap.name}) ise ${tr.netIncomeMillionTL > 0 && tr.ocfMillionTL < 0 ? `manşette +${Math.round(tr.netIncomeMillionTL).toLocaleString('tr-TR')} Mn ₺ kağıt kâr gösterirken kasasından ${Math.round(tr.ocfMillionTL).toLocaleString('tr-TR')} Mn ₺ nakit yaktı!` : `esas faaliyetinden nakit üretemezken (${Math.round(tr.ocfMillionTL).toLocaleString('tr-TR')} Mn ₺ OCF) ağır borç/likidite baskısı taşıyor`} (Adli Röntgen: ${getQuickForensicScore(trap)}/100).`
    };
  }

  function computeFreedomWheelProjection(params = {}) {
    const startCapitalTL = Math.max(0, Number(params.startCapitalTL ?? 1000000));
    const monthlyAddTL = Math.max(0, Number(params.monthlyAddTL ?? 15000));
    const realAnnualReturnPct = Math.max(0, Math.min(30, Number(params.realAnnualReturnPct ?? 9)));
    const monthlyExpenseTL = Math.max(5000, Number(params.monthlyExpenseTL ?? 45000));
    const years = Math.max(1, Math.min(25, Math.round(Number(params.years ?? 10))));

    const rMonthly = Math.pow(1 + realAnnualReturnPct / 100, 1 / 12) - 1;
    // Güvenli reel çekim / pasif nakit akışı oranı (yıllık reel getiri oranının %75'i veya min %6 reel nakit verimi)
    const passiveRealYieldAnnual = Math.max(0.04, Math.min(0.14, (realAnnualReturnPct / 100) * 0.85));

    let realVault = startCapitalTL;
    let totalContributed = startCapitalTL;
    let freedomMonth = null;
    const milestones = [];

    for (let m = 1; m <= years * 12; m++) {
      realVault = realVault * (1 + rMonthly) + monthlyAddTL;
      totalContributed += monthlyAddTL;
      const monthlyPassiveRealTL = (realVault * passiveRealYieldAnnual) / 12;
      if (freedomMonth === null && monthlyPassiveRealTL >= monthlyExpenseTL) {
        freedomMonth = m;
      }
      if (m % 12 === 0) {
        const yr = m / 12;
        milestones.push({
          year: yr,
          realVaultTL: Math.round(realVault),
          contributedRealTL: Math.round(totalContributed),
          compoundedGainRealTL: Math.round(realVault - totalContributed),
          monthlyPassiveRealTL: Math.round(monthlyPassiveRealTL),
          expenseCoveragePct: Math.min(999, Math.round((monthlyPassiveRealTL / monthlyExpenseTL) * 100))
        });
      }
    }

    const last = milestones[milestones.length - 1] || {
      year: years,
      realVaultTL: Math.round(realVault),
      contributedRealTL: Math.round(totalContributed),
      compoundedGainRealTL: 0,
      monthlyPassiveRealTL: 0,
      expenseCoveragePct: 0
    };

    return {
      startCapitalTL,
      monthlyAddTL,
      realAnnualReturnPct,
      monthlyExpenseTL,
      years,
      freedomYears: freedomMonth != null ? +(freedomMonth / 12).toFixed(1) : null,
      finalRealVaultTL: last.realVaultTL,
      finalMonthlyPassiveRealTL: last.monthlyPassiveRealTL,
      finalCoveragePct: last.expenseCoveragePct,
      milestones
    };
  }

  // --------------------------------------------------------------------------
  // 16. v19.0.0 — 5 SANİYEDE ANLAŞILIR NET KARAR KATMANI, 5 KADEME TAHTA,
  //     5 SORUDA ŞİRKET RÖNTGENİ, SEPET KAYMA KOÇU & ÇOK AŞAMALI KARAR TATBİKATLARI
  // --------------------------------------------------------------------------
  function getPlainAssetVerdict(assetOrKey, customAmountTL = 100000) {
    const K = global.AetherKernelV10;
    const asset = typeof assetOrKey === 'string' ? K?.getAsset(assetOrKey) : assetOrKey;
    if (!asset || !K) return null;

    const amt = Math.max(1000, Math.round(Number(customAmountTL) || 100000));
    const score = getQuickForensicScore(asset) || 65;
    const dInfo = K.getDarphanePremiumInfo ? K.getDarphanePremiumInfo() : { premiumPct: 0, diffTL: 0 };
    const bk = computeBakery100kScale(asset, amt);
    const fn = computeFinancial100kScale(asset, amt);
    const sig = getCardQuickSignal(asset);

    let trafficLight = 'amber'; // green | amber | red
    let simpleLabel = 'Dengeli Seçenek';
    let simpleMeaning = sig?.oneLiner || 'Canlı piyasa fiyatıyla alınıp satılabilir yatırım aracı.';
    let cardSummary = sig?.badge || 'Canlı piyasa fiyatıyla işlem gören yatırım aracı.';
    let watchOut = 'Her yatırımda fiyat iniş çıkışları olur; tüm paranı tek yere koyma.';
    let termKeys = [];

    if (asset.subVenue === 'DARPHANE_S1' && dInfo.premiumPct >= 5) {
      trafficLight = 'red';
      simpleLabel = 'Dikkat: Fazladan Hava Parası Var!';
      simpleMeaning = `Kapalıçarşı’daki normal gram altına göre gram başına +${fmtInt(dInfo.diffTL)} ₺ (+%${dInfo.premiumPct}) daha pahalı satılıyor.`;
      cardSummary = `Dikkat: Fiziki gram altından +%${dInfo.premiumPct} (+${fmtInt(dInfo.diffTL)} ₺) pahalı!`;
      watchOut = 'Bu ekstra fark kapanırsa altın hiç düşmese bile zarar yazabilirsin. Yerine Fiziki Gram Altın incele.';
      termKeys = ['Hava Parası', 'Makas'];
    } else if (asset.isPumpAnomaly || asset.isTms29Illusion || asset.isPatronSelling || asset.distributionTrap) {
      trafficLight = 'red';
      simpleLabel = 'Kırmızı Uyarı: Riskli Kasa!';
      simpleMeaning = asset.isPatronSelling
        ? 'Şirketin büyük ortakları borsada hisse satmaya hazırlanıyor olabilir; dikkatli olmak şart.'
        : (asset.isTms29Illusion
          ? 'Kâğıt üstünde kâr yazıyor ama gerçekte dükkânın kasasından para eksiliyor!'
          : 'Tahtada olağandışı heyecan ve şişme var; kalabalığın gazıyla tepeden yakalanma riski yüksek.');
      cardSummary = asset.isPatronSelling
        ? 'Uyarı: MKK’da ortak pay satışı hazırlığı sinyali var.'
        : (asset.isTms29Illusion
          ? 'Uyarı: Kâğıt kâr var ama kasadan nakit çıkıyor!'
          : 'Uyarı: Aşırı şişme ve tepeden yakalanma riski.');
      watchOut = 'Sırf ucuz görünüyor ya da herkes konuşuyor diye atlamak parayı eritebilir.';
      termKeys = ['TMS-29', 'MKK', 'FOMO'];
    } else if (asset.isRateInstrument) {
      const netAnnual = +(asset.annualGrossRatePct * (1 - (asset.stopajPct || 0) / 100)).toFixed(1);
      const monthly = Math.round((amt * (netAnnual / 100)) / 12);
      const inf = K.getAnnualInflationPct ? K.getAnnualInflationPct() : 30;
      trafficLight = netAnnual >= inf - 2 ? 'green' : 'amber';
      simpleLabel = asset.stopajPct === 0 ? 'Güvenli Liman · %0 Vergi' : 'Düzenli Getiri · Güvenli';
      simpleMeaning = `${fmtInt(amt)} ₺ koyarsan her ay cebine vergi sonrası net ~+${fmtInt(monthly)} ₺ düzenli gelir damlar (yıllık net %${netAnnual}).`;
      cardSummary = `100 Bin ₺’ye ayda net +${fmtInt(Math.round((100000 * (netAnnual / 100)) / 12))} ₺ gelir (Net %${netAnnual}/yıl).`;
      watchOut = asset.subVenue === 'TERM_DEPOSIT'
        ? 'Vadeli mevduatı günü dolmadan erken bozarsan biriken bütün faiz yanar!'
        : (asset.id === 'kira-sertifikasi-sukuk'
          ? '11444 Sayılı Kararla doğrudan Hazine Kamu Sukuk’ta stopaj %0’dır (TEFAS Sukuk fonlarında %17,5 kesilir!). Hafta içi anında bağlanır.'
          : (asset.venue === 'TEFAS' ? 'Saat 13:30’dan sonra verirsen işlem 1 iş günü sonraya sarkar.' : 'Enflasyonun üzerinde kaldığı sürece alım gücünü korur.'));
      termKeys = asset.id === 'kira-sertifikasi-sukuk' ? ['Kamu Kira Sertifikası', 'Stopaj', 'Enflasyon'] : ['Stopaj', 'TEFAS 13:30 Valörü', 'Enflasyon'];
    } else if (asset.venue === 'TWO_DOOR') {
      trafficLight = 'green';
      simpleLabel = asset.categoryId === '2' ? 'Altın/Emtia Kalkanı' : 'Döviz Kalkanı';
      simpleMeaning = asset.id === 'gram-altin-spot'
        ? `Yüzlerce yıldır enflasyona ve krize karşı en sağlam koruma. Gündüz Kapalıçarşı’da %0 vergi ve dar makasla alabilirsin.`
        : `Paranı Türk Lirası dalgalanmalarına karşı korur; ama boşta dururken faiz veya temettü üretmez.`;
      cardSummary = asset.id === 'gram-altin-spot'
        ? 'Enflasyona karşı en sağlam zırh · Gündüz Çarşıda %0 vergi ve dar makas.'
        : 'Kur kalkanı sağlar · Gündüz Çarşıda %0 vergi, gece bankada açık makas.';
      watchOut = 'Akşam 17:30 sonrası veya hafta sonu mobil bankadan alırsan makas 6–8 kat açılır! Gündüz saatlerini bekle.';
      termKeys = ['Makas', 'BSMV', 'Başabaş Kuru'];
    } else if (bk) {
      if (score >= 76 && bk.annualOcfTL > 0) {
        trafficLight = 'green';
        simpleLabel = `Kaya Gibi Şirket (${score}/100)`;
        simpleMeaning = `Bu şirkete ${fmtInt(amt)} ₺ ortak olursan, mahalle fırını gibi kasasına senin payına günde +${fmtDec1(bk.dailyOcfTL)} ₺ (yılda +${fmtInt(bk.annualOcfTL)} ₺) gerçek sıcak para giriyor.`;
        cardSummary = `Kaya gibi kasa: 100 Bin ₺ paya günde +${fmtDec1(computeBakery100kScale(asset, 100000)?.dailyOcfTL || bk.dailyOcfTL)} ₺ sıcak nakit üretir.`;
        watchOut = bk.debtShareTL > bk.cashShareTL
          ? `Şirketin senin payına düşen ${fmtInt(bk.debtShareTL)} ₺ banka borcu var; yine de ürettiği nakit güçlü.`
          : 'Borsa fiyatları her gün inip çıkabilir; sağlam şirkete en az 6–12 ay sabırla ortak olunur.';
      } else if (bk.annualOcfTL < 0) {
        trafficLight = 'amber';
        simpleLabel = `Dikkatli İncele (${score}/100)`;
        simpleMeaning = `Bu şirketin son 1 yılda esas işinden kasasına nakit girmek yerine para çıkmış (${fmtInt(Math.abs(bk.annualOcfTL))} ₺).`;
        cardSummary = `Dikkat: Son 1 yılda esas işinden kasadan nakit çıkışı var.`;
        watchOut = 'Yeni fabrika kurmuyorsa, nakit yakan şirketler zor zamanlarda ortaklarını yorar.';
      } else {
        trafficLight = score >= 60 ? 'green' : 'amber';
        simpleLabel = score >= 60 ? `Sağlam İşletme (${score}/100)` : `Orta Düzey (${score}/100)`;
        simpleMeaning = `${fmtInt(amt)} ₺ ortaklığa karşılık şirketin esas işinden kasasına yılda +${fmtInt(bk.annualOcfTL)} ₺ nakit giriyor.`;
        cardSummary = `100 Bin ₺ ortaklığa yılda +${fmtInt(computeBakery100kScale(asset, 100000)?.annualOcfTL || bk.annualOcfTL)} ₺ kasa nakdi giriyor.`;
        watchOut = 'Tüm paranı tek bir hisseye bağlama; mutlaka altın veya kira sertifikası ile dengele.';
      }
      termKeys = ['OCF', 'FCF', 'F/K', 'T+2 Takas'];
    } else if (fn) {
      trafficLight = score >= 70 && fn.annualNetProfitTL > 0 ? 'green' : 'amber';
      simpleLabel = fn.annualNetProfitTL > 0 ? `Kârlı Finans Kurumu (${score}/100)` : `Kârlılık Baskıda (${score}/100)`;
      simpleMeaning = `${fmtInt(amt)} ₺ ortak olduğunda kurum senin payına yılda +${fmtInt(fn.annualNetProfitTL)} ₺ (günde +${fmtDec1(fn.dailyNetProfitTL)} ₺) net kâr üretiyor.`;
      cardSummary = `100 Bin ₺ paya günde +${fmtDec1(computeFinancial100kScale(asset, 100000)?.dailyNetProfitTL || fn.dailyNetProfitTL)} ₺ net kurum kârı üretir.`;
      watchOut = 'Bankalar ve sigorta şirketleri Merkez Bankası faiz kararlarından hızlı etkilenir.';
      termKeys = ['PD / DD', 'Net Faiz Marjı', 'Teknik Karşılık'];
    } else if (asset.venue === 'TEFAS') {
      trafficLight = asset.stopajPct === 0 ? 'green' : 'amber';
      simpleLabel = asset.stopajPct === 0 ? 'Profesyonel Sepet · %0 Vergi' : `Profesyonel Sepet · %${asset.stopajPct} Vergi`;
      simpleMeaning = asset.stopajPct === 0
        ? 'Tek başına 20–30 sağlam Türk şirketine birden ortak olursun; üstelik kazancından %0 vergi kesilir!'
        : `Uzmanlar senin yerine yabancı/karma sepet yönetir; ama satış kârından %${asset.stopajPct} stopaj kesilir.`;
      cardSummary = asset.stopajPct === 0
        ? '25+ sağlam Türk şirketinden hazır sepet · Kazançtan %0 vergi!'
        : `Uzman yönetimli hazır fon sepeti · Kârdan %${asset.stopajPct} stopaj.`;
      watchOut = `Saat 13:30 sınırı vardır; alımda ve satımda paranın hesaba geçmesi 1–3 iş günü (valör) sürer.`;
      termKeys = ['Hisse Senedi Yoğun Fon', 'TEFAS 13:30 Valörü', 'Stopaj'];
    } else if (asset.isForeignUsd) {
      trafficLight = 'amber';
      simpleLabel = asset.id.startsWith('eurobond-') ? 'Dolar Kupon Geliri' : 'Küresel Dolar Yatırımı';
      simpleMeaning = asset.id.startsWith('eurobond-')
        ? 'Devlete dolarla borç verip yılda 2 kez dolar kupon faizi alırsın; itfaya kadar tutarsan kur farkı vergisi 0 ₺’dir.'
        : 'Hem dünya devlerine ortak olursun hem de paran Dolar bazında korunur.';
      cardSummary = asset.id.startsWith('eurobond-')
        ? 'Dolar bazlı düzenli kupon faizi · 400 Bin ₺ altı kuponda %0 vergi.'
        : 'Dünya devlerine dolar bazlı ortaklık · Satışta Yİ-ÜFE %10 vergi kalkanı.';
      watchOut = asset.id.startsWith('eurobond-')
        ? '2026 kupon beyan sınırı 400.000 ₺’dir; vadeden önce satarsan kur farkına GVK Mük. 80 uygulanır.'
        : 'Satıp kâr ettiğinde ertesi yıl Mart ayında vergi beyannamesi gerekir (Yİ-ÜFE %10 geçerse vergi çok düşer!).';
      termKeys = asset.id.startsWith('eurobond-') ? ['Eurobond', 'CDS', 'GVK Mükerrer 80'] : ['GVK Mükerrer 80', 'Başabaş Kuru'];
    } else {
      trafficLight = score >= 70 ? 'green' : (score >= 48 ? 'amber' : 'red');
      simpleLabel = score >= 70 ? `Sağlam (${score}/100)` : (score >= 48 ? `Dengeli (${score}/100)` : `Yüksek Risk (${score}/100)`);
      cardSummary = sig?.badge || '7/24 yüksek oynaklıklı küresel piyasa varlığı.';
      termKeys = ['Kayıp Asimetrisi', 'Enflasyon'];
    }

    return { trafficLight, simpleLabel, simpleMeaning, cardSummary, watchOut, score, termKeys };
  }

  function getDailyHomeBriefing() {
    const K = global.AetherKernelV10;
    if (!K) return null;
    const md = K.getMarketData() || {};
    const clock = K.getTurkishClock();
    const dInfo = K.getDarphanePremiumInfo();
    const inf = K.getAnnualInflationPct();
    const usd = K.getUsdTry();
    const gold = K.getAsset('gram-altin-spot')?.priceTL || 6055;
    const bist = K.getAsset('bist-100');
    const sukuk = K.getAsset('kira-sertifikasi-sukuk');
    const be32 = computeBreakevenComparison(100000, 32);
    const dailyBurn1M = Math.round(1000000 * (Math.pow(1 + inf / 100, 1 / 365) - 1));
    const sukukNetMonthly1M = Math.round((1000000 * ((sukuk?.annualGrossRatePct || 36.5) / 100)) / 12);

    const bullets = [];
    if (dInfo.premiumPct >= 5) {
      bullets.push({
        icon: '🪙',
        tone: 'warn',
        title: `Altında Hava Parası Uyarısı (+%${dInfo.premiumPct})`,
        body: `Kapalıçarşı’da 1 gram fiziki altın ${fmtInt(gold)} ₺ iken borsadaki sertifikası (ALTIN.S1) ${fmtInt(dInfo.s1GramEquiv)} ₺. Yani borsada aynı altına gram başına ${fmtInt(dInfo.diffTL)} ₺ fazladan kâğıt parası ödeniyor!`
      });
    } else {
      bullets.push({
        icon: '🪙',
        tone: 'good',
        title: `Altın Terazisi Dengede (${fmtInt(gold)} ₺/gr)`,
        body: `Fiziki altın ile borsa sertifikası arasındaki fark dar. ${clock.grandBazaarOpen ? 'Şu an Kapalıçarşı açık (%0 vergi, dar makas).' : 'Gece/tatil saatinde mobil banka makası açık — acil değilse gündüzü bekle.'}`
      });
    }

    bullets.push({
      icon: '⚖️',
      tone: 'info',
      title: `Dolar mı, %0 Vergili Kira Sertifikası mı?`,
      body: `Bugün Dolar ${usd.toFixed(2)} ₺. %0 vergili Kamu Kira Sertifikası (Sukuk) 1 milyon liraya ayda net +${fmtInt(sukukNetMonthly1M)} ₺ veriyor. Dolar 32 gün sonra ${be32.breakevenUsdBazaar} ₺’yi geçmezse Sukuk daha çok kazandırır.`
    });

    bullets.push({
      icon: '🥖',
      tone: 'warn',
      title: `Enflasyon Saati: Boş Nakit Günde ~${fmtInt(dailyBurn1M)} ₺ Eriyor`,
      body: `Yıllık enflasyon %${inf.toFixed(1)}. Kenarda hiç çalışmayan 1 milyon lira, rakamı aynı kalsa bile pazarda her gün ~${fmtInt(dailyBurn1M)} ₺ alım gücü kaybediyor. En azından otomatik gecelik nemayı aç veya dengeli sepet kur!`
    });

    const trHour = Number(clock.hh != null ? clock.hh : (clock.hour != null ? clock.hour : 12));
    return {
      greeting: trHour < 12 ? 'Günaydın' : (trHour < 18 ? 'İyi günler' : 'İyi akşamlar'),
      sessionPlain: clock.bistCanMatchNow
        ? 'Borsa İstanbul şu an açık — canlı işlemler saniyesi saniyesine akıyor.'
        : (clock.isWeekend
          ? 'Hafta sonu: Borsa ve bankalar kapalı. Sadece kripto ve nöbetçi döviz açık.'
          : (clock.viopEvening
            ? 'Borsa kapalı, VİOP akşam seansı açık — yarın sabahın ilk ipuçları oluşuyor.'
            : 'Borsa şu an kapalı — akşam bilançoları inceleyip sabah 09:55 açılışına hazırlanma vakti.')),
      bullets,
      heroStats: [
        { key: 'gram-altin-spot', label: 'Gram Altın', val: fmtInt(gold) + ' ₺', chg: K.getAsset('gram-altin-spot')?.change1D || 0 },
        { key: 'doviz-usd', label: 'Dolar', val: usd.toFixed(2) + ' ₺', chg: K.getAsset('doviz-usd')?.change1D || 0 },
        { key: 'bist-100', label: 'Borsa (BIST)', val: fmtInt(bist?.priceTL || 11500), chg: bist?.change1D || 0 },
        { key: 'kira-sertifikasi-sukuk', label: 'Sukuk (%0 Vergi)', val: '%' + (sukuk?.annualGrossRatePct || 36.5).toFixed(1), chg: 0, badge: `TÜFE %${inf.toFixed(0)}` }
      ]
    };
  }

  function simulateMacroDominoWhatIf(params = {}) {
    const K = global.AetherKernelV10;
    if (!K) return null;
    const oilPct = Math.max(-40, Math.min(60, Number(params.oilDeltaPct) || 0));
    const usdPct = Math.max(-15, Math.min(45, Number(params.usdDeltaPct) || 0));
    const ratePts = Math.max(-12, Math.min(12, Number(params.rateDeltaPts) || 0));
    const droughtOn = Boolean(params.droughtShock);

    const me = K.getActiveMember();
    const snap = K.evaluateMemberPortfolio(me);

    // Sektörel duyarlılık matrisi (Ekonomik & Türkiye gerçek aktarımı)
    const sectors = [
      {
        id: 'refinery',
        name: 'Rafineri & Enerji (TÜPRAŞ)',
        icon: '🛢️',
        assetKey: 'bist-tuprs',
        pct: +(oilPct * 0.38 + usdPct * 0.55 - ratePts * 0.4).toFixed(1),
        why: oilPct > 0 ? 'Petrol yükseldikçe stok değerleme kazancı ve dolar bazlı rafineri geliri artar.' : 'Petrol düşerken stok kârı azalır ama talep canlı kalır.'
      },
      {
        id: 'airlines',
        name: 'Havacılık (THYAO / PGSUS)',
        icon: '✈️',
        assetKey: 'bist-thyao',
        pct: +(-oilPct * 0.42 + usdPct * 0.65 - ratePts * 0.35).toFixed(1),
        why: oilPct > 0 ? 'Jet yakıtı en büyük maliyet kalemidir; petrol artışı marjı sıkar, döviz geliri kısmen dengeler.' : 'Yakıt ucuzlayınca uçak başı kâr marjı hızla açılır!'
      },
      {
        id: 'banks',
        name: 'Bankalar & GYO (GARAN / EKGYO)',
        icon: '🏦',
        assetKey: 'bist-garan',
        pct: +(-ratePts * 2.1 - usdPct * 0.25 - oilPct * 0.08).toFixed(1),
        why: ratePts < 0 ? 'Faiz indikçe kredi talebi canlanır, tahvil portföyü değerlenir ve kâr marjı açılır!' : 'Faiz yükseldikçe fonlama maliyeti artar, kredi büyümesi yavaşlar.'
      },
      {
        id: 'insurance',
        name: 'Sigorta Kasaları (TURSG)',
        icon: '☂️',
        assetKey: 'bist-tursg',
        pct: +(ratePts * 1.45 - (droughtOn ? 4 : 0)).toFixed(1),
        why: ratePts > 0 ? 'Peşin toplanan prim havuzu (Float) yüksek faizde dev finansal gelir üretir!' : 'Faiz indikçe nakit havuzunun faiz geliri kademeli azalır.'
      },
      {
        id: 'exporters',
        name: 'İhracatçı Sanayi (FROTO / ASELS)',
        icon: '🚢',
        assetKey: 'bist-froto',
        pct: +(usdPct * 0.78 - oilPct * 0.12 - ratePts * 0.5).toFixed(1),
        why: usdPct > 0 ? 'Geliri Euro/Dolar, işçilik gideri TL olan ihracatçı rekabet gücü ve kur kârı kazanır!' : 'Döviz yatay kalırsa TL maliyet baskısı artar.'
      },
      {
        id: 'gold',
        name: 'Fiziki Gram Altın',
        icon: '🪙',
        assetKey: 'gram-altin-spot',
        pct: +(usdPct * 0.96 + Math.max(0, oilPct) * 0.14 + (droughtOn ? 2.5 : 0)).toFixed(1),
        why: 'Kur artışını neredeyse birebir yansıtır; jeopolitik ve petrol şoklarında güvenli liman talebi eklenir.'
      },
      {
        id: 'food_agro',
        name: 'Gıda, Tarım & Enerji (Baraj/Un)',
        icon: '🌾',
        assetKey: 'reel-perakende-bimas',
        pct: +(-oilPct * 0.18 + (droughtOn ? -8.5 : 0) + usdPct * 0.15).toFixed(1),
        why: droughtOn ? 'Kuraklık hidroelektrik üretimini düşürür, tarım maliyetini ve mutfak enflasyonunu 4–6 ay gecikmeli fırlatır!' : 'Mazot ve tarım girdisi sakinse gıda perakendesi nakit akışını korur.'
      }
    ];

    // Mutfak enflasyonu (mazottan domatese aktarım)
    const kitchenInflationShiftPct = +(Math.max(0, oilPct) * 0.16 + Math.max(0, usdPct) * 0.35 + (droughtOn ? 6.5 : 0)).toFixed(1);

    // Kullanıcının kendi portföyüne anlık TL etkisi
    let portfolioDeltaTL = 0;
    for (const sp of snap.spotItems) {
      const a = K.getAsset(sp.assetKey);
      let estPct = 0;
      if (a?.categoryId === '2' || a?.subVenue === 'DARPHANE_S1') estPct = sectors.find((x) => x.id === 'gold').pct;
      else if (String(a?.id || '').startsWith('doviz-') || a?.isForeignUsd) estPct = usdPct;
      else if (a?.bistRow?.sector === 'Bankacılık' || a?.bistRow?.sector === 'Gayrimenkul & GYO') estPct = sectors.find((x) => x.id === 'banks').pct;
      else if (a?.bistRow?.sector === 'Sigorta & Emeklilik') estPct = sectors.find((x) => x.id === 'insurance').pct;
      else if (a?.bistRow?.sector === 'Havacılık & Lojistik') estPct = sectors.find((x) => x.id === 'airlines').pct;
      else if (a?.bistRow?.sector === 'Petrol, Rafineri & Doğalgaz') estPct = sectors.find((x) => x.id === 'refinery').pct;
      else if (EXPORT_HEAVY_SECTORS.has(a?.bistRow?.sector || '')) estPct = sectors.find((x) => x.id === 'exporters').pct;
      else estPct = +(-ratePts * 0.9 + usdPct * 0.25 - oilPct * 0.15 - (droughtOn ? 2 : 0)).toFixed(1);
      portfolioDeltaTL += sp.netValTL * (estPct / 100);
    }
    const postNominalTL = Math.round(snap.totalNetWorthTL + portfolioDeltaTL);
    const postRealPurchasingTL = Math.round(postNominalTL / (1 + kitchenInflationShiftPct / 100));
    const realDeltaTL = postRealPurchasingTL - Math.round(snap.totalNetWorthTL);

    let streetVerdict = 'Değişkenleri kaydırarak mazot, dolar, faiz ve kuraklık dalgalarını canlı gözlemle.';
    if (oilPct >= 20) streetVerdict = `Mazot ve nakliye %${Math.round(oilPct * 0.55)} artınca pazardaki domates de havayollarının yakıt faturası da şişer; rafineri ve altın zırh görevi görür.`;
    else if (ratePts <= -5) streetVerdict = `Faiz ${Math.abs(ratePts)} puan indiğinde kredi muslukları gevşer: Bankalar, GYO’lar ve iç talep hisseleri nefes alır; sabit mevduat cazibesi azalır.`;
    else if (usdPct >= 15) streetVerdict = `Kur +%${usdPct} fırladığında boş TL nakit sessizce erir; altın, döviz ve ihracatçı fabrikalar kalkan olur.`;
    else if (droughtOn) streetVerdict = `Barajlar kuruduğunda elektrik maliyeti 3 ay sonra doğalgaz santrallerine kayar, 6 ay sonra mutfak enflasyonunu ateşler!`;

    return {
      oilPct,
      usdPct,
      ratePts,
      droughtOn,
      sectors: sectors.sort((a, b) => b.pct - a.pct),
      kitchenInflationShiftPct,
      portfolioDeltaTL: Math.round(portfolioDeltaTL),
      postNominalTL,
      realDeltaTL,
      streetVerdict
    };
  }

  function simulateSingleBasketDrop(params = {}) {
    const capitalTL = Math.max(100000, Number(params.capitalTL) || 1000000);
    const singleWeightPct = Math.max(10, Math.min(100, Number(params.singleWeightPct) || 100));
    const shockDropPct = Math.max(10, Math.min(80, Number(params.shockDropPct) || 50));

    // Tek sepette düşme senaryosu
    const singleLossTL = Math.round(capitalTL * (singleWeightPct / 100) * (shockDropPct / 100));
    const otherWeightPct = 100 - singleWeightPct;
    // Kalan para dengeli kalkanlarda (altın/sukuk) krizde +%4 tampon veriyor
    const cushionGainTL = Math.round(capitalTL * (otherWeightPct / 100) * 0.04);
    const endCapitalTL = capitalTL - singleLossTL + cushionGainTL;
    const netDropPct = +(((capitalTL - endCapitalTL) / capitalTL) * 100).toFixed(1);
    const recoveryNeededPct = endCapitalTL > 0 ? +(((capitalTL / endCapitalTL) - 1) * 100).toFixed(1) : 999;

    // 4 Parçalı Dengeli Sepet (Referans: %25'i aynı şoku yesin, %75'i sukuk/altın/farklı sektörde kalsın)
    const balLossTL = Math.round(capitalTL * 0.25 * (shockDropPct / 100));
    const balCushionTL = Math.round(capitalTL * 0.75 * 0.04);
    const balEndTL = capitalTL - balLossTL + balCushionTL;
    const balDropPct = +(((capitalTL - balEndTL) / capitalTL) * 100).toFixed(1);
    const balRecoveryPct = balEndTL > 0 ? +(((capitalTL / balEndTL) - 1) * 100).toFixed(1) : 0;

    return {
      capitalTL,
      singleWeightPct,
      shockDropPct,
      endCapitalTL,
      netLossTL: capitalTL - endCapitalTL,
      netDropPct,
      recoveryNeededPct,
      balEndTL,
      balDropPct,
      balRecoveryPct,
      savedByDiversifyingTL: Math.max(0, balEndTL - endCapitalTL)
    };
  }

  function getDailyQuickChallenge(customDateYmd) {
    const K = global.AetherKernelV10;
    const ymd = customDateYmd || (K?.getTurkishClock ? K.getTurkishClock().ymd : '2026-11-19');
    const all = getFieldCaseCatalog() || [];
    if (all.length === 0) return null;
    // Başlangıç ve orta seviye günlük pratik vakalarını öne çıkararak güne deterministik vaka seç
    const friendly = all.filter((c) => c.difficulty === 'Temel' || c.difficulty === 'Orta');
    const pool = friendly.length > 0 ? friendly : all;
    let hash = 0;
    for (let i = 0; i < ymd.length; i++) hash = ((hash * 31) + ymd.charCodeAt(i)) >>> 0;
    const picked = pool[hash % pool.length];
    return { dateYmd: ymd, fieldCase: picked };
  }

  function simulateBalancedBasketBuilder(params = {}) {
    const K = global.AetherKernelV10;
    const capitalTL = Math.max(50000, Number(params.capitalTL) || 1000000);
    const sukukPct = Math.max(0, Math.min(100, Number(params.sukukPct ?? 40)));
    const goldPct = Math.max(0, Math.min(100, Number(params.goldPct ?? 25)));
    const equityPct = Math.max(0, Math.min(100, Number(params.equityPct ?? 25)));
    const rawSum = sukukPct + goldPct + equityPct;
    const normFactor = rawSum > 100 ? (100 / rawSum) : 1;

    const wSukuk = Math.round(sukukPct * normFactor);
    const wGold = Math.round(goldPct * normFactor);
    const wEquity = Math.max(0, Math.min(100 - wSukuk - wGold, Math.round(equityPct * normFactor)));
    const wCash = Math.max(0, 100 - wSukuk - wGold - wEquity);

    const sukukRate = K?.getAsset('kira-sertifikasi-sukuk')?.annualGrossRatePct || 36.5;
    const repoNet = K?.getOvernightRepoNetAnnualPct ? K.getOvernightRepoNetAnnualPct() : 27.6;
    const infPct = K?.getAnnualInflationPct ? K.getAnnualInflationPct() : 29.8;

    const sukukTL = Math.round(capitalTL * (wSukuk / 100));
    const goldTL = Math.round(capitalTL * (wGold / 100));
    const equityTL = Math.round(capitalTL * (wEquity / 100));
    const cashTL = Math.max(0, capitalTL - sukukTL - goldTL - equityTL);

    // Tahmini aylık düzenli nakit akışı (%0 vergili Sukuk + gecelik nema + %3,2 net temettü ortalaması)
    const monthlyCashDripTL = Math.round(
      (sukukTL * (sukukRate / 100)) / 12 +
      (cashTL * (repoNet / 100)) / 12 +
      (equityTL * 0.032) / 12
    );

    // Beklenen yıllık nominal ve Fisher reel denge
    const estNominalAnnualPct = +(
      (wSukuk / 100) * sukukRate +
      (wGold / 100) * (infPct + 4.5) +
      (wEquity / 100) * (infPct + 11.0) +
      (wCash / 100) * repoNet
    ).toFixed(1);
    const estRealAnnualPct = +((((1 + estNominalAnnualPct / 100) / (1 + infPct / 100)) - 1) * 100).toFixed(1);

    // Sert Fırtına Testi (Borsa -%30 çöktüğünde, kur/altın +%12 koruma verdiğinde, Sukuk/PPF +%3 aylık taşıdığında)
    const crisisDeltaTL = Math.round(
      equityTL * (-0.30) +
      goldTL * (+0.12) +
      sukukTL * (+0.03) +
      cashTL * (+0.022)
    );
    const crisisDeltaPct = +((crisisDeltaTL / capitalTL) * 100).toFixed(1);

    let comfortLabel = 'Çok Rahat Uyku';
    let comfortTone = 'good';
    let mentorAdvice = 'Hem her ay düzenli nakit damlıyor, hem kur/enflasyon şokuna karşı altın zırhın var, hem de sağlam fabrikalara ortaksın.';
    if (wEquity >= 70) {
      comfortLabel = 'Yüksek Dalga';
      comfortTone = 'warn';
      mentorAdvice = 'Hisse ağırlığın yüksek: Uzun vadede büyüme gücü yüksek ama -%30 borsa fırtınasında uykun kaçmamalı!';
    } else if (wCash >= 50 && wSukuk < 20) {
      comfortLabel = 'Atıl Nakit Riski';
      comfortTone = 'warn';
      mentorAdvice = 'Paranın yarısından fazlası dışarıda bekliyor; %0 vergili Kamu Kira Sertifikası veya Altın ile enflasyon zırhını güçlendir.';
    } else if (wGold >= 70) {
      comfortLabel = 'Sadece Koruma (Nakit Akışı Düşük)';
      comfortTone = 'info';
      mentorAdvice = 'Altın enflasyondan korur ama her ay kira/temettü ödemez; yanına %0 vergili Sukuk veya temettü şirketi eklemek çarkı döndürür.';
    }

    return {
      capitalTL,
      wSukuk, wGold, wEquity, wCash,
      sukukTL, goldTL, equityTL, cashTL,
      monthlyCashDripTL,
      estNominalAnnualPct,
      estRealAnnualPct,
      crisisDeltaTL,
      crisisDeltaPct,
      comfortLabel,
      comfortTone,
      mentorAdvice,
      buckets: [
        { id: 'SUKUK', icon: '🛡️', label: '%0 Vergili Sabit Gelir', pct: wSukuk, amountTL: sukukTL, sampleKeys: ['kira-sertifikasi-sukuk', 'dibs-tahvil', 'para-piyasasi-fonu'] },
        { id: 'GOLD', icon: '🪙', label: 'Altın & Döviz Zırhı', pct: wGold, amountTL: goldTL, sampleKeys: ['gram-altin-spot', 'doviz-usd', 'eurobond-usdtr'] },
        { id: 'EQUITY', icon: '🥖', label: 'Sağlam Şirket & Fon', pct: wEquity, amountTL: equityTL, sampleKeys: ['tefas-mac', 'bist-tuprs', 'bist-froto', 'reel-perakende-bimas'] },
        { id: 'CASH', icon: '💧', label: 'Fırsat Cephanesi (Nakit)', pct: wCash, amountTL: cashTL, sampleKeys: ['para-piyasasi-fonu'] }
      ]
    };
  }

  function getKapForensicReaderScenarios() {
    return [
      {
        id: 'kap_new_contract',
        badge: 'KAP · Yeni İş İlişkisi',
        headline: '"Şirketimiz yurt dışı müşteri ile 12.500.000 USD tutarında yeni sözleşme imzalamıştır!"',
        amateurTrap: 'Acemi rakamın büyüklüğüne kanıp "Tavan gidecek!" diye açılışta serbest emirle atlar.',
        verdictTone: 'amber',
        verdictTitle: 'Önce Ciro Oranına ve MKK Takasına Bak!',
        checks: [
          '1) Sözleşme tutarı şirketin SON YILLIK CİROSUNUN yüzde kaçı? (%2 ise küçük rutin iştir; %25+ ise gerçek katalizördür!)',
          '2) Teslimat 3 aya mı yayılıyor yoksa 4 yıla mı? Peşin kapora ("340 Alınan Sipariş Avansları") kasaya girdi mi?',
          '3) Aynı hafta MKK’da ortakların "Borsada İşlem Gören Tipe Dönüşüm" başvurusu var mı?'
        ],
        sampleKeys: ['bist-asels', 'reel-enerji-astor', 'bist-gesan']
      },
      {
        id: 'kap_mkk_conversion',
        badge: 'KAP · MKK Pay Dönüşümü',
        headline: '"Ortaklarımızca 18.000.000 adet payın Borsada İşlem Gören Niteliğe Dönüştürülmesi için MKK’ya başvurulmuştur."',
        amateurTrap: 'Acemi bu teknik cümleyi anlamayıp geçer veya sosyal medyadaki parlak söylentilere inanmaya devam eder.',
        verdictTone: 'red',
        verdictTitle: 'Kırmızı Alarm: Arka Kapıdan Arz Hazırlığı!',
        checks: [
          '1) Kapalı ortak payları durup dururken açık paya çevrilmez — borsada satılabilir hale getiriliyordur!',
          '2) Dönüşen lot sayısı şirketin mevcut "Fiili Dolaşımdaki Pay" adedinin %10’undan büyükse ağır satış baskısı yaratır.',
          '3) İstisna: Paylar kurumsal yabancı fona "Borsa Dışı Özel Emirle" ve 180 gün satmama şartıyla mı devrediliyor?'
        ],
        sampleKeys: ['reel-yazilim-miatk', 'bist-mpark', 'bist-100']
      },
      {
        id: 'kap_share_buyback',
        badge: 'KAP · Pay Geri Alım Programı',
        headline: '"Yönetim Kurulumuz şirket kasasından 2.500.000.000 ₺ fon ayırarak Pay Geri Alım Programı başlatmıştır."',
        amateurTrap: 'Acemi tahtada hisse fiyatı 3 aydır yatay/düşük diye sıkılıp elindeki sağlam malı tam patron toplarken satar!',
        verdictTone: 'green',
        verdictTitle: 'Yeşil Işık: Patron Kendi Dükkânını Ucuz Bulup Topluyor!',
        checks: [
          '1) Sadece yönetim kurulu kararı alındı mı, yoksa gerçekten her hafta KAP’a alım dekontu ("X fiyattan Y lot geri alındı") düşüyor mu?',
          '2) Geri alım kredi çekerek mi yapılıyor, yoksa şirketin kendi serbest nakit akışıyla (FCF > 0) mı?',
          '3) Hisse aynı anda PD/DD ve FD/FAVÖK bazında 5 yıllık ortalamasının altında mı?'
        ],
        sampleKeys: ['bist-bimAS', 'reel-perakende-bimas', 'bist-sise', 'bist-enkai'].filter((x, i) => i > 0)
      },
      {
        id: 'kap_bedelli_fon_kullanim',
        badge: 'KAP · Bedelli Fon Kullanım Raporu',
        headline: '"Şirketimiz çıkarılmış sermayesini %200 Bedelli artırarak ortaklardan nakit toplayacaktır."',
        amateurTrap: 'Acemi ya "Bedelli kötüdür" diye büyüme yatırımını kaçırır ya da borç batağındaki şirkete ucuz diye rüçhan parası yatırır.',
        verdictTone: 'amber',
        verdictTitle: 'Tek Ölçü: KAP "Fon Kullanım Yeri Raporu"!',
        checks: [
          '1) Gelen nakdin %70+ kısmı YENİ FABRİKA / İHRACAT KAPASİTESİ / GES YATIRIMI için mi harcanacak? (Olumlu!)',
          '2) Yoksa gelen paranın tamamı vadesi geçmiş BANKA KREDİSİ FAİZİ yamamak için mi isteniyor? (Tehlike!)',
          '3) Elinde hisse varsa ".R" Rüçhan kuponunu son günden önce ya kullan ya da Rüçhan Pazarında sat — boş bırakırsan yanar!'
        ],
        sampleKeys: ['bist-eregl', 'bist-sasa', 'bist-hekTs'].map((x) => x.toLowerCase())
      },
      {
        id: 'kap_vuk_tax_declaration',
        badge: 'KAP · VUK Vergi Beyannamesi',
        headline: '"Vergi Dairesine sunulan geçici vergi beyannamesinde 4,8 Milyar ₺ faaliyet kârı bildirilmiştir (TMS-29 bilançosunda net kâr düşük görünmektedir)."',
        amateurTrap: 'Acemi sadece manşet TMS-29 net kârına bakıp F/K yüksek sanarak nakit basan fabrikayı ucuza kaptırır!',
        verdictTone: 'green',
        verdictTitle: 'Gizli Cevher: Vergi Dairesi Faturası Yalan Söylemez!',
        checks: [
          '1) TMS-29 bilançosunda duran varlığı (fabrikası/filosu) büyük şirketler yüksek enflasyon amortismanı yüzünden kağıt üstünde az kâr yazar.',
          '2) VUK Vergi Beyannamesi ve Nakit Akış Tablosundaki "Esas Faaliyet Nakdi (OCF)" oluk oluk sıcak para gösteriyorsa şirket kaya gibidir!',
          '3) Tam tersine TMS-29’da "Net Parasal Pozisyon Kazancı" ile kâr yazıp VUK’ta zarar eden borçlu şirketlerden uzak dur!'
        ],
        sampleKeys: ['bist-tcell', 'bist-thyao', 'bist-tuprs']
      },
      {
        id: 'kap_340_advances',
        badge: 'Bilanço · 340 Alınan Sipariş Avansları',
        headline: '"Bilanço Dipnotu: 340 Alınan Sipariş Avansları kalemi geçen yıla göre +%190 artarak 42 Milyar ₺’ye ulaşmıştır."',
        amateurTrap: 'Acemi bilançonun "Yükümlülükler" tarafında gördüğü bu rakamı banka borcu zanneder!',
        verdictTone: 'green',
        verdictTitle: 'Gelecek Yılın Garantili Cirosu Kasaya Peşin Girmiş!',
        checks: [
          '1) 340 kodu banka borcu DEĞİLDİR; müşterinin malı teslim almadan şirkete peşin yatırdığı kaporadır!',
          '2) Şirket bu peşin parayla sıfır faiz yüküyle hammadde alır; ürün teslim edildikçe bu satır doğrudan CİRO ve KÂRA dönüşür!',
          '3) Büyüklüğünü ölçmek için "Alınan Avanslar / Yıllık Ciro" oranına bak (%25 üstü muazzam sipariş görünürlüğüdür).'
        ],
        sampleKeys: ['bist-asels', 'reel-enerji-astor', 'gayrimenkul-konut-ekgyo']
      }
    ];
  }

  function lookupTermByKey(queryStr) {
    const q = String(queryStr || '').trim().toLocaleUpperCase('tr-TR');
    if (!q) return null;
    const lex = getStreetLexicon();
    let hit = lex.find((lx) => lx.term.toLocaleUpperCase('tr-TR') === q);
    if (!hit) hit = lex.find((lx) => lx.term.toLocaleUpperCase('tr-TR').startsWith(q));
    if (!hit) hit = lex.find((lx) => lx.term.toLocaleUpperCase('tr-TR').includes(q));
    if (!hit) hit = lex.find((lx) => (lx.term + ' ' + lx.street + ' ' + lx.pro).toLocaleUpperCase('tr-TR').includes(q));
    return hit || null;
  }

  // --------------------------------------------------------------------------
  // 17. v19.0.0 — 5 KADEME TAHTA DERİNLİĞİ & KAYMA (SLİPPAGE) SİMÜLATÖRÜ
  // --------------------------------------------------------------------------
  function computeOrderBookDepth(assetOrKey, orderAmountTL = 100000) {
    const K = global.AetherKernelV10;
    const asset = typeof assetOrKey === 'string' ? K?.getAsset(assetOrKey) : assetOrKey;
    if (!asset || !K || !(asset.priceTL > 0)) return null;
    if (asset.isRateInstrument || asset.venue === 'TEFAS' || asset.venue === 'BENCHMARK_ONLY') return null;

    const price = Number(asset.priceTL);
    const tick = asset.subVenue === 'BIST_STOCK'
      ? K.getBistTickSize(price)
      : +(Math.max(0.01, price * 0.0005)).toFixed(4);
    const r = asset.bistRow || {};
    const turnoverM = Number(r.turnoverMillionTL) || (asset.venue === 'TWO_DOOR' ? 2500 : (asset.venue === 'GLOBAL_USD' ? 4000 : (asset.venue === 'CRYPTO_24_7' ? 3500 : 120)));
    const fdpdM = Number(r.fdpdMillionTL) || turnoverM * 8;

    let liquidityTier = 'Orta Derinlik';
    let liquidityTone = 'info';
    let baseLevelTL = Math.max(25000, Math.min(8500000, turnoverM * 420));
    if (turnoverM >= 1200) {
      liquidityTier = 'Derin Tahta (BIST-30 / Küresel)';
      liquidityTone = 'good';
    } else if (turnoverM < 90 || fdpdM < 450) {
      liquidityTier = 'Sığ Tahta (Limit Emir Şart!)';
      liquidityTone = 'danger';
      baseLevelTL = Math.max(8000, turnoverM * 180);
    }

    // Deterministik ama gerçekçi 5 alış + 5 satış kademesi (sembol + fiyat bazlı hafif dalgalanma)
    let seed = 17;
    const symStr = String(asset.ticker || asset.key || 'AE');
    for (let i = 0; i < symStr.length; i++) seed = (seed * 31 + symStr.charCodeAt(i)) % 997;

    const bids = [];
    const asks = [];
    const midBid = asset.subVenue === 'BIST_STOCK' ? K.snapToBistTick(price) : +price.toFixed(4);
    const spreadTicks = liquidityTone === 'danger' ? 2 : 1;

    for (let lvl = 0; lvl < 5; lvl++) {
      const bidP = +(Math.max(tick, midBid - lvl * tick)).toFixed(asset.subVenue === 'BIST_STOCK' ? 2 : 4);
      const askP = +(midBid + (lvl + spreadTicks) * tick).toFixed(asset.subVenue === 'BIST_STOCK' ? 2 : 4);
      const multB = 0.72 + (((seed + lvl * 19) % 70) / 100) + lvl * 0.22;
      const multA = 0.70 + (((seed + lvl * 29 + 11) % 75) / 100) + lvl * 0.24;
      const bidTL = Math.round(baseLevelTL * multB);
      const askTL = Math.round(baseLevelTL * multA);
      const bidLots = Math.max(1, Math.round(bidTL / Math.max(0.01, bidP)));
      const askLots = Math.max(1, Math.round(askTL / Math.max(0.01, askP)));
      bids.push({ level: lvl + 1, priceTL: bidP, lots: bidLots, valueTL: bidTL });
      asks.push({ level: lvl + 1, priceTL: askP, lots: askLots, valueTL: askTL });
    }

    const maxLevelTL = Math.max(...bids.map((b) => b.valueTL), ...asks.map((a) => a.valueTL), 1);

    // Piyasa emrinde kademe kayması (slippage) hesabı
    const amt = Math.max(1000, Number(orderAmountTL) || 100000);
    let remTL = amt;
    let totalLots = 0;
    let totalSpent = 0;
    let levelsSwept = 0;
    for (const a of asks) {
      if (remTL <= 0) break;
      const takeTL = Math.min(remTL, a.valueTL);
      totalLots += takeTL / a.priceTL;
      totalSpent += takeTL;
      remTL -= takeTL;
      levelsSwept++;
    }
    if (remTL > 0) {
      const overflowPrice = asks[4].priceTL + tick * (liquidityTone === 'danger' ? 4 : 2);
      totalLots += remTL / overflowPrice;
      totalSpent += remTL;
      levelsSwept = 6;
    }
    const avgFillPriceTL = totalLots > 0 ? +(totalSpent / totalLots).toFixed(4) : asks[0].priceTL;
    const slippagePct = Math.max(0, +(((avgFillPriceTL / asks[0].priceTL) - 1) * 100).toFixed(2));
    const slippageTL = Math.round(amt * (slippagePct / 100));

    return {
      tick,
      turnoverMillionTL: +turnoverM.toFixed(1),
      liquidityTier,
      liquidityTone,
      bids,
      asks,
      maxLevelTL,
      orderAmountTL: amt,
      bestBidTL: bids[0].priceTL,
      bestAskTL: asks[0].priceTL,
      spreadPct: +(((asks[0].priceTL - bids[0].priceTL) / Math.max(0.01, bids[0].priceTL)) * 100).toFixed(2),
      avgFillPriceTL,
      levelsSwept,
      slippagePct,
      slippageTL,
      recommendLimit: liquidityTone === 'danger' || slippagePct >= 0.35
    };
  }

  // --------------------------------------------------------------------------
  // 18. v19.0.0 — 621 BIST ŞİRKETİ İÇİN "5 SORUDA ŞİRKET RÖNTGENİ & ADİL FİYAT"
  // --------------------------------------------------------------------------
  function computeFiveQuestionCompanyXray(assetOrKey) {
    const K = global.AetherKernelV10;
    const asset = typeof assetOrKey === 'string' ? K?.getAsset(assetOrKey) : assetOrKey;
    if (!asset || !K || !asset.bistRow) return null;

    const r = asset.bistRow;
    const inf = K.getAnnualInflationPct ? K.getAnnualInflationPct() : 30;
    const isFin = isFinancialEntityRow(r);
    const price = Number(asset.priceTL) || Number(r.close) || 1;
    const questions = [];

    // 1. Kasaya Gerçek Sıcak Para Giriyor mu?
    if (isFin) {
      const roe = Number(r.roe);
      const ok = Number.isFinite(roe) && roe >= inf * 0.9;
      questions.push({
        num: 1,
        q: 'Özsermayesi Enflasyonu Yeniyor mu?',
        tone: ok ? 'good' : (Number.isFinite(roe) && roe > 15 ? 'amber' : 'red'),
        verdict: Number.isFinite(roe)
          ? (ok ? `Evet! ROE %${roe.toFixed(1)} ile enflasyon (%${inf.toFixed(0)}) üstü büyüyor.` : `ROE %${roe.toFixed(1)} — enflasyonun (%${inf.toFixed(0)}) biraz gerisinde.`)
          : 'Özsermaye kârlılık verisi sınırlı.',
        badge: Number.isFinite(roe) ? `ROE %${roe.toFixed(1)}` : 'Finans'
      });
    } else {
      const ccr = Number(r.cashConversionRatio);
      const sloan = Number(r.sloanAccrualPct);
      const ocfPos = (r.ocfMillionTL || 0) > 0;
      const strongCash = ocfPos && ((Number.isFinite(ccr) && ccr >= 0.9) || (Number.isFinite(sloan) && sloan <= 3));
      const cashTrap = !ocfPos || (Number.isFinite(sloan) && sloan >= 14);
      questions.push({
        num: 1,
        q: 'Açıkladığı Kâr Gerçek Nakit mi?',
        tone: strongCash ? 'good' : (cashTrap ? 'red' : 'amber'),
        verdict: strongCash
          ? `Evet! Her 100 ₺ net kâra karşılık kasaya ${Number.isFinite(ccr) ? Math.round(ccr * 100) + ' ₺' : 'güçlü'} sıcak nakit giriyor (Sloan: ${Number.isFinite(sloan) ? (sloan >= 0 ? '+' : '') + sloan.toFixed(1) + '%' : 'temiz'}).`
          : (cashTrap
            ? `Dikkat! Kâğıt kâr ile nakit arası kopuk (OCF: ${fmtInt(r.ocfMillionTL || 0)} Mn ₺${Number.isFinite(sloan) ? `, Sloan +${sloan.toFixed(1)}%` : ''}).`
            : `Esas işten nakit üretiyor (OCF: ${fmtInt(r.ocfMillionTL || 0)} Mn ₺), nakit dönüşümü orta düzeyde.`),
        badge: Number.isFinite(ccr) ? `Nakit/Kâr ${ccr.toFixed(2)}x` : (ocfPos ? 'OCF (+)' : 'OCF (-)')
      });
    }

    // 2. Borcu ve Kısa Vade Nefesi Sağlam mı?
    const ndEbitda = Number(r.netDebtToEbitda);
    const curRatio = Number(r.currentRatio);
    if (isFin) {
      questions.push({
        num: 2,
        q: 'Defter Değeri & Sermaye Tamponu Nasıl?',
        tone: (r.pb || 2) <= 1.25 ? 'good' : ((r.pb || 2) <= 2.2 ? 'amber' : 'red'),
        verdict: `PD/DD ${r.pb != null ? r.pb.toFixed(2) + 'x' : '-'} seviyesinde; bankacılık ve sigortada özsermaye kalitesi + faiz marjı belirleyicidir.`,
        badge: r.pb != null ? `PD/DD ${r.pb.toFixed(2)}x` : 'Finans'
      });
    } else if (r.isNetCash || (Number.isFinite(ndEbitda) && ndEbitda <= 0)) {
      questions.push({
        num: 2,
        q: 'Borcunu Ödeyebiliyor mu?',
        tone: 'good',
        verdict: `Net Nakit Kalesi! Kasadaki hazır nakit (${fmtInt(r.cashMillionTL || 0)} Mn ₺) toplam banka borcundan (${fmtInt(r.totalDebtMillionTL || 0)} Mn ₺) fazla.`,
        badge: 'Net Nakit (+)'
      });
    } else if (Number.isFinite(ndEbitda) && ndEbitda <= 2.2) {
      questions.push({
        num: 2,
        q: 'Borcunu Ödeyebiliyor mu?',
        tone: 'good',
        verdict: `Yönetilebilir borç: Net borcunu ${ndEbitda.toFixed(1)} yıllık faaliyet kârıyla (FAVÖK) kapatabilir${Number.isFinite(curRatio) ? ` (Cari Oran: ${curRatio.toFixed(2)}x)` : ''}.`,
        badge: `Borç/FAVÖK ${ndEbitda.toFixed(1)}x`
      });
    } else {
      questions.push({
        num: 2,
        q: 'Borcunu Ödeyebiliyor mu?',
        tone: Number.isFinite(ndEbitda) && ndEbitda > 3.8 ? 'red' : 'amber',
        verdict: `Yüksek faizde borç yüküne dikkat: Net Borç/FAVÖK ${Number.isFinite(ndEbitda) ? ndEbitda.toFixed(1) + 'x' : 'yüksek'}${Number.isFinite(curRatio) ? ` · Cari Oran: ${curRatio.toFixed(2)}x` : ''}.`,
        badge: Number.isFinite(ndEbitda) ? `Borç/FAVÖK ${ndEbitda.toFixed(1)}x` : 'Borçlu'
      });
    }

    // 3. Parayı Verimli Çalıştırıyor mu? (ROIC / Yatırım Gücü)
    const roic = Number(r.roic);
    const ocfCapex = Number(r.ocfToCapexRatio);
    const verimOk = (Number.isFinite(roic) && roic >= 18) || (Number.isFinite(r.opMarginPct) && r.opMarginPct >= 14);
    questions.push({
      num: 3,
      q: 'Sermayeyi Verimli Çalıştırıyor mu?',
      tone: verimOk ? 'good' : (Number.isFinite(roic) && roic > 8 ? 'amber' : 'red'),
      verdict: Number.isFinite(roic)
        ? `Yatırılan her 100 ₺ sermayeden yılda %${roic.toFixed(1)} getiri (ROIC) üretiyor${Number.isFinite(ocfCapex) && ocfCapex > 0 ? ` · Yatırımlarını kendi nakdiyle ${ocfCapex.toFixed(1)}x karşılıyor.` : '.'}`
        : `Faaliyet kâr marjı: ${r.opMarginPct != null ? '%' + Number(r.opMarginPct).toFixed(1) : 'Sınırlı veri'}.`,
      badge: Number.isFinite(roic) ? `ROIC %${roic.toFixed(1)}` : (r.opMarginPct != null ? `Marj %${Number(r.opMarginPct).toFixed(1)}` : 'Verim')
    });

    // 4. Fiyatı Makul mü, Şişik mi? (Değerleme & 52H & SMA200)
    const evEb = Number(r.evEbitda);
    const dd52 = Number(r.drawdown52WPct) || 0;
    const sma200 = Number(r.sma200) || 0;
    const vsSma200Pct = sma200 > 0 ? +(((price / sma200) - 1) * 100).toFixed(1) : null;
    const cheapVal = (Number.isFinite(evEb) && evEb > 0 && evEb <= 7.5) || (r.pe > 0 && r.pe <= 10) || (r.pb > 0 && r.pb <= 1.25);
    const richVal = (Number.isFinite(evEb) && evEb >= 18) || (r.pb >= 5.5 && (!r.pe || r.pe > 30));
    questions.push({
      num: 4,
      q: 'Fiyatı Makul mü, Zirvede mi?',
      tone: cheapVal && !richVal ? 'good' : (richVal ? 'red' : 'amber'),
      verdict: `${Number.isFinite(evEb) && evEb > 0 ? `FD/FAVÖK ${evEb.toFixed(1)}x · ` : ''}F/K ${r.pe != null ? r.pe + 'x' : '-'} · PD/DD ${r.pb != null ? r.pb + 'x' : '-'}. 52H zirveden %${Math.abs(dd52).toFixed(1)} aşağıda${vsSma200Pct != null ? `, 200G ortalamaya göre ${vsSma200Pct >= 0 ? '+' : ''}%${vsSma200Pct}` : ''}.`,
      badge: dd52 <= -20 ? `Zirveden %${dd52.toFixed(0)}` : (Number.isFinite(evEb) && evEb > 0 ? `FD/FAVÖK ${evEb.toFixed(1)}x` : `PD/DD ${r.pb ?? '-'}`)
    });

    // 5. Tahta Sağlığı, Halka Açıklık & Para Akışı
    const floatPct = Number(r.floatPct);
    const cmf = Number(r.cmf20);
    const govBad = asset.isPatronSelling || asset.isPumpAnomaly || asset.distributionTrap;
    const govGood = !govBad && (!Number.isFinite(floatPct) || (floatPct >= 15 && floatPct <= 65)) && (Number.isFinite(cmf) ? cmf >= -0.05 : true);
    questions.push({
      num: 5,
      q: 'Tahta Sağlığı & Kurumsal İz Temiz mi?',
      tone: govBad ? 'red' : (govGood ? 'good' : 'amber'),
      verdict: govBad
        ? 'Kırmızı bayrak: MKK ortak satışı, aşırı şişme veya dağıtım anomalisi tespit edildi!'
        : `Halka açıklık %${Number.isFinite(floatPct) ? floatPct.toFixed(1) : '-'} · CMF-20 Para Akışı: ${Number.isFinite(cmf) ? (cmf >= 0 ? '+' : '') + cmf.toFixed(2) : '-'} · RSI: ${r.rsi != null ? Number(r.rsi).toFixed(0) : '-'}.`,
      badge: govBad ? 'MKK / Pump Uyarısı' : (Number.isFinite(cmf) && cmf >= 0.08 ? 'Para Girişi (+)' : `Açıklık %${Number.isFinite(floatPct) ? Math.round(floatPct) : '-'}`)
    });

    // Kademeli Hedef & Limit Alım Bandı (Güvenlik Marjı ile)
    const fairBase = sma200 > 0 ? (price * 0.5 + sma200 * 0.5) : price;
    const suggestedLimitBuyTL = K.snapToBistTick(Math.max(0.05, Math.min(price * 0.96, fairBase * 0.94)));
    const suggestedStopLossTL = K.snapToBistTick(Math.max(0.05, Math.min(price * 0.91, suggestedLimitBuyTL * 0.94)));
    const suggestedTakeProfitTL = K.snapToBistTick(price * 1.18);

    const greenCount = questions.filter((x) => x.tone === 'good').length;
    const redCount = questions.filter((x) => x.tone === 'red').length;

    return {
      ticker: asset.ticker,
      questions,
      greenCount,
      redCount,
      suggestedLimitBuyTL,
      suggestedStopLossTL,
      suggestedTakeProfitTL,
      summaryLine: redCount === 0 && greenCount >= 4
        ? `5 soruda ${greenCount} tam not: Kasa, borç ve fiyat dengesi sağlam.`
        : (redCount >= 2
          ? `5 soruda ${redCount} kırmızı uyarı var — acele etmeden tuzakları oku.`
          : `Dengeli tablo (${greenCount}/5 yeşil): Hedef fiyata Limit Emirle sabırlı giriş daha güvenli.`)
    };
  }

  // --------------------------------------------------------------------------
  // 19. v19.0.0 — MEVCUT PORTFÖY vs HEDEF SEPET KAYMA (REBALANCE) KOÇU
  // --------------------------------------------------------------------------
  function computePortfolioDriftPlan(snap, targetParams = {}) {
    const K = global.AetherKernelV10;
    if (!snap || !K) return null;
    const total = Math.max(100000, Math.round(snap.totalNetWorthTL || 1000000));
    const hb = simulateBalancedBasketBuilder({
      capitalTL: total,
      sukukPct: targetParams.sukukPct ?? 40,
      goldPct: targetParams.goldPct ?? 25,
      equityPct: targetParams.equityPct ?? 25
    });
    const ab = snap.allocationBreakdown || { fixedPct: 0, metalPct: 0, equityPct: 0, globalFxCryptoPct: 0, cashPct: 100 };
    const curSukukPct = +(ab.fixedPct || 0).toFixed(1);
    const curGoldPct = +((ab.metalPct || 0) + (ab.globalFxCryptoPct || 0)).toFixed(1);
    const curEquityPct = +(ab.equityPct || 0).toFixed(1);
    const curCashPct = +(ab.cashPct || 0).toFixed(1);

    const rows = [
      {
        id: 'SUKUK', icon: '🛡️', label: '%0 Vergili Sabit Gelir',
        curPct: curSukukPct, targetPct: hb.wSukuk,
        deltaPct: +(hb.wSukuk - curSukukPct).toFixed(1),
        deltaTL: Math.round(total * ((hb.wSukuk - curSukukPct) / 100)),
        actionKey: 'kira-sertifikasi-sukuk', actionTicker: 'SUKUK'
      },
      {
        id: 'GOLD', icon: '🪙', label: 'Altın & Döviz Zırhı',
        curPct: curGoldPct, targetPct: hb.wGold,
        deltaPct: +(hb.wGold - curGoldPct).toFixed(1),
        deltaTL: Math.round(total * ((hb.wGold - curGoldPct) / 100)),
        actionKey: 'gram-altin-spot', actionTicker: 'GRAM-ALTIN'
      },
      {
        id: 'EQUITY', icon: '🥖', label: 'Sağlam Şirket & Fon',
        curPct: curEquityPct, targetPct: hb.wEquity,
        deltaPct: +(hb.wEquity - curEquityPct).toFixed(1),
        deltaTL: Math.round(total * ((hb.wEquity - curEquityPct) / 100)),
        actionKey: 'tefas-mac', actionTicker: 'MAC'
      },
      {
        id: 'CASH', icon: '💧', label: 'Hazır Nakit Cephanesi',
        curPct: curCashPct, targetPct: hb.wCash,
        deltaPct: +(hb.wCash - curCashPct).toFixed(1),
        deltaTL: Math.round(total * ((hb.wCash - curCashPct) / 100)),
        actionKey: 'para-piyasasi-fonu', actionTicker: 'PPF'
      }
    ];
    const maxAbsDriftPct = Math.max(...rows.map((r) => Math.abs(r.deltaPct)));
    const needsRebalance = maxAbsDriftPct >= 8;
    const nextAction = rows.filter((r) => r.id !== 'CASH' && r.deltaTL >= 15000).sort((a, b) => b.deltaTL - a.deltaTL)[0] || null;
    return { hb, rows, maxAbsDriftPct, needsRebalance, nextAction };
  }

  // --------------------------------------------------------------------------
  // 20. v19.0.0 — 6 ÇOK AŞAMALI GERÇEK TÜRKİYE PİYASASI KARAR TATBİKATI
  //     (HER SENARYO 4 ZAMAN DİLİMİ · 1.000.000 ₺ SANAL TATBİKAT KASASI)
  // --------------------------------------------------------------------------
  function getInteractiveDecisionDrills() {
    return [
      {
        id: 'drill_tcmb_thursday',
        badge: 'Makro & Faiz',
        difficulty: 'Temel',
        title: 'Perşembe 14:00 TCMB Sürpriz Faiz Kararı Günü',
        subtitle: '13:30 TEFAS sınırından 18:05 kapanışına kadar 4 kritik hamlede 1.000.000 ₺ yönet.',
        startCapitalTL: 1000000,
        stages: [
          {
            clock: 'Perşembe · 13:15',
            headline: 'TCMB kararına 45 dk var; piyasa sabit bekliyor ama son enflasyon sürprizi nedeniyle sürpriz faiz indirimi veya sabit tutma ihtimali masada. 1.000.000 ₺ nakdin boşta.',
            choices: [
              { id: 'A', label: '13:30 TEFAS sınırını kaçırmadan 400B ₺’yi %0 vergili Kamu Sukuk + 250B ₺’yi Fiziki Altın yapıp 350B ₺’yi karar sonrası fırsat nakdi bırak.', deltaTL: 18000, score: 25, outcome: 'Mükemmel hazırlık! 13:30 valörünü kaçırmadın, hem %0 vergi kalkanın hem kur zırhın hem de karar anı cephanen hazır.' },
              { id: 'B', label: 'Tüm 1.000.000 ₺ ile yüksek kaldıraçlı banka hissesine kredili gir: "İndirim gelirse zengin olurum!"', deltaTL: -55000, score: 5, outcome: 'Yazı-tura kumarı! Karar öncesinde kaldıraçla tek yöne basmak, ters sürprizde seni Margin Call uçurumuna iter.' },
              { id: 'C', label: 'Hiçbir şey yapma, 13:45’te PPF almaya çalış.', deltaTL: -4000, score: 12, outcome: '13:30 TEFAS sınırını kaçırdın! PPF emrin yarına sarktı ve bugünün getirisini kaçırdın.' }
            ]
          },
          {
            clock: 'Perşembe · 14:00',
            headline: 'SON DAKİKA: TCMB faizi piyasa beklentisinin tersine +250 baz puan ARTIRDI! Banka hisseleri 2 dakikada -%4,5 düştü, Dolar hafif geri çekildi.',
            choices: [
              { id: 'A', label: 'Panikle elimdeki altını zararına satıp hemen borsadan çık.', deltaTL: -24000, score: 5, outcome: 'İlk 5 dakikanın algoritmik gürültüsünde panik satışı yaptın; hem makas yaktın hem dipten verdin.' },
              { id: 'B', label: 'İlk 15 dakika ekran tozunun inmesini bekle; yüksek faizden prim havuzu (Float) doğrudan kazanacak Sigorta (TURSG) ve %0 vergili Sukuk oranlarını incele.', deltaTL: 32000, score: 25, outcome: 'Usta refleksi! Faiz artışında banka marjı sıkışırken, peşin prim havuzunu yüksek faizde değerlendiren sigorta kasaları ve %0 Sukuk güçlenir!' },
              { id: 'C', label: 'Sosyal medyadaki "TCMB yanlış yaptı, dolar hemen 2 katına çıkacak!" çağrısıyla gece makaslı bankadan kredi çekip dolar al.', deltaTL: -42000, score: 0, outcome: 'Faiz artışı TL getirisini cazip hale getirirken borçla döviz kovalamak çifte faiz/kur darbesi vurdu.' }
            ]
          },
          {
            clock: 'Perşembe · 15:30',
            headline: 'TCMB metninde "sıkı duruş korunacak" mesajı netleşti. Piyasada 32 günlük Dolar başabaş kuru belirgin yükseldi; bazı kaliteli ihracatçılar -%5 iskontoya indi.',
            choices: [
              { id: 'A', label: 'Cephane nakdimin yarısıyla (175B ₺) OCF/Net Kâr > 1,3x olan net nakitli sağlam fabrikaya hedef fiyattan LİMİT ALIM koy.', deltaTL: 26000, score: 25, outcome: 'Harika! Kalabalık korkarken kaliteli kasayı kendi belirlediğin fiyattan kaymasız topladın.' },
              { id: 'B', label: 'Sığ bir yan tahtaya 350B ₺ piyasa (serbest) emri gönder.', deltaTL: -28000, score: 5, outcome: 'Sığ tahtada serbest emir 5 kademeyi yukarı süpürdü; daha aldığın saniye -%3,5 kayma yazdın.' },
              { id: 'C', label: 'Kalan tüm parayı vadesiz hesapta (%0 faiz) bırak.', deltaTL: -9000, score: 10, outcome: 'Yüksek faiz ve enflasyon ortamında vadesiz boş nakit her gün sessizce alım gücü kaybeder.' }
            ]
          },
          {
            clock: 'Perşembe · 17:55',
            headline: 'Kapanış seansına (18:00–18:05) 5 dakika kaldı. Günü sakin kapatma vakti.',
            choices: [
              { id: 'A', label: 'Portföyüm dengeli (Sukuk + Altın + Kaliteli Hisse), otomatik gecelik nemayı açık bırakıp ekranı kapatıyorum.', deltaTL: 14000, score: 25, outcome: 'Sakin ve profesyonel kapanış! Ekran nöbeti tutmadan gece de paran çalışmaya devam etti.' },
              { id: 'B', label: '18:01 kapanış eşleşmesinde serbest emirle gün içi 3 kez daha al-sat çevir.', deltaTL: -16000, score: 5, outcome: 'Gereksiz son dakika işlemi komisyon yaktı ve T+2 takas kilitlerini karmaşıklaştırdı.' },
              { id: 'C', label: 'Sabah açılışa kadar gece bankadan %3,8 makasla döviz çevirip yarın tekrar boz.', deltaTL: -38000, score: 0, outcome: 'Gece banka makası + %0,2 BSMV sadece 1 gecede %4 sermaye yaktı!' }
            ]
          }
        ]
      },
      {
        id: 'drill_ebdks_crash',
        badge: 'Kriz & Devre Kesici',
        difficulty: 'Temel',
        title: 'BIST -%6 EBDKS Devre Kesici & Panik Günü',
        subtitle: 'Ani jeopolitik haberle tüm borsa tek kademe -%6 devre kesiciye girdiğinde soğukkanlılığını sına.',
        startCapitalTL: 1000000,
        stages: [
          {
            clock: 'Salı · 11:22',
            headline: 'Boğaz trafiğinde ani kriz haberi düştü! BIST 100 dakikalar içinde -%6,1 geriledi ve 2025/2026 tek kademe EBDKS devre kesicisi 10 dakikalığına tüm borsayı durdurdu.',
            choices: [
              { id: 'A', label: '10 dakikalık molayı panik için değil analiz için kullan: Elimdeki şirketlerin kasasını, borcunu ve enerji/kur etkisini soğukkanlılıkla kontrol et.', deltaTL: 15000, score: 25, outcome: 'EBDKS’nin varlık amacı budur! 10 dakika nefes alıp sağlam kasayla borçlu şirketi ayırdın.' },
              { id: 'B', label: 'Devre kesici açıldığı saniye bütün sağlam hisselerimi taban fiyatına serbest satış yaz!', deltaTL: -78000, score: 0, outcome: 'En klasik panik hatası! Açılış eşleşmesinde robotlar senin tabana attığın sağlam malı ucuza topladı; 2 saat sonra fiyat %4 toparladı.' },
              { id: 'C', label: 'Vadeli 32 günlük mevduatımı 25. günde erken bozup borsaya koş.', deltaTL: -26000, score: 5, outcome: 'Vadeden önce bozduğun için 25 günlük birikmiş tüm faizin sıfırlandı! Acil cephane PPF veya gecelik nemada tutulur.' }
            ]
          },
          {
            clock: 'Salı · 11:35',
            headline: 'EBDKS bitti, tahtalar yeniden açıldı. Kalabalık korkuyla her şeyi satıyor; ama net nakitli rafineri (TUPRS) ve fiziki altın dengeli duruyor, borçlu şirketler tabanda.',
            choices: [
              { id: 'A', label: 'Fırsat cephanemin 1/3’ü ile 52H zirveden -%30 düşmüş, OCF > 0 ve Net Nakitli dev fabrikaya kademeli Limit Alım gir (kalan 2/3 nakdi yedekte tut).', deltaTL: 44000, score: 25, outcome: 'Yangın yeri ustalığı! Tek kurşunu tüketmeden 3 parçalı kademeyle sağlam cevher topladın.' },
              { id: 'B', label: 'Taban kilitli, nakit yakan borçlu bir şirkete "çok ucuzladı!" diye tüm nakdi bas.', deltaTL: -65000, score: 0, outcome: 'Ucuz görünen çürük mal elinde daha da çürüdü; değer tuzağına yakalandın.' },
              { id: 'C', label: 'Kapalıçarşı açıkken (11:35) altın yerine +%16 hava paralı ALTIN.S1 al.', deltaTL: -32000, score: 5, outcome: 'Gündüz Kapalıçarşı açıkken borsada +%16 hava parası ödedin; prim kapanınca ağır zarar yazdın.' }
            ]
          },
          {
            clock: 'Salı · 14:40',
            headline: 'Kriz haberi kısmen yatıştı; piyasada sert tepki alımları başladı. Bir arkadaşın "Şu hisse 10 dakikada +%8 yaptı, hemen atla!" diye mesaj attı.',
            choices: [
              { id: 'A', label: 'MKK kayıtlarına ve kasasına bakmadan +%8 uçmuş hisseye atlamıyorum; 24 saat soğuma kuralını uyguluyorum.', deltaTL: 20000, score: 25, outcome: 'FOMO kalkanı çalıştı! Ertesi gün o spekülatif hisse -%9 geri verirken senin kasan sağlam kaldı.' },
              { id: 'B', label: 'Treni kaçırmamak için hemen +%8’den serbest alım yapıyorum.', deltaTL: -48000, score: 0, outcome: 'Tepeden atlayıp kademe boşluğunda yakalandın.' },
              { id: 'C', label: 'Kredi çekip o yükselen hisseye 2 kat giriyorum.', deltaTL: -85000, score: 0, outcome: 'FOMO + Kaldıraç = En hızlı servet yıkım formülü.' }
            ]
          },
          {
            clock: 'Salı · 18:10',
            headline: 'Fırtınalı gün bitti. Portföyünde bazı pozisyonlar hâlâ hafif ekside ama kasa kalitesi yüksek.',
            choices: [
              { id: 'A', label: 'Krizde dağılan ağırlıkları kontrol et, gereksiz işlem yapma, yarınki açılış için hedef fiyat alarmlarını kurup kapat.', deltaTL: 18000, score: 25, outcome: 'Soğukkanlı liderlik! Fırtına gününü hasarsız hatta güçlenerek kapattın.' },
              { id: 'B', label: 'Gece 23:00’te stres atmak için kriptoda yüksek riskli altcoin çevir.', deltaTL: -45000, score: 0, outcome: 'İntikam işlemi (revenge trading) fırtına gününün kârını gece sildi.' },
              { id: 'C', label: 'Akşam 20:00’de mobil bankadan tüm nakdi %3,9 makasla dolara çevir.', deltaTL: -36000, score: 5, outcome: 'Gece banka makasında gereksiz %4 maliyet ödedin.' }
            ]
          }
        ]
      },
      {
        id: 'drill_kap_forensic_night',
        badge: 'Bilanço & KAP',
        difficulty: 'Orta',
        title: 'Gece Bilanço & KAP Dedektifliği: Kâğıt Kâr mı, Gerçek Kasa mı?',
        subtitle: 'Borsa kapalıyken 21:00’de düşen 4 gerçek KAP bildirimini okuyup sabah 09:55 açılışına hazırlan.',
        startCapitalTL: 1000000,
        stages: [
          {
            clock: 'Çarşamba · 21:05',
            headline: 'KAP 1 (Şirket X): TMS-29 bilançosunda Net Kâr +%140 rekor! Ama Nakit Akışında Esas Faaliyet Nakdi (OCF) -1,8 Milyar ₺ (Sloan +%18), kârın tamamı parasal pozisyon kazancından.',
            choices: [
              { id: 'A', label: 'Uzak dur! Kağıt üstünde TMS-29 makyajı var ama kasadan nakit çıkıyor; sabah heyecanla atlayan kalabalığın tuzağına düşmüyorum.', deltaTL: 24000, score: 25, outcome: 'Adli bilanço isabeti! Sabah açılışta +%5 açan hisse 3 günde -%14 çöktü, sen kendini korudun.' },
              { id: 'B', label: 'Net kâr +%140 artmış, hemen sabah açılışa piyasa (serbest) alış emri yaz!', deltaTL: -56000, score: 0, outcome: '09:55 eşleşmesinde en tepeden aldın ve TMS-29 yanılsamasında yakalandın.' },
              { id: 'C', label: 'Kredili alım için limit artır.', deltaTL: -72000, score: 0, outcome: 'Nakit yakan kağıt kârlı şirkete borçla girmek en ağır bilanço hatasıdır.' }
            ]
          },
          {
            clock: 'Çarşamba · 21:40',
            headline: 'KAP 2 (Şirket Y): TMS-29 net kârı yüksek amortisman yüzünden düşük ama VUK Vergi Beyannamesi rekor, OCF/Net Kâr = 1,7x ve "340 Alınan Sipariş Avansları" +%160 artmış!',
            choices: [
              { id: 'A', label: 'Gizli hazine! 340 kodu borç değil müşteriden peşin alınan garantili sipariş kaporasıdır. Sabah 09:55 için makul fiyattan LİMİT ALIM planlıyorum.', deltaTL: 46000, score: 25, outcome: 'Profesyonel analist gözü! Acemiler 340 satırını borç sanıp satarken sen nakit kalesini ucuza topladın!' },
              { id: 'B', label: '340 Alınan Avanslar yükümlülükler altında yazıyor, demek ki şirket çok borçlu — geçiyorum.', deltaTL: -10000, score: 8, outcome: '340 Alınan Sipariş Avansları faizsiz müşteri kaporasıdır; bu fırsatı yanlış okuyup kaçırdın.' },
              { id: 'C', label: '09:45’te sahte tavan görünümüne aldanıp serbest emirle atlıyorum.', deltaTL: -22000, score: 10, outcome: 'Doğru şirketi seçtin ama yanlış emir türüyle (piyasa emri) fazladan maliyet ödedin.' }
            ]
          },
          {
            clock: 'Çarşamba · 22:15',
            headline: 'KAP 3 (Şirket Z): Aynı gün iki haber birden geldi — %200 Bedelli Sermaye Artırımı + MKK’da patronun 25 milyon lot "Borsada İşlem Gören Tipe Dönüşüm" başvurusu; Fon Kullanım Raporunun %90’ı vadesi geçmiş banka faizi kapatma!',
            choices: [
              { id: 'A', label: 'Çifte kırmızı alarm! Hem borç yamama bedellisi hem patronun arka kapıdan lot satış hazırlığı — elimde varsa derhal çıkış/uzak durma kararı!', deltaTL: 30000, score: 25, outcome: 'Mükemmel koruma! Sermayeni patron arz baskısından ve toksik bedelliden kurtardın.' },
              { id: 'B', label: 'Bedelli bölününce hisse fiyatı ucuzlar, çok iyi fırsat!', deltaTL: -64000, score: 0, outcome: 'Borç kapatma amaçlı bedellide ortakların parası eridi, hisse %35 düştü.' },
              { id: 'C', label: 'MKK dönüşümü sadece teknik bir formdur, önemsiz.', deltaTL: -45000, score: 0, outcome: 'Dolaşıma giren 25 milyon lot tahtayı aylarca baskıladı.' }
            ]
          },
          {
            clock: 'Perşembe · 09:48',
            headline: 'Sabah açılış eşleşmesine 7 dk var (09:50’de emir iptali kilitlenecek). Seçtiğin Şirket Y’de teorik eşleşme +%4 görünüyor.',
            choices: [
              { id: 'A', label: '09:50 kilidine girmeden önce razı olduğum fiyattan LİMİT EMİR yazarım veya 10:00 sürekli seansın ilk 5 dakikası oturunca 5 Kademeye bakıp alırım.', deltaTL: 22000, score: 25, outcome: 'Kusursuz icra! 09:50 iptal kilidine ve açılış şokuna yem olmadan temiz maliyetle pozisyona girdin.' },
              { id: 'B', label: '09:52’de serbest emir yazıp vazgeçmeye çalışırım.', deltaTL: -18000, score: 5, outcome: '09:50–09:55 arası iptal kilitlidir; yüksek fiyattan eşleşmek zorunda kaldın.' },
              { id: 'C', label: 'Teorik eşleşme +%4 ise tavan gider diyerek tüm 1 milyonu tek hisseye basarım.', deltaTL: -30000, score: 5, outcome: 'Tek sepete %100 yüklenmek temel risk kuralını ihlal etti.' }
            ]
          }
        ]
      },
      {
        id: 'drill_2026_tax_master',
        badge: '2026 Vergi & BES',
        difficulty: 'Uzman',
        title: '2026 Yıl Sonu Vergi, Temettü, Eurobond & BES Optimizasyon Masası',
        subtitle: '2026 Türk vergi kanunlarıyla (11444, 10811, 11107, GVK 80 & 22) tek kuruş fazla vergi ödemeden net servetini büyüt.',
        startCapitalTL: 1000000,
        stages: [
          {
            clock: 'Aşama 1 · ABD Hisse Satışı',
            headline: '8 ay önce 500.000 ₺’ye aldığın ABD hissesi 820.000 ₺ oldu. Aradaki Yİ-ÜFE enflasyonu şu an %9,4; 2 hafta sonra açıklanacak yeni ayla %10,6’yı aşması bekleniyor.',
            choices: [
              { id: 'A', label: '2 hafta sabredip Yİ-ÜFE ≥ %10,00 eşiğini geçmesini bekle; böylece alış maliyetin enflasyonla büyüsün ve GVK Mük. 80 verginden on binlerce TL kurtar!', deltaTL: 34000, score: 25, outcome: 'Tam isabet! %10 eşiği geçilince maliyet endekslemesi açıldı ve vergin yarı yarıya düştü.' },
              { id: 'B', label: 'Bugün %9,4 iken sat, %0,6 farkın ne önemi var?', deltaTL: -26000, score: 5, outcome: '%10 eşiği "ya hep ya hiç"tir! %9,4’te endeksleme 0 ₺ sayıldı ve nominal kur artışından bile vergi çıktı!' },
              { id: 'C', label: 'ABD hissesi satınca vergi çıkmaz, beyannameye gerek yok.', deltaTL: -45000, score: 0, outcome: 'GVK Mükerrer 80 kapsamında yurt dışı hisse satış kârı beyana tabidir; beyan edilmezse vergi ziyaı cezası doğar!' }
            ]
          },
          {
            clock: 'Aşama 2 · Fon & Sabit Getiri Seçimi',
            headline: 'Bireysel 400.000 ₺’lik sabit getiri ve yerli hisse fonu seçeceksin. Seçenekler: (1) TEFAS dışı Serbest Hisse Fonu (%17,5), (2) TEFAS Yerli Hisse Yoğun Fon MAC (%0), (3) 11444 Kararlı Kamu Sukuk (%0) vs Bireysel PPF (%17,5).',
            choices: [
              { id: 'A', label: '11444 Sayılı Kararla %0 stopajlı Kamu Sukuk + TEFAS Yerli Hisse Yoğun Fon (MAC %0 stopaj) kombinasyonuyla vergi sızıntısını sıfırla!', deltaTL: 28000, score: 25, outcome: '2026 mevzuat ustası! Hem Mart 2026 serbest fon %17,5 tuzağından hem de PPF stopaj kaybından kaçtın.' },
              { id: 'B', label: 'Serbest hisse fonu havalı duruyor, stopajı nasılsa %0’dır diye ona geç.', deltaTL: -22000, score: 0, outcome: '11107 Sayılı Kararla (Mart 2026) TEFAS dışı serbest hisse fonlarında stopaj %17,5 oldu!' },
              { id: 'C', label: 'Aynı getiri için %17,5 stopajlı banka mevduatında kal.', deltaTL: -15000, score: 10, outcome: 'Brüt oran yakınken %17,5 stopaj ödemek gereksiz vergi kaybı yarattı.' }
            ]
          },
          {
            clock: 'Aşama 3 · 2026 Temettü & Eurobond Sınırı',
            headline: 'Yıl içinde 650.000 ₺ brüt BIST temettüsü (net 552.500 ₺) ve ayrıca 360.000 ₺ Eurobond kuponu aldın. Vergi tablon nasıl görünür?',
            choices: [
              { id: 'A', label: 'Temettünün yarısı (325B ₺) + Eurobond kuponu (360B ₺) = 685B ₺! Toplam 2026 beyan sınırı olan 400.000 ₺’yi aştığı için Mart 2027’de ikisini birlikte beyan edeceğimi ve temettüden kesilen %15 stopajı mahsup edeceğimi şimdiden planlarım!', deltaTL: 25000, score: 25, outcome: 'Olağanüstü vergi hakimiyeti! Ayrı ayrı 400B ₺ altında kalsalar da beyana tabi menkul sermaye iratları TOPLU değerlendirilir!' },
              { id: 'B', label: 'İkisi de tek tek 400.000 ₺’nin altında, hiç beyanname vermem.', deltaTL: -38000, score: 5, outcome: 'Kritik tuzak! GVK 86 gereği temettünün istisna dışı yarısı ile Eurobond kuponu birlikte toplanır (325B + 360B = 685B > 400B).' },
              { id: 'C', label: 'Vergi çıkmasın diye temettü hisselerimi zararına satarım.', deltaTL: -30000, score: 0, outcome: 'Vergi korkusuyla kazançlı varlığı satmak yerine mahsup hesabını doğru yapmak gerekir.' }
            ]
          },
          {
            clock: 'Aşama 4 · 2026 BES (%20 Devlet Katkısı)',
            headline: '2026 sonunda BES sözleşmene yıllık devlet katkısı tavanı (396.360 ₺ -> 79.272 ₺ devlet katkısı) için ek katkı yapma ve fon seçme şansın var.',
            choices: [
              { id: 'A', label: '2026 yıllık tavanına (396.360 ₺) kadar tamamlayıp %20 (79.272 ₺) devlet katkısını yakala ve içeride standart fon yerine BEFAS Altın + Yerli Hisse fonlarına dağıt!', deltaTL: 36000, score: 25, outcome: 'Mükemmel 2026 BES hamlesi! 10811 Kararlı %20 devlet katkısı tavanını tam aldın ve BEFAS ile bileşik büyümeyi açtın.' },
              { id: 'B', label: 'BES’e 1 milyon ₺ yatırıp 2026’da 300.000 ₺ devlet katkısı bekle.', deltaTL: -12000, score: 10, outcome: '2026 devlet katkısı %30 değil %20’dir ve yıllık tavan 79.272 ₺ ile sınırlıdır; fazlası sonraki yıllara devreder.' },
              { id: 'C', label: '2. yılda sıkılıp BES’ten erken çık.', deltaTL: -28000, score: 0, outcome: 'İlk 3 yılda çıkışta devlet katkısı hak edişi %0’dır ve %15 stopaj kesilir!' }
            ]
          }
        ]
      },
      {
        id: 'drill_friday_night_spread',
        badge: 'Altın & Döviz Gişesi',
        difficulty: 'Temel',
        title: 'Cuma 18:00 Kur Hareketi: Kapalıçarşı, Nöbetçi, Banka ve ALTIN.S1 Sınavı',
        subtitle: 'Yanlış saatte ve yanlış gişede 1 milyon TL’de 60.000 ₺ makas yakmadan altın/döviz yönetmeyi yaşa.',
        startCapitalTL: 1000000,
        stages: [
          {
            clock: 'Cuma · 17:15',
            headline: 'Hafta sonu jeopolitik risk nedeniyle portföyünün %30’unu (300.000 ₺) fiziki altına geçirmek istiyorsun. Kapalıçarşı 18:30’a kadar açık (%0,40 makas, %0 vergi).',
            choices: [
              { id: 'A', label: '17:30 mesai bitimini ve hafta sonunu beklemeden şimdi gündüz Kapalıçarşı’dan %0,40 dar makas ve %0 vergiyle al!', deltaTL: 15000, score: 25, outcome: 'Kusursuz zamanlama! Akşam 17:30 sonrası açılacak %3,60 banka makasından ve %0,20 BSMV’den 11.000 ₺ kurtardın.' },
              { id: 'B', label: 'Akşam evde yemekten sonra 21:00’de mobil bankadan rahat rahat alırım.', deltaTL: -14000, score: 5, outcome: '21:00’de banka makası 8 kat açıldı ve üstüne %0,2 BSMV kesildi!' },
              { id: 'C', label: 'Borsadaki ALTIN.S1 sertifikası +%15 hava paralı olsa da kolay diye onu alırım.', deltaTL: -42000, score: 0, outcome: 'Aynı altına +%15 fazladan kâğıt hava parası ödedin; 300B ₺’de 39.000 ₺ daha az altın alabildin!' }
            ]
          },
          {
            clock: 'Cumartesi · 14:00',
            headline: 'Hafta sonu acil 100.000 ₺ dolar alman gerekti. Mobil bankada makas %4,20 + %0,20 BSMV; Nöbetçi Döviz Gişesinde makas %1,45 ve %0 vergi.',
            choices: [
              { id: 'A', label: 'Acil ise Nöbetçi Döviz Gişesini (%1,45) kullan; acil değilse Pazartesi 09:30 Kapalıçarşı’yı (%0,40) bekle!', deltaTL: 12000, score: 25, outcome: 'Harika gişe bilinci! Hafta sonu banka makası tuzağını yendin.' },
              { id: 'B', label: 'Cumartesi mobil bankadan %4,20 makasla al, nasılsa aynı dolar.', deltaTL: -18000, score: 5, outcome: 'Aynı doları hafta sonu bankadan alarak gereksiz yere %4,40 maliyet yaktın.' },
              { id: 'C', label: 'Borsa kapalı olsa da altın fonu (KZL) alayım hemen hesaba geçer.', deltaTL: -8000, score: 8, outcome: 'TEFAS fonu hafta sonu çalışmaz (Pazartesi sonrası valör) ve ayrıca kârından %17,5 stopaj keser!' }
            ]
          },
          {
            clock: 'Pazartesi · 10:30',
            headline: 'Hafta sonu korkusu geçti, piyasa sakin açıldı. Dolar 32 günlük başabaş kurunun (52,30 ₺) oldukça altında yatay seyrediyor; %0 vergili Kamu Sukuk yıllık %36,5 veriyor.',
            choices: [
              { id: 'A', label: 'Altın zırhımı (%30) koruyup kalan boş nakdimi %0 vergili Kamu Sukuk ve nakit basan şirketlere dengeli paylaştırırım.', deltaTL: 26000, score: 25, outcome: 'Dengeli portföy sanatı! Hem kur/kriz zırhın var hem de her ay %0 vergili düzenli gelir akıyor.' },
              { id: 'B', label: 'Tüm 1.000.000 ₺’yi %100 fiziki dolar nakde çevirip hiç faiz/temettü almadan beklerim.', deltaTL: -18000, score: 10, outcome: 'Boş dolar nakit hem ABD enflasyonuna hem de %36,5 vergisiz TL getirisi fırsat maliyetine yenildi.' },
              { id: 'C', label: 'Altını hemen zararına bozup tek bir spekülatif hisseye girerim.', deltaTL: -35000, score: 0, outcome: 'Sabırsız yön değişimi hem makas yaktı hem risk kalkanını yok etti.' }
            ]
          },
          {
            clock: 'Pazartesi · 16:00',
            headline: 'Darphane ALTIN.S1 primi +%16’dan +%2’ye düştü (hava parası söndü) ve artık fiziki altınla neredeyse aynı fiyatta!',
            choices: [
              { id: 'A', label: 'Hava parası %2’ye indiğinde ALTIN.S1’in %0 stopaj + borsa likiditesi avantajı yeniden anlam kazanır; kademeli alternatif olarak izleme listeme alırım.', deltaTL: 20000, score: 25, outcome: 'Gerçek arbitraj kafası! Bir varlık "hep iyi" veya "hep kötü" değildir — fiyatındaki hava parası makasına göre karar verilir!' },
              { id: 'B', label: 'ALTIN.S1 sonsuza kadar yasaktır, %0 primde bile bakmam.', deltaTL: 0, score: 12, outcome: 'Ezber kural yerine canlı makası okumak profesyonelliğin özüdür.' },
              { id: 'C', label: 'ALTIN.S1 ucuzladı diye evi satıp krediyle ALTIN.S1 alırım.', deltaTL: -30000, score: 0, outcome: 'Borçla emtia taşımak faiz yükü altında ezilir.' }
            ]
          }
        ]
      },
      {
        id: 'drill_drought_domino',
        badge: 'Domino & 4 Mevsim',
        difficulty: 'Orta',
        title: 'Kuraklık, Petrol & 4 Mevsim Domino Zinciri: Kıştan Önce Odun Stoklamak',
        subtitle: 'Barajlardaki su düşüşünü ve Brent petrol sıçramasını 4–6 ay önceden okuyup portföyünü mevsimine göre kur.',
        startCapitalTL: 1000000,
        stages: [
          {
            clock: 'Nisan · Öncü Sinyal',
            headline: 'EPİAŞ ve DSİ verileri baraj doluluklarının son 10 yılın dibinde olduğunu gösteriyor; aynı hafta Brent petrol +%18 yükseldi.',
            choices: [
              { id: 'A', label: 'Domino zincirini kur: Baraj kurursa 3 ay sonra elektrik üretimi pahalı doğalgaza kayar, mazot artışı 4–6 ay sonra gıda enflasyonunu sıçratır -> Rafineri, güneş/rüzgar enerjisi ve negatif CCC’li gıda perakendesi incele!', deltaTL: 32000, score: 25, outcome: 'Sokak zekâsı + veri ustalığı! Mazottan domatese, barajdan elektrik faturasına zinciri aylar önceden okudun.' },
              { id: 'B', label: 'Petrol +%18 arttıysa jet yakıtı faturası şişen havayolu şirketine tam gaz gir!', deltaTL: -34000, score: 5, outcome: 'Jet yakıtı havayolunun en büyük gider kalemidir; petrol şokunda marj daralır!' },
              { id: 'C', label: 'Hava durumunun ve barajların borsayla ne ilgisi var?', deltaTL: -12000, score: 8, outcome: 'Gerçek ekonomi doğadan ve enerjiden bağımsız değildir; 6 ay sonra bilançolara yansır.' }
            ]
          },
          {
            clock: 'Temmuz · Gecikmeli Aktarım',
            headline: 'Beklediğin gibi elektrik PTF fiyatları yükseldi ve mutfak enflasyonu hızlandı. TCMB faiz indirimini 2 çeyrek erteledi.',
            choices: [
              { id: 'A', label: 'Faiz yüksek kalacağı için kısa/orta vade %0 vergili Kamu Sukuk ve nakit zengini negatif işletme sermayeli market/sigorta ağırlığını koru.', deltaTL: 28000, score: 25, outcome: 'Mevsime tam uyum! Yüksek faiz kışında nakit basan ve borçsuz kasalar seni korudu.' },
              { id: 'B', label: 'Ağır TL kredi borcu olan ve nakit yakan inşaat/sanayi şirketine geç.', deltaTL: -52000, score: 0, outcome: 'Faiz indirimi ertelenince borçlu şirketin tüm kârını kredi faizi yuttu.' },
              { id: 'C', label: 'Her şeyi satıp sıfır getirili vadesiz nakde geç.', deltaTL: -25000, score: 5, outcome: 'Yükselen enflasyonda boş nakit en hızlı eriyen varlıktır.' }
            ]
          },
          {
            clock: 'Kasım · Mevsim Dönüşü',
            headline: 'Sonbahar yağışları başladı, enflasyon eğilimi yavaşlıyor ve TCMB metnine ilk kez "önümüzdeki çeyreklerde kademeli gevşeme alanı" cümlesi girdi.',
            choices: [
              { id: 'A', label: 'Kıştan bahara geçiş tohumu ek: Günlük PPF’de yeniden yatırım riskine yakalanmadan bir kısmı uzun vadeli %0 vergili sabit DİBS/Sukuk’a ve güçlü banka/sanayi kalelerine kademeli kaydır!', deltaTL: 38000, score: 25, outcome: 'Kıştan önce odun, bahardan önce tohum! Faiz indirim döngüsü başlamadan önce pozisyon alan en büyük reel getiriyi alır.' },
              { id: 'B', label: 'Faizler %20’ye kadar tamamen inip hisseler 2 katına çıkınca girerim.', deltaTL: -15000, score: 10, outcome: 'Borsa bugünü değil 6 ay sonrasını fiyatlar; herkes emin olduğunda fiyat çoktan gitmiş olur.' },
              { id: 'C', label: 'Sadece günlük PPF’de kal, faiz inse de oranım değişmez.', deltaTL: -18000, score: 8, outcome: 'PPF oranı her faiz indiriminde ertesi gün aşağı düşer (Yeniden Yatırım Riski)!' }
            ]
          },
          {
            clock: 'Yıl Sonu · Hasat & Dengeleme',
            headline: 'Seçtiğin sektörler güçlü büyüdü; hisse ağırlığın hedefin olan %35’ten %52’ye şişti.',
            choices: [
              { id: 'A', label: 'Taşan %17 kârı mekanik olarak kırpıp Altın ve %0 vergili Sukuk kalkanına aktararak 4 mevsim dengeni tazele.', deltaTL: 24000, score: 25, outcome: 'Gerçek servet yöneticisi kapanışı! Kazancı kalkanla mühürledin.' },
              { id: 'B', label: 'Hiç kâr alma, üstüne borç çekip hisse payını %120 yap.', deltaTL: -45000, score: 0, outcome: 'Zirvede kaldıraç eklemek bir yıllık emeği tek düzeltmede riske attı.' },
              { id: 'C', label: 'Yatırımı bırakıp tüm parayı harca.', deltaTL: -20000, score: 5, outcome: 'Bileşik getiri kartopunu daha büyümeye başlamışken kırdın.' }
            ]
          }
        ]
      }
    ];
  }

  global.RealInvestmentGuide = {
    explainAsset,
    getPlainAssetVerdict,
    getGrandmaVerdict: getPlainAssetVerdict,
    getDailyHomeBriefing,
    simulateMacroDominoWhatIf,
    simulateSingleBasketDrop,
    simulateBalancedBasketBuilder,
    computePortfolioDriftPlan,
    computeOrderBookDepth,
    computeFiveQuestionCompanyXray,
    getInteractiveDecisionDrills,
    getKapForensicReaderScenarios,
    getDailyQuickChallenge,
    lookupTermByKey,
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
    CUSTOM_SCREENER_DEFS,
    runCustomScreener,
    compareAssetsHeadToHead,
    generateLiveKasaDuelRound,
    computeFreedomWheelProjection,
    CRISIS_SCENARIOS,
    simulatePortfolioCrisis
  };
})(typeof window !== 'undefined' ? window : globalThis);
