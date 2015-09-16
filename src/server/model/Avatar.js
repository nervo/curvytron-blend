/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player.name, player.color);

    this.player       = player;
    this.printManager = new PrintManager(this);
    this.body         = null;
    this.bodyCount    = 0;
}

Avatar.prototype = Object.create(BaseAvatar.prototype);
Avatar.prototype.constructor = Avatar;

/**
 * Warmup before avatars start to print
 *
 * @type {Number}
 */
Avatar.prototype.warmupBeforePrint = 3000;

/**
 * Update
 *
 * @param {Number} step
 */
Avatar.prototype.update = function(step)
{
    if (this.alive) {
        this.updateAngle(step);
        this.updatePosition(step);

        if (this.printing && this.isTimeToDraw()) {
            this.addPoint(this.x, this.y, false);
        }
    }
};

/**
 * Get body
 *
 * @return {Avatarbody}
 */
Avatar.prototype.getBody = function()
{
    if (!this.body) {
        this.body = new AvatarBody(this, 0, 0, false);
    }

    return this.body;
};

/**
 * Set position
 *
 * @param {Number} x
 * @param {Number} y
 */
Avatar.prototype.setPosition = function(x, y)
{
    BaseAvatar.prototype.setPosition.call(this, x, y);

    this.body.x   = this.x;
    this.body.y   = this.y;
    this.body.num = this.bodyCount;

    this.emit('position', this);
};

/**
 * Set velocity
 *
 * @param {Number} step
 */
Avatar.prototype.setVelocity = function(velocity)
{
    if (this.velocity !== velocity) {
        BaseAvatar.prototype.setVelocity.call(this, velocity);
        this.emit('property', {avatar: this, property: 'velocity', value: this.velocity});
    }
};

/**
 * Update angular velocity
 *
 * @param {Number} factor
 */
Avatar.prototype.updateAngularVelocity = function(factor)
{
    BaseAvatar.prototype.updateAngularVelocity.call(this, factor);
    this.emit('property', {avatar: this, property: 'move', value: factor});
};

/**
 * Set radius
 *
 * @param {Float} radius
 */
Avatar.prototype.setRadius = function(radius)
{
    if (this.radius !== radius) {
        BaseAvatar.prototype.setRadius.call(this, radius);
        this.body.radius = this.radius;
        this.emit('property', {avatar: this, property: 'radius', value: this.radius});
    }
};

/**
 * Set invincible
 *
 * @param {Number} invincible
 */
Avatar.prototype.setInvincible = function(invincible)
{
    BaseAvatar.prototype.setInvincible.call(this, invincible);
    this.emit('property', {avatar: this, property: 'invincible', value: this.invincible});
};

/**
 * Set inverse
 *
 * @param {Number} inverse
 */
Avatar.prototype.setInverse = function(inverse)
{
    BaseAvatar.prototype.setInverse.call(this, inverse);
    this.emit('property', {avatar: this, property: 'inverse', value: this.inverse});
};

/**
 * Set color
 *
 * @param {Number} color
 */
Avatar.prototype.setColor = function(color)
{
    this.color = color;
    this.emit('property', {avatar: this, property: 'color', value: this.color});
};

/**
 * Add point
 *
 * @param {Float} x
 * @param {Float} y
 * @param {Boolean} important
 */
Avatar.prototype.addPoint = function(x, y, important)
{
    BaseAvatar.prototype.addPoint.call(this, x, y);

    this.emit('point', {avatar: this, x: x, y: y, important: important});

    if (important) {
        this.emit('point:important', this);
    }
};

/**
 * Set printing
 *
 * @param {Boolean} printing
 */
Avatar.prototype.setPrinting = function(printing)
{
    if (BaseAvatar.prototype.setPrinting.call(this, printing)) {
        this.addPoint(this.x, this.y, true);
        this.emit('property', {avatar: this, property: 'printing', value: this.printing});
    }
};

/**
 * Spawn
 */
Avatar.prototype.spawn = function()
{
    BaseAvatar.prototype.spawn.call(this);
    setTimeout(this.printManager.start, this.warmupBeforePrint);
    this.emit('spawn', this);
};

/**
 * Die
 *
 * @param {Avatar} killer
 * @param {Boolean} old
 */
Avatar.prototype.die = function(killer, old)
{
    BaseAvatar.prototype.die.call(this);
    this.addPoint(this.x, this.y, false);
    this.printManager.stop();
    this.emit('die', {avatar: this, killer: killer, old: old});
};

/**
 * Clear
 */
Avatar.prototype.clear = function()
{
    BaseAvatar.prototype.clear.call(this);
    this.printManager.stop();
    this.bodyCount = 0;
};
