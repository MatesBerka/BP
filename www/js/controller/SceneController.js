goog.provide('app.SceneController');

goog.require('goog.dom');
goog.require('app.ViewController');
goog.require('app.model.Table');
goog.require('app.model.View');
goog.require('goog.json');

/**
 * @param {!boolean} newSimulation
 * @final
 * @constructor
 */
app.SceneController = function (newSimulation) {
    /**
     * @const
     * @type {Element}
     * @private
     */
    this._CANVAS_WRAPPER = goog.dom.getElement('canvas-wrapper');
    /**
     * @const
     * @type {!app.ViewController}
     * @private
     */
    this._VIEW_CONTROLLER = new app.ViewController(this._CANVAS_WRAPPER);
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
    var newTable = new app.model.Table('Table 1');
    this._tables.push(newTable);
    this._activeTableID = 0;
    this.addTableToGUI(this._activeTableID, 'Table 1');

    var newView = new app.model.View('View 1', 0, 0);
    newTable.addView(newView);
    newView.setCanvas(this.addViewToGUI(viewID, 'View 1'));

    this._addListeners();

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
    /**
     * @type {goog.ui.Dialog}
     * @private
     */
    this._newViewDialog = new goog.ui.Dialog();
    /**
     * @type {goog.ui.Dialog}
     * @private
     */
    this._editViewDialog = new goog.ui.Dialog();
    /**
     * @type {goog.ui.Dialog}
     * @private
     */
    this._newTableDialog = new goog.ui.Dialog();
    /**
     * @type {goog.ui.Dialog}
     * @private
     */
    this._editTableDialog = new goog.ui.Dialog();
    /**
     * @type {goog.ui.Dialog}
     * @private
     */
    this._copyDialog = new goog.ui.Dialog();
};

/**
 * @private
 */
app.SceneController.prototype.updateSizes = function () {
    var width = this._CANVAS_WRAPPER.clientWidth,
        views = goog.dom.getElementsByClass('active-view', goog.dom.getElement('table-' + this._activeTableID));

    var height = window.innerHeight - 134;
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
    // activate table button
    var curActiveButton = goog.dom.getElement('button-table-' + this._activeTableID);

    goog.dom.classlist.remove(/**@type{Element}*/(curActiveButton.parentNode), 'active-table');
    goog.dom.classlist.add(/**@type{Element}*/(buttonElement.parentNode), 'active-table');

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

    this._activeTableID = tableID;
    this.redrawAll();
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
    this._tables[this._activeTableID].increaseActiveViewsCount();
    goog.dom.classlist.add(buttonElement, 'active-view');
    var view = goog.dom.getElement('view-' + viewID);
    goog.dom.classlist.add(view, 'active-view');
    this.updateSizes();
};

/**
 * @param {!string} viewID - format: (tableID)-(viewID)
 * @param {Element} buttonElement
 * @private
 */
app.SceneController.prototype.hideView = function (viewID, buttonElement) {
    this._tables[this._activeTableID].decreaseActiveViewsCount();
    goog.dom.classlist.remove(buttonElement, 'active-view');
    var view = goog.dom.getElement('view-' + viewID);
    goog.dom.classlist.remove(view, 'active-view');
    this.updateSizes();
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

    tables.appendChild(goog.dom.createDom('div', {'class': 'button-wrapper'},
        goog.dom.createDom('div', {
            'class': 'button-table',
            'id': 'button-table-' + tableID
        }, tableName),
        goog.dom.createDom('div', {
            'class': 'edit-button'
        }, '✎')
    ));

    views.appendChild(goog.dom.createDom('div', {'id': 'table-' + tableID + '-views', 'class': 'table-buttons'}, ''));
    this._CANVAS_WRAPPER.appendChild(table);
};

/**
 * @private
 */
app.SceneController.prototype.createTable = function () {
    var input = goog.dom.getElement('new-table-name');
    this.addTableToGUI(this._tables.length, input.value);
    this._tables.push(new app.model.Table(input.value));
};

/**
 * @param {!string} elementID
 * @private
 */
app.SceneController.prototype.removeTableFromGUI = function (elementID) {
    goog.dom.removeNode(goog.dom.getElement(elementID).parentNode);
    var tableWrapperName = elementID.replace("button-", "");
    goog.dom.removeNode(goog.dom.getElement(tableWrapperName));
    goog.dom.removeNode(goog.dom.getElement(tableWrapperName + '-views'));

    // reindex
    var tablesButtons = goog.dom.getElementsByClass('button-table');
    var viewID, viewWrapper, tableWrapper, viewCanvas, viewsButtons, tableID, buttonsWrapper;
    for (var i = 0; i < tablesButtons.length; i++) {
        tableID = tablesButtons[i].id.replace("button-table-", "");
        tablesButtons[i].id = 'button-table-' + i;

        tableWrapper = goog.dom.getElement('table-' + tableID);
        tableWrapper.id = 'table-' + i;

        buttonsWrapper = goog.dom.getElement('table-' + tableID + '-views');
        viewsButtons = goog.dom.getElementsByClass('button-view', buttonsWrapper);
        buttonsWrapper.id = 'table-' + i + '-views';

        for (var j = 0; j < viewsButtons.length; j++) {
            viewID = viewsButtons[j].id.replace("button-view-", "");
            viewsButtons[j].id = 'button-view-' + i + '-' + j;

            viewWrapper = goog.dom.getElement('view-' + viewID);
            viewWrapper.id = 'view-' + i + '-' + j;

            viewCanvas = goog.dom.getElement('canvas-' + viewID);
            viewCanvas.id = 'canvas-' + i + '-' + j;
        }
    }
};

/**
 * @private
 */
app.SceneController.prototype.removeTable = function () {
    var input = goog.dom.getElement('edit-table-name'),
        tableID = parseInt(input.name.replace("button-table-", ""), 10);

    this._tables.splice(tableID, 1);
    this.removeTableFromGUI(input.name);
};

/**
 * @private
 */
app.SceneController.prototype.renameTable = function () {
    var input = goog.dom.getElement('edit-table-name'),
        tableID = parseInt(input.name.replace("button-table-", ""), 10),
        tableButton = goog.dom.getElement(input.name);

    this._tables[tableID].changeName(input.name);
    tableButton.innerText = input.value;
};

/**
 * @private
 */
app.SceneController.prototype.createView = function () {
    var viewID = this._tables[this._activeTableID].getNextViewID();
    var input = goog.dom.getElement('new-view-name');

    var newView = new app.model.View(input.value, 0, 0);
    this._tables[this._activeTableID].addView(newView);

    newView.setCanvas(this.addViewToGUI(viewID, input.value));
    this.redrawAll();
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
        button = goog.dom.createDom('div', {'class': 'button-wrapper'},
            goog.dom.createDom('div', {
                'class': 'button-view',
                'id': buttonID
            }, viewName),
            goog.dom.createDom('div', {
                'class': 'edit-button'
            }, '✎')
        );

    views.appendChild(button);

    view.appendChild(canvas);
    view.appendChild(coordinates);
    view.appendChild(zoom);
    view.appendChild(move);
    tableElement.appendChild(view);

    this.showView(this._activeTableID + '-' + viewID, button);
    this._VIEW_CONTROLLER.addListeners(view);
    this.updateSizes();

    goog.events.listen(view, goog.events.EventType.MOUSEENTER,
        /**
         * @this {!app.SceneController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            var pieces = e.currentTarget.id.split('-');
            this.setSelectedView(parseInt(pieces[1], 10), parseInt(pieces[2], 10));
        }, true, this);

    goog.events.listen(view, app.MOUSE_DOWN_EVENT,
        /**
         * @this {!app.SceneController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            var coords = [];
            coords[0] = (e.clientX - this._CANVAS_WRAPPER.offsetLeft);
            coords[1] = (e.clientY - e.currentTarget.offsetTop - this._CANVAS_WRAPPER.offsetTop);
            var pieces = e.currentTarget.id.split('-');
            this.setSelectedView(parseInt(pieces[1], 10), parseInt(pieces[2], 10));
            if (this._isAddNewComponent) { // pridani nove
                this.addComponent(coords);
            } else if (this.isIntersection(coords)) { // vyber komponenty
                this._componentMoveActive = true;
                this._mouseCursorPoint = coords;
                goog.events.listen(view, app.MOUSE_MOVE_EVENT, this.componentMoved, true, this);
            } else { // muze byt posun platna
                this._canvasMoveActive = true;
                this._VIEW_CONTROLLER.addCanvasMove(view, coords);
            }
        }, true, this);

    // mouse up events
    goog.events.listen(view, app.MOUSE_UP_EVENT,
        /**
         * @this {!app.SceneController}
         */
        function () {
            if (this._isAddNewComponent) {
                this._isAddNewComponent = false;
                this.hideCross();
            } else if (this._componentMoveActive && this._componentMoved) {
                this._componentMoveActive = false;
                this._componentMoved = false;
                this._componentController.removeSelected();
                this.redrawAll();
                goog.events.unlisten(view, app.MOUSE_MOVE_EVENT, this.componentMoved, true, this);
            } else if (this._componentMoveActive && !this._componentMoved) {
                this._componentMoveActive = false;
                this._componentController.removeSelected();
                this._componentController.showComponentControlPanel(this);
                goog.events.unlisten(view, app.MOUSE_MOVE_EVENT, this.componentMoved, true, this);
            } else if (this._canvasMoveActive) {
                this._canvasMoveActive = false;
                this._VIEW_CONTROLLER.removeCanvasMove(view);
            }
        }, true, this);

    return canvas;
};

/**
 * @param {!string} elementID
 * @private
 */
app.SceneController.prototype.removeViewFromGUI = function (elementID) {
    goog.dom.removeNode(goog.dom.getElement(elementID).parentNode);
    goog.dom.removeNode(goog.dom.getElement(elementID.replace("button-", "")));

    // reindex
    var viewsButtons = goog.dom.getElementsByClass('button-view', goog.dom.getElement('table-' + this._activeTableID + '-views'));
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
        viewButton = goog.dom.getElement(input.name),
        res = input.name.split('-'),
        viewID = parseInt(res[3], 10);

    this._tables[this._activeTableID].updateViewName(viewID, input.value);
    viewButton.innerText = input.value;
};

/**
 * @param {!Array<!number>} selectedPoint
 * @return {!boolean}
 * @private
 */
app.SceneController.prototype.isIntersection = function (selectedPoint) {
    var point = this._VIEW_CONTROLLER.reverseTransformPoint(selectedPoint),
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
    var diffX, diffY, move = [];

    move[0] = (e.clientX - this._CANVAS_WRAPPER.offsetLeft);
    move[1] = (e.clientY - e.currentTarget.offsetTop - this._CANVAS_WRAPPER.offsetTop);

    diffX = move[0] - this._mouseCursorPoint[0];
    diffY = move[1] - this._mouseCursorPoint[1];

    this._mouseCursorPoint = move;
    var point = this._VIEW_CONTROLLER.reverseScale([diffX, diffY]);

    this._componentMoved = true;
    this._componentController.updatePosition(point[0], point[1]);
    e.stopPropagation();
    e.preventDefault();
    this.redrawAll();
};

/**
 * @private
 */
app.SceneController.prototype._addListeners = function () {
    // add new table
    goog.events.listen(this._newTableDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.SceneController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'ok') this.createTable();
        },
        false, this);

    goog.events.listen(goog.dom.getElement('add-new-table'), goog.events.EventType.CLICK,
        /** @this {!app.SceneController} */
        function () {
            this._newTableDialog.setTitle(app.translation['new-table']);
            var buttonsSet = new goog.ui.Dialog.ButtonSet();
            buttonsSet.addButton({key: 'ok', caption: 'Ok'}, true);
            buttonsSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
            this._newTableDialog.setButtonSet(buttonsSet);
            this._newTableDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['table-name'],
                goog.html.SafeHtml.create('input', {'type': 'text', 'id': 'new-table-name', 'name': 'new-table-name'})]
            ));
            this._newTableDialog.setVisible(true);
        },
        false, this);

    // edit table
    goog.events.listen(this._editTableDialog, goog.ui.Dialog.EventType.SELECT,
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

    // add new view
    goog.events.listen(this._newViewDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.SceneController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'ok') this.createView();
        },
        false, this);

    goog.events.listen(goog.dom.getElement('add-new-view'), goog.events.EventType.CLICK,
        /** @this {!app.SceneController} */
        function () {
            this._newViewDialog.setTitle(app.translation['new-view']);
            this._newViewDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['view-name'],
                goog.html.SafeHtml.create('input', {'type': 'text', 'id': 'new-view-name', 'name': 'new-view-name'})]
            ));
            var buttonsSet = new goog.ui.Dialog.ButtonSet();
            buttonsSet.addButton({key: 'ok', caption: 'Ok'}, true);
            buttonsSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
            this._newViewDialog.setButtonSet(buttonsSet);
            this._newViewDialog.setVisible(true);
        },
        false, this);

    // edit view
    goog.events.listen(this._editViewDialog, goog.ui.Dialog.EventType.SELECT,
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

    // set active table
    goog.events.listen(goog.dom.getElement('tables'), goog.events.EventType.CLICK,
        /**
         * @this {!app.SceneController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            if (goog.dom.classlist.contains(/**@type{Element}*/(e.target), 'edit-button')) {
                this._editTableDialog.setTitle(app.translation['edit-table']);
                var buttonSet = new goog.ui.Dialog.ButtonSet();
                buttonSet.addButton({key: 'save', caption: app.translation['save-table']}, true);
                buttonSet.addButton({key: 'remove', caption: app.translation['remove-table']}, true);
                buttonSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
                this._editTableDialog.setButtonSet(buttonSet);
                this._editTableDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['edit-name'],
                    goog.html.SafeHtml.create('input', {
                        'type': 'text',
                        'id': 'edit-table-name',
                        'name': e.target.previousElementSibling.id,
                        'value': e.target.previousElementSibling.innerText
                    })]
                ));
                this._editTableDialog.setVisible(true);
            } else if (!goog.dom.classlist.contains(/**@type{Element}*/(e.target.parentNode), 'active-table')) {
                this.hideComponentControlPanel();
                this.setActiveTable(parseInt(e.target.id.replace('button-table-', ''), 10), /**@type{Element}*/(e.target));
            }
        },
        false, this);

    // set active views
    goog.events.listen(goog.dom.getElement('views'), goog.events.EventType.CLICK,
        /**
         * @this {!app.SceneController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            if (goog.dom.classlist.contains(/**@type{Element}*/(e.target), 'edit-button')) {
                this._editViewDialog.setTitle(app.translation['edit-view']);
                var buttonSet = new goog.ui.Dialog.ButtonSet();
                buttonSet.addButton({key: 'save', caption: app.translation['save-view']}, true);
                buttonSet.addButton({key: 'remove', caption: app.translation['remove-view']}, true);
                buttonSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
                this._editViewDialog.setButtonSet(buttonSet);
                this._editViewDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['edit-name'],
                    goog.html.SafeHtml.create('input', {
                        'type': 'text',
                        'id': 'edit-view-name',
                        'name': e.target.previousElementSibling.id,
                        'value': e.target.previousElementSibling.innerText
                    })]
                ));
                this._editViewDialog.setVisible(true);
            } else {
                var viewID = e.target.id.replace('button-view-', '');
                if (goog.dom.classlist.contains(/**@type{Element}*/(e.target.parentNode), 'active-view')) {
                    this.hideView(viewID, /**@type{Element}*/(e.target.parentNode));
                } else {
                    this.showView(viewID, /**@type{Element}*/(e.target.parentNode));
                }
                this.redrawAll();
            }
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
            var buttonSet = new goog.ui.Dialog.ButtonSet(),
                list = this.getInactiveTablesList(),
                /**@type{!Array<!goog.html.SafeHtml>}*/ options = [];

            this._copyDialog.setTitle(app.translation['copy-title']);
            if (list.length > 0) {
                buttonSet.addButton({key: 'copy', caption: app.translation['copy-btn']}, true);
                buttonSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
                for (var i = 0; i < list.length; i++) {
                    options.push(goog.html.SafeHtml.create('option', {'value': list[i]['id']}, list[i]['name']));
                }
                this._copyDialog.setSafeHtmlContent(goog.html.SafeHtml.create('select', {'id': 'copy-to-table'}, options));
            } else {
                buttonSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
                this._copyDialog.setTextContent(app.translation['copy-no-tables']);
            }
            this._copyDialog.setVisible(true);
        }, false, this);

    goog.events.listen(this._copyDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.SceneController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'ok') {
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

app.SceneController.prototype.createComponentModel = function (type, coordX, coordY) {
    switch (type) {
        case 'MIRROR':
            return new app.model.Mirror(coordX, coordY);
            break;
        case 'LENS':
            return new app.model.Lens(coordX, coordY);
            break;
        case 'HOLO-PLATE':
            return new app.model.HolographicPlate(coordX, coordY);
            break;
        case 'WALL':
            return new app.model.Wall(coordX, coordY);
            break;
        case 'SPLITTER':
            return new app.model.Splitter(coordX, coordY);
            break;
        case 'LIGHT':
            return new app.model.Light(coordX, coordY);
            break;
    }
};

/**
 * @param {!Array<number>} selectedPoint
 * @private
 */
app.SceneController.prototype.addComponent = function (selectedPoint) {
    var model, modelID, coords = this._VIEW_CONTROLLER.reverseTransformPoint(selectedPoint);
    model = this.createComponentModel(this._newComponentType, coords[0], coords[1]);
    modelID = this._tables[this._activeTableID].addComponent(model);
    this.setSelectedComponent(model, modelID);
    this._componentController.showComponentControlPanel(this);
    goog.dom.getElement('add-com-popup').style.visibility = 'hidden';
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

/**
 * @return {!string}
 * @public
 */
app.SceneController.prototype.exportData = function () {
    return goog.json.serialize(this._tables);
};

app.SceneController.prototype._deleteCurrentSimulation = function () {
    var tables, tableButtons, viewButtons, i;
    this._tables = [];

    tables = goog.dom.getElementsByClass('table-wrapper', this._CANVAS_WRAPPER);
    for(i = 0; i < tables.length; i++) {
        goog.dom.removeNode(tables[i]);
    }
    tableButtons = goog.dom.getElementsByClass('button-wrapper', goog.dom.getElement('tables'));
    for(i = 0; i < tableButtons.length; i++) {
        goog.dom.removeNode(tableButtons[i]);
    }
    viewButtons = goog.dom.getElementsByClass('table-buttons', goog.dom.getElement('views'));
    for(i = 0; i < viewButtons.length; i++) {
        goog.dom.removeNode(viewButtons[i]);
    }
};

/**
 * @param {*} dataModel
 * @public
 */
app.SceneController.prototype.importData = function (dataModel) {
    this._tables = [];
    this._deleteCurrentSimulation();

    for (var i = 0; i < dataModel.length; i++) {
        var table = new app.model.Table(dataModel[i]._tableName);
        table.importTable(dataModel[i]);
        this._tables.push(table);
        this._activeTableID = i;
        this.addTableToGUI(i, dataModel[i]._tableName);

        for (var j = 0; j < dataModel[i]._views.length; j++) {
            var view = new app.model.View(dataModel[i]._views[j]._viewName, dataModel[i]._views[j]._appliedTranslationX,
                dataModel[i]._views[j]._appliedTranslationY);

            view.importView(dataModel[i]._views[j]);
            table.addView(view);
            view.setCanvas(this.addViewToGUI(j, dataModel[i]._views[j]._viewName));
        }

        for (var k = 0; k < dataModel[i]._components.length; k++) {
            var component = this.createComponentModel(dataModel[i]._components[k].type,
            dataModel[i]._components[k].appliedTranslationX, dataModel[i]._components[k].appliedTranslationY);
            component.importComponentData(dataModel[i]._components[k]);
            table.addComponent(component);
        }
    }
    this.setActiveTable((i - 1), goog.dom.getElement('button-table-' + (i - 1)));
    this.redrawAll();
};