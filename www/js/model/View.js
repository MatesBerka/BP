goog.provide('app.model.View');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!string} viewName
 * @param {!number} offsetX
 * @param {!number} offsetY
 * @final
 * @constructor
 * This model represents a single used to display table components.
 * Contains view transformations.
 */
app.model.View = function (viewName, offsetX, offsetY) {
    /**
     * View name displayed in menu.
     * @type {!string}
     * @private
     */
    this._viewName = viewName;
    /**
     * View canvas
     * @type {CanvasRenderingContext2D}
     * @private
     */
    this._ctx = null;
    /**
     * View width
     * @type {!number}
     * @private
     */
    this._width = 0;
    /**
     * View height
     * @type {!number}
     * @private
     */
    this._height = 0;
    /**
     * Applied scale
     * @type {!number}
     * @private
     */
    this._appliedScale = 1;
    /**
     * Applied x translation
     * @type {!number}
     * @private
     */
    this._appliedTranslationX = offsetX;
    /**
     * Applied y translation
     * @type {!number}
     * @private
     */
    this._appliedTranslationY = offsetY;
};

app.model.View.CLEAR_OFFSET = 100;

/**
 * Sets new canvas for this view
 * @param {HTMLCanvasElement} canvas
 * @public
 */
app.model.View.prototype.setCanvas = function (canvas) {
    this._ctx = /**@type{CanvasRenderingContext2D}*/(canvas.getContext("2d"));
};

/**
 * Returns transformed canvas
 * @return {CanvasRenderingContext2D}
 * @public
 */
app.model.View.prototype.getGraphicsContext = function () {
    this._ctx.setTransform(this._appliedScale, 0, 0, this._appliedScale, this._appliedTranslationX, this._appliedTranslationY);
    return this._ctx;
};

/**
 * Returns view name
 * @param {!string} name
 * @public
 */
app.model.View.prototype.changeName = function (name) {
    this._viewName = name;
};

/**
 * Updates view size
 * @param {!number} width
 * @param {!number} height
 * @public
 */
app.model.View.prototype.updateSize = function (width, height) {
    this._width = width;
    this._height = height;
};

/**
 * Returns table visible area in this view
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
 * Returns applied x translation
 * @return {!number}
 * @public
 */
app.model.View.prototype.getAppliedTranslationX = function () {
    return this._appliedTranslationX;
};

/**
 * Returns applied y translation
 * @return {!number}
 * @public
 */
app.model.View.prototype.getAppliedTranslationY = function () {
    return this._appliedTranslationY;
};

/**
 * Applies new scale up on view
 * @public
 */
app.model.View.prototype.scaleUp = function () {
    this._appliedScale += 0.1;
};

/**
 * Applies new down scale on view (limited)
 * @public
 */
app.model.View.prototype.scaleDown = function () {
    if (this._appliedScale > 0.4) {
        this._appliedScale -= 0.1;
    }
};

/**
 * Adds top move to applied translation
 * @public
 */
app.model.View.prototype.moveUp = function () {
    this._appliedTranslationY -= 20;
};

/**
 * Adds down move to applied translation
 * @public
 */
app.model.View.prototype.moveDown = function () {
    this._appliedTranslationY += 20;
};

/**
 * Adds left move to applied translation
 * @public
 */
app.model.View.prototype.moveLeft = function () {
    this._appliedTranslationX -= 20;
};

/**
 * Adds right move to applied translation
 * @public
 */
app.model.View.prototype.moveRight = function () {
    this._appliedTranslationX += 20;
};

/**
 * Adds new translation
 * @param {!number} x
 * @param {!number} y
 * @public
 */
app.model.View.prototype.translate = function (x, y) {
    this._appliedTranslationX += x;
    this._appliedTranslationY += y;
};

/**
 * Applies reverse transformations on inserted point
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
 * Applies reverse scale on inserted point
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
 * Returns view current zoom/applied scale
 * @return {!number}
 * @public
 */
app.model.View.prototype.getZoom = function () {
    return this._appliedScale;
};

/**
 * Imports view data
 * @param {!Object} viewModel
 */
app.model.View.prototype.importView = function (viewModel) {
    this._height = viewModel._height;
    this._width = viewModel._width;
    this._appliedScale = viewModel._appliedScale;
};
