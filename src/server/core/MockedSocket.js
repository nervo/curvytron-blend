/**
 * Mocked socket
 */
function MockedSocket(timeToJoin)
{
    this.events = {};

    this.join = this.join.bind(this);

    setTimeout(this.join, (Math.random() * 3 + 2) * 1000);
}

/**
 * Add event lsitener
 */
MockedSocket.prototype.addEventListener = function(event, callback)
{
    this.events[event] = callback;
};

/**
 * Add event lsitener
 */
MockedSocket.prototype.removeEventListener = function() {};

/**
 * Ping
 */
MockedSocket.prototype.ping = function() {};

/**
 * Send
 */
MockedSocket.prototype.send = function() {};

/**
 * Emit join
 */
MockedSocket.prototype.join = function()
{
    this.emit('join', null, function () {});
};

/**
 * Simulate message
 *
 * @param {String} name
 * @param {Mixed} data
 */
MockedSocket.prototype.emit = function(name, data, callback)
{
    var event = [name];

    if (typeof(data) !== 'undefined') {
        event.push(data);
    }

    if (typeof(callback) !== 'undefined') {
        event.push(callback);
    }

    this.events.message({
        type: 'message',
        data: JSON.stringify([event])
    });
};
