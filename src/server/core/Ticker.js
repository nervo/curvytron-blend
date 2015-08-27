/**
 * Ticker
 *
 * @param {Game} game
 */
function Ticker (game)
{
    this.clients    = new Collection();
    this.events     = new Collection();
    this.compressor = new Compressor();

    this.Start    = this.Start.bind(this);
    this.Stop     = this.Stop.bind(this);
    this.End      = this.End.bind(this);
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

    this.attachEvents();
}

/**
 * Detach events
 */
Ticker.prototype.attachEvents = function()
{
    this.game.on('start', this.Start);
    this.game.on('stop', this.Stop);
    this.game.on('end', this.End);
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
    this.game.removeListener('game:start', this.onGameStart);
    this.game.removeListener('game:stop', this.onGameStop);
    this.game.removeListener('end', this.onEnd);
    this.game.removeListener('clear', this.onClear);
    this.game.removeListener('avatar:add', this.onAvatarAdd);
    this.game.removeListener('avatar:remove', this.onAvatarRemove);
    this.game.removeListener('borderless', this.onBorderless);
    this.game.bonusManager.removeListener('bonus:pop', this.onBonusPop);
    this.game.bonusManager.removeListener('bonus:clear', this.onBonusClear);
};

/**
 * On avatar added
 */
GameController.prototype.onAvatarAdd = function(data)
{
    var avatar = [data.id, data.name, data.color];

    this.attachAvatarEvents(data);
    data.player.client.addEvent('avatar:me', avatar);
    this.socketGroup.addExcludeTargetEvent(data.player.client, 'avatar:add', avatar);
};

/**
 * On avatar removed
 */
GameController.prototype.onAvatarRemove = function(data)
{
    this.detachAvatarEvents(data);
    this.socketGroup.addEvent('avatar:remove', data.id);
};
