import slippySlider from "../../dist/slippyslider.esm.js";

// Center mode demo

const sliderCenter = new slippySlider({
  slider: ".slippy-slider--center",
  slides: ".slippy-slider__slide",
  center: true,
});

const prevButton = document.querySelector(".demo--center .control-prev");
const nextButton = document.querySelector(".demo--center .control-next");

prevButton.addEventListener("click", () => {
  sliderCenter.moveTo("prev");
});
nextButton.addEventListener("click", () => {
  sliderCenter.moveTo("next");
});

// Left aligned mode demo
const sliderLeft = new slippySlider({
  slider: ".demo--left .slippy-slider",
  slides: ".slippy-slider__slide",
  center: false,
});

const sliderLeftPrevButton = document.querySelector(".demo--left .control-prev");
const sliderLeftNextButton = document.querySelector(".demo--left .control-next");

sliderLeftPrevButton.addEventListener("click", () => {
  sliderLeft.moveTo("prev");
});
sliderLeftNextButton.addEventListener("click", () => {
  sliderLeft.moveTo("next");
});


// Responsive demo
const sliderResponsive = new slippySlider({
  slider: ".demo--responsive .slippy-slider",
  slides: ".slippy-slider__slide",
  center: true,
});

const responsivePrevButton = document.querySelector(".demo--responsive .control-prev");
const responsiveNextButton = document.querySelector(".demo--responsive .control-next");

responsivePrevButton.addEventListener("click", () => {
  sliderResponsive.moveTo("prev");
});
responsiveNextButton.addEventListener("click", () => {
  sliderResponsive.moveTo("next");
});