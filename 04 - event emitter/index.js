const logEvents = require('./logEvents');

// event driven programming is done by EventEmitter class in node js
// with this we create our own events and listen to them
const EventEmitter = require('events') ;

//from DOCS
class EmitterClass extends EventEmitter{};
const objEmitter = new EmitterClass();

// log is our custom made event, when it happens it will invoke the logEvents method with msg that will be passed to it at the time of this event happening
objEmitter.on('log', (msg, msg2)=>logEvents(msg, msg2));

// this triggers/starts that event 'log'. this line means the 'log' event has happened
objEmitter.emit('log', 'Log Event Emitted', '2nd parameter')