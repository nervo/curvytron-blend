/**
 * Invisibility start Bonus
 */
function BonusSelfStart()
{
    BonusSelfMaster.call(this, 0, 0);
}

BonusSelfStart.prototype = Object.create(BonusSelfMaster.prototype);
BonusSelfStart.prototype.constructor = BonusSelfStart;

/**
 * Duration
 *
 * @type {Number}
 */
BonusSelfStart.prototype.duration = 3000;
