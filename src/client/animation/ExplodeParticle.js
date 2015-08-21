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
    this.x         = x;
    this.y         = y;
    this.velocityX = Math.cos(angle) * velocity / 1000;
    this.velocityY = Math.sin(angle) * velocity / 1000;
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
    return this.x + this.velocityX * time;
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
    return this.y + this.velocityY * time;
};
