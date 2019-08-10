import "scroll-behavior-polyfill";

function slippySlider({
  slider = ".slippy-slider",
  slides = ".slippy-slider__slide",
  center = true,
} = {}) {
  const slidesSelector = slides;

  // Array from helper
  const arrayFrom = (nl) => Array.prototype.slice.call(nl);

  this.slider = document.querySelector(slider);
  if (! this.slider) {
    return console.error('Please specify a slider target');
  }
  this.slides = arrayFrom(this.slider.querySelectorAll(slidesSelector));
  if (! this.slides.length === 0) {
    return console.error('Please specify a the slider slides');
  }
  this.center = center;

  this.updateSlides = () =>
    (this.slides = arrayFrom(this.slider.querySelectorAll(slidesSelector)));


  /* 
  Set some custom css properties based on the params and add them to the slider
  */
  const scrollSnapAlign = this.center ? 'center' : 'start';
  this.slider.style.setProperty('--scroll-snap-align', scrollSnapAlign );
  // TODO: Set a padding left and right option that sets a width for the before/after elements on the parent slider
  // As well as adjusting the scroll container padding and offsetting the slider position detection and scrollOffset

  /*
  returns the position in px from the left of the window
  position is measured from center or left edge depending on slider settings
  */
  const getPosition = el => {
    const rect = el.getBoundingClientRect();
    if (this.center) {
      return rect.left + rect.width / 2;
    } else {
      return rect.left;
    }
  };

  /* 
  Removes or adds a class from all slides
  */
 const removeClassFromSlides = (className) => this.slides.map((slide) => slide.classList.remove(className));
 const addClassToSlides = (className) => this.slides.map((slide) => slide.classList.add(className));

  /* 
  Finds closest slide to the left edge or the center of the slider depending on slider settings
  Returns an object { 
                      index: (this.slides array index),
                      position: (distance from left or center edge),
                      scrollOffset: (distance to scroll this slide into active position)
                      slide: (slide element)
                    }
   */
  const findSlide = (x = "active") => {
    const sliderPosition = getPosition(this.slider);
    const slidePositions = this.slides.map((slide, i) => {
      return {
        index: i,
        position: getPosition(slide),
        scrollOffset: getPosition(slide) - sliderPosition,
        slide: slide
      };
    });

    if (!isNaN(x) && slidePositions.length >= x) {
      // x is a number and not longer than the array return that slide
      return slidePositions[x];
    }

    // Returns the slide that is closest to the active position (center or left edge of slider)
    const closest = arrayFrom(slidePositions).sort(
      (a, b) =>
        Math.abs(a.position - sliderPosition) -
        Math.abs(b.position - sliderPosition)
    )[0];

    if (x === "next") {
      // if x is 'next' return the next slide or the first one
      return slidePositions[closest.index + 1] || slidePositions[0];
    } else if (x === "prev") {
      // if x is 'prev' return the previous slide or the last one
      return slidePositions[closest.index - 1] || slidePositions.slice(-1)[0];
    }

    // Return the closest slide by default
    return closest;
  };

  /* 
  Functions to move slider
  */
  this.moveTo = x => {
    const scrollTo = findSlide(x).scrollOffset;
    this.slider.scrollBy({
      top: 0,
      left: scrollTo,
      behavior: "smooth",
    });
    return `${x} slide ${findSlide(x).index} ${scrollTo}`;
  };

  /* 
  Function to set up intersection observer and add on-screen class
  */
  // Options for intersectionObserver
  const options = {
    root: this.slider,
    threshold: [0, 0.5, 1],
    rootMargin: "100px 0px 100px 0px",
  };

  // Intersection Observer for slides scrolling in and out of screen
  const observer = new IntersectionObserver((entries, observer) => {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const el = entry.target;

      if (entry.intersectionRatio >= 0.49) {
        el.classList.add("on-screen");
      } else {
        el.classList.remove("on-screen");
      }

      if(! this.center) {
        removeClassFromSlides('active-slide');
        findSlide('active').slide.classList.add('active-slide');
      }
    }
  }, options);

  this.slides.forEach(slide => observer.observe(slide));


  /* 
  Intersection Observer watching for the slide in the center of the slider
  */
 if(this.center) {
  const centerSlideOptions = {
    root: this.slider,
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
  this.slides.forEach((slide) => centerSlide.observe(slide) );
  };


  /* 
  Functions to allow dragging with the mouse pointer
  (touch dragging is enabled by default on mobile devices due to default scroll behaviour)
  */
  let mouseDown = false;
  let firstPos = 0;
  let dragValue = 0;
  let sliderCurrentScroll = null;

  const startDrag = (e) => {
    mouseDown = true;
    firstPos = e.pageX;
    sliderCurrentScroll = this.slider.scrollLeft;
    this.slides.forEach((slide) => {
      slide.style.scrollSnapAlign = 'none';
    });
  };

  const drag = (e) => {
    if(mouseDown) {
      dragValue = (firstPos - e.pageX) + sliderCurrentScroll;
      this.slider.scrollLeft = dragValue;
    };
  };

  const endDrag = (e) => {
    if(mouseDown) {
        this.moveTo('active');
      this.slides.forEach((slide) => {
        slide.style.scrollSnapAlign = '';
      });
    }
    mouseDown = false;
  };
  this.slider.addEventListener('mousedown', startDrag);
  this.slider.addEventListener('mousemove', drag);
  this.slider.addEventListener('mouseup', endDrag);
  this.slider.addEventListener('mouseout', endDrag);
};

module.exports = slippySlider;


/* 
TODO: If there is no current active slide then next or prev should move to the closest slide before mocing to the next or prev one

TODO: Allow slider to loop back to that start of it can't scroll anymore

TODO: Test what happens when intersectionObserver fails provide a fallback

TODO: Test listening for swipe gestures instead of just relying on the cosest slide.

TODO: Set up scroll listener that updates a css variable relating to the position of the slide inside the scroll window. Similar to the way ScrollOut works.

TODO: If slider is currently scrolling, don't allow further clicks events or slide interaction until it is finished.

TODO: Test out automating the slider dots/thumbnails creation

TODO: Test out putting in some custom event that fire when the slider is moved to anew slide

TODO: Create a destroy method that removes the intersection observer and event listeners

*/
