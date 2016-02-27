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

    this._addPanelListeners(sceneController);
};

app.SplitterController.prototype._addPanelListeners = function(sceneController) {
    app.SplitterController.base(this, '_addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-height'), goog.events.EventType.KEYUP, function (e) {
        this._model.setHeight(parseFloat(e.target.value));
        sceneController.redrawAll();
    }, true, this);
};
