export const SPIN_OPTIONS = [10, 20, 50, 100, 250];
export const STOP_VALUE_MIN = 60;
export const STOP_VALUE_MAX = 6000;
export const STOP_VALUE_DEFAULT = 60;
export const STOP_VALUE_STEP = 60;

export interface AutoplaySettingsState {
  count: number;
  stopAfterWin: boolean;
  winStopEnabled: boolean;
  winStopValue: number;
  lossStopEnabled: boolean;
  lossStopValue: number;
}

export const DEFAULT_AUTOPLAY_SETTINGS: AutoplaySettingsState = {
  count: 10,
  stopAfterWin: false,
  winStopEnabled: false,
  winStopValue: STOP_VALUE_DEFAULT,
  lossStopEnabled: false,
  lossStopValue: STOP_VALUE_DEFAULT,
};

export interface AutoplayStartOptions {
  count: number;
  stopAfterWin: boolean;
  stopOnWinAmount: number | null;
  stopOnLossAmount: number | null;
}

export function autoplayStartOptionsFromSettings(s: AutoplaySettingsState): AutoplayStartOptions {
  return {
    count: s.count,
    stopAfterWin: s.stopAfterWin,
    stopOnWinAmount: s.winStopEnabled ? s.winStopValue : null,
    stopOnLossAmount: s.lossStopEnabled ? s.lossStopValue : null,
  };
}
