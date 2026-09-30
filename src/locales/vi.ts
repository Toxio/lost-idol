import type {  TranslationKey } from './en';

export const vi: Record<TranslationKey, string> = {
  info_ctrl_replay_desc: "Trong Replay, Phát lại phát vòng đã ghi và Phát lại lần nữa phát lại. Bảng hiển thị tổng tiền, tiền cơ bản, hệ số chế độ và tiền thắng. Không bắt đầu vòng mới hay thay đổi số dư. Không thể chọn mức tiền hoặc tự động quay.",
  info_ctrl_windows_desc: "Nhấp hoặc chạm nút để thao tác. Các thẻ menu hiển thị thưởng biểu tượng, thông tin và âm thanh. Cuộn văn bản và danh sách dài. × đóng cửa sổ khi có. Điều khiển bị vô hiệu hóa không dùng được ở trạng thái hoặc giới hạn hiện tại. Thông báo có đóng, thử lại hoặc kết nối lại; kết nối lại khôi phục vòng đã ghi.",
  info_ctrl_feature_desc: "Sau chuyển cảnh, chọn bắt đầu lượt quay miễn phí. Bộ đếm hiển thị lượt hiện tại và tổng số; tiền thắng tính năng hiển thị phần tích lũy. Các lượt tự động tiếp diễn. Spin/Stop rút ngắn hoạt ảnh khi được phép; Tốc độ đổi nhịp chạy. Nút tự động quay vẫn hiện nhưng bị vô hiệu hóa. Tiếp tục đóng màn hình tổng kết.",
  info_ctrl_bonus_desc: "Mở cửa sổ chọn thưởng. Chọn lượt quay miễn phí hoặc Wild Spin để xem luật và tổng chi phí. − / + đổi mức cược cơ bản đồng thời trên màn hình chính và bảng trả thưởng. Chọn thẻ chưa bắt đầu vòng; với chế độ trên 2×, nút dưới mở xác nhận riêng hiển thị chế độ, hệ số và tổng tiền. Chỉ xác nhận mua mới bắt đầu; Hủy hoặc × quay lại mà không bắt đầu. × đóng mà không mua. Không khả dụng trong vòng chơi, lượt miễn phí hoặc tự động quay.",
  wild_spin_title: "Vòng quay Wild",
  wild_spin_rules: "Một vòng quay với giá 10× cược cơ bản. Ít nhất một Wild mở rộng toàn bộ cuộn với hệ số ×2, ×3, ×5 hoặc ×10. Không có SCATTER, ngôi sao hay vòng quay miễn phí. Không đảm bảo thắng. Thắng tối đa: 5000× cược cơ bản.",

  buy_bonus_title: "Mua thưởng",
  buy_bonus_action: "Mua",
  buy_bonus_cost: "Tổng chi phí",
  buy_bonus_confirm: "Xác nhận mua",
  buy_bonus_rules: "Wild mở rộng với ×2, ×3, ×5 hoặc ×10. Vòng quay miễn phí không có phí thêm hay kích hoạt lại. Giới hạn 5000× cược cơ bản kết thúc thưởng sớm. Bảng SCATTER mở đầu chỉ kích hoạt thưởng và không trả thưởng. Chỉ các vòng quay miễn phí mới trả thưởng. Wild không được đảm bảo.",

  bonus_wild_multipliers: "Hệ số Wild",
  bonus_win: "Thưởng tính năng",
  bonus_collect: "Tiếp tục",
  bonus_done: "Đã kết thúc quay miễn phí",
  bonus_start: "Bắt đầu quay miễn phí",
  bonus_limits: "Mức cược kích hoạt được giữ nguyên. Không kích hoạt lại. Ngôi sao vẫn trả thưởng, hộp SCATTER không trả thưởng. Vòng chơi kết thúc khi đạt giới hạn 5000× cược.",
  bonus_intro: "Wild mở rộng toàn cuộn với ×2, ×3, ×5 hoặc ×10. Tất cả vòng quay miễn phí được thưởng đều không tốn thêm cược.",
  bonus_title: "Lượt quay miễn phí",
  footer_balance: 'Số dư',
  footer_win: 'Thắng',

  menu_paytable: 'Bảng trả thưởng',
  menu_info: 'Thông tin',
  menu_sound: 'Âm thanh',

  sound_music_label: 'Nhạc nền',
  sound_effects_label: 'Hiệu ứng âm thanh',
  sound_muted_banner: 'Âm thanh đã tắt — chạm để bật',
  sound_muted_unmute: 'Bật âm thanh',

  bet_title: 'Bet',
  bet_confirm: 'Xác nhận',

  autospin_title: 'Autoplay',

  autospin_start: 'Bắt đầu',
  autospin_stop_label: 'Dừng quay tự động khi',
  autospin_stop_after_win: 'Dừng sau lần thắng đầu tiên',
  autospin_stop_win_reaches: 'Dừng khi thắng đơn lẻ',
  autospin_stop_loss: 'Dừng khi tiền thua đạt',
  autospin_bet_unit: 'Cược',

  autoplay_stopped_title: 'Chế độ tự động đã dừng',
  autoplay_stopped_subtitle: 'Phiên chơi tự động của bạn đã kết thúc.',
  autoplay_stopped_cancel: 'Hủy',
  autoplay_stopped_repeat: 'Lặp lại chơi tự động',

  session_expired_title: 'Phiên đã hết hạn',
  session_expired_subtitle: 'Phiên của bạn đã kết thúc do không hoạt động.',
  session_expired_progress: 'Tiến trình của bạn đã được lưu và sẽ khả dụng sau khi kết nối lại.',
  session_expired_reconnect: 'Kết nối lại',

  connection_lost_title: 'Mất kết nối',
  connection_lost_subtitle:
    'Kết nối đến máy chủ đã bị mất. Vui lòng kiểm tra kết nối internet và thử lại.',
  connection_lost_retry: 'Thử lại',

  insufficient_badge: 'Thông báo',
  insufficient_title: 'Số dư không đủ',
  insufficient_message: 'Thêm tiền để tiếp tục chơi. Số dư hiện tại của bạn không đủ cho cược này.',
  insufficient_close: 'Đóng',

  paytable_scatter: 'Scatter',
  paytable_star_note: "Ngôi sao xuất hiện trên các cuộn 1, 3 và 5, trả thưởng độc lập với dòng trả thưởng. Chúng không kích hoạt lượt quay miễn phí.",
  paytable_wild_note:
    'Wild Mở Rộng đổ xuống cuộn 2, 3 và 4 và thay thế tất cả các biểu tượng trên cùng một cuộn ngoại trừ Scatter. Có thể xuất hiện với hệ số nhân ×5, ×3 hoặc ×2.',
  paytable_dollar_note: "Hộp SCATTER có thể xuất hiện trên cả năm cuộn. Trong trò chơi cơ bản, 3 / 4 / 5 hộp thưởng 5 / 10 / 15 vòng quay miễn phí, không phụ thuộc đường trả thưởng. Hộp không trả tiền và không kích hoạt lại vòng quay miễn phí.",

  info_intro_title: 'Giới thiệu',
  info_intro_body:
    "Lost Idol có 5 cuộn, 10 đường trả thưởng và Wild mở rộng. Đường trả thưởng tính từ trái sang phải, ngôi sao trả thưởng độc lập với đường. Hộp SCATTER có thể xuất hiện trên cả năm cuộn. Trong trò chơi cơ bản, 3 / 4 / 5 hộp thưởng 5 / 10 / 15 vòng quay miễn phí, không phụ thuộc đường trả thưởng. Hộp không trả tiền và không kích hoạt lại vòng quay miễn phí.",
  info_howtobet_title: 'Cách đặt cược',
  info_howtobet_1: 'Đặt cược bằng cách nhấn nút "Bắt đầu" hoặc bất kỳ nút cược nào.',
  info_paylines_title: 'Dòng trả thưởng và quy tắc',
  info_paylines_body_1:
    'Tất cả các khoản trả thưởng được trao cho các tổ hợp biểu tượng khớp nhau. Ngoại trừ biểu tượng Scatter, các tổ hợp thắng phải xuất hiện trên các cuộn liên tiếp từ trái sang phải, bắt đầu từ cuộn đầu tiên và theo một dòng thanh toán đang hoạt động.',
  info_paylines_body_2:
    "Chỉ tổ hợp cao nhất trên mỗi đường được trả thưởng. Tiền thắng từ tất cả các đường và SCATTER được cộng lại. Hệ số bảng trả thưởng áp dụng cho tổng cược đã chọn, không chia cho số đường. Các hệ số Wild lớn hơn ×1 trên đường thắng được cộng lại.",
  info_paylines_body_3:
    'Bất kỳ sự cố trò chơi nào sẽ làm mất hiệu lực tất cả các vòng chơi và tiền thắng. Kết quả của mỗi lần quay được xác định ngẫu nhiên và các hành động hoặc kỹ năng của người chơi không có ảnh hưởng đến kết quả.',
  info_controls_title: 'Điều khiển trò chơi',
  info_ctrl_spin_label: 'Bắt đầu',
  info_ctrl_spin_desc:
    "Nhấn Spin hoặc phím cách để bắt đầu khi được phép. Trong lượt thủ công, Stop hoặc chạm vùng chơi rút ngắn hoạt ảnh mà không đổi kết quả. Phím cách không hoạt động khi cửa sổ mở và có thể bị nền tảng tắt.",
  info_ctrl_autospin_label: 'Tự động',
  info_ctrl_autospin_desc: "Chọn số lượt và tùy chọn dừng sau lần thắng đầu, khi tiền thắng một vòng hoặc lỗ ròng đạt ngưỡng. Dùng − / + chỉnh ngưỡng rồi Bắt đầu. Số trong ô vuông là lượt chưa bắt đầu. Chạm ô để dừng các lượt sau; vòng hiện tại vẫn hoàn tất. Lặp lại dùng cùng thiết lập; Hủy đóng tổng kết.",
  info_ctrl_speed_label: 'Tốc độ',
  info_ctrl_speed_desc:
    "Đổi giữa Bình thường, Nhanh và Turbo, cả khi tự động quay và quay miễn phí. Tự động quay bắt đầu ở Turbo. Chỉ tốc độ hoạt ảnh thay đổi. Nền tảng có thể tắt điều khiển này.",
  info_ctrl_bet_label: 'Tùy chọn cược',
  info_ctrl_bet_desc:
    "Chạm mức tiền, chọn giá trị hoặc dùng − / + rồi xác nhận. Đóng cửa sổ cũng áp dụng lựa chọn. Mũi tên chính đổi mức cược trực tiếp. Cửa sổ thưởng và bảng trả thưởng dùng cùng mức cược. Không thể thay đổi trong vòng hoặc tự động quay.",
  info_ctrl_menu_label: 'Menu',
  info_ctrl_menu_desc: 'Khi nhấp vào nút "Menu", người chơi vào menu "Cài đặt".',
  info_ctrl_sound_label: 'Điều khiển âm thanh',
  info_ctrl_sound_desc:
    "Loa tắt hoặc bật toàn bộ âm thanh. Thanh trượt trong thẻ Âm thanh chỉnh nhạc và hiệu ứng riêng. Nếu đang tắt tiếng, hãy bật lại trước khi chỉnh.",
  info_balance_label: 'Số dư',
  info_balance_desc: "Số dư hiển thị tiền khả dụng; tiền thắng hiển thị kết quả vòng. Đây là chỉ báo, không phải nút.",
  info_betvalue_label: 'Tùy chọn cược',
  info_betvalue_desc:
    'Hiển thị tổng tiền đặt cược áp dụng trên tất cả các dòng trả thưởng đang hoạt động. Chọn tùy chọn này cho phép người chơi chọn số tiền đặt cược khác.',
  info_rules_title: 'Quy tắc',
  info_rule_1: 'Các khoản trả thưởng được hiển thị trên Bảng trả thưởng.',
  info_rule_2:
    'Giải thưởng Scatter độc lập với giải thưởng dòng trả thưởng và cũng được cộng vào tổng số tiền được trả.',
  info_rule_3: 'Thắng đồng thời trên các dòng trả thưởng khác nhau được cộng lại.',
  info_rule_4: 'Sự cố làm mất hiệu lực tất cả các khoản thanh toán và lần chơi.',
  info_rule_minbet: 'Cược Tối thiểu:',
  info_rule_maxbet: 'Cược Tối đa:',
  info_interruptions_title: 'Gián đoạn trò chơi',
  info_recovery_label: 'Phục hồi trò chơi đầy đủ',
  info_recovery_desc:
    "Khi kết nối lại, máy chủ khôi phục vòng chưa hoàn tất và mức cược ban đầu. Vòng đã lưu được phát lại từ đầu mà không thu thêm phí. Máy chủ chỉ trả thưởng một lần.",
  info_cancellation_label: 'Hủy bỏ',
  info_cancellation_desc:
    "Nếu vòng bị gián đoạn, hãy kết nối lại để khôi phục kết quả. Máy chủ quyết định kết quả cuối cùng và số dư; hoạt ảnh bị gián đoạn không tạo ra khoản trả thưởng một phần.",
  info_responsible_title: 'Chơi có trách nhiệm',
  info_responsible_autoplay_label: 'Cách sử dụng tính năng tự động',
  info_responsible_autoplay_desc:
    'Khi nút "Tự động" được nhấn, trò chơi vào chế độ tự động với số lần quay giới hạn. Trong khi Tự động, sẽ có đếm ngược số lần quay còn lại bên trong nút "Dừng tự động" và khi đạt đến không, tính năng Tự động sẽ tự động chấm dứt. Bất kỳ lúc nào, người chơi có thể vô hiệu hóa tính năng Tự động bằng cách nhấn nút "Dừng tự động".',
  info_rtp_title: 'Tỷ lệ hoàn trả cho người chơi',
  info_rtp_body: 'RTP trung bình của trò chơi là 95%.',
  info_disclaimer_title: "Miễn trừ trách nhiệm",
  info_disclaimer_body: "Mọi trục trặc sẽ vô hiệu hóa mọi tiền thắng và lượt chơi. Yêu cầu kết nối internet ổn định. Trong trường hợp mất kết nối, tải lại trò chơi để hoàn thành các lượt chơi chưa xong. Tỷ lệ hoàn trả kỳ vọng được tính trên nhiều lượt chơi. Màn hình trò chơi không đại diện cho bất kỳ thiết bị vật lý nào và chỉ mang tính minh họa. Tiền thắng được tính theo số tiền nhận từ Máy chủ trò chơi từ xa, không dựa trên sự kiện trong trình duyệt.\n\nTM và © 2026 Engine.",
  replay_play: "Phát lại",
  replay_play_again: "Phát lại lần nữa",
  replay_loading: "Đang tải bản phát lại…",
  replay_error: "Không thể tải bản phát lại.",
  replay_bet_label: "Đặt cược",
  replay_badge: "PHÁT LẠI",
  replay_title: "Phát lại cược",
  replay_mode_label: "Chế độ",
  replay_base_bet: "Cược cơ bản",
  replay_cost_multiplier: "Hệ số chi phí",
  replay_total_bet_cost: "Tổng chi phí cược",
  replay_payout_multiplier: "Hệ số thanh toán",
  replay_total_win: "Tổng thắng",
  replay_start: "Bắt đầu phát lại",
  replay_disclaimer: "Đây là bản phát lại của vòng cược trước. Không có cược nào được đặt.",
};
