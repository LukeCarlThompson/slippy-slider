import slippySlider from '../../dist/slippyslider.esm.js';


console.log('Index.js file 😎');


const slider = new slippySlider({
  slider: '.slippy-slider',
  slides: '.slippy-slider__slide',
  center: true,
});



const prevButton = slider.slider.querySelector(".control-prev");
const nextButton = slider.slider.querySelector(".control-next");

prevButton.addEventListener("click", () => {slider.moveTo("prev")});
nextButton.addEventListener("click", (e) => {slider.moveTo("next")});




// function scrollTo(target, from, to, duration) {
//   let  fps = 60;
//   let currentPosition = from;
//   let time = 0;
//   let request = requestAnimationFrame(move);
  
//   // formula     http://easings.net/
//   // description https://stackoverflow.com/questions/8316882/what-is-an-easing-function
//   // x: percent
//   // t: current time,
//   // b: beginning value,
//   // c: change in value,
//   // d: duration
//   function easeInOutQuad(x, t, b, c, d) {
//     if ((t /= d / 2) < 1) {
//         return c / 2 * t * t + b;
//     } else {
//         return -c / 2 * ((--t) * (t - 2) - 1) + b;
//     }
//   };
  
//   function move() {
//     time += 1 / fps;
//     currentPosition = easeInOutQuad(time * 100 / duration, time, from, to, duration);
  
//     if (currentPosition >= to) {
//         cancelAnimationFrame(request);
//         target.scrollLeft = to;
//         return;
//     }
//     target.scrollLeft = currentPosition;
//     request = requestAnimationFrame(move);
//   }
// }

// const scrollContainer = document.querySelector('.scroll-container');

// scrollTo(scrollContainer, 0, 400, 1);