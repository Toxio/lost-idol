import { SetupPoseBoundsProvider, Spine } from '@esotericsoftware/spine-pixi-v8';
import { Assets, type Ticker } from 'pixi.js';

export type CreateSymbolSpineOptions = {
  ticker?: Ticker;
  loop?: boolean;
  animation?: string;
};

export interface SymbolSpineModule {
  skelAlias: string;
  atlasAlias: string;
  /** Register + load the skeleton and atlas once; safe to call repeatedly. */
  ensureLoaded: () => Promise<void>;
  create: (options?: CreateSymbolSpineOptions) => Spine;
  /** Static display pose for settled reel cells. */
  createSetupPose: () => Spine;
}

interface SymbolSpineConfig {
  /** Alias prefix; produces `<name>SymbolSpineJson` / `<name>SymbolSpineAtlas`. */
  name: string;
  jsonUrl: string;
  atlasUrl: string;
  /** Image file names referenced inside the .atlas, mapped to their bundled URLs. */
  images: Record<string, string>;
}

/**
 * All reel symbols ship the same Spine setup (skeleton json + atlas + one png,
 * a single `win` animation, SetupPose bounds). This factory owns the shared
 * register/load/create boilerplate; each symbol module only supplies its URLs.
 */
export function defineSymbolSpine(config: SymbolSpineConfig): SymbolSpineModule {
  const skelAlias = `${config.name}SymbolSpineJson`;
  const atlasAlias = `${config.name}SymbolSpineAtlas`;
  let loadPromise: Promise<void> | null = null;

  const ensureLoaded = (): Promise<void> => {
    if (!loadPromise) {
      Assets.add({ alias: skelAlias, src: config.jsonUrl });
      Assets.add({
        alias: atlasAlias,
        src: config.atlasUrl,
        parser: 'spineTextureAtlasLoader',
        data: { images: config.images },
      });
      loadPromise = Assets.load([skelAlias, atlasAlias]).then(() => undefined);
    }
    return loadPromise;
  };

  const create = (options?: CreateSymbolSpineOptions): Spine => {
    const spine = Spine.from({
      skeleton: skelAlias,
      atlas: atlasAlias,
      boundsProvider: new SetupPoseBoundsProvider(),
      ticker: options?.ticker,
    });
    spine.state.setAnimation(0, options?.animation ?? 'win', options?.loop ?? true);
    spine.update(0);
    return spine;
  };

  const createSetupPose = (): Spine => {
    const spine = Spine.from({
      skeleton: skelAlias,
      atlas: atlasAlias,
      boundsProvider: new SetupPoseBoundsProvider(),
    });
    spine.skeleton.setToSetupPose();
    spine.update(0);
    return spine;
  };

  return { skelAlias, atlasAlias, ensureLoaded, create, createSetupPose };
}
