/**
 * Game Repository
 *
 * @param {Array} controls
 */
function GameRepository (controls)
{
    this.client     = new SocketClient();
    this.compressor = new Compressor();
    this.sound      = new SoundManager();
    this.controls   = controls;
    this.game       = null;

    this.onConnect      = this.onConnect.bind(this);
    this.onDisconnect   = this.onDisconnect.bind(this);
    this.onBonusPop     = this.onBonusPop.bind(this);
    this.onBonusClear   = this.onBonusClear.bind(this);
    this.onBonusStack   = this.onBonusStack.bind(this);
    this.onPosition     = this.onPosition.bind(this);
    this.onAngle        = this.onAngle.bind(this);
    this.onPoint        = this.onPoint.bind(this);
    this.onDie          = this.onDie.bind(this);
    this.onProperty     = this.onProperty.bind(this);
    this.onClear        = this.onClear.bind(this);
    this.onBorderless   = this.onBorderless.bind(this);
    this.onEnd          = this.onEnd.bind(this);
    this.onAvatarAdd    = this.onAvatarAdd.bind(this);
    this.onAvatarRemove = this.onAvatarRemove.bind(this);
    this.onMove         = this.onMove.bind(this);
    this.onLoad         = this.onLoad.bind(this);

    this.client.on('connected', this.onConnect);
    this.client.on('disconnected', this.onDisconnect);
}

/**
 * On socket connected
 */
GameRepository.prototype.onConnect = function()
{
    console.info('Connected to server');
    this.game = new Game();
    this.attachEvents();
    this.game.bonusManager.on('load', this.onLoad);
};


/**
 * On sockect diconnected
 */
GameRepository.prototype.onDisconnect = function()
{
    console.info('Disconnected from server');
    this.detachEvents();
    this.game = null;
};

/**
 * On load
 */
GameRepository.prototype.onLoad = function()
{
    this.client.addEvent('ready');
};

/**
 * Attach events
 */
GameRepository.prototype.attachEvents = function()
{
    this.client.on('property', this.onProperty);
    this.client.on('position', this.onPosition);
    this.client.on('angle', this.onAngle);
    this.client.on('point', this.onPoint);
    this.client.on('die', this.onDie);
    this.client.on('bonus:pop', this.onBonusPop);
    this.client.on('bonus:clear', this.onBonusClear);
    this.client.on('bonus:stack', this.onBonusStack);
    this.client.on('clear', this.onClear);
    this.client.on('borderless', this.onBorderless);
    this.client.on('end', this.onEnd);
    this.client.on('avatar:me', this.onAvatarAdd);
    this.client.on('avatar:add', this.onAvatarAdd);
    this.client.on('avatar:remove', this.onAvatarRemove);
};

/**
 * Attach events
 */
GameRepository.prototype.detachEvents = function()
{
    this.client.off('property', this.onProperty);
    this.client.off('position', this.onPosition);
    this.client.off('angle', this.onAngle);
    this.client.off('point', this.onPoint);
    this.client.off('die', this.onDie);
    this.client.off('bonus:pop', this.onBonusPop);
    this.client.off('bonus:clear', this.onBonusClear);
    this.client.off('bonus:stack', this.onBonusStack);
    this.client.off('clear', this.onClear);
    this.client.off('borderless', this.onBorderless);
    this.client.off('end', this.onEnd);
    this.client.off('avatar:me', this.onAvatarAdd);
    this.client.off('avatar:add', this.onAvatarAdd);
    this.client.off('avatar:remove', this.onAvatarRemove);
};

/**
 * On property
 *
 * @param {Event} e
 */
GameRepository.prototype.onProperty = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        avatar.set(e.detail[1], e.detail[2]);
    }
};

/**
 * On position
 *
 * @param {Event} e
 */
GameRepository.prototype.onPosition = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        avatar.setPositionFromServer(
            this.compressor.decompress(e.detail[1]),
            this.compressor.decompress(e.detail[2])
        );
    }
};

/**
 * On point
 *
 * @param {Event} e
 */
GameRepository.prototype.onPoint = function(e)
{
    var avatar = this.game.avatars.getById(e.detail);

    if (avatar) {
        avatar.addPoint(avatar.x, avatar.y);
    }
};

/**
 * On angle
 *
 * @param {Event} e
 */
GameRepository.prototype.onAngle = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        avatar.setAngle(this.compressor.decompress(e.detail[1]));
    }
};

/**
 * On die
 *
 * @param {Event} e
 */
GameRepository.prototype.onDie = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
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
    var bonus = new MapBonus(
        e.detail[0],
        this.compressor.decompress(e.detail[1]),
        this.compressor.decompress(e.detail[2]),
        e.detail[3]
    );

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
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar && avatar.local) {
        avatar.bonusStack[e.detail[1]](new StackedBonus(e.detail[2], e.detail[3], e.detail[4]));
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
    var avatar = new Avatar(e.detail[0], e.detail[1], e.detail[2]);

    if (this.game.addAvatar(avatar) && e.type === 'avatar:me') {
        avatar.setLocal([
            this.controls[0].mapper.value,
            this.controls[1].mapper.value
        ]);

        avatar.input.on('move', this.onMove);
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

    console.info('onAvatarRemove', avatar);

    if (avatar) {
        this.game.removeAvatar(avatar);
    }
};

/**
 * On move
 *
 * @param {Event} e
 */
GameRepository.prototype.onMove = function(e)
{
    this.client.addEvent('move', e.detail.move ? e.detail.move : 0);
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
