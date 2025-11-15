import {promises as fs} from 'fs';

const input = './lua/';
const output = './public/assets/levels/';
const levels = []

// this script 
// - converts the old lua scripts to json 
// - update names to match current definitions
// - sorts levels by x

function put(name, x, y) {
    levels[levels.length-1].push({name: name, x: x, y: y})
}

function rename(name) {
    if (name.slice(0,5) == 'block' && name.slice(-1) != 'b') {
        //console.log(name.slice(-1))
        return name + 'a';
    }
    return name;
}

for(let i=0; i<10; i++) {
    let path = input + (i + 1) + '.level';
    let file = await fs.readFile(path)
    levels.push([])
    eval(file.toString())
}

console.log(levels.length)

for(let i=0; i<10; i++) {
    let level = levels[i].sort((a, b) => {
        return a.x - b.x;
    })

    let path = output + 'level' + (i +1) + '.json';
    await fs.writeFile(path,'[')

    for(let line of level) {
        line.name = rename(line.name)
        let json = JSON.stringify(line) 
            json += (line == level[level.length-1]) ? ']':',\n';
        await fs.appendFile(path, json);
        //console.log(line.name, line.x, line.y)
    }
}