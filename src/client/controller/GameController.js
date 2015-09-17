/**
 * Game controller
 */
function GameController ()
{
    this.repository = new GameRepository(this.controls);
    this.container  = document.body;
    this.controls   = document.getElementsByClassName('controller');
    this.profile    = new Profile();
    this.input      = null;

    this.onReady = this.onReady.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop  = this.onStop.bind(this);
    this.onPlay  = this.onPlay.bind(this);
    this.onJoin  = this.onJoin.bind(this);
    this.onMove  = this.onMove.bind(this);
    this.onName  = this.onName.bind(this);
    this.onColor = this.onColor.bind(this);

    this.repository.on('start', this.onStart);
    this.repository.on('stop', this.onStop);
    this.repository.on('ready', this.onReady);
    this.repository.on('play', this.onPlay);
    this.profile.on('name', this.onName);
    this.profile.on('color', this.onColor);
    this.profile.on('join', this.onJoin);
}

/**
 * On connection
 */
GameController.prototype.onStart = function()
{
    this.container.classList.toggle('connected', true);
};

/**
 * On ready
 *
 * @param {Event} event
 */
GameController.prototype.onReady = function(event)
{
    this.container.classList.toggle('lobby', true);
    this.profile.setName(event.detail.name);
    this.profile.setColor(event.detail.color);
};

/**
 * On stop
 */
GameController.prototype.onStop = function()
{
    this.container.classList.toggle('error', true);
    this.container.classList.toggle('connected', false);

    if (this.input) {
        this.input.off('move', this.onMove);
        this.input.detachEvents();
        this.input = null;
    }
};

/**
 * On play
 *
 * @param {Event} event
 */
GameController.prototype.onPlay = function(event)
{
    this.input = new PlayerInput();
    this.input.on('move', this.onMove);

    this.container.classList.toggle('lobby', false);
    this.container.classList.toggle('game', true);
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

/**
 * On name
 *
 * @param {Event} event
 */
GameController.prototype.onName = function(event)
{
    this.repository.setName(event.detail, this.profile.setName);
};

/**
 * On color
 *
 * @param {Event} event
 */
GameController.prototype.onColor = function(event)
{
    this.repository.setColor(this.profile.setColor);
};

/**
 * On join
 *
 * @param {Event} event
 */
GameController.prototype.onJoin = function(event)
{
    this.repository.join();
};
