goog.provide('app.model.RectangleShapeComponent');

goog.require('app.model.Component');

/**
 * @param {number} coordX - component x position
 * @param {number} coordY - component Y position
 * @constructor
 * @extends {app.model.Component}
 */
app.model.RectangleShapeComponent = function(coordX, coordY) {
    /**
     * Used to define component width
     * @type {!number}
     * @protected
     */
    this.width = 10;
    /**
     * Used to define component height
     * @type {!number}
     * @protected
     */
    this.height = 300;
    /**
     * Used to define number of component faces
     * @type {!number}
     * @protected
     */
    this.facesCount = 4;

    app.model.RectangleShapeComponent.base(this, 'constructor', coordX, coordY); // call parent constructor
};

goog.inherits(app.model.RectangleShapeComponent, app.model.Component);

/**
 * @override
 */
app.model.RectangleShapeComponent.prototype.generateShapePoints = function() {
    var x = 0, y = 0, z = 0;

    this.originPoints = [];
    x = x - Math.floor(this.width/2);
    y = y - Math.floor(this.height/2);
    this.originPoints.push([x,y,z]);

    x += this.width;
    this.originPoints.push([x,y,z]);

    y += this.height;
    this.originPoints.push([x,y,z]);

    x -= this.width;
    this.originPoints.push([x,y,z]);
};

/**
 * @override
 */
app.model.RectangleShapeComponent.prototype.isIntersection = function(ray) {
    var numerator, denominator, t1, t2, v1, v2, v3, ix, iy, a, aIndex, b, bIndex,
        length, rayLength = Infinity;

    for(var i = 0; i < this.facesCount; i++) {
        aIndex = i;
        bIndex = (i+1)%4;

        a = this.transformedPoints[aIndex];
        b = this.transformedPoints[bIndex];

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
            this.intersectionPoint = [ix, iy];
        }
    }
    return rayLength;
};

/**
 * @override
 */
app.model.RectangleShapeComponent.prototype.draw = function(ctx, callback) {
    ctx.beginPath();
    ctx.moveTo(this.transformedPoints[0][0], this.transformedPoints[0][1]);
    ctx.lineTo(this.transformedPoints[1][0], this.transformedPoints[1][1]);
    ctx.lineTo(this.transformedPoints[2][0], this.transformedPoints[2][1]);
    ctx.lineTo(this.transformedPoints[3][0], this.transformedPoints[3][1]);
    ctx.lineTo(this.transformedPoints[0][0], this.transformedPoints[0][1]);
    ctx.stroke();

    if(this.isComponentSelected) {
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;
    } else {
        ctx.stroke();
    }
};

/**
 * @override
 */
app.model.RectangleShapeComponent.prototype.isSelected = function(x, y) {
    var point = this.reverseTransformPoint([x,y]),
        xs = -Math.floor(this.width/2), ys = -Math.floor(this.height/2), xe = Math.floor(this.width/2),
        ye = Math.floor(this.height/2);

    if(point[0] >= xs && point[0] <= xe && point[1] >= ys && point[1] <= ye) {
        return this.isComponentSelected = true;
    }
    return this.isComponentSelected = false;
};

/**
 * @return {!string}
 * @public
 */
app.model.RectangleShapeComponent.prototype.getHeight = function() {
    return (this.height / app.PIXEL_ON_CM).toFixed(2);
};

/**
 * @param {!number} height
 * @public
 */
app.model.RectangleShapeComponent.prototype.setHeight = function(height) {
    this.height = Math.round(height * app.PIXEL_ON_CM);
    this.generateShapePoints();
    this.transformPoints();
};

/**
 * @return {!string}
 * @public
 */
app.model.RectangleShapeComponent.prototype.getWidth = function() {
    return (this.width / app.PIXEL_ON_CM).toFixed(2);
};

/**
 * @param {!number} width
 * @public
 */
app.model.RectangleShapeComponent.prototype.setWidth = function(width) {
    this.width = Math.round(width * app.PIXEL_ON_CM);
    this.generateShapePoints();
    this.transformPoints();
};