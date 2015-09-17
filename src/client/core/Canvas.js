/**
 * Canvas
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Element} element
 */
function Canvas(width, height, element)
{
    this.element = typeof(element) !== 'undefined' ? element : document.createElement('canvas');
    this.context = this.element.getContext('2d');
    this.scale   = 1;

    if (typeof(width) !== 'undefined' && width) {
        this.setWidth(width);
    }

    if (typeof(height) !== 'undefined' && height) {
        this.setHeight(height);
    }
}

/**
 * Two pi
 *
 * @type {Number}
 */
Canvas.prototype.twoPi = 2 * Math.PI;

/**
 * Set width
 *
 * @param {Number} width
 */
Canvas.prototype.setWidth = function(width)
{
    this.element.width = width;
};

/**
 * Set height
 *
 * @param {Number} height
 */
Canvas.prototype.setHeight = function(height)
{
    this.element.height = height;
};

/**
 * Set scale
 *
 * @param {Float} scale
 */
Canvas.prototype.setScale = function(scale)
{
    this.scale = scale;
};

/**
 * Set opacity
 *
 * @param {Float} opacity
 */
Canvas.prototype.setOpacity = function(opacity)
{
    this.context.globalAlpha = opacity;
};

/**
 * Set fill color
 *
 * @param {String} color
 */
Canvas.prototype.setFill = function(color)
{
    this.context.fillStyle = color;
};

/**
 * Set stroke color
 *
 * @param {String} color
 */
Canvas.prototype.setStroke = function(color)
{
    this.context.strokeStyle = color;
};

/**
 * Set line cap
 *
 * @param {String} style
 */
Canvas.prototype.setLineCap = function(style)
{
    this.context.lineCap = style;
};

/**
 * Set line width
 *
 * @param {Number} width
 */
Canvas.prototype.setLineWidth = function(width)
{
    this.context.lineWidth = width;
};

/**
 * Set dimension
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Number} scale
 */
Canvas.prototype.setDimension = function(width, height, scale)
{
    this.setWidth(width);
    this.setHeight(height);
    this.setScale(scale);
};

/**
 * Set dimension with content
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Number} scale
 */
Canvas.prototype.setDimensionWithContent = function(width, height, scale)
{
    var save = new Canvas(this.element.width, this.element.height);

    save.pastImage(this.element);
    this.setDimension(width, height, scale);
    this.drawImage(save.element, 0, 0, this.element.width, this.element.height);
};

/**
 * Clear
 */
Canvas.prototype.clear = function()
{
    this.context.clearRect(0, 0, this.element.width, this.element.height);
};

/**
 * Clear rectangular zone
 */
Canvas.prototype.clearZone = function(x, y, width, height)
{
    this.context.clearRect(x, y, width, height);
};

/**
 * Color
 */
Canvas.prototype.color = function(color)
{
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.element.width, this.element.height);
};

/**
 * Draw image
 *
 * @param {Resource} image
 */
Canvas.prototype.drawImage = function(image) {
    this.context.drawImage(image, 0, 0);
};

/**
 * Draw image to position
 *
 * @param {Resource} image
 * @param {Number} x
 * @param {Number} y
 */
Canvas.prototype.drawImageTo = function(image, x, y) {
    this.context.drawImage(image, x, y);
};

/**
 * Draw image to position
 *
 * @param {Resource} image
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 */
Canvas.prototype.drawImageToAt = function(image, x, y, width, height) {
    this.context.drawImage(image, x, y, width, height);
};

/**
 * Draw image to position
 *
 * @param {Resource} image
 * @param {Number} srcX
 * @param {Number} srcY
 * @param {Number} srcWidth
 * @param {Number} srcHeight
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 */
Canvas.prototype.drawImageSizeToAt = function(image, srcX, srcY, srcWidth, srcheight, x, y, width, height)
{
    this.context.drawImage(image, srcX, srcY, srcWidth, srcheight, x, y, width, height);
};

/**
 * Reverse image
 */
Canvas.prototype.reverse = function()
{
    this.context.save();
    this.context.translate(this.element.width, 0);
    this.context.scale(-1, 1);
};

/**
 * Clear rectangular zone scaled
 */
Canvas.prototype.clearZoneScaled = function(x, y, width, height)
{
    this.clearZone(
        this.round(x * this.scale),
        this.round(y * this.scale),
        this.round(width * this.scale),
        this.round(height * this.scale)
    );
};

/**
 * Draw image to scale
 *
 * @param {Resource} image
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 */
Canvas.prototype.drawImageScaled = function(image, x, y, width, height)
{
    this.context.drawImage(
        image,
        this.round(x * this.scale),
        this.round(y * this.scale),
        this.round(width * this.scale),
        this.round(height * this.scale)
    );
};

/**
 * Draw image to scale
 *
 * @param {Resource} image
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @param {Float} angle
 */
Canvas.prototype.drawImageScaledAngle = function(image, x, y, width, height, angle)
{
    var centerWidth  = this.round(width / 2 * this.scale),
        centerHeight = this.round(height / 2 * this.scale),
        centerX      = this.round(x * this.scale) + width,
        centerY      = this.round(y * this.scale) + height;

    this.context.save();
    this.context.translate(centerX, centerY);
    this.context.rotate(angle);
    this.context.drawImage(image, -centerWidth, -centerHeight, centerWidth * 2, centerHeight * 2);
    this.context.restore();
};

/**
 * Past image
 *
 * @param {Resource} image
 */
Canvas.prototype.pastImage = function(image)
{
    this.context.drawImage(image, 0, 0);
};

/**
 * Draw circle
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} radius
 */
Canvas.prototype.drawCircle = function(x, y, radius)
{
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, this.twoPi, false);
    this.context.fill();
};

/**
 * Draw line
 *
 * @param {Array} points
 * @param {Number} width
 * @param {String} color
 * @param {String} style
 */
Canvas.prototype.drawLine = function(points, width, color, style)
{
    var length = points.length;

    if (length > 1) {
        this.context.lineCap     = style;
        this.context.strokeStyle = color;
        this.context.lineWidth   = width;
        this.context.beginPath();
        this.context.moveTo(points[0][0], points[0][1]);

        for (var i = 1; i < length; i++) {
            this.context.lineTo(points[i][0], points[i][1]);
        }

        this.context.stroke();
    }
};

/**
 * Draw line scaled
 *
 * @param {Array} Xs
 * @param {Array} Ys
 */
Canvas.prototype.drawLineScaled = function(Xs, Ys)
{
    var length = Xs.length;

    this.context.beginPath();
    this.context.moveTo(Xs[0] * this.scale, Ys[0] * this.scale);

    for (var i = 1; i < length; i++) {
        this.context.lineTo(Xs[i] * this.scale, Ys[i] * this.scale);
    }

    this.context.stroke();
};

/**
 * Draw line scaled
 *
 * @param {Array} Xs
 * @param {Array} Ys
 * @param {Number} left
 * @param {Number} top
 */
Canvas.prototype.drawLineScaledMargin = function(Xs, Ys, left, top)
{
    var length = Xs.length;

    this.context.beginPath();
    this.context.moveTo((Xs[0] - left) * this.scale, (Ys[0] - top) * this.scale);

    for (var i = 1; i < length; i++) {
        this.context.lineTo((Xs[i] - left) * this.scale, (Ys[i] - top) * this.scale);
    }

    this.context.stroke();
};

/**
 * Draw line in camera
 *
 * @param {Camera} camera
 * @param {Array} Xs
 * @param {Array} Ys
 */
Canvas.prototype.drawLineInCamera = function(camera, Xs, Ys)
{
    var length = Xs.length;

    this.context.beginPath();
    this.context.moveTo(camera.xPosition(Xs[0]), camera.yPosition(Ys[0]));

    for (var i = 1; i < length; i++) {
        this.context.lineTo(camera.xPosition(Xs[i]), camera.yPosition(Ys[i]));
    }

    this.context.stroke();
};

/**
 * Draw full vertical line
 *
 * @param {Number} y
 */
Canvas.prototype.drawHorizontalLine = function(y)
{
    this.context.fillRect(0, y, this.element.width, 1);
};

/**
 * Draw full vertical line
 *
 * @param {Number} x
 */
Canvas.prototype.drawVerticalLine = function(x)
{
    this.context.fillRect(x , 0, 1, this.element.height);
};

/**
 * To string
 *
 * @return {String}
 */
Canvas.prototype.toString = function()
{
    return this.element.toDataURL();
};

/**
 * Round
 *
 * @param {Number} value
 *
 * @return {Number}
 */
Canvas.prototype.round = function (value)
{
    return (0.5 + value) | 0;
};

/**
 * Round float
 *
 * @param {Float} value
 * @param {Number} precision
 *
 * @return {Float}
 */
Canvas.prototype.roundFloat = function (value, precision)
{
    var coef = Math.pow(10, typeof(precision) !== 'undefined' ? precision : 2);

    return ((0.5 + value*coef) | 0)/coef;
};
