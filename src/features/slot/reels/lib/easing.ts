export function lerp(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}

export function backout(amount: number): (t: number) => number {
  return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
}

/**
 * Two-phase decelerating ease with EXACT entry velocity match (no handoff jump).
 *
 * Given entry slope k = (spinVelocity * durationFrames) / distance:
 *   • Phase 1 (t ∈ [0, α]): constant slope k — reel keeps spin velocity, invisible handoff.
 *   • Phase 2 (t ∈ [α, 1]): slope drops linearly from k to 0 — smooth deceleration.
 *   where α = 2/k − 1, chosen so ease(1) = 1 exactly.
 *
 * Valid for k ∈ [1, 2] (covers all normal/fast presets). For k > 2 (impossible to decelerate
 * from k to 0 over unit distance without reversing) clamps to k=2 → pure linear decel; entry
 * mismatch shows as a mild brake, not an acceleration. For k < 1 (turbo edge case where the
 * tween must speed up to cover distance) falls back to a monotonically-decelerating cubic with
 * clamped slope 1.5; the resulting tiny speed-up at handoff is hidden by heavy motion blur.
 */
export function decelStop(k: number): (t: number) => number {
  if (k >= 2) {
    return (t: number) => t * (2 - t);
  }
  if (k >= 1) {
    const alpha = 2 / k - 1;
    const oneMinusAlpha = 1 - alpha;
    return (t: number) => {
      if (t <= alpha) return k * t;
      const dt = t - alpha;
      return k * alpha + k * dt * (1 - dt / (2 * oneMinusAlpha));
    };
  }
  const c = 1.5;
  const a = c - 2;
  const b = 3 - 2 * c;
  return (t: number) => ((a * t + b) * t + c) * t;
}
