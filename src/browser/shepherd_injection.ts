(function () {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Shepherd = require("shepherd.js");
  const styles = `.shepherd-button{background:#3288e6;border:0;border-radius:3px;color:hsla(0,0%,100%,.75);cursor:pointer;margin-right:.5rem;padding:.5rem 1.5rem;transition:all .5s ease}.shepherd-button:not(:disabled):hover{background:#196fcc;color:hsla(0,0%,100%,.75)}.shepherd-button.shepherd-button-secondary{background:#f1f2f3;color:rgba(0,0,0,.75)}.shepherd-button.shepherd-button-secondary:not(:disabled):hover{background:#d6d9db;color:rgba(0,0,0,.75)}.shepherd-button:disabled{cursor:not-allowed}
.shepherd-footer{border-bottom-left-radius:5px;border-bottom-right-radius:5px;display:flex;justify-content:flex-end;padding:0 .75rem .75rem}.shepherd-footer .shepherd-button:last-child{margin-right:0}
.shepherd-cancel-icon{background:transparent;border:none;color:hsla(0,0%,50%,.75);cursor:pointer;font-size:2em;font-weight:400;margin:0;padding:0;transition:color .5s ease}.shepherd-cancel-icon:hover{color:rgba(0,0,0,.75)}.shepherd-has-title .shepherd-content .shepherd-cancel-icon{color:hsla(0,0%,50%,.75)}.shepherd-has-title .shepherd-content .shepherd-cancel-icon:hover{color:rgba(0,0,0,.75)}
.shepherd-title{color:rgba(0,0,0,.75);display:flex;flex:1 0 auto;font-size:1rem;font-weight:400;margin:0;padding:0}
.shepherd-header{align-items:center;border-top-left-radius:5px;border-top-right-radius:5px;display:flex;justify-content:flex-end;line-height:2em;padding:.75rem .75rem 0}.shepherd-has-title .shepherd-content .shepherd-header{background:#e6e6e6;padding:1em}
.shepherd-text{color:rgba(0,0,0,.75);font-size:1rem;line-height:1.3em;padding:.75em}.shepherd-text p{margin-top:0}.shepherd-text p:last-child{margin-bottom:0}
.shepherd-content{border-radius:5px;outline:none;padding:0}
.shepherd-element{background:#fff;border-radius:5px;box-shadow:0 1px 4px rgba(0,0,0,.2);max-width:400px;opacity:0;outline:none;transition:opacity .3s,visibility .3s;visibility:hidden;width:100%;z-index:9999}.shepherd-enabled.shepherd-element{opacity:1;visibility:visible}.shepherd-element[data-popper-reference-hidden]:not(.shepherd-centered){opacity:0;pointer-events:none;visibility:hidden}.shepherd-element,.shepherd-element *,.shepherd-element :after,.shepherd-element :before{box-sizing:border-box}.shepherd-arrow,.shepherd-arrow:before{height:16px;position:absolute;width:16px;z-index:-1}.shepherd-arrow:before{background:#fff;content:"";transform:rotate(45deg)}.shepherd-element[data-popper-placement^=top]>.shepherd-arrow{bottom:-8px}.shepherd-element[data-popper-placement^=bottom]>.shepherd-arrow{top:-8px}.shepherd-element[data-popper-placement^=left]>.shepherd-arrow{right:-8px}.shepherd-element[data-popper-placement^=right]>.shepherd-arrow{left:-8px}.shepherd-element.shepherd-centered>.shepherd-arrow{opacity:0}.shepherd-element.shepherd-has-title[data-popper-placement^=bottom]>.shepherd-arrow:before{background-color:#e6e6e6}.shepherd-target-click-disabled.shepherd-enabled.shepherd-target,.shepherd-target-click-disabled.shepherd-enabled.shepherd-target *{pointer-events:none}
.shepherd-modal-overlay-container{height:0;left:0;opacity:0;overflow:hidden;pointer-events:none;position:fixed;top:0;transition:all .3s ease-out,height 0ms .3s,opacity .3s 0ms;width:100vw;z-index:9997}.shepherd-modal-overlay-container.shepherd-modal-is-visible{height:100vh;opacity:.5;transform:translateZ(0);transition:all .3s ease-out,height 0s 0s,opacity .3s 0s}.shepherd-modal-overlay-container.shepherd-modal-is-visible path{pointer-events:all}`;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  console.log("Shepherd injection!");

  const myFukingTour = new Shepherd.Tour({
    useModalOverlay: false,
    defaultStepOptions: {
      classes: "shadow-md bg-purple-dark",
      scrollTo: true,
    },
  });

  myFukingTour.addStep({
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
        action: myFukingTour.next,
      },
    ],
  });

  myFukingTour.addStep({
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
        action: myFukingTour.next,
      },
    ],
  });

  myFukingTour.start();
})();
