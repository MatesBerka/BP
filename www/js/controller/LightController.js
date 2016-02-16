goog.provide('app.LightController');

goog.require('app.ComponentController');

app.LightController = function(model) {
    app.LightController.base(this, 'constructor', model);

    this._selectedComponentType = 'LIGHT';
};

goog.inherits(app.LightController, app.ComponentController);

app.LightController.prototype.showComponentControlPanel = function(viewController) {
    goog.dom.classlist.add(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
    // todo prepsat do lepsi podoby

    var select;

    if(this._model.getLightType() == 'BEAM') {
        select = '<select id="com-light-type"><option selected value="BEAM">Beam</option><option value="CIRCLE">Circle</option></select>';
    } else {
        select = '<select id="com-light-type"><option value="BEAM">Beam</option><option selected value="CIRCLE">Circle</option></select>';
    }

    var html = '<label id="com-position">' + app.translation["com-position"] + '</label>' +
        '<div class="input-field">X: <input type="text" name="com-pos-x" class="input-min" id="com-pos-x" value="'+
         this._model.getPosX() + '"> cm</div>' +
        '<div class="input-field">Y: <input type="text" name="com-pos-y" class="input-min" id="com-pos-y"  value="'+
         this._model.getPosY() + '"> cm</div>' +

        '<label id="com-rotation">' + app.translation["com-rotation"] + '</label>' +
        '<div class="input-field">XY: <input type="text" name="com-rotate" class="input-min" id="com-rotate" value="'+
        this._model.getRotation() + '">°</div>' +

        '<label id="com-dimensions">' + app.translation["com-dimensions"] + '</label>' +
        '<div class="input-field">A: <input type="text" name="com-size" class="input-min" id="com-size" value="'+
        this._model.getSize() + '"> cm</div>' +

        '<label id="com-dimensions">' + app.translation["com-light"] + '</label>' + select +
        '<div class="input-field">Rays count: <input type="text" name="com-rays-count" class="input-min" id="com-rays-count" value="'+
        this._model.getRaysCount() + '"></div>' +
        '<div class="input-field">Radius: <input type="text" name="com-radius" class="input-min" id="com-radius" value="'+
            this._model.getRadius() + '">°</div>';

    this._componentConfigurationPanel.innerHTML = html;

    this._addPanelListeners(viewController);
};

app.LightController.prototype.hideComponentControlPanel = function() {
    this._componentConfigurationPanel.style.display = "none";
    goog.dom.classlist.remove(goog.dom.getElement('canvas-wrapper'), 'active-component-panel');
};

app.LightController.prototype._addPanelListeners = function(viewController) {
    goog.events.listen(goog.dom.getElement('com-pos-x'), goog.events.EventType.KEYUP, function (e) {
        this._model.updateTranslationX(e.target.value);
        viewController.draw();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-pos-y'), goog.events.EventType.KEYUP, function (e) {
        this._model.updateTranslationY(e.target.value);
        viewController.draw();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-rotate'), goog.events.EventType.KEYUP, function (e) {
        var degree = e.target.value % 360;
        this._model.updateRotation(degree);
        viewController.draw();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-size'), goog.events.EventType.KEYUP, function (e) {
        this._model.setSize(e.target.value);
        viewController.draw();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-rays-count'), goog.events.EventType.KEYUP, function (e) {
        this._model.setRaysCount(e.target.value);
        viewController.draw();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-radius'), goog.events.EventType.KEYUP, function (e) {
        this._model.setRadius(e.target.value);
        viewController.draw();
    }, true, this);

    goog.events.listen(goog.dom.getElement('com-light-type'), goog.events.EventType.CHANGE, function (e) {
        this._model.setLightType(e.target.value);
        viewController.draw();
    }, true, this);
};