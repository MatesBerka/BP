goog.provide('app.HolographicPlate');

goog.require('app.Component');
/**
 * @constructor
 * @extends {app.Parent}
 */
app.HolographicPlate = function(coordX, coordY) {
    app.HolographicPlate.base(this, 'constructor', coordX, coordY); // call parent constructor
};

goog.inherits(app.HolographicPlate, app.Component);
