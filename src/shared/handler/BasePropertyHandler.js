/**
 * Simple int event handler
 */
function BasePropertyHandler()
{
    BaseHandler.call(this);

    this.name = 'property:' + this.property;
}

BasePropertyHandler.prototype = Object.create(BaseHandler.prototype);
BasePropertyHandler.prototype.constructor = BasePropertyHandler;

/**
 * {@inheritdoc}
 */
BasePropertyHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 2;

/**
 * {@inheritdoc}
 */
BasePropertyHandler.prototype.encode = function(event)
{
    var buffer = BaseHandler.prototype.encode.call(this, event),
        idView = new Uint16Array(buffer, BaseHandler.prototype.byteLength, 1);

    idView[0] = event.data.id;

    return buffer;
};

/**
 * {@inheritdoc}
 */
BasePropertyHandler.prototype.decode = function (buffer)
{
    return {
        name: 'property',
        data: {
            property: this.property,
            id: new Uint16Array(buffer, BaseHandler.prototype.byteLength, 1)[0]
        }
    };
};
