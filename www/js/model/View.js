goog.provide('app.model.View');

/**
 * @param {!number} tableID
 * @param {!number} viewID
 * @param {!string} viewName
 * @param {!number} offsetX
 * @param {!number} offsetY
 * @final
 * @constructor
 */
app.model.View = function (tableID, viewID, viewName, offsetX, offsetY) {
    /**
     * TODO not used?
     * @type {!number}
     * @private
     */
    this._tableID = tableID;
    /**
     * @type {!number}
     * @private
     */
    this._viewID = viewID;
    /**
     * @type {!string}
     * @private
     */
    this._viewName = viewName;
    /**
     * @type {CanvasRenderingContext2D}
     * @private
     */
    this._ctx = null;
    /**
     * @type {!number}
     * @private
     */
    this._width = 0;
    /**
     * @type {!number}
     * @private
     */
    this._height = 0;
    /**
     * @type {!number}
     * @private
     */
    this._appliedScale = 1;
    /**
     * @type {!number}
     * @private
     */
    this._appliedTranslationX = offsetX;
    /**
     * @type {!number}
     * @private
     */
    this._appliedTranslationY = offsetY;
};

app.model.View.CLEAR_OFFSET = 100;

/**
 * @param {!number} degree
 * @public
 */
app.model.View.prototype.rotate = function (degree) {
    // TODO record transformations
    this._ctx.rotate(degree * Math.PI / 180);
};

/**
 * @param {!number} x
 * @param {!number} y
 * @public
 */
app.model.View.prototype.scale = function (x, y) {
    // TODO record transformations
    this._ctx.scale(x, y);
};

/**
 * @param {HTMLCanvasElement} canvas
 * @public
 */
app.model.View.prototype.setCanvas = function (canvas) {
    this._ctx = /**@type{CanvasRenderingContext2D}*/(canvas.getContext("2d"));
};

/**
 * @return {CanvasRenderingContext2D}
 * @public
 */
app.model.View.prototype.getGraphicsContext = function () {
    this._ctx.setTransform(this._appliedScale, 0, 0, this._appliedScale, this._appliedTranslationX, this._appliedTranslationY);
    return this._ctx;
};

/**
 * @param {!number} width
 * @param {!number} height
 * @public
 */
app.model.View.prototype.updateSize = function (width, height) {
    this._width = width;
    this._height = height;
};

/**
 * @return {!Array<!number>} visible area
 * @public
 */
app.model.View.prototype.getVisibleArea = function () {
    var area = [];
    area[2] = (this._width + app.model.View.CLEAR_OFFSET)/this._appliedScale;
    area[3] = (this._height + app.model.View.CLEAR_OFFSET)/this._appliedScale;
    area[0] = (-this._appliedTranslationX - app.model.View.CLEAR_OFFSET)/this._appliedScale;
    area[1] = (-this._appliedTranslationY - app.model.View.CLEAR_OFFSET)/this._appliedScale;

    return area;
};

/**
 * @return {!number}
 * @public
 */
app.model.View.prototype.getAppliedTranslationX = function () {
    return this._appliedTranslationX;
};

/**
 * @return {!number}
 * @public
 */
app.model.View.prototype.getAppliedTranslationY = function () {
    return this._appliedTranslationY;
};

/**
 * @public
 */
app.model.View.prototype.scaleUp = function () {
    this._appliedScale += 0.1;
};

/**
 * @public
 */
app.model.View.prototype.scaleDown = function () {
    if (this._appliedScale > 0.4) {
        this._appliedScale -= 0.1;
    }
};

/**
 * @public
 */
app.model.View.prototype.moveUp = function () {
    this._appliedTranslationY -= 20;
};

/**
 * @public
 */
app.model.View.prototype.moveDown = function () {
    this._appliedTranslationY += 20;
};

/**
 * @public
 */
app.model.View.prototype.moveLeft = function () {
    this._appliedTranslationX -= 20;
};

/**
 * @public
 */
app.model.View.prototype.moveRight = function () {
    this._appliedTranslationX += 20;
};

/**
 * @param {!number} x
 * @param {!number} y
 * @public
 */
app.model.View.prototype.translate = function (x, y) {
    this._appliedTranslationX += x;
    this._appliedTranslationY += y;
};

/**
 * @param {!Array<!number>} point
 * @return {!Array<!number>}
 * @public
 */
app.model.View.prototype.reverseTransformPoint = function (point) {
    point[0] -= this._appliedTranslationX;
    point[1] -= this._appliedTranslationY;

    point[0] = Math.round(point[0] / this._appliedScale);
    point[1] = Math.round(point[1] / this._appliedScale);
    return point;
};

/**
 * @param {!Array<!number>} point
 * @return {!Array<!number>}
 * @public
 */
app.model.View.prototype.reverseScale = function (point) {
    point[0] = Math.round(point[0] / this._appliedScale);
    point[1] = Math.round(point[1] / this._appliedScale);
    return point;
};

/**
 * @return {!number}
 * @public
 */
app.model.View.prototype.getZoom = function () {
    return this._appliedScale;
};
