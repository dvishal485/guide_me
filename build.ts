import { $, Glob } from "bun";
import fs from "fs";
import manifest from "./public/manifest.json";
import package_json from "./package.json";
import DomainConfig from "./src/types/DomainConfig";

export async function build() {
  console.log("build task started");
  generate_configs();

  fs.copyFileSync(
    "node_modules/shepherd.js/dist/esm/css/shepherd.css",
    "src/browser/shepherd.css",
  );

  await $`bunx tsc && bunx vite build`;
  const glob = new Glob("dist/assets/*.js");
  const jsFiles = await Array.fromAsync(glob.scan());

  console.log("vite build done! Executing bun build...");
  await Promise.all(
    jsFiles.map(async (jsFile) => {
      await $`bun build --minify ${jsFile} --outfile ${jsFile}`;
    }),
  );
  fs.rm("dist/assets/chunks", { recursive: true, force: true }, (e) => {
    if (e) console.error(e);
  });
  console.log("bun build completed");

  manifest.version = package_json.version;
  if (import.meta.env.TARGET_CHROME === "true") {
    const new_manifest = {
      ...manifest,
      browser_specific_settings: undefined,
    };
    fs.writeFileSync(
      "dist/manifest.json",
      JSON.stringify(new_manifest, null, 2),
    );
  } else {
    fs.writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2));
  }

  console.log(`Build done for extension ${manifest.name} v${manifest.version}`);
}

function generate_configs() {
  fs.readdir("configs", (err, domains) => {
    if (err) {
      console.log(err);
      return;
    }
    domains.forEach((domain) => {
      const domain_metadata: DomainConfig[] = [];
      const domain_config = fs.readdirSync(`configs/${domain}`);
      domain_config.forEach((config) => {
        if (config !== "index.json") {
          const config_file = fs.readFileSync(`configs/${domain}/${config}`);
          const config_json = JSON.parse(config_file.toString());
          fs.writeFile(
            `configs/${domain}/${config}`,
            JSON.stringify(config_json, null, 1),
            (e) => {
              if (e) {
                console.error("Error while formating!", e);
              }
            },
          );
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
