import path from "path";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import JavaScriptObfuscator from "javascript-obfuscator";

// Obfuscate ONLY our own application chunks, as the very last build step.
//
// Why a custom plugin instead of vite-plugin-javascript-obfuscator: that plugin
// runs in a per-module `transform` (before bundling). Under Vite 8 / Rolldown the
// minifier runs afterwards and reverses the obfuscation (renames the _0x* ids back
// to e/t/n and collapses the encrypted string arrays). So it must run AFTER minify.
//
// `generateBundle` is the last hook — by then every chunk is fully minified, so the
// obfuscation survives. We only touch chunks that contain our own `/src` modules;
// the heavy vendor chunks (pixi / spine — see manualChunks below) are left
// minified-only so animation/runtime performance is untouched.
function obfuscateAppChunks(): Plugin {
  return {
    name: "obfuscate-app-chunks",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== "chunk") continue;
        const ids = file.moduleIds ?? Object.keys(file.modules ?? {});
        const ownsAppCode = ids.some(
          (id) => id.includes("/src/") && !id.includes("node_modules"),
        );
        if (!ownsAppCode) continue;

        file.code = JavaScriptObfuscator.obfuscate(file.code, {
          compact: true,
          simplify: true,
          identifierNamesGenerator: "hexadecimal",
          // Encrypt string literals (incl. the CRC secret) into a rotated/shuffled,
          // base64-encoded array.
          stringArray: true,
          stringArrayThreshold: 0.75,
          stringArrayEncoding: ["base64"],
          stringArrayRotate: true,
          stringArrayShuffle: true,
          // Kept OFF on purpose — these wreck performance / inflate the bundle and are
          // unsuitable for a 60 fps game. Dial up only if a section truly needs it.
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: false,
          selfDefending: false,
        }).getObfuscatedCode();
      }
    },
  };
}

// Pixi/Spine is a large, lazy-only chunk (it lives behind the dynamically-imported
// GameScreen). Rolldown still injects a high-priority `<head>` modulepreload for it,
// which front-loads ~850 kB competing with the splash first paint. The game already
// prefetches itself on mount (`void import('./GameScreen')`), so we drop the eager
// preload and let Pixi load at its natural lazy priority instead.
function dropEagerPixiPreload(): Plugin {
  return {
    name: "drop-eager-pixi-preload",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        /\s*<link[^>]+rel="modulepreload"[^>]+href="[^"]*\/pixi-[^"]*\.js"[^>]*>/g,
        "",
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command, mode, isPreview }) => ({
  // Compile-time gate: URL parameters cannot enable test tools in a release.
  define: {
    __TEST_TOOLS_ENABLED__: JSON.stringify(
      (command === "serve" && !isPreview) || mode === "test",
    ),
  },
  // ACP serves the built frontend from a hashed subpath, so all asset URLs must
  // be relative. Without this, /assets/*.js would 404 in the ACP player.
  base: "./",
  plugins: [react(), obfuscateAppChunks(), dropEagerPixiPreload()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: mode === "test" ? "dist-test" : "dist",
    // Oxc/Lightning CSS rewrites `(max-width: 600px)` to `(width<=600px)`.
    // Safari requires spaces around `<=`, so those @media rules are dropped in prod.
    cssMinify: "esbuild",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Full Oxc minification (Vite default) + strip every `console.*` call from
        // production chunks. Dev server is unaffected, so logs stay usable locally.
        minify: {
          mangle: true,
          compress: { dropConsole: true },
          codegen: true,
        },
        // Keep heavy vendor code OUT of our app chunks so it is never obfuscated.
        // pixi/spine live only in the lazy GameScreen graph, so `pixi` stays a lazy
        // chunk (no initial-load regression); react stays eager with the shell.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (
            /[\\/]node_modules[\\/](pixi\.js|@pixi|@esotericsoftware)[\\/]/.test(
              id,
            )
          )
            return "pixi";
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id))
            return "react";
          return "vendor";
        },
      },
    },
  },
}));
