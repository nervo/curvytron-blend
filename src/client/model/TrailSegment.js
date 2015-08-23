/**
 * Trail segment
 */
function TrailSegment()
{
    this.Xs        = [];
    this.Ys        = [];
    this.important = false;
    this.left      = null;
    this.right     = null;
    this.top       = null;
    this.bottom    = null;
}

/**
 * Set head
 *
 * @param {Number} x
 * @param {Number} y
 */
TrailSegment.prototype.setHead = function(x, y)
{
    if (this.important) {
        this.Xs.unshift(x);
        this.Ys.unshift(y);
        this.important = false;
    } else {
        this.Xs[0] = x;
        this.Ys[0] = y;
    }

    this.updateSize(x, y);
};

/**
 * Add point
 *
 * @param {Number} x
 * @param {Number} y
 */
TrailSegment.prototype.add = function(x, y)
{
    this.important = true;
    this.Xs.unshift(x);
    this.Ys.unshift(y);
    this.updateSize(x, y);
};

/**
 * Update size
 *
 * @param {Number} x
 * @param {Number} y
 */
TrailSegment.prototype.updateSize = function(x, y)
{
    this.left   = this.left === null ? x : Math.min(x, this.left);
    this.right  = this.right === null ? x : Math.max(x, this.right);
    this.top    = this.top === null ? y : Math.min(y, this.top);
    this.bottom = this.bottom === null ? y : Math.max(y, this.bottom);
};

/**
 * Is empty
 *
 * @return {Boolean}
 */
TrailSegment.prototype.isEmpty = function()
{
    return this.Xs.length === 0;
};
