goog.provide('app.MenuController');

goog.require('goog.ui.Dialog');
/**
 * @constructor
 */
app.MenuController = function() {
    this.refDialog = new goog.ui.Dialog();
    this.refDialog.setTitle(app.translation['reflections-count']);
    this.refDialog.setButtonSet(goog.ui.Dialog.ButtonSet.OK_CANCEL);

    this.addListeners();

};

app.MenuController.prototype.addListeners = function() {
    var refDialog = this.refDialog;
    var classThis = this;

    // HOVER EFFECT
    var li = goog.dom.getElementsByTagNameAndClass('li', 'menu-item'), i = 0;
    for(i; i < li.length; i++) {
        goog.events.listen(li[i], goog.events.EventType.MOUSEENTER, function(e) {
            var child = goog.dom.getLastElementChild(e.currentTarget), classes = child.classList, j = 0;
            for(j; j < child.classList.length; j++) {
                if(child.classList[j] == 'nested-items') {
                    child.style.display = 'block';
                }
            }
            e.stopPropagation();
        });

        goog.events.listen(li[i], goog.events.EventType.MOUSELEAVE, function(e) {
            var child = goog.dom.getLastElementChild(e.currentTarget), classes = child.classList, j = 0;
            for(j; j < child.classList.length; j++) {
                if(child.classList[j] == 'nested-items') {
                    child.style.display = 'none';
                }
            }
            e.stopPropagation();
        });
    }

    // simulation/settings/count of reflection
    goog.events.listen(refDialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        if(e.key == 'ok') {
            var input = goog.dom.getElement('reflection-count-input');
            if(isNaN(input.value) || input.value < 1) {
                input.style.backgroundColor = "red";
                e.preventDefault();
            } else {
                app.sceneController.viewController.reflectionsCount = input.value;
            }
        }
    });
    goog.events.listen(goog.dom.getElement('reflections-count'), goog.events.EventType.CLICK, function(e) {
        var value = app.sceneController.viewController.reflectionsCount,
        content = 'Insert count: <input type="text" id="reflection-count-input" name="reflection-count-input" value="'+value+'">';

        refDialog.setContent(content);
        refDialog.setVisible(true);
    });

    // simulation/settings/language
    goog.events.listen(goog.dom.getElementByClass('language-switch'), goog.events.EventType.CLICK, function(e) {
        // TODO save into cookies?
        if(e.target.id == "lang-en-us") {
            app.LOCALE = 'en_US';
        } else if(e.target.id == "lang-cs-cz") {
            app.LOCALE = 'cs_CZ';
        }
        app.translate();
    });

    // simulation/save simulation
    goog.events.listen(goog.dom.getElement('logo'), goog.events.EventType.CLICK, function(e) {

    });

    // simulation/export simulation
    goog.events.listen(goog.dom.getElement('logo'), goog.events.EventType.CLICK, function(e) {

    });

    // simulation/reset simulation
    goog.events.listen(goog.dom.getElement('logo'), goog.events.EventType.CLICK, function(e) {

    });

    // components/add mirror
    goog.events.listen(goog.dom.getElement('add-mirror'), goog.events.EventType.CLICK, function(e) {
        app.viewController.setComponentType('MIRROR');
        classThis.showCross();
    });

    // components/add lens
    goog.events.listen(goog.dom.getElement('add-lens'), goog.events.EventType.CLICK, function(e) {
        app.viewController.setComponentType('LENS');
        classThis.showCross();
    });

    // components/add holographic plate
    goog.events.listen(goog.dom.getElement('add-holo-plate'), goog.events.EventType.CLICK, function(e) {
        app.viewController.setComponentType('HOLO-PLATE');
        classThis.showCross();
    });

    // components/add wall
    goog.events.listen(goog.dom.getElement('add-wall'), goog.events.EventType.CLICK, function(e) {
        app.viewController.setComponentType('WALL');
        classThis.showCross();
    });

    // components/add light
    goog.events.listen(goog.dom.getElement('add-light'), goog.events.EventType.CLICK, function(e) {
        app.viewController.setComponentType('LIGHT');
        classThis.showCross();
    });

    // help
    goog.events.listen(goog.dom.getElement('help'), goog.events.EventType.CLICK, function(e) {
        alert("help!");
    });
};

app.MenuController.prototype.showCross = function() {
    app.ViewController.isAddNewComponent = true;
    app.sceneController.showCross();
};