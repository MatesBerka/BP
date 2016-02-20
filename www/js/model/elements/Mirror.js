goog.provide('app.model.Mirror');

goog.require('app.model.Component');
/**
 * @constructor
 * @extends {app.model.Component}
 */
app.model.Mirror = function(coordX, coordY) {
    app.model.Mirror.base(this, 'constructor', coordX, coordY); // call parent constructor

    this._type = 'MIRROR';
};

goog.inherits(app.model.Mirror, app.model.Component);

