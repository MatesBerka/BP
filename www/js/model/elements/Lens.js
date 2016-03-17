goog.provide('app.model.Lens');

goog.require('app.model.LineShapeComponent');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @final
 * @constructor
 * @extends {app.model.LineShapeComponent}
 * This class represents Lens component.
 */
app.model.Lens = function(coordX, coordY) {
    app.model.Lens.base(this, 'constructor', coordX, coordY, 'LENS'); // call parent constructor
    /**
     * Defines lens type (CONVERGING or DIVERSE)
     * @type {!string}
     * @private
     */
    this._focusType = 'CONVERGING';
    /**
     * Defines focus offset in pixels.
     * @type {!number}
     * @private
     */
    this._focusOffset = 100;

    this._generateLensPoints();
    this.transformPoints();
};

goog.inherits(app.model.Lens, app.model.LineShapeComponent);

/**
 * Generates points specific to lens component, focus offsets and arrows
 * @private
 */
app.model.Lens.prototype._generateLensPoints = function () {

    // focuses
    this.originPoints.push([-this._focusOffset, 0, 0]);
    this.originPoints.push([this._focusOffset, 0, 0]);

    // arrows
    var y;
    if(this._focusType === 'CONVERGING') {
        y = -Math.floor(this.height/2) + 10;
        this.originPoints.push([10,y,0]);
        this.originPoints.push([-10,y,0]);
        y = -y;
        this.originPoints.push([10,y,0]);
        this.originPoints.push([-10,y,0]);
    } else {
        y = -Math.floor(this.height/2) - 10;
        this.originPoints.push([10,y,0]);
        this.originPoints.push([-10,y,0]);
        y = -y;
        this.originPoints.push([10,y,0]);
        this.originPoints.push([-10,y,0]);
    }
};

/**
 * returns new focus offset
 * @public
 */
app.model.Lens.prototype.getFocusOffset = function() {
    return (this._focusOffset / app.pixels_on_cm).toFixed(2);
};

/**
 * Sets new focus offset
 * @public
 */
app.model.Lens.prototype.setFocusOffset = function(offset) {
    this._focusOffset = Math.round(offset * app.pixels_on_cm);
    this.generateShapePoints();
    this._generateLensPoints();
    this.transformPoints();
};

/**
 * Returns lens type (CONVERGING or DIVERSE)
 * @public
 */
app.model.Lens.prototype.getLensType = function() {
    return this._focusType;
};

/**
 * Sets lens type (CONVERGING or DIVERSE)
 * @public
 */
app.model.Lens.prototype.setLensType = function(type) {
    this._focusType = type;
    this.generateShapePoints();
    this._generateLensPoints();
    this.transformPoints();
};

/**
 * @override
 */
app.model.Lens.prototype.setHeight = function(height) {
    this.height = Math.round(height * app.pixels_on_cm);
    this.generateShapePoints();
    this._generateLensPoints();
    this.transformPoints();
};

/**
 * @override
 */
app.model.Lens.prototype.draw = function(ctx, callback) {
    ctx.beginPath();
    ctx.lineWidth = 3;
    // top arrow
    ctx.moveTo(this.transformedPoints[4][0], this.transformedPoints[4][1]);
    ctx.lineTo(this.transformedPoints[0][0], this.transformedPoints[0][1]);
    ctx.lineTo(this.transformedPoints[5][0], this.transformedPoints[5][1]);
    ctx.moveTo(this.transformedPoints[0][0], this.transformedPoints[0][1]);

    ctx.lineTo(this.transformedPoints[1][0], this.transformedPoints[1][1]);
    // bottom arrow
    ctx.moveTo(this.transformedPoints[6][0], this.transformedPoints[6][1]);
    ctx.lineTo(this.transformedPoints[1][0], this.transformedPoints[1][1]);
    ctx.lineTo(this.transformedPoints[7][0], this.transformedPoints[7][1]);
    ctx.lineJoin = 'round';
    ctx.stroke();

    if (this.isComponentSelected)
        ctx.lineWidth = 5;

    ctx.stroke();
    ctx.lineWidth = 1;
};

/**
 * Calculates lens image position
 * @param {!number} focus
 * @param {Array<number>} obj
 * @private
 */
app.model.Lens.prototype._getImagePosition = function(focus, obj) {
    var denominator = (1/focus - 1/Math.abs(obj[0]));
    var imgDis = (denominator !== 0) ? Math.round(1/denominator) : Number.MAX_VALUE;
    var imgHeight = Math.abs(obj[1])*(-imgDis/ Math.abs(obj[0]));

    imgHeight = (imgHeight !== 0) ? imgHeight : Number.MAX_VALUE;
    imgDis = (obj[0] < 0) ? imgDis : -imgDis;
    imgHeight = (obj[1] < 0) ?  -imgHeight : imgHeight;

    return this.transformPoint([imgDis, imgHeight]);
};

/**
 * @override
 */
app.model.Lens.prototype.intersects = function (rays) {
    var point = this.reverseTransformPoint([this._intersectionRay[0], this._intersectionRay[1]]);
    var dVec = [], normDVec, imgPoint;

    if(this._focusType == 'CONVERGING') {
        imgPoint = this._getImagePosition(this._focusOffset, point);
        if(Math.abs(point[0]) < this._focusOffset) {
            dVec[0] = this.intersectionPoint[0] - imgPoint[0];
            dVec[1] = this.intersectionPoint[1] - imgPoint[1];
        } else {
            dVec[0] = imgPoint[0] - this.intersectionPoint[0];
            dVec[1] = imgPoint[1] - this.intersectionPoint[1];
        }
    } else {
        imgPoint = this._getImagePosition(-this._focusOffset, point);
        dVec[0] = this.intersectionPoint[0] - imgPoint[0];
        dVec[1] = this.intersectionPoint[1] - imgPoint[1];
    }
    normDVec = app.model.Component.normalize2DVector(dVec);

    this._intersectionRay[0] = this.intersectionPoint[0];
    this._intersectionRay[1] = this.intersectionPoint[1];
    this._intersectionRay[3] = normDVec[0];
    this._intersectionRay[4] = normDVec[1];
    this._intersectionRay[7] +=  this.newRayLength;
    rays.push(this._intersectionRay);

    return this.intersectionPoint;
};

/**
 * @param {!number} rotation
 * @param {!number} height
 * @param {!string} focusType
 * @param {!number} focusOffset
 * @override
 */
app.model.Lens.prototype.copyArguments = function(rotation, height, focusType, focusOffset) {
    this.appliedRotation = rotation;
    this.height = height;
    this._focusType = focusType;
    this._focusOffset = focusOffset;
    this.generateShapePoints();
    this._generateLensPoints();
    this.transformPoints();
};

/**
 * @param {!Object} componentModel
 * @override
 */
app.model.Lens.prototype.importComponentData = function (componentModel) {
    this.appliedRotation = componentModel.appliedRotation;
    this.height = componentModel.height;
    this._focusType = componentModel._focusType;
    this._focusOffset = componentModel._focusOffset;
    this.generateShapePoints();
    this._generateLensPoints();
    this.transformPoints();
};

/**
 * @override
 */
app.model.Lens.prototype.copy = function () {
    var copy = new app.model.Lens(this.appliedTranslationX, this.appliedTranslationY);
    copy.copyArguments(this.appliedRotation, this.height, this._focusType, this._focusOffset);
    return copy;
};
