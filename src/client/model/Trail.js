/**
 * Trail
 */
function Trail()
{
    BaseTrail.call(this);

    this.current    = [];
    this.segments   = [];
    this.clearAsked = false;
}

Trail.prototype = Object.create(BaseTrail.prototype);
Trail.prototype.constructor = Trail;

/**
 * Distance tolerance
 *
 * @type {Number}
 */
Trail.prototype.tolerance = 1;

/**
 * Get last segment
 *
 * @return {Array}
 */
Trail.prototype.getLastSegment = function()
{
    if (this.segments.length) {
        return this.segments.shift();
    }

    if (this.current.length < 2) {
        return false;
    }

    var points = this.current.slice(0);

    this.current.splice(0, this.current.length - 1);

    return points;
};

/**
 * Add point
 *
 * @param {Number} x
 * @param {Number} y
 */
Trail.prototype.addPoint = function(x, y)
{
    if (this.isFar(x, y)) {
        this.clear();
    }

    BaseTrail.prototype.addPoint.call(this, x, y);
    this.current.push([x, y]);
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
    if (this.lastX === null) {
        return false;
    }

    return Math.abs(this.lastX - x) > this.tolerance || Math.abs(this.lastY - y) > this.tolerance;
};

/**
 * Clear
 */
Trail.prototype.clear = function()
{
    if (this.current.length > 1) {
        this.segments.push(this.current.splice(0));
    }

    BaseTrail.prototype.clear.call(this);
    this.current.length = 0;
};
