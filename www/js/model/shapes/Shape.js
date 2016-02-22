goog.provide('app.shapes.Shape');

/**
 * @constructor
 */
app.shapes.Shape = function() {};

app.shapes.Shape.prototype._generateShapePoints = goog.abstractMethod;

app.shapes.Shape.prototype.isIntersection = goog.abstractMethod;

app.shapes.Shape.prototype.draw = goog.abstractMethod;

app.shapes.Shape.prototype.isSelected = goog.abstractMethod;