/**
 * Explosion animation
 *
 * @param {Avatar} avatar
 */
function Explode(avatar)
{
    this.id        = null;
    this.particles = [];
    this.canvas    = new Canvas(this.width, this.width);
    this.created   = new Date().getTime();
    this.done      = false;

    this.end = this.end.bind(this);

    var width = this.width/2,
        gap   = this.particleTotal/2;

    this.canvas.setFill(avatar.color);
    this.canvas.drawCircle(width, width, width);

    for (var i = 1; i <= this.particleTotal; i++) {
        this.particles.push(new ExplodeParticle(
            avatar.x,
            avatar.y,
            this.randomize(avatar.velocity, 0.05),
            this.randomize(avatar.angle + this.angleVariation * (i / gap - 1), 0.01),
            this.randomize(avatar.radius, 0.3)
        ));
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
Explode.prototype.angleVariation = Math.PI / 4;

/**
 * Number of particles to generate
 *
 * @type {Number}
 */
Explode.prototype.particleTotal = 9;

/**
 * Animation duration
 *
 * @type {Number}
 */
Explode.prototype.duration = 500;

/**
 * Opacity
 *
 * @type {Number}
 */
Explode.prototype.opacity = 1.2;

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
    return this.opacity - time / this.duration;
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

    for (var particle, width, x, y, i = this.particles.length - 1; i >= 0; i--) {
        particle = this.particles[i];
        x        = particle.getX(age);
        y        = particle.getY(age);
        width    = particle.radius * camera.scale;

        if (camera.isVisible(x, y)) {
            canvas.drawImageToAt(this.canvas.element, camera.x(x), camera.y(y), width, width);
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
