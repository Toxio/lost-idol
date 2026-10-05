import type {  TranslationKey } from './en';

export const es: Record<TranslationKey, string> = {
  info_ctrl_replay_desc: "En Replay, Reproducir reproduce la ronda registrada y Reproducir de nuevo la repite. Se muestran importe total, importe base, multiplicador del modo y premio. No inicia otra ronda ni cambia el saldo. La selección del importe y el juego automático no están disponibles.",
  info_ctrl_windows_desc: "Haz clic o toca los botones. Las pestañas muestran premios de símbolos, información y sonido. Desplaza los textos y listas largos. × cierra las ventanas donde esté disponible. Los controles desactivados no se pueden usar en ese estado o al alcanzar un límite. Los avisos permiten cerrar, reintentar o reconectar; reconectar restaura la ronda registrada.",
  info_ctrl_feature_desc: "Tras la transición, pulsa «Iniciar giros gratis». El contador muestra el giro actual y el total; el premio del bono muestra lo acumulado. Los giros avanzan automáticamente. Spin/Stop acorta la animación cuando se permite; Velocidad cambia el ritmo. El juego automático permanece visible pero desactivado. «Continuar» cierra el resumen.",
  info_ctrl_bonus_desc: "Abre la selección de bonos. Elige giros gratis o Wild Spin para ver las reglas y el coste total. − / + cambia la apuesta base también en el juego principal y la tabla de premios. Elegir una tarjeta no inicia una ronda: en modos superiores a 2×, el botón inferior abre una confirmación aparte con modo, multiplicador e importe total. Solo confirmar la compra inicia el bono; Cancelar o × vuelve sin iniciarlo. × cierra sin comprar. No disponible durante una ronda, giros gratis o juego automático.",
  wild_spin_title: "Giro Wild",
  wild_spin_rules: "Un giro por 10× la apuesta base. Al menos un Wild se expande por todo su carrete con un multiplicador ×2, ×3, ×5 o ×10. Sin SCATTER, estrellas ni giros gratis. No se garantiza un premio. Premio máximo: 5000× la apuesta base.",

  buy_bonus_title: "Comprar bono",
  buy_bonus_action: "Comprar",
  buy_bonus_cost: "Coste total",
  buy_bonus_confirm: "Confirmar compra",
  buy_bonus_rules: "Los Wild se expanden con ×2, ×3, ×5 o ×10. Sin cargos adicionales por giro gratis ni reactivaciones. El límite de 5000× la apuesta base termina el bono antes. El tablero inicial con SCATTER solo activa el bono y no otorga premios. Solo pagan los giros gratis. No se garantizan Wild.",

  bonus_wild_multipliers: "Multiplicadores Wild",
  bonus_win: "Premio de la función",
  bonus_collect: "Continuar",
  bonus_done: "Tiradas gratis finalizadas",
  bonus_start: "Iniciar tiradas gratis",
  bonus_limits: "Se mantiene la apuesta inicial. Sin reactivaciones. Las estrellas conservan sus premios; las cajas SCATTER no pagan. La ronda termina al alcanzar 5000× la apuesta.",
  bonus_intro: "Los Wild se expanden por el rodillo con ×2, ×3, ×5 o ×10. Todos los giros gratis obtenidos se juegan sin coste adicional.",
  bonus_title: "Tiradas gratis",
  footer_balance: 'Saldo',
  footer_win: 'Premio',

  menu_paytable: 'Pagos',
  menu_info: 'Info',
  menu_sound: 'Sonido',

  sound_music_label: 'Música',
  sound_effects_label: 'Efectos de sonido',
  sound_muted_banner: 'Sonido silenciado — toca para activar',
  sound_muted_unmute: 'Activar sonido',

  bet_title: 'Apuesta',
  bet_confirm: 'Confirmar',

  autospin_title: 'Autoplay',

  autospin_start: 'Iniciar',
  autospin_stop_label: 'Detener giro automático cuando',
  autospin_stop_after_win: 'Detener tras la primera ganancia',
  autospin_stop_win_reaches: 'Detener en ganancia única',
  autospin_stop_loss: 'Detener cuando la pérdida alcance',
  autospin_bet_unit: 'apuesta',

  autoplay_stopped_title: 'Giro automático detenido',
  autoplay_stopped_subtitle: 'Tu sesión de giro automático ha finalizado.',
  autoplay_stopped_cancel: 'Cancelar',
  autoplay_stopped_repeat: 'Repetir giro automático',

  session_expired_title: 'Sesión expirada',
  session_expired_subtitle: 'Tu sesión finalizó por inactividad.',
  session_expired_progress:
    'Tu progreso está guardado y estará disponible después de reconectarte.',
  session_expired_reconnect: 'Reconectar',

  connection_lost_title: 'Conexión perdida',
  connection_lost_subtitle:
    'Se ha perdido la conexión con el servidor. Comprueba tu conexión a Internet e inténtalo de nuevo.',
  connection_lost_retry: 'Reintentar',

  insufficient_badge: 'Notificación',
  insufficient_title: 'Saldo insuficiente',
  insufficient_message:
    'Añade fondos para continuar jugando. Tu saldo actual no es suficiente para esta apuesta.',
  insufficient_close: 'Cerrar',

  paytable_scatter: 'Scatter',
  paytable_star_note: "Las estrellas aparecen en los carretes 1, 3 y 5 y pagan independientemente de las líneas de pago. No activan tiradas gratis.",
  paytable_wild_note:
    'Un Wild expansible aparece en los carretes 2.°, 3.° y 4.° y sustituye a todos los símbolos del mismo carrete excepto los Scatters. Puede aparecer con multiplicadores ×5, ×3 o ×2.',
  paytable_dollar_note: "Las cajas SCATTER aparecen en los cinco rodillos. En el juego base, 3 / 4 / 5 cajas otorgan 5 / 10 / 15 giros gratis sin depender de las líneas. Las cajas no pagan dinero ni reactivan giros gratis dentro del bono.",

  info_intro_title: 'Introducción',
  info_intro_body:
    "Lost Idol tiene 5 rodillos, 10 líneas y Wild expansivos. Las líneas pagan de izquierda a derecha y las estrellas pagan independientemente de ellas. Las cajas SCATTER aparecen en los cinco rodillos. En el juego base, 3 / 4 / 5 cajas otorgan 5 / 10 / 15 giros gratis sin depender de las líneas. Las cajas no pagan dinero ni reactivan giros gratis dentro del bono.",
  info_howtobet_title: 'Cómo apostar',
  info_howtobet_1:
    'Se realiza una apuesta pulsando el botón «Iniciar» o cualquiera de los botones de apuesta.',
  info_paylines_title: 'Líneas de pago y reglas',
  info_paylines_body_1:
    'Todos los pagos son por combinaciones iguales. Excepto los Scatters, las combinaciones ganadoras deben aparecer en carretes consecutivos de izquierda a derecha, comenzando desde el primer carrete y siguiendo una línea de pago activa.',
  info_paylines_body_2:
    "Solo se premia la mejor combinación de cada línea. Se suman los premios de todas las líneas y de SCATTER. Los multiplicadores de la tabla se aplican a la apuesta total seleccionada, sin dividirla entre las líneas. Los multiplicadores Wild superiores a ×1 en una línea ganadora se suman.",
  info_paylines_body_3:
    'Cualquier mal funcionamiento invalidará todas las rondas y ganancias. El resultado de cada giro se determina aleatoriamente y las acciones o habilidades del jugador no tienen influencia en los resultados.',
  info_controls_title: 'Controles del juego',
  info_ctrl_spin_label: 'Iniciar',
  info_ctrl_spin_desc:
    "Pulsa Spin o Espacio para iniciar una ronda cuando esté permitido. Durante un giro manual, Stop o tocar el área de juego acorta la animación sin cambiar el resultado. Espacio no funciona con ventanas abiertas y puede estar desactivado por la plataforma.",
  info_ctrl_autospin_label: 'Giro auto',
  info_ctrl_autospin_desc: "Elige el número de giros y, opcionalmente, parar tras el primer premio, un premio individual o una pérdida neta. Ajusta los umbrales con − / + y pulsa Iniciar. El número del cuadrado indica giros aún no iniciados. Pulsa el cuadrado para detener los siguientes; la ronda actual termina. Repetir usa los mismos ajustes; Cancelar cierra el resumen.",
  info_ctrl_speed_label: 'Velocidad',
  info_ctrl_speed_desc: "Alterna Normal, Rápido y Turbo, también en juego automático y giros gratis. El juego automático empieza en Turbo. Solo cambia la animación. La plataforma puede desactivar este control.",
  info_ctrl_bet_label: 'Opciones de apuesta',
  info_ctrl_bet_desc: "Pulsa el importe, selecciona una cifra o usa − / + y confirma. Cerrar también aplica la selección. Las flechas principales cambian la apuesta directamente. Bono y tabla de premios usan la misma apuesta. No se puede cambiar durante una ronda o el juego automático.",
  info_ctrl_menu_label: 'Menú',
  info_ctrl_menu_desc: 'Al hacer clic en el botón «Menú», el jugador accede a la configuración.',
  info_ctrl_sound_label: 'Control de sonido',
  info_ctrl_sound_desc:
    "El altavoz silencia o activa todo el sonido. En Sonido, los deslizadores ajustan música y efectos por separado. Si está silenciado, activa el sonido antes de ajustarlos.",
  info_balance_label: 'Saldo',
  info_balance_desc: "El saldo muestra el importe disponible; el premio, el resultado de la ronda. Son indicadores, no botones.",
  info_betvalue_label: 'Opciones de apuesta',
  info_betvalue_desc:
    'Muestra la apuesta total en todas las líneas de pago activas. Seleccionando esta opción, el jugador puede elegir un importe de apuesta diferente.',
  info_rules_title: 'Reglas',
  info_rule_1: 'Los pagos se muestran en la tabla de pagos.',
  info_rule_2:
    'Los premios Scatter son independientes de los premios de línea y se añaden al total.',
  info_rule_3: 'Las ganancias simultáneas en diferentes líneas se suman.',
  info_rule_4: 'Un mal funcionamiento anula todos los pagos y juegos.',
  info_rule_minbet: 'Apuesta mínima:',
  info_rule_maxbet: 'Apuesta máxima:',
  info_interruptions_title: 'Interrupciones del juego',
  info_recovery_label: 'Recuperación completa del juego',
  info_recovery_desc:
    "Al reconectar, el servidor recupera la ronda pendiente y su apuesta original. La ronda grabada se reproduce desde el principio sin un nuevo cargo. El servidor abona el premio una sola vez.",
  info_cancellation_label: 'Cancelación',
  info_cancellation_desc:
    "Si se interrumpe una ronda, vuelve a conectarte para recuperar su resultado. El servidor determina el resultado final y el saldo; una animación interrumpida no genera un pago parcial.",
  info_responsible_title: 'Juego responsable',
  info_responsible_autoplay_label: 'Cómo usar el giro automático',
  info_responsible_autoplay_desc:
    'En modo de giro automático, el juego funciona automáticamente durante un número limitado de giros. La cuenta regresiva se muestra en el botón «Detener auto». El jugador puede desactivar el giro automático en cualquier momento.',
  info_rtp_title: 'Retorno al jugador',
  info_rtp_body: 'El RTP promedio del juego es del 96 %.',
  info_disclaimer_title: "Aviso legal",
  info_disclaimer_body: "Cualquier mal funcionamiento anula todas las ganancias y jugadas. Se requiere una conexión a Internet estable. En caso de desconexión, recarga el juego para finalizar las rondas incompletas. La devolución esperada se calcula a lo largo de muchas jugadas. La visualización del juego no representa ningún dispositivo físico y es solo con fines ilustrativos. Las ganancias se liquidan según el importe recibido del Servidor de Juegos Remoto y no según los eventos en el navegador.\n\nTM y © 2026 Engine.",
  replay_play: "Reproducir",
  replay_play_again: "Reproducir de nuevo",
  replay_loading: "Cargando repetición…",
  replay_error: "No se pudo cargar la repetición.",
  replay_bet_label: "Apuesta",
  replay_badge: "REPETICIÓN",
  replay_title: "Repetición de apuesta",
  replay_mode_label: "Modo",
  replay_base_bet: "Apuesta base",
  replay_cost_multiplier: "Multiplicador de coste",
  replay_total_bet_cost: "Coste total de apuesta",
  replay_payout_multiplier: "Multiplicador de pago",
  replay_total_win: "Ganancia total",
  replay_start: "Iniciar repetición",
  replay_disclaimer: "Esta es una repetición de una ronda anterior. No se realizarán apuestas.",
};
