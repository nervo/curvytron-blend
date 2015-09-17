/**
 * Game Repository
 */
function GameRepository ()
{
    EventEmitter.call(this);

    this.client = new SocketClient();
    this.sound  = new SoundManager();
    this.game   = null;

    this.onConnect      = this.onConnect.bind(this);
    this.onDisconnect   = this.onDisconnect.bind(this);
    this.onBonusPop     = this.onBonusPop.bind(this);
    this.onBonusClear   = this.onBonusClear.bind(this);
    this.onBonusStack   = this.onBonusStack.bind(this);
    this.onPosition     = this.onPosition.bind(this);
    this.onSumUpPoint   = this.onSumUpPoint.bind(this);
    this.onSumUpAvatar  = this.onSumUpAvatar.bind(this);
    this.onAvatarPoint  = this.onAvatarPoint.bind(this);
    this.onSpawn        = this.onSpawn.bind(this);
    this.onDie          = this.onDie.bind(this);
    this.onProperty     = this.onProperty.bind(this);
    this.onClear        = this.onClear.bind(this);
    this.onBorderless   = this.onBorderless.bind(this);
    this.onEnd          = this.onEnd.bind(this);
    this.onAvatarAdd    = this.onAvatarAdd.bind(this);
    this.onAvatarRemove = this.onAvatarRemove.bind(this);
    this.onReady        = this.onReady.bind(this);
    this.onLoad         = this.onLoad.bind(this);

    this.client.on('connected', this.onConnect);
    this.client.on('disconnected', this.onDisconnect);
}

GameRepository.prototype = Object.create(EventEmitter.prototype);
GameRepository.prototype.constructor = GameRepository;

/**
 * On socket connected
 */
GameRepository.prototype.onConnect = function()
{
    this.game = new Game();
    this.attachEvents();
    this.game.bonusManager.on('load', this.onLoad);
};

/**
 * On load
 */
GameRepository.prototype.onLoad = function()
{
    this.game.bonusManager.off('load', this.onLoad);
    this.emit('start');
    this.client.addEvent({name: 'ready'}, this.onReady);
    this.game.start();
};

/**
 * On sockect diconnected
 */
GameRepository.prototype.onDisconnect = function()
{
    this.detachEvents();
    this.game.stop();
    this.game = null;
    this.emit('stop');
};

/**
 * On ready
 *
 * @param {Array} data
 */
GameRepository.prototype.onReady = function(data)
{
    this.emit('ready', data);
};

/**
 * Attach events
 */
GameRepository.prototype.attachEvents = function()
{
    this.client.on('property', this.onProperty);
    this.client.on('position', this.onPosition);
    this.client.on('avatar:point', this.onAvatarPoint);
    this.client.on('die', this.onDie);
    this.client.on('spawn', this.onSpawn);
    this.client.on('bonus:pop', this.onBonusPop);
    this.client.on('bonus:clear', this.onBonusClear);
    this.client.on('bonus:stack', this.onBonusStack);
    this.client.on('clear', this.onClear);
    this.client.on('borderless', this.onBorderless);
    this.client.on('end', this.onEnd);
    this.client.on('avatar:me', this.onAvatarAdd);
    this.client.on('avatar:add', this.onAvatarAdd);
    this.client.on('avatar:remove', this.onAvatarRemove);
    this.client.on('sumup:point', this.onSumUpPoint);
    this.client.on('sumup:avatar', this.onSumUpAvatar);
};

/**
 * Attach events
 */
GameRepository.prototype.detachEvents = function()
{
    this.client.off('property', this.onProperty);
    this.client.off('position', this.onPosition);
    this.client.off('die', this.onDie);
    this.client.off('spawn', this.onSpawn);
    this.client.off('bonus:pop', this.onBonusPop);
    this.client.off('bonus:clear', this.onBonusClear);
    this.client.off('bonus:stack', this.onBonusStack);
    this.client.off('clear', this.onClear);
    this.client.off('borderless', this.onBorderless);
    this.client.off('end', this.onEnd);
    this.client.off('avatar:me', this.onAvatarAdd);
    this.client.off('avatar:add', this.onAvatarAdd);
    this.client.off('avatar:remove', this.onAvatarRemove);
    this.client.off('sumup:point', this.onSumUpPoint);
    this.client.off('sumup:avatar', this.onSumUpAvatar);
};

/**
 * Move
 *
 * @param {Number} move
 */
GameRepository.prototype.move = function(move)
{
    this.client.addEvent({name: 'move', data: move});
};

/**
 * Join
 */
GameRepository.prototype.join = function()
{
    this.client.addEvent({name: 'join'});
};

/**
 * Set name
 *
 * @param {String} name
 * @param {Function} callback
 */
GameRepository.prototype.setName = function(name, callback)
{
    this.client.addEvent({name: 'name', data: name}, callback);
};

/**
 * Set color
 *
 * @param {Function} callback
 */
GameRepository.prototype.setColor = function(callback)
{
    this.client.addEvent({name: 'color'}, callback);
};

/**
 * On property
 *
 * @param {Event} e
 */
GameRepository.prototype.onProperty = function(e)
{
    var avatar = this.game.avatars.getById(e.detail.id);

    if (avatar) {
        avatar.set(e.detail.property, e.detail.value);
    }
};

/**
 * On position
 *
 * @param {Event} e
 */
GameRepository.prototype.onPosition = function(e)
{
    var avatar = this.game.avatars.getById(e.detail.id);

    if (avatar) {
        avatar.setPositionFromServer(e.detail.x, e.detail.y, e.detail.angle);
    }
};

/**
 * On sumup point
 *
 * @param {Event} e
 */
GameRepository.prototype.onSumUpPoint = function(e)
{
    this.game
        .getTrail(e.detail.avatar, e.detail.radius, this.rbgToHex(e.detail.color))
        .addPoint(e.detail.x, e.detail.y);
};

/**
 * On sumup avatar
 *
 * @param {Event} e
 */
GameRepository.prototype.onSumUpAvatar = function(e)
{
    var avatar = new Avatar(e.detail.id, e.detail.name, this.rbgToHex(e.detail.color));

    if (this.game.addAvatar(avatar)) {
        if (e.detail.alive) {
            avatar.spawn();
        }
        avatar.setPositionFromServer(e.detail.x, e.detail.y, e.detail.angle);
        avatar.setVelocity(e.detail.velocity);
        avatar.setRadius(e.detail.radius);
        avatar.setPrinting(e.detail.printing);
        avatar.setInvincible(e.detail.invincible);
        avatar.setInverse(e.detail.inverse);
        avatar.updateAngularVelocity(e.detail.move);
    }
};

/**
 * On avatar point
 *
 * @param {Event} e
 */
GameRepository.prototype.onAvatarPoint = function(e)
{
    var avatar = this.game.avatars.getById(e.detail);

    if (avatar) {
        this.game
            .getTrail(avatar.id, avatar.radius, avatar.color)
            .add(avatar.x, avatar.y);
    } else {
        console.error('Could not find avatar "%s"', e.detail);
    }
};

/**
 * On spawn
 *
 * @param {Event} e
 */
GameRepository.prototype.onSpawn = function(e)
{
    var avatar = this.game.avatars.getById(e.detail);

    if (avatar) {
        avatar.spawn();
        //this.sound.play('death');
    }
};


/**
 * On die
 *
 * @param {Event} e
 */
GameRepository.prototype.onDie = function(e)
{
    var avatar = this.game.avatars.getById(e.detail.id);

    if (avatar) {
        avatar.setAngle(e.detail.angle);
        avatar.die();
        this.sound.play('death');
    }
};

/**
 * On bonus pop
 *
 * @param {Event} e
 */
GameRepository.prototype.onBonusPop = function(e)
{
    var bonus = new MapBonus(e.detail.id, e.detail.x, e.detail.y, e.detail.name);

    this.game.bonusManager.add(bonus);
    this.sound.play('bonus-pop');
};

/**
 * On bonus clear
 *
 * @param {Event} e
 */
GameRepository.prototype.onBonusClear = function(e)
{
    var bonus = this.game.bonusManager.bonuses.getById(e.detail);

    if (bonus) {
        this.game.bonusManager.remove(bonus);
        this.sound.play('bonus-clear');
    }
};

/**
 * On bonus stack
 *
 * @param {Event} e
 */
GameRepository.prototype.onBonusStack = function(e)
{
    var avatar = this.game.avatars.getById(e.detail.id),
        bonus;

    if (avatar && avatar.local) {
        if (e.detail.add) {
            bonus = this.game.bonusManager.bonuses.getById(e.detail.bonus);
            if (bonus) {
                avatar.bonusStack.add(new StackedBonus(bonus.id, bonus.type));
            }
        } else {
            bonus = avatar.bonusStack.bonuses.getById(e.detail.bonus);

            if (bonus) {
                avatar.bonusStack.remove(bonus);
            }
        }
    }
};

/**
 * On clear
 *
 * @param {Event} e
 */
GameRepository.prototype.onClear = function(e)
{
    this.game.clearTrails();
};

/**
 * On borderless
 *
 * @param {Event} e
 */
GameRepository.prototype.onBorderless = function(e)
{
    this.game.setBorderless(e.detail);
    this.emit('borderless');
};

/**
 * On avatar add
 *
 * @param {Event} e
 */
GameRepository.prototype.onAvatarAdd = function(e)
{
    var avatar = new Avatar(e.detail.id, e.detail.name, this.rbgToHex(e.detail.color));

    if (this.game.addAvatar(avatar) && e.type === 'avatar:me') {
        avatar.setLocal();
        this.game.renderer.camera.setSubject(avatar);
        this.emit('play');
    }
};

/**
 * On avatar remove
 *
 * @param {Event} e
 */
GameRepository.prototype.onAvatarRemove = function(e)
{
    var avatar = this.game.avatars.getById(e.detail);

    if (avatar) {
        this.game.removeAvatar(avatar);
    }
};

/**
 * End
 */
GameRepository.prototype.onEnd = function()
{
    this.game.end();
    this.sound.play('win');
    this.emit('end');
};

/**
 * Convert color from RBG array to Hexadecimal string
 *
 * @param {Array} color
 *
 * @return {String}
 */
GameRepository.prototype.rbgToHex = function(color)
{
    return '#' + color[0].toString(16) + color[1].toString(16) + color[2].toString(16);
};
