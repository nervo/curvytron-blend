/**
 * Game
 */
function Game()
{
    BaseGame.call(this);

    this.renderer = new Renderer(this);
    this.trails   = new Collection();

    this.onDie   = this.onDie.bind(this);
    this.onPoint = this.onPoint.bind(this);

    window.addEventListener('error', this.stop);
    window.addEventListener('resize', this.renderer.onResize);
}

Game.prototype = Object.create(BaseGame.prototype);
Game.prototype.constructor = Game;

/**
 * Add an avatar to the game
 *
 * @param {Avatar} avatar
 */
Game.prototype.addAvatar = function(avatar)
{
    if (BaseGame.prototype.addAvatar.call(this, avatar)) {
        avatar.on('die', this.onDie);
        avatar.on('point', this.onPoint);
        this.renderer.setAvatarScale(avatar);

        return true;
    }

    return false;
};

/**
 * Remove an avatar to the game
 *
 * @param {Avatar} avatar
 */
Game.prototype.removeAvatar = function(avatar)
{
    if (BaseGame.prototype.removeAvatar.call(this, avatar)) {
        avatar.off('die', this.onDie);
        avatar.off('point', this.onPoint);

        return true;
    }

    return false;
};

/**
 * Get new frame
 */
Game.prototype.newFrame = function(step)
{
    this.frame = window.requestAnimationFrame(this.loop);
};

/**
 * Clear frame
 */
Game.prototype.clearFrame = function()
{
    window.cancelAnimationFrame(this.frame);
    this.frame = null;
};

/**
 * On frame
 *
 * @param {Number} step
 */
Game.prototype.update = function(step)
{
    this.renderer.draw(step);
};

/**
 * On start
 */
Game.prototype.onStart = function()
{
    this.renderer.onResize();
    BaseGame.prototype.onStart.call(this);
};

/**
 * Clear trails
 */
Game.prototype.clearTrails = function()
{
    this.trails.clear();
};

/**
 * End
 */
Game.prototype.end = function()
{
    if (BaseGame.prototype.end.call(this)) {
        window.removeEventListener('error', this.stop);
        window.removeEventListener('resize', this.renderer.onResize);
    }
};

/**
 * Update size
 */
Game.prototype.setSize = function()
{
    BaseGame.prototype.setSize.call(this);
    this.renderer.onResize();
};

/**
 * Set borderless
 *
 * @param {Boolean} borderless
 */
Game.prototype.setBorderless = function(borderless)
{
    BaseGame.prototype.setBorderless.call(this, borderless);
    this.renderer.setMapChanged();
};

/**
 * On die
 *
 * @param {Event} event
 */
Game.prototype.onDie = function(event)
{
    this.renderer.explode(event.detail);
};

/**
 * On avatar point
 *
 * @param {Event} event
 */
Game.prototype.onPoint = function(event)
{
    var avatar = event.detail;

    this.getTrail(avatar.id, avatar.radius, avatar.color)
        .addPoint(avatar.x, avatar.y, avatar.angle);
};

/**
 * Get trail
 *
 * @param {Number} avatar
 * @param {Number} radius
 * @param {String} color
 *
 * @return {Trail}
 */
Game.prototype.getTrail = function(avatar, radius, color)
{
    var id = Trail.prototype.getId(avatar, radius, color);

    if (!this.trails.indexExists(id)) {
        var trail = new Trail(avatar, radius, color);

        this.trails.add(trail);

        return trail;
    }

    return this.trails.getById(id);
};
