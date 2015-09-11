/**
 * Avatar
 *
 * @param {Number} id
 * @param {String} name
 * @param {String} color
 */
function Avatar(id, name, color)
{
    BaseAvatar.call(this, name, color);

    this.id          = id;
    this.canvas      = new Canvas();
    this.arrow       = new Canvas(this.arrowSize, this.arrowSize);
    this.width       = this.radius * 2;
    this.local       = false;
    this.changed     = false;
    this.viewChanged = false;
    this.turning     = false;

    this.drawArrow();
}

Avatar.prototype = Object.create(BaseAvatar.prototype);
Avatar.prototype.constructor = Avatar;

/**
 * Array width
 *
 * @type {Number}
 */
Avatar.prototype.arrowWidth = 3;

/**
 * Arrow canvas size
 *
 * @type {Number}
 */
Avatar.prototype.arrowSize = 200;

/**
 * Update
 *
 * @param {Number} step
 */
Avatar.prototype.update = function(step)
{
    if (!this.changed && this.alive) {
        this.updateAngle(step);
        this.updatePosition(step);
    }

    if (this.viewChanged) {
        this.updateWidth();
        this.viewChanged = false;
    }

    this.changed = false;
};

/**
 * Set local
 */
Avatar.prototype.setLocal = function()
{
    if (!this.local) {
        this.local = true;
    }
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
    this.emit('position', this);
};

/**
 * Set position (from server)
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} angle
 */
Avatar.prototype.setPositionFromServer = function(x, y, angle)
{
    this.setPosition(x, y);
    this.setAngle(angle);
    this.changed = true;
};

/**
 * Add point
 */
Avatar.prototype.addPoint = function()
{
    BaseAvatar.prototype.addPoint.call(this, this.x, this.y);
};

/**
 * Update scale
 */
Avatar.prototype.updateWidth = function()
{
    var width = Math.ceil(this.width * this.canvas.scale);

    if (this.canvas.element.width !== width) {
        this.canvas.setWidth(width);
        this.canvas.setHeight(width);
    }

    this.drawHead();
};

/**
 * Set scale
 *
 * @param {Number} scale
 */
Avatar.prototype.setScale = function(scale)
{
    this.canvas.setScale(scale);
    this.viewChanged = true;
};

/**
 * Set radius
 *
 * @param {Number} radius
 */
Avatar.prototype.setRadius = function(radius)
{
    BaseAvatar.prototype.setRadius.call(this, radius);
    this.width       = this.radius * 2;
    this.viewChanged = true;
};

/**
 * Set color
 *
 * @param {String} color
 */
Avatar.prototype.setColor = function(color)
{
    BaseAvatar.prototype.setColor.call(this, color);
    this.viewChanged = true;
};

/**
 * Set turning
 *
 * @param {Boolean} turning
 */
Avatar.prototype.setTurning = function(turning)
{
    this.turning = turning;
};

/**
 * Die
 */
Avatar.prototype.die = function()
{
    BaseAvatar.prototype.die.call(this);
    this.emit('die', this);
};

/**
 * Draw head
 */
Avatar.prototype.drawHead = function()
{
    this.canvas.clear();
    this.canvas.setFill(this.color);
    this.canvas.drawCircle(
        this.canvas.element.width/2,
        this.canvas.element.height/2,
        this.radius * this.canvas.scale
    );
};

/**
 * Draw arrow
 */
Avatar.prototype.drawArrow = function()
{
    var arrowLines = [
        [[this.arrowSize * 0.65, this.arrowSize * 0.5], [this.arrowSize * 0.95, this.arrowSize * 0.5]],
        [[this.arrowSize * 0.85, this.arrowSize * 0.4], [this.arrowSize * 0.95, this.arrowSize * 0.5], [this.arrowSize * 0.85, this.arrowSize * 0.6]]
    ];

    this.arrow.clear();

    for (var i = arrowLines.length - 1; i >= 0; i--) {
        this.arrow.drawLine(arrowLines[i], this.arrowSize * this.arrowWidth/100, this.color, 'round');
    }
};

/**
 * Destroy
 */
Avatar.prototype.destroy = function()
{
    this.canvas.clear();
    this.arrow.clear();

    BaseAvatar.prototype.destroy.call(this);
};

/**
 * Clear
 */
Avatar.prototype.clear = function()
{
    BaseAvatar.prototype.clear.call(this);
    this.updateWidth();
    this.drawHead();
};

/**
 * Set
 *
 * @param {String} property
 * @param {Object} value
 */
Avatar.prototype.set = function(property, value)
{
    var method = 'set' + property[0].toUpperCase() + property.slice(1);

    if (typeof(this[method]) !== 'undefined') {
        this[method](value);
    } else {
        throw 'Unknown setter ' + method;
    }
};

/**
 * Has bonus
 *
 * @return {Boolean}
 */
Avatar.prototype.hasBonus = function()
{
    return !this.bonusStack.bonuses.isEmpty();
};
