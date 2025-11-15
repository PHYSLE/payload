_wscript=[[
	local ww=200
	local x,y=this:getxy()
	local ix=tonumber(this:getstate("ix"))
	if x< ix-(ww/2) then
		this:movesto(ix,y,10)
	else
		this:movesto(ix-ww,y,10)
	end
]]

class("block_w",{
	char="real",
	shape="rect",
	width=230,
	height=100,
	max_x=20,
	mass=99999,
	inertia=99999,
	elastic=0,
	friction=1,
	onput=[[
		local x,y=this:getxy()
		hook(this.id, MSG_ARRIVE, this.id, 0, _wscript)
		this:setstate("ix", x)
		this:movesto(x-200,y,10)
	]],
	images={
		[0]={path="images/blockWa.png"}
	}
	
})