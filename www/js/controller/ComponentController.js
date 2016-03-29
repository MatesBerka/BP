goog.provide('app.ComponentController');

goog.require('goog.dom');

/**
 * @param {!app.model.Component} model
 * @param {!number} modelID
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @constructor
 * Base controller used to control simulation components.
 */
app.ComponentController = function (model, modelID) {
    /**
     * Points to currently selected component model
     * @type {app.model.Component}
     * @protected
     */
    this.model = model;
    /**
     * currently selected component model ID
     * @type {!number}
     * @protected
     */
    this.modelID = modelID;
    /**
     * Element which contains component control panel
     * @type {Element}
     * @protected
     */
    this.componentConfigurationPanel = goog.dom.getElement('component-configuration');
};

/**
 * Helper function to validate float input
 * @param {goog.events.Event} e
 * @param {function(!number)} callback
 * @param {app.model.Component} scope
 * @protected
 */
app.ComponentController.validateFloatInput = function (e, callback, scope) {
    var val = parseFloat(e.target.value.replace(/\,/g, '.'));
    if (isNaN(val)) {
        e.target.style.backgroundColor = "red";
    } else {
        e.target.style.backgroundColor = "white";
        callback.call(scope, val);
    }
};

/**
 * Helper function to validate float input
 * @param {goog.events.Event} e
 * @param {function(!number)} callback
 * @param {app.model.Component} scope
 * @protected
 */
app.ComponentController.validateFloatNoZeroInput = function (e, callback, scope) {
    var val = parseFloat(e.target.value.replace(/\,/g, '.'));
    if (isNaN(val) || val === 0) {
        e.target.style.backgroundColor = "red";
    } else {
        e.target.style.backgroundColor = "white";
        callback.call(scope, val);
    }
};

/**
 * Helper function to validate float input
 * @param {goog.events.Event} e
 * @param {function(!number)} callback
 * @param {app.model.Component} scope
 * @protected
 */
app.ComponentController.validateFloatNoNegativeInput = function (e, callback, scope) {
    var val = parseFloat(e.target.value.replace(/\,/g, '.'));
    if (isNaN(val) || val < 0) {
        e.target.style.backgroundColor = "red";
    } else {
        e.target.style.backgroundColor = "white";
        callback.call(scope, val);
    }
};

/**
 * Helper function to validate float input
 * @param {goog.events.Event} e
 * @param {function(!number)} callback
 * @param {app.model.Component} scope
 * @protected
 */
app.ComponentController.validateFloatNoZeroNoNegativeInput = function (e, callback, scope) {
    var val = parseFloat(e.target.value.replace(/\,/g, '.'));
    if (isNaN(val) || val <= 0) {
        e.target.style.backgroundColor = "red";
    } else {
        e.target.style.backgroundColor = "white";
        callback.call(scope, val);
    }
};

/**
 * Helper function to validate integer input
 * @param {goog.events.Event} e
 * @param {function(!number)} callback
 * @param {app.model.Component} scope
 * @protected
 */
app.ComponentController.validateIntInput = function (e, callback, scope) {
    var val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
        e.target.style.backgroundColor = "red";
    } else {
        e.target.style.backgroundColor = "white";
        callback.call(scope, val);
    }
};

/**
 * Helper function to validate integet input
 * @param {goog.events.Event} e
 * @param {function(!number)} callback
 * @param {app.model.Component} scope
 * @protected
 */
app.ComponentController.validateIntNoZeroInput = function (e, callback, scope) {
    var val = parseInt(e.target.value, 10);
    if (isNaN(val) || val === 0) {
        e.target.style.backgroundColor = "red";
    } else {
        e.target.style.backgroundColor = "white";
        callback.call(scope, val);
    }
};

/**
 * Helper function to validate integer input
 * @param {goog.events.Event} e
 * @param {function(!number)} callback
 * @param {app.model.Component} scope
 * @protected
 */
app.ComponentController.validateIntNoNegativeInput = function (e, callback, scope) {
    var val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) {
        e.target.style.backgroundColor = "red";
    } else {
        e.target.style.backgroundColor = "white";
        callback.call(scope, val);
    }
};

/**
 * Helper function to validate integer input
 * @param {goog.events.Event} e
 * @param {function(!number)} callback
 * @param {app.model.Component} scope
 * @protected
 */
app.ComponentController.validateIntNoZeroNoNegativeInput = function (e, callback, scope) {
    var val = parseInt(e.target.value, 10);
    if (isNaN(val) || val <= 0) {
        e.target.style.backgroundColor = "red";
    } else {
        e.target.style.backgroundColor = "white";
        callback.call(scope, val);
    }
};

/**
 * Helper function which return correct type translation according to model type
 * @public
 */
app.ComponentController.prototype._getComponentType = function () {
    var type = '';
    switch (this.model.getType()) {
        case 'MIRROR':
            type = app.translation['mirror-type'];
            break;
        case 'LENS':
            type = app.translation['lens-type'];
            break;
        case 'HOLO-PLATE':
            type = app.translation['holo-plate-type'];
            break;
        case 'WALL':
            type = app.translation['wall-type'];
            break;
        case 'SPLITTER':
            type = app.translation['splitter-type'];
            break;
        case 'LIGHT':
            type = app.translation['light-type'];
            break;
    }
    return type;
};

/**
 * Adds component controls into component control panel popup.
 * @param {app.SceneController} sceneController
 * @public
 */
app.ComponentController.prototype.showComponentControlPanel = function (sceneController) {
    goog.dom.removeChildren(this.componentConfigurationPanel);
    goog.dom.classlist.add(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');

    // component type
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'id': 'com-type'}, app.translation["com-type"], ' ' + this._getComponentType() + ' ' + this.model.getID())
    );

    // input x, y position
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-position'}, app.translation["com-position"])
    );
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, 'X: '),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-pos-x', 'class': 'input-min', 'id': 'com-pos-x', 'tabindex': 2,
                    'value': this.model.getPosX()
                })
            )
        )
    );
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, 'Y: '),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-pos-y', 'class': 'input-min', 'id': 'com-pos-y', 'tabindex': 3,
                    'value': this.model.getPosY()
                })
            )
        )
    );

    // rotation
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-rotation'}, app.translation["com-rotation"])
    );
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, 'XY: '),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-rotate', 'class': 'input-min', 'id': 'com-rotate', 'tabindex': 4,
                    'value': this.model.getRotation()
                })
            )
        )
    );

    // dimensions
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-dimensions'}, app.translation["com-dimensions"])
    );
};

/**
 * Adds listeners for added controls in component control panel
 * @param {app.SceneController} sceneController
 * @protected
 */
app.ComponentController.prototype.addPanelListeners = function (sceneController) {
    goog.events.listen(goog.dom.getElement('com-pos-x'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.ComponentController}
         * @param {goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatInput(e, this.model.updateTranslationX, this.model);
            sceneController.redrawAll();
        }, true, this);

    goog.events.listen(goog.dom.getElement('com-pos-y'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.ComponentController}
         * @param {goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatInput(e, this.model.updateTranslationY, this.model);
            sceneController.redrawAll();
        }, true, this);

    goog.events.listen(goog.dom.getElement('com-rotate'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.ComponentController}
         * @param {goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatInput(e, this.model.updateRotation, this.model);
            sceneController.redrawAll();
        }, true, this);
};

/**
 * Cleans this controller and removes currently selected component.
 * @public
 */
app.ComponentController.prototype.removeActiveComponent = function () {
    var modelID = this.modelID;
    this.model = null;
    this.modelID = -1;
    return modelID;
};

/**
 * Deselects currently active component
 * @public
 */
app.ComponentController.prototype.removeSelected = function () {
    this.model.setSelected(false);
};

/**
 * Helper to update component position
 * @param {!number} diffX
 * @param {!number} diffY
 * @public
 */
app.ComponentController.prototype.updatePosition = function (diffX, diffY) {
    this.model.applyTranslation(diffX, diffY);
};

/**
 * Returns copy of selected component model
 * @return {!app.model.Component}
 * @public
 */
app.ComponentController.prototype.getComponentModelCopy = function () {
    var copy = this.model.copy();
    copy.transformPoints();
    return copy;
};