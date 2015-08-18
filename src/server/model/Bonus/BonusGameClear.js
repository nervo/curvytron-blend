/**
 * Master Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusGameClear(x, y)
{
    BonusGame.call(this, x, y);
}

BonusGameClear.prototype = Object.create(BonusGame.prototype);
BonusGameClear.prototype.constructor = BonusGameClear;

/**
 * Duration
 *
 * @type {Number}
 */
BonusGameClear.prototype.duration = 0;

/**
 * Probability
 *
 * @type {Number}
 */
BonusGameClear.prototype.probability = 0.4;

/**
 * Apply on
 */
BonusGameClear.prototype.on = function()
{
    this.target.clearTrails();
};
