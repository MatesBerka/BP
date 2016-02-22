goog.provide('app.model.Light');

goog.require('app.model.Component');
/**
 * @constructor
 * @extends {app.model.Component}
 */
app.model.Light = function(coordX, coordY) {

    this._size = 50;
    // BEAM or CIRCLE
    this._lightType = 'BEAM';

    this._generatedRaysCount = 10;

    this._lightRadius = 30;

    this._type = 'LIGHT';

    this._lightID = -1;

    this._wallsCount = 4;

    app.model.Light.base(this, 'constructor', coordX, coordY); // call parent constructor

    this._transformPoints();
};

goog.inherits(app.model.Light, app.model.Component);

app.model.Light.prototype.getSize = function() {
    return this._size;
};

app.model.Light.prototype.setSize = function(size) {
    this._size = parseInt(size, 10);
    this._generateShapePoints();
    this._transformPoints();
};

app.model.Light.prototype.getRaysCount = function() {
    return this._generatedRaysCount;
};

app.model.Light.prototype.setRaysCount = function(count) {
    this._generatedRaysCount = parseInt(count, 10);
};

app.model.Light.prototype.getLightType = function() {
    return this._lightType;
};

app.model.Light.prototype.setLightType = function(type) {
    this._lightType = type;
    this._generateShapePoints();
    this._transformPoints();
};

app.model.Light.prototype.getRadius = function() {
    return this._lightRadius;
};

app.model.Light.prototype.setRadius = function(radius) {
    this._lightRadius = parseFloat(radius);
};

app.model.Light.prototype.setLightID = function(lightID) {
    return this._lightID = parseInt(lightID, 10);
};

app.model.Light.prototype.getLightID = function() {
    return this._lightID;
};

app.model.Light.prototype._generateShapePoints = function() {
    this._originPoints = [];
    if(this._lightType == 'CIRCLE') {
        this._generateBallShapePoints();
    } else {
        this._generateSquareShapePoints();
    }
};

app.model.Light.prototype._generateBallShapePoints = function() {
    this._originPoints.push([0,0,0]);
};

 app.model.Light.prototype._generateSquareShapePoints = function() {
    var x = 0, y, z = 0;

    x = x - Math.floor(this._size/2);
    this._originPoints.push([x,x,z]);

    y = x;
    x += this._size;
    this._originPoints.push([x,y,z]);

    y += this._size;
    this._originPoints.push([x,y,z]);

    x -= this._size;
    this._originPoints.push([x,y,z]);
};

app.model.Light.prototype._squareIntersection = function(ray) {
    //https://rootllama.wordpress.com/2014/06/20/ray-line-segment-intersection-test-in-2d/#comments
    // https://rootllama.wordpress.com
    var numerator, denominator, t1, t2, v1, v2, v3, ix, iy, a, aIndex, b, bIndex,
        length, rayLength = Infinity;

    for(var i = 0; i < this._wallsCount; i++) {
        aIndex = i;
        bIndex = (i+1)%4;

        a = this._transformedPoints[aIndex];
        b = this._transformedPoints[bIndex];

        v1 = [ray[0] - a[0], ray[1] - a[1]];
        v2 = [b[0] - a[0], b[1] - a[1]];
        v3 = [-ray[4], ray[3]];

        numerator = v2[0]*v1[1] - v1[0]*v2[1];
        denominator = v2[0]*v3[0] + v2[1]*v3[1];
        t1 = numerator/denominator;

        if(t1 < 0)
            continue;

        numerator = v1[0]*v3[0] + v1[1]*v3[1];
        t2 = numerator/denominator;
        if(t2 < 0 || t2 > 1)
            continue;

        // is intersection
        ix = ray[0] + ray[3]*t1;
        iy = ray[1] + ray[4]*t1;

        length = Math.sqrt(Math.pow(Math.abs(ix - ray[0]), 2) + Math.pow(Math.abs(iy - ray[1]), 2));
        if(length < rayLength) {
            rayLength = length;
            this._intersectionPoint = [ix, iy];
        }
    }

    if(rayLength < this._rayMinLength)
        return Infinity;
    else
        return rayLength;
};

app.model.Light.prototype._circleIntersection = function(ray) {
    // TODO http://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
    // http://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
    // t2( dx2 + dy2 ) + 2t( exdx + eydy - dxh - dyk ) + ex2 + ey2 - 2exh - 2eyk + h2 + k2 - r2 = 0

    //if(ray[0] == this._transformedPoints[0][0] && ray[1] == this._transformedPoints[0][1]) {
    //    return Infinity;
    //}
    //
    //var a, b, c, dis, x1, x2, point1 = [], point2 = [], length1 = Infinity, length2 = Infinity;
    //
    //a = Math.pow(ray[3], 2) + Math.pow(ray[4], 2);
    //
    //b = 2 * (ray[0]*ray[3] + ray[1]*ray[4] - ray[3]*this._transformedPoints[0][0] - ray[4]*this._transformedPoints[0][1]);
    //
    //c = ray[0]*ray[0] + ray[1]*ray[1] - 2*ray[0]*this._transformedPoints[0][0] - 2*ray[1]*this._transformedPoints[0][1] +
    //Math.pow(this._transformedPoints[0][0], 2) + Math.pow(this._transformedPoints[0][1], 2) - Math.pow(this._size, 2);
    //
    //dis = Math.pow(b, 2) - 4*a*c;
    //if(dis < 0)
    //    return length1;
    //
    //x1 = (-b+Math.sqrt(dis))/2*a;
    //point1[0] = ray[0] + ray[3]*x1;
    //point1[1] = ray[1] + ray[4]*x1;
    //x2 = (-b-Math.sqrt(dis))/2*a;
    //point2[0] = ray[0] + ray[3]*x2;
    //point2[1] = ray[1] + ray[4]*x2;
    //
    //length1 = Math.sqrt(Math.pow(Math.abs(point1[0] - ray[0]), 2) + Math.pow(Math.abs(point1[1] - ray[1]), 2));
    //length2 = Math.sqrt(Math.pow(Math.abs(point2[0] - ray[0]), 2) + Math.pow(Math.abs(point2[1] - ray[1]), 2));
    //
    //if(length1 <= length2) {
    //    this._intersectionPoint = point1;
    //    return length1;
    //} else {
    //    this._intersectionPoint = point2;
    //    return length2;
    //}

    // TODO fix it!
    return Infinity;
};

app.model.Light.prototype.isIntersection = function(ray) {
    if(this._lightType == 'BEAM') {
        return this._squareIntersection(ray);
    } else {
        return this._circleIntersection(ray);
    }
};

app.model.Light.prototype._isSquareSelected = function(point) {
    var halfSize = Math.floor(this._size/2);

    return (Math.abs(point[0]) <= halfSize && Math.abs(point[1]) <= halfSize);
};

app.model.Light.prototype._isCircleSelected = function(point) {
    //http://math.stackexchange.com/questions/198764/how-to-know-if-a-point-is-inside-a-circle
    var d = Math.sqrt(Math.pow((point[0] - this._originPoints[0][0]), 2) + Math.pow((point[1] - this._originPoints[0][1]), 2));
    return (d <= this._size);
};

app.model.Light.prototype.isSelected = function(x, y) {
    //http://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection
    var point = this._reverseTransformPoint([x,y]);

    if(this._lightType == 'BEAM') {
        return this._isSelected = this._isSquareSelected(point);
    } else {
        return this._isSelected = this._isCircleSelected(point);
    }
};


app.model.Light.prototype.intersect = function(rays) {
    return this._intersectionPoint;
};

app.model.Light.prototype._generateRays = function(callback) {
    var x, y, dx, dy, vec1, vec2, vecd, indentation, i, degree, radians, opposite, halfSize = Math.floor(this._size/2);

    if(this._lightType == 'BEAM') {
        indentation = Math.floor(this._size/this._generatedRaysCount);
        x = halfSize;
        for(i = 0; i < this._generatedRaysCount; i++) {
            y = i*indentation - halfSize;

            vec1 = this._transformPoint([x, y, 0]);
            vec2 = this._transformPoint([(x + 1), y, 0]);

            dx = vec2[0] - vec1[0];
            dy = vec2[1] - vec1[1];

            callback([vec1[0],vec1[1],0,dx,dy,0, this._lightID, 0]);
        }
    } else if(this._lightType == 'CIRCLE') {
        indentation = Math.floor((2*this._lightRadius)/this._generatedRaysCount);

        for(i = 0; i < this._generatedRaysCount; i++) {
            degree = this._lightRadius - i*indentation;
            radians = degree * (Math.PI/180);
            // tag(alpha)*|a| = |b|;
            // + normalizace vektoru
            //http://forum.matematika.cz/viewtopic.php?id=5845
            opposite = Math.tan(radians)*this._size;

            vec1 = this._transformPoint([0,0,0]);
            vec1[2] = 0;
            y = -opposite;
            x = this._size;
            vec2 = this._transformPoint([x,y,0]);
            vec2[2] = 0;

            dx = vec2[0] - vec1[0];
            dy = vec2[1] - vec1[1];

            vecd = this._normalize2DVector([dx, dy]);
            callback([vec1[0],vec1[1],0,vecd[0], vecd[1],0, this._lightID, 0]);
        }
    }
};

app.model.Light.prototype._drawBall = function(ctx) {
    // http://billmill.org/static/canvastutorial/ball.html
    // https://developer.mozilla.org/cs/docs/Canvas_tutori%C3%A1l/Kreslen%C3%AD_tvar%C5%AF
    // http://www.html5canvastutorials.com/tutorials/html5-canvas-circles/
    ctx.beginPath();
    ctx.arc(this._transformedPoints[0][0], this._transformedPoints[0][1], this._size, 0, Math.PI*2, true);

    if(this._isSelected) {
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;
    } else {
        ctx.stroke();
    }
};

app.model.Light.prototype._drawBeam = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this._transformedPoints[0][0], this._transformedPoints[0][1]);
    ctx.lineTo(this._transformedPoints[1][0], this._transformedPoints[1][1]);
    ctx.lineTo(this._transformedPoints[2][0], this._transformedPoints[2][1]);
    ctx.lineTo(this._transformedPoints[3][0], this._transformedPoints[3][1]);
    ctx.lineTo(this._transformedPoints[0][0], this._transformedPoints[0][1]);

    if(this._isSelected) {
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;
    } else {
        ctx.stroke();
    }
};

app.model.Light.prototype.draw = function(ctx, callback) {

    if(this._lightType == 'BEAM') {
        this._drawBeam(ctx);
    } else {
        this._drawBall(ctx);
    }

    this._generateRays(callback);
};

// TODO is it used somewhere?
app.model.Light.prototype.changeLightType = function(type) {
    this._lightType = type;
    this._generateShapePoints();
    this._transformPoints();
};

app.model.Light.prototype.copyArguments = function(rotation, size, lightType, generatedRaysCount, lightRadius) {
    this._appliedRotation = rotation;
    this._size = size;
    this._lightType = lightType;
    this._generatedRaysCount = generatedRaysCount;
    this._lightRadius = lightRadius;
    this._transformPoints();
};

app.model.Light.prototype.copy = function () {
    var copy = new app.model.Light(this._appliedTranslationX, this._appliedTranslationY);
    copy.copyArguments(this._appliedRotation, this._size, this._lightType, this._generatedRaysCount, this._lightRadius);
    return copy;
};
