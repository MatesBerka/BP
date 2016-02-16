goog.provide('app.MirrorController');

goog.require('app.ComponentController');

app.MirrorController = function() {
    app.MirrorController.base(this, 'constructor');

    this._selectedComponentType = 'MIRROR';

};

goog.inherits(app.MirrorController, app.ComponentController);

app.MirrorController.prototype.showComponentControlPanel = function() {
    this._componentConfigurationPanel.style.display = "block";
    goog.dom.classlist.add(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
};

app.MirrorController.prototype.hideComponentControlPanel = function() {
    this._componentConfigurationPanel.style.display = "none";
    goog.dom.classlist.remove(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
};

app.MirrorController.prototype.addPanelListeners = function() {

};