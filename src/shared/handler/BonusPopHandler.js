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
BonusPopHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 2 + 2 + 2 + 2;

/**
 * {@inheritdoc}
 */
BonusPopHandler.prototype.encode = function(event)
{
    var buffer = BaseHandler.prototype.encode.call(this, event),
        cursor = BaseHandler.prototype.byteLength;

    new Uint16Array(buffer, cursor, 1)[0] = event.data.id;
    new Uint16Array(buffer, cursor += 2, 1)[0] = this.compress(event.data.x);
    new Uint16Array(buffer, cursor += 2, 1)[0] = this.compress(event.data.y);
    new Uint16Array(buffer, cursor += 2, 1)[0] = BaseBonusManager.prototype.bonusTypes.indexOf(event.data.name);

    return buffer;
};

/**
 * {@inheritdoc}
 */
BonusPopHandler.prototype.decode = function (buffer)
{
    var event  = BaseHandler.prototype.decode.call(this, buffer),
        cursor = BaseHandler.prototype.byteLength;

    event.data = {
        id: new Uint16Array(buffer, cursor, 1)[0],
        x: this.decompress(new Uint16Array(buffer, cursor += 2, 1)[0]),
        y: this.decompress(new Uint16Array(buffer, cursor += 2, 1)[0]),
        name: BaseBonusManager.prototype.bonusTypes[new Uint16Array(buffer, cursor += 2, 1)[0]]
    };

    return event;
};
