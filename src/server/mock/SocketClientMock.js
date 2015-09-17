/**
 * Mocked socket client
 */
function SocketClientMock(encoder, ip)
{
    SocketClient.call(this, new SocketMock(), encoder, ip);

    this.join = this.join.bind(this);

    setTimeout(this.join, (Math.random() * 3 + 2) * 1000);
}

SocketClientMock.prototype = Object.create(SocketClient.prototype);
SocketClientMock.prototype.constructor = SocketClientMock;

/**
 * Emit join
 */
SocketClientMock.prototype.join = function()
{
    this.emit('join');
};
