goog.provide('app.model.HolographicPlate');

goog.require('app.model.LineShapeComponent');

/**
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @final
 * @constructor
 * @extends {app.model.LineShapeComponent}
 */
app.model.HolographicPlate = function (coordX, coordY) {
    app.model.HolographicPlate.base(this, 'constructor', coordX, coordY); // call parent constructor
    /** @override */
    this.type = 'HOLO-PLATE';
    /**
     * @type {!boolean}
     * @private
     */
    this._makeRecord = false;
    /**
     * todo also add remove record?
     * @type {!boolean}
     * @private
     */
    this._showRecord = false;
    /**
     * How big is group size in PX
     * @type {!number}
     * @private
     */
    this._groupSize = 10;
    /**
     * The maximum angels difference of two rays
     * @type {!number}
     * @private
     */
    this._angleErrorTolerence = 3;
    /**
     * TODO not used now
     * ID of reference Light
     * @type {!number}
     * @private
     */
    this._refLightID = 0;
    /**
     * Incoming rays
     * @type {!Array<Object>}
     * @private
     */
    this._recordedRays = [];
    /**
     * IDs of of used groups on desk
     * @type {!Array<!Object>}
     * @private
     */
    this._usedGroups = [];
    /**
     * IDs of light sources which are hitting this desk
     * @type {!Object}
     * @private
     */
    this._lightSources = {};

    this.transformPoints();
};

goog.inherits(app.model.HolographicPlate, app.model.LineShapeComponent);

/**
 * @returns {!string}
 * @public
 */
app.model.HolographicPlate.prototype.getPlateResolution = function() {
    return (this._groupSize / app.PIXEL_ON_CM).toFixed(2);
};

/**
 * @param {!number} resolution
 * @public
 */
app.model.HolographicPlate.prototype.setPlateResolution = function(resolution) {
    this._groupSize = Math.round(resolution * app.PIXEL_ON_CM);
};

/**
 * @returns {!number}
 * @public
 */
app.model.HolographicPlate.prototype.getAngleTolerance = function() {
    return this._angleErrorTolerence;
};
/**#
 * @param {!number} tolerance
 * @public
 */
app.model.HolographicPlate.prototype.setAngleTolerance = function(tolerance) {
    this._angleErrorTolerence = tolerance;
};

/**
 * @param {!number} refLightID
 * @public
 */
app.model.HolographicPlate.prototype.makeRecord = function (refLightID) {
    this._recordedRays = [];
    this._usedGroups = [];
    this._makeRecord = true;
    this._showRecord = false;
    this._refLightID = refLightID;
};

/**
 * @public
 */
app.model.HolographicPlate.prototype.showRecord = function () {
    this._makeRecord = false;
    this._showRecord = true;
};

/**
 * @private
 */
app.model.HolographicPlate.prototype._getAngle = function () {
    var a = [], b = [], cosAlpha, angle;

    a[0] = this._intersectionRay[0] - this.intersectionPoint[0];
    a[1] = this._intersectionRay[1] - this.intersectionPoint[1];
    b[0] = this.transformedPoints[0][0] - this.intersectionPoint[0];
    b[1] = this.transformedPoints[0][1] - this.intersectionPoint[1];

    cosAlpha = (a[0] * b[0] + a[1] * b[1]) / (Math.sqrt(a[0] * a[0] + a[1] * a[1]) * Math.sqrt(b[0] * b[0] + b[1] * b[1]));
    angle = Math.acos(cosAlpha) * (180 / Math.PI);
    angle = (angle > 90) ? (angle % 90) : (90 - angle);
    return Math.round(angle);
};

/**
 * @private
 */
app.model.HolographicPlate.prototype._recordRay = function () {
    var point = this.reverseTransformPoint([this.intersectionPoint[0], this.intersectionPoint[1]]);
    var groupID = Math.round((Math.round(this.height / 2) + point[1]) / this._groupSize);
    var rayAngle = this._getAngle();

    this._intersectionRay[0] = point[0];
    this._intersectionRay[1] = point[1];

    // and finally add
    if (this._recordedRays[groupID] === undefined) {
        this._recordedRays[groupID] = {};
        this._recordedRays[groupID][rayAngle] = [];
    } else {
        var angle, match = false;
        for (angle in this._recordedRays[groupID]) {
            if ((parseInt(angle, 10) - this._angleErrorTolerence) < rayAngle
                && rayAngle < (parseInt(angle, 10) + this._angleErrorTolerence)) {
                this._recordedRays[groupID][angle].push(this._intersectionRay);
                match = true;
                break;
            }
        }
        if (!match) this._recordedRays[groupID][rayAngle] = [this._intersectionRay];
    }
};

/**
 * @private
 */
app.model.HolographicPlate.prototype._checkRecordedRays = function (rays) {
    // which group
    var point = this.reverseTransformPoint([this.intersectionPoint[0], this.intersectionPoint[1]]);
    var groupID = Math.floor((Math.floor(this.height / 2) + point[1]) / this._groupSize);
    var angle, rayAngle = this._getAngle(), storedRays, rayImage, newOrigin, dirPoint;

    if (this._recordedRays[groupID] !== undefined) {
        if (this._usedGroups[groupID] === undefined) this._usedGroups[groupID] = {};
        for (angle in this._recordedRays[groupID]) {
            if ((parseInt(angle, 10) - this._angleErrorTolerence) < rayAngle
                && rayAngle < (parseInt(angle, 10) + this._angleErrorTolerence)) {
                rayAngle = angle;

                for (angle in this._recordedRays[groupID]) {
                    if (angle != rayAngle && this._usedGroups[groupID][angle] === undefined) {
                        this._usedGroups[groupID][angle] = 1;
                        storedRays = this._recordedRays[groupID][angle];
                        for (var i = 0; i < storedRays.length; i++) {
                            rayImage = storedRays[i].slice();
                            newOrigin = this.transformPoint([rayImage[0], rayImage[1]]);
                            dirPoint = this.transformPoint([(rayImage[0] + rayImage[3]), (rayImage[1] - rayImage[4])]);
                            rayImage[0] = newOrigin[0];
                            rayImage[1] = newOrigin[1];
                            rayImage[3] = dirPoint[0] - newOrigin[0];
                            rayImage[4] = dirPoint[1] - newOrigin[1];
                            rays.push(rayImage);
                        }
                    }
                }
                break;
            }
        }
    }
};

/**
 * @override
 */
app.model.HolographicPlate.prototype.intersect = function (rays) {

    if (this._makeRecord)
        this._recordRay();

    if (this._showRecord)
        this._checkRecordedRays(rays);

    // todo is it used? (_lightSources)
    this._lightSources[this._intersectionRay[6]] = 1;

    return this.intersectionPoint;
};

/**
 * @override
 */
app.model.HolographicPlate.prototype.draw = function (ctx, callback) {
    if (this._showRecord)
        this._usedGroups = [];

    this._lightSources = {};
    app.model.HolographicPlate.base(this, 'draw', ctx, callback);
};

/**
 * @param {!number} rotation
 * @param {!number} height
 * @param {!number} groupSize
 * @param {!number} angleErrorTolerance
 * @override
 */
app.model.HolographicPlate.prototype.copyArguments = function (rotation, height, groupSize, angleErrorTolerance) {
    this.appliedRotation = rotation;
    this.height = height;
    this._groupSize = groupSize;
    this._angleErrorTolerence = angleErrorTolerance;
    this.transformPoints();
};

/**
 * @override
 */
app.model.HolographicPlate.prototype.copy = function () {
    var copy = new app.model.HolographicPlate(this.appliedTranslationX, this.appliedTranslationY);
    copy.copyArguments(this.appliedRotation, this.height, this._groupSize, this._angleErrorTolerence);
    return copy;
};