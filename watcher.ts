import { watch } from "fs";
import { build } from "./build.ts";

process.on("SIGINT", () => {
  watcher.close();
  process.exit();
});

console.log("Building...");
await build().catch(console.error);

console.log("Watching for changes...");
const watcher = watch(
  import.meta.dir + "/src/",
  { recursive: true },
  (event, filename) => {
    console.log(`Detected ${event} in ${filename}`);
    console.log("Rebuilding...");
    build()
      .then(() =>
        console.log(new Date().toISOString(), ": Rebuilt successfully"),
      )
      .catch(console.error);
  },
);
