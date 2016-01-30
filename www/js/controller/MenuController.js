goog.provide('app.MenuController');

/**
 * @constructor
 */
app.MenuController = function() {
    this.addListeners();
};

app.MenuController.prototype.addListeners = function() {
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

    var light = goog.dom.getElement('logo');
    goog.events.listen(light, goog.events.EventType.MOUSEDOWN, function(e) {
        alert('please click into canvas');
        app.ViewController.isAddNewComponent = true;
        app.ViewController.newComponentType = 'light';
    });
};