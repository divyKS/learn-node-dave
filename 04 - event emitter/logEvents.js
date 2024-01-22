const { format } = require('date-fns');
const { v4: uuid } = require('uuid'); // sepecific verison 4 of that, if we just do uuid, then at time of using it we will have to uuid.v4() ... and it is being used as an alias, v4 has alias uuid

const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');

const logEvents = async (message, msg2) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logItem = '\n' + dateTime + '\t' + uuid() + '\t' + message + msg2;
    console.log(logItem);
    try {
        
        // the appenFile doesn't create directories
        if(!fs.existsSync('./logs')){
            await fsPromise.mkdir('./logs');
        }

        await fsPromise.appendFile(path.join(__dirname, 'logs', 'eventLog.txt'), logItem);

    } catch (err) {
        console.error(err);
    }
}

// const apple = () => {}
// module.exports = {logEvents, apple} ; // if two or more functions have to be exporeted then we export and object. The different functions can be used by the dot notation

module.exports = logEvents;