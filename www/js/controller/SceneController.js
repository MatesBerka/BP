goog.provide('app.SceneController');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('app.ViewController');
goog.require('app.model.Table');
goog.require('app.model.View');

/**
 * @constructor
 */
app.SceneController = function(newSimulation) {
    if(newSimulation) {
        this.init();
    }
};

app.SceneController.prototype.init = function() {

    this.viewController = new app.ViewController();

    this.canvasWrapper = goog.dom.getElement('canvas-wrapper');

    this.tables = [];
    // TODO je potřeba?
    this.views = [];

    this.createDialogs();

    // create first table and view
    var viewID = 0;
    var tableID = 0;
    var newTable = new app.model.Table(tableID, 'Table 1');
    this.tables.push(newTable);
    this.activeTableID = 0;
    this.addTableToGUI(this.activeTableID, 'Table 1');

    var newView = new app.model.View(tableID, viewID, 'View 1', 0, 0);
    newTable.addView(newView);
    this.views.push(newView);
    this.addViewToGUI(viewID, 'View 1');

    this.addSceneListeners();

    var tableButton = goog.dom.getElement('button-table-' + tableID);
    this.setActiveTable(tableID, tableButton);
};

app.SceneController.prototype.showCross = function() {
    if(!goog.dom.classlist.contains(this.canvasWrapper, 'show-cross')) {
       goog.dom.classlist.add(this.canvasWrapper, 'show-cross');
    }
};

app.SceneController.prototype.hideCross = function() {
   goog.dom.classlist.remove(this.canvasWrapper, 'show-cross');
   console.log("hide");
};

app.SceneController.prototype.createDialogs = function() {
    this.newViewDialog = new goog.ui.Dialog();
    this.newViewDialog.setTitle(app.translation['new-view']);
    this.newViewDialog.setContent('View name: <input type="text" id="new-view-name" name="new-view-name">');
    this.newViewDialog.setButtonSet(goog.ui.Dialog.ButtonSet.OK_CANCEL);

    this.editViewDialog = new goog.ui.Dialog();
    this.editViewDialog.setTitle(app.translation['edit-view']);
    var viewButtonsSet = new goog.ui.Dialog.ButtonSet();
    viewButtonsSet.addButton({key: 'save', caption: 'Save'}, true);
    viewButtonsSet.addButton({key: 'remove', caption: 'Remove view'}, true);
    viewButtonsSet.addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, false, true);
    this.editViewDialog.setButtonSet(viewButtonsSet);

    this.newTableDialog = new goog.ui.Dialog();
    this.newTableDialog.setTitle(app.translation['new-table']);
    this.newTableDialog.setContent('Table name: <input type="text" id="new-table-name" name="new-table-name">');

    this.editTableDialog = new goog.ui.Dialog();
    this.editTableDialog.setTitle(app.translation['edit-table']);
    this.editTableDialog.setButtonSet(goog.ui.Dialog.ButtonSet.OK_CANCEL);
    var tableButtonsSet = new goog.ui.Dialog.ButtonSet();
    tableButtonsSet.addButton({key: 'save', caption: 'Save'}, true);
    tableButtonsSet.addButton({key: 'remove', caption: 'Remove table'}, true);
    tableButtonsSet.addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, false, true);
    this.editTableDialog.setButtonSet(tableButtonsSet);
};

app.SceneController.prototype.updateViewsDimensions = function() {
    // TODO vylepsit
    var height = Math.floor(100/this.tables[this.activeTableID].getViewsCount());
    var views = goog.dom.getElementsByClass('view-wrapper');

    for(var i = 0; i < views.length; i++) {
        views[i].style.height = height + "%";
    }
};

app.SceneController.prototype.setActiveTable = function(tableID, buttonElement) {
    try{
        // activate table button
        var curActiveButton = goog.dom.getElement('button-table-' + this.activeTableID);

        goog.dom.classlist.remove(curActiveButton, 'active-table');
        goog.dom.classlist.add(buttonElement, 'active-table');

        // show table views
        var curActiveTable = goog.dom.getElement('table-' + this.activeTableID),
            newActiveTable = goog.dom.getElement('table-' + tableID);

        goog.dom.classlist.remove(curActiveTable, 'active-table');
        goog.dom.classlist.add(newActiveTable, 'active-table');
        // show table views (buttons)
        var curActiveViews = goog.dom.getElement('table-' + this.activeTableID + '-views'),
            newActiveViews = goog.dom.getElement('table-' + tableID + '-views');

        goog.dom.classlist.remove(curActiveViews, 'active-table');
        goog.dom.classlist.add(newActiveViews, 'active-table');
    } catch(err) {
        console.log(err);
    }
    this.activeTableID = tableID;
};

app.SceneController.prototype.showView = function(viewID, buttonElement) {
    try{
        goog.dom.classlist.add(buttonElement, 'active-view');
        var view = goog.dom.getElement('view-' + viewID);
        goog.dom.classlist.add(view, 'active-view');
    } catch(err) {
        console.log(err);
    }
};

app.SceneController.prototype.hideView = function(viewID, buttonElement) {
    try{
        goog.dom.classlist.remove(buttonElement, 'active-view');
        var view = goog.dom.getElement('view-' + viewID);
        goog.dom.classlist.remove(view, 'active-view');
    } catch(err) {
        console.log(err);
    }
};

app.SceneController.prototype.addTableToGUI = function(tableID, tableName) {
    var table = goog.dom.createDom('div', {'id': 'table-' + tableID, 'class': 'table-wrapper'}),
        tables = goog.dom.getElement('tables'),
        views = goog.dom.getElement('views');

    goog.dom.append(tables, goog.dom.createDom('div', {'class': 'button-table', 'id': 'button-table-' + tableID}, tableName));
    goog.dom.append(views, goog.dom.createDom('div', {'id': 'table-' + tableID + '-views'}, ''));
    goog.dom.append(this.canvasWrapper, table);
};

app.SceneController.prototype.addViewToGUI = function(viewID, viewName) {
    var canvasName = 'canvas-' + this.activeTableID + '-' + viewID,
        viewWrapperName = 'view-' + this.activeTableID + '-' + viewID,
        buttonID = 'button-view-' + this.activeTableID + '-' + viewID;

    var tableElement =  goog.dom.getElement('table-' + this.activeTableID);
    var view = goog.dom.createDom('div', {'id': viewWrapperName, 'class': 'view-wrapper active-view'}),
        canvas = goog.dom.createDom('canvas', {'id': canvasName}),
        views = goog.dom.getElement('table-' + this.activeTableID + '-views'),
        coordinates = goog.dom.createDom('div', {'class': 'mouse-coordinates'}, 'x: 0 cm, y: 0 cm, zoom: 100%'),
        button = goog.dom.createDom('div', {'class': 'button-view', 'id': buttonID}, viewName);

    goog.dom.append(views, button);
    goog.dom.append(view, canvas);
    goog.dom.append(view, coordinates);
    goog.dom.append(tableElement, view);

    this.showView(this.activeTableID + '-' + viewID, button);
    this.viewController.addListeners(view);
    this.updateViewsDimensions();
};

app.SceneController.prototype.createTable = function() {
    var input = goog.dom.getElement('new-table-name');
    this.addTableToGUI(this.tables.length, input.value);
    this.tables.push(new app.model.Table(this.tables.length, input.value));
};

app.SceneController.prototype.removeTableFromGUI = function(elementID) {
    // TODO
    goog.dom.removeNode(goog.dom.getElement(elementID));
    var tableWrapperName = elementID.replace("button-", "");
    goog.dom.removeNode(goog.dom.getElement(tableWrapperName));

    // reindex
    var tablesButtons = goog.dom.getElementsByClass('button-table');
    for(var i = 0; i < tablesButtons.length; i++) {

        var buttonID = tablesButtons[i].id,
            viewID = buttonID.replace("button-table-", ""),
            newViewID = this.activeTableID + '-' + i;

        var viewWrapper = goog.dom.getElement('table-' + viewID);
        tablesButtons[i].id = 'button-table-' + newViewID;
        viewWrapper.id = 'table-' + newViewID;
    }
};

app.SceneController.prototype.removeTable = function() {
    var input = goog.dom.getElement('edit-table-name');
    this.removeTableFromGUI(input.name);
};

app.SceneController.prototype.renameTable = function() {
    var input = goog.dom.getElement('edit-table-name'),
        tableButton = goog.dom.getElement(input.name);

    tableButton.innerText = input.value;
};

app.SceneController.prototype.createView = function() {
    var viewID = this.tables[this.activeTableID].getNextViewID();
    var input = goog.dom.getElement('new-view-name');

    var newView = new app.model.View(this.activeTableID, viewID, input.value, 0, 0);
    this.views.push(newView);
    this.tables[this.activeTableID].addView(newView);

    this.addViewToGUI(viewID, input.value);
};

app.SceneController.prototype.removeViewFromGUI = function(elementID) {
    // TODO
    goog.dom.removeNode(goog.dom.getElement(elementID));
    var viewWrapperName = elementID.replace("button-", "");
    goog.dom.removeNode(goog.dom.getElement(viewWrapperName));

    // reindex
    var viewsButtons = goog.dom.getElementsByClass('button-view');
    for(var i = 0; i < viewsButtons.length; i++) {
        var buttonID = viewsButtons[i].id,
            viewID = buttonID.replace("button-view-", ""),
            newViewID = this.activeTableID + '-' + i;

        var viewWrapper = goog.dom.getElement('view-' + viewID),
            viewCanvas = goog.dom.getElement('canvas-' + viewID);

        viewsButtons[i].id = 'button-view-' + newViewID;
        viewWrapper.id = 'view-' + newViewID;
        viewCanvas.id = 'canvas-' + newViewID;
    }
};

app.SceneController.prototype.removeView = function() {
    var input = goog.dom.getElement('edit-view-name');
    var res = input.name.split('-');
    var viewID = res[3];

    this.tables[this.activeTableID].removeView(viewID);
    // remove
    this.removeViewFromGUI(input.name);
};

app.SceneController.prototype.renameView = function() {
    var input = goog.dom.getElement('edit-view-name'),
        viewButton = goog.dom.getElement(input.name);

    viewButton.innerText = input.value;
};


app.SceneController.prototype.addSceneListeners = function() {
    var newViewDialog = this.newViewDialog,
        newTableDialog = this.newTableDialog,
        editViewDialog = this.editViewDialog,
        editTableDialog = this.editTableDialog;
    var classThis = this;

    // add new table
    goog.events.listen(newTableDialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        if(e.key == 'ok') {
            classThis.createTable();
        }
    });
    goog.events.listen(goog.dom.getElement('add-new-table'), goog.events.EventType.CLICK, function(e) {
        newTableDialog.setVisible(true);
    });

    // edit table
    goog.events.listen(editTableDialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        if(e.key == 'save') {
            classThis.renameTable();
        } else if(e.key == 'remove') {
            classThis.removeTable();
        }
    });
    goog.events.listen(goog.dom.getElement('tables'), goog.events.EventType.DBLCLICK, function(e) {
        editTableDialog.setContent('Edit name: <input type="text" id="edit-table-name" name="'+ e.target.id +'" value="'+e.target.innerText+'">');
        editTableDialog.setVisible(true);
    });

    // add new view
    goog.events.listen(newViewDialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        if(e.key == 'ok') {
            classThis.createView();
        }
    });
    goog.events.listen(goog.dom.getElement('add-new-view'), goog.events.EventType.CLICK, function(e) {
        newViewDialog.setVisible(true);
    });

    // edit view
    goog.events.listen(editViewDialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        if(e.key == 'save') {
            classThis.renameView();
        } else if(e.key == 'remove') {
            classThis.removeView();
        }
    });
    goog.events.listen(goog.dom.getElement('views'), goog.events.EventType.DBLCLICK, function(e) {
        editViewDialog.setContent('Edit name: <input type="text" id="edit-view-name" name="'+ e.target.id +'" value="'+e.target.innerText+'">');
        editViewDialog.setVisible(true);
    });

    // set active table
    goog.events.listen(goog.dom.getElement('tables'), goog.events.EventType.CLICK, function(e) {
        var tableID = e.target.id.replace('button-table-', '');
        if(!goog.dom.classlist.contains(e.target, 'active-table')) {
            classThis.setActiveTable(tableID, e.target);
        }
    });

    // set active views
    goog.events.listen(goog.dom.getElement('views'), goog.events.EventType.CLICK, function(e) {
        var viewID = e.target.id.replace('button-view-', '');
        if(goog.dom.classlist.contains(e.target, 'active-view')) {
            classThis.hideView(viewID, e.target);
        } else {
            classThis.showView(viewID, e.target);
        }
    });
};


// todo
app.SceneController.prototype.loadComponentSettings = function(comp, tableID) {};

// todo
app.SceneController.prototype.updateAllViews = function(table) {};

app.SceneController.prototype.draw = function(x, y, random, canvas) {
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext('2d');

        // resize the canvas to fill browser window dynamically
        //window.addEventListener('resize', resizeCanvas, false);
        //function resizeCanvas() {
        //    console.log("resize");
        //    // todo
        //    //canvas.width = window.innerWidth;
        //    //canvas.height = window.innerHeight;
        //}
        //resizeCanvas();

        if (ctx) {
            ctx.clearRect(0, 0, 819, 400);

            if(random) {
                function getRandomColor() {
                    var letters = '0123456789ABCDEF'.split('');
                    var color = '#';
                    for (var i = 0; i < 6; i++ ) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                }
                ctx.strokeStyle=getRandomColor();
            }

            var obstacle = new Path2D();
            ctx.lineWidth = 4;
            obstacle.moveTo(600, 350);
            obstacle.lineTo(700, 300);
            ctx.stroke(obstacle);

            obstacle.moveTo(70, 70);
            obstacle.lineTo(70, 300);
            ctx.stroke(obstacle);

            ctx.lineWidth = 1;

            //for(var angle = 0; angle < 360; angle += 30) {
            //    ctx.moveTo(405, 200);
            //    x = Math.sin(angle * (Math.PI/180)) * 100;
            //    y = Math.cos(angle * (Math.PI/180)) * 100;
            //    ctx.lineTo(x + 405, y + 200);
            //}

            var bounceLimit = 2;
            var raysCount = 1000;

            var segments = [
                [0, 0, 819, 0],
                [819, 0, 819, 400],
                [819, 400, 0, 400],
                [0, 400, 0, 0],
                [600, 350, 700, 300],
                [70, 70, 70, 300]
            ];

            //    dx = s.x1 - s.x0
            //    dy = s.y1 - s.y0
            //    Calculate normal
            //    len = Math.sqrt(dx*dx + dy*dy)
            //    s.xn = -dy / len
            //    s.yn = dx / len

            var raysPositions = [];
            var n = 0, m = 0, s1x, s1y, sDx, sDy, closestDist, rayDisX, rayDisY, raySlope,
                radians, rayStart, rayOrgX, rayOrgY, rayDirX = 0, rayDirY = 0, segment, closestSegment;

            for(var i = 0; i < raysCount; i++) {
                radians = Math.random() * 6.283185307179586;
                rayDirX = Math.sin(radians);
                rayDirY = Math.cos(radians);
                raysPositions.push([x, y, rayDirX, rayDirY]);
            }

            var limit = (bounceLimit * raysCount) + raysCount;
            for(var count = 0; count < limit; count++) {
                closestSegment = null;
                // get ray
                rayStart = raysPositions.shift();
                rayOrgX = rayStart[0];
                rayOrgY = rayStart[1];
                rayDirX = rayStart[2];
                rayDirY = rayStart[3];
                ctx.moveTo(rayOrgX, rayOrgY);

                closestDist = Number.MAX_VALUE;  rayDisX = 0; rayDisY = 0;
                raySlope = ((rayDirX == 0) ? Number.MAX_VALUE : (rayDirY / rayDirX));

                for(segment = 0; segment < segments.length; segment++) {
                    s1x = segments[segment][0];
                    s1y = segments[segment][1];
                    sDx = segments[segment][2] - s1x;
                    sDy = segments[segment][3] - s1y;

                    n = ((s1x - rayOrgX)*raySlope + (rayOrgY - s1y)) / (sDy - sDx*raySlope);
                    if (n < 0 || n > 1)
                        continue;

                    m = ((rayDirX == 0) ? (Number.MAX_VALUE - 1) : ((s1x + sDx * n - rayOrgX) / rayDirX));
                    if (m < 0)
                        continue;

                    //# It's an intersection! Store it, and keep track of the closest one.
                    if (m < closestDist) {
                        closestDist = m;
                        closestSegment = segments[segment];
                        //# Locate the intersection point
                        rayDisX = rayOrgX + (closestDist -1) * rayDirX;
                        rayDisY = rayOrgY + (closestDist - 1) * rayDirY;
                    }
                } // inner loop

                if(closestSegment != null) {

                    var dx = closestSegment[0] - closestSegment[2];
                    var dy = closestSegment[1] - closestSegment[3];
                    var len = Math.sqrt(dx*dx + dy*dy);
                    var xn = -dy / len;
                    var yn = dx / len;

                    var d = 2 * (xn * rayDirX + yn * rayDirY);
                    rayDirX -= d * xn;
                    rayDirY -= d * yn;
                    raysPositions.push([rayDisX, rayDisY, rayDirX, rayDirY]);
                    ctx.lineTo(rayDisX, rayDisY);
                    //ctx.stroke();
                    //console.log(rayDisX, rayDisY);
                    //rayDisX = rayDisX + 100 * rayDirX;
                    //rayDisY = rayDisY + 100 * rayDirY;
                    //
                    //ctx.lineTo(rayDisX, rayDisY);
                }
                //Avoid floating-point coordinates and use integers instead
                //ctx.stroke();
            } // outer loop
            ctx.stroke();

            // and sun
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI);
            ctx.fill();
        }


    }
};
