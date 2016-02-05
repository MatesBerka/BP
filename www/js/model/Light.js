goog.provide('app.Light');

goog.require('app.Component');
/**
 * @constructor
 * @extends {app.Parent}
 */
app.Light = function(coordX, coordY) {
    app.Light.base(this, 'constructor', coordX, coordY); // call parent constructor
};

goog.inherits(app.Light, app.Component);

