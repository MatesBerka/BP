goog.provide('app.MenuController');

goog.require('goog.ui.Dialog');
/**
 * @constructor
 */
app.MenuController = function () {

    this._pixelsOnCm = goog.dom.getElement('cm-box').clientWidth;

    this.init();

    this.addListeners();
};

app.MenuController.prototype.init = function () {
    this.refDialog = new goog.ui.Dialog();
    this.refDialog.setTitle(app.translation['reflections-count']);
    this.refDialog.setButtonSet(goog.ui.Dialog.ButtonSet.OK_CANCEL);

    this.help = new goog.ui.Dialog();
    this.help.setTitle(app.translation['help-title']);
    var helpButton = new goog.ui.Dialog.ButtonSet();
    helpButton.addButton({key: 'ok', caption: 'Ok'}, true);
    this.help.setButtonSet(helpButton);
};

app.MenuController.prototype.addListeners = function () {
    var refDialog = this.refDialog;

    // HOVER EFFECT
    var li = goog.dom.getElementsByTagNameAndClass('li', 'menu-item'), i = 0;
    for (i; i < li.length; i++) {
        goog.events.listen(li[i], goog.events.EventType.MOUSEENTER, function (e) {
            var child = goog.dom.getLastElementChild(e.currentTarget), classes = child.classList, j = 0;
            for (j; j < child.classList.length; j++) {
                if (child.classList[j] == 'nested-items') {
                    child.style.display = 'block';
                }
            }
            e.stopPropagation();
        });

        goog.events.listen(li[i], goog.events.EventType.MOUSELEAVE, function (e) {
            var child = goog.dom.getLastElementChild(e.currentTarget), classes = child.classList, j = 0;
            for (j; j < child.classList.length; j++) {
                if (child.classList[j] == 'nested-items') {
                    child.style.display = 'none';
                }
            }
            e.stopPropagation();
        });
    }

    // simulation/settings/count of reflection
    goog.events.listen(refDialog, goog.ui.Dialog.EventType.SELECT, function (e) {
        if (e.key == 'ok') {
            var input = goog.dom.getElement('reflection-count-input');
            if (isNaN(input.value) || input.value < 1) {
                input.style.backgroundColor = "red";
                e.preventDefault();
            } else {
                // todo predelat
                app.sceneController.setReflectionsCount(input.value);
            }
        }
    });

    goog.events.listen(goog.dom.getElement('reflections-count'), goog.events.EventType.CLICK, function (e) {
        // todo predelat
        var value = app.sceneController.getReflectionsCount(),
            content = 'Insert count: <input type="text" id="reflection-count-input" name="reflection-count-input" value="' + value + '">';
        refDialog.setContent(content);
        refDialog.setVisible(true);
    });

    // simulation/settings/language
    goog.events.listen(goog.dom.getElementByClass('language-switch'), goog.events.EventType.CLICK, function (e) {
        // TODO save into cookies?
        if (e.target.id == "lang-en-us") {
            app.LOCALE = 'en_US';
        } else if (e.target.id == "lang-cs-cz") {
            app.LOCALE = 'cs_CZ';
        }
        app.translate();
    });

    // simulation/save simulation
    goog.events.listen(goog.dom.getElement('logo'), goog.events.EventType.CLICK, function (e) {

    });

    // simulation/export simulation
    goog.events.listen(goog.dom.getElement('logo'), goog.events.EventType.CLICK, function (e) {

    });

    // simulation/reset simulation
    goog.events.listen(goog.dom.getElement('logo'), goog.events.EventType.CLICK, function (e) {

    });

    // components/add mirror
    goog.events.listen(goog.dom.getElement('add-mirror'), goog.events.EventType.CLICK, function (e) {
        app.sceneController.showCross('MIRROR');
    });

    // components/add lens
    goog.events.listen(goog.dom.getElement('add-lens'), goog.events.EventType.CLICK, function (e) {
        app.sceneController.showCross('LENS');
    });

    // components/add holographic plate
    goog.events.listen(goog.dom.getElement('add-holo-plate'), goog.events.EventType.CLICK, function (e) {
        app.sceneController.showCross('HOLO-PLATE');
    });

    // components/add wall
    goog.events.listen(goog.dom.getElement('add-wall'), goog.events.EventType.CLICK, function (e) {
        app.sceneController.showCross('WALL');
    });

    // components/add light
    goog.events.listen(goog.dom.getElement('add-light'), goog.events.EventType.CLICK, function (e) {
        app.sceneController.showCross('LIGHT');
    });

    goog.events.listen(goog.dom.getElement('add-splitter'), goog.events.EventType.CLICK, function (e) {
        app.sceneController.showCross('SPLITTER');
    });

    // help
    goog.events.listen(goog.dom.getElement('help'), goog.events.EventType.CLICK, function (e) {
        this.help.setContent("ahoj");
        this.help.setVisible(true);
    }, true, this);
};