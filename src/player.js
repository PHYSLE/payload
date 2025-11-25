import Bindable from './bindable.js'
import Particle from './particle.js'

function Player(Box2D) {
    const player =  {
        sim:null,
        chasis:null,
        nuke:null,
        tire1:null,
        tire2:null,
        joints:[],

        exploded: new Bindable(false),
        finished: new Bindable(false),
        timer: new Bindable(0),
        diedHere: null, // exploded position 
        maxY: Infinity, //set by level
        force: 400,//260,
        explodeForce: 8,
        maxContacts: 12,
        applyForce(body, forceVec) {
            let iterator = body.GetContactList();
            let touches = false;
            let i = 0;

            // Zu  = pointer aka memory location, 0 = null   
            while (iterator.Zu > 0 && i < this.maxContacts) {
                if (iterator.contact.IsTouching()) {
                    touches = true;
                }
                iterator = iterator.get_next();
                i++
            }

            if (touches) {
                body.ApplyForce(forceVec, this.tire1.GetPosition(), true);
            }
        },
        move:function(direction) {
            if (this.exploded.value || this.finished.value) {
                return;
            }
            let a = this.chasis.GetAngle();

            let x = this.force * Math.cos(a) * direction;
            let y = this.force * Math.sin(a) * direction;

            //let forceVec= new Box2D.b2Vec2(direction < 0 ?-this.force:this.force, 0);
            let forceVec = new Box2D.b2Vec2(x,y)
            this.applyForce(this.tire1, forceVec)
            this.applyForce(this.tire2, forceVec)
        },
        update:function() {
            if (this.exploded.value || this.finished.value) {
                return;
            }
            let iterator = this.nuke.GetContactList();
            let i = 0;
            let pos = this.chasis.GetPosition();

            // fell off the world
            if (pos.y > this.maxY) {
                this.explode();
            }

            if (this.timer.value > 60000) {
                this.explode();
            }

            // Zu  = pointer aka memory location, 0 = null   
            while (iterator.Zu > 0 && i < this.maxContacts) {
                if (iterator.contact.IsTouching()) {

                    if (iterator.other.UserData.name == "depot") {
                        if (!this.finished.value && !this.exploded.value) {
                            this.finished.value = true;
                        }
                    }
                    else if (iterator.other != this.chasis) {
                        this.explode();
                    }
                }
                iterator = iterator.get_next();
                i++
            }
            
        },
        randForce:function(f) {

            //let a = Math.random() * Math.PI * 2 - Math.PI;
            let a = Math.random() * Math.PI - Math.PI;

            let x = f * Math.cos(a);
            let y = f * Math.sin(a);
            /*
            let x = Math.random()*f-f/2;
            let y = Math.random()*f-f/2;
            */
            return new Box2D.b2Vec2(x,y)
        },
        explode:function() {
            let pos = this.chasis.GetPosition()
            let world = this.sim.world;
            this.diedHere = new Box2D.b2Vec2(pos.x, pos.y)
            
            if (this.exploded.value) {
                return;
            }
            for(var i=0; i< this.joints.length; i++) {
                world.DestroyJoint(this.joints[i]);
            }

            
            const p1 = this.sim.put('chasis-3', this.sim.scale * pos.x-30, this.sim.scale * pos.y)
            const p2 = this.sim.put('chasis-2', this.sim.scale * pos.x, this.sim.scale * pos.y)
            const p3 = this.sim.put('chasis-1', this.sim.scale * pos.x+30, this.sim.scale * pos.y)
            for(let d = 0; d<8; d++) {
                let debris = this.sim.put('debris', this.sim.scale * pos.x, this.sim.scale * pos.y-20)
                let g = Math.random() * 50 + 150
                debris.UserData.color = `RGB(255,${g},20)`
                debris.UserData.alpha = 1; 
                debris.ApplyLinearImpulse(this.randForce(this.explodeForce/20), debris.GetPosition(), true);
            }


            for(let p = 0; p<8; p++) {
                let x = Math.random() * 100 - 50;
                let s = Math.random() * 4/2
                this.sim.particles.push(new Particle(this.sim.scale * pos.x-x, this.sim.scale * pos.y+20, .5, s))
            }

            const index = this.sim.layers[2].indexOf(this.chasis);
            
            if (index > -1) { 
                this.sim.layers[2].splice(index, 1); 
            }
            world.DestroyBody(this.chasis)


            for(const body of [this.nuke, p1, p2, p3]) {
                body.ApplyLinearImpulse(this.randForce(this.explodeForce), body.GetPosition(), true);
            }
            for(const body of [this.tire1, this.tire2]) {
                body.ApplyLinearImpulse(this.randForce(this.explodeForce * 20), body.GetPosition(), true);
            }

            this.exploded.value = true;      

        }
    }
    return player;
}

export default Player