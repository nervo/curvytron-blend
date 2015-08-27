/**
 * Trail
 *
 * @param {Number} avatar
 * @param {Number} radius
 * @param {String} color
 */
function Trail(avatar, radius, color)
{
    this.id         = this.getId(avatar, radius, color);
    this.avatar     = avatar;
    this.radius     = radius;
    this.width      = radius * 2;
    this.color      = color;
    this.current    = new TrailSegment(this);
    this.segments   = [this.current];
    this.lastX      = 0;
    this.lastY      = 0;
    this.clearAsked = false;
}

/**
 * Distance tolerance
 *
 * @type {Number}
 */
Trail.prototype.tolerance = 1;

/**
 * Add point
 *
 * @param {Number} x
 * @param {Number} y
 */
Trail.prototype.add = function(x, y)
{
    if (this.isFar(x, y)) {
        this.clear();
    }

    this.lastX = x;
    this.lastY = y;
    this.current.add(x, y);
};

/**
 * Update head
 *
 * @param {Number} x
 * @param {Number} y
 */
Trail.prototype.update = function(x, y)
{
    if (this.isFar(x, y)) {
        this.clear();
    }

    this.lastX = x;
    this.lastY = y;
    this.current.setHead(x, y);
};

/**
 * Is far
 *
 * @param {Number} x
 * @param {Number} y
 *
 * @return {Boolean}
 */
Trail.prototype.isFar = function(x, y)
{
    if (this.lastX === null || this.lastY === null) {
        return false;
    }

    return Math.abs(this.lastX - x) > this.tolerance || Math.abs(this.lastY - y) > this.tolerance;
};

/**
 * Clear
 */
Trail.prototype.clear = function()
{
    if (!this.current.isEmpty()) {
        this.current = new TrailSegment(this);
        this.segments.push(this.current);
    }
};

/**
 * Get id from variables
 *
 * @param {Number} avatar
 * @param {Number} radius
 * @param {String} color
 *
 * @return {String}
 */
Trail.prototype.getId = function(avatar, radius, color)
{
    return avatar.toString() + '-' + radius.toString() + '-' + color;
};

/**
 * Is empty
 *
 * @return {Boolean}
 */
Trail.prototype.isEmpty = function()
{
    return this.segments < 2 && this.current.isEmpty();
};
