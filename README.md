# 3D Previewer
This is a previewer for 3D models. It will serve the 3D print platform at Fontys, by previewing the models in the queue. You can see an example of the library in a different use, here http://www.tiesfa.com/3dGrid/index.html

## Getting Started

These instructions will get you the project up and running on your local machine.

This library only works with the JSON file, "real.json". Or JSON files with the same structure.

### Adding library

Before you start you need the following libraries added to your html,
```
<script src="js/three.js"></script>
<script src="js/STLLoader.js"></script>
<script src="js/WebGL.js"></script>
<script src="js/controls/OrbitControls.js"></script>
<script src="js/jquery.js"></script>
<script src="js/3dPreviewer.js"></script>
```

### Installing

After you added the libraries you only need to add a div with id="modelGrid" in your HTML. The grid will automatically build in this div.

```
<div id="modelGrid"></div>
```

### Customizations

There is a stylesheet.css added, which you can add for an instant layout. This is optional.

You can change the canvas sizes by changing divWidth and divHeight, located on line 58 and 59. Make sure the width of the class .box is equal to divWidth.

```
var divWidth = 400;
var divHeight = 400;
```

## Technical Background

This is what happens behind the scenes:

* The code will read the JSON and save specific data (Location ID, Location, ID, Update Date, File UUID, Print ID and the Filename)
* The function init() will run, this is where the scene will be created, the camera will be set and the model will be selected
* Within the init() function, the model will automatically scale and position. Informative data from the JSON will be inserted in the div along with the model
* The animate() function will run and the models will be rendered

## Future Updates
* Interval refresh, this is handy for when the JSON file is dynamic
* Auto fill, this will automatically give the models a specific colour

## License
Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

Ties Aarts 2019 &copy;

