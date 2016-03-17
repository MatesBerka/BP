goog.provide('app.model.Wall');

goog.require('app.model.RectangleShapeComponent');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @final
 * @constructor
 * @extends {app.model.RectangleShapeComponent}
 * This class represents Wall component.
 */
app.model.Wall = function (coordX, coordY) {
    app.model.Wall.base(this, 'constructor', coordX, coordY, 'WALL'); // call parent constructor

    this.transformPoints();
};

goog.inherits(app.model.Wall, app.model.RectangleShapeComponent);

/**
 * @param {!number} rotation
 * @param {!number} width
 * @param {!number} height
 * @override
 */
app.model.Wall.prototype.copyArguments = function (rotation, width, height) {
    this.appliedRotation = rotation;
    this.width = width;
    this.height = height;
    this.generateShapePoints();
    this.transformPoints();
};

/**
 * @param {!Object} componentModel
 * @override
 */
app.model.Wall.prototype.importComponentData = function (componentModel) {
    this.appliedRotation = componentModel.appliedRotation;
    this.width = componentModel.width;
    this.height = componentModel.height;
    this.generateShapePoints();
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

