/**
 * Color event handler
 */
function CallbackResponseHandler ()
{
    BaseHandler.call(this);
}

CallbackResponseHandler.prototype = Object.create(BaseHandler.prototype);
CallbackResponseHandler.prototype.constructor = CallbackResponseHandler;

/**
 * {@inheritdoc}
 */
CallbackResponseHandler.prototype.name = ':callback';

/**
 * {@inheritdoc}
 */
CallbackResponseHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 2;

/**
 * {@inheritdoc}
 */
CallbackResponseHandler.prototype.encode = function(event)
{
    var buffer = BaseHandler.prototype.encode.call(this, event);

    new Uint16Array(buffer, BaseHandler.prototype.byteLength, 1)[0] = event.id;

    return buffer;
};

/**
 * {@inheritdoc}
 */
CallbackResponseHandler.prototype.decode = function (buffer)
{
    var event = BaseHandler.prototype.decode.call(this, buffer);

    event.id = new Uint16Array(buffer, BaseHandler.prototype.byteLength, 1)[0];

    return event;
};
