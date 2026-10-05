import type {  TranslationKey } from './en';

export const ko: Record<TranslationKey, string> = {
  info_ctrl_replay_desc: "Replay에서 재생는 기록된 라운드를 재생하고 다시 재생은 다시 재생합니다. 총액, 기본 금액, 모드 배수, 당첨액이 표시됩니다. 새 라운드가 시작되거나 잔액이 바뀌지 않습니다. 금액 선택과 자동 플레이는 사용할 수 없습니다.",
  info_ctrl_windows_desc: "버튼을 클릭하거나 터치하세요. 메뉴 탭에서 심볼 당첨표, 정보, 소리를 선택합니다. 긴 글과 목록은 스크롤할 수 있습니다. ×가 있으면 창을 닫을 수 있습니다. 비활성화된 조작은 현재 상태나 한도에서 사용할 수 없습니다. 알림은 닫기, 다시 시도, 재연결을 제공합니다. 재연결하면 기록된 라운드를 복원합니다.",
  info_ctrl_feature_desc: "전환 후 무료 스핀 시작을 누르세요. 카운터는 현재 스핀과 총 횟수, 보너스 당첨액은 누적 금액을 보여 줍니다. 스핀은 자동 진행됩니다. 허용될 때 Spin/Stop으로 애니메이션을 단축하고 속도 버튼으로 빠르기를 바꿀 수 있습니다. 자동 플레이 버튼은 보이지만 비활성화됩니다. 요약 화면에서 계속을 누르면 메인 게임으로 돌아갑니다.",
  info_ctrl_bonus_desc: "보너스 선택 창을 엽니다. 무료 스핀 또는 Wild Spin 카드를 선택하면 규칙과 총액이 표시됩니다. − / +는 기본 베팅액을 메인 게임과 배당표에도 함께 반영합니다. 카드 선택만으로 라운드가 시작되지 않으며, 2× 초과 모드는 하단 버튼으로 모드, 배수, 총액을 표시하는 별도 확인 창을 엽니다. 구매 확인을 눌러야 시작하며, 취소 또는 ×는 시작하지 않고 돌아갑니다. ×는 구매 없이 닫습니다. 라운드, 무료 스핀, 자동 플레이 중에는 사용할 수 없습니다.",
  wild_spin_title: "와일드 스핀",
  wild_spin_rules: "기본 베팅의 10배로 1회 스핀합니다. 최소 하나의 Wild가 릴 전체로 확장되며 ×2, ×3, ×5 또는 ×10 배수가 적용됩니다. SCATTER, 별 및 무료 스핀은 없습니다. 당첨은 보장되지 않습니다. 최대 당첨금은 기본 베팅의 5000배입니다.",

  buy_bonus_title: "보너스 구매",
  buy_bonus_action: "구매",
  buy_bonus_cost: "총 비용",
  buy_bonus_confirm: "구매 확인",
  buy_bonus_rules: "Wild는 ×2, ×3, ×5 또는 ×10으로 확장됩니다. 무료 스핀 추가 비용과 재발동은 없습니다. 기본 베팅의 5000배 한도에 도달하면 보너스가 조기 종료됩니다. 시작 SCATTER 화면은 보너스만 시작하며 당첨금을 지급하지 않습니다. 당첨금은 무료 스핀에서만 발생합니다. Wild는 보장되지 않습니다.",

  bonus_wild_multipliers: "Wild 배수",
  bonus_win: "보너스 당첨금",
  bonus_collect: "계속",
  bonus_done: "무료 스핀 종료",
  bonus_start: "무료 스핀 시작",
  bonus_limits: "시작 베팅액은 고정됩니다. 재발동은 없습니다. 별은 계속 지급되지만 SCATTER 상자는 지급하지 않습니다. 베팅액의 5000배에 도달하면 라운드가 끝납니다.",
  bonus_intro: "Wild는 ×2, ×3, ×5 또는 ×10으로 릴 전체를 덮습니다. 획득한 모든 무료 스핀은 추가 비용 없이 진행됩니다.",
  bonus_title: "무료 스핀",
  footer_balance: '잔액',
  footer_win: '당첨금',

  menu_paytable: '배당표',
  menu_info: '정보',
  menu_sound: '소리',

  sound_music_label: '음악',
  sound_effects_label: '효과음',
  sound_muted_banner: '소리가 음소거됨 — 탭하여 해제',
  sound_muted_unmute: '음소거 해제',

  bet_title: 'Bet',
  bet_confirm: '확인',

  autospin_title: 'Autoplay',

  autospin_start: '시작',
  autospin_stop_label: '자동 회전 중지 조건',
  autospin_stop_after_win: '첫 당첨 시 중지',
  autospin_stop_win_reaches: '단일 당첨 시 중지',
  autospin_stop_loss: '손실이 도달하면 중지',
  autospin_bet_unit: '배팅',

  autoplay_stopped_title: '자동 플레이 중지됨',
  autoplay_stopped_subtitle: '자동 플레이 세션이 종료되었습니다.',
  autoplay_stopped_cancel: '취소',
  autoplay_stopped_repeat: '자동 플레이 반복',

  session_expired_title: '세션이 만료되었습니다',
  session_expired_subtitle: '비활성으로 인해 세션이 종료되었습니다.',
  session_expired_progress: '진행 상황이 저장되었으며 재연결 후 사용할 수 있습니다.',
  session_expired_reconnect: '재연결',

  connection_lost_title: '연결 끊김',
  connection_lost_subtitle: '서버와의 연결이 끊겼습니다. 인터넷 연결을 확인하고 다시 시도하세요.',
  connection_lost_retry: '다시 시도',

  insufficient_badge: '알림',
  insufficient_title: '잔액 부족',
  insufficient_message: '게임을 계속하려면 잔액을 충전하세요. 현재 잔액이 이 베팅에 부족합니다.',
  insufficient_close: '닫기',

  paytable_scatter: '스캐터',
  paytable_star_note: "별은 1, 3, 5번 릴에 등장하며 페이라인과 관계없이 당첨금을 지급합니다. 무료 스핀을 발동시키지 않습니다.",
  paytable_wild_note:
    '확장 와일드는 2번, 3번, 4번 릴에 나타나며 스캐터를 제외한 같은 릴의 모든 심볼을 대체합니다. ×5, ×3 또는 ×2 배수로 나타날 수 있습니다.',
  paytable_dollar_note: "SCATTER 상자는 5개 릴 모두에 나타납니다. 기본 게임에서 상자 3 / 4 / 5개는 라인과 관계없이 무료 스핀 5 / 10 / 15회를 줍니다. 상자는 당첨금을 지급하지 않으며 무료 스핀 중 재발동하지 않습니다.",

  info_intro_title: '소개',
  info_intro_body:
    "Lost Idol에는 5개 릴, 10개 라인과 확장 Wild가 있습니다. 라인은 왼쪽부터 오른쪽으로 지급되며 별은 라인과 관계없이 지급됩니다. SCATTER 상자는 5개 릴 모두에 나타납니다. 기본 게임에서 상자 3 / 4 / 5개는 라인과 관계없이 무료 스핀 5 / 10 / 15회를 줍니다. 상자는 당첨금을 지급하지 않으며 무료 스핀 중 재발동하지 않습니다.",
  info_howtobet_title: '베팅 방법',
  info_howtobet_1: '"시작" 버튼 또는 베팅 버튼 중 하나를 누르면 베팅이 이루어집니다.',
  info_paylines_title: '페이라인 및 규칙',
  info_paylines_body_1:
    '모든 지급금은 일치하는 심볼 조합에 대해 지급됩니다. 스캐터 심볼을 제외하고, 당첨 조합은 첫 번째 릴에서 시작하여 활성 페이라인을 따라 왼쪽에서 오른쪽으로 연속적인 릴에 나타나야 합니다.',
  info_paylines_body_2:
    "각 페이라인에서는 가장 높은 일치 조합만 지급됩니다. 모든 라인과 SCATTER의 당첨금은 합산됩니다. 배당표 배수는 선택한 총 베팅액에 적용되며 라인 수로 나누지 않습니다. 당첨 라인에서 ×1보다 큰 Wild 배수는 합산됩니다.",
  info_paylines_body_3:
    '게임 오작동 시 모든 게임 라운드와 당첨금이 무효화됩니다. 각 스핀의 결과는 무작위로 결정되며 플레이어의 행동이나 기술은 결과에 영향을 미치지 않습니다.',
  info_controls_title: '게임 컨트롤',
  info_ctrl_spin_label: '시작',
  info_ctrl_spin_desc:
    "허용될 때 Spin 또는 스페이스 키로 시작합니다. 수동 스핀 중 Stop이나 게임 영역 터치는 결과를 바꾸지 않고 애니메이션을 단축합니다. 창이 열려 있으면 스페이스 키가 작동하지 않으며 플랫폼에서 비활성화할 수도 있습니다.",
  info_ctrl_autospin_label: '자동 플레이',
  info_ctrl_autospin_desc: "횟수를 선택하고 필요하면 첫 당첨, 단일 당첨액, 순손실 기준의 중지를 켜세요. − / +로 기준액을 조절하고 시작으로 확정합니다. 사각형의 숫자는 아직 시작하지 않은 스핀 수입니다. 누르면 이후 스핀을 멈추고 현재 라운드는 완료됩니다. 반복은 같은 설정을 사용하고 취소는 요약을 닫습니다.",
  info_ctrl_speed_label: '속도',
  info_ctrl_speed_desc:
    "보통, 빠름, 터보를 전환하며 자동 플레이와 무료 스핀 중에도 가능합니다. 자동 플레이는 터보로 시작합니다. 애니메이션 속도만 바뀝니다. 플랫폼에서 제한할 수 있습니다.",
  info_ctrl_bet_label: '베팅 옵션',
  info_ctrl_bet_desc:
    "금액을 누르고 항목 또는 − / +로 선택한 뒤 확인하세요. 창을 닫아도 선택이 적용됩니다. 메인 화살표는 베팅액을 바로 바꿉니다. 보너스 창과 배당표는 같은 금액을 사용합니다. 라운드와 자동 플레이 중에는 변경할 수 없습니다.",
  info_ctrl_menu_label: '메뉴',
  info_ctrl_menu_desc: '"메뉴" 버튼을 클릭하면 플레이어가 "설정" 메뉴로 이동합니다.',
  info_ctrl_sound_label: '사운드 제어',
  info_ctrl_sound_desc: "스피커로 전체 소리를 켜거나 끕니다. 소리 탭의 슬라이더로 음악과 효과음을 각각 조절합니다. 음소거 중에는 먼저 소리를 켜세요.",
  info_balance_label: '잔액',
  info_balance_desc: "잔액은 사용 가능한 금액, 당첨액은 라운드 결과를 표시합니다. 버튼이 아닌 상태 표시입니다.",
  info_betvalue_label: '베팅 옵션',
  info_betvalue_desc:
    '모든 활성 페이라인에 적용된 총 베팅액을 표시합니다. 이 옵션을 선택하면 플레이어가 다른 베팅 금액을 선택할 수 있습니다.',
  info_rules_title: '규칙',
  info_rule_1: '지급금은 배당표에 표시됩니다.',
  info_rule_2: '스캐터 상은 페이라인 상과 독립적이며 지급된 총액에도 추가됩니다.',
  info_rule_3: '다른 페이라인에서의 동시 당첨금은 합산됩니다.',
  info_rule_4: '오작동은 모든 지급금과 플레이를 무효화합니다.',
  info_rule_minbet: '최소 베팅:',
  info_rule_maxbet: '최대 베팅:',
  info_interruptions_title: '게임 중단',
  info_recovery_label: '전체 게임 복구',
  info_recovery_desc:
    "다시 연결하면 서버가 미완료 라운드와 원래 베팅액을 복원합니다. 기록된 라운드는 추가 차감 없이 처음부터 재생됩니다. 당첨금은 서버에서 한 번만 정산됩니다.",
  info_cancellation_label: '취소',
  info_cancellation_desc:
    "라운드가 중단되면 다시 연결하여 기록된 결과를 복원하세요. 최종 결과와 잔액은 서버가 결정하며, 애니메이션 중단으로 부분 지급이 발생하지 않습니다.",
  info_responsible_title: '책임감 있는 게임',
  info_responsible_autoplay_label: '자동 플레이 기능 사용 방법',
  info_responsible_autoplay_desc:
    '"자동 플레이" 버튼을 누르면 게임이 제한된 회전 횟수로 자동 모드로 전환됩니다. 자동 플레이 중에 "자동 중지" 버튼 안에 남은 회전 횟수의 카운트다운이 표시되며 0에 도달하면 자동 플레이 기능이 자동으로 종료됩니다. 플레이어는 언제든지 "자동 중지" 버튼을 눌러 자동 플레이 기능을 비활성화할 수 있습니다.',
  info_rtp_title: '플레이어 환급률',
  info_rtp_body: '게임의 평균 RTP는 96%입니다.',
  info_disclaimer_title: "면책 조항",
  info_disclaimer_body: "오작동은 모든 상금과 플레이를 무효화합니다. 안정적인 인터넷 연결이 필요합니다. 연결이 끊어지면 완료되지 않은 라운드를 마치기 위해 게임을 다시 로드하십시오. 예상 반환은 다수의 플레이를 기준으로 계산됩니다. 게임 화면은 실제 기기를 나타내지 않으며 참고용입니다. 상금은 원격 게임 서버에서 받은 금액에 따라 정산되며, 브라우저 내 이벤트에 따라 정산되지 않습니다.\n\nTM 및 © 2026 Engine.",
  replay_play: "재생",
  replay_play_again: "다시 재생",
  replay_loading: "리플레이 로딩 중…",
  replay_error: "리플레이를 불러올 수 없습니다.",
  replay_bet_label: "베팅",
  replay_badge: "리플레이",
  replay_title: "베팅 리플레이",
  replay_mode_label: "모드",
  replay_base_bet: "기본 베팅",
  replay_cost_multiplier: "비용 배수",
  replay_total_bet_cost: "총 베팅 비용",
  replay_payout_multiplier: "배당 배수",
  replay_total_win: "총 상금",
  replay_start: "리플레이 시작",
  replay_disclaimer: "이것은 이전 라운드의 리플레이입니다. 새 베팅은 이루어지지 않습니다.",
};
