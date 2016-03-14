goog.provide('app.start');
goog.provide('app.utils');

goog.require('goog.events');
goog.require('app.SceneController');
goog.require('app.MenuController');
goog.require('app.locales');
goog.require('goog.labs.userAgent.device');

/**
 * @description Diffractive optics simulator
 * @version 1.2
 * @author Matěj Berka
 * @export
 * Make {@code app.start} accessible after {@code ADVANCED_OPTIMIZATIONS}.
 * Entry point of application, creates main application controllers
 */
app.start = function () {

    app._init();
    app.utils.translate();
    /**
     * @const
     * @private
     */
    app._SCENECONTROLLER = new app.SceneController();
    /**
     * @const
     * @private
     */
    app._MENUCONTROLLER = new app.MenuController(app._SCENECONTROLLER);
};

/**
 * @private
 */
app._init = function () {
    /**
     * @type {!string}
     * @public
     */
    app.LOCALE = 'en_US';
    /**
     * @type {number}
     * @public
     */
    app.PIXELS_ON_CM = goog.dom.getElement('cm-box').clientWidth;
    /**
     * The maximum angels difference of two rays
     * @type {!number}
     * @public
     */
    app.COHERENCE_LENGTH = 500;
    /**
     * @const
     * @type {!number}
     * @public
     */
    app.INCH_TO_CM = 2.54;
    /**
     * @type {!number}
     * @public
     */
    app.REFLECTIONS_COUNT = 4;

    if (goog.labs.userAgent.device.isDesktop()) {
        /** @type {goog.events.EventType|string} */
        app.MOUSE_DOWN_EVENT = goog.events.EventType.MOUSEDOWN;
        /** @type {goog.events.EventType|string} */
        app.MOUSE_UP_EVENT = goog.events.EventType.MOUSEUP;
        /** @type {goog.events.EventType|string} */
        app.MOUSE_MOVE_EVENT = goog.events.EventType.MOUSEMOVE;
    } else {
        /** @type {goog.events.EventType|string} */
        app.MOUSE_DOWN_EVENT = goog.events.EventType.TOUCHSTART;
        /** @type {goog.events.EventType|string} */
        app.MOUSE_UP_EVENT = goog.events.EventType.TOUCHEND;
        /** @type {goog.events.EventType|string} */
        app.MOUSE_MOVE_EVENT = goog.events.EventType.TOUCHMOVE;
    }
};

/**
 * @public
 */
app.utils.translate = function () {
    app.translation = app.TRANSLATION[app.LOCALE];

    for (var key in app.translation) {
        var el = goog.dom.getElement(key);
        if (el !== null) {
            goog.dom.setTextContent(goog.dom.getElement(key), app.translation[key]);
        }
    }
};

/**
 * @param {!number} screenSize
 * @public
 */
app.utils.updatePixelsPerCM = function (screenSize) {
    var diagonal = Math.sqrt(window.screen.height * window.screen.height + window.screen.width * window.screen.width);
    app.PIXELS_ON_CM = diagonal/(screenSize*app.INCH_TO_CM);
};

/**
 * @returns {string}
 * @public
 */
app.utils.getScreenSize = function () {
    var diagonal = Math.sqrt(window.screen.height * window.screen.height + window.screen.width * window.screen.width);
    return (diagonal/(app.PIXELS_ON_CM*app.INCH_TO_CM)).toFixed(2);
};

/**
 * @returns {!string}
 * @public
 */
app.utils.getTolerance = function () {
    return (app.COHERENCE_LENGTH / app.PIXELS_ON_CM).toFixed(2);
};
/**#
 * @param {!number} tolerance
 * @public
 */
app.utils.setTolerance = function (tolerance) {
    app.COHERENCE_LENGTH = Math.round(tolerance * app.PIXELS_ON_CM);
};