console.log('scrollSnap.js');

// import smoothScroll from 'smoothscroll-polyfill';
// // Run the polyfill
// smoothScroll.polyfill();

import 'scroll-behavior-polyfill';
// This polyfill works better in Safari than the other one.
// TODO: Test out not using it at all and just animating to the new scroll position.

// import scrollOut from 'scroll-out';


/*
  PROJECT GOALS
  1. Slider styled mostly via css and not rely on heavy javascript dom manipulation
  2. Allow for center and left aligned slides
  3. Allow for next and prev slide buttons
  4. Allow for slide thumbnails or dots navigation
  5. Not require a resize listener
  6. Allow for mulitple instaces on the same page.
  7. Degrade gracefully if JS doesn't run or is not supported
  8. under 10kb


  TODO: Make dots or thumbnails that will scroll to that specific slide.

  TODO: Set up a debounced resize listener that scroll to the current slide on screen resize.

  TODO: Put all the data about each slide in an array of objects. Then check against the object data for the state of each slide before updating the classes.

  TODO: Set up and test a way to make the slider loop when it reaches the end

  TODO: Test removing css scroll snapping and relying on the javascript events
  TODO: Test listening for touchdown and touchup events as well as clicks if scrollSnap is removed

  TODO: If slider is currently animating, don't allow further clicks events or slide interaction until it is finished.

  TODO: Test listening for swipe gestures instead of just relying on the cosest slide.

  TODO: Set up scroll listener that updates a css variable relating to the position of the slide inside the scroll window. Similar to the way ScrollOut works.

  TODO: Test what happens when intersectionObserver fails provide a fallback

  TODO: Test just using a scroll listener in the container and calculating everything based on that. Also remove scroll-snap and just animate the position of the slides when scrolling ahs stopped for more than 100ms;

*/




// // Testing RAF animation

// const easeOutCubic = (currentIteration, startValue, changeInValue, totalIterations) => {
//   return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
// };

// /*
// t = time,
// b = start value,
// c = change in value
// d = duration
// */

// const easeInOutCubic = ( t, b, c, d) => {
//   if ((t/=d/2) < 1) return c/2*t*t*t + b;
//   return c/2*((t-=2)*t*t + 2) + b;
// };

// let currentValue;
// let iteration = 0;
// let totalIterations = 100;

// const animate = (t, b, c, d) => {

//   // currentValue = easeOutCubic(iteration, 100, 90, totalIterations);
//   currentValue = easeInOutCubic(t, b, c, d);

//   iteration++;

//   console.log('value -->', currentValue);
//   slider.scrollLeft = currentValue;

//   if(iteration <= 100) {
//     requestAnimationFrame(() => {(animate(iteration, b, c, d))});
//   } else {
//     iteration = 0;
//   }
// };

// animate(iteration, 100, 200, 100);

// RAF Animation


const slider = document.querySelector('.slider');

const controls = document.querySelector('.slider__control-buttons');

const slides = [...document.querySelectorAll('.slide')];

let currentSlide = 0;

const sliderOptions = {
  center: true,
}

// Return 'prev' or 'next' if the controls are clicked;
const clicked = (e) => {
  if (e.target.classList.contains('slider__control-prev')) {
    return 'prev';
  } else if (e.target.classList.contains('slider__control-next')) {
    return 'next';
  }
  return false;
};

const toSlideDistance = (direction = 'next', center = false) => {

  // TODO: make a fallback for this and just choose the slide that is most on screen or closest to the screen
  // This will replace the slideFallback variable below
  const activeSlide = slides.filter(slide => slide.classList.contains('active-slide'))[0];

  const slideFallback = activeSlide || slides[0];

  let distance = 0;

  const nextSlide = activeSlide ? activeSlide.nextElementSibling : null;
  const prevSlide = activeSlide ? activeSlide.previousElementSibling : null;

  const sliderWidth = slider.clientWidth;
  const halfSliderWidth = sliderWidth / 2;

  // const slideMeasurement = center ? (rect.x + rect.width / 2) - halfSliderWidth : rect.x;

  if (direction === 'next' && nextSlide) {
    const rect = nextSlide.getBoundingClientRect();
    distance = center ? (rect.x + rect.width / 2) - halfSliderWidth : rect.x;
  } else if (direction === 'prev' && prevSlide) {
    const rect = prevSlide.getBoundingClientRect();
    distance = center ? (rect.x + rect.width / 2) - halfSliderWidth : rect.x;
  } else if (direction === 'active' && activeSlide) {
    const rect = activeSlide.getBoundingClientRect();
    distance = center ? (rect.x + rect.width / 2) - halfSliderWidth : rect.x;
  } else {
    const rect = slideFallback.getBoundingClientRect();
    distance = center ? (rect.x + rect.width / 2) - halfSliderWidth : rect.x; 
  }

  console.log('distance', distance);
  return distance;
}

const currentSlideWidth = (slides) => {
  const currentSlide = slides.filter(slide => slide.classList.contains('on-screen'));
  const compStyle = window.getComputedStyle(currentSlide[0]);
  const marginLeft = parseInt(compStyle.getPropertyValue('margin-left'));
  const marginRight = parseInt(compStyle.getPropertyValue('margin-right'));
  const x = currentSlide[0].offsetWidth + marginLeft + marginRight;
  
  console.log('outerWidth', x);
  return x;
}

// Find the left most slide that is at least half in the viewport
const activeSlide = () => slides.filter((slide) => (slide.getBoundingClientRect().x + (slide.offsetWidth / 2)) >= 0)[0];

const removeActiveSlideClass = () => slides.map((slide) => slide.classList.remove('active-slide'));


// Mouse down dragging listener and events
let mouseDown = false;
let firstPos = 0;
let dragValue = 0;
let sliderCurrentScroll = null;

const startDrag = (e) => {
  mouseDown = true;
  firstPos = e.pageX;
  sliderCurrentScroll = slider.scrollLeft;
  slides.forEach((slide) => {
    slide.style.scrollSnapAlign = 'none';
  });
};

const drag = (e) => {
  if(mouseDown) {
    dragValue = (firstPos - e.pageX) + sliderCurrentScroll;
    slider.scrollLeft = dragValue;
  };
};

const endDrag = (e) => {
  if(mouseDown) {
    slider.scrollBy({
      top: 0,
      left: toSlideDistance('active', sliderOptions.center),
      behavior: 'smooth'
    });
    // TODO: Try fire this once the animation has finished to see if it fixes the safari bug
    // Try this with just animating the scroll position with requestAnimationFrame and a callback
    // Bug is to do with the Safari not supporting the scrollTo smooth behavior

    console.log('distance to scroll -->', toSlideDistance('active', sliderOptions.center))
    slides.forEach((slide) => {
      slide.style.scrollSnapAlign = '';
    });
  }
  mouseDown = false;
};
slider.addEventListener('mousedown', startDrag);
slider.addEventListener('mousemove', drag);
slider.addEventListener('mouseup', endDrag);
slider.addEventListener('mouseout', endDrag);

// listen for click on controls
controls.addEventListener('click', (e) => {

  if (clicked(e) === 'prev') {
    console.log('clicked prev');
    slider.scrollBy({
      top: 0,
      left: toSlideDistance('prev', sliderOptions.center),
      behavior: 'smooth'
    })
  } else if (clicked(e) === 'next') {
    console.log('clicked next');
    // console.log('next slide distance -->', toSlideDistance(slides));
    slider.scrollBy({
      top: 0,
      // left: currentSlideWidth(slides),
      left: toSlideDistance('next', sliderOptions.center),
      behavior: 'smooth'
    })
  }

});



const nextPrevSlide = (slides) => {
  
  slides.forEach(slide => {
    slide.classList.remove('prev-slide');
    slide.classList.remove('next-slide');
  });
  
  const onScreen = slides.filter(slide => slide.classList.contains('on-screen'));
  
  onScreen.forEach(slide => {
    const nextSlide = slide.nextElementSibling;
    const prevSlide = slide.previousElementSibling;
    
    if(nextSlide && ! nextSlide.classList.contains('on-screen') ) {
      nextSlide.classList.add('next-slide');
    }
    if(prevSlide && ! prevSlide.classList.contains('on-screen') ) {
      prevSlide.classList.add('prev-slide');
    }
  });
};


// Options for intersectionObserver
const options = {
  root: slider,
  threshold: [0, 0.25, 0.5, 0.75, 1],
  rootMargin: '100px 0px 100px 0px'
};

// Intersection Observer for slides scrolling in and out of screen
const observer = new IntersectionObserver((entries, observer) => {

  for (let i = 0; i < entries.length; i++) {

    const entry = entries[i];
    const el = entry.target;

    // if (entry.isIntersecting) {
    if (entry.intersectionRatio >= 0.49) {
        el.classList.add('on-screen');
    } else {
      el.classList.remove('on-screen');
    }

    nextPrevSlide(slides);

    if(!sliderOptions.center) {
      removeActiveSlideClass();
      activeSlide().classList.add('active-slide');
    }

  };

}, options);

// intersection observer to check when a slide is in the center of the screen and give it .active-slide class
const centerSlideOptions = {
  root: slider,
  threshold: 0,
  rootMargin: '100px -50% 100px -50%',
};
const centerSlide = new IntersectionObserver((entries, observer) => {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const el = entry.target;
    if (entry.isIntersecting) {
      el.classList.add('active-slide');
    } else {
      el.classList.remove('active-slide');
    }
  };

}, centerSlideOptions);
if(sliderOptions.center) {
  slides.forEach((slide) => centerSlide.observe(slide) );
};


slides.forEach((slide) => observer.observe(slide) );




// Testing with scrollOut

// scrollOut({
//   scrollingElement: ".slider",
//   threshold: 0.1
// })