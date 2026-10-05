import glyphs from '@/assets/big-win/lost-idol-glyphs.webp';

const regions: Record<string, [number, number, number, number]> = {
  X: [709, 326, 139, 143],
  '0': [30, 477, 134, 138], '1': [178, 477, 91, 138],
  '2': [292, 477, 121, 138], '3': [430, 477, 118, 138],
  '4': [558, 477, 130, 138], '5': [701, 477, 113, 138],
  '6': [827, 477, 122, 138], '7': [963, 477, 107, 138],
  '8': [1079, 477, 128, 138], '9': [1215, 477, 130, 138],
};

export function WildMultiplier({ value }: { value: number }) {
  return <span className="smp-wild-glyphs" aria-label={`×${value}`}>
    {[...`X${value}`].map((char, index) => {
      const [x, y, width, height] = regions[char];
      return <svg key={index} viewBox={`${x} ${y} ${width} ${height}`} aria-hidden="true" style={{ aspectRatio: `${width}/${height}` }}>
        <image href={glyphs} width="1371" height="771" />
      </svg>;
    })}
  </span>;
}
