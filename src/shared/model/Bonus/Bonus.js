/**
 * Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function Bonus(x, y)
{
    BaseBonus.call(this, x, y);

    this.body    = null;
    this.target  = null;
    this.timeout = null;
}

Bonus.prototype = Object.create(BaseBonus.prototype);
Bonus.prototype.constructor = Bonus;

/**
 * Get body
 *
 * @return {Body}
 */
Bonus.prototype.getBody = function()
{
    if (!this.body) {
        this.body = new Body(this.x, this.y, this.radius, this.id);
    }

    return this.body;
};

/**
 * Apply bonus callback
 */
Bonus.prototype.applyTo = function(avatar, game)
{
    this.target = this.getTarget(avatar, game);
    this.setOff();
    this.on();
};

/**
 * Set off timeout
 */
Bonus.prototype.setOff = function()
{
    if (this.duration) {
        this.timeout = setTimeout(this.off, this.duration);
    }
};
