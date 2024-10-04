const EventEmitter = require('events');

class CustomEmitter extends EventEmitter {}

// Create an instance of EventEmitter
const eventEmitter = new CustomEmitter();

module.exports = eventEmitter;
