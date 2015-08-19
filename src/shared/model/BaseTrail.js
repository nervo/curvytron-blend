/**
 * BaseTrail
 */
function BaseTrail()
{
    EventEmitter.call(this);

    this.lastX  = null;
    this.lastY  = null;
}

BaseTrail.prototype = Object.create(EventEmitter.prototype);
BaseTrail.prototype.constructor = BaseTrail;

/**
 * Add point
 *
 * @param {Number} x
 * @param {Number} y
 */
BaseTrail.prototype.addPoint = function(x, y)
{
    this.lastX = x;
    this.lastY = y;
};

/**
 * Clear
 */
BaseTrail.prototype.clear = function()
{
    this.lastX = null;
    this.lastY = null;
};
