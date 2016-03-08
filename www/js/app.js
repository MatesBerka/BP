/**
 * @author Matej Berka
 */
goog.provide('app.start');
goog.provide('app.utils');

goog.require('goog.events');
goog.require('app.SceneController');
goog.require('app.MenuController');
goog.require('app.locales');
goog.require('goog.labs.userAgent.device');

app.LOCALE = 'en_US';

/**
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
    app.SCENECONTROLLER = new app.SceneController(true);
    /**
     * @const
     * @private
     */
    app.MENUCONTROLLER = new app.MenuController(app.SCENECONTROLLER);
};

/**
 * @private
 */
app._init = function () {
    /**
     * @type {number}
     */
    app.PIXELS_ON_CM = goog.dom.getElement('cm-box').clientWidth;
    /**
     * @const
     * @type {number}
     */
    app.INCH_TO_CM = 2.54;

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

// TODO vlnova delka svetla u svetla
// TODO ON/OFF light switch
// TODO pravitko
// TODO mrizka
// todo AUTHOR HEADER
// TODO opravdu holograficka deska deli skupiny dobre?

// ray [[x,y,z],[x,y,z], lightID, rayLength];
// _intersectionRay and ray in intersect()

//co brat v potaz?
//· Po?áte?ní pozice (x,y,z)
//· Po?áte?ní optickŭ prvek (prvek, ze kterého paprsek vychází)
//· Sm?rovŭ vektor
//· Seznam vlnovŭch délek
//· Vlastnosti polarizace (pro kadou vlnovou délku)
//· Vlastnosti koherence (pro kadou vlnovou délku)
//· Energie (pro kadou vlnovou délku)
//· Cílovŭ optickŭ prvek (po nalezení)
//· Cílová pozice(x,y,z) (po nalezení)

//http://www.gymhol.cz/projekt/fyzika/09_difrakce/09_difrakce.htm
//https://www.youtube.com/watch?v=i20bzCUw464
//http://fyzika.jreichl.com/main.article/view/481-zobrazeni-tenkou-cockou
//https://www.youtube.com/watch?v=i20bzCUw464
//https://phet.colorado.edu/sims/geometric-optics/geometric-optics_cs.html
//http://www.e-fyzika.cz/kapitoly/08-geometricka-optika.pdf
//http://www.gymhol.cz/projekt/fyzika/05_cocky/05_cocky.htm
//http://www.itnetwork.cz/maturitni-otazka-fyzika-zobrazeni-cocky-zrcadla-pristroje
//https://cs.wikipedia.org/wiki/Rozptyln%C3%A1_%C4%8Do%C4%8Dka
//http://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-use-degrees-instead-of-radians

//normalize2DVector
//http://forum.matematika.cz/viewtopic.php?id=5845

//Lens.js
//https://www.google.cz/search?q=rozptylka&espv=2&biw=1920&bih=979&tbm=isch&source=lnms&sa=X&ved=0ahUKEwiX2MqH1_TKAhVDJ5oKHRzID6MQ_AUIBygB&dpr=1#imgrc=N_psa3FtWOpzFM%3A
//https://www.youtube.com/watch?v=i20bzCUw464
//https://www.khanacademy.org/science/physics/geometric-optics/mirrors-and-lenses/v/thin-lens-equation-and-problem-solving

//_drawBall
//http://billmill.org/static/canvastutorial/ball.html
//https://developer.mozilla.org/cs/docs/Canvas_tutori%C3%A1l/Kreslen%C3%AD_tvar%C5%AF
//http://www.html5canvastutorials.com/tutorials/html5-canvas-circles/

//LineShapeComponent/isIntersection
//https://rootllama.wordpress.com/2014/06/20/ray-line-segment-intersection-test-in-2d/#comments
//LineShapeComponent/isSelected
//http://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection