goog.provide('app.SplitterController');

goog.require('app.ComponentController');

/**
 * @constructor
 * @extends {app.ComponentController}
 */
app.SplitterController = function() {
    app.SplitterController.base(this, 'constructor');

    this._selectedComponentType = 'SPLITTER';
};

goog.inherits(app.SplitterController, app.ComponentController);

app.SplitterController.prototype.showComponentControlPanel = function(sceneController) {
    this._componentConfigurationPanel.style.display = "block";
    goog.dom.classlist.add(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');

    this._addPanelListeners(sceneController);
};

app.SplitterController.prototype.hideComponentControlPanel = function() {
    this._componentConfigurationPanel.style.display = "none";
    goog.dom.classlist.remove(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
};

app.SplitterController.prototype._addPanelListeners = function(sceneController) {
};
