/**
 * Mocked socket
 */
function SocketMock()
{
    this.events = {};
}

/**
 * Add event lsitener
 */
SocketMock.prototype.addEventListener = function(event, callback)
{
    this.events[event] = callback;
};

/**
 * Add event lsitener
 */
SocketMock.prototype.removeEventListener = function() {};

/**
 * Ping
 */
SocketMock.prototype.ping = function() {};

/**
 * Send
 */
SocketMock.prototype.send = function() {};
