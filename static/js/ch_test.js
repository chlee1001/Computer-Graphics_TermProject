import * as THREE from "/modules/three/three.module.js";
import { OrbitControls } from "/modules/three/OrbitControls.js";
import { OBJLoader2 } from "/modules/three/OBJLoader2.js";
import { MTLLoader } from "/modules/three/MTLLoader.js";
import { MtlObjBridge } from "/modules/three/obj2/bridge/MtlObjBridge.js";
import { FirstPersonControls } from "/modules/three/obj2/FirstPersonControls.js";

import * as Fishes from "/js/fishes/fishes.js";
import { Water } from "/assets/Water2.js";

let canvas = document.querySelector("#gl-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

let scene = new THREE.Scene();
// scene.background = new THREE.Color("#000000");
// scene.background = new THREE.Color("skyblue");
// scene.background = new THREE.Color(0.8, 0.8, 0.8);
var path = "/assets/resources/background/";
var format = ".jpg";
var urls = [
  path + "px" + format,
  path + "nx" + format,
  path + "py" + format,
  path + "ny" + format,
  path + "pz" + format,
  path + "nz" + format,
];
scene.background = new THREE.CubeTextureLoader().load(urls);

let camera;
let light;
let controls;
let FPControls;
// loaders
let mtlLoader;
let objLoader;

let width = canvas.clientWidth;
let height = canvas.clientHeight;
let mousePos = { x: 0, y: 0 };
let bubbles = [];

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let food = 0;
let dirty = 0;
let cameraPostionTempZ;
let fishView = 0;
let fishViewFlag = 0;
let viewFlag = 0;
let unBlock = 0;

const clock = new THREE.Clock();
const blocker = document.querySelector("#blocker");
const instructions = document.querySelector("#instructions");

const params = {
  // color: "#00ffff",
  color: "#ffffff",
  scale: 4,
  flowX: 1,
  flowY: 1,
};

window.onload = function init() {
  // document.addEventListener("mousemove", handleMouseMove, false);
  initThree();
  initObj();
  render();

  document.addEventListener("keydown", keyCodeOn, false);

  // 로딩속도가 느린 장치를 위해서...
  var lodingInterval = setInterval(function () {
    if (loadingFlag == 1) clearTimeout(lodingInterval);
    else {
      loading();
    }
  }, 500);
};

let loadingFlag = 0;
function loading() {
  if (scene.children[15].children[1] != undefined) {
    scene.children[15].children[1].material.opacity = 0.3;
    // console.log(scene.children[16].children[1]);

    {
      // bubbles
      var textureCube = new THREE.CubeTextureLoader().load(urls);
      textureCube.format = THREE.RGBFormat;
      var geometry = new THREE.SphereGeometry(60, 32, 16);

      var shader = THREE.FresnelShader;
      var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

      uniforms["tCube"].value = textureCube;

      var material = new THREE.ShaderMaterial({
        // opacity: 1.0,
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
      });

      for (var i = 0; i < 50; i++) {
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
  }
}

/**
 * Threejs 초기화 함수
 */
function initThree() {
  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  controls = new OrbitControls(camera, canvas);
  controls.autoRotate = true;
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

function render() {
  if (unBlock == 1) {
    instructions.style.display = "none";
    blocker.style.display = "none";
  } else {
    instructions.style.display = "";
    blocker.style.display = "";
  }

  var timer = 0.0001 * Date.now();

  // 창 크기에 따라 늘어나는 문제부터 해결해봅시다.
  // 먼저 카메라의 aspect(비율) 속성을 canvas의 화면 크기에 맞춰야 합니다
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  if (fishView) {
    fishes.move();
    if (fishViewFlag == 0) {
      camera.position.set(0, 73, 5);
      camera.updateProjectionMatrix();
      viewFlag = 0;
      fishViewFlag = 1;
    } else FPControls.update(clock.getDelta());
  } else {
    if (food) {
      fishes.update(mousePos);
    } else fishes.move();

    if (viewFlag == 0) {
      camera.position.set(0, 73, cameraPostionTempZ);
      camera.updateProjectionMatrix();
      viewFlag = 1;
      fishViewFlag = 0;
    } else controls.update();
  }
  if (loadingFlag == 1) {
    dirty++; // 1초에  ~100개씩 증가..·
    // console.log(dirty);
    if (dirty >= 2000 && dirty < 2200) {
      scene.children[15].children[1].material.color.r = 0.3;
      scene.children[15].children[1].material.color.g = 1;
      scene.children[15].children[1].material.color.b = 0.5;
    } else if (dirty >= 2200) {
      if (confirm("물이 더러워졌습니다. 확인을 누르면 다시 깨끗해집니다.")) {
        scene.children[15].children[1].material.color.r = 1;
        scene.children[15].children[1].material.color.g = 1;
        scene.children[15].children[1].material.color.b = 1;
        dirty = 0;
      } else dirty -= 150;
    }

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

/**
 * Objects 초기화 함수
 */
function initObj() {
  createFishTank();
  createFish();
  // createWater();
  // createWater1();
  // createWater2();
  // createWater3();
}

// 광원 효과
function addDirectionalLight() {
  //0x06125d; // Dark Blue, 0xffffff; // White

  {
    // Set sky and ground light
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1.0;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    // Set the Sunlight
    const color = 0xffffff; // White
    const intensity = 0.6;
    light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
  }

  {
    // Set the Rectangular LED Light
    const color = 0x06125d; // Dark Blue
    const intensity = 10;
    const width = 140;
    const height = 70;
    light = new THREE.RectAreaLight(color, intensity, width, height);
    light.position.set(0, 100, 0);
    light.rotation.x = THREE.MathUtils.degToRad(-90);
    scene.add(light);
  }
}

// canvas의 원본 크기와 디스플레이 크기를 비교해 원본 크기를 변경할지 결정하는 함수
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

function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
  // compute a unit vector that points in the direction the camera is now
  // in the xz plane from the center of the box
  // 육면체의 중심에서 카메라가 있는 곳으로 향하는 방향 벡터를 계산합니다
  const direction = new THREE.Vector3()
    .subVectors(camera.position, boxCenter)
    .multiply(new THREE.Vector3(1, 0, 1))
    .normalize();

  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  // 방향 벡터에 따라 카메라를 육면체로부터 일정 거리에 위치시킵니다
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);

  cameraPostionTempZ = camera.position.z; // 시점 변경했을 때 최초의 카메라 위치로 돌아오기 위한 변수
}

function handleMouseMove(event) {
  const tx = -1 + (event.clientX / width) * 2;
  const ty = -(event.clientY / height) * 2;
  mousePos = { x: tx, y: ty };
}

function getMouseClickPos(event) {
  const tx = -1 + (event.clientX / width) * 2;
  const ty = -(event.clientY / height) * 2;
  // mousePos = { x: tx, y: ty };
  const rect = canvas.getBoundingClientRect();
  let clickposx = event.clientX - rect.left;
  let clickposy = event.clientY - rect.top;
  mousePos = { x: tx, y: 0 };
  console.log(mousePos);
}

function keyCodeOn(event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      moveForward = true;
      break;
    case 37: // left
    case 65: // a
      moveLeft = true;
      break;
    case 40: // down
    case 83: // s
      moveBackward = true;
      break;
    case 39: // right
    case 68: // d
      moveRight = true;
      break;
    case 70: // v입력시 1인칭 시점모드로
      fishView = 1;
      break;
    case 84: // t 입력시 3인칭 시점모드로
      fishView = 0;
      break;
    case 27: // ESC 입력시 화면 block
      unBlock = 0;
      break;
  }
}
{
  // 화면 block 해제
  document.addEventListener("click", function () {
    unBlock = 1;
  });
}
{
  // 추후 더블 클릭시 먹이 생성 및 생성좌표 전달 예정
  canvas.addEventListener("dblclick", function () {
    food = true;
    controls.autoRotate = false;
    getMouseClickPos(event);

    setTimeout(function () {
      food = false;
      controls.autoRotate = true;
    }, 10000);
  });
}

// fishtank의 투명도를 낮추고....확대????
function createFishTank() {
  mtlLoader = new MTLLoader();
  mtlLoader.load("/resources/fishTank2/fishTank.mtl", mtlParseResult => {
    const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
    console.log(materials);
    for (const material of Object.values(materials)) {
      material.side = THREE.DoubleSide;
    }
    objLoader = new OBJLoader2();
    objLoader.addMaterials(materials);
    objLoader.load("/resources/fishTank2/fishTank.obj", root => {
      root.rotation.x = Math.PI * -0.5;
      root.scale.set(7, 15, 7);

      scene.add(root);

      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);
      // const height = Math.max(box.size().y, box.size().x);
      // const dist = height / (2 * Math.tan((camera.fov * Math.PI) / 360));
      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.target.copy(boxCenter);
      // controls.target.set(0, 70, 20);
      controls.minDistance = 5;
      controls.maxDistance = boxSize * 1.2;
    });
  });
}

let fishes;
function createFish() {
  fishes = new Fishes.Fishes();
  fishes.createFishes(scene);
}

// let water;
// function createWater() {
//   // water
//   const waterGeometry = new THREE.PlaneBufferGeometry(20, 20);

//   water = new Water(waterGeometry, {
//     color: params.color,
//     // scale: params.scale,
//     // flowDirection: new THREE.Vector2(params.flowX, params.flowY),
//     textureWidth: 1024,
//     textureHeight: 1024,
//   });

//   water.position.set(0, 65, 85);
//   water.scale.set(10.5, 5.5, 10);
//   // water.rotation.set(0, 0, 0);
//   water.rotation.y = Math.PI;
//   scene.add(water);
//   console.log(water);
// }

// let water1;
// function createWater1() {
//   // water
//   const waterGeometry = new THREE.PlaneBufferGeometry(20, 20);

//   water1 = new Water(waterGeometry, {
//     color: params.color,
//     // scale: params.scale,
//     // flowDirection: new THREE.Vector2(params.flowX, params.flowY),
//     textureWidth: 1024,
//     textureHeight: 1024,
//   });

//   water1.position.set(0, 65, -85);
//   water1.scale.set(10.5, 5.5, 10);
//   water1.rotation.set(0, 0, 0);
//   // water.rotation.x = Math.PI * -0.5;
//   scene.add(water1);
//   console.log(water);
// }

// let water2;
// function createWater2() {
//   // water
//   const waterGeometry = new THREE.PlaneBufferGeometry(20, 20);

//   water2 = new Water(waterGeometry, {
//     color: params.color,
//     // scale: params.scale,
//     // flowDirection: new THREE.Vector2(params.flowX, params.flowY),
//     textureWidth: 1024,
//     textureHeight: 1024,
//   });

//   water2.position.set(100, 65, 0);
//   water2.scale.set(10.5, 5.5, 10);
//   // water.rotation.set(0, 0, 0);
//   water2.rotation.y = Math.PI * -0.5;
//   scene.add(water2);
//   console.log(water);
// }

// let water3;
// function createWater3() {
//   // water
//   const waterGeometry = new THREE.PlaneBufferGeometry(20, 20);

//   water3 = new Water(waterGeometry, {
//     color: params.color,
//     // scale: params.scale,
//     // flowDirection: new THREE.Vector2(params.flowX, params.flowY),
//     textureWidth: 1024,
//     textureHeight: 1024,
//   });

//   water3.position.set(-100, 65);
//   water3.scale.set(10.5, 5.5, 10);
//   water3.rotation.y = Math.PI * 0.5;
//   scene.add(water3);
//   console.log(water);
// }
