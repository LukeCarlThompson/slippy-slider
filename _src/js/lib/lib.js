/* 

TODO: Set a duration parameter for the scrollFromTo timing.

TODO: Set a easing parameter for the scrollFromTo easing.

TODO: Test what happens when intersectionObserver fails provide a fallback. Probably looping over all slides and adding a class to make sure they are visible. Could just be the .on-screen class.

TODO: Test with multiple sliders on the same page.

TODO: If slider is currently scrolling, don't respond to clicks events or slide interaction until it is finished.

TODO: Test out automating the slider dots/thumbnails creation.

TODO: Test out the slider emitting some custom events that fire when the slider is moved to a new slide.

TODO: Test out using a throttled resize listener that shows and hides the navigation buttons when all slides are on the screen. Or should this be left up to CSS?

TODO: Create a destroy method that removes the intersection observer and event listeners.

TODO: Test listening for swipe gestures instead of just relying on the cosest slide. Can be awkward to click and drag so far if the slide takes up the whole screen.

TODO: Test a scroll listener that updates a css variable relating to the position of the slide inside the scroll window. Similar to the way ScrollOut works. Perhaps as a plugin.







TODO: Latest testing reveals that it's all the class swapping during scrolling in safari that causes all the jank.
We can remove scrolling and scroll snapping altogether and still be able to set scroll position for the slider.
Or perhaps test out just using a transform percentage value set inline.
This will probably still require a resize listener that then removes it at certain breakpoints though.
To Allow CSS styling that sets up and removes the slider. Or perhaps an configurable option that just fires an event/callback function at whatever breakpoint you set. This event listener could be heavily debounced.

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
  const scrollSnapAlign = this.center ? "center" : "start";
  this.slider.style.setProperty("--scroll-snap-align", scrollSnapAlign);
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
  Functions to disable scroll snapping for all slides and to remove inline styles
  */
  const disableSnapping = () => {
    console.log("disabled snapping");
    // this.slider.style.scrollSnapType = "none";
    // this.slides.forEach(slide => (slide.style.scrollSnapAlign = "none"));
  };
  const enableSnapping = () => {
    console.log("enabled snapping");
    // this.slider.style.scrollSnapType = "";
    // this.slides.forEach(slide => (slide.style.scrollSnapAlign = ""));
  };

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
  this.easing = {
    inOutQuad: t => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    inOutCubic: t => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    inOutQuart: t => {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    inOutQuint: t => {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    },
  };

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
    const finalScrollPos = to + this.slider.scrollLeft;

    const startAnim = time => {
      start = time;
      end = start + duration;
      disableSnapping();
      nextFrame(time);
    };

    const nextFrame = time => {
      if (stop) {
        enableSnapping();
        this.track.style.transform = "";
        this.slider.scrollLeft = finalScrollPos;
        return;
      }
      if (time - start >= duration) stop = true;
      const progress = (time - start) / duration;
      const val = this.easing.inOutCubic(progress);
      const nextPosition = (from + (to - from) * val) * -1;
      this.track.style.transform = `translate3d(${nextPosition}px, 0, 0)`;
      requestAnimationFrame(nextFrame);
    };

    requestAnimationFrame(startAnim);
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
  Functions to allow dragging with the mouse pointer
  (touch dragging is enabled by default on mobile devices due to default scroll behaviour)
  */
  let mouseDown = false;
  let firstPos = 0;
  let dragValue = 0;
  let sliderCurrentScroll = null;
  // Flags to check whether screen was touched or snapping is turned on or off.
  let didTouch = false;
  let snapping = true;

  const startDrag = e => {
    console.log("startDrag");
    e.stopPropagation();
    // e.preventDefault();
    if (didTouch) {
      didTouch = true;
      return;
    }
    mouseDown = true;
    firstPos = e.pageX;
    sliderCurrentScroll = this.slider.scrollLeft;
  };

  const drag = e => {
    console.log("drag");
    // e.stopPropagation();
    if (mouseDown) {
      if (snapping) {
        disableSnapping();
        snapping = false;
      }
      dragValue = firstPos - e.pageX + sliderCurrentScroll;
      this.slider.scrollLeft = dragValue;
    }
  };

  const endDrag = e => {
    console.log("endDrag");
    e.stopPropagation();
    if (mouseDown && dragValue !== 0) {
      this.moveTo("active");
      dragValue = 0;
      // enableSnapping();
      snapping = true;
    }
    mouseDown = false;
  };
  // This stops touch event from triggering the mouse events as well.
  // this.track.addEventListener("touchstart", () => {
  //   didTouch = true;
  //   console.log("touchstart");
  // });

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
