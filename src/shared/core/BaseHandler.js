
function BaseHandler ()
{
    this.id = null;
}

/**
 * Buffer byte length
 *
 * @type {Number}
 */
BaseHandler.prototype.byteLength = 2;

/**
 * Encode
 *
 * @param {Array} event
 *
 * @return {Buffer}
 */
BaseHandler.prototype.encode = function(event)
{
    var buffer = new ArrayBuffer(this.byteLength);

    new Uint16Array(buffer, 0, 1)[0] = this.id;

    return buffer;
};

/**
 * Decode
 *
 * @param {Buffer} buffer
 *
 * @return {Array}
 */
BaseHandler.prototype.decode = function (buffer)
{
    return {name: this.name};
};


/**
 * Compress a float into an integer
 *
 * @param {Float} value
 *
 * @return {Integer}
 */
BaseHandler.prototype.compress = function(value, precision)
{
    return (0.5 + value * precision) | 0;
};

/**
 * Decompress an integer into an float
 *
 * @param {Integer} value
 *
 * @return {Float}
 */
BaseHandler.prototype.decompress = function(value, precision)
{
    return value / precision;
};
