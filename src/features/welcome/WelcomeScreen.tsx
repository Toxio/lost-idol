import { useEffect, useRef } from 'react';
import { locale } from '@/utils/i18n';
import logo from '@/assets/logo/lost-idol.webp';
import portal from '@/assets/symbols/lost-idol/bonus-door/symbol.webp';
import chest from '@/assets/symbols/lost-idol/gold-satchel/symbol.webp';
import monkeyHero from '@/assets/bonus-buy/monkey-welcome-hd.png';
import './WelcomeScreen.css';
import { GameNumberGlyphs } from '../slot/ui/WildMultiplier';

function PromoText({ text }: { text: string }) {
  if (locale !== 'en') return <>{text}</>;
  return <span className="welcome-art-text">{text.split(' ').map((word, i) => <GameNumberGlyphs key={i} text={word.replaceAll('×', 'X')} className="welcome-word" />)}</span>;
}

export function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  const button = useRef<HTMLButtonElement>(null);
  const ru = locale === 'ru';
  useEffect(() => {
    button.current?.focus();
    const proceed = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || ['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Escape'].includes(event.key)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onContinue();
    };
    window.addEventListener('keydown', proceed, true);
    return () => window.removeEventListener('keydown', proceed, true);
  }, [onContinue]);
  return <section className="welcome-screen" aria-label="Lost Idol" onClick={(event) => { event.stopPropagation(); onContinue(); }}>
    <img className="welcome-logo" src={logo} alt="Lost Idol" />
    <div className="welcome-features">
      <article className="welcome-feature">
        <h2><PromoText text={ru ? 'ОТКРОЙ ХРАМ' : 'UNLOCK THE TEMPLE'} /></h2>
        <p>5 / 10 / 15 <span>{ru ? 'ФРИ-СПИНОВ' : 'FREE SPINS'}</span></p>
        <img src={portal} alt="" />
      </article>
      <article className="welcome-feature welcome-feature--hero">
        <h2><PromoText text={ru ? 'МАКСИМАЛЬНЫЙ ВЫИГРЫШ' : 'MAX WIN'} /></h2>
        <p className="welcome-max"><PromoText text="5000×" /></p>
        <img className="welcome-monkey" src={monkeyHero} alt="" />
        <span className="welcome-caption">{ru ? 'ПРЫГАЮЩИЙ WILD ДО ×20' : 'JUMPING WILD UP TO ×20'}</span>
      </article>
      <article className="welcome-feature">
        <h2><PromoText text={ru ? 'СОКРОВИЩНИЦА' : 'TREASURY'} /></h2>
        <p>{ru ? 'ОТКРОЙ 3 ИЗ 6 СУНДУКОВ' : 'OPEN 3 OF 6 CHESTS'}</p>
        <img src={chest} alt="" />
      </article>
    </div>
    <button ref={button} className="welcome-continue" onClick={(event) => { event.stopPropagation(); onContinue(); }}>
      <span className="welcome-keyboard"><PromoText text={ru ? 'НАЖМИ, ЧТОБЫ ПРОДОЛЖИТЬ' : 'PRESS TO CONTINUE'} /></span>
      <span className="welcome-touch"><PromoText text={ru ? 'КОСНИСЬ, ЧТОБЫ ПРОДОЛЖИТЬ' : 'TAP TO CONTINUE'} /></span>
    </button>
  </section>;
}
