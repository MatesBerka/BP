goog.provide('app.model.HolographicPlate');

goog.require('app.model.LineShapeComponent');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!number} coordX - component x position
 * @param {!number} coordY - component Y position
 * @final
 * @constructor
 * @extends {app.model.LineShapeComponent}
 * This class represents Holographic plate component.
 */
app.model.HolographicPlate = function (coordX, coordY) {
    app.model.HolographicPlate.base(this, 'constructor', coordX, coordY, 'HOLO-PLATE'); // call parent constructor
    /**
     * Flag to check if new record show be created during redrawing
     * @type {!boolean}
     * @private
     */
    this._makeRecord = false;
    /**
     * Flag to check if component should show stored record
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
     * How many groups component has
     * @type {!number}
     * @private
     */
    this._groupsCount = Math.floor(this.height / this._groupSize);
    /**
     * ID of reference Light
     * @type {!string}
     * @private
     */
    this._refLightID = '';
    /**
     * Array of displayed maxim
     * @type {!Array<number>}
     * @private
     */
    this._m = [-1];
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
 * Generates points for holographic plate grid
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
 * Updates component height
 * @public
 */
app.model.HolographicPlate.prototype.setHeight = function (height) {
    this.height = Math.round(height * app.pixels_on_cm);
    this._groupsCount = Math.floor(this.height / this._groupSize);
    this.generateShapePoints();
    this._generateGridPoints();
    this.transformPoints();
};


/**
 * Returns size of a group in cm
 * @returns {!string}
 * @public
 */
app.model.HolographicPlate.prototype.getPlateResolution = function () {
    return (this._groupSize / app.pixels_on_cm).toFixed(2);
};

/**
 * Sets new resolution for this component
 * @param {!number} resolution
 * @public
 */
app.model.HolographicPlate.prototype.setPlateResolution = function (resolution) {
    this._groupSize = Math.round(resolution * app.pixels_on_cm);
    this._groupsCount = Math.floor(this.height / this._groupSize);
    this.generateShapePoints();
    this._generateGridPoints();
    this.transformPoints();
};

/**
 * Adds selected maximum
 * @param {!number} maximum
 * @public
 */
app.model.HolographicPlate.prototype.addMaximum = function (maximum) {
    this._m.push(maximum);
};

/**
 * Removes selected maximum
 * @param {!number} maximum
 * @public
 */
app.model.HolographicPlate.prototype.removeMaximum = function (maximum) {
    var i = this._m.indexOf(maximum);
    if (i !== -1) {
        this._m.splice(i, 1)
    }
};

/**
 * Returns array of displayed maxim
 * @return {!Array<number>} maximum
 * @public
 */
app.model.HolographicPlate.prototype.getMaxim = function () {
    return this._m;
};

/**
 * Called when new record should be created
 * @public
 */
app.model.HolographicPlate.prototype.collectRays = function () {
    this._groups = [];
    this._makeRecord = true;
    this._showRecord = false;
};

/**
 * Returns IDs of light sources which are hitting this desk
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
 * Called during redrawing to create new record
 * @param {!string} refLightID
 * @return {Array<number>}
 * @public
 */
app.model.HolographicPlate.prototype.createRecord = function (refLightID) {
    this._refLightID = refLightID;
    return this._createRecord();
};

/**
 * Called to notify that record should be displayed
 * @public
 */
app.model.HolographicPlate.prototype.showRecord = function () {
    this._makeRecord = false;
    this._showRecord = true;
};

/**
 * Calculates angle between intersection ray and holographic plate
 * @private
 */
app.model.HolographicPlate.prototype._getAngle = function () {
    var a = [], b = [], cosAlpha, angle;

    a[0] = this._intersectionRay[app.RAY_ORIGIN_X] - this.intersectionPoint[0];
    a[1] = this._intersectionRay[app.RAY_ORIGIN_Y] - this.intersectionPoint[1];
    b[0] = this.transformedPoints[0][0] - this.intersectionPoint[0];
    b[1] = this.transformedPoints[0][1] - this.intersectionPoint[1];

    cosAlpha = (a[0] * b[0] + a[1] * b[1]) / (Math.sqrt(a[0] * a[0] + a[1] * a[1]) * Math.sqrt(b[0] * b[0] + b[1] * b[1]));
    angle = Math.acos(cosAlpha) * (180 / Math.PI);
    angle = (angle > 90) ? -(angle % 90) : (90 - angle);
    return angle;
};

/**
 * From incoming rays calculates frequencies
 * @return {!Array<number>}
 * @private
 */
app.model.HolographicPlate.prototype._createRecord = function () {
    var i, raySourceID, frequencies = [], errors = [], errorDiff, refRay, refRayAngle, ray,
        rayAngle, f;

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
                        if (ray[app.RAY_WAVE_LENGTH] === refRay[app.RAY_WAVE_LENGTH]) { // 3.1) Light lengths is equal
                            if (Math.abs(this._lightSources[this._refLightID] - this._lightSources[raySourceID])
                                <= app.coherence_length) { // count frequency
                                f = (Math.sin((rayAngle * (Math.PI / 180))) - Math.sin((refRayAngle * (Math.PI / 180)))) / refRay[8];
                                frequencies.push(f);
                            } else {
                                errorDiff = ((Math.abs(this._lightSources[this._refLightID] - this._lightSources[raySourceID])
                                - app.coherence_length) / app.pixels_on_cm).toFixed(4);
                                errors.push([i, raySourceID, this._refLightID, errorDiff]);
                            }
                            delete this._groups[i][raySourceID];
                        } else {
                            errors.push([i, raySourceID, this._refLightID, 'wavelength']);
                        }
                    }
                }
                this._groups[i] = frequencies;
            } else {
                this._groups[i] = [];
            }
        }
    }
    return errors;
};

/**
 * Collects incoming rays to later create record
 * @private
 */
app.model.HolographicPlate.prototype._recordRay = function () {
    var point = this.reverseTransformPoint([this.intersectionPoint[0], this.intersectionPoint[1]]),
        groupID = Math.floor(((this.height / 2) + point[1]) / this._groupSize),
        angle = this._getAngle();

    this._intersectionRay[app.RAY_ORIGIN_X] = point[0];
    this._intersectionRay[app.RAY_ORIGIN_Y] = point[1];
    if (this._groups[groupID] === undefined) this._groups[groupID] = {};
    if (this._groups[groupID][this._intersectionRay[app.RAY_LIGHT_SOURCE_ID]] === undefined) {
        this._groups[groupID][this._intersectionRay[app.RAY_LIGHT_SOURCE_ID]] = [angle, this._intersectionRay];
    } else {
        var newAngle = (angle + this._groups[groupID][this._intersectionRay[app.RAY_LIGHT_SOURCE_ID]][0]) / 2;
        this._groups[groupID][this._intersectionRay[app.RAY_LIGHT_SOURCE_ID]] = [newAngle, this._intersectionRay];
    }
};

/**
 * When show record is active, then this method is called to check if incoming ray generates some outgoing ray
 * @private
 */
app.model.HolographicPlate.prototype._checkRecord = function (rays) {
    var point = this.reverseTransformPoint([this.intersectionPoint[0], this.intersectionPoint[1]]),
        groupID = Math.floor(((this.height / 2) + point[1]) / this._groupSize),
        angle = this._getAngle(), raySource, sin, outgoingAngle, dirPoint, group;

    if ((this._groups[groupID] !== undefined) && (this._groups[groupID] !== null)) {
        raySource = this.reverseTransformPoint([this._intersectionRay[app.RAY_ORIGIN_X], this._intersectionRay[app.RAY_ORIGIN_Y]]);
        group = this._groups[groupID];
        this._intersectionRay[app.RAY_ORIGIN_X] = this.intersectionPoint[0];
        this._intersectionRay[app.RAY_ORIGIN_Y] = this.intersectionPoint[app.RAY_ORIGIN_Y];
        for (var i = 0; i < group.length; i++) {
            for (var k = 0; k < this._m.length; k++) {
                sin = this._m[k] * this._intersectionRay[app.RAY_WAVE_LENGTH] * group[i] + Math.sin((angle * (Math.PI / 180)));
                if (sin <= 1 && sin >= -1) { // if sin does not crossed maximum add ray
                    outgoingAngle = Math.asin(sin);
                    dirPoint = (raySource[0] > 0) ? this.rotatePoint([-1, 0], (-outgoingAngle + this.appliedRotation)) :
                        this.rotatePoint([1, 0], (outgoingAngle + this.appliedRotation));
                    this._intersectionRay[app.RAY_DIRECTION_X] = dirPoint[0];
                    this._intersectionRay[app.RAY_DIRECTION_Y] = dirPoint[1];
                    this._intersectionRay[app.RAY_LIGHT_SOURCE_ID] += '-H' + this._componentID;
                    rays.push(this._intersectionRay.slice());
                }
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
        this._checkRecord(rays);

    this._lightSources[this._intersectionRay[app.RAY_LIGHT_SOURCE_ID]] = (this._intersectionRay[app.RAY_LENGTH] + this.newRayLength);

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
 * @override
 */
app.model.HolographicPlate.prototype.importComponentData = function (componentModel) {
    this._groupSize = componentModel._groupSize;
    this._makeRecord = componentModel._makeRecord;
    this._showRecord = componentModel._showRecord;
    this._groupsCount = componentModel._groupsCount;
    this._refLightID = componentModel._refLightID;
    this._m = componentModel._m;
    this._groups = componentModel._groups;
    this._lightSources = componentModel._lightSources;
    app.model.HolographicPlate.base(this, 'importComponentData', componentModel);
    this._generateGridPoints();
};

/**
 * @override
 */
app.model.HolographicPlate.prototype.copy = function () {
    var copy = new app.model.HolographicPlate(this.appliedTranslationX, this.appliedTranslationY);
    copy.importComponentData(this);
    return copy;
};