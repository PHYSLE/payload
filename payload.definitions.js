/* ---------------------------

Copyright © PHYSLE
All rights reserved.

--------------------------- */

Sim.define({
	name:"tire",
	type:"active",
	shape:"circle",
	radius:17,
	width:34,
	height:34,
	mass:30, //16
	friction:1,
	elastic:.1,
	fixed:false
});

Sim.define({
	name:"chasis",
	type:"active",
	shape:"polygon",
	mass:38,
	friction:1,
	elastic:.1,
	fixed:false,
	width:85,
	height:40,
	verts:[27,-10, 43, 1, 38,  7, -42, 7, -42, 2,-33, -10]

});

Sim.define({
	name:"nuke",
	type:"active",
	shape:"rectangle",
	mass:8,
	friction:.8,
	elastic:.1,
	fixed:false,
	width:32,
	height:20
});


Sim.define({
	name:"triangle",
	type:"static",
	shape:"polygon",
	mass:Infinity,
	friction:1,
	elastic:0,
	width:120,
	height:60,
	verts:[0,-30,60,30,-60,30]
});		


Sim.define({
	name:"block1a",
	type:"static",
	shape:"rectangle",
	width:100,
	height:100,
	mass:Infinity,
	elastic:0,
	friction:1
});

Sim.define({
	name:"block1b",
	parent:"block1a"
});

Sim.define({
	name:"block2a",
	parent:"block1a"
});

Sim.define({
	name:"block2b",
	parent:"block1a"
});

Sim.define({
	name:"block3a",
	parent:"block1a"
});

Sim.define({
	name:"block3b",
	parent:"block1a"
});

Sim.define({
	name:"block4a",
	parent:"block1a"
});

Sim.define({
	name:"block4b",
	parent:"block1a"
});

Sim.define({
	name:"block5a",
	type:"static",
	shape:"polygon",
	verts:[50, -50,  50, 50,  -50, 50, -50, -15,-15,-50],
	width:100,
	height:100,
	mass:Infinity,
	elastic:0,
	friction:1
})

Sim.define({
	name:"block5b",
	parent:"block5a"
});


Sim.define({
	name:"block6a",
	type:"static",
	shape:"polygon",
	verts:[15, -50,  50, -15,  50, 50, -50, 50,-50,-50],
	width:100,
	height:100,
	mass:Infinity,
	elastic:0,
	friction:1
})


Sim.define({
	name:"block6b",
	parent:"block6a"
});


Sim.define({
	name:"blocksa",
	parent:"block1a",
	width:50,
	height:50
});


Sim.define({
	name:"blocksb",
	parent:"blocksa"
});

Sim.define({
	name:"blockxsa",
	type:"dynamic",
	shape:"rectangle",
	width:25,
	height:25,
	mass:1,
	elastic:0,
	friction:1
})

Sim.define({
	name:"blockxsb",
	parent:"blockxsa"
});

Sim.define({
	name:"floor1",
	parent:"block1a",
	width:500,
	height:200
});

Sim.define({
	name:"floor2",
	parent:"block1a",
	width:300,
	height:300
});

Sim.define({
	name:"floor3",
	type:"static",
	shape:"polygon",
	verts:[75, -137,  75, 162,  -75,  137, -75, -162],
	mass:Infinity,
	elastic:0,
	friction:1,
	width:150,
	height:325
});


Sim.define({
	name:"floor4",
	type:"static",
	shape:"polygon",
	verts:[75, -162,  75, 137,  -75,  162, -75, -137],
	mass:Infinity,
	elastic:0,
	friction:1,
	width:150,
	height:325
});


Sim.define({
	name:"wall1",
	shape:"rect",
	type:"passive",
	width:200,
	height:200
});


Sim.define({
	name:"wall2",
	shape:"rect",
	type:"passive",
	width:200,
	height:200
});

Sim.define({
	name:"floor5",
	parent:"floor1",
	width:300,
	height:150
});

Sim.define({
	name:"blockwb",
	shape:"rectangle",
	type:"kinematic",
	mass:10,
	elastic:0,
	friction:1,
	width:230,
	height:100,
	waypoints:[200,0,0,0],
	velocity:5
});


Sim.define({
	name:"depot",
	type:"sensor",
	shape:"polygon",
	verts:[-50,-50,50,-50,50,50,-50,50],
	width:250,
	height:150
});
