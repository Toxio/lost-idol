import type {  TranslationKey } from './en';

export const ja: Record<TranslationKey, string> = {
  info_ctrl_replay_desc: "Replay では 再生 で記録済みのラウンドを再生し、もう一度再生 で再度再生します。合計額、基本額、モード倍率、獲得額を表示します。新しいラウンドは開始せず、残高も変わりません。金額選択とオートプレイは利用できません。",
  info_ctrl_windows_desc: "ボタンはクリックまたはタップで操作します。メニューのタブでシンボル配当、情報、音を切り替えます。長い文章や一覧はスクロールできます。× がある画面は閉じられます。無効な操作は現在の状態や上限では使えません。通知では閉じる、再試行、再接続を選べます。再接続すると記録済みのラウンドを復元します。",
  info_ctrl_feature_desc: "画面切り替え後にフリースピン開始を選びます。カウンターは現在の回数と総回数、ボーナス獲得額は累計を表示します。スピンは自動で進みます。許可される場合は Spin/Stop で演出を短縮でき、速度ボタンで速さを変えられます。オートプレイは表示されたまま無効になります。終了画面で続行を選ぶとメインゲームに戻ります。",
  info_ctrl_bonus_desc: "ボーナス選択画面を開きます。フリースピンまたは Wild Spin のカードでルールと合計額を確認できます。− / + はメイン画面と配当表の基本ベット額も変更します。カード選択だけでは開始せず、2×を超えるモードでは、下のボタンからモード、倍率、合計額を示す確認画面が開きます。購入を確定した場合のみ開始します。キャンセルまたは×で開始せずに戻ります。× は購入せず閉じます。ラウンド、フリースピン、オートプレイ中は利用できません。",
  wild_spin_title: "ワイルドスピン",
  wild_spin_rules: "基本ベットの10倍で1回スピン。少なくとも1つのWildがリール全体に拡大し、×2、×3、×5、×10のいずれかの倍率が付きます。SCATTER、星、フリースピンはありません。配当は保証されません。最大配当は基本ベットの5000倍です。",

  buy_bonus_title: "ボーナス購入",
  buy_bonus_action: "購入",
  buy_bonus_cost: "合計金額",
  buy_bonus_confirm: "購入を確認",
  buy_bonus_rules: "Wildは×2・×3・×5・×10でリール全体に拡大します。フリースピンの追加料金や再トリガーはありません。基本ベットの5000倍に達するとボーナスは早期終了します。開始時のSCATTER盤面はボーナスを開始するだけで、配当はありません。配当はフリースピンからのみ発生します。Wildの出現は保証されません。",

  bonus_wild_multipliers: "Wild倍率",
  bonus_win: "ボーナス獲得額",
  bonus_collect: "続ける",
  bonus_done: "フリースピン終了",
  bonus_start: "フリースピン開始",
  bonus_limits: "開始時のベット額は固定です。再トリガーはありません。星の配当は維持され、SCATTERボックスには配当がありません。ベットの5000倍に達するとラウンドが終了します。",
  bonus_intro: "Wildは×2・×3・×5・×10でリール全体に拡大します。獲得したフリースピンはすべて追加料金なしです。",
  bonus_title: "フリースピン",
  footer_balance: '残高',
  footer_win: '獲得',

  menu_paytable: '配当表',
  menu_info: '情報',
  menu_sound: 'サウンド',

  sound_music_label: '音楽',
  sound_effects_label: '効果音',
  sound_muted_banner: 'サウンドはミュート中 — タップして解除',
  sound_muted_unmute: 'ミュート解除',

  bet_title: 'Bet',
  bet_confirm: '確認',

  autospin_title: 'Autoplay',

  autospin_start: '開始',
  autospin_stop_label: '次の条件でオートスピンを停止',
  autospin_stop_after_win: '初回当選で停止',
  autospin_stop_win_reaches: '1回の当選で停止',
  autospin_stop_loss: '損失額が達したら停止',
  autospin_bet_unit: 'ベット',

  autoplay_stopped_title: 'オートプレイが停止しました',
  autoplay_stopped_subtitle: 'オートプレイセッションが終了しました。',
  autoplay_stopped_cancel: 'キャンセル',
  autoplay_stopped_repeat: 'オートプレイを繰り返す',

  session_expired_title: 'セッションの有効期限が切れました',
  session_expired_subtitle: '非アクティブのためセッションが終了しました。',
  session_expired_progress: '進行状況は保存されており、再接続後に利用できます。',
  session_expired_reconnect: '再接続',

  connection_lost_title: '接続が切れました',
  connection_lost_subtitle:
    'サーバーへの接続が切れました。インターネット接続を確認して再試行してください。',
  connection_lost_retry: '再試行',

  insufficient_badge: '通知',
  insufficient_title: '残高不足',
  insufficient_message:
    'プレイを続けるには残高を追加してください。現在の残高はこのベットには不十分です。',
  insufficient_close: '閉じる',

  paytable_scatter: 'スキャッター',
  paytable_star_note: "星はリール1、3、5に出現し、ペイラインに関係なく配当の対象になります。フリースピンは開始しません。",
  paytable_wild_note:
    'エクスパンディングワイルドは2番、3番、4番のリールに現れ、スキャッターを除く同じリールのすべてのシンボルの代わりになります。×5、×3、または×2の倍数で現れることができます。',
  paytable_dollar_note: "SCATTERボックスは全5リールに出現します。基本ゲームではラインに関係なく3 / 4 / 5個で5 / 10 / 15回のフリースピンを獲得します。ボックス自体の配当はなく、フリースピン中の再トリガーもありません。",

  info_intro_title: '紹介',
  info_intro_body:
    "Lost Idolは5リール、10ラインと拡大Wildを備えています。ラインは左から右へ、星はラインに関係なく配当されます。 SCATTERボックスは全5リールに出現します。基本ゲームではラインに関係なく3 / 4 / 5個で5 / 10 / 15回のフリースピンを獲得します。ボックス自体の配当はなく、フリースピン中の再トリガーもありません。",
  info_howtobet_title: 'ベット方法',
  info_howtobet_1: '「スタート」ボタンまたはベットボタンのいずれかを押してベットします。',
  info_paylines_title: 'ペイラインとルール',
  info_paylines_body_1:
    'すべての支払いは一致するシンボルの組み合わせに対して行われます。スキャッタースシンボルを除き、当選コンビネーションは左から右に連続するリール上に、最初のリールから始まりアクティブなペイラインに従って表示される必要があります。',
  info_paylines_body_2:
    "各ペイラインでは最も高い一致組合せのみが支払われます。すべてのラインとSCATTERの獲得額は合算されます。配当表の倍率は選択した合計ベット額に適用され、ライン数では割りません。勝利ライン上の×1を超えるWild倍率は合算されます。",
  info_paylines_body_3:
    'ゲームの誤作動はすべてのゲームラウンドと賞金を無効にします。各スピンの結果はランダムに決定され、プレイヤーの行動やスキルは結果に影響しません。',
  info_controls_title: 'ゲームコントロール',
  info_ctrl_spin_label: 'スタート',
  info_ctrl_spin_desc:
    "利用可能なときに Spin またはスペースキーで開始します。手動スピン中は Stop またはゲーム画面のタップで演出を短縮できますが、結果は変わりません。ウィンドウ表示中はスペースキーが無効です。プラットフォーム側で無効になる場合もあります。",
  info_ctrl_autospin_label: 'オートプレイ',
  info_ctrl_autospin_desc: "回数を選び、必要に応じて初回獲得、単一ラウンドの獲得額、純損失の停止条件を設定します。− / + で条件額を調整し、開始で確定します。四角内の数字は未開始のスピン数です。四角を押すと次回以降が止まり、現在のラウンドは完了します。繰り返すと同じ設定で開始し、キャンセルは終了画面を閉じます。",
  info_ctrl_speed_label: 'スピード',
  info_ctrl_speed_desc:
    "通常、高速、ターボを切り替えます。オートプレイやフリースピン中も変更できます。オートプレイはターボで始まります。変わるのは演出速度だけです。プラットフォームにより無効になる場合があります。",
  info_ctrl_bet_label: 'ベットオプション',
  info_ctrl_bet_desc:
    "金額を押し、候補または − / + で選んで確定します。画面を閉じても選択が適用されます。メイン画面の矢印はベット額を直接変更します。ボーナス画面と配当表も同じ額を使用します。ラウンドとオートプレイ中は変更できません。",
  info_ctrl_menu_label: 'メニュー',
  info_ctrl_menu_desc: '「メニュー」ボタンをクリックするとプレイヤーは「設定」メニューに入ります。',
  info_ctrl_sound_label: 'サウンドコントロール',
  info_ctrl_sound_desc: "スピーカーで全体の音をオン・オフします。音タブのスライダーで音楽と効果音を個別に調整できます。ミュート時は先に解除してください。",
  info_balance_label: '残高',
  info_balance_desc: "残高は利用可能な額、獲得額はラウンド結果を表示します。操作ボタンではありません。",
  info_betvalue_label: 'ベットオプション',
  info_betvalue_desc:
    'すべてのアクティブなペイラインに適用された合計賭け金を表示します。このオプションを選択すると、プレイヤーは別の賭け金額を選択できます。',
  info_rules_title: 'ルール',
  info_rule_1: '支払いは配当表に表示されます。',
  info_rule_2: 'スキャッター賞はペイライン賞とは独立しており、支払われた合計額にも追加されます。',
  info_rule_3: '異なるペイラインでの同時当選は加算されます。',
  info_rule_4: '誤作動はすべての支払いとプレイを無効にします。',
  info_rule_minbet: '最小ベット:',
  info_rule_maxbet: '最大ベット:',
  info_interruptions_title: 'ゲーム中断',
  info_recovery_label: '完全なゲーム復元',
  info_recovery_desc:
    "再接続すると、サーバーは未完了のラウンドと元のベット額を復元します。記録済みのラウンドが最初から再生され、追加の引き落としはありません。獲得額はサーバーが一度だけ精算します。",
  info_cancellation_label: 'キャンセル',
  info_cancellation_desc:
    "ラウンドが中断された場合は再接続して記録済みの結果を復元してください。最終結果と残高はサーバーが決定し、アニメーションの中断による一部支払いはありません。",
  info_responsible_title: '責任あるゲーム',
  info_responsible_autoplay_label: 'オートプレイ機能の使い方',
  info_responsible_autoplay_desc:
    '「オートプレイ」ボタンを押すと、ゲームは限られたスピン数で自動モードに入ります。オートプレイ中は「オートストップ」ボタン内に残りスピン数のカウントダウンが表示され、ゼロになるとオートプレイ機能は自動的に終了します。プレイヤーはいつでも「オートストップ」ボタンを押してオートプレイ機能を無効にすることができます。',
  info_rtp_title: 'プレイヤー還元率',
  info_rtp_body: 'ゲームの平均RTPは96%です。',
  info_disclaimer_title: "免責事項",
  info_disclaimer_body: "誤動作が発生した場合、すべての賞金とプレイは無効となります。安定したインターネット接続が必要です。接続が切断された場合は、未完了のラウンドを終えるためにゲームを再読み込みしてください。期待収益は多数のプレイに基づいて計算されます。ゲームの表示は物理的なデバイスを表すものではなく、あくまで例示目的です。賞金は、ブラウザ内のイベントではなく、リモートゲームサーバーから受信した金額に従って支払われます。\n\nTM および © 2026 Engine.",
  replay_play: "再生",
  replay_play_again: "もう一度再生",
  replay_loading: "リプレイを読み込み中…",
  replay_error: "リプレイを読み込めませんでした。",
  replay_bet_label: "ベット",
  replay_badge: "リプレイ",
  replay_title: "ベットリプレイ",
  replay_mode_label: "モード",
  replay_base_bet: "基本ベット",
  replay_cost_multiplier: "コスト倍率",
  replay_total_bet_cost: "総ベットコスト",
  replay_payout_multiplier: "配当倍率",
  replay_total_win: "総獲得額",
  replay_start: "リプレイを開始",
  replay_disclaimer: "これは過去のラウンドのリプレイです。ベットは行われません。",
};
