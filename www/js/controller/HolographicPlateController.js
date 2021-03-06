goog.provide('app.HolographicPlateController');

goog.require('app.ComponentController');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!app.model.HolographicPlate} model
 * @param {!number} modelID
 * @constructor
 * @extends {app.ComponentController}
 * Controller used by app.model.HolographicPlate component. Adds specific controls for this component.
 */
app.HolographicPlateController = function (model, modelID) {
    app.HolographicPlateController.base(this, 'constructor', model, modelID);
};
goog.inherits(app.HolographicPlateController, app.ComponentController);

/**
 * Helper function to report that lights length difference limit was crossed
 * @param {!Array<!number>} errors
 * @param {!goog.ui.Dialog} dialog
 * @private
 */
app.HolographicPlateController.prototype._reportErrors = function (errors, dialog) {
    var rows = [];
    for (var i = 0; i < errors.length; i++) {
        if( errors[i][3] === 'wavelength') {
            rows.push(goog.html.SafeHtml.create('span', {'class': 'ref-err-row'},
                [app.translation['ref-err-sec'], errors[i][0], app.translation['wave-err-src'], errors[i][1],
                    app.translation['wave-err-con'], errors[i][2], app.translation['wave-err-end']]))
        } else {
            rows.push(goog.html.SafeHtml.create('span', {'class': 'ref-err-row'},
                [app.translation['ref-err-sec'], errors[i][0], app.translation['ref-err-src'], errors[i][1], ' vs ', errors[i][2],
                    app.translation['ref-err-ray'], errors[i][3], ' (cm)']))
        }
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

    var args = ['div', {'class': 'input-field', 'id': 'diffraction-maxim'}];
    var selectedMaximum = this.model.getMaxim(), maximum;
    for (var i = -4; i < 4; i++) {
        maximum = (i > -1) ? i + 1 : i;
        args.push(goog.dom.createDom('span', {'class': 'com-left-side'}, '' + maximum));
        if (selectedMaximum.indexOf(maximum) !== -1) {
            args.push(goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                        'type': 'checkbox', 'name': 'checkbox-' + maximum, 'class': 'input-min maxim-checkbox',
                        'id': 'checkbox-' + maximum, 'checked': 'checked'
                    }
                )
            ));
        } else {
            args.push(goog.dom.createDom('span', {'class': 'com-right-side'},
                goog.dom.createDom('input', {
                        'type': 'checkbox', 'name': 'checkbox-' + maximum, 'class': 'input-min maxim-checkbox',
                        'id': 'checkbox-' + maximum
                    }
                )
            ));
        }
    }
    var maxim = goog.dom.createDom.apply(this, args);
    goog.dom.appendChild(this.componentConfigurationPanel, maxim);

    goog.dom.appendChild(this.componentConfigurationPanel,
        goog.dom.createDom('div', {'class': 'buttons-group'},
            goog.dom.createDom('button', {'id': 'com-record-btn'}, app.translation['com-record-btn'])
        )
    );

    this.addPanelListeners(sceneController);
};

/**
 * @override
 */
app.HolographicPlateController.prototype.addPanelListeners = function (sceneController) {
    app.HolographicPlateController.base(this, 'addPanelListeners', sceneController);

    goog.events.listen(goog.dom.getElement('com-height'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.HolographicPlateController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatNoZeroNoNegativeInput(e, this.model.setHeight, this.model);
            sceneController.redrawAll();
        }, true, this);

    goog.events.listen(goog.dom.getElement('com-plate-res'), goog.events.EventType.KEYUP,
        /**
         * @this {!app.HolographicPlateController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            app.ComponentController.validateFloatNoZeroNoNegativeInput(e, this.model.setPlateResolution, this.model);
            sceneController.redrawAll();
        }, true, this);


    var checkboxes = goog.dom.getElementsByClass('maxim-checkbox', goog.dom.getElement('diffraction-maxim'));
    for (var i = 0; i < checkboxes.length; i++) {
        goog.events.listen(checkboxes[i], goog.events.EventType.CHANGE,
            /**
             * @this {!app.HolographicPlateController}
             * @param {!goog.events.BrowserEvent} e
             */
            function (e) {
                var maximum = parseInt(e.currentTarget.id.replace('checkbox-', ''), 10);
                if (!isNaN(maximum)) {
                    if (e.currentTarget.checked) {
                        this.model.addMaximum(maximum);
                    } else {
                        this.model.removeMaximum(maximum);
                    }
                    sceneController.redrawAll();
                }
            }, true, this);
    }

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
            //options.push(goog.html.SafeHtml.create('option', {'value': 'ALL'}, app.translation['pick-all-lights']));

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