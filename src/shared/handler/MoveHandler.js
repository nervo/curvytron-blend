/**
 * Move event handler
 */
function MoveHandler ()
{
    BaseHandler.call(this);
}

MoveHandler.prototype = Object.create(BaseHandler.prototype);
MoveHandler.prototype.constructor = MoveHandler;

/**
 * {@inheritdoc}
 */
MoveHandler.prototype.name = 'move';

/**
 * {@inheritdoc}
 */
MoveHandler.prototype.byteLength = BaseHandler.prototype.byteLength + 2;

/**
 * {@inheritdoc}
 */
MoveHandler.prototype.encode = function(event)
{
    var buffer = BaseHandler.prototype.encode.call(this, event);

    new Int16Array(buffer, BaseHandler.prototype.byteLength, 1)[0] = event.data;

    return buffer;
};

/**
 * {@inheritdoc}
 */
MoveHandler.prototype.decode = function (buffer)
{
    var event = BaseHandler.prototype.decode.call(this, buffer);

    event.data = new Int16Array(buffer, BaseHandler.prototype.byteLength, 1)[0];

    return event;
};
