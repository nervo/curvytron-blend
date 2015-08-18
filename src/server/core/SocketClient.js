/**
 * Socket Client
 *
 * @param {Socket} socket
 * @param {Number} interval
 * @param {String} ip
 */
function SocketClient(socket, interval, ip)
{
    BaseSocketClient.call(this, socket, interval);

    this.ip         = ip;
    this.id         = null;
    this.player     = new Player(this);
    this.pingLogger = new PingLogger(this.socket);

    this.identify  = this.identify.bind(this);
    this.onLatency = this.onLatency.bind(this);

    this.on('whoami', this.identify);
    this.pingLogger.on('latency', this.onLatency);
}

SocketClient.prototype = Object.create(BaseSocketClient.prototype);
SocketClient.prototype.constructor = SocketClient;

/**
 * Ping interval
 *
 * @type {Number}
 */
SocketClient.prototype.pingInterval = 1000;

/**
 * On ping logger latency value
 *
 * @param {Number} latency
 */
SocketClient.prototype.onLatency = function(latency)
{
    this.addEvent('latency', latency, null, true);
};

/**
 * Who am I?
 */
SocketClient.prototype.identify = function(event)
{
    event[1](this.id);
};

/**
 * Stop
 */
SocketClient.prototype.stop = function()
{
    BaseSocketClient.prototype.stop.call(this);
    this.pingLogger.stop();
};
