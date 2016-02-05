goog.provide('app.Component');
/**
 * @constructor
 * @extends {app.Parent}
 */
app.Component = function(coordX, coordY) {
    app.Lens.base(this, 'constructor', coordX, coordY); // call parent constructor
};

goog.inherits(app.Lens, app.Component);
