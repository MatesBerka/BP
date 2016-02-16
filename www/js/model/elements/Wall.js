goog.provide('app.model.Wall');

goog.require('app.model.Component');
/**
 * @constructor
 * @extends {app.Parent}
 */
app.model.Wall = function(coordX, coordY) {
    this._width = 10;

    this._height = 300;

    this._wallsCount = 4;

    this._type = 'WALL';

    app.model.Wall.base(this, 'constructor', coordX, coordY); // call parent constructor
};

goog.inherits(app.model.Wall, app.model.Component);

app.model.Wall.prototype._generateShapePoints = function() {
    var x = 0, y = 0, z = 0;

    x = x - Math.floor(this._width/2);
    y = y - Math.floor(this._height/2);
    this._originPoints.push([x,y,z]);

    x += this._width;
    this._originPoints.push([x,y,z]);

    y += this._height;
    this._originPoints.push([x,y,z]);

    x -= this._width;
    this._originPoints.push([x,y,z]);
};

app.model.Wall.prototype.isIntersection = function(ray) {
    //https://rootllama.wordpress.com/2014/06/20/ray-line-segment-intersection-test-in-2d/#comments
    var numerator, denominator, t1, t2, v1, v2, v3, ix, iy, a, aIndex, b, bIndex,
        length, rayLength = Infinity;

    for(var i = 0; i < this._wallsCount; i++) {
        aIndex = i;
        bIndex = (i+1)%4;

        a = this._transformedPoints[aIndex];
        b = this._transformedPoints[bIndex];

        v1 = [ray[0] - a[0], ray[1] - a[1]];
        v2 = [b[0] - a[0], b[1] - a[1]];
        v3 = [-ray[4], ray[3]];

        numerator = v2[0]*v1[1] - v1[0]*v2[1];
        denominator = v2[0]*v3[0] + v2[1]*v3[1];
        t1 = numerator/denominator;

        if(t1 < 0)
            continue;

        numerator = v1[0]*v3[0] + v1[1]*v3[1];
        t2 = numerator/denominator;
        if(t2 < 0 || t2 > 1)
            continue;

        // is intersection
        ix = ray[0] + ray[3]*t1;
        iy = ray[1] + ray[4]*t1;

        length = Math.sqrt(Math.pow(Math.abs(ix - ray[0]), 2) + Math.pow(Math.abs(iy - ray[1]), 2));
        if(length < rayLength) {
            rayLength = length;
            this._intersectionPoint = [ix, iy];
        }
    }
    return rayLength;
};

app.model.Wall.prototype.intersect = function(rays) {
    return this._intersectionPoint;
};

app.model.Wall.prototype.draw = function(ctx, callback) {
    //TODO alternative is to draw rectangle ctx.rect(20,20,150,100);

    ctx.beginPath();
    ctx.moveTo(this._transformedPoints[0][0], this._transformedPoints[0][1]);
    ctx.lineTo(this._transformedPoints[1][0], this._transformedPoints[1][1]);
    ctx.lineTo(this._transformedPoints[2][0], this._transformedPoints[2][1]);
    ctx.lineTo(this._transformedPoints[3][0], this._transformedPoints[3][1]);
    ctx.lineTo(this._transformedPoints[0][0], this._transformedPoints[0][1]);
    ctx.stroke();

    if(this._isSelected) {
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;
    } else {
        ctx.stroke();
    }
};

app.model.Wall.prototype.isSelected = function(x, y) {
    //http://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection
    var point = this._reverseTransformPoint([x,y]),
        xs = -Math.floor(this._width/2), ys = -Math.floor(this._height/2), xe = Math.floor(this._width/2),
        ye = Math.floor(this._height/2);

    if(point[0] >= xs && point[0] <= xe && point[1] >= ys && point[1] <= ye) {
        return this._isSelected = true;
    }
    return this._isSelected = false;
};
