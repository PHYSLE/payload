---------- A level editor for PHYSLE

imagedir="images/"
space.pause()

level={
	path="",
	actions={}
}

function level:open()

	self.path=gui.path("Open","/scripts/")
	if self.path then
		space.reset()
		gui.reset()
		load(self.path)
		include("leveledit.lua")
	end
end

function level:write(path)
	local a={}
	local i=0
	local f=io.open(path, "w+")
	
	a=classes()
	f:write("local cdir='classes/'\n\n")
	for i=0, #(a) do
		f:write("include(cdir..'"..a[i]..".lua')\n")
	end
	f:write("\n")
		
	a=all()
	for i=0, #(a) do
		local o=get(a[i])
		local x,y=o:getxy()
		f:write("put('"..o.class.."',"..x..","..y..")\n")
	end
	f:write("\n")
	f:close()
end

function level:save()
	if self.path == "" then
		self:saveas()
	else
		self:write(self.path)
	end
end

function level:saveas()
	self.path=gui.path("Save As","/scripts/")
	if self.path ~= "" then
		self:write(self.path)
	end
end


function level:start()
	if space.paused() then 
		space.pause()
	end
end

function level:stop()
	if not space.paused() then 
		space.pause()
	end
end

function level:undo()
	local n=table.maxn (self.actions)
	if n>0 then
		local a=self.actions[n]
		if a.act == "add" then
			local target=get(a.id)
			if type(target) == "table" then
				target:free()
			end
		elseif a.act == "rem" then
			local newid=put(a.cls, a.x, a.y)
			local o=get(newid)
			o:__id(a.id) -- set the id back to what it was before
		elseif a.act == "move" then
			local target=get(a.id)
			target:setxy(a.x,a.y)	
		end
		table.remove(self.actions, n)
	end
end



view={}
function view:toggle(option)
	local s,i,g,f=space.getview()
	if option == 'i' then
		if s == 0 then
			space.setview(1,-1,-1,-1)
		else
			space.setview(0,-1,-1,-1)
		end
	elseif option == 's' then
		if i== 0 then
			space.setview(-1,1,-1,-1)
		else
			space.setview(-1,0,-1,-1)
		end
	elseif option == 'g' then
		if g == 0 then
			space.setview(-1,-1,1,-1)
		else
			space.setview(-1,-1,0,-1)
		end
	elseif option == 'f' then
		if f == 0 then
			space.setview(-1,-1,-1,1)
		else
			space.setview(-1,-1,-1,0)
		end
	elseif option == 'b' then
		local r,g,b=space.getbgcolor()

		if b == 0 then
			space.setbgcolor(0, 0, 255)
		else
			space.setbgcolor(0, 0, 0)
		end
	end
end

function view:move(x1,y1)
	if space.paused() then 
		local x2,y2=getpan() 
		pan(x1+x2,y1+y2) 
	end
end


pallet={
	moving=0,
	brushes={},
	brush=""
}

function pallet:select(icon) 
	local toolx=-10
	local tooly=-40
	if icon ~= "undo" then self.brush=icon end
	if icon == "delete" then
		gui.setmouse(imagedir.."delete.png", .5,toolx,tooly)
	elseif icon == "view" then
		gui.setmouse(imagedir.."find.png", .5,toolx,tooly)
	elseif icon == "move" then
		gui.setmouse(imagedir.."fix.png", .5,toolx,tooly)
	elseif icon == "bury" then
		gui.setmouse(imagedir.."down.png", .5,toolx,tooly)
	else
		local d=classdata(icon)
		gui.setmouse(d.images[0].path, .5, d.images[0].off_x, d.images[0].off_y)
	end
end

function pallet:draw(x,y) 
	if self.brush == "view" then
		pan(x-(SCREEN_WIDTH/2), y-(SCREEN_HEIGHT/2))
	elseif self.brush ~= "move" and self.brush ~= "delete" then
		local add = put(self.brush,x,y) 
		table.insert(level.actions, {act="add",id=add})
	end
end

function pallet:move(x,y)
	if self.moving > 0 then
		local target=get(self.moving)
		local _x,_y=target:getxy()
		table.insert(level.actions, {act="move",id=self.moving,x=_x,y=_y})
		target:setxy(x,y)
		self.moving = 0
		gui.setmouse(imagedir.."fix.png", .5,toolx,tooly)
	end
end

function pallet:click()
	if self.brush == "delete" then
		local target=get(data)
		local _x,_y=target:getxy()
		target:free()
		table.insert(level.actions, {act="rem",cls=target.class,id=data,x=_x,y=_y})
	elseif self.brush == "move" then
		local target=get(data)
		local d=classdata(target.class)
		self.moving=data
		gui.setmouse(d.images[0].path, .5, d.images[0].off_x, d.images[0].off_y)
	elseif self.brush == "bury" then
		local target=get(data)
		local _x,_y=target:getxy()
		put(target.class,_x,_y,1)
		target:free()
		--table.insert(level.actions, {act="bur",cls=target.class,id=data,x=_x,y=_y})
	end
end

function pallet:make()
	local d=dir("classes")
	for i=0,#(d) do
		if  string.find(d[i], ".lua") then
			include("classes/"..d[i])
		end
	end

	local a=classes()
	local h
	
	if #(a) > 0 then 
		h=math.floor((#(a)/4)+1)*25  +  42
	else
		h=42
	end

	local framestyle={
		width=102,
		height=h,
		border=1,
		alpha=.8,
		title=1,
		drags=1
	} 
	self.frame=gui.frame("pallet",5,100,framestyle)

	iconstyle={
		text="", 
		parent=self.frame, 
		width=25, 
		height=25
	}
	
	iconstyle.text="delete"
	pallet.brushes.delete = gui.icon(imagedir.."delete.png",1,16,"pallet:select('delete')",iconstyle)
	
	iconstyle.text="bury"
	pallet.brushes.move = gui.icon(imagedir.."down.png",26,16,"pallet:select('bury')",iconstyle)
	
	iconstyle.text="view"
	pallet.brushes.move = gui.icon(imagedir.."find.png",51,16,"pallet:select('view')",iconstyle)
	
	iconstyle.text="move"
	pallet.brushes.move = gui.icon(imagedir.."fix.png",76,16,"pallet:select('move')",iconstyle)
	
	for i=0, #(a) do
		d=classdata(a[i])
		if d and type(d.images) == "table" and type(d.images[0]) == "table" then
			img=d.images[0].path
			
			
			x=math.floor(i % 4) * 25 + 1 
			y=math.floor(i / 4) * 25 + 16 +25 ----100
			iconstyle.text=d.name
			pallet.brushes[a[i]] = gui.icon(img,x,y,"pallet:select('"..a[i].."')",iconstyle)
		end
	end
end







pallet:make()

fmenu=gui.menu("File",{
	[0]={text="open", script="level:open()"},
	[1]={text="save", script="level:save()"},
	[2]={text="save as..", script="level:saveas()"},
	[3]={text="start", script="level:start()"},
	[4]={text="stop", script="level:stop()"}
})
emenu=gui.menu("Edit",{
	[0]={text="undo", script="level:undo()"},
	[1]={text="delete", script="pallet:select('delete')"},
	[2]={text="bury", script="pallet:select('bury')"},
	[3]={text="move", script="pallet:select('move')"}
})
vmenu=gui.menu("View",{
	[0]={text="images", script="view:toggle('i')"},
	[1]={text="shapes", script="view:toggle('s')"},
	[2]={text="grid", script="view:toggle('g')"},
	[3]={text="bgcolor", script="view:toggle('b')"},
	[4]={text="fps", script="view:toggle('f')"}
})

hook(0, MSG_MOUSEDN, 0 , 0 , "pallet:draw(data.x,data.y)")
hook(0, MSG_MOUSEUP, 0 , 0 , "pallet:move(data.x,data.y)")
hook(0, MSG_CLICKED, 0 , 0 , "pallet:click()")

hook(0, MSG_KEYDN, 0, KEY_DOWN,  "view:move(0,100)")
hook(0, MSG_KEYDN, 0, KEY_UP, "view:move(0,-100)")
hook(0, MSG_KEYDN, 0, KEY_RIGHT, "view:move(100,0)")
hook(0, MSG_KEYDN, 0, KEY_LEFT, "view:move(-100,0)")

--hook(0, MSG_COMMAND, 0, KEY_DOWN,  "view:move(0,500)")
--hook(0, MSG_COMMAND, 0, KEY_UP, "view:move(0,-500)")
--hook(0, MSG_COMMAND, 0, KEY_RIGHT, "view:move(800,0)")
--hook(0, MSG_COMMAND, 0, KEY_LEFT, "view:move(-800,0)")

hook(0, MSG_COMMAND, 0, KEY_O, "level:open()")
hook(0, MSG_COMMAND, 0, KEY_S, "level:save()")
hook(0, MSG_COMMAND, 0, KEY_Z, "level:undo()")
hook(0, MSG_COMMAND, 0, KEY_B, "view:toggle('b')")
hook(0, MSG_COMMAND, 0, KEY_G, "view:toggle('g')")
hook(0, MSG_COMMAND, 0, KEY_H, "view:toggle('s')")
