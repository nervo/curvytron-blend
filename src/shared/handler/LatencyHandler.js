/**
 * Latency event handler
 */
function LatencyHandler ()
{
    BaseHandler.call(this);
}

LatencyHandler.prototype = Object.create(BaseHandler.prototype);
LatencyHandler.prototype.constructor = LatencyHandler;

/**
 * Event name
 *
 * @type {String}
 */
LatencyHandler.prototype.name = 'latency';

/**
 * Byte length
 *
 * @type {Number}
 */
LatencyHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 2;

/**
 * {@inheritdoc}
 */
LatencyHandler.prototype.encode = function(event)
{
    var buffer = BaseHandler.prototype.encode.call(this, event);

    new Uint16Array(buffer, BaseHandler.prototype.byteLength, 1)[0] = event.data;

    return buffer;
};

/**
 * {@inheritdoc}
 */
LatencyHandler.prototype.decode = function (buffer)
{
    var event = BaseHandler.prototype.decode.call(this, buffer);

    event.data = new Uint16Array(buffer, BaseHandler.prototype.byteLength, 1)[0];

    return event;
};
