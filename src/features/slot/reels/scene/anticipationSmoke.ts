import { BlurFilter, Container, Graphics } from 'pixi.js';

/** Continuous soft ribbons: density and turbulence travel around a closed perimeter. */
export class AnticipationSmoke extends Container {
  private columns: Graphics[] = [];
  private haze = new BlurFilter({ strength: 2, quality: 3 });
  private cellW: number;
  private frameHeight: number;

  constructor(count: number, cellW: number, height: number) {
    super();
    this.cellW = cellW;
    this.frameHeight = height;
    this.eventMode = 'none';

    for (let col = 0; col < count; col++) {
      const column = new Graphics();
      column.filters = [this.haze];
      column.x = col * cellW;
      column.visible = false;
      this.addChild(column);
      this.columns.push(column);
    }
  }

  update(timeMs: number, spinningColumns: Set<number>) {
    this.visible = spinningColumns.size > 0;
    this.columns.forEach((column, col) => {
      column.visible = spinningColumns.has(col);
      if (!column.visible) return;
      column.clear();
      const w = this.cellW - 30, h = this.frameHeight - 30, r = 22;
      const horizontal = w - 2 * r, vertical = h - 2 * r, arc = Math.PI * r / 2;
      const lengths = [horizontal, arc, vertical, arc, horizontal, arc, vertical, arc];
      const perimeter = lengths.reduce((sum, value) => sum + value, 0);
      const point = (fraction: number) => {
        let d = fraction * perimeter;
        let segment = 0;
        while (segment < 7 && d > lengths[segment]) d -= lengths[segment++];
        const t = d / lengths[segment];
        if (segment === 0) return [15 + r + d, 15, 0, -1];
        if (segment === 2) return [15 + w, 15 + r + d, 1, 0];
        if (segment === 4) return [15 + w - r - d, 15 + h, 0, 1];
        if (segment === 6) return [15, 15 + h - r - d, -1, 0];
        const corner = (segment - 1) / 2;
        const angle = -Math.PI / 2 + (corner + t) * Math.PI / 2;
        const cx = corner < 2 ? 15 + w - r : 15 + r;
        const cy = corner === 0 || corner === 3 ? 15 + r : 15 + h - r;
        return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, Math.cos(angle), Math.sin(angle)];
      };
      const travel = timeMs / 3600;
      // Continuous variable-width veils, with fine folds inside a soft outer halo.
      // Integer spatial frequencies keep both ends of the perimeter seamless.
      for (let layer = 0; layer < 10; layer++) {
        const outer: number[] = [], inner: number[] = [];
        for (let i = 0; i <= 240; i++) {
          const fraction = i / 240;
          const [x, y, nx, ny] = point(fraction);
          const phase = (fraction - travel) * Math.PI * 2;
          const curl = phase * 5 + Math.sin(phase * 3 + timeMs / 1700) * 1.4;
          const drift = Math.sin(curl + layer * 0.47) * 6
            + Math.sin(phase * 13 - layer * 0.8 + timeMs / 2100) * 2.5
            + (layer - 4.5) * 1.5;
          const density = 0.5 + 0.25 * Math.sin(phase * 4 + layer)
            + 0.25 * Math.sin(phase * 9 - layer * 0.65);
          const halfWidth = layer < 3 ? 15 - layer * 3 + density * 5 : 1.1 + density * 3.5;
          outer.push(x + nx * (drift + halfWidth), y + ny * (drift + halfWidth));
          inner.push(x + nx * (drift - halfWidth), y + ny * (drift - halfWidth));
        }
        for (let i = inner.length - 2; i >= 0; i -= 2) outer.push(inner[i], inner[i + 1]);
        column.poly(outer).fill({
          color: layer < 3 ? 0x137448 : layer < 7 ? 0x2bcf80 : 0x9bf1bc,
          alpha: layer < 3 ? 0.12 : layer < 7 ? 0.15 : 0.19,
        });
      }
    });
  }

  dispose() {
    for (const column of this.columns) column.filters = null;
    this.haze.destroy();
    this.destroy({ children: true });
  }
}
