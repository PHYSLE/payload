import Bindable from './bindable.js'

function Player(Box2D) {
    const player =  {
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
        explodeForce: 20,
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
        randForce:function() {

            let a = Math.random() * Math.PI * 2 - Math.PI;

            let x = this.explodeForce * Math.cos(a);
            let y = this.explodeForce * Math.sin(a);
            /*
            let x = Math.random()*f-f/2;
            let y = Math.random()*f-f/2;
            */
            return new Box2D.b2Vec2(x,y)
        },
        explode:function() {
            let pos = this.chasis.GetPosition()
            let world = this.chasis.GetWorld();
            
            if (this.exploded.value) {
                return;
            }
            for(var i=0; i< this.joints.length; i++) {
                world.DestroyJoint(this.joints[i]);
            }

            //world.DestroyBody(this.chasis)
            for(const body of [this.tire1, this.tire2, this.nuke]) {
                body.ApplyLinearImpulse(this.randForce(), body.GetPosition(), true);
            }

            this.diedHere = new Box2D.b2Vec2(pos.x, pos.y)
            this.exploded.value = true;      


        }
    }
    return player;
}

export default Player