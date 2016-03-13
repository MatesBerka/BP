goog.provide('app.model.HolographicPlate');

goog.require('app.model.LineShapeComponent');

/**
 * @description Diffractive optics simulator
 * @version 1.2
 * @author Matěj Berka
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @final
 * @constructor
 * @extends {app.model.LineShapeComponent}
 * This class represents Holographic plate component.
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
     * @type {boolean}
     * @private
     */
    this._allRefLights = false;
    /**
     * ID of reference Light
     * @type {!number}
     * @private
     */
    this._refLightID = 0;
    /**
     * Maximum
     * @type {!number}
     * @private
     */
    this._m = -1;
    /**
     * Incoming rays
     * @type {!Array<Object>}
     * @private
     */
    this._groups = [];
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

/**
 * @private
 */
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
 * @public
 */
app.model.HolographicPlate.prototype.setHeight = function (height) {
    this.height = Math.round(height * app.PIXELS_ON_CM);
    this._groupsCount = Math.floor(this.height / this._groupSize);
    this.generateShapePoints();
    this._generateGridPoints();
    this.transformPoints();
};


/**
 * @returns {!string}
 * @public
 */
app.model.HolographicPlate.prototype.getPlateResolution = function () {
    return (this._groupSize / app.PIXELS_ON_CM).toFixed(2);
};

/**
 * @param {!number} resolution
 * @public
 */
app.model.HolographicPlate.prototype.setPlateResolution = function (resolution) {
    this._groupSize = Math.round(resolution * app.PIXELS_ON_CM);
    this._groupsCount = Math.floor(this.height / this._groupSize);
    this.generateShapePoints();
    this._generateGridPoints();
    this.transformPoints();
};

/**
 * @param {!number} maximum
 * @public
 */
app.model.HolographicPlate.prototype.setMaximum = function (maximum) {
    this._m = maximum;
};

/**
 * @return {!number} maximum
 * @public
 */
app.model.HolographicPlate.prototype.getMaximum = function () {
    return this._m;
};

/**
 * @public
 */
app.model.HolographicPlate.prototype.collectRays = function () {
    this._groups = [];
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
    angle = (angle > 90) ? -(angle % 90) : (90 - angle);
    return Math.round(angle);
};

/**
 * @return {!Array<number>}
 * @private
 */
app.model.HolographicPlate.prototype._createRecord = function () {
    var i, refRaySourceID, raySourceID, group = [], frequencies = [], errors = [], errorDiff, refRay, refRayAngle, ray,
     rayAngle, f;

    if (this._allRefLights) {
        for (i = 0; i < this._groups.length; i++) {
            if (this._groups[i] !== undefined) {
                group = [];
                for (refRaySourceID in this._groups[i]) {
                    if (this._groups[i].hasOwnProperty(refRaySourceID)) { // 1) pick ref. light
                        refRayAngle = this._groups[i][refRaySourceID][0];
                        refRay = this._groups[i][refRaySourceID][1];
                        frequencies = [];
                        for (raySourceID in this._groups[i]) {
                            if (this._groups[i].hasOwnProperty(raySourceID) && raySourceID !== refRaySourceID) { // 2) collects obj. lights
                                rayAngle = this._groups[i][raySourceID][0];
                                ray = this._groups[i][raySourceID][1];
                                if (ray[8] === refRay[8] && Math.abs(this._lightSources[refRaySourceID] - this._lightSources[raySourceID])
                                    <= app.COHERENCE_LENGTH) {
                                    f = (Math.sin((rayAngle * (Math.PI / 180))) - Math.sin((refRayAngle * (Math.PI / 180)))) / refRay[8];
                                    frequencies.push(f);
                                }
                            }
                        }
                        group.push(frequencies);
                    }
                }
                this._groups[i] = group;
            }
        }
    } else { // single ref. light picked
        for (i = 0; i < this._groups.length; i++) {
            if (this._groups[i] !== undefined) { // 1) group is not empty
                if (this._groups[i].hasOwnProperty(this._refLightID)) { // 2) ref. light present
                    // store and remove ref. ray
                    refRayAngle = this._groups[i][this._refLightID][0];
                    refRay = this._groups[i][this._refLightID][1];
                    delete this._groups[i][this._refLightID];
                    frequencies = [];
                    for (raySourceID in this._groups[i]) {
                        if (this._groups[i].hasOwnProperty(raySourceID)) { // 3) create inter. patterns
                            rayAngle = this._groups[i][raySourceID][0];
                            ray = this._groups[i][raySourceID][1];
                            if (ray[8] === refRay[8]) { // 3.1) Light length is equal
                                if (Math.abs(this._lightSources[this._refLightID] - this._lightSources[raySourceID])
                                    <= app.COHERENCE_LENGTH) { // count frequency
                                    f = (Math.sin((rayAngle * (Math.PI / 180))) - Math.sin((refRayAngle * (Math.PI / 180)))) / refRay[8];
                                    frequencies.push(f);
                                } else {
                                    errorDiff = ((Math.abs(this._lightSources[this._refLightID] - this._lightSources[raySourceID])
                                    - app.COHERENCE_LENGTH) / app.PIXELS_ON_CM).toFixed(4);
                                    errors.push([i, raySourceID, this._refLightID, errorDiff]);
                                }
                                delete this._groups[i][raySourceID];
                            }
                        }
                    }
                    this._groups[i] = frequencies;
                } else {
                    this._groups[i] = [];
                }
            }
        }
    }
    console.log(this._groups);
    return errors;
};

/**
 * @private
 */
app.model.HolographicPlate.prototype._recordRay = function () {
    var point = this.reverseTransformPoint([this.intersectionPoint[0], this.intersectionPoint[1]]),
        groupID = Math.floor(((this.height / 2) + point[1]) / this._groupSize),
        angle = this._getAngle();

    this._intersectionRay[0] = point[0];
    this._intersectionRay[1] = point[1];
    if (this._groups[groupID] === undefined) this._groups[groupID] = {};
    this._groups[groupID][this._intersectionRay[6]] = [angle, this._intersectionRay];
};

/**
 * @private
 */
app.model.HolographicPlate.prototype._checkRecordedRays = function (rays) {
    var point = this.reverseTransformPoint([this.intersectionPoint[0], this.intersectionPoint[1]]),
        groupID = Math.floor(((this.height / 2) + point[1]) / this._groupSize),
        angle = this._getAngle(), raySource, sin, outgoingAngle, dirPoint, group;

    if (this._groups[groupID] !== undefined) {
        raySource = this.reverseTransformPoint([this._intersectionRay[0], this._intersectionRay[1]]);
        group = (this._allRefLights) ? this._groups[groupID][this._intersectionRay[6]] : this._groups[groupID];
        // TODO hodi chybu kdyz bude osvetlovat svetlo ktere nezaznamenavalo
        console.log(group);
        for (var i = 0; i < group.length; i++) {
            sin = this._m * this._intersectionRay[8] * group[i] + Math.sin((angle * (Math.PI / 180)));
            console.log(sin, this._intersectionRay[8], group[i], angle);
            if (sin <= 1 && sin >= -1) { // if sin does not crossed maximum add ray
                console.log('sfsf' );
                outgoingAngle = Math.asin(sin);
                dirPoint = (raySource[0] > 0) ? this.rotatePoint([-1, 0], (-outgoingAngle + this.appliedRotation)) :
                    this.rotatePoint([1, 0], (outgoingAngle + this.appliedRotation));

                this._intersectionRay[0] = this.intersectionPoint[0];
                this._intersectionRay[1] = this.intersectionPoint[1];
                this._intersectionRay[3] = dirPoint[0];
                this._intersectionRay[4] = dirPoint[1];
                rays.push(this._intersectionRay);
            }
        }
    }
};

/**
 * @override
 */
app.model.HolographicPlate.prototype.intersects = function (rays) {
    if (this._makeRecord)
        this._recordRay();

    if (this._showRecord)
        this._checkRecordedRays(rays);

    this._lightSources[this._intersectionRay[6]] = (this._intersectionRay[7] + this.newRayLength);

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
    for (var i = 0; i < (this._groupsCount * 2); i += 2) {
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
 * @override
 */
app.model.HolographicPlate.prototype.copyArguments = function (rotation, height, groupSize) {
    this.appliedRotation = rotation;
    this.height = height;
    this._groupSize = groupSize;

    this.generateShapePoints();
    this._generateGridPoints();
    this.transformPoints();
};

/**
 * @param {!Object} componentModel
 * @public
 */
app.model.HolographicPlate.prototype.importComponentData = function (componentModel) {
    this.appliedRotation = componentModel.appliedRotation;
    this.height = componentModel.height;
    this._groupSize = componentModel._groupSize;
    this._makeRecord = componentModel._makeRecord;
    this._showRecord = componentModel._showRecord;
    this._groupsCount = componentModel._groupsCount;
    this._allRefLights = componentModel._allRefLights;
    this._refLightID = componentModel._refLightID;
    this._m = componentModel._m;
    this._groups = componentModel._groups;
    this._lightSources = componentModel._lightSources;
    this.generateShapePoints();
    this._generateGridPoints();
    this.transformPoints();
};

/**
 * @override
 */
app.model.HolographicPlate.prototype.copy = function () {
    var copy = new app.model.HolographicPlate(this.appliedTranslationX, this.appliedTranslationY);
    copy.copyArguments(this.appliedRotation, this.height, this._groupSize);
    return copy;
};