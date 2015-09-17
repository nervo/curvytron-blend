/**
 * Simple int event handler
 */
function IntPropertyHandler (property)
{
    this.property = property;

    BasePropertyHandler.call(this);
}

IntPropertyHandler.prototype = Object.create(BasePropertyHandler.prototype);
IntPropertyHandler.prototype.constructor = IntPropertyHandler;

/**
 * {@inheritdoc}
 */
IntPropertyHandler.prototype.byteLength = BasePropertyHandler.prototype.byteLength + 2;

/**
 * {@inheritdoc}
 */
IntPropertyHandler.prototype.encode = function(event)
{
    var buffer    = BasePropertyHandler.prototype.encode.call(this, event),
        valueView = new Uint16Array(buffer, BasePropertyHandler.prototype.byteLength, 1);

    valueView[0] = event.data.value;

    return buffer;
};

/**
 * {@inheritdoc}
 */
IntPropertyHandler.prototype.decode = function (buffer)
{
    var event     = BasePropertyHandler.prototype.decode.call(this, buffer),
        valueView = new Uint16Array(buffer, BasePropertyHandler.prototype.byteLength, 1);

    event.data.value = valueView[0];

    return event;
};
