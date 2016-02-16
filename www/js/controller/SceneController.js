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

    this._viewController = new app.ViewController();

    this._canvasWrapper = goog.dom.getElement('canvas-wrapper');

    this._tables = [];

    this.createDialogs();

    // create first table and view
    var viewID = 0;
    var tableID = 0;
    var newTable = new app.model.Table(tableID, 'Table 1');
    this._tables.push(newTable);
    this._activeTableID = 0;
    this.addTableToGUI(this._activeTableID, 'Table 1');

    var newView = new app.model.View(tableID, viewID, 'View 1', 0, 0);
    newTable.addView(newView);
    newView.setCanvas(this.addViewToGUI(viewID, 'View 1'));

    this.addSceneListeners();

    var tableButton = goog.dom.getElement('button-table-' + tableID);
    this.setActiveTable(tableID, tableButton);
};

app.SceneController.prototype.showCross = function(type) {
    if(!goog.dom.classlist.contains(this._canvasWrapper, 'show-cross')) {
       goog.dom.classlist.add(this._canvasWrapper, 'show-cross');
       this._viewController.setAddNewComponent(type);
    }
};

app.SceneController.prototype.hideCross = function() {
   goog.dom.classlist.remove(this._canvasWrapper, 'show-cross');
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
    var tableButtonsSet = new goog.ui.Dialog.ButtonSet();
        tableButtonsSet.addButton({key: 'save', caption: 'Save'}, true);
        tableButtonsSet.addButton({key: 'remove', caption: 'Remove table'}, true);
        tableButtonsSet.addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, false, true);
    this.editTableDialog.setButtonSet(tableButtonsSet);
};

app.SceneController.prototype.updateSizes = function() {
    var height = Math.max(document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.offsetHeight),
        width = this._canvasWrapper.clientWidth,
        views = goog.dom.getElementsByClass('view-wrapper');

    height = height - 184;
    this._canvasWrapper.style.height = height + 'px';

    //height = height/this._tables[this._activeTableID].getViewsCount();
    height = height/this._tables[this._activeTableID].getActiveViewsCount();
    for(var i = 0; i < views.length; i++) {
        this._tables[this._activeTableID].updateViewSize(i, width, height);

        views[i].style.height = height + "px";
        views[i].style.width = width + "px";

        views[i].firstChild.height = height;
        views[i].firstChild.width = width;
    }
};

app.SceneController.prototype.setActiveTable = function(tableID, buttonElement) {
    try{
        // activate table button
        var curActiveButton = goog.dom.getElement('button-table-' + this._activeTableID);

        goog.dom.classlist.remove(curActiveButton, 'active-table');
        goog.dom.classlist.add(buttonElement, 'active-table');

        // show table views
        var curActiveTable = goog.dom.getElement('table-' + this._activeTableID),
            newActiveTable = goog.dom.getElement('table-' + tableID);

        goog.dom.classlist.remove(curActiveTable, 'active-table');
        goog.dom.classlist.add(newActiveTable, 'active-table');

        // show table views (buttons)
        var curActiveViews = goog.dom.getElement('table-' + this._activeTableID + '-views'),
            newActiveViews = goog.dom.getElement('table-' + tableID + '-views');

        goog.dom.classlist.remove(curActiveViews, 'active-table');
        goog.dom.classlist.add(newActiveViews, 'active-table');
    } catch(err) {
        console.log(err);
    }
    this._activeTableID = tableID;
};

app.SceneController.prototype.setSelectedView = function(tableID, viewID) {
    this._viewController.setViewModel(this._tables[tableID].getView(viewID));
};

app.SceneController.prototype.showView = function(viewID, buttonElement) {
    try{
        this._tables[this._activeTableID].increaseActiveViewsCount();
        goog.dom.classlist.add(buttonElement, 'active-view');
        var view = goog.dom.getElement('view-' + viewID);
        goog.dom.classlist.add(view, 'active-view');
        this.updateSizes();
    } catch(err) {
        console.log(err);
    }
};

app.SceneController.prototype.hideView = function(viewID, buttonElement) {
    try{
        this._tables[this._activeTableID].decreaseActiveViewsCount();
        goog.dom.classlist.remove(buttonElement, 'active-view');
        var view = goog.dom.getElement('view-' + viewID);
        goog.dom.classlist.remove(view, 'active-view');
        this.updateSizes();
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
    goog.dom.append(this._canvasWrapper, table);
};

app.SceneController.prototype.addViewToGUI = function(viewID, viewName) {
    var canvasName = 'canvas-' + this._activeTableID + '-' + viewID,
        viewWrapperName = 'view-' + this._activeTableID + '-' + viewID,
        buttonID = 'button-view-' + this._activeTableID + '-' + viewID;

    var tableElement =  goog.dom.getElement('table-' + this._activeTableID);
    var view = goog.dom.createDom('div', {'id': viewWrapperName, 'class': 'view-wrapper active-view'}),
        canvas = goog.dom.createDom('canvas', {'id': canvasName}),
        views = goog.dom.getElement('table-' + this._activeTableID + '-views'),
        coordinates = goog.dom.createDom('div', {'class': 'mouse-coordinates'}, 'x: 0 cm, y: 0 cm, zoom: 100%'),
        zoomIn = goog.dom.createDom('div', {'class': 'zoom-in'}, '+'),
        zoomOut = goog.dom.createDom('div', {'class': 'zoom-out'}, '-'),
        zoom = goog.dom.createDom('div', {'class': 'zoom'}, zoomIn, zoomOut),
        moveTop = goog.dom.createDom('div', {'class': 'wide-top-move-control'}, goog.dom.htmlToDocumentFragment('&#8673;')),
        moveRight = goog.dom.createDom('div', {'class': 'right-side-move-control'}, goog.dom.htmlToDocumentFragment('&#8674;')),
        moveLeft = goog.dom.createDom('div', {'class': 'left-side-move-control'}, goog.dom.htmlToDocumentFragment('&#8672;')),
        moveBottom = goog.dom.createDom('div', {'class': 'wide-bottom-move-control'}, goog.dom.htmlToDocumentFragment('&#8675;')),
        move = goog.dom.createDom('div', {'class': 'move-control'}, moveTop, moveRight, moveLeft, moveBottom);
        button = goog.dom.createDom('div', {'class': 'button-view', 'id': buttonID}, viewName);

    goog.dom.append(views, button);
    goog.dom.append(view, canvas);
    goog.dom.append(view, coordinates);
    goog.dom.append(view, zoom);
    goog.dom.append(view, move);
    goog.dom.append(tableElement, view);

    this.showView(this._activeTableID + '-' + viewID, button);
    this._viewController.addListeners(view);
    this.updateSizes();

    goog.events.listen(view, goog.events.EventType.MOUSEENTER, function(e) {
        var pieces = e.target.id.split('-');
        if(pieces[0] == 'view') {
            this.setSelectedView(parseInt(pieces[1]), parseInt(pieces[2]));
        }
    }, true, this);

    return canvas;
};

app.SceneController.prototype.createTable = function() {
    var input = goog.dom.getElement('new-table-name');
    this.addTableToGUI(this._tables.length, input.value);
    this._tables.push(new app.model.Table(this._tables.length, input.value));
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
            newViewID = this._activeTableID + '-' + i;

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
    var viewID = this._tables[this._activeTableID].getNextViewID();
    var input = goog.dom.getElement('new-view-name');

    var newView = new app.model.View(this._activeTableID, viewID, input.value, 0, 0);
    this._tables[this._activeTableID].addView(newView);

    newView.setCanvas(this.addViewToGUI(viewID, input.value));
    this._redrawAll();
};

app.SceneController.prototype.removeViewFromGUI = function(elementID) {
    // TODO
    var view = goog.dom.getElement(elementID);
    goog.events.unlisten(view, goog.events.EventType.MOUSEENTER, this.updateSelectedView, true, this);

    goog.dom.removeNode(view);
    var viewWrapperName = elementID.replace("button-", "");
    goog.dom.removeNode(goog.dom.getElement(viewWrapperName));

    // reindex
    var viewsButtons = goog.dom.getElementsByClass('button-view');
    for(var i = 0; i < viewsButtons.length; i++) {
        var buttonID = viewsButtons[i].id,
            viewID = buttonID.replace("button-view-", ""),
            newViewID = this._activeTableID + '-' + i;

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

    this._tables[this._activeTableID].removeView(viewID);
    // remove
    this.removeViewFromGUI(input.name);
};

app.SceneController.prototype.renameView = function() {
    var input = goog.dom.getElement('edit-view-name'),
        viewButton = goog.dom.getElement(input.name);

    viewButton.innerText = input.value;
};

app.SceneController.prototype.updateSelectedView = function(e) {
    var pieces = e.target.id.split('-');
    if(pieces[0] === 'view' || pieces[0] === 'canvas') {
        this.setSelectedView(parseInt(pieces[1]), parseInt(pieces[2]));
    }
};

app.SceneController.prototype.addSceneListeners = function() {
    var newViewDialog = this.newViewDialog,
        newTableDialog = this.newTableDialog,
        editViewDialog = this.editViewDialog,
        editTableDialog = this.editTableDialog;

    // add new table
    goog.events.listen(newTableDialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        if(e.key == 'ok') {
            this.createTable();
        }
    }, false, this);

    goog.events.listen(goog.dom.getElement('add-new-table'), goog.events.EventType.CLICK, function(e) {
        newTableDialog.setVisible(true);
    });

    // edit table
    goog.events.listen(editTableDialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        if(e.key == 'save') {
            this.renameTable();
        } else if(e.key == 'remove') {
            this.removeTable();
        }
    }, false, this);

    goog.events.listen(goog.dom.getElement('tables'), goog.events.EventType.DBLCLICK, function(e) {
        editTableDialog.setContent('Edit name: <input type="text" id="edit-table-name" name="'+ e.target.id +'" value="'+e.target.innerText+'">');
        editTableDialog.setVisible(true);
    });

    // add new view
    goog.events.listen(newViewDialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        if(e.key == 'ok') {
            this.createView();
        }
    }, false, this);

    goog.events.listen(goog.dom.getElement('add-new-view'), goog.events.EventType.CLICK, function(e) {
        newViewDialog.setVisible(true);
    });

    // edit view
    goog.events.listen(editViewDialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        if(e.key == 'save') {
            this.renameView();
        } else if(e.key == 'remove') {
            this.removeView();
        }
    }, false, this);

    goog.events.listen(goog.dom.getElement('views'), goog.events.EventType.DBLCLICK, function(e) {
        editViewDialog.setContent('Edit name: <input type="text" id="edit-view-name" name="'+ e.target.id +'" value="'+e.target.innerText+'">');
        editViewDialog.setVisible(true);
    }, false, this);

    // set active table
    goog.events.listen(goog.dom.getElement('tables'), goog.events.EventType.CLICK, function(e) {
        var tableID = e.target.id.replace('button-table-', '');
        if(!goog.dom.classlist.contains(e.target, 'active-table')) {
            this.setActiveTable(tableID, e.target);
        }
    }, false, this);

    // set active views
    goog.events.listen(goog.dom.getElement('views'), goog.events.EventType.CLICK, function(e) {
        var viewID = e.target.id.replace('button-view-', '');
        if(goog.dom.classlist.contains(e.target, 'active-view')) {
            this.hideView(viewID, e.target);
        } else {
            this.showView(viewID, e.target);
        }
    }, false, this);

    // set selected view
    goog.events.listen(goog.dom.getElement('canvas-wrapper'), goog.events.EventType.MOUSEDOWN, this.updateSelectedView, true, this);

    goog.events.listen(goog.dom.getElement('com-save-btn'), goog.events.EventType.MOUSEDOWN, function(e) {
            goog.dom.classlist.remove(this._canvasWrapper, 'active-component-panel');
            var element = goog.dom.getElement('component-configuration');
            element.innerHTML = '';
    }, false, this);

    // listen for resize
    goog.events.listen(window, goog.events.EventType.RESIZE, function() {
        this.updateSizes();
        this._redrawAll();
    }, false, this);

};

app.SceneController.prototype.getReflectionsCount = function() {
    this._viewController.getReflectionsCount();
};

app.SceneController.prototype.setReflectionsCount = function(count) {
    this._viewController.setReflectionsCount(count);
};

app.SceneController.prototype._redrawAll = function() {
   var views = this._tables[this._activeTableID].getViews();

    for(var i = 0; i < views.length; i++) {
        this._viewController.setViewModel(views[i]);
        this._viewController.draw();
    }
};
