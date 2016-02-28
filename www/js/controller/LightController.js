goog.provide('app.LightController');

goog.require('app.ComponentController');
goog.require('goog.ui.Select');

/**
 * @param {app.model.Light} model
 * @param {!number} modelID
 * @constructor
 * @extends {app.ComponentController}
 */
app.LightController = function (model, modelID) {
    app.LightController.base(this, 'constructor');
    /**
     * Points to currently selected component model
     * @type {app.model.Light}
     * @override
     */
    this.model = model;
    /**
     * @override
     */
    this.modelID = modelID;
};

goog.inherits(app.LightController, app.ComponentController);

/**
 * @override
 * @param sceneController
 */
app.LightController.prototype.showComponentControlPanel = function (sceneController) {
    app.LightController.base(this, 'showComponentControlPanel', sceneController);

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side', 'id': 'com-light-size'}, app.translation['com-light-size']),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-size', 'class': 'input-min', 'id': 'com-size',
                    'value': this.model.getSize()
                })
            )
        )
    );

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-light'}, app.translation["com-light"])
    );

    var option1, option2;
    if(this.model.getLightType() == 'BEAM') {
        option1 = goog.dom.createDom('option', {'value': 'BEAM', 'selected': 'selected', 'id': 'com-light-beam'}, app.translation['com-light-beam']);
        option2 = goog.dom.createDom('option', {'value': 'CIRCLE', 'id': 'com-light-circle'},  app.translation['com-light-circle']);
    } else {
        option1 = goog.dom.createDom('option', {'value': 'BEAM', 'id': 'com-light-beam'},  app.translation['com-light-beam']);
        option2 = goog.dom.createDom('option', {'value': 'CIRCLE', 'selected': 'selected', 'id': 'com-light-circle'},  app.translation['com-light-circle']);
    }

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side', 'id': 'com-light-type-title'}, app.translation['com-light-type-title']),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('select', {'id': 'com-light-type'}, option1, option2)
            )
        )
    );
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side', 'id': 'com-light-rays-count'}, app.translation['com-light-rays-count']),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-rays-count', 'class': 'input-min', 'id': 'com-rays-count',
                    'value': this.model.getRaysCount()
                })
            )
        )
    );
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side', 'id': 'com-light-radius'}, app.translation['com-light-radius']),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-radius', 'class': 'input-min', 'id': 'com-radius',
                    'value': this.model.getRadius()
                })
            )
        )
    );

    this.addPanelListeners(sceneController);
};

/**
 * @override
 * @param sceneController
 */
app.LightController.prototype.addPanelListeners = function (sceneController) {
    app.LightController.base(this, 'addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-size'), goog.events.EventType.KEYUP, function (e) {
        app.ComponentController.validateFloatInput(e, this.model.setSize);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-rays-count'), goog.events.EventType.KEYUP, function (e) {
        app.ComponentController.validateIntInput(e, this.model.setRaysCount);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-radius'), goog.events.EventType.KEYUP, function (e) {
        app.ComponentController.validateFloatInput(e, this.model.setRadius);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-light-type'), goog.events.EventType.CHANGE, function (e) {
        this.model.setLightType(e.target.value);
        sceneController.redrawAll();
    }, true, this);
};