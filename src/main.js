import Sim from './sim.js'
import Cookie from './cookie.js'
import defineAll from './definitions.js'


const cookieName = '_phy_pl';
const sim = new Sim('canvas')
const $menu = document.getElementById('menu');

defineAll(sim);


let MOVING_LEFT = false;
let MOVING_RIGHT = false;

let cookie = Cookie.getCookie(cookieName);
let state = {
    level: 1,
    scores: {},
}


if (cookie) {
    try {
        state = JSON.parse(cookie);
        console.log('state', state)

        if (state.level > 1) {
            document.getElementById('menu-continue').classList.remove('inactive')
        }
    }
    catch(e) {
        console.error(e)
    }
}

function renderScores() {
    const $scores = document.getElementById('scores');
    $scores.innerText = ''
    for (let level=1; level<11; level++) {
        const $tr = document.createElement('tr');
        const $level = document.createElement('td');
        $level.innerText = level;

        const $time = document.createElement('td');
        const $best = document.createElement('td');
        if (state.scores['level' + level]) {
            let t = state.scores['level' + level].time/1000;
            let b = state.scores['level' + level].best/1000;
            $time.innerText = (t <= 60 && t > 0) ? t.toFixed(3) : '-'
            $best.innerText = (b <= 60 && b > 0) ? b.toFixed(3) : '-';
        }
        else {
            $time.innerText = '-';
            $best.innerText = '-';
        }
        $tr.append($level)
        $tr.append($time)
        $tr.append($best)

        $scores.append($tr);
    }
}



function setScore(level, time) {
    if (!state.scores['level' + level]) {
        state.scores['level' + level] = {time: time, best:time};
    }
    else {
        state.scores['level' + level].time = time;
        if (time < state.scores['level' + level].best) {
            state.scores['level' + level].best = time
        }
    }
}


function resetScores() {
    for (let level=1; level<11; level++) {
        setScore(level, Infinity);
    }
}

await sim.load(state.level);


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
                document.getElementById('menu-scores').classList.add('hidden');
                document.getElementById('menu-main').classList.remove('hidden');
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
    resetScores();
    document.getElementById('menu-continue').classList.remove('inactive')
});

document.getElementById('menu-continue').addEventListener('click', (e) => {
    if (!document.getElementById('menu-continue').classList.contains('inactive')) {
        sim.paused = false;
        $menu.classList.add('hidden')
    }
});


document.getElementById('menu-score').addEventListener('click', (e) => {
    renderScores() 
    document.getElementById('menu-scores').classList.remove('hidden');
    document.getElementById('menu-main').classList.add('hidden');
   
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
        setScore(sim.level, sim.player.timer.value)
        if (sim.level == 10) {
            sim.level = 1
        }
        else {
            sim.level++;
        }
        state.level = sim.level;
        Cookie.setCookie(cookieName, JSON.stringify(state))

        setTimeout(() => {
            sim.clear();
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


