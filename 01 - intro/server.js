const os = require('os')
const path = require('path')
const math = require('./math')
const {add, sub, mul, div} = require('./math')

// but we don't need to call this as an object, we can destructure in the imports
console.log(math.add(10, 20))
console.log(add(10, 20))

console.log(os.type())
console.log(os.version())
console.log(os.homedir())

// we always have access to something in nodeJS, we don't have to import any module to get those

console.log(__dirname)
console.log(__filename)

console.log(path.dirname(__filename))
console.log(path.basename(__filename))
console.log(path.extname(__filename))

console.log(path.parse(__filename)) // gives an object with all parameters