goog.provide('app.ComponentController');

goog.require('goog.dom');

/**
 * @constructor
 */
app.ComponentController = function () {
    /**
     * Points to currently selected component model
     * @type {app.model.Component}
     * @protected
     */
    this.model = null;
    /**
     * currently selected component model ID
     * @type {!number}
     * @protected
     */
    this.modelID = -1;
    /**
     * Element which contains component control panel
     * @type {Element}
     * @protected
     */
    this.componentConfigurationPanel = goog.dom.getElement('component-configuration');
};

/**
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
 * @param {app.SceneController} sceneController
 * @public
 */
app.ComponentController.prototype.showComponentControlPanel = function (sceneController) {
    goog.dom.removeChildren(this.componentConfigurationPanel);
    goog.dom.classlist.add(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');

    // component type
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'id': 'com-type'}, app.translation["com-type"], this._getComponentType())
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
 * @public
 */
app.ComponentController.prototype.hideComponentControlPanel = function () {
    this.componentConfigurationPanel.style.display = "none";
    goog.dom.classlist.remove(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
};

/**
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
 * @public
 */
app.ComponentController.prototype.removeActiveComponent = function () {
    var modelID = this.modelID;
    this.model = null;
    this.modelID = -1;
    return modelID;
};

/**
 * @public
 */
app.ComponentController.prototype.removeSelected = function () {
    this.model.setSelected(false);
};

/**
 * @param {!number} diffX
 * @param {!number} diffY
 * @public
 */
app.ComponentController.prototype.updatePosition = function (diffX, diffY) {
    this.model.applyTranslation(diffX, diffY);
};

/**
 * @public
 */
app.ComponentController.prototype.getComponentModelCopy = function () {
    return this.model.copy();
};