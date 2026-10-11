/** Two matching feature symbols on revealed reels; never inspect unrevealed columns. */
export function anticipationSymbol(matrix: number[][], settled: Set<number>): number | null {
  for (const symbol of [10, 11]) {
    let count = 0;
    for (const col of settled) count += (matrix[col] ?? []).filter(value => value === symbol).length;
    if (count >= 2) return symbol;
  }
  // Treasury needs one chest on each of reels 2–4. Anticipate only while
  // reel 4 can still complete that combination, not after it has missed.
  if (settled.has(1) && settled.has(2) && !settled.has(3)
    && matrix[1]?.includes(2) && matrix[2]?.includes(2)) return 2;
  return null;
}

/** Continuous velocity: gentle speed change, sustained spin, then an extended linear brake. */
export function anticipationLanding(from: number, velocity: number, targetVelocity: number, order: number, reelSize: number) {
  const ramp = 550, brake = 3800;
  // Each next reel cruises through the previous reel's entire brake and landing,
  // then holds for another second before starting its own full deceleration.
  const landingMs = 200, holdAfterLandingMs = 1000;
  const cruise = 1000 + order * (brake + landingMs + holdAfterLandingMs);
  const duration = ramp + cruise + brake;
  const desired = velocity * ramp / 2 + targetVelocity * (ramp / 2 + cruise + brake / 2);
  const to = Math.ceil((from + desired) / reelSize) * reelSize;
  const distance = to - from;
  const peak = (distance - velocity * ramp / 2) / (ramp / 2 + cruise + brake / 2);
  const rampDistance = (velocity + peak) * ramp / 2;
  const ease = (phase: number) => {
    const time = Math.max(0, Math.min(1, phase)) * duration;
    if (time < ramp) return (velocity * time + (peak - velocity) * time * time / (2 * ramp)) / distance;
    if (time < ramp + cruise) return (rampDistance + peak * (time - ramp)) / distance;
    const t = time - ramp - cruise;
    return (rampDistance + peak * cruise + peak * (t - t * t / (2 * brake))) / distance;
  };
  return { to, duration, ease, brakeStartMs: ramp + cruise };
}
