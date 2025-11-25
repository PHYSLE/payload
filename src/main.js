import Sim from './sim.js'
import Cookie from './cookie.js'
import defineAll from './definitions.js'


const cookieName = '_phy_pl';
const sim = new Sim('canvas')
const $menu = document.getElementById('menu');

defineAll(sim);


let MOVING_LEFT = false;
let MOVING_RIGHT = false;
let level = 1;
let cookie = Cookie.getCookie(cookieName);

if (cookie) {
    try {
        let state = JSON.parse(cookie);
        //console.log('state', state)

        level = state.level;
        if (level > 1) {
            document.getElementById('menu-continue').classList.remove('inactive')
        }
    }
    catch(e) {
        console.error(e)
    }
}

await sim.load(level);


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
            if (sim.paused) {
                $menu.classList.remove('hidden')
            }
            else {
                $menu.classList.add('hidden')
            }

            break;
        case "Backquote":
            if (sim.map) {
                sim.debug = false;
                sim.map = false;
            }
            else if (sim.debug) {
                sim.map = true;
            }
            else {
                sim.debug = true;
                sim.map = false;
            }
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



document.getElementById('menu-new').addEventListener('click', (e) => {
    sim.clear();
    sim.load(1);
    sim.paused = false;
    $menu.classList.add('hidden')
    document.getElementById('menu-continue').classList.remove('inactive')
});

document.getElementById('menu-continue').addEventListener('click', (e) => {
    if (!document.getElementById('menu-continue').classList.contains('inactive')) {
        sim.paused = false;
        $menu.classList.add('hidden')
    }
});


sim.player.exploded.addEventListener('change', () => {
    if (sim.player.exploded.value) {
        setTimeout(() => {
            sim.clear();
            sim.load(sim.level);

        }, 3000);
    }
})

sim.player.finished.addEventListener('change', () => {
    if (sim.player.finished.value) {
        setTimeout(() => {
            sim.clear();
            if (sim.level == 10) {
                sim.level = 1
            }
            else {
                sim.level++;
            }
            Cookie.setCookie(cookieName, JSON.stringify({level:  sim.level}))
            sim.load(sim.level);

        }, 1000);
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
    sim.render();


}(window.performance.now()));


