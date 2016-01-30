goog.provide('app.ViewController');

app.ViewController = function() {
};

app.ViewController.prototype.isAddNewComponent = false;

app.ViewController.prototype.newComponentType = null;

app.ViewController.prototype.componentMoveActive = false;

app.ViewController.prototype.canvasMoveActive = false;

app.ViewController.prototype.addListeners = function(view) {
    var thisScope = this;

    // coordinates update
    goog.events.listen(view, goog.events.EventType.MOUSEMOVE, thisScope.updateCoordinates);

    // components movement
    goog.events.listen(view, goog.events.EventType.MOUSEDOWN, function(e) {
        // muze byt posun platna
        // vyber komponenty
        // pridani nove
        if(app.ViewController.isAddNewComponent) {
            console.log(app.ViewController.newComponentType);
                var pieces = view.id.split('-');
                var tableIndex = parseInt(pieces[1]);
                // get table
                // create comp
                // add comp
                // update views
        } else if(thisScope.isIntersection(e)) {
            app.ViewController.componentMoveActive = true;
        } else {
            app.ViewController.canvasMoveActive = true;
        }

        goog.events.listen(view, goog.events.EventType.MOUSEMOVE, thisScope.viewMouseMove);
    });
    goog.events.listen(view, goog.events.EventType.MOUSEUP, function(e) {
        app.ViewController.isAddNewComponent = false;
        app.ViewController.componentMoveActive = false;
        app.ViewController.canvasMoveActive = false;
        goog.events.unlisten(view, goog.events.EventType.MOUSEMOVE, thisScope.viewMouseMove);
    });
};

app.ViewController.prototype.removeListeners = function(view) {
    // todo funguje to ikdyz jsem vynechal eventListener na konci? (track)
    goog.events.unlisten(view, goog.events.EventType.MOUSEMOVE, this.updateCoordinates);
};

app.ViewController.prototype.updateCoordinates = function(e, view) {
    var coordinates = e.currentTarget.childNodes[1];
    // todo lepsi prevod cm
    var xCm = e.offsetX / 37.795276;
    var yCm = e.offsetY / 37.795276;
    goog.dom.setTextContent(coordinates, 'x: ' + xCm.toFixed(2) + ' cm, y: ' + yCm.toFixed(2) + ' cm, zoom: 100%');
};

app.ViewController.prototype.viewMouseMove = function(e) {

};

app.ViewController.prototype.isIntersection = function(event) {
    return false;
};

// CONSTRUCTOR
//public Position transformPoint(Position center, Position position, Matrix matrix) {
//    double x, y, z;
//    double tempX, tempY, tempZ;
//
//    x = position.getX() - center.getX();
//    y = position.getY() - center.getY();
//    z = position.getZ() - center.getZ();
//
//    Matrix point = new Matrix(new double[][]{{x}, {y}, {z}});
//
//    point = matrix.times(point);
//
//    if (center.getX() == 0 && center.getY() == 0 && center.getZ() == 0) {
//        tempX = scale * (point.data[0][0] + center.getX());
//        tempY = scale * (point.data[1][0] + center.getY());
//        tempZ = scale * (point.data[2][0] + center.getZ());
//    } else {
//        tempX = point.data[0][0] + center.getX();
//        tempY = point.data[1][0] + center.getY();
//        tempZ = point.data[2][0] + center.getZ();
//    }
//    return new Position(tempX, tempY, tempZ);
//}
//
//protected Position reverseTransformPoint(Position center, Position position, Matrix matrix) {
//    double x, y, z;
//    double tempX, tempY, tempZ;
//
//    x = position.getX() - center.getX();
//    y = position.getY() - center.getY();
//    z = position.getZ() - center.getZ();
//
//    Matrix point = new Matrix(new double[][]{{x}, {y}, {z}});
//    point = Matrix.transpose(matrix).times(point);
//
//    if (center.getX() == 0 && center.getY() == 0 && center.getZ() == 0) {
//        tempX = scale * (point.data[0][0] + center.getX());
//        tempY = scale * (point.data[1][0] + center.getY());
//        tempZ = scale * (point.data[2][0] + center.getZ());
//    } else {
//        tempX = point.data[0][0] + center.getX();
//        tempY = point.data[1][0] + center.getY();
//        tempZ = point.data[2][0] + center.getZ();
//    }
//    return new Position(tempX, tempY, tempZ);
//}