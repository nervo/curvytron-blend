/**
 * Base Socket Client
 *
 * @param {Object} socket
 */
function BaseSocketClient(socket)
{
    EventEmitter.call(this);

    this.socket    = socket;
    this.encoder   = new BinaryEncoder();
    this.callbacks = {};
    this.connected = true;
    this.callCount = 0;

    this.socket.binaryType = 'arraybuffer';

    this.onMessage = this.onMessage.bind(this);
    this.onClose   = this.onClose.bind(this);

    this.attachEvents();
}

BaseSocketClient.prototype = Object.create(EventEmitter.prototype);
BaseSocketClient.prototype.constructor = BaseSocketClient;

/**
 * On socket close
 */
BaseSocketClient.prototype.onClose = function()
{
    this.connected = false;
    this.emit('close', this);
    this.detachEvents();
};

/**
 * Attach events
 */
BaseSocketClient.prototype.attachEvents = function()
{
    this.socket.addEventListener('message', this.onMessage);
    this.socket.addEventListener('close', this.onClose);
};

/**
 * Detach Events
 */
BaseSocketClient.prototype.detachEvents = function()
{
    this.socket.removeEventListener('message', this.onMessage);
    this.socket.removeEventListener('close', this.onClose);
};

/**
 * Add an event to the list
 *
 * @param {Object} event
 * @param {Function} callback
 */
BaseSocketClient.prototype.addEvent = function (event, callback)
{
    if (typeof(callback) === 'function') {
        event.callback = this.indexCallback(callback);
    }

    this.sendEvents([event]);
};

/**
 * Index a new callback
 *
 * @param {Function} callback
 *
 * @return {Number}
 */
BaseSocketClient.prototype.indexCallback = function(callback)
{
    var index = this.callCount++;

    this.callbacks[index] = callback;

    return index;
};

/**
 * Add a callback
 *
 * @param {Object} message
 * @param {Object} data
 */
BaseSocketClient.prototype.addCallback = function (message, data)
{
    var event = {name: message.name + ':callback', id: message.callback};

    if (typeof(data) !== 'undefined') {
        event.data = data;
    }

    this.sendEvents([event]);
};

/**
 * Send events
 *
 * @param {Array} events
 */
BaseSocketClient.prototype.sendEvents = function (events)
{
    this.sendBuffer(this.encoder.encode(events));
};

/**
 * Send buffer
 *
 * @param {Buffer} buffer
 */
BaseSocketClient.prototype.sendBuffer = function (buffer)
{
    this.socket.send(buffer);
};

/**
 * On message
 *
 * @param {Event} e
 */
BaseSocketClient.prototype.onMessage = function (e)
{
    var events = this.encoder.decode(e.data),
        length = events.length;

    for (var i = 0; i < length; i++) {
        this.processMessage(events[i]);
    }
};

/**
 * Process message
 *
 * @param {Object} message
 */
BaseSocketClient.prototype.processMessage = function(message)
{
    if (typeof(message.id) !== 'undefined') {
        return this.playCallback(message.id, message.data);
    }

    if (typeof(message.callback) !== 'undefined') {
        var detail = {callback: this.createCallback(message)};

        if (typeof(message.data) !== 'undefined') {
            detail.data = message.data;
        }

        this.emit(message.name, detail);
    } else {
        this.emit(message.name, message.data);
    }
};

/**
 * Play an indexed callback
 *
 * @param {Number} id
 * @param {Object|null} data
 */
BaseSocketClient.prototype.playCallback = function(id, data)
{
    if (typeof(this.callbacks[id]) !== 'undefined') {
        this.callbacks[id](data);
        delete this.callbacks[id];
    }
};

/**
 * Create callback
 *
 * @param {Object} message
 *
 * @return {Function}
 */
BaseSocketClient.prototype.createCallback = function(message)
{
    return function (data) { this.addCallback(message, data); }.bind(this);
};
