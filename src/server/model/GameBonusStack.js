/**
 * Game Bonus Stack
 *
 * @param {Game} game
 */
function GameBonusStack(game)
{
    BaseBonusStack.call(this, game);
}

GameBonusStack.prototype = Object.create(BaseBonusStack.prototype);
GameBonusStack.prototype.constructor = GameBonusStack;

/**
 * Apply the value to target's property
 *
 * @param {String} property
 * @param {Number} value
 */
GameBonusStack.prototype.apply = function(property, value)
{
    switch (property) {
        case 'borderless':
            this.target.setBorderless(value ? true : false);
            break;
        default:
            BaseBonusStack.prototype.apply.call(this, property, value);
            break;
    }
};
