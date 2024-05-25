import { $, Glob } from "bun";
import fs from "fs";
import manifest from "./public/manifest.json";
import DomainConfig from "./src/types/DomainConfig";

export async function build() {
  generate_configs();

  await $`bunx tsc && bunx vite build`;
  const glob = new Glob("dist/assets/*.js");
  const jsFiles = await Array.fromAsync(glob.scan());

  await Promise.all(
    jsFiles.map(async (jsFile) => {
      await $`bun build ${jsFile} --outfile ${jsFile}`;
    }),
  );

  // await $`bunx rm -rf dist/assets/chunks`;

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

function generate_configs() {
  fs.readdir("configs", (err, domains) => {
    if (err) {
      console.log(err);
      return;
    }
    const domain_metadata: DomainConfig[] = [];
    domains.forEach((domain) => {
      const domain_config = fs.readdirSync(`configs/${domain}`);
      domain_config.forEach((config) => {
        if (config !== "index.json") {
          const config_file = fs.readFileSync(`configs/${domain}/${config}`);
          const config_json = JSON.parse(config_file.toString());
          console.log(config);
          const config_data: DomainConfig = {
            name: config,
            match: config_json.match,
            description: config_json.description,
          };
          domain_metadata.push(config_data);
          fs.writeFile(
            `configs/${domain}/index.json`,
            JSON.stringify(domain_metadata, null, 0),
            (err) => {
              if (err) {
                console.log(err);
              }
            },
          );
        }
      });
    });
  });
}

if (import.meta.main) {
  build();
}
