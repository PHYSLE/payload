/* ---------------------------

Copyright © PHYSLE
All rights reserved.

--------------------------- */

// http://www.box2dflash.org/docs/2.1a/reference/
// http://buildnewgames.com/box2dweb/

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

var v2 = Box2D.Common.Math.b2Vec2;

Sim = {
	paused:false,
	scale:10, // number of pixels per box2d "unit"
	debug:true,
	startTime:new Date().getTime(),
	stage:new createjs.Stage("canvas"),
	screen:new createjs.Container(),
	world:new Box2D.Dynamics.b2World(
	   new v2(0, 13) //12
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
					Sim.paused = !Sim.paused;				
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
			if (properties.type == "sensor") {
				model.fixture.isSensor = true;
			}
			
			
			model.body = new Box2D.Dynamics.b2BodyDef;
			model.body.userData = properties;
			
			if (properties.fixed) {
				model.body.fixedRotation = true;
			}
			else {
				model.body.angularDamping = 2.6;
				model.body.fixedRotation = false;
			}
			
			if (properties.type == "static" || properties.type == "sensor") {
				model.body.type = Box2D.Dynamics.b2Body.b2_staticBody;
			}
			else if (properties.type == "kinematic") {
				model.body.type = Box2D.Dynamics.b2Body.b2_kinematicBody
			}
			else {
				model.body.linearDamping = .2;
				model.body.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			}
			
			if (properties.shape == "circle") {
				model.fixture.shape = new Box2D.Collision.Shapes.b2CircleShape(properties.radius/this.scale);
			}
			else {
				model.fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape;
				if (properties.shape == "rectangle") {
					model.fixture.shape.SetAsBox(properties.width/this.scale/2, properties.height/this.scale/2);
				}
				else {
					var b2Verts = [];
					for (var i = 0; i < properties.verts.length; i+=2) {
						var v = new v2(properties.verts[i]/this.scale, properties.verts[i+1]/this.scale);
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
			model.body.position.Set(x/this.scale, y/this.scale);
			var obj = this.world.CreateBody(model.body);
			obj.CreateFixture(model.fixture);
		}
		var sprite = new createjs.Sprite(model.sheet);
		sprite.x = x;
		sprite.y = y;
		
		sprite.regX = model.properties.width / 2;
		sprite.regY = model.properties.height / 2;

		sprite.userData = {}
		sprite.userData.body = obj; 
		
		
		if (model.properties.type == "kinematic" && model.properties.waypoints) {
			var wp = model.properties.waypoints;
			sprite.userData.waypoints = [];
			for (var i = 0; i < wp.length; i+=2) {
				var v = new v2((x+ wp[i]) /this.scale , (y + wp[i+1]) /this.scale );
				sprite.userData.waypoints.push(v);
			}
			sprite.userData.waypointTarget = 0;
			if (model.properties.velocity) {
				sprite.userData.velocity = model.properties.velocity;
			}
			else {
				sprite.userData.velocity = 5;				
			}
		}
		
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
		
		jDef.localAnchorA = new v2(xA/this.scale, yA/this.scale); 
		jDef.localAnchorB = new v2(xB/this.scale, yB/this.scale); 
				
		jDef.collideConnected = collide;
		return Sim.world.CreateJoint(jDef);
		
	},
	update:function() {
		if (Sim.paused)
			return;
		
		// "this" does not refer to Sim when update is called
		if (MOVING_LEFT) {
			Player.move(MOVING_LEFT);
		}
		if (MOVING_RIGHT) {
			Player.move(MOVING_RIGHT);
		}
			
		//Sim.world.Step(1 / 60, 1000, 1000);
		Sim.world.Step(1 / 40, 1000, 1000);
		
		if (!Player.exploded) {
			var cl = Player.nuke.GetContactList();
			while (cl) {
				var name = cl.other.GetUserData().name;
				/*
				if (cl.other != Player.chasis && name != "tire" && cl.contact.IsTouching()) {
					console.log("nuke touched " + cl.other.GetUserData().name);
					Player.explode();
				}
				*/
				if (cl.contact.IsTouching()) {
					if (!Player.touchables.includes(name)) {
						Player.explode();
					}
					else if (name == "depot") {
						Player.win();
					}
				}
				cl = cl.next;
			}			
		}
		if (!Player.exploded) {
			var playerPos = Player.chasis.GetPosition();
			Sim.screen.x = -playerPos.x * Sim.scale + 500  // canvas.width/2 
			Sim.screen.y = -playerPos.y * Sim.scale + 400  
		}
		
		var pos, a;
		for(var i=0; i<Sim.screen.children.length; i++) {
			var child = Sim.screen.children[i];
			if (child.userData && child.userData != undefined && child.userData.body) {
				pos = child.userData.body.GetPosition();
				a = child.userData.body.GetAngle();
				if (pos) {
					child.x = pos.x * Sim.scale;
					child.y = pos.y * Sim.scale;
					child.rotation = a * RAD_MULT;
				}
				if (child.userData.waypoints && child.userData.waypoints.length > 0 ) {
					var vel = 5; // @todo
					var t = child.userData.waypointTarget % child.userData.waypoints.length;	
						
					
					var xd = Math.abs(pos.x - child.userData.waypoints[t].x);
					var yd = Math.abs(pos.y - child.userData.waypoints[t].y);

					if (xd <= .1 && yd <= .1) {
						// arrived
						//child.x = child.waypoints[t].x;
						//child.y = child.waypoints[t].y;
						child.userData.waypointTarget++;
						child.userData.body.SetLinearVelocity(new v2(0,0));
						//console.log('arrived at ' + t);
					}
					else {
						if (pos.x < child.userData.waypoints[t].x) {
							child.userData.body.SetLinearVelocity(new v2(vel,0));
						}
						else if (pos.x > child.userData.waypoints[t].x) {
							child.userData.body.SetLinearVelocity(new v2(-vel,0));
						}
					
						if (pos.y < child.userData.waypoints[t].y) {
							//child.userData.body.SetLinearVelocity(new v2(0,vel));
						}
						else if (pos.y > child.userData.waypoints[t].y) {
							//child.userData.body.SetLinearVelocity(new v2(0,-vel));
						}			
					}
				}
			}

		} 
		
		
		Sim.world.ClearForces();
		
		if (Sim.debug) {
			Sim.world.DrawDebugData();
		}
		//else {
			Sim.stage.update();
		//}
		
		
		var t = (new Date().getTime() - Sim.startTime) / 1000;
		$('#timer').html(60 - t.toFixed(0));
	}
}

var Player = {
	//http://www.emanueleferonato.com/2011/08/22/step-by-step-creation-of-a-box2d-cartruck-with-motors-and-shocks/
	force:20000, // 20000 movement force
	maxtorque:4600, //4000
	chasis:null,
	nuke:null,
	tire1:null,
	tire2:null,
	joints:[],
	exploded:false,
	touchables:["tire","chasis","depot"],
	put:function(x,y) {
		this.nuke=Sim.put("nuke",x-20,y-32);
		this.chasis=Sim.put("chasis",x,y);
		this.tire1=Sim.put("tire",x-26,y+15);
		this.tire2=Sim.put("tire",x+24,y+15);
		this.joints.push(Sim.join(this.chasis,-26,26, this.tire1, 0, 0, false));
		this.joints.push(Sim.join(this.chasis,24,26, this.tire2, 0, 0, false));
		this.joints.push(Sim.join(this.chasis,-6,-20,this.nuke,12, 5, true));	
		
		// using motors for max torque 
		this.joints[0].EnableMotor(true);
		this.joints[1].EnableMotor(true);
		this.joints[0].SetMaxMotorTorque(this.maxtorque);
		this.joints[1].SetMaxMotorTorque(this.maxtorque);

		//	spring(self.chasis,-26,-10,self.tire1,0,0,150,8,10,.5)
		//	spring(self.chasis,24,-10,self.tire2,0,0,150,8,10,.5)
	},
	explode:function() {
		var f = 20000;
		if (this.exploded) {
			return;
		}
		for(var i=0; i< this.joints.length; i++) {
			Sim.world.DestroyJoint(this.joints[i]);
		}
		
		var p1 = this.tire1.GetPosition();
		p1.x += (Math.random() * 10 - 5);
		p1.y += 10
		this.tire1.ApplyImpulse(new v2(Math.random()*f , Math.random()*f), p1);
		
		var p2 = this.tire2.GetPosition();
		p2.x += (Math.random() * 10 - 5);
		p2.y += 10
		this.tire2.ApplyImpulse(new v2(Math.random()*f , Math.random()*f), p2);
		
		var p3 = this.nuke.GetPosition();
		p3.x += (Math.random() * 10 - 5);
		p3.y += 10
		this.nuke.ApplyImpulse(new v2(Math.random()*f, Math.random()*f), p3);

		var p4 = this.chasis.GetPosition();
		p4.x += (Math.random() * 10 - 5);
		p4.y += 10
		this.chasis.ApplyImpulse(new v2(Math.random()*f, Math.random()*f), p4);	
		this.exploded = true;

		setTimeout(function(){ location='payload.html'}, 5000);	
	
	},
	move:function(key) {
		if (this.exploded) {
			return;
		}
	
		var v = new v2(key == MOVING_LEFT?-this.force:this.force, 0);
		
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
			Player.tire1.ApplyForce(v, Player.tire1.GetPosition());
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
			Player.tire2.ApplyForce(v, Player.tire2.GetPosition());
		}

	},
	win:function() {
		alert('OK!');
		location='payload.html';
	}
};



