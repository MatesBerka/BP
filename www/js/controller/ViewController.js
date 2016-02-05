goog.provide('app.ViewController');

goog.require('app.model.HolographicPlate');
goog.require('app.model.Lens');
goog.require('app.model.Light');
goog.require('app.model.Mirror');
goog.require('app.model.Splitter');
goog.require('app.model.Wall');

app.ViewController = function() {
    this.reflectionsCount = 4;

    this.isAddNewComponent = false;

    this.newComponentType = null;

    this.componentMoveAction = false;

    this.canvasMoveActive = false;
};

app.ViewController.prototype.addListeners = function(view) {
    var classThis = this;

    // coordinates update
    goog.events.listen(view, goog.events.EventType.MOUSEMOVE, classThis.updateCoordinates);

    // components movement
    goog.events.listen(view, goog.events.EventType.MOUSEDOWN, function(e) {
        // muze byt posun platna
        // vyber komponenty
        // pridani nove
        if(classThis.isAddNewComponent) {
            var pieces = view.id.split('-');
            classThis.addComponent(parseInt(pieces[1]), parseInt(pieces[2]));
        } else if(classThis.isIntersection(e)) {
            app.ViewController.componentMoveActive = true;
        } else {
            app.ViewController.canvasMoveActive = true;
        }
        goog.events.listen(view, goog.events.EventType.MOUSEMOVE, classThis.viewMouseMove);
    });



    goog.events.listen(view, goog.events.EventType.MOUSEUP, function(e) {
        app.ViewController.isAddNewComponent = false;
        app.ViewController.componentMoveActive = false;
        app.ViewController.canvasMoveActive = false;
        goog.events.unlisten(view, goog.events.EventType.MOUSEMOVE, classThis.viewMouseMove);
        app.sceneController.hideCross();
    });
};

app.ViewController.prototype.addComponent = function(tableID, viewID, coordX, coordY) {
    var view = app.sceneController.getView(tableID, view);
    switch(this.newComponentType) {
        case 'MIRROR':
            view.addComponent(new app.Mirror(coordX, coordY));
            break;
        case 'LENS':
            view.addComponent(new app.Lens(coordX, coordY));
            break;
        case 'HOLO-PLATE':
            view.addComponent(new app.HoloPlate(coordX, coordY));
            break;
        case 'WALL':
            view.addComponent(new app.Wall(coordX, coordY));
            break;
        case 'LIGHT':
            view.addComponent(new app.Light(coordX, coordY));
            break;
    }
};

app.ViewController.prototype.setAddNewComponent = function(value) {
    this.isAddNewComponent = value;
};

app.ViewController.prototype.setComponentType = function(type) {
    this.newComponentType = type;
};

app.ViewController.prototype.removeListeners = function(view) {
    // todo funguje to ikdyz jsem vynechal eventListener na konci? (track)
    goog.events.unlisten(view, goog.events.EventType.MOUSEMOVE, this.updateCoordinates);
};

app.ViewController.prototype.updateCoordinates = function(e) {
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