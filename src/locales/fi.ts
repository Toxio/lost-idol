import type {  TranslationKey } from "./en";

export const fi: Record<TranslationKey, string> = {
  info_ctrl_replay_desc: "Replay-tilassa Toista näyttää tallennetun kierroksen ja Toista uudelleen toistaa sen. Paneelissa näkyvät kokonaismäärä, perusmäärä, tilakerroin ja voitto. Toisto ei aloita uutta kierrosta eikä muuta saldoa. Summan valinta ja automaattipeli eivät ole käytössä.",
  info_ctrl_windows_desc: "Napsauta tai napauta painikkeita. Välilehdet näyttävät symbolivoitot, tiedot ja ääniasetukset. Vieritä pitkiä tekstejä ja luetteloita. × sulkee ikkunan, kun saatavilla. Pois käytöstä olevat säätimet eivät toimi nykyisessä tilassa tai rajalla. Ilmoituksista voi sulkea, yrittää uudelleen tai yhdistää uudelleen; yhdistäminen palauttaa tallennetun kierroksen.",
  info_ctrl_feature_desc: "Käynnistä ilmaiskierrokset siirtymän jälkeen. Laskuri näyttää nykyisen kierroksen ja kokonaismäärän; bonusvoitto näyttää kertyneet voitot. Kierrokset etenevät automaattisesti. Spin/Stop lyhentää animaatiota, kun sallittu; Nopeus muuttaa tahtia. Automaattipeli näkyy, mutta ei ole käytettävissä. Jatka sulkee yhteenvedon.",
  info_ctrl_bonus_desc: "Avaa bonusvalinnan. Valitse ilmaiskierrokset tai Wild Spin nähdäksesi säännöt ja kokonaishinnan. − / + muuttaa peruspanosta myös pääpelissä ja voittotaulukossa. Kortin valinta ei aloita kierrosta: yli 2× tiloissa alareunan painike avaa erillisen vahvistuksen, jossa näkyvät tila, kerroin ja kokonaissumma. Vasta ostovahvistus käynnistää bonuksen; Peruuta tai × palaa aloittamatta. × sulkee ilman ostoa. Ei käytettävissä kierroksen, ilmaiskierrosten tai automaattipelin aikana.",
  wild_spin_title: "Wild-kierros",
  wild_spin_rules: "Yksi kierros 10× peruspanoksella. Vähintään yksi Wild laajenee koko kelalle kertoimella ×2, ×3, ×5 tai ×10. Ei SCATTER-symboleja, tähtiä tai ilmaiskierroksia. Voittoa ei taata. Enimmäisvoitto: 5000× peruspanos.",

  buy_bonus_title: "Osta bonus",
  buy_bonus_action: "Osta",
  buy_bonus_cost: "Kokonaishinta",
  buy_bonus_confirm: "Vahvista osto",
  buy_bonus_rules: "Wildit laajenevat kertoimilla ×2, ×3, ×5 tai ×10. Ilmaiskierroksista ei lisämaksuja eikä uudelleenkäynnistyksiä. Kierroksen 5000× peruspanoksen raja päättää bonuksen aikaisin. SCATTER-aloitusruudukko vain käynnistää bonuksen eikä anna voittoja. Vain ilmaiskierrokset maksavat voittoja. Wildeja ei taata.",

  bonus_wild_multipliers: "Wild-kertoimet",
  bonus_win: "Bonusvoitto",
  bonus_collect: "Jatka",
  bonus_done: "Ilmaiskierrokset päättyivät",
  bonus_start: "Aloita ilmaiskierrokset",
  bonus_limits: "Alkuperäinen panos säilyy. Ei uudelleenkäynnistyksiä. Tähdet maksavat edelleen, SCATTER-laatikot eivät. Kierros päättyy 5000× panosrajaan.",
  bonus_intro: "Wildit laajenevat koko kelalle kertoimilla ×2, ×3, ×5 tai ×10. Kaikki saadut ilmaiskierrokset pelataan ilman lisämaksua.",
  bonus_title: "Ilmaiskierrokset",
  footer_balance: "Saldo",
  footer_win: "Voitto",

  menu_paytable: "Voittotaulukko",
  menu_info: "Info",
  menu_sound: "Ääni",

  sound_music_label: "Musiikki",
  sound_effects_label: "Äänitehosteet",
  sound_muted_banner: "Ääni on mykistetty — napauta poistaaksesi mykistyksen",
  sound_muted_unmute: "Poista mykistys",

  bet_title: "Bet",
  bet_confirm: "Vahvista",

  autospin_title: "Autoplay",
  autospin_start: "Aloita",
  autospin_stop_label: "Pysäytä automaattipeli, kun",
  autospin_stop_after_win: "Pysäytä ensimmäisen voiton jälkeen",
  autospin_stop_win_reaches: "Pysäytä, kun yksittäinen voitto",
  autospin_stop_loss: "Pysäytä, kun tappio saavuttaa",
  autospin_bet_unit: "Panos",

  autoplay_stopped_title: "Automaattipeli pysäytetty",
  autoplay_stopped_subtitle: "Automaattipelisessiosi on päättynyt.",
  autoplay_stopped_cancel: "Peruuta",
  autoplay_stopped_repeat: "Toista automaattipeli",

  session_expired_title: "Istunto vanhentunut",
  session_expired_subtitle: "Istuntosi päättyi toimettomuuden vuoksi.",
  session_expired_progress:
    "Edistymisesi on tallennettu ja on käytettävissä uudelleen yhdistämisen jälkeen.",
  session_expired_reconnect: "Yhdistä uudelleen",

  connection_lost_title: "Yhteys katkesi",
  connection_lost_subtitle:
    "Yhteys palvelimeen on katkennut. Tarkista internetyhteytesi ja yritä uudelleen.",
  connection_lost_retry: "Yritä uudelleen",

  insufficient_badge: "Ilmoitus",
  insufficient_title: "Saldo ei riitä",
  insufficient_message:
    "Lisää varoja jatkaaksesi pelaamista. Nykyinen saldosi ei riitä tähän panokseen.",
  insufficient_close: "Sulje",

  paytable_scatter: "Scatter",
  paytable_star_note: "Tähtiä esiintyy keloilla 1, 3 ja 5, ja ne maksavat voittolinjoista riippumatta. Ne eivät käynnistä ilmaiskierroksia.",
  paytable_wild_note:
    "Laajeneva Wild osuu 2., 3. ja 4. rullalle ja korvaa kaikki saman rullan symbolit Scattereita lukuun ottamatta. Se voi ilmestyä kertoimilla ×5, ×3 tai ×2.",
  paytable_dollar_note: "SCATTER-laatikoita voi esiintyä kaikilla viidellä kelalla. Peruspelissä 3 / 4 / 5 laatikkoa antaa 5 / 10 / 15 ilmaiskierrosta voittolinjoista riippumatta. Laatikot eivät maksa rahavoittoja eivätkä käynnistä uusia ilmaiskierroksia bonuksessa.",

  info_intro_title: "Johdanto",
  info_intro_body:
    "Lost Idol sisältää 5 kelaa, 10 voittolinjaa ja laajenevia Wildeja. Linjat maksavat vasemmalta oikealle, tähdet linjoista riippumatta. SCATTER-laatikoita voi esiintyä kaikilla viidellä kelalla. Peruspelissä 3 / 4 / 5 laatikkoa antaa 5 / 10 / 15 ilmaiskierrosta voittolinjoista riippumatta. Laatikot eivät maksa rahavoittoja eivätkä käynnistä uusia ilmaiskierroksia bonuksessa.",
  info_howtobet_title: "Kuinka asettaa panos",
  info_howtobet_1:
    'Aloita kierros painamalla "Spin"-painiketta tai valitsemalla jokin saatavilla olevista panosvaihtoehdoista.',
  info_paylines_title: "Voittolinjat ja säännöt",
  info_paylines_body_1:
    "Kaikki voitot maksetaan täsmäävistä symboliyhdistelmistä. Scatter-symboleita lukuun ottamatta voittoyhdistelmien on oltava peräkkäisillä rullilla vasemmalta oikealle alkaen ensimmäisestä rullasta aktiivista voittolinjaa pitkin.",
  info_paylines_body_2:
    "Kultakin voittolinjalta maksetaan vain paras yhdistelmä. Kaikkien linjojen ja SCATTER-symbolien voitot lasketaan yhteen. Voittotaulukon kertoimet koskevat valittua kokonaispanosta, jota ei jaeta linjojen määrällä. Voittolinjan yli ×1:n Wild-kertoimet lasketaan yhteen.",
  info_paylines_body_3:
    "Mikä tahansa pelin toimintahäiriö mitätöi kaikki kierrokset ja voitot. Jokaisen pyöräytyksen tulos määräytyy satunnaisesti, eikä pelaajan toimilla tai taidolla ole vaikutusta tuloksiin.",
  info_controls_title: "Pelin ohjaimet",
  info_ctrl_spin_label: "Spin",
  info_ctrl_spin_desc:
    "Spin tai välilyönti aloittaa kierroksen, kun sallittu. Käsin käynnistetyn kierroksen aikana Stop tai pelialueen napautus lyhentää animaatiota muuttamatta tulosta. Välilyönti ei toimi avoimessa ikkunassa, ja alusta voi poistaa sen käytöstä.",
  info_ctrl_autospin_label: "Autoplay",
  info_ctrl_autospin_desc:
    "Valitse kierrosmäärä ja halutessasi pysäytys ensimmäiseen voittoon, yksittäisen voiton rajaan tai nettotappiorajaan. Muuta rajoja − / + ja vahvista Aloita. Neliön luku näyttää vielä aloittamattomat kierrokset. Neliö pysäyttää seuraavat; nykyinen kierros päättyy normaalisti. Toista käyttää samoja asetuksia, Peruuta sulkee yhteenvedon.",
  info_ctrl_speed_label: "Nopeus",
  info_ctrl_speed_desc:
    "Vaihtaa normaalin, nopean ja Turbon välillä myös automaattipelissä ja ilmaiskierroksilla. Automaattipeli alkaa Turbolla. Vain animaation nopeus muuttuu. Alusta voi estää toiminnon.",
  info_ctrl_bet_label: "Panosvaihtoehdot",
  info_ctrl_bet_desc:
    "Avaa panosvalinta summasta, valitse arvo tai käytä − / + ja vahvista. Myös sulkeminen ottaa valinnan käyttöön. Pääpelin nuolet muuttavat panosta heti. Bonus ja voittotaulukko käyttävät samaa panosta. Muutokset estetään kierroksen ja automaattipelin aikana.",
  info_ctrl_menu_label: "Valikko",
  info_ctrl_menu_desc: "Avaa pelin asetukset ja määritysvalikon.",
  info_ctrl_sound_label: "Äänen hallinta",
  info_ctrl_sound_desc:
    "Kaiutin mykistää tai palauttaa kaiken äänen. Äänivälilehden liukusäätimet säätävät musiikkia ja tehosteita erikseen. Poista mykistys ennen säätämistä.",
  info_balance_label: "Saldo",
  info_balance_desc: "Saldo näyttää käytettävissä olevan summan ja voitto kierroksen tuloksen. Ne ovat näyttöjä, eivät painikkeita.",
  info_betvalue_label: "Panosvaihtoehdot",
  info_betvalue_desc:
    "Näyttää kokonaispanoksen kaikilla aktiivisilla voittolinjoilla. Tämän valitsemalla pelaaja voi vaihtaa panoksen määrää.",
  info_rules_title: "Yleiset säännöt",
  info_rule_1: "Kaikki voitot löytyvät voittotaulukosta.",
  info_rule_2:
    "Scatter-palkinnot maksetaan linjavoitoista riippumatta ja lisätään kokonaisvoittoon.",
  info_rule_3:
    "Saman pyöräytyksen voitot useilla voittolinjoilla lasketaan yhteen.",
  info_rule_4:
    "Tekninen toimintahäiriö mitätöi kaikki panokset, voitot ja pelitulokset.",
  info_rule_minbet: "Minimipanos:",
  info_rule_maxbet: "Maksimipanos:",
  info_interruptions_title: "Pelin keskeytykset",
  info_recovery_label: "Täysi pelin palautus",
  info_recovery_desc:
    "Yhteyden palauduttua palvelin palauttaa keskeneräisen kierroksen ja alkuperäisen panoksen. Tallennettu kierros näytetään alusta ilman uutta veloitusta. Palvelin hyvittää voiton vain kerran.",
  info_cancellation_label: "Peruutus",
  info_cancellation_desc:
    "Jos kierros keskeytyy, yhdistä uudelleen palauttaaksesi tuloksen. Palvelin määrää lopullisen tuloksen ja saldon; keskeytynyt animaatio ei tuota osittaista maksua.",
  info_responsible_title: "Vastuullinen pelaaminen",
  info_responsible_autoplay_label: "Automaattipelin käyttäminen",
  info_responsible_autoplay_desc:
    'Kun "Autoplay" on päällä, peli suorittaa automaattisesti ennalta määritetyn määrän pyöräytyksiä. Jäljellä olevien pyöräytysten määrä näytetään "Stop Auto" -painikkeessa. Kun laskuri saavuttaa nollan, automaattipeli päättyy. Pelaaja voi pysäyttää automaattipelin milloin tahansa painamalla "Stop Auto" -painiketta.',
  info_rtp_title: "Palautusprosentti (RTP)",
  info_rtp_body: "Tämän pelin teoreettinen palautusprosentti (RTP) on 95 %.",
  info_disclaimer_title: "Vastuuvapauslauseke",
  info_disclaimer_body: "Kaikki häiriöt mitätöivät voitot ja pelit. Vakaa internetyhteys vaaditaan. Jos yhteys katkeaa, lataa peli uudelleen viimeistelläksesi keskeneräiset kierrokset. Odotettu tuotto lasketaan monista pelikerroista. Pelin näyttö ei vastaa mitään fyysistä laitetta ja on vain havainnollistava. Voitot maksetaan Remote Game Serverin lähettämän summan mukaan, ei selaimen tapahtumien perusteella.\n\nTM ja © 2026 Engine.",
  replay_play: "Toista",
  replay_play_again: "Toista uudelleen",
  replay_loading: "Ladataan uusintaa…",
  replay_error: "Uusintaa ei voitu ladata.",
  replay_bet_label: "Panos",
  replay_badge: "UUSINTA",
  replay_title: "Panoksen uusinta",
  replay_mode_label: "Tila",
  replay_base_bet: "Peruspanos",
  replay_cost_multiplier: "Kustannuskerroin",
  replay_total_bet_cost: "Panoksen kokonaiskustannus",
  replay_payout_multiplier: "Maksukerroin",
  replay_total_win: "Kokonaisvoitto",
  replay_start: "Aloita uusinta",
  replay_disclaimer: "Tämä on uusinta aiemmasta kierroksesta. Panoksia ei aseteta.",
};
