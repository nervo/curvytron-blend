/**
 * Spawn event handler
 */
function SpawnHandler ()
{
    PositionHandler.call(this);
}

SpawnHandler.prototype = Object.create(PositionHandler.prototype);
SpawnHandler.prototype.constructor = SpawnHandler;

/**
 * Event name
 *
 * @type {String}
 */
SpawnHandler.prototype.name = 'spawn';
