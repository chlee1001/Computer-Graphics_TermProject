/*
************************* 성원's To do list *************************

1. 물이 더러워지고, 물을 가는 것 -> 채현님이 구현 해주심. (완료)
2. 배경화면을 Load하여 보자. (완료) -> 추후에 책상이 들어가있는 6 sided 된 배경화면을 구해보자.
3. 물고기의 scale을 노가다로 조정하여 보자. (완료)
4. water obj파일을 구하여 load & 어항 크기와 높이에 맞게 scale을 조정해보자. (진행중)
   -> 크기는 조정이 가능하나, 높이는 아무리 해도 늘어나질 않는다.
5. HTML에서 값을 받아와서, 물고기의 숫자를 조정하여보자. (예정)


*/

import * as THREE from "../assets/modules/three/three.module.js";
import { OrbitControls } from "../assets/modules/three/OrbitControls.js";
import { OBJLoader2 } from "../assets/modules/three/OBJLoader2.js";
import { MTLLoader } from "../assets/modules/three/MTLLoader.js";
import { MtlObjBridge } from "../assets/modules/three/obj2/bridge/MtlObjBridge.js";
import { GLTFLoader } from "../assets/modules/three/GLTFLoader.js";
import {RectAreaLightUniformsLib} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/helpers/RectAreaLightHelper.js';
import { Water } from "../assets/Water2.js";

/**************************************************************    Variables     ***********************************************************/

// Canvas
let canvas = document.querySelector("#gl-canvas");

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

// Scene
// 아래의 순서가 항상 일치해야 한다. (입체감있는 로드가 가능하다.)
// 우리가 수동으로 사진을 자르면, Load가 안된다. (지정된 program으로 알맞게 잘라야한다.)
// 6 sided 된 배경 사진을 찾는 것이 매우 힘들다.
const scene = new THREE.Scene();
scene.background = new
THREE.CubeTextureLoader()
  .setPath("../assets/resources/background/")
  .load([
  'px.jpg', 'nx.jpg',
  'py.jpg', 'ny.jpg',
  'pz.jpg', 'nz.jpg'
]);

// Global variable
let camera;
let light;
let controls;
let root;



// Loaders
let mtlLoader;
let objLoader;
let textureLoader;

// Fish Tank (x, -x, y, -y, z, -z)
const tankCoord = [100, -100, 105, 0, 40, -40];

// Fish
let fishObjs = [];
let fishMtls = [];
let fishTextures = [];
let fishRotations = [];
let fishPositions = [];
let fishScales = [];


// Water
let water_back;
let water_left;
let water_right;

const params = {
  color: "#ffffff",
  scale: 3000,
  flowX: 1,
  flowY: 1
};

/*****************************************************************************    Main     **************************************************************************/

window.onload = function init() {
  initThree();

  initObj();

  loadObjLoader();
};

/*****************************************************************************    Function   ***********************************************************/

/* Three js 초기화 함수 */
function initThree() {
  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 50;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.x = 2;
  // camera.position.y = 1;
  // camera.position.z = 2;
  camera.position.set(0, 0, 0);

  var clock = new THREE.Clock();

  controls = new OrbitControls(camera, canvas);

  addDirectionalLight();

  const loadingElem = document.querySelector("#loading");

  //loadingElem.style.display = "none";

  requestAnimationFrame(render);
}

/* 매시간마다 그려주는 함수 */
function render(time) {
  requestAnimationFrame(render);

  // convert time to seconds
  time *= 0.001;

  // 창 크기에 따라 늘어나는 문제부터 해결해봅시다.
  // 먼저 카메라의 aspect(비율) 속성을 canvas의 화면 크기에 맞춰야 합니다.
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  // scene.position.x += 0.01;
  renderer.render(scene, camera);
  controls.target.set(0, 30, 0);
  controls.autoRotate = false;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.minDistance = 5;
  controls.maxDistance = 200;
  controls.update();
}

/* Object Initialization */
function initObj() {
  fishObjs = [
    "./assets/resources/fish/fish1/13003_Auriga_Butterflyfish_v1_L3.obj",
    "./assets/resources/fish/fish2/13006_Blue_Tang_v1_l3.obj",
    "./assets/resources/fish/fish3/13007_Blue-Green_Reef_Chromis_v2_l3.obj",
    "./assets/resources/fish/fish4/13008_Clown_Goby_Citrinis_v1_l3.obj",
    "./assets/resources/fish/fish5/13009_Coral_Beauty_Angelfish_v1_l3.obj",
    "./assets/resources/fish/fish6/12265_Fish_v1_L2.obj",
    "./assets/resources/fish/fish7/12993_Long_Fin_White_Cloud_v1_l3.obj",
    "./assets/resources/fish/fish8/13013_Red_Head_Solon_Fairy_Wrasse_v1_l3.obj",
    "./assets/resources/fish/fish9/13014_Six_Line_Wrasse_v1_l3.obj",
    "./assets/resources/fish/fish10/13016_Yellowtai_ Damselfish_v2_l3.obj",
  ];
  fishMtls = [
    "./assets/resources/fish/fish1/13003_Auriga_Butterflyfish_v1_L3.mtl",
    "./assets/resources/fish/fish2/13006_Blue_Tang_v1_l3.mtl",
    "./assets/resources/fish/fish3/13007_Blue-Green_Reef_Chromis_v2_l3.mtl",
    "./assets/resources/fish/fish4/13008_Clown_Goby_Citrinis_v1_l3.mtl",
    "./assets/resources/fish/fish5/13009_Coral_Beauty_Angelfish_v1_l3.mtl",
    "./assets/resources/fish/fish6/12265_Fish_v1_L2.mtl",
    "./assets/resources/fish/fish7/12993_Long_Fin_White_Cloud_v1_l3.mtl",
    "./assets/resources/fish/fish8/13013_Red_Head_Solon_Fairy_Wrasse_v1_l3.mtl",
    "./assets/resources/fish/fish9/13014_Six_Line_Wrasse_v1_l3.mtl",
    "./assets/resources/fish/fish10/13016_Yellowtai_ Damselfish_v2_l3.mtl",
  ];
  fishTextures = [
    "../assets/resources/fish/fish1/13003_Auriga_Butterflyfish_diff.jpg",
    "../assets/resources/fish/fish2/13006_Blue_Tang_v1_diff.jpg",
    "../assets/resources/fish/fish3/13004_Bicolor_Blenny_v1_diff.jpg",
    "../assets/resources/fish/fish4/13008_Clown_Goby_Citrinis_v1_diff.jpg",
    "../assets/resources/fish/fish5/13009_Coral_Beauty_Angelfish_v1_diff.jpg",
    "../assets/resources/fish/fish6/fish.jpg",
    "../assets/resources/fish/fish7/12993_Long-Fin_diffuse.jpg",
    "../assets/resources/fish/fish8/13013_Red-Head-Solon_diffuse.jpg",
    "../assets/resources/fish/fish9/13014_Six_Line_Wrasse_v1_diff.jpg",
    "../assets/resources/fish/fish10/13016_Yellowtai_ Damselfish_v1_diff.jpg",
  ];
  fishRotations = [
    [Math.PI * -0.5, 0, Math.PI * -0.3],
    [Math.PI * -0.5, Math.PI * -0.1, Math.PI * -0.5],
    [Math.PI * -0.5, Math.PI * 0.1, Math.PI * -0.8],
    [Math.PI * -0.5, 0, Math.PI * 0.3],
    [Math.PI * -0.5, Math.PI * 0.1, 0],
    [Math.PI * -0.3, Math.PI * 0, Math.PI * 0.2],
    [Math.PI * -0.5, 0, Math.PI * -0.2],
    [Math.PI * -0.5, Math.PI * -0.1, Math.PI * -0.7],
    [Math.PI * -0.5, 0, Math.PI * -0.3],
    [Math.PI * -0.5, Math.PI * -0.1, 0],
  ];

  /* 물고기들 일렬로 세워놓고 싶을때
  fishPositions = [
    [-70, 60, 0],
    [-60, 60, 10],
    [-50, 60, 20],
    [-30, 60, 30],
    [-10, 60, 0],
    [0, 60, -10],
    [20, 60, -20],
    [40, 60, -30],
    [60, 60, 0],
    [70, 60, 10]
  ];
  */

  //* 물고기들 정해진 위치
  fishPositions = [
    [-65, 80, 0],
    [-70, 60, 10],
    [-50, 70, 20],
    [-30, 60, 30],
    [-10, 70, 0],
    [0, 80, -10],
    [20, 60, -20],
    [40, 30, -30],
    [60, 20, 0],
    [75, 40, 10],
  ];
  //*/

  fishScales = [
    [0.5, 0.5, 0.5],
    [0.8, 0.8, 0.8],
    [1.5, 1.5, 1.5],
    [3,3,3],
    [8, 8, 8],
    [0.3, 0.3, 0.3],
    [1.7, 1.7, 1.7],
    [0.8, 0.8, 0.8],
    [1, 1, 1],
    [3, 3, 3],
  ];

  createWater();

}

/* Illumination Effect */
function addDirectionalLight() {

//0x06125d; // Dark Blue, 0xffffff; // White

  { // Set sky and ground light
    const skyColor = 0xb1e1ff;    // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1.0;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);}

  { // Set the Sunlight
    const color = 0xffffff; // White
    const intensity = 0.6;
    light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);}

  { // Set the Rectangular LED Light
    const color = 0x06125d;; // Dark Blue
    const intensity = 10;
    const width = 140;
    const height = 70;
    light = new THREE.RectAreaLight(color, intensity, width, height);
    light.position.set(0, 100, 0);
    light.rotation.x = THREE.MathUtils.degToRad(-90);
    scene.add(light);

    // LED 조명에 대해서 위치에 사각형을 그려준다.
    // 실제로는 지워도 조명은 정상 동작한다.
    const helper = new RectAreaLightHelper(light);
    light.add(helper);}

}

/* canvas의 원본 크기와 디스플레이 크기를 비교해 원본 크기를 변경할지 결정하는 함수 */
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
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
  const direction = new THREE.Vector3()
    .subVectors(camera.position, boxCenter)
    .multiply(new THREE.Vector3(1, 0, 1))
    .normalize();

  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

/* Obj file Load */
function loadObjLoader() {
  mtlLoader = new MTLLoader();
  mtlLoader.load(
    "../assets/resources/fishTank2/fishTank.mtl",
    mtlParseResult => {
      objLoader = new OBJLoader2();
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      for (const material of Object.values(materials)) {
        material.side = THREE.DoubleSide;
      }
      objLoader.addMaterials(materials);
      objLoader.load("../assets/resources/fishTank2/fishTank.obj", root => {
        root.rotation.x = Math.PI * -0.5;
        root.scale.set(5, 7, 6);
        //root.scale.set(5, 8, 5);
        scene.add(root);

        // compute the box that contains all the stuff
        // from root and below
        const box = new THREE.Box3().setFromObject(root);
        const height = Math.max(box.size().y, box.size().x);
        const dist = height / (2 * Math.tan((camera.fov * Math.PI) / 360));
        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());

        // set the camera to frame the box
        frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

        // update the Trackball controls to handle the new size
        controls.maxDistance = boxSize * 10;
        controls.target.copy(boxCenter);
        controls.update();
      });
    }
  );

  for (var i = 0; i < fishObjs.length; i++) {
    fishObjLoader(
      fishMtls[i],
      fishObjs[i],
      fishRotations[i],
      fishPositions[i],
      fishTextures[i],
      fishScales[i]
    );
  }
}

function fishObjLoader(
  fishMtls,
  fishObjs,
  fishRotations,
  fishPositions,
  fishTextures,
  fishScales
) {
  mtlLoader = new MTLLoader();
  mtlLoader.load(fishMtls, mtlParseResult => {
    objLoader = new OBJLoader2();
    const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
    for (const material of Object.values(materials)) {
      material.side = THREE.DoubleSide;
    }
    objLoader.addMaterials(materials);
    objLoader.load(fishObjs, root => {
      // 나중에 물고기의 크기를 한번에 변경할 때 쓰인다.
      const fish_size_ratio = 1.0;
      root.rotation.set(fishRotations[0], fishRotations[1], fishRotations[2]);
      root.position.set(fishPositions[0], fishPositions[1], fishPositions[2]);
      root.scale.set(fish_size_ratio*fishScales[0], fish_size_ratio*fishScales[1], fish_size_ratio*fishScales[2]);
      scene.add(root);
    });
  });
}

//앞면
  //water.position.set(0, 42.5, 41);

// water가 아닌 유리면처럼 사용해볼까?
function createWater() {
  const waterGeometry = new THREE.PlaneBufferGeometry(20, 20);
  water_back = new Water(waterGeometry, {
    color: params.color,
    scale: params.scale,
    flowDirection: new THREE.Vector2(params.flowX, params.flowY),
    textureWidth: 200,
    textureHeight: 100,
  });


  water_left = new Water(waterGeometry, {
    color: params.color,
    scale: params.scale,
    flowDirection: new THREE.Vector2(params.flowX, params.flowY),
    textureWidth: 200,
    textureHeight: 100,
  });

  // 로딩이 완료된 순간을 기준으로 한다.

  /*// 뒷 면
  water_back.position.set(0, 52.5, -42);
  water_back.scale.set(5, 7.7, 5.5);
  water_back.rotation.z = Math.PI * -0.5;
  scene.add(water_back);
  */

  // 왼쪽면
  water_left.position.set(-80, 65, 0);
  water_left.scale.set(4.5, 4.5, 5.5);
  water_left.rotation.y = Math.PI * -0.5;
  scene.add(water_left);

}
