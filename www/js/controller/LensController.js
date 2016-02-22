goog.provide('app.LensController');

goog.require('app.ComponentController');

/**
 * @constructor
 * @extends {app.ComponentController}
 */
app.LensController = function() {
    app.LensController.base(this, 'constructor');

    this._selectedComponentType = 'LENS';
};

goog.inherits(app.LensController, app.ComponentController);

app.LensController.prototype.showComponentControlPanel = function(sceneController) {
    app.LensController.base(this, 'showComponentControlPanel', sceneController);

    this._addPanelListeners(sceneController);
};

app.LensController.prototype._addPanelListeners = function(sceneController) {
    app.LensController.base(this, '_addPanelListeners', sceneController);


};