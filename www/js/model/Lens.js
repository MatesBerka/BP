goog.provide('app.Lens');

goog.require('app.Component');
/**
 * @constructor
 * @extends {app.Parent}
 */
app.Lens = function(coordX, coordY) {
    app.Lens.base(this, 'constructor', coordX, coordY); // call parent constructor
};

goog.inherits(app.Lens, app.Component);

