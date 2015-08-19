/**
 * OrphanTrail
 *
 * @param {Number} avatar
 * @param {Number} radius
 * @param {String} color
 */
function OrphanTrail(avatar, radius, color)
{
    Trail.call(this);

    this.id      = this.getId(avatar, radius, color);
    this.avatar  = avatar;
    this.width   = radius * 2;
    this.color   = color;
    this.created = new Date().getTime();
}

OrphanTrail.prototype = Object.create(Trail.prototype);
OrphanTrail.prototype.constructor = OrphanTrail;

/**
 * Get id from variables
 *
 * @param {Number} avatar
 * @param {Number} radius
 * @param {String} color
 *
 * @return {String}
 */
OrphanTrail.prototype.getId = function(avatar, radius, color)
{
    return avatar.toString() + '-' + radius.toString() + '-' + color;
};
