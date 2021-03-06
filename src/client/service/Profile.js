/**
 * Profile
 */
function Profile()
{
    EventEmitter.call(this);

    this.element = document.forms.player;
    this.name    = this.element.elements.name;
    this.color   = this.element.elements.color;
    this.join    = this.element.elements.join;

    this.onName   = this.onName.bind(this);
    this.onColor  = this.onColor.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setName  = this.setName.bind(this);
    this.setColor = this.setColor.bind(this);

    this.name.addEventListener('change', this.onName);
    this.color.addEventListener('click', this.onColor);
    this.element.addEventListener('submit', this.onSubmit);
}

Profile.prototype = Object.create(EventEmitter.prototype);
Profile.prototype.constructor = Profile;

/**
 * Set name
 *
 * @param {String} name
 */
Profile.prototype.setName = function(name)
{
    this.name.removeEventListener('change', this.onName);
    this.name.value = name;
    this.name.addEventListener('change', this.onName);
};

/**
 * Set color
 *
 * @param {String} color
 */
Profile.prototype.setColor = function(color)
{
    var hex = this.rbgToHex(color);

    this.color.value            = hex;
    this.color.style.background = hex;
    this.join.style.background  = hex;
};

/**
 * On name change
 *
 * @param {Event} event
 */
Profile.prototype.onName = function(event)
{
    this.emit('name', this.name.value);
};

/**
 * On color change
 *
 * @param {Event} event
 */
Profile.prototype.onColor = function(event)
{
    event.preventDefault();
    this.emit('color');
};

/**
 * On submit
 *
 * @param {Event} event
 */
Profile.prototype.onSubmit = function(event)
{
    event.preventDefault();
    this.emit('join');
};

/**
 * Convert color from RBG array to Hexadecimal string
 *
 * @param {Array} color
 *
 * @return {String}
 */
Profile.prototype.rbgToHex = function(color)
{
    return '#' + color[0].toString(16) + color[1].toString(16) + color[2].toString(16);
};
