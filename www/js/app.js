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
 * Entry point, creates main application controllers
 */
app.start = function () {

    app._init();
    app.utils.translate();
    /**
     * Contains scene controller, main controller used to control simulation
     * @const
     * @private
     */
    app._SCENECONTROLLER = new app.SceneController();
    /**
     * Contains menu controller, used to control simulation navigation
     * @const
     * @private
     */
    app._MENUCONTROLLER = new app.MenuController(app._SCENECONTROLLER);
};

/**
 * Creates default variables and constants used across simulation
 * @private
 */
app._init = function () {
    /**
     * Defines conversion between inches and centimeters
     * @const
     * @type {!number}
     * @public
     */
    app.INCH_TO_CM = 2.54;
    /**
     * Simulator version
     * @const
     * @version 1.1.4
     * @type {!string}
     */
    app.VERSION = '1.1.5';
    /**
     * Simulator default locale
     * @type {!string}
     * @public
     */
    app.locale = 'en_US';
    /**
     * Defines conversion between pixels and centimeters
     * @type {number}
     * @public
     */
    app.pixels_on_cm = goog.dom.getElement('cm-box').clientWidth;
    /**
     * The maximum angels difference of two rays
     * @type {!number}
     * @public
     */
    app.coherence_length = 500;
    /**
     * Defines maximum reflections count
     * @type {!number}
     * @public
     */
    app.reflections_count = 7;
    /** Checks device type and sets correct event types used to control simulation */
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
 * Utils function used to translate text in application
 * @public
 */
app.utils.translate = function () {
    app.translation = app.TRANSLATION[app.locale];

    for (var key in app.translation) {
        var el = goog.dom.getElement(key);
        if (el !== null) {
            goog.dom.setTextContent(goog.dom.getElement(key), app.translation[key]);
        }
    }
};

/**
 * Utils function used tu update px/cm conversion
 * @param {!number} screenSize
 * @public
 */
app.utils.updatePixelsPerCM = function (screenSize) {
    var diagonal = Math.sqrt(window.screen.height * window.screen.height + window.screen.width * window.screen.width);
    app.pixels_on_cm = diagonal/(screenSize*app.INCH_TO_CM);
};

/**
 * Utils function used to update screen size
 * @returns {string}
 * @public
 */
app.utils.getScreenSize = function () {
    var diagonal = Math.sqrt(window.screen.height * window.screen.height + window.screen.width * window.screen.width);
    return (diagonal/(app.pixels_on_cm*app.INCH_TO_CM)).toFixed(2);
};

/**
 * Returns light length difference tolerance
 * @returns {!string}
 * @public
 */
app.utils.getTolerance = function () {
    return (app.coherence_length / app.pixels_on_cm).toFixed(2);
};

/**
 * Sets light length difference tolerance
 * @param {!number} tolerance
 * @public
 */
app.utils.setTolerance = function (tolerance) {
    app.coherence_length = Math.round(tolerance * app.pixels_on_cm);
};