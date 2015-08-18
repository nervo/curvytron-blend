/**
 * Game
 */
function Game()
{
    BaseGame.call(this);

    this.render     = document.getElementById('render');
    this.canvas     = new Canvas(0, 0, document.getElementById('game'));
    this.background = new Canvas(0, 0, document.getElementById('background'));
    this.effect     = new Canvas(0, 0, document.getElementById('effect'));
    this.animations = [];

    this.onResize = this.onResize.bind(this);
    this.onDie    = this.onDie.bind(this);

    window.addEventListener('error', this.stop);
    window.addEventListener('resize', this.onResize);

    this.onResize();
}

Game.prototype = Object.create(BaseGame.prototype);
Game.prototype.constructor = Game;

/**
 * Margin between player an bonus stack
 *
 * @type {Number}
 */
Game.prototype.stackMargin = 15;

/**
 * Background color
 *
 * @type {String}
 */
Game.prototype.backgroundColor = '#222222';

/**
 * Add an avatar to the game
 *
 * @param {Avatar} avatar
 */
Game.prototype.addAvatar = function(avatar)
{
    if (BaseGame.prototype.addAvatar.call(this, avatar)) {
        avatar.on('die', this.onDie);
    }
};

/**
 * Remove an avatar to the game
 *
 * @param {Avatar} avatar
 */
Game.prototype.removeAvatar = function(avatar)
{
    if (BaseGame.prototype.removeAvatar.call(this, avatar)) {
        avatar.off('die', this.onDie);
    }
};

/**
 * Get new frame
 */
Game.prototype.newFrame = function()
{
    this.frame = window.requestAnimationFrame(this.loop);
};

/**
 * Clear frame
 */
Game.prototype.clearFrame = function()
{
    window.cancelAnimationFrame(this.frame);
    this.frame = null;
};

/**
 * On frame
 *
 * @param {Number} step
 */
Game.prototype.onFrame = function(step)
{
    this.draw(step);
};

/**
 * On start
 */
Game.prototype.onStart = function()
{
    this.effect.clear();
    BaseGame.prototype.onStart.call(this);
};

/**
 * Clear trails
 */
Game.prototype.clearTrails = function()
{
    this.clearBackground();
};

/**
 * End
 */
Game.prototype.end = function()
{
    if (BaseGame.prototype.end.call(this)) {
        window.removeEventListener('error', this.stop);
        window.removeEventListener('resize', this.onResize);
    }
};

/**
 * Update size
 */
Game.prototype.setSize = function()
{
    BaseGame.prototype.setSize.call(this);
    this.onResize();
};

/**
 * Draw
 *
 * @param {Number} step
 */
Game.prototype.draw = function(step)
{
    for (var animation, a = this.animations.length - 1; a >= 0; a--) {
        animation = this.animations[a];
        animation.draw();
        if (animation.done && animation.cleared) {
            this.animations.splice(a, 1);
        }
    }

    for (var avatar, i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        if (avatar.alive || avatar.changed) {
            this.clearAvatar(avatar);
            this.clearBonusStack(avatar);
        }
    }

    for (avatar, i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        if (avatar.alive || avatar.changed) {
            if (avatar.alive) {
                avatar.update(this.frame ? step : 0);
            }

            this.drawTail(avatar);
            this.drawAvatar(avatar);
            this.drawBonusStack(avatar);

            /*if (!this.frame && avatar.local) {
                this.drawArrow(avatar);
            }*/
        }
    }

    this.bonusManager.draw();
};

/**
 * Draw tail
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawTail = function(avatar)
{
    var points = avatar.trail.getLastSegment();

    if (points) {
        this.background.drawLineScaled(points, avatar.width, avatar.color, 'round');
    }
};

/**
 * Draw avatar
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawAvatar = function(avatar)
{
    this.canvas.drawImageTo(avatar.canvas.element, avatar.startX, avatar.startY);
    avatar.clearX     = avatar.startX;
    avatar.clearY     = avatar.startY;
    avatar.clearWidth = avatar.canvas.element.width;
};

/**
 * Clear bonus from the canvas
 *
 * @param {Bonus} bonus
 */
Game.prototype.clearAvatar = function(avatar)
{
    this.canvas.clearZone(avatar.clearX, avatar.clearY, avatar.clearWidth, avatar.clearWidth);
};

/**
 * Clear bonus stack
 *
 * @param {Avatar} avatar
 */
Game.prototype.clearBonusStack = function(avatar)
{
    if (avatar.bonusStack.lastWidth) {
        this.canvas.clearZone(
            avatar.startX + this.stackMargin,
            avatar.startY + this.stackMargin,
            avatar.bonusStack.lastWidth,
            avatar.bonusStack.lastHeight
        );
    }
};


/**
 * Draw bonus stack
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawBonusStack = function(avatar)
{
    if (avatar.hasBonus()) {
        avatar.bonusStack.lastWidth  = avatar.bonusStack.canvas.element.width;
        avatar.bonusStack.lastHeight = avatar.bonusStack.canvas.element.height;

        this.canvas.drawImageTo(
            avatar.bonusStack.canvas.element,
            avatar.startX + this.stackMargin,
            avatar.startY + this.stackMargin
        );
    }
};

/**
 * Draw arrow
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawArrow = function(avatar)
{
    this.effect.drawImageScaledAngle(avatar.arrow.element, avatar.x - 5, avatar.y - 5, 10, 10, avatar.angle);
};

/**
 * Clear background with color
 */
Game.prototype.clearBackground = function()
{
    this.background.color(this.backgroundColor);
};

/**
 * On die
 *
 * @param {Event} event
 */
Game.prototype.onDie = function(event)
{
    this.animations.push(new Explode(event.detail, this.effect));
};

/**
 * On resize
 */
Game.prototype.onResize = function()
{
    var w=window,d=document,e=d.documentElement,g=document.body,x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

    var width = Math.min(x /*- this.gameInfos.clientWidth - 8*/, y/* - 8*/),
        scale = width / this.size,
        avatar;

    this.render.style.width  = (width/* + 8*/) + 'px';
    this.render.style.height = (width/* + 8*/) + 'px';
    this.canvas.setDimension(width, width, scale);
    this.effect.setDimension(width, width, scale);
    this.background.setDimension(width, width, scale, true);
    this.bonusManager.setDimension(width, scale);

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        avatar.setScale(scale);

        if (typeof(avatar.input) !== 'undefined') {
            avatar.input.setWidth(x);
        }
    }
};
