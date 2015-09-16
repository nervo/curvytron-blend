/**
 * AvatarAdd event handler
 */
function AvatarAddHandler (name)
{
    BaseHandler.call(this);

    if (typeof(name) === 'string') {
        this.name = name;
    }
}

AvatarAddHandler.prototype = Object.create(BaseHandler.prototype);
AvatarAddHandler.prototype.constructor = AvatarAddHandler;

/**
 * {@inheritdoc}
 */
AvatarAddHandler.prototype.name = 'avatar:add';

/**
 * {@inheritdoc}
 */
AvatarAddHandler.prototype.encode = function(event)
{
    var textLength = event.data.name.length,
        cursor     = BaseHandler.prototype.byteLength;

    this.byteLength = cursor + 2 + 6 + 2 + textLength * 2;

    var buffer    = BaseHandler.prototype.encode.call(this, event),
        idView    = new Uint16Array(buffer, cursor, 1),
        colorView = new Uint16Array(buffer, cursor += 2, 3),
        countView = new Uint16Array(buffer, cursor += 6, 1),
        textView  = new Uint16Array(buffer, cursor += 2, textLength);

    idView[0]    = event.data.id;
    colorView[0] = event.data.color[0];
    colorView[1] = event.data.color[1];
    colorView[2] = event.data.color[2];
    countView[0] = textLength;

    for (var i = 0; i < textLength; i++) {
        textView[i] = event.data.name.charCodeAt(i);
    }

    return buffer;
};

/**
 * {@inheritdoc}
 */
AvatarAddHandler.prototype.decode = function (buffer)
{
    var event     = BaseHandler.prototype.decode.call(this, buffer),
        cursor    = BaseHandler.prototype.byteLength,
        idView    = new Uint16Array(buffer, cursor, 1),
        colorView = new Uint16Array(buffer, cursor += 2, 3),
        countView = new Uint16Array(buffer, cursor += 6, 1),
        textView  = new Uint16Array(buffer, cursor += 2, countView[0]);

    event.data = {
        id: idView[0],
        color: [
            colorView[0],
            colorView[1],
            colorView[2]
        ],
        name: String.fromCharCode.apply(null, textView)
    };

    return event;
};
