import fs, {promises as fsp} from 'fs';

const dir = './public/assets/levels/';
const levels = []

// this script converts the old level scripts to json and sorts puts by x

function put(name, x, y) {
    levels[levels.length-1].push({name: name, x: x, y: y})
}

for(let i=0; i<10; i++) {
    let path = dir + (i + 1) + '.level';
    let file = await fsp.readFile(path)
    levels.push([])
    eval(file.toString())
}

console.log(levels.length)

for(let i=0; i<10; i++) {
    //console.log('-----------')
    let level = levels[i].sort((a, b) => {
        return a.x - b.x;
    })

    let path = dir + 'level' + (i +1) + '.json';
    await fsp.writeFile(path,'[')

    for(let line of level) {
        let json = JSON.stringify(line) 
            json += (line == level[level.length-1]) ? ']':',\n';
        await fsp.appendFile(path, json);
        //console.log(line.name, line.x, line.y)
    }

    // need line breaks
    //await fs.writeFile(dir + 'level' + (i +1) + '.json', JSON.stringify(level))
}