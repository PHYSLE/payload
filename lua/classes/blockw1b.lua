class("blockw1b",{
	char="real",
	shape="rect",
	width=230,
	height=100,
	mass=49999,
	inertia=49999,
	elastic=0,
	friction=1,
	onput=[[this:setstate("n", 0)]],
	oncontact=[[
		local o=get(data[1])
		local n=tonumber(this:getstate("n"))

		if o.class == "tire" and n == 0 then
			local x,y=this:getxy()
			this:setmax(0,200,0)
			this:movesto(x, y-900, 50)
			this:setstate("n",1)
			local s="local x,y=this:getxy(); this:stop(); this:setxy(x,y); this:setmax(0, 0, 0);"
			hook(this.id, MSG_ARRIVE, this.id, 0, s)
		end
	]],
	images={
		[0]={path="images/blockW1b.png"}
	}
	
})