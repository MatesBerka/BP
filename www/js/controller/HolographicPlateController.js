goog.provide('app.HolographicPlateController');

goog.require('app.ComponentController');

/**
 * @constructor
 * @extends {app.ComponentController}
 */
app.HolographicPlateController = function() {
    app.HolographicPlateController.base(this, 'constructor');

    this._selectedComponentType = 'HOLO-PLATE';
};

goog.inherits(app.HolographicPlateController, app.ComponentController);

app.HolographicPlateController.prototype.showComponentControlPanel = function(sceneController) {
    app.HolographicPlateController.base(this, 'showComponentControlPanel', sceneController);

    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side', 'id': 'com-height-title'}, app.translation['com-height-title']),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-height', 'class': 'input-min', 'id': 'com-height',
                    'value': this._model.getHeight()
                })
            )
        )
    );

    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'buttons-group'},
            goog.dom.createDom('button', {'id': 'com-record-btn'}, app.translation['com-btn-title-record'])
        )
    );

    this._addPanelListeners(sceneController);
};

app.HolographicPlateController.prototype._addPanelListeners = function(sceneController) {
    app.HolographicPlateController.base(this, '_addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-height'), goog.events.EventType.KEYUP, function (e) {
        this._model.setHeight(parseFloat(e.target.value));
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-record-btn'), goog.events.EventType.CLICK, function (e) {
        // TODO first pick refrence light
        this._model.makeRecord(1); // light id
        sceneController.redrawAll();
        this._model.showRecord();
        sceneController.redrawAll();
    }, true, this);
};