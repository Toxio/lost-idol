import { type Spine } from '@esotericsoftware/spine-pixi-v8';
import type { Container } from 'pixi.js';
import { type RefObject, useEffect } from 'react';

import { stopBigWinSounds } from '@/audio/soundManager';
import { getSpinSpeedPreset, type SpinSpeedLevel, type SpinSpeedPreset } from '../constants';
import { setSlotSymbolVisibility } from './symbolSprites';
import { clearSettledSymbolOverlays, type SettledSymbolEntry } from './settledSymbolOverlay';
import type { Reel, ReelTween, WinHighlight } from '../types';

interface UseResetOnSpinStartOptions {
  spinning: boolean;
  spinSpeed: SpinSpeedLevel;
  bigWinActiveRef: RefObject<boolean>;
  bigWinPendingRef: RefObject<boolean>;
  bigWinAmountTickUpRef: RefObject<{ stop: () => void } | null>;
  bigWinLayerRef: RefObject<Container | null>;
  activePresetRef: RefObject<SpinSpeedPreset>;
  spinStartRef: RefObject<number>;
  stopFiredRef: RefObject<boolean>;
  tweensRef: RefObject<ReelTween[]>;
  reelsRef: RefObject<Reel[]>;
  activeWinSpinesRef: RefObject<Spine[]>;
  wildIdleSpinesRef: RefObject<Array<{ spine: Spine; col: number; row: number }>>;
  wildActiveSpinesRef: RefObject<Spine[]>;
  winOverlayRef: RefObject<Container | null>;
  settledOverlayRef: RefObject<Container | null>;
  settledSymbolSpinesRef: RefObject<SettledSymbolEntry[]>;
  wildOverlayRef: RefObject<Container | null>;
  paylineLayerRef: RefObject<Container | null>;
  winHighlightsRef: RefObject<WinHighlight[]>;
  paylineInDelayRef: RefObject<boolean>;
  expandingWildColsRef: RefObject<number[]>;
}

/**
 * Clears all per-spin overlays, animations, and tweens when a new spin starts.
 * Mirrors the inverse of every "spin settled" effect — needed because a stale big-win banner
 * or active payline cycle would otherwise persist into the next spin.
 */
export function useResetOnSpinStart({
  spinning,
  spinSpeed,
  bigWinActiveRef,
  bigWinPendingRef,
  bigWinAmountTickUpRef,
  bigWinLayerRef,
  activePresetRef,
  spinStartRef,
  stopFiredRef,
  tweensRef,
  reelsRef,
  activeWinSpinesRef,
  wildIdleSpinesRef,
  wildActiveSpinesRef,
  winOverlayRef,
  settledOverlayRef,
  settledSymbolSpinesRef,
  wildOverlayRef,
  paylineLayerRef,
  winHighlightsRef,
  paylineInDelayRef,
  expandingWildColsRef,
}: UseResetOnSpinStartOptions) {
  useEffect(() => {
    if (!spinning) return;

    bigWinActiveRef.current = false;
    bigWinPendingRef.current = false;
    stopBigWinSounds();
    bigWinAmountTickUpRef.current?.stop();
    bigWinAmountTickUpRef.current = null;

    const bigWinLayer = bigWinLayerRef.current;
    if (bigWinLayer) {
      for (const child of [...bigWinLayer.children]) {
        bigWinLayer.removeChild(child);
        child.destroy();
      }
    }

    activePresetRef.current = getSpinSpeedPreset(spinSpeed);
    spinStartRef.current = Date.now();
    stopFiredRef.current = false;
    tweensRef.current = [];

    reelsRef.current.forEach((reel) => {
      reel.stopping = false;
      reel.settleBounce = undefined;
      reel.stripCont.y = 0;
      reel.symbols.forEach((sym) => setSlotSymbolVisibility(sym, true));
    });

    clearSettledSymbolOverlays(settledOverlayRef, settledSymbolSpinesRef);

    for (const spine of activeWinSpinesRef.current) {
      if (spine.parent) spine.parent.removeChild(spine);
      spine.destroy();
    }
    activeWinSpinesRef.current = [];

    for (const { spine } of wildIdleSpinesRef.current) {
      if (spine.parent) spine.parent.removeChild(spine);
      spine.destroy();
    }
    wildIdleSpinesRef.current = [];

    paylineInDelayRef.current = false;
    winOverlayRef.current?.removeChildren();

    for (const highlight of winHighlightsRef.current) highlight.paylineAnim?.destroy();
    winHighlightsRef.current = [];

    paylineLayerRef.current?.removeChildren();
    if (paylineLayerRef.current) paylineLayerRef.current.visible = true;

    for (const spine of wildActiveSpinesRef.current) {
      if (spine.parent) spine.parent.removeChild(spine);
      spine.destroy();
    }
    wildActiveSpinesRef.current = [];

    expandingWildColsRef.current = [];
    wildOverlayRef.current?.removeChildren();
  }, [
    spinning,
    spinSpeed,
    bigWinActiveRef,
    bigWinPendingRef,
    bigWinAmountTickUpRef,
    bigWinLayerRef,
    activePresetRef,
    spinStartRef,
    stopFiredRef,
    tweensRef,
    reelsRef,
    activeWinSpinesRef,
    wildIdleSpinesRef,
    wildActiveSpinesRef,
    winOverlayRef,
    settledOverlayRef,
    settledSymbolSpinesRef,
    wildOverlayRef,
    paylineLayerRef,
    winHighlightsRef,
    paylineInDelayRef,
    expandingWildColsRef,
  ]);
}
