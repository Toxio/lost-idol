import { en } from './en';

/**
 * US social-casino overrides for `en.ts`.
 *
 * Loaded when the RGS sends `?social=true` (stake.us jurisdiction). US rules
 * ban gambling terms in game rules and UI, so we swap in the neutral
 * "play / coins / won" vocabulary per Stake's approval guidelines.
 * Any key not overridden here falls back to `en`.
 */
export const sweeps_en: Partial<typeof en> = {
  info_ctrl_bonus_desc: "Opens the bonus selection window. Select a Free Spins or Wild Spin card to see its rules and total amount. Use − / + to change the base amount; this also updates the main control and symbol win amounts. Selecting a card does not start a round. For modes above 2×, the bottom action button opens a separate confirmation showing the mode, multiplier and total amount. Only Confirm play starts the feature; Cancel or × returns without starting it. Close (×) leaves the window without starting a feature. This button is unavailable during a round, free spins or Autoplay.",
  menu_paytable: 'Win Table',
  info_paylines_title: 'Winning Lines and Rules',
  buy_bonus_title: 'Get bonus',
  buy_bonus_action: 'Play',
  buy_bonus_cost: 'Total play amount',
  buy_bonus_confirm: 'Confirm play',
  replay_bet_label: 'Play',
  replay_title: 'Play Replay',
  replay_base_bet: 'Base Play',
  replay_cost_multiplier: 'Feature Multiplier',
  replay_total_bet_cost: 'Total Play Amount',
  replay_payout_multiplier: 'Win Multiplier',
  replay_total_win: 'Total Won',
  replay_disclaimer: 'This is a replay of a previous play. No plays will be made.',
  wild_spin_rules: 'One spin for 10× the base play amount. At least one Wild expands across its reel with a ×2, ×3, ×5 or ×10 multiplier. No SCATTER, stars or free spins. A win is not guaranteed. Maximum win: 5000× the base play amount.',
  buy_bonus_rules: 'Wilds expand with ×2, ×3, ×5 or ×10 multipliers. No extra coins are used per free spin. No retriggers. The 5000× base-play round limit ends the feature early. The opening SCATTER board only starts the feature and awards no wins. Only the free spins award wins. Wilds are not guaranteed.',

  paytable_star_note: "Stars appear on reels 1, 3 and 5 and award wins independently of winning lines. They do not trigger free spins.",
  bonus_wild_multipliers: "Wild multipliers",
  bonus_win: "Feature win",
  bonus_collect: "Continue",
  bonus_done: "Free spins complete",
  bonus_start: "Start free spins",
  bonus_limits: "The triggering play amount stays fixed. No retriggers. Stars retain their rewards; SCATTER boxes do not award coins. The round ends when the 5000× play amount limit is reached.",
  bonus_intro: "Wilds expand across the reel with ×2, ×3, ×5 or ×10 multipliers. All awarded free spins are played without using extra coins.",
  bonus_title: "Free Spins",
  paytable_dollar_note: "SCATTER boxes can appear on all five reels. In the base game, 3 / 4 / 5 boxes award 5 / 10 / 15 free spins, regardless of winning lines. Boxes do not award coins and do not retrigger during free spins.",
  footer_win: 'Won',

  bet_title: 'Play',
  autospin_bet_unit: 'Play',

  insufficient_message:
    'Get more coins to continue playing. Your current balance is not enough for this play.',

  paytable_wild_note:
    'An Expanding Wild lands on 2nd, 3rd and 4th reels and substitutes for all symbols on the same reel except for the Scatters, can appear with the ×5, ×3 or ×2 multipliers.',

  info_intro_body:
    "Lost Idol has 5 reels, 10 winning lines and expanding Wilds. Line wins are awarded from left to right. Stars award wins independently of winning lines. SCATTER boxes can appear on all five reels. In the base game, 3 / 4 / 5 boxes award 5 / 10 / 15 free spins, regardless of winning lines. Boxes do not award coins and do not retrigger during free spins.",

  info_howtobet_title: 'How to Play',
  info_howtobet_1:
    'To start a round, press the "Spin" button or select one of the available play options.',

  info_paylines_body_1:
    'All wins are awarded for matching symbol combinations. Except for Scatter symbols, winning combinations must appear on consecutive reels from left to right, beginning with the first reel and following an active winning line.',
  info_paylines_body_2:
    "Only the highest matching combination on each winning line is awarded. Wins from all winning lines are added together, along with star wins. Win Table multipliers apply to the total selected play amount; it is not divided by the number of lines. Wild multipliers greater than ×1 on a winning line are added together.",

  info_ctrl_bet_label: 'Play Options',
  info_ctrl_bet_desc:
    "Press the amount to open Play Options. Select an amount tile or use − / +, then press Confirm. Closing this window also applies the selected amount. The main arrows change the play amount directly. The bonus window and Win Table use the same selected amount. Changes are disabled while a round or Autoplay is active.",

  info_balance_desc: "Shows the current coin balance. The Won display shows the round win. These are status displays, not buttons.",

  info_betvalue_label: 'Play Options',
  info_betvalue_desc:
    'Shows the total play amount applied across all active winning lines. Selecting this option allows the player to choose a different play amount.',

  info_rules_title: 'General Rules',
  info_rule_1: 'All wins can be found in the Win Table.',
  info_rule_2:
    'Stars award wins independently from winning lines. In the base game, 3 / 4 / 5 SCATTER boxes award 5 / 10 / 15 free spins. SCATTER boxes do not award coins and do not retrigger free spins.',
  info_rule_3: 'Wins occurring on multiple winning lines during the same spin are combined.',
  info_rule_4: 'Any technical malfunction voids all plays, winnings, and gameplay results.',
  info_rule_minbet: 'Minimum Play:',
  info_rule_maxbet: 'Maximum Play:',

  info_recovery_desc:
    "After reconnecting, the server restores the unfinished round and its original play amount. The recorded round is replayed from the beginning without using additional coins. Winnings are settled once by the server.",
  info_cancellation_desc:
    "If a round is interrupted, reconnect to restore its recorded result. Only the server determines the final result and wallet balance; an interrupted animation does not create a partial win.",

  info_disclaimer_body:
    "Malfunction voids all wins and plays. A consistent internet connection is required. In the event of a disconnection, reload the game to finish any uncompleted rounds. The expected return is calculated over many plays. The game display is not representative of any physical device and is for illustrative purposes only. Winnings are settled according to the amount received from the Remote Game Server and not from events within the web browser.\n\nTM and © 2026 Engine.",
};
