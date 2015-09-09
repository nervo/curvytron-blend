/**
 * SocketClient
 */
function SocketClient()
{
    var Socket = window.MozWebSocket || window.WebSocket,
        socket = new Socket('ws://' + document.location.host + document.location.pathname, ['websocket']);

    this.connected = false;

    this.onError = this.onError.bind(this);
    this.onOpen  = this.onOpen.bind(this);

    BaseSocketClient.call(this, socket, new BinaryEncoder());

    this.socket.addEventListener('open', this.onOpen);
    this.socket.addEventListener('error', this.onError);
    this.socket.addEventListener('close', this.onClose);
}

SocketClient.prototype = Object.create(BaseSocketClient.prototype);
SocketClient.prototype.constructor = SocketClient;

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
SocketClient.prototype.onOpen = function(e)
{
    console.info('Connected.');
    this.connected = true;
    this.emit('connected');
};

/**
 * On open
 *
 * @param {Event} e
 */
SocketClient.prototype.onClose = function(e)
{
    console.info('Disconnected.');
    this.connected = false;
    this.emit('disconnected');
};

/**
 * On error
 *
 * @param {Event} e
 */
SocketClient.prototype.onError = function (e)
{
    console.error(e);

    if (!this.connected) {
        this.onClose();
    }
};
