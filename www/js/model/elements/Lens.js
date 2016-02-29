goog.provide('app.model.Lens');

goog.require('app.model.LineShapeComponent');
/**
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @final
 * @constructor
 * @extends {app.model.LineShapeComponent}
 * Sources:
 * https://www.google.cz/search?q=rozptylka&espv=2&biw=1920&bih=979&tbm=isch&source=lnms&sa=X&ved=0ahUKEwiX2MqH1_TKAhVDJ5oKHRzID6MQ_AUIBygB&dpr=1#imgrc=N_psa3FtWOpzFM%3A
 * https://www.youtube.com/watch?v=i20bzCUw464
 * https://www.khanacademy.org/science/physics/geometric-optics/mirrors-and-lenses/v/thin-lens-equation-and-problem-solving
 */
app.model.Lens = function(coordX, coordY) {
    app.model.Lens.base(this, 'constructor', coordX, coordY); // call parent constructor

    this._focusType = 'CONVERGING'; // DIVERSE

    this._focusOffset = 100;

    this.type = 'LENS';

    this._generateLensPoints();
    this.transformPoints();
};

goog.inherits(app.model.Lens, app.model.LineShapeComponent);

/**
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
 * @public
 */
app.model.Lens.prototype.getFocusOffset = function() {
    return (this._focusOffset / app.PIXEL_ON_CM).toFixed(2);
};

/**
 * @public
 */
app.model.Lens.prototype.setFocusOffset = function(offset) {
    this._focusOffset = Math.round(offset * app.PIXEL_ON_CM);
    this.generateShapePoints();
    this._generateLensPoints();
    this.transformPoints();
};

/**
 * @public
 */
app.model.Lens.prototype.getLensType = function() {
    return this._focusType;
};

/**
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
    this.height = Math.round(height * app.PIXEL_ON_CM);
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
    ctx.moveTo(this.transformedPoints[5][0], this.transformedPoints[5][1]);
    ctx.lineTo(this.transformedPoints[0][0], this.transformedPoints[0][1]);

    ctx.lineTo(this.transformedPoints[1][0], this.transformedPoints[1][1]);
    // bottom arrow
    ctx.moveTo(this.transformedPoints[6][0], this.transformedPoints[6][1]);
    ctx.lineTo(this.transformedPoints[1][0], this.transformedPoints[1][1]);
    ctx.moveTo(this.transformedPoints[7][0], this.transformedPoints[7][1]);
    ctx.lineTo(this.transformedPoints[1][0], this.transformedPoints[1][1]);
    ctx.stroke();

    if (this.isComponentSelected)
        ctx.lineWidth = 5;

    ctx.stroke();
    ctx.lineWidth = 1;
};

/**
 * @private
 */
app.model.Lens.prototype._getImagePosition = function(focus, obj) {
    var imgDis = Math.round(1/(1/focus - 1/Math.abs(obj[0])));
    var imgHeight = Math.round(Math.abs(obj[1])*(-imgDis/Math.abs(obj[0])));

    imgDis = (obj[0] < 0) ? imgDis : -imgDis;
    imgHeight = (obj[1] < 0) ?  -imgHeight : imgHeight;

    return this.transformPoint([imgDis, imgHeight]);
};

/**
 * @override
 */
app.model.Lens.prototype.intersect = function (rays, ray) {
    var point = this.reverseTransformPoint([this._intersectionRay[0], this._intersectionRay[1]]);
    var dVec = [], normDVec = [], imgPoint;

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
    normDVec = this.normalize2DVector(dVec);

    this._intersectionRay[0] = this.intersectionPoint[0];
    this._intersectionRay[1] = this.intersectionPoint[1];
    this._intersectionRay[3] = normDVec[0];
    this._intersectionRay[4] = normDVec[1];
    rays.push(this._intersectionRay);

    ray[7] += this.newRayLength;
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
