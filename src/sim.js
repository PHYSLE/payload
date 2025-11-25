
import Box2DFactory from 'box2d-wasm';
import Model from './model.js';
import Player from './player.js';
import { makeDebugDraw } from './debugDraw.js';
import Particle from './particle.js'

const Box2D = await Box2DFactory({
   locateFile: (path, prefix) => {
     //console.log(prefix, path)
     //for vite just use public/assets
     return "assets/" + path;
   }
})

console.log(Box2D)
const ZERO = new Box2D.b2Vec2(0, 0);


function Sim(canvasId) {
     const $canvas = document.getElementById(canvasId)
     if (!$canvas) {
        console.error('canvasId ' + canvasId + ' did not return a canvas element')
        return null;
     }
     const sim = {
        level: 1,
        offset: {x:500, y:220},
        paused: true,
        debug: false,
        map: false,
        engine: Box2D,
        scale: 40,// pixelsPerMeter = 32?;
        $canvas: $canvas,
        context: $canvas.getContext("2d"),
        background: new Image(),
        world: new Box2D.b2World(
           new Box2D.b2Vec2(0, 10) //12? // gravity
        ),
        models: {},
        layers: [
            [], // background
            [], // ground
            [], // foreground
        ],
        kinematics:[],
        particles:[],
        player: new Player(Box2D),
        load:async function(level) {
            await fetch(`../assets/levels/level${level}.json`)
                .then((response) => response.json())
                .then((json) => {
                    this.level = level;
                    if (json.background) {
                        this.background.src = `../assets/images/${json.background}.jpg`;
                    }
                    json.objects.map((obj) => {
                        this.put(obj.name, obj.x, obj.y);
                    })
                })
                .catch(error => console.error('Error loading level ' + level, error))

        },
        define : function(properties) {
            try {
                if (properties.parent) {
                    let parent = this.models[properties.parent];
                    if (!parent) {
                        throw(`Parent ${properties.parent} not found in sim.models`)
                    }
                    Object.setPrototypeOf(properties, parent.properties);
                }
                if (properties.waypoints && properties.waypoints.length % 2 != 0) {
                    throw(`Property waypoints is not a multiple of two defining ${properties.name}`)
                }

                properties.scale = this.scale;
                
                var model = new Model(properties, Box2D);
                this.models[properties.name] = model;
            }
            catch(error) {
                console.error(error);
            }
        },
        put: function(name, x, y) {
            try {
                if (name == 'player') {
                    return this.putPlayer(x,y);
                }

                let model = this.models[name];
                if (!model) {
                    throw(`Missing model for ${name} in sim.put`);
                }
    
                if (!model.body) { // passive object with no physics
                    return null;
                }
            
                const pos = new Box2D.b2Vec2(x/this.scale, y/this.scale);
                
                var body = this.world.CreateBody(model.body);
                body.SetTransform(pos, 0);
                body.SetLinearVelocity(ZERO);
                body.SetEnabled(true);

                body.UserData = {name: name};

                let n = Number(model.properties.layer);
                if (n != NaN) {
                    this.layers[n].push(body);
                }


                if (model.shape) { // not passive
                    this.attachShape(body, model);
                }
                else if (model.segments) {
                    this.attachLine(body, model);
                }


                if (model.body.type == Box2D.b2_kinematicBody && model.properties.waypoints) {

                    let wp = model.properties.waypoints;
                    body.UserData.waypointTarget = 0;
                    body.UserData.waypoints = []

                    for (var i = 0; i < wp.length; i+=2) {
                        var v = new Box2D.b2Vec2((x+ wp[i]) /this.scale , (y + wp[i+1]) /this.scale );
                        body.UserData.waypoints.push(v);
                    }
                    this.kinematics.push(body);
                }


                if (model.properties.joint) {
                    let anchor = this.put('anchor', x, y);
                    this.join(body, model.properties.joint[0], model.properties.joint[1], anchor, 0,0, false);
                }
        
                let my = (y/this.scale)-(250/this.scale);
                if (this.player.maxY == Infinity || this.player.maxY < my) {
                    this.player.maxY = my;
                }
                
                return body;
            }
            catch(error) {
                console.error(error);
            }
        },
        attachShape(body, model) {
            let fixture = body.CreateFixture(model.shape, model.properties.mass);                 
            fixture.SetDensity(1);
            fixture.SetFriction(model.properties.friction);
            fixture.SetRestitution(model.properties.elastic);
            if (model.properties.type == "sensor") {
                fixture.SetSensor(true);
            }
        },
        attachLine(body, model)  {
            for(const segment of model.segments) {
                let fixture = body.CreateFixture(segment, model.properties.mass);                 
                fixture.SetDensity(1);//model.properties.mass);
                fixture.SetFriction(model.properties.friction);
                fixture.SetRestitution(model.properties.elastic); 
            }
        },
        putPlayer: function(x, y) {
            try {
                this.player.exploded.value = false;
                this.player.finished.value = false;
                this.player.timer.value = 0;
                this.player.joints = [];
                this.player.nuke = this.put("nuke",x-20,y-32);
                this.player.chasis = this.put("chasis",x,y);
                this.player.tire1 = this.put("tire",x-26,y+26);
                this.player.tire2 = this.put("tire",x+26,y+26);



                //console.log(this.player.tire1)

                this.player.joints.push(this.join(this.player.chasis,-26,26, this.player.tire1, 0, 0, false));
                this.player.joints.push(this.join(this.player.chasis,26,26, this.player.tire2, 0, 0, false));
                this.player.joints.push(this.join(this.player.chasis,-6,-20, this.player.nuke,12, 5, true));	
            }
            catch(error) {
                console.error(error);
            }
        },
        join:function(bodyA, xA, yA, bodyB, xB, yB, collide) {
            try {
                var jDef = new Box2D.b2RevoluteJointDef();
                jDef.set_bodyA(bodyA);
                jDef.set_bodyB(bodyB);

                jDef.set_localAnchorA(new Box2D.b2Vec2(xA/this.scale, yA/this.scale))
                jDef.set_localAnchorB(new Box2D.b2Vec2(xB/this.scale, yB/this.scale))

                jDef.set_collideConnected(collide)     
                let j = this.world.CreateJoint(jDef)
                
                return j;
            }
            catch(error) {
                console.error(error);
            }
        },
        renderDebug: function(player) {
            this.context.scale(1,1);

            this.context.fillStyle = 'rgb(255, 255, 255)';
            this.context.font = "14px Tahoma";
            this.context.fillText(`player x:${player.x.toFixed()*sim.scale} y:${player.y.toFixed()*sim.scale}`, 15, 25);
            this.context.fillText(`level: ${this.level}`, 15, 40);
            this.context.fillText(`max y: ${this.player.maxY * this.scale} `, 15, 55);

            this.context.fillStyle = 'rgb(0,0,0)';
            
            if (this.map) {
                this.context.scale(this.scale/3, this.scale/3);
                this.context.translate(-(player.x - (this.offset.x / this.scale))+40, -(player.y - (this.offset.y / this.scale))+20);
            }
            else {
                this.context.scale(this.scale, this.scale);
                this.context.translate(-(player.x - (this.offset.x / this.scale)), -(player.y - (this.offset.y / this.scale)));
            }
            this.context.lineWidth /= this.scale;
            this.world.DebugDraw();
        },
        renderLayers: function(player) {
            this.context.drawImage(this.background, 0-player.x,0 )
            for(let z = 0, b = 0; z < 3; z++) {
                for(b = 0; b < this.layers[z].length; b++) {
                    if (this.layers[z][b].UserData.name == "debris") {
                        this.renderDebris(this.layers[z][b], player)
                        continue;
                    }
                    const img = this.models[this.layers[z][b].UserData.name].image;
                    if (img.width) {
                        let p = this.layers[z][b].GetPosition();  
                        let visible = true;
                        
                        // todo - are we on screen?
                        if (visible) {
                            this.context.setTransform(1, 0, 0, 1, p.x * this.scale, p.y * this.scale); 
                            let a = this.layers[z][b].GetAngle();  
                            this.context.translate(-(player.x * this.scale  -this.offset.x), -(player.y * this.scale - this.offset.y));
                            if (a != 0) {
                                this.context.rotate(a)
                            }
                            this.context.drawImage(img, -img.width/2, -img.height/2)
                            this.context.setTransform(1,0,0,1,0,0); 

                        }
                    }

                }
            }

        },
        renderDebris: function(body, player) {
            let p = body.GetPosition();  
            if (body.UserData.alpha > .1) {
                body.UserData.alpha-=.0066
                

                this.context.setTransform(1, 0, 0, 1, p.x * this.scale - 5, p.y * this.scale - 5); 
                this.context.translate(-(player.x * this.scale  -this.offset.x), -(player.y * this.scale - this.offset.y));
                this.context.globalAlpha = body.UserData.alpha;
                this.context.beginPath();
                this.context.arc(p.x, p.y, 2, 0, 2 * Math.PI, false);
                this.context.fillStyle = body.UserData.color;
                this.context.fill();

                this.context.setTransform(1,0,0,1,0,0); 
            }
        },
        renderParticles: function(player) {
            for (let p = 0; p < this.particles.length; p++) {
                this.particles[p].update();
                this.particles[p].render(this.context, {x: player.x * this.scale -this.offset.x , y: player.y * this.scale - this.offset.y})
            }
            this.particles = this.particles.filter(p => !p.remove)
        },
        render: function() {
            let player = null;
            if (this.player.exploded.value) {
                player = this.player.diedHere;
            }
            else {
                player = this.player.chasis.GetPosition()
            }

            this.context.fillRect(0, 0, this.$canvas.width, this.$canvas.height);
            this.context.save();
  
            if (this.debug) {
                this.renderDebug(player);
            }
            else {
                this.renderLayers(player);
                this.renderParticles(player);
            }    
            this.context.restore();
        },
        updateKinematics: function() {
            if (this.kinematics.length == 0) {
                return;
            }
            for (const body of this.kinematics) {
                let pos = body.GetPosition();
                if (body.UserData && body.UserData.waypoints && body.UserData.waypoints.length > 0 ) {
                    var vel = 2; // @todo
                    var target = body.UserData.waypointTarget % body.UserData.waypoints.length;	
                    
                    // distance
                    var xd = Math.abs(pos.x - body.UserData.waypoints[target].x);
                    var yd = Math.abs(pos.y - body.UserData.waypoints[target].y);

                    if (xd <= .1 && yd <= .1) {
                        // arrived
                        body.UserData.waypointTarget++;
                        body.SetLinearVelocity(new Box2D.b2Vec2(0,0));
                    }
                    else {
                        if (pos.x < body.UserData.waypoints[target].x) {
                            body.SetLinearVelocity(new Box2D.b2Vec2(vel,0));
                        }
                        else if (pos.x > body.UserData.waypoints[target].x) {
                            body.SetLinearVelocity(new Box2D.b2Vec2(-vel,0));
                        }
                    
                        if (pos.y < body.UserData.waypoints[target].y) {
                            body.SetLinearVelocity(new Box2D.b2Vec2(0,vel));
                        }
                        else if (pos.y > body.UserData.waypoints[target].y) {
                            body.SetLinearVelocity(new Box2D.b2Vec2(0,-vel));
                        }			
                    }
                }
            }          
        },
        clear:function() {
            try {
                // Destroy all bodies
                let b = this.world.GetBodyList();
                while (b && b.Zu > 0) {
                    const nextB = b.GetNext();
                    this.world.DestroyBody(b);
                    b = nextB;
                }

                // clear tracked kinematics and player references
                this.kinematics = [];
                this.layers=[[],[],[]];
                this.particles=[];
                this.player.chasis = null;
                this.player.tire1 = null;
                this.player.tire2 = null;
                this.player.nuke = null;
                this.player.maxY = Infinity; 
            }
            catch(error) {
                console.error('Error clearing Box2D world', error);
            }
        }
    }

    const debugDraw = makeDebugDraw(sim.context,sim.scale, Box2D);
    sim.world.SetDebugDraw(debugDraw);

    sim.player.sim = sim; // weird

    return sim;
}

export default Sim;