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
 * Invincibility warmup
 *
 * @type {Number}
 */
Avatar.prototype.warmup = 3000;

/**
 * Minimum radius
 *
 * @type {Number}
 */
Avatar.prototype.minimumRadius = BaseAvatar.prototype.radius / 10;

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
 * @param {Number} radius
 */
Avatar.prototype.setRadius = function(radius)
{
    radius = Math.max(radius, this.minimumRadius);

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
 */
Avatar.prototype.addPoint = function()
{
    BaseAvatar.prototype.addPoint.call(this);
    this.emit('point', {avatar: this, x: this.x, y: this.y});
};

/**
 * Set printing
 *
 * @param {Boolean} printing
 */
Avatar.prototype.setPrinting = function(printing)
{
    if (BaseAvatar.prototype.setPrinting.call(this, printing)) {
        this.emit('property', {avatar: this, property: 'printing', value: this.printing});
    }
};

/**
 * Spawn
 */
Avatar.prototype.spawn = function()
{
    BaseAvatar.prototype.spawn.call(this);
    this.printManager.start();
    new BonusSelfStart().applyTo(this);
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

    if (this.body) {
        this.body.radius = this.radius;
    }
};
