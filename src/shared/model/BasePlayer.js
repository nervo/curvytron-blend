/**
 * BasePlayer
 *
 * @param {String} client
 * @param {String} name
 * @param {String} color
 */
function BasePlayer(client, name, ready)
{
    EventEmitter.call(this);

    this.client = client;
    this.name   = name;
    this.color  = this.getRandomColor();
    this.avatar = null;
}

BasePlayer.prototype = Object.create(EventEmitter.prototype);
BasePlayer.prototype.constructor = BasePlayer;

/**
 * Max length for name
 *
 * @type {Number}
 */
BasePlayer.prototype.maxLength = 25;

/**
 * Color light ratio
 *
 * @type {Number}
 */
BasePlayer.prototype.colorRatio = 0.6;

/**
 * Set name
 *
 * @param {String} name
 */
BasePlayer.prototype.setName = function(name)
{
    if (!this.validateName(name)) { return false; }

    this.name = name;

    return true;
};

/**
 * Set color
 */
BasePlayer.prototype.setColor = function()
{
    this.color = this.getRandomColor();

    return true;
};

/**
 * Get avatar
 *
 * @return {Avatar}
 */
BasePlayer.prototype.getAvatar = function()
{
    if (!this.avatar) {
        this.avatar = new Avatar(this);
    }

    return this.avatar;
};

/**
 * Reset player after a game
 */
BasePlayer.prototype.reset = function()
{
    this.avatar.destroy();
    this.avatar = null;
};

/**
 * Get random Color
 *
 * @return {String}
 */
BasePlayer.prototype.getRandomColor = function()
{
    var randomNum = function () { return Math.ceil(Math.random() * 255); },
        color     = [randomNum(), randomNum(), randomNum()];

    while (!this.validateColor(color, true)) {
        color = [randomNum(), randomNum(), randomNum()];
    }

    return color;
};

/**
 * Validate color
 *
 * @param {String} color
 *
 * @return {Boolean}
 */
BasePlayer.prototype.validateColor = function(color, yiq)
{
    if (!Array.isArray(color) || color.length !== 3) {
        return false;
    }

    for (var i = color.length - 1; i >= 0; i--) {
        if (color[i] < 0 || color[i] > 255) {
            return false;
        }
    }

    if (yiq) {
        var ratio = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000 / 255;

        return ratio > this.colorRatio;
    }

    return true;
};

/**
 * Validate name
 *
 * @param {String} name
 *
 * @return {Boolean}
 */
BasePlayer.prototype.validateName = function(name)
{
    var length = name.length;

    return length && length <= this.maxLength;
};
