/**
 * Monitor
 */
function Monitor()
{
    BaseMonitor.call(this);

    this.element = document.createElement('pre');

    this.element.style.position   = 'absolute';
    this.element.style.top        = '80px';
    this.element.style.left       = '10px';
    this.element.style.lineHeight = '1em';

    document.body.appendChild(this.element);
}

Monitor.prototype = Object.create(BaseMonitor.prototype);
Monitor.prototype.constructor = Monitor;

/**
 * Clear
 */
Monitor.prototype.clear = function()
{
    this.element.innerHTML = '';
};

/**
 * Write line
 *
 * @param {string} message
 */
Monitor.prototype.writeLine = function(message)
{
    this.element.innerHTML += message + '\n';
};
