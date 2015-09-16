/**
 * Binary encoder
 */
function BaseBinaryEncoder ()
{
    this.handlers = new Collection([
        new AvatarAddHandler('avatar:me'),
        new AvatarAddHandler(),
        new BonusPopHandler(),
        new BonusStackHandler(),
        new BooleanPropertyHandler('inverse'),
        new BooleanPropertyHandler('invincible'),
        new BooleanPropertyHandler('printing'),
        new BooleanPropertyHandler('turning'),
        new ColorCallbackResponseHandler(),
        new DieHandler(),
        new FloatPropertyHandler('radius'),
        new FloatPropertyHandler('velocity'),
        new MoveHandler(),
        new NameCallbackHandler(),
        new NameCallbackResponseHandler(),
        new PositionHandler(),
        new ReadyCallbackResponseHandler(),
        new SimpleCallbackHandler('color'),
        new SimpleCallbackHandler('ready'),
        new SimpleHandler('clear'),
        new SimpleHandler('end'),
        new SimpleHandler('join'),
        new SimpleHandler('start'),
        new SimpleHandler('stop'),
        new SimpleIntHandler('avatar:point'),
        new SimpleIntHandler('avatar:remove'),
        new SimpleIntHandler('bonus:clear'),
        new SimpleIntHandler('latency'),
        new SimpleIntHandler('spawn'),
        new SumUpAvatarHandler(),
        new SumUpPointHandler()
    ], 'name');

    for (var i = this.handlers.items.length - 1; i >= 0; i--) {
        this.handlers.items[i].id = i;
    }
}

/**
 * Transform an array into a Buffer
 *
 * @param {Array} events
 *
 * @return {Buffer}
 */
BaseBinaryEncoder.prototype.encode = function(events)
{
    var length     = events.length,
        buffers    = [],
        byteLength = 0;

    for (var eventBuffer, countBuffer, i = 0; i < length; i++) {
        eventBuffer = this.encodeEvent(events[i]);

        if (eventBuffer) {
            countBuffer = this.getCountBuffer(eventBuffer.byteLength);
            byteLength += countBuffer.byteLength + eventBuffer.byteLength;

            buffers.push(countBuffer);
            buffers.push(eventBuffer);
        } else {
            console.error('No encoder for event: ', events[i]);
        }
    }

    return this.merge(buffers, byteLength);
};

/**
 * Transform a Buffer into an array
 *
 * @param {Buffer} buffer
 *
 * @return {Array}
 */
BaseBinaryEncoder.prototype.decode = function(buffer)
{
    var cursor     = 0,
        byteLength = buffer.byteLength,
        events     = [],
        count, childBuffer, event;

    while (cursor < byteLength) {
        count       = new Uint16Array(buffer, cursor, 1)[0];
        cursor     += 2;
        childBuffer = buffer.slice(cursor, cursor + count);
        event       = this.decodeEvent(childBuffer);

        if (event) {
            events.push(event);
        } else {
            console.error('No decoder for event: ', events[i]);
        }

        cursor += childBuffer.byteLength;
    }

    return events;
};

/**
 * Merge buffers
 *
 * @param {Array} buffers
 * @param {Number} byteLength
 *
 * @return {ArrayBuffer}
 */
BaseBinaryEncoder.prototype.merge = function(buffers, byteLength)
{
    var length = buffers.length,
        buffer = new ArrayBuffer(byteLength),
        view   = new Uint8Array(buffer),
        cursor = 0;

    for (var childBuffer, childView, childLength, childCursor, i = 0; i < length; i++) {
        childBuffer = buffers[i];
        childView   = new Uint8Array(childBuffer);
        childLength = childBuffer.byteLength;

        for (childCursor = 0; childCursor < childLength; childCursor++) {
            view[cursor++] = childView[childCursor];
        }
    }

    return buffer;
};

/**
 * Get count buffer
 *
 * @param {Number} count
 *
 * @return {ArrayBuffer}
 */
BaseBinaryEncoder.prototype.getCountBuffer = function(count)
{
    var buffer = new ArrayBuffer(2);

    new Uint16Array(buffer, 0, 1)[0] = count;

    return buffer;
};

/**
 * Encode event
 *
 * @param {Array} event
 *
 * @return {Buffer}
 */
BaseBinaryEncoder.prototype.encodeEvent = function(event)
{
    var handler = this.handlers.getById(event.name);

    return handler ? handler.encode(event) : null;
};

/**
 * Decode event
 *
 * @param {Buffer} buffer
 *
 * @return {Array}
 */
BaseBinaryEncoder.prototype.decodeEvent = function(buffer)
{
    var code    = new Uint16Array(buffer, 0, 1)[0],
        handler = this.handlers.getByIndex(code);

    return handler ? handler.decode(buffer) : null;
};

/**
 * Get event name
 *
 * @param {Number} index
 *
 * @return {String}
 */
BaseBinaryEncoder.prototype.getEventName = function(index)
{
    return typeof(this.handlers.ids[index]) !== 'undefined' ? this.handlers.ids[index] : null;
};

/**
 * Get event code
 *
 * @param {String} name
 *
 * @return {Number}
 */
BaseBinaryEncoder.prototype.getEventCode = function(name)
{
    if (this.handlers.ids.indexOf(name) === -1) {
        throw name;
    }

    return this.handlers.ids.indexOf(name);
};
