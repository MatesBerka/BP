goog.provide('app.start');
goog.provide('app.utils');

goog.require('goog.events');
goog.require('app.SceneController');
goog.require('app.MenuController');
goog.require('app.locales');
goog.require('goog.labs.userAgent.device');

/**
 * @description Diffractive optics simulator
 * @version 1.1
 * @author Matej Berka
 *
 * Make {@code app.start} accessible after {@code ADVANCED_OPTIMIZATIONS}.
 * @export
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

// TODO Monochromaticke vs polo...
// TODO mala pismena? COHERENCE_LENGTH
// TODO ON/OFF light switch
// TODO pravitko
// TODO mrizka
// todo AUTHOR HEADER

// ray [[x,y,z],[x,y,z], lightID, rayLength];
//co brat v potaz?
//· Seznam vlnovŭch délek
//· Vlastnosti polarizace (pro kadou vlnovou délku)
//· Vlastnosti koherence (pro kadou vlnovou délku)
//· Energie (pro kadou vlnovou délku)

//http://www.gymhol.cz/projekt/fyzika/09_difrakce/09_difrakce.htm
//https://www.youtube.com/watch?v=i20bzCUw464
//http://fyzika.jreichl.com/main.article/view/481-zobrazeni-tenkou-cockou
//https://www.youtube.com/watch?v=i20bzCUw464
//https://www.khanacademy.org/science/physics/geometric-optics/mirrors-and-lenses/v/thin-lens-equation-and-problem-solving
//https://phet.colorado.edu/sims/geometric-optics/geometric-optics_cs.html
//http://www.e-fyzika.cz/kapitoly/08-geometricka-optika.pdf
//http://www.gymhol.cz/projekt/fyzika/05_cocky/05_cocky.htm
//http://www.itnetwork.cz/maturitni-otazka-fyzika-zobrazeni-cocky-zrcadla-pristroje
//https://cs.wikipedia.org/wiki/Rozptyln%C3%A1_%C4%8Do%C4%8Dka
//http://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-use-degrees-instead-of-radians