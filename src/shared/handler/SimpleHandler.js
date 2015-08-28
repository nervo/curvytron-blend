/**
 * Simple handler
 */
function SimpleHandler (name)
{
    BaseHandler.call(this);

    this.name = name;
}

SimpleHandler.prototype = Object.create(BaseHandler.prototype);
SimpleHandler.prototype.constructor = SimpleHandler;
