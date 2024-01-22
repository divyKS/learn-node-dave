const { format } = require('date-fns')
const { v4: uuid } = require('uuid') // sepecific verison 4 of that, if we just do uuid, then at time of using it we will have to uuid.v4() ...

console.log(format(new Date(), 'yyyy MM dd \t HH:mm:ss'))

console.log(uuid())