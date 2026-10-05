import { Container, Sprite } from 'pixi.js';

import { resolveSymbolTexture } from './assets';
import type { SlotSymbol } from '../types';

const SYMBOL_FIT = 0.82;
const WILD_SYMBOL_FIT = SYMBOL_FIT * 1.8;
const WILD_SPRITE_SHIFT_RIGHT_PX = 0;

function symbolFit(alias: string): number {
  return alias === 'sym-wild' ? WILD_SYMBOL_FIT : SYMBOL_FIT;
}

function symbolXShift(alias: string): number {
  return alias === 'sym-wild' ? WILD_SPRITE_SHIFT_RIGHT_PX : 0;
}

export function createSymbolSprite(alias: string, cw: number, ch: number): SlotSymbol {
  const container = new Container();
  const sprite = new Sprite(resolveSymbolTexture(alias));
  fitSprite(sprite, cw, ch, symbolFit(alias), symbolXShift(alias));
  container.addChild(sprite);
  return { container, sprite, alias };
}

export function fitSprite(
  sprite: Sprite,
  cw: number,
  ch: number,
  fit = SYMBOL_FIT,
  xShift = 0,
): void {
  sprite.anchor.set(0.5);
  sprite.x = cw / 2 + xShift;
  sprite.y = ch / 2;
  const tw = sprite.texture.width || 1;
  const th = sprite.texture.height || 1;
  sprite.scale.set(Math.min((cw * fit) / tw, (ch * fit) / th));
}

export function updateSymbol(sym: SlotSymbol, alias: string, cw: number, ch: number): void {
  sym.sprite.texture = resolveSymbolTexture(alias);
  fitSprite(sym.sprite, cw, ch, symbolFit(alias), symbolXShift(alias));
  sym.alias = alias;
}

export const INACTIVE_SYMBOL_ALPHA = 0.35;

export function setSlotSymbolDimmed(sym: SlotSymbol | undefined, dimmed: boolean): void {
  if (!sym) return;
  sym.sprite.alpha = dimmed ? INACTIVE_SYMBOL_ALPHA : 1;
}

export function setSlotSymbolVisibility(sym: SlotSymbol | undefined, visible: boolean): void {
  if (!sym) return;
  sym.container.visible = visible;
  sym.sprite.visible = visible;
  if (visible) sym.sprite.alpha = 1;
}
