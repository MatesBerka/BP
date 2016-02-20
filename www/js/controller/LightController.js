goog.provide('app.LightController');

goog.require('app.ComponentController');

/**
 * @constructor
 * @extends {app.ComponentController}
 */
app.LightController = function() {
    app.LightController.base(this, 'constructor');

    this._selectedComponentType = 'LIGHT';
};

goog.inherits(app.LightController, app.ComponentController);

app.LightController.prototype.showComponentControlPanel = function(sceneController) {
    goog.dom.classlist.add(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
    // todo prepsat do lepsi podoby

    var select;

    if(this._model.getLightType() == 'BEAM') {
        select = '<select id="com-light-type"><option selected value="BEAM">Beam</option><option value="CIRCLE">Circle</option></select>';
    } else {
        select = '<select id="com-light-type"><option value="BEAM">Beam</option><option selected value="CIRCLE">Circle</option></select>';
    }

    var html = '<label id="com-position">' + app.translation["com-position"] + '</label>' +
        '<div class="input-field"><span class="com-left-side">X: </span><span class="com-right-side">' +
        '<input type="text" name="com-pos-x" class="input-min" id="com-pos-x" value="'+ this._model.getPosX() + '"> cm</span></div>' +

        '<div class="input-field"><span class="com-left-side">Y: </span><span class="com-right-side">' +
        '<input type="text" name="com-pos-y" class="input-min" id="com-pos-y"  value="' + this._model.getPosY() + '"> cm</span></div>' +

        '<label id="com-rotation">' + app.translation["com-rotation"] + '</label>' +
        '<div class="input-field"><span class="com-left-side">XY: </span><span class="com-right-side">' +
        '<input type="text" name="com-rotate" class="input-min" id="com-rotate" value="'+ this._model.getRotation() + '">°</span></div>' +

        '<label id="com-dimensions">' + app.translation["com-dimensions"] + '</label>' +
        '<div class="input-field"><span class="com-left-side">A: </span><span class="com-right-side">' +
        '<input type="text" name="com-size" class="input-min" id="com-size" value="' + this._model.getSize() + '"> cm</span></div>' +

        '<label id="com-dimensions">' + app.translation["com-light"] + '</label>' +
        '<div class="input-field"><span class="com-left-side">Light type: </span><span class="com-right-side">' + select + '</span></div>' +

        '<div class="input-field"><span class="com-left-side">Rays count: </span><span class="com-right-side">' +
        '<input type="text" name="com-rays-count" class="input-min" id="com-rays-count" value="' + this._model.getRaysCount() + '"></span></div>' +

        '<div class="input-field"><span class="com-left-side">Radius: </span><span class="com-right-side">' +
        '<input type="text" name="com-radius" class="input-min" id="com-radius" value="' + this._model.getRadius() + '">°</span></div>';

    this._componentConfigurationPanel.innerHTML = html;

    this._addPanelListeners(sceneController);
};

app.LightController.prototype.hideComponentControlPanel = function() {
    this._componentConfigurationPanel.style.display = "none";
    goog.dom.classlist.remove(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
};

app.LightController.prototype._addPanelListeners = function(sceneController) {

    goog.events.listen(goog.dom.getElement('com-pos-x'), goog.events.EventType.KEYUP, function (e) {
        this._model.updateTranslationX(e.target.value);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-pos-y'), goog.events.EventType.KEYUP, function (e) {
        this._model.updateTranslationY(e.target.value);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-rotate'), goog.events.EventType.KEYUP, function (e) {
        var degree = e.target.value % 360;
        this._model.updateRotation(degree);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-size'), goog.events.EventType.KEYUP, function (e) {
        this._model.setSize(e.target.value);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-rays-count'), goog.events.EventType.KEYUP, function (e) {
        this._model.setRaysCount(e.target.value);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-radius'), goog.events.EventType.KEYUP, function (e) {
        this._model.setRadius(e.target.value);
        sceneController.redrawAll();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-light-type'), goog.events.EventType.CHANGE, function (e) {
        this._model.setLightType(e.target.value);
        sceneController.redrawAll();
    }, true, this);
};