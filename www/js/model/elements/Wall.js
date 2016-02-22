goog.provide('app.model.Wall');

goog.require('app.model.Component');
goog.require('app.shapes.Rectangle');
/**
 * @constructor
 * @extends {app.model.Component}
 */
app.model.Wall = function(coordX, coordY) {
    this._width = 10;

    this._height = 300;

    this._wallsCount = 4;

    this._type = 'WALL';

    app.model.Wall.base(this, 'constructor', coordX, coordY); // call parent constructor

    this._transformPoints();
};

goog.inherits(app.model.Wall, app.model.Component);
goog.mixin(app.model.Wall.prototype, app.shapes.Rectangle.prototype);

app.model.Wall.prototype.getHeight = function() {
    return (this._height / app.PIXELonCM).toFixed(2);
};

app.model.Wall.prototype.setHeight = function(height) {
    this._height = Math.round(height * app.PIXELonCM);
    this._generateShapePoints();
    this._transformPoints();
};

app.model.Wall.prototype.getWidth = function() {
    return (this._width / app.PIXELonCM).toFixed(2);
};

app.model.Wall.prototype.setWidth = function(width) {
    this._width = Math.round(width * app.PIXELonCM);
    this._generateShapePoints();
    this._transformPoints();
};


app.model.Wall.prototype.intersect = function(rays) {
    return this._intersectionPoint;
};

app.model.Wall.prototype.copyArguments = function(rotation, width, height) {
    this._appliedRotation = rotation;
    this._width = width;
    this._height = height;
    this._transformPoints();
};

app.model.Wall.prototype.copy = function () {
    var copy = new app.model.Wall(this._appliedTranslationX, this._appliedTranslationY);
    copy.copyArguments(this._appliedRotation, this._width, this._height);
    return copy;
};

