import * as THREE from "/modules/three/three.module.js";
import { OBJLoader2 } from "/modules/three/OBJLoader2.js";
import { MTLLoader } from "/modules/three/MTLLoader.js";
import { MtlObjBridge } from "/modules/three/obj2/bridge/MtlObjBridge.js";

// loaders
let mtlLoader;
let objLoader;

export class Starfish {
  constructor() {
    this.starfish = new THREE.Group();
    let fishRotation = [Math.PI * -0.3, 0, 0];
    let fishPosition = [45, 15, 45];

    this.minX = -100 - fishPosition[0]; // -100 ~ 100
    this.maxX = 100 - fishPosition[0];
    this.minY = 30 - fishPosition[1]; // 30 ~ 170
    this.maxY = 170 - fishPosition[1];

    mtlLoader = new MTLLoader();
    mtlLoader.load("./assets/resources/seastar2.mtl", mtlParseResult => {
      objLoader = new OBJLoader2();
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      for (const material of Object.values(materials)) {
        material.side = THREE.DoubleSide;
      }
      objLoader.addMaterials(materials);
      objLoader.load("./assets/resources/seastar2.obj", root => {
        root.rotation.set(fishRotation[0], fishRotation[1], fishRotation[2]);
        root.position.set(fishPosition[0], fishPosition[1], fishPosition[2]);
        root.scale.set(0.3, 0.3, 0.3);
        this.starfish.add(root);
      });
    });
  }
}
