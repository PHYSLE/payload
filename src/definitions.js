function defineAll(sim) { 

sim.define({
	name:"tire",
	type:"active",
	shape:"circle",
	radius:17,
	width:34,
	height:34,
	mass:20,//16,
	friction:2,
	elastic:0,
	fixed:false,
    layer:2
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
	verts:[27,-10, 43, 1, 38,  7, -42, 7, -42, 2,-33, -10],
    layer:2

});

sim.define({
	name:"nuke",
	type:"active",
	shape:"rectangle",
	mass:.5, //4,
	friction:.8,
	elastic:0,
	fixed:false,
	width:32,
	height:20,
    layer:2
});




sim.define({
	name:"depot",
	type:"sensor",
	shape:"polygon",
	verts:[-50,-50,50,-50,50,50,-50,50],
	width:250,
	height:150,
	mass:Infinity,
    layer:2
});

sim.define({
	name:"anchor",
	type:"static",
	shape:"circle",
	mass:Infinity,
	friction:1,
	elastic:0,
	radius:2,
    layer:0
});		

sim.define({
	name:"triangle",
	type:"static",
	shape:"polygon",
	mass:Infinity,
	friction:1,
	elastic:0,
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
	friction:1,
    layer:2
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
	friction:1,
    layer:2
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
	friction:1,
    layer:2
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
	width:35,
	height:35,
	mass:.5,
	elastic:0,
	friction:.5,
    layer:2
})

sim.define({
	name:"blockxsb",
	parent:"blockxsa"
});


sim.define({
    name:"blockxwa",
	type:"active",
	shape:"poly",
	verts:[
	   -150,-15,
	   -150,15,
	   -115,50,
	   115,50,
	   150,15,
	   150,-15,
	   115,-50,
		-115,-50
    ],
    joint: [0,0],
	mass:10,
	elastic:0,
	friction:1,
    layer:2
})

sim.define({
	name:"blockw_a",
	shape:"rectangle",
	type:"kinematic",
	mass:10,
	elastic:0,
	friction:1,
	width:230,
	height:100,
	waypoints:[200,0,0,0],
	velocity:5,
    layer:2
});

sim.define({
	name:"blockw_b",
	parent:"blockw_a"
});

sim.define({
	name:"block_wa",
	parent:"blockw_a",
	waypoints:[-200,0,0,0]
});

sim.define({
	name:"block_wb",
	parent:"block_wa"
});


sim.define({
	name:"blockw1a",
	parent:"blockw_a",
	waypoints:[0,-600,0,0]
});


sim.define({
	name:"blockw1b",
	parent:"blockw1a"
});

sim.define({
	name:"blockwvb",
	parent:"blockw1a",
	waypoints:[0,600,0,0]
});



sim.define({
	name:"floor1",
	parent:"block1a",
	width:500,
	height:200,
    layer:1
});

sim.define({
	name:"floor2",
	parent:"block1a",
	width:300,
	height:300,
    layer:1
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
	height:325,
    layer:1
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
	height:325,
    layer:1
});



sim.define({
	name:"floor5",
	parent:"floor1",
	width:300,
	height:150,
    layer:1
});


sim.define({
    name:"cliff",
    type:"static",
    shape:"line",
	mass:Infinity,
    elastic:0,
	friction:1,
    layer:1,
    verts:[
        125,-38,
        107,-55,
        103,-104,
        90,-131,
        77,-141,
        54,-152,
        43,-162,
        27,-174,
        21,-214,
        10,-230,
        3,-236,
        -20,-240,
        -48,-240,
        -92,-269,
        -99,-286,
        -118,-296,
        -125,-304
    ]
})

sim.define({
    name:"cliff2",
	parent:"cliff"
})


sim.define({
    name:"snow4",
    type:"static",
    shape:"line",
	mass:Infinity,
    elastic:0,
	friction:1,
    layer:1,
    verts: [
        -250,0,
        -214,2,
        -158,9,
        -113,5,
        
        168,-91,
        200,-106,
        250,-145,
    ]

})


sim.define({
    name:"snow5",
    type:"static",
    shape:"line",
	mass:Infinity,
    elastic:0,
	friction:1,
    layer:1,
    verts: [
        -250,-145,
        -200,-106,
        -168,-91,
        113,5,
        158,9,
        214,2,
        250,0
    ]

})


sim.define({
    name: "snow6",
    parent:"snow5",
    verts: [
        -250,-29,
        -39,-30,
        -1,-38,
        21,-67,
        48,-80,
        166,-112,
        184,-112,
        207,-132,
        241,-145,
        249,-145
    ]
})

sim.define({
    name:"snow10",
    parent:"snow5",
    verts: [
        -110,-248,
        -90,-239,
        -63,-211,
        -29,-159,

        -12,-137,
        44,-90,
        74,-68,
        115,-60
    ]
})

sim.define({
    name:'boulder',
	type:"active",
	shape:"polygon",
    mass:7,
    elastic:0,
    friction:.85,
    layer:2,
    verts:
        [128,-36,
        -137,-31,
        -154,-9,
        -146,19,
        -110,32,
        146,28,
        163,-1,
        164,-19,
        144,-34
        ]
})


sim.define({
	name:"wall1",
	shape:"rect",
	type:"passive",
	width:200,
	height:200,
    layer:0
});


sim.define({
	name:"wall2",
	shape:"rect",
	type:"passive",
	width:200,
	height:200,
    layer:0
});


}

export default defineAll