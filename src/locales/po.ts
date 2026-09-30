import type {  TranslationKey } from "./en";

export const po: Record<TranslationKey, string> = {
  info_ctrl_replay_desc: "W Replay przycisk Odtwórz odtwarza zapisaną rundę, a Odtwórz ponownie ją powtarza. Panel pokazuje kwotę całkowitą, bazową, mnożnik trybu i wygraną. Nie rozpoczyna nowej rundy ani nie zmienia salda. Wybór kwoty i autogra są niedostępne.",
  info_ctrl_windows_desc: "Klikaj lub dotykaj przycisków. Zakładki pokazują wygrane symboli, informacje i dźwięk. Długie teksty i listy można przewijać. × zamyka dostępne okna. Nieaktywne elementy są niedostępne w danym stanie lub po osiągnięciu limitu. Powiadomienia pozwalają zamknąć, ponowić lub połączyć się ponownie; ponowne połączenie przywraca zapisaną rundę.",
  info_ctrl_feature_desc: "Po przejściu uruchom darmowe obroty. Licznik pokazuje bieżący obrót i łączną liczbę, a wygrana bonusowa sumę wygranych. Obroty następują automatycznie. Spin/Stop skraca animację, gdy jest to dozwolone; Szybkość zmienia tempo. Autogra pozostaje widoczna, ale nieaktywna. Kontynuuj zamyka podsumowanie.",
  info_ctrl_bonus_desc: "Otwiera wybór bonusu. Wybierz darmowe obroty lub Wild Spin, aby zobaczyć zasady i pełny koszt. − / + zmienia stawkę bazową także w grze i tabeli wygranych. Sam wybór karty nie rozpoczyna rundy: dla trybów powyżej 2× dolny przycisk otwiera osobne potwierdzenie z trybem, mnożnikiem i pełną kwotą. Dopiero potwierdzenie zakupu uruchamia bonus; Anuluj lub × wraca bez uruchamiania. × zamyka bez zakupu. Niedostępne podczas rundy, darmowych obrotów i autogry.",
  wild_spin_title: "Obrót Wild",
  wild_spin_rules: "Jeden obrót za 10× stawkę bazową. Co najmniej jeden Wild rozszerza się na cały bęben z mnożnikiem ×2, ×3, ×5 lub ×10. Bez SCATTER, gwiazd i darmowych obrotów. Wygrana nie jest gwarantowana. Maksymalna wygrana: 5000× stawkę bazową.",

  buy_bonus_title: "Kup bonus",
  buy_bonus_action: "Kup",
  buy_bonus_cost: "Łączny koszt",
  buy_bonus_confirm: "Potwierdź zakup",
  buy_bonus_rules: "Wild rozszerza się z ×2, ×3, ×5 lub ×10. Bez dodatkowych opłat za darmowe obroty i ponownych aktywacji. Limit 5000× stawki bazowej kończy bonus wcześniej. Początkowa plansza SCATTER tylko uruchamia bonus i nie daje wygranych. Wypłaty pochodzą wyłącznie z darmowych obrotów. Wild nie jest gwarantowany.",

  bonus_wild_multipliers: "Mnożniki Wild",
  bonus_win: "Wygrana bonusowa",
  bonus_collect: "Kontynuuj",
  bonus_done: "Darmowe obroty zakończone",
  bonus_start: "Rozpocznij darmowe obroty",
  bonus_limits: "Stawka początkowa pozostaje stała. Bez ponownych aktywacji. Gwiazdy nadal wypłacają, pudełka SCATTER nie. Runda kończy się przy limicie 5000× stawki.",
  bonus_intro: "Wild rozszerza się na cały bęben z ×2, ×3, ×5 lub ×10. Wszystkie przyznane darmowe obroty są bez dodatkowej opłaty.",
  bonus_title: "Darmowe obroty",
  footer_balance: "Saldo",
  footer_win: "Wygrana",

  menu_paytable: "Tabela wypłat",
  menu_info: "Info",
  menu_sound: "Dźwięk",

  sound_music_label: "Muzyka",
  sound_effects_label: "Efekty dźwiękowe",
  sound_muted_banner: "Dźwięk wyciszony — dotknij, aby włączyć",
  sound_muted_unmute: "Włącz dźwięk",

  bet_title: "Bet",
  bet_confirm: "Potwierdź",

  autospin_title: "Autoplay",

  autospin_start: "Uruchom",
  autospin_stop_label: "Zatrzymaj automatyczną grę, gdy",
  autospin_stop_after_win: "Zatrzymaj po pierwszej wygranej",
  autospin_stop_win_reaches: "Zatrzymaj przy pojedynczej wygranej",
  autospin_stop_loss: "Zatrzymaj, gdy strata osiągnie",
  autospin_bet_unit: "stawki",

  autoplay_stopped_title: "Automatyczna gra zatrzymana",
  autoplay_stopped_subtitle: "Twoja sesja automatycznej gry zakończyła się.",
  autoplay_stopped_cancel: "Anuluj",
  autoplay_stopped_repeat: "Powtórz automatyczną grę",

  session_expired_title: "Sesja wygasła",
  session_expired_subtitle:
    "Twoja sesja zakończyła się z powodu braku aktywności.",
  session_expired_progress:
    "Twój postęp jest zapisany i będzie dostępny po ponownym połączeniu.",
  session_expired_reconnect: "Połącz ponownie",

  connection_lost_title: "Utracono połączenie",
  connection_lost_subtitle:
    "Połączenie z serwerem zostało utracone. Sprawdź połączenie z internetem i spróbuj ponownie.",
  connection_lost_retry: "Spróbuj ponownie",

  insufficient_badge: "Powiadomienie",
  insufficient_title: "Niewystarczające środki",
  insufficient_message:
    "Dodaj środki, aby kontynuować grę. Twoje aktualne saldo nie jest wystarczające na ten zakład.",
  insufficient_close: "Zamknij",

  paytable_scatter: "Scatter",
  paytable_star_note: "Gwiazdy pojawiają się na bębnach 1, 3 i 5 i wypłacają wygrane niezależnie od linii. Nie uruchamiają darmowych obrotów.",
  paytable_wild_note:
    "Rozszerzający się Wild pojawia się na 2., 3. i 4. bębnie i zastępuje wszystkie symbole na tym samym bębnie, z wyjątkiem Scatterów. Może pojawić się z mnożnikami ×5, ×3 lub ×2.",
  paytable_dollar_note: "Pudełka SCATTER występują na wszystkich pięciu bębnach. W grze podstawowej 3 / 4 / 5 pudełek daje 5 / 10 / 15 darmowych obrotów niezależnie od linii. Pudełka nie wypłacają pieniędzy ani nie uruchamiają ponownie darmowych obrotów.",

  info_intro_title: "Wprowadzenie",
  info_intro_body:
    "Lost Idol ma 5 bębnów, 10 linii i rozszerzające się Wildy. Linie wypłacają od lewej do prawej, a gwiazdy niezależnie od linii. Pudełka SCATTER występują na wszystkich pięciu bębnach. W grze podstawowej 3 / 4 / 5 pudełek daje 5 / 10 / 15 darmowych obrotów niezależnie od linii. Pudełka nie wypłacają pieniędzy ani nie uruchamiają ponownie darmowych obrotów.",
  info_howtobet_title: "Jak stawiać zakłady",
  info_howtobet_1:
    'Zakład jest wykonywany przez naciśnięcie przycisku "Start" lub dowolnego przycisku zakładu.',
  info_paylines_title: "Linie płatności i zasady",
  info_paylines_body_1:
    "Wszystkie wypłaty przyznawane są za pasujące kombinacje symboli. Z wyjątkiem symboli Scatter, kombinacje wygrywające muszą pojawiać się na kolejnych bębnach od lewej do prawej, zaczynając od pierwszego bębna i zgodnie z aktywną linią płatności.",
  info_paylines_body_2:
    "Na każdej linii wypłacana jest tylko najwyższa pasująca kombinacja. Wygrane ze wszystkich linii i SCATTER są sumowane. Mnożniki tabeli dotyczą całej wybranej stawki, bez dzielenia przez liczbę linii. Mnożniki Wild większe niż ×1 na zwycięskiej linii są sumowane.",
  info_paylines_body_3:
    "Jakiekolwiek usterki gry unieważniają wszystkie rundy i wygrane. Wynik każdego obrotu jest losowy, a działania lub umiejętności gracza nie mają wpływu na wyniki.",
  info_controls_title: "Sterowanie grą",
  info_ctrl_spin_label: "Start",
  info_ctrl_spin_desc:
    "Spin lub spacja rozpoczyna rundę, gdy jest to dozwolone. Podczas ręcznego obrotu Stop lub dotknięcie gry skraca animację bez zmiany wyniku. Spacja nie działa przy otwartym oknie i może być wyłączona przez platformę.",
  info_ctrl_autospin_label: "Autoplay",
  info_ctrl_autospin_desc:
    "Wybierz liczbę obrotów i opcjonalne zatrzymanie po pierwszej wygranej, określonej pojedynczej wygranej lub stracie netto. Ustaw progi przez − / + i naciśnij Start. Liczba w kwadracie oznacza jeszcze nierozpoczęte obroty. Kwadrat zatrzymuje kolejne; bieżąca runda się kończy. Powtórz używa tych samych ustawień; Anuluj zamyka podsumowanie.",
  info_ctrl_speed_label: "Prędkość",
  info_ctrl_speed_desc:
    "Przełącza tempo normalne, szybkie i Turbo, również w autogrze i darmowych obrotach. Autogra zaczyna w Turbo. Zmienia tylko animacje. Platforma może wyłączyć tę funkcję.",
  info_ctrl_bet_label: "Opcje zakładu",
  info_ctrl_bet_desc:
    "Naciśnij kwotę, wybierz wartość lub użyj − / + i zatwierdź. Zamknięcie również stosuje wybór. Główne strzałki zmieniają stawkę od razu. Bonus i tabela wygranych używają tej samej stawki. Zmiany są zablokowane podczas rundy i autogry.",
  info_ctrl_menu_label: "Menu",
  info_ctrl_menu_desc:
    'Po kliknięciu przycisku "Menu" gracz wchodzi do menu "Ustawienia".',
  info_ctrl_sound_label: "Sterowanie dźwiękiem",
  info_ctrl_sound_desc:
    "Głośnik wycisza lub włącza cały dźwięk. Suwaki w zakładce dźwięku regulują muzykę i efekty osobno. Przed regulacją wyłącz wyciszenie.",
  info_balance_label: "Saldo",
  info_balance_desc: "Saldo pokazuje dostępną kwotę, a wygrana wynik rundy. Są to wskaźniki, nie przyciski.",
  info_betvalue_label: "Opcje zakładu",
  info_betvalue_desc:
    "Pokazuje łączny zakład na wszystkich aktywnych liniach płatności. Wybranie tej opcji umożliwia graczowi wybór innej kwoty zakładu.",
  info_rules_title: "Zasady",
  info_rule_1: "Wypłaty są wyświetlane w Tabeli wypłat.",
  info_rule_2:
    "Nagrody Scatter są niezależne od nagród linii i są dodawane do łącznej wypłaconej kwoty.",
  info_rule_3: "Jednoczesne wygrane na różnych liniach płatności są sumowane.",
  info_rule_4: "Usterka unieważnia wszystkie płatności i rozgrywki.",
  info_rule_minbet: "Minimalny zakład:",
  info_rule_maxbet: "Maksymalny zakład:",
  info_interruptions_title: "Przerwy w grze",
  info_recovery_label: "Pełne odzyskiwanie gry",
  info_recovery_desc:
    "Po ponownym połączeniu serwer przywraca niedokończoną rundę i pierwotną stawkę. Zapisana runda jest odtwarzana od początku bez ponownej opłaty. Serwer wypłaca wygraną tylko raz.",
  info_cancellation_label: "Anulowanie",
  info_cancellation_desc:
    "Po przerwaniu rundy połącz się ponownie, aby przywrócić zapisany wynik. Ostateczny wynik i saldo określa serwer; przerwanie animacji nie oznacza częściowej wypłaty.",
  info_responsible_title: "Odpowiedzialna gra",
  info_responsible_autoplay_label: "Jak korzystać z funkcji automatycznej gry",
  info_responsible_autoplay_desc:
    'Po naciśnięciu przycisku "Autoplay" gra przechodzi w tryb automatyczny z ograniczoną liczbą obrotów. Podczas automatycznej gry wewnątrz przycisku "Stop auto" będzie wyświetlane odliczanie pozostałych obrotów, a gdy osiągnie zero, funkcja automatycznej gry zostanie automatycznie zakończona. W dowolnym momencie gracz może wyłączyć automatyczną grę, naciskając przycisk "Stop auto".',
  info_rtp_title: "Zwrot dla gracza",
  info_rtp_body: "Średni RTP gry wynosi 95%.",
  info_disclaimer_title: "Zastrzeżenie",
  info_disclaimer_body: "Wszelkie usterki unieważniają wszystkie wygrane i rozgrywki. Wymagane jest stabilne połączenie z internetem. W przypadku rozłączenia załaduj grę ponownie, aby dokończyć nieukończone rundy. Oczekiwany zwrot jest obliczany na podstawie wielu rozgrywek. Wyświetlanie gry nie odzwierciedla żadnego fizycznego urządzenia i służy wyłącznie celom ilustracyjnym. Wygrane są rozliczane na podstawie kwoty otrzymanej z serwera zdalnej gry, a nie zdarzeń w przeglądarce.\n\nTM i © 2026 Engine.",
  replay_play: "Odtwórz",
  replay_play_again: "Odtwórz ponownie",
  replay_loading: "Ładowanie powtórki…",
  replay_error: "Nie udało się załadować powtórki.",
  replay_bet_label: "Zakład",
  replay_badge: "POWTÓRKA",
  replay_title: "Powtórka zakładu",
  replay_mode_label: "Tryb",
  replay_base_bet: "Zakład podstawowy",
  replay_cost_multiplier: "Mnożnik kosztu",
  replay_total_bet_cost: "Całkowity koszt zakładu",
  replay_payout_multiplier: "Mnożnik wypłaty",
  replay_total_win: "Całkowita wygrana",
  replay_start: "Rozpocznij powtórkę",
  replay_disclaimer: "To jest powtórka poprzedniej rundy. Żadne zakłady nie zostaną postawione.",
};
