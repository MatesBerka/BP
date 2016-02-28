goog.provide('app.model.Wall');

goog.require('app.model.RectangleShapeComponent');

/**
 * @param {number} coordX - component x position
 * @param {number} coordY - component Y position
 * @final
 * @constructor
 * @template Wall
 * @extends {app.model.RectangleShapeComponent}
 */
app.model.Wall = function(coordX, coordY) {

    this._type = 'WALL';

    app.model.Wall.base(this, 'constructor', coordX, coordY); // call parent constructor

    this.transformPoints();
};

goog.inherits(app.model.Wall, app.model.RectangleShapeComponent);

/**
 * @param {!number} rotation
 * @param {!number} width
 * @param {!number} height
 * @override
 */
app.model.Wall.prototype.copyArguments = function(rotation, width, height) {
    this.appliedRotation = rotation;
    this.width = width;
    this.height = height;
    this.transformPoints();
};

/**
 * @override
 */
app.model.Wall.prototype.copy = function () {
    var copy = new app.model.Wall(this.appliedTranslationX, this.appliedTranslationY);
    copy.copyArguments(this.appliedRotation, this.width, this.height);
    return copy;
};

