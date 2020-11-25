import * as THREE from "/modules/three/three.module.js";
import { OrbitControls } from "/modules/three/OrbitControls.js";
import { OBJLoader2 } from "/modules/three/OBJLoader2.js";
import { MTLLoader } from "/modules/three/MTLLoader.js";
import { MtlObjBridge } from "/modules/three/obj2/bridge/MtlObjBridge.js";

window.onload = function init() {
  let canvas = document.querySelector("#gl-canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  let scene = new THREE.Scene();
  scene.background = new THREE.Color("skyblue");
  let camera;
  let light;
  let controls;
  const tankCoord = [100, -100, 105, 0, 40, -40]; //x,-x,y,-y,z

  // loaders
  let mtlLoader;
  let objLoader;
  // Objects...
  let fishObjs = [];
  let fishMtls = [];
  let fishRotations = [];
  let fishPositions = [];
  let root;
  initThree();
  initObj();
  loadObjLoader();

  /**
   * Threejs 초기화 함수
   */

  function initThree() {
    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // camera.position.x = 2;
    // camera.position.y = 1;
    // camera.position.z = 2;
    camera.position.set(0, 10, 20);

    var clock = new THREE.Clock();

    controls = new OrbitControls(camera, canvas);

    addDirectionalLight();
    const loadingElem = document.querySelector("#loading");
    loadingElem.style.display = "none";

    function render(time) {
      requestAnimationFrame(render);

      time *= 0.001; // convert time to seconds

      // 창 크기에 따라 늘어나는 문제부터 해결해봅시다.
      // 먼저 카메라의 aspect(비율) 속성을 canvas의 화면 크기에 맞춰야 합니다
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      const fish = 10;
      if (
        scene.children[fish].position.x < tankCoord[0] &&
        scene.children[fish].position.x > tankCoord[1]
      ) {
        scene.children[fish].position.x += +0.1;
      }
      // console.log(scene.children[11].position);
      renderer.render(scene, camera);
    }
    requestAnimationFrame(render);
  }

  /**
   * Objects 초기화 함수
   */
  function initObj() {
    // fistTankSize

    fishObjs = [
      "/resources/fish/fish1/13003_Auriga_Butterflyfish_v1_L3.obj",
      "/resources/fish/fish2/13006_Blue_Tang_v1_l3.obj",
      "/resources/fish/fish3/13007_Blue-Green_Reef_Chromis_v2_l3.obj",
      "/resources/fish/fish4/13008_Clown_Goby_Citrinis_v1_l3.obj",
      "/resources/fish/fish5/13009_Coral_Beauty_Angelfish_v1_l3.obj",
      "/resources/fish/fish6/12265_Fish_v1_L2.obj",
      "/resources/fish/fish7/12993_Long_Fin_White_Cloud_v1_l3.obj",
      "/resources/fish/fish8/13013_Red_Head_Solon_Fairy_Wrasse_v1_l3.obj",
      "/resources/fish/fish9/13014_Six_Line_Wrasse_v1_l3.obj",
      "/resources/fish/fish10/13016_Yellowtai_ Damselfish_v2_l3.obj",
    ];
    fishMtls = [
      "/resources/fish/fish1/13003_Auriga_Butterflyfish_v1_L3.mtl",
      "/resources/fish/fish2/13006_Blue_Tang_v1_l3.mtl",
      "/resources/fish/fish3/13007_Blue-Green_Reef_Chromis_v2_l3.mtl",
      "/resources/fish/fish4/13008_Clown_Goby_Citrinis_v1_l3.mtl",
      "/resources/fish/fish5/13009_Coral_Beauty_Angelfish_v1_l3.mtl",
      "/resources/fish/fish6/12265_Fish_v1_L2.mtl",
      "/resources/fish/fish7/12993_Long_Fin_White_Cloud_v1_l3.mtl",
      "/resources/fish/fish8/13013_Red_Head_Solon_Fairy_Wrasse_v1_l3.mtl",
      "/resources/fish/fish9/13014_Six_Line_Wrasse_v1_l3.mtl",
      "/resources/fish/fish10/13016_Yellowtai_ Damselfish_v2_l3.mtl",
    ];
    fishRotations = [
      [Math.PI * -0.5, 0, Math.PI * -0.5],
      [Math.PI * -0.5, 0, 0],
      [Math.PI * -0.5, 0, 0],
      [Math.PI * -0.5, 0, 0],
      [Math.PI * -0.5, 0, 0],
      [Math.PI * -0.5, 0, Math.PI * -0.5],
      [Math.PI * -0.5, 0, 0],
      [Math.PI * -0.5, 0, 0],
      [Math.PI * -0.5, 0, 0],
      [Math.PI * -0.5, 0, 0],
    ];

    fishPositions = [
      [tankCoord[1], tankCoord[2], tankCoord[5]],
      [10, 11, 0],
      [30, 30, 0],
      [0, 15, 0],
      [-30, 50, 0],
      [-30, 45, 0],
      [-20, 30, 20],
      [20, 30, 20],
      [10, 40, 20],
      [30, 10, 20],
    ];
  }

  // 광원 효과
  function addDirectionalLight() {
    {
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
      const intensity = 1;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      scene.add(light);
    }
    {
      const color = 0xffffff;
      const intensity = 1;
      light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      // light.position.x = 5;
      // light.position.y = 5;
      // light.position.z = 5;
      // light.castShadow = true;
      scene.add(light);
      scene.add(light.target);
    }
  }

  // canvas의 원본 크기와 디스플레이 크기를 비교해 원본 크기를 변경할지 결정하는 함수
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
  }

  function loadObjLoader() {
    mtlLoader = new MTLLoader();
    mtlLoader.load("/resources/fishTank2/fishTank.mtl", mtlParseResult => {
      objLoader = new OBJLoader2();
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      for (const material of Object.values(materials)) {
        material.side = THREE.DoubleSide;
      }
      objLoader.addMaterials(materials);
      objLoader.load("/resources/fishTank2/fishTank.obj", root => {
        root.rotation.x = Math.PI * -0.5;
        root.scale.set(7, 10, 7);
        scene.add(root);

        // compute the box that contains all the stuff
        // from root and below
        const box = new THREE.Box3().setFromObject(root);
        // const height = Math.max(box.size().y, box.size().x);
        // const dist = height / (2 * Math.tan((camera.fov * Math.PI) / 360));
        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());

        console.log("boxSize: ", boxSize);
        console.log("boxCenter: ", boxCenter);

        // set the camera to frame the box
        frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

        // update the Trackball controls to handle the new size
        controls.target.copy(boxCenter);
        // controls.target.set(0, 70, 20);
        controls.autoRotate = false;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.minDistance = 5;
        controls.maxDistance = boxSize * 1.2;
        controls.update();
      });
    });

    for (var i = 0; i < fishObjs.length; i++) {
      fishObjLoader(
        fishMtls[i],
        fishObjs[i],
        fishRotations[i],
        fishPositions[i]
      );
    }
  }

  function fishObjLoader(fishMtl, fishObj, fishRotation, fishPosition) {
    mtlLoader = new MTLLoader();
    mtlLoader.load(fishMtl, mtlParseResult => {
      objLoader = new OBJLoader2();
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      for (const material of Object.values(materials)) {
        material.side = THREE.DoubleSide;
      }
      objLoader.addMaterials(materials);
      objLoader.load(fishObj, root => {
        root.rotation.set(fishRotation[0], fishRotation[1], fishRotation[2]);
        // move(root, fishPosition);
        root.position.set(fishPosition[0], fishPosition[1], fishPosition[2]);
        scene.add(root);
      });
    });
  }
};
