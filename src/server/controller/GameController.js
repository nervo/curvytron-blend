/**
 * Game Controller
 */
function GameController()
{
    var controller = this;

    this.game    = new Game();
    this.clients = new Collection();
    this.ticker  = new Ticker(this.game);

    this.callbacks = {
        onLeave: function () { controller.onLeave(this); },
        onJoin: function () { controller.onJoin(this); },
        onReady: function (data) { if (typeof(data) === 'object' && data.length === 2) { controller.onReady(this, data[1]); }},
        onColor: function (data) { if (typeof(data) === 'object' && data.length === 2) { controller.onColor(this, data[1]); }},
        onName: function (data) { if (typeof(data) === 'object' && data.length === 2) { controller.onName(this, data[0], data[1]); }},
        onMove: function (data) { if (typeof(data) === 'number') { controller.onMove(this, data); }}
    };

    this.start();
}

/**
 * Remove game
 *
 * @param {Game} game
 */
GameController.prototype.unloadGame = function()
{
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
 * Attach avatar events
 *
 * @param {Avatar} avatar
 */
GameController.prototype.attachAvatarEvents = function(avatar)
{
    avatar.on('die', this.onDie);
    avatar.on('spawn', this.onSpawn);
    avatar.on('position', this.onPosition);
    avatar.on('point:important', this.onPoint);
    avatar.on('property', this.onProperty);
    avatar.bonusStack.on('change', this.onBonusStack);
};

/**
 * Detach avatar events
 *
 * @param {Avatar} avatar
 */
GameController.prototype.detachAvatarEvents = function(avatar)
{
    avatar.removeListener('die', this.onDie);
    avatar.removeListener('spawn', this.onSpawn);
    avatar.removeListener('position', this.onPosition);
    avatar.removeListener('point:important', this.onPoint);
    avatar.removeListener('property', this.onProperty);
    avatar.bonusStack.removeListener('change', this.onBonusStack);
};

/**
 * Sum up situation
 *
 * @param {Client} client
 */
GameController.prototype.sumUp = function(client)
{
    var properties = {
            angle: 'angle',
            radius: 'radius',
            color: 'color',
            printing: 'printing'
        },
        events = [];

    for (var avatar, i = this.game.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.game.avatars.items[i];

        events.push(['avatar:add', [avatar.id, avatar.name, avatar.color]]);
        events.push(['spawn', avatar.id]);
        events.push(['position', [avatar.id, this.compressor.compress(avatar.x), this.compressor.compress(avatar.y)]]);

        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                events.push(['property', {avatar: avatar.id, property: property, value: avatar[properties[property]]}]);
            }
        }
    }

    for (var bonus, j = this.game.bonusManager.bonuses.items.length - 1; j >= 0; j--) {
        bonus = this.game.bonusManager.bonuses.items[j];
        events.push(['bonus:pop', [bonus.id, this.compressor.compress(bonus.x), this.compressor.compress(bonus.y), bonus.constructor.name]]);
    }

    for (var point, k = this.game.world.bodies.items.length - 1; k >= 0; k--) {
        body = this.game.world.bodies.items[k];

        events.push(['point', [
            this.compressor.compress(body.x),
            this.compressor.compress(body.y),
            this.compressor.compress(body.radius),
            body.color,
            body.data
        ]]);
    }

    if (this.game.borderless) {
        events.push(['borderless', true]);
    }

    client.addEvents(events);
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
 */
GameController.prototype.onReady = function(client, callback)
{
    callback([client.player.name, client.player.color]);
    this.sumUp(client);
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
 * @param {String} data
 * @param {Function} callback
 */
GameController.prototype.onName = function(client, data, callback)
{
    if (this.isNameAvailable(data)) {
        client.player.setName(data);
    }

    callback(client.player.name);
};

/**
 * On move
 *
 * @param {SocketClient} client
 * @param {Number} move
 */
GameController.prototype.onMove = function(client, data)
{
    if (client.player.avatar) {
        client.player.avatar.updateAngularVelocity(data);
    }
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onPoint = function(data)
{
    this.socketGroup.addEvent('avatar:point', data.id);
};

/**
 * On position
 *
 * @param {Avatar} avatar
 */
GameController.prototype.onPosition = function(avatar)
{
    this.socketGroup.addEvent('position', [
        avatar.id,
        this.compressor.compress(avatar.x),
        this.compressor.compress(avatar.y)
    ]);
};

/**
 * On spawn
 *
 * @param {Avatar} avatar
 */
GameController.prototype.onSpawn = function(avatar)
{
    this.socketGroup.addEvent('spawn', avatar.id);
};

/**
 * On die
 *
 * @param {Object} data
 */
GameController.prototype.onDie = function(data)
{
    this.socketGroup.addEvent('die', [
        data.avatar.id,
        this.compressor.compress(data.avatar.angle)
    ]);
};

/**
 * On bonus pop
 *
 * @param {Bonus} bonus
 */
GameController.prototype.onBonusPop = function(bonus)
{
    this.socketGroup.addEvent('bonus:pop', [
        bonus.id,
        this.compressor.compress(bonus.x),
        this.compressor.compress(bonus.y),
        bonus.constructor.name
    ]);
};

/**
 * On bonus clear
 *
 * @param {Bonus} bonus
 */
GameController.prototype.onBonusClear = function(bonus)
{
    this.socketGroup.addEvent('bonus:clear', bonus.id);
};

/**
 * On property
 *
 * @param {Object} data
 */
GameController.prototype.onProperty = function(data)
{
    this.socketGroup.addEvent('property', [
        data.avatar.id,
        data.property,
        data.value
    ]);
};

/**
 * On bonus stack add
 *
 * @param {Object} data
 */
GameController.prototype.onBonusStack = function(data)
{
    data.avatar.player.client.addEvent('bonus:stack', [
        data.avatar.id,
        data.method,
        data.bonus.id,
        data.bonus.constructor.name,
        data.bonus.duration
    ]);
};

/**
 * On game start
 *
 * @param {Object} data
 */
GameController.prototype.onGameStart = function(data)
{
    this.socketGroup.addEvent('game:start');
};

/**
 * On game stop
 *
 * @param {Object} data
 */
GameController.prototype.onGameStop = function(data)
{
    this.socketGroup.addEvent('game:stop');
};

/**
 * On clear
 *
 * @param {Object} data
 */
GameController.prototype.onClear = function(data)
{
    this.socketGroup.addEvent('clear');
};

/**
 * On borderless
 *
 * @param {Object} data
 */
GameController.prototype.onBorderless = function(data)
{
    this.socketGroup.addEvent('borderless', data);
};

/**
 * On end
 *
 * @param {Object} data
 */
GameController.prototype.onEnd = function(data)
{
    this.socketGroup.addEvent('end');
    this.unloadGame();
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
