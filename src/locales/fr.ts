import type {  TranslationKey } from './en';

export const fr: Record<TranslationKey, string> = {
  info_ctrl_replay_desc: "Dans Replay, Lancer lit la manche enregistrée et Rejouer la rejoue. Le panneau affiche le montant total, le montant de base, le multiplicateur du mode et le gain. Aucun nouveau tour ni changement de solde : le choix du montant et le jeu automatique sont indisponibles.",
  info_ctrl_windows_desc: "Cliquez ou appuyez sur les boutons. Les onglets affichent les gains des symboles, les informations et le son. Faites défiler les textes et listes. × ferme les fenêtres qui le permettent. Les commandes désactivées sont indisponibles dans cet état ou à une limite. Les messages proposent de fermer, réessayer ou se reconnecter ; la reconnexion restaure la manche enregistrée.",
  info_ctrl_feature_desc: "Après la transition, sélectionnez « Démarrer les tours gratuits ». Le compteur indique le tour actuel et le total ; le gain du bonus indique les gains cumulés. Les tours avancent automatiquement. Spin/Stop raccourcit l’animation lorsque cela est permis ; Vitesse change son rythme. Le jeu automatique reste visible mais désactivé. « Continuer » ferme le récapitulatif.",
  info_ctrl_bonus_desc: "Ouvre le choix du bonus. Sélectionnez une carte de tours gratuits ou Wild Spin pour voir les règles et le coût total. − / + modifie la mise de base également dans le jeu et la table des gains. Choisir une carte ne lance rien : pour les modes au-delà de 2×, le bouton inférieur ouvre une confirmation séparée avec le mode, le multiplicateur et le total. Seule la confirmation d’achat démarre le bonus ; Annuler ou × revient sans démarrer. × ferme sans achat. Indisponible pendant une manche, les tours gratuits et le jeu automatique.",
  wild_spin_title: "Tour Wild",
  wild_spin_rules: "Un tour pour 10× la mise de base. Au moins un Wild couvre tout son rouleau avec un multiplicateur ×2, ×3, ×5 ou ×10. Sans SCATTER, étoiles ni tours gratuits. Aucun gain garanti. Gain maximal : 5000× la mise de base.",

  buy_bonus_title: "Acheter le bonus",
  buy_bonus_action: "Acheter",
  buy_bonus_cost: "Coût total",
  buy_bonus_confirm: "Confirmer l’achat",
  buy_bonus_rules: "Les Wild s’étendent avec ×2, ×3, ×5 ou ×10. Aucun coût supplémentaire par tour gratuit ni redéclenchement. La limite de 5000× la mise de base termine le bonus plus tôt. La grille initiale de SCATTER déclenche uniquement le bonus et ne rapporte aucun gain. Seuls les tours gratuits rapportent des gains. Les Wild ne sont pas garantis.",

  bonus_wild_multipliers: "Multiplicateurs Wild",
  bonus_win: "Gain de la fonction",
  bonus_collect: "Continuer",
  bonus_done: "Tours gratuits terminés",
  bonus_start: "Lancer les tours gratuits",
  bonus_limits: "La mise initiale reste fixe. Aucun redéclenchement. Les étoiles conservent leurs gains, les boîtes SCATTER ne paient pas. La limite de 5000× la mise termine la partie.",
  bonus_intro: "Les Wild couvrent le rouleau avec ×2, ×3, ×5 ou ×10. Tous les tours gratuits accordés se jouent sans coût supplémentaire.",
  bonus_title: "Tours gratuits",
  footer_balance: 'Solde',
  footer_win: 'Gain',

  menu_paytable: 'Paiements',
  menu_info: 'Info',
  menu_sound: 'Son',

  sound_music_label: 'Musique',
  sound_effects_label: 'Effets sonores',
  sound_muted_banner: 'Son coupé — touchez pour activer',
  sound_muted_unmute: 'Activer le son',

  bet_title: 'Mise',
  bet_confirm: 'Confirmer',

  autospin_title: 'Autoplay',

  autospin_start: 'Démarrer',
  autospin_stop_label: 'Arrêter le jeu automatique quand',
  autospin_stop_after_win: 'Arrêter après le premier gain',
  autospin_stop_win_reaches: 'Arrêter sur gain unique',
  autospin_stop_loss: 'Arrêter quand la perte atteint',
  autospin_bet_unit: 'mise',

  autoplay_stopped_title: 'Jeu automatique terminé',
  autoplay_stopped_subtitle: 'Votre session de jeu automatique est terminée.',
  autoplay_stopped_cancel: 'Annuler',
  autoplay_stopped_repeat: 'Répéter le jeu automatique',

  session_expired_title: 'Session expirée',
  session_expired_subtitle: 'Votre session a pris fin en raison de l’inactivité.',
  session_expired_progress:
    'Votre progression est enregistrée et sera disponible après la reconnexion.',
  session_expired_reconnect: 'Se reconnecter',

  connection_lost_title: 'Connexion perdue',
  connection_lost_subtitle:
    'La connexion au serveur a été perdue. Veuillez vérifier votre connexion Internet et réessayer.',
  connection_lost_retry: 'Réessayer',

  insufficient_badge: 'Notification',
  insufficient_title: 'Solde insuffisant',
  insufficient_message:
    'Alimentez votre compte pour continuer à jouer. Votre solde actuel est insuffisant pour cette mise.',
  insufficient_close: 'Fermer',

  paytable_scatter: 'Scatter',
  paytable_star_note: "Les étoiles apparaissent sur les rouleaux 1, 3 et 5 et paient indépendamment des lignes de paiement. Elles ne déclenchent pas de tours gratuits.",
  paytable_wild_note:
    'Un Wild extensible apparaît sur les 2e, 3e et 4e rouleaux et remplace tous les symboles du même rouleau sauf les Scatters. Peut apparaître avec des multiplicateurs ×5, ×3 ou ×2.',
  paytable_dollar_note: "Les boîtes SCATTER apparaissent sur les cinq rouleaux. Dans le jeu de base, 3 / 4 / 5 boîtes accordent 5 / 10 / 15 tours gratuits, indépendamment des lignes. Elles ne rapportent pas de gain en argent et ne redéclenchent pas les tours gratuits.",

  info_intro_title: 'Introduction',
  info_intro_body:
    "Lost Idol comporte 5 rouleaux, 10 lignes et des Wild expansifs. Les lignes paient de gauche à droite, les étoiles indépendamment des lignes. Les boîtes SCATTER apparaissent sur les cinq rouleaux. Dans le jeu de base, 3 / 4 / 5 boîtes accordent 5 / 10 / 15 tours gratuits, indépendamment des lignes. Elles ne rapportent pas de gain en argent et ne redéclenchent pas les tours gratuits.",
  info_howtobet_title: 'Comment miser',
  info_howtobet_1:
    "Une mise est effectuée en appuyant sur le bouton « Démarrer » ou sur l'un des boutons de mise.",
  info_paylines_title: 'Lignes de paiement et règles',
  info_paylines_body_1:
    "Tous les gains sont attribués pour des combinaisons de symboles identiques. À l'exception des Scatters, les combinaisons gagnantes doivent apparaître sur des rouleaux consécutifs de gauche à droite, en commençant par le premier rouleau et en suivant une ligne de paiement active.",
  info_paylines_body_2:
    "Seule la meilleure combinaison de chaque ligne est récompensée. Les gains de toutes les lignes et des SCATTER sont additionnés. Les multiplicateurs du tableau portent sur la mise totale sélectionnée, sans division par le nombre de lignes. Les multiplicateurs Wild supérieurs à ×1 sur une ligne gagnante sont additionnés.",
  info_paylines_body_3:
    "Tout dysfonctionnement invalidera toutes les parties et les gains. Le résultat de chaque tour est déterminé de manière aléatoire et les actions ou compétences du joueur n'ont aucune influence sur les résultats.",
  info_controls_title: 'Commandes du jeu',
  info_ctrl_spin_label: 'Démarrer',
  info_ctrl_spin_desc:
    "Appuyez sur Spin ou Espace pour lancer une manche lorsque disponible. Pendant un tour manuel, Stop ou un appui sur le jeu raccourcit l’animation si cela est permis, sans modifier le résultat. Espace est inactif avec une fenêtre ouverte et peut être désactivé par la plateforme.",
  info_ctrl_autospin_label: 'Jeu auto',
  info_ctrl_autospin_desc: "Choisissez le nombre de tours et éventuellement un arrêt au premier gain, à un gain unique ou à une perte nette. Réglez les seuils avec − / + et appuyez sur Démarrer. Le nombre dans le carré indique les tours pas encore lancés. Le carré arrête les suivants ; la manche en cours se termine. Répéter reprend les mêmes réglages ; Annuler ferme le bilan.",
  info_ctrl_speed_label: 'Vitesse',
  info_ctrl_speed_desc: "Alternez entre Normal, Rapide et Turbo, y compris en jeu automatique et tours gratuits. Le jeu automatique commence en Turbo. Seul le rythme des animations change. La plateforme peut désactiver cette commande.",
  info_ctrl_bet_label: 'Options de mise',
  info_ctrl_bet_desc: "Appuyez sur le montant, choisissez une valeur ou utilisez − / +, puis confirmez. Fermer applique aussi le choix. Les flèches principales modifient directement la mise. Le bonus et la table des gains utilisent la même mise. Modification impossible pendant une manche ou le jeu automatique.",
  info_ctrl_menu_label: 'Menu',
  info_ctrl_menu_desc: 'En cliquant sur le bouton « Menu », le joueur accède aux paramètres.',
  info_ctrl_sound_label: 'Contrôle du son',
  info_ctrl_sound_desc:
    "Le haut-parleur coupe ou rétablit tout le son. Les curseurs de l’onglet Son règlent séparément musique et effets. Réactivez le son avant de les régler si le jeu est muet.",
  info_balance_label: 'Solde',
  info_balance_desc: "Le solde indique le montant disponible ; le gain affiche le résultat de la manche. Ce sont des indicateurs, pas des boutons.",
  info_betvalue_label: 'Options de mise',
  info_betvalue_desc:
    'Affiche la mise totale appliquée sur toutes les lignes de paiement actives. En sélectionnant cette option, le joueur peut choisir un montant de mise différent.',
  info_rules_title: 'Règles',
  info_rule_1: 'Les paiements sont affichés dans le tableau des paiements.',
  info_rule_2: "Les gains Scatter sont indépendants des gains de lignes et s'ajoutent au total.",
  info_rule_3: 'Les gains simultanés sur différentes lignes sont additionnés.',
  info_rule_4: 'Un dysfonctionnement annule tous les paiements et jeux.',
  info_rule_minbet: 'Mise minimale :',
  info_rule_maxbet: 'Mise maximale :',
  info_interruptions_title: 'Interruptions de jeu',
  info_recovery_label: 'Récupération complète du jeu',
  info_recovery_desc:
    "À la reconnexion, le serveur restaure le tour inachevé et sa mise initiale. Le tour enregistré est rejoué depuis le début sans nouveau prélèvement. Le gain est crédité une seule fois par le serveur.",
  info_cancellation_label: 'Annulation',
  info_cancellation_desc:
    "Si un tour est interrompu, reconnectez-vous pour restaurer son résultat. Le serveur détermine le résultat final et le solde ; une animation interrompue ne donne pas de paiement partiel.",
  info_responsible_title: 'Jeu responsable',
  info_responsible_autoplay_label: 'Comment utiliser la fonction de jeu automatique',
  info_responsible_autoplay_desc:
    'En mode jeu automatique, le jeu tourne automatiquement pour un nombre limité de tours. Le compte à rebours est affiché dans le bouton « Stop auto ». Le joueur peut désactiver le jeu automatique à tout moment.',
  info_rtp_title: 'Retour au joueur',
  info_rtp_body: 'Le RTP moyen du jeu est de 95 %.',
  info_disclaimer_title: "Avertissement",
  info_disclaimer_body: "Tout dysfonctionnement annule les gains et les parties. Une connexion Internet stable est requise. En cas de déconnexion, rechargez le jeu pour terminer les tours non complétés. Le retour attendu est calculé sur de nombreuses parties. L'affichage du jeu ne représente aucun appareil physique et sert uniquement à titre d'illustration. Les gains sont réglés selon le montant reçu du Serveur de Jeu Distant et non selon les événements dans le navigateur.\n\nTM et © 2026 Engine.",
  replay_play: "Lancer",
  replay_play_again: "Rejouer",
  replay_loading: "Chargement de la relecture…",
  replay_error: "Impossible de charger la relecture.",
  replay_bet_label: "Mise",
  replay_badge: "RELECTURE",
  replay_title: "Relecture du pari",
  replay_mode_label: "Mode",
  replay_base_bet: "Mise de base",
  replay_cost_multiplier: "Multiplicateur de coût",
  replay_total_bet_cost: "Coût total du pari",
  replay_payout_multiplier: "Multiplicateur de gain",
  replay_total_win: "Gain total",
  replay_start: "Lancer la relecture",
  replay_disclaimer: "Ceci est une relecture d'une manche précédente. Aucune mise ne sera engagée.",
};
