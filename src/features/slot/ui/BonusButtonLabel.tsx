import { glyphRegions } from '@/assets/big-win/glyphRegions';
import { GameNumberGlyphs } from './WildMultiplier';

export function BonusButtonLabel({ text, stacked = false }: { text: string; stacked?: boolean }) {
  const normalized = text.toUpperCase().replaceAll('×', 'X');
  const useGlyphs = [...normalized].every(char => /\s/.test(char) || char in glyphRegions);
  const lines = stacked ? text.split(/\s+/) : [text];
  return <span className="smp-bonus-title">
    {lines.map((line, index) => <span className={stacked ? 'smp-desktop-button-line' : undefined} key={index}>
      {useGlyphs ? <GameNumberGlyphs text={line.toUpperCase().replace('×', 'X')} className="smp-bonus-title-glyphs" label={line} /> : line}
    </span>)}
  </span>;
}
