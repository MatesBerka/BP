goog.provide('app.model.LineShapeComponent');

goog.require('app.model.Component');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {number} coordX - component x position
 * @param {number} coordY - component Y position
 * @param {!string} type - component type
 * @constructor
 * @extends {app.model.Component}
 * Abstract class used to define basic operations for line shape components.
 */
app.model.LineShapeComponent = function (coordX, coordY, type) {
    /**
     * Used to define component height
     * @type {!number}
     * @protected
     */
    this.height = 150;

    app.model.LineShapeComponent.base(this, 'constructor', coordX, coordY, type); // call parent constructor
};

goog.inherits(app.model.LineShapeComponent, app.model.Component);

/**
 * @override
 */
app.model.LineShapeComponent.prototype.generateShapePoints = function () {
    var x = 0, y = 0, z = 0;

    this.originPoints = [];
    y = y - Math.floor(this.height / 2);
    this.originPoints.push([x, y, z]);

    y += this.height;
    this.originPoints.push([x, y, z]);
};

/**
 * @see https://rootllama.wordpress.com/2014/06/20/ray-line-segment-intersection-test-in-2d/#comments
 * @override
 */
app.model.LineShapeComponent.prototype.isIntersection = function (ray) {
    var numerator, denominator, t1, t2, v1, v2, v3, ix, iy, a, b,
        length = Infinity;

    a = this.transformedPoints[0];
    b = this.transformedPoints[1];

    v1 = [ray[app.RAY_ORIGIN_X] - a[0], ray[app.RAY_ORIGIN_Y] - a[1]];
    v2 = [b[0] - a[0], b[1] - a[1]];
    v3 = [-ray[app.RAY_DIRECTION_Y], ray[app.RAY_DIRECTION_X]];

    numerator = v2[0] * v1[1] - v1[0] * v2[1];
    denominator = v2[0] * v3[0] + v2[1] * v3[1];
    t1 = numerator / denominator;

    if (t1 < 0)
        return length;

    numerator = v1[0] * v3[0] + v1[1] * v3[1];
    t2 = numerator / denominator;
    if (t2 < 0 || t2 > 1)
        return length;

    ix = Math.round(ray[app.RAY_ORIGIN_X] + ray[app.RAY_DIRECTION_X] * t1);
    iy = Math.round(ray[app.RAY_ORIGIN_Y] + ray[app.RAY_DIRECTION_Y] * t1);

    if (ix == ray[app.RAY_ORIGIN_X] && iy == ray[app.RAY_ORIGIN_Y])
        return length;

    // is intersection
    length = Math.sqrt(Math.pow(Math.abs(ix - ray[app.RAY_ORIGIN_X]), 2) + Math.pow(Math.abs(iy - ray[app.RAY_ORIGIN_Y]), 2));
    if (length < app.model.Component.RAY_MIN_LENGTH)
        return Infinity;

    this._intersectionRay = ray.slice();
    this.intersectionPoint = [ix, iy];
    this.newRayLength = length;

    return length;
};

/**
 * @override
 */
app.model.LineShapeComponent.prototype.draw = function (ctx, callback) {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(this.transformedPoints[0][0], this.transformedPoints[0][1]);
    ctx.lineTo(this.transformedPoints[1][0], this.transformedPoints[1][1]);
    ctx.stroke();

    if (this.isComponentSelected)
        ctx.lineWidth = 5;

    ctx.stroke();
    ctx.lineWidth = 1;
};

/**
 * @override
 */
app.model.LineShapeComponent.prototype.isSelected = function (x, y) {
    var point = this.reverseTransformPoint([x, y]),
        xs = -5, ys = -Math.floor(this.height / 2), xe = 5, ye = Math.floor(this.height / 2);

    if (point[0] >= xs && point[0] <= xe && point[1] >= ys && point[1] <= ye) {
        return this.isComponentSelected = true;
    }
    return this.isComponentSelected = false;
};

/**
 * Returns component height
 * @public
 */
app.model.LineShapeComponent.prototype.getHeight = function () {
    return (this.height / app.pixels_on_cm).toFixed(2);
};

/**
 * Sets new component height
 * @public
 */
app.model.LineShapeComponent.prototype.setHeight = function (height) {
    this.height = Math.round(height * app.pixels_on_cm);
    this.generateShapePoints();
    this.transformPoints();
};

/**
 * @override
 */
app.model.LineShapeComponent.prototype.importComponentData = function (componentModel) {
    this.height = componentModel.height;
    app.model.LineShapeComponent.base(this, 'importComponentData', componentModel);
};