/**
 * Name event handler
 */
function NameCallbackHandler ()
{
    CallbackHandler.call(this);
}

NameCallbackHandler.prototype = Object.create(CallbackHandler.prototype);
NameCallbackHandler.prototype.constructor = NameCallbackHandler;

/**
 * {@inheritdoc}
 */
NameCallbackHandler.prototype.name = 'name';

/**
 * {@inheritdoc}
 */
NameCallbackHandler.prototype.encode = function(event)
{
    var textLength = event.data.length,
        cursor     = CallbackHandler.prototype.byteLength;

    this.byteLength = cursor + 2 + textLength * 2;

    var buffer = CallbackHandler.prototype.encode.call(this, event);

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
NameCallbackHandler.prototype.decode = function (buffer)
{
    var event     = CallbackHandler.prototype.decode.call(this, buffer),
        cursor    = CallbackHandler.prototype.byteLength,
        countView = new Uint16Array(buffer, cursor, 1),
        textView  = new Uint16Array(buffer, cursor += 2, countView[0]);

    event.data = String.fromCharCode.apply(null, textView);

    return event;
};
