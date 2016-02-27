goog.provide('app.model.Mirror');

goog.require('app.model.Component');
goog.require('app.shapes.Line');

/**
 * @constructor
 * @extends {app.model.Component}
 */
app.model.Mirror = function(coordX, coordY) {

    this._height = 300;

    this._newRayLength = 0;

    this._type = 'MIRROR';

    app.model.Mirror.base(this, 'constructor', coordX, coordY); // call parent constructor

    this._transformPoints();
};

goog.inherits(app.model.Mirror, app.model.Component);
goog.mixin(app.model.Mirror.prototype, app.shapes.Line.prototype);

app.model.Mirror.prototype.intersect = function (rays) {
    var dVec = [], normVec;

    var point = this._reverseTransformPoint([this._intersectionRay[0], this._intersectionRay[1]]);
    var intersectionPoint = this._reverseTransformPoint([this._intersectionPoint[0], this._intersectionPoint[1]]);
    point[1] = (-1*point[1]) + (2*intersectionPoint[1]);
    var k = this._transformPoint(point);

    dVec[0] = k[0] - this._intersectionPoint[0];
    dVec[1] = k[1] - this._intersectionPoint[1];

    normVec = this._normalize2DVector(dVec);

    var rayLength = this._intersectionRay[7] + this._newRayLength;
    rays.push([this._intersectionPoint[0], this._intersectionPoint[1], 0, normVec[0], normVec[1], 0, this._intersectionRay[6], rayLength]);

    return this._intersectionPoint;
};

app.model.Mirror.prototype.copyArguments = function(height) {
    this._height = height;
    this._transformPoints();
};

app.model.Mirror.prototype.copy = function () {
    var copy = new app.model.Mirror(this._appliedTranslationX, this._appliedTranslationY);
    copy.copyArguments(this._height);
    return copy;
};
