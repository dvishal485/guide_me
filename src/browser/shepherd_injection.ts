import build from "@/tour_builder";

const dummy_config = [
  {
    id: "email",
    text: "email elem",
    attachTo: {
      element: "#email",
      on: "bottom",
    },
    classes: "email",
    tasks: ["next"],
    buttons: [
      {
        text: "Next",
      },
    ],
  },
  {
    id: "password",
    text: "pwd elem",
    attachTo: {
      element: "#password",
      on: "bottom",
    },
    tasks: ["next"],
    classes: "password",
    buttons: [
      {
        text: "Next",
      },
    ],
  },
];

(function () {
  console.log("Shepherd injection!");

  const tour = build(dummy_config);
  tour?.start();
})();
