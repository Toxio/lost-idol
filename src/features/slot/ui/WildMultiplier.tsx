import { formatTrimmedAmount, formatMoney } from '@/utils/currency';
import glyphs from '@/assets/big-win/lost-idol-glyphs.webp';

import { glyphRegions as regions, GLYPH_ATLAS_WIDTH, GLYPH_ATLAS_HEIGHT } from '@/assets/big-win/glyphRegions';

export function GameNumberGlyphs({ text, className, label = text }: { text: string; className?: string; label?: string }) {
  return <span className={className} role="img" aria-label={label}>
    {[...text].map((char, index) => {
      if (char === ' ') return <span key={index} aria-hidden="true" style={{ flex: '0 0 0.4em' }} />;
      const region = regions[char];
      if (!region) return null;
      const [x, y, width, height] = region;
      return <svg key={index} viewBox={`${x} ${y} ${width} ${height}`} aria-hidden="true" style={{ aspectRatio: `${width}/${height}` }}>
        <image href={glyphs} width={GLYPH_ATLAS_WIDTH} height={GLYPH_ATLAS_HEIGHT} />
      </svg>;
    })}
  </span>;
}

export function WildMultiplier({ value }: { value: number }) {
  return <GameNumberGlyphs text={`X${value}`} className="smp-wild-glyphs" label={`×${value}`} />;
}

export function GameMoneyGlyphs({ value, currency, precision }: { value: number; currency: string; precision: number }) {
  const amount = formatTrimmedAmount(value, precision).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  return <span className="treasury-money" role="img" aria-label={formatMoney(value, currency, precision)}>
    <GameNumberGlyphs className="treasury-reward-glyphs" text={amount} />
  </span>;
}
