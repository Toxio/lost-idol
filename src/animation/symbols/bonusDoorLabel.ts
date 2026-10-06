import { Text } from 'pixi.js';

/** Fixed to the door artwork, independent of its opening animation. */
export function createBonusDoorLabel(): Text {
  const label = new Text({
    text: 'BONUS',
    style: {
      fontFamily: 'Georgia, serif',
      fontSize: 30,
      fontWeight: 'bold',
      fill: '#ffe6a0',
      stroke: { color: '#173524', width: 5 },
      letterSpacing: 2,
    },
    resolution: 2,
  });
  label.anchor.set(0.5);
  label.position.set(0, 102);
  label.eventMode = 'none';
  return label;
}
