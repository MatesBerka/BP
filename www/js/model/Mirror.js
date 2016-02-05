goog.provide('app.Mirror');

goog.require('app.Component');
/**
 * @constructor
 * @extends {app.Parent}
 */
app.Mirror = function(coordX, coordY) {
    app.Mirror.base(this, 'constructor', coordX, coordY); // call parent constructor
};

goog.inherits(app.Mirror, app.Component);

