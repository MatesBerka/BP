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
app.start = function() {
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
app._init = function() {
    /**
     * @const
     * @type {number}
     */
    app.PIXEL_ON_CM = goog.dom.getElement('cm-box').clientWidth;

    if(goog.labs.userAgent.device.isDesktop()) {
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

app.utils.translate = function() {
    app.translation = app.TRANSLATION[app.LOCALE];

    for (var key in app.translation) {
        var el = goog.dom.getElement(key);
        if(el !== null) {
            goog.dom.setTextContent(goog.dom.getElement(key), app.translation[key]);
        }
    }
};

//http://kingscalculator.com/cz/ostatni-kalkulacky/vypocet-hustoty-pixelu
//https://cs.wikipedia.org/wiki/Body_na_palec
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
//https://google.github.io/closure-library/api/

// TODO spatny prevod centimetru
// TODO klavesove skratky pro pridavani komponent
// TODO pravitko
// TODO mrizka
// todo save
// todo tablet
// todo wheel event
// todo tab index
// TODO ON/OFF light switch
// todo remove http link in comments (@see)
// TODO vylepsi pridavani komponent do menu, automaticky cyklus?
// TODO opravdu holograficka deska deli skupiny dobre?
// TODO add favicon http://www.freefavicon.com/freefavicons/objects/iconinfo/graduation-hat-152-193065.html

// TODO add to renema to table.js 427 SceneController.js
// TODO x: 36.97 cm, y: NaN cm, zoom: 100 %
// TODO problem s metodami jako addComponent

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

//normalize2DVector
//http://forum.matematika.cz/viewtopic.php?id=5845