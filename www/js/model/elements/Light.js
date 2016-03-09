goog.provide('app.model.Light');

goog.require('app.model.Component');

/**
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @final
 * @constructor
 * @extends {app.model.Component}
 */
app.model.Light = function (coordX, coordY) {
    this._size = 50;
    // only for beam light
    this.width = 10;

    app.model.Light.base(this, 'constructor', coordX, coordY); // call parent constructor
    // BEAM or CIRCLE
    this._lightType = 'BEAM';

    this._generatedRaysCount = 10;

    this._lightRadius = 30;

    this.type = 'LIGHT';

    this._lightID = -1;

    this.facesCount = 4;

    this.generateShapePoints();
    this.transformPoints();
};

goog.inherits(app.model.Light, app.model.Component);

/**
 * @override
 */
app.model.Light.prototype.generateShapePoints = function () {
    this.originPoints = [];
    if (this._lightType === 'CIRCLE') {
        this._generateBallShapePoints();
    } else {
        this._generateSquareShapePoints();
    }
};

/**
 * @private
 */
app.model.Light.prototype._generateBallShapePoints = function () {
    this.originPoints.push([0, 0, 0]);
};

/**
 * @private
 */
app.model.Light.prototype._generateSquareShapePoints = function () {
    var x = 0, y, z = 0;

    x = x - Math.round(this.width / 2);
    y = -Math.round(this._size / 2);
    this.originPoints.push([x, y, z]);

    x += this.width;
    this.originPoints.push([x, y, z]);

    y += this._size;
    this.originPoints.push([x, y, z]);

    x -= this.width;
    this.originPoints.push([x, y, z]);
};

/**
 * @see https://rootllama.wordpress.com/2014/06/20/ray-line-segment-intersection-test-in-2d/#comments
 * @param {!Array<number>} ray
 * @return {!number}
 * @private
 */
app.model.Light.prototype._squareIntersection = function (ray) {
    var numerator, denominator, t1, t2, v1, v2, v3, ix, iy, a, aIndex, b, bIndex,
        length, rayLength = Infinity;

    for (var i = 0; i < this.facesCount; i++) {
        aIndex = i;
        bIndex = (i + 1) % 4;

        a = this.transformedPoints[aIndex];
        b = this.transformedPoints[bIndex];

        v1 = [ray[0] - a[0], ray[1] - a[1]];
        v2 = [b[0] - a[0], b[1] - a[1]];
        v3 = [-ray[4], ray[3]];

        numerator = v2[0] * v1[1] - v1[0] * v2[1];
        denominator = v2[0] * v3[0] + v2[1] * v3[1];
        t1 = numerator / denominator;

        if (t1 < 0)
            continue;

        numerator = v1[0] * v3[0] + v1[1] * v3[1];
        t2 = numerator / denominator;
        if (t2 < 0 || t2 > 1)
            continue;

        // is intersection
        ix = ray[0] + ray[3] * t1;
        iy = ray[1] + ray[4] * t1;

        length = Math.sqrt(Math.pow(Math.abs(ix - ray[0]), 2) + Math.pow(Math.abs(iy - ray[1]), 2));
        if (length < rayLength) {
            rayLength = length;
            this.intersectionPoint = [ix, iy];
        }
    }

    if (rayLength < app.model.Component.RAY_MIN_LENGTH)
        return Infinity;
    else
        return rayLength;
};

/**
 * @see http://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
 * t2( dx2 + dy2 ) + 2t( exdx + eydy - dxh - dyk ) + ex2 + ey2 - 2exh - 2eyk + h2 + k2 - r2 = 0
 * @param {!Array<number>} ray
 * @return {!number}
 * @private
 */
app.model.Light.prototype._circleIntersection = function (ray) {
    var a, b, c, dis, x1, point = [], length = Infinity, imgPointOffset  = 100000,
    dirX = imgPointOffset * ray[3], dirY = imgPointOffset * ray[4];

    a = Math.pow(dirX, 2) + Math.pow(dirY, 2);
    b = 2 * (ray[0] * dirX + ray[1] * dirY - dirX * this.transformedPoints[0][0] - dirY * this.transformedPoints[0][1]);
    c = ray[0] * ray[0] + ray[1] * ray[1] - 2 * ray[0] * this.transformedPoints[0][0] - 2 * ray[1] * this.transformedPoints[0][1] +
        Math.pow(this.transformedPoints[0][0], 2) + Math.pow(this.transformedPoints[0][1], 2) - Math.pow(this._size, 2);

    dis = b * b - 4 * a * c;
    if (dis < 0)
        return length;

    dis = Math.sqrt(dis);
    x1 = (-b - dis) / (2 * a);

    if (x1 >= 0 && x1 <= 1) {
        point[0] = ray[0] + dirX * x1;
        point[1] = ray[1] + dirY * x1;
        length = Math.sqrt(Math.pow(Math.abs(point[0] - ray[0]), 2) + Math.pow(Math.abs(point[1] - ray[1]), 2));
        this.intersectionPoint = point;
        return length;
    }

    return Infinity;
};

/**
 * @override
 */
app.model.Light.prototype.isIntersection = function (ray) {
    if (this._lightType === 'BEAM') {
        return this._squareIntersection(ray);
    } else {
        return this._circleIntersection(ray);
    }
};

/**
 * @param {!Array<number>} point
 * @return {!boolean}
 * @private
 */
app.model.Light.prototype._isSquareSelected = function (point) {
    var xs = -Math.floor(this.width / 2), ys = -Math.floor(this._size / 2), xe = Math.floor(this.width / 2),
        ye = Math.floor(this._size / 2);

    if (point[0] >= xs && point[0] <= xe && point[1] >= ys && point[1] <= ye) {
        return this.isComponentSelected = true;
    }
    return this.isComponentSelected = false;
};

/**
 * Source:
 * @see http://math.stackexchange.com/questions/198764/how-to-know-if-a-point-is-inside-a-circle
 * @param {!Array<number>} point
 * @return {!boolean}
 * @private
 */
app.model.Light.prototype._isCircleSelected = function (point) {
    var d = Math.sqrt(Math.pow((point[0] - this.originPoints[0][0]), 2) + Math.pow((point[1] - this.originPoints[0][1]), 2));
    return (d <= this._size);
};

/**
 * @override
 */
app.model.Light.prototype.isSelected = function (x, y) {
    var point = this.reverseTransformPoint([x, y]);

    if (this._lightType === 'BEAM') {
        return this.isComponentSelected = this._isSquareSelected(point);
    } else {
        return this.isComponentSelected = this._isCircleSelected(point);
    }
};

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @private
 */
app.model.Light.prototype._drawBall = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.transformedPoints[0][0], this.transformedPoints[0][1], this._size, 0, Math.PI * 2, true);

    if (this.isComponentSelected) {
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;
    } else {
        ctx.stroke();
    }
};

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @private
 */
app.model.Light.prototype._drawBeam = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.transformedPoints[0][0], this.transformedPoints[0][1]);
    ctx.lineTo(this.transformedPoints[1][0], this.transformedPoints[1][1]);
    ctx.lineTo(this.transformedPoints[2][0], this.transformedPoints[2][1]);
    ctx.lineTo(this.transformedPoints[3][0], this.transformedPoints[3][1]);
    ctx.lineTo(this.transformedPoints[0][0], this.transformedPoints[0][1]);

    if (this.isComponentSelected) {
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
app.model.Light.prototype.draw = function (ctx, callback) {
    var x, y, dx, dy, vec1, vec2, indentation, i, degree, radians, halfSize = (this._size / 2);
    if (this._lightType === 'BEAM') {
        this._drawBeam(ctx);
        indentation = this._size / this._generatedRaysCount;
        x = Math.floor(this.width / 2);
        for (i = 0; i < this._generatedRaysCount; i++) {
            y = i * indentation - halfSize + (indentation / 2);
            vec1 = this.transformPoint([x, y, 0]);
            vec2 = this.transformPoint([(x + 1), y, 0]);
            dx = vec2[0] - vec1[0];
            dy = vec2[1] - vec1[1];
            callback([vec1[0], vec1[1], 0, dx, dy, 0, this._lightID, 0]);
        }
    } else {
        this._drawBall(ctx);
        indentation = ((2 * this._lightRadius) % 361) / this._generatedRaysCount;
        for (i = 0; i < this._generatedRaysCount; i++) {
            degree = this._lightRadius - i * indentation;
            radians = degree * (Math.PI / 180);
            vec1 = this.transformPoint([0, 0]);
            vec2 = this.rotatePoint([1, 0], radians);
            vec2 = this.transformPoint(vec2);
            dx = vec2[0] - vec1[0];
            dy = vec2[1] - vec1[1];
            callback([vec1[0], vec1[1], 0, dx, dy, 0, this._lightID, 0]);
        }
    }
};

/**
 * @param {!number} rotation
 * @param {!number} size
 * @param {!string} lightType
 * @param {!number} generatedRaysCount
 * @param {!number} lightRadius
 * @override
 */
app.model.Light.prototype.copyArguments = function (rotation, size, lightType, generatedRaysCount, lightRadius) {
    this.appliedRotation = rotation;
    this._size = size;
    this._lightType = lightType;
    this._generatedRaysCount = generatedRaysCount;
    this._lightRadius = lightRadius;
    this.generateShapePoints();
    this.transformPoints();
};

/**
 * @param {!Object} componentModel
 * @public
 */
app.model.Light.prototype.importComponentData = function (componentModel) {
    this.appliedRotation = componentModel.appliedRotation;
    this._size = componentModel._size;
    this._lightType = componentModel._lightType;
    this._generatedRaysCount = componentModel._generatedRaysCount;
    this._lightRadius = componentModel._lightRadius;
    this.generateShapePoints();
    this.transformPoints();
};

/**
 * @override
 */
app.model.Light.prototype.copy = function () {
    var copy = new app.model.Light(this.appliedTranslationX, this.appliedTranslationY);
    copy.copyArguments(this.appliedRotation, this._size, this._lightType, this._generatedRaysCount, this._lightRadius);
    return copy;
};

/**
 * @return {!string}
 * @public
 */
app.model.Light.prototype.getSize = function () {
    return (this._size / app.PIXELS_ON_CM).toFixed(2);
};

/**
 * @param {!number} size
 * @public
 */
app.model.Light.prototype.setSize = function (size) {
    this._size = Math.round(size * app.PIXELS_ON_CM);
    this.generateShapePoints();
    this.transformPoints();
};

/**
 * @return {!number}
 * @public
 */
app.model.Light.prototype.getRaysCount = function () {
    return this._generatedRaysCount;
};

/**
 * @param {!number} count
 * @public
 */
app.model.Light.prototype.setRaysCount = function (count) {
    this._generatedRaysCount = count;
};

/**
 * @return {!string}
 * @public
 */
app.model.Light.prototype.getLightType = function () {
    return this._lightType;
};

/**
 * @param {!string} type
 * @public
 */
app.model.Light.prototype.setLightType = function (type) {
    this._lightType = type;
    this.generateShapePoints();
    this.transformPoints();
};

/**
 * @return {!number}
 * @public
 */
app.model.Light.prototype.getRadius = function () {
    return this._lightRadius;
};

/**
 * @param {!number} radius
 * @public
 */
app.model.Light.prototype.setRadius = function (radius) {
    this._lightRadius = radius;
};

/**
 * @param {!number} lightID
 * @public
 */
app.model.Light.prototype.setLightID = function (lightID) {
    return this._lightID = lightID;
};

/**
 * @return {!number}
 * @public
 */
app.model.Light.prototype.getLightID = function () {
    return this._lightID;
};
