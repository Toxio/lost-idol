import { useEffect, useRef } from 'react';
import desktopPoster from '@/assets/background/bonus-desktop.webp';
import mobilePoster from '@/assets/background/bonus-mobile.webp';

/** Continuous foreground motion over the existing artwork, with no video seam. */
export function BonusAmbient({ portrait }: { portrait: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const width = portrait ? 770 : 1371;
    const height = portrait ? 1371 : 770;
    let elapsed = 0, previous = 0, request = 0;
    let scale = 1, offsetX = 0, offsetY = 0, dpr = 1;
    // Perspective-aligned channels within the gold heaps, behind the stone walkway.
    const pilePaths = portrait ? [
      [[40, 871], [88, 915], [145, 954]],
      [[138, 887], [178, 917], [226, 940]],
      [[719, 886], [674, 929], [622, 958]],
      [[620, 900], [575, 922], [532, 943]],
    ] : [
      [[100, 458], [182, 513], [286, 586]],
      [[278, 485], [343, 512], [415, 549]],
      [[1274, 492], [1195, 546], [1114, 603]],
      [[1072, 490], [1009, 525], [930, 551]],
    ];
    const pilePolygons = portrait ? [
      [[32, 858], [96, 870], [162, 940], [177, 962], [104, 992], [35, 946]],
      [[132, 872], [234, 915], [269, 927], [219, 948], [169, 925]],
      [[727, 871], [692, 883], [611, 945], [593, 965], [665, 989], [724, 950]],
      [[625, 890], [534, 923], [504, 935], [553, 953], [607, 932]],
    ] : [
      [[82, 445], [157, 461], [267, 538], [327, 579], [290, 607], [169, 569], [89, 499]],
      [[270, 472], [351, 494], [458, 541], [404, 564], [338, 536], [285, 508]],
      [[1291, 470], [1217, 485], [1139, 548], [1064, 602], [1118, 626], [1241, 552]],
      [[1088, 479], [1031, 491], [918, 538], [891, 551], [953, 569], [1030, 529]],
    ];
    const pileClip = new Path2D();
    for (const polygon of pilePolygons) {
      pileClip.moveTo(polygon[0][0], polygon[0][1]);
      for (const [x, y] of polygon.slice(1)) pileClip.lineTo(x, y);
      pileClip.closePath();
    }
    const coins = Array.from({ length: portrait ? 40 : 56 }, (_, i) => ({
      phase: (i * 0.61803398875) % 1,
      duration: 3.2 + (i % 6) * 0.31,
      path: pilePaths[i % pilePaths.length],
      offset: Math.sin(i * 2.4) * (portrait ? 5 : 9),
      radius: (portrait ? 3 : 4) + (i % 4) * 0.85,
    }));
    const coinTexture = document.createElement('canvas');
    coinTexture.width = coinTexture.height = 64;
    const artwork = new Image();
    const waterMask = document.createElement('canvas');
    const water = document.createElement('canvas');
    waterMask.width = water.width = width;
    waterMask.height = water.height = height;
    const maskCtx = waterMask.getContext('2d');
    const waterCtx = water.getContext('2d');
    let artworkReady = false;
    artwork.onload = () => {
      const coinCtx = coinTexture.getContext('2d');
      if (coinCtx) {
        coinCtx.save();
        coinCtx.beginPath(); coinCtx.ellipse(32, 32, 29, 23, 0, 0, Math.PI * 2); coinCtx.clip();
        // Existing foreground coin: preserve the painted rim, shading and palette.
        const crop = portrait ? [281, 1065, 26, 25] : [514, 735, 35, 31];
        coinCtx.drawImage(artwork, crop[0], crop[1], crop[2], crop[3], 0, 0, 64, 64);
        coinCtx.restore();
      }
      if (!maskCtx) return;
      maskCtx.drawImage(artwork, 0, 0, width, height);
      const pixels = maskCtx.getImageData(0, 0, width, height);
      const top = portrait ? 925 : 535;
      for (let y = 0; y < height; y++) {
        const spread = (portrait ? 190 : 110) + Math.max(0, y - top) * 1.5;
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const r = pixels.data[i], g = pixels.data[i + 1], b = pixels.data[i + 2];
          // Only green water within the pool: exclude gold, stone and foreground plants.
          const inside = y > top && Math.abs(x - width / 2) < spread
            && x > width * 0.2 && x < width * 0.8;
          pixels.data[i + 3] = inside ? Math.max(0, Math.min(180, (g - Math.max(r, b) - 12) * 5)) : 0;
        }
      }
      maskCtx.putImageData(pixels, 0, 0);
      artworkReady = true;
    };
    artwork.src = portrait ? mobilePoster : desktopPoster;
    // Pre-render soft, irregular wisps once rather than blurring full-screen each frame.
    const smoke = document.createElement('canvas');
    smoke.width = smoke.height = 192;
    const smokeCtx = smoke.getContext('2d');
    if (smokeCtx) {
      for (let i = 0; i < 7; i++) {
        const x = 96 + Math.sin(i * 2.4) * 34;
        const y = 96 + Math.cos(i * 1.7) * 32;
        const mist = smokeCtx.createRadialGradient(x, y, 0, x, y, 54);
        mist.addColorStop(0, 'rgba(35,220,111,0.22)');
        mist.addColorStop(0.45, 'rgba(18,175,91,0.12)');
        mist.addColorStop(1, 'rgba(12,120,75,0)');
        smokeCtx.fillStyle = mist;
        smokeCtx.fillRect(x - 54, y - 54, 108, 108);
      }
    }
    const wisps = Array.from({ length: 24 }, (_, i) => ({
      side: i % 2 ? 1 : -1,
      phase: (i * 0.61803398875) % 1,
      duration: 6 + (i % 5) * 0.7,
      lane: (i % 4) / 3,
    }));
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      scale = Math.max(rect.width / width, rect.height / height);
      offsetX = (rect.width - width * scale) / 2;
      offsetY = (rect.height - height * scale) / 2;
    };
    const draw = (now: number) => {
      request = 0;
      if (document.hidden || motion.matches) return;
      if (previous && now - previous < 1000 / 30) { request = requestAnimationFrame(draw); return; }
      elapsed += previous ? Math.min((now - previous) / 1000, 0.06) : 0;
      previous = now;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offsetX * dpr, offsetY * dpr);
      if (artworkReady) {
        if (waterCtx) {
          waterCtx.clearRect(0, 0, width, height);
          waterCtx.globalCompositeOperation = 'source-over';
          for (let i = 0; i < 30; i++) {
            const y = (portrait ? 1090 : 545) + i * (portrait ? 10 : 8);
            const x = width / 2 + Math.sin(i * 2.4 + elapsed * 0.45) * width * 0.24;
            waterCtx.strokeStyle = `rgba(174,255,122,${0.12 + 0.12 * Math.sin(elapsed * 1.6 + i)})`;
            waterCtx.lineWidth = 1.5 + i / 20;
            waterCtx.beginPath();
            waterCtx.ellipse(x, y, 20 + i * 2, 2.5, 0, 0, Math.PI);
            waterCtx.stroke();
          }
          waterCtx.globalCompositeOperation = 'destination-in';
          waterCtx.drawImage(waterMask, 0, 0);
          ctx.save(); ctx.globalCompositeOperation = 'screen';
          ctx.drawImage(water, 0, 0); ctx.restore();
        }
      }
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const wisp of wisps) {
        const p = (elapsed / wisp.duration + wisp.phase) % 1;
        const x = width / 2 + wisp.side * width * (0.19 + wisp.lane * 0.09)
          + Math.sin(p * 6 + wisp.phase * 8) * 22;
        const y = (portrait ? 945 : 550) - p * (portrait ? 230 : 245);
        const size = (portrait ? 100 : 140) * (0.7 + p * 0.8);
        ctx.globalAlpha = Math.sin(Math.PI * p) ** 2 * 0.55;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(wisp.side * (p * 0.65 + wisp.phase));
        ctx.drawImage(smoke, -size / 2, -size * 0.65, size, size * 1.3);
        ctx.restore();
      }
      ctx.restore();
      const medallionX = portrait ? 383 : 674;
      const medallionY = portrait ? 520 : 105;
      const radius = portrait ? 52 : 61;
      const pulse = (1 + Math.sin(elapsed * 2.1)) / 2;
      ctx.save();
      // Dark-to-light contrast stays visible even on the already bright gold core.
      const shade = ctx.createRadialGradient(medallionX, medallionY, 0, medallionX, medallionY, radius * 0.75);
      shade.addColorStop(0, `rgba(98,44,0,${0.38 * (1 - pulse)})`);
      shade.addColorStop(1, 'rgba(98,44,0,0)');
      ctx.fillStyle = shade;
      ctx.fillRect(medallionX - radius, medallionY - radius, radius * 2, radius * 2);
      ctx.globalCompositeOperation = 'screen';
      const medallionGlow = ctx.createRadialGradient(medallionX, medallionY, 2, medallionX, medallionY, radius);
      medallionGlow.addColorStop(0, `rgba(255,241,136,${0.08 + 0.72 * pulse})`);
      medallionGlow.addColorStop(0.55, `rgba(255,190,40,${0.04 + 0.3 * pulse})`);
      medallionGlow.addColorStop(1, 'rgba(255,170,20,0)');
      ctx.fillStyle = medallionGlow;
      ctx.fillRect(medallionX - radius, medallionY - radius, radius * 2, radius * 2);
      ctx.restore();
      const portalX = width * 0.49, portalY = height * (portrait ? 0.56 : 0.48);
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const glow = ctx.createRadialGradient(portalX, portalY, 0, portalX, portalY, width * 0.15);
      glow.addColorStop(0, `rgba(55,255,104,${0.07 + 0.045 * Math.sin(elapsed * 1.2)})`);
      glow.addColorStop(1, 'rgba(35,255,100,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(portalX - width * 0.15, portalY - width * 0.15, width * 0.3, width * 0.3);
      ctx.restore();
      if (artworkReady) {
        ctx.save();
        // The front edge of the piles is a hard occlusion boundary: coins cannot
        // draw over the stone walkway, pillars, pool slabs or foreground leaves.
        ctx.clip(pileClip);
        for (const coin of coins) {
          const p = (elapsed / coin.duration + coin.phase) % 1;
          const fall = Math.min(1, p / 0.76);
          const t = fall * fall;
          const [start, middle, end] = coin.path;
          const x = (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * middle[0] + t * t * end[0] + coin.offset;
          const y = (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * middle[1] + t * t * end[1];
          const landing = Math.max(0, (p - 0.76) / 0.24);
          const bounce = Math.sin(landing * Math.PI * 2) ** 2 * (1 - landing) * coin.radius * 0.65;
          const alpha = Math.min(1, p / 0.08, (1 - p) / 0.09);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = 'rgba(65,32,6,0.28)';
          ctx.beginPath(); ctx.ellipse(x + 1, y + coin.radius * 0.65, coin.radius, coin.radius * 0.25, 0, 0, Math.PI * 2); ctx.fill();
          ctx.translate(x, y - bounce);
          ctx.rotate(coin.phase * 3 + fall * 5);
          ctx.scale(0.45 + 0.55 * Math.abs(Math.cos(fall * 9 + coin.phase * 6)), 1);
          ctx.drawImage(coinTexture, -coin.radius, -coin.radius, coin.radius * 2, coin.radius * 2);
          ctx.restore();
        }
        ctx.restore();
      }
      request = requestAnimationFrame(draw);
    };
    const resume = () => {
      cancelAnimationFrame(request); previous = 0;
      if (!document.hidden && !motion.matches) request = requestAnimationFrame(draw);
      else if (motion.matches) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas); resize(); resume();
    document.addEventListener('visibilitychange', resume);
    motion.addEventListener('change', resume);
    return () => { artwork.onload = null; cancelAnimationFrame(request); observer.disconnect(); document.removeEventListener('visibilitychange', resume); motion.removeEventListener('change', resume); };
  }, [portrait]);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }} />;
}
