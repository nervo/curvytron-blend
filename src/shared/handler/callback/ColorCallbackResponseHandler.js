/**
 * Color event handler
 */
function ColorCallbackResponseHandler ()
{
    CallbackResponseHandler.call(this);
}

ColorCallbackResponseHandler.prototype = Object.create(CallbackResponseHandler.prototype);
ColorCallbackResponseHandler.prototype.constructor = ColorCallbackResponseHandler;

/**
 * {@inheritdoc}
 */
ColorCallbackResponseHandler.prototype.name = 'color:callback';

/**
 * {@inheritdoc}
 */
ColorCallbackResponseHandler.prototype.byteLength = CallbackResponseHandler.prototype.byteLength + 6;

/**
 * {@inheritdoc}
 */
ColorCallbackResponseHandler.prototype.encode = function(event)
{
    var buffer    = CallbackResponseHandler.prototype.encode.call(this, event),
        colorView = new Uint16Array(buffer, CallbackResponseHandler.prototype.byteLength, 3);

    colorView[0] = event.data[0];
    colorView[1] = event.data[1];
    colorView[2] = event.data[2];

    return buffer;
};

/**
 * {@inheritdoc}
 */
ColorCallbackResponseHandler.prototype.decode = function (buffer)
{
    var event     = CallbackResponseHandler.prototype.decode.call(this, buffer),
        colorView = new Uint16Array(buffer, CallbackResponseHandler.prototype.byteLength, 3);

    event.data = [
        colorView[0],
        colorView[1],
        colorView[2]
    ];

    return event;
};
