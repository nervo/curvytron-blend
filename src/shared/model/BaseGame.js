/**
 * BaseGame
 */
function BaseGame()
{
    EventEmitter.call(this);

    this.frame        = null;
    this.avatars      = new Collection();
    this.size         = this.getSize(100);
    this.bonusManager = new BonusManager(this);
    this.fps          = new FPSLogger();
    this.rendered     = null;

    this.start    = this.start.bind(this);
    this.stop     = this.stop.bind(this);
    this.loop     = this.loop.bind(this);
    this.onFrame  = this.onFrame.bind(this);
}

BaseGame.prototype = Object.create(EventEmitter.prototype);
BaseGame.prototype.constructor = BaseGame;

/**
 * Loop frame rate
 *
 * @type {Number}
 */
BaseGame.prototype.framerate = 1/60 * 1000;

/**
 * Map size factor per player
 *
 * @type {Number}
 */
BaseGame.prototype.perPlayerSize = 80;

/**
 * Margin from borders
 *
 * @type {Number}
 */
BaseGame.prototype.spawnMargin = 0.05;

/**
 * Angle margin from borders
 *
 * @type {Number}
 */
BaseGame.prototype.spawnAngleMargin = 0.3;

/**
 * Borderless
 *
 * @type {Boolean}
 */
BaseGame.prototype.borderless = false;

/**
 * Update
 *
 * @param {Number} step
 */
BaseGame.prototype.update = function(step) {};

/**
 * Add an avatar to the game
 *
 * @param {Avatar} avatar
 */
BaseGame.prototype.addAvatar = function(avatar)
{
    return this.avatars.add(avatar);
};

/**
 * Remove an avatar from the game
 *
 * @param {Avatar} avatar
 */
BaseGame.prototype.removeAvatar = function(avatar)
{
    if (this.avatars.exists(avatar)) {
        avatar.die();
        this.avatars.remove(avatar);
        avatar.clear();

        return true;
    }

    return false;
};

/**
 * Start loop
 */
BaseGame.prototype.start = function()
{
    if (!this.frame) {
        this.onStart();
        this.loop();
    }
};

/**
 * Stop loop
 */
BaseGame.prototype.stop = function()
{
    if (this.frame) {
        this.clearFrame();
        this.onStop();
    }
};

/**
 * Animation loop
 */
BaseGame.prototype.loop = function()
{
    this.newFrame();

    var now  = new Date().getTime(),
        step = now - this.rendered;

    this.rendered = now;

    this.onFrame(step);
    this.fps.onFrame();
};

/**
 * On start
 */
BaseGame.prototype.onStart = function()
{
    this.rendered = new Date().getTime();
    this.bonusManager.start();
    this.fps.start();
};

/**
 * Onn stop
 */
BaseGame.prototype.onStop = function()
{
    this.rendered = null;
    this.bonusManager.stop();
    this.fps.stop();
};

/**
 * Get new frame
 */
BaseGame.prototype.newFrame = function()
{
    this.frame = setTimeout(this.loop, this.framerate);
};

/**
 * Clear frame
 */
BaseGame.prototype.clearFrame = function()
{
    clearTimeout(this.frame);
    this.frame = null;
};

/**
 * On frame
 *
 * @param {Number} step
 */
BaseGame.prototype.onFrame = function(step)
{
    this.update(step);
};

/**
 * Get size by players
 *
 * @param {Number} players
 *
 * @return {Number}
 */
BaseGame.prototype.getSize = function(players)
{
    var square = this.perPlayerSize * this.perPlayerSize,
        size   = Math.sqrt(square + ((players - 1) * square / 5));

    return Math.round(size);
};

/**
 * Set borderless
 *
 * @param {Boolean} borderless
 */
BaseGame.prototype.setBorderless = function(borderless)
{
    this.borderless = borderless ? true : false;
};