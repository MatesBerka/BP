goog.provide('app.shapes.Line');

goog.require('app.shapes.Shape');

/**
 * @constructor
 * @extends {app.shapes.Shape}
 */
app.shapes.Line = function() {};

app.shapes.Line.prototype._generateShapePoints = function() {
    var x = 0, y = 0, z = 0;

    this._originPoints = [];
    y = y - Math.floor(this._height / 2);
    this._originPoints.push([x, y, z]);

    y += this._height;
    this._originPoints.push([x, y, z]);
};

app.shapes.Line.prototype.isIntersection = function(ray) {
    //https://rootllama.wordpress.com/2014/06/20/ray-line-segment-intersection-test-in-2d/#comments
    var numerator, denominator, t1, t2, v1, v2, v3, ix, iy, a, b,
        length = Infinity;

    a = this._transformedPoints[0];
    b = this._transformedPoints[1];

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

    if(ix == ray[0] && iy == ray[1])
        return length;

    // is intersection
    length = Math.sqrt(Math.pow(Math.abs(ix - ray[0]), 2) + Math.pow(Math.abs(iy - ray[1]), 2));
    if(length < this._rayMinLength)
        return Infinity;

    this._intersectionRay = ray.slice();
    this._intersectionPoint = [ix, iy];
    this._newRayLength = length;

    return length;
};

app.shapes.Line.prototype.draw = function(ctx, callback) {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(this._transformedPoints[0][0], this._transformedPoints[0][1]);
    ctx.lineTo(this._transformedPoints[1][0], this._transformedPoints[1][1]);
    ctx.stroke();

    if (this._isSelected)
        ctx.lineWidth = 5;

    ctx.stroke();
    ctx.lineWidth = 1;
};

app.shapes.Line.prototype.isSelected = function(x, y) {
    //http://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection
    var point = this._reverseTransformPoint([x, y]),
        xs = -5, ys = -Math.floor(this._height / 2), xe = 5, ye = Math.floor(this._height / 2);

    if (point[0] >= xs && point[0] <= xe && point[1] >= ys && point[1] <= ye) {
        return this._isSelected = true;
    }
    return this._isSelected = false;
};