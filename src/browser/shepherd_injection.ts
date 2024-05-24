import Shepherd from "shepherd.js";
import "./style.css";

console.log("Shepherd injection!");

const tour = new Shepherd.Tour({
  useModalOverlay: false,
  defaultStepOptions: {
    classes: "shadow-md bg-purple-dark",
    scrollTo: true,
  },
});

tour.addStep({
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
      action: tour.next,
    },
  ],
});

tour.addStep({
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
      action: tour.next,
    },
  ],
});

tour.start();
