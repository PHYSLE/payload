/* ---------------------------

Copyright © PHYSLE
All rights reserved.

--------------------------- */

   // http://www.box2dflash.org/docs/2.1a/reference/
   
   
   // const
	var KEY_LEFT = 37,
	KEY_RIGHT = 39,
	KEY_UP = 38, 
	KEY_DOWN = 40, 
	KEY_SPACE = 32,
	KEY_TILDE = 192,
	KEY_ESCAPE = 27,
	MOVING_RIGHT = false, 
	MOVING_LEFT = false, 
	MOVING_UP = false, 
	MOVING_DOWN = false,
	RAD_MULT = 57.2958;

   
	Sim = {
		debug:false,
		stage:new createjs.Stage("canvas"),
		screen:new createjs.Container(),
		world:new Box2D.Dynamics.b2World(
		   new Box2D.Common.Math.b2Vec2(0, 260)  //200 gravity
		   ,true  //allow sleep
       ),
		models:{},
		init:function() {

			this.stage.addChild(this.screen);
			document.onkeydown = function (event) {
				switch(event.keyCode) {
					case KEY_LEFT:	
						MOVING_LEFT = true;
						break;
					case KEY_RIGHT: 
						MOVING_RIGHT = true;
						break;
					case KEY_UP: 
						MOVING_UP= true;
						break;
					case KEY_DOWN: 
						MOVING_DOWN = true;
						break;
					case KEY_SPACE: 

						break;
					case KEY_ESCAPE: 

						break;
					case KEY_TILDE:
						Sim.debug = !Sim.debug;
						break;
				}
			}
	
			document.onkeyup = function (event) {
				switch(event.keyCode) {
					case KEY_LEFT:	
						MOVING_LEFT = false;
						break;
					case KEY_RIGHT: 
						MOVING_RIGHT = false;
						break;
					case KEY_DOWN: 
						MOVING_DOWN = false;
						break;
					case KEY_UP: 
						MOVING_UP = false;
						break;
				}
			}	
		
		},
		
		define:function(properties) {
			var model = {};
			if (properties.parent) {
				var parent = this.models[properties.parent];
				for(var key in parent.properties) {
					if (!properties[key]) {
						var value = parent.properties[key];
						properties[key] = value;
					}
				}

			}
			model.properties = properties;
			if (properties.type != "passive") { // passives just exist for looks
				model.fixture = new Box2D.Dynamics.b2FixtureDef;
				model.fixture.density = properties.mass;
				model.fixture.friction = properties.friction;
				model.fixture.restitution = properties.elastic;
				model.body = new Box2D.Dynamics.b2BodyDef;
				model.body.userData = properties;
				
				if (properties.fixed) {
					model.body.fixedRotation = true;
				}
				else {
					model.body.fixedRotation = false;
				}
				
				if (properties.type == "static") {
					model.body.type = Box2D.Dynamics.b2Body.b2_staticBody;
				}
				else {
					model.body.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
				}
				
				if (properties.shape == "circle") {
					model.fixture.shape = new Box2D.Collision.Shapes.b2CircleShape(properties.radius);
				}
				else {
					model.fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape;
					if (properties.shape == "rectangle") {
						model.fixture.shape.SetAsBox(properties.width/2, properties.height/2);
					}
					else {
						var b2Verts = [];
						for (var i = 0; i < properties.verts.length; i+=2) {
							var v = new Box2D.Common.Math.b2Vec2(properties.verts[i], properties.verts[i+1]);
							b2Verts.push(v);
						}

						model.fixture.shape.SetAsArray(b2Verts, b2Verts.length);
					}
				}
				
			}
			

			model.sheet = new createjs.SpriteSheet({
				images: ["images/"+properties.name+ ".png"],
				frames: {width:properties.width, height:properties.height}
			});

			this.models[properties.name] = model;
		},
		
		put:function(name, x, y) {
			var model = Sim.models[name];
			if (!model) {
				console.log("Missing definition for " + name);
				return null;
			}
			if (model.body) {
				model.body.position.Set(x, y);
				var obj = this.world.CreateBody(model.body);
				obj.CreateFixture(model.fixture);
			}
			var sprite = new createjs.Sprite(model.sheet);
			sprite.x = x;
			sprite.y = y;
			
			sprite.regX = model.properties.width / 2;
			sprite.regY = model.properties.height / 2;

			sprite.userData = obj; 
			Sim.screen.addChild(sprite); // todo screen

			return obj;
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

			var jDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef;
			jDef.bodyA = bodyA;
			jDef.bodyB = bodyB;
			
			jDef.localAnchorA = new Box2D.Common.Math.b2Vec2(xA, yA); 
			jDef.localAnchorB = new Box2D.Common.Math.b2Vec2(xB, yB); 
			
			jDef.collideConnected = collide;
			return Sim.world.CreateJoint(jDef);
			
		},
		update:function() {
			if (MOVING_LEFT) {
				Player.move(MOVING_LEFT);
			}
			if (MOVING_RIGHT) {
				Player.move(MOVING_RIGHT);
			}
			
			Sim.world.Step(1 / 60, 1000, 1000);
			
			if (!Player.exploded) {
				var cl = Player.nuke.GetContactList();
				while (cl) {
					if (cl.other != Player.chasis && cl.other.GetUserData().name != "tire" && cl.contact.IsTouching()) {
						console.log("nuke touched " + cl.other.GetUserData().name);
						Player.explode();
					}
					cl = cl.next;
				}			
			}
			Sim.world.ClearForces();
			
			var playerPos = Player.chasis.GetPosition();
			Sim.screen.x = -playerPos.x.toFixed(0) + 500  // canvas.width/2 
			if (Sim.debug) {
	            Sim.world.DrawDebugData();
	        }
	        else {

				var pos, a;
				for(var i=0; i<Sim.screen.children.length; i++) {
					var child = Sim.screen.children[i];
					if (child.userData && child.userData != undefined) {
						pos = child.userData.GetPosition();
						a = child.userData.GetAngle();
						if (pos) {
							child.x = pos.x
							child.y = pos.y
							child.rotation = a * RAD_MULT;
						}
					}

				} 
			
			
				Sim.stage.update();
			}
        }
	}

   var Player = {
   		speed:900000,
   		chasis:null,
   		nuke:null,
   		tire1:null,
   		tire2:null,
   		joints:[],
   		exploded:false,
   		put:function(x,y) {
			this.nuke=Sim.put("nuke",x-20,y-32);
			this.chasis=Sim.put("chasis",x,y);
			this.tire1=Sim.put("tire",x-26,y+15);
			this.tire2=Sim.put("tire",x+24,y+15);
   			this.joints.push(Sim.join(this.chasis,-26,26, this.tire1, 0, 0, false));
			this.joints.push(Sim.join(this.chasis,24,26, this.tire2, 0, 0, false));
			this.joints.push(Sim.join(this.chasis,-10,-20,this.nuke,12, 5, true));	
			//	spring(self.chasis,-26,-10,self.tire1,0,0,150,8,10,.5)
			//	spring(self.chasis,24,-10,self.tire2,0,0,150,8,10,.5)
   		},
   		explode:function() {
   			if (this.exploded) {
				return;
			}
			for(var i=0; i< this.joints.length; i++) {
				Sim.world.DestroyJoint(this.joints[i]);
			}
			
			var p1 = this.tire1.GetPosition();
			p1.x += (Math.random() * 10 - 5);
			p1.y += 10
			this.tire1.ApplyImpulse(new Box2D.Common.Math.b2Vec2(Math.random() * this.speed * 10, Math.random() * this.speed * 10), p1);
			
			var p2 = this.tire2.GetPosition();
			p2.x += (Math.random() * 10 - 5);
			p2.y += 10
			this.tire2.ApplyImpulse(new Box2D.Common.Math.b2Vec2(Math.random() * this.speed * 10, Math.random() * this.speed * 10), p2);
			
			var p3 = this.nuke.GetPosition();
			p3.x += (Math.random() * 10 - 5);
			p3.y += 10
			this.nuke.ApplyImpulse(new Box2D.Common.Math.b2Vec2(Math.random() * this.speed * 1000000, Math.random() * this.speed * 1000000), p3);
	
			var p4 = this.chasis.GetPosition();
			p4.x += (Math.random() * 10 - 5);
			p4.y += 10
			this.chasis.ApplyImpulse(new Box2D.Common.Math.b2Vec2(Math.random() * this.speed * 100000, Math.random() * this.speed * 100000), p3);	
			this.exploded = true;

			setTimeout(function(){ location='payload.html'}, 5000);	
   		
   		},
   		move: function(key) {
   		   	if (this.exploded) {
				return;
			}
   		
			var v = new Box2D.Common.Math.b2Vec2(key == MOVING_LEFT?-this.speed:this.speed, 0);
			
			// tire 1
			var cl = Player.tire1.GetContactList();
			var touches = false;
			while (cl) {
				if (cl.contact.IsTouching()) {
					touches = true;
				}
				cl = cl.next;
			}

			if (touches) {
				var p1 = Player.tire1.GetPosition();
				p1.y -=12;
				Player.tire1.ApplyForce(v, p1);
			}

			// tire 2
			cl = Player.tire2.GetContactList();
			touches = false;
			while (cl) {
				if (cl.contact.IsTouching()) {
					touches = true;
				}
				cl = cl.next;
			}	

			if (touches) {
				var p2 = Player.tire2.GetPosition();
				p2.y -=12;
				Player.tire2.ApplyForce(v, p2);
			}

		}
   };



   