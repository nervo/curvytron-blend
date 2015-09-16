/**
 * Base monitor
 */
function BaseMonitor ()
{
    this.keys = {};
}

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
