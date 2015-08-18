/**
 * Game
 */
function Game()
{
    BaseGame.call(this);

    this.world      = new World(this.size);
    this.bonusStack = new GameBonusStack(this);

    this.avatars.index = true;

    this.onPoint = this.onPoint.bind(this);
}

Game.prototype = Object.create(BaseGame.prototype);
Game.prototype.constructor = Game;

/**
 * Warmup before avatars start to print
 *
 * @type {Number}
 */
Game.prototype.warmupBeforePrint = 3000;

/**
 * Update
 *
 * @param {Number} step
 */
Game.prototype.update = function(step)
{
    for (var avatar, border, position, killer, i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        if (avatar.alive) {
            avatar.update(step);

            border = this.world.getBoundIntersect(avatar.body, this.borderless ? 0 : avatar.radius);

            if (border) {
                if (this.borderless) {
                    position = this.world.getOposite(border[0], border[1]);
                    avatar.setPosition(position[0], position[1]);
                } else {
                    avatar.die();
                }
            } else {
                if (!avatar.invincible) {
                    killer = this.world.getBody(avatar.body);

                    if (killer) {
                        avatar.die(killer);
                    }
                }
            }

            if (avatar.alive) {
                avatar.printManager.test();
                this.bonusManager.testCatch(avatar);
            }
        }
    }
};

/**
 * On add avatar
 *
 * @param {Avatar} avatar
 */
Game.prototype.addAvatar = function (avatar)
{
    if (BaseGame.prototype.addAvatar.call(this, avatar)) {
        var position = this.world.getRandomPosition(avatar.radius, this.spawnMargin),
            angle    = this.world.getRandomDirection(avatar.x, avatar.y, this.spawnAngleMargin);

        avatar.clear();
        avatar.setPosition(position[0], position[1]);
        avatar.setAngle(angle);
        avatar.on('point', this.onPoint);
        setTimeout(avatar.printManager.start, this.warmupBeforePrint);

        this.emit('avatar:add', avatar);

        return true;
    }

    return false;
};

/**
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
Game.prototype.removeAvatar = function(avatar)
{
    if (BaseGame.prototype.removeAvatar.call(this, avatar)) {
        this.emit('avatar:remove', avatar);

        return true;
    }

    return false;
};

/**
 * On avatar add point
 *
 * @param {Object} data
 */
Game.prototype.onPoint = function(data)
{
    if (this.world.active) {
        this.world.addBody(new AvatarBody(data.x, data.y, data.avatar));
    }
};

/**
 * Clear trails
 */
Game.prototype.clearTrails = function()
{
    this.world.clear();
    this.world.activate();
    this.emit('clear', {game: this});
};

/**
 * Update size
 */
Game.prototype.setSize = function()
{
    BaseGame.prototype.setSize.call(this);

    this.world.clear();
    this.world = new World(this.size);

    this.bonusManager.setSize();
};

/**
 * On start
 */
Game.prototype.onStart = function()
{
    this.emit('game:start', {game: this});
    this.world.activate();
    BaseGame.prototype.onStart.call(this);
};

/**
 * On stop
 */
Game.prototype.onStop = function()
{
    BaseGame.prototype.onStop.call(this);
    this.emit('game:stop', {game: this});
};

/**
 * Set borderless
 *
 * @param {Boolean} borderless
 */
Game.prototype.setBorderless = function(borderless)
{
    if (this.borderless !== borderless) {
        BaseGame.prototype.setBorderless.call(this, borderless);
        this.emit('borderless', this.borderless);
    }
};
