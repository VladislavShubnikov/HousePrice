# House Price Prediction Heat Map

House price prediciton project. Predicitions are rendered as colored heat map. Project based on Angular 6.2.1 + ThreeJS.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.1.

![Background image](src/logo_page.png)


## Overview

This project uses free and public source OSM data for map visualization. Also project uses collected data about
real estate prices and show houses/appertments for sale as a points on map.
Project create pric prediction model for any map point and display this model as a colored gradient map.
Details will be written later.

## Working web-app demonstration
You can try live demo:
http://d-inter.ru/private/Vlad/nirs/2018_HousePrice/HsPrcAng/

## Market evaluation

HousePriceHeatMap project can be used for approximate price predition in any geographic point inside supporeted cities.
Now St.Petersburg (Russia) is supported. Later other major cities will be added. Also this project can be used as
a investment estimation tool: see how real estate prices are changing during time. You can estimate is some area
is encreasing or stable in terms of square meter pricing. Also this is very research project and you can try different 
approximation / prediction models to see prices heat map. Unlike static heat map, this application allow to browse map
like usual Google map or Yandex map (zoom an pan functionality). This solution can heavy and intensively used by real estate
agencies, individuals and governmenment, map organizations. Probably, this is the first interactive web app with map render
and interactive heat map visualization project.

### Implementation notes
For fast rendering we have used Three JS library for rendering via WebGL. This allow to reach impressive fast render speed
even on mobile devices and use huge geometry primitives dataset.

### Implementation restrictions
1. Only russian language is supported in UI
2. Only St.Petersburg (Russia) can be loaded
3. Heat map is under implementation now
4. Map data size is not optimized (used simple text json file)
5. Osm to internal data converter is not implemented here, inside project
6. Houses/Building data from OSM is not supported yet (need to shrink down data size)
7. Unit tests are not implemented yet.
8. Web app can be slow on some mobile devices (with simple video card)

More details will be written later

## References
We have used following software, databases and articles for our project:
[Osm major world cittes database](http://download.bbbike.org/osm/bbbike/)
[Angular 6.1 framework](https://angular.io)
[Inverse Distance Weighting (IDW) idea](https://en.wikipedia.org/wiki/Inverse_distance_weighting)
[Build heat map on the IDW base](https://github.com/optimisme/javascript-temperatureMap)
[Build heat map color gradients](http://www.andrewnoske.com/wiki/Code_-_heatmaps_and_color_gradients)
[Kernel Density Estimation (KDE) and build heat maps](https://www.geodose.com/2018/01/creating-heatmap-in-python-from-scratch.html)
[Iterative heat map build](https://github.com/jjguy/heatmap)


## Prerequisites

### Node.js and Tools

Download link:
[NodeJS](https://nodejs.org/en/download/).

Version not below than v.10.10.0 is required.

After NodeJS installation please check that everything is installed correctly (for example, PATH ), using command:
```
node --version
```
Stdout should be
v10.10.0 (or higher).


## Start working with project

Run `npm install` to load all requied Node packages. They will appear in `node_modules` folder.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
Run `ng serve --open` to start dev server and immediately open browser with url `http://localhost:4200/`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Compile and strong syntax check

Run `ng lint` to compile project source codes.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
Better way for final deployment is command:
```
ng build --prod --base-href https://your.site/somefolder/
```


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
