/**
 * Die event handler
 */
function DieHandler ()
{
    BaseHandler.call(this);
}

DieHandler.prototype = Object.create(BaseHandler.prototype);
DieHandler.prototype.constructor = DieHandler;

/**
 * {@inheritdoc}
 */
DieHandler.prototype.name = 'die';

/**
 * Byte length
 *
 * @type {Number}
 */
DieHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 2 + 2;

/**
 * {@inheritdoc}
 */
DieHandler.prototype.encode = function(event)
{
    var buffer    = BaseHandler.prototype.encode.call(this, event),
        cursor    = BaseHandler.prototype.byteLength,
        idView    = new Uint16Array(buffer, cursor, 1),
        angleView = new Uint16Array(buffer, cursor += 2, 1);

    idView[0]     = event.data.id;
    angleView[0] = this.compress(event.data.angle);

    return buffer;
};

/**
 * {@inheritdoc}
 */
DieHandler.prototype.decode = function (buffer)
{
    var event     = BaseHandler.prototype.decode.call(this, buffer),
        cursor    = BaseHandler.prototype.byteLength,
        idView    = new Uint16Array(buffer, cursor, 1),
        angleView = new Uint16Array(buffer, cursor += 2, 1);

    event.data = {
        id: idView[0],
        angle: this.decompress(angleView[0])
    };

    return event;
};
