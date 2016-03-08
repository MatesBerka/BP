goog.provide('app.model.Component');

/**
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @template Component
 * @constructor
 */
app.model.Component = function (coordX, coordY) {
    /**
     * Holds component type
     * @type {!string}
     * @protected
     */
    this.type = '';
    /**
     * Applied x translation in px
     * @type {!number}
     * @protected
     */
    this.appliedTranslationX = coordX;
    /**
     * Applied y translation in px
     * @type {!number}
     * @protected
     */
    this.appliedTranslationY = coordY;
    /**
     * Rotation in radians
     * @type {!number}
     * @protected
     */
    this.appliedRotation = 0;
    /**
     * Temporary stores length of intersecting ray
     * @type {!number}
     * @protected
     */
    this.newRayLength = 0;
    /**
     * True if user clicked on this component
     * @type {!boolean}
     * @protected
     */
    this.isComponentSelected = false;
    /**
     * @type {!Array<number>}
     * @protected
     */
    this.intersectionPoint = [];
    /**
     * @type {!Array<!Array<number>>}
     * @protected
     */
    this.originPoints = [];
    /**
     * @type {!Array<!Array<number>>}
     * @protected
     */
    this.transformedPoints = [];

    this.generateShapePoints();
};

/**
 * @const
 * @type {number}
 * @protected
 */
app.model.Component.RAY_MIN_LENGTH = 3;

/**
 * @param {!Array<number>} ray
 * @return {!number}
 * @public
 */
app.model.Component.prototype.isIntersection = function (ray) {
    throw Error('unimplemented abstract method');
};

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {function(Array<number>)} callback
 * @public
 */
app.model.Component.prototype.draw = function (ctx, callback) {
    throw Error('unimplemented abstract method');
};

/**
 * @param {!number} x
 * @param {!number} y
 * @return {!boolean}
 * @public
 */
app.model.Component.prototype.isSelected = function (x, y) {
    throw Error('unimplemented abstract method');
};

/**
 * @public
 */
app.model.Component.prototype.generateShapePoints = goog.abstractMethod;

/**
 * @protected
 */
app.model.Component.prototype.copyArguments = goog.abstractMethod;

/**
 * @public
 */
app.model.Component.prototype.importComponentData = goog.abstractMethod;

/**
 * @return {app.model.Component}
 * @public
 */
app.model.Component.prototype.copy = goog.abstractMethod;

/**
 * @param {!Array<Array<!number>>} rays
 * @param {Array<!number>} ray
 * @public
 */
app.model.Component.prototype.intersect = function (rays, ray) {
    ray[7] += this.newRayLength;
    return this.intersectionPoint;
};

/**
 * @protected
 */
app.model.Component.prototype.transformPoints = function () {
    var newPoint;
    this.transformedPoints = [];

    for (var i = 0; i < this.originPoints.length; i++) {
        newPoint = [];
        newPoint[0] = this.originPoints[i][0] * Math.cos(this.appliedRotation) - this.originPoints[i][1] * Math.sin(this.appliedRotation);
        newPoint[1] = this.originPoints[i][0] * Math.sin(this.appliedRotation) + this.originPoints[i][1] * Math.cos(this.appliedRotation);

        newPoint[0] = newPoint[0] + this.appliedTranslationX;
        newPoint[1] = newPoint[1] + this.appliedTranslationY;

        this.transformedPoints.push(newPoint);
    }
};

/**
 * @param {!Array<number>} vec
 * @return {!Array<number>} vec
 * @protected
 */
app.model.Component.prototype.normalize2DVector = function (vec) {
    var len = Math.sqrt(Math.pow(vec[0],2) + Math.pow(vec[1], 2));
    len = (len === Infinity) ? Number.MAX_VALUE : len;

    vec[0] = vec[0] / len;
    vec[1] = vec[1] / len;

    return vec;
};

/**
 * @param {!Array<number>} point
 * @param {!number} radians
 * @return {!Array<number>} result
 * @protected
 */
app.model.Component.prototype.rotatePoint = function (point, radians) {
    var result = [];
    result[0] = point[0] * Math.cos(radians) + point[1] * Math.sin(radians);
    result[1] = point[0] * -Math.sin(radians) + point[1] * Math.cos(radians);

    return result;
};

/**
 * @param {!Array<number>} point
 * @return {!Array<number>} result
 * @protected
 */
app.model.Component.prototype.reverseTransformPoint = function (point) {
    var result = [], translatedPoint = [];
    translatedPoint[0] = point[0] - this.appliedTranslationX;
    translatedPoint[1] = point[1] - this.appliedTranslationY;

    result[0] = translatedPoint[0] * Math.cos(this.appliedRotation) + translatedPoint[1] * Math.sin(this.appliedRotation);
    result[1] = translatedPoint[0] * -Math.sin(this.appliedRotation) + translatedPoint[1] * Math.cos(this.appliedRotation);

    return result;
};

/**
 * @param {!Array<number>} point
 * @return {!Array<number>} newPoint
 * @protected
 */
app.model.Component.prototype.transformPoint = function (point) {
    var newPoint;

    newPoint = [];
    newPoint[0] = point[0] * Math.cos(this.appliedRotation) - point[1] * Math.sin(this.appliedRotation);
    newPoint[1] = point[0] * Math.sin(this.appliedRotation) + point[1] * Math.cos(this.appliedRotation);

    newPoint[0] = newPoint[0] + this.appliedTranslationX;
    newPoint[1] = newPoint[1] + this.appliedTranslationY;

    return newPoint;
};

/**
 * @param {!number} degrees
 * @public
 */
app.model.Component.prototype.updateRotation = function (degrees) {
    this.appliedRotation = degrees * (Math.PI / 180);
    this.transformPoints();
};

/**
 * @param {!number} moveX
 * @param {!number} moveY
 * @public
 */
app.model.Component.prototype.applyTranslation = function (moveX, moveY) {
    this.appliedTranslationX += moveX;
    this.appliedTranslationY += moveY;
    this.transformPoints();
};

/**
 * @param {!number} x
 * @public
 */
app.model.Component.prototype.updateTranslationX = function (x) {
    this.appliedTranslationX = Math.round(x * app.PIXELS_ON_CM);
    this.transformPoints();
};

/**
 * @param {!number} y
 * @public
 */
app.model.Component.prototype.updateTranslationY = function (y) {
    this.appliedTranslationY = Math.round(y * app.PIXELS_ON_CM);
    this.transformPoints();
};

/**
 * @return {!string} component x coordinate
 * @public
 */
app.model.Component.prototype.getPosX = function () {
    return (this.appliedTranslationX / app.PIXELS_ON_CM).toFixed(2);
};

/**
 * @return {!string} component y coordinate
 * @public
 */
app.model.Component.prototype.getPosY = function () {
    return (this.appliedTranslationY / app.PIXELS_ON_CM).toFixed(2);
};

/**
 * @return {!string} component type
 * @public
 */
app.model.Component.prototype.getType = function () {
    return this.type;
};

/**
 * @return {!number} applied rotation
 * @public
 */
app.model.Component.prototype.getRotation = function () {
    return this.appliedRotation * (180 / Math.PI);
};

/**
 * @param {!number} rotation
 * @public
 */
app.model.Component.prototype.setRotation = function (rotation) {
    this.appliedRotation = rotation;
    this.transformPoints();
};

/**
 * @param {!boolean} boolean
 * @public
 */
app.model.Component.prototype.setSelected = function (boolean) {
    this.isComponentSelected = boolean;
};