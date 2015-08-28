/**
 * BinaryEncoder
 */
function BinaryEncoder()
{
    BaseBinaryEncoder.call(this);
}

BinaryEncoder.prototype = Object.create(BaseBinaryEncoder.prototype);
BinaryEncoder.prototype.constructor = BinaryEncoder;

/**
 * {@inheritdoc}
 */
BinaryEncoder.prototype.encode = function(data)
{
    return new Buffer(new Uint8Array(BaseBinaryEncoder.prototype.encode.call(this, data)));
};

/**
 * {@inheritdoc}
 */
BinaryEncoder.prototype.decode = function(buffer)
{
    return BaseBinaryEncoder.prototype.decode.call(this, new Uint8Array(buffer).buffer);
};
