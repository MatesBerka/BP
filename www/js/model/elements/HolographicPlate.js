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
    this._groupSize = 30;
    /**
     * How many groups we have
     * @type {!number}
     * @private
     */
    this._groupsCount = Math.floor(this.height / this._groupSize);
    /**
     * The maximum angels difference of two rays
     * @type {!number}
     * @private
     */
    this._tolerance = 3;
    /**
     * @type {boolean}
     * @private
     */
    this._allRefLights = false;
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
     * IDs of light sources which are hitting this desk
     * @type {!Object}
     * @private
     */
    this._lightSources = {};

    this._generateGridPoints();
    this.transformPoints();
};

goog.inherits(app.model.HolographicPlate, app.model.LineShapeComponent);

app.model.HolographicPlate.prototype._generateGridPoints = function () {
    var x, y = 0, z = 0;
    // end points
    y = y - Math.floor(this.height / 2);
    x = 10;
    this.originPoints.push([x, y, z]);
    x = -x;
    this.originPoints.push([x, y, z]);
    y += this.height;
    this.originPoints.push([x, y, z]);
    x = 10;
    this.originPoints.push([x, y, z]);

    y = -Math.floor(this.height / 2);
    for (var i = 1; i <= this._groupsCount; i++) {
        y += this._groupSize;
        x = 6;
        this.originPoints.push([x, y, z]);
        x = -6;
        this.originPoints.push([x, y, z]);
    }
};

/**
 * @returns {!string}
 * @public
 */
app.model.HolographicPlate.prototype.getPlateResolution = function () {
    return (this._groupSize / app.PIXEL_ON_CM).toFixed(2);
};

/**
 * @public
 */
app.model.HolographicPlate.prototype.setHeight = function (height) {
    this.height = Math.round(height * app.PIXEL_ON_CM);
    this._groupsCount = Math.floor(this.height / this._groupSize);
    this.generateShapePoints();
    this._generateGridPoints();
    this.transformPoints();
};

/**
 * @param {!number} resolution
 * @public
 */
app.model.HolographicPlate.prototype.setPlateResolution = function (resolution) {
    this._groupSize = Math.round(resolution * app.PIXEL_ON_CM);
    this._groupsCount = Math.floor(this.height / this._groupSize);
    this.generateShapePoints();
    this._generateGridPoints();
    this.transformPoints();
};

/**
 * @returns {!string}
 * @public
 */
app.model.HolographicPlate.prototype.getTolerance = function () {
    return (this._tolerance / app.PIXEL_ON_CM).toFixed(2);
};
/**#
 * @param {!number} tolerance
 * @public
 */
app.model.HolographicPlate.prototype.setTolerance = function (tolerance) {
    this._tolerance = Math.round(tolerance * app.PIXEL_ON_CM);
};

/**
 * @public
 */
app.model.HolographicPlate.prototype.collectRays = function () {
    this._recordedRays = [];
    this._makeRecord = true;
    this._showRecord = false;
};

/**
 * @public
 */
app.model.HolographicPlate.prototype.getCollectedLightSources = function () {
    var sources = [], sourceID;
    for (sourceID in this._lightSources) {
        if (this._lightSources.hasOwnProperty(sourceID)) {
            sources.push(sourceID);
        }
    }
    return sources;
};

/**
 * @param {!string} refLightID
 * @return {Array<number>}
 * @public
 */
app.model.HolographicPlate.prototype.createRecord = function (refLightID) {
    if (refLightID === 'ALL') {
        this._allRefLights = true;
        this._refLightID = 0;
    } else {
        this._allRefLights = false;
        this._refLightID = parseInt(refLightID, 10);
    }
    return this._createRecord();
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
 * @return {!Array<number>}
 * @private
 */
app.model.HolographicPlate.prototype._createRecord = function () {
    var i, refRaySourceID, raySourceID, rays = [], group = {}, errors = [], bottomLimit, topLimit, errorDiff;

    if (this._allRefLights) {
        for (i = 0; i < this._recordedRays.length; i++) {
            if (this._recordedRays[i] !== undefined) {
                group = {};
                for (refRaySourceID in this._recordedRays[i]) {
                    if (this._recordedRays[i].hasOwnProperty(refRaySourceID)) {
                        group[refRaySourceID] = [];
                        for (raySourceID in this._recordedRays[i]) {
                            if (this._recordedRays[i].hasOwnProperty(raySourceID)) {
                                bottomLimit = this._lightSources[refRaySourceID] - this._tolerance;
                                topLimit = this._lightSources[refRaySourceID] + this._tolerance;

                                if (bottomLimit < this._lightSources[raySourceID] && this._lightSources[raySourceID] < topLimit) {
                                    console.log(bottomLimit, this._lightSources[raySourceID], topLimit);
                                    group[refRaySourceID].push(this._recordedRays[i][raySourceID]);
                                }
                            }
                        }
                    }
                }
                this._recordedRays[i] = group;
            }
        }
    } else { // single ref light
        for (i = 0; i < this._recordedRays.length; i++) {
            if (this._recordedRays[i] !== undefined) {
                if (this._recordedRays[i].hasOwnProperty(this._refLightID)) {
                    rays = [];
                    for (raySourceID in this._recordedRays[i]) {
                        if (this._recordedRays[i].hasOwnProperty(raySourceID)) {
                            bottomLimit = this._lightSources[this._refLightID] - this._tolerance;
                            topLimit = this._lightSources[this._refLightID] + this._tolerance;

                            if (bottomLimit <= this._lightSources[raySourceID]) {
                                if (this._lightSources[raySourceID] <= topLimit) {
                                    rays.push(this._recordedRays[i][raySourceID]);
                                } else {
                                    errorDiff = -((this._lightSources[raySourceID] - bottomLimit) / app.PIXEL_ON_CM).toFixed(2);
                                    errors.push([i, raySourceID, errorDiff]);
                                }
                            } else {
                                errorDiff = -((this._lightSources[raySourceID] - topLimit) / app.PIXEL_ON_CM).toFixed(2);
                                errors.push([i, raySourceID, errorDiff]);
                            }
                            delete this._recordedRays[i][raySourceID];
                        }
                    }
                    this._recordedRays[i][this._refLightID] = rays;
                } else {
                    this._recordedRays[i] = {};
                }
            }
        }
    }
    return errors;
};

/**
 * @private
 */
app.model.HolographicPlate.prototype._recordRay = function () {
    var point = this.reverseTransformPoint([this.intersectionPoint[0], this.intersectionPoint[1]]),
        groupID = Math.floor(((this.height / 2) + point[1]) / this._groupSize);
    this._intersectionRay[0] = point[0];
    this._intersectionRay[1] = point[1];
    if (this._recordedRays[groupID] === undefined) this._recordedRays[groupID] = {};
    this._recordedRays[groupID][this._intersectionRay[6]] = this._intersectionRay;
};

/**
 * @private
 */
app.model.HolographicPlate.prototype._checkRecordedRays = function (rays) {
    var point = this.reverseTransformPoint([this.intersectionPoint[0], this.intersectionPoint[1]]),
        groupID = Math.floor(((this.height / 2) + point[1]) / this._groupSize),
        rayImage, newOrigin, dirPoint, raySourceID = this._intersectionRay[6];

    if (this._recordedRays[groupID] !== undefined && this._recordedRays[groupID].hasOwnProperty(raySourceID)) {
        for (var i = 0; i < this._recordedRays[groupID][raySourceID].length; i++) {
            rayImage = this._recordedRays[groupID][raySourceID][i].slice();
            newOrigin = this.transformPoint([rayImage[0], rayImage[1]]);
            dirPoint = this.transformPoint([(rayImage[0] + rayImage[3]), (rayImage[1] + rayImage[4])]);
            rayImage[0] = newOrigin[0];
            rayImage[1] = newOrigin[1];
            rayImage[3] = dirPoint[0] - newOrigin[0];
            rayImage[4] = dirPoint[1] - newOrigin[1];
            rays.push(rayImage);
        }
    }
};

/**
 * @override
 */
app.model.HolographicPlate.prototype.intersect = function (rays, ray) {

    // todo ktery teda pouzivat
    ray[7] += this.newRayLength;
    this._intersectionRay[7] += this.newRayLength;

    if (this._makeRecord)
        this._recordRay();

    if (this._showRecord)
        this._checkRecordedRays(rays);

    this._lightSources[this._intersectionRay[6]] = this._intersectionRay[7];

    return this.intersectionPoint;
};

/**
 * @override
 */
app.model.HolographicPlate.prototype.draw = function (ctx, callback) {
    this._lightSources = {};

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(this.transformedPoints[0][0], this.transformedPoints[0][1]);
    ctx.lineTo(this.transformedPoints[1][0], this.transformedPoints[1][1]);

    ctx.lineWidth = 1;
    ctx.moveTo(this.transformedPoints[2][0], this.transformedPoints[2][1]);
    ctx.lineTo(this.transformedPoints[3][0], this.transformedPoints[3][1]);

    ctx.moveTo(this.transformedPoints[4][0], this.transformedPoints[4][1]);
    ctx.lineTo(this.transformedPoints[5][0], this.transformedPoints[5][1]);

    var offset = 6;
    for (var i = 0; i < (this._groupsCount *2); i += 2) {
        ctx.moveTo(this.transformedPoints[(offset + i)][0], this.transformedPoints[(offset + i)][1]);
        ctx.lineTo(this.transformedPoints[(offset + i + 1)][0], this.transformedPoints[(offset + i + 1)][1]);
    }
    ctx.stroke();

    if (this.isComponentSelected)
        ctx.lineWidth = 5;

    ctx.stroke();
    ctx.lineWidth = 1;

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
    this._tolerance = angleErrorTolerance;
    this.transformPoints();
};

/**
 * @override
 */
app.model.HolographicPlate.prototype.copy = function () {
    var copy = new app.model.HolographicPlate(this.appliedTranslationX, this.appliedTranslationY);
    copy.copyArguments(this.appliedRotation, this.height, this._groupSize, this._tolerance);
    return copy;
};