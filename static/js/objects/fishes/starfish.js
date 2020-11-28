import * as THREE from "/js/modules/three_rev.js";
import { OBJLoader2 } from "/js/modules/OBJLoader2.js";
import { MTLLoader } from "/js/modules/MTLLoader.js";
import { MtlObjBridge } from "/js/modules/obj2/bridge/MtlObjBridge.js";

// loaders
let mtlLoader;
let objLoader;

export class Starfish {
  constructor() {
    this.starfish = new THREE.Group();
    let fishRotation = [0, 0, 0];
    let fishPosition = [45, 20, 45];

    this.minX = -100 - fishPosition[0]; // -100 ~ 100
    this.maxX = 100 - fishPosition[0];
    this.minY = 30 - fishPosition[1]; // 30 ~ 170
    this.maxY = 170 - fishPosition[1];

    mtlLoader = new MTLLoader();
    mtlLoader.load("/assets/models/starfish/star.mtl", mtlParseResult => {
      objLoader = new OBJLoader2();
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      for (const material of Object.values(materials)) {
        material.side = THREE.DoubleSide;
      }
      objLoader.addMaterials(materials);
      objLoader.load("/assets/models/starfish/star.obj", root => {
        root.rotation.set(fishRotation[0], fishRotation[1], fishRotation[2]);
        root.position.set(fishPosition[0], fishPosition[1], fishPosition[2]);
        root.scale.set(30, 30, 30);
        this.starfish.add(root);
      });
    });
  }
}
