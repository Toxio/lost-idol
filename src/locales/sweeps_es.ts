import { en } from './en';

/**
 * US social-casino overrides for `es.ts`.
 *
 * Loaded when `?social=true` and `?lang=es`. Replaces Spanish gambling
 * terms (apuesta / apostar / pagar / dinero / fondos) with the neutral
 * "jugar / juego / monedas / saldo" vocabulary required for stake.us.
 * Any key not overridden here falls back to the normal `es` locale.
 */
export const sweeps_es: Partial<typeof en> = {
  paytable_star_note: "Las estrellas aparecen en los carretes 1, 3 y 5 y otorgan premios independientemente de las líneas ganadoras. No activan tiradas gratis.",
  bonus_wild_multipliers: "Multiplicadores Wild",
  bonus_win: "Premio de la función",
  bonus_collect: "Continuar",
  bonus_done: "Tiradas gratis finalizadas",
  bonus_start: "Iniciar tiradas gratis",
  bonus_limits: "Se mantiene el importe de juego que activó la función. Las tiradas gratis no se reactivan. Los premios de SCATTER y estrellas siguen aplicándose. El premio de toda la ronda está limitado a 5000× el importe de juego; al alcanzar el límite, la función termina.",
  bonus_intro: "Los Wild se expanden por todo el carrete con multiplicadores ×2, ×3, ×5 o ×10. Las 10 tiradas se juegan sin coste adicional.",
  bonus_title: "Tiradas gratis",
  paytable_dollar_note: "La caja de regalo SCATTER otorga premios en cualquier posición, independientemente de las líneas ganadoras. En el juego base, 3 o más cajas también otorgan 10 tiradas gratis. Tres cajas otorgan 5× el importe total de juego, además de las tiradas gratis.",
  footer_win: 'Ganado',

  bet_title: 'Jugar',
  autospin_bet_unit: 'jugada',

  insufficient_message:
    'Obtén más monedas para seguir jugando. Tu saldo actual no es suficiente para esta jugada.',

  paytable_wild_note:
    'Un Wild expansible aparece en los carretes 2.°, 3.° y 4.° y sustituye a todos los símbolos del mismo carrete excepto los Scatters. Puede aparecer con multiplicadores ×5, ×3 o ×2.',

  info_intro_body:
    "Lost Idol es un juego de 5 carretes y 10 líneas fijas. La tragaperras tiene 11 símbolos, 1 Wild expansible y 2 Scatters. Todas las combinaciones ganadoras se otorgan de izquierda a derecha, excepto los Scatters, que se ganan independientemente de las líneas. Uno de los dos tipos de Scatter, la caja de regalo, también activa un modo de bonificación: 3 o más cajas en el juego base otorgan 10 tiradas gratis con multiplicadores Wild mejorados.",

  info_howtobet_title: 'Cómo jugar',
  info_howtobet_1:
    'Para iniciar una ronda pulsa el botón «Iniciar» o selecciona una de las opciones de juego disponibles.',

  info_paylines_body_1:
    'Todas las ganancias son por combinaciones iguales. Excepto los Scatters, las combinaciones ganadoras deben aparecer en carretes consecutivos de izquierda a derecha, comenzando desde el primer carrete y siguiendo una línea de pago activa.',
  info_paylines_body_2:
    'Las ganancias de Scatter se calculan por separado y se añaden a las ganancias de línea. Si ocurren múltiples combinaciones ganadoras, solo se otorga la combinación de línea de mayor ganancia y/o el Scatter. Las ganancias de línea se multiplican por la cantidad de juego en la línea ganadora, mientras que las ganancias de Scatter se multiplican por el juego total.',

  info_ctrl_bet_label: 'Opciones de juego',
  info_ctrl_bet_desc: 'El jugador puede elegir entre diferentes cantidades de juego.',

  info_balance_desc: 'Muestra el saldo actual de monedas del jugador.',

  info_betvalue_label: 'Opciones de juego',
  info_betvalue_desc:
    'Muestra la cantidad total de juego aplicada a todas las líneas de pago activas. Seleccionando esta opción, el jugador puede elegir una cantidad de juego diferente.',

  info_rules_title: 'Reglas',
  info_rule_1: 'Todas las ganancias se muestran en la tabla de pagos.',
  info_rule_2:
    'Las recompensas de Scatter son independientes de las ganancias de línea y se añaden al total.',
  info_rule_3: 'Las ganancias simultáneas en diferentes líneas se suman.',
  info_rule_4: 'Un mal funcionamiento anula todas las jugadas y ganancias.',
  info_rule_minbet: 'Juego mínimo:',
  info_rule_maxbet: 'Juego máximo:',

  info_recovery_desc:
    'Si el juego se interrumpe por pérdida de conexión, al volver a acceder se reanudará automáticamente desde el punto de interrupción.',
  info_cancellation_desc:
    'Si la ronda se cancela por razones ajenas al jugador, todas las ganancias o monedas acumuladas hasta ese momento aparecerán automáticamente en el saldo del jugador.',

  info_disclaimer_body:
    'Cualquier mal funcionamiento anula todas las ganancias y jugadas. Se requiere una conexión a Internet estable. En caso de desconexión, recarga el juego para finalizar las rondas incompletas. La devolución esperada se calcula a lo largo de muchas jugadas. La visualización del juego no representa ningún dispositivo físico y es solo con fines ilustrativos. Las ganancias se liquidan según el importe recibido del Servidor de Juegos Remoto y no según los eventos en el navegador.\n\nTM y © 2026 Engine.',
};
