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

    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, app.translation['com-height']),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-height', 'class': 'input-min', 'id': 'com-height',
                    'value': this._model.getHeight()
                })
            )
        )
    );

    this._addPanelListeners(sceneController);
};

app.LensController.prototype._addPanelListeners = function(sceneController) {
    app.LensController.base(this, '_addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-height'), goog.events.EventType.CHANGE, function (e) {
        this._model.setHeight(parseInt(e.target.value, 10));
        sceneController.redrawAll();
    }, true, this);
};