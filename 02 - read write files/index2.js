const fsPromise = require('fs').promises
const path = require('path')

const fileOperations = async () => {
    try{
        // now we dont need the err/data there in callback
        const data = await fsPromise.readFile(path.join(__dirname, 'files',  'starter.txt'), 'utf8')
        // await fsPromise.unlink(path.join(__dirname, 'files',  'starter.txt')) would delete that file
        await fsPromise.writeFile(path.join(__dirname, 'files',  'newFile.txt'), data)
        await fsPromise.appendFile(path.join(__dirname, 'files',  'newFile.txt'), '\nChocolate is dark, night is stars.')
        await fsPromise.rename(path.join(__dirname, 'files',  'newFile.txt'), path.join(__dirname, 'files',  'newFileCompleted.txt'))

    } catch (err){
        console.log(err)
    }
} 

fileOperations()