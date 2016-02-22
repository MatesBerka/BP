goog.provide('app.MirrorController');

goog.require('app.ComponentController');

/**
 * @constructor
 * @extends {app.ComponentController}
 */
app.MirrorController = function() {
    app.MirrorController.base(this, 'constructor');

    this._selectedComponentType = 'MIRROR';

};

goog.inherits(app.MirrorController, app.ComponentController);

app.MirrorController.prototype.showComponentControlPanel = function(sceneController) {
    app.MirrorController.base(this, 'showComponentControlPanel', sceneController);

    this._addPanelListeners(sceneController);
};

app.MirrorController.prototype._addPanelListeners = function(sceneController) {
    app.MirrorController.base(this, '_addPanelListeners', sceneController);
};