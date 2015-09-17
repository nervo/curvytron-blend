/**
 * Base Avatar
 *
 * @param {String} name
 * @param {String} color
 */
function BaseAvatar(name, color)
{
    EventEmitter.call(this);

    this.id              = null;
    this.name            = name;
    this.defaultColor    = color;
    this.color           = color;
    this.bonusStack      = new BonusStack(this);
    this.x               = 0;
    this.y               = 0;
    this.angle           = 0;
    this.velocityX       = 0;
    this.velocityY       = 0;
    this.angularVelocity = 0;
    this.alive           = false;
    this.printing        = false;
    this.lastPointX      = null;
    this.lastPointY      = null;

    this.spawn = this.spawn.bind(this);
}

BaseAvatar.prototype = Object.create(EventEmitter.prototype);
BaseAvatar.prototype.constructor = BaseAvatar;

/**
 * Movement velocity
 *
 * @type {Number}
 */
BaseAvatar.prototype.velocity = 10;

/**
 * Turn velocity
 *
 * @type {Float}
 */
BaseAvatar.prototype.angularVelocityBase = 2.8/1000;

/**
 * Radius
 *
 * @type {Number}
 */
BaseAvatar.prototype.radius = 0.6;

/**
 * Inverted controls
 *
 * @type {Boolean}
 */
BaseAvatar.prototype.inverse = false;

/**
 * Invincible
 *
 * @type {Boolean}
 */
BaseAvatar.prototype.invincible = false;

/**
 * Type of tunrn: round or straight
 *
 * @type {Boolean}
 */
BaseAvatar.prototype.directionInLoop = true;

/**
 * Equal
 *
 * @param {Avatar} avatar
 *
 * @return {Boolean}
 */
BaseAvatar.prototype.equal = function(avatar)
{
    return this.id === avatar.id;
};

/**
 * Set Point
 *
 * @param {Float} x
 * @param {Float} y
 */
BaseAvatar.prototype.setPosition = function(x, y)
{
    this.x = x;
    this.y = y;
};

/**
 * Add point
 *
 * @param {Float} x
 * @param {Float} y
 */
BaseAvatar.prototype.addPoint = function(x, y)
{
    this.lastPointX = x;
    this.lastPointY = y;
};

/**
 * Is time to draw?
 *
 * @return {Boolean}
 */
BaseAvatar.prototype.isTimeToDraw = function()
{
    if (this.lastPointX === null || this.lastPointY === null) {
        return true;
    }

    return this.getDistance(this.lastPointX, this.lastPointY, this.x, this.y) > this.radius;
};

/**
 * Is turning?
 */
BaseAvatar.prototype.isTurning = function(turning)
{
    return this.angularVelocity !== 0;
};

/**
 * Update angular velocity
 *
 * @param {Number} factor
 */
BaseAvatar.prototype.updateAngularVelocity = function(factor)
{
    if (typeof(factor) === 'undefined') {
        if (this.angularVelocity === 0) { return; }
        factor = (this.angularVelocity > 0 ? 1 : -1) * (this.inverse ? -1 : 1);
    }

    this.setAngularVelocity(factor * this.angularVelocityBase * (this.inverse ? -1 : 1));
};

/**
 * Set angular velocity
 *
 * @param {Float} angularVelocity
 */
BaseAvatar.prototype.setAngularVelocity = function(angularVelocity)
{
    this.angularVelocity = angularVelocity;
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
BaseAvatar.prototype.setAngle = function(angle)
{
    if (this.angle !== angle) {
        this.angle = angle;
        this.updateVelocities();
    }
};

/**
 * Update
 *
 * @param {Number} step
 */
BaseAvatar.prototype.update = function(step) {};

/**
 * Add angle
 *
 * @param {Number} step
 */
BaseAvatar.prototype.updateAngle = function(step)
{
    if (this.angularVelocity) {
        var diff  = this.directionInLoop ? this.angularVelocity * step : this.angularVelocity,
            angle = (this.angle + diff) % (2 * Math.PI);

        if (angle < 0) {
            angle += 2 * Math.PI;
        }

        this.setAngle(angle);

        if (!this.directionInLoop) {
            this.updateAngularVelocity(0);
        }
    }
};

/**
 * Update position
 *
 * @param {Number} step
 */
BaseAvatar.prototype.updatePosition = function(step)
{
    this.setPosition(
        this.x + this.velocityX * step,
        this.y + this.velocityY * step
    );
};

/**
 * Set velocity
 *
 * @param {Number} step
 */
BaseAvatar.prototype.setVelocity = function(velocity)
{
    velocity = Math.max(velocity, BaseAvatar.prototype.velocity/2);

    if (this.velocity !== velocity) {
        this.velocity = velocity;
        this.updateVelocities();
        this.updateBaseAngularVelocity();
    }
};

/**
 * Update velocities
 */
BaseAvatar.prototype.updateVelocities = function()
{
    var velocity = this.velocity/1000;

    this.velocityX = Math.cos(this.angle) * velocity;
    this.velocityY = Math.sin(this.angle) * velocity;
};

/**
 * Update base angular velocity
 */
BaseAvatar.prototype.updateBaseAngularVelocity = function()
{
    if (this.directionInLoop) {
        var ratio = this.velocity / BaseAvatar.prototype.velocity;
        this.setBaseAngularVelocity(ratio * BaseAvatar.prototype.angularVelocityBase + Math.log(1/ratio)/1000);
    }
};

/**
 * Set base angular velocity
 *
 * @param {Number} baseAngulerVelocity
 */
BaseAvatar.prototype.setBaseAngularVelocity = function(baseAngulerVelocity)
{
    if (this.angularVelocityBase !== baseAngulerVelocity) {
        this.angularVelocityBase = baseAngulerVelocity;
        this.updateAngularVelocity();
    }
};

/**
 * Set radius
 *
 * @param {Number} radius
 */
BaseAvatar.prototype.setRadius = function(radius)
{
    this.radius = Math.max(radius, BaseAvatar.prototype.radius/8);
};

/**
 * Set inverse
 *
 * @param {Number} inverse
 */
BaseAvatar.prototype.setInverse = function(inverse)
{
    if (this.inverse !== inverse) {
        this.inverse = inverse ? true : false;
        this.updateAngularVelocity();
    }
};

/**
 * Set invincible
 *
 * @param {Number} invincible
 */
BaseAvatar.prototype.setInvincible = function(invincible)
{
    this.invincible = invincible ? true : false;
};

/**
 * Get distance
 *
 * @param {Number} fromX
 * @param {Number} fromY
 * @param {Number} toX
 * @param {Number} toY
 *
 * @return {Number}
 */
BaseAvatar.prototype.getDistance = function(fromX, fromY, toX, toY)
{
    return Math.sqrt(Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2));
};

/**
 * Spawn
 */
BaseAvatar.prototype.spawn = function()
{
    this.clear();
    this.alive = true;
};

/**
 * Die
 */
BaseAvatar.prototype.die = function()
{
    this.alive = false;
    this.bonusStack.clear();
};

/**
 * Set printing
 *
 * @param {Boolean} printing
 */
BaseAvatar.prototype.setPrinting = function(printing)
{
    printing = printing ? true : false;

    if (this.printing !== printing) {
        this.printing = printing;

        return true;
    }

    return false;
};

/**
 * Set color
 *
 * @param {Number} color
 */
BaseAvatar.prototype.setColor = function(color)
{
    this.color = color;
};

/**
 * Clear
 */
BaseAvatar.prototype.clear = function()
{
    this.bonusStack.clear();

    this.x                   = this.radius;
    this.y                   = this.radius;
    this.angle               = 0;
    this.velocityX           = 0;
    this.velocityY           = 0;
    this.angularVelocity     = 0;
    this.velocity            = BaseAvatar.prototype.velocity;
    this.alive               = false;
    this.printing            = false;
    this.color               = this.defaultColor;
    this.radius              = BaseAvatar.prototype.radius;
    this.inverse             = BaseAvatar.prototype.inverse;
    this.invincible          = BaseAvatar.prototype.invincible;
    this.directionInLoop     = BaseAvatar.prototype.directionInLoop;
    this.angularVelocityBase = BaseAvatar.prototype.angularVelocityBase;

    if (this.body) {
        this.body.radius = BaseAvatar.prototype.radius;
    }
};
