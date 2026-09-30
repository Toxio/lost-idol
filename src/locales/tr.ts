import type {  TranslationKey } from './en';

export const tr: Record<TranslationKey, string> = {
  info_ctrl_replay_desc: "Replay ekranında Oynat kayıtlı turu oynatır, Tekrar Oynat tekrarlar. Toplam tutar, temel tutar, mod çarpanı ve kazanç gösterilir. Yeni tur başlamaz, bakiye değişmez. Tutar seçimi ve otomatik oyun kullanılamaz.",
  info_ctrl_windows_desc: "Düğmelere tıklayın veya dokunun. Menü sekmeleri sembol kazançlarını, bilgileri ve sesi gösterir. Uzun metinleri ve listeleri kaydırın. × uygun pencereleri kapatır. Devre dışı kontroller mevcut durumda veya sınıra ulaşıldığında kullanılamaz. Bildirimler kapatma, yeniden deneme veya bağlanma sunar; yeniden bağlanma kayıtlı turu geri yükler.",
  info_ctrl_feature_desc: "Geçişten sonra ücretsiz dönüşleri başlatın. Sayaç mevcut dönüşü ve toplamı, bonus kazancı biriken kazancı gösterir. Dönüşler otomatik ilerler. İzin verildiğinde Spin/Stop animasyonu kısaltır; Hız tempoyu değiştirir. Otomatik oyun görünür ancak devre dışıdır. Devam özeti kapatır.",
  info_ctrl_bonus_desc: "Bonus seçimini açar. Kuralları ve toplam tutarı görmek için ücretsiz dönüş veya Wild Spin kartını seçin. − / + temel bahsi ana oyunda ve kazanç tablosunda da değiştirir. Kart seçimi tur başlatmaz: 2× üzerindeki modlarda alttaki düğme mod, çarpan ve toplam tutarı gösteren ayrı bir onay açar. Yalnızca satın alma onayı bonusu başlatır; İptal veya × başlatmadan geri döner. × satın almadan kapatır. Tur, ücretsiz dönüşler veya otomatik oyun sırasında kullanılamaz.",
  wild_spin_title: "Wild Turu",
  wild_spin_rules: "Temel bahsin 10 katına bir tur. En az bir Wild, ×2, ×3, ×5 veya ×10 çarpanıyla tüm makaraya yayılır. SCATTER, yıldız veya ücretsiz tur yoktur. Kazanç garanti değildir. En yüksek kazanç: temel bahsin 5000 katı.",

  buy_bonus_title: "Bonus satın al",
  buy_bonus_action: "Satın al",
  buy_bonus_cost: "Toplam tutar",
  buy_bonus_confirm: "Satın almayı onayla",
  buy_bonus_rules: "Wild ×2, ×3, ×5 veya ×10 ile genişler. Ücretsiz dönüşlerde ek ücret ve yeniden tetikleme yoktur. Temel bahsin 5000× tur limiti bonusu erken bitirir. Başlangıçtaki SCATTER ekranı yalnızca bonusu başlatır ve kazanç vermez. Yalnızca ücretsiz dönüşler ödeme yapar. Wild garanti edilmez.",

  bonus_wild_multipliers: "Wild çarpanları",
  bonus_win: "Bonus kazancı",
  bonus_collect: "Devam et",
  bonus_done: "Ücretsiz dönüşler tamamlandı",
  bonus_start: "Ücretsiz dönüşleri başlat",
  bonus_limits: "Tetikleyen bahis sabit kalır. Yeniden tetikleme yoktur. Yıldızlar ödeme yapar, SCATTER kutuları yapmaz. Tur, bahsin 5000 katı sınırında sona erer.",
  bonus_intro: "Wild tüm makaraya ×2, ×3, ×5 veya ×10 ile genişler. Kazanılan tüm ücretsiz dönüşler ek ücret olmadan oynanır.",
  bonus_title: "Ücretsiz dönüşler",
  footer_balance: 'Bakiye',
  footer_win: 'Kazanç',

  menu_paytable: 'Ödeme tablosu',
  menu_info: 'Bilgi',
  menu_sound: 'Ses',

  sound_music_label: 'Müzik',
  sound_effects_label: 'Ses efektleri',
  sound_muted_banner: 'Ses kapalı — açmak için dokunun',
  sound_muted_unmute: 'Sesi aç',

  bet_title: 'Bet',
  bet_confirm: 'Onayla',

  autospin_title: 'Autoplay',

  autospin_start: 'Başlat',
  autospin_stop_label: 'Otomatik döndürmeyi durdur:',
  autospin_stop_after_win: 'İlk kazançtan sonra durdur',
  autospin_stop_win_reaches: 'Tek kazançta durdur',
  autospin_stop_loss: 'Kayıp bu değere ulaşınca durdur',
  autospin_bet_unit: 'Bahis',

  autoplay_stopped_title: 'Otomatik Oyun Durdu',
  autoplay_stopped_subtitle: 'Otomatik oyun oturumunuz sona erdi.',
  autoplay_stopped_cancel: 'İptal',
  autoplay_stopped_repeat: 'Otomatik oyunu tekrarla',

  session_expired_title: 'Oturum süresi doldu',
  session_expired_subtitle: 'Oturumunuz hareketsizlik nedeniyle sona erdi.',
  session_expired_progress:
    'İlerlemeniz kaydedildi ve yeniden bağlandıktan sonra kullanılabilir olacak.',
  session_expired_reconnect: 'Yeniden bağlan',

  connection_lost_title: 'Bağlantı Kesildi',
  connection_lost_subtitle:
    'Sunucuyla bağlantı kesildi. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.',
  connection_lost_retry: 'Tekrar Dene',

  insufficient_badge: 'Bildirim',
  insufficient_title: 'Yetersiz Bakiye',
  insufficient_message:
    'Oynamaya devam etmek için para yatırın. Mevcut bakiyeniz bu bahis için yeterli değil.',
  insufficient_close: 'Kapat',

  paytable_scatter: 'Scatter',
  paytable_star_note: "Yıldızlar 1, 3 ve 5. makaralarda görünür ve ödeme çizgilerinden bağımsız ödeme yapar. Ücretsiz dönüşleri tetiklemezler.",
  paytable_wild_note:
    "Genişleyen Wild, 2., 3. ve 4. makaralara düşer ve Scatter'lar hariç aynı makaradaki tüm sembollerin yerine geçer. ×5, ×3 veya ×2 çarpanlarıyla görünebilir.",
  paytable_dollar_note: "SCATTER kutuları beş makaranın tümünde görünebilir. Ana oyunda 3 / 4 / 5 kutu, çizgilerden bağımsız 5 / 10 / 15 ücretsiz dönüş verir. Kutular para ödemez ve ücretsiz dönüşlerde yeniden tetikleme yapmaz.",

  info_intro_title: 'Giriş',
  info_intro_body:
    "Lost Idol, 5 makara, 10 çizgi ve genişleyen Wild içerir. Çizgiler soldan sağa, yıldızlar çizgilerden bağımsız ödeme yapar. SCATTER kutuları beş makaranın tümünde görünebilir. Ana oyunda 3 / 4 / 5 kutu, çizgilerden bağımsız 5 / 10 / 15 ücretsiz dönüş verir. Kutular para ödemez ve ücretsiz dönüşlerde yeniden tetikleme yapmaz.",
  info_howtobet_title: 'Nasıl Bahis Yapılır',
  info_howtobet_1:
    '"Başlat" düğmesine veya bahis düğmelerinden herhangi birine basılarak bahis yapılır.',
  info_paylines_title: 'Ödeme Çizgileri ve Kurallar',
  info_paylines_body_1:
    'Tüm ödemeler eşleşen sembol kombinasyonları için verilir. Scatter semboller hariç, kazanan kombinasyonlar birinci makaradan başlayarak aktif bir ödeme çizgisini takip ederek soldan sağa ardışık makaralarda görünmelidir.',
  info_paylines_body_2:
    "Her çizgide yalnızca en yüksek eşleşme ödenir. Tüm çizgilerin ve SCATTER sembollerinin kazançları toplanır. Ödeme tablosu çarpanları seçilen toplam bahse uygulanır; bahis çizgi sayısına bölünmez. Kazanan çizgide ×1 üzerindeki Wild çarpanları toplanır.",
  info_paylines_body_3:
    'Herhangi bir oyun arızası tüm oyun turlarını ve kazançları geçersiz kılar. Her spinin sonucu rastgele belirlenir ve oyuncunun eylemleri veya becerileri sonuçlar üzerinde herhangi bir etkiye sahip değildir.',
  info_controls_title: 'Oyun Kontrolleri',
  info_ctrl_spin_label: 'Başlat',
  info_ctrl_spin_desc:
    "İzin verildiğinde Spin veya boşluk tuşu tur başlatır. Manuel dönüşte Stop veya oyun alanına dokunmak animasyonu kısaltır, sonucu değiştirmez. Açık pencerelerde boşluk tuşu çalışmaz; platform da devre dışı bırakabilir.",
  info_ctrl_autospin_label: 'Otomatik Oyun',
  info_ctrl_autospin_desc:
    "Dönüş sayısını ve isteğe bağlı ilk kazanç, tek kazanç tutarı veya net kayıp durdurma koşulunu seçin. Eşikleri − / + ile ayarlayıp Başlat ile onaylayın. Karedeki sayı henüz başlamayan dönüşlerdir. Kare sonraki dönüşleri durdurur; mevcut tur tamamlanır. Tekrar aynı ayarları kullanır; İptal özeti kapatır.",
  info_ctrl_speed_label: 'Hız',
  info_ctrl_speed_desc:
    "Otomatik oyun ve ücretsiz dönüşler dahil Normal, Hızlı ve Turbo arasında geçiş yapar. Otomatik oyun Turbo ile başlar. Yalnızca animasyon hızını değiştirir. Platform bu kontrolü kapatabilir.",
  info_ctrl_bet_label: 'Bahis seçenekleri',
  info_ctrl_bet_desc:
    "Tutara dokunun, bir değer seçin veya − / + kullanıp onaylayın. Pencereyi kapatmak da seçimi uygular. Ana oklar bahsi doğrudan değiştirir. Bonus ve kazanç tablosu aynı bahsi kullanır. Tur ve otomatik oyun sırasında değiştirilemez.",
  info_ctrl_menu_label: 'Menü',
  info_ctrl_menu_desc: '"Menü" düğmesine tıklandığında oyuncu "Ayarlar" menüsüne girer.',
  info_ctrl_sound_label: 'Ses kontrolü',
  info_ctrl_sound_desc:
    "Hoparlör tüm sesi kapatır veya açar. Ses sekmesindeki kaydırıcılar müzik ve efektleri ayrı ayarlar. Ayarlamadan önce sessiz modu kapatın.",
  info_balance_label: 'Bakiye',
  info_balance_desc: "Bakiye kullanılabilir tutarı, kazanç tur sonucunu gösterir. Bunlar gösterge olup düğme değildir.",
  info_betvalue_label: 'Bahis seçenekleri',
  info_betvalue_desc:
    'Tüm aktif ödeme çizgilerinde uygulanan toplam bahsi gösterir. Bu seçeneği seçmek, oyuncunun farklı bir bahis miktarı seçmesine olanak tanır.',
  info_rules_title: 'Kurallar',
  info_rule_1: 'Ödemeler Ödeme tablosunda görüntülenir.',
  info_rule_2:
    'Scatter ödülleri çizgi ödüllerinden bağımsızdır ve ödenen toplam miktara da eklenir.',
  info_rule_3: 'Farklı ödeme çizgilerindeki eş zamanlı kazançlar eklenir.',
  info_rule_4: 'Arıza tüm ödemeleri ve oyunları geçersiz kılar.',
  info_rule_minbet: 'Minimum Bahis:',
  info_rule_maxbet: 'Maksimum Bahis:',
  info_interruptions_title: 'Oyun Kesintileri',
  info_recovery_label: 'Tam Oyun Kurtarma',
  info_recovery_desc:
    "Yeniden bağlanınca sunucu tamamlanmamış turu ve ilk bahsi geri yükler. Kayıtlı tur ek ücret olmadan baştan oynatılır. Kazanç sunucu tarafından yalnızca bir kez ödenir.",
  info_cancellation_label: 'İptal',
  info_cancellation_desc:
    "Tur kesilirse kayıtlı sonucu geri yüklemek için yeniden bağlanın. Sonucu ve bakiyeyi sunucu belirler; kesilen animasyon kısmi ödeme oluşturmaz.",
  info_responsible_title: 'Sorumlu Oyun',
  info_responsible_autoplay_label: 'Otomatik oyun özelliği nasıl kullanılır',
  info_responsible_autoplay_desc:
    '"Otomatik Oyun" düğmesine basıldığında oyun, sınırlı sayıda döndürmeyle otomatik moda girer. Otomatik Oyun sırasında "Otomatik durdur" düğmesinin içinde kalan döndürme sayısının geri sayımı olur ve sıfıra ulaştığında Otomatik Oyun özelliği otomatik olarak sonlandırılır. Oyuncu istediği zaman "Otomatik durdur" düğmesine basarak Otomatik Oyun özelliğini devre dışı bırakabilir.',
  info_rtp_title: 'Oyuncuya Dönüş',
  info_rtp_body: "Oyunun ortalama RTP'si %95'dır.",
  info_disclaimer_title: "Feragatname",
  info_disclaimer_body: "Herhangi bir arıza tüm kazançları ve oyunları geçersiz kılar. Sürekli bir internet bağlantısı gereklidir. Bağlantı kesilirse, tamamlanmamış turları bitirmek için oyunu yeniden yükleyin. Beklenen getiri birçok oyun üzerinden hesaplanır. Oyun ekranı herhangi bir fiziksel cihazı temsil etmez ve yalnızca gösterim amaçlıdır. Kazançlar Uzak Oyun Sunucusu'ndan alınan tutara göre ödenir ve tarayıcı içindeki olaylara göre değerlendirilmez.\n\nTM ve © 2026 Engine.",
  replay_play: "Oynat",
  replay_play_again: "Tekrar Oynat",
  replay_loading: "Tekrar yükleniyor…",
  replay_error: "Tekrar yüklenemedi.",
  replay_bet_label: "Bahis",
  replay_badge: "TEKRAR",
  replay_title: "Bahis Tekrarı",
  replay_mode_label: "Mod",
  replay_base_bet: "Temel Bahis",
  replay_cost_multiplier: "Maliyet Çarpanı",
  replay_total_bet_cost: "Toplam Bahis Maliyeti",
  replay_payout_multiplier: "Kazanç Çarpanı",
  replay_total_win: "Toplam Kazanç",
  replay_start: "Tekrarı Başlat",
  replay_disclaimer: "Bu, önceki bir turun tekrarıdır. Yeni bahis alınmayacaktır.",
};
