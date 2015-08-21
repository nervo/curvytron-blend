/**
 * Player
 *
 * @param {SocketClient} client
 * @param {String} name
 */
function Player(client, name)
{
    BasePlayer.call(this, client, name);
}

Player.prototype = Object.create(BasePlayer.prototype);
Player.prototype.constructor = Player;
