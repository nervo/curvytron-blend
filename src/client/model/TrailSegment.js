/**
 * Trail segment
 *
 * @param {Trail} trail
 */
function TrailSegment(trail)
{
    this.trail     = trail;
    this.Xs        = [];
    this.Ys        = [];
    this.changed   = true;
    this.important = false;
    this.left      = null;
    this.right     = null;
    this.top       = null;
    this.bottom    = null;
    this.canvas    = new Canvas();
}

/**
 * Set head
 *
 * @param {Number} x
 * @param {Number} y
 */
TrailSegment.prototype.setHead = function(x, y)
{
    this.updateSize(x, y);

    if (this.important) {
        this.Xs.unshift(x);
        this.Ys.unshift(y);
        this.important = false;
    } else {
        this.Xs[0] = x;
        this.Ys[0] = y;
    }
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
    this.updateSize(x, y);
    this.Xs.unshift(x);
    this.Ys.unshift(y);
};

/**
 * Update size
 *
 * @param {Number} x
 * @param {Number} y
 */
TrailSegment.prototype.updateSize = function(x, y)
{
    this.left    = this.left === null ? x - this.trail.radius : Math.min(x - this.trail.radius, this.left);
    this.right   = this.right === null ? x + this.trail.width : Math.max(x + this.trail.width, this.right);
    this.top     = this.top === null ? y - this.trail.radius : Math.min(y - this.trail.radius, this.top);
    this.bottom  = this.bottom === null ? y + this.trail.width : Math.max(y + this.trail.width, this.bottom);
    this.changed = true;
};

/**
 * Draw
 *
 * @param {Number} scale
 */
TrailSegment.prototype.draw = function(scale)
{
    if (this.canvas.scale !== scale) {
        this.canvas.setScale(scale);
        this.changed = true;
    }

    if (this.changed) {
        this.resize();
        this.canvas.drawLineScaledMargin(this.Xs, this.Ys, this.left, this.top);
        this.changed = false;
    }

    return this.canvas.element;
};

/**
 * Resize
 */
TrailSegment.prototype.resize = function()
{
    this.canvas.clear();
    this.canvas.setWidth(Math.ceil((this.right - this.left) * this.canvas.scale));
    this.canvas.setHeight(Math.ceil((this.bottom - this.top) * this.canvas.scale));
    this.canvas.setStroke(this.trail.color);
    this.canvas.setLineWidth(this.trail.width * this.canvas.scale);
    this.canvas.setLineCap('round');
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
