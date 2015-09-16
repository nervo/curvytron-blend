/**
 * signed float event handler
 */
function SignedIntPropertyHandler (property)
{
    this.property = property;

    BasePropertyHandler.call(this);
}

SignedIntPropertyHandler.prototype = Object.create(BasePropertyHandler.prototype);
SignedIntPropertyHandler.prototype.constructor = SignedIntPropertyHandler;

/**
 * {@inheritdoc}
 */
SignedIntPropertyHandler.prototype.byteLength = BasePropertyHandler.prototype.byteLength + 2;

/**
 * {@inheritdoc}
 */
SignedIntPropertyHandler.prototype.encode = function(event)
{
    var buffer    = BasePropertyHandler.prototype.encode.call(this, event),
        valueView = new Int16Array(buffer, BasePropertyHandler.prototype.byteLength, 1);

    valueView[0] = event.data.value;

    return buffer;
};

/**
 * {@inheritdoc}
 */
SignedIntPropertyHandler.prototype.decode = function (buffer)
{
    var event     = BasePropertyHandler.prototype.decode.call(this, buffer),
        valueView = new Int16Array(buffer, BasePropertyHandler.prototype.byteLength, 1);

    event.data.value = valueView[0];

    return event;
};
