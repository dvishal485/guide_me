import type S from "shepherd.js";

(function () {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Shepherd: typeof S = require("shepherd.js");

  console.log("Shepherd injection!");

  const injectedTour = new Shepherd.Tour({
    useModalOverlay: false,
    defaultStepOptions: {
      classes: "shadow-md bg-purple-dark",
      scrollTo: true,
    },
  });

  injectedTour.addStep({
    id: "email",
    text: "email elem",
    attachTo: {
      element: "#email",
      on: "bottom",
    },
    classes: "email",
    buttons: [
      {
        text: "Next",
        action: injectedTour.next,
      },
    ],
  });

  injectedTour.addStep({
    id: "password",
    text: "pwd elem",
    attachTo: {
      element: "#password",
      on: "bottom",
    },
    classes: "password",
    buttons: [
      {
        text: "Next",
        action: injectedTour.next,
      },
    ],
  });

  injectedTour.start();
})();
