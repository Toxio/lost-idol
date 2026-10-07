import door from '@/assets/bonus-buy/game-door-5.webp';
import door10 from '@/assets/bonus-buy/game-door-10.webp';
import door15 from '@/assets/bonus-buy/game-door-15.webp';
import './BonusDoorArtwork.css';

export function BonusDoorArtwork({ spins }: { spins: number }) {
  return <div className="bonus-door-art" aria-hidden="true">
    <img src={spins >= 15 ? door15 : spins >= 10 ? door10 : door} alt="" draggable={false} />
  </div>;
}
