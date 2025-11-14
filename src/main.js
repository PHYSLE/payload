
import Sim from './sim.js'
import defineAll from './definitions.js'

const sim = new Sim('canvas')
//const Box2D = sim.engine;
defineAll(sim);


let MOVING_LEFT = false;
let MOVING_RIGHT = false;

sim.put('wall1',901,92)
sim.put('floor2',800,17)
sim.put('wall1',1101,92)
sim.put('wall1',1500,292)
sim.put('wall1',1300,292)
sim.put('wall1',1100,292)
sim.put('wall1',900,292)
sim.put('floor1',1200,482)
sim.put('wall1',1301,592)
sim.put('wall1',1501,592)
sim.put('wall1',1101,592)
sim.put('floor2',1202,591)
sim.put('wall1',300,-108)
sim.put('wall1',500,-108)
sim.put('wall1',500,92)
sim.put('wall1',300,92)
sim.put('wall1',500,292)
sim.put('wall1',300,292)
sim.put('wall1',901,592)
sim.put('wall1',701,592)
sim.put('wall1',700,292)
sim.put('floor2',4540,699)
sim.put('blocksb',25,225)
sim.put('blocksb',25,175)
sim.put('blocksb',25,125)
sim.put('block2b',200,300)
sim.put('blocksb',175,225)
sim.put('blocksb',225,225)
sim.put('block6b',200,150)
sim.put('blocksb',125,225)
sim.put('blocksb',125,225)
sim.put('blocksb',75,225)
sim.put('floor2',0,500)
sim.put('floor2',300,500)
sim.put('floor2',600,500)
sim.put('floor3',1625,510)
sim.put('floor3',1775,535)
sim.put('floor3',1925,560)
sim.put('floor3',2075,585)
sim.put('block6b',2200,500)
sim.put('block4b',2200,600)
sim.put('block4b',2300,600)
sim.put('blocksb',2275,525)
sim.put('blocksb',2325,525)
sim.put('floor2',3840,1039)
sim.put('block2b',3590,950)
sim.put('floor2',2900,1040)
sim.put('block6b',2400,550)
sim.put('floor1',2700,635)
sim.put('block1b',2400,650)
sim.put('blocksb',2375,725)
sim.put('blocksb',2425,725)
sim.put('block4b',2200,700)
sim.put('block4b',2300,700)
sim.put('block5b',3000,550)
sim.put('block3b',3000,650)
sim.put('blocksb',2975,725)
sim.put('blocksb',3025,725)
sim.put('block1b',3100,550)
sim.put('block4b',3100,650)
sim.put('block2b',3100,750)
sim.put('blocksb',3025,775)
sim.put('block3b',3050,850)
sim.put('block6b',3150,850)
sim.put('block1b',3640,550)
sim.put('block4b',3640,650)
sim.put('block2b',3640,750)
sim.put('block5b',3590,850)
sim.put('block2b',3150,950)
sim.put('block1b',4040,550)
sim.put('floor4',4596,685)
sim.put('floor4',4745,660)
sim.put('block5b',4870,510)
sim.put('block5b',4870,510)
sim.put('block1b',4870,610)
sim.put('block1b',4870,710)
sim.put('blocksb',4845,785)
sim.put('blocksb',4895,785)
sim.put('block4b',4970,510)
sim.put('block4b',4970,610)
sim.put('floor1',5270,566)
sim.put('block4b',5570,510)
sim.put('block4b',5570,610)
sim.put('block6b',5670,510)
sim.put('block6b',5770,546)
sim.put('block3b',5670,610)
sim.put('blocksb',5745,621)
sim.put('blocksb',5795,621)
sim.put('floor3',5895,693)
sim.put('block1b',5770,696)
sim.put('floor2',6120,707)
sim.put('floor3',6345,719)
sim.put('floor2',6569,733)
sim.put('floor2',6869,733)
sim.put('block6b',7069,633)
sim.put('blockxsb',7070,570)
sim.put('block3b',7069,733)
sim.put('block4b',7069,833)
sim.put('block4b',7169,833)
sim.put('block3b',7169,733)
sim.put('floor1',7469,788)
sim.put('block4b',7169,933)
sim.put('block4b',7071,933)
sim.put('block2b',6971,933)
sim.put('block2b',6872,933)
sim.put('block2b',6773,933)
sim.put('blocksb',3075,925)
sim.put('blocksb',3665,925)
sim.put('blocksb',3665,975)
sim.put('blocksb',3665,1025)
sim.put('blocksb',3665,1075)
sim.put('blocksb',3075,975)
sim.put('blocksb',3075,1025)
sim.put('blocksb',3075,1075)
sim.put('block1b',3150,1150)
sim.put('block1b',3590,1150)
sim.put('block3b',3690,1150)
sim.put('block3b',3050,1150)
sim.put('block2b',3150,1050)
sim.put('block2b',3590,1050)
sim.put('block6b',3250,1150)
sim.put('block5b',3490,1150)
sim.put('block3b',7770,734)
sim.put('block4b',7770,834)
sim.put('floor4',7895,813)
sim.put('floor4',8045,787)
sim.put('block5b',8320,610)
sim.put('block5b',8420,574)
sim.put('block2b',8320,710)
sim.put('block2b',8320,810)
sim.put('floor2',10419,930)
sim.put('block4b',8420,674)
sim.put('block4b',8520,674)
sim.put('block1b',8520,574)
sim.put('floor1',8820,629)
sim.put('block1b',9120,574)
sim.put('block4b',9120,674)
sim.put('block4b',9220,674)
sim.put('block6b',9220,574)
sim.put('block4b',7770,933)
sim.put('block6b',9320,609)
sim.put('block2b',9320,709)
sim.put('block2b',9320,809)
sim.put('floor4',9445,730)
sim.put('floor4',9595,704)
sim.put('floor2',9819,692)
sim.put('floor4',10044,678)
sim.put('floor4',10194,652)
sim.put('floor2',10418,640)
sim.put('block5b',10618,503)
sim.put('block1b',10618,603)
sim.put('block2b',10618,703)
sim.put('block6b',11159,503)
sim.put('block1b',11159,603)
sim.put('block2b',11159,703)
sim.put('block6b',11259,539)
sim.put('block1b',11259,639)
sim.put('block4b',11259,739)
sim.put('floor1',11559,693)
sim.put('block1b',11859,637)
sim.put('block4b',11859,737)
sim.put('floor2',12659,738)
sim.put('blocksb',12834,621)
sim.put('blocksb',12834,671)
sim.put('blocksb',12834,721)
sim.put('blocksb',12834,771)
sim.put('blocksb',12834,821)
sim.put('floor3',12934,749)
sim.put('floor3',13084,775)
sim.put('floor3',13234,801)
sim.put('blocksb',13334,698)
sim.put('blocksb',13334,748)
sim.put('blocksb',13334,798)
sim.put('blocksb',13334,848)
sim.put('blocksb',13334,898)
sim.put('floor2',13509,815)
sim.put('floor2',14109,815)
sim.put('block6b',14309,715)
sim.put('block4b',14309,815)
sim.put('block4b',14309,915)
sim.put('floor1',14608,801)
sim.put('block3b',10619,803)
sim.put('block3b',11159,803)
sim.put('block6b',10655,903)
sim.put('block5b',11123,903)
sim.put('blocksb',11198,878)
sim.put('blocksb',11198,928)
sim.put('blocksb',10580,878)
sim.put('blocksb',10580,928)
sim.put('block1b',10655,1003)
sim.put('block1b',11123,1003)
sim.put('blocksb',10580,978)
sim.put('blocksb',10580,1028)
sim.put('blocksb',11198,978)
sim.put('blocksb',11198,1028)
sim.put('block2b',10605,1103)
sim.put('block2b',10705,1103)
sim.put('block2b',11174,1103)
sim.put('block2b',11074,1103)
sim.put('block2b',10605,1203)
sim.put('block1b',10705,1203)
sim.put('block1b',11074,1203)
sim.put('block2b',11174,1203)
sim.put('block1b',3250,1250)
sim.put('block1b',3490,1250)
sim.put('block4b',3150,1250)
sim.put('block4b',3050,1250)
sim.put('block4b',3590,1250)
sim.put('block4b',3690,1250)
sim.put('blocksb',4945,685)
sim.put('blocksb',4995,685)
sim.put('blocksb',5545,685)
sim.put('blocksb',5595,685)
sim.put('blocksb',5645,685)
sim.put('blocksb',5695,685)
sim.put('blocksb',5794,771)
sim.put('block5b',14908,717)
sim.put('block4b',14908,817)
sim.put('block4b',14908,917)
sim.put('floor2',15108,817)
sim.put('floor2',15408,817)
sim.put('floor2',15708,817)
sim.put('floor2',16008,817)
sim.put('block1b',13909,723)
sim.put('block2b',13809,823)
sim.put('block2b',13709,823)
sim.put('blocksb',13685,898)
sim.put('blocksb',13735,898)
sim.put('blocksb',13785,898)
sim.put('blocksb',13835,898)
sim.put('blocksb',13885,898)
sim.put('blocksb',13934,898)
sim.put('block1b',13809,723)
sim.put('block1b',13709,723)
sim.put('block2b',13909,823)
sim.put('floor1',12159,693)
sim.put('block1b',12459,638)
sim.put('block4b',12459,738)
sim.put('blocksb',12484,813)
sim.put('blocksb',12434,813)
sim.put('blocksb',11234,814)
sim.put('blocksb',11284,814)
sim.put('blocksb',10780,1228)
sim.put('blocksb',10999,1228)
sim.put('blocksb',3865,875)
sim.put('block4b',2951,850)
sim.put('blocksb',2975,775)
sim.put('blocksb',2975,1215)
sim.put('blocksb',2926,1215)
sim.put('blocksb',3765,1213)
sim.put('blocksb',3815,1213)
sim.put('block4b',10520,802)
sim.put('block4b',10420,802)
sim.put('block4b',10320,802)
sim.put('block4b',10507,1130)
sim.put('block4b',2852,850)
sim.put('blocksb',2778,873)
sim.put('blocksb',2926,775)
/*
sim.put('blockxsb',4104,587)
sim.put('blockxsb',4113,562)
sim.put('blockxsb',4109,537)
*/
//sim.put('player',4000, 400)
sim.put('blockxsb',4060,448)

sim.put('blockxsb',4082,448)
/*
sim.put('blockxsb',4104,463)
sim.put('blockxsb',4204,587)
sim.put('blockxsb',4179,587)
sim.put('blockxsb',4204,562)
sim.put('blockxsb',4139,587)
*/
sim.put('blockxsb',7075,546)

sim.put('blockwb',3272,550)
sim.put('blockwb',10790,502)
sim.put('block4a',15484,617)
sim.put('block4a',15584,617)
sim.put('block4a',15684,617)
sim.put('block5a',15484,517)
sim.put('block1a',15584,517)
sim.put('block6a',15684,517)
sim.put('block5b',1500,397)
sim.put('block4b',1500,497)
sim.put('block2b',800,400)
sim.put('block6b',900,400)
sim.put('block4b',800,499)
sim.put('block4b',900,499)
sim.put('blocksb',925,574)
sim.put('blocksb',875,574)
sim.put('blocksb',825,574)
sim.put('blocksb',775,574)
sim.put('blocksb',1525,572)
sim.put('blocksb',1475,572)
sim.put('block4b',4140,650)
sim.put('block4b',4040,650)
sim.put('floor5',3840,576)
sim.put('block4b',4240,650)
sim.put('block2b',4040,750)
sim.put('blocksb',4315,675)
sim.put('blocksb',4365,675)
sim.put('block5b',4340,600)
sim.put('block2b',4340,750)
sim.put('block3b',4340,850)
sim.put('block3b',4040,850)
sim.put('blocksb',3915,875)
sim.put('blocksb',3965,875)
sim.put('block3b',3690,850)
sim.put('block3b',3790,850)
sim.put('floor4',8195,760)
sim.put('block3b',7671,734)
sim.put('block4b',7670,833)
sim.put('block4b',7670,933)
sim.put('block5b',600,150)
sim.put('block4b',700,150)
sim.put('block4b',800,150)
sim.put('block4b',900,150)
sim.put('blocksb',625,76)
sim.put('blocksb',625,26)
sim.put('blocksb',625,-24)
sim.put('blocksb',625,-74)
sim.put('block2b',50,50)
sim.put('block2b',50,-50)
sim.put('block2b',50,-150)
sim.put('block3b',150,50)
sim.put('block3b',150,-50)
sim.put('block3b',150,-150)
sim.put('blocksb',625,-124)
sim.put('block5b',1101,400)
sim.put('block1b',1201,400)
sim.put('block6b',1301,400)
sim.put('block6b',1600,150)
sim.put('blocksb',1574,75)
sim.put('blocksb',1574,-25)
sim.put('blocksb',1574,-125)
sim.put('blocksb',1574,-75)
sim.put('blocksb',1574,25)
sim.put('wall1',1301,92)
sim.put('floor2',1400,17)
sim.put('blocksb',926,75)
sim.put('blocksb',926,-25)
sim.put('blocksb',926,25)
sim.put('block4b',1500,149)
sim.put('block4b',1400,149)
sim.put('block4b',1300,149)
sim.put('blocksb',1275,74)
sim.put('blocksb',1275,-26)
sim.put('blocksb',1275,24)
sim.put('block4b',100,150)
sim.put('block4b',100,300)
sim.put('blocksb',25,275)
sim.put('blocksb',25,325)
sim.put('blocksb',625,-174)
sim.put('block4b',700,-149)
sim.put('block4b',800,-149)
sim.put('block4b',900,-149)
sim.put('blocksb',926,-74)
	   
sim.put('player',400, 240);
//sim.put('player',15000, 440);

sim.put('depot',15309,592)


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
            sim.player.dispose(sim.world);
            sim.put('player',400, 240);
        }, 2000);
    }
})

sim.player.finished.addEventListener('change', () => {
    if (sim.player.finished.value) {
        setTimeout(() => {
            sim.player.dispose(sim.world);
            sim.put('player',400, 240);
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
        $timer.innerText = time;
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
