goog.provide('app.LensController');

goog.require('app.ComponentController');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!app.model.Lens} model
 * @param {!number} modelID
 * @constructor
 * @extends {app.ComponentController}
 * Controller used by app.model.Lens component. Adds specific controls for this component.
 */
app.LensController = function (model, modelID) {
    app.LensController.base(this, 'constructor', model, modelID);;
};

goog.inherits(app.LensController, app.ComponentController);

/**
 * @override
 */
app.LensController.prototype.showComponentControlPanel = function (sceneController) {
    app.LensController.base(this, 'showComponentControlPanel', sceneController);

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

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-lens'}, app.translation["com-lens"])
    );

    var option1, option2;
    if (this.model.getLensType() == 'DIVERGING') {
        option1 = goog.dom.createDom('option', {
            'value': 'DIVERGING',
            'selected': 'selected',
            'id': 'com-lens-type-div'
        }, app.translation["com-lens-type-div"]);
        option2 = goog.dom.createDom('option', {
            'value': 'CONVERGING',
            'id': 'com-lens-type-con'
        }, app.translation["com-lens-type-con"]);
    } else {
        option1 = goog.dom.createDom('option', {
            'value': 'DIVERGING',
            'id': 'com-lens-type-div'
        }, app.translation["com-lens-type-div"]);
        option2 = goog.dom.createDom('option', {
            'value': 'CONVERGING',
            'selected': 'selected',
            'id': 'com-lens-type-con'
        }, app.translation["com-lens-type-con"]);
    }

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {
                'class': 'com-left-side',
                'id': 'com-lens-type-title'
            }, app.translation["com-lens-type-title"]),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('select', {'id': 'com-lens-type'}, option1, option2)
            )
        )
    );
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {
                'class': 'com-left-side',
                'id': 'com-lens-focus-offset'
            }, app.translation['com-lens-focus-offset']),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-focus-offset', 'class': 'input-min', 'id': 'com-focus-offset',
                    'value': this.model.getFocusOffset()
                })
            )
        )
    );

    this.addPanelListeners(sceneController);
};

/**
 * @override
 */
app.LensController.prototype.addPanelListeners = function (sceneController) {
    app.LensController.base(this, 'addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-height'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.LensController}
         * @param {goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatNoZeroNoNegativeInput(e, this.model.setHeight, this.model);
            sceneController.redrawAll();
        }, true, this);

    goog.events.listen(goog.dom.getElement('com-lens-type'), goog.events.EventType.CHANGE,
        /**
         * @this {!app.LensController}
         * @param {goog.events.BrowserEvent} e
         */
        function (e) {
            this.model.setLensType(e.target.value);
            sceneController.redrawAll();
        }, true, this);

    goog.events.listen(goog.dom.getElement('com-focus-offset'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.LensController}
         * @param {goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatNoZeroNoNegativeInput(e, this.model.setFocusOffset, this.model);
            sceneController.redrawAll();
        }, true, this);
};