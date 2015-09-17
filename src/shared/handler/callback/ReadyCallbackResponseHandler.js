/**
 * Ready event handler
 */
function ReadyCallbackResponseHandler ()
{
    CallbackResponseHandler.call(this);
}

ReadyCallbackResponseHandler.prototype = Object.create(CallbackResponseHandler.prototype);
ReadyCallbackResponseHandler.prototype.constructor = ReadyCallbackResponseHandler;

/**
 * {@inheritdoc}
 */
ReadyCallbackResponseHandler.prototype.name = 'ready:callback';

/**
 * {@inheritdoc}
 */
ReadyCallbackResponseHandler.prototype.encode = function(event)
{
    var textLength = event.data.name.length,
        cursor     = CallbackResponseHandler.prototype.byteLength;

    this.byteLength = cursor + 6 + 2 + textLength * 2;

    var buffer    = CallbackResponseHandler.prototype.encode.call(this, event),
        colorView = new Uint16Array(buffer, cursor, 3);

    colorView[0] = event.data.color[0];
    colorView[1] = event.data.color[1];
    colorView[2] = event.data.color[2];

    new Uint16Array(buffer, cursor += 6, 1)[0] = textLength;

    var textView = new Uint16Array(buffer, cursor += 2, textLength);

    for (var i = 0; i < textLength; i++) {
        textView[i] = event.data.name.charCodeAt(i);
    }

    return buffer;
};

/**
 * {@inheritdoc}
 */
ReadyCallbackResponseHandler.prototype.decode = function (buffer)
{
    var event     = CallbackResponseHandler.prototype.decode.call(this, buffer),
        cursor    = CallbackResponseHandler.prototype.byteLength,
        colorView = new Uint16Array(buffer, cursor, 3),
        countView = new Uint16Array(buffer, cursor += 6, 1),
        textView  = new Uint16Array(buffer, cursor += 2, countView[0]);

    event.data = {
        color: [
            colorView[0],
            colorView[1],
            colorView[2]
        ],
        name: String.fromCharCode.apply(null, textView)
    };

    return event;
};
