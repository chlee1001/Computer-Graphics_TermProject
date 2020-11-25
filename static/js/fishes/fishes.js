import * as Helper from "/js/fishes/helpers.js";
import * as fishex from "/js/fishes/Fish.js";
import * as Fish1 from "/js/fishes/fish1.js";
import * as Fish2 from "/js/fishes/fish2.js";
import * as Fish3 from "/js/fishes/fish3.js";
import * as Fish4 from "/js/fishes/fish4.js";
import * as Fish5 from "/js/fishes/fish5.js";
import * as Fish6 from "/js/fishes/fish6.js";
import * as Fish7 from "/js/fishes/fish7.js";
import * as Fish8 from "/js/fishes/fish8.js";
import * as Fish9 from "/js/fishes/fish9.js";
import * as Fish10 from "/js/fishes/fish10.js";

let fishes = [10];
let fishes_ = [10];
let fish_test;
let fish_test_1;
let speed = 0;

export class Fishes {
  createFishes(scenes) {
    fish_test = new fishex.Fish();
    scenes.add(fish_test.mesh);
    fish_test_1 = fish_test.mesh;

    fishes[0] = new Fish1.Fish();
    fishes_[0] = fishes[0].fish1;
    scenes.add(fishes_[0]);

    fishes[1] = new Fish2.Fish();
    fishes_[1] = fishes[1].fish2;
    scenes.add(fishes_[1]);

    fishes[2] = new Fish3.Fish();
    fishes_[2] = fishes[2].fish3;
    scenes.add(fishes_[2]);

    fishes[3] = new Fish4.Fish();
    fishes_[3] = fishes[3].fish4;
    scenes.add(fishes_[3]);

    fishes[4] = new Fish5.Fish();
    fishes_[4] = fishes[4].fish5;
    scenes.add(fishes_[4]);

    fishes[5] = new Fish6.Fish();
    fishes_[5] = fishes[5].fish6;
    scenes.add(fishes_[5]);

    fishes[6] = new Fish7.Fish();
    fishes_[6] = fishes[6].fish7;
    scenes.add(fishes_[6]);

    fishes[7] = new Fish8.Fish();
    fishes_[7] = fishes[7].fish8;
    scenes.add(fishes_[7]);

    fishes[8] = new Fish9.Fish();
    fishes_[8] = fishes[8].fish9;
    scenes.add(fishes_[8]);

    fishes[9] = new Fish10.Fish();
    fishes_[9] = fishes[9].fish10;
    scenes.add(fishes_[9]);

    return scenes;
  }

  move() {
    const timer = Date.now() * 0.0001;
    const random = Math.random * 10;
    speed += 0.001;

    /* Fish 1 */
    {
      // console.log("좌표", fishes_[0].position);
      fishes_[0].position.x = 10 * Math.cos(speed);
      fishes_[0].position.y = -10 + 25 * Math.cos(speed);
      fishes_[0].rotation.y = timer * fishes[0].speed;
    }

    /* Fish 2 */
    {
      fishes_[1].position.x = 25 * Math.cos(speed);
      fishes_[1].position.y = -10 + 25 * Math.cos(speed);
      fishes_[1].rotation.y = -(timer * fishes[1].speed);
      // fishes_[1].rotation.set(timer * fishes[1].speed, 0, 0);
    }

    /* Fish 3 */
    {
      fishes_[2].position.x = 25 * Math.cos(speed);
      fishes_[2].position.y = -10 + 25 * Math.cos(speed);
      fishes_[2].rotation.y = -(timer * fishes[2].speed);
    }

    /* Fish 4 */
    {
      fishes_[3].position.x = 25 * Math.cos(speed);
      fishes_[3].position.y = -10 + 25 * Math.cos(speed);
      fishes_[3].rotation.y = timer * fishes[3].speed;
    }

    /* Fish 5 */
    {
      fishes_[4].position.x = 100 * Math.cos(speed);
      fishes_[4].position.y = -10 + 25 * Math.cos(speed);
      fishes_[4].rotation.y = timer * fishes[4].speed;
    }

    /* Fish 6 */
    {
      fishes_[5].position.x = 50 * Math.cos(speed);
      fishes_[5].position.y = -10 + 25 * Math.cos(speed);
      fishes_[5].rotation.y = -timer * fishes[5].speed;
    }
  }

  update(mousePos) {
    fish_test_1.rotation.x += 0.005;
    let fish_test_targetX = Helper.normalize(
      mousePos.x,
      -1,
      1,
      fish_test.minX,
      fish_test.maxX
    );
    let fish_test_targetY = Helper.normalize(
      mousePos.y,
      -1,
      1,
      fish_test.minY,
      fish_test.maxY
    );

    /* Fish 1 */
    {
      fishes_[0].rotation.x += 0.005;
      let fish1_targetX = Helper.normalize(
        mousePos.x,
        -1,
        1,
        fishes[0].minX,
        fishes[0].maxX
      );
      let fish1_targetY = Helper.normalize(
        mousePos.y,
        -1,
        1,
        fishes[0].minY,
        fishes[0].maxY
      );

      fishes_[0].position.y += (fish1_targetY - fishes_[0].position.y) * 0.002;
      fishes_[0].position.x += (fish1_targetX - fishes_[0].position.x) * 0.003;
      fishes_[0].rotation.z = (fish1_targetY - fishes_[0].position.y) * 0.005;
      fishes_[0].rotation.x = (fishes_[0].position.x - fish1_targetX) * 0.0025;
    }

    /* Fish 2 */
    {
      fishes_[1].rotation.x += 0.005;
      let fish2_targetX = Helper.normalize(
        mousePos.x,
        -1,
        1,
        fishes[1].minX,
        fishes[1].maxX
      );
      let fish2_targetY = Helper.normalize(
        mousePos.y,
        -1,
        1,
        fishes[1].minY,
        fishes[1].maxY
      );

      fishes_[1].position.y += (fish2_targetY - fishes_[1].position.y) * 0.002;
      fishes_[1].position.x += (fish2_targetX - fishes_[1].position.x) * 0.003;
      fishes_[1].rotation.z = (fish2_targetY - fishes_[1].position.y) * 0.005;
      fishes_[1].rotation.x = (fishes_[1].position.x - fish2_targetX) * 0.0025;
    }
    /* Fish 3 */
    {
      fishes_[2].rotation.x += 0.005;
      let fish3_targetX = Helper.normalize(
        mousePos.x,
        -1,
        1,
        fishes[2].minX,
        fishes[2].maxX
      );
      let fish3_targetY = Helper.normalize(
        mousePos.y,
        -1,
        1,
        fishes[2].minY,
        fishes[2].maxY
      );

      fishes_[2].position.y += (fish3_targetY - fishes_[2].position.y) * 0.002;
      fishes_[2].position.x += (fish3_targetX - fishes_[2].position.x) * 0.003;
      fishes_[2].rotation.z = (fish3_targetY - fishes_[2].position.y) * 0.005;
      fishes_[2].rotation.x = (fishes_[2].position.x - fish3_targetX) * 0.0025;
    }
    /* Fish 4 */
    {
      fishes_[3].rotation.x += 0.005;
      let fish4_targetX = Helper.normalize(
        mousePos.x,
        -1,
        1,
        fishes[3].minX,
        fishes[3].maxX
      );
      let fish4_targetY = Helper.normalize(
        mousePos.y,
        -1,
        1,
        fishes[3].minY,
        fishes[3].maxY
      );

      fishes_[3].position.y += (fish4_targetY - fishes_[3].position.y) * 0.002;
      fishes_[3].position.x += (fish4_targetX - fishes_[3].position.x) * 0.003;
      fishes_[3].rotation.z = (fish4_targetY - fishes_[3].position.y) * 0.005;
      fishes_[3].rotation.x = (fishes_[3].position.x - fish4_targetX) * 0.0025;
    }

    /* Fish 5 */
    {
      fishes_[4].rotation.x += 0.005;
      let fish5_targetX = Helper.normalize(
        mousePos.x,
        -1,
        1,
        fishes[4].minX,
        fishes[4].maxX
      );
      let fish5_targetY = Helper.normalize(
        mousePos.y,
        -1,
        1,
        fishes[4].minY,
        fishes[4].maxY
      );

      fishes_[4].position.y += (fish5_targetY - fishes_[4].position.y) * 0.002;
      fishes_[4].position.x += (fish5_targetX - fishes_[4].position.x) * 0.003;
      fishes_[4].rotation.z = (fish5_targetY - fishes_[4].position.y) * 0.005;
      fishes_[4].rotation.x = (fishes_[4].position.x - fish5_targetX) * 0.0025;
    }
    /* Fish 6 */
    {
      fishes_[5].rotation.x += 0.005;
      let fish6_targetX = Helper.normalize(
        mousePos.x,
        -1,
        1,
        fishes[5].minX,
        fishes[5].maxX
      );
      let fish6_targetY = Helper.normalize(
        mousePos.y,
        -1,
        1,
        fishes[5].minY,
        fishes[5].maxY
      );

      fishes_[5].position.y += (fish6_targetY - fishes_[5].position.y) * 0.002;
      fishes_[5].position.x += (fish6_targetX - fishes_[5].position.x) * 0.003;
      fishes_[5].rotation.z = (fish6_targetY - fishes_[5].position.y) * 0.005;
      fishes_[5].rotation.x = (fishes_[5].position.x - fish6_targetX) * 0.0025;
    }
    /* Fish 7 */
    {
      fishes_[6].rotation.x += 0.005;
      let fish7_targetX = Helper.normalize(
        mousePos.x,
        -1,
        1,
        fishes[6].minX,
        fishes[6].maxX
      );
      let fish7_targetY = Helper.normalize(
        mousePos.y,
        -1,
        1,
        fishes[6].minY,
        fishes[6].maxY
      );

      fishes_[6].position.y += (fish7_targetY - fishes_[6].position.y) * 0.002;
      fishes_[6].position.x += (fish7_targetX - fishes_[6].position.x) * 0.003;
      fishes_[6].rotation.z = (fish7_targetY - fishes_[6].position.y) * 0.005;
      fishes_[6].rotation.x = (fishes_[6].position.x - fish7_targetX) * 0.0025;
    }

    /* Fish 8 */
    {
      fishes_[7].rotation.x += 0.005;
      let fish8_targetX = Helper.normalize(
        mousePos.x,
        -1,
        1,
        fishes[7].minX,
        fishes[7].maxX
      );
      let fish8_targetY = Helper.normalize(
        mousePos.y,
        -1,
        1,
        fishes[7].minY,
        fishes[7].maxY
      );

      fishes_[7].position.y += (fish8_targetY - fishes_[7].position.y) * 0.002;
      fishes_[7].position.x += (fish8_targetX - fishes_[7].position.x) * 0.003;
      fishes_[7].rotation.z = (fish8_targetY - fishes_[7].position.y) * 0.005;
      fishes_[7].rotation.x = (fishes_[7].position.x - fish8_targetX) * 0.0025;
    }

    /* Fish 9 */
    {
      fishes_[8].rotation.x += 0.005;
      let fish9_targetX = Helper.normalize(
        mousePos.x,
        -1,
        1,
        fishes[8].minX,
        fishes[8].maxX
      );
      let fish9_targetY = Helper.normalize(
        mousePos.y,
        -1,
        1,
        fishes[8].minY,
        fishes[8].maxY
      );

      fishes_[8].position.y += (fish9_targetY - fishes_[8].position.y) * 0.002;
      fishes_[8].position.x += (fish9_targetX - fishes_[8].position.x) * 0.003;
      fishes_[8].rotation.z = (fish9_targetY - fishes_[8].position.y) * 0.005;
      fishes_[8].rotation.x = (fishes_[8].position.x - fish9_targetX) * 0.0025;
    }

    /* Fish 10 */
    {
      fishes_[9].rotation.x += 0.005;
      let fish10_targetX = Helper.normalize(
        mousePos.x,
        -1,
        1,
        fishes[9].minX,
        fishes[9].maxX
      );
      let fish10_targetY = Helper.normalize(
        mousePos.y,
        -1,
        1,
        fishes[9].minY,
        fishes[9].maxY
      );

      fishes_[9].position.y += (fish10_targetY - fishes_[9].position.y) * 0.002;
      fishes_[9].position.x += (fish10_targetX - fishes_[9].position.x) * 0.003;
      fishes_[9].rotation.z = (fish10_targetY - fishes_[9].position.y) * 0.005;
      fishes_[9].rotation.x = (fishes_[9].position.x - fish10_targetX) * 0.0025;
    }
    // console.log(targetX, targetY);
    // fishTest2.position.z = fishPositionZ;
    // fishTest2.position.y = fishPositionY;
    // fishTest2.position.x = fishPositionX;

    fish_test_1.position.y +=
      (fish_test_targetY - fish_test_1.position.y) * 0.002;
    fish_test_1.position.x +=
      (fish_test_targetX - fish_test_1.position.x) * 0.003;
    fish_test_1.rotation.z =
      (fish_test_targetY - fish_test_1.position.y) * 0.005;
    fish_test_1.rotation.x =
      (fish_test_1.position.x - fish_test_targetX) * 0.0025;
  }
}
