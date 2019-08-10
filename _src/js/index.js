import slippySlider from './slippyslider.js';


console.log('Index.js file 😎');


const slider = new slippySlider({
  slider: '.slippy-slider',
  slides: '.slippy-slider__slide',
  center: true,
});



const prevButton = slider.slider.querySelector(".control-prev");
const nextButton = slider.slider.querySelector(".control-next");

prevButton.addEventListener("click", () => slider.moveTo("prev"));
nextButton.addEventListener("click", () => slider.moveTo("next"));