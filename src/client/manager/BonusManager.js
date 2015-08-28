/**
 * Bonus Manager
 *
 * @param {Game} game
 */
function BonusManager(game)
{
    BaseBonusManager.call(this, game);

    this.sprite = new SpriteAsset('images/bonus.png', 3, 4, this.onLoad.bind(this), true);
    this.loaded = false;

    this.bonuses.index = false;
}

BonusManager.prototype = Object.create(BaseBonusManager.prototype);
BonusManager.prototype.constructor = BonusManager;

/**
 * Assets
 *
 * @type {Object}
 */
BonusManager.prototype.assets = [];

/**
 * Sprite position
 *
 * @type {Array}
 */
BonusManager.prototype.spritePosition = [
    'BonusSelfFast',
    'BonusEnemyFast',
    'BonusSelfSlow',
    'BonusEnemySlow',
    'BonusGameBorderless',
    'BonusSelfMaster',
    'BonusEnemyBig',
    'BonusAllColor',
    'BonusEnemyInverse',
    'BonusSelfSmall',
    'BonusGameClear',
    'BonusEnemyStraightAngle'
];

/**
 * On bonus sprite loaded
 */
BonusManager.prototype.onLoad = function()
{
    var images = this.sprite.getImages();

    for (var i = this.spritePosition.length - 1; i >= 0; i--) {
        this.assets[this.spritePosition[i]] = images[i];
    }

    this.loaded = true;
    this.emit('load');
};
