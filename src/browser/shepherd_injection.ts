import build from "@/utils/tour_builder";

(function () {
  console.log("Shepherd injection!");
  console.log(document);
  const dummy_config = document.querySelector(
    "#dummy_shepherd_config",
  )?.textContent;
  if (dummy_config) {
    console.log("Config found in the page!");
    const config = JSON.parse(dummy_config);
    console.log(config);
    const tour = build(config.config);
    tour?.start();
  } else {
    console.error("No config found in the page!");
  }
})();
