import { Assets, Container, Graphics, Sprite, Rectangle, Texture, Text, type Ticker } from 'pixi.js';
import plaqueUrl from '@/assets/big-win/lost-idol-plaque.webp?url';
import glyphUrl from '@/assets/big-win/lost-idol-glyphs.webp?url';
import { formatBigWinAmount, type BigWinAnimationName } from './bigWinSpine';

export const loadLostIdolBigWin = () => Assets.load([plaqueUrl, glyphUrl]);

import { glyphRegions as glyphs } from '@/assets/big-win/glyphRegions';
function createGlyphTitle(text: string, maxWidth: number): Container {
  const line = new Container();
  const source = Assets.get<Texture>(glyphUrl).source;
  let x = 0;
  for (const char of text) {
    if (char === ' ') { x += 45; continue; }
    const [left, top, width, height] = glyphs[char];
    const sprite = new Sprite(new Texture({ source, frame: new Rectangle(left, top, width, height) }));
    sprite.position.set(x, 0);
    line.addChild(sprite);
    x += width + 3;
  }
  const scale = Math.min(0.85, maxWidth / x);
  line.scale.set(scale);
  line.pivot.set(x / 2, 72);
  return line;
}

/** Reuses atlas textures and sprites while the payout counts up. */
class GlyphAmountLabel extends Container {
  private value = '';
  private textures = new Map<string, Texture>();
  private characters: (Sprite | Text)[] = [];

  constructor() {
    super();
    this.once('destroyed', () => {
      this.textures.forEach(texture => texture.destroy(false));
      this.textures.clear();
    });
  }

  get text() { return this.value; }
  set text(value: string) {
    if (value === this.value) return;
    this.value = value;
    let x = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      const region = glyphs[char];
      let child: Sprite | Text | undefined = this.characters[i];
      if (child && (Boolean(region) !== (child instanceof Sprite))) {
        child.destroy();
        child = undefined;
      }
      if (region) {
        let texture = this.textures.get(char);
        if (!texture) {
          texture = new Texture({ source: Assets.get<Texture>(glyphUrl).source,
            frame: new Rectangle(...region) });
          this.textures.set(char, texture);
        }
        if (!child) child = this.addChild(new Sprite(texture));
        (child as Sprite).texture = texture;
      } else {
        // Currency symbols not present in the atlas retain their original meaning.
        if (!child) child = this.addChild(new Text({ text: char, style: {
          fontFamily: 'Arial, sans-serif', fontSize: 130, fontWeight: 'bold',
          fill: '#f4d17e', stroke: { color: '#49331b', width: 3 },
        } }));
        (child as Text).text = char;
      }
      this.characters[i] = child;
      child.visible = true;
      child.position.set(x, 0);
      x += child.width + 3;
    }
    for (let i = value.length; i < this.characters.length; i++) this.characters[i].visible = false;
    this.pivot.set(Math.max(0, x - 3) / 2, 72);
  }
}

export function createLostIdolBigWin(tier: BigWinAnimationName, ticker: Ticker, width: number, height: number, amount: number, currency: string, precision: number) {
  const root = new Container();
  const panel = new Container();
  panel.position.set(width / 2, height / 2);
  root.addChild(panel);
  const art = Sprite.from(plaqueUrl);
  art.anchor.set(0.5);
  art.width = width * 0.85;
  art.height = art.width * art.texture.height / art.texture.width;
  panel.addChild(art);
  const title = createGlyphTitle(`${tier.toUpperCase()} WIN`, width * 0.51);
  title.y = -height * 0.085;
  panel.addChild(title);
  const amountLabel = new GlyphAmountLabel();
  amountLabel.y = height * 0.045;
  amountLabel.text = formatBigWinAmount(amount, precision, currency);
  // Fix the scale using the final payout so digits do not grow/shrink during counting.
  amountLabel.scale.set(Math.min(92 / 144, width * 0.48 / amountLabel.width));
  panel.addChild(amountLabel);
  // Gem centers in the generated plaque, normalized to the full artwork.
  const gemPositions = [[0.5, 0.16, 1.3], [0.14, 0.416, 0.8], [0.86, 0.416, 0.8], [0.5, 0.754, 0.75]];
  const gems = gemPositions.map(([x, y, size]) => {
    const glow = new Container();
    glow.position.set((x - 0.5) * art.width, (y - 0.5) * art.height);
    const halo = new Graphics();
    const radius = art.width * 0.047 * size;
    for (let ring = 12; ring >= 1; ring--) {
      halo.circle(0, 0, radius * ring / 12).fill({ color: 0x42ff9a, alpha: 0.025 });
    }
    halo.blendMode = 'add';
    const glint = new Graphics()
      .poly([0, -radius * 0.55, radius * 0.055, -radius * 0.07, radius * 0.4, 0,
        radius * 0.055, radius * 0.07, 0, radius * 0.55, -radius * 0.055, radius * 0.07,
        -radius * 0.4, 0, -radius * 0.055, -radius * 0.07])
      .fill({ color: 0xe1ffbc, alpha: 0.95 });
    glint.blendMode = 'add';
    glint.position.set(-radius * 0.12, -radius * 0.18);
    glow.addChild(halo, glint);
    panel.addChild(glow);
    return { halo, glint };
  });
  const titleScale = title.scale.x;
  const intensity = tier === 'super' ? 1.35 : tier === 'mega' ? 1.15 : 1;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let elapsed = 0;
  const animate = () => {
    elapsed += ticker.deltaMS;
    const progress = reduced ? 1 : Math.min(1, elapsed / 650);
    root.alpha = progress;
    // Overshoot on entry, then a slower celebratory pulse.
    const overshoot = 1 + 2.70158 * (progress - 1) ** 3 + 1.70158 * (progress - 1) ** 2;
    panel.scale.set(reduced ? 1 : 0.72 + 0.28 * overshoot + Math.sin(elapsed / 440) * 0.012 * intensity * progress);
    title.scale.set(titleScale * (reduced ? 1 : 1 + Math.sin(elapsed / 330) * 0.025 * intensity * progress));
    gems.forEach(({ halo, glint }, index) => {
      const phase = elapsed / 520 - index * 1.3;
      const pulse = (Math.sin(phase) + 1) / 2;
      halo.alpha = reduced ? 0.55 : 0.45 + pulse * 0.55;
      halo.scale.set(reduced ? 1 : 0.85 + pulse * 0.3);
      glint.alpha = reduced ? 0.25 : Math.pow(pulse, 5) * 0.9;
      glint.rotation = reduced ? 0 : Math.sin(elapsed / 1100 + index) * 0.22;
    });
  };
  ticker.add(animate);
  root.once('destroyed', () => ticker.remove(animate));
  animate();
  return { root, amountLabel };
}
