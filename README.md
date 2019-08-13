# Slippy Slider
### A slider based on extending the functionality of native scroll areas

## Feature list
- Roll your own responsive settings with good old CSS. No js needed.
- Center and left aligned mode.
- Prev/Next and move to specific slide interactions.
- Mouse click and drag to navigate. 
- Keyboard control via left and right arrow keys.
- Touch swipe, scroll and flick to move one or many slides.
- Sideways scrolling via mouse or track pad input.

## Usage
#### ES6 modules
```javascript
import slippySlider from 'slippy-slider/dist/slippyslider.esm.js';
```

#### File Include
Link the the file `slippy-slider/dist/slippyslider.js` in your HTML or add it to your main js file.

#### Add styles
Add the basic stylesheet to your scss build or css styles.
```` Seperate file coming soon ````

## Basic Slippy Setup
Required html
````html
  <div class="slippy-slider">
    <div class="slippy-slider__track">
      <div class="slippy-slider__slide"></div>
      <div class="slippy-slider__slide"></div>
      <div class="slippy-slider__slide"></div>
      <div class="slippy-slider__slide"></div>
      <div class="slippy-slider__slide"></div>
      <div class="slippy-slider__slide"></div>
      <div class="slippy-slider__slide"></div>
    </div>
  </div>
````

It is required to add some styles or content for each slide to give them size. The JS does not modify the slides in any way.
````css
.slippy-slider__track {
  display: flex;
}
.slippy-slider__slide {
  flex: 1 1 50vw;
  height: 400px;
  margin: 0 20px;
  background-color: coral;
}
````

Initialise with js.
````javascript
const slider = new slippySlider();
````

## Extra slippy setup
More examples coming soon

## Slippy options
````javascript
const slider = new slippySlider({
  slider = ".slippy-slider", // Any CSS selector for your slider
  track = ".slippy-slider__track", // Any CSS selector for your track
  slides = ".slippy-slider__slide", // Any CSS selector for your slides
  center = true, // true or false, aligns active slide to the center or left side of the slider
});
````

## Slippy Methods
These examples expect our slider being initialised as a variable named `slider`;
````javascript
const slider = new slippySlider();
````

````javascript
slider.moveTo();
````


Accepts the strings `next` and `prev` to move to the next or previous slide.

Or accepts an integer that refrences each slide starting from `0` as the first slide.

Use like this for next and previous buttons.
````javascript
const nextSlide = document.querySelector('.my-slider-next');
const prevSlide = document.querySelector('.my-slider-prev');

nextSlide.addEventListener('click', () => slider.moveTo('next'));
prevSlide.addEventListener('click', () => slider.moveTo('next'));
````

Or this for moving to a particular slide.
````javascript
slider.moveTo(5);
````

If no argument is given it moves to re-align the active-slide.
The active slide being the one closest to the center of the slider if `{center: true}`.
Or the slide closest to the left side of the slider if `{center: false}`.
````javascript
slider.moveTo();
````

## Styling Slippy
Slippy slider uses a regular HTML scroll container wihtout any javascript manipulation until it is interacted with. This means that you can style it with CSS however you want and it won't conflict with the slider functionality as long as the slides remain inside the slider parent.

Due to the nature of the way browsers interpret scrolling on the x-axis you should not add padding/margin left or right to the slider parent. However you can add padding/margin left or right to the slider track without any issues.

### Applied classes
The class `.on-screen` is dynamically applied to every slide that is more than 50% inside the slider, and removed when it is more than half outside the container.

If `{center: true}` the class `.active-slide` is applied to the slide that at least part of it is in the center of the slider. If `{center: false}` the class `.active-slide` is applied to the class closest the the left side of the slider and more than 50% inside the slider.


## Project goals
  1. Slider styled via css and not rely on javascript dom manipulation
  2. Allow for center and left aligned slides
  3. Allow for next and prev slide buttons
  4. Allow for slide thumbnails or dots navigation
  5. Responsive out of the box
  6. Allow for multiple instances on the same page.
  7. Zero dependencies
  8. Degrade gracefully in older browsers to appear as a native scroll area.
  9. Degrade gracefully if JS doesn't run or is not supported
  10. Under 10kb


  ### Coming soon
  - Default CSS file.
  - Browser support list.
  - Fallbacks for older browsers.



## Dev setup  
#### This project uses gulp, scss, browserSync, Rollup and Bublé

### Folder structure
**_src/** - is where you work  
**dev/** - is where the browserSync server runs from  
**dist/** - contains the processed js files 

### Get started
1. `git clone https://github.com/LukeCarlThompson/slippy-slider.git` - clone the repo
2. `npm install` - install dependencies
3. `npm run dev` - spins up the dev server, watches for changes, compiles scss and js

`npm run build` - transpiles and builds final js files in dist/ folder
`npm run clean` - deletes the dev and dist folders