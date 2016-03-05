goog.provide('app.model.View');

/**
 * @param {!string} viewName
 * @param {!number} offsetX
 * @param {!number} offsetY
 * @final
 * @constructor
 */
app.model.View = function (viewName, offsetX, offsetY) {
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
 * @param {!string} name
 * @public
 */
app.model.View.prototype.changeName = function (name) {
    this._viewName = name;
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
    area[2] = (this._width + app.model.View.CLEAR_OFFSET) / this._appliedScale;
    area[3] = (this._height + app.model.View.CLEAR_OFFSET) / this._appliedScale;
    area[0] = (-this._appliedTranslationX - app.model.View.CLEAR_OFFSET) / this._appliedScale;
    area[1] = (-this._appliedTranslationY - app.model.View.CLEAR_OFFSET) / this._appliedScale;

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
    var result = point.slice();
    result[0] -= this._appliedTranslationX;
    result[1] -= this._appliedTranslationY;

    result[0] = Math.round(result[0] / this._appliedScale);
    result[1] = Math.round(result[1] / this._appliedScale);
    return result;
};

/**
 * @param {!Array<!number>} point
 * @return {!Array<!number>}
 * @public
 */
app.model.View.prototype.reverseScale = function (point) {
    var result = point.slice();
    result[0] = Math.round(result[0] / this._appliedScale);
    result[1] = Math.round(result[1] / this._appliedScale);
    return result;
};

/**
 * @return {!number}
 * @public
 */
app.model.View.prototype.getZoom = function () {
    return this._appliedScale;
};

/**
 *
 * @param {!Object} viewModel
 */
app.model.View.prototype.importView = function (viewModel) {
    this._height = viewModel._height;
    this._width = viewModel._width;
    this._appliedScale = viewModel._appliedScale;
};
