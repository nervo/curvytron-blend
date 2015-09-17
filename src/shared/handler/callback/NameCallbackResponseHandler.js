/**
 * Name event handler
 */
function NameCallbackResponseHandler ()
{
    CallbackResponseHandler.call(this);
}

NameCallbackResponseHandler.prototype = Object.create(CallbackResponseHandler.prototype);
NameCallbackResponseHandler.prototype.constructor = NameCallbackResponseHandler;

/**
 * {@inheritdoc}
 */
NameCallbackResponseHandler.prototype.name = 'name:callback';

/**
 * {@inheritdoc}
 */
NameCallbackResponseHandler.prototype.encode = function(event)
{
    var textLength = event.data.length,
        cursor     = CallbackResponseHandler.prototype.byteLength;

    this.byteLength = cursor + 2 + textLength * 2;

    var buffer = CallbackResponseHandler.prototype.encode.call(this, event);

    new Uint16Array(buffer, cursor, 1)[0] = textLength;

    var textView = new Uint16Array(buffer, cursor += 2, textLength);

    for (var i = 0; i < textLength; i++) {
        textView[i] = event.data.charCodeAt(i);
    }

    return buffer;
};

/**
 * {@inheritdoc}
 */
NameCallbackResponseHandler.prototype.decode = function (buffer)
{
    var event     = CallbackResponseHandler.prototype.decode.call(this, buffer),
        cursor    = CallbackResponseHandler.prototype.byteLength,
        countView = new Uint16Array(buffer, cursor, 1),
        textView  = new Uint16Array(buffer, cursor += 2, countView[0]);

    event.data = String.fromCharCode.apply(null, textView);

    return event;
};
