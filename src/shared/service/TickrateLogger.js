/**
 * Tickrate Logger
 */
function TickrateLogger()
{
    this.interval  = null;
    this.frequency = 0;
    this.ticks     = [];

    this.log  = this.log.bind(this);
    this.tick = this.tick.bind(this);
}

/**
 * Tick
 */
TickrateLogger.prototype.tick = function (data)
{
    this.ticks.push(data);
};

/**
 * Log
 */
TickrateLogger.prototype.log = function()
{
    this.frequency    = this.ticks.length;
    this.ticks.length = 0;
};

/**
 * Start
 */
TickrateLogger.prototype.start = function()
{
    if (!this.interval) {
        this.interval = setInterval(this.log, 1000);
    }
};

/**
 * Stop
 */
TickrateLogger.prototype.stop = function()
{
    if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
    }
};
