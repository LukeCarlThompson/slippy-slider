!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define("slippyslider",t):(e=e||self).slippyslider=t()}(this,function(){"use strict";return function(e){var t=this;void 0===e&&(e={});var r=e.slider;void 0===r&&(r=".slippy-slider");var i=e.track;void 0===i&&(i=".slippy-slider__track");var s=e.slides;void 0===s&&(s=".slippy-slider__slide");var n=e.center;void 0===n&&(n=!0);var o=s,l=function(e){return Array.prototype.slice.call(e)};if(this.slider=document.querySelector(r),!this.slider)return console.error("Please specify a slider target");if(this.track=this.slider.querySelector(i),!this.track)return console.error("Cannot find slippy-slider__track");if(this.slides=l(this.slider.querySelectorAll(o)),0===!this.slides.length)return console.error("Please specify a the slider slides");this.center=n,this.updateSlides=function(){return t.slides=l(t.slider.querySelectorAll(o))},console.log("%cReady to get Slippy  😎%c","color: black; font-family: sans-serif; font-weight: bold; font-style: italic; font-size: 20px; text-shadow: 1px 1px 0 white; padding: 10px 20px; background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%); border-radius: 4px;","font-size: 20px;");var a=this.center?"center":"start";this.slider.style.setProperty("--scroll-snap-align",a);var c=function(e){var r=e.getBoundingClientRect();return t.center?r.left+r.width/2:r.left},d=function(e){return t.slides.map(function(t){return t.classList.remove(e)})},u=function(){t.slider.style.scrollSnapType="none",t.slides.forEach(function(e){return e.style.scrollSnapAlign="none"})},f=function(e){void 0===e&&(e="active");var r=c(t.slider),i=t.slides.map(function(e,t){return{index:t,position:c(e),scrollOffset:c(e)-r,slide:e}});if(!isNaN(e)&&i.length>=e)return i[e];var s=l(i).sort(function(e,t){return Math.abs(e.position-r)-Math.abs(t.position-r)})[0];return"next"===e?i[s.index+1]||i[0]:"prev"===e?i[s.index-1]||i.slice(-1)[0]:s};this.easing={inOutQuad:function(e){return e<.5?2*e*e:(4-2*e)*e-1},inOutCubic:function(e){return e<.5?4*e*e*e:(e-1)*(2*e-2)*(2*e-2)+1},inOutQuart:function(e){return e<.5?8*e*e*e*e:1-8*--e*e*e*e},inOutQuint:function(e){return e<.5?16*e*e*e*e*e:1+16*--e*e*e*e*e}},this.moveTo=function(e,r){void 0===r&&(r=800);var i=!1,s=null,n=f(e).scrollOffset,o=n+t.slider.scrollLeft,l=function(e){if(i)return t.slider.style.scrollSnapType="",t.slides.forEach(function(e){return e.style.scrollSnapAlign=""}),t.track.style.transform="",void(t.slider.scrollLeft=o);e-s>=r&&(i=!0);var a=(e-s)/r,c=t.easing.inOutCubic(a),d=-1*(0+(n-0)*c);t.track.style.transform="translateX("+d+"px)",requestAnimationFrame(l)};requestAnimationFrame(function(e){s=e,u(),l(e)})};var p={root:this.slider,threshold:[0,.5,1],rootMargin:"100px 0px 100px 0px"},v=new IntersectionObserver(function(e,r){for(var i=0;i<e.length;i++){var s=e[i],n=s.target;s.intersectionRatio>=.49?n.classList.add("on-screen"):n.classList.remove("on-screen"),t.center||(d("active-slide"),f("active").slide.classList.add("active-slide"))}},p);if(this.slides.forEach(function(e){return v.observe(e)}),this.center){var h={root:this.slider,threshold:0,rootMargin:"100px -50% 100px -50%"},y=new IntersectionObserver(function(e,t){for(var r=0;r<e.length;r++){var i=e[r],s=i.target;i.isIntersecting?s.classList.add("active-slide"):s.classList.remove("active-slide")}},h);this.slides.forEach(function(e){return y.observe(e)})}var g=!1,m=0,x=0,L=null,k=!1,b=!0,E=function(e){e.stopPropagation(),g&&0!==x&&(t.moveTo("active"),x=0,b=!0),g=!1};this.track.addEventListener("touchend",function(){return k=!0}),this.track.addEventListener("mousedown",function(e){e.stopPropagation(),k?k=!0:(g=!0,m=e.pageX,L=t.slider.scrollLeft)}),this.track.addEventListener("mousemove",function(e){e.stopPropagation(),g&&(b&&(u(),b=!1),x=m-e.pageX+L,t.slider.scrollLeft=x)}),this.track.addEventListener("mouseup",E),this.track.addEventListener("mouseout",E)}});