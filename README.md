# Slippy Slider
### A slider based on extending the functionality of native scroll areas

A work in progress.  
More instructions coming soon. 

## Project goals
  1. Slider styled mostly via css and not rely on javascript dom manipulation
  2. Allow for center and left aligned slides
  3. Allow for next and prev slide buttons
  4. Allow for slide thumbnails or dots navigation
  5. Responsive out of the box
  6. Allow for mulitple instances on the same page.
  7. Zero dependencies
  8. Degrade gracefully in older browsers to appear as a native scroll area.
  9. Degrade gracefully if JS doesn't run or is not supported
  10. under 10kb



## Dev setup  
#### This project uses gulp, scss, browserSync, Rollup and buble.

### Folder structure
**_src/** - is where you work  
**dev/** - is where the browserSync server runs from  
**dist/** - contains the processed js files 

### Get started
1. `git clone https://github.com/LukeCarlThompson/slippy-slider.git` - clone the repo
2. `npm install` - install dependencies
3. `npm run dev` - spins up the dev server
4. `npm run build` - transpiles and builds final js files in dist/ folder
