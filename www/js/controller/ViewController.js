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

app.ViewController = function () {
    this._reflectionsCount = 4;

    this._isAddNewComponent = false;

    this._newComponentType = null;

    this._componentMoveAction = false;

    this._componentMoved = false;

    this._canvasMoveActive = false;

    this._model = null;

    this._componentController = null;

    this._rays = [];

    this._mouseCursorPoint = [];

    this._pixelsOnCm = goog.dom.getElement('cm-box').clientWidth;
};

app.ViewController.prototype.addListeners = function (view) {
    var classThis = this;

    // coordinates update
    goog.events.listen(view, goog.events.EventType.MOUSEMOVE, classThis.updateCoordinates, true, this);

    // mouse down events
    goog.events.listen(view, goog.events.EventType.MOUSEDOWN, function (e) {
        if (this._isAddNewComponent) { // pridani nove
            this.addComponent(e.offsetX, e.offsetY);
        } else if (this.isIntersection(e)) { // vyber komponenty
            this._componentMoveActive = true;
            this._mouseCursorPoint = [e.offsetX, e.offsetY];
            goog.events.listen(view, goog.events.EventType.MOUSEMOVE, this.componentMoved, true, this);
        } else { // muze byt posun platna
            this._canvasMoveActive = true;
            goog.events.listen(view, goog.events.EventType.MOUSEMOVE, this.canvasMoved, true, this);
        }
    }, false, this);

    // mouse up events
    goog.events.listen(view, goog.events.EventType.MOUSEUP, function (e) {
        if (this._isAddNewComponent) {
            this._isAddNewComponent = false;
            app.sceneController.hideCross();
        } else if (this._componentMoveActive && this._componentMoved) {
            this._componentMoveActive = false;
            this._componentMoved = false;
            this._componentController.removeSelected();
            this.draw();
            goog.events.unlisten(view, goog.events.EventType.MOUSEMOVE, this.componentMoved, true, this);
        } else if (this._componentMoveActive && !this._componentMoved) {
            this._componentMoveActive = false;
            this._componentController.removeSelected();
            this._componentController.showComponentControlPanel(this);
            goog.events.unlisten(view, goog.events.EventType.MOUSEMOVE, this.componentMoved, true, this);
        } else if (this._canvasMoveActive) {
            this._canvasMoveActive = false;
            goog.events.unlisten(view, goog.events.EventType.MOUSEMOVE, this.canvasMoved, true, this);
        }
    }, false, this);

    goog.events.listen(goog.dom.getElementByClass('zoom', view), goog.events.EventType.CLICK, function(e) {
        if(e.target.className === 'zoom-in') {
            this._model.scaleUp();
        } else {
            this._model.scaleDown();
        }
        this.draw();
    }, false, this);

    goog.events.listen(goog.dom.getElementByClass('move-control', view), goog.events.EventType.CLICK, function(e) {
        switch(e.target.className) {
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

app.ViewController.prototype.addComponent = function (coordX, coordY) {
    var model = null;

    switch (this._newComponentType) {
        case 'MIRROR':
            this._componentController = new app.MirrorController();
            model = new app.model.Mirror(coordX, coordY);
            break;
        case 'LENS':
            this._componentController = new app.LensController();
            model = new app.model.Lens(coordX, coordY);
            break;
        case 'HOLO-PLATE':
            this._componentController = new app.HolographicPlateController();
            model = new app.model.HolographicPlate(coordX, coordY);
            break;
        case 'WALL':
            this._componentController = new app.WallController();
            model = new app.model.Wall(coordX, coordY);
            break;
        case 'SPLITTER':
            this._componentController = new app.SplitterController();
            model = new app.model.Splitter(coordX, coordY);
            break;
        case 'LIGHT':
            this._componentController = new app.LightController();
            model = new app.model.Light(coordX, coordY);
            model.setLightID(this._model.getNewLightID());
            break;
    }

    this._model.addComponent(model);
    this._componentController.setSelectedComponentModel(model);
    this._componentController.showComponentControlPanel(this);
    this.draw();
};

app.ViewController.prototype.setAddNewComponent = function (type) {
    this._isAddNewComponent = true;
    this._newComponentType = type;
};

app.ViewController.prototype.removeListeners = function (view) {
    // todo funguje to ikdyz jsem vynechal eventListener na konci? (track)
    goog.events.unlisten(view, goog.events.EventType.MOUSEMOVE, this.updateCoordinates);
};

app.ViewController.prototype.updateCoordinates = function (e) {
    var coordinates = e.currentTarget.childNodes[1];

    var xCm, yCm, zoom;
    xCm = e.offsetX / this._pixelsOnCm;
    yCm = e.offsetY / this._pixelsOnCm;
    zoom = Math.floor(100 * this._model.getZoom());
    goog.dom.setTextContent(coordinates, 'x: ' + xCm.toFixed(2) + ' cm, y: ' + yCm.toFixed(2) + ' cm, zoom: ' + zoom + ' %');
};

app.ViewController.prototype.componentMoved = function (e) {
    var diffX, diffY;

    diffX = e.offsetX - this._mouseCursorPoint[0];
    diffY = e.offsetY - this._mouseCursorPoint[1];

    this._mouseCursorPoint[0] = e.offsetX;
    this._mouseCursorPoint[1] = e.offsetY;

    this._componentMoved = true;
    this._componentController.updatePosition(diffX, diffY);
    this.draw();
};

app.ViewController.prototype.canvasMoved = function (e) {

};

app.ViewController.prototype.setSelectedComponent = function (componentModel) {
    switch (componentModel.getType()) {
        case 'MIRROR':
            this._componentController = new app.MirrorController();
            break;
        case 'LENS':
            this._componentController = new app.LensController();
            break;
        case 'HOLO-PLATE':
            this._componentController = new app.HolographicPlateController();
            break;
        case 'WALL':
            this._componentController = new app.WallController();
            break;
        case 'SPLITTER':
            this._componentController = new app.SplitterController();
            break;
        case 'LIGHT':
            this._componentController = new app.LightController();
            break;
    }

    this._componentController.setSelectedComponentModel(componentModel);
};

app.ViewController.prototype.isIntersection = function (e) {
    // FIND COMPONENT AND MARK IT AS SELECTED
    var components = this._model.getComponents();
    var point = this._model.reverseTransformPoint([e.offsetX, e.offsetY]);
    for (var i = 0; i < components.length; i++) {
        if (components[i].isSelected(point[0], point[1])) {
            this.setSelectedComponent(components[i]);
            return true;
        }
    }
    return false;
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

app.ViewController.prototype.addRay = function (ray) {
    this._rays.push(ray);
};

app.ViewController.prototype.draw = function () {
    var ctx = this._model.getGraphicsContext(),
        components = this._model.getComponents(),
        i = 0, j, rayLength, newRayLength, endPoint, ray, componentID, callback = this.addRay.bind(this);

    // clean canvas
    ctx.clearRect(0, 0, this._model.getViewWidth(), this._model.getViewHeight());

    for (i; i < components.length; i++) {
        components[i].draw(ctx, callback);
    }

    ctx.beginPath();

    var generateRays = true, raysCount, depthCount = 0;
    while(generateRays) {
        raysCount = this._rays.length;
        depthCount++;
        for(i = 0; i < raysCount; i++) {
            rayLength = Infinity;
            ray = this._rays.shift();
            for (j = 0; j < components.length; j++) {
                newRayLength = components[j].isIntersection(ray);
                if (newRayLength < rayLength) {
                    rayLength = newRayLength;
                    componentID = j;
                }
            }

            if (rayLength != Infinity) {
                endPoint = components[componentID].intersect(this._rays);
                ctx.moveTo(ray[0], ray[1]);
                ctx.lineTo(endPoint[0], endPoint[1]);
            } // TODO else let him to hit wall
        }

        if(this._rays.length == 0 || depthCount >= 15) {
            generateRays = false;
        }
    }

    // draw everything
    ctx.stroke();
};

// CONSTRUCTOR
//public Position transformPoint(Position center, Position position, Matrix matrix) {
//    double x, y, z;
//    double tempX, tempY, tempZ;
//
//    x = position.getX() - center.getX();
//    y = position.getY() - center.getY();
//    z = position.getZ() - center.getZ();
//
//    Matrix point = new Matrix(new double[][]{{x}, {y}, {z}});
//
//    point = matrix.times(point);
//
//    if (center.getX() == 0 && center.getY() == 0 && center.getZ() == 0) {
//        tempX = scale * (point.data[0][0] + center.getX());
//        tempY = scale * (point.data[1][0] + center.getY());
//        tempZ = scale * (point.data[2][0] + center.getZ());
//    } else {
//        tempX = point.data[0][0] + center.getX();
//        tempY = point.data[1][0] + center.getY();
//        tempZ = point.data[2][0] + center.getZ();
//    }
//    return new Position(tempX, tempY, tempZ);
//}
//
//protected Position reverseTransformPoint(Position center, Position position, Matrix matrix) {
//    double x, y, z;
//    double tempX, tempY, tempZ;
//
//    x = position.getX() - center.getX();
//    y = position.getY() - center.getY();
//    z = position.getZ() - center.getZ();
//
//    Matrix point = new Matrix(new double[][]{{x}, {y}, {z}});
//    point = Matrix.transpose(matrix).times(point);
//
//    if (center.getX() == 0 && center.getY() == 0 && center.getZ() == 0) {
//        tempX = scale * (point.data[0][0] + center.getX());
//        tempY = scale * (point.data[1][0] + center.getY());
//        tempZ = scale * (point.data[2][0] + center.getZ());
//    } else {
//        tempX = point.data[0][0] + center.getX();
//        tempY = point.data[1][0] + center.getY();
//        tempZ = point.data[2][0] + center.getZ();
//    }
//    return new Position(tempX, tempY, tempZ);
//}

//app.ViewController.prototype.draw = function(x, y, random, canvas) {
//    if (canvas && canvas.getContext) {
//        var ctx = canvas.getContext('2d');
//
//        // resize the canvas to fill browser window dynamically
//        //window.addEventListener('resize', resizeCanvas, false);
//        //function resizeCanvas() {
//        //    console.log("resize");
//        //    // todo
//        //    //canvas.width = window.innerWidth;
//        //    //canvas.height = window.innerHeight;
//        //}
//        //resizeCanvas();
//
//        if (ctx) {
//            ctx.clearRect(0, 0, 819, 400);
//
//            if(random) {
//                function getRandomColor() {
//                    var letters = '0123456789ABCDEF'.split('');
//                    var color = '#';
//                    for (var i = 0; i < 6; i++ ) {
//                        color += letters[Math.floor(Math.random() * 16)];
//                    }
//                    return color;
//                }
//                ctx.strokeStyle=getRandomColor();
//            }
//
//            var obstacle = new Path2D();
//            ctx.lineWidth = 4;
//            obstacle.moveTo(600, 350);
//            obstacle.lineTo(700, 300);
//            ctx.stroke(obstacle);
//
//            obstacle.moveTo(70, 70);
//            obstacle.lineTo(70, 300);
//            ctx.stroke(obstacle);
//
//            ctx.lineWidth = 1;
//
//            //for(var angle = 0; angle < 360; angle += 30) {
//            //    ctx.moveTo(405, 200);
//            //    x = Math.sin(angle * (Math.PI/180)) * 100;
//            //    y = Math.cos(angle * (Math.PI/180)) * 100;
//            //    ctx.lineTo(x + 405, y + 200);
//            //}
//
//            var bounceLimit = 2;
//            var raysCount = 1000;
//
//            var segments = [
//                [0, 0, 819, 0],
//                [819, 0, 819, 400],
//                [819, 400, 0, 400],
//                [0, 400, 0, 0],
//                [600, 350, 700, 300],
//                [70, 70, 70, 300]
//            ];
//
//            //    dx = s.x1 - s.x0
//            //    dy = s.y1 - s.y0
//            //    Calculate normal
//            //    len = Math.sqrt(dx*dx + dy*dy)
//            //    s.xn = -dy / len
//            //    s.yn = dx / len
//
//            var raysPositions = [];
//            var n = 0, m = 0, s1x, s1y, sDx, sDy, closestDist, rayDisX, rayDisY, raySlope,
//                radians, rayStart, rayOrgX, rayOrgY, rayDirX = 0, rayDirY = 0, segment, closestSegment;
//
//            for(var i = 0; i < raysCount; i++) {
//                radians = Math.random() * 6.283185307179586;
//                rayDirX = Math.sin(radians);
//                rayDirY = Math.cos(radians);
//                raysPositions.push([x, y, rayDirX, rayDirY]);
//            }
//
//            var limit = (bounceLimit * raysCount) + raysCount;
//            for(var count = 0; count < limit; count++) {
//                closestSegment = null;
//                // get ray
//                rayStart = raysPositions.shift();
//                rayOrgX = rayStart[0];
//                rayOrgY = rayStart[1];
//                rayDirX = rayStart[2];
//                rayDirY = rayStart[3];
//                ctx.moveTo(rayOrgX, rayOrgY);
//
//                closestDist = Number.MAX_VALUE;  rayDisX = 0; rayDisY = 0;
//                raySlope = ((rayDirX == 0) ? Number.MAX_VALUE : (rayDirY / rayDirX));
//
//                for(segment = 0; segment < segments.length; segment++) {
//                    s1x = segments[segment][0];
//                    s1y = segments[segment][1];
//                    sDx = segments[segment][2] - s1x;
//                    sDy = segments[segment][3] - s1y;
//
//                    n = ((s1x - rayOrgX)*raySlope + (rayOrgY - s1y)) / (sDy - sDx*raySlope);
//                    if (n < 0 || n > 1)
//                        continue;
//
//                    m = ((rayDirX == 0) ? (Number.MAX_VALUE - 1) : ((s1x + sDx * n - rayOrgX) / rayDirX));
//                    if (m < 0)
//                        continue;
//
//                    //# It's an intersection! Store it, and keep track of the closest one.
//                    if (m < closestDist) {
//                        closestDist = m;
//                        closestSegment = segments[segment];
//                        //# Locate the intersection point
//                        rayDisX = rayOrgX + (closestDist -1) * rayDirX;
//                        rayDisY = rayOrgY + (closestDist - 1) * rayDirY;
//                    }
//                } // inner loop
//
//                if(closestSegment != null) {
//
//                    var dx = closestSegment[0] - closestSegment[2];
//                    var dy = closestSegment[1] - closestSegment[3];
//                    var len = Math.sqrt(dx*dx + dy*dy);
//                    var xn = -dy / len;
//                    var yn = dx / len;
//
//                    var d = 2 * (xn * rayDirX + yn * rayDirY);
//                    rayDirX -= d * xn;
//                    rayDirY -= d * yn;
//                    raysPositions.push([rayDisX, rayDisY, rayDirX, rayDirY]);
//                    ctx.lineTo(rayDisX, rayDisY);
//                    //ctx.stroke();
//                    //console.log(rayDisX, rayDisY);
//                    //rayDisX = rayDisX + 100 * rayDirX;
//                    //rayDisY = rayDisY + 100 * rayDirY;
//                    //
//                    //ctx.lineTo(rayDisX, rayDisY);
//                }
//                //Avoid floating-point coordinates and use integers instead
//                //ctx.stroke();
//            } // outer loop
//            ctx.stroke();
//
//            // and sun
//            ctx.beginPath();
//            ctx.arc(x, y, 10, 0, 2 * Math.PI);
//            ctx.fill();
//        }
//
//
//    }
//};