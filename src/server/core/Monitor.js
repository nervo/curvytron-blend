/**
 * Monitor
 */
function Monitor()
{
    BaseMonitor.call(this);
}

Monitor.prototype = Object.create(BaseMonitor.prototype);
Monitor.prototype.constructor = Monitor;

/**
 * Clear
 */
Monitor.prototype.clear = function()
{
    process.stdout.write('\u001B[2J\u001B[0;0f');
};

/**
 * Write line
 *
 * @param {string} message
 */
Monitor.prototype.writeLine = function(message)
{
    process.stdout.write(message + '\n');
};
