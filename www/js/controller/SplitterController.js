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
    app.SplitterController.base(this, 'showComponentControlPanel', sceneController);

    this._addPanelListeners(sceneController);
};

app.SplitterController.prototype._addPanelListeners = function(sceneController) {
    app.SplitterController.base(this, '_addPanelListeners', sceneController);
};
