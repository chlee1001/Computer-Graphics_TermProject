import * as THREE from "/js/modules/three_rev.js";
import { OBJLoader2 } from "/js/modules/OBJLoader2.js";
import { MTLLoader } from "/js/modules/MTLLoader.js";
import { MtlObjBridge } from "/js/modules/obj2/bridge/MtlObjBridge.js";

// loaders
let mtlLoader;
let objLoader;

export class Fish {
  constructor() {
    this.fish7 = new THREE.Group();
    let fishRotation = [Math.PI * -0.5, 0, Math.PI * -0.2];
    let fishPosition = [20, 60, -20];
    let fishScale = [1.7, 1.7, 1.7];
    let fish_size_ratio = 1.5;

    this.minX = -100 - fishPosition[0]; // -100 ~ 100
    this.maxX = 100 - fishPosition[0];
    this.minY = 30 - fishPosition[1]; // 30 ~ 170
    this.maxY = 170 - fishPosition[1];
    this.speed = 10;

    mtlLoader = new MTLLoader();
    mtlLoader.load(
      "/assets/models/fish/fish7/12993_Long_Fin_White_Cloud_v1_l3.mtl",
      mtlParseResult => {
        objLoader = new OBJLoader2();
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(
          mtlParseResult
        );
        for (const material of Object.values(materials)) {
          material.side = THREE.DoubleSide;
        }
        objLoader.addMaterials(materials);
        objLoader.load(
          "/assets/models/fish/fish7/12993_Long_Fin_White_Cloud_v1_l3.obj",
          root => {
            root.rotation.set(
              fishRotation[0],
              fishRotation[1],
              fishRotation[2]
            );
            root.position.set(
              fishPosition[0],
              fishPosition[1],
              fishPosition[2]
            );
            root.scale.set(
              fish_size_ratio * fishScale[0],
              fish_size_ratio * fishScale[1],
              fish_size_ratio * fishScale[2]
            );
            this.fish7.add(root);
          }
        );
      }
    );
  }
}
