import * as THREE from "/js/modules/three_rev.js";
import { OrbitControls } from "/js/modules/OrbitControls.js";
import { OBJLoader2 } from "/js/modules/OBJLoader2.js";
import { MTLLoader } from "/js/modules/MTLLoader.js";
import { MtlObjBridge } from "/js/modules/obj2/bridge/MtlObjBridge.js";
import { FirstPersonControls } from "/js/modules/obj2/FirstPersonControls.js";
import * as Fishes from "/js/objects/fishes/fishes.js";
import { Water } from "/js/objects/water/Water2.js";

// Canvas
let canvas = document.querySelector("#gl-canvas");

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(new THREE.Color(0x000000));
renderer.shadowMap.enabled = true;

// Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color("black");

// Global variables
let camera;
let light;
let controls;
let FPControls;
let fishes;
let water;

let dirty = 0;
let dirtyTimer = 0;
let cameraPostionTempZ;
let fishView = 0;
let fishViewFlag = 0;
let viewFlag = 0;
let unBlock = 0;

// Loaders
let mtlLoader;
let objLoader;

// Control variables
let width = canvas.clientWidth;
let height = canvas.clientHeight;
let bubbles = [];

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Constant
const objNum = 17;
const clock = new THREE.Clock();
const blocker = document.querySelector("#blocker");
const instructions = document.querySelector("#instructions");

// Bubble Texture
var path = "/assets/models/background/";
var format = ".png";
var urls = [
  path + "px" + format,
  path + "nx" + format,
  path + "py" + format,
  path + "ny" + format,
  path + "pz" + format,
  path + "nz" + format,
];

// Water Suface Parameters
const params = {
  color: "#ffffff",
  scale: 4,
  flowX: 1,
  flowY: 1,
};

/* Main Function */
window.onload = function init() {
  initThree();
  initObj();
  render();

  document.addEventListener("keydown", keyCodeOn, false);

  var lodingInterval = setInterval(function () {
    if (loadingFlag == 1) clearTimeout(lodingInterval);
    else loading();
  }, 500);
};

/* Loading Function */
let loadingFlag = 0;
let loadingCnt = 0;
function loading() {
  // console.log(scene.children);
  if (scene.children[objNum].children[1] != undefined) {
    scene.children[objNum].children[1].material.opacity = 0.35;
    scene.children[objNum].children[1].material.color.r = 0.1;
    scene.children[objNum].children[1].material.color.g = 0.2;
    scene.children[objNum].children[1].material.color.b = 0.7;
    {
      //Bubbles
      var textureCube = new THREE.CubeTextureLoader().load(urls);
      textureCube.format = THREE.RGBFormat;
      var geometry = new THREE.SphereGeometry(10, 32, 16);
      var shader = THREE.FresnelShader;
      var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
      uniforms["tCube"].value = textureCube;
      var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
      });
      for (var i = 0; i < 20; i++) {
        var bubble = new THREE.Mesh(geometry, material);
        bubble.position.set(
          75 + -25 * Math.random(),
          20 * Math.random() * 5,
          50 * Math.random()
        );
        bubble.scale.x = bubble.scale.y = bubble.scale.z = Math.random() * 0.1;
        scene.add(bubble);
        bubbles.push(bubble);
      }
    }
    const loadingElem = document.querySelector("#loading");
    loadingElem.style.display = "none";
    loadingFlag = 1;
  } else {
    loadingCnt++;
    if (loadingCnt > 6) {
      console.log("page error. Reloading..");
      window.location.reload(true);
    }
  }
}

/* Initialize Three.js Function */
function initThree() {
  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 100;

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  controls = new OrbitControls(camera, canvas);
  controls.autoRotateSpeed = 0.8;
  controls.enableDamping = true;
  controls.rotateSpeed = 0.3;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.enableKeys = false;

  FPControls = new FirstPersonControls(camera, canvas);
  FPControls.movementSpeed = 50;
  FPControls.lookSpeed = 0.05;
  FPControls.lookVertical = true;
  FPControls.constrainVertical = true;
  FPControls.verticalMin = 1.0;
  FPControls.verticalMax = 2.0;

  addDirectionalLight();
}

/* Every seconds Function : Window Size, Fish View, User Movement, Water Dirty, Bubble */
function render() {
  // User manual Pop up screen
  if (unBlock == 1) {
    instructions.style.display = "none";
    blocker.style.display = "none";
  } else {
    instructions.style.display = "";
    blocker.style.display = "";
  }
  // Timer
  var timer = 0.0001 * Date.now();
  // Window size
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  // Fish View
  if (fishView) {
    fishes.move();
    if (fishViewFlag == 0) {
      camera.position.set(0, 73, 5);
      camera.updateProjectionMatrix();
      viewFlag = 0;
      fishViewFlag = 1;
    } else FPControls.update(clock.getDelta());
  } else {
    fishes.move();

    if (viewFlag == 0) {
      camera.position.set(0, 73, cameraPostionTempZ);
      camera.updateProjectionMatrix();
      viewFlag = 1;
      fishViewFlag = 0;
    } else controls.update();
  }
  // Increase the water dirty value
  if (loadingFlag == 1) {
    dirtyTimer++;
    document.getElementById("timer").textContent =
      (dirtyTimer / 20).toFixed(1) + " % ";
    if (dirtyTimer >= 1500) {
      dirty = 1;
    }

    if (dirtyTimer >= 1500 && dirtyTimer < 2000) {
      dirty = 1;
      scene.children[objNum].children[1].material.color.r = 0.6;
      scene.children[objNum].children[1].material.color.g = 0.8;
      scene.children[objNum].children[1].material.color.b = 0.8;
    } else if (dirtyTimer >= 2000) {
      if (confirm("Water is too dirty. Refresh the water!")) {
        scene.children[objNum].children[1].material.color.r = 0.1;
        scene.children[objNum].children[1].material.color.g = 0.2;
        scene.children[objNum].children[1].material.color.b = 0.7;
        dirtyTimer = 0;
      }
    }
    // Draw Bubbles
    for (var i = 0, il = bubbles.length; i < il; i++) {
      var bubble = bubbles[i];
      bubble.position.x = 100 * Math.cos(timer + i);
      bubble.position.y = 70 + 40 * Math.sin(timer + i * 1.1);
      bubble.position.z = 60 * Math.cos(timer + i);
    }
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

/* Initialize the OBJ model */
function initObj() {
  createFishTank();
  createFish();
  createTable();
  createWater();
}

/* Illumination Effects */
function addDirectionalLight() {
  {
    // Set Natural light
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1.0;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const light = new THREE.SpotLight(0xffffff, 10);
    light.position.set(0, 200, 0);
    light.castShadow = true;
    light.penumbra = 0.3;
    light.distance = 120;
    light.shadow.mapSize = new THREE.Vector2(1024, 1024);
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 500;
    light.shadow.camera.far = 4000;
    light.shadow.camera.fov = 30;
    light.target.position.set(0, 120, 0);
    scene.add(light);
    scene.add(light.target);
  }

  /*
  {// Set the Sunlight
    const color = 0xffffff; // White
    const intensity = 1;
    light = new THREE.DirectionalLight(color, intensity);
    light.castShdow = true;
    light.shadow.mapSize = new THREE.Vector2(1024,1024);
    light.position.set(150, 150, -50);
    light.target.position.set(0, 120, 0);
    scene.add(light);
    scene.add(light.target);}
    */

  {
    // Fish Tank Light
    const color = 0x06125d;
    const intensity = 20;
    const distance = 100;
    const light = new THREE.PointLight(color, intensity, distance);
    light.castShdow = true;
    light.shadow.mapSize = new THREE.Vector2(1024, 1024);
    light.position.set(0, 70, 0);
    scene.add(light);
  }
}

/* Resize the Renderer to display size */
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

/* Fit the Initialized the Fish Tank at the center of window size */
function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

  // Compute a unit vector that points
  // In the direction the camera is now in the x, z plane from the center of the box
  const direction = new THREE.Vector3()
    .subVectors(camera.position, boxCenter)
    .multiply(new THREE.Vector3(1, 0, 1))
    .normalize();

  // Move the camera to a position distance units way
  // From the center in whatever direction the camera was from the center already
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // Pick some near and far values for the frustum
  // That will contain the box
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // Point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);

  // Variable to return to the initial camera position
  // When the viewpoint is changed
  cameraPostionTempZ = camera.position.z;
}

/* User Interaction Function */
function keyCodeOn(event) {
  switch (event.keyCode) {
    case 38: // Up
    case 87: // w
      moveForward = true;
      break;
    case 37: // Left
    case 65: // a
      moveLeft = true;
      break;
    case 40: // Down
    case 83: // s
      moveBackward = true;
      break;
    case 39: // Right
    case 68: // d
      moveRight = true;
      break;
    case 70: // f : First person view
      fishView = 1;
      break;
    case 84: // t : Third person view
      fishView = 0;
      break;
    case 27: // ESC : Pause
      unBlock = 0;
      break;
  }
}
{
  // Remove popup window when clicking on the screen
  document.addEventListener("click", function () {
    unBlock = 1;
  });

  document.getElementById("refair_btn").onclick = function () {
    if (dirty == 0) {
      alert("Water is already Clean");
    } else {
      dirty = 0;
      dirtyTimer = 0;
      scene.children[objNum].children[1].material.color.r = 0.1;
      scene.children[objNum].children[1].material.color.g = 0.2;
      scene.children[objNum].children[1].material.color.b = 0.7;
      alert("The fish are happy");
    }
  };
}

/* Create the Fish Tank */
function createFishTank() {
  mtlLoader = new MTLLoader();
  mtlLoader.load("/assets/models/fishTank/fishTank.mtl", mtlParseResult => {
    const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
    // console.log(materials);
    for (const material of Object.values(materials)) {
      material.side = THREE.DoubleSide;
    }
    objLoader = new OBJLoader2();
    objLoader.addMaterials(materials);
    objLoader.load("/assets/models/fishTank/fishTank.obj", root => {
      root.rotation.x = Math.PI * -0.5;
      root.scale.set(7, 15, 7);
      root.receiveShadow = true;
      root.castShadow = true;
      scene.add(root);

      // Compute the box that contains all the stuff
      // From root and below
      const box = new THREE.Box3().setFromObject(root);
      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // Set the camera to frame the box
      frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

      // Update the Trackball controls to handle the new size
      controls.target.copy(boxCenter);
      controls.minDistance = 5;
      controls.maxDistance = boxSize * 1.2;
    });
  });
}

/* Create the table that located under the Fish Tank */
function createTable() {
  mtlLoader = new MTLLoader();
  mtlLoader.load("/assets/models/table/table.mtl", mtlParseResult => {
    const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
    // console.log(materials);
    for (const material of Object.values(materials)) {
      material.side = THREE.DoubleSide;
    }
    objLoader = new OBJLoader2();
    objLoader.addMaterials(materials);
    objLoader.load("/assets/models/table/table.obj", root => {
      root.scale.set(140, 140, 140);
      root.rotation.y = Math.PI * 0.25;
      root.position.set(0, -194, 0);
      root.receiveShadow = true;
      scene.add(root);
    });
  });
}

/* Create the Fish */
function createFish() {
  fishes = new Fishes.Fishes();
  fishes.createFishes(scene);
}

/* Create the Water Surface */
function createWater() {
  const waterGeometry = new THREE.PlaneBufferGeometry(20, 20);
  water = new Water(waterGeometry, {
    color: params.color,
    textureWidth: 1024,
    textureHeight: 1024,
  });
  water.castShadow = true;
  water.receiveShadow = true;
  water.position.set(0, 110, 0);
  water.scale.set(10.5, 8, 1);
  water.rotation.x = Math.PI * 0.5;
  scene.add(water);
  // console.log(water);
}
