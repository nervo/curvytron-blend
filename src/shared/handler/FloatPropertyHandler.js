/**
 * Simple int event handler
 */
function FloatPropertyHandler (property)
{
    this.property = property;

    BasePropertyHandler.call(this);
}

FloatPropertyHandler.prototype = Object.create(BasePropertyHandler.prototype);
FloatPropertyHandler.prototype.constructor = FloatPropertyHandler;

/**
 * {@inheritdoc}
 */
FloatPropertyHandler.prototype.byteLength = BasePropertyHandler.prototype.byteLength + 2;

/**
 * {@inheritdoc}
 */
FloatPropertyHandler.prototype.encode = function(event)
{
    var buffer    = BasePropertyHandler.prototype.encode.call(this, event),
        valueView = new Uint16Array(buffer, BasePropertyHandler.prototype.byteLength, 1);

    valueView[0] = this.compress(event.data.value, 100);

    return buffer;
};

/**
 * {@inheritdoc}
 */
FloatPropertyHandler.prototype.decode = function (buffer)
{
    var event     = BasePropertyHandler.prototype.decode.call(this, buffer),
        valueView = new Uint16Array(buffer, BasePropertyHandler.prototype.byteLength, 1);

    event.data.value = this.decompress(valueView[0], 100);

    return event;
};
