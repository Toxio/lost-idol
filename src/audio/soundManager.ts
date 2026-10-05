import { Howl, Howler } from 'howler';

import bigWinInSrc from '@/audio/sounds/big_win_in.mp3';
import bigWinLoopSrc from '@/audio/sounds/big_win_loop.mp3';
import errorDialogSrc from '@/audio/sounds/error_dialog_appear.mp3';
import mainSrc from '@/audio/sounds/main.mp3';
import bonusGameSrc from '@/audio/sounds/bonus_game.mp3';
import megaWinLoopSrc from '@/audio/sounds/mega_win_loop.mp3';
import reelStopSrc from '@/audio/sounds/reel_stop.mp3';
import scatterWinSrc from '@/audio/sounds/scatter_win.mp3';
import spinButtonSrc from '@/audio/sounds/spin_button.mp3';
import superWinLoopSrc from '@/audio/sounds/super_win_loop.mp3';
import uiButtonSrc from '@/audio/sounds/ui_button.mp3';
import wildWinSrc from '@/audio/sounds/wild_win.mp3';
import wildWin2Src from '@/audio/sounds/wild_win2.mp3';
import wildWin3Src from '@/audio/sounds/wild_win3.mp3';
import winSimpleSrc from '@/audio/sounds/win_simple.mp3';
import winningLineSrc from '@/audio/sounds/winning_line.mp3';

export type SoundKey =
  | 'main'
  | 'bonus_game'
  | 'big_win_in'
  | 'big_win_loop'
  | 'mega_win_loop'
  | 'super_win_loop'
  | 'error_dialog'
  | 'reel_stop'
  | 'scatter_win'
  | 'ui_button'
  | 'spin_button'
  | 'win_simple'
  | 'wild_win'
  | 'wild_win2'
  | 'wild_win3'
  | 'winning_line';

export type SoundKind = 'music' | 'effect';

interface SoundConfig {
  src: string[];
  loop?: boolean;
  /** Per-sound base gain (0–1). Multiplied by the master volume for its `kind`. */
  volume?: number;
  kind: SoundKind;
}

/**
 * Per-sound base volumes are normalized to [0, 1] so the master slider has a meaningful range
 * across the whole curve. (Howler clamps above 1, which would otherwise make sliders inert at
 * the top of the range for sounds with base > 1.)
 */
const CONFIGS: Record<SoundKey, SoundConfig> = {
  main: { src: [mainSrc], loop: true, volume: 0.2, kind: 'music' },
  bonus_game: { src: [bonusGameSrc], loop: true, volume: 0.2, kind: 'music' },
  big_win_in: { src: [bigWinInSrc], loop: false, volume: 0.8, kind: 'music' },
  big_win_loop: { src: [bigWinLoopSrc], loop: true, volume: 0.8, kind: 'music' },
  mega_win_loop: { src: [megaWinLoopSrc], loop: true, volume: 0.8, kind: 'music' },
  super_win_loop: { src: [superWinLoopSrc], loop: true, volume: 0.8, kind: 'music' },
  error_dialog: { src: [errorDialogSrc], loop: false, volume: 0.8, kind: 'effect' },
  reel_stop: { src: [reelStopSrc], loop: false, volume: 0.7, kind: 'effect' },
  scatter_win: { src: [scatterWinSrc], loop: false, volume: 0.8, kind: 'effect' },
  ui_button: { src: [uiButtonSrc], loop: false, volume: 0.8, kind: 'effect' },
  spin_button: { src: [spinButtonSrc], loop: false, volume: 1, kind: 'effect' },
  win_simple: { src: [winSimpleSrc], loop: false, volume: 0.8, kind: 'effect' },
  wild_win: { src: [wildWinSrc], loop: false, volume: 0.8, kind: 'effect' },
  wild_win2: { src: [wildWin2Src], loop: false, volume: 0.8, kind: 'effect' },
  wild_win3: { src: [wildWin3Src], loop: false, volume: 0.8, kind: 'effect' },
  winning_line: { src: [winningLineSrc], loop: false, volume: 0.2, kind: 'effect' },
};

// Vite can replace this module while its previous audio objects are still playing.
// Dispose the global audio pool so those orphaned tracks cannot survive a reload.
if (import.meta.hot) {
  Howler.unload();
  import.meta.hot.dispose(() => {
    Howler.unload();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    (['touchstart', 'touchend', 'click'] as const).forEach(event => {
      document.removeEventListener(event, resumeAudioContext);
    });
  });
}

const howls = new Map<SoundKey, Howl>();

// ── Persistence ──────────────────────────────────────────────────────────────
const MUTE_KEY = 'slot_muted';
const MUSIC_VOLUME_KEY = 'slot_music_volume';
const EFFECTS_VOLUME_KEY = 'slot_effects_volume';

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function readStoredVolume(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return fallback;
    return clamp01(parsed);
  } catch {
    return fallback;
  }
}

function readStoredBoolean(key: string, fallback: boolean): boolean {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return fallback;
  }
}

let pendingWrites: Record<string, string> = {};
let writeTimer: number | null = null;

/** Coalesce localStorage writes so dragging a slider doesn't fire 50+ writes/sec. */
function persistDebounced(key: string, value: string): void {
  pendingWrites[key] = value;
  if (writeTimer !== null) return;
  writeTimer = window.setTimeout(() => {
    writeTimer = null;
    const writes = pendingWrites;
    pendingWrites = {};
    try {
      for (const [storeKey, storeValue] of Object.entries(writes)) {
        localStorage.setItem(storeKey, storeValue);
      }
    } catch (error) {
      console.warn('[soundManager] localStorage write failed', error);
    }
  }, 250);
}

// ── Mobile audio unlock ───────────────────────────────────────────────────────
// iOS/Android suspend the AudioContext until a user gesture. Keep it alive and
// resume it on the first touch/click so all subsequent play() calls work.
Howler.autoSuspend = false;

// ── Page visibility mute ──────────────────────────────────────────────────────
function onVisibilityChange(): void {
  if (document.hidden) {
    Howler.mute(true);
  } else {
    Howler.mute(muted);
  }
}
document.addEventListener('visibilitychange', onVisibilityChange);

function resumeAudioContext(): void {
  const ctx = Howler.ctx;
  if (ctx && ctx.state === 'suspended') {
    void ctx.resume();
  }
}

(['touchstart', 'touchend', 'click'] as const).forEach((event) => {
  document.addEventListener(event, resumeAudioContext, { once: true, passive: true });
});

// ── State ────────────────────────────────────────────────────────────────────
let musicVolume = readStoredVolume(MUSIC_VOLUME_KEY, 1);
let effectsVolume = readStoredVolume(EFFECTS_VOLUME_KEY, 1);
let muted = readStoredBoolean(MUTE_KEY, false);
/** Background theme to restore after a big-win presentation. */
let backgroundTrack: 'main' | 'bonus_game' = 'main';
let backgroundPausedForBigWin = false;
Howler.mute(muted);

const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getMusicVolume(): number {
  return musicVolume;
}
export function getEffectsVolume(): number {
  return effectsVolume;
}
export function getMuted(): boolean {
  return muted;
}

// ── Howl helpers ─────────────────────────────────────────────────────────────
function getEffectiveVolume(key: SoundKey): number {
  const base = CONFIGS[key].volume ?? 1;
  const master = CONFIGS[key].kind === 'music' ? musicVolume : effectsVolume;
  return base * master;
}

function applyVolumeToActive(kind: SoundKind): void {
  for (const [key, howl] of howls) {
    if (CONFIGS[key].kind !== kind) continue;
    if (!howl.playing()) continue;
    howl.volume(getEffectiveVolume(key));
  }
}

function getHowl(key: SoundKey): Howl {
  let howl = howls.get(key);
  if (!howl) {
    howl = new Howl({ ...CONFIGS[key], preload: true });
    howls.set(key, howl);
  }
  return howl;
}

// ── Public API ───────────────────────────────────────────────────────────────
export function setMusicVolume(value: number): void {
  musicVolume = clamp01(value);
  applyVolumeToActive('music');
  persistDebounced(MUSIC_VOLUME_KEY, String(musicVolume));
  notify();
}

export function setEffectsVolume(value: number): void {
  effectsVolume = clamp01(value);
  applyVolumeToActive('effect');
  persistDebounced(EFFECTS_VOLUME_KEY, String(effectsVolume));
  notify();
}

export function setMuted(value: boolean): void {
  muted = value;
  Howler.mute(value);
  persistDebounced(MUTE_KEY, String(value));
  notify();
}

export function play(key: SoundKey): void {
  // Music is exclusive: stop the previous track before starting another one.
  // Effects remain independent so reel and interface sounds can play over music.
  if (CONFIGS[key].kind === 'music') {
    for (const [otherKey, otherHowl] of howls) {
      if (otherKey !== key && CONFIGS[otherKey].kind === 'music') {
        otherHowl.unload();
        howls.delete(otherKey);
      }
    }
  }
  const { loop } = CONFIGS[key];
  const volume = getEffectiveVolume(key);
  const howl = getHowl(key);
  if (loop) {
    howl.volume(volume);
    if (!howl.playing()) howl.play();
  } else {
    const id = howl.play();
    howl.volume(volume, id);
  }
}

export function stop(key: SoundKey): void {
  const howl = howls.get(key);
  if (CONFIGS[key].kind === 'music') {
    // Unload also cancels pending playback while a track is loading/unlocking.
    howl?.unload();
    howls.delete(key);
  } else {
    howl?.stop();
  }
}

function pauseBackgroundForBigWin(): void {
  stop(backgroundTrack);
  backgroundPausedForBigWin = true;
}

function resumeBackgroundAfterBigWin(): void {
  if (!backgroundPausedForBigWin) return;
  backgroundPausedForBigWin = false;
  play(backgroundTrack);
}

function clearBigWinIntroHandler(): void {
  howls.get('big_win_in')?.off('end');
}

/** Shared, one-shot celebration for every win tier; no repeated opening fanfare. */
export function playBigWin(): void {
  pauseBackgroundForBigWin();
  clearBigWinIntroHandler();
  stop('big_win_in');
  stop('big_win_loop');
  stop('mega_win_loop');
  stop('super_win_loop');
  play('big_win_in');
}

const WILD_WIN_KEYS: SoundKey[] = ['wild_win', 'wild_win2', 'wild_win3'];

export function playWildWin(): void {
  const key = WILD_WIN_KEYS[Math.floor(Math.random() * WILD_WIN_KEYS.length)];
  play(key);
}

export function stopBigWinSounds(): void {
  clearBigWinIntroHandler();
  stop('big_win_in');
  stop('big_win_loop');
  stop('mega_win_loop');
  stop('super_win_loop');
  resumeBackgroundAfterBigWin();
}

/** Switch game themes and discard any celebration belonging to the previous phase. */
export function setBackgroundMusic(track: 'main' | 'bonus_game'): void {
  if (track !== backgroundTrack) {
    stopBackgroundMusic();
    backgroundTrack = track;
  }
  if (!backgroundPausedForBigWin) play(backgroundTrack);
}

export function stopBackgroundMusic(): void {
  backgroundPausedForBigWin = false;
  clearBigWinIntroHandler();
  stop('main');
  stop('bonus_game');
  stop('big_win_in');
  stop('big_win_loop');
  stop('mega_win_loop');
  stop('super_win_loop');
}
