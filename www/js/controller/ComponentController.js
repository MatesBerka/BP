goog.provide('app.ComponentController');

/**
 * @constructor
 */
app.ComponentController = function() {

    this._model = null;

    this._selectedComponentType = null;

    this._componentConfigurationPanel = goog.dom.getElement('component-configuration');

    this._pixelsOnCm = goog.dom.getElement('cm-box').clientWidth;
};

app.ComponentController.prototype.showComponentControlPanel = goog.abstractMethod;

app.ComponentController.prototype.hideComponentControlPanel = goog.abstractMethod;

app.ComponentController.prototype.addPanelListeners = goog.abstractMethod;

app.ComponentController.prototype.setSelectedComponentModel = function(model) {
    this._model = model;
};

app.ComponentController.prototype.removeSelected = function() {
    this._model.setSelected(false);
};

app.ComponentController.prototype.updatePosition = function(diffX, diffY) {
    this._model.applyTranslation(diffX, diffY);
};