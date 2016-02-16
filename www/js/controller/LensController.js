goog.provide('app.LensController');

goog.require('app.ComponentController');

app.LensController = function() {
    app.LensController.base(this, 'constructor');

    this._selectedComponentType = 'LENS';
};

goog.inherits(app.LensController, app.ComponentController);

app.LensController.prototype.showComponentControlPanel = function() {
    this._componentConfigurationPanel.style.display = "block";
    goog.dom.classlist.add(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
};

app.LensController.prototype.hideComponentControlPanel = function() {
    this._componentConfigurationPanel.style.display = "none";
    goog.dom.classlist.remove(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
};

app.LensController.prototype.addPanelListeners = function() {

};