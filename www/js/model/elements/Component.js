goog.provide('app.model.Component');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @param {!string} type - component type
 * @template Component
 * @constructor
 * Abstract class used to define basic operations used by all components.
 */
app.model.Component = function (coordX, coordY, type) {
    /**
     * Holds component type
     * @type {!string}
     * @protected
     */
    this.type = type;
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
     * Holds intersection point for currently processed ray
     * @type {!Array<number>}
     * @protected
     */
    this.intersectionPoint = [];
    /**
     * Holds component origin points before they are transformed
     * @type {!Array<!Array<number>>}
     * @protected
     */
    this.originPoints = [];
    /**
     * Holds component transformed points which are created from origin points
     * @type {!Array<!Array<number>>}
     * @protected
     */
    this.transformedPoints = [];

    this.generateShapePoints();
};

/**
 * Defines minimal length which ray has to have to be considered as a intersection ray
 * @const
 * @type {number}
 * @protected
 */
app.model.Component.RAY_MIN_LENGTH = 3;

/**
 * Accepts currently processed ray and checks if ray intersects this component
 * @param {!Array<number>} ray
 * @return {!number}
 * @public
 */
app.model.Component.prototype.isIntersection = function (ray) {
    throw Error('unimplemented abstract method');
};

/**
 * Draws components on inserted canvas and if components generate light, then it will call callback function
 * to add new rays
 * @param {!CanvasRenderingContext2D} ctx
 * @param {function(Array<number>)} callback
 * @public
 */
app.model.Component.prototype.draw = function (ctx, callback) {
    throw Error('unimplemented abstract method');
};

/**
 * Accepts x and y coordinates and checks if they intersects this component
 * @param {!number} x
 * @param {!number} y
 * @return {!boolean}
 * @public
 */
app.model.Component.prototype.isSelected = function (x, y) {
    throw Error('unimplemented abstract method');
};

/**
 * Generates shape points which represents the component and stores them in origin points array
 * @public
 */
app.model.Component.prototype.generateShapePoints = goog.abstractMethod;

/**
 * Helper method to  quickly copy component model arguments
 * @protected
 */
app.model.Component.prototype.copyArguments = goog.abstractMethod;

/**
 * Helper method used to insert imported component data
 * @public
 */
app.model.Component.prototype.importComponentData = goog.abstractMethod;

/**
 * Returns copy of component model
 * @return {app.model.Component}
 * @public
 */
app.model.Component.prototype.copy = goog.abstractMethod;

/**
 * Called when currently processed validates intersection.
 * @param {!Array<Array<!number>>} rays
 * @public
 */
app.model.Component.prototype.intersects = function (rays) {
    return this.intersectionPoint;
};

/**
 * Helper method to normalize direction vector
 * @param {!Array<number>} vec
 * @return {!Array<number>} vec
 * @protected
 */
app.model.Component.normalize2DVector = function (vec) {
    var len = Math.sqrt(Math.pow(vec[0],2) + Math.pow(vec[1], 2));
    len = (len === Infinity) ? Number.MAX_VALUE : len;

    vec[0] = vec[0] / len;
    vec[1] = vec[1] / len;

    return vec;
};

/**
 * Rotates accepted point
 * @param {!Array<number>} point
 * @param {!number} radians
 * @return {!Array<number>} result
 * @protected
 */
app.model.Component.prototype.rotatePoint = function (point, radians) {
    var result = [];
    result[0] = point[0] * Math.cos(radians) - point[1] * Math.sin(radians);
    result[1] = point[0] * Math.sin(radians) + point[1] * Math.cos(radians);

    return result;
};

/**
 * Applies reverse transformations on accepted point
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
 * Transforms accepted point
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
 * Transforms component origin points
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
 * Applies new rotation on component
 * @param {!number} degrees
 * @public
 */
app.model.Component.prototype.updateRotation = function (degrees) {
    this.appliedRotation = degrees * (Math.PI / 180);
    this.transformPoints();
};

/**
 * Applies new translation on component
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
 * Applies new x translation on component
 * @param {!number} x
 * @public
 */
app.model.Component.prototype.updateTranslationX = function (x) {
    this.appliedTranslationX = Math.round(x * app.pixels_on_cm);
    this.transformPoints();
};

/**
 * Applies new y translation on component
 * @param {!number} y
 * @public
 */
app.model.Component.prototype.updateTranslationY = function (y) {
    this.appliedTranslationY = Math.round(y * app.pixels_on_cm);
    this.transformPoints();
};

/**
 * Returns applied X translation on component in cm
 * @return {!string} component x coordinate
 * @public
 */
app.model.Component.prototype.getPosX = function () {
    return (this.appliedTranslationX / app.pixels_on_cm).toFixed(2);
};

/**
 * Returns applied Y translation on component in cm
 * @return {!string} component y coordinate
 * @public
 */
app.model.Component.prototype.getPosY = function () {
    return (this.appliedTranslationY / app.pixels_on_cm).toFixed(2);
};

/**
 * Returns component type
 * @return {!string} component type
 * @public
 */
app.model.Component.prototype.getType = function () {
    return this.type;
};

/**
 * Returns applied rotation in degrees
 * @return {!number} applied rotation
 * @public
 */
app.model.Component.prototype.getRotation = function () {
    return this.appliedRotation * (180 / Math.PI);
};

/**
 * Marks component as selected
 * @param {!boolean} boolean
 * @public
 */
app.model.Component.prototype.setSelected = function (boolean) {
    this.isComponentSelected = boolean;
};