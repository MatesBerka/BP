goog.provide('app.WallController');

goog.require('app.ComponentController');

/**
 * @constructor
 * @extends {app.ComponentController}
 */
app.WallController = function() {
    app.WallController.base(this, 'constructor');

    this._selectedComponentType = 'WALL';
};

goog.inherits(app.WallController, app.ComponentController);

app.WallController.prototype.showComponentControlPanel = function(sceneController) {
    this._componentConfigurationPanel.style.display = "block";
    goog.dom.classlist.add(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
    var html =  '<label id="com-position">' + app.translation["com-position"] + '</label>' +
                '<div class="input-field">X: <input type="text" name="com-height" class="input-min" id="com-height" value="' + this._model.getPosX() + '"> cm</div>' +
                '<div class="input-field">Y: <input type="text" name="com-height" class="input-min" id="com-height"  value="' + this._model.getPosY() + '"> cm</div>';

    this._componentConfigurationPanel.innerHTML = html;

    this._addPanelListeners(sceneController);
};

app.WallController.prototype.hideComponentControlPanel = function() {
    goog.dom.classlist.remove(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
    this._componentConfigurationPanel.innerHTML = '';
};

app.WallController.prototype._addPanelListeners = function(sceneController) {
};