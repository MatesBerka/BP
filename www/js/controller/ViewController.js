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
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {Element} canvasWrapper
 * @final
 * @constructor
 * View controller provides basic actions used to interact with view. Like coordinates update and redrawing.
 */
app.ViewController = function (canvasWrapper) {
    /**
     * DOM element containing canvas wrapper
     * @const
     * @type {Element}
     * @private
     */
    this._CANVAS_WRAPPER = canvasWrapper;
    /**
     * Currently view model
     * @type {app.model.View}
     * @private
     */
    this._model = null;
    /**
     * Array of components added on currently active table
     * @type {!Array<app.model.Component>}
     * @private
     */
    this._components = [];
    /**
     * Help array used during redrawing and contains view rays
     * @type {!Array<Array<!number>>}
     * @private
     */
    this._rays = [];
    /**
     * Contains mouse coordinates
     * @type {!Array<!number>}
     * @private
     */
    this._mouseCursorPoint = [];
};

/**
 * Helper method to add listener for canvas move
 * @param {Element} view
 * @param {!Array<number>} coordinates
 * @public
 */
app.ViewController.prototype.addCanvasMove = function (view, coordinates) {
    this._mouseCursorPoint = coordinates;
    goog.events.listen(view, app.MOUSE_MOVE_EVENT, this._canvasMoved, true, this);
};

/**
 * Helper method to remove listener for canvas move
 * @param {Element} view
 * @public
 */
app.ViewController.prototype.removeCanvasMove = function (view) {
    goog.events.unlisten(view, app.MOUSE_MOVE_EVENT, this._canvasMoved, true, this);
};

/**
 * Add listeners used to interact with view
 * @param {Element} view
 * @public
 */
app.ViewController.prototype.addListeners = function (view) {
    // coordinates update
    goog.events.listen(view, app.MOUSE_MOVE_EVENT,
        /**
         * @this {!app.ViewController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._updateCoordinates(e, e.currentTarget.childNodes[1]);
        }, true, this);

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
            this._updateCoordinates(e, e.currentTarget.parentNode.childNodes[1]);
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
            this._updateCoordinates(e, e.currentTarget.parentNode.childNodes[1]);
            this.draw();
        }, false, this);
};

/**
 * Updates mouse coordinates displayed in view
 * @param {!goog.events.BrowserEvent} e
 * @param {!Node} coordinates
 * @public
 */
app.ViewController.prototype._updateCoordinates = function (e, coordinates) {
    var xCm, yCm, zoom;
    xCm = (e.clientX - this._CANVAS_WRAPPER.offsetLeft - this._model.getAppliedTranslationX()) / app.pixels_on_cm;
    yCm = (e.clientY - e.currentTarget.offsetTop - this._CANVAS_WRAPPER.offsetTop - this._model.getAppliedTranslationY()) / app.pixels_on_cm;
    zoom = Math.floor(100 * this._model.getZoom());
    goog.dom.setTextContent(coordinates, 'x: ' + xCm.toFixed(2) + ' cm, y: ' + yCm.toFixed(2) + ' cm, zoom: ' + zoom + ' %');
};

/**
 * Triggered when user moves with canvas to update displayed view
 * @param {!goog.events.BrowserEvent} e
 * @private
 */
app.ViewController.prototype._canvasMoved = function (e) {
    var diffX, diffY, move = [];

    move[0] = (e.clientX - this._CANVAS_WRAPPER.offsetLeft);
    move[1] = (e.clientY - e.currentTarget.offsetTop - this._CANVAS_WRAPPER.offsetTop);

    diffX = move[0] - this._mouseCursorPoint[0];
    diffY = move[1] - this._mouseCursorPoint[1];

    this._mouseCursorPoint = move;
    this._model.translate(diffX, diffY);
    e.stopPropagation();
    e.preventDefault();
    this.draw();
};

/**
 * Reverse transforms inserted point
 * @param {!Array<!number>} point
 * @public
 */
app.ViewController.prototype.reverseTransformPoint = function (point) {
    return this._model.reverseTransformPoint(point);
};

/**
 * Reverse scales inserted point
 * @param {!Array<!number>} point
 * @public
 */
app.ViewController.prototype.reverseScale = function (point) {
    return this._model.reverseScale(point);
};

/**
 * Sets new active view model
 * @param {!app.model.View} view
 * @public
 */
app.ViewController.prototype.setViewModel = function (view) {
    this._model = view;
};

/**
 * Returns currently active view model
 * @return {!app.model.View}
 * @public
 */
app.ViewController.prototype.getViewModel = function () {
    return /**@type{!app.model.View}*/(this._model);
};

/**
 * Sets new active set of components
 * @param {!Array<app.model.Component>} components
 * @public
 */
app.ViewController.prototype.setComponents = function (components) {
    this._components = components;
};

/**
 * Returns active set of components
 * @return {!Array<app.model.Component>}
 * @public
 */
app.ViewController.prototype.getComponents = function () {
    return this._components;
};

/**
 * Adds new ray into rays array to be drawn on canvas
 * @param {!Array<number>} ray
 * @public
 */
app.ViewController.prototype.addRay = function (ray) {
    this._rays.push(ray);
};

/**
 * Iterates over active table components and draws them on canvas with rays the generates
 * @public
 */
app.ViewController.prototype.draw = function () {
    var ctx = this._model.getGraphicsContext(),
        i, j, rayLength, newRayLength, endPoint, ray, componentID, callback = this.addRay.bind(this);

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
                endPoint = this._components[/**@type{!number}*/(componentID)].intersects(this._rays);
                ctx.moveTo(ray[app.RAY_ORIGIN_X], ray[app.RAY_ORIGIN_Y]);
                ctx.lineTo(endPoint[0], endPoint[1]);
            }
        }

        if (this._rays.length == 0 || depthCount >= app.reflections_count) {
            generateRays = false;
        }
    }
    // delete remaining rays
    this._rays = [];
    // draw everything
    ctx.stroke();
};