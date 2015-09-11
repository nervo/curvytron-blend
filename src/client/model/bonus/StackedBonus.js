/**
 * Stacked Bonus (for display in avatar's bonus stack)
 *
 * @param {Number} id
 * @param {String} type
 */
function StackedBonus(id, type)
{
    EventEmitter.call(this);

    this.id       = id;
    this.duration = this.durations[type];
    this.asset    = this.assets[type];
    this.changed  = true;

    this.setEnding     = this.setEnding.bind(this);
    this.toggleOpacity = this.toggleOpacity.bind(this);
}

StackedBonus.prototype = Object.create(EventEmitter.prototype);
StackedBonus.prototype.constructor = StackedBonus;

/**
 * Durations
 *
 * @type {Object}
 */
StackedBonus.prototype.durations = {
    BonusEnemyBig: BonusEnemyBig.prototype.duration,
    BonusEnemyFast: BonusEnemyFast.prototype.duration,
    BonusEnemyInverse: BonusEnemyInverse.prototype.duration,
    BonusEnemySlow: BonusEnemySlow.prototype.duration,
    BonusGameClear: BonusGameClear.prototype.duration,
    BonusSelfFast: BonusSelfFast.prototype.duration,
    BonusSelfMaster: BonusSelfMaster.prototype.duration,
    BonusSelfSlow: BonusSelfSlow.prototype.duration,
    BonusSelfSmall: BonusSelfSmall.prototype.duration,
    BonusEnemyStraightAngle: BonusEnemyStraightAngle.prototype.duration,
    BonusGameBorderless: BonusGameBorderless.prototype.duration,
    BonusAllColor: BonusAllColor.prototype.duration
};

/**
 * Assets
 *
 * @type {Object}
 */
StackedBonus.prototype.assets = BonusManager.prototype.assets;

/**
 * Opacity
 *
 * @type {Number}
 */
StackedBonus.prototype.opacity = 1;

/**
 * Clear
 */
StackedBonus.prototype.clear = function()
{
    if (this.timeout) {
        this.timeout = clearInterval(this.timeout);
    }
};

/**
 * Set ending timeout
 *
 * @param {Number} warning
 */
StackedBonus.prototype.setEndingTimeout = function(warning)
{
    this.timeout = setTimeout(this.setEnding, this.duration - warning);
};

/**
 * Set ending
 */
StackedBonus.prototype.setEnding = function()
{
    this.timeout = setInterval(this.toggleOpacity, 100);
};

/**
 * Toggle opacity
 */
StackedBonus.prototype.toggleOpacity = function()
{
    this.opacity = this.opacity === 1 ? 0.5 : 1;
    this.changed = true;
    this.emit('change');
};
