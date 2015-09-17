/**
 * Simple callback handler
 */
function SimpleCallbackHandler (name)
{
    BaseHandler.call(this);

    this.name = name;
}

SimpleCallbackHandler.prototype = Object.create(CallbackHandler.prototype);
SimpleCallbackHandler.prototype.constructor = SimpleCallbackHandler;
