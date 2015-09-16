/**
 * Bonus Stack event handler
 */
function BonusStackHandler ()
{
    BaseHandler.call(this);
}

BonusStackHandler.prototype = Object.create(BaseHandler.prototype);
BonusStackHandler.prototype.constructor = BonusStackHandler;

/**
 * {@inheritdoc}
 */
BonusStackHandler.prototype.name = 'bonus:stack';

/**
 * Byte length
 *
 * @type {Number}
 */
BonusStackHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 2 + 2 + 2;

/**
 * Bonuses position on the sprite
 *
 * @type {Array}
 */
BonusStackHandler.prototype.durations = [
    BonusEnemyBig.prototype.duration,
    BonusEnemyFast.prototype.duration,
    BonusEnemyInverse.prototype.duration,
    BonusEnemySlow.prototype.duration,
    BonusGameClear.prototype.duration,
    BonusSelfFast.prototype.duration,
    BonusSelfMaster.prototype.duration,
    BonusSelfSlow.prototype.duration,
    BonusSelfSmall.prototype.duration,
    BonusEnemyStraightAngle.prototype.duration,
    BonusGameBorderless.prototype.duration,
    BonusAllColor.prototype.duration
];

/**
 * {@inheritdoc}
 */
BonusStackHandler.prototype.encode = function(event)
{
    var buffer    = BaseHandler.prototype.encode.call(this, event),
        cursor    = BaseHandler.prototype.byteLength,
        idView    = new Uint16Array(buffer, cursor, 1),
        bonusView = new Uint16Array(buffer, cursor += 2, 1),
        addView   = new Uint8Array(buffer, cursor += 2, 2);

    idView[0]    = event.data.id;
    bonusView[0] = event.data.bonus;
    addView[0]   = event.data.add ? 1 : 0;

    return buffer;
};

/**
 * {@inheritdoc}
 */
BonusStackHandler.prototype.decode = function (buffer)
{
    var event     = BaseHandler.prototype.decode.call(this, buffer),
        cursor    = BaseHandler.prototype.byteLength,
        idView    = new Uint16Array(buffer, cursor, 1),
        bonusView = new Uint16Array(buffer, cursor += 2, 1),
        addView   = new Uint16Array(buffer, cursor += 2, 1);

    event.data = {
        id: idView[0],
        bonus: bonusView[0],
        add: addView[0] === 1
    };

    return event;
};
