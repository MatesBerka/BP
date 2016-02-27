goog.provide('app.ViewController');

goog.require('app.model.HolographicPlate');
goog.require('app.model.Lens');
goog.require('app.model.Light');
goog.require('app.model.Mirror');
goog.require('app.model.Splitter');
goog.require('app.model.Wall');

goog.require('app.HolographicPlateController');
goog.require('app.LensController');
goog.require('app.LightController');
goog.require('app.MirrorController');
goog.require('app.SplitterController');
goog.require('app.WallController');

/**
 * @constructor
 */
app.ViewController = function () {
    this._reflectionsCount = 4;

    this._model = null;

    this._components = [];

    this._rays = [];

    this._mouseCursorPoint = [];
};

app.ViewController.prototype.addCanvasMove = function(view, coords) {
    this._mouseCursorPoint = coords;
    goog.events.listen(view, goog.events.EventType.MOUSEMOVE, this.canvasMoved, true, this);
};

app.ViewController.prototype.removeCanvasMove = function(view) {
    goog.events.unlisten(view, goog.events.EventType.MOUSEMOVE, this.canvasMoved, true, this);
};

app.ViewController.prototype.addListeners = function (view) {
    var classThis = this;

    // coordinates update
    goog.events.listen(view, goog.events.EventType.MOUSEMOVE, classThis.updateCoordinates, false, this);

    //// mouse down events
    //goog.events.listen(view, goog.events.EventType.MOUSEDOWN, function (e) {
    //    if (this._canvasMoveActive) {
    //        this._mouseCursorPoint = [e.offsetX, e.offsetY];
    //    }
    //}, false, this);

    //// mouse up events
    //goog.events.listen(view, goog.events.EventType.MOUSEUP, function (e) {
    //    if (this._canvasMoveActive) {
    //        this._canvasMoveActive = false;
    //        goog.events.unlisten(view, goog.events.EventType.MOUSEMOVE, this.canvasMoved, true, this);
    //    }
    //}, false, this);

    goog.events.listen(goog.dom.getElementByClass('zoom', view), goog.events.EventType.CLICK, function (e) {
        if (e.target.className === 'zoom-in') {
            this._model.scaleUp();
        } else {
            this._model.scaleDown();
        }
        this.draw();
    }, false, this);

    goog.events.listen(goog.dom.getElementByClass('move-control', view), goog.events.EventType.CLICK, function (e) {
        switch (e.target.className) {
            case 'wide-top-move-control':
                this._model.moveUp();
                break;
            case 'left-side-move-control':
                this._model.moveLeft();
                break;
            case 'right-side-move-control':
                this._model.moveRight();
                break;
            case 'wide-bottom-move-control':
                this._model.moveDown();
                break;
        }
        this.draw();
    }, false, this);
};

app.ViewController.prototype.updateCoordinates = function (e) {
    var coordinates = e.currentTarget.childNodes[1];

    var xCm, yCm, zoom;
    xCm = (e.offsetX - this._model.getAppliedTranslationX()) / app.PIXELonCM;
    yCm = (e.offsetY - this._model.getAppliedTranslationY()) / app.PIXELonCM;
    zoom = Math.floor(100 * this._model.getZoom());
    goog.dom.setTextContent(coordinates, 'x: ' + xCm.toFixed(2) + ' cm, y: ' + yCm.toFixed(2) + ' cm, zoom: ' + zoom + ' %');
};

app.ViewController.prototype.canvasMoved = function (e) {
    var diffX, diffY;

    diffX = e.offsetX - this._mouseCursorPoint[0];
    diffY = e.offsetY - this._mouseCursorPoint[1];

    this._mouseCursorPoint[0] = e.offsetX;
    this._mouseCursorPoint[1] = e.offsetY;

    this._model.translate(diffX, diffY);
    this.draw();
};

app.ViewController.prototype.reverseTransformPoint = function (point) {
    return this._model.reverseTransformPoint(point);
};

app.ViewController.prototype.reverseScale = function(point) {
    return this._model.reverseScale(point);
};

app.ViewController.prototype.setViewModel = function (view) {
    this._model = view;
};

app.ViewController.prototype.getReflectionsCount = function () {
    return this._reflectionsCount;
};

app.ViewController.prototype.setReflectionsCount = function (count) {
    this._reflectionsCount = count;
};

app.ViewController.prototype.setComponents = function(components) {
    this._components = components;
};

app.ViewController.prototype.addRay = function (ray) {
    this._rays.push(ray);
};

app.ViewController.prototype.draw = function () {
    var ctx = this._model.getGraphicsContext(),
        i, j, rayLength, newRayLength, endPoint, ray, componentID, callback = this.addRay.bind(this);

    // clean canvas
    var area = this._model.getVisibleArea();
    ctx.clearRect(area[0], area[1], area[2], area[3]);

    for (i = 0; i < this._components.length; i++) {
        this._components[i].draw(ctx, callback);
    }

    ctx.beginPath();

    var generateRays = true, raysCount, depthCount = 0;
    while (generateRays) {
        raysCount = this._rays.length;
        depthCount++;
        for (i = 0; i < raysCount; i++) {
            rayLength = Infinity;
            ray = this._rays.shift();
            for (j = 0; j < this._components.length; j++) {
                newRayLength = this._components[j].isIntersection(ray);
                if (newRayLength < rayLength) {
                    rayLength = newRayLength;
                    componentID = j;
                }
            }

            if (rayLength != Infinity) {
                endPoint = this._components[componentID].intersect(this._rays);
                ctx.moveTo(ray[0], ray[1]);
                ctx.lineTo(endPoint[0], endPoint[1]);
            } // TODO else let him to hit wall
        }

        if (this._rays.length == 0 || depthCount >= this._reflectionsCount) {
            generateRays = false;
        }
    }

    // delete remaining rays
    this._rays = [];

    // draw everything
    ctx.stroke();
};