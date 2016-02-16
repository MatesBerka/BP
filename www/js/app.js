goog.provide('app.start');

goog.require('goog.debug.DivConsole');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.graphics');
goog.require('goog.log');
goog.require('app.SceneController');
goog.require('app.MenuController');

app.LOCALE = 'en_US';
/**
 * Make {@code app.start} accessible after {@code ADVANCED_OPTIMIZATIONS}.
 * @param {Object} config
* @export
    */
app.start = function() {
    app.translate();
    if(true) { // TODO check url
        // if url empty init default settings
        app.init();
    } else {
        // else load data
        app.loadSimulation();
    }
};

app.init = function() {
    this.menuController = new app.MenuController();
    this.sceneController = new app.SceneController(true);
};

app.loadSimulation = function() {};

app.translate = function() {
    app.translation = app.TRANSLATION[app.LOCALE];

    for (var key in app.translation) {
        var el = goog.dom.getElement(key);
        if(el !== null) {
            goog.dom.setTextContent(goog.dom.getElement(key), app.translation[key]);
        }
    }
};