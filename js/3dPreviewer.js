var ourRequest = new XMLHttpRequest();

// Use the URL where your json is stored
ourRequest.open('GET', 'http://localhost:8888/3D%20Modeling/3D%20Printer%20Queue/real.json');
ourRequest.onload = function() {
  var queueData = JSON.parse(ourRequest.responseText);
  renderHTML(queueData);
};
ourRequest.send();


function renderHTML(data) {
  if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
  }

  var allJsonData = data;
  var increment = 0;

  allJsonData.forEach(function(levelOne) {

    var locationId = levelOne.id;
    var location = levelOne.display_name;

    levelOne.current_jobs.forEach(function(levelTwo) {

      var id = levelTwo.id;

      levelTwo.files.forEach(function(levelThree) {

        var updatedAt = levelThree.updated_at;
        var fileUuid = levelThree.uuid;
        var printId = levelThree.print_id;
        var fileName = levelThree.original_filename;
        increment += 1;

        init(locationId, location, id, updatedAt, fileUuid, printId, fileName, increment);
        animate();

      });
    });
  });
}



// Global Variables
var cameraTarget;
var scenes = [];
var cameras = [];
var renderers = [];



// This creates the camera, scene and loads the model
function init(LocationId, Location, Id, UpdatedAt, FileUuid, PrintId, FileName, Increment) {

  var divWidth = 400;
  var divHeight = 400;

  var insertHere = 'modelGrid';
  var modelClass = 'box';
  var modelId = 'model' + Increment;

  // Scene
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xB0DFE5);

  // Camera
  var camera = new THREE.PerspectiveCamera(45, divWidth / divHeight, 1, 15);
  cameraTarget = new THREE.Vector3(0, 0, 0);

  // Creates a div
  var modelContainer = document.createElement('div');
  modelContainer.className = modelClass; // Add class to the div
  modelContainer.id = modelId; // Add id to the div
  document.getElementById(insertHere).appendChild(modelContainer);

  // STL Loader - Load Model
  var filePath = 'api/public/location/' + LocationId + '/download/' + FileUuid +
  '/' + FileName;
  var loader = new THREE.STLLoader();
  loader.load(filePath, function(geometry) {
    var material = new THREE.MeshStandardMaterial({
      color: 0x551A8,
      roughness: 0.5,
      metalness: 0.1
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.set(0, -Math.PI / 2, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // This part auto scales the model
    var initBoundingBox = new THREE.Box3().setFromObject(mesh);

    var negX = initBoundingBox.min[Object.keys(initBoundingBox.min)[0]];
    var posX = initBoundingBox.max[Object.keys(initBoundingBox.max)[0]];
    var modelWidth = posX - (negX);

    var negY = initBoundingBox.min[Object.keys(initBoundingBox.min)[1]];
    var posY = initBoundingBox.max[Object.keys(initBoundingBox.max)[1]];
    var modelHeight = posY - (negY);

    if (modelWidth >= modelHeight) {
      // Scale based on the width
      var scaleFactor = 2 / modelWidth;
    } else {
      // Scale based on the height
      var scaleFactor = 1.5 / modelHeight;
    }
    mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Adjust model position on Y axis
    var boundingBox = new THREE.Box3().setFromObject(mesh);

    var newNegY = boundingBox.min[Object.keys(boundingBox.min)[1]];
    var newPosY = boundingBox.max[Object.keys(boundingBox.max)[1]];
    var newModelHeight = newPosY - (newNegY);

    var heightAdjust = (newModelHeight / 2) - newPosY;
    mesh.position.set(0, heightAdjust, 0);
    scene.add(mesh);
  });

  // Lights
  // HemisphereLight
  scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1));
  // AmbientLight
  var light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);
  // spotLight
  var spotLight = new THREE.SpotLight(0x404040);
  spotLight.position.set(100, 1000, 100);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);

  // OrbitControls
  var controls = new THREE.OrbitControls(camera);
  controls.minDistance = 2;
  controls.maxDistance = 5;
  controls.enablePan = false;
  controls.enableZoom = false;
  camera.position.set(3, 0.15, 3);
  controls.update();

  scenes.push(scene);
  cameras.push(camera);

  // Renderer
  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0x72C2FB, 1);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(divWidth, divHeight);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  renderers.push(renderer);

  modelContainer.appendChild(renderer.domElement);
  $("#" + modelId).append("<h2>" + FileName + "</h2>");
  $("#" + modelId).append("<h3>" + Location + "</h3>");
  $("#" + modelId).append("<p><span class='tag'>Job ID: </span><br>" + Id +
  "<br><span class='tag'>Print ID: </span><br>" + PrintId +
  "<br><span class='tag'>Updated At: </span><br>"+ UpdatedAt +
  "<br><span class='tag'>File UUID: </span><br>" + FileUuid +"</p>");
}



// This function runs the rendering
function animate() {
  render();
  requestAnimationFrame(animate);
}


// This function does the rendering
function render() {
  for (i = 0; i < scenes.length; i++) {
    var timer = Date.now() * 0.0005;
    cameras[i].position.x = Math.cos(timer) * 3;
    cameras[i].position.z = Math.sin(timer) * 3;
    cameras[i].lookAt(cameraTarget);
    renderers[i].render(scenes[i], cameras[i]);
  }
}
