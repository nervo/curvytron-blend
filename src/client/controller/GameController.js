/**
 * Game controller
 */
function GameController ()
{
    this.repository = new GameRepository(this.controls);
    this.container  = document.body;
    this.controls   = document.getElementsByClassName('controller');
    this.input      = null;

    console.log(this.controls, this.controls[0].classList);

    this.onMove  = this.onMove.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop  = this.onStop.bind(this);

    this.repository.on('start', this.onStart);
    this.repository.on('stop', this.onStop);
}

/**
 * On connection
 */
GameController.prototype.onStart = function()
{
    document.body.className = 'connected';

    this.input = new PlayerInput();
    this.input.on('move', this.onMove);
};

/**
 * On stop
 */
GameController.prototype.onStop = function()
{
    this.container.className = 'disconnected';

    this.input.off('move', this.onMove);
    this.input.detachEvents();
    this.input = null;
};

/**
 * On move
 *
 * @param {Event} event
 */
GameController.prototype.onMove = function(event)
{
    this.repository.move(event.detail ? event.detail : 0);

    for (var i = this.input.active.length - 1; i >= 0; i--) {
        this.controls[i].classList.toggle('active', this.input.active[i]);
    }
};
