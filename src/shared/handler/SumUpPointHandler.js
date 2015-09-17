/**
 * SumUpPoint event handler
 */
function SumUpPointHandler ()
{
    BaseHandler.call(this);
}

SumUpPointHandler.prototype = Object.create(BaseHandler.prototype);
SumUpPointHandler.prototype.constructor = SumUpPointHandler;

/**
 * {@inheritdoc}
 */
SumUpPointHandler.prototype.name = 'sumup:point';

/**
 * Byte length
 *
 * @type {Number}
 */
SumUpPointHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 4 + 2 + 6 + 2;

/**
 * {@inheritdoc}
 */
SumUpPointHandler.prototype.encode = function(event)
{
    var buffer       = BaseHandler.prototype.encode.call(this, event),
        cursor       = BaseHandler.prototype.byteLength,
        positionView = new Uint16Array(buffer, cursor, 2),
        radiusView   = new Uint16Array(buffer, cursor += 4, 1),
        colorView    = new Uint16Array(buffer, cursor += 2, 3),
        avatarView   = new Uint16Array(buffer, cursor += 6, 1);

    positionView[0] = this.compress(event.data.x);
    positionView[1] = this.compress(event.data.y);
    radiusView[0]   = this.compress(event.data.radius);
    colorView[0]    = event.data.color[0];
    colorView[1]    = event.data.color[1];
    colorView[2]    = event.data.color[2];
    avatarView[0]   = event.data.avatar;

    return buffer;
};

/**
 * {@inheritdoc}
 */
SumUpPointHandler.prototype.decode = function (buffer)
{
    var event        = BaseHandler.prototype.decode.call(this, buffer),
        cursor       = BaseHandler.prototype.byteLength,
        positionView = new Uint16Array(buffer, cursor, 2),
        radiusView   = new Uint16Array(buffer, cursor += 4, 1),
        colorView    = new Uint16Array(buffer, cursor += 2, 3),
        avatarView   = new Uint16Array(buffer, cursor += 6, 1);

    event.data = {
        x: this.decompress(positionView[0]),
        y: this.decompress(positionView[1]),
        radius: this.decompress(radiusView[0]),
        color: [colorView[0], colorView[1], colorView[2]],
        avatar: avatarView[0]
    };

    return event;
};

