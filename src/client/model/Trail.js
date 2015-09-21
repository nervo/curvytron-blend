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
    this.tolerance  = this.width;
    this.current    = new TrailSegment(this);
    this.segments   = [this.current];
    this.lastX      = null;
    this.lastY      = null;
    this.lastAngle  = null;
    this.clearAsked = false;
}

/**
 * Add point
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} angle
 */
Trail.prototype.addPoint = function(x, y, angle)
{
    if (this.lastX !== null && this.isFar(x, y)) {
        this.clear();
    }

    if (this.follow(angle) && !this.isFar(x, y)) {
        this.current.setHead(x, y);
    } else {
        this.current.add(x, y);
    }

    this.lastX     = x;
    this.lastY     = y;
    this.lastAngle = angle;
};

/**
 * Follow
 *
 * @param {Number} angle
 *
 * @return {Boolean}
 */
Trail.prototype.follow = function(angle)
{
    return this.lastAngle === angle;
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
