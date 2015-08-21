/**
 * Camera
 *
 * @param {Object} subject
 */
function Camera(subject)
{
    this.subject = subject;
    this.width   = 0;
    this.height  = 0;
    this.xMin    = 0;
    this.xMax    = 0;
    this.yMin    = 0;
    this.yMax    = 0;
}

/**
 * Zoom
 *
 * @type {Number}
 */
Camera.prototype.zoom = 3;

/**
 * Set subject
 *
 * @param {Avatar} avatar
 */
Camera.prototype.setSubject = function(avatar)
{
    this.subject = avatar;
};

/**
 * Set size
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Number} scale
 */
Camera.prototype.setDimension = function(width, height, scale)
{
    this.width       = width;
    this.height      = height;
    this.scale       = scale;
    this.scaleWidth  = this.width / this.scale / 2;
    this.scaleHeight = this.height / this.scale / 2;
};

/**
 * Update scene
 */
Camera.prototype.updateScene = function()
{
    this.xMin = this.subject.x - this.scaleWidth;
    this.xMax = this.subject.x + this.scaleWidth;
    this.yMin = this.subject.y - this.scaleHeight;
    this.yMax = this.subject.y + this.scaleHeight;
};

/**
 * Is visible
 *
 * @param {Number} x
 * @param {Number} y
 *
 * @return {Boolean}
 */
Camera.prototype.isVisible = function(x, y)
{
    return x >= this.xMin && x <= this.xMax && y >= this.yMin && y <= this.yMax;
};

/**
 * Get relative x position
 *
 * @param {Number} x
 *
 * @return {Number}
 */
Camera.prototype.x = function(x)
{
    return Canvas.prototype.round((x - this.xMin) * this.scale);
};

/**
 * Get relative y position
 *
 * @param {Number} y
 *
 * @return {Number}
 */
Camera.prototype.y = function(y)
{
    return Canvas.prototype.round((y - this.yMin) * this.scale);
};
