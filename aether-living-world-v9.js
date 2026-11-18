/* ============================================================================
   AETHER v9.0 — YAŞAYAN ÇARŞI HARİTASI, 10 YILLIK HIZLANDIRILMIŞ BİSİKLET SAHASI,
   GÖRSEL ERİYEN PAZAR FİLESİ VE AİLE ÇAY SALONU MOTORU
   Sıfır borsa şablonu, sıfır kural kitabı, sıfır uydurma canlı fiyat.
   ============================================================================ */
(function () {
  'use strict';

  /* ==========================================================================
     1. DÜNYA ŞOK SENARYOLARI VE HARİTA DÜĞÜM BAĞLANTILARI
     ========================================================================== */
  let activeWorldShock = 'live'; // 'live' | 'oil_up' | 'oil_down' | 'drought' | 'strait_jam' | 'ai_grid' | 'rate_cut'

  const WORLD_SHOCK_PRESETS = {
    live: {
      label: 'Canlı Gerçek Akış',
      headline: 'Şu an dış dünyada ve Türkiye’de akan gerçek fiyatların canlı haritası',
      story: 'Herhangi bir noktaya (Tanker, Fabrika, Fırın, Havalimanı, Taş Kiler) dokunarak arkasındaki gerçek şirketleri ve hammaddeleri gör; ya da aşağıdaki olay tuşlarıyla dünyayı sallayıp kimin kazanıp kimin sıkıştığını izle.',
      tones: { strait: 'calm', field: 'calm', factory: 'pos', airport: 'calm', bakery: 'pos', vault: 'pos', gate: 'warn' },
      flows: { f_oil_fac: 'calm-flow', f_oil_air: 'calm-flow', f_air_bak: 'calm-flow', f_fld_bak: 'pos-flow', f_fac_vlt: 'pos-flow', f_gat_vlt: 'warn-flow' },
      focusKind: 'bist',
      focusId: 'BIMAS',
      focusBtn: 'Peşin Çalışan Market Kasasını Gör →'
    },
    oil_up: {
      label: 'Mazot +%25 Fırladı',
      headline: 'Petrol fırladı: Kamyon ve uçağın yakıt faturası kabardı, pazardaki domatese zam yolda!',
      story: 'Ham petrol pahalandığında onu işleyen rafineri (Tüpraş) ve altın kalkanı güçlenir; ama en büyük gideri jet yakıtı ve mazot olan taşımacılık sıkışır, 6 hafta sonra mutfak tenceresi pahalanır.',
      tones: { strait: 'neg', field: 'warn', factory: 'pos', airport: 'neg', bakery: 'warn', vault: 'pos', gate: 'warn' },
      flows: { f_oil_fac: 'pos-flow', f_oil_air: 'neg-flow', f_air_bak: 'neg-flow', f_fld_bak: 'warn-flow', f_fac_vlt: 'pos-flow', f_gat_vlt: 'warn-flow' },
      focusKind: 'bist',
      focusId: 'TUPRS',
      focusBtn: 'Petrolü İşleyen Rafineri Mutfağını Aç →'
    },
    oil_down: {
      label: 'Petrol -%20 Ucuzladı',
      headline: 'Mazot ucuzladı: Yüzlerce uçak uçuranın en büyük masrafı düştü, kasası nefes aldı!',
      story: 'Pazarcının mazotu ucuzladığında nakliye rahatlar; biletini Avrupalı turiste Euro ile kesip yakıtı ucuza alan havayollarının (THYAO, PGSUS) kâr marjı sessizce büyür.',
      tones: { strait: 'pos', field: 'pos', factory: 'calm', airport: 'pos', bakery: 'pos', vault: 'calm', gate: 'calm' },
      flows: { f_oil_fac: 'calm-flow', f_oil_air: 'pos-flow', f_air_bak: 'pos-flow', f_fld_bak: 'pos-flow', f_fac_vlt: 'calm-flow', f_gat_vlt: 'calm-flow' },
      focusKind: 'bist',
      focusId: 'THYAO',
      focusBtn: 'Yakıtı Ucuzlayan Havayolunu Aç →'
    },
    drought: {
      label: 'Kuraklık Başladı',
      headline: 'Tarlada kuraklık var: Buğday ambarı azaldı, borçlu fabrikalar zorlanırken peşin market ayakta!',
      story: 'Erzak azaldığında vatandaş lüks eşyayı erteler ama ekmeği ve peyniri kesemez. Hiç banka borcu olmayan ve peşin satan gıda marketi enflasyonu kasasına yansıtır.',
      tones: { strait: 'calm', field: 'neg', factory: 'warn', airport: 'calm', bakery: 'pos', vault: 'pos', gate: 'warn' },
      flows: { f_oil_fac: 'calm-flow', f_oil_air: 'calm-flow', f_air_bak: 'warn-flow', f_fld_bak: 'neg-flow', f_fac_vlt: 'warn-flow', f_gat_vlt: 'pos-flow' },
      focusKind: 'inst',
      focusId: 'emtia-tarim-dba',
      focusBtn: 'Dünya Tarım & Buğday Sepetini Aç →'
    },
    strait_jam: {
      label: 'Boğazda Gemiler Sıkıştı',
      headline: 'Gemiler boğazda kilitlendi: Gece televizyon izleyen panikledi, kalkanı hazır olan uyuyor!',
      story: 'Kriz gecesi saat 22:30’da banka uygulamasından altın almaya kalkan %3,6 makas yer. Fırtınadan önce Taş Kilerde (%0 vergili Darphane S1 ve Sukuk) cephane tutan ise sabah sakin kafayla fırsat toplar.',
      tones: { strait: 'neg', field: 'warn', factory: 'warn', airport: 'neg', bakery: 'warn', vault: 'pos', gate: 'neg' },
      flows: { f_oil_fac: 'neg-flow', f_oil_air: 'neg-flow', f_air_bak: 'neg-flow', f_fld_bak: 'warn-flow', f_fac_vlt: 'pos-flow', f_gat_vlt: 'neg-flow' },
      focusKind: 'inst',
      focusId: 'altin-sertifikasi',
      focusBtn: 'Darphane Altın S1 Kalkanını Aç →'
    },
    ai_grid: {
      label: 'Elektrik & Trafo Açlığı',
      headline: 'Veri merkezleri ve güneş santralleri şebekeyi zorluyor: Trafo ve Gümüş üreticisi tam kapasite!',
      story: 'Herkes yazılım konuşurken o sunuculara elektriği taşıyan yüksek gerilim trafosu (ASTOR) ve güneş panelinin içindeki iletken Gümüş sessizce mecburi hammadde haline gelir.',
      tones: { strait: 'calm', field: 'calm', factory: 'pos', airport: 'calm', bakery: 'calm', vault: 'pos', gate: 'calm' },
      flows: { f_oil_fac: 'calm-flow', f_oil_air: 'calm-flow', f_air_bak: 'calm-flow', f_fld_bak: 'calm-flow', f_fac_vlt: 'pos-flow', f_gat_vlt: 'pos-flow' },
      focusKind: 'bist',
      focusId: 'ASTOR',
      focusBtn: 'Trafo Üreticisi Dükkânı Aç →'
    },
    rate_cut: {
      label: 'Faiz Kışı Dönüyor',
      headline: '2 Yıllık Tahvil faizi gevşiyor: Kış bitmeden odun toplayanlar iskontolu mülk ve ihracatçıda!',
      story: 'Gazeteler "Konut ve araba patladı" diye manşet attığında fiyatlar çoktan uçmuştur. Öncü iz 2 Yıllık Devlet Tahvili faizinin yönü ve tapu değerinin yarısına inmiş borçsuz ortaklıklardır.',
      tones: { strait: 'calm', field: 'pos', factory: 'pos', airport: 'pos', bakery: 'calm', vault: 'pos', gate: 'pos' },
      flows: { f_oil_fac: 'pos-flow', f_oil_air: 'pos-flow', f_air_bak: 'pos-flow', f_fld_bak: 'calm-flow', f_fac_vlt: 'pos-flow', f_gat_vlt: 'pos-flow' },
      focusKind: 'inst',
      focusId: 'dibs-tahvil',
      focusBtn: 'Öncü 2Y Tahvil İzini Aç →'
    }
  };

  /* ==========================================================================
     2. 10 YILI 10 DAKİKADA YAŞATAN GERÇEK TÜRKİYE TARİHİ SİMÜLATÖRÜ (2017–2026)
     ========================================================================== */
  const JOURNEY_CHAPTERS = [
    {
      yr: '2017',
      title: '1. Bölüm · Sakin Deniz ve Rehavet',
      scene: 'Dolar 3,6 ₺, enflasyon %11, her şey sütliman. Herkes "TL mevduat yeter, döviz bir yere gitmez" diyor.',
      cpiPct: 11.9,
      ret: { cash: 0, pantry: 12.2, gold: 18.5, shops: 43.0, world: 29.5 },
      dilemma: null
    },
    {
      yr: '2018 Yaz',
      title: '2. Bölüm · Ağustos Kur Fırtınası',
      scene: 'Bir cuma akşamı döviz aniden %45 fırladı! Döviz borçlu şirketler terliyor, vadesizde bekleyen paranın alım gücü bir ayda eridi.',
      cpiPct: 20.3,
      ret: { cash: 0, pantry: 17.5, gold: 34.0, shops: -14.0, world: 31.0 },
      dilemma: {
        prompt: 'Ortalık toz duman! Komşun "Borsa bitti, elimdeki sağlam fabrikaları zararına satıp gece bankadan makasla döviz alacağım" diyor. Sen ne yaparsın?',
        choices: [
          {
            key: 'panic_cash',
            label: 'Korkup Tüm Dükkânları Zararına Sat, Boş Nakde Geç',
            effect: (st) => { st.w = { cash: 70, pantry: 30, gold: 0, shops: 0, world: 0 }; st.sleep -= 12; st.lessons.push('2018 fırtınasında korkup sağlam malı dipten sattın.'); },
            feedback: 'O an rahatladın sandın ama ucuza verdiğin sağlam ihracat fabrikaları döviz geliriyle hızla toparlayacak.'
          },
          {
            key: 'hold_balance',
            label: 'Soğukkanlı Kal; Altın Kalkanından Biraz Alıp Ucuzlayan İhracatçıya Ekle',
            effect: (st) => { st.w = { cash: 5, pantry: 25, gold: 25, shops: 25, world: 20 }; st.sleep += 6; st.calmWins++; st.lessons.push('2018 kur şokunda panik yapmayıp denge kurdun.'); },
            feedback: 'Görmüş geçirmiş esnaf duruşu: Kalkanın sarsıntıyı emdi, ucuzlayan üretim payın ise bahara hazırlandı.'
          },
          {
            key: 'take_debt',
            label: 'Fırsat Bu Fırsat Deyip Bankadan Yüksek Faizli Kredi Çekerek Tek Sepete Gir',
            effect: (st) => { st.borrowed = true; st.w = { cash: 0, pantry: 0, gold: 0, shops: 100, world: 0 }; st.sleep -= 28; st.lessons.push('Boyundan büyük kredi yüküyle tek sepete girdin.'); },
            feedback: 'Omuzlarına borç yükü bindi; en ufak sarsıntıda uykuların kaçacak.'
          }
        ]
      }
    },
    {
      yr: '2020 Mart',
      title: '3. Bölüm · Salgın Kapanışı: Uçaklar Yerde, Sokaklar Boş',
      scene: 'Dünya kapandı! Petrol tarihte ilk kez dibe vurdu, uçaklar hangara çekildi, herkes ekran başında titriyor.',
      cpiPct: 14.6,
      ret: { cash: 0, pantry: 11.0, gold: 54.0, shops: 29.0, world: 44.0 },
      dilemma: {
        prompt: 'Herkes "Dünya bir daha eskisi gibi olmaz" diye elindekini yok pahasına satıyor. Senin elin hangi tuşa gider?',
        choices: [
          {
            key: 'freeze_cash',
            label: 'Her Şeyi Satıp Yastık Altı TL Nakitte Saklan',
            effect: (st) => { st.w = { cash: 85, pantry: 15, gold: 0, shops: 0, world: 0 }; st.missedBooms++; st.lessons.push('2020 kapanışında nakitte donup büyük üretim dalgasını kaçırdın.'); },
            feedback: 'Fırtına dindiğinde para basımıyla tüm varlıklar uçarken senin TL nakdin kıyıda bekleyecek.'
          },
          {
            key: 'buy_quality',
            label: 'Borçsuz Market, Teknoloji ve Altın Sepetini Bozmadan Koru',
            effect: (st) => { st.borrowed = false; st.w = { cash: 0, pantry: 20, gold: 30, shops: 25, world: 25 }; st.calmWins++; st.sleep += 5; st.lessons.push('2020 salgınında sağlam sepeti bozmayarak gemiyi limana çıkardın.'); },
            feedback: 'Sabrın ödülü: Dünya yeniden açılırken hem altın hem üretim ortaklıkları birlikte büyüyecek.'
          }
        ]
      }
    },
    {
      yr: '2021 Kış',
      title: '4. Bölüm · Gece Yarısı Makas ve Kaldıraç Tokadı',
      scene: 'Aralık ayında döviz sabah 18 ₺’yi görüp aynı gece 11 ₺’ye çakıldı! Tepeden krediyle ve dedikoduyla atlayanlar bir gecede sıfırlandı.',
      cpiPct: 36.1,
      ret: { cash: 0, pantry: 17.0, gold: 72.0, shops: 28.0, world: 98.0 },
      dilemma: null
    },
    {
      yr: '2022',
      title: '5. Bölüm · %85 Enflasyon Yangını: Duran Paranın Eridiği Yıl',
      scene: 'Market etiketleri her hafta değişiyor! Banka faizi %16’da kalırken enflasyon %80’i aştı; parayı boşta veya mevduatta tutanın pazar filesi yarıya indi.',
      cpiPct: 64.3,
      ret: { cash: 0, pantry: 16.5, gold: 41.0, shops: 196.0, world: 16.0 },
      dilemma: {
        prompt: 'Çay ocağında herkes 3 ayda 4 katına çıkmış zarar eden bir dedikodu hissesini konuşuyor: "Evini arabayı sat bas!" diyorlar.',
        choices: [
          {
            key: 'herd_jump',
            label: 'Sürüye Katıl! Tüm Kasanı O Tek Dedikodu Kağıdına Bas',
            effect: (st) => { st.herdTrap = true; st.w = { cash: 0, pantry: 0, gold: 0, shops: 100, world: 0 }; st.sleep -= 22; st.lessons.push('Herkesin hücum ettiği dedikodu kağıdına tepeden atladın.'); },
            feedback: 'İlk hafta tatlı göründü ama sürü dağıldığında elinde satılamayan pahalı mal kalacak!'
          },
          {
            key: 'real_cashflow',
            label: 'Dedikoduya Kulağını Tıka; Sadece Gerçek Kâr Eden Dükkân + Altın + Dünya Taşı',
            effect: (st) => { st.herdTrap = false; st.w = { cash: 0, pantry: 15, gold: 30, shops: 30, world: 25 }; st.calmWins++; st.lessons.push('Sürü hücumuna kapılmayıp gerçek fırın hasılatına sadık kaldın.'); },
            feedback: 'İnce kulağın çalıştı: Gürültüyü ayıklayıp gerçek üretime ortak kaldın.'
          }
        ]
      }
    },
    {
      yr: '2023',
      title: '6. Bölüm · Halka Arz Çılgınlığı ve Seçim Dalgaları',
      scene: 'Milyonlarca yeni kişi borsaya koştu; sağlam ihracatçılar büyürken, bir önceki yılın şişmiş dedikodu hisseleri %50 çöküp yıllarca yerinde saydı.',
      cpiPct: 64.8,
      ret: { cash: 0, pantry: 28.0, gold: 78.0, shops: 42.0, world: 94.0 },
      dilemma: null
    },
    {
      yr: '2024',
      title: '7. Bölüm · %50 Faiz Kışı: Borçluların Uykusuz Gecesi',
      scene: 'Kredi faizleri %60’ı geçti! Krediyle mal taşıyanlar ve borçlu şirketler ezilirken, %0 vergili Kira Sertifikası ve nakit zengini marketler cephaneyi büyüttü.',
      cpiPct: 44.4,
      ret: { cash: 0, pantry: 51.0, gold: 52.0, shops: 31.0, world: 46.0 },
      dilemma: {
        prompt: 'Banka "%48 brüt faiz veriyoruz, tüm altınını ve şirketlerini satıp gelen faizi her ay harca, krallar gibi yaşa" diyor.',
        choices: [
          {
            key: 'eat_interest',
            label: 'Tümünü Mevduata Koy ve Gelen Faizi Her Ay Harca',
            effect: (st) => { st.ateSeed = true; st.w = { cash: 35, pantry: 65, gold: 0, shops: 0, world: 0 }; st.lessons.push('Enflasyon tamirini kâr sanıp yiyerek anaparanın alım gücünü kemirdin.'); },
            feedback: 'Tohumluk buğdayı yedin: Harcadığın şey kâr değil, anaparanın enflasyon yamasıydı!'
          },
          {
            key: 'cycle_master',
            label: 'Anaparaya Dokunma; Vergisiz Kiler + Altın S1 + İndirimdeki Sağlam Dükkânları Dengele',
            effect: (st) => { st.ateSeed = false; st.borrowed = false; st.w = { cash: 0, pantry: 35, gold: 25, shops: 20, world: 20 }; st.calmWins++; st.lessons.push('Faiz kışında anaparayı koruyup ucuzlayan üretimi kademeli topladın.'); },
            feedback: 'Kıştan odun stoklayan köylü aklı: Hem vergisiz kira aldın hem de ucuzlayan sağlam dükkânlara ortak oldun.'
          }
        ]
      }
    },
    {
      yr: '2025–26',
      title: '8. Bölüm · Sisin Dağılması ve Kendi Ayakların Üzerinde Durmak',
      scene: 'On yıllık fırtına, salgın, enflasyon ve faiz döngüsü tamamlandı. Şimdi kimin gemisi su aldı, kimin pazar filesi büyüdü açıkça görülüyor!',
      cpiPct: 31.5,
      ret: { cash: 0, pantry: 40.5, gold: 46.0, shops: 38.0, world: 39.0 },
      dilemma: null
    }
  ];

  let journeyState = null;
  let journeyTimer = null;

  function createFreshJourneyState() {
    return {
      stepIdx: 0, // 0..8 (0 başlangıç, 8 bitiş)
      playing: false,
      borrowed: false,
      herdTrap: false,
      ateSeed: false,
      activeDilemma: null,
      lastFeedback: 'Sepet oranlarını seç ve "Zamanı Akıt" tuşuna dokun; 2017’den bugüne Türkiye’nin gerçek fırtınalarını yaşayarak geç.',
      stormShake: false,
      sleep: 88,
      calmWins: 0,
      missedBooms: 0,
      lessons: [],
      w: { cash: 10, pantry: 25, gold: 25, shops: 20, world: 20 },
      // Başlangıç: 100 Pazar Filesi Alım Gücü (Reel Endeks = 100)
      userBagsHistory: [100],
      calmMasterHistory: [100],
      herdChaserHistory: [100]
    };
  }

  function ensureJourneyState() {
    if (!journeyState) journeyState = createFreshJourneyState();
    return journeyState;
  }

  function adjustJourneyBucket(key, delta) {
    const st = ensureJourneyState();
    const nextVal = Math.max(0, Math.min(100, (st.w[key] || 0) + delta));
    st.w[key] = nextVal;
    // Toplamı otomatik 100'e normalize et ki kullanıcı hesap makinesiyle uğraşmasın
    const others = ['cash', 'pantry', 'gold', 'shops', 'world'].filter(k => k !== key);
    const remTarget = 100 - nextVal;
    const curOthersSum = others.reduce((s, k) => s + (st.w[k] || 0), 0);
    if (curOthersSum <= 0) {
      const each = Math.floor(remTarget / others.length);
      others.forEach((k, i) => { st.w[k] = i === 0 ? remTarget - each * (others.length - 1) : each; });
    } else {
      let acc = 0;
      others.forEach((k, i) => {
        if (i === others.length - 1) st.w[k] = Math.max(0, remTarget - acc);
        else {
          const v = Math.round(((st.w[k] || 0) / curOthersSum) * remTarget);
          st.w[k] = v;
          acc += v;
        }
      });
    }
    renderYolculukView();
  }

  function toggleJourneyDebt() {
    const st = ensureJourneyState();
    st.borrowed = !st.borrowed;
    st.sleep = st.borrowed ? Math.max(25, st.sleep - 22) : Math.min(95, st.sleep + 15);
    renderYolculukView();
  }

  function advanceOneJourneyChapter() {
    const st = ensureJourneyState();
    if (st.activeDilemma) return;
    if (st.stepIdx >= JOURNEY_CHAPTERS.length) {
      stopJourneyPlay();
      return;
    }

    const ch = JOURNEY_CHAPTERS[st.stepIdx];
    // Eğer bu bölümün başında fırtına kararı varsa ve henüz sorulmadıysa zamanı dondurup sor!
    if (ch.dilemma && !st['asked_' + st.stepIdx]) {
      st['asked_' + st.stepIdx] = true;
      st.activeDilemma = ch.dilemma;
      st.stormShake = true;
      stopJourneyPlay();
      renderYolculukView();
      setTimeout(() => { if (journeyState) journeyState.stormShake = false; }, 500);
      return;
    }

    // Dönem getirisini ve gerçek enflasyon sonrası Pazar Filesi sayısını hesapla
    const sumW = Math.max(1, st.w.cash + st.w.pantry + st.w.gold + st.w.shops + st.w.world);
    let shopsRet = ch.ret.shops;
    if (st.herdTrap && ch.yr === '2023') {
      // 2022'de sürü hissesine tepeden atlayan 2023'te -%38 çöküş yaşar!
      shopsRet = -38.0;
      st.herdTrap = false;
    }

    let nomPct =
      (st.w.cash / sumW) * ch.ret.cash +
      (st.w.pantry / sumW) * ch.ret.pantry +
      (st.w.gold / sumW) * ch.ret.gold +
      (st.w.shops / sumW) * shopsRet +
      (st.w.world / sumW) * ch.ret.world;

    if (st.ateSeed) {
      // Gelen faizin yarısını harcadığı için bileşik büyüme kırpılır
      nomPct -= (st.w.pantry / sumW) * (ch.ret.pantry * 0.65);
    }

    if (st.borrowed) {
      // +%50 Kredili borç yükü: Getiriyi 1,5x büyütür AMA yıllık yüksek kredi faizi keser ve düşüşte özsermayeyi ezer!
      const borrowCost = Math.max(24, ch.cpiPct * 1.15);
      nomPct = nomPct * 1.5 - borrowCost * 0.5;
      if (shopsRet < 0) st.sleep = Math.max(15, st.sleep - 25);
    }

    const realFactor = Math.max(0.25, (1 + nomPct / 100) / (1 + ch.cpiPct / 100));
    const prevBags = st.userBagsHistory[st.userBagsHistory.length - 1];
    const nextBags = +(prevBags * realFactor).toFixed(1);
    st.userBagsHistory.push(nextBags);

    // Karşılaştırma 1: Hiç ekran kurcalamayan Sağlam Sepet Ustası (%25 Kiler, %30 Altın, %25 Sağlam Dükkân, %20 Dünya)
    const masterNom = 0.25 * ch.ret.pantry + 0.30 * ch.ret.gold + 0.25 * ch.ret.shops + 0.20 * ch.ret.world;
    const prevMaster = st.calmMasterHistory[st.calmMasterHistory.length - 1];
    st.calmMasterHistory.push(+(prevMaster * ((1 + masterNom / 100) / (1 + ch.cpiPct / 100))).toFixed(1));

    // Karşılaştırma 2: Dedikoduyla sağa sola koşan Sürü Oyuncusu
    const herdNom = (ch.yr === '2018 Yaz' || ch.yr === '2021 Kış' || ch.yr === '2023') ? -12 : (ch.ret.pantry * 0.7);
    const prevHerd = st.herdChaserHistory[st.herdChaserHistory.length - 1];
    st.herdChaserHistory.push(+(prevHerd * Math.max(0.35, (1 + herdNom / 100) / (1 + ch.cpiPct / 100))).toFixed(1));

    if (realFactor < 0.85) st.stormShake = true;
    st.lastFeedback = `${ch.yr}: Enflasyon %${ch.cpiPct.toFixed(0)} vururken senin pazar filen ${prevBags.toFixed(0)} adetten ${nextBags.toFixed(0)} adede geldi.`;
    st.stepIdx++;

    // Yolculuk tamamlandığında kullanıcının gerçek Aile Kasa profiline görünmez ustalık izi bırak!
    if (st.stepIdx >= JOURNEY_CHAPTERS.length && window.AetherExp?.recordJourneyGraduation) {
      window.AetherExp.recordJourneyGraduation({
        finalBags: nextBags,
        calmWins: st.calmWins,
        sleep: st.sleep,
        lessons: st.lessons
      });
    }

    renderYolculukView();
    setTimeout(() => { if (journeyState) journeyState.stormShake = false; }, 500);
  }

  function pickJourneyDilemmaChoice(choiceKey) {
    const st = ensureJourneyState();
    if (!st.activeDilemma) return;
    const chObj = st.activeDilemma.choices.find(c => c.key === choiceKey);
    if (chObj) {
      chObj.effect(st);
      st.lastFeedback = chObj.feedback;
    }
    st.activeDilemma = null;
    advanceOneJourneyChapter();
  }

  function toggleJourneyPlay() {
    const st = ensureJourneyState();
    if (st.playing) {
      stopJourneyPlay();
      renderYolculukView();
      return;
    }
    if (st.stepIdx >= JOURNEY_CHAPTERS.length) {
      journeyState = createFreshJourneyState();
    }
    ensureJourneyState().playing = true;
    renderYolculukView();
    journeyTimer = setInterval(() => {
      const cur = ensureJourneyState();
      if (!cur.playing || cur.activeDilemma || cur.stepIdx >= JOURNEY_CHAPTERS.length) {
        stopJourneyPlay();
        renderYolculukView();
        return;
      }
      advanceOneJourneyChapter();
    }, 2400);
  }

  function stopJourneyPlay() {
    if (journeyTimer) {
      clearInterval(journeyTimer);
      journeyTimer = null;
    }
    if (journeyState) journeyState.playing = false;
  }

  function resetJourney() {
    stopJourneyPlay();
    journeyState = createFreshJourneyState();
    renderYolculukView();
  }

  /* ==========================================================================
     3. CANLI GÖKYÜZÜ ATMOSFERİ VE SANİYE SANİYE GERÇEK TÜRKİYE SAATİ
     ========================================================================== */
  function syncBodySkyAtmosphere() {
    if (!window.AetherExp) return;
    const clk = window.AetherExp.getIstanbulMarketClock();
    let sky = 'night';
    if (clk.hour >= 6 && clk.hour < 10) sky = 'dawn';
    else if (clk.hour >= 10 && clk.hour < 17) sky = 'day';
    else if (clk.hour >= 17 && clk.hour < 21) sky = 'twilight';
    if (document.body.dataset.sky !== sky) {
      document.body.dataset.sky = sky;
    }

    // Saniyelik hafif DOM güncellemesi (ekranı yeniden çizmeden canlı saat akışı!)
    const secEl = document.getElementById('v9LiveClockSec');
    if (secEl) secEl.textContent = clk.timeSecStr;

    const cdEl = document.getElementById('v9NextBellCountdown');
    if (cdEl) {
      let targetMs = clk.nextBistOpenMs;
      let prefix = '09:55 Eşleşmesine: ';
      if (clk.bistState === 'MATCHING') {
        targetMs = Date.UTC(clk.year, clk.month - 1, clk.day, 10 - 3, 0, 0);
        prefix = '10:00 Ziline: ';
      } else if (clk.bistIsTradableNow) {
        const closeHr = clk.isHalfDay ? 12 : 18;
        const closeMn = clk.isHalfDay ? 40 : 10;
        targetMs = Date.UTC(clk.year, clk.month - 1, clk.day, closeHr - 3, closeMn, 0);
        prefix = `${closeHr}:${String(closeMn).padStart(2, '0')} Kapanışına: `;
      } else if (clk.isBusinessDay && clk.minsOfDay < 9 * 60 + 55) {
        targetMs = Date.UTC(clk.year, clk.month - 1, clk.day, 9 - 3, 55, 0);
        prefix = '09:55 Eşleşmesine: ';
      } else {
        prefix = 'Yeni Seans Açılışına: ';
      }
      const diff = Math.max(0, Math.floor((targetMs - clk.ms) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      cdEl.textContent = h > 24
        ? `${prefix}${Math.ceil(h / 24)} gün`
        : `${prefix}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  }

  /* ==========================================================================
     4. SAHNE 1: YAŞAYAN ÇARŞI & DÜNYA HARİTASI ("MAZOTTAN DOMATESE CANLI SAHNE")
     ========================================================================== */
  function openLandmarkExplorerSheet(landmarkKey) {
    const esc = window.escapeHtml || (s => String(s || ''));
    const lookup = window.marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup || {};
    const specs = {
      strait: {
        title: 'Boğaz, Tankerler ve Döviz Kapısı',
        insight: 'Dünyadan gelen ham petrol ve döviz kuru buradan girer. Tankerdeki mazot ucuzladığında uçak ve kamyon rahatlar; fırladığında mutfaktaki tencereye zam olarak yürür.',
        items: [
          { kind: 'inst', id: 'emtia-petrol-bno', why: 'Dünya Ham Petrolü (Mazotun Kökü)' },
          { kind: 'inst', id: 'doviz-usd', why: 'İthalat ve Enerji Faturası Kuru' },
          { kind: 'inst', id: 'doviz-eur', why: 'Avrupa Turist ve İhracat Kuru' }
        ]
      },
      field: {
        title: 'Tarla, Buğday Ambarı ve Gübre',
        insight: 'Evdeki erzak dolabı gibidir: Kuraklık veya gübre/mazot artışı önce tarlada görünür, 3 ay sonra marketteki un ve yağ etiketine yansır.',
        items: [
          { kind: 'inst', id: 'emtia-tarim-dba', why: 'Dünya Buğday, Mısır, Kahve Sepeti' },
          { kind: 'bist', id: 'TABGD', why: 'Restoran ve Hazır Gıda Zinciri' },
          { kind: 'bist', id: 'BIMAS', why: 'Temel Gıdayı Peşin Satan Market' }
        ]
      },
      factory: {
        title: 'Sanayi Vadisi, Trafo ve İhracat Bacaları',
        insight: 'Toprağı, çeliği ve elektriği işleyip dünyaya dövizle mal satan üretim kalbi. Tabelasına değil; kasasında borçtan fazla nakit olup olmadığına bakılır.',
        items: [
          { kind: 'bist', id: 'TUPRS', why: 'Ham Petrolü İşleyen Rafineri Kazanı' },
          { kind: 'bist', id: 'FROTO', why: 'Avrupa’ya Euro Fatura Kesen Otomotiv Atölyesi' },
          { kind: 'bist', id: 'ASTOR', why: 'Dünyaya Elektrik Trafosu Satan Nakit Zengini' },
          { kind: 'inst', id: 'gram-gumus-spot', why: 'Güneş Paneli ve Elektronik İletkeni (%0 Vergi)' }
        ]
      },
      airport: {
        title: 'Havalimanı ve Lojistik Damarları',
        insight: 'En büyük masrafı jet yakıtıdır (Brent Petrol); gelirini ise Dolar ve Euro biletle toplar. Televizyonda "rekor turist" haberi çıktığında değil, kışın petrol düşerken izlenir.',
        items: [
          { kind: 'bist', id: 'THYAO', why: 'Küresel Bayrak Taşıyıcı Havayolu' },
          { kind: 'bist', id: 'PGSUS', why: 'Düşük Maliyetli Avrupa/Yurt Dışı Havayolu' },
          { kind: 'inst', id: 'gayrimenkul-ticari-rygyo', why: 'Lojistik Depo Kirası Üreten Ortaklık' }
        ]
      },
      bakery: {
        title: 'Mahalle Fırını ve Pazar Filesi',
        insight: 'Vatandaş ekmeği peşin alır; borçsuz market topladığı nakdi toptancıya ödemeden önce 60 gün günlük fonda çalıştırır! Yüksek faiz ve enflasyonda yıkılmayan kaledir.',
        items: [
          { kind: 'bist', id: 'BIMAS', why: '81 İlde Günlük Peşin Kasa Üreticisi' },
          { kind: 'bist', id: 'MGROS', why: 'Gıda Perakendesi ve Online Dağıtım Ağı' },
          { kind: 'inst', id: 'fon-yerli-hisse-zpbdl', why: 'Banka Dışı 10 Dev Şirket Fonu (%0 Vergi)' }
        ]
      },
      vault: {
        title: 'Taş Kiler ve Darphane Sığınağı (%0 Vergi)',
        insight: 'Boşta duran parayı enflasyon farelerinden ve %17,5 mevduat stopajından koruyan sığınak. Fırtına çıkınca ucuz mal toplamak için cephanen burada büyür.',
        items: [
          { kind: 'inst', id: 'altin-sertifikasi', why: 'Darphane Altın S1 (%0 Vergi, Borsa Dar Makas)' },
          { kind: 'inst', id: 'kira-sertifikasi-sukuk', why: 'Hazine Kira Sertifikası (%0 Vergi, Enflasyon Üstü Kira)' },
          { kind: 'inst', id: 'dibs-tahvil', why: '2 Yıllık Devlet Tahvili (%0 Vergi, Faiz Dönüşü Öncüsü)' }
        ]
      },
      gate: {
        title: 'Borsa Zil Kulesi ve Banka Makas Kapısı',
        insight: 'Türkiye’nin gerçek saat sınırları: 09:55 eşleşme, 10:00–18:10 borsa seansı, 13:30 fon valörü ve 17:30 sonrası açılan banka döviz/altın makası!',
        items: [
          { kind: 'inst', id: 'para-piyasasi-fonu', why: 'Mesai İçi Günlük Nakit Parkı' },
          { kind: 'inst', id: 'abd-sp500-spy', why: '17:30–00:00 Açık ABD 500 Dünya Devi' },
          { kind: 'inst', id: 'kripto-btc', why: 'Hafta Sonu Dahil 7/24 Açık Yüksek Dalgalı Deniz' }
        ]
      }
    };

    const sp = specs[landmarkKey] || specs.bakery;
    window.openSheetWithHtml(`
      <div class="sheet-head">
        <div>
          <div style="font-size:11px;font-weight:800;color:#fbbf24;text-transform:uppercase;letter-spacing:0.04em;">Harita Noktası · 360° Canlı Bağlantı</div>
          <h3 style="font-size:18px;font-weight:800;color:#fff;margin-top:2px;">${esc(sp.title)}</h3>
        </div>
        <button class="icon-btn" onclick="closeSheet()"><svg class="ico" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>
      <p style="font-size:13px;color:#e2e8f0;line-height:1.52;margin-bottom:14px;">${esc(sp.insight)}</p>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${sp.items.map(it => {
          let name = it.id, price = '—', chg = 0;
          if (it.kind === 'bist') {
            const st = lookup[it.id];
            if (st) {
              name = `${st.ticker} · ${window.formatBistCompanyName ? window.formatBistCompanyName(st.name, st.ticker) : st.ticker}`;
              price = `${window.fmtNum(st.close, 2)} ₺`;
              chg = Number(st.change1D) || 0;
            }
          } else {
            const inst = window.instById?.get(it.id);
            if (inst) {
              name = window.getAssetMeta ? window.getAssetMeta(inst).title : inst.name;
              price = window.fmtAssetPrice(inst.currentPrice, inst.unitLabel, inst.isUsdAsset, inst.isRateInstrument);
              chg = Number(inst.tlChange1D ?? inst.change1D) || 0;
            }
          }
          const openFn = it.kind === 'bist' ? `openBistDetailDrawer('${esc(it.id)}')` : `openAssetDetailDrawer('${esc(it.id)}')`;
          return `
            <div onclick="${openFn}" style="cursor:pointer;padding:11px 13px;border-radius:13px;background:var(--bg-input);border:1px solid var(--border-hairline);display:flex;justify-content:space-between;align-items:center;gap:10px;">
              <div style="min-width:0;">
                <div style="font-size:13.5px;font-weight:700;color:#fff;">${esc(name)}</div>
                <div class="muted" style="font-size:11.5px;margin-top:2px;">${esc(it.why)}</div>
              </div>
              <div class="r-right num-tab" style="flex-shrink:0;">
                <div style="font-size:13.5px;font-weight:800;color:#fff;">${esc(price)}</div>
                <div class="${window.pctCls(chg)}" style="font-size:11px;">${window.fmtPct(chg, 2)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `);
  }

  function setWorldShock(shockKey) {
    activeWorldShock = WORLD_SHOCK_PRESETS[shockKey] ? shockKey : 'live';
    if (window.AetherExp) window.AetherExp.renderMeydanView();
  }

  function buildLivingWorldSvgHtml(clk) {
    const shock = WORLD_SHOCK_PRESETS[activeWorldShock] || WORLD_SHOCK_PRESETS.live;
    const lookup = window.marketData?.kitchenIntelSummary?.openHorizon?.bistStockLookup || {};
    const oilInst = window.instById?.get('emtia-petrol-bno');
    const agriInst = window.instById?.get('emtia-tarim-dba');
    const s1Inst = window.instById?.get('altin-sertifikasi');
    const sukukInst = window.instById?.get('kira-sertifikasi-sukuk');
    const tuprs = lookup.TUPRS;
    const thyao = lookup.THYAO;
    const bimas = lookup.BIMAS;

    const toneColors = {
      pos: { fill: 'rgba(16,185,129,0.20)', stroke: '#34d399', badge: '#6ee7b7' },
      warn: { fill: 'rgba(245,158,11,0.20)', stroke: '#fbbf24', badge: '#fde68a' },
      neg: { fill: 'rgba(239,68,68,0.22)', stroke: '#f87171', badge: '#fca5a5' },
      calm: { fill: 'rgba(30,41,59,0.82)', stroke: '#60a5fa', badge: '#e2e8f0' }
    };

    const tc = (k) => toneColors[shock.tones[k] || 'calm'];

    // Güneş veya Ay'ın gerçek İstanbul saatine göre gökyüzündeki konumu
    const isDaylight = clk.hour >= 6 && clk.hour < 19;
    const sunProgress = isDaylight
      ? (clk.hour + clk.minute / 60 - 6) / 13
      : ((clk.hour >= 19 ? clk.hour - 19 : clk.hour + 5) / 11);
    const orbX = Math.round(90 + Math.max(0, Math.min(1, sunProgress)) * 700);
    const orbY = Math.round(78 - Math.sin(Math.max(0, Math.min(1, sunProgress)) * Math.PI) * 44);

    const oilPrice = oilInst ? `$${window.fmtNum(oilInst.currentPrice, 1)}` : '$59';
    const agriPrice = agriInst ? `$${window.fmtNum(agriInst.currentPrice, 1)}` : '$26';
    const tuprsPrice = tuprs ? `${window.fmtNum(tuprs.close, 0)}₺` : '—';
    const thyaoPrice = thyao ? `${window.fmtNum(thyao.close, 0)}₺` : '—';
    const bimasPrice = bimas ? `${window.fmtNum(bimas.close, 0)}₺` : '—';
    const s1Price = s1Inst ? `S1 ${window.fmtNum(s1Inst.currentPrice, 1)}₺` : 'Altın S1';
    const sukukRate = sukukInst ? `%${window.fmtNum(sukukInst.currentPrice, 0)} Kira` : '%0 Vergi';

    return `
      <svg class="v9-map-svg" viewBox="0 0 880 410" role="img" aria-label="Fabrika Bacasından Mutfak Tenceresine Canlı Dünya Haritası">
        <defs>
          <linearGradient id="v9SeaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0c2442" stop-opacity="0.75"/>
            <stop offset="100%" stop-color="#081326" stop-opacity="0.35"/>
          </linearGradient>
          <radialGradient id="v9OrbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${isDaylight ? '#fbbf24' : '#818cf8'}" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="${isDaylight ? '#fbbf24' : '#818cf8'}" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Arka Plan Gökyüzü Ufku, Güneş/Ay ve Boğaz Suyu -->
        <circle cx="${orbX}" cy="${orbY}" r="44" fill="url(#v9OrbGlow)"/>
        <circle cx="${orbX}" cy="${orbY}" r="11" fill="${isDaylight ? '#fde68a' : '#c7d2fe'}"/>
        <path d="M 0 280 Q 170 250, 290 310 T 560 355 L 0 410 Z" fill="url(#v9SeaGrad)"/>
        <path d="M 240 95 C 430 85, 650 110, 880 95 L 880 410 L 210 410 Z" fill="rgba(16, 24, 39, 0.45)"/>

        <!-- CANLI AKIŞ HATLARI (HAMMADDEDEN BACAYA, BACADAN TENCEREYE) -->
        <path class="v9-flow-line ${shock.flows.f_oil_fac}" d="M 155 290 C 235 250, 295 190, 385 165"/>
        <path class="v9-flow-line ${shock.flows.f_oil_air}" d="M 160 280 C 230 190, 310 115, 445 92"/>
        <path class="v9-flow-line ${shock.flows.f_air_bak}" d="M 515 95 C 585 135, 620 195, 655 255"/>
        <path class="v9-flow-line ${shock.flows.f_fld_bak}" d="M 215 135 C 365 185, 515 235, 635 268"/>
        <path class="v9-flow-line ${shock.flows.f_fac_vlt}" d="M 465 170 C 565 170, 665 145, 755 135"/>
        <path class="v9-flow-line ${shock.flows.f_gat_vlt}" d="M 765 305 C 775 245, 775 195, 768 158"/>

        <!-- 1. BOĞAZ & TANKER (PETROL & DÖVİZ GİRİŞİ) -->
        <g class="v9-map-node v9-float-ship" onclick="window.AetherWorld.openLandmark('strait')">
          <rect x="34" y="255" width="194" height="84" rx="16" fill="#0b1322"/>
          <rect x="34" y="255" width="194" height="84" rx="16" fill="${tc('strait').fill}" stroke="${tc('strait').stroke}" stroke-width="1.8"/>
          <path d="M 54 292 L 102 292 L 110 304 L 48 304 Z" fill="${tc('strait').stroke}"/>
          <rect x="64" y="281" width="24" height="11" rx="2" fill="#e2e8f0"/>
          <text x="120" y="284" fill="#fff" font-size="12.5" font-weight="800">Boğaz &amp; Mazot</text>
          <text x="120" y="302" fill="${tc('strait').badge}" font-size="11.5" font-weight="700" font-family="JetBrains Mono, monospace">${oilPrice}</text>
          <text x="50" y="325" fill="#94a3b8" font-size="10.5">Petrol &amp; Döviz Girişi · Dokun</text>
        </g>

        <!-- 2. TARLA & BUĞDAY AMBARI -->
        <g class="v9-map-node" onclick="window.AetherWorld.openLandmark('field')">
          <rect x="44" y="88" width="182" height="78" rx="16" fill="#0b1322"/>
          <rect x="44" y="88" width="182" height="78" rx="16" fill="${tc('field').fill}" stroke="${tc('field').stroke}" stroke-width="1.8"/>
          <path d="M 66 136 L 66 108 M 59 116 L 66 123 L 73 116 M 59 125 L 66 132 L 73 125" stroke="${tc('field').stroke}" stroke-width="2.4" stroke-linecap="round" fill="none"/>
          <text x="86" y="116" fill="#fff" font-size="12.5" font-weight="800">Tarla &amp; Ambar</text>
          <text x="86" y="134" fill="${tc('field').badge}" font-size="11.5" font-weight="700" font-family="JetBrains Mono, monospace">Gıda ${agriPrice}</text>
          <text x="58" y="154" fill="#94a3b8" font-size="10.5">Buğday, Kuraklık &amp; Erzak</text>
        </g>

        <!-- 3. HAVALİMANI & LOJİSTİK -->
        <g class="v9-map-node" onclick="window.AetherWorld.openLandmark('airport')">
          <rect x="380" y="40" width="194" height="78" rx="16" fill="#0b1322"/>
          <rect x="380" y="40" width="194" height="78" rx="16" fill="${tc('airport').fill}" stroke="${tc('airport').stroke}" stroke-width="1.8"/>
          <path d="M 402 82 L 424 73 L 415 83 L 427 88 L 411 89 L 406 96 L 406 86 Z" fill="${tc('airport').stroke}"/>
          <text x="437" y="69" fill="#fff" font-size="12.5" font-weight="800">Uçak &amp; Nakliye</text>
          <text x="437" y="87" fill="${tc('airport').badge}" font-size="11.5" font-weight="700" font-family="JetBrains Mono, monospace">THY ${thyaoPrice}</text>
          <text x="396" y="106" fill="#94a3b8" font-size="10.5">Mazot Yakar, Döviz Kazanır</text>
        </g>

        <!-- 4. SANAYİ BACALARI & TRAFO VADİSİ -->
        <g class="v9-map-node" onclick="window.AetherWorld.openLandmark('factory')">
          <rect x="322" y="148" width="214" height="92" rx="18" fill="#0b1322"/>
          <rect x="322" y="148" width="214" height="92" rx="18" fill="${tc('factory').fill}" stroke="${tc('factory').stroke}" stroke-width="2"/>
          <path d="M 342 212 L 342 182 L 357 192 L 357 182 L 372 192 L 372 172 L 383 172 L 383 212 Z" fill="${tc('factory').stroke}"/>
          <circle cx="378" cy="163" r="4" fill="#cbd5e1" opacity="0.65"/>
          <text x="395" y="179" fill="#fff" font-size="13" font-weight="800">Fabrika &amp; Trafo</text>
          <text x="395" y="198" fill="${tc('factory').badge}" font-size="11.5" font-weight="700" font-family="JetBrains Mono, monospace">Tüpraş ${tuprsPrice}</text>
          <text x="339" y="227" fill="#cbd5e1" font-size="10.5">Rafineri · İhracat · Elektrik · Gümüş</text>
        </g>

        <!-- 5. MAHALLE FIRINI & PAZAR FİLESİ -->
        <g class="v9-map-node" onclick="window.AetherWorld.openLandmark('bakery')">
          <rect x="556" y="232" width="198" height="92" rx="18" fill="#0b1322"/>
          <rect x="556" y="232" width="198" height="92" rx="18" fill="${tc('bakery').fill}" stroke="${tc('bakery').stroke}" stroke-width="2"/>
          <rect x="574" y="256" width="28" height="22" rx="5" fill="${tc('bakery').stroke}"/>
          <path d="M 571 256 L 588 244 L 605 256 Z" fill="#fde68a"/>
          <text x="612" y="263" fill="#fff" font-size="13" font-weight="800">Fırın &amp; Market</text>
          <text x="612" y="282" fill="${tc('bakery').badge}" font-size="11.5" font-weight="700" font-family="JetBrains Mono, monospace">BİM ${bimasPrice}</text>
          <text x="572" y="310" fill="#cbd5e1" font-size="10.5">Mutfak Tenceresi &amp; Peşin Kasa</text>
        </g>

        <!-- 6. TAŞ KİLER & DARPHANE (%0 VERGİ KALKANI) -->
        <g class="v9-map-node" onclick="window.AetherWorld.openLandmark('vault')">
          <rect x="658" y="76" width="200" height="88" rx="18" fill="#0b1322"/>
          <rect x="658" y="76" width="200" height="88" rx="18" fill="${tc('vault').fill}" stroke="${tc('vault').stroke}" stroke-width="2"/>
          <path d="M 684 102 L 700 108 L 700 122 C 700 131, 692 137, 684 140 C 676 137, 668 131, 668 122 L 668 108 Z" fill="${tc('vault').stroke}"/>
          <text x="710" y="108" fill="#fff" font-size="12.5" font-weight="800">Taş Kiler (%0)</text>
          <text x="710" y="126" fill="${tc('vault').badge}" font-size="11" font-weight="700" font-family="JetBrains Mono, monospace">${s1Price} · ${sukukRate}</text>
          <text x="672" y="151" fill="#cbd5e1" font-size="10.5">Vergisiz Altın S1 &amp; Sukuk</text>
        </g>

        <!-- 7. BORSA ZİLİ & BANKA MAKAS KAPISI -->
        <g class="v9-map-node" onclick="window.AetherWorld.openLandmark('gate')">
          <rect x="302" y="294" width="224" height="82" rx="16" fill="#0b1322"/>
          <rect x="302" y="294" width="224" height="82" rx="16" fill="${clk.bistIsTradableNow ? toneColors.pos.fill : toneColors.warn.fill}" stroke="${clk.bistIsTradableNow ? '#34d399' : '#fbbf24'}" stroke-width="1.8"/>
          <circle cx="329" cy="326" r="10" fill="${clk.bistIsTradableNow ? '#34d399' : '#fbbf24'}"/>
          <text x="348" y="322" fill="#fff" font-size="12.5" font-weight="800">${clk.bistIsTradableNow ? 'Borsa Zili Çaldı (Açık)' : 'Tahtalar Kilitli'}</text>
          <text x="348" y="340" fill="${clk.bankHoursOpen ? '#6ee7b7' : '#fca5a5'}" font-size="11" font-weight="700" font-family="JetBrains Mono, monospace">
            Banka Makası: %${clk.bankSpreadPct.toFixed(2).replace('.', ',')}
          </text>
          <text x="320" y="362" fill="#94a3b8" font-size="10.5">${clk.tefasBeforeCutoff ? 'TEFAS 13:30 Öncesi (T+1)' : 'TEFAS 13:30 Geçti (+2 Gün)'}</text>
        </g>
      </svg>
    `;
  }

  function renderLivingHomeInto(mount, clk, myCap) {
    const esc = window.escapeHtml || (s => String(s || ''));
    const shock = WORLD_SHOCK_PRESETS[activeWorldShock] || WORLD_SHOCK_PRESETS.live;
    const story = window.AetherExp.buildTodayMorningStory();
    const allPz = window.AetherExp.getAllBlindPuzzles();
    const pzIdx = window.AetherExp.getActivePuzzleIdx ? window.AetherExp.getActivePuzzleIdx() : 0;
    const revChoice = window.AetherExp.getRevealedPuzzleChoice ? window.AetherExp.getRevealedPuzzleChoice() : null;
    const pz = allPz[pzIdx % allPz.length];
    const feed = window.marketData?.liveRealWorldFeed || [];

    // Görsel Ekmek / Pazar Filesi Erime Hesabı (20 Somun Gösterimi)
    const cpiYoy = Number(window.marketData?.macro?.cpiYoy) || 29.8;
    const lostLoaves1Y = Math.max(3, Math.min(14, Math.round(20 * (1 - 1 / (1 + cpiYoy / 100)))));
    const intactInCash = 20 - lostLoaves1Y;
    const activeFreeCash = myCap.freeCashTL || 0;
    const dailyBreadLoss = +((activeFreeCash * (Math.pow(1 + cpiYoy / 100, 1 / 365) - 1)) / 15).toFixed(1);

    const spreadBarWidth = clk.bankHoursOpen ? 18 : 86;
    const spreadBarCol = clk.bankHoursOpen ? '#34d399' : '#ef4444';

    mount.innerHTML = `
      <!-- 1. GERÇEK İSTANBUL UFUK ÇİZGİSİ VE SANİYELİK SEANS KİLİTLERİ -->
      <div class="v9-horizon-bar">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="sync-dot" style="width:9px;height:9px;background:${clk.bistIsTradableNow ? '#34d399' : '#fbbf24'};"></span>
            <div>
              <div style="font-size:15px;font-weight:800;color:#fff;letter-spacing:-0.02em;">
                İstanbul <span id="v9LiveClockSec" class="num-tab">${clk.timeSecStr}</span> · ${clk.day} ${clk.monthName} ${clk.dayName}
              </div>
              <div class="muted num-tab" style="font-size:11.5px;margin-top:1px;">
                <span id="v9NextBellCountdown">Seans sayacı hesaplanıyor…</span> · TÜİK Ayın 3’ü 10:00 (${window.AetherExp.formatCountdownShort(clk.tuikMs, clk.ms)})
              </div>
            </div>
          </div>

          <button class="btn-emerald" style="height:34px;font-size:12px;padding:0 13px;" onclick="switchTab('yolculuk')">
            10 Yılı 10 Dakikada Yaşa →
          </button>
        </div>

        <div class="v9-gate-strip">
          <div class="v9-gate-pill ${clk.bistIsTradableNow ? 'open-gate' : 'closed-gate'}">
            <div class="dim" style="font-size:10.5px;">Borsa İstanbul Kepengi</div>
            <div style="font-size:12.5px;font-weight:800;color:${clk.bistIsTradableNow ? '#34d399' : '#fbbf24'};margin-top:2px;">${esc(clk.bistLabel)}</div>
            <div class="dim" style="font-size:10px;margin-top:2px;">Satışta gerçek T+2 takas kilidi</div>
          </div>

          <div class="v9-gate-pill ${clk.bankHoursOpen ? 'open-gate' : 'danger-gate'}">
            <div class="dim" style="font-size:10.5px;">Banka Döviz/Altın Makas Ağzı</div>
            <div class="num-tab" style="font-size:12.5px;font-weight:800;color:${clk.bankHoursOpen ? '#34d399' : '#f87171'};margin-top:2px;">
              ${clk.bankHoursOpen
                ? `Dar Geçit (%${clk.bankSpreadPct.toFixed(2).replace('.', ',')})`
                : (clk.isBusinessDay && clk.hour >= 6 && clk.minsOfDay < 9 * 60)
                  ? `09:00 Öncesi Açık (%${clk.bankSpreadPct.toFixed(1).replace('.', ',')})`
                  : `Mesai Dışı Açık (%${clk.bankSpreadPct.toFixed(1).replace('.', ',')})`}
            </div>
            <div class="v9-jaws-track"><div class="v9-jaws-fill" style="width:${spreadBarWidth}%;background:${spreadBarCol};"></div></div>
          </div>

          <div class="v9-gate-pill ${clk.tefasBeforeCutoff ? 'open-gate' : 'closed-gate'}">
            <div class="dim" style="font-size:10.5px;">TEFAS 13:30 Fon Valörü</div>
            <div style="font-size:12.5px;font-weight:800;color:${clk.tefasBeforeCutoff ? '#34d399' : '#cbd5e1'};margin-top:2px;">
              ${clk.tefasBeforeCutoff ? '13:30 Öncesi (T+1 Fiyat)' : '13:30 Kaçtı (+2 İş Günü)'}
            </div>
            <div class="dim" style="font-size:10px;margin-top:2px;">Gerçek valör saati sınırı</div>
          </div>

          <div class="v9-gate-pill open-gate">
            <div class="dim" style="font-size:10.5px;">Senin Nefes Alanın</div>
            <div class="num-tab pos" style="font-size:13px;font-weight:800;margin-top:2px;">${window.fmtNum(myCap.breathingMonths, 1)} Ay Özgürlük</div>
            <div class="dim num-tab" style="font-size:10px;margin-top:2px;">Çark yılda ${window.fmtNum(myCap.sustainableYearlyMonths, 1)} ayı bedava taşır</div>
          </div>
        </div>
      </div>

      <!-- 2. İNTERAKTİF YAŞAYAN HARİTA: FABRİKA BACASINDAN MUTFAK TENCERESİNE -->
      <div class="v9-world-stage">
        <div class="v9-world-top">
          <div>
            <span style="font-size:10.5px;font-weight:800;color:#fbbf24;text-transform:uppercase;letter-spacing:0.05em;">
              YAŞAYAN EKONOMİ HARİTASI · DOKUN VE BAĞLANTIYI GÖR
            </span>
            <h2 style="font-size:17.5px;font-weight:800;color:#fff;letter-spacing:-0.02em;margin-top:2px;">
              Mazot, Buğday ve Faiz Değiştiğinde Kimin Bacası Tüter, Kimin Tenceresi Yanar?
            </h2>
          </div>
          <span class="chg-pill info" style="font-size:11px;">Noktalara Dokun</span>
        </div>

        <div class="v9-map-svg-wrap">
          ${buildLivingWorldSvgHtml(clk)}
        </div>

        <div class="v9-shock-bar">
          <div style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:6px;">
            Dünyayı Sallayıp Dalganın Nereye Vurduğunu Canlı İzle:
          </div>
          <div class="chip-rail">
            ${Object.entries(WORLD_SHOCK_PRESETS).map(([k, v]) => `
              <button class="chip ${activeWorldShock === k ? 'active' : ''}" onclick="window.AetherWorld.setWorldShock('${k}')">
                ${esc(v.label)}
              </button>
            `).join('')}
          </div>

          <div class="v9-shock-readout">
            <div style="flex:1;min-width:220px;">
              <div style="font-size:13.5px;font-weight:800;color:#fff;margin-bottom:3px;">${esc(shock.headline)}</div>
              <div class="muted" style="font-size:12px;line-height:1.45;">${esc(shock.story)}</div>
            </div>
            <button class="btn-primary" style="height:36px;font-size:12px;" onclick="${shock.focusKind === 'bist' ? `openBistDetailDrawer('${shock.focusId}')` : `openAssetDetailDrawer('${shock.focusId}')`}">
              ${esc(shock.focusBtn)}
            </button>
          </div>
        </div>
      </div>

      <!-- 3. SÖYLEME, GÖZÜNÜN ÖNÜNDE GÖSTER: ERİYEN EKMEK SEPETİ VS TAŞ KİLER -->
      <div class="v9-pantry-duel">
        <div class="v9-pantry-card" style="border-color:rgba(248,113,113,0.28);">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <span style="font-size:11px;font-weight:800;color:#f87171;text-transform:uppercase;">Cebinde Duran Nakdin Göz Önünde Erimesi</span>
            <span class="chg-pill neg num-tab">20 Ekmek → ${intactInCash} Ekmek</span>
          </div>
          <div class="v9-bread-grid" aria-hidden="true">
            ${Array.from({ length: 20 }).map((_, i) => `<span class="v9-bread-unit ${i >= intactInCash ? 'melted' : ''}"></span>`).join('')}
          </div>
          <p class="muted" style="font-size:12px;line-height:1.45;">
            Kasanda şu an boşta duran <strong class="num-tab" style="color:#fff;">${window.fmtTL(activeFreeCash, 0)}</strong> nakit, hiçbir yere dokunmazsan günde <strong class="neg num-tab">${window.fmtNum(dailyBreadLoss, 1)} somun ekmek</strong> alım gücü kaybediyor.
          </p>
        </div>

        <div class="v9-pantry-card" style="border-color:rgba(52,211,153,0.32);cursor:pointer;" onclick="window.AetherExp.openQuickRealOrderSheet('inst','kira-sertifikasi-sukuk')">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <span style="font-size:11px;font-weight:800;color:#34d399;text-transform:uppercase;">Taş Kilerde (%0 Vergili Kira + Altın S1)</span>
            <span class="chg-pill pos num-tab">20 Ekmek → 22 Ekmek</span>
          </div>
          <div class="v9-bread-grid" aria-hidden="true">
            ${Array.from({ length: 22 }).map((_, i) => `<span class="v9-bread-unit ${i >= 20 ? 'bonus' : ''}"></span>`).join('')}
          </div>
          <p class="muted" style="font-size:12px;line-height:1.45;">
            Aynı para %17,5 mevduat vergisi ödemeden Hazine Sukuk ve Darphane S1 kalkanında durduğunda hem ununu korur hem üstüne yeni somun ekler. <strong style="color:#34d399;">Korumaya Al →</strong>
          </p>
        </div>
      </div>

      <!-- 4. BUGÜNÜN GERÇEK KARAR YOLU + İSİMSİZ DÜKKÂN SINAVI -->
      <div class="radar-2col" style="margin-bottom:14px;">
        <div class="compass-hero" style="margin-bottom:0;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div style="display:inline-flex;font-size:10.5px;font-weight:700;color:var(--pos-bright);background:var(--pos-soft);padding:2.5px 9px;border-radius:99px;margin-bottom:7px;">
              ${esc(story.kicker)}
            </div>
            <h3 style="font-size:16.5px;font-weight:800;color:#fff;line-height:1.3;margin-bottom:7px;">${esc(story.headline)}</h3>
            <p class="muted" style="font-size:12px;line-height:1.5;margin-bottom:12px;">${esc(story.body)}</p>
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;">
            <button id="v9StoryBtnA" style="text-align:left;padding:11px 12px;border-radius:12px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.38);cursor:pointer;">
              <div style="font-size:12.5px;font-weight:800;color:#34d399;">1. Yol → ${esc(story.pathA.label)}</div>
              <div class="muted" style="font-size:11px;margin-top:2px;">${esc(story.pathA.sub)}</div>
            </button>
            <button id="v9StoryBtnB" style="text-align:left;padding:11px 12px;border-radius:12px;background:rgba(59,130,246,0.11);border:1px solid rgba(59,130,246,0.34);cursor:pointer;">
              <div style="font-size:12.5px;font-weight:800;color:#60a5fa;">2. Yol → ${esc(story.pathB.label)}</div>
              <div class="muted" style="font-size:11px;margin-top:2px;">${esc(story.pathB.sub)}</div>
            </button>
          </div>
        </div>

        <div class="surface surface-pad" style="margin-bottom:0;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="font-size:11px;font-weight:800;color:#fbbf24;text-transform:uppercase;">
              İsimsiz Dükkân Sınavı (${(pzIdx % allPz.length) + 1}/${allPz.length})
            </span>
            <button class="link-btn" style="padding:0;font-size:11.5px;" onclick="window.AetherExp.nextBlindPuzzle()">Yeni Soru →</button>
          </div>
          <p style="font-size:13px;font-weight:600;color:#fff;line-height:1.45;margin-bottom:9px;">${esc(pz.situation)}</p>
          <div style="display:flex;flex-direction:column;gap:7px;">
            ${pz.options.map((opt, idx) => {
              const isPicked = revChoice === opt.key;
              const showRev = revChoice !== null;
              const bCol = !showRev ? 'var(--border-hairline)' : opt.isBest ? 'rgba(16,185,129,0.55)' : isPicked ? 'rgba(245,158,11,0.55)' : 'var(--border-hairline)';
              const bg = !showRev ? 'var(--bg-input)' : opt.isBest ? 'rgba(16,185,129,0.10)' : isPicked ? 'rgba(245,158,11,0.09)' : 'var(--bg-input)';
              return `
                <div onclick="window.AetherExp.selectBlindPuzzleChoice('${opt.key}')" style="cursor:pointer;padding:9px 11px;border-radius:11px;border:1px solid ${bCol};background:${bg};">
                  <div style="font-size:12px;color:#f8fafc;line-height:1.42;"><strong style="color:var(--accent-bright);">${idx + 1}.</strong> ${esc(opt.desc)}</div>
                  ${showRev && (isPicked || opt.isBest) ? `
                    <div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border-hairline);font-size:11.5px;color:${opt.isBest ? '#6ee7b7' : '#fcd34d'};line-height:1.4;">
                      <strong>${esc(opt.revealTitle)}:</strong> ${esc(opt.lesson)}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- 5. CANLI KAP, RESMİ GAZETE VE SPK HALKA ARZ GERÇEĞİ -->
      <div class="radar-2col">
        <div class="surface" style="background:var(--bg-input);box-shadow:none;">
          <div style="padding:10px 13px;border-bottom:1px solid var(--border-hairline);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:12.5px;font-weight:700;color:#fff;">Canlı KAP, Resmi Gazete &amp; Dünya Akışı</span>
            <span class="dim" style="font-size:11px;">Arka Planda Canlı</span>
          </div>
          ${feed.slice(0, 4).map(n => {
            const badge = n.cat === 'makro_resmi' ? 'Resmi / Makro' : n.cat === 'kap_bist' ? 'KAP / Şirket' : 'Hammadde';
            const cls = n.cat === 'makro_resmi' ? 'warn' : n.cat === 'kap_bist' ? 'info' : 'pos';
            return `
              <div style="padding:9px 12px;border-bottom:1px solid var(--border-hairline);font-size:12px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                  <span class="chg-pill ${cls}" style="font-size:10px;">${badge}</span>
                  <span class="dim" style="font-size:10.5px;">${esc(n.source)}</span>
                </div>
                <div style="color:#f1f5f9;line-height:1.38;">${esc(n.title)}</div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="surface" style="background:var(--bg-input);box-shadow:none;padding:12px 13px;display:flex;flex-direction:column;justify-content:space-between;gap:10px;">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
              <span style="font-size:12.5px;font-weight:700;color:#fff;">SPK Eşit Dağıtım Halka Arz &amp; Temettü Masası</span>
              <span class="chg-pill info" style="font-size:10px;">Kişi Başı 22 Lot Sınırı</span>
            </div>
            <p class="muted" style="font-size:11.5px;line-height:1.42;margin-bottom:8px;">
              Türkiye gerçeği: Halka arza 50.000 ₺ talep girsen bile 1,85 milyon katılımcıda kişi başı en fazla 22 lot (759 ₺) düşer; üstü iade edilir. Deneyip gözünle gör:
            </p>
            <div style="display:flex;gap:6px;">
              <input type="number" id="ipoReqInpV9" class="inp mono" value="50000" step="5000" min="500" style="height:34px;font-size:12.5px;" />
              <button class="btn-secondary" style="height:34px;font-size:12px;" onclick="window.AetherExp.participateInSpkIpo(document.getElementById('ipoReqInpV9').value)">
                Talep Gir
              </button>
            </div>
          </div>
          <div style="border-top:1px solid var(--border-hairline);padding-top:8px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:11.5px;">
            <span class="muted">30 Saniyelik Görsel Özetler &amp; Sürü Radarı:</span>
            <button class="link-btn" style="padding:0;" onclick="switchTab('kesfet')">Sürüden Önce Gör Radarı →</button>
          </div>
        </div>
      </div>
    `;

    const btnA = document.getElementById('v9StoryBtnA');
    const btnB = document.getElementById('v9StoryBtnB');
    if (btnA) btnA.onclick = story.pathA.act;
    if (btnB) btnB.onclick = story.pathB.act;
    syncBodySkyAtmosphere();
  }

  /* ==========================================================================
     5. SAHNE 2: YOLCULUK — 10 YILI 10 DAKİKADA YAŞATAN BİSİKLET SAHASI
     ========================================================================== */
  function buildJourneyChartSvg(st) {
    const W = 680, H = 180, padL = 42, padR = 16, padT = 14, padB = 24;
    const allPts = [...st.userBagsHistory, ...st.calmMasterHistory, ...st.herdChaserHistory, 100];
    const minV = Math.max(15, Math.min(...allPts) * 0.9);
    const maxV = Math.max(125, Math.max(...allPts) * 1.08);
    const maxSteps = JOURNEY_CHAPTERS.length;
    const toX = (i) => padL + (i / maxSteps) * (W - padL - padR);
    const toY = (v) => padT + ((maxV - v) / Math.max(1, maxV - minV)) * (H - padT - padB);
    const pathOf = (arr) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ');
    const labels = ['Başla', ...JOURNEY_CHAPTERS.map(c => c.yr.split(' ')[0])];

    return `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;">
        <line x1="${padL}" y1="${toY(100)}" x2="${W - padR}" y2="${toY(100)}" stroke="rgba(245,158,11,0.4)" stroke-dasharray="4 4" stroke-width="1.3"/>
        <text x="${W - padR - 4}" y="${toY(100) - 5}" text-anchor="end" fill="#fbbf24" font-size="10">Başlangıç: 100 Pazar Filesi</text>
        ${labels.map((l, i) => `<text x="${toX(i)}" y="${H - 5}" text-anchor="middle" fill="#64748b" font-size="10">${l}</text>`).join('')}
        <path d="${pathOf(st.herdChaserHistory)}" fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="3 3"/>
        <path d="${pathOf(st.calmMasterHistory)}" fill="none" stroke="#60a5fa" stroke-width="2.2"/>
        <path d="${pathOf(st.userBagsHistory)}" fill="none" stroke="#34d399" stroke-width="3.2" stroke-linecap="round"/>
      </svg>
    `;
  }

  function renderYolculukView() {
    const mount = document.getElementById('yolculukRootMount');
    if (!mount) return;
    const st = ensureJourneyState();
    const esc = window.escapeHtml || (s => String(s || ''));
    const curBags = st.userBagsHistory[st.userBagsHistory.length - 1];
    const masterBags = st.calmMasterHistory[st.calmMasterHistory.length - 1];
    const herdBags = st.herdChaserHistory[st.herdChaserHistory.length - 1];
    const finished = st.stepIdx >= JOURNEY_CHAPTERS.length;
    const curCh = JOURNEY_CHAPTERS[Math.min(st.stepIdx, JOURNEY_CHAPTERS.length - 1)];

    const bucketsMeta = [
      { key: 'cash', title: 'Boş Cüzdan (Vadesiz)', sub: 'Rakam aynı kalır, erir' },
      { key: 'pantry', title: 'Vergisiz Kiler / Kira', sub: 'Sukuk, Tahvil & Günlük Fon' },
      { key: 'gold', title: 'Altın & Gümüş Kalkanı', sub: 'Kur ve kriz sığınağı' },
      { key: 'shops', title: 'Sağlam Türk Dükkânları', sub: 'Fırın, ihracat & trafo' },
      { key: 'world', title: 'Dünya Devleri (Dolar)', sub: 'Küresel 500 şirket' }
    ];

    mount.innerHTML = `
      <div class="v9-journey-shell ${st.stormShake ? 'storm-shake' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;">
          <div>
            <span style="font-size:10.5px;font-weight:800;color:#34d399;text-transform:uppercase;letter-spacing:0.05em;">
              DÜŞE KALKA BİSİKLET SAHASI · 2017’DEN 2026’YA GERÇEK TÜRKİYE TARİHİ
            </span>
            <h2 style="font-size:19px;font-weight:800;color:#fff;margin-top:2px;">
              ${finished ? '10 Yıllık Fırtına Bitti — İşte Geminin Son Durumu!' : esc(curCh.title)}
            </h2>
          </div>

          <div style="display:flex;gap:7px;flex-wrap:wrap;">
            ${!finished ? `
              <button class="btn-emerald" style="height:36px;" onclick="window.AetherWorld.toggleJourneyPlay()" ${st.activeDilemma ? 'disabled style="opacity:0.5;height:36px;"' : ''}>
                ${st.playing ? 'Duraklat' : 'Zamanı Akıt (Oynat)'}
              </button>
              <button class="btn-secondary" style="height:36px;" onclick="window.AetherWorld.advanceOneJourneyChapter()" ${st.activeDilemma ? 'disabled style="opacity:0.5;height:36px;"' : ''}>
                1 Dönem İlerle →
              </button>
            ` : ''}
            <button class="btn-secondary" style="height:36px;" onclick="window.AetherWorld.resetJourney()">Baştan Dene</button>
          </div>
        </div>

        <div class="v9-chapter-track">
          ${JOURNEY_CHAPTERS.map((c, idx) => `
            <div class="v9-chapter-step ${idx < st.stepIdx ? 'done' : idx === st.stepIdx ? 'current' : ''}" title="${esc(c.yr)}"></div>
          `).join('')}
        </div>

        <p style="font-size:13px;color:#e2e8f0;line-height:1.5;margin-bottom:12px;">
          ${esc(curCh.scene)}
        </p>

        <!-- ANİ FIRTINA KARAR ANI (VARSA ZAMANI DONDURUR VE SORAR!) -->
        ${st.activeDilemma ? `
          <div class="v9-storm-modal">
            <div style="font-size:11px;font-weight:800;color:#fca5a5;text-transform:uppercase;margin-bottom:4px;">
              ANİ SARSINTI · ZAMAN DURDU · ŞİMDİ NE YAPIYORSUN?
            </div>
            <div style="font-size:14px;font-weight:700;color:#fff;line-height:1.45;margin-bottom:10px;">
              ${esc(st.activeDilemma.prompt)}
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${st.activeDilemma.choices.map(ch => `
                <button onclick="window.AetherWorld.pickJourneyDilemmaChoice('${ch.key}')" style="text-align:left;padding:11px 13px;border-radius:12px;background:rgba(15,23,42,0.92);border:1px solid rgba(255,255,255,0.16);color:#fff;font-size:12.5px;font-weight:600;cursor:pointer;">
                  → ${esc(ch.label)}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 3 SOMUT YAŞAM GÖSTERGESİ (PAZAR FİLESİ, UYKU HUZURU, SABIR KIYASI) -->
        <div class="v9-gauges-3">
          <div class="stat-box">
            <div class="dim" style="font-size:11px;">Senin Alım Gücün (Başlangıç: 100 File)</div>
            <div class="num-tab ${curBags >= 100 ? 'pos' : 'neg'}" style="font-size:21px;font-weight:800;margin-top:2px;">
              ${window.fmtNum(curBags, 1)} Pazar Filesi
            </div>
            <div class="dim" style="font-size:11px;margin-top:2px;">Enflasyondan arındırılmış gerçek erzak gücü</div>
          </div>

          <div class="stat-box">
            <div class="dim" style="font-size:11px;">Gece Uyku Huzurun</div>
            <div class="num-tab ${st.sleep >= 70 ? 'pos' : st.sleep >= 45 ? 'warn' : 'neg'}" style="font-size:21px;font-weight:800;margin-top:2px;">
              %${Math.round(st.sleep)} ${st.borrowed ? '(Borç Baskısı!)' : '(Başın Rahat)'}
            </div>
            <div class="dim" style="font-size:11px;margin-top:2px;">
              <button class="link-btn" style="padding:0;font-size:11px;" onclick="window.AetherWorld.toggleJourneyDebt()">
                ${st.borrowed ? 'Kredi Yükünü Kapat' : 'Borçla / Krediyle Girsem Ne Olur? Dene'}
              </button>
            </div>
          </div>

          <div class="stat-box">
            <div class="dim" style="font-size:11px;">Sabırlı Usta vs. Dedikoducu</div>
            <div class="num-tab" style="font-size:13.5px;font-weight:800;color:#60a5fa;margin-top:3px;">
              Hiç Kurcalamayan Usta: ${window.fmtNum(masterBags, 0)} File
            </div>
            <div class="num-tab neg" style="font-size:12.5px;font-weight:700;margin-top:2px;">
              Sürüye Uyan Dedikoducu: ${window.fmtNum(herdBags, 0)} File
            </div>
          </div>
        </div>

        <!-- 5 SEPET KOVASI (DOKUNARAK AĞIRLIK VER — SIFIR KURAL KİTABI) -->
        <div style="font-size:11.5px;font-weight:700;color:var(--text-secondary);margin-bottom:6px;">
          Paranı Hangi Kovalarda Taşıyorsun? (+ / - ile dokun, otomatik %100 dengelenir):
        </div>
        <div class="v9-bucket-alloc-grid">
          ${bucketsMeta.map(b => {
            const val = st.w[b.key] || 0;
            return `
              <div class="v9-bucket-card ${val >= 20 ? 'active-weight' : ''}">
                <div>
                  <div style="font-size:12px;font-weight:800;color:#fff;">${esc(b.title)}</div>
                  <div class="dim" style="font-size:10.5px;margin-top:1px;">${esc(b.sub)}</div>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:4px;">
                  <button class="btn-secondary" style="height:28px;width:28px;padding:0;" onclick="window.AetherWorld.adjustJourneyBucket('${b.key}', -10)">-</button>
                  <strong class="num-tab" style="font-size:14px;color:#fff;">%${val}</strong>
                  <button class="btn-secondary" style="height:28px;width:28px;padding:0;" onclick="window.AetherWorld.adjustJourneyBucket('${b.key}', 10)">+</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- CANLI ZAMAN EĞRİSİ -->
        <div class="stat-box" style="padding:10px 12px;margin-bottom:10px;">
          <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:11px;margin-bottom:4px;">
            <span style="color:#34d399;font-weight:700;">● Senin Pazar Filen (${window.fmtNum(curBags, 0)})</span>
            <span style="color:#60a5fa;font-weight:700;">● Sabırlı Sepet Ustası (${window.fmtNum(masterBags, 0)})</span>
            <span style="color:#f87171;font-weight:700;">- - Dedikodu &amp; Panik (${window.fmtNum(herdBags, 0)})</span>
          </div>
          ${buildJourneyChartSvg(st)}
        </div>

        <div style="padding:10px 12px;border-radius:12px;background:rgba(59,130,246,0.09);border:1px solid rgba(59,130,246,0.25);font-size:12px;color:#e2e8f0;line-height:1.48;">
          <strong style="color:#60a5fa;">Yaşadığın Sonuç:</strong> ${esc(st.lastFeedback)}
        </div>
      </div>

      <!-- PLANLAMA VE ÖZGÜRLÜK HESAPLAYICILARINA HIZLI GEÇİŞ -->
      <div class="verdict-banner" style="margin-bottom:0;">
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--pos-bright);text-transform:uppercase;">KENDİ PARANLA GERÇEK ÖZGÜRLÜK TAKVİMİ</div>
          <div style="font-size:15px;font-weight:800;color:#fff;margin-top:2px;">Bugünkü birikimin ve aylık eklemenle kaç yılda kimseye eyvallahın kalmaz?</div>
        </div>
        <button class="btn-primary" onclick="switchTab('sepet')">Özgürlük &amp; Kupon Hesaplayıcıları Aç →</button>
      </div>
    `;
  }

  /* ==========================================================================
     6. AİLE ÇAY SALONU: LAF ATMA / SORU BIRAKMA DESTEĞİ
     ========================================================================== */
  function sendFamilyTeaBanter(presetMsg) {
    const inp = document.getElementById('v9TeaBanterInp');
    const msg = String(presetMsg || inp?.value || '').trim();
    if (!msg) {
      if (window.showToast) window.showToast('Çay masasına yazacak bir not girin');
      return;
    }
    if (window.AetherExp?.postFamilyBanterNote) {
      window.AetherExp.postFamilyBanterNote(msg);
      if (inp) inp.value = '';
    }
  }

  /* ==========================================================================
     7. ANA KANCALAR VE BAŞLATMA
     ========================================================================== */
  function bootLivingWorldV9() {
    syncBodySkyAtmosphere();
    setInterval(syncBodySkyAtmosphere, 1000);
  }

  window.AetherWorld = {
    openLandmark: openLandmarkExplorerSheet,
    setWorldShock,
    renderLivingHomeInto,
    renderYolculukView,
    adjustJourneyBucket,
    toggleJourneyDebt,
    advanceOneJourneyChapter,
    pickJourneyDilemmaChoice,
    toggleJourneyPlay,
    stopJourneyPlay,
    resetJourney,
    sendFamilyTeaBanter
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootLivingWorldV9);
  } else {
    bootLivingWorldV9();
  }
})();
