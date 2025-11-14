
import Box2DFactory from 'box2d-wasm';
import Model from './model.js';
import Player from './player.js';
import { makeDebugDraw } from './debugDraw.js';

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
        paused: false,
        engine: Box2D,
        scale: 40,// pixelsPerMeter = 32;
        $canvas: $canvas,
        context: $canvas.getContext("2d"),
        world: new Box2D.b2World(
            new Box2D.b2Vec2(0, 12) //12 // gravity
        ),
        models: {},
        kinematics:[],
        player: new Player(Box2D),
        updateKinematics: function() {
            if (this.kinematics.length > 0) {
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
                            //pos.x = body.UserData.waypoints[t].x;
                            //pos.y = body.UserData.waypoints[t].y;
                            body.UserData.waypointTarget++;
                            body.SetLinearVelocity(new Box2D.b2Vec2(0,0));
                            //console.log('arrived at ' + t);
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
            }
        },
        drawCanvas: function() {
            //this.context.fillStyle = 'rgb(0,0,0)';
            this.context.fillRect(0, 0, this.$canvas.width, this.$canvas.height);

            this.context.save();
            this.context.scale(this.scale, this.scale);
            let p = this.player.chasis.GetPosition()
 
            if (this.player.exploded.value) {
                p = this.player.diedHere;
            }

            this.context.translate(-(p.x - (450 / this.scale)), -(p.y - (300 / this.scale)));
            this.context.lineWidth /= this.scale;

            //this.context.fillStyle = 'rgb(255,255,0)';
            this.world.DebugDraw();

            this.context.restore();
        },
        define : function(properties) {
            if (properties.parent) {
                var parent = this.models[properties.parent];
                for(var key in parent.properties) {
                    if (!properties[key]) {
                        var value = parent.properties[key];
                        properties[key] = value;
                    }
                }

            }
            properties.scale = this.scale;
            
            var model = new Model(properties, Box2D);
            /* @todo
            model.sheet = new createjs.SpriteSheet({
                images: ["images/"+properties.name+ ".png"],
                frames: {width:properties.width, height:properties.height}
            });
            */

            this.models[properties.name] = model;
        },
        putPlayer: function(x, y) {
            this.player.exploded.value = false;
            this.player.startHere = new Box2D.b2Vec2(x/this.scale,y/this.scale)
            this.player.joints = [];
        	this.player.nuke = this.put("nuke",x-20,y-32);
            this.player.chasis = this.put("chasis",x,y);
            this.player.tire1 = this.put("tire",x-26,y+15);
            this.player.tire2 = this.put("tire",x+24,y+15);

            console.log(this.player.tire1)

            this.player.joints.push(this.join(this.player.chasis,-26,26, this.player.tire1, 0, 0, false));
            this.player.joints.push(this.join(this.player.chasis,24,26, this.player.tire2, 0, 0, false));
            this.player.joints.push(this.join(this.player.chasis,-6,-20, this.player.nuke,12, 5, true));	
        },
        put: function(name, x, y) {
            if (name == 'player') {
                return this.putPlayer(x,y);
            }
            let my = (y/this.scale)-(this.$canvas.height/2/this.scale);
            if (this.player.maxY == Infinity || this.player.maxY < my) {
                this.player.maxY = my;
            }
            let model = this.models[name];
            if (!model) {
                console.error("Missing definition for " + name);
                return undefined;
            }
 
            if (model.body) {
                const pos = new Box2D.b2Vec2(x/this.scale, y/this.scale);

                var body = this.world.CreateBody(model.body);
                body.SetTransform(pos, 0);

                if (model.shape) { // not passive
                    body.SetLinearVelocity(ZERO);
                    body.SetAwake(true);
                    body.SetEnabled(true);

                    let fixture = body.CreateFixture(model.shape, model.properties.mass);
                    
                    fixture.SetDensity(1);//model.properties.mass);
                    fixture.SetFriction(model.properties.friction);
                    fixture.SetRestitution(model.properties.elastic);

                    if (model.properties.type == "sensor") {
                        fixture.SetSensor(true);
                    }
                    if (model.body.type == Box2D.b2_kinematicBody && model.properties.waypoints) {
                        //console.log('b2_kinematicBody')
                        let wp = model.properties.waypoints;
                        let userData = {
                            waypoints: [],
                            waypointTarget: 0
                        }

                        for (var i = 0; i < wp.length; i+=2) {
                            var v = new Box2D.b2Vec2((x+ wp[i]) /this.scale , (y + wp[i+1]) /this.scale );
                            userData.waypoints.push(v);
                        }
                        body.UserData = userData
                        this.kinematics.push(body);
                    }
                }
                
                return body;
            }

        },
        join:function(bodyA, xA, yA, bodyB, xB, yB, collide) {
            var jDef = new Box2D.b2RevoluteJointDef();
            jDef.set_bodyA(bodyA);
            jDef.set_bodyB(bodyB);

            jDef.set_localAnchorA(new Box2D.b2Vec2(xA/this.scale, yA/this.scale))
            jDef.set_localAnchorB(new Box2D.b2Vec2(xB/this.scale, yB/this.scale))

            jDef.set_collideConnected(collide)     
            let j = this.world.CreateJoint(jDef)
            
            return j;
            
        }
    }

    const debugDraw = makeDebugDraw(sim.context,sim.scale, Box2D);
    sim.world.SetDebugDraw(debugDraw);

    //console.log('Sim return')
    return sim;
}

export default Sim;