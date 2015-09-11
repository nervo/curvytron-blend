/**
 * Game
 */
function Game()
{
    BaseGame.call(this);

    this.world      = new World(this.size);
    this.bonusStack = new GameBonusStack(this);

    this.avatars.index = true;

    this.onSpawn = this.onSpawn.bind(this);
    this.onDie   = this.onDie.bind(this);
    this.onPoint = this.onPoint.bind(this);

    /*this.fps.on('fps', function (frequency) {
        console.log('game (%s - %s - %s): %s', this.avatars.items.length, this.size, this.world.islands.ids.length, frequency);
    }.bind(this));*/
}

Game.prototype = Object.create(BaseGame.prototype);
Game.prototype.constructor = Game;

/**
 * Margin from borders
 *
 * @type {Number}
 */
Game.prototype.spawnMargin = 0.03;

/**
 * Angle margin from borders
 *
 * @type {Number}
 */
Game.prototype.spawnAngleMargin = 0.2;

/**
 * Respawn time
 *
 * @type {Number}
 */
Game.prototype.respawnTime = 5000;

/**
 * Animation loop
 */
Game.prototype.loop = function()
{
    //console.time('game');

    var now  = new Date().getTime(),
        step = now - this.rendered;

    this.rendered = now;

    this.onFrame(step);
    this.fps.onFrame(step);
    this.newFrame(step);
    //console.timeEnd('game');
};

/**
 * Get new frame
 */
Game.prototype.newFrame = function(step)
{
    if (step < this.framerate) {
        this.frame = setTimeout(this.loop, this.framerate - step );
    } else {
        this.frame = setImmediate(this.loop);
    }
};

/**
 * Clear frame
 */
Game.prototype.clearFrame = function()
{
    if (this.frame instanceof immediateObject) {
        clearImmediate(this.frame);
    } else {
        clearTimeout(this.frame);
    }
    this.frame = null;
};

/**
 * Update
 *
 * @param {Number} step
 */
Game.prototype.update = function(step)
{
    for (var avatar, border, position, body, i = this.avatars.items.length - 1; i >= 0; i--) {
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
                    body = this.world.getBody(avatar.body);

                    if (body) {
                        avatar.die(this.avatars.getById(body.data), body.isOld());
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
        avatar.on('die', this.onDie);
        avatar.on('spawn', this.onSpawn);
        avatar.on('point', this.onPoint);
        this.emit('avatar:add', avatar);
        avatar.getBody();
        avatar.spawn();

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
        avatar.removeListener('die', this.onDie);
        avatar.removeListener('spawn', this.onSpawn);
        avatar.removeListener('point', this.onPoint);
        this.emit('avatar:remove', avatar);

        return true;
    }

    return false;
};

/**
 * On avatar spawn
 *
 * @param {Avatar} avatar
 */
Game.prototype.onSpawn = function(avatar)
{
    var position = this.world.getRandomPosition(avatar.radius, this.spawnMargin);

    avatar.setPosition(position[0], position[1]);
    avatar.setAngle(this.world.getRandomDirection(avatar.x, avatar.y, this.spawnAngleMargin));
};

/**
 * On avatar die
 *
 * @param {Object} data
 */
Game.prototype.onDie = function(data)
{
    setTimeout(data.avatar.spawn, this.respawnTime);
};

/**
 * On avatar add point
 *
 * @param {Object} data
 */
Game.prototype.onPoint = function(data)
{
    if (this.world.active) {
        this.world.addBody(new AvatarBody(data.avatar, data.x, data.y, data.important));
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
    this.emit('start', {game: this});
    this.world.activate();
    BaseGame.prototype.onStart.call(this);
};

/**
 * On stop
 */
Game.prototype.onStop = function()
{
    BaseGame.prototype.onStop.call(this);
    this.emit('stop', {game: this});
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
