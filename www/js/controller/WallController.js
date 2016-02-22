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
    app.WallController.base(this, 'showComponentControlPanel', sceneController);

    // dimensions
    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-dimensions'}, app.translation["com-dimensions"])
    );

    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, app.translation["com-height"]),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-height', 'class': 'input-min', 'id': 'com-height',
                    'value': this._model.getHeight()
                })
            )
        )
    );

    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, app.translation["com-width"]),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-width', 'class': 'input-min', 'id': 'com-width',
                    'value': this._model.getWidth()
                })
            )
        )
    );

    this._addPanelListeners(sceneController);
};

app.WallController.prototype._addPanelListeners = function(sceneController) {
    app.WallController.base(this, '_addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-height'), goog.events.EventType.KEYUP, function (e) {
        if(e.target.value !== '') {
            this._model.setHeight(parseFloat(e.target.value));
        } else {
            this._model.setHeight(0);
        }
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-width'), goog.events.EventType.KEYUP, function (e) {
        if(e.target.value !== '') {
            this._model.setWidth(parseFloat(e.target.value));
        } else {
            this._model.setWidth(0);
        }
        sceneController.redrawAll();
    }, true, this);
};