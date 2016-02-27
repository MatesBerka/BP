goog.provide('app.model.View');

/**
 * @constructor
 */
app.model.View = function (tableID, viewID, viewName, offsetX, offsetY) {

    this._tableID = tableID;

    this._viewID = viewID;

    this._viewName = viewName;

    this.width = 0;

    this.height = 0;

    this._ctx = null;

    this._appliedScale = 1;

    this.appliedTranslationX = offsetX;

    this.appliedTranslationY = offsetY;
};

app.model.View.CLEAR_OFFSET = 100;

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
    this._ctx.setTransform(this._appliedScale, 0, 0, this._appliedScale, this.appliedTranslationX, this.appliedTranslationY);
    return this._ctx;
};

app.model.View.prototype.updateSize = function (width, height) {
    this.width = width;
    this.height = height;
};

app.model.View.prototype.getVisibleArea = function () {
    var area = [];

    area[2] = (this.width + app.model.View.CLEAR_OFFSET)/this._appliedScale;
    area[3] = (this.height + app.model.View.CLEAR_OFFSET)/this._appliedScale;
    area[0] = (-this.appliedTranslationX - app.model.View.CLEAR_OFFSET)/this._appliedScale;
    area[1] = (-this.appliedTranslationY - app.model.View.CLEAR_OFFSET)/this._appliedScale;

    return area;
};

app.model.View.prototype.getAppliedTranslationX = function () {
    return this.appliedTranslationX;
};

app.model.View.prototype.getAppliedTranslationY = function () {
    return this.appliedTranslationY;
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
    this.appliedTranslationY -= 10;
};

app.model.View.prototype.moveDown = function () {
    this.appliedTranslationY += 10;
};

app.model.View.prototype.moveLeft = function () {
    this.appliedTranslationX -= 10;
};

app.model.View.prototype.moveRight = function () {
    this.appliedTranslationX += 10;
};

app.model.View.prototype.translate = function (x, y) {
    this.appliedTranslationX += x;
    this.appliedTranslationY += y;
};

app.model.View.prototype.reverseTransformPoint = function (point) {
    point[0] -= this.appliedTranslationX;
    point[1] -= this.appliedTranslationY;

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
