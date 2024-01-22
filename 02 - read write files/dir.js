const fs = require('fs')

if(!fs.existsSync('./newFolder')){
    fs.mkdir('./newFolder', (err) => {
        if(err) throw err
        console.log('new directory created')
    })
}

if(fs.existsSync('./newFolder')){
    fs.rmdir('./newFolder', (err) => {
        if(err) throw err
        console.log('new directory removed')
    })
}

if(fs.existsSync('./files/subtitles.txt')){
    fs.unlink('./files/subtitles.txt', (err) => {
        if(err) throw err
        console.log('subtitle file deleted')
    })
}
