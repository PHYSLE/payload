---------------- global vars -------------

title = "Payload"
level = 1
goal = 0		--id of goal object
time = 0		--level time
total = 0		--total time
maxtime = 60
timing = true
done = false
kleft = false	--true when arrow left is down
kright = false	--true when arrow right is down
warningtime = 10


---------------- global functions -------------

function timetostring(t)
	if t <= 0 then return "00" end
	local m=math.abs(math.floor(t / 60))
	local s=math.abs(math.floor(t % 60))
	local r=tostring(s)
	if s < 10 then
		r="0"..r
	end
	if (m > 0) then 
		r=tostring(m).."."..r end
	return r
end
function tick()
	if timing then 
		time=time+1
		total=total+1
		dspTotal:settext(timetostring(total)) 
		dspTime:settext(timetostring(maxtime-time)) 
		if time > maxtime then buggy:explode() end
		if time > maxtime-warningtime then 
			 play("sounds/alert1.ogg")
			warningtime=-maxtime
		end
	end
end

function restart()
	space.reset()
	if type(menu) ==  "table" then
		hook(0, MSG_KEYDN, 0, KEY_ESCAPE, "menu:play()")
	end
	buggy.tiredown1=false
	buggy.tiredown2=false
	doLevel(level)
	done=false
	time=0
	warningtime=10
	timing=true
end

function winLevel()
	play("sounds/door.ogg")
	dspWin:setvisible(1)
	done=true
	level=level+1
	timing=false
	delay(3000,[[done=false; dspWin:setvisible(0); restart()]])
end

function getClasses()
	local cdir='classes/'
	
	include(cdir..'block1.lua')
	include(cdir..'block1b.lua')
	include(cdir..'block2.lua')
	include(cdir..'block2b.lua')
	include(cdir..'block3.lua')
	include(cdir..'block3b.lua')
	include(cdir..'block4.lua')
	include(cdir..'block4b.lua')
	include(cdir..'block5.lua')
	include(cdir..'block5b.lua')
	include(cdir..'block6.lua')
	include(cdir..'block6b.lua')
	include(cdir..'block_w.lua')
	include(cdir..'block_wb.lua')
	include(cdir..'blocks.lua')
	include(cdir..'blocksb.lua')
	include(cdir..'blockw.lua')
	include(cdir..'blockw1.lua')
	include(cdir..'blockw1b.lua')
	include(cdir..'blockw_.lua')
	include(cdir..'blockw_b.lua')
	include(cdir..'blockwb.lua')
	include(cdir..'blockxs.lua')
	include(cdir..'blockxsb.lua')
	include(cdir..'blockxw.lua')
	include(cdir..'boulder.lua')
	include(cdir..'chasis.lua')
	include(cdir..'cliff.lua')
	include(cdir..'cliff2.lua')
	include(cdir..'debris.lua')
	include(cdir..'depot.lua')
	include(cdir..'floor1.lua')
	include(cdir..'floor2.lua')
	include(cdir..'floor3.lua')
	include(cdir..'floor4.lua')
	include(cdir..'floor5.lua')
	include(cdir..'goal.lua')
	include(cdir..'nuke.lua')
	include(cdir..'snow10.lua')
	include(cdir..'snow5.lua')
	include(cdir..'snow6.lua')
	include(cdir..'tire.lua')
	include(cdir..'wall1.lua')
end


function makeDebris()
	if (level == 9) and (done == false) then
		local o = get(buggy.chasis)
		local x,y = o:getxy()
		local _x = x + 200 + rand(300)
		local d = get(put("debris", _x, y-300))
		d:seta(rand(360))
		d:turn(rand(20)-10)
		d:move(rand(360), 200)
		delay(4000, "makeDebris()")
	end
end

function doLevel(L)
	time=0
	warningtime=10
	level=L
	if space.count() > 0 then 
		space.reset()
		done=false 
		timing=true
	end
	getClasses()
	include(tostring(L)..".level")
	if L == 1 then
		space.setbgimage("images/stars.png", .98)
		space.setsize(16000,1000)
		buggy:make(400,100)
	elseif L == 2 then
		space.setbgimage("images/stars2.png", .98)
		space.setsize(16000,1000)
		buggy:make(400,250)
	elseif L == 3 then
		space.setbgimage("images/sunset.png", .98)
		space.setsize(16000,800)
		buggy:make(400,250)
	elseif L == 4 then
		space.setsize(16000,2000)
		space.setbgimage("images/winter.png", .99)
		space.setbgcolor(30,45,55)	
		space.setbgeffects(EFX_SNOW)
		buggy:make(400,1250)
	elseif L == 5 then
		space.setbgimage("images/winter.png", .99)
		space.setbgcolor(30,45,55)	
		space.setbgeffects(EFX_SNOW)
		space.setsize(16000,3600)
		buggy:make(400,250)
	elseif L == 6 then
		space.setbgeffects(EFX_CLOUDS)
		space.setbgcolor(110,125,155)	
		space.setsize(16000,1850)
		buggy:make(400,1250)
	elseif L == 7 then
		space.setbgimage("images/clouds2.png", .90)
		space.setbgeffects(EFX_RAIN)
		space.setbgcolor(110,125,155)
		space.setsize(16000,2850)
		buggy:make(400,2250)
	elseif L == 8 then
		space.setbgeffects(0)
		space.setsize(16000,1500)
		buggy:make(400,1030)
		space.setbgimage("images/forest.png", .95)
		space.setbgeffects(0)		
		local a=all("boulder")
		local o=get(a[0])
		o:seta(270)
	elseif L == 9 then
		space.setsize(16000,2200)
		space.setbgimage("images/forest2.png", .99)
		space.setbgeffects(EFX_EMBERS)
		space.setbgcolor(45,10,0)
		buggy:make(1000,1250)
		delay(5000, "makeDebris()")
	elseif L == 10 then
		space.setbgeffects(0)
		space.setsize(16000,1500)
		buggy:make(400,200)
		space.setbgimage("images/wall1.png", 0)
		space.setbgeffects(0)
	elseif L > 10 then
		dspFinal:setvisible(1)
	end

	space.setgravity(125)
	space.setdamping(.666)


	local tb=all("depot")
	if type(tb) == "table" and #(tb) == 0 then
		depot=get(tb[0])
		if depot then
			--depot:totop() --would be nice
			local x,y=depot:getxy()
			depot:free()
			put("depot",x,y)
			include("classes/goal.lua")
			goal = put("goal",x,y)
		end
	end
end


---------------- gui elements -------------


dspTime = gui.text(timetostring(time),12+710,6,{font="led",size=60})
dspTotal = gui.text(timetostring(total),24,12,{font="led",size=16})
dspVersion = gui.text("v"..APP_VERSION,775,485,{font="verdana", size=9})

dspWin = gui.text("PAYLOAD SECURE",300,200,{font="led",size=28})
dspWin:setvisible(0)
dspFinal = gui.text("PAYLOAD DELIVERED!",200,200,{font="led",size=50})
dspFinal:setvisible(0)

include("menu.lua")


---------------- buggy object -------------

buggy = {}
buggy.speed=24

buggy.chasis=0
buggy.nuke=0
buggy.tire1=0
buggy.tire2=0
buggy.tiredown1=false
buggy.tiredown2=false


function buggy:make(x,y,z)
	play("sounds/alert2.ogg")
	self.nuke=put("nuke",x-20,y-32,z)
	self.chasis=put("chasis",x,y,z)
	self.tire1=put("tire",x-26,y+15,z)
	self.tire2=put("tire",x+24,y+15,z)
	
	joint(self.chasis,-26,16,self.tire1,0,0)
	joint(self.chasis,24,16,self.tire2,0,0)
	
	joint(self.chasis,-10,-32,self.nuke,0,0)
	
	spring(self.chasis,-26,-10,self.tire1,0,0,150,8,10,.5)
	spring(self.chasis,24,-10,self.tire2,0,0,150,8,10,.5)
	
	hook(self.nuke, MSG_LEAVE, self.nuke, 0, "buggy:explode()")
	
	hook(self.nuke, MSG_CONTACT, self.nuke, 0, "buggy:checknuke(data[1])")
	
	hook(self.tire1, MSG_RELEASE, self.tire1, 0, "buggy:release(1)")
	hook(self.tire1, MSG_CONTACT, self.tire1, 0, "buggy:contact(1,data[1])")
	hook(self.tire2, MSG_RELEASE, self.tire2, 0, "buggy:release(2)")
	hook(self.tire2, MSG_CONTACT, self.tire2, 0, "buggy:contact(2,data[1])")
	hook(0, MSG_KEYDN, 0, KEY_LEFT, "buggy:move(270)")
	hook(0, MSG_KEYUP, 0, KEY_LEFT, "buggy:drift()")
	hook(0, MSG_KEYDN, 0, KEY_RIGHT, "buggy:move(90)")
	hook(0, MSG_KEYUP, 0, KEY_RIGHT, "buggy:drift()")
	hook(0, MSG_KEYDN, 0, KEY_LEFT, "kleft=true")
	hook(0, MSG_KEYUP, 0, KEY_LEFT, "kleft=false")
	hook(0, MSG_KEYDN, 0, KEY_RIGHT, "kright=true ")
	hook(0, MSG_KEYUP, 0, KEY_RIGHT, "kright=false")
	hook(0, MSG_TICK, 0, 0, "tick()")

	focus(self.chasis)
end


function buggy:move(direction)
	if done then
		return false
	end
	if (buggy.tiredown1) or (buggy.tiredown2) then
		local o1=get(self.tire1)
		o1:moves(direction, self.speed)

		local o2=get(self.tire2)
		o2:moves(direction, self.speed)
	end
end

function buggy:drift()
	if done then
		return false
	end
	local o1=get(self.tire1)
	o1:moves(0, 0)

	local o2=get(self.tire2)
	o2:moves(0, 0)
end

function buggy:contact(tire,id)
	local o=get(id)
	if (o.char ~= 'static' and o.char ~= 'real') then
		return false 
	elseif (tire == 1) then
		--buggy:fliptire(buggy.tire1,2) --debug
		self.tiredown1 = true
	elseif (tire == 2) then
		--buggy:fliptire(buggy.tire2,2) --debug
		self.tiredown2 = true
	end
	
	if kleft then
		local o1=get(self.tire1)
		o1:moves(270, self.speed)

		local o2=get(self.tire2)
		o2:moves(270, self.speed)
	end

	if kright then
		local o1=get(self.tire1)
		o1:moves(90, self.speed)

		local o2=get(self.tire2)
		o2:moves(90, self.speed)
	end
end

function buggy:release(tire)
	if (tire == 1) then
		buggy.tiredown1=false 
		--buggy:fliptire(buggy.tire1,0) --debug
	elseif (tire == 2) then
		buggy.tiredown2=false 
		--buggy:fliptire(buggy.tire2,0) --debug
	else
		return false
	end
	this:moves(0,0) 
end

function buggy:checknuke(id)
	if (id == self.chasis) or (done) then
		--pick nose
	elseif (id == goal) then
		winLevel()
	else
		local o=get(id)
		if o.char ~= "scenery" then
			buggy:explode()
		end
	end
end

function buggy:explode()
	timing=false
	done=true
	o_ch=get(self.chasis)
	o_ch:free()
	play("sounds/explode1.ogg")
	local x,y

	o_t1=get(self.tire1)
	x,y=o_t1:getxy()
	temp=put("tire",x,y)
	o_t1:free()
	o_t1=get(temp)
	o_t1:setimage(1)
	o_t1:move(rand(360),320)
	
	o_t2=get(self.tire2)
	x,y=o_t2:getxy()
	temp=put("tire",x,y)
	o_t2:free()
	o_t2=get(temp)
	o_t2:setimage(1)
	o_t2:move(rand(360),320)
	nkk=get(self.nuke)
	delay(2000,[[
		nkk=get(buggy.nuke)
		nkk:free()
		x,y=nkk:getxy()
		o_nk=get(put('nuke',x,y))
		o_nk:setimage(1)
		delay(1900, 'o_nk:free(); o_t1:free() o_t2:free()')
		play("sounds/explode2.ogg")
	]])
	x,y=nkk:getxy()
	pan(x-400,y-320)

	delay(4000,"restart()")
end


function buggy:fliptire(id,state)
	local o=get(id)	
	o:setimage(state)
end

---------------- audio -------------


local d="sounds/"
sound(d.."explode1.ogg")
sound(d.."explode2.ogg")
sound(d.."door.ogg")
sound(d.."alert1.ogg")
sound(d.."alert2.ogg")
mixer({
	[0]={path=d.."kick.ogg"},
	[1]={path=d.."snare.ogg"},
	[2]={path=d.."hat.ogg"},
	[3]={path=d.."keys.ogg"},
	[4]={path=d.."swell.ogg", char=PLAY_RANDOM},
	[5]={path=d.."efx.ogg", char=PLAY_RANDOM}
})

pausemix();




doLevel(level)
