goog.provide('app.model.Mirror');

goog.require('app.model.LineShapeComponent');

/**
 * @param {number} coordX - component x position
 * @param {number} coordY - component Y position
 * @final
 * @constructor
 * @extends {app.model.LineShapeComponent}
 */
app.model.Mirror = function(coordX, coordY) {

    this._type = 'MIRROR';

    app.model.Mirror.base(this, 'constructor', coordX, coordY); // call parent constructor

    this.transformPoints();
};

goog.inherits(app.model.Mirror, app.model.LineShapeComponent);

/**
 * @override
 */
app.model.Mirror.prototype.intersect = function (rays) {
    var dVec = [], normVec;

    var point = this.reverseTransformPoint([this._intersectionRay[0], this._intersectionRay[1]]);
    var intersectionPoint = this.reverseTransformPoint([this.intersectionPoint[0], this.intersectionPoint[1]]);
    point[1] = (-1*point[1]) + (2*intersectionPoint[1]);
    var k = this.transformPoint(point);

    dVec[0] = k[0] - this.intersectionPoint[0];
    dVec[1] = k[1] - this.intersectionPoint[1];

    normVec = this.normalize2DVector(dVec);

    var rayLength = this._intersectionRay[7] + this.newRayLength;
    rays.push([this.intersectionPoint[0], this.intersectionPoint[1], 0, normVec[0], normVec[1], 0, this._intersectionRay[6], rayLength]);

    return this.intersectionPoint;
};

/**
 * @param {!number} height
 * @override
 */
app.model.Mirror.prototype.copyArguments = function(height) {
    this.height = height;
    this.transformPoints();
};

/**
 * @override
 */
app.model.Mirror.prototype.copy = function () {
    var copy = new app.model.Mirror(this.appliedTranslationX, this.appliedTranslationY);
    copy.copyArguments(this.height);
    return copy;
};
