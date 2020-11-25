import * as THREE from "/modules/three/three.module.js";
const Pi = Math.PI;

export class Water {
  constructor() {
    this.groupNumber = 22;
    this.membersNumber = 20;
    this.depth = 450;
    this.step = 0.0015;

    this.mesh = new THREE.Object3D();
    this.objects = [];
    const step = (Pi * 2) / this.groupNumber;
    let angle, object, type, offset, depth;
    for (let j = 0; j < this.groupNumber; j++) {
      angle = step * j;
      offset = (Pi / 16) * (Math.random() * 0.4 + 0.8); // put the next object on random place
    }

    this.mesh.position.set(0, 50, 100);
    this.mesh.scale.set(1, 2, 1);
  }

  move(speed) {
    this.mesh.rotation.z += this.step * speed;
  }
}
