/**
 * BonusPop event handler
 */
function BonusPopHandler ()
{
    BaseHandler.call(this);
}

BonusPopHandler.prototype = Object.create(BaseHandler.prototype);
BonusPopHandler.prototype.constructor = BonusPopHandler;

/**
 * Event name
 *
 * @type {String}
 */
BonusPopHandler.prototype.name = 'bonus:pop';

/**
 * Byte length
 *
 * @type {Number}
 */
BonusPopHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 2 + 2 + 4;

/**
 * {@inheritdoc}
 */
BonusPopHandler.prototype.encode = function(event)
{
    var buffer       = BaseHandler.prototype.encode.call(this, event),
        cursor       = BaseHandler.prototype.byteLength,
        idView       = new Uint16Array(buffer, cursor, 1),
        nameView     = new Uint8Array(buffer, cursor += 2, 2),
        positionView = new Uint16Array(buffer, cursor += 2, 2);

    idView[0]       = event.data.id;
    nameView[0]     = BaseBonusManager.prototype.bonusTypes.indexOf(event.data.name);
    positionView[0] = this.compress(event.data.x, 100);
    positionView[1] = this.compress(event.data.y, 100);

    return buffer;
};

/**
 * {@inheritdoc}
 */
BonusPopHandler.prototype.decode = function (buffer)
{
    var event        = BaseHandler.prototype.decode.call(this, buffer),
        cursor       = BaseHandler.prototype.byteLength,
        idView       = new Uint16Array(buffer, cursor, 1),
        nameView     = new Uint8Array(buffer, cursor += 2, 2),
        positionView = new Uint16Array(buffer, cursor += 2, 2);

    event.data = {
        id: idView[0],
        x: this.decompress(positionView[0], 100),
        y: this.decompress(positionView[1], 100),
        name: BaseBonusManager.prototype.bonusTypes[nameView[0]]
    };

    return event;
};
