goog.provide('app.MirrorController');

goog.require('app.ComponentController');

/**
 * @param {!app.model.Mirror} model
 * @param {!number} modelID
 * @constructor
 * @extends {app.ComponentController}
 */
app.MirrorController = function (model, modelID) {
    app.MirrorController.base(this, 'constructor');
    /**
     * Points to currently selected component model
     * @type {app.model.Mirror}
     * @override
     */
    this.model = model;
    /**
     * @override
     */
    this.modelID = modelID;
};

goog.inherits(app.MirrorController, app.ComponentController);

/**
 * @override
 * @param sceneController
 */
app.MirrorController.prototype.showComponentControlPanel = function (sceneController) {
    app.MirrorController.base(this, 'showComponentControlPanel', sceneController);

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {
                'class': 'com-left-side',
                'id': 'com-height-title'
            }, app.translation['com-height-title']),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-height', 'class': 'input-min', 'id': 'com-height',
                    'value': this.model.getHeight()
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
app.MirrorController.prototype.addPanelListeners = function (sceneController) {
    app.MirrorController.base(this, 'addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-height'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.MirrorController}
         * @param {goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatNoZeroInput(e, this.model.setHeight, this.model);
            sceneController.redrawAll();
        }, true, this);
};