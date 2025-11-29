import Sim from './sim.js'
import Cookie from './cookie.js'
import defineAll from './definitions.js'
import scoreboard from './scoreboard.js'


const cookieName = '_phy_pl';
const $menu = document.getElementById('menu');
const $timer = document.getElementById('timer');
const $canvas = document.getElementById('canvas');
const sim = new Sim($canvas)

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

        if (import.meta.env.DEV) {
            console.log('state', state)
        }
        if (state.level > 1) {
            document.getElementById('menu-continue').classList.remove('inactive')
        }
        else {
            scoreboard.resetScores(state);
        }
    }
    catch(e) {
        console.error(e)
    }
}

await sim.load(state.level);



function showMessage(on, text) {
    const $message = document.getElementById('message');
    if (on) {
        $message.innerText = text ? text : 'PAYLOAD SECURE'
        $message.classList.remove('hidden')
        $message.classList.add('typewriter')
    }
    else {
        $message.classList.add('hidden')
        $message.classList.remove('typewriter')
    }
}



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

// click does not respond to clicks while being updated so use timer-overlay
document.getElementById('timer-overlay').addEventListener('click', (e) => {
    sim.paused = !sim.paused;

    console.log(sim.paused)

    if (sim.paused) {
        $menu.classList.remove('hidden')
        document.getElementById('menu-scores').classList.add('hidden');
        document.getElementById('menu-main').classList.remove('hidden');
    }
    else {
        $menu.classList.add('hidden')
    }
})

document.getElementById('menu-new').addEventListener('click', (e) => {
    sim.clear();
    sim.load(1);
    sim.paused = false;
    $menu.classList.add('hidden')
    scoreboard.resetScores(state);
    document.getElementById('menu-continue').classList.remove('inactive')
});

document.getElementById('menu-continue').addEventListener('click', (e) => {
    if (!document.getElementById('menu-continue').classList.contains('inactive')) {
        sim.paused = false;
        $menu.classList.add('hidden')
    }
});


document.getElementById('menu-score').addEventListener('click', (e) => {
    scoreboard.renderScores(state) 
    document.getElementById('menu-scores').classList.remove('hidden');
    document.getElementById('menu-main').classList.add('hidden');
});

$canvas.addEventListener('touchstart', function(e) {
    console.log(e.touches, window.innerWidth);
    if (e.touches.length > 0) {
        if (e.touches[0].clientX < window.innerWidth/2) {
            MOVING_LEFT = true;		
        }
        else {
            MOVING_RIGHT = true;		
        }
    }
});

$canvas.addEventListener('touchend', function(e) {
    MOVING_LEFT = false;		
    MOVING_RIGHT = false;	
    if (e.touches.length > 0) {
        if (e.touches[0].clientX < window.innerWidth/2) {
            MOVING_LEFT = true;		
        }
        else {
            MOVING_RIGHT = true;		
        }
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
        showMessage(true);

        scoreboard.setScore(state, sim.level, sim.player.timer.value);
        sim.level++;
        state.level = sim.level;
        Cookie.setCookie(cookieName, JSON.stringify(state));
        sim.player.stop();


        setTimeout(() => {
            // game over
            if (sim.level > 10) {
                sim.level = 1;
                state.level = 1;
                showMessage(false);
                scoreboard.renderScores(state) 
                $menu.classList.remove('hidden')

                Cookie.setCookie(cookieName, JSON.stringify(state));
                document.getElementById('menu-scores').classList.remove('hidden');
                document.getElementById('menu-main').classList.add('hidden');
                document.getElementById('menu-continue').classList.contains('inactive')
                setTimeout(() => {
                    showMessage(true, 'GAME COMPLETE')
                }, 2000)

            }
            else {
                sim.clear();
                sim.load(sim.level);
                showMessage(false);
            }
        }, 2000);
    }
})


// calculate no more than a 60th of a second during one world.Step() call 
const maxTimeStepMs = 1/60*1000;
const step = (deltaMs) => {
     const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs);
     sim.world.Step(clampedDeltaMs/1000, 3, 2); };


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


