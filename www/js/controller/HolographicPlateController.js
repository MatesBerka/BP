goog.provide('app.HolographicPlateController');

goog.require('app.ComponentController');

/**
 * @param {!app.model.HolographicPlate} model
 * @param {!number} modelID
 * @constructor
 * @extends {app.ComponentController}
 */
app.HolographicPlateController = function(model, modelID) {
    app.HolographicPlateController.base(this, 'constructor');
    /**
     * Points to currently selected component model
     * @type {app.model.HolographicPlate}
     * @override
     */
    this.model = model;
    /**
     * @override
     */
    this.modelID = modelID;
};

goog.inherits(app.HolographicPlateController, app.ComponentController);

/**
 * @override
 * @param sceneController
 */
app.HolographicPlateController.prototype.showComponentControlPanel = function(sceneController) {
    app.HolographicPlateController.base(this, 'showComponentControlPanel', sceneController);

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side', 'id': 'com-height-title'}, app.translation['com-height-title']),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-height', 'class': 'input-min', 'id': 'com-height',
                    'value': this.model.getHeight()
                })
            )
        )
    );

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-position'}, app.translation["com-plate-settings"])
    );
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, app.translation["com-plate-resolution"]),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-plate-res', 'class': 'input-min', 'id': 'com-plate-res',
                    'value': this.model.getPlateResolution()
                })
            )
        )
    );
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, app.translation["com-plate-tolerance"]),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-plate-tol', 'class': 'input-min', 'id': 'com-plate-tol',
                    'value': this.model.getAngleTolerance()
                })
            )
        )
    );

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'buttons-group'},
            goog.dom.createDom('button', {'id': 'com-record-btn'}, app.translation['com-record-btn'])
        )
    );

    this.addPanelListeners(sceneController);
};

/**
 * @override
 * @param sceneController
 */
app.HolographicPlateController.prototype.addPanelListeners = function(sceneController) {
    app.HolographicPlateController.base(this, 'addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-height'), goog.events.EventType.KEYUP, function (e) {
        app.ComponentController.validateFloatInput(e, this.model.setHeight, this.model);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-plate-res'), goog.events.EventType.KEYUP, function (e) {
        app.ComponentController.validateFloatInput(e, this.model.setPlateResolution, this.model);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-plate-tol'), goog.events.EventType.KEYUP, function (e) {
        app.ComponentController.validateFloatInput(e, this.model.setAngleTolerance, this.model);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-record-btn'), goog.events.EventType.CLICK, function (e) {
        // colect lights
        // redraw
        this.model.makeRecord(1); // light id
        sceneController.redrawAll();
        this.model.showRecord();
        sceneController.redrawAll();
    }, true, this);
};