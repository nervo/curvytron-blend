/**
 * Simple int event handler
 */
function SimpleIntHandler (name)
{
    BaseHandler.call(this);

    this.name = name;
}

SimpleIntHandler.prototype = Object.create(BaseHandler.prototype);
SimpleIntHandler.prototype.constructor = SimpleIntHandler;

/**
 * Byte length
 *
 * @type {Number}
 */
SimpleIntHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 2;

/**
 * {@inheritdoc}
 */
SimpleIntHandler.prototype.encode = function(event)
{
    var buffer = BaseHandler.prototype.encode.call(this, event);

    new Uint16Array(buffer, BaseHandler.prototype.byteLength, 1)[0] = event.data;

    return buffer;
};

/**
 * {@inheritdoc}
 */
SimpleIntHandler.prototype.decode = function (buffer)
{
    var event = BaseHandler.prototype.decode.call(this, buffer);

    event.data = new Uint16Array(buffer, BaseHandler.prototype.byteLength, 1)[0];

    return event;
};
