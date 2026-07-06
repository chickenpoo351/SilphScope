# renderAllX options

This file contains all options for the Node based renderAllX functions as well as their description.

Below you will find the shared options but if you wish to see the description of function specific options (if said function even contains any specific options) they will be underneath the `Shared options` section.

## Shared options

### concurrency

`concurrency` is a decently important function option it directly correlates to (currently only) worker thread parallelism.

Its default value is set to the amount of cores your CPU has minus one with a minimum value of one 

(so if you are on a single core CPU you will default to spawning one worker core but if you are on a eight core cpu you will default to spawning seven)

The option takes any positive number

### pngFilterType

This option controls the png filter applied before compression.

png filters don't actually affect the quality of the image or appearance instead they directly affect compression. Some filters work best on one type of image (resulting in a better compression) while some don't work very well for other images (resulting in worse compression)

Its deafult value is set to zero (none)

Each value corresponds to one of the five filter types (plus an auto mode) you can find them below:

-1: Auto mode
0: None
1: Sub
2: Up
3: Average
4: Paeth

#### -1 or Auto mode

This mode automatically tests each image against every filter type to see the best match almost always this mode will produce the smallest pngs (provided your compression level is also set) but due to testing every filter it is also the most CPU intensive

#### 0 or None

This mode applies no filter on the png and as such is the fastest in regards to CPU computation

It is also the default of the `pngFilterType` option

#### 1 or Sub

This uses the Sub filter which predicts each pixel immediately to its left

usually works well with image that have horizontal patterns

#### 2 or Up

Uses the Up filter with predicts each pixel from the corresponding pixel in the previous row.

Performs well when neighboring scanlines are similar.

#### 3 or Average

This filter uses the average of the left and upper pixels as its prediction.

works well on a decent amount of images.

#### 4 or Paeth

This uses the Paeth predictor which attempt to choose the best neighboring pixel as a prediction.

This is the most computationally expensive filter but it usually produces the smallest images.

#### Restricted automatic filtering

instead of using every filter in automatic mode you can instead create your own automatic mode with any filter type(s) you choose

for example you could pass this as a valid filter mode:

```JavaScript
pngFilterType: [1, 3, 4]
```

and doing so will only test filters 1, 3, and 4 (Sub, Average, and Paeth) for the images

### pngCompressionLevel

Directly affects png compression.

takes an integer value of 0-9 with 0 being no compression and 9 being the highest compression (as well as the most CPU intensive mode)

default set to 0

### verboseLogs

A simple toggle to show completion of an image via a console message (produces a ton of output though)

its default is set to true

### showSummary

Creates a small summary message once a function completes detailing stuff such as the amount of things rendered, time taken, and files written.

Default is set to true

~~(I will work more on this later :p)~~