import shepherd_css from "./shepherd.css?inline";

(function () {
  console.log("Shepherd css loaded!");
  const styles = shepherd_css;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
})();
