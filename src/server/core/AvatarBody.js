/**
 * Avatar body
 *
 * @param {Avatar} avatar
 * @param {Number} x
 * @param {Number} y
 */
function AvatarBody(avatar, x, y)
{
    Body.call(this, x, y, avatar.radius, avatar.id);

    this.color = avatar.color;
    this.num   = avatar.bodyCount++;
    this.birth = new Date().getTime();
}

AvatarBody.prototype = Object.create(Body.prototype);
AvatarBody.prototype.constructor = AvatarBody;

/**
 * Age considered old
 *
 * @type {Number}
 */
AvatarBody.prototype.oldAge = 2000;

/**
 * Number of trail points that don't kill the avatar
 *
 * @type {Number}
 */
AvatarBody.prototype.trailLatency = 3;

/**
 * Match?
 *
 * @param {Body} body
 *
 * @return {Boolean}
 */
AvatarBody.prototype.match = function(body)
{
    if ((body instanceof AvatarBody) && this.data === body.data) {
        return (body.num - this.num) > this.trailLatency;
    }

    return true;
};

/**
 * Is old?
 *
 * @return {Boolean}
 */
AvatarBody.prototype.isOld = function()
{
    return new Date().getTime() - this.birth >= this.oldAge;
};

