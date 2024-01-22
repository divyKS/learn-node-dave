const fs = require('fs')

const rs = fs.createReadStream('./files/subtitles.txt', {encoding: 'utf8'})

const ws = fs.createWriteStream('/Users/yksis/Desktop/newSubtitles.txt')

rs.on('data', (readData) => {
    const lines = readData.split('\n') // lines would become an array
    lines.forEach((line)=>{
        line = line.trim();
        ws.write(' '+line)
    })
})

