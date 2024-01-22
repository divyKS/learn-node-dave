// ./ is same directory
// ../ go outside the directory one level

const fs = require('fs')
const path = require('path')

// 'utf8' encoding to not get the buffer output
// instead of hardcoding the path: ./files/starter.txt

fs.readFile(path.join(__dirname, 'files', 'starter.txt'), (err, data) => {
    if(err) throw err;
    console.log(data)
    console.log(data.toString())
})

console.log("HI!....")

process.on('uncaughtException', err => {
    console.log(`This is your error ${err}`)
    process.exit(1)
})

fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 
                       'This is the message you want to write', err => {
    if(err) throw err
    console.log('Write Successful')
})

// if we want things to happen in order write them inside the callback
// but that is a callback hell, so we can use fsPromise
fs.appendFile(path.join(__dirname, 'files', 'test.txt'), '\nThis is the third appended message.', err => {
    if(err) throw err
    console.log('Append Successful')

    fs.rename(path.join(__dirname, 'files', 'test.txt'), path.join(__dirname, 'files', 'testRenamed.txt'), err => {
        if(err) throw err
        console.log('Rename Successful')
    })
})

