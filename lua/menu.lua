menu={}
menu.style={
	width=180,
	height=240,
	border=1,
	alpha=.8
} 
menu.frame=gui.frame("",(SCREEN_WIDTH-menu.style.width)/2,100,menu.style)
menu.button_style={
	width=100,
	height=15,
	parent=menu.frame
}
menu.title = gui.image("images/payload_s.png", 31, 24, {parent=menu.frame})
menu.play_button=gui.button("Play Game", 40, 100, "menu:play()", menu.button_style)
menu.new_button=gui.button("New Game", 40, 130, "load('scripts/default.lua') space.pause() menu:play()", menu.button_style)
menu.music_button=gui.button("Toggle Music", 40, 160, "menu:music()", menu.button_style)
menu.quit_button=gui.button("Quit Game", 40, 190, "exit()", menu.button_style)
function menu:play() 
	if space.paused() then
		space.pause()
		menu.frame:setvisible(0)
		dspVersion:setvisible(0)
	else
		space.pause()
		menu.frame:setvisible(1)
		dspVersion:setvisible(1)
	end
end
menu.playing=true
function menu:music()
	if menu.playing then
		pausemix()
		menu.playing=false
	else
		playmix()
		menu.playing=true
	end
end

hook(0, MSG_KEYDN, 0, KEY_ESCAPE, "menu:play()")
space.pause()