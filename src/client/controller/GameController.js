/**
 * Game controller
 */
function GameController ()
{
    this.controls = [
        new PlayerControl(37, 'icon-left-dir'),
        new PlayerControl(39, 'icon-right-dir')
    ];

    this.repository = new GameRepository(this.controls);

    for (var i = this.controls.length - 1; i >= 0; i--) {
        this.controls[i].on('change', this.onControlChange);
    }
}

/**
 * Set touch
 */
GameController.prototype.setTouch = function()
{
    var touch = document.createTouch(window, window, new Date().getTime(), 0, 0, 0, 0);

    for (var i = this.controls.length - 1; i >= 0; i--) {
        this.controls[i].mappers.getById('touch').setValue(touch);
    }
};
