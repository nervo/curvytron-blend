/**
 * Camera
 *
 * @param {Object} subject
 * @param {Number} mapSize
 */
function Camera(subject, mapSize)
{
    this.subject     = subject;
    this.mapSize     = mapSize;
    this.width       = 0;
    this.height      = 0;
    this.scale       = 0;
    this.sceneWidth  = 0;
    this.sceneHeight = 0;
    this.sceneLeft   = 0;
    this.sceneRight  = 0;
    this.sceneTop    = 0;
    this.sceneBottom = 0;
    this.mapX        = 0;
    this.mapY        = 0;
    this.mapLeft     = 0;
    this.mapRight    = 0;
    this.mapTop      = 0;
    this.mapBottom   = 0;
    this.moved       = true;
    this.resized     = true;

    this.onPosition = this.onPosition.bind(this);
    this.onResize   = this.onResize.bind(this);
}

/**
 * Zoom
 *
 * @type {Number}
 */
Camera.prototype.zoom = 5;

/**
 * Set subject
 *
 * @param {Avatar} avatar
 */
Camera.prototype.setSubject = function(avatar)
{
    if (this.subject && this.subject instanceof Avatar) {
        this.subject.off('position', this.onPosition);
    }

    this.subject = avatar;
    this.subject.on('position', this.onPosition);
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
    this.sceneWidth  = this.width / this.scale / 2;
    this.sceneHeight = this.height / this.scale / 2;
    this.resized     = true;
    this.moved       = true;
};

/**
 * Update map
 */
Camera.prototype.updateMap = function()
{
    if (this.resized) {
        this.resized   = false;
        this.mapLeft   = this.sceneWidth;
        this.mapRight  = this.mapSize - this.sceneWidth;
        this.mapTop    = this.sceneHeight;
        this.mapBottom = this.mapSize - this.sceneHeight;
    }
};

/**
 * Update scene
 */
Camera.prototype.updateScene = function()
{
    if (this.moved) {
        this.moved       = false;
        this.sceneLeft   = this.subject.x - this.sceneWidth;
        this.sceneRight  = this.subject.x + this.sceneWidth;
        this.sceneTop    = this.subject.y - this.sceneHeight;
        this.sceneBottom = this.subject.y + this.sceneHeight;
    }
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
    return x >= this.sceneLeft && x <= this.sceneRight && y >= this.sceneTop && y <= this.sceneBottom;
};

/**
 * Is box visible
 *
 * @param {Number} left
 * @param {Number} right
 * @param {Number} top
 * @param {Number} bottom
 *
 * @return {Boolean}
 */
Camera.prototype.isBoxVisible = function(left, right, top, bottom)
{
    return left <= this.sceneRight && right >= this.sceneLeft && top <= this.sceneBottom && bottom >= this.sceneTop;
};

/**
 * Get relative x position (rounded)
 *
 * @param {Number} x
 *
 * @return {Number}
 */
Camera.prototype.x = function(x)
{
    return this.round((x - this.sceneLeft) * this.scale);
};

/**
 * Get relative y position (rounded)
 *
 * @param {Number} y
 *
 * @return {Number}
 */
Camera.prototype.y = function(y)
{
    return this.round((y - this.sceneTop) * this.scale);
};

/**
 * Get relative x position
 *
 * @param {Number} x
 *
 * @return {Number}
 */
Camera.prototype.xPosition = function(x)
{
    return (x - this.sceneLeft) * this.scale;
};

/**
 * Get relative y position
 *
 * @param {Number} y
 *
 * @return {Number}
 */
Camera.prototype.yPosition = function(y)
{
    return (y - this.sceneTop) * this.scale;
};

/**
 * Get map left margin
 *
 * @return {Number}
 */
Camera.prototype.getMapLeft = function()
{
    return this.subject.x < this.mapLeft ? this.round((this.mapLeft - this.subject.x) * this.scale) : 0;
};

/**
 * Get map right margin
 *
 * @return {Number}
 */
Camera.prototype.getMapRight = function()
{
    return this.subject.x > this.mapRight ? this.round((this.subject.x - this.mapRight) * this.scale) : 0;
};

/**
 * Get map top margin
 *
 * @return {Number}
 */
Camera.prototype.getMapTop = function()
{
    return this.subject.y < this.mapTop ? this.round((this.mapTop - this.subject.y) * this.scale) : 0;
};

/**
 * Get map bottom margin
 *
 * @return {Number}
 */
Camera.prototype.getMapBottom = function()
{
    return this.subject.y > this.mapBottom ? this.round((this.subject.y - this.mapBottom) * this.scale) : 0;
};

/**
 * Round
 *
 * @param {Number} value
 *
 * @return {Number}
 */
Camera.prototype.round = function (value)
{
    return (0.5 + value) | 0;
};

/**
 * On resize
 *
 * @param {Event} event
 */
Camera.prototype.onResize = function(event)
{
    this.resized = true;
};

/**
 * On position
 *
 * @param {Event} event
 */
Camera.prototype.onPosition = function(event)
{
    this.moved = true;
};
