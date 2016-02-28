goog.provide('app.SceneController');

goog.require('goog.dom');
goog.require('app.ViewController');
goog.require('app.model.Table');
goog.require('app.model.View');

/**
 * @param {!boolean} newSimulation
 * @final
 * @constructor
 */
app.SceneController = function (newSimulation) {
    /**
     * @const
     * @type {!app.ViewController}
     * @private
     */
    this._VIEW_CONTROLLER = new app.ViewController();
    /**
     * @type {app.ComponentController}
     * @private
     */
    this._componentController = null;
    /**
     * @type {!string}
     * @private
     */
    this._newComponentType = '';
    /**
     * @const
     * @type {Element}
     * @private
     */
    this._CANVAS_WRAPPER = goog.dom.getElement('canvas-wrapper');
    /**
     * @type {!Array<app.model.Table>}
     * @private
     */
    this._tables = [];
    /**
     * @type {!Array<number>}
     * @private
     */
    this._mouseCursorPoint = [];
    /**
     * @type {!boolean}
     * @private
     */
    this._isAddNewComponent = false;
    /**
     * @type {!boolean}
     * @private
     */
    this._componentMoveActive = false;
    /**
     * @type {!boolean}
     * @private
     */
    this._componentMoved = false;
    /**
     * @type {!boolean}
     * @private
     */
    this._canvasMoveActive = false;

    if (newSimulation) {
        this.init();
    }
};

/**
 * @private
 */
app.SceneController.prototype.init = function () {
    this.createDialogs();

    // create first table and view
    var viewID = 0, tableID = 0;
    var newTable = new app.model.Table(tableID, 'Table 1');
    this._tables.push(newTable);
    this._activeTableID = 0;
    this.addTableToGUI(this._activeTableID, 'Table 1');

    var newView = new app.model.View(tableID, viewID, 'View 1', 0, 0);
    newTable.addView(newView);
    newView.setCanvas(this.addViewToGUI(viewID, 'View 1'));

    this.addListeners();

    var tableButton = goog.dom.getElement('button-table-' + tableID);
    this.setActiveTable(tableID, tableButton);
};

/**
 * @param {!string} type
 * @public
 */
app.SceneController.prototype.showCross = function (type) {
    if (!goog.dom.classlist.contains(this._CANVAS_WRAPPER, 'show-cross')) {
        goog.dom.classlist.add(this._CANVAS_WRAPPER, 'show-cross');
        this._isAddNewComponent = true;
        this._newComponentType = type;
    }
};

/**
 * @private
 */
app.SceneController.prototype.hideCross = function () {
    goog.dom.classlist.remove(this._CANVAS_WRAPPER, 'show-cross');
};

/**
 * @private
 */
app.SceneController.prototype.createDialogs = function () {
    this.newViewDialog = new goog.ui.Dialog();
    this.newViewDialog.setTitle(app.translation['new-view']);
    this.newViewDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['view-name'],
        goog.html.SafeHtml.create('input', {'type': 'text', 'id': 'new-view-name', 'name': 'new-view-name'})]
    ));
    this.newViewDialog.setButtonSet(goog.ui.Dialog.ButtonSet.createOkCancel());
    this.editViewDialog = new goog.ui.Dialog();
    this.editViewDialog.setTitle(app.translation['edit-view']);
    var viewButtonsSet = new goog.ui.Dialog.ButtonSet();
    viewButtonsSet.addButton({key: 'save', caption: 'Save'}, true);
    viewButtonsSet.addButton({key: 'remove', caption: 'Remove view'}, true);
    viewButtonsSet.addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, false, true);
    this.editViewDialog.setButtonSet(viewButtonsSet);
    this.newTableDialog = new goog.ui.Dialog();
    this.newTableDialog.setTitle(app.translation['new-table']);
    this.newTableDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['table-name'],
        goog.html.SafeHtml.create('input', {'type': 'text', 'id': 'new-table-name', 'name': 'new-table-name'})]
    ));
    this.editTableDialog = new goog.ui.Dialog();
    this.editTableDialog.setTitle(app.translation['edit-table']);
    var tableButtonsSet = new goog.ui.Dialog.ButtonSet();
    tableButtonsSet.addButton({key: 'save', caption: 'Save'}, true);
    tableButtonsSet.addButton({key: 'remove', caption: 'Remove table'}, true);
    tableButtonsSet.addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, false, true);
    this.editTableDialog.setButtonSet(tableButtonsSet);

    this.copyDialog = new goog.ui.Dialog();
    this.copyDialog.setTitle(app.translation['copy-title']);
};

/**
 * @private
 */
app.SceneController.prototype.updateSizes = function () {
    var height = Math.max(document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.offsetHeight),
        width = this._CANVAS_WRAPPER.clientWidth,
        views = goog.dom.getElementsByClass('active-view', goog.dom.getElement('table-' + this._activeTableID));

    height = height - 184;
    this._CANVAS_WRAPPER.style.height = height + 'px';

    height = height / this._tables[this._activeTableID].getActiveViewsCount();
    for (var i = 0; i < views.length; i++) {
        this._tables[this._activeTableID].updateViewSize(i, width, height);

        views[i].style.height = height + "px";
        views[i].style.width = width + "px";

        views[i].firstChild.height = height;
        views[i].firstChild.width = width;
    }
};

/**
 * @param {!number} tableID
 * @param {Element} buttonElement
 * @private
 */
app.SceneController.prototype.setActiveTable = function (tableID, buttonElement) {
    try {
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
    } catch (err) {
        console.log(err);
    }
    this._activeTableID = tableID;
};

/**
 * @param {!number} tableID
 * @param {!number} viewID
 * @private
 */
app.SceneController.prototype.setSelectedView = function (tableID, viewID) {
    this._VIEW_CONTROLLER.setComponents(this._tables[tableID].getComponents());
    this._VIEW_CONTROLLER.setViewModel(this._tables[tableID].getView(viewID));
};

/**
 * @param {!string} viewID - format: (tableID)-(viewID)
 * @param {Element} buttonElement
 * @private
 */
app.SceneController.prototype.showView = function (viewID, buttonElement) {
    try {
        this._tables[this._activeTableID].increaseActiveViewsCount();
        goog.dom.classlist.add(buttonElement, 'active-view');
        var view = goog.dom.getElement('view-' + viewID);
        goog.dom.classlist.add(view, 'active-view');
        this.updateSizes();
    } catch (err) {
        console.log(err);
    }
};

/**
 * @param {!string} viewID - format: (tableID)-(viewID)
 * @param {Element} buttonElement
 * @private
 */
app.SceneController.prototype.hideView = function (viewID, buttonElement) {
    try {
        this._tables[this._activeTableID].decreaseActiveViewsCount();
        goog.dom.classlist.remove(buttonElement, 'active-view');
        var view = goog.dom.getElement('view-' + viewID);
        goog.dom.classlist.remove(view, 'active-view');
        this.updateSizes();
    } catch (err) {
        console.log(err);
    }
};

/**
 * @param {!number} tableID
 * @param {!string} tableName
 * @private
 */
app.SceneController.prototype.addTableToGUI = function (tableID, tableName) {
    var table = goog.dom.createDom('div', {'id': 'table-' + tableID, 'class': 'table-wrapper'}),
        tables = goog.dom.getElement('tables'),
        views = goog.dom.getElement('views');

    tables.appendChild(goog.dom.createDom('div', {
        'class': 'button-table',
        'id': 'button-table-' + tableID
    }, tableName));
    views.appendChild(goog.dom.createDom('div', {'id': 'table-' + tableID + '-views'}, ''));
    this._CANVAS_WRAPPER.appendChild(table);
};

/**
 * @param {!number} viewID
 * @param {!string} viewName
 * @private
 */
app.SceneController.prototype.addViewToGUI = function (viewID, viewName) {
    var canvasName = 'canvas-' + this._activeTableID + '-' + viewID,
        viewWrapperName = 'view-' + this._activeTableID + '-' + viewID,
        buttonID = 'button-view-' + this._activeTableID + '-' + viewID;

    var tableElement = goog.dom.getElement('table-' + this._activeTableID);
    var view = goog.dom.createDom('div', {'id': viewWrapperName, 'class': 'view-wrapper active-view'}),
        canvas = goog.dom.createDom('canvas', {'id': canvasName}),
        views = goog.dom.getElement('table-' + this._activeTableID + '-views'),
        coordinates = goog.dom.createDom('div', {'class': 'mouse-coordinates'}, 'x: 0 cm, y: 0 cm, zoom: 100%'),
        zoomIn = goog.dom.createDom('div', {'class': 'zoom-in'}, '+'),
        zoomOut = goog.dom.createDom('div', {'class': 'zoom-out'}, '-'),
        zoom = goog.dom.createDom('div', {'class': 'zoom'}, zoomIn, zoomOut),
        moveTop = goog.dom.createDom('div', {'class': 'wide-top-move-control'}, String.fromCharCode(8673)),
        moveRight = goog.dom.createDom('div', {'class': 'right-side-move-control'}, String.fromCharCode(8674)),
        moveLeft = goog.dom.createDom('div', {'class': 'left-side-move-control'}, String.fromCharCode(8672)),
        moveBottom = goog.dom.createDom('div', {'class': 'wide-bottom-move-control'}, String.fromCharCode(8675)),
        move = goog.dom.createDom('div', {'class': 'move-control'}, moveTop, moveRight, moveLeft, moveBottom),
        button = goog.dom.createDom('div', {'class': 'button-view', 'id': buttonID}, viewName);

    views.appendChild(button);
    view.appendChild(canvas);
    view.appendChild(coordinates);
    view.appendChild(zoom);
    view.appendChild(move);
    tableElement.appendChild(view);

    this.showView(this._activeTableID + '-' + viewID, button);
    this._VIEW_CONTROLLER.addListeners(view);
    this.updateSizes();

    goog.events.listen(view, goog.events.EventType.MOUSEENTER, function (e) {
        var pieces = e.currentTarget.id.split('-');
        this.setSelectedView(parseInt(pieces[1], 10), parseInt(pieces[2], 10));
    }, true, this);

    goog.events.listen(view, goog.events.EventType.MOUSEDOWN, function (e) {
        var pieces = e.currentTarget.id.split('-');
        this.setSelectedView(parseInt(pieces[1], 10), parseInt(pieces[2], 10));
        if (this._isAddNewComponent) { // pridani nove
            this.addComponent(e.offsetX, e.offsetY);
        } else if (this.isIntersection(e)) { // vyber komponenty
            this._componentMoveActive = true;
            this._mouseCursorPoint = [e.offsetX, e.offsetY];
            goog.events.listen(this._CANVAS_WRAPPER, [goog.events.EventType.MOUSEMOVE],
                this.componentMoved, true, this);
        } else { // muze byt posun platna
            this._canvasMoveActive = true;
            this._VIEW_CONTROLLER.addCanvasMove(view, [e.offsetX, e.offsetY]);
        }
    }, true, this);

    // mouse up events
    goog.events.listen(view, goog.events.EventType.MOUSEUP, function (e) {
        if (this._isAddNewComponent) {
            this._isAddNewComponent = false;
            this.hideCross();
        } else if (this._componentMoveActive && this._componentMoved) {
            this._componentMoveActive = false;
            this._componentMoved = false;
            this._componentController.removeSelected();
            this.redrawAll();
            goog.events.unlisten(this._CANVAS_WRAPPER, goog.events.EventType.MOUSEMOVE,
                this.componentMoved, true, this);
        } else if (this._componentMoveActive && !this._componentMoved) {
            this._componentMoveActive = false;
            this._componentController.removeSelected();
            this._componentController.showComponentControlPanel(this);
            goog.events.unlisten(this._CANVAS_WRAPPER, goog.events.EventType.MOUSEMOVE,
                this.componentMoved, true, this);
        } else if (this._canvasMoveActive) {
            this._canvasMoveActive = false;
            this._VIEW_CONTROLLER.removeCanvasMove(view);
        }
    }, true, this);

    return canvas;
};

/**
 * @private
 */
app.SceneController.prototype.createTable = function () {
    var input = goog.dom.getElement('new-table-name');
    this.addTableToGUI(this._tables.length, input.value);
    this._tables.push(new app.model.Table(this._tables.length, input.value));
};

/**
 * @param {!string} elementID
 * @private
 */
app.SceneController.prototype.removeTableFromGUI = function (elementID) {
    // TODO
    goog.dom.removeNode(goog.dom.getElement(elementID));
    var tableWrapperName = elementID.replace("button-", "");
    goog.dom.removeNode(goog.dom.getElement(tableWrapperName));

    // reindex
    var tablesButtons = goog.dom.getElementsByClass('button-table');
    for (var i = 0; i < tablesButtons.length; i++) {

        var buttonID = tablesButtons[i].id,
            viewID = buttonID.replace("button-table-", ""),
            newViewID = this._activeTableID + '-' + i;

        var viewWrapper = goog.dom.getElement('table-' + viewID);
        tablesButtons[i].id = 'button-table-' + newViewID;
        viewWrapper.id = 'table-' + newViewID;
    }
};

/**
 * @private
 */
app.SceneController.prototype.removeTable = function () {
    var input = goog.dom.getElement('edit-table-name');
    this.removeTableFromGUI(input.name);
};

/**
 * @private
 */
app.SceneController.prototype.renameTable = function () {
    var input = goog.dom.getElement('edit-table-name'),
        tableButton = goog.dom.getElement(input.name);

    tableButton.innerText = input.value;
};

/**
 * @private
 */
app.SceneController.prototype.createView = function () {
    var viewID = this._tables[this._activeTableID].getNextViewID();
    var input = goog.dom.getElement('new-view-name');

    var newView = new app.model.View(this._activeTableID, viewID, input.value, 0, 0);
    this._tables[this._activeTableID].addView(newView);

    newView.setCanvas(this.addViewToGUI(viewID, input.value));
    this.redrawAll();
};

/**
 * @param {!string} elementID
 * @private
 */
app.SceneController.prototype.removeViewFromGUI = function (elementID) {
    goog.dom.removeNode(goog.dom.getElement(elementID));
    goog.dom.removeNode(goog.dom.getElement(elementID.replace("button-", "")));

    // reindex
    var viewsButtons = goog.dom.getElementsByClass('button-view');
    for (var i = 0; i < viewsButtons.length; i++) {
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

/**
 * @private
 */
app.SceneController.prototype.removeView = function () {
    var input = goog.dom.getElement('edit-view-name');
    var res = input.name.split('-');
    var viewID = res[3];

    this._tables[this._activeTableID].removeView(viewID);
    // remove
    this.removeViewFromGUI(input.name);
    this.updateSizes();
    this.redrawAll();
};

/**
 * @private
 */
app.SceneController.prototype.renameView = function () {
    var input = goog.dom.getElement('edit-view-name'),
        viewButton = goog.dom.getElement(input.name);

    viewButton.innerText = input.value;
};

/**
 * @param {!app.model.Component} componentModel
 * @param {!number} componentID
 * @private
 */
app.SceneController.prototype.setSelectedComponent = function (componentModel, componentID) {
    switch (componentModel.getType()) {
        case 'MIRROR':
            this._componentController = new app.MirrorController(/**@type{!app.model.Mirror}*/(componentModel), componentID);
            break;
        case 'LENS':
            this._componentController = new app.LensController(/**@type{!app.model.Lens}*/(componentModel), componentID);
            break;
        case 'HOLO-PLATE':
            this._componentController = new app.HolographicPlateController(/**@type{!app.model.HolographicPlate}*/(componentModel), componentID);
            break;
        case 'WALL':
            this._componentController = new app.WallController(/**@type{!app.model.Wall}*/(componentModel), componentID);
            break;
        case 'SPLITTER':
            this._componentController = new app.SplitterController(/**@type{!app.model.Splitter}*/(componentModel), componentID);
            break;
        case 'LIGHT':
            this._componentController = new app.LightController(/**@type{!app.model.Light}*/(componentModel), componentID);
            break;
    }
};

/**
 * @param {goog.events.BrowserEvent} e
 * @return {!boolean}
 * @private
 */
app.SceneController.prototype.isIntersection = function (e) {
    var point = this._VIEW_CONTROLLER.reverseTransformPoint([e.offsetX, e.offsetY]),
        components = this._tables[this._activeTableID].getComponents();

    for (var i = 0; i < components.length; i++) {
        if (components[i].isSelected(point[0], point[1])) {
            this.setSelectedComponent(components[i], i);
            return true;
        }
    }
    return false;
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
app.SceneController.prototype.componentMoved = function (e) {
    var diffX, diffY;

    diffX = e.offsetX - this._mouseCursorPoint[0];
    diffY = e.offsetY - this._mouseCursorPoint[1];

    this._mouseCursorPoint[0] = e.offsetX;
    this._mouseCursorPoint[1] = e.offsetY;

    var point = this._VIEW_CONTROLLER.reverseScale([diffX, diffY]);

    this._componentMoved = true;
    this._componentController.updatePosition(point[0], point[1]);
    this.redrawAll();
};

/**
 * @private
 */
app.SceneController.prototype.addListeners = function () {
    var newViewDialog = this.newViewDialog,
        newTableDialog = this.newTableDialog,
        editViewDialog = this.editViewDialog,
        editTableDialog = this.editTableDialog,
        dbClick = 0;

    // add new table
    goog.events.listen(newTableDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.SceneController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'ok') {
                this.createTable();
            }
        },
        false, this);

    goog.events.listen(goog.dom.getElement('add-new-table'), goog.events.EventType.CLICK,
        /** @this {!app.SceneController} */
        function () {
            newTableDialog.setVisible(true);
        }
    );

    // edit table
    goog.events.listen(editTableDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.SceneController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'save') {
                this.renameTable();
            } else if (e.key == 'remove') {
                this.removeTable();
            }
        },
        false, this);

    goog.events.listen(goog.dom.getElement('tables'), goog.events.EventType.DBLCLICK,
        /**
         * @this {!app.SceneController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            editTableDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['edit-name'],
                goog.html.SafeHtml.create('input', {
                    'type': 'text',
                    'id': 'edit-table-name',
                    'name': e.target.id,
                    'value': e.target.innerText
                })]
            ));
            editTableDialog.setVisible(true);
        },
        false, this);

    // add new view
    goog.events.listen(newViewDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.SceneController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'ok') this.createView();
        },
        false, this);

    goog.events.listen(goog.dom.getElement('add-new-view'), goog.events.EventType.CLICK, function (e) {
        newViewDialog.setVisible(true);
    });

    // edit view
    goog.events.listen(editViewDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.SceneController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'save') {
                this.renameView();
            } else if (e.key == 'remove') {
                this.removeView();
            }
        },
        false, this);

    goog.events.listen(goog.dom.getElement('views'), goog.events.EventType.DBLCLICK,
        /**
         * @this {!app.SceneController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            editTableDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['edit-name'],
                goog.html.SafeHtml.create('input', {
                    'type': 'text',
                    'id': 'edit-view-name',
                    'name': e.target.id,
                    'value': e.target.innerText
                })]
            ));
            editViewDialog.setVisible(true);
        },
        false, this);

    // set active table
    goog.events.listen(goog.dom.getElement('tables'), goog.events.EventType.CLICK,
        /**
         * @this {!app.SceneController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            if (++dbClick === 2) return;
            setTimeout(function (thisScope) {
                if (dbClick === 1) {
                    thisScope.hideComponentControlPanel();
                    if (!goog.dom.classlist.contains(/**@type{Element}*/(e.target), 'active-table')) {
                        thisScope.setActiveTable(parseInt(e.target.id.replace('button-table-', ''), 10), e.target);
                    }
                }
                dbClick = 0;
            }, 200, this);
        },
        false, this);

    // set active views
    goog.events.listen(goog.dom.getElement('views'), goog.events.EventType.CLICK,
        /**
         * @this {!app.SceneController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            dbClick++;
            setTimeout(function (thisScope) {
                if (dbClick === 1) {
                    var viewID = e.target.id.replace('button-view-', '');
                    if (goog.dom.classlist.contains(/**@type{Element}*/(e.target), 'active-view')) {
                        thisScope.hideView(viewID, e.target);
                    } else {
                        thisScope.showView(viewID, e.target);
                    }
                    thisScope.redrawAll();
                }
                dbClick = 0;
            }, 200, this);
        }, false, this);

    // listen for resize
    goog.events.listen(/** @type {EventTarget} */(window), goog.events.EventType.RESIZE,
        /** @this {!app.SceneController} */
        function () {
            this.updateSizes();
            this.redrawAll();
        }, false, this);

    // Common component listeners
    goog.events.listen(goog.dom.getElement('com-close-btn'), goog.events.EventType.CLICK,
        this.hideComponentControlPanel, false, this);

    goog.events.listen(goog.dom.getElement('com-delete-btn'), goog.events.EventType.CLICK,
        /** @this {!app.SceneController} */
        function () {
            var componentID = this._componentController.removeActiveComponent();
            this._tables[this._activeTableID].removeComponent(componentID);
            this.hideComponentControlPanel();
            this.redrawAll();
        }, false, this);

    goog.events.listen(goog.dom.getElement('com-copy-btn'), goog.events.EventType.CLICK,
        /** @this {!app.SceneController} */
        function () {
            var copyButtons = new goog.ui.Dialog.ButtonSet(),
                list = this.getInactiveTablesList(),
                /** @type {!Array<!goog.html.SafeHtml>} */ options = [];

            if (list.length > 0) {
                copyButtons.addButton({key: 'copy', caption: 'Copy'}, true);
                copyButtons.addButton({key: 'close', caption: 'Close'}, true);
                for (var i = 0; i < list.length; i++) {
                    options.push(goog.html.SafeHtml.create('option', {'value': list[i]['id']}, list[i]['name']));
                }
                this.copyDialog.setSafeHtmlContent(goog.html.SafeHtml.create('select', {'id': 'copy-to-table'}, options));
            } else {
                copyButtons.addButton({key: 'close', caption: 'Close'}, true);
                this.copyDialog.setTextContent(app.translation['copy-no-tables']);
            }
            this.copyDialog.setVisible(true);
        }, false, this);

    goog.events.listen(this.copyDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.SceneController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'copy') {
                var select = goog.dom.getElement('copy-to-table');
                var tableID = select.options[select.selectedIndex].value;
                this._tables[tableID].addComponent(this._componentController.getComponentModelCopy());
            }
        }, false, this);
};

/**
 * @private
 */
app.SceneController.prototype.hideComponentControlPanel = function () {
    goog.dom.classlist.remove(this._CANVAS_WRAPPER, 'active-component-panel');
    var element = goog.dom.getElement('component-configuration');
    element.innerHTML = '';
};

/**
 * @return {!number}
 * @public
 */
app.SceneController.prototype.getReflectionsCount = function () {
    return this._VIEW_CONTROLLER.getReflectionsCount();
};

/**
 * @param {!number} count
 * @public
 */
app.SceneController.prototype.setReflectionsCount = function (count) {
    this._VIEW_CONTROLLER.setReflectionsCount(count);
    this.redrawAll();
};

/**
 * @public
 */
app.SceneController.prototype.redrawAll = function () {
    var views = this._tables[this._activeTableID].getViews();

    this._VIEW_CONTROLLER.setComponents(this._tables[this._activeTableID].getComponents());
    for (var i = 0; i < views.length; i++) {
        this._VIEW_CONTROLLER.setViewModel(views[i]);
        this._VIEW_CONTROLLER.draw();
    }
};

/**
 * @param {!number} coordX
 * @param {!number} coordY
 * @private
 */
app.SceneController.prototype.addComponent = function (coordX, coordY) {
    var model = null, modelID, coords = this._VIEW_CONTROLLER.reverseTransformPoint([coordX, coordY]);

    switch (this._newComponentType) {
        case 'MIRROR':
            model = new app.model.Mirror(coords[0], coords[1]);
            modelID = this._tables[this._activeTableID].addComponent(model);
            this._componentController = new app.MirrorController(model, modelID);
            break;
        case 'LENS':
            model = new app.model.Lens(coords[0], coords[1]);
            modelID = this._tables[this._activeTableID].addComponent(model);
            this._componentController = new app.LensController(model, modelID);
            break;
        case 'HOLO-PLATE':
            model = new app.model.HolographicPlate(coords[0], coords[1]);
            modelID = this._tables[this._activeTableID].addComponent(model);
            this._componentController = new app.HolographicPlateController(model, modelID);
            break;
        case 'WALL':
            model = new app.model.Wall(coords[0], coords[1]);
            modelID = this._tables[this._activeTableID].addComponent(model);
            this._componentController = new app.WallController(model, modelID);
            break;
        case 'SPLITTER':
            model = new app.model.Splitter(coords[0], coords[1]);
            modelID = this._tables[this._activeTableID].addComponent(model);
            this._componentController = new app.SplitterController(model, modelID);
            break;
        case 'LIGHT':
            model = new app.model.Light(coords[0], coords[1]);
            modelID = this._tables[this._activeTableID].addComponent(model);
            this._componentController = new app.LightController(model, modelID);
            break;
    }

    this._componentController.showComponentControlPanel(this);
    this.redrawAll();
};

/**
 * @return {Array<Object>}
 * @private
 */
app.SceneController.prototype.getInactiveTablesList = function () {
    var list = [], item;

    for (var i = 0; i < this._tables.length; i++) {
        if (i !== this._activeTableID) {
            item = {};
            item['id'] = i;
            item['name'] = this._tables[i].getName();
            list.push(item);
        }
    }

    return list;
};
