import type S from "shepherd.js";
import type { StepOptions, StepOptionsButton } from "shepherd.js/step";

export type TourSteps = {
  buttons: ReadonlyArray<TourButtons>;
} & StepOptions;

export type TourButtons = StepOptionsButton & {
  task: "prev" | "cancel" | "next";
};

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

    config_json.forEach((step) => {
      if ("buttons" in step) {
        step.buttons?.forEach((button) => {
          button.action = () => {
            switch (button.task) {
              case "prev":
                injectedTour.back();
                break;
              case "cancel":
                injectedTour.cancel();
                break;
              case "next":
                injectedTour.next();
                break;
              default:
                console.log("Unknown task eval", button.task);
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
