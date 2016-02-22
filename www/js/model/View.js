goog.provide('app.model.View');

/**
 * @constructor
 */
app.model.View = function (tableID, viewID, viewName, offsetX, offsetY) {

    this._tableID = tableID;

    this._viewID = viewID;

    this._viewName = viewName;

    this._width = 0;

    this._height = 0;

    this._ctx = null;

    this._appliedScale = 1;

    this._appliedTranslationX = offsetX;

    this._appliedTranslationY = offsetY;
};

app.model.View.CLEAR_OFFSET = 50;

app.model.View.prototype.rotate = function (degree) {
    // TODO record transformations
    this._ctx.rotate(degree * Math.PI / 180);
};

app.model.View.prototype.scale = function (x, y) {
    // TODO record transformations
    this._ctx.scale(x, y);
};

app.model.View.prototype.setCanvas = function (canvas) {
    this._ctx = canvas.getContext("2d");
};

app.model.View.prototype.getGraphicsContext = function () {
    this._ctx.setTransform(this._appliedScale, 0, 0, this._appliedScale, this._appliedTranslationX, this._appliedTranslationY);
    return this._ctx;
};

app.model.View.prototype.updateSize = function (width, height) {
    this._width = width;
    this._height = height;
};

app.model.View.prototype.getVisibleArea = function () {
    var area = [];

    area[2] = (this._width + app.model.View.CLEAR_OFFSET)/this._appliedScale;
    area[3] = (this._height + app.model.View.CLEAR_OFFSET)/this._appliedScale;
    area[0] = -this._appliedTranslationX - app.model.View.CLEAR_OFFSET;
    area[1] = -this._appliedTranslationY - app.model.View.CLEAR_OFFSET;

    return area;
};

app.model.View.prototype.getAppliedTranslationX = function () {
    return this._appliedTranslationX;
};

app.model.View.prototype.getAppliedTranslationY = function () {
    return this._appliedTranslationY;
};

app.model.View.prototype.scaleUp = function () {
    this._appliedScale += 0.1;
};

app.model.View.prototype.scaleDown = function () {
    if (this._appliedScale > 0.4) {
        this._appliedScale -= 0.1;
    }
};

app.model.View.prototype.moveUp = function () {
    this._appliedTranslationY -= 10;
};

app.model.View.prototype.moveDown = function () {
    this._appliedTranslationY += 10;
};

app.model.View.prototype.moveLeft = function () {
    this._appliedTranslationX -= 10;
};

app.model.View.prototype.moveRight = function () {
    this._appliedTranslationX += 10;
};

app.model.View.prototype.translate = function (x, y) {
    this._appliedTranslationX += x;
    this._appliedTranslationY += y;
};

app.model.View.prototype.reverseTransformPoint = function (point) {
    point[0] -= this._appliedTranslationX;
    point[1] -= this._appliedTranslationY;

    point[0] = Math.round(point[0] / this._appliedScale);
    point[1] = Math.round(point[1] / this._appliedScale);

    return point;
};

app.model.View.prototype.reverseScale = function (point) {
    point[0] = Math.round(point[0] / this._appliedScale);
    point[1] = Math.round(point[1] / this._appliedScale);

    return point;
};

app.model.View.prototype.getZoom = function () {
    return this._appliedScale;
};
