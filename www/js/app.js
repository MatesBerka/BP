goog.provide('app.start');
goog.provide('app.utils');

goog.require('goog.events');
goog.require('app.SceneController');
goog.require('app.MenuController');
goog.require('app.locales');

app.LOCALE = 'en_US';
/**
 * Make {@code app.start} accessible after {@code ADVANCED_OPTIMIZATIONS}.
 * @export
 */
app.start = function() {
    app.PIXEL_ON_CM = goog.dom.getElement('cm-box').clientWidth;

    app.utils.translate();

    var sceneController = new app.SceneController(true);
    var menuController = new app.MenuController(sceneController);

    //if(true) { // TODO check url
    //    // if url empty init default settings
    //    app.init();
    //} else {
    //    // else load data
    //    app.loadSimulation();
    //}
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

// TODO  light ID - muzou dojit
// TODO  view ID - problem budou se spatne generovat
// TODO spatny prevod centimetru
// TODO klavesove skratky pro pridavani komponent
// TODO pravitko
// TODO mrizka
// todo save
// todo tablet
// TODO ON/OFF light switch
// todo remove http link in comments (@see)
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
