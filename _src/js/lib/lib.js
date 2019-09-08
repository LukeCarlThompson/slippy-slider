/* 

TODO: Set a duration parameter for the scrollFromTo timing.

TODO: Use CSS transitions instead of the RAF loop

TODO: Test what happens when intersectionObserver fails provide a fallback. Probably looping over all slides and adding a class to make sure they are visible. Could just be the .on-screen class.

TODO: If slider is currently scrolling, don't respond to clicks events or slide interaction until it is finished.

TODO: Test out automating the slider dots/thumbnails creation.

TODO: Test out the slider emitting some custom events that fire when the slider is moved to a new slide.

TODO: Create a destroy method that removes the intersection observer and event listeners.

TODO: Test listening for swipe gestures instead of just relying on the cosest slide. Can be awkward to click and drag so far if the slide takes up the whole screen.

TODO: Test a scroll listener that updates a css variable relating to the position of the slide inside the scroll window. Similar to the way ScrollOut works. Perhaps as a plugin.

TODO: Debounce the functions inside intersectionObserver. They fire too fast on window resizing.

TODO: Stop drag and transforming to a value outside of the scroll area.




TODO: Create an internal property that holds the current sliders position.

TODO: Convert the pixel value positioning to a percentage of the slider trolley width

*/

function slippySlider({
  slider = ".slippy-slider",
  track = ".slippy-slider__track",
  slides = ".slippy-slider__slide",
  center = true,
} = {}) {
  const slidesSelector = slides;

  // Array from helper
  const arrayFrom = nl => Array.prototype.slice.call(nl);

  this.slider = document.querySelector(slider);
  if (!this.slider) {
    return console.error("Please specify a slider target");
  }
  this.track = this.slider.querySelector(track);
  if (!this.track) {
    return console.error("Cannot find slippy-slider__track");
  }
  this.slides = arrayFrom(this.slider.querySelectorAll(slidesSelector));
  if (!this.slides.length === 0) {
    return console.error("Please specify a the slider slides");
  }
  this.center = center;

  this.updateSlides = () =>
    (this.slides = arrayFrom(this.slider.querySelectorAll(slidesSelector)));

  // Let everyone know we are ready to get slippy
  console.log(
    "%cReady to get Slippy  😎%c",
    "color: black; font-family: sans-serif; font-weight: bold; font-style: italic; font-size: 20px; text-shadow: 1px 1px 0 white; padding: 10px 20px; background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%); border-radius: 4px;",
    "font-size: 20px;"
  );

  /* 
  Set some custom css properties based on the params and add them to the slider
  */
  // const scrollSnapAlign = this.center ? "center" : "start";
  // this.slider.style.setProperty("--scroll-snap-align", scrollSnapAlign);
  // TODO: Set a padding left and right option adjusts the intersection observer area
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
  const removeClassFromSlides = className =>
    this.slides.map(slide => slide.classList.remove(className));
  const addClassToSlides = className =>
    this.slides.map(slide => slide.classList.add(className));

  /* 
  Finds closest slide to the left edge or the center of the slider depending on slider settings
  Returns the following object object 
  { 
    index: (this.slides array index),
    position: (distance from left or center edge),
    scrollOffset: (distance to scroll this slide into active position)
    slide: (slide element)
  }
  TODO: Set up better fallbacks in case the first or last slide can't be scrolled to.
    - Check if there is any distance left to scroll in the container. If not then go back tot he start.
    - If no slide is active then scroll to the nearest slide
   */
  const findSlide = (x = "active") => {
    console.log("findSlide");
    const sliderPosition = getPosition(this.slider);
    const slidePositions = this.slides.map((slide, i) => {
      return {
        index: i,
        position: getPosition(slide),
        scrollOffset: getPosition(slide) - sliderPosition,
        slide: slide,
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
  Easing functions
  */
  // this.easing = {
  //   inOutQuad: t => {
  //     return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  //   },
  //   inOutCubic: t => {
  //     return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  //   },
  //   inOutQuart: t => {
  //     return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  //   },
  //   inOutQuint: t => {
  //     return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  //   },
  // };

  /* 
  RAF powered animation.
  Animates the track's transform to correct position, then removes the transform and snaps to the same scroll position
  */
  this.moveTo = (x, duration = 800) => {
    console.log("moveTo");
    let stop = false;
    let start = null;
    let end = null;

    const from = 0;
    const to = findSlide(x).scrollOffset;
    // This current scroll position value should be cached somewhere and converted to a percentage of the trolley's width
    const finalScrollPx = to + (this.track.getBoundingClientRect().left - this.slides[0].getBoundingClientRect().left);
    const finalScrollPercent = (finalScrollPx / this.track.clientWidth) * 100;
    const finalScrollPos = finalScrollPercent;

    const startAnim = time => {
      start = time;
      end = start + duration;
      nextFrame(time);
    };

    this.track.style.transition = `transform 0.5s cubic-bezier(0.5, 0, 0.5, 1)`;
    this.track.style.transform = `translate3d(${to * -1}px, 0, 0)`;
    this.track.addEventListener('transitionend', () => {
      this.track.style.transform = "";
      this.track.style.transition = "";
      this.slides.forEach(slide => slide.style.left = `${finalScrollPos * -1}%`);
    })

    // const nextFrame = time => {
    //   if (stop) {
    //     this.track.style.transform = "";
    //     // this.slider.scrollLeft = finalScrollPos;
    //     this.slides.forEach(slide => slide.style.left = `${finalScrollPos * -1}%`);
    //     return;
    //   }
    //   if (time - start >= duration) stop = true;
    //   const progress = (time - start) / duration;
    //   const val = this.easing.inOutCubic(progress);
    //   const nextPosition = (from + (to - from) * val) * -1;
    //   this.track.style.transform = `translate3d(${nextPosition}px, 0, 0)`;
    //   requestAnimationFrame(nextFrame);
    // };

    // requestAnimationFrame(startAnim);
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
        console.log("on-screen", el);
        el.classList.add("on-screen");
      } else {
        console.log("removed on-screen", el);
        el.classList.remove("on-screen");
      }

      if (!this.center) {
        removeClassFromSlides("active-slide");
        findSlide("active").slide.classList.add("active-slide");
      }
    }
  }, options);

  this.slides.forEach(slide => observer.observe(slide));

  /* 
  Intersection Observer watching for the slide in the center of the slider
  */
  if (this.center) {
    const centerSlideOptions = {
      root: this.slider,
      threshold: 0,
      rootMargin: "100px -50% 100px -50%",
    };
    const centerSlide = new IntersectionObserver((entries, observer) => {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add("active-slide");
        } else {
          el.classList.remove("active-slide");
        }
      }
    }, centerSlideOptions);
    this.slides.forEach(slide => centerSlide.observe(slide));
  }

  /* 
  Functions to allow dragging
  */
  let mouseDown = false;
  let firstPos = 0;
  let dragValue = 0;
  let sliderCurrentScroll = null;

  const startDrag = e => {
    console.log("startDrag");
    e.stopPropagation();
    // e.preventDefault();
    mouseDown = true;
    firstPos = e.pageX;
    // This value should be cached somewhere and converted to a percentage of the trolley's width
    sliderCurrentScroll =  this.track.getBoundingClientRect().left - this.slides[0].getBoundingClientRect().left;
  };

  const drag = e => {
    // e.stopPropagation();
    if (mouseDown) {
      // console.log("drag");
      dragValue = firstPos - e.pageX + sliderCurrentScroll;
      // this.slider.scrollLeft = dragValue;
      // console.log('sliderCurrentScroll -->', sliderCurrentScroll);
      // console.log('dragValue -->', dragValue);
      // this.slider.scrollLeft = 0;
      this.slides.forEach(slide => slide.style.left = '');
      this.track.style.transform = `translateX(${dragValue * -1}px)`;
    }
  };

  const endDrag = e => {
    e.stopPropagation();
    if (mouseDown && dragValue !== 0) {
      this.track.style.transform = '';
      // this.slider.scrollLeft = dragValue;
      this.slides.forEach(slide => slide.style.left = `${dragValue * -1}px`);
      this.moveTo("active");
      dragValue = 0;
      mouseDown = false;
      // console.log("endDrag");
    }
  };

  // Testing out overriding scrolling for touch
  this.track.addEventListener("touchstart", startDrag);
  this.track.addEventListener("touchmove", drag);
  this.track.addEventListener("touchend", endDrag);

  this.track.addEventListener("mousedown", startDrag);
  this.track.addEventListener("mousemove", drag);
  this.track.addEventListener("mouseup", endDrag);
  this.track.addEventListener("mouseout", endDrag);
}

export default slippySlider;
