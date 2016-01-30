goog.provide('app.SceneController');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('app.ViewController');
goog.require('app.model.Table');
goog.require('app.model.View');

/**
 * @constructor
 */
app.SceneController = function(newSimulation) {

    this.viewController = new app.ViewController();

    this.canvasWrapper = goog.dom.getElement('canvas-wrapper');

    this.tables = [];

    this.views = [];

    if(newSimulation) {
        this.init();
    }
};

app.SceneController.prototype.init = function() {
    var newTable = new app.model.Table();
    this.tables.push(newTable);
    var tableElement = this.addTable(0);

    var newView = new app.model.View(0, 0, 0, 0);
    this.views.push([newView]);
    this.addView(0, 0, tableElement);
};

app.SceneController.prototype.addTable = function(tableID) {
    var tableName = 'table-' + tableID;
    var table = goog.dom.createDom('div', {'id': tableName, 'class': 'table-wrapper'});
    goog.dom.append(this.canvasWrapper, table);

    return table;
};

app.SceneController.prototype.addView = function(viewID, tableID, tableElement) {
    var canvasName = 'canvas-' + tableID + '-' + viewID,
    viewName = 'view-' + tableID + '-' + viewID;

    var view = goog.dom.createDom('div', {'id': viewName, 'class': 'view-wrapper'});
    var canvas = goog.dom.createDom('canvas', {'id': canvasName});
    var coordinates = goog.dom.createDom('div', {'class': 'mouse-coordinates'}, 'x: 0 cm, y: 0 cm, zoom: 100%');
    goog.dom.append(view, canvas);
    goog.dom.append(view, coordinates);
    goog.dom.append(tableElement, view);
    this.viewController.addListeners(view);
};

app.SceneController.prototype.addListener = function(view) {
    // todo tady listener na add new table a add new view
};

// todo
app.SceneController.prototype.loadComponentSettings = function(comp, tableID) {};

// todo
app.SceneController.prototype.updateAllViews = function(table) {};

app.SceneController.prototype.drawMousePosition = function() {};

app.SceneController.prototype.draw = function(x, y, random, canvas) {
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext('2d');

        // resize the canvas to fill browser window dynamically
        //window.addEventListener('resize', resizeCanvas, false);
        //function resizeCanvas() {
        //    console.log("resize");
        //    // todo
        //    //canvas.width = window.innerWidth;
        //    //canvas.height = window.innerHeight;
        //}
        //resizeCanvas();

        if (ctx) {
            ctx.clearRect(0, 0, 819, 400);

            if(random) {
                function getRandomColor() {
                    var letters = '0123456789ABCDEF'.split('');
                    var color = '#';
                    for (var i = 0; i < 6; i++ ) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                }
                ctx.strokeStyle=getRandomColor();
            }

            var obstacle = new Path2D();
            ctx.lineWidth = 4;
            obstacle.moveTo(600, 350);
            obstacle.lineTo(700, 300);
            ctx.stroke(obstacle);

            obstacle.moveTo(70, 70);
            obstacle.lineTo(70, 300);
            ctx.stroke(obstacle);

            ctx.lineWidth = 1;

            //for(var angle = 0; angle < 360; angle += 30) {
            //    ctx.moveTo(405, 200);
            //    x = Math.sin(angle * (Math.PI/180)) * 100;
            //    y = Math.cos(angle * (Math.PI/180)) * 100;
            //    ctx.lineTo(x + 405, y + 200);
            //}

            var bounceLimit = 2;
            var raysCount = 1000;

            var segments = [
                [0, 0, 819, 0],
                [819, 0, 819, 400],
                [819, 400, 0, 400],
                [0, 400, 0, 0],
                [600, 350, 700, 300],
                [70, 70, 70, 300]
            ];

            //    dx = s.x1 - s.x0
            //    dy = s.y1 - s.y0
            //    Calculate normal
            //    len = Math.sqrt(dx*dx + dy*dy)
            //    s.xn = -dy / len
            //    s.yn = dx / len

            var raysPositions = [];
            var n = 0, m = 0, s1x, s1y, sDx, sDy, closestDist, rayDisX, rayDisY, raySlope,
                radians, rayStart, rayOrgX, rayOrgY, rayDirX = 0, rayDirY = 0, segment, closestSegment;

            for(var i = 0; i < raysCount; i++) {
                radians = Math.random() * 6.283185307179586;
                rayDirX = Math.sin(radians);
                rayDirY = Math.cos(radians);
                raysPositions.push([x, y, rayDirX, rayDirY]);
            }

            var limit = (bounceLimit * raysCount) + raysCount;
            for(var count = 0; count < limit; count++) {
                closestSegment = null;
                // get ray
                rayStart = raysPositions.shift();
                rayOrgX = rayStart[0];
                rayOrgY = rayStart[1];
                rayDirX = rayStart[2];
                rayDirY = rayStart[3];
                ctx.moveTo(rayOrgX, rayOrgY);

                closestDist = Number.MAX_VALUE;  rayDisX = 0; rayDisY = 0;
                raySlope = ((rayDirX == 0) ? Number.MAX_VALUE : (rayDirY / rayDirX));

                for(segment = 0; segment < segments.length; segment++) {
                    s1x = segments[segment][0];
                    s1y = segments[segment][1];
                    sDx = segments[segment][2] - s1x;
                    sDy = segments[segment][3] - s1y;

                    n = ((s1x - rayOrgX)*raySlope + (rayOrgY - s1y)) / (sDy - sDx*raySlope);
                    if (n < 0 || n > 1)
                        continue;

                    m = ((rayDirX == 0) ? (Number.MAX_VALUE - 1) : ((s1x + sDx * n - rayOrgX) / rayDirX));
                    if (m < 0)
                        continue;

                    //# It's an intersection! Store it, and keep track of the closest one.
                    if (m < closestDist) {
                        closestDist = m;
                        closestSegment = segments[segment];
                        //# Locate the intersection point
                        rayDisX = rayOrgX + (closestDist -1) * rayDirX;
                        rayDisY = rayOrgY + (closestDist - 1) * rayDirY;
                    }
                } // inner loop

                if(closestSegment != null) {

                    var dx = closestSegment[0] - closestSegment[2];
                    var dy = closestSegment[1] - closestSegment[3];
                    var len = Math.sqrt(dx*dx + dy*dy);
                    var xn = -dy / len;
                    var yn = dx / len;

                    var d = 2 * (xn * rayDirX + yn * rayDirY);
                    rayDirX -= d * xn;
                    rayDirY -= d * yn;
                    raysPositions.push([rayDisX, rayDisY, rayDirX, rayDirY]);
                    ctx.lineTo(rayDisX, rayDisY);
                    //ctx.stroke();
                    //console.log(rayDisX, rayDisY);
                    //rayDisX = rayDisX + 100 * rayDirX;
                    //rayDisY = rayDisY + 100 * rayDirY;
                    //
                    //ctx.lineTo(rayDisX, rayDisY);
                }
                //Avoid floating-point coordinates and use integers instead
                //ctx.stroke();
            } // outer loop
            ctx.stroke();

            // and sun
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI);
            ctx.fill();
        }


    }
};