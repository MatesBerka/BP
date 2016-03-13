goog.provide('app.HolographicPlateController');

goog.require('app.ComponentController');

/**
 * @param {!app.model.HolographicPlate} model
 * @param {!number} modelID
 * @constructor
 * @extends {app.ComponentController}
 */
app.HolographicPlateController = function (model, modelID) {
    app.HolographicPlateController.base(this, 'constructor');
    /**
     * Points to currently selected component model
     * @type {app.model.HolographicPlate}
     * @override
     */
    this.model = model;
    /**
     * @override
     */
    this.modelID = modelID;
};
goog.inherits(app.HolographicPlateController, app.ComponentController);

/**
 * @param {!Array<!number>} errors
 * @param {!goog.ui.Dialog} dialog
 * @private
 */
app.HolographicPlateController.prototype._reportErrors = function (errors, dialog) {
    var rows = [];
    for (var i = 0; i < errors.length; i++) {
        rows.push(goog.html.SafeHtml.create('span', {'class': 'ref-err-row'},
            [app.translation['ref-err-sec'], errors[i][0], app.translation['ref-err-src'], errors[i][1], ' vs ', errors[i][2],
                app.translation['ref-err-ray'], errors[i][3], ' (CM)']))
    }

    // create dialog
    dialog.setTitle(app.translation['hol-rec-err']);
    var buttonsSet = new goog.ui.Dialog.ButtonSet();
    buttonsSet.addButton({key: 'ok', caption: 'Ok'}, false, true);
    dialog.setButtonSet(buttonsSet);
    dialog.setSafeHtmlContent(goog.html.SafeHtml.create('div', {},
        [goog.html.SafeHtml.create('label', {'id': 'ref-err-label'}, app.translation['ref-errors']),
            goog.html.SafeHtml.create('div', {'id': 'ref-err-wrapper'}, rows)]
    ));
    dialog.setVisible(true);
};

/**
 * @override
 * @param sceneController
 */
app.HolographicPlateController.prototype.showComponentControlPanel = function (sceneController) {
    app.HolographicPlateController.base(this, 'showComponentControlPanel', sceneController);

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {
                'class': 'com-left-side',
                'id': 'com-height-title'
            }, app.translation['com-height-title']),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-height', 'class': 'input-min', 'id': 'com-height',
                    'value': this.model.getHeight()
                })
            )
        )
    );

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-position'}, app.translation["com-plate-settings"])
    );
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, app.translation["com-plate-resolution"]),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-plate-res', 'class': 'input-min', 'id': 'com-plate-res',
                    'value': this.model.getPlateResolution()
                })
            )
        )
    );

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('label', {'id': 'com-position'}, app.translation["com-plate-max-title"])
    );
    var args = ['select', {'id': 'com-plate-max-select'}];
    var selectedMaximum = this.model.getMaximum(), maximum;
    for (var i = -4; i < 4; i++) {
        maximum = (i > -1) ? i + 1 : i;
        if (selectedMaximum === maximum) {
            args.push(goog.dom.createDom('option', {'value': maximum, 'selected': 'selected'}, '' + maximum));
        } else {
            args.push(goog.dom.createDom('option', {'value': maximum}, '' + maximum));
        }
    }
    var select = goog.dom.createDom.apply(this, args);
    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, app.translation["com-plate-max"]),
            goog.dom.createDom('span', {'class': 'com-right-side'}, select)
        )
    );

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'buttons-group'},
            goog.dom.createDom('button', {'id': 'com-record-btn'}, app.translation['com-record-btn'])
        )
    );

    this.addPanelListeners(sceneController);
};

/**
 * @override
 * @param sceneController
 */
app.HolographicPlateController.prototype.addPanelListeners = function (sceneController) {
    app.HolographicPlateController.base(this, 'addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-height'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.HolographicPlateController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatNoZeroInput(e, this.model.setHeight, this.model);
            sceneController.redrawAll();
        }, true, this);

    goog.events.listen(goog.dom.getElement('com-plate-res'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.HolographicPlateController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatNoZeroInput(e, this.model.setPlateResolution, this.model);
            sceneController.redrawAll();
        }, true, this);

    goog.events.listen(goog.dom.getElement('com-plate-max-select'), goog.events.EventType.CHANGE,
        /**
         * @this {!app.HolographicPlateController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateIntNoZeroInput(e, this.model.setMaximum, this.model);
            sceneController.redrawAll();
        }, true, this);

    goog.events.listen(goog.dom.getElement('com-record-btn'), goog.events.EventType.CLICK,
        /**
         * @this {!app.HolographicPlateController}
         */
        function () {
            this.model.collectRays();
            sceneController.redrawAll();

            var options = [];
            var sources = this.model.getCollectedLightSources();
            for (var i = 0; i < sources.length; i++) {
                options.push(goog.html.SafeHtml.create('option', {'value': sources[i]}, sources[i]));
            }
            options.push(goog.html.SafeHtml.create('option', {'value': 'ALL'}, app.translation['pick-all-lights']));

            // create dialog
            sceneController.pickRefLightDialog.setTitle(app.translation['pick-ref-light']);
            var buttonsSet = new goog.ui.Dialog.ButtonSet();
            buttonsSet.addButton({key: 'pick', caption: app.translation['pick-light']}, true);
            buttonsSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
            sceneController.pickRefLightDialog.setButtonSet(buttonsSet);
            sceneController.pickRefLightDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['ref-light'],
                goog.html.SafeHtml.create('select', {'id': 'select-ref-light'}, options)]
            ));
            sceneController.pickRefLightDialog.setVisible(true);
        }, true, this);

    goog.events.removeAll(sceneController.pickRefLightDialog, goog.ui.Dialog.EventType.SELECT);
    goog.events.listen(sceneController.pickRefLightDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.HolographicPlateController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'pick') {
                var selectedLightID = goog.dom.getElement('select-ref-light').value;
                var errors = this.model.createRecord(selectedLightID);
                if (errors.length > 0) {
                    this._reportErrors(errors, sceneController.errorsDialog);
                }
                this.model.showRecord();
                sceneController.redrawAll();
            }
        }, false, this);
};