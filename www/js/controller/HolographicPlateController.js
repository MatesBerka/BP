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
    /**
     * @type {!goog.ui.Dialog}
     * @private
     */
    this._pickRefLightDialog = new goog.ui.Dialog();

    this._errorsDialog = new goog.ui.Dialog();
};
goog.inherits(app.HolographicPlateController, app.ComponentController);

/**
 * @param {!Array<!number>} errors
 * @private
 */
app.HolographicPlateController.prototype._reportErrors = function(errors) {
    var rows = [];
    for(var i = 0; i < errors.length; i++) {
        rows.push(goog.html.SafeHtml.create('span', {'class': 'ref-err-row'},
        [app.translation['ref-err-sec'], errors[i][0], app.translation['ref-err-src'], errors[i][1], app.translation['ref-err-ray'], errors[i][2]]))
    }

    // create dialog
    this._errorsDialog.setTitle(app.translation['hol-rec-err']);
    var buttonsSet = new goog.ui.Dialog.ButtonSet();
    buttonsSet.addButton({key: 'ok', caption: 'Ok'}, false, true);
    this._errorsDialog.setButtonSet(buttonsSet);
    this._errorsDialog.setSafeHtmlContent(goog.html.SafeHtml.create('div', {},
        [goog.html.SafeHtml.create('label', {'id': 'ref-err-label'}, app.translation['ref-errors']),
         goog.html.SafeHtml.create('div', {'id': 'ref-err-wrapper'}, rows)]
    ));
    this._errorsDialog.setVisible(true);
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
        goog.dom.createDom('div', {'class': 'input-field'},
            goog.dom.createDom('span', {'class': 'com-left-side'}, app.translation["com-plate-tolerance"]),
            goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                    'type': 'text', 'name': 'com-plate-tol', 'class': 'input-min', 'id': 'com-plate-tol',
                    'value': this.model.getTolerance()
                })
            )
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
            app.ComponentController.validateFloatInput(e, this.model.setHeight, this.model);
            sceneController.redrawAll();
        }, true, this);

    goog.events.listen(goog.dom.getElement('com-plate-res'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.HolographicPlateController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatInput(e, this.model.setPlateResolution, this.model);
            sceneController.redrawAll();
        }, true, this);

    goog.events.listen(goog.dom.getElement('com-plate-tol'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.HolographicPlateController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatInput(e, this.model.setTolerance, this.model);
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
            this._pickRefLightDialog.setTitle(app.translation['pick-ref-light']);
            var buttonsSet = new goog.ui.Dialog.ButtonSet();
                buttonsSet.addButton({key: 'pick', caption: app.translation['pick-light']}, true);
                buttonsSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
            this._pickRefLightDialog.setButtonSet(buttonsSet);
            this._pickRefLightDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['ref-light'],
                goog.html.SafeHtml.create('select', {'id': 'select-ref-light'}, options)]
            ));
            this._pickRefLightDialog.setVisible(true);
        }, true, this);

    goog.events.listen(this._pickRefLightDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.HolographicPlateController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'pick') {
                var selectedLightID = goog.dom.getElement('select-ref-light').value;
                var errors = this.model.createRecord(selectedLightID);
                console.log(errors);
                if(errors.length > 0) {
                    this._reportErrors(errors);
                }
                this.model.showRecord();
                sceneController.redrawAll();
            }
        }, false, this);
};