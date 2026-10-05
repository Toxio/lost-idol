import type {  TranslationKey } from './en';

export const pt: Record<TranslationKey, string> = {
  info_ctrl_replay_desc: "Em Replay, Reproduzir mostra a rodada gravada e Reproduzir novamente repete-a. O painel mostra valor total, valor base, multiplicador do modo e prémio. Não inicia outra rodada nem altera o saldo. A seleção do valor e o jogo automático ficam indisponíveis.",
  info_ctrl_windows_desc: "Clique ou toque nos botões. Os separadores mostram prémios dos símbolos, informações e som. Desloque textos e listas longos. × fecha as janelas disponíveis. Controlos desativados não podem ser usados nesse estado ou num limite. Os avisos permitem fechar, tentar novamente ou reconectar; reconectar restaura a rodada gravada.",
  info_ctrl_feature_desc: "Após a transição, inicie as rodadas grátis. O contador mostra a rodada atual e o total; o ganho do bónus mostra o acumulado. As rodadas avançam automaticamente. Spin/Stop encurta a animação quando permitido; Velocidade altera o ritmo. O jogo automático fica visível, mas desativado. Continuar fecha o resumo.",
  info_ctrl_bonus_desc: "Abre a seleção de bónus. Escolha rodadas grátis ou Wild Spin para ver as regras e o custo total. − / + altera a aposta base no jogo e na tabela de prémios. Escolher uma carta não inicia a rodada: nos modos acima de 2×, o botão inferior abre uma confirmação separada com modo, multiplicador e total. Só confirmar a compra inicia o bónus; Cancelar ou × volta sem iniciar. × fecha sem comprar. Indisponível durante uma rodada, rodadas grátis ou jogo automático.",
  wild_spin_title: "Giro Wild",
  wild_spin_rules: "Um giro por 10× a aposta base. Pelo menos um Wild ocupa todo o rolo com multiplicador ×2, ×3, ×5 ou ×10. Sem SCATTER, estrelas ou giros grátis. O prêmio não é garantido. Prêmio máximo: 5000× a aposta base.",

  buy_bonus_title: "Comprar bónus",
  buy_bonus_action: "Comprar",
  buy_bonus_cost: "Custo total",
  buy_bonus_confirm: "Confirmar compra",
  buy_bonus_rules: "Wilds expandem com ×2, ×3, ×5 ou ×10. Sem custos adicionais por rodada grátis nem reativações. O limite de 5000× a aposta base termina o bónus antecipadamente. O painel inicial com SCATTER apenas ativa o bónus e não atribui prémios. Só os giros grátis pagam. Wilds não são garantidos.",

  bonus_wild_multipliers: "Multiplicadores Wild",
  bonus_win: "Prêmio do recurso",
  bonus_collect: "Continuar",
  bonus_done: "Rodadas grátis concluídas",
  bonus_start: "Iniciar rodadas grátis",
  bonus_limits: "A aposta inicial mantém-se. Sem reativações. As estrelas mantêm os prémios; as caixas SCATTER não pagam. A ronda termina ao atingir 5000× a aposta.",
  bonus_intro: "Os Wilds expandem-se pelo rolo com ×2, ×3, ×5 ou ×10. Todos os giros grátis concedidos não têm custo adicional.",
  bonus_title: "Rodadas grátis",
  footer_balance: 'Saldo',
  footer_win: 'Ganho',

  menu_paytable: 'Pagamentos',
  menu_info: 'Info',
  menu_sound: 'Som',

  sound_music_label: 'Música',
  sound_effects_label: 'Efeitos sonoros',
  sound_muted_banner: 'Som silenciado — toque para ativar',
  sound_muted_unmute: 'Ativar som',

  bet_title: 'Aposta',
  bet_confirm: 'Confirmar',

  autospin_title: 'Autoplay',

  autospin_start: 'Iniciar',
  autospin_stop_label: 'Parar giro automático quando',
  autospin_stop_after_win: 'Parar após o primeiro ganho',
  autospin_stop_win_reaches: 'Parar em ganho único',
  autospin_stop_loss: 'Parar quando a perda atingir',
  autospin_bet_unit: 'aposta',

  autoplay_stopped_title: 'Giro Automático Parado',
  autoplay_stopped_subtitle: 'Sua sessão de giro automático encerrou.',
  autoplay_stopped_cancel: 'Cancelar',
  autoplay_stopped_repeat: 'Repetir giro automático',

  session_expired_title: 'Sessão expirada',
  session_expired_subtitle: 'A sua sessão terminou devido à inatividade.',
  session_expired_progress: 'O seu progresso está guardado e ficará disponível após a reconexão.',
  session_expired_reconnect: 'Reconectar',

  connection_lost_title: 'Conexão Perdida',
  connection_lost_subtitle:
    'A conexão com o servidor foi perdida. Verifique sua conexão com a internet e tente novamente.',
  connection_lost_retry: 'Tentar Novamente',

  insufficient_badge: 'Notificação',
  insufficient_title: 'Saldo Insuficiente',
  insufficient_message:
    'Adicione fundos para continuar jogando. Seu saldo atual não é suficiente para esta aposta.',
  insufficient_close: 'Fechar',

  paytable_scatter: 'Scatter',
  paytable_star_note: "As estrelas aparecem nos rolos 1, 3 e 5 e pagam independentemente das linhas de pagamento. Elas não ativam rodadas grátis.",
  paytable_wild_note:
    'Um Wild Expansivo cai nos rolos 2º, 3º e 4º e substitui todos os símbolos no mesmo rolo, exceto os Scatters. Pode aparecer com multiplicadores ×5, ×3 ou ×2.',
  paytable_dollar_note: "As caixas SCATTER aparecem nos cinco rolos. No jogo base, 3 / 4 / 5 caixas concedem 5 / 10 / 15 giros grátis, independentemente das linhas. As caixas não pagam dinheiro nem reativam os giros grátis.",

  info_intro_title: 'Introdução',
  info_intro_body:
    "Lost Idol tem 5 rolos, 10 linhas e Wilds expansivos. As linhas pagam da esquerda para a direita e as estrelas pagam independentemente das linhas. As caixas SCATTER aparecem nos cinco rolos. No jogo base, 3 / 4 / 5 caixas concedem 5 / 10 / 15 giros grátis, independentemente das linhas. As caixas não pagam dinheiro nem reativam os giros grátis.",
  info_howtobet_title: 'Como Apostar',
  info_howtobet_1:
    'Uma aposta é feita pressionando o botão "Iniciar" ou qualquer um dos botões de aposta.',
  info_paylines_title: 'Linhas de Pagamento e Regras',
  info_paylines_body_1:
    'Todos os pagamentos são atribuídos por combinações de símbolos correspondentes. Exceto os símbolos Scatter, as combinações vencedoras devem aparecer em rolos consecutivos da esquerda para a direita, começando pelo primeiro rolo e seguindo uma linha de pagamento ativa.',
  info_paylines_body_2:
    "Apenas a melhor combinação de cada linha é premiada. Os ganhos de todas as linhas e dos SCATTER são somados. Os multiplicadores da tabela aplicam-se à aposta total selecionada, sem divisão pelo número de linhas. Os multiplicadores Wild superiores a ×1 numa linha vencedora são somados.",
  info_paylines_body_3:
    'Qualquer mau funcionamento do jogo invalidará todas as rondas e ganhos. O resultado de cada giro é determinado aleatoriamente e as ações ou habilidades do jogador não têm influência nos resultados.',
  info_controls_title: 'Controles do Jogo',
  info_ctrl_spin_label: 'Iniciar',
  info_ctrl_spin_desc:
    "Spin ou Espaço inicia uma rodada quando permitido. Num giro manual, Stop ou tocar no jogo encurta a animação sem alterar o resultado. Espaço não funciona com janelas abertas e pode ser desativado pela plataforma.",
  info_ctrl_autospin_label: 'Giro Auto',
  info_ctrl_autospin_desc:
    "Escolha quantas rodadas jogar e, opcionalmente, parar no primeiro prémio, num prémio individual ou numa perda líquida. Ajuste limites com − / + e confirme em Iniciar. O número no quadrado conta rodadas ainda não iniciadas. O quadrado para as seguintes; a atual termina. Repetir usa os mesmos ajustes; Cancelar fecha o resumo.",
  info_ctrl_speed_label: 'Velocidade',
  info_ctrl_speed_desc:
    "Alterna Normal, Rápido e Turbo, também no jogo automático e nas rodadas grátis. O jogo automático começa em Turbo. Só altera animações. A plataforma pode desativar este controlo.",
  info_ctrl_bet_label: 'Opções de aposta',
  info_ctrl_bet_desc:
    "Toque no valor, escolha uma opção ou use − / + e confirme. Fechar também aplica a seleção. As setas principais alteram a aposta diretamente. O bónus e a tabela usam a mesma aposta. Não é possível alterar durante rodadas ou jogo automático.",
  info_ctrl_menu_label: 'Menu',
  info_ctrl_menu_desc: 'Ao clicar no botão "Menu", o jogador acessa o menu "Configurações".',
  info_ctrl_sound_label: 'Controlo de som',
  info_ctrl_sound_desc:
    "O altifalante silencia ou ativa todo o som. Os deslizadores em Som ajustam música e efeitos separadamente. Ative o som antes de ajustar se estiver silenciado.",
  info_balance_label: 'Saldo',
  info_balance_desc: "O saldo mostra o valor disponível e o prémio mostra o resultado da rodada. São indicadores, não botões.",
  info_betvalue_label: 'Opções de aposta',
  info_betvalue_desc:
    'Mostra a aposta total aplicada em todas as linhas de pagamento ativas. Selecionando esta opção, o jogador pode escolher um valor de aposta diferente.',
  info_rules_title: 'Regras',
  info_rule_1: 'Os pagamentos são exibidos na Tabela de Pagamentos.',
  info_rule_2:
    'Os prêmios de Scatter são independentes dos prêmios de linha e também são adicionados ao total pago.',
  info_rule_3: 'Ganhos simultâneos em diferentes linhas de pagamento são somados.',
  info_rule_4: 'Um mau funcionamento anula todos os pagamentos e jogadas.',
  info_rule_minbet: 'Aposta Mínima:',
  info_rule_maxbet: 'Aposta Máxima:',
  info_interruptions_title: 'Interrupções do Jogo',
  info_recovery_label: 'Recuperação Completa do Jogo',
  info_recovery_desc:
    "Ao reconectar, o servidor restaura a rodada pendente e a aposta original. A rodada gravada é reproduzida desde o início sem nova cobrança. O servidor credita o prêmio apenas uma vez.",
  info_cancellation_label: 'Cancelamento',
  info_cancellation_desc:
    "Se uma rodada for interrompida, reconecte para restaurar o resultado. O servidor determina o resultado final e o saldo; interromper a animação não gera pagamento parcial.",
  info_responsible_title: 'Jogo Responsável',
  info_responsible_autoplay_label: 'Como usar o recurso de giro automático',
  info_responsible_autoplay_desc:
    'Quando o botão "Giro Auto" é pressionado, o jogo entra em modo automático com um número limitado de giros. Durante o Giro Automático, haverá uma contagem regressiva dos giros restantes dentro do botão "Parar auto" e quando chegar a zero, o recurso de Giro Automático será encerrado automaticamente. A qualquer momento, o jogador pode desativar o Giro Automático pressionando o botão "Parar auto".',
  info_rtp_title: 'Retorno ao Jogador',
  info_rtp_body: 'O RTP médio do jogo é de 96%.',
  info_disclaimer_title: "Aviso legal",
  info_disclaimer_body: "Qualquer falha anula todos os prêmios e jogadas. É necessária uma conexão estável com a internet. Em caso de desconexão, recarregue o jogo para concluir rodadas incompletas. O retorno esperado é calculado ao longo de muitas jogadas. A exibição do jogo não representa nenhum dispositivo físico e serve apenas para fins ilustrativos. Os ganhos são liquidados conforme o valor recebido do Servidor de Jogo Remoto e não pelos eventos no navegador.\n\nTM e © 2026 Engine.",
  replay_play: "Reproduzir",
  replay_play_again: "Reproduzir novamente",
  replay_loading: "Carregando reprodução…",
  replay_error: "Não foi possível carregar a reprodução.",
  replay_bet_label: "Aposta",
  replay_badge: "REPETIÇÃO",
  replay_title: "Repetição da aposta",
  replay_mode_label: "Modo",
  replay_base_bet: "Aposta base",
  replay_cost_multiplier: "Multiplicador de custo",
  replay_total_bet_cost: "Custo total da aposta",
  replay_payout_multiplier: "Multiplicador de pagamento",
  replay_total_win: "Ganho total",
  replay_start: "Iniciar repetição",
  replay_disclaimer: "Esta é uma repetição de uma rodada anterior. Nenhuma aposta será feita.",
};
