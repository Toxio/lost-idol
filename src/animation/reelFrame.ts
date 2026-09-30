import { Assets, Container, Graphics, NineSliceSprite } from 'pixi.js';

import frameUrl from '@/assets/reel/lost-idol-frame.webp?url';

export function ensureReelFrameLoaded(): Promise<unknown> {
  return Assets.load(frameUrl);
}

/** Preserve the carved corners while fitting the frame around the 5×3 grid. */
export function createReelFrame(width: number, height: number): Container {
  const frame = new Container();
  const backing = new Graphics()
    .roundRect(100, 65, width - 200, height - 130, 24)
    .fill({ color: 0x101c12, alpha: 0.94 });
  const border = new NineSliceSprite({
    texture: Assets.get(frameUrl),
    leftWidth: 170,
    rightWidth: 170,
    topHeight: 110,
    bottomHeight: 100,
    width,
    height,
  });
  frame.addChild(backing, border);
  return frame;
}
