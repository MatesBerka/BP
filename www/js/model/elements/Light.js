goog.provide('app.model.Light');

goog.require('app.model.Component');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @final
 * @constructor
 * @extends {app.model.Component}
 * This class represents Light component.
 */
app.model.Light = function (coordX, coordY) {
    /**
     * Light size (radius/height)
     * @type {!number}
     * @private
     */
    this._size = 50;
    /**
     * Only for beam light.
     * @const
     * @type {!number}
     * @private
     */
    this._WIDTH = 10;
    // call parent constructor
    app.model.Light.base(this, 'constructor', coordX, coordY, 'LIGHT');
    /**
     * BEAM or CIRCLE
     * @type {!string}
     * @private
     */
    this._lightType = 'BEAM';
    /**
     * How many rays should light generate
     * @type {!number}
     * @private
     */
    this._generatedRaysCount = 5;
    /**
     * Light radius used for CIRCLE light 30 = 60 degrees in summary
     * @type {!number}
     * @private
     */
    this._lightRadius = 30;
    /**
     * Light wave length
     * @type {!number}
     * @private
     */
    this._lightLength = 550;
    /**
     * Used during intersection check to check all sides
     * @const
     * @type {!number}
     * @private
     */
    this._FACES_COUNT = 4;

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
        this._generateCircleShapePoints();
    } else {
        this._generateSquareShapePoints();
    }
};

/**
 * Generates shape points which circle shape
 * @private
 */
app.model.Light.prototype._generateCircleShapePoints = function () {
    this.originPoints.push([0, 0, 0]);
};

/**
 *  Generates shape points which square shape
 * @private
 */
app.model.Light.prototype._generateSquareShapePoints = function () {
    var x = 0, y, z = 0;

    x = x - Math.round(this._WIDTH / 2);
    y = -Math.round(this._size / 2);
    this.originPoints.push([x, y, z]);

    x += this._WIDTH;
    this.originPoints.push([x, y, z]);

    y += this._size;
    this.originPoints.push([x, y, z]);

    x -= this._WIDTH;
    this.originPoints.push([x, y, z]);
};

/**
 * Checks if ray intersects squared light
 * @see https://rootllama.wordpress.com/2014/06/20/ray-line-segment-intersection-test-in-2d/#comments
 * @param {!Array<number>} ray
 * @return {!number}
 * @private
 */
app.model.Light.prototype._squareIntersection = function (ray) {
    var numerator, denominator, t1, t2, v1, v2, v3, ix, iy, a, aIndex, b, bIndex,
        length, rayLength = Infinity;

    for (var i = 0; i < this._FACES_COUNT; i++) {
        aIndex = i;
        bIndex = (i + 1) % 4;

        a = this.transformedPoints[aIndex];
        b = this.transformedPoints[bIndex];

        v1 = [ray[app.RAY_ORIGIN_X] - a[0], ray[app.RAY_ORIGIN_Y] - a[1]];
        v2 = [b[0] - a[0], b[1] - a[1]];
        v3 = [-ray[app.RAY_DIRECTION_Y], ray[app.RAY_DIRECTION_X]];

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
        ix = ray[app.RAY_ORIGIN_X] + ray[app.RAY_DIRECTION_X] * t1;
        iy = ray[app.RAY_ORIGIN_Y] + ray[app.RAY_DIRECTION_Y] * t1;

        length = Math.sqrt(Math.pow(Math.abs(ix - ray[app.RAY_ORIGIN_X]), 2) + Math.pow(Math.abs(iy - ray[app.RAY_ORIGIN_Y]), 2));
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
 * @override
 */
app.model.Light.prototype.isIntersection = function (ray) {
    if (this._lightType === 'BEAM') {
        return this._squareIntersection(ray);
    } else {
        return Infinity;
    }
};

/**
 * Checks if point intersects squared light
 * @param {!Array<number>} point
 * @return {!boolean}
 * @private
 */
app.model.Light.prototype._isSquareSelected = function (point) {
    var xs = -Math.floor(this._WIDTH / 2), ys = -Math.floor(this._size / 2), xe = Math.floor(this._WIDTH / 2),
        ye = Math.floor(this._size / 2);

    if (point[0] >= xs && point[0] <= xe && point[1] >= ys && point[1] <= ye) {
        return true;
    }
    return false;
};

/**
 * Checks if point intersects squared light
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
 * Draws ring light on canvas
 * @param {!CanvasRenderingContext2D} ctx
 * @private
 */
app.model.Light.prototype._drawCircle = function (ctx) {
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
 * Draws squared light on canvas
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
        x = Math.floor(this._WIDTH / 2);
        for (i = 0; i < this._generatedRaysCount; i++) {
            y = i * indentation - halfSize + (indentation / 2);
            vec1 = this.transformPoint([x, y, 0]);
            vec2 = this.transformPoint([(x + 1), y, 0]);
            dx = vec2[0] - vec1[0];
            dy = vec2[1] - vec1[1];
            callback([vec1[0], vec1[1], 0, dx, dy, 0, '' + this._componentID, 0, this._lightLength]);
        }
    } else {
        this._drawCircle(ctx);
        indentation = ((2 * this._lightRadius) % 361) / this._generatedRaysCount;
        for (i = 0; i < this._generatedRaysCount; i++) {
            degree = this._lightRadius - i * indentation;
            radians = degree * (Math.PI / 180);
            vec1 = this.transformPoint([0, 0]);
            vec2 = this.rotatePoint([1, 0], radians);
            vec2 = this.transformPoint(vec2);
            dx = vec2[0] - vec1[0];
            dy = vec2[1] - vec1[1];
            callback([vec1[0], vec1[1], 0, dx, dy, 0, '' + this._componentID, 0, this._lightLength]);
        }
    }
};

/**
 * @override
 */
app.model.Light.prototype.importComponentData = function (componentModel) {
    this._size = componentModel._size;
    this._lightType = componentModel._lightType;
    this._generatedRaysCount = componentModel._generatedRaysCount;
    this._lightRadius = componentModel._lightRadius;
    app.model.Light.base(this, 'importComponentData', componentModel);
};

/**
 * @override
 */
app.model.Light.prototype.copy = function () {
    var copy = new app.model.Light(this.appliedTranslationX, this.appliedTranslationY);
    copy.importComponentData(this);
    return copy;
};

/**
 * Returns light size (radius/height) in cm
 * @return {!string}
 * @public
 */
app.model.Light.prototype.getSize = function () {
    return (this._size / app.pixels_on_cm).toFixed(2);
};

/**
 * Sets new light size (radius/height)
 * @param {!number} size
 * @public
 */
app.model.Light.prototype.setSize = function (size) {
    this._size = Math.round(size * app.pixels_on_cm);
    this.generateShapePoints();
    this.transformPoints();
};

/**
 * Returns light length (wave length)
 * @return {!number}
 * @public
 */
app.model.Light.prototype.getLightLength = function () {
    return this._lightLength;
};

/**
 * Sets new light length (wave length)
 * @param {!number} length
 * @public
 */
app.model.Light.prototype.setLightLength = function (length) {
    this._lightLength = length;
};

/**
 * Returns rays count
 * @return {!number}
 * @public
 */
app.model.Light.prototype.getRaysCount = function () {
    return this._generatedRaysCount;
};

/**
 * Sets new rays count
 * @param {!number} count
 * @public
 */
app.model.Light.prototype.setRaysCount = function (count) {
    this._generatedRaysCount = count;
};

/**
 * Return light type
 * @return {!string}
 * @public
 */
app.model.Light.prototype.getLightType = function () {
    return this._lightType;
};

/**
 * Sets new light type
 * @param {!string} type
 * @public
 */
app.model.Light.prototype.setLightType = function (type) {
    this._lightType = type;
    this.generateShapePoints();
    this.transformPoints();
};

/**
 * Returns light radius
 * @return {!number}
 * @public
 */
app.model.Light.prototype.getRadius = function () {
    return this._lightRadius;
};

/**
 * Sets new light radius
 * @param {!number} radius
 * @public
 */
app.model.Light.prototype.setRadius = function (radius) {
    this._lightRadius = radius;
};
