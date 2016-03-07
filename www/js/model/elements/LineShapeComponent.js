goog.provide('app.model.LineShapeComponent');

goog.require('app.model.Component');

/**
 * @param {number} coordX - component x position
 * @param {number} coordY - component Y position
 * @constructor
 * @extends {app.model.Component}
 */
app.model.LineShapeComponent = function (coordX, coordY) {
    /**
     * Used to define component height
     * @type {!number}
     * @protected
     */
    this.height = 300;

    app.model.LineShapeComponent.base(this, 'constructor', coordX, coordY); // call parent constructor
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
 * @override
 */
app.model.LineShapeComponent.prototype.isIntersection = function (ray) {
    var numerator, denominator, t1, t2, v1, v2, v3, ix, iy, a, b,
        length = Infinity;

    a = this.transformedPoints[0];
    b = this.transformedPoints[1];

    v1 = [ray[0] - a[0], ray[1] - a[1]];
    v2 = [b[0] - a[0], b[1] - a[1]];
    v3 = [-ray[4], ray[3]];

    numerator = v2[0] * v1[1] - v1[0] * v2[1];
    denominator = v2[0] * v3[0] + v2[1] * v3[1];
    t1 = numerator / denominator;

    if (t1 < 0)
        return length;

    numerator = v1[0] * v3[0] + v1[1] * v3[1];
    t2 = numerator / denominator;
    if (t2 < 0 || t2 > 1)
        return length;

    ix = Math.round(ray[0] + ray[3] * t1);
    iy = Math.round(ray[1] + ray[4] * t1);

    if (ix == ray[0] && iy == ray[1])
        return length;

    // is intersection
    length = Math.sqrt(Math.pow(Math.abs(ix - ray[0]), 2) + Math.pow(Math.abs(iy - ray[1]), 2));
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
 * @public
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
 * @public
 */
app.model.LineShapeComponent.prototype.getHeight = function () {
    return (this.height / app.PIXELS_ON_CM).toFixed(2);
};

/**
 * @public
 */
app.model.LineShapeComponent.prototype.setHeight = function (height) {
    this.height = Math.round(height * app.PIXELS_ON_CM);
    this.generateShapePoints();
    this.transformPoints();
};