/**
 * Explosion animation
 *
 * @param {Avatar} avatar
 * @param {Number} scale
 */
function Explode(avatar, scale)
{
    this.id        = null;
    this.particles = new Array(this.particleTotal);
    this.canvas    = new Canvas(this.width, this.width);
    this.created   = new Date().getTime();
    this.scale     = scale;
    this.done      = false;

    this.end = this.end.bind(this);

    var width = this.width/2;

    this.canvas.drawCircle(width, width, width, avatar.color);

    for (var i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i] = new ExplodeParticle(
            avatar.x * this.scale,
            avatar.y * this.scale,
            this.randomize(avatar.velocity / 750 * this.scale, 0.1),
            avatar.angle + this.angleVariation * (Math.random() * 2 - 1),
            Canvas.prototype.round(this.randomize(avatar.radius, 0.5) * this.scale)
        );
    }

    setTimeout(this.end, this.duration);
}

/**
 * Canvas width
 *
 * @type {Number}
 */
Explode.prototype.width = 10;

/**
 * Angle variation
 *
 * @type {Float}
 */
Explode.prototype.angleVariation = Math.PI / 8;

/**
 * Number of particles to generate
 *
 * @type {Number}
 */
Explode.prototype.particleTotal = 5;

/**
 * Animation duration
 *
 * @type {Number}
 */
Explode.prototype.duration = 500;

/**
 * Randomize value
 *
 * @param {Float} value
 * @param {Float} factor
 *
 * @return {Float}
 */
Explode.prototype.randomize = function(value, factor)
{
    return value + value * factor * (Math.random() * 2 - 1);
};

/**
 * Get opacity
 *
 * @param {Number} time
 *
 * @return {Number}
 */
Explode.prototype.getOpacity = function (time)
{
    return this.opacity * (1.4 - time / this.duration);
};

/**
 * Draw animation for the given time
 *
 * @param {Canvas} canvas
 * @param {Camera} camera
 * @param {Number} now
 */
Explode.prototype.draw = function(canvas, camera, now)
{
    var age = now - this.created;

    canvas.setOpacity(this.getOpacity(age));

    for (var particle, x, y, i = this.particles.length - 1; i >= 0; i--) {
        particle = this.particles[i];
        x        = particle.getX(age);
        y        = particle.getY(age);

        if (camera.isVisible(x, y)) {
            canvas.drawImageToAt(this.canvas.element, x, y, particle.radius, particle.radius);
        }
    }

    canvas.setOpacity(1);
};

/**
 * End animation
 */
Explode.prototype.end = function()
{
    this.done = true;
};
