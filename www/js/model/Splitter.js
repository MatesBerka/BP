goog.provide('app.Splitter');

goog.require('app.Component');
/**
 * @constructor
 * @extends {app.Parent}
 */
app.Splitter = function(coordX, coordY) {
    app.Splitter.base(this, 'constructor', coordX, coordY); // call parent constructor
};

goog.inherits(app.Splitter, app.Component);

