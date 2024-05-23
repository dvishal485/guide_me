import { $, Glob } from "bun";

export async function build() {
  await $`bunx tsc && bunx vite build`;
  const glob = new Glob("dist/assets/*.js");
  const jsFiles = await Array.fromAsync(glob.scan());

  await Promise.all(
    jsFiles.map(async (jsFile) => {
      await $`bun build ${jsFile} --outfile ${jsFile}`;
    }),
  );

  // await $`bunx rm -rf dist/assets/chunks`;
}

if (import.meta.main) {
  build();
}
