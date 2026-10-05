import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import type { Plugin } from 'vite';

type Pool = { totalWeight: number; entries: { weight: number; book: unknown }[] };

/** Dev-only preview: generated math stays outside the frontend bundle. */
export function calibratedMath(): Plugin {
  const cache = new Map<string, Promise<Pool>>();
  const modes = new Set(['base', 'bonus_5', 'bonus_10', 'bonus_15', 'wild_spin']);
  return {
    name: 'calibrated-math-preview',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__calibrated-math', async (req, res) => {
        const mode = new URL(req.url ?? '/', 'http://localhost').searchParams.get('mode') ?? 'base';
        if (!modes.has(mode)) { res.statusCode = 400; res.end(); return; }
        try {
          let loading = cache.get(mode);
          if (!loading) {
            const file = path.resolve(server.config.root, '../math-sdk/games/lost_idol/library/calibrated_preview', `${mode}.json.gz`);
            loading = readFile(file).then(bytes => JSON.parse(gunzipSync(bytes).toString()) as Pool);
            cache.set(mode, loading);
          }
          const pool = await loading;
          const total = BigInt(pool.totalWeight);
          const limit = (1n << 64n) - (1n << 64n) % total;
          let draw: bigint;
          do { draw = randomBytes(8).readBigUInt64LE(); } while (draw >= limit);
          let ticket = Number(draw % total);
          const selected = pool.entries.find(entry => { ticket -= entry.weight; return ticket < 0; });
          if (!selected) throw new Error('Invalid preview weights');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify(selected.book));
        } catch {
          cache.delete(mode);
          res.statusCode = 503;
          res.end('Generate and calibrate the local math library first.');
        }
      });
    },
  };
}
