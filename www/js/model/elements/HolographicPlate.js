goog.provide('app.model.HolographicPlate');

goog.require('app.model.Component');
goog.require('app.shapes.Line');
/**
 * @constructor
 * @extends {app.model.Component}
 */
app.model.HolographicPlate = function (coordX, coordY) {

    this._height = 300;

    this._type = 'HOLO-PLATE';

    this._makeRecord = false;

    this._showRecord = false; // todo also add remove record?

    this._recordedRays = [];

    this._usedGroups = [];

    this._groupSize = 10; // 10px

    this._angleErrorTolerence = 3;

    this._refLightID = 0;

    this._canvasMoveActive = false;

    this._lightSources = []; // IDs of light sources which are hitting this desk

    app.model.HolographicPlate.base(this, 'constructor', coordX, coordY); // call parent constructor

    this._transformPoints();
};

goog.inherits(app.model.HolographicPlate, app.model.Component);
goog.mixin(app.model.HolographicPlate.prototype, app.shapes.Line.prototype);

app.model.HolographicPlate.prototype.makeRecord = function (refLightID) {
    this._removeRecordedRays();
    this._makeRecord = true;
    this._showRecord = false;
    this._refLightID = refLightID;
};

app.model.HolographicPlate.prototype.showRecord = function () {
    this._makeRecord = false;
    this._showRecord = true;
};

app.model.HolographicPlate.prototype._getAngle = function () {
    var a = [], b = [], cosAlfa, angle;

    a[0] = this._intersectionRay[0] - this._intersectionPoint[0];
    a[1] = this._intersectionRay[1] - this._intersectionPoint[1];

    b[0] = this._transformedPoints[0][0] - this._intersectionPoint[0];
    b[1] = this._transformedPoints[0][1] - this._intersectionPoint[1];

    cosAlfa = (a[0] * b[0] + a[1] * b[1]) / (Math.sqrt(a[0] * a[0] + a[1] * a[1]) * Math.sqrt(b[0] * b[0] + b[1] * b[1]));
    angle = Math.acos(cosAlfa) * (180 / Math.PI);

    if (angle > 90)
        angle = angle % 90;
    else
        angle = 90 - angle;

    return Math.floor(angle);
};

app.model.HolographicPlate.prototype._recordRay = function () {
    var point = this._reverseTransformPoint([this._intersectionPoint[0], this._intersectionPoint[1]]);
    var groupID = Math.floor((Math.floor(this._height / 2) + point[1]) / this._groupSize);
    var rayAngle = this._getAngle();

    this._intersectionRay[0] = this._intersectionPoint[0];
    this._intersectionRay[1] = this._intersectionPoint[1];

    // and finally add
    if (this._recordedRays[groupID] === undefined) {
        this._recordedRays[groupID] = {};
        this._recordedRays[groupID][rayAngle] = [this._intersectionRay];
    } else {
        var angle, match = false;
        for (angle in this._recordedRays[groupID]) {
            if ((parseFloat(angle) - this._angleErrorTolerence) < rayAngle && rayAngle < (parseFloat(angle) + this._angleErrorTolerence)) {
                this._recordedRays[groupID][angle].push(this._intersectionRay);
                match = true;
                break;
            }
        }

        if (!match) {
            this._recordedRays[groupID][rayAngle] = [this._intersectionRay];
        }
    }
};

app.model.HolographicPlate.prototype._removeRecordedRays = function () {
    this._recordedRays = [];
    this._usedGroups = [];
};

app.model.HolographicPlate.prototype._checkRecordedRays = function (rays) {
    // which group
    var match = false, angle, top, bottom;
    var point = this._reverseTransformPoint([this._intersectionPoint[0], this._intersectionPoint[1]]);
    var groupID = Math.floor((Math.floor(this._height / 2) + point[1]) / this._groupSize);
    // is representative?
    var rayAngle = this._getAngle();
    for (angle in this._recordedRays[groupID]) {
        if ((parseFloat(angle) - this._angleErrorTolerence) < rayAngle && rayAngle < (parseFloat(angle) + this._angleErrorTolerence)) {
            rayAngle = angle;
            match = true;
            break;
        }
    }

    // is group full?
    if (match) {
        if (this._usedGroups[groupID] === undefined) {
            this._usedGroups[groupID] = [];
        }
        for (angle in this._recordedRays[groupID]) {
            if (angle != rayAngle && this._usedGroups[groupID][angle] === undefined) {
                this._usedGroups[groupID][angle] = 1;
                var storedRays = this._recordedRays[groupID][angle];
                for (var i = 0; i < storedRays.length; i++) {
                    rays.push(storedRays[i].slice());
                }
            }
        }
    }
};

app.model.HolographicPlate.prototype.isIntersection = function (ray) {
    //https://rootllama.wordpress.com/2014/06/20/ray-line-segment-intersection-test-in-2d/#comments
    var numerator, denominator, t1, t2, v1, v2, v3, ix, iy, a, b,
        length = Infinity;

    a = this._transformedPoints[0];
    b = this._transformedPoints[1];

    v1 = [ray[0] - a[0], ray[1] - a[1]];
    v2 = [b[0] - a[0], b[1] - a[1]];
    v3 = [-ray[4], ray[3]];

    numerator = v2[0] * v1[1] - v1[0] * v2[1];
    denominator = v2[0] * v3[0] + v2[1] * v3[1];
    t1 = numerator / denominator;

    if (t1 < 0)
        return length;

    numerator = v1[0] * v3[0] + v1[1] * v3[1];
    t2 = numerator / denominator;
    if (t2 < 0 || t2 > 1)
        return length;

    ix = Math.round(ray[0] + ray[3] * t1);
    iy = Math.round(ray[1] + ray[4] * t1);

    if (ix == ray[0] && iy == ray[1])
        return length;

    // is intersection
    length = Math.sqrt(Math.pow(Math.abs(ix - ray[0]), 2) + Math.pow(Math.abs(iy - ray[1]), 2));
    if (length < this._rayMinLength)
        return Infinity;

    this._intersectionRay = ray.slice();
    this._intersectionPoint = [ix, iy];

    return length;
};

app.model.HolographicPlate.prototype.intersect = function (rays) {

    // todo collect rays if record mode
    if (this._makeRecord)
        this._recordRay();

    if (this._showRecord)
        this._checkRecordedRays(rays);

    this._lightSources[this._intersectionRay[6]] = 1;

    return this._intersectionPoint;
};

app.model.HolographicPlate.prototype.draw = function (ctx, callback) {
    //TODO alternative is to draw rectangle ctx.rect(20,20,150,100);
    if (this._showRecord)
        this._usedGroups = [];

    this._lightSources = {};

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(this._transformedPoints[0][0], this._transformedPoints[0][1]);
    ctx.lineTo(this._transformedPoints[1][0], this._transformedPoints[1][1]);
    ctx.stroke();

    if (this._isSelected)
        ctx.lineWidth = 5;

    ctx.stroke();
    ctx.lineWidth = 1;
};

app.model.HolographicPlate.prototype.isSelected = function (x, y) {
    //http://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection
    var point = this._reverseTransformPoint([x, y]),
        xs = -3, ys = -Math.floor(this._height / 2), xe = 3, ye = Math.floor(this._height / 2);

    if (point[0] >= xs && point[0] <= xe && point[1] >= ys && point[1] <= ye) {
        return this._isSelected = true;
    }
    return this._isSelected = false;
};

app.model.HolographicPlate.prototype.copyArguments = function (rotation, height, groupSize, angleErrorTolerance) {
    this._appliedRotation = rotation;
    this._height = height;
    this._groupSize = groupSize;
    this._angleErrorTolerence = angleErrorTolerance;
    this._transformPoints();
};

app.model.HolographicPlate.prototype.copy = function () {
    var copy = new app.model.HolographicPlate(this._appliedTranslationX, this._appliedTranslationY);
    copy.copyArguments(this._appliedRotation, this._height, this._groupSize, this._angleErrorTolerence);
    return copy;
};