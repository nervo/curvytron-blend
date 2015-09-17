/**
 * Simple int event handler
 */
function BooleanPropertyHandler (property)
{
    this.property = property;

    BasePropertyHandler.call(this);
}

BooleanPropertyHandler.prototype = Object.create(BasePropertyHandler.prototype);
BooleanPropertyHandler.prototype.constructor = BooleanPropertyHandler;

/**
 * {@inheritdoc}
 */
BooleanPropertyHandler.prototype.byteLength = BasePropertyHandler.prototype.byteLength + 2;

/**
 * {@inheritdoc}
 */
BooleanPropertyHandler.prototype.encode = function(event)
{
    var buffer    = BasePropertyHandler.prototype.encode.call(this, event),
        valueView = new Uint8Array(buffer, BasePropertyHandler.prototype.byteLength, 2);

    valueView[0] = event.data.value ? 1 : 0;

    return buffer;
};

/**
 * {@inheritdoc}
 */
BooleanPropertyHandler.prototype.decode = function (buffer)
{
    var event     = BasePropertyHandler.prototype.decode.call(this, buffer),
        valueView = new Uint8Array(buffer, BasePropertyHandler.prototype.byteLength, 2);

    event.data.value = valueView[0] > 0;

    return event;
};
