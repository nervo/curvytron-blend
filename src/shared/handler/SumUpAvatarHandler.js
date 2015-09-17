/**
 * SumUpAvatar event handler
 */
function SumUpAvatarHandler ()
{
    BaseHandler.call(this);
}

SumUpAvatarHandler.prototype = Object.create(BaseHandler.prototype);
SumUpAvatarHandler.prototype.constructor = SumUpAvatarHandler;

/**
 * {@inheritdoc}
 */
SumUpAvatarHandler.prototype.name = 'sumup:avatar';

/**
 * {@inheritdoc}
 */
SumUpAvatarHandler.prototype.encode = function(event)
{
    var textLength = event.data.name.length,
        cursor     = BaseHandler.prototype.byteLength;

    this.byteLength = cursor + 2 + 4 + 6 + 2 + 2 + 2 + 2 + 4 + 2 + textLength * 2;

    var buffer       = BaseHandler.prototype.encode.call(this, event),
        idView       = new Uint16Array(buffer, cursor, 1),
        positionView = new Uint16Array(buffer, cursor += 2, 2),
        colorView    = new Uint16Array(buffer, cursor += 4, 3),
        angleView    = new Uint16Array(buffer, cursor += 6, 1),
        velocityView = new Uint16Array(buffer, cursor += 2, 1),
        radiusView   = new Uint16Array(buffer, cursor += 2, 1),
        moveView     = new Int16Array(buffer, cursor += 2, 1),
        statusView   = new Uint8Array(buffer, cursor += 2, 4),
        countView    = new Uint16Array(buffer, cursor += 4, 1),
        nameView     = new Uint16Array(buffer, cursor += 2, textLength);

    idView[0]       = event.data.id;
    positionView[0] = this.compress(event.data.x);
    positionView[1] = this.compress(event.data.y);
    colorView[0]    = event.data.color[0];
    colorView[1]    = event.data.color[1];
    colorView[2]    = event.data.color[2];
    angleView[0]    = this.compress(event.data.angle);
    velocityView[0] = this.compress(event.data.velocity);
    radiusView[0]   = this.compress(event.data.radius);
    moveView[0]     = event.data.move;
    statusView[0]   = event.data.alive ? 1 : 0;
    statusView[1]   = event.data.printing ? 1 : 0;
    statusView[2]   = event.data.invincible ? 1 : 0;
    statusView[3]   = event.data.inverse ? 1 : 0;
    countView[0]    = textLength;

    for (var i = 0; i < textLength; i++) {
        nameView[i] = event.data.name.charCodeAt(i);
    }

    return buffer;
};

/**
 * {@inheritdoc}
 */
SumUpAvatarHandler.prototype.decode = function (buffer)
{
    var event        = BaseHandler.prototype.decode.call(this, buffer),
        cursor       = BaseHandler.prototype.byteLength,
        idView       = new Uint16Array(buffer, cursor, 1),
        positionView = new Uint16Array(buffer, cursor += 2, 2),
        colorView    = new Uint16Array(buffer, cursor += 4, 3),
        angleView    = new Uint16Array(buffer, cursor += 6, 1),
        velocityView = new Uint16Array(buffer, cursor += 2, 1),
        radiusView   = new Uint16Array(buffer, cursor += 2, 1),
        moveView     = new Int16Array(buffer, cursor += 2, 1),
        statusView   = new Uint8Array(buffer, cursor += 2, 4),
        countView    = new Uint16Array(buffer, cursor += 4, 1),
        nameView     = new Uint16Array(buffer, cursor += 2, countView[0]);

    event.data = {
        id: idView[0],
        x: this.decompress(positionView[0]),
        y: this.decompress(positionView[1]),
        color: [colorView[0], colorView[1], colorView[2]],
        angle: this.decompress(angleView[0]),
        velocity: this.decompress(velocityView[0]),
        radius: this.decompress(radiusView[0]),
        move: moveView[0],
        alive: statusView[0] === 1,
        printing: statusView[2] === 1,
        invincible: statusView[3] === 1,
        inverse: statusView[4] === 1,
        name: String.fromCharCode.apply(null, nameView)
    };

    return event;
};

