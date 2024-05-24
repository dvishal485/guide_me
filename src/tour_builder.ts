import S from "shepherd.js";

export default function build_tour(config: unknown[]) {
  try {
    const config_json = config as TourSteps[];
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Shepherd: typeof S = require("shepherd.js");

    const injectedTour = new Shepherd.Tour({
      useModalOverlay: false,
      defaultStepOptions: {
        classes: "shadow-md bg-purple-dark",
        scrollTo: true,
      },
    });

    type TourSteps = Parameters<typeof injectedTour.addStep>[0] & {
      tasks: ["next" | "prev" | "cancel"];
    };

    config_json.forEach((step) => {
      if ("buttons" in step) {
        step.buttons?.forEach((button, idx) => {
          button.action = () => {
            switch (step.tasks[idx]) {
              case "prev":
                injectedTour.back();
                break;
              case "cancel":
                injectedTour.cancel();
                break;
              case "next":
              default:
                injectedTour.next();
            }
          };
        });
      }
      injectedTour.addStep(step);
    });

    return injectedTour;
  } catch (e) {
    console.error("Error building tour!", e);
    return null;
  }
}
