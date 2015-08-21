/**
 * Explode particle
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} velocity
 * @param {Number} angle
 * @param {Number} radius
 */
function ExplodeParticle (x, y, velocity, angle, radius)
{
    this.originX   = x;
    this.originY   = y;
    this.velocityX = Math.cos(angle) * velocity;
    this.velocityY = Math.sin(angle) * velocity;
    this.radius    = radius;
}

/**
 * Get x
 *
 * @param {Number} time
 *
 * @return {Number}
 */
ExplodeParticle.prototype.getX = function (time)
{
    return Canvas.prototype.round(this.originX + this.velocityX * time);
};

/**
 * Get y
 *
 * @param {Number} time
 *
 * @return {Number}
 */
ExplodeParticle.prototype.getY = function(time)
{
    return Canvas.prototype.round(this.originY + this.velocityY * time);
};
