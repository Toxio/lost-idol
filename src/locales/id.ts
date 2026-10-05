import type {  TranslationKey } from './en';

export const id: Record<TranslationKey, string> = {
  info_ctrl_replay_desc: "Di Replay, Putar menampilkan ronde tercatat dan Putar Ulang mengulanginya. Panel menampilkan jumlah total, jumlah dasar, pengali mode, dan hadiah. Tidak memulai ronde baru atau mengubah saldo. Pilihan jumlah dan putar otomatis tidak tersedia.",
  info_ctrl_windows_desc: "Klik atau ketuk tombol. Tab menu menampilkan hadiah simbol, informasi, dan suara. Gulir teks dan daftar panjang. × menutup jendela jika tersedia. Kontrol nonaktif tidak dapat digunakan pada keadaan atau batas saat ini. Notifikasi menawarkan tutup, coba lagi, atau sambungkan ulang; menyambungkan ulang memulihkan ronde yang tercatat.",
  info_ctrl_feature_desc: "Setelah transisi, mulai putaran gratis. Penghitung menunjukkan putaran saat ini dan jumlah total; kemenangan bonus menunjukkan akumulasi hadiah. Putaran berjalan otomatis. Spin/Stop mempersingkat animasi jika diizinkan; Kecepatan mengubah lajunya. Putar otomatis tetap terlihat tetapi nonaktif. Lanjutkan menutup ringkasan.",
  info_ctrl_bonus_desc: "Membuka pilihan bonus. Pilih putaran gratis atau Wild Spin untuk melihat aturan dan total biaya. − / + mengubah taruhan dasar juga di layar utama dan tabel hadiah. Memilih kartu belum memulai ronde; untuk mode di atas 2×, tombol bawah membuka konfirmasi terpisah dengan mode, pengali, dan total. Hanya konfirmasi pembelian yang memulai bonus; Batal atau × kembali tanpa memulai. × menutup tanpa membeli. Tidak tersedia saat ronde, putaran gratis, atau putar otomatis.",
  wild_spin_title: "Putaran Wild",
  wild_spin_rules: "Satu putaran seharga 10× taruhan dasar. Setidaknya satu Wild meluas ke seluruh gulungan dengan pengali ×2, ×3, ×5 atau ×10. Tanpa SCATTER, bintang atau putaran gratis. Kemenangan tidak dijamin. Kemenangan maksimum: 5000× taruhan dasar.",

  buy_bonus_title: "Beli bonus",
  buy_bonus_action: "Beli",
  buy_bonus_cost: "Total biaya",
  buy_bonus_confirm: "Konfirmasi pembelian",
  buy_bonus_rules: "Wild meluas dengan ×2, ×3, ×5 atau ×10. Tanpa biaya tambahan per putaran gratis atau pemicu ulang. Batas 5000× taruhan dasar mengakhiri bonus lebih awal. Papan SCATTER awal hanya memulai bonus dan tidak memberikan kemenangan. Hanya putaran gratis yang memberikan pembayaran. Wild tidak dijamin.",

  bonus_wild_multipliers: "Pengali Wild",
  bonus_win: "Kemenangan fitur",
  bonus_collect: "Lanjutkan",
  bonus_done: "Putaran gratis selesai",
  bonus_start: "Mulai putaran gratis",
  bonus_limits: "Taruhan pemicu tetap. Tidak ada pemicu ulang. Bintang tetap membayar, kotak SCATTER tidak. Putaran berakhir saat mencapai batas 5000× taruhan.",
  bonus_intro: "Wild meluas ke seluruh gulungan dengan ×2, ×3, ×5 atau ×10. Semua putaran gratis yang diperoleh dimainkan tanpa biaya tambahan.",
  bonus_title: "Putaran gratis",
  footer_balance: 'Saldo',
  footer_win: 'Menang',

  menu_paytable: 'Tabel pembayaran',
  menu_info: 'Info',
  menu_sound: 'Suara',

  sound_music_label: 'Musik',
  sound_effects_label: 'Efek suara',
  sound_muted_banner: 'Suara dimatikan — ketuk untuk menyalakan',
  sound_muted_unmute: 'Aktifkan suara',

  bet_title: 'Bet',
  bet_confirm: 'Konfirmasi',

  autospin_title: 'Autoplay',

  autospin_start: 'Mulai',
  autospin_stop_label: 'Hentikan putar otomatis ketika',
  autospin_stop_after_win: 'Berhenti setelah kemenangan pertama',
  autospin_stop_win_reaches: 'Berhenti saat menang tunggal',
  autospin_stop_loss: 'Berhenti saat kerugian mencapai',
  autospin_bet_unit: 'Taruhan',

  autoplay_stopped_title: 'Putar Otomatis Berhenti',
  autoplay_stopped_subtitle: 'Sesi putar otomatis Anda telah berakhir.',
  autoplay_stopped_cancel: 'Batal',
  autoplay_stopped_repeat: 'Ulangi putar otomatis',

  session_expired_title: 'Sesi berakhir',
  session_expired_subtitle: 'Sesi Anda berakhir karena tidak aktif.',
  session_expired_progress: 'Kemajuan Anda tersimpan dan akan tersedia setelah terhubung kembali.',
  session_expired_reconnect: 'Hubungkan kembali',

  connection_lost_title: 'Koneksi Terputus',
  connection_lost_subtitle:
    'Koneksi ke server telah terputus. Silakan periksa koneksi internet Anda dan coba lagi.',
  connection_lost_retry: 'Coba Lagi',

  insufficient_badge: 'Pemberitahuan',
  insufficient_title: 'Saldo Tidak Cukup',
  insufficient_message:
    'Tambahkan dana untuk terus bermain. Saldo Anda saat ini tidak cukup untuk taruhan ini.',
  insufficient_close: 'Tutup',

  paytable_scatter: 'Scatter',
  paytable_star_note: "Bintang muncul pada gulungan 1, 3, dan 5 serta membayar terlepas dari garis pembayaran. Bintang tidak memicu putaran gratis.",
  paytable_wild_note:
    'Wild Meluas mendarat di gulungan ke-2, ke-3, dan ke-4 dan menggantikan semua simbol di gulungan yang sama kecuali Scatter. Dapat muncul dengan pengali ×5, ×3, atau ×2.',
  paytable_dollar_note: "Kotak SCATTER dapat muncul di kelima gulungan. Di permainan dasar, 3 / 4 / 5 kotak memberi 5 / 10 / 15 putaran gratis tanpa bergantung pada garis pembayaran. Kotak tidak membayar uang dan tidak memicu ulang putaran gratis.",

  info_intro_title: 'Pengantar',
  info_intro_body:
    "Lost Idol memiliki 5 gulungan, 10 garis dan Wild meluas. Garis membayar dari kiri ke kanan, bintang membayar tanpa bergantung pada garis. Kotak SCATTER dapat muncul di kelima gulungan. Di permainan dasar, 3 / 4 / 5 kotak memberi 5 / 10 / 15 putaran gratis tanpa bergantung pada garis pembayaran. Kotak tidak membayar uang dan tidak memicu ulang putaran gratis.",
  info_howtobet_title: 'Cara Bertaruh',
  info_howtobet_1: 'Taruhan dilakukan dengan menekan tombol "Mulai" atau tombol taruhan mana pun.',
  info_paylines_title: 'Garis Pembayaran dan Aturan',
  info_paylines_body_1:
    'Semua pembayaran diberikan untuk kombinasi simbol yang cocok. Kecuali simbol Scatter, kombinasi menang harus muncul pada gulungan berurutan dari kiri ke kanan, dimulai dari gulungan pertama dan mengikuti garis pembayaran aktif.',
  info_paylines_body_2:
    "Hanya kombinasi tertinggi pada setiap garis yang dibayar. Kemenangan semua garis dan SCATTER dijumlahkan. Pengali tabel pembayaran berlaku untuk total taruhan yang dipilih, tanpa dibagi jumlah garis. Pengali Wild di atas ×1 pada garis kemenangan dijumlahkan.",
  info_paylines_body_3:
    'Setiap malfungsi game akan membatalkan semua putaran dan kemenangan. Hasil setiap putaran ditentukan secara acak, dan tindakan atau keterampilan pemain tidak berpengaruh pada hasilnya.',
  info_controls_title: 'Kontrol Game',
  info_ctrl_spin_label: 'Mulai',
  info_ctrl_spin_desc:
    "Tekan Spin atau Spasi untuk mulai saat diizinkan. Saat putaran manual, Stop atau ketukan di area permainan mempersingkat animasi tanpa mengubah hasil. Spasi tidak bekerja saat jendela terbuka dan dapat dinonaktifkan oleh platform.",
  info_ctrl_autospin_label: 'Putar Otomatis',
  info_ctrl_autospin_desc:
    "Pilih jumlah putaran dan opsional berhenti setelah hadiah pertama, hadiah tunggal, atau kerugian bersih mencapai batas. Atur batas dengan − / + lalu Mulai. Angka di kotak menunjukkan putaran yang belum dimulai. Ketuk kotak untuk menghentikan putaran berikutnya; ronde saat ini selesai. Ulangi memakai pengaturan yang sama; Batal menutup ringkasan.",
  info_ctrl_speed_label: 'Kecepatan',
  info_ctrl_speed_desc:
    "Beralih antara Normal, Cepat, dan Turbo, termasuk saat putar otomatis dan putaran gratis. Putar otomatis dimulai pada Turbo. Hanya kecepatan animasi yang berubah. Platform dapat menonaktifkannya.",
  info_ctrl_bet_label: 'Opsi taruhan',
  info_ctrl_bet_desc:
    "Ketuk jumlah, pilih nilai atau gunakan − / + lalu konfirmasi. Menutup jendela juga menerapkan pilihan. Panah utama langsung mengubah taruhan. Bonus dan tabel hadiah memakai taruhan yang sama. Tidak dapat diubah saat ronde atau putar otomatis.",
  info_ctrl_menu_label: 'Menu',
  info_ctrl_menu_desc: 'Setelah mengklik tombol "Menu", pemain masuk ke menu "Pengaturan".',
  info_ctrl_sound_label: 'Kontrol suara',
  info_ctrl_sound_desc:
    "Speaker mematikan atau mengaktifkan seluruh suara. Penggeser pada tab Suara mengatur musik dan efek secara terpisah. Aktifkan suara terlebih dahulu jika dibisukan.",
  info_balance_label: 'Saldo',
  info_balance_desc: "Saldo menunjukkan jumlah tersedia, kemenangan menunjukkan hasil ronde. Keduanya indikator, bukan tombol.",
  info_betvalue_label: 'Opsi taruhan',
  info_betvalue_desc:
    'Menampilkan total taruhan yang diterapkan di semua garis pembayaran aktif. Memilih opsi ini memungkinkan pemain memilih jumlah taruhan yang berbeda.',
  info_rules_title: 'Aturan',
  info_rule_1: 'Pembayaran ditampilkan di Tabel Pembayaran.',
  info_rule_2:
    'Hadiah Scatter independen dari hadiah garis pembayaran dan juga ditambahkan ke total yang dibayarkan.',
  info_rule_3: 'Kemenangan simultan di garis pembayaran yang berbeda ditambahkan.',
  info_rule_4: 'Malfungsi membatalkan semua pembayaran dan permainan.',
  info_rule_minbet: 'Taruhan Minimum:',
  info_rule_maxbet: 'Taruhan Maksimum:',
  info_interruptions_title: 'Gangguan Game',
  info_recovery_label: 'Pemulihan Game Penuh',
  info_recovery_desc:
    "Setelah tersambung kembali, server memulihkan putaran yang belum selesai dan taruhan awalnya. Putaran tersimpan diputar ulang dari awal tanpa biaya tambahan. Server membayar kemenangan hanya sekali.",
  info_cancellation_label: 'Pembatalan',
  info_cancellation_desc:
    "Jika putaran terputus, sambungkan kembali untuk memulihkan hasilnya. Server menentukan hasil akhir dan saldo; animasi yang terputus tidak menghasilkan pembayaran sebagian.",
  info_responsible_title: 'Permainan Bertanggung Jawab',
  info_responsible_autoplay_label: 'Cara menggunakan fitur putar otomatis',
  info_responsible_autoplay_desc:
    'Ketika tombol "Putar Otomatis" ditekan, game masuk ke mode otomatis dengan jumlah putaran yang terbatas. Selama Putar Otomatis, akan ada hitung mundur dari jumlah putaran yang tersisa di dalam tombol "Hentikan otomatis" dan ketika mencapai nol, fitur Putar Otomatis akan secara otomatis berakhir. Kapan saja, pemain dapat menonaktifkan fitur Putar Otomatis dengan menekan tombol "Hentikan otomatis".',
  info_rtp_title: 'Kembalian ke Pemain',
  info_rtp_body: 'RTP rata-rata game adalah 96%.',
  info_disclaimer_title: "Sanggahan",
  info_disclaimer_body: "Malfungsi apa pun akan membatalkan semua kemenangan dan permainan. Diperlukan koneksi internet yang stabil. Jika terjadi pemutusan, muat ulang permainan untuk menyelesaikan ronde yang belum selesai. Pengembalian yang diharapkan dihitung berdasarkan banyak permainan. Tampilan permainan bukan representasi perangkat fisik apa pun dan hanya bersifat ilustratif. Kemenangan diselesaikan berdasarkan jumlah yang diterima dari Server Permainan Jarak Jauh, bukan berdasarkan peristiwa di peramban.\n\nTM dan © 2026 Engine.",
  replay_play: "Putar",
  replay_play_again: "Putar Ulang",
  replay_loading: "Memuat ulangan…",
  replay_error: "Tidak dapat memuat ulangan.",
  replay_bet_label: "Taruhan",
  replay_badge: "ULANGAN",
  replay_title: "Ulangan Taruhan",
  replay_mode_label: "Mode",
  replay_base_bet: "Taruhan Dasar",
  replay_cost_multiplier: "Pengganda Biaya",
  replay_total_bet_cost: "Total Biaya Taruhan",
  replay_payout_multiplier: "Pengganda Pembayaran",
  replay_total_win: "Total Kemenangan",
  replay_start: "Mulai Ulangan",
  replay_disclaimer: "Ini adalah ulangan ronde sebelumnya. Tidak ada taruhan yang akan dipasang.",
};
