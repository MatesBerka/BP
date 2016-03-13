goog.provide('app.WallController');

goog.require('app.ComponentController');

/**
 * @param {!app.model.Wall} model
 * @param {!number} modelID
 * @constructor
 * @extends {app.ComponentController}
 */
app.WallController = function (model, modelID) {
    app.WallController.base(this, 'constructor');
    /**
     * Points to currently selected component model
     * @type {app.model.Wall}
     * @override
     */
    this.model = model;
    /**
     * @override
     */
    this.modelID = modelID;
};

goog.inherits(app.WallController, app.ComponentController);

/**
 * @override
 * @param {app.SceneController} sceneController
 */
app.WallController.prototype.showComponentControlPanel = function (sceneController) {
    app.WallController.base(this, 'showComponentControlPanel', sceneController);

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {
                'class': 'com-left-side',
                'id': 'com-height-title'
            }, app.translation["com-height-title"]),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-height', 'class': 'input-min', 'id': 'com-height',
                    'value': this.model.getHeight()
                })
            )
        )
    );

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {
                'class': 'com-left-side',
                'id': 'com-width-title'
            }, app.translation["com-width-title"]),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-width', 'class': 'input-min', 'id': 'com-width',
                    'value': this.model.getWidth()
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
app.WallController.prototype.addPanelListeners = function (sceneController) {
    app.WallController.base(this, 'addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-height'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.WallController}
         * @param {goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatNoZeroInput(e, this.model.setHeight, this.model);
            sceneController.redrawAll();
        }, true, this);

    goog.events.listen(goog.dom.getElement('com-width'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.WallController}
         * @param {goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatNoZeroInput(e, this.model.setWidth, this.model);
            sceneController.redrawAll();
        }, true, this);
};