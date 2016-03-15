goog.provide('app.SplitterController');

goog.require('app.ComponentController');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!app.model.Splitter} model
 * @param {!number} modelID
 * @constructor
 * @extends {app.ComponentController}
 * Controller used by app.model.Splitter component. Adds specific controls for this component.
 */
app.SplitterController = function (model, modelID) {
    app.SplitterController.base(this, 'constructor');
    /**
     * Points to currently selected component model
     * @type {app.model.Splitter}
     * @override
     */
    this.model = model;
    /**
     * @override
     */
    this.modelID = modelID;
};

goog.inherits(app.SplitterController, app.ComponentController);

/**
 * @override
 * @param sceneController
 */
app.SplitterController.prototype.showComponentControlPanel = function (sceneController) {
    app.SplitterController.base(this, 'showComponentControlPanel', sceneController);

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
app.SplitterController.prototype.addPanelListeners = function (sceneController) {
    app.SplitterController.base(this, 'addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-height'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.SplitterController}
         * @param {goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatNoZeroInput(e, this.model.setHeight, this.model);
            sceneController.redrawAll();
        }, true, this);
};
