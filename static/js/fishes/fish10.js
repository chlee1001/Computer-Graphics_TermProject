import * as THREE from "/modules/three/three.module.js";
import { OBJLoader2 } from "/modules/three/OBJLoader2.js";
import { MTLLoader } from "/modules/three/MTLLoader.js";
import { MtlObjBridge } from "/modules/three/obj2/bridge/MtlObjBridge.js";

// loaders
let mtlLoader;
let objLoader;

export class Fish {
  constructor() {
    this.fish10 = new THREE.Group();
    let fishRotation = [Math.PI * -0.5, Math.PI * -0.1, 0];
    let fishPosition = [75, 40, 10];
    let fishScale = [3, 3, 3];
    let fish_size_ratio = 1;

    this.minX = -100 - fishPosition[0]; // -100 ~ 100
    this.maxX = 100 - fishPosition[0];
    this.minY = 30 - fishPosition[1]; // 30 ~ 170
    this.maxY = 170 - fishPosition[1];

    mtlLoader = new MTLLoader();
    mtlLoader.load(
      "./assets/resources/fish/fish10/13016_Yellowtai_ Damselfish_v2_l3.mtl",
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
          "./assets/resources/fish/fish10/13016_Yellowtai_ Damselfish_v2_l3.obj",
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
            this.fish10.add(root);
          }
        );
      }
    );
  }
}
