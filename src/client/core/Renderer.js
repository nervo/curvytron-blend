/**
 * Game renderer
 *
 * @param {Game} game
 */
function Renderer(game)
{
    this.game       = game;
    this.camera     = new Camera({x: game.size/2, y:  game.size/2});
    this.canvas     = new Canvas(0, 0, document.getElementById('render'));
    this.background = new Canvas();
    this.map        = new Canvas();
    this.animations = new Collection([], 'id', true);
    this.mapChanged = true;
    this.drawn      = false;

    this.onResize = this.onResize.bind(this);
}

/**
 * Margin between player an bonus stack
 *
 * @type {Number}
 */
Renderer.prototype.stackMargin = 15;

/**
 * Grid size
 *
 * @type {Number}
 */
Renderer.prototype.grid = 40;

/**
 * Mark map as changed
 */
Renderer.prototype.setMapChanged = function()
{
    this.mapChanged = true;
};

/**
 * Create explosion
 *
 * @param {Avatar} avatar
 */
Renderer.prototype.explode = function(avatar)
{
    this.animations.add(new Explode(avatar));
};

/**
 * On resize
 */
Renderer.prototype.onResize = function()
{
    var width     = window.innerWidth,
        height    = window.innerHeight,
        reference = Math.min(width, height),
        scale     = reference / (this.game.size / this.camera.zoom),
        zoom      = reference * this.camera.zoom;

    this.camera.setDimension(width, height, scale);
    this.canvas.setDimension(width, height, scale);
    this.background.setDimensionWithContent(zoom, zoom, scale);
    this.map.setDimensionWithContent(zoom, zoom, scale);

    for (var i = this.game.avatars.items.length - 1; i >= 0; i--) {
        this.setAvatarScale(this.game.avatars.items[i]);
    }

    this.mapChanged = true;
};

/**
 * Set avatar scale
 *
 * @param {Avatar} avatar
 */
Renderer.prototype.setAvatarScale = function(avatar)
{
    avatar.setScale(this.canvas.scale);
};

/**
 * Draw
 *
 * @param {Number} step
 */
Renderer.prototype.draw = function(step)
{
    var avatars         = [],
        subjectIsPlayer = this.camera.subject instanceof Avatar,
        i, points, avatar, bonus, trail;

    if (subjectIsPlayer) {
        this.updateAvatar(this.camera.subject, step);
        avatars.push(this.camera.subject);
    }

    this.camera.updateScene();
    this.drawMap();

    for (i = this.game.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.game.avatars.items[i];
        if ((!subjectIsPlayer || avatar.id !== this.camera.subject.id) && (avatar.alive || avatar.changed)) {
            this.updateAvatar(avatar, step);
            if (this.camera.isVisible(avatar.x, avatar.y)) {
                avatars.push(avatar);
            }
        }
    }

    for (i = this.game.trails.items.length - 1; i >= 0; i--) {
        trail  = this.game.trails.items[i];
        points = trail.getLastSegment();

        if (points) {
            this.drawTrail(points, trail.width, trail.color);
        } else {
            this.game.trails.remove(trail);
        }
    }

    var x      = this.canvas.round(this.camera.xMin * this.camera.scale),
        y      = this.canvas.round(this.camera.yMin * this.camera.scale),
        width  = this.camera.width,
        height = this.camera.height;

    this.cleanBorder(x, y);
    this.canvas.drawImageSizeToAt(this.map.element, x, y, width, height, 0, 0, width, height);
    this.canvas.drawImageSizeToAt(this.background.element, x, y, width, height, 0, 0, width, height);

    for (i = this.game.bonusManager.bonuses.items.length - 1; i >= 0; i--) {
        this.drawBonus(this.game.bonusManager.bonuses.items[i]);
    }

    for (i = avatars.length - 1; i >= 0; i--) {
        this.drawAvatar(avatars[i]);
    }

    if (!this.animations.isEmpty()) {
        var now = new Date().getTime(), animation;

        for (i = this.animations.items.length - 1; i >= 0; i--) {
            animation = this.animations.items[i];
            if (animation.done) {
                this.animations.remove(animation);
            } else {
                this.drawAnimation(now, animation);
            }
        }
    }
};

/**
 * Clean map border
 *
 * @param {Number} x
 * @param {Number} y
 */
Renderer.prototype.cleanBorder = function(x, y)
{
    if (x < 0) {
        this.canvas.clearZone(0, 0, -x, this.canvas.element.height);
    } else if (x > this.game.size - this.camera.scaleWidth) {
        var cleanX = this.camera.x(this.game.size);
        this.canvas.clearZone(cleanX, 0, this.canvas.element.width - cleanX, this.canvas.element.height);
    }

    if (y < 0) {
        this.canvas.clearZone(0, 0, this.canvas.element.width, -y);
    } else if (y > this.game.size - this.camera.scaleHeight) {
        var cleanY = this.camera.y(this.game.size);

        this.canvas.clearZone(0, cleanY, this.canvas.element.width, this.canvas.element.height - cleanY);
    }
};

/**
 * Update avatar
 *
 * @param {Avatar} avatar
 * @param {Number} step
 */
Renderer.prototype.updateAvatar = function(avatar, step)
{
    if (avatar.alive) {
        avatar.update(this.frame ? step : 0);
    }

    var points = avatar.trail.getLastSegment();

    if (points) {
        this.drawTrail(points, avatar.width, avatar.color);
    }
};

/**
 * Draw tail
 *
 * @param {Avatar} avatar
 */
Renderer.prototype.drawTrail = function(points, width, color)
{
    this.background.drawLineScaled(points, width, color, 'round');
};

/**
 * Draw avatar
 *
 * @param {Avatar} avatar
 */
Renderer.prototype.drawAvatar = function(avatar)
{
    var x = this.camera.x(avatar.x) - avatar.canvas.element.width/2,
        y = this.camera.y(avatar.y) - avatar.canvas.element.height/2;

    this.canvas.drawImageTo(avatar.canvas.element, x ,y);

    if (avatar.hasBonus()) {
        this.canvas.drawImageTo(avatar.bonusStack.canvas.element, x + this.stackMargin, y + this.stackMargin);
    }
};

/**
 * Draw bonus
 *
 * @param {Bonus} bonus
 */
Renderer.prototype.drawBonus = function(bonus)
{
    if (!this.camera.isVisible(bonus.x, bonus.y)) {
        return;
    }

    bonus.update(this.camera.scale);
    this.canvas.drawImageToAt(
        bonus.asset,
        this.camera.x(bonus.drawX),
        this.camera.y(bonus.drawY),
        bonus.drawWidth,
        bonus.drawWidth
    );
};

/**
 * Draw map
 */
Renderer.prototype.drawMap = function()
{
    if (this.mapChanged) {
        this.map.color('#041428');
        this.map.context.fillStyle = '#082850';

        var step = Math.round(this.map.element.width / this.grid);

        for (var i = 0; i < this.grid; i++) {
            this.map.drawVerticalLine(i * step);
            this.map.drawHorizontalLine(i * step);
        }

        this.map.drawVerticalLine(this.map.element.width - 1);
        this.map.drawHorizontalLine(this.map.element.height - 1);
        this.mapChanged = false;
    }

    return this.map.element;
};

/**
 * Draw animation
 *
 * @param {Animation} animation
 */
Renderer.prototype.drawAnimation = function(now, animation)
{
    animation.draw(this.canvas, this.camera, now);
};

/**
 * Draw arrow
 *
 * @param {Avatar} avatar
 */
Renderer.prototype.drawArrow = function(avatar)
{
    this.effect.drawImageScaledAngle(avatar.arrow.element, avatar.x - 5, avatar.y - 5, 10, 10, avatar.angle);
};

/**
 * Clear background with color
 */
Renderer.prototype.clearBackground = function()
{
    this.background.clear();
};
