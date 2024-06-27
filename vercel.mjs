// based on
// https://github.com/hi-ogawa/vite-plugins/blob/9e2cfc8770344c322f78523237d4b6e9266b9da0/packages/react-server/examples/basic/misc/vercel/build.js#L50-L58

import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import * as esbuild from "esbuild";

const buildDir = join(import.meta.dirname, "dist");
const outDir = join(import.meta.dirname, ".vercel/output");

const configJson = {
  version: 3,
  trailingSlash: false,
  routes: [
    {
      src: "^/assets/(.*)$",
      headers: {
        "cache-control": "public, immutable, max-age=31536000",
      },
    },
    {
      handle: "filesystem",
    },
    {
      src: ".*",
      dest: "/",
    },
  ],
};

const vcConfigJson = {
  runtime: "nodejs20.x",
  handler: "index.js",
};

async function main() {
  // clean
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  // config
  await writeFile(
    join(outDir, "config.json"),
    JSON.stringify(configJson, null, 2),
  );

  // static
  await mkdir(join(outDir, "static"), { recursive: true });
  await cp(join(buildDir, "client"), join(outDir, "static"), {
    recursive: true,
  });

  // function
  await mkdir(join(outDir, "functions/index.func"), { recursive: true });
  await writeFile(
    join(outDir, "functions/index.func/.vc-config.json"),
    JSON.stringify(vcConfigJson, null, 2),
  );

  // bundle function
  const result = await esbuild.build({
    entryPoints: [join(buildDir, "server/index.js")],
    outfile: join(outDir, "functions/index.func/index.js"),
    metafile: true,
    bundle: true,
    minify: true,
    format: "esm",
    platform: "node",
    define: {
      "process.env.NODE_ENV": `"production"`,
    },
    logOverride: {
      "ignored-bare-import": "silent",
    },
  });
  await writeFile(
    join(outDir, "esbuild-metafile.json"),
    JSON.stringify(result.metafile),
  );
}

main();
