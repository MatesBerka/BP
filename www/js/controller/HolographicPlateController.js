goog.provide('app.HolographicPlateController');

goog.require('app.ComponentController');

app.HolographicPlateController = function() {
    app.HolographicPlateController.base(this, 'constructor');

    this._selectedComponentType = 'HOLO-PLATE';
};

goog.inherits(app.HolographicPlateController, app.ComponentController);

app.HolographicPlateController.prototype.showComponentControlPanel = function(viewController) {
    this._componentConfigurationPanel.style.display = "block";
    goog.dom.classlist.add(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');

    var html = '<label id="com-position">' + app.translation["com-position"] + '</label>' +
        '<div class="input-field">X: <input type="text" name="com-height" class="input-min" id="com-height" value="' + this._model.getPosX() + '"> cm</div>' +
        '<div class="input-field">Y: <input type="text" name="com-height" class="input-min" id="com-height"  value="' + this._model.getPosY() + '"> cm</div>' +
        '<div id="component-buttons"><button id="com-record-btn">Record</button></div>';

    this._componentConfigurationPanel.innerHTML = html;
    this.addPanelListeners(viewController);
};

app.HolographicPlateController.prototype.hideComponentControlPanel = function() {
    this._componentConfigurationPanel.style.display = "none";
    goog.dom.classlist.remove(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
};

app.HolographicPlateController.prototype.addPanelListeners = function(viewController) {
    goog.events.listen(goog.dom.getElement('com-record-btn'), goog.events.EventType.CLICK, function (e) {

        // TODO first pick refrence light
        this._model.makeRecord(1); // light id
        viewController.draw();
        this._model.showRecord();
        viewController.draw();
    }, true, this);
};