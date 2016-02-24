goog.provide('app.LightController');

goog.require('app.ComponentController');
goog.require('goog.ui.Select');

/**
 * @constructor
 * @extends {app.ComponentController}
 */
app.LightController = function () {
    app.LightController.base(this, 'constructor');

    this._selectedComponentType = 'LIGHT';
};

goog.inherits(app.LightController, app.ComponentController);

app.LightController.prototype.showComponentControlPanel = function (sceneController) {
    app.LightController.base(this, 'showComponentControlPanel', sceneController);

    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, 'A: '),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-size', 'class': 'input-min', 'id': 'com-size',
                    'value': this._model.getSize()
                })
            )
        )
    );

    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-light'}, app.translation["com-light"])
    );

    var option1, option2;
    if(this._model.getLightType() == 'BEAM') {
        option1 = goog.dom.createDom('option', {'value': 'BEAM', 'selected': 'selected'}, 'Beam');
        option2 = goog.dom.createDom('option', {'value': 'CIRCLE'}, 'Circle');
    } else {
        option1 = goog.dom.createDom('option', {'value': 'BEAM'}, 'Beam');
        option2 = goog.dom.createDom('option', {'value': 'CIRCLE', 'selected': 'selected'}, 'Circle');
    }

    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, 'Light type: '),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('select', {'id': 'com-light-type'}, option1, option2)
            )
        )
    );
    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, 'Rays count: '),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-rays-count', 'class': 'input-min', 'id': 'com-rays-count',
                    'value': this._model.getRaysCount()
                })
            )
        )
    );
    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, 'Radius: '),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-radius', 'class': 'input-min', 'id': 'com-radius',
                    'value': this._model.getRadius()
                })
            )
        )
    );

    this._addPanelListeners(sceneController);
};

app.LightController.prototype._addPanelListeners = function (sceneController) {
    app.LightController.base(this, '_addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-size'), goog.events.EventType.KEYUP, function (e) {
        this._model.setSize(parseFloat(e.target.value));
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-rays-count'), goog.events.EventType.KEYUP, function (e) {
        this._model.setRaysCount(e.target.value);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-radius'), goog.events.EventType.KEYUP, function (e) {
        this._model.setRadius(parseFloat(e.target.value));
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-light-type'), goog.events.EventType.CHANGE, function (e) {
        this._model.setLightType(e.target.value);
        sceneController.redrawAll();
    }, true, this);
};