import { useEffect, useRef, type CSSProperties } from 'react';
import { playMonkeyJump } from '@/audio/soundManager';
import stoneSheet from '@/assets/symbols/lost-idol/multiplier-stone/sheet.webp';
import type { CollectorAction } from '../player/bookEvents';
import { REEL_GRID } from '../reels/constants';
import monkeyIdle from '@/assets/symbols/lost-idol/monkey/monkey-wait-v4.webp';
import monkey from '@/assets/symbols/lost-idol/monkey/monkey-current.webp';
import './CollectorOverlay.css';
import { WildMultiplier } from './WildMultiplier';
import { CollectorSmoke } from './CollectorSmoke';
import { collectorJumps } from '../player/collectorTransition';

const x = (reel: number) => `${(REEL_GRID.x + (reel + 0.5) * REEL_GRID.w / 5) * 100}%`;
const y = (row: number) => `${(REEL_GRID.y + (row + 0.5) * REEL_GRID.h / 3) * 100}%`;

export function CollectorOverlay({ action, moving, spinning }: { action: CollectorAction; moving: boolean; spinning: boolean }) {
  const position = action.wild;
  const jumping = moving && collectorJumps(action);
  const wasJumping = useRef(false);
  useEffect(() => {
    if (jumping && !wasJumping.current) playMonkeyJump();
    wasJumping.current = jumping;
  }, [jumping]);
  const collecting = Boolean(action.stone && action.wild.multiplier > action.from.multiplier);
  const collected = !moving && collecting;
  const smokeStyle = (cell: { reel: number; row: number }): CSSProperties => ({
    left: x(cell.reel), top: y(cell.row), width: `${REEL_GRID.w / 5 * 140}%`,
    height: `${REEL_GRID.h / 3 * 140}%`,
  });
  const style = {
    '--from-x': x(action.from.reel), '--from-y': y(action.from.row),
    '--to-x': x(action.wild.reel), '--to-y': y(action.wild.row),
    width: `${REEL_GRID.w / 5 * 82}%`, height: `${REEL_GRID.h / 3 * 82}%`,
    left: x(position.reel), top: y(position.row),
  } as CSSProperties;
  return <div className="smp-collector-layer" aria-label={`Wild multiplier ${action.wild.multiplier}`}>
    {jumping && collecting && action.stone && <div
      key={`stone-${action.stone.reel}-${action.stone.row}-${action.respin}`}
      className="smp-collector-stone" aria-label="+1"
      style={{ left: x(action.stone.reel), top: y(action.stone.row), width: `${REEL_GRID.w / 5 * 65}%` }}>
      <div className="smp-collector-stone__sprite" style={{ backgroundImage: `url(${stoneSheet})` }} />
      <strong>+1</strong>
    </div>}
    {jumping && <>
      <CollectorSmoke style={smokeStyle(action.from)} />
      <CollectorSmoke style={smokeStyle(action.wild)} delay={80} />
    </>}
    <div className={`smp-collector-monkey${jumping ? ' is-moving' : ''}${collected ? ' just-collected' : ''}`} style={style}>
      {(moving || spinning) && <div key={jumping ? `jump-${action.from.reel}-${action.from.row}-${action.wild.reel}-${action.wild.row}-${action.respin}` : "idle"} aria-hidden="true" className="smp-collector-monkey-sprite" style={{ backgroundImage: `url(${jumping ? monkey : monkeyIdle})` }} />}
      {collected && <span className="smp-collector-gain">+1</span>}
      <WildMultiplier value={moving ? action.from.multiplier : action.wild.multiplier} />
    </div>
  </div>;
}
