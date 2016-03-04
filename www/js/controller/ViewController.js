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
 * @param {Element} canvasWrapper
 * @final
 * @constructor
 */
app.ViewController = function (canvasWrapper) {
    /**
     * @const
     * @type {Element}
     * @private
     */
    this._CANVAS_WRAPPER = canvasWrapper;
    /**
     * @type {!number}
     * @private
     */
    this._reflectionsCount = 4;
    /**
     * @type {app.model.View}
     * @private
     */
    this._model = null;
    /**
     * @type {!Array<app.model.Component>}
     * @private
     */
    this._components = [];
    /**
     * @type {!Array<Array<!number>>}
     * @private
     */
    this._rays = [];
    /**
     * @type {!Array<!number>}
     * @private
     */
    this._mouseCursorPoint = [];
};

/**
 * @param {Element} view
 * @param {!Array<number>} coordinates
 * @public
 */
app.ViewController.prototype.addCanvasMove = function (view, coordinates) {
    this._mouseCursorPoint = coordinates;
    goog.events.listen(view, app.MOUSE_MOVE_EVENT, this._canvasMoved, true, this);
};

/**
 * @param {Element} view
 * @public
 */
app.ViewController.prototype.removeCanvasMove = function (view) {
    goog.events.unlisten(view, app.MOUSE_MOVE_EVENT, this._canvasMoved, true, this);
};

/**
 * @param {Element} view
 * @public
 */
app.ViewController.prototype.addListeners = function (view) {
    // coordinates update
    goog.events.listen(view, app.MOUSE_MOVE_EVENT, this._updateCoordinates, false, this);

    goog.events.listen(goog.dom.getElementByClass('zoom', view), goog.events.EventType.CLICK,
        /**
         * @this {!app.ViewController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            if (e.target.className === 'zoom-in') {
                this._model.scaleUp();
            } else {
                this._model.scaleDown();
            }
            this.draw();
        }, false, this);

    goog.events.listen(goog.dom.getElementByClass('move-control', view), goog.events.EventType.CLICK,
        /**
         * @this {!app.ViewController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
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

/**
 * @param {!goog.events.BrowserEvent} e
 * @private
 */
app.ViewController.prototype._updateCoordinates = function (e) {
    var coordinates = e.currentTarget.childNodes[1], xCm, yCm, zoom;
    xCm = (e.clientX - this._CANVAS_WRAPPER.offsetLeft - this._model.getAppliedTranslationX()) / app.PIXEL_ON_CM;
    yCm = (e.clientY - this._CANVAS_WRAPPER.offsetTop - this._model.getAppliedTranslationY()) / app.PIXEL_ON_CM;
    zoom = Math.floor(100 * this._model.getZoom());
    goog.dom.setTextContent(coordinates, 'x: ' + xCm.toFixed(2) + ' cm, y: ' + yCm.toFixed(2) + ' cm, zoom: ' + zoom + ' %');
};

/**
 * @param {!goog.events.BrowserEvent} e
 * @private
 */
app.ViewController.prototype._canvasMoved = function (e) {
    var diffX, diffY, move = [];

    move[0] = (e.clientX - this._CANVAS_WRAPPER.offsetLeft);
    move[1] = (e.clientY - this._CANVAS_WRAPPER.offsetTop);

    diffX = move[0] - this._mouseCursorPoint[0];
    diffY = move[1] - this._mouseCursorPoint[1];

    console.log(diffX, diffY);
    this._mouseCursorPoint = move;
    this._model.translate(diffX, diffY);
    this.draw();
};

/**
 * @param {!Array<!number>} point
 * @public
 */
app.ViewController.prototype.reverseTransformPoint = function (point) {
    return this._model.reverseTransformPoint(point);
};

/**
 * @param {!Array<!number>} point
 * @public
 */
app.ViewController.prototype.reverseScale = function (point) {
    return this._model.reverseScale(point);
};

/**
 * @param {!app.model.View} view
 * @public
 */
app.ViewController.prototype.setViewModel = function (view) {
    this._model = view;
};

/**
 * @return {!number}
 * @public
 */
app.ViewController.prototype.getReflectionsCount = function () {
    return this._reflectionsCount;
};

/**
 * @param {!number} count
 * @public
 */
app.ViewController.prototype.setReflectionsCount = function (count) {
    this._reflectionsCount = count;
};

/**
 * @param {!Array<app.model.Component>} components
 * @public
 */
app.ViewController.prototype.setComponents = function (components) {
    this._components = components;
};

/**
 * @param {!Array<number>} ray
 * @public
 */
app.ViewController.prototype.addRay = function (ray) {
    this._rays.push(ray);
};

/**
 * @public
 */
app.ViewController.prototype.draw = function () {
    var ctx = this._model.getGraphicsContext(),
        i, j, rayLength, newRayLength, endPoint, ray, componentID, callback = this.addRay.bind(this); // todo vylepsit?

    // clean canvas
    var area = this._model.getVisibleArea();
    ctx.clearRect(area[0], area[1], area[2], area[3]);
    for (i = 0; i < this._components.length; i++) {
        this._components[i].draw(ctx, /**@type{!function(Array<number>)}*/(callback));
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
                newRayLength = this._components[j].isIntersection(/**@type{!Array<number>}*/(ray));
                if (newRayLength < rayLength) {
                    rayLength = newRayLength;
                    componentID = j;
                }
            }

            if (rayLength != Infinity) {
                endPoint = this._components[/**@type{!number}*/(componentID)].intersect(this._rays, ray);
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