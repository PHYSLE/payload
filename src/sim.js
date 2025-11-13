
import Box2DFactory from 'box2d-wasm';
import { makeDebugDraw } from './debugDraw.js';

const Box2D = await Box2DFactory({
   locateFile: (path, prefix) => {
     //console.log(prefix, path)
     //return prefix + path;
     //for vite just use public/assets
     return "assets/" + path;
   }
})
console.log(Box2D)
const ZERO = new Box2D.b2Vec2(0, 0);


function Model(properties) {
    const scale =  properties.scale;
    const model =  {
        properties: properties,
        body: new Box2D.b2BodyDef(),
        shape: null
    }
    model.body.userData = properties;
    if (properties.type == "passive") { 
        return model;
    }

    if (properties.fixed) {
        model.body.fixedRotation = true;
    }
    else {
        model.body.set_angularDamping(.2); //2.6;
        model.body.fixedRotation = false;
    }
    if (properties.type == "static" || properties.type == "sensor") {
        model.body.set_type(Box2D.b2_staticBody);
    }
    else if (properties.type == "kinematic") {
        model.body.set_type(Box2D.b2_kinematicBody);
    }
    else {
        model.body.set_linearDamping(.2);
        model.body.set_type(Box2D.b2_dynamicBody);
    }

    if (properties.shape == "circle") {
        model.shape = new Box2D.b2CircleShape();
        model.shape.m_radius = properties.radius/scale;
    }
    else {
        const shape = new Box2D.b2PolygonShape();
        if (properties.shape == "rectangle") {
            shape.SetAsBox(properties.width/scale/2, properties.height/scale/2);
        }
        else {
            //console.log(shape)

            var b2Verts= [];
            for (var i = 0; i < properties.verts.length; i+=2) {
                var v = new Box2D.b2Vec2(properties.verts[i]/scale, properties.verts[i+1]/scale);
                b2Verts.push(v);
            }

            // https://github.com/Birch-san/box2d-wasm/discussions/29
            const [vecArr, destroyVecArr] = Box2D.pointsToVec2Array(b2Verts);

            shape.Set(vecArr, b2Verts.length);
            destroyVecArr();
        }
        model.shape = shape;
    }
    return model;

}

function Sim(canvasId) {
     const $canvas = document.getElementById(canvasId)
     const sim = {
        paused: false,
        engine: Box2D,
        scale: 32,// 1, // pixelsPerMeter = 32;
        $canvas: $canvas,
        context: $canvas.getContext("2d"),
        models: {},
        player: {
            chasis:null,
            nuke:null,
            tire1:null,
            tire2:null,
            joints:[],
            exploded: false,
            force: 200,
            move:function(direction) {
                if (this.exploded) {
                    return;
                }
            
                var v = new Box2D.b2Vec2(direction < 0 ?-this.force:this.force, 0);
                
                // tire 1
                var contact = this.tire1.GetContactList();
                var touches = false;


                let i = 0;

                // Zu  = pointer aka memory location, 0 = null
           
                while (contact.Zu > 0 && i < 10) {

                    if (contact.contact.IsTouching()) {
                        //console.log(contact)
                        touches = true;
                    }
                    contact = contact.get_next();
                    i++

                }
                     
                if (touches) {

                    this.tire1.SetAwake(true)
                    this.tire1.ApplyForce(v, this.tire1.GetPosition());
                }

                // tire 2
                i = 0
                contact = this.tire2.GetContactList();
                touches = false;
                while (contact.Zu > 0 && i < 10) {

                    if (contact.contact.IsTouching()) {
                        //console.log(contact)
                        touches = true;
                    }
                    contact = contact.get_next();
                    i++

                }
              
                if (touches) {

                    this.tire2.SetAwake(true)
                    this.tire2.ApplyForce(v, this.tire2.GetPosition());
                }

            },
         },
         world: new Box2D.b2World(
             new Box2D.b2Vec2(0, 13) //12 // gravity
         ),
         drawCanvas: function() {
            console.log()

             this.context.fillStyle = 'rgb(0,0,0)';
             this.context.fillRect(0, 0, this.$canvas.width, this.$canvas.height);

             this.context.save();
             this.context.scale(this.scale, this.scale);
            let p = this.player.chasis.GetPosition()
            this.context.translate(0, 0)
             this.context.translate(-(p.x - (450 / this.scale)), -(p.y - (300 / this.scale)));
             this.context.lineWidth /= this.scale;

             this.context.fillStyle = 'rgb(255,255,0)';
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
            
            var model = new Model(properties);
            /* @todo
            model.sheet = new createjs.SpriteSheet({
                images: ["images/"+properties.name+ ".png"],
                frames: {width:properties.width, height:properties.height}
            });
            */

            this.models[properties.name] = model;
        },
        putPlayer: function(x, y) {
            this.player.joints = [];
        	this.player.nuke = this.put("nuke",x-20,y-32);
            this.player.chasis = this.put("chasis",x,y);
            this.player.tire1 = this.put("tire",x-26,y+15);
            this.player.tire2 = this.put("tire",x+24,y+15);

            this.player.joints.push(this.join(this.player.chasis,-26,26, this.player.tire1, 0, 0, false));
            this.player.joints.push(this.join(this.player.chasis,24,26, this.player.tire2, 0, 0, false));
            this.player.joints.push(this.join(this.player.chasis,-6,-20, this.player.nuke,12, 5, true));	

            //console.log(joints[0])
            
            // using motors for max torque 
            //joints[0].EnableMotor(true);
            //joints[1].EnableMotor(true);
            //joints[0].SetMaxMotorTorque(4000);
            //joints[1].SetMaxMotorTorque(4000);
        },
        put: function(name, x, y) {
            if (name == 'player') {
                return this.putPlayer(x,y);
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
                }
                
                return body;
            }

        },
        join:function(bodyA, xA, yA, bodyB, xB, yB, collide) {
            /*
            bodyA : b2Body - The first attached body.
            bodyB : b2Body - The second attached body.
            collideConnected : Boolean - Set this flag to true if the attached bodies should collide.
            enableLimit : Boolean - A flag to enable joint limits.
            enableMotor : Boolean - A flag to enable the joint motor.
            localAnchorA : b2Vec2 - The local anchor point relative to bodyA's origin.
            localAnchorB : b2Vec2 - The local anchor point relative to bodyB's origin.
            lowerAngle : Number - The lower angle for the joint limit (radians).
            maxMotorTorque : Number - The maximum motor torque used to achieve the desired motor speed.
            motorSpeed : Number - The desired motor speed.
            referenceAngle : Number - The bodyB angle minus bodyA angle in the reference state (radians).
            upperAngle : Number - The upper angle for the joint limit (radians).		
            */

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
