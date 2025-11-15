local o=10

class("chasis",{
	char="real",
	shape="poly",
	verts={[0]=-33,[1]=-10-o,[2]=-42,[3]=2-o,[4]=-42,[5]=7-o,[6]=38,[7]=7-o,[8]=43,[9]=1-o,[10]=27,[11]=-10-o},
	off_x=0,
	off_y=0,
	max_x=2000,
	max_y=2000,
	max_t=10,
	mass=40,
	inertia=800,
	elastic=0,
	friction=.7,
	images={
		[0]={
			path="images/chasis2.png",
			frames=1,
			off_x=0,
			off_y=o,
			efx_x=-50,
			efx_y=o,
			effects=EFX_ROLL
		}
	}
})