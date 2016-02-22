goog.provide('app.ComponentController');

goog.require('goog.dom');
/**
 * @constructor
 */
app.ComponentController = function () {

    this._model = null;

    this._modelID = -1;

    this._componentConfigurationPanel = goog.dom.getElement('component-configuration');

    this._pixelsOnCm = goog.dom.getElement('cm-box').clientWidth;
};

app.ComponentController.prototype.showComponentControlPanel = function (sceneController) {
    goog.dom.removeChildren(this._componentConfigurationPanel);
    goog.dom.classlist.add(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');

    //input x,y position
    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-position'}, app.translation["com-position"])
    );
    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, 'X: '),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {'type': 'text', 'name': 'com-pos-x', 'class': 'input-min', 'id': 'com-pos-x',
                 'value': this._model.getPosX()})
            )
        )
    );
    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, 'Y: '),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {'type': 'text', 'name': 'com-pos-y', 'class': 'input-min', 'id': 'com-pos-y',
                    'value': this._model.getPosY()})
            )
        )
    );

    // rotation
    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-rotation'}, app.translation["com-rotation"])
    );
    goog.dom.appendChild(this._componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'},'XY: '),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {'type': 'text', 'name': 'com-rotate', 'class': 'input-min', 'id': 'com-rotate',
                    'value': this._model.getRotation()})
            )
        )
    );

};

app.ComponentController.prototype.hideComponentControlPanel = function () {
    this._componentConfigurationPanel.style.display = "none";
    goog.dom.classlist.remove(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
};

app.ComponentController.prototype._addPanelListeners = function (sceneController) {
    goog.events.listen(goog.dom.getElement('com-pos-x'), goog.events.EventType.KEYUP, function (e) {
        if(e.target.value !== '') {
            this._model.updateTranslationX(parseFloat(e.target.value));
        } else {
            this._model.updateTranslationX(0);
        }
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-pos-y'), goog.events.EventType.KEYUP, function (e) {
        if(e.target.value !== '') {
            this._model.updateTranslationY(parseFloat(e.target.value));
        } else {
            this._model.updateTranslationY(0);
        }
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-rotate'), goog.events.EventType.KEYUP, function (e) {
        if(e.target.value !== '') {
            var degree = e.target.value % 360;
            this._model.updateRotation(parseFloat(degree));
        } else {
            this._model.updateRotation(0);
        }
        sceneController.redrawAll();
    }, true, this);
};

app.ComponentController.prototype.setSelectedComponentModel = function (model, modelID) {
    this._model = model;
    this._modelID = modelID;
};

app.ComponentController.prototype.removeActiveComponent = function () {
    this._model = null;
    this._modelID = -1;
};

app.ComponentController.prototype.removeSelected = function () {
    this._model.setSelected(false);
};

app.ComponentController.prototype.updatePosition = function (diffX, diffY) {
    this._model.applyTranslation(diffX, diffY);
};

app.ComponentController.prototype.getComponentModelCopy = function () {
    return this._model.copy();
};