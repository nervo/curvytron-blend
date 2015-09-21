/**
 * Base monitor
 */
function BaseMonitor ()
{
    this.keys = {};
}

/**
 * Type of variable supported
 *
 * @type {Array}
 */
BaseMonitor.prototype.support = [
    'string',
    'number',
    'boolean'
];

/**
 * Set key
 *
 * @param {String} key
 * @param {Scalar} value
 */
BaseMonitor.prototype.setKey = function(key, value)
{
    if (this.isSupported(value)) {
        this.keys[key] = value;
        this.dump();
    }
};

/**
 * Set key
 *
 * @param {Object} keys
 */
BaseMonitor.prototype.setKeys = function(keys)
{
    for (var key in keys) {
        if (keys.hasOwnProperty(key) && this.isSupported(keys[key])) {
            this.keys[key] = keys[key];
        }
    }

    this.dump();
};

/**
 * Dump all keys
 */
BaseMonitor.prototype.dump = function()
{
    this.clear();

    for (var key in this.keys) {
        if (this.keys.hasOwnProperty(key)) {
            this.writeKey(key);
        }
    }
};

/**
 * Write key
 *
 * @param {string} key
 */
BaseMonitor.prototype.writeKey = function(key)
{
    this.writeLine(key + ': ' + this.keys[key]);
};

/**
 * Is value supported
 *
 * @param {Mixed} value
 *
 * @return {Boolean}
 */
BaseMonitor.prototype.isSupported = function(value)
{
    return this.support.indexOf(typeof(value)) >= 0;
};
