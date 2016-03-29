goog.provide('app.model.Splitter');

goog.require('app.model.LineShapeComponent');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @final
 * @constructor
 * @extends {app.model.LineShapeComponent}
 * This class represents Splitter component.
 */
app.model.Splitter = function (coordX, coordY) {
    app.model.Splitter.base(this, 'constructor', coordX, coordY, 'SPLITTER'); // call parent constructor

    this.transformPoints();
};

goog.inherits(app.model.Splitter, app.model.LineShapeComponent);

/**
 * @override
 */
app.model.Splitter.prototype.intersects = function (rays) {
    var dVec = [], normVec;

    var point = this.reverseTransformPoint([this._intersectionRay[0], this._intersectionRay[1]]);
    var intersectionPoint = this.reverseTransformPoint([this.intersectionPoint[0], this.intersectionPoint[1]]);
    point[1] = (-1 * point[1]) + (2 * intersectionPoint[1]);
    var k = this.transformPoint(point);

    dVec[0] = k[0] - this.intersectionPoint[0];
    dVec[1] = k[1] - this.intersectionPoint[1];

    normVec = app.model.Component.normalize2DVector(dVec);

    this._intersectionRay[0] = this.intersectionPoint[0];
    this._intersectionRay[1] = this.intersectionPoint[1];
    this._intersectionRay[6] += '-S' + this._componentID;
    this._intersectionRay[7] = (this._intersectionRay[7] + this.newRayLength);
    rays.push(this._intersectionRay.slice());

    this._intersectionRay[3] = normVec[0];
    this._intersectionRay[4] = normVec[1];
    rays.push(this._intersectionRay.slice());

    return this.intersectionPoint;
};

/**
 * @override
 */
app.model.Splitter.prototype.copy = function () {
    var copy = new app.model.Splitter(this.appliedTranslationX, this.appliedTranslationY);
    copy.importComponentData(this);
    return copy;
};
