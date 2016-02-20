goog.provide('app.model.Lens');

goog.require('app.model.Component');
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
};

goog.inherits(app.model.Lens, app.model.Component);

//https://www.google.cz/search?q=rozptylka&espv=2&biw=1920&bih=979&tbm=isch&source=lnms&sa=X&ved=0ahUKEwiX2MqH1_TKAhVDJ5oKHRzID6MQ_AUIBygB&dpr=1#imgrc=N_psa3FtWOpzFM%3A
//https://www.youtube.com/watch?v=i20bzCUw464
//https://www.khanacademy.org/science/physics/geometric-optics/mirrors-and-lenses/v/thin-lens-equation-and-problem-solving
app.model.Lens.prototype._generateShapePoints = function () {
    var x = 0, y = 0, z = 0;

    y = y - Math.floor(this._height / 2);
    this._originPoints.push([x, y, z]);

    y += this._height;
    this._originPoints.push([x, y, z]);

    //focuses
    this._originPoints.push([-this._focusOffset, 0, 0]);
    this._originPoints.push([this._focusOffset, 0, 0]);
};

app.model.Lens.prototype.setFocusOffset = function(offset) {
    this._focusOffset = offset;
    this._generateShapePoints();
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

app.model.Lens.prototype.isIntersection = function (ray) {
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

    if(ix == ray[0] && iy == ray[1])
        return length;

    // is intersection
    length = Math.sqrt(Math.pow(Math.abs(ix - ray[0]), 2) + Math.pow(Math.abs(iy - ray[1]), 2));
    if(length < this._rayMinLength)
        return Infinity;

    this._intersectionRay = ray.slice();
    this._intersectionPoint = [ix, iy];
    this._newRayLength = length;

    return length;
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

app.model.Lens.prototype.draw = function (ctx, callback) {
    //TODO alternative is to draw rectangle ctx.rect(20,20,150,100);

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

app.model.Lens.prototype.isSelected = function (x, y) {
    //http://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection
    var point = this._reverseTransformPoint([x, y]),
        xs = -5, ys = -Math.floor(this._height / 2), xe = 5, ye = Math.floor(this._height / 2);

    if (point[0] >= xs && point[0] <= xe && point[1] >= ys && point[1] <= ye) {
        return this._isSelected = true;
    }
    return this._isSelected = false;
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
