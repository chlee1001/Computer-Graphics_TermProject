import * as THREE from "/js/modules/three_rev.js";
import { OBJLoader2 } from "/js/modules/OBJLoader2.js";
import { MTLLoader } from "/js/modules/MTLLoader.js";
import { MtlObjBridge } from "/js/modules/obj2/bridge/MtlObjBridge.js";

// loaders
let mtlLoader;
let objLoader;

export class Fish {
  constructor() {
    this.fish6 = new THREE.Group();
    let fishRotation = [Math.PI * -0.5, 0, Math.PI * 0.5];
    let fishPosition = [30, 80, -10];
    let fishScale = [0.3, 0.3, 0.3];
    let fish_size_ratio = 1.5;

    this.minX = -100 - fishPosition[0]; // -100 ~ 100
    this.maxX = 100 - fishPosition[0];
    this.minY = 30 - fishPosition[1]; // 30 ~ 170
    this.maxY = 170 - fishPosition[1];
    this.speed = 5;
    mtlLoader = new MTLLoader();
    mtlLoader.load(
      "/assets/models/fish/fish6/12265_Fish_v1_L2.mtl",
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
          "/assets/models/fish/fish6/12265_Fish_v1_L2.obj",
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
            this.fish6.add(root);
          }
        );
      }
    );
  }
}
