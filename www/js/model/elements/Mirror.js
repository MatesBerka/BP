goog.provide('app.model.Mirror');

goog.require('app.model.LineShapeComponent');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @final
 * @constructor
 * @extends {app.model.LineShapeComponent}
 * This class represents Mirror component.
 */
app.model.Mirror = function(coordX, coordY) {
    app.model.Mirror.base(this, 'constructor', coordX, coordY, 'MIRROR'); // call parent constructor

    this.transformPoints();
};

goog.inherits(app.model.Mirror, app.model.LineShapeComponent);

/**
 * @override
 */
app.model.Mirror.prototype.intersects = function (rays) {
    var dVec = [], normVec, transformedPoint, ID, rayLength;
    var point = this.reverseTransformPoint([this._intersectionRay[0], this._intersectionRay[1]]);
    var intersectionPoint = this.reverseTransformPoint([this.intersectionPoint[0], this.intersectionPoint[1]]);

    point[1] = (-1*point[1]) + (2*intersectionPoint[1]);

    transformedPoint = this.transformPoint(point);
    dVec[0] = transformedPoint[0] - this.intersectionPoint[0];
    dVec[1] = transformedPoint[1] - this.intersectionPoint[1];
    normVec = app.model.Component.normalize2DVector(dVec);

    ID = this._intersectionRay[6] + '-M' + this._componentID;
    rayLength = this._intersectionRay[7] + this.newRayLength;
    rays.push([this.intersectionPoint[0], this.intersectionPoint[1], 0, normVec[0], normVec[1], 0, ID, rayLength,
        this._intersectionRay[8]]);

    return this.intersectionPoint;
};

/**
 * @override
 */
app.model.Mirror.prototype.copy = function () {
    var copy = new app.model.Mirror(this.appliedTranslationX, this.appliedTranslationY);
    copy.importComponentData(this);
    return copy;
};
