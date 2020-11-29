import * as Fish1 from "/js/objects/fishes/fish1.js";
import * as Fish2 from "/js/objects/fishes/fish2.js";
import * as Fish3 from "/js/objects/fishes/fish3.js";
import * as Fish4 from "/js/objects/fishes/fish4.js";
import * as Fish5 from "/js/objects/fishes/fish5.js";
import * as Fish6 from "/js/objects/fishes/fish6.js";
import * as Fish7 from "/js/objects/fishes/fish7.js";
import * as Fish8 from "/js/objects/fishes/fish8.js";
import * as Fish9 from "/js/objects/fishes/fish9.js";
import * as Fish10 from "/js/objects/fishes/fish10.js";
import * as Starfish from "/js/objects/fishes/starfish.js";

let starfish;
let fishes = [10];
let fishes_ = [10];
let speed = 0;

export class Fishes {
  createFishes(scenes) {
    fishes[0] = new Fish1.Fish();
    fishes_[0] = fishes[0].fish1;
    fishes_[0].castShadow = true;
    fishes_[0].receiveShadow = true;
    scenes.add(fishes_[0]);

    fishes[1] = new Fish2.Fish();
    fishes_[1] = fishes[1].fish2;
    fishes_[1].castShadow = true;
    fishes_[1].receiveShadow = true;
    scenes.add(fishes_[1]);

    fishes[2] = new Fish3.Fish();
    fishes_[2] = fishes[2].fish3;
    fishes_[2].castShadow = true;
    fishes_[2].receiveShadow = true;
    scenes.add(fishes_[2]);

    fishes[3] = new Fish4.Fish();
    fishes_[3] = fishes[3].fish4;
    fishes_[3].castShadow = true;
    fishes_[3].receiveShadow = true;
    scenes.add(fishes_[3]);

    fishes[4] = new Fish5.Fish();
    fishes_[4] = fishes[4].fish5;
    fishes_[4].castShadow = true;
    fishes_[4].receiveShadow = true;
    scenes.add(fishes_[4]);

    fishes[5] = new Fish6.Fish();
    fishes_[5] = fishes[5].fish6;
    fishes_[5].castShadow = true;
    fishes_[5].receiveShadow = true;
    scenes.add(fishes_[5]);

    fishes[6] = new Fish7.Fish();
    fishes_[6] = fishes[6].fish7;
    fishes_[6].castShadow = true;
    fishes_[6].receiveShadow = true;
    scenes.add(fishes_[6]);

    fishes[7] = new Fish8.Fish();
    fishes_[7] = fishes[7].fish8;
    fishes_[7].castShadow = true;
    fishes_[7].receiveShadow = true;
    scenes.add(fishes_[7]);

    fishes[8] = new Fish9.Fish();
    fishes_[8] = fishes[8].fish9;
    fishes_[8].castShadow = true;
    fishes_[8].receiveShadow = true;
    scenes.add(fishes_[8]);

    fishes[9] = new Fish10.Fish();
    fishes_[9] = fishes[9].fish10;
    fishes_[9].castShadow = true;
    fishes_[9].receiveShadow = true;
    scenes.add(fishes_[9]);

    starfish = new Starfish.Starfish();
    scenes.add(starfish.starfish);
    // console.log(starfish.starfish);

    return scenes;
  }

  move() {
    const timer = Date.now() * 0.0001;
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
      fishes_[4].position.x = -50 * Math.cos(speed);
      fishes_[4].position.y = -10 + 25 * Math.cos(speed);
      fishes_[4].rotation.y = -timer * fishes[4].speed;
    }

    /* Fish 6 */
    {
      fishes_[5].position.x = 50 * Math.cos(speed);
      fishes_[5].position.y = -10 + 25 * Math.cos(speed);
      fishes_[5].rotation.y = -timer * fishes[5].speed;
    }

    /* Fish 7 */
    {
      fishes_[6].position.x = 70 * Math.cos(speed);
      fishes_[6].position.y = -10 + 30 * Math.cos(speed);
      fishes_[6].rotation.y = timer * fishes[6].speed;
    }
    /* Fish 8 */
    {
      fishes_[7].position.x = 55 * Math.cos(speed);
      fishes_[7].position.y = 20 + 40 * Math.cos(speed);
      fishes_[7].rotation.y = timer * fishes[7].speed;
    } /* Fish 9 */
    {
      fishes_[8].position.x = -55 * Math.cos(speed);
      fishes_[8].position.y = 20 + 40 * Math.cos(speed);
      fishes_[8].rotation.y = timer * fishes[8].speed;
    }

    /* Fish 10 */
    {
      fishes_[9].position.x = -30 * Math.cos(speed);
      fishes_[9].position.y = 20 + 40 * Math.cos(speed);
      fishes_[9].rotation.y = timer * fishes[9].speed;
    }
  }
}
