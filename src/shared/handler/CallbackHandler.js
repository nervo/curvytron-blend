/**
 * Callback event handler
 */
function CallbackHandler ()
{
    BaseHandler.call(this);
}

CallbackHandler.prototype = Object.create(BaseHandler.prototype);
CallbackHandler.prototype.constructor = CallbackHandler;

/**
 * Event name
 *
 * @type {String}
 */
CallbackHandler.prototype.name = 'callback';

/**
 * Byte length
 *
 * @type {Number}
 */
CallbackHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 2;

/**
 * {@inheritdoc}
 */
CallbackHandler.prototype.encode = function(event)
{
    var buffer = BaseHandler.prototype.encode.call(this, event);

    new Uint16Array(buffer, BaseHandler.prototype.byteLength, 1)[0] = event.callback;

    return buffer;
};

/**
 * {@inheritdoc}
 */
CallbackHandler.prototype.decode = function (buffer)
{
    var event = BaseHandler.prototype.decode.call(this, buffer);

    event.callback = new Uint16Array(buffer, BaseHandler.prototype.byteLength, 1)[0];

    return event;
};
