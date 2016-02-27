goog.provide('app.model.Splitter');

goog.require('app.model.Component');
goog.require('app.shapes.Line');
/**
 * @constructor
 * @extends {app.model.Component}
 */
app.model.Splitter = function (coordX, coordY) {

    this._height = 300;

    this._type = 'SPLITTER';

    this._newRayLength = 0;

    app.model.Splitter.base(this, 'constructor', coordX, coordY); // call parent constructor

    this._transformPoints();
};

goog.inherits(app.model.Splitter, app.model.Component);
goog.mixin(app.model.Splitter.prototype, app.shapes.Line.prototype);

app.model.Splitter.prototype.intersect = function (rays) {
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

    this._intersectionRay[0] = this._intersectionPoint[0];
    this._intersectionRay[1] = this._intersectionPoint[1];
    rays.push(this._intersectionRay);

    return this._intersectionPoint;
};

app.model.Splitter.prototype.copyArguments = function(height) {
    this._height = height;
    this._transformPoints();
};

app.model.Splitter.prototype.copy = function () {
    var copy = new app.model.Splitter(this._appliedTranslationX, this._appliedTranslationY);
    copy.copyArguments(this._height);
    return copy;
};
