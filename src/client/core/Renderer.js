/**
 * Game renderer
 *
 * @param {Game} game
 */
function Renderer(game)
{
    this.game       = game;
    this.camera     = new Camera({x: this.game.size/2, y: this.game.size/2}, this.game.size);
    this.canvas     = new Canvas(0, 0, document.getElementById('render'));
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
    var now             = new Date().getTime(),
        avatars         = [],
        subjectIsPlayer = this.camera.subject instanceof Avatar,
        i, points, avatar, bonus, trail;

    if (subjectIsPlayer) {
        this.updateAvatar(this.camera.subject, now);
        avatars.push(this.camera.subject);
    }

    this.camera.updateScene();
    this.camera.updateMap();
    this.drawMap();

    for (i = this.game.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.game.avatars.items[i];
        if ((!subjectIsPlayer || avatar.id !== this.camera.subject.id) && (avatar.alive || avatar.changed)) {
            if (this.camera.isVisible(avatar.x, avatar.y)) {
                this.updateAvatar(avatar, now);
                avatars.push(avatar);
            }
        }
    }

    var x = this.camera.x(0),
        y = this.camera.y(0);

    this.cleanBorder();
    this.canvas.drawImageTo(this.map.element, x, y);

    for (i = this.game.trails.items.length - 1; i >= 0; i--) {
        this.drawTrail(this.game.trails.items[i]);
    }

    for (i = this.game.bonusManager.bonuses.items.length - 1; i >= 0; i--) {
        this.drawBonus(this.game.bonusManager.bonuses.items[i]);
    }

    for (i = avatars.length - 1; i >= 0; i--) {
        this.drawAvatar(avatars[i]);
    }

    if (!this.animations.isEmpty()) {
        var animation;

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
 */
Renderer.prototype.cleanBorder = function()
{
    var left = this.camera.getMapLeft(),
        top  = this.camera.getMapTop();

    if (left) {
        this.canvas.clearZone(0, 0, left, this.canvas.element.height);
    } else {
        var right = this.camera.getMapRight();

        if (right) {
            this.canvas.clearZone(this.canvas.element.width - right, 0, right, this.canvas.element.height);
        }
    }

    if (top) {
        this.canvas.clearZone(0, 0, this.canvas.element.width, top);
    } else {
        var bottom = this.camera.getMapBottom();

        if (bottom) {
            this.canvas.clearZone(0, this.canvas.element.height - bottom, this.canvas.element.width, bottom);
        }
    }
};

/**
 * Update avatar
 *
 * @param {Avatar} avatar
 * @param {Number} now
 */
Renderer.prototype.updateAvatar = function(avatar, now)
{
    if (avatar.alive) {
        avatar.update(now);

        if (avatar.printing) {
            this.game.getTrail(avatar.id, avatar.radius, avatar.color)
                .current.setHead(avatar.x, avatar.y);
        }
    }
};

/**
 * Draw tail
 *
 * @param {Trail} trail
 */
Renderer.prototype.drawTrail = function(trail)
{
    if (trail.isEmpty()) {
        return;
    }

    for (var segment, i = trail.segments.length - 1; i >= 0; i--) {
        segment = trail.segments[i];

        if (this.camera.isBoxVisible(segment.left, segment.right, segment.top, segment.bottom)) {
            this.canvas.drawImageTo(
                segment.draw(this.camera.scale),
                this.camera.x(segment.left),
                this.camera.y(segment.top)
            );
        }
    }
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
