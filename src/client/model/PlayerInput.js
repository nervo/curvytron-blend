/**
 * Player input
 */
function PlayerInput()
{
    EventEmitter.call(this);

    this.key    = false;
    this.active = [false, false];
    this.move   = 0;
    this.width  = 0;
    this.center = 0;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp   = this.onKeyUp.bind(this);
    this.onTouch   = this.onTouch.bind(this);
    this.onResize  = this.onResize.bind(this);

    this.attachEvents();
    this.onResize();
}

PlayerInput.prototype = Object.create(EventEmitter.prototype);
PlayerInput.prototype.constructor = PlayerInput;

/**
 * Key binding
 *
 * @type {Array}
 */
PlayerInput.prototype.keyBinding = [37, 39];

/**
 * Attach events
 */
PlayerInput.prototype.attachEvents = function()
{
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('touchstart', this.onTouch);
    window.addEventListener('touchend', this.onTouch);
    window.addEventListener('touchleave', this.onTouch);
    window.addEventListener('touchmove', this.onTouch);
    window.addEventListener('touchcancel', this.onTouch);
    window.addEventListener('resize', this.onResize);
};

/**
 * Detach events
 */
PlayerInput.prototype.detachEvents = function()
{
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('touchstart', this.onTouch);
    window.removeEventListener('touchend', this.onTouch);
    window.removeEventListener('touchleave', this.onTouch);
    window.removeEventListener('touchmove', this.onTouch);
    window.removeEventListener('touchcancel', this.onTouch);
    window.removeEventListener('resize', this.onResize);
};

/**
 * On Key Down
 *
 * @param {Event} e
 */
PlayerInput.prototype.onKeyDown = function(e)
{
    var index = this.keyBinding.indexOf(e.keyCode);

    if (index >= 0) {
        this.setActive(index, true);
        this.resolve();
    }
};

/**
 * On Key Down
 *
 * @param {Event} e
 */
PlayerInput.prototype.onKeyUp = function(e)
{
    var index = this.keyBinding.indexOf(e.keyCode);

    if (index >= 0) {
        this.setActive(index, false);
        this.resolve();
    }
};

/**
 * On touch start
 *
 * @param {Event} event
 */
PlayerInput.prototype.onTouch = function(event)
{
    event.preventDefault();

    var left  = false,
        right = false;

    for (var x, i = event.touches.length - 1; i >= 0; i--) {
        if (left && right) { break; }

        x = event.touches[i].screenX;

        if (x < this.center) {
            left = true;
        }

        if (x >= this.center) {
            right = true;
        }
    }

    this.setActive(0, left);
    this.setActive(1, right);
    this.resolve();
};

/**
 * Resolve
 *
 * @param {Number} index
 * @param {Boolean} pressed
 */
PlayerInput.prototype.setActive = function(index, pressed)
{
    if (this.active[index] !== pressed) {
        this.active[index] = pressed;
    }
};

/**
 * Resolve
 */
PlayerInput.prototype.resolve = function()
{
    var move = (this.active[0] !== this.active[1]) ? (this.active[0] ? -1 : 1) : false;

    if (this.move !== move) {
        this.setMove(move);
    }
};

/**
 * Set move
 *
 * @param {Boolean} move
 */
PlayerInput.prototype.setMove = function(move)
{
    this.move = move;
    this.emit('move', move);
};

/**
 * Set width
 */
PlayerInput.prototype.onResize = function()
{
    this.width  = window.innerWidth;
    this.center = this.width/2;
};
