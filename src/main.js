
import Sim from './sim.js'
import defineAll from './definitions.js'

const sim = new Sim('canvas')
//const Box2D = sim.engine;
defineAll(sim);


let MOVING_LEFT = false;
let MOVING_RIGHT = false;

await sim.load(sim.level);

console.log(sim.player.maxY*sim.scale)

const init = [400, 200] // level 1 start
// const init = [3900, 400] // level 1 blocks
//const init = [4200, 400] // level 1 pit
// const init = [5300, 400] // level 1 bridge


//const init = [2600, 400] // level 2 bridge
//const init = [3100, 440] // level 2 rotate thing

//const init = [5080, 400] // level 2 jump

//const init = [8200, 600] // level 2 last bridge

//const init = [3800, 200] // level 3 cave
//const init = [5000, 600] // level 3 cave2

//const init = [6800, 500] // level 3 snow


//const init = [400, 1200] // level 4 start
//const init = [5400, 1000] // level 4 snow
//const init = [6200, 1100] // level 4 elevator

//const init = [10500, 540] // level 4 top


sim.put('player',init[0],init[1]);

document.addEventListener('keydown', (event) => {
  switch(event.code) {
    case "ArrowLeft":	
      MOVING_LEFT = true;
      break;
    case "ArrowRight": 
      MOVING_RIGHT = true;
      break;
    case "Escape": 
      sim.paused = !sim.paused;				
      console.log('sim.paused ', sim.paused )
      break;
  }
})

document.addEventListener('keyup', (event) => {
  switch(event.code) {
    case "ArrowLeft":	
      MOVING_LEFT = false;
      break;
    case "ArrowRight": 
      MOVING_RIGHT = false;
      break;
  }
})


sim.player.exploded.addEventListener('change', () => {
    if (sim.player.exploded.value) {
        // @todo - reload level
        setTimeout(() => {

            sim.clear();
            sim.load(sim.level);
            sim.put('player',init[0],init[1]);
        }, 2000);
    }
})

sim.player.finished.addEventListener('change', () => {
    console.log('finish chnaged to ', sim.player.finished.value)
    if (sim.player.finished.value) {
        //sim.player.finished.value = false;
        setTimeout(() => {
            sim.clear();
            sim.level++;
            sim.load(sim.level);
            sim.put('player',init[0],init[1]);
        }, 2000);
    }
})



// calculate no more than a 60th of a second during one world.Step() call 
const maxTimeStepMs = 1/60*1000;
const step = (deltaMs) => {
     const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs);
     sim.world.Step(clampedDeltaMs/1000, 3, 2); };

const $timer = document.getElementById('timer')

let handle;
let time = 0;
(function loop(prevMs) {
    const nowMs = window.performance.now();
    handle = requestAnimationFrame(loop.bind(null, nowMs));
    const deltaMs = nowMs-prevMs;

    if (!sim.paused) {
        sim.player.timer.value += deltaMs;
        time = 60 - Math.round(sim.player.timer.value/1000);
        $timer.innerText = time > 0 ? time : 0;
        step(deltaMs);
        if (MOVING_LEFT) {
            sim.player.move(-1);
        }
        if (MOVING_RIGHT) {
            sim.player.move(1);
        }
        sim.updateKinematics();
        sim.player.update()
    } 
    sim.drawCanvas();
}(window.performance.now()));
