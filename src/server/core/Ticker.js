/**
 * Ticker
 *
 * @param {Game} game
 * @param {Collection} clients
 */
function Ticker (game, clients)
{
    this.game        = game;
    this.clients     = clients;
    this.events      = [];
    this.namedEvents = [];
    this.compressor  = new Compressor();
    this.encoder     = new BinaryEncoder();

    this.onStart        = this.onStart.bind(this);
    this.onStop         = this.onStop.bind(this);
    this.onEnd          = this.onEnd.bind(this);
    this.onSpawn        = this.onSpawn.bind(this);
    this.onDie          = this.onDie.bind(this);
    this.onPosition     = this.onPosition.bind(this);
    this.onPoint        = this.onPoint.bind(this);
    this.onProperty     = this.onProperty.bind(this);
    this.onBonusStack   = this.onBonusStack.bind(this);
    this.onBonusPop     = this.onBonusPop.bind(this);
    this.onBonusClear   = this.onBonusClear.bind(this);
    this.onAvatarAdd    = this.onAvatarAdd.bind(this);
    this.onAvatarRemove = this.onAvatarRemove.bind(this);
    this.onClear        = this.onClear.bind(this);
    this.onBorderless   = this.onBorderless.bind(this);
    this.loop           = this.loop.bind(this);

    this.attachEvents();
    this.start();
}

/**
 * Tick frame rate
 *
 * @type {Number}
 */
Ticker.prototype.tickrate = 1/60 * 1000;

/**
 * Start loop
 */
Ticker.prototype.start = function()
{
    if (!this.frame) {
        this.loop();
    }
};

/**
 * Stop loop
 */
Ticker.prototype.stop = function()
{
    if (this.frame) {
        this.clearFrame();
    }
};

/**
 * Get new frame
 */
Ticker.prototype.newFrame = function()
{
    this.frame = setTimeout(this.loop, this.tickrate);
};

/**
 * Clear frame
 */
Ticker.prototype.clearFrame = function()
{
    clearTimeout(this.frame);
    this.frame = null;
};

/**
 * Animation loop
 */
Ticker.prototype.loop = function()
{
    //console.time('tick');
    this.newFrame();
    this.flush();
    //console.timeEnd('tick');
};

/**
 * Flush
 */
Ticker.prototype.flush = function()
{
    if (!this.events.length) {
        return;
    }

    var buffer = this.encoder.encode(this.events);

    for (var c = this.clients.items.length - 1; c >= 0; c--) {
        this.clients.items[c].sendBuffer(buffer);
    }

    this.events.length      = 0;
    this.namedEvents.length = 0;
};

/**
 * Detach events
 */
Ticker.prototype.attachEvents = function()
{
    this.game.on('start', this.onStart);
    this.game.on('stop', this.onStop);
    this.game.on('end', this.onEnd);
    this.game.on('clear', this.onClear);
    this.game.on('avatar:add', this.onAvatarAdd);
    this.game.on('avatar:remove', this.onAvatarRemove);
    this.game.on('borderless', this.onBorderless);
    this.game.bonusManager.on('bonus:pop', this.onBonusPop);
    this.game.bonusManager.on('bonus:clear', this.onBonusClear);
};

/**
 * Detach events
 */
Ticker.prototype.detachEvents = function()
{
    this.game.removeListener('start', this.onStart);
    this.game.removeListener('stop', this.onStop);
    this.game.removeListener('end', this.onEnd);
    this.game.removeListener('clear', this.onClear);
    this.game.removeListener('avatar:add', this.onAvatarAdd);
    this.game.removeListener('avatar:remove', this.onAvatarRemove);
    this.game.removeListener('borderless', this.onBorderless);
    this.game.bonusManager.removeListener('bonus:pop', this.onBonusPop);
    this.game.bonusManager.removeListener('bonus:clear', this.onBonusClear);
};

/**
 * Attach avatar events
 *
 * @param {Avatar} avatar
 */
Ticker.prototype.attachAvatarEvents = function(avatar)
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
Ticker.prototype.detachAvatarEvents = function(avatar)
{
    avatar.removeListener('die', this.onDie);
    avatar.removeListener('spawn', this.onSpawn);
    avatar.removeListener('position', this.onPosition);
    avatar.removeListener('point:important', this.onPoint);
    avatar.removeListener('property', this.onProperty);
    avatar.bonusStack.removeListener('change', this.onBonusStack);
};

/**
 * Add event
 *
 * @param {Object} event
 */
Ticker.prototype.addEvent = function(event)
{
    this.namedEvents.length++;
    this.events.push(event);
};

/**
 * Add named event
 *
 * @param {String} id
 * @param {Object} event
 */
Ticker.prototype.addNamedEvent = function(id, event)
{
    var index = this.namedEvents.indexOf(id);

    if (index >= 0) {
        this.events[index] = event;
    } else {
        this.namedEvents.push(id);
        this.events.push(event);
    }
};

/**
 * On avatar added
 */
Ticker.prototype.onAvatarAdd = function(data)
{
    var event = {
        name: 'avatar:add',
        data: {
            id: data.id,
            name: data.name,
            color: data.color
        }
    };

    this.attachAvatarEvents(data);
    //data.player.client.addEvent(event);
    this.addEvent(event);
};

/**
 * On avatar removed
 */
Ticker.prototype.onAvatarRemove = function(data)
{
    this.detachAvatarEvents(data);
    this.addEvent({name: 'avatar:remove', data: data.id});
};

/**
 * On point
 *
 * @param {Object} data
 */
Ticker.prototype.onPoint = function(data)
{
    this.addEvent({name: 'avatar:point', data: data.id});
};

/**
 * On position
 *
 * @param {Avatar} avatar
 */
Ticker.prototype.onPosition = function(avatar)
{
    this.addNamedEvent('position:' + avatar.id, {
        name: 'position',
        data: {
            id: avatar.id,
            x: /*this.compressor.compress(*/avatar.x/*)*/,
            y: /*this.compressor.compress(*/avatar.y/*)*/
        }
    });
};

/**
 * On spawn
 *
 * @param {Avatar} avatar
 */
Ticker.prototype.onSpawn = function(avatar)
{
    this.addEvent({name: 'spawn', data: avatar.id});
};

/**
 * On die
 *
 * @param {Object} data
 */
Ticker.prototype.onDie = function(data)
{
    this.addEvent({
        name: 'die',
        data: {
            id: data.avatar.id,
            angle: /*this.compressor.compress(*/data.avatar.angle/*)*/
        }
    });
};

/**
 * On bonus pop
 *
 * @param {Bonus} bonus
 */
Ticker.prototype.onBonusPop = function(bonus)
{
    this.addEvent({
        name: 'bonus:pop',
        data: {
            id: bonus.id,
            x: /*this.compressor.compress(*/bonus.x/*)*/,
            y: /*this.compressor.compress(*/bonus.y/*)*/,
            name: bonus.constructor.name
        }
    });
};

/**
 * On bonus clear
 *
 * @param {Bonus} bonus
 */
Ticker.prototype.onBonusClear = function(bonus)
{
    this.addEvent({name: 'bonus:clear', data: bonus.id});
};

/**
 * On property
 *
 * @param {Object} data
 */
Ticker.prototype.onProperty = function(data)
{
    this.addNamedEvent('property:' + data.property + ':' + data.avatar.id, {
        name: 'property',
        data: {
            id: data.avatar.id,
            property: data.property,
            value: data.value
        }
    });
};

/**
 * On bonus stack add
 *
 * @param {Object} data
 */
Ticker.prototype.onBonusStack = function(data)
{
    data.avatar.player.client.addEvent({
        name:'bonus:stack',
        data: {
            id: data.avatar.id,
            method: data.method,
            bonusId: data.bonus.id,
            bonusName: data.bonus.constructor.name,
            bonusDuration: data.bonus.duration
        }
    });
};

/**
 * On game start
 *
 * @param {Object} data
 */
Ticker.prototype.onStart = function(data)
{
    this.addEvent({name: 'start'});
};

/**
 * On game stop
 *
 * @param {Object} data
 */
Ticker.prototype.onStop = function(data)
{
    this.addEvent({name: 'stop'});
};

/**
 * On clear
 *
 * @param {Object} data
 */
Ticker.prototype.onClear = function(data)
{
    this.addEvent({name: 'clear'});
};

/**
 * On borderless
 *
 * @param {Object} data
 */
Ticker.prototype.onBorderless = function(data)
{
    this.addEvent({name: 'borderless', data: data});
};

/**
 * On end
 *
 * @param {Object} data
 */
Ticker.prototype.onEnd = function(data)
{
    this.addEvent({name: 'end'});
};

/**
 * Sum up situation
 *
 * @param {Client} client
 */
Ticker.prototype.sumUp = function(client)
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

        events.push({name: 'avatar:add', data: {id: avatar.id, name: avatar.name, color: avatar.color}});
        events.push({name: 'spawn', data: avatar.id});
        events.push({name: 'position', data: {id: avatar.id, x: /*this.compressor.compress(*/avatar.x/*)*/, y:/*this.compressor.compress(*/avatar.y/*)*/}});

        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                events.push({name: 'property', data: {id: avatar.id, property: property, value: avatar[properties[property]]}});
            }
        }
    }

    for (var bonus, j = this.game.bonusManager.bonuses.items.length - 1; j >= 0; j--) {
        bonus = this.game.bonusManager.bonuses.items[j];
        events.push({name: 'bonus:pop', data: {id: bonus.id, x: /*this.compressor.compress(*/bonus.x/*)*/, y:/*this.compressor.compress(*/bonus.y/*)*/, name: bonus.constructor.name}});
    }

    for (var point, k = this.game.world.bodies.items.length - 1; k >= 0; k--) {
        body = this.game.world.bodies.items[k];

        events.push({
            name: 'point',
            data: {
                x: /*this.compressor.compress(*/body.x/*)*/,
                y: /*this.compressor.compress(*/body.y/*)*/,
                radius: /*this.compressor.compress(*/body.radius/*)*/,
                color: body.color,
                data: body.data
            }
        });
    }

    if (this.game.borderless) {
        events.push({name: 'borderless', data: true});
    }

    client.sendEvents(events);
};
