/**
 * Position event handler
 */
function PositionHandler ()
{
    BaseHandler.call(this);
}

PositionHandler.prototype = Object.create(BaseHandler.prototype);
PositionHandler.prototype.constructor = PositionHandler;

/**
 * Event name
 *
 * @type {String}
 */
PositionHandler.prototype.name = 'position';

/**
 * Byte length
 *
 * @type {Number}
 */
PositionHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 2 + 4 + 2;

/**
 * {@inheritdoc}
 */
PositionHandler.prototype.encode = function(event)
{
    var buffer       = BaseHandler.prototype.encode.call(this, event),
        cursor       = BaseHandler.prototype.byteLength,
        idView       = new Uint16Array(buffer, cursor, 1),
        positionView = new Uint16Array(buffer, cursor += 2, 2),
        angleView    = new Uint16Array(buffer, cursor += 4, 1);

    idView[0]       = event.data.id;
    positionView[0] = this.compress(event.data.x, 100);
    positionView[1] = this.compress(event.data.y, 100);
    angleView[0]    = this.compress(event.data.angle, 1000);

    return buffer;
};

/**
 * {@inheritdoc}
 */
PositionHandler.prototype.decode = function (buffer)
{
    var event        = BaseHandler.prototype.decode.call(this, buffer),
        cursor       = BaseHandler.prototype.byteLength,
        idView       = new Uint16Array(buffer, cursor, 1),
        positionView = new Uint16Array(buffer, cursor += 2, 2),
        angleView    = new Uint16Array(buffer, cursor += 4, 1);

    event.data = {
        id: idView[0],
        x: this.decompress(positionView[0], 100),
        y: this.decompress(positionView[1], 100),
        angle: this.decompress(angleView[0], 1000)
    };

    return event;
};
