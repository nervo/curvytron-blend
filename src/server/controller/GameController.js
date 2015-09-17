/**
 * Game Controller
 */
function GameController()
{
    var controller = this;

    this.game    = new Game();
    this.clients = new Collection();
    this.ticker  = new Ticker(this.game, this.clients);
    this.monitor = new Monitor();

    this.unloadGame = this.unloadGame.bind(this);
    this.onFPS      = this.onFPS.bind(this);

    this.callbacks = {
        onLeave: function () { controller.onLeave(this); },
        onJoin: function () { controller.onJoin(this); },
        onReady: function (data) {
            if (typeof(data) === 'object' && typeof(data.callback) === 'function') {
                controller.onReady(this, data.callback);
            }
        },
        onColor: function (data) {
            if (typeof(data) === 'object' && typeof(data.callback) === 'function') {
                controller.onColor(this, data.callback);
            }
        },
        onName: function (data) {
            if (typeof(data) === 'object' && typeof(data.data) === 'string' && typeof(data.callback) === 'function') {
                controller.onName(this, data.data, data.callback);
            }
        },
        onMove: function (data) {
            if (typeof(data) === 'number') {
                controller.onMove(this, data);
            }
        }
    };

    this.game.fps.on('fps', this.onFPS);
    this.ticker.fps.on('fps', this.onFPS);

    this.game.addListener('end', this.unloadGame);
    this.game.start();
}

/**
 * Remove game
 *
 * @param {Game} game
 */
GameController.prototype.unloadGame = function()
{
    this.game.removeListener('end', this.unloadGame);
    this.game.stop();

    for (var i = this.clients.items.length - 1; i >= 0; i--) {
        this.detach(this.clients.items[i]);
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attach = function(client)
{
    if (this.clients.add(client)) {
        client.getPlayer();
        this.attachEvents(client);
        client.pingLogger.start();
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detach = function(client)
{
    if (this.clients.remove(client)) {
        this.detachEvents(client);

        if (client.player.avatar) {
            this.game.removeAvatar(client.player.avatar);
        }

        client.pingLogger.stop();
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attachEvents = function(client)
{
    client.on('close', this.callbacks.onLeave);
    client.on('ready', this.callbacks.onReady);
    client.on('color', this.callbacks.onColor);
    client.on('name', this.callbacks.onName);
    client.on('join', this.callbacks.onJoin);
    client.on('move', this.callbacks.onMove);
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detachEvents = function(client)
{
    client.removeListener('close', this.callbacks.onLeave);
    client.removeListener('ready', this.callbacks.onReady);
    client.removeListener('color', this.callbacks.onColor);
    client.removeListener('name', this.callbacks.onName);
    client.removeListener('join', this.callbacks.onJoin);
    client.removeListener('move', this.callbacks.onMove);
};

/**
 * On client leave
 *
 * @param {SocketClient} client
 */
GameController.prototype.onLeave = function(client)
{
    this.detach(client);
};

/**
 * On client ready
 *
 * @param {SocketClient} client
 * @param {Function} callback
 */
GameController.prototype.onReady = function(client, callback)
{
    callback({name: client.player.name, color: client.player.color});
    this.ticker.sumUp(client);
};

/**
 * On join
 *
 * @param {SocketClient} client
 */
GameController.prototype.onJoin = function(client)
{
    if (!client.player.avatar) {
        this.game.addAvatar(client.player.getAvatar());
    }
};

/**
 * On color
 *
 * @param {SocketClient} client
 * @param {Function} callback
 */
GameController.prototype.onColor = function(client, callback)
{
    client.player.setColor();
    callback(client.player.color);
};

/**
 * On name
 *
 * @param {SocketClient} client
 * @param {String} name
 * @param {Function} callback
 */
GameController.prototype.onName = function(client, name, callback)
{
    if (this.isNameAvailable(name)) {
        client.player.setName(name);
    }

    callback(client.player.name);
};

/**
 * On move
 *
 * @param {SocketClient} client
 * @param {Number} move
 */
GameController.prototype.onMove = function(client, move)
{
    if (client.player.avatar) {
        client.player.avatar.updateAngularVelocity(move);
    }
};

/**
 * Is name available
 *
 * @param {String} name
 *
 * @return {Boolean}
 */
GameController.prototype.isNameAvailable = function(name)
{
    return this.clients.match(function () {
        return this.player.name.toLowerCase() === name.toLowerCase();
    }) === null;
};

/**
 * On FPS
 */
GameController.prototype.onFPS = function()
{
    this.monitor.keys.tickrate  = this.ticker.fps.frequency;
    this.monitor.keys.framerate = this.game.fps.frequency;

    this.monitor.dump();
};
