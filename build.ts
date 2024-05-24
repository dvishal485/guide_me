import { $, Glob } from "bun";
import fs from "fs";
import manifest from "./public/manifest.json";

export async function build() {
  await $`bunx tsc && bunx vite build`;
  const glob = new Glob("dist/assets/*.js");
  const jsFiles = await Array.fromAsync(glob.scan());

  await Promise.all(
    jsFiles.map(async (jsFile) => {
      await $`bun build ${jsFile} --outfile ${jsFile}`;
    }),
  );

  await $`bunx rm -rf dist/assets/chunks`;

  if (import.meta.env.TARGET_CHROME === "true") {
    const new_manifest = {
      ...manifest,
      browser_specific_settings: undefined,
    };
    fs.writeFileSync(
      "dist/manifest.json",
      JSON.stringify(new_manifest, null, 2),
    );
  }
}

if (import.meta.main) {
  build();
}
