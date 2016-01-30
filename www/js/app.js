goog.provide('app.start');

goog.require('goog.debug.DivConsole');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.graphics');
goog.require('goog.log');
goog.require('app.SceneController');
goog.require('app.MenuController');

app.LOCALE = 'cs_CZ';
/**
 * Make {@code app.start} accessible after {@code ADVANCED_OPTIMIZATIONS}.
 * @param {Object} config
 * @export
 */
app.start = function() {

    app.setCanvasWrapperHeight();
    app.translate();

    if(true) {
        // if url empty init default settings
        app.init();
    } else {
        // else load data
        app.loadSimulation();
    }
    // add menu actions
    //scene.addTable()
    //scene.addView()

    // add tabs actions

    // init workspace/scene
    //var scene = new app.Scene(); // scene manager
    // init default table and view
    //scene.init();
    //scene.draw(x, y, random, canvas);
};

app.setCanvasWrapperHeight = function() {
    var body = document.body,
        html = document.documentElement;

    var height = Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    height = height - 184;
    var wrapper = goog.dom.getElement('canvas-wrapper');
    wrapper.style.height = height + 'px';
};

app.init = function() {
    this.menuController = new app.MenuController();
    this.sceneController = new app.SceneController(true);
    // todo co tady?
};

app.loadSimulation = function() {};

app.translate = function() {
    var i = 0,
    locale = app.TRANSLATION[app.LOCALE];

    for(i; i < locale.length; i++) {
        goog.dom.setTextContent(goog.dom.getElement(locale[i][0]), locale[i][1]);
    }
};



// todo detect mouse
//function isInsideSector(point, center, radius, angle1, angle2) {
//    function areClockwise(center, radius, angle, point2) {
//        var point1 = {
//            x : (center.x + radius) * Math.cos(angle),
//            y : (center.y + radius) * Math.sin(angle)
//        };
//        return -point1.x*point2.y + point1.y*point2.x > 0;
//    }
//
//    var relPoint = {
//        x: point.x - center.x,
//        y: point.y - center.y
//    };
//
//    return !areClockwise(center, radius, angle1, relPoint) &&
//        areClockwise(center, radius, angle2, relPoint) &&
//        (relPoint.x*relPoint.x + relPoint.y*relPoint.y <= radius * radius);
//}

//var canvas = document.getElementById('table-0');
//function redraw() {
//    app.start(405,200, true, canvas);
//}
//
//app.start(405,200, false, canvas);
//goog.events.listen(canvas, goog.events.EventType.MOUSEDOWN, function(e) {
//    goog.events.listen(canvas, goog.events.EventType.MOUSEMOVE, track);
//});
//
//goog.events.listen(canvas, goog.events.EventType.MOUSEUP, function(e) {
//    goog.events.unlisten(canvas, goog.events.EventType.MOUSEMOVE, track);
//});
//
//function track(e) {
//    app.start(e.offsetX, e.offsetY, false, canvas);
//}