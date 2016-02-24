goog.provide('app.model.Lens');

goog.require('app.model.Component');
goog.require('app.shapes.Line');
/**
 * @constructor
 * @extends {app.model.Component}
 */
app.model.Lens = function(coordX, coordY) {

    this._height = 300;

    this._type = 'LENS';

    this._focusType = 'UNITE'; // DIVERSE

    this._focusOffset = 100;

    this._newRayLength = 0;

    app.model.Lens.base(this, 'constructor', coordX, coordY); // call parent constructor

    this._generateFocusesPoints();
    this._transformPoints();
};

goog.inherits(app.model.Lens, app.model.Component);
goog.mixin(app.model.Lens.prototype, app.shapes.Line.prototype);

//https://www.google.cz/search?q=rozptylka&espv=2&biw=1920&bih=979&tbm=isch&source=lnms&sa=X&ved=0ahUKEwiX2MqH1_TKAhVDJ5oKHRzID6MQ_AUIBygB&dpr=1#imgrc=N_psa3FtWOpzFM%3A
//https://www.youtube.com/watch?v=i20bzCUw464
//https://www.khanacademy.org/science/physics/geometric-optics/mirrors-and-lenses/v/thin-lens-equation-and-problem-solving
app.model.Lens.prototype._generateFocusesPoints = function () {
    this._originPoints.push([-this._focusOffset, 0, 0]);
    this._originPoints.push([this._focusOffset, 0, 0]);
};

app.model.Lens.prototype.getHeight = function() {
    return (this._height / app.PIXELonCM).toFixed(2);
};

app.model.Lens.prototype.setHeight = function() {
    this._height = Math.round(height * app.PIXELonCM);
    this._generateShapePoints();
    this._transformPoints();
};

app.model.Lens.prototype.setFocusOffset = function(offset) {
    this._focusOffset = offset;
    this._generateShapePoints();
    this._generateFocusesPoints();
    this._transformPoints();
};

app.model.Lens.prototype.getFocusOffset = function() {
    return this._focusOffset;
};

app.model.Lens.prototype.getFocusType = function() {
    return this._focusType;
};

app.model.Lens.prototype.setFocusOffset = function(focus) {
    this._focus = focus;
};

app.model.Lens.prototype._getImagePosition = function(focus, obj) {
    var imgDis = Math.round(1/(1/focus - 1/Math.abs(obj[0])));
    var imgHeight = Math.round(Math.abs(obj[1])*(-imgDis/Math.abs(obj[0])));

    imgDis = (obj[0] < 0) ? imgDis : -imgDis;
    imgHeight = (obj[1] < 0) ?  -imgHeight : imgHeight;

    return this._transformPoint([imgDis, imgHeight]);
};

app.model.Lens.prototype.intersect = function (rays) {
    var point = this._reverseTransformPoint([this._intersectionRay[0], this._intersectionRay[1]]);
    var dVec = [], normDVec = [], imgPoint;

    if(this._focusType == 'UNITE') {
        imgPoint = this._getImagePosition(this._focusOffset, point);
        if(Math.abs(point[0]) < this._focusOffset) {
            dVec[0] = this._intersectionPoint[0] - imgPoint[0];
            dVec[1] = this._intersectionPoint[1] - imgPoint[1];
        } else {
            dVec[0] = imgPoint[0] - this._intersectionPoint[0];
            dVec[1] = imgPoint[1] - this._intersectionPoint[1];
        }
    } else {
        imgPoint = this._getImagePosition(-this._focusOffset, point);
        dVec[0] = this._intersectionPoint[0] - imgPoint[0];
        dVec[1] = this._intersectionPoint[1] - imgPoint[1];
    }
    normDVec = this._normalize2DVector(dVec);

    this._intersectionRay[0] = this._intersectionPoint[0];
    this._intersectionRay[1] = this._intersectionPoint[1];
    this._intersectionRay[3] = normDVec[0];
    this._intersectionRay[4] = normDVec[1];
    rays.push(this._intersectionRay);

    return this._intersectionPoint;
};

app.model.Lens.prototype.copyArguments = function(rotation, height, focusType, focusOffset) {
    this._appliedRotation = rotation;
    this._height = height;
    this._focusType = focusType;
    this._focusOffset = focusOffset;
    this._transformPoints();
};

app.model.Lens.prototype.copy = function () {
    var copy = new app.model.Lens(this._appliedTranslationX, this._appliedTranslationY);
    copy.copyArguments(this._appliedRotation, this._height, this._focusType, this._focusOffset);
    return copy;
};
