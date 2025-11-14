function defineAll(sim) { 

sim.define({
	name:"tire",
	type:"active",
	shape:"circle",
	radius:17,
	width:34,
	height:34,
	mass:20,//16,
	friction:1,
	elastic:0,
	fixed:false
});

sim.define({
	name:"chasis",
	type:"active",
	shape:"polygon",
	mass:4,
	friction:1,
	elastic:0,
	fixed:false,
	width:85,
	height:40,
	verts:[27,-10, 43, 1, 38,  7, -42, 7, -42, 2,-33, -10]

});

sim.define({
	name:"nuke",
	type:"active",
	shape:"rectangle",
	mass:1, //4,
	friction:.8,
	elastic:0,
	fixed:false,
	width:32,
	height:20
});


sim.define({
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


sim.define({
	name:"block1a",
	type:"static",
	shape:"rectangle",
	width:100,
	height:100,
	mass:Infinity,
	elastic:0,
	friction:1
});

sim.define({
	name:"block1b",
	parent:"block1a"
});

sim.define({
	name:"block2a",
	parent:"block1a"
});

sim.define({
	name:"block2b",
	parent:"block1a"
});

sim.define({
	name:"block3a",
	parent:"block1a"
});

sim.define({
	name:"block3b",
	parent:"block1a"
});

sim.define({
	name:"block4a",
	parent:"block1a"
});

sim.define({
	name:"block4b",
	parent:"block1a"
});

sim.define({
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

sim.define({
	name:"block5b",
	parent:"block5a"
});


sim.define({
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


sim.define({
	name:"block6b",
	parent:"block6a"
});


sim.define({
	name:"blocksa",
	parent:"block1a",
	width:50,
	height:50
});


sim.define({
	name:"blocksb",
	parent:"blocksa"
});

sim.define({
	name:"blockxsa",
	type:"dynamic",
	shape:"rectangle",
	width:25,
	height:25,
	mass:1,
	elastic:0,
	friction:1
})

sim.define({
	name:"blockxsb",
	parent:"blockxsa"
});

sim.define({
	name:"floor1",
	parent:"block1a",
	width:500,
	height:200
});

sim.define({
	name:"floor2",
	parent:"block1a",
	width:300,
	height:300
});

sim.define({
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


sim.define({
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


sim.define({
	name:"wall1",
	shape:"rect",
	type:"passive",
	width:200,
	height:200
});


sim.define({
	name:"wall2",
	shape:"rect",
	type:"passive",
	width:200,
	height:200
});

sim.define({
	name:"floor5",
	parent:"floor1",
	width:300,
	height:150
});

sim.define({
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


sim.define({
	name:"depot",
	type:"sensor",
	shape:"polygon",
	verts:[-50,-50,50,-50,50,50,-50,50],
	width:250,
	height:150,
	mass:Infinity
});

}

export default defineAll