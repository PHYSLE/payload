function Player(Box2D) {
    const player =  {
        chasis:null,
        nuke:null,
        tire1:null,
        tire2:null,
        joints:[],
        exploded: false,
        diedHere: null, // exploded position 
        startHere: null, // set by level
        maxY: Infinity, //set by level
        force: 260,
        explodeForce: 400,
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
            if (this.exploded) {
                return;
            }
            let forceVec= new Box2D.b2Vec2(direction < 0 ?-this.force:this.force, 0);
            this.applyForce(this.tire1, forceVec)
            this.applyForce(this.tire2, forceVec)
        },
        update:function() {
            let iterator = this.nuke.GetContactList();
            let i = 0;
            let pos = this.chasis.GetPosition();

            // fell off the world
            if (pos.y > this.maxY) {
                this.explode();
            }

            // Zu  = pointer aka memory location, 0 = null   
            while (iterator.Zu > 0 && i < this.maxContacts) {
                if (iterator.contact.IsTouching()) {
                    /*
                    if (name == "depot") {
                        this.win();
                    }
                    */
                    if (iterator.other != this.chasis) {
                        this.explode();
                    }
                }
                iterator = iterator.get_next();
                i++
            }
        },
        randForce:function() {
            // maybe use random angle so it always hits hard!
            let f = this.explodeForce;
            let x = Math.random()*f-f/2;
            let y = Math.random()*f-f/2;
            return new Box2D.b2Vec2(x,y)
        },
        explode:function() {
            let world = this.chasis.GetWorld();
            if (this.exploded) {
                return;
            }
            for(var i=0; i< this.joints.length; i++) {
                world.DestroyJoint(this.joints[i]);
            }

            for(const body of [this.tire1, this.tire2, this.nuke, this.chasis]) {
                body.ApplyLinearImpulse(this.randForce(), body.GetPosition(), true);
            }

            let pos = this.chasis.GetPosition()
            this.diedHere = new Box2D.b2Vec2(pos.x, pos.y)
            this.exploded = true;      
            ;
        }
    }
    return player;
}

export default Player