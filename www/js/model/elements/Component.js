goog.provide('app.model');
goog.provide('app.model.Component');

/**
 * @constructor
 */
app.model.Component = function(coordX, coordY) {

    this._appliedTranslationX = coordX;

    this._appliedTranslationY = coordY;

    // in radians
    //this._appliedRotation = 0.785398163;
    this._appliedRotation = 0;

    this._rayMinLength = 3;

    this._isSelected = false;

    this._intersectionPoint = [];

    this._originPoints = [];

    this._transformedPoints = [];

    this._generateShapePoints();

    this._transformPoints();
};

app.model.Component.prototype.isIntersection = goog.abstractMethod;

app.model.Component.prototype.intersect = goog.abstractMethod;

app.model.Component.prototype.draw = goog.abstractMethod;

app.model.Component.prototype.isSelected = goog.abstractMethod;

app.model.Component.prototype._generateShapePoints = goog.abstractMethod;

app.model.Component.prototype.copyArguments = goog.abstractMethod;

app.model.Component.prototype.getPosX = function() {
    return this._appliedTranslationX;
};

app.model.Component.prototype.getPosY = function() {
    return this._appliedTranslationY;
};

app.model.Component.prototype.getType = function() {
    return this._type;
};

app.model.Component.prototype.getRotation = function() {
    return this._appliedRotation * (180/Math.PI);
};

app.model.Component.prototype.setRotation = function(rotation) {
    this._appliedRotation = rotation;
    this._transformPoints();
};

//app.model.Component.prototype.setSelected = function(boolean) {
//    this._isSelected = boolean;
//};

app.model.Component.prototype._normalize2DVector = function(vec) {
    var len = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
    vec[0] = vec[0]/len;
    vec[1] = vec[1]/len;

    return vec;
};

app.model.Component.prototype._reverseTransformPoint = function(point) {
    var result = [], translatedPoint = [];
    translatedPoint[0] = point[0] - this._appliedTranslationX;
    translatedPoint[1] = point[1] - this._appliedTranslationY;

    result[0] = translatedPoint[0] * Math.cos(this._appliedRotation) + translatedPoint[1] * Math.sin(this._appliedRotation);
    result[1] = translatedPoint[0] * -Math.sin(this._appliedRotation) + translatedPoint[1] * Math.cos(this._appliedRotation);

    return result;
};

app.model.Component.prototype._transformPoints = function() {
    var newPoint;
    this._transformedPoints = [];

    for(var i = 0; i < this._originPoints.length; i++) {
        newPoint = [];
        newPoint[0] = this._originPoints[i][0] * Math.cos(this._appliedRotation) - this._originPoints[i][1] * Math.sin(this._appliedRotation);
        newPoint[1] = this._originPoints[i][0] * Math.sin(this._appliedRotation) + this._originPoints[i][1] * Math.cos(this._appliedRotation);

        newPoint[0] = newPoint[0] + this._appliedTranslationX;
        newPoint[1] = newPoint[1] + this._appliedTranslationY;

        this._transformedPoints.push(newPoint);
    }
};

app.model.Component.prototype._transformPoint = function(point) {
    var newPoint;

    newPoint = [];
    newPoint[0] = point[0] * Math.cos(this._appliedRotation) - point[1] * Math.sin(this._appliedRotation);
    newPoint[1] = point[0] * Math.sin(this._appliedRotation) + point[1] * Math.cos(this._appliedRotation);

    newPoint[0] = newPoint[0] + this._appliedTranslationX;
    newPoint[1] = newPoint[1] + this._appliedTranslationY;

    return newPoint;
};


app.model.Component.prototype.updateRotation = function(degrees) {
    this._appliedRotation = degrees*(Math.PI/180);
    this._transformPoints();
};

app.model.Component.prototype.applyTranslation = function(moveX, moveY) {
    this._appliedTranslationX += moveX;
    this._appliedTranslationY += moveY;
    this._transformPoints();
};

app.model.Component.prototype.updateTranslationX = function(x) {
    this._appliedTranslationX = x;
    this._transformPoints();
};

app.model.Component.prototype.updateTranslationY = function(y) {
    this._appliedTranslationY = y;
    this._transformPoints();
};